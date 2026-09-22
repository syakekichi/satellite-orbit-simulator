import os
import sys
import random
import datetime
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
from skyfield.api import EarthSatellite, load, wgs84
from x_poster import post_to_x
from globe_renderer import render_3d_globe, render_3d_animation

# Windows コンソールの文字コード対応
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Meiryo', 'SimHei', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

WEBSITE_URL = "https://satviewer3d.com"
MODE_FILE = "last_bot_mode.txt"

# X (Twitter) の直リンクスパム判定・インプレッション制限を回避するためのプロフ誘導案内文
LINK_GUIDE = {
    "JA": "🔗 3Dリアルタイム軌道はプロフから👆",
    "EN": "🔗 Track live 3D orbit in bio 👆",
    "ES": "🔗 ¡Simulador 3D en el enlace de nuestro perfil! 👆",
    "ZH": "🔗 实时3D地球模拟器请见个人简介链接👆",
    "RU": "🔗 3D симулятор орбиты по ссылке в профиле👆"
}

# -------------------------------------------------------------
# 地理・言語判定エンジン (5大宇宙言語: ES, RU, ZH, JA, EN)
# -------------------------------------------------------------
def get_location_context(lat, lon):
    """
    緯度経度から地域名と最適な表示言語（ES/RU/ZH/JA/EN）を自動判定。
    - スペイン・中南米: ES (スペイン語 + 英語)
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
            "region_ru": "Япония и Восточная Азия",
            "region_es": "Japón y Asia Oriental"
        }

    # 2. 中国・台湾・香港周辺
    if (18 <= lat <= 53) and (73 <= lon <= 122):
        return {
            "lang": "ZH",
            "region_ja": "中国・東アジア",
            "region_en": "China & East Asia",
            "region_zh": "中国大陆及周边上空",
            "region_ru": "Китай и Восточная Азия",
            "region_es": "China y Asia Oriental"
        }

    # 3. スペイン本土・イベリア半島
    if (35 <= lat <= 44) and (-10 <= lon <= 4):
        return {
            "lang": "ES",
            "region_ja": "スペイン・イベリア半島",
            "region_en": "Spain & Iberian Peninsula",
            "region_zh": "西班牙及伊比利亚半岛",
            "region_ru": "Испания и Пиренейский полуостров",
            "region_es": "España y la Península Ibérica"
        }

    # 4. 中南米（ラテンアメリカ・スペイン語圏）
    if (-55 <= lat <= 33) and (-118 <= lon <= -34):
        return {
            "lang": "ES",
            "region_ja": "中南米・ラテンアメリカ",
            "region_en": "Latin America",
            "region_zh": "拉丁美洲上空",
            "region_ru": "Латинская Америка",
            "region_es": "Latinoamérica"
        }

    # 5. ロシア・ユーラシア・中央アジア
    if (45 <= lat <= 75) and (28 <= lon <= 180):
        return {
            "lang": "RU",
            "region_ja": "ロシア・ユーラシア",
            "region_en": "Russia & Eurasia",
            "region_zh": "俄罗斯及欧亚大陆",
            "region_ru": "Россия и Евразия",
            "region_es": "Rusia y Eurasia"
        }

    # 6. 北米・西欧・大洋・その他世界（ENネイティブ）
    region_en = "Open Ocean"
    if (33 <= lat <= 66.5) and (-170 <= lon <= -50):
        region_en = "North America"
    elif (44 <= lat <= 66.5) and (-15 <= lon <= 28):
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
        "region_ru": region_en,
        "region_es": region_en
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
# Mode 1: ISS Live Tracker (3D地球儀 & 多彩なバリエーション投稿)
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

    trail_points = []
    for dt_min in range(-45, 46, 2):
        sp = wgs84.subpoint(iss.at(ts.from_datetime(now_utc + datetime.timedelta(minutes=dt_min))))
        trail_points.append((sp.latitude.degrees, sp.longitude.degrees))

    ctx = get_location_context(lat, lon)
    
    # 50%の確率で動く3D自転ショートアニメーションGIF、50%で超高精細静止画カード
    use_animation = random.choice([True, False])
    out_img = "post_card.gif" if use_animation else "post_card.png"

    if use_animation:
        render_3d_animation(
            center_lat=lat, center_lon=lon,
            markers=[
                {"lat": lat, "lon": lon, "alt_km": alt, "name": f"ISS ({alt:.0f}km)", "color": "#F43F5E", "size": 8, "is_main": True}
            ],
            trails=[
                {"points": trail_points, "color": "#38BDF8", "width": 3, "alt_km": alt}
            ],
            badge="ISS LIVE ORBIT TRACKER",
            badge_color="#38BDF8",
            title=f"ISS (ZARYA) • {ctx['region_en']}",
            metrics=[
                {"label": "ORBITAL SPEED / 飛行速度", "value": f"{speed_km_h:,.0f} km/h (7.7 km/s)", "color": "#38BDF8"},
                {"label": "CURRENT ALTITUDE / 高度", "value": f"{alt:.1f} km (LEO)", "color": "#F8FAFC"},
                {"label": "FLYOVER REGION / 通過地域", "value": f"{ctx['region_ja']} / {ctx['region_en']}", "color": "#4ADE80"},
                {"label": "COORDINATES / 現在座標", "value": f"{abs(lat):.1f}°{'N' if lat>=0 else 'S'}, {abs(lon):.1f}°{'E' if lon>=0 else 'W'}", "color": "#94A3B8"},
                {"label": "ORBITAL PERIOD / 公転周期", "value": "92.8 min (1日に地球を約16周)", "color": "#FACC15"}
            ],
            site_url="satviewer3d.com",
            num_frames=18,
            fps=10,
            out_path=out_img
        )
    else:
        render_3d_globe(
            center_lat=lat, center_lon=lon,
            markers=[
                {"lat": lat, "lon": lon, "alt_km": alt, "name": f"ISS ({alt:.0f}km)", "color": "#F43F5E", "size": 12, "is_main": True}
            ],
            trails=[
                {"points": trail_points, "color": "#38BDF8", "width": 3, "alt_km": alt}
            ],
            badge="ISS LIVE ORBIT TRACKER",
            badge_color="#38BDF8",
            title=f"ISS (ZARYA) • {ctx['region_en']}",
            metrics=[
                {"label": "ORBITAL SPEED", "value": f"{speed_km_h:,.0f} km/h (7.7 km/s)", "color": "#38BDF8"},
                {"label": "CURRENT ALTITUDE", "value": f"{alt:.1f} km (LEO)", "color": "#F8FAFC"},
                {"label": "FLYOVER REGION", "value": ctx['region_en'][:32], "color": "#4ADE80"},
                {"label": "COORDINATES", "value": f"{abs(lat):.1f}°{'N' if lat>=0 else 'S'}, {abs(lon):.1f}°{'E' if lon>=0 else 'W'}", "color": "#94A3B8"},
                {"label": "ORBITAL PERIOD", "value": "92.8 min (~16 orbits/day)", "color": "#FACC15"}
            ],
            site_url="satviewer3d.com",
            out_path=out_img
        )

    # 世界中の宇宙ファンに向け、英語テキストを標準生成
    templates = [
        (
            f"🛰️ International Space Station (ISS) Live Flyover!\n"
            f"Zooming over {ctx['region_en']} at {speed_km_h:,.0f} km/h ({alt:.0f} km altitude). Visible to the naked eye as a brilliant gliding star under clear twilight skies! 🔭🌌\n\n"
            f"{LINK_GUIDE['EN']}\n"
            f"#ISS #Space #Astronomy #NASA"
        ),
        (
            f"💡 ISS Space Trivia:\n"
            f"Cruising at 7.7 km/s over {ctx['region_en']}! Orbiting Earth every 92 minutes, astronauts witness 16 sunrises and sunsets every 24 hours 🌅🌌\n\n"
            f"{LINK_GUIDE['EN']}\n"
            f"#ISS #SpaceTrivia #NASA"
        ),
        (
            f"🚀 Football-field-sized orbital laboratory in flight!\n"
            f"The ISS is soaring over {ctx['region_en']} at {speed_km_h:,.0f} km/h. Tracking real-time orbital physics live on 3D globe 🛰️✨\n\n"
            f"{LINK_GUIDE['EN']}\n"
            f"#SpaceStation #Orbit #Science"
        )
    ]
    text = random.choice(templates)
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

    trail_points = []
    for dt_min in range(-45, 46, 2):
        sp = wgs84.subpoint(tiangong.at(ts.from_datetime(now_utc + datetime.timedelta(minutes=dt_min))))
        trail_points.append((sp.latitude.degrees, sp.longitude.degrees))

    ctx = get_location_context(lat, lon)
    out_img = "post_card.png"

    # 3D地球儀カード生成
    render_3d_globe(
        center_lat=lat, center_lon=lon,
        markers=[
            {"lat": lat, "lon": lon, "alt_km": alt, "label": f"CSS Tiangong ({alt:.0f}km)", "color": "#F59E0B", "size": 12}
        ],
        trails=[
            {"points": trail_points, "color": "#F59E0B", "width": 3, "alt_km": alt}
        ],
        badge="TIANGONG LIVE TRACKER",
        badge_color="#F59E0B",
        title=f"Tiangong (CSS) • {ctx['region_en']}",
        metrics=[
            {"label": "ORBITAL SPEED", "value": f"{speed_km_h:,.0f} km/h (7.7 km/s)", "color": "#F59E0B"},
            {"label": "CURRENT ALTITUDE", "value": f"{alt:.1f} km (LEO)", "color": "#F8FAFC"},
            {"label": "FLYOVER REGION", "value": ctx['region_en'][:32], "color": "#4ADE80"},
            {"label": "COORDINATES", "value": f"{abs(lat):.1f}°{'N' if lat>=0 else 'S'}, {abs(lon):.1f}°{'E' if lon>=0 else 'W'}", "color": "#94A3B8"},
            {"label": "CORE MODULES", "value": "Tianhe / Wentian / Mengtian", "color": "#FDE68A"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"🛰️ Tiangong Space Station (CSS) Live Orbit Tracker!\n"
            f"Zooming over {ctx['region_en']} at {speed_km_h:,.0f} km/h (~{alt:.0f} km LEO) hosting three taikonauts aboard Tianhe core module 🌌✨\n\n"
            f"{LINK_GUIDE['EN']}\n#Tiangong #SpaceStation #Astronomy"
        ),
        (
            f"💡 Space Trivia: Humanity currently maintains TWO permanently crewed outposts in orbit—the ISS and Tiangong!\n"
            f"Passing over {ctx['region_en']} right now at 7.7 km/s 🛰️✨\n\n"
            f"{LINK_GUIDE['EN']}\n#Tiangong #SpaceScience #Orbit"
        )
    ]
    text = random.choice(templates)
    return text, out_img

# -------------------------------------------------------------
# Mode 3: Spanish & Latin American Satellite Radar (🇪🇸 スペイン・中南米衛星)
# -------------------------------------------------------------
def task_spanish_radar():
    ts = load.timescale()
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    t = ts.from_datetime(now_utc)

    spanish_file = "data/spanish_sats.txt" if os.path.exists("data/spanish_sats.txt") else "spanish_sats.txt"
    with open(spanish_file, 'r') as f:
        lines = f.readlines()

    sats = []
    for i in range(0, len(lines), 3):
        try:
            name, line1, line2 = lines[i].strip(), lines[i+1].strip(), lines[i+2].strip()
            sats.append((name, EarthSatellite(line1, line2, name, ts)))
        except:
            pass

    colors = ['#EF4444', '#F59E0B', '#10B981', '#38BDF8', '#8B5CF6', '#EC4899']
    markers = []
    first_lat, first_lon = 40.4, -3.7 # Madrid / Spain as center default

    for idx, (name, sat) in enumerate(sats):
        try:
            sp = wgs84.subpoint(sat.at(t))
            s_lat, s_lon, s_alt = sp.latitude.degrees, sp.longitude.degrees, sp.elevation.km
            c = colors[idx % len(colors)]
            markers.append({
                "lat": s_lat, "lon": s_lon, "alt_km": s_alt,
                "label": name[:12], "color": c, "size": 8
            })
            if idx == 0:
                first_lat, first_lon = s_lat, s_lon
        except:
            pass

    out_img = "post_card.png"
    render_3d_globe(
        center_lat=first_lat, center_lon=first_lon,
        markers=markers,
        badge="SPAIN & LATAM SATELLITE RADAR",
        badge_color="#EF4444",
        title="Constellation Spain & LATAM",
        metrics=[
            {"label": "PRIMARY SATELLITES", "value": "PAZ (SAR Radar) / SAOCOM 1A/1B", "color": "#EF4444"},
            {"label": "PRIMARY MISSIONS", "value": "Earth Observation & Seismic Radar", "color": "#F8FAFC"},
            {"label": "TRACKED ASSETS", "value": f"{len(markers)} Satellites in LEO & GEO", "color": "#38BDF8"},
            {"label": "TECHNOLOGY", "value": "X-Band & L-Band Synthetic Aperture", "color": "#4ADE80"},
            {"label": "ORBITAL COVERAGE", "value": "Global Coverage with 24h Revisit", "color": "#FACC15"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"📡 Spain & Latin America Radar Fleet in Orbit!\n"
            f"Live Tracking: PAZ (X-band SAR), SAOCOM 1A/1B (giant L-band), and CHEOPS 🛰️✨\n"
            f"All-weather radar mapping soil moisture, floods, and seismic shifts day and night!\n\n"
            f"{LINK_GUIDE['EN']}\n#EarthObservation #Radar #Space"
        ),
        (
            f"🛰️ Earth Radar Sentinel Fleet in Orbit!\n"
            f"Tracking PAZ (X-band SAR) and SAOCOM 1A/1B radar satellites mapping our planet day and night through clouds and storms 📡✨\n\n"
            f"{LINK_GUIDE['EN']}\n#EarthObservation #Radar #Space"
        )
    ]
    text = random.choice(templates)
    return text, out_img

# -------------------------------------------------------------
# Mode 4: Starlink Mega-Constellation
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

    markers = []
    for sat in sats:
        try:
            sp = wgs84.subpoint(sat.at(t))
            s_lat, s_lon, s_alt = sp.latitude.degrees, sp.longitude.degrees, sp.elevation.km
            markers.append({
                "lat": s_lat, "lon": s_lon, "alt_km": s_alt,
                "color": "#00F0FF", "size": 3
            })
        except:
            pass

    out_img = "post_card.png"
    # ランダムまたは現在時刻に応じた経度を中心にして回転
    rot_lon = (now_utc.minute * 6.0) - 180.0
    render_3d_globe(
        center_lat=25.0, center_lon=rot_lon,
        markers=markers,
        badge="SPACEX STARLINK RADAR",
        badge_color="#00F0FF",
        title="Starlink Mega-Constellation",
        metrics=[
            {"label": "CONSTELLATION STATUS", "value": "Over 6,000+ Active Satellites", "color": "#00F0FF"},
            {"label": "ALTITUDE", "value": "540 - 570 km (Low Earth Orbit)", "color": "#F8FAFC"},
            {"label": "PLOTTED ON 3D GLOBE", "value": f"{len(markers)} High-Priority Satellites", "color": "#4ADE80"},
            {"label": "INTERNET COVERAGE", "value": "Global High-Speed Low-Latency", "color": "#FACC15"},
            {"label": "ORBIT SPEED", "value": "Approx. 27,000 km/h (95 min/orbit)", "color": "#94A3B8"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"🌐 SpaceX Starlink Mega-Constellation Live Tracker!\n"
            f"Over 6,000 active broadband satellites wrapping the globe at ~550 km LEO to beam high-speed internet anywhere on Earth 🛰️⚡\n\n"
            f"{LINK_GUIDE['EN']}\n#Starlink #SpaceX #MegaConstellation"
        ),
        (
            f"💡 Autonomous space fleet in low Earth orbit:\n"
            f"Thousands of Starlink satellites continuously coordinate orbital positions and dodge debris using AI and ion thrusters 🤖🛰️\n\n"
            f"{LINK_GUIDE['EN']}\n#SpaceX #Starlink #Technology"
        )
    ]
    text = random.choice(templates)
    return text, out_img

# -------------------------------------------------------------
# Mode 5: Starlink Train (夜空の銀河鉄道・3D軌道)
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

    markers = []
    trail_points = []
    lead_lat, lead_lon = 35.0, 140.0

    for idx, sat in enumerate(recent_sats):
        try:
            sp = wgs84.subpoint(sat.at(t))
            s_lat, s_lon, s_alt = sp.latitude.degrees, sp.longitude.degrees, sp.elevation.km
            if not np.isnan(s_lat) and not np.isnan(s_lon):
                if idx == 0 or (lead_lat == 35.0 and lead_lon == 140.0):
                    lead_lat, lead_lon = s_lat, s_lon
                markers.append({
                    "lat": s_lat, "lon": s_lon, "alt_km": s_alt if not np.isnan(s_alt) else 450.0,
                    "color": "#F59E0B", "size": 6
                })
                trail_points.append((s_lat, s_lon))
        except:
            pass

    out_img = "post_card.png"
    render_3d_globe(
        center_lat=lead_lat, center_lon=lead_lon,
        markers=markers,
        trails=[{"points": trail_points, "color": "#F59E0B", "width": 2, "alt_km": 450.0}] if len(trail_points) > 1 else None,
        badge="STARLINK TRAIN RADAR",
        badge_color="#F59E0B",
        title="SpaceX Starlink Train (Batch)",
        metrics=[
            {"label": "PHENOMENON", "value": "Naked-Eye Starlink Pearl String", "color": "#F59E0B"},
            {"label": "TRAIN FLEET SIZE", "value": f"{len(markers)} Freshly Launched Sats", "color": "#F8FAFC"},
            {"label": "ORBITAL ALTITUDE", "value": "300 - 450 km (Orbit Raising)", "color": "#4ADE80"},
            {"label": "VISIBILITY CONDITION", "value": "Optimal at Dusk / Dawn (Twilight)", "color": "#FACC15"},
            {"label": "ORBIT VELOCITY", "value": "Approx. 27,600 km/h", "color": "#94A3B8"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"✨ Witness the 'Galaxy Express' in the night sky!\n"
            f"SpaceX Starlink Train: Freshly launched satellites orbiting in a glowing single-file pearl-necklace line 🌌🛰️\n\n"
            f"{LINK_GUIDE['EN']}\n#StarlinkTrain #SpaceX #Astronomy"
        ),
        (
            f"💡 Why do Starlink satellites form a glowing train?\n"
            f"Deployed into the same orbit, they travel together for days before slowly spacing out into operational planes! 🛰️✨\n\n"
            f"{LINK_GUIDE['EN']}\n#SpaceTrivia #Starlink #SpaceX"
        )
    ]
    text = random.choice(templates)
    return text, out_img

# -------------------------------------------------------------
# Mode 6: Space Debris Risk Radar (宇宙デブリ・衝突リスク監視)
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

    markers = []
    for sat in sats:
        try:
            sp = wgs84.subpoint(sat.at(t))
            s_lat, s_lon, s_alt = sp.latitude.degrees, sp.longitude.degrees, sp.elevation.km
            markers.append({
                "lat": s_lat, "lon": s_lon, "alt_km": s_alt,
                "color": "#EF4444", "size": 3
            })
        except:
            pass

    out_img = "post_card.png"
    render_3d_globe(
        center_lat=15.0, center_lon=120.0,
        markers=markers,
        badge="SPACE DEBRIS RADAR • WARNING",
        badge_color="#EF4444",
        title="Orbital Space Debris Risk Radar",
        metrics=[
            {"label": "MONITORED OBJECTS", "value": f"{len(markers)} Tracked Cataloged Debris", "color": "#EF4444"},
            {"label": "RELATIVE VELOCITY", "value": "Up to 10 - 15 km/s (Hypersonic)", "color": "#F8FAFC"},
            {"label": "RISK ASSESSMENT", "value": "High Collision Probability in LEO", "color": "#F97316"},
            {"label": "CONGESTED ALTITUDE", "value": "700 - 1,000 km (Critical Belt)", "color": "#FACC15"},
            {"label": "COLLISION AVOIDANCE", "value": "Active Maneuver Shielding Monitored", "color": "#94A3B8"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"💥 Orbital Space Debris Risk Radar!\n"
            f"Dead rocket stages and fragments hurtling at 28,000 km/h (8 km/s)! In LEO, even a 1cm bolt strikes with the explosive force of an anvil 🛡️⚡\n\n"
            f"{LINK_GUIDE['EN']}\n#SpaceDebris #KesslerSyndrome #LEO"
        ),
        (
            f"🛡️ Defending the Orbital Commons:\n"
            f"Tracking thousands of cataloged debris objects threatening the ISS and active satellites. Preventing the runaway Kessler Syndrome chain reaction 🛰️💥\n\n"
            f"{LINK_GUIDE['EN']}\n#SpaceSafety #SpaceScience"
        )
    ]
    text = random.choice(templates)
    return text, out_img

# -------------------------------------------------------------
# Mode 7: Hubble Space Telescope (ハッブル宇宙望遠鏡・3D軌道)
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

    trail_points = []
    for dt_min in range(-50, 51, 2):
        sp = wgs84.subpoint(hst.at(ts.from_datetime(now_utc + datetime.timedelta(minutes=dt_min))))
        trail_points.append((sp.latitude.degrees, sp.longitude.degrees))

    ctx = get_location_context(lat, lon)
    out_img = "post_card.png"

    render_3d_globe(
        center_lat=lat, center_lon=lon,
        markers=[
            {"lat": lat, "lon": lon, "alt_km": alt, "label": f"HST ({alt:.0f}km)", "color": "#F59E0B", "size": 12}
        ],
        trails=[
            {"points": trail_points, "color": "#F59E0B", "width": 3, "alt_km": alt}
        ],
        badge="HUBBLE SPACE TELESCOPE RADAR",
        badge_color="#F59E0B",
        title=f"Hubble (HST) • {ctx['region_en']}",
        metrics=[
            {"label": "PRIMARY MISSION", "value": "Deep Space Optical Observatory", "color": "#F59E0B"},
            {"label": "ORBIT SPEED", "value": f"{speed_km_h:,.0f} km/h (7.5 km/s)", "color": "#F8FAFC"},
            {"label": "CURRENT ALTITUDE", "value": f"{alt:.1f} km (LEO)", "color": "#4ADE80"},
            {"label": "ORBITAL PERIOD", "value": "95.4 min (~15 orbits/day)", "color": "#FACC15"},
            {"label": "SERVICE TIMELINE", "value": "1990 - Present (35+ Years Active)", "color": "#94A3B8"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"🔭 Hubble Space Telescope (HST) Live Orbit Tracker!\n"
            f"Cruising at {speed_km_h:,.0f} km/h over {ctx['region_en']} (~{alt:.0f} km altitude). Celebrating 35+ years of peering deep into the cosmos 🌌✨\n\n"
            f"{LINK_GUIDE['EN']}\n#Hubble #NASA #Astronomy"
        ),
        (
            f"💡 Hubble's Incredible Precision:\n"
            f"While orbiting at 27,000 km/h, Hubble locks onto targets with the accuracy of holding a laser beam steady on a hair 1.6 km away! 🔭✨\n\n"
            f"{LINK_GUIDE['EN']}\n#Hubble #SpaceTrivia #NASA"
        )
    ]
    text = random.choice(templates)
    return text, out_img

# -------------------------------------------------------------
# Mode 8: Unique Satellite Spotlight (注目衛星スポットライト - 圧巻の全220選・日英バイリンガル対応)
# -------------------------------------------------------------
FEATURED_SATELLITES = [   {   'id': 'MICHIBIKI-7',
        'name': 'みちびき7号機 (QZS-7 / JAXA)',
        'badge': '日本の悲願！米GPS完全独立の7機体制',
        'color': '#EAB308',
        'lat': 35.0,
        'lon': 139.0,
        'alt': 35786,
        'story_ja': '🗾【米GPSから独立！みちびき7号機】\n'
                    '2026年H3で打上げ！米GPSに頼らず日本単独で24時間365日センチ級測位を維持する重要衛星📡\n'
                    '💡【トリビア】積まれた水素原子時計の精度は「数百万年に1秒のズレ」！',
        'tags': '#みちびき #QZSS',
        'name_en': 'Michibiki-7 (QZS-7 / JAXA)',
        'story_en': '🗾 [Michibiki-7 / JAXA]\n'
                    "Japan's 7-satellite constellation for 24/7 cm-level positioning without US GPS! 📡\n"
                    '💡 Trivia: Its hydrogen maser clock drifts only 1 sec every few million years!',
        'tags_en': '#Michibiki #QZSS #JAXA #GPS'},
    {   'id': 'ALOS-4',
        'name': 'だいち4号 (ALOS-4 / JAXA)',
        'badge': '夜も豪雨も透視する最新鋭SARレーダー',
        'color': '#38BDF8',
        'lat': 35.68,
        'lon': 139.76,
        'alt': 628,
        'story_ja': '🛡️【豪雨も夜の闇も透視！だいち4号】\n'
                    '幅20mの巨大アンテナから電波を放ち、地震や火山の地殻変動を宇宙からミリ単位で即座に検出📡\n'
                    '💡【トリビア】先代だいち2号から観測幅が4倍（200km）に拡大！日本全土を見守ります。',
        'tags': '#だいち4号 #JAXA',
        'name_en': 'ALOS-4 (Daichi-4 / JAXA)',
        'story_en': '🛡️ [ALOS-4 / JAXA]\n'
                    "Japan's radar satellite piercing night & storms to detect ground shifts in millimeters! 📡\n"
                    '💡 Trivia: Swath width expanded 4x (200km) to scan all Japan in a single pass.',
        'tags_en': '#ALOS4 #JAXA #EarthObservation'},
    {   'id': 'ALOS-2',
        'name': 'だいち2号 (ALOS-2 / JAXA)',
        'badge': '能登半島地震でも活躍した不屈のレーダー',
        'color': '#0284C7',
        'lat': 35.0,
        'lon': 136.0,
        'alt': 628,
        'story_ja': '🇯🇵【能登の地殻変動を暴いた不屈の眼：だいち2号】\n'
                    '幾多の大地震で道路寸断や最大4mの海岸隆起をいち早く捉え救助を支えたJAXAの巨星🛰️\n'
                    '💡【トリビア】寿命5年を大きく超え10年以上も現役稼働する伝説の守護神！',
        'tags': '#だいち2号 #JAXA',
        'name_en': 'ALOS-2 (Daichi-2 / JAXA)',
        'story_en': '🇯🇵 [ALOS-2 / JAXA]\n'
                    'Revealed 4m ground shifts during the Noto quake, aiding disaster rescue from orbit! 🛰️\n'
                    '💡 Trivia: Built for 5 years, this radar sentinel has operated for over a decade!',
        'tags_en': '#ALOS2 #JAXA #EarthObservation'},
    {   'id': 'HIMAWARI-9',
        'name': 'ひまわり9号 (Himawari-9)',
        'badge': '3.6万kmから見守る気象の守護神',
        'color': '#06B6D4',
        'lat': 0.0,
        'lon': 140.7,
        'alt': 35786,
        'story_ja': '🛰️【高度3.6万kmから地球を見つめる！ひまわり9号】\n'
                    '宇宙から届く息をのむ地球の姿。日本域を2.5分おきに超高速スキャンし線状降水帯や台風を24時間監視中🌏🌀\n'
                    '💡【トリビア】地球半球全体をわずか10分で丸ごとカラー撮影！',
        'tags': '#ひまわり9号 #気象衛星',
        'name_en': 'Himawari-9 (Weather Sentinel)',
        'story_en': '🛰️ [Himawari-9 / Japan Met]\n'
                    'Scans Japan every 2.5 minutes in color to track typhoons 24/7 from 36,000 km! 🌏🌀\n'
                    '💡 Trivia: Captures an entire hemisphere of the Earth every 10 minutes!',
        'tags_en': '#Himawari9 #Weather #Space'},
    {   'id': 'HIMAWARI-8',
        'name': 'ひまわり8号 (Himawari-8)',
        'badge': '世界の気象観測を一変させた伝説の名機',
        'color': '#0EA5E9',
        'lat': 0.0,
        'lon': 140.7,
        'alt': 35786,
        'story_ja': '🌻【気象衛星の歴史を変えた名機：ひまわり8号】\n'
                    '従来の白黒静止画から「カラー動画」へ世界を一変させた日本の気象衛星✨\n'
                    '💡【トリビア】現在は9号機へバトンタッチしつつ、軌道上でいつでも交代できるよう健全待機中！',
        'tags': '#ひまわり8号 #気象衛星',
        'name_en': 'Himawari-8 (Weather Legend)',
        'story_en': '🌻 [Himawari-8 / Japan Met]\n'
                    'Revolutionized global meteorology by replacing black & white stills with true-color video! ✨\n'
                    '💡 Trivia: Now in standby orbit, ready to step in if its twin fails.',
        'tags_en': '#Himawari8 #Meteorology #Earth'},
    {   'id': 'XRISM',
        'name': 'XRISM (クリズム / JAXA・NASA)',
        'badge': 'マイナス273度で星の死を見つめるX線望遠鏡',
        'color': '#818CF8',
        'lat': 31.0,
        'lon': 131.0,
        'alt': 550,
        'story_ja': '🌌【絶対零度で星の死を見つめる！XRISM】\n'
                    'JAXAとNASAの最新鋭X線天文衛星！ブラックホールに吸い込まれる超高温ガスや元素合成を前例のない精度で分解❄️🔭\n'
                    '💡【トリビア】センサーを絶対零度（-273.1℃）まで極冷して観測！',
        'tags': '#XRISM #JAXA',
        'name_en': 'XRISM (JAXA・NASA)',
        'story_en': '🌌 [XRISM / JAXA & NASA]\n'
                    'Probing black holes and supernovas with unprecedented X-ray spectral precision! ❄️🔭\n'
                    '💡 Trivia: Spectrometer is cooled to -273.1°C, just 0.05°C above absolute zero!',
        'tags_en': '#XRISM #JAXA #NASA #Astronomy'},
    {   'id': 'GOSAT-2',
        'name': 'いぶき2号 (GOSAT-2 / JAXA・環境省)',
        'badge': '宇宙から地球の息づかいを測る環境衛星',
        'color': '#10B981',
        'lat': 40.0,
        'lon': 140.0,
        'alt': 613,
        'story_ja': '🌍【地球の息づかいを測る！いぶき2号】\n'
                    '大気中の二酸化炭素（CO2）やメタン濃度を宇宙から超高精度測定するJAXAの環境衛星🌱🛰️\n'
                    '💡【トリビア】分子が吸収するわずかな「光の指紋」から大都市や森林の排出量を特定！',
        'tags': '#いぶき2号 #GOSAT',
        'name_en': 'Ibuki-2 (GOSAT-2 / JAXA)',
        'story_en': '🌍 [Ibuki-2 (GOSAT-2) / JAXA]\n'
                    'Tracks CO2 and methane from space with extreme accuracy to monitor climate trends! 🌱\n'
                    '💡 Trivia: Analyzes the unique light absorption fingerprints of gas molecules.',
        'tags_en': '#GOSAT2 #ClimateChange #Earth'},
    {   'id': 'GCOM-W',
        'name': 'しずく (GCOM-W / JAXA)',
        'badge': '巨大回転アンテナで地球の水を見つめる',
        'color': '#06B6D4',
        'lat': 30.0,
        'lon': 130.0,
        'alt': 700,
        'story_ja': '🌊【地球の水を見つめる！巨大アンテナ回転衛星『しずく』】\n'
                    '直径2mのパラボラアンテナが毎秒ぐるぐる回り、雲の下の雨や海水温、北極の氷を測定🛰️💧\n'
                    '💡【トリビア】アンテナの回転反作用で本体が逆回転しないよう内部で精密相殺！',
        'tags': '#しずく #GCOMW',
        'name_en': 'Shizuku (GCOM-W / JAXA)',
        'story_en': '🌊 [Shizuku (GCOM-W) / JAXA]\n'
                    'A spinning 2m dish measuring global rain, sea temp, and polar ice through clouds! 🛰️💧\n'
                    '💡 Trivia: Internal reaction wheels counter torque from its spinning 2m dish.',
        'tags_en': '#GCOMW #JAXA #EarthObservation'},
    {   'id': 'GCOM-C',
        'name': 'しきさい (GCOM-C / JAXA)',
        'badge': '19色の光で地球の色彩と海を診断',
        'color': '#14B8A6',
        'lat': 35.0,
        'lon': 140.0,
        'alt': 800,
        'story_ja': '🎨【地球を19色の光で診断！環境ドクター『しきさい』】\n'
                    '近紫外から熱赤外まで19波長で大気の塵や森林、海洋プランクトンをスキャン🌿✨\n'
                    '💡【トリビア】海面のわずかなグラデーションからプランクトンを判別し漁場を予測！',
        'tags': '#しきさい #GCOMC',
        'name_en': 'Shikisai (GCOM-C / JAXA)',
        'story_en': '🎨 [Shikisai (GCOM-C) / JAXA]\n'
                    'Scans global vegetation, aerosols, and plankton across 19 optical wavelengths! 🌿✨\n'
                    '💡 Trivia: Detects subtle ocean color shifts to predict prime fishing zones.',
        'tags_en': '#GCOMC #JAXA #EarthScience'},
    {   'id': 'KIRAMEKI',
        'name': 'きらめき2号 (DSN-2 / 防衛省)',
        'badge': '自衛隊を宇宙から結ぶ初の防衛通信衛星',
        'color': '#6366F1',
        'lat': 0.0,
        'lon': 145.0,
        'alt': 35786,
        'story_ja': '📡【自衛隊を暗号で結ぶ！日本初の防衛通信衛星『きらめき2号』】\n'
                    '陸海空自衛隊の艦艇や航空機をつなぐ高速・大容量の強固な通信網を担う静止衛星🛡️\n'
                    '💡【トリビア】敵の電波妨害や悪天候に強い軍事専用のXバンド周波数帯を使用！',
        'tags': '#きらめき #防衛省',
        'name_en': 'Kirameki-2 (DSN-2 / Defense)',
        'story_en': '📡 [Kirameki-2 / Japan Defense]\n'
                    "Japan's military comms satellite, linking naval fleets and aircraft with jam-proof X-band radio! "
                    '🛡️\n'
                    '💡 Trivia: Engineered to resist extreme electronic warfare and jamming.',
        'tags_en': '#Defense #Satellite #Space'},
    {   'id': 'IGS',
        'name': '情報収集衛星 (IGS-Radar 7)',
        'badge': '日本の安全を守る最高機密レーダー衛星',
        'color': '#475569',
        'lat': 40.0,
        'lon': 135.0,
        'alt': 500,
        'story_ja': '🕵️【日本の安全を守る宇宙の眼！情報収集衛星】\n'
                    '夜間や悪天候下でも電波で地上の動きを鮮明に捉える日本の事実上の偵察衛星🛰️🔍\n'
                    '💡【トリビア】安全保障の根幹に関わるため、撮影画像や正確なスペックは国家機密！',
        'tags': '#情報収集衛星 #IGS',
        'name_en': 'IGS Radar 7 (Reconnaissance)',
        'story_en': '🕵️ [IGS Radar 7 / Japan]\n'
                    'Pierces dark night and stormy clouds with radar to safeguard national security. 🛰️🔍\n'
                    '💡 Trivia: Delivers high-res radar imagery 24/7; exact specs remain top secret!',
        'tags_en': '#IGS #Reconnaissance #Satellite'},
    {   'id': 'QPS-SAR',
        'name': 'QPS-SAR (ツクヨミ-I / 福岡)',
        'badge': '重さ100kg！お椀型アンテナの超小型SAR',
        'color': '#F59E0B',
        'lat': 33.5,
        'lon': 130.4,
        'alt': 550,
        'story_ja': '🛰️【重さわずか100kg！福岡発のお椀型レーダー衛星】\n'
                    '宇宙で直径3.6mのお椀型メッシュパラボラを傘のようにパッと展開し夜間豪雨も透視📡✨\n'
                    '💡【トリビア】従来の大型衛星の数十分の1のコストで同等解像度を実現！',
        'tags': '#QPSSAR #QPS研究所',
        'name_en': 'QPS-SAR (Tsukuyomi-I)',
        'story_en': '🛰️ [QPS-SAR / Japan NewSpace]\n'
                    'Deploys a 3.6m dish to pierce storm clouds at a fraction of traditional costs! 📡✨\n'
                    '💡 Trivia: Its origami-like mesh antenna unfurls in orbit like an umbrella!',
        'tags_en': '#QPSSAR #NewSpace #SmallSat'},
    {   'id': 'STRIX',
        'name': 'StriX-1 (Synspective / 東京)',
        'badge': '数ミリの地盤沈下を見抜く小型SAR網',
        'color': '#06B6D4',
        'lat': 35.6,
        'lon': 139.7,
        'alt': 560,
        'story_ja': '🛰️【ミリ単位の地盤沈下を宇宙から見張る！StriX-1】\n'
                    '東京発ベンチャーの小型レーダー衛星！道路や斜面の数ミリの動きを宇宙から捉えインフラ崩落を防ぐ🛡️\n'
                    '💡【トリビア】折り紙のように畳まれたアンテナを軌道上で幅5mに展開！',
        'tags': '#Synspective #StriX',
        'name_en': 'StriX-1 (Synspective)',
        'story_en': '🛰️ [StriX-1 / Synspective]\n'
                    "Tokyo startup's SAR satellite mapping millimeter ground sinking to protect cities! 🛡️\n"
                    '💡 Trivia: Its 5m slotted-array antenna unfolds in orbit from a compact body.',
        'tags_en': '#Synspective #StriX #Radar'},
    {   'id': 'ADRAS',
        'name': 'ADRAS-J (アストロスケール / 東京)',
        'badge': '宇宙ゴミに数mまで自律接近した歴史的探査機',
        'color': '#10B981',
        'lat': 35.7,
        'lon': 139.8,
        'alt': 600,
        'story_ja': '🇯🇵【回転するロケット残骸へ肉薄！ADRAS-J】\n'
                    '宇宙を高速回転しながら漂う全長11mのロケット残骸に自律接近し世界初の至近距離定点撮影に成功🤖🛰️\n'
                    '💡【トリビア】通信もGPSもない相手にカメラとLiDARだけで目隠し鬼ごっこ！',
        'tags': '#ADRASJ #アストロスケール',
        'name_en': 'ADRAS-J (Astroscale)',
        'story_en': '🇯🇵 [ADRAS-J / Astroscale]\n'
                    'Approached within meters of a tumbling 11m rocket stage, taking close-up photos! 🤖🛰️\n'
                    '💡 Trivia: Inspected non-cooperative dead debris autonomously without GPS!',
        'tags_en': '#ADRASJ #Astroscale #SpaceDebris'},
    {   'id': 'HAYABUSA2',
        'name': 'はやぶさ2 (Hayabusa2 / JAXA)',
        'badge': '小惑星にクレーターを開け砂を持ち帰った不屈の機',
        'color': '#EAB308',
        'lat': 10.0,
        'lon': 130.0,
        'alt': 5000000,
        'story_ja': '☄️【小惑星にクレーターを開け砂を持ち帰った不屈の機！はやぶさ2】\n'
                    'リュウグウで弾丸を撃ち込み地下の砂採取に成功！地球帰還後も次の小惑星へ旅を継続中🪐✨\n'
                    '💡【トリビア】10分で1回転する直径30mの超高速自転天体を目指し航行中！',
        'tags': '#はやぶさ2 #JAXA',
        'name_en': 'Hayabusa2 (Asteroid Sampler / JAXA)',
        'story_en': '☄️ [Hayabusa2 / JAXA]\n'
                    'Blasted a crater into Asteroid Ryugu, grabbed subsurface dust, and returned to Earth! 🪐✨\n'
                    '💡 Trivia: Currently cruising to fast-spinning micro-asteroid 1998 KY26!',
        'tags_en': '#Hayabusa2 #JAXA #Asteroid'},
    {   'id': 'SLIM',
        'name': 'SLIM & SORA-Q (JAXA 月面着陸機)',
        'badge': 'ピンポイント月着陸とおもちゃから生まれた変形ロボ',
        'color': '#FACC15',
        'lat': -13.3,
        'lon': 25.2,
        'alt': 384400,
        'story_ja': '🌕【ピンポイント月着陸とおもちゃ技術の変形ロボ！SLIM】\n'
                    '目標からわずか55mの超高精度で月面着陸！着陸姿を撮影したのはタカラトミー共同開発SORA-Q🤖🇯🇵\n'
                    '💡【トリビア】SORA-Qは野球ボールより小さく250g！玩具の変形技術が月面で開花！',
        'tags': '#SLIM #JAXA',
        'name_en': 'SLIM & SORA-Q (JAXA)',
        'story_en': '🌕 [SLIM & SORA-Q / JAXA]\n'
                    'Achieved pinpoint lunar touchdown within 55m! Photographed by SORA-Q, a transforming robot! 🤖🇯🇵\n'
                    '💡 Trivia: SORA-Q weighs only 250g, co-developed with toy maker Takara Tomy!',
        'tags_en': '#SLIM #MoonLanding #JAXA'},
    {   'id': 'HAYABUSA-1',
        'name': '初代はやぶさ (MUSES-C / JAXA)',
        'badge': '満身創痍で小惑星イトカワから帰還した伝説機',
        'color': '#F59E0B',
        'lat': 0.0,
        'lon': 135.0,
        'alt': 1000000,
        'story_ja': '💫【満身創痍で奇跡の帰還！伝説の初代はやぶさ】\n'
                    'エンジン全停止や燃料漏れを乗り越え小惑星イトカワの微粒子を地球へ持ち帰った不屈の名機🛰️\n'
                    '💡【トリビア】大気圏突入で自らは燃え尽きながら最後に地球の写真を届けました！',
        'tags': '#はやぶさ #イトカワ',
        'name_en': 'Hayabusa (Asteroid Explorer / JAXA)',
        'story_en': '🚀 [First Hayabusa / JAXA]\n'
                    'Overcame engine failures and lost comms to bring Asteroid Itokawa grains to Earth! ☄️🔥\n'
                    '💡 Trivia: Sent a touching final photo of Earth before blazing in the atmosphere.',
        'tags_en': '#Hayabusa #JAXA #DeepSpace'},
    {   'id': 'AKATSUKI',
        'name': 'あかつき (PLANET-C / JAXA金星探査機)',
        'badge': '5年越しのリベンジで金星軌道投入を果たした執念機',
        'color': '#F97316',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 40000000,
        'story_ja': '🪐【5年越しのリベンジ成功！金星探査機あかつき】\n'
                    '主エンジンの故障で金星を通り過ぎる絶望から、5年後に小型姿勢制御エンジンで軌道投入に奇跡の成功🔥\n'
                    '💡【トリビア】金星大気の猛烈な暴風「スーパーローテーション」の謎を解明中！',
        'tags': '#あかつき #金星探査',
        'name_en': 'Akatsuki (Venus Orbiter / JAXA)',
        'story_en': '🌟 [Akatsuki / JAXA]\n'
                    'After engine failure, spent 5 years orbiting the Sun before thrusters saved the mission! 🪐🔥\n'
                    '💡 Trivia: Discovered giant gravity waves stretching 10,000 km across Venus!',
        'tags_en': '#Akatsuki #Venus #JAXA'},
    {   'id': 'KAGUYA',
        'name': 'かぐや (SELENE / JAXA月周回衛星)',
        'badge': '月からの「地球の出」をハイビジョン初撮影',
        'color': '#E2E8F0',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 384400,
        'story_ja': '🌕【満地球の出を鮮明撮影！月探査機かぐや】\n'
                    'アポロ計画以来最大規模の月探査！月のクレーターや重力異常を高精度3Dマッピングした日本の名機🌔\n'
                    '💡【トリビア】月面すれすれから昇る青い地球のハイビジョン映像は世界を感動させました！',
        'tags': '#かぐや #SELENE',
        'name_en': 'Kaguya (SELENE / Lunar Orbiter)',
        'story_en': '🌕 [Kaguya (SELENE) / JAXA]\n'
                    'Historic lunar orbiter mapping gravity and topography across the Moon! 🌔\n'
                    '💡 Trivia: Captured the iconic high-definition video of Earth rising over the Moon.',
        'tags_en': '#Kaguya #SELENE #Moon'},
    {   'id': 'IKAROS',
        'name': 'イカロス (IKAROS / JAXA宇宙ヨット)',
        'badge': '太陽光の圧力だけで航行した世界初のソーラーセイル',
        'color': '#38BDF8',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 50000000,
        'story_ja': '⛵【太陽光の風を受けて飛ぶ！世界初の宇宙ヨットIKAROS】\n'
                    '髪の毛の1/10の薄膜セイルを宇宙で広げ、太陽光子の圧力だけで金星へ航行成功✨\n'
                    '💡【トリビア】燃料ゼロで光の粒（光子）のバウンド力だけで加速するSFを現実に！',
        'tags': '#IKAROS #ソーラーセイル',
        'name_en': 'IKAROS (Solar Sail / JAXA)',
        'story_en': '⛵ [IKAROS / JAXA]\n'
                    'Unfurled a 14m sail thinner than hair, proving photon propulsion on its way to Venus! ✨\n'
                    '💡 Trivia: Accelerated using only sunlight photon pressure without any fuel!',
        'tags_en': '#IKAROS #SolarSail #JAXA'},
    {   'id': 'BEPICOLOMBO-MIO',
        'name': 'みお (BepiColombo MMO / JAXA)',
        'badge': '超灼熱の水星磁気圏へ挑む日欧共同探査機',
        'color': '#F43F5E',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 70000000,
        'story_ja': '☀️【400℃の灼熱世界へ挑む！水星磁気圏探査機みお】\n'
                    'JAXAとESAの共同探査機！太陽に最も近い惑星・水星の謎めいた磁場とプラズマを解き明かす旅へ🚀\n'
                    '💡【トリビア】金星や地球で何度もスイングバイ（重力アシスト）を重ね減速中！',
        'tags': '#みお #BepiColombo',
        'name_en': 'Mio (MMO / JAXA)',
        'story_en': '🪐 [Mio (BepiColombo) / JAXA]\n'
                    'Spinning 15 RPM to distribute 400°C blistering solar heat while probing Mercury! 🛰️🔥\n'
                    '💡 Trivia: Coated with ceramic mirror tiles to deflect intense solar rays.',
        'tags_en': '#BepiColombo #Mio #JAXA'},
    {   'id': 'MMX',
        'name': 'MMX (火星衛星探査計画 / JAXA)',
        'badge': '火星の衛星フォボスから砂を持ち帰る未来の旗艦',
        'color': '#E11D48',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 80000000,
        'story_ja': '🔴【火星の月フォボスから砂を持ち帰る！JAXAのMMX】\n'
                    '火星衛星に着陸し表面サンプルを採取して地球へ帰還する探査計画！火星圏往復へ挑戦🪐\n'
                    '💡【トリビア】フォボスには火星本体から吹き飛ばされた太古の大気や水が含まれる期待！',
        'tags': '#MMX #火星探査',
        'name_en': 'MMX (Phobos Sampler / JAXA)',
        'story_en': '🔴 [MMX / JAXA]\n'
                    "Mission to land on Mars' moon Phobos, scoop surface dust, and fly it back to Earth! 🪐🚀\n"
                    '💡 Trivia: Phobos is thought to hold ancient dust blasted from Mars by impacts.',
        'tags_en': '#MMX #Mars #JAXA'},
    {   'id': 'HITOMI',
        'name': 'ひとみ (ASTRO-H / JAXA)',
        'badge': '短命ながら銀河団の静けさを暴いたX線天文台',
        'color': '#A855F7',
        'lat': 30.0,
        'lon': 130.0,
        'alt': 575,
        'story_ja': '🌌【わずか1ヶ月で大発見を残したX線衛星：ひとみ】\n'
                    '姿勢制御異常で分離消失する直前、銀河団の高温ガスが驚くほど静穏であるデータを遺した悲劇の星🔭\n'
                    '💡【トリビア】その雪辱を果たすべく開発されたのが現役のXRISMです！',
        'tags': '#ひとみ #XRISM',
        'name_en': 'Hitomi (ASTRO-H / JAXA)',
        'story_en': '🌌 [Hitomi (ASTRO-H) / JAXA]\n'
                    'Before losing attitude control, proved hot gas in Perseus cluster is remarkably calm! 🔭\n'
                    '💡 Trivia: Its groundbreaking science directly inspired the new XRISM telescope.',
        'tags_en': '#Hitomi #XRISM #Astronomy'},
    {   'id': 'HALCA',
        'name': 'はるか (HALCA / スペースVLBI)',
        'badge': '直径3万kmの仮想電波望遠鏡を作った巨大アンテナ',
        'color': '#06B6D4',
        'lat': 20.0,
        'lon': 140.0,
        'alt': 21400,
        'story_ja': '📡【地球より巨大な電波望遠鏡を作った！はるか】\n'
                    '直径8mのメッシュアンテナと地上の望遠鏡を結び「地球の直径の3倍」の超巨大望遠鏡を構築✨\n'
                    '💡【トリビア】ブラックホールから吹き出す光速ジェットの根元を鮮明に撮影！',
        'tags': '#はるか #電波天文学',
        'name_en': 'HALCA (Space VLBI / JAXA)',
        'story_en': '📡 [HALCA / JAXA]\n'
                    "Linked an 8m space dish with ground antennas to create a telescope 3x Earth's size! ✨\n"
                    '💡 Trivia: Imaged relativistic plasma jets shooting from supermassive black holes.',
        'tags_en': '#HALCA #RadioAstronomy #JAXA'},
    {   'id': 'AKARI',
        'name': 'あかり (ASTRO-F / JAXA赤外線衛星)',
        'badge': '全天を赤外線でスキャンし星の誕生を描いた眼',
        'color': '#EC4899',
        'lat': 40.0,
        'lon': 135.0,
        'alt': 700,
        'story_ja': '✨【全天の星のゆりかごを描き出した！あかり】\n'
                    '可視光では宇宙の塵に隠れて見えない星形成領域を、高感度な赤外線で全天くまなくスキャンしたJAXA衛星🔭\n'
                    '💡【トリビア】銀河系内外の130万個を超える赤外線天体カタログを完成！',
        'tags': '#あかり #赤外線天文学',
        'name_en': 'Akari (Infrared Telescope / JAXA)',
        'story_en': '✨ [Akari (ASTRO-F) / JAXA]\n'
                    'Surveyed 96% of the sky in infrared, discovering hundreds of thousands of hidden stars! 🔭\n'
                    '💡 Trivia: Chilled with liquid helium to spot newborn stars behind cosmic dust.',
        'tags_en': '#Akari #Infrared #Astronomy'},
    {   'id': 'ARASE',
        'name': 'あらせ (ERG / JAXAジオスペース探査)',
        'badge': '放射線帯ヴァン・アレン帯の電子加速の謎を解明',
        'color': '#8B5CF6',
        'lat': 25.0,
        'lon': 135.0,
        'alt': 32000,
        'story_ja': '⚡【強烈な放射線の嵐に飛び込む！あらせ】\n'
                    '人工衛星を壊す「キラー電子」が渦巻く放射線帯のど真ん中へ突入し、宇宙嵐で電子が加速する瞬間を観測🛡️\n'
                    '💡【トリビア】宇宙天気の予報精度向上や将来の有人宇宙活動の被ばく対策に貢献！',
        'tags': '#あらせ #宇宙天気',
        'name_en': 'Arase (ERG / JAXA)',
        'story_en': '⚡ [Arase (ERG) / JAXA]\n'
                    'Dives through intense Van Allen radiation to study how electrons reach light speed! 🛡️\n'
                    '💡 Trivia: Proved plasma chorus waves act like natural particle accelerators.',
        'tags_en': '#Arase #VanAllenBelts #Space'},
    {   'id': 'OSUMI',
        'name': 'おおすみ (1970年 / 日本初の人工衛星)',
        'badge': '日本が世界4番目の衛星打ち上げ国となった歴史の原点',
        'color': '#EF4444',
        'lat': 31.0,
        'lon': 131.0,
        'alt': 350,
        'story_ja': '🚀【1970年2月！日本初の人工衛星『おおすみ』】\n'
                    '糸川博士のペンシルロケットから始まった挑戦！米・ソ・仏に続く世界第4位の自力打上げ達成🗾\n'
                    '💡【トリビア】誘導制御なしの無誘導L-4Sロケットで軌道に乗せた奇跡の工学！',
        'tags': '#おおすみ #日本初',
        'name_en': "Osumi (Japan's First Satellite / 1970)",
        'story_en': '🚀 [Osumi / 1970]\n'
                    'Launched Feb 11, 1970! Made Japan the 4th nation to orbit a satellite independently! 🗾\n'
                    '💡 Trivia: Reached orbit using an unguided solid rocket without any guidance computer!',
        'tags_en': '#Osumi #SpaceHistory #Japan'},
    {   'id': 'KOUNOTORI',
        'name': 'こうのとり (HTV / JAXA宇宙補給機)',
        'badge': '9機連続完全成功！ISSを支え続けた日本の誇り',
        'color': '#10B981',
        'lat': 40.0,
        'lon': 140.0,
        'alt': 400,
        'story_ja': '📦【成功率100%！ISSの命を繋いだ日本の宇宙輸送船こうのとり】\n'
                    '大型バッテリーや物資をISSへ輸送し全9機すべて完全成功で有終の美を飾ったJAXAの誇り🚀\n'
                    '💡【トリビア】自律ランデブー接近しロボットアームで掴ませる方式は世界基準に！',
        'tags': '#こうのとり #HTV',
        'name_en': 'Kounotori (HTV / JAXA)',
        'story_en': '📦 [Kounotori (HTV) / JAXA]\n'
                    'Delivered tons of supplies and experiment racks to the ISS with a 100% success rate! 🛰️✨\n'
                    '💡 Trivia: Pioneered the berthing method—captured in orbit by Canadarm2.',
        'tags_en': '#Kounotori #HTV #ISS'},
    {   'id': 'HTV-X',
        'name': 'HTV-X (新型宇宙ステーション補給機)',
        'badge': '将来の月周回ステーション『ゲートウェイ』補給へ',
        'color': '#0284C7',
        'lat': 35.0,
        'lon': 139.0,
        'alt': 400,
        'story_ja': '🚀【こうのとりの後継！進化型補給船HTV-X】\n'
                    'H3ロケットで打ち上げ、ISS物資補給だけでなく月周回ステーション「ゲートウェイ」輸送も視野に🌙\n'
                    '💡【トリビア】輸送能力を1.5倍に増やしながら製造コストを半減させる新設計！',
        'tags': '#HTVX #H3ロケット',
        'name_en': 'HTV-X (Next-Gen Cargo / JAXA)',
        'story_en': '🚀 [HTV-X / JAXA]\n'
                    'Launching on H3 to supply the ISS and the future lunar orbital station Gateway! 🌙\n'
                    '💡 Trivia: Delivers 1.5x more cargo while halving production costs via modular design.',
        'tags_en': '#HTVX #H3 #Gateway #ISS'},
    {   'id': 'TSUBAME',
        'name': 'つばめ (SLATS / JAXA超低高度衛星)',
        'badge': 'ギネス世界記録！最も低い高度167kmを飛んだ衛星',
        'color': '#06B6D4',
        'lat': 35.0,
        'lon': 138.0,
        'alt': 167,
        'story_ja': '🏆【ギネス世界記録！超低高度を飛んだ衛星『つばめ』】\n'
                    '通常は大気抵抗で落下する超低高度（167km）をイオンエンジンで飛び続けたJAXA機✨\n'
                    '💡【トリビア】地表に近いため小型カメラでも驚異の解像度で撮影可能！',
        'tags': '#つばめ #ギネス記録',
        'name_en': 'Tsubame (SLATS / JAXA)',
        'story_en': '🏆 [Tsubame (SLATS) / JAXA]\n'
                    'Flew at an ultra-low 167 km altitude using ion thrusters—earning a Guinness Record! ✨\n'
                    '💡 Trivia: Proved low orbit enables compact cameras to capture extreme detail.',
        'tags_en': '#Tsubame #GuinnessRecord #JAXA'},
    {   'id': 'FUJI',
        'name': 'ふじ3号 (JAS-2 / 日本のアマチュア衛星)',
        'badge': '世界中のアマチュア無線家を結んだ宇宙中継局',
        'color': '#14B8A6',
        'lat': 35.0,
        'lon': 135.0,
        'alt': 1300,
        'story_ja': '📻【世界の無線ファンを宇宙から結んだ！ふじ3号】\n'
                    '日本アマチュア無線連盟とJAXAの小型衛星！宇宙からパケット通信や音声を中継📡✨\n'
                    '💡【トリビア】災害時に地上の通信網が途絶しても個人アンテナで交信できる砦！',
        'tags': '#ふじ3号 #アマチュア無線',
        'name_en': 'Fuji-3 (JAS-2 / Ham Radio)',
        'story_en': '📻 [Fuji-3 (JAS-2) / JAXA & JARL]\n'
                    'Amateur radio satellite relaying voice & packet messages across continents! 📡✨\n'
                    '💡 Trivia: Provided emergency communications when ground networks failed in disasters.',
        'tags_en': '#Fuji3 #AmateurRadio #HamRadio'},
    {   'id': 'MAIDO-1',
        'name': 'まいど1号 (SOHLA-1 / 東大阪中小企業衛星)',
        'badge': '町工場の熱い技術と夢が宇宙へ届いた奇跡',
        'color': '#F59E0B',
        'lat': 34.6,
        'lon': 135.6,
        'alt': 660,
        'story_ja': '🏭【東大阪の町工場が宇宙へ！まいど1号】\n'
                    '中小企業の技術を結集し「町工場の底力」を示した日本のものづくりの結晶🛠️✨\n'
                    '💡【トリビア】宇宙空間で雷の放電現象を観測し大成功！民間宇宙開発の草分けに。',
        'tags': '#まいど1号 #ものづくり',
        'name_en': 'Maido-1 (SOHLA-1 / Osaka)',
        'story_en': '🏭 [Maido-1 / Small Business Space]\n'
                    'Built by passionate small machine shops in Osaka to prove street-level craftsmanship! 🛠️✨\n'
                    '💡 Trivia: Successfully monitored orbital lightning discharge phenomena in orbit.',
        'tags_en': '#Maido1 #NewSpace #Craftsmen'},
    {   'id': 'CUBESAT-XI',
        'name': 'XI-IV (東京大学 / 世界初の実用CubeSat)',
        'badge': '20年以上宇宙で生き続ける10cm角の超小型衛星の父',
        'color': '#3B82F6',
        'lat': 35.7,
        'lon': 139.7,
        'alt': 820,
        'story_ja': '🎓【手のひら10cm角！世界初のCubeSat『XI-IV』】\n'
                    '東京大学が2003年打上げ！重さ1kgの超小型衛星ながら宇宙から地球撮影に成功📷\n'
                    '💡【トリビア】寿命1年の予定が20年以上経った今も電波送信中！世界の大学衛星の原点。',
        'tags': '#CubeSat #東大',
        'name_en': 'XI-IV (Todai CubeSat / 2003)',
        'story_en': '🎓 [XI-IV / University of Tokyo]\n'
                    'Launched in 2003, this 1kg 10cm cube proved tiny CubeSats can take space photos! 📷\n'
                    '💡 Trivia: Built for 1 year, it is still transmitting signals after 20+ years!',
        'tags_en': '#CubeSat #Todai #SmallSat'},
    {   'id': 'GOSAT-GW',
        'name': 'GOSAT-GW (温室効果ガス・水循環観測衛星)',
        'badge': '温室効果ガスといぶき・しずくの能力を統合した最新機',
        'color': '#10B981',
        'lat': 35.0,
        'lon': 139.0,
        'alt': 666,
        'story_ja': '🌍【温室効果ガスと水を1機で監視！GOSAT-GW】\n'
                    '「いぶき」の高精度観測と「しずく」の高性能放射計を統合した次世代フラッグシップ🛰️\n'
                    '💡【トリビア】豪雨の降水量予測と地球温暖化の監視を同時にこなす日本のエース！',
        'tags': '#GOSATGW #地球温暖化',
        'name_en': 'GOSAT-GW (Climate Sentinel / JAXA)',
        'story_en': '🌍 [GOSAT-GW / JAXA]\n'
                    'Combines greenhouse gas tracking and microwave radiometry into a single sentinel! 🛰️\n'
                    '💡 Trivia: Simultaneously predicts typhoon rainfall and monitors global warming.',
        'tags_en': '#GOSATGW #EarthObservation #Climate'},
    {   'id': 'EARTHCARE',
        'name': 'はくりゅう (EarthCARE / 日欧共同開発)',
        'badge': '世界初！雲の内部の粒の落下速度をレーダーで測る',
        'color': '#38BDF8',
        'lat': 45.0,
        'lon': 10.0,
        'alt': 393,
        'story_ja': '🐉【雲の立体構造を透視！はくりゅう（EarthCARE）】\n'
                    'JAXAとESAが共同開発！世界初のミリ波雲レーダーで雲内の水滴落下速度を測定☁️\n'
                    '💡【トリビア】気候変動で最大の謎とされる「雲の温暖化効果」を解明へ！',
        'tags': '#EarthCARE #はくりゅう',
        'name_en': 'Hakuryu (EarthCARE / JAXA・ESA)',
        'story_en': '🐉 [Hakuryu (EarthCARE) / JAXA & ESA]\n'
                    "Carries the world's first Doppler cloud radar to measure falling droplet speeds! ☁️\n"
                    '💡 Trivia: Solves how clouds cool or warm Earth in global climate models.',
        'tags_en': '#EarthCARE #Hakuryu #ESA #JAXA'},
    {   'id': 'VOYAGER-1',
        'name': 'ボイジャー1号 (Voyager 1 / NASA)',
        'badge': '地球から240億km彼方を飛ぶ人類最遠の探査機',
        'color': '#A855F7',
        'lat': 12.0,
        'lon': 18.0,
        'alt': 24000000,
        'story_ja': '🚀【人類史上最も遠くへ旅立った孤独な機：ボイジャー1号】\n'
                    '地球から240億km彼方（光で片道22時間超！）の恒星間空間を今も秒速17kmで航行中🛸✨\n'
                    '💡【トリビア】地球の音や音楽を刻んだ金メッキの『ゴールデンレコード』を搭載！',
        'tags': '#ボイジャー #NASA',
        'name_en': 'Voyager 1 (Interstellar Probe / NASA)',
        'story_en': '🌌 [Voyager 1 / NASA]\n'
                    "Over 24 billion km away, cruising interstellar space beyond the Sun's bubble! 🚀\n"
                    '💡 Trivia: Its radio signals take over 22 hours to travel across space to Earth.',
        'tags_en': '#Voyager1 #NASA #Interstellar'},
    {   'id': 'VOYAGER-2',
        'name': 'ボイジャー2号 (Voyager 2 / NASA)',
        'badge': '木星・土星・天王星・海王星をすべて訪れた唯一の機',
        'color': '#8B5CF6',
        'lat': -35.0,
        'lon': 20.0,
        'alt': 20000000,
        'story_ja': '🪐【太陽系の4大惑星を全制覇！ボイジャー2号】\n'
                    '木星・土星・天王星・海王星を接近探査した人類唯一の探査機！現在も恒星間空間を飛行中🌌\n'
                    '💡【トリビア】海王星の激しい嵐「大暗斑」や天王星の横倒し磁場を発見！',
        'tags': '#ボイジャー2号 #太陽系探査',
        'name_en': 'Voyager 2 (Grand Tour / NASA)',
        'story_en': '🪐 [Voyager 2 / NASA]\n'
                    'The only probe to visit Jupiter, Saturn, Uranus, and Neptune! Now in deep space 🌌\n'
                    "💡 Trivia: Discovered Neptune's Great Dark Spot and Uranus's tilted magnetic field.",
        'tags_en': '#Voyager2 #SolarSystem #NASA'},
    {   'id': 'PIONEER-10',
        'name': 'パイオニア10号 (Pioneer 10 / NASA)',
        'badge': '小惑星帯を初めて突破し木星へ到達した先駆者',
        'color': '#F97316',
        'lat': 26.0,
        'lon': 75.0,
        'alt': 13000000,
        'story_ja': '✨【小惑星帯を人類で初めて突破！パイオニア10号】\n'
                    '未知の小惑星帯を無傷で通り抜け木星に最接近した伝説の探査機！人類と地球を描いた金属板を搭載📜\n'
                    '💡【トリビア】2003年の最後の通信まで30年以上地球へ信号を送り続けました。',
        'tags': '#パイオニア #NASA',
        'name_en': 'Pioneer 10 (Deep Space Probe / NASA)',
        'story_en': '🚀 [Pioneer 10 / NASA]\n'
                    'First craft to cross the asteroid belt and visit Jupiter on a path out of our system! ✨\n'
                    '💡 Trivia: Carries a golden plaque with human figures and galactic coordinates.',
        'tags_en': '#Pioneer10 #NASA #DeepSpace'},
    {   'id': 'NEW-HORIZONS',
        'name': 'ニュー・ホライズンズ (New Horizons / NASA)',
        'badge': '冥王星のハート形氷河を激写した超高速探査機',
        'color': '#38BDF8',
        'lat': -20.0,
        'lon': 100.0,
        'alt': 8000000,
        'story_ja': '💖【冥王星のハート模様を激写！ニューホライズンズ】\n'
                    '時速約5万kmで急行！冥王星の窒素氷河や山脈を世界初激写したNASA探査機🪐\n'
                    '💡【トリビア】冥王星を発見した天文学者トンボーの遺灰の一部を積んで飛行中！',
        'tags': '#ニューホライズンズ #冥王星',
        'name_en': 'New Horizons (Pluto Explorer / NASA)',
        'story_en': '💖 [New Horizons / NASA]\n'
                    'Sped past Pluto at 50,000 km/h, revealing nitrogen glaciers and ice mountains! 🪐\n'
                    '💡 Trivia: Carries ashes of Clyde Tombaugh, who discovered Pluto in 1930.',
        'tags_en': '#NewHorizons #Pluto #NASA'},
    {   'id': 'CASSINI',
        'name': 'カッシーニ (Cassini-Huygens / NASA・ESA)',
        'badge': '土星の輪と衛星エンケラドスの間欠泉を捉えた巨星',
        'color': '#FBBF24',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 14000000,
        'story_ja': '🪐【土星の輪の神秘を暴き尽くした探査機：カッシーニ】\n'
                    '13年間にわたり土星を周回！氷の衛星エンケラドスから吹き出す地下海の熱水間欠泉を発見🌊✨\n'
                    '💡【トリビア】最後は土星の大気圏へ突入し消滅する「グランドフィナーレ」で幕！',
        'tags': '#カッシーニ #土星',
        'name_en': 'Cassini (Saturn Orbiter / NASA・ESA)',
        'story_en': '🪐 [Cassini / NASA & ESA]\n'
                    'Found water geysers erupting on moon Enceladus and probed Saturn across 294 orbits! ❄️\n'
                    '💡 Trivia: Ended with a planned dive into Saturn to protect pristine moons.',
        'tags_en': '#Cassini #Saturn #NASA #ESA'},
    {   'id': 'JUNO',
        'name': 'ジュノー (Juno / NASA木星探査機)',
        'badge': '木星の巨大嵐大赤斑の深部へ迫る極軌道探査機',
        'color': '#F59E0B',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 800000,
        'story_ja': '⚡【木星の厚い雲の底を透視する！探査機ジュノー】\n'
                    '放射線が極めて過酷な木星の極軌道を回り、地球が丸ごと入る巨大嵐「大赤斑」の深さを測定🌪️\n'
                    '💡【トリビア】強力な放射線から電子機器を守るためチタン製の頑丈な装甲室を搭載！',
        'tags': '#ジュノー #木星探査',
        'name_en': 'Juno (Jupiter Explorer / NASA)',
        'story_en': '⚡ [Juno / NASA]\n'
                    "Powered by giant solar panels, swoops within thousands of km of Jupiter's cyclones! 🌀\n"
                    '💡 Trivia: Encased in a 1cm titanium vault to survive blistering radiation.',
        'tags_en': '#Juno #Jupiter #NASA #Astronomy'},
    {   'id': 'PARKER',
        'name': 'パーカー・ソーラー・プローブ (NASA)',
        'badge': '時速70万km！太陽コロナへ飛び込む人類最速機',
        'color': '#EF4444',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 6000000,
        'story_ja': '☀️【時速70万km！太陽コロナへ挑む特攻機】\n'
                    '人類最速（東京〜大阪2.5秒！）。数百万度の超高温コロナへ突撃し太陽風の謎に迫る🔥⚡\n'
                    '💡【トリビア】耐熱盾の表面は1,400℃なのに裏側は室温（約30℃）！',
        'tags': '#パーカーソーラープローブ #太陽',
        'name_en': 'Parker Solar Probe (NASA)',
        'story_en': '☀️ [Parker Solar Probe / NASA]\n'
                    "Flying through the Sun's 1,000,000°C corona at a record-setting 700,000 km/h! 🔥🚀\n"
                    '💡 Trivia: Heat shield endures 1,400°C while instruments stay cool at 30°C.',
        'tags_en': '#ParkerSolarProbe #Sun #NASA'},
    {   'id': 'JWST',
        'name': 'JWST (ジェームズ・ウェッブ宇宙望遠鏡)',
        'badge': '136億年前の初代銀河を見つめる究極の眼',
        'color': '#F59E0B',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 1500000,
        'story_ja': '🔭【136億年前の初代銀河を見る究極の眼：JWST】\n'
                    '150万km離れたL2点に浮かぶ！日よけで冷やされた黄金鏡が宇宙最初の光を捉える🌌✨\n'
                    '💡【トリビア】宇宙で数百個の機構が1つの失敗もなく展開された工学の最高傑作！',
        'tags': '#JWST #宇宙望遠鏡',
        'name_en': 'James Webb Space Telescope (JWST)',
        'story_en': '🔭 [JWST / NASA & ESA]\n'
                    'With its 6.5m gold mirror at L2, JWST captures light from stars born 13.5B years ago! ✨\n'
                    '💡 Trivia: Chilled to -233°C beneath a tennis-court-sized Kapton sunshield.',
        'tags_en': '#JWST #JamesWebb #NASA #Astronomy'},
    {   'id': 'HUBBLE',
        'name': 'ハッブル宇宙望遠鏡 (Hubble Space Telescope)',
        'badge': '35年間宇宙の美と深淵を届け続ける不朽の巨星',
        'color': '#F59E0B',
        'lat': 25.0,
        'lon': -70.0,
        'alt': 520,
        'story_ja': '🔭【35年間宇宙の美を届け続ける不朽の巨星：ハッブル】\n'
                    '大気の揺らぎなしに深宇宙を観測し宇宙の加速膨張を発見した功労者🌌✨\n'
                    '💡【トリビア】時速2.7万kmで周回しながら1.6km先の髪の毛の太さにピントを合わせる制御力！',
        'tags': '#ハッブル #NASA',
        'name_en': 'Hubble Space Telescope (HST)',
        'story_en': '✨ [Hubble Space Telescope / NASA]\n'
                    'For over 30 years, Hubble has captured awe-inspiring nebulas and universe history! 🔭\n'
                    '💡 Trivia: Can lock its pointing beam on a coin 320 km away without jitter!',
        'tags_en': '#Hubble #HST #NASA #Space'},
    {   'id': 'KEPLER',
        'name': 'ケプラー宇宙望遠鏡 (Kepler / NASA)',
        'badge': '2,600個以上の系外惑星を発見した惑星ハンターの祖',
        'color': '#10B981',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 150000000,
        'story_ja': '🪐【2,600個超の太陽系外惑星を発見！ケプラー望遠鏡】\n'
                    '星の前を惑星が横切る影を観測し「宇宙には星の数ほど惑星がある」と証明🔍✨\n'
                    '💡【トリビア】車輪が壊れても太陽光圧を姿勢制御に使って観測続行！',
        'tags': '#ケプラー望遠鏡 #系外惑星',
        'name_en': 'Kepler Space Telescope (NASA)',
        'story_en': '🪐 [Kepler / NASA]\n'
                    'Stared at 150,000 stars to prove our galaxy hosts more planets than stars! 🔍✨\n'
                    '💡 Trivia: Found worlds using solar photon pressure after reaction wheels failed!',
        'tags_en': '#Kepler #Exoplanets #NASA'},
    {   'id': 'TESS',
        'name': 'TESS (系外惑星探索衛星 / NASA)',
        'badge': '地球近傍の明るい星々をスキャンする次世代ハンター',
        'color': '#4ADE80',
        'lat': -20.0,
        'lon': -40.0,
        'alt': 200000,
        'story_ja': '🔍【生命のいる星を探せ！系外惑星ハンターTESS】\n'
                    '全天20万個以上の恒星の瞬きを見張り第2の地球候補を続々発見中🪐\n'
                    '💡【トリビア】月の重力と2:1共鳴する超長楕円軌道を周回し燃料を使わず安定維持！',
        'tags': '#TESS #系外惑星',
        'name_en': 'TESS (Exoplanet Hunter / NASA)',
        'story_en': '🪐 [TESS / NASA]\n'
                    'Monitors hundreds of thousands of nearby stars to spot habitable alien worlds! ✨\n'
                    '💡 Trivia: Operates in an orbit gravitationally resonant with the Moon.',
        'tags_en': '#TESS #Exoplanets #NASA'},
    {   'id': 'CHANDRA',
        'name': 'チャンドラX線観測衛星 (Chandra / NASA)',
        'badge': 'ブラックホール周囲の超高温ガスを激写するX線の眼',
        'color': '#FB7185',
        'lat': 10.0,
        'lon': -80.0,
        'alt': 100000,
        'story_ja': '🌠【ブラックホールを暴く！X線望遠鏡チャンドラ】\n'
                    '高度13万kmから数百万度の高温ガスや超新星残骸を超解像度撮影するNASAの巨星🔭⚡\n'
                    '💡【トリビア】目に見える光では何も見えない暗黒から高エネルギー放射を暴く！',
        'tags': '#チャンドラ #X線天文学',
        'name_en': 'Chandra X-ray Observatory (NASA)',
        'story_en': '🌠 [Chandra / NASA]\n'
                    'Reveals multi-million-degree gas, supernovas, and black hole jets in sharp detail! 🔭⚡\n'
                    '💡 Trivia: Its mirrors are smoothed down to the thickness of just a few atoms!',
        'tags_en': '#Chandra #Xray #NASA #BlackHole'},
    {   'id': 'SPITZER',
        'name': 'スピッツァー宇宙望遠鏡 (Spitzer / NASA)',
        'badge': '赤外線で宇宙の塵の奥を見通した大天文台',
        'color': '#E11D48',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 200000000,
        'story_ja': '✨【塵の向こうの星々を見抜いた！スピッツァー】\n'
                    'NASAの赤外線宇宙望遠鏡！星の誕生現場や系外惑星の大気を鮮明に観測🔭\n'
                    '💡【トリビア】TRAPPIST-1にある7つの地球サイズ惑星を発見する大金星！',
        'tags': '#スピッツァー #NASA',
        'name_en': 'Spitzer Space Telescope (NASA)',
        'story_en': '✨ [Spitzer / NASA]\n'
                    "NASA's Great Observatory, unveiling stellar nurseries and exoplanet atmospheres! 🔭\n"
                    '💡 Trivia: Discovered the 7 Earth-sized rocky planets of TRAPPIST-1!',
        'tags_en': '#Spitzer #TRAPPIST1 #NASA'},
    {   'id': 'PERSEVERANCE',
        'name': 'パーサヴィアランス (Perseverance / 火星探査車)',
        'badge': '太古の火星の生命痕跡を探す原子力ローバー',
        'color': '#EA580C',
        'lat': 18.4,
        'lon': 77.5,
        'alt': 0,
        'story_ja': '🔴【火星で生命の痕跡を探す！パーサヴィアランス】\n'
                    'ジェゼロ・クレーターに着陸した原子力探査車！将来地球へ持ち帰る岩石を密封保管中🪐\n'
                    '💡【トリビア】火星の薄い二酸化炭素から酸素を作る実験（MOXIE）にも成功！',
        'tags': '#パーサヴィアランス #火星',
        'name_en': 'Perseverance Rover (Mars 2020 / NASA)',
        'story_en': '🔴 [Perseverance / NASA]\n'
                    'Extracting rock cores in Jezero Crater for a historic sample return to Earth! 🪐\n'
                    '💡 Trivia: Successfully converted Martian carbon dioxide into oxygen with MOXIE!',
        'tags_en': '#Perseverance #Mars2020 #NASA'},
    {   'id': 'INGENUITY',
        'name': 'インジェニュイティ (Ingenuity / 火星ヘリ)',
        'badge': '地球以外の惑星で人類初飛行したドローンヘリ',
        'color': '#F59E0B',
        'lat': 18.4,
        'lon': 77.5,
        'alt': 0,
        'story_ja': '🚁【火星で人類初の動力飛行！火星ヘリ・インジェニュイティ】\n超希薄大気で二重反転プロペラを毎分2,400回転させ浮空成功！\n💡【トリビア】当初5回飛行予定が72回も飛行した驚異のドローン！',
        'tags': '#インジェニュイティ #火星ヘリ',
        'name_en': 'Ingenuity (Mars Helicopter / NASA)',
        'story_en': '🚁 [Ingenuity / NASA]\n'
                    "Spun twin carbon blades at 2,400 RPM to achieve powered flight in Mars's thin air! 🌬️\n"
                    '💡 Trivia: Designed for only 5 test hops, it completed an astounding 72 flights!',
        'tags_en': '#Ingenuity #MarsHelicopter #NASA'},
    {   'id': 'CURIOSITY',
        'name': 'キュリオシティ (Curiosity / 火星探査車)',
        'badge': '10年以上火星を走り太古のハビタブル環境を証明',
        'color': '#D97706',
        'lat': -4.6,
        'lon': 137.4,
        'alt': 0,
        'story_ja': '🚙【太古の火星の湖跡を走る！キュリオシティ】\n2012年着陸以来、走り続ける軽自動車サイズの大型ローバー！レーザーで岩石分析🧪\n💡【トリビア】有機分子や生命に適した水環境の地層を次々と発見！',
        'tags': '#キュリオシティ #火星探査',
        'name_en': 'Curiosity Rover (NASA)',
        'story_en': '🚙 [Curiosity / NASA]\n'
                    'Nuclear rover climbing Mount Sharp in Gale Crater, proving Mars had ancient lakes! 🧪\n'
                    '💡 Trivia: Zaps rocks with its ChemCam laser to analyze chemical elements.',
        'tags_en': '#Curiosity #Mars #NASA #Rover'},
    {   'id': 'MRO',
        'name': 'マーズ・リコネッサンス・オービター (MRO / NASA)',
        'badge': '火星の地表のローバーまで激写する最強の偵察眼',
        'color': '#C026D3',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 300,
        'story_ja': '🛰️【火星を周回する最強スパイカメラ！MRO】\n'
                    '巨大望遠カメラHiRISEを積み、火星表面のわずか30cmの岩や探査ローバーの姿まで宇宙から激写📸\n'
                    '💡【トリビア】火星ローバーと地球との通信を中継する大容量データ通信の要！',
        'tags': '#MRO #火星軌道船',
        'name_en': 'Mars Reconnaissance Orbiter (NASA)',
        'story_en': '📸 [MRO / NASA]\n'
                    'Its HiRISE camera resolves features as small as a kitchen plate from 300 km above! 🪐\n'
                    '💡 Trivia: Relays the vast majority of scientific data from surface rovers to Earth.',
        'tags_en': '#MRO #HiRISE #Mars #NASA'},
    {   'id': 'DART',
        'name': 'DART (小惑星特攻・地球防衛実験機 / NASA)',
        'badge': '時速22,500kmで小惑星に特攻！人類初の地球防衛',
        'color': '#F97316',
        'lat': 5.0,
        'lon': -50.0,
        'alt': 11000000,
        'story_ja': '💥【時速22,500kmで小惑星に特攻！DART地球防衛実験】\n'
                    '映画を現実に！小惑星の軌道をそらすためNASAの探査機が小惑星ディモルフォスへ体当たり🛡️🌍\n'
                    '💡【トリビア】激突で公転周期を33分短縮させ人類が天体衝突を防げることを初証明！',
        'tags': '#DART #地球防衛',
        'name_en': 'DART (Planetary Defense / NASA)',
        'story_en': '🎯 [DART / NASA]\n'
                    'Slammed into Dimorphos at 6 km/s, shifting its orbit by 33 min in a defense test! 🛡️\n'
                    '💡 Trivia: Proved kinetic impactors can deflect hazardous asteroids away from Earth.',
        'tags_en': '#DART #PlanetaryDefense #NASA'},
    {   'id': 'OSIRIS-REX',
        'name': 'オシリス・レックス (OSIRIS-REx / NASA)',
        'badge': '小惑星ベヌーから大量のサンプルを持ち帰った探査機',
        'color': '#F59E0B',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 20000000,
        'story_ja': '☄️【小惑星の砂を持ち帰った！オシリス・レックス】\n'
                    'ガス噴射で小惑星ベヌーの砂を捕集！2023年に地球へサンプルカプセル投下帰還📦\n'
                    '💡【トリビア】生命の起源に関わるアミノ酸や水を含む炭素質天体！',
        'tags': '#オシリスレックス #小惑星サンプル',
        'name_en': 'OSIRIS-REx (Bennu Sampler / NASA)',
        'story_en': '☄️ [OSIRIS-REx / NASA]\n'
                    'Shot nitrogen gas to grab carbonaceous grains, parachuting them to Earth in 2023! 📦\n'
                    '💡 Trivia: The returned grains contain water and amino acids—the seeds of life!',
        'tags_en': '#OSIRISREx #Asteroid #Bennu'},
    {   'id': 'LUCY',
        'name': 'ルーシー (Lucy / NASA木星トロヤ群探査機)',
        'badge': '木星軌道の前後に潜む化石小惑星群を巡る旅',
        'color': '#EAB308',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 40000000,
        'story_ja': '🦴【太陽系創成期の化石小惑星を巡る旅！ルーシー】\n'
                    '木星のトロヤ群小惑星をめざし12年間で10個以上の小惑星を連続フライバイする大航海探査機🪐\n'
                    '💡【トリビア】人類の祖先の化石人骨「ルーシー」にちなみ太陽系の化石を探す使命！',
        'tags': '#ルーシー #トロヤ群',
        'name_en': 'Lucy (Trojan Asteroid Scout / NASA)',
        'story_en': '🦴 [Lucy / NASA]\n'
                    "Visiting Jupiter's Trojan asteroids—primitive fossils from planet birth 4.5B years ago! 🛰️\n"
                    "💡 Trivia: Powered by twin 7.3m solar arrays, named after the hominin fossil 'Lucy'.",
        'tags_en': '#LucyMission #Trojans #NASA'},
    {   'id': 'PSYCHE',
        'name': 'サイキ (Psyche / NASA金属小惑星探査機)',
        'badge': '鉄とニッケルでできた未知の金属天体へ突撃',
        'color': '#94A3B8',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 30000000,
        'story_ja': '⚔️【惑星の金属核が露出した天体へ！サイキ】\n'
                    '鉄やニッケルなど金属でできた特異な小惑星「プシケ」を探査するNASA機🛰️\n'
                    '💡【トリビア】大気に阻まれて見られない「地球の中心コア」の間接解明に！',
        'tags': '#サイキ #金属小惑星',
        'name_en': 'Psyche (Metal Asteroid Scout / NASA)',
        'story_en': '⚔️ [Psyche / NASA]\n'
                    'Mission to asteroid 16 Psyche, a metallic body of iron and nickel rather than rock! 🛰️\n'
                    "💡 Trivia: Offers humanity's first look into a exposed metallic planetary core.",
        'tags_en': '#MissionToPsyche #Asteroids #NASA'},
    {   'id': 'DAWN',
        'name': 'ドーン (Dawn / NASA小惑星帯探査機)',
        'badge': '小惑星ベスタと準惑星ケレスの2つを周回探査した王者',
        'color': '#64748B',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 25000000,
        'story_ja': '🚀【イオンエンジンで2つの天体をハシゴ周回！ドーン】\n'
                    '巨大小惑星ベスタを探査後、軌道を離脱して準惑星ケレスの周回軌道へ入った史上初の探査機！\n'
                    '💡【トリビア】ケレスのクレーター底で輝く謎の白い塩の塊を発見！',
        'tags': '#ドーン #ケレス',
        'name_en': 'Dawn (Vesta & Ceres Orbiter / NASA)',
        'story_en': '🚀 [Dawn / NASA]\n'
                    'Used ion engines to orbit both Vesta and Ceres, revealing salt-bright craters! ✨\n'
                    "💡 Trivia: Unmasked Ceres's bright spots as sodium carbonate salts from deep brine.",
        'tags_en': '#DawnMission #Ceres #Vesta'},
    {   'id': 'DEEP-IMPACT',
        'name': 'ディープ・インパクト (Deep Impact / NASA)',
        'badge': '彗星へ370kgの銅の弾丸を撃ち込み大爆発を起こした機',
        'color': '#F97316',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 50000000,
        'story_ja': '💥【彗星に弾丸を撃ち込んだ！ディープインパクト】\n'
                    'テンペル彗星へ時速3.7万kmで衝突体を撃ち込み、内部物質を観測した豪快ミッション☄️\n'
                    '💡【トリビア】衝突機にはスペクトル観測を邪魔しない純銅を使用！',
        'tags': '#ディープインパクト #彗星',
        'name_en': 'Deep Impact (Comet Impactor / NASA)',
        'story_en': '💥 [Deep Impact / NASA]\n'
                    'Fired a copper impactor into Comet Tempel 1 at 37,000 km/h to inspect internal ice! ☄️\n'
                    '💡 Trivia: Made of pure copper to avoid interfering with spectral emission lines.',
        'tags_en': '#DeepImpact #Comet #NASA'},
    {   'id': 'STARDUST',
        'name': 'スターダスト (Stardust / NASA彗星探査機)',
        'badge': 'ヴィルト第2彗星の尻尾の塵をエアロゲルで捕獲帰還',
        'color': '#38BDF8',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 35000000,
        'story_ja': '🧊【彗星の塵を持ち帰った！スターダスト】\n超軽量のシリカエアロゲルで超高速の彗星塵を壊さず捕集しカプセル帰還☄️✨\n💡【トリビア】彗星サンプルから生命の基本素材アミノ酸（グリシン）を初検出！',
        'tags': '#スターダスト #彗星塵',
        'name_en': 'Stardust (Comet Dust Sampler / NASA)',
        'story_en': '🧊 [Stardust / NASA]\n'
                    'Captured hypervelocity dust from Comet Wild 2 in aerogel and returned to Earth! ☄️✨\n'
                    '💡 Trivia: Delivered the first extraterrestrial glycine (amino acid) from a comet.',
        'tags_en': '#Stardust #CometDust #NASA'},
    {   'id': 'SDO',
        'name': 'SDO (太陽観測衛星 / NASA)',
        'badge': '超高精細4K動画で太陽フレアを秒単位で常時監視',
        'color': '#EF4444',
        'lat': 0.0,
        'lon': -105.0,
        'alt': 35786,
        'story_ja': '☀️【太陽の超絶大爆発を4Kで常時監視！SDO】\n'
                    '太陽ダイナミクス天文台！黒点から吹き出す巨大プロミネンスや太陽フレアを12秒おきに撮影🔥\n'
                    '💡【トリビア】毎日1.5テラバイトもの膨大な超高画質データを地球へ送り続けています！',
        'tags': '#SDO #太陽フレア',
        'name_en': 'Solar Dynamics Observatory (SDO)',
        'story_en': '☀️ [SDO / NASA]\n'
                    'Takes ultra-HD images of solar flares and magnetic loops every 10 seconds! 🔥\n'
                    '💡 Trivia: Generates an astonishing 1.5 terabytes of raw solar data every day.',
        'tags_en': '#SDO #Sun #SolarPhysics #NASA'},
    {   'id': 'SOHO',
        'name': 'SOHO (太陽・太陽圏探査機 / ESA・NASA)',
        'badge': '太陽を25年以上見張り5,000個以上の新彗星を発見',
        'color': '#F97316',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 1500000,
        'story_ja': '☀️【太陽を見張り5,000個の新彗星を発見！SOHO】\n'
                    'L1点から太陽コロナや太陽風を常時観測！画像から新彗星が続々見つかる大副産物☄️\n'
                    '💡【トリビア】一般市民が公開画像をネットで探して新彗星を発見する快挙も！',
        'tags': '#SOHO #太陽観測',
        'name_en': 'SOHO (Solar Observatory / ESA・NASA)',
        'story_en': '☀️ [SOHO / ESA & NASA]\n'
                    'Observes the solar corona and solar wind continuously from the L1 point! ☄️\n'
                    '💡 Trivia: Citizen scientists examining its public images have discovered 5,000+ comets!',
        'tags_en': '#SOHO #Sun #Comets #NASA'},
    {   'id': 'MESSENGER',
        'name': 'メッセンジャー (MESSENGER / NASA水星周回機)',
        'badge': '灼熱の水星の極域クレーターに氷を発見した探査機',
        'color': '#78716C',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 200,
        'story_ja': '🌑【灼熱の水星で氷を発見！探査機メッセンジャー】\n'
                    '400℃を超える過酷な水星を初周回探査！永久影クレーター底に大量の水氷を発見❄️\n'
                    '💡【トリビア】水星表面の金属比率や磁場の謎を暴き最後に水星へ落下衝突！',
        'tags': '#メッセンジャー #水星',
        'name_en': 'MESSENGER (Mercury Orbiter / NASA)',
        'story_en': '🌑 [MESSENGER / NASA]\n'
                    'First craft to orbit Mercury, discovering abundant water ice in shadowed craters! ❄️\n'
                    '💡 Trivia: Protected from 400°C temperatures by a ceramic woven sunshade.',
        'tags_en': '#MESSENGER #Mercury #NASA'},
    {   'id': 'MAGELLAN',
        'name': 'マゼラン (Magellan / NASA金星探査機)',
        'badge': '分厚い硫酸雲をレーダーで透視し金星全球を地図化',
        'color': '#F59E0B',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 300,
        'story_ja': '🌋【金星の雲をレーダー透視！探査機マゼラン】\n'
                    '硫酸の雲に閉ざされた金星の地表を98%レーダーマッピング！火山や溶岩流の姿を暴く🔥\n'
                    '💡【トリビア】大気でブレーキをかける「エアロブレーキング」技術を初実証！',
        'tags': '#マゼラン #金星レーダー',
        'name_en': 'Magellan (Venus Radar Mapper / NASA)',
        'story_en': '🌋 [Magellan / NASA]\n'
                    "Mapped 98% of Venus's surface through dense sulfuric clouds with radar! 🔥\n"
                    '💡 Trivia: Pioneered aerobraking by dipping into upper atmosphere to reshape its orbit.',
        'tags_en': '#Magellan #Venus #NASA'},
    {   'id': 'LRO',
        'name': 'ルナー・リコネサンス・オービター (LRO / NASA)',
        'badge': 'アポロ月面着陸船の足跡まで写し出す最強の月周回機',
        'color': '#CBD5E1',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 50,
        'story_ja': '🌕【月面のアポロの足跡までクッキリ！月周回機LRO】\n'
                    '月面高度50kmを飛び続け、月の超詳細3D地図を作成！アポロ11号などの着陸船や月面車の轍まで激写📷\n'
                    '💡【トリビア】月の極域クレーターの永久影に潜む水資源の埋蔵地点を特定中！',
        'tags': '#LRO #月探査',
        'name_en': 'Lunar Reconnaissance Orbiter (LRO)',
        'story_en': '🌔 [LRO / NASA]\n'
                    'Circling the Moon since 2009, mapping surface topography down to 50cm resolution! 📸\n'
                    '💡 Trivia: Photographed Apollo landing sites, rover wheel tracks, and descent stages!',
        'tags_en': '#LRO #Moon #NASA #Lunar'},
    {   'id': 'APOLLO-11-CSM',
        'name': 'アポロ11号司令船 (Columbia / 1969年)',
        'badge': '人類初の月面着陸を見届け生還させた宇宙船',
        'color': '#E2E8F0',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 384400,
        'story_ja': '👨\u200d🚀【人類が月に降り立った歴史の母船：コロンビア】\n'
                    '月面にアームストロング船長らが降り立つ間、月軌道で待機し地球へ連れ帰った司令船🌕✨\n'
                    '💡【トリビア】搭載コンピューターのメモリは数KB！現代の電卓以下でした。',
        'tags': '#アポロ11号 #月面着陸',
        'name_en': 'Apollo 11 CSM (Columbia / 1969)',
        'story_en': '👨\u200d🚀 [Apollo 11 Columbia / 1969]\n'
                    'Orbiting the Moon while Armstrong walked on the surface, bringing heroes home! 🌕✨\n'
                    '💡 Trivia: Its guidance computer had just a few kilobytes of RAM—less than a digital watch!',
        'tags_en': '#Apollo11 #MoonLanding #NASA'},
    {   'id': 'ARTEMIS-ORION',
        'name': 'アルテミス1号 オリオン宇宙船 (NASA)',
        'badge': '人類が再び月へ向かう有人月探査の次世代宇宙船',
        'color': '#38BDF8',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 400000,
        'story_ja': '🚀【再び人類を月へ送る！次世代宇宙船オリオン】\n'
                    '大型ロケットSLSで打ち上げられ、月軌道を周回して大気圏再突入に成功した有人月探査船🌙✨\n'
                    '💡【トリビア】アポロ宇宙船よりも広く、月面基地や火星有人探査への足がかりとなる設計！',
        'tags': '#アルテミス #オリオン',
        'name_en': 'Artemis 1 Orion (NASA)',
        'story_en': '🚀 [Artemis 1 Orion / NASA]\n'
                    'Traveled 430,000 km beyond Earth on a test flight to pave the way for human moon bases! 🌙\n'
                    '💡 Trivia: Flew farther from Earth than any spacecraft designed for human astronauts.',
        'tags_en': '#Artemis #Orion #NASA #Moon'},
    {   'id': 'VOYAGER-RECORD',
        'name': 'ゴールデンレコード (ボイジャー探査機搭載)',
        'badge': '地球の音と愛を刻んだ未来の異星人への手紙',
        'color': '#FACC15',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 24000000,
        'story_ja': '📀【10億年残る地球からの手紙：ゴールデンレコード】\n'
                    'ボイジャー搭載の金メッキ銅板レコード！自然の音やバッハの曲、日本語挨拶を収録📜\n'
                    '💡【トリビア】太陽系が滅びた後も銀河を漂い続ける人類のタイムカプセル！',
        'tags': '#ゴールデンレコード #ボイジャー',
        'name_en': 'Voyager Golden Record (NASA)',
        'story_en': '📀 [Voyager Golden Record]\n'
                    'A gold-plated phonograph record carrying Earth sounds, songs, and greetings across space! 📜\n'
                    '💡 Trivia: Engineered to survive interstellar radiation for over a billion years.',
        'tags_en': '#GoldenRecord #Voyager #Cosmos'},
    {   'id': 'X-37B',
        'name': 'X-37B OTV-7 (米宇宙軍スペースプレーン)',
        'badge': '900日以上宇宙を飛び続ける極秘宇宙船',
        'color': '#EF4444',
        'lat': 28.5,
        'lon': -80.6,
        'alt': 400,
        'story_ja': '🚀【900日以上宇宙を飛ぶ米軍の極秘スペースプレーン】\n'
                    '何を積んで何をしているか一切非公開の無人往復船『X-37B』！滑走路へ自律帰還します🛬\n'
                    '💡【トリビア】軌道高度や傾斜角を自在に変更しレーダーから姿を消す怪物機！',
        'tags': '#X37B #米宇宙軍',
        'name_en': 'X-37B Spaceplane (US Space Force)',
        'story_en': '🛸 [X-37B / US Space Force]\n'
                    'Classified robotic spaceplane that flies in orbit for years before landing on a runway! 🛬\n'
                    '💡 Trivia: Set a world record by spending 908 continuous days in orbit!',
        'tags_en': '#X37B #SpaceForce #Spaceplane'},
    {   'id': 'USA-245',
        'name': 'USA-245 (KH-11 KeyHole / 米偵察衛星)',
        'badge': '地上を見下ろす『逆向きのハッブル望遠鏡』',
        'color': '#3B82F6',
        'lat': 38.8,
        'lon': -77.0,
        'alt': 350,
        'story_ja': '👁️【宇宙から地上を見下ろす逆向きハッブル！KH-11】\n'
                    '主鏡サイズ（直径2.4m）はハッブル望遠鏡とほぼ同一！深宇宙ではなく地上を覗き見るスパイ衛星🔭\n'
                    '💡【トリビア】解像度は10cm以下！車の車種や人の様子まで宇宙から識別！',
        'tags': '#KH11 #スパイ衛星',
        'name_en': 'USA-245 (KH-11 Keyhole / NRO)',
        'story_en': '🕵️ [KH-11 Keyhole / NRO]\n'
                    'Hubble-sized spy satellite pointing down at Earth, capturing cm-resolution intel! 🔭🇺🇸\n'
                    "💡 Trivia: Its primary mirror diameter matches Hubble's 2.4m aperture.",
        'tags_en': '#KH11 #NRO #SpySatellite'},
    {   'id': 'ORION',
        'name': 'ORION / Mentor (米国家偵察局 NRO)',
        'badge': '宇宙で直径100mのアンテナを展開する怪物',
        'color': '#8B5CF6',
        'lat': 0.0,
        'lon': -100.0,
        'alt': 35786,
        'story_ja': '🛰️【直径100mの超巨大アンテナ！米軍の怪物スパイ衛星】\n'
                    '米国家偵察局（NRO）のシギント衛星！野球場がまるごと入る巨大メッシュアンテナを宇宙で展開📡\n'
                    '💡【トリビア】3.6万km上空から地上の軍事無線やレーダー電波を傍受！',
        'tags': '#ORION #スパイ衛星',
        'name_en': 'Mentor (Orion / NRO Intel)',
        'story_en': '👂 [Mentor (Orion) / NRO]\n'
                    'Eavesdropping satellite deploying a 100m football-field-sized dish at 36,000 km! 📡\n'
                    '💡 Trivia: Intercepts radio chatter and telemetry across entire continents.',
        'tags_en': '#NRO #SignalsIntel #Satellite'},
    {   'id': 'SBIRS',
        'name': 'SBIRS GEO-5 (米宇宙軍 早期警戒衛星)',
        'badge': 'ミサイル発射の炎を瞬時に探知する盾',
        'color': '#F97316',
        'lat': 0.0,
        'lon': -60.0,
        'alt': 35786,
        'story_ja': '🚀【ミサイル発射炎を宇宙から即座に探知！SBIRS】\n'
                    '米宇宙軍の早期警戒衛星！3.6万km上空から赤外線センサーで地球全土を見張りICBM発射熱を捉える🔥\n'
                    '💡【トリビア】発射からわずか数秒で軌道を計算し迎撃司令部へ緊急アラート！',
        'tags': '#SBIRS #宇宙軍',
        'name_en': 'SBIRS GEO-5 (Missile Warning)',
        'story_en': '🚨 [SBIRS GEO-5 / US Space Force]\n'
                    'Stares at Earth 24/7 with infrared sensors to spot missile rocket plumes instantly! 🔥\n'
                    '💡 Trivia: Detects missile launches within seconds anywhere across the globe.',
        'tags_en': '#SBIRS #SpaceForce #MissileDefense'},
    {   'id': 'GSSAP',
        'name': 'GSSAP-5 Hornet (米宇宙軍 パトロール機)',
        'badge': '静止軌道の暗闇をパトロールする宇宙刑事',
        'color': '#64748B',
        'lat': 0.0,
        'lon': 30.0,
        'alt': 35786,
        'story_ja': '🕵️【静止軌道を漂う米宇宙軍の宇宙刑事：GSSAP】\n'
                    '高度3.6万kmの静止軌道を巡回し、他国の怪しい軍事衛星にこっそり接近してカメラで監視する偵察機🛰️\n'
                    '💡【トリビア】敵の死角から忍び寄りどんな機器を積んでいるか丸裸にします！',
        'tags': '#GSSAP #米宇宙軍',
        'name_en': 'GSSAP Hornet (US Space Force)',
        'story_en': '🐝 [GSSAP Hornet / Space Inspector]\n'
                    'Patrols geostationary orbit to inspect foreign military spacecraft up close! 🕵️\n'
                    '💡 Trivia: Maneuvers close to other satellites to photograph hidden payloads.',
        'tags_en': '#GSSAP #SpaceSurveillance #USSF'},
    {   'id': 'AEHF',
        'name': 'AEHF-6 (米軍最高機密通信衛星)',
        'badge': '核戦争の電磁パルスに耐える大統領の回線',
        'color': '#475569',
        'lat': 0.0,
        'lon': -120.0,
        'alt': 35786,
        'story_ja': '🛡️【核戦争のEMPにも耐える！大統領の最終通信ライン】\n'
                    '米軍の最高機密通信衛星AEHF！核爆発の電磁パルスや極限の妨害電波を受けても通信を維持⚡\n'
                    '💡【トリビア】万が一の核戦争時、大統領が原潜へ命令を伝達する最後の生命線！',
        'tags': '#AEHF #米軍',
        'name_en': 'AEHF-6 (Protected Comms / USSF)',
        'story_en': '🛡️ [AEHF-6 / US Military Fortress]\n'
                    'Jam-resistant satellite built to link nuclear forces through electronic warfare! 📡\n'
                    '💡 Trivia: Hardened against electromagnetic pulses and nuclear bursts.',
        'tags_en': '#AEHF #Military #SpaceSecurity'},
    {   'id': 'WORLDVIEW',
        'name': 'WorldView-3 (Maxar / 米最高峰商用光学)',
        'badge': '地上31cmのマンホールまで識別する商用の眼',
        'color': '#0284C7',
        'lat': 40.0,
        'lon': -105.0,
        'alt': 617,
        'story_ja': '📸【地上31cmのマンホールまで識別！WorldView-3】\n'
                    '世界最高峰の商用観測衛星！宇宙から地上の車の車種や道路標識までくっきりと写し出します🚗✨\n'
                    '💡【トリビア】赤外線カメラで山火事の激しい煙のカーテンを透過して火元を特定！',
        'tags': '#WorldView #Maxar',
        'name_en': 'WorldView-3 (Maxar)',
        'story_en': '📸 [WorldView-3 / Maxar Technologies]\n'
                    'Commercial optical satellite resolving objects as small as 31 cm from 620 km above! 🏢✨\n'
                    '💡 Trivia: Can distinguish car makes and painted road markings from orbit.',
        'tags_en': '#WorldView3 #Maxar #EarthObservation'},
    {   'id': 'LANDSAT',
        'name': 'Landsat-9 (NASA / USGS)',
        'badge': '半世紀にわたり地球の歴史を記録し続ける証人',
        'color': '#15803D',
        'lat': 38.0,
        'lon': -95.0,
        'alt': 705,
        'story_ja': '🌲【1972年から半世紀！地球を記録し続けるLandsat】\n'
                    'NASAとUSGSの地球観測衛星！50年以上途切れず森林減少や都市拡大、氷河後退の歴史を記録中🌏\n'
                    '💡【トリビア】Google Earthのタイムラプス過去動画はこの衛星画像のおかげ！',
        'tags': '#Landsat #NASA',
        'name_en': 'Landsat 9 (NASA・USGS)',
        'story_en': '🌍 [Landsat 9 / NASA & USGS]\n'
                    'Continuing 50+ years of Earth imaging, tracking deforestation and glacier retreat! 🌿\n'
                    "💡 Trivia: Longest continuous space-based record of Earth's land surface.",
        'tags_en': '#Landsat #NASA #USGS #Climate'},
    {   'id': 'TERRA',
        'name': 'Terra (NASA フラッグシップ地球観測機)',
        'badge': '25年間地球の健康診断を続ける伝説の母船',
        'color': '#059669',
        'lat': 20.0,
        'lon': -80.0,
        'alt': 705,
        'story_ja': '🌍【25年以上地球の健康診断を続けるNASAの巨星：Terra】\n'
                    '1999年打ち上げ！大気・陸域・海洋・雪氷を総合診断し気候変動モデルの基礎を築いた伝説機🩺\n'
                    '💡【トリビア】設計寿命はわずか6年でしたが25年以上タフに現役稼働中！',
        'tags': '#Terra #NASA',
        'name_en': 'Terra (EOS AM-1 / NASA)',
        'story_en': '🌏 [Terra / NASA Flagship]\n'
                    'Orbiting since 1999 with 5 sensors like MODIS to monitor climate, fires, and oceans! 🛰️\n'
                    '💡 Trivia: Has tracked major wildfires and volcanic plumes for 25+ years.',
        'tags_en': '#Terra #NASA #EarthObservation'},
    {   'id': 'AQUA',
        'name': 'Aqua (NASA 水循環観測フラッグシップ)',
        'badge': '地球の雲・雪氷・水蒸気を20年見つめる地球ドクター',
        'color': '#0284C7',
        'lat': -20.0,
        'lon': -40.0,
        'alt': 705,
        'story_ja': '💧【地球の水を測り続ける！NASAのAqua】\n'
                    'Terraと対をなすNASAの旗艦衛星！地球の蒸発散量、雲、雪氷を測定し気象予測の精度を支える🛰️\n'
                    '💡【トリビア】午後1時30分に赤道を通過する「A-Train」衛星編隊の先頭リーダー！',
        'tags': '#Aqua #NASA',
        'name_en': 'Aqua (EOS PM-1 / NASA)',
        'story_en': '💧 [Aqua / NASA Water Flagship]\n'
                    "Monitors Earth's water cycle—measuring ocean evaporation, humidity, and rainfall! 🌊\n"
                    "💡 Trivia: Flies in the famous international 'A-Train' satellite formation.",
        'tags_en': '#Aqua #NASA #WaterCycle #Earth'},
    {   'id': 'GOES',
        'name': 'GOES-18 (NOAA 静止気象衛星)',
        'badge': 'ハリケーンの目玉を秒単位で追跡するレーダー眼',
        'color': '#0284C7',
        'lat': 0.0,
        'lon': -137.0,
        'alt': 35786,
        'story_ja': '🌀【ハリケーンの目を秒単位で追う！GOES-18】\n'
                    '米NOAAの静止気象衛星！太平洋から米大陸西部を見張り猛烈なハリケーンや山火事の煙を監視🌊\n'
                    '💡【トリビア】最短30秒間隔で嵐をズーム撮影し竜巻警報の迅速発令に貢献！',
        'tags': '#GOES #NOAA',
        'name_en': 'GOES-18 (NOAA Geostationary)',
        'story_en': '🌀 [GOES-18 / NOAA Weather]\n'
                    'Tracks hurricanes, atmospheric rivers, and lightning flashes across the Pacific 24/7! 🛰️⚡\n'
                    '💡 Trivia: Uses Geostationary Lightning Mapper to track lightning in real time.',
        'tags_en': '#GOES18 #NOAA #Weather #Space'},
    {   'id': 'SWOT',
        'name': 'SWOT (NASA / CNES 地球水循環観測)',
        'badge': '世界の全湖沼と河川の水位を立体3Dスキャン',
        'color': '#0284C7',
        'lat': -15.0,
        'lon': 100.0,
        'alt': 890,
        'story_ja': '🌊【地球上のすべての湖と川を3D立体スキャン！SWOT】\n'
                    'NASAと仏CNESの最新鋭衛星！地球上の95%以上の湖や河川の水位を数cm精度で立体マッピング💧🌏\n'
                    '💡【トリビア】洪水や渇水、温暖化による水資源の危機を宇宙から監視中！',
        'tags': '#SWOT #NASA',
        'name_en': 'SWOT (NASA・CNES Water Sentinel)',
        'story_en': '🌊 [SWOT / NASA & CNES]\n'
                    "Uses radar interferometry to survey water elevation across 95% of Earth's lakes & rivers! 🛰️\n"
                    '💡 Trivia: Measures ocean and freshwater levels within centimeter accuracy.',
        'tags_en': '#SWOT #NASA #CNES #Hydrology'},
    {   'id': 'STARLINK-G10',
        'name': 'Starlink Direct to Cell (SpaceX)',
        'badge': '普通のスマホと宇宙から直接通信する新世代衛星',
        'color': '#38BDF8',
        'lat': 25.0,
        'lon': -90.0,
        'alt': 350,
        'story_ja': '📲【スマホと宇宙から直通！Starlink Direct to Cell】\n'
                    '地上アンテナ不要！普通のスマートフォンと直接LTE電波で通信するスペースXの宇宙基地局📡✨\n'
                    '💡【トリビア】時速2.7万kmで飛ぶ衛星からドップラー効果を補正して電波を届ける！',
        'tags': '#Starlink #SpaceX',
        'name_en': 'Starlink Direct to Cell (SpaceX)',
        'story_en': '📱 [Starlink Direct to Cell / SpaceX]\n'
                    'Equipped with cellular antennas to connect ordinary unmodified smartphones to space! 🛰️\n'
                    '💡 Trivia: Acts as orbiting cellphone towers to eliminate dead zones worldwide.',
        'tags_en': '#Starlink #SpaceX #DirectToCell'},
    {   'id': 'STARLINK',
        'name': 'Starlink Mega-Constellation (SpaceX)',
        'badge': '地球を覆う数千機の衛星インターネット網',
        'color': '#60A5FA',
        'lat': 40.0,
        'lon': -100.0,
        'alt': 550,
        'story_ja': '🛰️【地球を覆う超巨大メガコンステレーション！Starlink】\n'
                    '砂漠や大洋、山岳など地球上のあらゆる場所に高速ネットを届ける数千機の超小型衛星群🌐🚀\n'
                    '💡【トリビア】宇宙空間で衛星同士がレーザー光リンク通信し光ファイバー超え！',
        'tags': '#Starlink #SpaceX',
        'name_en': 'Starlink Constellation (SpaceX)',
        'story_en': '🌐 [Starlink Constellation / SpaceX]\n'
                    'Over 6,000 low-orbit satellites beaming broadband to planes, ships, and remote homes! 🚀\n'
                    '💡 Trivia: Uses krypton & argon ion thrusters and autonomous collision avoidance.',
        'tags_en': '#Starlink #SpaceX #Broadband'},
    {   'id': 'GPS',
        'name': 'GPS NAVSTAR (米宇宙軍 測位衛星)',
        'badge': '現代文明の位置と時刻を支える絶対的インフラ',
        'color': '#3B82F6',
        'lat': 20.0,
        'lon': 0.0,
        'alt': 20200,
        'story_ja': '📱【スマホから社会基盤まで！GPS NAVSTAR】\n'
                    '高度2万kmを周回し地球上のあらゆる場所に高精度の位置と正確無比な協定世界時を提供📡\n'
                    '💡【トリビア】宇宙の時計は毎日38マイクロ秒早く進むためアインシュタインの相対論で補正！',
        'tags': '#GPS #米宇宙軍',
        'name_en': 'GPS III (US Space Force)',
        'story_en': '🧭 [GPS III / US Space Force]\n'
                    'Next-gen navigation satellite delivering 3x accuracy and 8x anti-jamming protection! 🛰️\n'
                    '💡 Trivia: Relativistic time dilation causes GPS clocks to run 38 µs fast daily!',
        'tags_en': '#GPS #Navigation #USSF #Space'},
    {   'id': 'PLANET-DOVE',
        'name': 'Planet Dove (数百機の超小型地球観測衛星群)',
        'badge': '毎日のように地球全陸地をまるごと撮影する群れ',
        'color': '#10B981',
        'lat': 30.0,
        'lon': 120.0,
        'alt': 500,
        'story_ja': '🕊️【地球の全陸地を毎日撮影！Planet Dove】\n'
                    '手のひらサイズのCubeSat数百機が低軌道を周回！地球の全陸地を毎日スキャン🌏📸\n'
                    '💡【トリビア】港の船や駐車場の車数をAI分析し世界経済の動きをリアルタイム把握！',
        'tags': '#PlanetLabs #CubeSat',
        'name_en': 'Planet Dove (CubeSat Flock)',
        'story_en': '🕊️ [Planet Dove / Planet Labs]\n'
                    "A flock of hundreds of shoebox CubeSats scanning Earth's entire landmass every day! 🌏📸\n"
                    '💡 Trivia: AI scans imagery daily to track global port traffic and crop yields.',
        'tags_en': '#PlanetLabs #CubeSat #Earth'},
    {   'id': 'IRIDIUM-NEXT',
        'name': 'Iridium NEXT (全地球衛星通話・航空機追跡網)',
        'badge': '極点から海洋まで世界の空と通信を結ぶ網',
        'color': '#0284C7',
        'lat': 60.0,
        'lon': -40.0,
        'alt': 780,
        'story_ja': '📞【全地球で通話可能！Iridium NEXT】\n'
                    '66機の衛星が地球を包み、圏外ゼロの衛星通話と航空機の全地球追跡（ADS-B）を実現✈️\n'
                    '💡【トリビア】かつて肉眼で夜空に光り輝いた「イリジウムフレア」の二代目！',
        'tags': '#Iridium #衛星通信',
        'name_en': 'Iridium NEXT (Global Network)',
        'story_en': '📞 [Iridium NEXT / Global Comms]\n'
                    '66 cross-linked satellites delivering pole-to-pole calls and flight tracking! ✈️\n'
                    '💡 Trivia: Second generation of the network famous for naked-eye Iridium flares.',
        'tags_en': '#Iridium #Satellite #Space'},
    {   'id': 'ICESAT-2',
        'name': 'ICESat-2 (NASA 氷床レーザー測量衛星)',
        'badge': '秒間1万発のレーザーで地球の氷の厚さを測る',
        'color': '#38BDF8',
        'lat': -75.0,
        'lon': 0.0,
        'alt': 500,
        'story_ja': '❄️【秒間1万発の緑色レーザーで氷を撃つ！ICESat-2】\n'
                    '宇宙からグリーンランドや南極の氷床へ緑色レーザーを照射し、氷の厚さ変化を数cm精度で測定🧊\n'
                    '💡【トリビア】森林の木々の高さや海の波の高さまで宇宙から瞬時に計測！',
        'tags': '#ICESat2 #極地氷床',
        'name_en': 'ICESat-2 (NASA Ice Altimeter)',
        'story_en': '🧊 [ICESat-2 / NASA Ice Sentinel]\n'
                    'Fires green laser pulses 10,000 times/sec to measure glacier and sea-ice thickness! ❄️\n'
                    '💡 Trivia: Can resolve ice sheet height variations down to pencil-thickness!',
        'tags_en': '#ICESat2 #NASA #PolarIce #Climate'},
    {   'id': 'PACE',
        'name': 'PACE (NASA 最新鋭海洋・大気観測機)',
        'badge': '2024年打上げ！海のプランクトンと大気の微粒子を解明',
        'color': '#059669',
        'lat': 10.0,
        'lon': -140.0,
        'alt': 676,
        'story_ja': '🌊【海の色からプランクトンを見分ける！PACE】\n'
                    '2024年打上げのNASA最新鋭機！超多波長カメラで海洋生態系を精密診断🐟\n'
                    '💡【トリビア】CO2を吸収する海のプランクトンの健康状態を宇宙から解読！',
        'tags': '#PACE #海洋生態系',
        'name_en': 'PACE (NASA Ocean Sentinel)',
        'story_en': '🌊 [PACE / NASA Ocean Observer]\n'
                    'Launched in 2024, analyzing ocean plankton colors across hundreds of optical bands! 🐟\n'
                    '💡 Trivia: Diagnoses ocean health to see how seas absorb excess carbon dioxide.',
        'tags_en': '#PACE #NASA #Ocean #Ecology'},
    {   'id': 'CAPELLA-SAR',
        'name': 'Capella Space (米民間 超小型高解像度SAR)',
        'badge': '50cm解像度で夜間豪雨の地表を暴く小型レーダー',
        'color': '#F59E0B',
        'lat': 35.0,
        'lon': -120.0,
        'alt': 500,
        'story_ja': '📡【夜も雲も突き抜ける米民間SAR：Capella Space】\n'
                    '小型衛星ながら分解能50cm！地上を電波で立体的に浮かび上がらせる最新鋭商用レーダー網🛰️\n'
                    '💡【トリビア】打ち上げ時は小さく収納され軌道上で直径3.5mの大型パラボラを展開！',
        'tags': '#CapellaSpace #SAR',
        'name_en': 'Capella Space (Radar Fleet)',
        'story_en': '📡 [Capella Space / Commercial SAR]\n'
                    'Compact radar satellites deploying mesh antennas to capture 50cm radar imagery day & night! 🕵️\n'
                    '💡 Trivia: Images through thick clouds, volcanic smoke, and pitch darkness.',
        'tags_en': '#CapellaSpace #SAR #Radar'},
    {   'id': 'KUIPER',
        'name': 'Project Kuiper (Amazon 衛星ブロードバンド)',
        'badge': 'スペースXに対抗するAmazonの巨大低軌道網',
        'color': '#FF9900',
        'lat': 20.0,
        'lon': -60.0,
        'alt': 600,
        'story_ja': '📦【Amazonが宇宙からネットを届ける！Project Kuiper】\n'
                    '3,000機以上の低軌道衛星で世界中へ高速インターネットを提供するAmazonの巨大宇宙計画🌐\n'
                    '💡【トリビア】プロトタイプ衛星の軌道上テストに完全成功し本格配備へ！',
        'tags': '#ProjectKuiper #Amazon',
        'name_en': 'Project Kuiper (Amazon)',
        'story_en': '🚀 [Project Kuiper / Amazon]\n'
                    "Amazon's planned 3,200+ satellite constellation to deliver fast global broadband! 🌐\n"
                    '💡 Trivia: Prototype satellites successfully validated 100% of test objectives.',
        'tags_en': '#ProjectKuiper #Amazon #Broadband'},
    {   'id': 'ONEWEB',
        'name': 'OneWeb (低軌道衛星インターネット網)',
        'badge': '600機以上の衛星で世界の企業・政府を繋ぐ網',
        'color': '#2563EB',
        'lat': 50.0,
        'lon': 0.0,
        'alt': 1200,
        'story_ja': '🌐【高度1,200kmから世界を繋ぐ！OneWeb】\n'
                    '600機以上の衛星網で南極基地や航空機、遠隔地へブロードバンドを届ける通信網🛰️\n'
                    '💡【トリビア】スターリンクより高度が高いため少ない機数で広範囲をカバー！',
        'tags': '#OneWeb #衛星ブロードバンド',
        'name_en': 'OneWeb (Eutelsat OneWeb)',
        'story_en': '🌐 [OneWeb / Broadband Fleet]\n'
                    '600+ satellites at 1,200 km delivering high-speed internet to airlines and maritime! 🛰️\n'
                    '💡 Trivia: Higher orbit than Starlink, enabling global polar coverage with fewer craft.',
        'tags_en': '#OneWeb #Satellite #Broadband'},
    {   'id': 'ROSETTA',
        'name': 'ロゼッタ & フィラエ (Rosetta / ESA彗星探査機)',
        'badge': '人類史上初めて彗星の周回と着陸を果たした偉業',
        'color': '#38BDF8',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 40000000,
        'story_ja': '☄️【彗星に着陸機を降ろした！欧州ロゼッタ】\n彗星を追跡周回し小型着陸機フィラエを着陸させた人類初の快挙✨\n💡【トリビア】彗星から吹き出す水蒸気成分が地球の海水と異なることを解明！',
        'tags': '#ロゼッタ #彗星探査',
        'name_en': 'Rosetta & Philae (Comet Chaser)',
        'story_en': '☄️ [Rosetta & Philae / ESA]\n'
                    'Escorted Comet 67P and landed the Philae probe on its dusty, icy nucleus! ✨\n'
                    "💡 Trivia: Found that comet water has a different isotopic makeup than Earth's seas.",
        'tags_en': '#Rosetta #Philae #ESA #Comet'},
    {   'id': 'JUICE',
        'name': 'JUICE (ESA 木星氷衛星探査機)',
        'badge': '木星の巨大衛星ガニメデ・エウロパの地下海へ迫る',
        'color': '#6366F1',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 60000000,
        'story_ja': '🌊【木星の氷の下に眠る巨大海を探せ！欧州のJUICE】\n'
                    'ガニメデ、カリスト、エウロパの氷の殻の下に広がる液体の海に生命が存在しうるかを探査中🪐✨\n'
                    '💡【トリビア】日本（JAXA）も観測機器を提供し2031年の木星系到着を目指し航行中！',
        'tags': '#JUICE #木星探査',
        'name_en': 'JUICE (Jupiter Icy Moons / ESA)',
        'story_en': '🪐 [JUICE / ESA Jupiter Mission]\n'
                    'En route to Ganymede, Europa & Callisto—investigating vast subsurface oceans! 🌊\n'
                    '💡 Trivia: Will become the first craft to enter orbit around an icy moon (Ganymede).',
        'tags_en': '#JUICE #ESA #Jupiter #Ganymede'},
    {   'id': 'EUCLID',
        'name': 'ユークリッド (Euclid / ESA暗黒宇宙望遠鏡)',
        'badge': '全宇宙の3Dマップを作り暗黒エネルギーの謎を解く',
        'color': '#A855F7',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 1500000,
        'story_ja': '🌌【暗黒エネルギーの謎を追え！Euclid】\n'
                    'L2点から数百億個の銀河の歪みを測定し、宇宙最大の3D立体地図を作成中🔭\n'
                    '💡【トリビア】宇宙の95%を占める「見えない物質とエネルギー」の正体に迫る！',
        'tags': '#ユークリッド #暗黒エネルギー',
        'name_en': 'Euclid (Dark Universe / ESA)',
        'story_en': '🌌 [Euclid / ESA Dark Universe]\n'
                    'Mapping billions of galaxies across 10B years from L2 to solve dark energy! 🔭\n'
                    '💡 Trivia: Probing the mysterious force accelerating cosmic expansion.',
        'tags_en': '#Euclid #ESA #DarkEnergy #Cosmos'},
    {   'id': 'GAIA',
        'name': 'ガイア (Gaia / ESA恒星位置天文台)',
        'badge': '18億個の星の位置と速度を精密測定した究極の銀河地図',
        'color': '#EC4899',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 1500000,
        'story_ja': '⭐【銀河系の18億個の星を精密3D地図化！Gaia】\n'
                    '星の距離・位置・運動速度を前例のないマイクロ秒角の超精度で測定し天文学の常識を塗り替えた名機🔭✨\n'
                    '💡【トリビア】月から地球上のコインの縁を見分けるほどの驚異的な角度分解能！',
        'tags': '#Gaia #天の川銀河',
        'name_en': 'Gaia (Milky Way Surveyor / ESA)',
        'story_en': '✨ [Gaia / ESA Star Surveyor]\n'
                    "Measuring 3D positions and speeds of 1 billion+ stars to build our galaxy's map! 🔭\n"
                    '💡 Trivia: Precision matches measuring the width of a coin on the Moon from Earth!',
        'tags_en': '#Gaia #ESA #MilkyWay #Astronomy'},
    {   'id': 'PLANCK',
        'name': 'プランク (Planck / ESA宇宙背景放射観測機)',
        'badge': 'ビッグバンの名残の光から宇宙の年齢138億年を確定',
        'color': '#F43F5E',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 1500000,
        'story_ja': '🔥【ビッグバンの化石の光を測定！プランク衛星】\n'
                    '宇宙誕生から38万年後に放たれた「宇宙マイクロ波背景放射」の温度ムラを最高精度で測定🔭\n'
                    '💡【トリビア】宇宙の正確な年齢が「138億年」であることを確定させた歴史的観測！',
        'tags': '#プランク #ビッグバン',
        'name_en': 'Planck (Cosmic Microwave / ESA)',
        'story_en': '🏆 [Planck / ESA Cosmic Surveyor]\n'
                    "Mapped the universe's oldest light, pinpointing its age at 13.8 billion years! 🌌\n"
                    '💡 Trivia: Proved that ordinary atoms make up less than 5% of the cosmos.',
        'tags_en': '#Planck #ESA #Cosmology #Universe'},
    {   'id': 'SOLAR-ORBITER',
        'name': 'ソーラー・オービター (Solar Orbiter / ESA・NASA)',
        'badge': '太陽の北極・南極を人類史上初めて撮影する軌道へ',
        'color': '#F97316',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 42000000,
        'story_ja': '☀️【太陽の極地を見下ろす！ソーラーオービター】\n'
                    '軌道を傾け、地球からは見えない太陽の極域を撮影するESA探査機🔥\n'
                    '💡【トリビア】太陽表面に無数に燃え盛る小型フレア「キャンプファイア」を発見！',
        'tags': '#ソーラーオービター #太陽探査',
        'name_en': 'Solar Orbiter (ESA・NASA)',
        'story_en': '☀️ [Solar Orbiter / ESA & NASA]\n'
                    'Tilting its orbit out of the ecliptic to capture the first direct views of solar poles! 🔥\n'
                    "💡 Trivia: Spotted miniature flare phenomena nicknamed 'campfires' on the Sun.",
        'tags_en': '#SolarOrbiter #ESA #Sun #NASA'},
    {   'id': 'SENTINEL-2A',
        'name': 'Sentinel-2A (ESA コペルニクス光学衛星)',
        'badge': '地球全陸地を5日ごとに無料公開する欧州の誇り',
        'color': '#10B981',
        'lat': 50.0,
        'lon': 10.0,
        'alt': 786,
        'story_ja': '🇪🇺【全地球の陸地を5日おきに無料公開！Sentinel-2A】\n'
                    '欧州コペルニクス計画の主力機！全陸地と沿岸域を5日ごとにフルカラー撮影🌿✨\n'
                    '💡【トリビア】データは世界中へ「完全無料」で公開され農業や森林監視の世界基準に！',
        'tags': '#Sentinel2 #ESA',
        'name_en': 'Sentinel-2A (Copernicus Optical)',
        'story_en': '🌿 [Sentinel-2A / ESA Copernicus]\n'
                    'Captures optical imagery in 13 spectral bands, monitoring agriculture & forests for free! 🌍\n'
                    '💡 Trivia: Its open data policy revolutionized global satellite analytics.',
        'tags_en': '#Sentinel2 #Copernicus #ESA'},
    {   'id': 'SENTINEL-1A',
        'name': 'Sentinel-1A (ESA 全天候Cバンドレーダー)',
        'badge': 'デブリ直撃を生き延びた不屈のレーダー衛星',
        'color': '#0284C7',
        'lat': 60.0,
        'lon': 20.0,
        'alt': 693,
        'story_ja': '📡【デブリ直撃を生き延びた不屈の眼！Sentinel-1A】\n'
                    '昼夜・天候問わずマイクロ波で地表を捉え、地震の地盤変動や火山の噴火を測定🌋❄️\n'
                    '💡【トリビア】軌道上でデブリが太陽電池に直撃し直径40cmの穴が空くも奇跡的に現役継続！',
        'tags': '#Sentinel1 #ESA',
        'name_en': 'Sentinel-1A (Copernicus Radar)',
        'story_en': '📡 [Sentinel-1A / ESA Copernicus]\n'
                    'Provides all-weather C-band radar imaging, mapping floods, oil spills, and sea ice! 🛰️\n'
                    '💡 Trivia: Measures earthquake ground movement down to fractions of a centimeter.',
        'tags_en': '#Sentinel1 #Copernicus #ESA #Radar'},
    {   'id': 'GALILEO',
        'name': 'Galileo (欧州独自 衛星測位システム)',
        'badge': '民間主導で世界最高精度を誇る欧州のGPS',
        'color': '#2563EB',
        'lat': 45.0,
        'lon': 15.0,
        'alt': 23222,
        'story_ja': '🇪🇺【完全民間主導！世界最高精度を誇る欧州のGPSガリレオ】\n'
                    'EUが構築した全球測位システム！軍用起源でなく平和目的の民間主導で誕生📡✨\n'
                    '💡【トリビア】無料信号の精度はGPS超え！遭難信号に「救助要請を受信」と返信する機能も！',
        'tags': '#Galileo #EU',
        'name_en': 'Galileo Navigation System (ESA)',
        'story_en': '🧭 [Galileo / European GNSS]\n'
                    "Europe's civil navigation system, providing sub-meter accuracy to billions of phones! 🇪🇺\n"
                    '💡 Trivia: Its hydrogen maser clocks drift only 1 second every 3 million years.',
        'tags_en': '#Galileo #ESA #GNSS #Navigation'},
    {   'id': 'METEOSAT',
        'name': 'Meteosat-12 (MTG-I1 / 欧州第3世代気象機)',
        'badge': '宇宙から1秒間に数千回の雷放電を捉える眼',
        'color': '#0EA5E9',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 35786,
        'story_ja': '⚡【宇宙から雷の閃光を捉える！Meteosat-12】\n'
                    '欧州の次世代静止気象機！世界初の「稲妻撮像装置」で雲の中の微細放電まで秒間数千回常時監視🌩️\n'
                    '💡【トリビア】突発的な局地豪雨や竜巻の発生を数十分早く警戒可能に！',
        'tags': '#Meteosat #気象衛星',
        'name_en': 'Meteosat-12 (MTG-I1 / EUMETSAT)',
        'story_en': '⚡ [Meteosat-12 / EUMETSAT]\n'
                    "Europe's latest geostationary weather satellite, tracking lightning and storms! 🛰️\n"
                    '💡 Trivia: Scans Europe every 2.5 minutes to catch rapidly developing thunderheads.',
        'tags_en': '#Meteosat #EUMETSAT #Weather'},
    {   'id': 'SARAH',
        'name': 'SARah-1 (ドイツ連邦軍 レーダー偵察機)',
        'badge': '電子スキャンで地表を瞬時に射抜くドイツの眼',
        'color': '#475569',
        'lat': 52.0,
        'lon': 10.0,
        'alt': 500,
        'story_ja': '🇩🇪【フェーズドアレイで地表を瞬時スキャン！SARah-1】\n'
                    'ドイツ連邦軍の最新鋭偵察レーダー衛星！アンテナを動かさず電子走査で複数目標を高精細撮影📡\n'
                    '💡【トリビア】夜間、濃霧、煙幕を貫通し偽装兵器や地下壕の痕跡まで見逃さない！',
        'tags': '#SARah #ドイツ軍',
        'name_en': 'SARah-1 (German Military Radar)',
        'story_en': '🛡️ [SARah-1 / German Armed Forces]\n'
                    'Phased-array radar satellite delivering sharp reconnaissance imagery in any weather! 🛰️\n'
                    '💡 Trivia: Replaced the SAR-Lupe fleet with vastly enhanced electronic steering.',
        'tags_en': '#SARah #Bundeswehr #Military'},
    {   'id': 'PROBA-3',
        'name': 'PROBA-3 (ESA 人工日食フォーメーション衛星)',
        'badge': '150mの距離をミリ単位維持し人工皆既日食を作る',
        'color': '#38BDF8',
        'lat': 20.0,
        'lon': 0.0,
        'alt': 60000,
        'story_ja': '🌑【宇宙で人工皆既日食を作る！PROBA-3】\n'
                    '欧州ESAの編隊飛行衛星！1機が太陽を覆い隠し、150m離れたもう1機がミリ以下の精度で並走✨\n'
                    '💡【トリビア】地上では数分の皆既日食を宇宙で6時間以上作り出して太陽コロナ観測！',
        'tags': '#PROBA3 #日食',
        'name_en': 'PROBA-3 (Artificial Eclipse / ESA)',
        'story_en': '🌑 [PROBA-3 / ESA Formation Flying]\n'
                    'Two satellites flying 150m apart to create an artificial solar eclipse in space! ☀️\n'
                    '💡 Trivia: One craft blocks the Sun so the other can image the faint corona.',
        'tags_en': '#PROBA3 #ESA #SolarEclipse #Sun'},
    {   'id': 'ENVISAT',
        'name': 'エンビサット (Envisat / 巨大漂流デブリ)',
        'badge': '質量8.2トン！軌道を漂う宇宙最大の漂流者',
        'color': '#EF4444',
        'lat': 60.0,
        'lon': 30.0,
        'alt': 780,
        'story_ja': '🛰️【質量8.2トン！宇宙最大の漂流デブリ：エンビサット】\n'
                    '欧州が誇った巨大観測衛星！2012年に突然音信不通となり過密軌道を漂流中⚠️\n'
                    '💡【トリビア】衝突すれば破滅的連鎖を起こすため世界中が24時間体制で監視中！',
        'tags': '#エンビサット #宇宙デブリ',
        'name_en': 'Envisat (Historic Giant / ESA)',
        'story_en': '⚠️ [Envisat / 8-Ton Drifting Giant]\n'
                    "ESA's 8-ton environmental satellite that died in 2012, now a major collision hazard! 💥\n"
                    '💡 Trivia: One of the largest and most dangerous pieces of dead space debris in LEO.',
        'tags_en': '#Envisat #ESA #SpaceDebris'},
    {   'id': 'PAZ',
        'name': 'PAZ (スペインSARレーダー衛星)',
        'badge': '夜間・悪天候を透視するスペインのレーダー眼',
        'color': '#EF4444',
        'lat': 40.4,
        'lon': -3.7,
        'alt': 514,
        'story_ja': '🇪🇸【夜間・悪天候を透視するスペインの眼：PAZ】\n'
                    '雲を透過するマイクロ波で地中海やイベリア半島の地盤沈下や船舶を昼夜ミリ単位監視🛰️📡\n'
                    '💡【トリビア】独TerraSAR-Xと同軌道を飛び2国連携で全地球を高頻度観測！',
        'tags': '#PAZ #スペイン',
        'name_en': 'PAZ (Spanish Radar Satellite)',
        'story_en': '🇪🇸 [PAZ / Spain Military & Civil SAR]\n'
                    'X-band radar satellite providing defense surveillance and flood disaster tracking! 📡\n'
                    '💡 Trivia: Features a radio occultation sensor to profile atmospheric humidity.',
        'tags_en': '#PAZ #Spain #Radar #Hisdesat'},
    {   'id': 'TERRASAR-X',
        'name': 'TerraSAR-X (ドイツ高分解能SAR衛星)',
        'badge': '双子衛星TanDEM-Xと並走し地球陸地を3D化',
        'color': '#14B8A6',
        'lat': 50.0,
        'lon': 10.0,
        'alt': 514,
        'story_ja': '🇩🇪【双子で並走し全地球を3D標高化！TerraSAR-X】\n'
                    '相棒TanDEM-Xと数百mの距離を維持して並走飛行！ミリ秒差で電波を送受信し世界DEM地図を作成🏔️\n'
                    '💡【トリビア】山脈の険しい岩肌から大都市のビルまで立体3D化する驚異の編隊飛行！',
        'tags': '#TerraSARX #ドイツ',
        'name_en': 'TerraSAR-X (DLR & Airbus Radar)',
        'story_en': '📸 [TerraSAR-X / German Radar Master]\n'
                    'Delivers sharp 1m radar imagery, flying in tandem to map Earth in 3D! 🇩🇪\n'
                    '💡 Trivia: Created the first seamless high-precision global elevation model of Earth.',
        'tags_en': '#TerraSARX #DLR #Airbus #Radar'},
    {   'id': 'CHEOPS',
        'name': 'CHEOPS (ESA 系外惑星特性評価衛星)',
        'badge': '既知の系外惑星のサイズと密度を超高精度測定',
        'color': '#60A5FA',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 700,
        'story_ja': '🪐【系外惑星の精密サイズを測る！欧州のCHEOPS】\n'
                    '新惑星を探すのではなく、すでに見つかった惑星の半径を高精度測定し岩石かガス惑星かを判定🔍\n'
                    '💡【トリビア】星の明るさのわずか0.002%の減光を正確に測り取る超高精度光度計！',
        'tags': '#CHEOPS #系外惑星',
        'name_en': 'CHEOPS (Exoplanet Scout / ESA)',
        'story_en': '🪐 [CHEOPS / ESA Exoplanet Precision]\n'
                    'Measures known transiting exoplanets with extreme accuracy to find their radius & density! 🔭\n'
                    '💡 Trivia: Discovered planets deformed into rugby-ball shapes by tidal gravity.',
        'tags_en': '#CHEOPS #ESA #Exoplanets'},
    {   'id': 'AEOLUS',
        'name': 'エオロス (Aeolus / ESA世界初風速レーザー衛星)',
        'badge': '宇宙から大気へ紫外線を撃ち風速を測った風の神',
        'color': '#06B6D4',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 320,
        'story_ja': '💨【宇宙からレーザーで地球の風速を測定！エオロス】\n'
                    '世界初の紫外線ドップラーLiDAR（ALADIN）を搭載！大気分子の散乱から地球全土の風を立体測定🌪️\n'
                    '💡【トリビア】最後は大気圏へ意図的に誘導落下させ安全に退役する初の試みも成功！',
        'tags': '#エオロス #ESA',
        'name_en': 'Aeolus (Wind Lidar / ESA)',
        'story_en': '💨 [Aeolus / ESA Wind Laser Sentinel]\n'
                    'Carried the first space UV Doppler lidar to measure global wind profiles at all altitudes! 🌬️\n'
                    "💡 Trivia: Completed humanity's first assisted safe re-entry into Earth's atmosphere.",
        'tags_en': '#Aeolus #ESA #Lidar'},
    {   'id': 'GOCE',
        'name': 'GOCE (ESA 超低高度 重力勾配観測機)',
        'badge': '地上255kmの極限低高度で地球の重力場を精密測定',
        'color': '#475569',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 255,
        'story_ja': '🏎️【宇宙のF1カー！超低高度を駆け抜けたGOCE】\n'
                    '大気抵抗を減らす流線形ボディ！イオンエンジンで落下を防ぎ地球重力の歪みを測定🌍\n'
                    '💡【トリビア】地球の精密な重力基準面（ジオイド）を割り出し海洋循環の解明に貢献！',
        'tags': '#GOCE #重力ジオイド',
        'name_en': 'GOCE (Gravity Explorer / ESA)',
        'story_en': '🏎️ [GOCE / The Space Formula 1 Car]\n'
                    "Arrow-shaped craft at 250 km using ion thrusters to measure Earth's gravity anomalies! 🌍\n"
                    '💡 Trivia: Mapped the global geoid, revealing ocean currents and tectonic shifts.',
        'tags_en': '#GOCE #ESA #EarthGravity'},
    {   'id': 'CRYOSAT-2',
        'name': 'CryoSat-2 (ESA 極地雪氷レーダー衛星)',
        'badge': '北極海氷とグリーンランド氷床の厚さをミリ単位計測',
        'color': '#38BDF8',
        'lat': 80.0,
        'lon': 0.0,
        'alt': 717,
        'story_ja': '🧊【北極と南極の氷の厚さをミリ単位で追う！CryoSat-2】\n'
                    'レーダー干渉計SIRALで雪氷の高さを測定！地球温暖化による氷床の融解量を精密に可視化❄️\n'
                    '💡【トリビア】先代1号機が打ち上げ失敗で失われた悲劇を乗り越え大成果を継続中！',
        'tags': '#CryoSat2 #氷河融解',
        'name_en': 'CryoSat-2 (Polar Ice Radar / ESA)',
        'story_en': '❄️ [CryoSat-2 / ESA Polar Ice Sentinel]\n'
                    'Measures the thickness of polar sea ice and ice sheets with radar altimetry! 🏔️\n'
                    '💡 Trivia: Tracks polar ice elevation changes down to centimeter precision.',
        'tags_en': '#CryoSat #ESA #PolarIce #Climate'},
    {   'id': 'PLEIADES-NEO',
        'name': 'Pleiades Neo (エアバス / 欧州最高解像度光学)',
        'badge': '地上解像度30cm！欧州最強の商用地球観測網',
        'color': '#2563EB',
        'lat': 43.6,
        'lon': 1.4,
        'alt': 620,
        'story_ja': '📸【地上30cmの鮮明度！欧州最高峰Pleiades Neo】\n'
                    'エアバス運用の次世代衛星！世界のあらゆる地点を1日数回高精細撮影📷✨\n'
                    '💡【トリビア】レーザー光衛星間通信で撮影からわずか数十分で地上へ配信！',
        'tags': '#PleiadesNeo #Airbus',
        'name_en': 'Pleiades Neo (Airbus Optical Fleet)',
        'story_en': '📸 [Pleiades Neo / Airbus 30cm Fleet]\n'
                    'Airbus constellation capturing 30cm imagery with multiple daily revisits! ✨\n'
                    '💡 Trivia: Uses laser crosslinks to deliver emergency images to ground in minutes.',
        'tags_en': '#PleiadesNeo #Airbus #EarthImagery'},
    {   'id': 'SPUTNIK-1',
        'name': 'スプートニク1号 (Sputnik 1 / 1957年)',
        'badge': '1957年10月4日、宇宙時代の扉を開いた歴史的球体',
        'color': '#EF4444',
        'lat': 55.7,
        'lon': 37.6,
        'alt': 580,
        'story_ja': '📻【宇宙時代の扉を開いた歴史的ビープ音！スプートニク1号】\n'
                    '人類初の人工衛星！直径58cmのアルミ球から放たれた「ピッ…ピッ…」の信号が世界を震撼🛰️✨\n'
                    '💡【トリビア】全米に大ショックを与えNASA設立とアポロ計画の引き金に！',
        'tags': '#スプートニク #宇宙史',
        'name_en': 'Sputnik 1 (First Satellite / 1957)',
        'story_en': '📻 [Sputnik 1 / Space Age Begins]\n'
                    'Oct 4, 1957! A 58cm polished sphere that shocked the world with its radio beeps from orbit! 🚀\n'
                    '💡 Trivia: Its beep was heard by radio amateurs on every continent.',
        'tags_en': '#Sputnik #SpaceAge #History'},
    {   'id': 'SPUTNIK-2',
        'name': 'スプートニク2号 (クドリャフカ / ライカ犬)',
        'badge': '人類に先駆け宇宙を飛んだ最初の生物クドリャフカ',
        'color': '#F97316',
        'lat': 50.0,
        'lon': 40.0,
        'alt': 1600,
        'story_ja': '🐕【宇宙を飛んだ最初の命：ライカ犬のスプートニク2号】\n'
                    '野良犬ライカが搭乗！生命が宇宙で生きられることを世界で初めて証明😭✨\n'
                    '💡【トリビア】この尊い犠牲とデータが有人宇宙飛行への道を拓きました。',
        'tags': '#ライカ犬 #宇宙開発史',
        'name_en': 'Sputnik 2 (Laika the Dog / 1957)',
        'story_en': "🐕 [Sputnik 2 / Laika's Flight]\n"
                    'Carried stray dog Laika into orbit, proving animals could survive in weightlessness! 😭\n'
                    '💡 Trivia: Her flight proved mammals could survive launch into orbit.',
        'tags_en': '#Laika #Sputnik2 #Space'},
    {   'id': 'VOSTOK-1',
        'name': 'ボストーク1号 (ユーリ・ガガーリン / 1961年)',
        'badge': '「地球は青かった」人類初の有人宇宙飛行を達成',
        'color': '#E11D48',
        'lat': 50.0,
        'lon': 50.0,
        'alt': 300,
        'story_ja': '👨\u200d🚀【人類初の宇宙飛行士：ボストーク1号】\n'
                    '「地球は青かった」の名言とともに108分で地球1周し生還！人類が宇宙へ到達した瞬間🌍✨\n'
                    '💡【トリビア】帰還時は高度7千mで座席ごと射出されパラシュート降下！',
        'tags': '#ガガーリン #ボストーク',
        'name_en': 'Vostok 1 (Yuri Gagarin / 1961)',
        'story_en': '👨\u200d🚀 [Vostok 1 / Yuri Gagarin / 1961]\n'
                    "First human in space! Circled Earth in 108 minutes, stating: 'The Earth is blue.' 🌍✨\n"
                    '💡 Trivia: Ejected from capsule at 7,000m and parachuted safely down.',
        'tags_en': '#Gagarin #Vostok1 #Space'},
    {   'id': 'LUNA-2',
        'name': 'ルナ2号 (Luna 2 / 1959年 ソ連月探査機)',
        'badge': '地球以外の天体に人類史上初めて激突到達した機',
        'color': '#CBD5E1',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 384400,
        'story_ja': '🌕【人類で初めて月に到達した探査機！ルナ2号】\n'
                    '1959年、月面の「晴れの海」へ命中激突！地球以外の天体に人間が作った物体が届いた最初の瞬間🚀\n'
                    '💡【トリビア】ソ連の国章が刻まれた金属ペナント球を月面にばら撒きました！',
        'tags': '#ルナ2号 #月面到達',
        'name_en': 'Luna 2 (First Moon Impact / 1959)',
        'story_en': '🌕 [Luna 2 / First Craft on the Moon]\n'
                    'Sep 1959: First human artifact to touch another celestial body, slamming into the Moon! 🚀\n'
                    '💡 Trivia: Carried spherical Soviet pennants that scattered in the lunar dust.',
        'tags_en': '#Luna2 #Moon #Space'},
    {   'id': 'LUNA-3',
        'name': 'ルナ3号 (Luna 3 / 1959年 ソ連月探査機)',
        'badge': '人類が一度も見たことがなかった「月の裏側」を初撮影',
        'color': '#94A3B8',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 384400,
        'story_ja': '📷【人類で初めて『月の裏側』を撮影！ルナ3号】\n'
                    '常に地球に同じ面を向ける月の裏側を初めて激写！海がほとんどなくクレーターだらけの姿を世界へ送信🌔\n'
                    '💡【トリビア】機内でフィルムを自動現像しテレビカメラでスキャンして電波送信！',
        'tags': '#ルナ3号 #月の裏側',
        'name_en': 'Luna 3 (First Far Side Photos / 1959)',
        'story_en': "📸 [Luna 3 / Moon's Far Side / 1959]\n"
                    'Circled the Moon, developed photos on film, and scanned them to Earth via radio! 🌕✨\n'
                    '💡 Trivia: Revealed the far side is densely cratered with few dark maria.',
        'tags_en': '#Luna3 #MoonFarSide #Space'},
    {   'id': 'VENERA-9',
        'name': 'ベネラ9号 (Venera 9 / ソ連金星着陸機)',
        'badge': '450℃・90気圧の灼熱金星地表から世界初カラー写真',
        'color': '#F59E0B',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 0,
        'story_ja': '🔥【450℃・90気圧の地獄から写真送信！金星着陸機ベネラ】\n'
                    '鉛が溶ける熱と硫酸の雨が降る金星地表へ着陸！チタン製耐圧殻で約1時間耐え地表写真を撮影成功📸\n'
                    '💡【トリビア】金星の地表は濃い大気の散乱でオレンジ色に染まっていました！',
        'tags': '#ベネラ #金星着陸',
        'name_en': 'Venera 9 (First Venus Photos / 1975)',
        'story_en': '🔥 [Venera 9 / First Images from Venus]\n'
                    "Survived 485°C heat & 90 atm pressure to beam back first photos from Venus's surface! 🪐\n"
                    '💡 Trivia: Proved Venus is rocky and bright enough to read without floodlights.',
        'tags_en': '#Venera9 #Venus #Space'},
    {   'id': 'MIR',
        'name': 'ミール (Mir / 旧ソ連 宇宙ステーション)',
        'badge': '15年間軌道上に君臨した人類初のモジュール宇宙基地',
        'color': '#3B82F6',
        'lat': 51.6,
        'lon': 0.0,
        'alt': 350,
        'story_ja': '🛸【ISSの母となった宇宙ステーション：ミール】\n'
                    '15年間にわたり長期滞在！火災や衝突事故を乗り越え人間の宇宙長期生存を実証👨\u200d🚀\n'
                    '💡【トリビア】ポリャコフ飛行士の「437日連続宇宙滞在」の世界記録は今も不破！',
        'tags': '#宇宙ステーションミール #宇宙史',
        'name_en': 'Mir Space Station (1986-2001)',
        'story_en': '🛸 [Mir / Legendary Space Station]\n'
                    'Modular station hosted crews for 15 years, proving long-term human survival in orbit! 👨\u200d🚀\n'
                    '💡 Trivia: Cosmonaut Polyakov spent a record 437 continuous days aboard Mir.',
        'tags_en': '#Mir #SpaceStation #History'},
    {   'id': 'SOYUZ',
        'name': 'ソユーズ宇宙船 (Soyuz / ロシアの信頼の翼)',
        'badge': '半世紀以上飛び続ける世界で最も安全な有人往復宇宙船',
        'color': '#10B981',
        'lat': 51.6,
        'lon': 50.0,
        'alt': 400,
        'story_ja': '🚀【半世紀以上飛び続ける宇宙のタクシー：ソユーズ】\n'
                    '1967年以来140回以上の有人飛行！シャトル退役中もISSへの足として支えた名機✨\n'
                    '💡【トリビア】着陸寸前に底面ロケットを噴射して衝撃を吸収する神業着陸！',
        'tags': '#ソユーズ #有人宇宙船',
        'name_en': 'Soyuz Spacecraft (Human Lifeline)',
        'story_en': '🚀 [Soyuz / Half-Century Workhorse]\n'
                    'Flying crewed missions since 1967 with 140+ flights, linking Mir and the ISS! ✨\n'
                    '💡 Trivia: Fires soft-landing rockets meters above ground to cushion touchdown.',
        'tags_en': '#Soyuz #Roscosmos #Space'},
    {   'id': 'BURAN',
        'name': 'ブラン (Buran / ソ連版スペースシャトル)',
        'badge': '人間なしの完全自動操縦で大気圏突入・滑走路着陸成功',
        'color': '#CBD5E1',
        'lat': 45.6,
        'lon': 63.3,
        'alt': 250,
        'story_ja': '🛬【完全無人で地球を周回し自動着陸！ブラン】\n'
                    'ソ連の大型往復宇宙船！1988年、乗組員ゼロの全自動操縦で宇宙へ行き滑走路へ完璧帰還✨\n'
                    '💡【トリビア】米シャトルを凌ぐ先進制御でしたがソ連崩壊で飛行は1回きりに。',
        'tags': '#ブラン #スペースシャトル',
        'name_en': 'Buran Shuttle (Soviet Spaceplane)',
        'story_en': '🛬 [Buran / Autonomous Shuttle / 1988]\n'
                    'Orbited Earth twice and executed a fully automated runway landing without any crew! ✨\n'
                    '💡 Trivia: Flew only once in 1988 before program cancellation after USSR collapse.',
        'tags_en': '#Buran #SpaceShuttle #Soviet'},
    {   'id': 'KOSMOS-954',
        'name': 'コスモス954 (原子炉搭載軍事衛星 / 1978年)',
        'badge': '制御不能となりカナダ北部へ墜落した原子力衛星',
        'color': '#EF4444',
        'lat': 60.0,
        'lon': -110.0,
        'alt': 0,
        'story_ja': '⚠️【原子炉を積んだまま地球へ落下！コスモス954】\n'
                    'ソ連の海洋偵察衛星！制御不能となりカナダ北部へ放射性物質をまき散らし墜落💥\n'
                    '💡【トリビア】米軍とカナダ軍が極秘回収作戦「モーニング・ライト作戦」を展開！',
        'tags': '#コスモス954 #原子力衛星',
        'name_en': 'Kosmos 954 (Nuclear Spy Sat / 1978)',
        'story_en': '⚠️ [Kosmos 954 / Nuclear Crash]\n'
                    'Soviet radar spy satellite with a uranium reactor that crashed in Canada! 💥\n'
                    '💡 Trivia: Triggered Operation Morning Light to clean radioactive debris.',
        'tags_en': '#Kosmos954 #Nuclear #Space'},
    {   'id': 'KOSMOS-1408',
        'name': 'コスモス1408 (対衛星ミサイル実験標的)',
        'badge': '破壊されISSを脅かす大量のデブリ雲を生んだ衛星',
        'color': '#DC2626',
        'lat': 50.0,
        'lon': 60.0,
        'alt': 480,
        'story_ja': '💥【ミサイルで撃墜されデブリを撒いた！コスモス1408】\n'
                    '2021年、ロシアが自国衛星をミサイル破壊！1,500個超の危険な高速デブリが発生⚠️\n'
                    '💡【トリビア】破片接近のためISS宇宙飛行士が船内に一時避難する緊急事態に！',
        'tags': '#コスモス1408 #宇宙デブリ',
        'name_en': 'Kosmos 1408 (ASAT Target / 2021)',
        'story_en': '💥 [Kosmos 1408 / ASAT Strike / 2021]\n'
                    'Hit by a Russian missile in 2021, creating 1,500+ tracked orbital debris pieces! ⚠️\n'
                    '💡 Trivia: Debris threatened the ISS, forcing astronauts into return capsules.',
        'tags_en': '#Kosmos1408 #ASAT #SpaceDebris'},
    {   'id': 'KOSMOS 2542',
        'name': 'コスモス2542 (Kosmos 2542 / キラー衛星)',
        'badge': '米スパイ衛星を背後から追尾した暗殺者',
        'color': '#EF4444',
        'lat': 60.0,
        'lon': 50.0,
        'alt': 400,
        'story_ja': '🛰️【米スパイ衛星を背後から追尾！コスモス2542】\n'
                    '子機を射出し米最高機密衛星「USA-245」の真後ろ数十キロまで接近ストーカー🕵️\u200d♂️\n'
                    '💡【トリビア】米宇宙軍司令官が「異常で不穏」と公式非難したリアル宇宙戦！',
        'tags': '#コスモス2542 #宇宙軍',
        'name_en': 'Kosmos 2542 (Inspector Satellite)',
        'story_en': '🕵️ [Kosmos 2542 / Orbital Stalker]\n'
                    'Russian inspector satellite that closely shadowed US spy satellite USA-245 in 2020! 🛰️\n'
                    '💡 Trivia: Later released a sub-satellite that conducted projectile tests.',
        'tags_en': '#Kosmos2542 #SpaceSurveillance'},
    {   'id': 'OLYMP',
        'name': 'オリンプ・K (Olymp-K / ロシア盗聴衛星)',
        'badge': '他国衛星の真隣に駐車して電波を盗聴するスパイ',
        'color': '#991B1B',
        'lat': 0.0,
        'lon': 18.0,
        'alt': 35786,
        'story_ja': '🇷🇺【他国衛星の隣に停車する盗聴スパイ：オリンプ・K】\n'
                    '各国の静止通信衛星のすぐ隣（数十キロ以内）まで接近して居座るロシアのシギント機📡\n'
                    '💡【トリビア】仏国防相が「我が国の軍事衛星の通信を盗聴した」と名指し抗議！',
        'tags': '#オリンプK #スパイ衛星',
        'name_en': 'Olymp-K (Luch / GEO Eavesdropper)',
        'story_en': '👂 [Olymp-K / Geostationary Drifter]\n'
                    'Russian signals spy satellite that parks close to foreign military craft in GEO! 🛰️\n'
                    '💡 Trivia: Maneuvered adjacent to French-Italian and Intelsat comms craft.',
        'tags_en': '#OlympK #Intel #Satellite'},
    {   'id': 'TUNDRA',
        'name': 'ツンドラ (Kupol / ロシア早期警戒衛星)',
        'badge': '北極上空に長く居座る長楕円ツンドラ軌道',
        'color': '#475569',
        'lat': 63.4,
        'lon': 60.0,
        'alt': 40000,
        'story_ja': '❄️【北極上空に長く居座る！ロシアの長楕円ツンドラ軌道】\n'
                    '通常の静止衛星では見えにくい北極圏や高緯度地域を見下ろす早期警戒衛星🚀\n'
                    '💡【トリビア】ケプラーの法則で高度4万km付近で減速し、1日の大半をロシア上空で待機！',
        'tags': '#ツンドラ #早期警戒',
        'name_en': 'Tundra (EKS Kupol / Early Warning)',
        'story_en': '🚨 [Tundra (EKS) / Missile Warning]\n'
                    'Operates in Molniya orbits to detect ballistic missile rocket plume flashes! 🛡️\n'
                    '💡 Trivia: Infrared sensors provide continuous coverage of Northern Hemisphere silos.',
        'tags_en': '#Tundra #SpaceDefense'},
    {   'id': 'GLONASS',
        'name': 'GLONASS-K (ロシア全球測位システム)',
        'badge': '高緯度シベリアや北極海を支えるロシアのGPS',
        'color': '#3B82F6',
        'lat': 50.0,
        'lon': 80.0,
        'alt': 19100,
        'story_ja': '🇷🇺【高緯度シベリアを支えるロシアの測位網GLONASS】\n'
                    '軌道傾斜角64.8度と高く傾いており、極域や高緯度での測位精度に優れるロシアの測位網📡\n'
                    '💡【トリビア】24機体制を完全復活させ、世界のスマホの大半にGPSと併用搭載！',
        'tags': '#GLONASS #GPS',
        'name_en': 'GLONASS-K (Russian Navigation)',
        'story_en': '🧭 [GLONASS-K / Global Navigation]\n'
                    "Russia's 24-satellite positioning constellation providing global navigation! 🛰️\n"
                    '💡 Trivia: Uses FDMA frequency division, unlike CDMA used by GPS and Galileo.',
        'tags_en': '#GLONASS #Navigation'},
    {   'id': 'SPEKTR',
        'name': 'スペクトルRG (Spektr-RG / X線天文台)',
        'badge': '全宇宙の100万個のブラックホールを地図化',
        'color': '#6366F1',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 1500000,
        'story_ja': '🌌【全宇宙の100万個のブラックホールを地図化！スペクトルRG】\n'
                    '150万km離れたL2点で観測！全天の高温プラズマと銀河団をX線スキャン🔭\n'
                    '💡【トリビア】銀河中心から噴く差し渡し数万光年の巨大気泡構造を発見！',
        'tags': '#スペクトルRG #ブラックホール',
        'name_en': 'Spektr-RG (X-ray Observatory)',
        'story_en': '🌌 [Spektr-RG / All-Sky X-ray]\n'
                    'At L2, mapping millions of supermassive black holes and galaxy clusters! 🔭\n'
                    "💡 Trivia: Discovered giant 'eROSITA bubbles' towering 36,000 light-years above our galaxy.",
        'tags_en': '#SpektrRG #Astronomy'},
    {   'id': 'METEOR',
        'name': 'メテオールM (Meteor-M / ロシア極軌道気象機)',
        'badge': '北極海航路の海氷と吹雪を見張る極地の瞳',
        'color': '#0284C7',
        'lat': 75.0,
        'lon': 60.0,
        'alt': 830,
        'story_ja': '🐻【北極海航路を見守る極地の瞳！メテオールM】\n'
                    '地球の自転軸に沿って南北周回しながら、北極海航路の海氷状況や吹雪を監視するロシア気象機❄️🚢\n'
                    '💡【トリビア】光のない極夜（真っ暗な北極の冬）でもマイクロ波で氷の厚さを測定！',
        'tags': '#メテオール #北極海',
        'name_en': 'Meteor-M (Polar Weather Fleet)',
        'story_en': '❄️ [Meteor-M / Polar Weather Sentinel]\n'
                    'Monitors Arctic sea-ice, northern shipping lanes, and atmospheric temperatures! 🛰️\n'
                    '💡 Trivia: Transmits unencrypted signals receivable by hobbyist radio setups.',
        'tags_en': '#MeteorM #Weather #Space'},
    {   'id': 'ELEKTRO',
        'name': 'エレクトロL (Elektro-L / ロシア静止気象機)',
        'badge': 'ユーラシアとインド洋を見守るロシアの巨星',
        'color': '#0EA5E9',
        'lat': 0.0,
        'lon': 76.0,
        'alt': 35786,
        'story_ja': '🛰️【ユーラシアを見下ろす巨星！エレクトロL】\n'
                    'ロシアが静止軌道に配備した大型気象機！15〜30分おきに全半球の気象画像を撮影🌏\n'
                    '💡【トリビア】太陽フレアや宇宙放射線を検知し、自国の宇宙インフラを守る警戒機でもある！',
        'tags': '#エレクトロL #気象衛星',
        'name_en': 'Elektro-L (Geostationary Weather)',
        'story_en': '🌏 [Elektro-L / Geostationary Sentinel]\n'
                    'Captures 121-megapixel true-color images of Earth every 30 minutes from 36,000 km! 📸\n'
                    "💡 Trivia: Combines visual & infrared to show Earth's vegetation in orange tones.",
        'tags_en': '#ElektroL #Weather #Earth'},
    {   'id': 'DONGFANGHONG-1',
        'name': '東方紅1号 (1970年 / 中国初の人工衛星)',
        'badge': '宇宙から革命歌のメロディを世界へ響かせた球体',
        'color': '#DC2626',
        'lat': 30.0,
        'lon': 100.0,
        'alt': 440,
        'story_ja': '📻【宇宙から革命歌を響かせた！東方紅1号】\n'
                    '1970年打上げ！多面体球から歌曲「東方紅」の電子音を宇宙から放送した中国初の人工衛星🇨🇳✨\n'
                    '💡【トリビア】米ソ仏日に続き世界第5位の自力打上げ国へ躍り出た原点！',
        'tags': '#東方紅1号 #中国宇宙史',
        'name_en': "Dongfanghong 1 (China's First / 1970)",
        'story_en': "📻 [Dongfanghong 1 / China's Dawn]\n"
                    "April 24, 1970: China's first satellite broadcast the song 'The East Is Red'! 🇨🇳\n"
                    '💡 Trivia: Made China the 5th nation to reach space independently.',
        'tags_en': '#Dongfanghong #SpaceHistory #China'},
    {   'id': 'SHENZHOU',
        'name': '神舟 (Shenzhou / 中国有人宇宙船)',
        'badge': '宇宙飛行士を天宮ステーションへ運ぶ中国の足',
        'color': '#E11D48',
        'lat': 40.0,
        'lon': 100.0,
        'alt': 390,
        'story_ja': '👨\u200d🚀【中国の飛行士を運ぶ宇宙船：神舟（しんしゅう）】\n'
                    '2003年の楊利偉飛行士以来、天宮ステーションへのクルー交代を安全に担い続ける翼🇨🇳🚀\n'
                    '💡【トリビア】軌道・帰還・推進の3モジュール構造で高い安全性を確保！',
        'tags': '#神舟 #有人宇宙飛行',
        'name_en': 'Shenzhou (Crew Spacecraft / China)',
        'story_en': "👨\u200d🚀 [Shenzhou / China's Crewed Craft]\n"
                    'Carried taikonaut Yang Liwei in 2003, now the trusted ferry to Tiangong! 🇨🇳🚀\n'
                    '💡 Trivia: 3-module design with orbital, re-entry, and service segments.',
        'tags_en': '#Shenzhou #Taikonaut #Spaceflight'},
    {   'id': 'TIANGONG',
        'name': '天宮 (Tiangong / 中国宇宙ステーション)',
        'badge': '常時3人が長期滞在する中国独自の宇宙の城',
        'color': '#E11D48',
        'lat': 30.0,
        'lon': 115.0,
        'alt': 400,
        'story_ja': '🏮【常時3人が宇宙滞在！中国独自の宇宙ステーション天宮】\n'
                    '高度約400kmを周回するT字型ステーション！最先端の科学実験や船外活動を日常実施中👨\u200d🚀🇨🇳\n'
                    '💡【トリビア】将来はハッブル級の巨大宇宙望遠鏡が天宮にドッキング整備可能！',
        'tags': '#天宮 #Tiangong',
        'name_en': 'Tiangong Space Station (CSS)',
        'story_en': '🛸 [Tiangong Space Station / CSS]\n'
                    'Permanently crewed in LEO, hosting cutting-edge microgravity science experiments! 🇨🇳\n'
                    '💡 Trivia: Features a robotic arm that crawls along the station exterior.',
        'tags_en': '#Tiangong #CSS #SpaceStation'},
    {   'id': 'CHANGE-4',
        'name': '嫦娥4号 & 玉兎2号 (世界初の月裏側着陸)',
        'badge': '人類で初めて月の裏側の未知の大地に降り立った機',
        'color': '#FACC15',
        'lat': -45.5,
        'lon': 177.6,
        'alt': 384400,
        'story_ja': '🌕【人類初！月の裏側へ着陸成功：嫦娥4号】\n'
                    '地球から直接電波が届かない月の裏側のフォン・カルマン・クレーターへ着陸！探査車・玉兎2号が走行探査🚜\n'
                    '💡【トリビア】月のマントル起源とされる鉱物を発見し月の成り立ちを解明！',
        'tags': '#嫦娥4号 #月の裏側',
        'name_en': "Chang'e 4 & Yutu-2 (Moon Far Side)",
        'story_en': "🌕 [Chang'e 4 & Yutu-2 / Moon Far Side]\n"
                    'Jan 2019: First soft landing on the lunar far side, exploring Von Kármán crater! 🤖\n'
                    '💡 Trivia: Yutu-2 rover has survived over 5 years on the far side.',
        'tags_en': '#Change4 #Yutu2 #MoonFarSide'},
    {   'id': 'CHANGE-6',
        'name': '嫦娥6号 (2024年 月裏面サンプルリターン)',
        'badge': '世界初！月の裏側の土壌を持ち帰る歴史的快挙',
        'color': '#EAB308',
        'lat': -41.6,
        'lon': -153.9,
        'alt': 384400,
        'story_ja': '📦【世界初！月の裏側から土壌を持ち帰った嫦娥6号】\n'
                    '2024年、月の裏側へ着陸しドリル採掘した約2kgのサンプルを地球へ持ち帰る前人未到の偉業達成🌙✨\n'
                    '💡【トリビア】月の表と裏で火山活動や地殻の厚さがなぜ違うのかの謎に迫る！',
        'tags': '#嫦娥6号 #世界初',
        'name_en': "Chang'e 6 (Far Side Sample Return)",
        'story_en': "📦 [Chang'e 6 / Far Side Soil Sampler]\n"
                    '2024: First spacecraft to retrieve and return rock and soil from the lunar far side! 🌕\n'
                    '💡 Trivia: Drilled 2m into the South Pole-Aitken basin for ancient crust.',
        'tags_en': '#Change6 #Moon #CNSA'},
    {   'id': 'TIANWEN-1',
        'name': '天問1号 & 祝融号 (中国初の火星探査機)',
        'badge': '初挑戦で「火星周回・着陸・ローバー走行」を同時達成',
        'color': '#EF4444',
        'lat': 25.1,
        'lon': 109.9,
        'alt': 0,
        'story_ja': '🔴【初挑戦で3大偉業を同時達成！天問1号】\n周回機・着陸機・ローバー「祝融号」を一度に送り込みすべて成功させた驚異の火星探査🇨🇳\n💡【トリビア】火星のユートピア平原で太古の海洋の痕跡を探査！',
        'tags': '#天問1号 #火星探査',
        'name_en': 'Tianwen-1 & Zhurong (Mars Mission)',
        'story_en': '🔴 [Tianwen-1 & Zhurong / Mars]\n'
                    "China's first Mars mission achieved orbit, landing, and roving on its first attempt! 🇨🇳\n"
                    '💡 Trivia: Zhurong rover found evidence of past water and ancient shorelines.',
        'tags_en': '#Tianwen1 #Zhurong #Mars'},
    {   'id': 'MICIUS',
        'name': '墨子号 (Micius / 中国量子通信衛星)',
        'badge': '絶対に盗聴できない量子暗号通信を世界初実証',
        'color': '#06B6D4',
        'lat': 30.0,
        'lon': 110.0,
        'alt': 500,
        'story_ja': '🛰️【世界初！絶対に盗聴できない量子通信：墨子号】\n'
                    '地上1,200km離れた2地点へ「量子もつれ」光子を送り、絶対に盗聴できない暗号鍵配送に成功🔐✨\n'
                    '💡【トリビア】時速2.8万kmで疾走しながら光子を1粒ずつ針の穴を通す超精密レーザー！',
        'tags': '#量子通信 #墨子号',
        'name_en': 'Micius (Quantum Communications)',
        'story_en': '🔐 [Micius / Quantum Satellite]\n'
                    'Beamed entangled photon pairs across 1,200 km to demonstrate hack-proof encryption! 🛰️\n'
                    "💡 Trivia: Conducted the world's first quantum-encrypted intercontinental video call.",
        'tags_en': '#Micius #Quantum #CNSA'},
    {   'id': 'SHIJIAN-21',
        'name': '実践21号 (Shijian-21 / 宇宙ゴミ投棄船)',
        'badge': '死んだ衛星を抱えて墓場軌道へ捨てる宇宙の掃除屋',
        'color': '#E11D48',
        'lat': 0.0,
        'lon': 105.0,
        'alt': 35786,
        'story_ja': '🤖【死んだ衛星を抱えて墓場軌道へポイ！実践21号】\n'
                    '故障した衛星にアームでドッキングし3,000km上の墓場軌道へ強制連行🦾🛰️\n'
                    '💡【トリビア】ゴミ清掃の一方で他国衛星を拉致・無力化できる二刀流兵器と警戒も！',
        'tags': '#実践21号 #宇宙デブリ',
        'name_en': 'Shijian-21 (Space Debris Tug)',
        'story_en': '🧲 [Shijian-21 / Space Debris Tug]\n'
                    'Docked with a dead Beidou satellite in GEO and towed it 3,000 km to a graveyard orbit! 🛰️\n'
                    '💡 Trivia: Demonstrated active on-orbit servicing and debris removal in deep space.',
        'tags_en': '#Shijian21 #SpaceDebris'},
    {   'id': 'QUEQIAO',
        'name': '鵲橋 (Queqiao / 月裏面探査中継衛星)',
        'badge': '月の裏側と地球を電波で結ぶラグランジュ衛星',
        'color': '#F59E0B',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 450000,
        'story_ja': '🌕【月の裏側と地球を電波で結ぶ！鵲橋（じゃっきょう）】\n'
                    '月裏面に着陸した嫦娥4号と地球の通信を中継！七夕の織姫と彦星を渡す橋が名前の由来🎋✨\n'
                    '💡【トリビア】月裏側からは地球が見えないためL2点のハロー軌道で両方を常時直視！',
        'tags': '#鵲橋 #嫦娥4号',
        'name_en': 'Queqiao (Lunar Relay Satellite)',
        'story_en': '🌉 [Queqiao / Earth-Moon Relay]\n'
                    "Stationed at Earth-Moon L2 to relay signals from the Moon's far side! 🛰️\n"
                    '💡 Trivia: Named after the mythical magpie bridge crossing the Milky Way.',
        'tags_en': '#Queqiao #MoonFarSide #CNSA'},
    {   'id': 'DAMPE',
        'name': '悟空号 (DAMPE / 暗黒物質探査衛星)',
        'badge': 'ダークマターの謎を追う中国の千里眼',
        'color': '#8B5CF6',
        'lat': 35.0,
        'lon': 105.0,
        'alt': 500,
        'story_ja': '🐒【ダークマターの痕跡を追う千里眼！悟空号】\n'
                    '孫悟空のように宇宙の深淵を見抜く中国の天文衛星！最高エネルギーの宇宙線電子を観測中🔍🌌\n'
                    '💡【トリビア】既知理論で説明できないエネルギースパイクを検出し大議論に！',
        'tags': '#悟空号 #ダークマター',
        'name_en': 'DAMPE (Wukong / Dark Matter Probe)',
        'story_en': '🐵 [DAMPE (Wukong) / Dark Matter Probe]\n'
                    'Detects high-energy cosmic rays to search for dark matter annihilation! 🔭\n'
                    "💡 Trivia: Named after the mythical Monkey King 'Wukong' with all-seeing eyes.",
        'tags_en': '#DAMPE #Wukong #DarkMatter'},
    {   'id': 'YAOGAN',
        'name': '遥感35号 (Yaogan / 中国軍事編隊偵察)',
        'badge': '3機編隊で海上の空母を三角測量する電波の網',
        'color': '#DC2626',
        'lat': 20.0,
        'lon': 120.0,
        'alt': 500,
        'story_ja': '🇨🇳【空母の航跡を追う編隊監視網！遥感（ヤオガン）】\n'
                    '3機1組の編隊で低軌道を並走し、海上のレーダー電波源を三角測量する中国の軍事偵察衛星群🛰️🚢\n'
                    '💡【トリビア】電波のわずかな到達時間差から敵艦艇の位置・進行方向を瞬時特定！',
        'tags': '#遥感 #海洋監視',
        'name_en': 'Yaogan-35 (Formation Reconnaissance)',
        'story_en': '🛰️ [Yaogan-35 / Triplet Radar Recon]\n'
                    'Flies in triplets to triangulate electromagnetic signals and maritime radar tracks! 🕵️\n'
                    '💡 Trivia: Forms an antenna array spanning hundreds of kilometers.',
        'tags_en': '#Yaogan #Satellite #Space'},
    {   'id': 'FENGYUN-4B',
        'name': '風雲4号B (Fengyun-4B / 中国気象衛星)',
        'badge': '宇宙から大気を3Dスキャンする次世代気象機',
        'color': '#0284C7',
        'lat': 0.0,
        'lon': 105.0,
        'alt': 35786,
        'story_ja': '🇨🇳【大気を3Dスキャン！風雲4号B】\n'
                    '3.6万km上空から気温や湿度の垂直分布をミリ波で立体スキャンする干渉式サウンダーを搭載🌪️\n'
                    '💡【トリビア】静止軌道からの大気サウンディング観測を欧米に先駆け世界初実用化！',
        'tags': '#風雲4号 #気象衛星',
        'name_en': 'Fengyun-4B (Geostationary Weather)',
        'story_en': '🌀 [Fengyun-4B / Weather Sentinel]\n'
                    'Monitors severe typhoons and floods across Asia-Pacific minute-by-minute! 🛰️⚡\n'
                    '💡 Trivia: Interferometer profiles atmospheric temperatures vertically.',
        'tags_en': '#Fengyun #Weather #Asia'},
    {   'id': 'GAOFEN-7',
        'name': '高分7号 (Gaofen-7 / 3D立体測量衛星)',
        'badge': 'レーザーを撃ち込み国土を3D化する測量機',
        'color': '#059669',
        'lat': 35.0,
        'lon': 110.0,
        'alt': 500,
        'story_ja': '📐【レーザーを撃ち込み国土を3D化！高分7号】\n'
                    'サブメートル級2眼ステレオカメラとレーザー高度計（LiDAR）で地表の高低差を数十cm精度で測定🛰️✨\n'
                    '💡【トリビア】測量隊を送ることなく宇宙から超精密な3D立体地図を自動生成！',
        'tags': '#高分7号 #3D地図',
        'name_en': 'Gaofen-7 (Sub-Meter 3D Mapping)',
        'story_en': '🏔️ [Gaofen-7 / Sub-Meter 3D Mapper]\n'
                    "Carries dual stereoscopic cameras and laser altimeters to map Earth's landforms in 3D! 📸\n"
                    '💡 Trivia: Measures surface heights down to sub-meter vertical precision.',
        'tags_en': '#Gaofen7 #EarthObservation #Mapping'},
    {   'id': 'BEIDOU',
        'name': '北斗3号 (BeiDou-3 / 中国全球測位システム)',
        'badge': '世界を覆う40機以上の中国版GPS網',
        'color': '#DC2626',
        'lat': 30.0,
        'lon': 115.0,
        'alt': 21500,
        'story_ja': '🛰️【40機以上のメガ網！中国の全地球測位システム北斗】\n'
                    '静止・傾斜同期・中軌道を組み合わせた世界で最も重層的な測位網📡\n'
                    '💡【トリビア】米GPSにない「短文SOS双方向通信」を備え、砂漠や海洋の圏外でも通信可能！',
        'tags': '#北斗 #BeiDou',
        'name_en': 'BeiDou-3 (Global Navigation Fleet)',
        'story_en': '🧭 [BeiDou-3 / Global GNSS Network]\n'
                    "China's 30+ satellite fleet providing sub-meter navigation and two-way short messages! 🛰️\n"
                    '💡 Trivia: Users can transmit emergency texts directly through satellites.',
        'tags_en': '#BeiDou #GNSS #Navigation'},
    {   'id': 'EINSTEIN-PROBE',
        'name': 'アインシュタイン・プローブ (Einstein Probe / 2024年)',
        'badge': 'ロブスターの目を模した超広視野X線宇宙望遠鏡',
        'color': '#8B5CF6',
        'lat': 20.0,
        'lon': 110.0,
        'alt': 600,
        'story_ja': '🦞【エビの複眼を真似た宇宙望遠鏡！愛因斯坦探針】\n'
                    '2024年打上げ！ロブスターの眼の微細反射構造を応用した広視野X線カメラで突発現象を監視🔭\n'
                    '💡【トリビア】ブラックホールが星を飲み込む瞬間を即座にキャッチ！',
        'tags': '#アインシュタインプローブ #X線',
        'name_en': 'Einstein Probe (Lobster-Eye X-ray)',
        'story_en': '🦞 [Einstein Probe / Lobster-Eye X-ray]\n'
                    'Uses lobster-eye optics to catch sudden black hole flares and gamma-ray bursts! 🔭\n'
                    '💡 Trivia: Wide-field optics mimic lobster eyes reflecting grazing X-rays.',
        'tags_en': '#EinsteinProbe #Astronomy #Xray'},
    {   'id': 'CHANDRAYAAN-3',
        'name': 'チャンドラヤーン3号 (インド / 月の南極着陸)',
        'badge': '人類史上初めて「月の南極付近」への着陸に成功',
        'color': '#F97316',
        'lat': -69.3,
        'lon': 32.3,
        'alt': 384400,
        'story_ja': '🇮🇳【世界初！月の南極に着陸成功：チャンドラヤーン3号】\n'
                    '水資源が期待される南極域に世界初軟着陸！低予算で宇宙大国へ躍り出たインドの誇り🌙\n'
                    '💡【トリビア】月面の硫黄を直接検出し月面探査競争をリード！',
        'tags': '#チャンドラヤーン3号 #インド宇宙',
        'name_en': 'Chandrayaan-3 (Moon South Pole Lander)',
        'story_en': '🇮🇳 [Chandrayaan-3 / Moon Landing]\n'
                    'Aug 2023: Historic first landing near the lunar south pole, detecting sulfur! 🌙\n'
                    '💡 Trivia: Achieved a historic lunar landing on a modest $75M budget!',
        'tags_en': '#Chandrayaan3 #ISRO #Moon'},
    {   'id': 'CHANDRAYAAN-1',
        'name': 'チャンドラヤーン1号 (インド月探査機)',
        'badge': '月面に「水分子」が存在することを世界で初めて証明',
        'color': '#EA580C',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 384400,
        'story_ja': '💧【月面に水があることを発見！チャンドラヤーン1号】\n'
                    'インド初の月探査機！搭載した鉱物マッピング装置で「月に水分子が存在する」証拠を発見🌔\n'
                    '💡【トリビア】乾燥していると思われていた月の常識を覆しました！',
        'tags': '#チャンドラヤーン #月の水',
        'name_en': 'Chandrayaan-1 (Discovery of Lunar Water)',
        'story_en': '💧 [Chandrayaan-1 / Finding Lunar Water]\n'
                    "India's first Moon probe discovered definitive proof of water molecules on the Moon! 🌔\n"
                    '💡 Trivia: Shattered the long-held myth that the Moon was bone dry.',
        'tags_en': '#Chandrayaan1 #ISRO #MoonWater'},
    {   'id': 'MANGALYAAN',
        'name': 'マンガルヤーン (MOM / インド火星探査機)',
        'badge': '初挑戦で火星軌道投入に成功！映画より安い驚異の低コスト',
        'color': '#C2410C',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 50000000,
        'story_ja': '🔴【映画より安い予算で火星へ！マンガルヤーン】\n'
                    'インド初挑戦で火星周回に一発成功！総開発費は映画『ゼロ・グラビティ』以下の約7,400万ドル🎬\n'
                    '💡【トリビア】アジアで初めて火星軌道へ到達した歴史的探査機！',
        'tags': '#マンガルヤーン #火星探査',
        'name_en': 'Mangalyaan (Mars Orbiter Mission / ISRO)',
        'story_en': '🔴 [Mangalyaan / Historic Mars Flight]\n'
                    'India reached Mars on its maiden attempt for $74M—less than the movie Gravity! 🎬🚀\n'
                    '💡 Trivia: Made India the first Asian nation to successfully enter Mars orbit.',
        'tags_en': '#Mangalyaan #ISRO #Mars'},
    {   'id': 'ADITYA-L1',
        'name': 'アディティヤL1 (Aditya-L1 / インド太陽観測機)',
        'badge': 'L1点から太陽を24時間監視するインド初の太陽宇宙船',
        'color': '#F59E0B',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 1500000,
        'story_ja': '☀️【インド初の太陽観測機！アディティヤL1】\n'
                    '地球から150万kmのL1点に陣取り、太陽のコロナ質量放出（CME）や宇宙天気を24時間監視中🔥\n'
                    '💡【トリビア】月南極着陸の直後に打ち上げられ宇宙大国インドの勢いを示しました！',
        'tags': '#AdityaL1 #太陽観測',
        'name_en': 'Aditya-L1 (Solar Observatory / ISRO)',
        'story_en': "☀️ [Aditya-L1 / India's Sun Sentinel]\n"
                    'Observes solar coronal mass ejections and flares 24/7 from the Sun-Earth L1 point! 🔥\n'
                    "💡 Trivia: 'Aditya' means Sun in Sanskrit; protects power grids from flares.",
        'tags_en': '#AdityaL1 #ISRO #Sun'},
    {   'id': 'DANURI',
        'name': 'ダヌリ (KPLO / 韓国初の月周回衛星)',
        'badge': '月面の永久影クレーターを撮影した韓国のパイオニア',
        'color': '#3B82F6',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 384400,
        'story_ja': '🇰🇷【韓国初の月探査船！ダヌリ（KPLO）】\n'
                    'スペースXのロケットで月周回へ到達！高感度カメラで月の永久影クレーターを鮮明撮影📷\n'
                    '💡【トリビア】宇宙ネット実験としてBTSの楽曲を月軌道から地球へ配信！',
        'tags': '#ダヌリ #韓国月探査',
        'name_en': 'Danuri (KPLO / Korea Pathfinder Lunar)',
        'story_en': "🇰🇷 [Danuri / Korea's Lunar Orbiter]\n"
                    "First Korean Moon probe, imaging shadowed craters with NASA's ShadowCam camera! 📷\n"
                    '💡 Trivia: Streamed BTS songs from lunar orbit to Earth in a space-internet test.',
        'tags_en': '#Danuri #KARI #MoonMission'},
    {   'id': 'CHOLLIAN-2A',
        'name': '千里眼2A号 (GEO-KOMPSAT-2A / 韓国)',
        'badge': '東アジアの台風と宇宙天気を監視する静止機',
        'color': '#3B82F6',
        'lat': 0.0,
        'lon': 128.2,
        'alt': 35786,
        'story_ja': '🇰🇷【台風と宇宙天気を監視！韓国の静止気象衛星『千里眼2A』】\n'
                    '高性能光学放射計で東アジアの気象を監視する韓国KARIのフラッグシップ機🌏🌀\n'
                    '💡【トリビア】太陽フレアや放射線を検知する宇宙天気センサーも積み衛星障害を早期警戒！',
        'tags': '#千里眼 #気象衛星',
        'name_en': 'Chollian-2A (GEO-KOMPSAT-2A / Korea)',
        'story_en': '🛰️ [Chollian-2A / Korea Weather Sentinel]\n'
                    'Captures full-disk color weather images of the Asia-Pacific every 10 min from GEO! 🌏🌀\n'
                    '💡 Trivia: Delivers high-speed typhoon tracking with 4x higher resolution.',
        'tags_en': '#Chollian2A #Weather #KMA'},
    {   'id': 'CHOLLIAN-2B',
        'name': '千里眼2B号 (GEO-KOMPSAT-2B / 韓国)',
        'badge': '世界初！静止軌道から大気汚染物質を追跡',
        'color': '#06B6D4',
        'lat': 0.0,
        'lon': 128.2,
        'alt': 35786,
        'story_ja': '🌊【大気汚染を静止軌道からスキャン！千里眼2B号】\n'
                    '韓国の環境衛星！高度3.6万kmからPM2.5や二酸化窒素の移動を日中1時間おきに監視🏭\n'
                    '💡【トリビア】静止軌道から大気汚染物質の越境移動をリアルタイム追跡する世界初衛星！',
        'tags': '#千里眼2B #環境観測',
        'name_en': 'Chollian-2B (Ocean & Air Quality / Korea)',
        'story_en': '🌊 [Chollian-2B / Environmental Sentinel]\n'
                    "World's first geostationary satellite monitoring East Asian air pollutants and red tides! 🌿\n"
                    '💡 Trivia: Tracks fine dust (PM2.5) movement across borders in real time.',
        'tags_en': '#Chollian2B #Environment #Earth'},
    {   'id': 'KOMPSAT-5',
        'name': 'アリラン5号 (KOMPSAT-5 / 韓国)',
        'badge': '朝鮮半島の夜と雲を突き抜けるSARレーダー',
        'color': '#0284C7',
        'lat': 37.0,
        'lon': 127.0,
        'alt': 550,
        'story_ja': '🇰🇷【夜と雲を突き抜ける韓国初のSAR衛星！アリラン5号】\n'
                    'Xバンド合成開口レーダーにより、1m以下の高解像度で地表の地形や災害、海洋船舶を昼夜監視📡\n'
                    '💡【トリビア】朝鮮半島周辺の安全保障や黄海の違法漁船監視にフル稼働！',
        'tags': '#アリラン5号 #SAR',
        'name_en': 'Arirang-5 (KOMPSAT-5 / Korea Radar)',
        'story_en': '📡 [Arirang-5 / Korea All-Weather Radar]\n'
                    'X-band radar satellite providing 1m imagery for disaster and maritime monitoring! 🛰️\n'
                    '💡 Trivia: Radio occultation measures atmospheric temperature profiles.',
        'tags_en': '#KOMPSAT5 #KARI #Radar'},
    {   'id': 'CARTOSAT-3',
        'name': 'Cartosat-3 (インドISRO 超高解像度機)',
        'badge': '地上解像度28cm！インドが誇る最高峰の地図機',
        'color': '#F97316',
        'lat': 13.0,
        'lon': 80.0,
        'alt': 505,
        'story_ja': '🇮🇳【地上28cmの超解像度！Cartosat-3】\n'
                    '高度500kmから驚異の鮮明度で都市計画やインフラ整備、災害管理を支えるインドの傑作機🏙️\n'
                    '💡【トリビア】世界トップ級の解像度を持ちながら自国ロケットで低コスト打上げ！',
        'tags': '#Cartosat3 #ISRO',
        'name_en': 'Cartosat-3 (High-Res Optical / ISRO)',
        'story_en': "📸 [Cartosat-3 / India's Sharpest Eye]\n"
                    'Delivers sharp 28cm commercial optical imagery from orbit for urban planning & defense! 🇮🇳\n'
                    '💡 Trivia: Features adaptive optics to counteract atmospheric distortion.',
        'tags_en': '#Cartosat3 #ISRO #EarthImagery'},
    {   'id': 'INSAT-3DR',
        'name': 'INSAT-3DR (インド 気象・捜索救助機)',
        'badge': 'インド洋のモンスーンと遭難信号をキャッチ',
        'color': '#EA580C',
        'lat': 0.0,
        'lon': 74.0,
        'alt': 35786,
        'story_ja': '🇮🇳【モンスーンと遭難信号を宇宙でキャッチ！INSAT-3DR】\n'
                    'インド洋全域の激しいモンスーンや巨大サイクロンを常時監視するインドの気象機🌊🌀\n'
                    '💡【トリビア】海上で遭難した船舶の救難信号を受信し救助隊へ即時中継する救難機能も！',
        'tags': '#INSAT #捜索救助',
        'name_en': 'INSAT-3DR (Weather & Search and Rescue)',
        'story_en': '🚨 [INSAT-3DR / Weather & Rescue]\n'
                    'Monitors Indian Ocean monsoons while intercepting distress beacon signals from ships at sea! 🌊\n'
                    '💡 Trivia: Relays marine distress alerts to search-and-rescue teams in minutes.',
        'tags_en': '#INSAT #SearchAndRescue #ISRO'},
    {   'id': 'OFEQ',
        'name': 'Ofeq-16 (イスラエル国防軍 偵察衛星)',
        'badge': '地球自転に逆らい西向きに打ち上げるスパイ機',
        'color': '#2563EB',
        'lat': 32.0,
        'lon': 35.0,
        'alt': 400,
        'story_ja': '🇮🇱【自転に逆らい西向きに打上げ！オフェク16】\n'
                    'イスラエル国防省の偵察衛星！超高解像度カメラで中東全域の軍事情勢を監視🕵️\u200d♂️\n'
                    '💡【トリビア】破片がアラブ諸国に落ちるのを防ぐため地中海（西向き）へ逆走打上げ！',
        'tags': '#オフェク #スパイ衛星',
        'name_en': 'Ofeq-16 (Israel Defense Reconnaissance)',
        'story_en': '🇮🇱 [Ofeq-16 / Retrograde Spy Sat]\n'
                    'High-resolution optical spy sat monitoring Middle Eastern security 24/7! 🕵️\u200d♂️\n'
                    "💡 Trivia: Launched westward against Earth's spin to keep stages off neighbors!",
        'tags_en': '#Ofeq #Israel #SpySat'},
    {   'id': 'HOPE-PROBE',
        'name': 'アル・アマル (Hope Probe / UAE火星探査機)',
        'badge': 'アラブ諸国初の惑星探査機！日本のH-IIAロケットで出発',
        'color': '#DC2626',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 40000,
        'story_ja': '🇦🇪【アラブ初の火星探査機！アル・アマル（希望）】\n'
                    'UAEが種子島からH-IIAロケットで打ち上げ！火星の下層大気と上層大気の相互作用を全球気象観測中🔴\n'
                    '💡【トリビア】火星の夜側に輝く巨大なオーロラ構造を世界初撮影！',
        'tags': '#アルアマル #UAE火星探査',
        'name_en': 'Hope Probe (Al-Amal / UAE Mars Mission)',
        'story_en': '🇦🇪 [Hope Probe / Arab Mars Journey]\n'
                    'Launched from Japan on H-IIA, mapping complete seasonal cycles of Martian weather! 🔴\n'
                    "💡 Trivia: Captured world-first global images of Mars's mysterious auroras.",
        'tags_en': '#HopeProbe #Mars #UAE'},
    {   'id': 'SAOCOM',
        'name': 'SAOCOM 1A (アルゼンチンSAR衛星)',
        'badge': '35㎡の超巨大アンテナ！大地深くに電波を届ける巨人',
        'color': '#38BDF8',
        'lat': -34.6,
        'lon': -58.4,
        'alt': 620,
        'story_ja': '🇦🇷【35㎡の超巨大アンテナ！南米の巨人SAOCOM 1A】\n'
                    '3トンの巨体から波長の長いLバンド電波を放ち地表下の土壌水分や火山活動を測定🛰️🏔️\n'
                    '💡【トリビア】土壌の数メートル下まで電波が届きパンパの地下水分量を的確把握！',
        'tags': '#SAOCOM #アルゼンチン',
        'name_en': 'SAOCOM 1A (Argentina Giant L-band SAR)',
        'story_en': '🇦🇷 [SAOCOM 1A / Argentina Radar Giant]\n'
                    'Massive 35m² L-band antenna penetrating deep soil to measure moisture & flood risks! 🛰️\n'
                    '💡 Trivia: L-band radar waves penetrate meters into soil to map hidden water.',
        'tags_en': '#SAOCOM #CONAE #Radar'},
    {   'id': 'VANGUARD-1',
        'name': 'ヴァンガード1号 (Vanguard 1 / 1958年)',
        'badge': '1958年打ち上げ！宇宙に現存する最古の人工物',
        'color': '#F97316',
        'lat': 28.5,
        'lon': -80.6,
        'alt': 650,
        'story_ja': '🛰️【1958年打上げ！宇宙最古の人類人工物ヴァンガード1号】\n'
                    '重さ1.4kgのアルミ球！世界初太陽電池搭載機で半世紀以上地球を周回中🪐\n'
                    '💡【トリビア】軌道が安定しており計算ではあと200年以上も回り続ける見込み！',
        'tags': '#ヴァンガード1号 #宇宙史',
        'name_en': 'Vanguard 1 (Oldest Satellite in Space)',
        'story_en': '🛰️ [Vanguard 1 / Oldest Object in Space]\n'
                    'Launched in 1958, this 1.4kg sphere is the oldest artificial object orbiting Earth! 🪐\n'
                    '💡 Trivia: Expected to remain in orbit for over 200 more years without decaying!',
        'tags_en': '#Vanguard1 #SpaceHistory'},
    {   'id': 'EXPLORER-1',
        'name': 'エクスプローラー1号 (1958年 / 米国初衛星)',
        'badge': '地球を包む放射線帯「ヴァン・アレン帯」を発見',
        'color': '#3B82F6',
        'lat': 30.0,
        'lon': -80.0,
        'alt': 350,
        'story_ja': '🇺🇸【アメリカ初の人工衛星！エクスプローラー1号】\n'
                    'フォン・ブラウン博士らのチームが開発！放射線帯「ヴァン・アレン帯」を発見⚡\n'
                    '💡【トリビア】スプートニクの衝撃からわずか3ヶ月で打上げ大成功！',
        'tags': '#エクスプローラー1号 #NASA',
        'name_en': "Explorer 1 (USA's First Satellite / 1958)",
        'story_en': "🇺🇸 [Explorer 1 / America's Space Dawn]\n"
                    "Jan 1958: Built by Wernher von Braun's team, discovering the Van Allen radiation belts! ⚡\n"
                    '💡 Trivia: Put America into the Space Race just 3 months after Sputnik.',
        'tags_en': '#Explorer1 #NASA #SpaceHistory'},
    {   'id': 'TELSTAR-1',
        'name': 'テルスター1号 (Telstar 1 / 1962年)',
        'badge': '世界初！大西洋を越えて生テレビ中継を成功させた球体',
        'color': '#F59E0B',
        'lat': 20.0,
        'lon': -30.0,
        'alt': 1000,
        'story_ja': '📺【世界初の大西洋横断生中継！テルスター1号】\n米欧間で生放送映像を宇宙中継！現代のグローバル情報社会の扉を開けた名機✨\n💡【トリビア】サッカーの白黒ボールの幾何学模様はテルスターがモデル！',
        'tags': '#テルスター1号 #通信衛星',
        'name_en': 'Telstar 1 (First Live TV Relay / 1962)',
        'story_en': '📺 [Telstar 1 / Birth of Live TV]\n'
                    'Relayed the first live transatlantic TV broadcast, opening the global comms era! ✨\n'
                    '💡 Trivia: The iconic black-and-white soccer ball pattern was inspired by Telstar.',
        'tags_en': '#Telstar #SpaceHistory #TV'},
    {   'id': 'SYNCOM-3',
        'name': 'シンコム3号 (Syncom 3 / 1964年)',
        'badge': '東京オリンピックの開会式を世界へ中継した初の静止衛星',
        'color': '#10B981',
        'lat': 0.0,
        'lon': 180.0,
        'alt': 35786,
        'story_ja': '🇯🇵【1964年東京五輪を生中継！初の静止衛星シンコム3号】\n'
                    '赤道上空に静止！東京五輪の熱狂を太平洋を越えてアメリカへ生中継した歴史機🏟️✨\n'
                    '💡【トリビア】人類が初めて「宇宙で地球の自転と同期」させた記念碑的衛星！',
        'tags': '#東京五輪 #静止衛星',
        'name_en': 'Syncom 3 (First Geostationary / 1964)',
        'story_en': '🇯🇵 [Syncom 3 / 1964 Tokyo Olympics Relay]\n'
                    'First geostationary sat, broadcasting Tokyo 1964 live across the Pacific! 🏟️✨\n'
                    "💡 Trivia: First time a satellite's orbit matched Earth's exact rotation.",
        'tags_en': '#Tokyo1964 #SpaceHistory'},
    {   'id': 'LAGEOS-1',
        'name': 'LAGEOS-1 (レーザー反射球 / タイムカプセル)',
        'badge': '電子機器ゼロ！800万年飛び続ける真鍮カプセル',
        'color': '#22C55E',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 5900,
        'story_ja': '⏳【電子機器ゼロ！800万年飛び続ける真鍮球LAGEOS-1】\n'
                    '金属球に426個の反射鏡を埋め込んだ衛星！壊れる回路がなく800万年後まで周回📜✨\n'
                    '💡【トリビア】未来の大陸移動地図と800万年後の人類へのメッセージ板を搭載！',
        'tags': '#LAGEOS #タイムカプセル',
        'name_en': 'LAGEOS-1 (Laser Geodynamics / 8M-Year Time Capsule)',
        'story_en': '⏳ [LAGEOS-1 / 8M-Year Time Capsule]\n'
                    'Solid brass sphere with 426 retroreflectors and zero electronics, orbiting 8M years! 📜\n'
                    '💡 Trivia: Carries a plaque showing continental drift for humans 8M years ahead.',
        'tags_en': '#LAGEOS #TimeCapsule'},
    {   'id': 'LAGEOS-2',
        'name': 'LAGEOS-2 (イタリア・NASA レーダー球)',
        'badge': 'アインシュタインの時空の引きずり効果を検証した金属球',
        'color': '#14B8A6',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 5620,
        'story_ja': '🌐【アインシュタインの相対性理論を検証！LAGEOS-2】\n'
                    'イタリアとNASAの金属球！地球自転が時空を引きずる現象（レンセ・ティリング効果）を実証⏱️\n'
                    '💡【トリビア】純金属球の精密な軌道追跡から時空の歪みを測定！',
        'tags': '#相対性理論 #時空の歪み',
        'name_en': "LAGEOS-2 (Testing Einstein's Relativity)",
        'story_en': '🌐 [LAGEOS-2 / Testing Relativity]\n'
                    'Precision laser tracking of this sphere proved Earth drags spacetime as it spins! ⏱️\n'
                    "💡 Trivia: Confirmed Einstein's predicted frame-dragging (Lense-Thirring effect).",
        'tags_en': '#LAGEOS2 #Einstein #Physics'},
    {   'id': 'TESLA-ROADSTER',
        'name': 'テスラ・ロードスター & スターマン (SpaceX)',
        'badge': 'ファルコンヘビーで太陽周回軌道へ放たれた赤い電気自動車',
        'color': '#EF4444',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 200000000,
        'story_ja': '🚗【宇宙を爆走する電気自動車！テスラ・ロードスター】\nスペースXが人形「スターマン」を乗せて太陽周回軌道へ打ち上げた愛車🚀\n💡【トリビア】車内オーディオからボウイの曲が流れ火星以遠を周回中！',
        'tags': '#TeslaInSpace #SpaceX',
        'name_en': 'Tesla Roadster & Starman (SpaceX)',
        'story_en': '🚗 [Tesla Roadster / SpaceX Starman]\n'
                    "Elon's red sports car launched into deep space with space-suited mannequin Starman! 🚀\n"
                    "💡 Trivia: Has orbited past Mars while playing David Bowie's music on a loop!",
        'tags_en': '#SpaceX #Starman #Tesla'},
    {   'id': 'ISS',
        'name': '国際宇宙ステーション (ISS / きぼう)',
        'badge': '地上400kmを秒速7.7kmで飛ぶ人類最大の宇宙実験棟',
        'color': '#F43F5E',
        'lat': 25.0,
        'lon': 120.0,
        'alt': 420,
        'story_ja': '🚀【サッカー場サイズ！時速2.8万kmで爆走する国際宇宙ステーション】\n'
                    '高度400kmを90分で1周！滞在する宇宙飛行士は1日に16回の日の出を目撃します🌅\n'
                    '💡【トリビア】日本実験棟「きぼう」はISS最大のモジュールで独自エアロックを完備！',
        'tags': '#ISS #きぼう',
        'name_en': 'International Space Station (ISS)',
        'story_en': '🚀 [ISS / Space Laboratory]\n'
                    'Flying at 28,000 km/h at 400 km, hosting astronauts continuously for 24+ years! 👨\u200d🚀\n'
                    '💡 Trivia: Astronauts witness 16 sunrises and sunsets every 24 hours.',
        'tags_en': '#ISS #SpaceStation #NASA'},
    {   'id': 'DEBRIS',
        'name': 'スペースデブリ (宇宙ゴミ / ケスラーの危機)',
        'badge': '秒速8kmの弾丸！1cmの破片でもライフル弾の破壊力',
        'color': '#EF4444',
        'lat': 15.0,
        'lon': 120.0,
        'alt': 800,
        'story_ja': '💥【秒速8kmで周回する宇宙弾丸！スペースデブリ】\n'
                    '過去のロケット残骸！わずか1cmの破片でもライフル弾の数十倍の破壊力で衝突します🛡️\n'
                    '💡【トリビア】連鎖衝突で宇宙が使えなくなる「ケスラー・シンドローム」の脅威！',
        'tags': '#スペースデブリ #宇宙ゴミ',
        'name_en': 'Space Debris (Kessler Threat)',
        'story_en': '💥 [Space Debris / Orbital Bullets]\n'
                    'Dead stages & debris hurtling at 8 km/s! A 1cm bolt hits with the force of an anvil! 🛡️\n'
                    '💡 Trivia: Chain-reaction collisions could trigger runaway Kessler Syndrome.',
        'tags_en': '#SpaceDebris #KesslerSyndrome'},
    {   'id': 'HITEN',
        'name': 'ひてん (MUSES-A / JAXA)',
        'badge': '日本初の月探査機！奇跡の超省エネ軌道で月へ',
        'color': '#FACC15',
        'lat': 35.0,
        'lon': 139.0,
        'alt': 384000,
        'story_ja': '🌕【日本初の月探査機！奇跡の省エネ航法：ひてん】\n'
                    '1990年打上げ！電気トラブルを乗り越え、米数学者の低エネルギー軌道理論を宇宙で初実証し月周回へ到達🚀\n'
                    '💡【トリビア】燃料がほぼゼロになっても地球と太陽の潮汐力で月へ到達！',
        'tags': '#ひてん #月探査',
        'name_en': "Hiten (MUSES-A / Japan's First Lunar Probe)",
        'story_en': "🌕 [Hiten / Japan's First Moon Probe]\n"
                    '1990: Used weak stability boundary orbits to miraculously reach the Moon! 🚀\n'
                    '💡 Trivia: First craft to prove low-energy chaotic orbital transfers in deep space.',
        'tags_en': '#Hiten #JAXA #MoonMission'},
    {   'id': 'SUZAKU',
        'name': 'すざく (ASTRO-EII / JAXA)',
        'badge': '超新星爆発の残骸や銀河団の熱いガスを観測',
        'color': '#818CF8',
        'lat': 31.0,
        'lon': 131.0,
        'alt': 570,
        'story_ja': '🌌【超新星爆発の残骸をX線で暴いた！すざく】\n'
                    '重元素の合成現場や銀河団を満たす1億度の超高温ガスを精密観測した日本の大型X線天文衛星🔭\n'
                    '💡【トリビア】宇宙の鉄やニッケルなど生命に不可欠な元素の分布図を作成！',
        'tags': '#すざく #X線天文学',
        'name_en': 'Suzaku (ASTRO-EII / X-ray Observatory)',
        'story_en': '🌌 [Suzaku / X-ray Supernova Scout]\n'
                    'Probed 100M°C gas and supernova shockwaves to map cosmic heavy elements! 🔭\n'
                    '💡 Trivia: Charted iron and nickel dispersal in space essential for planet birth.',
        'tags_en': '#Suzaku #JAXA #Astronomy'},
    {   'id': 'ASUKA',
        'name': 'あすか (ASTRO-D / JAXA)',
        'badge': 'ブラックホールの時空の歪みを世界初検出',
        'color': '#6366F1',
        'lat': 35.0,
        'lon': 139.0,
        'alt': 550,
        'story_ja': '🕳️【ブラックホールの時空の歪みを世界初検出！あすか】\n'
                    '日本のX線衛星！ブラックホール近傍で重力により光の波長が伸びる現象を激写🔭\n'
                    '💡【トリビア】アインシュタインの一般相対性理論を至近で実証！',
        'tags': '#あすか #ブラックホール',
        'name_en': 'Asuka (ASTRO-D / Black Hole Relativity)',
        'story_en': '🕳️ [Asuka / Black Hole Spacetime]\n'
                    'First sat using CCDs for X-ray astronomy, imaging redshift near black holes! 🔭\n'
                    "💡 Trivia: Confirmed Einstein's relativity right beside supermassive black holes.",
        'tags_en': '#Asuka #BlackHole #Einstein'},
    {   'id': 'GINGA',
        'name': 'ぎんが (ASTRO-C / JAXA)',
        'badge': '超新星1987Aの輝きを宇宙から捉えた奇跡の機',
        'color': '#A855F7',
        'lat': 30.0,
        'lon': 135.0,
        'alt': 500,
        'story_ja': '🌟【超新星1987AのX線を捉えた奇跡の星：ぎんが】\n'
                    '打上げ直後に大マゼラン雲で約400年ぶりの超新星爆発が発生！奇跡のタイミングでX線を観測⚡\n'
                    '💡【トリビア】爆発深部から湧き上がる放射性コバルトの崩壊線を世界初検出！',
        'tags': '#ぎんが #超新星爆発',
        'name_en': 'Ginga (ASTRO-C / Supernova 1987A Hunter)',
        'story_en': '🌟 [Ginga / Supernova 1987A Miracle]\n'
                    'Launched days before the closest supernova blast in 400 years erupted in the LMC! ⚡\n'
                    '💡 Trivia: Captured direct X-ray decay lines from radioactive Cobalt-56.',
        'tags_en': '#Ginga #Supernova #JAXA'},
    {   'id': 'HINODE',
        'name': 'ひので (SOLAR-B / JAXA)',
        'badge': '太陽の超高温コロナ加熱の謎に迫る宇宙望遠鏡',
        'color': '#F59E0B',
        'lat': 35.0,
        'lon': 139.0,
        'alt': 680,
        'story_ja': '☀️【太陽の超高温コロナの謎に迫る！ひので】\n'
                    '可視光・X線・極紫外線の3望遠鏡で太陽表面の磁場活動や巨大フレアの爆発を24時間監視中🔥\n'
                    '💡【トリビア】太陽表面は6,000度なのに上空コロナが100万度になる謎を解明！',
        'tags': '#ひので #太陽観測',
        'name_en': 'Hinode (SOLAR-B / Solar Observatory)',
        'story_en': '☀️ [Hinode / Solar Corona Explorer]\n'
                    'Carries 3 telescopes watching solar flares and magnetic reconnection 24/7! 🔥\n'
                    '💡 Trivia: Helped solve why the solar corona is 1,000,000°C while the surface is only 6,000°C.',
        'tags_en': '#Hinode #SolarPhysics #Sun'},
    {   'id': 'KIKU-7',
        'name': 'きく7号 (ETS-VII / おりひめ・ひこぼし)',
        'badge': '宇宙でロボットが自律ランデブードッキング成功',
        'color': '#EC4899',
        'lat': 35.0,
        'lon': 139.0,
        'alt': 550,
        'story_ja': '🤖【宇宙でロボットが自律合体！きく7号（おりひめ・ひこぼし）】\n'
                    '世界初！宇宙空間で親衛星と子衛星が分離し無人で自動接近・合体する技術を実証🛰️✨\n'
                    '💡【トリビア】ロボットアームで燃料補給や部品交換を行う宇宙ロボの原点！',
        'tags': '#きく7号 #宇宙ロボット',
        'name_en': 'Kiku-7 (ETS-VII / Orihime & Hikoboshi)',
        'story_en': '🤖 [Kiku-7 / Space Robot]\n'
                    'World-first test where a satellite separated and docked using a robot arm! 🛰️✨\n'
                    '💡 Trivia: Established foundational robotic rendezvous tech now used on ISS.',
        'tags_en': '#Kiku7 #SpaceRobotics #JAXA'},
    {   'id': 'KIKU-8',
        'name': 'きく8号 (ETS-VIII / JAXA)',
        'badge': 'テニスコート大の巨大傘アンテナを宇宙で展開',
        'color': '#F43F5E',
        'lat': 0.0,
        'lon': 146.0,
        'alt': 35786,
        'story_ja': '📡【テニスコートサイズの巨大アンテナを展開！きく8号】\n'
                    '世界最大級の大型展開反射鏡（19m×17m）を宇宙で開き携帯端末との直接通信を実証📶\n'
                    '💡【トリビア】地上アンテナが小さくても宇宙側を超巨大にして通信成立！',
        'tags': '#きく8号 #ETSVIII',
        'name_en': 'Kiku-8 (ETS-VIII / Tennis-Court Antenna)',
        'story_en': '📡 [Kiku-8 / Giant Tennis-Court Antenna]\n'
                    'Unfurled two 19m x 17m mesh reflectors to link directly with handheld phones! 📶\n'
                    '💡 Trivia: Proved giant space antennas enable tiny ground user terminals.',
        'tags_en': '#Kiku8 #JAXA #Satellite'},
    {   'id': 'REIMEI',
        'name': 'れいめい (INDEX / JAXA)',
        'badge': '重さ72kg！オーロラの微細発光構造を解明',
        'color': '#10B981',
        'lat': 70.0,
        'lon': 140.0,
        'alt': 640,
        'story_ja': '🌌【わずか72kgでオーロラを解明！名機れいめい】\n'
                    'JAXAの超小型衛星！オーロラがカーテンのように瞬く微細な発光構造と電子の動きを同時観測✨\n'
                    '💡【トリビア】小型ながら3軸制御を完璧にこなし設計寿命を10年以上超えて大活躍！',
        'tags': '#れいめい #オーロラ観測',
        'name_en': 'Reimei (INDEX / 72kg Aurora Explorer)',
        'story_en': '🌌 [Reimei / 72kg Aurora Scout]\n'
                    'Tiny satellite linking cameras with particle detectors to resolve aurora curtains! ✨\n'
                    '💡 Trivia: Designed for 1 year, operated with precision for over 15 years.',
        'tags_en': '#Reimei #Aurora #SmallSat'},
    {   'id': 'MOS-1',
        'name': 'もも1号 (MOS-1 / 日本初の地球観測衛星)',
        'badge': '日本初！宇宙から国土と海洋を見つめた先駆者',
        'color': '#06B6D4',
        'lat': 35.0,
        'lon': 135.0,
        'alt': 900,
        'story_ja': '🌊【日本初の地球観測衛星！海洋観測衛星もも1号】\n'
                    '1987年打上げ！宇宙から日本周辺の海面水温や海流、植物分布を観測した日本のリモセンの開拓者🌏\n'
                    '💡【トリビア】搭載した国産センサーで地球観測の独自技術を確立！',
        'tags': '#もも1号 #地球観測',
        'name_en': "Momo-1 (MOS-1 / Japan's First Earth Observer)",
        'story_en': "🌊 [Momo-1 / Japan's Earth Observation]\n"
                    "1987: Japan's pioneer remote sensing sat measuring ocean temps and currents! 🌏\n"
                    '💡 Trivia: Established domestic tech for building multispectral space sensors.',
        'tags_en': '#Momo1 #EarthObservation #JAXA'},
    {   'id': 'CS-2',
        'name': 'さくら2号 (CS-2a / 日本初の商用通信衛星)',
        'badge': '離島通信や災害非常回線を支えた日本の要',
        'color': '#EAB308',
        'lat': 0.0,
        'lon': 132.0,
        'alt': 35786,
        'story_ja': '📡【離島の通信格差をなくした！日本初の通信衛星さくら2号】\n'
                    '小笠原諸島など離島と本土を結び、災害時の非常通信回線を確保した日本の情報通信の要🌸\n'
                    '💡【トリビア】世界で初めて準ミリ波（Kaバンド）の実用通信に成功！',
        'tags': '#さくら2号 #通信衛星',
        'name_en': 'Sakura-2 (CS-2a / First Commercial Comms)',
        'story_en': '📡 [Sakura-2 / Pioneer Comms Sat]\n'
                    'Linked isolated islands with Tokyo and provided disaster emergency voice lines! 🌸\n'
                    "💡 Trivia: World's first operational satellite using Ka-band microwave frequencies.",
        'tags_en': '#Sakura2 #Satellite #Comms'},
    {   'id': 'BS-2',
        'name': 'ゆり2号 (BS-2a / 日本初の直接放送衛星)',
        'badge': '宇宙からお茶の間へ！日本の衛星放送の幕開け',
        'color': '#F97316',
        'lat': 0.0,
        'lon': 110.0,
        'alt': 35786,
        'story_ja': '📺【宇宙からお茶の間へ直接テレビ送信！ゆり2号】\n'
                    '1984年打上げ！全国の難視聴地域へパラボラアンテナで直接TV電波を届けた衛星放送の祖✨\n'
                    '💡【トリビア】世界に先駆けて実用直接衛星放送（DBS）を実現させた歴史機！',
        'tags': '#ゆり2号 #衛星放送',
        'name_en': 'Yuri-2 (BS-2a / First Direct TV Broadcast)',
        'story_en': '📺 [Yuri-2 / Direct Satellite TV]\n'
                    '1984: Pioneered direct satellite TV broadcasting into home dish antennas! ✨\n'
                    '💡 Trivia: Made Japan a world pioneer in consumer direct-broadcast satellite tech.',
        'tags_en': '#Yuri2 #SatelliteTV #Japan'},
    {   'id': 'TRMM',
        'name': 'TRMM (熱帯降雨観測衛星 / JAXA・NASA)',
        'badge': '宇宙から雨雲の断面をCTスキャンした伝説機',
        'color': '#3B82F6',
        'lat': 20.0,
        'lon': 130.0,
        'alt': 400,
        'story_ja': '🌧️【宇宙から雨雲をCTスキャン！熱帯降雨観測衛星TRMM】\n'
                    '日米共同開発！世界初の降雨レーダーで台風の内部構造や熱循環を17年間観測し続けた巨星🌀\n'
                    '💡【トリビア】台風の目が発達するメカニズムを世界で初めて3次元で解明！',
        'tags': '#TRMM #熱帯降雨観測',
        'name_en': 'TRMM (Tropical Rainfall / JAXA・NASA)',
        'story_en': '🌧️ [TRMM / 3D Storm Radar]\n'
                    'Joint NASA-JAXA radar satellite tracking tropical cyclones for 17 years! 🌀\n'
                    '💡 Trivia: Revealed 3D eyewall dynamics of monster typhoons for the first time.',
        'tags_en': '#TRMM #JAXA #NASA #Weather'},
    {   'id': 'GPM-CORE',
        'name': 'GPM主衛星 (全球降水観測計画 / JAXA・NASA)',
        'badge': '2波長レーダーで地球の雨と雪を立体観測',
        'color': '#0284C7',
        'lat': 35.0,
        'lon': 140.0,
        'alt': 407,
        'story_ja': '❄️【地球全体の雨と雪を宇宙から測定！GPM主衛星】\n'
                    'TRMMの後継！日本開発の二周波降水レーダー（DPR）で熱帯豪雨から北極圏の降雪まで立体観測🛰️\n'
                    '💡【トリビア】世界中の衛星網と連携し3時間ごとに全球降水マップを作成！',
        'tags': '#GPM #全球降水観測',
        'name_en': 'GPM Core Observatory (Global Precipitation)',
        'story_en': '❄️ [GPM Core / Global Rain Sentinel]\n'
                    'Dual-frequency radar mapping rainfall from storms to polar snow in 3D! 🛰️\n'
                    '💡 Trivia: Anchors a global constellation updating rain maps every 3 hours.',
        'tags_en': '#GPM #NASA #JAXA #Weather'},
    {   'id': 'ASNARO-1',
        'name': 'ASNARO-1 (NEC 超小型高性能地球観測機)',
        'badge': 'わずか500kgで地上50cmを見分ける鋭い眼',
        'color': '#14B8A6',
        'lat': 35.0,
        'lon': 138.0,
        'alt': 504,
        'story_ja': '📸【わずか500kgで地上50cmを識別！ASNARO-1】\n'
                    '従来の大型衛星に匹敵する超高解像度カメラを小型ボディに凝縮したNECの革新衛星🛰️✨\n'
                    '💡【トリビア】車1台や道路の白線まで宇宙からくっきり識別できる精密アイ！',
        'tags': '#ASNARO1 #リモートセンシング',
        'name_en': 'ASNARO-1 (NEC Compact High-Res Optical)',
        'story_en': '📸 [ASNARO-1 / Sub-Meter SmallSat]\n'
                    'Packed a 50cm camera into a 500kg mini-sat at a fraction of standard costs! 🛰️✨\n'
                    '💡 Trivia: Can resolve individual road lanes and crosswalks from 500 km.',
        'tags_en': '#ASNARO1 #NEC #SmallSat'},
    {   'id': 'HAKUCHO',
        'name': 'はくちょう (CORSA-b / 日本初のX線天文衛星)',
        'badge': '日本のX線天文学の原点！X線バーストを発見',
        'color': '#38BDF8',
        'lat': 31.0,
        'lon': 131.0,
        'alt': 550,
        'story_ja': '🦢【日本のX線天文学の原点！はくちょう】\n'
                    '1979年打上げ！ブラックホール候補天体やX線バースト現象を世界で次々と発見した開拓衛星🔭\n'
                    '💡【トリビア】初代打上げ失敗を乗り越え「白鳥のように飛び立て」と命名！',
        'tags': '#はくちょう #X線天文',
        'name_en': 'Hakucho (CORSA-b / First X-ray Satellite)',
        'story_en': "🦢 [Hakucho / Japan's X-ray Pioneer]\n"
                    '1979: Discovered dozens of X-ray bursters and binary black hole candidates! 🔭\n'
                    "💡 Trivia: Named 'Swan' to rise like a phoenix after a predecessor rocket failure.",
        'tags_en': '#Hakucho #JAXA #Astronomy'},
    {   'id': 'PIONEER-11',
        'name': 'パイオニア11号 (Pioneer 11 / NASA)',
        'badge': '人類で初めて土星を接近探査した偉大な開拓者',
        'color': '#D97706',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 15000000000,
        'story_ja': '🪐【土星に初めて接近した開拓者！パイオニア11号】\n'
                    '木星スイングバイで土星へ急行！環の隙間をくぐり抜け未知の「F環」を世界初発見🔭\n'
                    '💡【トリビア】ボイジャー探査機が安全に通過できるか身をもって偵察！',
        'tags': '#パイオニア11号 #土星接近',
        'name_en': 'Pioneer 11 (Saturn Pioneer / NASA)',
        'story_en': '🪐 [Pioneer 11 / NASA]\n'
                    'First craft to make a close flyby of Saturn, discovering its narrow F ring! 🔭\n'
                    "💡 Trivia: Tested whether Saturn's rings were safe for the upcoming Voyager probes.",
        'tags_en': '#Pioneer11 #Saturn #NASA'},
    {   'id': 'HUYGENS',
        'name': 'ホイヘンス (Huygens / ESAタイタン着陸機)',
        'badge': '土星の月タイタンへ着陸！メタンの川を発見',
        'color': '#F97316',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 1400000000,
        'story_ja': '🍊【太陽系で最も遠い着陸！タイタン着陸機ホイヘンス】\n'
                    'カッシーニから分離し濃い大気の衛星タイタンへ突入！液体メタンが流れる川と海岸線を撮影📸\n'
                    '💡【トリビア】マイナス180度の氷の小石が転がる異世界地表から生還送信！',
        'tags': '#ホイヘンス #タイタン着陸',
        'name_en': 'Huygens Probe (Titan Lander / ESA)',
        'story_en': '🍊 [Huygens Probe / ESA]\n'
                    "Farthest landing in human history, touching down on Saturn's orange moon Titan! 📸\n"
                    '💡 Trivia: Landed on icy pebbles and photographed riverbeds carved by liquid methane.',
        'tags_en': '#Huygens #Titan #ESA #Cassini'},
    {   'id': 'INSIGHT',
        'name': 'インサイト (InSight / NASA火星地震計)',
        'badge': '火星の地震「火震」を1,300回観測した地質学者',
        'color': '#EA580C',
        'lat': 4.5,
        'lon': 135.6,
        'alt': 0,
        'story_ja': '🔴【火星の鼓動に耳を澄ませた！探査機インサイト】\n'
                    '火星表面に超高感度地震計を直接設置！1,300回以上の「火震」を検出し火星の核やマントル構造を解明🧪\n'
                    '💡【トリビア】隕石衝突の振動を捉え火星にできたてクレーターを発見！',
        'tags': '#インサイト #火星地震',
        'name_en': 'InSight (Mars Seismometer / NASA)',
        'story_en': '🔴 [InSight / NASA]\n'
                    'Placed a sensitive seismometer directly on Mars, detecting 1,300+ marsquakes! 🧪\n'
                    '💡 Trivia: Revealed that Mars has a liquid metallic core and a surprisingly thin crust.',
        'tags_en': '#InSight #MarsQuake #NASA'},
    {   'id': 'OPPORTUNITY',
        'name': 'オポチュニティ (Opportunity / 火星探査車)',
        'badge': '90日予定が15年！火星を45km走破した伝説',
        'color': '#DC2626',
        'lat': -1.9,
        'lon': 354.5,
        'alt': 0,
        'story_ja': '🚙【90日予定が15年！火星を走破したオポチュニティ】\n'
                    '寿命の60倍走り続け、火星に太古の塩水湖があった証拠を発見した不屈の名ローバー🪨\n'
                    '💡【トリビア】猛烈な砂嵐で途絶えるまで科学データを届けました！',
        'tags': '#オポチュニティ #火星ローバー',
        'name_en': 'Opportunity Rover (Mars Exploration)',
        'story_en': '🚙 [Opportunity / 15-Year Mars Rover]\n'
                    'Designed for 90 days, drove 45 km over 15 years, proving past salty lakes! 🪨\n'
                    '💡 Trivia: Worked tirelessly until a planet-wide dust storm finally blanketed its solar panels.',
        'tags_en': '#Opportunity #MarsRover #NASA'},
    {   'id': 'SPIRIT',
        'name': 'スピリット (Spirit / NASA火星探査車)',
        'badge': '車輪故障を引きずりながら地下のシリカを発見',
        'color': '#B91C1C',
        'lat': -14.6,
        'lon': 175.5,
        'alt': 0,
        'story_ja': '🚗【故障した車輪を引きずり大発見！スピリット】\n'
                    '右前輪が動かなくなり後ろ向き走行で土を削ったところ、過去の温泉活動を示す純白のシリカ層を偶然発見♨️\n'
                    '💡【トリビア】絶望的な故障を科学の大金星へと変えた奇跡のローバー！',
        'tags': '#スピリット #火星探査',
        'name_en': 'Spirit Rover (Mars Exploration / NASA)',
        'story_en': '🚗 [Spirit / Broken Wheel Discovery]\n'
                    'When its front wheel jammed, dragged it backward to uncover pure silica deposits! ♨️\n'
                    '💡 Trivia: Proved ancient Mars once hosted active hydrothermal hot springs.',
        'tags_en': '#Spirit #MarsRover #NASA'},
    {   'id': 'LUNAR-PROSPECTOR',
        'name': 'ルナー・プロスペクター (Lunar Prospector / NASA)',
        'badge': '月の極域に大量の氷があることを特定した探査機',
        'color': '#94A3B8',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 100,
        'story_ja': '🌔【月の極域に氷を発見！ルナープロスペクター】\n'
                    '中性子分光計で月の永久影に大量の水素（水氷）が眠ることを特定した重要探査機❄️\n'
                    '💡【トリビア】天文学者シューメーカー博士の遺灰を月に埋葬した唯一の機！',
        'tags': '#ルナープロスペクター #月の氷',
        'name_en': 'Lunar Prospector (Mapping Moon Ice / NASA)',
        'story_en': '🌔 [Lunar Prospector / Finding Moon Ice]\n'
                    'Mapped neutron signatures showing buried water ice in shadowed craters! ❄️\n'
                    '💡 Trivia: Carried the cremated ashes of planetary geologist Gene Shoemaker.',
        'tags_en': '#Moon #NASA #LunarProspector'},
    {   'id': 'GENESIS',
        'name': 'ジェネシス (Genesis / NASA太陽風捕集機)',
        'badge': '砂漠へパラシュート開かず激突！試料奇跡の回収',
        'color': '#FACC15',
        'lat': 40.0,
        'lon': -113.0,
        'alt': 0,
        'story_ja': '☀️【太陽風の粒を捕まえ地球帰還！ジェネシス】\n'
                    'L1点で太陽風イオンを高純度ウェハーに捕集！帰還時にパラシュート不開で砂漠へ墜落💥\n'
                    '💡【トリビア】カプセル大破も破片から太陽風試料の回収に成功！',
        'tags': '#ジェネシス #太陽風サンプル',
        'name_en': 'Genesis (Solar Wind Sample Return / NASA)',
        'story_en': '☀️ [Genesis / Catching Solar Wind]\n'
                    'Trapped solar wind ions at L1; parachute failed, crashing in the Utah desert! 💥\n'
                    '💡 Trivia: Scientists miraculously recovered pristine solar ions from shattered wafers.',
        'tags_en': '#Genesis #SolarWind #NASA'},
    {   'id': 'SOJOURNER',
        'name': 'ソジャーナ (Mars Pathfinder / 1997年火星車)',
        'badge': '火星の地表を初めて走った電子レンジサイズの車',
        'color': '#EF4444',
        'lat': 19.3,
        'lon': -33.5,
        'alt': 0,
        'story_ja': '🚙【火星の赤土を初めて走った！超小型探査車ソジャーナ】\n'
                    '1997年、エアバッグで跳ねて着陸！電子レンジサイズで火星の岩石を直接分析🪨\n'
                    '💡【トリビア】地球からの指示を待たず危険な段差を自分で避ける自律走行を実証！',
        'tags': '#ソジャーナ #火星ローバー',
        'name_en': 'Sojourner (Mars Pathfinder / First Rover)',
        'story_en': '🚙 [Sojourner / First Mars Rover]\n'
                    'Microwave-sized pioneer that bounced on airbags to explore Martian red soil! 🪨\n'
                    '💡 Trivia: Demonstrated autonomous hazard avoidance, guiding all future rovers.',
        'tags_en': '#Sojourner #MarsRover #NASA'},
    {   'id': 'VIKING-1',
        'name': 'バイキング1号 (Viking 1 / 1976年火星着陸機)',
        'badge': '火星地表から人類初のカラーパノラマを送信',
        'color': '#991B1B',
        'lat': 22.5,
        'lon': -48.0,
        'alt': 0,
        'story_ja': '🔴【火星の地表から世界初の鮮明写真を送信！バイキング1号】\n'
                    '1976年着陸！赤い空と岩だらけの荒野の姿を人類へ届け、土壌から生命の兆候を探る実験を実施🧪\n'
                    '💡【トリビア】着陸機は6年以上も火星表面で生き続け気象データを送信！',
        'tags': '#バイキング1号 #火星着陸',
        'name_en': 'Viking 1 (First Mars Surface Photos / 1976)',
        'story_en': '🔴 [Viking 1 / First Color Mars Views]\n'
                    "1976: Transmitted humanity's first color panoramas of red rocks and skies on Mars! 🧪\n"
                    '💡 Trivia: Operated on the Martian surface for over 6 years, tracking weather.',
        'tags_en': '#Viking1 #Mars #NASA'},
    {   'id': 'MARS-ODYSSEY',
        'name': 'マーズ・オデッセイ (Mars Odyssey / NASA火星機)',
        'badge': '20年以上現役！火星の地下氷を発見した長老',
        'color': '#EA580C',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 400,
        'story_ja': '❄️【火星地下の氷を発見！最長寿の探査機マーズオデッセイ】\n'
                    '2001年以来20年以上も火星軌道を周回中！ガンマ線分光計で地下深くに大量の氷を特定🪐\n'
                    '💡【トリビア】火星ローバーたちの通信を地球へ中継する要としても大活躍！',
        'tags': '#マーズオデッセイ #火星探査',
        'name_en': 'Mars Odyssey (Longest Surviving Mars Orbiter)',
        'story_en': '❄️ [Mars Odyssey / 20+ Years at Mars]\n'
                    'Detected vast deposits of water ice across Mars, operating continuously since 2001! 🪐\n'
                    '💡 Trivia: Serves as the primary comms relay for Mars surface rovers.',
        'tags_en': '#MarsOdyssey #NASA #Mars'},
    {   'id': 'MAVEN',
        'name': 'メイブン (MAVEN / NASA火星大気探査機)',
        'badge': 'なぜ火星は海を失った？大気流出の謎を解明',
        'color': '#C2410C',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 150,
        'story_ja': '💨【火星の大気が宇宙へ逃げた犯人を特定！MAVEN】\n'
                    '海があった火星がなぜ砂漠になったのか？太陽風が大気を剥ぎ取って宇宙へ吹き飛ばす過程を解明🔴\n'
                    '💡【トリビア】火星の上層大気に潜り込むエアロブレーキングで観測！',
        'tags': '#MAVEN #火星大気',
        'name_en': 'MAVEN (Mars Atmospheric Loss / NASA)',
        'story_en': "💨 [MAVEN / Mars' Lost Atmosphere]\n"
                    "Probed how solar wind stripped Mars's air over billions of years into a desert! 🔴\n"
                    '💡 Trivia: Dips into the upper Martian atmosphere during aerobraking sweeps.',
        'tags_en': '#MAVEN #Mars #NASA'},
    {   'id': 'WMAP',
        'name': 'WMAP (宇宙背景放射異方性探査機 / NASA)',
        'badge': '宇宙の年齢「137億年」を割り出した精密機',
        'color': '#3B82F6',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 1500000,
        'story_ja': '🔭【宇宙の年齢137億歳を割り出した！WMAP】\n'
                    '太陽・地球のL2点からビッグバンの名残の温度ムラを超高精度測定！宇宙の年齢や成分比を決定✨\n'
                    '💡【トリビア】宇宙の構成がダークエネルギー73%、暗黒物質23%、原子4%と判明！',
        'tags': '#WMAP #宇宙論',
        'name_en': 'WMAP (Age of the Universe / NASA)',
        'story_en': '🔭 [WMAP / Measuring Cosmic Age]\n'
                    'Mapped Big Bang afterglow ripples at L2, fixing cosmic age at 13.77B years! ✨\n'
                    '💡 Trivia: Found the universe is 71% dark energy, 24% dark matter, and 5% atoms.',
        'tags_en': '#WMAP #Cosmology #NASA'},
    {   'id': 'COBE',
        'name': 'COBE (宇宙背景放射探査機 / NASA)',
        'badge': 'ビッグバンの決定的証拠！ノーベル物理学賞',
        'color': '#8B5CF6',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 900,
        'story_ja': '🏆【ビッグバンの完全な痕跡を発見！COBE】\n'
                    '宇宙背景放射が黒体放射と完全一致することを測定しビッグバン理論を決定づけた伝説機🌌\n'
                    '💡【トリビア】理論線と測定点が完全一致した瞬間、会場は大喝采！',
        'tags': '#COBE #ノーベル物理学賞',
        'name_en': 'COBE (Cosmic Background Explorer / NASA)',
        'story_en': '🏆 [COBE / Nobel Cosmic Proof]\n'
                    'Measured CMB spectrum, perfectly matching the blackbody radiation of the Big Bang! 🌌\n'
                    '💡 Trivia: Earned the 2006 Nobel Prize in Physics for John Mather & George Smoot.',
        'tags_en': '#COBE #NobelPrize #NASA'},
    {   'id': 'NEOWISE',
        'name': 'NEOWISE (広視野赤外線探査機 / NASA)',
        'badge': '赤外線で小惑星や新彗星を狩り続けたハンター',
        'color': '#EC4899',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 525,
        'story_ja': '☄️【危険な小惑星を宇宙から探知！NEOWISE】\n'
                    '赤外線で光を反射しにくい暗い小惑星や新彗星を数千個発見！地球防衛の先頭に立った名機🔭\n'
                    '💡【トリビア】2020年に肉眼で見えた大彗星ネオワイズ彗星を発見した立役者！',
        'tags': '#NEOWISE #小惑星探査',
        'name_en': 'NEOWISE (Asteroid Hunter / NASA)',
        'story_en': '☄️ [NEOWISE / Planetary Defense Hunter]\n'
                    'Infrared surveyor detecting thousands of dark asteroids and comets passing close to Earth! 🔭\n'
                    '💡 Trivia: Discovered the famous naked-eye Comet NEOWISE (C/2020 F3) in 2020.',
        'tags_en': '#NEOWISE #Asteroids #Comets'},
    {   'id': 'GLOBALSTAR',
        'name': 'Globalstar (衛星通信網 / iPhone衛星SOS)',
        'badge': 'スマホから直接宇宙へSOS！命を救う低軌道網',
        'color': '#38BDF8',
        'lat': 30.0,
        'lon': -100.0,
        'alt': 1414,
        'story_ja': '📱【スマホから直接宇宙へSOS！命を救うGlobalstar】\n'
                    'iPhoneの緊急SOS機能と宇宙で直結！圏外の山岳地帯や海上で遭難者を救助に導く低軌道通信網🆘\n'
                    '💡【トリビア】外付けアンテナなしでスマホから宇宙へ直接テキスト送信を実現！',
        'tags': '#Globalstar #衛星通信',
        'name_en': 'Globalstar (iPhone Satellite SOS Network)',
        'story_en': '📱 [Globalstar / SOS from Orbit]\n'
                    'Constellation linking smartphones directly to space for emergency SOS in dead zones! 🆘\n'
                    '💡 Trivia: Enabled direct satellite texting from unmodified smartphones.',
        'tags_en': '#Globalstar #EmergencySOS'},
    {   'id': 'O3B-MPOWER',
        'name': 'O3b mPOWER (SES / 次世代中軌道通信網)',
        'badge': '高度8,000kmから超高速テラビット回線',
        'color': '#0284C7',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 8000,
        'story_ja': '🌐【洋上の豪華客船へギガビット通信を届ける！O3b mPOWER】\n'
                    '赤道上空8,000kmの中軌道（MEO）からビームを放ち、島嶼部やクルーズ船へ超低遅延ネットを提供🚢✨\n'
                    '💡【トリビア】数千本の可動ビームを電子制御で地上へ瞬時に切り替え！',
        'tags': '#O3bmPOWER #SES',
        'name_en': 'O3b mPOWER (SES Gigabit MEO Network)',
        'story_en': '🌐 [O3b mPOWER / Gigabit MEO Fleet]\n'
                    'Beaming gigabit low-latency internet from 8,000 km to ships, islands, and remote bases! 🚢\n'
                    '💡 Trivia: Electronically steers thousands of digital beams across Earth.',
        'tags_en': '#O3bmPOWER #SES #Broadband'},
    {   'id': 'VIASAT-3',
        'name': 'Viasat-3 (超大容量静止通信衛星)',
        'badge': '1Tbpsの怪物容量！飛行機Wi-Fiを支える巨人',
        'color': '#2563EB',
        'lat': 0.0,
        'lon': -89.0,
        'alt': 35786,
        'story_ja': '✈️【飛行機のWi-Fiを支える1Tbpsの怪物！Viasat-3】\n'
                    '重さ6トン！1機で1テラビット毎秒という前例のない超大容量を誇る世界最強クラスの静止衛星📶\n'
                    '💡【トリビア】太陽電池パドルを広げると全幅はジャンボジェット機に匹敵！',
        'tags': '#Viasat #静止衛星',
        'name_en': 'Viasat-3 (1 Terabit/s Geostationary Giant)',
        'story_en': '✈️ [Viasat-3 / 1 Tbps Giant]\n'
                    '6-ton satellite delivering 1,000 Gbps capacity to power in-flight airline Wi-Fi! 📶\n'
                    '💡 Trivia: Solar wingspan rivals that of a Boeing 747 jumbo jet.',
        'tags_en': '#Viasat3 #InflightWifi #GEO'},
    {   'id': 'BLACKSKY',
        'name': 'BlackSky (超高頻度リアルタイム地球観測網)',
        'badge': 'AIが世界拠点の変化を1日何十回も自動追跡',
        'color': '#10B981',
        'lat': 38.0,
        'lon': -77.0,
        'alt': 430,
        'story_ja': '🤖【AIが世界のサプライチェーンを見張る！BlackSky】\n'
                    '超小型光学衛星群が世界中を周回！AIが撮影画像を即座に自動解析し港の船や工場の稼働状況を監視中🚢📦\n'
                    '💡【トリビア】注文を受けてからわずか90分以内に撮影画像を顧客へ納品！',
        'tags': '#BlackSky #AI地球観測',
        'name_en': 'BlackSky (AI Real-Time Geospatial Fleet)',
        'story_en': '🤖 [BlackSky / AI Real-Time Imaging]\n'
                    'Constellation using AI to track port cranes and global supply chains in near real-time! 🚢📦\n'
                    '💡 Trivia: Delivers fresh satellite imagery in as fast as 90 minutes from order.',
        'tags_en': '#BlackSky #AI #Geospatial'},
    {   'id': 'WORLDVIEW-LEGION',
        'name': 'WorldView Legion (Maxar / 最高峰光学衛星)',
        'badge': '30cm解像度！地上を走る車の車種まで判別',
        'color': '#F59E0B',
        'lat': 30.0,
        'lon': -100.0,
        'alt': 500,
        'story_ja': '📸【車の車種まで宇宙から見分ける！WorldView Legion】\n'
                    '民間最高峰の30cm級解像度！災害救助や都市計画、ニュース報道で世界を最も精密に映し出すMaxarの眼✨\n'
                    '💡【トリビア】マンホールの蓋や道路標識の文字まで識別可能な驚異の解像度！',
        'tags': '#Maxar #WorldView',
        'name_en': 'WorldView Legion (Maxar 30cm Next-Gen)',
        'story_en': '📸 [WorldView Legion / Maxar 30cm Fleet]\n'
                    "Maxar's fleet capturing 30cm optical imagery with up to 15 revisits per day! ✨\n"
                    '💡 Trivia: Sharp enough to resolve manhole covers and road markings from orbit.',
        'tags_en': '#Maxar #EarthImagery #Optics'},
    {   'id': 'GEO-IK-2',
        'name': 'Geo-IK-2 (測地衛星 / 地球の形状を極限測定)',
        'badge': 'ミリ単位で地球の丸みと大陸移動を測る',
        'color': '#64748B',
        'lat': 55.0,
        'lon': 37.0,
        'alt': 1000,
        'story_ja': '🌐【ミリ単位で地球の歪みを測る！測地衛星Geo-IK-2】\n'
                    'レーダー高度計とレーザー反射鏡で地球の正確な形状やジオイド面を極限まで精密測定する測地衛星🛰️\n'
                    '💡【トリビア】大陸プレートのわずかな動きや極運動のズレを宇宙から監視！',
        'tags': '#測地衛星 #地球形状',
        'name_en': 'Geo-IK-2 (Russian Geodetic Satellite)',
        'story_en': "🌐 [Geo-IK-2 / Earth's True Shape]\n"
                    "Uses radar altimetry and laser mirrors to measure Earth's geoid and plate motions! 🛰️\n"
                    "💡 Trivia: Monitors subtle shifts in Earth's spin axis and gravity anomalies.",
        'tags_en': '#GeoIK2 #Geodesy #Roscosmos'},
    {   'id': 'MARS-EXPRESS',
        'name': 'マーズ・エクスプレス (Mars Express / ESA)',
        'badge': '20年以上火星を回り南極の地下氷を発見した眼',
        'color': '#DC2626',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 350,
        'story_ja': '🔴【20年以上火星を飛ぶ欧州の名機！マーズエクスプレス】\n'
                    '火星の南極冠の氷の下に液体の水が存在する可能性を発見！壮大な峡谷の3D映像を激写🪐\n'
                    '💡【トリビア】予定寿命2年のところ20年以上も現役観測中！',
        'tags': '#マーズエクスプレス #ESA火星',
        'name_en': "Mars Express (ESA's Long-Lived Mars Orbiter)",
        'story_en': '🔴 [Mars Express / 20+ Years at Mars]\n'
                    'Discovered subglacial liquid water lakes beneath the Martian south polar ice! 🪐\n'
                    '💡 Trivia: Captured stunning 3D images of the giant Valles Marineris canyon.',
        'tags_en': '#MarsExpress #ESA #Mars'},
    {   'id': 'VENUS-EXPRESS',
        'name': 'ビーナス・エクスプレス (Venus Express / ESA)',
        'badge': '金星の超回転大気「スーパーローテーション」解明',
        'color': '#F59E0B',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 250,
        'story_ja': '🌪️【金星の灼熱の暴風を解明！ビーナスエクスプレス】\n'
                    '自転の60倍の速さで回る金星大気スーパーローテーションや巨大な南極渦を詳細観測🔥\n'
                    '💡【トリビア】夜側に二酸化硫黄の変動を発見し活火山の存在を示唆！',
        'tags': '#ビーナスエクスプレス #金星探査',
        'name_en': 'Venus Express (ESA Venus Explorer)',
        'story_en': '🌪️ [Venus Express / Hurricane Winds]\n'
                    "Probed Venus's 400 km/h super-rotating atmosphere and giant polar hurricane! 🔥\n"
                    '💡 Trivia: Found sulfur dioxide spikes on Venus, suggesting active volcanic eruptions.',
        'tags_en': '#VenusExpress #ESA #Venus'},
    {   'id': 'BEPICOLOMBO',
        'name': 'ベピ・コロンボ (BepiColombo / 日欧共同水星探査)',
        'badge': '水星へ航行中！日欧の2つの探査機が合体飛行',
        'color': '#3B82F6',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 60000000,
        'story_ja': '🚀【水星を目指す日欧連合の巨星！ベピ・コロンボ】\n'
                    'JAXAの水星磁気圏探査機「みお」とESAの周回機が合体航行！金星と地球で何度もスイングバイ中🪐\n'
                    '💡【トリビア】太陽からの猛烈な熱と紫外線に耐える特殊耐熱シールドを装備！',
        'tags': '#ベピコロンボ #水星探査',
        'name_en': 'BepiColombo (ESA・JAXA Mercury Tandem)',
        'story_en': '🚀 [BepiColombo / Dual Mercury Probe]\n'
                    'ESA-JAXA tandem craft cruising to Mercury via 9 planetary flybys! 🪐\n'
                    "💡 Trivia: Uses solar ion thrusters to brake against the Sun's immense gravity pull.",
        'tags_en': '#BepiColombo #ESA #JAXA #Mercury'},
    {   'id': 'HIPPARCOS',
        'name': 'ヒッパルコス (Hipparcos / 人類初の位置天文学機)',
        'badge': '大気の揺らぎを超えて10万個の恒星を精密測定',
        'color': '#6366F1',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 35000,
        'story_ja': '✨【宇宙から星の距離を測った挑戦：ヒッパルコス】\n'
                    '大気のない宇宙から恒星の年周視差を測定し11万個の星の高精度カタログを作成した先駆機📜\n'
                    '💡【トリビア】エンジン失敗で楕円軌道に残されるも知恵で任務完遂！',
        'tags': '#ヒッパルコス #位置天文学',
        'name_en': 'Hipparcos (First Astrometry Satellite / ESA)',
        'story_en': '✨ [Hipparcos / First Space Astrometry]\n'
                    'Measured parallaxes of 118,000 stars from orbit without atmospheric blur! 📜\n'
                    '💡 Trivia: Despite an apogee engine failure, clever software saved the mission.',
        'tags_en': '#Hipparcos #ESA #Astrometry'},
    {   'id': 'SWARM',
        'name': 'スウォーム (Swarm / ESA地磁気観測3機編成)',
        'badge': '3機編隊で地球の磁場シールドの弱まりを測定',
        'color': '#14B8A6',
        'lat': 60.0,
        'lon': 10.0,
        'alt': 460,
        'story_ja': '🧲【地球の磁場シールドの異変を監視！スウォーム3機編隊】\n'
                    '3機の衛星が連携して地球内部から宇宙空間まで磁場の変化を立体測定！磁極の移動や弱小化を追跡🌍\n'
                    '💡【トリビア】南大西洋異常帯（SAA）で磁場が急激に弱まっている実態を解明！',
        'tags': '#Swarm #地球磁場',
        'name_en': 'Swarm (ESA Magnetic Field Trio)',
        'story_en': '🧲 [Swarm / Magnetic Shield Trio]\n'
                    "Triad of satellites measuring Earth's magnetic shield from core to magnetosphere! 🌍\n"
                    '💡 Trivia: Found the South Atlantic Anomaly is rapidly weakening and expanding.',
        'tags_en': '#Swarm #ESA #Geomagnetism'},
    {   'id': 'GRACE-FO',
        'name': 'GRACE-FO (重力観測・気候実験 / NASA・独DLR)',
        'badge': '2機の距離変化をレーザーで測り地下水減少を検出',
        'color': '#0284C7',
        'lat': 50.0,
        'lon': 10.0,
        'alt': 490,
        'story_ja': '💧【地球の重力変化から氷と地下水を測る！GRACE-FO】\n'
                    '220km離れた2機の距離をレーザーでナノメートル単位で計測！氷床の融解や地下水の枯渇を宇宙から検出🛰️\n'
                    '💡【トリビア】地下水がどこで減っているかを重力の軽さから暴き出します！',
        'tags': '#GRACEFO #重力観測',
        'name_en': 'GRACE-FO (NASA・DLR Gravity Fleet)',
        'story_en': '💧 [GRACE-FO / Laser Groundwater Tracker]\n'
                    'Two satellites track distance with lasers to map melting ice sheets! 🛰️\n'
                    '💡 Trivia: Detects depleted underground aquifers from subtle regional gravity shifts.',
        'tags_en': '#GRACEFO #NASA #Climate'},
    {   'id': 'SMART-1',
        'name': 'SMART-1 (欧州初の月探査機 / イオン推進)',
        'badge': 'わずか60リットルのキセノンで月へ螺旋到達',
        'color': '#8B5CF6',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 300,
        'story_ja': '🚀【イオンエンジンで月へ螺旋航行！欧州のSMART-1】\n'
                    'わずか60Lのキセノンガス燃料で1年以上かけて地球を何周も回りながら月軌道へ到達した革新機🌔\n'
                    '💡【トリビア】月の極域永久影に水氷が存在する可能性をX線分光で探査！',
        'tags': '#SMART1 #イオンエンジン',
        'name_en': "SMART-1 (ESA's First Lunar Mission)",
        'story_en': '🚀 [SMART-1 / Electric Moon Voyage]\n'
                    'Used just 60 liters of xenon fuel to spiral out to the Moon over 14 months! 🌔\n'
                    '💡 Trivia: Proved ion propulsion is viable for deep space interplanetary journeys.',
        'tags_en': '#SMART1 #ESA #Moon'},
    {   'id': 'LUNA-9',
        'name': 'ルナ9号 (Luna 9 / 1966年 初の月面軟着陸)',
        'badge': '月面に世界で初めて軟着陸し写真を送信',
        'color': '#EAB308',
        'lat': 7.08,
        'lon': -64.37,
        'alt': 0,
        'story_ja': '📷【月面に世界で初めて軟着陸！ルナ9号】\n'
                    'エアバッグでクッション着陸し花びらのようなアンテナを展開！「月面は深い宇宙塵に沈む」という俗説を打ち破る🌕✨\n'
                    '💡【トリビア】英天文台が信号傍受しソ連公式発表より先に世界報道！',
        'tags': '#ルナ9号 #月面軟着陸',
        'name_en': 'Luna 9 (First Moon Soft Landing / 1966)',
        'story_en': '📷 [Luna 9 / First Moon Soft Landing]\n'
                    '1966: Bounced on airbags, opened petal antennas, and beamed the first Moon panorama! 🌕\n'
                    '💡 Trivia: Disproved fears that spacecraft would sink into thick lunar dust.',
        'tags_en': '#Luna9 #MoonLanding #History'},
    {   'id': 'LUNA-10',
        'name': 'ルナ10号 (Luna 10 / 人類初の月周回衛星)',
        'badge': '人類初！月の周りを回る人工衛星となった機',
        'color': '#F59E0B',
        'lat': 0.0,
        'lon': 0.0,
        'alt': 350,
        'story_ja': '🛰️【人類初の月周回人工衛星！ルナ10号】\n'
                    '1966年、月周回軌道へ世界初進入！月の重力場や磁場、宇宙線環境を月軌道から初測定🌔\n'
                    '💡【トリビア】軌道上から革命歌「インターナショナル」を電波中継！',
        'tags': '#ルナ10号 #月周回衛星',
        'name_en': 'Luna 10 (First Moon Orbiter / 1966)',
        'story_en': '🛰️ [Luna 10 / First Moon Orbiter]\n'
                    '1966: First craft to orbit the Moon, measuring lunar magnetic fields and gravity! 🌔\n'
                    "💡 Trivia: Broadcast the anthem 'The Internationale' from lunar orbit.",
        'tags_en': '#Luna10 #MoonOrbiter #SpaceHistory'},
    {   'id': 'LUNA-16',
        'name': 'ルナ16号 (Luna 16 / 初の無人月サンプルリターン)',
        'badge': 'アポロに続き完全無人で月の砂を持ち帰った奇跡',
        'color': '#D97706',
        'lat': -0.68,
        'lon': 56.3,
        'alt': 0,
        'story_ja': '🌕【完全無人で月の砂を持ち帰った！ルナ16号】\n'
                    '1970年、月面へ自動着陸！ドリルで掘削した土壌を上昇機カプセルで地球へ回収大成功📦\n'
                    '💡【トリビア】有人アポロに対抗しロボット技術で月サンプルを採取！',
        'tags': '#ルナ16号 #無人サンプルリターン',
        'name_en': 'Luna 16 (First Robotic Moon Sample / 1970)',
        'story_en': '🌕 [Luna 16 / Robotic Moon Sample]\n'
                    'Autonomous lander drilled 35 cm into lunar soil and rocketed a return capsule to Earth! 📦\n'
                    '💡 Trivia: First purely robotic mission to return extraterrestrial soil to Earth.',
        'tags_en': '#Luna16 #MoonSample #History'},
    {   'id': 'LUNOKHOD-1',
        'name': 'ルノホート1号 (Lunokhod 1 / 1970年 月面車)',
        'badge': '人類初の月面無人探査車！8輪駆動の巨大ロボ',
        'color': '#84CC16',
        'lat': 38.3,
        'lon': -35.0,
        'alt': 0,
        'story_ja': '🤖【月面を走った人類初の無人探査車！ルノホート1号】\n'
                    '8輪駆動のローバーで地球から遠隔操縦され10km以上を走破した伝説の宇宙探査車🌔\n'
                    '💡【トリビア】極寒の月の夜（マイナス150℃）を放射性熱源で越冬！',
        'tags': '#ルノホート #月面ローバー',
        'name_en': 'Lunokhod 1 (First Planetary Rover / 1970)',
        'story_en': '🤖 [Lunokhod 1 / First Planetary Rover]\n'
                    '8-wheeled robotic rover steered from Earth, roaming 10.5 km across the Moon! 🌔\n'
                    '💡 Trivia: Kept warm during -150°C lunar nights using a polonium isotopic heater.',
        'tags_en': '#Lunokhod #MoonRover #History'},
    {   'id': 'VENERA-13',
        'name': 'ベネラ13号 (Venera 13 / 1982年 金星着陸機)',
        'badge': '460度の灼熱で金星のカラー写真と風音を録音',
        'color': '#DC2626',
        'lat': -7.5,
        'lon': 303.0,
        'alt': 0,
        'story_ja': '🔥【460度・90気圧の地獄で耐えた！ベネラ13号】\n'
                    '高熱の金星地表に着陸！世界初の金星カラー写真撮影とマイクでの風の音録音に成功🎙️\n'
                    '💡【トリビア】チタン耐圧殻と冷却装置で過酷な地表で127分間生還！',
        'tags': '#ベネラ13号 #金星着陸',
        'name_en': 'Venera 13 (Recording Sound on Venus / 1982)',
        'story_en': '🎙️ [Venera 13 / Sounds of Venus]\n'
                    'Survived 460°C & 89 atm for 127 min, taking color photos and recording Venusian wind! 🔥\n'
                    '💡 Trivia: First craft to record and transmit real sounds from another planet.',
        'tags_en': '#Venera13 #Venus #SpaceHistory'},
    {   'id': 'SALYUT-1',
        'name': 'サリュート1号 (Salyut 1 / 1971年 初の宇宙駅)',
        'badge': '人類初の宇宙ステーション！長期滞在の礎',
        'color': '#06B6D4',
        'lat': 51.6,
        'lon': 0.0,
        'alt': 200,
        'story_ja': '🛸【人類初の宇宙ステーション！サリュート1号】\n'
                    '1971年打上げ！飛行士が23日間滞在し宇宙で初めて人間が暮らす拠点を築いた記念碑的宇宙船✨\n'
                    '💡【トリビア】ステーション内部で望遠鏡観測や植物栽培実験を実施！',
        'tags': '#サリュート1号 #宇宙ステーション',
        'name_en': 'Salyut 1 (First Space Station / 1971)',
        'story_en': '🛸 [Salyut 1 / First Space Station]\n'
                    '1971: The first orbital station where humans lived and worked, staying 23 days! ✨\n'
                    '💡 Trivia: Hosted the Soyuz 11 crew, who grew hydroponic plants in orbit.',
        'tags_en': '#Salyut1 #SpaceStation #History'},
    {   'id': 'CHANGE-5',
        'name': "嫦娥5号 (Chang'e 5 / 2020年 月サンプルリターン)",
        'badge': '44年ぶり！月の若い火山玄武岩を持ち帰った機',
        'color': '#DC2626',
        'lat': 43.1,
        'lon': -51.8,
        'alt': 0,
        'story_ja': '🌕【44年ぶりに月の砂を持ち帰った！嫦娥5号】\n'
                    '月面から2kgの砂を掘削し月軌道で合体して地球帰還した圧巻のミッション🇨🇳\n'
                    '💡【トリビア】採取した玄武岩から20億年前まで月に火山活動があったと判明！',
        'tags': '#嫦娥5号 #月面探査',
        'name_en': "Chang'e 5 (Lunar Basalt Sample Return)",
        'story_en': "🌕 [Chang'e 5 / 2kg Moon Sample]\n"
                    '2020: Drilled 2kg of lunar soil and docked autonomously in lunar orbit to return home! 🇨🇳\n'
                    '💡 Trivia: Proved volcanic eruptions occurred on the Moon 2.0 billion years ago.',
        'tags_en': '#Change5 #MoonSample #CNSA'},
    {   'id': 'TIANZHOU',
        'name': '天舟 (Tianzhou / 中国宇宙補給船)',
        'badge': '天宮へ燃料と物資を全自動補給する宇宙トラック',
        'color': '#F59E0B',
        'lat': 41.5,
        'lon': 110.0,
        'alt': 400,
        'story_ja': '🚀【天宮を支える宇宙の補給トラック：天舟】\n物資や推進薬を搭載し天宮へ自律高速ドッキング！全自動で燃料移送を実施⛽✨\n💡【トリビア】打上げからわずか2時間で天宮と合体する神速記録を樹立！',
        'tags': '#天舟 #宇宙ステーション',
        'name_en': 'Tianzhou (Cargo Ship for Tiangong)',
        'story_en': '🚀 [Tianzhou / Orbital Cargo Truck]\n'
                    'Carries 6+ tons of supplies, docking with Tiangong station in under 2 hours! ⛽✨\n'
                    "💡 Trivia: Automatically refuels Tiangong's tanks via its pressurized docking port.",
        'tags_en': '#Tianzhou #Tiangong #SpaceCargo'},
    {   'id': 'XUNTIAN',
        'name': '巡天 (CSST / 中国巨大宇宙望遠鏡)',
        'badge': 'ハッブルの300倍の視野！天宮ステーションと並走',
        'color': '#3B82F6',
        'lat': 41.5,
        'lon': 110.0,
        'alt': 400,
        'story_ja': '🔭【ハッブルの300倍の視野！中国の巨大望遠鏡・巡天】\n'
                    '口径2mの宇宙望遠鏡！ステーション天宮と同じ軌道を飛び、必要に応じて天宮に合体して整備・修理🇨🇳\n'
                    '💡【トリビア】広大な全天の40%を10年間かけて高精細スキャン探査！',
        'tags': '#巡天 #宇宙望遠鏡',
        'name_en': 'Xuntian (CSST / Chinese Space Telescope)',
        'story_en': '🔭 [Xuntian / Huge-Field Telescope]\n'
                    '2m space telescope co-orbiting Tiangong, capable of docking for repairs! 🇨🇳\n'
                    '💡 Trivia: Field of view is 300x larger than Hubble with matching resolution.',
        'tags_en': '#Xuntian #SpaceTelescope #Astronomy'},
    {   'id': 'ASTROSAT',
        'name': 'アストロサット (AstroSat / インド宇宙天文台)',
        'badge': '紫外線から硬X線まで！インド初の多波長天文台',
        'color': '#EA580C',
        'lat': 13.0,
        'lon': 80.0,
        'alt': 650,
        'story_ja': '🌌【インド初の宇宙天文台！AstroSat】\n'
                    '可視光からX線まで5つの望遠鏡を搭載！中性子星やブラックホール連星を高精度観測🔭🇮🇳\n'
                    '💡【トリビア】異なる波長で同時に突発天体を追跡できるインドの誇り！',
        'tags': '#AstroSat #インド天文台',
        'name_en': 'AstroSat (Multi-Wavelength Observatory)',
        'story_en': '🌌 [AstroSat / Multi-Wavelength Eye]\n'
                    'Observes targets simultaneously across optical, UV, and X-ray bands! 🔭🇮🇳\n'
                    '💡 Trivia: Tracks rapid brightness flickers from black hole accretion disks.',
        'tags_en': '#AstroSat #ISRO #Astronomy'},
    {   'id': 'BERESHEET',
        'name': 'ベレシート (Beresheet / イスラエル民間月探査機)',
        'badge': '世界初！民間チームが月面へ挑んだ先駆機',
        'color': '#2563EB',
        'lat': 32.0,
        'lon': 19.0,
        'alt': 0,
        'story_ja': '🚀【世界初の民間月面探査への挑戦！ベレシート】\n'
                    'イスラエルの民間団体SpaceILが開発！低予算で月軌道進入に成功し民間宇宙探査の歴史を拓いた先駆機🇮🇱\n'
                    '💡【トリビア】機内には聖書全巻やウィキペディア、数千匹のクマムシを搭載！',
        'tags': '#ベレシート #民間宇宙',
        'name_en': 'Beresheet (First Private Moon Mission)',
        'story_en': '🚀 [Beresheet / Private Moon Lander]\n'
                    'Built by Israeli non-profit SpaceIL, reached lunar orbit on a modest $100M budget! 🇮🇱\n'
                    '💡 Trivia: Carried a lunar library with Wikipedia and dormant tardigrades.',
        'tags_en': '#Beresheet #SpaceIL #Moon'},
    {   'id': 'SKYLAB',
        'name': 'スカイラブ (Skylab / 米国初の宇宙実験室)',
        'badge': '巨大ロケットの燃料タンクを改造した宇宙の家',
        'color': '#38BDF8',
        'lat': 50.0,
        'lon': -100.0,
        'alt': 435,
        'story_ja': '🇺🇸【巨大ロケットをくり抜いた宇宙実験室！スカイラブ】\n'
                    'サターンVロケットの第3段燃料タンクを巨大居住区に大改造！3組の飛行士が長期滞在し観測を実施✨\n'
                    '💡【トリビア】遮熱板脱落の危機を飛行士が宇宙空間で日傘を差して修理！',
        'tags': '#スカイラブ #Skylab',
        'name_en': "Skylab (America's First Space Station)",
        'story_en': '🇺🇸 [Skylab / Saturn V Orbital Home]\n'
                    'Converted a Saturn V third stage into a spacious two-story orbital station! ✨\n'
                    '💡 Trivia: Astronauts parasol-repaired a lost heat shield in a daring spacewalk.',
        'tags_en': '#Skylab #NASA #SpaceStation'},
    {   'id': 'APOLLO-13',
        'name': 'アポロ13号 (Apollo 13 / 奇跡の生還)',
        'badge': '酸素タンク爆発から生還した「栄光ある失敗」',
        'color': '#EF4444',
        'lat': 0.0,
        'lon': 180.0,
        'alt': 400171,
        'story_ja': '🌕【爆発事故から奇跡の生還！アポロ13号】\n'
                    '月への途中で酸素タンクが爆発！着陸船を救命ボートにして月の裏側を回り地球へ帰還🚀\n'
                    '💡【トリビア】映画にもなった名言「ヒューストン、問題が発生した」の伝説機！',
        'tags': '#アポロ13号 #奇跡の生還',
        'name_en': 'Apollo 13 (The Successful Failure / 1970)',
        'story_en': '🌕 [Apollo 13 / Triumph of Ingenuity]\n'
                    'Oxygen tank exploded en route to Moon; used lunar module as a lifeboat to return! 🚀\n'
                    "💡 Trivia: Famously coined 'Houston, we've had a problem' before safe splashdown.",
        'tags_en': '#Apollo13 #NASA #SpaceHistory'},
    {   'id': 'SPACESHIPONE',
        'name': 'スペースシップワン (SpaceShipOne / 2004年)',
        'badge': '世界初！民間企業が開発した有人宇宙飛行機',
        'color': '#10B981',
        'lat': 35.0,
        'lon': -118.0,
        'alt': 100,
        'story_ja': '🚀【民間初の有人宇宙飛行！スペースシップワン】\n'
                    '2004年、母機から空中発進しロケット点火で高度100kmの宇宙境界線を突破✨\n'
                    '💡【トリビア】大気圏再突入時は主翼を羽のように折り曲げて安定降下！',
        'tags': '#スペースシップワン #民間宇宙',
        'name_en': 'SpaceShipOne (First Private Crewed Spaceflight)',
        'story_en': '🚀 [SpaceShipOne / X-Prize Winner]\n'
                    '2004: First private crewed spaceplane to reach 100 km altitude twice in 2 weeks! ✨\n'
                    '💡 Trivia: Twin-tail wings feathered upward like a shuttlecock for safe re-entry.',
        'tags_en': '#SpaceShipOne #NewSpace #Xprize'}]

def task_satellite_spotlight():
    sat = random.choice(FEATURED_SATELLITES)
    s_lat, s_lon = sat.get("lat", 35.0), sat.get("lon", 139.0)
    s_alt = sat.get("alt", 500.0)

    # 英語名を優先表示
    display_name = sat.get("name_en", sat["name"])
    short_label = display_name.split(" (")[0][:16]

    # 英語ミッション説明・トリビアの抽出
    import re
    def _smart_truncate(text, max_len):
        words = text.split()
        res = []
        curr = 0
        for w in words:
            addition = len(w) + (1 if res else 0)
            if curr + addition <= max_len:
                res.append(w)
                curr += addition
            else:
                break
        return " ".join(res)

    mission_en = ""
    feature_en = ""
    if "story_en" in sat:
        lines = [l.strip() for l in sat["story_en"].split("\n") if l.strip()]
        if len(lines) >= 2:
            m_text = re.sub(r'^[^\w\s]+', '', lines[1]).strip()
            m_text = re.sub(r'[^\w\s\-\.,/]+$', '', m_text).strip()
            mission_en = _smart_truncate(m_text, 36)
        if len(lines) >= 3:
            t_text = re.sub(r'^(💡\s*)?(Trivia:\s*)?', '', lines[2], flags=re.IGNORECASE).strip()
            t_text = re.sub(r'[^\w\s\-\.,/]+$', '', t_text).strip()
            feature_en = _smart_truncate(t_text, 42)

    if not mission_en:
        mission_en = "Earth & Space Exploration Mission"
    if not feature_en:
        feature_en = "Active Satellite in Global Fleet"

    out_img = "post_card.png"
    render_3d_globe(
        center_lat=s_lat, center_lon=s_lon,
        markers=[
            {"lat": s_lat, "lon": s_lon, "alt_km": min(s_alt, 35000), "label": short_label, "color": sat["color"], "size": 12}
        ],
        badge="SATELLITE SPOTLIGHT • 3D RADAR",
        badge_color=sat["color"],
        title=display_name[:28],
        metrics=[
            {"label": "SATELLITE MISSION", "value": mission_en, "color": sat.get("color", "#38BDF8")},
            {"label": "KEY TRIVIA / FEATURE", "value": feature_en, "color": "#F8FAFC"},
            {"label": "ORBIT ALTITUDE", "value": f"~{s_alt:,.0f} km" if s_alt < 100000 else f"Deep Space (~{s_alt:,.0f} km)", "color": "#4ADE80"},
            {"label": "INTERACTIVE 3D SIMULATION", "value": "Real-Time Tracking & Telemetry", "color": "#38BDF8"},
            {"label": "GLOBAL CATALOG", "value": "Active Worldwide Space Fleet", "color": "#FACC15"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    # 世界中の宇宙ファンに向け、英語解説・トリビアを最優先で投稿
    if "story_en" in sat:
        clean_story = sat['story_en'].replace('・', ' & ')
        text = (
            f"{clean_story}\n\n"
            f"{LINK_GUIDE['EN']}\n"
            f"{sat.get('tags_en', '#Space #Satellite #Science')}"
        )
    elif "story_ja" in sat:
        text = (
            f"{sat['story_ja']}\n\n"
            f"{LINK_GUIDE['JA']}\n"
            f"{sat.get('tags', '#宇宙 #人工衛星')}"
        )
    else:
        text = (
            f"🛰️ Satellite Spotlight: {display_name}\n\n"
            f"{LINK_GUIDE['EN']}\n#Space #Satellite"
        )

    return text, out_img

# -------------------------------------------------------------
# Mode 9: Asteroid Spotlight (Asteroid3D / 3D Keplerian Orbit Alert)
# -------------------------------------------------------------
ASTEROIDS_DB = [
    {
        "id": "apophis",
        "name": "99942 Apophis",
        "type": "Atens (Potentially Hazardous Asteroid)",
        "diameter": "340 m",
        "speed": "30.7 km/s",
        "flyby": "April 13, 2029",
        "dist": "0.08 LD (31,600 km - Closer than GEO satellites!)",
        "a": 0.9224, "e": 0.1912, "color": "#EF4444",
        "fact": "Will pass so close to Earth in 2029 that it will be visible to the naked eye for over 2 billion people across Europe and Africa! ✨"
    },
    {
        "id": "bennu",
        "name": "101955 Bennu",
        "type": "Apollo (PHA / OSIRIS-REx Sampled)",
        "diameter": "490 m",
        "speed": "27.8 km/s",
        "flyby": "Sept 25, 2135",
        "dist": "0.53 LD (203,000 km)",
        "a": 1.1264, "e": 0.2037, "color": "#F97316",
        "fact": "A carbonaceous rubble-pile asteroid with a 1-in-2,700 cumulative impact risk in 2182. Samples returned to Earth by NASA in 2023! 🔬"
    },
    {
        "id": "ryugu",
        "name": "162173 Ryugu",
        "type": "Apollo (Hayabusa2 Sampled)",
        "diameter": "900 m",
        "speed": "26.9 km/s",
        "flyby": "Dec 5, 2076",
        "dist": "3.90 LD (1,500,000 km)",
        "a": 1.1896, "e": 0.1902, "color": "#EAB308",
        "fact": "A diamond-shaped spinning top asteroid explored by JAXA's Hayabusa2, revealing primordial water and amino acids from the birth of the Solar System! 💎"
    },
    {
        "id": "dimorphos",
        "name": "65803 Dimorphos",
        "type": "DART Kinetic Impact Defense Target",
        "diameter": "160 m",
        "speed": "23.5 km/s",
        "flyby": "Oct 4, 2123",
        "dist": "15.3 LD (5,900,000 km)",
        "a": 1.644, "e": 0.3838, "color": "#06B6D4",
        "fact": "In 2022, NASA's DART spacecraft intentionally slammed into it at 22,500 km/h, proving humanity can deflect dangerous asteroids! 💥🛡️"
    }
]

def task_asteroid_alert():
    ast = random.choice(ASTEROIDS_DB)
    now_utc = datetime.datetime.now(datetime.timezone.utc)

    out_img = "post_card.png"
    render_3d_globe(
        center_lat=10.0, center_lon=30.0,
        markers=[
            {"lat": 10.0, "lon": 30.0, "alt_km": 15000.0, "label": f"{ast['name']} (Flyby)", "color": ast["color"], "size": 14}
        ],
        trails=[
            {"points": [(-20.0 + i*2.5, -30.0 + i*4.0) for i in range(25)], "color": ast["color"], "width": 3, "alt_km": 15000.0}
        ],
        badge="NEAR-EARTH ASTEROID RADAR",
        badge_color=ast["color"],
        title=f"Asteroid {ast['name']}",
        metrics=[
            {"label": "ASTEROID CLASS", "value": ast["type"][:32], "color": ast["color"]},
            {"label": "ESTIMATED SIZE", "value": ast['diameter'], "color": "#F8FAFC"},
            {"label": "CLOSEST APPROACH", "value": f"{ast['flyby']} ({ast['dist']})", "color": "#F97316"},
            {"label": "FLYBY VELOCITY", "value": f"{ast['speed']} relative speed", "color": "#4ADE80"},
            {"label": "PLANETARY DEFENSE", "value": "NASA / JPL / ESA Monitored", "color": "#FACC15"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"☄️ Near-Earth Asteroid Alert: {ast['name']}!\n"
            f"📏 Diameter: {ast['diameter']} | ⚡ Speed: {ast['speed']}\n"
            f"🎯 Next Flyby: {ast['flyby']}\n"
            f"📍 Distance: {ast['dist'][:25]}\n\n"
            f"{LINK_GUIDE['EN']}\n#Asteroid #PlanetaryDefense #NASA #Astronomy"
        ),
        (
            f"🌍 Planetary Defense: Asteroid {ast['name']}\n"
            f"Tracking this near-Earth space rock cruising at {ast['speed']} relative velocity! Live 3D Keplerian orbital radar simulation 🛰️🔭\n\n"
            f"{LINK_GUIDE['EN']}\n#Asteroids #SpaceSafety #Science"
        )
    ]
    text = random.choice(templates)
    return text, out_img

# -------------------------------------------------------------
# メイン実行ルーチン
# -------------------------------------------------------------
MODES = [
    "SATELLITE_SPOTLIGHT",
    "ISS_LIVE",
    "SATELLITE_SPOTLIGHT",
    "ASTEROID_ALERT",
    "SATELLITE_SPOTLIGHT",
    "TIANGONG_LIVE",
    "SATELLITE_SPOTLIGHT",
    "STARLINK_TRAIN",
    "SATELLITE_SPOTLIGHT",
    "HUBBLE_LIVE",
    "SATELLITE_SPOTLIGHT",
    "SPACE_DEBRIS",
    "SATELLITE_SPOTLIGHT",
    "SPAIN_LATAM_LIVE",
    "SATELLITE_SPOTLIGHT",
    "STARLINK_FLEET"
]

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

    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print("=" * 60)
    print(f"[{now_str}] 🛰️ SatViewer3D Master Bot - Running Mode: [{mode}]")
    print("=" * 60)

    # 互換性: 単体で AUTO_FOLLOWER が指定された場合（アカウント保護のため停止）
    if mode == "AUTO_FOLLOWER":
        print("⚠️ [AUTO_FOLLOWER] アカウントのスパムポリシー違反・機能制限を回避するため、自動フォロー機能は停止されています。")
        return

    if mode == "ISS_LIVE":
        text, img = task_iss_live()
    elif mode == "TIANGONG_LIVE":
        text, img = task_tiangong_live()
    elif mode == "ASTEROID_ALERT":
        text, img = task_asteroid_alert()
    elif mode == "SPAIN_LATAM_LIVE":
        text, img = task_spanish_radar()
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

    # 1. ツイート投稿を実行
    success = post_to_x(text, image_path=img, headless=True)
    if success:
        with open(MODE_FILE, "w") as f:
            f.write(mode)
        print(f"🎉 Successfully posted mode [{mode}] to X!")
    else:
        print(f"❌ Failed to post mode [{mode}].")
        sys.exit(1)

    # 2. ついでにフォロワー育成巡回（auto_follower）
    # ⚠️ Xのスパムポリシー違反（アカウント機能制限）を防ぐため、自動フォロー機能は恒久的に停止します。
    # try:
    #     import auto_follower
    #     print("\n🤖 [AUTO_FOLLOWER] 宇宙・天体観測関心ユーザーの巡回を実行します...")
    #     auto_follower.main()
    #     print("🎉 [AUTO_FOLLOWER] Completed successfully!")
    # except Exception as e:
    #     print(f"[WARN] AUTO_FOLLOWER skipped: {e}")

if __name__ == "__main__":
    target_mode = sys.argv[1] if len(sys.argv) > 1 else None
    run_master_bot(target_mode)
