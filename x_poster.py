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
            print("[INFO] ホームページにアクセス中...")
            page.goto("https://x.com/home", wait_until="domcontentloaded")
            time.sleep(4)

            # ログイン確認
            if "login" in page.url:
                print("[ERROR] ログインセッションが無効です。")
                page.screenshot(path="login_error.png")
                if browser: browser.close()
                else: context.close()
                return False

            # ホーム画面のインライン投稿欄、またはダイアログを開く
            print("[INFO] 投稿入力欄を探しています...")
            page.goto("https://x.com/compose/post", wait_until="domcontentloaded")
            time.sleep(4)

            # 投稿ダイアログを探す
            dialog = page.locator('div[role="dialog"]').first
            if dialog.count() > 0 and dialog.is_visible():
                target_container = dialog
                print("[INFO] 投稿モーダルダイアログを検出しました。")
            else:
                target_container = page.locator('div[data-testid="primaryColumn"]').first
                print("[INFO] メインカラムの投稿欄を検出しました。")

            editor = target_container.locator('div[data-testid="tweetTextarea_0"], div[role="textbox"]').first
            editor.wait_for(state="visible", timeout=15000)

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
                file_input = target_container.locator('input[data-testid="fileInput"]').first
                file_input.set_input_files(abs_path)
                
                # 画像のプレビュー完了待機
                try:
                    target_container.locator('div[data-testid="attachments"], button[aria-label="Remove media"], button[aria-label="メディアを削除"]').first.wait_for(state="visible", timeout=15000)
                    print("[INFO] 画像アップロード完了を確認しました。")
                except Exception:
                    print("[WARN] プレビュー待機タイムアウト。待機を継続します。")
                time.sleep(3)

            # 送信ボタンを特定（モーダル/コンテナ内のボタンを厳密に指定）
            post_btn = target_container.locator('button[data-testid="tweetButton"], button[data-testid="tweetButtonInline"]').first
            post_btn.wait_for(state="visible", timeout=10000)

            # ボタンが有効になるのを待つ
            for i in range(15):
                if post_btn.is_enabled():
                    print(f"[INFO] 送信ボタンが有効化されました（{i}秒待機）。")
                    break
                time.sleep(1)

            # スクリーンショット（送信直前）
            page.screenshot(path="before_click_post.png")

            print("[INFO] 送信ボタンをクリックします...")
            post_btn.click(force=True)

            # 送信完了の待機（ダイアログが閉じる、またはエディタが消える）
            print("[INFO] 送信完了を待機中...")
            is_closed = False
            for _ in range(12):
                time.sleep(1)
                if editor.count() == 0 or not editor.is_visible():
                    is_closed = True
                    break

            page.screenshot(path="after_click_post.png")

            if is_closed:
                print("🎉 [VERIFIED] 投稿が正常に送信され、入力ダイアログが閉じました！")
            else:
                print("[WARN] ダイアログが自動で閉じませんでした。追加待機します。")
                time.sleep(5)

            # セッション最新化
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
