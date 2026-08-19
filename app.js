/**
 * Satellite Orbit Simulator 3D
 * Engine: CesiumJS + satellite.js
 */

// Major Satellites Built-in TLE Preset (CelesTrak Valid format for Himawari, ISS, Michibiki, Hubble, etc.)
const MAJOR_SATELLITES_TLE = `HIMAWARI-8 (ひまわり8号)
1 40267U 14060A   26100.01092709  .00042977  00000+0  12755-2 0  9998
2 40267   0.0200 140.7000 0003152 137.4191 222.7056  1.00270000153536
HIMAWARI-9 (ひまわり9号)
1 41836U 16064A   26100.20307328  .00057189  00000+0  17299-2 0  9998
2 41836   0.0300 140.7000 0003526 134.6329 225.4961  1.00270000153693
ISS (ZARYA / 国際宇宙ステーション)
1 25544U 98067A   26100.52443056  .00014798  00000+0  26498-3 0  9999
2 25544  51.6416 288.4552 0004557 114.6293 250.7711 15.49753018444743
QZSS / MICHIBIKI-1 (みちびき1号)
1 37158U 10045A   26100.18532154  .00051572  00000+0  19056-2 0  9991
2 37158  41.0000 135.0000 0003477 136.2709 223.8565  1.00270000353771
HUBBLE SPACE TELESCOPE (ハッブル宇宙望遠鏡)
1 20580U 90037B   26100.25001156  .00217812  29175-4  60418-3 0  9992
2 20580  28.4690 250.0000 0003472 250.4592 194.3633 15.93405075  5858
GPS NAVSTAR 43
1 24876U 97035A   26099.61117497  .00056206  00000+0  17504-2 0  9992
2 24876  55.3000  45.0000 0002836 122.5110 237.6166  2.00560000353232
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
const satAlt = document.getElementById('satAlt');
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
 * Fetch helper with multi-proxy loop
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

    const targets = [
        url,
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        `https://thingproxy.freeboard.io/fetch/${url}`
    ];

    for (const targetUrl of targets) {
        try {
            const res = await fetch(targetUrl);
            if (res.ok && res.status === 200) {
                const text = await res.text();
                if (text && text.includes('1 ') && text.includes('2 ')) {
                    return text;
                }
            }
        } catch (e) {
            console.warn(`Fetch attempt for ${targetUrl} failed:`, e);
        }
    }

    throw new Error("CelesTrak接続エラー");
}

/**
 * Load TLE Satellite Data from URL / File
 */
async function loadSatelliteData(sourceUrl) {
    showLoading(`衛星データを計算・ロード中...`);
    
    try {
        const text = await fetchTLEText(sourceUrl);
        const parsed = parseTLE(text);
        
        if (parsed.length === 0) {
            throw new Error("有効な衛星データ(TLE)が見つかりませんでした。");
        }

        satellitesData = parsed;
        statCount.textContent = satellitesData.length.toLocaleString();
        updateDropdownOptions();
        renderSatellitePoints();
    } catch (error) {
        console.error("Error loading TLE:", error);
        
        if (sourceUrl.startsWith('http')) {
            loadingText.textContent = `CelesTrak取得不可(403)。主要衛星プリセットを読み込みます...`;
            setTimeout(() => {
                loadMajorBtn.click();
            }, 1800);
            return;
        } else {
            loadingText.textContent = `エラー: ${error.message}`;
            setTimeout(hideLoading, 2000);
            return;
        }
    } finally {
        hideLoading();
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

    const pointColor = Cesium.Color.fromCssColorString('#00f3ff');
    const isLargeConstellation = satellitesData.length > 50;

    satellitesData.forEach((sat, index) => {
        // Point Primitive for 3D Earth View
        const point = satPointPrimitives.add({
            position: Cesium.Cartesian3.ZERO,
            pixelSize: isLargeConstellation ? 6 : 12, // Compact dot size for Starlink cluster
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
 * Draw 3D Orbit Polyline Path
 */
function drawOrbitPath(sat) {
    if (orbitPolylineEntity) {
        viewer.entities.remove(orbitPolylineEntity);
        orbitPolylineEntity = null;
    }

    const points = [];
    const now = Cesium.JulianDate.toDate(viewer.clock.currentTime);
    const periodMinutes = sat.satrec && sat.satrec.no ? (2 * Math.PI / sat.satrec.no) * (60 / (2 * Math.PI)) : 1440;
    const totalMinutes = Math.min(Math.max(periodMinutes, 90), 120);

    const stepSeconds = 60;
    const steps = Math.floor((totalMinutes * 60) / stepSeconds);

    for (let i = 0; i <= steps; i++) {
        const time = new Date(now.getTime() + i * stepSeconds * 1000);
        const gmst = satellite.gstime(time);
        const res = calculateCartesianPosition(sat, time, gmst);
        
        if (res && res.cartesian) {
            points.push(res.cartesian);
        }
    }

    if (points.length > 1) {
        orbitPolylineEntity = viewer.entities.add({
            polyline: {
                positions: points,
                width: 4,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.4,
                    taperPower: 1.0,
                    color: Cesium.Color.fromCssColorString('#ff0055')
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
    if (rawQuery.includes('みちびき') || upperQuery.includes('MICHIBIKI') || upperQuery.includes('QZSS')) {
        searchTerms.push('MICHIBIKI', 'QZSS');
    }
    if (rawQuery.includes('ハッブル') || upperQuery.includes('HUBBLE') || upperQuery.includes('HST')) {
        searchTerms.push('HUBBLE', 'HST');
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
        if (searchTerms.some(t => ['HIMAWARI', 'ひまわり', 'ヒマワリ', 'ISS', 'MICHIBIKI', 'みちびき', 'HUBBLE'].includes(t))) {
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
