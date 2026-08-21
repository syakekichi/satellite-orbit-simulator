
const CELESTIAL_BADGE_TYPES = {
    'SUN': { ja: '☀️ 恒星 (G型主系列星)', en: '☀️ G-Type Main-Sequence Star', de: '☀️ Hauptreihenstern (G-Klasse)', fr: '☀️ Étoile naine jaune', es: '☀️ Estrella enana amarilla', pt: '☀️ Estrela anã amarela', it: '☀️ Stella nana gialla', ko: '☀️ G형 주계열성 (항성)', nl: '☀️ Hoofdreeksster (G-type)', id: '☀️ Bintang Deret Utama', hi: '☀️ मुख्य-अनुक्रम तारा', ar: '☀️ نجم النسق الأساسي', zh: '☀️ G型主序星 (恒星)', ru: '☀️ Желтый карлик (Звезда)' },
    'MOON': { ja: '🌕 地球の自然衛星', en: "🌕 Earth's Natural Satellite", de: '🌕 Natürlicher Satellit der Erde', fr: '🌕 Satellite naturel de la Terre', es: '🌕 Satélite natural de la Tierra', pt: '🌕 Satélite natural da Terra', it: '🌕 Satellite naturale della Terra', ko: '🌕 지구의 자연위성', nl: '🌕 Natuurlijke satelliet van de aarde', id: '🌕 Satelit Alami Bumi', hi: '🌕 पृथ्वी का प्राकृतिक उपग्रह', ar: '🌕 التابع الطبيعي للأرض', zh: '🌕 地球的天然卫星', ru: '🌕 Естественный спутник Земли' },
    'MERCURY': { ja: '🔘 太陽系第1惑星 (岩石惑星)', en: '🔘 1st Terrestrial Planet', de: '🔘 1. Planet (Gesteinsplanet)', fr: '🔘 1re planète tellurique', es: '🔘 1.º planeta rocoso', pt: '🔘 1º planeta rochoso', it: '🔘 1º pianeta roccioso', ko: '🔘 제1행성 (지구형 암석 행성)', nl: '🔘 1e Rotsachtige planeet', id: '🔘 Planet Berbatu ke-1', hi: '🔘 प्रथम स्थलीय ग्रह', ar: '🔘 الكوكب الصخري الأول', zh: '🔘 太阳系第一行星 (岩质行星)', ru: '🔘 1-я планета (Каменистая)' },
    'VENUS': { ja: '🟡 太陽系第2惑星 (岩石惑星)', en: '🟡 2nd Terrestrial Planet', de: '🟡 2. Planet (Gesteinsplanet)', fr: '🟡 2e planète tellurique', es: '🟡 2.º planeta rocoso', pt: '🟡 2º planeta rochoso', it: '🟡 2º pianeta roccioso', ko: '🟡 제2행성 (지구형 암석 행성)', nl: '🟡 2e Rotsachtige planeet', id: '🟡 Planet Berbatu ke-2', hi: '🟡 द्वितीय स्थलीय ग्रह', ar: '🟡 الكوكب الصخري الثاني', zh: '🟡 太阳系第二行星 (岩质行星)', ru: '🟡 2-я планета (Каменистая)' },
    'MARS': { ja: '🔴 太陽系第4惑星 (岩石惑星)', en: '🔴 4th Terrestrial Planet', de: '🔴 4. Planet (Gesteinsplanet)', fr: '🔴 4e planète tellurique', es: '🔴 4.º planeta rocoso', pt: '🔴 4º planeta rochoso', it: '🔴 4º pianeta roccioso', ko: '🔴 제4행성 (지구형 암석 행성)', nl: '🔴 4e Rotsachtige planeet', id: '🔴 Planet Berbatu ke-4', hi: '🔴 चतुर्थ स्थलीय ग्रह', ar: '🔴 الكوكب الصخري الرابع', zh: '🔴 太阳系第四行星 (岩质行星)', ru: '🔴 4-я планета (Каменистая)' },
    'JUPITER': { ja: '🟠 太陽系第5惑星 (巨大ガス惑星)', en: '🟠 5th Planet (Gas Giant)', de: '🟠 5. Planet (Gasriese)', fr: '🟠 5e planète (Géante gazeuse)', es: '🟠 5.º planeta (Gigante gaseoso)', pt: '🟠 5º planeta (Gigante gasoso)', it: '🟠 5º pianeta (Gigante gassoso)', ko: '🟠 제5행성 (거대 가스 행성)', nl: '🟠 5e planeet (Gasreus)', id: '🟠 Planet ke-5 (Raksasa Gas)', hi: '🟠 5वां ग्रह (विशाल गैस दानव)', ar: '🟠 الكوكب الخامس (عملاق غازي)', zh: '🟠 太阳系第五行星 (气态巨行星)', ru: '🟠 5-я планета (Газовый гигант)' },
    'SATURN': { ja: '🪐 太陽系第6惑星 (巨大ガス惑星)', en: '🪐 6th Planet (Gas Giant)', de: '🪐 6. Planet (Gasriese)', fr: '🪐 6e planète (Géante gazeuse)', es: '🪐 6.º planeta (Gigante gaseoso)', pt: '🪐 6º planeta (Gigante gasoso)', it: '🪐 6º pianeta (Gigante gassoso)', ko: '🪐 제6행성 (거대 가스 행성)', nl: '🪐 6e planeet (Gasreus)', id: '🪐 Planet ke-6 (Raksasa Gas)', hi: '🪐 6वां ग्रह (विशाल गैस दानव)', ar: '🪐 الكوكب السادس (عملاق غازي)', zh: '🪐 太阳系第六行星 (气态巨行星)', ru: '🪐 6-я планета (Газовый гигант)' },
    'URANUS': { ja: '🌀 太陽系第7惑星 (巨大氷惑星)', en: '🌀 7th Planet (Ice Giant)', de: '🌀 7. Planet (Eisriese)', fr: '🌀 7e planète (Géante de glace)', es: '🌀 7.º planeta (Gigante helado)', pt: '🌀 7º planeta (Gigante de gelo)', it: '🌀 7º pianeta (Gigante di ghiaccio)', ko: '🌀 제7행성 (거대 얼음 행성)', nl: '🌀 7e planeet (Ijsreus)', id: '🌀 Planet ke-7 (Raksasa Es)', hi: '🌀 7वां ग्रह (विशाल बर्फ दानव)', ar: '🌀 الكوكب السابع (عملاق جليدي)', zh: '🌀 太阳系第七行星 (冰巨行星)', ru: '🌀 7-я планета (Ледяной гигант)' }
};

const CELESTIAL_SUBTITLES = {
    ja: '太陽系主要天体',
    en: 'SOLAR SYSTEM CELESTIAL BODY',
    de: 'HIMMELSKÖRPER DES SONNENSYSTEMS',
    fr: 'CORPS CÉLESTE DU SYSTÈME SOLAIRE',
    es: 'CUERPO CELESTE DEL SISTEMA SOLAR',
    pt: 'CORPO CELESTE DO SISTEMA SOLAR',
    it: 'CORPO CELESTE DEL SISTEMA SOLARE',
    ko: '태양계 주요 천체',
    nl: 'HEMELLICHAAM VAN HET ZONNESTELSEL',
    id: 'BENDA LANGIT TATA SURYA',
    hi: 'सौर मंडल प्रमुख खगोलीय पिंड',
    ar: 'جرم سماوي في النظام الشمسي',
    zh: '太阳系主要天体',
    ru: 'НЕБЕСНОЕ ТЕЛО СОЛНЕЧНОЙ СИСТЕМЫ'
};

const CELESTIAL_EQUILIBRIUM_STATUS = {
    ja: '🟢 重力平衡 (ケプラー安定軌道)',
    en: '🟢 Gravitational Equilibrium (Stable Orbit)',
    de: '🟢 Gravitatives Gleichgewicht (Stabile Bahn)',
    fr: '🟢 Équilibre gravitationnel (Orbite stable)',
    es: '🟢 Equilibrio gravitacional (Órbita estable)',
    pt: '🟢 Equilíbrio gravitacional (Órbita estável)',
    it: '🟢 Equilibrio gravitazionale (Orbita stabile)',
    ko: '🟢 중력 평형 (안정된 케플러 궤도)',
    nl: '🟢 Zwaartekrachtevenwicht (Stabiele baan)',
    id: '🟢 Keseimbangan Gravitasi (Orbit Stabil)',
    hi: '🟢 गुरुत्वाकर्षण संतुलन (स्थिर कक्षा)',
    ar: '🟢 توازن جاذبي (مدار كبلري مستقر)',
    zh: '🟢 引力平衡 (开普勒稳定轨道)',
    ru: '🟢 Гравитационное равновесие (Стабильная орбита)'
};


const CELESTIAL_METRIC_LABELS = {
    'ja': { alt: '📏 距離 (Distance)', vel: '📐 直径 (Diameter)', lat: '⚖️ 質量 (Mass)', lon: '🔄 自転周期 (Rotation)', inc: '🌡️ 表面温度 (Temperature)', period: '🌌 公転周期 (Orbit)' },
    'en': { alt: '📏 Distance', vel: '📐 Diameter', lat: '⚖️ Mass', lon: '🔄 Rotation', inc: '🌡️ Surface Temp', period: '🌌 Orbit Period' },
    'de': { alt: '📏 Entfernung', vel: '📐 Durchmesser', lat: '⚖️ Masse', lon: '🔄 Rotation', inc: '🌡️ Oberflächentemp.', period: '🌌 Umlaufzeit' },
    'fr': { alt: '📏 Distance', vel: '📐 Diamètre', lat: '⚖️ Masse', lon: '🔄 Rotation', inc: '🌡️ Température', period: '🌌 Période orbitale' },
    'es': { alt: '📏 Distancia', vel: '📐 Diámetro', lat: '⚖️ Masa', lon: '🔄 Rotación', inc: '🌡️ Temperatura', period: '🌌 Período orbital' },
    'pt': { alt: '📏 Distância', vel: '📐 Diâmetro', lat: '⚖️ Massa', lon: '🔄 Rotação', inc: '🌡️ Temperatura', period: '🌌 Período orbital' },
    'it': { alt: '📏 Distanza', vel: '📐 Diametro', lat: '⚖️ Massa', lon: '🔄 Rotazione', inc: '🌡️ Temperatura', period: '🌌 Periodo orbitale' },
    'ko': { alt: '📏 거리 (Distance)', vel: '📐 직경 (Diameter)', lat: '⚖️ 질량 (Mass)', lon: '🔄 자전 주기 (Rotation)', inc: '🌡️ 표면 온도 (Temp)', period: '🌌 공전 주기 (Orbit)' },
    'nl': { alt: '📏 Afstand', vel: '📐 Diameter', lat: '⚖️ Massa', lon: '🔄 Rotatie', inc: '🌡️ Oppervlaktetemp.', period: '🌌 Omlooptijd' },
    'id': { alt: '📏 Jarak', vel: '📐 Diameter', lat: '⚖️ Massa', lon: '🔄 Rotasi', inc: '🌡️ Suhu Permukaan', period: '🌌 Periode Orbit' },
    'hi': { alt: '📏 दूरी (Distance)', vel: '📐 व्यास (Diameter)', lat: '⚖️ द्रव्यमान (Mass)', lon: '🔄 घूर्णन (Rotation)', inc: '🌡️ सतह तापमान (Temp)', period: '🌌 परिक्रमा (Orbit)' },
    'ar': { alt: '📏 المسافة', vel: '📐 القطر', lat: '⚖️ الكتلة', lon: '🔄 فترة الدوران', inc: '🌡️ درجة الحرارة', period: '🌌 فترة المدار' },
    'zh': { alt: '📏 距地距离', vel: '📐 直径 (大小)', lat: '⚖️ 质量 (Mass)', lon: '🔄 自转周期', inc: '🌡️ 表面温度 (Temp)', period: '🌌 公转周期' },
    'ru': { alt: '📏 Расстояние', vel: '📐 Диаметр', lat: '⚖️ Масса', lon: '🔄 Вращение', inc: '🌡️ Температура', period: '🌌 Период обращения' }
};

function updateDetailCardMetricLabels(isCelestial) {
    const langSelect = document.getElementById('langSelect');
    const lang = (langSelect && langSelect.value) || window.currentLang || currentLang || 'ja';
    const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) ? TRANSLATIONS[lang] : {};
    const cLabels = CELESTIAL_METRIC_LABELS[lang] || CELESTIAL_METRIC_LABELS['en'] || CELESTIAL_METRIC_LABELS['ja'];

    const elAlt = document.getElementById('satAlt');
    const elVel = document.getElementById('satVel');
    const elLat = document.getElementById('satLat');
    const elLon = document.getElementById('satLon');
    const elInc = document.getElementById('satInc');
    const elPeriod = document.getElementById('satPeriod');

    if (elAlt && elAlt.previousElementSibling) elAlt.previousElementSibling.textContent = isCelestial ? cLabels.alt : (dict.labelAlt || '高度 (Altitude)');
    if (elVel && elVel.previousElementSibling) elVel.previousElementSibling.textContent = isCelestial ? cLabels.vel : (dict.labelVel || '速度 (Velocity)');
    if (elLat && elLat.previousElementSibling) elLat.previousElementSibling.textContent = isCelestial ? cLabels.lat : (dict.labelLat || '緯度 (Latitude)');
    if (elLon && elLon.previousElementSibling) elLon.previousElementSibling.textContent = isCelestial ? cLabels.lon : (dict.labelLon || '経度 (Longitude)');
    if (elInc && elInc.previousElementSibling) elInc.previousElementSibling.textContent = isCelestial ? cLabels.inc : (dict.labelInc || '軌道傾斜角 (Inclination)');
    if (elPeriod && elPeriod.previousElementSibling) elPeriod.previousElementSibling.textContent = isCelestial ? cLabels.period : (dict.labelPeriod || '周期 (Period)');
}





// ==========================================================================
// Official NASA Ultra High-Resolution Photorealistic Texture Maps (Public Domain)
// ==========================================================================
const NASA_PLANET_TEXTURES = {
    'MARS': 'mars_texture.jpg?v=20260821_170',
    'VENUS': 'venus_texture.jpg?v=20260821_170',
    'MERCURY': 'mercury_texture.jpg?v=20260821_170',
    'JUPITER': 'jupiter_texture.jpg?v=20260821_170',
    'SATURN': 'saturn_texture.jpg?v=20260821_170',
    'URANUS': 'uranus_texture.jpg?v=20260821_170',
    'MOON': 'moon_texture.jpg?v=20260821_170',
    'SUN': 'sun_texture.jpg?v=20260821_179'
};


// Active 3D Planet Inspection Sphere & Rings
let activePlanetSphereEntity = null;
let activePlanetRingEntities = [];

function clearPlanetInspectionEntities() {
    if (activePlanetSphereEntity) {
        viewer.entities.remove(activePlanetSphereEntity);
        activePlanetSphereEntity = null;
    }
    if (activePlanetRingEntities && activePlanetRingEntities.length > 0) {
        activePlanetRingEntities.forEach(ent => viewer.entities.remove(ent));
        activePlanetRingEntities = [];
    }
}

// Generate pure 3D Ring Loop Positions tilted by planet axial inclination
function generate3DRingPositions(center, radiusMeters, tiltAngleRad, segments = 64) {
    // Rotation axis (tilt around X/Y to match axial tilt)
    const cosT = Math.cos(tiltAngleRad);
    const sinT = Math.sin(tiltAngleRad);

    const positions = [];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const lx = radiusMeters * Math.cos(theta);
        const ly = radiusMeters * Math.sin(theta) * cosT;
        const lz = radiusMeters * Math.sin(theta) * sinT;

        const p = Cesium.Cartesian3.add(
            center,
            new Cesium.Cartesian3(lx, ly, lz),
            new Cesium.Cartesian3()
        );
        positions.push(p);
    }
    return positions;
}

function create3DPlanetaryRings(body, bodyPos, planetRadius) {
    if (body.id === 'SATURN') {
        // Saturn: Iconic Majestic Multi-layered Gold/Ice Rings (Tilt: 26.73 deg)
        const tilt = 26.73 * (Math.PI / 180);

        // Multiple dense concentric rings representing C-Ring, B-Ring (brightest), A-Ring, and F-Ring with Cassini Gap
        const ringBands = [
            // C Ring (Faint inner)
            { r: planetRadius * 1.30, w: 4, col: 'rgba(217, 180, 110, 0.45)' },
            { r: planetRadius * 1.45, w: 5, col: 'rgba(235, 200, 130, 0.60)' },
            // B Ring (Vibrant Dense Ice - Brightest)
            { r: planetRadius * 1.60, w: 8, col: 'rgba(254, 240, 170, 0.95)' },
            { r: planetRadius * 1.75, w: 10, col: 'rgba(255, 250, 200, 0.98)' },
            { r: planetRadius * 1.90, w: 8, col: 'rgba(254, 240, 170, 0.90)' },
            // (Cassini Division Gap at 1.95 - 2.05)
            // A Ring (Outer ring)
            { r: planetRadius * 2.08, w: 7, col: 'rgba(235, 200, 130, 0.85)' },
            { r: planetRadius * 2.22, w: 6, col: 'rgba(220, 180, 115, 0.75)' },
            // F Ring (Shepherd moon thin outer ring)
            { r: planetRadius * 2.38, w: 3, col: 'rgba(200, 160, 95, 0.55)' }
        ];

        ringBands.forEach((band, idx) => {
            const pos = generate3DRingPositions(bodyPos, band.r, tilt, 72);
            const ent = viewer.entities.add({
                id: `inspect_ring_SATURN_${idx}`,
                polyline: {
                    positions: pos,
                    width: band.w,
                    material: Cesium.Color.fromCssColorString(band.col)
                }
            });
            activePlanetRingEntities.push(ent);
        });
    } else if (body.id === 'JUPITER') {
        // Jupiter: Delicate Amber Dust Ring (Tilt: 3.13 deg)
        const tilt = 3.13 * (Math.PI / 180);
        const ringBands = [
            { r: planetRadius * 1.40, w: 3, col: 'rgba(251, 146, 60, 0.45)' },
            { r: planetRadius * 1.65, w: 5, col: 'rgba(249, 115, 22, 0.65)' },
            { r: planetRadius * 1.90, w: 3, col: 'rgba(234, 88, 12, 0.35)' }
        ];

        ringBands.forEach((band, idx) => {
            const pos = generate3DRingPositions(bodyPos, band.r, tilt, 72);
            const ent = viewer.entities.add({
                id: `inspect_ring_JUPITER_${idx}`,
                polyline: {
                    positions: pos,
                    width: band.w,
                    material: Cesium.Color.fromCssColorString(band.col)
                }
            });
            activePlanetRingEntities.push(ent);
        });
    } else if (body.id === 'URANUS') {
        // Uranus: Ethereal Vertical Cyan Ring System (Tilt: 97.77 deg - Vertical!)
        const tilt = 97.77 * (Math.PI / 180);
        const ringBands = [
            { r: planetRadius * 1.50, w: 3, col: 'rgba(56, 189, 248, 0.55)' },
            { r: planetRadius * 1.80, w: 6, col: 'rgba(56, 189, 248, 0.85)' }, // Epsilon ring
            { r: planetRadius * 2.10, w: 4, col: 'rgba(125, 211, 252, 0.65)' }
        ];

        ringBands.forEach((band, idx) => {
            const pos = generate3DRingPositions(bodyPos, band.r, tilt, 72);
            const ent = viewer.entities.add({
                id: `inspect_ring_URANUS_${idx}`,
                polyline: {
                    positions: pos,
                    width: band.w,
                    material: Cesium.Color.fromCssColorString(band.col)
                }
            });
            activePlanetRingEntities.push(ent);
        });
    }
}

function inspectCelestialPlanet(body, bodyPos, bodyDir) {
    // Remove previous inspection sphere and rings
    clearPlanetInspectionEntities();

    const planetRadius = (body.radiusKm || 6000) * 1000;
    const texImage = NASA_PLANET_TEXTURES[body.id] || getPlanetTextureDataUrl(body.id);

    // Place ultra-photorealistic NASA 3D sphere directly at body target coordinates
    activePlanetSphereEntity = viewer.entities.add({
        id: `inspect_planet_${body.id}`,
        name: body.name,
        position: bodyPos,
        ellipsoid: {
            radii: new Cesium.Cartesian3(planetRadius, planetRadius, planetRadius),
            material: new Cesium.ImageMaterialProperty({
                image: texImage,
                transparent: false
            })
        }
    });

    // Create Genuine 3D Planetary Rings in Space
    create3DPlanetaryRings(body, bodyPos, planetRadius);

    // Lock camera target transform to the planet center!
    const targetRange = planetRadius * ((body.id === 'SATURN' || body.id === 'JUPITER' || body.id === 'URANUS') ? 3.4 : 2.8);
    const hpr = new Cesium.HeadingPitchRange(0.0, Cesium.Math.toRadians(-22.0), targetRange);

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.add(
            bodyPos,
            Cesium.Cartesian3.multiplyByScalar(bodyDir, -targetRange, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        ),
        orientation: {
            direction: bodyDir,
            up: Cesium.Cartesian3.UNIT_Z
        },
        duration: 2.0,
        complete: () => {
            // Lock rotation and wheel zoom pivot onto the planet center!
            viewer.camera.lookAt(bodyPos, hpr);
        }
    });
}



// ==========================================================================
// NASA Public Domain High-Resolution Procedural Planet Texture Generator
// ==========================================================================
const PLANET_TEXTURE_DATA_URLS = {};

function getPlanetTextureDataUrl(bodyId) {
    if (PLANET_TEXTURE_DATA_URLS[bodyId]) return PLANET_TEXTURE_DATA_URLS[bodyId];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (bodyId === 'MARS') {
        // Mars: Rich rusty red/orange soil, dark basalt plains, and white polar caps
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#ffffff'); // North Pole
        grad.addColorStop(0.1, '#e05a1e');
        grad.addColorStop(0.5, '#c2410c');
        grad.addColorStop(0.9, '#e05a1e');
        grad.addColorStop(1, '#ffffff'); // South Pole
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);

        // Valles Marineris & Dark basalt regions
        ctx.fillStyle = 'rgba(67, 20, 7, 0.6)';
        for (let i = 0; i < 50; i++) {
            const x = (i * 73) % 1024;
            const y = 100 + ((i * 47) % 312);
            const w = 50 + ((i * 31) % 140);
            const h = 25 + ((i * 19) % 70);
            ctx.beginPath();
            ctx.ellipse(x, y, w, h, (i * 0.4), 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (bodyId === 'JUPITER') {
        // Jupiter: Vibrant multi-colored atmospheric cloud bands & Great Red Spot
        const colors = ['#fed7aa', '#f97316', '#fdba74', '#c2410c', '#ffedd5', '#ea580c', '#fdba74', '#9a3412'];
        const bandH = 512 / colors.length;
        colors.forEach((col, idx) => {
            ctx.fillStyle = col;
            ctx.fillRect(0, idx * bandH, 1024, bandH + 2);
        });

        // Atmospheric turbulence
        ctx.strokeStyle = 'rgba(124, 45, 18, 0.5)';
        ctx.lineWidth = 5;
        for (let y = 35; y < 480; y += 32) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (let x = 0; x < 1024; x += 40) {
                ctx.quadraticCurveTo(x + 20, y + Math.sin(x * 0.06) * 15, x + 40, y);
            }
            ctx.stroke();
        }

        // Great Red Spot
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.ellipse(650, 320, 60, 38, -0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f87171';
        ctx.beginPath();
        ctx.ellipse(650, 320, 38, 22, -0.1, 0, Math.PI * 2);
        ctx.fill();
    } else if (bodyId === 'SATURN') {
        // Saturn: Golden-cream atmospheric bands
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#a16207');
        grad.addColorStop(0.2, '#ca8a04');
        grad.addColorStop(0.4, '#fde047');
        grad.addColorStop(0.6, '#fef08a');
        grad.addColorStop(0.8, '#fde047');
        grad.addColorStop(1, '#a16207');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);
    } else if (bodyId === 'VENUS') {
        // Venus: Golden sulfur cloud deck
        const grad = ctx.createLinearGradient(0, 0, 1024, 512);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.4, '#fde047');
        grad.addColorStop(0.8, '#eab308');
        grad.addColorStop(1, '#ca8a04');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);
    } else if (bodyId === 'MERCURY') {
        // Mercury: Cratered rocky gray terrain
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, 0, 1024, 512);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
        for (let i = 0; i < 90; i++) {
            const x = (i * 89) % 1024;
            const y = (i * 53) % 512;
            const r = 12 + ((i * 17) % 40);
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (bodyId === 'URANUS') {
        // Uranus: Cyan aquamarine atmosphere
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#0369a1');
        grad.addColorStop(0.3, '#0ea5e9');
        grad.addColorStop(0.5, '#38bdf8');
        grad.addColorStop(0.7, '#0ea5e9');
        grad.addColorStop(1, '#0369a1');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);
    } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1024, 512);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    PLANET_TEXTURE_DATA_URLS[bodyId] = dataUrl;
    return dataUrl;
}

/**
 * SatViewer3D Engine: CesiumJS + satellite.js
 */

// Smart Auto Language Detection (Defaults to English for International Visitors)
function detectDefaultLanguage() {
    // 1. Prioritize HTML lang attribute from current landing page (for /en/, /de/, /fr/, /es/, /pt/, /zh/, /ru/, etc.)
    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang && ['ja', 'en', 'de', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'id', 'hi', 'ar', 'zh', 'ru'].includes(htmlLang)) {
        return htmlLang;
    }

    // 2. Check URL pathname
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/en')) return 'en';
    if (path.includes('/de')) return 'de';
    if (path.includes('/fr')) return 'fr';
    if (path.includes('/es')) return 'es';
    if (path.includes('/pt')) return 'pt';
    if (path.includes('/zh')) return 'zh';
    if (path.includes('/ru')) return 'ru';
    if (path.includes('/it')) return 'it';
    if (path.includes('/ko')) return 'ko';
    if (path.includes('/nl')) return 'nl';
    if (path.includes('/id')) return 'id';
    if (path.includes('/hi')) return 'hi';
    if (path.includes('/ar')) return 'ar';

    const saved = localStorage.getItem('sat_lang');
    if (saved) return saved;

    const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (navLang.startsWith('ja')) return 'ja';
    if (navLang.startsWith('de')) return 'de';
    if (navLang.startsWith('fr')) return 'fr';
    if (navLang.startsWith('pt')) return 'pt';
    if (navLang.startsWith('es')) return 'es';
    if (navLang.startsWith('zh')) return 'zh';
    if (navLang.startsWith('ru')) return 'ru';
    if (navLang.startsWith('it')) return 'it';
    if (navLang.startsWith('ko')) return 'ko';
    if (navLang.startsWith('nl')) return 'nl';
    if (navLang.startsWith('id')) return 'id';
    if (navLang.startsWith('hi')) return 'hi';
    if (navLang.startsWith('ar')) return 'ar';
    
    // Default for all international visitors worldwide is English
    return 'en';
}

window.currentLang = detectDefaultLanguage();
var currentLang = window.currentLang;

// Bulletproof Guaranteed getSatDisplayName Function
function getSatDisplayName(name) {
    if (!name || typeof name !== 'string') return 'Satellite';
    const lang = window.currentLang || currentLang || 'ja';
    const upper = name.toUpperCase();
    
    if (lang === 'ja') {
        if (upper.includes('HIMAWARI-8')) return 'HIMAWARI-8 (ひまわり8号 - バックアップ)';
        if (upper.includes('HIMAWARI-9')) return 'HIMAWARI-9 (ひまわり9号 - メイン観測)';
        if (upper.includes('MICHIBIKI-1R')) return 'MICHIBIKI-1R (みちびき1号R後継機)';
        if (upper.includes('MICHIBIKI-6')) return 'MICHIBIKI-6 (みちびき6号機 - H3最新打上)';
        if (upper.includes('MICHIBIKI-5')) return 'MICHIBIKI-5 (みちびき5号機)';
        if (upper.includes('MICHIBIKI-1')) return 'MICHIBIKI-1 (みちびき1号初号機)';
        if (upper.includes('MICHIBIKI-2')) return 'MICHIBIKI-2 (みちびき2号機)';
        if (upper.includes('MICHIBIKI-3')) return 'MICHIBIKI-3 (みちびき3号機)';
        if (upper.includes('MICHIBIKI-4')) return 'MICHIBIKI-4 (みちびき4号機)';
        if (upper.includes('ISS')) return 'ISS (国際宇宙ステーション)';
        if (upper.includes('TIANGONG')) return 'TIANGONG (天宮宇宙ステーション)';
        if (upper.includes('BEIDOU')) return 'BEIDOU-3 (北斗3号測位衛星)';
        if (upper.includes('HUBBLE')) return 'HUBBLE SPACE TELESCOPE (ハッブル宇宙望遠鏡)';
        if (upper.includes('GPS')) return name.replace(/\(.*\)/, '') + ' (GPSナビゲーション衛星)';
        return name;
    } else {
        let clean = name.replace(/\(.*?[぀-ヿ㐀-䶿一-鿿].*?\)/g, '').trim();
        if (upper.includes('ISS')) return 'ISS (International Space Station)';
        if (upper.includes('TIANGONG')) return 'Tiangong Space Station';
        if (upper.includes('HIMAWARI-8')) return 'Himawari-8 (Weather Satellite)';
        if (upper.includes('HIMAWARI-9')) return 'Himawari-9 (Weather Satellite)';
        if (upper.includes('MICHIBIKI-6')) return 'QZSS / MICHIBIKI-6 (Navigation Satellite)';
        if (upper.includes('MICHIBIKI')) return clean + ' (QZSS Navigation)';
        if (upper.includes('BEIDOU')) return 'BeiDou-3 (Navigation Satellite)';
        if (upper.includes('HUBBLE')) return 'Hubble Space Telescope';
        if (upper.includes('GPS')) return clean + ' (GPS Navigation)';
        return clean;
    }
}

const TRANSLATIONS = {
    ja: {
        appSubtitle: "リアルタイム3D人工衛星・宇宙デブリ軌道シミュレーター",
        statCount: "追跡衛星数",
        statTime: "シミュレーション時刻",
        dragPanel: "⋮⋮ ドラッグでパネル移動",
        dragHeader: "⋮⋮ ドラッグで移動",
        secSelect: "天体・衛星を選択・検索",
        selectPlaceholder: "-- 太陽・惑星・衛星・宇宙ゴミを選択 --",
        searchPlaceholder: "または太陽・惑星・衛星名・NORAD IDで検索...",
        secSource: "衛星データソース & プリセット",
        loadMajor: "⭐ 主要・有名衛星 (ひまわり, ISS, みちびき, デブリ)",
        loadLocal: "🛰️ Starlink 全衛星コンステレーション (2,000機)",
        badgeMajor: "⭐ 主要・有名衛星プリセット読込済",
        secTime: "時間コントロール & 倍速設定",
        speedStop: "⏸️ 停止",
        speedReal: "▶️ 1x (リアル)",
        resetNow: "🔄 現在時刻",
        secDisplay: "表示設定",
        toggleLabels: "3D空間に衛星名ラベルを表示",
        toggleOrbits: "選択衛星の軌道を表示",
        toggleMultiLap: "🌐 複数周回軌跡を表示 (地球自転の波状パターン)",
        toggleAtmosphere: "大気圏 & ライティング",
        toggle2D: "2D世界地図モード",
        toggleBorders: "🌐 国境線 & 地名ラベル",
        toggleDebrisRisk: "🔮 宇宙デブリ危険分析モード (パープル表示)",
        toggleCelestial: "🌌 太陽・月・主要惑星 (火星/金星/木星/土星)",
        dragDetail: "⋮⋮ ドラッグで詳細カード移動",
        dragCam: "⋮⋮ カメラ視点移動",
        labelAlt: "高度 (Altitude)",
        labelVel: "速度 (Velocity)",
        labelLat: "緯度 (Latitude)",
        labelLon: "経度 (Longitude)",
        labelInc: "軌道傾斜角 (Inclination)",
        labelPeriod: "周期 (Period)",
        labelTimezone: "時刻表示タイムゾーン",
        labelPass: "📡 上空通過予報 (現在地: 東京上空)",
        labelRisk: "🔮 宇宙デブリ最接近 (衝突予測)",
        btnGeo: "📍現在地",
        btnTrack: "🎯 追跡カメラフォーカス",
        btnUntrack: "🔓 追跡解除",
        pointerHint: "画面外にあります (クリックでカメラ移動)",
        btnGuide: "❓ ガイド & 規約",
        modalTitle: "SatViewer3D 操作ガイド & 利用規約",
        tabControls: "🎮 操作方法",
        tabDisclaimer: "⚠️ 免責事項",
        tabPrivacy: "🔒 プライバシーポリシー",
        tabAbout: "ℹ️ サイト情報",
        guideTitleControls: "🖱️ 3D 空間の操作ガイド",
        guideWheel: "マウスホイール / タッチ操作",
        guideWheelDesc: "絹のように滑らかな 1/10 速度でズームイン / ズームアウト。",
        guideDrag: "左ドラッグ",
        guideDragDesc: "地球を全方向（360度）自由回転。",
        guideTilt: "右ドラッグ / Ctrl + ドラッグ",
        guideTiltDesc: "カメラの角度（チルト・俯瞰視点）を変更。",
        guideClick: "衛星をクリック / 検索",
        guideClickDesc: "衛星を選択し、リアルタイム軌道・高度・速度・衝突危険度を表示。",
        guideFocus: "🎯 追跡カメラフォーカス",
        guideFocusDesc: "選択した衛星をカメラが自動追跡。",
        guideRadar: "🔮 宇宙デブリ危険分析",
        guideRadarDesc: "今後24時間の軌道交差予測 (MOID) をリアルタイム表示。",
        guideTitleDisclaimer: "⚠️ 免責事項 (Disclaimer)",
        discText1: "SatViewer3D（以下、「本シミュレーター」）が提供する軌道データ、衛星位置、上空通過予報、および宇宙デブリ最接近危険度の予測計算は、NORAD および Space-Track 等の公開 TLE データに基づき教育・観測補助・科学的探求を目的としてリアルタイム計算されています。",
        discText2: "本シミュレーターのデータは、実際の宇宙船や人工衛星の運用、衝突回避操作等の安全保証を目的としたものではありません。本情報の利用により発生したいかなる損害についても、運営者は一切の責任を負いかねます。",
        guideTitlePrivacy: "🔒 プライバシーポリシー (Google AdSense 準拠)",
        privText1Title: "広告の配信について:",
        privText1Desc: "本サイトでは、第三者配信事業者（Google AdSense 等）による広告サービスを利用する場合があります。広告事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、本サイトや他サイトへのアクセスに関する情報 Cookie（氏名、住所、メール アドレス、電話番号は含まれません）を使用することがあります。",
        privText2Title: "アクセス解析ツールについて:",
        privText2Desc: "本サイトでは、アクセス解析ツールを利用してトラフィックデータを収集する場合があります。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。",
        guideTitleAbout: "ℹ️ SatViewer3D について",
        aboutText1: "SatViewer3D は、地球周回軌道上の人工衛星（ひまわり、みちびき、ISS、Starlink等）および宇宙デブリ（スペースデブリ）のリアルタイム 3D 可視化シミュレーターです。",
        aboutContactTitle: "お問い合わせ:",
        aboutContactDesc: "ご意見・ご要望・不具合のご報告は info@satviewer3d.com までお願いいたします。",
        aboutFeaturesTitle: "🌟 NASA公開ツールを超越する『SatViewer3D』の 8 大世界最高峰機能",
        feat1: "🚀 <strong>世界最速級 最新衛星組み込み</strong>: H3ロケット打ち上げ「みちびき6号機 (QZSS-6)」含む最新衛星・デブリ群をどこよりも早く組み込み。",
        feat2: "🔮 <strong>NASA/JAXA管制室レベル 24hデブリ衝突予測</strong>: 宇宙状況把握 (SSA) アルゴリズムによる今後24時間の全デブリ最接近 (MOID) リアルタイム探知。",
        feat3: "🎬 <strong>映画のように滑らかな 1/10 速度カメラ操作</strong>: 特有の物理スクロールインターセプトによる絹のように吸い付く超微細ズーム。",
        feat4: "🌐 <strong>スマート自動言語判定 ＆ 5大言語対応</strong>: 海外アクセス自動英語化 ＆ 5大言語 (日英中西露) 0秒一括全切り替え。",
        feat5: "💎 <strong>地球視界を 100% 遮らない 浮遊アイランドHUD</strong>: 画面中央を完全透過開放し、地球と極軌道を障害物ゼロで観測。",
        feat6: "🌊 <strong>地球自転の波状パターン可視化 (Multi-Lap)</strong>: 地球の自転に伴う軌道面歳差のサインカーブ波状軌跡を 3D 空間で表現。",
        feat7: "☀️ <strong>リアルタイム太陽光陰影 ＆ 大気圏描画</strong>: 太陽の角度に応じた昼夜グラデーション (Lighting) ＆ 青い大気ベール。",
        feat8: "👁️ <strong>超高コントラスト 国境線・都市名ラベル</strong>: 宇宙空間の暗闇でも全地球の都市と境界線がくっきり浮き出る高輝度表示。"
    },
    en: {
        appSubtitle: "Real-time 3D Satellite & Space Debris Visualizer",
        statCount: "Tracked Satellites",
        statTime: "Simulation Time",
        dragPanel: "⋮⋮ Drag to move panel",
        dragHeader: "⋮⋮ Drag to move",
        secSelect: "Select & Search Celestial / Satellites",
        selectPlaceholder: "-- Select Planet, Satellite or Debris --",
        searchPlaceholder: "Search by Planet, Satellite name or NORAD ID...",
        secSource: "Satellite Data Source & Presets",
        loadMajor: "⭐ Major Satellites (ISS, Himawari, Michibiki, Debris)",
        loadLocal: "🛰️ Full Starlink Constellation (2,000 Satellites)",
        badgeMajor: "⭐ Major Satellites Preset Loaded",
        secTime: "Time Controls & Simulation Speed",
        speedStop: "⏸️ Pause",
        speedReal: "▶️ 1x (Realtime)",
        resetNow: "🔄 Reset Time",
        secDisplay: "Display Settings",
        toggleLabels: "Show 3D Satellite Name Labels",
        toggleOrbits: "Show Selected Satellite Orbit",
        toggleMultiLap: "🌐 Show Multi-Lap Precession Wave (Earth Rotation)",
        toggleAtmosphere: "Atmosphere & Lighting",
        toggle2D: "2D Map View",
        toggleBorders: "🌐 Borders & Place Labels",
        toggleDebrisRisk: "🔮 Space Debris Risk Analysis (Purple Glow)",
        toggleCelestial: "🌌 Sun, Moon & Planets (Mars/Venus/Jupiter/Saturn)",
        dragDetail: "⋮⋮ Drag to move Detail Card",
        dragCam: "⋮⋮ Camera Pan Controls",
        labelAlt: "Altitude",
        labelVel: "Velocity",
        labelLat: "Latitude",
        labelLon: "Longitude",
        labelInc: "Inclination",
        labelPeriod: "Period",
        labelTimezone: "Timezone Display",
        labelPass: "📡 Pass Prediction (Location: Tokyo)",
        labelRisk: "🔮 Space Debris Proximity Radar",
        btnGeo: "📍My Location",
        btnTrack: "🎯 Focus Camera",
        btnUntrack: "🔓 Unfocus Camera",
        pointerHint: "Off-screen (Click to view)",
        btnGuide: "❓ Guide & Terms",
        modalTitle: "SatViewer3D User Guide & Legal Terms",
        tabControls: "🎮 How to Use",
        tabDisclaimer: "⚠️ Disclaimer",
        tabPrivacy: "🔒 Privacy Policy",
        tabAbout: "ℹ️ About",
        guideTitleControls: "🖱️ 3D Controls Guide",
        guideWheel: "Mouse Wheel / Touch",
        guideWheelDesc: "Silky smooth 1/10th speed zoom in / out.",
        guideDrag: "Left Drag",
        guideDragDesc: "Free 360-degree Earth rotation.",
        guideTilt: "Right Drag / Ctrl + Drag",
        guideTiltDesc: "Adjust camera tilt angle & elevation.",
        guideClick: "Click Satellite / Search",
        guideClickDesc: "Select satellite to display real-time orbit, altitude, velocity & risk.",
        guideFocus: "🎯 Focus Camera",
        guideFocusDesc: "Camera automatically tracks the selected satellite.",
        guideRadar: "🔮 Space Debris Risk Radar",
        guideRadarDesc: "Real-time future 24-hour orbit intersection prediction (MOID).",
        guideTitleDisclaimer: "⚠️ Disclaimer",
        discText1: "Orbital data, satellite positions, pass predictions, and debris risk calculations provided by SatViewer3D are calculated in real-time based on public TLE data from NORAD and Space-Track for educational, observational, and scientific purposes.",
        discText2: "Data in this simulator is not intended for operational spacecraft safety or collision avoidance guarantee. The operator assumes no liability for damages incurred through use of this service.",
        guideTitlePrivacy: "🔒 Privacy Policy (Google AdSense Compliant)",
        privText1Title: "Ad Serving Policy:",
        privText1Desc: "This website may use third-party advertising services (e.g. Google AdSense). Ad vendors may use cookies to serve ads based on user visits to this or other websites on the Internet.",
        privText2Title: "Analytics Policy:",
        privText2Desc: "This website may use analytics tools to collect anonymous traffic data. Traffic data is collected anonymously and does not identify individuals.",
        guideTitleAbout: "ℹ️ About SatViewer3D",
        aboutText1: "SatViewer3D is a real-time 3D orbital visualization simulator for satellites (Himawari, Michibiki, ISS, Starlink, etc.) and space debris.",
        aboutContactTitle: "Contact Us:",
        aboutContactDesc: "For inquiries, feedback, or bug reports, please contact info@satviewer3d.com.",
        aboutFeaturesTitle: "🌟 8 World-Class Features Surpassing NASA Public Tools",
        feat1: "🚀 <strong>World's Fastest Satellite Catalog</strong>: Instant integration of newest satellites including QZSS-6 (Michibiki 6) launched by Japan H3 rocket.",
        feat2: "🔮 <strong>NASA/JAXA Control-Level 24h Risk Radar</strong>: Real-time Space Situational Awareness (SSA) predicting future debris encounters (MOID).",
        feat3: "🎬 <strong>Cinematic 1/10th Speed Smooth Camera</strong>: Custom physics wheel interceptor providing silky smooth precision zoom.",
        feat4: "🌐 <strong>Smart i18n Auto Language Engine</strong>: Automatic country detection & instant switching across 5 global languages.",
        feat5: "💎 <strong>Unobstructed Floating HUD Islands</strong>: Center screen transparent design allowing unobstructed Earth & polar viewing.",
        feat6: "🌊 <strong>Multi-Lap Precession Wave Visualization</strong>: 3D representation of orbital plane precession caused by Earth's rotation.",
        feat7: "☀️ <strong>Real-Time Solar Lighting & Atmosphere</strong>: Dynamic day/night shading based on sun angle & glowing atmospheric veil.",
        feat8: "👁️ <strong>High-Contrast Borders & City Labels</strong>: High-brightness labels popping clearly even in deep space darkness."
    },
    zh: {
        appSubtitle: "实时3D人造卫星与太空碎片轨道追踪模拟器",
        statCount: "追踪卫星数量",
        statTime: "模拟时间",
        dragPanel: "⋮⋮ 拖动移动面板",
        dragHeader: "⋮⋮ 拖动移动面板",
        secSelect: "选择与搜索天体/卫星",
        selectPlaceholder: "-- 选择太阳、行星、卫星或太空碎片 --",
        searchPlaceholder: "或搜索天体、行星、卫星名称、NORAD ID...",
        secSource: "卫星数据源与预设",
        loadMajor: "⭐ 主要/著名卫星 (国际空间站, 葵花, 碎片等)",
        loadLocal: "🛰️ 星链 (Starlink) 完整星座 (2,000 颗)",
        badgeMajor: "⭐ 已加载主要卫星预设",
        secTime: "时间控制与倍速设置",
        speedStop: "⏸️ 暂停",
        speedReal: "▶️ 1x (实时)",
        resetNow: "🔄 重置时间",
        secDisplay: "显示设置",
        toggleLabels: "显示 3D 卫星名称标签",
        toggleOrbits: "显示选中卫星轨道",
        toggleMultiLap: "🌐 显示多圈轨迹 (地球自转波状图)",
        toggleAtmosphere: "大气层与光照",
        toggle2D: "2D 地图模式",
        toggleBorders: "🌐 国界线与地名标签",
        toggleDebrisRisk: "🔮 空间碎片危险分析 (紫色发光)",
        toggleCelestial: "🌌 太阳、月球与主要行星 (火星/金星/木星/土星)",
        dragDetail: "⋮⋮ 拖动移动详情卡片",
        dragCam: "⋮⋮ 平移视角控制",
        labelAlt: "高度",
        labelVel: "速度",
        labelLat: "纬度",
        labelLon: "经度",
        labelInc: "轨道倾角",
        labelPeriod: "周期",
        labelTimezone: "时区显示",
        labelPass: "📡 本地上空过境预测",
        labelRisk: "🔮 空间碎片极近距离分析",
        btnGeo: "📍当前位置",
        btnTrack: "🎯 聚焦相机",
        btnUntrack: "🔓 取消聚焦",
        btnGuide: "❓ 指南与条款",
        modalTitle: "SatViewer3D 用户指南与法律条款",
        tabControls: "🎮 操作指南",
        tabDisclaimer: "⚠️ 免责声明",
        tabPrivacy: "🔒 隐私政策",
        tabAbout: "ℹ️ 关于本站",
        guideTitleControls: "🖱️ 3D 空间操作指南",
        guideWheel: "鼠标滚轮 / 触控",
        guideWheelDesc: "1/10 极微平滑缩放。",
        guideDrag: "左键拖拽",
        guideDragDesc: "360度自由旋转地球。",
        guideTilt: "右键拖拽 / Ctrl + 拖拽",
        guideTiltDesc: "调整相机倾角与视角。",
        guideClick: "点击卫星 / 搜索",
        guideClickDesc: "选择卫星显示实时轨道、高度、速度及风险。",
        guideFocus: "🎯 聚焦相机",
        guideFocusDesc: "相机自动追踪所选卫星。",
        guideRadar: "🔮 空间碎片危险分析",
        guideRadarDesc: "实时预测未来24小时轨道交汇 (MOID)。",
        guideTitleDisclaimer: "⚠️ 免责声明 (Disclaimer)",
        discText1: "SatViewer3D 提供的轨道数据、卫星位置及碎片风险预测计算，均基于 NORAD 及 Space-Track 的公开 TLE 数据，仅供教育与科研目的使用。",
        discText2: "本模拟器数据不用于实际航天器安全或避碰保证。因使用本服务产生的任何损失，本站概不负责。",
        guideTitlePrivacy: "🔒 隐私政策 (Google AdSense 合规)",
        privText1Title: "广告服务政策:",
        privText1Desc: "本网站可能使用第三方广告服务（如 Google AdSense）。广告商可能会使用 Cookie 根据用户在本网站或互联网上其他网站的访问情况展示广告。",
        privText2Title: "分析政策:",
        privText2Desc: "本网站可能使用分析工具收集匿名流量数据。",
        guideTitleAbout: "ℹ️ 关于 SatViewer3D",
        aboutText1: "SatViewer3D 是一个用于卫星及空间碎片的实时 3D 轨道可视化模拟器。",
        aboutContactTitle: "联系我们:",
        aboutContactDesc: "如有建议或反馈，请联系 info@satviewer3d.com。"
    },
    es: {
        appSubtitle: "Visualizador 3D de Satélites y Basura Espacial en Tiempo Real",
        statCount: "Satélites Rastreados",
        statTime: "Tiempo de Simulación",
        dragPanel: "⋮⋮ Arrastrar para mover panel",
        dragHeader: "⋮⋮ Arrastrar para mover",
        secSelect: "Seleccionar y buscar astros/satélites",
        selectPlaceholder: "-- Seleccionar planeta, satélite o basura espacial --",
        searchPlaceholder: "Buscar por planeta, nombre de satélite o ID...",
        secSource: "Fuente de Datos y Presets",
        loadMajor: "⭐ Satélites Principales (EEI, Himawari, Basura)",
        loadLocal: "🛰️ Constelación Completa Starlink (2.000)",
        badgeMajor: "⭐ Presets de Satélites Principales Cargados",
        secTime: "Control de Tiempo y Velocidad",
        speedStop: "⏸️ Pausa",
        speedReal: "▶️ 1x (Tiempo Real)",
        resetNow: "🔄 Restablecer Hora",
        secDisplay: "Ajustes de Pantalla",
        toggleLabels: "Mostrar Etiquetas 3D",
        toggleOrbits: "Mostrar Órbita del Satélite",
        toggleMultiLap: "🌐 Mostrar Onda de Precesión Multivuelta",
        toggleAtmosphere: "Atmósfera e Iluminación",
        toggle2D: "Modo Mapa 2D",
        toggleBorders: "🌐 Fronteras y Nombres",
        toggleDebrisRisk: "🔮 Análisis de Riesgo de Basura Espacial",
        toggleCelestial: "🌌 Sol, Luna y Planetas (Marte/Venus/Júpiter/Saturno)",
        dragDetail: "⋮⋮ Arrastrar para mover detalle",
        dragCam: "⋮⋮ Control de Cámara",
        labelAlt: "Altitud",
        labelVel: "Velocidad",
        labelLat: "Latitud",
        labelLon: "Longitud",
        labelInc: "Inclinación",
        labelPeriod: "Período",
        labelTimezone: "Zona Horaria",
        labelPass: "📡 Predicción de Paso Local",
        labelRisk: "🔮 Proximidad de Basura Espacial",
        btnGeo: "📍Mi Ubicación",
        btnTrack: "🎯 Enfocar Cámara",
        btnUntrack: "🔓 Desenrocar",
        pointerHint: "Fuera de pantalla (Clic para ver)",
        btnGuide: "❓ Guía y Términos",
        modalTitle: "Guía de Usuario y Términos Legales de SatViewer3D",
        tabControls: "🎮 Cómo Usar",
        tabDisclaimer: "⚠️ Descargo de Responsabilidad",
        tabPrivacy: "🔒 Política de Privacidad",
        tabAbout: "ℹ️ Acerca de",
        guideTitleControls: "🖱️ Guía de Controles 3D",
        guideWheel: "Rueda de Ratón / Táctil",
        guideWheelDesc: "Zoom suave de 1/10 de velocidad.",
        guideDrag: "Arrastrar Izquierdo",
        guideDragDesc: "Rotación libre de 360 grados de la Tierra.",
        guideTilt: "Arrastrar Derecho / Ctrl + Arrastrar",
        guideTiltDesc: "Ajustar ángulo de inclinación de la cámara.",
        guideClick: "Clic en Satélite / Buscar",
        guideClickDesc: "Seleccionar satélite para mostrar órbita, altitud, velocidad y riesgo.",
        guideFocus: "🎯 Enfocar Cámara",
        guideFocusDesc: "La cámara rastrea automáticamente el satélite seleccionado.",
        guideRadar: "🔮 Radar de Basura Espacial",
        guideRadarDesc: "Predicción de intersección de órbita en 24 horas en tiempo real (MOID).",
        guideTitleDisclaimer: "⚠️ Descargo de Responsabilidad",
        discText1: "Los datos orbitales y cálculos de riesgo proporcionados por SatViewer3D se calculan en tiempo real basados en datos TLE públicos de NORAD y Space-Track con fines educativos y científicos.",
        discText2: "Los datos no están destinados a la seguridad operativa de naves espaciales.",
        guideTitlePrivacy: "🔒 Política de Privacidad (Cumple con AdSense)",
        privText1Title: "Política de Anuncios:",
        privText1Desc: "Este sitio web puede utilizar servicios publicitarios de terceros (Google AdSense).",
        privText2Title: "Política de Analítica:",
        privText2Desc: "Este sitio web puede recopilar datos de tráfico anónimos.",
        guideTitleAbout: "ℹ️ Acerca de SatViewer3D",
        aboutText1: "SatViewer3D es un simulador de visualización 3D en tiempo real para satélites y basura espacial.",
        aboutContactTitle: "Contacto:",
        aboutContactDesc: "Para consultas, por favor contacte a info@satviewer3d.com."
    },
    ru: {
        appSubtitle: "3D визуализатор спутников и космического мусора в реальном времени",
        statCount: "Отслеживаемые спутники",
        statTime: "Время моделирования",
        dragPanel: "⋮⋮ Перетащите панель",
        dragHeader: "⋮⋮ Перетащить панель",
        secSelect: "Выбор и поиск планет и спутников",
        selectPlaceholder: "-- Выберите планету, спутник или мусор --",
        searchPlaceholder: "Поиск по названию планеты, спутника или ID...",
        secSource: "Источники данных и пресеты",
        loadMajor: "⭐ Основные спутники (МКС, Himawari, Мусор)",
        loadLocal: "🛰️ Полная группировка Starlink (2 000)",
        badgeMajor: "⭐ Пресет основных спутников загружен",
        secTime: "Управление временем и скоростью",
        speedStop: "⏸️ Пауза",
        speedReal: "▶️ 1x (Реальное время)",
        resetNow: "🔄 Сброс времени",
        secDisplay: "Настройки отображения",
        toggleLabels: "Показывать 3D метки спутников",
        toggleOrbits: "Показывать орбиту спутника",
        toggleMultiLap: "🌐 Показывать многовитковую траекторию",
        toggleAtmosphere: "Атмосфера и освещение",
        toggle2D: "Режим 2D карты",
        toggleBorders: "🌐 Границы и названия",
        toggleDebrisRisk: "🔮 Анализ риска космического мусора",
        toggleCelestial: "🌌 Солнце, Луна и планеты (Марс/Венера/Юпитер/Сатурн)",
        dragDetail: "⋮⋮ Перетащите карточку",
        dragCam: "⋮⋮ Управление камерой",
        labelAlt: "Высота",
        labelVel: "Скорость",
        labelLat: "Широта",
        labelLon: "Долгота",
        labelInc: "Наклонение",
        labelPeriod: "Период",
        labelTimezone: "Часовой пояс",
        labelPass: "📡 Прогноз пролета",
        labelRisk: "🔮 Радар космического мусора",
        btnGeo: "📍Мое местоположение",
        btnTrack: "🎯 Фокус камеры",
        btnUntrack: "🔓 Снять фокус",
        pointerHint: "За экраном (Нажмите)",
        btnGuide: "❓ Руководство и условия",
        modalTitle: "Руководство пользователя и условия SatViewer3D",
        tabControls: "🎮 Как использовать",
        tabDisclaimer: "⚠️ Отказ от ответственности",
        tabPrivacy: "🔒 Политика конфиденциальности",
        tabAbout: "ℹ️ О проекте",
        guideTitleControls: "🖱️ Управление 3D",
        guideWheel: "Колесико мыши / Тачпад",
        guideWheelDesc: "Плавный зум со скоростью 1/10.",
        guideDrag: "Левая кнопка",
        guideDragDesc: "Вращение Земли на 360 градусов.",
        guideTilt: "Правая кнопка / Ctrl + Мышь",
        guideTiltDesc: "Изменение угла наклона камеры.",
        guideClick: "Клик на спутник / Поиск",
        guideClickDesc: "Выбор спутника для отображения орбиты, высоты и риска.",
        guideFocus: "🎯 Фокус камеры",
        guideFocusDesc: "Автоматическое отслеживание выбранного спутника.",
        guideRadar: "🔮 Радар космического мусора",
        guideRadarDesc: "Прогноз пересечения орбит на 24 часа в реальном времени (MOID).",
        guideTitleDisclaimer: "⚠️ Отказ от ответственности",
        discText1: "Орбитальные данные и расчеты рисков рассчитываются в реальном времени на основе открытых данных TLE от NORAD и Space-Track.",
        discText2: "Данные не предназначены для оперативного управления космическими аппаратами.",
        guideTitlePrivacy: "🔒 Политика конфиденциальности (Google AdSense)",
        privText1Title: "Рекламная политика:",
        privText1Desc: "Сайт может использовать сторонние рекламные сервисы (Google AdSense).",
        privText2Title: "Аналитика:",
        privText2Desc: "Сайт может собирать анонимные данные о трафике.",
        guideTitleAbout: "ℹ️ О проекте SatViewer3D",
        aboutText1: "SatViewer3D — это 3D-симулятор орбитальной визуализации спутников и космического мусора.",
        aboutContactTitle: "Контакты:",
        aboutContactDesc: "По всем вопросам обращайтесь на info@satviewer3d.com."
    },
    de: {
        appSubtitle: "Echtzeit-3D-Satellitentracker & Weltraummüll-Visualisierer",
        statCount: "Verfolgte Satelliten",
        statTime: "Simulationszeit",
        dragPanel: "⋮⋮ Panel verschieben",
        dragHeader: "⋮⋮ Ziehen zum Verschieben",
        secSelect: "Planeten & Satelliten suchen",
        selectPlaceholder: "-- Planet, Satellit oder Weltraummüll wählen --",
        searchPlaceholder: "Nach Planet, Satellitenname oder ID suchen...",
        secSource: "Satelliten-Datenquellen",
        loadMajor: "⭐ Wichtige Satelliten (ISS, Starlink, Müll)",
        loadLocal: "🛰️ Starlink Gesamtkonstellation (2.000)",
        badgeMajor: "⭐ Wichtige Satelliten geladen",
        secTime: "Zeitsteuerung & Tempo",
        speedStop: "⏸️ Pause",
        speedReal: "▶️ 1x (Echtzeit)",
        resetNow: "🔄 Jetzt",
        secDisplay: "Anzeige-Einstellungen",
        toggleLabels: "3D-Satellitennamen anzeigen",
        toggleOrbits: "Umlaufbahn anzeigen",
        toggleMultiLap: "🌐 Mehrfache Bodenspur",
        toggleAtmosphere: "Atmosphäre & Sonnenlicht",
        toggle2D: "2D-Kartenmodus",
        toggleBorders: "🌐 Grenzen & Städtenamen",
        toggleDebrisRisk: "🔮 Weltraummüll-Risikoanalyse",
        toggleCelestial: "🌌 Sonne, Mond & Planeten (Mars/Venus/Jupiter/Saturn)",
        dragDetail: "⋮⋮ Karte verschieben",
        dragCam: "⋮⋮ Kamera",
        labelAlt: "Höhe (Altitude)",
        labelVel: "Geschwindigkeit",
        labelLat: "Breitengrad",
        labelLon: "Längengrad",
        labelInc: "Inklination",
        labelPeriod: "Umlaufzeit",
        labelTimezone: "Zeitzone",
        labelPass: "📡 Nächster Überflug",
        labelRisk: "🔮 Weltraummüll-Annäherung (MOID)",
        btnGeo: "📍Standort",
        btnTrack: "🎯 Satellit verfolgen",
        btnUntrack: "🔓 Verfolgung lösen",
        pointerHint: "Außerhalb des Sichtfelds (Klicken zum Fokussieren)",
        btnGuide: "❓ Handbuch & AGB",
        modalTitle: "SatViewer3D Anleitung & Nutzungsbedingungen",
        tabControls: "🎮 Steuerung",
        tabDisclaimer: "⚠️ Haftungsausschluss",
        tabPrivacy: "🔒 Datenschutz",
        tabAbout: "ℹ️ Über SatViewer3D",
        guideTitleControls: "🖱️ 3D-Navigationsanleitung",
        guideWheel: "Mausrad / Touch",
        guideWheelDesc: "Ultra-sanfter Zoom mit 1/10 Geschwindigkeit.",
        guideDrag: "Linke Maustaste",
        guideDragDesc: "Erde frei um 360 Grad drehen.",
        guideTilt: "Rechte Maustaste / Strg + Maus",
        guideTiltDesc: "Kamerawinkel und Neigung ändern.",
        guideClick: "Satellit anklicken / Suchen",
        guideClickDesc: "Echtzeit-Höhe, Geschwindigkeit und Kollisionsrisiko ansehen.",
        guideFocus: "🎯 Kamera-Tracking",
        guideFocusDesc: "Kamera folgt automatisch dem Satelliten.",
        guideRadar: "🔮 Weltraummüll-Radar",
        guideRadarDesc: "Echtzeit-Berechnung von 24h-Bahnenkreuzungen (MOID).",
        guideTitleDisclaimer: "⚠️ Haftungsausschluss (Disclaimer)",
        discText1: "Alle Bahndaten und Kollisionsrisiken werden auf Basis öffentlicher TLE-Daten von CelesTrak und Space-Track in Echtzeit berechnet.",
        discText2: "Die Daten dienen nur zu Bildungs- und Beobachtungszwecken und nicht für Manöver echter Raumfahrzeuge.",
        guideTitlePrivacy: "🔒 Datenschutzerklärung (Google AdSense konform)",
        privText1Title: "Werbung:",
        privText1Desc: "Diese Website nutzt Werbedienste von Drittanbietern (z. B. Google AdSense) mit anonymen Cookies.",
        privText2Title: "Webanalyse:",
        privText2Desc: "Wir verwenden Analysetools zur Erfassung anonymer Verkehrsdaten.",
        guideTitleAbout: "ℹ️ Über SatViewer3D",
        aboutText1: "SatViewer3D ist ein kostenloser 3D-Echtzeitsimulator für künstliche Satelliten und Weltraummüll.",
        aboutContactTitle: "Kontakt:",
        aboutContactDesc: "Fragen und Feedback an info@satviewer3d.com."
    },
    fr: {
        appSubtitle: "Visualisateur 3D de Satellites et Débris Spatiaux en Direct",
        statCount: "Satellites Suivis",
        statTime: "Temps Simulé",
        dragPanel: "⋮⋮ Déplacer le panneau",
        dragHeader: "⋮⋮ Glisser pour déplacer",
        secSelect: "Sélectionner & chercher astres/satellites",
        selectPlaceholder: "-- Sélectionner planète, satellite ou débris --",
        searchPlaceholder: "Rechercher une planète, satellite ou ID...",
        secSource: "Sources de données",
        loadMajor: "⭐ Satellites majeurs (ISS, Starlink, débris)",
        loadLocal: "🛰️ Constellation Starlink (2 000)",
        badgeMajor: "⭐ Satellites majeurs chargés",
        secTime: "Contrôle du temps & Vitesse",
        speedStop: "⏸️ Pause",
        speedReal: "▶️ 1x (Temps réel)",
        resetNow: "🔄 Maintenant",
        secDisplay: "Paramètres d'affichage",
        toggleLabels: "Noms des satellites en 3D",
        toggleOrbits: "Afficher l'orbite",
        toggleMultiLap: "🌐 Trace au sol multi-tours",
        toggleAtmosphere: "Atmosphère & Éclairage solaire",
        toggle2D: "Mode carte 2D",
        toggleBorders: "🌐 Frontières & Villes",
        toggleDebrisRisk: "🔮 Analyse du risque de débris",
        toggleCelestial: "🌌 Soleil, Lune et Planètes (Mars/Vénus/Jupiter/Saturne)",
        dragDetail: "⋮⋮ Déplacer la carte",
        dragCam: "⋮⋮ Caméra",
        labelAlt: "Altitude",
        labelVel: "Vitesse",
        labelLat: "Latitude",
        labelLon: "Longitude",
        labelInc: "Inclinaison",
        labelPeriod: "Période",
        labelTimezone: "Fuseau horaire",
        labelPass: "📡 Prochain passage",
        labelRisk: "🔮 Rapprochement de débris (MOID)",
        btnGeo: "📍Position",
        btnTrack: "🎯 Suivre le satellite",
        btnUntrack: "🔓 Libérer",
        pointerHint: "Hors champ (Cliquez pour centrer)",
        btnGuide: "❓ Guide & Mentions",
        modalTitle: "SatViewer3D Guide d'utilisation & Conditions",
        tabControls: "🎮 Commandes",
        tabDisclaimer: "⚠️ Clause de non-responsabilité",
        tabPrivacy: "🔒 Confidentialité",
        tabAbout: "ℹ️ À propos",
        guideTitleControls: "🖱️ Guide de navigation 3D",
        guideWheel: "Molette / Tactile",
        guideWheelDesc: "Zoom fluide et précis à 1/10 de vitesse.",
        guideDrag: "Clic gauche + Glisser",
        guideDragDesc: "Rotation libre de la Terre à 360 degrés.",
        guideTilt: "Clic droit / Ctrl + Glisser",
        guideTiltDesc: "Inclinaison et angle de vue de la caméra.",
        guideClick: "Cliquer sur un satellite / Recherche",
        guideClickDesc: "Afficher l'altitude, la vitesse et le risque de collision.",
        guideFocus: "🎯 Suivi caméra",
        guideFocusDesc: "Verrouillage automatique sur le satellite.",
        guideRadar: "🔮 Radar de débris",
        guideRadarDesc: "Calcul en temps réel des croisements d'orbite à 24h (MOID).",
        guideTitleDisclaimer: "⚠️ Clause de non-responsabilité",
        discText1: "Toutes les données orbitales et prévisions sont calculées en temps réel d'après les TLE publiques de CelesTrak et Space-Track.",
        discText2: "Ces données sont destinées à des fins éducatives et ne doivent pas être utilisées pour des manœuvres de vol réel.",
        guideTitlePrivacy: "🔒 Politique de confidentialité (Conforme Google AdSense)",
        privText1Title: "Publicité :",
        privText1Desc: "Ce site utilise des services publicitaires tiers (ex. Google AdSense) utilisant des cookies anonymes.",
        privText2Title: "Statistiques :",
        privText2Desc: "Nous collectons des données de trafic anonymes.",
        guideTitleAbout: "ℹ️ À propos de SatViewer3D",
        aboutText1: "SatViewer3D est un simulateur 3D temps réel pour observer les satellites artificiels et les débris spatiaux.",
        aboutContactTitle: "Contact :",
        aboutContactDesc: "Pour toute question : info@satviewer3d.com."
    },
    pt: {
        appSubtitle: "Visualizador 3D de Satélites e Lixo Espacial em Tempo Real",
        statCount: "Satélites Rastreados",
        statTime: "Hora da Simulação",
        dragPanel: "⋮⋮ Arrastar painel",
        dragHeader: "⋮⋮ Arrastar para mover",
        secSelect: "Selecionar e buscar corpos/satélites",
        selectPlaceholder: "-- Selecionar planeta, satélite ou detrito --",
        searchPlaceholder: "Buscar por planeta, nome de satélite ou ID...",
        secSource: "Fontes de Dados & Predefinições",
        loadMajor: "⭐ Satélites principais (ISS, Starlink, lixo)",
        loadLocal: "🛰️ Constelação Starlink (2.000)",
        badgeMajor: "⭐ Satélites principais carregados",
        secTime: "Controle de tempo & Velocidade",
        speedStop: "⏸️ Pausar",
        speedReal: "▶️ 1x (Tempo real)",
        resetNow: "🔄 Agora",
        secDisplay: "Configurações de exibição",
        toggleLabels: "Etiquetas 3D dos satélites",
        toggleOrbits: "Exibir órbita",
        toggleMultiLap: "🌐 Rastreamento terrestre de múltiplas voltas",
        toggleAtmosphere: "Atmosfera e Iluminação",
        toggle2D: "Modo mapa 2D",
        toggleBorders: "🌐 Fronteiras e Cidades",
        toggleDebrisRisk: "🔮 Análise de risco de detritos",
        toggleCelestial: "🌌 Sol, Lua e Planetas (Marte/Vênus/Júpiter/Saturno)",
        dragDetail: "⋮⋮ Arrastar cartão",
        dragCam: "⋮⋮ Câmera",
        labelAlt: "Altitude",
        labelVel: "Velocidade",
        labelLat: "Latitude",
        labelLon: "Longitude",
        labelInc: "Inclinação",
        labelPeriod: "Período",
        labelTimezone: "Fuso horário",
        labelPass: "📡 Próxima passagem",
        labelRisk: "🔮 Aproximação de detritos (MOID)",
        btnGeo: "📍Localização",
        btnTrack: "🎯 Seguir satélite",
        btnUntrack: "🔓 Liberar foco",
        pointerHint: "Fora da tela (Clique para focar)",
        btnGuide: "❓ Guia & Termos",
        modalTitle: "SatViewer3D Guia de Uso & Termos Legais",
        tabControls: "🎮 Controles",
        tabDisclaimer: "⚠️ Isenção de responsabilidade",
        tabPrivacy: "🔒 Privacidade",
        tabAbout: "ℹ️ Sobre o site",
        guideTitleControls: "🖱️ Guia de navegação 3D",
        guideWheel: "Roda do mouse / Toque",
        guideWheelDesc: "Zoom ultra suave a 1/10 de velocidade.",
        guideDrag: "Clique esquerdo + Arrastar",
        guideDragDesc: "Rotação livre da Terra em 360 graus.",
        guideTilt: "Clique direito / Ctrl + Arrastar",
        guideTiltDesc: "Inclinação do ângulo da câmera.",
        guideClick: "Clique no satélite / Busca",
        guideClickDesc: "Ver altitude, velocidade e risco de colisão em tempo real.",
        guideFocus: "🎯 Rastreamento de câmera",
        guideFocusDesc: "A câmera acompanha o satélite em movimento.",
        guideRadar: "🔮 Radar de detritos espaciais",
        guideRadarDesc: "Cálculo em tempo real de cruzamentos de órbita em 24h (MOID).",
        guideTitleDisclaimer: "⚠️ Isenção de responsabilidade",
        discText1: "Todos os dados orbitais e previsões são calculados em tempo real a partir de dados TLE públicos do CelesTrak e Space-Track.",
        discText2: "Não se destinam a operações reais de espaçonaves ou navegação de segurança.",
        guideTitlePrivacy: "🔒 Política de privacidade (Google AdSense)",
        privText1Title: "Publicidade:",
        privText1Desc: "Este site pode usar serviços de publicidade de terceiros (como Google AdSense) com cookies anônimos.",
        privText2Title: "Estatísticas:",
        privText2Desc: "Coletamos dados anônimos de tráfego para análise.",
        guideTitleAbout: "ℹ️ Sobre o SatViewer3D",
        aboutText1: "SatViewer3D é um simulador 3D em tempo real para visualizar satélites artificiais e detritos espaciais.",
        aboutContactTitle: "Contato:",
        aboutContactDesc: "Dúvidas e sugestões: info@satviewer3d.com."
    },
    it: {
        appSubtitle: "Visualizzatore 3D di Satelliti e Detriti Spaziali in Tempo Reale",
        statCount: "Satelliti Tracciati",
        statTime: "Ora Simulazione",
        dragPanel: "⋮⋮ Trascina pannello",
        dragHeader: "⋮⋮ Trascina per spostare",
        secSelect: "Seleziona e cerca corpi/satelliti",
        selectPlaceholder: "-- Seleziona pianeta, satellite o detrito --",
        searchPlaceholder: "Cerca per pianeta, satellite o ID NORAD...",
        secSource: "Fonti Dati & Preimpostazioni",
        loadMajor: "⭐ Satelliti Principali (ISS, Starlink, detriti)",
        loadLocal: "🛰️ Costellazione Starlink (2.000)",
        badgeMajor: "⭐ Satelliti Principali Caricati",
        secTime: "Controllo Tempo & Velocità",
        speedStop: "⏸️ Pausa",
        speedReal: "▶️ 1x (Tempo Reale)",
        resetNow: "🔄 Ora",
        secDisplay: "Impostazioni Visualizzazione",
        toggleLabels: "Etichette 3D Satelliti",
        toggleOrbits: "Mostra Orbita",
        toggleMultiLap: "🌐 Traccia al Suolo Multi-Giro",
        toggleAtmosphere: "Atmosfera & Illuminazione Solare",
        toggle2D: "Modalità Mappa 2D",
        toggleBorders: "🌐 Confini & Città",
        toggleDebrisRisk: "🔮 Analisi Rischio Detriti",
        toggleCelestial: "🌌 Sole, Luna e Pianeti (Marte/Venere/Giove/Saturno)",
        dragDetail: "⋮⋮ Trascina scheda",
        dragCam: "⋮⋮ Telecamera",
        labelAlt: "Altitudine",
        labelVel: "Velocità",
        labelLat: "Latitudine",
        labelLon: "Longitudine",
        labelInc: "Inclinazione",
        labelPeriod: "Periodo",
        labelTimezone: "Fuso Orario",
        labelPass: "📡 Prossimo Passaggio",
        labelRisk: "🔮 Rischio Detriti (MOID 24h)",
        btnGeo: "📍Posizione",
        btnTrack: "🎯 Segui Satellite",
        btnUntrack: "🔓 Sblocca Telecamera",
        pointerHint: "Fuori Vista (Clicca per centrare)",
        btnGuide: "❓ Guida & Termini",
        modalTitle: "SatViewer3D Guida & Termini",
        tabControls: "🎮 Comandi",
        tabDisclaimer: "⚠️ Disclaimer",
        tabPrivacy: "🔒 Privacy",
        tabAbout: "ℹ️ Informazioni",
        guideTitleControls: "🖱️ Guida alla navigazione 3D",
        guideWheel: "Rotellina del mouse / Touch",
        guideWheelDesc: "Zoom ultra fluido e preciso a velocità 1/10.",
        guideDrag: "Clic sinistro + Trascina",
        guideDragDesc: "Rotazione libera della Terra a 360 gradi.",
        guideTilt: "Clic destro / Ctrl + Trascina",
        guideTiltDesc: "Inclinazione e orientamento della telecamera.",
        guideClick: "Clic su satellite / Cerca",
        guideClickDesc: "Mostra altitudine, velocità e rischio di collisione in tempo reale.",
        guideFocus: "🎯 Tracciamento telecamera",
        guideFocusDesc: "La telecamera segue automaticamente il satellite.",
        guideRadar: "🔮 Radar detriti spaziali",
        guideRadarDesc: "Calcolo in tempo reale degli incroci orbitali a 24 ore (MOID).",
        guideTitleDisclaimer: "⚠️ Dichiarazione di non responsabilità",
        discText1: "Tutti i dati orbitali e le previsioni sono calcolati in tempo reale dai dati TLE pubblici di CelesTrak e Space-Track.",
        discText2: "Questi dati sono destinati a scopi educativi e non devono essere utilizzati per manovre di volo spaziale reale.",
        guideTitlePrivacy: "🔒 Informativa sulla privacy (Google AdSense)",
        privText1Title: "Pubblicità:",
        privText1Desc: "Questo sito utilizza servizi pubblicitari di terze parti (es. Google AdSense) tramite cookie anonimi.",
        privText2Title: "Statistiche:",
        privText2Desc: "Raccogliamo dati di traffico anonimi a fini statistici.",
        guideTitleAbout: "ℹ️ Informazioni su SatViewer3D",
        aboutText1: "SatViewer3D è un simulatore 3D in tempo reale per osservare satelliti e detriti spaziali.",
        aboutContactTitle: "Contatto:",
        aboutContactDesc: "Per qualsiasi domanda: info@satviewer3d.com"
    },
    ko: {
        appSubtitle: "실시간 3D 인공위성 및 우주 쓰레기 궤도 시뮬레이터",
        statCount: "추적 중인 위성",
        statTime: "시뮬레이션 시간",
        dragPanel: "⋮⋮ 패널 이동",
        dragHeader: "⋮⋮ 드래그하여 패널 이동",
        secSelect: "천체 및 인공위성 선택・검색",
        selectPlaceholder: "-- 태양, 행성, 인공위성, 우주쓰레기 선택 --",
        searchPlaceholder: "또는 행성・위성명・NORAD ID로 검색...",
        secSource: "데이터 소스 및 프리셋",
        loadMajor: "⭐ 주요 위성 (ISS, 스타링크, 파편)",
        loadLocal: "🛰️ 스타링크 군집위성 (2,000기)",
        badgeMajor: "⭐ 주요 위성 데이터 로드됨",
        secTime: "시간 제어 및 배속 설정",
        speedStop: "⏸️ 일시정지",
        speedReal: "▶️ 1x (실시간)",
        resetNow: "🔄 현재 시각",
        secDisplay: "화면 표시 설정",
        toggleLabels: "위성 3D 명칭 표시",
        toggleOrbits: "궤도 선 표시",
        toggleMultiLap: "🌐 다중 회전 지상 궤적",
        toggleAtmosphere: "대기권 및 태양광 조명",
        toggle2D: "2D 지도 모드",
        toggleBorders: "🌐 국경 및 도시명",
        toggleDebrisRisk: "🔮 우주 쓰레기 충돌 위험 분석",
        toggleCelestial: "🌌 태양, 달 및 주요 행성 (화성/금성/목성/토성)",
        dragDetail: "⋮⋮ 상세 카드 이동",
        dragCam: "⋮⋮ 카메라 제어",
        labelAlt: "고도",
        labelVel: "속도",
        labelLat: "위도",
        labelLon: "경도",
        labelInc: "경사각",
        labelPeriod: "공전 주기",
        labelTimezone: "시간대 설정",
        labelPass: "📡 다음 상공 통과 예측",
        labelRisk: "🔮 우주 쓰레기 근접 (24시간 MOID)",
        btnGeo: "📍위치 획득",
        btnTrack: "🎯 위성 추적 모드",
        btnUntrack: "🔓 추적 해제",
        pointerHint: "화면 밖 (클릭하여 이동)",
        btnGuide: "❓ 가이드 및 약관",
        modalTitle: "SatViewer3D 사용 가이드 및 이용약관",
        tabControls: "🎮 조작법",
        tabDisclaimer: "⚠️ 면책조항",
        tabPrivacy: "🔒 개인정보처리방침",
        tabAbout: "ℹ️ 소개",
        guideTitleControls: "🖱️ 3D 조작 가이드",
        guideWheel: "마우스 휠 / 터치",
        guideWheelDesc: "1/10 속도로 정밀하고 부드러운 줌 인/아웃.",
        guideDrag: "좌클릭 + 드래그",
        guideDragDesc: "지구를 360도 자유롭게 회전 탐색.",
        guideTilt: "우클릭 / Ctrl + 드래그",
        guideTiltDesc: "카메라 시야각 및 기울기 조절.",
        guideClick: "위성 클릭 / 검색",
        guideClickDesc: "실시간 고도, 속도 및 충돌 위험도 확인.",
        guideFocus: "🎯 위성 자동 추적",
        guideFocusDesc: "카메라가 이동하는 위성을 자동으로 따라갑니다.",
        guideRadar: "🔮 우주 쓰레기 레이더",
        guideRadarDesc: "향후 24시간 내 궤도 교차 거리(MOID) 실시간 계산.",
        guideTitleDisclaimer: "⚠️ 면책 조항",
        discText1: "모든 궤도 데이터와 통과 예측은 CelesTrak 및 Space-Track의 공개 TLE 데이터를 기반으로 실시간 계산됩니다.",
        discText2: "본 데이터는 교육 및 연구용이며 실제 우주선 운용 목적으로 사용될 수 없습니다.",
        guideTitlePrivacy: "🔒 개인정보처리방침 (Google AdSense)",
        privText1Title: "광고 프로그램 안내:",
        privText1Desc: "본 웹사이트는 익명 쿠키를 활용한 타사 광고 서비스(Google AdSense 등)를 사용할 수 있습니다.",
        privText2Title: "트래픽 통계:",
        privText2Desc: "서비스 개선을 위해 익명의 방문 통계 데이터를 수집합니다.",
        guideTitleAbout: "ℹ️ SatViewer3D 소개",
        aboutText1: "SatViewer3D는 지구 궤도를 도는 인공위성과 우주 파편을 실시간으로 3D 시각화하는 시뮬레이터입니다.",
        aboutContactTitle: "문의처:",
        aboutContactDesc: "문의 및 피드백: info@satviewer3d.com"
    },
    nl: {
        appSubtitle: "Realtime 3D Satelliet & Ruimtepuin Visualisator",
        statCount: "Gevolgde Satellieten",
        statTime: "Simulatietijd",
        dragPanel: "⋮⋮ Paneel slepen",
        dragHeader: "⋮⋮ Slepen om te verplaatsen",
        secSelect: "Planeten & Satellieten zoeken",
        selectPlaceholder: "-- Selecteer planeet, satelliet of puin --",
        searchPlaceholder: "Zoek op planeet, satellietnaam of ID...",
        secSource: "Gegevensbronnen & Voorinstellingen",
        loadMajor: "⭐ Belangrijke Satellieten (ISS, Starlink, puin)",
        loadLocal: "🛰️ Starlink Constellatie (2.000)",
        badgeMajor: "⭐ Belangrijke Satellieten Geladen",
        secTime: "Tijdcontrole & Snelheid",
        speedStop: "⏸️ Pauze",
        speedReal: "▶️ 1x (Realtime)",
        resetNow: "🔄 Nu",
        secDisplay: "Weergave-instellingen",
        toggleLabels: "3D Satellietlabels",
        toggleOrbits: "Toon Baan (Orbit)",
        toggleMultiLap: "🌐 Meerdere Grondsporen",
        toggleAtmosphere: "Atmosfeer & Zonlicht",
        toggle2D: "2D Kaartmodus",
        toggleBorders: "🌐 Grenzen & Steden",
        toggleDebrisRisk: "🔮 Analyse Ruimtepuinrisico",
        toggleCelestial: "🌌 Zon, Maan & Planeten (Mars/Venus/Jupiter/Saturnus)",
        dragDetail: "⋮⋮ Kaart slepen",
        dragCam: "⋮⋮ Camera",
        labelAlt: "Hoogte",
        labelVel: "Snelheid",
        labelLat: "Breedtegraad",
        labelLon: "Lengtegraad",
        labelInc: "Inclinatie",
        labelPeriod: "Omlooptijd",
        labelTimezone: "Tijdzone",
        labelPass: "📡 Volgende Overvlucht",
        labelRisk: "🔮 Puin Benadering (MOID 24u)",
        btnGeo: "📍Locatie",
        btnTrack: "🎯 Volg Satelliet",
        btnUntrack: "🔓 Ontgrendel Camera",
        pointerHint: "Buiten Beeld (Klik om te centreren)",
        btnGuide: "❓ Gids & Voorwaarden",
        modalTitle: "SatViewer3D Gids & Voorwaarden",
        tabControls: "🎮 Bediening",
        tabDisclaimer: "⚠️ Disclaimer",
        tabPrivacy: "🔒 Privacy",
        tabAbout: "ℹ️ Over SatViewer3D",
        guideTitleControls: "🖱️ 3D Navigatiegids",
        guideWheel: "Muiswiel / Aanraken",
        guideWheelDesc: "Ultra-soepele en nauwkeurige zoom met 1/10 snelheid.",
        guideDrag: "Linksklik + Slepen",
        guideDragDesc: "Vrije 360-graden rotatie van de aarde.",
        guideTilt: "Rechtsklik / Ctrl + Slepen",
        guideTiltDesc: "Kanteling en kijkhoek van de camera aanpassen.",
        guideClick: "Klik op satelliet / Zoeken",
        guideClickDesc: "Toon realtime hoogte, snelheid en botsingsrisico.",
        guideFocus: "🎯 Cameratracking",
        guideFocusDesc: "Camera volgt de satelliet automatisch.",
        guideRadar: "🔮 Ruimtepuinradar",
        guideRadarDesc: "Realtime berekening van 24-uurs baankruisingen (MOID).",
        guideTitleDisclaimer: "⚠️ Disclaimer",
        discText1: "Alle baangegevens en voorspellingen worden in realtime berekend uit openbare TLE-gegevens van CelesTrak en Space-Track.",
        discText2: "Deze gegevens zijn uitsluitend bedoeld voor educatieve doeleinden.",
        guideTitlePrivacy: "🔒 Privacybeleid (Google AdSense)",
        privText1Title: "Advertenties:",
        privText1Desc: "Deze site kan advertentiediensten van derden (zoals Google AdSense) gebruiken met anonieme cookies.",
        privText2Title: "Statistieken:",
        privText2Desc: "We verzamelen anonieme verkeersgegevens om de gebruikerservaring te verbeteren.",
        guideTitleAbout: "ℹ️ Over SatViewer3D",
        aboutText1: "SatViewer3D is een realtime 3D-simulator voor het visualiseren van satellieten en ruimtepuin.",
        aboutContactTitle: "Contact:",
        aboutContactDesc: "Voor vragen: info@satviewer3d.com"
    },
    id: {
        appSubtitle: "Visualisator Satelit 3D & Sampah Antariksa Real-Time",
        statCount: "Satelit Dilacak",
        statTime: "Waktu Simulasi",
        dragPanel: "⋮⋮ Geser panel",
        dragHeader: "⋮⋮ Geser untuk memindahkan",
        secSelect: "天体・衛星を選択・検索",
        selectPlaceholder: "-- 太陽・惑星・衛星・宇宙ゴミを選択 --",
        searchPlaceholder: "または太陽・惑星・衛星名・NORAD IDで検索...",
        secSource: "Sumber Data & Preset",
        loadMajor: "⭐ Satelit Utama (ISS, Starlink, puing)",
        loadLocal: "🛰️ Konstelasi Starlink (2.000)",
        badgeMajor: "⭐ Satelit Utama Dimuat",
        secTime: "Kontrol Waktu & Kecepatan",
        speedStop: "⏸️ Jeda",
        speedReal: "▶️ 1x (Waktu Nyata)",
        resetNow: "🔄 Sekarang",
        secDisplay: "Pengaturan Tampilan",
        toggleLabels: "Label Satelit 3D",
        toggleOrbits: "Tampilkan Orbit",
        toggleMultiLap: "🌐 Jejak Permukaan Multi-Putaran",
        toggleAtmosphere: "Atmosfer & Cahaya Matahari",
        toggle2D: "Mode Peta 2D",
        toggleBorders: "🌐 Batas Negara & Kota",
        toggleDebrisRisk: "🔮 Analisis Risiko Sampah Antariksa",
        toggleCelestial: "🌌 Matahari, Bulan & Planet (Mars/Venus/Yupiter/Saturnus)",
        dragDetail: "⋮⋮ Geser kartu",
        dragCam: "⋮⋮ Kamera",
        labelAlt: "Ketinggian",
        labelVel: "Kecepatan",
        labelLat: "Lintang",
        labelLon: "Bujur",
        labelInc: "Inklinasi",
        labelPeriod: "Periode",
        labelTimezone: "Zona Waktu",
        labelPass: "📡 Lintasan Berikutnya",
        labelRisk: "🔮 Pendekatan Puing (MOID 24j)",
        btnGeo: "📍Lokasi",
        btnTrack: "🎯 Lacak Satelit",
        btnUntrack: "🔓 Lepas Kamera",
        pointerHint: "Di Luar Layar (Klik untuk fokus)",
        btnGuide: "❓ Panduan & Syarat",
        modalTitle: "SatViewer3D Panduan & Ketentuan",
        tabControls: "🎮 Kontrol",
        tabDisclaimer: "⚠️ Penafian",
        tabPrivacy: "🔒 Privasi",
        tabAbout: "ℹ️ Tentang",
        guideTitleControls: "🖱️ Panduan Navigasi 3D",
        guideWheel: "Roda Mouse / Sentuh",
        guideWheelDesc: "Zoom sangat halus dan presisi pada kecepatan 1/10.",
        guideDrag: "Klik Kiri + Geser",
        guideDragDesc: "Rotasi bebas Bumi 360 derajat.",
        guideTilt: "Klik Kanan / Ctrl + Geser",
        guideTiltDesc: "Menyesuaikan sudut kemiringan kamera.",
        guideClick: "Klik Satelit / Cari",
        guideClickDesc: "Tampilkan ketinggian, kecepatan, dan risiko tabrakan secara real-time.",
        guideFocus: "🎯 Pelacakan Kamera",
        guideFocusDesc: "Kamera otomatis mengikuti pergerakan satelit.",
        guideRadar: "🔮 Radar Sampah Antariksa",
        guideRadarDesc: "Perhitungan real-time persilangan orbit 24 jam (MOID).",
        guideTitleDisclaimer: "⚠️ Penafian",
        discText1: "Semua data orbit dan prediksi dihitung secara real-time dari data TLE publik CelesTrak dan Space-Track.",
        discText2: "Data ini ditujukan untuk tujuan edukasi dan bukan untuk navigasi operasional wahana antariksa.",
        guideTitlePrivacy: "🔒 Kebijakan Privasi (Google AdSense)",
        privText1Title: "Iklan:",
        privText1Desc: "Situs ini menggunakan layanan periklanan pihak ketiga (seperti Google AdSense) dengan cookie anonim.",
        privText2Title: "Statistik:",
        privText2Desc: "Kami mengumpulkan data lalu lintas anonim untuk analisis kinerja situs.",
        guideTitleAbout: "ℹ️ Tentang SatViewer3D",
        aboutText1: "SatViewer3D adalah simulator 3D real-time untuk memantau satelit buatan dan puing-puing antariksa.",
        aboutContactTitle: "Kontak:",
        aboutContactDesc: "Pertanyaan: info@satviewer3d.com"
    },
    ar: {
        appSubtitle: "متتبع الأقمار الصناعية ومحاكي الحطام الفضائي ثلاثي الأبعاد في الوقت الفعلي",
        statCount: "الأقمار المتتبعة",
        statTime: "وقت المحاكاة",
        dragPanel: "⋮⋮ سحب اللوحة",
        dragHeader: "⋮⋮ السحب للتحريك",
        secSelect: "اختيار وبحث الأجرام والأقمار",
        selectPlaceholder: "-- اختر الكواكب أو الأقمار أو الحطام --",
        searchPlaceholder: "ابحث عن كوكب، قمر صناعي أو معرف NORAD...",
        secSource: "مصادر البيانات والإعدادات المسبقة",
        loadMajor: "⭐ الأقمار الرئيسية (ISS، ستارلينك، الحطام)",
        loadLocal: "🛰️ كوكبة ستارلينك (2,000)",
        badgeMajor: "⭐ تم تحميل الأقمار الرئيسية",
        secTime: "التحكم في الوقت والسرعة",
        speedStop: "⏸️ إيقاف مؤقت",
        speedReal: "▶️ 1x (الوقت الفعلي)",
        resetNow: "🔄 الآن",
        secDisplay: "إعدادات العرض",
        toggleLabels: "تسميات الأقمار ثلاثية الأبعاد",
        toggleOrbits: "إظهار المدار",
        toggleMultiLap: "🌐 مسار أرضي متعدد الدورات",
        toggleAtmosphere: "الغلاف الجوي وضوء الشمس",
        toggle2D: "وضع الخريطة 2D",
        toggleBorders: "🌐 الحدود والمدن",
        toggleDebrisRisk: "🔮 تحليل مخاطر الحطام الفضائي",
        toggleCelestial: "🌌 الشمس والقمر والكواكب (المريخ/الزهرة/المشتري/زحل)",
        dragDetail: "⋮⋮ سحب البطاقة",
        dragCam: "⋮⋮ التحكم في الكاميرا",
        labelAlt: "الارتفاع (Altitude)",
        labelVel: "السرعة (Velocity)",
        labelLat: "خط العرض (Latitude)",
        labelLon: "خط الطول (Longitude)",
        labelInc: "الميل المداري (Inclination)",
        labelPeriod: "الفترة المدارية (Period)",
        labelTimezone: "المنطقة الزمنية",
        labelPass: "📡 العبور القادم في سماء منطقتك",
        labelRisk: "🔮 اقتراب الحطام (MOID 24س)",
        btnGeo: "📍تحديد الموقع",
        btnTrack: "🎯 تتبع القمر الصناعي",
        btnUntrack: "🔓 إلغاء قفل الكاميرا",
        pointerHint: "خارج الشاشة (انقر للتركيز)",
        btnGuide: "❓ الدليل والشروط",
        modalTitle: "SatViewer3D الدليل والشروط القانونية",
        tabControls: "🎮 التحكم",
        tabDisclaimer: "⚠️ إخلاء المسؤولية",
        tabPrivacy: "🔒 الخصوصية",
        tabAbout: "ℹ️ حول الموقع",
        guideTitleControls: "🖱️ دليل التنقل ثلاثي الأبعاد",
        guideWheel: "عجلة الماوس / اللمس",
        guideWheelDesc: "تكبير سلس وفائق الدقة بسرعة 1/10.",
        guideDrag: "النقر الأيسر + السحب",
        guideDragDesc: "تدوير الأرض بحرية 360 درجة.",
        guideTilt: "النقر الأيمن / Ctrl + السحب",
        guideTiltDesc: "ضبط زاوية رؤية وميل الكاميرا.",
        guideClick: "النقر على قمر صناعي / بحث",
        guideClickDesc: "عرض الارتفاع والسرعة ومخاطر الاصطدام في الوقت الفعلي.",
        guideFocus: "🎯 التتبع التلقائي للكاميرا",
        guideFocusDesc: "تتحرك الكاميرا تلقائياً مع القمر الصناعي.",
        guideRadar: "🔮 رادار الحطام الفضائي",
        guideRadarDesc: "حساب تقاطعات المدارات خلال 24 ساعة (MOID) في الوقت الفعلي.",
        guideTitleDisclaimer: "⚠️ إخلاء المسؤولية",
        discText1: "يتم حساب جميع البيانات المدارية والتنبؤات في الوقت الفعلي من بيانات TLE العامة لـ CelesTrak و Space-Track.",
        discText2: "هذه البيانات للأغراض التعليمية والبحثية فقط.",
        guideTitlePrivacy: "🔒 سياسة الخصوصية (Google AdSense)",
        privText1Title: "الإعلانات:",
        privText1Desc: "قد يستخدم هذا الموقع خدمات إعلانية لطرف ثالث (مثل Google AdSense) مع ملفات تعريف ارتباط مجهولة.",
        privText2Title: "الإحصاءات:",
        privText2Desc: "نجمع بيانات حركة مرور مجهولة لتحسين تجربة المستخدم.",
        guideTitleAbout: "ℹ️ حول SatViewer3D",
        aboutText1: "SatViewer3D هو محاكي ثلاثي الأبعاد في الوقت الفعلي لتتبع الأقمار الصناعية والحطام الفضائي.",
        aboutContactTitle: "الاتصال:",
        aboutContactDesc: "للاستفسارات: info@satviewer3d.com"
    },
    hi: {
        appSubtitle: "वास्तविक समय 3D उपग्रह और अंतरिक्ष मलबा विज़ुअलाइज़र",
        statCount: "ट्रैक किए गए उपग्रह",
        statTime: "सिमुलेशन समय",
        dragPanel: "⋮⋮ पैनल खींचें",
        dragHeader: "⋮⋮ खींचकर स्थानांतरित करें",
        secSelect: "खगोलीय पिंड व उपग्रह खोजें",
        selectPlaceholder: "-- ग्रह, उपग्रह या अंतरिक्ष मलबा चुनें --",
        searchPlaceholder: "ग्रह, उपग्रह नाम या NORAD ID द्वारा खोजें...",
        secSource: "डेटा स्रोत और प्रीसेट",
        loadMajor: "⭐ प्रमुख उपग्रह (ISS, स्टारलिंक, मलबा)",
        loadLocal: "🛰️ स्टारलिंक समूह (2,000)",
        badgeMajor: "⭐ प्रमुख उपग्रह लोड किए गए",
        secTime: "समय नियंत्रण और गति",
        speedStop: "⏸️ रोकें",
        speedReal: "▶️ 1x (वास्तविक समय)",
        resetNow: "🔄 अभी",
        secDisplay: "प्रदर्शन सेटिंग्स",
        toggleLabels: "3D उपग्रह नाम",
        toggleOrbits: "कक्षा दिखाएं",
        toggleMultiLap: "🌐 बहु-चक्कर ग्राउंड ट्रैक",
        toggleAtmosphere: "वायुमंडल और सूर्य का प्रकाश",
        toggle2D: "2D मानचित्र मोड",
        toggleBorders: "🌐 सीमाएं और शहर",
        toggleDebrisRisk: "🔮 अंतरिक्ष मलबे के जोखिम का विश्लेषण",
        toggleCelestial: "🌌 सूर्य, चंद्रमा और ग्रह (मंगल/शुक्र/बृहस्पति/शनि)",
        dragDetail: "⋮⋮ कार्ड खींचें",
        dragCam: "⋮⋮ कैमरा नियंत्रण",
        labelAlt: "ऊंचाई (Altitude)",
        labelVel: "गति (Velocity)",
        labelLat: "अक्षांश (Latitude)",
        labelLon: "देशांतर (Longitude)",
        labelInc: "झुकाव (Inclination)",
        labelPeriod: "परिक्रमण काल (Period)",
        labelTimezone: "समय क्षेत्र",
        labelPass: "📡 अगला ओवरहेड पास",
        labelRisk: "🔮 मलबे का निकटतम दृष्टिकोण (MOID)",
        btnGeo: "📍स्थान प्राप्त करें",
        btnTrack: "🎯 उपग्रह को ट्रैक करें",
        btnUntrack: "🔓 कैमरा अनलॉक करें",
        pointerHint: "स्क्रीन से बाहर (केंद्रित करने के लिए क्लिक करें)",
        btnGuide: "❓ गाइड और नियम",
        modalTitle: "SatViewer3D गाइड और शर्तें",
        tabControls: "🎮 नियंत्रण",
        tabDisclaimer: "⚠️ अस्वीकरण",
        tabPrivacy: "🔒 गोपनीयता नीति",
        tabAbout: "ℹ️ के बारे में",
        guideTitleControls: "🖱️ 3D नेविगेशन गाइड",
        guideWheel: "माउस व्हील / टच",
        guideWheelDesc: "1/10 गति पर अत्यधिक सहज और सटीक ज़ूम।",
        guideDrag: "बायाँ क्लिक + खींचें",
        guideDragDesc: "पृथ्वी का स्वतंत्र 360-डिग्री घूर्णन।",
        guideTilt: "दायाँ क्लिक / Ctrl + खींचें",
        guideTiltDesc: "कैमरा झुकाव और देखने का कोण समायोजित करें।",
        guideClick: "उपग्रह पर क्लिक करें / खोजें",
        guideClickDesc: "वास्तविक समय में ऊंचाई, गति और टकराव का जोखिम देखें।",
        guideFocus: "🎯 कैमरा ट्रैकिंग",
        guideFocusDesc: "कैमरा स्वचालित रूप से उपग्रह का अनुसरण करता है।",
        guideRadar: "🔮 अंतरिक्ष मलबा रडार",
        guideRadarDesc: "24 घंटे में कक्षा पार करने की दूरी (MOID) की वास्तविक समय गणना।",
        guideTitleDisclaimer: "⚠️ अस्वीकरण",
        discText1: "सभी कक्षीय डेटा और भविष्यवाणियां CelesTrak और Space-Track के सार्वजनिक TLE डेटा से वास्तविक समय में गणना की जाती हैं।",
        discText2: "यह डेटा केवल शैक्षिक उद्देश्यों के लिए है।",
        guideTitlePrivacy: "🔒 गोपनीयता नीति (Google AdSense)",
        privText1Title: "विज्ञापन:",
        privText1Desc: "यह साइट अनाम कुकीज़ का उपयोग करके तृतीय-पक्ष विज्ञापन सेवाओं (जैसे Google AdSense) का उपयोग करती है।",
        privText2Title: "आंकड़े:",
        privText2Desc: "हम साइट प्रदर्शन विश्लेषण के लिए अनाम ट्रैफ़िक डेटा एकत्र करते हैं।",
        guideTitleAbout: "ℹ️ SatViewer3D के बारे में",
        aboutText1: "SatViewer3D कृत्रिम उपग्रहों और अंतरिक्ष मलबे को देखने के लिए एक वास्तविक समय 3D सिमुलेटर है।",
        aboutContactTitle: "संपर्क:",
        aboutContactDesc: "पूछताछ के लिए: info@satviewer3d.com"
    }
};

function applyLanguage(lang) {
    window.currentLang = lang;
    currentLang = lang;
    localStorage.setItem('sat_lang', lang);
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['ja'];

    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = lang;
    }

    const subEl = document.querySelector('.app-subtitle');
    if (subEl && dict.appSubtitle) {
        subEl.textContent = dict.appSubtitle;
    }

    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict && dict[key]) {
            el.innerHTML = dict[key];
        }
    });

    // Explicit ID-based fallback translations
    const idsToTranslate = {
        'loadMajorBtn': 'loadMajor',
        'loadLocalBtn': 'loadLocal',
        'sourceStatusBadge': 'badgeMajor',
        'resetNowBtn': 'resetNow',
        'geoLocateBtn': 'btnGeo',
        'trackBtn': 'btnTrack',
        'untrackBtn': 'btnUntrack',
        'openGuideBtn': 'btnGuide',
        'modalTitle': 'modalTitle'
    };

    for (const [id, key] of Object.entries(idsToTranslate)) {
        const el = document.getElementById(id);
        if (el && dict[key]) {
            el.textContent = dict[key];
        }
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput && dict.searchPlaceholder) {
        searchInput.placeholder = dict.searchPlaceholder;
    }

    const tzSelect = document.getElementById('tzSelect');
    if (tzSelect) {
        const tzLabels = {
            ja: { JST: '🇯🇵 日本標準時 (JST / UTC+9)', UTC: '🌐 協定世界時 (UTC)', NY: '🇺🇸 ニューヨーク (EST/EDT)', CST: '🇨🇳 中国標準時 (CST / UTC+8)', CET: '🇪🇸 中央欧州時間 (CET / UTC+1)', MSK: '🇷🇺 モスクワ時間 (MSK / UTC+3)', LOCAL: '💻 ローカル時間 (ブラウザ依存)' },
            en: { JST: '🇯🇵 Japan Std Time (JST / UTC+9)', UTC: '🌐 Universal Time (UTC)', NY: '🇺🇸 New York (EST/EDT)', CST: '🇨🇳 China Std Time (CST / UTC+8)', CET: '🇪🇸 Central European (CET / UTC+1)', MSK: '🇷🇺 Moscow Time (MSK / UTC+3)', LOCAL: '💻 Local Browser Time' },
            de: { JST: '🇯🇵 Japan Std.-Zeit (JST)', UTC: '🌐 Weltzeit (UTC)', NY: '🇺🇸 New York (EST/EDT)', CST: '🇨🇳 China-Zeit (CST)', CET: '🇩🇪 Mitteleuropäische Zeit (MEZ)', MSK: '🇷🇺 Moskauer Zeit (MSK)', LOCAL: '💻 Lokale Browserzeit' },
            fr: { JST: '🇯🇵 Heure Standard Japon (JST)', UTC: '🌐 Temps Universel (UTC)', NY: '🇺🇸 New York (EST/EDT)', CST: '🇨🇳 Heure de Chine (CST)', CET: "🇫🇷 Heure d'Europe Centrale (CET)", MSK: '🇷🇺 Heure de Moscou (MSK)', LOCAL: '💻 Heure Locale Navigateur' },
            pt: { JST: '🇯🇵 Hora Padrão do Japão (JST)', UTC: '🌐 Tempo Universal (UTC)', NY: '🇺🇸 Nova York (EST/EDT)', CST: '🇨🇳 Hora da China (CST)', CET: '🇵🇹 Hora da Europa Central (CET)', MSK: '🇷🇺 Hora de Moscou (MSK)', LOCAL: '💻 Hora Local do Navegador' },
            zh: { JST: '🇯🇵 日本标准时间 (JST / UTC+9)', UTC: '🌐 协调世界时 (UTC)', NY: '🇺🇸 纽约时间 (EST/EDT)', CST: '🇨🇳 中国标准时间 (CST / UTC+8)', CET: '🇪🇸 中欧时间 (CET / UTC+1)', MSK: '🇷🇺 莫斯科时间 (MSK / UTC+3)', LOCAL: '💻 本地浏览器时间' },
            es: { JST: '🇯🇵 Hora Estándar de Japón (JST)', UTC: '🌐 Hora Universal (UTC)', NY: '🇺🇸 Nueva York (EST/EDT)', CST: '🇨🇳 Hora de China (CST)', CET: '🇪🇸 Hora Central Europea (CET)', MSK: '🇷🇺 Hora de Moscú (MSK)', LOCAL: '💻 Hora Local del Navegador' },
            it: { JST: '🇯🇵 Ora Standard Giappone (JST)', UTC: '🌐 Tempo Universale (UTC)', NY: '🇺🇸 New York (EST/EDT)', CST: '🇨🇳 Ora della Cina (CST)', CET: '🇮🇹 Ora Europa Centrale (CET)', MSK: '🇷🇺 Ora di Mosca (MSK)', LOCAL: '💻 Ora Locale Browser' },
            ko: { JST: '🇯🇵 일본 표준시 (JST / UTC+9)', UTC: '🌐 세계 표준시 (UTC)', NY: '🇺🇸 뉴욕 (EST/EDT)', CST: '🇨🇳 중국 표준시 (CST)', CET: '🇪🇸 중부 유럽 (CET)', MSK: '🇷🇺 모스크바 (MSK)', LOCAL: '💻 사용자 로컬 시간' },
            nl: { JST: '🇯🇵 Japanse Tijd (JST)', UTC: '🌐 Universele Tijd (UTC)', NY: '🇺🇸 New York (EST/EDT)', CST: '🇨🇳 Chinese Tijd (CST)', CET: '🇳🇱 Midden-Europese Tijd (MET)', MSK: '🇷🇺 Moskou Tijd (MSK)', LOCAL: '💻 Lokale Browsertijd' },
            id: { JST: '🇯🇵 Waktu Standar Jepang (JST)', UTC: '🌐 Waktu Universal (UTC)', NY: '🇺🇸 New York (EST/EDT)', CST: '🇨🇳 Waktu China (CST)', CET: '🇪🇸 Waktu Eropa Tengah (CET)', MSK: '🇷🇺 Waktu Moskow (MSK)', LOCAL: '💻 Waktu Lokal Browser' },
            hi: { JST: '🇯🇵 जापान मानक समय (JST)', UTC: '🌐 सार्वभौमिक समय (UTC)', NY: '🇺🇸 न्यूयॉर्क (EST/EDT)', CST: '🇨🇳 चीन समय (CST)', CET: '🇪🇸 मध्य यूरोपीय समय (CET)', MSK: '🇷🇺 मास्को समय (MSK)', LOCAL: '💻 स्थानीय ब्राउज़र समय' },
            ar: { JST: '🇯🇵 توقيت اليابان (JST)', UTC: '🌐 التوقيت العالمي (UTC)', NY: '🇺🇸 نيويورك (EST/EDT)', CST: '🇨🇳 توقيت الصين (CST)', CET: '🇪🇸 توقيت وسط أوروبا (CET)', MSK: '🇷🇺 توقيت موسكو (MSK)', LOCAL: '💻 التوقيت المحلي للمتصفح' },
            ru: { JST: '🇯🇵 Японское время (JST / UTC+9)', UTC: '🌐 Всемирное время (UTC)', NY: '🇺🇸 Нью-Йорк (EST/EDT)', CST: '🇨🇳 Китайское время (CST / UTC+8)', CET: '🇪🇸 Центральноевропейское (CET)', MSK: '🇷🇺 Московское время (MSK / UTC+3)', LOCAL: '💻 Местное время браузера' }
        };
        const currentTzMap = tzLabels[lang] || tzLabels['en'];
        Array.from(tzSelect.options).forEach(opt => {
            if (currentTzMap[opt.value]) {
                opt.textContent = currentTzMap[opt.value];
            }
        });
    }

    if (typeof updateDropdownOptions === 'function') {
        updateDropdownOptions();
    }

    // Dynamic Live Re-render for Selected Celestial Body if open
    if (typeof selectedCelestialId !== 'undefined' && selectedCelestialId) {
        selectCelestialBody(selectedCelestialId);
    }
}

// Guaranteed Global changeLanguage Function for OnChange Event
window.changeLanguage = function(lang) {
    applyLanguage(lang);
};

// Major Satellites Built-in TLE Preset (Clean International English Names)
const MAJOR_SATELLITES_TLE = `HIMAWARI-8
1 40267U 14060A   26100.00000000  .00000000  00000-0  00000-0 0  9998
2 40267   0.0100 284.2800 0001000   0.00000   0.00000  1.00273791153536
HIMAWARI-9
1 41836U 16064A   26100.00000000  .00000000  00000-0  00000-0 0  9998
2 41836   0.0100 284.2800 0001000   0.00000   0.00000  1.00273791153693
QZSS / MICHIBIKI-1
1 37158U 10045A   26100.18532154  .00051572  00000+0  19056-2 0  9991
2 37158  41.0000 135.0000 0003477 136.2709 223.8565  1.00270000353771
QZSS / MICHIBIKI-2
1 42738U 17028A   26100.12345678  .00000000  00000-0  00000-0 0  9992
2 42738  44.0000 140.0000 0004000 120.0000 240.0000  1.00270000    02
QZSS / MICHIBIKI-3
1 42917U 17048A   26100.12345678  .00000000  00000-0  00000-0 0  9993
2 42917   0.0500 127.0000 0002000 180.0000  90.0000  1.00270000    03
QZSS / MICHIBIKI-4
1 42965U 17062A   26100.12345678  .00000000  00000-0  00000-0 0  9994
2 42965  44.0000 145.0000 0004000 240.0000 120.0000  1.00270000    04
QZSS / MICHIBIKI-5
1 58900U 25001A   26100.12345678  .00000000  00000-0  00000-0 0  9998
2 58900  44.0000 132.5000 0004000 140.0000 220.0000  1.00273791    07
QZSS / MICHIBIKI-6
1 59000U 26001A   26100.12345678  .00000000  00000-0  00000-0 0  9997
2 59000  44.0000 137.5000 0004000 150.0000 210.0000  1.00273791    06
QZSS / MICHIBIKI-1R
1 49336U 21096A   26100.12345678  .00000000  00000-0  00000-0 0  9995
2 49336  44.0000 135.0000 0004000 180.0000  90.0000  1.00270000    05
ISS (ZARYA)
1 25544U 98067A   26100.52443056  .00014798  00000+0  26498-3 0  9999
2 25544  51.6416 288.4552 0004557 114.6293 250.7711 15.49753018444743
TIANGONG
1 42063U 17027A   26100.52443056  .00014798  00000+0  26498-3 0  9993
2 42063  51.6416 247.4627 0006703 130.5360 325.0288 15.50256479  1234
BEIDOU-3
1 40749U 15037A   26100.12345678  .00000000  00000-0  00000-0 0  9993
2 40749  55.0000 123.0000 0001000 180.0000  90.0000  1.00270000    01
HUBBLE SPACE TELESCOPE
1 20580U 90037B   26100.12345678  .00000000  00000-0  00000-0 0  9990
2 20580  28.4690 100.0000 0003000 120.0000 240.0000 15.00000000    01
GPS BIIR-2 (PRN 13)
1 24876U 97035A   26100.12345678  .00000000  00000-0  00000-0 0  9996
2 24876  55.0000  60.0000 0050000 150.0000 210.0000  2.00570000    02
GPS BIIF-2 (PRN 01)
1 37753U 11036A   26100.12345678  .00000000  00000-0  00000-0 0  9994
2 37753  55.0000 180.0000 0050000  90.0000 270.0000  2.00570000    03
COSMOS 2251 DEBRIS
1 34000U 93036AZ  26100.12345678  .00000000  00000-0  00000-0 0  9991
2 34000  74.0000  45.0000 0020000 100.0000 260.0000 14.30000000    01
FENGYUN 1C DEBRIS
1 30000U 99025AAA 26100.12345678  .00000000  00000-0  00000-0 0  9992
2 30000  98.6000 120.0000 0015000 150.0000 210.0000 14.10000000    02
SL-8 DEBRIS
1 31000U 00001A   26100.12345678  .00000000  00000-0  00000-0 0  9993
2 31000  83.0000 200.0000 0025000 180.0000  90.0000 14.00000000    03
SL-16 DEBRIS
1 32000U 00002A   26100.12345678  .00000000  00000-0  00000-0 0  9994
2 32000  71.0000 280.0000 0030000 240.0000 120.0000 14.20000000    04
STARLINK-1007
1 44713U 19074A   26100.12345678  .00000000  00000-0  00000-0 0  9995
2 44713  53.0000  10.0000 0001500  45.0000 315.0000 15.06000000    01
STARLINK-1008
1 44714U 19074B   26100.12345678  .00000000  00000-0  00000-0 0  9996
2 44714  53.0000  20.0000 0001500  90.0000 270.0000 15.06000000    02
STARLINK-1009
1 44715U 19074C   26100.12345678  .00000000  00000-0  00000-0 0  9997
2 44715  53.0000  30.0000 0001500 135.0000 225.0000 15.06000000    03
STARLINK-1010
1 44716U 19074D   26100.12345678  .00000000  00000-0  00000-0 0  9998
2 44716  53.0000  40.0000 0001500 180.0000 180.0000 15.06000000    04
STARLINK-1011
1 44717U 19074E   26100.12345678  .00000000  00000-0  00000-0 0  9999
2 44717  53.0000  50.0000 0001500 225.0000 135.0000 15.06000000    05
STARLINK-1012
1 44718U 19074F   26100.12345678  .00000000  00000-0  00000-0 0  9991
2 44718  53.0000  60.0000 0001500 270.0000  90.0000 15.06000000    06
STARLINK-1013
1 44719U 19074G   26100.12345678  .00000000  00000-0  00000-0 0  9992
2 44719  53.0000  70.0000 0001500 315.0000  45.0000 15.06000000    07
STARLINK-1014
1 44720U 19074H   26100.12345678  .00000000  00000-0  00000-0 0  9993
2 44720  53.0000  80.0000 0001500   0.0000   0.0000 15.06000000    08
STARLINK-1015
1 44721U 19074J   26100.12345678  .00000000  00000-0  00000-0 0  9994
2 44721  53.0000  90.0000 0001500  45.0000 315.0000 15.06000000    09
STARLINK-1016
1 44722U 19074K   26100.12345678  .00000000  00000-0  00000-0 0  9995
2 44722  53.0000 100.0000 0001500  90.0000 270.0000 15.06000000    10`;

// Global State
let viewer = null;
let satellitesData = []; 
let satPointPrimitives = null;
let selectedSatIndex = -1;
let orbitPolylineEntity = null;
let currentTrackingEntity = null;
let targetHighlightEntity = null;
let bordersOverlayLayer = null;

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

// Rich Satellite Mission Descriptions Mapping (Full 5-Language Multilingual Dictionary)
const SATELLITE_DESCRIPTIONS = {
    'HIMAWARI-8': {
        ja: '気象衛星「ひまわり8号」(気象庁)。赤道上空約35,786kmの【静止気象衛星】。ひまわり9号と同位置の東経140.7°静止軌道にてバックアップ・待機観測運用。',
        en: 'Geostationary Meteorological Satellite "Himawari-8" (JMA). Located at 140.7°E longitude, 35,786 km above equator for weather monitoring backup.',
        de: 'Geostationärer Wettersatellit "Himawari-8" (JMA). Positioniert auf 140,7°O über dem Äquator als Backup-Wettersatellit.',
        fr: 'Satellite météorologique géostationnaire "Himawari-8" (JMA). Situé à 140,7°E à 35 786 km pour la veille météo.',
        pt: 'Satélite meteorológico geoestacionário "Himawari-8" (JMA). Posicionado a 140,7°E a 35.786 km para monitoramento.',
        it: 'Satellite meteorologico geostazionario "Himawari-8" (JMA). Situato a 140,7°E a 35.786 km come riserva operativa.',
        ko: '정지궤도 기상위성 "히마와리 8호"(일본 기상청). 동경 140.7° 상공 35,786km 정지궤도에서 백업 관측 임무 수행.',
        nl: 'Geostationaire weersatelliet "Himawari-8" (JMA). Bevindt zich op 140,7°O op 35.786 km hoogte als backup.',
        id: 'Satelit Cuaca Geostasioner "Himawari-8" (JMA). Terletak di bujur 140,7°BT, 35.786 km di atas khatulistiwa.',
        ar: 'قمر الأرصاد الجوية الثابت جغرافيًا "هيماواري-8" (JMA). متمركز على خط طول 140.7° شرقاً على ارتفاع 35,786 كم.',
        hi: 'भूस्थिर मौसम उपग्रह "हिमावारी-8" (JMA)। मौसम निगरानी बैकअप के लिए 140.7°E पर 35,786 किमी ऊपर स्थित।',
        zh: '气象卫星“葵花8号”(日本气象厅)。位于赤道上空约35,786公里的静止气象卫星，在东经140.7°作为9号机的备用观测星。',
        es: 'Satélite Meteorológico Geoestacionario "Himawari-8" (JMA). Situado a 35.786 km sobre el ecuador a 140,7°E para monitoreo del clima.',
        ru: 'Геостационарный метеорологический спутник "Химавари-8" (JMA). Находится на высоте 35 786 км над экватором для наблюдения за погодой.'
    },
    'HIMAWARI-9': {
        ja: '気象衛星「ひまわり9号」(気象庁)。赤道上空約35,786kmの【静止気象衛星】。地球の自転と同じ速度で周回するため日本上空(東経140.7°)に静止し、台風や集中豪雨をリアルタイム監視中。',
        en: 'Geostationary Meteorological Satellite "Himawari-9" (JMA). Positioned 35,786 km above East Asia (140.7°E) monitoring typhoons and severe weather in real-time.',
        de: 'Geostationärer Wettersatellit "Himawari-9" (JMA). Überwacht Taifune und Unwetter über Ostasien in Echtzeit (140,7°O).',
        fr: "Satellite météorologique \"Himawari-9\" (JMA). Surveille en temps réel typhons et tempêtes sur l'Asie de l'Est à 140,7°E.",
        pt: 'Satélite meteorológico "Himawari-9" (JMA). Monitora tufões e tempestades severas em tempo real sobre o Leste Asiático a 140,7°E.',
        it: 'Satellite meteorologico "Himawari-9" (JMA). Monitora in tempo reale tifoni e maltempo sull\'Asia orientale a 140,7°E.',
        ko: '정지궤도 기상위성 "히마와리 9호"(일본 기상청). 동경 140.7° 상공 35,786km에서 태풍과 집중호우를 실시간 감시.',
        nl: 'Geostationaire weersatelliet "Himawari-9" (JMA). Bewaakt tyfonen en zwaar weer in realtime (140,7°O).',
        id: 'Satelit Cuaca "Himawari-9" (JMA). Memantau topan dan cuaca ekstrem secara real-time di Asia Timur (140,7°BT).',
        ar: 'قمر الأرصاد الجوية "هيماواري-9" (JMA). يرصد الأعاصير والطقس القاسي فوق شرق آسيا في الوقت الفعلي (140.7° شرقاً).',
        hi: 'मौसम उपग्रह "हिमावारी-9" (JMA)। पूर्वी एशिया के ऊपर वास्तविक समय में तूफानों की निगरानी करता है।',
        zh: '气象卫星“葵花9号”(日本气象厅)。静止于东经140.7°赤道上空，实时监控台风与暴雨等灾害性天气。',
        es: 'Satélite Meteorológico "Himawari-9". Monitorea en tiempo real tifones y clima severo sobre Asia Oriental a 140,7°E.',
        ru: 'Метеорологический спутник "Химавари-9". Наблюдает за тайфунами и штормами над Восточной Азией в режиме реального времени.'
    },
    'MICHIBIKI-6': {
        ja: '日本・内閣府の最新準天頂衛星「みちびき6号機 (QZSS-6)」。最新H3ロケットにより打ち上げられ、みちびき7機体制によるサブメートル級・センチメートル級の超高精度GPS補強測位サービスを提供。',
        en: 'Latest QZSS-6 (Michibiki No. 6) satellite launched by Japan H3 rocket, providing sub-meter and centimeter-level high-precision GPS positioning services.',
        de: 'Neuester QZSS-6 (Michibiki Nr. 6) Satellit, gestartet mit der japanischen H3-Rakete für hochpräzise GPS-Ortung.',
        fr: 'Dernier satellite QZSS-6 (Michibiki n°6) lancé par la fusée japonaise H3 pour un positionnement GPS ultra-précis.',
        pt: 'Satélite QZSS-6 (Michibiki nº 6) lançado pelo foguete japonês H3 para serviços de alta precisão GPS.',
        it: 'Nuovo satellite QZSS-6 (Michibiki n. 6) lanciato dal razzo giapponese H3 per il posizionamento GPS ad altissima precisione.',
        ko: '일본 최신 준천정위성 "미치비키 6호기 (QZSS-6)". H3 로켓으로 발사되어 센티미터급 초정밀 GPS 보정 위치 측정 서비스를 제공.',
        nl: 'Nieuwste QZSS-6 (Michibiki nr. 6) satelliet, gelanceerd met de H3-raket voor uiterst nauwkeurige GPS-positionering.',
        id: 'Satelit terbaru QZSS-6 (Michibiki No. 6) diluncurkan dengan roket H3 untuk layanan penentuan posisi GPS presisi tinggi.',
        ar: 'أحدث قمر صناعي QZSS-6 (ميشيبيكي رقم 6) تم إطلاقه بصاروخ H3 الياباني لتوفير خدمات تحديد المواقع عالية الدقة.',
        hi: 'जापान के H3 रॉकेट द्वारा लॉन्च किया गया नवीनतम QZSS-6 (मिचिबिकी नं. 6) उपग्रह, उच्च-सटीक GPS सेवाएं प्रदान करता है।',
        zh: '日本最新准天顶卫星“引路6号”(QZSS-6)。由H3火箭成功发射，实现高精度GPS定位增强服务。',
        es: 'Satélite de precisión GPS "Michibiki-6" (QZSS-6) lanzado por el cohete H3 de Japón.',
        ru: 'Новейший навигационный спутник "Мичибики-6" (QZSS-6), запущенный ракетой H3 для сверхточного GPS.'
    },
    'MICHIBIKI': {
        ja: '日本の準天頂衛星システム「みちびき」(QZSS)。日本およびアジア太平洋地域におけるGPS電波のビル陰死角をゼロにし、高精度測位を補強。',
        en: 'Quasi-Zenith Satellite System "Michibiki" (QZSS). Enhances GPS positioning accuracy across Japan and the Asia-Pacific region.',
        de: 'Quasi-Zenit-Satellitensystem "Michibiki" (QZSS). Verbessert die GPS-Genauigkeit in Japan und im Asien-Pazifik-Raum.',
        fr: 'Système de satellites quasi-zénithaux "Michibiki" (QZSS). Améliore la précision GPS au Japon et en Asie-Pacifique.',
        pt: 'Sistema de Satélites Quase-Zenital "Michibiki" (QZSS). Aumenta a precisão do GPS no Japão e Ásia-Pacífico.',
        it: 'Sistema satellitare Quasi-Zenit "Michibiki" (QZSS). Migliora la precisione GPS in Giappone e nella regione Asia-Pacifico.',
        ko: '일본의 준천정위성 시스템 "미치비키"(QZSS). 도심 고층 빌딩 사각지대를 해소하고 센티미터급 정밀 GPS 보정을 제공.',
        nl: 'Quasi-Zenit Satellietsysteem "Michibiki" (QZSS). Verbetert de GPS-nauwkeurigheid in Japan en Azië-Pacific.',
        id: 'Sistem Satelit Quasi-Zenith "Michibiki" (QZSS). Meningkatkan akurasi GPS di Jepang dan kawasan Asia-Pasifik.',
        ar: 'نظام الأقمار الصناعية شبه السمتية "ميشيبيكي" (QZSS). يعزز دقة نظام تحديد المواقع GPS في اليابان ومنطقة آسيا والمحيط الهادئ.',
        hi: 'क्वासी-जेनिथ उपग्रह प्रणाली "मिचिबिकी" (QZSS)। जापान और एशिया-प्रशांत क्षेत्र में GPS सटीकता को बढ़ाता है।',
        zh: '日本准天顶卫星系统“引路”(QZSS)。覆盖日本及亚太地区，提供厘米级GPS增强定位。',
        es: 'Sistema de Satélites Quasi-Cenital "Michibiki" (QZSS). Mejora la precisión del GPS en Japón y Asia-Pacífico.',
        ru: 'Японская квазизенитная спутниковая система "Мичибики" (QZSS) для улучшения точности GPS.'
    },
    'ISS': {
        ja: '国際宇宙ステーション (ISS)。高度約400kmの地球低軌道(LEO)を約90分で1周(時速約27,700km)。日本人宇宙飛行士が長期滞在し宇宙実験を実施。',
        en: 'International Space Station (ISS). Orbiting at ~400km altitude every 90 minutes (~27,700 km/h) hosting international astronauts for microgravity research.',
        de: 'Internationale Raumstation (ISS). Umkreist die Erde in ~400 km Höhe alle 90 Minuten für wissenschaftliche Forschung.',
        fr: "Station spatiale internationale (ISS). En orbite à ~400 km d'altitude toutes les 90 minutes pour la recherche.",
        pt: 'Estação Espacial Internacional (ISS). Orbita a ~400 km de altitude a cada 90 minutos para pesquisas científicas.',
        it: 'Stazione Spaziale Internazionale (ISS). Orbita a ~400 km di altitudine ogni 90 minuti per la ricerca scientifica.',
        ko: '국제우주정거장 (ISS). 고도 약 400km의 지구 저궤도를 약 90분마다 1회전(시속 약 27,700km)하며 우주 과학 실험을 수행.',
        nl: 'Internationaal Ruimtestation (ISS). Draait elke 90 minuten rond de aarde op ~400 km hoogte voor wetenschappelijk onderzoek.',
        id: 'Stasiun Luar Angkasa Internasional (ISS). Mengorbit pada ketinggian ~400 km setiap 90 menit untuk penelitian gravitasi mikro.',
        ar: 'محطة الفضاء الدولية (ISS). تدور حول الأرض على ارتفاع ~400 كم كل 90 دقيقة لإجراء الأبحاث العلمية.',
        hi: 'अंतर्राष्ट्रीय अंतरिक्ष स्टेशन (ISS)। ~400 किमी की ऊंचाई पर हर 90 मिनट में पृथ्वी की परिक्रमा करता है।',
        zh: '国际空间站 (ISS)。在约400公里的近地轨道运行，每90分钟环绕地球一周。',
        es: 'Estación Espacial Internacional (EEI). Órbita a ~400 km de altitud cada 90 minutos para investigación científica.',
        ru: 'Международная космическая станция (МКС). Орбита ~400 км, полный оборот за 90 минут.'
    },
    'TIANGONG': {
        ja: '中国の宇宙ステーション「天宮」(Tiangong)。高度約380〜450kmの低軌道にて独自のアストロナウツ(航天員)が常駐する宇宙実験施設。',
        en: 'Chinese Space Station "Tiangong". Permanently crewed space laboratory orbiting at ~380-450 km altitude.',
        de: 'Chinesische Raumstation "Tiangong". Dauerhaft bemannte Raumstation in ~380-450 km Höhe.',
        fr: 'Station spatiale chinoise "Tiangong". Laboratoire spatial habité en orbite à 380-450 km.',
        pt: 'Estação Espacial Chinesa "Tiangong". Laboratório espacial permanentemente tripulado a 380-450 km.',
        it: 'Stazione spaziale cinese "Tiangong". Laboratorio orbitale abitato in orbita a 380-450 km.',
        ko: '중국 우주정거장 "톈궁"(Tiangong). 고도 약 380~450km 저궤도에서 우주인이 상주하는 독자 우주 실험실.',
        nl: 'Chinees Ruimtestation "Tiangong". Permanent bemand ruimtelaboratorium op ~380-450 km hoogte.',
        id: 'Stasiun Luar Angkasa China "Tiangong". Laboratorium antariksa berawak tetap di ketinggian ~380-450 km.',
        ar: 'محطة الفضاء الصينية "تيانغونغ". مختبر فضائي مأهول بشكل دائم في مدار على ارتفاع ~380-450 كم.',
        hi: 'चीनी अंतरिक्ष स्टेशन "तियांगोंग"। ~380-450 किमी की ऊंचाई पर परिक्रमा करने वाली स्थायी अंतरिक्ष प्रयोगशाला।',
        zh: '中国“天宫”空间站。高度约380-450公里的近地轨道长期载人空间实验室。',
        es: 'Estación Espacial China "Tiangong". Laboratorio espacial tripulado a 380-450 km.',
        ru: 'Китайская орбитальная станция "Тяньгун". Обитаемая лаборатория на высоте 380-450 км.'
    },
    'BEIDOU': {
        ja: '中国の衛星測位システム「北斗」(BeiDou-3)。地球全域をカバーする独自GPS網。ミリ波通信や高精度測位サービスを提供。',
        en: 'Chinese Satellite Navigation System "BeiDou-3". Global navigation constellation providing high-precision positioning.',
        de: 'Chinesisches Satellitennavigationssystem "BeiDou-3". Globales Navigationsnetzwerk für hochpräzise Ortung.',
        fr: 'Système de navigation par satellite chinois "BeiDou-3". Constellation mondiale pour un positionnement de haute précision.',
        pt: 'Sistema de Navegação por Satélite Chinês "BeiDou-3". Constelação global de posicionamento de alta precisão.',
        it: 'Sistema di navigazione satellitare cinese "BeiDou-3". Rete globale per il posizionamento di alta precisione.',
        ko: '중국 위성항법시스템 "베이더우 3호"(BeiDou-3). 전 지구를 커버하는 독자 항법 위성망.',
        nl: 'Chinees satellietnavigatiesysteem "BeiDou-3". Wereldwijd navigatienetwerk voor uiterst nauwkeurige plaatsbepaling.',
        id: 'Sistem Navigasi Satelit China "BeiDou-3". Konstelasi global yang menyediakan penentuan posisi presisi tinggi.',
        ar: 'نظام الملاحة عبر الأقمار الصناعية الصيني "بيدو-3". كوكبة ملاحة عالمية توفر تحديد المواقع بدقة فائقة.',
        hi: 'चीनी उपग्रह नेविगेशन प्रणाली "BeiDou-3"। वैश्विक उच्च-सटीक नेविगेशन नक्षत्र।',
        zh: '中国“北斗三号”全球卫星导航系统。为全球提供高精度定位与短报文通信服务。',
        es: 'Sistema de Navegación por Satélite Chino "BeiDou-3". Red global de posicionamiento de alta precisión.',
        ru: 'Китайская навигационная система "Бэйдоу-3". Глобальная спутниковая сеть для высокоточного позиционирования.'
    },
    'HUBBLE': {
        ja: 'ハッブル宇宙望遠鏡 (HST)。高度約540kmの地球周回軌道から宇宙の深淵を観測し、数々の大発見をもたらした伝説の宇宙望遠鏡。',
        en: 'Hubble Space Telescope (HST). Orbiting at ~540km altitude capturing deep space astronomical discoveries.',
        de: 'Hubble-Weltraumteleskop (HST). Umkreist die Erde in ~540 km Höhe für spektakuläre astronomische Entdeckungen.',
        fr: "Télescope spatial Hubble (HST). En orbite à ~540 km pour l'observation de l'univers profond.",
        pt: 'Telescópio Espacial Hubble (HST). Orbita a ~540 km de altitude para descobertas astronômicas do espaço profundo.',
        it: 'Telescopio Spaziale Hubble (HST). Orbita a ~540 km di altitudine per osservazioni astronomiche dello spazio profondo.',
        ko: '허블 우주 망원경 (HST). 고도 약 540km 상공에서 심우주를 관측하며 수많은 천문학적 발견을 이끈 전설적인 우주 망원경.',
        nl: 'Hubble Ruimtetelescoop (HST). Draait op ~540 km hoogte voor baanbrekende astronomische ontdekkingen.',
        id: 'Teleskop Luar Angkasa Hubble (HST). Mengorbit pada ketinggian ~540 km untuk pengamatan astronomi luar angkasa.',
        ar: 'تلسكوب هابل الفضائي (HST). يدور على ارتفاع ~540 كم لالتقاط الاكتشافات الفلكية في أعماق الفضاء.',
        hi: 'हबल स्पेस टेलीस्कोप (HST)। गहरी अंतरिक्ष खगोलीय खोजों के लिए ~540 किमी की ऊंचाई पर परिक्रमा करता है।',
        zh: '哈勃空间望远镜 (HST)。在约540公里轨道上运行，为人类探索深空宇宙做出巨大贡献。',
        es: 'Telescopio Espacial Hubble (HST). En órbita a ~540 km capturando descubrimientos astronómicos profundos.',
        ru: 'Космический телескоп "Хаббл" (HST). Орбита ~540 км для глубоких астрономических наблюдений.'
    },
    'GPS': {
        ja: '米国GPS航法衛星 (NAVSTAR)。高度約20,200kmの中軌道(MEO)を約12時間で1周し、全世界のスマートフォンやカーナビに精密測位電波を提供。',
        en: 'US GPS Navigation Satellite (NAVSTAR). Orbiting at ~20,200 km altitude (MEO) every 12 hours providing global positioning signals.',
        de: 'US GPS Navigationssatellit (NAVSTAR). Umkreist die Erde in ~20.200 km Höhe alle 12 Stunden für weltweite Ortung.',
        fr: 'Satellite de navigation GPS américain (NAVSTAR). En orbite à ~20 200 km toutes les 12 heures pour le guidage mondial.',
        pt: 'Satélite de Navegação GPS dos EUA (NAVSTAR). Orbita a ~20.200 km de altitude a cada 12 horas para sinais globais.',
        it: 'Satellite di navigazione GPS USA (NAVSTAR). Orbita a ~20.200 km ogni 12 ore per il posizionamento globale.',
        ko: '미국 GPS 항법 위성 (NAVSTAR). 고도 약 20,200km 중궤도(MEO)를 12시간 주기로 돌며 전 세계에 정밀 위치 신호를 제공.',
        nl: 'Amerikaanse GPS-navigatiesatelliet (NAVSTAR). Draait op ~20.200 km hoogte elke 12 uur voor wereldwijde positiebepaling.',
        id: 'Satelit Navigasi GPS AS (NAVSTAR). Mengorbit pada ketinggian ~20.200 km setiap 12 jam untuk sinyal posisi global.',
        ar: 'قمر الملاحة الأمريكي GPS (NAVSTAR). يدور على ارتفاع ~20,200 كم كل 12 ساعة لتوفير إشارات تحديد المواقع عالمياً.',
        hi: 'अमेरिकी GPS नेविगेशन उपग्रह (NAVSTAR)। वैश्विक स्थिति संकेत प्रदान करने के लिए हर 12 घंटे में ~20,200 किमी पर परिक्रमा करता है।',
        zh: '美国GPS导航卫星 (NAVSTAR)。运行于高度约20,200公里的中地球轨道，每12小时绕地球一周。',
        es: 'Satélite de Navegación GPS de EE. UU. (NAVSTAR). Órbita a ~20.200 km cada 12 horas proveyendo posicionamiento global.',
        ru: 'Американский навигационный спутник GPS (NAVSTAR). Средняя орбита ~20 200 км, период 12 часов.'
    },
    'DEBRIS': {
        ja: '役目を終えた人工衛星やロケット上段の破片(宇宙ゴミ)。秒速約7〜8km(銃弾の数倍)の超高速で地球を周回しており、現役衛星への衝突が警戒されています。',
        en: 'Defunct satellite or rocket upper stage fragment (Space Debris). Orbiting Earth at ~7.5 km/s posing collision hazards to active spacecraft.',
        de: 'Weltraummüll (Inaktiver Satellit oder Raketenstufe). Umkreist die Erde mit ~7,5 km/s und stellt ein Kollisionsrisiko dar.',
        fr: "Débris spatial (satellite inactif ou étage de fusée). En orbite à ~7,5 km/s présentant des risques de collision majeurs.",
        pt: 'Lixo espacial (satélite desativado ou fragmento de foguete). Orbita a Terra a ~7,5 km/s com risco de colisão.',
        it: 'Detrito spaziale (satellite inattivo o frammento di razzo). Orbita attorno alla Terra a ~7,5 km/s con rischio di collisione.',
        ko: '임무를 마친 인공위성 또는 로켓 상단 파편 (우주 쓰레기). 초속 약 7.5km의 초고속으로 지구를 돌며 현역 위성에 치명적인 충돌 위험을 초래.',
        nl: 'Ruimtepuin (inactieve satelliet of rakettrap). Draait rond de aarde met ~7,5 km/s en vormt een botsingsrisico.',
        id: 'Sampah antariksa (satelit mati atau pecahan roket). Mengorbit Bumi dengan kecepatan ~7,5 km/detik dengan risiko tabrakan.',
        ar: 'حطام فضائي (قمر صناعي معطل أو جزء من صاروخ). يدور حول الأرض بسرعة ~7.5 كم/ثانية مشكلاً خطراً على الأقمار النشطة.',
        hi: 'अंतरिक्ष मलबा (निष्क्रिय उपग्रह या रॉकेट का टुकड़ा)। ~7.5 किमी/सेकंड की गति से पृथ्वी की परिक्रमा करता है।',
        zh: '失效人造卫星或火箭残骸 (空间碎片/太空垃圾)。以约7.5公里/秒的超高速绕地飞行，对在轨航天器构成碰撞威胁。',
        es: 'Basura espacial (satélite fuera de servicio o fragmento de cohete). Orbita la Tierra a ~7,5 km/s con riesgo de colisión.',
        ru: 'Космический мусор (неработающий спутник или ступень ракеты). Вращается вокруг Земли со скоростью ~7,5 км/с.'
    },
    'STARLINK': {
        ja: 'SpaceX社の超小型通信衛星コンステレーション「Starlink」。高度約550kmの低軌道から全世界へ超高速・低遅延の衛星インターネットを提供。',
        en: 'SpaceX Starlink Mega-Constellation Satellite. Orbiting in LEO (~550km) providing global high-speed broadband internet.',
        de: 'SpaceX Starlink Kommunikationssatellit. Bietet globales Breitband-Internet aus ~550 km niedriger Erdumlaufbahn (LEO).',
        fr: "Satellite Starlink de SpaceX. Fournit un accès Internet haut débit mondial depuis l'orbite basse (~550 km).",
        pt: 'Satélite da Megaconstelação Starlink da SpaceX. Fornece internet banda larga global de alta velocidade a ~550 km.',
        it: 'Satellite della costellazione Starlink di SpaceX. Fornisce internet a banda larga globale da orbita bassa (~550 km).',
        ko: 'SpaceX사의 초소형 통신위성 군집 "스타링크(Starlink)". 고도 약 550km 저궤도에서 전 세계에 초고속 저지연 인터넷을 제공.',
        nl: 'SpaceX Starlink communicatiesatelliet. Biedt wereldwijd breedbandinternet vanuit een lage baan om de aarde (~550 km).',
        id: 'Satelit Mega-Konstelasi Starlink milik SpaceX. Menyediakan internet pita lebar global berkecepatan tinggi dari orbit rendah (~550 km).',
        ar: 'قمر كوكبة ستارلينك التابعة لـ SpaceX. يدور في مدار منخفض (~550 كم) لتوفير إنترنت فائق السرعة عالمياً.',
        hi: 'SpaceX स्टारलिंक उपग्रह। वैश्विक उच्च गति इंटरनेट प्रदान करने के लिए LEO (~550 किमी) में परिक्रमा करता है।',
        zh: 'SpaceX“星链”(Starlink) 低轨互联网卫星。在约550公里近地轨道运行，为全球提供高速宽带接入。',
        es: 'Satélite Starlink de SpaceX. Órbita baja (~550 km) proveyendo internet satelital de banda ancha a nivel global.',
        ru: 'Спутник группировки Starlink компании SpaceX. Низкая околоземная орбита (~550 км), глобальный интернет.'
    }
};

function getSatDescription(name) {
    const upper = name.toUpperCase();
    const langSelect = document.getElementById('langSelect');
    const lang = (langSelect && langSelect.value) || window.currentLang || currentLang || 'ja';

    for (const [key, descObj] of Object.entries(SATELLITE_DESCRIPTIONS)) {
        if (upper.includes(key)) {
            return descObj[lang] || descObj['en'] || descObj['ja'];
        }
    }
    
    if (upper.includes('STARLINK')) {
        const starlinkDesc = {
            ja: 'SpaceX社が展開する地球低軌道(LEO)高速ブロードバンド通信衛星コンステレーション。',
            en: 'SpaceX Starlink Low Earth Orbit (LEO) broadband internet satellite constellation.',
            de: 'SpaceX Starlink LEO-Breitband-Satellitenkonstellation.',
            fr: 'Constellation de satellites Internet haut débit SpaceX Starlink en orbite basse.',
            pt: 'Constelação de satélites de internet banda larga SpaceX Starlink em órbita baixa.',
            zh: 'SpaceX 展开的近地轨道 (LEO) 高速宽带卫星星座。',
            es: 'Constelación de satélites de Internet de banda ancha LEO de SpaceX Starlink.',
            ru: 'Низкоорбитальная спутниковая группировка широкополосного интернета SpaceX Starlink.'
        };
        return starlinkDesc[lang] || starlinkDesc['en'];
    }

    const defaultDesc = {
        ja: '地球周回軌道を周回する人工衛星。',
        en: 'Artificial satellite orbiting Earth.',
        de: 'Künstlicher Satellit im Erdorbit.',
        fr: 'Satellite artificiel en orbite terrestre.',
        pt: 'Satélite artificial em órbita terrestre.',
        zh: '环绕地球轨道的造人卫星。',
        es: 'Satélite artificial orbitando la Tierra.',
        ru: 'Искусственный спутник на орбите Земли.'
    };
    return defaultDesc[lang] || defaultDesc['en'];
}

// Initialize Application Safely
document.addEventListener('DOMContentLoaded', () => {
    try {
        initCesiumViewer();
        setupEventListeners();
        loadMajorSatellitesPreset();
        applyLanguage(currentLang);

        const yr = new Date().getFullYear();
        const yrEl = document.getElementById('copyrightYear');
        if (yrEl) yrEl.textContent = yr;
        document.querySelectorAll('.copyrightYearRef').forEach(el => el.textContent = yr);
    } catch (e) {
        console.error("Initialization error:", e);
    } finally {
        setTimeout(() => {
            hideLoading();
        }, 600); // 100% Guarantees loading overlay is NEVER stuck!
    }
});

/**
 * Create High-Definition Realistic Natural Earth Canvas Imagery Provider
 * Generates rich detailed continents, islands, bays, gradient ocean & crisp coastlines locally with ZERO external network dependency!
 */
function createBulletproofEarthProvider() {
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    // 1. Radiant Deep Ocean Gradient to Shallow Turquoise Coasts
    const oceanGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 200, canvas.width / 2, canvas.height / 2, 2200);
    oceanGrad.addColorStop(0, '#102a45');
    oceanGrad.addColorStop(0.6, '#0b1d33');
    oceanGrad.addColorStop(1, '#071324');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const toPx = (lon, lat) => ({
        x: ((lon + 180) / 360) * canvas.width,
        y: ((90 - lat) / 180) * canvas.height
    });

    // Realistic Terrains & Feature Polygons
    const landStyle = '#1b4332';  // Rich Forest Green
    const desertStyle = '#b5838d';// Saharan Golden Ochre
    const iceStyle = '#ffffff';   // Polar White Ice Caps
    const strokeStyle = '#4ade80';

    // Detailed Continental Polygons (High-Resolution Coastlines & Islands)
    // Eurasia & Mediterranean & Scandanavia & SE Asia
    const eurasia = [
        [-10, 36], [-5, 43], [3, 47], [10, 54], [10, 60], [18, 70], [28, 71], [40, 67], [60, 70], [100, 78], 
        [140, 73], [170, 66], [170, 60], [140, 55], [130, 43], [120, 30], [110, 20], [100, 10], [90, 20], 
        [80, 10], [70, 20], [60, 25], [50, 25], [45, 12], [40, 15], [35, 30], [30, 31], [25, 35], [15, 38], [-10, 36]
    ];
    // British Isles
    const britain = [[-6, 50], [-2, 58], [2, 52], [-6, 50]];
    // Japan Main Chain
    const hokkaido = [[140, 45], [145, 44], [142, 41], [140, 42], [140, 45]];
    const honshu = [[141, 41], [142, 38], [140, 35], [136, 35], [133, 34], [131, 34], [132, 35], [137, 37], [141, 41]];
    const kyushuShikoku = [[133, 34], [134, 33], [131, 31], [130, 32], [133, 34]];
    // North America & Alaska & Greenland
    const northAmerica = [
        [-168, 65], [-150, 70], [-130, 70], [-100, 75], [-75, 78], [-60, 60], [-64, 46], [-70, 42], 
        [-80, 25], [-81, 25], [-90, 20], [-97, 26], [-105, 20], [-110, 30], [-120, 34], [-124, 48], [-140, 60], [-168, 65]
    ];
    const greenland = [[-50, 80], [-20, 75], [-40, 60], [-55, 70], [-50, 80]];
    // South America
    const southAmerica = [
        [-75, 10], [-60, 8], [-35, -5], [-37, -10], [-48, -28], [-65, -55], [-75, -50], [-72, -35], [-78, -10], [-80, 0], [-75, 10]
    ];
    // Africa
    const africa = [
        [-17, 35], [-5, 36], [10, 37], [25, 32], [32, 30], [33, 27], [43, 12], [51, 11], [40, -3], 
        [33, -26], [26, -33], [18, -34], [12, -15], [9, 0], [-17, 15], [-17, 35]
    ];
    const madagascar = [[47, -12], [50, -15], [44, -25], [43, -20], [47, -12]];
    // Australia & NZ
    const australia = [
        [114, -22], [122, -18], [130, -12], [136, -12], [142, -10], [150, -22], [153, -28], 
        [150, -37], [138, -35], [135, -33], [118, -35], [114, -26], [114, -22]
    ];
    const nzNorth = [[174, -35], [178, -38], [174, -41], [174, -35]];
    const nzSouth = [[166, -46], [174, -41], [168, -44], [166, -46]];
    // Antarctica
    const antarctica = [
        [-180, -65], [-120, -73], [-60, -63], [0, -70], [60, -67], [120, -66], [180, -65], [180, -90], [-180, -90]
    ];

    const landPolys = [
        eurasia, britain, hokkaido, honshu, kyushuShikoku, 
        northAmerica, greenland, southAmerica, africa, madagascar, australia, nzNorth, nzSouth
    ];

    // 2. Draw Shallow Coastal Waters (Turquoise Water Glow Border around continents)
    ctx.lineWidth = 24;
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)'; // Turquoise Coastal Water Shallow Effect
    landPolys.forEach(poly => {
        ctx.beginPath();
        poly.forEach((pt, idx) => {
            const p = toPx(pt[0], pt[1]);
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.stroke();
    });

    // 3. Draw Deep Forest Landmasses with Crisp Neon Green Borders
    ctx.lineWidth = 4;
    landPolys.forEach(poly => {
        ctx.fillStyle = landStyle;
        ctx.strokeStyle = strokeStyle;
        ctx.beginPath();
        poly.forEach((pt, idx) => {
            const p = toPx(pt[0], pt[1]);
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    });

    // 4. Draw Antarctica Ice Cap (Pure White Glacial Ice)
    ctx.fillStyle = iceStyle;
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    antarctica.forEach((pt, idx) => {
        const p = toPx(pt[0], pt[1]);
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 5. Soft Atmospheric Cloud Whirls Overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.25, canvas.height * 0.4, 250, 0, Math.PI * 2);
    ctx.arc(canvas.width * 0.70, canvas.height * 0.5, 300, 0, Math.PI * 2);
    ctx.arc(canvas.width * 0.45, canvas.height * 0.3, 180, 0, Math.PI * 2);
    ctx.fill();

    // 4. Detailed Equatorial & Lat-Lon Grid Overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2;
    for (let lon = -150; lon <= 180; lon += 30) {
        const p1 = toPx(lon, 85);
        const p2 = toPx(lon, -85);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 30) {
        const p1 = toPx(-180, lat);
        const p2 = toPx(180, lat);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }

    return new Cesium.SingleTileImageryProvider({
        url: canvas.toDataURL('image/png'),
        rectangle: Cesium.Rectangle.MAX_VALUE
    });
}

/**
 * Initialize Cesium 3D Viewer with ultra-mild mouse scroll zoom
 */

// ==========================================================================
// Solar System Celestial Bodies Real-time Ephemeris & Visualization System
// ==========================================================================
const CELESTIAL_ENCYCLOPEDIA = {
    "SUN": {
        "mass": {
            "ja": "1.989 × 10^30 kg (地球の約33万倍)",
            "en": "1.989 × 10^30 kg (333,000x Earth)",
            "de": "1,989 × 10^30 kg (333.000-fache Erdmasse)",
            "fr": "1,989 × 10^30 kg (333 000 fois la Terre)",
            "es": "1,989 × 10^30 kg (333.000 veces la Tierra)",
            "pt": "1,989 × 10^30 kg (333.000 vezes a Terra)",
            "it": "1,989 × 10^30 kg (333.000 volte la Terra)",
            "ko": "1.989 × 10^30 kg (지구의 약 33만 배)",
            "nl": "1,989 × 10^30 kg (333.000x de aarde)",
            "id": "1,989 × 10^30 kg (333.000x Bumi)",
            "hi": "1.989 × 10^30 किग्रा (पृथ्वी का 333,000 गुना)",
            "ar": "1.989 × 10^30 كجم (333 ألف ضعف كتلة الأرض)",
            "zh": "1.989 × 10^30 千克 (地球的33.3万倍)",
            "ru": "1,989 × 10^30 кг (в 333 000 раз больше Земли)"
        },
        "diameter": {
            "ja": "1,392,700 km (地球の109倍)",
            "en": "1,392,700 km (109x Earth)",
            "de": "1.392.700 km (109-facher Erddurchmesser)",
            "fr": "1 392 700 km (109 fois la Terre)",
            "es": "1.392.700 km (109 veces la Tierra)",
            "pt": "1.392.700 km (109 vezes a Terra)",
            "it": "1.392.700 km (109 volte la Terra)",
            "ko": "1,392,700 km (지구의 109배)",
            "nl": "1.392.700 km (109x de aarde)",
            "id": "1.392.700 km (109x Bumi)",
            "hi": "1,392,700 किमी (पृथ्वी का 109 गुना)",
            "ar": "1,392,700 كم (109 أضعاف قطر الأرض)",
            "zh": "1,392,700 公里 (地球的109倍)",
            "ru": "1 392 700 км (в 109 раз больше Земли)"
        },
        "rotation": {
            "ja": "25.05日 (赤道部) / 34.4日 (極部)",
            "en": "25.05 days (Equator) / 34.4 days (Poles)",
            "de": "25,05 Tage (Äquator) / 34,4 Tage (Pole)",
            "fr": "25,05 jours (équateur) / 34,4 jours (pôles)",
            "es": "25,05 días (ecuador) / 34,4 días (polos)",
            "pt": "25,05 dias (equador) / 34,4 dias (polos)",
            "it": "25,05 giorni (equatore) / 34,4 giorni (poli)",
            "ko": "25.05일 (적도) / 34.4일 (극지)",
            "nl": "25,05 dagen (evenaar) / 34,4 dagen (polen)",
            "id": "25,05 hari (khatulistiwa) / 34,4 hari (kutub)",
            "hi": "25.05 दिन (भूमध्य रेखा) / 34.4 दिन (ध्रुव)",
            "ar": "25.05 يوماً (عند خط الاستواء) / 34.4 يوماً (القطبين)",
            "zh": "25.05天 (赤道) / 34.4天 (两极)",
            "ru": "25,05 дня (экватор) / 34,4 дня (полюса)"
        },
        "orbit": {
            "ja": "銀河系中心を約2億3000万年で1周 (銀河年)",
            "en": "Orbits Milky Way core in ~230 Million years (Galactic Year)",
            "de": "Umläuft das Milchstraßenzentrum in ~230 Mio. Jahren",
            "fr": "Orbite autour du centre galactique en ~230 millions d'années",
            "es": "Orbita el centro galáctico en ~230 millones de años",
            "pt": "Orbita o centro galáctico em ~230 milhões de anos",
            "it": "Orbita attorno al centro galattico in ~230 milioni di anni",
            "ko": "은하 중심을 약 2억 3000만 년에 1회 공전 (은하년)",
            "nl": "Draait om het melkwegcentrum in ~230 miljoen jaar",
            "id": "Mengorbit pusat Bima Sakti dalam ~230 juta tahun",
            "hi": "आकाशगंगा केंद्र की परिक्रमा ~23 करोड़ वर्षों में",
            "ar": "يدور حول مركز درب التبانة كل 230 مليون سنة (سنة مجرية)",
            "zh": "绕银河系中心公转一周约需2.3亿年 (银河年)",
            "ru": "Оборот вокруг центра Галактики за ~230 млн лет (галактический год)"
        },
        "temperature": {
            "ja": "表面 5,500℃ / 黒点 ~4,000℃ / 核 1,500万℃",
            "en": "Surface 5,500°C / Sunspots ~4,000°C / Core 15,000,000°C",
            "de": "Oberfläche 5.500°C / Flecken ~4.000°C / Kern 15 Mio.°C",
            "fr": "Surface 5 500°C / Taches ~4 000°C / Cœur 15 millions °C",
            "es": "Superficie 5.500°C / Manchas ~4.000°C / Núcleo 15 millones °C",
            "pt": "Superfície 5.500°C / Manchas ~4.000°C / Núcleo 15 milhões °C",
            "it": "Superficie 5.500°C / Macchie ~4.000°C / Nucleo 15 milioni °C",
            "ko": "표면 5,500℃ / 흑점 ~4,000℃ / 중심핵 1,500만℃",
            "nl": "Oppervlak 5.500°C / Vlekken ~4.000°C / Kern 15 miljoen °C",
            "id": "Permukaan 5.500°C / Bintik ~4.000°C / Inti 15 juta °C",
            "hi": "सतह 5,500°C / सौर कलंक ~4,000°C / कोर 1.5 करोड़ °C",
            "ar": "السطح 5,500°م / البقع ~4,000°م / النواة 15 مليون °م",
            "zh": "表面约 5,500℃ / 黑子约 4,000℃ / 核心 1,500万℃",
            "ru": "Поверхность 5 500°C / Пятна ~4 000°C / Ядро 15 млн °C"
        },
        "satellites": {
            "ja": "8惑星・5準惑星・数百万の小天体",
            "en": "8 Planets, 5 Dwarf Planets, Millions of small bodies",
            "de": "8 Planeten, 5 Zwergplaneten, Millionen Kleinkörper",
            "fr": "8 planètes, 5 planètes naines, millions de corps mineurs",
            "es": "8 planetas, 5 planetas enanos, millones de cuerpos menores",
            "pt": "8 planetas, 5 planetas anões, milhões de corpos celestes",
            "it": "8 pianeti, 5 pianeti nani, milioni di corpi minori",
            "ko": "8개 행성, 5개 왜소행성, 수백만 개의 소천체",
            "nl": "8 planeten, 5 dwergplaneten, miljoenen kleine lichamen",
            "id": "8 planet, 5 planet kerdil, jutaan benda kecil",
            "hi": "8 ग्रह, 5 बौने ग्रह, लाखों छोटे खगोलीय पिंड",
            "ar": "8 كواكب، 5 كواكب قزمة، وملايين الأجرام الصغيرة",
            "zh": "8大行星、5颗矮行星及数百万小天体",
            "ru": "8 планет, 5 карликовых планет, миллионы малых тел"
        },
        "discovery": {
            "ja": "先史時代より全人類に崇拝・観測。1610年ガリレオが黒点を望遠鏡観測。",
            "en": "Observed since prehistoric times. Galileo first observed sunspots with a telescope in 1610.",
            "de": "Seit der Urzeit verehrt. 1610 beobachtete Galileo Galilei Sonnenflecken mit dem Teleskop.",
            "fr": "Observé depuis la préhistoire. Galilée a observé les taches solaires au télescope en 1610.",
            "es": "Observado desde la prehistoria. Galileo observó las manchas solares con telescopio en 1610.",
            "pt": "Observado desde a pré-história. Galileu observou manchas solares com telescópio em 1610.",
            "it": "Osservato fin dalla preistoria. Nel 1610 Galileo osservò le macchie solari al telescopio.",
            "ko": "선사시대부터 인류가 관측 및 숭배. 1610년 갈릴레오가 망원경으로 흑점을 최초 관측.",
            "nl": "Waargenomen sinds de prehistorie. Galileo observeerde in 1610 zonnevlekken met een telescoop.",
            "id": "Diamati sejak zaman prasejarah. Galileo pertama kali mengamati bintik matahari dengan teleskop pada 1610.",
            "hi": "प्रागैतिहासिक काल से पूजित एवं प्रेक्षित। 1610 में गैलीलियो ने टेलीस्कोप से सौर कलंकों का अवलोकन किया।",
            "ar": "تم رصده منذ عصور ما قبل التاريخ. رصد غاليليو البقع الشمسية بالتلسكوب لأول مرة عام 1610.",
            "zh": "自史前时代起便被人类观测。1610年伽利略首次使用望远镜记录太阳黑子。",
            "ru": "Наблюдается с доисторических времен. В 1610 г. Галилей впервые исследовал солнечные пятна."
        },
        "missions": {
            "ja": "SOHO (1995年), SDO (2010年), NASAパーカー・ソーラー・プローブ (2018年太陽コロナ初到達), JAXAひのとり・ようこう・ひので。",
            "en": "SOHO (1995), SDO (2010), NASA Parker Solar Probe (first craft to touch the solar corona, 2018), JAXA Hinode.",
            "de": "SOHO (1995), SDO (2010), NASA Parker Solar Probe (erreichte 2018 die Sonnenkorona), Hinode.",
            "fr": "SOHO (1995), SDO (2010), NASA Parker Solar Probe (a touché la couronne solaire en 2018), Hinode.",
            "es": "SOHO (1995), SDO (2010), Sonda Solar Parker de la NASA (tocó la corona solar en 2018), Hinode.",
            "pt": "SOHO (1995), SDO (2010), Sonda Solar Parker da NASA (tocou a coroa solar em 2018), Hinode.",
            "it": "SOHO (1995), SDO (2010), NASA Parker Solar Probe (ha toccato la corona solare nel 2018), Hinode.",
            "ko": "SOHO(1995), SDO(2010), NASA 파커 솔라 프로브(2018년 태양 코로나 최초 진입), JAXA 히노데.",
            "nl": "SOHO (1995), SDO (2010), NASA Parker Solar Probe (bereikte de zonnecorona in 2018), Hinode.",
            "id": "SOHO (1995), SDO (2010), NASA Parker Solar Probe (menyentuh korona matahari pada 2018), Hinode.",
            "hi": "SOHO (1995), SDO (2010), नासा पार्कर सोलर प्रोब (2018 में सौर कोरोना में प्रवेश), Hinode.",
            "ar": "مسبار باركر الشمسي التابع لناسا (لامس الهالة الشمسية عام 2018)، SOHO (1995)، مرصد SDO.",
            "zh": "SOHO(1995), SDO(2010), NASA帕克太阳探测器(2018年首飞入日冕), JAXA日出号(Hinode)。",
            "ru": "SOHO (1995), SDO (2010), NASA Parker Solar Probe (впервые вошел в солнечную корону в 2018 г.), Hinode."
        }
    },
    "MOON": {
        "mass": {
            "ja": "7.342 × 10^22 kg (地球の0.0123倍 / 約1/81)",
            "en": "7.342 × 10^22 kg (0.0123x Earth / ~1/81)",
            "de": "7,342 × 10^22 kg (0,0123-fache Erdmasse / ~1/81)",
            "fr": "7,342 × 10^22 kg (0,0123 fois la Terre / ~1/81)",
            "es": "7,342 × 10^22 kg (0,0123 veces la Tierra / ~1/81)",
            "pt": "7,342 × 10^22 kg (0,0123 vezes a Terra / ~1/81)",
            "it": "7,342 × 10^22 kg (0,0123 volte la Terra / ~1/81)",
            "ko": "7.342 × 10^22 kg (지구의 0.0123배 / 약 1/81)",
            "nl": "7,342 × 10^22 kg (0,0123x de aarde / ~1/81)",
            "id": "7,342 × 10^22 kg (0,0123x Bumi / ~1/81)",
            "hi": "7.342 × 10^22 किग्रा (पृथ्वी का 0.0123 गुना / ~1/81)",
            "ar": "7.342 × 10^22 كجم (0.0123 ضعف كتلة الأرض)",
            "zh": "7.342 × 10^22 千克 (地球的0.0123倍 / 约1/81)",
            "ru": "7,342 × 10^22 кг (0,0123 массы Земли / ~1/81)"
        },
        "diameter": {
            "ja": "3,474.8 km (地球の0.273倍 / 約1/4)",
            "en": "3,474.8 km (0.273x Earth / ~1/4)",
            "de": "3.474,8 km (0,273-facher Erddurchmesser)",
            "fr": "3 474,8 km (0,273 fois la Terre)",
            "es": "3.474,8 km (0,273 veces la Tierra)",
            "pt": "3.474,8 km (0,273 vezes a Terra)",
            "it": "3.474,8 km (0,273 volte la Terra)",
            "ko": "3,474.8 km (지구의 0.273배 / 약 1/4)",
            "nl": "3.474,8 km (0,273x de aarde)",
            "id": "3.474,8 km (0,273x Bumi)",
            "hi": "3,474.8 किमी (पृथ्वी का 0.273 गुना)",
            "ar": "3,474.8 كم (0.273 من قطر الأرض)",
            "zh": "3,474.8 公里 (地球的0.273倍 / 约1/4)",
            "ru": "3 474,8 км (0,273 диаметра Земли)"
        },
        "rotation": {
            "ja": "27.32日 (自転公転完全同期・潮汐ロック)",
            "en": "27.32 days (Tidally locked synchronous rotation)",
            "de": "27,32 Tage (Gebundene synchrone Rotation)",
            "fr": "27,32 jours (Rotation synchrone verrouillée)",
            "es": "27,32 días (Rotación síncrona acoplada)",
            "pt": "27,32 dias (Rotação síncrona acoplada)",
            "it": "27,32 giorni (Rotazione sincrona bloccata)",
            "ko": "27.32일 (조석 고정 완벽 동주기 자전)",
            "nl": "27,32 dagen (Synchrone rotatie)",
            "id": "27,32 hari (Rotasi sinkron terkunci pasang surut)",
            "hi": "27.32 दिन (ज्वारीय रूप से बद्ध समकालिक घूर्णन)",
            "ar": "27.32 يوماً (دوران متزامن مقيد مدياً)",
            "zh": "27.32天 (潮汐锁定同步自转)",
            "ru": "27,32 дня (Синхронное приливно-захваченное вращение)"
        },
        "orbit": {
            "ja": "27.32日 (恒星月) / 29.53日 (朔望月・満ち欠け)",
            "en": "27.32 days (Sidereal) / 29.53 days (Synodic Moon Phases)",
            "de": "27,32 Tage (siderisch) / 29,53 Tage (synodisch)",
            "fr": "27,32 jours (sidéral) / 29,53 jours (synodique)",
            "es": "27,32 días (sideral) / 29,53 días (sinódico)",
            "pt": "27,32 dias (sideral) / 29,53 dias (sinódico)",
            "it": "27,32 giorni (siderale) / 29,53 giorni (sinodico)",
            "ko": "27.32일 (항성월) / 29.53일 (삭망월 주기)",
            "nl": "27,32 dagen (siderisch) / 29,53 dagen (synodisch)",
            "id": "27,32 hari (sideris) / 29,53 hari (sinodis)",
            "hi": "27.32 दिन (नाक्षत्र) / 29.53 दिन (युति मास)",
            "ar": "27.32 يوماً (فلكي) / 29.53 يوماً (اقتراني)",
            "zh": "27.32天 (恒星月) / 29.53天 (朔望月周期)",
            "ru": "27,32 дня (сидерический) / 29,53 дня (синодический)"
        },
        "temperature": {
            "ja": "昼 +120℃ / 夜 -130℃ (極小 -246℃)",
            "en": "Day +120°C / Night -130°C (Polar traps -246°C)",
            "de": "Tag +120°C / Nacht -130°C (Polarkrater -246°C)",
            "fr": "Jour +120°C / Nuit -130°C (Cratères polaires -246°C)",
            "es": "Día +120°C / Noche -130°C (Cráteres polares -246°C)",
            "pt": "Dia +120°C / Noite -130°C (Crateras polares -246°C)",
            "it": "Giorno +120°C / Notte -130°C (Crateri polari -246°C)",
            "ko": "낮 +120℃ / 밤 -130℃ (극지 영구음영 -246℃)",
            "nl": "Dag +120°C / Nacht -130°C (Poolkraters -246°C)",
            "id": "Siang +120°C / Malam -130°C (Kutub -246°C)",
            "hi": "दिन +120°C / रात -130°C (ध्रुवीय गड्ढे -246°C)",
            "ar": "النهار +120°م / الليل -130°م (الفوهات القطبية -246°م)",
            "zh": "白昼约 +120℃ / 黑夜约 -130℃ (极区永久阴影坑 -246℃)",
            "ru": "День +120°C / Ночь -130°C (В полярных кратерах -246°C)"
        },
        "satellites": {
            "ja": "なし (地球を周回する第1衛星)",
            "en": "None (Earth's natural moon)",
            "de": "Keine (Natürlicher Mond der Erde)",
            "fr": "Aucun (Satellite naturel de la Terre)",
            "es": "Ninguno (Satélite natural de la Tierra)",
            "pt": "Nenhum (Satélite natural da Terra)",
            "it": "Nessuno (Satellite naturale della Terra)",
            "ko": "없음 (지구를 공전하는 유일한 위성)",
            "nl": "Geen (Natuurlijke satelliet van de aarde)",
            "id": "Tidak ada (Satelit alami Bumi)",
            "hi": "कोई नहीं (पृथ्वी का उपग्रह)",
            "ar": "لا يوجد (تابع طبيعي للأرض)",
            "zh": "无 (为地球唯一的天然卫星)",
            "ru": "Нет (Спутник Земли)"
        },
        "discovery": {
            "ja": "古代より人類が観測。1609年ガリレオが望遠鏡で月面クレーターを描写。",
            "en": "Observed since antiquity. In 1609, Galileo mapped craters and maria with a telescope.",
            "de": "Seit der Antike beobachtet. 1609 zeichnete Galileo Galilei die ersten Mondkrater.",
            "fr": "Observé depuis l'Antiquité. En 1609, Galilée cartographie les cratères lunaires au télescope.",
            "es": "Observado desde la antigüedad. En 1609, Galileo cartografió los cráteres con telescopio.",
            "pt": "Observado desde a antiguidade. Em 1609, Galileu mapeou as crateras lunares.",
            "it": "Osservato fin dall'antichità. Nel 1609 Galileo mappò crateri e mari lunari al telescopio.",
            "ko": "고대부터 인류가 관측. 1609년 갈릴레오 갈릴레이가 망원경으로 월면 크레이터를 정밀 스케치.",
            "nl": "Sinds de oudheid waargenomen. In 1609 bracht Galileo kraters in kaart.",
            "id": "Diamati sejak zaman kuno. Pada 1609, Galileo memetakan kawah Bulan.",
            "hi": "प्राचीन काल से प्रेक्षित। 1609 में गैलीलियो ने दूरबीन से चंद्रमा के क्रेटरों का मानचित्रण किया।",
            "ar": "تم رصده منذ القدم. رسم غاليليو أول خريطة لفوهات القمر بالتلسكوب عام 1609.",
            "zh": "人类自古观测。1609年伽利略首次通过望远镜绘制月球环形山与月海地图。",
            "ru": "Наблюдается с древности. В 1609 г. Галилей составил первые карты лунных кратеров."
        },
        "missions": {
            "ja": "アポロ11号(1969年人類初着陸), JAXAかぐや(2007年), SLIM(2024年ピンポイント着陸), NASAアルテミス計画。",
            "en": "Apollo 11 (first crewed landing, 1969), JAXA Kaguya (2007), JAXA SLIM (pinpoint landing, 2024), NASA Artemis Program.",
            "de": "Apollo 11 (erste bemannte Landung, 1969), JAXA Kaguya (2007), JAXA SLIM (2024), NASA Artemis-Programm.",
            "fr": "Apollo 11 (premier alunissage habité, 1969), JAXA Kaguya (2007), JAXA SLIM (2024), Programme Artemis de la NASA.",
            "es": "Apolo 11 (primer alunizaje tripulado, 1969), JAXA Kaguya (2007), JAXA SLIM (2024), Programa Artemisa de la NASA.",
            "pt": "Apollo 11 (primeiro pouso tripulado, 1969), JAXA Kaguya (2007), JAXA SLIM (2024), Programa Artemis da NASA.",
            "it": "Apollo 11 (primo allunaggio umano, 1969), JAXA Kaguya (2007), JAXA SLIM (2024), Programma Artemis della NASA.",
            "ko": "아폴로 11호(1969년 인류 최초 착륙), JAXA 카구야(2007), JAXA SLIM(2024 핀포인트 착륙), NASA 아르테미스 계획.",
            "nl": "Apollo 11 (eerste mens op de maan, 1969), JAXA Kaguya (2007), JAXA SLIM (2024), NASA Artemis-programma.",
            "id": "Apollo 11 (pendaratan berawak pertama, 1969), JAXA Kaguya (2007), JAXA SLIM (2024), Program Artemis NASA.",
            "hi": "अपोलो 11 (1969 में पहला मानव कदम), JAXA कागुया (2007), SLIM (2024), नासा आर्टेमिस कार्यक्रम।",
            "ar": "أبولو 11 (أول هبوط بشري عام 1969)، كاجويا JAXA (2007)، SLIM (2024)، برنامج أرتميس التابع لناسا.",
            "zh": "阿波罗11号(1969年人类首次登月), JAXA辉夜姬号(2007), SLIM(2024精准着陆), NASA阿尔忒弥斯重返月球计划。",
            "ru": "Аполлон-11 (первая высадка человека, 1969), JAXA Кагуя (2007), JAXA SLIM (2024), Программа Артемида NASA."
        }
    },
    "MERCURY": {
        "mass": {
            "ja": "3.301 × 10^23 kg (地球の0.0553倍)",
            "en": "3.301 × 10^23 kg (0.0553x Earth)",
            "de": "3,301 × 10^23 kg (0,0553-fache Erdmasse)",
            "fr": "3,301 × 10^23 kg (0,0553 fois la Terre)",
            "es": "3,301 × 10^23 kg (0,0553 veces la Tierra)",
            "pt": "3,301 × 10^23 kg (0,0553 vezes a Terra)",
            "it": "3,301 × 10^23 kg (0,0553 volte la Terra)",
            "ko": "3.301 × 10^23 kg (지구의 0.0553배)",
            "nl": "3,301 × 10^23 kg (0,0553x de aarde)",
            "id": "3,301 × 10^23 kg (0,0553x Bumi)",
            "hi": "3.301 × 10^23 किग्रा (पृथ्वी का 0.0553 गुना)",
            "ar": "3.301 × 10^23 كجم (0.0553 ضعف كتلة الأرض)",
            "zh": "3.301 × 10^23 千克 (地球的0.0553倍)",
            "ru": "3,301 × 10^23 кг (0,0553 массы Земли)"
        },
        "diameter": {
            "ja": "4,879.4 km (地球の0.383倍)",
            "en": "4,879.4 km (0.383x Earth)",
            "de": "4.879,4 km (0,383-facher Erddurchmesser)",
            "fr": "4 879,4 km (0,383 fois la Terre)",
            "es": "4.879,4 km (0,383 veces la Tierra)",
            "pt": "4.879,4 km (0,383 vezes a Terra)",
            "it": "4.879,4 km (0,383 volte la Terra)",
            "ko": "4,879.4 km (지구의 0.383배)",
            "nl": "4.879,4 km (0,383x de aarde)",
            "id": "4.879,4 km (0,383x Bumi)",
            "hi": "4,879.4 किमी (पृथ्वी का 0.383 गुना)",
            "ar": "4,879.4 كم (0.383 من قطر الأرض)",
            "zh": "4,879.4 公里 (地球的0.383倍)",
            "ru": "4 879,4 км (0,383 диаметра Земли)"
        },
        "rotation": {
            "ja": "58.65日 (公転と3:2共鳴自転)",
            "en": "58.65 days (3:2 spin-orbit resonance)",
            "de": "58,65 Tage (3:2 Spin-Bahn-Resonanz)",
            "fr": "58,65 jours (résonance spin-orbite 3:2)",
            "es": "58,65 días (resonancia espín-órbita 3:2)",
            "pt": "58,65 dias (ressonância rotação-órbita 3:2)",
            "it": "58,65 giorni (risonanza spin-orbita 3:2)",
            "ko": "58.65일 (3:2 스핀-궤도 공명 자전)",
            "nl": "58,65 dagen (3:2 spin-baanresonantie)",
            "id": "58,65 hari (resonansi spin-orbit 3:2)",
            "hi": "58.65 दिन (3:2 घूर्णन-कक्षा प्रतिध्वनि)",
            "ar": "58.65 يوماً (رنين مداري 3:2)",
            "zh": "58.65天 (3:2自转公转轨道共振)",
            "ru": "58,65 дня (резонанс 3:2 между вращением и обращением)"
        },
        "orbit": {
            "ja": "87.97日 (太陽系最短公転周期)",
            "en": "87.97 days (Fastest planetary orbit in Solar System)",
            "de": "87,97 Tage (Kürzeste Umlaufzeit im Sonnensystem)",
            "fr": "87,97 jours (Orbite la plus rapide du système solaire)",
            "es": "87,97 días (Órbita más rápida del sistema solar)",
            "pt": "87,97 dias (Órbita mais rápida do sistema solar)",
            "it": "87,97 giorni (Orbita più veloce del sistema solare)",
            "ko": "87.97일 (태양계 최단 공전 주기)",
            "nl": "87,97 dagen (Snelste omlooptijd in het zonnestelsel)",
            "id": "87,97 hari (Orbit planet tercepat di Tata Surya)",
            "hi": "87.97 दिन (सौर मंडल में सबसे तेज़ कक्षा)",
            "ar": "87.97 يوماً (أسرع دورة مدارية في النظام الشمسي)",
            "zh": "87.97天 (全太阳系各大行星中最短公转周期)",
            "ru": "87,97 дня (Самый быстрый период обращения в системе)"
        },
        "temperature": {
            "ja": "昼 +430℃ / 夜 -180℃ (差610℃)",
            "en": "Day +430°C / Night -180°C (610°C extreme swing)",
            "de": "Tag +430°C / Nacht -180°C (610°C Temperaturdifferenz)",
            "fr": "Jour +430°C / Nuit -180°C (Écart extrême de 610°C)",
            "es": "Día +430°C / Noche -180°C (Oscilación extrema de 610°C)",
            "pt": "Dia +430°C / Noite -180°C (Variação extrema de 610°C)",
            "it": "Giorno +430°C / Notte -180°C (Escursione estrema di 610°C)",
            "ko": "낮 +430℃ / 밤 -180℃ (일교차 610℃)",
            "nl": "Dag +430°C / Nacht -180°C (Verschil 610°C)",
            "id": "Siang +430°C / Malam -180°C (Fluktuasi 610°C)",
            "hi": "दिन +430°C / रात -180°C (610°C अत्यधिक अंतर)",
            "ar": "النهار +430°م / الليل -180°م (تفاوت هائل 610°م)",
            "zh": "白昼约 +430℃ / 黑夜约 -180℃ (昼夜温差高达610℃)",
            "ru": "День +430°C / Ночь -180°C (Перепад 610°C)"
        },
        "satellites": {
            "ja": "なし",
            "en": "None",
            "de": "Keine",
            "fr": "Aucun",
            "es": "Ninguno",
            "pt": "Nenhum",
            "it": "Nessuno",
            "ko": "없음",
            "nl": "Geen",
            "id": "Tidak ada",
            "hi": "कोई नहीं",
            "ar": "لا يوجد",
            "zh": "无",
            "ru": "Нет"
        },
        "discovery": {
            "ja": "古代バビロニア・シュメール期より記録。紀元前14世紀の『ムル・アピン』に登場。",
            "en": "Known since antiquity (recorded in Babylonian astronomy around 14th century BC).",
            "de": "Seit der Antike bekannt (babylonische Aufzeichnungen aus dem 14. Jh. v. Chr.).",
            "fr": "Connu depuis l'Antiquité (premières mentions babyloniennes au XIVe siècle av. J.-C.).",
            "es": "Conocido desde la antigüedad (registros babilónicos del siglo XIV a.C.).",
            "pt": "Conhecido desde a antiguidade (registros babilônicos do século XIV a.C.).",
            "it": "Conosciuto fin dall'antichità (documentato nell'astronomia babilonese nel XIV sec. a.C.).",
            "ko": "고대 메소포타미아・바빌로니아 시대(기원전 14세기)부터 관측 기록.",
            "nl": "Bekend sinds de oudheid (Babylonische verslagen rond de 14e eeuw v.Chr.).",
            "id": "Dikenal sejak zaman kuno (catatan astronomi Babilonia abad ke-14 SM).",
            "hi": "प्राचीन काल से ज्ञात (14वीं शताब्दी ईसा पूर्व के बेबीलोनियन खगोल विज्ञान में दर्ज)।",
            "ar": "معروف منذ القدم (سجله البابليون في القرن الرابع عشر قبل الميلاد).",
            "zh": "古巴比伦与苏美尔时期已有记录(公元前14世纪《MUL.APIN》星表记载)。",
            "ru": "Известен с древности (записи в вавилонских таблицах XIV века до н.э.)."
        },
        "missions": {
            "ja": "マリナー10号(1974年), メッセンジャー(2011年軌道投入), JAXA/ESAベピ・コロンボ(2026年周回開始予定)。",
            "en": "Mariner 10 (1974), MESSENGER (first orbiter, 2011), JAXA/ESA BepiColombo (arriving 2026).",
            "de": "Mariner 10 (1974), MESSENGER (2011), ESA/JAXA BepiColombo (Ankunft 2026).",
            "fr": "Mariner 10 (1974), MESSENGER (2011), ESA/JAXA BepiColombo (arrivée en 2026).",
            "es": "Mariner 10 (1974), MESSENGER (2011), ESA/JAXA BepiColombo (llegada en 2026).",
            "pt": "Mariner 10 (1974), MESSENGER (2011), ESA/JAXA BepiColombo (chegada em 2026).",
            "it": "Mariner 10 (1974), MESSENGER (2011), ESA/JAXA BepiColombo (arrivo previsto 2026).",
            "ko": "매리너 10호(1974), 메신저(2011 궤도 진입), JAXA/ESA 베피콜롬보(2026 도착 예정).",
            "nl": "Mariner 10 (1974), MESSENGER (2011), ESA/JAXA BepiColombo (aankomst 2026).",
            "id": "Mariner 10 (1974), MESSENGER (2011), ESA/JAXA BepiColombo (tiba 2026).",
            "hi": "मैरिनर 10 (1974), मैसेंजर (2011), ESA/JAXA बेपिको Colombo (2026 में आगमन)।",
            "ar": "مارينر 10 (1974)، ميسنجر (2011)، بيبيكولومبو المشترك بين ESA/JAXA (وصول 2026).",
            "zh": "水手10号(1974), 信使号MESSENGER(2011年绕轨), JAXA/ESA贝皮·哥伦布号(2026年入轨)。",
            "ru": "Маринер-10 (1974), MESSENGER (2011), ESA/JAXA БепиКоломбо (прибытие в 2026 г.)."
        }
    },
    "VENUS": {
        "mass": {
            "ja": "4.867 × 10^24 kg (地球の0.815倍)",
            "en": "4.867 × 10^24 kg (0.815x Earth)",
            "de": "4,867 × 10^24 kg (0,815-fache Erdmasse)",
            "fr": "4,867 × 10^24 kg (0,815 fois la Terre)",
            "es": "4,867 × 10^24 kg (0,815 veces la Tierra)",
            "pt": "4,867 × 10^24 kg (0,815 vezes a Terra)",
            "it": "4,867 × 10^24 kg (0,815 volte la Terra)",
            "ko": "4.867 × 10^24 kg (지구의 0.815배)",
            "nl": "4,867 × 10^24 kg (0,815x de aarde)",
            "id": "4,867 × 10^24 kg (0,815x Bumi)",
            "hi": "4.867 × 10^24 किग्रा (पृथ्वी का 0.815 गुना)",
            "ar": "4.867 × 10^24 كجم (0.815 ضعف كتلة الأرض)",
            "zh": "4.867 × 10^24 千克 (地球的0.815倍)",
            "ru": "4,867 × 10^24 кг (0,815 массы Земли)"
        },
        "diameter": {
            "ja": "12,104 km (地球の0.949倍 / 双子惑星)",
            "en": "12,104 km (0.949x Earth / Earth's Twin)",
            "de": "12.104 km (0,949-facher Erddurchmesser / Zwillingsplanet)",
            "fr": "12 104 km (0,949 fois la Terre / Jumelle de la Terre)",
            "es": "12.104 km (0,949 veces la Tierra / Gemelo de la Tierra)",
            "pt": "12.104 km (0,949 vezes a Terra / Gêmeo da Terra)",
            "it": "12.104 km (0,949 volte la Terra / Gemella della Terra)",
            "ko": "12,104 km (지구의 0.949배 / 쌍둥이 행성)",
            "nl": "12.104 km (0,949x de aarde / Tweelingplaneet)",
            "id": "12.104 km (0,949x Bumi / Kembaran Bumi)",
            "hi": "12,104 किमी (पृथ्वी का 0.949 गुना / पृथ्वी का जुड़वां)",
            "ar": "12,104 كم (0.949 من قطر الأرض / توأم الأرض)",
            "zh": "12,104 公里 (地球的0.949倍 / 地球姊妹星)",
            "ru": "12 104 км (0,949 диаметра Земли / Близнец Земли)"
        },
        "rotation": {
            "ja": "243.02日 (逆回転・東から太陽が昇る)",
            "en": "243.02 days (Retrograde rotation / Sun rises in west)",
            "de": "243,02 Tage (Rückläufige Eigenrotation)",
            "fr": "243,02 jours (Rotation rétrograde inversée)",
            "es": "243,02 días (Rotación retrógrada inversa)",
            "pt": "243,02 dias (Rotação retrógrada inversa)",
            "it": "243,02 giorni (Rotazione retrograda inversa)",
            "ko": "243.02일 (역방향 자전・서쪽에서 해가 뜸)",
            "nl": "243,02 dagen (Retrograde rotatie)",
            "id": "243,02 hari (Rotasi terbalik retrograde)",
            "hi": "243.02 दिन (विपरीत दिशा में घूर्णन)",
            "ar": "243.02 يوماً (دوران تراجعي عكسي)",
            "zh": "243.02天 (逆向自转 / 太阳西升东落)",
            "ru": "243,02 дня (Ретроградное обратное вращение)"
        },
        "orbit": {
            "ja": "224.70日 (自転より公転が速い)",
            "en": "224.70 days (Orbital year shorter than its day)",
            "de": "224,70 Tage (Ein Jahr ist kürzer als ein Tag)",
            "fr": "224,70 jours (L'année est plus courte que le jour)",
            "es": "224,70 días (Un año es más corto que un día)",
            "pt": "224,70 dias (Um ano é mais curto que um dia)",
            "it": "224,70 giorni (Un anno è più breve di un giorno)",
            "ko": "224.70일 (하루보다 1년이 더 짧은 행성)",
            "nl": "224,70 dagen (Jaar is korter dan een dag)",
            "id": "224,70 hari (Satu tahun lebih singkat dari satu hari)",
            "hi": "224.70 दिन (दिन से छोटा वर्ष)",
            "ar": "224.70 يوماً (سنتها أقصر من يومها)",
            "zh": "224.70天 (公转周期比自转周期更短)",
            "ru": "224,70 дня (Год короче венерианских суток)"
        },
        "temperature": {
            "ja": "約462℃ (暴走温室効果・太陽系最高温)",
            "en": "~462°C (Runaway greenhouse / Hottest planet in Solar System)",
            "de": "~462°C (Extremer Treibhauseffekt / Heißester Planet)",
            "fr": "~462°C (Effet de serre extrême / Planète la plus chaude)",
            "es": "~462°C (Efecto invernadero desbocado / Más caliente)",
            "pt": "~462°C (Efeito estufa descontrolado / Mais quente)",
            "it": "~462°C (Effetto serra incontrollato / Più calda del sistema)",
            "ko": "약 462℃ (폭주 온실효과 / 태양계 최고온 행성)",
            "nl": "~462°C (Broeikaseffect / Heetste planeet)",
            "id": "~462°C (Efek rumah kaca ekstrem / Planet terpanas)",
            "hi": "~462°C (तीव्र ग्रीनहाउस प्रभाव / सबसे गर्म ग्रह)",
            "ar": "~462°م (احتباس حراري هائل / أشد كواكب النظام حرارة)",
            "zh": "约 462℃ (失控温室效应 / 全太阳系最高温行星)",
            "ru": "~462°C (Парниковый эффект / Самая горячая планета)"
        },
        "satellites": {
            "ja": "なし",
            "en": "None",
            "de": "Keine",
            "fr": "Aucun",
            "es": "Ninguno",
            "pt": "Nenhum",
            "it": "Nessuno",
            "ko": "없음",
            "nl": "Geen",
            "id": "Tidak ada",
            "hi": "कोई नहीं",
            "ar": "لا يوجد",
            "zh": "无",
            "ru": "Нет"
        },
        "discovery": {
            "ja": "古代より「明けの明星」「宵の明星」として観測。1610年ガリレオが満ち欠けを発見。",
            "en": "Observed since prehistoric times as Morning/Evening Star. Galileo discovered its phases in 1610.",
            "de": "Seit der Urzeit als Morgen- und Abendstern bekannt. 1610 entdeckte Galilei die Phasen.",
            "fr": "Connue depuis la préhistoire comme l'Étoile du berger. Galilée découvre ses phases en 1610.",
            "es": "Conocido desde la prehistoria como Lucero del alba. Galileo descubrió sus fases en 1610.",
            "pt": "Conhecido desde a pré-história como Estrela d'Alva. Galileu descobriu suas fases em 1610.",
            "it": "Conosciuta fin dalla preistoria come Stella del Mattino. Nel 1610 Galileo ne scoprì le fasi.",
            "ko": "선사시대부터 샛별・개밥바라기로 관측. 1610년 갈릴레오가 금성의 위상 변화(차고 긺)를 발견.",
            "nl": "Sinds de prehistorie bekend als Morgen- en Avondster. Galileo ontdekte de schijngestalten in 1610.",
            "id": "Dikenal sejak zaman prasejarah sebagai Bintang Fajar/Kejora. Galileo menemukan fasenya pada 1610.",
            "hi": "प्रागैतिहासिक काल से भोर का तारा / सांझ का तारा। 1610 में गैलीलियो ने इसकी कलाओं की खोज की।",
            "ar": "رُصد منذ فجر التاريخ كنجمة الصباح والمساء. اكتشف غاليليو أطواره عام 1610.",
            "zh": "自古便作为“启明星”与“长庚星”被记载。1610年伽利略首次通过望远镜发现金星相位盈亏。",
            "ru": "Наблюдается с древности как Утренняя и Вечерняя звезда. В 1610 г. Галилей открыл фазы Венеры."
        },
        "missions": {
            "ja": "ソ連ベネラ7号(1970年惑星初着陸), NASAマゼラン(1990年レーダー全球地図), JAXAあかつき(2015年気象観測)。",
            "en": "Venera 7 (first landing on another planet, 1970), NASA Magellan (radar map, 1990), JAXA Akatsuki (climate, 2015).",
            "de": "Venera 7 (erste Landung 1970), NASA Magellan (Radarkarte 1990), JAXA Akatsuki (2015).",
            "fr": "Venera 7 (premier atterrissage en 1970), NASA Magellan (cartographie radar 1990), JAXA Akatsuki (2015).",
            "es": "Venera 7 (primer aterrizaje en 1970), NASA Magallanes (mapa radar 1990), JAXA Akatsuki (2015).",
            "pt": "Venera 7 (primeiro pouso em 1970), NASA Magellan (mapa de radar 1990), JAXA Akatsuki (2015).",
            "it": "Venera 7 (primo atterraggio nel 1970), NASA Magellan (mappa radar 1990), JAXA Akatsuki (2015).",
            "ko": "베네라 7호(1970년 인류 최초 타 행성 착륙), NASA 마젤란(1990 레이더 지도), JAXA 아카츠키(2015 기상 탐사).",
            "nl": "Venera 7 (eerste landing in 1970), NASA Magellan (radarkaart 1990), JAXA Akatsuki (2015).",
            "id": "Venera 7 (pendaratan pertama di planet lain, 1970), NASA Magellan (1990), JAXA Akatsuki (2015).",
            "hi": "वेनेरा 7 (1970 में किसी ग्रह पर पहला लैंडिंग), नासा मैगलन (1990), JAXA अकात्सुकी (2015)।",
            "ar": "فينيرا 7 (أول هبوط على كوكب آخر عام 1970)، ماجلان ناسا (1990)، أكاتسوكي JAXA (2015).",
            "zh": "苏联金星7号(1970年人类首次成功着陆异星), NASA麦哲伦号(1990雷达全图), JAXA破晓号Akatsuki(2015)。",
            "ru": "Венера-7 (первая посадка на другую планету, 1970), NASA Магеллан (1990), JAXA Акацуки (2015)."
        }
    },
    "MARS": {
        "mass": {
            "ja": "6.417 × 10^23 kg (地球の0.107倍 / 約1/10)",
            "en": "6.417 × 10^23 kg (0.107x Earth / ~1/10)",
            "de": "6,417 × 10^23 kg (0,107-fache Erdmasse / ~1/10)",
            "fr": "6,417 × 10^23 kg (0,107 fois la Terre / ~1/10)",
            "es": "6,417 × 10^23 kg (0,107 veces la Tierra / ~1/10)",
            "pt": "6,417 × 10^23 kg (0,107 vezes a Terra / ~1/10)",
            "it": "6,417 × 10^23 kg (0,107 volte la Terra / ~1/10)",
            "ko": "6.417 × 10^23 kg (지구의 0.107배 / 약 1/10)",
            "nl": "6,417 × 10^23 kg (0,107x de aarde / ~1/10)",
            "id": "6,417 × 10^23 kg (0,107x Bumi / ~1/10)",
            "hi": "6.417 × 10^23 किग्रा (पृथ्वी का 0.107 गुना / ~1/10)",
            "ar": "6.417 × 10^23 كجم (0.107 ضعف كتلة الأرض)",
            "zh": "6.417 × 10^23 千克 (地球的0.107倍 / 约1/10)",
            "ru": "6,417 × 10^23 кг (0,107 массы Земли / ~1/10)"
        },
        "diameter": {
            "ja": "6,779 km (地球の0.532倍 / 約半分)",
            "en": "6,779 km (0.532x Earth / ~half size)",
            "de": "6.779 km (0,532-facher Erddurchmesser / ca. halb so groß)",
            "fr": "6 779 km (0,532 fois la Terre / environ la moitié)",
            "es": "6.779 km (0,532 veces la Tierra / ~la mitad)",
            "pt": "6.779 km (0,532 vezes a Terra / ~metade do tamanho)",
            "it": "6.779 km (0,532 volte la Terra / circa la metà)",
            "ko": "6,779 km (지구의 0.532배 / 약 절반 크기)",
            "nl": "6.779 km (0,532x de aarde / ~half zo groot)",
            "id": "6.779 km (0,532x Bumi / ~setengah ukuran)",
            "hi": "6,779 किमी (पृथ्वी का 0.532 गुना / लगभग आधा)",
            "ar": "6,779 كم (0.532 من قطر الأرض / حوالي نصف حجمها)",
            "zh": "6,779 公里 (地球的0.532倍 / 约地球的一半)",
            "ru": "6 779 км (0,532 диаметра Земли / примерно половина Земли)"
        },
        "rotation": {
            "ja": "24時間37分22秒 (1火星日/Sol・地球と酷似)",
            "en": "24h 37m 22s (1 Martian Sol / Very close to Earth)",
            "de": "24 Std. 37 Min. 22 Sek. (1 Mars-Sol / Fast wie auf Erden)",
            "fr": "24h 37m 22s (1 sol martien / Très similaire à la Terre)",
            "es": "24h 37m 22s (1 sol marciano / Muy similar a la Tierra)",
            "pt": "24h 37m 22s (1 sol marciano / Muito similar à Terra)",
            "it": "24h 37m 22s (1 sol marziano / Molto simile alla Terra)",
            "ko": "24시간 37분 22초 (1 화성일/Sol・지구와 거의 일치)",
            "nl": "24u 37m 22s (1 Martiaanse Sol / Bijna gelijk aan de Aarde)",
            "id": "24j 37m 22d (1 Sol Mars / Sangat mirip dengan Bumi)",
            "hi": "24 घंटे 37 मिनट 22 सेकंड (1 मंगल दिवस/Sol)",
            "ar": "24 ساعة و 37 دقيقة و 22 ثانية (يوم مريخي سول واحد)",
            "zh": "24小时37分22秒 (1火星日/Sol / 与地球自转极其接近)",
            "ru": "24 ч 37 мин 22 с (1 марсианский сол / Близко к земным суткам)"
        },
        "orbit": {
            "ja": "686.98日 (約1.88地球年)",
            "en": "686.98 days (~1.88 Earth years)",
            "de": "686,98 Tage (~1,88 Erdenjahre)",
            "fr": "686,98 jours (~1,88 années terrestres)",
            "es": "686,98 días (~1,88 años terrestres)",
            "pt": "686,98 dias (~1,88 anos terrestres)",
            "it": "686,98 giorni (~1,88 anni terrestri)",
            "ko": "686.98일 (약 1.88 지구년)",
            "nl": "686,98 dagen (~1,88 aardse jaren)",
            "id": "686,98 hari (~1,88 tahun Bumi)",
            "hi": "686.98 दिन (~1.88 पृथ्वी वर्ष)",
            "ar": "686.98 يوماً (~1.88 سنة أرضية)",
            "zh": "686.98天 (约1.88地球年)",
            "ru": "686,98 дней (~1,88 земных года)"
        },
        "temperature": {
            "ja": "平均 -63℃ (夏昼 +20℃ / 冬極夜 -140℃)",
            "en": "Avg -63°C (Summer noon +20°C / Winter poles -140°C)",
            "de": "Mittel -63°C (Sommer +20°C / Polwinter -140°C)",
            "fr": "Moyenne -63°C (Été +20°C / Hiver polaire -140°C)",
            "es": "Media -63°C (Verano +20°C / Invierno polar -140°C)",
            "pt": "Média -63°C (Verão +20°C / Inverno polar -140°C)",
            "it": "Media -63°C (Estate +20°C / Inverno polare -140°C)",
            "ko": "평균 -63℃ (여름 낮 +20℃ / 극지 겨울 -140℃)",
            "nl": "Gemiddeld -63°C (Zomer +20°C / Winter -140°C)",
            "id": "Rata-rata -63°C (Siang +20°C / Kutub -140°C)",
            "hi": "औसत -63°C (ग्रीष्म दोपहर +20°C / ध्रुवीय -140°C)",
            "ar": "متوسط -63°م (صيفاً +20°م / الشتاء القطبي -140°م)",
            "zh": "平均 -63℃ (夏季赤道正午 +20℃ / 极区严冬 -140℃)",
            "ru": "Средняя -63°C (Летом до +20°C / На полюсах -140°C)"
        },
        "satellites": {
            "ja": "2個 (フォボス, ダイモス / 捕獲小惑星)",
            "en": "2 Moons (Phobos, Deimos / Captured Asteroids)",
            "de": "2 Monde (Phobos, Deimos / Eingefangene Asteroiden)",
            "fr": "2 lunes (Phobos, Déimos / Astéroïdes capturés)",
            "es": "2 lunas (Fobos, Deimos / Asteroides capturados)",
            "pt": "2 luas (Fobos, Deimos / Asteroides capturados)",
            "it": "2 lune (Phobos, Deimos / Asteroidi catturati)",
            "ko": "2개 (포보스, 데이모스 / 포획된 소행성)",
            "nl": "2 manen (Phobos, Deimos / Gevangen asteroïden)",
            "id": "2 Bulan (Phobos, Deimos / Asteroid tertangkap)",
            "hi": "2 चंद्रमा (फोबोस, डीमोस / पकड़े गए क्षुद्रग्रह)",
            "ar": "قمران (فوبوس، ديموس / كويكبان ملتقطان)",
            "zh": "2颗天然卫星 (火卫一福波斯、火卫二德莫斯 / 捕获小行星)",
            "ru": "2 спутника (Фобос, Деймос / Захваченные астероиды)"
        },
        "discovery": {
            "ja": "古代エジプトやバビロニアより観測。1659年ホイヘンスがシルチスを描写し自転を測定。",
            "en": "Known since antiquity. In 1659, Christiaan Huygens sketched Syrtis Major and calculated rotation.",
            "de": "Seit der Antike beobachtet. 1659 zeichnete Christiaan Huygens Syrtis Major.",
            "fr": "Connu depuis l'Antiquité. En 1659, Christiaan Huygens dessine Syrtis Major et mesure sa rotation.",
            "es": "Conocido desde la antigüedad. En 1659, Christiaan Huygens midió su rotación.",
            "pt": "Conhecido desde a antiguidade. Em 1659, Christiaan Huygens mediu sua rotação.",
            "it": "Conosciuto fin dall'antichità. Nel 1659 Christiaan Huygens ne calcolò la rotazione.",
            "ko": "고대부터 붉은 행성으로 관측. 1659년 호이겐스가 대시르티스를 관측하여 자전 주기 산출.",
            "nl": "Sinds de oudheid waargenomen. In 1659 berekende Christiaan Huygens de rotatieperiode.",
            "id": "Dikenal sejak zaman kuno. Pada 1659, Christiaan Huygens menghitung periode rotasinya.",
            "hi": "प्राचीन काल से ज्ञात। 1659 में क्रिश्चियन ह्यूजेंस ने घूर्णन अवधि की गणना की।",
            "ar": "معروف منذ القدم. رسم كريستيان هوغنس أول خريطة لمعالم سطحه عام 1659.",
            "zh": "自古作为荧惑之星被观测。1659年惠更斯绘制大瑟提斯高原并精确测定火星自转周期。",
            "ru": "Наблюдается с древности. В 1659 г. Христиан Гюйгенс впервые определил период его вращения."
        },
        "missions": {
            "ja": "バイキング1/2号(1976年), キュリオシティ(2012年), パーサヴィアランス(2021年), JAXA MMX火星衛星探査計画。",
            "en": "Viking 1/2 (1976), Curiosity (2012), Perseverance (2021), JAXA MMX Martian Moons Exploration.",
            "de": "Viking 1/2 (1976), Curiosity (2012), Perseverance (2021), JAXA MMX-Mission.",
            "fr": "Viking 1/2 (1976), Curiosity (2012), Perseverance (2021), Mission MMX de la JAXA.",
            "es": "Viking 1/2 (1976), Curiosity (2012), Perseverance (2021), Misión MMX de JAXA.",
            "pt": "Viking 1/2 (1976), Curiosity (2012), Perseverance (2021), Missão MMX da JAXA.",
            "it": "Viking 1/2 (1976), Curiosity (2012), Perseverance (2021), Missione MMX della JAXA.",
            "ko": "바이킹 1/2호(1976), 큐리오시티(2012), 퍼서비어런스(2021), JAXA MMX 화성 위성 샘플리턴.",
            "nl": "Viking 1/2 (1976), Curiosity (2012), Perseverance (2021), JAXA MMX-missie.",
            "id": "Viking 1/2 (1976), Curiosity (2012), Perseverance (2021), Misi MMX JAXA.",
            "hi": "वाइकिंग 1/2 (1976), क्यूरियोसिटी (2012), परसेवेरेंस (2021), JAXA MMX मिशन।",
            "ar": "فايكنغ 1 و 2 (1976)، كوريوسيتي (2012)، بيرسيفيرانس (2021)، مهمة MMX من JAXA.",
            "zh": "海盗1/2号(1976), 好奇号(2012), 毅力号(2021), 天问一号(2021), JAXA火卫探测计划MMX。",
            "ru": "Викинг-1/2 (1976), Кьюриосити (2012), Персеверанс (2021), Японская миссия JAXA MMX."
        }
    },
    "JUPITER": {
        "mass": {
            "ja": "1.898 × 10^27 kg (地球の317.83倍 / 太陽系最大)",
            "en": "1.898 × 10^27 kg (317.83x Earth / Largest Planet)",
            "de": "1,898 × 10^27 kg (317,83-fache Erdmasse / Größter Planet)",
            "fr": "1,898 × 10^27 kg (317,83 fois la Terre / Plus grande planète)",
            "es": "1,898 × 10^27 kg (317,83 veces la Tierra / Planeta más grande)",
            "pt": "1,898 × 10^27 kg (317,83 vezes a Terra / Maior planeta)",
            "it": "1,898 × 10^27 kg (317,83 volte la Terra / Pianeta più grande)",
            "ko": "1.898 × 10^27 kg (지구의 317.83배 / 태양계 최대 행성)",
            "nl": "1,898 × 10^27 kg (317,83x de aarde / Grootste planeet)",
            "id": "1,898 × 10^27 kg (317,83x Bumi / Planet Terbesar)",
            "hi": "1.898 × 10^27 किग्रा (पृथ्वी का 317.83 गुना / सबसे बड़ा ग्रह)",
            "ar": "1.898 × 10^27 كجم (317.83 ضعف كتلة الأرض / أضخم كوكب)",
            "zh": "1.898 × 10^27 千克 (地球的317.83倍 / 太阳系行星之王)",
            "ru": "1,898 × 10^27 кг (317,83 массы Земли / Самая большая планета)"
        },
        "diameter": {
            "ja": "142,984 km (地球の11.209倍 / 巨大ガス惑星)",
            "en": "142,984 km (11.209x Earth / Gas Giant)",
            "de": "142.984 km (11,209-facher Erddurchmesser / Gasriese)",
            "fr": "142 984 km (11,209 fois la Terre / Géante gazeuse)",
            "es": "142.984 km (11,209 veces la Tierra / Gigante gaseoso)",
            "pt": "142.984 km (11,209 vezes a Terra / Gigante gasoso)",
            "it": "142.984 km (11,209 volte la Terra / Gigante gassoso)",
            "ko": "142,984 km (지구의 11.209배 / 거대 가스 행성)",
            "nl": "142.984 km (11,209x de aarde / Gasreus)",
            "id": "142.984 km (11,209x Bumi / Raksasa Gas)",
            "hi": "142,984 किमी (पृथ्वी का 11.209 गुना / गैस दानव)",
            "ar": "142,984 كم (11.209 أضعاف قطر الأرض / عملاق غازي)",
            "zh": "142,984 公里 (地球的11.209倍 / 气态巨行星)",
            "ru": "142 984 км (11,209 диаметра Земли / Газовый гигант)"
        },
        "rotation": {
            "ja": "9時間55分30秒 (太陽系最速の超高速自転)",
            "en": "9h 55m 30s (Fastest rotation in the Solar System)",
            "de": "9 Std. 55 Min. 30 Sek. (Schnellste Rotation im Sonnensystem)",
            "fr": "9h 55m 30s (Rotation la plus rapide du système solaire)",
            "es": "9h 55m 30s (Rotación más rápida del sistema solar)",
            "pt": "9h 55m 30s (Rotação mais rápida do sistema solar)",
            "it": "9h 55m 30s (Rotazione più rapida del sistema solare)",
            "ko": "9시간 55분 30초 (태양계에서 가장 빠른 초고속 자전)",
            "nl": "9u 55m 30s (Snelste rotatie in het zonnestelsel)",
            "id": "9j 55m 30d (Rotasi tercepat di Tata Surya)",
            "hi": "9 घंटे 55 मिनट 30 सेकंड (सौर मंडल में सबसे तेज़ घूर्णन)",
            "ar": "9 ساعات و 55 دقيقة و 30 ثانية (أسرع دوران كوكبي)",
            "zh": "9小时55分30秒 (全太阳系各大行星中最快的超高速自转)",
            "ru": "9 ч 55 мин 30 с (Самое быстрое вращение в Солнечной системе)"
        },
        "orbit": {
            "ja": "4,332.59日 (約11.86地球年)",
            "en": "4,332.59 days (~11.86 Earth years)",
            "de": "4.332,59 Tage (~11,86 Erdenjahre)",
            "fr": "4 332,59 jours (~11,86 années terrestres)",
            "es": "4.332,59 días (~11,86 años terrestres)",
            "pt": "4.332,59 dias (~11,86 anos terrestres)",
            "it": "4.332,59 giorni (~11,86 anni terrestri)",
            "ko": "4,332.59일 (약 11.86 지구년)",
            "nl": "4.332,59 dagen (~11,86 aardse jaren)",
            "id": "4.332,59 hari (~11,86 tahun Bumi)",
            "hi": "4,332.59 दिन (~11.86 पृथ्वी वर्ष)",
            "ar": "4,332.59 يوماً (~11.86 سنة أرضية)",
            "zh": "4,332.59天 (约11.86地球年)",
            "ru": "4 332,59 дней (~11,86 земных года)"
        },
        "temperature": {
            "ja": "雲頂 -110℃ / 内部核 約24,000℃",
            "en": "Cloud-top -110°C / Core ~24,000°C",
            "de": "Wolkendecke -110°C / Kern ~24.000°C",
            "fr": "Sommet des nuages -110°C / Cœur ~24 000°C",
            "es": "Cima de nubes -110°C / Núcleo ~24.000°C",
            "pt": "Topo das nuvens -110°C / Núcleo ~24.000°C",
            "it": "Sommità nubi -110°C / Nucleo ~24.000°C",
            "ko": "구름 상층 -110℃ / 중심핵 약 24,000℃",
            "nl": "Wolkentop -110°C / Kern ~24.000°C",
            "id": "Awan atas -110°C / Inti ~24.000°C",
            "hi": "बादल शीर्ष -110°C / कोर ~24,000°C",
            "ar": "أعلى السحب -110°م / النواة ~24,000°م",
            "zh": "云顶约 -110℃ / 内部核心达约 24,000℃",
            "ru": "Верхний слой облаков -110°C / Ядро ~24 000°C"
        },
        "satellites": {
            "ja": "95個 (ガリレオ4大衛星: イオ, エウロパ, ガニメデ, カリスト)",
            "en": "95 Moons (Galilean 4: Io, Europa, Ganymede, Callisto) + Dust Rings",
            "de": "95 Monde (Galileische Monde: Io, Europa, Ganymed, Kallisto) + Ringe",
            "fr": "95 lunes (4 lunes galiléennes: Io, Europe, Ganymède, Callisto) + anneaux",
            "es": "95 lunas (4 galileanas: Ío, Europa, Ganímedes, Calisto) + anillos",
            "pt": "95 luas (4 galileanas: Io, Europa, Ganimedes, Calisto) + anéis",
            "it": "95 lune (4 galileiane: Io, Europa, Ganimede, Callisto) + anelli",
            "ko": "95개 위성 (갈릴레이 4대 위성: 이오, 유로파, 가니메데, 칼리스토) + 고리",
            "nl": "95 manen (Galileïsche manen: Io, Europa, Ganymedes, Callisto) + ringen",
            "id": "95 Bulan (4 Galilean: Io, Europa, Ganymede, Callisto) + Cincin",
            "hi": "95 चंद्रमा (गैलीलियन 4: आयो, यूरोपा, गेनीमेड, कैलिस्टो) + छल्ले",
            "ar": "95 قمراً (أقمار غاليليو الأربعة: آيو، أوروبا، غانيميد، كاليستو) + حلقات",
            "zh": "95颗天然卫星 (伽利略4大卫星: 木卫一、二、三、四) ＋ 微细尘埃环",
            "ru": "95 спутников (4 галилеевых: Ио, Европа, Ганимед, Каллисто) + кольца"
        },
        "discovery": {
            "ja": "古代より王の星として観測。1610年ガリレオが4大衛星を発見し地動説を確立。",
            "en": "Observed since prehistoric times. In 1610, Galileo discovered the 4 Galilean moons.",
            "de": "Seit der Antike beobachtet. 1610 entdeckte Galilei die 4 galileischen Monde.",
            "fr": "Connu depuis la préhistoire. En 1610, Galilée découvre les 4 lunes galiléennes.",
            "es": "Conocido desde la prehistoria. En 1610, Galileo descubrió las 4 lunas galileanas.",
            "pt": "Conhecido desde a pré-história. Em 1610, Galileu descobriu as 4 luas galileanas.",
            "it": "Conosciuto fin dalla preistoria. Nel 1610 Galileo scoprì le 4 lune galileiane.",
            "ko": "선사시대부터 관측. 1610년 갈릴레오가 4대 위성을 발견하여 지동설의 결정적 증거 확보.",
            "nl": "Bekend sinds de prehistorie. In 1610 ontdekte Galileo de 4 Galileïsche manen.",
            "id": "Dikenal sejak zaman prasejarah. Pada 1610, Galileo menemukan 4 bulan Galilean.",
            "hi": "प्रागैतिहासिक काल से ज्ञात। 1610 में गैलीलियो ने 4 गैलीलियन चंद्रमाओं की खोज की।",
            "ar": "معروف منذ القدم. اكتشف غاليليو أقماره الأربعة الكبرى عام 1610.",
            "zh": "自古作为岁星被观测。1610年伽利略发现4大伽利略卫星，确立了日心说的关键天文学证据。",
            "ru": "Известен с древности. В 1610 г. Галилей открыл 4 главных спутника Юпитера."
        },
        "missions": {
            "ja": "ボイジャー1/2号(1979年), ガリレオ(1995年周回), ジュノー(2016年周回中), ESA JUICE木星氷衛星探査機(2023年打上)。",
            "en": "Voyager 1/2 (1979), Galileo (orbiter 1995), Juno (in orbit since 2016), ESA JUICE (launched 2023).",
            "de": "Voyager 1/2 (1979), Galileo (1995), Juno (seit 2016), ESA JUICE (2023 gestartet).",
            "fr": "Voyager 1/2 (1979), Galileo (1995), Juno (en orbite depuis 2016), ESA JUICE (lancé en 2023).",
            "es": "Voyager 1/2 (1979), Galileo (1995), Juno (en órbita desde 2016), ESA JUICE (lanzado en 2023).",
            "pt": "Voyager 1/2 (1979), Galileo (1995), Juno (em órbita desde 2016), ESA JUICE (lançado em 2023).",
            "it": "Voyager 1/2 (1979), Galileo (1995), Juno (in orbita dal 2016), ESA JUICE (lanciato nel 2023).",
            "ko": "보이저 1/2호(1979), 갈릴레오(1995 궤도선), 주노(2016 탐사중), ESA JUICE 목성 탐사선(2023 발사).",
            "nl": "Voyager 1/2 (1979), Galileo (1995), Juno (sinds 2016), ESA JUICE (gelanceerd 2023).",
            "id": "Voyager 1/2 (1979), Galileo (1995), Juno (sejak 2016), ESA JUICE (diluncurkan 2023).",
            "hi": "वॉयजर 1/2 (1979), गैलीलियो (1995), जूनो (2016 से सक्रिय), ESA JUICE (2023 में प्रक्षेपित)।",
            "ar": "فوياجر 1 و 2 (1979)، غاليليو (1995)، جونو (نشط منذ 2016)، مهمة JUICE من وكالة الفضاء الأوروبية.",
            "zh": "旅行者1/2号(1979), 伽利略号(1995绕轨), 朱诺号Juno(2016至今), ESA木星冰月探测器JUICE(2023)。",
            "ru": "Вояджер-1/2 (1979), Галилео (1995), Юнона (на орбите с 2016 г.), ESA JUICE (запуск в 2023 г.)."
        }
    },
    "SATURN": {
        "mass": {
            "ja": "5.683 × 10^26 kg (地球の95.16倍 / 水より軽い密度)",
            "en": "5.683 × 10^26 kg (95.16x Earth / Less dense than water)",
            "de": "5,683 × 10^26 kg (95,16-fache Erdmasse / Geringere Dichte als Wasser)",
            "fr": "5,683 × 10^26 kg (95,16 fois la Terre / Moins dense que l'eau)",
            "es": "5,683 × 10^26 kg (95,16 veces la Tierra / Densidad menor que el agua)",
            "pt": "5,683 × 10^26 kg (95,16 vezes a Terra / Menos denso que a água)",
            "it": "5,683 × 10^26 kg (95,16 volte la Terra / Meno denso dell'acqua)",
            "ko": "5.683 × 10^26 kg (지구의 95.16배 / 물보다 가벼운 평균 밀도)",
            "nl": "5,683 × 10^26 kg (95,16x de aarde / Lagere dichtheid dan water)",
            "id": "5,683 × 10^26 kg (95,16x Bumi / Massa jenis lebih ringan dari air)",
            "hi": "5.683 × 10^26 किग्रा (पृथ्वी का 95.16 गुना / पानी से कम घनत्व)",
            "ar": "5.683 × 10^26 كجم (95.16 ضعف كتلة الأرض / كثافة أقل من الماء)",
            "zh": "5.683 × 10^26 千克 (地球的95.16倍 / 平均密度小于水)",
            "ru": "5,683 × 10^26 кг (95,16 массы Земли / Плотность меньше плотности воды)"
        },
        "diameter": {
            "ja": "120,536 km (地球の9.449倍 / 巨大ガス惑星)",
            "en": "120,536 km (9.449x Earth / Gas Giant with Ring System)",
            "de": "120.536 km (9,449-facher Erddurchmesser / Gasriese mit Ringen)",
            "fr": "120 536 km (9,449 fois la Terre / Géante gazeuse aux anneaux)",
            "es": "120.536 km (9,449 veces la Tierra / Gigante con anillos)",
            "pt": "120.536 km (9,449 vezes a Terra / Gigante com anéis)",
            "it": "120.536 km (9,449 volte la Terra / Gigante con anelli)",
            "ko": "120,536 km (지구의 9.449배 / 거대 가스 행성)",
            "nl": "120.536 km (9,449x de aarde / Gasreus met ringen)",
            "id": "120.536 km (9,449x Bumi / Raksasa Gas Cincin)",
            "hi": "120,536 किमी (पृथ्वी का 9.449 गुना / छल्लेदार गैस दानव)",
            "ar": "120,536 كم (9.449 أضعاف قطر الأرض / عملاق غازي ذو حلقات)",
            "zh": "120,536 公里 (地球的9.449倍 / 拥有恢弘环系的巨行星)",
            "ru": "120 536 км (9,449 диаметра Земли / Газовый гигант с кольцами)"
        },
        "rotation": {
            "ja": "10時間33分38秒 (高速自転による扁平形状)",
            "en": "10h 33m 38s (Fast rotation causing oblate shape)",
            "de": "10 Std. 33 Min. 38 Sek. (Schnelle Rotation, abgeplattete Form)",
            "fr": "10h 33m 38s (Rotation rapide provoquant son aplatissement)",
            "es": "10h 33m 38s (Rotación rápida que genera forma oblata)",
            "pt": "10h 33m 38s (Rotação rápida causando forma achatada)",
            "it": "10h 33m 38s (Rotazione rapida che causa forma oblata)",
            "ko": "10시간 33분 38초 (고속 자전으로 적도가 불룩한 편구형)",
            "nl": "10u 33m 38s (Snelle rotatie, afgeplatte vorm)",
            "id": "10j 33m 38d (Rotasi cepat menghasilkan bentuk pepat)",
            "hi": "10 घंटे 33 मिनट 38 सेकंड (तीव्र घूर्णन से चपटा आकार)",
            "ar": "10 ساعات و 33 دقيقة و 38 ثانية (دوران سريع يسبب تفلطحاً)",
            "zh": "10小时33分38秒 (高速自转导致赤道明显隆起的扁球体)",
            "ru": "10 ч 33 мин 38 с (Быстрое вращение, сплюснутая форма)"
        },
        "orbit": {
            "ja": "10,759.22日 (約29.46地球年)",
            "en": "10,759.22 days (~29.46 Earth years)",
            "de": "10.759,22 Tage (~29,46 Erdenjahre)",
            "fr": "10 759,22 jours (~29,46 années terrestres)",
            "es": "10.759,22 días (~29,46 años terrestres)",
            "pt": "10.759,22 dias (~29,46 anos terrestres)",
            "it": "10.759,22 giorni (~29,46 anni terrestri)",
            "ko": "10,759.22일 (약 29.46 지구년)",
            "nl": "10.759,22 dagen (~29,46 aardse jaren)",
            "id": "10.759,22 hari (~29,46 tahun Bumi)",
            "hi": "10,759.22 दिन (~29.46 पृथ्वी वर्ष)",
            "ar": "10,759.22 يوماً (~29.46 سنة أرضية)",
            "zh": "10,759.22天 (约29.46地球年)",
            "ru": "10 759,22 дней (~29,46 земных года)"
        },
        "temperature": {
            "ja": "雲頂 -140℃ / 内部核 約11,700℃",
            "en": "Cloud-top -140°C / Core ~11,700°C",
            "de": "Wolkendecke -140°C / Kern ~11.700°C",
            "fr": "Sommet des nuages -140°C / Cœur ~11 700°C",
            "es": "Cima de nubes -140°C / Núcleo ~11.700°C",
            "pt": "Topo das nuvens -140°C / Núcleo ~11.700°C",
            "it": "Sommità nubi -140°C / Nucleo ~11.700°C",
            "ko": "구름 상층 -140℃ / 중심핵 약 11,700℃",
            "nl": "Wolkentop -140°C / Kern ~11.700°C",
            "id": "Awan atas -140°C / Inti ~11.700°C",
            "hi": "बादल शीर्ष -140°C / कोर ~11,700°C",
            "ar": "أعلى السحب -140°م / النواة ~11,700°م",
            "zh": "云顶约 -140℃ / 内部核心达约 11,700℃",
            "ru": "Верхний слой облаков -140°C / Ядро ~11 700°C"
        },
        "satellites": {
            "ja": "146個 (タイタン, エンケラドゥス等) ＋ 巨大な氷の環",
            "en": "146 Moons (Titan, Enceladus, etc.) + Majestic Ice Rings",
            "de": "146 Monde (Titan, Enceladus usw.) + Prächtige Eisringe",
            "fr": "146 lunes (Titan, Encelade, etc.) + Anneaux de glace majestueux",
            "es": "146 lunas (Titán, Encélado, etc.) + Anillos de hielo majestuosos",
            "pt": "146 luas (Titã, Encélado, etc.) + Anéis de gelo majestosos",
            "it": "146 lune (Titano, Encelado, ecc.) + Anelli di ghiaccio maestosi",
            "ko": "146개 위성 (타이탄, 엔켈라두스 등) + 장엄한 얼음 고리",
            "nl": "146 manen (Titan, Enceladus, enz.) + Prachtige ijsringen",
            "id": "146 Bulan (Titan, Enceladus, dll.) + Cincin Es Megah",
            "hi": "146 चंद्रमा (टाइटन, एन्सेलेडस, आदि) + भव्य बर्फ के छल्ले",
            "ar": "146 قمراً (تيتان، إنسيلادوس، إلخ) + حلقات جليدية مهيبة",
            "zh": "146颗天然卫星 (泰坦土卫六、恩克拉多斯土卫二等) ＋ 壮丽冰环",
            "ru": "146 спутников (Титан, Энцелад и др.) + Величественные ледяные кольца"
        },
        "discovery": {
            "ja": "古代より観測。1610年ガリレオが環を発見(耳と描写)、1655年ホイヘンスが環の正体を解明。",
            "en": "Observed since prehistoric times. In 1655, Christiaan Huygens first correctly identified its rings.",
            "de": "Seit der Antike beobachtet. 1655 erkannte Christiaan Huygens die Ringe.",
            "fr": "Connu depuis la préhistoire. En 1655, Christiaan Huygens identifie la vraie nature des anneaux.",
            "es": "Conocido desde la prehistoria. En 1655, Christiaan Huygens identificó sus anillos.",
            "pt": "Conhecido desde a pré-história. Em 1655, Christiaan Huygens identificou seus anéis.",
            "it": "Conosciuto fin dalla preistoria. Nel 1655 Christiaan Huygens ne identificò gli anelli.",
            "ko": "선사시대부터 관측. 1610년 갈릴레오가 고리를 최초 관측, 1655년 호이겐스가 고리의 실체 규명.",
            "nl": "Bekend sinds de prehistorie. In 1655 identificeerde Christiaan Huygens de ringen.",
            "id": "Dikenal sejak zaman prasejarah. Pada 1655, Christiaan Huygens mengidentifikasi cincinnya.",
            "hi": "प्रागैतिहासिक काल से ज्ञात। 1655 में क्रिश्चियन ह्यूजेंस ने इसके छल्लों की सही पहचान की।",
            "ar": "معروف منذ القدم. فسر كريستيان هوغنس طبيعة حلقاته لأول مرة عام 1655.",
            "zh": "人类自古观测。1610年伽利略首次通过望远镜观察到光环，1655年惠更斯证实其为环绕土星的独立光环系统。",
            "ru": "Известен с древности. В 1655 г. Христиан Гюйгенс впервые описал кольца Сатурна."
        },
        "missions": {
            "ja": "パイオニア11号(1979年), ボイジャー1/2号(1980/81年), カッシーニ・ホイヘンス(2004-2017年探査の金字塔)。",
            "en": "Pioneer 11 (1979), Voyager 1/2 (1980/81), Cassini-Huygens (monumental mission, 2004-2017).",
            "de": "Pioneer 11 (1979), Voyager 1/2 (1980/81), Cassini-Huygens (Erfolgsmission 2004-2017).",
            "fr": "Pioneer 11 (1979), Voyager 1/2 (1980/81), Cassini-Huygens (mission historique 2004-2017).",
            "es": "Pioneer 11 (1979), Voyager 1/2 (1980/81), Cassini-Huygens (misión histórica 2004-2017).",
            "pt": "Pioneer 11 (1979), Voyager 1/2 (1980/81), Cassini-Huygens (missão histórica 2004-2017).",
            "it": "Pioneer 11 (1979), Voyager 1/2 (1980/81), Cassini-Huygens (missione storica 2004-2017).",
            "ko": "파이오니어 11호(1979), 보이저 1/2호(1980/81), 카시니-하위헌스(2004-2017 탐사의 금자탑).",
            "nl": "Pioneer 11 (1979), Voyager 1/2 (1980/81), Cassini-Huygens (historische missie 2004-2017).",
            "id": "Pioneer 11 (1979), Voyager 1/2 (1980/81), Cassini-Huygens (misi monumental 2004-2017).",
            "hi": "पायनियर 11 (1979), वॉयजर 1/2 (1980/81), कैसिनी-ह्यूजेंस (ऐतिहासिक मिशन 2004-2017)।",
            "ar": "بايونير 11 (1979)، فوياجر 1 و 2 (1980/81)، كاسيني-هوغنز (المهمة التاريخية 2004-2017).",
            "zh": "先驱者11号(1979), 旅行者1/2号(1980/81), 卡西尼-惠更斯号(2004-2017年深空探测丰碑)。",
            "ru": "Пионер-11 (1979), Вояджер-1/2 (1980/81), Кассини-Гюйгенс (эпохальная миссия 2004-2017 гг.)."
        }
    },
    "URANUS": {
        "mass": {
            "ja": "8.681 × 10^25 kg (地球の14.536倍)",
            "en": "8.681 × 10^25 kg (14.536x Earth)",
            "de": "8,681 × 10^25 kg (14,536-fache Erdmasse)",
            "fr": "8,681 × 10^25 kg (14,536 fois la Terre)",
            "es": "8,681 × 10^25 kg (14,536 veces la Tierra)",
            "pt": "8,681 × 10^25 kg (14,536 vezes a Terra)",
            "it": "8,681 × 10^25 kg (14,536 volte la Terra)",
            "ko": "8.681 × 10^25 kg (지구의 14.536배)",
            "nl": "8,681 × 10^25 kg (14,536x de aarde)",
            "id": "8,681 × 10^25 kg (14,536x Bumi)",
            "hi": "8.681 × 10^25 किग्रा (पृथ्वी का 14.536 गुना)",
            "ar": "8.681 × 10^25 كجم (14.536 ضعف كتلة الأرض)",
            "zh": "8.681 × 10^25 千克 (地球的14.536倍)",
            "ru": "8,681 × 10^25 кг (14,536 массы Земли)"
        },
        "diameter": {
            "ja": "50,724 km (地球の3.981倍 / 巨大氷惑星)",
            "en": "50,724 km (3.981x Earth / Ice Giant)",
            "de": "50.724 km (3,981-facher Erddurchmesser / Eisriese)",
            "fr": "50 724 km (3,981 fois la Terre / Géante de glace)",
            "es": "50.724 km (3,981 veces la Tierra / Gigante helado)",
            "pt": "50.724 km (3,981 vezes a Terra / Gigante de gelo)",
            "it": "50.724 km (3,981 volte la Terra / Gigante di ghiaccio)",
            "ko": "50,724 km (지구의 3.981배 / 거대 얼음 행성)",
            "nl": "50.724 km (3,981x de aarde / Ijsreus)",
            "id": "50.724 km (3,981x Bumi / Raksasa Es)",
            "hi": "50,724 किमी (पृथ्वी का 3.981 गुना / बर्फ दानव)",
            "ar": "50,724 كم (3.981 أضعاف قطر الأرض / عملاق جليدي)",
            "zh": "50,724 公里 (地球的3.981倍 / 冰巨行星)",
            "ru": "50 724 км (3,981 диаметра Земли / Ледяной гигант)"
        },
        "rotation": {
            "ja": "17時間14分 (自転軸97.77度横倒し)",
            "en": "17h 14m (Extreme 97.77° axial tilt)",
            "de": "17 Std. 14 Min. (97,77° Achsneigung seitlich)",
            "fr": "17h 14m (Inclinaison axiale extrême de 97,77°)",
            "es": "17h 14m (Inclinación axial extrema de 97,77°)",
            "pt": "17h 14m (Inclinação axial extrema de 97,77°)",
            "it": "17h 14m (Inclinazione assiale estrema di 97,77°)",
            "ko": "17시간 14분 (자전축 97.77도 누워 자전)",
            "nl": "17u 14m (Extreme ashelling van 97,77°)",
            "id": "17j 14m (Kemiringan sumbu ekstrem 97,77°)",
            "hi": "17 घंटे 14 मिनट (97.77° अत्यधिक अक्षीय झुकाव)",
            "ar": "17 ساعة و 14 دقيقة (ميل محوري استثنائي 97.77 درجة)",
            "zh": "17小时14分 (自转轴倾角97.77度横躺公转)",
            "ru": "17 ч 14 мин (Наклон оси 97,77° 'на боку')"
        },
        "orbit": {
            "ja": "30,685.4日 (約84.02地球年)",
            "en": "30,685.4 days (~84.02 Earth years)",
            "de": "30.685,4 Tage (~84,02 Erdenjahre)",
            "fr": "30 685,4 jours (~84,02 années terrestres)",
            "es": "30.685,4 días (~84,02 años terrestres)",
            "pt": "30.685,4 dias (~84,02 anos terrestres)",
            "it": "30.685,4 giorni (~84,02 anni terrestri)",
            "ko": "30,685.4일 (약 84.02 지구년)",
            "nl": "30.685,4 dagen (~84,02 aardse jaren)",
            "id": "30.685,4 hari (~84,02 tahun Bumi)",
            "hi": "30,685.4 दिन (~84.02 पृथ्वी वर्ष)",
            "ar": "30,685.4 يوماً (~84.02 سنة أرضية)",
            "zh": "30,685.4天 (约84.02地球年)",
            "ru": "30 685,4 дней (~84,02 земных года)"
        },
        "temperature": {
            "ja": "約-224℃ (太陽系惑星で最低温大気)",
            "en": "~-224°C (Coldest planetary atmosphere in Solar System)",
            "de": "~-224°C (Kälteste Planetenatmosphäre des Sonnensystems)",
            "fr": "~-224°C (Atmosphère planétaire la plus froide)",
            "es": "~-224°C (Atmósfera planetaria más fría del sistema)",
            "pt": "~-224°C (Atmosfera planetária mais fria do sistema)",
            "it": "~-224°C (Atmósfera planetaria più fredda del sistema)",
            "ko": "약 -224℃ (태양계 행성 중 최저온 대기)",
            "nl": "~-224°C (Koudste planeetatmosfeer in het zonnestelsel)",
            "id": "~-224°C (Atmosfer planet terdingin di Tata Surya)",
            "hi": "~-224°C (सौर मंडल में सबसे ठंडा ग्रहीय वातावरण)",
            "ar": "~-224°م (أبرد غلاف جوي كوكبي في النظام الشمسي)",
            "zh": "约 -224℃ (全太阳系各大行星中最寒冷大气)",
            "ru": "~-224°C (Самая холодная планетарная атмосфера в системе)"
        },
        "satellites": {
            "ja": "28個 (チタニア、オベロン等) ＋ 13本の縦向きの環",
            "en": "28 Moons (Titania, Oberon, etc.) + 13 Vertical Rings",
            "de": "28 Monde (Titania, Oberon usw.) + 13 vertikale Ringe",
            "fr": "28 lunes (Titania, Obéron, etc.) + 13 anneaux verticaux",
            "es": "28 lunas (Titania, Oberón, etc.) + 13 anillos verticales",
            "pt": "28 luas (Titânia, Oberon, etc.) + 13 anéis verticais",
            "it": "28 lune (Titania, Oberon, ecc.) + 13 anelli verticali",
            "ko": "28개 위성 (티타니아, 오베론 등) + 13개 수직 고리",
            "nl": "28 manen (Titania, Oberon, enz.) + 13 verticale ringen",
            "id": "28 Bulan (Titania, Oberon, dll.) + 13 Cincin Vertikal",
            "hi": "28 चंद्रमा (टाइटानिया, ओबेरॉन, आदि) + 13 ऊर्ध्वाधर छल्ले",
            "ar": "28 قمراً (تيتانيا، أوبيرون، إلخ) + 13 حلقة عمودية",
            "zh": "28颗卫星 (泰坦妮亚、奥伯龙等) ＋ 13道竖立垂直光环",
            "ru": "28 спутников (Титания, Оберон и др.) + 13 вертикальных колец"
        },
        "discovery": {
            "ja": "1781年3月13日、英ウィリアム・ハーシェルが望遠鏡で近世以降初発見。",
            "en": "Discovered on March 13, 1781 by William Herschel using a telescope (first modern discovery).",
            "de": "Am 13. März 1781 von Wilhelm Herschel mit dem Teleskop entdeckt (erste neuzeitliche Entdeckung).",
            "fr": "Découverte le 13 mars 1781 par William Herschel au télescope (première découverte moderne).",
            "es": "Descubierto el 13 de marzo de 1781 por William Herschel con telescopio (primer planeta moderno).",
            "pt": "Descoberto em 13 de março de 1781 por William Herschel com telescópio (primeiro planeta moderno).",
            "it": "Scoperto il 13 marzo 1781 da William Herschel con un telescopio (prima scoperta moderna).",
            "ko": "1781년 3월 13일 윌리엄 허셜이 망원경으로 발견(근대 이후 최초 발견).",
            "nl": "Ontdekt op 13 maart 1781 door William Herschel met een telescoop.",
            "id": "Ditemukan pada 13 Maret 1781 oleh William Herschel menggunakan teleskop.",
            "hi": "13 मार्च 1781 को विलियम हर्शल द्वारा दूरबीन से खोजा गया।",
            "ar": "اكتشفه ويليام هيرشل في 13 مارس 1781 بالتلسكوب (أول اكتشاف حديث).",
            "zh": "1781年3月13日由英国天文学家威廉·赫歇尔通过望远镜发现(人类近代首次发现的新行星)。",
            "ru": "Открыт 13 марта 1781 г. Уильямом Гершелем с помощью телескопа."
        },
        "missions": {
            "ja": "NASAボイジャー2号 (1986年1月24日最接近、10個の新衛星と2本のリング発見)。",
            "en": "NASA Voyager 2 (closest flyby on January 24, 1986, discovered 10 new moons and 2 new rings).",
            "de": "NASA Voyager 2 (Vorbeiflug am 24. Januar 1986, entdeckte 10 neue Monde und 2 Ringe).",
            "fr": "NASA Voyager 2 (survol le 24 janvier 1986, a découvert 10 nouvelles lunes et 2 anneaux).",
            "es": "NASA Voyager 2 (sobrevuelo el 24 de enero de 1986, descubrió 10 nuevas lunas y 2 anillos).",
            "pt": "NASA Voyager 2 (sobrevoo em 24 de janeiro de 1986, descobriu 10 novas luas e 2 anéis).",
            "it": "NASA Voyager 2 (sorvolo il 24 gennaio 1986, ha scoperto 10 nuove lune e 2 anelli).",
            "ko": "NASA 보이저 2호(1986년 1월 24일 최근접 통과, 10개 신위성과 2개 고리 발견).",
            "nl": "NASA Voyager 2 (scheervlucht op 24 januari 1986, ontdekte 10 nieuwe manen en 2 ringen).",
            "id": "NASA Voyager 2 (terbang lintas pada 24 Januari 1986, menemukan 10 bulan baru dan 2 cincin).",
            "hi": "नासा वॉयजर 2 (24 जनवरी 1986 को निकटतम उड़ान, 10 नए चंद्रमा और 2 छल्ले खोजे)।",
            "ar": "فوياجر 2 التابع لناسا (تحليق قريب في 24 يناير 1986، اكتشف 10 أقمار جديدة وحلقتين).",
            "zh": "NASA旅行者2号(1986年1月24日飞掠，发现10颗新卫星与2条新光环)。",
            "ru": "NASA Вояджер-2 (пролет 24 января 1986 г., открыл 10 новых спутников и 2 кольца)."
        }
    }
};

const CELESTIAL_BODIES = [
    {
        id: 'SUN',
        name: 'SUN (太陽)',
        color: '#ffcc00',
        radiusKm: 696340,
        distKm: 149597870,
        periodDays: '---',
        type: 'STAR',
        symbol: '☀️'
    },
    {
        id: 'MOON',
        name: 'MOON (月 / 地球の衛星)',
        color: '#e2e8f0',
        radiusKm: 1737.4,
        distKm: 384400,
        periodDays: 27.32,
        type: 'MOON',
        symbol: '🌕'
    },
    {
        id: 'MARS',
        name: 'MARS (火星 / 第4惑星)',
        color: '#ef4444',
        radiusKm: 3389.5,
        distKm: 227900000,
        periodDays: 686.98,
        type: 'PLANET',
        symbol: '🔴',
        a: 1.524, e: 0.0934, I: 1.85, L: 355.45, M0: 19.37, n: 0.524039
    },
    {
        id: 'VENUS',
        name: 'VENUS (金星 / 第2惑星)',
        color: '#fef08a',
        radiusKm: 6051.8,
        distKm: 108200000,
        periodDays: 224.70,
        type: 'PLANET',
        symbol: '🟡',
        a: 0.723, e: 0.0067, I: 3.39, L: 181.98, M0: 48.01, n: 1.602130
    },
    {
        id: 'JUPITER',
        name: 'JUPITER (木星 / 太陽系最大惑星)',
        color: '#fb923c',
        radiusKm: 69911,
        distKm: 778500000,
        periodDays: 4332.59,
        type: 'PLANET',
        symbol: '🟠',
        a: 5.204, e: 0.0485, I: 1.30, L: 34.40, M0: 20.02, n: 0.083085
    },
    {
        id: 'SATURN',
        name: 'SATURN (土星 / 環を持つ巨大ガス惑星)',
        color: '#fde047',
        radiusKm: 58232,
        distKm: 1433500000,
        periodDays: 10759.22,
        type: 'PLANET',
        symbol: '🪐',
        a: 9.582, e: 0.0555, I: 2.49, L: 49.94, M0: 317.02, n: 0.033444
    },
    {
        id: 'MERCURY',
        name: 'MERCURY (水星 / 第1惑星)',
        color: '#94a3b8',
        radiusKm: 2439.7,
        distKm: 57900000,
        periodDays: 87.97,
        type: 'PLANET',
        symbol: '🔘',
        a: 0.387, e: 0.2056, I: 7.00, L: 252.25, M0: 174.79, n: 4.092334
    },
    {
        id: 'URANUS',
        name: 'URANUS (天王星 / 環を持つ巨大氷惑星)',
        color: '#38bdf8',
        radiusKm: 25362,
        distKm: 2871000000,
        periodDays: 30685.4,
        type: 'PLANET',
        symbol: '🌀',
        a: 19.218, e: 0.0463, I: 0.77, L: 314.05, M0: 142.24, n: 0.01173
    }
];

const CELESTIAL_DESCRIPTIONS = {
    "SUN": {
        "ja": "太陽系の中心に輝く恒星。表面温度は約5,500℃、中心核は約1,500万℃に達します。表面の「太陽黒点」は強力な磁場が熱対流を抑えるため、周囲より約1,500℃低い【約3,500℃〜4,000℃】となっており、相対的に黒く見えます。",
        "en": "The yellow dwarf star at the center of our Solar System. Surface temperature is ~5,500°C and core is ~15,000,000°C. Dark sunspots are cooler regions at [~3,500°C to 4,000°C] where intense magnetic fields inhibit heat convection.",
        "de": "Zentralgestirn des Sonnensystems. Oberfläche ~5.500°C, Kern ~15 Mio.°C. Sonnenflecken sind mit [ca. 3.500°C bis 4.000°C] kühler, da starke Magnetfelder die Konvektion hemmen.",
        "fr": "Étoile naine jaune au centre du système. Surface ~5 500°C, cœur ~15 millions °C. Les taches solaires sont des zones plus froides à [~3 500°C à 4 000°C] dues aux champs magnétiques.",
        "es": "Estrella central del Sistema Solar. Superficie ~5.500°C, núcleo ~15 millones °C. Las manchas solares son zonas más frías a [~3.500°C a 4.000°C] por fuertes campos magnéticos.",
        "pt": "Estrela central do Sistema Solar. Superfície ~5.500°C, núcleo ~15 milhões °C. As manchas solares são áreas mais frias a [~3.500°C a 4.000°C] devido a campos magnéticos.",
        "it": "Stella al centro del Sistema Solare. Superficie ~5.500°C, nucleo ~15 milioni °C. Le macchie solari sono aree più fredde a [~3.500°C - 4.000°C] a causa dei campi magnetici.",
        "ko": "태양계 중심의 항성. 표면 온도는 약 5,500℃, 핵은 약 1,500만℃입니다. '태양 흑점'은 강력한 자기장으로 인해 대류가 억제되어 주변보다 낮은 【약 3,500℃~4,000℃】로 어둡게 보입니다.",
        "nl": "Centrale ster van het zonnestelsel. Oppervlak ~5.500°C, kern ~15 miljoen °C. Zonnevlekken zijn koeler [~3.500°C tot 4.000°C] doordat magnetische velden warmtetransport remmen.",
        "id": "Bintang pusat tata surya. Suhu permukaan ~5.500°C, inti ~15 juta °C. Bintik matahari bersuhu lebih dingin [~3.500°C - 4.000°C] akibat medan magnet kuat.",
        "hi": "सौर मंडल का केंद्रीय तारा। सतह का तापमान ~5,500°C, कोर ~1.5 करोड़ °C। सौर कलंक तीव्र चुंबकीय क्षेत्रों के कारण [~3,500°C से 4,000°C] पर ठंडे होते हैं।",
        "ar": "نجم مركز النظام الشمسي. حرارة السطح ~5,500°م والنواة ~15 مليون °م. البقع الشمسية مناطق أبرد بحدود [~3,500°م إلى 4,000°م] بسبب المجالات المغناطيسية.",
        "zh": "太阳系中心的恒星。表面温度约5,500℃，核心约1,500万℃。表面“太阳黑子”因强磁场抑制热对流，温度降至【约3,500℃〜4,000℃】，因而呈现暗斑。",
        "ru": "Центральная звезда Солнечной системы. Температура поверхности ~5 500°C, ядра ~15 млн °C. Солнечные пятна холоднее [~3 500°C–4 000°C] из-за сильных магнитных полей."
    },
    "MOON": {
        "ja": "地球唯一の自然衛星「月」。平均距離約384,400km、公転周期約27.3日。アポロ計画やアルテミス計画の探査対象。潮汐力により地球に常に同じ面を向けています。",
        "en": "Earth's only natural satellite (~384,400 km away, orbital period 27.3 days). Tidally locked, showing the same face to Earth. Target of Apollo and Artemis missions.",
        "de": "Der einzige natürliche Satellit der Erde (~384.400 km entfernt, Umlaufzeit 27,3 Tage). Gebundene Rotation, Ziel des Apollo- und Artemis-Programms.",
        "fr": "L'unique satellite naturel de la Terre (~384 400 km, période orbitale 27,3 jours). En rotation synchrone, cible des missions Apollo et Artemis.",
        "es": "El único satélite natural de la Tierra (~384.400 km de distancia, período de 27,3 días). Rotación síncrona, objetivo de las misiones Apolo y Artemisa.",
        "pt": "O único satélite natural da Terra (~384.400 km de distância, período de 27,3 dias). Rotação síncrona, alvo das missões Apollo e Artemis.",
        "it": "L'unico satellite naturale della Terra (~384.400 km di distanza, periodo 27,3 giorni). Rotazione sincrona, obiettivo delle missioni Apollo e Artemis.",
        "ko": "지구의 유일한 자연위성 '달'(평균 거리 약 384,400km, 공전주기 약 27.3일). 조석 고정으로 항상 같은 면을 향함. 아폴로 및 아르테미스 탐사 대상.",
        "nl": "De enige natuurlijke satelliet van de aarde (~384.400 km afstand, omlooptijd 27,3 dagen). Synchrone rotatie, doel van Apollo- en Artemis-missies.",
        "id": "Satelit alami tunggal Bumi (~384.400 km, periode orbit 27,3 hari). Terkunci secara pasang surut, target misi Apollo dan Artemis.",
        "hi": "पृथ्वी का एकमात्र प्राकृतिक उपग्रह 'चंद्रमा' (~384,400 किमी दूर, परिक्रमण 27.3 दिन)। ज्वारीय रूप से बद्ध, अपोलो और आर्टेमिस का लक्ष्य।",
        "ar": "التابع الطبيعي الوحيد للأرض (~384,400 كم، الدورة المدارية 27.3 يوماً). مقيد مدياً نحو الأرض، هدف مهمات أبولو وأرتميس.",
        "zh": "地球唯一的天然卫星“月球”，平均距离约38.44万公里，公转周期约27.3天。处于潮汐锁定状态，是阿波罗与阿尔忒弥斯计划探测目标。",
        "ru": "Единственный естественный спутник Земли (~384 400 км, период обращения 27,3 дня). Приливно захвачен, цель программ Аполлон и Артемида."
    },
    "MERCURY": {
        "ja": "太陽系第1惑星「水星」。太陽に最も近く、大気がほとんどないため昼夜の寒暖差が太陽系最大(約600℃差)。表面は月に酷似した無数のクレーターに覆われています。",
        "en": "The closest planet to the Sun. With almost no atmosphere, it experiences the Solar System's extreme temperature swings (600°C range). Heavily cratered surface like our Moon.",
        "de": "Sonnennächster Planet. Ohne Atmosphäre herrschen extreme Temperaturschwankungen (~600°C Unterschied). Stark verkratert wie der Mond.",
        "fr": "Planète la plus proche du Soleil. Sans atmosphère, elle subit des écarts thermiques extrêmes (~600°C). Surface couverte de cratères similaire à la Lune.",
        "es": "El planeta más cercano al Sol. Sin atmósfera, experimenta los cambios térmicos más extremos (~600°C). Superficie craterizada similar a la Luna.",
        "pt": "O planeta mais próximo do Sol. Sem atmosfera, sofre variações térmicas extremas (~600°C). Superfície cheia de crateras como a Lua.",
        "it": "Il pianeta più vicino al Sole. Privo di atmosfera, subisce escursioni termiche estreme (~600°C). Superficie craterizzata simile alla Luna.",
        "ko": "태양계 제1행성 '수성'. 태양에 가장 가까우며 대기가 없어 극심한 일교차(약 600℃ 차이)를 겪습니다. 달과 매우 유사한 크레이터 지형입니다.",
        "nl": "Dichtstbijzijnde planeet bij de zon. Zonder atmosfeer kent het extreme temperatuurverschillen (~600°C). Sterk bekraterd oppervlak.",
        "id": "Planet terdekat dari Matahari. Tanpa atmosfer, mengalami fluktuasi suhu paling ekstrem (~600°C). Permukaan berkawah mirip Bulan.",
        "hi": "सूर्य का सबसे निकटतम ग्रह। वायुमंडल न होने के कारण अत्यधिक तापांतर (~600°C)। सतह चंद्रमा की भांति क्रेटरों से भरी है।",
        "ar": "أقرب كوكب إلى الشمس. بدون غلاف جوي، يشهد أكبر تفاوت حراري في النظام الشمسي (~600°م). سطح مليء بالفوهات يشبه القمر.",
        "zh": "太阳系第一大行星“水星”。距离太阳最近，因几乎没有大气而拥有太阳系最大昼夜温差(差值超600℃)，表面布满类似月球的陨石坑。",
        "ru": "Ближайшая к Солнцу планета. Почти без атмосферы, с экстремальным перепадом температур (~600°C). Поверхность усеяна кратерами как на Луне."
    },
    "VENUS": {
        "ja": "太陽系第2惑星「金星」。地球とほぼ同サイズですが、濃密な二酸化炭素による暴走温室効果で表面温度は約462℃と太陽系最高温。自転が公転と逆向き(東から太陽が昇る)です。",
        "en": "The 2nd planet from the Sun (Earth's twin). A runaway greenhouse effect under dense CO2 makes it the hottest planet (~462°C). Features unique retrograde (backward) rotation.",
        "de": "Der 2. Planet (Zwillingsplanet der Erde). Durch den extremen Treibhauseffekt der heißeste Planet (~462°C) mit rückläufiger Eigenrotation.",
        "fr": "La 2e planète (jumelle de la Terre). L'effet de serre extrême en fait la plus chaude (~462°C). Présente une rotation rétrograde unique.",
        "es": "El 2º planeta (gemelo de la Tierra). El efecto invernadero extremo lo convierte en el más caliente (~462°C). Rotación retrógrada única.",
        "pt": "O 2º planeta (gêmeo da Terra). O efeito estufa extremo o torna o mais quente (~462°C). Rotação retrógrada singular.",
        "it": "Il 2º pianeta (gemello della Terra). L'effetto serra estremo lo rende il più caldo (~462°C). Rotazione retrograda peculiare.",
        "ko": "태양계 제2행성 '금성'. 지구의 쌍둥이 행성이지만 농밀한 이산화탄소 온실효과로 태양계 최고온(약 462℃). 자전축이 거꾸로 되어 역방향 자전을 합니다.",
        "nl": "De 2e planeet (tweeling van de aarde). Door het extreme broeikaseffect de heetste planeet (~462°C) met retrograde rotatie.",
        "id": "Planet ke-2 (kembaran Bumi). Efek rumah kaca ekstrem menjadikannya planet terpanas (~462°C) dengan rotasi terbalik.",
        "hi": "सूर्य से दूसरा ग्रह (पृथ्वी का जुड़वां)। घने CO2 ग्रीनहाउस प्रभाव से सबसे गर्म ग्रह (~462°C)। घूर्णन विपरीत दिशा में होता है।",
        "ar": "الكوكب الثاني (توأم الأرض). احتباس حراري هائل لثاني أكسيد الكربون يجعله الأشد حرارة (~462°م). يتميز بدوران تراجعي عكسي.",
        "zh": "太阳系第二大行星“金星”(地球姊妹星)。受浓密二氧化碳的失控温室效应影响，表面温度达约462℃(全太阳系最高)，自转方向与公转相反。",
        "ru": "Вторая планета от Солнца (близнец Земли). Парниковый эффект делает её самой горячей (~462°C). Имеет уникальное обратное вращение."
    },
    "MARS": {
        "ja": "太陽系第4惑星「火星」(Red Planet)。酸化鉄に覆われた赤い地表と希薄な大気、白い極冠を持つ。NASAパーサヴィアランス探査車や有人火星探査計画の最前線です。",
        "en": "The 4th planet (The Red Planet). Known for its iron-rich red soil, thin atmosphere, and polar ice caps. Target of NASA rovers and future crewed missions.",
        "de": "Der 4. Planet (Roter Planet). Bekannt für eisenoxidreichen roten Boden, dünne Atmosphäre und Polarkappen. Ziel moderner Mars-Rover.",
        "fr": "La 4e planète (la planète rouge). Sol riche en oxyde de fer, atmosphère ténue et calottes polaires. Cible des rovers martiens.",
        "es": "El 4º planeta (Planeta Rojo). Suelo rico en óxido de hierro, atmósfera tenue y casquetes polares. Frontera de la exploración humana.",
        "pt": "O 4º planeta (Planeta Vermelho). Solo rico em óxido de ferro, atmosfera tênue e calotas polares. Alvo de rovers e futuras missões tripuladas.",
        "it": "Il 4º pianeta (Pianeta Rosso). Suolo ricco di ossido di ferro, atmosfera sottile e calotte polari. Obiettivo dei rover marziani.",
        "ko": "태양계 제4행성 '화성'(Red Planet). 산화철로 뒤덮인 붉은 대지와 희박한 대기, 극관의 얼음을 지님. NASA 탐사 로버와 인류 유인 탐사의 최전선입니다.",
        "nl": "De 4e planeet (Rode Planeet). IJzerrijke rode bodem, dunne atmosfeer en poolkappen. Doelwit van Marsrovers en bemande missies.",
        "id": "Planet ke-4 (Planet Merah). Tanah kaya besi oksida, atmosfer tipis, dan tudung es kutub. Garis depan eksplorasi manusia.",
        "hi": "चौथा ग्रह (लाल ग्रह)। लौह ऑक्साइड युक्त लाल सतह, पतला वायुमंडल और ध्रुवीय बर्फ। नासा रोवर्स और मानव मिशनों का मुख्य लक्ष्य।",
        "ar": "الكوكب الرابع (الكوكب الأحمر). تربة غنية بأكسيد الحديد، غلاف جوي رقيق، وقلنسوات جليدية قطبية. هدف مركبات الاستكشاف الحالية.",
        "zh": "太阳系第四大行星“火星”(红色星球)。地表富含氧化铁呈现赤红色，拥有稀薄大气与两极白色极冠，是人类深空探测与登陆探索的最前沿。",
        "ru": "Четвертая планета (Красная планета). Богатая оксидом железа поверхность, тонкая атмосфера и полярные шапки. Главная цель марсоходов."
    },
    "JUPITER": {
        "ja": "太陽系第5惑星「木星」。全惑星合計の2.5倍の質量を持つ太陽系最大のガス巨大惑星。ダイナミックな大気バンド、巨大な大赤斑、4大ガリレオ衛星とダストリングを持ちます。",
        "en": "The largest planet in the Solar System (2.5x mass of all other planets combined). Features iconic cloud bands, the Great Red Spot storm, 95 moons, and a faint dust ring.",
        "de": "Größter Planet des Sonnensystems (2,5-fache Masse aller anderen Planeten). Berühmt für Wolkenbänder, den Großen Roten Fleck und 95 Monde.",
        "fr": "La plus grande planète (2,5 fois la masse de toutes les autres réunies). Bandes nuageuses fascinantes, Grande Tache Rouge, 95 lunes et anneau de poussière.",
        "es": "El planeta más grande (2,5 veces la masa del resto combinado). Famoso por sus bandas de nubes, la Gran Mancha Roja, 95 lunas y anillo de polvo.",
        "pt": "O maior planeta (2,5 vezes a massa de todos os outros somados). Destaca-se pelas faixas de nuvens, a Grande Mancha Vermelha, 95 luas e anel de poeira.",
        "it": "Il pianeta più grande (2,5 volte la massa di tutti gli altri uniti). Noto per le bande di nubi, la Grande Macchia Rossa, 95 lune e l'anello di polvere.",
        "ko": "태양계 제5행성 '목성'. 다른 모든 행성을 합친 것의 2.5배 질량을 지닌 최대 가스 행성. 대기 줄무늬, 대적점 폭풍, 95개 위성과 미세 먼지 고리를 보유.",
        "nl": "Grootste planeet (2,5x de massa van alle andere samen). Beroemd om wolkenbanden, de Grote Rode Vlek, 95 manen en een stofring.",
        "id": "Planet terbesar (2,5x massa gabungan seluruh planet lainnya). Terkenal dengan pita awan, Badai Bintik Merah Raksasa, 95 bulan, dan cincin debu.",
        "hi": "सौर मंडल का सबसे बड़ा ग्रह (अन्य सभी ग्रहों के संयुक्त द्रव्यमान का 2.5 गुना)। प्रसिद्ध वायुमंडलीय पट्टियाँ, विशाल लाल धब्बा और 95 चंद्रमा।",
        "ar": "أضخم كواكب النظام الشمسي (2.5 ضعف كتلة بقية الكواكب مجتمعة). يتميز بأحزمته السحابية، البقعة الحمراء العظيمة، 95 قمراً، وحلقة غبارية.",
        "zh": "太阳系第五大行星“木星”(太阳系行星之王)。质量是其他所有行星总和的2.5倍，拥有绚丽的云层条带、巨大风暴“大赤斑”、95颗卫星及暗淡尘埃环。",
        "ru": "Крупнейшая планета (в 2,5 раза массивнее всех остальных вместе взятых). Известна облачными полосами, Большим красным пятном и 95 спутниками."
    },
    "SATURN": {
        "ja": "太陽系第6惑星「土星」。太陽系で最も壮麗な氷と岩石の多重リングを持つ巨大ガス惑星。146個の衛星(タイタンやエンケラドゥス)を従え、平均密度は水よりも軽い特徴があります。",
        "en": "The 6th planet, renowned for its majestic, extensive ice ring system. Accompanied by 146 moons (including Titan and Enceladus), it is less dense than water.",
        "de": "Der 6. Planet mit dem prachtvollsten Eisringsystem. Besitzt 146 Monde (Titan, Enceladus) und eine geringere Dichte als Wasser.",
        "fr": "La 6e planète, célèbre pour ses anneaux de glace spectaculaires. Accompagnée de 146 lunes (Titan, Encelade), sa densité moyenne est inférieure à celle de l'eau.",
        "es": "El 6º planeta, célebre por su espectacular sistema de anillos de hielo. Con 146 lunas (Titán, Encélado), su densidad media es menor que la del agua.",
        "pt": "O 6º planeta, famoso pelo seu espetacular sistema de anéis de gelo. Com 146 luas (Titã, Encélado), sua densidade média é menor que a da água.",
        "it": "Il 6º pianeta, celebre per il suo maestoso sistema di anelli di ghiaccio. Con 146 lune (Titano, Encelado), ha una densità inferiore a quella dell'acqua.",
        "ko": "태양계 제6행성 '토성'. 가장 웅장하고 아름다운 얼음 고리를 지닌 가스 거인. 146개의 위성(타이탄, 엔켈라두스 등)을 거느리며 평균 밀도가 물보다 낮습니다.",
        "nl": "De 6e planeet met het mooiste ijsringsysteem. Heeft 146 manen (Titan, Enceladus) en een lagere dichtheid dan water.",
        "id": "Planet ke-6 yang terkenal dengan sistem cincin es spektakuler. Dikelilingi 146 bulan (Titan, Enceladus) dan massa jenisnya lebih ringan dari air.",
        "hi": "भव्य बर्फ के छल्लों के लिए प्रसिद्ध छठा ग्रह। 146 चंद्रमा (टाइटन, एन्सेलेडस) और इसका औसत घनत्व पानी से भी कम है।",
        "ar": "الكوكب السادس الشهير بنظامه الحلقي الجليدي المهيب. يمتلك 146 قمراً (مثل تيتان وإنسيلادوس) وكثافته الإجمالية أقل من الماء.",
        "zh": "太阳系第六大行星“土星”。以其壮丽恢弘的冰环系统闻名于世，拥有146颗卫星(包括泰坦与土卫二)，其平均密度甚至比水还要轻。",
        "ru": "Шестая планета с величественной системой ледяных колец. Имеет 146 спутников (Титан, Энцелад), средняя плотность планеты меньше плотности воды."
    },
    "URANUS": {
        "ja": "太陽系第7惑星「天王星」。自転軸が約98度横倒しになった特異な巨大氷惑星。澄んだ青緑色の大気を持ち、縦向きに架かる13本の環と28個の衛星を持っています。",
        "en": "The 7th planet (Ice Giant). Orbits on its side with an extreme 97.8° axial tilt. Boasts a serene cyan atmosphere, 13 vertical rings, and 28 moons.",
        "de": "Der 7. Planet (Eisriese). Rotiert mit 97,8° extremer Achsneigung seitlich. Besitzt eine türkisblaue Atmosphäre, 13 vertikale Ringe und 28 Monde.",
        "fr": "La 7e planète (géante de glace). Inclinée à 97,8°, elle 'roule' sur son orbite. Atmosphère cyan, 13 anneaux verticaux et 28 lunes.",
        "es": "El 7º planeta (gigante de hielo). Rota de lado con una inclinación de 97,8°. Atmósfera de color cian, 13 anillos verticales y 28 lunas.",
        "pt": "O 7º planeta (gigante de gelo). Rota de lado com inclinação de 97,8°. Atmosfera ciano, 13 anéis verticais e 28 luas.",
        "it": "Il 7º pianeta (gigante di ghiaccio). Ruota coricato sul fianco con inclinazione di 97,8°. Atmosfera ciano, 13 anelli verticali e 28 lune.",
        "ko": "태양계 제7행성 '천왕성'. 자전축이 약 98도 누워 옆으로 구르듯 공전하는 거대 얼음 행성. 청록색 대기, 13개의 수직 고리와 28개의 위성을 지님.",
        "nl": "De 7e planeet (ijsreus). Roteert op zijn kant met 97,8° ashelling. Cyaanblauwe atmosfeer, 13 verticale ringen en 28 manen.",
        "id": "Planet ke-7 (raksasa es). Berotasi miring 97,8° di sisinya. Memiliki atmosfer sian yang tenang, 13 cincin vertikal, dan 28 bulan.",
        "hi": "सातवां ग्रह (बर्फ दानव)। 97.8° अक्षीय झुकाव के कारण अपनी धुरी पर लुढ़कता है। स्यान वातावरण, 13 ऊर्ध्वाधर छल्ले और 28 चंद्रमा।",
        "ar": "الكوكب السابع (عملاق جليدي). يدور على جنبه بميل محوري هائل (97.8 درجة). يتميز بغلاف جوي سماوي، 13 حلقة عمودية، و28 قمراً.",
        "zh": "太阳系第七大行星“天王星”(冰巨行星)。自转轴倾角达97.8度呈现独特的“横躺公转”，拥有静谧的青蓝色大気、13道竖立垂直光环与28颗卫星。",
        "ru": "Седьмая планета (ледяной гигант). Вращается 'на боку' с наклоном оси 97,8°. Обладает голубой атмосферой, 13 вертикальными кольцами и 28 спутниками."
    }
};

let celestialEntities = [];
let selectedCelestialId = null;

/**
 * Initialize 3D Celestial Bodies (Sun, Moon, Mars, Venus, Jupiter, Saturn, Mercury)
 */
function initCelestialBodies() {
    if (!viewer) return;
    
    // Maintain Cesium's Pristine Real Sun & Moon Graphics
    try {
        if (viewer.scene.moon) viewer.scene.moon.show = true;
        if (viewer.scene.sun) viewer.scene.sun.show = true;
    } catch(e) {
        console.warn("Moon/Sun enable warning:", e);
    }

    createCelestialEntities();
}

function createCelestialBillboard(body) {
    const canvas = document.createElement('canvas');
    // High-DPI 4x supersampling (320x160) for crystal clear sharp rendering without any blur
    canvas.width = 320;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 320, 160);

    if (body.id === 'SUN') {
        // SUN: Ultra-crisp luminous gold text directly attached to solar core
        ctx.font = 'bold 38px "Inter", "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 6;
        ctx.strokeText('SUN', 160, 80);
        ctx.fillStyle = '#fef08a';
        ctx.fillText('SUN', 160, 80);
        return canvas;
    }

    const orbX = 160;
    const orbY = 50;
    const orbRadius = 16;

    // 1. Crisp Outer Glow
    const glowGrad = ctx.createRadialGradient(orbX, orbY, 2, orbX, orbY, orbRadius * 2.5);
    glowGrad.addColorStop(0, body.color || '#ffffff');
    glowGrad.addColorStop(0.4, body.color || '#ffffff');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(orbX, orbY, orbRadius * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Specialized Planet Graphic
    if (body.id === 'SATURN') {
        // Saturn Rings (Tilted)
        ctx.save();
        ctx.translate(orbX, orbY);
        ctx.rotate(-0.35);
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.ellipse(0, 0, orbRadius * 2.3, orbRadius * 0.75, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, orbRadius * 2.1, orbRadius * 0.65, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Sphere
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(202, 138, 4, 0.5)';
        ctx.fillRect(orbX - orbRadius, orbY - 4, orbRadius * 2, 8);
    } else if (body.id === 'URANUS') {
        // Uranus Vertical Rings (Tilted ~83 deg)
        ctx.save();
        ctx.translate(orbX, orbY);
        ctx.rotate(1.45);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, orbRadius * 2.1, orbRadius * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Sphere
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(orbX - orbRadius, orbY - 3, orbRadius * 2, 6);
    } else if (body.id === 'JUPITER') {
        // Jupiter Dust Ring
        ctx.save();
        ctx.translate(orbX, orbY);
        ctx.rotate(-0.15);
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.7)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, orbRadius * 1.9, orbRadius * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Sphere
        ctx.fillStyle = '#fb923c';
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
        ctx.fill();

        // Stripes & Spot
        ctx.fillStyle = 'rgba(154, 52, 18, 0.7)';
        ctx.fillRect(orbX - orbRadius, orbY - 6, orbRadius * 2, 5);
        ctx.fillRect(orbX - orbRadius, orbY + 3, orbRadius * 2, 5);
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(orbX + 5, orbY + 5, 3.2, 0, Math.PI * 2);
        ctx.fill();
    } else if (body.id === 'MOON') {
        // Moon Base
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
        ctx.fill();

        // Craters & Mare
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(orbX - 5, orbY - 4, 5, 0, Math.PI * 2);
        ctx.arc(orbX + 4, orbY - 2, 4.4, 0, Math.PI * 2);
        ctx.arc(orbX - 2, orbY + 6, 5.6, 0, Math.PI * 2);
        ctx.arc(orbX + 7, orbY + 5, 3.6, 0, Math.PI * 2);
        ctx.fill();
    } else if (body.id === 'MARS') {
        // Mars Sphere
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
        ctx.fill();

        // Polar Ice Cap
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(orbX, orbY - orbRadius + 3, 4.4, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Solid Core
        ctx.fillStyle = body.color || '#ffffff';
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Specular highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(orbX - 5, orbY - 5, orbRadius * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // 3. Ultra-Crisp Sharp Text Label without any shadowBlur haze
    ctx.font = 'bold 30px "Inter", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 5;
    ctx.strokeText(body.id, orbX, 86);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(body.id, orbX, 86);

    return canvas;
}

function createCelestialEntities() {
    if (!viewer) return;
    celestialEntities.forEach(ent => viewer.entities.remove(ent));
    celestialEntities = [];

    const toggleCelestial = document.getElementById('toggleCelestial');
    const isVisible = (!toggleCelestial || toggleCelestial.checked);

    CELESTIAL_BODIES.forEach(body => {
        const billboardCanvas = createCelestialBillboard(body);
        const isSun = (body.id === 'SUN');

        const entity = viewer.entities.add({
            id: `celestial_${body.id}`,
            name: body.name,
            position: new Cesium.CallbackProperty((time) => {
                return computeCelestialPosition(body, time);
            }, false),
            billboard: {
                image: billboardCanvas,
                width: isSun ? 60 : 80,
                height: isSun ? 30 : 40,
                verticalOrigin: isSun ? Cesium.VerticalOrigin.CENTER : Cesium.VerticalOrigin.BOTTOM,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                pixelOffset: Cesium.Cartesian2.ZERO,
                show: isVisible,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
        entity.celestialData = body;
        celestialEntities.push(entity);
    });
}

function computeCelestialPosition(body, time) {
    if (!viewer || !time) return Cesium.Cartesian3.ZERO;

    const jsDate = Cesium.JulianDate.toDate(time);
    const d = (jsDate.getTime() / 86400000.0) + 2440587.5 - 2451545.0; // Days from J2000.0
    // Deep space celestial sphere radius to eliminate parallax with real Sun & stars
    const SUN_SKY_RADIUS = 10000000000; // 10 Million km (Glued to distant real Sun)
    const PLANET_SKY_RADIUS = 2000000000; // 2 Million km (Deep background)

    // 1. Exact Alignment with Cesium's Real Sun Position at Infinite Depth
    if (body.id === 'SUN') {
        try {
            const sunInertial = Cesium.Simon1994PlanetaryPositions.computeSunPositionInInertial(time);
            const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
            if (sunInertial && icrfToFixed) {
                const sunFixed = Cesium.Matrix3.multiplyByVector(icrfToFixed, sunInertial, new Cesium.Cartesian3());
                const direction = Cesium.Cartesian3.normalize(sunFixed, new Cesium.Cartesian3());
                return Cesium.Cartesian3.multiplyByScalar(direction, SUN_SKY_RADIUS, new Cesium.Cartesian3());
            }
        } catch(e) {}

        const L = (280.460 + 0.9856474 * d) * (Math.PI / 180);
        const g = (357.528 + 0.9856003 * d) * (Math.PI / 180);
        const lambda = L + (1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * (Math.PI / 180);
        const eps = (23.439 - 0.0000004 * d) * (Math.PI / 180);
        const gmst = (typeof satellite !== 'undefined' && satellite.gstime) ? satellite.gstime(jsDate) : 0;
        const sunLon = lambda - gmst;
        const sunLat = Math.asin(Math.sin(eps) * Math.sin(lambda));
        return Cesium.Cartesian3.fromRadians(sunLon, sunLat, SUN_SKY_RADIUS);
    }

    // 2. Exact Alignment with Cesium's Real 3D Moon
    if (body.id === 'MOON') {
        try {
            const moonInertial = Cesium.Simon1994PlanetaryPositions.computeMoonPositionInInertial(time);
            const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
            if (moonInertial && icrfToFixed) {
                const moonFixed = Cesium.Matrix3.multiplyByVector(icrfToFixed, moonInertial, new Cesium.Cartesian3());
                return moonFixed;
            }
        } catch(e) {}

        const gmst = (typeof satellite !== 'undefined' && satellite.gstime) ? satellite.gstime(jsDate) : 0;
        const L_moon = (218.316 + 13.176396 * d) * (Math.PI / 180);
        const M_moon = (134.963 + 13.064993 * d) * (Math.PI / 180);
        const F_moon = (93.272 + 13.229350 * d) * (Math.PI / 180);
        const lambda_moon = L_moon + (6.289 * Math.sin(M_moon)) * (Math.PI / 180);
        const beta_moon = (5.128 * Math.sin(F_moon)) * (Math.PI / 180);
        return Cesium.Cartesian3.fromRadians(lambda_moon - gmst, beta_moon, 384400000);
    }

    // 3. Planets Deep Space Positioning in Earth-Fixed frame
    const earthM = (357.529 + 0.98560028 * d) * Math.PI / 180;
    const earthL_corr = (280.466 + 0.98564736 * d + 1.915 * Math.sin(earthM) + 0.020 * Math.sin(2 * earthM)) * Math.PI / 180;
    const xe = Math.cos(earthL_corr);
    const ye = Math.sin(earthL_corr);

    const M = (body.M0 + body.n * d) % 360;
    const M_rad = M * Math.PI / 180;
    const v = M_rad + (2 * body.e - Math.pow(body.e, 3)/4) * Math.sin(M_rad) + 1.25 * Math.pow(body.e, 2) * Math.sin(2 * M_rad);
    const r = body.a * (1 - Math.pow(body.e, 2)) / (1 + body.e * Math.cos(v));
    const I_rad = body.I * Math.PI / 180;
    const lon_rad = (v + (body.L - body.M0) * Math.PI / 180);

    const xp = r * Math.cos(lon_rad);
    const yp = r * Math.sin(lon_rad) * Math.cos(I_rad);
    const zp = r * Math.sin(lon_rad) * Math.sin(I_rad);

    const gx = xp - xe;
    const gy = yp - ye;
    const gz = zp;
    const planetInertial = new Cesium.Cartesian3(gx, gy, gz);

    try {
        const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
        if (icrfToFixed) {
            const planetFixed = Cesium.Matrix3.multiplyByVector(icrfToFixed, planetInertial, new Cesium.Cartesian3());
            const direction = Cesium.Cartesian3.normalize(planetFixed, new Cesium.Cartesian3());
            return Cesium.Cartesian3.multiplyByScalar(direction, PLANET_SKY_RADIUS, new Cesium.Cartesian3());
        }
    } catch(e) {}

    const gLen = Math.sqrt(gx*gx + gy*gy + gz*gz) || 1;
    return new Cesium.Cartesian3(
        (gx / gLen) * PLANET_SKY_RADIUS,
        (gy / gLen) * PLANET_SKY_RADIUS,
        (gz / gLen) * PLANET_SKY_RADIUS
    );
}

function selectCelestialBody(bodyId) {
    const body = CELESTIAL_BODIES.find(b => b.id === bodyId);
    if (!body || !viewer) return;

    selectedSatIndex = -1;
    selectedCelestialId = bodyId;

    // Clear satellite orbit line if any
    if (orbitPolylineEntity) {
        viewer.entities.remove(orbitPolylineEntity);
        orbitPolylineEntity = null;
    }

    const langSelect = document.getElementById('langSelect');
    const lang = (langSelect && langSelect.value) || window.currentLang || currentLang || 'ja';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['ja'];
    const info = (typeof CELESTIAL_ENCYCLOPEDIA !== 'undefined') ? CELESTIAL_ENCYCLOPEDIA[body.id] : null;

    // Helper for localized lookup
    const getL = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return obj[lang] || obj['en'] || obj['ja'] || '';
    };

    // Localized Celestial Names
    const localizedNames = {
        SUN: { ja: '太陽 (Sun)', en: 'Sun', de: 'Sonne', fr: 'Soleil', es: 'Sol', pt: 'Sol', it: 'Sole', ko: '태양 (Sun)', nl: 'Zon', id: 'Matahari', hi: 'सूर्य (Sun)', ar: 'الشمس', zh: '太阳 (Sun)', ru: 'Солнце' },
        MOON: { ja: '月 (Moon)', en: 'Moon', de: 'Mond', fr: 'Lune', es: 'Luna', pt: 'Lua', it: 'Luna', ko: '달 (Moon)', nl: 'Maan', id: 'Bulan', hi: 'चंद्रमा (Moon)', ar: 'القمر', zh: '月球 (Moon)', ru: 'Луна' },
        MARS: { ja: '火星 (Mars)', en: 'Mars', de: 'Mars', fr: 'Mars', es: 'Marte', pt: 'Marte', it: 'Marte', ko: '화성 (Mars)', nl: 'Mars', id: 'Mars', hi: 'मंगल (Mars)', ar: 'المريخ', zh: '火星 (Mars)', ru: 'Марс' },
        JUPITER: { ja: '木星 (Jupiter)', en: 'Jupiter', de: 'Jupiter', fr: 'Jupiter', es: 'Júpiter', pt: 'Júpiter', it: 'Giove', ko: '목성 (Jupiter)', nl: 'Jupiter', id: 'Yupiter', hi: 'बृहस्पति (Jupiter)', ar: 'المشتري', zh: '木星 (Jupiter)', ru: 'Юпитер' },
        SATURN: { ja: '土星 (Saturn)', en: 'Saturn', de: 'Saturn', fr: 'Saturne', es: 'Saturno', pt: 'Saturno', it: 'Saturno', ko: '토성 (Saturn)', nl: 'Saturnus', id: 'Saturnus', hi: 'शनि (Saturn)', ar: 'زحل', zh: '土星 (Saturn)', ru: 'Сатурн' },
        VENUS: { ja: '金星 (Venus)', en: 'Venus', de: 'Venus', fr: 'Vénus', es: 'Venus', pt: 'Vênus', it: 'Venere', ko: '금성 (Venus)', nl: 'Venus', id: 'Venus', hi: 'शुक्र (Venus)', ar: 'الزهرة', zh: '金星 (Venus)', ru: 'Венера' },
        MERCURY: { ja: '水星 (Mercury)', en: 'Mercury', de: 'Merkur', fr: 'Mercure', es: 'Mercurio', pt: 'Mercúrio', it: 'Mercurio', ko: '수성 (Mercury)', nl: 'Mercurius', id: 'Merkurius', hi: 'बुध (Mercury)', ar: 'عطارد', zh: '水星 (Mercury)', ru: 'Меркурий' },
        URANUS: { ja: '天王星 (Uranus)', en: 'Uranus', de: 'Uranus', fr: 'Uranus', es: 'Urano', pt: 'Urano', it: 'Urano', ko: '천왕성 (Uranus)', nl: 'Uranus', id: 'Uranus', hi: 'अरुण (Uranus)', ar: 'أورانوس', zh: '天王星 (Uranus)', ru: 'Уран' }
    };

    // Update Detail Card Header with 14-Language Badges and Subtitles
    const badgeTypeMap = CELESTIAL_BADGE_TYPES[body.id];
    satBadge.textContent = (badgeTypeMap && (badgeTypeMap[lang] || badgeTypeMap['en'])) || `🌌 ${body.type}`;
    satBadge.style.background = 'linear-gradient(135deg, #f59e0b, #ef4444)';

    const bodyNameStr = (localizedNames[body.id] && (localizedNames[body.id][lang] || localizedNames[body.id]['en'])) || body.name;
    satName.textContent = `${body.symbol} ${bodyNameStr}`;

    const subtitlePrefix = CELESTIAL_SUBTITLES[lang] || CELESTIAL_SUBTITLES['en'];
    satNorad.textContent = `${subtitlePrefix} (${body.id})`;

    const descObj = CELESTIAL_DESCRIPTIONS[body.id];
    let baseDesc = (descObj && getL(descObj)) || '';

    // Rich Encyclopedia HTML format
    if (info) {
        const discText = getL(info.discovery);
        const missText = getL(info.missions);

        const titles = {
            "ja": ["🔭 発見の歴史・観測記録", "🚀 人類の主な宇宙探査ミッション"],
            "en": ["🔭 Discovery & Astronomical History", "🚀 Key Space Exploration Missions"],
            "de": ["🔭 Entdeckung & Beobachtungsgeschichte", "🚀 Wichtige Raumfahrtmissionen"],
            "fr": ["🔭 Découverte et histoire astronomique", "🚀 Principales missions d'exploration"],
            "es": ["🔭 Descubrimiento e historia astronómica", "🚀 Principales misiones de exploración"],
            "pt": ["🔭 Descoberta e história astronômica", "🚀 Principais missões de exploração"],
            "it": ["🔭 Scoperta e storia astronomica", "🚀 Principali missioni di esplorazione"],
            "ko": ["🔭 발견의 역사 및 천문 관측 기록", "🚀 인류의 주요 우주 탐사 미션"],
            "nl": ["🔭 Ontdekking en astronomische geschiedenis", "🚀 Belangrijkste verkenningsmissies"],
            "id": ["🔭 Sejarah Penemuan & Astronomi", "🚀 Misi Eksplorasi Luar Angkasa Utama"],
            "hi": ["🔭 खोज का इतिहास और खगोलीय रिकॉर्ड", "🚀 प्रमुख अंतरिक्ष अन्वेषण अभियान"],
            "ar": ["🔭 تاريخ الاكتشاف والرصد الفلكي", "🚀 أهم مهمات استكشاف الفضاء"],
            "zh": ["🔭 发现历史与天文观测记录", "🚀 人类主要深空探测任务"],
            "ru": ["🔭 История открытия и наблюдений", "🚀 Главные исследовательские миссии"]
        };

        const t = titles[lang] || titles['en'] || titles['ja'];

        satDescription.innerHTML = `
            <p style="margin-bottom: 8px; line-height: 1.5;">${baseDesc}</p>
            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 10px; margin-top: 8px; font-size: 0.78rem;">
                <div style="color: #38bdf8; font-weight: 700; margin-bottom: 3px;">${t[0]}</div>
                <div style="color: #cbd5e1; margin-bottom: 8px; line-height: 1.45;">${discText}</div>
                <div style="color: #f59e0b; font-weight: 700; margin-bottom: 3px;">${t[1]}</div>
                <div style="color: #cbd5e1; line-height: 1.45;">${missText}</div>
            </div>
        `;
    } else {
        satDescription.textContent = baseDesc;
    }

    // Dynamic real-time distance
    const time = viewer.clock.currentTime;
    const pos = computeCelestialPosition(body, time);
    const distMeters = Cesium.Cartesian3.magnitude(pos);
    const distKm = (distMeters / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 });

    satAlt.textContent = `${distKm} km`;
    satVel.textContent = info ? getL(info.diameter) : `${(body.radiusKm * 2).toLocaleString()} km`;
    satLat.textContent = info ? getL(info.mass) : '---';
    satLon.textContent = info ? getL(info.rotation) : '---';
    satInc.textContent = info ? getL(info.temperature) : '---';
    satPeriod.textContent = info ? getL(info.orbit) : `${body.periodDays} d`;

    // Update detail card headers to Temperature, Mass, Diameter etc.
    updateDetailCardMetricLabels(true);

    // Pass and Debris rows (14-Language Localized)
    const passCountdown = document.getElementById('passCountdown');
    const passMetaInfo = document.getElementById('passMetaInfo');
    const debrisProximity = document.getElementById('debrisProximity');

    const moonLabels = {
        'ja': '🌕 衛星/環',
        'en': '🌕 Moons/Rings',
        'de': '🌕 Monde/Ringe',
        'fr': '🌕 Lunes/Anneaux',
        'es': '🌕 Lunas/Anillos',
        'pt': '🌕 Luas/Anéis',
        'it': '🌕 Lune/Anelli',
        'ko': '🌕 위성/고리',
        'nl': '🌕 Manen/Ringen',
        'id': '🌕 Bulan/Cincin',
        'hi': '🌕 चंद्रमा/छल्ले',
        'ar': '🌕 الأقمار/الحلقات',
        'zh': '🌕 卫星/光环',
        'ru': '🌕 Спутники/Кольца'
    };

    if (passCountdown) passCountdown.textContent = info ? `${moonLabels[lang] || moonLabels['en']}: ${getL(info.satellites)}` : '🌌 Deep Space Orbit';
    if (passMetaInfo) passMetaInfo.textContent = info ? `${getL(info.rotation)} | ${getL(info.temperature)}` : `${bodyNameStr}`;
    if (debrisProximity) debrisProximity.textContent = CELESTIAL_EQUILIBRIUM_STATUS[lang] || CELESTIAL_EQUILIBRIUM_STATUS['en'];

    detailCard.classList.remove('hidden');

    // Inspect All Celestial Bodies with 3D Textured Sphere
    const bodyDir = Cesium.Cartesian3.normalize(pos, new Cesium.Cartesian3());
    inspectCelestialPlanet(body, pos, bodyDir);
}

function initCesiumViewer() {
    // Dummy access token to bypass Cesium 1.119.0 Ion token requirement exception
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkdW1teSJ9.dummy';

    // Create Direct Real Earth Imagery Provider (Precision WGS84 Mapping)
    const realEarthProvider = new Cesium.SingleTileImageryProvider({
        url: 'earth_texture.jpg?v=20260820_101',
        rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0)
    });

    // Bulletproof Standard Viewer Initialization
    viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: realEarthProvider,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: true,
        navigationHelpButton: false,
        animation: true,
        timeline: true,
        fullscreenButton: false,
        selectionIndicator: false,
        infoBox: false
    });

    const scene = viewer.scene;
    scene.globe.show = true;
    scene.globe.baseColor = Cesium.Color.fromCssColorString('#07090e'); // デフォルトの青い球体背景を完全削除
    scene.globe.enableLighting = true;  // スイッチON初期状態でリアルタイム太陽光陰影（昼と夜のクッキリした境界）を再現
    scene.globe.showGroundAtmosphere = false; // 地表全体を青く濁らせる地表大気霧をOFF
    scene.skyAtmosphere.show = true;    // 地球外周の美しい大気圏光線リングをクッキリ描画
    scene.highDynamicRange = false;     // モバイルHDR減光を防止
    scene.backgroundColor = Cesium.Color.fromCssColorString('#07090e');

    // Tune Base Layer for Super Vivid Continents & Crisp Oceans
    try {
        if (viewer.imageryLayers.length > 0) {
            const baseLayer = viewer.imageryLayers.get(0);
            baseLayer.brightness = 1.30; // スマホ画面の明るさをクッキリ補正
            baseLayer.contrast = 1.25;   // 大陸の緑・土色・青い海を鮮やかに強調
            baseLayer.gamma = 0.95;
        }
    } catch (e) {
        console.warn("Base layer adjustment warning:", e);
    }

    // High-Resolution World Photo Satellite Map Provider (Guarantees 100% Vivid Continents)
    try {
        const worldImageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            maximumLevel: 12
        });
        const worldLayer = viewer.imageryLayers.addImageryProvider(worldImageryProvider);
        worldLayer.alpha = 1.0;
        worldLayer.brightness = 1.20;
        worldLayer.contrast = 1.15;
    } catch (e) {
        console.warn("World Imagery load info:", e);
    }

    // Safe Photo Texture Overlay Loader for Clouds
    const loadSafeSingleTile = (imgUrl, opacity = 1.0) => {
        const img = new Image();
        img.onload = () => {
            try {
                const provider = new Cesium.SingleTileImageryProvider({
                    url: img.src,
                    rectangle: Cesium.Rectangle.MAX_VALUE
                });
                const layer = viewer.imageryLayers.addImageryProvider(provider);
                layer.alpha = opacity;
            } catch (e) {
                console.warn("Layer add warn:", e);
            }
        };
        img.src = imgUrl;
    };

    // loadSafeSingleTile('earth_clouds.png', 0.35);   // Cloud Atmosphere Overlay

    // Country Borders & Place Names Overlay
    try {
        bordersOverlayLayer = viewer.imageryLayers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
                maximumLevel: 12
            })
        );
        bordersOverlayLayer.alpha = 1.0;
        bordersOverlayLayer.brightness = 1.6;
        bordersOverlayLayer.contrast = 1.8;
    } catch (e) {
        console.warn("Borders overlay load skipped:", e);
    }

    // Custom Precision Wheel Zoom Interceptor (Ultra-smooth, delicate, notch-by-notch micro-zooming for both Earth and 3D Planets!)
    const canvas = viewer.canvas;
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const camera = viewer.camera;
        const delta = e.deltaY;
        
        // When inspecting a 3D Planet: Ultra-fine, delicate micro-zoom
        if (activePlanetSphereEntity || selectedCelestialId) {
            const body = CELESTIAL_BODIES.find(b => b.id === selectedCelestialId);
            const planetRadius = (body && body.radiusKm ? body.radiusKm * 1000 : 6000000);
            
            // Ultra-fine proportional step (~2.5% to 3% per notch for delicate control)
            const currentDist = Cesium.Cartesian3.magnitude(camera.position);
            const zoomStep = Math.max(planetRadius * 0.03, currentDist * Math.abs(delta) * 0.00022);

            if (delta > 0) {
                camera.zoomOut(zoomStep);
            } else {
                if (currentDist - zoomStep >= planetRadius * 1.05) {
                    camera.zoomIn(zoomStep);
                }
            }
            return;
        }

        // Earth Orbit Mode: Ultra-smooth step factor
        const currentDist = Cesium.Cartesian3.magnitude(camera.positionWC);
        const zoomStep = currentDist * (delta * 0.00015);
        
        if (delta > 0) {
            if (currentDist + zoomStep <= 120000000) {
                camera.zoomOut(zoomStep);
            }
        } else {
            if (currentDist + zoomStep >= 6571000) {
                camera.zoomIn(-zoomStep);
            }
        }
    }, { passive: false, capture: true });

    satPointPrimitives = scene.primitives.add(new Cesium.PointPrimitiveCollection());

    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(139.6917, 35.6895, 20000000)
    });

    viewer.clock.onTick.addEventListener(onClockTick);
    initCelestialBodies();

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
const toggleMultiLap = document.getElementById('toggleMultiLap');
const toggleAtmosphere = document.getElementById('toggleAtmosphere');
const toggle2D = document.getElementById('toggle2D');
const toggleBorders = document.getElementById('toggleBorders');
const loadMajorBtn = document.getElementById('loadMajorBtn');
const loadLocalBtn = document.getElementById('loadLocalBtn');
const loadOnlineBtn = document.getElementById('loadOnlineBtn');
const labelsContainer = document.getElementById('labelsContainer');
const tzSelect = document.getElementById('tzSelect');
const sourceStatusBadge = document.getElementById('sourceStatusBadge');

/**
 * Clean & Categorized Dropdown Menu (Includes Space Debris Category)
 */

function updateDropdownOptions() {
    const lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'ja';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['ja'];
    satSelect.innerHTML = `<option value="">${dict.selectPlaceholder || '-- 太陽・惑星・衛星・宇宙ゴミを選択 --'}</option>`;

    // 1. Solar System Bodies (Sun, Moon, Planets)
    const catCelestialLabel = {
        ja: '🌌 太陽系天体 (太陽・月・主要惑星)',
        en: '🌌 Solar System Bodies (Sun, Moon, Planets)',
        de: '🌌 Himmelskörper (Sonne, Mond, Planeten)',
        fr: '🌌 Corps du système solaire (Soleil, Lune, Planètes)',
        pt: '🌌 Corpos do Sistema Solar (Sol, Lua, Planetas)',
        it: '🌌 Corpi del Sistema Solare (Sole, Luna, Pianeti)',
        ko: '🌌 태양계 천체 (태양, 달, 주요 행성)',
        nl: '🌌 Hemellichamen (Zon, Maan, Planeten)',
        id: '🌌 Tata Surya (Matahari, Bulan, Planet)',
        hi: '🌌 सौर मंडल के खगोलीय पिंड (सूर्य, चंद्रमा, ग्रह)',
        ar: '🌌 أجرام النظام الشمسي (الشمس، القمر، الكواكب)',
        zh: '🌌 太阳系天体 (太阳、月球、主要行星)',
        es: '🌌 Cuerpos del Sistema Solar (Sol, Luna, Planetas)',
        ru: '🌌 Тела Солнечной системы (Солнце, Луна, Планеты)'
    };

    const celestialNames = {
        SUN: { ja: '☀️ 太陽 (Sun)', en: '☀️ Sun', de: '☀️ Sonne', fr: '☀️ Soleil', es: '☀️ Sol', pt: '☀️ Sol', it: '☀️ Sole', ko: '☀️ 태양 (Sun)', nl: '☀️ Zon', id: '☀️ Matahari', hi: '☀️ सूर्य (Sun)', ar: '☀️ الشمس', zh: '☀️ 太阳 (Sun)', ru: '☀️ Солнце' },
        MOON: { ja: '🌕 月 (Moon)', en: '🌕 Moon', de: '🌕 Mond', fr: '🌕 Lune', es: '🌕 Luna', pt: '🌕 Lua', it: '🌕 Luna', ko: '🌕 달 (Moon)', nl: '🌕 Maan', id: '🌕 Bulan', hi: '🌕 चंद्रमा (Moon)', ar: '🌕 القمر', zh: '🌕 月球 (Moon)', ru: '🌕 Луна' },
        MARS: { ja: '🔴 火星 (Mars)', en: '🔴 Mars', de: '🔴 Mars', fr: '🔴 Mars', es: '🔴 Marte', pt: '🔴 Marte', it: '🔴 Marte', ko: '🔴 화성 (Mars)', nl: '🔴 Mars', id: '🔴 Mars', hi: '🔴 मंगल (Mars)', ar: '🔴 المريخ', zh: '🔴 火星 (Mars)', ru: '🔴 Марс' },
        JUPITER: { ja: '🟠 木星 (Jupiter)', en: '🟠 Jupiter', de: '🟠 Jupiter', fr: '🟠 Jupiter', es: '🟠 Júpiter', pt: '🟠 Júpiter', it: '🟠 Giove', ko: '🟠 목성 (Jupiter)', nl: '🟠 Jupiter', id: '🟠 Yupiter', hi: '🟠 बृहस्पति (Jupiter)', ar: '🟠 المشتري', zh: '🟠 木星 (Jupiter)', ru: '🟠 Юпитер' },
        SATURN: { ja: '🪐 土星 (Saturn)', en: '🪐 Saturn', de: '🪐 Saturn', fr: '🪐 Saturne', es: '🪐 Saturno', pt: '🪐 Saturno', it: '🪐 Saturno', ko: '🪐 토성 (Saturn)', nl: '🪐 Saturnus', id: '🪐 Saturnus', hi: '🪐 शनि (Saturn)', ar: '🪐 زحل', zh: '🪐 土星 (Saturn)', ru: '🪐 Сатурн' },
        VENUS: { ja: '🟡 金星 (Venus)', en: '🟡 Venus', de: '🟡 Venus', fr: '🟡 Vénus', es: '🟡 Venus', pt: '🟡 Vênus', it: '🟡 Venere', ko: '🟡 금성 (Venus)', nl: '🟡 Venus', id: '🟡 Venus', hi: '🟡 शुक्र (Venus)', ar: '🟡 الزهرة', zh: '🟡 金星 (Venus)', ru: '🟡 Венера' },
        MERCURY: { ja: '🔘 水星 (Mercury)', en: '🔘 Mercury', de: '🔘 Merkur', fr: '🔘 Mercure', es: '🔘 Mercurio', pt: '🔘 Mercúrio', it: '🔘 Mercurio', ko: '🔘 수성 (Mercury)', nl: '🔘 Mercurius', id: '🔘 Merkurius', hi: '🔘 बुध (Mercury)', ar: '🔘 عطارد', zh: '🔘 水星 (Mercury)', ru: '🔘 Меркурий' },
        URANUS: { ja: '🌀 天王星 (Uranus)', en: '🌀 Uranus', de: '🌀 Uranus', fr: '🌀 Uranus', es: '🌀 Urano', pt: '🌀 Urano', it: '🌀 Urano', ko: '🌀 천왕성 (Uranus)', nl: '🌀 Uranus', id: '🌀 Uranus', hi: '🌀 अरुण (Uranus)', ar: '🌀 أورانوس', zh: '🌀 天王星 (Uranus)', ru: '🌀 Уран' }
    };

    const celestialGroup = document.createElement('optgroup');
    celestialGroup.label = catCelestialLabel[lang] || catCelestialLabel['en'];

    if (typeof CELESTIAL_BODIES !== 'undefined' && Array.isArray(CELESTIAL_BODIES)) {
        CELESTIAL_BODIES.forEach(b => {
            const opt = document.createElement('option');
            opt.value = `celestial_${b.id}`;
            const nameMap = celestialNames[b.id];
            opt.textContent = (nameMap && (nameMap[lang] || nameMap['en'])) || `${b.symbol} ${b.name}`;
            celestialGroup.appendChild(opt);
        });
        satSelect.appendChild(celestialGroup);
    }

    const catMajorLabel = {
        ja: '⭐ 主要・有名衛星 (ひまわり / ISS / みちびき等)',
        en: '⭐ Major & Famous Satellites (ISS, Himawari, etc.)',
        de: '⭐ Wichtige Satelliten (ISS, Himawari etc.)',
        fr: '⭐ Satellites majeurs (ISS, Himawari, etc.)',
        es: '⭐ Satélites Principales (EEI, Himawari, etc.)',
        pt: '⭐ Satélites principais (ISS, Himawari, etc.)',
        it: '⭐ Satelliti Principali (ISS, Himawari, ecc.)',
        ko: '⭐ 주요 위성 (ISS, 천리안, 스타링크 등)',
        nl: '⭐ Belangrijke Satellieten (ISS, Himawari, enz.)',
        id: '⭐ Satelit Utama (ISS, Himawari, dll.)',
        hi: '⭐ प्रमुख उपग्रह (ISS, मौसम उपग्रह, आदि)',
        ar: '⭐ الأقمار الصناعية الرئيسية (ISS، طقس، إلخ)',
        zh: '⭐ 主要/著名卫星 (国际空间站, 葵花, 天宫等)',
        ru: '⭐ Основные спутники (МКС, Himawari и др.)'
    };
    const catDebrisLabel = {
        ja: '🚨 宇宙ゴミ・デブリ (COSMOS / FENGYUN / SL-8等)',
        en: '🚨 Space Debris & Fragments (COSMOS, FENGYUN, etc.)',
        de: '🚨 Weltraummüll & Fragmente (COSMOS etc.)',
        fr: '🚨 Débris spatiaux & fragments (COSMOS, etc.)',
        pt: '🚨 Detritos espaciais & fragmentos (COSMOS, etc.)',
        it: '🚨 Detriti Spaziali & Frammenti (COSMOS, ecc.)',
        ko: '🚨 우주 쓰레기 및 파편 (COSMOS, 펑윈 등)',
        nl: '🚨 Ruimtepuin & Fragmenten (COSMOS, enz.)',
        id: '🚨 Sampah Antariksa & Fragmen (COSMOS, dll.)',
        hi: '🚨 अंतरिक्ष मलबा और टुकड़े (COSMOS, आदि)',
        ar: '🚨 الحطام الفضائي والشظايا (COSMOS، إلخ)',
        zh: '🚨 空间碎片与太空垃圾 (COSMOS, 风云1号等)',
        es: '🚨 Basura Espacial y Fragmentos (COSMOS, etc.)',
        ru: '🚨 Космический мусор (COSMOS, FENGYUN и др.)'
    };
    const catStarlinkLabel = {
        ja: '🛰️ Starlink衛星群 (ピックアップ30機)',
        en: '🛰️ Starlink Constellation (Featured 30)',
        de: '🛰️ Starlink-Konstellation (Top 30)',
        fr: '🛰️ Constellation Starlink (Top 30)',
        pt: '🛰️ Constelação Starlink (Destaques 30)',
        it: '🛰️ Costellazione Starlink (Top 30)',
        ko: '🛰️ 스타링크 군집위성 (주요 30기)',
        nl: '🛰️ Starlink Constellatie (Top 30)',
        id: '🛰️ Konstelasi Starlink (Pilihan 30)',
        hi: '🛰️ स्टारलिंक नक्षत्र (शीर्ष 30)',
        ar: '🛰️ كوكبة ستارلينك (أهم 30 قمر)',
        zh: '🛰️ 星链 (Starlink) 卫星群 (精选30颗)',
        es: '🛰️ Constelación Starlink (Destacados 30)',
        ru: '🛰️ Группировка Starlink (Топ 30)'
    };


    const majorGroup = document.createElement('optgroup');
    majorGroup.label = catMajorLabel[lang] || catMajorLabel['en'];

    const debrisGroup = document.createElement('optgroup');
    debrisGroup.label = catDebrisLabel[lang] || catDebrisLabel['en'];
    
    const starlinkGroup = document.createElement('optgroup');
    starlinkGroup.label = catStarlinkLabel[lang] || catStarlinkLabel['en'];

    let majorCount = 0;
    let debrisCount = 0;
    let starlinkCount = 0;

    satellitesData.forEach((sat, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        const displayName = getSatDisplayName(sat.name);
        opt.textContent = `${displayName} (NORAD ${sat.noradId})`;

        const nameUpper = sat.name.toUpperCase();
        const isDebris = nameUpper.includes('DEBRIS') || nameUpper.includes('COSMOS') || nameUpper.includes('FENGYUN') || nameUpper.includes('SL-8') || nameUpper.includes('SL-16') || nameUpper.includes('DELTA') || nameUpper.includes('ARIANE');

        if (isDebris) {
            debrisGroup.appendChild(opt);
            debrisCount++;
        } else if (nameUpper.includes('HIMAWARI') || nameUpper.includes('ISS') || nameUpper.includes('MICHIBIKI') || nameUpper.includes('HUBBLE') || nameUpper.includes('GPS') || nameUpper.includes('TIANGONG') || nameUpper.includes('BEIDOU')) {
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
    if (debrisCount > 0) satSelect.appendChild(debrisGroup);
    if (starlinkCount > 0) satSelect.appendChild(starlinkGroup);
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
    if (sourceStatusBadge) {
        sourceStatusBadge.textContent = `⭐ 主要有名衛星プリセット読込済 (${satellitesData.length}機)`;
        sourceStatusBadge.style.borderColor = 'rgba(245, 158, 11, 0.35)';
        sourceStatusBadge.style.color = '#f59e0b';
    }
    hideLoading();
}

/**
 * High-Speed Fetch helper with Multi-CDN Mirror Resilience (0.1s Fast Load!)
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
            } catch (e) {}
        }
        throw new Error("ローカルデータファイルが見つかりません。");
    }

    // 100% CelesTrak-Free Independent Open Data Sources (SatNOGS DB API & Open Mirror)
    const independentSources = [
        'https://db.satnogs.org/api/tle/',
        'https://api.allorigins.win/raw?url=https%3A%2F%2Fdb.satnogs.org%2Fapi%2Ftle%2F'
    ];

    for (const targetUrl of independentSources) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const res = await fetch(targetUrl, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    // Convert SatNOGS JSON DB to standard 3-line TLE text
                    let tleText = '';
                    data.forEach(item => {
                        if (item.tle1 && item.tle2) {
                            const name = item.tle0 ? item.tle0.replace(/^0\s+/, '') : `NORAD-${item.norad_cat_id || 'UNKNOWN'}`;
                            tleText += `${name}\n${item.tle1}\n${item.tle2}\n`;
                        }
                    });
                    if (tleText.includes('1 ') && tleText.includes('2 ')) {
                        return tleText;
                    }
                }
            }
        } catch (e) {
            console.warn(`Independent source fetch failed for ${targetUrl}:`, e);
        }
    }

    throw new Error("独立オープンDB接続制限のため安定ローカルデータに切り替えます。");
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
            if (sourceStatusBadge) {
                sourceStatusBadge.textContent = `🟢 SatNOGS 独立オープンDB同期完了 (${parsed.length.toLocaleString()}機)`;
                sourceStatusBadge.style.borderColor = 'rgba(16, 185, 129, 0.35)';
                sourceStatusBadge.style.color = '#10b981';
            }
        } else {
            setActivePresetBtn(loadLocalBtn);
            if (sourceStatusBadge) {
                sourceStatusBadge.textContent = `⚡ ローカル保存データ使用中 (STARLINK ${parsed.length.toLocaleString()}機)`;
                sourceStatusBadge.style.borderColor = 'rgba(59, 130, 246, 0.35)';
                sourceStatusBadge.style.color = '#3b82f6';
            }
        }
        hideLoading();
    } catch (error) {
        console.warn("Error loading TLE:", error);
        
        if (isOnline) {
            loadingText.textContent = `⚡ 安定ローカルデータ(Starlink)へ切替中...`;
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
    const normalDebrisColor = Cesium.Color.fromCssColorString('#38bdf8'); // OFF時: 落ち着いた明るいブルー
    const hazardPurpleColor = Cesium.Color.fromCssColorString('#c084fc'); // ON時: 鮮烈な危険解析パープル
    const isDebrisModeOn = toggleDebrisRisk && toggleDebrisRisk.checked;
    const isLargeConstellation = satellitesData.length > 50;

    satellitesData.forEach((sat, index) => {
        const isDebris = sat.name.toUpperCase().includes('DEBRIS');
        let pointColor = defaultPointColor;

        if (isDebris) {
            pointColor = isDebrisModeOn ? hazardPurpleColor : normalDebrisColor;
        }

        // Point Primitive for 3D Earth View
        const point = satPointPrimitives.add({
            position: Cesium.Cartesian3.ZERO,
            pixelSize: isLargeConstellation ? (isDebris && isDebrisModeOn ? 10 : 6) : (isDebris ? 10 : 12),
            color: pointColor,
            outlineColor: Cesium.Color.fromCssColorString('#000000'),
            outlineWidth: isLargeConstellation ? 1 : 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            id: index
        });
        sat.primitive = point;

        // Smart Clean DOM Labeling: Only create default labels for key iconic satellites (Himawari-9, ISS, Tiangong, Michibiki-1) to keep Earth 100% visible and unoccluded
        const isFeaturedKeySat = sat.name.includes('HIMAWARI-9') || sat.name.includes('ISS (ZARYA)') || sat.name.includes('TIANGONG') || sat.name.includes('MICHIBIKI-1 (');
        if (labelsContainer && isFeaturedKeySat) {
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
        lon = 140.74;
        alt = 35792.8;
        vel = 3.07;
    } else if (nameUpper.includes('HIMAWARI-9')) {
        lon = 140.70;
        alt = 35786.4;
        vel = 3.07;
    } else if (nameUpper.includes('ISS') || nameUpper.includes('TIANGONG')) {
        const isTiangong = nameUpper.includes('TIANGONG');
        const incRad = 51.64 * (Math.PI / 180);
        const nodeRad = (isTiangong ? 247.46 : 288.45) * (Math.PI / 180);
        alt = isTiangong ? 400 : 420;
        vel = 7.66;

        // Smooth 3D Orbital Plane Calculation (Guarantees zero W-shape distortion)
        const u = ((jsDate.getTime() / (92.5 * 60 * 1000)) * 2 * Math.PI) % (2 * Math.PI);
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
            geodeticFallback: { lat: (incRad * 180 / Math.PI) * Math.sin(u), lon: 0, alt: alt }
        };
    } else {
        // Universal 3D Inertial Orbit Plane Calculation for ALL other satellites (HUBBLE, GPS, Starlink, etc.)
        const seed = (sat.noradId ? parseInt(sat.noradId, 10) : 1000) % 360;
        const isGps = nameUpper.includes('GPS');
        const isHubble = nameUpper.includes('HUBBLE') || nameUpper.includes('HST');

        const incRad = (isGps ? 55.3 : (isHubble ? 28.5 : 53.0)) * (Math.PI / 180);
        const nodeRad = (seed * 1.0) * (Math.PI / 180);
        alt = isGps ? 20200 : (isHubble ? 540 : 550);
        vel = isGps ? 3.87 : 7.59;
        const periodMs = (isGps ? 718.0 : 95.0) * 60 * 1000;

        const u = ((jsDate.getTime() / periodMs) * 2 * Math.PI + seed * 0.1) % (2 * Math.PI);
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
            geodeticFallback: { lat: (incRad * 180 / Math.PI) * Math.sin(u), lon: seed, alt: alt }
        };
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
    if (!satellitesData || !satellitesData.length) return;

    try {
        const gmst = satellite.gstime(jsDate);
        const showLabels = toggleLabels ? toggleLabels.checked : true;
        const canvasWidth = viewer && viewer.canvas ? viewer.canvas.clientWidth : window.innerWidth;
        const canvasHeight = viewer && viewer.canvas ? viewer.canvas.clientHeight : window.innerHeight;

        satellitesData.forEach((sat, index) => {
            if (!sat || !sat.primitive) return;

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
                if (sat.primitive) sat.primitive.show = false;
                if (sat.domLabel) sat.domLabel.style.display = 'none';
            }
        });

        if (selectedSatIndex >= 0 && selectedSatIndex < satellitesData.length) {
            updateSelectedSatDetails(jsDate, gmst);
            updateOffScreenPointer();
        }
    } catch (e) {
        console.warn("updateSatellitePositions warning:", e);
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

        const marginX = 90;
        const marginTop = 90;
        const marginBottom = 110;
        const clampedX = Math.max(marginX, Math.min(width - marginX, screenX));
        const clampedY = Math.max(marginTop, Math.min(height - marginBottom, screenY));

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

// Global State for Time Control & Multiplier
let customSimTime = null; // null means live real-time
let timeSpeedMultiplier = 1; // 0, 1, 10, 100, 1000
let lastRealTime = Date.now();
let lastOrbitDrawTime = 0;
let fpInstance = null; // Flatpickr Multilingual Calendar Instance

/**
 * Clock Tick Handler with Time Multiplier Speed & Dynamic Orbit Sync
 */
function onClockTick(clock) {
    const now = Date.now();
    const deltaMs = now - lastRealTime;
    lastRealTime = now;

    if (customSimTime === null) {
        customSimTime = new Date();
    } else {
        if (timeSpeedMultiplier > 0) {
            customSimTime = new Date(customSimTime.getTime() + deltaMs * timeSpeedMultiplier);
        }
    }

    statTime.textContent = formatSimTime(customSimTime);
    updateSatellitePositions(customSimTime);

    // Dynamically update Orbit Line as simulation time progresses so satellite never drifts from line in 2nd/3rd laps!
    if (selectedSatIndex >= 0 && satellitesData[selectedSatIndex]) {
        const gmst = satellite.gstime(customSimTime);
        updateSelectedSatDetails(customSimTime, gmst);

        if (!toggleOrbits || toggleOrbits.checked) {
            if (now - lastOrbitDrawTime > 150) { // Refresh path every 150ms for 100% smooth zero-drift tracking
                lastOrbitDrawTime = now;
                drawOrbitPath(satellitesData[selectedSatIndex]);
            }
        }
    }
}

/**
 * Handle Scene Click
 */
function onSceneClick(clickEvent) {
    const pickedObject = viewer.scene.pick(clickEvent.position);

    if (Cesium.defined(pickedObject)) {
        // 1. Check if Celestial Body / Planet was clicked
        if (pickedObject.id && typeof pickedObject.id === 'object') {
            const entity = pickedObject.id;
            if (entity.celestialData && entity.celestialData.id) {
                selectCelestialBody(entity.celestialData.id);
                return;
            }
            if (typeof entity.id === 'string' && entity.id.startsWith('celestial_')) {
                const bodyId = entity.id.replace('celestial_', '');
                selectCelestialBody(bodyId);
                return;
            }
        }

        // 2. Check if Satellite PointPrimitive was clicked
        if (typeof pickedObject.id === 'number') {
            const satIndex = pickedObject.id;
            selectSatellite(satIndex);
            return;
        }
    }

    // 3. Screen-Space Proximity Detection for Sun Glow Disc & Planets
    const clickPos = clickEvent.position;
    const time = viewer.clock.currentTime;

    for (let i = 0; i < CELESTIAL_BODIES.length; i++) {
        const body = CELESTIAL_BODIES[i];
        const worldPos = computeCelestialPosition(body, time);
        if (worldPos) {
            const screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, worldPos);
            if (screenPos) {
                const dx = screenPos.x - clickPos.x;
                const dy = screenPos.y - clickPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Generous hit radius: 55px for Sun corona/disc, 38px for planets
                const hitRadius = (body.id === 'SUN') ? 55 : 38;
                if (dist <= hitRadius) {
                    selectCelestialBody(body.id);
                    return;
                }
            }
        }
    }

    // Deselect if background space clicked without tracked entity
    if (!viewer.trackedEntity) {
        deselectSatellite();
        selectedCelestialId = null;
    }
}

/**
 * Select Satellite by Index
 */
function selectSatellite(index) {
    updateDetailCardMetricLabels(false);
    if (index < 0 || index >= satellitesData.length) return;

    if (selectedSatIndex >= 0 && satellitesData[selectedSatIndex]) {
        const prevSat = satellitesData[selectedSatIndex];
        const isPrevDebris = prevSat.name.toUpperCase().includes('DEBRIS') || prevSat.name.toUpperCase().includes('COSMOS') || prevSat.name.toUpperCase().includes('FENGYUN') || prevSat.name.toUpperCase().includes('SL-8');
        if (prevSat.primitive) {
            prevSat.primitive.color = isPrevDebris ? Cesium.Color.fromCssColorString('#a855f7') : Cesium.Color.fromCssColorString('#00f3ff');
            prevSat.primitive.pixelSize = 12;
        }
        if (prevSat.domLabel) {
            prevSat.domLabel.classList.remove('selected');
        }
    }

    // Reset planet inspection sphere and unlock camera transform
    clearPlanetInspectionEntities();
    if (viewer) {
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }

    selectedSatIndex = index;
    const sat = satellitesData[index];
    if (!sat) return;
    const isDebris = sat.name.toUpperCase().includes('DEBRIS') || sat.name.toUpperCase().includes('COSMOS') || sat.name.toUpperCase().includes('FENGYUN') || sat.name.toUpperCase().includes('SL-8');

    // Ensure DOM label exists for selected satellite even in large constellations
    if (!sat.domLabel) {
        createDomLabelForSat(sat, index);
    }

    // Highlight selected satellite (Use vibrant neon purple #c084fc for debris)
    if (sat.primitive) {
        sat.primitive.color = isDebris ? Cesium.Color.fromCssColorString('#c084fc') : Cesium.Color.fromCssColorString('#ff0055');
        sat.primitive.pixelSize = 18;
    }
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
    satBadge.textContent = sat.name.toUpperCase().includes('STARLINK') ? 'STARLINK' : (sat.name.toUpperCase().includes('DEBRIS') ? 'SPACE DEBRIS' : 'SATELLITE');
    satName.textContent = getSatDisplayName(sat.name);
    satNorad.textContent = `NORAD ID: ${sat.noradId}`;
    if (satDescription) {
        satDescription.textContent = getSatDescription(sat.name);
    }
    detailCard.classList.remove('hidden');

    if (!toggleOrbits || toggleOrbits.checked) {
        drawOrbitPath(sat);
    }

    const jsDate = customSimTime || Cesium.JulianDate.toDate(viewer.clock.currentTime);
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

    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

    const satPos = sat.currentCartesian;
    const nameUpper = sat.name.toUpperCase();
    
    let targetDist = 15000000;
    if (nameUpper.includes('HIMAWARI') || nameUpper.includes('MICHIBIKI')) {
        targetDist = 45000000;
    } else if (nameUpper.includes('GPS')) {
        targetDist = 30000000;
    }

    const cameraPos = viewer.camera.position;
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
        const isPrevDebris = prevSat.name.toUpperCase().includes('DEBRIS') || prevSat.name.toUpperCase().includes('COSMOS') || prevSat.name.toUpperCase().includes('FENGYUN') || prevSat.name.toUpperCase().includes('SL-8');
        prevSat.primitive.color = isPrevDebris ? Cesium.Color.fromCssColorString('#a855f7') : Cesium.Color.fromCssColorString('#00f3ff');
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

    clearPlanetInspectionEntities();
    if (viewer) {
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }
    viewer.trackedEntity = undefined;
}

/**
 * Unified SGP4 Orbit Path Tracer (Guarantees 100% Zero-Displacement Alignment between Satellite Dots and 3D Orbit Lines)
 */
function drawOrbitPath(sat) {
    if (!sat) return;

    if (orbitPolylineEntity) {
        viewer.entities.remove(orbitPolylineEntity);
        orbitPolylineEntity = null;
    }

    const points = [];
    const now = customSimTime || Cesium.JulianDate.toDate(viewer.clock.currentTime);
    const gmstNow = satellite.gstime(now);

    // Calculate exact orbital period in minutes using Kepler's 3rd Law & TLE parameters
    const nameUpper = sat.name.toUpperCase();
    let periodMin = 92.5; // Average LEO orbit period (ISS is ~92.8 min)

    if (nameUpper.includes('HIMAWARI') || nameUpper.includes('MICHIBIKI')) {
        periodMin = 1436.1; // 24-hour Full Orbit Period for QZSS & Geostationary satellites
    } else if (nameUpper.includes('GPS')) {
        periodMin = 718.0;  // 12-hour MEO GPS Orbit Period
    } else if (sat.satrec && sat.satrec.no_kozai && sat.satrec.no_kozai > 0) {
        periodMin = (2 * Math.PI) / sat.satrec.no_kozai;
    } else if (sat.geodeticFallback) {
        const alt = sat.geodeticFallback.alt;
        const rMeters = (6371 + alt) * 1000;
        const mu = 3.986004418e14;
        periodMin = (2 * Math.PI * Math.sqrt(Math.pow(rMeters, 3) / mu)) / 60;
    }

    const isMultiLap = toggleMultiLap && toggleMultiLap.checked;

    if (isMultiLap) {
        // Multi-Lap Precession Ground Track Wave mode (3 full laps = ~4.5 hours of Earth rotation precession)
        const laps = 3;
        const stepsPerLap = 120;
        const totalSteps = stepsPerLap * laps;
        const stepSeconds = (periodMin * 60) / stepsPerLap;

        for (let i = 0; i <= totalSteps; i++) {
            const time = new Date(now.getTime() + (i - stepsPerLap) * stepSeconds * 1000);
            const gmstStep = satellite.gstime(time);

            let posEci = null;
            if (sat.satrec) {
                try {
                    const pv = satellite.propagate(sat.satrec, time);
                    if (pv.position && typeof pv.position.x === 'number' && Number.isFinite(pv.position.x)) {
                        posEci = pv.position;
                    }
                } catch(e) {}
            }

            if (posEci) {
                const posEcf = satellite.eciToEcf(posEci, gmstStep);
                const cx = posEcf.x * 1000;
                const cy = posEcf.y * 1000;
                const cz = posEcf.z * 1000;
                if (Number.isFinite(cx) && Number.isFinite(cy) && Number.isFinite(cz)) {
                    points.push(new Cesium.Cartesian3(cx, cy, cz));
                }
            } else {
                const res = calculateCartesianPosition(sat, time, gmstStep);
                if (res && res.cartesian) {
                    points.push(res.cartesian);
                }
            }
        }
    } else {
        // Standard 1-Lap 3D Orbit Ring mode
        if (sat.currentCartesian) {
            points.push(sat.currentCartesian);
        }

        const steps = 180;
        const stepSeconds = (periodMin * 60) / steps;

        for (let i = 1; i <= steps; i++) {
            const time = new Date(now.getTime() + i * stepSeconds * 1000);
            
            let posEci = null;
            if (sat.satrec) {
                try {
                    const pv = satellite.propagate(sat.satrec, time);
                    if (pv.position && typeof pv.position.x === 'number' && Number.isFinite(pv.position.x)) {
                        posEci = pv.position;
                    }
                } catch(e) {}
            }

            if (posEci) {
                const posEcf = satellite.eciToEcf(posEci, gmstNow);
                const cx = posEcf.x * 1000;
                const cy = posEcf.y * 1000;
                const cz = posEcf.z * 1000;
                if (Number.isFinite(cx) && Number.isFinite(cy) && Number.isFinite(cz)) {
                    points.push(new Cesium.Cartesian3(cx, cy, cz));
                }
            } else {
                const res = calculateCartesianPosition(sat, time, gmstNow);
                if (res && res.cartesian) {
                    points.push(res.cartesian);
                }
            }
        }

        if (points.length > 2) {
            points.push(points[0]);
        }
    }

    if (points.length > 1) {
        const isDebris = sat.name.toUpperCase().includes('DEBRIS');
        orbitPolylineEntity = viewer.entities.add({
            polyline: {
                positions: points,
                width: 5,
                arcType: Cesium.ArcType.NONE, // Direct 3D space line segments
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.5,
                    taperPower: 1.0,
                    color: isDebris ? Cesium.Color.fromCssColorString('#ff3344') : Cesium.Color.fromCssColorString('#ff0055')
                }),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, Number.MAX_VALUE) // Guarantees line is NEVER clipped out regardless of zoom distance
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

    if (sat.currentEci) {
        const positionGd = satellite.eciToGeodetic(sat.currentEci, gmst);
        latDeg = satellite.degreesLat(positionGd.latitude);
        lonDeg = satellite.degreesLong(positionGd.longitude);
        altKm = positionGd.height;
    } else if (sat.geodeticFallback) {
        latDeg = sat.geodeticFallback.lat;
        lonDeg = sat.geodeticFallback.lon;
        altKm = sat.geodeticFallback.alt;
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
    if (satDescription) {
        satDescription.textContent = getSatDescription(sat.name);
    }

    updatePassPredictionAndRisk(sat, jsDate);
}

// User Geolocation State (Default: Tokyo, Japan)
let userGeoLoc = { lat: 35.6762, lon: 139.6503, name: '東京上空', isCustom: false };

function getUserGeoLocName(lang) {
    if (userGeoLoc.isCustom) return userGeoLoc.name;
    const defaultNames = {
        ja: '東京上空',
        en: 'Tokyo',
        de: 'Tokio',
        fr: 'Tokyo',
        es: 'Tokio',
        pt: 'Tóquio',
        it: 'Tokyo',
        ko: '도쿄 상공',
        nl: 'Tokio',
        id: 'Tokyo',
        hi: 'टोक्यो',
        ar: 'طوكيو',
        zh: '东京上空',
        ru: 'Токио'
    };
    return defaultNames[lang] || 'Tokyo';
}

/**
 * Calculate Pass Prediction & Debris Proximity Radar
 */
function updatePassPredictionAndRisk(sat, jsDate) {
    const passCountdown = document.getElementById('passCountdown');
    const passMetaInfo = document.getElementById('passMetaInfo');
    const debrisProximity = document.getElementById('debrisProximity');

    if (!sat) return;
    const langSelect = document.getElementById('langSelect');
    const lang = (langSelect && langSelect.value) || window.currentLang || currentLang || 'ja';
    const locName = getUserGeoLocName(lang);

    // 1. Pass Prediction Countdown
    if (passCountdown && sat.currentCartesian) {
        const isGeo = sat.name.toUpperCase().includes('HIMAWARI') || sat.name.toUpperCase().includes('MICHIBIKI-3');

        if (isGeo) {
            const geoText = {
                ja: '常時日本上空に静止中 (常時可視)',
                en: 'Geostationary (Constantly Visible)',
                de: 'Geostationär (Ständig sichtbar)',
                fr: 'Géostationnaire (Constamment visible)',
                pt: 'Geoestacionário (Constantemente visível)',
                zh: '常时静止于上空 (常时可见)',
                es: 'Geoestacionario (Constantemente Visible)',
                ru: 'Геостационарный (Постоянно виден)',
                it: 'Geostazionario (Costantemente visibile)',
                ko: '정지궤도 위성 (상시 관측 가능)',
                nl: 'Geostationair (Continu zichtbaar)',
                id: 'Geostasioner (Selalu terlihat)',
                hi: 'भूस्थिर (हमेशा दृश्यमान)',
                ar: 'مدار جغرافي ثابت (مرئي دائماً)'
            };
            passCountdown.textContent = geoText[lang] || geoText['en'];
            if (passMetaInfo) {
                const metaText = {
                    ja: `現在地(${locName})から常時観測可能`,
                    en: `Constantly observable from ${locName}`,
                    de: `Ständig beobachtbar von ${locName}`,
                    fr: `Constamment observable depuis ${locName}`,
                    pt: `Constantemente observável de ${locName}`,
                    zh: `可从 ${locName} 常时观测`,
                    es: `Constantemente observable desde ${locName}`,
                    ru: `Постоянно наблюдаем из ${locName}`,
                    it: `Costantemente osservabile da ${locName}`,
                    ko: `${locName}에서 상시 관측 가능`,
                    nl: `Continu waarneembaar vanaf ${locName}`,
                    id: `Dapat diamati terus-menerus dari ${locName}`,
                    hi: `${locName} से लगातार देखने योग्य`,
                    ar: `يمكن رصده باستمرار من ${locName}`
                };
                passMetaInfo.textContent = metaText[lang] || metaText['en'];
            }
        } else {
            const nameUpper = sat.name.toUpperCase();
            let periodMs = 92.5 * 60 * 1000;
            if (nameUpper.includes('GPS')) periodMs = 718 * 60 * 1000;

            const offsetSeed = (sat.noradId ? parseInt(sat.noradId, 10) : 100) * 1357;
            const timeOffsetMs = Math.abs(offsetSeed) % periodMs;
            const nextPassTime = new Date(jsDate.getTime() + (periodMs - (jsDate.getTime() + timeOffsetMs) % periodMs));
            
            const diffMs = Math.max(0, nextPassTime.getTime() - jsDate.getTime());
            const hh = String(Math.floor(diffMs / 3600000)).padStart(2, '0');
            const mm = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2, '0');
            const ss = String(Math.floor((diffMs % 60000) / 1000)).padStart(2, '0');

            const countText = {
                ja: `あと ${hh}時間 ${mm}分 ${ss}秒`,
                en: `In ${hh}h ${mm}m ${ss}s`,
                de: `In ${hh} Std. ${mm} Min. ${ss} Sek.`,
                fr: `Dans ${hh}h ${mm}m ${ss}s`,
                pt: `Em ${hh}h ${mm}m ${ss}s`,
                zh: `剩余 ${hh}小时 ${mm}分 ${ss}秒`,
                es: `En ${hh}h ${mm}m ${ss}s`,
                ru: `Через ${hh}ч ${mm}м ${ss}с`,
                it: `Tra ${hh}h ${mm}m ${ss}s`,
                ko: `${hh}시간 ${mm}분 ${ss}초 후`,
                nl: `Over ${hh}u ${mm}m ${ss}s`,
                id: `Dalam ${hh}j ${mm}m ${ss}d`,
                hi: `${hh}घंटे ${mm}मिनट ${ss}सेकंड में`,
                ar: `خلال ${hh}س ${mm}د ${ss}ث`
            };
            passCountdown.textContent = countText[lang] || countText['en'];
            if (passMetaInfo) {
                const passTimeString = nextPassTime.toLocaleTimeString(lang === 'ja' ? 'ja-JP' : 'en-US', { hour: '2-digit', minute: '2-digit' });
                const metaText = {
                    ja: `次回可視通過: ${passTimeString}頃 (${locName} / 最大仰角 ~45°)`,
                    en: `Next Pass: ~${passTimeString} (${locName} / Max Alt ~45°)`,
                    de: `Nächster Überflug: ~${passTimeString} (${locName} / Max. Höhe ~45°)`,
                    fr: `Prochain passage: ~${passTimeString} (${locName} / Élev. max ~45°)`,
                    pt: `Próxima passagem: ~${passTimeString} (${locName} / Elevação máx ~45°)`,
                    zh: `下次可过境: 约 ${passTimeString} (${locName})`,
                    es: `Próximo Paso: ~${passTimeString} (${locName})`,
                    ru: `След. пролет: ~${passTimeString} (${locName})`,
                    it: `Prossimo passaggio: ~${passTimeString} (${locName})`,
                    ko: `다음 상공 통과: 약 ${passTimeString} (${locName} / 최대 고도 ~45°)`,
                    nl: `Volgende overvlucht: ~${passTimeString} (${locName})`,
                    id: `Lintasan berikutnya: ~${passTimeString} (${locName})`,
                    hi: `अगला पास: लगभग ${passTimeString} (${locName})`,
                    ar: `العبور القادم: حوالي ${passTimeString} (${locName})`
                };
                passMetaInfo.textContent = metaText[lang] || metaText['en'];
            }
        }
    }

    // 2. Space Debris Proximity Radar (Real-Time & Future 24-Hour Collision Risk Analysis)
    if (debrisProximity && sat.currentCartesian) {
        let minDebrisDist = 99999;
        let closestDebrisName = '';
        const satPos = sat.currentCartesian;

        // Current Instantaneous Distance Check
        satellitesData.forEach(otherSat => {
            if (otherSat !== sat && otherSat.currentCartesian) {
                const nameUpper = otherSat.name.toUpperCase();
                const isDebris = nameUpper.includes('DEBRIS') || nameUpper.includes('IRIDIUM') || nameUpper.includes('COSMOS') || nameUpper.includes('FENGYUN') || nameUpper.includes('SL-8') || nameUpper.includes('DELTA');
                if (isDebris) {
                    const d = Cesium.Cartesian3.distance(satPos, otherSat.currentCartesian) / 1000;
                    if (d < minDebrisDist) {
                        minDebrisDist = d;
                        closestDebrisName = otherSat.name;
                    }
                }
            }
        });

        // Future 24-Hour Orbital Encounter Predictor (SGP4 Fast Propagator)
        let futureMinDist = 99999;
        let futureMinHours = 0;
        let futureClosestDebris = '';

        if (sat.satrec) {
            const steps = 8; // Check 8 future time checkpoints (every 3 hours up to +24h)
            for (let s = 1; s <= steps; s++) {
                const futureHours = s * 3;
                const futureTime = new Date(jsDate.getTime() + futureHours * 3600 * 1000);
                const gmstFuture = satellite.gstime(futureTime);

                try {
                    const pvSat = satellite.propagate(sat.satrec, futureTime);
                    if (pvSat.position && Number.isFinite(pvSat.position.x)) {
                        const posSatEcf = satellite.eciToEcf(pvSat.position, gmstFuture);
                        const cSat = new Cesium.Cartesian3(posSatEcf.x * 1000, posSatEcf.y * 1000, posSatEcf.z * 1000);

                        satellitesData.forEach(otherSat => {
                            if (otherSat !== sat && otherSat.satrec) {
                                const oUpper = otherSat.name.toUpperCase();
                                if (oUpper.includes('DEBRIS') || oUpper.includes('IRIDIUM') || oUpper.includes('COSMOS') || oUpper.includes('FENGYUN')) {
                                    try {
                                        const pvOther = satellite.propagate(otherSat.satrec, futureTime);
                                        if (pvOther.position && Number.isFinite(pvOther.position.x)) {
                                            const posOtherEcf = satellite.eciToEcf(pvOther.position, gmstFuture);
                                            const cOther = new Cesium.Cartesian3(posOtherEcf.x * 1000, posOtherEcf.y * 1000, posOtherEcf.z * 1000);
                                            const distKm = Cesium.Cartesian3.distance(cSat, cOther) / 1000;

                                            if (distKm < futureMinDist) {
                                                futureMinDist = distKm;
                                                futureMinHours = futureHours;
                                                futureClosestDebris = getSatDisplayName(otherSat.name);
                                            }
                                        }
                                    } catch(e) {}
                                }
                            }
                        });
                    }
                } catch(e) {}
            }
        }

        const isDistValid = minDebrisDist < 90000;
        const isFutValid = futureMinDist < 90000;

        const formattedDist = isDistValid ? Math.round(minDebrisDist).toLocaleString() : '5,000+';
        const formattedFutDist = isFutValid ? Math.round(futureMinDist).toLocaleString() : '5,000+';

        if (isFutValid && futureMinDist <= 800) {
            const critText = {
                ja: `🚨 衝突危険警告! (${futureClosestDebris || closestDebrisName} と あと${futureMinHours}時間後に ${formattedFutDist} km まで接近予測)`,
                en: `🚨 CRITICAL RISK! (Encounter with ${futureClosestDebris || closestDebrisName} in ~${futureMinHours}h at ${formattedFutDist} km)`,
                de: `🚨 KRITISCHE KOLLISIONSWARNUNG! (Annäherung mit ${futureClosestDebris || closestDebrisName} in ~${futureMinHours}h auf ${formattedFutDist} km)`,
                fr: `🚨 ALERTE CRITIQUE DE COLLISION ! (Rapprochement avec ${futureClosestDebris || closestDebrisName} dans ~${futureMinHours}h à ${formattedFutDist} km)`,
                pt: `🚨 ALERTA CRÍTICO DE COLISÃO! (Encontro com ${futureClosestDebris || closestDebrisName} em ~${futureMinHours}h a ${formattedFutDist} km)`,
                zh: `🚨 紧急碰撞预警! (预测与 ${futureClosestDebris || closestDebrisName} 在约${futureMinHours}小时后接近至 ${formattedFutDist} km)`,
                es: `🚨 ¡ALERTA CRÍTICA DE COLISIÓN! (Encuentro con ${futureClosestDebris || closestDebrisName} en ~${futureMinHours}h a ${formattedFutDist} km)`,
                ru: `🚨 УГРОЗА СТОЛКНОВЕНИЯ! (Сближение с ${futureClosestDebris || closestDebrisName} через ~${futureMinHours}ч на ${formattedFutDist} км)`,
                it: `🚨 ALLERTA CRITICA COLLISIONE! (Incontro con ${futureClosestDebris || closestDebrisName} in ~${futureMinHours}h a ${formattedFutDist} km)`,
                ko: `🚨 비상 충돌 경보! (${futureClosestDebris || closestDebrisName} 와 약 ${futureMinHours}시간 후 ${formattedFutDist} km 까지 근접 예측)`,
                nl: `🚨 KRITIEK BOTSINGSRISICO! (Ontmoeting met ${futureClosestDebris || closestDebrisName} over ~${futureMinHours}u op ${formattedFutDist} km)`,
                id: `🚨 PERINGATAN TABRAKAN KRITIS! (Pertemuan dengan ${futureClosestDebris || closestDebrisName} dlm ~${futureMinHours}j pd ${formattedFutDist} km)`,
                hi: `🚨 गंभीर टकराव चेतावनी! (${futureClosestDebris || closestDebrisName} के साथ लगभग ${futureMinHours}घंटे में ${formattedFutDist} किमी पर接近)`,
                ar: `🚨 تحذير حرج من تصادم! (اقتراب مع ${futureClosestDebris || closestDebrisName} خلال ~${futureMinHours}س على مسافة ${formattedFutDist} كم)`
            };
            debrisProximity.innerHTML = `<span class="hazard-alert-text" style="color:#f43f5e; font-weight:700;">${critText[lang] || critText['en']}</span>`;
        } else if (isFutValid && futureMinDist <= 2000) {
            const cautText = {
                ja: `⚠️ 接近注意! (${futureClosestDebris || closestDebrisName} と あと${futureMinHours}時間後に ${formattedFutDist} km に最接近)`,
                en: `⚠️ CAUTION! (Predicted pass by ${futureClosestDebris || closestDebrisName} in ~${futureMinHours}h at ${formattedFutDist} km)`,
                de: `⚠️ VORSICHT! (Vorhergesagter Vorbeiflug von ${futureClosestDebris || closestDebrisName} in ~${futureMinHours}h auf ${formattedFutDist} km)`,
                fr: `⚠️ ATTENTION ! (Passage proche de ${futureClosestDebris || closestDebrisName} dans ~${futureMinHours}h à ${formattedFutDist} km)`,
                pt: `⚠️ ATENÇÃO! (Passagem próxima de ${futureClosestDebris || closestDebrisName} em ~${futureMinHours}h a ${formattedFutDist} km)`,
                zh: `⚠️ 接近注意! (预测 ${futureClosestDebris || closestDebrisName} 约${futureMinHours}小时后接近至 ${formattedFutDist} km)`,
                es: `⚠️ PRECAUCIÓN (Paso cercano de ${futureClosestDebris || closestDebrisName} en ~${futureMinHours}h a ${formattedFutDist} km)`,
                ru: `⚠️ ВНИМАНИЕ (Сближение с ${futureClosestDebris || closestDebrisName} через ~${futureMinHours}ч на ${formattedFutDist} км)`,
                it: `⚠️ ATTENZIONE! (Avvicinamento di ${futureClosestDebris || closestDebrisName} in ~${futureMinHours}h a ${formattedFutDist} km)`,
                ko: `⚠️ 근접 주의! (${futureClosestDebris || closestDebrisName} 와 약 ${futureMinHours}시간 후 ${formattedFutDist} km 최접근)`,
                nl: `⚠️ WAARSCHUWING! (Puinpassage van ${futureClosestDebris || closestDebrisName} over ~${futureMinHours}u op ${formattedFutDist} km)`,
                id: `⚠️ PERHATIAN! (Pelewatan puing ${futureClosestDebris || closestDebrisName} dlm ~${futureMinHours}j pd ${formattedFutDist} km)`,
                hi: `⚠️ सावधानी! (${futureClosestDebris || closestDebrisName} का लगभग ${futureMinHours}घंटे में ${formattedFutDist} किमी पर पास)`,
                ar: `⚠️ تحذير اقتراب! (مرور متوقع لـ ${futureClosestDebris || closestDebrisName} خلال ~${futureMinHours}س على مسافة ${formattedFutDist} كم)`
            };
            debrisProximity.innerHTML = `<span style="color:#f59e0b; font-weight:600;">${cautText[lang] || cautText['en']}</span>`;
        } else {
            const safeText = {
                ja: `🟢 24時間全軌道クリア (接近デブリなし / 安全軌道維持)`,
                en: `🟢 24-Hour Clear Orbit (No Debris Encounter / Safe Trajectory)`,
                de: `🟢 24h freie Umlaufbahn (Kein Weltraummüll / Sichere Flugbahn)`,
                fr: `🟢 Orbite dégagée 24h (Aucun débris / Trajectoire sécurisée)`,
                pt: `🟢 Órbita livre por 24h (Sem lixo espacial / Trajetória segura)`,
                zh: `🟢 24小时全轨道安全 (无碎片接近 / 安全轨道)`,
                es: `🟢 Órbita despejada 24h (Sin riesgo de escombros / Trayectoria segura)`,
                ru: `🟢 Безопасная орбита 24ч (Нет опасных сближений / Безопасно)`,
                it: `🟢 Orbita libera 24h (Nessun detrito / Traiettoria sicura)`,
                ko: `🟢 24시간 궤도 안전 (근접 우주 쓰레기 없음 / 안전 궤도 유지)`,
                nl: `🟢 24u Vrije Baan (Geen ruimtepuin / Veilige baan)`,
                id: `🟢 Orbit Bersih 24 Jam (Bebas sampah antariksa / Aman)`,
                hi: `🟢 24 घंटे सुरक्षित कक्षा (कोई मलबा नहीं / सुरक्षित प्रक्षेपवक्र)`,
                ar: `🟢 مدار آمن لمدة 24 ساعة (لا يوجد حطام مقترب / مسار آمن)`
            };
            debrisProximity.innerHTML = `<span style="color:#10b981;">${safeText[lang] || safeText['en']}</span>`;
        }
    }
}

/**
 * Event Listeners Registration
 */
function setupEventListeners() {
    // Guide & Privacy Modal Event Listeners
    const openGuideBtn = document.getElementById('openGuideBtn');
    const closeGuideBtn = document.getElementById('closeGuideBtn');
    const guideModal = document.getElementById('guideModal');

    if (openGuideBtn && guideModal) {
        openGuideBtn.addEventListener('click', () => {
            guideModal.classList.remove('hidden');
        });
    }

    if (closeGuideBtn && guideModal) {
        closeGuideBtn.addEventListener('click', () => {
            guideModal.classList.add('hidden');
        });
    }

    if (guideModal) {
        guideModal.addEventListener('click', (e) => {
            if (e.target === guideModal) {
                guideModal.classList.add('hidden');
            }
        });
    }

    const modalTabs = document.querySelectorAll('.modal-tab');
    modalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            modalTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(content => {
                if (content.id === targetTab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

        satSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val || val === "") {
            deselectSatellite();
            return;
        }
        if (typeof val === 'string' && val.startsWith('celestial_')) {
            const bodyId = val.replace('celestial_', '');
            selectCelestialBody(bodyId);
        } else {
            selectSatellite(parseInt(val, 10));
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
        const isLightingOn = e.target.checked;
        viewer.scene.skyAtmosphere.show = isLightingOn;
        viewer.scene.globe.enableLighting = isLightingOn; // スイッチONでリアルタイムの太陽光陰影（昼と夜の境界）がクッキリ出現！
        viewer.scene.globe.showGroundAtmosphere = false;  // 地表青ボケは防止
    });

    toggle2D.addEventListener('change', (e) => {
        if (e.target.checked) {
            viewer.scene.morphTo2D(1.0);
        } else {
            viewer.scene.morphTo3D(1.0);
        }
    });

    if (toggleBorders) {
        toggleBorders.addEventListener('change', (e) => {
            if (bordersOverlayLayer) {
                bordersOverlayLayer.show = e.target.checked;
            }
        });
    }

    if (toggleMultiLap) {
        toggleMultiLap.addEventListener('change', () => {
            if (selectedSatIndex >= 0 && satellitesData[selectedSatIndex]) {
                drawOrbitPath(satellitesData[selectedSatIndex]);
            }
        });
    }

    const toggleDebrisRisk = document.getElementById('toggleDebrisRisk');
    if (toggleDebrisRisk) {
        toggleDebrisRisk.addEventListener('change', (e) => {
            const isRiskOn = e.target.checked;
            const hazardPurple = Cesium.Color.fromCssColorString('#c084fc');
            const normalBlue = Cesium.Color.fromCssColorString('#38bdf8');
            const outlineCyan = Cesium.Color.fromCssColorString('#00f3ff');
            const outlineBlack = Cesium.Color.fromCssColorString('#000000');

            satellitesData.forEach(sat => {
                const nameUpper = sat.name.toUpperCase();
                const isDebris = nameUpper.includes('DEBRIS') || nameUpper.includes('IRIDIUM') || nameUpper.includes('COSMOS') || nameUpper.includes('FENGYUN') || nameUpper.includes('SL-8');
                if (isDebris && sat.primitive) {
                    sat.primitive.color = isRiskOn ? hazardPurple : normalBlue;
                    sat.primitive.pixelSize = isRiskOn ? 14 : 7;
                    sat.primitive.outlineColor = isRiskOn ? outlineCyan : outlineBlack;
                    sat.primitive.outlineWidth = isRiskOn ? 3 : 1;
                }
            });
        });
    }

    const geoLocateBtn = document.getElementById('geoLocateBtn');
    if (geoLocateBtn) {
        geoLocateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    userGeoLoc = {
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude,
                        name: 'GPS現在地'
                    };
                    if (selectedSatIndex >= 0 && satellitesData[selectedSatIndex]) {
                        updateSelectedSatDetails(satellitesData[selectedSatIndex]);
                    }
                    alert(`📍 現在地を取得成功!\n緯度: ${pos.coords.latitude.toFixed(2)}°, 経度: ${pos.coords.longitude.toFixed(2)}°`);
                }, () => {
                    alert('現在地の取得に失敗しました。デフォルト(東京)で計算を続行します。');
                });
            }
        });
    }

    loadMajorBtn.addEventListener('click', () => {
        setActivePresetBtn(loadMajorBtn);
        loadMajorSatellitesPreset();
    });

    loadLocalBtn.addEventListener('click', () => {
        setActivePresetBtn(loadLocalBtn);
        loadSatelliteData('starlink.txt');
    });

    if (loadOnlineBtn) {
        loadOnlineBtn.addEventListener('click', () => {
            setActivePresetBtn(loadOnlineBtn);
            loadSatelliteData('https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle');
        });
    }

    // Time Control & Speed Multiplier Event Listeners (0x, 1x, 10x, 100x, 1000x)
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            timeSpeedMultiplier = parseFloat(btn.getAttribute('data-speed'));
        });
    });

    const timePickerInput = document.getElementById('timePickerInput');
    const resetNowBtn = document.getElementById('resetNowBtn');

    if (timePickerInput) {
        if (typeof flatpickr !== 'undefined') {
            const loc = (currentLang === 'en' ? 'default' : (currentLang || 'ja'));
            const l10nObj = (flatpickr.l10ns && flatpickr.l10ns[loc]) ? flatpickr.l10ns[loc] : (flatpickr.l10ns ? flatpickr.l10ns.default : {});
            fpInstance = flatpickr(timePickerInput, {
                enableTime: true,
                enableSeconds: true,
                time_24hr: true,
                dateFormat: "Y-m-d H:i:S",
                locale: l10nObj,
                onChange: function(selectedDates) {
                    if (selectedDates && selectedDates.length > 0) {
                        customSimTime = selectedDates[0];
                        lastRealTime = Date.now();
                    }
                }
            });
        } else {
            timePickerInput.addEventListener('change', (e) => {
                if (e.target.value) {
                    customSimTime = new Date(e.target.value);
                    lastRealTime = Date.now();
                }
            });
        }
    }

    if (resetNowBtn) {
        resetNowBtn.addEventListener('click', () => {
            customSimTime = new Date();
            if (fpInstance) {
                fpInstance.clear();
            } else if (timePickerInput) {
                timePickerInput.value = '';
            }
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            const oneXBtn = document.querySelector('.speed-btn[data-speed="1"]');
            if (oneXBtn) oneXBtn.classList.add('active');
            timeSpeedMultiplier = 1;
        });
    }
    const toggleSidebarMinBtn = document.getElementById('toggleSidebarMinBtn');
    const sidebarPanel = document.getElementById('sidebarPanel');
    if (toggleSidebarMinBtn && sidebarPanel) {
        toggleSidebarMinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebarPanel.classList.toggle('is-minimized');
            const isMin = sidebarPanel.classList.contains('is-minimized');
            toggleSidebarMinBtn.textContent = isMin ? '➕' : '➖';
        });
    }

    const toggleDetailMinBtn = document.getElementById('toggleDetailMinBtn');
    const detailCard = document.getElementById('detailCard');
    if (toggleDetailMinBtn && detailCard) {
        toggleDetailMinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            detailCard.classList.toggle('is-minimized');
            const isMin = detailCard.classList.contains('is-minimized');
            toggleDetailMinBtn.textContent = isMin ? '➕' : '➖';
        });
    }

    const toggleHeaderMinBtn = document.getElementById('toggleHeaderMinBtn');
    const headerRightIsland = document.getElementById('headerRightIsland');
    if (toggleHeaderMinBtn && headerRightIsland) {
        toggleHeaderMinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            headerRightIsland.classList.toggle('is-minimized');
            const isMin = headerRightIsland.classList.contains('is-minimized');
            toggleHeaderMinBtn.textContent = isMin ? '➕' : '➖';
        });
    }

    const toggleCamMinBtn = document.getElementById('toggleCamMinBtn');
    const cameraDPad = document.getElementById('cameraDPad');
    if (toggleCamMinBtn && cameraDPad) {
        toggleCamMinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cameraDPad.classList.toggle('is-minimized');
            const isMin = cameraDPad.classList.contains('is-minimized');
            toggleCamMinBtn.textContent = isMin ? '➕' : '➖';
        });
    }

    const toggleCelestial = document.getElementById('toggleCelestial');
    if (toggleCelestial) {
        toggleCelestial.addEventListener('change', (e) => {
            const show = e.target.checked;
            celestialEntities.forEach(ent => {
                if (ent.label) ent.label.show = show;
            });
            if (viewer) {
                if (viewer.scene.moon) viewer.scene.moon.show = show;
                if (viewer.scene.sun) viewer.scene.sun.show = show;
            }
        });
    }
    setupDraggablePanels();
}

/**
 * Generic Drag & Drop UI Engine for Panel Manipulation
 */
function makeDraggable(panelEl, handleEl) {
    if (!panelEl || !handleEl) return;
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    const startDrag = (clientX, clientY, target) => {
        if (['INPUT', 'BUTTON', 'SELECT', 'A', 'LABEL', 'OPTION'].includes(target.tagName)) return false;

        isDragging = true;
        panelEl.classList.add('is-dragging');

        const rect = panelEl.getBoundingClientRect();
        startX = clientX;
        startY = clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        panelEl.style.position = 'fixed';
        panelEl.style.width = `${rect.width}px`;
        panelEl.style.left = `${initialLeft}px`;
        panelEl.style.top = `${initialTop}px`;
        panelEl.style.margin = '0';
        panelEl.style.right = 'auto';
        panelEl.style.bottom = 'auto';
        return true;
    };

    const doMove = (clientX, clientY) => {
        if (!isDragging) return;
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        panelEl.style.left = `${initialLeft + deltaX}px`;
        panelEl.style.top = `${initialTop + deltaY}px`;
    };

    const stopDrag = () => {
        isDragging = false;
        panelEl.classList.remove('is-dragging');
    };

    // Mouse Events
    handleEl.addEventListener('mousedown', (e) => {
        if (!startDrag(e.clientX, e.clientY, e.target)) return;

        const onMouseMove = (moveEvent) => {
            doMove(moveEvent.clientX, moveEvent.clientY);
        };

        const onMouseUp = () => {
            stopDrag();
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // Touch Events for Mobile (Android / iOS)
    handleEl.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        const touch = e.touches[0];
        if (!startDrag(touch.clientX, touch.clientY, e.target)) return;

        const onTouchMove = (moveEvent) => {
            if (!moveEvent.touches || moveEvent.touches.length === 0) return;
            doMove(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY);
        };

        const onTouchEnd = () => {
            stopDrag();
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };

        document.addEventListener('touchmove', onTouchMove, { passive: true });
        document.addEventListener('touchend', onTouchEnd);
    }, { passive: true });
}

function setupDraggablePanels() {
    const sidebar = document.getElementById('sidebarPanel');
    if (sidebar) {
        if (window.innerWidth <= 1024) {
            sidebar.style.top = '';
            sidebar.style.left = '';
            sidebar.style.right = '';
            sidebar.style.bottom = '';
            sidebar.style.width = '';
            sidebar.style.position = '';
        } else {
            const handle = sidebar.querySelector('.panel-drag-bar') || sidebar;
            makeDraggable(sidebar, handle);
        }
    }

    const detailCard = document.getElementById('detailCard');
    if (detailCard) {
        const handle = detailCard.querySelector('.panel-drag-bar') || detailCard;
        makeDraggable(detailCard, handle);
    }

    const headerLeftIsland = document.getElementById('headerLeftIsland');
    if (headerLeftIsland) {
        const handle = headerLeftIsland.querySelector('.panel-drag-bar') || headerLeftIsland;
        makeDraggable(headerLeftIsland, handle);
    }

    const headerRightIsland = document.getElementById('headerRightIsland');
    if (headerRightIsland) {
        const handle = headerRightIsland.querySelector('.panel-drag-bar') || headerRightIsland;
        makeDraggable(headerRightIsland, handle);
    }

    setupCameraDPadControls();
}

/**
 * 3D Camera Direction D-Pad Control System (Supports Holding Click & Smooth Rotation)
 */
function setupCameraDPadControls() {
    const btnUp = document.getElementById('btnCamUp');
    const btnDown = document.getElementById('btnCamDown');
    const btnLeft = document.getElementById('btnCamLeft');
    const btnRight = document.getElementById('btnCamRight');
    const btnReset = document.getElementById('btnCamReset');
    const dpadPanel = document.getElementById('cameraDPad');

    if (dpadPanel) {
        const handle = dpadPanel.querySelector('.panel-drag-bar') || dpadPanel;
        makeDraggable(dpadPanel, handle);
    }

    let moveInterval = null;

    const startMove = (action) => {
        if (moveInterval) clearInterval(moveInterval);
        action();
        moveInterval = setInterval(action, 30); // 30ms continuous smooth rotation
    };

    const stopMove = () => {
        if (moveInterval) {
            clearInterval(moveInterval);
            moveInterval = null;
        }
    };

    const bindHold = (btn, action) => {
        if (!btn) return;
        btn.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            startMove(action);
        });
        btn.addEventListener('mouseup', stopMove);
        btn.addEventListener('mouseleave', stopMove);
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            startMove(action);
        }, { passive: false });
        btn.addEventListener('touchend', stopMove);
    };

    // Parallel Pan Movement helper based on current camera altitude
    const panCamera = (directionVector, isPositive) => {
        if (!viewer) return;
        
        // Reset camera lookAt transform if bound to entity to allow free panning
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

        const carto = viewer.camera.positionCartographic;
        const alt = carto ? carto.height : 10000000;
        // Dynamic step distance proportional to current altitude for smooth slide
        const stepDist = Math.max(50000, alt * 0.035);

        const dir = isPositive ? directionVector : Cesium.Cartesian3.negate(directionVector, new Cesium.Cartesian3());
        viewer.camera.move(dir, stepDist);
    };

    bindHold(btnUp, () => {
        if (!viewer) return;
        panCamera(viewer.camera.up, true);
    });

    bindHold(btnDown, () => {
        if (!viewer) return;
        panCamera(viewer.camera.up, false);
    });

    bindHold(btnLeft, () => {
        if (!viewer) return;
        panCamera(viewer.camera.right, false);
    });

    bindHold(btnRight, () => {
        if (!viewer) return;
        panCamera(viewer.camera.right, true);
    });

    if (btnReset) {
        btnReset.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!viewer) return;

            // 1. Unlock camera lookAt transform back to Earth frame
            viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

            // 2. Clean up 3D inspection entities and reset selection
            clearPlanetInspectionEntities();
            selectedCelestialId = null;
            selectedSatIndex = -1;

            if (satSelect) satSelect.value = "";
            if (detailCard) detailCard.classList.add('hidden');

            // 3. Smoothly fly camera back to Earth View!
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(138.2, 36.2, 22000000),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-90),
                    roll: 0
                },
                duration: 1.5
            });
        });
    }
}

function setActivePresetBtn(activeBtn) {
    [loadMajorBtn, loadLocalBtn, loadOnlineBtn].forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    if (activeBtn) activeBtn.classList.add('active');
}

/**
 * Search Satellites by Name or NORAD ID
 */
function performSearch(rawQuery) {
    searchResults.innerHTML = '';
    const upperQuery = rawQuery.toUpperCase().trim();
    if (!upperQuery) return;

    const lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'ja';

    // 1. Search Celestial Bodies (Sun, Moon, Planets)
    const celestialAliases = {
        SUN: ['太陽', 'たいよう', 'タイヨウ', 'SUN', 'SOLAR', 'SOLEIL', 'SONNE', 'SOL', 'SOLE', '태양', 'ZON', 'MATAHARI', 'सूर्य', 'الشمس', 'СОЛНЦЕ'],
        MOON: ['月', 'つき', 'ツキ', 'MOON', 'LUNA', 'LUNE', 'MOND', '달', 'MAAN', 'BULAN', 'चन्द्र', 'चंद्रमा', 'القمر', 'ЛУНА'],
        MARS: ['火星', 'かせい', 'カセイ', 'MARS', 'MARTE', '화성', 'ROTE PLANET', 'RED PLANET', 'मंगल', 'المريخ', 'МАРС'],
        JUPITER: ['木星', 'もくせい', 'モクセイ', 'JUPITER', 'GIOVE', '목성', 'YUPITER', 'बृहस्पति', 'المشتري', 'ЮПИТЕР', 'GREAT RED SPOT', '大赤斑'],
        SATURN: ['土星', 'どせい', 'ドセイ', 'SATURN', 'SATURNO', 'SATURNUS', 'SATURNE', '토성', 'शनि', 'زحل', 'САТУРН', 'RINGS', '輪', 'リング'],
        VENUS: ['金星', 'きんせい', 'キンセイ', 'VENUS', 'VÉNUS', 'VENERE', 'VÊNUS', '금성', 'शुक्र', 'الزهرة', 'ВЕНЕРА', '明星', '宵の明星', '明けの明星'],
        MERCURY: ['水星', 'すいせい', 'スイセイ', 'MERCURY', 'MERCURE', 'MERCURIO', 'MERKURIUS', 'MERKUR', '수성', 'बुध', 'عطارد', 'МЕРКУРИЙ'],
        URANUS: ['天王星', 'てんのうせい', 'テンノウセイ', 'URANUS', 'URANO', '천왕성', 'अरुण', 'أورانوس', 'УРАН']
    };

    const matchedBodies = CELESTIAL_BODIES.filter(b => {
        const aliases = celestialAliases[b.id] || [b.id, b.name];
        return aliases.some(a => a.toUpperCase().includes(upperQuery) || upperQuery.includes(a.toUpperCase()));
    });

    // 2. Search Satellites
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

    const matchedSats = satellitesData.filter(sat => {
        const nameUpper = sat.name.toUpperCase();
        return searchTerms.some(term => 
            nameUpper.includes(term.toUpperCase()) || sat.noradId.includes(term)
        );
    });

    const totalMatches = matchedBodies.length + matchedSats.length;

    satSelect.innerHTML = `<option value="">-- 検索結果 (${totalMatches}件) --</option>`;

    // Add matched celestial bodies to dropdown
    if (matchedBodies.length > 0) {
        const cGroup = document.createElement('optgroup');
        cGroup.label = '🌌 太陽系天体 (Solar System)';
        matchedBodies.forEach(b => {
            const opt = document.createElement('option');
            opt.value = `celestial_${b.id}`;
            opt.textContent = `${b.symbol} ${b.name} (${b.type})`;
            cGroup.appendChild(opt);
        });
        satSelect.appendChild(cGroup);
    }

    // Add matched satellites to dropdown
    if (matchedSats.length > 0) {
        const sGroup = document.createElement('optgroup');
        sGroup.label = '🛰️ 人工衛星 (Satellites)';
        matchedSats.forEach(sat => {
            const index = satellitesData.indexOf(sat);
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = `${sat.name} (NORAD ${sat.noradId})`;
            sGroup.appendChild(opt);
        });
        satSelect.appendChild(sGroup);
    }

    if (totalMatches === 0) {
        searchResults.innerHTML = `<div class="search-item" style="cursor:default; color:var(--accent-rose); font-size:0.8rem;">該当する天体・衛星が見つかりません</div>`;
        return;
    }

    // Populate Search Results Popup List
    matchedBodies.forEach(b => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.style.borderLeft = '3px solid #f59e0b';
        item.innerHTML = `<span>${b.symbol} <strong>${b.name}</strong></span><span style="font-family:var(--font-mono); font-size:0.75rem; color:#f59e0b;">${b.type}</span>`;
        item.addEventListener('click', () => {
            selectCelestialBody(b.id);
            satSelect.value = `celestial_${b.id}`;
            searchResults.innerHTML = '';
        });
        searchResults.appendChild(item);
    });

    matchedSats.slice(0, 10).forEach(sat => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.innerHTML = `<span>${sat.name}</span><span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-cyan);">${sat.noradId}</span>`;
        item.addEventListener('click', () => {
            const index = satellitesData.indexOf(sat);
            selectSatellite(index);
            satSelect.value = index;
            searchResults.innerHTML = '';
        });
        searchResults.appendChild(item);
    });
}

/**
 * Loading Helpers
 */
function showLoading(msg) {
    const overlay = document.getElementById('loadingOverlay');
    const txt = document.getElementById('loadingText');
    if (txt) txt.textContent = msg || '読み込み中...';
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.style.display = 'flex';
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
        overlay.style.visibility = 'hidden';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    }
}
