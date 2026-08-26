import os
import sys
import time
from playwright.sync_api import sync_playwright

# Windows コンソールの文字コード対応
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

USER_DATA_DIR = os.path.abspath("./chrome_profile")

def login_and_save_session():
    print("=" * 60)
    print("🛰️ SatView3D Bot - Chrome プロファイル初回ログイン")
    print("=" * 60)
    print(f"プロファイル保存先: {USER_DATA_DIR}")
    print("本物の Google Chrome が起動します。")
    print("-" * 60)

    with sync_playwright() as p:
        # 本物のChromeを起動（channel="chrome"）して専用プロファイルに永続保存
        try:
            context = p.chromium.launch_persistent_context(
                user_data_dir=USER_DATA_DIR,
                channel="chrome",
                headless=False,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-first-run",
                    "--no-default-browser-check"
                ],
                viewport={"width": 1280, "height": 800}
            )
        except Exception as e:
            print(f"[INFO] Chromeチャンネルの起動にフォールバック: {e}")
            context = p.chromium.launch_persistent_context(
                user_data_dir=USER_DATA_DIR,
                headless=False,
                args=["--disable-blink-features=AutomationControlled"],
                viewport={"width": 1280, "height": 800}
            )

        page = context.pages[0] if context.pages else context.new_page()

        print("[INFO] Xのログインページを開いています...")
        page.goto("https://x.com/login")

        print("\n👉 開いたChromeウィンドウでログインを完了させてください。")
        print("👉 ログインが完了してホーム画面（タイムライン）が表示されたら")
        input("👉 このターミナルで [Enter] キーを押してください...")

        print("\n[SUCCESS] ログイン状態を保存しました！")
        print("次回以降はログイン不要で自動投稿できます。")
        time.sleep(2)
        context.close()

if __name__ == "__main__":
    login_and_save_session()
