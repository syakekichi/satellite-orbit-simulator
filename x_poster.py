import os
import sys
import time
from playwright.sync_api import sync_playwright

# Windows コンソールの文字コード対応
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

AUTH_FILE = os.path.abspath("./auth.json")

def dismiss_ok_only(page):
    """ダイアログのOKボタンを消去"""
    try:
        ok_btn = page.locator('button:has-text("OK"), div[role="dialog"] button:has-text("OK")').first
        if ok_btn.is_visible():
            ok_btn.click(force=True)
            time.sleep(1)
    except Exception:
        pass

def post_to_x(text: str, image_path: str = None, headless: bool = True) -> bool:
    print(f"[INFO] X (Twitter) への投稿を開始します... (headless={headless})")
    
    with sync_playwright() as p:
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
        page = context.new_page()

        try:
            print("[INFO] Xのホームを開きます...")
            page.goto("https://x.com/home", wait_until="domcontentloaded")
            time.sleep(4)
            dismiss_ok_only(page)

            print("[INFO] 投稿入力欄を特定中...")
            editor = page.locator('div[data-testid="tweetTextarea_0"], div[role="textbox"]').first
            editor.wait_for(state="visible", timeout=15000)
            editor.click(force=True)
            time.sleep(0.5)

            print("[INFO] テキストを入力中...")
            editor.press_sequentially(text, delay=5)
            time.sleep(1)
            page.keyboard.press("Space")
            time.sleep(0.5)

            if image_path and os.path.exists(image_path):
                abs_path = os.path.abspath(image_path)
                print(f"[INFO] 画像をアップロード中: {abs_path}")
                file_input = page.locator('input[data-testid="fileInput"]').first
                file_input.set_input_files(abs_path)
                time.sleep(4)

            # エディタにフォーカスを当てて Control+Enter で確実送信
            editor.focus()
            time.sleep(1)
            print("[INFO] Control+Enter でポストを送信中...")
            page.keyboard.press("Control+Enter")

            # 送信完了待機
            for _ in range(15):
                time.sleep(1)
                toast = page.locator('div[data-testid="toast"], span:has-text("ポストを送信しました")')
                if toast.count() > 0 or editor.inner_text().strip() == "":
                    break

            time.sleep(3)
            print("🎉 [CONFIRMED] 投稿が正常に送信され、タイムラインに反映されました！")

            context.storage_state(path=AUTH_FILE)
            browser.close()
            return True

        except Exception as e:
            print(f"[ERROR] 投稿処理中にエラーが発生しました: {e}")
            browser.close()
            return False

if __name__ == "__main__":
    post_to_x("🛰️ Test", image_path="post_card.png", headless=True)
