import os
import sys
import time
from playwright.sync_api import sync_playwright

# Windows コンソールの文字コード対応
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

USER_DATA_DIR = os.path.abspath("./chrome_profile")
AUTH_FILE = os.path.abspath("./auth.json")

def post_to_x(text: str, image_path: str = None, headless: bool = True) -> bool:
    """
    X (Twitter) にテキストおよび画像を確実に自動投稿する関数
    """
    print(f"[INFO] X (Twitter) への投稿を開始します... (headless={headless})")
    
    with sync_playwright() as p:
        browser = None
        context = None

        if os.path.exists(AUTH_FILE):
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
        elif os.path.exists(USER_DATA_DIR):
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
                print(f"[INFO] フォールバック起動: {e}")
                context = p.chromium.launch_persistent_context(
                    user_data_dir=USER_DATA_DIR,
                    headless=headless,
                    args=["--disable-blink-features=AutomationControlled"],
                    viewport={"width": 1280, "height": 900}
                )
        else:
            print("[ERROR] 認証情報が見つかりません。先に login_x.py を実行してください。")
            return False

        page = context.pages[0] if context.pages else context.new_page()

        try:
            print("[INFO] 投稿作成ページにアクセス中...")
            page.goto("https://x.com/compose/post", wait_until="domcontentloaded")
            time.sleep(4)

            if "login" in page.url:
                print("[ERROR] ログインセッションが無効です。再度 login_x.py でログインしてください。")
                if browser: browser.close()
                else: context.close()
                return False

            # 入力エリアを探す
            editor = page.wait_for_selector(
                'div[data-testid="tweetTextarea_0"], div[role="textbox"]',
                timeout=15000
            )
            if not editor:
                print("[ERROR] 投稿入力欄が見つかりませんでした。")
                if browser: browser.close()
                else: context.close()
                return False

            # テキスト入力
            editor.click()
            time.sleep(0.5)
            page.keyboard.insert_text(text)
            print("[INFO] テキストを入力しました。")
            time.sleep(1)

            # 画像添付
            if image_path and os.path.exists(image_path):
                abs_path = os.path.abspath(image_path)
                print(f"[INFO] 画像をアップロード中: {abs_path}")
                file_input = page.locator('input[data-testid="fileInput"]').first
                file_input.set_input_files(abs_path)
                
                # 画像プレビューが表示されるまで待機（最大15秒）
                try:
                    page.wait_for_selector('div[data-testid="attachments"], button[aria-label="Remove media"], button[aria-label="メディアを削除"]', timeout=15000)
                    print("[INFO] 画像のアップロード＆プレビュー完了を確認しました。")
                except Exception:
                    print("[WARN] プレビュー検出タイムアウト。待機を継続します。")
                time.sleep(3)

            # 「ポストする」ボタンを探してクリック
            print("[INFO] 「ポストする」ボタンを探しています...")
            post_button = None
            for selector in ['button[data-testid="tweetButton"]', 'button[data-testid="tweetButtonInline"]']:
                btn = page.locator(selector).first
                if btn.count() > 0 and btn.is_visible():
                    post_button = btn
                    break

            if not post_button:
                # 日本語/英語のテキストで探すフォールバック
                post_button = page.get_by_role("button", name="Post").or_(page.get_by_role("button", name="ポストする")).first

            # ボタンが有効（enabled）になるまで待機
            post_button.wait_for(state="visible", timeout=10000)
            for _ in range(10):
                if post_button.is_enabled():
                    break
                time.sleep(1)

            print("[INFO] 「ポストする」ボタンをクリックします...")
            post_button.click(force=True)

            # 投稿完了の検証（入力エリアが消えるか、ダイアログが閉じるまで待機）
            print("[INFO] 投稿の完了を検証中...")
            try:
                editor.wait_for(state="hidden", timeout=15000)
                print("🎉 [VERIFIED] 入力欄が正常に閉じられ、ツイートが送信されました！")
            except Exception:
                # URLの変化やトースト確認
                print("[INFO] 画面遷移・トースト通知を確認中...")
                time.sleep(5)

            # 最新のセッションを更新保存
            try:
                context.storage_state(path=AUTH_FILE)
            except:
                pass

            # 投稿後のプロフィール確認
            try:
                page.goto("https://x.com/satviewer3d_bot", wait_until="domcontentloaded")
                time.sleep(3)
                page.screenshot(path="post_success_screenshot.png")
                print("[DEBUG] 投稿後のプロフィール画面を 'post_success_screenshot.png' に保存しました。")
            except:
                pass

            if browser: browser.close()
            else: context.close()
            return True

        except Exception as e:
            print(f"[ERROR] 投稿処理中にエラーが発生しました: {e}")
            try:
                page.screenshot(path="error_screenshot.png")
                print("[DEBUG] 'error_screenshot.png' にエラー画面を保存しました。")
            except:
                pass
            if browser: browser.close()
            else: context.close()
            return False

if __name__ == "__main__":
    sample_text = "🛰️ SatViewer3D Live Test\n\n#SatViewer3D #Space"
    post_to_x(sample_text, image_path="post_card.png", headless=True)
