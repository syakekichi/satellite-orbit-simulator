import os
import sys
import tweepy
from dotenv import load_dotenv

# Windows コンソールの文字コード対応
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

# .env ファイルの読み込み
load_dotenv()

API_KEY = os.getenv("X_API_KEY")
API_SECRET = os.getenv("X_API_SECRET")
ACCESS_TOKEN = os.getenv("X_ACCESS_TOKEN")
ACCESS_TOKEN_SECRET = os.getenv("X_ACCESS_TOKEN_SECRET")

if not all([API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET]):
    print("[ERROR] .env ファイルに4つのAPIキーが正しく設定されていません。")
    sys.exit(1)

# X API v2 Client 初期化
client = tweepy.Client(
    consumer_key=API_KEY.strip(),
    consumer_secret=API_SECRET.strip(),
    access_token=ACCESS_TOKEN.strip(),
    access_token_secret=ACCESS_TOKEN_SECRET.strip(),
)

try:
    print("[INFO] テストツイートを送信中...")
    response = client.create_tweet(
        text="🛰️ SatView3D Bot is now active!\nTest tweet from Satellite Orbit Simulator.\n\n#SatView3D #Space #ISS"
    )
    print("[SUCCESS] ツイート投稿に成功しました！")
    print(f"Tweet ID: {response.data['id']}")
    print("X（Twitter）のアカウントを確認してみてください！")
except Exception as e:
    print(f"[ERROR] エラーが発生しました: {e}")
