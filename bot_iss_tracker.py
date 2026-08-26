import os
import sys
import datetime
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
from skyfield.api import EarthSatellite, load, wgs84
from x_poster import post_to_x

# Windows コンソールの文字コード対応
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

# フォント設定
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

WEBSITE_URL = "https://satviewer3d.com"

def get_iss_data():
    """Celestrak から最新の ISS 軌道データを取得して計算"""
    ts = load.timescale()
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    t = ts.from_datetime(now_utc)

    # Celestrak から stations.txt を取得
    stations_url = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle'
    satellites = load.tle_file(stations_url)
    by_name = {sat.name: sat for sat in satellites}
    
    # ISS (ZARYA)
    iss = by_name.get('ISS (ZARYA)')
    if not iss:
        iss = satellites[0]

    # 現在位置の計算
    geocentric = iss.at(t)
    subpoint = wgs84.subpoint(geocentric)
    
    lat = subpoint.latitude.degrees
    lon = subpoint.longitude.degrees
    elevation_km = subpoint.elevation.km

    # 速度計算
    pos1 = iss.at(t).position.km
    pos2 = iss.at(ts.from_datetime(now_utc + datetime.timedelta(seconds=1))).position.km
    speed_km_s = np.linalg.norm(pos2 - pos1)
    speed_km_h = speed_km_s * 3600

    # 軌道の軌跡（過去45分〜未来45分）
    trail_lons = []
    trail_lats = []
    for dt_min in range(-45, 46, 2):
        t_sample = ts.from_datetime(now_utc + datetime.timedelta(minutes=dt_min))
        sp = wgs84.subpoint(iss.at(t_sample))
        trail_lons.append(sp.longitude.degrees)
        trail_lats.append(sp.latitude.degrees)

    return {
        "lat": lat,
        "lon": lon,
        "alt_km": elevation_km,
        "speed_km_s": speed_km_s,
        "speed_km_h": speed_km_h,
        "trail_lons": trail_lons,
        "trail_lats": trail_lats,
        "time_utc": now_utc,
        "time_jst": now_utc + datetime.timedelta(hours=9)
    }

def get_region_name_en(lat, lon):
    """英語での地域・海洋判定（グローバルユーザー向け）"""
    if -60 <= lat <= 60:
        if 120 <= lon <= 150 and 20 <= lat <= 50:
            return "Japan & East Asia"
        elif 100 <= lon <= 180 and lat >= 0:
            return "North Pacific Ocean"
        elif -180 <= lon <= -70 and lat >= 0:
            return "North America / East Pacific"
        elif -70 <= lon <= -30 and lat <= 15:
            return "South America / South Atlantic"
        elif -30 <= lon <= 60 and lat >= 30:
            return "Europe & Mediterranean"
        elif -20 <= lon <= 55 and lat < 30 and lat > -35:
            return "African Continent"
        elif 60 <= lon <= 120 and lat >= 0:
            return "Central / South Asia"
        elif 60 <= lon <= 120 and lat < 0:
            return "Indian Ocean"
        elif lon > 120 and lat < 0:
            return "Oceania / South Pacific"
        else:
            return "Atlantic Ocean"
    elif lat > 60:
        return "Arctic Circle"
    else:
        return "Southern Ocean / Antarctica"

def generate_iss_map_image(data, output_path="iss_tracker_card.png"):
    """ハイテクで洗練されたグローバル向けインフォグラフィック画像を生成"""
    fig, ax = plt.subplots(figsize=(12, 6.75), facecolor='#07090E')
    
    # 背景マップ
    if os.path.exists("earth_texture.jpg"):
        try:
            earth_img = Image.open("earth_texture.jpg")
            ax.imshow(earth_img, extent=[-180, 180, -90, 90], alpha=0.55, aspect='auto')
        except Exception:
            ax.set_facecolor('#0E131F')
    else:
        ax.set_facecolor('#0E131F')

    # グリッド線
    ax.grid(color='#1E293B', linestyle='--', linewidth=0.6, alpha=0.6)

    # 軌道ルート（ネオンブルー）
    trail_lons = np.array(data["trail_lons"])
    trail_lats = np.array(data["trail_lats"])
    
    diffs = np.abs(np.diff(trail_lons))
    split_indices = np.where(diffs > 180)[0] + 1
    lon_splits = np.split(trail_lons, split_indices)
    lat_splits = np.split(trail_lats, split_indices)
    
    for lons, lats in zip(lon_splits, lat_splits):
        # 軌道グロー効果
        ax.plot(lons, lats, color='#38BDF8', linewidth=4, alpha=0.3, linestyle='-')
        ax.plot(lons, lats, color='#0284C7', linewidth=1.8, alpha=0.9, linestyle='-')

    # ISS 現在地マーカー（光るピンク/レッド）
    ax.scatter(
        [data["lon"]], [data["lat"]],
        color='#F43F5E', s=320, zorder=6, edgecolors='#FFFFFF', linewidth=2.5, label='ISS'
    )
    # パルスリング
    ax.scatter(
        [data["lon"]], [data["lat"]],
        color='#FB7185', s=950, alpha=0.25, zorder=5
    )

    # 座標アノテーション
    lat_cardinal = f"{abs(data['lat']):.1f}°{'N' if data['lat']>=0 else 'S'}"
    lon_cardinal = f"{abs(data['lon']):.1f}°{'E' if data['lon']>=0 else 'W'}"
    
    ax.annotate(
        f"ISS (Live)\n{lat_cardinal}, {lon_cardinal}",
        xy=(data["lon"], data["lat"]),
        xytext=(data["lon"] + 8, data["lat"] + 8),
        color='#FFFFFF',
        fontsize=11,
        fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0F172A', edgecolor='#38BDF8', alpha=0.92, lw=1.2),
        arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=0', color='#38BDF8', lw=1.5)
    )

    # 軸設定
    ax.set_xlim(-180, 180)
    ax.set_ylim(-90, 90)
    ax.set_xticks(np.arange(-180, 181, 60))
    ax.set_yticks(np.arange(-90, 91, 30))
    ax.set_xticklabels(['180°W', '120°W', '60°W', '0°', '60°E', '120°E', '180°E'], color='#64748B', fontsize=9)
    ax.set_yticklabels(['90°S', '60°S', '30°S', '0°', '30°N', '60°N', '90°N'], color='#64748B', fontsize=9)
    ax.tick_params(colors='#64748B')

    # タイトル・ヘッダー
    utc_str = data["time_utc"].strftime('%Y-%m-%d %H:%M:%S UTC')
    fig.suptitle("SatViewer3D  •  International Space Station (ISS) Live Orbit", 
                 fontsize=15, fontweight='bold', color='#38BDF8', y=0.96)
    
    ax.set_title(f"Time: {utc_str}  |  Altitude: {data['alt_km']:.1f} km  |  Velocity: {data['speed_km_h']:,.0f} km/h ({data['speed_km_s']:.2f} km/s)",
                 fontsize=10.5, color='#94A3B8', pad=10)

    # 透かしクレジット
    ax.text(175, -84, "satviewer3d.com", color='#475569', fontsize=10, ha='right', va='bottom', fontweight='bold')

    plt.tight_layout()
    plt.savefig(output_path, dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()
    print(f"[INFO] Generated global infographic image: {output_path}")

def run_iss_bot():
    print("=" * 60)
    print("🛰️ SatViewer3D - Global ISS Live Tracker Bot")
    print("=" * 60)

    # 1. 軌道計算
    data = get_iss_data()
    region_en = get_region_name_en(data["lat"], data["lon"])

    # 2. 画像生成
    img_path = "iss_tracker_card.png"
    generate_iss_map_image(data, img_path)

    # 3. 英語ツイートテキスト（収益・リンククリック最大化設計）
    utc_time_str = data["time_utc"].strftime('%H:%M UTC')
    lat_cardinal = f"{abs(data['lat']):.1f}°{'N' if data['lat']>=0 else 'S'}"
    lon_cardinal = f"{abs(data['lon']):.1f}°{'E' if data['lon']>=0 else 'W'}"

    post_text = (
        f"🛰️ ISS Live Orbit Update ({utc_time_str})\n\n"
        f"📍 Current Region: {region_en}\n"
        f"🌐 Coordinates: {lat_cardinal}, {lon_cardinal}\n"
        f"📏 Altitude: {data['alt_km']:.0f} km ({data['alt_km']*0.621371:.0f} mi)\n"
        f"⚡ Velocity: {data['speed_km_h']:,.0f} km/h ({data['speed_km_s']:.2f} km/s)\n\n"
        f"🌍 Track real-time satellites in 3D 👇\n"
        f"{WEBSITE_URL}\n\n"
        f"#ISS #Space #SatelliteTracking #SatViewer3D #SpaceStation #NASA #SpaceX"
    )

    print("\n--- [Tweet Preview] ---")
    print(post_text)
    print("-----------------------\n")

    # 4. Xへの自動投稿
    success = post_to_x(post_text, image_path=img_path, headless=True)
    if success:
        print("\n🎉 Global ISS tweet posted successfully!")
    else:
        print("\n❌ Failed to post tweet. Please check logs.")

if __name__ == "__main__":
    run_iss_bot()
