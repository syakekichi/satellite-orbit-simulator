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
    X (Twitter) にテキストおよび画像を自動投稿する関数
    - auth.json がある場合: クラウド（GitHub Actions）および標準Playwrightセッションを使用
    - chrome_profile がある場合: ローカルの永続Chromeプロファイルを使用
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
                    "--disable-setuid-sandbox"
                ]
            )
            context = browser.new_context(
                storage_state=AUTH_FILE,
                viewport={"width": 1280, "height": 800},
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
                    viewport={"width": 1280, "height": 800}
                )
            except Exception as e:
                print(f"[INFO] フォールバック起動: {e}")
                context = p.chromium.launch_persistent_context(
                    user_data_dir=USER_DATA_DIR,
                    headless=headless,
                    args=["--disable-blink-features=AutomationControlled"],
                    viewport={"width": 1280, "height": 800}
                )
        else:
            print("[ERROR] 認証情報が見つかりません。先に login_x.py を実行してください。")
            return False

        page = context.pages[0] if context.pages else context.new_page()

        try:
            print("[INFO] 投稿ページにアクセス中...")
            page.goto("https://x.com/compose/post", wait_until="domcontentloaded")
            time.sleep(3)

            if "login" in page.url:
                print("[ERROR] ログインセッションが無効です。再度 login_x.py でログインしてください。")
                if browser: browser.close()
                else: context.close()
                return False

            editor = page.wait_for_selector(
                'div[data-testid="tweetTextarea_0"], div[role="textbox"]',
                timeout=15000
            )
            if not editor:
                print("[ERROR] 投稿入力欄が見つかりませんでした。")
                if browser: browser.close()
                else: context.close()
                return False

            editor.click()
            time.sleep(0.5)
            page.keyboard.insert_text(text)
            print("[INFO] テキストを入力しました。")
            time.sleep(1)

            if image_path and os.path.exists(image_path):
                abs_path = os.path.abspath(image_path)
                print(f"[INFO] 画像をアップロード中: {abs_path}")
                file_input = page.locator('input[data-testid="fileInput"]').first
                file_input.set_input_files(abs_path)
                time.sleep(4)
                print("[INFO] 画像の添付が完了しました。")

            print("[INFO] ポストを送信中...")
            editor.focus()
            time.sleep(0.5)
            page.keyboard.press("Control+Enter")
            time.sleep(5)

            try:
                post_btn = page.locator('button[data-testid="tweetButton"]').first
                if post_btn.is_visible() and post_btn.is_enabled():
                    post_btn.click(force=True)
                    time.sleep(4)
            except:
                pass

            print("🎉 [SUCCESS] X (Twitter) への自動投稿が完了しました！")
            
            # セッションの最新化
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
                print("[DEBUG] 'error_screenshot.png' にエラー画面を保存しました。")
            except:
                pass
            if browser: browser.close()
            else: context.close()
            return False

if __name__ == "__main__":
    sample_text = "🛰️ SatViewer3D Bot テスト投稿\n\n#SatViewer3D #Space"
    post_to_x(sample_text, image_path="icon_3d.jpg", headless=True)
