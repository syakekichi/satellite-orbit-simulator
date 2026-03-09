from skyfield.api import EarthSatellite, load
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt
import numpy as np

print("program started")

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

u = np.linspace(0, 2*np.pi, 100)
v = np.linspace(0, np.pi, 100)

earth_x = earth_radius * np.outer(np.cos(u), np.sin(v))
earth_y = earth_radius * np.outer(np.sin(u), np.sin(v))
earth_z = earth_radius * np.outer(np.ones(np.size(u)), np.cos(v))

ax.plot_surface(earth_x, earth_y, earth_z, color='blue', alpha=0.4)

# -------- ISS軌道 --------

ax.scatter(x[0], y[0], z[0], color='yellow', s=100)

# 軸スケール
ax.set_box_aspect([1,1,1])

plt.show()