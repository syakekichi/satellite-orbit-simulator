from skyfield.api import EarthSatellite, load
from mpl_toolkits.mplot3d import Axes3D
from PIL import Image
from matplotlib.animation import FuncAnimation
from matplotlib.widgets import Button
from scipy.interpolate import interp1d
from datetime import datetime, timedelta
from skyfield.api import utc
from skyfield.api import wgs84
from mpl_toolkits.mplot3d import proj3d

import matplotlib.pyplot as plt
import numpy as np

fig = plt.figure()
ax = fig.add_subplot(111, projection="3d")

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

sun_direction = np.array([1,0,0])
sun_direction = sun_direction / np.linalg.norm(sun_direction)



u = np.linspace(0, 2*np.pi, mesh_w, endpoint=False)
v = np.linspace(0, np.pi, mesh_h)
u, v = np.meshgrid(u, v)

earth_x = earth_radius * np.cos(u) * np.sin(v)
earth_y = earth_radius * np.sin(u) * np.sin(v)
earth_z = earth_radius * np.cos(v)

earth_y_tilt = earth_y * np.cos(tilt) - earth_z * np.sin(tilt)
earth_z_tilt = earth_y * np.sin(tilt) + earth_z * np.cos(tilt)

earth_y = earth_y_tilt
earth_z = earth_z_tilt

 #雲テクスチャ
cloud_img = Image.open("earth_clouds.png").convert("RGBA")
cloud_img = cloud_img.resize((mesh_w, mesh_h))

texture_cloud = np.array(cloud_img) / 255

cloud_radius = earth_radius * 1.01

cloud_x = cloud_radius * np.cos(u) * np.sin(v)
cloud_y = cloud_radius * np.sin(u) * np.sin(v)
cloud_z = cloud_radius * np.cos(v)

cloud_y_tilt = cloud_y * np.cos(tilt) - cloud_z * np.sin(tilt)
cloud_z_tilt = cloud_y * np.sin(tilt) + cloud_z * np.cos(tilt)

cloud_y = cloud_y_tilt
cloud_z = cloud_z_tilt

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

atmo_y_tilt = atmo_y * np.cos(tilt) - atmo_z * np.sin(tilt)
atmo_z_tilt = atmo_y * np.sin(tilt) + atmo_z * np.cos(tilt)

atmo_y = atmo_y_tilt
atmo_z = atmo_z_tilt

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
sim_speed = 1

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

line1 = "1 25544U 98067A   24060.54791667  .00016717  00000+0  10270-3 0  9001"
line2 = "2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.50256479  1234"

satellite = EarthSatellite(line1, line2, "ISS")

ts = load.timescale()
t = ts.now()
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
starlinks = load.tle_file("starlink.txt")
print("Loaded", len(starlinks), "Starlink satellites")
starlinks = starlinks[:100]



# シミュレーション開始日時
start_time = datetime(2024, 3, 10, 0, 0, 0, tzinfo=utc)
# 軌道計算（1分刻み）

minutes = np.arange(0, 1440, 1)
times = ts.utc([start_time + timedelta(minutes=int(m)) for m in minutes])
geocentric = satellite.at(times)
x, y, z = geocentric.position.km

# 補間関数
interp_x = interp1d(np.arange(len(x)), x, kind='cubic')
interp_y = interp1d(np.arange(len(y)), y, kind='cubic')
interp_z = interp1d(np.arange(len(z)), z, kind='cubic')

geocentric = satellite.at(times)
x, y, z = geocentric.position.km

sat_scale = 1.07

sat_x = x * sat_scale
sat_y = y * sat_scale
sat_z = z * sat_scale



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
    facecolors=texture_day[:-1,:-1],
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

iss_point = ax.scatter(
    sat_x[0],
    sat_y[0],
    sat_z[0],
    color="yellow",
    s=10,
    marker="*",
    zorder=11
)


trail_line, = ax.plot([], [], [], color="cyan", linewidth=1, alpha=1, zorder=10)

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
    sat_x[0],
    sat_y[0],
    sat_z[0] + 300,
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
        zorder=10
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
    zorder=13
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
    zorder=20
)

#Starlink初期描画
starlink_points = ax.scatter([], [], [], color="cyan", s=5)

starlink_x = []
starlink_y = []
starlink_z = []



# -------- アニメーション --------

def update(frame):
    sim_time = start_time + timedelta(minutes=frame * sim_speed)

    time_label.set_text(
        sim_time.strftime("Simulation Time: %Y-%m-%d %H:%M UTC")
    )

    speed_label.set_text(f"Speed: {sim_speed}x")

    frame = frame % len(sat_x)
    ax.set_box_aspect([1,1,1])

    global earth, moon, iss_point, trail_line, atmosphere, clouds, beidou_point, beidou_trail_line, tiangong_point, tiangong_trail_line
    global trail_x, trail_y, trail_z, beidou_trail_x, beidou_trail_y, beidou_trail_z, tiangong_trail_x, tiangong_trail_y, tiangong_trail_z
    global iss_label, beidou_label, tiangong_label
    angle = frame * 0.004
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


        #----

        # frame に対応する ISS の滑らか位置を補間
    sat_x_frame = interp_x(frame)
    sat_y_frame = interp_y(frame)
    sat_z_frame = interp_z(frame)

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

    # 高度表示
    altitude_label.set_text(
        f"ISS Altitude: {altitude:.0f} km"
    )

    iss_point._offsets3d = (
        [sat_x_frame],
        [sat_y_frame],
        [sat_z_frame]
    )
    iss = np.array([sat_x_frame, sat_y_frame, sat_z_frame])

    if sat_z_frame < 0:
        iss_point.set_alpha(0.3)
    else:
        iss_point.set_alpha(1.0)

    # 太陽方向への距離
    proj = np.dot(iss, sun_dir)

    # 太陽の反対側にいるか
    if proj < 0:

    # 太陽軸からの距離
        dist = np.linalg.norm(iss - proj * sun_dir)

        if dist < earth_radius:
            iss_point.set_color("gray")  # 地球の影
        else:
            iss_point.set_color("yellow")
    else:
        iss_point.set_color("yellow")


    visible_x = []
    visible_y = []
    visible_z = []

    for tx, ty, tz in zip(trail_x, trail_y, trail_z):

    # 地球中心からの距離
        r = np.sqrt(tx*tx + ty*ty + tz*tz)

    # 地球の裏なら描画しない
        if r > earth_radius * 1.01:
            visible_x.append(tx)
            visible_y.append(ty)
            visible_z.append(tz)

    trail_line.set_data(visible_x, visible_y)
    trail_line.set_3d_properties(visible_z)

    if sat_z_frame < 0:
        trail_line.set_alpha(0.2)
    else:
        trail_line.set_alpha(0.7)

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

    cos_a = np.cos(angle)
    sin_a = np.sin(angle)

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

    texture_lit = (
        texture_day * light[:,:,None] +
        texture_night * (1 - light)[:,:,None] * 0.6
    )

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

    clouds = ax.plot_surface(
        cloud_x,
        cloud_y,
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
    t = ts.now() + (frame * sim_speed)/1440 #1日 = 1440分、１フレーム＝１分
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

    #Starlink
    starlink_x.clear()
    starlink_y.clear()
    starlink_z.clear()

    for i, sat in enumerate(starlinks):
        geocentric = sat.at(t)
        xs, ys, zs = geocentric.position.km

        starlink_x.append(xs)
        starlink_y.append(ys)
        starlink_z.append(zs)

    starlink_points._offsets3d = (starlink_x, starlink_y, starlink_z)

    fig.canvas.draw_idle()
    
    return iss_point, earth, moon, trail_line, clouds, beidou_point, beidou_trail_line, tiangong_point, 
    tiangong_trail_line, iss_label, beidou_label, tiangong_label, ground_track_line, gps_points, gps_trails, 
    gps_labels, himawari9_point, himawari9_trail_line, himawari9_label, starlink_points

ani = FuncAnimation(
    fig,
    update,
    frames=np.arange(0, len(sat_x), 0.5),
    interval=30,
    blit=False
)

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
    "Speed: 1000x",
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

plt.show()