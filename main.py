from skyfield.api import EarthSatellite, utc, wgs84, Loader
from mpl_toolkits.mplot3d import Axes3D
from PIL import Image
from matplotlib.animation import FuncAnimation
from matplotlib.widgets import Button
from scipy.interpolate import interp1d
from datetime import datetime, timedelta
from mpl_toolkits.mplot3d import proj3d
from collections import defaultdict

import matplotlib.pyplot as plt
import numpy as np
import requests
import os

def update_tle_file():
    url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle"
    headers = {"User-Agent": "Mozilla/5.0"}

    os.makedirs("data", exist_ok=True)
    try:
        r = requests.get(url, headers=headers)
        if r.status_code == 200:
            print("Exists:", os.path.exists("data/starlink.txt"))
            with open("data/starlink.txt", "w") as f:
                f.write(r.text)
            print("TLE updated!")
        else:
            print("Failed to update TLE:", r.status_code)
    except Exception as e:
        print("Update error:", e)

def load_tle_from_url(url, ts):
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/plain",
        "Referer": "https://celestrak.org/",
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    lines = response.text.splitlines()

    sats = []
    for i in range(0, len(lines), 3):
        name = lines[i]
        line1 = lines[i+1]
        line2 = lines[i+2]
        sats.append(EarthSatellite(line1, line2, name, ts))

    return sats


if not os.path.exists("data/starlink.txt"):
    update_tle_file()

fig = plt.figure(figsize=(12,7))
ax = fig.add_subplot(111, projection="3d")

#mng = plt.get_current_fig_manager()
#mng.window.state('zoomed')



print("program started")

# 地球テクスチャ
day_img = Image.open("earth_texture.jpg")
night_img = Image.open("earth_night.jpg")
mesh_w = 72
mesh_h = 36

day_img = day_img.resize((mesh_w, mesh_h))
night_img = night_img.resize((mesh_w, mesh_h))

texture_day = np.array(day_img) / 255
texture_night = np.array(night_img) / 255

texture_day = np.roll(texture_day, 36, axis=1)
texture_night = np.roll(texture_night, 36, axis=1)

# -------- 地球設定 --------

tilt = np.radians(23.4)
earth_radius = 6371

axis = np.array([
    0,
    np.cos(tilt),
    np.sin(tilt)
])

# Axis length 地軸
axis_length = earth_radius * 1.5

axis_line, = ax.plot(
        [0, axis[0]*axis_length],
        [0, axis[1]*axis_length],
        [0, axis[2]*axis_length],
        color="brown",
        linewidth=2
    )

# 赤道
theta = np.linspace(0, 2*np.pi, 200)
radius_eq = earth_radius * 1.03

# 赤道平面ベクトル
if abs(axis[0]) < 0.9:
    ref = np.array([1,0,0])
else:
    ref = np.array([0,1,0])

v1 = np.cross(axis, ref)
v1 = v1 / np.linalg.norm(v1)
v2 = np.cross(axis, v1)

# 赤道円
x_eq = radius_eq * (v1[0]*np.cos(theta) + v2[0]*np.sin(theta))
y_eq = radius_eq * (v1[1]*np.cos(theta) + v2[1]*np.sin(theta))
z_eq = radius_eq * (v1[2]*np.cos(theta) + v2[2]*np.sin(theta))

equator_front, = ax.plot([], [], [], color="red", linewidth=2, zorder=40)
equator_back,  = ax.plot([], [], [], color="gray", alpha=0.2, zorder=39)




# -------- 太陽光線 --------

sun_direction = np.array([1,0,0])
sun_direction = sun_direction / np.linalg.norm(sun_direction)



u = np.linspace(0, 2*np.pi, mesh_w, endpoint=False)
v = np.linspace(0, np.pi, mesh_h)
u, v = np.meshgrid(u, v)

earth_x = earth_radius * np.cos(u) * np.sin(v)
earth_y = earth_radius * np.sin(u) * np.sin(v)
earth_z = earth_radius * np.cos(v)

def tilt_rotate(x,y,z):
    y2 = y*np.cos(tilt) - z*np.sin(tilt)
    z2 = y*np.sin(tilt) + z*np.cos(tilt)
    return x,y2,z2

earth_x, earth_y, earth_z = tilt_rotate(earth_x, earth_y, earth_z)

 #雲テクスチャ
cloud_img = Image.open("earth_clouds.png").convert("RGBA")
cloud_img = cloud_img.resize((mesh_w, mesh_h))

texture_cloud = np.array(cloud_img) / 255
# 雲を薄くする
texture_cloud[:,:,3] *= 0.35

cloud_radius = earth_radius * 1.01

cloud_x = cloud_radius * np.cos(u) * np.sin(v)
cloud_y = cloud_radius * np.sin(u) * np.sin(v)
cloud_z = cloud_radius * np.cos(v)

cloud_x, cloud_y, cloud_z = tilt_rotate(cloud_x, cloud_y, cloud_z)

#雲初期描画
clouds = ax.plot_surface(
    cloud_x,
    cloud_y,
    cloud_z,
    facecolors=texture_cloud[:-1,:-1],
    rstride=2,
    cstride=2,
    linewidth=0,
    antialiased=False,
    shade=False
)
clouds.set_edgecolor("none")

# -------- 大気グロー --------

atmo_radius = earth_radius * 1.08

atmo_x = atmo_radius * np.cos(u) * np.sin(v)
atmo_y = atmo_radius * np.sin(u) * np.sin(v)
atmo_z = atmo_radius * np.cos(v)

atmo_x, atmo_y, atmo_z = tilt_rotate(atmo_x, atmo_y, atmo_z)

# -------- Earth Shadow Cone (Umbra) --------

shadow_length = 200000
shadow_radius = earth_radius * 1.2

theta = np.linspace(0, 2*np.pi, 40)
r = np.linspace(0, shadow_radius, 20)

theta, r = np.meshgrid(theta, r)

shadow_x = -r * 0.1
shadow_y = r * np.cos(theta)
shadow_z = r * np.sin(theta)

shadow_x = shadow_x - np.linspace(0, shadow_length, shadow_x.shape[0])[:,None]

ax.plot_surface(
    shadow_x,
    shadow_y,
    shadow_z,
    color="black",
    alpha=0.25,
    linewidth=0
)

# -------- 月設定 --------
moon_radius = 1700
moon_distance = 30000

# 初期描画
moon_u = np.linspace(0, 2*np.pi, 40)
moon_v = np.linspace(0, np.pi, 20)
moon_x = moon_radius * np.outer(np.cos(moon_u), np.sin(moon_v))
moon_y = moon_radius * np.outer(np.sin(moon_u), np.sin(moon_v))
moon_z = moon_radius * np.outer(np.ones(np.size(moon_u)), np.cos(moon_v))

#月のテクスチャ
moon_img = Image.open("moon_texture.jpg")
moon_img = moon_img.resize((len(moon_v), len(moon_u)))
moon_texture = np.array(moon_img) / 255
moon_texture = np.flipud(moon_texture)

moon = ax.plot_surface(
    moon_x + moon_distance,
    moon_y,
    moon_z,
    facecolors=moon_texture[:-1, :-1],
    rstride=2,
    cstride=2,
    shade=False
)



#カメラモード
 #normal:通常
 #follow:ISSを追跡
 #free:自由

camera_mode = "overview"
sim_speed = 10

def earth_view(event):
    global camera_mode
    camera_mode = "overview"

def iss_view(event):
    global camera_mode
    camera_mode = "iss"

def speed_1(event):
    global sim_speed
    sim_speed = 1

def speed_10(event):
    global sim_speed
    sim_speed = 10

def speed_100(event):
    global sim_speed
    sim_speed = 100


#ボタン描画
ax_button1 = plt.axes([0.3,0.05,0.15,0.05])
ax_button2 = plt.axes([0.55,0.05,0.15,0.05])
ax_button3 = plt.axes([0.75,0.05,0.07,0.05])
ax_button4 = plt.axes([0.83,0.05,0.07,0.05])
ax_button5 = plt.axes([0.91,0.05,0.07,0.05])

btn3 = Button(ax_button3,"1x")
btn4 = Button(ax_button4,"10x")
btn5 = Button(ax_button5,"100x")

btn3.on_clicked(speed_1)
btn4.on_clicked(speed_10)
btn5.on_clicked(speed_100)

btn1 = Button(ax_button1,"Overview")
btn2 = Button(ax_button2,"Track ISS")

btn1.on_clicked(earth_view)
btn2.on_clicked(iss_view)

#-----太陽設定-----

sun_distance = 120000
sun_radius = 8000

u_s = np.linspace(0, 2*np.pi, 30)
v_s = np.linspace(0, np.pi, 15)
u_s, v_s = np.meshgrid(u_s, v_s)

sun_x = sun_distance + sun_radius * np.cos(u_s) * np.sin(v_s)
sun_y = sun_radius * np.sin(u_s) * np.sin(v_s)
sun_z = sun_radius * np.cos(v_s)


ax.plot_surface(
    sun_x,
    sun_y,
    sun_z,
    color="yellow",
    linewidth=0,
    alpha=0.9
)
#太陽周辺の光の点
ax.scatter(
    sun_distance,
    0,
    0,
    color="orange",
    s=2000
)
# -------- ISS TLE --------

load = Loader('./data')
ts = load.timescale()
t = ts.now()
start_time = t.utc_datetime()
def load_tle(url):
    satellites = load.tle_file(url, reload=True)
    return {sat.name: sat for sat in satellites}

update_tle_file()
stations = load_tle("https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle")
iss = stations["ISS (ZARYA)"]

#Chinese Beidou(北斗) TLE
beidou = EarthSatellite(
"1 40749U 15037A   24160.12345678  .00000000  00000-0  00000-0 0  9993",
"2 40749  55.0000 123.0000 0001000 180.0000  90.0000  1.00270000    01",
"BEIDOU",
ts
)
geocentric = beidou.at(t)
subpoint = wgs84.subpoint(geocentric)

#TiangGong(天宫) TLE
tiangong = EarthSatellite(
"1 42063U 17027A   24160.12345678  .00000000  00000-0  00000-0 0  9993",
"2 42063  51.6416 247.4627 0006703 130.5360 325.0288 15.50256479  1234",
"TIANGONG",
ts
)
geocentric_tg = tiangong.at(t)
x_tg, y_tg, z_tg = geocentric_tg.position.km

#GPS TLE
gps_sats = [
EarthSatellite(
"1 24876U 97035A   24160.12345678  .00000000  00000-0  00000-0 0  9991",
"2 24876  55.0000 100.0000 0001000 0.0000 0.0000 2.00560000    01",
"GPS1",
ts),

EarthSatellite(
"1 25933U 99055A   24160.12345678  .00000000  00000-0  00000-0 0  9992",
"2 25933  55.0000 160.0000 0001000 0.0000 0.0000 2.00560000    02",
"GPS2",
ts),

EarthSatellite(
"1 27663U 03005A   24160.12345678  .00000000  00000-0  00000-0 0  9993",
"2 27663  55.0000 220.0000 0001000 0.0000 0.0000 2.00560000    03",
"GPS3",
ts),

EarthSatellite(
"1 28474U 04045A   24160.12345678  .00000000  00000-0  00000-0 0  9994",
"2 28474  55.0000 280.0000 0001000 0.0000 0.0000 2.00560000    04",
"GPS4",
ts),

EarthSatellite(
"1 29486U 06042A   24160.12345678  .00000000  00000-0  00000-0 0  9995",
"2 29486  55.0000 340.0000 0001000 0.0000 0.0000 2.00560000    05",
"GPS5",
ts),

EarthSatellite(
"1 36585U 10022A   24160.12345678  .00000000  00000-0  00000-0 0  9996",
"2 36585  55.0000 40.0000 0001000 0.0000 0.0000 2.00560000    06",
"GPS6",
ts)
]

#Himawari-9 TLE
# Himawari-9
line1 = "1 41836U 16064A   26071.24307837 -.00000274 00000-0 00000-0 0 9993"
line2 = "2 41836 0.0181 195.9127 0001481 198.3287 3.9124 1.00270475 34237"

himawari9 = EarthSatellite(line1, line2, "Himawari-9", ts)

#Starlink TLE
starlinks = load.tle_file("https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle")
print("Loaded", len(starlinks), "Starlink satellites")
starlinks = starlinks[:100]

#Iridium-33 debris TLE
debris = load_tle_from_url("https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium-33-debris&FORMAT=tle",ts)

# 軌道計算（1分刻み）

geocentric = iss.at(t)
sat_x_frame, sat_y_frame, sat_z_frame = geocentric.position.km

sat_scale = 1.07

sat_x = sat_x_frame * sat_scale
sat_y = sat_y_frame * sat_scale
sat_z = sat_z_frame * sat_scale



# 初期光計算
normals = np.stack((earth_x, earth_y, earth_z), axis=-1)
normals = normals / np.linalg.norm(normals, axis=2)[...,None]

sun_dot = (
    normals[:,:,0]*sun_direction[0] +
    normals[:,:,1]*sun_direction[1] +
    normals[:,:,2]*sun_direction[2]
)

light = np.clip(sun_dot,0,1)

texture_lit = (
    texture_day * light[:,:,None] +
    texture_night * (1 - light)[:,:,None] * 0.6
)
earth = ax.plot_surface(
    earth_x,
    earth_y,
    earth_z,
    facecolors=texture_lit[:-1,:-1],
    rstride=5,
    cstride=5,
    linewidth=0,
    antialiased=False,
    shade=False
)

atmosphere = ax.plot_surface(
    atmo_x,
    atmo_y,
    atmo_z,
    color="deepskyblue",
    alpha=0.15,
    linewidth=0
)

# ISS軌道
# ax.plot(x,y,z,color="red",linewidth=2)

# 本体（小さい球）
iss_body = ax.scatter(0, 0, 0, color="white", s=120, zorder=100,picker=True,pickradius=10)

# ソーラーパネル（左右の線）
iss_panel_left, = ax.plot([], [], [], color="orange", linewidth=5)
iss_panel_right, = ax.plot([], [], [], color="orange", linewidth=5)

trail_line, = ax.plot([], [], [], color="cyan", linewidth=0.5, alpha=0.3, zorder=10)

trail_x = []
trail_y = []
trail_z = []
trail_length = 200

#Ground Track line 地上軌跡
ground_track_line, = ax.plot([], [], [], color="yellow", linewidth=2, zorder=25)
ground_x = []
ground_y = []
ground_z = []

# ISSラベル
iss_label = ax.text(
    sat_x,
    sat_y,
    sat_z + 300,
    "ISS",
    color="white",
    fontsize=9,
    zorder=20
)


# プロット範囲設定
limit = 500000

ax.set_xlim(-limit,limit)
ax.set_ylim(-limit,limit)
ax.set_zlim(-limit,limit)

ax.grid(False)
ax.set_axis_off()
ax.set_box_aspect([1,1,1])

if camera_mode == "overview":
    ax.set_xlim(-12000,12000)
    ax.set_ylim(-12000,12000)
    ax.set_zlim(-12000,12000)

    ax.view_init(elev=20, azim=30)


# 北斗衛星位置(Chinese Beidou)初期描画
geocentric_b = beidou.at(t)
x_b, y_b, z_b = geocentric_b.position.km

beidou_point = ax.scatter(
    x_b, y_b, z_b,
    color="red",
    s=40,
    marker="o",
    zorder=12
)

beidou_trail_x = []
beidou_trail_y = []
beidou_trail_z = []
beidou_trail_line, = ax.plot([],[],[], color="red", linewidth=1)
#beidou label

beidou_label = ax.text(
    x_b, y_b, z_b + 1500,
    "Beidou",
    color="red",
    fontsize=9,
    zorder=20
)

# 天宫位置(天宫)初期描画
tiangong_point = ax.scatter(
    x_tg, y_tg, z_tg,
    color="lime",
    s=50,
    marker="s",
    zorder=11
)

tiangong_trail_x = []
tiangong_trail_y = []
tiangong_trail_z = []
tiangong_trail_line, = ax.plot([],[],[], color="blue", linewidth=1)
#tiangong label
tiangong_label = ax.text(
    x_tg, y_tg, z_tg + 300,
    "Tiangong",
    color="lime",
    fontsize=9,
    zorder=20   
)

#GPS 初期描画
gps_points = []
gps_trails = []
gps_trail_x = []
gps_trail_y = []
gps_trail_z = []
gps_labels = []

for sat in gps_sats:

    geocentric = sat.at(t)
    xg, yg, zg = geocentric.position.km

    point = ax.scatter(
        xg, yg, zg,
        color="orange",
        s=20,
        marker="o",
        zorder=10,
        picker=True,
        pickradius=5
    )

    label = ax.text(
        xg, yg, zg,
        sat.name,
        color="orange",
        fontsize=8
    )

    trail_line, = ax.plot([],[],[], color="orange", linewidth=1)

    gps_points.append(point)
    gps_trails.append(trail_line)
    gps_labels.append(label)

    gps_trail_x.append([])
    gps_trail_y.append([])
    gps_trail_z.append([])

#Himawari-9初期描画
geocentric_him = himawari9.at(t)
xh, yh, zh = geocentric_him.position.km

himawari9_point = ax.scatter(
    xh, yh, zh,
    color="cyan",
    s=30,
    marker="o",
    zorder=13,
    picker=True,
    pickradius=5
)

himawari9_trail_x = []
himawari9_trail_y = []
himawari9_trail_z = []
himawari9_trail_line, = ax.plot([],[],[], color="cyan", linewidth=1)
#himawari9 label
himawari9_label = ax.text(
    xh, yh, zh + 1500,
    "Himawari-9",
    color="cyan",
    fontsize=9,
    rotation=0
)

#Starlink初期描画
starlink_planes = defaultdict(list)
starlink_plane_ids = []

for sat in starlinks:
    raan = sat.model.nodeo  # RAAN
    plane_id = int(raan // 5)  # 5度ごとにグループ化
    starlink_planes[plane_id].append(sat)
    starlink_plane_ids.append(plane_id)

plane_colors = [
"cyan",
"blue",
"purple",
"green",
"orange",
"red",
"magenta",
"yellow"
]

 #scatterを軌道面ごとに作成
starlink_plane_points = {}

for i, plane in enumerate(starlink_planes):

    color = plane_colors[i % len(plane_colors)]

    starlink_plane_points[plane] = ax.scatter(
        [], [], [], color=color, s=6
    )
#starlink label
starlink_labels = []

for i in range(len(starlinks)):
    label = ax.text(0, 0, 0, "", color="white", fontsize=6)
    starlink_labels.append(label)



# -------- Cities --------

cities = {
    "Tokyo": (35.6762, 139.6503),
    "New York": (40.7128, -74.0060),
    "London": (51.5074, -0.1278),
    "Sydney": (-33.8688, 151.2093)
}

city_points = []
city_labels = []

for name, (lat, lon) in cities.items():

    lat = np.radians(lat)
    lon = np.radians(lon)

    x = earth_radius * np.cos(lat) * np.cos(lon)
    y = earth_radius * np.cos(lat) * np.sin(lon)
    z = earth_radius * np.sin(lat)

    point = ax.scatter(
        x, y, z,
        color="white",
        s=20,
        marker="o",
        zorder=30
    )

    label = ax.text(
        x, y, z + 300,
        name,
        color="white",
        fontsize=8,
        zorder=30
    )

    city_points.append(point)
    city_labels.append(label)

# Tokyo test marker
tokyo_marker = ax.scatter(
    0,0,0,
    color="red",
    s=80,
    marker="o",
    zorder=50
)

# -------- ズーム --------
zoom_scale = 1.2

def on_scroll(event):
    global zoom_scale

    if event.button == 'up':
        scale = 0.8   # ズームイン
    elif event.button == 'down':
        scale = 1.2   # ズームアウト
    else:
        scale = 1

    xlim = ax.get_xlim3d()
    ylim = ax.get_ylim3d()
    zlim = ax.get_zlim3d()

    ax.set_xlim3d([xlim[0]*scale, xlim[1]*scale])
    ax.set_ylim3d([ylim[0]*scale, ylim[1]*scale])
    ax.set_zlim3d([zlim[0]*scale, zlim[1]*scale])

    plt.draw()

# -------- ピック　人工衛星へのクリックイベント作成--------
def on_pick(event):
    artist = event.artist   # ← これが超重要

    if artist == iss_body:
        info_label.set_text(
            f"🛰 ISS\nAlt: {current_altitude:.0f} km\nSpeed: 7.66 km/s"
        )
        iss_body.set_color("red")
        iss_body.set_sizes([80])
    else:
        iss_body.set_color("gray")
        iss_body.set_sizes([30])

    for i, p in enumerate(gps_points):
        if artist == p:
            info_label.set_text(f"GPS-{i+1}")
            p.set_color("red")
            p.set_sizes([100])


current_altitude = 0  # グローバル

#人工衛星地上観測地点
observer = wgs84.latlon(35.6762, 139.6503)  # 東京
difference_iss = iss - observer  # 高速化のため事前計算

def is_visible_fast(difference, t): #可視判定関数
    topocentric = difference.at(t)
    alt, az, distance = topocentric.altaz()
    return alt.degrees > 0

# -------- アニメーション --------

def update(frame):
    dt = start_time + timedelta(minutes=frame * sim_speed)
    t = ts.utc(dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second)
    # ISS位置更新
    geocentric = iss.at(t)
    sat_x_frame, sat_y_frame, sat_z_frame = geocentric.position.km
      #ISS可視判定
    visible = is_visible_fast(difference_iss, t)

    sim_time = t.utc_datetime()

    time_label.set_text(
        sim_time.strftime("Simulation Time: %Y-%m-%d %H:%M UTC")
    )

    speed_label.set_text(f"Speed: {sim_speed}x")

    ax.set_box_aspect([1,1,1])

    global earth, moon, iss_body, trail_line, atmosphere, clouds, beidou_point, beidou_trail_line, tiangong_point, tiangong_trail_line
    global trail_x, trail_y, trail_z, beidou_trail_x, beidou_trail_y, beidou_trail_z, tiangong_trail_x, tiangong_trail_y, tiangong_trail_z
    global iss_label, beidou_label, tiangong_label, tokyo_marker
    global current_altitude

    angle = frame * 0.03
    cloud_angle = frame * 0.0045
    sun_dir = sun_direction
    

         # 月の角度
    # 月も滑らかに動かす
 # update 関数内
 #   moon_angle = frame * 0.01
 #   moon_x_pos = moon_distance * np.cos(moon_angle)
 #   moon_y_pos = moon_distance * np.sin(moon_angle)
 
    # moon.remove()

 #   moon = ax.plot_surface(
  #      moon_x + moon_x_pos,
   #     moon_y + moon_y_pos,
    #    moon_z,
     #   facecolors=moon_texture[:-1, :-1],
      #  rstride=1,
       # cstride=1,
        #shade=False
    #)

    # ---- Ground Track 計算 ----

    # ---- Ground Track (ISS位置から直接計算) ----

    r = np.sqrt(
        sat_x_frame**2 +
        sat_y_frame**2 +
        sat_z_frame**2
    )

    gx = earth_radius * sat_x_frame / r
    gy = earth_radius * sat_y_frame / r
    gz = earth_radius * sat_z_frame / r

    ground_x.append(gx)
    ground_y.append(gy)
    ground_z.append(gz)

    max_points = 400
    ground_x[:] = ground_x[-max_points:]
    ground_y[:] = ground_y[-max_points:]
    ground_z[:] = ground_z[-max_points:]

    ground_track_line.set_data(ground_x, ground_y)
    ground_track_line.set_3d_properties(ground_z)

    # 高度計算
    altitude = np.linalg.norm([sat_x_frame, sat_y_frame, sat_z_frame]) - earth_radius
    current_altitude = altitude

    # 高度表示
    altitude_label.set_text(
        f"ISS Altitude: {altitude:.0f} km"
    )

    # ISS位置
    x, y, z = sat_x_frame, sat_y_frame, sat_z_frame

    # 本体
    iss_body._offsets3d = ([x], [y], [z])
    velocity = geocentric.velocity.km_per_s
    vx, vy, vz = velocity

    v = np.array([vx, vy, vz])
    v = v / np.linalg.norm(v)

    panel_length = 2000  # 長さ（調整OK）

    # 左右に伸ばす（適当に垂直方向）
    # 適当な直交ベクトル作る
    if abs(v[0]) < 0.9:
        ref = np.array([1,0,0])
    else:
        ref = np.array([0,1,0])

    panel_dir = np.cross(v, [0,0,1])
    if np.linalg.norm(panel_dir) < 0.1:
        panel_dir = np.cross(v, [0,1,0])
    panel_dir = panel_dir / np.linalg.norm(panel_dir)
    px, py, pz = panel_dir * panel_length

    # 左
    iss_panel_left.set_data([x, x + px], [y, y + py])
    iss_panel_left.set_3d_properties([z, z + pz])

    # 右
    iss_panel_right.set_data([x, x - px], [y, y - py])
    iss_panel_right.set_3d_properties([z, z - pz])

    sat_pos = [sat_x_frame, sat_y_frame, sat_z_frame]
  
    if visible:
        iss_body.set_color("yellow")
        iss_panel_left.set_alpha(1.0)
    else:
        iss_body.set_color("gray")
        iss_panel_left.set_alpha(0.3)

    iss_pos = np.array([sat_x_frame, sat_y_frame, sat_z_frame])

    if sat_z_frame < 0:
        iss_body.set_alpha(0.6)
    else:
        iss_body.set_alpha(1.0)

    # 太陽方向への距離
    proj = np.dot(iss_pos, sun_dir)

    # 太陽の反対側にいるか
    if proj < 0:
        dist = np.linalg.norm(iss_pos - proj * sun_dir)

        if dist < earth_radius:
            iss_body.set_color("gray")
            iss_body.set_alpha(0.3)   # ← 暗くする
        else:
            iss_body.set_color("yellow")
            iss_body.set_alpha(1.0)
    else:
        iss_body.set_color("yellow")
        iss_body.set_alpha(1.0)


    visible_x = []
    visible_y = []
    visible_z = []

    for tx, ty, tz in zip(trail_x, trail_y, trail_z):

        pos = np.array([tx, ty, tz])
        # カメラ方向ベクトル
        elev = np.radians(ax.elev)
        azim = np.radians(ax.azim)

        cam = np.array([
            np.cos(elev) * np.cos(azim),
            np.cos(elev) * np.sin(azim),
            np.sin(elev)
        ])

      # カメラ方向との内積
        dot = np.dot(pos, cam)

     # ② 地球に隠れてないか（超重要）
        proj = np.dot(pos, cam)
        closest = pos - proj * cam
        dist_to_center = np.linalg.norm(closest)

        visible = (dot > 0) and (dist_to_center > earth_radius)

        if visible:
            visible_x.append(tx)
            visible_y.append(ty)
            visible_z.append(tz)

    trail_line.set_data(visible_x, visible_y)
    trail_line.set_3d_properties(visible_z)

    if sat_z_frame < 0:
        trail_line.set_alpha(0.2)
    else:
        trail_line.set_alpha(0.8)

    orbit_scale = 1.0

    trail_x.append(sat_x_frame * orbit_scale)
    trail_y.append(sat_y_frame * orbit_scale)
    trail_z.append(sat_z_frame * orbit_scale)

    if len(trail_x) > trail_length:
        trail_x.pop(0)
        trail_y.pop(0)
        trail_z.pop(0)

    iss_label.set_position((sat_x_frame, sat_y_frame))
    iss_label.set_3d_properties(sat_z_frame + 300)
    iss_label.set_rotation(0)

    cos_a = np.cos(angle)
    sin_a = np.sin(angle)

    # 地球自転
    x_rot = earth_x * cos_a - earth_y * sin_a
    y_rot = earth_x * sin_a + earth_y * cos_a

    normals = np.stack((x_rot, y_rot, earth_z), axis=-1)
    normals = normals / np.linalg.norm(normals, axis=2)[...,None]

    sun_dot = (
        normals[:,:,0]*sun_dir[0] +
        normals[:,:,1]*sun_dir[1] +
        normals[:,:,2]*sun_dir[2]
    )

    light = np.clip(sun_dot,0,1)

    shift = int(frame * 0.4)

    texture_day_rot = np.roll(texture_day, shift, axis=1)
    texture_night_rot = np.roll(texture_night, shift, axis=1)

    texture_lit = (
        texture_day_rot * light[:,:,None] +
        texture_night_rot * (1 - light)[:,:,None] * 0.6
    )

    # ---- 赤道可視判定 ----
    # ---- 赤道回転 ----
    cos_a = np.cos(angle)
    sin_a = np.sin(angle)

    x_eq_rot = x_eq * cos_a - y_eq * sin_a
    y_eq_rot = x_eq * sin_a + y_eq * cos_a
    z_eq_rot = z_eq
            
    # カメラ方向
    elev = np.radians(ax.elev)
    azim = np.radians(ax.azim)

    cam = np.array([
    np.cos(elev)*np.cos(azim),
    np.cos(elev)*np.sin(azim),
    np.sin(elev)
    ])

    # 手前側だけ描画
    mask = x_eq*cam[0] + y_eq*cam[1] + z_eq*cam[2] > 0

    front = mask
    back = ~mask

    equator_front.set_data(x_eq[front], y_eq[front])
    equator_front.set_3d_properties(z_eq[front])

    equator_back.set_data(x_eq[back], y_eq[back])
    equator_back.set_3d_properties(z_eq[back])



    # ---- city rotation ----

    for i, (name, (lat, lon)) in enumerate(cities.items()):

        lat = np.radians(lat)
        lon = np.radians(lon)

        lon_rot = lon + angle

        radius = earth_radius + 20   # 地表より少し浮かせる

        x = radius * np.cos(lat) * np.cos(lon_rot)
        y = radius * np.cos(lat) * np.sin(lon_rot)
        z = radius * np.sin(lat)

        # 地球の傾きを適用
        y_tilt = y * np.cos(tilt) - z * np.sin(tilt)
        z_tilt = y * np.sin(tilt) + z * np.cos(tilt)

        city_points[i]._offsets3d = ([x],[y_tilt],[z_tilt])

        city_labels[i].set_position((x, y_tilt))
        city_labels[i].set_3d_properties(z_tilt + 500)
    
   
    

    # Tokyo marker
    lat = np.radians(35.6762)
    lon = np.radians(139.6503)

    lon_rot = lon + angle

    radius = earth_radius + 20   # 地表より少し浮かせる

    tx = radius * np.cos(lat) * np.cos(lon_rot)
    ty = radius * np.cos(lat) * np.sin(lon_rot)
    tz = radius * np.sin(lat)

    tx, ty, tz = tilt_rotate(tx, ty, tz)

    tokyo_marker._offsets3d = ([tx],[ty],[tz])
    
    #
    earth.remove()
    earth = ax.plot_surface(
        x_rot,
        y_rot,
        earth_z,
        facecolors=texture_lit[:-1,:-1],
        rstride=5,
        cstride=5,
        linewidth=0,
        antialiased=False,
        shade=False
        )

    clouds.remove()

    shift = int(frame * 0.2)

    texture_cloud_rot = np.roll(texture_cloud, shift, axis=1)

    cloud_x_rot = cloud_x * cos_a - cloud_y * sin_a
    cloud_y_rot = cloud_x * sin_a + cloud_y * cos_a

    clouds = ax.plot_surface(
        cloud_x_rot,
        cloud_y_rot,
        cloud_z,
        facecolors=texture_cloud_rot[:-1,:-1],
        rstride=1,
        cstride=1,
        linewidth=0,
        shade=False
        )
    clouds.set_edgecolor("none")

    if camera_mode == "iss":
        ax.set_xlim(-12000,12000)
        ax.set_ylim(-12000,12000)
        ax.set_zlim(-12000,12000)

        ax.view_init(elev=20, azim=frame*0.5)


    #北斗衛星位置(Chinese Beidou)

    geocentric = beidou.at(t)
    subpoint = wgs84.subpoint(geocentric)
    x_b, y_b, z_b = geocentric.position.km
    beidou_point._offsets3d = (
        [x_b],
        [y_b],
        [z_b]
    )
    lat = subpoint.latitude.degrees
    lon = subpoint.longitude.degrees
    beidou_trail_x.append(x_b)
    beidou_trail_y.append(y_b)
    beidou_trail_z.append(z_b)
    beidou_trail_line.set_data(beidou_trail_x, beidou_trail_y)
    beidou_trail_line.set_3d_properties(beidou_trail_z)
    max_points = 200
    beidou_trail_x[:] = beidou_trail_x[-max_points:]
    beidou_trail_y[:] = beidou_trail_y[-max_points:]
    beidou_trail_z[:] = beidou_trail_z[-max_points:]

    beidou_label.set_position((x_b, y_b))
    beidou_label.set_3d_properties(z_b + 1500)
    beidou_label.set_rotation(0)
        
    # 天宫位置更新
    geocentric_tg = tiangong.at(t)
    subpoint_tg = wgs84.subpoint(geocentric_tg)
    x_tg_f, y_tg_f, z_tg_f = geocentric_tg.position.km
    tiangong_point._offsets3d = (
        [x_tg_f],
        [y_tg_f],
        [z_tg_f]
    )
    tiangong_trail_x.append(x_tg_f)
    tiangong_trail_y.append(y_tg_f)
    tiangong_trail_z.append(z_tg_f)
    tiangong_trail_line.set_data(tiangong_trail_x, tiangong_trail_y)
    tiangong_trail_line.set_3d_properties(tiangong_trail_z)
    max_points = 200
    tiangong_trail_x[:] = tiangong_trail_x[-max_points:]
    tiangong_trail_y[:] = tiangong_trail_y[-max_points:]
    tiangong_trail_z[:] = tiangong_trail_z[-max_points:]
        
    tiangong_label.set_position((x_tg_f, y_tg_f))
    tiangong_label.set_3d_properties(z_tg_f + 300)
    tiangong_label.set_rotation(0)
    #GPS
    for i, sat in enumerate(gps_sats):

            geocentric = sat.at(t)
            xg, yg, zg = geocentric.position.km

            gps_points[i]._offsets3d = ([xg],[yg],[zg])

            gps_trail_x[i].append(xg)
            gps_trail_y[i].append(yg)
            gps_trail_z[i].append(zg)

            max_points = 200
            gps_trail_x[i] = gps_trail_x[i][-max_points:]
            gps_trail_y[i] = gps_trail_y[i][-max_points:]
            gps_trail_z[i] = gps_trail_z[i][-max_points:]

            gps_trails[i].set_data(gps_trail_x[i], gps_trail_y[i])
            gps_trails[i].set_3d_properties(gps_trail_z[i])

            gps_labels[i].set_position((xg, yg))
            gps_labels[i].set_3d_properties(zg)


    # Himawari-9
    geocentric_him = himawari9.at(t)
    xh, yh, zh = geocentric_him.position.km

    himawari9_point._offsets3d = ([xh],[yh],[zh])

    himawari9_trail_x.append(xh)
    himawari9_trail_y.append(yh)
    himawari9_trail_z.append(zh)
    himawari9_trail_line.set_data(himawari9_trail_x, himawari9_trail_y)
    himawari9_trail_line.set_3d_properties(himawari9_trail_z)
    max_points = 200
    himawari9_trail_x[:] = himawari9_trail_x[-max_points:]
    himawari9_trail_y[:] = himawari9_trail_y[-max_points:]
    himawari9_trail_z[:] = himawari9_trail_z[-max_points:]

    himawari9_label.set_position((xh, yh))
    himawari9_label.set_3d_properties(zh + 1500)
    himawari9_label.set_rotation(0)

    #Starlink
    for plane, sats in starlink_planes.items():

            xs = []
            ys = []
            zs = []

            for sat in sats:

                geocentric = sat.at(t)
                x, y, z = geocentric.position.km

                xs.append(x)
                ys.append(y)
                zs.append(z)

            starlink_plane_points[plane]._offsets3d = (xs, ys, zs)
        
    for i, sat in enumerate(starlinks):
            geocentric = sat.at(t)
            xs, ys, zs = geocentric.position.km

            plane_id = starlink_plane_ids[i]

        # ラベル（最初の10機だけ表示）
            if i < 10:
                starlink_labels[i].set_position((xs, ys))
                starlink_labels[i].set_3d_properties(zs + 200)
                starlink_labels[i].set_text(f"SL-{i+1}")
        
    for i in range(10, len(starlink_labels)):
            starlink_labels[i].set_text("")

  

    if visible:
        iss_body.set_color("red")     # 見える
        iss_body.set_alpha(1.0)       # はっきり表示
        iss_body.set_sizes([80])      # デカく
    else:
        iss_body.set_color("gray")    # 見えない
        iss_body.set_alpha(0.2)       # ほぼ透明
        iss_body.set_sizes([30])      # 小さく
    

    fig.canvas.draw_idle()
        
    return (
        iss_body, earth, moon, trail_line, clouds,
        beidou_point, beidou_trail_line,
        tiangong_point, tiangong_trail_line,
        iss_label, beidou_label, tiangong_label,
        ground_track_line,
        *gps_points, *gps_trails, *gps_labels,
        himawari9_point, himawari9_trail_line, himawari9_label,
        equator_front, equator_back
        )

ani = FuncAnimation(
    fig,
    update,
    frames=1000,
    interval=30,
    blit=False
)
fig.canvas.mpl_connect('scroll_event', on_scroll)
fig.canvas.mpl_connect('pick_event', on_pick)
# -------- 星 --------
num_stars = 300
star_distance = 300000

theta = np.random.uniform(0, 2*np.pi, num_stars)
phi = np.random.uniform(0, np.pi, num_stars)

star_x = star_distance * np.sin(phi) * np.cos(theta)
star_y = star_distance * np.sin(phi) * np.sin(theta)
star_z = star_distance * np.cos(phi)

sizes = np.random.uniform(0.5, 2.5, num_stars)
ax.scatter(star_x, star_y, star_z, color="white", s=sizes)

ax.set_facecolor("black")
fig.patch.set_facecolor("black")

time_label = fig.text(
    0.02,
    0.95,
    "",
    color="white",
    fontsize=12
)
speed_label = fig.text(
    0.02,
    0.91,
    f"Speed: {sim_speed} min/frame",
    color="cyan",
    fontsize=10
)
altitude_label = fig.text(
    0.02,
    0.87,
    "",
    color="cyan",
    fontsize=11
)
info_label = fig.text(
    0.75, 0.9,
    "",
    color="white",
    fontsize=10
)


plt.show()