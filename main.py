from skyfield.api import EarthSatellite, load
from mpl_toolkits.mplot3d import Axes3D
from PIL import Image
from matplotlib.animation import FuncAnimation

import matplotlib.pyplot as plt
import numpy as np

print("program started")


# 地球テクスチャ読み込み
texture = Image.open("earth_texture.jpg")
texture = texture.resize((512,256))
texture = np.array(texture) / 255
texture = np.flipud(texture)

# ISS TLE
line1 = "1 25544U 98067A   24060.54791667  .00016717  00000+0  10270-3 0  9001"
line2 = "2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.50256479  1234"

satellite = EarthSatellite(line1, line2, "ISS")

ts = load.timescale()

times = ts.utc(2024, 3, 10, range(0, 1440, 5))

geocentric = satellite.at(times)
x, y, z = geocentric.position.km

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# -------- 地球を描く --------
earth_radius = 6371

h, w, _ = texture.shape

u = np.linspace(0, 2*np.pi, w)
v = np.linspace(0, np.pi, h)

u, v = np.meshgrid(u, v)

# ISS位置
geocentric = satellite.at(times)
sat_x, sat_y, sat_z = geocentric.position.km

earth_x = earth_radius * np.cos(u) * np.sin(v)
earth_y = earth_radius * np.sin(u) * np.sin(v)
earth_z = earth_radius * np.cos(v)


ax.plot_surface(
    earth_x,
    earth_y,
    earth_z,
    facecolors=texture,
    rstride=4,
    cstride=4
)

# -------- ISS軌道 --------

ax.scatter(x[0], y[0], z[0], color='yellow', s=200)
ax.plot(x, y, z, color='red', linewidth=2)

# 軸スケール
ax.set_box_aspect([1,1,1])


iss_point = ax.scatter(sat_x[0], sat_y[0], sat_z[0], color='yellow', s=200)

def update(frame):
    iss_point._offsets3d = (
        [sat_x[frame]],
        [sat_y[frame]],
        [sat_z[frame]]
    )
    return iss_point,

ani = FuncAnimation(
    fig,
    update,
    frames=len(sat_x),
    interval=50
)

plt.show()