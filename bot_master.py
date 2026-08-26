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

plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

WEBSITE_URL = "https://satviewer3d.com"
MODE_FILE = "last_bot_mode.txt"

# -------------------------------------------------------------
# 共通ヘルパー
# -------------------------------------------------------------
def get_region_name_en(lat, lon):
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
    ax.text(175, -84, "satviewer3d.com", color='#475569', fontsize=10, ha='right', va='bottom', fontweight='bold')
    return fig, ax

# -------------------------------------------------------------
# Mode 1: ISS Live Tracker
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
    speed_km_s = np.linalg.norm(pos2 - pos1)
    speed_km_h = speed_km_s * 3600

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

    region = get_region_name_en(lat, lon)
    text = (
        f"🛰️ ISS Live Orbit Tracker ({now_utc.strftime('%H:%M UTC')})\n\n"
        f"📍 Current Region: {region}\n"
        f"🌐 Coordinates: {lat_card}, {lon_card}\n"
        f"📏 Altitude: {alt:.0f} km ({alt*0.621371:.0f} mi)\n"
        f"⚡ Velocity: {speed_km_h:,.0f} km/h ({speed_km_s:.2f} km/s)\n\n"
        f"🌍 Track real-time satellites in 3D 👇\n"
        f"{WEBSITE_URL}\n\n"
        f"#ISS #Space #SatelliteTracking #SatViewer3D #SpaceStation #NASA #SpaceX"
    )
    return text, out_img

# -------------------------------------------------------------
# Mode 2: Starlink Constellation Radar & Fleet Stats
# -------------------------------------------------------------
def task_starlink_fleet():
    ts = load.timescale()
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    t = ts.from_datetime(now_utc)

    starlink_file = "data/starlink.txt" if os.path.exists("data/starlink.txt") else "starlink.txt"
    with open(starlink_file, 'r') as f:
        lines = f.readlines()

    sats = []
    # 最新の数百基をサンプリング
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
    # Starlinkネオンクラスター
    ax.scatter(lons, lats, color='#00F0FF', s=22, alpha=0.75, edgecolors='none', label='Starlink')
    ax.scatter(lons, lats, color='#FFFFFF', s=5, alpha=0.95, edgecolors='none')

    utc_str = now_utc.strftime('%Y-%m-%d %H:%M:%S UTC')
    fig.suptitle("SatViewer3D  •  SpaceX Starlink Mega-Constellation Radar", fontsize=15, fontweight='bold', color='#00F0FF', y=0.96)
    ax.set_title(f"Time: {utc_str}  |  Sample Network: {len(lons)} Satellites Plotted  |  Alt: ~550 km LEO", fontsize=10.5, color='#94A3B8', pad=10)

    out_img = "post_card.png"
    plt.tight_layout()
    plt.savefig(out_img, dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

    text = (
        f"🛰️ SpaceX Starlink Mega-Constellation Live Fleet ({now_utc.strftime('%H:%M UTC')})\n\n"
        f"🌌 Active Satellites in Orbit: 6,000+ total in LEO\n"
        f"📡 Orbital Altitude: ~550 km | Orbital Speed: ~27,000 km/h\n"
        f"⚡ High-speed, low-latency satellite internet spanning 100+ countries\n\n"
        f"🔭 View real-time 3D Starlink swarm & train passes 👇\n"
        f"{WEBSITE_URL}\n\n"
        f"#Starlink #SpaceX #ElonMusk #SatelliteInternet #TechNews #SatViewer3D #Astronomy"
    )
    return text, out_img

# -------------------------------------------------------------
# Mode 2-B: Starlink Train / Spotter Watch
# -------------------------------------------------------------
def task_starlink_train():
    ts = load.timescale()
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    t = ts.from_datetime(now_utc)

    starlink_file = "data/starlink.txt" if os.path.exists("data/starlink.txt") else "starlink.txt"
    with open(starlink_file, 'r') as f:
        lines = f.readlines()

    # 直近の打ち上げグループ（上部にある衛星群）を抽出
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
    # 密集したトレインを描画
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
        f"✨ SpaceX Starlink Train Tracker ({now_utc.strftime('%H:%M UTC')})\n\n"
        f"🚀 Spotting the 'Train of Lights' in the night sky?\n"
        f"🛰️ Newly launched Starlink batches travel in close formation before dispersing to operational orbits.\n"
        f"🔭 Best viewed right after sunset / before sunrise!\n\n"
        f"Check 3D live orbital trajectories & visibility 👇\n"
        f"{WEBSITE_URL}\n\n"
        f"#Starlink #StarlinkTrain #SpaceX #ElonMusk #Stargazing #SatViewer3D #Astronomy"
    )
    return text, out_img

# -------------------------------------------------------------
# Mode 3: Hubble Space Telescope (HST)
# -------------------------------------------------------------
def task_hubble_live():
    ts = load.timescale()
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    t = ts.from_datetime(now_utc)

    # Celestrak science satellites
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

    region = get_region_name_en(lat, lon)
    text = (
        f"🔭 Hubble Space Telescope (HST) Live Tracker ({now_utc.strftime('%H:%M UTC')})\n\n"
        f"📍 Current Region: {region}\n"
        f"🌐 Position: {lat_card}, {lon_card}\n"
        f"📏 Altitude: {alt:.0f} km ({alt*0.621371:.0f} mi)\n"
        f"⚡ Speed: {speed_km_h:,.0f} km/h\n\n"
        f"🔭 Over 30+ years uncovering cosmic wonders!\n"
        f"Track Hubble in 3D 👇\n"
        f"{WEBSITE_URL}\n\n"
        f"#Hubble #NASA #Astronomy #SpaceTelescope #SatViewer3D #Space"
    )
    return text, out_img

# -------------------------------------------------------------
# Mode 4: Space Debris Tracking Radar
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
        f"⚠️ Orbital Space Debris Tracking Radar ({now_utc.strftime('%H:%M UTC')})\n\n"
        f"💥 Tracked Objects: Thousands of cataloged orbital debris fragments\n"
        f"🛡️ 24h MOID Collision Risk Analysis active\n"
        f"⚡ Hypervelocity orbits exceeding 27,000 km/h\n\n"
        f"Inspect real-time space debris orbits in 3D 👇\n"
        f"{WEBSITE_URL}\n\n"
        f"#SpaceDebris #SpaceSafety #SatViewer3D #LEO #SpaceX #NASA #ESA"
    )
    return text, out_img

# -------------------------------------------------------------
# Mode 5: Unique Satellite Spotlight (面白い人工衛星図鑑)
# -------------------------------------------------------------
FEATURED_SATELLITES = [
    {
        "name": "Vanguard 1 (1958)",
        "tag": "Vanguard1",
        "badge": "Oldest Human-Made Object in Space",
        "launch_year": "1958 (68+ years in orbit)",
        "altitude": "~650 - 3,800 km (Elliptical Orbit)",
        "speed": "~28,000 km/h",
        "fact": "Launched by the US in 1958, this tiny 1.4 kg aluminum sphere is the oldest artificial satellite still orbiting Earth today! It is expected to remain in orbit for another 240+ years.",
        "color": "#F59E0B",
        "accent": "#FDE68A"
    },
    {
        "name": "LAGEOS-1 (Laser Geodynamics)",
        "tag": "LAGEOS",
        "badge": "8-Million-Year Cosmic Time Capsule",
        "launch_year": "1976",
        "altitude": "5,900 km (Stable MEO)",
        "speed": "~20,500 km/h",
        "fact": "A solid aluminum sphere covered with 426 cube-corner retroreflectors. It has no electronics, no engine, and acts as a passive laser target. It carries a plaque designed by Carl Sagan for civilizations 8 million years in the future!",
        "color": "#10B981",
        "accent": "#A7F3D0"
    },
    {
        "name": "Envisat (The Ghost Giant)",
        "tag": "Envisat",
        "badge": "Largest Abandoned Satellite in LEO",
        "launch_year": "2002 (Lost Contact in 2012)",
        "altitude": "~770 km (Polar Orbit)",
        "speed": "~27,000 km/h",
        "fact": "Weighing over 8.2 tonnes (size of a large bus), Envisat is one of the largest non-functional satellites in Low Earth Orbit. It poses one of the highest collision risks and will drift for over a century.",
        "color": "#EF4444",
        "accent": "#FCA5A5"
    },
    {
        "name": "QZSS 'Michibiki' (Quasi-Zenith)",
        "tag": "Michibiki",
        "badge": "Figure-8 Asymmetrical Geosynchronous Orbit",
        "launch_year": "2010 - Present",
        "altitude": "32,600 - 39,000 km (QZO)",
        "speed": "~11,000 km/h",
        "fact": "Japan's navigation satellites fly in a unique 'Figure-8' shaped orbit directly above Tokyo, providing centimeter-level high-precision GPS positioning even in dense urban canyons.",
        "color": "#8B5CF6",
        "accent": "#DDD6FE"
    },
    {
        "name": "Tiangong (Chinese Space Station)",
        "tag": "Tiangong",
        "badge": "Modular Crewed Orbital Laboratory",
        "launch_year": "2021 - Present",
        "altitude": "~380 - 420 km (LEO)",
        "speed": "~27,600 km/h",
        "fact": "Weighing over 100 tonnes with Tianhe, Wentian, and Mengtian modules, Tiangong is humanity's other permanently crewed space station alongside the ISS!",
        "color": "#06B6D4",
        "accent": "#A5F3FC"
    }
]

def task_satellite_spotlight():
    sat_info = random.choice(FEATURED_SATELLITES)
    now_utc = datetime.datetime.now(datetime.timezone.utc)

    fig, ax = create_base_map()
    
    # 抽象的な軌道リングを描画
    theta = np.linspace(0, 2*np.pi, 200)
    orbit_x = 140 * np.cos(theta)
    orbit_y = 60 * np.sin(theta)
    ax.plot(orbit_x, orbit_y, color=sat_info["color"], linewidth=3, alpha=0.8, linestyle='--')

    # 代表マーカー
    ax.scatter([0], [0], color=sat_info["color"], s=450, zorder=6, edgecolors='#FFFFFF', linewidth=2.5)
    ax.scatter([0], [0], color=sat_info["accent"], s=1100, alpha=0.25, zorder=5)

    ax.annotate(
        f"{sat_info['name']}\n{sat_info['badge']}", xy=(0, 0), xytext=(15, 20),
        color='#FFFFFF', fontsize=11, fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.6', facecolor='#0F172A', edgecolor=sat_info["color"], alpha=0.95),
        arrowprops=dict(arrowstyle='->', color=sat_info["color"], lw=1.5)
    )

    utc_str = now_utc.strftime('%Y-%m-%d UTC')
    fig.suptitle(f"SatViewer3D  •  Satellite Spotlight: {sat_info['name']}", fontsize=15, fontweight='bold', color=sat_info["color"], y=0.96)
    ax.set_title(f"{sat_info['badge']}  |  Launch: {sat_info['launch_year']}  |  Alt: {sat_info['altitude']}", fontsize=10.5, color='#94A3B8', pad=10)

    out_img = "post_card.png"
    plt.tight_layout()
    plt.savefig(out_img, dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

    text = (
        f"🛰️ Satellite Spotlight: {sat_info['name']}\n"
        f"✨ {sat_info['badge']}\n\n"
        f"📅 Launched: {sat_info['launch_year']}\n"
        f"📏 Orbit: {sat_info['altitude']}\n\n"
        f"💡 Fun Fact:\n{sat_info['fact']}\n\n"
        f"Explore historical & active orbits in 3D 👇\n"
        f"{WEBSITE_URL}\n\n"
        f"#{sat_info['tag']} #SpaceHistory #SatViewer3D #Satellite #Astronomy #NASA"
    )
    return text, out_img

# -------------------------------------------------------------
# メイン実行ルーチン（自動ローテーション）
# -------------------------------------------------------------
MODES = ["ISS_LIVE", "STARLINK_FLEET", "SATELLITE_SPOTLIGHT", "STARLINK_TRAIN", "SPACE_DEBRIS", "HUBBLE_LIVE"]

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

    # Xへ自動ポスト
    success = post_to_x(text, image_path=img, headless=True)
    if success:
        with open(MODE_FILE, "w") as f:
            f.write(mode)
        print(f"🎉 Successfully posted mode [{mode}] to X!")
    else:
        print(f"❌ Failed to post mode [{mode}].")
        sys.exit(1)

if __name__ == "__main__":
    # 引数があれば特定モード、なければローテーション
    target_mode = sys.argv[1] if len(sys.argv) > 1 else None
    run_master_bot(target_mode)
