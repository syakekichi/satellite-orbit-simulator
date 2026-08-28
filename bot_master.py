import os
import sys
import random
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

plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Meiryo', 'SimHei', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

WEBSITE_URL = "https://satviewer3d.com"
MODE_FILE = "last_bot_mode.txt"

# -------------------------------------------------------------
# 地理・言語判定エンジン (4大宇宙言語: RU, ZH, JA, EN)
# -------------------------------------------------------------
def get_location_context(lat, lon):
    """
    緯度経度から地域名と最適な表示言語（RU/ZH/JA/EN）を自動判定。
    - ロシア・ユーラシア: RU (ロシア語 + 英語)
    - 中国・台湾周辺: ZH (中国語 + 英語)
    - 日本周辺: JA (日本語 + 英語)
    - 欧米・その他世界: EN (英語ネイティブ・無駄な他言語なし)
    """
    # 1. 日本周辺 (ピンポイント)
    if (20 <= lat <= 48) and (122 <= lon <= 153):
        return {
            "lang": "JA",
            "region_ja": "日本・東アジア",
            "region_en": "Japan & East Asia",
            "region_zh": "日本及东亚上空",
            "region_ru": "Япония и Восточная Азия"
        }

    # 2. 中国・台湾・香港周辺
    if (18 <= lat <= 53) and (73 <= lon <= 122):
        return {
            "lang": "ZH",
            "region_ja": "中国・東アジア",
            "region_en": "China & East Asia",
            "region_zh": "中国大陆及周边上空",
            "region_ru": "Китай и Восточная Азия"
        }

    # 3. ロシア・ユーラシア・中央アジア
    if (45 <= lat <= 75) and (28 <= lon <= 180):
        return {
            "lang": "RU",
            "region_ja": "ロシア・ユーラシア",
            "region_en": "Russia & Eurasia",
            "region_zh": "俄罗斯及欧亚大陆",
            "region_ru": "Россия и Евразия"
        }

    # 4. 欧米・その他世界（ENネイティブ）
    region_en = "Open Ocean"
    if (15 <= lat <= 66.5) and (-170 <= lon <= -50):
        region_en = "North America"
    elif (-60 <= lat <= 15) and (-90 <= lon <= -30):
        region_en = "South America"
    elif (35 <= lat <= 66.5) and (-15 <= lon <= 28):
        region_en = "Western Europe"
    elif (-35 <= lat <= 35) and (-20 <= lon <= 55):
        region_en = "Africa"
    elif (12 <= lat <= 42) and (35 <= lon <= 65):
        region_en = "Middle East"
    elif (-12 <= lat <= 10) and (95 <= lon <= 150):
        region_en = "Southeast Asia"
    elif lat < -10 and (110 <= lon <= 180):
        region_en = "Oceania & Australia"
    elif (10 <= lat <= 45) and (60 <= lon <= 90):
        region_en = "South Asia"
    elif lat > 66.5:
        region_en = "Arctic Circle"
    elif lat < -60:
        region_en = "Southern Ocean"
    elif (lon > 140 or lon < -100) and lat >= 0:
        region_en = "North Pacific Ocean"
    elif (lon > 140 or lon < -70) and lat < 0:
        region_en = "South Pacific Ocean"
    elif (-70 <= lon <= 20) and lat >= 0:
        region_en = "North Atlantic Ocean"
    elif (-70 <= lon <= 20) and lat < 0:
        region_en = "South Atlantic Ocean"
    elif (20 <= lon <= 110) and lat < 25:
        region_en = "Indian Ocean"

    return {
        "lang": "EN",
        "region_ja": region_en,
        "region_en": region_en,
        "region_zh": region_en,
        "region_ru": region_en
    }

def create_base_map():
    fig, ax = plt.subplots(figsize=(12, 6.75), facecolor='#07090E')
    if os.path.exists("earth_texture.jpg"):
        try:
            earth_img = Image.open("earth_texture.jpg")
            ax.imshow(earth_img, extent=[-180, 180, -90, 90], alpha=0.55, aspect='auto')
        except Exception:
            ax.set_facecolor('#0E131F')
    else:
        ax.set_facecolor('#0E131F')

    ax.grid(color='#1E293B', linestyle='--', linewidth=0.6, alpha=0.6)
    ax.set_xlim(-180, 180)
    ax.set_ylim(-90, 90)
    ax.set_xticks(np.arange(-180, 181, 60))
    ax.set_yticks(np.arange(-90, 91, 30))
    ax.set_xticklabels(['180°W', '120°W', '60°W', '0°', '60°E', '120°E', '180°E'], color='#64748B', fontsize=9)
    ax.set_yticklabels(['90°S', '60°S', '30°S', '0°', '30°N', '60°N', '90°N'], color='#64748B', fontsize=9)
    ax.tick_params(colors='#64748B')
    ax.text(175, -84, "satviewer3d.com", color='#38BDF8', fontsize=10, ha='right', va='bottom', fontweight='bold')
    return fig, ax

# -------------------------------------------------------------
# Mode 1: ISS Live Tracker (動的4言語ルーティング: RU, ZH, JA, EN)
# -------------------------------------------------------------
def task_iss_live():
    ts = load.timescale()
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    t = ts.from_datetime(now_utc)

    stations_url = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle'
    satellites = load.tle_file(stations_url)
    by_name = {sat.name: sat for sat in satellites}
    iss = by_name.get('ISS (ZARYA)', satellites[0])

    subpoint = wgs84.subpoint(iss.at(t))
    lat, lon, alt = subpoint.latitude.degrees, subpoint.longitude.degrees, subpoint.elevation.km
    
    pos1 = iss.at(t).position.km
    pos2 = iss.at(ts.from_datetime(now_utc + datetime.timedelta(seconds=1))).position.km
    speed_km_h = np.linalg.norm(pos2 - pos1) * 3600

    trail_lons, trail_lats = [], []
    for dt_min in range(-45, 46, 2):
        sp = wgs84.subpoint(iss.at(ts.from_datetime(now_utc + datetime.timedelta(minutes=dt_min))))
        trail_lons.append(sp.longitude.degrees)
        trail_lats.append(sp.latitude.degrees)

    fig, ax = create_base_map()
    trail_lons, trail_lats = np.array(trail_lons), np.array(trail_lats)
    diffs = np.abs(np.diff(trail_lons))
    split_indices = np.where(diffs > 180)[0] + 1
    for lons, lats in zip(np.split(trail_lons, split_indices), np.split(trail_lats, split_indices)):
        ax.plot(lons, lats, color='#38BDF8', linewidth=4, alpha=0.3)
        ax.plot(lons, lats, color='#0284C7', linewidth=1.8, alpha=0.9)

    ax.scatter([lon], [lat], color='#F43F5E', s=320, zorder=6, edgecolors='#FFFFFF', linewidth=2.5)
    ax.scatter([lon], [lat], color='#FB7185', s=950, alpha=0.25, zorder=5)

    lat_card = f"{abs(lat):.1f}°{'N' if lat>=0 else 'S'}"
    lon_card = f"{abs(lon):.1f}°{'E' if lon>=0 else 'W'}"
    ax.annotate(
        f"ISS (Live)\n{lat_card}, {lon_card}", xy=(lon, lat), xytext=(lon + 8, lat + 8),
        color='#FFFFFF', fontsize=11, fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0F172A', edgecolor='#38BDF8', alpha=0.92),
        arrowprops=dict(arrowstyle='->', color='#38BDF8', lw=1.5)
    )

    utc_str = now_utc.strftime('%Y-%m-%d %H:%M:%S UTC')
    fig.suptitle("SatViewer3D  •  International Space Station (ISS) Live Orbit", fontsize=15, fontweight='bold', color='#38BDF8', y=0.96)
    ax.set_title(f"Time: {utc_str}  |  Altitude: {alt:.1f} km  |  Velocity: {speed_km_h:,.0f} km/h", fontsize=10.5, color='#94A3B8', pad=10)

    out_img = "post_card.png"
    plt.tight_layout()
    plt.savefig(out_img, dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

    ctx = get_location_context(lat, lon)
    
    if ctx["lang"] == "RU":
        text = (
            f"🛰️ МКС (Заря) пролетает над {ctx['region_ru']}!\n"
            f"Международная космическая станция мчится со скоростью 27,700 км/ч ✨ Взгляните на ночное небо!\n\n"
            f"Look up! ISS is zooming over {ctx['region_en']} ({speed_km_h:,.0f} km/h) 🌌🔭\n\n"
            f"🌍 3D Орбита онлайн 👇\n"
            f"{WEBSITE_URL}\n\n"
            f"#Космос #МКС #Роскосмос #Астрономия #ISS #Space"
        )
    elif ctx["lang"] == "ZH":
        text = (
            f"🛰️ 国际空间站（ISS）实时飞越！\n"
            f"目前ISS正以每秒7.7公里的速度飞越【{ctx['region_zh']}】✨ 今晚抬头看夜空！\n\n"
            f"Look up! ISS is zooming over {ctx['region_en']} ({speed_km_h:,.0f} km/h) 🌌🔭\n\n"
            f"🌍 3D 实况跟踪 👇\n"
            f"{WEBSITE_URL}\n\n"
            f"#空间站 #ISS #天文 #星空 #Space #NASA"
        )
    elif ctx["lang"] == "JA":
        text = (
            f"🛰️ ISS（きぼう）通過ウォッチ！\n"
            f"いま国際宇宙ステーションは【{ctx['region_ja']}】上空を秒速7.7kmで飛行中✨\n\n"
            f"Look up! ISS is zooming over {ctx['region_en']} ({speed_km_h:,.0f} km/h) 🌌🔭\n\n"
            f"🌍 3D Live 👇\n"
            f"{WEBSITE_URL}\n\n"
            f"#宇宙 #きぼう #ISS #星空 #NASA #Space"
        )
    else: # 欧米・その他世界（完全英語ネイティブ）
        text = (
            f"🛰️ International Space Station (ISS) Live Orbit!\n"
            f"Currently zooming over {ctx['region_en']} at {speed_km_h:,.0f} km/h (17,200 mph) 🌌✨\n\n"
            f"🔭 Track ISS in Real-Time 3D 👇\n"
            f"{WEBSITE_URL}\n\n"
            f"#ISS #Space #NASA #SpaceX #Astronomy #Stargazing #NightSky"
        )
    return text, out_img

# -------------------------------------------------------------
# Mode 2: Tiangong Space Station Live Tracker (🇨🇳 中国宇宙ステーション「天宮」)
# -------------------------------------------------------------
def task_tiangong_live():
    ts = load.timescale()
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    t = ts.from_datetime(now_utc)

    stations_url = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle'
    satellites = load.tle_file(stations_url)
    by_name = {sat.name: sat for sat in satellites}
    tiangong = by_name.get('CSS (TIANHE)', by_name.get('CSS (WENTIAN)', satellites[0]))

    subpoint = wgs84.subpoint(tiangong.at(t))
    lat, lon, alt = subpoint.latitude.degrees, subpoint.longitude.degrees, subpoint.elevation.km
    
    pos1 = tiangong.at(t).position.km
    pos2 = tiangong.at(ts.from_datetime(now_utc + datetime.timedelta(seconds=1))).position.km
    speed_km_h = np.linalg.norm(pos2 - pos1) * 3600

    trail_lons, trail_lats = [], []
    for dt_min in range(-45, 46, 2):
        sp = wgs84.subpoint(tiangong.at(ts.from_datetime(now_utc + datetime.timedelta(minutes=dt_min))))
        trail_lons.append(sp.longitude.degrees)
        trail_lats.append(sp.latitude.degrees)

    fig, ax = create_base_map()
    trail_lons, trail_lats = np.array(trail_lons), np.array(trail_lats)
    diffs = np.abs(np.diff(trail_lons))
    split_indices = np.where(diffs > 180)[0] + 1
    for lons, lats in zip(np.split(trail_lons, split_indices), np.split(trail_lats, split_indices)):
        ax.plot(lons, lats, color='#F59E0B', linewidth=4, alpha=0.3)
        ax.plot(lons, lats, color='#D97706', linewidth=1.8, alpha=0.9)

    ax.scatter([lon], [lat], color='#EF4444', s=320, zorder=6, edgecolors='#FFFFFF', linewidth=2.5)
    ax.scatter([lon], [lat], color='#FCA5A5', s=950, alpha=0.25, zorder=5)

    lat_card = f"{abs(lat):.1f}°{'N' if lat>=0 else 'S'}"
    lon_card = f"{abs(lon):.1f}°{'E' if lon>=0 else 'W'}"
    ax.annotate(
        f"Tiangong (CSS)\n{lat_card}, {lon_card}", xy=(lon, lat), xytext=(lon + 8, lat + 8),
        color='#FFFFFF', fontsize=11, fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0F172A', edgecolor='#EF4444', alpha=0.92),
        arrowprops=dict(arrowstyle='->', color='#EF4444', lw=1.5)
    )

    utc_str = now_utc.strftime('%Y-%m-%d %H:%M:%S UTC')
    fig.suptitle("SatViewer3D  •  Tiangong Space Station (CSS) Live Orbit", fontsize=15, fontweight='bold', color='#EF4444', y=0.96)
    ax.set_title(f"Time: {utc_str}  |  Altitude: {alt:.1f} km  |  Velocity: {speed_km_h:,.0f} km/h", fontsize=10.5, color='#94A3B8', pad=10)

    out_img = "post_card.png"
    plt.tight_layout()
    plt.savefig(out_img, dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

    ctx = get_location_context(lat, lon)
    
    if ctx["lang"] == "ZH":
        text = (
            f"🇨🇳 中国空间站（天宫）实时飞越！\n"
            f"天和核心舱目前正以每秒7.7公里的高速飞越【{ctx['region_zh']}】✨ 今晚抬头仰望星空！\n\n"
            f"Look up! Tiangong Space Station is zooming over {ctx['region_en']} 🌌🔭\n\n"
            f"🌍 3D 实时轨迹追踪 👇\n"
            f"{WEBSITE_URL}\n\n"
            f"#中国空间站 #天宫 #中国航天 #天文 #Tiangong #Space"
        )
    elif ctx["lang"] == "RU":
        text = (
            f"🛰️ Китайская станция «Тяньгун» на орбите!\n"
            f"Модуль «Тяньхэ» пролетает над {ctx['region_ru']} со скоростью 27,600 км/ч ✨\n\n"
            f"Tiangong (CSS) is zooming over {ctx['region_en']} 🌌🔭\n\n"
            f"🌍 3D Орбита 👇\n"
            f"{WEBSITE_URL}\n\n"
            f"#Тяньгун #Космос #Астрономия #Tiangong #Space"
        )
    elif ctx["lang"] == "JA":
        text = (
            f"🛰️ 中国宇宙ステーション『天宮』通過速報！\n"
            f"中国の大型有人宇宙ステーション（天和）は、いま【{ctx['region_ja']}】上空を秒速7.7kmで飛行中✨\n\n"
            f"Tiangong (CSS) is zooming over {ctx['region_en']} at {speed_km_h:,.0f} km/h 🌌🔭\n\n"
            f"🌍 3D Live 👇\n"
            f"{WEBSITE_URL}\n\n"
            f"#宇宙 #天宮 #宇宙ステーション #天体観測 #Tiangong #Space"
        )
    else: # 欧米・その他世界（完全英語ネイティブ）
        text = (
            f"🛰️ Tiangong Space Station (CSS) Live Orbit!\n"
            f"China's permanent space station is currently flying over {ctx['region_en']} at {speed_km_h:,.0f} km/h 🌌✨\n\n"
            f"🔭 Track Tiangong in Real-Time 3D 👇\n"
            f"{WEBSITE_URL}\n\n"
            f"#Tiangong #SpaceStation #Space #Astronomy #Stargazing #NightSky"
        )
    return text, out_img

# -------------------------------------------------------------
# Mode 3: Starlink Mega-Constellation
# -------------------------------------------------------------
def task_starlink_fleet():
    ts = load.timescale()
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    t = ts.from_datetime(now_utc)

    starlink_file = "data/starlink.txt" if os.path.exists("data/starlink.txt") else "starlink.txt"
    with open(starlink_file, 'r') as f:
        lines = f.readlines()

    sats = []
    for i in range(0, min(len(lines), 1500), 3):
        try:
            line1, line2, name = lines[i].strip(), lines[i+1].strip(), lines[i+2].strip()
            sats.append(EarthSatellite(line1, line2, name, ts))
        except:
            pass

    lons, lats = [], []
    for sat in sats:
        try:
            sp = wgs84.subpoint(sat.at(t))
            lons.append(sp.longitude.degrees)
            lats.append(sp.latitude.degrees)
        except:
            pass

    fig, ax = create_base_map()
    ax.scatter(lons, lats, color='#00F0FF', s=22, alpha=0.75, edgecolors='none', label='Starlink')
    ax.scatter(lons, lats, color='#FFFFFF', s=5, alpha=0.95, edgecolors='none')

    utc_str = now_utc.strftime('%Y-%m-%d %H:%M:%S UTC')
    fig.suptitle("SatViewer3D  •  SpaceX Starlink Mega-Constellation Radar", fontsize=15, fontweight='bold', color='#00F0FF', y=0.96)
    ax.set_title(f"Time: {utc_str}  |  Active Sample: {len(lons)} Satellites Plotted  |  Alt: ~550 km LEO", fontsize=10.5, color='#94A3B8', pad=10)

    out_img = "post_card.png"
    plt.tight_layout()
    plt.savefig(out_img, dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

    text = (
        f"🛰️ SpaceX Starlink Mega-Constellation Radar!\n"
        f"Weaving a global broadband web around Earth with 6,000+ active satellites in LEO 🌐⚡\n\n"
        f"🌍 Track Starlink Fleet in 3D 👇\n"
        f"{WEBSITE_URL}\n\n"
        f"#Starlink #SpaceX #ElonMusk #Space #Astronomy #Satellite"
    )
    return text, out_img

# -------------------------------------------------------------
# Mode 4: Starlink Train
# -------------------------------------------------------------
def task_starlink_train():
    ts = load.timescale()
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    t = ts.from_datetime(now_utc)

    starlink_file = "data/starlink.txt" if os.path.exists("data/starlink.txt") else "starlink.txt"
    with open(starlink_file, 'r') as f:
        lines = f.readlines()

    recent_sats = []
    for i in range(0, min(len(lines), 180), 3):
        try:
            line1, line2, name = lines[i].strip(), lines[i+1].strip(), lines[i+2].strip()
            recent_sats.append(EarthSatellite(line1, line2, name, ts))
        except:
            pass

    lons, lats = [], []
    for sat in recent_sats:
        try:
            sp = wgs84.subpoint(sat.at(t))
            lons.append(sp.longitude.degrees)
            lats.append(sp.latitude.degrees)
        except:
            pass

    fig, ax = create_base_map()
    ax.scatter(lons, lats, color='#F59E0B', s=35, alpha=0.85, edgecolors='#FFFFFF', linewidth=1)
    ax.scatter(lons, lats, color='#FDE68A', s=80, alpha=0.3)

    utc_str = now_utc.strftime('%Y-%m-%d %H:%M:%S UTC')
    fig.suptitle("SatViewer3D  •  SpaceX Starlink Train & Recent Launch Tracker", fontsize=15, fontweight='bold', color='#F59E0B', y=0.96)
    ax.set_title(f"Time: {utc_str}  |  Tracking Recent Starlink Batch ({len(lons)} Sats)  |  Naked-Eye Visibility", fontsize=10.5, color='#94A3B8', pad=10)

    out_img = "post_card.png"
    plt.tight_layout()
    plt.savefig(out_img, dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

    text = (
        f"✨ SpaceX Starlink Train Tracker!\n"
        f"Ever spotted a 'train of lights' marching across the night sky? Freshly launched satellites in tight formation 🛰️✨\n\n"
        f"🔭 Check Live 3D Trajectory 👇\n"
        f"{WEBSITE_URL}\n\n"
        f"#Starlink #SpaceX #StarlinkTrain #Stargazing #Astronomy #Space"
    )
    return text, out_img

# -------------------------------------------------------------
# Mode 5: Space Debris Risk Radar
# -------------------------------------------------------------
def task_space_debris():
    ts = load.timescale()
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    t = ts.from_datetime(now_utc)

    debris_file = "debris.txt"
    sats = []
    if os.path.exists(debris_file):
        with open(debris_file, 'r') as f:
            lines = f.readlines()
        for i in range(0, min(len(lines), 450), 3):
            try:
                name, line1, line2 = lines[i].strip(), lines[i+1].strip(), lines[i+2].strip()
                sats.append(EarthSatellite(line1, line2, name, ts))
            except:
                pass

    lons, lats = [], []
    for sat in sats:
        try:
            sp = wgs84.subpoint(sat.at(t))
            lons.append(sp.longitude.degrees)
            lats.append(sp.latitude.degrees)
        except:
            pass

    fig, ax = create_base_map()
    ax.scatter(lons, lats, color='#EF4444', s=20, alpha=0.75, edgecolors='none', label='Debris')
    ax.scatter(lons, lats, color='#FCA5A5', s=6, alpha=0.9, edgecolors='none')

    utc_str = now_utc.strftime('%Y-%m-%d %H:%M:%S UTC')
    fig.suptitle("SatViewer3D  •  Orbital Space Debris Risk Radar", fontsize=15, fontweight='bold', color='#EF4444', y=0.96)
    ax.set_title(f"Time: {utc_str}  |  Monitored Debris Sample: {len(lons)} objects  |  24h MOID Collision Radar", fontsize=10.5, color='#94A3B8', pad=10)

    out_img = "post_card.png"
    plt.tight_layout()
    plt.savefig(out_img, dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

    text = (
        f"💥 Orbital Space Debris Collision Radar!\n"
        f"Tracking dangerous space debris fragments traveling at 27,000+ km/h (10x faster than a bullet) 🛡️💥\n\n"
        f"🌍 Real-Time 3D Debris Map 👇\n"
        f"{WEBSITE_URL}\n\n"
        f"#SpaceDebris #Space #NASA #SpaceSafety #Astronomy"
    )
    return text, out_img

# -------------------------------------------------------------
# Mode 6: Hubble Space Telescope
# -------------------------------------------------------------
def task_hubble_live():
    ts = load.timescale()
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    t = ts.from_datetime(now_utc)

    url = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=science&FORMAT=tle'
    satellites = load.tle_file(url)
    by_name = {sat.name: sat for sat in satellites}
    hst = by_name.get('HST', satellites[0])

    subpoint = wgs84.subpoint(hst.at(t))
    lat, lon, alt = subpoint.latitude.degrees, subpoint.longitude.degrees, subpoint.elevation.km

    pos1 = hst.at(t).position.km
    pos2 = hst.at(ts.from_datetime(now_utc + datetime.timedelta(seconds=1))).position.km
    speed_km_h = np.linalg.norm(pos2 - pos1) * 3600

    trail_lons, trail_lats = [], []
    for dt_min in range(-50, 51, 2):
        sp = wgs84.subpoint(hst.at(ts.from_datetime(now_utc + datetime.timedelta(minutes=dt_min))))
        trail_lons.append(sp.longitude.degrees)
        trail_lats.append(sp.latitude.degrees)

    fig, ax = create_base_map()
    trail_lons, trail_lats = np.array(trail_lons), np.array(trail_lats)
    diffs = np.abs(np.diff(trail_lons))
    split_indices = np.where(diffs > 180)[0] + 1
    for lons, lats in zip(np.split(trail_lons, split_indices), np.split(trail_lats, split_indices)):
        ax.plot(lons, lats, color='#F59E0B', linewidth=3.5, alpha=0.4)
        ax.plot(lons, lats, color='#D97706', linewidth=1.8, alpha=0.9)

    ax.scatter([lon], [lat], color='#FBBF24', s=320, zorder=6, edgecolors='#FFFFFF', linewidth=2.5)
    ax.scatter([lon], [lat], color='#FDE68A', s=900, alpha=0.3, zorder=5)

    lat_card = f"{abs(lat):.1f}°{'N' if lat>=0 else 'S'}"
    lon_card = f"{abs(lon):.1f}°{'E' if lon>=0 else 'W'}"
    ax.annotate(
        f"Hubble (HST)\n{lat_card}, {lon_card}", xy=(lon, lat), xytext=(lon + 8, lat + 8),
        color='#FFFFFF', fontsize=11, fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0F172A', edgecolor='#F59E0B', alpha=0.92),
        arrowprops=dict(arrowstyle='->', color='#F59E0B', lw=1.5)
    )

    utc_str = now_utc.strftime('%Y-%m-%d %H:%M:%S UTC')
    fig.suptitle("SatViewer3D  •  Hubble Space Telescope (HST) Live Orbit", fontsize=15, fontweight='bold', color='#F59E0B', y=0.96)
    ax.set_title(f"Time: {utc_str}  |  Altitude: {alt:.1f} km  |  Velocity: {speed_km_h:,.0f} km/h", fontsize=10.5, color='#94A3B8', pad=10)

    out_img = "post_card.png"
    plt.tight_layout()
    plt.savefig(out_img, dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

    ctx = get_location_context(lat, lon)
    text = (
        f"🔭 Hubble Space Telescope (HST) Live!\n"
        f"35 years of unveiling the cosmic mysteries! Silently orbiting over {ctx['region_en']} at {speed_km_h:,.0f} km/h 🌌🔭\n\n"
        f"🔭 3D Orbit Tracker 👇\n"
        f"{WEBSITE_URL}\n\n"
        f"#Hubble #NASA #Astronomy #Space #Stargazing #NightSky"
    )
    return text, out_img

# -------------------------------------------------------------
# Mode 7: Unique Satellite Spotlight (スプートニク1号追加！)
# -------------------------------------------------------------
FEATURED_SATELLITES = [
    {
        "name": "Sputnik 1 (1957)",
        "badge": "First Artificial Satellite in History",
        "fact": "Launched on Oct 4, 1957 by USSR! The first human satellite in history, opening the Space Age with its historic radio beeps 🛰️✨",
        "tag": "Sputnik",
        "color": "#EF4444",
        "accent": "#FCA5A5"
    },
    {
        "name": "Vanguard 1 (1958)",
        "badge": "Oldest Human Satellite in Orbit",
        "fact": "Launched in 1958! This 1.4 kg sphere is the oldest human-made object still orbiting Earth today—expected to orbit for 240+ more years!",
        "tag": "SpaceHistory",
        "color": "#F59E0B",
        "accent": "#FDE68A"
    },
    {
        "name": "LAGEOS-1 (Laser Target)",
        "badge": "8-Million-Year Time Capsule",
        "fact": "A solid brass/aluminum sphere with 426 retroreflectors—no electronics! Carries a message plaque for humans 8 million years in the future 📩✨",
        "tag": "LAGEOS",
        "color": "#10B981",
        "accent": "#A7F3D0"
    }
]

def task_satellite_spotlight():
    sat = random.choice(FEATURED_SATELLITES)
    now_utc = datetime.datetime.now(datetime.timezone.utc)

    fig, ax = create_base_map()
    theta = np.linspace(0, 2*np.pi, 200)
    orbit_x = 140 * np.cos(theta)
    orbit_y = 60 * np.sin(theta)
    ax.plot(orbit_x, orbit_y, color=sat["color"], linewidth=3, alpha=0.8, linestyle='--')

    ax.scatter([0], [0], color=sat["color"], s=450, zorder=6, edgecolors='#FFFFFF', linewidth=2.5)
    ax.scatter([0], [0], color=sat["accent"], s=1100, alpha=0.25, zorder=5)

    ax.annotate(
        f"{sat['name']}\n{sat['badge']}", xy=(0, 0), xytext=(15, 20),
        color='#FFFFFF', fontsize=11, fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.6', facecolor='#0F172A', edgecolor=sat["color"], alpha=0.95),
        arrowprops=dict(arrowstyle='->', color=sat["color"], lw=1.5)
    )

    utc_str = now_utc.strftime('%Y-%m-%d UTC')
    fig.suptitle(f"SatViewer3D  •  Satellite Spotlight: {sat['name']}", fontsize=15, fontweight='bold', color=sat["color"], y=0.96)
    ax.set_title(f"{sat['badge']}  |  3D Celestial Tracker", fontsize=10.5, color='#94A3B8', pad=10)

    out_img = "post_card.png"
    plt.tight_layout()
    plt.savefig(out_img, dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

    text = (
        f"🛰️ Satellite Spotlight: {sat['name']}\n"
        f"✨ {sat['badge']}\n\n"
        f"💡 {sat['fact']}\n\n"
        f"🌍 Track in 3D 👇\n"
        f"{WEBSITE_URL}\n\n"
        f"#Space #Astronomy #NASA #{sat['tag']} #Science"
    )
    return text, out_img

# -------------------------------------------------------------
# メイン実行ルーチン
# -------------------------------------------------------------
MODES = ["ISS_LIVE", "TIANGONG_LIVE", "STARLINK_FLEET", "STARLINK_TRAIN", "SATELLITE_SPOTLIGHT", "HUBBLE_LIVE", "SPACE_DEBRIS"]

def get_next_mode():
    last_mode = None
    if os.path.exists(MODE_FILE):
        try:
            with open(MODE_FILE, "r") as f:
                last_mode = f.read().strip()
        except:
            pass

    if last_mode in MODES:
        next_idx = (MODES.index(last_mode) + 1) % len(MODES)
        return MODES[next_idx]
    return MODES[0]

def run_master_bot(mode=None):
    if not mode:
        mode = get_next_mode()

    print("=" * 60)
    print(f"🛰️ SatViewer3D Master Bot - Running Mode: [{mode}]")
    print("=" * 60)

    if mode == "ISS_LIVE":
        text, img = task_iss_live()
    elif mode == "TIANGONG_LIVE":
        text, img = task_tiangong_live()
    elif mode == "STARLINK_FLEET":
        text, img = task_starlink_fleet()
    elif mode == "STARLINK_TRAIN":
        text, img = task_starlink_train()
    elif mode == "SATELLITE_SPOTLIGHT":
        text, img = task_satellite_spotlight()
    elif mode == "HUBBLE_LIVE":
        text, img = task_hubble_live()
    elif mode == "SPACE_DEBRIS":
        text, img = task_space_debris()
    else:
        text, img = task_iss_live()

    print("\n--- [Tweet Preview] ---")
    print(text)
    print("-----------------------\n")

    success = post_to_x(text, image_path=img, headless=True)
    if success:
        with open(MODE_FILE, "w") as f:
            f.write(mode)
        print(f"🎉 Successfully posted mode [{mode}] to X!")
    else:
        print(f"❌ Failed to post mode [{mode}].")
        sys.exit(1)

if __name__ == "__main__":
    target_mode = sys.argv[1] if len(sys.argv) > 1 else None
    run_master_bot(target_mode)
