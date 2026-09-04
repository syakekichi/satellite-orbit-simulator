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
                {"label": "ORBITAL SPEED / 飛行速度", "value": f"{speed_km_h:,.0f} km/h (7.7 km/s)", "color": "#38BDF8"},
                {"label": "CURRENT ALTITUDE / 高度", "value": f"{alt:.1f} km (LEO)", "color": "#F8FAFC"},
                {"label": "FLYOVER REGION / 通過地域", "value": f"{ctx['region_ja']} / {ctx['region_en']}", "color": "#4ADE80"},
                {"label": "COORDINATES / 現在座標", "value": f"{abs(lat):.1f}°{'N' if lat>=0 else 'S'}, {abs(lon):.1f}°{'E' if lon>=0 else 'W'}", "color": "#94A3B8"},
                {"label": "ORBITAL PERIOD / 公転周期", "value": "92.8 min (1日に地球を約16周)", "color": "#FACC15"}
            ],
            site_url="satviewer3d.com",
            out_path=out_img
        )

    # 多彩なバリエーション投稿文の生成
    if ctx["lang"] == "JA":
        templates = [
            (
                f"🛰️【今夜、夜空を見上げてみませんか？🔭】\n"
                f"国際宇宙ステーション（きぼう/ISS）が現在【{ctx['region_ja']}】上空を通過中！\n"
                f"日没後や夜明け前、スーッと滑るように動く星より明るい光の点があれば、それがISSです✨\n\n"
                f"リアルタイム3D軌道シミュレーションはこちら👇\n"
                f"{WEBSITE_URL}\n"
                f"#きぼう #ISS #天体観測 #宇宙"
            ),
            (
                f"💡【ISSの宇宙雑学】\n"
                f"現在【{ctx['region_ja']}】上空を飛行中の国際宇宙ステーション（ISS）。\n"
                f"時速約{speed_km_h:,.0f}kmで地球をたった92分で1周するため、宇宙飛行士は1日に『16回』も日の出と日の入りを目撃します🌅🌌\n\n"
                f"宇宙から見た地球の3Dライブ軌道はこちら👇\n"
                f"{WEBSITE_URL}\n"
                f"#宇宙の雑学 #ISS #JAXA #NASA"
            ),
            (
                f"🚀【地上400kmを飛ぶサッカー場サイズの巨大実験棟】\n"
                f"時速{speed_km_h:,.0f}kmで爆走中のISS（きぼう）が【{ctx['region_ja']}】上空を航行中！\n"
                f"重力に引かれて落ち続けながら、地球の丸みに沿って回り続ける軌道力学の奇跡🛰️\n\n"
                f"リアルタイム3D地球儀で軌道をチェック👇\n"
                f"{WEBSITE_URL}\n"
                f"#国際宇宙ステーション #3Dシミュレーター"
            )
        ]
        text = random.choice(templates)
    elif ctx["lang"] == "ES":
        templates = [
            (
                f"🛰️ ¡La Estación Espacial Internacional (ISS) sobre {ctx['region_es']}!\n"
                f"Viajando a {speed_km_h:,.0f} km/h a una altitud de {alt:.0f} km. ¡Visible a simple vista en el cielo despejado! 🔭✨\n\n"
                f"Sigue la órbita en 3D en directo: {WEBSITE_URL}\n"
                f"#ISS #Espacio #Astronomia"
            ),
            (
                f"💡 ¿Sabías que los astronautas en la ISS ven 16 amaneceres al día?\n"
                f"La estación orbita la Tierra cada 90 minutos a {speed_km_h:,.0f} km/h. Ahora sobre {ctx['region_es']} 🌍✨\n\n"
                f"Rastreo 3D en tiempo real: {WEBSITE_URL}"
            )
        ]
        text = random.choice(templates)
    elif ctx["lang"] == "ZH":
        templates = [
            (
                f"🛰️ 国际空间站（ISS）正在飞越【{ctx['region_zh']}】上空！\n"
                f"时速高达 {speed_km_h:,.0f} km/h，高度 {alt:.0f} km。每90分钟环绕地球一周，夜空晴朗时肉眼清晰可见✨\n\n"
                f"实时3D地球轨迹追踪: {WEBSITE_URL}\n"
                f"#国际空间站 #太空 #天文"
            ),
            (
                f"🌌【太空冷知识】空间站里的宇航员每天能看16次日出日落！\n"
                f"目前ISS正以秒速 7.7 km 高速掠过【{ctx['region_zh']}】上空 🛰️\n\n"
                f"3D地球轨道追踪: {WEBSITE_URL}"
            )
        ]
        text = random.choice(templates)
    elif ctx["lang"] == "RU":
        text = (
            f"🛰️ Международная космическая станция (МКС) над {ctx['region_ru']}!\n"
            f"Скорость {speed_km_h:,.0f} км/ч на высоте {alt:.0f} км. Полный оборот вокруг Земли за 92 минуты! 🔭✨\n\n"
            f"3D отслеживание орбиты: {WEBSITE_URL}"
        )
    else:
        templates = [
            (
                f"🛰️ International Space Station (ISS) Live Flyover!\n"
                f"Zooming over {ctx['region_en']} at {speed_km_h:,.0f} km/h ({alt:.0f} km altitude). Visible to the naked eye as a brilliant gliding star under clear twilight skies! 🔭🌌\n\n"
                f"Track live 3D orbital trajectory: {WEBSITE_URL}\n"
                f"#ISS #Space #Astronomy #NASA"
            ),
            (
                f"💡 ISS Fun Fact: Astronauts aboard see 16 sunrises and sunsets every single day!\n"
                f"Cruising at 7.7 km/s over {ctx['region_en']}. Spot it in the night sky 🌍✨\n\n"
                f"Interactive 3D Digital Globe: {WEBSITE_URL}"
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
            {"label": "ORBITAL SPEED / 飛行速度", "value": f"{speed_km_h:,.0f} km/h (7.7 km/s)", "color": "#F59E0B"},
            {"label": "CURRENT ALTITUDE / 高度", "value": f"{alt:.1f} km (LEO)", "color": "#F8FAFC"},
            {"label": "FLYOVER REGION / 通過地域", "value": f"{ctx['region_ja']} / {ctx['region_en']}", "color": "#4ADE80"},
            {"label": "COORDINATES / 現在座標", "value": f"{abs(lat):.1f}°{'N' if lat>=0 else 'S'}, {abs(lon):.1f}°{'E' if lon>=0 else 'W'}", "color": "#94A3B8"},
            {"label": "CORE MODULES / 構成モジュール", "value": "Tianhe (天和) / Wentian (問天) / Mengtian (夢天)", "color": "#FDE68A"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    if ctx["lang"] == "ZH":
        templates = [
            (
                f"🇨🇳【中国空间站（天宫）实时飞越】\n"
                f"天和核心舱与问天、梦天实验舱正在飞越【{ctx['region_zh']}】上空！\n"
                f"时速高达 {speed_km_h:,.0f} km/h，每90分钟环绕地球一周。夜空晴朗时肉眼清晰可见✨\n\n"
                f"空间站实时3D地球轨迹追踪👇\n{WEBSITE_URL}\n#中国空间站 #天宫空间站 #航天"
            ),
            (
                f"🌌【天宫太空漫步】中国空间站目前高度约 {alt:.0f} km，正在以秒速 7.7 km 高速掠过【{ctx['region_zh']}】！\n"
                f"三舱T字构型在宇宙中熠熠生辉 🛰️✨\n\n"
                f"3D地球轨道追踪: {WEBSITE_URL}\n#天宫 #航天科技"
            )
        ]
        text = random.choice(templates)
    elif ctx["lang"] == "JA":
        templates = [
            (
                f"🛰️【もうひとつの宇宙ステーション】\n"
                f"中国の宇宙ステーション『天宮（Tiangong/CSS）』が現在【{ctx['region_ja']}】上空を通過中！\n"
                f"天和コアモジュールを中心に3人の宇宙飛行士が滞在。高度約{alt:.0f}kmを時速約{speed_km_h:,.0f}kmで飛行中✨\n\n"
                f"ISSと天宮の軌道を3D地球儀でチェック👇\n{WEBSITE_URL}\n#宇宙ステーション #天宮 #天体観測"
            ),
            (
                f"💡【宇宙の豆知識】地球周回軌道上には現在、ISSと天宮という2大有人ステーションが常時周回しています。\n"
                f"現在【{ctx['region_ja']}】上空を航行中！夕方や早朝には明るい光の点として観測できます🔭\n\n"
                f"リアルタイム3D軌道シミュレーション👉 {WEBSITE_URL}\n#天宮 #宇宙開発"
            )
        ]
        text = random.choice(templates)
    elif ctx["lang"] == "ES":
        text = (
            f"🛰️ ¡La Estación Espacial Tiangong sobre {ctx['region_es']}!\n"
            f"Orbitando a {speed_km_h:,.0f} km/h en órbita terrestre baja 🌌✨\n\n"
            f"Sigue la trayectoria 3D en directo: {WEBSITE_URL}"
        )
    elif ctx["lang"] == "RU":
        text = (
            f"🛰️ Китайская орбитальная станция «Тяньгун» над {ctx['region_ru']}!\n"
            f"Скорость {speed_km_h:,.0f} км/ч на высоте ~{alt:.0f} км 🌌✨\n\n"
            f"3D отслеживание орбиты: {WEBSITE_URL}"
        )
    else:
        text = (
            f"🛰️ Tiangong Space Station (CSS) Live Orbit Tracker!\n"
            f"Zooming over {ctx['region_en']} at {speed_km_h:,.0f} km/h ({alt:.0f} km LEO) 🌌✨\n\n"
            f"Track real-time 3D orbit via our link: {WEBSITE_URL}\n#Tiangong #SpaceStation #Astronomy"
        )
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
        title="Constelación España & LATAM",
        metrics=[
            {"label": "PRIMARY SATELLITES / 監視衛星", "value": "PAZ (SAR Radar) / SAOCOM 1A/1B", "color": "#EF4444"},
            {"label": "MISSIONS / 主な任務", "value": "Earth Observation, Flood & Seismic Radar", "color": "#F8FAFC"},
            {"label": "TRACKED ASSETS / 追跡機数", "value": f"{len(markers)} Satellites in LEO & GEO", "color": "#38BDF8"},
            {"label": "TECHNOLOGY / 技術", "value": "X-Band & L-Band Synthetic Aperture", "color": "#4ADE80"},
            {"label": "ORBITAL COVERAGE", "value": "Global Coverage with 24h Revisit", "color": "#FACC15"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"🛰️ ¡Constelación de satélites de España y Latinoamérica en órbita!\n"
            f"Rastreando en directo PAZ (radar SAR), SAOCOM 1A/1B (radar banda L), CHEOPS e HISPASAT 📡✨\n\n"
            f"Capaces de ver a través de nubes y en plena noche. Sigue su órbita 3D interactiva en directo👇\n"
            f"{WEBSITE_URL}\n"
            f"#Satélites #España #Ciencia #PAZ #SAOCOM"
        ),
        (
            f"📡【雲も夜も透視する最新レーダー衛星群】\n"
            f"スペインの地球観測レーダー衛星『PAZ』やアルゼンチンの巨大アンテナ衛星『SAOCOM 1A/1B』を追跡中！\n"
            f"悪天候でも地殻変動や洪水被害を宇宙からミリ単位で検知する驚異の技術✨\n\n"
            f"リアルタイム3D地球儀でチェック👇\n{WEBSITE_URL}\n#宇宙開発 #衛星観測"
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
            {"label": "CONSTELLATION STATUS / 稼働状況", "value": "Over 6,000+ Active Satellites", "color": "#00F0FF"},
            {"label": "ALTITUDE / 軌道高度", "value": "540 - 570 km (Low Earth Orbit)", "color": "#F8FAFC"},
            {"label": "PLOTTED ON 3D GLOBE / 画面描画数", "value": f"{len(markers)} High-Priority Satellites", "color": "#4ADE80"},
            {"label": "INTERNET COVERAGE", "value": "Global High-Speed Low-Latency", "color": "#FACC15"},
            {"label": "ORBIT SPEED / 周回速度", "value": "Approx. 27,000 km/h (95 min/orbit)", "color": "#94A3B8"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"🌐【地球を覆い尽くす6,000機の宇宙ネットワーク】\n"
            f"SpaceXが展開する超巨大衛星網『Starlink（スターリンク）』⚡\n"
            f"高度約550kmの低軌道に数千機が網の目のように配置され、砂漠や洋上など世界中のあらゆる場所へ高速ネットを供給中🛰️\n\n"
            f"地球を包む圧倒的な3D衛星スウォームを体感👇\n{WEBSITE_URL}\n#SpaceX #Starlink #スターリンク #宇宙"
        ),
        (
            f"🛰️【宇宙時代の新風景：メガコンステレーション】\n"
            f"現在、地球の低軌道には前代未聞のペースで人工衛星が打ち上げられています。\n"
            f"自律的な衝突回避システムやレーザー光通信で連携する驚異の群制御技術✨\n\n"
            f"3D地球儀上でリアルタイムに群れを追跡👇\n{WEBSITE_URL}\n#イーロンマスク #SpaceX #テクノロジー"
        ),
        (
            f"🛰️ SpaceX Starlink Mega-Constellation Live!\n"
            f"Over 6,000 active broadband satellites wrapping the globe in low Earth orbit (LEO) 🌐⚡\n\n"
            f"Explore the full 3D interactive satellite swarm via our link👇\n{WEBSITE_URL}\n#Starlink #SpaceX #Astronomy #Satellite"
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
            {"label": "PHENOMENON / 天体現象", "value": "Naked-Eye Starlink Pearl String", "color": "#F59E0B"},
            {"label": "TRAIN FLEET SIZE / 追跡数", "value": f"{len(markers)} Recently Launched Sats", "color": "#F8FAFC"},
            {"label": "ORBITAL ALTITUDE / 軌道高度", "value": "300 - 450 km (Orbit Raising)", "color": "#4ADE80"},
            {"label": "VISIBILITY CONDITION", "value": "Optimal at Dusk / Dawn (Twilight)", "color": "#FACC15"},
            {"label": "ORBIT VELOCITY", "value": "Approx. 27,600 km/h", "color": "#94A3B8"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"🌌【夜空に浮かぶ銀河鉄道：スターリンクトレイン】\n"
            f"SpaceXが打ち上げた直後の衛星群が一列に並んで移動する神秘の天体ショー✨\n"
            f"打ち上げから数日間限定で、星のような光の点が数珠つなぎになって夜空をスーッと横切る姿が肉眼でも観測できます🔭\n\n"
            f"次の通過予測と3D軌道はこちら👇\n{WEBSITE_URL}\n#スターリンクトレイン #SpaceX #天体観測 #星空"
        ),
        (
            f"💡【なぜ一列に並んで光るの？】\n"
            f"ロケット1機で数十機同時に宇宙へ放出されたスターリンク衛星は、最初はお互いに近い距離で同じ軌道を飛びます。\n"
            f"その後、イオンエンジンで数週間かけて徐々に本来の定位置へ散らばっていくため、この『光の列車』は超激レアな初期限定の光景です🛰️✨\n\n"
            f"3D地球儀で現在地をチェック👉 {WEBSITE_URL}\n#宇宙の不思議 #Starlink"
        ),
        (
            f"✨ Witness the real-life 'Galaxy Express' in the night sky!\n"
            f"SpaceX Starlink Train: A freshly launched batch of satellites orbiting in a glowing single-file line 🌌🛰️\n\n"
            f"Track real-time 3D orbital train via our profile link: {WEBSITE_URL}\n#StarlinkTrain #SpaceX #Astronomy"
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
        badge="SPACE DEBRIS RADAR • 警告",
        badge_color="#EF4444",
        title="Orbital Space Debris Risk Radar",
        metrics=[
            {"label": "MONITORED OBJECTS / 監視物体数", "value": f"{len(markers)} Tracked Cataloged Debris", "color": "#EF4444"},
            {"label": "RELATIVE VELOCITY / 相対衝突速度", "value": "Up to 10 - 15 km/s (超音速の数十倍)", "color": "#F8FAFC"},
            {"label": "RISK ASSESSMENT / 警戒レベル", "value": "High Collision Probability in LEO", "color": "#F97316"},
            {"label": "ALTITUDE ZONE / 危険高度帯", "value": "700 - 1,000 km (Congested Belt)", "color": "#FACC15"},
            {"label": "COLLISION AVOIDANCE", "value": "Active Maneuver Shielding Monitored", "color": "#94A3B8"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"💥【秒速8kmの宇宙の弾丸：スペースデブリ】\n"
            f"役目を終えた人工衛星やロケットの破片である『宇宙デブリ』。\n"
            f"わずか1cmのネジでも、時速28,000kmの猛スピードではライフル弾の数十倍のエネルギーで宇宙ステーションを貫通します🛡️\n\n"
            f"宇宙の安全を守るリアルタイム3Dデブリ監視レーダーはこちら👇\n{WEBSITE_URL}\n#宇宙デブリ #宇宙開発 #JAXA #NASA"
        ),
        (
            f"🛰️【ケスラー・シンドロームの脅威とは？】\n"
            f"デブリ同士が衝突して破片がネズミ算式に増え、宇宙空間が使えなくなる連鎖反応の危機。\n"
            f"SatViewer3Dでは、地球周回軌道上に漂うデブリの位置をリアルタイムに3Dマッピング監視中⚡\n\n"
            f"3D地球儀で危険エリアをチェック👉 {WEBSITE_URL}\n#宇宙ゴミ #サイエンス"
        ),
        (
            f"🛡️ High-Speed Orbital Space Debris Live Tracking!\n"
            f"Cataloged fragmentation debris hurtling through LEO at 27,000+ km/h. Constant vigilance for manned stations like ISS and CSS 🛰️💥\n\n"
            f"Explore 3D collision risk visualizer: {WEBSITE_URL}\n#SpaceDebris #Astronomy #Space"
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
            {"label": "PRIMARY MISSION / 任務", "value": "Deep Space Optical Observatory", "color": "#F59E0B"},
            {"label": "ORBIT SPEED / 飛行速度", "value": f"{speed_km_h:,.0f} km/h (7.5 km/s)", "color": "#F8FAFC"},
            {"label": "CURRENT ALTITUDE / 高度", "value": f"{alt:.1f} km (LEO)", "color": "#4ADE80"},
            {"label": "ORBITAL PERIOD / 公転周期", "value": "95.4 min (地球を約95分で1周)", "color": "#FACC15"},
            {"label": "LAUNCH YEAR / 打ち上げ", "value": "1990 (35+ Years in Service)", "color": "#94A3B8"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"🔭【打ち上げから35年超：宇宙の瞳ハッブル望遠鏡】\n"
            f"無数の美しい星雲や深宇宙の銀河を捉え続けてきた『ハッブル宇宙望遠鏡 (HST)』✨\n"
            f"現在【{ctx['region_ja']}】上空を高度約{alt:.0f}km、時速{speed_km_h:,.0f}kmで元気に航行中！\n\n"
            f"レジェンド望遠鏡のリアルタイム3D軌道はこちら👇\n{WEBSITE_URL}\n#ハッブル宇宙望遠鏡 #NASA #天文学 #宇宙"
        ),
        (
            f"💡【ハッブルの驚異の手ブレ補正技術】\n"
            f"時速27,000kmで猛スピード周回しながら、1.6km先の髪の毛の太さに焦点を合わせ続ける驚異の姿勢制御技術🔭\n"
            f"現在も深宇宙を見つめ続けるハッブルの現在地を3D地球儀で追跡中🛰️\n\n"
            f"3D軌道シミュレーション👉 {WEBSITE_URL}\n#宇宙の不思議 #サイエンス"
        ),
        (
            f"🔭 Hubble Space Telescope (HST) Live Orbit Tracker!\n"
            f"Cruising at {speed_km_h:,.0f} km/h over {ctx['region_en']} at ~{alt:.0f} km altitude.\n"
            f"35+ years of peering into the deepest corners of the universe 🌌✨\n\n"
            f"Track real-time 3D orbit: {WEBSITE_URL}\n#Hubble #NASA #Astronomy"
        )
    ]
    text = random.choice(templates)
    return text, out_img

# -------------------------------------------------------------
# Mode 8: Unique Satellite Spotlight (注目衛星スポットライト)
# -------------------------------------------------------------
FEATURED_SATELLITES = [
    {
        "name": "PAZ (Spanish Radar)",
        "badge": "Spain's High-Resolution SAR Satellite",
        "fact": "Spain's flagship X-band radar satellite launched in 2018! It sees through clouds and darkness to monitor Earth with millimeter precision 🛰️🇪🇸",
        "color": "#EF4444", "lat": 40.4, "lon": -3.7, "alt": 514
    },
    {
        "name": "SAOCOM 1A (Argentina)",
        "badge": "35-sqm Giant L-Band Radar Giant",
        "fact": "Argentina's massive 3-tonne radar satellite with a 35 sqm antenna! Monitors soil moisture, floods, and Andean seismic activity 🛰️🇦🇷",
        "color": "#38BDF8", "lat": -34.6, "lon": -58.4, "alt": 620
    },
    {
        "name": "Sputnik 1 (1957)",
        "badge": "First Artificial Satellite in History",
        "fact": "Launched on Oct 4, 1957 by USSR! The first human satellite in history, opening the Space Age with its historic radio beeps 🛰️✨",
        "color": "#EF4444", "lat": 55.7, "lon": 37.6, "alt": 580
    },
    {
        "name": "Vanguard 1 (1958)",
        "badge": "Oldest Human Satellite in Orbit",
        "fact": "Launched in 1958! This 1.4 kg sphere is the oldest human-made object still orbiting Earth today—expected to orbit for 240+ more years!",
        "color": "#F59E0B", "lat": 28.5, "lon": -80.6, "alt": 650
    },
    {
        "name": "LAGEOS-1 (Laser Target)",
        "badge": "8-Million-Year Time Capsule",
        "fact": "A solid brass/aluminum sphere with 426 retroreflectors—no electronics! Carries a message plaque for humans 8 million years in the future 📩✨",
        "color": "#10B981", "lat": 0.0, "lon": 0.0, "alt": 5900
    }
]

def task_satellite_spotlight():
    sat = random.choice(FEATURED_SATELLITES)
    s_lat, s_lon = sat.get("lat", 35.0), sat.get("lon", 139.0)
    s_alt = sat.get("alt", 500.0)

    out_img = "post_card.png"
    render_3d_globe(
        center_lat=s_lat, center_lon=s_lon,
        markers=[
            {"lat": s_lat, "lon": s_lon, "alt_km": s_alt, "label": sat["name"][:16], "color": sat["color"], "size": 12}
        ],
        badge="SATELLITE SPOTLIGHT",
        badge_color=sat["color"],
        title=sat["name"],
        metrics=[
            {"label": "SATELLITE MISSION / 任務", "value": sat["badge"], "color": sat["color"]},
            {"label": "HISTORIC SIGNIFICANCE / 特徴", "value": sat["fact"][:48] + "...", "color": "#F8FAFC"},
            {"label": "ORBIT TYPE / 軌道種別", "value": f"Altitude ~{s_alt:,.0f} km", "color": "#4ADE80"},
            {"label": "INTERACTIVE 3D SIMULATION", "value": "Real-Time Tracking & Telemetry", "color": "#38BDF8"},
            {"label": "CATALOG STATUS", "value": "Active Open Science Monitoring", "color": "#FACC15"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"🛰️【人工衛星スポットライト：{sat['name']}】\n"
            f"✨ {sat['badge']}\n\n"
            f"💡 {sat['fact']}\n\n"
            f"リアルタイム3D地球軌道シミュレーションはこちら👇\n{WEBSITE_URL}\n#宇宙開発 #人工衛星 #科学"
        ),
        (
            f"🌌【宇宙の歴史を刻む名機：{sat['name']}】\n"
            f"{sat['fact']}\n\n"
            f"宇宙空間での現在地と軌道を3D地球儀で体感👉 {WEBSITE_URL}\n#宇宙 #テクノロジー"
        )
    ]
    text = random.choice(templates)
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
    # 小惑星フライバイの3D地球儀カード
    render_3d_globe(
        center_lat=10.0, center_lon=30.0,
        markers=[
            {"lat": 10.0, "lon": 30.0, "alt_km": 15000.0, "label": f"{ast['name']} (Flyby)", "color": ast["color"], "size": 14}
        ],
        trails=[
            {"points": [(-20.0 + i*2.5, -30.0 + i*4.0) for i in range(25)], "color": ast["color"], "width": 3, "alt_km": 15000.0}
        ],
        badge="NEAR-EARTH ASTEROID RADAR • 接近警報",
        badge_color=ast["color"],
        title=f"Asteroid {ast['name']}",
        metrics=[
            {"label": "ASTEROID CLASS / 分類", "value": ast["type"], "color": ast["color"]},
            {"label": "ESTIMATED SIZE / 推定直径", "value": f"{ast['diameter']} (東京タワー級〜巨大天体)", "color": "#F8FAFC"},
            {"label": "CLOSEST APPROACH / 最接近予報", "value": f"{ast['flyby']} ({ast['dist']})", "color": "#F97316"},
            {"label": "FLYBY VELOCITY / 相対速度", "value": f"{ast['speed']} (秒速30kmの超高速)", "color": "#4ADE80"},
            {"label": "PLANETARY DEFENSE", "value": "NASA / JPL / ESA Monitored", "color": "#FACC15"}
        ],
        site_url="satviewer3d.com",
        out_path=out_img
    )

    templates = [
        (
            f"☄️【地球接近小惑星レーダー：{ast['name']}】\n"
            f"🏷️ 分類: {ast['type']}\n"
            f"📏 直径: {ast['diameter']} | ⚡ 速度: {ast['speed']}\n"
            f"🎯 最接近予報: {ast['flyby']}\n"
            f"📍 距離: {ast['dist']}\n\n"
            f"💡 {ast['fact']}\n\n"
            f"3D太陽系・接近軌道シミュレーターはこちら👇\n{WEBSITE_URL}\n#小惑星 #宇宙 #天文 #NASA #JAXA"
        ),
        (
            f"🌍【地球防衛の最前線：小惑星 {ast['name']}】\n"
            f"最接近時には {ast['dist']} の超至近距離を通過予測！\n"
            f"{ast['fact']}\n\n"
            f"リアルタイム3D軌道シミュレーションで接近の様子を体感👉 {WEBSITE_URL}\n#天体衝突 #サイエンス"
        )
    ]
    text = random.choice(templates)
    return text, out_img

# -------------------------------------------------------------
# メイン実行ルーチン
# -------------------------------------------------------------
MODES = [
    "ISS_LIVE", "TIANGONG_LIVE", "ASTEROID_ALERT", 
    "SPAIN_LATAM_LIVE", "STARLINK_FLEET", "STARLINK_TRAIN", 
    "SATELLITE_SPOTLIGHT", "HUBBLE_LIVE", "SPACE_DEBRIS"
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

    print("=" * 60)
    print(f"🛰️ SatViewer3D Master Bot - Running Mode: [{mode}]")
    print("=" * 60)

    # 互換性: 単体で AUTO_FOLLOWER が指定された場合
    if mode == "AUTO_FOLLOWER":
        print("🤖 [AUTO_FOLLOWER] 宇宙・天体観測ツイートユーザーの自動フォロー＆アンフォローを実行します...")
        try:
            import auto_follower
            auto_follower.main()
            print("🎉 [AUTO_FOLLOWER] Completed successfully!")
            return
        except Exception as e:
            print(f"❌ [AUTO_FOLLOWER] Error: {e}")
            sys.exit(1)

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

    # 2. 投稿完了後、ついでにフォロワー育成巡回（auto_follower）も必ず毎回実行（QuakeViewer3Dと同等の高成長方式）
    try:
        import auto_follower
        print("\n🤖 [AUTO_FOLLOWER] 宇宙・天体観測関心ユーザーの巡回を実行します...")
        auto_follower.main()
        print("🎉 [AUTO_FOLLOWER] Completed successfully!")
    except Exception as e:
        print(f"[WARN] AUTO_FOLLOWER skipped: {e}")

if __name__ == "__main__":
    target_mode = sys.argv[1] if len(sys.argv) > 1 else None
    run_master_bot(target_mode)
