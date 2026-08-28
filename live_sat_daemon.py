import os
import sys
import time
import datetime
from bot_master import run_master_bot

# Windows コンソールの文字コード対応
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

POST_INTERVAL_SECONDS = 5400      # 90分 (1.5時間) ごとに自動ローテーション投稿
FOLLOWER_INTERVAL_SECONDS = 21600 # 6時間ごとに自動フォロー巡回

def main():
    print("=" * 65)
    print("🛰️ SatViewer3D 24時間自動ローテーション常駐デーモン 起動中...")
    print(f"⏰ 投稿間隔: {POST_INTERVAL_SECONDS // 60}分ごと | 多言語自動フォロー: {FOLLOWER_INTERVAL_SECONDS // 3600}時間ごと")
    print("=" * 65)

    last_follower_time = time.time()

    while True:
        try:
            now_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(f"\n🚀 [{now_str}] 定時ローテーション投稿を実行します...")

            # 1. 次のモードを自動ローテーション実行＆Xに投稿
            run_master_bot()

            # 2. 定期フォロワー自動育成（6時間おき）
            if time.time() - last_follower_time >= FOLLOWER_INTERVAL_SECONDS:
                print(f"\n👥 [{now_str}] 多言語フォロワー自動育成ルーチンを開始します...")
                try:
                    import auto_follower
                    auto_follower.main()
                    last_follower_time = time.time()
                except Exception as e:
                    print(f"[WARN] Auto follower error: {e}")

        except Exception as e:
            print(f"\n[ERROR] SatViewer3D デーモン内でエラー発生: {e}")

        print(f"\n⏳ 次回投稿まで {POST_INTERVAL_SECONDS // 60} 分待機します...")
        time.sleep(POST_INTERVAL_SECONDS)

if __name__ == "__main__":
    main()
