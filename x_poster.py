import os
import sys
import time
from dotenv import load_dotenv

# Windows コンソールの文字コード対応
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

load_dotenv()

USER_DATA_DIR = os.path.abspath("./chrome_profile")
AUTH_FILE = os.path.abspath("./auth.json")

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
    for _ in range(4):
        try:
            modals = page.locator('button:has-text("OK"), button:has-text("了解"), button:has-text("Got it"), button:has-text("閉じる"), button:has-text("破棄"), button[data-testid="confirmationSheetConfirm"], div[role="dialog"] button, button[aria-label="Close"], button[aria-label="閉じる"]')
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
            print("[INFO] Xのホームを開きます...")
            page.goto("https://x.com/home", wait_until="domcontentloaded")
            time.sleep(5)
            dismiss_modals(page, context)

            current_url = page.url
            print(f"[INFO] 現在のURL: {current_url}")
            if "login" in current_url or "i/flow/login" in current_url:
                print("❌ [ERROR] Xへのログインセッションが無効です（ログイン画面にリダイレクトされました）。")
                page.screenshot(path="login_error.png")
                if browser: browser.close()
                else: context.close()
                return False

            # ホーム画面の投稿入力欄を取得
            print("[INFO] 投稿欄をクリックしてテキストを入力します...")
            editor = page.locator('div[data-testid="tweetTextarea_0"]').first
            try:
                editor.wait_for(state="visible", timeout=10000)
            except Exception:
                compose_link = page.locator('a[data-testid="SideNav_NewTweet_Button"], a[href="/compose/post"]').first
                if compose_link.is_visible():
                    compose_link.click(force=True)
                    time.sleep(2)
                    editor = page.locator('div[data-testid="tweetTextarea_0"]').first

            # テキストを確実に直接入力
            editor.click(force=True)
            time.sleep(0.5)
            editor.fill(text)
            print("[INFO] テキストを入力しました。")
            time.sleep(1)

            # 画像添付
            if image_path and os.path.exists(image_path):
                abs_path = os.path.abspath(image_path)
                print(f"[INFO] 画像をアップロード中: {abs_path}")
                file_input = page.locator('input[data-testid="fileInput"]').first
                file_input.set_input_files(abs_path)
                time.sleep(5)
                print("[INFO] 画像アップロード待機完了。")

            dismiss_modals(page, context)
            time.sleep(1)

            # 送信直前スクリーンショット
            try:
                page.screenshot(path="before_click_post.png")
            except:
                pass

            # 送信の実行 (Control+Enter を直接エディタに送信)
            print("[INFO] ポスト送信を実行中...")
            editor.focus()
            time.sleep(0.5)
            editor.press("Control+Enter")

            print("[INFO] 送信完了を待機・ダイアログ処理中...")
            time.sleep(4)
            dismiss_modals(page, context)
            time.sleep(2)
            dismiss_modals(page, context)

            # 送信後スクリーンショット
            try:
                page.screenshot(path="after_click_post.png")
            except:
                pass

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
    if os.getenv("X_API_KEY") and os.getenv("X_ACCESS_TOKEN"):
        success = post_via_api(text, image_path)
        if success:
            return True
        print("[WARN] APIでの投稿に失敗したため、ブラウザ操作に切り替えます...")

    return post_via_browser(text, image_path, headless=headless)

if __name__ == "__main__":
    post_to_x("🛰️ Test SatViewer3D", image_path="post_card.png", headless=True)
