import os, time, sys
from playwright.sync_api import sync_playwright

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

USER_DATA_DIR = os.path.abspath("./chrome_profile")
AUTH_FILE = os.path.abspath("./auth.json")

def inspect_and_refresh_session():
    print("=" * 60)
    print("🛰️ SatViewer3D セッション点検・再同期ツール")
    print("=" * 60)

    with sync_playwright() as p:
        try:
            context = p.chromium.launch_persistent_context(
                user_data_dir=USER_DATA_DIR,
                channel="chrome",
                headless=False,
                args=["--disable-blink-features=AutomationControlled"],
                viewport={"width": 1280, "height": 900}
            )
        except Exception as e:
            print(f"[INFO] Chromiumで起動: {e}")
            context = p.chromium.launch_persistent_context(
                user_data_dir=USER_DATA_DIR,
                headless=False,
                args=["--disable-blink-features=AutomationControlled"],
                viewport={"width": 1280, "height": 900}
            )

        page = context.pages[0] if context.pages else context.new_page()
        page.goto("https://x.com/home")
        time.sleep(5)

        print("\n👉 ブラウザ画面をご確認ください。")
        print("👉 制限ダイアログ（Graduated Access / OKボタンなど）が表示されている場合はOKをクリックしてください。")
        print("👉 準備ができたら、このコンソールで [Enter] を押してください。")
        input("Press Enter to continue...")

        # Export fresh auth.json
        context.storage_state(path=AUTH_FILE)
        print(f"✅ 新しいセッションを '{AUTH_FILE}' に保存しました！")
        context.close()

if __name__ == "__main__":
    inspect_and_refresh_session()
