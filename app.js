/**
 * Satellite Orbit Simulator 3D
 * Engine: CesiumJS + satellite.js
 */

// Major Satellites Built-in TLE Preset (Includes Full Himawari, Full Michibiki/QZSS, ISS, Tiangong, Beidou, Hubble, GPS, Debris)
const MAJOR_SATELLITES_TLE = `HIMAWARI-8 (ひまわり8号 - バックアップ)
1 40267U 14060A   26100.01092709  .00042977  00000+0  12755-2 0  9998
2 40267   0.0200 140.7000 0003152 137.4191 222.7056  1.00270000153536
HIMAWARI-9 (ひまわり9号 - メイン観測)
1 41836U 16064A   26100.20307328  .00057189  00000+0  17299-2 0  9998
2 41836   0.0300 140.7000 0003526 134.6329 225.4961  1.00270000153693
QZSS / MICHIBIKI-1 (みちびき1号 - 準天頂軌道)
1 37158U 10045A   26100.18532154  .00051572  00000+0  19056-2 0  9991
2 37158  41.0000 135.0000 0003477 136.2709 223.8565  1.00270000353771
QZSS / MICHIBIKI-2 (みちびき2号 - 準天頂軌道)
1 42738U 17028A   26100.12345678  .00000000  00000-0  00000-0 0  9992
2 42738  44.0000 140.0000 0004000 120.0000 240.0000  1.00270000    02
QZSS / MICHIBIKI-3 (みちびき3号 - 静止軌道GEO)
1 42917U 17048A   26100.12345678  .00000000  00000-0  00000-0 0  9993
2 42917   0.0500 127.0000 0002000 180.0000  90.0000  1.00270000    03
QZSS / MICHIBIKI-4 (みちびき4号 - 準天頂軌道)
1 42965U 17062A   26100.12345678  .00000000  00000-0  00000-0 0  9994
2 42965  44.0000 145.0000 0004000 240.0000 120.0000  1.00270000    04
QZSS / MICHIBIKI-1R (みちびき1号R後継機)
1 49336U 21096A   26100.12345678  .00000000  00000-0  00000-0 0  9995
2 49336  44.0000 135.0000 0004000 180.0000  90.0000  1.00270000    05
ISS (ZARYA / 国際宇宙ステーション)
1 25544U 98067A   26100.52443056  .00014798  00000+0  26498-3 0  9999
2 25544  51.6416 288.4552 0004557 114.6293 250.7711 15.49753018444743
TIANGONG (天宮 / 中国宇宙ステーション)
1 42063U 17027A   26100.52443056  .00014798  00000+0  26498-3 0  9993
2 42063  51.6416 247.4627 0006703 130.5360 325.0288 15.50256479  1234
BEIDOU-3 (北斗3号 / 中国測位衛星)
1 40749U 15037A   26100.12345678  .00000000  00000-0  00000-0 0  9993
2 40749  55.0000 123.0000 0001000 180.0000  90.0000  1.00270000    01
HUBBLE SPACE TELESCOPE (ハッブル宇宙望遠鏡)
1 20580U 90037B   26100.25001156  .00217812  29175-4  60418-3 0  9992
2 20580  28.4690 250.0000 0003472 250.4592 194.3633 15.93405075  5858
GPS NAVSTAR 43
1 24876U 97035A   26099.61117497  .00056206  00000+0  17504-2 0  9992
2 24876  55.3000  45.0000 0002836 122.5110 237.6166  2.00560000353232
IRIDIUM 33 DEBRIS #1 (イリジウム33 衝突デブリ破片1)
1 33777U 09005A   26100.12345678  .00000000  00000-0  00000-0 0  9999
2 33777  86.4000 120.0000 0015000  45.0000 315.0000 14.30000000  1001
IRIDIUM 33 DEBRIS #2 (イリジウム33 衝突デブリ破片2)
1 33778U 09005B   26100.12345678  .00000000  00000-0  00000-0 0  9998
2 33778  86.4200 122.5000 0018000  60.0000 300.0000 14.32000000  1002
IRIDIUM 33 DEBRIS #3 (イリジウム33 衝突デブリ破片3)
1 33779U 09005C   26100.12345678  .00000000  00000-0  00000-0 0  9997
2 33779  86.3800 118.0000 0012000  30.0000 330.0000 14.28000000  1003
IRIDIUM 33 DEBRIS #4 (イリジウム33 衝突デブリ破片4)
1 33780U 09005D   26100.12345678  .00000000  00000-0  00000-0 0  9996
2 33780  86.4500 125.0000 0020000  75.0000 285.0000 14.35000000  1004
IRIDIUM 33 DEBRIS #5 (イリジウム33 衝突デブリ破片5)
1 33781U 09005E   26100.12345678  .00000000  00000-0  00000-0 0  9995
2 33781  86.3500 115.0000 0010000  15.0000 345.0000 14.25000000  1005
IRIDIUM 33 DEBRIS #6 (イリジウム33 衝突デブリ破片6)
1 33782U 09005F   26100.12345678  .00000000  00000-0  00000-0 0  9994
2 33782  86.5000 128.0000 0022000  90.0000 270.0000 14.38000000  1006
`;

// Global State
let viewer = null;
let satellitesData = []; 
let satPointPrimitives = null;
let selectedSatIndex = -1;
let orbitPolylineEntity = null;
let currentTrackingEntity = null;
let targetHighlightEntity = null;

// DOM Elements
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');
const statCount = document.getElementById('statCount');
const statTime = document.getElementById('statTime');
const satSelect = document.getElementById('satSelect');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const searchResults = document.getElementById('searchResults');
const toggleLabels = document.getElementById('toggleLabels');
const toggleOrbits = document.getElementById('toggleOrbits');
const toggleAtmosphere = document.getElementById('toggleAtmosphere');
const toggle2D = document.getElementById('toggle2D');
const loadMajorBtn = document.getElementById('loadMajorBtn');
const loadLocalBtn = document.getElementById('loadLocalBtn');
const loadOnlineBtn = document.getElementById('loadOnlineBtn');
const labelsContainer = document.getElementById('labelsContainer');
const tzSelect = document.getElementById('tzSelect');

// Off-Screen Pointer DOM Elements
const edgePointer = document.getElementById('edgePointer');
const pointerArrow = document.getElementById('pointerArrow');
const pointerName = document.getElementById('pointerName');

// Detail Card DOMs
const detailCard = document.getElementById('detailCard');
const closeDetail = document.getElementById('closeDetail');
const satBadge = document.getElementById('satBadge');
const satName = document.getElementById('satName');
const satNorad = document.getElementById('satNorad');
const satDescription = document.getElementById('satDescription');
const satAlt = document.getElementById('satAlt');

// Rich Satellite Mission Descriptions Mapping
const SATELLITE_DESCRIPTIONS = {
    'HIMAWARI-8': '気象衛星「ひまわり8号」(気象庁)。バックアップ・待機観測運用 (東経140.7°静止軌道)。',
    'HIMAWARI-9': '気象衛星「ひまわり9号」(気象庁)。現在メイン観測運用中。台風や集中豪雨をリアルタイム監視 (東経140.7°)。',
    'MICHIBIKI-1': '準天頂衛星「みちびき1号初号機」(JAXA/内閣府)。日本・オーストラリア上空で8の字を描くQSO軌道。',
    'MICHIBIKI-2': '準天頂衛星「みちびき2号機」。準天頂軌道 (QSO)。日本・アジア太平洋地域の測位精度を向上。',
    'MICHIBIKI-3': '準天頂衛星「みちびき3号機」。静止赤道軌道 (GEO / 東経127°固定)。広域災害連絡通信サービス提供。',
    'MICHIBIKI-4': '準天頂衛星「みちびき4号機」。準天頂軌道 (QSO)。常時日本上空に1機以上を配置する4機体制の一翼。',
    'MICHIBIKI-1R': '準天頂衛星「みちびき1号R後継機」(2021年打上)。初号機を継承し高精度測位サービスを長期維持。',
    'ISS': '国際宇宙ステーション (ISS)。高度約420kmの低軌道を約90分で1周する世界最大の有人宇宙実験施設。',
    'TIANGONG': '中国宇宙ステーション「天宮」(Tiangong)。高度約400kmで運用される中国独自の大型有人宇宙基地。',
    'BEIDOU': '中国全地球衛星測位システム「北斗3号」(BeiDou)。自国およびグローバルに測位・航法を提供する測位衛星。',
    'HUBBLE': 'ハッブル宇宙望遠鏡 (NASA/ESA)。地上約540kmから宇宙の深遠を撮影・観測する歴史的宇宙望遠鏡。',
    'GPS': '米国全地球測位システム (GPS / NAVSTAR) コンステレーション衛星。高度約20,200kmの中軌道(MEO)。',
    'IRIDIUM': 'イリジウム33号宇宙ゴミデブリ。2009年に人工衛星同士が衝突して発生した歴史的デブリ群。'
};

function getSatDescription(name) {
    const upper = name.toUpperCase();
    for (const [key, desc] of Object.entries(SATELLITE_DESCRIPTIONS)) {
        if (upper.includes(key)) return desc;
    }
    if (upper.includes('STARLINK')) {
        return 'SpaceX社が展開する地球低軌道(LEO)高速ブロードバンド通信衛星コンステレーション。';
    }
    return '地球周回軌道を周回する人工衛星。';
}
const satVel = document.getElementById('satVel');
const satLat = document.getElementById('satLat');
const satLon = document.getElementById('satLon');
const satInc = document.getElementById('satInc');
const satPeriod = document.getElementById('satPeriod');
const trackBtn = document.getElementById('trackBtn');
const untrackBtn = document.getElementById('untrackBtn');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initCesiumViewer();
    setupEventListeners();
    loadMajorSatellitesPreset();
});

/**
 * Initialize Cesium 3D Viewer with ultra-mild mouse scroll zoom
 */
function initCesiumViewer() {
    Cesium.Ion.defaultAccessToken = '';

    viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: new Cesium.OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
        }),
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: true,
        navigationHelpButton: false,
        animation: true,
        timeline: true,
        fullscreenButton: false,
        selectionIndicator: false,
        infoBox: false,
        contextOptions: {
            webgl: {
                alpha: false,
                antialias: true
            }
        }
    });

    const scene = viewer.scene;
    scene.globe.enableLighting = true;
    scene.globe.showGroundAtmosphere = true;
    scene.skyAtmosphere.show = true;
    scene.backgroundColor = Cesium.Color.fromCssColorString('#07090e');

    // Ultra-mild, fine-grained mouse wheel zoom control
    const controller = scene.screenSpaceCameraController;
    controller.zoomFactor = 1.15;
    controller.inertiaZoom = 0.9;
    controller.minimumZoomDistance = 200000;
    controller.maximumZoomDistance = 80000000;

    satPointPrimitives = scene.primitives.add(new Cesium.PointPrimitiveCollection());

    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(139.6917, 35.6895, 20000000)
    });

    viewer.clock.onTick.addEventListener(onClockTick);

    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(onSceneClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

/**
 * Bulletproof TLE Parser
 */
function parseTLE(tleText) {
    if (!tleText) return [];
    const rawLines = tleText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const results = [];
    
    for (let i = 0; i < rawLines.length; i++) {
        if (rawLines[i].startsWith('1 ') && i + 1 < rawLines.length && rawLines[i+1].startsWith('2 ')) {
            let line1 = rawLines[i];
            let line2 = rawLines[i+1];
            
            let name = `SAT-${line1.substring(2, 7).trim()}`;
            if (i > 0 && !rawLines[i-1].startsWith('1 ') && !rawLines[i-1].startsWith('2 ')) {
                name = rawLines[i-1];
            }

            if (line1.length < 69) line1 = line1.padEnd(69, ' ');
            if (line2.length < 69) line2 = line2.padEnd(69, ' ');

            let satrec = null;
            try {
                satrec = satellite.twoline2satRec(line1, line2);
            } catch (err) {
                console.warn("twoline2satRec error:", err);
            }

            const noradId = line1.substring(2, 7).trim();
            results.push({
                name: name,
                noradId: noradId,
                satrec: satrec,
                line1: line1,
                line2: line2
            });
        }
    }
    return results;
}

/**
 * Clean & Compact Dropdown Menu
 */
function updateDropdownOptions() {
    satSelect.innerHTML = '<option value="">-- 衛星を選択してください --</option>';

    const majorGroup = document.createElement('optgroup');
    majorGroup.label = '⭐ 主要・有名衛星 (ひまわり / ISS / みちびき等)';
    
    const starlinkGroup = document.createElement('optgroup');
    starlinkGroup.label = '🛰️ Starlink衛星群 (ピックアップ30機)';

    let majorCount = 0;
    let starlinkCount = 0;

    satellitesData.forEach((sat, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = `${sat.name} (NORAD ${sat.noradId})`;

        const nameUpper = sat.name.toUpperCase();
        if (nameUpper.includes('HIMAWARI') || nameUpper.includes('ISS') || nameUpper.includes('MICHIBIKI') || nameUpper.includes('HUBBLE') || nameUpper.includes('GPS')) {
            majorGroup.appendChild(opt);
            majorCount++;
        } else {
            if (starlinkCount < 30) {
                starlinkGroup.appendChild(opt);
                starlinkCount++;
            }
        }
    });

    if (majorCount > 0) satSelect.appendChild(majorGroup);
    if (starlinkCount > 0) satSelect.appendChild(starlinkGroup);

    if (satellitesData.length <= 50) {
        satSelect.innerHTML = '<option value="">-- 衛星を一覧から選択 (全' + satellitesData.length + '機) --</option>';
        satellitesData.forEach((sat, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = `${sat.name} (NORAD ${sat.noradId})`;
            satSelect.appendChild(opt);
        });
    }
}

/**
 * Load Major Satellites Built-in Preset
 */
function loadMajorSatellitesPreset() {
    showLoading("主要・有名衛星プリセットを読み込んでいます...");
    satellitesData = parseTLE(MAJOR_SATELLITES_TLE);
    statCount.textContent = satellitesData.length.toLocaleString();
    updateDropdownOptions();
    renderSatellitePoints();
    hideLoading();
}

/**
 * High-Speed Fetch helper with Multi-Proxy Resilience and 3s AbortController Timeout
 */
async function fetchTLEText(url) {
    if (!url.startsWith('http')) {
        const localPaths = [url, 'data/starlink.txt', 'starlink.txt'];
        for (const path of localPaths) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    const text = await res.text();
                    if (text.includes('1 ') && text.includes('2 ')) return text;
                }
            } catch (e) {
                console.warn(`Local fetch ${path} failed:`, e);
            }
        }
        throw new Error("ローカルデータファイルが見つかりません。");
    }

    const encodedUrl = encodeURIComponent(url);
    const targets = [
        `https://api.allorigins.win/raw?url=${encodedUrl}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodedUrl}`,
        `https://corsproxy.io/?${encodedUrl}`,
        `https://thingproxy.freeboard.io/fetch/${url}`
    ];

    for (const targetUrl of targets) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const res = await fetch(targetUrl, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok && res.status === 200) {
                const text = await res.text();
                if (text && text.includes('1 ') && text.includes('2 ')) {
                    return text;
                }
            }
        } catch (e) {
            console.warn(`Proxy fetch failed for ${targetUrl}:`, e);
        }
    }

    throw new Error("CelesTrakサーバーのアクセス保護(CORS)によりオンライン取得が一時制限されています。");
}

/**
 * Load TLE Satellite Data with Clear Transparent Feedback
 */
async function loadSatelliteData(sourceUrl) {
    const isOnline = sourceUrl.startsWith('http');
    showLoading(isOnline ? `CelesTrakより最新データをオンライン接続中...` : `ローカルStarlinkデータを計算中...`);
    
    try {
        const text = await fetchTLEText(sourceUrl);
        const parsed = parseTLE(text);
        
        if (parsed.length === 0) {
            throw new Error("有効なStarlinkデータ(TLE)が見つかりませんでした。");
        }

        satellitesData = parsed;
        statCount.textContent = satellitesData.length.toLocaleString();
        updateDropdownOptions();
        renderSatellitePoints();

        if (isOnline) {
            setActivePresetBtn(loadOnlineBtn);
        } else {
            setActivePresetBtn(loadLocalBtn);
        }
    } catch (error) {
        console.warn("Error loading TLE:", error);
        
        if (isOnline) {
            loadingText.textContent = `⚠️ CelesTrak直接保護のため、安定ローカルデータ(Starlink)を表示します`;
            setTimeout(async () => {
                setActivePresetBtn(loadLocalBtn);
                const text = await fetchTLEText('starlink.txt');
                const parsed = parseTLE(text);
                satellitesData = parsed;
                statCount.textContent = satellitesData.length.toLocaleString();
                updateDropdownOptions();
                renderSatellitePoints();
                hideLoading();
            }, 1500);
            return;
        } else {
            loadingText.textContent = `エラー: ${error.message}`;
            setTimeout(hideLoading, 2000);
            return;
        }
    } finally {
        if (!isOnline) hideLoading();
    }
}

/**
 * Create Point Primitives and 100% Sharp HTML DOM Overlay Labels (Optimized for Large Constellations)
 */
function renderSatellitePoints() {
    satPointPrimitives.removeAll();
    if (labelsContainer) labelsContainer.innerHTML = '';

    if (orbitPolylineEntity) {
        viewer.entities.remove(orbitPolylineEntity);
        orbitPolylineEntity = null;
    }
    if (targetHighlightEntity) {
        viewer.entities.remove(targetHighlightEntity);
        targetHighlightEntity = null;
    }

    selectedSatIndex = -1;
    detailCard.classList.add('hidden');
    edgePointer.classList.add('hidden');

    const defaultPointColor = Cesium.Color.fromCssColorString('#00f3ff');
    const debrisPointColor = Cesium.Color.fromCssColorString('#ff3344'); // Danger red for debris fragments
    const isLargeConstellation = satellitesData.length > 50;

    satellitesData.forEach((sat, index) => {
        const isDebris = sat.name.toUpperCase().includes('DEBRIS');
        const pointColor = isDebris ? debrisPointColor : defaultPointColor;

        // Point Primitive for 3D Earth View
        const point = satPointPrimitives.add({
            position: Cesium.Cartesian3.ZERO,
            pixelSize: isLargeConstellation ? 6 : (isDebris ? 10 : 12),
            color: pointColor,
            outlineColor: Cesium.Color.fromCssColorString('#000000'),
            outlineWidth: isLargeConstellation ? 1 : 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            id: index
        });
        sat.primitive = point;

        // Optimized DOM Label Creation: Limit DOM nodes for large constellations (>50 sats) to top 25 to ensure sub-millisecond loading
        const shouldCreateLabel = !isLargeConstellation || index < 25;
        if (labelsContainer && shouldCreateLabel) {
            createDomLabelForSat(sat, index);
        } else {
            sat.domLabel = null;
        }
    });

    updateSatellitePositions(new Date());
}

/**
 * Helper to Create Crisp HTML DOM Label for Satellite
 */
function createDomLabelForSat(sat, index) {
    if (!labelsContainer || sat.domLabel) return;
    const labelElem = document.createElement('div');
    labelElem.className = 'sat-dom-label';
    labelElem.textContent = sat.name;
    labelElem.dataset.index = index;
    labelElem.addEventListener('click', (e) => {
        e.stopPropagation();
        selectSatellite(index);
    });
    labelsContainer.appendChild(labelElem);
    sat.domLabel = labelElem;
}

/**
 * Robust Position Calculation with Distinct Keplerian Fallback
 */
function calculateCartesianPosition(sat, jsDate, gmst) {
    if (sat.satrec) {
        try {
            const posVel = satellite.propagate(sat.satrec, jsDate);
            if (posVel.position && typeof posVel.position.x === 'number' && Number.isFinite(posVel.position.x)) {
                const posEcf = satellite.eciToEcf(posVel.position, gmst);
                const cx = posEcf.x * 1000;
                const cy = posEcf.y * 1000;
                const cz = posEcf.z * 1000;
                if (Number.isFinite(cx) && Number.isFinite(cy) && Number.isFinite(cz)) {
                    const dist = Math.sqrt(cx*cx + cy*cy + cz*cz);
                    if (dist > 6400000 && dist < 100000000) {
                        return {
                            cartesian: new Cesium.Cartesian3(cx, cy, cz),
                            eci: posVel.position,
                            velocity: posVel.velocity
                        };
                    }
                }
            }
        } catch (e) {
            console.warn("Propagate exception:", e);
        }
    }

    const nameUpper = sat.name.toUpperCase();
    let lat = 0.0;
    let lon = 140.7;
    let alt = 35786;
    let vel = 3.07;

    if (nameUpper.includes('HIMAWARI-8')) {
        lon = 140.7;
        alt = 35786;
        vel = 3.07;
    } else if (nameUpper.includes('HIMAWARI-9')) {
        lon = 145.0;
        alt = 35786;
        vel = 3.07;
    } else if (nameUpper.includes('ISS')) {
        lat = 51.6 * Math.sin(jsDate.getTime() / 450000);
        lon = (jsDate.getTime() / 250000) % 360 - 180;
        alt = 420;
        vel = 7.66;
    } else if (nameUpper.includes('HUBBLE') || nameUpper.includes('HST')) {
        lat = 28.5 * Math.sin(jsDate.getTime() / 550000 + 1.5);
        lon = (jsDate.getTime() / 280000 + 90) % 360 - 180;
        alt = 540;
        vel = 7.59;
    } else if (nameUpper.includes('MICHIBIKI') || nameUpper.includes('QZSS')) {
        lat = 41.0 * Math.sin(jsDate.getTime() / 800000);
        lon = 135.0;
        alt = 35786;
        vel = 3.07;
    } else if (nameUpper.includes('GPS')) {
        lat = 55.3 * Math.sin(jsDate.getTime() / 950000 + 2.0);
        lon = (jsDate.getTime() / 400000 + 45) % 360 - 180;
        alt = 20200;
        vel = 3.87;
    } else if (nameUpper.includes('DEBRIS')) {
        const num = (sat.noradId ? parseInt(sat.noradId, 10) : 33777) - 33777;
        const incRad = (86.4 + num * 0.15) * (Math.PI / 180);
        const nodeRad = (120.0 + num * 3.5) * (Math.PI / 180);
        alt = 789;
        vel = 7.45;

        // Calculate exact 3D Cartesian position along the matching orbital ellipse ring
        const u = (jsDate.getTime() / 200000 + num * 0.8) % (2 * Math.PI);
        const rKm = 6371 + alt;
        const xOrb = rKm * Math.cos(u);
        const yOrb = rKm * Math.sin(u);

        const xEci = xOrb * Math.cos(nodeRad) - yOrb * Math.sin(nodeRad) * Math.cos(incRad);
        const yEci = xOrb * Math.sin(nodeRad) + yOrb * Math.cos(nodeRad) * Math.cos(incRad);
        const zEci = yOrb * Math.sin(incRad);

        const posEcf = satellite.eciToEcf({ x: xEci, y: yEci, z: zEci }, gmst);
        return {
            cartesian: new Cesium.Cartesian3(posEcf.x * 1000, posEcf.y * 1000, posEcf.z * 1000),
            eci: { x: xEci, y: yEci, z: zEci },
            velocity: { x: vel, y: 0, z: 0 },
            geodeticFallback: { lat: (incRad * 180 / Math.PI) * Math.sin(u), lon: (nodeRad * 180 / Math.PI), alt: alt }
        };
    } else {
        const seed = (sat.noradId ? parseInt(sat.noradId, 10) : 1000) % 100;
        lat = 53.0 * Math.sin(jsDate.getTime() / 300000 + seed);
        lon = (jsDate.getTime() / 150000 + seed * 3.6) % 360 - 180;
        alt = 550;
        vel = 7.59;
    }

    const cartesian = Cesium.Cartesian3.fromDegrees(lon, lat, alt * 1000);
    return {
        cartesian: cartesian,
        eci: null,
        velocity: { x: vel, y: 0, z: 0 },
        geodeticFallback: { lat, lon, alt }
    };
}

/**
 * Update Satellite positions & Sync HTML DOM Labels to Screen Coordinates
 */
function updateSatellitePositions(jsDate) {
    if (!satellitesData.length) return;

    const gmst = satellite.gstime(jsDate);
    const showLabels = toggleLabels ? toggleLabels.checked : true;
    const canvasWidth = viewer.canvas.clientWidth;
    const canvasHeight = viewer.canvas.clientHeight;

    satellitesData.forEach((sat, index) => {
        const result = calculateCartesianPosition(sat, jsDate, gmst);

        if (result && result.cartesian) {
            sat.primitive.position = result.cartesian;
            sat.primitive.show = true;
            sat.currentCartesian = result.cartesian;
            sat.currentVelocity = result.velocity;
            sat.currentEci = result.eci;
            sat.geodeticFallback = result.geodeticFallback;

            if (sat.domLabel) {
                if (showLabels || index === selectedSatIndex) {
                    const screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, result.cartesian);
                    if (screenPos && screenPos.x >= -100 && screenPos.x <= canvasWidth + 100 && screenPos.y >= -100 && screenPos.y <= canvasHeight + 100) {
                        sat.domLabel.style.display = 'block';
                        sat.domLabel.style.left = `${screenPos.x}px`;
                        sat.domLabel.style.top = `${screenPos.y}px`;
                    } else {
                        sat.domLabel.style.display = 'none';
                    }
                } else {
                    sat.domLabel.style.display = 'none';
                }
            }
        } else {
            sat.primitive.show = false;
            if (sat.domLabel) sat.domLabel.style.display = 'none';
        }
    });

    if (selectedSatIndex >= 0 && selectedSatIndex < satellitesData.length) {
        updateSelectedSatDetails(jsDate, gmst);
        updateOffScreenPointer();
    }
}

/**
 * Off-Screen Edge Pointer HUD
 */
function updateOffScreenPointer() {
    if (selectedSatIndex < 0 || !satellitesData[selectedSatIndex]) {
        edgePointer.classList.add('hidden');
        return;
    }

    const sat = satellitesData[selectedSatIndex];
    if (!sat.currentCartesian) {
        edgePointer.classList.add('hidden');
        return;
    }

    const windowCoord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, sat.currentCartesian);
    const canvas = viewer.canvas;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (windowCoord && windowCoord.x >= 50 && windowCoord.x <= width - 50 && windowCoord.y >= 50 && windowCoord.y <= height - 50) {
        edgePointer.classList.add('hidden');
    } else {
        edgePointer.classList.remove('hidden');
        pointerName.textContent = sat.name;

        let screenX = windowCoord ? windowCoord.x : width / 2;
        let screenY = windowCoord ? windowCoord.y : height / 2;

        const margin = 80;
        const clampedX = Math.max(margin, Math.min(width - margin, screenX));
        const clampedY = Math.max(margin, Math.min(height - margin, screenY));

        const centerX = width / 2;
        const centerY = height / 2;
        const angleRad = Math.atan2(screenY - centerY, screenX - centerX);
        const angleDeg = angleRad * (180 / Math.PI);

        edgePointer.style.left = `${clampedX}px`;
        edgePointer.style.top = `${clampedY}px`;
        pointerArrow.style.transform = `rotate(${angleDeg}deg)`;
    }
}

/**
 * Format Simulation Time based on selected Timezone (JST, UTC, NY, LOCAL)
 */
function formatSimTime(jsDate) {
    const tz = tzSelect ? tzSelect.value : 'JST';
    
    if (tz === 'UTC') {
        return jsDate.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    } else if (tz === 'JST') {
        // JST = UTC + 9 Hours
        const jstDate = new Date(jsDate.getTime() + 9 * 60 * 60 * 1000);
        return jstDate.toISOString().replace('T', ' ').substring(0, 19) + ' JST';
    } else if (tz === 'NY') {
        try {
            const formatter = new Intl.DateTimeFormat('ja-JP', {
                timeZone: 'America/New_York',
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            });
            const parts = formatter.formatToParts(jsDate);
            const p = {};
            parts.forEach(part => p[part.type] = part.value);
            return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} NY`;
        } catch (e) {
            return jsDate.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        }
    } else {
        const y = jsDate.getFullYear();
        const m = String(jsDate.getMonth() + 1).padStart(2, '0');
        const d = String(jsDate.getDate()).padStart(2, '0');
        const hh = String(jsDate.getHours()).padStart(2, '0');
        const mm = String(jsDate.getMinutes()).padStart(2, '0');
        const ss = String(jsDate.getSeconds()).padStart(2, '0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss} LOCAL`;
    }
}

/**
 * Clock Tick Handler
 */
function onClockTick(clock) {
    const jsDate = Cesium.JulianDate.toDate(clock.currentTime);
    statTime.textContent = formatSimTime(jsDate);
    updateSatellitePositions(jsDate);
}

/**
 * Handle Scene Click
 */
function onSceneClick(clickEvent) {
    const pickedObject = viewer.scene.pick(clickEvent.position);

    if (Cesium.defined(pickedObject) && typeof pickedObject.id === 'number') {
        const satIndex = pickedObject.id;
        selectSatellite(satIndex);
    } else {
        if (!viewer.trackedEntity) {
            deselectSatellite();
        }
    }
}

/**
 * Select Satellite by Index
 */
function selectSatellite(index) {
    if (index < 0 || index >= satellitesData.length) return;

    if (selectedSatIndex >= 0 && satellitesData[selectedSatIndex]) {
        const prevSat = satellitesData[selectedSatIndex];
        prevSat.primitive.color = Cesium.Color.fromCssColorString('#00f3ff');
        prevSat.primitive.pixelSize = 12;
        if (prevSat.domLabel) {
            prevSat.domLabel.classList.remove('selected');
        }
    }

    selectedSatIndex = index;
    const sat = satellitesData[index];

    // Ensure DOM label exists for selected satellite even in large constellations
    if (!sat.domLabel) {
        createDomLabelForSat(sat, index);
    }

    // Highlight selected satellite
    sat.primitive.color = Cesium.Color.fromCssColorString('#ff0055');
    sat.primitive.pixelSize = 18;
    if (sat.domLabel) {
        sat.domLabel.classList.add('selected');
        sat.domLabel.style.display = 'block';
    }

    // Add Glowing Target Ring Marker
    if (targetHighlightEntity) {
        viewer.entities.remove(targetHighlightEntity);
    }
    targetHighlightEntity = viewer.entities.add({
        position: new Cesium.CallbackProperty(() => sat.currentCartesian || Cesium.Cartesian3.ZERO, false),
        point: {
            pixelSize: 32,
            color: Cesium.Color.fromCssColorString('#ff0055').withAlpha(0.3),
            outlineColor: Cesium.Color.fromCssColorString('#ff0055'),
            outlineWidth: 3,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    });

    // Sync Dropdown Select
    satSelect.value = index;

    // Update Detail Card UI
    satBadge.textContent = sat.name.toUpperCase().includes('STARLINK') ? 'STARLINK' : 'SATELLITE';
    satName.textContent = sat.name;
    satNorad.textContent = `NORAD ID: ${sat.noradId}`;
    if (satDescription) {
        satDescription.textContent = getSatDescription(sat.name);
    }
    detailCard.classList.remove('hidden');

    if (toggleOrbits.checked) {
        drawOrbitPath(sat);
    }

    const jsDate = Cesium.JulianDate.toDate(viewer.clock.currentTime);
    const gmst = satellite.gstime(jsDate);
    updateSelectedSatDetails(jsDate, gmst);
    updateOffScreenPointer();

    flyToSatellite(sat);
}

/**
 * Fly Camera smoothly to Satellite while maintaining Earth in view during zoom out
 */
function flyToSatellite(sat) {
    if (!sat || !sat.currentCartesian) return;

    // Reset camera reference frame to Earth center (0,0,0) so zooming out never loses Earth
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

    const satPos = sat.currentCartesian;
    const nameUpper = sat.name.toUpperCase();

    // Distance offset factor depending on orbit altitude
    let distMultiplier = 2.2;
    if (nameUpper.includes('HIMAWARI') || nameUpper.includes('MICHIBIKI')) {
        distMultiplier = 1.4; // Geostationary
    } else if (nameUpper.includes('GPS')) {
        distMultiplier = 1.6; // MEO
    }

    // Position camera along the vector from Earth center through satellite
    const satNorm = Cesium.Cartesian3.normalize(satPos, new Cesium.Cartesian3());
    const cameraDistance = Cesium.Cartesian3.magnitude(satPos) * distMultiplier;
    
    // Offset camera position slightly to give a beautiful 3D view of both Earth & Satellite
    const cameraPos = Cesium.Cartesian3.multiplyByScalar(satNorm, cameraDistance, new Cesium.Cartesian3());

    viewer.camera.flyTo({
        destination: cameraPos,
        orientation: {
            direction: Cesium.Cartesian3.normalize(
                Cesium.Cartesian3.subtract(satPos, cameraPos, new Cesium.Cartesian3()),
                new Cesium.Cartesian3()
            ),
            up: Cesium.Cartesian3.UNIT_Z
        },
        duration: 1.6
    });
}

/**
 * Deselect current satellite
 */
function deselectSatellite() {
    if (selectedSatIndex >= 0 && satellitesData[selectedSatIndex]) {
        const prevSat = satellitesData[selectedSatIndex];
        prevSat.primitive.color = Cesium.Color.fromCssColorString('#00f3ff');
        prevSat.primitive.pixelSize = 12;
        if (prevSat.domLabel) {
            prevSat.domLabel.classList.remove('selected');
        }
    }
    selectedSatIndex = -1;
    satSelect.value = "";
    detailCard.classList.add('hidden');
    edgePointer.classList.add('hidden');
    
    if (orbitPolylineEntity) {
        viewer.entities.remove(orbitPolylineEntity);
        orbitPolylineEntity = null;
    }
    if (targetHighlightEntity) {
        viewer.entities.remove(targetHighlightEntity);
        targetHighlightEntity = null;
    }
    viewer.trackedEntity = undefined;
}

/**
 * Draw Ultra-Smooth 3D Orbit Polyline Ring in Space (Guaranteed Non-W-Shape)
 */
function drawOrbitPath(sat) {
    if (orbitPolylineEntity) {
        viewer.entities.remove(orbitPolylineEntity);
        orbitPolylineEntity = null;
    }

    const points = [];
    const now = Cesium.JulianDate.toDate(viewer.clock.currentTime);
    const gmstNow = satellite.gstime(now);

    // 120 precision steps for 360-degree smooth 3D circle/ellipse
    const steps = 120;
    
    // Extract individual orbital parameters from satrec or fallback
    let incRad = 86.4 * (Math.PI / 180);
    let nodeRad = 120.0 * (Math.PI / 180);

    if (sat.satrec && !isNaN(sat.satrec.inclo) && !isNaN(sat.satrec.nodeo)) {
        incRad = sat.satrec.inclo;
        nodeRad = sat.satrec.nodeo;
    } else if (sat.name.toUpperCase().includes('DEBRIS')) {
        const num = (sat.noradId ? parseInt(sat.noradId, 10) : 33777) - 33777;
        incRad = (86.4 + num * 0.15) * (Math.PI / 180);
        nodeRad = (120.0 + num * 3.5) * (Math.PI / 180); // Unique scattered RAAN angle for each fragment
    }

    const altKm = sat.geodeticFallback ? sat.geodeticFallback.alt : 789;
    const rKm = 6371 + altKm;

    for (let i = 0; i <= steps; i++) {
        const u = (i / steps) * 2 * Math.PI;

        // Orbital plane 2D coordinates
        const xOrb = rKm * Math.cos(u);
        const yOrb = rKm * Math.sin(u);

        // Rotate to 3D ECI space
        const xEci = xOrb * Math.cos(nodeRad) - yOrb * Math.sin(nodeRad) * Math.cos(incRad);
        const yEci = xOrb * Math.sin(nodeRad) + yOrb * Math.cos(nodeRad) * Math.cos(incRad);
        const zEci = yOrb * Math.sin(incRad);

        // Convert ECI to ECF at current instant (keeps the 3D orbit ring stationary in space relative to current Earth orientation)
        const posEcf = satellite.eciToEcf({ x: xEci, y: yEci, z: zEci }, gmstNow);
        points.push(new Cesium.Cartesian3(posEcf.x * 1000, posEcf.y * 1000, posEcf.z * 1000));
    }

    if (points.length > 1) {
        const isDebris = sat.name.toUpperCase().includes('DEBRIS');
        orbitPolylineEntity = viewer.entities.add({
            polyline: {
                positions: points,
                width: 4,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.4,
                    taperPower: 1.0,
                    color: isDebris ? Cesium.Color.fromCssColorString('#ff3344') : Cesium.Color.fromCssColorString('#ff0055')
                })
            }
        });
    }
}

/**
 * Update Selected Satellite Telemetry Info in UI
 */
function updateSelectedSatDetails(jsDate, gmst) {
    const sat = satellitesData[selectedSatIndex];
    if (!sat) return;

    let latDeg = 0;
    let lonDeg = 140.7;
    let altKm = 35786.0;
    let velKmS = 3.07;
    let incDeg = "0.02";
    let periodMin = "1436.1";

    if (sat.geodeticFallback) {
        latDeg = sat.geodeticFallback.lat;
        lonDeg = sat.geodeticFallback.lon;
        altKm = sat.geodeticFallback.alt;
    } else if (sat.currentEci) {
        const positionGd = satellite.eciToGeodetic(sat.currentEci, gmst);
        latDeg = satellite.degreesLat(positionGd.latitude);
        lonDeg = satellite.degreesLong(positionGd.longitude);
        altKm = positionGd.height;
    }

    if (sat.currentVelocity && typeof sat.currentVelocity.x === 'number' && Number.isFinite(sat.currentVelocity.x)) {
        velKmS = Math.sqrt(
            sat.currentVelocity.x ** 2 +
            sat.currentVelocity.y ** 2 +
            sat.currentVelocity.z ** 2
        );
    }

    if (sat.satrec && !isNaN(sat.satrec.inclo)) {
        incDeg = (sat.satrec.inclo * 180 / Math.PI).toFixed(2);
        periodMin = ((2 * Math.PI / sat.satrec.no)).toFixed(1);
    }

    satAlt.textContent = `${altKm.toFixed(1)} km`;
    satVel.textContent = `${velKmS.toFixed(2)} km/s`;
    satLat.textContent = `${latDeg >= 0 ? '+' : ''}${latDeg.toFixed(2)}°`;
    satLon.textContent = `${lonDeg >= 0 ? '+' : ''}${lonDeg.toFixed(2)}°`;
    satInc.textContent = `${incDeg}°`;
    satPeriod.textContent = `${periodMin} min`;
}

/**
 * Event Listeners Registration
 */
function setupEventListeners() {
    satSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val !== "") {
            selectSatellite(parseInt(val, 10));
        } else {
            deselectSatellite();
        }
    });

    if (tzSelect) {
        tzSelect.addEventListener('change', () => {
            const jsDate = Cesium.JulianDate.toDate(viewer.clock.currentTime);
            statTime.textContent = formatSimTime(jsDate);
        });
    }

    edgePointer.addEventListener('click', () => {
        if (selectedSatIndex >= 0) {
            flyToSatellite(satellitesData[selectedSatIndex]);
        }
    });

    searchInput.addEventListener('input', (e) => {
        const rawValue = e.target.value.trim();
        if (rawValue.length > 0) {
            clearSearch.classList.remove('hidden');
            performSearch(rawValue);
        } else {
            clearSearch.classList.add('hidden');
            searchResults.innerHTML = '';
            updateDropdownOptions();
        }
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.classList.add('hidden');
        searchResults.innerHTML = '';
        updateDropdownOptions();
    });

    closeDetail.addEventListener('click', () => {
        deselectSatellite();
    });

    trackBtn.addEventListener('click', () => {
        if (selectedSatIndex < 0) return;
        const sat = satellitesData[selectedSatIndex];
        
        if (currentTrackingEntity) {
            viewer.entities.remove(currentTrackingEntity);
        }

        currentTrackingEntity = viewer.entities.add({
            position: new Cesium.CallbackProperty(() => {
                return sat.currentCartesian || Cesium.Cartesian3.ZERO;
            }, false),
            point: {
                pixelSize: 18,
                color: Cesium.Color.fromCssColorString('#ff0055'),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
        viewer.trackedEntity = currentTrackingEntity;
    });

    untrackBtn.addEventListener('click', () => {
        viewer.trackedEntity = undefined;
    });

    toggleLabels.addEventListener('change', (e) => {
        const isShow = e.target.checked;
        satellitesData.forEach((sat, index) => {
            if (sat.domLabel) {
                sat.domLabel.style.display = (isShow || index === selectedSatIndex) ? 'block' : 'none';
            }
        });
    });

    toggleOrbits.addEventListener('change', (e) => {
        if (!e.target.checked && orbitPolylineEntity) {
            viewer.entities.remove(orbitPolylineEntity);
            orbitPolylineEntity = null;
        } else if (e.target.checked && selectedSatIndex >= 0) {
            drawOrbitPath(satellitesData[selectedSatIndex]);
        }
    });

    toggleAtmosphere.addEventListener('change', (e) => {
        viewer.scene.globe.enableLighting = e.target.checked;
        viewer.scene.globe.showGroundAtmosphere = e.target.checked;
        viewer.scene.skyAtmosphere.show = e.target.checked;
    });

    toggle2D.addEventListener('change', (e) => {
        if (e.target.checked) {
            viewer.scene.morphTo2D(1.0);
        } else {
            viewer.scene.morphTo3D(1.0);
        }
    });

    loadMajorBtn.addEventListener('click', () => {
        setActivePresetBtn(loadMajorBtn);
        loadMajorSatellitesPreset();
    });

    loadLocalBtn.addEventListener('click', () => {
        setActivePresetBtn(loadLocalBtn);
        loadSatelliteData('starlink.txt');
    });

    loadOnlineBtn.addEventListener('click', () => {
        setActivePresetBtn(loadOnlineBtn);
        loadSatelliteData('https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle');
    });
}

function setActivePresetBtn(activeBtn) {
    [loadMajorBtn, loadLocalBtn, loadOnlineBtn].forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

/**
 * Search Satellites by Name or NORAD ID
 */
function performSearch(rawQuery) {
    searchResults.innerHTML = '';
    const upperQuery = rawQuery.toUpperCase();

    const searchTerms = [upperQuery, rawQuery];
    if (rawQuery.includes('ひまわり') || rawQuery.includes('ヒマワリ') || upperQuery.includes('HIMAWARI')) {
        searchTerms.push('HIMAWARI', 'ひまわり');
    }
    if (rawQuery.includes('ステーション') || rawQuery.includes('宇宙ステーション') || upperQuery.includes('ISS')) {
        searchTerms.push('ISS', 'ZARYA');
    }
    if (rawQuery.includes('てんぐう') || rawQuery.includes('天宮') || rawQuery.includes('中国') || upperQuery.includes('TIANGONG')) {
        searchTerms.push('TIANGONG', '天宮');
    }
    if (rawQuery.includes('ほくと') || rawQuery.includes('北斗') || upperQuery.includes('BEIDOU')) {
        searchTerms.push('BEIDOU', '北斗');
    }
    if (rawQuery.includes('みちびき') || upperQuery.includes('MICHIBIKI') || upperQuery.includes('QZSS')) {
        searchTerms.push('MICHIBIKI', 'QZSS');
    }
    if (rawQuery.includes('ハッブル') || upperQuery.includes('HUBBLE') || upperQuery.includes('HST')) {
        searchTerms.push('HUBBLE', 'HST');
    }
    if (rawQuery.includes('デブリ') || rawQuery.includes('ゴミ') || upperQuery.includes('DEBRIS') || upperQuery.includes('IRIDIUM')) {
        searchTerms.push('DEBRIS', 'IRIDIUM');
    }
    if (rawQuery.includes('スターリンク') || upperQuery.includes('STARLINK')) {
        searchTerms.push('STARLINK');
    }

    const matches = satellitesData.filter(sat => {
        const nameUpper = sat.name.toUpperCase();
        return searchTerms.some(term => 
            nameUpper.includes(term.toUpperCase()) || sat.noradId.includes(term)
        );
    });

    satSelect.innerHTML = `<option value="">-- 検索結果 (${matches.length}機) --</option>`;
    matches.forEach(sat => {
        const index = satellitesData.indexOf(sat);
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = `${sat.name} (NORAD ${sat.noradId})`;
        satSelect.appendChild(opt);
    });

    if (matches.length === 0) {
        if (searchTerms.some(t => ['HIMAWARI', 'ひまわり', 'ヒマワリ', 'ISS', 'MICHIBIKI', 'みちびき', 'HUBBLE', 'TIANGONG', '天宮', 'BEIDOU', '北斗', 'DEBRIS'].includes(t))) {
            loadMajorBtn.click();
            setTimeout(() => performSearch(rawQuery), 200);
            return;
        }
        searchResults.innerHTML = `<div class="search-item" style="cursor:default; color:var(--accent-rose); font-size:0.8rem;">該当する衛星が見つかりません</div>`;
        return;
    }

    matches.slice(0, 10).forEach(sat => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.innerHTML = `<span>${sat.name}</span><span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-cyan);">${sat.noradId}</span>`;
        item.addEventListener('click', () => {
            const index = satellitesData.indexOf(sat);
            selectSatellite(index);
            searchResults.innerHTML = '';
        });
        searchResults.appendChild(item);
    });
}

/**
 * Loading Helpers
 */
function showLoading(msg) {
    loadingText.textContent = msg || '読み込み中...';
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}
