import os
import sys
import json
import time
import random
import datetime
import urllib.parse
from playwright.sync_api import sync_playwright

# Windows コンソールの文字コード対応
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

TRACKER_FILE = "follow_tracker.json"
AUTH_FILE = "auth.json"
MAX_FOLLOWS_PER_RUN = 10     # 1回の実行でフォローする最大人数（安全対策）
MAX_UNFOLLOWS_PER_RUN = 8    # 1回の実行でアンフォローする最大人数（安全対策）
GRACE_PERIOD_DAYS = 10       # フォローバック待ち期間（10日間）

# -------------------------------------------------------------
# 多言語 宇宙・衛星検索キーワード（日・英・西・中・露）
# -------------------------------------------------------------
SEARCH_QUERIES = [
    # 🇯🇵 日本語
    '"ISS きぼう" lang:ja -filter:retweets',
    '"国際宇宙ステーション" lang:ja -filter:retweets',
    '"スターリンク トレイン" lang:ja -filter:retweets',
    '"人工衛星" "天体観測" lang:ja -filter:retweets',

    # 🇺🇸 英語
    '"ISS pass" lang:en -filter:retweets',
    '"Starlink train" lang:en -filter:retweets',
    '"satellite spotting" lang:en -filter:retweets',
    '"space station" "stargazing" lang:en -filter:retweets',

    # 🇪🇸 スペイン語
    '"estacion espacial" lang:es -filter:retweets',
    '"tren de satelites" lang:es -filter:retweets',
    '"avistamiento satelite" lang:es -filter:retweets',
    '"satelite PAZ" lang:es -filter:retweets',

    # 🇨🇳 中国語
    '"中国空间站" lang:zh -filter:retweets',
    '"天宫" "空间站" lang:zh -filter:retweets',
    '"星链" "人造卫星" lang:zh -filter:retweets',

    # 🇷🇺 ロシア語
    '"пролет МКС" lang:ru -filter:retweets',
    '"поезд старлинк" lang:ru -filter:retweets',
    '"наблюдение спутников" lang:ru -filter:retweets'
]

# 自アカウントや除外対象
EXCLUDED_USERS = {
    "satviewer3d_bot", "satviewer3d", "twitter", "x", "support",
    "nasa", "spacex", "iss", "elonmusk", "jaxa_jp", "esa", "roscosmos"
}

def load_tracker():
    if os.path.exists(TRACKER_FILE):
        try:
            with open(TRACKER_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[WARN] Failed to load {TRACKER_FILE}: {e}")
    return {
        "following": {},       # { "screen_name": { "followed_at": "...", "is_mutual": bool, "last_checked": "..." } }
        "history_unfollowed": []  # [ "screen_name", ... ]
    }

def save_tracker(data):
    try:
        with open(TRACKER_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[ERROR] Failed to save {TRACKER_FILE}: {e}")

def check_is_mutual(page):
    """
    プロフィールページで相手がこちらをフォローしているか（Follows you / フォローされています バッジ）を確認
    """
    try:
        # data-testid="userFollowIndicator" が X の「フォローされています」バッジ
        indicator = page.locator('[data-testid="userFollowIndicator"]')
        if indicator.count() > 0 and indicator.first.is_visible():
            return True
        
        # テキスト fallback
        body_text = page.locator('body').inner_text()
        mutual_keywords = [
            "フォローされています", "Follows you", "Te sigue", "Тебя читают", "关注了你", "關注了你", "Sigue a"
        ]
        for kw in mutual_keywords:
            if kw in body_text:
                return True
    except Exception:
        pass
    return False

def run_unfollow_routine(page, tracker):
    """
    10日以上経過し、かつフォローバックがないユーザーを安全にアンフォローする
    """
    print("\n" + "=" * 55)
    print("🔍 [CHECK] 10日経過アンフォロー巡回チェックを開始します...")
    print("=" * 55)

    now = datetime.datetime.now(datetime.timezone.utc)
    grace_delta = datetime.timedelta(days=GRACE_PERIOD_DAYS)

    following = tracker.get("following", {})
    unfollow_candidates = []

    for user, info in following.items():
        if info.get("is_mutual"):
            continue # 相互フォローは永久保護

        followed_at_str = info.get("followed_at")
        if not followed_at_str:
            continue

        try:
            followed_at = datetime.datetime.fromisoformat(followed_at_str)
            if now - followed_at >= grace_delta:
                unfollow_candidates.append(user)
        except Exception:
            pass

    print(f"📋 10日経過チェック対象: {len(unfollow_candidates)} 名")
    unfollowed_count = 0

    for user in unfollow_candidates[:MAX_UNFOLLOWS_PER_RUN]:
        try:
            profile_url = f"https://x.com/{user}"
            print(f"\n🔎 ユーザー確認中: @{user} ({profile_url})")
            page.goto(profile_url, wait_until="domcontentloaded", timeout=20000)
            time.sleep(random.uniform(3.0, 5.0))

            # 相互フォローかチェック
            if check_is_mutual(page):
                print(f"🎉 @{user} は相互フォロー（Follows you）になりました！保護リストに更新します。")
                tracker["following"][user]["is_mutual"] = True
                tracker["following"][user]["last_checked"] = now.isoformat()
                save_tracker(tracker)
                continue

            # アンフォロー実行
            # アンフォローボタン（data-testid に unfollow が含まれるボタン、または「フォロー中」「Following」）
            unfollow_btn = page.locator('button[data-testid$="-unfollow"]')
            if unfollow_btn.count() == 0:
                # テキストで探す
                unfollow_btn = page.locator('button:has-text("フォロー中"), button:has-text("Following"), button:has-text("Siguiendo"), button:has-text("Читаю")')

            if unfollow_btn.count() > 0 and unfollow_btn.first.is_visible():
                unfollow_btn.first.click()
                time.sleep(1.5)

                # 確認ダイアログの「フォロー解除 / Unfollow」ボタンをクリック
                confirm_btn = page.locator('button[data-testid="confirmationSheetConfirm"]')
                if confirm_btn.count() > 0 and confirm_btn.first.is_visible():
                    confirm_btn.first.click()
                    time.sleep(2.0)
                    print(f"👋 @{user} のフォローを解除しました（10日経過・未フォローバック）。")
                    unfollowed_count += 1

                    # トラッカーを更新
                    del tracker["following"][user]
                    if user not in tracker.get("history_unfollowed", []):
                        tracker.setdefault("history_unfollowed", []).append(user)
                    save_tracker(tracker)
                else:
                    print(f"[WARN] 確認ダイアログが見つかりませんでした: @{user}")
            else:
                print(f"[INFO] 既にフォロー解除済みまたは非公開です: @{user}")
                del tracker["following"][user]
                save_tracker(tracker)

            time.sleep(random.uniform(4.0, 8.0))
        except Exception as e:
            print(f"[ERROR] @{user} のアンフォロー処理中にエラー: {e}")

    print(f"✅ アンフォロー巡回完了: {unfollowed_count} 名を解除しました。\n")

def run_follow_routine(page, tracker):
    """
    多言語（日・英・西・中・露）で人工衛星についてツイートしているユーザーを検索・フォロー
    """
    print("\n" + "=" * 55)
    print("🚀 [FOLLOW] 5言語・宇宙ツイートユーザー自動フォローを開始します...")
    print("=" * 55)

    now = datetime.datetime.now(datetime.timezone.utc)
    followed_count = 0

    # ランダムにいくつかのクエリを選択
    queries = random.sample(SEARCH_QUERIES, min(5, len(SEARCH_QUERIES)))

    for q in queries:
        if followed_count >= MAX_FOLLOWS_PER_RUN:
            break

        print(f"\n🔍 検索クエリ実行: [{q}]")
        encoded_q = urllib.parse.quote(q)
        search_url = f"https://x.com/search?q={encoded_q}&f=live"

        try:
            page.goto(search_url, wait_until="domcontentloaded", timeout=25000)
            time.sleep(random.uniform(4.0, 6.0))

            # タイムラインを少しスクロール
            page.mouse.wheel(0, 800)
            time.sleep(2.0)

            # ツイート内のユーザーリンクを取得
            user_links = page.locator('article[data-testid="tweet"] a[role="link"][href^="/"]')
            count = user_links.count()
            found_users = []

            for i in range(count):
                href = user_links.nth(i).get_attribute("href")
                if href and "/" in href:
                    parts = [p for p in href.split("/") if p]
                    if len(parts) == 1 and not parts[0].startswith("hashtag") and not parts[0].startswith("i"):
                        uname = parts[0].lower()
                        if uname not in EXCLUDED_USERS and uname not in found_users:
                            found_users.append(uname)

            print(f"👥 発見したユーザー候補: {found_users[:6]}")

            for uname in found_users:
                if followed_count >= MAX_FOLLOWS_PER_RUN:
                    break

                # 既に追跡中または過去にアンフォローしたユーザーはスキップ
                if uname in tracker.get("following", {}) or uname in tracker.get("history_unfollowed", []):
                    print(f"⏩ @{uname} は既に追跡中または解除済みのためスキップ。")
                    continue

                # プロフィールページへ遷移
                profile_url = f"https://x.com/{uname}"
                print(f"👉 プロフィール確認: @{uname} ({profile_url})")
                page.goto(profile_url, wait_until="domcontentloaded", timeout=20000)
                time.sleep(random.uniform(3.5, 5.5))

                # すでにフォロー中か確認
                already_following = page.locator('button[data-testid$="-unfollow"]')
                if already_following.count() > 0 and already_following.first.is_visible():
                    print(f"⏩ @{uname} は既にフォロー中のためトラッカーに追加のみ行います。")
                    tracker["following"][uname] = {
                        "followed_at": now.isoformat(),
                        "is_mutual": check_is_mutual(page),
                        "last_checked": now.isoformat()
                    }
                    save_tracker(tracker)
                    continue

                # フォローボタンを探す
                follow_btn = page.locator('button[data-testid$="-follow"]')
                if follow_btn.count() == 0:
                    follow_btn = page.locator('button:has-text("フォロー"), button:has-text("Follow"), button:has-text("Seguir"), button:has-text("Подписаться"), button:has-text("关注")')

                if follow_btn.count() > 0 and follow_btn.first.is_visible():
                    follow_btn.first.click()
                    time.sleep(2.0)
                    print(f"✨ [FOLLOWED] @{uname} をフォローしました！ (10日間トラッキング開始)")
                    followed_count += 1

                    tracker["following"][uname] = {
                        "followed_at": now.isoformat(),
                        "is_mutual": check_is_mutual(page),
                        "last_checked": now.isoformat()
                    }
                    save_tracker(tracker)
                    time.sleep(random.uniform(5.0, 10.0))
                else:
                    print(f"[INFO] @{uname} のフォローボタンが見つかりませんでした（非公開等）。")

        except Exception as e:
            print(f"[ERROR] クエリ [{q}] 処理中にエラー: {e}")

    print(f"\n🎉 自動フォロー巡回完了: 本日 {followed_count} 名を新規フォローしました！")

def main():
    if not os.path.exists(AUTH_FILE):
        print(f"[ERROR] {AUTH_FILE} が存在しません。ログインセッションが必要です。")
        sys.exit(1)

    tracker = load_tracker()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            storage_state=AUTH_FILE,
            viewport={"width": 1280, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        try:
            # 1. 10日経過アンフォロー巡回
            run_unfollow_routine(page, tracker)

            # 2. 5言語・宇宙ツイートユーザー自動フォロー巡回
            run_follow_routine(page, tracker)

        finally:
            browser.close()

if __name__ == "__main__":
    main()
