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
            print("[INFO] 投稿作成画面を開いています...")
            page.goto("https://x.com/compose/post", wait_until="domcontentloaded")
            time.sleep(4)

            # ログイン確認
            if "login" in page.url:
                print("[ERROR] ログインセッションが無効です。")
                page.screenshot(path="login_error.png")
                if browser: browser.close()
                else: context.close()
                return False

            # 入力欄の特定
            print("[INFO] 投稿入力欄を探しています...")
            editor = page.locator('div[data-testid="tweetTextarea_0"], div[role="textbox"]').first
            editor.wait_for(state="visible", timeout=15000)

            # フォーカス＆入力
            editor.click(force=True)
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
                
                # 画像プレビュー待機
                try:
                    page.locator('div[data-testid="attachments"], button[aria-label="Remove media"], button[aria-label="メディアを削除"]').first.wait_for(state="visible", timeout=15000)
                    print("[INFO] 画像アップロード完了を確認しました。")
                except Exception:
                    print("[WARN] プレビュー待機タイムアウト。")
                time.sleep(3)

            # 送信直前のスクリーンショット
            page.screenshot(path="before_click_post.png")

            # 送信処理：ショートカットキー ＋ JSネイティブクリック
            print("[INFO] ポスト送信を実行中...")
            
            # 1. エディタにフォーカスして Control+Enter
            editor.focus()
            time.sleep(0.5)
            page.keyboard.press("Control+Enter")
            time.sleep(1)

            # 2. JSで直接DOMのポストボタンをクリック
            page.evaluate("""() => {
                const btns = Array.from(document.querySelectorAll('button[data-testid="tweetButton"], button[data-testid="tweetButtonInline"]'));
                if (btns.length > 0) {
                    const targetBtn = btns[btns.length - 1];
                    if (!targetBtn.disabled) {
                        targetBtn.click();
                    }
                }
            }""")
            time.sleep(1)

            # 3. Playwright 通常クリック
            try:
                post_btn = page.locator('button[data-testid="tweetButton"]').last
                if post_btn.is_visible() and post_btn.is_enabled():
                    post_btn.click(force=True)
            except Exception:
                pass

            # 送信完了の待機（ダイアログが閉じるのを最大15秒待つ）
            print("[INFO] 送信完了を待機中...")
            is_closed = False
            for _ in range(15):
                time.sleep(1)
                if page.locator('div[data-testid="tweetTextarea_0"]').count() == 0 or not editor.is_visible():
                    is_closed = True
                    break

            page.screenshot(path="after_click_post.png")

            if is_closed:
                print("🎉 [VERIFIED] 投稿が正常に送信され、ダイアログが閉じました！")
            else:
                print("[WARN] 送信完了待機タイムアウト（ダイアログ未クローズ）。")

            # セッション更新保存
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
    sample_text = "🛰️ SatViewer3D Live Test\n\n#SatViewer3D #Space"
    post_to_x(sample_text, image_path="post_card.png", headless=True)
