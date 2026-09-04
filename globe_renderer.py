import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

FONT_PATH_TITLE = "C:/Windows/Fonts/meiryob.ttc" if os.path.exists("C:/Windows/Fonts/meiryob.ttc") else ("C:/Windows/Fonts/segoeuib.ttf" if os.path.exists("C:/Windows/Fonts/segoeuib.ttf") else "C:/Windows/Fonts/arialbd.ttf")
FONT_PATH_BODY = "C:/Windows/Fonts/meiryo.ttc" if os.path.exists("C:/Windows/Fonts/meiryo.ttc") else "C:/Windows/Fonts/arial.ttf"
FONT_PATH_MONO = "C:/Windows/Fonts/consola.ttf" if os.path.exists("C:/Windows/Fonts/consola.ttf") else FONT_PATH_BODY

def project_3d(lat, lon, alt_km, center_lat, center_lon, cx, cy, radius):
    """
    緯度経度・高度から画面上の(x, y)と視線深度zを計算。
    z > 0: 手前側 (可視)
    z <= 0: 地球の裏側 (不可視)
    """
    rad_lat = np.radians(lat)
    rad_lon = np.radians(lon)
    rad_c_lat = np.radians(center_lat)
    rad_c_lon = np.radians(center_lon)

    X0 = np.cos(rad_lat) * np.sin(rad_lon - rad_c_lon)
    Y0 = np.sin(rad_lat)
    Z0 = np.cos(rad_lat) * np.cos(rad_lon - rad_c_lon)

    # X軸周りに-center_lat回転
    X1 = X0
    Y1 = Y0 * np.cos(rad_c_lat) - Z0 * np.sin(rad_c_lat)
    Z1 = Y0 * np.sin(rad_c_lat) + Z0 * np.cos(rad_c_lat)

    k = 1.0 + (alt_km / 6371.0)
    sx = cx + X1 * k * radius
    sy = cy - Y1 * k * radius
    return sx, sy, Z1

def render_3d_globe(center_lat, center_lon, 
                    markers=None, trails=None, 
                    badge="3D LIVE TRACKER", badge_color="#38BDF8",
                    title="SatViewer3D Orbit Visualizer",
                    metrics=None,
                    site_url="satviewer3d.com",
                    out_path="post_card.png",
                    tex_dir="."):
    """
    超高精細3D地球儀シーン（1200x675 16:9 Xカード用）を生成して保存。
    """
    width, height = 1200, 675
    globe_cx, globe_cy = 730, 338
    globe_radius = 295

    if center_lat is None or np.isnan(center_lat):
        center_lat = 35.0
    if center_lon is None or np.isnan(center_lon):
        center_lon = 139.0

    # 1. 宇宙背景（星空 + 微妙なコズミックグラデーション）
    seed_val = int(abs(center_lat * 100 + center_lon)) % 10000 + 1
    np.random.seed(seed_val)
    scene = np.zeros((height, width, 3), dtype=np.uint8)
    
    # 宇宙の深みグラデーション
    y_coords = np.linspace(0, 1, height)[:, None]
    scene[:, :, 0] = (14 * (1 - y_coords) + 4 * y_coords).astype(np.uint8) # B
    scene[:, :, 1] = (8 * (1 - y_coords) + 2 * y_coords).astype(np.uint8)  # G
    scene[:, :, 2] = (5 * (1 - y_coords) + 1 * y_coords).astype(np.uint8)  # R

    # 星々をプロット
    num_stars = 260
    sx = np.random.randint(0, width, num_stars)
    sy = np.random.randint(0, height, num_stars)
    s_bright = np.random.randint(110, 255, num_stars)
    for i in range(num_stars):
        # 地球の裏には描画しない
        if (sx[i] - globe_cx)**2 + (sy[i] - globe_cy)**2 > (globe_radius - 10)**2:
            scene[sy[i], sx[i]] = [s_bright[i], s_bright[i], s_bright[i]]
            if s_bright[i] > 225 and 0 < sy[i] < height-1 and 0 < sx[i] < width-1:
                scene[sy[i]-1:sy[i]+2, sx[i]] = np.clip(scene[sy[i]-1:sy[i]+2, sx[i]] + 45, 0, 255)
                scene[sy[i], sx[i]-1:sx[i]+2] = np.clip(scene[sy[i], sx[i]-1:sx[i]+2] + 45, 0, 255)

    # 2. 地球テクスチャのロードと3D球面レンダリング
    earth_tex_path = os.path.join(tex_dir, "earth_texture.jpg")
    clouds_path = os.path.join(tex_dir, "earth_clouds.png")

    if not os.path.exists(earth_tex_path):
        earth_tex_path = "earth_texture.jpg"
    if not os.path.exists(clouds_path):
        clouds_path = "earth_clouds.png"

    tex_img = Image.open(earth_tex_path).convert("RGB")
    tex = np.array(tex_img)
    tex_h, tex_w, _ = tex.shape

    size = globe_radius * 2
    # グリッド (-1 to 1)
    x, y = np.meshgrid(np.linspace(-1, 1, size), np.linspace(1, -1, size))
    r2 = x**2 + y**2
    mask = r2 <= 1.0

    z = np.zeros_like(x)
    z[mask] = np.sqrt(1.0 - r2[mask])

    rad_lat = np.radians(center_lat)
    rad_lon = np.radians(center_lon)

    x_m = x[mask]
    y_m = y[mask]
    z_m = z[mask]

    y1 = y_m * np.cos(rad_lat) + z_m * np.sin(rad_lat)
    z1 = -y_m * np.sin(rad_lat) + z_m * np.cos(rad_lat)
    x1 = x_m

    lats = np.arcsin(np.clip(y1, -1.0, 1.0))
    lons = np.arctan2(x1, z1) + rad_lon
    lons = (lons + np.pi) % (2 * np.pi) - np.pi

    map_x = ((lons / (2 * np.pi) + 0.5) * (tex_w - 1)).astype(np.float32)
    map_y = (((-lats / np.pi) + 0.5) * (tex_h - 1)).astype(np.float32)

    full_map_x = np.zeros((size, size), dtype=np.float32)
    full_map_y = np.zeros((size, size), dtype=np.float32)
    full_map_x[mask] = map_x
    full_map_y[mask] = map_y

    globe_tex = cv2.remap(tex, full_map_x, full_map_y, interpolation=cv2.INTER_LINEAR)

    # 雲のオーバーレイ
    if os.path.exists(clouds_path):
        try:
            c_img = Image.open(clouds_path).convert("RGBA")
            c_arr = np.array(c_img)
            clouds_rgb = c_arr[:, :, :3]
            clouds_alpha = c_arr[:, :, 3].astype(np.float32) / 255.0
            c_h, c_w, _ = clouds_rgb.shape

            c_map_x = ((lons / (2 * np.pi) + 0.5) * (c_w - 1)).astype(np.float32)
            c_map_y = (((-lats / np.pi) + 0.5) * (c_h - 1)).astype(np.float32)
            c_full_x = np.zeros((size, size), dtype=np.float32)
            c_full_y = np.zeros((size, size), dtype=np.float32)
            c_full_x[mask] = c_map_x
            c_full_y[mask] = c_map_y

            globe_c_rgb = cv2.remap(clouds_rgb, c_full_x, c_full_y, interpolation=cv2.INTER_LINEAR)
            globe_c_alpha = cv2.remap(clouds_alpha, c_full_x, c_full_y, interpolation=cv2.INTER_LINEAR)[:, :, None]

            # 雲をブレンド (光沢感)
            globe = (globe_tex.astype(np.float32) * (1.0 - globe_c_alpha * 0.65) + 
                     globe_c_rgb.astype(np.float32) * (globe_c_alpha * 0.65))
        except Exception as e:
            globe = globe_tex.astype(np.float32)
    else:
        globe = globe_tex.astype(np.float32)

    # 太陽光ライティング (左斜め上からの平行光線)
    light_dir = np.array([-0.35, 0.35, 0.86])
    light_dir /= np.linalg.norm(light_dir)
    dot = np.zeros((size, size), dtype=np.float32)
    dot[mask] = np.clip(x[mask]*light_dir[0] + y[mask]*light_dir[1] + z[mask]*light_dir[2], 0.06, 1.0)
    shading = np.power(dot, 0.65) * 0.82 + 0.18

    # 地球表面を合成
    globe_shaded = np.zeros((size, size, 3), dtype=np.float32)
    for c in range(3):
        globe_shaded[:, :, c] = np.where(mask, globe[:, :, c] * shading, 0)

    # 3. 大気グロー（球の縁〜外周の青い輝き）
    dist = np.sqrt(r2)
    glow_intensity = np.zeros((size, size), dtype=np.float32)
    glow_mask = (dist >= 0.88) & (dist <= 1.0)
    # 球体内部のフチの青いグロー
    glow_intensity[glow_mask] = np.clip((dist[glow_mask] - 0.88) / 0.12, 0, 1) ** 1.8

    # 球体外周の大気光冠 (1.0〜1.25)
    outer_glow_mask = (dist > 1.0) & (dist < 1.25)
    outer_glow = np.zeros((size, size), dtype=np.float32)
    outer_glow[outer_glow_mask] = np.clip(1.0 - (dist[outer_glow_mask] - 1.0) / 0.25, 0, 1) ** 2.5

    atmo_color = np.array([56, 189, 248]) # Cyan / Blue
    globe_final = np.zeros((size, size, 3), dtype=np.float32)
    for c in range(3):
        # 表面＋内部リムグロー
        globe_final[:, :, c] = np.where(mask, globe_shaded[:, :, c] + atmo_color[c] * glow_intensity * 0.45, 0)
        # 外周グロー
        globe_final[:, :, c] += atmo_color[c] * outer_glow * 0.85

    # シーンへ配置
    gx0 = globe_cx - globe_radius
    gy0 = globe_cy - globe_radius
    gx1 = gx0 + size
    gy1 = gy0 + size

    alpha_blend = np.clip(np.where(mask, 1.0, outer_glow * 1.5), 0, 1)[:, :, None]
    scene[gy0:gy1, gx0:gx1] = np.clip(
        scene[gy0:gy1, gx0:gx1] * (1.0 - alpha_blend) + globe_final * alpha_blend, 0, 255
    ).astype(np.uint8)

    # 4. PILによるベクター・ライン・マーカー・UIの描画
    pil_img = Image.fromarray(scene)
    draw = ImageDraw.Draw(pil_img, "RGBA")

    # 軌道ライン (Trails) の描画
    if trails:
        for tr in trails:
            points = tr.get("points", [])
            color_hex = tr.get("color", "#38BDF8")
            width_px = tr.get("width", 3)
            alt_km = tr.get("alt_km", 400.0)

            # 16進数カラーをRGBAに
            r = int(color_hex[1:3], 16)
            g = int(color_hex[3:5], 16)
            b = int(color_hex[5:7], 16)

            screen_pts = []
            for (p_lat, p_lon) in points:
                sx, sy, z_val = project_3d(p_lat, p_lon, alt_km, center_lat, center_lon, globe_cx, globe_cy, globe_radius)
                screen_pts.append((sx, sy, z_val))

            for i in range(len(screen_pts) - 1):
                p1 = screen_pts[i]
                p2 = screen_pts[i+1]
                # 画面端の折り返し等で極端に離れた線は除外
                if (p1[0] - p2[0])**2 + (p1[1] - p2[1])**2 > 40000:
                    continue
                # 表側
                if p1[2] > 0.05 and p2[2] > 0.05:
                    draw.line([(p1[0], p1[1]), (p2[0], p2[1])], fill=(r, g, b, 240), width=width_px)
                    # ネオングロー
                    draw.line([(p1[0], p1[1]), (p2[0], p2[1])], fill=(r, g, b, 70), width=width_px + 4)
                # 裏側（薄く透過）
                elif p1[2] <= 0.05 and p2[2] <= 0.05:
                    draw.line([(p1[0], p1[1]), (p2[0], p2[1])], fill=(r, g, b, 35), width=1)

    # マーカー (Markers) の描画
    if markers:
        for m in markers:
            m_lat = m.get("lat", 0.0)
            m_lon = m.get("lon", 0.0)
            m_alt = m.get("alt_km", 0.0)
            label = m.get("label", "")
            m_color = m.get("color", "#EF4444")
            m_size = m.get("size", 10)
            is_quake = m.get("is_quake", False)

            sx, sy, z_val = project_3d(m_lat, m_lon, m_alt, center_lat, center_lon, globe_cx, globe_cy, globe_radius)

            if z_val > 0.0:  # 手前側のみ強調表示
                r = int(m_color[1:3], 16)
                g = int(m_color[3:5], 16)
                b = int(m_color[5:7], 16)

                # 地震の場合の震度同心円波
                if is_quake:
                    mag = m.get("mag", 5.0)
                    for wave_r, wave_alpha in [(55, 40), (35, 90), (18, 160)]:
                        draw.ellipse([sx - wave_r, sy - wave_r, sx + wave_r, sy + wave_r], 
                                     outline=(r, g, b, wave_alpha), width=2)
                    draw.ellipse([sx - 9, sy - 9, sx + 9, sy + 9], fill=(r, g, b, 255), outline=(255, 255, 255, 255), width=2)
                else:
                    # 衛星マーカー
                    # 光るパルス外輪
                    draw.ellipse([sx - m_size*2.5, sy - m_size*2.5, sx + m_size*2.5, sy + m_size*2.5], 
                                 fill=(r, g, b, 40), outline=(r, g, b, 120), width=1)
                    # 中心コア
                    draw.ellipse([sx - m_size, sy - m_size, sx + m_size, sy + m_size], 
                                 fill=(r, g, b, 255), outline=(255, 255, 255, 255), width=2)

                # ラベル引き出し線と吹き出し
                if label:
                    font_label = ImageFont.truetype(FONT_PATH_TITLE, 13)
                    # 吹き出し位置
                    lx, ly = sx + 22, sy - 28
                    draw.line([(sx, sy), (lx, ly + 12)], fill=(r, g, b, 200), width=1)
                    draw.line([(lx, ly + 12), (lx + 80, ly + 12)], fill=(r, g, b, 200), width=1)
                    draw.text((lx + 4, ly - 4), label, font=font_label, fill=(255, 255, 255, 255))

    # 5. 左側 サイバーHUD 情報カード (Glassmorphism Panel)
    hud_x, hud_y = 45, 45
    hud_w, hud_h = 420, 585

    # 半透明ダークグラス背景
    draw.rounded_rectangle([hud_x, hud_y, hud_x + hud_w, hud_y + hud_h], radius=16,
                           fill=(11, 17, 33, 230), outline=(30, 41, 59, 255), width=2)
    # トップアクセントライン
    draw.line([(hud_x + 20, hud_y + 1), (hud_x + 180, hud_y + 1)], fill=(56, 189, 248, 255), width=2)

    # バッジ (例: 3D LIVE TRACKER)
    font_badge = ImageFont.truetype(FONT_PATH_TITLE, 11)
    b_r = int(badge_color[1:3], 16)
    b_g = int(badge_color[3:5], 16)
    b_b = int(badge_color[5:7], 16)

    badge_w = int(draw.textlength(badge, font=font_badge)) + 24
    draw.rounded_rectangle([hud_x + 24, hud_y + 24, hud_x + 24 + badge_w, hud_y + 48], radius=6,
                           fill=(b_r, b_g, b_b, 40), outline=(b_r, b_g, b_b, 180), width=1)
    draw.text((hud_x + 36, hud_y + 28), badge, font=font_badge, fill=(b_r, b_g, b_b, 255))

    # タイトル
    font_title = ImageFont.truetype(FONT_PATH_TITLE, 22)
    # タイトルが長い場合は改行
    if len(title) > 22 and " • " in title:
        parts = title.split(" • ", 1)
        draw.text((hud_x + 24, hud_y + 60), parts[0], font=font_title, fill=(255, 255, 255, 255))
        draw.text((hud_x + 24, hud_y + 88), parts[1], font=font_title, fill=(56, 189, 248, 255))
        metric_start_y = hud_y + 130
    else:
        draw.text((hud_x + 24, hud_y + 64), title, font=font_title, fill=(255, 255, 255, 255))
        metric_start_y = hud_y + 115

    # 区切り線
    draw.line([(hud_x + 24, metric_start_y), (hud_x + hud_w - 24, metric_start_y)], fill=(30, 41, 59, 200), width=1)

    # メトリクス項目リスト
    if metrics:
        font_m_label = ImageFont.truetype(FONT_PATH_BODY, 12)
        font_m_val = ImageFont.truetype(FONT_PATH_TITLE, 15)
        cur_y = metric_start_y + 14

        for item in metrics:
            m_label = item.get("label", "")
            m_val = item.get("value", "")
            m_color = item.get("color", "#F8FAFC")
            val_r = int(m_color[1:3], 16)
            val_g = int(m_color[3:5], 16)
            val_b = int(m_color[5:7], 16)

            # カード風背景
            draw.rounded_rectangle([hud_x + 24, cur_y, hud_x + hud_w - 24, cur_y + 56], radius=8,
                                   fill=(15, 23, 42, 160), outline=(30, 41, 59, 140), width=1)
            # ラベル
            draw.text((hud_x + 36, cur_y + 8), m_label, font=font_m_label, fill=(148, 163, 184, 255))
            # 値
            draw.text((hud_x + 36, cur_y + 27), m_val, font=font_m_val, fill=(val_r, val_g, val_b, 255))

            cur_y += 66

    # フッターブランドURL
    font_brand = ImageFont.truetype(FONT_PATH_TITLE, 14)
    draw.text((hud_x + 24, hud_y + hud_h - 40), f">>> {site_url.upper()}", font=font_brand, fill=(56, 189, 248, 255))

    # 画面右下の3D地球儀ウォーターマーク
    font_wm = ImageFont.truetype(FONT_PATH_TITLE, 11)
    draw.text((width - 240, height - 32), "3D DIGITAL GLOBE SIMULATION", font=font_wm, fill=(100, 116, 139, 180))

    # 保存
    pil_img.save(out_path, quality=95)
    return out_path

def render_3d_animation(center_lat, center_lon, 
                        markers=None, trails=None, 
                        badge="3D LIVE TRACKER", badge_color="#38BDF8",
                        title="SatViewer3D Orbit Visualizer",
                        metrics=None,
                        site_url="satviewer3d.com",
                        num_frames=20,
                        rotate_deg=18.0,
                        fps=10,
                        out_path="orbit_animation.gif",
                        tex_dir="."):
    """
    自転する3D地球儀と軌道上の衛星パルスをマルチフレーム描画し、
    Xタイムライン上で自動再生される美麗なループアニメーションGIF（またはMP4）を生成。
    """
    width, height = 1200, 675
    globe_cx, globe_cy = 730, 338
    globe_radius = 295
    size = globe_radius * 2

    if center_lat is None or np.isnan(center_lat):
        center_lat = 35.0
    if center_lon is None or np.isnan(center_lon):
        center_lon = 139.0

    # 1. 宇宙背景（星空）
    seed_val = int(abs(center_lat * 100 + center_lon)) % 10000 + 1
    np.random.seed(seed_val)
    base_scene = np.zeros((height, width, 3), dtype=np.uint8)
    
    y_coords = np.linspace(0, 1, height)[:, None]
    base_scene[:, :, 0] = (14 * (1 - y_coords) + 4 * y_coords).astype(np.uint8)
    base_scene[:, :, 1] = (8 * (1 - y_coords) + 2 * y_coords).astype(np.uint8)
    base_scene[:, :, 2] = (5 * (1 - y_coords) + 1 * y_coords).astype(np.uint8)

    num_stars = 260
    sx = np.random.randint(0, width, num_stars)
    sy = np.random.randint(0, height, num_stars)
    s_bright = np.random.randint(110, 255, num_stars)
    for i in range(num_stars):
        if (sx[i] - globe_cx)**2 + (sy[i] - globe_cy)**2 > (globe_radius - 10)**2:
            base_scene[sy[i], sx[i]] = [s_bright[i], s_bright[i], s_bright[i]]
            if s_bright[i] > 225 and 0 < sy[i] < height-1 and 0 < sx[i] < width-1:
                base_scene[sy[i]-1:sy[i]+2, sx[i]] = np.clip(base_scene[sy[i]-1:sy[i]+2, sx[i]] + 45, 0, 255)
                base_scene[sy[i], sx[i]-1:sx[i]+2] = np.clip(base_scene[sy[i], sx[i]-1:sx[i]+2] + 45, 0, 255)

    # 2. 地球テクスチャのロード
    earth_tex_path = os.path.join(tex_dir, "earth_texture.jpg")
    clouds_path = os.path.join(tex_dir, "earth_clouds.png")
    if not os.path.exists(earth_tex_path): earth_tex_path = "earth_texture.jpg"
    if not os.path.exists(clouds_path): clouds_path = "earth_clouds.png"

    tex_img = Image.open(earth_tex_path).convert("RGB")
    tex = np.array(tex_img)
    tex_h, tex_w, _ = tex.shape

    has_clouds = os.path.exists(clouds_path)
    if has_clouds:
        c_img = Image.open(clouds_path).convert("RGBA")
        c_arr = np.array(c_img)
        clouds_rgb = c_arr[:, :, :3]
        clouds_alpha = c_arr[:, :, 3].astype(np.float32) / 255.0
        c_h, c_w, _ = clouds_rgb.shape

    # 球面幾何グリッド
    x, y = np.meshgrid(np.linspace(-1, 1, size), np.linspace(1, -1, size))
    r2 = x**2 + y**2
    mask = r2 <= 1.0
    z = np.zeros_like(x)
    z[mask] = np.sqrt(1.0 - r2[mask])

    # 太陽光ライティング計算（不変）
    light_dir = np.array([-0.35, 0.35, 0.86])
    light_dir /= np.linalg.norm(light_dir)
    dot = np.zeros((size, size), dtype=np.float32)
    dot[mask] = np.clip(x[mask]*light_dir[0] + y[mask]*light_dir[1] + z[mask]*light_dir[2], 0.06, 1.0)
    shading = np.power(dot, 0.65) * 0.82 + 0.18

    # 大気光冠（不変）
    dist = np.sqrt(r2)
    glow_intensity = np.zeros((size, size), dtype=np.float32)
    glow_mask = (dist >= 0.88) & (dist <= 1.0)
    glow_intensity[glow_mask] = np.clip((dist[glow_mask] - 0.88) / 0.12, 0, 1) ** 1.8
    outer_glow_mask = (dist > 1.0) & (dist < 1.25)
    outer_glow = np.zeros((size, size), dtype=np.float32)
    outer_glow[outer_glow_mask] = np.clip(1.0 - (dist[outer_glow_mask] - 1.0) / 0.25, 0, 1) ** 2.5
    atmo_color = np.array([56, 189, 248])

    gx0 = globe_cx - globe_radius
    gy0 = globe_cy - globe_radius
    gx1 = gx0 + size
    gy1 = gy0 + size
    alpha_blend = np.clip(np.where(mask, 1.0, outer_glow * 1.5), 0, 1)[:, :, None]

    rad_lat = np.radians(center_lat)
    x_m = x[mask]
    y_m = y[mask]
    z_m = z[mask]
    y1 = y_m * np.cos(rad_lat) + z_m * np.sin(rad_lat)
    z1 = -y_m * np.sin(rad_lat) + z_m * np.cos(rad_lat)
    x1 = x_m
    lats = np.arcsin(np.clip(y1, -1.0, 1.0))
    atan_base = np.arctan2(x1, z1)

    frames = []

    for f_idx in range(num_frames):
        # 地球の自転角度
        step_deg = (f_idx / num_frames) * rotate_deg
        curr_lon = center_lon + step_deg
        rad_lon = np.radians(curr_lon)

        lons = atan_base + rad_lon
        lons = (lons + np.pi) % (2 * np.pi) - np.pi

        map_x = ((lons / (2 * np.pi) + 0.5) * (tex_w - 1)).astype(np.float32)
        map_y = (((-lats / np.pi) + 0.5) * (tex_h - 1)).astype(np.float32)

        full_map_x = np.zeros((size, size), dtype=np.float32)
        full_map_y = np.zeros((size, size), dtype=np.float32)
        full_map_x[mask] = map_x
        full_map_y[mask] = map_y

        globe_tex = cv2.remap(tex, full_map_x, full_map_y, interpolation=cv2.INTER_LINEAR)

        if has_clouds:
            c_map_x = ((lons / (2 * np.pi) + 0.5) * (c_w - 1)).astype(np.float32)
            c_map_y = (((-lats / np.pi) + 0.5) * (c_h - 1)).astype(np.float32)
            c_full_x = np.zeros((size, size), dtype=np.float32)
            c_full_y = np.zeros((size, size), dtype=np.float32)
            c_full_x[mask] = c_map_x
            c_full_y[mask] = c_map_y

            globe_c_rgb = cv2.remap(clouds_rgb, c_full_x, c_full_y, interpolation=cv2.INTER_LINEAR)
            globe_c_alpha = cv2.remap(clouds_alpha, c_full_x, c_full_y, interpolation=cv2.INTER_LINEAR)[:, :, None]
            globe = (globe_tex.astype(np.float32) * (1.0 - globe_c_alpha * 0.65) + 
                     globe_c_rgb.astype(np.float32) * (globe_c_alpha * 0.65))
        else:
            globe = globe_tex.astype(np.float32)

        globe_shaded = np.zeros((size, size, 3), dtype=np.float32)
        for c in range(3):
            globe_shaded[:, :, c] = np.where(mask, globe[:, :, c] * shading, 0)

        globe_final = np.zeros((size, size, 3), dtype=np.float32)
        for c in range(3):
            globe_final[:, :, c] = np.where(mask, globe_shaded[:, :, c] + atmo_color[c] * glow_intensity * 0.45, 0)
            globe_final[:, :, c] += atmo_color[c] * outer_glow * 0.85

        scene = base_scene.copy()
        scene[gy0:gy1, gx0:gx1] = np.clip(
            scene[gy0:gy1, gx0:gx1] * (1.0 - alpha_blend) + globe_final * alpha_blend, 0, 255
        ).astype(np.uint8)

        # PIL 描画
        pil_img = Image.fromarray(scene)
        draw = ImageDraw.Draw(pil_img, "RGBA")

        # 軌道ライン描画
        if trails:
            for trail in trails:
                pts = trail.get("points", [])
                t_color = trail.get("color", "#38BDF8")
                r_val = int(t_color[1:3], 16)
                g_val = int(t_color[3:5], 16)
                b_val = int(t_color[5:7], 16)

                prev_pt = None
                for pt in pts:
                    sx_p, sy_p, z_p = project_3d(pt[0], pt[1], pt[2], center_lat, curr_lon, globe_cx, globe_cy, globe_radius)
                    if z_p > -0.05:
                        if prev_pt and prev_pt[2] > -0.05:
                            alpha_line = 180 if z_p > 0.1 else 70
                            draw.line([(prev_pt[0], prev_pt[1]), (sx_p, sy_p)], fill=(r_val, g_val, b_val, alpha_line), width=2)
                        prev_pt = (sx_p, sy_p, z_p)
                    else:
                        prev_pt = None

        # マーカー描画 ＋ 電波パルスアニメーション
        pulse_phase = (f_idx % 6) / 6.0
        if markers:
            for m in markers:
                m_lat = m["lat"]
                m_lon = m["lon"]
                m_alt = m.get("alt_km", 420.0)
                m_col = m.get("color", "#38BDF8")
                is_main = m.get("is_main", False)
                
                sx_m, sy_m, z_m = project_3d(m_lat, m_lon, m_alt, center_lat, curr_lon, globe_cx, globe_cy, globe_radius)
                if z_m > -0.08:
                    m_r = int(m_col[1:3], 16)
                    m_g = int(m_col[3:5], 16)
                    m_b = int(m_col[5:7], 16)
                    base_sz = m.get("size", 6)

                    # パルス電波リング（メイン衛星）
                    if is_main:
                        p_rad = 10 + pulse_phase * 22
                        p_alpha = int((1.0 - pulse_phase) * 220)
                        draw.ellipse([sx_m - p_rad, sy_m - p_rad, sx_m + p_rad, sy_m + p_rad], 
                                     outline=(m_r, m_g, m_b, p_alpha), width=2)
                        draw.ellipse([sx_m - base_sz - 5, sy_m - base_sz - 5, sx_m + base_sz + 5, sy_m + base_sz + 5],
                                     fill=(m_r, m_g, m_b, 80))

                    # 本体
                    draw.ellipse([sx_m - base_sz, sy_m - base_sz, sx_m + base_sz, sy_m + base_sz],
                                 fill=(m_r, m_g, m_b, 255), outline=(255, 255, 255, 240), width=2)

                    if m.get("name"):
                        font_label = ImageFont.truetype(FONT_PATH_TITLE, 13)
                        draw.text((sx_m + base_sz + 8, sy_m - 8), m["name"], font=font_label, fill=(255, 255, 255, 240))

        # HUD描画
        hud_x, hud_y, hud_w, hud_h = 44, 44, 380, height - 88
        draw.rounded_rectangle([hud_x, hud_y, hud_x + hud_w, hud_y + hud_h], radius=16,
                               fill=(11, 15, 25, 210), outline=(56, 189, 248, 80), width=2)

        # バッジ
        font_badge = ImageFont.truetype(FONT_PATH_TITLE, 11)
        b_r, b_g, b_b = int(badge_color[1:3], 16), int(badge_color[3:5], 16), int(badge_color[5:7], 16)
        draw.rounded_rectangle([hud_x + 24, hud_y + 24, hud_x + 190, hud_y + 48], radius=6,
                               fill=(b_r, b_g, b_b, 40), outline=(b_r, b_g, b_b, 180), width=1)
        draw.ellipse([hud_x + 34, hud_y + 33, hud_x + 40, hud_y + 39], fill=(b_r, b_g, b_b, 255))
        draw.text((hud_x + 48, hud_y + 28), badge, font=font_badge, fill=(b_r, b_g, b_b, 255))

        # タイトル
        font_title = ImageFont.truetype(FONT_PATH_TITLE, 19)
        if len(title) > 22 and " • " in title:
            parts = title.split(" • ", 1)
            draw.text((hud_x + 24, hud_y + 60), parts[0], font=font_title, fill=(255, 255, 255, 255))
            draw.text((hud_x + 24, hud_y + 88), parts[1], font=font_title, fill=(56, 189, 248, 255))
            metric_start_y = hud_y + 130
        else:
            draw.text((hud_x + 24, hud_y + 64), title, font=font_title, fill=(255, 255, 255, 255))
            metric_start_y = hud_y + 115

        draw.line([(hud_x + 24, metric_start_y), (hud_x + hud_w - 24, metric_start_y)], fill=(30, 41, 59, 200), width=1)

        # メトリクス
        if metrics:
            font_m_label = ImageFont.truetype(FONT_PATH_BODY, 12)
            font_m_val = ImageFont.truetype(FONT_PATH_TITLE, 15)
            cur_y = metric_start_y + 14

            for item in metrics:
                m_label = item.get("label", "")
                m_val = item.get("value", "")
                m_color = item.get("color", "#F8FAFC")
                val_r, val_g, val_b = int(m_color[1:3], 16), int(m_color[3:5], 16), int(m_color[5:7], 16)

                draw.rounded_rectangle([hud_x + 24, cur_y, hud_x + hud_w - 24, cur_y + 56], radius=8,
                                       fill=(15, 23, 42, 160), outline=(30, 41, 59, 140), width=1)
                draw.text((hud_x + 36, cur_y + 8), m_label, font=font_m_label, fill=(148, 163, 184, 255))
                draw.text((hud_x + 36, cur_y + 27), m_val, font=font_m_val, fill=(val_r, val_g, val_b, 255))
                cur_y += 66

        font_brand = ImageFont.truetype(FONT_PATH_TITLE, 14)
        draw.text((hud_x + 24, hud_y + hud_h - 40), f">>> {site_url.upper()}", font=font_brand, fill=(56, 189, 248, 255))

        # REC インジケータ
        draw.ellipse([width - 240, 40, width - 228, 52], fill=(239, 68, 68, 255))
        font_rec = ImageFont.truetype(FONT_PATH_TITLE, 12)
        draw.text((width - 222, 38), "LIVE 3D SIMULATION", font=font_rec, fill=(241, 245, 249, 240))

        # フレームリサイズしてメモリ/ファイルサイズ最適化 (800x450: Xに最適・軽量・高精細)
        frame_resized = pil_img.resize((800, 450), Image.Resampling.LANCZOS)
        frames.append(frame_resized)

    # 出力保存 (MP4 動画 または GIF アニメーション)
    if out_path.lower().endswith('.mp4'):
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        vw = cv2.VideoWriter(out_path, fourcc, fps, (800, 450))
        for f in frames:
            arr = cv2.cvtColor(np.array(f), cv2.COLOR_RGB2BGR)
            vw.write(arr)
        vw.release()
    else:
        duration_ms = int(1000 / fps)
        frames[0].save(
            out_path,
            save_all=True,
            append_images=frames[1:],
            duration=duration_ms,
            loop=0,
            optimize=True
        )
    return out_path

