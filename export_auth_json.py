import os
import sys
from playwright.sync_api import sync_playwright

# Windows コンソールの文字コード対応
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

USER_DATA_DIR = os.path.abspath("./chrome_profile")
AUTH_FILE = "auth.json"

def export_session():
    print("=" * 60)
    print("🛰️ SatViewer3D - ログインセッション（auth.json）抽出ツール")
    print("=" * 60)

    if not os.path.exists(USER_DATA_DIR):
        print(f"[ERROR] '{USER_DATA_DIR}' が見つかりません。先に login_x.py を実行してください。")
        return

    with sync_playwright() as p:
        try:
            context = p.chromium.launch_persistent_context(
                user_data_dir=USER_DATA_DIR,
                channel="chrome",
                headless=True,
                args=["--disable-blink-features=AutomationControlled"]
            )
        except Exception:
            context = p.chromium.launch_persistent_context(
                user_data_dir=USER_DATA_DIR,
                headless=True,
                args=["--disable-blink-features=AutomationControlled"]
            )

        # storage_state を auth.json に保存
        context.storage_state(path=AUTH_FILE)
        context.close()

    print(f"✅ セッション情報を '{AUTH_FILE}' に書き出しました！")
    print("このファイルの内容をコピーして、GitHub Secrets（X_AUTH_JSON）に登録します。")

if __name__ == "__main__":
    export_session()
