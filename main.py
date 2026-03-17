from skyfield.api import EarthSatellite, load
from mpl_toolkits.mplot3d import Axes3D
from PIL import Image
from matplotlib.animation import FuncAnimation
from matplotlib.widgets import Button

import matplotlib.pyplot as plt
import numpy as np

fig = plt.figure()
ax = fig.add_subplot(111, projection="3d")

print("program started")

# 地球テクスチャ
day_img = Image.open("earth_texture.jpg")
night_img = Image.open("earth_night.jpg")
mesh_w = 180
mesh_h = 90

day_img = day_img.resize((mesh_w, mesh_h))
night_img = night_img.resize((mesh_w, mesh_h))

texture_day = np.array(day_img) / 255
texture_night = np.array(night_img) / 255

# -------- 地球設定 --------

tilt = np.radians(23.4)

earth_radius = 6371

sun_direction = np.array([1,0,0])
sun_direction = sun_direction / np.linalg.norm(sun_direction)



u = np.linspace(0, 2*np.pi, mesh_w)
v = np.linspace(0, np.pi, mesh_h)
u, v = np.meshgrid(u, v)

earth_x = earth_radius * np.cos(u) * np.sin(v)
earth_y = earth_radius * np.sin(u) * np.sin(v)
earth_z = earth_radius * np.cos(v)

earth_y_tilt = earth_y * np.cos(tilt) - earth_z * np.sin(tilt)
earth_z_tilt = earth_y * np.sin(tilt) + earth_z * np.cos(tilt)

earth_y = earth_y_tilt
earth_z = earth_z_tilt

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
    alpha=0.15,
    linewidth=0
)

# -------- 月設定 --------
moon_radius = 1700
moon_distance = 30000

u = np.linspace(0, 2*np.pi, 40)
v = np.linspace(0, np.pi, 20)

moon_x = moon_radius * np.outer(np.cos(u), np.sin(v)) + moon_distance
moon_y = moon_radius * np.outer(np.sin(u), np.sin(v))
moon_z = moon_radius * np.outer(np.ones(np.size(u)), np.cos(v))

moon = ax.plot_surface(
    moon_x,
    moon_y,
    moon_z,
    color="lightgray",
    alpha=1
)


#カメラモード
 #normal:通常
 #follow:ISSを追跡
 #free:自由

camera_mode = "overview"

def earth_view(event):
    global camera_mode
    camera_mode = "overview"

def iss_view(event):
    global camera_mode
    camera_mode = "iss"


#ボタン描画
ax_button1 = plt.axes([0.3,0.05,0.15,0.05])
ax_button2 = plt.axes([0.55,0.05,0.15,0.05])

btn1 = Button(ax_button1,"Overview")
btn2 = Button(ax_button2,"Track ISS")

btn1.on_clicked(earth_view)
btn2.on_clicked(iss_view)

#-----太陽設定-----

sun_distance = 1500000
sun_radius = 50000

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

minutes = np.arange(0,1440,0.5)
times = ts.utc(2024,3,10,minutes)

geocentric = satellite.at(times)
x, y, z = geocentric.position.km

sat_x, sat_y, sat_z = geocentric.position.km



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
    linewidth=0,
    antialiased=False,
    alpha=0.9
)

# ISS軌道
# ax.plot(x,y,z,color="red",linewidth=2)

iss_point = ax.scatter(
    sat_x[0],
    sat_y[0],
    sat_z[0],
    color="yellow",
    s=50,
    marker="*"
)


trail, = ax.plot([], [], [], color="cyan", linewidth=2, alpha=0.7)

limit = 500000

ax.set_xlim(-limit,limit)
ax.set_ylim(-limit,limit)
ax.set_zlim(-limit,limit)

ax.grid(False)
ax.set_axis_off()
ax.set_box_aspect([1,1,1])

# -------- アニメーション --------

def update(frame):

    ax.set_xlim(-500000, 500000)
    ax.set_ylim(-500000, 500000)
    ax.set_zlim(-500000, 500000)
    ax.set_box_aspect([1,1,1])

    global earth, moon
    angle = frame * 0.004

    sun_dir = sun_direction
    

         # 月の角度
    moon_angle = frame * 0.01

    moon_x = moon_distance * np.cos(moon_angle)
    moon_y = moon_distance * np.sin(moon_angle)
    moon_z = 0

    u = np.linspace(0, 2*np.pi, 40)
    v = np.linspace(0, np.pi, 20)

    x = moon_radius * np.outer(np.cos(u), np.sin(v)) + moon_x
    y = moon_radius * np.outer(np.sin(u), np.sin(v)) + moon_y
    z = moon_radius * np.outer(np.ones(np.size(u)), np.cos(v)) + moon_z

    moon.remove()
    moon = ax.plot_surface(x, y, z, color="lightgray")

        #----

    iss_point._offsets3d = (
        [sat_x[frame]],
        [sat_y[frame]],
        [sat_z[frame]]
    )
    iss = np.array([sat_x[frame], sat_y[frame], sat_z[frame]])

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


    trail_length = 200

    start = max(0, frame - trail_length)

    trail.set_data(sat_x[start:frame], sat_y[start:frame])
    trail.set_3d_properties(sat_z[start:frame])


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
        linewidth=0,
        antialiased=False
    )


    if camera_mode == "iss":
        ax.set_xlim(-12000,12000)
        ax.set_ylim(-12000,12000)
        ax.set_zlim(-12000,12000)

        ax.view_init(elev=20, azim=frame*0.5)

    elif camera_mode == "overview":
        ax.set_xlim(-20000, 20000)
        ax.set_ylim(-20000, 20000)
        ax.set_zlim(-20000, 20000)

       # ax.view_init(elev=25, azim=45)
    
    return iss_point, earth, trail

ani = FuncAnimation(
    fig,
    update,
    frames=len(sat_x),
    interval=50,
    blit=False
)

# -------- 星 --------

num_stars = 500
star_x = np.random.uniform(-50000,50000,num_stars)
star_y = np.random.uniform(-50000,50000,num_stars)
star_z = np.random.uniform(-50000,50000,num_stars)

ax.scatter(star_x,star_y,star_z,color="white",s=1)

ax.set_facecolor("black")
fig.patch.set_facecolor("black")

plt.show()