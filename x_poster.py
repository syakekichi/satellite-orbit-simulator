import os
import sys
import time
import json
from dotenv import load_dotenv

# Windows コンソールの文字コード対応
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

load_dotenv()

USER_DATA_DIR = os.path.abspath("./chrome_profile")
AUTH_FILE = os.path.abspath("./auth.json")

def calc_x_text_weight(text: str) -> int:
    """X の文字数カウント仕様に準拠した重み計算（全角2, 半角1, URL23, 上限280）"""
    import re, unicodedata
    clean = re.sub(r'https?://\S+', 'U' * 23, text)
    w = 0
    for ch in clean:
        if unicodedata.east_asian_width(ch) in ('F', 'W') or ord(ch) > 0x1000:
            w += 2
        else:
            w += 1
    return w

def fit_text_to_x_limit(text: str, max_weight: int = 276) -> str:
    """文字数制限（280重み）を超える場合に、安全に調整"""
    if calc_x_text_weight(text) <= max_weight:
        return text

    lines = text.split('\n')
    while lines and calc_x_text_weight('\n'.join(lines)) > max_weight:
        removed = False
        for idx in range(len(lines) - 1, -1, -1):
            line = lines[idx].strip()
            if not line.startswith('http') and not line.startswith('#') and len(line) > 0:
                if len(line) > 10:
                    lines[idx] = line[:-8] + '…'
                else:
                    lines.pop(idx)
                removed = True
                break
        if not removed:
            lines.pop()

    return '\n'.join(lines)

def post_via_api(text: str, image_path: str = None) -> bool:
    """X 公式 API (Free Tier / v2 + v1.1 Media) を使用して投稿"""
    api_key = os.getenv("X_API_KEY")
    api_secret = os.getenv("X_API_SECRET")
    access_token = os.getenv("X_ACCESS_TOKEN")
    access_token_secret = os.getenv("X_ACCESS_TOKEN_SECRET")

    if not (api_key and api_secret and access_token and access_token_secret):
        return False

    try:
        import tweepy
        print("[INFO] 🔑 X 公式 API (Tweepy) を使用して投稿します...")

        # 1. 画像アップロード (v1.1 API)
        media_ids = []
        if image_path and os.path.exists(image_path):
            abs_image = os.path.abspath(image_path)
            print(f"[INFO] 画像をAPI経由でアップロード中: {abs_image}")
            auth = tweepy.OAuth1UserHandler(api_key, api_secret, access_token, access_token_secret)
            api_v1 = tweepy.API(auth)
            media = api_v1.media_upload(abs_image)
            media_ids.append(media.media_id)
            print(f"[INFO] 画像アップロード完了 (Media ID: {media.media_id})")

        # 2. ツイート投稿 (v2 API)
        client = tweepy.Client(
            consumer_key=api_key,
            consumer_secret=api_secret,
            access_token=access_token,
            access_token_secret=access_token_secret
        )

        if media_ids:
            response = client.create_tweet(text=text, media_ids=media_ids)
        else:
            response = client.create_tweet(text=text)

        tweet_id = response.data.get("id")
        print(f"🎉 [API VERIFIED] 投稿が正常に送信されました！ Tweet ID: {tweet_id}")
        return True

    except Exception as e:
        print(f"❌ [API ERROR] 公式APIでの投稿に失敗しました: {e}")
        return False

def dismiss_modals(page, context=None):
    """ポップアップ・ダイアログ・Graduated Access確認（OKボタン）を即座に消去・承諾"""
    for _ in range(2):
        try:
            # 投稿フォーム（tweetTextarea_0）を含むダイアログのボタンは絶対にクリックしない
            # （div[role="dialog"] button だとツールバーのGIFボタン等を押して海外ミームが添付されてしまうため）
            modals = page.locator(
                'div[role="alertdialog"] button, '
                'div[data-testid="confirmationSheetDialog"] button, '
                'div[role="dialog"]:not(:has([data-testid="tweetTextarea_0"])) button:has-text("OK"), '
                'div[role="dialog"]:not(:has([data-testid="tweetTextarea_0"])) button:has-text("了解"), '
                'div[role="dialog"]:not(:has([data-testid="tweetTextarea_0"])) button:has-text("Got it"), '
                'div[role="dialog"]:not(:has([data-testid="tweetTextarea_0"])) button:has-text("閉じる"), '
                'button[data-testid="confirmationSheetConfirm"]'
            )
            if modals.count() > 0:
                for i in range(modals.count()):
                    b = modals.nth(i)
                    if b.is_visible():
                        b.click(force=True)
                        time.sleep(0.5)
        except Exception:
            pass

def post_via_browser(text: str, image_path: str = None, headless: bool = True) -> bool:
    """Playwright によるブラウザ自動操作投稿 (フォールバック)"""
    print(f"[INFO] ブラウザ自動操作 (Playwright) による投稿を開始します... (headless={headless})")
    
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = None
        context = None

        if os.path.exists(USER_DATA_DIR):
            print(f"[INFO] '{USER_DATA_DIR}' を使用してChromeプロファイルを起動します（ローカルモード）")
            try:
                context = p.chromium.launch_persistent_context(
                    user_data_dir=USER_DATA_DIR,
                    channel="chrome",
                    headless=headless,
                    args=["--disable-blink-features=AutomationControlled"],
                    viewport={"width": 1280, "height": 900}
                )
            except Exception as e:
                print(f"[WARN] Chromeプロファイルの起動に失敗したため、Chromiumで起動します: {e}")
                browser = p.chromium.launch(
                    headless=headless,
                    args=["--disable-blink-features=AutomationControlled", "--no-sandbox"]
                )
                if os.path.exists(AUTH_FILE):
                    context = browser.new_context(storage_state=AUTH_FILE, viewport={"width": 1280, "height": 900})
                else:
                    context = browser.new_context(viewport={"width": 1280, "height": 900})
        elif os.path.exists(AUTH_FILE):
            print(f"[INFO] '{AUTH_FILE}' を使用してセッションを復元します（クラウド・汎用モード）")
            # auth.json が空または不正な形式でないか事前検証
            try:
                with open(AUTH_FILE, "r", encoding="utf-8") as f:
                    auth_content = f.read().strip()
                if not auth_content:
                    raise ValueError("ファイルの内容が空です")
                parsed_state = json.loads(auth_content)
                if not isinstance(parsed_state, dict):
                    raise ValueError("JSONオブジェクト形式ではありません")
            except Exception as e:
                print(f"❌ [ERROR] '{AUTH_FILE}' の形式が不正です: {e}")
                print("⚠️ 原因: GitHub Secrets の X_AUTH_JSON に、auth.json のファイル名やパスではなく【ファイルの中身全体（JSONテキスト）】が登録されているか確認してください。")
                return False

            browser = p.chromium.launch(
                headless=headless,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage"
                ]
            )
            context = browser.new_context(
                storage_state=AUTH_FILE,
                viewport={"width": 1280, "height": 900},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            )
        else:
            print("[ERROR] ログインセッション (chrome_profile または auth.json) が見つかりません。")
            return False

        page = context.pages[0] if context.pages else context.new_page()

        try:
            print("[INFO] Xの新規ポスト作成画面を開きます (compose/post)...")
            nav_success = False
            for attempt in range(1, 4):
                try:
                    page.goto("https://x.com/compose/post", wait_until="domcontentloaded", timeout=45000)
                    nav_success = True
                    break
                except Exception as net_err:
                    print(f"[WARN] ページ遷移に失敗 (試行 {attempt}/3: {net_err})")
                    if attempt < 3:
                        print("[INFO] ネットワーク復帰を待機中 (6秒後に再試行)...")
                        time.sleep(6)
            if not nav_success:
                raise Exception("Xの新規ポスト画面 (compose/post) へのアクセスがタイムアウトしました。")

            time.sleep(4)
            dismiss_modals(page, context)

            current_url = page.url
            print(f"[INFO] 現在のURL: {current_url}")
            if "login" in current_url or "i/flow/login" in current_url:
                print("❌ [ERROR] Xへのログインセッションが無効です（ログイン画面にリダイレクトされました）。")
                page.screenshot(path="login_error.png")
                if browser: browser.close()
                else: context.close()
                return False

            if "account/access" in current_url or "challenge" in current_url or "checkpoint" in current_url or "suspended" in current_url:
                print(f"❌ [ACCOUNT RESTRICTED] Xのアカウント確認・一時制限画面にリダイレクトされました: {current_url}")
                print("⚠️ 原因: Bot検知（CAPTCHA認証）、電話番号/メール認証、利用規約同意、またはアカウントロックの可能性があります。")
                print("👉 対処法: 通常のPCブラウザ等で該当アカウントに手動ログインし、認証・確認を完了させてから auth.json を再生成してください。")
                try:
                    page.screenshot(path="account_access_error.png")
                except:
                    pass
                if browser: browser.close()
                else: context.close()
                return False

            # 未ログイン状態（セッション無効・失効）の検知
            # 未ログイン状態で compose/post にアクセスすると、Xはログイン画面やお勧めアカウント/トレンド画面等にリダイレクトします
            login_btn = page.locator('[data-testid="loginButton"], a[href="/login"], [data-testid="signupButton"]')
            if (login_btn.count() > 0 and login_btn.first.is_visible()) or ("compose/post" not in current_url and "home" not in current_url):
                print(f"❌ [NOT LOGGED IN] Xのセッション（auth.json）が無効または期限切れです。")
                print(f"    (未ログインまたは別画面へリダイレクトされました: {current_url})")
                print("👉 対処法: 通常のブラウザでアカウントに手動ログインできるか（制限等がかかっていないか）確認し、auth.json を再生成して GitHub Secrets を更新してください。")
                try:
                    page.screenshot(path="login_error.png")
                except:
                    pass
                if browser: browser.close()
                else: context.close()
                return False

            # 新規投稿モーダル内のエディタを取得
            print("[INFO] 新規投稿欄を取得してテキストを入力します...")
            editor = page.locator('div[role="dialog"] div[data-testid="tweetTextarea_0"], div[data-testid="tweetTextarea_0"]').first
            editor.wait_for(state="visible", timeout=12000)

            # テキストを確実に直接入力
            editor.click(force=True)
            time.sleep(0.5)
            editor.fill(text)
            print("[INFO] テキストを入力しました。")
            time.sleep(1)

            # 既存の意図しない添付メディア（古いドラフトや誤添付）があれば削除
            try:
                remove_btns = page.locator('button[aria-label="メディアを削除"], button[aria-label="メディアを消去"], button[aria-label="Remove media"], button[aria-label="閉じる"][data-testid="remove-attachment"]')
                if remove_btns.count() > 0:
                    for i in range(remove_btns.count()):
                        remove_btns.nth(i).click(force=True)
                        time.sleep(0.3)
            except Exception:
                pass

            # 画像添付
            if image_path and os.path.exists(image_path):
                abs_path = os.path.abspath(image_path)
                print(f"[INFO] 画像をアップロード中: {abs_path}")
                file_input = page.locator('div[role="dialog"] input[data-testid="fileInput"], input[data-testid="fileInput"]').first
                file_input.set_input_files(abs_path)
                time.sleep(5)
                print("[INFO] 画像アップロード待機完了。")

            # 画像アップロード後の安定待機
            time.sleep(2)

            # 送信直前スクリーンショット
            try:
                page.screenshot(path="before_click_post.png")
            except:
                pass

            # 送信の実行 (キーボードショートカット Control+Enter 最優先 + ダイアログ消失の厳格検証)
            print("[INFO] ポスト送信を実行中...")
            try:
                editor.focus()
                time.sleep(0.5)
                page.keyboard.press("Control+Enter")
                print("[INFO] Control+Enter によるショートカット送信を実行しました。")
            except Exception as e:
                print(f"[WARN] editor.focus / shortcut error: {e}")

            # ダイアログ内の送信ボタンも補助クリック
            dialog_btn = page.locator('div[role="dialog"] button[data-testid="tweetButton"]').first
            try:
                if dialog_btn.is_visible(timeout=3000) and dialog_btn.is_enabled():
                    dialog_btn.click(timeout=3000)
                    print("[INFO] ダイアログ内送信ボタンをクリックしました。")
            except:
                pass

            # ダイアログが消える（送信完了）まで最大12秒待機
            dialog_detached = False
            try:
                page.wait_for_selector('div[role="dialog"]', state='detached', timeout=12000)
                dialog_detached = True
                print("🎉 [VERIFIED] 投稿ダイアログの消失（送信完了）を確認しました！")
            except Exception:
                print("[WARN] 初回送信でダイアログが閉じませんでした。再試行します...")
                try:
                    editor.focus()
                    page.keyboard.press("Control+Enter")
                    time.sleep(1)
                    if dialog_btn.is_visible() and dialog_btn.is_enabled():
                        dialog_btn.click(force=True, timeout=3000)
                    page.wait_for_selector('div[role="dialog"]', state='detached', timeout=8000)
                    dialog_detached = True
                    print("🎉 [VERIFIED] 再試行により投稿ダイアログの消失（送信完了）を確認しました！")
                except Exception as e2:
                    print(f"❌ [WARN] ダイアログがまだ表示されています: {e2}")

            # 送信後スクリーンショット
            try:
                page.screenshot(path="after_click_post.png")
            except:
                pass

            # エラーバナーの検知
            error_toast = page.locator('div[data-testid="toast"], [role="alert"]').first
            if error_toast.is_visible():
                err_text = error_toast.inner_text()
                print(f"[WARN] Xから通知/警告メッセージ: {err_text}")
                if "問題が発生" in err_text or "制限" in err_text:
                    print(f"❌ [POST BLOCKED] X側のレートリミット等により送信がブロックされました。")
                    if browser: browser.close()
                    else: context.close()
                    return False

            if not dialog_detached:
                print("❌ [POST FAILED] 投稿ダイアログが閉じないため、投稿に失敗したと判定します。")
                if browser: browser.close()
                else: context.close()
                return False

            print("🎉 [VERIFIED] 投稿が正常に送信されました！")
            try:
                context.storage_state(path=AUTH_FILE)
            except:
                pass

            if browser: browser.close()
            else: context.close()
            return True

        except Exception as e:
            print(f"[ERROR] 投稿処理中にエラーが発生しました: {e}")
            try:
                page.screenshot(path="error_screenshot.png")
            except:
                pass
            if browser: browser.close()
            else: context.close()
            return False

def post_to_x(text: str, image_path: str = None, headless: bool = True) -> bool:
    """
    Xへの投稿統合関数:
    1. X 公式 API (API Key) が設定されていれば API で即座・確実に投稿
    2. API キーが無い場合やエラー時はブラウザ自動操作でフォールバック
    """
    text = fit_text_to_x_limit(text)
    if os.getenv("X_API_KEY") and os.getenv("X_ACCESS_TOKEN"):
        success = post_via_api(text, image_path)
        if success:
            return True
        print("[WARN] APIでの投稿に失敗したため、ブラウザ操作に切り替えます...")

    return post_via_browser(text, image_path, headless=headless)

if __name__ == "__main__":
    post_to_x("🛰️ Test SatViewer3D", image_path="post_card.png", headless=True)
