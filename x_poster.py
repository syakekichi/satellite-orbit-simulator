import os
import sys
import time
from playwright.sync_api import sync_playwright

# Windows コンソールの文字コード対応
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

USER_DATA_DIR = os.path.abspath("./chrome_profile")
AUTH_FILE = os.path.abspath("./auth.json")

def dismiss_modals(page, context):
    """ポップアップ・ダイアログ・Graduated Access確認を即座に消去・承諾"""
    for _ in range(4):
        try:
            page.keyboard.press("Escape")
            time.sleep(0.3)
            btns = page.locator('button:has-text("OK"), button:has-text("了解"), button:has-text("Got it"), button:has-text("閉じる"), button[aria-label="Close"], button[aria-label="閉じる"]')
            if btns.count() > 0:
                for i in range(btns.count()):
                    b = btns.nth(i)
                    if b.is_visible():
                        b.click(force=True)
                        time.sleep(0.5)
        except Exception:
            pass

def post_to_x(text: str, image_path: str = None, headless: bool = True) -> bool:
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
                print(f"[WARN] Chromeプロファイルの起動に失敗したため、Chromiumで起動します: {e}")
                browser = p.chromium.launch(headless=headless)
                context = browser.new_context(viewport={"width": 1280, "height": 900})
        else:
            print("[ERROR] ログインセッション (auth.json または chrome_profile) が見つかりません。")
            return False

        page = context.pages[0] if context.pages else context.new_page()

        try:
            print("[INFO] Xのホームを開きます...")
            page.goto("https://x.com/home", wait_until="domcontentloaded")
            time.sleep(4)
            dismiss_modals(page, context)

            # ホーム画面の「いまどうしてる？」またはエディタをクリック
            print("[INFO] 投稿欄をクリックしてアクティブ化します...")
            target = page.locator('div[data-testid="tweetTextarea_0"], div[role="textbox"], div:has-text("いまどうしてる？"), div:has-text("What is happening?!")').first
            target.click(force=True)
            time.sleep(1)

            # テキスト入力
            page.keyboard.insert_text(text)
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

            # 送信ボタンのクリック
            print("[INFO] ポスト送信を実行中...")
            post_btn = page.locator('button[data-testid="tweetButtonInline"], button[data-testid="tweetButton"]').first
            if post_btn.is_visible() and post_btn.is_enabled():
                post_btn.click(force=True)
            else:
                target.focus()
                page.keyboard.press("Control+Enter")

            time.sleep(6)
            dismiss_modals(page, context)

            # 送信成功確認
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

if __name__ == "__main__":
    post_to_x("🛰️ Test SatViewer3D", image_path="post_card.png", headless=True)
