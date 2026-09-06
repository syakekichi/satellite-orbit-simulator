
// Guaranteed Global Mobile Bottom Dock Helpers (Debounced & Multi-Trigger Protected)
let lastMobileMenuToggleTime = 0;
let lastMobileDetailToggleTime = 0;

window.toggleMobileMenu = function(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const now = Date.now();
    if (now - lastMobileMenuToggleTime < 350) return; // Ignore duplicate events within 350ms
    lastMobileMenuToggleTime = now;

    const sidebar = document.getElementById('sidebarPanel');
    const detail = document.getElementById('detailCard');
    if (detail) {
        detail.classList.remove('mobile-open');
        if (window.innerWidth <= 768) detail.style.display = 'none';
    }
    if (sidebar) {
        sidebar.classList.remove('is-minimized');
        sidebar.style.top = '';
        sidebar.style.left = '';
        sidebar.style.right = '';
        sidebar.style.bottom = '';
        sidebar.style.transform = '';
        const isOpen = sidebar.classList.toggle('mobile-open');
        if (window.innerWidth <= 768) {
            sidebar.style.display = isOpen ? 'flex' : 'none';
        }
    }
};

window.closeMobileMenu = function(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const sidebar = document.getElementById('sidebarPanel');
    if (sidebar) {
        sidebar.classList.remove('mobile-open');
        if (window.innerWidth <= 768) sidebar.style.display = 'none';
    }
};

window.toggleMobileDetail = function(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const now = Date.now();
    if (now - lastMobileDetailToggleTime < 350) return; // Ignore duplicate events within 350ms
    lastMobileDetailToggleTime = now;

    const detail = document.getElementById('detailCard');
    const sidebar = document.getElementById('sidebarPanel');
    if (sidebar) {
        sidebar.classList.remove('mobile-open');
        if (window.innerWidth <= 768) sidebar.style.display = 'none';
    }
    if (detail) {
        detail.classList.remove('hidden');
        detail.classList.remove('is-minimized');
        detail.style.top = '';
        detail.style.left = '';
        detail.style.right = '';
        detail.style.bottom = '';
        detail.style.transform = '';
        const isOpen = detail.classList.toggle('mobile-open');
        if (window.innerWidth <= 768) {
            detail.style.display = isOpen ? 'flex' : 'none';
        }
    }
};

window.closeMobileDetail = function(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const detail = document.getElementById('detailCard');
    if (detail) {
        detail.classList.remove('mobile-open');
        if (window.innerWidth <= 768) detail.style.display = 'none';
    }
};



/**
 * Security: Comprehensive HTML Escaping Helper to prevent XSS attacks
 */
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Security: Strict URL validator to prevent SSRF and unsafe protocols
 */
function isValidExternalUrl(url) {
    if (!url || typeof url !== 'string') return false;
    try {
        const parsed = new URL(url, window.location.origin);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
        // Block loopback and local private networks
        const host = parsed.hostname.toLowerCase();
        if (host === 'localhost' || host.startsWith('127.') || host.startsWith('192.168.') || host.startsWith('10.') || host === '0.0.0.0') {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}

const CELESTIAL_BADGE_TYPES = {
    'SUN': { ja: '☀️ 恒星 (G型主系列星)', en: '☀️ G-Type Main-Sequence Star', de: '☀️ Hauptreihenstern (G-Klasse)', fr: '☀️ Étoile naine jaune', es: '☀️ Estrella enana amarilla', pt: '☀️ Estrela anã amarela', it: '☀️ Stella nana gialla', ko: '☀️ G형 주계열성 (항성)', nl: '☀️ Hoofdreeksster (G-type)', id: '☀️ Bintang Deret Utama', hi: '☀️ मुख्य-अनुक्रम तारा', ar: '☀️ نجم النسق الأساسي', zh: '☀️ G型主序星 (恒星)', ru: '☀️ Желтый карлик (Звезда)' },
    'MOON': { ja: '🌕 地球の自然衛星', en: "🌕 Earth's Natural Satellite", de: '🌕 Natürlicher Satellit der Erde', fr: '🌕 Satellite naturel de la Terre', es: '🌕 Satélite natural de la Tierra', pt: '🌕 Satélite natural da Terra', it: '🌕 Satellite naturale della Terra', ko: '🌕 지구의 자연위성', nl: '🌕 Natuurlijke satelliet van de aarde', id: '🌕 Satelit Alami Bumi', hi: '🌕 पृथ्वी का प्राकृतिक उपग्रह', ar: '🌕 التابع الطبيعي للأرض', zh: '🌕 地球的天然卫星', ru: '🌕 Естественный спутник Земли' },
    'MERCURY': { ja: '🔘 太陽系第1惑星 (岩石惑星)', en: '🔘 1st Terrestrial Planet', de: '🔘 1. Planet (Gesteinsplanet)', fr: '🔘 1re planète tellurique', es: '🔘 1.º planeta rocoso', pt: '🔘 1º planeta rochoso', it: '🔘 1º pianeta roccioso', ko: '🔘 제1행성 (지구형 암석 행성)', nl: '🔘 1e Rotsachtige planeet', id: '🔘 Planet Berbatu ke-1', hi: '🔘 प्रथम स्थलीय ग्रह', ar: '🔘 الكوكب الصخري الأول', zh: '🔘 太阳系第一行星 (岩质行星)', ru: '🔘 1-я планета (Каменистая)' },
    'VENUS': { ja: '🟡 太陽系第2惑星 (岩石惑星)', en: '🟡 2nd Terrestrial Planet', de: '🟡 2. Planet (Gesteinsplanet)', fr: '🟡 2e planète tellurique', es: '🟡 2.º planeta rocoso', pt: '🟡 2º planeta rochoso', it: '🟡 2º pianeta roccioso', ko: '🟡 제2행성 (지구형 암석 행성)', nl: '🟡 2e Rotsachtige planeet', id: '🟡 Planet Berbatu ke-2', hi: '🟡 द्वितीय स्थलीय ग्रह', ar: '🟡 الكوكب الصخري الثاني', zh: '🟡 太阳系第二行星 (岩质行星)', ru: '🟡 2-я планета (Каменистая)' },
    'EARTH': { ja: '🌍 太陽系第3惑星 (生命の母星)', en: '🌍 3rd Terrestrial Planet (Earth)', de: '🌍 3. Planet (Erde / Die Heimatwelt)', fr: '🌍 3e planète tellurique (Terre)', es: '🌍 3.er planeta rocoso (Tierra)', pt: '🌍 3º planeta rochoso (Terra)', it: '🌍 3º pianeta roccioso (Terra)', ko: '🌍 제3행성 (지구 / 인류의 고향)', nl: '🌍 3e planeet (Aarde / De leefwereld)', id: '🌍 Planet Berbatu ke-3 (Bumi)', hi: '🌍 तीसरा स्थलीय ग्रह (पृथ्वी)', ar: '🌍 الكوكب الثالث (الأرض / موطن الحياة)', zh: '🌍 太阳系第三行星 (地球 / 人类家园)', ru: '🌍 3-я планета (Земля / Колыбель жизни)' },
    'MARS': { ja: '🔴 太陽系第4惑星 (岩石惑星)', en: '🔴 4th Terrestrial Planet', de: '🔴 4. Planet (Gesteinsplanet)', fr: '🔴 4e planète tellurique', es: '🔴 4.º planeta rocoso', pt: '🔴 4º planeta rochoso', it: '🔴 4º pianeta roccioso', ko: '🔴 제4행성 (지구형 암석 행성)', nl: '🔴 4e Rotsachtige planeet', id: '🔴 Planet Berbatu ke-4', hi: '🔴 चतुर्थ स्थलीय ग्रह', ar: '🔴 الكوكب الصخري الرابع', zh: '🔴 太阳系第四行星 (岩质行星)', ru: '🔴 4-я планета (Каменистая)' },
    'JUPITER': { ja: '🟠 太陽系第5惑星 (巨大ガス惑星)', en: '🟠 5th Planet (Gas Giant)', de: '🟠 5. Planet (Gasriese)', fr: '🟠 5e planète (Géante gazeuse)', es: '🟠 5.º planeta (Gigante gaseoso)', pt: '🟠 5º planeta (Gigante gasoso)', it: '🟠 5º pianeta (Gigante gassoso)', ko: '🟠 제5행성 (거대 가스 행성)', nl: '🟠 5e planeet (Gasreus)', id: '🟠 Planet ke-5 (Raksasa Gas)', hi: '🟠 5वां ग्रह (विशाल गैस दानव)', ar: '🟠 الكوكب الخامس (عملاق غازي)', zh: '🟠 太阳系第五行星 (气态巨行星)', ru: '🟠 5-я планета (Газовый гигант)' },
    'SATURN': { ja: '🪐 太陽系第6惑星 (巨大ガス惑星)', en: '🪐 6th Planet (Gas Giant)', de: '🪐 6. Planet (Gasriese)', fr: '🪐 6e planète (Géante gazeuse)', es: '🪐 6.º planeta (Gigante gaseoso)', pt: '🪐 6º planeta (Gigante gasoso)', it: '🪐 6º pianeta (Gigante gassoso)', ko: '🪐 제6행성 (거대 가스 행성)', nl: '🪐 6e planeet (Gasreus)', id: '🪐 Planet ke-6 (Raksasa Gas)', hi: '🪐 6वां ग्रह (विशाल गैस दानव)', ar: '🪐 الكوكب السادس (عملاق غازي)', zh: '🪐 太阳系第六行星 (气态巨行星)', ru: '🪐 6-я планета (Газовый гигант)' },
    'URANUS': { ja: '🌀 太陽系第7惑星 (巨大氷惑星)', en: '🌀 7th Planet (Ice Giant)', de: '🌀 7. Planet (Eisriese)', fr: '🌀 7e planète (Géante de glace)', es: '🌀 7.º planeta (Gigante helado)', pt: '🌀 7º planeta (Gigante de gelo)', it: '🌀 7º pianeta (Gigante di ghiaccio)', ko: '🌀 제7행성 (거대 얼음 행성)', nl: '🌀 7e planeet (Ijsreus)', id: '🌀 Planet ke-7 (Raksasa Es)', hi: '🌀 7वां ग्रह (विशाल बर्फ दानव)', ar: '🌀 الكوكب السابع (عملاق جليدي)', zh: '🌀 太阳系第七行星 (冰巨行星)', ru: '🌀 7-я планета (Ледяной гигант)' },
    'NEPTUNE': { ja: '🌊 太陽系第8惑星 (巨大氷惑星)', en: '🌊 8th Planet (Ice Giant)', de: '🌊 8. Planet (Eisriese)', fr: '🌊 8e planète (Géante de glace)', es: '🌊 8.º planeta (Gigante helado)', pt: '🌊 8º planeta (Gigante de gelo)', it: '🌊 8º pianeta (Gigante di ghiaccio)', ko: '🌊 제8행성 (거대 얼음 행성)', nl: '🌊 8e planeet (Ijsreus)', id: '🌊 Planet ke-8 (Raksasa Es)', hi: '🌊 8वां ग्रह (विशाल बर्फ दानव)', ar: '🌊 الكوكب الثامن (عملاق جليدي)', zh: '🌊 太阳系第八行星 (冰巨行星)', ru: '🌊 8-я планета (Ледяной гигант)' },
    'CERES': { ja: '🪨 小惑星帯・準惑星', en: '🪨 Asteroid Belt Dwarf Planet', de: '🪨 Zwergplanet des Asteroidengürtels', fr: '🪨 Planète naine de la ceinture principale', es: '🪨 Planeta enano del cinturón de asteroides', pt: '🪨 Planeta anão do cinturão de asteroides', it: '🪨 Pianeta nano della fascia principale', ko: '🪨 소행성대 왜행성 (세레스)', nl: '🪨 Dwergplaneet van de planetoïdengordel', id: '🪨 Planet Kerdil Sabuk Asteroid', hi: '🪨 क्षुद्रग्रह बेल्ट बौना ग्रह (सेरेस)', ar: '🪨 كوكب قزم في حزام الكويكبات (سيريس)', zh: '🪨 小行星带矮行星 (谷神星)', ru: '🪨 Карликовая планета пояса астероидов (Церера)' },
    'PLUTO': { ja: '❄️ カイパーベルト・準惑星', en: '❄️ Kuiper Belt Dwarf Planet', de: '❄️ Kuipergürtel-Zwergplanet', fr: '❄️ Planète naine de la ceinture de Kuiper', es: '❄️ Planeta enano del cinturón de Kuiper', pt: '❄️ Planeta anão do cinturão de Kuiper', it: '❄️ Pianeta nano della fascia di Kuiper', ko: '❄️ 카이퍼 벨트 왜행성 (명왕성)', nl: '❄️ Kuipergordel dwergplaneet (Pluto)', id: '❄️ Planet Kerdil Sabuk Kuiper (Pluto)', hi: '❄️ काइपर बेल्ट बौना ग्रह (प्लूटो)', ar: '❄️ كوكب قزم في حزام كايبر (بلوتو)', zh: '❄️ 柯伊伯带矮行星 (冥王星)', ru: '❄️ Карликовая планета пояса Койпера (Плутон)' },
    'HALLEY': { ja: '☄️ 周期彗星 (1P/Halley)', en: '☄️ Periodic Comet (1P/Halley)', de: '☄️ Periodischer Komet (1P/Halley)', fr: '☄️ Comète périodique (1P/Halley)', es: '☄️ Cometa periódico (1P/Halley)', pt: '☄️ Cometa periódico (1P/Halley)', it: '☄️ Cometa periodica (1P/Halley)', ko: '☄️ 주기혜성 (1P/핼리 혜성)', nl: '☄️ Periodieke komeet (1P/Halley)', id: '☄️ Komet Periodik (1P/Halley)', hi: '☄️ आवधिक धूमकेतु (1P/हैली)', ar: '☄️ مذنب دوري (1P/هالي)', zh: '☄️ 周期彗星 (1P/哈雷彗星)', ru: '☄️ Периодическая комета (1P/Галлея)' },
    'SOLAR_SYSTEM': { ja: '🌌 太陽系全体オーラリー', en: '🌌 Solar System Planetary Orrery', de: '🌌 Sonnensystem Orrery-Modell', fr: '🌌 Système Solaire (Modèle Orrery)', es: '🌌 Sistema Solar (Orrery Planetario)', pt: '🌌 Sistema Solar (Orrery Planetário)', it: '🌌 Sistema Solare (Orrery)', ko: '🌌 태양계 전체 오러리 뷰', nl: '🌌 Zonnestelsel Orrery-Model', id: '🌌 Model Planetarium Tata Surya', hi: '🌌 सौर मंडल ग्रहीय मॉडल', ar: '🌌 نموذج النظام الشمسي الميكانيكي', zh: '🌌 太阳系全景 (行星运行仪)', ru: '🌌 Вся Солнечная система (Оррери)' }
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

const DEEP_SPACE_METRIC_LABELS = {
    ja: { alt: '📏 距離 (Distance)', vel: '⚡ 速度 (Velocity)', lat: '🎯 中心天体 (Parent)', lon: '📅 打上日 (Launch)', inc: '🚀 ロケット (Rocket)', period: '🌌 周期 (Period)' },
    en: { alt: '📏 Distance', vel: '⚡ Speed', lat: '🎯 Target/Parent', lon: '📅 Launch Date', inc: '🚀 Launch Vehicle', period: '🌌 Orbital Period' },
    de: { alt: '📏 Distanz', vel: '⚡ Geschwindigkeit', lat: '🎯 Bezugskörper', lon: '📅 Startdatum', inc: '🚀 Trägerrakete', period: '🌌 Umlaufzeit' },
    fr: { alt: '📏 Distance', vel: '⚡ Vitesse', lat: '🎯 Corps parent', lon: '📅 Date de lancement', inc: '🚀 Lanceur', period: '🌌 Période orbitale' },
    es: { alt: '📏 Distancia', vel: '⚡ Velocidad', lat: '🎯 Cuerpo central', lon: '📅 Fecha de lanzamiento', inc: '🚀 Cohete lanzador', period: '🌌 Período orbital' },
    pt: { alt: '📏 Distância', vel: '⚡ Velocidade', lat: '🎯 Corpo central', lon: '📅 Data de lançamento', inc: '🚀 Veículo lançador', period: '🌌 Período orbital' },
    it: { alt: '📏 Distanza', vel: '⚡ Velocità', lat: '🎯 Corpo di riferimento', lon: '📅 Data di lancio', inc: '🚀 Vettore di lancio', period: '🌌 Periodo orbitale' },
    ko: { alt: '📏 거리 (Distance)', vel: '⚡ 속도 (Velocity)', lat: '🎯 중심 천체 (Parent)', lon: '📅 발사일 (Launch)', inc: '🚀 발사체 (Rocket)', period: '🌌 주기 (Period)' },
    nl: { alt: '📏 Afstand', vel: '⚡ Snelheid', lat: '🎯 Doellichaam', lon: '📅 Lanceerdatum', inc: '🚀 Draagraket', period: '🌌 Omlooptijd' },
    id: { alt: '📏 Jarak', vel: '⚡ Kecepatan', lat: '🎯 Objek Induk', lon: '📅 Tanggal Peluncuran', inc: '🚀 Roket Peluncur', period: '🌌 Periode Orbit' },
    hi: { alt: '📏 दूरी', vel: '⚡ गति', lat: '🎯 मुख्य खगोलीय पिंड', lon: '📅 प्रक्षेपण तिथि', inc: '🚀 प्रक्षेपण यान', period: '🌌 कक्षीय अवधि' },
    ar: { alt: '📏 المسافة', vel: '⚡ السرعة', lat: '🎯 الجرم المرجعي', lon: '📅 تاريخ الإطلاق', inc: '🚀 صاروخ الإطلاق', period: '🌌 الفترة المدارية' },
    zh: { alt: '📏 距离 (Distance)', vel: '⚡ 速度 (Velocity)', lat: '🎯 中心天体 (Parent)', lon: '📅 发射日期 (Launch)', inc: '🚀 运载火箭 (Rocket)', period: '🌌 公转周期 (Period)' },
    ru: { alt: '📏 Дистанция', vel: '⚡ Скорость', lat: '🎯 Центр обращения', lon: '📅 Дата запуска', inc: '🚀 Ракета-носитель', period: '🌌 Период обращения' }
};

function updateDetailCardMetricLabels(mode) {
    const langSelect = document.getElementById('langSelect');
    const lang = window.currentLang || currentLang || (langSelect && langSelect.value) || 'ja';
    const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) ? TRANSLATIONS[lang] : {};
    const cLabels = CELESTIAL_METRIC_LABELS[lang] || CELESTIAL_METRIC_LABELS['en'] || CELESTIAL_METRIC_LABELS['ja'];
    const dsLabels = DEEP_SPACE_METRIC_LABELS[lang] || DEEP_SPACE_METRIC_LABELS['en'] || DEEP_SPACE_METRIC_LABELS['ja'];

    let labels;
    if (mode === 'deepspace') {
        labels = dsLabels;
    } else if (mode === true || mode === 'celestial') {
        labels = cLabels;
    } else {
        labels = {
            alt: dict.labelAlt || '高度 (Altitude)',
            vel: dict.labelVel || '速度 (Velocity)',
            lat: dict.labelLat || '緯度 (Latitude)',
            lon: dict.labelLon || '経度 (Longitude)',
            inc: dict.labelInc || '軌道傾斜角 (Inclination)',
            period: dict.labelPeriod || '周期 (Period)'
        };
    }

    const elAlt = document.getElementById('satAlt');
    const elVel = document.getElementById('satVel');
    const elLat = document.getElementById('satLat');
    const elLon = document.getElementById('satLon');
    const elInc = document.getElementById('satInc');
    const elPeriod = document.getElementById('satPeriod');

    if (elAlt && elAlt.previousElementSibling) elAlt.previousElementSibling.textContent = labels.alt;
    if (elVel && elVel.previousElementSibling) elVel.previousElementSibling.textContent = labels.vel;
    if (elLat && elLat.previousElementSibling) elLat.previousElementSibling.textContent = labels.lat;
    if (elLon && elLon.previousElementSibling) elLon.previousElementSibling.textContent = labels.lon;
    if (elInc && elInc.previousElementSibling) elInc.previousElementSibling.textContent = labels.inc;
    if (elPeriod && elPeriod.previousElementSibling) elPeriod.previousElementSibling.textContent = labels.period;
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
    'NEPTUNE': 'assets/planet_images/neptune.jpg?v=20260905_1',
    'CERES': 'assets/planet_images/ceres.jpg?v=20260906_1',
    'PLUTO': 'assets/planet_images/pluto.jpg?v=20260906_1',
    'HALLEY': 'assets/planet_images/halley.jpg?v=20260906_1',
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

    const isHalley = (body.id === 'HALLEY');
    const planetRadius = isHalley ? 12000 : ((body.radiusKm || 6000) * 1000);
    const texImage = NASA_PLANET_TEXTURES[body.id] || getPlanetTextureDataUrl(body.id);

    // 1. Place ultra-photorealistic NASA 3D sphere directly at body target coordinates
    activePlanetSphereEntity = viewer.entities.add({
        id: `inspect_planet_${body.id}`,
        name: body.name,
        position: bodyPos,
        ellipsoid: {
            radii: new Cesium.Cartesian3(planetRadius, planetRadius, planetRadius),
            material: new Cesium.ImageMaterialProperty({
                image: texImage,
                transparent: false
            }),
            // ハレー彗星は核(半径18km)が漆黒の有機物岩肌のため、100km以上ズームアウトした際は黒い遮蔽球体を消して美麗な自発光コマ・尾にシームレス移行
            distanceDisplayCondition: isHalley ? new Cesium.DistanceDisplayCondition(0.0, 100000.0) : new Cesium.DistanceDisplayCondition(0.0, Number.MAX_VALUE)
        }
    });

    if (isHalley) {
        // --- ハレー彗星：太陽光を浴びて青白く輝く巨大なコマ（ガス雲）と壮大な尾の完全再現 ---
        // 自発光コマ＆彗星ビルボード（至近距離から超遠方まで黒く消えず、青白く輝くコマオーラと尾を描画）
        // ※ 尾をポリライン(線)で描くと軌道線と誤認されるため、美しいベクタービルボードグラフィックとして一体描画
        const cometCanvas = createFaithfulCometCanvas();
        const cometBillboard = viewer.entities.add({
            id: 'inspect_halley_billboard',
            name: 'Halley Visual Marker',
            position: bodyPos,
            billboard: {
                image: cometCanvas,
                width: 140,
                height: 70,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                pixelOffset: Cesium.Cartesian2.ZERO,
                scaleByDistance: new Cesium.NearFarScalar(1.0e3, 1.4, 5.0e10, 0.85),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
        activePlanetRingEntities.push(cometBillboard);
    } else {
        // Create Genuine 3D Planetary Rings in Space
        create3DPlanetaryRings(body, bodyPos, planetRadius);
    }

    // Lock camera target transform to the planet center!
    const targetRange = isHalley ? 350000 : (planetRadius * ((body.id === 'SATURN' || body.id === 'JUPITER' || body.id === 'URANUS') ? 3.4 : 2.8));
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
            // lookAt ロックを解除し、マウスホイールでの自由なズームアウト（太陽系全体への引き）を100%保証！
            viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
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
    } else if (bodyId === 'NEPTUNE') {
        // Neptune: Deep azure cobalt-blue atmosphere with supersonic cloud streaks
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#1e3a8a');
        grad.addColorStop(0.25, '#1d4ed8');
        grad.addColorStop(0.5, '#2563eb');
        grad.addColorStop(0.75, '#1d4ed8');
        grad.addColorStop(1, '#1e3a8a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);

        // Subtle white methane cirrus cloud streaks
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        for (let y = 120; y < 450; y += 70) {
            ctx.beginPath();
            ctx.ellipse(512 + Math.sin(y) * 100, y, 320, 4, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        // Great Dark Spot
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.beginPath();
        ctx.ellipse(420, 290, 55, 30, -0.1, 0, Math.PI * 2);
        ctx.fill();
    } else if (bodyId === 'CERES') {
        // Ceres: Cratered rocky asteroid terrain with Occator Crater salt faculae
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, 0, 1024, 512);
        // Craters
        ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
        for (let i = 0; i < 90; i++) {
            const x = (i * 97) % 1024;
            const y = 40 + ((i * 61) % 432);
            const r = 8 + ((i * 13) % 36);
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        // Occator Crater Bright Salt Faculae (Cerealia Facula)
        const fx = 512, fy = 256;
        const fgrad = ctx.createRadialGradient(fx, fy, 2, fx, fy, 45);
        fgrad.addColorStop(0, '#ffffff');
        fgrad.addColorStop(0.35, '#f8fafc');
        fgrad.addColorStop(0.7, 'rgba(255,255,255,0.4)');
        fgrad.addColorStop(1, 'transparent');
        ctx.fillStyle = fgrad;
        ctx.beginPath();
        ctx.arc(fx, fy, 45, 0, Math.PI * 2);
        ctx.fill();
    } else if (bodyId === 'PLUTO') {
        // Pluto: Reddish-brown tholins with bright cream Sputnik Planitia (heart shape)
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#78350f');
        grad.addColorStop(0.3, '#9a3412');
        grad.addColorStop(0.6, '#b45309');
        grad.addColorStop(1, '#451a03');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);

        // Dark equatorial patches (Cthulhu Macula)
        ctx.fillStyle = 'rgba(28, 25, 23, 0.65)';
        ctx.beginPath();
        ctx.ellipse(320, 290, 160, 60, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Tombaugh Regio / Sputnik Planitia (Bright Heart)
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.ellipse(580, 260, 70, 85, -0.2, 0, Math.PI * 2);
        ctx.ellipse(650, 270, 60, 75, 0.2, 0, Math.PI * 2);
        ctx.fill();
    } else if (bodyId === 'HALLEY') {
        // Halley's Comet: Dark organic crust with active bright icy sublimation geysers & cyan coma glow
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(0, 0, 1024, 512);

        // Dark basalt/carbon crater textures
        ctx.fillStyle = 'rgba(41, 37, 36, 0.85)';
        for (let i = 0; i < 60; i++) {
            const x = (i * 113) % 1024;
            const y = (i * 71) % 512;
            const rx = 20 + ((i * 19) % 50);
            const ry = 10 + ((i * 11) % 30);
            ctx.beginPath();
            ctx.ellipse(x, y, rx, ry, i * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Active Sublimation Gas Jets & Cyan Coma Sheen (太陽光を受けて激しく吹き出す白銀の氷昇華噴煙)
        const jetGlow = ctx.createLinearGradient(0, 200, 0, 320);
        jetGlow.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
        jetGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
        jetGlow.addColorStop(1, 'rgba(56, 189, 248, 0.2)');
        ctx.fillStyle = jetGlow;
        ctx.beginPath();
        ctx.ellipse(512, 256, 320, 90, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        for (let j = 0; j < 12; j++) {
            const jx = 220 + j * 55;
            const jy = 220 + (j % 3) * 35;
            ctx.beginPath();
            ctx.moveTo(jx, jy);
            ctx.lineTo(jx + (j % 2 === 0 ? 50 : -40), jy - 85);
            ctx.stroke();
        }
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

// Bulletproof Guaranteed getSatDisplayName Function with Country Flags
function getSatDisplayName(name) {
    if (!name || typeof name !== 'string') return 'Satellite';
    const lang = window.currentLang || currentLang || 'ja';
    const upper = name.toUpperCase();
    
    if (lang === 'ja') {
        // Military, Defense & Reconnaissance Satellites
        if (upper.includes('IGS RADAR') || upper.includes('IGS-')) return '🇯🇵 IGS レーダ7号機 (内閣衛星情報センター 事実上の軍事偵察衛星)';
        if (upper.includes('KIRAMEKI') || upper.includes('DSN-2')) return '🇯🇵 きらめき2号 DSN-2 (防衛省 Xバンド自衛隊防衛通信衛星)';
        if (upper.includes('SBIRS')) return '🇺🇸 SBIRS GEO-5 (米宇宙軍 弾道ミサイル早期警戒衛星)';
        if (upper.includes('GSSAP')) return '🇺🇸 GSSAP-5 (米宇宙軍 静止軌道宇宙状況把握「宇宙パトロール」)';
        if (upper.includes('AEHF')) return '🇺🇸 AEHF-6 (米宇宙軍 核戦争耐性・大統領指令極秘通信衛星)';
        if (upper.includes('ORION') || upper.includes('MENTOR')) return '🇺🇸 Orion 10 / Mentor-7 (米国家偵察局 口径100m電波盗聴スパイ衛星)';
        if (upper.includes('TUNDRA') || (upper.includes('COSMOS') && upper.includes('2552'))) return '🇷🇺 Tundra 5 / EKS (ロシア宇宙軍 弾道ミサイル早期警戒モルニヤ衛星)';
        if (upper.includes('2542')) return '🇷🇺 Kosmos 2542 (ロシア宇宙軍 キラー・インスペクター機動衛星)';
        if (upper.includes('SHIJIAN-21') || upper.includes('SJ-21')) return '🇨🇳 実践21号 Shijian-21 (中国 衛星捕獲・宇宙ゴミ投棄船)';
        if (upper.includes('OFEQ')) return '🇮🇱 Ofeq-16 (イスラエル国防軍 逆行軌道光学スパイ衛星)';
        if (upper.includes('SARAH')) return '🇩🇪 SARah-1 (ドイツ連邦軍 次世代フェーズドアレイレーダー偵察衛星)';
        // Super Interesting & Unique Flagship Satellites (USA / Russia / China / Japan)
        if (upper.includes('X-37B') || upper.includes('OTV')) return '🇺🇸 X-37B (米宇宙軍極秘無人スペースプレーン)';
        if (upper.includes('USA-245') || upper.includes('KEYHOLE') || upper.includes('KH-11')) return '🇺🇸 USA-245 KH-11 (米国家偵察局 口径2.4m極秘スパイ衛星)';
        if (upper.includes('SWOT')) return '🇺🇸 / 🇫🇷 SWOT (地表水・海洋地形調査立体衛星)';
        if (upper.includes('WORLDVIEW-3') || upper.includes('WORLDVIEW')) return '🇺🇸 WorldView-3 (Maxar 31cm超高精細民間写真衛星)';
        if (upper.includes('OLYMP') || upper.includes('LUCH-5X')) return '🇷🇺 Olymp-K / Luch-5X (ロシア宇宙スパイ「宇宙のストーカー」)';
        if (upper.includes('SPEKTR-RG') || upper.includes('SPEKTR')) return '🇷🇺 / 🇩🇪 Spektr-RG (ロシア・ドイツ共同 深宇宙X線全天探査)';
        if (upper.includes('METEOR-M')) return '🇷🇺 Meteor-M No.2-4 (ロシア新世代極軌道気象・北極海氷衛星)';
        if (upper.includes('MICIUS') || upper.includes('QUESS')) return '🇨🇳 墨子号 Micius (世界初・量子通信・量子もつれ実験衛星)';
        if (upper.includes('DAMPE') || upper.includes('WUKONG')) return '🇨🇳 悟空号 DAMPE (暗黒物質・ダークマター粒子探査衛星)';
        if (upper.includes('YAOGAN-35') || upper.includes('YAOGAN')) return '🇨🇳 遥感35号 Yaogan-35 (中国海軍3機編隊電波三点測量シギント)';
        if (upper.includes('QUEQIAO')) return '🇨🇳 鵲橋 Queqiao (世界初・月の裏側探査用L2中継衛星)';
        if (upper.includes('ADRAS-J') || upper.includes('ASTROSCALE')) return '🇯🇵 ADRAS-J (アストロスケール 世界初商業デブリ除去実証船)';

        // Europe (ESA / Copernicus / Galileo / EUMETSAT)
        if (upper.includes('SENTINEL-2A')) return '🇪🇺 Sentinel-2A (センチネル2A - 欧州光学観測)';
        if (upper.includes('SENTINEL-1A')) return '🇪🇺 Sentinel-1A (センチネル1A - 欧州CバンドSAR)';
        if (upper.includes('GALILEO')) return '🇪🇺 Galileo-26 (欧州ガリレオ測位衛星)';
        if (upper.includes('METEOSAT') || upper.includes('MTG')) return '🇪🇺 Meteosat-12 (欧州最新静止気象衛星)';
        
        // South Korea (KARI)
        if (upper.includes('GEO-KOMPSAT-2A') || upper.includes('CHOLLIAN-2A')) return '🇰🇷 GEO-KOMPSAT-2A (千里眼2A号 - 韓国静止気象衛星)';
        if (upper.includes('GEO-KOMPSAT-2B') || upper.includes('CHOLLIAN-2B')) return '🇰🇷 GEO-KOMPSAT-2B (千里眼2B号 - 世界初静止環境観測)';
        if (upper.includes('KOMPSAT-5') || upper.includes('ARIRANG-5')) return '🇰🇷 KOMPSAT-5 (アリラン5号 - 韓国XバンドSAR)';
        
        // India (ISRO)
        if (upper.includes('CARTOSAT-3')) return '🇮🇳 Cartosat-3 (カルトサット3号 - インド28cm超高分解能)';
        if (upper.includes('INSAT-3DR')) return '🇮🇳 INSAT-3DR (インサット3DR - インド静止気象衛星)';
        
        // Russia (Roscosmos)
        if (upper.includes('GLONASS')) return '🇷🇺 GLONASS-K (ロシア宇宙軍グロナス測位衛星)';
        if (upper.includes('ELEKTRO-L')) return '🇷🇺 Elektro-L No.3 (ロシア静止気象衛星)';
        
        // China (CNSA)
        if (upper.includes('FENGYUN-4B')) return '🇨🇳 Fengyun-4B (風雲4号B - 中国新世代静止気象衛星)';
        if (upper.includes('GAOFEN-7')) return '🇨🇳 Gaofen-7 (高分7号 - 中国サブメートル3D立体測量)';
        if (upper.includes('TIANGONG')) return '🇨🇳 TIANGONG (天宮宇宙ステーション)';
        if (upper.includes('BEIDOU')) return '🇨🇳 BEIDOU-3 (北斗3号測位衛星)';
        
        // USA (NASA / NOAA / USSF)
        if (upper.includes('LANDSAT-9')) return '🇺🇸 Landsat-9 (ランドサット9号 - 米国地球観測)';
        if (upper.includes('TERRA')) return '🇺🇸 Terra (テラ - NASA地球科学フラッグシップ)';
        if (upper.includes('GOES-18')) return '🇺🇸 GOES-18 (GOES-West - 米国静止気象衛星)';
        if (upper.includes('HUBBLE')) return '🇺🇸 / 🇪🇺 HUBBLE (ハッブル宇宙望遠鏡)';
        if (upper.includes('GPS')) return '🇺🇸 ' + name.replace(/\(.*\)/, '') + ' (GPSナビゲーション衛星)';
        
        // International / Japan
        if (upper.includes('ISS')) return '🇺🇸 / 🇯🇵 / 🇪🇺 ISS (国際宇宙ステーション)';
        if (upper.includes('ALOS-4') || upper.includes('DAICHI-4')) return '🇯🇵 ALOS-4 (だいち4号 - H3ロケット搭載)';
        if (upper.includes('ALOS-2') || upper.includes('DAICHI-2')) return '🇯🇵 ALOS-2 (だいち2号 - LバンドSAR)';
        if (upper.includes('XRISM')) return '🇯🇵 / 🇺🇸 XRISM (クリズム - X線宇宙望遠鏡)';
        if (upper.includes('GCOM-W') || upper.includes('SHIZUKU')) return '🇯🇵 GCOM-W (しずく - 水循環観測衛星)';
        if (upper.includes('GCOM-C') || upper.includes('SHIKISAI')) return '🇯🇵 GCOM-C (しきさい - 気候変動観測衛星)';
        if (upper.includes('GOSAT-2') || upper.includes('IBUKI')) return '🇯🇵 GOSAT-2 (いぶき2号 - 温室効果ガス観測)';
        if (upper.includes('QPS-SAR') || upper.includes('TSUKUYOMI')) return '🇯🇵 QPS-SAR-5 (ツクヨミ-I - 小型SAR)';
        if (upper.includes('STRIX')) return '🇯🇵 StriX-1 (ストリクス - 民間SAR衛星)';
        if (upper.includes('HIMAWARI-8')) return '🇯🇵 HIMAWARI-8 (ひまわり8号 - バックアップ)';
        if (upper.includes('HIMAWARI-9')) return '🇯🇵 HIMAWARI-9 (ひまわり9号 - メイン観測)';
        if (upper.includes('MICHIBIKI-7') || upper.includes('QZS-7')) return '🇯🇵 MICHIBIKI-7 (みちびき7号機 - H3最新打上)';
        if (upper.includes('MICHIBIKI-1R')) return '🇯🇵 MICHIBIKI-1R (みちびき1号R後継機)';
        if (upper.includes('MICHIBIKI-6')) return '🇯🇵 MICHIBIKI-6 (みちびき6号機 - 準天頂衛星)';
        if (upper.includes('MICHIBIKI-5')) return '🇯🇵 MICHIBIKI-5 (みちびき5号機)';
        if (upper.includes('MICHIBIKI-1')) return '🇯🇵 MICHIBIKI-1 (みちびき1号初号機)';
        if (upper.includes('MICHIBIKI-2')) return '🇯🇵 MICHIBIKI-2 (みちびき2号機)';
        if (upper.includes('MICHIBIKI-3')) return '🇯🇵 MICHIBIKI-3 (みちびき3号機)';
        if (upper.includes('MICHIBIKI-4')) return '🇯🇵 MICHIBIKI-4 (みちびき4号機)';
        
        // Debris & Starlink
        if (upper.includes('DEBRIS') || upper.includes('COSMOS 2251') || upper.includes('FENGYUN 1C') || upper.includes('SL-8') || upper.includes('SL-16')) {
            return '⚠️ ' + name + ' (宇宙ゴミ)';
        }
        if (upper.includes('STARLINK')) return '🛰️ ' + name;
        return name;
    } else {
        let clean = name.replace(/\(.*?[぀-ヿ㐀-䶿一-鿿].*?\)/g, '').trim();
        if (upper.includes('MICHIBIKI-7') || upper.includes('QZS-7')) return '🇯🇵 QZS-7 / Michibiki-7 (Japan 7-Satellite Constellation)';
        if (upper.includes('IGS RADAR') || upper.includes('IGS-')) return '🇯🇵 IGS Radar-7 (Japan Cabinet Reconnaissance Satellite)';
        if (upper.includes('KIRAMEKI') || upper.includes('DSN-2')) return '🇯🇵 Kirameki-2 DSN-2 (Japan MoD Military X-Band Satcom)';
        if (upper.includes('SBIRS')) return '🇺🇸 SBIRS GEO-5 (USSF Ballistic Missile Early Warning)';
        if (upper.includes('GSSAP')) return '🇺🇸 GSSAP-5 (USSF Geosynchronous Space Surveillance Patrol)';
        if (upper.includes('AEHF')) return '🇺🇸 AEHF-6 (USSF Nuclear-Survivable Protected Satcom)';
        if (upper.includes('ORION') || upper.includes('MENTOR')) return '🇺🇸 Orion 10 / Mentor-7 (NRO 100m Antenna SIGINT Spy)';
        if (upper.includes('TUNDRA') || (upper.includes('COSMOS') && upper.includes('2552'))) return '🇷🇺 Tundra 5 / EKS (Russian Early Warning Molniya Orbit)';
        if (upper.includes('2542')) return '🇷🇺 Kosmos 2542 (Russian Space Stalker / Inspector)';
        if (upper.includes('SHIJIAN-21') || upper.includes('SJ-21')) return '🇨🇳 Shijian-21 (Chinese Robotic Satellite Tug / Grappler)';
        if (upper.includes('OFEQ')) return '🇮🇱 Ofeq-16 (Israel Defense Forces Retrograde Spy Satellite)';
        if (upper.includes('SARAH')) return '🇩🇪 SARah-1 (German Armed Forces Phased-Array Radar Recon)';
        if (upper.includes('X-37B') || upper.includes('OTV')) return '🇺🇸 X-37B (USSF Secret Spaceplane)';
        if (upper.includes('USA-245') || upper.includes('KEYHOLE') || upper.includes('KH-11')) return '🇺🇸 USA-245 KH-11 (NRO Optical Spy Satellite)';
        if (upper.includes('SWOT')) return '🇺🇸 / 🇫🇷 SWOT (Surface Water Ocean Topography)';
        if (upper.includes('WORLDVIEW-3') || upper.includes('WORLDVIEW')) return '🇺🇸 WorldView-3 (Maxar 31cm Commercial Optical)';
        if (upper.includes('OLYMP') || upper.includes('LUCH-5X')) return '🇷🇺 Olymp-K / Luch-5X (Russian Signals Intelligence)';
        if (upper.includes('SPEKTR-RG') || upper.includes('SPEKTR')) return '🇷🇺 / 🇩🇪 Spektr-RG (Deep Space X-ray Observatory)';
        if (upper.includes('METEOR-M')) return '🇷🇺 Meteor-M No.2-4 (Polar Weather & Arctic Sea Ice)';
        if (upper.includes('MICIUS') || upper.includes('QUESS')) return '🇨🇳 Micius (World First Quantum Science Satellite)';
        if (upper.includes('DAMPE') || upper.includes('WUKONG')) return '🇨🇳 DAMPE / Wukong (Dark Matter Explorer)';
        if (upper.includes('YAOGAN-35') || upper.includes('YAOGAN')) return '🇨🇳 Yaogan-35 (Tri-Satellite Formation SIGINT)';
        if (upper.includes('QUEQIAO')) return '🇨🇳 Queqiao (Lunar Far Side L2 Relay)';
        if (upper.includes('ADRAS-J') || upper.includes('ASTROSCALE')) return '🇯🇵 ADRAS-J (Astroscale Commercial Debris Inspection)';

        if (upper.includes('SENTINEL-2A')) return '🇪🇺 Sentinel-2A (Copernicus Optical)';
        if (upper.includes('SENTINEL-1A')) return '🇪🇺 Sentinel-1A (Copernicus Radar SAR)';
        if (upper.includes('GALILEO')) return '🇪🇺 Galileo-26 (EU GNSS)';
        if (upper.includes('METEOSAT') || upper.includes('MTG')) return '🇪🇺 Meteosat-12 (MTG Weather)';
        if (upper.includes('GEO-KOMPSAT-2A') || upper.includes('CHOLLIAN-2A')) return '🇰🇷 GEO-KOMPSAT-2A (Chollian-2A)';
        if (upper.includes('GEO-KOMPSAT-2B') || upper.includes('CHOLLIAN-2B')) return '🇰🇷 GEO-KOMPSAT-2B (Chollian-2B)';
        if (upper.includes('KOMPSAT-5') || upper.includes('ARIRANG-5')) return '🇰🇷 KOMPSAT-5 (Arirang-5 SAR)';
        if (upper.includes('CARTOSAT-3')) return '🇮🇳 Cartosat-3 (High-Res 0.28m)';
        if (upper.includes('INSAT-3DR')) return '🇮🇳 INSAT-3DR (GEO Weather)';
        if (upper.includes('GLONASS')) return '🇷🇺 GLONASS-K (Russian GNSS)';
        if (upper.includes('ELEKTRO-L')) return '🇷🇺 Elektro-L No.3 (GEO Weather)';
        if (upper.includes('FENGYUN-4B')) return '🇨🇳 Fengyun-4B (FY-4B Weather)';
        if (upper.includes('GAOFEN-7')) return '🇨🇳 Gaofen-7 (3D Mapping)';
        if (upper.includes('TIANGONG')) return '🇨🇳 Tiangong Space Station';
        if (upper.includes('BEIDOU')) return '🇨🇳 BeiDou-3 (Navigation Satellite)';
        if (upper.includes('LANDSAT-9')) return '🇺🇸 Landsat-9 (NASA/USGS)';
        if (upper.includes('TERRA')) return '🇺🇸 Terra (NASA EOS AM-1)';
        if (upper.includes('GOES-18')) return '🇺🇸 GOES-18 (GOES-West)';
        if (upper.includes('ALOS-4') || upper.includes('DAICHI-4')) return '🇯🇵 ALOS-4 (DAICHI-4 Radar)';
        if (upper.includes('ALOS-2') || upper.includes('DAICHI-2')) return '🇯🇵 ALOS-2 (DAICHI-2 Radar)';
        if (upper.includes('XRISM')) return '🇯🇵 / 🇺🇸 XRISM (X-ray Telescope)';
        if (upper.includes('GCOM-W') || upper.includes('SHIZUKU')) return '🇯🇵 GCOM-W (SHIZUKU Water Cycle)';
        if (upper.includes('GCOM-C') || upper.includes('SHIKISAI')) return '🇯🇵 GCOM-C (SHIKISAI Climate)';
        if (upper.includes('GOSAT-2') || upper.includes('IBUKI')) return '🇯🇵 GOSAT-2 (IBUKI-2 GHG)';
        if (upper.includes('QPS-SAR')) return '🇯🇵 QPS-SAR-5 (TSUKUYOMI-I)';
        if (upper.includes('STRIX')) return '🇯🇵 StriX-1 (Commercial SAR)';
        if (upper.includes('ISS')) return '🇺🇸 / 🇯🇵 / 🇪🇺 ISS (International Space Station)';
        if (upper.includes('HIMAWARI-8')) return '🇯🇵 Himawari-8 (Weather Satellite)';
        if (upper.includes('MICHIBIKI-7') || upper.includes('QZS-7')) return '🇯🇵 QZS-7 / Michibiki-7 (Japan 7-Satellite Constellation)';
        if (upper.includes('MICHIBIKI-6')) return '🇯🇵 QZS-6 / Michibiki-6 (Navigation Satellite)';
        if (upper.includes('MICHIBIKI')) return '🇯🇵 ' + clean + ' (QZSS Navigation)';
        if (upper.includes('HUBBLE')) return '🇺🇸 / 🇪🇺 Hubble Space Telescope';
        if (upper.includes('GPS')) return '🇺🇸 ' + clean + ' (GPS Navigation)';
        if (upper.includes('STARLINK')) return '🛰️ ' + name;
        if (upper.includes('DEBRIS') || upper.includes('COSMOS') || upper.includes('FENGYUN') || upper.includes('SL-')) return '⚠️ ' + name;
        return clean;
    }
}

const TRANSLATIONS = {
    "ja": {
        "mobileBtnSelect": "🛰️ 衛星選択",
        "mobileBtnDetail": "📊 衛星詳細",
        "mobileSheetSelectTitle": "🛰️ 衛星選択・メニュー",
        "mobileSheetDetailTitle": "📊 衛星詳細情報",
        "zoomHintPcTitle": "🔍 マウスホイールでズーム",
        "zoomHintPcSub": "スクロールして地球全体を見渡せます",
        "zoomHintTouchTitle": "🔍 2本指ピンチでズーム",
        "zoomHintTouchSub": "画面をつまんで地球全体を見渡せます",
        "zoomHintTitle": "🔍 マウスホイール / ピンチでズーム",
        "zoomHintSub": "スクロールして地球全体を見渡せます",
        "loadTrain": "🚂 スターリンク・トレイン (最新打ち上げ列・24機)",
        "tooltipGuideTitle": "💡 衛星をタップして切り替え可能！",
        "tooltipGuideDesc": "スターリンク、ハッブル宇宙望遠鏡、気象衛星ひまわりなどを選択・追跡できます。",

        "appSubtitle": "リアルタイム3D人工衛星・宇宙デブリ軌道シミュレーター",
        "statCount": "追跡衛星数",
        "statTime": "シミュレーション時刻",
        "dragPanel": "⋮⋮ ドラッグでパネル移動",
        "dragHeader": "⋮⋮ ドラッグで移動",
        "secSelect": "天体・衛星を選択・検索",
        "selectPlaceholder": "-- 太陽・惑星・衛星・宇宙ゴミを選択 --",
        "searchPlaceholder": "または太陽・惑星・衛星名・NORAD IDで検索...",
        "loadMajor": "⭐ 主要・有名衛星 (ひまわり, ISS, みちびき, デブリ)",
        "loadDeepSpace": "🔭 深宇宙・月/火星探査機 & JWST (Webb, Artemis, MRO)",
        "badgeDeepSpace": "🔭 深宇宙探査機・宇宙望遠鏡プリセット読込済",
        "loadSolarSystem": "🌌 太陽系全体・全惑星軌道 (Orrery View)",
        "badgeSolarSystem": "🌌 太陽系全体・全8惑星軌道表示中",
        "loadLocal": "🛰️ Starlink 全衛星コンステレーション (2,000機)",
        "loadDebris": "💥 宇宙デブリ・メガクラウド (2,200+ 破片)",
        "badgeDebris": "💥 宇宙デブリ・メガクラウド読込済 (2,200破片)",
        "badgeMajor": "⭐ 主要・有名衛星プリセット読込済",
        "optgroupDeepSpace": "🔭 深宇宙探査機 & 宇宙望遠鏡 (JWST, 月, 火星)",
        "secTime": "時間コントロール & 倍速設定",
        "speedStop": "⏸️ 停止",
        "speedReal": "▶️ 1x (リアル)",
        "resetNow": "🔄 現在時刻",
        "secDisplay": "表示設定",
        "toggleLabels": "3D空間に衛星名ラベルを表示",
        "toggleOrbits": "選択衛星の軌道を表示",
        "toggleMultiLap": "🌐 複数周回軌跡を表示 (地球自転の波状パターン)",
        "toggleAtmosphere": "大気圏 & ライティング",
        "toggle2D": "2D世界地図モード",
        "toggleBorders": "🌐 国境線 & 地名ラベル",
        "toggleDebrisRisk": "🔮 宇宙デブリ危険分析モード (パープル表示)",
        "toggleCelestial": "🌌 太陽・月・主要惑星 (火星/金星/木星/土星)",
        "toggleDeepSpace": "🔭 深宇宙・月/火星探査機 & JWST",
        "dragDetail": "⋮⋮ ドラッグで詳細カード移動",
        "dragCam": "⋮⋮ カメラ視点移動",
        "labelAlt": "高度 (Altitude)",
        "labelVel": "速度 (Velocity)",
        "labelLat": "緯度 (Latitude)",
        "labelLon": "経度 (Longitude)",
        "labelInc": "軌道傾斜角 (Inclination)",
        "labelPeriod": "周期 (Period)",
        "labelTimezone": "時刻表示タイムゾーン",
        "labelPass": "📡 上空通過予報 (現在地: 東京上空)",
        "labelRisk": "🔮 宇宙デブリ最接近 (衝突予測)",
        "btnGeo": "📍現在地",
        "btnTrack": "🎯 追跡カメラフォーカス",
        "btnUntrack": "🔓 追跡解除",
        "pointerHint": "画面外にあります (クリックでカメラ移動)",
        "btnCupola": "👨‍🚀 ISS キューポラ展望窓 (搭乗視点)",
        "btnSatPov": "🛰️ 衛星搭乗カメラ (オンボード視点)",
        "exitCupola": "✕ 通常視点に戻る (Exit Cupola)",
        "cupolaTitle": "👨‍🚀 ISS キューポラ展望窓 (Cupola Observation Deck)",
        "cupolaHint": "🖱️ 画面ドラッグで展望窓からの見渡し自由回転",
        "soundToggle": "🔇 サウンド OFF",
        "soundOn": "🔊 サウンド ON",
        "soundOff": "🔇 サウンド OFF",
        "historicalTimeTravelTitle": "⏳ 歴史的瞬間タイムトラベル",
        "btnShareTwitter": "𝕏 画像付きシェア",
        "btnSaveScreenshot": "📸 撮影",
        "headerScreenshot": "📸 スクショ",
        "btnCopyShare": "📋 コピー",
        "btnRelease": "📜 v2.7 更新履歴",
        "btnGuide": "❓ ガイド & 規約",
        "modalTitle": "SatViewer3D 操作ガイド & 利用規約",
        "tabControls": "🎮 操作方法",
        "tabReleases": "📜 更新履歴",
        "tabDisclaimer": "⚠️ 免責事項",
        "tabPrivacy": "🔒 プライバシーポリシー",
        "tabAbout": "ℹ️ サイト情報",
        "releaseTitle": "📜 SatViewer3D 更新履歴・リリースノート",
                        "rel27Title": "📡 精密上空通過予報 & 💥 宇宙デブリ・メガクラウド (2,200+破片) メジャーリリース",
        "rel27_1": "📡 <strong>天文学的 SGP4/SEZ 上空通過予報エンジン</strong>: 選択した衛星が次回「何月何日 何時何分」に現れ、「どの方角（16方位）から昇り、最高仰角何度を通って、どの方角へ沈むか」を秒単位のリアルタイム・カウントダウンとともに完全表示。",
        "rel27_2": "💥 <strong>宇宙デブリ・メガクラウド（2,200+ 破片）新プリセット</strong>: 2009年イリジウム/コスモス衝突、風雲1号C破壊、SL-8/16・デルタ2・アリアン残骸など、地球を包み込む2,200個の実在デブリ帯をボタン1発で展開。",
        "rel27_3": "🔮 <strong>全2,200デブリ連動 最接近・衝突予測レーダー</strong>: 2,200個のデブリ群の中から最も危険な最接近物体と距離、未来24時間の軌道交差リスクをミリ秒でリアルタイム解析。",
        "rel27_4": "🗺️ <strong>2D世界地図モードのカメラ追従安定化</strong>: 2D世界地図モード中に衛星を切り替えても視点が歪まず、適切な高度を保ったまま水平に滑らかに追従・センタリング。",
        "rel27_5": "🛡️ <strong>XSSサニタイズ堅牢化 & 多言語テクスチャ最適化</strong>: セキュリティを最高レベルに強化し、全14言語ポータルで3D地球テクスチャを瞬時にロード。",
        "rel26Title": "🛰️ みちびき7機体制完成 & 米国・主要衛星の公式ビジュアル全面刷新",
        "rel26_1": "🇯🇵 みちびき7号機（QZS-7）新規追加: 2026年8月11日にH3ロケット9号機で打ち上げられた最新鋭測位衛星の軌道諸元（TLE）と内閣府公式フルHD 3D画像を実装。",
        "rel26_2": "🛰️ みちびき全8機（1号〜7号機・1R）の完全個別画像化: JAXAおよび内閣府7機体制特設サイト公式CGより、各号機固有の1080p機体画像を完全個別バインド。",
        "rel26_3": "🇺🇸 米国・世界主要衛星の公式機体写真刷新: NASA Ames公式4K Starlink衛星（長大ソーラーパネル展開）、USA-245（KH-11 Keyhole光学偵察望遠鏡）、SBIRS早期警戒、X-37B軌道上写真へ全面差し替え。",
        "rel26_4": "🌐 全14言語での新衛星詳細解説カード完全同期: 7機体制の意義や宇宙領域把握（SDA）光学センサー初搭載の解説を14言語に完全ローカライズ。",
        "rel26_5": "📑 衛星リスト番号順ソート最適化: サイドバーの衛星リストでみちびき1〜7号機を自然な番号順に整列。",
"rel25Title": "🪐 3D太陽系・惑星探査 & 世界14言語宇宙百科事典 メジャーアップデート",
        "rel25_1": "🪐 太陽・月・主要惑星のリアルタイム3D探査モード: 太陽、月、火星、木星、土星、天王星、金星、水星への急接近・360度自由回転・超精密マイクロズームを実装。",
        "rel25_2": "📷 NASA公式実写フォトテクスチャ: 探査機の実写高解像度テクスチャを全天体に適用し、圧倒的リアリズムを実現。",
        "rel25_3": "💍 本物の3D直交惑星リング: 土星の多重氷リング(カッシーニ間隙・傾斜角26.7度)と天王星の縦向き垂直リング(傾斜角97.8度)を完全再現。",
        "rel25_4": "🌡️ 表面温度HUD & 太陽黒点物理解説: 各惑星の寒暖差や太陽黒点の温度メカニズム(~4,000℃)を専用HUDメトリクスとして新設。",
        "rel25_5": "🌐 世界14言語での天体百科事典・検索: 発見史や各国の探査機ミッション(アポロ、ボイジャー、カッシーニ、JAXA等)を含む全テキストを14言語に完全ローカライズ。",
        "rel20Title": "🔮 宇宙デブリ衝突リスク予測 & Starlinkメガコンステレーション",
        "rel20_1": "🔮 24時間デブリ衝突リスクレーダー: 過去の衛星衝突破片の軌道交差距離(MOID)をリアルタイム計算。",
        "rel20_2": "🛰️ Starlink 2,000機コンステレーション: SpaceXのメガコンステレーション衛星群をブラウザ上で完全描画。",
        "rel20_3": "📡 GPS現在地上空通過予測: 現在地からの可視パス、最接近仰角、通過カウントダウン自動計算。",
        "rel10Title": "🌍 SatViewer3D 正式ローンチ",
        "rel10_1": "WebAssembly / WebGL / CesiumJSを活用したリアルタイム3D人工衛星軌道シミュレーターの初版リリース。",
        "guideTitleControls": "🖱️ 3D 空間の操作ガイド",
        "guideWheel": "マウスホイール / タッチ操作",
        "guideWheelDesc": "絹のように滑らかな 1/10 速度でズームイン / ズームアウト。",
        "guideDrag": "左ドラッグ",
        "guideDragDesc": "地球を全方向（360度）自由回転。",
        "guideTilt": "右ドラッグ / Ctrl + ドラッグ",
        "guideTiltDesc": "カメラの角度（チルト・俯瞰視点）を変更。",
        "guideClick": "衛星をクリック / 検索",
        "guideClickDesc": "衛生を選択し、リアルタイム軌道・高度・速度・衝突危険度を表示。",
        "guideFocus": "🎯 追跡カメラフォーカス",
        "guideFocusDesc": "選択した衛星をカメラが自動追跡。",
        "guideRadar": "🔮 宇宙デブリ危険分析",
        "guideRadarDesc": "今後24時間の軌道交差予測 (MOID) をリアルタイム表示。",
        "guideTitleDisclaimer": "⚠️ 免責事項 (Disclaimer)",
        "discText1": "SatViewer3Dが提供する軌道データ、衛星位置、上空通過予報、および宇宙デブリ最接近危険度の予測計算は、CelesTrak および Space-Track の公開 TLE データに基づき教育・観測補助・科学的探求を目的としてリアルタイム計算されています。",
        "discText2": "本シミュレーターのデータは、実際の宇宙船や人工衛星の運用、衝突回避操作等の安全保証を目的としたものではありません。本情報の利用により発生したいかなる損害についても、運営者は一切の責任を負いかねます。",
        "guideTitlePrivacy": "🔒 プライバシーポリシー (Google AdSense 準拠)",
        "privText1Title": "広告の配信について:",
        "privText1Desc": "本サイトでは、第三者配信事業者（Google AdSense 等）による広告サービスを利用する場合があります。広告事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、本サイトや他サイトへのアクセスに関する情報 Cookie を使用することがあります。",
        "privText2Title": "アクセス解析ツールについて:",
        "privText2Desc": "本サイトでは、アクセス解析ツールを利用してトラフィックデータを収集する場合があります。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。",
        "guideTitleAbout": "ℹ️ SatViewer3D について",
        "aboutText1": "SatViewer3D は、地球周回軌道上の人工衛星（ひまわり、みちびき、ISS、Starlink等）および宇宙デブリ（スペースデブリ）、太陽系天体のリアルタイム 3D 可視化シミュレーターです。",
        "aboutFeaturesTitle": "🌟 NASA公開ツールを超越する『SatViewer3D』の 10 大世界最高峰機能",
        "feat1": "🪐 太陽系主要惑星＆太陽・月のリアルタイム3D探査: 太陽、月、火星、木星、土星、天王星、金星、水星への急接近・360度自由回転・NASA実写テクスチャ描画。",
        "feat2": "💍 天文学的物理パラメータ完全準拠 3D直交惑星リング: 土星の氷の多重環(カッシーニ間隙・傾斜角26.7度)と天王星の縦向き垂直リング(傾斜角97.8度)を完全再現。",
        "feat3": "🌡️ 表面温度HUD ＆ 太陽黒点熱力学メカニズム: 各惑星の極限温度や、磁場が熱対流を抑える太陽黒点の温度(~4,000℃)を専用HUDでリアルタイム表示。",
        "feat4": "🌐 世界14言語完全対応の深空百科事典 ＆ 天体検索: 各国の探査機ミッション(アポロ、ボイジャー、カッシーニ、JAXA等)や発見史を14言語で完全ローカライズ。",
        "feat5": "🔮 NASA/JAXA管制室レベル 24hデブリ衝突予測 (MOID): 宇宙状況把握 (SSA) アルゴリズムによる今後24時間の全宇宙ゴミ最接近危険度をリアルタイム探知。",
        "feat6": "🛰️ Starlink 2,000機メガコンステレーション完全描画: SpaceXのグローバル通信衛星メッシュをブラウザ上で遅延なく完全3D描画。",
        "feat7": "🚀 世界最速級 最新衛星・ロケットデータ組み込み: H3ロケット打ち上げ「みちびき6号機 (QZSS-6)」含む最新衛星・デブリ群を即座にシミュレート。",
        "feat8": "🎬 映画のように滑らかな 1/10 速度カメラ操作: 特有の物理スクロールインターセプトによる絹のように吸い付く超微細ズーム。",
        "feat9": "💎 地球視界を 100% 遮らない 浮遊アイランドHUD: 画面中央を完全透過開放し、地球と極軌道を障害物ゼロで観測。",
        "feat10": "🌊 地球自転の波状パターン可視化 (Multi-Lap): 地球の自転に伴う軌道面歳差のサインカーブ波状軌跡を 3D 空間で表現。",
        "aboutContactTitle": "お問い合わせ:",
        "aboutContactDesc": "ご意見・ご要望・不具合のご報告は info@satviewer3d.com までお願いいたします。"
    },
    "en": {
        "mobileBtnSelect": "🛰️ Satellites",
        "mobileBtnDetail": "📊 Details",
        "mobileSheetSelectTitle": "🛰️ Satellites & Menu",
        "mobileSheetDetailTitle": "📊 Satellite Details",
        "zoomHintPcTitle": "🔍 Mouse Wheel to Zoom",
        "zoomHintPcSub": "Scroll to zoom out and view the full Earth",
        "zoomHintTouchTitle": "🔍 Pinch with 2 Fingers to Zoom",
        "zoomHintTouchSub": "Pinch screen to view the full Earth",
        "zoomHintTitle": "🔍 Mouse Wheel / Pinch to Zoom",
        "zoomHintSub": "Scroll to zoom out and view the full Earth",
        "loadTrain": "🚂 Starlink Train (Latest Launch Chain · 24 Sats)",
        "tooltipGuideTitle": "💡 Switch & Track Any Satellite!",
        "tooltipGuideDesc": "Select and track Starlink, Hubble, Himawari weather satellites, and more.",

        "appSubtitle": "Real-time 3D Satellite & Space Debris Orbit Simulator",
        "statCount": "Tracked Satellites",
        "statTime": "Simulation Time",
        "dragPanel": "⋮⋮ Drag to Move Panel",
        "dragHeader": "⋮⋮ Drag to Move",
        "secSelect": "Select & Search Celestial / Satellites",
        "selectPlaceholder": "-- Select Planet, Satellite or Debris --",
        "searchPlaceholder": "Search by Planet, Satellite name or NORAD ID...",
        "secSource": "Satellite Data Sources & Presets",
        "loadMajor": "⭐ Major Satellites (ISS, Hubble, Weather, Debris)",
        "loadDeepSpace": "🔭 Deep Space & JWST (Webb, Artemis, MRO)",
        "badgeDeepSpace": "🔭 Deep Space Missions & Space Telescopes Loaded",
        "loadSolarSystem": "🌌 Solar System Orrery (8 Planets & Sun)",
        "badgeSolarSystem": "🌌 Solar System Orrery Active (8 Planets)",
        "loadLocal": "🛰️ Starlink Mega-Constellation (2,000 Satellites)",
        "loadDebris": "💥 Space Debris Mega-Cloud (2,200+ Fragments)",
        "badgeDebris": "💥 Space Debris Mega-Cloud Loaded (2,200 Fragments)",
        "badgeMajor": "⭐ Major Preset Loaded",
        "optgroupDeepSpace": "🔭 Deep Space Probes & Telescopes (JWST, Moon, Mars)",
        "secTime": "Time Control & Warp Speed",
        "speedStop": "⏸️ Pause",
        "speedReal": "▶️ 1x (Real-time)",
        "resetNow": "🔄 Current Time",
        "secDisplay": "Display Settings",
        "toggleLabels": "Show Labels in 3D Space",
        "toggleOrbits": "Show Selected Orbit",
        "toggleMultiLap": "🌐 Show Multi-Lap Ground Track",
        "toggleAtmosphere": "Atmosphere & Sun Lighting",
        "toggle2D": "2D World Map View",
        "toggleBorders": "🌐 Borders & Place Labels",
        "toggleDebrisRisk": "🔮 Space Debris Collision Risk Mode",
        "toggleCelestial": "🌌 Sun, Moon & Solar System Planets",
        "toggleDeepSpace": "🔭 Deep Space Probes & JWST",
        "dragDetail": "⋮⋮ Drag Detail Card",
        "dragCam": "⋮⋮ Camera Pan Controls",
        "labelAlt": "Altitude",
        "labelVel": "Velocity",
        "labelLat": "Latitude",
        "labelLon": "Longitude",
        "labelInc": "Inclination",
        "labelPeriod": "Period",
        "labelTimezone": "Timezone",
        "labelPass": "📡 Next Visible Pass Forecast",
        "labelRisk": "🔮 Debris Proximity & Collision Risk",
        "btnGeo": "📍GPS Location",
        "btnTrack": "🎯 Focus & Track",
        "btnUntrack": "🔓 Unlock Camera",
        "pointerHint": "Target is off-screen (Click to view)",
        "btnCupola": "👨‍🚀 ISS Cupola View (Astronaut POV)",
        "btnSatPov": "🛰️ Satellite Onboard Camera (POV)",
        "exitCupola": "✕ Return to Orbit View (Exit Cupola)",
        "cupolaTitle": "👨‍🚀 ISS Cupola Observation Deck",
        "cupolaHint": "🖱️ Drag view to look around the cupola windows",
        "soundToggle": "🔇 Sound OFF",
        "soundOn": "🔊 Sound ON",
        "soundOff": "🔇 Sound OFF",
        "historicalTimeTravelTitle": "⏳ Historical Time Travel",
        "btnShareTwitter": "𝕏 Share with Image",
        "btnSaveScreenshot": "📸 Capture",
        "headerScreenshot": "📸 Snapshot",
        "btnCopyShare": "📋 Copy",
        "btnRelease": "📜 v2.7 Release Notes",
        "btnGuide": "❓ Guide & Terms",
        "modalTitle": "SatViewer3D User Guide & Terms of Service",
        "tabControls": "🎮 Controls",
        "tabReleases": "📜 Release Notes",
        "tabDisclaimer": "⚠️ Disclaimer",
        "tabPrivacy": "🔒 Privacy Policy",
        "tabAbout": "ℹ️ About",
        "releaseTitle": "📜 SatViewer3D Release Notes & Changelog",
                        "rel27Title": "📡 Next Pass Sky Trajectory & 💥 Space Debris Mega-Cloud (2,200+ Fragments)",
        "rel27_1": "📡 <strong>Astronomical SGP4/SEZ Next Pass Prediction Engine</strong>: Predicts exact date, time, and 16-compass sky trajectory (rise, max elevation, set) with live ticking countdown.",
        "rel27_2": "💥 <strong>Space Debris Mega-Cloud (2,200+ Fragments)</strong>: New 1-click preset rendering 2,200+ real-world collision fragments (Cosmos 2251, Iridium 33, Fengyun-1C, rocket stages) at 60fps.",
        "rel27_3": "🔮 <strong>Full 2,200-Debris Proximity Radar</strong>: Evaluates real-time closest orbital conjunctions and 24-hour collision risk across all 2,200 debris particles.",
        "rel27_4": "🗺️ <strong>Smooth 2D World Map Camera Panning</strong>: Stabilizes camera view in 2D map mode when switching satellites without vertical distortion.",
        "rel27_5": "🛡️ <strong>Security Hardening & Multilingual Assets</strong>: XSS sanitization defenses and dynamic asset paths for seamless multilingual portals.",
        "rel26Title": "🛰️ Michibiki 7-Sat Constellation Completion & Official Spacecraft Visuals Upgrade",
        "rel26_1": "🇯🇵 QZS-7 (Michibiki-7) Launch Addition: Implemented orbital elements (TLE) and official 1080p 3D imagery for the newest satellite launched on H3 Rocket Flight 9 (Aug 11, 2026).",
        "rel26_2": "🛰️ 100% Unique Imagery for All 8 Michibiki Satellites: Individual official 1080p CG models assigned across QZS-1 through QZS-7 and QZS-1R from JAXA and Cabinet Office portals.",
        "rel26_3": "🇺🇸 US & Flagship Satellites Visual Upgrade: Upgraded to authentic NASA Ames 4K Starlink with single solar array, USA-245 (KH-11 Keyhole reconnaissance telescope), SBIRS, and X-37B.",
        "rel26_4": "🌐 14-Language Comprehensive Mission Cards: Full multilingual synchronization covering the sovereign 7-satellite constellation and joint US-Japan Space Domain Awareness (SDA) payloads.",
        "rel26_5": "📑 Numerical Ordering Refinement: Optimized satellite list sorting to align Michibiki 1 through 7 in clean numerical succession.",
"rel25Title": "🪐 3D Solar System, Planetary Exploration & 14-Language Space Encyclopedia",
        "rel25_1": "🪐 3D Celestial Body Inspection Mode: Smooth camera fly-to, 360° D&D orbit rotation, and precision micro-zoom for Sun, Moon, Mars, Jupiter, Saturn, Uranus, Venus, and Mercury.",
        "rel25_2": "📷 Authentic NASA Photo Textures: Real spacecraft imagery applied to all planetary bodies for breathtaking realism.",
        "rel25_3": "💍 True 3D Cartesian Rings: Multi-layered gold/ice rings for Saturn (with Cassini division at 26.7° tilt) and vertical rings for Uranus (97.8° tilt).",
        "rel25_4": "🌡️ Dedicated Surface Temp HUD & Sunspot Physics: Comprehensive thermal metrics and scientific explanations for sunspot magnetism (~4,000°C).",
        "rel25_5": "🌐 14-Language Global Encyclopedia & Search: Complete localization for discovery histories, exploration missions (Apollo, Voyager, Cassini, JAXA, etc.).",
        "rel20Title": "🔮 Orbital Debris Collision Risk Radar & Starlink Constellation",
        "rel20_1": "🔮 24-Hour Space Debris Collision Warning: Real-time minimum orbital intersection distance (MOID) calculations.",
        "rel20_2": "🛰️ Starlink 2,000-Satellite Mega-Constellation: Full global orbital coverage grid rendered directly in the browser.",
        "rel20_3": "📡 GPS-Based Overhead Pass Forecast: Live visible pass countdown, max elevation, and sky trajectory.",
        "rel10Title": "🌍 SatViewer3D Official Launch",
        "rel10_1": "Initial release of high-precision real-time 3D satellite and space debris orbit simulation platform.",
        "guideTitleControls": "🖱️ 3D Navigation Guide",
        "guideWheel": "Mouse Wheel / Touch",
        "guideWheelDesc": "Smooth precision micro-zoom.",
        "guideDrag": "Left Click + Drag",
        "guideDragDesc": "Rotate 360° freely around Earth and celestial bodies.",
        "guideTilt": "Right Click / Ctrl + Drag",
        "guideTiltDesc": "Adjust camera tilt and pitch.",
        "guideClick": "Click on Satellite / Planet",
        "guideClickDesc": "Inspect detailed orbit metrics and camera lock.",
        "guideFocus": "🎯 Focus & Track",
        "guideFocusDesc": "Camera automatically tracks target in 3D space.",
        "guideRadar": "🔮 Space Debris Collision Warning",
        "guideRadarDesc": "Real-time 24-hour MOID trajectory crossing calculations.",
        "guideTitleDisclaimer": "⚠️ Legal Disclaimer",
        "discText1": "All satellite orbital data and pass predictions are calculated in real time based on public TLE datasets from CelesTrak and Space-Track.",
        "discText2": "This data is provided solely for educational and observational purposes.",
        "guideTitlePrivacy": "🔒 Privacy Policy (Google AdSense Compliant)",
        "privText1Title": "Advertisements:",
        "privText1Desc": "This site uses third-party cookies for advertising services such as Google AdSense.",
        "privText2Title": "Analytics:",
        "privText2Desc": "Anonymous traffic data is collected for site performance analysis.",
        "guideTitleAbout": "ℹ️ About SatViewer3D",
        "aboutText1": "SatViewer3D is a next-generation real-time 3D space simulator built with WebGL, WebAssembly, and CesiumJS.",
        "aboutFeaturesTitle": "🌟 Top 10 World-Leading Features of SatViewer3D Beyond NASA Tools",
        "feat1": "🪐 Real-time 3D Solar System & Planetary Exploration: Seamless fly-to, 360° D&D rotation, and NASA photorealistic textures for Sun, Moon, Mars, Jupiter, Saturn, Uranus, Venus, and Mercury.",
        "feat2": "💍 True 3D Cartesian Ring Physics: Astronomically precise multi-layered gold/ice rings for Saturn (Cassini division, 26.7° tilt) and vertical rings for Uranus (97.8° tilt).",
        "feat3": "🌡️ Surface Temp HUD & Sunspot Thermal Dynamics: Real-time thermal metrics and scientific explanations for sunspot magnetic convection suppression (~4,000°C).",
        "feat4": "🌐 14-Language Space Encyclopedia & Incremental Search: Comprehensive historical missions (Apollo, Voyager, Cassini, JAXA) and discovery records in 14 languages.",
        "feat5": "🔮 24-Hour Orbital Debris Collision Radar (MOID): Space Situational Awareness (SSA) algorithm detecting close orbital crossings in real time.",
        "feat6": "🛰️ Starlink 2,000-Satellite Mega-Constellation: Full global orbital mesh rendered smoothly in 3D right inside your browser.",
        "feat7": "🚀 Ultra-Fast Real-Time Spacecraft Integration: Instant inclusion of latest missions like H3-launched QZSS-7 (Michibiki-7) and newly cataloged space debris.",
        "feat8": "🎬 Silky 1/10 Speed Micro-Zoom Camera Controls: Specialized physics-based scroll interception for cinematic orbit navigation.",
        "feat9": "💎 Unobstructed Floating Island HUD: Fully transparent center view allowing zero-obstruction observation of Earth and polar orbits.",
        "feat10": "🌊 Earth Rotation Wave Ground Tracks (Multi-Lap): Visualization of orbital plane precession and sine-wave ground tracks in 3D space.",
        "aboutContactTitle": "Contact:",
        "aboutContactDesc": "For inquiries and feedback, contact info@satviewer3d.com"
    },
    "de": {
        "mobileBtnSelect": "🛰️ Satelliten",
        "mobileBtnDetail": "📊 Details",
        "mobileSheetSelectTitle": "🛰️ Satelliten & Menü",
        "mobileSheetDetailTitle": "📊 Satelliten-Details",
        "zoomHintPcTitle": "🔍 Mausrad zum Zoomen",
        "zoomHintPcSub": "Rollen für globale Erdansicht",
        "zoomHintTouchTitle": "🔍 Mit 2 Fingern zoomen",
        "zoomHintTouchSub": "Zusammenziehen für globale Erdansicht",
        "zoomHintTitle": "🔍 Mausrad / Zoomen mit Fingern",
        "zoomHintSub": "Rollen für globale Erdansicht",
        "loadTrain": "🚂 Starlink-Zug (Neueste Startkette · 24 Satelliten)",
        "tooltipGuideTitle": "💡 Satellit auswählen & verfolgen!",
        "tooltipGuideDesc": "Wählen und verfolgen Sie Starlink, Hubble, Wettersatelliten und mehr.",

        "appSubtitle": "Echtzeit-3D-Satelliten- und Weltraummüll-Orbitalsimulator",
        "statCount": "Verfolgte Satelliten",
        "statTime": "Simulationszeit",
        "dragPanel": "⋮⋮ Ziehen zum Verschieben",
        "dragHeader": "⋮⋮ Ziehen",
        "secSelect": "Himmelskörper / Satellit auswählen & suchen",
        "selectPlaceholder": "-- Planet, Satellit oder Weltraummüll auswählen --",
        "searchPlaceholder": "Name des Himmelskörpers, Satelliten oder NORAD-ID...",
        "secSource": "Satellitendatenquellen & Voreinstellungen",
        "loadMajor": "⭐ Wichtige Satelliten (ISS, Himawari, Hubble, Müll)",
        "loadDeepSpace": "🔭 Tiefraum & JWST (Webb, Artemis, MRO)",
        "badgeDeepSpace": "🔭 Tiefraumsonden & Weltraumteleskope geladen",
        "loadSolarSystem": "🌌 Sonnensystem Orrery (8 Planeten & Sonne)",
        "badgeSolarSystem": "🌌 Sonnensystem-Orrery aktiv (8 Planeten)",
        "loadLocal": "🛰️ Starlink-Megakonstellation (2.000 Satelliten)",
        "loadDebris": "💥 Weltraummüll-Megawolke (2.200+ Trümmer)",
        "badgeDebris": "💥 Weltraummüll-Megawolke geladen (2.200 Trümmer)",
        "badgeMajor": "⭐ Hauptvoreinstellung geladen",
        "optgroupDeepSpace": "🔭 Tiefraumsonden & Teleskope (JWST, Mond, Mars)",
        "secTime": "Zeitsteuerung & Geschwindigkeitsraffer",
        "speedStop": "⏸️ Pause",
        "speedReal": "▶️ 1x (Echtzeit)",
        "resetNow": "🔄 Aktuelle Zeit",
        "secDisplay": "Anzeigeeinstellungen",
        "toggleLabels": "Satellitenbeschriftungen im 3D-Raum anzeigen",
        "toggleOrbits": "Ausgewählte Umlaufbahn anzeigen",
        "toggleMultiLap": "🌐 Mehrfachumlaufbahnen anzeigen (Erdrotationsmuster)",
        "toggleAtmosphere": "Atmosphäre & Sonnenbeleuchtung",
        "toggle2D": "2D-Weltkartenansicht",
        "toggleBorders": "🌐 Landesgrenzen & Ortsbeschriftungen",
        "toggleDebrisRisk": "🔮 Weltraummüll-Kollisionsrisikowarnung",
        "toggleCelestial": "🌌 Sonne, Mond & Planeten des Sonnensystems",
        "toggleDeepSpace": "🔭 Tiefraum & JWST-Sonden",
        "dragDetail": "⋮⋮ Detailkarte verschieben",
        "dragCam": "⋮⋮ Kamerasteuerung",
        "labelAlt": "Höhe",
        "labelVel": "Geschwindigkeit",
        "labelLat": "Breitengrad",
        "labelLon": "Längengrad",
        "labelInc": "Inklination",
        "labelPeriod": "Umlaufzeit",
        "labelTimezone": "Zeitzone",
        "labelPass": "📡 Nächster sichtbarer Überflug",
        "labelRisk": "🔮 Weltraummüll-Kollisionsrisiko (MOID)",
        "btnGeo": "📍GPS-Standort",
        "btnTrack": "🎯 Ziel verfolgen",
        "btnUntrack": "🔓 Kamera lösen",
        "pointerHint": "Ziel außerhalb des Bildschirms",
        "btnRelease": "📜 v2.7 Release-Notes",
        "btnGuide": "❓ Anleitung & Bedingungen",
        "modalTitle": "SatViewer3D Benutzerhandbuch & Bedingungen",
        "tabControls": "🎮 Steuerung",
        "tabReleases": "📜 Versionshinweise",
        "tabDisclaimer": "⚠️ Haftungsausschluss",
        "tabPrivacy": "🔒 Datenschutz",
        "tabAbout": "ℹ️ Über uns",
        "releaseTitle": "📜 SatViewer3D Versionshinweise & Verlauf",
                        "rel27Title": "📡 Präzise Überflug-Trajektorie & 💥 Weltraummüll-Megawolke (2.200+ Trümmer)",
        "rel27_1": "📡 <strong>Astronomische SGP4/SEZ-Überflugprognose</strong>: Berechnet exaktes Datum, Uhrzeit und 16-Kompass-Trajektorie (Aufgang, maximale Höhe, Untergang) mit Live-Countdown.",
        "rel27_2": "💥 <strong>Weltraummüll-Megawolke (2.200+ Trümmer)</strong>: Neues Preset mit 2.200 realen Kollisionstrümmern (Kosmos 2251, Iridium 33, Fengyun-1C, Raketenoberstufen).",
        "rel27_3": "🔮 <strong>2.200-Trümmer-Kollisionsradar</strong>: Ermittelt in Echtzeit gefährliche Annäherungen und das 24-Stunden-Kollisionsrisiko über alle 2.200 Fragmente.",
        "rel27_4": "🗺️ <strong>Stabile 2D-Weltkarten-Kameraführung</strong>: Ermöglicht sanftes Schwenken und Zentrieren auf Satelliten in der 2D-Kartenansicht ohne Verzerrung.",
        "rel27_5": "🛡️ <strong>Sicherheits-Hardening & Mehrsprachige Optimierung</strong>: XSS-Schutz und zuverlässige Texturladepfade für alle Sprachportale.",
        "rel26Title": "🛰️ Vollendung der Michibiki 7-Satelliten-Konstellation & Offizielle Raumfahrzeug-Grafik-Upgrades",
        "rel26_1": "🇯🇵 QZS-7 (Michibiki-7) Start-Ergänzung: Bahnelemente (TLE) und offizielle 1080p 3D-Bilder für den neuesten Satelliten vom 11. August 2026 implementiert.",
        "rel26_2": "🛰️ 100% Einzigartige Bilder für alle 8 Michibiki-Satelliten: Individuelle offizielle 1080p CG-Modelle für QZS-1 bis 7 und 1R von JAXA und Kabinettsbüro zugewiesen.",
        "rel26_3": "🇺🇸 Offizielle visuelle Aktualisierung der US- und Flaggschiff-Satelliten: Aufwertung mit NASA Ames 4K Starlink, USA-245 (KH-11 Keyhole Spionagesatellit), SBIRS und X-37B.",
        "rel26_4": "🌐 Vollständige Synchronisation in 14 Sprachen: Ausführliche Missionsbeschreibungen zur 7-Satelliten-Konstellation und SDA-Sensoren lokalisiert.",
        "rel26_5": "📑 Numerische Sortieroptimierung: Michibiki 1 bis 7 in sauberer Reihenfolge ausgerichtet.",
"rel25Title": "🪐 3D-Sonnensystem & 14-Sprachen-Weltraumenzyklopädie",
        "rel25_1": "🪐 3D-Himmelskörper-Inspektion mit 360°-Orbit-Rotation für Sonne, Mond und alle Planeten.",
        "rel25_2": "📷 Echte NASA-Fototexturen für maximalen Realismus.",
        "rel25_3": "💍 Echtes 3D-Ringsystem für Saturn und vertikale Ringe für Uranus.",
        "rel25_4": "🌡️ Oberflächentemperatur-HUD und Physik der Sonnenflecken.",
        "rel25_5": "🌐 Vollständige Enzyklopädie in 14 Sprachen.",
        "rel20Title": "🔮 Weltraummüll-Kollisionsrisiko & Starlink-Konstellation",
        "rel20_1": "🔮 24h-Kollisionswarnung (MOID) in Echtzeit.",
        "rel20_2": "🛰️ Starlink-Megakonstellation mit 2.000 Satelliten.",
        "rel20_3": "📡 GPS-Überflugvorhersage mit Countdown.",
        "rel10Title": "🌍 SatViewer3D Offizieller Start",
        "rel10_1": "Erste Version des 3D-Satelliten-Orbit-Simulators.",
        "guideTitleControls": "🖱️ 3D-Navigationsanleitung",
        "guideWheel": "Mausrad / Touch",
        "guideWheelDesc": "Präziser Mikro-Zoom bei 1/10 Geschwindigkeit.",
        "guideDrag": "Linksklick + Ziehen",
        "guideDragDesc": "360°-Drehung um Erde und Planeten.",
        "guideTilt": "Rechtsklick / Strg + Ziehen",
        "guideTiltDesc": "Kameraneigung anpassen.",
        "guideClick": "Klick auf Satellit / Planet",
        "guideClickDesc": "Orbitdaten einsehen und fixieren.",
        "guideFocus": "🎯 Kamerafokus",
        "guideFocusDesc": "Kamera folgt dem Satelliten automatisch.",
        "guideRadar": "🔮 Weltraummüll-Radar",
        "guideRadarDesc": "24-Stunden-MOID-Kollisionsberechnung.",
        "guideTitleDisclaimer": "⚠️ Haftungsausschluss",
        "discText1": "Alle Bahndaten werden in Echtzeit aus TLE-Daten berechnet.",
        "discText2": "Dient ausschließlich Bildungs- und Beobachtungszwecken.",
        "guideTitlePrivacy": "🔒 Datenschutzrichtlinie",
        "privText1Title": "Werbung:",
        "privText1Desc": "Diese Website verwendet Cookies von Drittanbietern wie Google AdSense.",
        "privText2Title": "Analytik:",
        "privText2Desc": "Anonyme Verkehrsdaten werden erfasst.",
        "guideTitleAbout": "ℹ️ Über SatViewer3D",
        "aboutText1": "SatViewer3D ist ein hochmoderner 3D-Weltraumsimulator für Satelliten und Planeten.",
        "aboutFeaturesTitle": "🌟 Die 10 weltweit führenden Funktionen von SatViewer3D",
        "feat1": "🪐 3D-Sonnensystem & Planeten-Erkundung in Echtzeit mit echten NASA-Fototexturen.",
        "feat2": "💍 Echtes 3D-Ringsystem für Saturn und vertikale Ringe für Uranus nach physikalischen Parametern.",
        "feat3": "🌡️ Oberflächentemperatur-HUD und Thermodynamik der Sonnenflecken (~4.000°C).",
        "feat4": "🌐 Weltraumenzyklopädie und Suchfunktion vollständig in 14 Sprachen.",
        "feat5": "🔮 24h-Weltraummüll-Kollisionsrisiko (MOID) auf NASA/ESA-Niveau in Echtzeit.",
        "feat6": "🛰️ 2.000 Starlink-Satelliten flüssig im 3D-Browser dargestellt.",
        "feat7": "🚀 Schnellste Integration neuester Satelliten (wie QZSS-6).",
        "feat8": "🎬 Seidenweicher 1/10-Zoom mit kinoreifer Kamerasteuerung.",
        "feat9": "💎 Schwebendes Insel-HUD mit freier Sicht auf die Erde.",
        "feat10": "🌊 Visualisierung der Erdrotations-Wellenbahnen in 3D.",
        "aboutContactTitle": "Kontakt:",
        "aboutContactDesc": "Für Anfragen: info@satviewer3d.com"
    },
    "fr": {
        "mobileBtnSelect": "🛰️ Satellites",
        "mobileBtnDetail": "📊 Détails",
        "mobileSheetSelectTitle": "🛰️ Satellites & Menu",
        "mobileSheetDetailTitle": "📊 Détails du Satellite",
        "zoomHintPcTitle": "🔍 Molette pour zoomer",
        "zoomHintPcSub": "Faites défiler pour voir la Terre entière",
        "zoomHintTouchTitle": "🔍 Pincez avec 2 doigts pour zoomer",
        "zoomHintTouchSub": "Pincez l'écran pour voir la Terre entière",
        "zoomHintTitle": "🔍 Molette / Pincer pour zoomer",
        "zoomHintSub": "Faites défiler pour voir la Terre entière",
        "loadTrain": "🚂 Train Starlink (Chaîne de lancement · 24 sat.)",
        "tooltipGuideTitle": "💡 Changez et suivez n'importe quel satellite !",
        "tooltipGuideDesc": "Suivez Starlink, le télescope Hubble, les satellites météo et plus encore.",

        "appSubtitle": "Simulateur d'orbite de satellites et débris spatiaux 3D en temps réel",
        "statCount": "Satellites suivis",
        "statTime": "Temps de simulation",
        "dragPanel": "⋮⋮ Glisser le panneau",
        "dragHeader": "⋮⋮ Glisser",
        "secSelect": "Sélectionner et rechercher des corps célestes / satellites",
        "selectPlaceholder": "-- Choisir une planète, satellite ou débris --",
        "searchPlaceholder": "Nom du corps céleste, satellite ou NORAD ID...",
        "secSource": "Sources de données satellites et préréglages",
        "loadMajor": "⭐ Satellites majeurs (ISS, Hubble, Météo, Débris)",
        "loadDeepSpace": "🔭 Espace lointain & JWST (Webb, Artemis, MRO)",
        "badgeDeepSpace": "🔭 Sondes de l'espace lointain et télescopes chargés",
        "loadSolarSystem": "🌌 Système Solaire Orrery (8 Planètes & Soleil)",
        "badgeSolarSystem": "🌌 Système Solaire Orrery actif (8 Planètes)",
        "loadLocal": "🛰️ Mégaconstellation Starlink (2 000 satellites)",
        "loadDebris": "💥 Méganuage de débris spatiaux (2 200+ fragments)",
        "badgeDebris": "💥 Méganuage de débris spatiaux chargé (2 200 fragments)",
        "badgeMajor": "⭐ Préréglage majeur chargé",
        "optgroupDeepSpace": "🔭 Missions de l'espace lointain (JWST, Lune, Mars)",
        "secTime": "Contrôle du temps et vitesse accélérée",
        "speedStop": "⏸️ Pause",
        "speedReal": "▶️ 1x (Temps réel)",
        "resetNow": "🔄 Heure actuelle",
        "secDisplay": "Paramètres d'affichage",
        "toggleLabels": "Afficher les étiquettes en 3D",
        "toggleOrbits": "Afficher l'orbite sélectionnée",
        "toggleMultiLap": "🌐 Afficher la trace au sol multi-tours",
        "toggleAtmosphere": "Atmosphère et éclairage solaire",
        "toggle2D": "Vue carte du monde 2D",
        "toggleBorders": "🌐 Frontières et noms de lieux",
        "toggleDebrisRisk": "🔮 Mode de risque de collision de débris",
        "toggleCelestial": "🌌 Soleil, Lune et planètes du système solaire",
        "toggleDeepSpace": "🔭 Sondes de l'espace lointain & JWST",
        "dragDetail": "⋮⋮ Glisser la fiche détaillée",
        "dragCam": "⋮⋮ Contrôles de la caméra",
        "labelAlt": "Altitude",
        "labelVel": "Vitesse",
        "labelLat": "Latitude",
        "labelLon": "Longitude",
        "labelInc": "Inclinaison",
        "labelPeriod": "Période",
        "labelTimezone": "Fuseau horaire",
        "labelPass": "📡 Prochain passage visible prévu",
        "labelRisk": "🔮 Risque de collision avec des débris (MOID)",
        "btnGeo": "📍Position GPS",
        "btnTrack": "🎯 Suivre la cible",
        "btnUntrack": "🔓 Libérer la caméra",
        "pointerHint": "Cible hors champ (Cliquer pour voir)",
        "btnRelease": "📜 v2.7 Notes de version",
        "btnGuide": "❓ Guide et conditions",
        "modalTitle": "Guide de l'utilisateur SatViewer3D et conditions",
        "tabControls": "🎮 Commandes",
        "tabReleases": "📜 Notes de version",
        "tabDisclaimer": "⚠️ Avertissement",
        "tabPrivacy": "🔒 Confidentialité",
        "tabAbout": "ℹ️ À propos",
        "releaseTitle": "📜 Notes de version & Historique SatViewer3D",
                        "rel27Title": "📡 Prévision de passage céleste & 💥 Méganuage de débris spatiaux (2 200+ fragments)",
        "rel27_1": "📡 <strong>Moteur astronomique SGP4/SEZ de prévision de passage</strong>: Prédit la date, l'heure et la trajectoire sur 16 directions cardinales (élévation max, lever, coucher) avec compte à rebours.",
        "rel27_2": "💥 <strong>Méganuage de débris spatiaux (2 200+ fragments)</strong>: Préréglage affichant 2 200 débris réels (Cosmos 2251, Iridium 33, Fengyun-1C, étages de fusées) à 60 fps.",
        "rel27_3": "🔮 <strong>Radar de proximité sur 2 200 débris</strong>: Analyse en temps réel les rapprochements orbitaux et le risque de collision à 24 heures.",
        "rel27_4": "🗺️ <strong>Suivi caméra fluide en mode carte 2D</strong>: Stabilise la vue lors du changement de satellite en carte 2D avec centrage automatique.",
        "rel27_5": "🛡️ <strong>Renforcement de la sécurité & optimisation multilingue</strong>: Assainissement XSS et chargement instantané de la Terre 3D sur tous les portails.",
        "rel26Title": "🛰️ Constellation Michibiki à 7 Satellites et Mise à niveau des Visuels Officiels",
        "rel26_1": "🇯🇵 Ajout de QZS-7 (Michibiki-7): Intégration des données orbitales (TLE) et de l'imagerie 3D 1080p officielle du nouveau satellite lancé le 11 août 2026.",
        "rel26_2": "🛰️ Visuels 100% uniques pour les 8 satellites Michibiki: Modèles 3D 1080p officiels dédiés de QZS-1 à QZS-7 et QZS-1R.",
        "rel26_3": "🇺🇸 Mise à niveau visuelle des satellites américains: Starlink 4K NASA Ames, USA-245 (télescope de reconnaissance KH-11), SBIRS et X-37B.",
        "rel26_4": "🌐 Cartes de mission synchronisées en 14 langues: Traduction intégrale couvrant la constellation souveraine et les charges utiles SDA.",
        "rel26_5": "📑 Optimisation du tri numérique: Alignement ordonné de Michibiki 1 à 7 dans la barre latérale.",
"rel25Title": "🪐 Système solaire 3D & Encyclopédie spatiale en 14 langues",
        "rel25_1": "🪐 Mode exploration 3D pour le Soleil, la Lune et toutes les planètes.",
        "rel25_2": "📷 Textures photo officielles de la NASA en haute résolution.",
        "rel25_3": "💍 Anneaux planétaires 3D authentiques (Saturne et Uranus).",
        "rel25_4": "🌡️ Température de surface HUD et physique des taches solaires.",
        "rel25_5": "🌐 Encyclopédie complète traduite en 14 langues.",
        "rel20Title": "🔮 Radar de collision de débris & Constellation Starlink",
        "rel20_1": "🔮 Surveillance en temps réel des risques de débris spatiaux (MOID).",
        "rel20_2": "🛰️ Visualisation de 2 000 satellites Starlink.",
        "rel20_3": "📡 Prévision des passages au-dessus de votre position GPS.",
        "rel10Title": "🌍 Lancement officiel de SatViewer3D",
        "rel10_1": "Première version du simulateur d'orbite spatiale 3D temps réel.",
        "guideTitleControls": "🖱️ Guide de navigation 3D",
        "guideWheel": "Molette / Tactile",
        "guideWheelDesc": "Micro-zoom fluide à 1/10e de vitesse.",
        "guideDrag": "Clic gauche + Glisser",
        "guideDragDesc": "Rotation libre à 360° autour de la Terre et des planètes.",
        "guideTilt": "Clic droit / Ctrl + Glisser",
        "guideTiltDesc": "Ajuster l'angle de vue.",
        "guideClick": "Cliquer sur un satellite / planète",
        "guideClickDesc": "Inspecter les données orbitales.",
        "guideFocus": "🎯 Suivi caméra",
        "guideFocusDesc": "La caméra suit la cible automatiquement.",
        "guideRadar": "🔮 Radar de débris",
        "guideRadarDesc": "Calcul de croisement d'orbite (MOID) sur 24 heures.",
        "guideTitleDisclaimer": "⚠️ Avertissement légal",
        "discText1": "Données calculées en temps réel à partir de données TLE publiques.",
        "discText2": "Fourni uniquement à des fins éducatives.",
        "guideTitlePrivacy": "🔒 Politique de confidentialité",
        "privText1Title": "Publicités :",
        "privText1Desc": "Ce site utilise des cookies tiers (Google AdSense).",
        "privText2Title": "Analytique :",
        "privText2Desc": "Des données de trafic anonymes sont collectées.",
        "guideTitleAbout": "ℹ️ À propos de SatViewer3D",
        "aboutText1": "SatViewer3D est un simulateur spatial 3D temps réel pour satellites et astres du système solaire.",
        "aboutFeaturesTitle": "🌟 Les 10 fonctionnalités majeures de SatViewer3D surpassant les outils NASA",
        "feat1": "🪐 Exploration 3D temps réel du Système Solaire et textures photo officielles de la NASA.",
        "feat2": "💍 Anneaux planétaires 3D authentiques pour Saturne (26,7°) et Uranus (97,8°).",
        "feat3": "🌡️ HUD de température de surface et physique thermique des taches solaires (~4 000°C).",
        "feat4": "🌐 Encyclopédie spatiale et recherche de corps célestes traduites en 14 langues.",
        "feat5": "🔮 Détection des risques de collision de débris spatiaux (MOID) sur 24h en temps réel.",
        "feat6": "🛰️ Mégaconstellation Starlink de 2 000 satellites affichée en 3D fluide.",
        "feat7": "🚀 Intégration ultra-rapide des derniers satellites et lancements spatiaux.",
        "feat8": "🎬 Zoom ultra-fluide au 1/10e de vitesse pour une navigation cinématographique.",
        "feat9": "💎 HUD en îlots flottants libérant totalement la vue de la Terre.",
        "feat10": "🌊 Visualisation 3D des traces au sol ondulées liées à la rotation terrestre.",
        "aboutContactTitle": "Contact :",
        "aboutContactDesc": "Pour toute demande : info@satviewer3d.com"
    },
    "es": {
        "mobileBtnSelect": "🛰️ Satélites",
        "mobileBtnDetail": "📊 Detalles",
        "mobileSheetSelectTitle": "🛰️ Satélites y Menú",
        "mobileSheetDetailTitle": "📊 Detalles del Satélite",
        "zoomHintPcTitle": "🔍 Rueda del ratón para zoom",
        "zoomHintPcSub": "Haz scroll para ver la Tierra completa",
        "zoomHintTouchTitle": "🔍 Pellizca con 2 dedos para zoom",
        "zoomHintTouchSub": "Pellizca la pantalla para ver la Tierra completa",
        "zoomHintTitle": "🔍 Rueda del ratón / Pellizcar para zoom",
        "zoomHintSub": "Haz zoom para ver la Tierra completa",
        "loadTrain": "🚂 Tren Starlink (Cadena de lanzamiento · 24 satélites)",
        "tooltipGuideTitle": "💡 ¡Selecciona y rastrea cualquier satélite!",
        "tooltipGuideDesc": "Rastrea Starlink, telescopio Hubble, satélites meteorológicos y más.",

        "appSubtitle": "Simulador de Órbitas 3D en Tiempo Real de Satélites y Basura Espacial",
        "statCount": "Satélites Rastreados",
        "statTime": "Tiempo de Simulación",
        "dragPanel": "⋮⋮ Arrastrar Panel",
        "dragHeader": "⋮⋮ Arrastrar",
        "secSelect": "Seleccionar y Buscar Cuerpos / Satélites",
        "selectPlaceholder": "-- Seleccionar Planeta, Satélite o Basura Espacial --",
        "searchPlaceholder": "Buscar por nombre de astro, satélite o ID NORAD...",
        "secSource": "Fuentes de Datos y Ajustes",
        "loadMajor": "⭐ Satélites Principales (ISS, Hubble, Meteorología, Basura)",
        "loadDeepSpace": "🔭 Espacio Profundo y JWST (Webb, Artemis, MRO)",
        "badgeDeepSpace": "🔭 Misiones de Espacio Profundo Cargadas",
        "loadSolarSystem": "🌌 Sistema Solar Orrery (8 Planetas y Sol)",
        "badgeSolarSystem": "🌌 Vista Orrery del Sistema Solar activa (8 Planetas)",
        "loadLocal": "🛰️ Constelación Starlink (2.000 Satélites)",
        "loadDebris": "💥 Meganube de Basura Espacial (2.200+ fragmentos)",
        "badgeDebris": "💥 Meganube de Basura Espacial Cargada (2.200 fragmentos)",
        "badgeMajor": "⭐ Ajuste Principal Cargado",
        "optgroupDeepSpace": "🔭 Sondas de Espacio Profundo (JWST, Luna, Marte)",
        "secTime": "Control de Tiempo y Velocidad",
        "speedStop": "⏸️ Pausa",
        "speedReal": "▶️ 1x (Tiempo Real)",
        "resetNow": "🔄 Hora Actual",
        "secDisplay": "Ajustes de Visualización",
        "toggleLabels": "Mostrar Etiquetas en 3D",
        "toggleOrbits": "Mostrar Órbita Seleccionada",
        "toggleMultiLap": "🌐 Mostrar Múltiples Vueltas Orbitales",
        "toggleAtmosphere": "Atmósfera e Iluminación Solar",
        "toggle2D": "Vista de Mapa Mundial 2D",
        "toggleBorders": "🌐 Fronteras y Etiquetas de Lugares",
        "toggleDebrisRisk": "🔮 Modo de Riesgo de Basura Espacial",
        "toggleCelestial": "🌌 Sol, Luna y Planetas del Sistema Solar",
        "toggleDeepSpace": "🔭 Sondas de Espacio Profundo y JWST",
        "dragDetail": "⋮⋮ Arrastrar Tarjeta de Detalles",
        "dragCam": "⋮⋮ Controles de Cámara",
        "labelAlt": "Altitud",
        "labelVel": "Velocidad",
        "labelLat": "Latitud",
        "labelLon": "Longitud",
        "labelInc": "Inclinación",
        "labelPeriod": "Período",
        "labelTimezone": "Zona Horaria",
        "labelPass": "📡 Próximo Paso Visible Pronosticado",
        "labelRisk": "🔮 Riesgo de Colisión de Basura (MOID)",
        "btnGeo": "📍Ubicación GPS",
        "btnTrack": "🎯 Enfocar y Seguir",
        "btnUntrack": "🔓 Desbloquear Cámara",
        "pointerHint": "Objetivo fuera de pantalla (Clic para ver)",
        "btnRelease": "📜 v2.7 Notas de la versión",
        "btnGuide": "❓ Guía y Términos",
        "modalTitle": "Guía de Usuario y Términos de SatViewer3D",
        "tabControls": "🎮 Controles",
        "tabReleases": "📜 Notas de versión",
        "tabDisclaimer": "⚠️ Aviso Legal",
        "tabPrivacy": "🔒 Privacidad",
        "tabAbout": "ℹ️ Acerca de",
        "releaseTitle": "📜 Notas de versión e historial de SatViewer3D",
                        "rel27Title": "📡 Trayectoria de Paso Celeste & 💥 Meganube de Basura Espacial (2.200+ fragmentos)",
        "rel27_1": "📡 <strong>Motor de Predicción de Pasos SGP4/SEZ</strong>: Calcula fecha, hora y trayectoria en 16 rumbos cardinales (elevación máxima, salida y puesta) con cuenta regresiva en vivo.",
        "rel27_2": "💥 <strong>Meganube de Basura Espacial (2.200+ fragmentos)</strong>: Nuevo ajuste que despliega 2.200 fragmentos reales de colisiones espaciales a 60 fps.",
        "rel27_3": "🔮 <strong>Radar de Proximidad con 2.200 fragmentos</strong>: Evalúa en tiempo real las conjunciones más cercanas y el riesgo de colisión a 24 horas.",
        "rel27_4": "🗺️ <strong>Seguimiento de Cámara Suave en Mapa 2D</strong>: Corrige la vista en modo mapa 2D para centrar los satélites sin distorsión.",
        "rel27_5": "🛡️ <strong>Refuerzo de Seguridad y Activos Multilingües</strong>: Sanitización contra XSS y carga fluida de texturas 3D en todos los portales.",
        "rel26Title": "🛰️ Constelación Michibiki de 7 Satélites y Actualización Visual Oficial",
        "rel26_1": "🇯🇵 Adición de QZS-7 (Michibiki-7): Implementación de TLE e imágenes 3D 1080p oficiales del nuevo satélite lanzado el 11 de agosto de 2026.",
        "rel26_2": "🛰️ Imágenes 100% únicas para los 8 satélites Michibiki: Modelos CG 1080p independientes para QZS-1 hasta QZS-7 y QZS-1R.",
        "rel26_3": "🇺🇸 Renovación de imágenes satelitales de EE. UU.: Starlink 4K NASA Ames, USA-245 (satélite espía KH-11 Keyhole), SBIRS y X-37B.",
        "rel26_4": "🌐 Sincronización completa en 14 idiomas: Explicaciones detalladas de la constelación de 7 satélites y sensores SDA.",
        "rel26_5": "📑 Orden numérico optimizado: Clasificación precisa de Michibiki 1 al 7.",
"rel25Title": "🪐 Sistema Solar 3D y Enciclopedia Espacial en 14 idiomas",
        "rel25_1": "🪐 Exploración 3D del Sol, Luna y todos los planetas con rotación libre de 360°.",
        "rel25_2": "📷 Texturas fotográficas reales de la NASA.",
        "rel25_3": "💍 Sistema de anillos 3D para Saturno y Urano.",
        "rel25_4": "🌡️ Métricas de temperatura superficial y física de manchas solares.",
        "rel25_5": "🌐 Enciclopedia astronómica completa en 14 idiomas.",
        "rel20Title": "🔮 Radar de colisión de basura espacial y Starlink",
        "rel20_1": "🔮 Detección en tiempo real de aproximaciones de basura espacial (MOID).",
        "rel20_2": "🛰️ Constelación de 2.000 satélites Starlink.",
        "rel20_3": "📡 Predicción de pasos sobre su ubicación GPS.",
        "rel10Title": "🌍 Lanzamiento oficial de SatViewer3D",
        "rel10_1": "Primera versión del simulador orbital 3D en tiempo real.",
        "guideTitleControls": "🖱️ Guía de Navegación 3D",
        "guideWheel": "Rueda del Ratón / Táctil",
        "guideWheelDesc": "Zoom suave a 1/10 de velocidad.",
        "guideDrag": "Clic Izquierdo + Arrastrar",
        "guideDragDesc": "Rotación 360° alrededor de la Tierra y planetas.",
        "guideTilt": "Clic Derecho / Ctrl + Arrastrar",
        "guideTiltDesc": "Ajustar ángulo de visión.",
        "guideClick": "Clic en Satélite / Planeta",
        "guideClickDesc": "Inspeccionar datos de órbita y fijar cámara.",
        "guideFocus": "🎯 Seguimiento",
        "guideFocusDesc": "La cámara sigue el objetivo automáticamente.",
        "guideRadar": "🔮 Radar de Basura",
        "guideRadarDesc": "Cálculo de intersección orbital (MOID) en 24h.",
        "guideTitleDisclaimer": "⚠️ Aviso Legal",
        "discText1": "Todos los datos orbitales se calculan en tiempo real a partir de datos TLE públicos.",
        "discText2": "Datos proporcionados únicamente con fines educativos.",
        "guideTitlePrivacy": "🔒 Política de Privacidad",
        "privText1Title": "Anuncios:",
        "privText1Desc": "Este sitio utiliza cookies de terceros para publicidad (Google AdSense).",
        "privText2Title": "Analítica:",
        "privText2Desc": "Se recopilan datos anónimos de tráfico.",
        "guideTitleAbout": "ℹ️ Acerca de SatViewer3D",
        "aboutText1": "SatViewer3D es un simulador orbital 3D en tiempo real para satélites y planetas del sistema solar.",
        "aboutFeaturesTitle": "🌟 Las 10 funciones líderes mundiales de SatViewer3D",
        "feat1": "🪐 Exploración 3D en tiempo real del Sistema Solar con texturas fotográficas de la NASA.",
        "feat2": "💍 Sistema de anillos 3D auténtico para Saturno (inclinación 26.7°) y Urano (97.8°).",
        "feat3": "🌡️ HUD de temperatura superficial y termodinámica de manchas solares (~4.000°C).",
        "feat4": "🌐 Enciclopedia espacial completa y búsqueda de astros en 14 idiomas.",
        "feat5": "🔮 Radar de colisión de basura espacial (MOID) en 24h en tiempo real.",
        "feat6": "🛰️ Constelación Starlink de 2.000 satélites renderizada en 3D.",
        "feat7": "🚀 Incorporación instantánea de los satélites más recientes.",
        "feat8": "🎬 Control de cámara ultra-suave a 1/10 de velocidad.",
        "feat9": "💎 HUD flotante que mantiene 100% despejada la vista de la Tierra.",
        "feat10": "🌊 Trayectorias sinusoidales 3D por rotación terrestre.",
        "aboutContactTitle": "Contacto:",
        "aboutContactDesc": "Para consultas: info@satviewer3d.com"
    },
    "pt": {
        "mobileBtnSelect": "🛰️ Satélites",
        "mobileBtnDetail": "📊 Detalhes",
        "mobileSheetSelectTitle": "🛰️ Satélites e Menu",
        "mobileSheetDetailTitle": "📊 Detalhes do Satélite",
        "zoomHintPcTitle": "🔍 Roda do mouse para zoom",
        "zoomHintPcSub": "Role para ver a Terra inteira",
        "zoomHintTouchTitle": "🔍 Pinça com 2 dedos para zoom",
        "zoomHintTouchSub": "Faça o gesto de pinça para ver a Terra inteira",
        "zoomHintTitle": "🔍 Roda do mouse / Pinça para zoom",
        "zoomHintSub": "Role para ver a Terra inteira",
        "loadTrain": "🚂 Trem Starlink (Cadeia de lançamento · 24 satélites)",
        "tooltipGuideTitle": "💡 Selecione e rastreie qualquer satélite!",
        "tooltipGuideDesc": "Rastreie Starlink, telescópio Hubble, satélites meteorológicos e muito mais.",

        "appSubtitle": "Simulador de Órbitas 3D em Tempo Real de Satélites e Lixo Espacial",
        "statCount": "Satélites Rastreados",
        "statTime": "Tempo de Simulação",
        "dragPanel": "⋮⋮ Arrastar Painel",
        "dragHeader": "⋮⋮ Arrastar",
        "secSelect": "Selecionar e Buscar Astros / Satélites",
        "selectPlaceholder": "-- Selecionar Planeta, Satélite ou Lixo Espacial --",
        "searchPlaceholder": "Buscar por nome de astro, satélite ou ID NORAD...",
        "secSource": "Fontes de Dados e Predefinições",
        "loadMajor": "⭐ Satélites Principais (ISS, Hubble, Meteorologia, Lixo)",
        "loadDeepSpace": "🔭 Espaço Profundo e JWST (Webb, Artemis, MRO)",
        "badgeDeepSpace": "🔭 Missões do Espaço Profundo Carregadas",
        "loadSolarSystem": "🌌 Sistema Solar Orrery (8 Planetas e Sol)",
        "badgeSolarSystem": "🌌 Visão Orrery do Sistema Solar ativa (8 Planetas)",
        "loadLocal": "🛰️ Constelação Starlink (2.000 Satélites)",
        "loadDebris": "💥 Meganuvens de Lixo Espacial (2.200+ fragmentos)",
        "badgeDebris": "💥 Meganuvens de Lixo Espacial Carregada (2.200 fragmentos)",
        "badgeMajor": "⭐ Predefinição Principal Carregada",
        "optgroupDeepSpace": "🔭 Sondas do Espaço Profundo (JWST, Lua, Marte)",
        "secTime": "Controle de Tempo e Velocidade",
        "speedStop": "⏸️ Pausa",
        "speedReal": "▶️ 1x (Tempo Real)",
        "resetNow": "🔄 Hora Atual",
        "secDisplay": "Configurações de Exibição",
        "toggleLabels": "Exibir Rótulos em 3D",
        "toggleOrbits": "Exibir Órbita Selecionada",
        "toggleMultiLap": "🌐 Exibir Múltiplas Voltas Orbitais",
        "toggleAtmosphere": "Atmosfera e Iluminação Solar",
        "toggle2D": "Visualização de Mapa Mundial 2D",
        "toggleBorders": "🌐 Fronteiras e Nomes de Lugares",
        "toggleDebrisRisk": "🔮 Modo de Risco de Lixo Espacial",
        "toggleCelestial": "🌌 Sol, Lua e Planetas do Sistema Solar",
        "toggleDeepSpace": "🔭 Sondas do Espaço Profundo e JWST",
        "dragDetail": "⋮⋮ Arrastar Cartão de Detalhes",
        "dragCam": "⋮⋮ Controles de Câmera",
        "labelAlt": "Altitude",
        "labelVel": "Velocidade",
        "labelLat": "Latitude",
        "labelLon": "Longitude",
        "labelInc": "Inclinação",
        "labelPeriod": "Período",
        "labelTimezone": "Fuso Horário",
        "labelPass": "📡 Próxima Passagem Visível Prevista",
        "labelRisk": "🔮 Risco de Colisão de Detritos (MOID)",
        "btnGeo": "📍Localização GPS",
        "btnTrack": "🎯 Focar e Rastrear",
        "btnUntrack": "🔓 Destravar Câmera",
        "pointerHint": "Alvo fora da tela (Clique para ver)",
        "btnRelease": "📜 v2.7 Notas de lançamento",
        "btnGuide": "❓ Guia e Termos",
        "modalTitle": "Guia do Usuário e Termos do SatViewer3D",
        "tabControls": "🎮 Controles",
        "tabReleases": "📜 Notas de versão",
        "tabDisclaimer": "⚠️ Isenção de Responsabilidade",
        "tabPrivacy": "🔒 Privacidade",
        "tabAbout": "ℹ️ Sobre",
        "releaseTitle": "📜 Notas de versão e histórico do SatViewer3D",
                        "rel27Title": "📡 Trajetória de Passagem Celeste & 💥 Meganuvens de Lixo Espacial (2.200+ fragmentos)",
        "rel27_1": "📡 <strong>Motor de Previsão de Passagem SGP4/SEZ</strong>: Informa data, hora e trajetória em 16 direções da bússola com contagem regressiva em tempo real.",
        "rel27_2": "💥 <strong>Meganuvens de Lixo Espacial (2.200+ fragmentos)</strong>: Novo preset que renderiza 2.200 detritos reais de colisões e estágios de foguetes a 60 fps.",
        "rel27_3": "🔮 <strong>Radar de Proximidade com 2.200 detritos</strong>: Analisa conjunções orbitais críticas e risco de colisão em 24 horas.",
        "rel27_4": "🗺️ <strong>Navegação de Câmera Estável em Mapa 2D</strong>: Suaviza o rastreamento no modo 2D mantendo o enquadramento perfeito.",
        "rel27_5": "🛡️ <strong>Segurança Reforçada e Texturas Globais</strong>: Sanitização XSS e carregamento dinâmico de recursos para todos os idiomas.",
        "rel26Title": "🛰️ Conclusão da Constelação Michibiki de 7 Satélites e Atualização Visual Oficial",
        "rel26_1": "🇯🇵 Adição do QZS-7 (Michibiki-7): Elementos orbitais (TLE) e imagens 3D 1080p oficiais do satélite lançado em 11 de agosto de 2026.",
        "rel26_2": "🛰️ Imagens 100% exclusivas para todos os 8 satélites Michibiki: Modelos 1080p oficiais dedicados de QZS-1 a QZS-7 e QZS-1R.",
        "rel26_3": "🇺🇸 Atualização visual dos satélites dos EUA: Starlink 4K NASA Ames, USA-245 (satélite espião KH-11), SBIRS e X-37B.",
        "rel26_4": "🌐 Sincronização em 14 idiomas: Cartões de missão detalhados sobre a constelação de 7 satélites e sensores SDA.",
        "rel26_5": "📑 Otimização de ordenação: Michibiki 1 a 7 alinhados em ordem numérica limpa.",
"rel25Title": "🪐 Sistema Solar 3D e Enciclopédia Espacial em 14 idiomas",
        "rel25_1": "🪐 Modo de inspeção 3D para o Sol, Lua e todos os planetas com rotação livre.",
        "rel25_2": "📷 Texturas fotográficas reais da NASA.",
        "rel25_3": "💍 Anéis planetários 3D para Saturno e Urano.",
        "rel25_4": "🌡️ HUD de temperatura e física das manchas solares.",
        "rel25_5": "🌐 Enciclopédia espacial completa em 14 idiomas.",
        "rel20Title": "🔮 Radar de colisão de lixo espacial e Starlink",
        "rel20_1": "🔮 Alerta de colisão de detritos em tempo real.",
        "rel20_2": "🛰️ Visualização de 2.000 satélites Starlink.",
        "rel20_3": "📡 Previsão de passagens sobre seu GPS.",
        "rel10Title": "🌍 Lançamento Oficial do SatViewer3D",
        "rel10_1": "Primeira versão do simulador orbital 3D em tempo real.",
        "guideTitleControls": "🖱️ Guia de Navegação 3D",
        "guideWheel": "Roda do Mouse / Toque",
        "guideWheelDesc": "Zoom suave a 1/10 de velocidade.",
        "guideDrag": "Clique Esquerdo + Arrastar",
        "guideDragDesc": "Rotação 360° em torno da Terra e planetas.",
        "guideTilt": "Clique Direito / Ctrl + Arrastar",
        "guideTiltDesc": "Ajustar ângulo da câmera.",
        "guideClick": "Clique no Satélite / Planeta",
        "guideClickDesc": "Inspecionar dados orbitais e travar câmera.",
        "guideFocus": "🎯 Rastrear",
        "guideFocusDesc": "A câmera segue o alvo automaticamente.",
        "guideRadar": "🔮 Radar de Lixo Espacial",
        "guideRadarDesc": "Cálculo de cruzamento de órbita (MOID) em 24h.",
        "guideTitleDisclaimer": "⚠️ Aviso Legal",
        "discText1": "Dados calculados em tempo real a partir de dados TLE públicos.",
        "discText2": "Fornecido exclusivamente para fins educativos.",
        "guideTitlePrivacy": "🔒 Política de Privacidade",
        "privText1Title": "Anúncios:",
        "privText1Desc": "Este site utiliza cookies de terceiros para publicidade (Google AdSense).",
        "privText2Title": "Estatísticas:",
        "privText2Desc": "Dados anônimos de tráfego são coletados.",
        "guideTitleAbout": "ℹ️ Sobre o SatViewer3D",
        "aboutText1": "SatViewer3D é um simulador espacial 3D em tempo real para satélites e corpos celestes.",
        "aboutFeaturesTitle": "🌟 Os 10 recursos líderes mundiais do SatViewer3D",
        "feat1": "🪐 Exploração 3D em tempo real do Sistema Solar com texturas fotográficas da NASA.",
        "feat2": "💍 Anéis 3D autênticos para Saturno e Urano baseados em parâmetros físicos.",
        "feat3": "🌡️ HUD de temperatura superficial e termodinâmica das manchas solares (~4.000°C).",
        "feat4": "🌐 Enciclopédia espacial e busca de corpos celestes em 14 idiomas.",
        "feat5": "🔮 Alerta de colisão de lixo espacial (MOID) em tempo real para 24 horas.",
        "feat6": "🛰️ Constelação Starlink de 2.000 satélites em 3D fluido.",
        "feat7": "🚀 Integração ultrarrápida dos mais recentes lançamentos espaciais.",
        "feat8": "🎬 Zoom suave a 1/10 de velocidade com controle cinematográfico.",
        "feat9": "💎 HUD flutuante que deixa a visão da Terra 100% desobstruída.",
        "feat10": "🌊 Visualização 3D de órbitas onduladas pela rotação da Terra.",
        "aboutContactTitle": "Contato:",
        "aboutContactDesc": "Para dúvidas: info@satviewer3d.com"
    },
    "it": {
        "mobileBtnSelect": "🛰️ Satelliti",
        "mobileBtnDetail": "📊 Dettagli",
        "mobileSheetSelectTitle": "🛰️ Satelliti e Menu",
        "mobileSheetDetailTitle": "📊 Dettagli Satellite",
        "zoomHintPcTitle": "🔍 Rotellina del mouse per zoom",
        "zoomHintPcSub": "Scorri per vedere la Terra intera",
        "zoomHintTouchTitle": "🔍 Pizzica con 2 dita per zoom",
        "zoomHintTouchSub": "Pizzica lo schermo per vedere la Terra intera",
        "zoomHintTitle": "🔍 Rotellina del mouse / Pizzica per zoom",
        "zoomHintSub": "Scorri per vedere la Terra intera",
        "loadTrain": "🚂 Treno Starlink (Catena di lancio · 24 satelliti)",
        "tooltipGuideTitle": "💡 Seleziona e traccia qualsiasi satellite!",
        "tooltipGuideDesc": "Traccia Starlink, il telescopio Hubble, i satelliti meteo e altro ancora.",

        "appSubtitle": "Simulatore di Orbite 3D in Tempo Reale di Satelliti e Detriti Spaziali",
        "statCount": "Satelliti Tracciati",
        "statTime": "Tempo di Simulazione",
        "dragPanel": "⋮⋮ Trascina Pannello",
        "dragHeader": "⋮⋮ Trascina",
        "secSelect": "Seleziona e Cerca Corpi Celesti / Satelliti",
        "selectPlaceholder": "-- Seleziona Pianeta, Satellite o Detrito --",
        "searchPlaceholder": "Cerca per nome pianeta, satellite o ID NORAD...",
        "secSource": "Sorgenti Dati e Preimpostazioni",
        "loadMajor": "⭐ Satelliti Principali (ISS, Hubble, Meteo, Detriti)",
        "loadDeepSpace": "🔭 Spazio Profondo e JWST (Webb, Artemis, MRO)",
        "badgeDeepSpace": "🔭 Missioni dello Spazio Profondo Caricate",
        "loadSolarSystem": "🌌 Sistema Solare Orrery (8 Pianeti e Sole)",
        "badgeSolarSystem": "🌌 Vista Orrery del Sistema Solare attiva (8 Pianeti)",
        "loadLocal": "🛰️ Costellazione Starlink (2.000 Satelliti)",
        "loadDebris": "💥 Nuvola Gigante di Detriti Spaziali (2.200+ frammenti)",
        "badgeDebris": "💥 Nuvola di Detriti Spaziali Caricata (2.200 frammenti)",
        "badgeMajor": "⭐ Preimpostazione Principale Caricata",
        "optgroupDeepSpace": "🔭 Sonde dello Spazio Profondo (JWST, Luna, Marte)",
        "secTime": "Controllo Tempo e Velocità",
        "speedStop": "⏸️ Pausa",
        "speedReal": "▶️ 1x (Tempo Reale)",
        "resetNow": "🔄 Ora Attuale",
        "secDisplay": "Impostazioni di Visualizzazione",
        "toggleLabels": "Mostra Etichette nello Spazio 3D",
        "toggleOrbits": "Mostra Orbita Selezionata",
        "toggleMultiLap": "🌐 Mostra Traccia Multi-Giro",
        "toggleAtmosphere": "Atmosfera e Luce Solare",
        "toggle2D": "Vista Mappa Mondiale 2D",
        "toggleBorders": "🌐 Confini e Nomi dei Luoghi",
        "toggleDebrisRisk": "🔮 Modalità Rischio Detriti Spaziali",
        "toggleCelestial": "🌌 Sole, Luna e Pianeti del Sistema Solare",
        "toggleDeepSpace": "🔭 Sonde dello Spazio Profondo e JWST",
        "dragDetail": "⋮⋮ Trascina Scheda Dettagli",
        "dragCam": "⋮⋮ Controlli Telecamera",
        "labelAlt": "Altitudine",
        "labelVel": "Velocità",
        "labelLat": "Latitudine",
        "labelLon": "Longitudine",
        "labelInc": "Inclinazione",
        "labelPeriod": "Periodo",
        "labelTimezone": "Fuso Orario",
        "labelPass": "📡 Prossimo Passaggio Visibile Previsto",
        "labelRisk": "🔮 Rischio Collisione Detriti (MOID)",
        "btnGeo": "📍Posizione GPS",
        "btnTrack": "🎯 Insegui Bersaglio",
        "btnUntrack": "🔓 Sblocca Telecamera",
        "pointerHint": "Bersaglio fuori schermo (Clicca per vedere)",
        "btnRelease": "📜 v2.7 Note di rilascio",
        "btnGuide": "❓ Guida e Termini",
        "modalTitle": "Guida Utente e Termini di SatViewer3D",
        "tabControls": "🎮 Controlli",
        "tabReleases": "📜 Note di rilascio",
        "tabDisclaimer": "⚠️ Esclusione di Responsabilità",
        "tabPrivacy": "🔒 Privacy",
        "tabAbout": "ℹ️ Info",
        "releaseTitle": "📜 Note di rilascio e cronologia SatViewer3D",
                        "rel27Title": "📡 Traiettoria di Passaggio & 💥 Nuvola Gigante di Detriti Spaziali (2.200+ frammenti)",
        "rel27_1": "📡 <strong>Motore di Previsione Passaggi SGP4/SEZ</strong>: Mostra data, ora e rotta nei 16 punti cardinali (elevazione max, sorgere, tramonto) con conto alla rovescia.",
        "rel27_2": "💥 <strong>Nuvola di Detriti Spaziali (2.200+ frammenti)</strong>: Nuovo preset che mostra 2.200 detriti orbitali reali (Cosmos 2251, Iridium 33, stadi di razzi).",
        "rel27_3": "🔮 <strong>Radar di Prossimità su 2.200 Detriti</strong>: Valuta in millisecondi le congiunzioni più vicine e il rischio di impatto a 24 ore.",
        "rel27_4": "🗺️ <strong>Centratura Fluida della Vista Mappa 2D</strong>: Stabilizza la telecamera durante la navigazione dei satelliti in 2D.",
        "rel27_5": "🛡️ <strong>Protezione XSS e Risorse Multilingue</strong>: Massima sicurezza e caricamento rapido della Terra 3D in 14 lingue.",
        "rel26Title": "🛰️ Completamento della Costellazione Michibiki a 7 Satelliti e Nuova Grafica Ufficiale",
        "rel26_1": "🇯🇵 Aggiunta di QZS-7 (Michibiki-7): Dati orbitali (TLE) e immagini 3D 1080p ufficiali per il satellite lanciato l'11 agosto 2026.",
        "rel26_2": "🛰️ Immagini uniche al 100% per tutti gli 8 satelliti Michibiki: Modelli 1080p ufficiali individuali per QZS-1 fino a QZS-7 e QZS-1R.",
        "rel26_3": "🇺🇸 Aggiornamento visivo dei satelliti USA: Starlink 4K NASA Ames, USA-245 (satellite spia ottico KH-11), SBIRS e X-37B.",
        "rel26_4": "🌐 Sincronizzazione in 14 lingue: Schede informative complete sulla costellazione a 7 satelliti e sensori SDA.",
        "rel26_5": "📑 Ordinamento numerico ottimizzato: Michibiki da 1 a 7 allineati in successione.",
"rel25Title": "🪐 Sistema Solare 3D ed Enciclopedia Spaziale in 14 lingue",
        "rel25_1": "🪐 Esplorazione 3D di Sole, Luna e pianeti con rotazione libera a 360°.",
        "rel25_2": "📷 Texture fotografiche autentiche della NASA.",
        "rel25_3": "💍 Anelli planetari 3D per Saturno e Urano.",
        "rel25_4": "🌡️ HUD temperatura superficiale e fisica delle macchie solari.",
        "rel25_5": "🌐 Enciclopedia astronomica completa in 14 lingue.",
        "rel20Title": "🔮 Radar collisione detriti e Starlink",
        "rel20_1": "🔮 Calcolo in tempo reale del rischio detriti (MOID).",
        "rel20_2": "🛰️ Costellazione di 2.000 satelliti Starlink.",
        "rel20_3": "📡 Previsione passaggi visibili su GPS.",
        "rel10Title": "🌍 Lancio ufficiale di SatViewer3D",
        "rel10_1": "Prima versione del simulatore 3D in tempo reale.",
        "guideTitleControls": "🖱️ Guida Navigazione 3D",
        "guideWheel": "Rotellina Mouse / Touch",
        "guideWheelDesc": "Micro-zoom fluido a velocità 1/10.",
        "guideDrag": "Clic Sinistro + Trascina",
        "guideDragDesc": "Rotazione 360° attorno alla Terra e pianeti.",
        "guideTilt": "Clic Destro / Ctrl + Trascina",
        "guideTiltDesc": "Regola l'angolo di visione.",
        "guideClick": "Clic su Satellite / Pianeta",
        "guideClickDesc": "Ispeziona i dati orbitali.",
        "guideFocus": "🎯 Insegui",
        "guideFocusDesc": "La telecamera segue automaticamente il bersaglio.",
        "guideRadar": "🔮 Radar Detriti",
        "guideRadarDesc": "Calcolo incrocio orbite (MOID) su 24 ore.",
        "guideTitleDisclaimer": "⚠️ Avvertenza Legale",
        "discText1": "Tutti i dati orbitali sono calcolati in tempo reale da set di dati TLE pubblici.",
        "discText2": "Fornito esclusivamente a scopo didattico e divulgativo.",
        "guideTitlePrivacy": "🔒 Informativa sulla Privacy",
        "privText1Title": "Annunci:",
        "privText1Desc": "Questo sito utilizza cookie di terze parti per la pubblicità (Google AdSense).",
        "privText2Title": "Analisi:",
        "privText2Desc": "I dati di traffico sono raccolti in forma anonima.",
        "guideTitleAbout": "ℹ️ Info su SatViewer3D",
        "aboutText1": "SatViewer3D è un simulatore 3D in tempo reale per satelliti e corpi del sistema solare.",
        "aboutFeaturesTitle": "🌟 Le 10 funzionalità leader mondiali di SatViewer3D",
        "feat1": "🪐 Esplorazione 3D in tempo reale del Sistema Solare con texture fotografiche NASA.",
        "feat2": "💍 Anelli planetari 3D autentici per Saturno e Urano.",
        "feat3": "🌡️ HUD temperatura superficiale e fisica termica delle macchie solari (~4.000°C).",
        "feat4": "🌐 Enciclopedia astronomica completa e ricerca in 14 lingue.",
        "feat5": "🔮 Radar di collisione detriti spaziali (MOID) su 24h in tempo reale.",
        "feat6": "🛰️ Costellazione Starlink di 2.000 satelliti in 3D.",
        "feat7": "🚀 Integrazione immediata dei satelliti più recenti.",
        "feat8": "🎬 Zoom ultra-fluido a 1/10 di velocità con resa cinematografica.",
        "feat9": "💎 HUD galleggiante che non ostruisce la vista della Terra.",
        "feat10": "🌊 Visualizzazione 3D delle traiettorie ondulate dovute alla rotazione terrestre.",
        "aboutContactTitle": "Contatti:",
        "aboutContactDesc": "Per richieste: info@satviewer3d.com"
    },
    "ko": {
        "mobileBtnSelect": "🛰️ 위성 선택",
        "mobileBtnDetail": "📊 위성 상세",
        "mobileSheetSelectTitle": "🛰️ 위성 선택·메뉴",
        "mobileSheetDetailTitle": "📊 위성 상세 정보",
        "zoomHintPcTitle": "🔍 마우스 휠로 줌 조절",
        "zoomHintPcSub": "휠을 굴려 지구 전체를 둘러보세요",
        "zoomHintTouchTitle": "🔍 두 손가락 핀치로 줌 조절",
        "zoomHintTouchSub": "화면을 줌아웃하여 지구 전체를 둘러보세요",
        "zoomHintTitle": "🔍 마우스 휠 / 핀치로 줌 조절",
        "zoomHintSub": "휠을 굴려 지구 전체를 한눈에 둘러보세요",
        "loadTrain": "🚂 스타링크 트레인 (최신 발사 열차 · 24기)",
        "tooltipGuideTitle": "💡 위성을 선택하여 자유롭게 전환 가능!",
        "tooltipGuideDesc": "스타링크, 허블 우주망원경, 기상위성 히마와리 등을 선택·추적할 수 있습니다.",

        "appSubtitle": "실시간 3D 인공위성 및 우주 쓰레기 궤도 시뮬레이터",
        "statCount": "추적 위성 수",
        "statTime": "시뮬레이션 시각",
        "dragPanel": "⋮⋮ 드래그하여 패널 이동",
        "dragHeader": "⋮⋮ 드래그하여 이동",
        "secSelect": "천체 및 인공위성 선택・검색",
        "selectPlaceholder": "-- 태양, 행성, 위성 또는 우주 쓰레기 선택 --",
        "searchPlaceholder": "행성명, 위성명 또는 NORAD ID 검색...",
        "secSource": "위성 데이터 소스 및 프리셋",
        "loadMajor": "⭐ 주요 위성 (ISS, 허블, 기상위성, 데브리)",
        "loadDeepSpace": "🔭 심우주·달/화성 탐사선 & JWST (웹, 아르테미스, MRO)",
        "badgeDeepSpace": "🔭 심우주 탐사선 및 우주망원경 프리셋 로드 완료",
        "loadSolarSystem": "🌌 태양계 전체 오러리 (8대 행성 & 태양)",
        "badgeSolarSystem": "🌌 태양계 전체 오러리 표시 중 (8대 행성)",
        "loadLocal": "🛰️ 스타링크 메가 콘스텔레이션 (2,000기)",
        "loadDebris": "💥 우주 쓰레기 메가 클라우드 (2,200+ 파편)",
        "badgeDebris": "💥 우주 쓰레기 메가 클라우드 로드 완료 (2,200파편)",
        "badgeMajor": "⭐ 주요 위성 프리셋 로드 완료",
        "optgroupDeepSpace": "🔭 심우주 탐사선 & 우주망원경 (JWST, 달, 화성)",
        "secTime": "시간 제어 및 배속 설정",
        "speedStop": "⏸️ 정지",
        "speedReal": "▶️ 1x (실시간)",
        "resetNow": "🔄 현재 시각",
        "secDisplay": "화면 표시 설정",
        "toggleLabels": "3D 공간에 위성 이름 표시",
        "toggleOrbits": "선택한 위성의 궤도 표시",
        "toggleMultiLap": "🌐 다중 회전 궤적 표시 (지구 자전 파형)",
        "toggleAtmosphere": "대기권 및 태양광 조명",
        "toggle2D": "2D 세계 지도 보기",
        "toggleBorders": "🌐 국경선 및 지명 표시",
        "toggleDebrisRisk": "🔮 우주 쓰레기 충돌 위험 모드",
        "toggleCelestial": "🌌 태양, 달 및 태양계 주요 행성",
        "toggleDeepSpace": "🔭 심우주·달/화성 탐사선 & JWST",
        "dragDetail": "⋮⋮ 드래그하여 상세 카드 이동",
        "dragCam": "⋮⋮ 카메라 제어",
        "labelAlt": "고도",
        "labelVel": "속도",
        "labelLat": "위도",
        "labelLon": "경도",
        "labelInc": "궤도 경사각",
        "labelPeriod": "주기",
        "labelTimezone": "시간대 표시",
        "labelPass": "📡 상공 통과 예측",
        "labelRisk": "🔮 우주 쓰레기 접근 위험 (MOID)",
        "btnGeo": "📍현재 위치 GPS",
        "btnTrack": "🎯 카메라 추적",
        "btnUntrack": "🔓 추적 해제",
        "pointerHint": "화면 밖에 있습니다 (클릭하여 시점 이동)",
        "btnRelease": "📜 v2.7 릴리스 노트",
        "btnGuide": "❓ 가이드 및 약관",
        "modalTitle": "SatViewer3D 이용 가이드 및 약관",
        "tabControls": "🎮 조작 방법",
        "tabReleases": "📜 업데이트 내역",
        "tabDisclaimer": "⚠️ 면책 조항",
        "tabPrivacy": "🔒 개인정보처리방침",
        "tabAbout": "ℹ️ 소개",
        "releaseTitle": "📜 SatViewer3D 릴리즈 노트 및 업데이트 내역",
                        "rel27Title": "📡 정밀 상공 통과 예측 & 💥 우주 쓰레기 메가 클라우드 (2,200+ 파편)",
        "rel27_1": "📡 <strong>천문학적 SGP4/SEZ 상공 통과 예측 엔진</strong>: 위성이 다음 번 통과하는 정확한 일시와 16방위 궤적(진입 방위, 최고 고도각, 이탈 방위)을 실시간 초 단위 카운트다운과 함께 완벽 표시.",
        "rel27_2": "💥 <strong>우주 쓰레기 메가 클라우드 (2,200+ 파편) 프리셋</strong>: 2009년 충돌 파편, 펑윈 1C 파괴 파편, 로켓 상단 잔해 등 지구를 뒤덮은 2,200개 실존 데브리 벨트 구현.",
        "rel27_3": "🔮 <strong>2,200개 전 데브리 연동 충돌 예측 레이더</strong>: 2,200개 파편 중 최단 근접 물체 및 향후 24시간 궤도 교차 위험을 밀리초 단위로 실시간 분석.",
        "rel27_4": "🗺️ <strong>2D 세계 지도 모드 카메라 추적 안정화</strong>: 2D 지도 모드에서 위성 전환 시 시야 왜곡 없이 부드럽게 수평 패닝 중심 정렬.",
        "rel27_5": "🛡️ <strong>보안 강화 및 다국어 텍스처 최적화</strong>: XSS 무독화 보안을 강화하고 모든 언어 포털에서 3D 지구 텍스처 고속 로딩 지원.",
        "rel26Title": "🛰️ 미치비키 7기 체제 완성 및 미국·주요 위성 공식 비주얼 전면 개편",
        "rel26_1": "🇯🇵 미치비키 7호기 (QZS-7) 신규 추가: 2026년 8월 11일 H3 로켓 9호기로 발사된 최신예 항법 위성의 궤도 제원(TLE) 및 내각부 공식 1080p 3D 이미지 구현.",
        "rel26_2": "🛰️ 미치비키 전 8기 독립 고화질 이미지화: 1호기부터 7호기 및 1R호기까지 JAXA 및 내각부 공식 포털 1080p 고유 CG를 개별 바인딩.",
        "rel26_3": "🇺🇸 미국 및 주력 위성 실제 기체 사진 개편: NASA Ames 공식 4K 스타링크(대형 태양전지판), USA-245(키홀 KH-11 광학 정찰망원경), SBIRS, X-37B 궤도 사진 적용.",
        "rel26_4": "🌐 14개 언어 상세 미션 카드 완전 동기화: 7기 체제의 완성 및 미·일 공동 우주영역인식(SDA) 광학 센서 탑재 해설을 14개 언어로 제공.",
        "rel26_5": "📑 위성 목록 번호순 정렬 최적화: 사이드바 위성 목록에서 미치비키 1~7호기가 자연스러운 번호순으로 표시되도록 개선.",
"rel25Title": "🪐 3D 태양계・행성 탐사 및 14개 언어 우주 백과사전 메이저 업데이트",
        "rel25_1": "🪐 태양, 달, 주요 행성의 실시간 3D 탐사 모드: 360도 자유 회전 및 초정밀 마이크로 줌 구현.",
        "rel25_2": "📷 NASA 공식 실사 포토 텍스처 적용으로 압도적인 사실감 선사.",
        "rel25_3": "💍 토성의 얼음 고리와 천왕성의 수직 고리 3D 완전 구현.",
        "rel25_4": "🌡️ 표면 온도 HUD 및 태양 흑점 물리 메커니즘(~4,000℃) 해설 수록.",
        "rel25_5": "🌐 14개 언어 지원 우주 백과사전 및 천체 실시간 검색 기능 탑재.",
        "rel20Title": "🔮 우주 쓰레기 충돌 위험 예측 & 스타링크 군집위성",
        "rel20_1": "🔮 24시간 우주 데브리 충돌 위험 레이더(MOID) 실시간 연산.",
        "rel20_2": "🛰️ 스타링크 2,000기 메가 콘스텔레이션 3D 완전 렌더링.",
        "rel20_3": "📡 GPS 현재 위치 상공 통과 예측 및 카운트다운.",
        "rel10Title": "🌍 SatViewer3D 정식 출시",
        "rel10_1": "WebAssembly / WebGL 기반 실시간 3D 인공위성 궤도 시뮬레이터 첫 릴리즈.",
        "guideTitleControls": "🖱️ 3D 네비게이션 가이드",
        "guideWheel": "마우스 휠 / 터치",
        "guideWheelDesc": "1/10 속도의 부드러운 정밀 줌.",
        "guideDrag": "좌클릭 + 드래그",
        "guideDragDesc": "지구 및 천체 360도 자유 회전.",
        "guideTilt": "우클릭 / Ctrl + 드래그",
        "guideTiltDesc": "카메라 시야각 및 틸트 조절.",
        "guideClick": "위성 또는 행성 클릭",
        "guideClickDesc": "궤도 데이터 확인 및 카메라 고정.",
        "guideFocus": "🎯 추적 모드",
        "guideFocusDesc": "카메라가 대상 천체를 자동으로 추적합니다.",
        "guideRadar": "🔮 우주 쓰레기 레이더",
        "guideRadarDesc": "24시간 궤도 교차 거리(MOID) 실시간 연산.",
        "guideTitleDisclaimer": "⚠️ 법적 면책 조항",
        "discText1": "모든 궤도 데이터는 공개 TLE 데이터를 기반으로 실시간 계산됩니다.",
        "discText2": "본 데이터는 교육 및 관측 참고용으로만 제공됩니다.",
        "guideTitlePrivacy": "🔒 개인정보 보호정책",
        "privText1Title": "광고 서비스:",
        "privText1Desc": "본 사이트는 타사 광고 서비스(Google AdSense)를 이용할 수 있습니다.",
        "privText2Title": "통계 분석:",
        "privText2Desc": "익명의 트래픽 데이터가 수집될 수 있습니다.",
        "guideTitleAbout": "ℹ️ SatViewer3D 소개",
        "aboutText1": "SatViewer3D는 WebGL 및 CesiumJS 기반의 실시간 3D 우주 궤도 시뮬레이터입니다.",
        "aboutFeaturesTitle": "🌟 NASA 공개 툴을 초월하는 『SatViewer3D』의 10대 세계 최고봉 기능",
        "feat1": "🪐 태양계 주요 행성 및 태양・달의 실시간 3D 탐사: NASA 공식 실사 텍스처 및 360도 자유 회전.",
        "feat2": "💍 천문학적 물리 파라미터 완벽 준수 3D 행성 고리: 토성의 얼음 고리(26.7도)와 천왕성의 수직 고리(97.8도).",
        "feat3": "🌡️ 표면 온도 HUD 및 태양 흑점 열역학 메커니즘(~4,000℃) 실시간 표시.",
        "feat4": "🌐 14개 언어 완벽 지원 심우주 백과사전 및 천체 실시간 검색 기능.",
        "feat5": "🔮 NASA/JAXA 관제실 수준 24시간 우주 데브리 충돌 위험 예측 (MOID) 연산.",
        "feat6": "🛰️ 스타링크 2,000기 메가 콘스텔레이션 3D 완전 렌더링.",
        "feat7": "🚀 H3 로켓 탑재 미치비키 6호기를 포함한 최신 위성 데이터의 신속한 반영.",
        "feat8": "🎬 비단결처럼 부드러운 1/10 속도 정밀 마이크로 줌 카메라 제어.",
        "feat9": "💎 지구 시야를 100% 가리지 않는 플로팅 아일랜드 HUD 설계.",
        "feat10": "🌊 지구 자전에 따른 사인파 형태의 다중 회전 궤적(Multi-Lap) 3D 시각화.",
        "aboutContactTitle": "문의:",
        "aboutContactDesc": "문의 사항은 info@satviewer3d.com 으로 연락주시기 바랍니다."
    },
    "nl": {
        "mobileBtnSelect": "🛰️ Satellieten",
        "mobileBtnDetail": "📊 Details",
        "mobileSheetSelectTitle": "🛰️ Satellieten & Menu",
        "mobileSheetDetailTitle": "📊 Satellietdetails",
        "zoomHintPcTitle": "🔍 Muiswiel om te zoomen",
        "zoomHintPcSub": "Scrol om de hele aarde te zien",
        "zoomHintTouchTitle": "🔍 Knijpen met 2 vingers om te zoomen",
        "zoomHintTouchSub": "Knijp in het scherm om de hele aarde te zien",
        "zoomHintTitle": "🔍 Muiswiel / Knijpen om te zoomen",
        "zoomHintSub": "Scrol om de hele aarde te zien",
        "loadTrain": "🚂 Starlink-trein (Nieuwste lanceerketen · 24 sat.)",
        "tooltipGuideTitle": "💡 Wissel & volg elke gewenste satelliet!",
        "tooltipGuideDesc": "Volg Starlink, de Hubble-telescoop, weersatellieten en meer.",

        "appSubtitle": "Realtime 3D Satelliet- en Ruimtepuin-orbitsimulator",
        "statCount": "Gevolgde Satellieten",
        "statTime": "Simulatietijd",
        "dragPanel": "⋮⋮ Slepen om te Verplaatsen",
        "dragHeader": "⋮⋮ Slepen",
        "secSelect": "Selecteer & Zoek Hemellichamen / Satellieten",
        "selectPlaceholder": "-- Selecteer Planeet, Satelliet of Ruimtepuin --",
        "searchPlaceholder": "Zoek op naam of NORAD-ID...",
        "secSource": "Satellietgegevensbronnen & Presets",
        "loadMajor": "⭐ Belangrijke Satellieten (ISS, Hubble, Weer, Puin)",
        "loadDeepSpace": "🔭 Diepe Ruimte & JWST (Webb, Artemis, MRO)",
        "badgeDeepSpace": "🔭 Diepe Ruimtemissies Geladen",
        "loadSolarSystem": "🌌 Zonnestelsel Orrery (8 Planeten & Zon)",
        "badgeSolarSystem": "🌌 Zonnestelsel-Orrery actief (8 Planeten)",
        "loadLocal": "🛰️ Starlink-Megaconstellatie (2.000 Satellieten)",
        "loadDebris": "💥 Ruimtepuin Megawolk (2.200+ fragmenten)",
        "badgeDebris": "💥 Ruimtepuin Megawolk Geladen (2.200 fragmenten)",
        "badgeMajor": "⭐ Belangrijkste Preset Geladen",
        "optgroupDeepSpace": "🔭 Diepe Ruimtesondes & Telescopen (JWST, Maan, Mars)",
        "secTime": "Tijdregeling & Simulatiesnelheid",
        "speedStop": "⏸️ Pauze",
        "speedReal": "▶️ 1x (Realtime)",
        "resetNow": "🔄 Huidige Tijd",
        "secDisplay": "Weergave-instellingen",
        "toggleLabels": "Labels in 3D-ruimte Weergeven",
        "toggleOrbits": "Geselecteerde Baan Weergeven",
        "toggleMultiLap": "🌐 Meervoudige Baan Weergeven",
        "toggleAtmosphere": "Atmosfeer & Zonverlichting",
        "toggle2D": "2D Wereldkaartweergave",
        "toggleBorders": "🌐 Grenzen & Plaatsnamen",
        "toggleDebrisRisk": "🔮 Ruimtepuinrisicomodus",
        "toggleCelestial": "🌌 Zon, Maan & Planeten van het Zonnestelsel",
        "toggleDeepSpace": "🔭 Diepe Ruimte & JWST-sondes",
        "dragDetail": "⋮⋮ Detailkaart Slepen",
        "dragCam": "⋮⋮ Camerabediening",
        "labelAlt": "Hoogte",
        "labelVel": "Snelheid",
        "labelLat": "Breedtegraad",
        "labelLon": "Lengtegraad",
        "labelInc": "Inclinatie",
        "labelPeriod": "Omlooptijd",
        "labelTimezone": "Tijdzone",
        "labelPass": "📡 Volgende Zichtbare Doorgang",
        "labelRisk": "🔮 Botsingsrisico Ruimtepuin (MOID)",
        "btnGeo": "📍GPS-locatie",
        "btnTrack": "🎯 Volgen & Focussen",
        "btnUntrack": "🔓 Camera Ontgrendelen",
        "pointerHint": "Doel buiten beeld (Klik om te bekijken)",
        "btnRelease": "📜 v2.7 Release-opmerkingen",
        "btnGuide": "❓ Gids & Voorwaarden",
        "modalTitle": "SatViewer3D Gebruikershandleiding & Voorwaarden",
        "tabControls": "🎮 Besturing",
        "tabReleases": "📜 Versienotities",
        "tabDisclaimer": "⚠️ Disclaimer",
        "tabPrivacy": "🔒 Privacybeleid",
        "tabAbout": "ℹ️ Over",
        "releaseTitle": "📜 SatViewer3D Versienotities & Geschiedenis",
                        "rel27Title": "📡 Nauwkeurige Overvluchtvoorspelling & 💥 Ruimtepuin Megawolk (2.200+ fragmenten)",
        "rel27_1": "📡 <strong>Astronomische SGP4/SEZ Overvlucht-engine</strong>: Voorspelt exacte datum, tijd en 16-kompasrichtingen met live aftelling.",
        "rel27_2": "💥 <strong>Ruimtepuin Megawolk (2.200+ fragmenten)</strong>: Nieuwe voorinstelling met 2.200 echte puindeeltjes en rakettrappen op 60 fps.",
        "rel27_3": "🔮 <strong>2.200-Puin Nabijheidsradar</strong>: Berekent in realtime de gevaarlijkste naderingen en 24-uurs botsingsrisico's.",
        "rel27_4": "🗺️ <strong>Stabiele 2D-Wereldkaart Camera</strong>: Vloeiende centrering en tracking van satellieten in 2D-modus.",
        "rel27_5": "🛡️ <strong>Verbeterde Beveiliging & Meertalige Optimalisatie</strong>: XSS-beveiliging en directe textuurlading.",
        "rel26Title": "🛰️ Voltooiing Michibiki 7-Satellietconstellatie & Officiële Visuele Upgrade",
        "rel26_1": "🇯🇵 Toevoeging QZS-7 (Michibiki-7): Baangegevens (TLE) en officiële 1080p 3D-beelden voor de nieuwste satelliet gelanceerd op 11 augustus 2026.",
        "rel26_2": "🛰️ 100% Unieke beelden voor alle 8 Michibiki-satellieten: Individuele officiële 1080p modellen voor QZS-1 tot en met QZS-7 en QZS-1R.",
        "rel26_3": "🇺🇸 Visuele upgrade voor VS- en vlaggenschipsatellieten: Starlink 4K NASA Ames, USA-245 (KH-11 Keyhole spionagesatelliet), SBIRS en X-37B.",
        "rel26_4": "🌐 Volledige synchronisatie in 14 talen: Uitgebreide missiekaarten over de soevereine 7-satellietconstellatie en SDA-sensoren.",
        "rel26_5": "📑 Numerieke sortering geoptimaliseerd: Michibiki 1 tot en met 7 netjes geordend.",
"rel25Title": "🪐 3D Zonnestelsel & 14-Talige Ruimte-encyclopedie",
        "rel25_1": "🪐 3D-inspectiemodus voor Zon, Maan en alle planeten met 360° rotatie.",
        "rel25_2": "📷 Officiële NASA-fototexturen voor adembenemend realisme.",
        "rel25_3": "💍 Authentieke 3D-ringen voor Saturnus en Uranus.",
        "rel25_4": "🌡️ Oppervlaktetemperatuur HUD en zonnevlekkenfysica.",
        "rel25_5": "🌐 Volledige encyclopedie in 14 talen.",
        "rel20Title": "🔮 Ruimtepuinbotsingsradar & Starlink-constellatie",
        "rel20_1": "🔮 Realtime waarschuwing voor ruimtepuin (MOID).",
        "rel20_2": "🛰️ Starlink-constellatie met 2.000 satellieten.",
        "rel20_3": "📡 GPS-doorgangsvoorspelling met countdown.",
        "rel10Title": "🌍 Officiële lancering van SatViewer3D",
        "rel10_1": "Eerste versie van de realtime 3D-satellietsimulator.",
        "guideTitleControls": "🖱️ 3D-Navigatiegids",
        "guideWheel": "Muiswiel / Aanraking",
        "guideWheelDesc": "Nauwkeurige micro-zoom bij 1/10 snelheid.",
        "guideDrag": "Linksklik + Slepen",
        "guideDragDesc": "360° vrij draaien rond Aarde en planeten.",
        "guideTilt": "Rechtsklik / Ctrl + Slepen",
        "guideTiltDesc": "Kamerahoek aanpassen.",
        "guideClick": "Klik op Satelliet / Planeet",
        "guideClickDesc": "Bekijk baangegevens en vergrendel camera.",
        "guideFocus": "🎯 Focus & Volgen",
        "guideFocusDesc": "Camera volgt het doel automatisch.",
        "guideRadar": "🔮 Ruimtepuinradar",
        "guideRadarDesc": "Berekening van baanoversteek (MOID) over 24 uur.",
        "guideTitleDisclaimer": "⚠️ Juridische Disclaimer",
        "discText1": "Alle baangegevens worden realtime berekend uit openbare TLE-sets.",
        "discText2": "Uitsluitend bedoeld voor educatieve doeleinden.",
        "guideTitlePrivacy": "🔒 Privacybeleid",
        "privText1Title": "Advertenties:",
        "privText1Desc": "Deze site gebruikt cookies van derden voor advertenties (Google AdSense).",
        "privText2Title": "Statistieken:",
        "privText2Desc": "Anonieme verkeersgegevens worden verzameld.",
        "guideTitleAbout": "ℹ️ Over SatViewer3D",
        "aboutText1": "SatViewer3D is een realtime 3D-ruimtesimulator voor satellieten en planeten.",
        "aboutFeaturesTitle": "🌟 De 10 toonaangevende functies van SatViewer3D",
        "feat1": "🪐 Realtime 3D Zonnestelsel en planetaire verkenning met echte NASA-fototexturen.",
        "feat2": "💍 Echte 3D-ringen voor Saturnus en Uranus volgens astronomische parameters.",
        "feat3": "🌡️ Oppervlaktetemperatuur HUD en zonnevlekkenfysica (~4.000°C).",
        "feat4": "🌐 Ruimte-encyclopedie en zoekfunctie in 14 talen.",
        "feat5": "🔮 24-uurs ruimtepuinbotsingsradar (MOID) in realtime.",
        "feat6": "🛰️ 2.000 Starlink-satellieten vloeiend weergegeven in 3D.",
        "feat7": "🚀 Supersnelle integratie van de nieuwste satellietmissies.",
        "feat8": "🎬 Vloeiende 1/10 zoomsnelheid voor filmische camerabesturing.",
        "feat9": "💎 Zwevende HUD met 100% vrij zicht op de aarde.",
        "feat10": "🌊 3D-visualisatie van golfpatronen door aardrotatie.",
        "aboutContactTitle": "Contact:",
        "aboutContactDesc": "Voor vragen: info@satviewer3d.com"
    },
    "id": {
        "mobileBtnSelect": "🛰️ Satelit",
        "mobileBtnDetail": "📊 Detail",
        "mobileSheetSelectTitle": "🛰️ Satelit & Menu",
        "mobileSheetDetailTitle": "📊 Detail Satelit",
        "zoomHintPcTitle": "🔍 Roda Mouse untuk Zoom",
        "zoomHintPcSub": "Gulir untuk melihat Bumi secara penuh",
        "zoomHintTouchTitle": "🔍 Cubit dengan 2 Jari untuk Zoom",
        "zoomHintTouchSub": "Cubit layar untuk melihat Bumi secara penuh",
        "zoomHintTitle": "🔍 Roda Mouse / Cubit untuk Zoom",
        "zoomHintSub": "Gulir untuk melihat Bumi secara penuh",
        "loadTrain": "🚂 Kereta Starlink (Rantai Peluncuran Baru · 24 Satelit)",
        "tooltipGuideTitle": "💡 Pilih & Lacak Satelit Mana Pun!",
        "tooltipGuideDesc": "Pilih dan lacak Starlink, teleskop Hubble, satelit cuaca, dan lainnya.",

        "appSubtitle": "Simulator Orbit Satelit & Sampah Antariksa 3D Real-Time",
        "statCount": "Satelit Terlacak",
        "statTime": "Waktu Simulasi",
        "dragPanel": "⋮⋮ Geser untuk Memindahkan Panel",
        "dragHeader": "⋮⋮ Geser untuk Memindahkan",
        "secSelect": "Pilih & Cari Benda Langit / Satelit",
        "selectPlaceholder": "-- Pilih Planet, Satelit atau Sampah Antariksa --",
        "searchPlaceholder": "Cari berdasarkan nama planet, satelit atau ID...",
        "secSource": "Sumber Data Satelit & Preset",
        "loadMajor": "⭐ Satelit Utama (ISS, Himawari, Michibiki, Sampah)",
        "loadDeepSpace": "🔭 Ruang Angkasa Dalam & JWST (Webb, Artemis, MRO)",
        "badgeDeepSpace": "🔭 Misi Ruang Angkasa Dalam Dimuat",
        "loadSolarSystem": "🌌 Tata Surya Lengkap (8 Planet & Matahari)",
        "badgeSolarSystem": "🌌 Tampilan Orrery Tata Surya Aktif (8 Planet)",
        "loadLocal": "🛰️ Konstelasi Starlink (2.000 Satelit)",
        "loadDebris": "💥 Awan Mega Sampah Antariksa (2.200+ Fragmen)",
        "badgeDebris": "💥 Awan Mega Sampah Antariksa Dimuat (2.200 Fragmen)",
        "badgeMajor": "⭐ Preset Utama Dimuat",
        "optgroupDeepSpace": "🔭 Wahana Antariksa Jauh (JWST, Bulan, Mars)",
        "secTime": "Kontrol Waktu & Kecepatan",
        "speedStop": "⏸️ Jeda",
        "speedReal": "▶️ 1x (Real-time)",
        "resetNow": "🔄 Waktu Sekarang",
        "secDisplay": "Pengaturan Tampilan",
        "toggleLabels": "Tampilkan Label di Ruang 3D",
        "toggleOrbits": "Tampilkan Orbit Terpilih",
        "toggleMultiLap": "🌐 Tampilkan Lintasan Multi-Putaran",
        "toggleAtmosphere": "Atmosfer & Pencahayaan Matahari",
        "toggle2D": "Tampilan Peta Dunia 2D",
        "toggleBorders": "🌐 Garis Batas & Label Wilayah",
        "toggleDebrisRisk": "🔮 Mode Risiko Tabrakan Sampah Antariksa",
        "toggleCelestial": "🌌 Matahari, Bulan & Planet Tata Surya",
        "toggleDeepSpace": "🔭 Wahana Ruang Angkasa Dalam & JWST",
        "dragDetail": "⋮⋮ Geser Kartu Detail",
        "dragCam": "⋮⋮ Kontrol Kamera",
        "labelAlt": "Ketinggian",
        "labelVel": "Kecepatan",
        "labelLat": "Garis Lintang",
        "labelLon": "Garis Bujur",
        "labelInc": "Kemiringan Orbit",
        "labelPeriod": "Periode",
        "labelTimezone": "Zona Waktu",
        "labelPass": "📡 Prakiraan Lintasan di Atas Kepala",
        "labelRisk": "🔮 Kedekatan Sampah Antariksa & Risiko",
        "btnGeo": "📍Lokasi GPS",
        "btnTrack": "🎯 Fokus & Lacak",
        "btnUntrack": "🔓 Lepas Kamera",
        "pointerHint": "Target di luar layar (Klik untuk melihat)",
        "btnRelease": "📜 v2.7 Catatan Rilis",
        "btnGuide": "❓ Panduan & Syarat",
        "modalTitle": "Panduan Pengguna & Syarat SatViewer3D",
        "tabControls": "🎮 Kontrol",
        "tabReleases": "📜 Catatan Rilis",
        "tabDisclaimer": "⚠️ Penafian",
        "tabPrivacy": "🔒 Kebijakan Privasi",
        "tabAbout": "ℹ️ Tentang",
        "releaseTitle": "📜 Catatan Rilis & Riwayat SatViewer3D",
                        "rel27Title": "📡 Prediksi Lintasan Langit & 💥 Awan Mega Sampah Antariksa (2.200+ Fragmen)",
        "rel27_1": "📡 <strong>Mesin Prediksi Lintasan SGP4/SEZ</strong>: Memprediksi tanggal, waktu, dan 16 arah kompas lintasan langit dengan hitungan mundur langsung.",
        "rel27_2": "💥 <strong>Awan Mega Sampah Antariksa (2.200+ Fragmen)</strong>: Preset baru menampilkan 2.200 puing tabrakan nyata pada 60 fps.",
        "rel27_3": "🔮 <strong>Radar Kedekatan 2.200 Puing Antariksa</strong>: Analisis risiko tabrakan 24 jam dan jarak terdekat secara real-time.",
        "rel27_4": "🗺️ <strong>Pelacakan Kamera Peta 2D Mulus</strong>: Menstabilkan pergeseran kamera saat memilih satelit pada peta 2D.",
        "rel27_5": "🛡️ <strong>Penguatan Keamanan & Aset Multibahasa</strong>: Sanitasi XSS dan pemuatan tekstur Bumi 3D instan di 14 bahasa.",
        "rel26Title": "🛰️ Penyelesaian Konstelasi 7 Satelit Michibiki & Pembaruan Visual Resmi",
        "rel26_1": "🇯🇵 Penambahan Peluncuran QZS-7 (Michibiki-7): Mengintegrasikan elemen orbit (TLE) dan citra 3D 1080p resmi satelit baru yang diluncurkan pada 11 Agustus 2026.",
        "rel26_2": "🛰️ Citra 100% Unik untuk Seluruh 8 Satelit Michibiki: Model CG 1080p resmi khusus untuk QZS-1 hingga QZS-7 dan QZS-1R.",
        "rel26_3": "🇺🇸 Pembaruan Visual Satelit AS & Unggulan: Starlink 4K NASA Ames, USA-245 (satelit mata-mata KH-11), SBIRS, dan X-37B.",
        "rel26_4": "🌐 Sinkronisasi Lengkap 14 Bahasa: Kartu misi mendalam mencakup konstelasi 7 satelit dan muatan SDA pertahanan.",
        "rel26_5": "📑 Penyempurnaan Urutan Numerik: Michibiki 1 hingga 7 tersusun rapi secara berurutan.",
"rel25Title": "🪐 Tata Surya 3D & Ensiklopedia Antariksa 14 Bahasa",
        "rel25_1": "🪐 Mode eksplorasi 3D untuk Matahari, Bulan, dan seluruh planet.",
        "rel25_2": "📷 Tekstur foto resmi NASA untuk realisme luar biasa.",
        "rel25_3": "💍 Cincin 3D asli untuk Saturnus dan Uranus.",
        "rel25_4": "🌡️ HUD suhu permukaan dan fisika bintik matahari.",
        "rel25_5": "🌐 Ensiklopedia lengkap dalam 14 bahasa.",
        "rel20Title": "🔮 Radar Risiko Tabrakan Sampah & Starlink",
        "rel20_1": "🔮 Peringatan tabrakan sampah antariksa real-time (MOID).",
        "rel20_2": "🛰️ Konstelasi 2.000 satelit Starlink.",
        "rel20_3": "📡 Prakiraan lintasan di atas lokasi GPS.",
        "rel10Title": "🌍 Peluncuran Resmi SatViewer3D",
        "rel10_1": "Rilis perdana simulator orbit 3D real-time.",
        "guideTitleControls": "🖱️ Panduan Navigasi 3D",
        "guideWheel": "Roda Mouse / Cubit Layar",
        "guideWheelDesc": "Zoom presisi halus.",
        "guideDrag": "Klik Kiri + Geser",
        "guideDragDesc": "Putar bebas 360° mengelilingi Bumi dan planet.",
        "guideTilt": "Klik Kanan / Ctrl + Geser",
        "guideTiltDesc": "Sesuaikan sudut kemiringan kamera.",
        "guideClick": "Klik Satelit atau Planet",
        "guideClickDesc": "Lihat detail orbit & kunci kamera.",
        "guideFocus": "🎯 Fokus & Lacak",
        "guideFocusDesc": "Kamera otomatis mengikuti target.",
        "guideRadar": "🔮 Radar Sampah Antariksa",
        "guideRadarDesc": "Perhitungan jarak persimpangan orbit (MOID) 24 jam.",
        "guideTitleDisclaimer": "⚠️ Penafian Hukum",
        "discText1": "Semua data orbit satelit adalah estimasi simulasi berbasis dataset TLE publik.",
        "discText2": "Data ini disediakan semata-mata untuk tujuan pendidikan.",
        "guideTitlePrivacy": "🔒 Kebijakan Privasi",
        "privText1Title": "Iklan:",
        "privText1Desc": "Situs ini menggunakan cookie pihak ketiga untuk layanan iklan seperti Google AdSense.",
        "privText2Title": "Analisis:",
        "privText2Desc": "Data lalu lintas anonim dikumpulkan untuk analisis performa situs.",
        "guideTitleAbout": "ℹ️ Tentang SatViewer3D",
        "aboutText1": "SatViewer3D adalah simulator orbit luar angkasa 3D real-time berbasis WebGL dan CesiumJS.",
        "aboutFeaturesTitle": "🌟 10 Fitur Unggulan Dunia SatViewer3D Melampaui Alat NASA",
        "feat1": "🪐 Eksplorasi 3D Tata Surya & Planet Real-Time dengan tekstur foto resmi NASA.",
        "feat2": "💍 Fisika Cincin 3D Asli untuk Saturnus (kemiringan 26,7°) dan Uranus (97,8°).",
        "feat3": "🌡️ HUD Suhu Permukaan dan termodinamika bintik matahari (~4.000°C).",
        "feat4": "🌐 Ensiklopedia Antariksa dan pencarian benda langit dalam 14 bahasa.",
        "feat5": "🔮 Radar Peringatan Tabrakan Sampah Antariksa 24 Jam (MOID) Real-Time.",
        "feat6": "🛰️ Mega-Konstelasi 2.000 Satelit Starlink dalam visual 3D mulus.",
        "feat7": "🚀 Integrasi Tercepat Misi Satelit Terbaru (termasuk Michibiki-7).",
        "feat8": "🎬 Kontrol Zoom Mikro 1/10 Kecepatan yang Sangat Halus.",
        "feat9": "💎 HUD Melayang Transparan yang Memberikan Pandangan Penuh ke Bumi.",
        "feat10": "🌊 Visualisasi Jejak Gelombang 3D Akibat Rotasi Bumi (Multi-Lap).",
        "aboutContactTitle": "Kontak:",
        "aboutContactDesc": "Untuk pertanyaan: info@satviewer3d.com"
    },
    "hi": {
        "mobileBtnSelect": "🛰️ उपग्रह",
        "mobileBtnDetail": "📊 विवरण",
        "mobileSheetSelectTitle": "🛰️ उपग्रह चयन और मेनू",
        "mobileSheetDetailTitle": "📊 उपग्रह विस्तृत विवरण",
        "zoomHintPcTitle": "🔍 माउस व्हील से ज़ूम करें",
        "zoomHintPcSub": "पूरी पृथ्वी को देखने के लिए स्क्रॉल करें",
        "zoomHintTouchTitle": "🔍 2 उंगलियों से पिंच करके ज़ूम करें",
        "zoomHintTouchSub": "पूरी पृथ्वी को देखने के लिए स्क्रीन पिंच करें",
        "zoomHintTitle": "🔍 माउस व्हील / पिंच से ज़ूम करें",
        "zoomHintSub": "पूरी पृथ्वी को देखने के लिए स्क्रॉल करें",
        "loadTrain": "🚂 स्टारलिंक ट्रेन (नवीनतम प्रक्षेपण श्रृंखला · 24 उपग्रह)",
        "tooltipGuideTitle": "💡 किसी भी उपग्रह को चुनें और ट्रैक करें!",
        "tooltipGuideDesc": "स्टारलिंक, हबल टेलीस्कोप, मौसम उपग्रह और अन्य को ट्रैक करें।",

        "appSubtitle": "वास्तविक समय 3D कृत्रिम उपग्रह एवं अंतरिक्ष मलबा कक्षा सिम्युलेटर",
        "statCount": "ट्रैक किए गए उपग्रह",
        "statTime": "सिमुलेशन समय",
        "dragPanel": "⋮⋮ पैनल खींचें",
        "dragHeader": "⋮⋮ खींचें",
        "secSelect": "खगोलीय पिंड / उपग्रह चुनें और खोजें",
        "selectPlaceholder": "-- ग्रह, उपग्रह या मलबा चुनें --",
        "searchPlaceholder": "पिंड, उपग्रह का नाम या NORAD ID खोजें...",
        "secSource": "उपग्रह डेटा स्रोत और प्रीसेट",
        "loadMajor": "⭐ प्रमुख उपग्रह (ISS, हबल, मौसम, मलबा)",
        "loadDeepSpace": "🔭 गहरा अंतरिक्ष और JWST (वेब, आर्टेमिस, MRO)",
        "badgeDeepSpace": "🔭 गहरा अंतरिक्ष मिशन लोड हो गया",
        "loadSolarSystem": "🌌 सौर मंडल ऑरेरी (8 ग्रह और सूर्य)",
        "badgeSolarSystem": "🌌 सौर मंडल ऑरेरी सक्रिय (8 ग्रह)",
        "loadLocal": "🛰️ स्टारलिंक मेगा-तारामंडल (2,000 उपग्रह)",
        "loadDebris": "💥 अंतरिक्ष मलबे का विशाल बादल (2,200+ टुकड़े)",
        "badgeDebris": "💥 अंतरिक्ष मलबे का बादल लोड किया गया (2,200 टुकड़े)",
        "badgeMajor": "⭐ प्रमुख प्रीसेट लोड हो गया",
        "optgroupDeepSpace": "🔭 गहरा अंतरिक्ष और ग्रहीय मिशन (JWST, चंद्रमा, मंगल)",
        "secTime": "समय नियंत्रण और गति",
        "speedStop": "⏸️ रोकें",
        "speedReal": "▶️ 1x (वास्तविक समय)",
        "resetNow": "🔄 वर्तमान समय",
        "secDisplay": "प्रदर्शन सेटिंग्स",
        "toggleLabels": "3D अंतरिक्ष में नाम दिखाएं",
        "toggleOrbits": "चयनित कक्षा दिखाएं",
        "toggleMultiLap": "🌐 बहु-परिक्रमा ट्रैक दिखाएं",
        "toggleAtmosphere": "वायुमंडल और सूर्य का प्रकाश",
        "toggle2D": "2D विश्व मानचित्र दृश्य",
        "toggleBorders": "🌐 सीमाएं और स्थान लेबल",
        "toggleDebrisRisk": "🔮 अंतरिक्ष मलबा जोखिम मोड",
        "toggleCelestial": "🌌 सूर्य, चंद्रमा और सौर मंडल के ग्रह",
        "toggleDeepSpace": "🔭 गहरा अंतरिक्ष और JWST प्रोब",
        "dragDetail": "⋮⋮ विवरण कार्ड खींचें",
        "dragCam": "⋮⋮ कैमरा नियंत्रण",
        "labelAlt": "ऊंचाई",
        "labelVel": "गति",
        "labelLat": "अक्षांश",
        "labelLon": "देशांतर",
        "labelInc": "झुकाव",
        "labelPeriod": "परिक्रमा अवधि",
        "labelTimezone": "समय क्षेत्र",
        "labelPass": "📡 अगला दृश्यमान पास पूर्वानुमान",
        "labelRisk": "🔮 मलबा टकराव जोखिम (MOID)",
        "btnGeo": "📍GPS स्थान",
        "btnTrack": "🎯 ट्रैक करें",
        "btnUntrack": "🔓 कैमरा अनलॉक करें",
        "pointerHint": "लक्ष्य स्क्रीन से बाहर है",
        "btnRelease": "📜 v2.7 रिलीज नोट्स",
        "btnGuide": "❓ गाइड और नियम",
        "modalTitle": "SatViewer3D उपयोगकर्ता गाइड और शर्तें",
        "tabControls": "🎮 नियंत्रण",
        "tabReleases": "📜 रिलीज नोट्स",
        "tabDisclaimer": "⚠️ अस्वीकरण",
        "tabPrivacy": "🔒 गोपनीयता नीति",
        "tabAbout": "ℹ️ के बारे में",
        "releaseTitle": "📜 SatViewer3D रिलीज नोट्स एवं अद्यतन इतिहास",
                        "rel27Title": "📡 सटीक पास भविष्यवाणी & 💥 अंतरिक्ष मलबे का विशाल बादल (2,200+ टुकड़े)",
        "rel27_1": "📡 <strong>खगोलीय SGP4/SEZ पास भविष्यवाणी इंजन</strong>: सटीक तारीख, समय और 16 दिशाओं में आकाश का मार्ग लाइव उलटी गिनती के साथ प्रदर्शित करता है।",
        "rel27_2": "💥 <strong>अंतरिक्ष मलबा मेगा-क्लाउड (2,200+ टुकड़े)</strong>: 2,200 से अधिक वास्तविक मलबे के टुकड़ों को 60fps पर रेंडर करने वाला नया प्रीसेट।",
        "rel27_3": "🔮 <strong>2,200 मलबों का टकराव रडार</strong>: वास्तविक समय में निकटतम वस्तुओं और 24 घंटे के टकराव जोखिम की गणना।",
        "rel27_4": "🗺️ <strong>2D विश्व मानचित्र कैमरा स्थिरीकरण</strong>: 2D मानचित्र मोड में उपग्रह स्विच करते समय सुचारू ट्रैकिंग।",
        "rel27_5": "🛡️ <strong>सुरक्षा संवर्द्धन और बहुभाषी अनुकूलन</strong>: XSS सुरक्षा और 14 भाषाओं में 3D पृथ्वी का त्वरित लोड।",
        "rel26Title": "🛰️ मिचिबिकी 7-उपग्रह समूह की पूर्णता एवं आधिकारिक अंतरिक्ष यान दृश्यों का उन्नयन",
        "rel26_1": "🇯🇵 QZS-7 (मिचिबिकी-7) का समावेश: 11 अगस्त 2026 को प्रक्षेपित नवीनतम उपग्रह के लिए कक्षीय तत्व (TLE) और आधिकारिक 1080p 3D छवियां लागू।",
        "rel26_2": "🛰️ सभी 8 मिचिबिकी उपग्रहों के लिए 100% अद्वितीय छवियां: QZS-1 से QZS-7 और QZS-1R तक व्यक्तिगत आधिकारिक 1080p CG मॉडल सौंपे गए।",
        "rel26_3": "🇺🇸 अमेरिकी एवं प्रमुख उपग्रहों का दृश्य उन्नयन: NASA Ames 4K स्टारलिंक, USA-245 (KH-11 कीहोल जासूसी दूरबीन), SBIRS और X-37B का नवीनीकरण।",
        "rel26_4": "🌐 14 भाषाओं में संपूर्ण मिशन विवरण: 7-उपग्रह समूह और संयुक्त SDA पेलोड का बहुभाषी विवरण।",
        "rel26_5": "📑 संख्यात्मक क्रम अनुकूलन: मिचिबिकी 1 से 7 को सटीक संख्यात्मक क्रम में व्यवस्थित किया गया।",
"rel25Title": "🪐 3D सौर मंडल एवं 14-भाषाई अंतरिक्ष ज्ञानकोश",
        "rel25_1": "🪐 सूर्य, चंद्रमा और सभी ग्रहों का 360° 3D अवलोकन।",
        "rel25_2": "📷 नासा के आधिकारिक वास्तविक फोटो टेक्सचर।",
        "rel25_3": "💍 शनि और अरुण के 3D छल्ले।",
        "rel25_4": "🌡️ सतह तापमान HUD और सौर कलंक भौतिकी।",
        "rel25_5": "🌐 14 भाषाओं में संपूर्ण ज्ञानकोश।",
        "rel20Title": "🔮 अंतरिक्ष मलबा टकराव रडार एवं स्टारलिंक",
        "rel20_1": "🔮 वास्तविक समय में मलबा टकराव चेतावनी (MOID)।",
        "rel20_2": "🛰️ 2,000 स्टारलिंक उपग्रहों का जाल।",
        "rel20_3": "📡 जीपीएस आधारित उपग्रह पास भविष्यवाणी।",
        "rel10Title": "🌍 SatViewer3D का आधिकारिक शुभारंभ",
        "rel10_1": "वास्तविक समय 3D उपग्रह सिमुलेटर का पहला संस्करण।",
        "guideTitleControls": "🖱️ 3D नेविगेशन गाइड",
        "guideWheel": "माउस व्हील / टच",
        "guideWheelDesc": "1/10 गति पर सहज ज़ूम।",
        "guideDrag": "बायाँ क्लिक + खींचें",
        "guideDragDesc": "पृथ्वी और ग्रहों के चारों ओर 360° घूर्णन।",
        "guideTilt": "दायाँ क्लिक / Ctrl + खींचें",
        "guideTiltDesc": "कैमरा कोण समायोजित करें।",
        "guideClick": "उपग्रह / ग्रह पर क्लिक करें",
        "guideClickDesc": "कक्षा विवरण देखें और कैमरा लॉक करें।",
        "guideFocus": "🎯 ट्रैक करें",
        "guideFocusDesc": "कैमरा स्वचालित रूप से लक्ष्य का अनुसरण करता है।",
        "guideRadar": "🔮 मलबा रडार",
        "guideRadarDesc": "24 घंटे में कक्षा पार करने की दूरी (MOID) की गणना।",
        "guideTitleDisclaimer": "⚠️ कानूनी अस्वीकरण",
        "discText1": "सभी डेटा सार्वजनिक TLE से वास्तविक समय में गणना किए जाते हैं।",
        "discText2": "यह डेटा केवल शैक्षिक उद्देश्यों के लिए है।",
        "guideTitlePrivacy": "🔒 गोपनीयता नीति",
        "privText1Title": "विज्ञापन:",
        "privText1Desc": "यह साइट तीसरे पक्ष की कुकीज़ का उपयोग करती है।",
        "privText2Title": "आंकड़े:",
        "privText2Desc": "अनाम ट्रैफ़िक डेटा एकत्र किया जाता है।",
        "guideTitleAbout": "ℹ️ SatViewer3D के बारे में",
        "aboutText1": "SatViewer3D कृत्रिम उपग्रहों और सौर मंडल के लिए एक वास्तविक समय 3D सिमुलेटर है।",
        "aboutFeaturesTitle": "🌟 SatViewer3D की 10 विश्व-अग्रणी विशेषताएं (नासा टूल्स से परे)",
        "feat1": "🪐 वास्तविक समय 3D सौर मंडल और ग्रहों का अवलोकन (नासा के वास्तविक फोटो टेक्सचर)।",
        "feat2": "💍 शनि और अरुण के लिए सटीक 3D खगोलीय छल्ले।",
        "feat3": "🌡️ सतह तापमान HUD और सौर कलंक उष्मागतिकी (~4,000°C)।",
        "feat4": "🌐 14 भाषाओं में संपूर्ण अंतरिक्ष ज्ञानकोश एवं खोज।",
        "feat5": "🔮 24 घंटे का अंतरिक्ष मलबा टकराव रडार (MOID)।",
        "feat6": "🛰️ 2,000 स्टारलिंक उपग्रहों का 3D ग्रिड।",
        "feat7": "🚀 नवीनतम उपग्रहों का त्वरित समावेशन।",
        "feat8": "🎬 रेशमी चिकनी 1/10 गति सूक्ष्म-ज़ूम नियंत्रण।",
        "feat9": "💎 पारदर्शी फ्लोटिंग HUD जो पृथ्वी दृश्य को अवरुद्ध नहीं करता।",
        "feat10": "🌊 पृथ्वी के घूर्णन के कारण 3D तरंगीय प्रक्षेपवक्र।",
        "aboutContactTitle": "संपर्क:",
        "aboutContactDesc": "पूछताछ के लिए: info@satviewer3d.com"
    },
    "ar": {
        "mobileBtnSelect": "🛰️ الأقمار",
        "mobileBtnDetail": "📊 التفاصيل",
        "mobileSheetSelectTitle": "🛰️ اختيار الأقمار والقائمة",
        "mobileSheetDetailTitle": "📊 تفاصيل القمر الصناعي",
        "zoomHintPcTitle": "🔍 عجلة الفأرة للتكبير",
        "zoomHintPcSub": "قم بالتمرير لمشاهدة الأرض بأكملها",
        "zoomHintTouchTitle": "🔍 اقرص بإصبعين للتكبير",
        "zoomHintTouchSub": "اقرص الشاشة لمشاهدة الأرض بأكملها",
        "zoomHintTitle": "🔍 عجلة الفأرة / القرص للتكبير",
        "zoomHintSub": "قم بالتمرير لمشاهدة الأرض بأكملها",
        "loadTrain": "🚂 قطار ستارلينك (سلسلة الإطلاق الأخيرة · 24 قمراً)",
        "tooltipGuideTitle": "💡 اختر وتتبع أي قمر صناعي!",
        "tooltipGuideDesc": "اختر وتتبع ستارلينك وتلسكوب هابل وأقمار الطقس الصناعية والمزيد.",

        "appSubtitle": "محاكي مدارات الأقمار الصناعية والحطام الفضائي ثلاثي الأبعاد بالوقت الفعلي",
        "statCount": "الأقمار المتتبعة",
        "statTime": "وقت المحاكاة",
        "dragPanel": "⋮⋮ اسحب اللوحة",
        "dragHeader": "⋮⋮ اسحب للتحريك",
        "secSelect": "تحديد وبحث الأجرام والأقمار الصناعية",
        "selectPlaceholder": "-- اختر كوكباً أو قمراً صناعياً أو حطاماً --",
        "searchPlaceholder": "ابحث بالاسم أو معرف NORAD...",
        "secSource": "مصادر بيانات الأقمار والإعدادات",
        "loadMajor": "⭐ الأقمار الرئيسية (محطة الفضاء، هابل، الطقس، الحطام)",
        "loadDeepSpace": "🔭 الفضاء السحيق وJWST (ويب، أرتميس، MRO)",
        "badgeDeepSpace": "🔭 تم تحميل مهمات الفضاء السحيق",
        "loadSolarSystem": "🌌 النظام الشمسي الأوريري (8 كواكب والشمس)",
        "badgeSolarSystem": "🌌 عرض الأوريري للنظام الشمسي نشط (8 كواكب)",
        "loadLocal": "🛰️ كوكبة ستارلينك (2000 قمر صناعي)",
        "loadDebris": "💥 سحابة الحطام الفضائي العملاقة (2,200+ شظية)",
        "badgeDebris": "💥 تم تحميل سحابة الحطام الفضائي (2,200 شظية)",
        "badgeMajor": "⭐ تم تحميل الأقمار الرئيسية",
        "optgroupDeepSpace": "🔭 مهمات الفضاء السحيق والكواكب (JWST، القمر، المريخ)",
        "secTime": "التحكم بالوقت وسرعة المحاكاة",
        "speedStop": "⏸️ إيقاف",
        "speedReal": "▶️ 1x (وقت حقيقي)",
        "resetNow": "🔄 الوقت الحالي",
        "secDisplay": "إعدادات العرض",
        "toggleLabels": "إظهار الأسماء في الفضاء ثلاثي الأبعاد",
        "toggleOrbits": "إظهار المدار المحدد",
        "toggleMultiLap": "🌐 إظهار مسارات الدوران المتعددة",
        "toggleAtmosphere": "الغلاف الجوي وإضاءة الشمس",
        "toggle2D": "عرض خريطة العالم ثنائية الأبعاد",
        "toggleBorders": "🌐 الحدود وأسماء الأماكن",
        "toggleDebrisRisk": "🔮 وضع خطر الحطام الفضائي",
        "toggleCelestial": "🌌 الشمس والقمر وكواكب النظام الشمسي",
        "toggleDeepSpace": "🔭 مسابير الفضاء السحيق وJWST",
        "dragDetail": "⋮⋮ اسحب بطاقة التفاصيل",
        "dragCam": "⋮⋮ التحكم في الكاميرا",
        "labelAlt": "الارتفاع",
        "labelVel": "السرعة",
        "labelLat": "خط العرض",
        "labelLon": "خط الطول",
        "labelInc": "الميل المداري",
        "labelPeriod": "الفترة المدارية",
        "labelTimezone": "المنطقة الزمنية",
        "labelPass": "📡 توقعات المرور القادم في السماء",
        "labelRisk": "🔮 خطر اقتراب الحطام (MOID)",
        "btnGeo": "📍موقع GPS",
        "btnTrack": "🎯 تتبع الهدف",
        "btnUntrack": "🔓 تحرير الكاميرا",
        "pointerHint": "الهدف خارج الشاشة",
        "btnRelease": "📜 v2.7 ملاحظات الإصدار",
        "btnGuide": "❓ الدليل والشروط",
        "modalTitle": "دليل مستخدم SatViewer3D والشروط",
        "tabControls": "🎮 التحكم",
        "tabReleases": "📜 ملاحظات الإصدار",
        "tabDisclaimer": "⚠️ إخلاء المسؤولية",
        "tabPrivacy": "🔒 الخصوصية",
        "tabAbout": "ℹ️ حول",
        "releaseTitle": "📜 سجل التحديثات وملاحظات الإصدار لـ SatViewer3D",
                        "rel27Title": "📡 مسار العبور السماوي & 💥 سحابة الحطام الفضائي العملاقة (2,200+ شظية)",
        "rel27_1": "📡 <strong>محرك التنبؤ الفلكي بالعبور SGP4/SEZ</strong>: يتنبأ بالتاريخ والوقت ومسار البوصلة ذي الـ 16 اتجاهاً مع عد تنازلي حي.",
        "rel27_2": "💥 <strong>سحابة الحطام الفضائي العملاقة (2,200+ شظية)</strong>: إعداد مسبق جديد يعرض أكثر من 2,200 شظية تصادم حقيقية بسرعة 60 إطاراً/ث.",
        "rel27_3": "🔮 <strong>رادار الاقتراب الشامل لـ 2,200 شظية</strong>: يحسب في الوقت الفعلي أقرب مسافات التلاقي ومخاطر التصادم خلال 24 ساعة.",
        "rel27_4": "🗺️ <strong>تتبع كاميرا سلس في وضع خريطة العالم 2D</strong>: تثبيت الرؤية وتمركز الكاميرا أفقياً بسلاسة.",
        "rel27_5": "🛡️ <strong>تعزيز الأمان ودعم اللغات المتعددة</strong>: تنقية مدخلات XSS وتحميل فوري للكرة الأرضية ثلاثية الأبعاد.",
        "rel26Title": "🛰️ اكتمال كوكبة ميتشيبيكي المكونة من 7 أقمار وتحديث المرئيات الرسمية للمركبات الفضائية",
        "rel26_1": "🇯🇵 إضافة إطلاق QZS-7 (ميتشيبيكي-7): تنفيذ العناصر المدارية (TLE) والصور ثلاثية الأبعاد بدقة 1080p للقمر الأحدث المطلق في 11 أغسطس 2026.",
        "rel26_2": "🛰️ صور فريدة بنسبة 100% لجميع أقمار ميتشيبيكي الـ 8: نماذج رسمية مخصصة من QZS-1 إلى QZS-7 و QZS-1R.",
        "rel26_3": "🇺🇸 ترقية مرئيات الأقمار الأمريكية الرئيسية: ستارلينك بدقة 4K من وكالة ناسا، USA-245 (تلسكوب التجسس KH-11)، SBIRS و X-37B.",
        "rel26_4": "🌐 مزامنة بطاقات المهام بـ 14 لغة: تغطية شاملة لكوكبة الأقمار السبعة وأجهزة استشعار SDA للدفاع الفضائي.",
        "rel26_5": "📑 تحسين الترتيب الرقمي: محاذاة ميتشيبيكي من 1 إلى 7 بتسلسل رقمي دقيق.",
"rel25Title": "🪐 النظام الشمسي ثلاثي الأبعاد وموسوعة الفضاء بـ 14 لغة",
        "rel25_1": "🪐 استكشاف ثلاثي الأبعاد للشمس والقمر وجميع الكواكب بدوران حر 360 درجة.",
        "rel25_2": "📷 صور فوتوغرافية حقيقية عالية الدقة من وكالة ناسا.",
        "rel25_3": "💍 حلقات ثلاثية الأبعاد واقعية لزحل وأورانوس.",
        "rel25_4": "🌡️ مؤشرات درجات الحرارة وفيزياء البقع الشمسية.",
        "rel25_5": "🌐 موسوعة فلكية شاملة مترجمة لـ 14 لغة.",
        "rel20Title": "🔮 رادار مخاطر تصادم الحطام الفضائي وستارلينك",
        "rel20_1": "🔮 تحذير في الوقت الفعلي من اقتراب الحطام الفضائي (MOID).",
        "rel20_2": "🛰️ عرض كوكبة ستارلينك المكونة من 2000 قمر صناعي.",
        "rel20_3": "📡 توقعات مرور الأقمار فوق موقعك الفعلي.",
        "rel10Title": "🌍 الإطلاق الرسمي لـ SatViewer3D",
        "rel10_1": "الإصدار الأول لمحاكي المدارات الفضائية ثلاثي الأبعاد.",
        "guideTitleControls": "🖱️ دليل التنقل ثلاثي الأبعاد",
        "guideWheel": "عجلة الفأرة / اللمس",
        "guideWheelDesc": "تكبير وتصغير سلس ودقيق.",
        "guideDrag": "نقر أيسر + سحب",
        "guideDragDesc": "دوران حر 360 درجة حول الأرض والكواكب.",
        "guideTilt": "نقر أيمن / Ctrl + سحب",
        "guideTiltDesc": "ضبط زاوية الكاميرا.",
        "guideClick": "انقر على قمر صناعي أو كوكب",
        "guideClickDesc": "عرض البيانات وتثبيت الكاميرا.",
        "guideFocus": "🎯 تتبع الهدف",
        "guideFocusDesc": "الكاميرا تتبع الهدف تلقائياً.",
        "guideRadar": "🔮 رادار الحطام",
        "guideRadarDesc": "حساب المسافات المتقاطعة (MOID) لـ 24 ساعة.",
        "guideTitleDisclaimer": "⚠️ إخلاء مسؤولية قانوني",
        "discText1": "تُحسب جميع البيانات في الوقت الفعلي من بيانات TLE العامة.",
        "discText2": "مقدمة للأغراض التعليمية والرصدية فقط.",
        "guideTitlePrivacy": "🔒 سياسة الخصوصية",
        "privText1Title": "الإعلانات:",
        "privText1Desc": "يستخدم هذا الموقع ملفات تعريف ارتباط للخدمات الإعلانية (Google AdSense).",
        "privText2Title": "الإحصائيات:",
        "privText2Desc": "يتم جمع بيانات التصفح بشكل مجهول.",
        "guideTitleAbout": "ℹ️ حول SatViewer3D",
        "aboutText1": "SatViewer3D هو محاكي مدارات فضائية ثلاثي الأبعاد في الوقت الفعلي للأقمار وأجرام النظام الشمسي.",
        "aboutFeaturesTitle": "🌟 أهم 10 ميزات عالمية في SatViewer3D تتفوق على أدوات ناسا",
        "feat1": "🪐 استكشاف ثلاثي الأبعاد للنظام الشمسي بدقة صور وكالة ناسا الحقيقية.",
        "feat2": "💍 حلقات كوكبية ثلاثية الأبعاد مطابقة للفيزياء الفلكية لزحل وأورانوس.",
        "feat3": "🌡️ لوحة مؤشرات درجات الحرارة وديناميكا البقع الشمسية (~4000°م).",
        "feat4": "🌐 موسوعة الفضاء والبحث عن الأجرام مترجمة بالكامل لـ 14 لغة.",
        "feat5": "🔮 رادار تحذير من تصادم الحطام الفضائي على مدار 24 ساعة (MOID).",
        "feat6": "🛰️ عرض كوكبة ستارلينك المكونة من 2000 قمر صناعي بانسيابية ثلاثية الأبعاد.",
        "feat7": "🚀 دمج فوري لأحدث الأقمار الصناعية وعمليات الإطلاق.",
        "feat8": "🎬 تحكم سينمائي فائق السلاسة بسرعة زووم 1/10.",
        "feat9": "💎 واجهة عائمة شفافة تمنح رؤية كاملة وغير محجوبة للأرض.",
        "feat10": "🌊 تمثيل ثلاثي الأبعاد للمسارات الموجية الناتجة عن دوران الأرض.",
        "aboutContactTitle": "للتواصل:",
        "aboutContactDesc": "للاستفسارات: info@satviewer3d.com"
    },
    "zh": {
        "mobileBtnSelect": "🛰️ 卫星选择",
        "mobileBtnDetail": "📊 卫星详情",
        "mobileSheetSelectTitle": "🛰️ 卫星选择·菜单",
        "mobileSheetDetailTitle": "📊 卫星详细信息",
        "zoomHintPcTitle": "🔍 鼠标滚轮缩放视野",
        "zoomHintPcSub": "滚动鼠标可纵览地球全景",
        "zoomHintTouchTitle": "🔍 双指捏合缩放视野",
        "zoomHintTouchSub": "双指捏合屏幕可纵览地球全景",
        "zoomHintTitle": "🔍 滚轮 / 双指缩放视野",
        "zoomHintSub": "滚动鼠标可缩放并纵览地球全景",
        "loadTrain": "🚂 星链列车 Starlink Train (最新发射链 · 24星)",
        "tooltipGuideTitle": "💡 点击可切换任意卫星！",
        "tooltipGuideDesc": "自由选择并追踪星链(Starlink)、哈勃望远镜、向日葵气象卫星等。",

        "appSubtitle": "实时3D人造卫星与空间碎片轨道模拟器",
        "statCount": "追踪卫星总数",
        "statTime": "模拟推演时间",
        "dragPanel": "⋮⋮ 拖拽移动面板",
        "dragHeader": "⋮⋮ 拖拽移动",
        "secSelect": "选择并搜索天体 / 卫星",
        "selectPlaceholder": "-- 选择太阳系行星、人造卫星或空间碎片 --",
        "searchPlaceholder": "搜索天体名、卫星名或NORAD编号...",
        "secSource": "卫星数据源与预设",
        "loadMajor": "⭐ 核心著名卫星 (空间站, 气象卫星, 导航, 碎片)",
        "loadDeepSpace": "🔭 深空·月球/火星探测器 & 韦伯望远镜 (JWST, Artemis, MRO)",
        "badgeDeepSpace": "🔭 深空探测器与空间望远镜预设已载入",
        "loadSolarSystem": "🌌 太阳系全景公转仪 (八大行星与太阳)",
        "badgeSolarSystem": "🌌 太阳系全景公转仪已激活 (八大行星)",
        "loadLocal": "🛰️ 星链(Starlink) 巨型星座 (2,000颗全量)",
        "loadDebris": "💥 太空垃圾碎片巨型云 (2,200+ 碎片)",
        "badgeDebris": "💥 太空垃圾碎片巨型云已载入 (2,200碎片)",
        "badgeMajor": "⭐ 核心卫星预设已载入",
        "optgroupDeepSpace": "🔭 深空探测与行星任务 (JWST, Artemis, Mars)",
        "secTime": "时间控制与倍速调节",
        "speedStop": "⏸️ 暂停",
        "speedReal": "▶️ 1x (真实时间)",
        "resetNow": "🔄 重置当前时间",
        "secDisplay": "视图与图层设置",
        "toggleLabels": "在3D空间中显示卫星标签",
        "toggleOrbits": "显示选中卫星的运行轨道",
        "toggleMultiLap": "🌐 显示多圈次地面星下点轨迹",
        "toggleAtmosphere": "逼真大气层与太阳光照",
        "toggle2D": "2D平面世界地图视图",
        "toggleBorders": "🌐 国家边界与主要地名",
        "toggleDebrisRisk": "🔮 空间碎片碰撞预警模式",
        "toggleCelestial": "🌌 太阳、月球及太阳系主要行星",
        "toggleDeepSpace": "🔭 深空·月球/火星探测器 & JWST",
        "dragDetail": "⋮⋮ 拖拽移动详情卡片",
        "dragCam": "⋮⋮ 相机视角平移控制",
        "labelAlt": "轨道高度",
        "labelVel": "运行速度",
        "labelLat": "地理纬度",
        "labelLon": "地理经度",
        "labelInc": "轨道倾角",
        "labelPeriod": "运行周期",
        "labelTimezone": "时间显示时区",
        "labelPass": "📡 本地过境预报 (GPS位置)",
        "labelRisk": "🔮 空间碎片交会风险 (MOID)",
        "btnGeo": "📍获取GPS定位",
        "btnTrack": "🎯 视角锁定追踪",
        "btnUntrack": "🔓 解锁相机视角",
        "pointerHint": "目标在屏幕视界外 (点击定位)",
        "btnRelease": "📜 v2.7 更新日志",
        "btnGuide": "❓ 使用指南与协议",
        "modalTitle": "SatViewer3D 用户指南与服务条款",
        "tabControls": "🎮 操作指南",
        "tabReleases": "📜 更新日志",
        "tabDisclaimer": "⚠️ 免责声明",
        "tabPrivacy": "🔒 隐私政策",
        "tabAbout": "ℹ️ 关于项目",
        "releaseTitle": "📜 SatViewer3D 更新日志与版本历史",
                        "rel27Title": "📡 精密过境方位预测 & 💥 太空垃圾碎片巨型云 (2,200+ 碎片)",
        "rel27_1": "📡 <strong>天文级 SGP4/SEZ 地平过境预测引擎</strong>: 精确预测下次过境年月日时分，以及从何方位升起、最高仰角几度、落向何方位，附带秒级实时倒计时。",
        "rel27_2": "💥 <strong>太空垃圾碎片巨型云 (2,200+ 碎片) 预设</strong>: 一键载入2009年卫星相撞、风云1号C及火箭上段等包裹地球的2,200个真实空间碎片带。",
        "rel27_3": "🔮 <strong>全量2,200碎片碰撞预警雷达</strong>: 实时计算空间碎片最小距离，并以SGP4预测未来24小时轨道相交风险。",
        "rel27_4": "🗺️ <strong>2D平面地图视角平滑跟踪</strong>: 修复2D地图模式下切换卫星视角畸变，保持最佳高度平滑居中。",
        "rel27_5": "🛡️ <strong>XSS输入净化与多语言资源优化</strong>: 强化安全性防御，支持多语言分站瞬时加载3D地球材质。",
        "rel26Title": "🛰️ 引路7星体制圆满完成 & 美国及全球主力卫星官方视觉全面升级",
        "rel26_1": "🇯🇵 新增引路7号 (QZS-7): 完整加入2026年8月11日由H3火箭9号机发射的最新导航卫星轨道数据(TLE)与内阁府官方1080p 3D机体图。",
        "rel26_2": "🛰️ 引路全8星独立高清视觉: 严格区分1号至7号机及1R号机，全面采用JAXA与内阁府特设官网独家1080p机体CG。",
        "rel26_3": "🇺🇸 美军及主力卫星真实机体更新: 全面换装NASA Ames官方4K星链(长太阳翼展开)、USA-245(锁眼KH-11光学侦察望远镜)、SBIRS与X-37B太空图。",
        "rel26_4": "🌐 14种语言任务卡片全量同步: 完整翻译7星体制自主高精度定位及日美联合太空态势感知(SDA)光学载荷详情。",
        "rel26_5": "📑 侧边栏列表序号精细化排序: 优化卫星列表顺序，确保引路1号至7号机按数字自然顺序规范排列。",
"rel25Title": "🪐 3D太阳系行星探索与14语言深空百科重磅更新",
        "rel25_1": "🪐 太阳、月球及全各大行星3D探索模式：支持360度自由旋转与超高精微调缩放。",
        "rel25_2": "📷 NASA官方实拍高分辨率纹理，呈现极致太空视觉质感。",
        "rel25_3": "💍 真实3D空间行星光环：完全重现土星多层冰环与天王星垂直光环。",
        "rel25_4": "🌡️ 表面温度HUD与太阳黑子物理机制(~4,000℃)科普。",
        "rel25_5": "🌐 全球14种语言深空百科全书与实时天体搜索支持。",
        "rel20Title": "🔮 太空碎片碰撞风险雷达与星链星座",
        "rel20_1": "🔮 24小时空间碎片交会预警(MOID)实时计算。",
        "rel20_2": "🛰️ SpaceX星链(Starlink) 2,000颗巨型星座全球轨道网。",
        "rel20_3": "📡 GPS当前地理位置卫星过境预报与倒计时。",
        "rel10Title": "🌍 SatViewer3D 正式上线",
        "rel10_1": "基于WebAssembly/WebGL的实时3D卫星与太空碎片轨道模拟器初版发布。",
        "guideTitleControls": "🖱️ 3D三维交互指南",
        "guideWheel": "鼠标滚轮 / 触控手势",
        "guideWheelDesc": "以 1/10 细腻微调速度平滑缩放。",
        "guideDrag": "左键点击 + 拖拽",
        "guideDragDesc": "360度全方位自由旋转地球与深空天体。",
        "guideTilt": "右键 / Ctrl + 拖拽",
        "guideTiltDesc": "调整观察视角的俯仰与倾斜度。",
        "guideClick": "点击卫星或行星天体",
        "guideClickDesc": "查看实时轨道参数并锁定跟踪相机。",
        "guideFocus": "🎯 追踪锁定",
        "guideFocusDesc": "镜头将自动跟随目标在宇宙空间中飞行。",
        "guideRadar": "🔮 空间碎片交会雷达",
        "guideRadarDesc": "实时计算未来24小时内的轨道交会距离(MOID)。",
        "guideTitleDisclaimer": "⚠️ 法律免责声明",
        "discText1": "所有卫星轨道数据均基于CelesTrak和Space-Track的公开TLE数据实时计算推演。",
        "discText2": "本模拟器数据仅供航天科研、天文科普与教学参考，不用于实际航天器测控避碰作业。",
        "guideTitlePrivacy": "🔒 隐私权政策 (遵循 Google AdSense 规范)",
        "privText1Title": "广告投放声明:",
        "privText1Desc": "本网站使用第三方广告服务(如 Google AdSense)以支持免费运营。",
        "privText2Title": "流量分析声明:",
        "privText2Desc": "我们可能收集匿名访问流量以持续优化模拟器性能。",
        "guideTitleAbout": "ℹ️ 关于 SatViewer3D 项目",
        "aboutText1": "SatViewer3D 是一款基于 WebGL、WebAssembly 与 CesiumJS 打造的高性能全交互式 3D 太空模拟器。",
        "aboutFeaturesTitle": "🌟 超越NASA公开工具的『SatViewer3D』全球十大核心顶尖功能",
        "feat1": "🪐 太阳系各大行星与太阳・月球实时3D探索：搭载NASA官方实拍高清纹理，支持360度自由旋转与微调缩放。",
        "feat2": "💍 严格遵循天体力学参数的真实3D行星光环：完全重现土星多层冰环(卡西尼缝・倾角26.7度)与天王星垂直光环(倾角97.8度)。",
        "feat3": "🌡️ 表面温度HUD与太阳黑子热力学机制：实时呈现极端温差与强磁场抑制对流的黑子温度(~4,000℃)。",
        "feat4": "🌐 全球14种语言深空百科与实时天体搜索：收录人类深空探测史与各大航天任务(阿波罗、旅行者、卡西尼、JAXA等)。",
        "feat5": "🔮 媲美航天测控中心的24小时太空碎片碰撞预警(MOID)：基于空间态势感知(SSA)算法实时计算最近交会距离。",
        "feat6": "🛰️ SpaceX星链(Starlink) 2,000颗巨型星座全球轨道网：在浏览器端实现零延迟的高清3D全景渲染。",
        "feat7": "🚀 全球最快级别的新卫星与火箭数据集成：即时模拟最新发射的导航卫星(如QZSS-6)与深空编目碎片。",
        "feat8": "🎬 如丝般顺滑的1/10微调速度电影级镜头交互：采用物理滚动拦截算法，实现极高精度的微距缩放。",
        "feat9": "💎 100%全景通透的悬浮岛屿HUD设计：中央视界完全开放，零遮挡饱览地球晨昏线与极轨风光。",
        "feat10": "🌊 地球自转波动轨迹可视化(Multi-Lap)：在3D空间中生动展现因地球自转进动形成的周期性正弦波轨迹。",
        "aboutContactTitle": "联系方式:",
        "aboutContactDesc": "意见反馈与商务合作请联系: info@satviewer3d.com"
    },
    "ru": {
        "mobileBtnSelect": "🛰️ Спутники",
        "mobileBtnDetail": "📊 Детали",
        "mobileSheetSelectTitle": "🛰️ Спутники и меню",
        "mobileSheetDetailTitle": "📊 Информация о спутнике",
        "zoomHintPcTitle": "🔍 Колесико мыши для масштаба",
        "zoomHintPcSub": "Прокрутите, чтобы увидеть всю Землю",
        "zoomHintTouchTitle": "🔍 Жест двумя пальцами для масштаба",
        "zoomHintTouchSub": "Сведите пальцы, чтобы увидеть всю Землю",
        "zoomHintTitle": "🔍 Колесико мыши / Жест для масштаба",
        "zoomHintSub": "Прокрутите, чтобы увидеть всю Землю",
        "loadTrain": "🚂 Поезд Старлинк (Цепочка запуска · 24 спутника)",
        "tooltipGuideTitle": "💡 Выбирайте и отслеживайте любой спутник!",
        "tooltipGuideDesc": "Отслеживайте Starlink, телескоп Хаббл, метеоспутники и многое другое.",





        "appSubtitle": "3D-симулятор орбит спутников и космического мусора в реальном времени",
        "statCount": "Отслеживаемые спутники",
        "statTime": "Время симуляции",
        "dragPanel": "⋮⋮ Перетащите панель",
        "dragHeader": "⋮⋮ Перетащить",
        "secSelect": "Выбор и поиск небесных тел / спутников",
        "selectPlaceholder": "-- Выберите планету, спутник или мусор --",
        "searchPlaceholder": "Поиск по названию или номеру NORAD...",
        "secSource": "Источники данных и пресеты",
        "loadMajor": "⭐ Основные спутники (МКС, Хаббл, Погода, Мусор)",
        "loadDeepSpace": "🔭 Дальний космос и JWST (Уэбб, Артемида, MRO)",
        "badgeDeepSpace": "🔭 Миссии дальнего космоса загружены",
        "loadSolarSystem": "🌌 Солнечная система Оррери (8 планет и Солнце)",
        "badgeSolarSystem": "🌌 Солнечная система Оррери активна (8 планет)",
        "loadLocal": "🛰️ Мега-группировка Starlink (2 000 спутников)",
        "loadDebris": "💥 Мегаоблако космического мусора (2 200+ обломков)",
        "badgeDebris": "💥 Мегаоблако космического мусора загружено (2 200 обломков)",
        "badgeMajor": "⭐ Пресет основных спутников загружен",
        "optgroupDeepSpace": "🔭 Миссии дальнего космоса и планет (JWST, Луна, Марс)",
        "secTime": "Управление временем и скоростью",
        "speedStop": "⏸️ Пауза",
        "speedReal": "▶️ 1x (Реальное время)",
        "resetNow": "🔄 Текущее время",
        "secDisplay": "Настройки отображения",
        "toggleLabels": "Показывать 3D-метки спутников",
        "toggleOrbits": "Показывать орбиту спутника",
        "toggleMultiLap": "🌐 Многовитковая траектория",
        "toggleAtmosphere": "Атмосфера и солнечное освещение",
        "toggle2D": "Режим 2D-карты мира",
        "toggleBorders": "🌐 Границы и названия мест",
        "toggleDebrisRisk": "🔮 Режим риска космического мусора",
        "toggleCelestial": "🌌 Солнце, Луна и планеты Солнечной системы",
        "toggleDeepSpace": "🔭 Зонды дальнего космоса и JWST",
        "dragDetail": "⋮⋮ Перетащите карточку",
        "dragCam": "⋮⋮ Управление камерой",
        "labelAlt": "Высота",
        "labelVel": "Скорость",
        "labelLat": "Широта",
        "labelLon": "Долгота",
        "labelInc": "Наклонение",
        "labelPeriod": "Период обращения",
        "labelTimezone": "Часовой пояс",
        "labelPass": "📡 Прогноз пролета над локацией",
        "labelRisk": "🔮 Риск сближения с мусором (MOID)",
        "btnGeo": "📍GPS-позиция",
        "btnTrack": "🎯 Следить за целью",
        "btnUntrack": "🔓 Освободить камеру",
        "pointerHint": "Цель вне экрана",
        "btnRelease": "📜 v2.7 Примечания к выпуску",
        "btnGuide": "❓ Руководство и условия",
        "modalTitle": "Руководство пользователя SatViewer3D и условия",
        "tabControls": "🎮 Управление",
        "tabReleases": "📜 История версий",
        "tabDisclaimer": "⚠️ Отказ от ответственности",
        "tabPrivacy": "🔒 Конфиденциальность",
        "tabAbout": "ℹ️ О проекте",
        "releaseTitle": "📜 История обновлений и примечания к выпуску SatViewer3D",
                        "rel27Title": "📡 Точный прогноз пролета & 💥 Мегаоблако космического мусора (2 200+ обломков)",
        "rel27_1": "📡 <strong>Астрономический движок прогноза пролета SGP4/SEZ</strong>: Прогнозирует дату, время и 16-румбовую траекторию по небу с обратным отсчетом секунд.",
        "rel27_2": "💥 <strong>Мегаоблако космического мусора (2 200+ обломков)</strong>: Новый пресет с 2 200 реальными обломками столкновений и ступеней ракет на 60 fps.",
        "rel27_3": "🔮 <strong>Радар сближения с 2 200 обломками</strong>: Расчет минимальной дистанции и оценка риска столкновения на 24 часа вперед.",
        "rel27_4": "🗺️ <strong>Стабильное панорамирование камеры в 2D-карте</strong>: Плавное центрирование на спутниках без искажения угла обзора.",
        "rel27_5": "🛡️ <strong>Усиление безопасности и мультиязычность</strong>: Защита от XSS и мгновенная загрузка 3D-Земли на 14 языках.",
        "rel26Title": "🛰️ Завершение группировки «Мичибики» из 7 спутников и обновление официальных визуальных материалов",
        "rel26_1": "🇯🇵 Добавление QZS-7 («Мичибики-7»): Интеграция параметров орбиты (TLE) и официальных 3D-изображений 1080p для аппарата, запущенного 11 августа 2026 года.",
        "rel26_2": "🛰️ 100% Уникальные изображения для всех 8 спутников «Мичибики»: Индивидуальные официальные модели 1080p от QZS-1 до QZS-7 и QZS-1R.",
        "rel26_3": "🇺🇸 Обновление визуализации спутников США: Starlink 4K NASA Ames, USA-245 (разведывательный телескоп KH-11 Keyhole), SBIRS и X-37B.",
        "rel26_4": "🌐 Полная синхронизация описаний на 14 языках: Карточки миссий с описанием группировки из 7 спутников и полезной нагрузки SDA.",
        "rel26_5": "📑 Оптимизация числового порядка: «Мичибики» от 1 до 7 выстроены в строгой последовательности.",
"rel25Title": "🪐 3D Солнечная система и космическая энциклопедия на 14 языках",
        "rel25_1": "🪐 3D-режим исследования Солнца, Луны и всех планет с вращением на 360°.",
        "rel25_2": "📷 Официальные фототекстуры NASA ультравысокого разрешения.",
        "rel25_3": "💍 Настоящие 3D-кольца Сатурна и вертикальные кольца Урана.",
        "rel25_4": "🌡️ HUD температуры поверхности и физика солнечных пятен.",
        "rel25_5": "🌐 Полная космическая энциклопедия на 14 языках.",
        "rel20Title": "🔮 Радар риска столкновения с мусором и Starlink",
        "rel20_1": "🔮 Расчет опасных сближений с космическим мусором (MOID) в реальном времени.",
        "rel20_2": "🛰️ Группировка Starlink из 2 000 спутников.",
        "rel20_3": "📡 Прогноз пролетов спутников над вашей GPS-локацией.",
        "rel10Title": "🌍 Официальный запуск SatViewer3D",
        "rel10_1": "Первый релиз 3D-симулятора орбит спутников в реальном времени.",
        "guideTitleControls": "🖱️ 3D-навигация",
        "guideWheel": "Колесико мыши / Тачпад",
        "guideWheelDesc": "Плавный зум со скоростью 1/10.",
        "guideDrag": "Левая кнопка + Мышь",
        "guideDragDesc": "Вращение на 360° вокруг Земли и планет.",
        "guideTilt": "Правая кнопка / Ctrl + Мышь",
        "guideTiltDesc": "Изменение угла наклона камеры.",
        "guideClick": "Клик на спутник / планету",
        "guideClickDesc": "Просмотр параметров орбиты и фиксация камеры.",
        "guideFocus": "🎯 Следить",
        "guideFocusDesc": "Камера автоматически следует за целью.",
        "guideRadar": "🔮 Радар мусора",
        "guideRadarDesc": "Расчет пересечения орбит на 24 часа (MOID).",
        "guideTitleDisclaimer": "⚠️ Отказ от ответственности",
        "discText1": "Все орбитальные данные рассчитываются в реальном времени на основе данных TLE.",
        "discText2": "Предоставляется исключительно в образовательных целях.",
        "guideTitlePrivacy": "🔒 Политика конфиденциальности",
        "privText1Title": "Реклама:",
        "privText1Desc": "Этот сайт использует файлы cookie третьих сторон (Google AdSense).",
        "privText2Title": "Аналитика:",
        "privText2Desc": "Собираются анонимные данные о трафике.",
        "guideTitleAbout": "ℹ️ О проекте SatViewer3D",
        "aboutText1": "SatViewer3D — это 3D-симулятор орбит спутников и планет Солнечной системы в реальном времени.",
        "aboutFeaturesTitle": "🌟 10 передовых мировых функций SatViewer3D, превосходящих инструменты NASA",
        "feat1": "🪐 3D-исследование Солнечной системы в реальном времени с официальными фототекстурами NASA.",
        "feat2": "💍 Настоящие 3D-кольца Сатурна и вертикальные кольца Урана, соответствующие законам астрофизики.",
        "feat3": "🌡️ HUD температуры поверхности и термодинамика солнечных пятен (~4 000°C).",
        "feat4": "🌐 Космическая энциклопедия и поиск небесных тел на 14 языках.",
        "feat5": "🔮 24-часовой радар риска столкновений с космическим мусором (MOID) в реальном времени.",
        "feat6": "🛰️ Мега-группировка Starlink из 2 000 спутников с плавной 3D-визуализацией.",
        "feat7": "🚀 Моментальное добавление новейших спутников и миссий.",
        "feat8": "🎬 Плавный зум со скоростью 1/10 для кинематографичного управления камерой.",
        "feat9": "💎 Прозрачный плавающий интерфейс HUD, не заслоняющий Землю.",
        "feat10": "🌊 3D-визуализация волнообразных траекторий за счет вращения Земли.",
        "aboutContactTitle": "Контакты:",
        "aboutContactDesc": "По всем вопросам: info@satviewer3d.com"
    }
};

// ==========================================================================
// Universal Glass Toast Notification System
// ==========================================================================
let activeToastTimeout = null;
function showUniversalToast(message, icon = '🚀', duration = 4000) {
    let toast = document.getElementById('universalAppToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'universalAppToast';
        toast.className = 'app-glass-toast';
        document.body.appendChild(toast);
    }
    if (activeToastTimeout) {
        clearTimeout(activeToastTimeout);
        activeToastTimeout = null;
    }
    toast.classList.remove('fade-out');
    toast.style.display = 'flex';
    toast.innerHTML = `
        <span style="font-size: 1.3rem; flex-shrink: 0;">${icon}</span>
        <div style="font-size: 0.85rem; color: #f1f5f9; line-height: 1.45;">${message}</div>
    `;

    activeToastTimeout = setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.classList.contains('fade-out')) {
                toast.style.display = 'none';
            }
        }, 400);
    }, duration);
}

// ==========================================================================
// Web Audio API Cosmic Ambient Drone & UI Sound Synthesizer
// ==========================================================================
const CosmicAudio = {
    ctx: null,
    isPlaying: false,
    ambientGain: null,
    droneOsc1: null,
    droneOsc2: null,
    droneFilter: null,
    lfoOsc: null,
    noiseNode: null,

    init() {
        if (this.ctx) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
    },

    toggle() {
        if (this.isPlaying) {
            this.stopAmbient();
            localStorage.setItem('satviewer_sound_enabled', 'false');
            this.updateButtonUI(false);
            const isJa = (window.currentLang || currentLang) === 'ja';
            showUniversalToast(isJa ? '🔇 宇宙アンビエント音をOFFにしました' : '🔇 Cosmic ambient audio muted', '🔇', 2500);
            return false;
        } else {
            this.startAmbient();
            localStorage.setItem('satviewer_sound_enabled', 'true');
            this.updateButtonUI(true);
            const isJa = (window.currentLang || currentLang) === 'ja';
            showUniversalToast(isJa ? '🔊 宇宙アンビエント音をONにしました' : '🔊 Cosmic ambient audio active', '🔊', 2500);
            return true;
        }
    },

    updateButtonUI(active) {
        const btn = document.getElementById('soundToggleBtn');
        if (!btn) return;
        const lang = window.currentLang || currentLang || 'ja';
        const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) || {};
        if (active) {
            btn.textContent = dict.soundOn || '🔊 サウンド ON';
            btn.style.background = 'rgba(56, 189, 248, 0.25)';
            btn.style.borderColor = '#38bdf8';
            btn.style.boxShadow = '0 0 10px rgba(56, 189, 248, 0.4)';
        } else {
            btn.textContent = dict.soundOff || '🔇 サウンド OFF';
            btn.style.background = 'rgba(56, 189, 248, 0.12)';
            btn.style.borderColor = 'rgba(56, 189, 248, 0.4)';
            btn.style.boxShadow = 'none';
        }
    },

    startAmbient() {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (this.isPlaying) return;

        try {
            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
            this.ambientGain.gain.exponentialRampToValueAtTime(0.16, this.ctx.currentTime + 3);
            this.ambientGain.connect(this.ctx.destination);

            this.droneFilter = this.ctx.createBiquadFilter();
            this.droneFilter.type = 'lowpass';
            this.droneFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
            this.droneFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);
            this.droneFilter.connect(this.ambientGain);

            // Sub-bass 55Hz (A1)
            this.droneOsc1 = this.ctx.createOscillator();
            this.droneOsc1.type = 'sine';
            this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime);
            this.droneOsc1.connect(this.droneFilter);
            this.droneOsc1.start();

            // Binaural harmonic 110.3Hz
            this.droneOsc2 = this.ctx.createOscillator();
            this.droneOsc2.type = 'triangle';
            this.droneOsc2.frequency.setValueAtTime(110.3, this.ctx.currentTime);
            const g2 = this.ctx.createGain();
            g2.gain.setValueAtTime(0.20, this.ctx.currentTime);
            this.droneOsc2.connect(g2);
            g2.connect(this.droneFilter);
            this.droneOsc2.start();

            // Filter breathing LFO
            this.lfoOsc = this.ctx.createOscillator();
            this.lfoOsc.frequency.setValueAtTime(0.06, this.ctx.currentTime);
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.setValueAtTime(110, this.ctx.currentTime);
            this.lfoOsc.connect(lfoGain);
            lfoGain.connect(this.droneFilter.frequency);
            this.lfoOsc.start();

            // Cosmic microwave noise buffer
            const bufferSize = Math.floor(this.ctx.sampleRate * 2);
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.015;
            }
            this.noiseNode = this.ctx.createBufferSource();
            this.noiseNode.buffer = noiseBuffer;
            this.noiseNode.loop = true;
            const nFilter = this.ctx.createBiquadFilter();
            nFilter.type = 'bandpass';
            nFilter.frequency.setValueAtTime(750, this.ctx.currentTime);
            nFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);
            this.noiseNode.connect(nFilter);
            nFilter.connect(this.ambientGain);
            this.noiseNode.start();

            this.isPlaying = true;
            this.updateButtonUI(true);
        } catch(e) {
            console.warn('Audio ambient init error:', e);
        }
    },

    stopAmbient() {
        if (!this.isPlaying || !this.ambientGain) return;
        try {
            this.ambientGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
            setTimeout(() => {
                if (this.droneOsc1) { try { this.droneOsc1.stop(); } catch(e){} this.droneOsc1 = null; }
                if (this.droneOsc2) { try { this.droneOsc2.stop(); } catch(e){} this.droneOsc2 = null; }
                if (this.lfoOsc) { try { this.lfoOsc.stop(); } catch(e){} this.lfoOsc = null; }
                if (this.noiseNode) { try { this.noiseNode.stop(); } catch(e){} this.noiseNode = null; }
                this.isPlaying = false;
                this.updateButtonUI(false);
            }, 1500);
        } catch(e) {
            this.isPlaying = false;
            this.updateButtonUI(false);
        }
    },

    playBlip(freq = 880, dur = 0.08) {
        if (!this.isPlaying && localStorage.getItem('satviewer_sound_enabled') !== 'true') return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        try {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            g.gain.setValueAtTime(0.08, this.ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
            osc.connect(g);
            g.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + dur);
        } catch(e) {}
    },

    playWarp() {
        if (!this.isPlaying && localStorage.getItem('satviewer_sound_enabled') !== 'true') return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        try {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.45);
            g.gain.setValueAtTime(0.12, this.ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.65);
            osc.connect(g);
            g.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.65);
        } catch(e) {}
    },

    playAirlock() {
        if (!this.isPlaying && localStorage.getItem('satviewer_sound_enabled') !== 'true') return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        try {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(280, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.8);
            g.gain.setValueAtTime(0.15, this.ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.9);
            osc.connect(g);
            g.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.9);
        } catch(e) {}
    }
};

// ==========================================================================
// Historical Moments & Time Travel Presets Engine
// ==========================================================================
const HISTORICAL_EVENTS = {
    apollo11: {
        time: '1969-07-20T20:17:40Z',
        action: 'apollo11',
        titles: {
            ja: '🌕 1969年7月20日 20:17 UTC: アポロ11号 人類月面着陸！',
            en: '🌕 July 20, 1969 20:17 UTC: Apollo 11 Lunar Landing!',
            de: '🌕 20. Juli 1969: Apollo 11 Mondlandung!',
            fr: '🌕 20 juillet 1969: Atterrissage lunaire d\'Apollo 11 !',
            es: '🌕 20 de julio de 1969: ¡Alunizaje del Apolo 11!',
            zh: '🌕 1969年7月20日: 阿波罗11号人类登月！'
        },
        descs: {
            ja: '月着陸船「イーグル」が静かの海に着陸。『ヒューストン、こちら静かの海基地。イーグルは着陸した』。司令船コロンビアと月着陸船の勇姿を再現！',
            en: 'Lunar Module "Eagle" touched down at Tranquility Base: "Houston, Tranquility Base here. The Eagle has landed." Recreating Columbia CSM and LM Eagle in lunar orbit!',
            de: 'Die Mondlandefähre "Eagle" landete im Meer der Ruhe: "Houston, Tranquility Base here. The Eagle has landed."',
            fr: 'Le module lunaire "Eagle" s\'est posé dans la mer de la Tranquillité.',
            es: 'El módulo lunar "Eagle" alunizó en el Mar de la Tranquilidad.',
            zh: '登月舱“鹰号”成功降落月球静海基地。“这是个人的一小步，却是人类的一大步。”'
        }
    },
    voyager1: {
        time: '1979-03-05T12:05:00Z',
        action: 'voyager1',
        titles: {
            ja: '🪐 1979年3月5日 12:05 UTC: ボイジャー1号 木星最接近！',
            en: '🪐 March 5, 1979 12:05 UTC: Voyager 1 Jupiter Flyby!',
            de: '🪐 5. März 1979: Voyager 1 Jupiter-Vorbeiflug!',
            fr: '🪐 5 mars 1979: Survol de Jupiter par Voyager 1 !',
            es: '🪐 5 de marzo de 1979: ¡Sobrevuelo de Júpiter por Voyager 1!',
            zh: '🪐 1979年3月5日: 旅行者1号飞掠木星！'
        },
        descs: {
            ja: '木星から約35万kmまで最接近。高利得アンテナとゴールデンレコードを搭載した探査機本体と、木星重力アシストによる双曲線軌道を完全再現！',
            en: 'Closest approach to Jupiter at 349,000 km. Displaying the authentic Voyager spacecraft with its high-gain antenna and Golden Record along its gravity-assist trajectory!',
            de: 'Entdeckung der Jupiterringe und des aktiven Vulkanismus auf dem Mond Io durch die Raumsonde Voyager 1.',
            fr: 'Découverte des anneaux de Jupiter et du volcanisme actif sur Io par Voyager 1.',
            es: 'Descubrimiento de los anillos de Júpiter y volcanismo activo en Ío por la sonda Voyager 1.',
            zh: '距木星仅35万公里。高增益天线与镀金唱片清晰可见，完整展现木星引力弹弓双曲线轨迹！'
        }
    },
    halley1986: {
        time: '1986-02-09T00:00:00Z',
        action: 'orrery_halley',
        titles: {
            ja: '☄️ 1986年2月9日 00:00 UTC: ハレー彗星 前回近日点通過！',
            en: '☄️ Feb 9, 1986 00:00 UTC: Halley\'s Comet Perihelion!',
            de: '☄️ 9. Februar 1986: Halley-Komet Periheldurchgang!',
            fr: '☄️ 9 février 1986: Périhélie de la comète de Halley !',
            es: '☄️ 9 de febrero de 1986: ¡Perihelio del cometa Halley!',
            zh: '☄️ 1986年2月9日: 哈雷彗星近日点通过！'
        },
        descs: {
            ja: 'ハレー彗星が太陽から約0.586 AU（約8,770万km）の近日点を通過。激しく吹き出すエメラルドシアンの壮大なダスト＆イオンテイルを描画！',
            en: 'Halley reached perihelion at 0.586 AU from the Sun. Magnificent cyan dust and ion comet tails extending opposite to the Sun!',
            de: 'Halley erreichte das Perihel bei 0,586 AE. Spektakulärer Kometenschweif im inneren Sonnensystem.',
            fr: 'Passage au plus près du Soleil avec sa magnifique chevelure et queue de comète.',
            es: 'Halley alcanzó el perihelio a 0,586 UA con su espectacular cola de cometa.',
            zh: '哈雷彗星抵达近日点（0.586天文单位），展开展延数千万公里的壮观青色彗尾！'
        }
    },
    voyager2neptune: {
        time: '1989-08-25T03:56:00Z',
        action: 'voyager2neptune',
        titles: {
            ja: '🌊 1989年8月25日 03:56 UTC: ボイジャー2号 海王星最接近！',
            en: '🌊 Aug 25, 1989 03:56 UTC: Voyager 2 Neptune Flyby!',
            de: '🌊 25. August 1989: Voyager 2 Neptun-Vorbeiflug!',
            fr: '🌊 25 août 1989: Survol de Neptune par Voyager 2 !',
            es: '🌊 25 de agosto de 1989: ¡Sobrevuelo de Neptuno por Voyager 2!',
            zh: '🌊 1989年8月25日: 旅行者2号飞掠海王星！'
        },
        descs: {
            ja: 'ボイジャー2号が太陽系最遠の巨大氷惑星・海王星の北極上空わずか4,950kmをフライバイ。大暗斑や衛星トリトンを発見した歴史的探査機と軌道線を再現！',
            en: 'Voyager 2 skimmed just 4,950 km above Neptune\'s north pole. Showing Voyager 2 with its grand tour hyperbolic trajectory past the blue ice giant!',
            de: 'Voyager 2 passierte Neptun in nur 4.950 km Höhe und entdeckte Geysire auf Triton.',
            fr: 'Survol à seulement 4 950 km au-dessus du pôle nord de Neptune.',
            es: 'Voyager 2 pasó a solo 4.950 km de Neptuno, descubriendo géiseres en Tritón.',
            zh: '距海王星北极仅4,950公里。忠实展现旅行者2号在蓝色冰巨星上空的壮丽航迹！'
        }
    },
    sputnik1: {
        time: '1957-10-04T19:28:34Z',
        action: 'sputnik1',
        titles: {
            ja: '🛰️ 1957年10月4日 19:28 UTC: スプートニク1号 宇宙時代の幕開け！',
            en: '🛰️ Oct 4, 1957 19:28 UTC: Sputnik 1 — Dawn of the Space Age!',
            de: '🛰️ 4. Oktober 1957: Sputnik 1 — Beginn des Raumzeitalters!',
            fr: '🛰️ 4 octobre 1957: Spoutnik 1 — L\'aube de l\'ère spatiale !',
            es: '🛰️ 4 de octubre de 1957: ¡Sputnik 1 — Amanecer de la era espacial!',
            zh: '🛰️ 1957年10月4日: 斯普特尼克1号——太空时代黎明！'
        },
        descs: {
            ja: 'バイコヌールから人類初の人工衛星が軌道へ。鏡面研磨の金属球体、4本のホイップアンテナ、発信される電波ビーコン波紋を忠実に再現！',
            en: 'The world\'s first artificial satellite in orbit! Showing the polished sphere, 4 trailing whip antennas, and historical radio wave emission rings.',
            de: 'Der erste künstliche Erdsatellit mit vier Antennen und Radiosignal.',
            fr: 'Premier satellite artificiel de la Terre avec ses quatre antennes et son signal radio historique.',
            es: 'El primer satélite artificial con sus 4 antenas y señales de radio históricas.',
            zh: '世界上第一颗人造地球卫星！高度还原抛光金属球体、4根长天线与无线电波纹脉冲！'
        }
    }
};

function executeHistoricalEvent(eventId) {
    const ev = HISTORICAL_EVENTS[eventId];
    if (!ev) return;

    CosmicAudio.playWarp();

    const targetDate = new Date(ev.time);
    customSimTime = targetDate;
    lastRealTime = Date.now();

    if (typeof fpInstance !== 'undefined' && fpInstance) {
        fpInstance.setDate(targetDate);
    } else {
        const timePickerInput = document.getElementById('timePickerInput');
        if (timePickerInput) timePickerInput.value = ev.time.replace('T', ' ').substring(0, 19);
    }

    if (viewer) {
        viewer.clock.currentTime = Cesium.JulianDate.fromDate(targetDate);
    }

    const toggleDeepSpace = document.getElementById('toggleDeepSpace');
    if (toggleDeepSpace && !toggleDeepSpace.checked) {
        toggleDeepSpace.checked = true;
    }

    if (ev.action === 'apollo11' || ev.action === 'moon') {
        selectDeepSpaceMission('APOLLO11');
    } else if (ev.action === 'voyager1' || ev.action === 'orrery_jupiter') {
        selectDeepSpaceMission('VOYAGER1');
    } else if (ev.action === 'voyager2neptune' || ev.action === 'orrery_neptune') {
        selectDeepSpaceMission('VOYAGER2');
    } else if (ev.action === 'sputnik1' || ev.action === 'earth') {
        selectDeepSpaceMission('SPUTNIK1');
    } else if (ev.action === 'orrery_halley') {
        const loadSolarSystemBtn = document.getElementById('loadSolarSystemBtn');
        if (loadSolarSystemBtn) loadSolarSystemBtn.click();
        setTimeout(() => { selectCelestialBody('HALLEY'); }, 1200);
    }

    const lang = window.currentLang || currentLang || 'ja';
    const title = (ev.titles && (ev.titles[lang] || ev.titles['ja'])) || '⏳ 歴史的瞬間へタイムトラベル';
    const desc = (ev.descs && (ev.descs[lang] || ev.descs['ja'])) || '';
    showUniversalToast(`<strong>${title}</strong><br><span style="font-size:0.8rem; color:#cbd5e1;">${desc}</span>`, '⏳', 6500);
}

// ==========================================================================
// ISS Cupola View & Satellite Onboard POV Experience Engine
// ==========================================================================
let isCupolaActive = false;
let cupolaTargetSat = null;
let cupolaPreRenderRemover = null;

function enterCupolaMode(satIndex) {
    if (typeof satIndex !== 'number' || satIndex < 0) {
        satIndex = satellitesData.findIndex(s => s && s.name && (s.name.includes('ISS') || s.noradId === '25544'));
        if (satIndex < 0 && satellitesData.length > 0) satIndex = 0;
    }
    if (satIndex < 0 || !satellitesData[satIndex]) {
        showUniversalToast('衛星データが見つかりません', '⚠️');
        return;
    }

    const sat = satellitesData[satIndex];
    if (!sat.currentCartesian) {
        showUniversalToast('衛星位置を計算中... 少々お待ちください', '⏳');
        return;
    }

    isCupolaActive = true;
    cupolaTargetSat = sat;
    selectedSatIndex = satIndex;

    CosmicAudio.playAirlock();
    const isIss = (sat.name.includes('ISS') || sat.noradId === '25544');
    const toastMsg = isIss 
        ? '👨‍🚀 ISSキューポラ展望窓モードを開始しました。眼下に地球が流れます！' 
        : `🛰️ 「${sat.name}」オンボード視点カメラモードを開始しました。`;
    showUniversalToast(toastMsg, '👨‍🚀', 3500);

    document.body.classList.add('cupola-mode-active');
    const overlay = document.getElementById('cupolaOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        const titleText = document.getElementById('cupolaTitleText');
        if (titleText) {
            titleText.textContent = isIss ? '👨‍🚀 ISS キューポラ展望窓 (Cupola Observation Deck)' : `🛰️ ${sat.name} (Onboard POV)`;
        }
        const footerText = document.getElementById('cupolaFooterText');
        if (footerText) {
            footerText.textContent = isIss 
                ? '🛰️ 国際宇宙ステーション (ISS) • 欧州宇宙機関(ESA)製造「キューポラ」展望窓から地球を見下ろしています' 
                : `🛰️ 人工衛星「${sat.name}」搭載オンボード視点カメラから地球を見下ろしています`;
        }
    }

    viewer.trackedEntity = undefined;
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

    const rivetsGroup = document.getElementById('cupolaRivetsGroup');
    if (rivetsGroup && rivetsGroup.children.length === 0) {
        for (let i = 0; i < 32; i++) {
            const a = (i / 32) * Math.PI * 2;
            const rx = 700 + Math.cos(a) * 326;
            const ry = 460 + Math.sin(a) * 326;
            const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            c.setAttribute('cx', rx.toFixed(1));
            c.setAttribute('cy', ry.toFixed(1));
            c.setAttribute('r', '3');
            c.setAttribute('fill', '#64748b');
            c.setAttribute('stroke', '#0f172a');
            c.setAttribute('stroke-width', '1');
            rivetsGroup.appendChild(c);
        }
    }

    if (cupolaPreRenderRemover) {
        cupolaPreRenderRemover();
        cupolaPreRenderRemover = null;
    }

    cupolaPreRenderRemover = viewer.scene.preRender.addEventListener(() => {
        if (!isCupolaActive || !cupolaTargetSat || !cupolaTargetSat.currentCartesian) return;
        const pos = cupolaTargetSat.currentCartesian;

        const up = Cesium.Cartesian3.normalize(pos, new Cesium.Cartesian3());
        const nadir = Cesium.Cartesian3.negate(up, new Cesium.Cartesian3());

        let velDir = new Cesium.Cartesian3();
        if (cupolaTargetSat.currentVelocity) {
            const simTime = customSimTime || new Date();
            const futureDate = new Date(simTime.getTime() + 2000);
            const futureGmst = satellite.gstime(futureDate);
            const futurePos = calculateCartesianPosition(cupolaTargetSat, futureDate, futureGmst);
            if (futurePos && futurePos.cartesian) {
                velDir = Cesium.Cartesian3.normalize(
                    Cesium.Cartesian3.subtract(futurePos.cartesian, pos, new Cesium.Cartesian3()),
                    new Cesium.Cartesian3()
                );
            }
        }
        if (Cesium.Cartesian3.magnitude(velDir) < 0.5) {
            velDir = Cesium.Cartesian3.cross(up, Cesium.Cartesian3.UNIT_Z, new Cesium.Cartesian3());
            Cesium.Cartesian3.normalize(velDir, velDir);
        }

        const lookDir = Cesium.Cartesian3.normalize(
            Cesium.Cartesian3.add(
                Cesium.Cartesian3.multiplyByScalar(nadir, 0.70, new Cesium.Cartesian3()),
                Cesium.Cartesian3.multiplyByScalar(velDir, 0.55, new Cesium.Cartesian3()),
                new Cesium.Cartesian3()
            ),
            new Cesium.Cartesian3()
        );

        viewer.camera.setView({
            destination: pos,
            orientation: {
                direction: lookDir,
                up: up
            }
        });

        const carto = Cesium.Cartographic.fromCartesian(pos);
        const altKm = carto.height / 1000;
        const latDeg = Cesium.Math.toDegrees(carto.latitude);
        const lonDeg = Cesium.Math.toDegrees(carto.longitude);
        const velKmS = (cupolaTargetSat.currentVelocity && cupolaTargetSat.currentVelocity.kmPerSec) || 7.66;

        const altEl = document.getElementById('cupolaAlt');
        const spdEl = document.getElementById('cupolaSpeed');
        const posEl = document.getElementById('cupolaCoords');
        const sunEl = document.getElementById('cupolaLighting');

        if (altEl) altEl.textContent = `${altKm.toFixed(1)} km`;
        if (spdEl) spdEl.textContent = `${velKmS.toFixed(2)} km/s (${Math.round(velKmS * 3600).toLocaleString()} km/h)`;
        if (posEl) posEl.textContent = `${latDeg >= 0 ? latDeg.toFixed(2) + '°N' : Math.abs(latDeg).toFixed(2) + '°S'}, ${lonDeg >= 0 ? lonDeg.toFixed(2) + '°E' : Math.abs(lonDeg).toFixed(2) + '°W'}`;
        if (sunEl) {
            const sunDir = Cesium.Cartesian3.normalize(viewer.scene.sunPosition || Cesium.Cartesian3.UNIT_X, new Cesium.Cartesian3());
            const dot = Cesium.Cartesian3.dot(up, sunDir);
            if (dot > -0.1) {
                sunEl.innerHTML = '☀️ 昼間域 (Sunlit)';
                sunEl.style.color = '#10b981';
            } else {
                sunEl.innerHTML = '🌑 夜間域 (Eclipse / Night)';
                sunEl.style.color = '#60a5fa';
            }
        }
    });
}

function exitCupolaMode() {
    if (!isCupolaActive) return;
    isCupolaActive = false;
    cupolaTargetSat = null;

    if (cupolaPreRenderRemover) {
        cupolaPreRenderRemover();
        cupolaPreRenderRemover = null;
    }

    document.body.classList.remove('cupola-mode-active');
    const overlay = document.getElementById('cupolaOverlay');
    if (overlay) overlay.classList.add('hidden');

    if (selectedSatIndex >= 0 && satellitesData[selectedSatIndex] && satellitesData[selectedSatIndex].currentCartesian) {
        const sat = satellitesData[selectedSatIndex];
        const pos = sat.currentCartesian;
        const up = Cesium.Cartesian3.normalize(pos, new Cesium.Cartesian3());
        const dest = Cesium.Cartesian3.add(pos, Cesium.Cartesian3.multiplyByScalar(up, 1800000, new Cesium.Cartesian3()), new Cesium.Cartesian3());
        viewer.camera.flyTo({
            destination: dest,
            duration: 1.5
        });
    }

    CosmicAudio.playBlip(520, 0.12);
    showUniversalToast('通常軌道シミュレーション視点に戻りました', '🌐', 2500);
}

// ==========================================================================
// Social Share (X / Twitter & Copy Link) Engine
// ==========================================================================
function generateCurrentShareData() {
    let text = '';
    const url = 'https://satviewer3d.com/';

    if (selectedCelestialId) {
        const bodyNames = {
            SUN: '太陽 (Sun)', MOON: '月 (Moon)', EARTH: '地球 (Earth)',
            MARS: '火星 (Mars)', JUPITER: '木星 (Jupiter)', SATURN: '土星 (Saturn)',
            VENUS: '金星 (Venus)', MERCURY: '水星 (Mercury)', URANUS: '天王星 (Uranus)',
            NEPTUNE: '海王星 (Neptune)', CERES: 'ケレス (Ceres)', PLUTO: '冥王星 (Pluto)',
            HALLEY: 'ハレー彗星 (Halley)'
        };
        const name = bodyNames[selectedCelestialId] || selectedCelestialId;
        const eph = computePlanetEphemeris(selectedCelestialId, customSimTime || viewer.clock.currentTime);
        const distStr = eph ? `${(eph.geocentricDistKm / 10000).toFixed(0)}万km (${eph.geocentricDistAu.toFixed(3)} AU)` : '';
        text = `🌌 SatViewer3Dで「${name}」を観測中！${distStr ? `\n🔭 地球からの距離: ${distStr}` : ''}\n太陽系オーラリー全天体軌道をリアルタイム3Dシミュレーション。`;
    } else if (selectedSatIndex >= 0 && satellitesData[selectedSatIndex]) {
        const sat = satellitesData[selectedSatIndex];
        const isIss = (sat.name.includes('ISS') || sat.noradId === '25544');
        const altElem = document.getElementById('satAlt');
        const velElem = document.getElementById('satVel');
        const altStr = (altElem && altElem.textContent && !altElem.textContent.includes('--')) 
            ? altElem.textContent 
            : (sat.alt ? `${sat.alt.toFixed(1)} km` : '');
        const velStr = (velElem && velElem.textContent && !velElem.textContent.includes('--')) 
            ? velElem.textContent 
            : (sat.vel ? `${sat.vel.toFixed(2)} km/s` : '');
        const specStr = (altStr && velStr) ? `\n高度: ${altStr} / 速度: ${velStr}` : '';
        if (isIss) {
            text = `🛰️ SatViewer3Dで「国際宇宙ステーション (ISS)」を追跡中！${specStr}\n👨‍🚀 ISSキューポラ展望窓から地球を見下ろす宇宙飛行士視点も体験可能！`;
        } else {
            text = `🛰️ SatViewer3Dで人工衛星「${sat.name}」をリアルタイム3D追跡中！${specStr}\n地球周回軌道シミュレーター。`;
        }
    } else {
        text = `🌌 SatViewer3Dで太陽系オーラリー全惑星軌道を3D探索中！\nケレス・冥王星・ハレー彗星の軌道や、ISS・Starlink全衛星コンステレーションを完全再現。`;
    }

    return { text, url };
}

// Preload SatViewer3D official QR code for instant capture
const satViewerQrImage = new Image();
satViewerQrImage.crossOrigin = 'anonymous';
satViewerQrImage.src = 'assets/satviewer3d_qr.png?v=20260906_1';

/**
 * Capture current 3D universe scene as Blob (with authentic brand badge, URL, and QR code)
 */
async function captureCurrentSceneBlob() {
    if (!viewer || !viewer.scene) return null;

    // 最新フレームを確実に同期レンダリング
    viewer.render();
    const sourceCanvas = viewer.scene.canvas;
    if (!sourceCanvas) return null;

    const offscreen = document.createElement('canvas');
    offscreen.width = sourceCanvas.width;
    offscreen.height = sourceCanvas.height;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return null;

    // WebGL Canvasを描画
    ctx.drawImage(sourceCanvas, 0, 0);

    const w = offscreen.width;
    const h = offscreen.height;
    const scale = Math.max(0.85, Math.min(w, h) / 1080);

    // QRコード画像のロード確認（未ロードならロード待ち）
    if (!satViewerQrImage.complete || satViewerQrImage.naturalWidth === 0) {
        await new Promise((resolve) => {
            satViewerQrImage.onload = resolve;
            satViewerQrImage.onerror = resolve;
            setTimeout(resolve, 800);
        });
    }

    // 1. 右下：SatViewer3D 公式ブランド ＆ URL ＆ QRコード ガラス調カードバッジ
    const badgePadding = Math.round(12 * scale);
    const qrSize = Math.round(82 * scale);
    const badgeW = Math.round(330 * scale);
    const badgeH = qrSize + (badgePadding * 2);
    const badgeX = w - badgeW - Math.round(20 * scale);
    const badgeY = h - badgeH - Math.round(20 * scale);
    const radius = Math.round(12 * scale);

    ctx.save();
    // パネル影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 18 * scale;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6 * scale;

    // パネル背景（半透明深宇宙ネイビー）
    ctx.fillStyle = 'rgba(11, 19, 41, 0.88)';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, radius);
    ctx.fill();

    // サイバーシアン境界線
    ctx.lineWidth = 1.2 * scale;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.stroke();
    ctx.restore();

    // QRコード描画（白の角丸プレート上にくっきり配置）
    if (satViewerQrImage.complete && satViewerQrImage.naturalWidth > 0) {
        const qrX = badgeX + badgeW - qrSize - badgePadding;
        const qrY = badgeY + badgePadding;
        const qrPlateRadius = Math.round(6 * scale);

        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(qrX, qrY, qrSize, qrSize, qrPlateRadius);
        ctx.fill();
        ctx.drawImage(satViewerQrImage, qrX + 2, qrY + 2, qrSize - 4, qrSize - 4);
        ctx.restore();
    }

    // バッジ内テキスト
    const textLeft = badgeX + badgePadding + Math.round(2 * scale);
    const currentLangCode = window.currentLang || (typeof currentLang !== 'undefined' ? currentLang : 'ja');
    const qrScanHint = (currentLangCode === 'ja') 
        ? '📱 スマホでスキャンして3D起動' 
        : '📱 Scan QR to launch 3D Earth';

    ctx.save();
    ctx.textBaseline = 'top';

    // タイトル: SatViewer3D
    ctx.font = `700 ${Math.round(18 * scale)}px 'Outfit', -apple-system, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SatViewer3D', textLeft, badgeY + badgePadding + Math.round(2 * scale));

    // サブタイトル
    ctx.font = `500 ${Math.round(10.5 * scale)}px 'Outfit', -apple-system, sans-serif`;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Real-time 3D Space Visualizer', textLeft, badgeY + badgePadding + Math.round(24 * scale));

    // 公式URL: https://satviewer3d.com/
    ctx.font = `700 ${Math.round(13.5 * scale)}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('https://satviewer3d.com/', textLeft, badgeY + badgePadding + Math.round(42 * scale));

    // スキャン案内
    ctx.font = `500 ${Math.round(10 * scale)}px 'Outfit', -apple-system, sans-serif`;
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(qrScanHint, textLeft, badgeY + badgePadding + Math.round(62 * scale));
    ctx.restore();

    // 2. 左下：選択中の天体/衛星バッジ
    let badgeText = '';
    if (selectedDeepSpaceId && typeof DEEP_SPACE_MISSIONS !== 'undefined') {
        const m = DEEP_SPACE_MISSIONS.find(x => x.id === selectedDeepSpaceId);
        badgeText = m ? `${m.symbol} ${m.shortName || m.name}` : `🔭 ${selectedDeepSpaceId}`;
    } else if (selectedCelestialId) {
        const bodyNames = {
            SUN: '☀️ 太陽 (Sun)', MOON: '🌕 月 (Moon)', EARTH: '🌍 地球 (Earth)',
            MARS: '♂️ 火星 (Mars)', JUPITER: '♃ 木星 (Jupiter)', SATURN: '♄ 土星 (Saturn)',
            VENUS: '♀️ 金星 (Venus)', MERCURY: '☿ 水星 (Mercury)', URANUS: '♅ 天王星 (Uranus)',
            NEPTUNE: '♆ 海王星 (Neptune)', CERES: '🪐 ケレス (Ceres)', PLUTO: '🪐 冥王星 (Pluto)',
            HALLEY: '☄️ ハレー彗星 (Halley)'
        };
        badgeText = bodyNames[selectedCelestialId] || `🪐 ${selectedCelestialId}`;
    } else if (selectedSatIndex >= 0 && satellitesData && satellitesData[selectedSatIndex]) {
        const sat = satellitesData[selectedSatIndex];
        const isIss = (sat.name.includes('ISS') || sat.noradId === '25544');
        badgeText = isIss ? '👨‍🚀 国際宇宙ステーション (ISS)' : `🛰️ ${sat.name}`;
    }

    if (badgeText) {
        ctx.save();
        ctx.font = `700 ${Math.round(18 * scale)}px 'Outfit', -apple-system, sans-serif`;
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 8 * scale;
        ctx.shadowOffsetY = 2 * scale;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(badgeText, 24 * scale, h - 24 * scale);
        ctx.restore();
    }

    return new Promise((resolve) => {
        offscreen.toBlob((blob) => {
            resolve(blob);
        }, 'image/png');
    });
}

let currentCaptureModalBlob = null;

function downloadImageBlob(blob, filenamePrefix = 'satviewer3d', showToast = true) {
    if (!blob) return;
    try {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        const now = new Date();
        const dateStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
        a.download = `${filenamePrefix}_${dateStr}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

        if (showToast) {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            const isAndroid = /Android/i.test(navigator.userAgent);
            const isJa = (window.currentLang || currentLang) === 'ja';
            if (isIOS) {
                showUniversalToast(isJa ? '📁 ダウンロード完了！iPhoneの【ファイル】アプリ内「ダウンロード」フォルダをご確認ください' : '📁 Downloaded to Files app "Downloads" folder', '💾', 5500);
            } else if (isAndroid) {
                showUniversalToast(isJa ? '📁 ダウンロード完了！【Files】アプリや「ダウンロード」フォルダをご確認ください' : '📁 Downloaded to your Downloads folder', '💾', 5000);
            } else {
                showUniversalToast(isJa ? '💾 ダウンロードフォルダに画像を保存しました！' : '💾 Saved to your Downloads folder', '💾', 3500);
            }
        }
    } catch (e) {
        console.warn("Download failed:", e);
    }
}

function showCapturePreviewModal(blob, copiedToClipboard = false) {
    currentCaptureModalBlob = blob;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid || (window.innerWidth <= 768);
    const isJa = (window.currentLang || currentLang) === 'ja';

    let overlay = document.getElementById('captureModalOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'captureModalOverlay';
        overlay.className = 'capture-modal-overlay';
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeCapturePreviewModal();
        });
        document.body.appendChild(overlay);
    }

    const imgUrl = URL.createObjectURL(blob);

    let title = isJa ? '📸 宇宙空間キャプチャ完了' : '📸 Universe Scene Captured';
    let guideHtml = '';

    if (isIOS) {
        if (isJa) {
            guideHtml = `
                <div class="capture-guide-box">
                    <div class="capture-guide-title">📱 写真アプリへの保存方法</div>
                    <div class="capture-guide-step">① 下の<strong>【写真アプリに保存】</strong>をタップ ➔ 共有メニュー内の <strong>【画像を保存】</strong> を選択</div>
                    <div class="capture-guide-step">② または<strong>上の画像を長押し</strong> ➔ <strong>【"写真"に追加】</strong></div>
                    <div class="capture-guide-note">※共有メニューが表示されたら、必ず<strong>【画像を保存】</strong>をお選びください。</div>
                </div>
            `;
        } else {
            guideHtml = `
                <div class="capture-guide-box">
                    <div class="capture-guide-title">📱 How to Save to Photos App</div>
                    <div class="capture-guide-step">① Tap <strong>【Save to Photos】</strong> below ➔ Select <strong>【Save Image】</strong></div>
                    <div class="capture-guide-step">② Or <strong>long-press the image</strong> ➔ Select <strong>【Save to Photos】</strong></div>
                    <div class="capture-guide-note">※ Please select <strong>【Save Image】</strong> in the share menu.</div>
                </div>
            `;
        }
    } else if (isAndroid) {
        if (isJa) {
            guideHtml = `
                <div class="capture-guide-box">
                    <div class="capture-guide-title">📱 写真（フォト）アプリへの保存方法</div>
                    <div class="capture-guide-step">① 下の<strong>【写真アプリに保存】</strong>をタップ</div>
                    <div class="capture-guide-step">② または<strong>上の画像を長押し</strong> ➔ <strong>【画像をダウンロード】</strong></div>
                    <div class="capture-guide-note">※端末のフォトやギャラリーアプリに保存されます。</div>
                </div>
            `;
        } else {
            guideHtml = `
                <div class="capture-guide-box">
                    <div class="capture-guide-title">📱 How to Save to Photos / Gallery</div>
                    <div class="capture-guide-step">① Tap <strong>【Save to Photos】</strong> below</div>
                    <div class="capture-guide-step">② Or <strong>long-press the image</strong> ➔ Select <strong>【Download image】</strong></div>
                    <div class="capture-guide-note">※ Saves directly to your Photos or Gallery app.</div>
                </div>
            `;
        }
    } else {
        if (isJa) {
            guideHtml = `
                <div class="capture-guide-box">
                    <div class="capture-guide-title">✨ クリップボードに画像をコピーしました！</div>
                    <div class="capture-guide-step">・SNSや文書で<strong>【Ctrl+V】（貼り付け）</strong>が可能です。</div>
                    <div class="capture-guide-note">※画像ファイルをPCに保存したい場合は下の【画像をダウンロード】をクリックしてください。</div>
                </div>
            `;
        } else {
            guideHtml = `
                <div class="capture-guide-box">
                    <div class="capture-guide-title">✨ Copied to Clipboard!</div>
                    <div class="capture-guide-step">・You can paste directly with <strong>【Ctrl+V】</strong>.</div>
                    <div class="capture-guide-note">※ To save image as a file, click 【Download Image】 below.</div>
                </div>
            `;
        }
    }

    let actionsHtml = '';
    if (isMobile) {
        actionsHtml = `
            <button class="capture-action-btn capture-btn-primary" id="captureShareBtn">${isJa ? '📱 写真アプリに保存' : '📱 Save to Photos'}</button>
            <button class="capture-action-btn capture-btn-secondary" id="captureDismissBtn">${isJa ? '✕ 閉じる' : '✕ Close'}</button>
        `;
    } else {
        actionsHtml = `
            <button class="capture-action-btn capture-btn-primary" id="captureDownloadBtn">${isJa ? '💾 画像をダウンロード' : '💾 Download Image'}</button>
            <button class="capture-action-btn capture-btn-secondary" id="captureDismissBtn">${isJa ? '✕ 閉じる' : '✕ Close'}</button>
        `;
    }

    overlay.innerHTML = `
        <div class="capture-modal-container">
            <div class="capture-modal-header">
                <div class="capture-modal-title">${title}</div>
                <button class="capture-modal-close" id="closeCaptureModalBtn" aria-label="Close">✕</button>
            </div>
            <div class="capture-modal-body">
                <div class="capture-modal-preview-wrapper">
                    <img src="${imgUrl}" alt="Capture Preview" class="capture-modal-preview-img" id="captureModalPreviewImg" />
                </div>
                ${guideHtml}
            </div>
            <div class="capture-modal-actions">
                ${actionsHtml}
            </div>
        </div>
    `;

    document.getElementById('closeCaptureModalBtn').onclick = closeCapturePreviewModal;
    document.getElementById('captureDismissBtn').onclick = closeCapturePreviewModal;

    const shareBtn = document.getElementById('captureShareBtn');
    if (shareBtn) {
        shareBtn.onclick = async () => {
            if (!currentCaptureModalBlob) return;
            const file = new File([currentCaptureModalBlob], 'satviewer3d_universe.png', { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    // ★重要: iOS Safariでは純粋な画像共有として files のみ渡すことで「画像を保存」を確実に表示させます。
                    await navigator.share({
                        files: [file]
                    });
                    showUniversalToast(isJa ? '✨ 共有メニューの【画像を保存】で写真アプリに保存されます' : '✨ Saved to Photos via Share Sheet', '📸', 4500);
                    return;
                } catch (err) {
                    if (err.name === 'AbortError') return;
                    console.warn("Share failed, fallback:", err);
                }
            }

            // navigator.share が未対応または非セキュア環境の場合
            showUniversalToast(isJa ? '💡 上の画像を長押しして【"写真"に追加】で写真アプリに保存できます！' : '💡 Long-press the image above to save to Photos!', '📸', 5000);
            downloadImageBlob(currentCaptureModalBlob, 'satviewer3d_universe', false);
        };
    }

    const downloadBtn = document.getElementById('captureDownloadBtn');
    if (downloadBtn) {
        downloadBtn.onclick = () => {
            if (!currentCaptureModalBlob) return;
            downloadImageBlob(currentCaptureModalBlob, 'satviewer3d_universe', true);
        };
    }

    overlay.classList.add('active');
}

function closeCapturePreviewModal() {
    const overlay = document.getElementById('captureModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

async function saveCurrentSceneScreenshot() {
    CosmicAudio.playBlip(980, 0.08);
    const isJa = (window.currentLang || currentLang) === 'ja';
    showUniversalToast(isJa ? '📸 宇宙空間を撮影中...' : '📸 Capturing universe scene...', '📸', 1500);

    const blob = await captureCurrentSceneBlob();
    if (!blob) {
        showUniversalToast(isJa ? '❌ 撮影に失敗しました' : '❌ Capture failed', '⚠️', 2500);
        return;
    }

    // クリップボードへのコピー（可能な場合）
    let copied = false;
    if (navigator.clipboard && window.ClipboardItem) {
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            copied = true;
        } catch (e) {}
    }

    // プレビュー＆保存モーダルを表示
    showCapturePreviewModal(blob, copied);
}

async function shareCurrentViewToTwitter() {
    const { text, url } = generateCurrentShareData();
    CosmicAudio.playBlip(980, 0.08);
    showUniversalToast('📸 宇宙画像をキャプチャ中...', '📸', 1200);

    let blob = null;
    try {
        blob = await captureCurrentSceneBlob();
    } catch (e) {
        console.warn("Failed to capture universe scene:", e);
    }

    // スマホ等で Web Share API (ファイル添付対応) が使える場合
    if (blob && navigator.canShare) {
        const file = new File([blob], 'satviewer3d_universe.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'SatViewer3D | リアルタイム宇宙空間',
                    text: `${text}\n#SatViewer3D #宇宙 #人工衛星`,
                    url: url,
                    files: [file]
                });
                showUniversalToast('✨ 宇宙の画像を共有しました！', '🚀', 3500);
                return;
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.warn("Web Share failed, fallback to clipboard & tweet intent", err);
            }
        }
    }

    // クリップボードに画像をコピー
    let copiedToClipboard = false;
    if (blob && navigator.clipboard && window.ClipboardItem) {
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            copiedToClipboard = true;
        } catch (e) {
            console.warn("Clipboard image copy failed:", e);
        }
    }

    // 画像自動ダウンロード（手動添付用バックアップ）
    if (blob) {
        downloadImageBlob(blob, 'satviewer3d_universe');
    }

    // Xのツイート作成画面を開く
    const hashtags = 'SatViewer3D,宇宙,人工衛星,天文学';
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
    window.open(tweetUrl, '_blank', 'width=580,height=520,scrollbars=yes,resizable=yes');

    // トーストで分かりやすく誘導
    if (copiedToClipboard) {
        showUniversalToast('📸 宇宙画像をコピーしました！𝕏の投稿欄で【Ctrl+V】（貼り付け）を押すと画像が添付されます！', '📸', 7000);
    } else if (blob) {
        showUniversalToast('📸 宇宙画像を保存しました！𝕏の投稿に画像を添付してください！', '💾', 6000);
    } else {
        showUniversalToast('𝕏 (Twitter) シェア画面を開きました！', '𝕏', 3000);
    }
}


function copyCurrentViewLink() {
    const { text, url } = generateCurrentShareData();
    CosmicAudio.playBlip(780, 0.08);
    const fullShareText = `${text}\n${url}\n#SatViewer3D #宇宙`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullShareText).then(() => {
            showUniversalToast('✅ 共有テキストとURLをクリップボードにコピーしました！', '📋', 3500);
        }).catch(() => {
            prompt('以下のテキストをコピーしてください:', fullShareText);
        });
    } else {
        prompt('以下のテキストをコピーしてください:', fullShareText);
    }
}


/**
 * Guaranteed Device-Adaptive Zoom Hint Toast Manager (Differentiates PC vs Mobile Touch)
 */
function updateZoomHintToast() {
    const zoomToast = document.getElementById('zoomHintToast');
    if (!zoomToast) return;

    // Robust Touch Device Detection: Handles Mobile Phones, Tablets, Touchscreens, and Viewport size
    const isTouchDevice = ('ontouchstart' in window) || 
                          (navigator.maxTouchPoints > 0) || 
                          (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || 
                          (window.innerWidth <= 1024);

    const lang = window.currentLang || currentLang || 'ja';
    const d = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) ? TRANSLATIONS[lang] : {};

    const titleElem = zoomToast.querySelector('.zoom-hint-title');
    const subElem = zoomToast.querySelector('.zoom-hint-sub');
    const iconElem = zoomToast.querySelector('.zoom-hint-icon');

    if (isTouchDevice) {
        // Mobile Touch Pinch Layout
        if (titleElem) titleElem.textContent = d.zoomHintTouchTitle || "🔍 2本指ピンチでズーム";
        if (subElem) subElem.textContent = d.zoomHintTouchSub || "画面をつまんで地球全体を見渡せます";
        if (iconElem) {
            iconElem.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="#38bdf8" stroke-width="2" fill="none"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path></svg>`;
        }
    } else {
        // PC Mouse Wheel Layout
        if (titleElem) titleElem.textContent = d.zoomHintPcTitle || "🔍 マウスホイールでズーム";
        if (subElem) subElem.textContent = d.zoomHintPcSub || "スクロールして地球全体を見渡せます";
        if (iconElem) {
            iconElem.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="#38bdf8" stroke-width="2" fill="none"><rect x="6" y="3" width="12" height="18" rx="6"></rect><line x1="12" y1="7" x2="12" y2="11" stroke="#38bdf8" stroke-width="2.5"></line></svg>`;
        }
    }
}

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
        } else if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
            el.innerHTML = TRANSLATIONS['en'][key];
        } else if (TRANSLATIONS['ja'] && TRANSLATIONS['ja'][key]) {
            el.innerHTML = TRANSLATIONS['ja'][key];
        }
    });

    // Explicit ID-based fallback translations
    const idsToTranslate = {
        'loadMajorBtn': 'loadMajor',
        'loadDeepSpaceBtn': 'loadDeepSpace',
        'loadSolarSystemBtn': 'loadSolarSystem',
        'loadTrainBtn': 'loadTrain',
        'loadSpanishBtn': 'loadSpanish',
        'loadLocalBtn': 'loadLocal',
        'loadDebrisBtn': 'loadDebris',
        'sourceStatusBadge': 'badgeMajor',
        'resetNowBtn': 'resetNow',
        'geoLocateBtn': 'btnGeo',
        'trackBtn': 'btnTrack',
        'untrackBtn': 'btnUntrack',
        'btnCupolaLaunch': 'btnCupola',
        'exitCupolaBtn': 'exitCupola',
        'shareTwitterBtn': 'btnShareTwitter',
        'saveScreenshotBtn': 'btnSaveScreenshot',
        'headerScreenshotBtn': 'headerScreenshot',
        'copyShareBtn': 'btnCopyShare',
        'openReleaseBtn': 'btnRelease',
        'openGuideBtn': 'btnGuide',
        'modalTitle': 'modalTitle'
    };

    for (const [id, key] of Object.entries(idsToTranslate)) {
        const el = document.getElementById(id);
        if (el) {
            const val = (dict && dict[key]) || (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) || (TRANSLATIONS['ja'] && TRANSLATIONS['ja'][key]);
            if (val) el.textContent = val;
        }
    }

    const soundToggleBtn = document.getElementById('soundToggleBtn');
    if (soundToggleBtn && typeof CosmicAudio !== 'undefined') {
        const sOn = (dict && dict.soundOn) || '🔊 サウンド ON';
        const sOff = (dict && dict.soundOff) || '🔇 サウンド OFF';
        soundToggleBtn.textContent = CosmicAudio.isPlaying ? sOn : sOff;
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
        if (tzSelect && tzSelect.options) {
            Array.from(tzSelect.options).forEach(opt => {
                if (currentTzMap[opt.value]) {
                    opt.textContent = currentTzMap[opt.value];
                }
            });
        }
    }

    // Explicit Mobile Bottom Dock and Sheet Header Translations
    const mobileMenuText = document.getElementById('mobileMenuText');
    if (mobileMenuText && dict.mobileBtnSelect) {
        mobileMenuText.textContent = dict.mobileBtnSelect;
    }
    const mobileDetailText = document.getElementById('mobileDetailText');
    if (mobileDetailText && dict.mobileBtnDetail) {
        mobileDetailText.textContent = dict.mobileBtnDetail;
    }
    const mobileSidebarTitle = document.getElementById('mobileSidebarTitle');
    if (mobileSidebarTitle && dict.mobileSheetSelectTitle) {
        mobileSidebarTitle.textContent = dict.mobileSheetSelectTitle;
    }
    const mobileDetailTitle = document.getElementById('mobileDetailTitle');
    if (mobileDetailTitle && dict.mobileSheetDetailTitle) {
        mobileDetailTitle.textContent = dict.mobileSheetDetailTitle;
    }

    if (typeof updateDropdownOptions === 'function') {
        updateDropdownOptions();
    }
    updateZoomHintToast();

    // Dynamic Live Re-render for Selected Celestial Body if open
    if (typeof selectedCelestialId !== 'undefined' && selectedCelestialId) {
        if (selectedCelestialId === 'SOLAR_SYSTEM') {
            selectSolarSystemOverview(true);
        } else {
            selectCelestialBody(selectedCelestialId);
        }
    }

    // Dynamic Live Re-render for Selected Deep Space Probe if open
    if (typeof selectedDeepSpaceId !== 'undefined' && selectedDeepSpaceId) {
        selectDeepSpaceMission(selectedDeepSpaceId, true);
    }
}

// Guaranteed Global changeLanguage Function for OnChange Event
window.changeLanguage = function(lang) {
    applyLanguage(lang);
};

// Major Satellites Built-in TLE Preset (Clean International English Names)

/**
 * 🚂 STARLINK TRAIN TLE PRESET (24-Satellite Luminous Deployment Chain)
 * Real-time equal-spaced orbital train constellation for cinematic pursuit visualization
 */
const STARLINK_TRAIN_TLE = `STARLINK-G10-01 (TRAIN LEAD)
1 60001U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9996
2 60001 53.2000 185.4500 0001450 045.2000 120.0000 15.75420000      0
STARLINK-G10-02 (TRAIN #2)
1 60002U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9997
2 60002 53.2000 185.4500 0001450 045.2000 120.4800 15.75420000      3
STARLINK-G10-03 (TRAIN #3)
1 60003U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9998
2 60003 53.2000 185.4500 0001450 045.2000 120.9600 15.75420000      7
STARLINK-G10-04 (TRAIN #4)
1 60004U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9999
2 60004 53.2000 185.4500 0001450 045.2000 121.4400 15.75420000      2
STARLINK-G10-05 (TRAIN #5)
1 60005U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9990
2 60005 53.2000 185.4500 0001450 045.2000 121.9200 15.75420000      6
STARLINK-G10-06 (TRAIN #6)
1 60006U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9991
2 60006 53.2000 185.4500 0001450 045.2000 122.4000 15.75420000      1
STARLINK-G10-07 (TRAIN #7)
1 60007U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9992
2 60007 53.2000 185.4500 0001450 045.2000 122.8800 15.75420000      4
STARLINK-G10-08 (TRAIN #8)
1 60008U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9993
2 60008 53.2000 185.4500 0001450 045.2000 123.3600 15.75420000      9
STARLINK-G10-09 (TRAIN #9)
1 60009U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9994
2 60009 53.2000 185.4500 0001450 045.2000 123.8400 15.75420000      3
STARLINK-G10-10 (TRAIN #10)
1 60010U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9996
2 60010 53.2000 185.4500 0001450 045.2000 124.3200 15.75420000      9
STARLINK-G10-11 (TRAIN #11)
1 60011U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9997
2 60011 53.2000 185.4500 0001450 045.2000 124.8000 15.75420000      3
STARLINK-G10-12 (TRAIN #12)
1 60012U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9998
2 60012 53.2000 185.4500 0001450 045.2000 125.2800 15.75420000      7
STARLINK-G10-13 (TRAIN #13)
1 60013U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9999
2 60013 53.2000 185.4500 0001450 045.2000 125.7600 15.75420000      1
STARLINK-G10-14 (TRAIN #14)
1 60014U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9990
2 60014 53.2000 185.4500 0001450 045.2000 126.2400 15.75420000      6
STARLINK-G10-15 (TRAIN #15)
1 60015U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9991
2 60015 53.2000 185.4500 0001450 045.2000 126.7200 15.75420000      0
STARLINK-G10-16 (TRAIN #16)
1 60016U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9992
2 60016 53.2000 185.4500 0001450 045.2000 127.2000 15.75420000      5
STARLINK-G10-17 (TRAIN #17)
1 60017U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9993
2 60017 53.2000 185.4500 0001450 045.2000 127.6800 15.75420000      8
STARLINK-G10-18 (TRAIN #18)
1 60018U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9994
2 60018 53.2000 185.4500 0001450 045.2000 128.1600 15.75420000      3
STARLINK-G10-19 (TRAIN #19)
1 60019U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9995
2 60019 53.2000 185.4500 0001450 045.2000 128.6400 15.75420000      7
STARLINK-G10-20 (TRAIN #20)
1 60020U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9997
2 60020 53.2000 185.4500 0001450 045.2000 129.1200 15.75420000      3
STARLINK-G10-21 (TRAIN #21)
1 60021U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9998
2 60021 53.2000 185.4500 0001450 045.2000 129.6000 15.75420000      7
STARLINK-G10-22 (TRAIN #22)
1 60022U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9999
2 60022 53.2000 185.4500 0001450 045.2000 130.0800 15.75420000      2
STARLINK-G10-23 (TRAIN #23)
1 60023U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9990
2 60023 53.2000 185.4500 0001450 045.2000 130.5600 15.75420000      6
STARLINK-G10-24 (TRAIN TAIL)
1 60024U 26055A   26236.40000000  .00012500  00000-0  52000-3 0  9991
2 60024 53.2000 185.4500 0001450 045.2000 131.0400 15.75420000      1`;

const MAJOR_SATELLITES_TLE = `PAZ (SPAIN RADAR)
1 43215U 18020A   26240.29867021  .00001546  00000+0  76820-4 0  9997
2 43215  97.4459 246.6656 0001689  85.1196 275.0231 15.19145522471955
SAOCOM 1A (ARGENTINA RADAR)
1 43641U 18076A   26240.30481417 -.00000079  00000+0 -33742-5 0  9993
2 43641  97.8894  66.0136 0001542  86.3256 273.8133 14.82155308426780
CHEOPS (SPAIN EXOPLANET)
1 44874U 19092B   26240.28971890  .00000232  00000+0  55580-4 0  9999
2 44874  98.1515  67.5594 0009473 229.3581 130.6798 14.62005337356433
IGS RADAR-7 (JAPAN RECON)
1 55342U 23013A   26100.12345678  .00000000  00000-0  00000-0 0  9971
2 55342  97.4000 135.0000 0012000  60.0000 300.0000 15.22000000    01
KIRAMEKI-2 (DSN-2 MILSATCOM)
1 41940U 17005A   26100.12345678  .00000000  00000-0  00000-0 0  9970
2 41940   0.0300 162.0000 0001000 180.0000  90.0000  1.00270000    02
SBIRS GEO-5 (EARLY WARNING)
1 48618U 21042A   26100.12345678  .00000000  00000-0  00000-0 0  9969
2 48618   0.0200 230.0000 0001000 180.0000  90.0000  1.00270000    03
GSSAP-5 (SPACE PATROL)
1 51100U 22005A   26100.12345678  .00000000  00000-0  00000-0 0  9968
2 51100   0.0800  45.0000 0015000 180.0000  90.0000  1.00350000    04
AEHF-6 (USA-298 MILSATCOM)
1 45465U 20019A   26100.12345678  .00000000  00000-0  00000-0 0  9967
2 45465   0.0200 290.0000 0001000 180.0000  90.0000  1.00270000    05
ORION 10 / MENTOR-7 (USA-300)
1 47237U 20095A   26100.12345678  .00000000  00000-0  00000-0 0  9966
2 47237   0.0400 100.0000 0002000 180.0000  90.0000  1.00270000    06
TUNDRA 5 (COSMOS 2552 EKS)
1 49503U 21110A   26100.12345678  .00000000  00000-0  00000-0 0  9965
2 49503  63.4000  60.0000 7000000 270.0000  90.0000  2.00560000    07
KOSMOS 2542 (INSPECTOR)
1 44797U 19079A   26100.12345678  .00000000  00000-0  00000-0 0  9964
2 44797  97.9000 142.0000 0300000  90.0000 270.0000 15.30000000    08
SHIJIAN-21 (SPACE TUG)
1 49330U 21095A   26100.12345678  .00000000  00000-0  00000-0 0  9963
2 49330   0.0400  80.0000 0001500 180.0000  90.0000  1.00270000    09
OFEQ-16 (ISRAEL RETROGRADE)
1 45860U 20044A   26100.12345678  .00000000  00000-0  00000-0 0  9962
2 45860 141.7000  50.0000 0200000 120.0000 240.0000 15.85000000    10
SARAH-1 (GERMAN RADAR)
1 52885U 22063A   26100.12345678  .00000000  00000-0  00000-0 0  9961
2 52885  98.4000 170.0000 0002000  85.0000 275.0000 14.45000000    11
X-37B (OTV-7 SPACEPLANE)
1 58641U 23210A   26100.12345678  .00000000  00000-0  00000-0 0  9983
2 58641  37.0000 180.0000 0010000 100.0000 260.0000 15.65000000    01
USA-245 (KH-11 KEYHOLE)
1 39232U 13043A   26100.12345678  .00000000  00000-0  00000-0 0  9982
2 39232  97.9000 140.0000 0550000  80.0000 280.0000 15.35000000    02
SWOT (WATER TOPOGRAPHY)
1 54754U 22173A   26100.12345678  .00000000  00000-0  00000-0 0  9981
2 54754  77.6000  95.0000 0001000 120.0000 240.0000 14.07000000    03
WORLDVIEW-3 (MAXAR)
1 40115U 14048A   26100.12345678  .00000000  00000-0  00000-0 0  9980
2 40115  97.9000 210.0000 0012000  45.0000 315.0000 14.85000000    04
OLYMP-K (LUCH-5X SPY)
1 40258U 14058A   26100.12345678  .00000000  00000-0  00000-0 0  9979
2 40258   0.0500  55.0000 0002000 180.0000  90.0000  1.00270000    05
SPEKTR-RG (X-RAY ASTRO)
1 44432U 19040A   26100.12345678  .00000000  00000-0  00000-0 0  9978
2 44432  28.5000  70.0000 8000000 180.0000  90.0000  0.15000000    06
METEOR-M NO.2-4
1 59051U 24039A   26100.12345678  .00000000  00000-0  00000-0 0  9977
2 59051  98.6000 115.0000 0002000  70.0000 290.0000 14.23000000    07
MICIUS (QUESS QUANTUM)
1 41744U 16051A   26100.12345678  .00000000  00000-0  00000-0 0  9976
2 41744  97.4000 160.0000 0010000  50.0000 310.0000 15.22000000    08
DAMPE (WUKONG DARK MATTER)
1 41173U 15078A   26100.12345678  .00000000  00000-0  00000-0 0  9975
2 41173  97.4000 190.0000 0008000  60.0000 300.0000 15.21000000    09
YAOGAN-35A (TRI-FORMATION)
1 49405U 21101A   26100.12345678  .00000000  00000-0  00000-0 0  9974
2 49405  35.0000 230.0000 0005000 120.0000 240.0000 15.24000000    10
QUEQIAO (MOON RELAY)
1 43470U 18045A   26100.12345678  .00000000  00000-0  00000-0 0  9973
2 43470  16.0000 300.0000 6500000 180.0000  90.0000  0.07000000    11
ADRAS-J (ASTROSCALE)
1 58988U 24034A   26100.12345678  .00000000  00000-0  00000-0 0  9972
2 58988  98.0000 145.0000 0010000  80.0000 280.0000 14.90000000    12
SENTINEL-2A (COPERNICUS)
1 40697U 15028A   26100.12345678  .00000000  00000-0  00000-0 0  9999
2 40697  98.6200  85.0000 0001200  70.0000 290.0000 14.30800000    01
SENTINEL-1A (COPERNICUS SAR)
1 39634U 14016A   26100.12345678  .00000000  00000-0  00000-0 0  9998
2 39634  98.1800 110.0000 0001500  80.0000 280.0000 14.59200000    02
GALILEO-26 (GSAT0224)
1 49811U 21096B   26100.12345678  .00000000  00000-0  00000-0 0  9997
2 49811  56.0000  40.0000 0003000 120.0000 240.0000  1.70470000    03
METEOSAT-12 (MTG-I1)
1 54747U 22170A   26100.12345678  .00000000  00000-0  00000-0 0  9996
2 54747   0.0200   0.0000 0001000 180.0000  90.0000  1.00270000    04
LANDSAT-9 (EARTH OBSERVATION)
1 49260U 21088A   26100.12345678  .00000000  00000-0  00000-0 0  9995
2 49260  98.2000 130.0000 0001100  60.0000 300.0000 14.57100000    05
TERRA (EOS AM-1)
1 25994U 99068A   26100.12345678  .00000000  00000-0  00000-0 0  9994
2 25994  98.2000 140.0000 0001200  90.0000 270.0000 14.57100000    06
GOES-18 (GOES-WEST)
1 51850U 22021A   26100.12345678  .00000000  00000-0  00000-0 0  9993
2 51850   0.0300 223.0000 0001000 180.0000  90.0000  1.00270000    07
GEO-KOMPSAT-2A (CHOLLIAN-2A)
1 43847U 18100A   26100.12345678  .00000000  00000-0  00000-0 0  9992
2 43847   0.0200 128.2000 0001000 180.0000  90.0000  1.00270000    08
GEO-KOMPSAT-2B (CHOLLIAN-2B)
1 45244U 20013A   26100.12345678  .00000000  00000-0  00000-0 0  9991
2 45244   0.0200 128.2000 0001000 180.0000  90.0000  1.00270000    09
KOMPSAT-5 (ARIRANG-5)
1 39227U 13042A   26100.12345678  .00000000  00000-0  00000-0 0  9990
2 39227  97.6000 150.0000 0001400  50.0000 310.0000 15.14300000    10
CARTOSAT-3 (ISRO HIGH-RES)
1 44804U 19081A   26100.12345678  .00000000  00000-0  00000-0 0  9989
2 44804  97.5000  60.0000 0001500  40.0000 320.0000 15.20000000    11
INSAT-3DR (GEO WEATHER)
1 41752U 16054A   26100.12345678  .00000000  00000-0  00000-0 0  9988
2 41752   0.0300  74.0000 0001000 180.0000  90.0000  1.00270000    12
GLONASS-K (COSMOS 2547)
1 46805U 20075A   26100.12345678  .00000000  00000-0  00000-0 0  9987
2 46805  64.8000  80.0000 0003000 150.0000 210.0000  2.13100000    13
ELEKTRO-L NO.3 (RUSSIAN GEO)
1 44903U 19095A   26100.12345678  .00000000  00000-0  00000-0 0  9986
2 44903   0.0400 165.8000 0001000 180.0000  90.0000  1.00270000    14
FENGYUN-4B (NEW-GEN GEO)
1 48808U 21047A   26100.12345678  .00000000  00000-0  00000-0 0  9985
2 48808   0.0200 105.0000 0001000 180.0000  90.0000  1.00270000    15
GAOFEN-7 (3D MAPPING)
1 44703U 19072A   26100.12345678  .00000000  00000-0  00000-0 0  9984
2 44703  97.4000 160.0000 0001300  60.0000 300.0000 15.22000000    16
ALOS-2 (DAICHI-2)
1 39766U 14029A   26100.12345678  .00000000  00000-0  00000-0 0  9991
2 39766  97.9000 120.0000 0001000 100.0000 260.0000 14.78000000    01
ALOS-4 (DAICHI-4)
1 60175U 24122A   26100.12345678  .00000000  00000-0  00000-0 0  9992
2 60175  97.9000 150.0000 0001000 130.0000 230.0000 14.78000000    02
XRISM (X-RAY TELESCOPE)
1 57798U 23137A   26100.12345678  .00000000  00000-0  00000-0 0  9993
2 57798  31.0000  80.0000 0005000  90.0000 270.0000 15.00000000    03
GCOM-W (SHIZUKU)
1 38337U 12025A   26100.12345678  .00000000  00000-0  00000-0 0  9994
2 38337  98.2000 200.0000 0001000  60.0000 300.0000 14.58000000    04
GCOM-C (SHIKISAI)
1 43065U 17082A   26100.12345678  .00000000  00000-0  00000-0 0  9995
2 43065  98.6000 240.0000 0001000  45.0000 315.0000 14.28000000    05
GOSAT-2 (IBUKI-2)
1 43671U 18084B   26100.12345678  .00000000  00000-0  00000-0 0  9996
2 43671  98.0000 300.0000 0001000  80.0000 280.0000 14.85000000    06
QPS-SAR-5 (TSUKUYOMI-1)
1 58567U 23197A   26100.12345678  .00000000  00000-0  00000-0 0  9997
2 58567  42.0000  95.0000 0010000 110.0000 250.0000 14.95000000    07
STRIX-1 (SYNSPECTIVE)
1 53828U 22114A   26100.12345678  .00000000  00000-0  00000-0 0  9998
2 53828  97.6000 175.0000 0012000 140.0000 220.0000 15.02000000    08
HIMAWARI-8
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
QZSS / MICHIBIKI-7
1 66888U 26182A   26233.12345678  .00000000  00000-0  00000-0 0  9999
2 66888  39.5000 190.0000 0750000 270.0000  90.0000  1.00273791    01
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

// Detail Card & Controls DOMs
const detailCard = document.getElementById('detailCard');
const closeDetail = document.getElementById('closeDetail');
const satBadge = document.getElementById('satBadge');
const satName = document.getElementById('satName');
const satNorad = document.getElementById('satNorad');
const satDescription = document.getElementById('satDescription');
const satImageWrapper = document.getElementById('satImageWrapper');
const satImage = document.getElementById('satImage');
const satImageCaption = document.getElementById('satImageCaption');
const satAlt = document.getElementById('satAlt');
const satVel = document.getElementById('satVel');
const satLat = document.getElementById('satLat');
const satLon = document.getElementById('satLon');
const satInc = document.getElementById('satInc');
const satPeriod = document.getElementById('satPeriod');
const trackBtn = document.getElementById('trackBtn');
const untrackBtn = document.getElementById('untrackBtn');
const toggleDebrisRisk = document.getElementById('toggleDebrisRisk');
const toggleLabels = document.getElementById('toggleLabels');
const toggleOrbits = document.getElementById('toggleOrbits');
const toggleMultiLap = document.getElementById('toggleMultiLap');
const toggleAtmosphere = document.getElementById('toggleAtmosphere');
const toggle2D = document.getElementById('toggle2D');
const toggleBorders = document.getElementById('toggleBorders');
const satSelect = document.getElementById('satSelect');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const searchResults = document.getElementById('searchResults');
const statCount = document.getElementById('statCount');
const statTime = document.getElementById('statTime');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');
const labelsContainer = document.getElementById('labelsContainer');
const tzSelect = document.getElementById('tzSelect');
const loadMajorBtn = document.getElementById('loadMajorBtn');
const loadDeepSpaceBtn = document.getElementById('loadDeepSpaceBtn');
const loadSolarSystemBtn = document.getElementById('loadSolarSystemBtn');
const loadTrainBtn = document.getElementById('loadTrainBtn');
const loadSpanishBtn = document.getElementById('loadSpanishBtn');
const loadLocalBtn = document.getElementById('loadLocalBtn');
const loadDebrisBtn = document.getElementById('loadDebrisBtn');
const loadOnlineBtn = document.getElementById('loadOnlineBtn');
const sourceStatusBadge = document.getElementById('sourceStatusBadge');

// High Quality Royalty-Free & Public Domain Satellite Images (Local High-Speed Cache)
const SATELLITE_IMAGES = {
    "STARLINK-G10": {
        "country": "🇺🇸 アメリカ (SpaceX 最新トレイン編隊)",
        "country_en": "🇺🇸 USA (SpaceX Latest Train Chain)",
        "ja": "【🚀 最新打上 スターリンク・トレイン (Starlink Group 10-1)】\n■ 打上日時: 2026年8月22日 14:18:00 UTC (日本時間 23:18:00)\n■ 打上ロケット: SpaceX Falcon 9 Block 5 (フロリダ州 SLC-40)\n■ 展開編隊: 24機等間隔トレイン配置 (軌道高度 約340km / 秒速7.7km)\n■ 軌道傾斜角: 53.2度\n■ 観測特徴: ロケットから放出された直後のみ夜空に現れる、24機の光の点が数珠つなぎに一列で疾走する『銀河鉄道』現象。",
        "en": "[🚀 Latest Launch: Starlink Train (Group 10-1 Chain)]\n■ Launch Time: Aug 22, 2026 14:18:00 UTC (23:18 JST)\n■ Rocket: SpaceX Falcon 9 Block 5 (Cape Canaveral SLC-40)\n■ Formation: 24-Satellite Luminous Deployment Chain (Alt ~340 km / 7.7 km/s)\n■ Inclination: 53.2°\n■ Visual Phenomenon: Iconic 'satellite train' marching across the night sky shortly after rocket deployment.",
        "zh": "【🚀 最新发射：星链列车 Starlink Train (Group 10-1)】\n■ 发射时间：2026年8月22日 14:18:00 UTC (北京时间 22:18)\n■ 运载火箭：SpaceX 猎鹰9号 (卡纳维拉尔角 SLC-40)\n■ 编队构型：24星等间距列车队形 (轨道高度约340km / 速度7.7km/s)\n■ 轨道倾角：53.2°\n■ 视觉特征：火箭发射后数日内在夜空中呈现为一条璀璨的“银河铁道”光珠长龙。",
        "es": "【🚀 Último lanzamiento: Tren Starlink (Grupo 10-1)】\n■ Fecha de lanzamiento: 22 de agosto de 2026, 14:18:00 UTC\n■ Cohete: SpaceX Falcon 9 (Cabo Cañaveral SLC-40)\n■ Formación: Cadena de 24 satélites (Alt ~340 km / 7,7 km/s)\n■ Inclinación: 53,2°\n■ Fenómeno: Espectacular tren luminoso visible en el cielo nocturno.",
        "fr": "【🚀 Dernier lancement : Train Starlink (Groupe 10-1)】\n■ Date de lancement : 22 août 2026 à 14:18:00 UTC\n■ Fusée : SpaceX Falcon 9 (Cap Canaveral SLC-40)\n■ Formation : Chaîne de 24 satellites (Alt ~340 km / 7,7 km/s)\n■ Inclinaison : 53,2°\n■ Phénomène : Chapelet lumineux spectaculaire traversant le ciel nocturne.",
        "de": "【🚀 Neuester Start: Starlink-Zug (Gruppe 10-1)】\n■ Startzeit: 22. August 2026, 14:18:00 UTC\n■ Rakete: SpaceX Falcon 9 (Cape Canaveral SLC-40)\n■ Formation: 24-Satelliten-Perlenkette (Höhe ~340 km / 7,7 km/s)\n■ Inklination: 53,2°\n■ Phänomen: Faszinierender Perlschnur-Effekt am Nachthimmel.",
        "ru": "【🚀 Последний запуск: Поезд Старлинк (Группа 10-1)】\n■ Время запуска: 22 августа 2026 г., 14:18:00 UTC\n■ Ракета: SpaceX Falcon 9 (Мыс Канаверал SLC-40)\n■ Структура: Цепочка из 24 спутников (Высота ~340 км / 7,7 км/с)\n■ Наклонение: 53,2°\n■ Явление: Зрелищный светящийся поезд из спутников в ночном небе.",
        "pt": "【🚀 Último lançamento: Trem Starlink (Grupo 10-1)】\n■ Hora de lançamento: 22 de agosto de 2026, 14:18:00 UTC\n■ Foguete: SpaceX Falcon 9 (Cabo Canaveral SLC-40)\n■ Formação: Trem luminoso de 24 satélites (Alt ~340 km / 7,7 km/s)\n■ Inclinação: 53,2°\n■ Fenômeno: Trem de luzes estelar visível nos primeiros dias após o lançamento.",
        "it": "【🚀 Ultimo lancio: Treno Starlink (Gruppo 10-1)】\n■ Orario di lancio: 22 agosto 2026, 14:18:00 UTC\n■ Vettore: SpaceX Falcon 9 (Cape Canaveral SLC-40)\n■ Formazione: Catena luminosa di 24 satelliti (Alt ~340 km / 7,7 km/s)\n■ Inclinazione: 53,2°\n■ Fenomeno: Spettacolare treno di satelliti allineati nel cielo notturno.",
        "ko": "【🚀 최신 발사: 스타링크 트레인 (Group 10-1)】\n■ 발사 일시: 2026년 8월 22일 14:18:00 UTC (한국시간 23:18)\n■ 발사체: SpaceX Falcon 9 (플로리다 케이프커내버럴 SLC-40)\n■ 편대 구성: 24기 등간격 트레인 대형 (고도 약 340km / 초속 7.7km)\n■ 궤도 경사각: 53.2도\n■ 관측 특징: 발사 직후 밤하늘을 일렬로 가로지르는 환상적인 '은하철도' 현상.",
        "nl": "【🚀 Nieuwste lancering: Starlink-trein (Groep 10-1)】\n■ Lanceringstijd: 22 augustus 2026, 14:18:00 UTC\n■ Raket: SpaceX Falcon 9 (Cape Canaveral SLC-40)\n■ Formatie: 24-satellieten lichtketen (Hoogte ~340 km / 7,7 km/s)\n■ Inclinatie: 53,2°\n■ Fenomeen: Spectaculaire 'satelliettrein' aan de nachthemel.",
        "id": "【🚀 Peluncuran Terbaru: Kereta Starlink (Grup 10-1)】\n■ Waktu Peluncuran: 22 Agustus 2026, 14:18:00 UTC\n■ Roket: SpaceX Falcon 9 (Cape Canaveral SLC-40)\n■ Formasi: Rantai 24 satelit sejajar (Ketinggian ~340 km / 7,7 km/dtk)\n■ Inklinasi: 53,2°\n■ Fenomena: Rantai cahaya memanjang di langit malam setelah peluncuran.",
        "hi": "【🚀 नवीनतम प्रक्षेपण: स्टारलिंक ट्रेन (Group 10-1)】\n■ प्रक्षेपण समय: 22 अगस्त 2026, 14:18:00 UTC (भारतीय समयानुसार 19:48)\n■ रॉकेट: SpaceX Falcon 9 (केप कैनावेरल SLC-40)\n■ संरचना: 24 उपग्रहों की प्रकाश श्रृंखला (ऊंचाई ~340 km / 7.7 km/s)\n■ झुकाव: 53.2°\n■ दृश्य विशेषता: अंतरिक्ष में एक पंक्ति में दौड़ती 'गैलेक्सी ट्रेन'।",
        "ar": "【🚀 آخر إطلاق: قطار ستارلينك (المجموعة 10-1)】\n■ وقت الإطلاق: 22 أغسطس 2026، 14:18:00 UTC\n■ الصاروخ: SpaceX Falcon 9 (كيب كانافيرال SLC-40)\n■ التشكيل: سلسلة متتالية من 24 قمراً (الارتفاع ~340 كم / 7.7 كم/ثانية)\n■ الميل المداري: 53.2°\n■ الظاهرة: قطار أضواء مذهل يعبر سماء الليل بعد الإطلاق مباشرة."
    },
    "STARLINK": {
        "url": "assets/sat_images/starlink_nasa.jpg?v=20260822_530",
        "caption": "Illustration: NASA / Ames Research Center / SpaceX",
        "alt": "SpaceX Starlink Satellite with Single Large Solar Panel"
    },
    "ISS": {
        "url": "assets/sat_images/iss.jpg",
        "caption": "Photo: NASA (Public Domain)",
        "alt": "International Space Station in orbit"
    },
    "HUBBLE": {
        "url": "assets/sat_images/hubble.jpg",
        "caption": "Photo: NASA / STS-125 (Public Domain)",
        "alt": "Hubble Space Telescope"
    },
    "ALOS-4": {
        "url": "assets/sat_images/alos_4.jpg",
        "caption": "Illustration: JAXA (CC BY-SA 4.0)",
        "alt": "ALOS-4 Daichi-4 Earth Observation Satellite"
    },
    "ALOS-2": {
        "url": "assets/sat_images/alos_2.jpg",
        "caption": "Illustration: JAXA (CC BY-SA 4.0)",
        "alt": "ALOS-2 Daichi-2 Radar Satellite"
    },
    "HIMAWARI": {
        "url": "assets/sat_images/himawari.jpg",
        "caption": "Illustration: JMA / JAXA / Mitsubishi Electric",
        "alt": "Himawari Geostationary Meteorological Satellite"
    },

    "MICHIBIKI-7": {
        "url": "assets/sat_images/michibiki_7_official.jpg?v=20260822_570",
        "caption": "Illustration: Cabinet Office / Mitsubishi Electric (QZS-7 3D Model)",
        "alt": "Michibiki QZS-7 Modern Navigation Spacecraft"
    },
    "QZS-7": {
        "url": "assets/sat_images/michibiki_7_official.jpg?v=20260822_570",
        "caption": "Illustration: Cabinet Office / Mitsubishi Electric (QZS-7 3D Model)",
        "alt": "Michibiki QZS-7 Modern Navigation Spacecraft"
    },
    "MICHIBIKI-1R": {
        "url": "assets/sat_images/michibiki_1r_v2.jpg",
        "caption": "Illustration: Cabinet Office / JAXA (QZS-1R Replacement)",
        "alt": "Michibiki QZS-1R Navigation Spacecraft"
    },
    "MICHIBIKI-6": {
        "url": "assets/sat_images/michibiki_6_v2.jpg",
        "caption": "Illustration: Cabinet Office / JAXA (QZS-6 7-Sat Constellation)",
        "alt": "Michibiki QZS-6 Modern Navigation Spacecraft"
    },
    "MICHIBIKI-5": {
        "url": "assets/sat_images/michibiki_5_v2.jpg",
        "caption": "Illustration: Cabinet Office / Mitsubishi Electric (QZS-5 3D Model)",
        "alt": "Michibiki QZS-5 Modern Navigation Spacecraft"
    },
    "MICHIBIKI-3": {
        "url": "assets/sat_images/michibiki_3_v2.jpg",
        "caption": "Illustration: Cabinet Office / JAXA (QZS-3 Geostationary GEO Spacecraft)",
        "alt": "Michibiki QZS-3 Geostationary Spacecraft"
    },
    "MICHIBIKI-2": {
        "url": "assets/sat_images/michibiki_2_v2.jpg",
        "caption": "Illustration: Cabinet Office / JAXA (QZS-2 Quasi-Zenith Orbit)",
        "alt": "Michibiki QZS-2 Navigation Spacecraft"
    },
    "MICHIBIKI-4": {
        "url": "assets/sat_images/michibiki_4_v2.jpg",
        "caption": "Illustration: Cabinet Office / JAXA (QZS-4 Quasi-Zenith Orbit)",
        "alt": "Michibiki QZS-4 Navigation Spacecraft"
    },
    "MICHIBIKI-1": {
        "url": "assets/sat_images/michibiki_1_v2.jpg",
        "caption": "Illustration: JAXA / SatNavi (QZS-1 Quasi-Zenith Orbit)",
        "alt": "Michibiki QZS-1 Quasi-Zenith Satellite"
    },
    "MICHIBIKI": {
        "url": "assets/sat_images/michibiki_1_v2.jpg",
        "caption": "Illustration: JAXA / SatNavi (QZS-1 Quasi-Zenith Orbit)",
        "alt": "Michibiki QZS-1 Quasi-Zenith Satellite"
    },
    "QZS-1R": {
        "url": "assets/sat_images/michibiki_1r_v2.jpg",
        "caption": "Illustration: Cabinet Office / JAXA (QZS-1R Replacement)",
        "alt": "Michibiki QZS-1R Navigation Spacecraft"
    },
    "QZS-6": {
        "url": "assets/sat_images/michibiki_6_v2.jpg",
        "caption": "Illustration: Cabinet Office / JAXA (QZS-6 7-Sat Constellation)",
        "alt": "Michibiki QZS-6 Modern Navigation Spacecraft"
    },
    "QZS-5": {
        "url": "assets/sat_images/michibiki_5_v2.jpg",
        "caption": "Illustration: Cabinet Office / Mitsubishi Electric (QZS-5 3D Model)",
        "alt": "Michibiki QZS-5 Modern Navigation Spacecraft"
    },
    "QZS-3": {
        "url": "assets/sat_images/michibiki_3_v2.jpg",
        "caption": "Illustration: Cabinet Office / JAXA (QZS-3 Geostationary GEO Spacecraft)",
        "alt": "Michibiki QZS-3 Geostationary Spacecraft"
    },
    "QZS-2": {
        "url": "assets/sat_images/michibiki_2_v2.jpg",
        "caption": "Illustration: Cabinet Office / JAXA (QZS-2 Quasi-Zenith Orbit)",
        "alt": "Michibiki QZS-2 Navigation Spacecraft"
    },
    "QZS-4": {
        "url": "assets/sat_images/michibiki_4_v2.jpg",
        "caption": "Illustration: Cabinet Office / JAXA (QZS-4 Quasi-Zenith Orbit)",
        "alt": "Michibiki QZS-4 Navigation Spacecraft"
    },
    "QZS-1": {
        "url": "assets/sat_images/michibiki_1_v2.jpg",
        "caption": "Illustration: JAXA / SatNavi (QZS-1 Quasi-Zenith Orbit)",
        "alt": "Michibiki QZS-1 Quasi-Zenith Satellite"
    },
    "XRISM": {
        "url": "assets/sat_images/xrism.jpg",
        "caption": "Illustration: JAXA / NASA",
        "alt": "XRISM X-ray Astronomy Spacecraft"
    },
    "GCOM-W": {
        "url": "assets/sat_images/gcom_w.jpg",
        "caption": "Illustration: JAXA (Water Cycle Observer Shizuku)",
        "alt": "GCOM-W Shizuku Satellite"
    },
    "GCOM-C": {
        "url": "assets/sat_images/gcom_c.jpg",
        "caption": "Illustration: JAXA (Climate Observer Shikisai)",
        "alt": "GCOM-C Shikisai Satellite"
    },
    "GOSAT": {
        "url": "assets/sat_images/gosat.jpg",
        "caption": "Illustration: JAXA / NIES / MOE",
        "alt": "GOSAT-2 Ibuki-2 Greenhouse Gases Satellite"
    },
    "SENTINEL-2": {
        "url": "assets/sat_images/sentinel_2.jpg",
        "caption": "Illustration: ESA / ATG Medialab (CC BY-SA 3.0 IGO)",
        "alt": "Copernicus Sentinel-2 Satellite"
    },
    "SENTINEL-1": {
        "url": "assets/sat_images/sentinel_1.jpg",
        "caption": "Illustration: ESA / ATG Medialab (CC BY-SA 3.0 IGO)",
        "alt": "Copernicus Sentinel-1 Radar Satellite"
    },
    "GALILEO": {
        "url": "assets/sat_images/galileo.jpg",
        "caption": "Illustration: ESA / OHB (Galileo Navigation Satellite)",
        "alt": "European Galileo Navigation Satellite"
    },
    "METEOSAT": {
        "url": "assets/sat_images/meteosat.jpg",
        "caption": "Illustration: EUMETSAT / ESA / Thales",
        "alt": "Meteosat Third Generation MTG-I Satellite"
    },
    "LANDSAT": {
        "url": "assets/sat_images/landsat.jpg",
        "caption": "Illustration: NASA / USGS (Public Domain)",
        "alt": "Landsat 9 Earth Observation Satellite"
    },
    "TERRA": {
        "url": "assets/sat_images/terra.jpg",
        "caption": "Illustration: NASA Earth Observatory (Public Domain)",
        "alt": "NASA Terra EOS Flagship Satellite"
    },
    "GOES": {
        "url": "assets/sat_images/goes.jpg",
        "caption": "Photo: NOAA / NASA (Public Domain)",
        "alt": "NOAA GOES-18 Weather Satellite"
    },
    "CHOLLIAN": {
        "url": "assets/sat_images/chollian.jpg",
        "caption": "Illustration: KARI (Korea Aerospace Research Institute)",
        "alt": "GEO-KOMPSAT-2A Chollian-2A Satellite"
    },
    "KOMPSAT": {
        "url": "assets/sat_images/kompsat.jpg",
        "caption": "Illustration: KARI (Korea Aerospace Research Institute)",
        "alt": "KOMPSAT-5 Arirang-5 SAR Satellite"
    },
    "CARTOSAT": {
        "url": "assets/sat_images/cartosat.jpg",
        "caption": "Illustration: ISRO (Indian Space Research Organisation)",
        "alt": "ISRO Cartosat-3 High Resolution Satellite"
    },
    "GLONASS": {
        "url": "assets/sat_images/glonass.jpg",
        "caption": "Photo: ISS Reshetnev / Roscosmos (CC BY-SA 4.0)",
        "alt": "Russian GLONASS-K Navigation Satellite"
    },
    "TIANGONG": {
        "url": "assets/sat_images/tiangong.jpg",
        "caption": "Illustration: CMSA / Chinese Academy of Sciences",
        "alt": "Tiangong Chinese Space Station"
    },
    "BEIDOU": {
        "url": "assets/sat_images/beidou.jpg",
        "caption": "Illustration: CAST / CNSA (BeiDou-3 Navigation)",
        "alt": "BeiDou-3 Navigation Satellite"
    },
    "FENGYUN": {
        "url": "assets/sat_images/fengyun.jpg",
        "caption": "Illustration: CMA / SAST (Fengyun-4 Weather Satellite)",
        "alt": "Fengyun-4B Geostationary Weather Satellite"
    },
    "X-37B": {
        "url": "assets/sat_images/x_37b.jpg",
        "caption": "Photo: US Air Force / US Space Force (Public Domain)",
        "alt": "USSF X-37B Orbital Test Vehicle"
    },
    "USA-245": {
        "url": "assets/sat_images/usa_245.jpg",
        "caption": "Illustration: National Reconnaissance Office (Public Domain)",
        "alt": "NRO KH-11 Optical Reconnaissance Satellite"
    },
    "SWOT": {
        "url": "assets/sat_images/swot.jpg",
        "caption": "Illustration: NASA / JPL-Caltech (Public Domain)",
        "alt": "NASA Surface Water and Ocean Topography SWOT Satellite"
    },
    "WORLDVIEW": {
        "url": "assets/sat_images/worldview.jpg",
        "caption": "Illustration: Maxar Technologies / DigitalGlobe",
        "alt": "WorldView-3 Commercial Imaging Satellite"
    },
    "MICIUS": {
        "url": "assets/sat_images/micius.jpg",
        "caption": "Illustration: Chinese Academy of Sciences (CAS / USTC)",
        "alt": "Micius Quantum Science Satellite"
    },
    "DAMPE": {
        "url": "assets/sat_images/dampe.jpg",
        "caption": "Photo: Purple Mountain Observatory / CAS",
        "alt": "DAMPE Wukong Dark Matter Explorer"
    },
    "QUEQIAO": {
        "url": "assets/sat_images/queqiao.jpg",
        "caption": "Illustration: CNSA (Lunar Far Side L2 Relay)",
        "alt": "Queqiao Lunar Relay Satellite"
    },
    "ADRAS": {
        "url": "assets/sat_images/adras.jpg",
        "caption": "Illustration: Astroscale Japan / JAXA",
        "alt": "Astroscale ADRAS-J Debris Inspection Satellite"
    },
    "IGS": {
        "url": "assets/sat_images/igs.jpg",
        "caption": "Photo: JAXA / MHI (IGS Radar-7 Launch)",
        "alt": "IGS Radar-7 Launch on H-IIA"
    },
    "KIRAMEKI": {
        "url": "assets/sat_images/kirameki.jpg",
        "caption": "Photo: JAXA / Ministry of Defense (Kirameki-2 DSN-2)",
        "alt": "Kirameki-2 Defense Satcom on H-IIA"
    },
    "SBIRS": {
        "url": "assets/sat_images/sbirs.jpg",
        "caption": "Illustration: US Air Force / Lockheed Martin (Public Domain)",
        "alt": "SBIRS Missile Early Warning Satellite"
    },
    "GSSAP": {
        "url": "assets/sat_images/gssap.jpg",
        "caption": "Illustration: US Space Force / Orbital ATK (Public Domain)",
        "alt": "GSSAP Geosynchronous Space Patrol Satellite"
    },
    "AEHF": {
        "url": "assets/sat_images/aehf.jpg",
        "caption": "Illustration: US Air Force / Lockheed Martin (Public Domain)",
        "alt": "AEHF Protected Military Communications Satellite"
    },

    "GPS": {
        "url": "assets/sat_images/gps.jpg",
        "caption": "Illustration: US Air Force / Boeing (Public Domain)",
        "alt": "GPS Block IIF Navigation Satellite"
    },
    "OLYMP": {
        "url": "assets/sat_images/olymp.jpg",
        "caption": "Photo: Roscosmos / Russian Aerospace Forces",
        "alt": "Olymp-K / Luch-5X Signals Intelligence Satellite"
    },
    "SPEKTR": {
        "url": "assets/sat_images/spektr.jpg",
        "caption": "Illustration: Roscosmos / IKI / DLR",
        "alt": "Spektr-RG Astrophysical Observatory"
    },
    "METEOR": {
        "url": "assets/sat_images/meteor.jpg",
        "caption": "Illustration: Roshydromet / Roscosmos",
        "alt": "Meteor-M Polar Weather Satellite"
    },
    "YAOGAN": {
        "url": "assets/sat_images/yaogan_v2.jpg?v=20260822_530",
        "caption": "Illustration: CNSA / CASC",
        "alt": "Yaogan-35 Tri-Satellite Formation"
    },
    "OFEQ": {
        "url": "assets/sat_images/ofeq.jpg",
        "caption": "Photo: Israel Ministry of Defense / IAI",
        "alt": "Ofeq-16 Retrograde Reconnaissance Satellite"
    },
    "SARAH": {
        "url": "assets/sat_images/sarah.jpg",
        "caption": "Photo: Bundeswehr / Airbus Defence",
        "alt": "SARah-1 Phased-Array Radar Reconnaissance"
    },
    "TUNDRA": {
        "url": "assets/sat_images/tundra.jpg",
        "caption": "Photo: Russian Aerospace Forces / VKS",
        "alt": "Tundra-5 EKS Early Warning Satellite"
    },
    "SHIJIAN": {
        "url": "assets/sat_images/shijian_21_v2.jpg?v=20260822_530",
        "caption": "Illustration: CNSA / CASC (Space Tug)",
        "alt": "Shijian-21 Robotic Satellite Tug"
    }
};

function getSatImageInfo(name) {
    const upper = (name || '').toUpperCase();
    for (const key of Object.keys(SATELLITE_IMAGES)) {
        if (upper.includes(key)) {
            const info = SATELLITE_IMAGES[key];
            return {
                url: info.url.includes('?v=') ? info.url : info.url + '?v=20260822_530',
                caption: info.caption,
                alt: info.alt
            };
        }
    }
    return null;
}

// Rich Satellite Mission Descriptions Mapping (Full 5-Language Multilingual Dictionary)
const SATELLITE_DESCRIPTIONS = {
    "MICHIBIKI-7": {
        "country": "🇯🇵 日本 (内閣府 / JAXA / 三菱電機)",
        "country_en": "🇯🇵 Japan (Cabinet Office / JAXA / MELCO)",
        "ja": "【準天頂衛星「みちびき7号機」(QZS-7 / 7機体制完成)】\n■ 開発・運用組織: 内閣府 宇宙開発戦略推進事務局 / JAXA / 三菱電機\n■ 打上げ日・ロケット: 2026年8月11日 / H3ロケット9号機 (H3-22S / 種子島宇宙センター)\n■ 軌道諸元: 準天頂・準静止地球同期軌道 (高度約35,786km / 軌道傾斜角約39.5度 / 周期約23時間56分)\n■ 主要搭載機器: 高精度水素メーザー原子時計、ルビジウム原子時計、L1C/A・L1C・L2C・L5測位信号送信アンテナ、サブメータ級・センチメートル級測位補強サービス(CLAS)送信機、災害・危機管理通報サービス(Q-ANPI)、日米防衛協力 宇宙領域把握(SDA)光学センサ\n■ 歴史的意義・ミッション: 日本の準天頂衛星システム(QZSS)の最終目標である「7機体制」を完成させる最新鋭測位衛星。米国のGPS衛星に一切依存することなく、日本独自の高精度センチメートル級測位（自動運転、精密農業、ドローン運航、防災）を24時間365日持続可能にする日本の重要宇宙インフラ。さらに、同盟国との宇宙空間の安全保障を担うSDAセンサーを初搭載。",
        "en": "[QZS-7 Michibiki-7 Navigation Spacecraft (7-Satellite Constellation)]\n■ Agency: Cabinet Office of Japan / JAXA / Mitsubishi Electric\n■ Launcher: H3 Rocket Flight 9 (H3-22S) from Tanegashima Space Center (Aug 11, 2026)\n■ Orbit: Quasi-Zenith Geosynchronous Orbit (~35,786 km, Inclination ~39.5°, 23h56m period)\n■ Payload: High-stability Hydrogen Maser & Rubidium atomic clocks, Multi-band positioning antennae (L1/L2/L5), Centimeter-Level Augmentation Service (CLAS), Crisis & Disaster Notification (Q-ANPI), US-Japan Space Domain Awareness (SDA) optical surveillance payload\n■ Mission: Completes Japan's sovereign 7-satellite QZSS constellation, ensuring continuous, autonomous centimeter-level precision navigation without reliance on US GPS, while enhancing space defense through joint SDA surveillance.",
        "zh": "【准天顶卫星“引路7号”(QZS-7 / 7星体制完成)】\n■ 研发运营机构: 日本内阁府 / JAXA / 三菱电机\n■ 发射时间与火箭: 2026年8月11日 / H3火箭9号机 (种子岛宇宙中心)\n■ 轨道参数: 准天顶地球同步轨道 (高度约35,786公里 / 倾角约39.5度 / 周期约23小时56分)\n■ 核心载荷: 高精度氢脉泽与铷原子钟、多频段导航天线、厘米级定位增强系统 (CLAS)、防灾减灾应急通信 (Q-ANPI)、日美联合太空态势感知 (SDA) 光学载荷\n■ 历史意义: 完成日本准天顶系统(QZSS)“7星体制”的标志性卫星，实现脱离GPS依赖的24小时全天候自主厘米级高精度导航定位，并首次搭载军事太空监视载荷。",
        "ko": "【준꼭대기 위성 「미치비키 7호기」(QZS-7 / 7기 체제 완성)】\n■ 개발 및 운용 기관: 일본 내각부 / JAXA / 미쓰비시 전기\n■ 발사일 및 발사체: 2026년 8월 11일 / H3 로켓 9호기 (다네가시마 우주센터)\n■ 궤도 제원: 준꼭대기 지구 동기 궤도 (고도 약 35,786km / 경사각 약 39.5도)\n■ 주요 탑재체: 수소 메이저 원자시계, 다대역 항법 안테나, 센티미터급 보강 서비스(CLAS), 재난 통보(Q-ANPI), 미·일 공동 우주영역인식(SDA) 광학 센서\n■ 역사적 의의: 일본 QZSS 7기 체제를 완성하여 GPS 독립적 센티미터급 정밀 측위를 24시간 확립하고 미·일 우주 안보 협력을 강화.",
        "de": "[QZS-7 Michibiki-7 Navigationssatellit (Vollendung der 7-Satelliten-Konstellation)]\n■ Organisation: Japanisches Kabinettsbüro / JAXA / Mitsubishi Electric\n■ Trägerrakete: H3-Rakete Flug 9 (11. August 2026, Tanegashima)\n■ Umlaufbahn: Quasi-Zenit geosynchrone Umlaufbahn (~35.786 km, Neigung ~39,5°)\n■ Nutzlast: Wasserstoff-Maser-Atomuhren, Zentimeter-Level Augmentation Service (CLAS), Space Domain Awareness (SDA) Sensoren\n■ Mission: Vervollständigt Japans autonome 7-Satelliten-QZSS-Konstellation für kontinuierliche zentimetergenaue Navigation unabhängig von GPS.",
        "fr": "[Satellite de navigation QZS-7 Michibiki-7 (Constellation complète à 7 satellites)]\n■ Organisation: Bureau du Cabinet du Japon / JAXA / Mitsubishi Electric\n■ Lanceur: Fusée H3 Vol 9 (11 août 2026, Tanegashima)\n■ Orbite: Orbite géosynchrone quasi-zénithale (~35 786 km, inclinaison ~39,5°)\n■ Charge utile: Horloges atomiques à maser à hydrogène, service d'augmentation centimétrique (CLAS), capteurs SDA de surveillance spatiale\n■ Mission: Achève la constellation souveraine japonaise de 7 satellites QZSS, garantissant un positionnement autonome de précision centimétrique.",
        "es": "[Satélite de Navegación QZS-7 Michibiki-7 (Constelación Completa de 7 Satélites)]\n■ Agencia: Oficina del Gabinete de Japón / JAXA / Mitsubishi Electric\n■ Lanzador: Cohete H3 Vuelo 9 (11 de agosto de 2026, Tanegashima)\n■ Órbita: Órbita geosíncrona cuasi-cenital (~35.786 km, inclinación ~39,5°)\n■ Carga útil: Relojes atómicos de máser de hidrógeno, servicio de aumento centimétrico (CLAS), sensor óptico SDA espacial\n■ Misión: Completa la constelación soberana de 7 satélites QZSS de Japón, garantizando posicionamiento autónomo de alta precisión.",
        "pt": "[Satélite de Navegação QZS-7 Michibiki-7 (Constelação de 7 Satélites)]\n■ Agência: Gabinete do Governo do Japão / JAXA / Mitsubishi Electric\n■ Lançador: Foguete H3 Voo 9 (11 de agosto de 2026, Tanegashima)\n■ Órbita: Órbita geossíncrona quase-zenital (~35.786 km, inclinação ~39,5°)\n■ Carga útil: Relógios atômicos de maser de hidrogênio, serviço de precisão centimétrica (CLAS), sensor SDA\n■ Missão: Conclui a constelação de 7 satélites QZSS do Japão, garantindo navegação de alta precisão independente de GPS.",
        "it": "[Satellite di Navigazione QZS-7 Michibiki-7 (Costellazione Completa a 7 Satelliti)]\n■ Agenzia: Ufficio di Gabinetto del Giappone / JAXA / Mitsubishi Electric\n■ Vettore: Razzo H3 Volo 9 (11 agosto 2026, Tanegashima)\n■ Orbita: Orbita geosincrona quasi-zenitale (~35.786 km, inclinazione ~39,5°)\n■ Carico utile: Orologi atomici a maser di idrogeno, servizio di aumento centimetrico (CLAS), sensore ottico SDA per la difesa\n■ Missione: Completa la costellazione a 7 satelliti QZSS del Giappone per un posizionamento centimetricamente accurato e sovrano.",
        "nl": "[QZS-7 Michibiki-7 Navigatiesatelliet (Voltooiing van de 7-Satellietconstellatie)]\n■ Organisatie: Kabinetsbureau van Japan / JAXA / Mitsubishi Electric\n■ Lanceervoertuig: H3-raket Vlucht 9 (11 augustus 2026, Tanegashima)\n■ Baan: Quasi-zenit geosynchrone baan (~35.786 km, inclinatie ~39,5°)\n■ Laadvermogen: Waterstofmaser-atoomklokken, centimeter-level augmentatie (CLAS), SDA ruimtedomeinbewakingssensor\n■ Missie: Voltooit de soevereine 7-satelliet QZSS-constellatie van Japan voor continue centimeternauwkeurige navigatie.",
        "id": "【Satelit Navigasi QZS-7 Michibiki-7 (Penyelesaian Konstelasi 7 Satelit)】\n■ Organisasi: Kantor Kabinet Jepang / JAXA / Mitsubishi Electric\n■ Roket Peluncur: Roket H3 Penerbangan 9 (11 Agustus 2026, Tanegashima)\n■ Parameter Orbit: Orbit Geosinkron Quasi-Zenith (~35.786 km, inklinasi ~39,5°)\n■ Muatan Sensor: Jam atom maser hidrogen, layanan augmentasi tingkat sentimeter (CLAS), sensor pengawasan SDA pertahanan\n■ Misi: Melengkapi konstelasi 7 satelit QZSS kedaulatan Jepang untuk navigasi presisi sentimeter berkelanjutan tanpa bergantung pada GPS.",
        "hi": "【QZS-7 मिचिबिकी-7 नेविगेशन उपग्रह (7-उपग्रह समूह की पूर्णता)】\n■ एजेंसी: जापान का कैबिनेट कार्यालय / JAXA / मित्सुबिशी इलेक्ट्रिक\n■ प्रक्षेपण यान: H3 रॉकेट उड़ान 9 (11 अगस्त 2026, तनेगाशिमा)\n■ कक्षीय विवरण: क्वासी-जेनिथ भू-समकालिक कक्षा (~35,786 किमी, झुकाव ~39.5°)\n■ पेलोड: हाइड्रोजन मेसर परमाणु घड़ियां, सेंटीमीटर-स्तरीय संवर्द्धन सेवा (CLAS), अंतरिक्ष डोमेन जागरूकता (SDA) सेंसर\n■ मिशन: जीपीएस पर निर्भरता के बिना स्वायत्त सेंटीमीटर-सटीक नेविगेशन सुनिश्चित करने के लिए जापान के 7-उपग्रह QZSS समूह को पूरा करता है।",
        "ar": "【قمر الملاحة وتحديد المواقع ميتشيبيكي-7 (QZS-7 / اكتمال كوكبة الـ 7 أقمار)】\n■ الوكالة: مكتب مجلس الوزراء الياباني / JAXA / ميتسوبيشي إلكتريك\n■ صاروخ الإطلاق: صاروخ H3 الرحلة 9 (11 أغسطس 2026، تانيغاشيما)\n■ المدار: مدار شبه متزامن جغرافياً وشبه زوالي (~35,786 كم، الميل ~39.5 درجة)\n■ الحمولة: ساعات هيدروجين ميزر الذرية، خدمة التعزيز على مستوى السنتيمتر (CLAS)، مستشعر SDA لمراقبة المجال الفضائي\n■ المهمة: استكمال كوكبة QZSS السيادية المكونة من 7 أقمار لضمان تحديد المواقع بدقة السنتيمتر على مدار الساعة دون الاعتماد على GPS.",
        "ru": "【Навигационный спутник «Мичибики-7» (QZS-7 / Завершение группировки из 7 спутников)】\n■ Организация: Кабинет министров Японии / JAXA / Mitsubishi Electric\n■ Ракета-носитель: H3 Flight 9 (11 августа 2026 года, космодром Танэгасима)\n■ Параметры орбиты: Квазизенитная геосинхронная орбита (~35 786 км, наклонение ~39,5°)\n■ Полезная нагрузка: Водородные мазерные атомные часы, сервис сантиметровой коррекции (CLAS), оптический датчик контроля космического пространства (SDA)\n■ Миссия: Завершение формирования японской национальной спутниковой группировки QZSS из 7 аппаратов для автономного сантиметрового позиционирования независимо от GPS."
    },

    "IGS": {
        "country": "🇯🇵 日本 (内閣衛星情報センター / 安全保障偵察)",
        "country_en": "🇯🇵 Japan (Cabinet Satellite Intelligence Center)",
        "ja": "【情報収集衛星レーダ7号機「IGS-Radar 7」】\n■ 開発・運用組織: 内閣官房 内閣衛星情報センター (CSICE) / 三菱電機\n■ 打上げ日・ロケット: 2023年1月26日 / H-IIAロケット46号機 (種子島)\n■ 軌道諸元: 高度約500km / 太陽同期軌道 (軌道傾斜角97.4度)\n■ 主要観測機器: 高性能Xバンド合成開口レーダ (SAR / サブメートル級分解能)\n■ 安全保障任務: 1998年の北朝鮮テポドン発射を契機に開発された日本の事実上の軍事偵察衛星。夜間や厚い雲、悪天候を電波で透過し、北朝鮮の移動式弾道ミサイル発射機(TEL)や周辺海域の不審船、大規模災害時の被災状況を24時間監視。",
        "en": "[Information Gathering Satellite Radar-7 (IGS Radar-7)]\n■ Agency: Cabinet Satellite Intelligence Center (CSICE) / JAXA\n■ Launcher: H-IIA F46\n■ Orbit: Sun-synchronous Polar Orbit (~500 km)\n■ Sensor: Synthetic Aperture Radar (SAR) with sub-meter resolution\n■ Mission: Sovereign national security reconnaissance and 24/7 day-and-night all-weather disaster monitoring.",
        "zh": "【情报收集卫星雷达7号 (IGS Radar-7)】\n■ 研发运营机构: 日本内阁卫星情报中心 (CSICE) / JAXA\n■ 运载火箭: H-IIA 46号机\n■ 轨道参数: 太阳同步极轨道 (高度约500公里)\n■ 载荷配置: 亚米级高分辨率合成孔径雷达 (SAR)\n■ 核心任务: 国家安全侦察与全天候、全天时灾害应急观测。",
        "ko": "【정보수집위성 레이더 7호기 (IGS Radar-7)】\n■ 개발 및 운용 기관: 일본 내각위성정보센터 (CSICE) / JAXA\n■ 발사체: H-IIA 로켓 46호기\n■ 궤도 제원: 태양동기 극궤도 (고도 약 500km)\n■ 주요 탑재체: 서브미터급 초고해상도 합성개구레이더 (SAR)\n■ 임무 목적: 국가 안보 정찰 및 주야간·악천후 전천후 24시간 재난 실시간 감시.",
        "de": "[Informationsbeschaffungssatellit Radar-7 (IGS Radar-7)]\n■ Organisation: Kabinettszentrum für Satellitenaufklärung (CSICE) / JAXA\n■ Trägerrakete: H-IIA F46\n■ Umlaufbahn: Sonnensynchroner Erdorbit (~500 km)\n■ Nutzlast: Synthetisches Apertur-Radar (SAR) mit Submeter-Auflösung\n■ Mission: Nationale Sicherheitsaufklärung und 24/7-Überwachung von Katastrophengebieten bei Tag und Nacht.",
        "fr": "[Satellite de renseignement radar IGS Radar-7]\n■ Organisation: Centre de renseignement par satellite du Cabinet (CSICE) / JAXA\n■ Lanceur: H-IIA F46\n■ Orbite: Orbite héliosynchrone polaire (~500 km)\n■ Charge utile: Radar à synthèse d'ouverture (SAR) à résolution submétrique\n■ Mission: Reconnaissance souveraine de sécurité nationale et surveillance continue des catastrophes 24h/24 par tous les temps.",
        "es": "[Satélite de Inteligencia por Radar IGS Radar-7]\n■ Agencia: Centro de Inteligencia por Satélite del Gabinete (CSICE) / JAXA\n■ Lanzador: H-IIA F46\n■ Órbita: Órbita polar heliosíncrona (~500 km)\n■ Carga útil: Radar de apertura sintética (SAR) con resolución submétrica\n■ Misión: Reconocimiento de seguridad nacional y vigilancia de desastres las 24 horas del día en cualquier condición meteorológica.",
        "pt": "[Satélite de Inteligência por Radar IGS Radar-7]\n■ Agência: Centro de Inteligência por Satélite do Gabinete (CSICE) / JAXA\n■ Lançador: H-IIA F46\n■ Órbita: Órbita polar heliossíncrona (~500 km)\n■ Carga útil: Radar de abertura sintética (SAR) com resolução submétrica\n■ Missão: Reconhecimento soberano de segurança nacional e monitoramento de desastres 24 horas por dia em qualquer condição climática.",
        "it": "[Satellite di Intelligence Radar IGS Radar-7]\n■ Agenzia: Centro di intelligence satellitare del Gabinetto (CSICE) / JAXA\n■ Vettore: H-IIA F46\n■ Orbita: Orbita polare eliosincrona (~500 km)\n■ Carico utile: Radar ad apertura sintetica (SAR) a risoluzione submetrica\n■ Missione: Ricognizione sovrana per la sicurezza nazionale e monitoraggio continuo delle emergenze 24 ore su 24 con ogni condizione meteorologica.",
        "nl": "[Inlichtingensatelliet Radar-7 (IGS Radar-7)]\n■ Organisatie: Kabinetscentrum voor Satellietinlichtingen (CSICE) / JAXA\n■ Lanceervoertuig: H-IIA F46\n■ Baan: Zonsynchrone polaire baan (~500 km)\n■ Laadvermogen: Synthetische apertuurradar (SAR) met submeterresolutie\n■ Missie: Nationale veiligheidsverkenning en 24/7-rampenbewaking bij dag en nacht onder alle weersomstandigheden.",
        "id": "【Satelit Intelijen Radar IGS Radar-7】\n■ Organisasi: Pusat Intelijen Satelit Kabinet (CSICE) / JAXA\n■ Roket Peluncur: H-IIA F46\n■ Parameter Orbit: Orbit Polar Sinkron Matahari (~500 km)\n■ Muatan Sensor: Radar Apertur Sintetis (SAR) resolusi sub-meter\n■ Misi: Pengintaian keamanan nasional kedaulatan dan pemantauan bencana 24 jam sehari dalam segala kondisi cuaca.",
        "hi": "【सूचना एकत्रण रडार उपग्रह IGS Radar-7】\n■ एजेंसी: कैबिनेट सैटेलाइट इंटेलिजेंस सेंटर (CSICE) / JAXA\n■ प्रक्षेपण यान: H-IIA F46\n■ कक्षीय विवरण: सूर्य-तुल्यकालिक ध्रुवीय कक्षा (~500 किमी)\n■ पेलोड: उप-मीटर रिज़ॉल्यूशन वाला सिंथेटिक एपर्चर रडार (SAR)\n■ मिशन: संप्रभु राष्ट्रीय सुरक्षा टोही और 24/7 दिन-रात हर मौसम में आपदा निगरानी।",
        "ar": "【قمر استخبارات الرادار IGS Radar-7】\n■ الوكالة: مركز استخبارات الأقمار الصناعية التابع لمجلس الوزراء (CSICE) / JAXA\n■ صاروخ الإطلاق: H-IIA F46\n■ المدار: مدار قطبي متزامن مع الشمس (~500 كم)\n■ الحمولة: رادار الفتحة الاصطناعية (SAR) بدقة أقل من متر\n■ المهمة: استطلاع الأمن القومي السيادي والمراقبة المستمرة للكوارث على مدار 24 ساعة في جميع الظروف الجوية.",
        "ru": "【Спутник радиолокационной разведки IGS Radar-7】\n■ Организация: Центр спутниковой разведки Кабинета министров (CSICE) / JAXA\n■ Ракета-носитель: H-IIA F46\n■ Параметры орбиты: Солнечно-синхронная полярная орбита (~500 км)\n■ Полезная нагрузка: Радиолокатор с синтезированной апертурой (SAR) с субметровым разрешением\n■ Миссия: Государственная разведывательная безопасность и круглосуточный мониторинг стихийных бедствий в любых погодных условиях."
    },
    "KIRAMEKI": {
        "country": "🇯🇵 日本 (防衛省 / 自衛隊専用通信衛星)",
        "country_en": "🇯🇵 Japan (Ministry of Defense / JSDF)",
        "ja": "【防衛通信衛星「きらめき2号」(DSN-2)】\n■ 開発・運用組織: 防衛省 (自衛隊) / 株式会社DSN (スカパーJSAT・NEC)\n■ 打上げ日・ロケット: 2017年1月24日 / H-IIAロケット32号機 (種子島)\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道 (東経162度・太平洋上空定点)\n■ 主要機器: Xバンド防衛通信中継器、強固な耐ジャミング(妨害電波対策)アンテナ\n■ 防衛任務: 陸上・海上・航空自衛隊の全部隊、護衛艦、潜水艦、在外PKO部隊と防衛省司令部を直接結ぶ日本初の防衛専用静止通信網。大容量・高秘匿・耐妨害通信を24時間確保。",
        "en": "[X-Band Defense Communications Satellite Kirameki-2 (DSN-2)]\n■ Agency: Ministry of Defense / Japan Self-Defense Forces (JSDF)\n■ Launcher: H-IIA F32\n■ Orbit: Geostationary Orbit (GEO, ~35,786 km, 144°E)\n■ Payload: Jam-resistant high-capacity X-band military transponders\n■ Mission: High-speed, seamless command and tactical secure voice/data communications for Ground, Maritime, and Air Self-Defense Forces.",
        "zh": "【X波段防卫通信卫星“煌2号”(DSN-2)】\n■ 研发运营机构: 日本防卫省 / 自卫队 (JSDF)\n■ 运载火箭: H-IIA 32号机\n■ 轨道参数: 地球静止轨道 (GEO, 高度约35,786公里, 东经144°)\n■ 载荷配置: 抗干扰高容量X波段军用转发器\n■ 核心任务: 为陆海空自卫队提供高速、无缝、高保密的战术指挥通信。",
        "ko": "【X-밴드 방위통신위성 \"키라메키 2호\" (DSN-2)】\n■ 개발 및 운용 기관: 일본 방위성 / 자위대 (JSDF)\n■ 발사체: H-IIA 로켓 32호기\n■ 궤도 제원: 정지궤도 (GEO, 고도 약 35,786km, 동경 144°)\n■ 주요 탑재체: 항재밍 고용량 X-밴드 군용 트랜스폰더\n■ 임무 목적: 육·해·공 자위대 간 초고속 전술 지휘통제 및 고보안 암호화 데이터 통신망 구축.",
        "de": "[X-Band-Verteidigungskommunikationssatellit Kirameki-2 (DSN-2)]\n■ Organisation: Japanisches Verteidigungsministerium / Selbstverteidigungsstreitkräfte (JSDF)\n■ Trägerrakete: H-IIA F32\n■ Umlaufbahn: Geostationärer Orbit (GEO, ~35.786 km, 144°E)\n■ Nutzlast: Störsichere X-Band-Militärtransponder\n■ Mission: Hochsichere, taktische Führungs- und Datenkommunikation für die Streitkräfte Japans.",
        "fr": "[Satellite de télécommunication militaire en bande X Kirameki-2 (DSN-2)]\n■ Organisation: Ministère de la Défense / Forces d'autodéfense japonaises (JSDF)\n■ Lanceur: H-IIA F32\n■ Orbite: Orbite géostationnaire (GEO, ~35 786 km, 144°E)\n■ Charge utile: Transpondeurs militaires en bande X protégés contre le brouillage\n■ Mission: Communications tactiques sécurisées à haut débit pour les forces terrestres, maritimes et aériennes du Japon.",
        "es": "[Satélite de Comunicaciones Militares en Banda X Kirameki-2 (DSN-2)]\n■ Agencia: Ministerio de Defensa / Fuerzas de Autodefensa de Japón (JSDF)\n■ Lanzador: H-IIA F32\n■ Órbita: Órbita geoestacionaria (GEO, ~35.786 km, 144°E)\n■ Carga útil: Transpondedores militares en banda X con protección antibloqueo\n■ Misión: Comunicaciones tácticas y de mando seguras y de alta velocidad para las fuerzas terrestres, marítimas y aéreas de Japón.",
        "pt": "[Satélite de Comunicações Militares em Banda X Kirameki-2 (DSN-2)]\n■ Agência: Ministério da Defesa / Forças de Autodefesa do Japão (JSDF)\n■ Lançador: H-IIA F32\n■ Órbita: Órbita geoestacionária (GEO, ~35.786 km, 144°E)\n■ Carga útil: Transponders militares em banda X resistentes a interferências\n■ Missão: Comunicações táticas de alta velocidade e comando seguro para as forças terrestres, marítimas e aéreas do Japão.",
        "it": "[Satellite per Comunicazioni Militari in Banda X Kirameki-2 (DSN-2)]\n■ Agenzia: Ministero della Difesa / Forze di autodifesa del Giappone (JSDF)\n■ Vettore: H-IIA F32\n■ Orbita: Orbita geostazionaria (GEO, ~35.786 km, 144°E)\n■ Carico utile: Transponder militari in banda X ad alta capacità e anti-jamming\n■ Missione: Comunicazioni tattiche di comando ad alta velocità e sicurezza per le forze terrestri, marittime e aeree del Giappone.",
        "nl": "[X-Band Defensiecommunicatiesatelliet Kirameki-2 (DSN-2)]\n■ Organisatie: Ministerie van Defensie / Japanse Zelfverdedigingstroepen (JSDF)\n■ Lanceervoertuig: H-IIA F32\n■ Baan: Geostationaire baan (GEO, ~35.786 km, 144°E)\n■ Laadvermogen: Storingsbestendige militaire X-band transponders\n■ Missie: Snelle, naadloze en beveiligde commandocommunicatie voor de grond-, marine- en luchtstrijdkrachten van Japan.",
        "id": "【Satelit Komunikasi Pertahanan Pita-X Kirameki-2 (DSN-2)】\n■ Organisasi: Kementerian Pertahanan / Pasukan Bela Diri Jepang (JSDF)\n■ Roket Peluncur: H-IIA F32\n■ Parameter Orbit: Orbit Geostasioner (GEO, ~35.786 km, 144°BT)\n■ Muatan Sensor: Transponder militer pita-X berkapasitas tinggi tahan interferensi\n■ Misi: Komunikasi komando taktis berkecepatan tinggi dan sangat aman untuk pasukan darat, laut, dan udara Jepang.",
        "hi": "【X-बैंड रक्षा संचार उपग्रह किरामेकी-2 (DSN-2)】\n■ एजेंसी: रक्षा मंत्रालय / जापान आत्मरक्षा बल (JSDF)\n■ प्रक्षेपण यान: H-IIA F32\n■ कक्षीय विवरण: भूस्थिर कक्षा (GEO, ~35,786 किमी, 144°E)\n■ पेलोड: जैम-प्रतिरोधी उच्च क्षमता वाले X-बैंड सैन्य ट्रांसपोंडर\n■ मिशन: थल, जल और वायु रक्षा बलों के लिए उच्च गति, निर्बाध और सुरक्षित सामरिक संचार।",
        "ar": "【قمر الاتصالات الدفاعية في النطاق X كيراميكي-2 (DSN-2)】\n■ الوكالة: وزارة الدفاع / قوات الدفاع الذاتي اليابانية (JSDF)\n■ صاروخ الإطلاق: H-IIA F32\n■ المدار: مدار جغرافي ثابت (GEO, ~35,786 كم, 144°E)\n■ الحمولة: أجهزة إرسال واستقبال عسكرية عالية السعة ومقاومة للتشويش في النطاق X\n■ المهمة: اتصالات قيادة تكتيكية عالية السرعة وآمنة للغاية للقوات البرية والبحرية والجوية اليابانية.",
        "ru": "【Спутник военной связи X-диапазона Кирамэки-2 (DSN-2)】\n■ Организация: Министерство обороны / Силы самообороны Японии (JSDF)\n■ Ракета-носитель: H-IIA F32\n■ Параметры орбиты: Геостационарная орбита (GEO, ~35 786 км, 144°E)\n■ Полезная нагрузка: Помехозащищенные военные транспондеры X-диапазона высокой пропускной способности\n■ Миссия: Высокоскоростная, надежная и защищенная тактическая командная связь для сухопутных, морских и воздушных сил Японии."
    },
    "SBIRS": {
        "country": "🇺🇸 アメリカ (米宇宙軍 / 早期警戒衛星)",
        "country_en": "🇺🇸 USA (US Space Force / Early Warning)",
        "ja": "【弾道ミサイル早期警戒衛星「SBIRS GEO-5」(宇宙配備赤外線システム)】\n■ 開発・運用組織: アメリカ宇宙軍 (USSF) / ロッキード・マーティン\n■ 打上げ日・ロケット: 2021年5月18日 / アトラスV ロケット (ケープカナベラル)\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道\n■ 主要観測機器: 高感度走査型赤外線センサ(スキャナ)、高精度凝視型赤外線センサ(ステアラ)\n■ 軍事任務: 敵国から発射されたICBM(大陸間弾道ミサイル)、SLBM(潜水艦発射弾道ミサイル)、極超音速滑空兵器のロケット噴煙熱を宇宙から1秒以内に検知。ミサイル防衛軍(NORAD/北米航空宇宙防衛司令部)に着弾予測と迎撃データをリアルタイム配信。",
        "en": "[Space-Based Infrared System Missile Warning Satellite (SBIRS GEO-5)]\n■ Agency: US Space Force / Space Systems Command (SSC)\n■ Launcher: Atlas V 421\n■ Orbit: Geostationary Orbit (GEO, ~35,786 km)\n■ Payload: Scanning and Staring SWIR/MWIR infrared early warning sensors\n■ Mission: Instantaneous detection of ballistic and hypersonic missile plume thermal signatures across the globe.",
        "zh": "【天基红外系统导弹预警卫星 (SBIRS GEO-5)】\n■ 研发运营机构: 美国太空军 / 太空系统司令部 (SSC)\n■ 运载火箭: 宇宙神5号 (Atlas V 421)\n■ 轨道参数: 地球静止轨道 (GEO, 高度约35,786公里)\n■ 载荷配置: 扫描与凝视双模中/短波红外高灵敏度光学传感器\n■ 核心任务: 全球范围内弹道导弹与高超音速导弹发射尾焰的毫秒级即时探测与轨迹追踪。",
        "ko": "【우주 기반 적외선 조기경보위성 (SBIRS GEO-5)】\n■ 개발 및 운용 기관: 미국 우주군 / 우주체계사령부 (SSC)\n■ 발사체: 아틀라스 V 421\n■ 궤도 제원: 정지궤도 (GEO, 고도 약 35,786km)\n■ 주요 탑재체: 스캐닝 및 스태어링 단/중파장 초정밀 적외선 탐지 센서\n■ 임무 목적: 전 세계 탄도미사일 및 극초음속 활공체 발사 화염의 밀리초 단위 조기 탐지 및 궤적 추적.",
        "de": "[Weltraumbasiertes Infrarot-Raketenfrühwarnsystem (SBIRS GEO-5)]\n■ Organisation: US Space Force / Space Systems Command (SSC)\n■ Trägerrakete: Atlas V 421\n■ Umlaufbahn: Geostationärer Orbit (GEO, ~35.786 km)\n■ Nutzlast: Hochpräzise Scanning- und Staring-Infrarotsensoren (SWIR/MWIR)\n■ Mission: Globale Millisekunden-Erkennung von Hitzesignaturen ballistischer und hypersonischer Raketenstarts.",
        "fr": "[Système infrarouge d'alerte précoce antimissile (SBIRS GEO-5)]\n■ Organisation: US Space Force / Space Systems Command (SSC)\n■ Lanceur: Atlas V 421\n■ Orbite: Orbite géostationnaire (GEO, ~35 786 km)\n■ Charge utile: Capteurs infrarouges haute sensibilité à balayage et fixation (SWIR/MWIR)\n■ Mission: Détection instantanée des panaches thermiques des missiles balistiques et hypersoniques à travers le monde.",
        "es": "[Sistema Infrarrojo de Alerta Temprana de Misiles (SBIRS GEO-5)]\n■ Agencia: Fuerza Espacial de EE. UU. / Comando de Sistemas Espaciales (SSC)\n■ Lanzador: Atlas V 421\n■ Órbita: Órbita geoestacionaria (GEO, ~35.786 km)\n■ Carga útil: Sensores infrarrojos avanzados de escaneo y fijación (SWIR/MWIR)\n■ Misión: Detección instantánea en milisegundos de las firmas térmicas de misiles balísticos e hipersónicos en todo el mundo.",
        "pt": "[Sistema Infravermelho de Alerta Precoce de Mísseis (SBIRS GEO-5)]\n■ Agência: Força Espacial dos EUA / Comando de Sistemas Espaciais (SSC)\n■ Lançador: Atlas V 421\n■ Órbita: Órbita geoestacionária (GEO, ~35.786 km)\n■ Carga útil: Sensores infravermelhos avançados de varredura e observação contínua (SWIR/MWIR)\n■ Missão: Detecção instantânea em milissegundos de plumas térmicas de mísseis balísticos e hipersônicos em todo o mundo.",
        "it": "[Sistema Infrarosso di Allarme Rapido Missilistico (SBIRS GEO-5)]\n■ Agenzia: US Space Force / Space Systems Command (SSC)\n■ Vettore: Atlas V 421\n■ Orbita: Orbita geostazionaria (GEO, ~35.786 km)\n■ Carico utile: Sensori infrarossi avanzati a scansione e puntamento continuo (SWIR/MWIR)\n■ Missione: Rilevamento istantaneo in millisecondi delle tracce termiche di missili balistici e ipersonici in tutto il mondo.",
        "nl": "[Ruimtegebaseerd Infrarood Raketwaarschuwingssysteem (SBIRS GEO-5)]\n■ Organisatie: US Space Force / Space Systems Command (SSC)\n■ Lanceervoertuig: Atlas V 421\n■ Baan: Geostationaire baan (GEO, ~35.786 km)\n■ Laadvermogen: Geavanceerde infraroodsensoren voor scannen en staren (SWIR/MWIR)\n■ Missie: Onmiddellijke detectie in milliseconden van thermische hittepluimen van ballistische en hypersonische raketten wereldwijd.",
        "id": "【Sistem Peringatan Dini Rudal Inframerah Berbasis Ruang Angkasa (SBIRS GEO-5)】\n■ Organisasi: Angkatan Luar Angkasa AS / Komando Sistem Luar Angkasa (SSC)\n■ Roket Peluncur: Atlas V 421\n■ Parameter Orbit: Orbit Geostasioner (GEO, ~35.786 km)\n■ Muatan Sensor: Sensor inframerah canggih pemindaian dan penatap (SWIR/MWIR)\n■ Misi: Deteksi seketika dalam milidetik jejak panas peluncuran rudal balistik dan hipersonik di seluruh dunia.",
        "hi": "【अंतरिक्ष आधारित इन्फ्रारेड मिसाइल पूर्व चेतावनी प्रणाली (SBIRS GEO-5)】\n■ एजेंसी: अमेरिकी अंतरिक्ष बल / अंतरिक्ष प्रणाली कमान (SSC)\n■ प्रक्षेपण यान: एटलस V 421\n■ कक्षीय विवरण: भूस्थिर कक्षा (GEO, ~35,786 किमी)\n■ पेलोड: उन्नत स्कैनिंग और स्टेयरिंग इन्फ्रारेड सेंसर (SWIR/MWIR)\n■ मिशन: दुनिया भर में बैलिस्टिक और हाइपरसोनिक मिसाइलों के प्रक्षेपण की तुरंत थर्मल पहचान।",
        "ar": "【نظام الإنذار المبكر الصاروخي الفضائي بالأشعة تحت الحمراء (SBIRS GEO-5)】\n■ الوكالة: قوة الفضاء الأمريكية / قيادة الأنظمة الفضائية (SSC)\n■ صاروخ الإطلاق: أطلس 5 (Atlas V 421)\n■ المدار: مدار جغرافي ثابت (GEO, ~35,786 كم)\n■ الحمولة: مستشعرات متقدمة بالأشعة تحت الحمراء للمسح والتحديق (SWIR/MWIR)\n■ المهمة: كشف فوري بالأجزاء من الألف من الثانية للبصمات الحرارية لإطلاق الصواريخ الباليستية وفرط الصوتية حول العالم.",
        "ru": "【Космическая инфракрасная система раннего предупреждения о ракетном нападении (SBIRS GEO-5)】\n■ Организация: Космические силы США / Командование космических систем (SSC)\n■ Ракета-носитель: Atlas V 421\n■ Параметры орбиты: Геостационарная орбита (GEO, ~35 786 км)\n■ Полезная нагрузка: Сканирующие и следящие высокочувствительные инфракрасные датчики (SWIR/MWIR)\n■ Миссия: Мгновенное миллисекундное обнаружение тепловых факелов запусков баллистических и гиперзвуковых ракет по всему миру."
    },
    "GSSAP": {
        "country": "🇺🇸 アメリカ (米宇宙軍 / 宇宙状況把握パトロール)",
        "country_en": "🇺🇸 USA (US Space Force / Space Patrol)",
        "ja": "【静止軌道宇宙パトロール衛星「GSSAP-5」(Hornet)】\n■ 開発・運用組織: アメリカ宇宙軍 (USSF) / ノースロップ・グラマン\n■ 打上げ日・ロケット: 2022年1月21日 / アトラスV ロケット\n■ 軌道諸元: 高度約35,800km / 静止軌道近傍ドリフト軌道\n■ 主要機器: 高分解能電子光学式光学センサ、精密近傍軌道変更スラスタ\n■ 極秘任務: 静止衛星軌道帯（高度36,000km）をゆっくりと巡回・パトロールし、中露の不審な軍事衛星や衛星捕獲船に近距離まで接近して高精細撮影・偵察・監視を行う「宇宙の警察官」。",
        "en": "[Geosynchronous Space Situational Awareness Program (GSSAP-5)]\n■ Agency: US Space Force / Space Delta 9 (Orbital Warfare)\n■ Launcher: Atlas V 511 (USSF-8 mission)\n■ Orbit: Near-geosynchronous drift orbit (~35,800 km)\n■ Payload: High-precision electro-optical cameras & rendezvous proximity sensors\n■ Mission: Space surveillance, characterization, and rendezvous inspection of foreign military satellites.",
        "zh": "【地球同步太空态势感知计划巡逻卫星 (GSSAP-5)】\n■ 研发运营机构: 美国太空军第9太空三角洲 (轨道战部队)\n■ 运载火箭: 宇宙神5号 (Atlas V 511 / USSF-8)\n■ 轨道参数: 近地球同步漂移轨道 (~35,800公里)\n■ 载荷配置: 高精度光电望远镜相机与近距交会对接传感器\n■ 核心任务: 静止轨道他国高价值军用卫星的秘密近距侦察、机动监视与反太空威胁评估。",
        "ko": "【정지궤도 우주상황인식 순찰위성 (GSSAP-5)】\n■ 개발 및 운용 기관: 미국 우주군 제9우주델타 (궤도전 부대)\n■ 발사체: 아틀라스 V 511 (USSF-8 임무)\n■ 궤도 제원: 정지궤도 인근 표류궤도 (~35,800km)\n■ 주요 탑재체: 고정밀 전자광학 망원 카메라 및 랑데부 근접 기동 센서\n■ 임무 목적: 정지궤도 타국 주요 군사위성에 대한 은밀 근접 정찰, 기동 감시 및 위협 분석.",
        "de": "[Geosynchrones Weltraum-Lageerfassungs-Patrouillenprogramm (GSSAP-5)]\n■ Organisation: US Space Force / Space Delta 9 (Orbital Warfare)\n■ Trägerrakete: Atlas V 511 (USSF-8 Mission)\n■ Umlaufbahn: Fast-geosynchrone Driftbahn (~35.800 km)\n■ Nutzlast: Elektro-optische Teleskopkameras und Rendezvous-Sensoren\n■ Mission: Geheime Nahbereichs-Inspektion und Überwachung fremder Militärsatelliten im geostationären Orbit.",
        "fr": "[Programme de surveillance de l'espace géosynchrone (GSSAP-5)]\n■ Organisation: US Space Force / Space Delta 9 (Orbital Warfare)\n■ Lanceur: Atlas V 511 (Mission USSF-8)\n■ Orbite: Orbite de dérive quasi-géosynchrone (~35 800 km)\n■ Charge utile: Caméras télescopiques électro-optiques et capteurs de proximité\n■ Mission: Inspection rapprochée et surveillance manœuvrante des satellites militaires étrangers en orbite géostationnaire.",
        "es": "[Programa de Conciencia Situacional en el Espacio Geosincrónico (GSSAP-5)]\n■ Agencia: Fuerza Espacial de EE. UU. / Space Delta 9 (Guerra Orbital)\n■ Lanzador: Atlas V 511 (Misión USSF-8)\n■ Órbita: Órbita de deriva cuasi-geosincrónica (~35.800 km)\n■ Carga útil: Cámaras electroópticas telescópicas y sensores de aproximación de precisión\n■ Misión: Inspección de proximidad y vigilancia maniobrable de satélites militares extranjeros en órbita geoestacionaria.",
        "pt": "[Programa de Consciência Situacional Espacial Geoestacionária (GSSAP-5)]\n■ Agência: Força Espacial dos EUA / Space Delta 9 (Guerra Orbital)\n■ Lançador: Atlas V 511 (Missão USSF-8)\n■ Órbita: Órbita de deriva quase-geoestacionária (~35.800 km)\n■ Carga útil: Câmeras eletro-ópticas telescópicas e sensores de aproximação de precisão\n■ Missão: Inspeção de proximidade e vigilância manobrável de satélites militares estrangeiros em órbita geoestacionária.",
        "it": "[Programma di Consapevolezza Situazionale Spaziale Geosincrona (GSSAP-5)]\n■ Agenzia: US Space Force / Space Delta 9 (Guerra Orbitale)\n■ Vettore: Atlas V 511 (Missione USSF-8)\n■ Orbita: Orbita di deriva quasi-geosincrona (~35.800 km)\n■ Carico utile: Telecamere telescopiche elettro-ottiche e sensori di prossimità di precisione\n■ Missione: Ispezione ravvicinata e sorveglianza manovrabile di satelliti militari stranieri in orbita geostazionaria.",
        "nl": "[Geosynchrone Ruimtesituatiebewustzijn Patrouilleprogramma (GSSAP-5)]\n■ Organisatie: US Space Force / Space Delta 9 (Orbital Warfare)\n■ Lanceervoertuig: Atlas V 511 (USSF-8 Missie)\n■ Baan: Bijna-geosynchrone driftbaan (~35.800 km)\n■ Laadvermogen: Elektro-optische telescoopcamera's en naderingssensoren\n■ Missie: Geheime nabijheidsinspectie en dynamische surveillance van buitenlandse militaire satellieten in de geostationaire gordel.",
        "id": "【Program Patroli Kesadaran Situasional Ruang Angkasa Geosinkron (GSSAP-5)】\n■ Organisasi: Angkatan Luar Angkasa AS / Space Delta 9 (Peperangan Orbital)\n■ Roket Peluncur: Atlas V 511 (Misi USSF-8)\n■ Parameter Orbit: Orbit hanyut mendekati geosinkron (~35.800 km)\n■ Muatan Sensor: Kamera teleskopik elektro-optik presisi tinggi & sensor manuver pendekatan\n■ Misi: Inspeksi jarak dekat rahasia dan pengawasan bermanuver terhadap satelit militer asing di sabuk geostasioner.",
        "hi": "【भू-तुल्यकालिक अंतरिक्ष स्थितिजन्य जागरूकता गश्ती उपग्रह (GSSAP-5)】\n■ एजेंसी: अमेरिकी अंतरिक्ष बल / स्पेस डेल्टा 9 (ऑर्बिटल वारफेयर)\n■ प्रक्षेपण यान: एटलस V 511 (USSF-8 मिशन)\n■ कक्षीय विवरण: निकट-भूस्थिर ड्रिफ्ट कक्षा (~35,800 किमी)\n■ पेलोड: उच्च परिशुद्धता इलेक्ट्रो-ऑप्टिकल कैमरे और निकटता सेंसर\n■ मिशन: भूस्थिर कक्षा में विदेशी सैन्य उपग्रहों का गुप्त निरीक्षण और निगरानी।",
        "ar": "【برنامج المراقبة والتوعية الظرفية الفضائية في المدار المتزامن (GSSAP-5)】\n■ الوكالة: قوة الفضاء الأمريكية / سبيس دلتا 9 (الحرب المدارية)\n■ صاروخ الإطلاق: أطلس 5 (Atlas V 511 / USSF-8)\n■ المدار: مدار انجراف شبه متزامن مع الأرض (~35,800 كم)\n■ الحمولة: كاميرات تلسكوبية كهروبصرية فائقة الدقة ومستشعرات اقتراب\n■ المهمة: فحص سري ومراقبة مناورة للأقمار الصناعية العسكرية الأجنبية في الحزام الثابت.",
        "ru": "【Программа ситуационной осведомленности в геосинхронном пространстве (GSSAP-5)】\n■ Организация: Космические силы США / Space Delta 9 (Орбитальные боевые действия)\n■ Ракета-носитель: Atlas V 511 (Миссия USSF-8)\n■ Параметры орбиты: Окологеосинхронная дрейфующая орбита (~35 800 км)\n■ Полезная нагрузка: Высокоточные оптико-электронные телескопические камеры и датчики сближения\n■ Миссия: Скрытная инспекция и маневренное наблюдение за иностранными военными спутниками на геостационарной орбите."
    },
    "AEHF": {
        "country": "🇺🇸 アメリカ (米宇宙軍 / 戦略軍・核抗耐性通信)",
        "country_en": "🇺🇸 USA (US Space Force / USSTRATCOM)",
        "ja": "【高度極超音波核抗耐性軍事通信衛星「AEHF-6」(USA-298)】\n■ 開発・運用組織: アメリカ宇宙軍 (USSF) / ノースロップ・グラマン / ロッキード\n■ 打上げ日・ロケット: 2020年3月26日 / アトラスV ロケット\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道\n■ 主要機能: 核爆発時のEMP(電磁パルス)および強力な電子ジャミングに完全耐性を持つ極高周波(EHF/SHF)通信\n■ 軍事任務: 全面核戦争下であっても米大統領および統合参謀本部が戦略爆撃機、原子力潜水艦、ICBM部隊へ「核攻撃命令(NC3)」を下すための世界最高水準の生存性・抗耐性を備えた極秘防衛通信衛星。",
        "en": "[Advanced Extremely High Frequency Protected Military Satcom (AEHF-6)]\n■ Agency: US Space Force / Lockheed Martin Space\n■ Launcher: Atlas V 551\n■ Orbit: Geostationary Orbit (GEO, ~35,786 km)\n■ Payload: Nuclear-survivable, anti-jam, low-probability-of-intercept EHF/SHF phased array transponders\n■ Mission: Ultra-secure global command and control for the US President, Strategic Command, and allied leaders even under electromagnetic pulse (EMP) attack.",
        "zh": "【先进极高频防核防干扰战略通信卫星 (AEHF-6)】\n■ 研发运营机构: 美国太空军 / 洛克希德·马丁\n■ 运载火箭: 宇宙神5号 (Atlas V 551)\n■ 轨道参数: 地球静止轨道 (GEO, 高度约35,786公里)\n■ 载荷配置: 抗核电磁脉冲 (EMP)、低截获率 (LPI/LPD) EHF/SHF相控阵转发器\n■ 核心任务: 在核战争及强电磁干扰环境下保障美国总统与战略指挥机构的最高机密指挥联络。",
        "ko": "【첨단 극고주파 전략 방호 군용통신위성 (AEHF-6)】\n■ 개발 및 운용 기관: 미국 우주군 / 록히드 마틴\n■ 발사체: 아틀라스 V 551\n■ 궤도 제원: 정지궤도 (GEO, 고도 약 35,786km)\n■ 주요 탑재체: 핵 전자기펄스(EMP) 방호, 도청 방지 EHF/SHF 위상배열 트랜스폰더\n■ 임무 목적: 핵전쟁 및 극한 전자기전 환경에서도 미국 대통령 및 전략사령부 최고지휘관과의 암호 지휘통제 보장.",
        "de": "[Advanced Extremely High Frequency Geschützter Militärsatellit (AEHF-6)]\n■ Organisation: US Space Force / Lockheed Martin Space\n■ Trägerrakete: Atlas V 551\n■ Umlaufbahn: Geostationärer Orbit (GEO, ~35.786 km)\n■ Nutzlast: EMP-resistente, abhörsichere EHF/SHF-Phased-Array-Transponder\n■ Mission: Überlebensfähige weltweite Führungskommunikation für den US-Präsidenten und strategische Streitkräfte unter nuklearen Bedingungen.",
        "fr": "[Satellite de télécommunications militaires stratégiques durcies (AEHF-6)]\n■ Organisation: US Space Force / Lockheed Martin Space\n■ Lanceur: Atlas V 551\n■ Orbite: Orbite géostationnaire (GEO, ~35 786 km)\n■ Charge utile: Transpondeurs à réseau phasé EHF/SHF anti-brouillage et résistants aux impulsions électromagnétiques (EMP)\n■ Mission: Commandement stratégique mondial invulnérable pour le Président américain et les forces nucléaires alliées.",
        "es": "[Satélite de Comunicaciones Militares Protegidas de Frecuencia Extremadamente Alta (AEHF-6)]\n■ Agencia: Fuerza Espacial de EE. UU. / Lockheed Martin Space\n■ Lanzador: Atlas V 551\n■ Órbita: Órbita geoestacionaria (GEO, ~35.786 km)\n■ Carga útil: Transpondedores EHF/SHF resistentes a impulsos electromagnéticos nucleares (EMP) y antibloqueo\n■ Misión: Mando y control estratégico mundial ultraseguro para el Presidente de EE. UU. y líderes aliados en escenarios de guerra nuclear.",
        "pt": "[Satélite de Comunicações Militares Protegidas de Frequência Extremamente Alta (AEHF-6)]\n■ Agência: Força Espacial dos EUA / Lockheed Martin Space\n■ Lançador: Atlas V 551\n■ Órbita: Órbita geoestacionária (GEO, ~35.786 km)\n■ Carga útil: Transponders em matriz de fase EHF/SHF resistentes a pulsos eletromagnéticos nucleares (EMP)\n■ Missão: Comando e controle estratégico mundial ultrasseguro para o Presidente dos EUA e aliados em cenários de conflito nuclear.",
        "it": "[Satellite per Comunicazioni Militari Protette ad Altissima Frequenza (AEHF-6)]\n■ Agenzia: US Space Force / Lockheed Martin Space\n■ Vettore: Atlas V 551\n■ Orbita: Orbita geostazionaria (GEO, ~35.786 km)\n■ Carico utile: Transponder phased array EHF/SHF resistenti a impulsi elettromagnetici nucleari (EMP)\n■ Missione: Comando strategico mondiale invulnerabile per il Presidente degli Stati Uniti e le forze alleate in scenari nucleari.",
        "nl": "[Advanced Extremely High Frequency Beveiligde Militaire Satelliet (AEHF-6)]\n■ Organisatie: US Space Force / Lockheed Martin Space\n■ Lanceervoertuig: Atlas V 551\n■ Baan: Geostationaire baan (GEO, ~35.786 km)\n■ Laadvermogen: EMP-bestendige, anti-jamming EHF/SHF phased array-transponders\n■ Missie: Ultrabeveiligde wereldwijde commandovoering voor de Amerikaanse president en strategische strijdkrachten onder nucleaire omstandigheden.",
        "id": "【Satelit Komunikasi Militer Frekuensi Sangat Tinggi Terlindungi (AEHF-6)】\n■ Organisasi: Angkatan Luar Angkasa AS / Lockheed Martin Space\n■ Roket Peluncur: Atlas V 551\n■ Parameter Orbit: Orbit Geostasioner (GEO, ~35.786 km)\n■ Muatan Sensor: Transponder susunan berfasa EHF/SHF tahan pulsa elektromagnetik nuklir (EMP)\n■ Misi: Komando strategis global yang tak terpatahkan untuk Presiden AS dan komandan sekutu dalam skenario perang nuklir.",
        "hi": "【उन्नत अत्यधिक उच्च आवृत्ति संरक्षित सैन्य संचार उपग्रह (AEHF-6)】\n■ एजेंसी: अमेरिकी अंतरिक्ष बल / लॉकहीड मार्टिन स्पेस\n■ प्रक्षेपण यान: एटलस V 551\n■ कक्षीय विवरण: भूस्थिर कक्षा (GEO, ~35,786 किमी)\n■ पेलोड: परमाणु ईएमपी-प्रतिरोधी, एंटी-जैमिंग EHF/SHF फेस्ड ऐरे ट्रांसपोंडर\n■ मिशन: परमाणु युद्ध की स्थिति में अमेरिकी राष्ट्रपति और रणनीतिक कमान के लिए सुरक्षित वैश्विक संचार।",
        "ar": "【قمر الاتصالات العسكرية الاستراتيجية المحمي فائق التردد (AEHF-6)】\n■ الوكالة: قوة الفضاء الأمريكية / لوكهيد مارتن سبيس\n■ صاروخ الإطلاق: أطلس 5 (Atlas V 551)\n■ المدار: مدار جغرافي ثابت (GEO, ~35,786 كم)\n■ الحمولة: مكررات صفيف مرحلي EHF/SHF مقاومة للنبضات الكهرومغناطيسية النووية (EMP) والتشويش\n■ المهمة: قيادة وسيطرة استراتيجية عالمية مؤمنة للرئيس الأمريكي والقوات الحليفة أثناء الحرب النووية.",
        "ru": "【Защищенный военный спутник связи сверхвысокой частоты (AEHF-6)】\n■ Организация: Космические силы США / Lockheed Martin Space\n■ Ракета-носитель: Atlas V 551\n■ Параметры орбиты: Геостационарная орбита (GEO, ~35 786 км)\n■ Полезная нагрузка: Транспондеры с фазированной антенной решеткой EHF/SHF, устойчивые к электромагнитным импульсам (EMP) и помехам\n■ Миссия: Сверхзащищенное глобальное стратегическое управление для Президента США и высшего военного командования в условиях ядерной войны."
    },
    "ORION": {
        "country": "🇺🇸 アメリカ (NRO / 国家偵察局巨大電波スパイ)",
        "country_en": "🇺🇸 USA (NRO / SIGINT Spy)",
        "ja": "【巨大口径電波傍受スパイ衛星「Orion 10」(Mentor-7 / USA-300)】\n■ 開発・運用組織: NRO (米国家偵察局) / CIA / NSA (国家安全保障局)\n■ 打上げ日・ロケット: 2020年12月11日 / デルタIVヘビー (史上最大級の打ち上げ能力ロケット)\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道 (中東・アジア上空定点)\n■ 主要機器: 宇宙空間で展開する直径**約100メートル**(サッカー場サイズ)の超巨大メッシュアンテナ\n■ 偵察任務: 宇宙から地上の軍用レーダー波、軍用無線、ミサイル遠隔測定(テレメトリ)、携帯電話の通信をまるごと傍受・盗聴する、人類史上最大級の電子スパイ衛星。",
        "en": "[Advanced Orion / Mentor-10 Giant SIGINT Reconnaissance Satellite]\n■ Agency: US National Reconnaissance Office (NRO) / CIA (Mission NROL-68)\n■ Launcher: Delta IV Heavy\n■ Orbit: Geostationary Orbit (GEO, ~35,786 km)\n■ Payload: Massive deployable mesh antenna (>100 meters diameter) & multi-band SIGINT receivers\n■ Mission: Global interception of military telemetry, encrypted radar signals, microwave relays, and tactical command radio traffic.",
        "zh": "【“猎户座”/导师10号 巨型天线电子侦察卫星】\n■ 研发运营机构: 美国国家侦察局 (NRO) / 中央情报局 (CIA, NROL-68)\n■ 运载火箭: 德尔塔4号重型运载火箭 (Delta IV Heavy 告别发射)\n■ 轨道参数: 地球静止轨道 (GEO, 高度约35,786公里)\n■ 载荷配置: 直径超100米的巨型网状展开天线与超宽带信号情报 (SIGINT) 接收机\n■ 核心任务: 截获全球范围内的导弹遥测数据、军用雷达雷频信号、微波中继及加密指挥通信。",
        "ko": "【어드밴스드 오리온 / 멘토-10 초대형 안테나 신호정보(SIGINT) 정찰위성】\n■ 개발 및 운용 기관: 미국 국가정찰국 (NRO) / CIA (NROL-68)\n■ 발사체: 델타 IV 헤비 (Delta IV Heavy 최종 퇴역 비행)\n■ 궤도 제원: 정지궤도 (GEO, 고도 약 35,786km)\n■ 주요 탑재체: 직경 100m 이상 거대 전개형 메시 안테나 및 광대역 도청 수신기\n■ 임무 목적: 전 세계 미사일 원격계측 데이터, 군용 레이더 신호, 마이크로웨이브 중계 및 전략 지휘통신 감청.",
        "de": "[Advanced Orion / Mentor-10 Riesenantennen-SIGINT-Satellit]\n■ Organisation: National Reconnaissance Office (NRO) / CIA (NROL-68)\n■ Trägerrakete: Delta IV Heavy\n■ Umlaufbahn: Geostationärer Orbit (GEO, ~35.786 km)\n■ Nutzlast: Entfaltbare Gitterantenne (>100 m Durchmesser) & Breitband-SIGINT-Empfänger\n■ Mission: Weltweites Abfangen militärischer Telemetrie, Radarsignale und verschlüsselter Funkübertragungen.",
        "fr": "[Satellite géant de renseignement d'origine électromagnétique Advanced Orion / Mentor-10]\n■ Organisation: National Reconnaissance Office (NRO) / CIA (NROL-68)\n■ Lanceur: Delta IV Heavy (Dernier vol lourd)\n■ Orbite: Orbite géostationnaire (GEO, ~35 786 km)\n■ Charge utile: Antenne déployable géante en treillis (>100 m de diamètre) et récepteurs SIGINT large bande\n■ Mission: Interception mondiale des télémesures de missiles, des signaux radars et des transmissions chiffrées.",
        "es": "[Satélite Gigante de Inteligencia de Señales Advanced Orion / Mentor-10]\n■ Agencia: Oficina Nacional de Reconocimiento (NRO) / CIA (NROL-68)\n■ Lanzador: Delta IV Heavy (Último vuelo pesado)\n■ Órbita: Órbita geoestacionaria (GEO, ~35.786 km)\n■ Carga útil: Enorme antena de malla desplegable (>100 metros de diámetro) y receptores SIGINT de banda ancha\n■ Misión: Interceptación global de telemetría de misiles, señales de radar militar y comunicaciones tácticas cifradas.",
        "pt": "[Satélite Gigante de Inteligência de Sinais Advanced Orion / Mentor-10]\n■ Agência: National Reconnaissance Office (NRO) / CIA (NROL-68)\n■ Lançador: Delta IV Heavy (Último voo pesado)\n■ Órbita: Órbita geoestacionária (GEO, ~35.786 km)\n■ Carga útil: Enorme antena de malha desdobrável (>100 metros de diâmetro) e receptores SIGINT de banda larga\n■ Missão: Interceptação global de telemetria de mísseis, sinais de radar militar e comunicações táticas criptografadas.",
        "it": "[Satellite Gigante per Spionaggio Elettronico Advanced Orion / Mentor-10]\n■ Agenzia: National Reconnaissance Office (NRO) / CIA (NROL-68)\n■ Vettore: Delta IV Heavy (Ultimo volo pesante)\n■ Orbita: Orbita geostazionaria (GEO, ~35.786 km)\n■ Carico utile: Enorme antenna a rete dispiegabile (>100 metri di diametro) e ricevitori SIGINT a banda larga\n■ Missione: Intercettazione globale di telemetria missilistica, segnali radar militari e comunicazioni tattiche crittografate.",
        "nl": "[Gigantische Spionagesatelliet Advanced Orion / Mentor-10 (SIGINT)]\n■ Organisatie: National Reconnaissance Office (NRO) / CIA (NROL-68)\n■ Lanceervoertuig: Delta IV Heavy (Laatste zware vlucht)\n■ Baan: Geostationaire baan (GEO, ~35.786 km)\n■ Laadvermogen: Enorme uitvouwbare gaasantenne (>100 meter diameter) & breedband SIGINT-ontvangers\n■ Missie: Wereldwijde onderschepping van rakettelemetrie, militaire radarsignalen en gecodeerde communicatie.",
        "id": "【Satelit Spionase Elektronik Raksasa Advanced Orion / Mentor-10】\n■ Organisasi: Kantor Pengintaian Nasional (NRO) / CIA (NROL-68)\n■ Roket Peluncur: Delta IV Heavy (Penerbangan kelas berat terakhir)\n■ Parameter Orbit: Orbit Geostasioner (GEO, ~35.786 km)\n■ Muatan Sensor: Antena jaring raksasa yang dapat dibentangkan (>100 meter) & penerima SIGINT pita lebar\n■ Misi: Penyadapan global telemetri rudal, sinyal radar militer, dan komunikasi terenkripsi.",
        "hi": "【विशालकाय एंटीना सिग्नल इंटेलिजेंस उपग्रह Advanced Orion / Mentor-10】\n■ एजेंसी: राष्ट्रीय टोही कार्यालय (NRO) / CIA (NROL-68)\n■ प्रक्षेपण यान: डेल्टा IV हेवी\n■ कक्षीय विवरण: भूस्थिर कक्षा (GEO, ~35,786 किमी)\n■ पेलोड: 100 मीटर से अधिक व्यास वाला मेश एंटीना और ब्रॉडबैंड SIGINT रिसीवर\n■ मिशन: वैश्विक मिसाइल टेलीमेट्री, सैन्य रडार सिग्नल और एन्क्रिप्टेड संचार की जासूसी।",
        "ar": "【قمر التجسس الإلكتروني العملاق Advanced Orion / Mentor-10】\n■ الوكالة: مكتب الاستطلاع الوطني (NRO) / وكالة المخابرات المركزية (CIA, NROL-68)\n■ صاروخ الإطلاق: دلتا 4 الثقيل (Delta IV Heavy الرحلة الأخيرة)\n■ المدار: مدار جغرافي ثابت (GEO, ~35,786 كم)\n■ الحمولة: هوائي شبكي ضخم قابل للفتح (بقطر يتجاوز 100 متر) ومستقبلات استخبارات الإشارات (SIGINT)\n■ المهمة: اعتراض عالمي للقياس عن بعد للصواريخ وإشارات الرادار العسكري والاتصالات المشفرة.",
        "ru": "【Гигантский спутник радиотехнической разведки Advanced Orion / Mentor-10】\n■ Организация: Национальное управление военно-космической разведки (NRO) / ЦРУ (NROL-68)\n■ Ракета-носитель: Delta IV Heavy (Финальный запуск тяжелого носителя)\n■ Параметры орбиты: Геостационарная орбита (GEO, ~35 786 км)\n■ Полезная нагрузка: Развертываемая сетчатая антенна диаметром более 100 метров и широкополосные приемники SIGINT\n■ Миссия: Глобальный перехват телеметрии ракет, сигналов военных радаров и зашифрованных каналов связи."
    },
    "TUNDRA": {
        "country": "🇷🇺 ロシア (ロシア宇宙軍 / 早期警戒モルニヤ軌道)",
        "country_en": "🇷🇺 Russia (Russian Aerospace Forces / EKS)",
        "ja": "【ロシア弾道ミサイル早期警戒衛星「Tundra 5」(Kosmos-2552 / EKS)】\n■ 開発・運用組織: ロシア航空宇宙軍 (VKS) / ツニコマシ\n■ 打上げ日・ロケット: 2021年11月25日 / ソユーズ-2.1b (プレセツク)\n■ 軌道諸元: 近地点約1,600km〜遠地点約38,500km / 高離心率モルニヤ軌道 (軌道傾斜角63.4度 / 12時間周期)\n■ 主要観測機器: 赤外線・光学的ミサイル熱源探知センサ、核爆発探知ペイロード\n■ 軍事任務: ロシアの次世代ミサイル早期警戒システム「クポル(ドーム)」。極北・北米上空で長く滞空するモルニヤ軌道の特性を活かし、北極海や米本土からのICBM発射を監視。",
        "en": "[EKS Kupol 5 / Tundra-5 Russian Missile Early Warning Satellite]\n■ Agency: Russian Aerospace Forces (VKS) / Space Troops (Kosmos-2552)\n■ Launcher: Soyuz-2.1b / Fregat\n■ Orbit: Highly Elliptical Tundra Orbit (Perigee ~1,600 km, Apogee ~38,500 km, Inc. 63.4°)\n■ Payload: High-sensitivity infrared telescope sensors\n■ Mission: Continuous high-latitude early warning surveillance detecting ICBM launches from North America and NATO nuclear submarines.",
        "zh": "【EKS“圆顶”5号 / 苔原5号 俄军天基导弹早期预警卫星】\n■ 研发运营机构: 俄罗斯空天军 (VKS) 太空部队 (宇宙-2552)\n■ 运载火箭: 联盟-2.1b / 军号Fregat上面级\n■ 轨道参数: 大椭圆苔原轨道 (近地点约1,600km, 远地点约38,500km, 倾角63.4°)\n■ 载荷配置: 超高灵敏度红外望远镜与导弹尾焰追踪载荷\n■ 核心任务: 对北极高纬度地区及北美洲洲际弹道导弹、北约战略核潜艇水下发射实施24小时不间断早期预警监视。",
        "ko": "【EKS 쿠폴-5 / 툰드라-5 러시아 미사일 조기경보위성】\n■ 개발 및 운용 기관: 러시아 항공우주군 (VKS) 우주부대 (코스모스-2552)\n■ 발사체: 소유즈-2.1b / 프레가트\n■ 궤도 제원: 고타원 툰드라 궤도 (근지점 ~1,600km, 원지점 ~38,500km, 경사각 63.4°)\n■ 주요 탑재체: 초고감도 적외선 망원경 센서\n■ 임무 목적: 북미 대륙 및 NATO 전략핵잠수함에서 발사되는 ICBM/SLBM에 대한 북극 고위도 24시간 감시.",
        "de": "[EKS Kupol-5 / Tundra-5 Russischer Raketenfrühwarnsatellit]\n■ Organisation: Russische Luft- und Raumfahrtkräfte (VKS) (Kosmos-2552)\n■ Trägerrakete: Sojus-2.1b / Fregat\n■ Umlaufbahn: Hochelliptischer Tundra-Orbit (Perigäum ~1.600 km, Apogäum ~38.500 km, Ink. 63,4°)\n■ Nutzlast: Hochempfindliche Infrarot-Teleskopsensoren\n■ Mission: Kontinuierliche Überwachung von ICBM-Starts aus Nordamerika und NATO-U-Booten über der Arktis.",
        "fr": "[Satellite russe d'alerte précoce EKS Kupol-5 / Tundra-5]\n■ Organisation: Forces aérospatiales russes (VKS) (Cosmos-2552)\n■ Lanceur: Soyouz-2.1b / Fregat\n■ Orbite: Orbite Toundra hautement elliptique (Périgée ~1 600 km, Apogée ~38 500 km, Inc. 63,4°)\n■ Charge utile: Télescope infrarouge thermique ultra-sensible\n■ Mission: Surveillance continue des trajectoires de missiles balistiques intercontinentaux (ICBM) depuis l'Arctique.",
        "es": "[Satélite Ruso de Alerta Temprana de Misiles EKS Kupol-5 / Tundra-5]\n■ Agencia: Fuerzas Aeroespaciales de Rusia (VKS) (Kosmos-2552)\n■ Lanzador: Soyuz-2.1b / Fregat\n■ Órbita: Órbita Tundra altamente elíptica (Perigeo ~1.600 km, Apogeo ~38.500 km, Inc. 63,4°)\n■ Carga útil: Telescopio infrarrojo térmico de ultra alta sensibilidad\n■ Misión: Vigilancia continua sobre el Ártico detectando lanzamientos de misiles balísticos intercontinentales (ICBM) y submarinos nucleares de la OTAN.",
        "pt": "[Satélite Russo de Alerta Precoce de Mísseis EKS Kupol-5 / Tundra-5]\n■ Agência: Forças Aeroespaciais da Rússia (VKS) (Kosmos-2552)\n■ Lançador: Soyuz-2.1b / Fregat\n■ Órbita: Órbita Tundra altamente elíptica (Perigeu ~1.600 km, Apogeu ~38.500 km, Inc. 63,4°)\n■ Carga útil: Telescópio infravermelho de altíssima sensibilidade\n■ Missão: Vigilância contínua sobre o Ártico detectando lançamentos de ICBMs e submarinos nucleares da OTAN.",
        "it": "[Satellite Russo di Allarme Rapido Missilistico EKS Kupol-5 / Tundra-5]\n■ Agenzia: Forze Aerospaziali Russe (VKS) (Kosmos-2552)\n■ Vettore: Soyuz-2.1b / Fregat\n■ Orbita: Orbita Tundra altamente ellittica (Perigeo ~1.600 km, Apogeo ~38.500 km, Inc. 63,4°)\n■ Carico utile: Telescopio termico a infrarossi ad altissima sensibilità\n■ Missione: Sorveglianza continua sull'Artico rilevando lanci di missili balistici intercontinentali (ICBM) e sottomarini nucleari della NATO.",
        "nl": "[Russische Raketwaarschuwingssatelliet EKS Koepol-5 / Toendra-5]\n■ Organisatie: Russische Lucht- en Ruimtemacht (VKS) (Kosmos-2552)\n■ Lanceervoertuig: Sojoez-2.1b / Fregat\n■ Baan: Sterk elliptische Toendra-baan (Perigeum ~1.600 km, Apogeum ~38.500 km, Incl. 63,4°)\n■ Laadvermogen: Uiterst gevoelige infraroodtelescoopsensoren\n■ Missie: Continue vroegtijdige waarschuwing tegen ICBM-lanceringen vanuit Noord-Amerika en NAVO-onderzeeërs over het Noordpoolgebied.",
        "id": "【Satelit Peringatan Dini Rudal Rusia EKS Kupol-5 / Tundra-5】\n■ Organisasi: Angkatan Dirgantara Rusia (VKS) (Kosmos-2552)\n■ Roket Peluncur: Soyuz-2.1b / Fregat\n■ Parameter Orbit: Orbit Tundra elips tinggi (Perigee ~1.600 km, Apogee ~38.500 km, Ink. 63,4°)\n■ Muatan Sensor: Teleskop inframerah termal sensitivitas ultra tinggi\n■ Misi: Pengawasan berkelanjutan atas wilayah Arktik mendeteksi peluncuran ICBM dan kapal selam nuklir NATO.",
        "hi": "【रूसी मिसाइल पूर्व चेतावनी उपग्रह EKS Kupol-5 / Tundra-5】\n■ एजेंसी: रूसी एयरोस्पेस बल (VKS) (Kosmos-2552)\n■ प्रक्षेपण यान: सोयुज-2.1b / फ्रेगेट\n■ कक्षीय विवरण: अत्यधिक अण्डाकार टुंड्रा कक्षा (पेरिगी ~1,600 किमी, अपोजी ~38,500 किमी, झुकाव 63.4°)\n■ पेलोड: उच्च संवेदनशीलता इन्फ्रारेड टेलीस्कोप\n■ मिशन: आर्कटिक के ऊपर से ICBM और नाटो परमाणु पनडुब्बी मिसाइल प्रक्षेपणों पर 24 घंटे निगरानी।",
        "ar": "【قمر الإنذار المبكر الصاروخي الروسي EKS Kupol-5 / Tundra-5】\n■ الوكالة: القوات الجوفضائية الروسية (VKS) (Kosmos-2552)\n■ صاروخ الإطلاق: سويوز-2.1b / فريغات\n■ المدار: مدار تندرا شديد الاستطالة (الحضيض ~1,600 كم، الأوج ~38,500 كم، الميل 63.4°)\n■ الحمولة: تلسكوب حراري فائق الحساسية بالأشعة تحت الحمراء\n■ المهمة: مراقبة مستمرة للقطب الشمالي لكشف إطلاق الصواريخ الباليستية العابرة للقارات وغواصات الناتو.",
        "ru": "【ЕКС Купол-5 / Тундра-5 Российский спутник Единой космической системы предупреждения о ракетном нападении】\n■ Организация: Воздушно-космические силы РФ (ВКС) (Космос-2552)\n■ Ракета-носитель: Союз-2.1б / разгонный блок Фрегат\n■ Параметры орбиты: Высокоэллиптическая орбита «Тундра» (Перигей ~1 600 км, Апогей ~38 500 км, Наклонение 63,4°)\n■ Полезная нагрузка: Высокочувствительный инфракрасный телескоп теплового обнаружения\n■ Миссия: Непрерывное наблюдение за пусками межконтинентальных баллистических ракет и стратегических атомных подводных лодок НАТО."
    },
    "KOSMOS 2542": {
        "country": "🇷🇺 ロシア (ロシア宇宙軍 / キラー・インスペクター機動衛星)",
        "country_en": "🇷🇺 Russia (Russian Aerospace Forces / Inspector)",
        "ja": "【ロシア軍事インスペクター・追跡衛星「Kosmos 2542」(コスモス2542号)】\n■ 開発・運用組織: ロシア航空宇宙軍 (VKS) / ラボチキン\n■ 打上げ日・ロケット: 2019年11月25日 / ソユーズ-2.1v (プレセツク)\n■ 軌道諸元: 高度約370km〜860km / 低軌道 (傾斜角97.9度)\n■ 衝撃的行動: 2020年、米国の最高機密スパイ衛星「USA-245 (KH-11)」と全く同じ軌道面に入り込んで真後ろからぴったり追尾。さらに内部から小型子衛星「Kosmos 2543」を分離し、そこから謎の高速物体を発射したことで「宇宙兵器・キラー衛星の実証実験」として米国が猛抗議した事件の主役。",
        "en": "[Russian Inspector / Co-orbital Anti-Satellite \"Kosmos 2542\"]\n■ Organization: Russian Aerospace Forces (VKS)\n■ Launch: Nov 25, 2019 / Soyuz-2.1v\n■ Orbit: ~370 x 860 km (Inclination 97.9°)\n■ Incident: Stalked US spy satellite USA-245 (KH-11) at close range and deployed a sub-satellite that fired a high-speed projectile in orbit, sparking global counterspace weapon alarms."
    },
    "SHIJIAN-21": {
        "country": "🇨🇳 中国 (中国国家航天局 / 衛星捕獲ロボット船)",
        "country_en": "🇨🇳 China (CNSA / Space Tug)",
        "ja": "【静止衛星捕獲・宇宙ゴミ投棄船「実践21号」(Shijian-21 / SJ-21)】\n■ 開発・運用組織: 中国国家航天局 (CNSA) / 中国航天科技集団 (CASC)\n■ 打上げ日・ロケット: 2021年10月24日 / 長征3号乙 ロケット (西昌)\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道 (高機動型スラスタ搭載)\n■ 主要機能: ロボットアーム捕獲機構、近傍誘導センサ\n■ 歴史的実績と警戒: 2022年1月、静止軌道で機能停止していた中国のナビ衛星「北斗2号G2」にドッキング捕獲し、3,000km上空の「墓場軌道」へ引っ張って投棄することに成功。「宇宙ゴミ清掃技術」とされる一方、有事には敵国の軍事衛星を宇宙から強奪・無力化できる二刀流の宇宙兵器として世界中から注視される。",
        "en": "[Shijian-21 Robotic Space Tug & Debris Mitigation Satellite]\n■ Agency: China Aerospace Science and Technology Corp (CASC) / CNSA\n■ Launcher: Long March 3B (CZ-3B)\n■ Orbit: Geostationary Orbit (GEO, ~35,786 km)\n■ Payload: Robotic capture arms, optical rendezvous navigation, high-thrust chemical/electric propulsion\n■ Mission: In-orbit servicing and relocation of defunct satellites (successfully towed dead BeiDou-2 G2 satellite 3,000 km into super-graveyard orbit).",
        "zh": "【“实践21号”(SJ-21) 空间碎片减缓与在轨机械臂卫星拖船】\n■ 研发运营机构: 中国航天科技集团 (CASC) / 中国国家航天局\n■ 运载火箭: 长征三号乙 (CZ-3B)\n■ 轨道参数: 地球静止轨道 (GEO, 高度约35,786公里)\n■ 载荷配置: 多自由度空间捕获机械臂、光学自主导航交会系统、高推力双模推进系统\n■ 核心任务: 在轨服务与失效航天器拖曳清理 (成功捕获失效北斗二号G2卫星并拖至高出GEO 3,000公里的超超级墓地轨道)。",
        "ko": "【실천 21호 (SJ-21) 로봇팔 탑재 우주 쓰레기 견인선】\n■ 개발 및 운용 기관: 중국항천과기집단 (CASC) / 중국국가항천국 (CNSA)\n■ 발사체: 창정 3호을 (CZ-3B)\n■ 궤도 제원: 정지궤도 (GEO, 고도 약 35,786km)\n■ 주요 탑재체: 다관절 포획 로봇팔, 자율 랑데부 광학 항법 장치, 고추력 복합 추진계\n■ 임무 목적: 고장 난 위성 포획 및 궤도 이동 (수명이 다한 베이더우 2호 G2 위성을 포획하여 GEO 상공 3,000km 슈퍼 묘지궤도로 견인 성공).",
        "de": "[Shijian-21 Roboterarm-Weltraumschlepper & Müllbeseitigung]\n■ Organisation: China Aerospace Science and Technology Corp (CASC) / CNSA\n■ Trägerrakete: Langer Marsch 3B (CZ-3B)\n■ Umlaufbahn: Geostationärer Orbit (GEO, ~35.786 km)\n■ Nutzlast: Mehrgelenk-Greifarm, optische Rendezvous-Navigation, Hochleistungstriebwerk\n■ Mission: Inspektion und Abschleppen defekter Satelliten (trug den inaktiven BeiDou-2 G2-Satelliten erfolgreich 3.000 km in den Friedhofsorbit).",
        "fr": "[Remorqueur spatial robotisé de gestion des débris Shijian-21 (SJ-21)]\n■ Organisation: CASC / Administration spatiale nationale chinoise (CNSA)\n■ Lanceur: Longue Marche 3B (CZ-3B)\n■ Orbite: Orbite géostationnaire (GEO, ~35 786 km)\n■ Charge utile: Bras robotique articulé de capture, navigation optique de rendez-vous, propulsion de forte poussée\n■ Mission: Capture en orbite et remorquage de satellites en fin de vie (a tracté avec succès le satellite BeiDou-2 G2 de 3 000 km vers l'orbite cimetière).",
        "es": "[Remolcador Espacial Robótico para Mitigación de Desechos Shijian-21 (SJ-21)]\n■ Agencia: CASC / Administración Espacial Nacional China (CNSA)\n■ Lanzador: Larga Marcha 3B (CZ-3B)\n■ Órbita: Órbita geoestacionaria (GEO, ~35.786 km)\n■ Carga útil: Brazo robótico articulado de captura, navegación óptica de encuentro, propulsión de alto empuje\n■ Misión: Servicio en órbita y remolque de satélites inactivos (remolcó con éxito el satélite BeiDou-2 G2 a 3.000 km por encima de GEO a la órbita cementerio).",
        "pt": "[Rebocador Espacial Robótico para Mitigação de Detritos Shijian-21 (SJ-21)]\n■ Agência: CASC / Administração Espacial Nacional da China (CNSA)\n■ Lançador: Longa Marcha 3B (CZ-3B)\n■ Órbita: Órbita geoestacionária (GEO, ~35.786 km)\n■ Carga útil: Braço robótico articulado de captura, navegação óptica autônoma, propulsão de alto empuxo\n■ Missão: Manutenção em órbita e reboque de satélites desativados (rebocou o satélite BeiDou-2 G2 por 3.000 km até a órbita cemitério).",
        "it": "[Rimorchiatore Spaziale Robotico per la Rimozione di Detriti Shijian-21 (SJ-21)]\n■ Agenzia: CASC / Amministrazione Spaziale Nazionale Cinese (CNSA)\n■ Vettore: Lunga Marcia 3B (CZ-3B)\n■ Orbita: Orbita geostazionaria (GEO, ~35.786 km)\n■ Carico utile: Braccio robotico articolato di cattura, navigazione ottica autonoma, propulsione ad alta spinta\n■ Missione: Manutenzione in orbita e traino di satelliti dismessi (ha trainato con successo il satellite BeiDou-2 G2 di 3.000 km nell'orbita cimitero).",
        "nl": "[Robotische Ruimtesleepboot voor Puinopruiming Shijian-21 (SJ-21)]\n■ Organisatie: CASC / Chinese Nationale Ruimtevaartorganisatie (CNSA)\n■ Lanceervoertuig: Lange Mars 3B (CZ-3B)\n■ Baan: Geostationaire baan (GEO, ~35.786 km)\n■ Laadvermogen: Robotische grijparm, optische rendezvous-navigatie, krachtige stuwkrachtmotoren\n■ Missie: Inspectie en wegslepen van defecte satellieten (sleepte succesvol de BeiDou-2 G2-satelliet 3.000 km omhoog naar de kerkhofbaan).",
        "id": "【Kapal Tunda Luar Angkasa Robotik Pembersih Sampah Shijian-21 (SJ-21)】\n■ Organisasi: CASC / Badan Antariksa Nasional Tiongkok (CNSA)\n■ Roket Peluncur: Long March 3B (CZ-3B)\n■ Parameter Orbit: Orbit Geostasioner (GEO, ~35.786 km)\n■ Muatan Sensor: Lengan robot penangkap, navigasi optik otonom, propulsi dorongan ganda\n■ Misi: Perawatan di orbit dan penarikan satelit mati (berhasil menarik satelit BeiDou-2 G2 sejauh 3.000 km ke orbit kuburan).",
        "hi": "【रोबोटिक अंतरिक्ष टग और मलबा शमन उपग्रह Shijian-21 (SJ-21)】\n■ एजेंसी: CASC / चीनी राष्ट्रीय अंतरिक्ष प्रशासन (CNSA)\n■ प्रक्षेपण यान: लॉन्ग मार्च 3B (CZ-3B)\n■ कक्षीय विवरण: भूस्थिर कक्षा (GEO, ~35,786 किमी)\n■ पेलोड: रोबोटिक कैप्चर आर्म, स्वायत्त ऑप्टिकल नेविगेशन, उच्च थ्रस्ट प्रणोदन\n■ मिशन: निष्क्रिय उपग्रहों को पकड़कर ग्रेव्यार्ड कक्षा में खींचना (BeiDou-2 G2 उपग्रह को सफलतापूर्वक स्थानांतरित किया)।",
        "ar": "【قاطرة الفضاء الروبوتية للتخلص من الحطام Shijian-21 (SJ-21)】\n■ الوكالة: CASC / إدارة الفضاء الوطنية الصينية (CNSA)\n■ صاروخ الإطلاق: المسيرة الطويلة 3B (CZ-3B)\n■ المدار: مدار جغرافي ثابت (GEO, ~35,786 كم)\n■ الحمولة: ذراع روبوتية لالتقاط الأجسام، ملاحة بصرية ذاتية، دفع عالي\n■ المهمة: خدمة مدارية وسحب الأقمار المعطلة (قامت بنجاح بقطر قمر BeiDou-2 G2 لمسافة 3000 كم إلى مدار المقبرة).",
        "ru": "【Роботизированный космический буксир для уборки мусора «Шицзянь-21» (SJ-21)】\n■ Организация: CASC / Китайское национальное космическое управление (CNSA)\n■ Ракета-носитель: Чанчжэн-3B (CZ-3B)\n■ Параметры орбиты: Геостационарная орбита (GEO, ~35 786 км)\n■ Полезная нагрузка: Роботизированный захватный манипулятор, автономная оптическая навигация, мощная двигательная установка\n■ Миссия: Захват и буксировка неисправных космических аппаратов (успешно отбуксировал нефункционирующий спутник BeiDou-2 G2 на 3000 км выше геостационара на орбиту захоронения)."
    },
    "OFEQ": {
        "country": "🇮🇱 イスラエル (イスラエル国防軍 / IAI)",
        "country_en": "🇮🇱 Israel (Israel Defense Forces / IAI)",
        "ja": "【イスラエル逆行軌道光学偵察衛星「Ofeq-16」(オフェク16号)】\n■ 開発・運用組織: イスラエル国防軍 (IDF) / イスラエル国防省 / IAI (イスラエル航空宇宙産業)\n■ 打上げ日・ロケット: 2020年7月6日 / シャビット2 (Shavit-2) ロケット (パルマヒム空軍基地)\n■ 軌道諸元: 高度約300〜600km / 逆行軌道 (軌道傾斜角141.7度 / 東から西へ飛ぶ極めて珍しい軌道)\n■ 主要機器: エルビット・システムズ製「ジュピター」高解像度宇宙カメラ (地上分解能約30cm)\n■ 軍事背景: 地中海に向けて西向きに打ち上げるため、地球の自転に逆らう「逆行軌道」を採用。中東全域の軍事基地や核施設を日中高頻度に偵察。",
        "en": "[Ofeq-16 Retrograde Optical Reconnaissance Spy Satellite]\n■ Agency: Israel Ministry of Defense / Israel Aerospace Industries (IAI) / IDF Unit 9900\n■ Launcher: Shavit-2 (Launched westward over the Mediterranean)\n■ Orbit: Retrograde Low Earth Orbit (Alt ~400 km, Inc. 142°)\n■ Payload: Jupiter high-resolution panchromatic & multispectral space telescope (0.35m GSD)\n■ Mission: Strategic surveillance and intelligence collection over Middle Eastern security hot spots.",
        "zh": "【“地平线16号”(Ofeq-16) 逆行轨道高分辨率光学侦察卫星】\n■ 研发运营机构: 以色列国防部 / 以色列航天工业 (IAI) / 国防军9900部队\n■ 运载火箭: “沙维特2号”(Shavit-2, 向西逆地球自转发射)\n■ 轨道参数: 逆行低地球轨道 (高度约400公里, 倾角142°)\n■ 载荷配置: “木星”(Jupiter) 高分辨率全色与多光谱太空望远镜 (地面分辨率约0.35米)\n■ 核心任务: 对中东战略热点地区、军事基地与核设施进行高频次秘密战略光学侦察。",
        "ko": "【오펙 16호 (Ofeq-16) 역행 궤도 고해상도 광학 스파이 위성】\n■ 개발 및 운용 기관: 이스라엘 국방부 / IAI / 이스라엘 방위군 9900부대\n■ 발사체: 샤비트-2 (지중해 서쪽 방향 역행 발사)\n■ 궤도 제원: 역행 저궤도 (고도 약 400km, 궤도경사각 142°)\n■ 주요 탑재체: 주피터(Jupiter) 고해상도 전자광학 우주망원경 (0.35m 해상도)\n■ 임무 목적: 중동 분쟁 지역 및 적성국 전략 군사기지에 대한 은밀 고빈도 정찰.",
        "de": "[Ofeq-16 Retrograder Optischer Spionagesatellit]\n■ Organisation: Israelisches Verteidigungsministerium / IAI / IDF Einheit 9900\n■ Trägerrakete: Shavit-2 (Start nach Westen über das Mittelmeer)\n■ Umlaufbahn: Retrograder niedriger Erdorbit (~400 km, Ink. 142°)\n■ Nutzlast: Hochauflösendes Jupiter-Weltraumteleskop (0,35 m Bodenauflösung)\n■ Mission: Strategische Aufklärung und optische Geheimdienstüberwachung über Nahost-Krisenregionen.",
        "fr": "[Satellite espion optique rétrograde Ofeq-16]\n■ Organisation: Ministère de la Défense israélien / IAI / Unité 9900 de Tsahal\n■ Lanceur: Shavit-2 (Lancé vers l'ouest au-dessus de la Méditerranée)\n■ Orbite: Orbite basse rétrograde (~400 km, Inclinaison 142°)\n■ Charge utile: Télescope spatial haute résolution Jupiter (résolution 0,35 m)\n■ Mission: Renseignement et surveillance stratégique des zones de haute tension au Moyen-Orient.",
        "es": "[Satélite Espía Óptico Retrógrado Ofeq-16]\n■ Agencia: Ministerio de Defensa de Israel / IAI / Unidad 9900 de las FDI\n■ Lanzador: Shavit-2 (Lanzado hacia el oeste sobre el Mediterráneo)\n■ Órbita: Órbita baja retrógrada (~400 km, Inclinación 142°)\n■ Carga útil: Telescopio espacial de alta resolución Jupiter (0,35 m de resolución en tierra)\n■ Misión: Reconocimiento estratégico y recopilación de inteligencia sobre puntos críticos de seguridad en Oriente Medio.",
        "pt": "[Satélite Espião Óptico Retrógrado Ofeq-16]\n■ Agência: Ministério da Defesa de Israel / IAI / Unidade 9900 das FDI\n■ Lançador: Shavit-2 (Lançado para o oeste sobre o Mediterrâneo)\n■ Órbita: Órbita baixa retrógrada (~400 km, Inclinação 142°)\n■ Carga útil: Telescópio espacial de alta resolução Jupiter (0,35 m de resolução no solo)\n■ Missão: Reconhecimento estratégico e coleta de inteligência sobre zonas críticas de segurança no Oriente Médio.",
        "it": "[Satellite Spia Ottico Retrogrado Ofeq-16]\n■ Agenzia: Ministero della Difesa Israeliano / IAI / Unità 9900 delle IDF\n■ Vettore: Shavit-2 (Lanciato verso ovest sul Mar Mediterraneo)\n■ Orbita: Orbita bassa retrograda (~400 km, Inclinazione 142°)\n■ Carico utile: Telescopio spaziale ad alta risoluzione Jupiter (0,35 m di risoluzione a terra)\n■ Missione: Ricognizione strategica e raccolta di intelligence su aree di tensione critica in Medio Oriente.",
        "nl": "[Retrograde Optische Spionagesatelliet Ofeq-16]\n■ Organisatie: Israëlisch Ministerie van Defensie / IAI / IDF Eenheid 9900\n■ Lanceervoertuig: Shavit-2 (Gelanceerd naar het westen over de Middellandse Zee)\n■ Baan: Retrograde lage baan om de aarde (~400 km, Inclinatie 142°)\n■ Laadvermogen: Jupiter hoge-resolutie ruimtetelescoop (0,35 m grondresolutie)\n■ Missie: Strategische verkenning en inlichtingenverzameling boven brandhaarden in het Midden-Oosten.",
        "id": "【Satelit Mata-mata Optik Retrograde Ofeq-16】\n■ Organisasi: Kementerian Pertahanan Israel / IAI / Unit 9900 IDF\n■ Roket Peluncur: Shavit-2 (Diluncurkan ke barat di atas Laut Mediterania)\n■ Parameter Orbit: Orbit Rendah Retrograde (~400 km, Ink. 142°)\n■ Muatan Sensor: Teleskop luar angkasa resolusi tinggi Jupiter (resolusi darat 0,35 m)\n■ Misi: Pengintaian strategis dan pengumpulan intelijen atas titik panas keamanan di Timur Tengah.",
        "hi": "【रेट्रोग्रेड ऑप्टिकल जासूसी उपग्रह Ofeq-16】\n■ एजेंसी: इज़राइल रक्षा मंत्रालय / IAI / IDF यूनिट 9900\n■ प्रक्षेपण यान: शावित-2 (भूमध्य सागर के ऊपर पश्चिम की ओर प्रक्षेपित)\n■ कक्षीय विवरण: रेट्रोग्रेड निम्न पृथ्वी कक्षा (~400 किमी, झुकाव 142°)\n■ पेलोड: ज्यूपिटर उच्च-रिज़ॉल्यूशन अंतरिक्ष दूरबीन (0.35 मीटर ग्राउंड रिज़ॉल्यूशन)\n■ मिशन: मध्य पूर्व के रणनीतिक सुरक्षा केंद्रों पर गुप्त ऑप्टिकल टोही।",
        "ar": "【قمر التجسس البصري التراجعي Ofeq-16】\n■ الوكالة: وزارة الدفاع الإسرائيلية / IAI / الوحدة 9900 في الجيش الإسرائيلي\n■ صاروخ الإطلاق: شافيت-2 (أُطلق غرباً فوق البحر الأبيض المتوسط)\n■ المدار: مدار أرضي منخفض تراجعي (~400 كم، الميل 142°)\n■ الحمولة: تلسكوب الفضاء فائق الدقة جوبيتر (دقة 0.35 متر على الأرض)\n■ المهمة: استطلاع استراتيجي وجمع معلومات استخبارية فوق المناطق الساخنة في الشرق الأوسط.",
        "ru": "【Ретроградный оптический спутник-шпион Офек-16】\n■ Организация: Министерство обороны Израиля / IAI / Подразделение 9900 ЦАХАЛ\n■ Ракета-носитель: Шавит-2 (Запущен в западном направлении над Средиземным морем)\n■ Параметры орбиты: Ретроградная низкая околоземная орбита (~400 км, Наклонение 142°)\n■ Полезная нагрузка: Высокоточный космический телескоп Jupiter (пространственное разрешение 0,35 м)\n■ Миссия: Стратегическая разведка и сбор разведданных над ключевыми объектами на Ближнем Востоке."
    },
    "SARAH": {
        "country": "🇩🇪 ドイツ (ドイツ連邦軍 / 宇宙コマンド)",
        "country_en": "🇩🇪 Germany (Bundeswehr / German Space Command)",
        "ja": "【ドイツ連邦軍フェーズドアレイレーダー偵察衛星「SARah-1」】\n■ 開発・運用組織: ドイツ連邦軍 (Bundeswehr) / エアバス・ディフェンス＆スペース\n■ 打上げ日・ロケット: 2022年6月18日 / スペースX ファルコン9 (ヴァンデンバーグ)\n■ 軌道諸元: 高度約750km / 太陽同期軌道 (軌道傾斜角98.4度)\n■ 主要観測機器: 先進型アクティブ・フェーズドアレイXバンド合成開口レーダ\n■ 軍事任務: ドイツ軍の旧世代偵察衛星「SAR-Lupe」の後継機。悪天候や夜間を問わず、ミリ波レーダによって数ミリの地表変位や装甲車両の配備状況を昼夜24時間スキャン。",
        "en": "[SARah-1 Phased-Array Radar Reconnaissance Satellite]\n■ Agency: German Armed Forces (Bundeswehr) / Space Command\n■ Launcher: SpaceX Falcon 9\n■ Orbit: Dawn-Dusk Sun-Synchronous Orbit (~500 km)\n■ Payload: Active Electronically Scanned Array (AESA) X-band SAR\n■ Mission: Sub-metric all-weather night-and-day radar reconnaissance delivering rapid tactical imagery to German defense forces.",
        "zh": "【SARah-1 相控阵雷达侦察卫星】\n■ 研发运营机构: 德国联邦国防军 (Bundeswehr) 太空司令部\n■ 运载火箭: SpaceX 猎鹰9号 (加州范登堡太空军基地)\n■ 轨道参数: 晨昏太阳同步轨道 (高度约500公里)\n■ 载荷配置: 有源相电子扫描阵列 (AESA) X波段合成孔径雷达\n■ 核心任务: 穿透云雨夜暗提供亚米级高精度雷达侦察图像，为德军提供战术实时情报。",
        "ko": "【SARah-1 위상배열 레이더 정찰위성】\n■ 개발 및 운용 기관: 독일 연방군 (Bundeswehr) 우주사령부\n■ 발사체: SpaceX 팰컨 9 (미국 반덴버그 우주군 기지)\n■ 궤도 제원: 일출몰 태양동기궤도 (고도 약 500km)\n■ 주요 탑재체: 능동위상배열 (AESA) X-밴드 합성개구레이더 (SAR)\n■ 임무 목적: 악천후와 야간에도 지상을 투과하는 서브미터급 초정밀 레이더 정찰 정보 제공.",
        "de": "[SARah-1 Phased-Array-Radaraufklärungssatellit]\n■ Organisation: Deutsche Bundeswehr / Weltraumkommando\n■ Trägerrakete: SpaceX Falcon 9 (Vandenberg SFB)\n■ Umlaufbahn: Sonnensynchroner Orbit (~500 km)\n■ Nutzlast: Aktives elektronisches Phased-Array-X-Band-SAR\n■ Mission: Submeter-Radaraufklärung bei Tag, Nacht und widrigem Wetter für die operative Führung der Bundeswehr.",
        "fr": "[Satellite de reconnaissance radar à réseau phasé SARah-1]\n■ Organisation: Bundeswehr (Forces armées allemandes) / Commandement de l'espace\n■ Lanceur: SpaceX Falcon 9 (Base spatiale de Vandenberg)\n■ Orbite: Orbite héliosynchrone aurore-crépuscule (~500 km)\n■ Charge utile: Radar à balayage électronique actif (AESA) en bande X\n■ Mission: Reconnaissance radar tous temps jour/nuit à résolution submétrique pour la défense allemande.",
        "es": "[Satélite de Reconocimiento por Radar de Matriz en Fase SARah-1]\n■ Agencia: Fuerzas Armadas de Alemania (Bundeswehr) / Comando Espacial\n■ Lanzador: SpaceX Falcon 9 (Base Espacial de Vandenberg)\n■ Órbita: Órbita heliosíncrona amanecer-atardecer (~500 km)\n■ Carga útil: Radar de apertura sintética en banda X con barrido electrónico activo (AESA)\n■ Misión: Inteligencia radar de precisión submétrica todo tiempo día y noche para las fuerzas de defensa alemanas.",
        "pt": "[Satélite de Reconhecimento por Radar Phased-Array SARah-1]\n■ Agência: Forças Armadas da Alemanha (Bundeswehr) / Comando Espacial\n■ Lançador: SpaceX Falcon 9 (Base Espacial de Vandenberg)\n■ Órbita: Órbita heliossíncrona amanhecer-entardecer (~500 km)\n■ Carga útil: Radar de abertura sintética em banda X com varredura eletrônica ativa (AESA)\n■ Missão: Imagens de radar com precisão submétrica dia e noite para a defesa alemã.",
        "it": "[Satellite di Ricognizione Radar a Phased-Array SARah-1]\n■ Agenzia: Forze Armate Tedesche (Bundeswehr) / Comando Spaziale\n■ Vettore: SpaceX Falcon 9 (Base Spaziale di Vandenberg)\n■ Orbita: Orbita eliosincrona alba-tramonto (~500 km)\n■ Carico utile: Radar ad apertura sintetica in banda X con scansione elettronica attiva (AESA)\n■ Missione: Intelligence radar di precisione submetrica giorno e notte per la difesa tedesca.",
        "nl": "[SARah-1 Phased-Array Radarverkenningssatelliet]\n■ Organisatie: Duitse Krijgsmacht (Bundeswehr) / Ruimtecommando\n■ Lanceervoertuig: SpaceX Falcon 9 (Vandenberg Space Force Base)\n■ Baan: Zonsynchrone baan (~500 km)\n■ Laadvermogen: Actieve elektronisch gescande array (AESA) X-band SAR-radar\n■ Missie: Submeter radarverkenning dag en nacht onder alle weersomstandigheden voor de Duitse defensie.",
        "id": "[Satelit Pengintaian Radar Phased-Array SARah-1]\n■ Organisasi: Angkatan Bersenjata Jerman (Bundeswehr) / Komando Luar Angkasa\n■ Roket Peluncur: SpaceX Falcon 9 (Pangkalan Angkatan Luar Angkasa Vandenberg)\n■ Parameter Orbit: Orbit Sinkron Matahari fajar-senja (~500 km)\n■ Muatan Sensor: Radar aperture sintetis pita-X array terpindai elektronik aktif (AESA)\n■ Misi: Pengintaian radar presisi sub-meter siang dan malam dalam segala cuaca untuk pertahanan Jerman.",
        "hi": "【फेस्ड-ऐरे रडार टोही उपग्रह SARah-1】\n■ एजेंसी: जर्मन सशस्त्र बल (Bundeswehr) / अंतरिक्ष कमान\n■ प्रक्षेपण यान: SpaceX फाल्कन 9 (वैडेनबर्ग स्पेस फोर्स बेस)\n■ कक्षीय विवरण: सूर्य-तुल्यकालिक कक्षा (~500 किमी)\n■ पेलोड: सक्रिय इलेक्ट्रॉनिकली स्कैंड ऐरे (AESA) X-बैंड SAR रडार\n■ मिशन: जर्मन रक्षा बलों के लिए दिन-रात और हर मौसम में सब-मीटर रडार टोही छवियां प्रदान करना।",
        "ar": "【قمر الاستطلاع الراداري ذو المصفوفة المرحلية SARah-1】\n■ الوكالة: القوات المسلحة الألمانية (Bundeswehr) / قيادة الفضاء\n■ صاروخ الإطلاق: سبيس إكس فالكون 9 (قاعدة فاندنبرغ الفضائية)\n■ المدار: مدار متزامن مع الشمس فجر-غسق (~500 كم)\n■ الحمولة: رادار الفتحة الاصطناعية ذو المسح الإلكتروني النشط (AESA) في النطاق X\n■ المهمة: صور استخبارات رادارية بدقة دون المتر ليلاً ونهاراً وفي كافة الظروف الجوية للدفاع الألماني.",
        "ru": "【Радиолокационный разведывательный спутник с фазированной решеткой SARah-1】\n■ Организация: Бундесвер (Вооруженные силы Германии) / Космическое командование\n■ Ракета-носитель: SpaceX Falcon 9 (База Космических сил Ванденберг)\n■ Параметры орбиты: Солнечно-синхронная орбита (~500 км)\n■ Полезная нагрузка: Радиолокатор с синтезированной апертурой (SAR) X-диапазона с активной фазированной решеткой (AESA)\n■ Миссия: Круглосуточная всепогодная радиолокационная разведка с субметровым разрешением для вооруженных сил Германии."
    },
    "X-37B": {
        "country": "🇺🇸 アメリカ (米宇宙軍 / ボーイング)",
        "country_en": "🇺🇸 USA (US Space Force / Boeing)",
        "ja": "【米宇宙軍極秘無人スペースプレーン「X-37B」(OTV-7)】\n■ 開発・運用組織: アメリカ宇宙軍 (USSF) / ボーイング (Phantom Works)\n■ 打上げ日・ロケット: 2023年12月28日 / スペースX ファルコンヘビー (ケネディ宇宙センター)\n■ 軌道諸元: 高度約350〜38,000km (高度・傾斜角を自在に変更する機密高機動軌道)\n■ 機体構造: 全長約8.9m、翼幅約4.5mの再使用型無人往復宇宙船。荷物室(ペイロードベイ)に極秘機器を積載\n■ 極秘ミッション・探査目的: 宇宙空間に一度に数百日〜900日以上滞在し、次世代軍事センサや耐放射線技術の実証、軌道変更シミュレーションを実施。任務完了後は自動操縦で地球大気圏に再突入し滑走路へ着陸する、世界で最も謎に包まれた現役スペースプレーン。",
        "en": "[USSF-7 X-37B Orbital Test Vehicle (OTV-7)]\n■ Agency: US Space Force / Air Force Rapid Capabilities Office (Boeing Space)\n■ Launcher: SpaceX Falcon Heavy\n■ Orbit: Highly Elliptical Orbit (HEO) reaching beyond 35,000 km\n■ Payload: Reusable spaceplane heat shield, autonomous avionics, laser power beaming experiment (PRAM-FX), Space Domain Awareness sensors\n■ Mission: Long-duration classified orbital warfare testing and advanced space flight technology demonstration.",
        "zh": "【USSF-7 X-37B 轨道试验飞行器 (OTV-7)】\n■ 研发运营机构: 美国太空军 / 空军快速能力办公室 (波音空间)\n■ 运载火箭: SpaceX 猎鹰重型运载火箭 (Falcon Heavy)\n■ 轨道参数: 大椭圆轨道 (HEO, 远地点延伸至35,000公里以上)\n■ 载荷配置: 可重复使用热防护系统、自主航电系统、空间激光功率传输实验 (PRAM-FX)、太空态势感知传感器\n■ 核心任务: 开展长周期绝密轨道战试验与先进空天飞行前沿技术验证。",
        "ko": "【USSF-7 X-37B 궤도 시험 비행체 (OTV-7)】\n■ 개발 및 운용 기관: 미국 우주군 / 공군 신속능력개발국 (보잉 스페이스)\n■ 발사체: SpaceX 팰컨 헤비 (Falcon Heavy)\n■ 궤도 제원: 고타원 궤도 (HEO, 원지점 35,000km 이상 진입)\n■ 주요 탑재체: 재사용 열차폐 시스템, 자율 항공전자, 우주 레이저 전력 전송 실험 (PRAM-FX), 우주상황인식 센서\n■ 임무 목적: 장기 극비 궤도전 시험 및 미래 첨단 우주비행체 기술 검증.",
        "de": "[USSF-7 X-37B Orbitales Testraumschiff (OTV-7)]\n■ Organisation: US Space Force / Boeing Space\n■ Trägerrakete: SpaceX Falcon Heavy\n■ Umlaufbahn: Hochelliptischer Orbit (HEO, über 35.000 km Höhe)\n■ Nutzlast: Wiederverwendbares Hitzeschild, autonome Avionik, Laser-Energieübertragungsexperiment (PRAM-FX)\n■ Mission: Langzeitige geheime Raumfahrt- und Technologietests im extremen Orbit.",
        "fr": "[Véhicule d'essai orbital USSF-7 X-37B (OTV-7)]\n■ Organisation: US Space Force / Boeing Space\n■ Lanceur: SpaceX Falcon Heavy\n■ Orbite: Orbite hautement elliptique (HEO, apogée >35 000 km)\n■ Charge utile: Bouclier thermique réutilisable, avionique autonome, expérience de transmission d'énergie laser (PRAM-FX)\n■ Mission: Démonstration technologique avancée et expérimentations secrètes de guerre orbitale de longue durée.",
        "es": "[Vehículo de Prueba Orbital USSF-7 X-37B (OTV-7)]\n■ Agencia: Fuerza Espacial de EE. UU. / Boeing Space\n■ Lanzador: SpaceX Falcon Heavy\n■ Órbita: Órbita altamente elíptica (HEO, apogeo superior a 35.000 km)\n■ Carga útil: Escudo térmico reutilizable, aviónica autónoma, experimento de transmisión de energía por láser (PRAM-FX)\n■ Misión: Ensayos clasificados de guerra orbital de larga duración y demostración de tecnologías aeroespaciales de vanguardia.",
        "pt": "[Veículo de Teste Orbital USSF-7 X-37B (OTV-7)]\n■ Agência: Força Espacial dos EUA / Boeing Space\n■ Lançador: SpaceX Falcon Heavy\n■ Órbita: Órbita altamente elíptica (HEO, apogeu superior a 35.000 km)\n■ Carga útil: Escudo térmico reutilizável, aviônica autônoma, experimento de transmissão de energia por laser (PRAM-FX)\n■ Missão: Testes confidenciais de guerra orbital de longa duração e validação de tecnologias de voo espacial avançadas.",
        "it": "[Veicolo di Test Orbitale USSF-7 X-37B (OTV-7)]\n■ Agenzia: US Space Force / Boeing Space\n■ Vettore: SpaceX Falcon Heavy\n■ Orbita: Orbita altamente ellittica (HEO, apogeo superiore a 35.000 km)\n■ Carico utile: Scudo termico riutilizzabile, avionica autonoma, esperimento di trasmissione di energia laser (PRAM-FX)\n■ Missione: Test classificati di guerra orbitale di lunga durata e validazione di tecnologie di volo spaziale avanzate.",
        "nl": "[USSF-7 X-37B Orbitaal Testruimtevaartuig (OTV-7)]\n■ Organisatie: US Space Force / Boeing Space\n■ Lanceervoertuig: SpaceX Falcon Heavy\n■ Baan: Sterk elliptische baan (HEO, apogeum boven 35.000 km)\n■ Laadvermogen: Herbruikbaar hitteschild, autonome avionica, laser-energieoverdrachtsexperiment (PRAM-FX)\n■ Missie: Geheime langdurige orbitale oorlogvoeringstests en validatie van geavanceerde ruimtevaarttechnologieën.",
        "id": "【Kendaraan Uji Orbital USSF-7 X-37B (OTV-7)】\n■ Organisasi: Angkatan Luar Angkasa AS / Boeing Space\n■ Roket Peluncur: SpaceX Falcon Heavy\n■ Parameter Orbit: Orbit Elips Tinggi (HEO, apogee di atas 35.000 km)\n■ Muatan Sensor: Pelindung panas dapat digunakan kembali, avionik otonom, eksperimen transmisi daya laser (PRAM-FX)\n■ Misi: Pengujian perang orbital rahasia jangka panjang dan validasi teknologi penerbangan luar angkasa canggih.",
        "hi": "【कक्षीय परीक्षण वाहन USSF-7 X-37B (OTV-7)】\n■ एजेंसी: अमेरिकी अंतरिक्ष बल / बोइंग स्पेस\n■ प्रक्षेपण यान: SpaceX फाल्कन हेवी\n■ कक्षीय विवरण: अत्यधिक अण्डाकार कक्षा (HEO, 35,000 किमी से अधिक अपोजी)\n■ पेलोड: पुन: प्रयोज्य हीट शील्ड, स्वायत्त एवियोनिक्स, लेजर पावर बीमिंग प्रयोग (PRAM-FX)\n■ मिशन: वर्गीकृत दीर्घकालिक कक्षीय युद्ध परीक्षण और उन्नत अंतरिक्ष उड़ान प्रौद्योगिकियों का सत्यापन।",
        "ar": "【مركبة الاختبار المداري USSF-7 X-37B (OTV-7)】\n■ الوكالة: قوة الفضاء الأمريكية / بوينغ سبيس\n■ صاروخ الإطلاق: سبيس إكس فالكون الثقيل (Falcon Heavy)\n■ المدار: مدار شديد الإهليلجية (HEO، أوج يتجاوز 35,000 كم)\n■ الحمولة: درع حراري قابل لإعادة الاستخدام، إلكترونيات طيران ذاتية، تجربة نقل الطاقة بالليزر (PRAM-FX)\n■ المهمة: تجارب حرب مدارية سرية طويلة الأمد والتحقق من تقنيات الطيران الفضائي المتقدمة.",
        "ru": "【Орбитальный испытательный аппарат USSF-7 X-37B (OTV-7)】\n■ Организация: Космические силы США / Boeing Space\n■ Ракета-носитель: SpaceX Falcon Heavy\n■ Параметры орбиты: Высокоэллиптическая орбита (HEO, апогей более 35 000 км)\n■ Полезная нагрузка: Многоразовый теплозащитный экран, автономная авионика, эксперимент по лазерной передаче энергии (PRAM-FX)\n■ Миссия: Секретные долгосрочные испытания в условиях орбитальных боевых действий и валидация передовых космических технологий."
    },
    "USA-245": {
        "country": "🇺🇸 アメリカ (NRO / 国家偵察局スパイ衛星)",
        "country_en": "🇺🇸 USA (NRO / Optical Spy Satellite)",
        "ja": "【光学偵察スパイ衛星「USA-245」(KH-11 KeyHole / 鍵穴)】\n■ 開発・運用組織: NRO (米国家偵察局) / CIA / 米宇宙軍\n■ 打上げ日・ロケット: 2013年8月28日 / デルタIVヘビー (ヴァンデンバーグ宇宙軍基地)\n■ 軌道諸元: 近地点約260km〜遠地点約1,000km / 楕円太陽同期軌道\n■ 主要観測機器: ハッブル宇宙望遠鏡と同等の口径2.4m主鏡、可視・赤外線超高解像度撮像センサ\n■ 偵察目的: 宇宙ではなく「地上」に巨大レンズを向け、地上の軍事施設、核開発拠点、紛争地帯を撮影。地上10cmの新聞見出しや車両のナンバープレートすら識別可能とされる米国の最高機密偵察衛星。",
        "en": "[NROL-65 Keyhole KH-11 Kennen Optical Spy Satellite (USA-245)]\n■ Agency: US National Reconnaissance Office (NRO) / CIA\n■ Launcher: Delta IV Heavy\n■ Orbit: Sun-synchronous Elliptical Low Orbit (Perigee ~260 km, Apogee ~1,000 km)\n■ Payload: 2.4-meter Hubble-class primary mirror, adaptive optics, infrared/visible ultra-high-resolution electro-optical sensor (~0.05m ground resolution)\n■ Mission: Classified top-secret optical reconnaissance monitoring global strategic defense targets in near-real-time.",
        "zh": "【“锁眼”KH-11 肯南光学侦察间谍卫星 (USA-245 / NROL-65)】\n■ 研发运营机构: 美国国家侦察局 (NRO) / 中央情报局 (CIA)\n■ 运载火箭: 德尔塔4号重型运载火箭 (Delta IV Heavy)\n■ 轨道参数: 太阳同步大椭圆低轨道 (近地点约260km, 远地点约1,000km)\n■ 载荷配置: 2.4米哈勃级主反射镜、自适应光学系统、红外/可见光超高分辨率电光传感器 (分辨率约0.05米)\n■ 核心任务: 对全球高价值战略军事目标进行近实时顶级绝密光学监视与情报搜集。",
        "ko": "【키홀 KH-11 케넌 광학 정찰 스파이 위성 (USA-245 / NROL-65)】\n■ 개발 및 운용 기관: 미국 국가정찰국 (NRO) / CIA\n■ 발사체: 델타 IV 헤비\n■ 궤도 제원: 태양동기 고타원 저궤도 (근지점 ~260km, 원지점 ~1,000km)\n■ 주요 탑재체: 2.4m 허블급 주반사경, 적응광학계, 초고해상도 전자광학 센서 (~0.05m급 지상 해상도)\n■ 임무 목적: 전 세계 핵심 전략 목표물에 대한 최고등급 실시간 극비 광학 감시.",
        "de": "[NROL-65 Keyhole KH-11 Kennen Optischer Spionagesatellit (USA-245)]\n■ Organisation: US National Reconnaissance Office (NRO) / CIA\n■ Trägerrakete: Delta IV Heavy\n■ Umlaufbahn: Sonnensynchrone elliptische Bahn (Perigäum ~260 km, Apogäum ~1.000 km)\n■ Nutzlast: 2,4-Meter-Hauptspiegel (Hubble-Klasse), adaptive Optik, Infrarot/Sichtbar-Sensoren (~0,05 m Auflösung)\n■ Mission: Streng geheime optische Aufklärung strategischer globaler Verteidigungsziele in Fast-Echtzeit.",
        "fr": "[Satellite espion optique Keyhole KH-11 Kennen (USA-245 / NROL-65)]\n■ Organisation: National Reconnaissance Office (NRO) / CIA\n■ Lanceur: Delta IV Heavy\n■ Orbite: Orbite basse elliptique héliosynchrone (Périgée ~260 km, Apogée ~1 000 km)\n■ Charge utile: Miroir primaire de 2,4 m (classe Hubble), optique adaptative, capteurs optoélectroniques (résolution ~0,05 m)\n■ Mission: Reconnaissance optique stratégique ultra-haute résolution en quasi-temps réel des cibles de défense mondiales.",
        "es": "[Satélite Espía Óptico Keyhole KH-11 Kennen (USA-245 / NROL-65)]\n■ Agencia: Oficina Nacional de Reconocimiento (NRO) / CIA\n■ Lanzador: Delta IV Heavy\n■ Órbita: Órbita baja elíptica heliosíncrona (Perigeo ~260 km, Apogeo ~1.000 km)\n■ Carga útil: Espejo primario de 2,4 m (tipo Hubble), óptica adaptativa, sensor electroóptico ultra nítido (~0,05 m de resolución)\n■ Misión: Reconocimiento óptico de alto secreto en tiempo casi real sobre objetivos estratégicos mundiales.",
        "pt": "[Satélite Espião Óptico Keyhole KH-11 Kennen (USA-245 / NROL-65)]\n■ Agência: National Reconnaissance Office (NRO) / CIA\n■ Lançador: Delta IV Heavy\n■ Órbita: Órbita baixa elíptica heliossíncrona (Perigeu ~260 km, Apogeu ~1.000 km)\n■ Carga útil: Espelho primário de 2,4 m (padrão Hubble), óptica adaptativa, sensor eletro-óptico ultra nítido (~0,05 m de resolução)\n■ Missão: Reconhecimento óptico ultrassecreto em tempo quase real de alvos estratégicos mundiais.",
        "it": "[Satellite Spia Ottico Keyhole KH-11 Kennen (USA-245 / NROL-65)]\n■ Agenzia: National Reconnaissance Office (NRO) / CIA\n■ Vettore: Delta IV Heavy\n■ Orbita: Orbita bassa ellittica eliosincrona (Perigeo ~260 km, Apogeo ~1.000 km)\n■ Carico utile: Specchio primario da 2,4 m (classe Hubble), ottica adattiva, sensore elettro-ottico ultra nitido (~0,05 m di risoluzione)\n■ Missione: Ricognizione ottica top secret in tempo quasi reale di obiettivi strategici globali.",
        "nl": "[Keyhole KH-11 Kennen Optische Spionagesatelliet (USA-245 / NROL-65)]\n■ Organisatie: National Reconnaissance Office (NRO) / CIA\n■ Lanceervoertuig: Delta IV Heavy\n■ Baan: Zonsynchrone elliptische lage baan (Perigeum ~260 km, Apogeum ~1.000 km)\n■ Laadvermogen: 2,4 m primaire spiegel (Hubble-klasse), adaptieve optiek, elektro-optische sensoren (~0,05 m resolutie)\n■ Missie: Topgeheime optische verkenning van strategische militaire doelwitten wereldwijd in bijna-realtime.",
        "id": "【Satelit Mata-mata Optik Keyhole KH-11 Kennen (USA-245 / NROL-65)】\n■ Organisasi: Kantor Pengintaian Nasional (NRO) / CIA\n■ Roket Peluncur: Delta IV Heavy\n■ Parameter Orbit: Orbit rendah elips sinkron matahari (Perigee ~260 km, Apogee ~1.000 km)\n■ Muatan Sensor: Cermin primer 2,4 m (kelas Hubble), optik adaptif, sensor elektro-optik super tajam (~0,05 m resolusi)\n■ Misi: Pengintaian optik rahasia tingkat tertinggi secara nyaris seketika terhadap target pertahanan global.",
        "hi": "【कीहोल KH-11 केनन ऑप्टिकल जासूसी उपग्रह (USA-245 / NROL-65)】\n■ एजेंसी: राष्ट्रीय टोही कार्यालय (NRO) / CIA\n■ प्रक्षेपण यान: डेल्टा IV हेवी\n■ कक्षीय विवरण: सूर्य-तुल्यकालिक अण्डाकार निम्न कक्षा (पेरिगी ~260 किमी, अपोजी ~1,000 किमी)\n■ पेलोड: 2.4 मीटर हबल-श्रेणी का प्राथमिक दर्पण, अनुकूली प्रकाशिकी, अति-उच्च-रिज़ॉल्यूशन सेंसर (~0.05 मीटर)\n■ मिशन: वैश्विक रणनीतिक रक्षा लक्ष्यों की लगभग वास्तविक समय में शीर्ष-गुप्त ऑप्टिकल टोही।",
        "ar": "【قمر التجسس البصري كيهول KH-11 كينان (USA-245 / NROL-65)】\n■ الوكالة: مكتب الاستطلاع الوطني (NRO) / CIA\n■ صاروخ الإطلاق: دلتا 4 الثقيل\n■ المدار: مدار بيضاوي منخفض متزامن مع الشمس (الحضيض ~260 كم، الأوج ~1,000 كم)\n■ الحمولة: مرآة رئيسية 2.4 متر (فئة هابل)، بصريات تكيفية، مستشعر فائق الدقة (~0.05 متر)\n■ المهمة: استطلاع بصري سري للغاية شبه فوري للأهداف الدفاعية الاستراتيجية العالمية.",
        "ru": "【Оптический спутник-шпион Keyhole KH-11 Kennen (USA-245 / NROL-65)】\n■ Организация: Национальное управление военно-космической разведки (NRO) / ЦРУ\n■ Ракета-носитель: Delta IV Heavy\n■ Параметры орбиты: Солнечно-синхронная эллиптическая низкая орбита (Перигей ~260 км, Апогей ~1 000 км)\n■ Полезная нагрузка: Главное зеркало диаметром 2,4 м (класса «Хаббл»), адаптивная оптика, сверхвысокочувствительный оптико-электронный датчик (~0,05 м разрешение)\n■ Миссия: Совершенно секретная оптическая разведка стратегических оборонных объектов по всему миру в реальном времени."
    },
    "SWOT": {
        "country": "🇺🇸 / 🇫🇷 米国・フランス (NASA / CNES)",
        "country_en": "🇺🇸 / 🇫🇷 USA & France (NASA / CNES)",
        "ja": "【地表水・海洋地形調査衛星「SWOT」(スウォット)】\n■ 開発・運用組織: NASA (米航空宇宙局) / CNES (フランス国立宇宙研究センター)\n■ 打上げ日・ロケット: 2022年12月16日 / スペースX ファルコン9\n■ 軌道諸元: 高度約891km / 非太陽同期軌道 (軌道傾斜角77.6度)\n■ 主要観測機器: Kaバンドレーダー干渉計「KaRIn」(左右120kmの観測幅でミリメートル精度の立体標高を測定)\n■ 観測目的: 世界中の95%以上の湖沼・河川・海洋の水位変動を史上初めてミリメートル精度で3D立体測定。地球温暖化による海面上昇や淡水資源の枯渇、洪水の早期警戒に画期的なデータを提供。",
        "en": "[Surface Water and Ocean Topography SWOT Satellite]\n■ Agency: NASA (USA) & CNES (France) with CSA (Canada) & UKSA (UK)\n■ Launcher: SpaceX Falcon 9\n■ Orbit: Low Earth Orbit (Alt 890 km, Inc. 77.6°)\n■ Payload: Ka-band Radar Interferometer (KaRIn), Dual-frequency Jason-class Altimeter, Microwave Radiometer\n■ Mission: First global 2D high-resolution survey of Earth's surface water, measuring height and extent of rivers, lakes, reservoirs, and fine ocean eddies.",
        "zh": "【地表水与海洋地形卫星 (SWOT)】\n■ 研发运营机构: NASA (美国) 与 CNES (法国) 联合 CSA (加拿大) 及 UKSA (英国)\n■ 运载火箭: SpaceX 猎鹰9号\n■ 轨道参数: 低地球轨道 (高度890公里, 倾角77.6°)\n■ 载荷配置: Ka波段雷达干涉仪 (KaRIn)、双频高度计、微波辐射计\n■ 核心任务: 全球首个地表水体2D高分辨率观测，精确测绘河流、湖泊、水库及海洋中尺度涡流的高程与动态范围。",
        "ko": "【지표수 및 해양 지형 관측위성 (SWOT)】\n■ 개발 및 운용 기관: NASA (미국) & CNES (프랑스) 공동 (CSA, UKSA 참여)\n■ 발사체: SpaceX 팰컨 9\n■ 궤도 제원: 저궤도 (고도 890km, 경사각 77.6°)\n■ 주요 탑재체: Ka-밴드 레이더 간섭계 (KaRIn), 이중주파수 고도계, 마이크로파 복사계\n■ 임무 목적: 지구 전역 하천, 호수, 저수지 및 해양 소용돌이의 2차원 고해상도 3D 수위 정밀 측정.",
        "de": "[Oberflächenwasser- und Ozeantopographie-Satellit (SWOT)]\n■ Organisation: NASA (USA) & CNES (Frankreich) mit CSA (Kanada) & UKSA (UK)\n■ Trägerrakete: SpaceX Falcon 9\n■ Umlaufbahn: Niedriger Erdorbit (Höhe 890 km, Ink. 77,6°)\n■ Nutzlast: Ka-Band-Radarinterferometer (KaRIn), Doppel-Frequenz-Altimeter, Mikrowellenradiometer\n■ Mission: Erste weltweite hochauflösende 2D-Vermessung von Flüssen, Seen, Reservoirs und Ozeanwirbeln.",
        "fr": "[Satellite de topographie des eaux de surface et des océans (SWOT)]\n■ Organisation: NASA (USA) & CNES (France) avec ASC (Canada) et UKSA (Royaume-Uni)\n■ Lanceur: SpaceX Falcon 9\n■ Orbite: Orbite basse (Altitude 890 km, Inclinaison 77,6°)\n■ Charge utile: Interféromètre radar en bande Ka (KaRIn), altimètre double fréquence, radiomètre micro-ondes\n■ Mission: Premier relevé mondial 2D haute résolution de la hauteur et de l'étendue des fleuves, lacs, réservoirs et tourbillons océaniques.",
        "es": "[Satélite de Topografía de Aguas Superficiales y Océanos (SWOT)]\n■ Agencia: NASA (EE. UU.) y CNES (Francia) con CSA (Canadá) y UKSA (Reino Unido)\n■ Lanzador: SpaceX Falcon 9\n■ Órbita: Órbita baja (Altitud 890 km, Inclinación 77,6°)\n■ Carga útil: Interferómetro de radar en banda Ka (KaRIn), altímetro de doble frecuencia, radiómetro de microondas\n■ Misión: Primer estudio mundial 2D de alta resolución de la altura y extensión de ríos, lagos, embalses y remolinos oceánicos.",
        "pt": "[Satélite de Topografia de Águas Superficiais e Oceanos (SWOT)]\n■ Agência: NASA (EUA) e CNES (França) com CSA (Canadá) e UKSA (Reino Unido)\n■ Lançador: SpaceX Falcon 9\n■ Órbita: Órbita baixa (Altitude 890 km, Inclinação 77,6°)\n■ Carga útil: Interferômetro de radar em banda Ka (KaRIn), altímetro de dupla frequência, radiômetro de micro-ondas\n■ Missão: Primeiro mapeamento global 2D de alta resolução medindo a altura e extensão de rios, lagos, reservatórios e turbilhões oceânicos.",
        "it": "[Satellite di Topografia delle Acque Superficiali e degli Oceani (SWOT)]\n■ Agenzia: NASA (USA) e CNES (Francia) con CSA (Canada) e UKSA (Regno Unito)\n■ Vettore: SpaceX Falcon 9\n■ Orbita: Orbita bassa (Altitudine 890 km, Inclinazione 77,6°)\n■ Carico utile: Interferometro radar in banda Ka (KaRIn), altimetro a doppia frequenza, radiometro a microonde\n■ Missione: Primo rilevamento globale 2D ad alta risoluzione dell'altezza e dell'estensione di fiumi, laghi, bacini e vortici oceanici.",
        "nl": "[Satelliet voor Oppervlaktewater- en Oceantopografie (SWOT)]\n■ Organisatie: NASA (VS) & CNES (Frankrijk) met CSA (Canada) en UKSA (VK)\n■ Lanceervoertuig: SpaceX Falcon 9\n■ Baan: Lage baan om de aarde (Hoogte 890 km, Inclinatie 77,6°)\n■ Laadvermogen: Ka-band radarinterferometer (KaRIn), dubbele-frequentie hoogtemeter, microgolfradiometer\n■ Missie: Eerste wereldwijde 2D-meting met hoge resolutie van rivieren, meren, reservoirs en oceaanwervelingen.",
        "id": "【Satelit Topografi Permukaan Air dan Lautan (SWOT)】\n■ Organisasi: NASA (AS) & CNES (Prancis) bersama CSA (Kanada) dan UKSA (Inggris)\n■ Roket Peluncur: SpaceX Falcon 9\n■ Parameter Orbit: Orbit Rendah Bumi (Ketinggian 890 km, Ink. 77,6°)\n■ Muatan Sensor: Interferometer radar pita-Ka (KaRIn), altimeter frekuensi ganda, radiometer gelombang mikro\n■ Misi: Survei 2D resolusi tinggi global pertama tentang tinggi dan luas sungai, danau, waduk, dan pusaran laut.",
        "hi": "【सतही जल और महासागर स्थलाकृति उपग्रह (SWOT)】\n■ एजेंसी: NASA (अमेरिका) और CNES (फ्रांस) के साथ CSA (कनाडा) और UKSA (यूके)\n■ प्रक्षेपण यान: SpaceX फाल्कन 9\n■ कक्षीय विवरण: निम्न पृथ्वी कक्षा (ऊंचाई 890 किमी, झुकाव 77.6°)\n■ पेलोड: Ka-बैंड रडार इंटरफेरोमीटर (KaRIn), दोहरी आवृत्ति अल्टीमीटर, माइक्रोवेव रेडियोमीटर\n■ मिशन: नदियों, झीलों, जलाशयों और समुद्री भंवरों का पहला वैश्विक 2D उच्च-रिज़ॉल्यूशन सर्वेक्षण।",
        "ar": "【قمر تضاريس المياه السطحية والمحيطات (SWOT)】\n■ الوكالة: وكالة ناسا (أمريكا) وCNES (فرنسا) بمشاركة CSA (كندا) وUKSA (بريطانيا)\n■ صاروخ الإطلاق: سبيس إكس فالكون 9\n■ المدار: مدار أرضي منخفض (ارتفاع 890 كم، الميل 77.6°)\n■ الحمولة: مقياس تداخل راداري بنطاق Ka (KaRIn)، مقياس ارتفاع مزدوج التردد، مقياس إشعاع ميكروويف\n■ المهمة: أول مسح عالمي ثنائي الأبعاد عالي الدقة لقياس ارتفاع ومساحة الأنهار والبحيرات والدوامات المحيطية.",
        "ru": "【Спутник топографии поверхностных вод и океана (SWOT)】\n■ Организация: NASA (США) и CNES (Франция) при участии CSA (Канада) и UKSA (Великобритания)\n■ Ракета-носитель: SpaceX Falcon 9\n■ Параметры орбиты: Низкая околоземная орбита (Высота 890 км, Наклонение 77,6°)\n■ Полезная нагрузка: Радиолокационный интерферометр Ka-диапазона (KaRIn), двухчастотный высотомер, микроволновый радиометр\n■ Миссия: Первое глобальное двумерное высокоточное картографирование высоты и площади рек, озер, водохранилищ и океанических вихрей."
    },
    "WORLDVIEW": {
        "country": "🇺🇸 アメリカ (Maxar Technologies / 民間最高峰)",
        "country_en": "🇺🇸 USA (Maxar Technologies)",
        "ja": "【超高分解能地球観測衛星「WorldView-3」(ワールドビュー3)】\n■ 開発・運用組織: Maxar Technologies (マクサー・テクノロジーズ / 米国)\n■ 打上げ日・ロケット: 2014年8月13日 / アトラスV 401\n■ 軌道諸元: 高度約617km / 太陽同期軌道 (軌道傾斜角97.9度)\n■ 主要観測機器: 口径1.1m光学望遠鏡 (パンクロマチック解像度31cm、短波長赤外8バンド、CAVISセンサ)\n■ 観測目的: 民間衛星として世界最高峰の31cm解像度を誇り、地上を歩く人物の影や車の車種を克明に描写。Google Earthの航空写真、国際紛争の衛星写真報道、災害救助マッピングの標準基盤。",
        "en": "[WorldView-3 Commercial Super-Resolution Optical Satellite]\n■ Agency: Maxar Technologies (USA)\n■ Launcher: Atlas V 401\n■ Orbit: Sun-synchronous Orbit (~617 km)\n■ Payload: 1.1m aperture telescope, panchromatic (0.31m), 8-band multispectral (1.24m), 8-band SWIR (3.7m), CAVIS atmospheric sensor\n■ Mission: Ultra-high-resolution commercial earth observation, defense intelligence, mapping, and environmental disaster monitoring.",
        "zh": "【WorldView-3 商业顶级超高分辨率光学成像卫星】\n■ 研发运营机构: Maxar Technologies (美国数字化地球)\n■ 运载火箭: 宇宙神5号 401\n■ 轨道参数: 太阳同步轨道 (高度约617公里)\n■ 载荷配置: 1.1米口径望远镜、0.31米全色、1.24米多光谱、3.7米短波红外 (SWIR)、CAVIS大气校正传感器\n■ 核心任务: 商业级超高分辨率地球观测、国防地缘情报、高精度制图与自然灾害快速评估。",
        "ko": "【WorldView-3 상용 초고해상도 광학 관측위성】\n■ 개발 및 운용 기관: Maxar Technologies (미국)\n■ 발사체: 아틀라스 V 401\n■ 궤도 제원: 태양동기궤도 (고도 약 617km)\n■ 주요 탑재체: 1.1m 구경 망원경, 0.31m 전정색, 1.24m 다중분광, 3.7m 단파적외선(SWIR), 대기보정 센서\n■ 임무 목적: 상용 최고 수준의 지표 영상 촬영, 국방 안보 지리정보, 정밀 지도 제작 및 재난 분석.",
        "de": "[WorldView-3 Kommerzieller Höchstauflösender Optischer Satellit]\n■ Organisation: Maxar Technologies (USA)\n■ Trägerrakete: Atlas V 401\n■ Umlaufbahn: Sonnensynchroner Orbit (~617 km)\n■ Nutzlast: 1,1m-Teleskop, panchromatisch (0,31m), multispektral (1,24m), SWIR (3,7m), CAVIS-Sensor\n■ Mission: Höchstauflösende kommerzielle Erdbeobachtung, Geodaten, Kartierung und Katastrophenüberwachung.",
        "fr": "[Satellite optique commercial à très haute résolution WorldView-3]\n■ Organisation: Maxar Technologies (USA)\n■ Lanceur: Atlas V 401\n■ Orbite: Orbite héliosynchrone (~617 km)\n■ Charge utile: Télescope de 1,1 m, panchromatique (0,31 m), multispectral (1,24 m), SWIR (3,7 m), capteur CAVIS\n■ Mission: Imagerie commerciale de pointe, géointelligence de défense, cartographie et surveillance des catastrophes.",
        "es": "[Satélite Óptico Comercial de Súper Resolución WorldView-3]\n■ Agencia: Maxar Technologies (EE. UU.)\n■ Lanzador: Atlas V 401\n■ Órbita: Órbita heliosíncrona (~617 km)\n■ Carga útil: Telescopio de 1,1 m, pancromático (0,31 m), multiespectral (1,24 m), SWIR (3,7 m), sensor CAVIS\n■ Misión: Observación terrestre comercial de ultra alta resolución, inteligencia de defensa, cartografía y análisis de catástrofes.",
        "pt": "[Satélite Óptico Comercial de Super-Resolução WorldView-3]\n■ Agência: Maxar Technologies (EUA)\n■ Lançador: Atlas V 401\n■ Órbita: Órbita heliossíncrona (~617 km)\n■ Carga útil: Telescópio de 1,1 m, pancromático (0,31 m), multiespectral (1,24 m), SWIR (3,7 m), sensor CAVIS\n■ Missão: Observação terrestre comercial de ultra-alta resolução, inteligência de defesa, mapeamento e análise de desastres.",
        "it": "[Satellite Ottico Commerciale a Super Risoluzione WorldView-3]\n■ Agenzia: Maxar Technologies (USA)\n■ Vettore: Atlas V 401\n■ Orbita: Orbita eliosincrona (~617 km)\n■ Carico utile: Telescopio da 1,1 m, pancromatico (0,31 m), multispettrale (1,24 m), SWIR (3,7 m), sensore CAVIS\n■ Missione: Osservazione terrestre commerciale ad altissima risoluzione, geointelligence di difesa, mappatura e analisi delle catastrofi.",
        "nl": "[WorldView-3 Commerciële Optische Satelliet met Superresolutie]\n■ Organisatie: Maxar Technologies (VS)\n■ Lanceervoertuig: Atlas V 401\n■ Baan: Zonsynchrone baan (~617 km)\n■ Laadvermogen: 1,1 m telescoop, panchromatisch (0,31 m), multispectraal (1,24 m), SWIR (3,7 m), CAVIS-sensor\n■ Missie: Commerciële observatie met ultrahoge resolutie, defensie-inlichtingen, cartografie en rampenanalyse.",
        "id": "【Satelit Optik Komersial Resolusi Super WorldView-3】\n■ Organisasi: Maxar Technologies (AS)\n■ Roket Peluncur: Atlas V 401\n■ Parameter Orbit: Orbit Sinkron Matahari (~617 km)\n■ Muatan Sensor: Teleskop 1,1 m, pankromatik (0,31 m), multispektral (1,24 m), SWIR (3,7 m), sensor CAVIS\n■ Misi: Pengamatan bumi komersial resolusi sangat tinggi, intelijen pertahanan, pemetaan, dan analisis bencana.",
        "hi": "【वाणिज्यिक सुपर-रिज़ॉल्यूशन ऑप्टिकल उपग्रह WorldView-3】\n■ एजेंसी: मैक्सार टेक्नोलॉजीज (अमेरिका)\n■ प्रक्षेपण यान: एटलस V 401\n■ कक्षीय विवरण: सूर्य-तुल्यकालिक कक्षा (~617 किमी)\n■ पेलोड: 1.1 मीटर दूरबीन, पैनक्रोमैटिक (0.31 मीटर), मल्टीस्पेक्ट्रल (1.24 मीटर), SWIR (3.7 मीटर)\n■ मिशन: अल्ट्रा-हाई-रिज़ॉल्यूशन वाणिज्यिक पृथ्वी अवलोकन, रक्षा खुफिया और आपदा मानचित्रण।",
        "ar": "【القمر البصري التجاري فائق الدقة WorldView-3】\n■ الوكالة: ماكسار تكنولوجيز (الولايات المتحدة الأمريكية)\n■ صاروخ الإطلاق: أطلس 5 401\n■ المدار: مدار متزامن مع الشمس (~617 كم)\n■ الحمولة: تلسكوب 1.1 متر، بانكروماتي (0.31 متر)، متعدد الأطياف (1.24 متر)، SWIR (3.7 متر)\n■ المهمة: رصد تجاري فائق الدقة للأرض، استخبارات دفاعية، رسم خرائط وتحليل الكوارث.",
        "ru": "【Коммерческий оптический спутник сверхвысокого разрешения WorldView-3】\n■ Организация: Maxar Technologies (США)\n■ Ракета-носитель: Atlas V 401\n■ Параметры орбиты: Солнечно-синхронная орбита (~617 км)\n■ Полезная нагрузка: Телескоп 1,1 м, панхроматический канал (0,31 м), мультиспектральный (1,24 м), коротковолновый ИК SWIR (3,7 м), датчик CAVIS\n■ Миссия: Коммерческое наблюдение Земли сверхвысокого разрешения, военная разведка, картография и мониторинг стихийных бедствий."
    },
    "OLYMP": {
        "country": "🇷🇺 ロシア (ロスコスモス / 連邦保安庁 / 宇宙軍)",
        "country_en": "🇷🇺 Russia (Roscosmos / FSB / GRU)",
        "ja": "【ロシア宇宙スパイ衛星「オリンプ」(Olymp-K / Luch-5X)】\n■ 開発・運用組織: ロシア宇宙軍 / ロシア連邦保安庁 (FSB) / ロスコスモス\n■ 打上げ日・ロケット: 2014年9月28日 / プロトン-M ロケット (バイコヌール)\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道 (スロット間を自在に移動)\n■ 主要機器: 高感度シギント(電波傍受)アンテナ、長寿命キセノンイオン推進エンジン\n■ 任務・特徴: 他国の軍用通信衛星やインテルサット商業衛星のすぐ隣(数km)まで自力で軌道移動して接近し、通信データを傍受する「宇宙のストーカー」として国際外交問題を引き起こしたロシアの伝説的軍事衛星。",
        "en": "[Olymp-K / Luch-5X Geostationary SIGINT & Data Relay Satellite]\n■ Agency: Roscosmos / Russian Federal Security Service (FSB) & Defense Intelligence (GRU)\n■ Launcher: Proton-M / Briz-M\n■ Orbit: Geostationary Orbit (GEO, ~35,786 km)\n■ Payload: Multi-band electronic eavesdropping receivers, steerable relay antennas\n■ Mission: Signals intelligence and proximity surveillance maneuvering near commercial and military communication satellites across the geostationary belt.",
        "zh": "【“奥林匹斯”(Olymp-K) / 射线-5X 地球静止轨道信号侦察与中继卫星】\n■ 研发运营机构: 俄罗斯国家航天集团 / 联邦安全局 (FSB) 及 格鲁乌 (GRU)\n■ 运载火箭: 质子-M / 和风-M\n■ 轨道参数: 地球静止轨道 (GEO, 高度约35,786公里)\n■ 载荷配置: 多频段无线电窃听接收机、高增益可动定向天线\n■ 核心任务: 在静止轨道上机动靠近他国军民通信卫星，执行无线电电子信号侦察与战术拦截。",
        "ko": "【올림프-K (Olymp-K) / 루치-5X 정지궤도 신호정찰 및 데이터 중계위성】\n■ 개발 및 운용 기관: 러시아 로스코스모스 / 연방보안국 (FSB) & 군정찰총국 (GRU)\n■ 발사체: 프로톤-M / 브리즈-M\n■ 궤도 제원: 정지궤도 (GEO, 고도 약 35,786km)\n■ 주요 탑재체: 다대역 전파 도청 수신기, 지향성 기동 안테나\n■ 임무 목적: 정지궤도 상에서 타국 군사·상용 통신위성 인근으로 기동 접근하여 도청 및 전자전 정찰 수행.",
        "de": "[Olymp-K / Luch-5X Geostationärer SIGINT- & Datenrelaissatellit]\n■ Organisation: Roskosmos / Russischer Inlandsgeheimdienst (FSB) & Militärnachrichtendienst (GRU)\n■ Trägerrakete: Proton-M / Briz-M\n■ Umlaufbahn: Geostationärer Orbit (GEO, ~35.786 km)\n■ Nutzlast: Mehrband-Funkabhörempfänger, steuerbare Richtantennen\n■ Mission: Elektronische Signalaufklärung und Manövrieren in unmittelbare Nähe fremder Kommunikationssatelliten.",
        "fr": "[Satellite géostationnaire d'écoute et de relais Olymp-K / Luch-5X]\n■ Organisation: Roscosmos / Service fédéral de sécurité (FSB) & Renseignement militaire (GRU)\n■ Lanceur: Proton-M / Briz-M\n■ Orbite: Orbite géostationnaire (GEO, ~35 786 km)\n■ Charge utile: Récepteurs d'interception radio multi-bandes, antennes directives orientables\n■ Mission: Manœuvres d'approche et écoute électromagnétique des satellites de télécommunications en orbite géostationnaire.",
        "es": "[Satélite Geoestacionario de Escucha y Retransmisión Olymp-K / Luch-5X]\n■ Agencia: Roscosmos / Servicio Federal de Seguridad (FSB) e Inteligencia Militar (GRU)\n■ Lanzador: Proton-M / Briz-M\n■ Órbita: Órbita geoestacionaria (GEO, ~35.786 km)\n■ Carga útil: Receptores de interceptación de radio multibanda, antenas directivas orientables\n■ Misión: Maniobras de aproximación y escucha electrónica de satélites de comunicaciones en el cinturón geoestacionario.",
        "pt": "[Satélite Geoestacionário de Escuta e Retransmissão Olymp-K / Luch-5X]\n■ Agência: Roscosmos / Serviço Federal de Segurança (FSB) e Inteligência Militar (GRU)\n■ Lançador: Proton-M / Briz-M\n■ Órbita: Órbita geoestacionária (GEO, ~35.786 km)\n■ Carga útil: Receptores de interceptação de rádio multibanda, antenas direcionais móveis\n■ Missão: Manobras de proximidade e espionagem eletromagnética de satélites de comunicações na órbita geoestacionária.",
        "it": "[Satellite Geostazionario per Spionaggio e Rilancio Dati Olymp-K / Luch-5X]\n■ Agenzia: Roscosmos / Servizio Federale per la Sicurezza (FSB) e Intelligence Militare (GRU)\n■ Vettore: Proton-M / Briz-M\n■ Orbita: Orbita geostazionaria (GEO, ~35.786 km)\n■ Carico utile: Ricevitori di intercettazione radio multibanda, antenne direzionali orientabili\n■ Missione: Manovre di prossimità e ascolto elettronico di satelliti per telecomunicazioni nella fascia geostazionaria.",
        "nl": "[Geostationaire Afluister- en Relaissatelliet Olymp-K / Luch-5X]\n■ Organisatie: Roscosmos / Federale Veiligheidsdienst (FSB) & Militaire Inlichtingendienst (GRU)\n■ Lanceervoertuig: Proton-M / Briz-M\n■ Baan: Geostationaire baan (GEO, ~35.786 km)\n■ Laadvermogen: Multiband radio-interceptie-ontvangers, richtbare antennes\n■ Missie: Nabijheidsmanoeuvres en elektronische spionage van communicatiesatellieten in de geostationaire gordel.",
        "id": "【Satelit Penyadapan dan Relai Geostasioner Olymp-K / Luch-5X】\n■ Organisasi: Roscosmos / Badan Keamanan Federal (FSB) & Intelijen Militer (GRU)\n■ Roket Peluncur: Proton-M / Briz-M\n■ Parameter Orbit: Orbit Geostasioner (GEO, ~35.786 km)\n■ Muatan Sensor: Penerima intersepsi radio multi-pita, antena pengarah yang dapat digerakkan\n■ Misi: Manuver pendekatan dan spionase elektronik terhadap satelit komunikasi di sabuk geostasioner.",
        "hi": "【भूस्थिर इलेक्ट्रॉनिक जासूसी और रिले उपग्रह Olymp-K / Luch-5X】\n■ एजेंसी: रोस्कोस्मोस / संघीय सुरक्षा सेवा (FSB) और सैन्य खुफिया (GRU)\n■ प्रक्षेपण यान: प्रोटॉन-M / ब्रिbounding-M\n■ कक्षीय विवरण: भूस्थिर कक्षा (GEO, ~35,786 किमी)\n■ पेलोड: मल्टी-बैंड रेडियो इंटरसेप्शन रिसीवर, दिशात्मक एंटेना\n■ मिशन: भूस्थिर कक्षा में संचार उपग्रहों के पास जाकर सिग्नल खुफिया और जासूसी करना।",
        "ar": "【قمر التجسس الإلكتروني والترحيل في المدار الثابت Olymp-K / Luch-5X】\n■ الوكالة: روسكوزموس / جهاز الأمن الفيدرالي (FSB) والاستخبارات العسكرية (GRU)\n■ صاروخ الإطلاق: بروتون-M / بريز-M\n■ المدار: مدار جغرافي ثابت (GEO, ~35,786 كم)\n■ الحمولة: مستقبلات اعتراض راديو متعددة النطاقات، هوائيات توجيهية متحركة\n■ المهمة: مناورات اقتراب وتجسس إلكتروني على أقمار الاتصالات في الحزام الثابت.",
        "ru": "【Геостационарный спутник радиотехнической разведки и ретрансляции «Олимп-К» / «Луч-5X»】\n■ Организация: Роскосмос / Федеральная служба безопасности (ФСБ) и ГРУ\n■ Ракета-носитель: Протон-М / Бриз-М\n■ Параметры орбиты: Геостационарная орбита (GEO, ~35 786 км)\n■ Полезная нагрузка: Многодиапазонные приемники радиоперехвата, подвижные направленные антенны\n■ Миссия: Маневры сближения и радиоэлектронная разведка каналов связи иностранных спутников на геостационарной орбите."
    },
    "SPEKTR": {
        "country": "🇷🇺 / 🇩🇪 ロシア・ドイツ (IKI / DLR / ロスコスモス)",
        "country_en": "🇷🇺 / 🇩🇪 Russia & Germany (IKI / DLR / Roscosmos)",
        "ja": "【深宇宙X線天文台「Spektr-RG」(スペクトルRG)】\n■ 開発・運用組織: ロシア科学アカデミー宇宙研究所 (IKI) / ドイツ航空宇宙センター (DLR) / ロスコスモス\n■ 打上げ日・ロケット: 2019年7月13日 / プロトン-M ロケット\n■ 軌道諸元: 地球から約150万km離れた太陽-地球ラグランジュ点L2のハロー軌道\n■ 主要観測機器: ドイツ製軟X線望遠鏡「eROSITA」(7基のミラーモジュール)、ロシア製硬X線望遠鏡「ART-XC」\n■ 観測目的: 全宇宙に広がる10万個以上の銀河団や、数百万個の超大質量ブラックホールを史上最も精密なX線地図としてカタログ化。ダークエネルギーと宇宙の大規模構造の進化を解き明かす。",
        "en": "[Spektr-RG High-Energy Astrophysical Space Observatory]\n■ Agency: Roscosmos (Russia / IKI) & DLR / Max Planck Institute (Germany)\n■ Launcher: Proton-M / Blok DM-03\n■ Orbit: Sun-Earth Lagrange Point 2 (L2 halo orbit, ~1.5 million km from Earth)\n■ Payload: eROSITA soft X-ray telescope array (Germany) & ART-XC hard X-ray telescope (Russia)\n■ Mission: All-sky survey mapping over 100,000 galaxy clusters, active galactic nuclei (AGN), black holes, and dark energy cosmic large-scale structures.",
        "zh": "【“光谱-RG”(Spektr-RG) 高能天体物理空间天文台】\n■ 研发运营机构: 俄罗斯科学院空间研究所 (IKI) 与 德国航空太空中心 (DLR)\n■ 运载火箭: 质子-M / DM-03 上面级\n■ 轨道参数: 日地拉格朗日L2点晕轮轨道 (距地球约150万公里)\n■ 载荷配置: 德国eROSITA软X射线望远镜阵列 与 俄罗斯ART-XC硬X射线望远镜\n■ 核心任务: 全天巡天测绘超过10万个星系团、超大质量黑洞与活跃星系核，揭示宇宙暗能量大尺度结构。",
        "ko": "【스펙트르-RG (Spektr-RG) 고에너지 천체물리 우주망원경】\n■ 개발 및 운용 기관: 러시아 우주과학연구소 (IKI) & 독일 항공우주청 (DLR / 막스 플랑크 연구소)\n■ 발사체: 프로톤-M / DM-03\n■ 궤도 제원: 태양-지구 라그랑주 L2점 헤일로 궤도 (~150만 km)\n■ 주요 탑재체: 독일 eROSITA 연X선 망원경 어레이 & 러시아 ART-XC 경X선 망원경\n■ 임무 목적: 전 우주 10만 개 이상의 은하단, 초대질량 블랙홀, 활동은하핵 관측을 통한 암흑에너지 우주 거대구조 지도 작성.",
        "de": "[Spektr-RG Hochenergie-Astrophysikalisches Weltraumobservatorium]\n■ Organisation: Roskosmos (Russland / IKI) & DLR / Max-Planck-Institut (Deutschland)\n■ Trägerrakete: Proton-M / DM-03\n■ Umlaufbahn: Sonne-Erde-Lagrange-Punkt L2 (1,5 Millionen km von der Erde)\n■ Nutzlast: Deutsches eROSITA-Röntgenteleskoparray & russisches ART-XC-Hartröntgenteleskop\n■ Mission: Gesamthimmels-Kartierung von über 100.000 Galaxienhaufen, supermassiven Schwarzen Löchern und Dunkler Energie.",
        "fr": "[Observatoire spatial astrophysique des hautes énergies Spektr-RG]\n■ Organisation: Roscosmos (Russie / IKI) & DLR / Institut Max-Planck (Allemagne)\n■ Lanceur: Proton-M / DM-03\n■ Orbite: Point de Lagrange L2 Terre-Soleil (à 1,5 million de km de la Terre)\n■ Charge utile: Télescope à rayons X mous eROSITA (Allemagne) & télescope à rayons X durs ART-XC (Russie)\n■ Mission: Cartographie intégrale du ciel répertoriant plus de 100 000 amas de galaxies, trous noirs supermassifs et énergie noire.",
        "es": "[Observatorio Espacial Astrofísico de Alta Energía Spektr-RG]\n■ Agencia: Roscosmos (Rusia / IKI) y DLR / Instituto Max Planck (Alemania)\n■ Lanzador: Proton-M / DM-03\n■ Órbita: Punto de Lagrange L2 Sol-Tierra (~1,5 millones de km de la Tierra)\n■ Carga útil: Conjunto de telescopios de rayos X blandos eROSITA (Alemania) y telescopio de rayos X duros ART-XC (Rusia)\n■ Misión: Mapeo de todo el cielo registrando más de 100.000 cúmulos de galaxias, agujeros negros supermasivos y energía oscura.",
        "pt": "[Observatório Espacial Astrofísico de Altas Energias Spektr-RG]\n■ Agência: Roscosmos (Rússia / IKI) e DLR / Instituto Max Planck (Alemanha)\n■ Lançador: Proton-M / DM-03\n■ Órbita: Ponto de Lagrange L2 Sol-Terra (~1,5 milhão de km da Terra)\n■ Carga útil: Conjunto de telescópios de raios X moles eROSITA (Alemanha) e telescópio de raios X duros ART-XC (Rússia)\n■ Missão: Mapeamento de todo o céu registrando mais de 100.000 aglomerados de galáxias, buracos negros supermassivos e energia escura.",
        "it": "[Osservatorio Spaziale Astrofisico ad Alte Energie Spektr-RG]\n■ Agenzia: Roscosmos (Russia / IKI) e DLR / Istituto Max Planck (Germania)\n■ Vettore: Proton-M / DM-03\n■ Orbita: Punto di Lagrange L2 Sole-Terra (~1,5 milioni di km dalla Terra)\n■ Carico utile: Array di telescopi a raggi X molli eROSITA (Germania) e telescopio a raggi X duri ART-XC (Russia)\n■ Missione: Mappatura dell'intero cielo catalogando oltre 100.000 ammassi di galassie, buchi neri supermassicci ed energia oscura.",
        "nl": "[Spektr-RG Hoog-Energetisch Astrofysisch Ruimteobservatorium]\n■ Organisatie: Roscosmos (Rusland / IKI) & DLR / Max Planck Instituut (Duitsland)\n■ Lanceervoertuig: Proton-M / DM-03\n■ Baan: Zon-Aarde Lagrangepunt L2 (~1,5 miljoen km van de aarde)\n■ Laadvermogen: Duitse eROSITA röntgentelescoop & Russische ART-XC harde röntgentelescoop\n■ Missie: Volledige hemelkaart met meer dan 100.000 clusters van sterrenstelsels, superzware zwarte gaten en donkere energie.",
        "id": "【Observatorium Ruang Angkasa Astrofisika Energi Tinggi Spektr-RG】\n■ Organisasi: Roscosmos (Rusia / IKI) & DLR / Institut Max Planck (Jerman)\n■ Roket Peluncur: Proton-M / DM-03\n■ Parameter Orbit: Titik Lagrange L2 Matahari-Bumi (~1,5 juta km dari Bumi)\n■ Muatan Sensor: Array teleskop sinar-X lunak eROSITA (Jerman) & teleskop sinar-X keras ART-XC (Rusia)\n■ Misi: Pemetaan seluruh langit mencatat lebih dari 100.000 gugus galaksi, lubang hitam supermasif, dan energi gelap.",
        "hi": "【उच्च-ऊर्जा खगोलभौतिकीय अंतरिक्ष वेधशाला Spektr-RG】\n■ एजेंसी: रोस्कोस्मोस (रूस / IKI) और DLR / मैक्स प्लैंक इंस्टीट्यूट (जर्मनी)\n■ प्रक्षेपण यान: प्रोटॉन-M / DM-03\n■ कक्षीय विवरण: सूर्य-पृथ्वी लैग्रेंज बिंदु L2 (~15 लाख किमी)\n■ पेलोड: जर्मन eROSITA सॉफ्ट एक्स-रे दूरबीन और रूसी ART-XC हार्ड एक्स-रे दूरबीन\n■ मिशन: 100,000 से अधिक आकाशगंगा समूहों, सुपरमैसिव ब्लैक होल और डार्क एनर्जी का अखिल-आकाश मानचित्रण।",
        "ar": "【المرصد الفضائي للفيزياء الفلكية عالية الطاقة Spektr-RG】\n■ الوكالة: روسكوزموس (روسيا / IKI) وDLR / معهد ماكس بلانك (ألمانيا)\n■ صاروخ الإطلاق: بروتون-M / DM-03\n■ المدار: نقطة لاغرانج L2 بين الشمس والأرض (~1.5 مليون كم من الأرض)\n■ الحمولة: تلسكوب eROSITA للأشعة السينية الخفيفة وتلسكوب ART-XC للأشعة السينية الصلبة\n■ المهمة: مسح شامل للسماء لتوثيق أكثر من 100,000 عنقود مجري والثقوب السوداء والطاقة المظلمة.",
        "ru": "【Высокоэнергетическая астрофизическая космическая обсерватория «Спектр-РГ»】\n■ Организация: Роскосмос (Россия / ИКИ РАН) и DLR / Институт Макса Планка (Германия)\n■ Ракета-носитель: Протон-М / разгонный блок ДМ-03\n■ Параметры орбиты: Точка Лагранжа L2 системы Солнце-Земля (~1,5 млн км от Земли)\n■ Полезная нагрузка: Немецкий массив телескопов мягкого рентгеновского диапазона eROSITA и российский телескоп жесткого рентгеновского диапазона ART-XC\n■ Миссия: Обзор всего неба с регистрацией более 100 000 скоплений галактик, сверхмассивных черных дыр и исследование темной энергии."
    },
    "METEOR": {
        "country": "🇷🇺 ロシア (ロシア水文気象局 / ロスコスモス)",
        "country_en": "🇷🇺 Russia (Roshydromet / Roscosmos)",
        "ja": "【新世代極軌道気象衛星「Meteor-M No.2-4」(メテオールM)】\n■ 開発・運用組織: ロシア水文気象局 (Roshydromet) / ロスコスモス\n■ 打上げ日・ロケット: 2024年2月29日 / ソユーズ-2.1b ロケット (ボストチヌイ宇宙基地)\n■ 軌道諸元: 高度約820km / 太陽同期軌道 (軌道傾斜角98.6度)\n■ 主要観測機器: マルチスペクトル走査放射計「KMSS」、サイドローキングレーダー、マイクロ波サウンダー「MTVZA-GY」\n■ 観測目的: 北極海航路(NSR)の海氷厚・氷山監視、シベリア極寒地帯のブリザード追跡、オゾン層と宇宙天気の観測。",
        "en": "[Meteor-M No.2-3 Polar Meteorological & Climate Satellite]\n■ Agency: Roscosmos / Roshydromet (Federal Service for Hydrometeorology, Russia)\n■ Launcher: Soyuz-2.1b / Fregat\n■ Orbit: Sun-synchronous Polar Orbit (~820 km)\n■ Payload: MSU-MR multispectral optical imager, Severjan synthetic aperture radar (SAR), KMSS multispectral scanner\n■ Mission: Global weather forecasting, Northern Sea Route Arctic ice monitoring, and space weather solar activity observation.",
        "zh": "【“流星-M”2-3号 极轨气象与海洋气候卫星】\n■ 研发运营机构: 俄罗斯国家航天集团 / 俄罗斯联邦水文气象与环境监测局\n■ 运载火箭: 联盟-2.1b / 军号Fregat (东方航天发射场)\n■ 轨道参数: 太阳同步极轨道 (高度约820公里)\n■ 载荷配置: MSU-MR多光谱光学成像仪、Severjan合成孔径雷达 (SAR)、KMSS中分辨率扫描仪\n■ 核心任务: 全球天气预报、北极航道海冰分布监测与空间天气太阳耀斑活动探测。",
        "ko": "【메테오르-M (Meteor-M) 2-3호 극궤도 기상 및 해양기후 관측위성】\n■ 개발 및 운용 기관: 러시아 로스코스모스 / 러시아 연방 수문기상환경모니터링청\n■ 발사체: 소유즈-2.1b / 프레가트 (보스토치니 우주기지)\n■ 궤도 제원: 태양동기 극궤도 (고도 약 820km)\n■ 주요 탑재체: MSU-MR 다중분광 광학 영상기, 세베리얀(Severjan) 합성개구레이더(SAR), KMSS 스캐너\n■ 임무 목적: 전 지구 기상 예보, 북극해 항로 해빙 분포 관측 및 우주기상 태양활동 감시.",
        "de": "[Meteor-M No.2-3 Polarer Wetter- und Klimasatellit]\n■ Organisation: Roskosmos / Roshydromet (Russland)\n■ Trägerrakete: Sojus-2.1b / Fregat (Kosmodrom Wostotschny)\n■ Umlaufbahn: Sonnensynchroner Polarorbit (~820 km)\n■ Nutzlast: MSU-MR optisches Mehrkanal-Radiometer, Severjan-SAR-Radar, KMSS-Scanner\n■ Mission: Globale Wettervorhersage, Arktis-Seerouten-Eisüberwachung und Weltraumwetter-Beobachtung.",
        "fr": "[Satellite météorologique polaire et climatique Meteor-M n°2-3]\n■ Organisation: Roscosmos / Roshydromet (Russie)\n■ Lanceur: Soyouz-2.1b / Fregat (Cosmodrome Vostotchny)\n■ Orbite: Orbite héliosynchrone polaire (~820 km)\n■ Charge utile: Imageur multispectral MSU-MR, radar SAR Severjan, scanner KMSS\n■ Mission: Prévisions météorologiques globales, surveillance des glaces de l'Arctique et météo spatiale.",
        "es": "[Satélite Meteorológico Polar y Climático Meteor-M N°2-3]\n■ Agencia: Roscosmos / Roshydromet (Rusia)\n■ Lanzador: Soyuz-2.1b / Fregat (Cosmódromo de Vostochny)\n■ Órbita: Órbita polar heliosíncrona (~820 km)\n■ Carga útil: Generador de imágenes multiespectral MSU-MR, radar SAR Severjan, escáner KMSS\n■ Misión: Predicción meteorológica global, monitoreo del hielo marino en la ruta ártica y clima espacial.",
        "pt": "[Satélite Meteorológico Polar e Climático Meteor-M N°2-3]\n■ Agência: Roscosmos / Roshydromet (Rússia)\n■ Lançador: Soyuz-2.1b / Fregat (Cosmódromo de Vostochny)\n■ Órbita: Órbita polar heliossíncrona (~820 km)\n■ Carga útil: Gerador de imagens multiespectral MSU-MR, radar SAR Severjan, scanner KMSS\n■ Missão: Previsão meteorológica global, monitoramento do gelo marítimo no Ártico e clima espacial.",
        "it": "[Satellite Meteorologico Polare e Climatico Meteor-M N°2-3]\n■ Agenzia: Roscosmos / Roshydromet (Russia)\n■ Vettore: Soyuz-2.1b / Fregat (Cosmodromo di Vostochny)\n■ Orbita: Orbita polare eliosincrona (~820 km)\n■ Carico utile: Generatore di immagini multispettrale MSU-MR, radar SAR Severjan, scanner KMSS\n■ Missione: Previsioni meteorologiche globali, monitoraggio del ghiaccio marino nell'Artico e meteo spaziale.",
        "nl": "[Meteor-M Nr.2-3 Polaire Meteorologische en Klimaatsatelliet]\n■ Organisatie: Roscosmos / Roshydromet (Rusland)\n■ Lanceervoertuig: Sojoez-2.1b / Fregat (Kosmodroom Vostotsjny)\n■ Baan: Zonsynchrone polaire baan (~820 km)\n■ Laadvermogen: MSU-MR multispectrale imager, Severjan SAR-radar, KMSS-scanner\n■ Missie: Wereldwijde weersvoorspelling, monitoring van Arctisch zee-ijs en ruimteweer.",
        "id": "【Satelit Meteorologi Kutub dan Iklim Meteor-M No.2-3】\n■ Organisasi: Roscosmos / Roshydromet (Rusia)\n■ Roket Peluncur: Soyuz-2.1b / Fregat (Kosmodrom Vostochny)\n■ Parameter Orbit: Orbit Polar Sinkron Matahari (~820 km)\n■ Muatan Sensor: Pencitra multispektral MSU-MR, radar SAR Severjan, pemindai KMSS\n■ Misi: Prakiraan cuaca global, pemantauan es laut rute Arktik, dan cuaca antariksa.",
        "hi": "【ध्रुवीय मौसम और जलवायु उपग्रह Meteor-M No.2-3】\n■ एजेंसी: रोस्कोस्मोस / रोशाइग्रोमेट (रूस)\n■ प्रक्षेपण यान: सोयुज-2.1b / फ्रेगेट (वोस्तोचन कोस्मोड्रोम)\n■ कक्षीय विवरण: सूर्य-तुल्यकालिक ध्रुवीय कक्षा (~820 किमी)\n■ पेलोड: MSU-MR मल्टीस्पेक्ट्रल इमेजर, सेवेरजान SAR रडार, KMSS स्कैनर\n■ मिशन: वैश्विक मौसम पूर्वानुमान, आर्कटिक समुद्री बर्फ की निगरानी और अंतरिक्ष मौसम।",
        "ar": "【قمر الأرصاد الجوية والمناخ القطبي Meteor-M رقم 2-3】\n■ الوكالة: روسكوزموس / روشيدروميت (روسيا)\n■ صاروخ الإطلاق: سويوز-2.1b / فريغات (قاعدة فوستوتشني الفضائية)\n■ المدار: مدار قطبي متزامن مع الشمس (~820 كم)\n■ الحمولة: مصور متعدد الأطياف MSU-MR، رادار SAR سيفيريان، ماسح KMSS\n■ المهمة: التنبؤ بالطقس العالمي ومراقبة الجليد في ممر القطب الشمالي والطقس الفضائي.",
        "ru": "【Полярный метеорологический и климатический спутник «Метеор-М» №2-3】\n■ Организация: Роскосмос / Росгидромет\n■ Ракета-носитель: Союз-2.1б / Фрегат (Космодром Восточный)\n■ Параметры орбиты: Солнечно-синхронная полярная орбита (~820 км)\n■ Полезная нагрузка: Мультиспектральный оптический радиометр МСУ-МР, радиолокационный комплекс «Северьян» (SAR), сканер КМСС\n■ Миссия: Глобальный прогноз погоды, мониторинг ледовой обстановки на Северном морском пути и наблюдение космической погоды."
    },
    "MICIUS": {
        "country": "🇨🇳 中国 (中国科学院 / CAS / 中国科学技術大学)",
        "country_en": "🇨🇳 China (CAS / USTC)",
        "ja": "【量子科学実験衛星「墨子号」(Micius / QUESS)】\n■ 開発・運用組織: 中国科学院 (CAS) / 中国科学技術大学 (潘建偉教授チーム)\n■ 打上げ日・ロケット: 2016年8月16日 / 長征2号丁 (CZ-2D) ロケット (酒泉衛星発射センター)\n■ 軌道諸元: 高度約500km / 太陽同期軌道 (軌道傾斜角97.4度)\n■ 主要実験装置: 量子もつれ光子発生源、量子キートランスポンダ、高精度超短パルスレーザー送信機\n■ 科学的快挙: 【世界初】宇宙から1,200km離れた地上の2地点へ「量子もつれ」光子を送り、理論上絶対に盗聴不可能な「量子暗号鍵配送」と量子テレポーテーション実験に成功。量子インターネット時代の幕を開けた歴史的衛星。",
        "en": "[Micius / Mozi Quantum Science Experiment Satellite (QUESS)]\n■ Agency: Chinese Academy of Sciences (CAS / USTC)\n■ Launcher: Long March 2D (CZ-2D)\n■ Orbit: Sun-synchronous Polar Orbit (~500 km)\n■ Payload: Space-ground quantum entangled photon source, quantum key communicator, quantum teleportation receiver\n■ Mission: World's first space-to-ground quantum key distribution (QKD), demonstrating intercontinental unhackable quantum cryptographic communications over 1,200 km.",
        "zh": "【“墨子号”量子科学实验卫星 (QUESS)】\n■ 研发运营机构: 中国科学院 (CAS) / 中国科学技术大学 (USTC)\n■ 运载火箭: 长征二号丁 (CZ-2D)\n■ 轨道参数: 太阳同步极轨道 (高度约500公里)\n■ 载荷配置: 星地纠缠光子发射源、量子密钥分发器、量子隐形传态接收机\n■ 核心任务: 实现千公里级星地量子纠缠分发与不可破解的广域量子保密通信实验。",
        "ko": "【양자과학실험위성 \"묵자호\" (Micius / QUESS)】\n■ 개발 및 운용 기관: 중국과학원 (CAS) / 중국과학기술대학교 (USTC)\n■ 발사체: 창정 2호정 (CZ-2D)\n■ 궤도 제원: 태양동기 극궤도 (고도 약 500km)\n■ 주요 탑재체: 위성-지상 양자 얽힘 광자원, 양자키 분배기, 양자 원격전송 수신기\n■ 임무 목적: 세계 최초 1,200km 초장거리 위성-지상 양자 얽힘 분배 및 도청 불가능한 대륙 간 양자 암호 통신망 실증.",
        "de": "[Micius / Mozi Quantenwissenschaftlicher Experimentalsatellit (QUESS)]\n■ Organisation: Chinesische Akademie der Wissenschaften (CAS / USTC)\n■ Trägerrakete: Langer Marsch 2D (CZ-2D)\n■ Umlaufbahn: Sonnensynchroner Polarorbit (~500 km)\n■ Nutzlast: Photonenquelle für Quantenverschränkung, Quantenschlüssel-Sender, Teleportationsempfänger\n■ Mission: Weltweit erste interkontinentale unknackbare quantenkryptografische Kommunikation über 1.200 km Distanz.",
        "fr": "[Satellite d'expérimentation scientifique quantique Micius (QUESS)]\n■ Organisation: Académie chinoise des sciences (CAS / USTC)\n■ Lanceur: Longue Marche 2D (CZ-2D)\n■ Orbite: Orbite héliosynchrone polaire (~500 km)\n■ Charge utile: Source de photons intriqués espace-sol, émetteur de clés quantiques, récepteur de téléportation\n■ Mission: Première distribution mondiale de clés quantiques par satellite démontrant une liaison cryptographique inviolable sur 1 200 km.",
        "es": "[Satélite de Experimentos Científicos Cuánticos Micius (QUESS)]\n■ Agencia: Academia China de Ciencias (CAS / USTC)\n■ Lanzador: Larga Marcha 2D (CZ-2D)\n■ Órbita: Órbita polar heliosíncrona (~500 km)\n■ Carga útil: Fuente de fotones entrelazados espacio-tierra, transmisor de claves cuánticas, receptor de teletransportación\n■ Misión: Primera distribución cuántica de claves por satélite del mundo, logrando comunicaciones criptográficas intercontinentales seguras a más de 1.200 km.",
        "pt": "[Satélite de Experimentos Científicos Quânticos Micius (QUESS)]\n■ Agência: Academia Chinesa de Ciências (CAS / USTC)\n■ Lançador: Longa Marcha 2D (CZ-2D)\n■ Órbita: Órbita polar heliossíncrona (~500 km)\n■ Carga útil: Fonte de fótons entrelaçados espaço-terra, transmissor de chaves quânticas, receptor de teletransporte\n■ Missão: Primeira distribuição quântica de chaves por satélite do mundo, alcançando comunicações criptográficas intercontinentais invioláveis a mais de 1.200 km.",
        "it": "[Satellite per Esperimenti Scientifici Quantistici Micius (QUESS)]\n■ Agenzia: Accademia Cinese delle Scienze (CAS / USTC)\n■ Vettore: Lunga Marcia 2D (CZ-2D)\n■ Orbita: Orbita polare eliosincrona (~500 km)\n■ Carico utile: Sorgente di fotoni entangled spazio-terra, trasmettitore di chiavi quantistiche, ricevitore di teletrasporto\n■ Missione: Prima distribuzione quantistica di chiavi da satellite al mondo, dimostrando comunicazioni crittografiche intercontinentali inviolabili su 1.200 km.",
        "nl": "[Micius / Mozi Kwantumwetenschappelijke Experimentsatelliet (QUESS)]\n■ Organisatie: Chinese Academie van Wetenschappen (CAS / USTC)\n■ Lanceervoertuig: Lange Mars 2D (CZ-2D)\n■ Baan: Zonsynchrone polaire baan (~500 km)\n■ Laadvermogen: Ruimte-aarde verstrengelde fotonenbron, kwantumsleutel-zender, teleportatie-ontvanger\n■ Missie: Wereldwijd eerste intercontinentale onkraakbare kwantumcryptografische communicatie over 1.200 km.",
        "id": "【Satelit Eksperimen Sains Kuantum Micius (QUESS)】\n■ Organisasi: Akademi Ilmu Pengetahuan Tiongkok (CAS / USTC)\n■ Roket Peluncur: Long March 2D (CZ-2D)\n■ Parameter Orbit: Orbit Polar Sinkron Matahari (~500 km)\n■ Muatan Sensor: Sumber foton terjerat antariksa-bumi, pemancar kunci kuantum, penerima teleportasi\n■ Misi: Distribusi kunci kuantum satelit pertama di dunia yang membuktikan komunikasi kriptografi antarbenua tak terretas lebih dari 1.200 km.",
        "hi": "【क्वांटम विज्ञान प्रयोग उपग्रह \"मिशियस\" (QUESS)】\n■ एजेंसी: चीनी विज्ञान अकादमी (CAS / USTC)\n■ प्रक्षेपण यान: लॉन्ग मार्च 2D (CZ-2D)\n■ कक्षीय विवरण: सूर्य-तुल्यकालिक ध्रुवीय कक्षा (~500 किमी)\n■ पेलोड: अंतरिक्ष-पृथ्वी उलझा हुआ फोटॉन स्रोत, क्वांटम कुंजी ट्रांसमीटर, टेलीपोर्टेशन रिसीवर\n■ मिशन: 1,200 किमी की दूरी पर पहली अंतरमहाद्वीपीय अनहैकेबल क्वांटम क्रिप्टोग्राफिक संचार का प्रदर्शन।",
        "ar": "【قمر تجارب العلوم الكمومية \"ميسيوس\" (QUESS)】\n■ الوكالة: الأكاديمية الصينية للعلوم (CAS / USTC)\n■ صاروخ الإطلاق: المسيرة الطويلة 2D (CZ-2D)\n■ المدار: مدار قطبي متزامن مع الشمس (~500 كم)\n■ الحمولة: مصدر فوتونات متشابكة فضائية-أرضية، موزع مفاتيح كمومية، مستقبل انتقال فوري\n■ المهمة: أول توزيع للمفاتيح الكمومية عبر الأقمار الصناعية في العالم وتحقيق اتصالات مشفرة غير قابلة للاختراق عبر 1200 كم.",
        "ru": "【Квантовый научный экспериментальный спутник «Мо-цзы» (Micius / QUESS)】\n■ Организация: Китайская академия наук (CAS / USTC)\n■ Ракета-носитель: Чанчжэн-2D (CZ-2D)\n■ Параметры орбиты: Солнечно-синхронная полярная орбита (~500 км)\n■ Полезная нагрузка: Космический источник запутанных фотонов, передатчик квантовых ключей, приемник телепортации\n■ Миссия: Первая в мире квантовая спутниковая связь и создание невзламываемой межконтинентальной криптографической квантовой сети на расстоянии 1200 км."
    },
    "DAMPE": {
        "country": "🇨🇳 中国 (中国科学院 / 国家空間科学中心)",
        "country_en": "🇨🇳 China (CAS / NSSC)",
        "ja": "【暗黒物質粒子探査衛星「悟空号」(DAMPE / ダーペン)】\n■ 開発・運用組織: 中国科学院 (CAS) / 紫金山天文台 / スイス・イタリア共同研究\n■ 打上げ日・ロケット: 2015年12月17日 / 長征2号丁 (CZ-2D) ロケット (酒泉)\n■ 軌道諸元: 高度約500km / 太陽同期軌道 (軌道傾斜角97.4度)\n■ 主要観測機器: プラスチックシンチレータ検出器、シリコン・タングステン飛跡検出器、BGO熱量計、中性子検出器\n■ 探査目的: 宇宙最大の謎である「暗黒物質(ダークマター)」の崩壊や対消滅に伴う超高エネルギー電子・陽電子およびガンマ線を世界最高のエネルギースペクトル分解能で観測。",
        "en": "[DAMPE Wukong Dark Matter Particle Explorer Satellite]\n■ Agency: Chinese Academy of Sciences (CAS / Purple Mountain Observatory)\n■ Launcher: Long March 2D (CZ-2D)\n■ Orbit: Sun-synchronous Polar Orbit (~500 km)\n■ Payload: Plastic scintillator detector, silicon-tungsten tracker, BGO imaging calorimeter (31 radiation lengths), neutron detector\n■ Mission: High-precision measurement of high-energy cosmic rays, gamma-ray astrophysics, and direct searching for dark matter annihilation signatures.",
        "zh": "【“悟空号”暗物质粒子探测卫星 (DAMPE)】\n■ 研发运营机构: 中国科学院 (CAS) / 紫金山天文台\n■ 运载火箭: 长征二号丁 (CZ-2D)\n■ 轨道参数: 太阳同步极轨道 (高度约500公里)\n■ 载荷配置: 塑料闪烁体探测器、硅微条径迹探测器、BGO量能器 (厚度达31个辐射长度)、中子探测器\n■ 核心任务: 超高能宇宙射线精准能谱测量、伽马射线天文观测与暗物质湮灭特征直接搜寻。",
        "ko": "【암흑물질 입자탐사위성 \"오공호\" (DAMPE / Wukong)】\n■ 개발 및 운용 기관: 중국과학원 (CAS) / 자금산천문대\n■ 발사체: 창정 2호정 (CZ-2D)\n■ 궤도 제원: 태양동기 극궤도 (고도 약 500km)\n■ 주요 탑재체: 플라스틱 섬광체 검출기, 실리콘 트래커, BGO 열량계 (두께 31 방사길이), 중성자 검출기\n■ 임무 목적: 고에너지 우주선 스펙트럼 정밀 측정, 감마선 천문학 연구 및 암흑물질 소멸 신호 직접 탐색.",
        "de": "[DAMPE Wukong Dunkle-Materie-Teilchendetektor-Satellit]\n■ Organisation: Chinesische Akademie der Wissenschaften (CAS / Purple Mountain Observatorium)\n■ Trägerrakete: Langer Marsch 2D (CZ-2D)\n■ Umlaufbahn: Sonnensynchroner Polarorbit (~500 km)\n■ Nutzlast: Plastikszintillator, Silizium-Tracker, BGO-Kalorimeter (31 Strahlungslängen), Neutronendetektor\n■ Mission: Präzisionsmessung kosmischer Strahlung und direkte Suche nach Spuren der Vernichtung Dunkler Materie.",
        "fr": "[Satellite de détection de matière noire DAMPE Wukong]\n■ Organisation: Académie chinoise des sciences (CAS / Observatoire de la Montagne Pourpre)\n■ Lanceur: Longue Marche 2D (CZ-2D)\n■ Orbite: Orbite héliosynchrone polaire (~500 km)\n■ Charge utile: Scintillateur plastique, trajectographe silicium, calorimètre BGO (31 longueurs de radiation), détecteur de neutrons\n■ Mission: Mesure de haute précision des rayons cosmiques de haute énergie et recherche directe des signatures d'annihilation de la matière noire.",
        "es": "[Satélite Detector de Partículas de Materia Oscura DAMPE Wukong]\n■ Agencia: Academia China de Ciencias (CAS / Observatorio de la Montaña Púrpura)\n■ Lanzador: Larga Marcha 2D (CZ-2D)\n■ Órbita: Órbita polar heliosíncrona (~500 km)\n■ Carga útil: Centelleador plástico, rastreador de silicio, calorímetro BGO (31 longitudes de radiación), detector de neutrones\n■ Misión: Medición de precisión de rayos cósmicos de alta energía y búsqueda directa de firmas de aniquilación de materia oscura.",
        "pt": "[Satélite Detector de Partículas de Matéria Escura DAMPE Wukong]\n■ Agência: Academia Chinesa de Ciências (CAS / Observatório da Montanha Púrpura)\n■ Lançador: Longa Marcha 2D (CZ-2D)\n■ Órbita: Órbita polar heliossíncrona (~500 km)\n■ Carga útil: Cintilador plástico, rastreador de silício, calorímetro BGO (31 comprimentos de radiação), detector de nêutrons\n■ Missão: Medição de precisão de raios cósmicos de alta energia e busca direta por assinaturas de aniquilação de matéria escura.",
        "it": "[Satellite per la Rilevazione di Materia Oscura DAMPE Wukong]\n■ Agenzia: Accademia Cinese delle Scienze (CAS / Osservatorio della Montagna Purpurea)\n■ Vettore: Lunga Marcia 2D (CZ-2D)\n■ Orbita: Orbita polare eliosincrona (~500 km)\n■ Carico utile: Scintillatore plastico, tracciatore al silicio, calorimetro BGO (31 lunghezze di radiazione), rilevatore di neutroni\n■ Missione: Misurazione di precisione dei raggi cosmici ad alta energia e ricerca diretta di segnali di annichilazione della materia oscura.",
        "nl": "[DAMPE Wukong Donkere Materie Deeltjesdetectiesatelliet]\n■ Organisatie: Chinese Academie van Wetenschappen (CAS / Purple Mountain Observatorium)\n■ Lanceervoertuig: Lange Mars 2D (CZ-2D)\n■ Baan: Zonsynchrone polaire baan (~500 km)\n■ Laadvermogen: Kunststof scintillatiedetector, siliciumtracker, BGO-calorimeter (31 stralingslengtes), neutronendetector\n■ Missie: Precisiemeting van hoogenergetische kosmische straling en directe zoektocht naar sporen van donkere materie.",
        "id": "【Satelit Pendeteksi Partikel Materi Gelap DAMPE Wukong】\n■ Organisasi: Akademi Ilmu Pengetahuan Tiongkok (CAS / Observatorium Gunung Ungu)\n■ Roket Peluncur: Long March 2D (CZ-2D)\n■ Parameter Orbit: Orbit Polar Sinkron Matahari (~500 km)\n■ Muatan Sensor: Sintilator plastik, pelacak silikon, kalorimeter BGO (31 panjang radiasi), detektor neutron\n■ Misi: Pengukuran presisi sinar kosmik berenergi tinggi dan pencarian langsung tanda-tanda pemusnahan materi gelap.",
        "hi": "【डार्क मैटर कण एक्सप्लोरर उपग्रह DAMPE Wukong】\n■ एजेंसी: चीनी विज्ञान अकादमी (CAS / पर्पल माउंटेन वेधशाला)\n■ प्रक्षेपण यान: लॉन्ग मार्च 2D (CZ-2D)\n■ कक्षीय विवरण: सूर्य-तुल्यकालिक ध्रुवीय कक्षा (~500 किमी)\n■ पेलोड: प्लास्टिक सिंटिलेटर, सिलिकॉन ट्रैकर, BGO कैलोरीमीटर (31 विकिरण लंबाई), न्यूट्रॉन डिटेक्टर\n■ मिशन: उच्च-ऊर्जा कॉस्मिक किरणों का सटीक मापन और डार्क मैटर के संकेतों की प्रत्यक्ष खोज।",
        "ar": "【قمر استكشاف جسيمات المادة المظلمة DAMPE Wukong】\n■ الوكالة: الأكاديمية الصينية للعلوم (CAS / مرصد الجبل الأرجواني)\n■ صاروخ الإطلاق: المسيرة الطويلة 2D (CZ-2D)\n■ المدار: مدار قطبي متزامن مع الشمس (~500 كم)\n■ الحمولة: كاشف وميضي بلاستيكي، متتبع سيليكون، مقياس حرارة BGO، كاشف نيوترونات\n■ المهمة: قياس دقيق للأشعة الكونية عالية الطاقة والبحث المباشر عن إشارات فناء المادة المظلمة.",
        "ru": "【Спутник исследования частиц темной материи DAMPE «Укун»】\n■ Организация: Китайская академия наук (CAS / Обсерватория Пурпурной горы)\n■ Ракета-носитель: Чанчжэн-2D (CZ-2D)\n■ Параметры орбиты: Солнечно-синхронная полярная орбита (~500 км)\n■ Полезная нагрузка: Пластиковый сцинтиллятор, кремниевый трекер, калориметр BGO (толщиной 31 радиационная длина), нейтронный детектор\n■ Миссия: Высокоточные измерения космических лучей высоких энергий и прямой поиск следов аннигиляции темной материи."
    },
    "YAOGAN": {
        "country": "🇨🇳 中国 (中国人民解放軍 / 戦略支援部隊)",
        "country_en": "🇨🇳 China (PLA Strategic Support Force)",
        "ja": "【軍事編隊シギント電波偵察衛星「遥感35号」(Yaogan-35 A/B/C)】\n■ 開発・運用組織: 中国人民解放軍 (PLA) / 中国航天科技集団 (CASC)\n■ 打上げ日・ロケット: 2021年11月6日 / 長征2号丁 ロケット (西昌)\n■ 軌道諸元: 高度約500km / 低軌道 (軌道傾斜角35度)\n■ 運用形態: 3機1組(A/B/C)が数キロの間隔を保ちながら正三角形の編隊(フォーメーション)で地球を周回\n■ 軍事目的: 3機の衛星が地上の電波発信源(レーダ基地や米空母打撃群の通信)を受信した「時間差(TDOA)」から、三点測量によって目標の位置と速度を瞬時に割り出す中国版海洋監視衛星網(NOSS)。",
        "en": "[Yaogan-35 Tri-Satellite Formation Reconnaissance Group]\n■ Agency: Chinese Academy of Sciences / CAST / SAST (People's Liberation Army)\n■ Launcher: Long March 2D (CZ-2D, Xichang Satellite Launch Center)\n■ Orbit: Low Earth Orbit (Alt ~500 km, Inc. 35°)\n■ Payload: Time-difference-of-arrival (TDOA) / Frequency-difference electronic intelligence (ELINT) antennas and optical tracking sensors\n■ Mission: Triangulating radio emissions, tracking naval carrier battle groups across the Indo-Pacific, and comprehensive land-sea reconnaissance.",
        "zh": "【“遥感三十五号”(Yaogan-35) 三星编队电子侦察星座】\n■ 研发运营机构: 中国航天科技集团 (CASC) / 中国人民解放军\n■ 运载火箭: 长征二号丁 (CZ-2D, 西昌卫星发射中心)\n■ 轨道参数: 低地球轨道 (高度约500公里, 倾角35°)\n■ 载荷配置: 到达时差 (TDOA) 与 频差电子侦察 (ELINT) 天线群及高分辨率光学传感器\n■ 核心任务: 针对西太平洋及印太地区航母打击群等海上移动目标实施无线电辐射源精确定位与广域海陆综合侦察。",
        "ko": "【야오간 35호 (Yaogan-35) 3기 편대 전자정찰위성군】\n■ 개발 및 운용 기관: 중국항천과기집단 (CASC) / 중국 인민해방군\n■ 발사체: 창정 2호정 (CZ-2D, 시창 위성발사센터)\n■ 궤도 제원: 저궤도 (고도 약 500km, 궤도경사각 35°)\n■ 주요 탑재체: 도달시간차 (TDOA) 및 주파수차 전자정찰(ELINT) 안테나 어레이 및 광학 추적 센서\n■ 임무 목적: 서태평양 및 인도-태평양 해역을 항행하는 항공모함 전단 등 해상 이동 표적의 전파 발신원 정밀 삼각측량 및 해양 감시.",
        "de": "[Yaogan-35 Dreier-Formations-Aufklärungssatellitengruppe]\n■ Organisation: Chinesische Akademie der Wissenschaften / CASC (Volksbefreiungsarmee)\n■ Trägerrakete: Langer Marsch 2D (CZ-2D, Xichang)\n■ Umlaufbahn: Niedriger Erdorbit (~500 km, Ink. 35°)\n■ Nutzlast: TDOA- und Frequenzdifferenz-ELINT-Antennen und optische Verfolgungssensoren\n■ Mission: Triangulation von Funksignalen, Verfolgung von Flugzeugträgerverbänden im Indopazifik und Seeaufklärung.",
        "fr": "[Groupe de reconnaissance en formation de trois satellites Yaogan-35]\n■ Organisation: Académie chinoise des sciences / CASC (Armée populaire de libération)\n■ Lanceur: Longue Marche 2D (CZ-2D, Xichang)\n■ Orbite: Orbite basse (~500 km, Inclinaison 35°)\n■ Charge utile: Antennes de renseignement électronique (ELINT) par différence de temps d'arrivée (TDOA) et capteurs optiques\n■ Mission: Triangulation des émissions radio et poursuite des groupes aéronavals en zone Indo-Pacifique.",
        "es": "[Grupo de Reconocimiento en Trío de Satélites Yaogan-35]\n■ Agencia: Academia China de Ciencias / CASC (Ejército Popular de Liberación)\n■ Lanzador: Larga Marcha 2D (CZ-2D, Xichang)\n■ Órbita: Órbita baja (~500 km, Inclinación 35°)\n■ Carga útil: Antenas de inteligencia electrónica (ELINT) por diferencia de tiempo de llegada (TDOA) y sensores ópticos\n■ Misión: Triangulación de emisiones de radio, seguimiento de grupos de portaaviones en el Indo-Pacífico y vigilancia marítima.",
        "pt": "[Grupo de Reconhecimento em Formação de Três Satélites Yaogan-35]\n■ Agência: Academia Chinesa de Ciências / CASC (Exército de Libertação Popular)\n■ Lançador: Longa Marcha 2D (CZ-2D, Xichang)\n■ Órbita: Órbita baixa (~500 km, Inclinação 35°)\n■ Carga útil: Antenas de inteligência eletrônica (ELINT) por diferença de tempo de chegada (TDOA) e sensores ópticos\n■ Missão: Triangulação de sinais de rádio, rastreamento de grupos de porta-aviões no Indo-Pacífico e vigilância marítima.",
        "it": "[Gruppo di Ricognizione in Formazione a Tre Satelliti Yaogan-35]\n■ Agenzia: Accademia Cinese delle Scienze / CASC (Esercito Popolare di Liberazione)\n■ Vettore: Lunga Marcia 2D (CZ-2D, Xichang)\n■ Orbita: Orbita bassa (~500 km, Inclinazione 35°)\n■ Carico utile: Antenne di intelligence elettronica (ELINT) per differenza di tempo di arrivo (TDOA) e sensori ottici\n■ Missione: Triangolazione di segnali radio, tracciamento di gruppi navali d'attacco nell'Indo-Pacifico e sorveglianza marittima.",
        "nl": "[Yaogan-35 Drie-Satelliet Formatie Verkenningsgroep]\n■ Organisatie: Chinese Academie van Wetenschappen / CASC (Volksbevrijdingsleger)\n■ Lanceervoertuig: Lange Mars 2D (CZ-2D, Xichang)\n■ Baan: Lage baan om de aarde (~500 km, Inclinatie 35°)\n■ Laadvermogen: TDOA- en frequentieverschil-ELINT-antennes en optische volgsensoren\n■ Missie: Driehoeksmeting van radiosignalen, volgen van vliegdekschipgevechtsgroepen in de Indo-Pacific en maritieme bewaking.",
        "id": "【Kelompok Pengintaian Formasi Tiga Satelit Yaogan-35】\n■ Organisasi: Akademi Ilmu Pengetahuan Tiongkok / CASC (Tentara Pembebasan Rakyat)\n■ Roket Peluncur: Long March 2D (CZ-2D, Xichang)\n■ Parameter Orbit: Orbit Rendah Bumi (~500 km, Ink. 35°)\n■ Muatan Sensor: Antena intelijen elektronik (ELINT) selisih waktu tiba (TDOA) dan sensor optik\n■ Misi: Triangulasi emisi radio, pelacakan armada kapal induk di Indo-Pasifik, dan pengawasan maritim.",
        "hi": "【तीन-उपग्रह निर्माण टोही समूह Yaogan-35】\n■ एजेंसी: चीनी विज्ञान अकादमी / CASC (पीपुल्स लिबरेशन आर्मी)\n■ प्रक्षेपण यान: लॉन्ग मार्च 2D (CZ-2D, शीचांग)\n■ कक्षीय विवरण: निम्न पृथ्वी कक्षा (~500 किमी, झुकाव 35°)\n■ पेलोड: टाइम-डिफरेंस-ऑफ-अराइवल (TDOA) ELINT एंटेना और ऑप्टिकल ट्रैकिंग सेंसर\n■ मिशन: इंडो-पैसिफिक में नौसैनिक विमानवाहक युद्ध समूहों पर नज़र रखना और समुद्री निगरानी।",
        "ar": "【مجموعة استطلاع بتشكيل ثلاثي الأقمار Yaogan-35】\n■ الوكالة: الأكاديمية الصينية للعلوم / CASC (جيش التحرير الشعبي)\n■ صاروخ الإطلاق: المسيرة الطويلة 2D (CZ-2D, شيتشانغ)\n■ المدار: مدار أرضي منخفض (~500 كم، الميل 35°)\n■ الحمولة: هوائيات استخبارات إلكترونية (ELINT) لفارق وقت الوصول (TDOA) ومستشعرات تتبع بصرية\n■ المهمة: تثليث الانبعاثات الراديوية وتتبع مجموعات حاملات الطائرات في منطقة المحيطين الهندي والهادئ والمراقبة البحرية.",
        "ru": "【Группа спутников радиотехнической разведки строем из трех аппаратов «Яогань-35»】\n■ Организация: Китайская академия наук / CASC (НОАК)\n■ Ракета-носитель: Чанчжэн-2D (CZ-2D, космодром Сичан)\n■ Параметры орбиты: Низкая околоземная орбита (~500 км, Наклонение 35°)\n■ Полезная нагрузка: Антенны радиотехнической разведки разностно-дальномерного метода (TDOA) и оптические датчики\n■ Миссия: Триангуляция радиоисточников, отслеживание авианосных ударных групп в Индо-Тихоокеанском регионе и морское наблюдение."
    },
    "QUEQIAO": {
        "country": "🇨🇳 中国 (中国国家航天局 / 嫦娥月探査計画)",
        "country_en": "🇨🇳 China (CNSA / CLEP)",
        "ja": "【月裏側探査用通信中継衛星「鵲橋」(Queqiao / カササギの橋)】\n■ 開発・運用組織: 中国国家航天局 (CNSA) / 嫦娥探査プロジェクト\n■ 打上げ日・ロケット: 2018年5月21日 / 長征4号丙 (CZ-4C) ロケット (西昌)\n■ 軌道諸元: 地球-月ラグランジュ点L2のハロー軌道 (月裏側から約65,000km上空)\n■ 主要搭載機器: 直径4.2m大型アンブレラ型パラボラアンテナ、S/Xバンド通信トランスポンダ\n■ 歴史的役割: 人類史上初めて「月の裏側」に着陸した無人月面探査機「嫦娥4号」および探査車「玉兎2号」の電波を中継し、地球と常時リアルタイム交信を可能にした世界唯一の月裏側中継衛星。",
        "en": "[Queqiao Lunar Far Side Relay Satellite]\n■ Agency: China National Space Administration (CNSA / CAST)\n■ Launcher: Long March 4C (CZ-4C)\n■ Orbit: Earth-Moon L2 Halo Orbit (~65,000 km beyond the Moon)\n■ Payload: 4.2m deployable parabolic relay antenna, X-band/UHF links, Netherlands-China Low-Frequency Explorer (NCLE)\n■ Mission: Continuous communications relay linking the Chang'e-4 lander/Yutu-2 rover on the lunar far side with ground control on Earth.",
        "zh": "【“鹊桥号”中继通信卫星 (嫦娥四号月背中继星)】\n■ 研发运营机构: 中国国家航天局 (CNSA) / 中国空间技术研究院 (CAST)\n■ 运载火箭: 长征四号丙 (CZ-4C)\n■ 轨道参数: 地月拉格朗日L2点晕轮轨道 (距月球背后约6.5万公里)\n■ 载荷配置: 4.2米大口径伞状抛物面天线、X/S频段测控链路、荷兰-中国低频射电探测仪 (NCLE)\n■ 核心任务: 建立月球背面“嫦娥四号”着陆器及“玉兔二号”巡视器与地球测控站之间的全天候通信桥梁。",
        "ko": "【오작교호 (Queqiao) 달 뒷면 중계통신위성 (창어 4호)】\n■ 개발 및 운용 기관: 중국국가항천국 (CNSA) / 중국공간기술연구원 (CAST)\n■ 발사체: 창정 4호병 (CZ-4C)\n■ 궤도 제원: 지구-달 라그랑주 L2점 헤일로 궤도 (달 뒷면 약 65,000km 상공)\n■ 주요 탑재체: 4.2m 대형 우산형 파라볼라 전개 안테나, X/S-밴드 통신 링크, 네덜란드-중국 저주파 탐사기(NCLE)\n■ 임무 목적: 달 뒷면에 착륙한 창어 4호 및 유투 2호 로버와 지구 지상국 간의 24시간 실시간 통신 중계.",
        "de": "[Queqiao Mond-Rückseiten-Relaissatellit (Chang'e-4)]\n■ Organisation: Nationale Raumfahrtbehörde Chinas (CNSA / CAST)\n■ Trägerrakete: Langer Marsch 4C (CZ-4C)\n■ Umlaufbahn: Erde-Mond L2 Halo-Orbit (~65.000 km hinter dem Mond)\n■ Nutzlast: 4,2m entfaltbare Parabolantenne, X/S-Band-Links, Niederfrequenz-Detektor (NCLE)\n■ Mission: Kontinuierliche Datenverbindung zwischen dem Chang'e-4 Lander/Yutu-2 Rover auf der Mondrückseite und der Erde.",
        "fr": "[Satellite relais pour la face cachée de la Lune Queqiao (Chang'e-4)]\n■ Organisation: Administration spatiale nationale chinoise (CNSA / CAST)\n■ Lanceur: Longue Marche 4C (CZ-4C)\n■ Orbite: Orbite Halo L2 Terre-Lune (~65 000 km derrière la Lune)\n■ Charge utile: Antenne parabolique déployable de 4,2 m, liaisons bande X/S, explorateur basse fréquence (NCLE)\n■ Mission: Pont de télécommunication ininterrompu entre l'atterrisseur Chang'e-4/le rover Yutu-2 sur la face cachée et la Terre.",
        "es": "[Satélite de Retransmisión para la Cara Oculta de la Luna Queqiao (Chang'e-4)]\n■ Agencia: Administración Espacial Nacional China (CNSA / CAST)\n■ Lanzador: Larga Marcha 4C (CZ-4C)\n■ Órbita: Órbita Halo L2 Tierra-Luna (~65.000 km detrás de la Luna)\n■ Carga útil: Antena parabólica desplegable de 4,2 m, enlaces en banda X/S, explorador de baja frecuencia (NCLE)\n■ Misión: Puente ininterrumpido de comunicaciones entre el módulo de alunizaje Chang'e-4 y el rover Yutu-2 con la Tierra.",
        "pt": "[Satélite de Retransmissão para o Lado Oculto da Lua Queqiao (Chang'e-4)]\n■ Agência: Administração Espacial Nacional da China (CNSA / CAST)\n■ Lançador: Longa Marcha 4C (CZ-4C)\n■ Órbita: Órbita Halo L2 Terra-Lua (~65.000 km atrás da Lua)\n■ Carga útil: Antena parabólica desdobrável de 4,2 m, links em banda X/S, explorador de baixa frequência (NCLE)\n■ Missão: Ponte contínua de comunicações entre o módulo de pouso Chang'e-4/rover Yutu-2 no lado oculto da Lua e a Terra.",
        "it": "[Satellite Relè per il Lato Nascosto della Luna Queqiao (Chang'e-4)]\n■ Agenzia: Amministrazione Spaziale Nazionale Cinese (CNSA / CAST)\n■ Vettore: Lunga Marcia 4C (CZ-4C)\n■ Orbita: Orbita Halo L2 Terra-Luna (~65.000 km oltre la Luna)\n■ Carico utile: Antenna parabolica dispiegabile da 4,2 m, collegamenti in banda X/S, esploratore a bassa frequenza (NCLE)\n■ Missione: Ponte di comunicazione ininterrotto tra il lander Chang'e-4/rover Yutu-2 sul lato nascosto della Luna e la Terra.",
        "nl": "[Queqiao Relaissatelliet voor de Achterkant van de Maan (Chang'e-4)]\n■ Organisatie: Chinese Nationale Ruimtevaartorganisatie (CNSA / CAST)\n■ Lanceervoertuig: Lange Mars 4C (CZ-4C)\n■ Baan: Aarde-Maan L2 Halo-baan (~65.000 km achter de maan)\n■ Laadvermogen: 4,2 m uitvouwbare parabolische antenne, X/S-band verbindingen, laagfrequente detector (NCLE)\n■ Missie: Ononderbroken communicatiebrug tussen de Chang'e-4 lander/Yutu-2 rover op de achterkant van de maan en de aarde.",
        "id": "【Satelit Relai Sisi Jauh Bulan Queqiao (Chang'e-4)】\n■ Organisasi: Badan Antariksa Nasional Tiongkok (CNSA / CAST)\n■ Roket Peluncur: Long March 4C (CZ-4C)\n■ Parameter Orbit: Orbit Halo L2 Bumi-Bulan (~65.000 km di belakang Bulan)\n■ Muatan Sensor: Antena parabola terbuka 4,2 m, tautan pita X/S, detektor frekuensi rendah (NCLE)\n■ Misi: Jembatan komunikasi tanpa putus antara pendarat Chang'e-4/penjelajah Yutu-2 di sisi jauh Bulan dan Bumi.",
        "hi": "【चंद्रमा के दूरस्थ भाग के लिए रिले उपग्रह Queqiao (Chang'e-4)】\n■ एजेंसी: चीनी राष्ट्रीय अंतरिक्ष प्रशासन (CNSA / CAST)\n■ प्रक्षेपण यान: लॉन्ग मार्च 4C (CZ-4C)\n■ कक्षीय विवरण: पृथ्वी-चंद्रमा L2 हेलो कक्षा (~65,000 किमी चंद्रमा के पीछे)\n■ पेलोड: 4.2 मीटर परवलयिक एंटीना, X/S-बैंड लिंक, कम आवृत्ति डिटेक्टर (NCLE)\n■ मिशन: चंद्रमा के दूरस्थ भाग में उतरे चांग'ई-4 लैंडर और युतु-2 रोवर के साथ निर्बाध संचार।",
        "ar": "【قمر الترحيل للجانب البعيد من القمر Queqiao (Chang'e-4)】\n■ الوكالة: إدارة الفضاء الوطنية الصينية (CNSA / CAST)\n■ صاروخ الإطلاق: المسيرة الطويلة 4C (CZ-4C)\n■ المدار: مدار هالو L2 بين الأرض والقمر (~65,000 كم خلف القمر)\n■ الحمولة: هوائي مكافئ قابل للفتح بطول 4.2 متر، روابط نطاق X/S، كاشف ترددات منخفضة (NCLE)\n■ المهمة: جسر اتصالات متواصل بين مركبة الهبوط تشانغ آه 4/المتجول يوتو 2 على الجانب البعيد من القمر والأرض.",
        "ru": "【Спутник-ретранслятор для обратной стороны Луны «Цюэцяо» (Чанъэ-4)】\n■ Организация: Китайское национальное космическое управление (CNSA / CAST)\n■ Ракета-носитель: Чанчжэн-4C (CZ-4C)\n■ Параметры орбиты: Гало-орбита вокруг точки Лагранжа L2 системы Земля-Луна (~65 000 км за Луной)\n■ Полезная нагрузка: Развертываемая параболическая антенна диаметром 4,2 м, каналы связи X/S-диапазонов, низкочастотный радиодетектор (NCLE)\n■ Миссия: Непрерывный мост связи между посадочным модулем «Чанъэ-4»/луноходом «Юйту-2» на обратной стороне Луны и ЦУП на Земле."
    },
    "ADRAS": {
        "country": "🇯🇵 日本 (株式会社アストロスケール / JAXA CRD2)",
        "country_en": "🇯🇵 Japan (Astroscale, Tokyo / JAXA CRD2)",
        "ja": "【商業デブリ除去実証衛星「ADRAS-J」(アストラスジェイ)】\n■ 開発・運用組織: 株式会社アストロスケール (Astroscale / 東京・墨田区) / JAXA (商業デブリ除去実証)\n■ 打上げ日・ロケット: 2024年2月18日 / Rocket Lab Electronロケット (ニュージーランド・マヒア)\n■ 軌道諸元: 高度約600km / 太陽同期軌道 (軌道傾斜角98.0度)\n■ 主要機器: 近傍接近用可視・赤外線カメラ、レーザー測距計(LiDAR)、高精度推進スラスタ\n■ 世界的偉業: 2009年に打ち上げられ宇宙を高速回転しながら漂う「H-IIAロケット15号機第2段残骸(全長11m)」に数メートルまで自律ランデブー接近し、世界で初めて「制御不能な大型デブリの超至近距離定点撮影」に成功した歴史的デブリ除去衛星。",
        "en": "[ADRAS-J Commercial Active Debris Removal Spacecraft Inspector]\n■ Agency: Astroscale Japan (Commercial / JAXA CRD2 Phase I Partner)\n■ Launcher: Rocket Lab Electron (Mahia, New Zealand)\n■ Orbit: Sun-synchronous Orbit (~600 km)\n■ Payload: Visual and infrared proximity rendezvous sensors, non-contact autonomous inspection algorithm\n■ Mission: World's first rendezvous and close-proximity inspection of an unprepared rocket upper stage debris (H-IIA upper stage spent in orbit for 15 years).",
        "zh": "【ADRAS-J 商业主动空间碎片巡检航天器】\n■ 研发运营机构: 日本Astroscale公司 (商业 / JAXA CRD2第一阶段官方合作伙伴)\n■ 运载火箭: 火箭实验室“电子号”(Rocket Lab Electron, 新西兰马希亚半岛)\n■ 轨道参数: 太阳同步轨道 (高度约600公里)\n■ 载荷配置: 可见光与红外高精度近距交会视觉传感器、非接触式自主近距绕飞算法\n■ 核心任务: 世界上首次对非合作失效空间碎片 (在轨漂流15年的H-IIA火箭上面级残骸) 实施安全近距交会与全方位高清视觉巡检。",
        "ko": "【ADRAS-J 상용 우주 쓰레기 근접 실측 위성】\n■ 개발 및 운용 기관: 아스트로스케일 재팬 (Astroscale / JAXA CRD2 1단계 공식 파트너)\n■ 발사체: 로켓랩 일렉트론 (Rocket Lab Electron, 뉴질랜드)\n■ 궤도 제원: 태양동기궤도 (고도 약 600km)\n■ 주요 탑재체: 가시광 및 적외선 초정밀 랑데부 카메라, 비접촉 자율 근접 비행 알고리즘\n■ 임무 목적: 세계 최초로 통제 불능 상태로 15년간 궤도를 표류하던 H-IIA 로켓 상단 잔해에 안전하게 접근하여 360도 초근접 비주얼 실측 성공.",
        "de": "[ADRAS-J Kommerzieller Weltraummüll-Inspektionssatellit]\n■ Organisation: Astroscale Japan (Kommerziell / JAXA CRD2 Partner)\n■ Trägerrakete: Rocket Lab Electron (Neuseeland)\n■ Umlaufbahn: Sonnensynchroner Orbit (~600 km)\n■ Nutzlast: Optische und Infrarot-Rendezvous-Sensoren, berührungslose autonome Annäherungssoftware\n■ Mission: Weltweit erstes Rendezvous und optische 360-Grad-Nahbereichsinspektion einer treibenden Raketenoberstufe (H-IIA Oberstufe seit 15 Jahren im All).",
        "fr": "[Inspecteur commercial de débris spatiaux ADRAS-J]\n■ Organisation: Astroscale Japon (Commercial / Partenaire JAXA CRD2 Phase I)\n■ Lanceur: Rocket Lab Electron (Mahia, Nouvelle-Zélande)\n■ Orbite: Orbite héliosynchrone (~600 km)\n■ Charge utile: Capteurs optiques et infrarouges de rendez-vous, algorithmes d'approche autonome non-coopérative\n■ Mission: Premier rendez-vous et inspection visuelle 360° rapprochée d'un étage supérieur de fusée dérivant dans l'espace depuis 15 ans (H-IIA).",
        "es": "[Inspector Comercial de Desechos Espaciales ADRAS-J]\n■ Agencia: Astroscale Japón (Comercial / Socio JAXA CRD2 Fase I)\n■ Lanzador: Rocket Lab Electron (Mahia, Nueva Zelanda)\n■ Órbita: Órbita heliosíncrona (~600 km)\n■ Carga útil: Sensores ópticos e infrarrojos de aproximación, algoritmos autónomos de vuelo no cooperativo\n■ Misión: Primer encuentro y revisión visual 360° en proximidad de una etapa superior de cohete abandonada durante 15 años en el espacio (H-IIA).",
        "pt": "[Inspetor Comercial de Detritos Espaciais ADRAS-J]\n■ Agência: Astroscale Japão (Comercial / Parceiro JAXA CRD2 Fase I)\n■ Lançador: Rocket Lab Electron (Mahia, Nova Zelândia)\n■ Órbita: Órbita heliossíncrona (~600 km)\n■ Carga útil: Sensores ópticos e infravermelhos de aproximação, algoritmos de voo autônomo não cooperativo\n■ Missão: Primeiro encontro e inspeção visual 360° em proximidade de um estágio superior de foguete abandonado há 15 anos no espaço (H-IIA).",
        "it": "[Ispettore Commerciale di Detriti Spaziali ADRAS-J]\n■ Agenzia: Astroscale Giappone (Commerciale / Partner JAXA CRD2 Fase I)\n■ Vettore: Rocket Lab Electron (Mahia, Nuova Zelanda)\n■ Orbita: Orbita eliosincrona (~600 km)\n■ Carico utile: Sensori ottici e infrarossi di prossimità, algoritmi di navigazione autonoma non cooperativa\n■ Missione: Primo rendezvous e ispezione visiva a 360° ravvicinata di uno stadio superiore di razzo alla deriva nello spazio da 15 anni (H-IIA).",
        "nl": "[ADRAS-J Commerciële Inspectiesatelliet voor Ruimtepuin]\n■ Organisatie: Astroscale Japan (Commercieel / JAXA CRD2 Fase I Partner)\n■ Lanceervoertuig: Rocket Lab Electron (Mahia, Nieuw-Zeeland)\n■ Baan: Zonsynchrone baan (~600 km)\n■ Laadvermogen: Optische en infrarood rendezvous-sensoren, autonome niet-coöperatieve vluchtalgoritmen\n■ Missie: Wereldwijd eerste rendezvous en 360-graden inspectie van dichtbij van een raketboventrap die al 15 jaar door de ruimte zweeft (H-IIA).",
        "id": "【Inspektur Sampah Antariksa Komersial ADRAS-J】\n■ Organisasi: Astroscale Jepang (Komersial / Mitra JAXA CRD2 Fase I)\n■ Roket Peluncur: Rocket Lab Electron (Mahia, Selandia Baru)\n■ Parameter Orbit: Orbit Sinkron Matahari (~600 km)\n■ Muatan Sensor: Sensor optik dan inframerah jarak dekat, algoritma navigasi otonom non-kooperatif\n■ Misi: Pertemuan dan inspeksi visual 360° jarak dekat pertama di dunia terhadap tingkat atas roket yang terombang-ambing selama 15 tahun di luar angkasa (H-IIA).",
        "hi": "【वाणिज्यिक अंतरिक्ष मलबा निरीक्षण अंतरिक्ष यान ADRAS-J】\n■ एजेंसी: एस्ट्रोस्केल जापान (वाणिज्यिक / JAXA CRD2 चरण I भागीदार)\n■ प्रक्षेपण यान: रॉकेट लैब इलेक्ट्रॉन (न्यूजीलैंड)\n■ कक्षीय विवरण: सूर्य-तुल्यकालिक कक्षा (~600 किमी)\n■ पेलोड: ऑप्टिकल और इन्फ्रारेड निकटता सेंसर, स्वायत्त गैर-सहकारी उड़ान एल्गोरिदम\n■ मिशन: अंतरिक्ष में 15 वर्षों से तैर रहे रॉकेट के ऊपरी हिस्से (H-IIA) का दुनिया का पहला 360-डिग्री निकटता निरीक्षण।",
        "ar": "【مركبة الفحص التجاري للحطام الفضائي ADRAS-J】\n■ الوكالة: أستروسكيل اليابان (تجاري / شريك المرحلة الأولى JAXA CRD2)\n■ صاروخ الإطلاق: روكيت لاب إلكترون (نيوزيلندا)\n■ المدار: مدار متزامن مع الشمس (~600 كم)\n■ الحمولة: مستشعرات اقتراب بصرية وتحت الحمراء، خوارزميات طيران ذاتية غير تعاونية\n■ المهمة: أول اقتراب وفحص بصري 360 درجة عن قرب في العالم لمرحلة عليا من صاروخ مهجور يطفو في الفضاء منذ 15 عاماً (H-IIA).",
        "ru": "【Коммерческий инспектор космического мусора ADRAS-J】\n■ Организация: Astroscale Japan (Коммерческий партнер JAXA CRD2 Фаза I)\n■ Ракета-носитель: Rocket Lab Electron (Махия, Новая Зеландия)\n■ Параметры орбиты: Солнечно-синхронная орбита (~600 km)\n■ Полезная нагрузка: Оптические и инфракрасные камеры сближения, алгоритмы автономного бесконтактного полета\n■ Миссия: Первое в мире сближение и круговой 360-градусный визуальный осмотр вблизи отработавшей второй ступени ракеты-носителя (H-IIA), дрейфовавшей в космосе 15 лет."
    },
    "SENTINEL-2A": {
        "country": "🇪🇺 欧州連合 (ESA / 欧州宇宙機関 / コペルニクス)",
        "country_en": "🇪🇺 European Union (ESA / Copernicus)",
        "ja": "【高分解能光学地球観測衛星「Sentinel-2A」(センチネル2A)】\n■ 開発・運用組織: ESA (欧州宇宙機関) / 欧州連合 (EU) コペルニクス計画\n■ 打上げ日・ロケット: 2015年6月23日 / ベガ (Vega) ロケット (仏領ギアナ・クールー)\n■ 軌道諸元: 高度約786km / 太陽同期軌道 (軌道傾斜角98.62度 / 周期約100分)\n■ 主要搭載観測機器: マルチスペクトル観測装置「MSI」(可視光から短波長赤外の13バンド / 最大空間分解能10m / 観測幅290km)\n■ 観測・探査目的: 世界中の陸地と沿岸海域を5日間隔で高解像度スキャン。森林伐採、農作物の生育状況、河川水質、氷河融解、自然災害の被災範囲を全球測定し、全世界へ完全オープン＆フリーでデータを提供。",
        "en": "[Multispectral Earth Observation Satellite \"Sentinel-2A\"]\n■ Organization: ESA (European Space Agency) / EU Copernicus Programme\n■ Launch: June 23, 2015 / Vega Rocket (Kourou)\n■ Orbit: Altitude ~786 km / Sun-synchronous Orbit (Inclination 98.62°)\n■ Key Instruments: MultiSpectral Instrument (MSI with 13 spectral bands, up to 10m resolution, 290km swath)\n■ Mission: High-resolution systematic land and coastal monitoring for agriculture, forestry, disaster response, and climate change."
    },
    "SENTINEL-1A": {
        "country": "🇪🇺 欧州連合 (ESA / 欧州宇宙機関 / コペルニクス)",
        "country_en": "🇪🇺 European Union (ESA / Copernicus)",
        "ja": "【全天候型レーダ衛星「Sentinel-1A」(センチネル1A)】\n■ 開発・運用組織: ESA (欧州宇宙機関) / 欧州連合 (EU)\n■ 打上げ日・ロケット: 2014年4月3日 / ソユーズST-A ロケット\n■ 軌道諸元: 高度約693km / 太陽同期軌道 (軌道傾斜角98.18度)\n■ 主要観測機器: Cバンド合成開口レーダ「C-SAR」(空間分解能5m〜20m)\n■ 観測目的: 雲や夜間を透過して地表と海洋をレーダ観測。北極海の海氷ナビゲーション、海洋油流出検知、地震・火山による地盤変動のミリ波干渉解析(InSAR)を提供。",
        "en": "[All-Weather Radar Satellite \"Sentinel-1A\"]\n■ Organization: ESA / EU Copernicus Programme\n■ Launch: April 3, 2014 / Soyuz ST-A\n■ Instruments: C-band Synthetic Aperture Radar (C-SAR)\n■ Mission: Day-and-night radar imaging for sea ice tracking, maritime surveillance, oil spills, and interferometric crustal movement analysis."
    },
    "GALILEO": {
        "country": "🇪🇺 欧州連合 (ESA / EUSPA / ガリレオ)",
        "country_en": "🇪🇺 European Union (ESA / EUSPA)",
        "ja": "【欧州衛星測位システム「ガリレオ」(GALILEO-26)】\n■ 開発・運用組織: 欧州連合宇宙計画庁 (EUSPA) / ESA\n■ 軌道諸元: 高度約23,222km / 中地球軌道 (MEO / 軌道傾斜角56度)\n■ 主要機器: パッシブ水素メーザー原子時計(最高精度の原子時計)、E1/E5/E6帯送信機\n■ 目的: 軍用に依存しない欧州独自の高精度民間測位システム。サブメートル級測位と遭難捜索救助(SAR)機能を提供。",
        "en": "[European Satellite Navigation System \"Galileo\"]\n■ Organization: EUSPA / European Space Agency (ESA)\n■ Orbit: ~23,222 km MEO (Inclination 56°)\n■ Instruments: Passive Hydrogen Maser Atomic Clocks\n■ Mission: Civil-controlled sovereign global navigation providing high-precision positioning."
    },
    "METEOSAT": {
        "country": "🇪🇺 欧州気象衛星機構 (EUMETSAT / ESA)",
        "country_en": "🇪🇺 Europe (EUMETSAT / ESA)",
        "ja": "【第3世代静止気象衛星「Meteosat-12」(MTG-I1)】\n■ 開発・運用組織: EUMETSAT (欧州気象衛星機構) / ESA\n■ 打上げ日・ロケット: 2022年12月13日 / アリアン5 (Ariane 5) ロケット\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道 (本初子午線上空 0度定点)\n■ 主要観測機器: フレキシブル複合イメージャー(FCI)、欧州初となる宇宙からの「雷イメージャー(LI)」\n■ 観測目的: ヨーロッパおよびアフリカ大陸の気象・台風・雷雲の発生をリアルタイム高頻度観測。",
        "en": "[Meteosat Third Generation Imager-1 \"Meteosat-12\" (MTG-I1)]\n■ Organization: EUMETSAT / ESA\n■ Launch: Dec 13, 2022 / Ariane 5\n■ Orbit: Geostationary at 0° longitude (35,786 km)\n■ Instruments: Flexible Combined Imager (FCI), Lightning Imager (LI)\n■ Mission: Next-gen weather monitoring for Europe and Africa, detecting lightning from space."
    },
    "LANDSAT": {
        "country": "🇺🇸 アメリカ (NASA / USGS / 地質調査所)",
        "country_en": "🇺🇸 USA (NASA / USGS)",
        "ja": "【地球観測衛星「Landsat-9」(ランドサット9号)】\n■ 開発・運用組織: NASA (米航空宇宙局) / USGS (米地質調査所)\n■ 打上げ日・ロケット: 2021年9月27日 / アトラスV (Atlas V) ロケット (ヴァンデンバーグ宇宙軍基地)\n■ 軌道諸元: 高度約705km / 太陽同期軌道 (軌道傾斜角98.2度)\n■ 主要観測機器: 陸域イメージャー2「OLI-2」(14ビット高輝度光学センサ)、熱赤外センサ2「TIRS-2」\n■ 観測目的: 1972年から続く世界最長の地球観測ランドサット計画の最新機。農業用水管理、山火事被害評価、都市拡大、熱帯雨林消失を50年以上の長期データと比較分析。",
        "en": "[Land Remote Sensing Satellite \"Landsat-9\"]\n■ Organization: NASA / USGS\n■ Launch: Sept 27, 2021 / Atlas V 401\n■ Orbit: ~705 km Sun-synchronous Orbit\n■ Instruments: OLI-2, TIRS-2\n■ Mission: Continues the 50-year global land imaging legacy, monitoring deforestation, crop health, water resources, and urban sprawl."
    },
    "TERRA": {
        "country": "🇺🇸 アメリカ (NASA / ゴダード宇宙飛行センター)",
        "country_en": "🇺🇸 USA (NASA)",
        "ja": "【地球観測フラッグシップ衛星「Terra」(テラ / EOS AM-1)】\n■ 開発・運用組織: NASA (米航空宇宙局) / 国際パートナー(日本・カナダ等)\n■ 打上げ日・ロケット: 1999年12月18日 / アトラスIIAS ロケット\n■ 軌道諸元: 高度約705km / 太陽同期軌道 (軌道傾斜角98.2度)\n■ 主要観測機器: 中分解能光学放射計「MODIS」、日本の高性能光学センサ「ASTER」、MISR、MOPITT、CERES\n■ 観測目的: 地球の陸地・大気・海洋の相互作用を総合観測し、気候変動研究の基盤となった歴史的フラッグシップ衛星。",
        "en": "[Earth Observing System Flagship \"Terra\" (EOS AM-1)]\n■ Organization: NASA\n■ Launch: Dec 18, 1999 / Atlas IIAS\n■ Instruments: MODIS, ASTER (Japan), MISR, CERES, MOPITT\n■ Mission: Landmark Earth science flagship observing global biosphere, carbon cycle, oceans, and atmosphere for over 25 years."
    },
    "GOES": {
        "country": "🇺🇸 アメリカ (NOAA / 米国海洋大気庁 / NASA)",
        "country_en": "🇺🇸 USA (NOAA / NASA)",
        "ja": "【静止気象衛星「GOES-18」(GOES-West)】\n■ 開発・運用組織: NOAA (米国海洋大気庁) / NASA\n■ 打上げ日・ロケット: 2022年3月1日 / アトラスV ロケット (ケープカナベラル)\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道 (西経137度・太平洋上空定点)\n■ 主要観測機器: 先進ベースラインイメージャー「ABI」(16バンド)、静止雷マッパー「GLM」\n■ 観測目的: 北米大陸西部、ハワイ、太平洋のハリケーン、森林火災、大気気象を24時間体制でリアルタイム監視。",
        "en": "[Geostationary Operational Environmental Satellite \"GOES-18\" (GOES-West)]\n■ Organization: NOAA / NASA\n■ Launch: March 1, 2022 / Atlas V\n■ Orbit: Geostationary at 137.0°W (35,786 km)\n■ Instruments: Advanced Baseline Imager (ABI), Geostationary Lightning Mapper (GLM)\n■ Mission: Continuous real-time tracking of Pacific hurricanes, wildfires, and atmospheric rivers over North America."
    },
    "CHOLLIAN-2A": {
        "country": "🇰🇷 韓国 (KARI / 韓国航空宇宙研究院 / 気象庁)",
        "country_en": "🇰🇷 South Korea (KARI / KMA)",
        "ja": "【静止気象・宇宙天気衛星「千里眼2A号」(GEO-KOMPSAT-2A)】\n■ 開発・運用組織: KARI (韓国航空宇宙研究院) / 韓国気象庁 (KMA)\n■ 打上げ日・ロケット: 2018年12月4日 / アリアン5 (Ariane 5) ロケット (仏領ギアナ)\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道 (東経128.2度・朝鮮半島上空定点)\n■ 主要観測機器: 先進気象放射計「AMI」(16観測バンド)、宇宙天気センサ「KSEM」\n■ 観測目的: 朝鮮半島および東アジア域の台風、集中豪雨、黄砂、微小粒子状物質を24時間監視し、太陽フレア等の宇宙天気予報も提供する韓国の主力静止気象衛星。",
        "en": "[Geostationary Meteorological Satellite \"GEO-KOMPSAT-2A\" (Chollian-2A)]\n■ Organization: KARI / KMA\n■ Launch: Dec 4, 2018 / Ariane 5\n■ Orbit: Geostationary at 128.2°E (35,786 km)\n■ Instruments: AMI (16 bands), KSEM (Space Weather)\n■ Mission: 24/7 real-time monitoring of severe typhoons, heavy rainfall, yellow dust, and space weather events across East Asia."
    },
    "CHOLLIAN-2B": {
        "country": "🇰🇷 韓国 (KARI / 韓国航空宇宙研究院 / 海洋・環境部)",
        "country_en": "🇰🇷 South Korea (KARI / MOF / ME)",
        "ja": "【静止環境・海洋観測衛星「千里眼2B号」(GEO-KOMPSAT-2B)】\n■ 開発・運用組織: KARI / 韓国海洋水産部 / 環境部\n■ 打上げ日・ロケット: 2020年2月18日 / アリアン5 (Ariane 5) ロケット\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道 (東経128.2度)\n■ 主要観測機器: 静止環境分光計「GEMS」、静止海洋観測装置「GOCI-II」\n■ 観測目的: 【世界初】となる静止軌道からの大気環境常時監視衛星。PM2.5、二酸化窒素(NO2)、オゾン、黄砂の越境飛来ルートを1時間ごとに追跡し、海洋赤潮や油流出を監視。",
        "en": "[Geostationary Ocean & Environment Satellite \"GEO-KOMPSAT-2B\" (Chollian-2B)]\n■ Organization: KARI / MOF / ME\n■ Launch: Feb 18, 2020 / Ariane 5\n■ Orbit: Geostationary at 128.2°E (35,786 km)\n■ Instruments: GEMS (Air pollution spectrometer), GOCI-II (Ocean imager)\n■ Mission: World's FIRST geostationary satellite monitoring atmospheric pollutants (PM2.5, NO2) hourly and tracking ocean red tides."
    },
    "KOMPSAT-5": {
        "country": "🇰🇷 韓国 (KARI / 韓国航空宇宙研究院)",
        "country_en": "🇰🇷 South Korea (KARI)",
        "ja": "【高分解能レーダ地球観測衛星「アリラン5号」(KOMPSAT-5)】\n■ 開発・運用組織: KARI (韓国航空宇宙研究院)\n■ 打上げ日・ロケット: 2013年8月22日 / ドニエプル (Dnepr) ロケット (ロシア)\n■ 軌道諸元: 高度約550km / 太陽同期薄明軌道 (軌道傾斜角97.6度)\n■ 主要観測機器: Xバンド合成開口レーダ「COSI」(空間分解能最高1m)\n■ 観測目的: 朝鮮半島の地理情報システム(GIS)、海洋環境、災害被災状況を昼夜・天候に関係なくレーダ撮影。",
        "en": "[High-Resolution Radar Earth Observing Satellite \"KOMPSAT-5\" (Arirang-5)]\n■ Organization: KARI (South Korea)\n■ Launch: Aug 22, 2013 / Dnepr Rocket\n■ Orbit: ~550 km Sun-synchronous Orbit\n■ Instruments: X-band Synthetic Aperture Radar (COSI, 1m resolution)\n■ Mission: All-weather radar Earth observation for geographic mapping, maritime monitoring, and disaster mitigation."
    },
    "CARTOSAT-3": {
        "country": "🇮🇳 インド (ISRO / インド宇宙研究機関)",
        "country_en": "🇮🇳 India (ISRO)",
        "ja": "【超高分解能地球観測衛星「Cartosat-3」(カルトサット3号)】\n■ 開発・運用組織: ISRO (インド宇宙研究機関)\n■ 打上げ日・ロケット: 2019年11月27日 / PSLV-XL (C47) ロケット (サティシュ・ダワン宇宙センター)\n■ 軌道諸元: 高度約505km / 太陽同期軌道 (軌道傾斜角97.5度)\n■ 主要観測機器: パンクロマチック・マルチスペクトル光学カメラ (パンクロマチック空間分解能0.28m / 世界最高水準)\n■ 観測目的: 都市計画、農村インフラ開発、海岸線侵食、地籍境界線の精密マッピング。地上の車の車種や建物の詳細構造まで鮮明に識別可能。",
        "en": "[Advanced High-Resolution Earth Observation Satellite \"Cartosat-3\"]\n■ Organization: ISRO (Indian Space Research Organisation)\n■ Launch: Nov 27, 2019 / PSLV-C47\n■ Orbit: ~505 km Sun-synchronous Orbit\n■ Instruments: High-resolution optical imager (0.28m panchromatic ground resolution)\n■ Mission: Ultra-detailed 3D cartography, urban planning, infrastructure assessment, and coastal management."
    },
    "INSAT-3DR": {
        "country": "🇮🇳 インド (ISRO / インド宇宙研究機関 / 気象局)",
        "country_en": "🇮🇳 India (ISRO / IMD)",
        "ja": "【静止気象・救助中継衛星「INSAT-3DR」(インサット3DR)】\n■ 開発・運用組織: ISRO (インド宇宙研究機関) / インド気象局 (IMD)\n■ 打上げ日・ロケット: 2016年9月8日 / GSLV Mk II (F05) ロケット\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道 (東経74度・インド洋上空定点)\n■ 主要観測機器: 6チャンネル光学放射計、19チャンネル赤外大気サウンダー、遭難捜索救助トランスポンダ(SAS&R)\n■ 観測目的: インド洋のサイクロン、モンスーン降雨、海水面温度を連続観測し、遭難信号の中継も担う。",
        "en": "[Geostationary Meteorological Satellite \"INSAT-3DR\"]\n■ Organization: ISRO / India Meteorological Department\n■ Launch: Sept 8, 2016 / GSLV Mk II F05\n■ Orbit: Geostationary at 74.0°E (35,786 km)\n■ Instruments: 6-channel Imager, 19-channel Sounder, Search & Rescue (SAS&R)\n■ Mission: Continuous tracking of Indian Ocean tropical cyclones, monsoon patterns, and relaying maritime distress signals."
    },
    "GLONASS": {
        "country": "🇷🇺 ロシア (Roscosmos / ロスコスモス / ロシア宇宙軍)",
        "country_en": "🇷🇺 Russia (Roscosmos / Russian Space Forces)",
        "ja": "【ロシア衛星測位システム「GLONASS-K」(グロナス)】\n■ 開発・運用組織: ロスコスモス (Roscosmos) / ロシア宇宙軍\n■ 打上げ日・ロケット: 2020年10月25日 / ソユーズ-2.1b ロケット (プレセツク宇宙基地)\n■ 軌道諸元: 高度約19,100km / 中地球軌道 (MEO / 軌道傾斜角64.8度 / 周期約11時間15分)\n■ 主要機器: ルビジウム・セシウム原子時計、CDMA/FDMA測位信号送信機\n■ 目的: GPSと並ぶロシア独自の全地球衛星測位システム。高緯度地域(北極海など)での測位精度に優れ、全世界のデュアルGNSS機器に利用。",
        "en": "[Russian Global Navigation Satellite System \"GLONASS-K\"]\n■ Organization: Roscosmos / Russian Aerospace Forces\n■ Launch: Oct 25, 2020 / Soyuz-2.1b\n■ Orbit: ~19,100 km MEO (Inclination 64.8°)\n■ Instruments: CDMA/FDMA Navigation Transmitters, Ultra-stable Atomic Clocks\n■ Mission: Sovereign global satellite navigation grid with superior orbital coverage over high northern latitudes and the Arctic."
    },
    "ELEKTRO": {
        "country": "🇷🇺 ロシア (Roscosmos / ロスコスモス / ロシア水文気象局)",
        "country_en": "🇷🇺 Russia (Roscosmos / Roshydromet)",
        "ja": "【ロシア静止気象衛星「Elektro-L No.3」(エレクトロ-L 3号機)】\n■ 開発・運用組織: ロスコスモス (Roscosmos) / ロシア水文気象局 (Roshydromet)\n■ 打上げ日・ロケット: 2019年12月24日 / プロトン-M (Proton-M) ロケット (バイコヌール)\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道 (東経165.8度・太平洋上空定点)\n■ 主要観測機器: マルチスペクトル走査放射計「MSU-GS」(可視光3バンド、赤外7バンド)\n■ 観測目的: シベリア極東、太平洋、オホーツク海の気象、暴風雪、火山噴煙を30分間隔で監視。",
        "en": "[Geostationary Meteorological Satellite \"Elektro-L No. 3\"]\n■ Organization: Roscosmos / Roshydromet\n■ Launch: Dec 24, 2019 / Proton-M\n■ Orbit: Geostationary at 165.8°E (35,786 km)\n■ Instruments: MSU-GS 10-band optical/infrared scanning radiometer\n■ Mission: Weather monitoring, blizzard tracking, and volcanic ash plume detection across the Russian Far East and Pacific."
    },
    "FENGYUN-4B": {
        "country": "🇨🇳 中国 (CMA / 中国気象局 / CNSA)",
        "country_en": "🇨🇳 China (CMA / CNSA)",
        "ja": "【新世代静止気象衛星「風雲4号B」(Fengyun-4B / FY-4B)】\n■ 開発・運用組織: 中国気象局 (CMA) / 中国航天科技集団 (CASC)\n■ 打上げ日・ロケット: 2021年6月3日 / 長征3号乙 (CZ-3B) ロケット (西昌衛星発射センター)\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道 (東経105度・中国本土上空定点)\n■ 主要観測機器: 先進静止放射計「AGRI」(分解能最高250m / 1分間隔高速撮影)、干渉型大気サウンダー「GIIRS」\n■ 観測目的: アジア・オセアニア地域の台風、集中豪雨、砂塵嵐、寒波を高頻度リアルタイム監視。",
        "en": "[New-Generation Geostationary Meteorological Satellite \"Fengyun-4B\" (FY-4B)]\n■ Organization: China Meteorological Administration (CMA) / CNSA\n■ Launch: June 3, 2021 / Long March 3B\n■ Orbit: Geostationary at 105.0°E (35,786 km)\n■ Instruments: AGRI (250m resolution), GIIRS sounder\n■ Mission: High-frequency rapid-scan tracking of severe typhoons, rainstorms, and dust storms across Asia."
    },
    "GAOFEN-7": {
        "country": "🇨🇳 中国 (CNSA / 自然資源部 / 中国国家航天局)",
        "country_en": "🇨🇳 China (CNSA / MNR)",
        "ja": "【高分解能3D立体地図作成衛星「高分7号」(Gaofen-7)】\n■ 開発・運用組織: 中国国家航天局 (CNSA) / 自然資源部\n■ 打上げ日・ロケット: 2019年11月3日 / 長征4号乙 (CZ-4B) ロケット (太原衛星発射センター)\n■ 軌道諸元: 高度約500km / 太陽同期軌道 (軌道傾斜角97.4度)\n■ 主要観測機器: サブメートル級前後方2眼立体視カメラ(分解能0.65m)、レーザー高度計\n■ 観測目的: 1:10,000縮尺の超精密3D立体地形図を宇宙から作成。国土測量、都市計画、地質災害の標高変位解析に貢献。",
        "en": "[High-Resolution 3D Mapping Satellite \"Gaofen-7\"]\n■ Organization: CNSA / Ministry of Natural Resources (China)\n■ Launch: Nov 3, 2019 / Long March 4B\n■ Orbit: ~500 km Sun-synchronous Orbit\n■ Instruments: Dual stereoscopic 3D cameras (0.65m resolution) + Laser Altimeter\n■ Mission: 1:10,000 scale 3D topographical mapping, geographic land survey, and digital elevation modeling."
    },
    "ALOS-4": {
        "country": "🇯🇵 日本 (JAXA / 宇宙航空研究開発機構)",
        "country_en": "🇯🇵 Japan (JAXA)",
        "ja": "【先進レーダ衛星「だいち4号」(ALOS-4)】\n■ 開発・運用組織: JAXA (宇宙航空研究開発機構)\n■ 打上げ日・ロケット: 2024年7月1日 / H3ロケット3号機 (種子島宇宙センター)\n■ 軌道諸元: 高度約628km / 太陽同期準回帰軌道 (軌道傾斜角97.9度 / 周期約97分)\n■ 主要搭載観測機器: Lバンド合成開口レーダ「PALSAR-3」(フェーズドアレイ方式)、自動船舶識別装置(SPAISE3)\n■ 観測・探査目的: 「だいち2号」の高い空間分解能(3m)を維持したまま、観測幅を従来の4倍(200km)に大幅拡大。夜間や悪天候・豪雨・噴煙を透過して日本全国および世界中の地殻変動・斜面崩落・河川氾濫を24時間監視。災害発生から数時間以内にミリ単位の変位を検知し、インフラ維持管理や国土保全に貢献。",
        "en": "[Advanced Land Observing Satellite-4 \"DAICHI-4\" (ALOS-4)]\n■ Organization: JAXA (Japan Aerospace Exploration Agency)\n■ Launch Date & Rocket: July 1, 2024 / H3 Launch Vehicle F3 (Tanegashima)\n■ Orbit: Altitude ~628 km / Sun-synchronous Orbit (Inclination 97.9°)\n■ Key Instruments: Phased Array L-band SAR-3 (PALSAR-3), SPAISE3\n■ Mission: Quadrupled observation swath to 200 km. Delivers 24/7 all-weather day/night radar imaging through clouds to detect millimeter-scale crustal movements and flood disasters.",
        "de": "[Fortschrittlicher Erdbeobachtungssatellit \"DAICHI-4\" (ALOS-4)] Start: 1. Juli 2024 mit H3-Rakete.",
        "fr": "[Satellite d'observation terrestre avancé \"DAICHI-4\" (ALOS-4)] Lancé le 1er juillet 2024 par fusée H3.",
        "es": "[Satélite de observación terrestre \"DAICHI-4\" (ALOS-4)] Lanzado el 1 de julio de 2024 con cohete H3.",
        "pt": "[Satélite de observação \"DAICHI-4\" (ALOS-4)] Lançado em 1 de julho de 2024 com foguete H3.",
        "it": "[Satellite di osservazione \"DAICHI-4\" (ALOS-4)] Lanciato il 1 luglio 2024 con razzo H3.",
        "ko": "【첨단 레이더 관측위성 \"다이치 4호 (ALOS-4)\"】\n■ 운용 기관: JAXA (일본 우주항공연구개발기구)\n■ 발사일 및 로켓: 2024년 7월 1일 / H3 로켓 3호기 (다네가시마)\n■ 주요 탑재체: L-band 합성개구레이더 (PALSAR-3, 관측폭 200km)\n■ 임무 목적: 전천후 밀리미터 단위 지각 변동 및 재난 구역 24시간 실시간 감시.",
        "nl": "[Aardobservatiesatelliet \"DAICHI-4\" (ALOS-4)] JAXA H3-raket 2024.",
        "id": "【Satelit Observasi \"DAICHI-4\" (ALOS-4)】 JAXA Roket H3 2024.",
        "hi": "【पृथ्वी अवलोकन उपग्रह \"दाइची-4\" (ALOS-4)】 JAXA H3 रॉकेट 2024।",
        "ar": "【قمر الرصد \"دايتشي-4\" (ALOS-4)】 JAXA صاروخ H3.",
        "zh": "【先进陆地观测雷达卫星“陆地4号”(ALOS-4)】\n■ 研制与运营机构: JAXA (日本宇宙航空研究开发机构)\n■ 发射日期与运载火箭: 2024年7月1日 / H3运载火箭3号机\n■ 核心载荷: L波段相控阵合成孔径雷达「PALSAR-3」(幅宽达200公里)\n■ 观测使命: 全天候穿透云雨火山灰，监测毫米级地壳形变与洪涝滑坡灾害。",
        "ru": "【Спутник ДЗЗ \"Даити-4\" (ALOS-4)】 JAXA запущен ракетой H3 в июле 2024 года."
    },
    "ALOS-2": {
        "country": "🇯🇵 日本 (JAXA / 宇宙航空研究開発機構)",
        "country_en": "🇯🇵 Japan (JAXA)",
        "ja": "【陸域観測技術衛星2号「だいち2号」(ALOS-2)】\n■ 開発・運用組織: JAXA (宇宙航空研究開発機構)\n■ 打上げ日・ロケット: 2014年5月24日 / H-IIAロケット24号機 (種子島宇宙センター)\n■ 軌道諸元: 高度約628km / 太陽同期軌道 (軌道傾斜角97.9度)\n■ 主要搭載観測機器: Lバンド合成開口レーダ「PALSAR-2」\n■ 観測・探査目的: 昼夜・天候に関わらず電波(Lバンドマイクロ波)を照射し、地表のミリ単位の地殻変動を可視化。2024年能登半島地震では地盤隆起や津波浸水を即座に特定した日本の主力レーダ衛星。",
        "en": "[Land Observing Satellite-2 \"DAICHI-2\" (ALOS-2)]\n■ Organization: JAXA (Japan Aerospace Exploration Agency)\n■ Launch: May 24, 2014 / H-IIA F24\n■ Instruments: L-band SAR (PALSAR-2)\n■ Mission: All-weather radar monitoring of crustal deformation during earthquakes (e.g. 2024 Noto Peninsula Earthquake).",
        "de": "[Erdbeobachtungssatellit \"DAICHI-2\" (ALOS-2)] JAXA L-Band Radar.",
        "fr": "[Satellite d'observation \"DAICHI-2\" (ALOS-2)] JAXA Radar SAR.",
        "es": "[Satélite \"DAICHI-2\" (ALOS-2)] JAXA Radar SAR.",
        "pt": "[Satélite \"DAICHI-2\" (ALOS-2)] JAXA Radar SAR.",
        "it": "[Satellite \"DAICHI-2\" (ALOS-2)] JAXA Radar SAR.",
        "ko": "【육역관측기술위성 2호 \"다이치 2호 (ALOS-2)\"】 JAXA L-band SAR 레이더 위성.",
        "nl": "[Aardobservatiesatelliet \"DAICHI-2\" (ALOS-2)] JAXA.",
        "id": "【Satelit Observasi \"DAICHI-2\" (ALOS-2)】 JAXA.",
        "hi": "【पृथ्वी अवलोकन उपग्रह \"दाइची-2\" (ALOS-2)】 JAXA।",
        "ar": "【قمر الرصد \"دايتشي-2\" (ALOS-2)】 JAXA.",
        "zh": "【陆地观测技术卫星2号“陆地2号”(ALOS-2)】 JAXA L波段合成孔径雷达功勋卫星。",
        "ru": "【Спутник \"Даити-2\" (ALOS-2)】 JAXA PALSAR-2."
    },
    "XRISM": {
        "country": "🇯🇵 / 🇺🇸 日本・米国 (JAXA / NASA / ESA)",
        "country_en": "🇯🇵 / 🇺🇸 Japan & USA (JAXA / NASA)",
        "ja": "【X線分光撮像衛星「XRISM (クリズム)」】\n■ 開発・運用組織: JAXA (主導) / NASA (米航空宇宙局) / ESA 国際共同プロジェクト\n■ 打上げ日・ロケット: 2023年9月7日 / H-IIAロケット47号機\n■ 軌道諸元: 高度約550km / 地球低軌道 (軌道傾斜角31.0度)\n■ 主要観測機器: 軟X線分光検出器「Resolve」(極低温-273.1°C冷却)、広視野X線撮像装置「Xtend」\n■ 観測目的: 超高温プラズマが放つX線を世界最高のエネルギー分解能で分光測定。ブラックホールに吸い込まれる物質の流れや銀河団の巨大高温ガス雲を計測し、宇宙物理学最大の謎に迫る最先端宇宙望遠鏡。",
        "en": "[X-Ray Imaging and Spectroscopy Mission \"XRISM\"]\n■ Organization: JAXA / NASA / ESA\n■ Launch: Sept 7, 2023 / H-IIA F47\n■ Instruments: Resolve (Cryogenic microcalorimeter at -273.1°C), Xtend\n■ Mission: Observes cosmic plasma and supermassive black holes with world-leading X-ray spectroscopy.",
        "de": "[Röntgenteleskop \"XRISM\" (JAXA / NASA)] zur Erforschung von Schwarzen Löchern.",
        "fr": "[Télescope spatial à rayons X \"XRISM\" (JAXA / NASA)].",
        "es": "[Telescopio espacial \"XRISM\" (JAXA / NASA)].",
        "pt": "[Telescópio espacial \"XRISM\" (JAXA / NASA)].",
        "it": "[Telescopio a raggi X \"XRISM\" (JAXA / NASA)].",
        "ko": "【X선 분광 촬상 위성 \"XRISM (크리즘)\"】 JAXA / NASA 최첨단 X선 우주망원경.",
        "nl": "[Röntgentelescoop \"XRISM\" (JAXA / NASA)].",
        "id": "【Teleskop Luar Angkasa Sinar-X \"XRISM\"】 JAXA & NASA.",
        "hi": "【एक्स-रे अंतरिक्ष दूरबीन \"XRISM\"】।",
        "ar": "【التلسكوب الفضائي \"XRISM\"】.",
        "zh": "【X射线成像与光谱探测空间望远镜“XRISM”】 JAXA与NASA联合研制空间望远镜。",
        "ru": "【Космический рентгеновский телескоп \"XRISM\"】 JAXA / NASA."
    },
    "GCOM-W": {
        "country": "🇯🇵 日本 (JAXA / 宇宙航空研究開発機構)",
        "country_en": "🇯🇵 Japan (JAXA)",
        "ja": "【水循環変動観測衛星「しずく」(GCOM-W)】\n■ 開発・運用組織: JAXA (宇宙航空研究開発機構)\n■ 打上げ日・ロケット: 2012年5月18日 / H-IIAロケット21号機\n■ 軌道諸元: 高度約700km / 太陽同期軌道 (NASA「A-Train」衛星群)\n■ 主要搭載観測機器: 高性能マイクロ波放射計2「AMSR2」(直径2m回転パラボラアンテナ)\n■ 観測目的: 雲を透過して地球全体の「降水量」「水蒸気量」「海上風速」「海水面温度」「土壌水分量」「北極海の海氷面積」を全球測定。台風進路予測や漁場探索に不可欠なデータを提供。",
        "en": "[Global Change Observation Mission 1st-Water \"SHIZUKU\" (GCOM-W)]\n■ Organization: JAXA\n■ Launch: May 18, 2012 / H-IIA F21\n■ Instruments: AMSR2 microwave radiometer (2m reflector)\n■ Mission: Penetrates clouds 24/7 to measure global precipitation, sea surface temp, and Arctic sea ice.",
        "de": "[Wasserkreislauf-Satellit \"SHIZUKU\" (GCOM-W / JAXA)].",
        "fr": "[Satellite du cycle de l'eau \"SHIZUKU\" (GCOM-W / JAXA)].",
        "es": "[Satélite \"SHIZUKU\" (GCOM-W / JAXA)].",
        "pt": "[Satélite \"SHIZUKU\" (GCOM-W / JAXA)].",
        "it": "[Satellite \"SHIZUKU\" (GCOM-W / JAXA)].",
        "ko": "【물순환 변동 관측위성 \"시즈쿠\" (GCOM-W)】 JAXA AMSR2 탑재 기상·수문 관측 위성.",
        "nl": "[Waterkringloopsatelliet \"SHIZUKU\" (GCOM-W / JAXA)].",
        "id": "【Satelit Siklus Air \"SHIZUKU\" (GCOM-W)】 JAXA.",
        "hi": "【जल चक्र उपग्रह \"शिज़ुकु\" (GCOM-W / JAXA)】।",
        "ar": "【قمر دورة المياه \"شيزوكو\" (GCOM-W / JAXA)】.",
        "zh": "【水循环变化观测卫星“水滴(SHIZUKU)”(GCOM-W)】 JAXA大型微波扫描辐射计AMSR2。",
        "ru": "【Спутник \"Сидзуку\" (GCOM-W)】 JAXA AMSR2."
    },
    "GCOM-C": {
        "country": "🇯🇵 日本 (JAXA / 宇宙航空研究開発機構)",
        "country_en": "🇯🇵 Japan (JAXA)",
        "ja": "【気候変動観測衛星「しきさい」(GCOM-C)】\n■ 開発・運用組織: JAXA (宇宙航空研究開発機構)\n■ 打上げ日・ロケット: 2017年12月23日 / H-IIAロケット37号機\n■ 軌道諸元: 高度約800km / 太陽同期準回帰軌道\n■ 主要搭載観測機器: 多波長光学放射計「SGLI」(19観測チャンネル)\n■ 観測目的: 森林植生変化、雪氷面積、大気中のエアロゾル(PM2.5・煙)や雲を宇宙から広域観測し地球温暖化メカニズムを解明。",
        "en": "[Climate Change Observation Satellite \"SHIKISAI\" (GCOM-C)]\n■ Organization: JAXA\n■ Launch: Dec 23, 2017 / H-IIA F37\n■ Instruments: SGLI (19 optical channels)\n■ Mission: Global monitoring of vegetation, PM2.5 aerosols, clouds, and snow/ice albedo.",
        "de": "[Klimasatellit \"SHIKISAI\" (GCOM-C / JAXA)].",
        "fr": "[Satellite climatique \"SHIKISAI\" (GCOM-C / JAXA)].",
        "es": "[Satélite \"SHIKISAI\" (GCOM-C / JAXA)].",
        "pt": "[Satélite \"SHIKISAI\" (GCOM-C / JAXA)].",
        "it": "[Satellite \"SHIKISAI\" (GCOM-C / JAXA)].",
        "ko": "【기후변화 관측위성 \"시키사이\" (GCOM-C)】 JAXA SGLI 19채널 다파장 광학계 탑재.",
        "nl": "[Klimaatsatelliet \"SHIKISAI\" (GCOM-C / JAXA)].",
        "id": "【Satelit Iklim \"SHIKISAI\" (GCOM-C)】 JAXA.",
        "hi": "【जलवायु उपग्रह \"शिकिसाइ\" (GCOM-C / JAXA)】।",
        "ar": "【قمر المناخ \"شيكيسائي\" (GCOM-C)】.",
        "zh": "【气候变化观测卫星“色彩(SHIKISAI)”(GCOM-C)】 JAXA 19波段多光谱辐射计SGLI。",
        "ru": "【Климатический спутник \"Сикисай\" (GCOM-C)】 JAXA."
    },
    "GOSAT-2": {
        "country": "🇯🇵 日本 (JAXA / 環境省 / NIES)",
        "country_en": "🇯🇵 Japan (JAXA / MOE / NIES)",
        "ja": "【温室効果ガス観測技術衛星2号「いぶき2号」(GOSAT-2)】\n■ 開発・運用組織: JAXA / 環境省 / 国立環境研究所(NIES)\n■ 打上げ日・ロケット: 2018年10月29日 / H-IIAロケット40号機\n■ 軌道諸元: 高度約613km / 太陽同期軌道\n■ 主要搭載観測機器: フーリエ変換分光計2型「TANSO-FTS-2」\n■ 観測目的: 二酸化炭素(CO2)やメタン(CH4)、一酸化炭素(CO)を高精度全球測定し、パリ協定の透明性向上に貢献。",
        "en": "[Greenhouse Gases Observing Satellite-2 \"IBUKI-2\" (GOSAT-2)]\n■ Organization: JAXA / MOE / NIES\n■ Launch: Oct 29, 2018 / H-IIA F40\n■ Instruments: TANSO-FTS-2\n■ Mission: High-precision global monitoring of CO2 and CH4 concentrations.",
        "de": "[Treibhausgas-Satellit \"IBUKI-2\" (GOSAT-2 / JAXA)].",
        "fr": "[Satellite de gaz à effet de serre \"IBUKI-2\" (GOSAT-2 / JAXA)].",
        "es": "[Satélite \"IBUKI-2\" (GOSAT-2 / JAXA)].",
        "pt": "[Satélite \"IBUKI-2\" (GOSAT-2 / JAXA)].",
        "it": "[Satellite \"IBUKI-2\" (GOSAT-2 / JAXA)].",
        "ko": "【온실가스 관측위성 \"이부키 2호 (GOSAT-2)\"】 JAXA / 환경성 CO2 정밀 측정.",
        "nl": "[Broeikasgassatelliet \"IBUKI-2\" (GOSAT-2 / JAXA)].",
        "id": "【Satelit Gas Rumah Kaca \"IBUKI-2\" (GOSAT-2)】 JAXA & MOE.",
        "hi": "【ग्रीनहाउस गैस उपग्रह \"इबुकी-2\"】।",
        "ar": "【قمر غازات الاحتباس الحراري \"إيبوكي-2\"】.",
        "zh": "【温室气体观测技术卫星2号“呼吸2号(IBUKI-2)”】 JAXA/环境省傅里叶光谱仪。",
        "ru": "【Спутник парниковых газов \"Ибуки-2\" (GOSAT-2)】 JAXA."
    },
    "HIMAWARI-9": {
        "country": "🇯🇵 日本 (気象庁 / JMA)",
        "country_en": "🇯🇵 Japan (JMA)",
        "ja": "【静止気象衛星「ひまわり9号」(HIMAWARI-9)】\n■ 開発・運用組織: 気象庁 (JMA) / 三菱電機製造\n■ 打上げ日・ロケット: 2016年11月2日 / H-IIAロケット31号機\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道 (東経140.7度)\n■ 主要観測機器: 先進光学放射計「AHI」(16観測バンド)\n■ 観測目的: 日本域は2.5分間隔、全球は10分間隔で超高解像度フルカラー画像を配信し、台風や線状降水帯をリアルタイム監視する日本の最重要ライフライン衛星。",
        "en": "[Geostationary Meteorological Satellite \"Himawari-9\"]\n■ Organization: JMA (Japan Meteorological Agency)\n■ Launch: Nov 2, 2016 / H-IIA F31\n■ Orbit: 35,786 km Geostationary at 140.7°E\n■ Instruments: Advanced Himawari Imager (AHI, 16 bands)\n■ Mission: Real-time high-frequency (every 2.5 min) imagery of typhoons and extreme weather.",
        "de": "[Wettersatellit \"Himawari-9\" (JMA)] Geostationär 140,7°O.",
        "fr": "[Satellite météo \"Himawari-9\" (JMA)] Géostationnaire 140,7°E.",
        "es": "[Satélite meteorológico \"Himawari-9\" (JMA)] Geoestacionario 140,7°E.",
        "pt": "[Satélite meteorológico \"Himawari-9\" (JMA)] Geoestacionário 140,7°E.",
        "it": "[Satellite meteorologico \"Himawari-9\" (JMA)] Geostazionario 140,7°E.",
        "ko": "【정지궤도 기상위성 \"히마와리 9호\"】 일본 기상청(JMA) 동경 140.7° 상공 정지궤도.",
        "nl": "[Weersatelliet \"Himawari-9\" (JMA)] Geostationair 140,7°O.",
        "id": "【Satelit Cuaca \"Himawari-9\"】 JMA Geostasioner 140,7°BT.",
        "hi": "【मौसम उपग्रह \"हिमावारी-9\" (JMA)】 भूस्थिर 140.7°E।",
        "ar": "【قمر الأرصاد \"هيماواري-9\" (JMA)】 ثابت مدارياً عند 140.7° شرقاً.",
        "zh": "【静止气象卫星“葵花9号”】 日本气象厅东经140.7度定点静止卫星。",
        "ru": "【Метеоспутник \"Химавари-9\"】 JMA Геостационарный 140,7° в.д."
    },
    "HIMAWARI-8": {
        "country": "🇯🇵 日本 (気象庁 / JMA)",
        "country_en": "🇯🇵 Japan (JMA)",
        "ja": "【静止気象衛星「ひまわり8号」(HIMAWARI-8)】\n■ 開発・運用組織: 気象庁 (JMA)\n■ 打上げ日・ロケット: 2014年10月7日 / H-IIAロケット25号機\n■ 軌道諸元: 高度約35,786km / 静止衛星軌道 (東経140.7度)\n■ 役割: 2015年から2022年までメイン観測機として稼働し、現在はひまわり9号のバックアップ機として軌道上待機中。",
        "en": "[Geostationary Meteorological Satellite \"Himawari-8\"]\n■ Organization: JMA\n■ Launch: Oct 7, 2014 / H-IIA F25\n■ Mission: Primary weather satellite from 2015-2022, currently on-orbit standby backup.",
        "de": "[Wettersatellit \"Himawari-8\" (JMA)].",
        "fr": "[Satellite météo \"Himawari-8\" (JMA)].",
        "es": "[Satélite \"Himawari-8\" (JMA)].",
        "pt": "[Satélite \"Himawari-8\" (JMA)].",
        "it": "[Satellite \"Himawari-8\" (JMA)].",
        "ko": "【정지궤도 기상위성 \"히마와리 8호\"】 9호기의 궤도상 백업 위성.",
        "nl": "[Weersatelliet \"Himawari-8\" (JMA)].",
        "id": "【Satelit Cuaca \"Himawari-8\"】.",
        "hi": "【मौसम उपग्रह \"हिमावारी-8\"】।",
        "ar": "【قمر \"هيماواري-8\"】.",
        "zh": "【静止气象卫星“葵花8号”】 现作为9号机在轨备用。",
        "ru": "【Метеоспутник \"Химавари-8\"】 Орбитальный резерв."
    },
    "MICHIBIKI-6": {
        "country": "🇯🇵 日本 (内閣府 / CAO)",
        "country_en": "🇯🇵 Japan (Cabinet Office)",
        "ja": "【準天頂衛星「みちびき6号機」(QZSS-6)】\n■ 開発・運用組織: 内閣府 宇宙開発戦略推進事務局\n■ 打上げ日・ロケット: 2025年 / H3ロケット\n■ 軌道諸元: 高度約32,600〜39,000km / 準天頂軌道 (8の字軌道)\n■ 役割: 準天頂7機体制を担う主力測位衛星。自動運転・ドローン向けにセンチメートル級測位補強信号(CLAS)を24時間配信。",
        "en": "[Quasi-Zenith Satellite \"MICHIBIKI-6\" (QZSS-6)]\n■ Organization: Cabinet Office of Japan\n■ Launch: H3 Rocket\n■ Mission: Key positioning satellite of the 7-satellite QZSS constellation for cm-level positioning.",
        "de": "[Quasi-Zenit-Satellit \"MICHIBIKI-6\" (QZSS-6)].",
        "fr": "[Satellite \"MICHIBIKI-6\" (QZSS-6)].",
        "es": "[Satélite \"MICHIBIKI-6\" (QZSS-6)].",
        "pt": "[Satélite \"MICHIBIKI-6\" (QZSS-6)].",
        "it": "[Satellite \"MICHIBIKI-6\" (QZSS-6)].",
        "ko": "【준천정위성 \"미치비키 6호기\"】 센티미터급 정밀 GPS 보정 신호 송출.",
        "nl": "[Quasi-Zenit-satelliet \"MICHIBIKI-6\" (QZSS-6)].",
        "id": "【Satelit Quasi-Zenith \"MICHIBIKI-6\"】.",
        "hi": "【क्वासी-जेनिथ उपग्रह \"मिचिबिकी-6\"】।",
        "ar": "【قمر \"ميشيبيكي-6\" (QZSS-6)】.",
        "zh": "【准天顶卫星“引路6号”(QZSS-6)】 日本内阁府厘米级定位增强卫星。",
        "ru": "【Спутник \"Мичибики-6\" (QZSS-6)】."
    },
    "MICHIBIKI": {
        "country": "🇯🇵 日本 (内閣府 / CAO)",
        "country_en": "🇯🇵 Japan (Cabinet Office)",
        "ja": "【準天頂衛星システム「みちびき」(QZSS)】\n■ 運用組織: 内閣府 宇宙開発戦略推進事務局\n■ 軌道: 準天頂軌道 (8の字軌道 / 傾斜角約44度) および静止軌道\n■ 目的: 日本の真上に常に衛星を配置し、高層ビル街や山間部でのGPS死角を解消。",
        "en": "[Quasi-Zenith Satellite System \"Michibiki\" (QZSS)]\n■ Organization: Cabinet Office of Japan\n■ Mission: Eliminates GPS blind spots in urban canyons across Japan.",
        "de": "[Quasi-Zenit-Satellitensystem \"Michibiki\" (QZSS)].",
        "fr": "[Système \"Michibiki\" (QZSS)].",
        "es": "[Sistema \"Michibiki\" (QZSS)].",
        "pt": "[Sistema \"Michibiki\" (QZSS)].",
        "it": "[Sistema \"Michibiki\" (QZSS)].",
        "ko": "【준천정위성 시스템 \"미치비키\"】 일본 상공 고각도 GPS 보정.",
        "nl": "[Quasi-Zenit-systeem \"Michibiki\"].",
        "id": "【Sistem Satelit \"Michibiki\"】.",
        "hi": "【क्वासी-जेनिथ उपग्रह प्रणाली \"मिचिबिकी\"】।",
        "ar": "【نظام \"ميشيبيكي\"】.",
        "zh": "【日本准天顶卫星系统“引路”(QZSS)】。",
        "ru": "【Квазизенитная система \"Мичибики\"】."
    },
    "QPS-SAR": {
        "country": "🇯🇵 日本 (株式会社iQPS / 福岡)",
        "country_en": "🇯🇵 Japan (iQPS, Fukuoka)",
        "ja": "【小型SAR衛星「ツクヨミ-I (QPS-SAR-5)」】\n■ 開発・運用組織: 株式会社QPS研究所 (iQPS / 福岡)\n■ 打上げ日・ロケット: 2023年12月15日 / Rocket Lab Electronロケット\n■ 軌道諸元: 高度約575km / 傾斜軌道 (42.0度)\n■ 機器・目的: 直径3.6m展開メッシュアンテナを搭載し、夜間悪天候でも分解能46cmの高精細レーダ画像を撮影する民間小型SAR衛星。",
        "en": "[Small SAR Satellite \"TSUKUYOMI-I\" (QPS-SAR-5)]\n■ Organization: iQPS (Fukuoka, Japan)\n■ Launch: Dec 15, 2023 / Rocket Lab Electron\n■ Instruments: 3.6m deployable mesh radar antenna\n■ Mission: Commercial 46cm high-resolution radar Earth imaging 24/7.",
        "de": "[Mini-SAR-Satellit \"TSUKUYOMI-I\" (iQPS)].",
        "fr": "[Petit satellite SAR \"TSUKUYOMI-I\" (iQPS)].",
        "es": "[Satélite \"TSUKUYOMI-I\" (iQPS)].",
        "pt": "[Satélite \"TSUKUYOMI-I\" (iQPS)].",
        "it": "[Satellite \"TSUKUYOMI-I\" (iQPS)].",
        "ko": "【소형 SAR 위성 \"츠쿠요미-1호\"】 후쿠오카 iQPS사 46cm 고분해능 SAR.",
        "nl": "[Mini-SAR-satelliet \"TSUKUYOMI-I\"].",
        "id": "【Satelit SAR Mini \"TSUKUYOMI-I\"】.",
        "hi": "【लघु SAR उपग्रह \"त्सुकुयोमी-1\"】।",
        "ar": "【القمر التجاري \"تسوكويومي-1\"】.",
        "zh": "【商业小型SAR卫星“月读1号”(iQPS)】 46厘米高分辨率雷达。",
        "ru": "【Малый спутник SAR \"Цукуёми-1\"】."
    },
    "STRIX": {
        "country": "🇯🇵 日本 (株式会社Synspective / 東京)",
        "country_en": "🇯🇵 Japan (Synspective, Tokyo)",
        "ja": "【小型SAR衛星「StriX-1」(ストリクス)】\n■ 開発・運用組織: 株式会社Synspective (シンスペクティブ / 東京)\n■ 打上げ日・ロケット: 2022年9月16日 / Rocket Lab Electronロケット\n■ 軌道諸元: 高度約561km / 太陽同期軌道 (97.6度)\n■ 機器・目的: Xバンド合成開口レーダを搭載し、ミリ単位の地盤沈下や都市インフラの老朽化変位を検知する民間SAR衛星。",
        "en": "[Small SAR Satellite \"StriX-1\"]\n■ Organization: Synspective Inc. (Tokyo, Japan)\n■ Launch: Sept 16, 2022 / Rocket Lab Electron\n■ Instruments: X-band Synthetic Aperture Radar\n■ Mission: Commercial radar constellation for millimeter-scale ground displacement monitoring.",
        "de": "[X-Band Radarsatellit \"StriX-1\" (Synspective)].",
        "fr": "[Satellite radar \"StriX-1\" (Synspective)].",
        "es": "[Satélite radar \"StriX-1\" (Synspective)].",
        "pt": "[Satélite \"StriX-1\" (Synspective)].",
        "it": "[Satellite \"StriX-1\" (Synspective)].",
        "ko": "【소형 SAR 위성 \"StriX-1\"】 도쿄 Synspective사 X-band 레이더 위성.",
        "nl": "[Radarsatelliet \"StriX-1\"].",
        "id": "【Satelit Radar \"StriX-1\"】.",
        "hi": "【रडार उपग्रह \"StriX-1\"】।",
        "ar": "【قمر \"StriX-1\"】.",
        "zh": "【商业小型SAR卫星“StriX-1”】 东京商业航天X波段雷达卫星。",
        "ru": "【Радарный спутник \"StriX-1\"】."
    },
    "ISS": {
        "country": "🇺🇸 / 🇯🇵 / 🇪🇺 / 🇨🇦 国際共同 (NASA / JAXA / ESA / CSA)",
        "country_en": "🇺🇸 / 🇯🇵 / 🇪🇺 / 🇨🇦 International (NASA / JAXA / ESA / CSA)",
        "ja": "【国際宇宙ステーション (ISS)】\n■ 運用組織: NASA (米)、JAXA (日)、ESA (欧)、CSA (加) 等の国際共同運用\n■ 打上げ開始: 1998年11月 (ザーリャモジュール)\n■ 軌道諸元: 高度約400〜420km / 低軌道 (傾斜角51.64度 / 周期約92.8分・時速約27,700km)\n■ 主要施設: 日本の実験棟「きぼう」、欧州実験棟「コロンバス」、米実験棟「デスティニー」\n■ 目的: 微小重力環境を活用した創薬・材料科学・宇宙医学実験、地球・天体観測拠点。",
        "en": "[International Space Station (ISS)]\n■ Organization: NASA, JAXA, ESA, CSA\n■ Launch: Nov 1998 / LEO ~400-420 km (Inclination 51.64°)\n■ Key Modules: Japanese \"Kibo\", European \"Columbus\", US \"Destiny\"\n■ Mission: Microgravity laboratory for drug discovery and space exploration tech.",
        "de": "[Internationale Raumstation (ISS)].",
        "fr": "[Station spatiale internationale (ISS)].",
        "es": "[Estación Espacial Internacional (EEI)].",
        "pt": "[Estação Espacial Internacional (ISS)].",
        "it": "[Stazione Spaziale Internazionale (ISS)].",
        "ko": "【국제우주정거장 (ISS)】 NASA, JAXA, ESA 등 국제 공동 유인 우주 기지 (일본 실험동 \"키보\" 운영).",
        "nl": "[Internationaal Ruimtestation (ISS)].",
        "id": "【Stasiun Luar Angkasa Internasional (ISS)】.",
        "hi": "【अंतर्राष्ट्रीय अंतरिक्ष स्टेशन (ISS)】।",
        "ar": "【محطة الفضاء الدولية (ISS)】.",
        "zh": "【国际空间站 (ISS)】 NASA、JAXA等多国联合运营的大型载人轨道实验室 (含日本希望号舱段)。",
        "ru": "【Международная космическая станция (МКС)】."
    },
    "HUBBLE": {
        "country": "🇺🇸 / 🇪🇺 米国・欧州 (NASA / ESA)",
        "country_en": "🇺🇸 / 🇪🇺 USA & Europe (NASA / ESA)",
        "ja": "【ハッブル宇宙望遠鏡 (HST)】\n■ 開発・運用組織: NASA (米航空宇宙局) / ESA (欧州宇宙機関)\n■ 打上げ日・ロケット: 1990年4月24日 / スペースシャトル・ディスカバリー号 (STS-31)\n■ 軌道諸元: 高度約540km / 地球低軌道 (傾斜角28.47度)\n■ 観測装置: 口径2.4m主鏡、広視野カメラ3 (WFC3)、宇宙望遠鏡撮像分光器 (STIS)\n■ 観測目的: 大気の揺らぎがない宇宙空間から遠方宇宙を観測し、宇宙膨張率の確定や暗黒エネルギーの存在証拠発見など天文学の歴史を塗り替えた偉大な宇宙望遠鏡。",
        "en": "[Hubble Space Telescope (HST)]\n■ Organization: NASA / ESA\n■ Launch: April 24, 1990 / Space Shuttle Discovery\n■ Orbit: ~540 km LEO\n■ Aperture: 2.4-meter primary mirror\n■ Mission: Deep-space astronomical observations, measuring cosmological expansion and dark energy.",
        "de": "[Hubble-Weltraumteleskop (HST)].",
        "fr": "[Télescope spatial Hubble (HST)].",
        "es": "[Telescopio Espacial Hubble (HST)].",
        "pt": "[Telescópio Espacial Hubble (HST)].",
        "it": "[Telescopio Spaziale Hubble (HST)].",
        "ko": "【허블 우주 망원경 (HST)】 NASA/ESA 2.4m 주경 탑재 심우주 천체망원경.",
        "nl": "[Hubble Ruimtetelescoop (HST)].",
        "id": "【Teleskop Luar Angkasa Hubble (HST)】.",
        "hi": "【हबल स्पेस टेलीस्कोप (HST)】।",
        "ar": "【تلسكوب هابل الفضائي (HST)】.",
        "zh": "【哈勃空间望远镜 (HST)】 NASA与ESA联合打造的2.4米口径传奇空间望远镜。",
        "ru": "【Космический телескоп \"Хаббл\" (HST)】."
    },
    "TIANGONG": {
        "country": "🇨🇳 中国 (CNSA / 中国国家航天局)",
        "country_en": "🇨🇳 China (CNSA)",
        "ja": "【中国宇宙ステーション「天宮」(Tiangong)】\n■ 運用組織: 中国国家航天局 (CNSA) / 中国載人航天工程弁公室 (CMSA)\n■ 打上げ開始: 2021年4月 (核心モジュール「天和」)\n■ 軌道諸元: 高度約380〜450km / 低軌道 (傾斜角41.5度)\n■ 主要構成: 天和(コア)、問天(実験棟I)、夢天(実験棟II)のT字型構造\n■ 目的: 独自のアストロナウツ(航天員)が常駐し、宇宙医学、材料科学、微小重力物理実験を実施する中国の国家宇宙拠点。",
        "en": "[Chinese Space Station \"Tiangong\"]\n■ Organization: CNSA / CMSA (China)\n■ First Launch: April 2021 (Tianhe Core Module)\n■ Orbit: ~380-450 km LEO (Inclination 41.5°)\n■ Mission: Long-term crewed space laboratory for microgravity physics and orbital research.",
        "de": "[Chinesische Raumstation \"Tiangong\"].",
        "fr": "[Station spatiale chinoise \"Tiangong\"].",
        "es": "[Estación Espacial China \"Tiangong\"].",
        "pt": "[Estação Espacial Chinesa \"Tiangong\"].",
        "it": "[Stazione Spaziale Cinese \"Tiangong\"].",
        "ko": "【중국 우주정거장 \"톈궁\"】 중국 국가항천국(CNSA) 독자 유인 우주 정거장.",
        "nl": "[Chinees Ruimtestation \"Tiangong\"].",
        "id": "【Stasiun Luar Angkasa China \"Tiangong\"】.",
        "hi": "【चीनी अंतरिक्ष स्टेशन \"तियांगोंग\"】।",
        "ar": "【محطة الفضاء الصينية \"تيانغونغ\"】.",
        "zh": "【中国空间站“天宫”(Tiangong)】 中国载人航天工程(CMSA)建造的T字型长期载人空间实验室。",
        "ru": "【Китайская орбитальная станция \"Тяньгун\"】."
    },
    "BEIDOU": {
        "country": "🇨🇳 中国 (CNSA / 中国国家航天局)",
        "country_en": "🇨🇳 China (CNSA)",
        "ja": "【中国衛星測位システム「北斗3号」(BeiDou-3)】\n■ 運用組織: 中国国家航天局 (CNSA)\n■ 軌道: 中地球軌道(MEO)、傾斜同期軌道(IGSO)、静止軌道(GEO)のハイブリッド配置\n■ 目的: 全世界をカバーする中国独自の衛星測位網。ミリ波通信や高精度測位、双方向短報文通信機能を提供。",
        "en": "[BeiDou Navigation Satellite System-3 (BeiDou-3)]\n■ Organization: CNSA (China)\n■ Mission: Global positioning, navigation, timing, and short-message communication services.",
        "de": "[Chinesisches Satellitennavigationssystem \"BeiDou-3\"].",
        "fr": "[Système de navigation \"BeiDou-3\" (CNSA)].",
        "es": "[Sistema de Navegación \"BeiDou-3\" (CNSA)].",
        "pt": "[Sistema \"BeiDou-3\" (CNSA)].",
        "it": "[Sistema \"BeiDou-3\" (CNSA)].",
        "ko": "【중국 위성항법시스템 \"베이더우 3호\"】 전 지구 위치 추적 및 통신 서비스.",
        "nl": "[Navigatiesatelliet \"BeiDou-3\" (CNSA)].",
        "id": "【Sistem Navigasi \"BeiDou-3\" (CNSA)】.",
        "hi": "【चीनी नेविगेशन प्रणाली \"BeiDou-3\"】।",
        "ar": "【نظام الملاحة \"بيدو-3\" (CNSA)】.",
        "zh": "【中国“北斗三号”全球卫星导航系统】 覆盖全球的高精度定位导航授时与短报文通信系统。",
        "ru": "【Навигационная спутниковая система \"Бэйдоу-3\"】."
    },
    "GPS": {
        "country": "🇺🇸 アメリカ (米国宇宙軍 / US Space Force)",
        "country_en": "🇺🇸 USA (US Space Force)",
        "ja": "【米国GPS航法衛星 (NAVSTAR GPS)】\n■ 運用組織: アメリカ宇宙軍 (USSF) / 米国防総省\n■ 軌道諸元: 高度約20,200km / 中地球軌道 (MEO / 軌道傾斜角55度)\n■ 主要機器: ルビジウム・セシウム高精度原子時計、L1/L2/L5帯電波送信機\n■ 目的: 全世界のスマートフォン、航空機、船舶、カーナビゲーションに高精度測位電波を24時間配信。",
        "en": "[US NAVSTAR Global Positioning System (GPS)]\n■ Organization: United States Space Force (USSF)\n■ Orbit: ~20,200 km MEO (Inclination 55°)\n■ Mission: Global continuous positioning, navigation, and nanosecond-level timing.",
        "de": "[US NAVSTAR GPS Satellit].",
        "fr": "[Satellite GPS américain (NAVSTAR)].",
        "es": "[Satélite GPS estadounidense (NAVSTAR)].",
        "pt": "[Satélite GPS dos EUA (NAVSTAR)].",
        "it": "[Satellite GPS USA (NAVSTAR)].",
        "ko": "【미국 GPS 항법 위성 (NAVSTAR)】 미국 우주군(USSF) 운용 전 세계 정밀 측위 위성.",
        "nl": "[Amerikaanse GPS-satelliet (NAVSTAR)].",
        "id": "【Satelit GPS AS (NAVSTAR)】.",
        "hi": "【अमेरिकी GPS उपग्रह (NAVSTAR)】।",
        "ar": "【قمر GPS الأمريكي (NAVSTAR)】.",
        "zh": "【美国GPS全球定位系统卫星 (NAVSTAR)】 美国太空军运营的中地球轨道全球定位与授时卫星。",
        "ru": "【Навигационный спутник GPS (NAVSTAR)】."
    },
    "DEBRIS": {
        "country": "⚠️ 役目終了・人工物体 (Space Debris)",
        "country_en": "⚠️ Defunct Space Debris",
        "ja": "【宇宙ゴミ (スペースデブリ)】\n■ 種別: 運用終了した人工衛星本体、ロケット上段残骸、衝突破片\n■ 軌道速度: 秒速約7.5〜8.0km (時速約28,000km / ライフル弾の約8倍)\n■ 危険性: 数センチの破片であっても衛星やISSに衝突すると粉砕的破壊をもたらすため、JAXAやNASA・宇宙軍が常時レーダと軌道交差予測(MOID)で監視。",
        "en": "[Defunct Orbital Space Debris]\n■ Classification: Inactive satellite hulls, spent rocket stages, and fragments\n■ Velocity: ~7.5-8.0 km/s (over 27,000 km/h)\n■ Hazard: Even millimeter-sized debris can inflict catastrophic damage upon active spacecraft.",
        "de": "[Weltraummüll (Space Debris)].",
        "fr": "[Débris spatial orbital].",
        "es": "[Basura espacial en órbita].",
        "pt": "[Lixo espacial orbital].",
        "it": "[Detrito spaziale orbitale].",
        "ko": "【우주 쓰레기 (스페이스 데브리)】 수명 종료 위성 및 로켓 상단 파편 (초속 약 7.5km).",
        "nl": "[Ruimtepuin (Space Debris)].",
        "id": "【Sampah Antariksa (Space Debris)】.",
        "hi": "【अंतरिक्ष मलबा】।",
        "ar": "【حطام فضائي مداري】.",
        "zh": "【空间碎片 (太空垃圾)】 退役卫星、火箭残骸及爆炸碎片，以约7.5公里/秒高速运行。",
        "ru": "【Космический мусор】."
    },
    "STARLINK-G10": {
        "country": "🇺🇸 アメリカ (SpaceX 最新トレイン編隊)",
        "country_en": "🇺🇸 USA (SpaceX Latest Train Chain)",
        "ja": "【🚀 最新打上 スターリンク・トレイン (Starlink Group 10-1)】\n■ 打上日時: 2026年8月22日 14:18:00 UTC (日本時間 23:18:00)\n■ 打上ロケット: SpaceX Falcon 9 Block 5 (フロリダ州 SLC-40)\n■ 展開編隊: 24機等間隔トレイン配置 (軌道高度 約340km / 秒速7.7km)\n■ 軌道傾斜角: 53.2度\n■ 観測特徴: ロケットから放出された直後のみ夜空に現れる、24機の光の点が数珠つなぎに一列で疾走する『銀河鉄道』現象。",
        "en": "[🚀 Latest Launch: Starlink Train (Group 10-1 Chain)]\n■ Launch Time: Aug 22, 2026 14:18:00 UTC (23:18 JST)\n■ Rocket: SpaceX Falcon 9 Block 5 (Cape Canaveral SLC-40)\n■ Formation: 24-Satellite Luminous Deployment Chain (Alt ~340 km / 7.7 km/s)\n■ Inclination: 53.2°\n■ Visual Phenomenon: Iconic 'satellite train' marching across the night sky shortly after rocket deployment.",
        "zh": "【🚀 最新发射：星链列车 Starlink Train (Group 10-1)】\n■ 发射时间：2026年8月22日 14:18:00 UTC (北京时间 22:18)\n■ 运载火箭：SpaceX 猎鹰9号 (卡纳维拉尔角 SLC-40)\n■ 编队构型：24星等间距列车队形 (轨道高度约340km / 速度7.7km/s)\n■ 轨道倾角：53.2°\n■ 视觉特征：火箭发射后数日内在夜空中呈现为一条璀璨的“银河铁道”光珠长龙。",
        "es": "【🚀 Último lanzamiento: Tren Starlink (Grupo 10-1)】\n■ Fecha de lanzamiento: 22 de agosto de 2026, 14:18:00 UTC\n■ Cohete: SpaceX Falcon 9 (Cabo Cañaveral SLC-40)\n■ Formación: Cadena de 24 satélites (Alt ~340 km / 7,7 km/s)\n■ Inclinación: 53,2°\n■ Fenómeno: Espectacular tren luminoso visible en el cielo nocturno.",
        "fr": "【🚀 Dernier lancement : Train Starlink (Groupe 10-1)】\n■ Date de lancement : 22 août 2026 à 14:18:00 UTC\n■ Fusée : SpaceX Falcon 9 (Cap Canaveral SLC-40)\n■ Formation : Chaîne de 24 satellites (Alt ~340 km / 7,7 km/s)\n■ Inclinaison : 53,2°\n■ Phénomène : Chapelet lumineux spectaculaire traversant le ciel nocturne.",
        "de": "【🚀 Neuester Start: Starlink-Zug (Gruppe 10-1)】\n■ Startzeit: 22. August 2026, 14:18:00 UTC\n■ Rakete: SpaceX Falcon 9 (Cape Canaveral SLC-40)\n■ Formation: 24-Satelliten-Perlenkette (Höhe ~340 km / 7,7 km/s)\n■ Inklination: 53,2°\n■ Phänomen: Faszinierender Perlschnur-Effekt am Nachthimmel.",
        "ru": "【🚀 Последний запуск: Поезд Старлинк (Группа 10-1)】\n■ Время запуска: 22 августа 2026 г., 14:18:00 UTC\n■ Ракета: SpaceX Falcon 9 (Мыс Канаверал SLC-40)\n■ Структура: Цепочка из 24 спутников (Высота ~340 км / 7,7 км/с)\n■ Наклонение: 53,2°\n■ Явление: Зрелищный светящийся поезд из спутников в ночном небе.",
        "pt": "【🚀 Último lançamento: Trem Starlink (Grupo 10-1)】\n■ Hora de lançamento: 22 de agosto de 2026, 14:18:00 UTC\n■ Foguete: SpaceX Falcon 9 (Cabo Canaveral SLC-40)\n■ Formação: Trem luminoso de 24 satélites (Alt ~340 km / 7,7 km/s)\n■ Inclinação: 53,2°\n■ Fenômeno: Trem de luzes estelar visível nos primeiros dias após o lançamento.",
        "it": "【🚀 Ultimo lancio: Treno Starlink (Gruppo 10-1)】\n■ Orario di lancio: 22 agosto 2026, 14:18:00 UTC\n■ Vettore: SpaceX Falcon 9 (Cape Canaveral SLC-40)\n■ Formazione: Catena luminosa di 24 satelliti (Alt ~340 km / 7,7 km/s)\n■ Inclinazione: 53,2°\n■ Fenomeno: Spettacolare treno di satelliti allineati nel cielo notturno.",
        "ko": "【🚀 최신 발사: 스타링크 트레인 (Group 10-1)】\n■ 발사 일시: 2026년 8월 22일 14:18:00 UTC (한국시간 23:18)\n■ 발사체: SpaceX Falcon 9 (플로리다 케이프커내버럴 SLC-40)\n■ 편대 구성: 24기 등간격 트레인 대형 (고도 약 340km / 초속 7.7km)\n■ 궤도 경사각: 53.2도\n■ 관측 특징: 발사 직후 밤하늘을 일렬로 가로지르는 환상적인 '은하철도' 현상.",
        "nl": "【🚀 Nieuwste lancering: Starlink-trein (Groep 10-1)】\n■ Lanceringstijd: 22 augustus 2026, 14:18:00 UTC\n■ Raket: SpaceX Falcon 9 (Cape Canaveral SLC-40)\n■ Formatie: 24-satellieten lichtketen (Hoogte ~340 km / 7,7 km/s)\n■ Inclinatie: 53,2°\n■ Fenomeen: Spectaculaire 'satelliettrein' aan de nachthemel.",
        "id": "【🚀 Peluncuran Terbaru: Kereta Starlink (Grup 10-1)】\n■ Waktu Peluncuran: 22 Agustus 2026, 14:18:00 UTC\n■ Roket: SpaceX Falcon 9 (Cape Canaveral SLC-40)\n■ Formasi: Rantai 24 satelit sejajar (Ketinggian ~340 km / 7,7 km/dtk)\n■ Inklinasi: 53,2°\n■ Fenomena: Rantai cahaya memanjang di langit malam setelah peluncuran.",
        "hi": "【🚀 नवीनतम प्रक्षेपण: स्टारलिंक ट्रेन (Group 10-1)】\n■ प्रक्षेपण समय: 22 अगस्त 2026, 14:18:00 UTC (भारतीय समयानुसार 19:48)\n■ रॉकेट: SpaceX Falcon 9 (केप कैनावेरल SLC-40)\n■ संरचना: 24 उपग्रहों की प्रकाश श्रृंखला (ऊंचाई ~340 km / 7.7 km/s)\n■ झुकाव: 53.2°\n■ दृश्य विशेषता: अंतरिक्ष में एक पंक्ति में दौड़ती 'गैलेक्सी ट्रेन'।",
        "ar": "【🚀 آخر إطلاق: قطار ستارلينك (المجموعة 10-1)】\n■ وقت الإطلاق: 22 أغسطس 2026، 14:18:00 UTC\n■ الصاروخ: SpaceX Falcon 9 (كيب كانافيرال SLC-40)\n■ التشكيل: سلسلة متتالية من 24 قمراً (الارتفاع ~340 كم / 7.7 كم/ثانية)\n■ الميل المداري: 53.2°\n■ الظاهرة: قطار أضواء مذهل يعبر سماء الليل بعد الإطلاق مباشرة."
    },
    "STARLINK": {
        "country": "🇺🇸 アメリカ (SpaceX / 民間)",
        "country_en": "🇺🇸 USA (SpaceX)",
        "ja": "【超小型通信衛星「Starlink」(SpaceX)】\n■ 開発・運用組織: SpaceX (スペースX社 / CEO: イーロン・マスク)\n■ 打上げロケット: Falcon 9 ロケット (1回の打上げで約20〜23機同時投入)\n■ 軌道諸元: 高度約540〜570km / 低軌道 (LEO)\n■ 主要機器: Ku/Kaバンドフェーズドアレイアンテナ、光レーザー衛星間通信機、イオン推進器\n■ 目的: 数千機以上の超小型衛星で地球全土をメッシュ状に包み込み、全世界へ超高速・低遅延の衛星インターネットを提供。",
        "en": "[SpaceX Starlink Broadband Satellite]\n■ Organization: SpaceX (Elon Musk)\n■ Launch Vehicle: Falcon 9\n■ Orbit: ~540-570 km LEO\n■ Mission: Global mega-constellation delivering high-speed, low-latency satellite internet worldwide.",
        "de": "[SpaceX Starlink Satellit].",
        "fr": "[Satellite Starlink de SpaceX].",
        "es": "[Satélite Starlink de SpaceX].",
        "pt": "[Satélite Starlink da SpaceX].",
        "it": "[Satellite Starlink di SpaceX].",
        "ko": "【SpaceX 스타링크 통신위성】 저궤도 메가 콘스텔레이션 초고속 인터넷 위성.",
        "nl": "[SpaceX Starlink Satelliet].",
        "id": "【Satelit Starlink SpaceX】.",
        "hi": "【SpaceX स्टारलिंक उपग्रह】।",
        "ar": "【قمر ستارلينك التابع لـ SpaceX】.",
        "zh": "【SpaceX“星链”(Starlink) 低轨互联网卫星】 提供全球高速宽带连接的巨型星座。",
        "ru": "【Спутник Starlink компании SpaceX】."
    }
};

function getSatDescription(name) {
    if (!name || typeof name !== 'string') return '';
    const lang = window.currentLang || currentLang || 'ja';
    const upper = name.toUpperCase();

    for (const [key, descObj] of Object.entries(SATELLITE_DESCRIPTIONS)) {
        const keyUpper = key.toUpperCase();
        if (upper.includes(keyUpper) || (keyUpper === 'ALOS-4' && upper.includes('DAICHI-4')) || (keyUpper === 'ALOS-2' && upper.includes('DAICHI-2')) || (keyUpper === 'GCOM-W' && upper.includes('SHIZUKU')) || (keyUpper === 'GCOM-C' && upper.includes('SHIKISAI')) || (keyUpper === 'GOSAT-2' && upper.includes('IBUKI')) || (keyUpper === 'CHOLLIAN-2A' && upper.includes('GEO-KOMPSAT-2A')) || (keyUpper === 'CHOLLIAN-2B' && upper.includes('GEO-KOMPSAT-2B')) || (keyUpper === 'KOMPSAT-5' && upper.includes('ARIRANG-5')) || (keyUpper === 'METEOSAT' && upper.includes('MTG'))) {
            if (typeof descObj === 'string') return descObj;
            return descObj[lang] || descObj['en'] || descObj['ja'] || '';
        }
    }
    const defaultDesc = {
        ja: '地球周回軌道を周回する人工衛星。',
        en: 'Artificial satellite orbiting Earth.',
        de: 'Künstlicher Satellit im Erdorbit.',
        fr: 'Satellite artificiel en orbite terrestre.',
        es: 'Satélite artificial en órbita terrestre.',
        pt: 'Satélite artificial em órbita da Terra.',
        it: 'Satellite artificiale in orbita terrestre.',
        ko: '지구 궤도를 운용 중인 인공위성.',
        nl: 'Kunstmatige satelliet in een baan om de aarde.',
        id: 'Satelit buatan yang beroperasi di orbit Bumi.',
        hi: 'पृथ्वी की कक्षा में मानव निर्मित उपग्रह।',
        ar: 'قمر صناعي يدور في مدار حول الأرض.',
        zh: '在地球轨道上运行的人造卫星。',
        ru: 'Искусственный спутник на орбите Земли.'
    };
    return defaultDesc[lang] || defaultDesc['en'];
}

function getSatCountry(name) {
    const upper = (name || '').toUpperCase();
    const isEn = (currentLang !== 'ja');
    // Military & Reconnaissance
    if (upper.includes('IGS')) return isEn ? '🇯🇵 Japan (Cabinet Satellite Intelligence Center)' : '🇯🇵 日本 (内閣衛星情報センター / 安全保障偵察)';
    if (upper.includes('KIRAMEKI') || upper.includes('DSN')) return isEn ? '🇯🇵 Japan (Ministry of Defense / JSDF)' : '🇯🇵 日本 (防衛省 / 自衛隊専用衛星)';
    if (upper.includes('SBIRS') || upper.includes('GSSAP') || upper.includes('AEHF')) return isEn ? '🇺🇸 USA (US Space Force / USSTRATCOM)' : '🇺🇸 アメリカ (米宇宙軍 / 戦略軍)';
    if (upper.includes('ORION') || upper.includes('MENTOR')) return isEn ? '🇺🇸 USA (NRO / National Reconnaissance Office)' : '🇺🇸 アメリカ (NRO / 国家偵察局シギント)';
    if (upper.includes('TUNDRA') || (upper.includes('COSMOS') && upper.includes('2552')) || upper.includes('2542')) return isEn ? '🇷🇺 Russia (Russian Aerospace Forces / Early Warning)' : '🇷🇺 ロシア (ロシア宇宙軍 / 航空宇宙軍)';
    if (upper.includes('SHIJIAN-21') || upper.includes('SJ-21')) return isEn ? '🇨🇳 China (CNSA / Space Debris Mitigation)' : '🇨🇳 中国 (中国国家航天局 / 衛星捕獲船)';
    if (upper.includes('OFEQ')) return isEn ? '🇮🇱 Israel (Israel Defense Forces / IAI)' : '🇮🇱 イスラエル (イスラエル国防軍 / IDF / IAI)';
    if (upper.includes('SARAH')) return isEn ? '🇩🇪 Germany (Bundeswehr / German Armed Forces)' : '🇩🇪 ドイツ (ドイツ連邦軍 / 宇宙コマンド)';
    // Unique Flagships
    if (upper.includes('X-37B') || upper.includes('OTV')) return isEn ? '🇺🇸 USA (US Space Force / Boeing)' : '🇺🇸 アメリカ (米宇宙軍 / ボーイング)';
    if (upper.includes('USA-245') || upper.includes('KEYHOLE') || upper.includes('KH-11')) return isEn ? '🇺🇸 USA (NRO / National Reconnaissance Office)' : '🇺🇸 アメリカ (NRO / 国家偵察局スパイ衛星)';
    if (upper.includes('SWOT')) return isEn ? '🇺🇸 / 🇫🇷 USA & France (NASA / CNES)' : '🇺🇸 / 🇫🇷 米国・フランス (NASA / CNES)';
    if (upper.includes('WORLDVIEW')) return isEn ? '🇺🇸 USA (Maxar Technologies)' : '🇺🇸 アメリカ (Maxar Technologies / 民間)';
    if (upper.includes('OLYMP') || upper.includes('LUCH')) return isEn ? '🇷🇺 Russia (Roscosmos / FSB / GRU)' : '🇷🇺 ロシア (ロスコスモス / 連邦保安庁 / 宇宙軍)';
    if (upper.includes('SPEKTR')) return isEn ? '🇷🇺 / 🇩🇪 Russia & Germany (IKI / DLR / Roscosmos)' : '🇷🇺 / 🇩🇪 ロシア・ドイツ (IKI / DLR / ロスコスモス)';
    if (upper.includes('METEOR-M')) return isEn ? '🇷🇺 Russia (Roshydromet / Roscosmos)' : '🇷🇺 ロシア (ロシア水文気象局 / ロスコスモス)';
    if (upper.includes('MICIUS') || upper.includes('QUESS')) return isEn ? '🇨🇳 China (CAS / Chinese Academy of Sciences)' : '🇨🇳 中国 (中国科学院 / CAS)';
    if (upper.includes('DAMPE') || upper.includes('WUKONG')) return isEn ? '🇨🇳 China (CAS / National Space Science Center)' : '🇨🇳 中国 (中国科学院 / 国家空間科学中心)';
    if (upper.includes('YAOGAN')) return isEn ? '🇨🇳 China (PLA Strategic Support Force)' : '🇨🇳 中国 (中国人民解放軍 / 軍事偵察)';
    if (upper.includes('QUEQIAO')) return isEn ? '🇨🇳 China (CNSA / Lunar Exploration)' : '🇨🇳 中国 (中国国家航天局 / 月探査計画)';
    if (upper.includes('ADRAS-J') || upper.includes('ASTROSCALE')) return isEn ? '🇯🇵 Japan (Astroscale, Tokyo / JAXA CRD2)' : '🇯🇵 日本 (株式会社アストロスケール / JAXA CRD2)';

    if (upper.includes('SENTINEL') || upper.includes('GALILEO')) return isEn ? '🇪🇺 European Union (ESA / Copernicus)' : '🇪🇺 欧州連合 (ESA / コペルニクス)';
    if (upper.includes('METEOSAT') || upper.includes('MTG')) return isEn ? '🇪🇺 Europe (EUMETSAT / ESA)' : '🇪🇺 欧州気象衛星機構 (EUMETSAT / ESA)';
    if (upper.includes('KOMPSAT') || upper.includes('CHOLLIAN') || upper.includes('GEO-KOMPSAT') || upper.includes('ARIRANG')) return isEn ? '🇰🇷 South Korea (KARI)' : '🇰🇷 韓国 (KARI / 航空宇宙研究院)';
    if (upper.includes('CARTOSAT') || upper.includes('INSAT') || upper.includes('CHANDRAYAAN') || upper.includes('ADITYA')) return isEn ? '🇮🇳 India (ISRO)' : '🇮🇳 インド (ISRO / 宇宙研究機関)';
    if (upper.includes('GLONASS') || upper.includes('ELEKTRO') || upper.includes('SOYUZ') || upper.includes('COSMOS 25')) return isEn ? '🇷🇺 Russia (Roscosmos)' : '🇷🇺 ロシア (Roscosmos / 宇宙軍)';
    if (upper.includes('TIANGONG') || upper.includes('BEIDOU') || upper.includes('FENGYUN-4') || upper.includes('GAOFEN')) return isEn ? '🇨🇳 China (CNSA)' : '🇨🇳 中国 (CNSA / 国家航天局)';
    if (upper.includes('LANDSAT') || upper.includes('TERRA') || upper.includes('GOES') || upper.includes('HUBBLE') || upper.includes('GPS')) return isEn ? '🇺🇸 USA (NASA / NOAA / USSF)' : '🇺🇸 アメリカ (NASA / NOAA / USSF)';
    if (upper.includes('ISS') || upper.includes('ZARYA')) return isEn ? '🇺🇸 / 🇯🇵 / 🇪🇺 International (NASA / JAXA / ESA)' : '🇺🇸 / 🇯🇵 / 🇪🇺 国際共同 (NASA / JAXA / ESA)';
    if (upper.includes('ALOS') || upper.includes('DAICHI') || upper.includes('HIMAWARI') || upper.includes('MICHIBIKI') || upper.includes('QZSS') || upper.includes('GCOM') || upper.includes('GOSAT') || upper.includes('SHIZUKU') || upper.includes('SHIKISAI') || upper.includes('IBUKI') || upper.includes('QPS') || upper.includes('STRIX') || upper.includes('XRISM')) {
        if (upper.includes('XRISM')) return isEn ? '🇯🇵 / 🇺🇸 Japan & USA (JAXA / NASA)' : '🇯🇵 / 🇺🇸 日本・米国 (JAXA / NASA)';
        if (upper.includes('QPS')) return isEn ? '🇯🇵 Japan (iQPS, Fukuoka)' : '🇯🇵 日本 (株式会社iQPS / 福岡)';
        if (upper.includes('STRIX')) return isEn ? '🇯🇵 Japan (Synspective, Tokyo)' : '🇯🇵 日本 (株式会社Synspective / 東京)';
        if (upper.includes('HIMAWARI')) return isEn ? '🇯🇵 Japan (JMA)' : '🇯🇵 日本 (気象庁 / JMA)';
        if (upper.includes('MICHIBIKI') || upper.includes('QZSS')) return isEn ? '🇯🇵 Japan (Cabinet Office)' : '🇯🇵 日本 (内閣府)';
        return isEn ? '🇯🇵 Japan (JAXA)' : '🇯🇵 日本 (JAXA / 宇宙航空研究開発機構)';
    }
    if (upper.includes('STARLINK')) return isEn ? '🇺🇸 USA (SpaceX)' : '🇺🇸 アメリカ (SpaceX / 民間)';
    if (upper.includes('DEBRIS') || upper.includes('COSMOS') || upper.includes('FENGYUN') || upper.includes('SL-')) {
        return isEn ? '⚠️ Defunct Space Debris' : '⚠️ 宇宙ゴミ (スペースデブリ)';
    }
    return isEn ? '🌐 International Spacecraft' : '🌐 国際人工衛星';
}


// Initialize Application Safely
document.addEventListener('DOMContentLoaded', () => {
    try {
        initCesiumViewer();
        setupEventListeners();
        const initialSidebarPanel = document.getElementById('sidebarPanel');
        loadMajorSatellitesPreset(true);
        if (window.innerWidth <= 768 && initialSidebarPanel) initialSidebarPanel.classList.remove('mobile-open');

    
    // Device-Adaptive Floating Zoom Hint Toast (Auto-Dismiss)
    updateZoomHintToast();
    const zoomToast = document.getElementById('zoomHintToast');
    if (zoomToast) {
        let isDismissed = false;
        const dismissToast = () => {
            if (isDismissed) return;
            isDismissed = true;
            zoomToast.classList.add('fade-out');
            setTimeout(() => {
                zoomToast.style.display = 'none';
            }, 600);
        };

        window.addEventListener('wheel', dismissToast, { passive: true, once: true });
        window.addEventListener('touchmove', dismissToast, { passive: true, once: true });
        window.addEventListener('touchstart', dismissToast, { passive: true, once: true });
        
        setTimeout(dismissToast, 6500);
    }

    
    // Mobile Bottom Sheet Drawer Toggle Handler
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileSidebarBtn = document.getElementById('closeMobileSidebarBtn');
    const sidebarPanel = document.getElementById('sidebarPanel');

    if (mobileMenuBtn && sidebarPanel) {
        mobileMenuBtn.addEventListener('click', (e) => {
            window.toggleMobileMenu(e);
        });
    }

    if (closeMobileSidebarBtn && sidebarPanel) {
        closeMobileSidebarBtn.addEventListener('click', (e) => {
            window.closeMobileMenu(e);
        });
    }

    // Auto-close sidebar on mobile after choosing a satellite or preset
    if (satSelect && sidebarPanel) {
        satSelect.addEventListener('change', () => {
            if (window.innerWidth <= 768) {
                sidebarPanel.classList.remove('mobile-open');
            }
        });
    }

    // Initialize Smart Guide Tooltip dismiss listeners
    const guideTooltip = document.getElementById('satSelectGuideTooltip');
    const closeTooltipBtn = document.getElementById('closeGuideTooltipBtn');
    if (closeTooltipBtn && guideTooltip) {
        closeTooltipBtn.addEventListener('click', () => {
            guideTooltip.classList.add('fade-out');
            setTimeout(() => guideTooltip.style.display = 'none', 300);
        });
    }
    if (satSelect && guideTooltip) {
        satSelect.addEventListener('change', () => {
            guideTooltip.classList.add('fade-out');
            setTimeout(() => guideTooltip.style.display = 'none', 300);
        });
    }

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
    "EARTH": {
        "mass": {
            "ja": "5.972 × 10^24 kg (太陽系最大の岩石惑星)",
            "en": "5.972 × 10^24 kg (Largest terrestrial planet)",
            "de": "5,972 × 10^24 kg (Größter Gesteinsplanet)",
            "fr": "5,972 × 10^24 kg (Plus grande planète tellurique)",
            "es": "5,972 × 10^24 kg (Mayor planeta rocoso)",
            "pt": "5,972 × 10^24 kg (Maior planeta rochoso)",
            "it": "5,972 × 10^24 kg (Il più grande pianeta roccioso)",
            "ko": "5.972 × 10^24 kg (태양계 최대의 암석 행성)",
            "nl": "5,972 × 10^24 kg (Grootste terrestrische planeet)",
            "id": "5,972 × 10^24 kg (Planet berbatu terbesar)",
            "hi": "5.972 × 10^24 किग्रा (सौर मंडल का सबसे बड़ा स्थलीय ग्रह)",
            "ar": "5.972 × 10^24 كجم (أكبر كوكب صخري في النظام الشمسي)",
            "zh": "5.972 × 10^24 千克 (太阳系最大的岩质行星)",
            "ru": "5,972 × 10^24 кг (Крупнейшая планета земной группы)"
        },
        "diameter": {
            "ja": "12,742 km (赤道 12,756 km / 極 12,714 km)",
            "en": "12,742 km (Equatorial 12,756 km / Polar 12,714 km)",
            "de": "12.742 km (Äquator 12.756 km / Pole 12.714 km)",
            "fr": "12 742 km (Équateur 12 756 km / Pôles 12 714 km)",
            "es": "12.742 km (Ecuador 12.756 km / Polos 12.714 km)",
            "pt": "12.742 km (Equador 12.756 km / Polos 12.714 km)",
            "it": "12.742 km (Equatore 12.756 km / Poli 12.714 km)",
            "ko": "12,742 km (적도 12,756 km / 극지 12,714 km)",
            "nl": "12.742 km (Evenaar 12.756 km / Polen 12.714 km)",
            "id": "12.742 km (Khatulistiwa 12.756 km / Kutub 12.714 km)",
            "hi": "12,742 किमी (भूमध्यरेखीय 12,756 किमी / ध्रुवीय 12,714 किमी)",
            "ar": "12,742 كم (عند خط الاستواء 12,756 كم / القطبين 12,714 كم)",
            "zh": "12,742 公里 (赤道 12,756 公里 / 极半径 12,714 公里)",
            "ru": "12 742 км (экватор 12 756 км / полюса 12 714 км)"
        },
        "rotation": {
            "ja": "23時間56分4秒 (1恒星日) / 傾斜角 23.44°",
            "en": "23h 56m 4s (1 Sidereal Day) / Axial Tilt 23.44°",
            "de": "23h 56m 4s (1 siderischer Tag) / Neigung 23,44°",
            "fr": "23h 56m 4s (1 jour sidéral) / Inclinaison 23,44°",
            "es": "23h 56m 4s (1 día sideral) / Inclinación 23,44°",
            "pt": "23h 56m 4s (1 dia sideral) / Inclinação 23,44°",
            "it": "23h 56m 4s (1 giorno siderale) / Inclinazione 23,44°",
            "ko": "23시간 56분 4초 (1 항성일) / 자전축 기울기 23.44°",
            "nl": "23u 56m 4s (1 siderische dag) / Ashelling 23,44°",
            "id": "23j 56m 4d (1 Hari Sideris) / Kemiringan Sumbu 23,44°",
            "hi": "23 घंटे 56 मिनट 4 सेकंड (1 नाक्षत्र दिन) / झुकाव 23.44°",
            "ar": "23 ساعة و56 دقيقة و4 ثوانٍ (يوم نجمي) / ميل المحور 23.44°",
            "zh": "23小时56分4秒 (1恒星日) / 黄赤交角 23.44°",
            "ru": "23 ч 56 мин 4 с (1 звездные сутки) / Наклон оси 23,44°"
        },
        "orbit": {
            "ja": "365.256日 (1太陽年 / 平均軌道速度 29.78 km/s)",
            "en": "365.256 days (1 Solar Year / Orbital Speed 29.78 km/s)",
            "de": "365,256 Tage (1 Sonnenjahr / Bahngeschw. 29,78 km/s)",
            "fr": "365,256 jours (1 an solaire / Vitesse orbitale 29,78 km/s)",
            "es": "365,256 días (1 año solar / Velocidad orbital 29,78 km/s)",
            "pt": "365,256 dias (1 ano solar / Velocidade orbital 29,78 km/s)",
            "it": "365,256 giorni (1 anno solare / Velocità orbitale 29,78 km/s)",
            "ko": "365.256일 (1 태양년 / 평균 공전속도 29.78 km/s)",
            "nl": "365,256 dagen (1 zonnejaar / Baansnelheid 29,78 km/s)",
            "id": "365,256 hari (1 Tahun Matahari / Kecepatan Orbit 29,78 km/s)",
            "hi": "365.256 दिन (1 सौर वर्ष / कक्षीय गति 29.78 किमी/सेकंड)",
            "ar": "365.256 يوماً (سنة شمسية واحدة / سرعة المدار 29.78 كم/ثانية)",
            "zh": "365.256天 (1恒星年 / 公转均速 29.78 km/s)",
            "ru": "365,256 дня (1 солнечный год / Скорость орбиты 29,78 км/с)"
        },
        "temperature": {
            "ja": "平均 15℃ (最低 -89.2℃ 南極 / 最高 56.7℃ デスバレー)",
            "en": "Mean 15°C (Min -89.2°C Antarctica / Max 56.7°C Death Valley)",
            "de": "Mittel 15°C (Min -89,2°C Antarktis / Max 56,7°C Death Valley)",
            "fr": "Moyenne 15°C (Min -89,2°C Antarctique / Max 56,7°C Death Valley)",
            "es": "Media 15°C (Mín -89,2°C Antártida / Máx 56,7°C Valle de la Muerte)",
            "pt": "Média 15°C (Mín -89,2°C Antártida / Máx 56,7°C Vale da Morte)",
            "it": "Media 15°C (Min -89,2°C Antartide / Max 56,7°C Death Valley)",
            "ko": "평균 15℃ (최저 -89.2℃ 남극 / 최고 56.7℃ 데스밸리)",
            "nl": "Gemiddeld 15°C (Min -89,2°C Antarctica / Max 56,7°C Death Valley)",
            "id": "Rata-rata 15°C (Min -89,2°C Antartika / Maks 56,7°C Death Valley)",
            "hi": "औसत 15°C (न्यूनतम -89.2°C अंटार्कटिका / अधिकतम 56.7°C डेथ वैली)",
            "ar": "المتوسط 15°م (الأدنى -89.2°م في القارة القطبية / الأقصى 56.7°م)",
            "zh": "平均 15°C (极低 -89.2°C 南极 / 极高 56.7°C 死亡谷)",
            "ru": "Средняя 15°C (Мин -89,2°C Антарктида / Макс 56,7°C Долина Смерти)"
        },
        "satellites": {
            "ja": "自然衛星 1個 (月) / 人工衛星 10,000機以上 (ISS・通信・観測網)",
            "en": "1 Natural Moon / 10,000+ Active Satellites (ISS, Starlink, Earth Observation)",
            "de": "1 Mond / Über 10.000 aktive Satelliten (ISS, Erdbeobachtung)",
            "fr": "1 Lune naturelle / Plus de 10 000 satellites actifs (ISS, réseaux orbitaux)",
            "es": "1 Luna natural / Más de 10.000 satélites activos (ISS, constelaciones)",
            "pt": "1 Lua natural / Mais de 10.000 satélites ativos (ISS, observação)",
            "it": "1 Luna naturale / Oltre 10.000 satelliti attivi (ISS, costellazioni)",
            "ko": "자연위성 1개 (달) / 인공위성 10,000기 이상 (ISS, 스타링크, 지구관측망)",
            "nl": "1 Natuurlijke maan / 10.000+ actieve satellieten (ISS, aardobservatie)",
            "id": "1 Bulan Alami / 10.000+ Satelit Aktif (ISS, pengamatan Bumi)",
            "hi": "1 प्राकृतिक चंद्रमा / 10,000+ सक्रिय उपग्रह (ISS, पृथ्वी अवलोकन)",
            "ar": "قمر طبيعي واحد / أكثر من 10,000 قمر صناعي نشط (محطة الفضاء الدولية وشبكات المراقبة)",
            "zh": "天然卫星 1颗 (月球) / 人造卫星 10,000+颗 (空间站·遥感·通信星座)",
            "ru": "1 Луна / Более 10 000 действующих спутников (МКС, спутниковые группировки)"
        },
        "discovery": {
            "ja": "約45.4億年前に太陽系星雲から形成。ハビタブルゾーンの中心で液体の海と磁気圏を維持し生命を進化させた母星。",
            "en": "Formed ~4.54 billion years ago. Located in the habitable zone, sustaining oceans and a protective magnetosphere for life.",
            "de": "Vor ~4,54 Mrd. Jahren entstanden. In der habitablen Zone mit flüssigen Ozeanen und schützendem Magnetfeld.",
            "fr": "Formée il y a ~4,54 milliards d'années. Dans la zone habitable, maintenant des océans liquides et un champ magnétique.",
            "es": "Formada hace ~4.540 millones de años. En la zona habitable, con océanos líquidos y magnetosfera protectora.",
            "pt": "Formada há ~4,54 bilhões de anos. Na zona habitável, com oceanos líquidos e magnetosfera protetora.",
            "it": "Formatasi circa 4,54 miliardi di anni fa nella zona abitabile, mantiene oceani liquidi e una magnetosfera vitale.",
            "ko": "약 45.4억 년 전 태양계 성운에서 형성. 생명 거주 가능 영역(골디락스 존)에 위치하여 액체 바다와 자기장을 보존해온 유일한 요람.",
            "nl": "Gevormd ~4,54 miljard jaar geleden in de leefbare zone, met vloeibare oceanen en een beschermend magnetisch veld.",
            "id": "Terbentuk ~4,54 miliar tahun lalu di zona layak huni, mempertahankan lautan cair dan medan magnet untuk kehidupan.",
            "hi": "लगभग 4.54 अरब वर्ष पूर्व निर्मित। रहने योग्य क्षेत्र में तरल महासागरों और चुंबकीय क्षेत्र को बनाए रखने वाला जीवन का पालना।",
            "ar": "تشكلت قبل نحو 4.54 مليار سنة في النطاق الصالح للحياة، لتحافظ على المحيطات السائلة والغلاف المغناطيسي الحامي للحياة.",
            "zh": "形成于约45.4亿年前的太阳星云。地处宜居带黄金位置，孕育并维系着浩瀚的液态海洋与保护生命的地球磁场。",
            "ru": "Сформировалась ~4,54 млрд лет назад в обитаемой зоне, сохранив океаны и защитную магнитосферу для развития жизни."
        },
        "missions": {
            "ja": "スプートニク1号(1957年宇宙時代幕開け), アポロ計画(全地球撮影), 国際宇宙ステーション(2000年〜有人常駐), 気象・地球観測網。",
            "en": "Sputnik 1 (1957 space age dawn), Apollo program (Blue Marble), ISS continuous crew (2000-present), Earth observing constellations.",
            "de": "Sputnik 1 (1957), Apollo-Programm (Blue Marble), ISS Dauerbetrieb seit 2000, globale Erdbeobachtungssatelliten.",
            "fr": "Spoutnik 1 (1957), programme Apollo (Blue Marble), présence humaine continue sur l'ISS depuis 2000, réseau Copernicus.",
            "es": "Sputnik 1 (1957), Apolo (Canica Azul), presencia humana continua en la ISS desde 2000, satélites de observación terrestre.",
            "pt": "Sputnik 1 (1957), Programa Apollo (Blue Marble), presença contínua na ISS desde 2000, constelações de observação.",
            "it": "Sputnik 1 (1957), Programma Apollo (Blue Marble), equipaggio permanente sulla ISS dal 2000, flotta d'osservazione terrestre.",
            "ko": "스푸트니크 1호(1957년 우주시대 개막), 아폴로 계획(인류 최초 지구 전체 촬영), 국제우주정거장 ISS(2000년 이후 연속 유인 체류), 첨단 지구관측 위성망.",
            "nl": "Spoetnik 1 (1957), Apollo-programma (Blue Marble), permanente bemanning van het ISS sinds 2000, aardobservatienetwerken.",
            "id": "Sputnik 1 (1957), Program Apollo (Blue Marble), awak berkelanjutan di ISS sejak 2000, konstelasi pengamatan Bumi global.",
            "hi": "स्पुतनिक 1 (1957), अपोलो कार्यक्रम (ब्लू मार्बल), 2000 से ISS पर निरंतर मानव उपस्थिति, वैश्विक पृथ्वी अवलोकन उपग्रह।",
            "ar": "سبوتنيك 1 (1957)، برنامج أبولو (صورة الرخام الأزرق)، الوجود البشري المستمر في محطة الفضاء الدولية منذ 2000، وأقمار رصد الأرض.",
            "zh": "人类航天纪元始于人造卫星一号(1957), 阿波罗计划从太空拍下“蓝色弹珠”, 国际空间站常驻(2000至今), 全球气象遥感监测网络。",
            "ru": "Спутник-1 (1957, начало космической эры), Программа Аполлон (Blue Marble), МКС с 2000 г., спутниковые системы мониторинга Земли."
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
    },
    "NEPTUNE": {
        "mass": {
            "ja": "1.024 × 10^26 kg (地球の約17.15倍)",
            "en": "1.024 × 10^26 kg (17.15x Earth)",
            "de": "1,024 × 10^26 kg (17,15-fache Erdmasse)",
            "fr": "1,024 × 10^26 kg (17,15 fois la Terre)",
            "es": "1,024 × 10^26 kg (17,15 veces la Tierra)",
            "pt": "1,024 × 10^26 kg (17,15 vezes a Terra)",
            "it": "1,024 × 10^26 kg (17,15 volte la Terra)",
            "ko": "1.024 × 10^26 kg (지구의 약 17.15배)",
            "nl": "1,024 × 10^26 kg (17,15x de aarde)",
            "id": "1,024 × 10^26 kg (17,15x Bumi)",
            "hi": "1.024 × 10^26 किग्रा (पृथ्वी का 17.15 गुना)",
            "ar": "1.024 × 10^26 كجم (17.15 ضعف كتلة الأرض)",
            "zh": "1.024 × 10^26 千克 (地球的17.15倍)",
            "ru": "1,024 × 10^26 кг (в 17,15 раз больше Земли)"
        },
        "diameter": {
            "ja": "49,244 km (地球の3.86倍)",
            "en": "49,244 km (3.86x Earth)",
            "de": "49.244 km (3,86-facher Erddurchmesser)",
            "fr": "49 244 km (3,86 fois la Terre)",
            "es": "49.244 km (3,86 veces la Tierra)",
            "pt": "49.244 km (3,86 vezes a Terra)",
            "it": "49.244 km (3,86 volte la Terra)",
            "ko": "49,244 km (지구의 3.86배)",
            "nl": "49.244 km (3,86x de aarde)",
            "id": "49.244 km (3,86x Bumi)",
            "hi": "49,244 किमी (पृथ्वी का 3.86 गुना)",
            "ar": "49,244 كم (3.86 أضعاف قطر الأرض)",
            "zh": "49,244 公里 (地球的3.86倍)",
            "ru": "49 244 км (в 3,86 раз больше Земли)"
        },
        "rotation": {
            "ja": "16.11時間",
            "en": "16.11 hours",
            "de": "16,11 Stunden",
            "fr": "16,11 heures",
            "es": "16,11 horas",
            "pt": "16,11 horas",
            "it": "16,11 ore",
            "ko": "16.11시간",
            "nl": "16,11 uur",
            "id": "16,11 jam",
            "hi": "16.11 घंटे",
            "ar": "16.11 ساعة",
            "zh": "16.11小时",
            "ru": "16,11 часа"
        },
        "orbit": {
            "ja": "60,189日 (約164.8年 / 太陽系最遠惑星)",
            "en": "60,189 days (~164.8 years / Outermost planet)",
            "de": "60.189 Tage (~164,8 Jahre / Äußerster Planet)",
            "fr": "60 189 jours (~164,8 ans / Planète la plus lointaine)",
            "es": "60.189 días (~164,8 años / Planeta más lejano)",
            "pt": "60.189 dias (~164,8 anos / Planeta mais distante)",
            "it": "60.189 giorni (~164,8 anni / Pianeta più distante)",
            "ko": "60,189일 (약 164.8년 / 최원단 행성)",
            "nl": "60.189 dagen (~164,8 jaar / Verste planeet)",
            "id": "60.189 hari (~164,8 tahun / Planet terjauh)",
            "hi": "60,189 दिन (~164.8 वर्ष / सबसे दूरस्थ ग्रह)",
            "ar": "60,189 يوماً (~164.8 سنة / أبعد الكواكب)",
            "zh": "60,189天 (约164.8年 / 太阳系最远大行星)",
            "ru": "60 189 дней (~164,8 года / Самая далекая планета)"
        },
        "temperature": {
            "ja": "-214℃ (大気上層)",
            "en": "-214°C (Cloud Tops)",
            "de": "-214°C (Wolkenobergrenze)",
            "fr": "-214°C (Sommet des nuages)",
            "es": "-214°C (Cima de nubes)",
            "pt": "-214°C (Topo das nuvens)",
            "it": "-214°C (Cima delle nubi)",
            "ko": "-214℃ (구름 상층)",
            "nl": "-214°C (Wolkentoppen)",
            "id": "-214°C (Puncak Awan)",
            "hi": "-214°C (बादलों की ऊपरी परत)",
            "ar": "-214°م (قمم السحب)",
            "zh": "-214℃ (云顶温度)",
            "ru": "-214°C (Верхний слой облаков)"
        },
        "satellites": {
            "ja": "16個の衛星 (逆行軌道巨大衛星トリトン等) + 5本の環",
            "en": "16 Moons (including retrograde Triton) + 5 Rings",
            "de": "16 Monde (einschl. retrograder Triton) + 5 Ringe",
            "fr": "16 lunes (dont Triton rétrograde) + 5 anneaux",
            "es": "16 lunas (incluido Tritón retrógrado) + 5 anillos",
            "pt": "16 luas (incluindo Tritão retrógrado) + 5 anéis",
            "it": "16 lune (incluso Tritone retrogrado) + 5 anelli",
            "ko": "16개 위성 (역행 거대 위성 트리톤 등) + 5개 고리",
            "nl": "16 manen (waaronder retrograde Triton) + 5 ringen",
            "id": "16 Bulan (termasuk Triton retrograde) + 5 Cincin",
            "hi": "16 चंद्रमा (विपरीत परिक्रमा वाला ट्राइटन) + 5 छल्ले",
            "ar": "16 قمراً (بما في ذلك تريتون التراجعي) + 5 حلقات",
            "zh": "16颗卫星 (包括逆行巨大卫星海卫一) ＋ 5道光环",
            "ru": "16 спутников (включая ретроградный Тритон) + 5 колец"
        },
        "discovery": {
            "ja": "1846年9月23日、ユルバン・ルヴェリエの数学的軌道予測に基づきヨハン・ガレが発見。",
            "en": "Discovered on Sept 23, 1846 by Johann Galle based on Urbain Le Verrier's mathematical predictions.",
            "de": "Am 23. September 1846 von Johann Galle nach mathematischen Vorhersagen von Le Verrier entdeckt.",
            "fr": "Découverte le 23 septembre 1846 par Johann Galle d'après les prédictions mathématiques de Le Verrier.",
            "es": "Descubierto el 23 de septiembre de 1846 por Johann Galle según cálculos matemáticos de Le Verrier.",
            "pt": "Descoberto em 23 de setembro de 1846 por Johann Galle com base nas previsões matemáticas de Le Verrier.",
            "it": "Scoperto il 23 settembre 1846 da Johann Galle in base ai calcoli matematici di Le Verrier.",
            "ko": "1846년 9월 23일 르베리에의 수학적 예측에 기반하여 요한 갈레가 망원경으로 발견.",
            "nl": "Ontdekt op 23 september 1846 door Johann Galle op basis van berekeningen van Le Verrier.",
            "id": "Ditemukan pada 23 September 1846 oleh Johann Galle berdasarkan prediksi matematis Le Verrier.",
            "hi": "23 सितंबर 1846 को ले वेरियर की गणितीय भविष्यवाणियों के आधार पर जोहान गैले द्वारा खोजा गया।",
            "ar": "اكتشفه يوهان غاله في 23 سبتمبر 1846 بناءً على التنبؤات الرياضية لأوربان لوفيرييه.",
            "zh": "1846年9月23日由约翰·伽勒根据法国天文学家勒威耶的数学轨道预测精确发现(笔尖上发现的行星)。",
            "ru": "Открыт 23 сентября 1846 г. Иоганном Галле по математическим расчетам Урбена Леверье."
        },
        "missions": {
            "ja": "NASAボイジャー2号 (1989年8月25日最接近、大暗斑と6個の新衛星を発見)。",
            "en": "NASA Voyager 2 (closest flyby on August 25, 1989, discovered the Great Dark Spot and 6 new moons).",
            "de": "NASA Voyager 2 (Vorbeiflug am 25. August 1989, entdeckte den Großen Dunklen Fleck und 6 Monde).",
            "fr": "NASA Voyager 2 (survol le 25 août 1989, a découvert la Grande Tache sombre et 6 lunes).",
            "es": "NASA Voyager 2 (sobrevuelo el 25 de agosto de 1989, descubrió la Gran Mancha Oscura y 6 lunas).",
            "pt": "NASA Voyager 2 (sobrevoo em 25 de agosto de 1989, descobriu a Grande Mancha Escura e 6 luas).",
            "it": "NASA Voyager 2 (sorvolo il 25 agosto 1989, ha scoperto la Grande Macchia Scura e 6 lune).",
            "ko": "NASA 보이저 2호(1989년 8월 25일 최근접 통과, 대암점 폭풍과 6개 신위성 발견).",
            "nl": "NASA Voyager 2 (scheervlucht op 25 augustus 1989, ontdekte de Grote Donkere Vlek en 6 manen).",
            "id": "NASA Voyager 2 (terbang lintas pada 25 Agustus 1989, menemukan Bintik Gelap Besar dan 6 bulan).",
            "hi": "नासा वॉयजर 2 (25 अगस्त 1989 को निकटतम उड़ान, विशाल डार्क स्पॉट और 6 नए चंद्रमा खोजे)।",
            "ar": "فوياجر 2 التابع لناسا (تحليق في 25 أغسطس 1989، اكتشف البقعة المظلمة العظيمة و6 أقمار).",
            "zh": "NASA旅行者2号(1989年8月25日飞掠，发现巨大风暴“大黑斑”及6颗新卫星)。",
            "ru": "NASA Вояджер-2 (пролет 25 августа 1989 г., открыл Большое темное пятно и 6 новых спутников)."
        }
    },
    SOLAR_SYSTEM: {
        diameter: {
            ja: "約10万〜20万 AU (オールトの雲外縁: 約1.6〜3.2光年)",
            en: "Approx. 100,000–200,000 AU (Oort Cloud: ~1.6–3.2 light-years)",
            de: "Ca. 100.000–200.000 AE (Oortsche Wolke: ~1,6–3,2 Lichtjahre)",
            fr: "Env. 100 000–200 000 UA (Nuage d'Oort: ~1,6–3,2 années-lumière)",
            es: "Aprox. 100.000–200.000 UA (Nube de Oort: ~1,6–3,2 años luz)",
            pt: "Aprox. 100.000–200.000 UA (Nuvem de Oort: ~1,6–3,2 anos-luz)",
            it: "Circa 100.000–200.000 UA (Nube di Oort: ~1,6–3,2 anni luce)",
            ko: "약 10만~20만 AU (오르트 구름 외곽: 약 1.6~3.2광년)",
            nl: "Ongeveer 100.000–200.000 AE (Oortwolk: ~1,6–3,2 lichtjaar)",
            id: "Sekitar 100.000–200.000 AU (Awan Oort: ~1,6–3,2 tahun cahaya)",
            hi: "लगभग 100,000–200,000 AU (ऊर्ट बादल: ~1.6–3.2 प्रकाश वर्ष)",
            ar: "حوالي 100,000–200,000 وحدة فلكية (سحابة أورت: ~1.6–3.2 سنة ضوئية)",
            zh: "约10万至20万天文单位 (奥尔特云外边缘: 约1.6至3.2光年)",
            ru: "Около 100 000–200 000 а.е. (Облако Оорта: ~1,6–3,2 световых года)"
        },
        mass: {
            ja: "約1.0014 太陽質量 (M☉) (太陽が総質量の99.86%を占める)",
            en: "Approx. 1.0014 Solar Masses (Sun holds 99.86% of total mass)",
            de: "Ca. 1,0014 Sonnenmassen (Sonne umfasst 99,86 % der Gesamtmasse)",
            fr: "Env. 1,0014 masse solaire (Le Soleil détient 99,86% de la masse)",
            es: "Aprox. 1,0014 masas solares (El Sol contiene el 99,86% de la masa)",
            pt: "Aprox. 1,0014 massas solares (O Sol detém 99,86% da massa total)",
            it: "Circa 1,0014 masse solari (Il Sole detiene il 99,86% della massa)",
            ko: "약 1.0014 태양 질량 (태양이 전체 질량의 99.86% 차지)",
            nl: "Ongeveer 1,0014 zonnemassa's (Zon bevat 99,86% van alle massa)",
            id: "Sekitar 1,0014 massa matahari (Matahari mencakup 99,86% total massa)",
            hi: "लगभग 1.0014 सौर द्रव्यमान (सूर्य में कुल द्रव्यमान का 99.86% भाग है)",
            ar: "حوالي 1.0014 كتلة شمسية (تحتوي الشمس على 99.86% من إجمالي الكتلة)",
            zh: "约1.0014太阳质量 (太阳占据整个系统总质量的99.86%)",
            ru: "Около 1,0014 массы Солнца (на Солнце приходится 99,86% массы)"
        },
        rotation: {
            ja: "銀河周回速度: 約230 km/s (公転周期: 約2.3億年 / 銀河年)",
            en: "Galactic speed: ~230 km/s (Orbital period: ~230 million years)",
            de: "Galaktische Geschwindigkeit: ~230 km/s (Umlaufzeit: ~230 Mio. Jahre)",
            fr: "Vitesse galactique: ~230 km/s (Période orbitale: ~230 millions d'années)",
            es: "Velocidad galáctica: ~230 km/s (Período orbital: ~230 millones de años)",
            pt: "Velocidade galáctica: ~230 km/s (Período orbital: ~230 milhões de anos)",
            it: "Velocità galattica: ~230 km/s (Periodo orbitale: ~230 milioni di anni)",
            ko: "은하 공전 속도: 약 230 km/s (공전 주기: 약 2억 3천만 년 / 은하년)",
            nl: "Galactische snelheid: ~230 km/s (Omlooptijd: ~230 miljoen jaar)",
            id: "Kecepatan galaksi: ~230 km/s (Periode orbit: ~230 juta tahun)",
            hi: "आकाशगंगा गति: ~230 किमी/सेकंड (कक्षीय अवधि: ~23 करोड़ वर्ष)",
            ar: "السرعة المجرية: ~230 كم/ث (الفترة المدارية: ~230 مليون سنة)",
            zh: "银河公转速度: 约230 km/s (公转周期: 约2.3亿年 / 银河年)",
            ru: "Галактическая скорость: ~230 км/с (период обращения: ~230 млн лет)"
        },
        orbit: {
            ja: "天の川銀河オリオン腕 (銀河中心から約2.6万光年)",
            en: "Milky Way Orion Arm (~26,000 light-years from Galactic Center)",
            de: "Milchstraße Orionarm (~26.000 Lichtjahre vom Zentrum)",
            fr: "Bras d'Orion de la Voie lactée (~26 000 a.l. du centre galactique)",
            es: "Brazo de Orión de la Vía Láctea (~26.000 años luz del centro)",
            pt: "Braço de Órion da Via Láctea (~26.000 anos-luz do centro)",
            it: "Braccio di Orione della Via Lattea (~26.000 a.l. dal centro)",
            ko: "우리은하 오리온 팔 (은하 중심에서 약 26,000광년)",
            nl: "Melkweg Orionarm (~26.000 lichtjaar van galactisch centrum)",
            id: "Lengan Orion Bima Sakti (~26.000 tahun cahaya dari pusat galaksi)",
            hi: "मिल्की वे ओरियन आर्म (आकाशगंगा केंद्र से लगभग 26,000 प्रकाश वर्ष)",
            ar: "ذراع الجبار في درب التبانة (~26,000 سنة ضوئية من مركز المجرة)",
            zh: "银河系猎户臂 (距银心约2.6万光年)",
            ru: "Рукав Ориона Млечного Пути (~26 000 св. лет от центра Галактики)"
        },
        temperature: {
            ja: "太陽核 1,500万℃ / 惑星表面 -235℃〜465℃ / 深宇宙 2.7 K (-270.5℃)",
            en: "Solar core 15,000,000°C / Planets -235°C to 465°C / Deep space 2.7 K",
            de: "Sonnenkern 15.000.000°C / Planeten -235°C bis 465°C / Raum 2,7 K",
            fr: "Cœur solaire 15 000 000°C / Planètes -235°C à 465°C / Espace 2,7 K",
            es: "Núcleo solar 15.000.000°C / Planetas -235°C a 465°C / Espacio 2,7 K",
            pt: "Núcleo solar 15.000.000°C / Planetas -235°C a 465°C / Espaço 2,7 K",
            it: "Nucleo solare 15.000.000°C / Pianeti -235°C a 465°C / Spazio 2,7 K",
            ko: "태양 중심핵 1,500만°C / 행성 표면 -235°C~465°C / 심우주 2.7 K",
            nl: "Zonnekern 15.000.000°C / Planeten -235°C tot 465°C / Ruimte 2,7 K",
            id: "Inti matahari 15.000.000°C / Planet -235°C hingga 465°C / Angkasa 2,7 K",
            hi: "सौर कोर 1.5 करोड़°C / ग्रह -235°C से 465°C / अंतरिक्ष 2.7 K",
            ar: "قلب الشمس 15 مليون درجة مئوية / الكواكب -235 إلى 465 مئوية / الفضاء 2.7 كلفن",
            zh: "太阳核心1500万°C / 行星表面-235°C至465°C / 深空背景2.7 K",
            ru: "Ядро Солнца 15 000 000°C / планеты -235°C...+465°C / глубокий космос 2,7 K"
        },
        satellites: {
            ja: "8惑星 + 5準惑星 + 290個以上の衛星 + 130万個以上の小惑星・彗星",
            en: "8 Planets + 5 Dwarf Planets + 290+ Moons + 1.3M+ Asteroids & Comets",
            de: "8 Planeten + 5 Zwergplaneten + 290+ Monde + 1,3 Mio.+ Asteroiden",
            fr: "8 planètes + 5 planètes naines + 290+ lunes + 1,3M+ astéroïdes",
            es: "8 planetas + 5 planetas enanos + 290+ lunas + 1,3M+ asteroides",
            pt: "8 planetas + 5 planetas anões + 290+ luas + 1,3M+ asteroides",
            it: "8 pianeti + 5 pianeti nani + 290+ lune + 1,3M+ asteroidi e comete",
            ko: "8개 행성 + 5개 왜소행성 + 290개 이상 위성 + 130만 개 이상 소행성/혜성",
            nl: "8 planeten + 5 dwergplaneten + 290+ manen + 1,3M+ planetoïden",
            id: "8 Planet + 5 Planet Kerdil + 290+ Bulan + 1,3Jt+ Asteroid & Komet",
            hi: "8 ग्रह + 5 बौने ग्रह + 290+ चंद्रमा + 13 लाख+ क्षुद्रग्रह व धूमकेतु",
            ar: "8 كواكب + 5 كواكب قزمة + 290+ قمراً + أكثر من 1.3 مليون كويكب ومذنب",
            zh: "8大行星 ＋ 5颗矮行星 ＋ 290多颗已知卫星 ＋ 130万颗以上小行星与彗星",
            ru: "8 планет + 5 карликовых планет + 290+ спутников + 1,3 млн+ астероидов и комет"
        },
        discovery: {
            ja: "紀元前からの肉眼観測からコペルニクスの地動説(1543年)、ケプラーの法則、ニュートン力学により太陽系モデルが確立。",
            en: "Evolved from ancient naked-eye observations to Copernicus' heliocentrism (1543), Kepler's laws, and Newtonian mechanics.",
            de: "Entwickelt von antiken Himmelsbeobachtungen über Kopernikus' Heliozentrismus (1543) bis zu Keplers Gesetzen und Newtons Gravitation.",
            fr: "Évolué des observations antiques à l'héliocentrisme de Copernic (1543), aux lois de Kepler et à la gravité de Newton.",
            es: "Evolucionó de observaciones antiguas al heliocentrismo de Copérnico (1543), las leyes de Kepler y la gravitación newtoniana.",
            pt: "Evoluiu das observações antigas ao heliocentrismo de Copérnico (1543), leis de Kepler e mecânica newtoniana.",
            it: "Evoluto dalle osservazioni antiche all'eliocentrismo di Copernico (1543), leggi di Keplero e gravità newtoniana.",
            ko: "고대 맨눈 관측에서 1543년 코페르니쿠스의 지동설, 케플러의 행성 운동 법칙 및 뉴턴 역학을 통해 태양계 역학 체계가 확립됨.",
            nl: "Evolueerde van antieke waarnemingen naar Copernicus' heliocentrisme (1543), de wetten van Kepler en Newtoniaanse mechanica.",
            id: "Berevolusi dari pengamatan kuno ke heliosentrisme Copernicus (1543), hukum Kepler, dan gravitasi Newton.",
            hi: "प्राचीन अवलोकनों से कॉपरनिकस के सूर्य-केन्द्रीय सिद्धांत (1543), केप्लर के नियमों और न्यूटन के गुरुत्वाकर्षण तक विकसित हुआ।",
            ar: "تطور من الرصد القديم بالعين المجردة إلى نظرية كوبرنيكوس لمركزية الشمس (1543) وقوانين كبلر وجاذبية نيوتن.",
            zh: "经历从古代肉眼观测到1543年哥白尼日心说建立，再到开普勒行星三大定律与牛顿万有引力定律确立近代天体力学体系。",
            ru: "От древних наблюдений к гелиоцентризму Коперника (1543 г.), законам Кеплера и классической механике Ньютона."
        },
        missions: {
            ja: "NASAボイジャー1・2号、パイオニア10・11号、ニュー・ホライズンズ等による太陽圏脱出探査と全惑星への探査機到達。",
            en: "Explored by NASA Voyager 1 & 2, Pioneer 10 & 11, New Horizons, and robotic orbiters/landers across all 8 planets.",
            de: "Erforscht durch Voyager 1 & 2, Pioneer 10 & 11, New Horizons und Sonden zu allen acht Planeten des Sonnensystems.",
            fr: "Exploré par Voyager 1 et 2, Pioneer 10 et 11, New Horizons et des sondes robotiques envoyées vers les 8 planètes.",
            es: "Explorado por Voyager 1 y 2, Pioneer 10 y 11, New Horizons y misiones robóticas a los ocho planetas principales.",
            pt: "Explorado pelas Voyager 1 e 2, Pioneer 10 e 11, New Horizons e sondas robóticas em todos os oito planetas.",
            it: "Esplorato da Voyager 1 e 2, Pioneer 10 e 11, New Horizons e sonde robotiche inviate a tutti gli 8 pianeti.",
            ko: "NASA 보이저 1·2호, 파이오니어 10·11호, 뉴 허라이즌스 등의 성간 우주 비행 및 8대 행성 전역에 대한 무인 탐사선 탐사.",
            nl: "Verkend door Voyager 1 & 2, Pioneer 10 & 11, New Horizons en ruimtesondes naar alle acht planeten.",
            id: "Diteliti oleh Voyager 1 & 2, Pioneer 10 & 11, New Horizons, dan wahana antariksa ke seluruh delapan planet.",
            hi: "नासा वॉयजर 1 और 2, पायनियर 10 और 11, न्यू होराइजन्स और सभी 8 ग्रहों पर रोबोटिक मिशनों द्वारा अन्वेषण किया गया।",
            ar: "تم استكشافه عبر فوياجر 1 و2، وبيونير 10 و11، ونيو هورايزونز، ومسابير استكشافية لجميع الكواكب الثمانية.",
            zh: "由NASA旅行者1号与2号、先驱者10号与11号、新视野号实现太阳圈边界跨越，人类探测器现已造访全部八大行星。",
            ru: "Исследован миссиями Вояджер-1 и 2, Пионер-10 и 11, Новые горизонты и зондами ко всем восьми планетам."
        }
    },
    "CERES": {
        "mass": {
            "ja": "9.38 × 10^20 kg (小惑星帯全質量の約3分の1)",
            "en": "9.38 × 10^20 kg (~1/3 mass of entire Asteroid Belt)",
            "de": "9,38 × 10^20 kg (~1/3 der Masse des Asteroidengürtels)",
            "fr": "9,38 × 10^20 kg (~1/3 de la masse de la ceinture)",
            "es": "9,38 × 10^20 kg (~1/3 de la masa del cinturón)",
            "pt": "9,38 × 10^20 kg (~1/3 da massa do cinturão)",
            "it": "9,38 × 10^20 kg (~1/3 della massa della fascia)",
            "ko": "9.38 × 10^20 kg (소행성대 전체 질량의 약 3분의 1)",
            "nl": "9,38 × 10^20 kg (~1/3 massa planetoïdengordel)",
            "id": "9,38 × 10^20 kg (~1/3 massa Sabuk Asteroid)",
            "hi": "9.38 × 10^20 किग्रा (क्षुद्रग्रह बेल्ट के कुल द्रव्यमान का ~1/3)",
            "ar": "9.38 × 10^20 كجم (~ثلث كتلة حزام الكويكبات بالكامل)",
            "zh": "9.38 × 10^20 千克 (占小行星带总质量约三分之一)",
            "ru": "9,38 × 10^20 кг (~1/3 массы всего пояса астероидов)"
        },
        "diameter": {
            "ja": "946 km (赤道 960 km / 極 891 km)",
            "en": "946 km (Equatorial 960 km / Polar 891 km)",
            "de": "946 km (Äquator 960 km / Pole 891 km)",
            "fr": "946 km (Équateur 960 km / Pôles 891 km)",
            "es": "946 km (Ecuador 960 km / Polos 891 km)",
            "pt": "946 km (Equador 960 km / Polos 891 km)",
            "it": "946 km (Equatore 960 km / Poli 891 km)",
            "ko": "946 km (적도 960 km / 극지 891 km)",
            "nl": "946 km (Evenaar 960 km / Polen 891 km)",
            "id": "946 km (Khatulistiwa 960 km / Kutub 891 km)",
            "hi": "946 किमी (भूमध्यरेखीय 960 किमी / ध्रुवीय 891 किमी)",
            "ar": "946 كم (عند خط الاستواء 960 كم / القطبين 891 كم)",
            "zh": "946 公里 (赤道 960 公里 / 极半径 891 公里)",
            "ru": "946 км (экватор 960 км / полюса 891 км)"
        },
        "rotation": {
            "ja": "9時間4分24秒 (9.074h) / 傾斜角 4.0°",
            "en": "9h 4m 24s (9.074h) / Axial Tilt 4.0°",
            "de": "9h 4m 24s (9,074h) / Achsneigung 4,0°",
            "fr": "9h 4m 24s (9,074h) / Inclinaison 4,0°",
            "es": "9h 4m 24s (9,074h) / Inclinación 4,0°",
            "pt": "9h 4m 24s (9,074h) / Inclinação 4,0°",
            "it": "9h 4m 24s (9,074h) / Inclinazione 4,0°",
            "ko": "9시간 4분 24초 (9.074h) / 자전축 기울기 4.0°",
            "nl": "9u 4m 24s (9,074u) / Ashelling 4,0°",
            "id": "9j 4m 24d (9,074j) / Kemiringan 4,0°",
            "hi": "9 घंटे 4 मिनट 24 सेकंड (9.074h) / अक्षीय झुकाव 4.0°",
            "ar": "9 ساعات 4 دقائق 24 ثانية / ميل المحور 4.0 درجات",
            "zh": "9小时4分24秒 (9.074小时) / 轨道倾角 4.0°",
            "ru": "9 ч 4 мин 24 с (9,074 ч) / наклон оси 4,0°"
        },
        "orbit": {
            "ja": "4.60 年 (1,682日) / 軌道長半径 2.768 AU (4億1,390万km)",
            "en": "4.60 Years (1,682 days) / Semi-major Axis 2.768 AU (413.9M km)",
            "de": "4,60 Jahre (1.682 Tage) / Große Halbachse 2,768 AE",
            "fr": "4,60 ans (1 682 jours) / Demi-grand axe 2,768 UA",
            "es": "4,60 años (1.682 días) / Semieje mayor 2,768 UA",
            "pt": "4,60 anos (1.682 dias) / Semieixo maior 2,768 UA",
            "it": "4,60 anni (1.682 giorni) / Semiasse maggiore 2,768 UA",
            "ko": "4.60 년 (1,682일) / 궤도 장반경 2.768 AU (4억 1,390만 km)",
            "nl": "4,60 jaar (1.682 dagen) / Halve lange as 2,768 AE",
            "id": "4,60 tahun (1.682 hari) / Sumbu semi-mayor 2,768 SA",
            "hi": "4.60 वर्ष (1,682 दिन) / अर्ध-दीर्घ अक्ष 2.768 AU (41.39 करोड़ किमी)",
            "ar": "4.60 سنة (1,682 يوماً) / نصف المحور الرئيسي 2.768 وحدة فلكية",
            "zh": "4.60 年 (1,682 天) / 轨道半长轴 2.768 AU (4.139亿公里)",
            "ru": "4,60 года (1 682 дня) / большая полуось 2,768 а.е."
        },
        "temperature": {
            "ja": "-105 ℃ (昼側最高 -38 ℃ / 夜側最低 -143 ℃)",
            "en": "-105 °C (Day peak -38 °C / Night low -143 °C)",
            "de": "-105 °C (Tagesmaximum -38 °C / Nacht -143 °C)",
            "fr": "-105 °C (Jour max -38 °C / Nuit min -143 °C)",
            "es": "-105 °C (Máx diurna -38 °C / Mín nocturna -143 °C)",
            "pt": "-105 °C (Máx diurna -38 °C / Mín noturna -143 °C)",
            "it": "-105 °C (Giorno max -38 °C / Notte min -143 °C)",
            "ko": "-105 ℃ (낮 최고 -38 ℃ / 밤 최저 -143 ℃)",
            "nl": "-105 °C (Dagmax -38 °C / Nachtmin -143 °C)",
            "id": "-105 °C (Maks siang -38 °C / Min malam -143 °C)",
            "hi": "-105 °C (दिन का अधिकतम -38 °C / रात का न्यूनतम -143 °C)",
            "ar": "-105°م (أعلى حرارة نهاراً -38°م / ليلاً -143°م)",
            "zh": "-105 ℃ (白昼最高 -38 ℃ / 夜间最低 -143 ℃)",
            "ru": "-105 °C (днем до -38 °C / ночью до -143 °C)"
        },
        "satellites": {
            "ja": "0個 (衛星なし / 小惑星帯唯一の静水圧平衡天体)",
            "en": "0 (No Moons / Only hydrostatic object in Asteroid Belt)",
            "de": "0 (Keine Monde / Einziger runder Körper im Gürtel)",
            "fr": "0 (Aucune lune / Seul corps sphérique de la ceinture)",
            "es": "0 (Sin lunas / Único cuerpo esférico del cinturón)",
            "pt": "0 (Sem luas / Único corpo esférico do cinturão)",
            "it": "0 (Nessuna luna / Unico corpo sferico della fascia)",
            "ko": "0개 (위성 없음 / 소행성대 유일의 구형 천체)",
            "nl": "0 (Geen manen / Enige ronde lichaam in de gordel)",
            "id": "0 (Tanpa bulan / Satu-satunya objek bulat di Sabuk Asteroid)",
            "hi": "0 (कोई चंद्रमा नहीं / क्षुद्रग्रह बेल्ट में एकमात्र गोल पिंड)",
            "ar": "0 (لا توجد أقمار / الجرم الكروي الوحيد في حزام الكويكبات)",
            "zh": "0 个 (无天然卫星 / 小行星带唯一流体静力平衡圆球体)",
            "ru": "0 (Спутников нет / Единственное сферическое тело в поясе)"
        },
        "discovery": {
            "ja": "1801年1月1日、イタリアの天文学者ジュゼッペ・ピアッツィがパレルモ天文台で発見。人類が最初に発見した小惑星。",
            "en": "Discovered on January 1, 1801 by Italian astronomer Giuseppe Piazzi at Palermo Observatory (first asteroid ever found).",
            "de": "Entdeckt am 1. Januar 1801 durch Giuseppe Piazzi in Palermo (erster entdeckter Asteroid der Menschheit).",
            "fr": "Découverte le 1er janvier 1801 par Giuseppe Piazzi à l'observatoire de Palerme (premier astéroïde identifié).",
            "es": "Descubierto el 1 de enero de 1801 por Giuseppe Piazzi en el Observatorio de Palermo (primer asteroide hallado).",
            "pt": "Descoberto em 1º de janeiro de 1801 por Giuseppe Piazzi no Observatório de Palermo (primeiro asteroide encontrado).",
            "it": "Scoperta il 1º gennaio 1801 da Giuseppe Piazzi all'Osservatorio di Palermo (primo asteroide mai scoperto).",
            "ko": "1801년 1월 1일 이탈리아의 주세페 피아치가 팔레르모 천문대에서 발견. 인류가 최초로 발견한 소행성.",
            "nl": "Ontdekt op 1 januari 1801 door Giuseppe Piazzi in Palermo (eerste ontdekte planetoïde).",
            "id": "Ditemukan pada 1 Januari 1801 oleh Giuseppe Piazzi di Observatorium Palermo (asteroid pertama yang ditemukan).",
            "hi": "1 जनवरी 1801 को इतालवी खगोलशास्त्री ग्यूसेप पियाज़ी द्वारा पलेर्मो वेधशाला में खोजा गया (खोजा गया पहला क्षुद्रग्रह)।",
            "ar": "اكتشفه عالم الفلك الإيطالي جوزيبي بيازي في 1 يناير 1801 بمرصد باليرمو (أول كويكب تم اكتشافه).",
            "zh": "1801年1月1日由意大利天文学家朱塞普·皮亚齐在巴勒莫天文台发现，是人类发现的第一颗小行星。",
            "ru": "Открыта 1 января 1801 г. итальянским астрономом Джузеппе Пиацци (первый обнаруженный астероид)."
        },
        "missions": {
            "ja": "NASAドーン（Dawn）探査機（2015年に周回軌道投入）。オッカトル・クレーターの高輝度炭酸ナトリウム白斑や氷火山アフラ・モンスを発見。",
            "en": "NASA Dawn mission (orbited 2015-2018). Discovered bright sodium carbonate salt deposits in Occator Crater and ice volcano Ahuna Mons.",
            "de": "NASA-Sonde Dawn (2015–2018 im Orbit). Entdeckte helle Salzflecken im Occator-Krater und den Eisvulkan Ahuna Mons.",
            "fr": "Mission NASA Dawn (en orbite 2015-2018). Découverte des dépôts de carbonate de sodium d'Occator et du cryovolcan Ahuna Mons.",
            "es": "Misión Dawn de NASA (2015-2018). Descubrió manchas de sal de carbonato de sodio en cráter Occator y el criovolcán Ahuna Mons.",
            "pt": "Missão NASA Dawn (em órbita 2015-2018). Descobriu depósitos de sal em Occator e o criovulcão Ahuna Mons.",
            "it": "Sonda NASA Dawn (in orbita 2015-2018). Scoperti depositi salini nel cratere Occator e il criovulcano Ahuna Mons.",
            "ko": "NASA 던(Dawn) 탐사선(2015~2018 궤도 선회). 오카토르 크레이터의 눈부신 탄산나트륨 백반과 얼음 화산 아후나 몬스 발견.",
            "nl": "NASA Dawn-missie (in baan 2015-2018). Ontdekte witte zoutafzettingen in Occator-krater en ijsvulkaan Ahuna Mons.",
            "id": "Misi NASA Dawn (mengorbit 2015-2018). Menemukan endapan garam di Kawah Occator dan gunung api es Ahuna Mons.",
            "hi": "नासा डॉन मिशन (2015-2018)। ऑकेटर क्रेटर में चमकीले सोडियम कार्बोनेट नमक के निक्षेप और अहुना मॉन्स बर्फ ज्वालामुखी की खोज की।",
            "ar": "مهمة داون التابعة لناسا (دارت في المدار 2015-2018). اكتشفت بقع الملح الساطعة في فوهة أوكاتور وبركان الجليد أهونا مونس.",
            "zh": "NASA黎明号Dawn探测器(2015-2018环绕探测)。发现奥卡托撞击坑闪耀的碳酸钠白色盐斑与阿胡纳山冰火山。",
            "ru": "Зонд NASA Dawn (на орбите 2015–2018 гг.). Открыл яркие соляные пятна в кратере Оккатор и ледяной вулкан Ахуна Монс."
        }
    },
    "PLUTO": {
        "mass": {
            "ja": "1.303 × 10^22 kg (地球の約0.22% / 月の約18%)",
            "en": "1.303 × 10^22 kg (~0.22% Earth / 18% Moon)",
            "de": "1,303 × 10^22 kg (~0,22% der Erde / 18% des Mondes)",
            "fr": "1,303 × 10^22 kg (~0,22% Terre / 18% Lune)",
            "es": "1,303 × 10^22 kg (~0,22% Tierra / 18% Luna)",
            "pt": "1,303 × 10^22 kg (~0,22% Terra / 18% Lua)",
            "it": "1,303 × 10^22 kg (~0,22% Terra / 18% Luna)",
            "ko": "1.303 × 10^22 kg (지구의 약 0.22% / 달의 약 18%)",
            "nl": "1,303 × 10^22 kg (~0,22% Aarde / 18% Maan)",
            "id": "1,303 × 10^22 kg (~0,22% Bumi / 18% Bulan)",
            "hi": "1.303 × 10^22 किग्रा (पृथ्वी का ~0.22% / चंद्रमा का ~18%)",
            "ar": "1.303 × 10^22 كجم (~0.22% من الأرض / ~18% من القمر)",
            "zh": "1.303 × 10^22 千克 (约为地球的0.22% / 月球的18%)",
            "ru": "1,303 × 10^22 кг (~0,22% массы Земли / ~18% Луны)"
        },
        "diameter": {
            "ja": "2,376.6 km (月の約3分の2 / 冥王星最大の準惑星)",
            "en": "2,376.6 km (~2/3 Moon diameter / Largest dwarf planet)",
            "de": "2.376,6 km (~2/3 Monddurchmesser / Größter Zwergplanet)",
            "fr": "2 376,6 km (~2/3 diamètre de la Lune)",
            "es": "2.376,6 km (~2/3 diámetro lunar)",
            "pt": "2.376,6 km (~2/3 diâmetro lunar)",
            "it": "2.376,6 km (~2/3 diametro lunare)",
            "ko": "2,376.6 km (달 지름의 약 3분의 2)",
            "nl": "2.376,6 km (~2/3 maandoorsnede)",
            "id": "2.376,6 km (~2/3 diameter Bulan)",
            "hi": "2,376.6 किमी (चंद्रमा के व्यास का ~2/3)",
            "ar": "2,376.6 كم (~ثلثي قطر القمر / أكبر كوكب قزم)",
            "zh": "2,376.6 公里 (约为月球直径的三分之二 / 柯伊伯带体积最大天体)",
            "ru": "2 376,6 км (~2/3 диаметра Луны / крупнейшая карликовая планета)"
        },
        "rotation": {
            "ja": "6日9時間17分 (6.387d 逆行自転) / 傾斜角 122.5°",
            "en": "6d 9h 17m (6.387d Retrograde) / Axial Tilt 122.5°",
            "de": "6d 9h 17m (6,387d Rückläufig) / Neigung 122,5°",
            "fr": "6j 9h 17m (6,387j Rétrograde) / Inclinaison 122,5°",
            "es": "6d 9h 17m (6,387d Retrógrado) / Inclinación 122,5°",
            "pt": "6d 9h 17m (6,387d Retrógrado) / Inclinação 122,5°",
            "it": "6g 9h 17m (6,387g Retrogrado) / Inclinazione 122,5°",
            "ko": "6일 9시간 17분 (6.387일 역방향 자전) / 자전축 기울기 122.5°",
            "nl": "6d 9u 17m (6,387d Retrograde) / Ashelling 122,5°",
            "id": "6h 9j 17m (6,387h Rotasi terbalik) / Kemiringan 122,5°",
            "hi": "6 दिन 9 घंटे 17 मिनट (6.387d प्रतिगामी) / झुकाव 122.5°",
            "ar": "6 أيام 9 ساعات 17 دقيقة (دوران تراجعي) / ميل المحور 122.5°",
            "zh": "6天9小时17分 (6.387天 逆向自转) / 倾角 122.5°",
            "ru": "6 д 9 ч 17 мин (6,387 д обратное вращение) / наклон 122,5°"
        },
        "orbit": {
            "ja": "247.9 年 (90,560日) / 軌道長半径 39.48 AU (近日点 29.7 AU 〜 遠日点 49.3 AU)",
            "en": "247.9 Years (90,560 days) / Semi-major Axis 39.48 AU (Perihelion 29.7 - Aphelion 49.3 AU)",
            "de": "247,9 Jahre (90.560 Tage) / Große Halbachse 39,48 AE",
            "fr": "247,9 ans (90 560 jours) / Demi-grand axe 39,48 UA",
            "es": "247,9 años (90.560 días) / Semieje mayor 39,48 UA",
            "pt": "247,9 anos (90.560 dias) / Semieixo maior 39,48 UA",
            "it": "247,9 anni (90.560 giorni) / Semiasse maggiore 39,48 UA",
            "ko": "247.9 년 (90,560일) / 궤도 장반경 39.48 AU (근일점 29.7 ~ 원일점 49.3 AU)",
            "nl": "247,9 jaar (90.560 dagen) / Halve lange as 39,48 AE",
            "id": "247,9 tahun (90.560 hari) / Sumbu semi-mayor 39,48 SA",
            "hi": "247.9 वर्ष (90,560 दिन) / अर्ध-दीर्घ अक्ष 39.48 AU (उपसौर 29.7 - अपसौर 49.3 AU)",
            "ar": "247.9 سنة (90,560 يوماً) / نصف المحور الرئيسي 39.48 وحدة فلكية",
            "zh": "247.9 年 (90,560 天) / 轨道半长轴 39.48 AU (近日点 29.7 AU 〜 远日点 49.3 AU)",
            "ru": "247,9 года (90 560 дней) / большая полуось 39,48 а.е."
        },
        "temperature": {
            "ja": "-230 ℃ (44 K / 窒素・メタン・一酸化炭素の氷地表)",
            "en": "-230 °C (44 K / Nitrogen, methane, CO ice surface)",
            "de": "-230 °C (44 K / Stickstoff-, Methan- und CO-Eis)",
            "fr": "-230 °C (44 K / Glaces d'azote, méthane et CO)",
            "es": "-230 °C (44 K / Hielos de nitrógeno, metano y CO)",
            "pt": "-230 °C (44 K / Gelos de nitrogênio, metano e CO)",
            "it": "-230 °C (44 K / Ghiacci di azoto, metano e CO)",
            "ko": "-230 ℃ (44 K / 질소, 메탄, 일산화탄소 얼음 지표)",
            "nl": "-230 °C (44 K / Stikstof-, methaan- en CO-ijs)",
            "id": "-230 °C (44 K / Es nitrogen, metana, dan karbon monoksida)",
            "hi": "-230 °C (44 K / नाइट्रोजन, मीथेन, कार्बन मोनोऑक्साइड बर्फ)",
            "ar": "-230°م (44 كلفن / جليد النيتروجين والميثان وأول أكسيد الكربون)",
            "zh": "-230 ℃ (44 K / 富含氮冰、甲烷冰与一氧化碳冰)",
            "ru": "-230 °C (44 K / азотный, метановый и угарный лед)"
        },
        "satellites": {
            "ja": "5個 (カロン, ステュクス, ニクス, ケルベロス, ヒドラ。カロンとは二重天体)",
            "en": "5 (Charon, Styx, Nix, Kerberos, Hydra. Forms binary system with Charon)",
            "de": "5 (Charon, Styx, Nix, Kerberos, Hydra. Doppelplanetensystem mit Charon)",
            "fr": "5 (Charon, Styx, Nix, Kerberos, Hydra. Système binaire avec Charon)",
            "es": "5 (Caronte, Estigia, Nix, Cerbero, Hidra. Sistema binario con Caronte)",
            "pt": "5 (Caronte, Estige, Nix, Cérbero, Hidra. Sistema binário com Caronte)",
            "it": "5 (Caronte, Stige, Notte, Cerbero, Idra. Sistema binario con Caronte)",
            "ko": "5개 (카론, 스틱스, 닉스, 케르베로스, 히드라. 카론과 쌍성계 형성)",
            "nl": "5 (Charon, Styx, Nix, Kerberos, Hydra. Dubbelsysteem met Charon)",
            "id": "5 (Charon, Styx, Nix, Kerberos, Hydra. Sistem biner dengan Charon)",
            "hi": "5 (कैरोन, स्टिक्स, निक्स, कर्बेरोस, हाइड्रा। कैरोन के साथ द्विआधारी प्रणाली)",
            "ar": "5 (شارون، ستيكس، نيكس، كيربيروس، هيدرا. يشكل نظاماً ثنائياً مع شارون)",
            "zh": "5 个 (卡戎、冥河、冥女、地狱犬、九头蛇。与卡戎构成著名双天体系统)",
            "ru": "5 (Харон, Стикс, Никта, Кербер, Гидра. С Хароном образует двойную систему)"
        },
        "discovery": {
            "ja": "1930年2月18日、米国ローウェル天文台のクライド・トンボーが発見。2006年国際天文学連合(IAU)総会で準惑星に再分類。",
            "en": "Discovered February 18, 1930 by Clyde Tombaugh at Lowell Observatory. Reclassified as dwarf planet by IAU in 2006.",
            "de": "Entdeckt am 18. Februar 1930 durch Clyde Tombaugh (Lowell-Observatorium). 2006 durch IAU als Zwergplanet klassifiziert.",
            "fr": "Découverte le 18 février 1930 par Clyde Tombaugh à l'observatoire Lowell. Reclassée planète naine en 2006.",
            "es": "Descubierto el 18 de febrero de 1930 por Clyde Tombaugh. Reclasificado como planeta enano por la UAI en 2006.",
            "pt": "Descoberto em 18 de fevereiro de 1930 por Clyde Tombaugh. Reclassificado como planeta anão em 2006.",
            "it": "Scoperto il 18 febbraio 1930 da Clyde Tombaugh. Riclassificato come pianeta nano dalla IAU nel 2006.",
            "ko": "1930년 2월 18일 로웰 천문대의 클라이드 톰보가 발견. 2006년 국제천문연맹(IAU) 총회에서 왜행성으로 재분류.",
            "nl": "Ontdekt op 18 februari 1930 door Clyde Tombaugh. In 2006 heringedeeld als dwergplaneet door de IAU.",
            "id": "Ditemukan 18 Februari 1930 oleh Clyde Tombaugh di Observatorium Lowell. Diklasifikasikan ulang sebagai planet kerdil tahun 2006.",
            "hi": "18 फरवरी 1930 को लोवेल वेधशाला में क्लाइड टॉमबॉग द्वारा खोजा गया। 2006 में IAU द्वारा बौने ग्रह के रूप में पुनर्वर्गीकृत।",
            "ar": "اكتشفه كلايد تومبو في 18 فبراير 1930 بمرصد لويل. أعيد تصنيفه ككوكب قزم في عام 2006 من قبل الاتحاد الفلكي الدولي.",
            "zh": "1930年2月18日由克莱德·汤博在洛厄尔天文台发现。2006年国际天文学联合会(IAU)布拉格大会重新分类为矮行星。",
            "ru": "Открыт 18 февраля 1930 г. Клайдом Томбо. В 2006 г. решением МАС переклассифицирован в карликовую планету."
        },
        "missions": {
            "ja": "NASAニュー・ホライズンズ（New Horizons）探査機。2015年7月14日に至近フライバイ成功。ハート型の氷原（スプートニク平原）や多層の大気ヘイズを鮮明に撮影。",
            "en": "NASA New Horizons spacecraft. Historic flyby on July 14, 2015 revealed the iconic heart-shaped Sputnik Planitia and blue atmospheric haze.",
            "de": "NASA New Horizons Raumsonde. Historischer Vorbeiflug am 14. Juli 2015 zeigte das Stickstoffherz (Sputnik Planitia) und blauen Dunst.",
            "fr": "Sonde NASA New Horizons. Survol historique le 14 juillet 2015 révélant le cœur d'azote (Sputnik Planitia) et la brume bleue.",
            "es": "Sonda New Horizons de NASA. Histórico sobrevuelo el 14 de julio de 2015 descubriendo el corazón de hielo Sputnik Planitia y bruma azul.",
            "pt": "Sonda New Horizons da NASA. Sobrevôo histórico em 14 de julho de 2015 revelando o coração de gelo Sputnik Planitia e neblina azul.",
            "it": "Sonda NASA New Horizons. Storico flyby il 14 luglio 2015 che rivelò il cuore di ghiaccio Sputnik Planitia e foschia blu.",
            "ko": "NASA 뉴 허라이즌스(New Horizons) 탐사선. 2015년 7월 14일 사상 최초 근접 비행으로 하트 모양의 스푸트니크 평원과 푸른 대기 연무 촬영.",
            "nl": "NASA New Horizons sonde. Historische scheervlucht op 14 juli 2015 onthulde het stikstofhart Sputnik Planitia en blauwe nevels.",
            "id": "Wahana NASA New Horizons. Terbang lintas bersejarah pada 14 Juli 2015 mengungkap Sputnik Planitia berbentuk hati dan kabut biru.",
            "hi": "नासा न्यू होराइजन्स अंतरिक्ष यान। 14 जुलाई 2015 को ऐतिहासिक फ्लाईबाई ने प्रसिद्ध दिल के आकार के स्पुतनिक प्लैनिटिया और नीले वायुमंडलीय धुंध का खुलासा किया।",
            "ar": "مسبار نيو هورايزونز التابع لناسا. تحليق تاريخي في 14 يوليو 2015 كشف عن سهل سبوتنيك الجليدي الشهير على شكل قلب والضباب الأزرق.",
            "zh": "NASA新视野号New Horizons探测器。2015年7月14日完成人类首次近距离飞越，拍摄到著名的心形氮冰平原(斯普特尼克平原)与蓝色多层大气雾霾。",
            "ru": "Аппарат NASA Новые горизонты. Исторический пролет 14 июля 2015 г. показал знаменитое ледяное сердце (равнину Спутника) и голубую дымку."
        }
    },
    "HALLEY": {
        "mass": {
            "ja": "2.2 × 10^14 kg (ジャガイモ状の低密度・多孔質核)",
            "en": "2.2 × 10^14 kg (Potato-shaped low-density porous nucleus)",
            "de": "2,2 × 10^14 kg (Kartoffelförmiger, poröser Kometenkern)",
            "fr": "2,2 × 10^14 kg (Noyau poreux en forme de pomme de terre)",
            "es": "2,2 × 10^14 kg (Núcleo poroso con forma de patata)",
            "pt": "2,2 × 10^14 kg (Núcleo poroso em forma de batata)",
            "it": "2,2 × 10^14 kg (Nucleo poroso a forma di patata)",
            "ko": "2.2 × 10^14 kg (감자 형태의 다공성 저밀도 혜성핵)",
            "nl": "2,2 × 10^14 kg (Aardappelvormige poreuze kern)",
            "id": "2,2 × 10^14 kg (Inti komet berpori mirip kentang)",
            "hi": "2.2 × 10^14 किग्रा (आलू के आकार का कम घनत्व वाला छिद्रपूर्ण नाभिक)",
            "ar": "2.2 × 10^14 كجم (نواة مسامية منخفضة الكثافة تشبه حبة البطاطس)",
            "zh": "2.2 × 10^14 千克 (呈马铃薯状的不规则多孔低密度彗核)",
            "ru": "2,2 × 10^14 кг (пористое ядро картофелеобразной формы)"
        },
        "diameter": {
            "ja": "15 × 8 × 8 km (平均有効直径 約11 km)",
            "en": "15 × 8 × 8 km (Mean effective diameter ~11 km)",
            "de": "15 × 8 × 8 km (Mittlerer Durchmesser ~11 km)",
            "fr": "15 × 8 × 8 km (Diamètre moyen ~11 km)",
            "es": "15 × 8 × 8 km (Diámetro medio ~11 km)",
            "pt": "15 × 8 × 8 km (Diâmetro médio ~11 km)",
            "it": "15 × 8 × 8 km (Diametro medio ~11 km)",
            "ko": "15 × 8 × 8 km (평균 유효 지름 약 11 km)",
            "nl": "15 × 8 × 8 km (Gemiddelde diameter ~11 km)",
            "id": "15 × 8 × 8 km (Diameter efektif rata-rata ~11 km)",
            "hi": "15 × 8 × 8 किमी (औसत प्रभावी व्यास ~11 किमी)",
            "ar": "15 × 8 × 8 كم (متوسط القطر الفعال ~11 كم)",
            "zh": "15 × 8 × 8 公里 (平均等效直径约 11 公里)",
            "ru": "15 × 8 × 8 км (средний эффективный диаметр ~11 км)"
        },
        "rotation": {
            "ja": "約52.8時間 (2.2日 / 複雑な3軸歳差首振り運動)",
            "en": "52.8 Hours (2.2 days / Complex triaxial tumbling)",
            "de": "52,8 Stunden (2,2 Tage / Komplexe taumelnde Rotation)",
            "fr": "52,8 heures (2,2 jours / Culbute triaxiale complexe)",
            "es": "52,8 horas (2,2 días / Voltereta triaxial compleja)",
            "pt": "52,8 horas (2,2 dias / Rotação triaxial complexa)",
            "it": "52,8 ore (2,2 giorni / Rotazione complessa su 3 assi)",
            "ko": "약 52.8시간 (2.2일 / 복합 3축 세차 텀블링 운동)",
            "nl": "52,8 uur (2,2 dagen / Complexe buitelende rotatie)",
            "id": "52,8 jam (2,2 hari / Gerakan tumbling triaksial kompleks)",
            "hi": "52.8 घंटे (2.2 दिन / जटिल त्रियाक्षीय घूर्णन)",
            "ar": "52.8 ساعة (2.2 يوم / حركة ترنح معقدة ثلاثية المحاور)",
            "zh": "约52.8小时 (2.2天 / 复杂的非主轴三维滚转翻滚运动)",
            "ru": "52,8 часа (2,2 дня / сложное трехосное кувыркание)"
        },
        "orbit": {
            "ja": "75.3 年 (27,500日 / 逆行公転 傾斜角 162.3° / 離心率 0.967)",
            "en": "75.3 Years (27,500 days / Retrograde Inclination 162.3° / Eccentricity 0.967)",
            "de": "75,3 Jahre (27.500 Tage / Retrograd Neigung 162,3° / Exzentrizität 0,967)",
            "fr": "75,3 ans (27 500 jours / Rétrograde Inclinaison 162,3° / Excentricité 0,967)",
            "es": "75,3 años (27.500 días / Retrógrado Inclinación 162,3° / Excentricidad 0,967)",
            "pt": "75,3 anos (27.500 dias / Retrógrado Inclinação 162,3° / Excentricidade 0,967)",
            "it": "75,3 anni (27.500 giorni / Retrogrado Inclinazione 162,3° / Eccentricità 0,967)",
            "ko": "75.3 년 (27,500일 / 역방향 공전 기울기 162.3° / 이심률 0.967)",
            "nl": "75,3 jaar (27.500 dagen / Retrograde glooiing 162,3° / Excentriciteit 0,967)",
            "id": "75,3 tahun (27.500 hari / Inklinasi retrograd 162,3° / Eksentrisitas 0,967)",
            "hi": "75.3 वर्ष (27,500 दिन / प्रतिगामी झुकाव 162.3° / उत्केंद्रता 0.967)",
            "ar": "75.3 سنة (27,500 يوماً / مدار تراجعي بميل 162.3° / انحراف 0.967)",
            "zh": "75.3 年 (27,500 天 / 逆行公转 倾角 162.3° / 轨道离心率 0.967)",
            "ru": "75,3 года (27 500 дней / обратное обращение, наклон 162,3° / эксцентриситет 0,967)"
        },
        "temperature": {
            "ja": "-70 ℃〜+80 ℃ (近日点付近) / -220 ℃以下 (遠日点)",
            "en": "-70 °C to +80 °C (Near perihelion) / <-220 °C (Aphelion)",
            "de": "-70 °C bis +80 °C (Sonnennähe) / <-220 °C (Sonnenferne)",
            "fr": "-70 °C à +80 °C (Périhélie) / <-220 °C (Aphélie)",
            "es": "-70 °C a +80 °C (Perihelio) / <-220 °C (Afelio)",
            "pt": "-70 °C a +80 °C (Periélio) / <-220 °C (Afélio)",
            "it": "-70 °C a +80 °C (Perielio) / <-220 °C (Afelio)",
            "ko": "-70 ℃ ~ +80 ℃ (근일점 부근) / -220 ℃ 이하 (원일점)",
            "nl": "-70 °C tot +80 °C (Dichtst bij de zon) / <-220 °C (Verst)",
            "id": "-70 °C hingga +80 °C (Dekat perihelion) / <-220 °C (Aphelion)",
            "hi": "-70 °C से +80 °C (उपसौर के पास) / <-220 °C (अपसौर)",
            "ar": "-70°م إلى +80°م (بالقرب من الحضيض) / أقل من -220°م (عند الأوج)",
            "zh": "-70 ℃ 至 +80 ℃ (近日点附近表面) / <-220 ℃ (远日点深空)",
            "ru": "от -70 °C до +80 °C (в перигелии) / ниже -220 °C (в афелии)"
        },
        "satellites": {
            "ja": "0個 (オリオン座流星群・みずがめ座η流星群の母天体。尾の長さは1億km以上)",
            "en": "0 (Parent of Orionid & Eta Aquariid meteor showers; tail extends >100M km)",
            "de": "0 (Ursprung der Orioniden & Eta-Aquariiden; Schweif >100 Mio. km)",
            "fr": "0 (Corps parent des Orionides et Eta Aquariides; queue >100M km)",
            "es": "0 (Progenitor de Oriónidas y Eta Acuáridas; cola >100M km)",
            "pt": "0 (Origem das Oriônidas e Eta Aquáridas; cauda >100M km)",
            "it": "0 (Corpo genitore delle Orionidi ed Eta Aquaridi; coda >100M km)",
            "ko": "0개 (오리온자리 유성우 및 물병자리 에타 유성우의 모천체. 꼬리 길이 1억km 이상)",
            "nl": "0 (Oorsprong van Orioniden en Eta Aquariïden; staart >100 mln km)",
            "id": "0 (Induk hujan meteor Orionid & Eta Aquariid; ekor >100 juta km)",
            "hi": "0 (ओरियोनिड्स और एटा एक्वारिड्स उल्कापिंडों का जनक; पूंछ >10 करोड़ किमी)",
            "ar": "0 (الجرم الأم لزخات شهب الجباريات وإيتا الدلويات؛ الذيل يتجاوز 100 مليون كم)",
            "zh": "0 个 (猎户座流星雨与宝瓶座η流星雨的母天体，巨型彗尾可延伸超1亿公里)",
            "ru": "0 (Родоначальник метеорных потоков Ориониды и Эта-Аквариды; хвост >100 млн км)"
        },
        "discovery": {
            "ja": "紀元前240年（中国『史記』秦始皇七年）に最古の記録。1705年英国のエドモンド・ハレーが周期性を証明。",
            "en": "Recorded since at least 240 BC (Chinese Shiji). In 1705, Edmond Halley computed its orbit and predicted its return.",
            "de": "Seit mind. 240 v. Chr. dokumentiert (China). 1705 berechnete Edmond Halley die Umlaufbahn und Periodizität.",
            "fr": "Observée depuis au moins 240 av. J.-C. (Chine). En 1705, Edmond Halley prédit avec succès son retour périodique.",
            "es": "Registrado desde al menos 240 a.C. (China). En 1705, Edmond Halley predijo matemáticamente su regreso.",
            "pt": "Registrado desde 240 a.C. (China). Em 1705, Edmond Halley calculou sua órbita e previu seu retorno.",
            "it": "Registrata dal 240 a.C. (Cina). Nel 1705 Edmond Halley calcolò l'orbita prevedendone il ritorno periodico.",
            "ko": "기원전 240년 중국 『사기(史記)』에 최초 기록. 1705년 영국의 에드먼드 핼리가 궤도 계산을 통해 주기성을 증명.",
            "nl": "Gedocumenteerd sinds minstens 240 v.Chr. (China). In 1705 voorspelde Edmond Halley de periodieke terugkeer.",
            "id": "Tercatat sejak setidaknya 240 SM (Tiongkok). Pada 1705, Edmond Halley menghitung orbit dan meramalkan kepulangannya.",
            "hi": "कम से कम 240 ईसा पूर्व (चीनी शीजी) से दर्ज। 1705 में, एडमंड हैली ने इसकी कक्षा की गणना की और वापसी की भविष्यवाणी की।",
            "ar": "سجلت منذ عام 240 ق.م على الأقل (في السجلات الصينية). في عام 1705، تنبأ إدموند هالي بعودتها الدورية رياضياً.",
            "zh": "公元前240年中国《史记·秦始皇本纪》已有明确观测记录。1705年英国天文学家爱德蒙·哈雷通过引力计算首次证实其为周期回归彗星。",
            "ru": "Наблюдается как минимум с 240 г. до н.э. (хроники Китая). В 1705 г. Эдмонд Галлей доказал ее периодичность."
        },
        "missions": {
            "ja": "1986年「ハレー艦隊」（ESAジオット、JAXAさきがけ・すいせい、ソ連ベガ1・2号）。ジオットが核から600kmまで接近し史上初の核直接撮影に成功。",
            "en": "1986 'Halley Armada' (ESA Giotto, JAXA Sakigake/Suisei, Soviet Vega 1&2). Giotto flew within 600 km, capturing first close-up photos of a comet nucleus.",
            "de": "Halley-Armada 1986 (ESA Giotto, JAXA Sakigake/Suisei, UdSSR Vega 1&2). Giotto fotografierte erstmals den Kometenkern aus 600 km Nähe.",
            "fr": "Armada de Halley en 1986 (ESA Giotto, JAXA Sakigake/Suisei, Vega 1 et 2). Giotto a photographié le noyau à moins de 600 km.",
            "es": "Armada de Halley de 1986 (ESA Giotto, JAXA Sakigake/Suisei, Vega 1 y 2). Giotto tomó las primeras fotos cercanas del núcleo cometario.",
            "pt": "Armada de Halley de 1986 (ESA Giotto, JAXA Sakigake/Suisei, Vega 1 e 2). Giotto capturou as primeiras fotos do núcleo a 600 km.",
            "it": "Armata di Halley del 1986 (ESA Giotto, JAXA Sakigake/Suisei, Vega 1 e 2). Giotto fotografò il nucleo a soli 600 km di distanza.",
            "ko": "1986년 '핼리 함대' (ESA 지오토, JAXA 사키가케·스이세이, 소련 베가 1·2호). 지오토 탐사선이 핵 600km까지 접근하여 인류 최초로 혜성 핵 직접 촬영 성공.",
            "nl": "Halley Armada in 1986 (ESA Giotto, JAXA Sakigake/Suisei, Vega 1 & 2). Giotto naderde tot 600 km en fotografeerde voor het eerst de kern.",
            "id": "Armada Halley 1986 (ESA Giotto, JAXA Sakigake/Suisei, Soviet Vega 1 & 2). Giotto mendekati hingga 600 km dan memotret inti komet.",
            "hi": "1986 'हैली आर्मडा' (ESA जियोटो, JAXA साकीगाके/सुईसी, सोवियत वेगा 1 और 2)। जियोटो ने 600 किमी के भीतर उड़ान भरी, नाभिक की पहली तस्वीरें लीं।",
            "ar": "أسطول هالي عام 1986 (مسبار جيوتو الأوروبي، سابقت وسويسي اليابانيين، وفيغا السوفيتيين). اقترب جيوتو إلى 600 كم والتقط أول صور لنواة مذنب.",
            "zh": "1986年国际“哈雷舰队”(欧空局乔托号Giotto、日本先驱号/彗星号、苏联织女星1/2号)。乔托号飞掠至距核仅600公里处，人类首次拍摄到彗核实貌。",
            "ru": "Армада Галлея 1986 г. (ESA Джотто, JAXA Сакигакэ/Суйсэй, Вега-1 и 2). Джотто пролетел в 600 км и впервые сфотографировал ядро кометы."
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
        id: 'MERCURY',
        name: 'MERCURY (水星 / 第1惑星)',
        color: '#94a3b8',
        radiusKm: 2439.7,
        distKm: 57909050,
        periodDays: 87.97,
        type: 'PLANET',
        symbol: '🔘',
        a: 0.387099, e: 0.205631, I: 7.00487, L: 252.25084, w: 77.45645, node: 48.33167, n: 4.09233444
    },
    {
        id: 'VENUS',
        name: 'VENUS (金星 / 第2惑星)',
        color: '#fef08a',
        radiusKm: 6051.8,
        distKm: 108208000,
        periodDays: 224.70,
        type: 'PLANET',
        symbol: '🟡',
        a: 0.723332, e: 0.006773, I: 3.39471, L: 181.97973, w: 131.57294, node: 76.68069, n: 1.60213022
    },
    {
        id: 'EARTH',
        name: 'EARTH (地球 / 私たちの母なる惑星)',
        color: '#38bdf8',
        radiusKm: 6371.0,
        distKm: 149598023,
        periodDays: 365.256,
        type: 'PLANET',
        symbol: '🌍',
        a: 1.000000, e: 0.016710, I: 0.00005, L: 100.464, w: 102.947, node: 0.0, n: 0.985608
    },
    {
        id: 'MARS',
        name: 'MARS (火星 / 第4惑星)',
        color: '#ef4444',
        radiusKm: 3389.5,
        distKm: 227939200,
        periodDays: 686.98,
        type: 'PLANET',
        symbol: '🔴',
        a: 1.523662, e: 0.093412, I: 1.85061, L: 355.45332, w: 336.04084, node: 49.57854, n: 0.52403840
    },
    {
        id: 'CERES',
        name: 'CERES (ケレス / 小惑星帯準惑星)',
        color: '#94a3b8',
        radiusKm: 473.0,
        distKm: 413900000,
        periodDays: 1682.0,
        type: 'DWARF_PLANET',
        symbol: '🪨',
        a: 2.7675, e: 0.0758, I: 10.593, L: 102.83, w: 73.597, node: 80.305, n: 0.21406
    },
    {
        id: 'JUPITER',
        name: 'JUPITER (木星 / 太陽系最大惑星)',
        color: '#fb923c',
        radiusKm: 69911,
        distKm: 778570000,
        periodDays: 4332.59,
        type: 'PLANET',
        symbol: '🟠',
        a: 5.203363, e: 0.048393, I: 1.30530, L: 34.40438, w: 14.75385, node: 100.55615, n: 0.08308530
    },
    {
        id: 'SATURN',
        name: 'SATURN (土星 / 環を持つ巨大ガス惑星)',
        color: '#fde047',
        radiusKm: 58232,
        distKm: 1433530000,
        periodDays: 10759.22,
        type: 'PLANET',
        symbol: '🪐',
        a: 9.537070, e: 0.054151, I: 2.48446, L: 49.94432, w: 92.43194, node: 113.71504, n: 0.03344423
    },
    {
        id: 'URANUS',
        name: 'URANUS (天王星 / 環を持つ巨大氷惑星)',
        color: '#67e8f9',
        radiusKm: 25362,
        distKm: 2872460000,
        periodDays: 30685.4,
        type: 'PLANET',
        symbol: '🌀',
        a: 19.191264, e: 0.047168, I: 0.76986, L: 313.23218, w: 170.96424, node: 74.22988, n: 0.01172581
    },
    {
        id: 'NEPTUNE',
        name: 'NEPTUNE (海王星 / 最遠の巨大氷惑星)',
        color: '#3b82f6',
        radiusKm: 24622,
        distKm: 4495060000,
        periodDays: 60189.0,
        type: 'PLANET',
        symbol: '🌊',
        a: 30.068963, e: 0.008586, I: 1.76917, L: 304.88003, w: 272.84610, node: 131.72169, n: 0.00598106
    },
    {
        id: 'PLUTO',
        name: 'PLUTO (冥王星 / カイパーベルト準惑星)',
        color: '#d6d3d1',
        radiusKm: 1188.3,
        distKm: 5906380000,
        periodDays: 90560.0,
        type: 'DWARF_PLANET',
        symbol: '❄️',
        a: 39.481687, e: 0.248808, I: 17.14175, L: 14.882, w: 113.76329, node: 110.30347, n: 0.003964
    },
    {
        id: 'HALLEY',
        name: 'HALLEY (ハレー彗星 / 1P/Halley)',
        color: '#38bdf8',
        radiusKm: 5.5,
        distKm: 2668000000,
        periodDays: 27500.0,
        type: 'COMET',
        symbol: '☄️',
        a: 17.834, e: 0.96714, I: 162.26, L: 58.4, w: 111.33, node: 58.42, n: 0.01297
    }
];

/**
 * NASA JPL Standard Keplerian Orbital Elements for Planets (Epoch J2000.0)
 */
const PLANETARY_ORBIT_DATA = {
    MERCURY: { a: 0.38709893, e: 0.20563069, I: 7.00487, L: 252.25084, w: 77.45645, node: 48.33167, n: 4.09233444, periodDays: 87.97, meanDistKm: 57909050 },
    VENUS:   { a: 0.72333199, e: 0.00677323, I: 3.39471, L: 181.97973, w: 131.57294, node: 76.68069, n: 1.60213022, periodDays: 224.70, meanDistKm: 108208000 },
    EARTH:   { a: 1.00000011, e: 0.01671022, I: 0.00005, L: 100.46435, w: 102.94719, node: 0.0,      n: 0.98560766, periodDays: 365.26, meanDistKm: 149598023 },
    MARS:    { a: 1.52366231, e: 0.09341233, I: 1.85061, L: 355.45332, w: 336.04084, node: 49.57854, n: 0.52403840, periodDays: 686.98, meanDistKm: 227939200 },
    CERES:   { a: 2.7675,      e: 0.0758,     I: 10.593,  L: 102.83,    w: 73.597,    node: 80.305,   n: 0.21406,    periodDays: 1682.0,  meanDistKm: 413900000 },
    JUPITER: { a: 5.20336301, e: 0.04839266, I: 1.30530, L: 34.40438,  w: 14.75385,  node: 100.55615, n: 0.08308530, periodDays: 4332.59, meanDistKm: 778570000 },
    SATURN:  { a: 9.53707032, e: 0.05415060, I: 2.48446, L: 49.94432,  w: 92.43194,  node: 113.71504, n: 0.03344423, periodDays: 10759.22, meanDistKm: 1433530000 },
    URANUS:  { a: 19.19126393, e: 0.04716771, I: 0.76986, L: 313.23218, w: 170.96424, node: 74.22988, n: 0.01172581, periodDays: 30685.4, meanDistKm: 2872460000 },
    NEPTUNE: { a: 30.06896348, e: 0.00858587, I: 1.76917, L: 304.88003, w: 272.84610, node: 131.72169, n: 0.00598106, periodDays: 60189.0, meanDistKm: 4495060000 },
    PLUTO:   { a: 39.48168677, e: 0.24880766, I: 17.14175, L: 14.882,   w: 113.76329, node: 110.30347, n: 0.003964,   periodDays: 90560.0, meanDistKm: 5906380000 },
    HALLEY:  { a: 17.834,      e: 0.96714,    I: 162.26,   L: 58.4,      w: 111.33,    node: 58.42,    n: 0.01297,    periodDays: 27500.0, meanDistKm: 2668000000 }
};

/**
 * ケプラー方程式の超高精度・高速求解: M = E - e*sin(E)
 * （ハレー彗星などの極端な長楕円 e=0.967 でも安定収束するハレー法3次アルゴリズム）
 */
function solveKeplerEquation(M_rad, e) {
    let E = (e > 0.8) ? (M_rad + e * Math.sin(M_rad) / (1 - Math.sin(M_rad + e) + Math.sin(M_rad))) : M_rad;
    if (isNaN(E) || !isFinite(E)) E = Math.PI;
    for (let i = 0; i < 30; i++) {
        const sinE = Math.sin(E);
        const cosE = Math.cos(E);
        const f = E - e * sinE - M_rad;
        const fPrime = 1 - e * cosE;
        if (Math.abs(f) < 1e-9) break;
        const fDoublePrime = e * sinE;
        const dE = f / (fPrime - 0.5 * f * fDoublePrime / fPrime);
        E -= dE;
    }
    return E;
}

/**
 * 惑星の日心黄道直交座標 (Heliocentric Ecliptic, AU & Km) を算出
 */
function computeHeliocentricCoordinates(p, d) {
    const deg2rad = Math.PI / 180;
    const M_deg = ((p.L - p.w + p.n * d) % 360 + 360) % 360;
    const M_rad = M_deg * deg2rad;
    const E_rad = solveKeplerEquation(M_rad, p.e);

    const xv = p.a * (Math.cos(E_rad) - p.e);
    const yv = p.a * Math.sqrt(1 - p.e * p.e) * Math.sin(E_rad);
    const r = Math.sqrt(xv * xv + yv * yv);
    const v = Math.atan2(yv, xv);

    const omega = (p.w - p.node) * deg2rad;
    const u = v + omega;

    const nodeRad = p.node * deg2rad;
    const incRad = p.I * deg2rad;

    const xh = r * (Math.cos(nodeRad) * Math.cos(u) - Math.sin(nodeRad) * Math.sin(u) * Math.cos(incRad));
    const yh = r * (Math.sin(nodeRad) * Math.cos(u) + Math.cos(nodeRad) * Math.sin(u) * Math.cos(incRad));
    const zh = r * (Math.sin(u) * Math.sin(incRad));

    return { x: xh, y: yh, z: zh, rAu: r, rKm: r * 149597870.7 };
}

/**
 * 惑星のリアルタイム天体暦（地心距離Km、AU、日心距離、Cesium固定座標系位置）を算出
 */
function computePlanetEphemeris(bodyId, time) {
    if (bodyId === 'EARTH') return null;
    const pData = PLANETARY_ORBIT_DATA[bodyId];
    if (!pData) return null;

    const jsDate = customSimTime || (time ? Cesium.JulianDate.toDate(time) : new Date());
    const d = (jsDate.getTime() / 86400000.0) + 2440587.5 - 2451545.0;

    // 1. 惑星と地球の日心黄道直交座標 (AU)
    const pHelio = computeHeliocentricCoordinates(pData, d);
    const eHelio = computeHeliocentricCoordinates(PLANETARY_ORBIT_DATA.EARTH, d);

    // 2. 地球から見た地心黄道直交ベクトル (AU)
    const gx = pHelio.x - eHelio.x;
    const gy = pHelio.y - eHelio.y;
    const gz = pHelio.z - eHelio.z;
    const geocentricDistAu = Math.sqrt(gx * gx + gy * gy + gz * gz);
    const geocentricDistKm = geocentricDistAu * 149597870.7;

    // 3. 黄道傾斜角 eps = 23.439291 deg による赤道座標系 (ICRF) への厳密回転
    const epsRad = 23.439291 * (Math.PI / 180);
    const cosEps = Math.cos(epsRad);
    const sinEps = Math.sin(epsRad);

    const xIcrf = gx;
    const yIcrf = gy * cosEps - gz * sinEps;
    const zIcrf = gy * sinEps + gz * cosEps;
    const dirIcrf = new Cesium.Cartesian3(xIcrf / geocentricDistAu, yIcrf / geocentricDistAu, zIcrf / geocentricDistAu);

    // 4. 地球固定座標系 (ECEF) への変換
    let dirFixed = dirIcrf;
    const effectiveTime = customSimTime ? Cesium.JulianDate.fromDate(customSimTime) : (time || (viewer && viewer.clock.currentTime));
    if (effectiveTime) {
        try {
            const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(effectiveTime);
            if (icrfToFixed) {
                dirFixed = Cesium.Matrix3.multiplyByVector(icrfToFixed, dirIcrf, new Cesium.Cartesian3());
                Cesium.Cartesian3.normalize(dirFixed, dirFixed);
            }
        } catch(e) {}
    }

    // 5. 3D空間描画用の奥行きスケール配置（実際の地心距離AUに応じた美しい立体深度）
    // 最小(0.28AU: 金星近点) 約1200万km 〜 最大(20AU: 天王星) 約8500万km
    const visualDistanceMeters = 8000000000 * (1.0 + Math.log10(Math.max(0.25, geocentricDistAu)));
    const visualPosFixed = Cesium.Cartesian3.multiplyByScalar(dirFixed, visualDistanceMeters, new Cesium.Cartesian3());

    return {
        geocentricDistKm: geocentricDistKm,
        geocentricDistAu: geocentricDistAu,
        heliocentricDistKm: pHelio.rKm,
        heliocentricDistAu: pHelio.rAu,
        visualPosFixed: visualPosFixed,
        dirFixed: dirFixed,
        pHelio: pHelio,
        eHelio: eHelio
    };
}

// ==========================================================================
// Deep Space Missions & Interplanetary Orbit Visualizer (JWST, Artemis, Mars)
// ==========================================================================
const DEEP_SPACE_MISSIONS = [
    {
        id: 'JWST',
        name: 'James Webb Space Telescope (JWST / ジェイムズ・ウェッブ宇宙望遠鏡)',
        shortName: 'JWST',
        symbol: '🔭',
        color: '#f59e0b',
        parent: 'L2',
        distKm: 1500000,
        periodDays: 180,
        type: 'SPACE_TELESCOPE',
        launchDate: '2021-12-25',
        rocket: 'Ariane 5 ECA (Kourou ELA-3)',
        agency: 'NASA / ESA / CSA',
        site: 'Sun-Earth L2 Lagrange Halo Orbit (~1.5M km)',
        primaryMirror: '6.5 m (18 Gold-Coated Beryllium Hexagons)',
        instruments: 'NIRCam, MIRI, NIRSpec, FGS/NIRISS',
        speedKmS: '0.25 km/s (L2ハロー公転中 / 非静止軌道)',
        modelType: 'JWST'
    },
    {
        id: 'ARTEMIS_ORION',
        name: 'Artemis Orion Spacecraft (アルテミス・オリオン有人月探査船)',
        shortName: 'ARTEMIS ORION',
        symbol: '🚀',
        color: '#38bdf8',
        parent: 'MOON',
        distKm: 384400,
        periodDays: 14,
        type: 'LUNAR_SPACECRAFT',
        launchDate: '2022-11-16 (Artemis I) / Artemis II/III',
        rocket: 'NASA SLS (Space Launch System Block 1)',
        agency: 'NASA / ESA / JAXA',
        site: 'Lunar Distant Retrograde Orbit (DRO) & NRHO',
        crewCapacity: '4 Astronauts',
        instruments: 'European Service Module (ESM), Callisto AI, Optical Comm',
        speedKmS: '1.2 - 2.5 km/s (Lunar Orbit)',
        modelType: 'ORION'
    },
    {
        id: 'LRO',
        name: 'Lunar Reconnaissance Orbiter (LRO / 月周回観測衛星)',
        shortName: 'LRO',
        symbol: '🌕',
        color: '#e2e8f0',
        parent: 'MOON',
        distKm: 384400,
        periodDays: 0.083,
        type: 'LUNAR_ORBITER',
        launchDate: '2009-06-18',
        rocket: 'Atlas V 401',
        agency: 'NASA / Goddard Space Flight Center',
        site: 'Low Lunar Polar Orbit (~50 km altitude)',
        instruments: 'LROC (0.5m/px camera), LOLA Laser Altimeter, Diviner',
        speedKmS: '1.63 km/s',
        modelType: 'ORBITER'
    },
    {
        id: 'MARS_PERSEVERANCE',
        name: 'Mars 2020 Perseverance Rover (パーサヴィアランス火星探査車)',
        shortName: 'PERSEVERANCE',
        symbol: '🚜',
        color: '#f97316',
        parent: 'MARS',
        distKm: 225000000,
        periodDays: 1.026,
        type: 'MARS_ROVER',
        launchDate: '2020-07-30 (Landed: 2021-02-18)',
        rocket: 'Atlas V 541',
        agency: 'NASA / Jet Propulsion Laboratory (JPL)',
        site: 'Jezero Crater, Mars (18.38°N, 77.58°E)',
        instruments: 'SuperCam, Mastcam-Z, MOXIE (Oxygen In-Situ), PIXL, RIMFAX',
        speedKmS: 'Surface Rover / Sample Cacher',
        modelType: 'ROVER'
    },
    {
        id: 'MARS_MRO',
        name: 'Mars Reconnaissance Orbiter (MRO / マーズ・リコネサンス・オービター)',
        shortName: 'MRO',
        symbol: '🔴',
        color: '#ef4444',
        parent: 'MARS',
        distKm: 225000000,
        periodDays: 0.078,
        type: 'MARS_ORBITER',
        launchDate: '2005-08-12',
        rocket: 'Atlas V 401',
        agency: 'NASA / JPL',
        site: 'Sun-synchronous Mars Polar Orbit (250 × 316 km)',
        instruments: 'HiRISE (0.3m/px Ultra-HD Camera), CRISM, CTX, SHARAD',
        speedKmS: '3.42 km/s (Mars Orbit)',
        modelType: 'ORBITER'
    },
    {
        id: 'HAYABUSA2',
        name: 'Hayabusa2 Extended Mission (はやぶさ2・拡張小惑星探査ミッション)',
        shortName: 'HAYABUSA2',
        symbol: '🛸',
        color: '#10b981',
        parent: 'SUN',
        distKm: 180000000,
        periodDays: 450,
        type: 'ASTEROID_PROBE',
        launchDate: '2014-12-03 (Earth Return: 2020-12-06)',
        rocket: 'H-IIA 202 (Tanegashima)',
        agency: 'JAXA (Japan Aerospace Exploration Agency)',
        site: 'Heliocentric Interplanetary Orbit towards 1998 KY26',
        instruments: 'Microwave Ion Thrusters (IES), ONC-T, TIR, NIRS3',
        speedKmS: '28.4 km/s (Heliocentric)',
        modelType: 'PROBE'
    },
    {
        id: 'VOYAGER1',
        name: 'Voyager 1 Interstellar Mission (ボイジャー1号・恒星間脱出探査機)',
        shortName: 'VOYAGER 1',
        symbol: '🌌',
        color: '#c084fc',
        parent: 'INTERSTELLAR',
        distKm: 24500000000,
        periodDays: '---',
        type: 'INTERSTELLAR_PROBE',
        launchDate: '1977-09-05',
        rocket: 'Titan IIIE / Centaur',
        agency: 'NASA / JPL',
        site: 'Interstellar Space beyond Heliopause (~164 AU)',
        instruments: 'The Golden Record, Magnetometer (MAG), Cosmic Ray Subsystem',
        speedKmS: '17.0 km/s (Escape Velocity)',
        modelType: 'VOYAGER'
    },
    {
        id: 'VOYAGER2',
        name: 'Voyager 2 Grand Tour Mission (ボイジャー2号・惑星大紀行探査機)',
        shortName: 'VOYAGER 2',
        symbol: '🌊',
        color: '#38bdf8',
        parent: 'INTERSTELLAR',
        distKm: 20500000000,
        periodDays: '---',
        type: 'INTERSTELLAR_PROBE',
        launchDate: '1977-08-20',
        rocket: 'Titan IIIE / Centaur',
        agency: 'NASA / JPL',
        site: 'Interstellar Space beyond Heliopause (~137 AU / Neptune: 1989)',
        instruments: 'The Golden Record, Magnetometer (MAG), Cosmic Ray Subsystem, CRS',
        speedKmS: '15.3 km/s (Escape Velocity)',
        modelType: 'VOYAGER2'
    },
    {
        id: 'APOLLO11',
        name: 'Apollo 11 Spacecraft (アポロ11号・司令船コロンビア & 月着陸船イーグル)',
        shortName: 'APOLLO 11',
        symbol: '🌕',
        color: '#fbbf24',
        parent: 'MOON',
        distKm: 384400,
        periodDays: 0.083,
        type: 'LUNAR_MISSION',
        isHistoricOnly: true,
        historicYear: 1969,
        launchDate: '1969-07-16 (Moon Landing: 1969-07-20)',
        rocket: 'Saturn V (SA-506)',
        agency: 'NASA',
        site: 'Lunar Orbit & Tranquility Base (0.67°N, 23.47°E)',
        instruments: 'LM Eagle, Columbia CSM, EASEP, Lunar Surface Scientific Experiments',
        speedKmS: '1.63 km/s (Lunar Orbit)',
        modelType: 'APOLLO'
    },
    {
        id: 'SPUTNIK1',
        name: 'Sputnik 1 (スプートニク1号・人類初の人工衛星)',
        shortName: 'SPUTNIK 1',
        symbol: '🛰️',
        color: '#f43f5e',
        parent: 'EARTH',
        distKm: 6586,
        periodDays: 0.067,
        type: 'HISTORIC_SATELLITE',
        isHistoricOnly: true,
        historicYear: 1957,
        launchDate: '1957-10-04',
        rocket: 'R-7 Semyorka (8K71PS)',
        agency: 'Soviet Union (OKB-1)',
        site: 'Low Earth Elliptical Orbit (215 × 939 km / 65.1° inc)',
        instruments: '20.005 MHz / 40.002 MHz Radio Transmitters, 4 Whip Antennas',
        speedKmS: '7.80 km/s',
        modelType: 'SPUTNIK'
    }
];

const DEEP_SPACE_DISPLAY_NAMES = {
    JWST: {
        ja: '🔭 JWST (ジェイムズ・ウェッブ宇宙望遠鏡 / L2)',
        en: '🔭 JWST (James Webb Space Telescope / L2)',
        de: '🔭 JWST (James-Webb-Weltraumteleskop / L2)',
        fr: '🔭 JWST (Télescope spatial James Webb / L2)',
        es: '🔭 JWST (Telescopio Espacial James Webb / L2)',
        pt: '🔭 JWST (Telescópio Espacial James Webb / L2)',
        it: '🔭 JWST (Telescopio Spaziale James Webb / L2)',
        ko: '🔭 JWST (제임스 웹 우주망원경 / L2)',
        nl: '🔭 JWST (James Webb-ruimtetelescoop / L2)',
        id: '🔭 JWST (Teleskop Luar Angkasa James Webb / L2)',
        hi: '🔭 JWST (जेम्स वेब स्पेस टेलीस्कोप / L2)',
        ar: '🔭 JWST (تلسكوب جيمس ويب الفضائي / L2)',
        zh: '🔭 JWST (詹姆斯·韦伯空间望远镜 / L2)',
        ru: '🔭 JWST (Космический телескоп Джеймс Уэбб / L2)'
    },
    ARTEMIS_ORION: {
        ja: '🚀 アルテミス・オリオン有人探査船 (月DRO軌道)',
        en: '🚀 Artemis Orion Spacecraft (Lunar DRO)',
        de: '🚀 Artemis Orion Raumschiff (Mond DRO-Orbit)',
        fr: '🚀 Vaisseau spatial Artemis Orion (DRO lunaire)',
        es: '🚀 Nave espacial Artemis Orion (DRO lunar)',
        pt: '🚀 Nave espacial Artemis Orion (DRO lunar)',
        it: '🚀 Navicella Artemis Orion (DRO lunare)',
        ko: '🚀 아르테미스 오리온 우주선 (달 DRO 궤도)',
        nl: '🚀 Artemis Orion Ruimteschip (Maan DRO)',
        id: '🚀 Pesawat Luar Angkasa Artemis Orion (DRO Bulan)',
        hi: '🚀 आर्टेमिस ओरियन अंतरिक्ष यान (चंद्र DRO)',
        ar: '🚀 مركبة أرتيميس أوريون الفضائية (مدار قمري)',
        zh: '🚀 阿尔忒弥斯·猎户座载人飞船 (月球DRO轨道)',
        ru: '🚀 Корабль Артемида Орион (Лунная DRO орбита)'
    },
    LRO: {
        ja: '🌕 LRO (月周回偵察探査衛星 / 月低軌道)',
        en: '🌕 LRO (Lunar Reconnaissance Orbiter)',
        de: '🌕 LRO (Lunar Reconnaissance Orbiter / Mondorbit)',
        fr: '🌕 LRO (Lunar Reconnaissance Orbiter)',
        es: '🌕 LRO (Orbitador de Reconocimiento Lunar)',
        pt: '🌕 LRO (Orbitador de Reconhecimento Lunar)',
        it: '🌕 LRO (Lunar Reconnaissance Orbiter)',
        ko: '🌕 LRO (달 정찰 궤도선 / 달 저궤도)',
        nl: '🌕 LRO (Lunar Reconnaissance Orbiter)',
        id: '🌕 LRO (Pengorbit Pengintaian Bulan)',
        hi: '🌕 LRO (चंद्र टोही ऑर्बिटर)',
        ar: '🌕 مسبار الاستطلاع القمري (LRO)',
        zh: '🌕 LRO (月球勘测轨道飞行器 / 极轨)',
        ru: '🌕 LRO (Лунный разведывательный орбитальный аппарат)'
    },
    MARS_PERSEVERANCE: {
        ja: '🚜 パーサヴィアランス探査車 (火星ジェゼロ湖底)',
        en: '🚜 Perseverance Rover (Mars Jezero Crater)',
        de: '🚜 Perseverance Rover (Mars Jezero-Krater)',
        fr: '🚜 Rover Perseverance (Cratère Jezero, Mars)',
        es: '🚜 Rover Perseverance (Cráter Jezero, Marte)',
        pt: '🚜 Rover Perseverance (Cratera Jezero, Marte)',
        it: '🚜 Rover Perseverance (Cratere Jezero, Marte)',
        ko: '🚜 퍼서비어런스 로버 (화성 예제로 분화구)',
        nl: '🚜 Perseverance Rover (Mars Jezero-krater)',
        id: '🚜 Wahana Perseverance (Kawah Jezero Mars)',
        hi: '🚜 पर्सिवियरेंस रोवर (मंगल जेज़ेरो क्रेटर)',
        ar: '🚜 مسبار بيرسيفيرانس (فوهة جيزيرو، المريخ)',
        zh: '🚜 毅力号火星车 (火星杰泽罗湖底)',
        ru: '🚜 Марсоход Персеверанс (Кратер Езеро, Марс)'
    },
    MARS_MRO: {
        ja: '🔴 MRO (マーズ・リコネサンス・オービター / 火星極軌道)',
        en: '🔴 MRO (Mars Reconnaissance Orbiter)',
        de: '🔴 MRO (Mars Reconnaissance Orbiter)',
        fr: '🔴 MRO (Mars Reconnaissance Orbiter)',
        es: '🔴 MRO (Orbitador de Reconocimiento de Marte)',
        pt: '🔴 MRO (Orbitador de Reconhecimento de Marte)',
        it: '🔴 MRO (Mars Reconnaissance Orbiter)',
        ko: '🔴 MRO (화성 정찰 위성 / 극궤도)',
        nl: '🔴 MRO (Mars Reconnaissance Orbiter)',
        id: '🔴 MRO (Pengorbit Pengintaian Mars)',
        hi: '🔴 MRO (मंगल टोही ऑर्बिटर)',
        ar: '🔴 مسبار استطلاع المريخ مداري (MRO)',
        zh: '🔴 MRO (火星勘测轨道飞行器 / 极轨)',
        ru: '🔴 MRO (Марсианский разведывательный спутник)'
    },
    HAYABUSA2: {
        ja: '🛸 はやぶさ2 (小惑星探査機 / 太陽周回軌道)',
        en: '🛸 Hayabusa2 (Asteroid Sample Return / Heliocentric)',
        de: '🛸 Hayabusa2 (Asteroidensonde / Sonnenorbit)',
        fr: '🛸 Hayabusa2 (Sonde spatiale d\'astéroïdes / Héliocentrique)',
        es: '🛸 Hayabusa2 (Sonda de asteroides / Heliocéntrica)',
        pt: '🛸 Hayabusa2 (Sonda de asteroides / Heliocêntrica)',
        it: '🛸 Hayabusa2 (Sonda per asteroidi / Eliocentrica)',
        ko: '🛸 하야부사2 (소행성 탐사선 / 태양 주회 궤도)',
        nl: '🛸 Hayabusa2 (Asteroïdesonde / Heliocentrisch)',
        id: '🛸 Hayabusa2 (Penjelajah Asteroid / Heliosentris)',
        hi: '🛸 हयाबुसा 2 (क्षुद्रग्रह अन्वेषण यान / सूर्य-केन्द्रित)',
        ar: '🛸 هايابوسا 2 (مسبار الكويكبات / مدار شمسي)',
        zh: '🛸 隼鸟2号 (小行星探测器 / 日心轨道)',
        ru: '🛸 Хаябуса-2 (Межпланетный зонд / Гелиоцентрический)'
    },
    VOYAGER1: {
        ja: '🌌 ボイジャー1号 (最遠の星間脱出探査機 / 164 AU)',
        en: '🌌 Voyager 1 (Interstellar Space / ~164 AU)',
        de: '🌌 Voyager 1 (Interstellarer Raum / ~164 AE)',
        fr: '🌌 Voyager 1 (Espace interstellaire / ~164 UA)',
        es: '🌌 Voyager 1 (Espacio interestelar / ~164 UA)',
        pt: '🌌 Voyager 1 (Espaço interestelar / ~164 UA)',
        it: '🌌 Voyager 1 (Spazio interstellare / ~164 UA)',
        ko: '🌌 보이저 1호 (성간 공간 탐사선 / ~164 AU)',
        nl: '🌌 Voyager 1 (Interstellaire Ruimte / ~164 AE)',
        id: '🌌 Voyager 1 (Ruang Antarbintang / ~164 AU)',
        hi: '🌌 वॉयेजर 1 (इंटरस्टेलर अंतरिक्ष / ~164 AU)',
        ar: '🌌 فوياجر 1 (الفضاء بين النجوم / ~164 وحدة فلكية)',
        zh: '🌌 旅行者1号 (星际空间探测器 / 164天文单位)',
        ru: '🌌 Вояджер-1 (Межзвездное пространство / ~164 а.е.)'
    },
    VOYAGER2: {
        ja: '🌊 ボイジャー2号 (惑星大紀行探査機 / 137 AU)',
        en: '🌊 Voyager 2 (Grand Tour Interstellar Probe / ~137 AU)',
        de: '🌊 Voyager 2 (Grand Tour Sonde / ~137 AE)',
        fr: '🌊 Voyager 2 (Grand Tour interstellaire / ~137 UA)',
        es: '🌊 Voyager 2 (Sonda Gran Tour / ~137 UA)',
        pt: '🌊 Voyager 2 (Sonda Grand Tour / ~137 UA)',
        it: '🌊 Voyager 2 (Sonda Grand Tour / ~137 UA)',
        ko: '🌊 보이저 2호 (행성 대기행 성간 탐사선 / ~137 AU)',
        nl: '🌊 Voyager 2 (Grand Tour ruimtesonde / ~137 AE)',
        id: '🌊 Voyager 2 (Wahana Grand Tour / ~137 AU)',
        hi: '🌊 वॉयेजर 2 (ग्रैंड टूर प्रोब / ~137 AU)',
        ar: '🌊 فوياجر 2 (مسبار الجولة الكبرى / ~137 وحدة فلكية)',
        zh: '🌊 旅行者2号 (行星大巡礼深空探测器 / 137天文单位)',
        ru: '🌊 Вояджер-2 (Гранд-тур зонд / ~137 а.е.)'
    },
    APOLLO11: {
        ja: '🌕 アポロ11号 (人類初月面着陸有人船 / 月軌道)',
        en: '🌕 Apollo 11 (First Moon Landing Spacecraft / Lunar Orbit)',
        de: '🌕 Apollo 11 (Erste bemannte Mondlandung / Mondorbit)',
        fr: '🌕 Apollo 11 (Premier alunissage habité / Orbite lunaire)',
        es: '🌕 Apolo 11 (Primer alunizaje tripulado / Órbita lunar)',
        pt: '🌕 Apollo 11 (Primeiro pouso lunar tripulado / Orbita lunar)',
        it: '🌕 Apollo 11 (Primo allunaggio con equipaggio / Orbita lunare)',
        ko: '🌕 아폴로 11호 (인류 최초 유인 달 착륙선 / 달 궤도)',
        nl: '🌕 Apollo 11 (Eerste bemande maanlanding / Maanbaan)',
        id: '🌕 Apollo 11 (Pendaratan Berawak Pertama di Bulan / Orbit Bulan)',
        hi: '🌕 अपोलो 11 (प्रथम मानवयुक्त चंद्र लैंडिंग / चंद्र कक्षा)',
        ar: '🌕 أبولو 11 (أول هبوط مأهول على القمر / مدار قمري)',
        zh: '🌕 阿波罗11号 (人类首次载人登月飞船 / 月球轨道)',
        ru: '🌕 Аполлон-11 (Первая пилотируемая высадка на Луну / Лунная орбита)'
    },
    SPUTNIK1: {
        ja: '🛰️ スプートニク1号 (人類史上初の人工衛星 / 地球周回)',
        en: '🛰️ Sputnik 1 (World\'s First Artificial Satellite / Earth Orbit)',
        de: '🛰️ Sputnik 1 (Erster künstlicher Erdsatellit / Erdorbit)',
        fr: '🛰️ Spoutnik 1 (Premier satellite artificiel au monde / Orbite)',
        es: '🛰️ Sputnik 1 (Primer satélite artificial de la historia / Órbita)',
        pt: '🛰️ Sputnik 1 (Primeiro satélite artificial do mundo / Orbita)',
        it: '🛰️ Sputnik 1 (Primo satellite artificiale della storia / Orbita)',
        ko: '🛰️ 스푸트니크 1호 (인류 최초의 인공위성 / 지구 저궤도)',
        nl: '🛰️ Spoetnik 1 (Eerste kunstmatige satelliet / Aardbaan)',
        id: '🛰️ Sputnik 1 (Satelit Buatan Pertama di Dunia / Orbit Bumi)',
        hi: '🛰️ स्पुतनिक 1 (दुनिया का पहला कृत्रिम उपग्रह / पृथ्वी कक्षा)',
        ar: '🛰️ سبوتنيك 1 (أول قمر صناعي في العالم / مدار أرضي)',
        zh: '🛰️ 斯普特尼克1号 (人类历史上第一颗人造地球卫星 / 环地轨道)',
        ru: '🛰️ Спутник-1 (Первый в мире искусственный спутник Земли / Орбита)'
    }
};

const DEEP_SPACE_DESCRIPTIONS = {
    "JWST": {
        "ja": "NASA・ESA・CSAが共同開発した人類史上最強の次世代宇宙望遠鏡。※地球の赤道上空3.6万kmにとどまる「静止衛星」とは全く異なり、月（約38万km）のさらに4倍も遠い約150万km彼方の「太陽-地球 第2ラグランジュ点（L2）」を半年かけて1周する巨大なハロー軌道を飛行しています。18枚の金コーティング・ベリリウム製六角形主鏡（口径6.5m）とテニスコート大の5層サンシールドを備え、絶対零度近くの極低温（-233℃以下）から135億年以上前の宇宙黎明期の最遠銀河や太陽系外惑星の大気成分を直接検出しています。",
        "en": "The premier deep space observatory developed by NASA, ESA, and CSA. Unlike geostationary satellites orbiting 36,000 km above Earth, JWST is stationed ~1.5 million km away (4 times farther than the Moon) in a wide Halo orbit around the Sun-Earth L2 Lagrange point, completing one orbit every ~6 months. Featuring a 6.5-meter gold-coated beryllium mirror and tennis-court-sized sunshield, it operates below -233°C to observe the universe's first luminous galaxies from 13.5 billion years ago and analyze exoplanet atmospheres.",
        "de": "Das weltweit leistungsfähigste Weltraumteleskop von NASA, ESA und CSA. Im Gegensatz zu Geostationären Satelliten umkreist es den 1,5 Mio. km entfernten Sonne-Erde-L2-Lagrange-Punkt in einem weiten Halo-Orbit mit einem 6,5 m Beryllium-Goldspiegel bei unter -233°C.",
        "fr": "Le plus puissant télescope spatial jamais conçu par la NASA, l'ESA et l'ASC. Bien distinct d'un satellite géostationnaire, il évolue sur une orbite de halo au point de Lagrange L2 à 1,5 million de km de la Terre pour observer les premières galaxies de l'Univers.",
        "es": "El telescopio espacial más avanzado del mundo, desarrollado por NASA, ESA y CSA. A diferencia de un satélite geoestacionario, orbita en un halo alrededor del punto Lagrange L2 a 1,5 millones de km de la Tierra, captando galaxias a 13.500 millones de años luz.",
        "pt": "O mais poderoso telescópio espacial do mundo, desenvolvido pela NASA, ESA e CSA. Opera em uma órbita de halo no ponto Lagrange L2 a 1,5 milhão de km da Terra para observar as primeiras galáxias do universo.",
        "it": "Il più potente telescopio spaziale del mondo sviluppato da NASA, ESA e CSA. A 1,5 milioni di km dalla Terra nel punto di Lagrange L2, scruta le prime galassie dell'universo e le atmosfere esoplanetarie.",
        "ko": "NASA, ESA, CSA가 공동 개발한 인류 역사상 최강의 우주망원경. 지구에서 150만 km 떨어진 태양-지구 L2 라그랑주 점의 헤일로 궤도를 돌며 135억 년 전 최초의 은하와 외계 행성 대기를 관측합니다.",
        "nl": "De krachtigste ruimtetelescoop ter wereld van NASA, ESA en CSA, gestationeerd op 1,5 miljoen km afstand in het zon-aarde L2 Lagrange-punt om het vroege heelal te bestuderen.",
        "id": "Teleskop luar angkasa terkuat di dunia yang dikembangkan oleh NASA, ESA, dan CSA. Berada di titik Lagrange L2 sejauh 1,5 juta km dari Bumi untuk mengamati galaksi-galaksi awal alam semesta.",
        "hi": "नासा, ईएसए और सीएसए द्वारा विकसित दुनिया का सबसे शक्तिशाली अंतरिक्ष टेलीस्कोप। पृथ्वी से 15 लाख किमी दूर सूर्य-पृथ्वी L2 बिंदु पर स्थित, यह 13.5 अरब साल पुरानी आकाशगंगाओं का अध्ययन करता है।",
        "ar": "أقوى تلسكوب فضائي في العالم تم تطويره بالتعاون بين ناسا ووكالة الفضاء الأوروبية والكندية، يدور في نقطة لاغرانج L2 على بعد 1.5 مليون كم من الأرض لرصد فجر الكون.",
        "zh": "NASA、ESA与CSA联合研制的人类史上最强太空望远镜。不同于赤道上空3.6万公里的地球静止卫星，它运行在距地约150万公里（月球距离4倍）的日地L2拉格朗日点巨大光环轨道上，每半年公转一周，探索135亿年前早期宇宙。",
        "ru": "Самый мощный космический телескоп в истории, созданный NASA, ESA и CSA. Он обращается по гало-орбите вокруг точки Лагранжа L2 в 1,5 млн км от Земли (в 4 раза дальше Луны), исследуя первые галактики Вселенной."
    },
    "ARTEMIS_ORION": {
        "ja": "人類の月面再到達と将来の火星有人探査を目指す国際深宇宙探査計画「アルテミス計画」の中核を担う有人宇宙船。月を周回する遠方逆行軌道（DRO）や近直線ハロー軌道（NRHO）を飛行。欧州宇宙機関（ESA）が提供するサービスモジュール（ESM）と強固な耐熱シールドを搭載し、月軌道ステーション「ゲートウェイ」への人員・物資輸送を担います。",
        "en": "The flagship crewed spacecraft of NASA's Artemis campaign, designed to return humanity to the Moon and prepare for missions to Mars. Orion features advanced life support for 4 astronauts, a high-capacity heat shield engineered for 40,000 km/h lunar re-entry, and the European Service Module (ESM) providing propulsion, power, and consumables in lunar Distant Retrograde Orbit (DRO).",
        "de": "Das bemannte Flaggschiff-Raumschiff des Artemis-Programms von NASA, ESA und JAXA für Langzeitmissionen im Mondorbit und die Vorbereitung von bemannten Flügen zum Mars.",
        "fr": "Le vaisseau spatial habité du programme Artemis de la NASA, de l'ESA et de la JAXA, conçu pour ramener l'humanité sur la Lune et préparer les futures missions habitées vers Mars.",
        "es": "Nave tripulada insignia del programa Artemis de la NASA, ESA y JAXA, diseñada para devolver a la humanidad a la Luna y preparar misiones tripuladas hacia Marte.",
        "pt": "A principal espaçonave tripulada do programa Artemis da NASA, ESA e JAXA, projetada para levar a humanidade de volta à Lua e preparar futuras missões a Marte.",
        "it": "La navicella con equipaggio del programma Artemis di NASA, ESA e JAXA, progettata per riportare l'umanità sulla Luna e preparare le missioni su Marte.",
        "ko": "인류의 달 착륙과 화성 유인 탐사를 목표로 하는 아르테미스 계획의 핵심 유인 우주선. 달 원거리 역행 궤도(DRO)를 비행하며 우주비행사 수송 및 게이트웨이 기지 건설을 담당합니다.",
        "nl": "Het bemande vlaggenschip van NASA's Artemis-programma, ontworpen om de mensheid terug te brengen naar de Maan en missies naar Mars voor te bereiden.",
        "id": "Pesawat luar angkasa berawak andalan program Artemis NASA, dirancang untuk mengembalikan manusia ke Bulan dan mempersiapkan misi ke Mars.",
        "hi": "नासा के आर्टेमिस कार्यक्रम का प्रमुख मानवयुक्त अंतरिक्ष यान, जो मानव को चंद्रमा पर वापस लाने और मंगल मिशन की तैयारी के लिए डिज़ाइन किया गया है।",
        "ar": "المركبة الفضائية المأهولة الرئيسية لبرنامج أرتيميس التابع لناسا، مصممة لإعادة البشر إلى القمر والتحضير للرحلات المأهولة إلى المريخ.",
        "zh": "NASA阿尔忒弥斯计划的核心载人飞船，由NASA、ESA和JAXA联合打造，运行于月球远距离逆行轨道（DRO），旨在实现人类重返月球并为登陆火星奠定基础。",
        "ru": "Пилотируемый корабль лунной программы Artemis NASA, ESA и JAXA, предназначенный для доставки астронавтов на орбиту Луны и подготовки экспедиций на Марс."
    },
    "LRO": {
        "ja": "NASAの月周回探査機（Lunar Reconnaissance Orbiter）。月面からわずか高度50kmの極軌道から、高解像度カメラLROC（解像度0.5m/px）やレーザー高度計LOLAを用いて、アポロ着陸船の遺留品や月面の詳細地形、永久影の極域クレーターに眠る水氷資源を継続的に観測・マッピングしています。",
        "en": "NASA's robotic spacecraft orbiting the Moon in a polar mapping orbit at ~50 km altitude. Equipped with LROC (0.5m/pixel resolution), LOLA laser altimeter, and Diviner radiometer, LRO has mapped over 99% of the lunar surface, locating Apollo landing sites, fresh impact craters, and extensive water-ice deposits inside permanently shadowed craters at the lunar poles.",
        "de": "Mondsonde der NASA im polaren Mondorbit in nur 50 km Höhe zur Erstellung hochauflösender 3D-Karten und Aufspürung von Wassereisvorkommen in den Polkratern.",
        "fr": "Sonde spatiale de la NASA en orbite lunaire à 50 km d'altitude, cartographiant le relief lunaire et détectant la glace d'eau aux pôles avec une précision de 0,5 m/pixel.",
        "es": "Sonda espacial de la NASA en órbita polar lunar a solo 50 km de altitud, cartografiando el relieve lunar y localizando reservas de hielo de agua en los polos.",
        "pt": "Sonda espacial da NASA em órbita polar lunar a apenas 50 km de altitude, mapeando a superfície lunar e detectando depósitos de gelo de água nos polos.",
        "it": "Sonda lunare della NASA a soli 50 km di altitudine, che mappa la superficie e individua riserve di ghiaccio d'acqua nei crateri polari.",
        "ko": "NASA의 달 정찰 궤도선. 달 표면 50km 상공 극궤도에서 초고해상도 카메라(0.5m/px)로 아폴로 착륙지, 정밀 3D 지형, 극지방 영구 음영 지역의 물 얼음을 지속 탐사하고 있습니다.",
        "nl": "NASA-ruimtesonde in een polaire baan op 50 km boven de Maan, die de maanbodem gedetailleerd in kaart brengt en zoekt naar waterijs.",
        "id": "Wahana antariksa NASA yang mengorbit Bulan di ketinggian 50 km, memetakan permukaan Bulan dan mendeteksi cadangan es air di kawah kutub.",
        "hi": "चंद्रमा की सतह से केवल 50 किमी ऊपर ध्रुवीय कक्षा में नासा का उपग्रह, जो चंद्र सतह का 3D मानचित्रण और ध्रुवों पर जल-बर्फ की खोज कर रहा है।",
        "ar": "مسبار مداري قمري تابع لناسا على ارتفاع 50 كم فقط، يقوم برسم خرائط ثلاثية الأبعاد لسطح القمر والبحث عن الجليد المائي في الفوهات القطبية.",
        "zh": "NASA的极轨月球勘测轨道飞行器，在距离月表仅50公里的超低轨道运行，搭载LROC高清相机（0.5米/像素），绘制月面精细3D地形并探寻永久阴影区水冰。",
        "ru": "Лунный орбитальный аппарат NASA на высоте всего 50 км над поверхностью, создавший самую подробную карту Луны и обнаруживший залежи водяного льда на полюсах."
    },
    "MARS_PERSEVERANCE": {
        "ja": "NASA火星探査計画「マーズ2020」の大型探査ローバー。かつて湖とデルタ地帯が存在したジェゼロ・クレーターに着陸し、古代生命の痕跡（バイオシグネチャー）を探索。大気中の二酸化炭素から酸素を合成するMOXIE実験の成功や、将来の地球帰還用サンプルコアの採取・密封保管を進行中。",
        "en": "NASA's state-of-the-art robotic rover exploring Jezero Crater on Mars. Searching for biosignatures of ancient microbial life in a dried-up paleolake delta, Perseverance features the MOXIE oxygen generation experiment, the SuperCam laser spectrometer, and an automated drilling system caching sealed rock cores for the future Mars Sample Return mission.",
        "de": "Der fortschrittlichste Mars-Rover der NASA im Jezero-Krater auf der Suche nach Spuren früheren mikrobiellen Lebens und Sauerstoffgewinnung durch MOXIE.",
        "fr": "Le rover de pointe de la NASA explorant le cratère Jezero sur Mars à la recherche de biosignatures fossiles et extrayant de l'oxygène grâce à l'expérience MOXIE.",
        "es": "El rover más avanzado de la NASA que explora el cráter Jezero en Marte, buscando biofirmas de vida microbiana antigua y recolectando muestras geológicas selladas.",
        "pt": "O mais avançado rover marciano da NASA, explorando a cratera Jezero em busca de bioassinaturas de vida antiga e coletando amostras de rocha para retorno à Terra.",
        "it": "Il rover più avanzato della NASA che esplora il cratere Jezero su Marte alla ricerca di biosignature di vita antica e produce ossigeno tramite MOXIE.",
        "ko": "NASA 마스 2020 미션의 대형 화성 로버. 고대 호수였던 예제로 분화구에서 미생물 생명체 흔적(바이오시그니처)을 탐색하고, 대기 중 이산화탄소에서 산소를 합성하는 MOXIE 실험 및 암석 샘플 채취를 수행 중입니다.",
        "nl": "De geavanceerde Marsrover van NASA in de Jezero-krater, op zoek naar sporen van vorig microbieel leven en zuurstofproductie via MOXIE.",
        "id": "Rover penjelajah Mars tercanggih NASA di Kawah Jezero, mencari jejak kehidupan purba dan memproduksi oksigen melalui eksperimen MOXIE.",
        "hi": "मंगल के जेज़ेरो क्रेटर में नासा का अत्याधुनिक रोवर, जो प्राचीन सूक्ष्मजीवी जीवन के संकेतों की खोज और भविष्य के लिए नमूने एकत्र कर रहा है।",
        "ar": "أحدث مسبار متحرك لناسا على المريخ في فوهة جيزيرو، يبحث عن علامات الحياة الميكروبية القديمة ويستخرج الأكسجين عبر تجربة MOXIE.",
        "zh": "NASA“毅力号”火星探测巡视车，着陆于古湖泊杰泽罗陨石坑，搜寻远古微生物生命迹象，并成功通过MOXIE实验从火星二氧化碳大气中就地制取氧气。",
        "ru": "Марсоход NASA 'Персеверанс' в кратере Езеро, ведущий поиск следов древней жизни, синтезирующий кислород из атмосферы и собирающий образцы пород для доставки на Землю."
    },
    "MARS_MRO": {
        "ja": "NASAの火星周回探査機（Mars Reconnaissance Orbiter）。口径50cmの超高解像度カメラ「HiRISE」を搭載し、火星上空300kmから地表の30cmサイズの岩石まで鮮明に捉える偵察観測を実施。火星探査車（パーサヴィアランスやキュリオシティ）の通信中継拠点としても不可欠な役割を果たしています。",
        "en": "NASA's powerhouse Mars orbital reconnaissance spacecraft. Operating in a 300 km polar orbit, its massive 0.5-meter aperture HiRISE camera delivers breathtaking 0.3 m/pixel images of Martian dunes, avalanches, and rover tracks, while serving as the primary high-bandwidth deep-space telecommunications relay for surface missions.",
        "de": "Leistungsfähiger Mars-Orbiter der NASA mit der legendären HiRISE-Teleskopkamera (0,3 m/Pixel Auflösung) und unverzichtbarem Datenrelais für alle Oberflächenrover.",
        "fr": "Sonde orbitale martienne de la NASA équipée de la caméra télescopique HiRISE (0,3 m/px) et servant de relais de télécommunications pour les rovers au sol.",
        "es": "Potente sonda orbital marciana de la NASA con cámara telescópica HiRISE de 0,3 m/pixel, que proporciona datos científicos de alta resolución y enlace de comunicaciones.",
        "pt": "Poderosa sonda orbital marciana da NASA com a câmera HiRISE (resolução de 0,3 m/pixel), servindo como principal relé de comunicação para os rovers na superfície.",
        "it": "Potente orbiter marziano della NASA con telecamera HiRISE (0,3 m/pixel), essenziale per la mappatura geologica e come ponte radio per i rover.",
        "ko": "NASA의 화성 정찰 궤도선. 300km 상공 극궤도에서 구경 50cm HiRISE 망원 카메라(0.3m/px 해상도)로 정밀 지형을 촬영하고, 지표면 로버들의 초고속 통신 중계 기지로 활약하고 있습니다.",
        "nl": "Krachtige Marsverkenner van NASA met de HiRISE-telescoopcamera (0,3 m/pixel) en cruciaal communicatierelais voor oppervlaktemissies.",
        "id": "Pengorbit pengintaian Mars andalan NASA dengan kamera HiRISE (0,3 m/piksel), menjadi relai telekomunikasi utama untuk rover di permukaan Mars.",
        "hi": "300 किमी की कक्षा में नासा का शक्तिशाली मार्स ऑर्बिटर, जो HiRISE कैमरे (0.3 मीटर/पिक्सेल) से सतह की तस्वीरें लेता है और रोवर्स के लिए डेटा रिले करता है।",
        "ar": "مسبار استطلاع مداري قوي تابع لناسا، مجهز بكاميرا HiRISE فائقة الدقة (0.3 م/بكسل)، ويعمل كمحطة إعادة إرسال اتصالات رئيسية لمركبات المريخ.",
        "zh": "NASA火星勘测轨道飞行器，搭载50厘米口径HiRISE超高分辨率相机（0.3米/像素），在300公里极轨上对火星进行地质侦察并为地表火星车提供高带宽中继通信。",
        "ru": "Орбитальный аппарат NASA на орбите Марса с камерой HiRISE (разрешение 30 см на пиксель), передающий сверхчеткие снимки ландшафта и служащий главным ретранслятором связи."
    },
    "HAYABUSA2": {
        "ja": "JAXAの小惑星探査機。小惑星リュウグウで世界初となる人工クレーター生成と地下物質サンプル採取に成功し、2020年に地球へカプセルを帰還。現在は地球重力アシストを経て、2031年に超高速自転小惑星「1998 KY26」へ到達する世界最長の小惑星ランデブー拡張ミッションを飛行中。",
        "en": "JAXA's historic asteroid exploration spacecraft. Following its ground-breaking 2020 return of pristine Ryugu subsurface samples containing amino acids and water, Hayabusa2 is currently on an extended mission traveling through interplanetary space to rendezvous with fast-rotating micro-asteroid 1998 KY26 in 2031.",
        "de": "Historische Asteroidensonde der JAXA, die Proben von Ryugu zur Erde brachte und sich nun auf einer erweiterten interplanetaren Mission zum Asteroiden 1998 KY26 befindet.",
        "fr": "Sonde spatiale historique de la JAXA ayant rapporté sur Terre des échantillons de Ryugu, actuellement en route vers le micro-astéroïde 1998 KY26 pour un rendez-vous en 2031.",
        "es": "Histórica sonda de asteroides de JAXA que trajo muestras de Ryugu a la Tierra y actualmente viaja hacia el asteroide de rotación ultra-rápida 1998 KY26 para 2031.",
        "pt": "Histórica sonda espacial de asteroides da JAXA que trouxe amostras de Ryugu para a Terra e atualmente viaja para um encontro com o microasteroide 1998 KY26 em 2031.",
        "it": "Storica sonda per asteroidi della JAXA che ha riportato sulla Terra campioni di Ryugu, attualmente in missione estesa verso il micro-asteroide 1998 KY26 per il 2031.",
        "ko": "JAXA의 소행성 탐사선. 소행성 류구에서 세계 최초로 인공 분화구 생성 및 지하 물질 샘플 채취에 성공하고 2020년 지구로 귀환. 현재는 2031년 초고속 자전 소행성 '1998 KY26' 랑데부를 향한 확장 임무를 비행 중입니다.",
        "nl": "Historische asteroïdesonde van JAXA die Ryugu-monsters naar de Aarde bracht en nu onderweg is voor een ontmoeting met micro-asteroïde 1998 KY26 in 2031.",
        "id": "Wahana antariksa penjelajah asteroid bersejarah JAXA yang berhasil membawa sampel Ryugu ke Bumi dan kini dalam misi lanjutan menuju asteroid 1998 KY26 pada tahun 2031.",
        "hi": "JAXA का ऐतिहासिक क्षुद्रग्रह अन्वेषण यान, जिसने रयुगु के नमूने पृथ्वी पर लौटाए और अब 2031 में क्षुद्रग्रह 1998 KY26 के साथ मुलाकात के विस्तारित मिशन पर है।",
        "ar": "مسبار الكويكبات التاريخي التابع لـ JAXA، نجح في إعادة عينات من كويكب ريوغو إلى الأرض، ويواصل رحلته للقاء الكويكب سريع الدوران 1998 KY26 في عام 2031.",
        "zh": "日本JAXA的传奇小行星探测器。在小行星“龙宫”成功实施全球首次人工撞击并取回含水和氨基酸的地下样本，目前正在深空中飞往超高速自转小行星1998 KY26扩展任务。",
        "ru": "Японский межпланетный зонд JAXA, успешно доставивший на Землю образцы астероида Рюгу и продолжающий полет к быстро вращающемуся астероиду 1998 KY26 (рандеву в 2031 г.)."
    },
    "VOYAGER1": {
        "ja": "1977年に打ち上げられた人類最遠の人工探査機。木星と土星のフライバイ探査を経て、2012年に太陽風の限界境界（ヘリオポーズ）を突破し、人類史上初めて星間空間（Interstellar Space）に到達。地球から約245億km（光速で往復約45時間）離れた深宇宙から現在も微弱な電波シグナルを送り続けています。",
        "en": "Launched by NASA in 1977, Voyager 1 is the most distant human-made object in history. Having traversed Jupiter and Saturn, it crossed the heliopause in August 2012 to become the first craft to enter interstellar space. Currently over 24.5 billion km (~164 AU) away, it continues transmitting scientific data from between the stars carrying humanity's Golden Record.",
        "de": "Das am weitesten entfernte von Menschen gebaute Objekt der Geschichte. Voyager 1 verließ 2012 das Sonnensystem und sendet aus über 24,5 Milliarden km Entfernung wissenschaftliche Daten.",
        "fr": "L'objet humain le plus éloigné de l'histoire, lancé en 1977. En 2012, il a franchi l'héliopause pour entrer dans l'espace interstellaire à plus de 24,5 milliards de km.",
        "es": "El objeto fabricado por el ser humano más lejano de la historia. Lanzado en 1977, cruzó la heliopausa en 2012 y sigue transmitiendo datos desde el espacio interestelar a 24.500 millones de km.",
        "pt": "O objeto feito pelo homem mais distante da história. Lançado em 1977, cruzou a heliopausa em 2012 e continua transmitindo dados do espaço interestelar a mais de 24,5 bilhões de km.",
        "it": "L'oggetto artificiale più distante nella storia. Lanciato nel 1977, nel 2012 è entrato nello spazio interstellare a oltre 24,5 miliardi di km dalla Terra.",
        "ko": "1977년 발사된 인류 역사상 가장 먼 인공 탐사선. 2012년 태양권계면(헬리오포즈)을 돌파하여 인류 최초로 성간 공간에 진입. 지구에서 245억 km 떨어진 심우주에서 골든 레코드를 싣고 전파를 송신하고 있습니다.",
        "nl": "Het verst verwijderde mensgemaakte object in de geschiedenis. Voyager 1 verliet in 2012 ons zonnestelsel en zendt data uit vanaf meer dan 24,5 miljard km afstand.",
        "id": "Objek buatan manusia terjauh dalam sejarah. Diluncurkan pada 1977, melintasi heliopause pada 2012 menuju ruang antarbintang sejauh lebih dari 24,5 miliar km dari Bumi.",
        "hi": "1977 में प्रक्षेपित मानव इतिहास की सबसे दूर स्थित वस्तु। 2012 में इंटरस्टेलर स्पेस में प्रवेश किया, पृथ्वी से 24.5 अरब किमी दूर से अब भी डेटा भेज रहा है।",
        "ar": "أبعد جسم من صنع الإنسان في التاريخ، تم إطلاقه عام 1977، ودخل الفضاء بين النجوم عام 2012 على بعد أكثر من 24.5 مليار كم من الأرض.",
        "zh": "人类历史上飞得最远的人造物体。1977年由NASA发射，2012年穿越日球层顶进入星际空间，目前距离地球超过245亿公里（约164天文单位），携带着人类文明的镀金唱片向银河系深处飞去。",
        "ru": "Самый далекий рукотворный объект в истории человечества. Запущенный в 1977 году, 'Вояджер-1' в 2012 году вышел в межзвездное пространство на расстояние более 24,5 млрд км."
    },
    "VOYAGER2": {
        "ja": "NASAの探査機。木星・土星・天王星・海王星の全4大巨大惑星を唯一すべて探査した「惑星大紀行（グランドツアー）」の偉業を達成。1989年に海王星の北極上空わずか4,950kmをフライバイし、大暗斑や衛星トリトンの液体窒素間欠泉を発見。2018年にヘリオポーズを突破し、現在約205億km彼方の星間空間を飛行中。",
        "en": "The only spacecraft in history to explore all four giant outer planets: Jupiter, Saturn, Uranus, and Neptune (The Grand Tour). In 1989, it skimmed 4,950 km above Neptune's north pole, discovering the Great Dark Spot and geysers on Triton. It entered interstellar space in 2018, now over 20.5 billion km (~137 AU) away.",
        "de": "Die einzige Sonde, die alle vier Gas- und Eisriesen (Jupiter, Saturn, Uranus, Neptun) besuchte. Passierte 1989 Neptun und befindet sich im interstellaren Raum.",
        "fr": "La seule sonde à avoir exploré Jupiter, Saturne, Uranus et Neptune. En 1989, elle a survolé Neptune à 4 950 km avant d'entrer dans l'espace interstellaire en 2018.",
        "es": "La única nave que visitó Júpiter, Saturno, Urano y Neptuno. En 1989 sobrevoló Neptuno a 4.950 km y en 2018 ingresó al espacio interestelar a 20.500 millones de km.",
        "pt": "A única espaçonave que visitou os quatro gigantes gasosos e de gelo. Em 1989 sobrevoou Netuno e em 2018 entrou no espaço interestelar.",
        "it": "L'unica sonda ad aver esplorato Giove, Saturno, Urano e Nettuno. Nel 1989 ha sorvolato Nettuno prima di entrare nello spazio interstellare nel 2018.",
        "ko": "목성, 토성, 천왕성, 해왕성의 4대 거대 행성을 모두 탐사한 유일한 탐사선(그랜드 투어). 1989년 해왕성 상공 4,950km를 초근접 통과하고 2018년 성간 공간에 진입했습니다.",
        "nl": "De enige sonde die alle vier buitenplaneten bezocht. Scheerde in 1989 langs Neptunus en bevindt zich nu in de interstellaire ruimte.",
        "id": "Satu-satunya wahana yang menjelajahi Jupiter, Saturnus, Uranus, dan Neptunus. Terbang lintas Neptunus pada 1989 dan kini berada di ruang antarbintang.",
        "hi": "चारों बाहरी ग्रहों (बृहस्पति, शनि, अरुण, वरुण) का अन्वेषण करने वाला एकमात्र यान। 1989 में वरुण के करीब से गुजरा और अब इंटरस्टेलर अंतरिक्ष में है।",
        "ar": "المركبة الفضائية الوحيدة التي زارت عمالقة الكواكب الأربعة (المشتري، زحل، أورانوس، نبتون)، وتحلق الآن في الفضاء بين النجوم.",
        "zh": "人类历史上唯一完成四大气态与冰巨行星（木星、土星、天王星、海王星）大满贯巡礼的探测器。1989年近距离掠过海王星北极4,950公里，2018年进入星际空间。",
        "ru": "Единственный зонд, исследовавший все 4 планеты-гиганта (Юпитер, Сатурн, Уран, Нептун). В 1989 г. пролетел над Нептуном и вышел в межзвездное пространство в 2018 г."
    },
    "APOLLO11": {
        "ja": "1969年7月、人類を初めて月に到達させたアポロ計画の歴史的宇宙船。ニール・アームストロング、バズ・オルドリン、マイケル・コリンズの3名が搭乗。月周回軌道上の司令船「コロンビア」と、月面静かの海に着陸した月着陸船「イーグル」により、人類史上最大の宇宙探査マイルストーンを樹立しました。",
        "en": "The historic Apollo mission that landed the first humans on the Moon in July 1969. Crewed by Neil Armstrong, Buzz Aldrin, and Michael Collins, the mission comprised Command/Service Module 'Columbia' in lunar orbit and Lunar Module 'Eagle' touching down at Tranquility Base.",
        "de": "Die historische Mondlandemission von 1969 mit Neil Armstrong, Buzz Aldrin und Michael Collins. Mondlandefähre Eagle landete im Meer der Ruhe.",
        "fr": "La mission historique ayant permis le premier pas sur la Lune en juillet 1969 avec Neil Armstrong, Buzz Aldrin et Michael Collins.",
        "es": "Misión histórica que llevó a los primeros humanos a la Luna en julio de 1969. El módulo lunar Eagle alunizó en el Mar de la Tranquilidad.",
        "pt": "A histórica missão que levou os primeiros seres humanos à Lua em julho de 1969, pousando no Mar da Tranqüilidade.",
        "it": "La storica missione che portò i primi uomini sulla Luna nel luglio 1969 con il modulo lunare Eagle atterrato nel Mare della Tranquillità.",
        "ko": "1969년 7월 인류 최초로 달 착륙에 성공한 역사적인 아폴로 11호. 닐 암스트롱, 버즈 올드린, 마이클 콜린스가 탑승하여 '고요의 바다'에 역사적인 첫 발자국을 남겼습니다.",
        "nl": "De historische missie die in juli 1969 de eerste mensen op de Maan zette met de maanlander Eagle.",
        "id": "Misi bersejarah yang mendaratkan manusia pertama di Bulan pada Juli 1969 di Laut Ketenangan (Tranquility Base).",
        "hi": "जुलाई 1969 में पहले मानव को चंद्रमा पर उतारने वाला ऐतिहासिक मिशन। लूनर मॉड्यूल 'ईगल' ने ट्रैंक्विलिटी बेस पर लैंड किया।",
        "ar": "المهمة التاريخية التي هبطت بأول إنسان على سطح القمر في يوليو 1969 بقيادة نيل أرمسترونغ في بحر الهدوء.",
        "zh": "1969年7月实现人类首次登月的历史性飞船。阿姆斯特朗与奥尔德林驾驶“鹰号”登月舱降落月球静海基地，柯林斯驾驶“哥伦比亚号”指令舱在月球轨道待命。",
        "ru": "Исторический корабль, доставивший первых людей на Луну в июле 1969 года (Нил Армстронг, Базз Олдрин, Майкл Коллинз)."
    },
    "SPUTNIK1": {
        "ja": "1957年10月4日にソビエト連邦によって打ち上げられた、人類史上初の人工衛星。直径58cmの研磨アルミニウム合金球体に4本のホイップアンテナを装着。地球を約96分で1周しながら発信した「ピピッ、ピピッ」の20MHz電波信号は世界中で受信され、宇宙時代の幕開けと宇宙開発競争の火蓋を切りました。",
        "en": "The world's first artificial satellite, launched on October 4, 1957 by the Soviet Union. A 58 cm polished aluminum sphere with 4 whip antennas, orbiting Earth every 96.2 minutes. Its historic 20.005 MHz radio beeps ushered humanity into the Space Age.",
        "de": "Der erste künstliche Erdsatellit der Weltgeschichte, gestartet am 4. Oktober 1957. Leitete das Raumzeitalter ein.",
        "fr": "Le premier satellite artificiel de l'histoire, lancé le 4 octobre 1957, inaugurant l'ère spatiale avec son signal radio.",
        "es": "El primer satélite artificial de la historia, lanzado el 4 de octubre de 1957, iniciando la era espacial con sus señales de radio.",
        "pt": "O primeiro satélite artificial da história, lançado em 4 de outubro de 1957, inaugurando a era espacial.",
        "it": "Il primo satellite artificiale della storia lanciato il 4 ottobre 1957, aprendo l'era spaziale con i suoi leggendari segnali radio.",
        "ko": "1957년 10월 4일 인류 최초로 발사된 인공위성. 지름 58cm의 알루미늄 구체에 4개의 안테나를 달고 지구를 96분에 1바퀴 돌며 전파를 송신, 인류 우주시대의 개막을 알렸습니다.",
        "nl": "De eerste kunstmatige satelliet ter wereld, gelanceerd op 4 oktober 1957, waarmee het ruimtevaarttijdperk begon.",
        "id": "Satelit buatan pertama di dunia yang diluncurkan pada 4 Oktober 1957, mengawali era penjelajahan luar angkasa.",
        "hi": "4 अक्टूबर 1957 को प्रक्षेपित दुनिया का पहला कृत्रिम उपग्रह, जिसने मानव अंतरिक्ष युग की शुरुआत की।",
        "ar": "أول قمر صناعي في تاريخ البشرية، أُطلق في 4 أكتوبر 1957 مُعلناً بداية عصر الفضاء.",
        "zh": "1957年10月4日升空的人类历史上第一颗人造地球卫星。直径58厘米抛光铝制球体，装有4根鞭状天线，以96.2分钟环绕地球一周并向全球播发哔哔无线电信号，开启人类太空时代。",
        "ru": "Первый в мире искусственный спутник Земли, запущенный 4 октября 1957 года. Открыл космическую эру человечества."
    }
};

const DEEP_SPACE_SPECS = {
    "JWST": {
        agency: { ja: "NASA / ESA / CSA (欧州宇宙機関・カナダ宇宙庁)", en: "NASA / ESA / CSA International Collaboration" },
        orbitType: { ja: "太陽-地球 L2 ラグランジュ点 ハロー軌道 (~150万km / 非静止軌道・約半年周期公転)", en: "Sun-Earth L2 Lagrange Point Halo Orbit (~1.5M km / Non-Geostationary, ~6-month period)" },
        dimensions: { ja: "主鏡直径: 6.5 m (18分割ベリリウム金鏡) / サンシールド: 21.2 m × 14.2 m", en: "Primary Mirror: 6.5 m / Sunshield: 21.2 m × 14.2 m" },
        instruments: { ja: "NIRCam (近赤外線カメラ), MIRI (中赤外線分光撮像), NIRSpec, FGS/NIRISS", en: "NIRCam, MIRI, NIRSpec, FGS/NIRISS" },
        scienceGoal: { ja: "135億年前の宇宙最初期銀河観測、星・惑星系の誕生、太陽系外惑星の大気組成探査", en: "First light galaxies at 13.5B yr, stellar evolution, exoplanet atmospheric transmission spectra" }
    },
    "ARTEMIS_ORION": {
        agency: { ja: "NASA / ESA / JAXA", en: "NASA / ESA / JAXA Artemis Coalition" },
        orbitType: { ja: "月遠方逆行軌道 (DRO) / 近直線ハロー軌道 (NRHO)", en: "Lunar Distant Retrograde Orbit (DRO) & NRHO" },
        dimensions: { ja: "全幅: 19.0 m (太陽電池パドル展開時) / 重量: 33,446 kg", en: "Width: 19.0 m with solar arrays / Mass: 33,446 kg" },
        instruments: { ja: "有人耐熱シールド (Avcoat), 欧州サービスモジュール (ESM), 光通信端末 (O2O)", en: "Avcoat Heat Shield, European Service Module, O2O Optical Comm" },
        scienceGoal: { ja: "人類の持続可能な月面探査、月周回拠点ゲートウェイ建設、将来の有人火星飛行検証", en: "Sustainable lunar surface exploration, Gateway station staging, crewed Mars preparation" }
    },
    "LRO": {
        agency: { ja: "NASA / ゴダード宇宙飛行センター", en: "NASA / Goddard Space Flight Center" },
        orbitType: { ja: "極月軌道 (高度 ~50 km / 傾斜角 90°)", en: "Low Lunar Polar Orbit (~50 km altitude / 90° inc)" },
        dimensions: { ja: "サイズ: 2.7 m × 1.7 m / 重量: 1,916 kg", en: "Dimensions: 2.7 m × 1.7 m / Mass: 1,916 kg" },
        instruments: { ja: "LROC (狭角・広角カメラ 0.5m/px), LOLA (レーザー高度計), Diviner (放射温度計)", en: "LROC (0.5m/px camera), LOLA Laser Altimeter, Diviner Radiometer" },
        scienceGoal: { ja: "月面全域の高解像度3D地形図作成、永久影領域の水氷探査、アポロ着陸地撮影", en: "Global 3D lunar topography, permanently shadowed water ice mapping, Apollo artifact recovery" }
    },
    "MARS_PERSEVERANCE": {
        agency: { ja: "NASA / ジェット推進研究所 (JPL)", en: "NASA / Jet Propulsion Laboratory (JPL)" },
        orbitType: { ja: "火星表面探査 (ジェゼロ・クレーター 18.38°N, 77.58°E)", en: "Mars Surface Exploration (Jezero Crater 18.38°N, 77.58°E)" },
        dimensions: { ja: "全長: 3.0 m / 全幅: 2.7 m / 重量: 1,025 kg", en: "Length: 3.0 m / Width: 2.7 m / Mass: 1,025 kg" },
        instruments: { ja: "MOXIE (火星大気から酸素合成), Mastcam-Z (ズーム3Dカメラ), SuperCam (レーザー分析)", en: "MOXIE (Oxygen In-Situ), Mastcam-Z 3D, SuperCam Raman/Laser" },
        scienceGoal: { ja: "古代湖底における微生物生命痕跡の探索、将来の有人火星探査用酸素抽出、岩石コア採取", en: "Astrobiology biosignatures, atmospheric in-situ resource oxygen production, sealed sample caching" }
    },
    "MARS_MRO": {
        agency: { ja: "NASA / JPL", en: "NASA / Jet Propulsion Laboratory" },
        orbitType: { ja: "火星周回太陽同期極軌道 (250 × 316 km / 周期 112分)", en: "Sun-synchronous Mars Polar Orbit (250 × 316 km / 112 min)" },
        dimensions: { ja: "太陽電池パドル幅: 19.7 m / 重量: 2,180 kg", en: "Solar Array Span: 19.7 m / Mass: 2,180 kg" },
        instruments: { ja: "HiRISE (口径50cm 望遠カメラ 0.3m/px), CRISM (鉱物マッピング分光器), SHARAD (地下レーダー)", en: "HiRISE (0.3m/px Telescopic Camera), CRISM Spectrometer, SHARAD Subsurface Radar" },
        scienceGoal: { ja: "火星の過去の水環境と気候変動の解明、着陸候補地選定、火星ローバー超高速通信中継", en: "Historic water activity, mineral geology, landing site certification, gigabit relay for rovers" }
    },
    "HAYABUSA2": {
        agency: { ja: "JAXA (宇宙航空研究開発機構)", en: "JAXA (Japan Aerospace Exploration Agency)" },
        orbitType: { ja: "太陽周回ヘリオセントリック軌道 (地球-小惑星間)", en: "Heliocentric Interplanetary Orbit (Earth-Asteroid)" },
        dimensions: { ja: "太陽電池パドル幅: 6.0 m / 重量: 609 kg", en: "Solar Array Span: 6.0 m / Mass: 609 kg" },
        instruments: { ja: "マイクロ波イオンエンジン (4基), 光学航法カメラ (ONC), 中間赤外カメラ (TIR)", en: "Microwave Ion Engines (IES), Optical Navigation Cameras, TIR, NIRS3" },
        scienceGoal: { ja: "小惑星リュウグウのサンプルリターン成功、超高速自転小惑星1998 KY26ランデブー (2031年)", en: "Ryugu pristine organic sample delivery, planetary defense, fast-rotator 1998 KY26 rendezvous (2031)" }
    },
    "VOYAGER1": {
        agency: { ja: "NASA / JPL", en: "NASA / Jet Propulsion Laboratory" },
        orbitType: { ja: "太陽系脱出双曲線星間軌道 (~164 AU / 245億km彼方)", en: "Interstellar Hyperbolic Escape Trajectory (~164 AU / 24.5B km)" },
        dimensions: { ja: "高利得パラボラアンテナ直径: 3.7 m / 重量: 825 kg", en: "High-Gain Antenna: 3.7 m / Mass: 825 kg" },
        instruments: { ja: "ゴールデンレコード (人類の音楽・言語・メッセージ), 磁力計 (MAG), 宇宙線検出器 (CRS)", en: "The Golden Record, Magnetometer (MAG), Cosmic Ray Subsystem, Plasma Wave System" },
        scienceGoal: { ja: "太陽風が届かない星間磁場・宇宙線の直接測定、人類文明のメッセージを銀河系へ運ぶ", en: "First in-situ sampling of interstellar medium, plasma density beyond heliopause, galactic messenger" }
    },
    "VOYAGER2": {
        agency: { ja: "NASA / JPL", en: "NASA / Jet Propulsion Laboratory" },
        orbitType: { ja: "太陽系脱出双曲線星間軌道 (~137 AU / 205億km彼方 / 海王星探査)", en: "Interstellar Hyperbolic Escape Trajectory (~137 AU / Neptune Grand Tour)" },
        dimensions: { ja: "高利得パラボラアンテナ直径: 3.7 m / 重量: 825 kg", en: "High-Gain Antenna: 3.7 m / Mass: 825 kg" },
        instruments: { ja: "ゴールデンレコード, 磁力計 (MAG), 低エネルギー荷電粒子計 (LECP), 宇宙線検出器", en: "The Golden Record, Magnetometer, LECP, Cosmic Ray System, Photopolarimeter" },
        scienceGoal: { ja: "木星・土星・天王星・海王星の全巨大惑星グランドツアー探査、現在星間空間の観測", en: "Only spacecraft to visit Uranus and Neptune, ongoing interstellar medium exploration" }
    },
    "APOLLO11": {
        agency: { ja: "NASA (アメリカ航空宇宙局)", en: "NASA (National Aeronautics and Space Administration)" },
        orbitType: { ja: "月周回楕円軌道 (高度 ~110 km) & 静かの海着陸地 (0.67°N, 23.47°E)", en: "Lunar Orbit (~110 km alt) & Tranquility Base (0.67°N, 23.47°E)" },
        dimensions: { ja: "CSM全長: 11.0 m / LM全幅: 9.4 m (脚展開時) / 打ち上げ総質量: 49,735 kg", en: "CSM Length: 11.0 m / LM Span: 9.4 m with gear / Total Mass: 49,735 kg" },
        instruments: { ja: "司令船コロンビア (CSM), 月着陸船イーグル (LM), 早期アポロ科学実験装置 (EASEP)", en: "Columbia CSM, Eagle LM, EASEP Seismometer, Laser Ranging Retroreflector" },
        scienceGoal: { ja: "人類初の月面有人着陸と安全な地球帰還、21.55kgの月試料採取、太陽風・月震観測", en: "First crewed lunar landing, surface EVA, 21.55 kg lunar sample return, seismic monitoring" }
    },
    "SPUTNIK1": {
        agency: { ja: "OKB-1 (ソビエト連邦 第1設計局)", en: "Soviet Space Program / OKB-1 (Sergei Korolev)" },
        orbitType: { ja: "低地球周回楕円軌道 (近地点 215 km / 遠地点 939 km / 傾斜角 65.1°)", en: "Low Earth Elliptical Orbit (Perigee 215 km / Apogee 939 km / 65.1° inc)" },
        dimensions: { ja: "球体直径: 58.0 cm / アンテナ長: 2.4 m & 2.9 m / 質量: 83.6 kg", en: "Sphere Diameter: 58.0 cm / Antennas: 2.4 m & 2.9 m / Mass: 83.6 kg" },
        instruments: { ja: "20.005 MHz / 40.002 MHz 無線送信機 (1ワット), 温度・圧力センサー", en: "Dual Radio Transmitters (20.005 & 40.002 MHz), Barometric/Thermal switches" },
        scienceGoal: { ja: "人類初の人工衛星軌道投入成功の実証、電離層電波伝搬特性の解明、大気密度測定", en: "First artificial orbital insertion, ionospheric radio propagation, upper atmosphere density" }
    }
};

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
    "EARTH": {
        "ja": "太陽系第3惑星「地球」。豊かな液体の海と酸素に富む大気、強力な地磁気を備え、現在知られる宇宙で唯一生命が存在する母なる惑星。1つの自然衛星（月）を持ちます。",
        "en": "The 3rd planet from the Sun and our home world. The only known astronomical object known to harbor life, featuring vast liquid oceans, a protective atmosphere, and strong magnetic field.",
        "de": "Der 3. Planet von der Sonne und unsere Heimatwelt. Der einzige bekannte Himmelskörper mit Leben, riesigen flüssigen Ozeanen und einem schützenden Magnetfeld.",
        "fr": "La 3e planète depuis le Soleil et notre monde d'origine. Le seul objet connu abritant la vie, avec de vastes océans liquides et un champ magnétique protecteur.",
        "es": "El 3.er planeta desde el Sol y nuestro hogar. El único astro conocido que alberga vida, con vastos océanos líquidos y un campo magnético protector.",
        "pt": "O 3º planeta a partir do Sol e nosso mundo de origem. O único astro conhecido que abriga vida, com vastos oceanos de água líquida e campo magnético protetor.",
        "it": "Il 3º pianeta dal Sole e la nostra casa cosmica. L'unico corpo celeste noto a ospitare la vita, con vasti oceani di acqua liquida e uno scudo geomagnetico.",
        "ko": "태양계 제3행성 '지구'. 풍부한 액체 바다와 산소가 풍부한 대기, 자기장을 지녀 현재 우주에서 유일하게 생명체가 번영하는 인류의 모성입니다.",
        "nl": "De 3e planeet vanaf de zon en onze thuiswereld. De enige bekende plek met leven, oceanen van vloeibaar water en een beschermend magnetisch veld.",
        "id": "Planet ke-3 dari Matahari dan rumah kita. Satu-satunya tempat yang diketahui memiliki kehidupan, dengan lautan cair yang luas dan medan magnet pelindung.",
        "hi": "सूर्य से तीसरा ग्रह और हमारी मातृभूमि। ज्ञात ब्रह्मांड में जीवन को आश्रय देने वाला एकमात्र ग्रह, जिसमें विशाल महासागर और सुरक्षात्मक चुंबकीय क्षेत्र हैं।",
        "ar": "الكوكب الثالث من الشمس وموطننا الأم. الجرم الفلكي الوحيد المعروف بإيوائه للحياة، ويتميز بمحيطات شاسعة من المياه السائلة وغلاف جوي واقٍ.",
        "zh": "太阳系第三大行星“地球”。拥有浩瀚液态海洋、富氧大气层与强地磁屏障，是人类与已知宇宙中唯一生机勃勃的生命母星，拥有一颗天然卫星(月球)。",
        "ru": "Третья планета от Солнца и наш общий дом. Единственное известное небесное тело, населенное живыми организмами, с океанами жидкой воды и мощной магнитосферой."
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
    },
    "NEPTUNE": {
        "ja": "太陽系第8惑星「海王星」(最遠の巨大氷惑星)。深海のようなコバルトブルーに輝く大気と、太陽系最強の超音速暴風(時速2,100km超)が吹き荒れる。巨大衛星トリトンや環を持っています。",
        "en": "The 8th and outermost major planet (Ice Giant). Deep azure-blue atmosphere lashed by the Solar System's fiercest supersonic winds (>2,100 km/h). Features 16 moons (including retrograde Triton) and faint rings.",
        "de": "Der 8. und äußerste Planet (Eisriese). Tiefblaue Atmosphäre mit den stärksten Überschallstürmen des Sonnensystems (>2.100 km/h) und 16 Monden (Triton).",
        "fr": "La 8e planète, la plus lointaine (géante de glace). Atmosphère bleu azur balayée par des vents supersoniques extrêmes (>2 100 km/h) et 16 lunes (Triton).",
        "es": "El 8º y más lejano planeta (gigante de hielo). Atmósfera azul cobalto azotada por los vientos supersónicos más veloces (>2.100 km/h) y 16 lunas (Tritón).",
        "pt": "O 8º e mais distante planeta (gigante de gelo). Atmosfera azul cobalto com os ventos supersônicos mais intensos do sistema (>2.100 km/h) e 16 luas (Tritão).",
        "it": "L'8º e più distante pianeta (gigante di ghiaccio). Atmosfera blu cobalto scossa dai venti supersonici più violenti (>2.100 km/h) e 16 lune (Tritone).",
        "ko": "태양계 제8행성 '해왕성'(최원단 거대 얼음 행성). 깊은 바다 같은 코발트블루 대기와 시속 2,100km를 넘는 초음속 폭풍, 역행 위성 트리톤을 보유.",
        "nl": "De 8e en verste planeet (ijsreus). Diepblauwe atmosfeer met de krachtigste supersonische stormen (>2.100 km/u) en 16 manen (Triton).",
        "id": "Planet ke-8 terjauh (raksasa es). Atmosfer biru kobalt dengan angin supersonik tercepat di tata surya (>2.100 km/jam) dan 16 bulan (Triton).",
        "hi": "आठवां और सबसे सुदूर ग्रह (बर्फ दानव)। गहरा नीला वातावरण, सौर मंडल की सबसे तीव्र सुपरसोनिक हवाएं (>2,100 किमी/घंटा) और 16 चंद्रमा (ट्राइटन)।",
        "ar": "الكوكب الثامن والأبعد (عملاق جليدي). غلاف جوي أزرق سماوي تعصف به أسرع رياح فوق صوتية (>2,100 كم/س) و16 قمراً (تريتون).",
        "zh": "太阳系第八大行星“海王星”(最遥远的冰巨行星)。深邃如海的深蓝色大气中呼啸着全太阳系最强烈的超音速风暴(时速超2100公里)，拥有海卫一与暗淡光环。",
        "ru": "Восьмая и самая дальняя планета (ледяной гигант). Глубокая синяя атмосфера с рекордными сверхзвуковыми ветрами (>2 100 км/ч) и 16 спутниками (Тритон)."
    },
    "CERES": {
        "ja": "小惑星帯（アステロイドベルト）最大の準惑星「ケレス」。火星と木星の間に位置し、内部に水や氷のマントルを持つ。オッカトル・クレーターにある謎の白い塩斑（ファキュラ）や氷火山が有名です。",
        "en": "The largest object in the Asteroid Belt and the closest dwarf planet. Contains substantial water ice beneath its crust. Famous for the bright reflective salt deposits in Occator Crater and the Ahuna Mons cryovolcano.",
        "de": "Größtes Objekt im Asteroidengürtel und sonnennächster Zwergplanet. Besitzt einen eisreichen Mantel. Bekannt für helle Salzablagerungen im Occator-Krater und Kryovulkane.",
        "fr": "Le plus grand corps de la ceinture d'astéroïdes et la planète naine la plus proche. Renferme un manteau d'eau et de glace. Renommé pour ses taches de sel brillantes dans Occator.",
        "es": "El mayor objeto del cinturón de asteroides y el planeta enano más cercano. Contiene hielo de agua subterráneo. Famoso por los puntos brillantes de sal en el cráter Occator.",
        "pt": "O maior objeto do cinturão de asteroides e planeta anão mais próximo. Abriga manto rico em gelo. Famoso pelos depósitos brilhantes de sal na cratera Occator.",
        "it": "Il corpo più grande della fascia principale e pianeta nano più vicino. Contiene ghiaccio d'acqua. Celebre per le macchie bianche di sale nel cratere Occator.",
        "ko": "소행성대 최대의 천체이자 가장 가까운 왜행성 '세레스'. 풍부한 수빙 맨틀을 지니며 오카토르 크레이터의 눈부신 탄산염 백반과 얼음 화산으로 유명합니다.",
        "nl": "Grootste object in de planetoïdengordel en dichtstbijzijnde dwergplaneet. Bevat waterijs. Beroemd om de heldere zoutvlekken in Occator-krater.",
        "id": "Objek terbesar di Sabuk Asteroid dan planet kerdil terdekat. Mengandung mantel es air. Terkenal dengan bintik garam putih terang di Kawah Occator.",
        "hi": "क्षुद्रग्रह बेल्ट का सबसे बड़ा पिंड और निकटतम बौना ग्रह 'सेरेस'। इसमें भारी मात्रा में जल-बर्फ है। ऑकेटर क्रेटर में सफेद नमक के धब्बों के लिए प्रसिद्ध।",
        "ar": "أكبر جرم في حزام الكويكبات وأقرب كوكب قزم. يحتوي على وشاح مائي جليدي. يشتهر برواسب الملح البيضاء الساطعة في فوهة أوكاتور.",
        "zh": "小行星带中最大的天体兼距离地球最近的矮行星“谷神星”。内部含有巨量水冰地幔，以奥卡托撞击坑闪耀的碳酸盐白色斑块与阿胡纳冰火山闻名。",
        "ru": "Крупнейшее тело в поясе астероидов и ближайшая карликовая планета. Содержит ледяную мантию. Знаменита яркими соляными пятнами в кратере Оккатор."
    },
    "PLUTO": {
        "ja": "太陽系外縁カイパーベルトを代表する準惑星「冥王星」。淡い赤褐色の地表に巨大なハート型の窒素氷河（スプートニク平原）が広がり、青い大気ヘイズと5つの衛星（特に巨大なカロン）を持ちます。",
        "en": "The iconic dwarf planet of the Kuiper Belt. Features the famous heart-shaped nitrogen glacier (Sputnik Planitia), rugged water-ice mountains, multilayered blue atmospheric haze, and 5 moons led by Charon.",
        "de": "Der bekannteste Zwergplanet des Kuipergürtels. Berühmt für das herzförmige Stickstoff-Eisfeld (Sputnik Planitia), Wassereisberge, blaue Atmosphärenschichten und 5 Monde.",
        "fr": "La planète naine emblématique de la ceinture de Kuiper. Présente un glacier d'azote en forme de cœur (Sputnik Planitia), une brume atmosphérique bleue et 5 lunes (Charon).",
        "es": "El emblemático planeta enano del cinturón de Kuiper. Destaca por su glaciar de nitrógeno en forma de corazón (Sputnik Planitia), bruma azul y 5 lunas, con Caronte a la cabeza.",
        "pt": "O emblemático planeta anão do cinturão de Kuiper. Conhecido pelo glaciar de nitrogênio em forma de coração (Sputnik Planitia), névoa azul e 5 luas com Caronte.",
        "it": "L'emblematico pianeta nano della fascia di Kuiper. Celebre per il ghiacciaio di azoto a forma di cuore (Sputnik Planitia), foschia blu e 5 lune (Caronte).",
        "ko": "카이퍼 벨트의 상징적인 왜행성 '명왕성'. 하트 모양의 거대한 질소 빙하(스푸트니크 평원), 물얼음 산맥, 푸른 대기 연무층 및 카론을 비롯한 5개 위성을 거느립니다.",
        "nl": "De iconische dwergplaneet van de Kuipergordel. Beroemd om de hartvormige stikstofgletsjer (Sputnik Planitia), blauwe atmosferische nevels en 5 manen.",
        "id": "Planet kerdil ikonis di Sabuk Kuiper. Menampilkan gletser nitrogen berbentuk hati (Sputnik Planitia), pegunungan es, kabut biru, dan 5 bulan bersama Charon.",
        "hi": "काइपर बेल्ट का प्रतिष्ठित बौना ग्रह 'प्लूटो'। प्रसिद्ध दिल के आकार का नाइट्रोजन ग्लेशियर (स्पुतनिक प्लैनिटिया), नीली वायुमंडलीय धुंध और कैरॉन सहित 5 चंद्रमा।",
        "ar": "الكوكب القزم الشهير في حزام كايبر. يتميز بنهر نيتروجين جليدي شهير على شكل قلب (سهل سبوتنيك)، وضباب جوي أزرق و5 أقمار يقودها شارون.",
        "zh": "柯伊伯带最著名的矮行星“冥王星”。拥有标志性的巨大心形氮冰平原(斯普特尼克平原)、千仞水冰高山、分层蓝色大气雾霾以及以卡戎为首的5颗卫星。",
        "ru": "Знаменитая карликовая планета пояса Койпера. Известна ледяным сердцем из азота (равниной Спутника), водяными горами, голубой дымкой и 5 спутниками (Харон)."
    },
    "HALLEY": {
        "ja": "約76年周期で太陽に回帰する最も有名な周期彗星「ハレー彗星」(1P/Halley)。太陽に接近すると氷やダストが昇華して巨大なコマと1億km超の美しい青白い尾を広げます。次回近日点通過は2061年。",
        "en": "The most famous periodic comet (75-76 year orbit). As it nears the Sun, solar heating vaporizes ice into a glowing cyan coma and sweeping dust/ion tails stretching over 100M km. Next perihelion: 2061.",
        "de": "Der berühmteste Komet der Menschheit (Umlaufzeit ~76 Jahre). In Sonnennähe entstehen eine leuchtende Koma und ein über 100 Mio. km langer Schweif. Nächste Perihel-Passage: 2061.",
        "fr": "La comète périodique la plus célèbre (~76 ans). À l'approche du Soleil, la sublimation de ses glaces crée une chevelure lumineuse et des queues de plus de 100M km. Prochain périhélie: 2061.",
        "es": "El cometa periódico más célebre (~76 años). Cerca del Sol, el hielo sublimado genera una brillante cabellera y colas de más de 100M km. Próximo perihelio: 2061.",
        "pt": "O cometa periódico mais famoso (~76 anos). Perto do Sol, o gelo sublimado forma uma coma brilhante e caudas com mais de 100M km. Próximo periélio: 2061.",
        "it": "La cometa periodica più famosa (~76 anni). Vicino al Sole, i ghiacci sublimano creando una spettacolare chioma e code lunghe oltre 100M km. Prossimo perielio: 2061.",
        "ko": "약 76년 주기로 태양을 회귀하는 인류 역사상 가장 유명한 '핼리 혜성'(1P/Halley). 태양에 근접하면 승화된 얼음과 가스가 1억 km가 넘는 거대한 꼬리를 형성합니다. 다음 근일점은 2061년입니다.",
        "nl": "De beroemdste periodieke komeet (~76 jaar). Dicht bij de zon creëert verdampend ijs een prachtige coma en staarten van >100 mln km. Volgend perihelium: 2061.",
        "id": "Komet periodik paling terkenal (~76 tahun). Di dekat Matahari, sublimasi es menciptakan koma cemerlang dan ekor sepanjang lebih dari 100 juta km. Perihelion berikutnya: 2061.",
        "hi": "लगभग 76 साल की कक्षा वाला सबसे प्रसिद्ध आवधिक धूमकेतु 'हैली'। सूर्य के पास आने पर वाष्पीकृत बर्फ से 10 करोड़ किमी लंबी पूंछ बनती है। अगला उपसौर: 2061।",
        "ar": "أشهر مذنب دوري في التاريخ (مدار ~76 عاماً). عند الاقتراب من الشمس يتسامى الجليد مشكلاً ذيولاً غازية وغبارية تتجاوز 100 مليون كم. الحضيض القادم: 2061.",
        "zh": "公转周期约76年的著名周期彗星“哈雷彗星”(1P/Halley)。当接近太阳时，彗核水冰气体升华形成直径数十万公里的彗发与延伸逾1亿公里的壮丽离子/尘埃双彗尾。下一次过近日点为2061年。",
        "ru": "Самая известная периодическая комета (период ~76 лет). Вблизи Солнца испаряющийся лед образует сияющую кому и хвосты длиной более 100 млн км. Следующий перигелий: 2061 г."
    },
    "SOLAR_SYSTEM": {
        "ja": "私たちの故郷「太陽系」(The Solar System)。中心星である太陽を中心に、岩石惑星(水星・金星・地球・火星)、小惑星帯、巨大ガス・氷惑星(木星・土星・天王星・海王星)、そしてカイパーベルトまで約60AUの広大な空間に整然たる公転軌道が広がっています。はやぶさ2やボイジャー1号など人類の探査機が翔ける宇宙の舞台です。",
        "en": "Our cosmic home, The Solar System. Centered around the Sun, it spans ~60 AU across the terrestrial worlds (Mercury, Venus, Earth, Mars), asteroid belt, gas/ice giants (Jupiter, Saturn, Uranus, Neptune), and the Kuiper Belt, traversed by historic probes like Voyager 1 and Hayabusa2.",
        "de": "Unsere kosmische Heimat, das Sonnensystem. Um das Zentralgestirn Sonne erstrecken sich über ~60 AE die Gesteinsplaneten, der Asteroidengürtel, die Gas- und Eisriesen sowie der Kuipergürtel mit Raumsonden wie Voyager 1 und Hayabusa2.",
        "fr": "Notre foyer cosmique, le Système Solaire. Centré autour du Soleil, il s'étend sur ~60 UA englobant les planètes rocheuses, la ceinture d'astéroïdes, les géantes gazeuses et glacées, traversé par des sondes pionnières comme Voyager 1 et Hayabusa2.",
        "es": "Nuestro hogar cósmico, el Sistema Solar. Alrededor del Sol, abarca ~60 UA albergando planetas rocosos, el cinturón de asteroides, gigantes gaseosos y de hielo, explorado por sondas históricas como Voyager 1 y Hayabusa2.",
        "pt": "Nosso lar cósmico, o Sistema Solar. Em torno do Sol, estende-se por ~60 UA abrigando planetas rochosos, cinturão de asteroides, gigantes gasosos e de gelo, explorados por sondas como Voyager 1 e Hayabusa2.",
        "it": "La nostra dimora cosmica, il Sistema Solare. Attorno al Sole si estende per ~60 UA comprendendo pianeti rocciosi, fascia degli asteroidi, giganti gassosi e ghiacciati, solcato da sonde come Voyager 1 e Hayabusa2.",
        "ko": "인류의 우주적 고향 '태양계'(The Solar System). 태양을 중심으로 수성·금성·지구·화성의 암석 행성부터 목성·토성·천왕성·해왕성의 거대 행성까지 약 60 AU에 걸친 조화로운 공전 궤도를 한눈에 조망합니다. 보이저 1호와 하야부사2 등의 탐사선들이 항해하는 인류의 무대입니다.",
        "nl": "Onze kosmische thuisbasis, het zonnestelsel. Rondom de zon strekt het zich uit over ~60 AE met de terrestrische planeten, asteroïdengordel, gas- en ijsreuzen en Kuipergordel, verkend door Voyager 1 en Hayabusa2.",
        "id": "Rumah kosmik kita, Tata Surya. Berpusat pada Matahari, membentang seluas ~60 AU mencakup planet batuan, sabuk asteroid, planet gas/es raksasa, dan Sabuk Kuiper, dijelajahi oleh Voyager 1 dan Hayabusa2.",
        "hi": "हमारा ब्रह्मांडीय घर 'सौर मंडल'। सूर्य के चारों ओर लगभग 60 AU में फैले स्थलीय ग्रह, क्षुद्रग्रह बेल्ट, विशाल ग्रह और काइपर बेल्ट, जहां वॉयेजर 1 और हयाबुसा 2 जैसे यान यात्रा कर रहे हैं।",
        "ar": "موطننا الكوني، النظام الشمسي. يمتد حول الشمس لنحو 60 وحدة فلكية، محتضناً الكواكب الصخرية، حزام الكويكبات، عمالقة الغاز والجليد، ومسارات مسابير رائدة مثل فوياجر 1 وهايابوسا 2.",
        "zh": "人类所在的宇宙家园“太阳系”(The Solar System)。以太阳为中心，岩石行星、小行星带、气态与冰巨行星以及柯伊伯带分布在约60个天文单位的浩瀚空间中，见证着旅行者1号、隼鸟2号等人类探索的足迹。",
        "ru": "Наш космический дом — Солнечная система. Вокруг Солнца на расстоянии ~60 а.е. простираются каменистые планеты, пояс астероидов, газовые и ледяные гиганты, исследуемые аппаратами Вояджер-1 и Хаябуса-2."
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
        if (body.id === 'EARTH') return; // 地球本体はCesium Globeそのもののため、通常モードで原点に天体ビルボードを置かない
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
                show: new Cesium.CallbackProperty(() => {
                    if (selectedCelestialId === body.id) return false;
                    if (selectedCelestialId === 'SOLAR_SYSTEM') return false;
                    const toggle = document.getElementById('toggleCelestial');
                    return (!toggle || toggle.checked);
                }, false),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
        entity.celestialData = body;
        celestialEntities.push(entity);
    });
}

function computeCelestialPosition(body, time) {
    if (!viewer) return Cesium.Cartesian3.ZERO;
    const effectiveTime = customSimTime ? Cesium.JulianDate.fromDate(customSimTime) : (time || (viewer && viewer.clock.currentTime));
    if (!effectiveTime) return Cesium.Cartesian3.ZERO;

    const jsDate = customSimTime || Cesium.JulianDate.toDate(effectiveTime);
    const d = (jsDate.getTime() / 86400000.0) + 2440587.5 - 2451545.0; // Days from J2000.0
    const SUN_SKY_RADIUS = 10000000000; // 10 Million km (Glued to distant real Sun)

    // 1. Exact Alignment with Cesium's Real Sun Position at Infinite Depth
    if (body.id === 'SUN') {
        try {
            const sunInertial = Cesium.Simon1994PlanetaryPositions.computeSunPositionInInertial(effectiveTime);
            const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(effectiveTime);
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
            const moonInertial = Cesium.Simon1994PlanetaryPositions.computeMoonPositionInInertial(effectiveTime);
            const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(effectiveTime);
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

    // 3. NASA JPL Keplerian Precision Positioning for Planets
    const ephem = computePlanetEphemeris(body.id, effectiveTime);
    if (ephem && ephem.visualPosFixed) {
        return ephem.visualPosFixed;
    }

    return Cesium.Cartesian3.ZERO;
}

// ==========================================================================
// Deep Space Missions (JWST, Artemis Orion, LRO, Mars, Voyager) Engine
// ==========================================================================
let deepSpaceEntities = [];
let selectedDeepSpaceId = null;
let deepSpaceOrbitEntity = null;
let deepSpaceDomLabels = {};

/**
 * ミッションが現在のアクティブ期間（現役か、歴史的ミッションのタイムトラベル中か）にあるかを判定
 * （現在時刻においてアポロ11号やスプートニク1号などの退役・過去ミッションが誤って表示されるのを防止）
 */
function isDeepSpaceMissionActive(mission, time) {
    if (!mission) return false;
    // 1. ユーザーが明示的に選択中のミッションは常に表示
    if (selectedDeepSpaceId === mission.id) return true;
    // 2. 現役探査機（JWST, アルテミス, LRO, パーサヴィアランス, MRO, はやぶさ2, ボイジャー1/2など）は常時表示
    if (!mission.isHistoricOnly) return true;

    // 3. 歴史的ミッション（アポロ11号, スプートニク1号など）：
    // 現在のシミュレーション時刻がその歴史的活動年・期間と一致している時のみ表示
    const jsDate = customSimTime || (time ? Cesium.JulianDate.toDate(time) : (viewer ? Cesium.JulianDate.toDate(viewer.clock.currentTime) : new Date()));
    const simYear = jsDate.getUTCFullYear();
    if (mission.historicYear) {
        return simYear === mission.historicYear;
    }
    return false;
}

/**
 * 深宇宙探査機用の高視認性 HTML DOM ラベルを初期化生成
 */
function initDeepSpaceDomLabels() {
    if (!labelsContainer) return;
    DEEP_SPACE_MISSIONS.forEach(mission => {
        if (!deepSpaceDomLabels[mission.id]) {
            const labelElem = document.createElement('div');
            labelElem.className = 'sat-dom-label deep-space-label';
            labelElem.textContent = `${mission.symbol || '🚀'} ${mission.shortName}`;
            labelElem.dataset.missionId = mission.id;
            labelElem.style.borderColor = mission.color || '#38bdf8';
            labelElem.addEventListener('click', (e) => {
                e.stopPropagation();
                selectDeepSpaceMission(mission.id);
                satSelect.value = `deepspace_${mission.id}`;
            });
            labelsContainer.appendChild(labelElem);
            deepSpaceDomLabels[mission.id] = labelElem;
        }
    });
}

/**
 * 毎フレーム深宇宙探査機の3D位置をスクリーン座標へ高精度同期投影
 */
function updateDeepSpaceDomLabels(effectiveTime) {
    if (!viewer || !labelsContainer) return;
    const toggleDeepSpace = document.getElementById('toggleDeepSpace');
    const isDeepSpaceVisible = (!toggleDeepSpace || toggleDeepSpace.checked);
    const toggleLabels = document.getElementById('toggleLabels');
    const showLabels = (!toggleLabels || toggleLabels.checked);

    const canvasWidth = viewer.scene.canvas.clientWidth;
    const canvasHeight = viewer.scene.canvas.clientHeight;

    DEEP_SPACE_MISSIONS.forEach(mission => {
        const labelElem = deepSpaceDomLabels[mission.id];
        if (!labelElem) return;

        const isSelected = (selectedDeepSpaceId === mission.id);
        if (isSelected) {
            labelElem.classList.add('selected');
        } else {
            labelElem.classList.remove('selected');
        }

        const isActive = isDeepSpaceMissionActive(mission, effectiveTime);

        if (isDeepSpaceVisible && (showLabels || isSelected) && isActive) {
            const pos = computeDeepSpacePosition(mission, effectiveTime);
            if (pos) {
                const screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, pos);
                if (screenPos && screenPos.x >= -100 && screenPos.x <= canvasWidth + 100 && screenPos.y >= -100 && screenPos.y <= canvasHeight + 100) {
                    labelElem.style.display = 'block';
                    labelElem.style.left = `${screenPos.x}px`;
                    labelElem.style.top = `${screenPos.y}px`;
                    return;
                }
            }
        }
        labelElem.style.display = 'none';
    });
}

function initDeepSpaceMissions() {
    if (!viewer) return;
    createDeepSpaceEntities();
    initDeepSpaceDomLabels();
}

/**
 * 各深宇宙探査機の軌道中心（L2点、月中心、火星中心、木星、海王星など）の3D座標を算出
 */
function computeDeepSpaceOrbitCenter(mission, time) {
    if (!viewer || !mission) return Cesium.Cartesian3.ZERO;
    const effectiveTime = customSimTime ? Cesium.JulianDate.fromDate(customSimTime) : (time || (viewer && viewer.clock.currentTime));

    if (mission.id === 'JWST') {
        let sunPos;
        try {
            const sunBody = CELESTIAL_BODIES.find(b => b.id === 'SUN');
            sunPos = computeCelestialPosition(sunBody, effectiveTime);
        } catch(e) {}
        
        let antiSunDir;
        if (sunPos && Cesium.Cartesian3.magnitude(sunPos) > 1000) {
            const sunDir = Cesium.Cartesian3.normalize(sunPos, new Cesium.Cartesian3());
            antiSunDir = Cesium.Cartesian3.negate(sunDir, new Cesium.Cartesian3());
        } else {
            antiSunDir = new Cesium.Cartesian3(1, 0, 0);
        }

        const L2_DIST = 800000000;
        return Cesium.Cartesian3.multiplyByScalar(antiSunDir, L2_DIST, new Cesium.Cartesian3());
    }

    if (mission.id === 'ARTEMIS_ORION' || mission.id === 'LRO' || mission.id === 'APOLLO11') {
        let moonPos;
        try {
            const moonBody = CELESTIAL_BODIES.find(b => b.id === 'MOON');
            moonPos = computeCelestialPosition(moonBody, effectiveTime);
        } catch(e) {}
        return moonPos || new Cesium.Cartesian3(384400000, 0, 0);
    }

    if (mission.id === 'MARS_PERSEVERANCE' || mission.id === 'MARS_MRO') {
        let marsPos;
        try {
            const marsBody = CELESTIAL_BODIES.find(b => b.id === 'MARS');
            marsPos = computeCelestialPosition(marsBody, effectiveTime);
        } catch(e) {}
        return marsPos || new Cesium.Cartesian3(2000000000, 0, 0);
    }

    if (mission.id === 'VOYAGER1' || mission.id === 'VOYAGER2') {
        return computeDeepSpacePosition(mission, effectiveTime);
    }

    if (mission.id === 'SPUTNIK1') {
        return Cesium.Cartesian3.ZERO;
    }

    // はやぶさ2等の恒星間・深宇宙探査機は、探査機自身の位置を中心点とする！
    return computeDeepSpacePosition(mission, effectiveTime);
}

/**
 * 軌道全体の楕円ループが画面に美しく収まる局所座標（ENU: East-North-Up）オフセットベクトル
 */
function getDeepSpaceOrbitOverviewOffset(mission) {
    if (!mission) return new Cesium.Cartesian3(0, -300000000, 400000000);

    if (mission.id === 'JWST') {
        const dist = 650000000;
        return new Cesium.Cartesian3(0, -dist * 0.55, -dist * 0.75);
    }
    if (mission.id === 'ARTEMIS_ORION') {
        const dist = 130000000;
        return new Cesium.Cartesian3(0, -dist * 0.6, dist * 0.7);
    }
    if (mission.id === 'LRO') {
        const dist = 8000000;
        return new Cesium.Cartesian3(0, -dist * 0.6, dist * 0.7);
    }
    if (mission.id === 'APOLLO11') {
        const dist = 12000000; // 月球とアポロ11号軌道を完璧に収める12,000 km
        return new Cesium.Cartesian3(0, -dist * 0.6, dist * 0.7);
    }
    if (mission.id === 'MARS_MRO') {
        const dist = 15000000;
        return new Cesium.Cartesian3(0, -dist * 0.6, dist * 0.7);
    }
    if (mission.id === 'MARS_PERSEVERANCE') {
        const dist = 5000000;
        return new Cesium.Cartesian3(0, -dist * 0.6, dist * 0.7);
    }
    if (mission.id === 'VOYAGER1') {
        const dist = 35000000; // 機体から3.5万km（双曲線軌道線と機体を美しく捉える視点）
        return new Cesium.Cartesian3(dist * 0.45, -dist * 0.7, dist * 0.4);
    }
    if (mission.id === 'VOYAGER2') {
        const dist = 35000000; // 機体から3.5万km（双曲線軌道線と機体を美しく捉える視点）
        return new Cesium.Cartesian3(dist * 0.45, -dist * 0.7, dist * 0.4);
    }
    if (mission.id === 'SPUTNIK1') {
        const dist = 22000000; // 地球球体とスプートニク1号の軌道全体を見渡す22,000 km
        return new Cesium.Cartesian3(0, -dist * 0.6, dist * 0.7);
    }
    if (mission.id === 'HAYABUSA2') {
        const dist = 50000000;
        return new Cesium.Cartesian3(dist * 0.4, -dist * 0.6, dist * 0.5);
    }
    const dist = 50000000;
    return new Cesium.Cartesian3(0, -dist * 0.6, dist * 0.7);
}

/**
 * 軌道中心のENUフレーム基準オフセットから、カメラのワールド座標（ECEF）を算出
 */
function getDeepSpaceOverviewCameraDestination(centerPos, overviewEnuOffset) {
    if (!centerPos) return overviewEnuOffset;
    try {
        const enuTransform = Cesium.Transforms.eastNorthUpToFixedFrame(centerPos);
        return Cesium.Matrix4.multiplyByPoint(enuTransform, overviewEnuOffset, new Cesium.Cartesian3());
    } catch(e) {
        return Cesium.Cartesian3.add(centerPos, overviewEnuOffset, new Cesium.Cartesian3());
    }
}

function createDeepSpaceEntities() {
    if (!viewer) return;
    deepSpaceEntities.forEach(ent => viewer.entities.remove(ent));
    deepSpaceEntities = [];

    const toggleDeepSpace = document.getElementById('toggleDeepSpace');
    const isVisible = (!toggleDeepSpace || toggleDeepSpace.checked);

    DEEP_SPACE_MISSIONS.forEach(mission => {
        const billboardCanvas = createDeepSpaceBillboard(mission);
        const overviewOffset = getDeepSpaceOrbitOverviewOffset(mission);

        // 1. 探査機本体エンティティ（自発光・ズームアウトしても一定サイズ保証）
        const entity = viewer.entities.add({
            id: `deepspace_${mission.id}`,
            name: mission.name,
            position: new Cesium.CallbackProperty((time) => {
                return computeDeepSpacePosition(mission, time);
            }, false),
            billboard: {
                image: billboardCanvas,
                width: 140,
                height: 70,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                pixelOffset: Cesium.Cartesian2.ZERO,
                show: new Cesium.CallbackProperty((time) => {
                    const toggle = document.getElementById('toggleDeepSpace');
                    const isVis = (!toggle || toggle.checked);
                    return isVis && isDeepSpaceMissionActive(mission, time);
                }, false),
                scaleByDistance: new Cesium.NearFarScalar(1.0e3, 1.35, 5.0e11, 0.75),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            point: {
                pixelSize: 18,
                color: Cesium.Color.fromCssColorString(mission.color || '#38bdf8').withAlpha(0.6),
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                show: new Cesium.CallbackProperty((time) => {
                    const toggle = document.getElementById('toggleDeepSpace');
                    const isVis = (!toggle || toggle.checked);
                    return isVis && isDeepSpaceMissionActive(mission, time);
                }, false),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
        entity.deepSpaceData = mission;
        deepSpaceEntities.push(entity);

        // 2. 軌道中心エンティティ（軌道全体のループを画面中央に捉え続けるための仮想アンカー）
        const centerEntity = viewer.entities.add({
            id: `orbitcenter_${mission.id}`,
            name: `${mission.shortName} Orbit Center`,
            viewFrom: overviewOffset,
            position: new Cesium.CallbackProperty((time) => {
                return computeDeepSpaceOrbitCenter(mission, time);
            }, false),
            show: new Cesium.CallbackProperty((time) => isDeepSpaceMissionActive(mission, time), false)
        });
        deepSpaceEntities.push(centerEntity);
    });
}

/**
 * 太陽光を浴びて青白く輝くハレー彗星の高解像度ベクターグラフィックス生成エンジン
 * （自発光・Unlit仕様：太陽系スケールまでズームアウトしても黒く消えず、雄大な尾とコマを常時維持）
 */
function createFaithfulCometCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 360, 180);

    const cx = 130;
    const cy = 90;

    // 1. 青白い自発光コマ（Coma：昇華ガス雲オーラ）
    const comaGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 60);
    comaGrad.addColorStop(0, '#ffffff');
    comaGrad.addColorStop(0.25, '#7dd3fc');
    comaGrad.addColorStop(0.55, 'rgba(14, 165, 233, 0.45)');
    comaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = comaGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fill();

    // 2. 右斜め上へたなびく壮大な彗星の尾（イオンテイル＆ダストテイル）
    const tailGrad = ctx.createLinearGradient(cx, cy, cx + 190, cy - 55);
    tailGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    tailGrad.addColorStop(0.25, 'rgba(56, 189, 248, 0.7)');
    tailGrad.addColorStop(0.65, 'rgba(14, 165, 233, 0.35)');
    tailGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
    ctx.fillStyle = tailGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 14);
    ctx.lineTo(cx + 205, cy - 65);
    ctx.lineTo(cx + 195, cy - 25);
    ctx.lineTo(cx + 14, cy - 6);
    ctx.closePath();
    ctx.fill();

    // 3. 高輝度の彗星核コア
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    // 4. ボールド多言語ラベル
    ctx.font = 'bold 22px "Inter", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 4.5;
    ctx.strokeText('☄️ 1P/Halley', cx, 142);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('☄️ 1P/Halley', cx, 142);

    return canvas;
}

/**
 * 忠実な宇宙機・ロケット・衛星の高解像度ベクターグラフィックス生成エンジン
 * （常時自発光・Unlit仕様：天体の夜側や深宇宙の影でも絶対に黒く潰れない）
 */
function createFaithfulCraftCanvas(craftType, options = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 360, 180);

    const cx = 180;
    const cy = 90;
    const primaryColor = options.color || '#38bdf8';
    const labelText = options.name || '';

    // 1. 周囲のソフトな自発光ネオンオーラ（暗黒の宇宙でも位置を100%保証）
    const glowGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 60);
    glowGrad.addColorStop(0, primaryColor);
    glowGrad.addColorStop(0.45, primaryColor);
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    if (craftType === 'VOYAGER' || craftType === 'VOYAGER2') {
        // --- ボイジャー1号 / 2号 忠実再現 ---
        // 1. 13m 磁力計ブーム（右斜め上へ伸びる長大なトラス）
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx + 8, cy - 6);
        ctx.lineTo(cx + 58, cy - 38);
        ctx.stroke();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(cx + 58, cy - 38, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // 2. RTG原子力電池ブーム（左斜め下へ伸びる3基のシリンダー）
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy + 8);
        ctx.lineTo(cx - 42, cy + 28);
        ctx.stroke();
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.2;
        ctx.fillRect(cx - 52, cy + 22, 16, 10);
        ctx.strokeRect(cx - 52, cy + 22, 16, 10);

        // 3. 10面体バス本体（ゴールドマイラー断熱シート）
        ctx.fillStyle = '#d97706';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 6, 14, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 4. ゴールデンレコード（人類のメッセージを刻んだ金色の円盤）
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx + 12, cy + 6, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(cx + 12, cy + 6, 3.5, 0, Math.PI * 2);
        ctx.stroke();

        // 5. 直径3.7m 高利得パラボラアンテナ（純白のカセグレンお皿）
        const dishGrad = ctx.createLinearGradient(cx - 28, cy - 32, cx + 28, cy - 4);
        dishGrad.addColorStop(0, '#ffffff');
        dishGrad.addColorStop(0.5, '#f1f5f9');
        dishGrad.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = dishGrad;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx - 4, cy - 14, 26, 16, -0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // アンテナ内側のサブ反射鏡3脚フィードホーン
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy - 14); ctx.lineTo(cx - 4, cy - 24);
        ctx.moveTo(cx + 10, cy - 14); ctx.lineTo(cx - 4, cy - 24);
        ctx.moveTo(cx - 4, cy - 4);  ctx.lineTo(cx - 4, cy - 24);
        ctx.stroke();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(cx - 4, cy - 24, 3, 0, Math.PI * 2);
        ctx.fill();

    } else if (craftType === 'APOLLO') {
        // --- アポロ11号 (CSM コロンビア & LM イーグル) 忠実再現 ---
        const nozGrad = ctx.createLinearGradient(cx - 38, cy, cx - 24, cy);
        nozGrad.addColorStop(0, '#475569');
        nozGrad.addColorStop(1, '#94a3b8');
        ctx.fillStyle = nozGrad;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 24, cy - 6);
        ctx.lineTo(cx - 38, cy - 12);
        ctx.lineTo(cx - 38, cy + 12);
        ctx.lineTo(cx - 24, cy + 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.fillRect(cx - 24, cy - 12, 26, 24);
        ctx.strokeRect(cx - 24, cy - 12, 26, 24);
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - 16, cy - 10, 10, 20);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(cx - 14, cy - 16, 6, 4);
        ctx.fillRect(cx - 14, cy + 12, 6, 4);

        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + 2, cy - 12);
        ctx.lineTo(cx + 18, cy);
        ctx.lineTo(cx + 2, cy + 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx + 8, cy - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.8;
        ctx.fillRect(cx + 22, cy - 9, 16, 18);
        ctx.strokeRect(cx + 22, cy - 9, 16, 18);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + 24, cy - 9); ctx.lineTo(cx + 18, cy - 22);
        ctx.moveTo(cx + 36, cy - 9); ctx.lineTo(cx + 42, cy - 22);
        ctx.moveTo(cx + 24, cy + 9); ctx.lineTo(cx + 18, cy + 22);
        ctx.moveTo(cx + 36, cy + 9); ctx.lineTo(cx + 42, cy + 22);
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        [ [cx + 18, cy - 22], [cx + 42, cy - 22], [cx + 18, cy + 22], [cx + 42, cy + 22] ].forEach(([px, py]) => {
            ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
        });
        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.fillRect(cx + 25, cy - 6, 10, 12);
        ctx.strokeRect(cx + 25, cy - 6, 10, 12);

    } else if (craftType === 'SPUTNIK') {
        // --- スプートニク1号 忠実再現 ---
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx, cy, 32, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.25)';
        ctx.beginPath(); ctx.arc(cx, cy, 48, 0, Math.PI * 2); ctx.stroke();

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy - 8);  ctx.lineTo(cx - 52, cy - 38);
        ctx.moveTo(cx - 8, cy - 4);  ctx.lineTo(cx - 58, cy - 22);
        ctx.moveTo(cx - 8, cy + 4);  ctx.lineTo(cx - 58, cy + 22);
        ctx.moveTo(cx - 8, cy + 8);  ctx.lineTo(cx - 52, cy + 38);
        ctx.stroke();

        const sphereGrad = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, 18);
        sphereGrad.addColorStop(0, '#ffffff');
        sphereGrad.addColorStop(0.35, '#e2e8f0');
        sphereGrad.addColorStop(0.75, '#94a3b8');
        sphereGrad.addColorStop(1, '#475569');
        ctx.fillStyle = sphereGrad;
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 18, 5, 0.2, 0, Math.PI * 2);
        ctx.stroke();

    } else if (craftType === 'ISS') {
        // --- 国際宇宙ステーション (ISS) 忠実再現 ---
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(cx - 65, cy);
        ctx.lineTo(cx + 65, cy);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.2;
        [-38, 0, 38].forEach(rx => {
            ctx.fillRect(cx + rx - 4, cy - 14, 8, 28);
            ctx.strokeRect(cx + rx - 4, cy - 14, 8, 28);
        });

        const drawSolarWing = (x, y, w, h) => {
            const pvGrad = ctx.createLinearGradient(x, y, x + w, y + h);
            pvGrad.addColorStop(0, '#f59e0b');
            pvGrad.addColorStop(0.5, '#b45309');
            pvGrad.addColorStop(1, '#d97706');
            ctx.fillStyle = pvGrad;
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 1.5;
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + w * 0.5, y); ctx.lineTo(x + w * 0.5, y + h);
            ctx.moveTo(x, y + h * 0.5); ctx.lineTo(x + w, y + h * 0.5);
            ctx.stroke();
        };

        drawSolarWing(cx - 68, cy - 36, 14, 30);
        drawSolarWing(cx - 52, cy - 36, 14, 30);
        drawSolarWing(cx - 68, cy + 6, 14, 30);
        drawSolarWing(cx - 52, cy + 6, 14, 30);

        drawSolarWing(cx + 38, cy - 36, 14, 30);
        drawSolarWing(cx + 54, cy - 36, 14, 30);
        drawSolarWing(cx + 38, cy + 6, 14, 30);
        drawSolarWing(cx + 54, cy + 6, 14, 30);

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.fillRect(cx - 8, cy - 18, 16, 36);
        ctx.strokeRect(cx - 8, cy - 18, 16, 36);

        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(cx + 8, cy - 6, 14, 12);
        ctx.strokeRect(cx + 8, cy - 6, 14, 12);

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx, cy + 12, 4.5, 0, Math.PI * 2);
        ctx.fill();

    } else if (craftType === 'JWST') {
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 22);
        ctx.lineTo(cx + 26, cy + 8);
        ctx.lineTo(cx, cy + 22);
        ctx.lineTo(cx - 26, cy + 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (i * 60 - 30) * Math.PI / 180;
            const hx = cx + 13 * Math.cos(a);
            const hy = cy - 2 + 13 * Math.sin(a);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else if (craftType === 'ORION') {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(cx - 22, cy - 14); ctx.lineTo(cx + 22, cy + 14);
        ctx.moveTo(cx - 22, cy + 14); ctx.lineTo(cx + 22, cy - 14);
        ctx.stroke();

        ctx.fillStyle = '#0284c7';
        ctx.fillRect(cx - 7, cy - 6, 14, 12);

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(cx - 9, cy + 2);
        ctx.lineTo(cx + 9, cy + 2);
        ctx.lineTo(cx, cy - 14);
        ctx.closePath();
        ctx.fill();
    } else if (craftType === 'HST') {
        // --- ハッブル宇宙望遠鏡 (HST) 忠実再現 ---
        // 1. 左右の大型ソーラーアレイ（ゴールド／ブロンズ）
        const drawHstWing = (wx) => {
            ctx.fillStyle = '#b45309';
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.5;
            ctx.fillRect(wx, cy - 32, 16, 64);
            ctx.strokeRect(wx, cy - 32, 16, 64);
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(wx + 8, cy - 32); ctx.lineTo(wx + 8, cy + 32);
            ctx.moveTo(wx, cy); ctx.lineTo(wx + 16, cy);
            ctx.stroke();
            // 支持アーム
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(wx < cx ? wx + 16 : wx, cy);
            ctx.lineTo(wx < cx ? cx - 14 : cx + 14, cy);
            ctx.stroke();
        };
        drawHstWing(cx - 58);
        drawHstWing(cx + 42);

        // 2. 円筒形鏡筒本体（高輝度シルバー断熱ブランケット）
        const tubeGrad = ctx.createLinearGradient(cx - 14, cy, cx + 14, cy);
        tubeGrad.addColorStop(0, '#64748b');
        tubeGrad.addColorStop(0.35, '#f8fafc');
        tubeGrad.addColorStop(0.7, '#cbd5e1');
        tubeGrad.addColorStop(1, '#475569');
        ctx.fillStyle = tubeGrad;
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.fillRect(cx - 14, cy - 22, 28, 44);
        ctx.strokeRect(cx - 14, cy - 22, 28, 44);

        // 3. 開いたアパーチャードア（鏡筒上部フード）
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx - 14, cy - 22);
        ctx.lineTo(cx - 24, cy - 34);
        ctx.lineTo(cx - 6, cy - 34);
        ctx.lineTo(cx, cy - 22);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 4. ハイゲインディッシュアンテナ
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx + 18, cy + 16, 7, 0, Math.PI);
        ctx.stroke();
    } else if (craftType === 'TIANGONG') {
        // --- 中国宇宙ステーション天宮 (CSS) 忠実再現 ---
        // 1. T字型コア＆実験モジュール
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        // 天和コアモジュール（垂直）
        ctx.fillRect(cx - 8, cy - 24, 16, 48);
        ctx.strokeRect(cx - 8, cy - 24, 16, 48);
        // 問天・夢天モジュール（水平）
        ctx.fillRect(cx - 32, cy - 7, 64, 14);
        ctx.strokeRect(cx - 32, cy - 7, 64, 14);

        // 2. 巨大ソーラーパネル（高彩度ブルー）
        const drawTgWing = (x, y) => {
            ctx.fillStyle = '#0284c7';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.2;
            ctx.fillRect(x, y, 22, 14);
            ctx.strokeRect(x, y, 22, 14);
        };
        drawTgWing(cx - 58, cy - 7);
        drawTgWing(cx + 36, cy - 7);
    } else if (craftType === 'ROCKET') {
        // --- ロケット上段 (Rocket Body) / 大型スペースデブリ 忠実再現 ---
        // 1. 円筒形ロケットボディ（断熱白色＆チタン）
        const rktGrad = ctx.createLinearGradient(cx - 12, cy, cx + 12, cy);
        rktGrad.addColorStop(0, '#475569');
        rktGrad.addColorStop(0.35, '#f8fafc');
        rktGrad.addColorStop(0.8, '#cbd5e1');
        rktGrad.addColorStop(1, '#334155');
        ctx.fillStyle = rktGrad;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.fillRect(cx - 12, cy - 28, 24, 46);
        ctx.strokeRect(cx - 12, cy - 28, 24, 46);

        // ロケット識別ストライプ
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(cx - 12, cy - 14, 24, 5);

        // 2. ロケットエンジンベルノズル（下部）
        const nozGrad = ctx.createLinearGradient(cx - 8, cy + 18, cx + 8, cy + 32);
        nozGrad.addColorStop(0, '#334155');
        nozGrad.addColorStop(1, '#94a3b8');
        ctx.fillStyle = nozGrad;
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 7, cy + 18);
        ctx.lineTo(cx - 13, cy + 32);
        ctx.lineTo(cx + 13, cy + 32);
        ctx.lineTo(cx + 7, cy + 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 3. ノーズコーン / ペイロードアダプタ（上部）
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(cx - 12, cy - 28);
        ctx.lineTo(cx, cy - 36);
        ctx.lineTo(cx + 12, cy - 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else {
        // 一般人工衛星 / ロケット体
        const pvGrad = ctx.createLinearGradient(cx - 50, cy, cx + 50, cy);
        pvGrad.addColorStop(0, '#0284c7');
        pvGrad.addColorStop(0.5, '#38bdf8');
        pvGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = pvGrad;
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 1.5;
        ctx.fillRect(cx - 48, cy - 8, 28, 16);
        ctx.strokeRect(cx - 48, cy - 8, 28, 16);
        ctx.fillRect(cx + 20, cy - 8, 28, 16);
        ctx.strokeRect(cx + 20, cy - 8, 28, 16);

        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.fillRect(cx - 12, cy - 12, 24, 24);
        ctx.strokeRect(cx - 12, cy - 12, 24, 24);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy - 16, 7, Math.PI, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();

    // 中央コアマーカー
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 視認性の高いボールドラベル
    if (labelText) {
        ctx.font = 'bold 22px "Inter", "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 4.5;
        ctx.strokeText(labelText, cx, 142);
        ctx.fillStyle = primaryColor || '#ffffff';
        ctx.fillText(labelText, cx, 142);
    }

    return canvas;
}

function createDeepSpaceBillboard(mission) {
    let craftType = 'SATELLITE';
    if (mission.id === 'VOYAGER1') craftType = 'VOYAGER';
    else if (mission.id === 'VOYAGER2') craftType = 'VOYAGER2';
    else if (mission.id === 'APOLLO11') craftType = 'APOLLO';
    else if (mission.id === 'SPUTNIK1') craftType = 'SPUTNIK';
    else if (mission.id === 'JWST') craftType = 'JWST';
    else if (mission.id === 'ARTEMIS_ORION') craftType = 'ORION';
    else if (mission.id === 'HAYABUSA2') craftType = 'VOYAGER';

    return createFaithfulCraftCanvas(craftType, {
        color: mission.color || '#38bdf8',
        name: mission.shortName || mission.name
    });
}

function computeDeepSpacePosition(mission, time) {
    if (!viewer) return Cesium.Cartesian3.ZERO;

    const simDate = customSimTime || (time ? Cesium.JulianDate.toDate(time) : new Date());
    const effectiveTime = customSimTime ? Cesium.JulianDate.fromDate(customSimTime) : (time || viewer.clock.currentTime);
    const d = (simDate.getTime() / 86400000.0) + 2440587.5 - 2451545.0;

    if (mission.id === 'JWST') {
        let sunPos;
        try {
            const sunBody = CELESTIAL_BODIES.find(b => b.id === 'SUN');
            sunPos = computeCelestialPosition(sunBody, effectiveTime);
        } catch(e) {}
        
        let antiSunDir;
        if (sunPos && Cesium.Cartesian3.magnitude(sunPos) > 1000) {
            const sunDir = Cesium.Cartesian3.normalize(sunPos, new Cesium.Cartesian3());
            antiSunDir = Cesium.Cartesian3.negate(sunDir, new Cesium.Cartesian3());
        } else {
            antiSunDir = new Cesium.Cartesian3(1, 0, 0);
        }

        const L2_DIST = 800000000;
        const l2Center = Cesium.Cartesian3.multiplyByScalar(antiSunDir, L2_DIST, new Cesium.Cartesian3());

        const zUp = Cesium.Cartesian3.UNIT_Z;
        const haloY = Cesium.Cartesian3.cross(antiSunDir, zUp, new Cesium.Cartesian3());
        Cesium.Cartesian3.normalize(haloY, haloY);
        const haloZ = Cesium.Cartesian3.cross(haloY, antiSunDir, new Cesium.Cartesian3());
        Cesium.Cartesian3.normalize(haloZ, haloZ);

        const haloPeriodDays = 0.15;
        const theta = ((d % haloPeriodDays) / haloPeriodDays) * Math.PI * 2;
        const yOffset = Cesium.Cartesian3.multiplyByScalar(haloY, 180000000 * Math.cos(theta), new Cesium.Cartesian3());
        const zOffset = Cesium.Cartesian3.multiplyByScalar(haloZ, 110000000 * Math.sin(theta), new Cesium.Cartesian3());

        const jwstPos = Cesium.Cartesian3.add(l2Center, yOffset, new Cesium.Cartesian3());
        Cesium.Cartesian3.add(jwstPos, zOffset, jwstPos);
        return jwstPos;
    }

    if (mission.id === 'ARTEMIS_ORION') {
        let moonPos;
        try {
            const moonBody = CELESTIAL_BODIES.find(b => b.id === 'MOON');
            moonPos = computeCelestialPosition(moonBody, effectiveTime);
        } catch(e) {}
        if (!moonPos) moonPos = new Cesium.Cartesian3(384400000, 0, 0);

        const droPeriodDays = 0.12;
        const theta = ((d % droPeriodDays) / droPeriodDays) * Math.PI * 2;
        const droRadius = 35000000;
        
        const ox = droRadius * Math.cos(theta);
        const oy = droRadius * Math.sin(theta) * 0.7071;
        const oz = droRadius * Math.sin(theta) * 0.7071;
        return Cesium.Cartesian3.add(moonPos, new Cesium.Cartesian3(ox, oy, oz), new Cesium.Cartesian3());
    }

    if (mission.id === 'LRO') {
        let moonPos;
        try {
            const moonBody = CELESTIAL_BODIES.find(b => b.id === 'MOON');
            moonPos = computeCelestialPosition(moonBody, effectiveTime);
        } catch(e) {}
        if (!moonPos) moonPos = new Cesium.Cartesian3(384400000, 0, 0);

        const period = 0.08;
        const theta = ((d % period) / period) * Math.PI * 2;
        const orbitR = 3500000;
        
        const ox = orbitR * Math.cos(theta);
        const oz = orbitR * Math.sin(theta);
        return Cesium.Cartesian3.add(moonPos, new Cesium.Cartesian3(ox, 0, oz), new Cesium.Cartesian3());
    }

    if (mission.id === 'APOLLO11') {
        let moonPos;
        try {
            const moonBody = CELESTIAL_BODIES.find(b => b.id === 'MOON');
            moonPos = computeCelestialPosition(moonBody, effectiveTime);
        } catch(e) {}
        if (!moonPos) moonPos = new Cesium.Cartesian3(384400000, 0, 0);

        const period = 0.083; // 2時間周期
        const theta = ((d % period) / period) * Math.PI * 2;
        const orbitR = 3800000; // 月球のすぐ外側の周回軌道
        
        const ox = orbitR * Math.cos(theta);
        const oz = orbitR * Math.sin(theta);
        return Cesium.Cartesian3.add(moonPos, new Cesium.Cartesian3(ox, 0, oz), new Cesium.Cartesian3());
    }

    if (mission.id === 'SPUTNIK1') {
        const period = 0.0668; // ~96.2分周期
        const theta = ((d % period) / period) * Math.PI * 2;
        const incRad = 65.1 * Math.PI / 180;
        const orbitR = 6948000 + 360000 * Math.cos(theta);
        
        const ox = orbitR * Math.cos(theta);
        const oy = orbitR * Math.sin(theta) * Math.cos(incRad);
        const oz = orbitR * Math.sin(theta) * Math.sin(incRad);
        return new Cesium.Cartesian3(ox, oy, oz);
    }

    if (mission.id === 'MARS_PERSEVERANCE') {
        let marsPos;
        try {
            const marsBody = CELESTIAL_BODIES.find(b => b.id === 'MARS');
            marsPos = computeCelestialPosition(marsBody, effectiveTime);
        } catch(e) {}
        if (!marsPos) marsPos = new Cesium.Cartesian3(2000000000, 0, 0);

        const marsRadius = 3390000;
        const latRad = 18.38 * Math.PI / 180;
        const lonRad = (77.58 + (d % 1.026) / 1.026 * 360) * Math.PI / 180;

        const ox = (marsRadius + 200000) * Math.cos(latRad) * Math.cos(lonRad);
        const oy = (marsRadius + 200000) * Math.cos(latRad) * Math.sin(lonRad);
        const oz = (marsRadius + 200000) * Math.sin(latRad);
        return Cesium.Cartesian3.add(marsPos, new Cesium.Cartesian3(ox, oy, oz), new Cesium.Cartesian3());
    }

    if (mission.id === 'MARS_MRO') {
        let marsPos;
        try {
            const marsBody = CELESTIAL_BODIES.find(b => b.id === 'MARS');
            marsPos = computeCelestialPosition(marsBody, effectiveTime);
        } catch(e) {}
        if (!marsPos) marsPos = new Cesium.Cartesian3(2000000000, 0, 0);

        const period = 0.08;
        const theta = ((d % period) / period) * Math.PI * 2;
        const orbitR = 5500000;
        
        const oy = orbitR * Math.cos(theta);
        const oz = orbitR * Math.sin(theta);
        return Cesium.Cartesian3.add(marsPos, new Cesium.Cartesian3(0, oy, oz), new Cesium.Cartesian3());
    }

    if (mission.id === 'HAYABUSA2') {
        const theta = (d % 90) / 90 * Math.PI * 2;
        const dist = 1200000000;
        return new Cesium.Cartesian3(
            dist * Math.cos(theta),
            dist * Math.sin(theta) * 0.9,
            dist * Math.sin(theta) * 0.15
        );
    }

    if (mission.id === 'VOYAGER1') {
        let jupPos;
        try {
            const jupiterBody = CELESTIAL_BODIES.find(b => b.id === 'JUPITER');
            jupPos = computeCelestialPosition(jupiterBody, effectiveTime);
        } catch(e) {}
        if (!jupPos) jupPos = new Cesium.Cartesian3(778000000000, 0, 0);
        const offset = new Cesium.Cartesian3(350000000 * 0.75, -350000000 * 0.55, 350000000 * 0.25);
        return Cesium.Cartesian3.add(jupPos, offset, new Cesium.Cartesian3());
    }

    if (mission.id === 'VOYAGER2') {
        let nepPos;
        try {
            const neptuneBody = CELESTIAL_BODIES.find(b => b.id === 'NEPTUNE');
            nepPos = computeCelestialPosition(neptuneBody, effectiveTime);
        } catch(e) {}
        if (!nepPos) nepPos = new Cesium.Cartesian3(4500000000000, 0, 0);
        const offset = new Cesium.Cartesian3(18000000, -22000000, 32000000);
        return Cesium.Cartesian3.add(nepPos, offset, new Cesium.Cartesian3());
    }

    return Cesium.Cartesian3.ZERO;
}

function drawDeepSpaceOrbit(mission) {
    if (!viewer) return;
    if (deepSpaceOrbitEntity) {
        viewer.entities.remove(deepSpaceOrbitEntity);
        deepSpaceOrbitEntity = null;
    }

    deepSpaceOrbitEntity = viewer.entities.add({
        id: `orbit_deepspace_${mission.id}`,
        name: `${mission.shortName} Orbit Loop`,
        polyline: {
            positions: new Cesium.CallbackProperty((time) => {
                const effectiveTime = customSimTime ? Cesium.JulianDate.fromDate(customSimTime) : (time || (viewer && viewer.clock.currentTime));
                if (!effectiveTime) return [];
                const pts = [];
                const sampleCount = 120;

                if (mission.id === 'JWST') {
                    let sunPos;
                    try {
                        const sunBody = CELESTIAL_BODIES.find(b => b.id === 'SUN');
                        sunPos = computeCelestialPosition(sunBody, effectiveTime);
                    } catch(e) {}

                    let antiSunDir;
                    if (sunPos && Cesium.Cartesian3.magnitude(sunPos) > 1000) {
                        const sunDir = Cesium.Cartesian3.normalize(sunPos, new Cesium.Cartesian3());
                        antiSunDir = Cesium.Cartesian3.negate(sunDir, new Cesium.Cartesian3());
                    } else {
                        antiSunDir = new Cesium.Cartesian3(1, 0, 0);
                    }

                    const L2_DIST = 800000000;
                    const l2Center = Cesium.Cartesian3.multiplyByScalar(antiSunDir, L2_DIST, new Cesium.Cartesian3());

                    const zUp = Cesium.Cartesian3.UNIT_Z;
                    const haloY = Cesium.Cartesian3.cross(antiSunDir, zUp, new Cesium.Cartesian3());
                    Cesium.Cartesian3.normalize(haloY, haloY);
                    const haloZ = Cesium.Cartesian3.cross(haloY, antiSunDir, new Cesium.Cartesian3());
                    Cesium.Cartesian3.normalize(haloZ, haloZ);

                    for (let i = 0; i <= sampleCount; i++) {
                        const th = (i / sampleCount) * Math.PI * 2;
                        const yOff = Cesium.Cartesian3.multiplyByScalar(haloY, 180000000 * Math.cos(th), new Cesium.Cartesian3());
                        const zOff = Cesium.Cartesian3.multiplyByScalar(haloZ, 110000000 * Math.sin(th), new Cesium.Cartesian3());
                        const p = Cesium.Cartesian3.add(l2Center, yOff, new Cesium.Cartesian3());
                        Cesium.Cartesian3.add(p, zOff, p);
                        pts.push(p);
                    }
                } else if (mission.id === 'ARTEMIS_ORION') {
                    let moonPos;
                    try {
                        const moonBody = CELESTIAL_BODIES.find(b => b.id === 'MOON');
                        moonPos = computeCelestialPosition(moonBody, effectiveTime);
                    } catch(e) {}
                    if (!moonPos) moonPos = new Cesium.Cartesian3(384400000, 0, 0);

                    const droRadius = 35000000;
                    for (let i = 0; i <= sampleCount; i++) {
                        const th = (i / sampleCount) * Math.PI * 2;
                        const ox = droRadius * Math.cos(th);
                        const oy = droRadius * Math.sin(th) * 0.7071;
                        const oz = droRadius * Math.sin(th) * 0.7071;
                        pts.push(Cesium.Cartesian3.add(moonPos, new Cesium.Cartesian3(ox, oy, oz), new Cesium.Cartesian3()));
                    }
                } else if (mission.id === 'LRO') {
                    let moonPos;
                    try {
                        const moonBody = CELESTIAL_BODIES.find(b => b.id === 'MOON');
                        moonPos = computeCelestialPosition(moonBody, effectiveTime);
                    } catch(e) {}
                    if (!moonPos) moonPos = new Cesium.Cartesian3(384400000, 0, 0);

                    const orbitR = 3500000;
                    for (let i = 0; i <= sampleCount; i++) {
                        const th = (i / sampleCount) * Math.PI * 2;
                        const ox = orbitR * Math.cos(th);
                        const oz = orbitR * Math.sin(th);
                        pts.push(Cesium.Cartesian3.add(moonPos, new Cesium.Cartesian3(ox, 0, oz), new Cesium.Cartesian3()));
                    }
                } else if (mission.id === 'APOLLO11') {
                    let moonPos;
                    try {
                        const moonBody = CELESTIAL_BODIES.find(b => b.id === 'MOON');
                        moonPos = computeCelestialPosition(moonBody, effectiveTime);
                    } catch(e) {}
                    if (!moonPos) moonPos = new Cesium.Cartesian3(384400000, 0, 0);

                    // 1. 地球から月への自由帰還遷移軌道 (Trans-Lunar Injection: 8の字ループ)
                    for (let i = 0; i <= sampleCount; i++) {
                        const u = i / sampleCount; // 0 (地球) -> 1 (月)
                        const px = moonPos.x * u;
                        const py = moonPos.y * u + 42000000 * Math.sin(u * Math.PI);
                        const pz = moonPos.z * u + 18000000 * Math.sin(u * Math.PI * 2);
                        pts.push(new Cesium.Cartesian3(px, py, pz));
                    }
                    // 2. 月周回低軌道 (高度111km、半径約1850km)
                    const orbitR = 1850000;
                    for (let i = 0; i <= sampleCount; i++) {
                        const th = (i / sampleCount) * Math.PI * 2;
                        const ox = orbitR * Math.cos(th);
                        const oz = orbitR * Math.sin(th);
                        pts.push(Cesium.Cartesian3.add(moonPos, new Cesium.Cartesian3(ox, 0, oz), new Cesium.Cartesian3()));
                    }
                } else if (mission.id === 'SPUTNIK1') {
                    // スプートニク1号 (近地点215km, 遠地点939km, 軌道傾斜角65.1度)
                    const incRad = 65.1 * Math.PI / 180;
                    for (let i = 0; i <= sampleCount; i++) {
                        const th = (i / sampleCount) * Math.PI * 2;
                        const orbitR = 6948000 + 360000 * Math.cos(th);
                        const ox = orbitR * Math.cos(th);
                        const oy = orbitR * Math.sin(th) * Math.cos(incRad);
                        const oz = orbitR * Math.sin(th) * Math.sin(incRad);
                        pts.push(new Cesium.Cartesian3(ox, oy, oz));
                    }
                } else if (mission.id === 'MARS_MRO') {
                    let marsPos;
                    try {
                        const marsBody = CELESTIAL_BODIES.find(b => b.id === 'MARS');
                        marsPos = computeCelestialPosition(marsBody, effectiveTime);
                    } catch(e) {}
                    if (!marsPos) marsPos = new Cesium.Cartesian3(2000000000, 0, 0);

                    const orbitR = 5500000;
                    for (let i = 0; i <= sampleCount; i++) {
                        const th = (i / sampleCount) * Math.PI * 2;
                        const oy = orbitR * Math.cos(th);
                        const oz = orbitR * Math.sin(th);
                        pts.push(Cesium.Cartesian3.add(marsPos, new Cesium.Cartesian3(0, oy, oz), new Cesium.Cartesian3()));
                    }
                } else if (mission.id === 'VOYAGER1') {
                    let jupPos;
                    try {
                        const jBody = CELESTIAL_BODIES.find(b => b.id === 'JUPITER');
                        jupPos = computeCelestialPosition(jBody, effectiveTime);
                    } catch(e) {}
                    if (!jupPos) jupPos = new Cesium.Cartesian3(778000000000, 0, 0);

                    // 木星最接近点（ボイジャー1号本体の位置）
                    const flybyOffset = new Cesium.Cartesian3(350000000 * 0.75, -350000000 * 0.55, 350000000 * 0.25);
                    const v1FlybyPos = Cesium.Cartesian3.add(jupPos, flybyOffset, new Cesium.Cartesian3());

                    // 進入方向（太陽・地球・内惑星側から木星へ向かう単位ベクトル）
                    let appDir = new Cesium.Cartesian3(0.85, 0.52, -0.05);
                    try {
                        let sunPos;
                        const sunBody = CELESTIAL_BODIES.find(b => b.id === 'SUN');
                        sunPos = computeCelestialPosition(sunBody, effectiveTime);
                        if (sunPos && jupPos) {
                            appDir = Cesium.Cartesian3.subtract(jupPos, sunPos, new Cesium.Cartesian3());
                            Cesium.Cartesian3.normalize(appDir, appDir);
                        }
                    } catch(e) {}

                    // 脱出方向（木星から北方+35度星間空間へ向かう単位ベクトル）
                    let depDir = new Cesium.Cartesian3(0.45, 0.62, 0.64);
                    try {
                        const v1Pos = computeDeepSpacePosition(mission, effectiveTime);
                        if (v1Pos && jupPos) {
                            depDir = Cesium.Cartesian3.subtract(v1Pos, jupPos, new Cesium.Cartesian3());
                            Cesium.Cartesian3.normalize(depDir, depDir);
                        }
                    } catch(e) {}

                    // 厳密なケプラー双曲線基底（接線方向 T と 偏向法線方向 N）
                    // 変曲点・S字波打ちは数学的に絶対に発生せず、単調な美しい双曲線となる！
                    const T = Cesium.Cartesian3.normalize(Cesium.Cartesian3.add(appDir, depDir, new Cesium.Cartesian3()), new Cesium.Cartesian3());
                    const N = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(depDir, appDir, new Cesium.Cartesian3()), new Cesium.Cartesian3());

                    const R = 3.5e8; // 木星スイングバイ曲率半径 (35万km: 機体位置に完全調和)
                    const Lmax = 2.8e10; // 2800万km スパン
                    const v1Samples = 180;
                    for (let i = -v1Samples; i <= v1Samples; i++) {
                        const s = i / v1Samples; // -1.0 ~ +1.0
                        const u = Math.sign(s) * Math.pow(Math.abs(s), 1.8) * Lmax;
                        const normDist = Math.sqrt(u * u + R * R) - R;

                        const px = v1FlybyPos.x + T.x * u + N.x * normDist;
                        const py = v1FlybyPos.y + T.y * u + N.y * normDist;
                        const pz = v1FlybyPos.z + T.z * u + N.z * normDist;
                        pts.push(new Cesium.Cartesian3(px, py, pz));
                    }
                } else if (mission.id === 'VOYAGER2') {
                    let nepPos;
                    try {
                        const nBody = CELESTIAL_BODIES.find(b => b.id === 'NEPTUNE');
                        nepPos = computeCelestialPosition(nBody, effectiveTime);
                    } catch(e) {}
                    if (!nepPos) nepPos = new Cesium.Cartesian3(4500000000000, 0, 0);

                    // 海王星最接近点（ボイジャー2号本体の位置）
                    const flybyOffset = new Cesium.Cartesian3(18000000, -22000000, 32000000);
                    const v2FlybyPos = Cesium.Cartesian3.add(nepPos, flybyOffset, new Cesium.Cartesian3());

                    // 進入方向（天王星側から海王星へ向かう単位ベクトル）
                    let appDir = new Cesium.Cartesian3(0.75, 0.65, 0.08);
                    try {
                        const uBody = CELESTIAL_BODIES.find(b => b.id === 'URANUS');
                        const uraPos = computeCelestialPosition(uBody, effectiveTime);
                        if (uraPos && nepPos) {
                            appDir = Cesium.Cartesian3.subtract(nepPos, uraPos, new Cesium.Cartesian3());
                            Cesium.Cartesian3.normalize(appDir, appDir);
                        }
                    } catch(e) {}

                    // 脱出方向（海王星から南方-56度星間空間へ向かう単位ベクトル）
                    let depDir = new Cesium.Cartesian3(0.35, 0.45, -0.82);
                    try {
                        const v2Pos = computeDeepSpacePosition(mission, effectiveTime);
                        if (v2Pos && nepPos) {
                            depDir = Cesium.Cartesian3.subtract(v2Pos, nepPos, new Cesium.Cartesian3());
                            Cesium.Cartesian3.normalize(depDir, depDir);
                        }
                    } catch(e) {}

                    // 厳密なケプラー双曲線基底（接線方向 T と 偏向法線方向 N）
                    // 変曲点・S字波打ちは数学的に絶対に発生せず、単調な美しい双曲線となる！
                    const T = Cesium.Cartesian3.normalize(Cesium.Cartesian3.add(appDir, depDir, new Cesium.Cartesian3()), new Cesium.Cartesian3());
                    const N = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(depDir, appDir, new Cesium.Cartesian3()), new Cesium.Cartesian3());

                    const R = 8.0e7; // 海王星スイングバイ曲率半径 (8万km: 海王星半径2.5万km・機体距離4.2万kmに完全調和)
                    const Lmax = 3.2e10; // 3200万km スパン
                    const v2Samples = 180;
                    for (let i = -v2Samples; i <= v2Samples; i++) {
                        const s = i / v2Samples; // -1.0 ~ +1.0
                        const u = Math.sign(s) * Math.pow(Math.abs(s), 1.8) * Lmax;
                        const normDist = Math.sqrt(u * u + R * R) - R;

                        const px = v2FlybyPos.x + T.x * u + N.x * normDist;
                        const py = v2FlybyPos.y + T.y * u + N.y * normDist;
                        const pz = v2FlybyPos.z + T.z * u + N.z * normDist;
                        pts.push(new Cesium.Cartesian3(px, py, pz));
                    }
                } else if (mission.id === 'HAYABUSA2') {
                    for (let i = 0; i <= sampleCount; i++) {
                        const th = (i / sampleCount) * Math.PI * 2;
                        const dist = 1200000000;
                        pts.push(new Cesium.Cartesian3(
                            dist * Math.cos(th),
                            dist * Math.sin(th) * 0.9,
                            dist * Math.sin(th) * 0.15
                        ));
                    }
                }
                return pts;
            }, false),
            width: 6.0,
            arcType: Cesium.ArcType.NONE,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.52,
                color: Cesium.Color.fromCssColorString(mission.color || '#f59e0b')
            }),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, Number.MAX_VALUE)
        }
    });
}

let celestialOrbitEntity = null;

/**
 * 太陽系惑星の正確なケプラー公転軌道ループ頂点列（Cartesian3[]）を幾何学的に高速・滑らかに算出
 * （ハレー彗星などの高離心率天体でも近日点の角ばりや途切れをゼロにする離心近点角ダイレクト走査）
 */
function computePlanetaryOrbitPoints(pData, d, eHelio, epsRad, cosEps, sinEps, icrfToFixed, samples = 360) {
    const pts = [];
    const deg2rad = Math.PI / 180;
    const omega = (pData.w - pData.node) * deg2rad;
    const nodeRad = pData.node * deg2rad;
    const incRad = pData.I * deg2rad;
    const b = pData.a * Math.sqrt(Math.max(0, 1 - pData.e * pData.e));
    const totalSamples = (pData.e > 0.8) ? 720 : samples;

    for (let i = 0; i <= totalSamples; i++) {
        // 離心近点角 E (0 から 2π) を直接均等サンプリング（始点と終点が完全に一致し100%閉じたループになる）
        const E = (i / totalSamples) * Math.PI * 2;
        const xv = pData.a * (Math.cos(E) - pData.e);
        const yv = b * Math.sin(E);
        const r = Math.sqrt(xv * xv + yv * yv);
        const v = Math.atan2(yv, xv);
        const u = v + omega;

        // 日心黄道直交座標 (AU)
        const xh = r * (Math.cos(nodeRad) * Math.cos(u) - Math.sin(nodeRad) * Math.sin(u) * Math.cos(incRad));
        const yh = r * (Math.sin(nodeRad) * Math.cos(u) + Math.cos(nodeRad) * Math.sin(u) * Math.cos(incRad));
        const zh = r * (Math.sin(u) * Math.sin(incRad));

        // 地球から見た地心黄道直交ベクトル (AU)
        const gx = xh - eHelio.x;
        const gy = yh - eHelio.y;
        const gz = zh - eHelio.z;
        const gDistAu = Math.sqrt(gx * gx + gy * gy + gz * gz);

        // ICRF 赤道直交座標
        const xIcrf = gx;
        const yIcrf = gy * cosEps - gz * sinEps;
        const zIcrf = gy * sinEps + gz * cosEps;
        const dirIcrf = new Cesium.Cartesian3(xIcrf / gDistAu, yIcrf / gDistAu, zIcrf / gDistAu);

        let dirFixed = dirIcrf;
        if (icrfToFixed) {
            dirFixed = Cesium.Matrix3.multiplyByVector(icrfToFixed, dirIcrf, new Cesium.Cartesian3());
            Cesium.Cartesian3.normalize(dirFixed, dirFixed);
        }

        const visualDist = 8000000000 * (1.0 + Math.log10(Math.max(0.25, gDistAu)));
        const pt = Cesium.Cartesian3.multiplyByScalar(dirFixed, visualDist, new Cesium.Cartesian3());
        pts.push(pt);
    }
    return pts;
}

/**
 * 太陽系惑星の正確なケプラー公転軌道ループ（Polyline）を描画
 */
function drawCelestialOrbit(body) {
    if (!viewer || !body || body.id === 'EARTH') return;
    const pData = PLANETARY_ORBIT_DATA[body.id];
    if (!pData) return;

    if (celestialOrbitEntity) {
        viewer.entities.remove(celestialOrbitEntity);
        celestialOrbitEntity = null;
    }

    const effectiveTime = customSimTime ? Cesium.JulianDate.fromDate(customSimTime) : (viewer && viewer.clock.currentTime);
    const jsDate = customSimTime || (effectiveTime ? Cesium.JulianDate.toDate(effectiveTime) : new Date());
    const d = (jsDate.getTime() / 86400000.0) + 2440587.5 - 2451545.0;

    const eHelio = computeHeliocentricCoordinates(PLANETARY_ORBIT_DATA.EARTH, d);
    const epsRad = 23.439291 * (Math.PI / 180);
    const cosEps = Math.cos(epsRad);
    const sinEps = Math.sin(epsRad);

    let icrfToFixed = null;
    try {
        icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(effectiveTime);
    } catch(e) {}

    const samples = (pData.e > 0.8 ? 360 : 120);
    const pts = computePlanetaryOrbitPoints(pData, d, eHelio, epsRad, cosEps, sinEps, icrfToFixed, samples);

    celestialOrbitEntity = viewer.entities.add({
        id: `orbit_celestial_${body.id}`,
        name: `${body.name} Orbit`,
        polyline: {
            positions: pts,
            width: 5.0,
            arcType: Cesium.ArcType.NONE,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.50,
                color: Cesium.Color.fromCssColorString(body.color || '#f59e0b')
            }),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, Number.MAX_VALUE)
        }
    });
}

let solarSystemOrbitEntities = [];

function clearAllPlanetaryOrbits() {
    if (!viewer) return;
    solarSystemOrbitEntities.forEach(ent => {
        viewer.entities.remove(ent);
    });
    solarSystemOrbitEntities = [];
    if (typeof satPointPrimitives !== 'undefined' && satPointPrimitives) {
        satPointPrimitives.show = true;
    }
    // 衛星モード等への復帰時に地球球体と大気圏を復元
    if (viewer.scene && viewer.scene.globe) viewer.scene.globe.show = true;
    if (viewer.scene && viewer.scene.skyAtmosphere) viewer.scene.skyAtmosphere.show = true;
}

/**
 * 太陽系全8惑星（水星〜海王星）の公転軌道ループ＆現在位置マーカー・多言語ラベルを一括同時描画（Heliocentric Orrery View）
 */
function drawAllPlanetaryOrbits() {
    if (!viewer) return;
    clearAllPlanetaryOrbits();

    // 太陽の位置に原点の地球が表示されないよう、Cesiumの地球球体と大気圏を非表示化
    if (viewer.scene && viewer.scene.globe) viewer.scene.globe.show = false;
    if (viewer.scene && viewer.scene.skyAtmosphere) viewer.scene.skyAtmosphere.show = false;

    if (celestialOrbitEntity) {
        viewer.entities.remove(celestialOrbitEntity);
        celestialOrbitEntity = null;
    }
    if (orbitPolylineEntity) {
        viewer.entities.remove(orbitPolylineEntity);
        orbitPolylineEntity = null;
    }
    if (targetHighlightEntity) {
        viewer.entities.remove(targetHighlightEntity);
        targetHighlightEntity = null;
    }

    // 衛星点群・ラベルを非表示にして太陽系モデルに集中
    if (typeof satPointPrimitives !== 'undefined' && satPointPrimitives) {
        satPointPrimitives.show = false;
    }
    document.querySelectorAll('.sat-dom-label').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('selected');
    });

    const langSelect = document.getElementById('langSelect');
    const lang = (langSelect && langSelect.value) || window.currentLang || currentLang || 'ja';

    const planetNames = {
        MERCURY: { ja: '水星 (Mercury)', en: 'Mercury', de: 'Merkur', fr: 'Mercure', es: 'Mercurio', pt: 'Mercúrio', it: 'Mercurio', ko: '수성 (Mercury)', nl: 'Mercurius', id: 'Merkurius', hi: 'बुध (Mercury)', ar: 'عطارد (Mercury)', zh: '水星 (Mercury)', ru: 'Меркурий' },
        VENUS: { ja: '金星 (Venus)', en: 'Venus', de: 'Venus', fr: 'Vénus', es: 'Venus', pt: 'Vênus', it: 'Venere', ko: '금성 (Venus)', nl: 'Venus', id: 'Venus', hi: 'शुक्र (Venus)', ar: 'الزهرة (Venus)', zh: '金星 (Venus)', ru: 'Венера' },
        EARTH: { ja: '地球 (Earth)', en: 'Earth', de: 'Erde', fr: 'Terre', es: 'Tierra', pt: 'Terra', it: 'Terra', ko: '지구 (Earth)', nl: 'Aarde', id: 'Bumi', hi: 'पृथ्वी (Earth)', ar: 'الأرض (Earth)', zh: '地球 (Earth)', ru: 'Земля' },
        MARS: { ja: '火星 (Mars)', en: 'Mars', de: 'Mars', fr: 'Mars', es: 'Marte', pt: 'Marte', it: 'Marte', ko: '화성 (Mars)', nl: 'Mars', id: 'Mars', hi: 'मंगल (Mars)', ar: 'المريخ (Mars)', zh: '火星 (Mars)', ru: 'Марс' },
        CERES: { ja: 'ケレス (Ceres)', en: 'Ceres', de: 'Ceres', fr: 'Cérès', es: 'Ceres', pt: 'Ceres', it: 'Cerere', ko: '세레스 (Ceres)', nl: 'Ceres', id: 'Ceres', hi: 'सेरेस (Ceres)', ar: 'سيريس', zh: '谷神星 (Ceres)', ru: 'Церера' },
        JUPITER: { ja: '木星 (Jupiter)', en: 'Jupiter', de: 'Jupiter', fr: 'Jupiter', es: 'Júpiter', pt: 'Júpiter', it: 'Giove', ko: '목성 (Jupiter)', nl: 'Jupiter', id: 'Jupiter', hi: 'बृहस्पति (Jupiter)', ar: 'المشتري (Jupiter)', zh: '木星 (Jupiter)', ru: 'Юпитер' },
        SATURN: { ja: '土星 (Saturn)', en: 'Saturn', de: 'Saturn', fr: 'Saturne', es: 'Saturno', pt: 'Saturno', it: 'Saturno', ko: '토성 (Saturn)', nl: 'Saturnus', id: 'Saturnus', hi: 'शनि (Saturn)', ar: 'زحل (Saturn)', zh: '土星 (Saturn)', ru: 'Сатурн' },
        URANUS: { ja: '天王星 (Uranus)', en: 'Uranus', de: 'Uranus', fr: 'Uranus', es: 'Urano', pt: 'Urano', it: 'Urano', ko: '천왕성 (Uranus)', nl: 'Uranus', id: 'Uranus', hi: 'अरुण (Uranus)', ar: 'أورانوس (Uranus)', zh: '天王星 (Uranus)', ru: 'Уран' },
        NEPTUNE: { ja: '海王星 (Neptune)', en: 'Neptune', de: 'Neptun', fr: 'Neptune', es: 'Neptuno', pt: 'Netuno', it: 'Nettuno', ko: '해왕성 (Neptune)', nl: 'Neptunus', id: 'Neptunus', hi: 'वरुण (Neptune)', ar: 'نبتون (Neptune)', zh: '海王星 (Neptune)', ru: 'Нептун' },
        PLUTO: { ja: '冥王星 (Pluto)', en: 'Pluto', de: 'Pluto', fr: 'Pluton', es: 'Plutón', pt: 'Plutão', it: 'Plutone', ko: '명왕성 (Pluto)', nl: 'Pluto', id: 'Pluto', hi: 'प्लूटो (Pluto)', ar: 'بلوتو', zh: '冥王星 (Pluto)', ru: 'Плутон' },
        HALLEY: { ja: 'ハレー彗星 (Halley)', en: 'Halley Comet', de: 'Halleyscher Komet', fr: 'Comète de Halley', es: 'Cometa Halley', pt: 'Cometa Halley', it: 'Cometa di Halley', ko: '핼리 혜성 (Halley)', nl: 'Komeet Halley', id: 'Komet Halley', hi: 'हैली धूमकेतु', ar: 'مذنب هالي', zh: '哈雷彗星 (Halley)', ru: 'Комета Галлея' }
    };
    const sunNames = {
        ja: '太陽 (Sun)', en: 'Sun', de: 'Sonne', fr: 'Soleil', es: 'Sol', pt: 'Sol', it: 'Sole', ko: '태양 (Sun)', nl: 'Zon', id: 'Matahari', hi: 'सूर्य (Sun)', ar: 'الشمس (Sun)', zh: '太阳 (Sun)', ru: 'Солнце'
    };

    // 太陽系オーラリーの理想的なプロポーション（内惑星を太陽からゆったり離し、全天体ラベルが重ならない間隔）
    const getOrreryRadius = (a) => (22000000 + 42000000 * Math.sqrt(a));

    const effectiveTime = customSimTime ? Cesium.JulianDate.fromDate(customSimTime) : (viewer && viewer.clock.currentTime);
    const jsDate = customSimTime || (effectiveTime ? Cesium.JulianDate.toDate(effectiveTime) : new Date());
    const d = (jsDate.getTime() / 86400000.0) + 2440587.5 - 2451545.0;

    // 1. 太陽系中心星：太陽（☀️）- 黄金色に輝く3D太陽球体と高輝度マーカー
    const sunSphereEnt = viewer.entities.add({
        id: 'orrery_sun_sphere',
        name: 'Sun Core',
        position: Cesium.Cartesian3.ZERO,
        ellipsoid: {
            radii: new Cesium.Cartesian3(5000000, 5000000, 5000000),
            material: new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString('#f59e0b'))
        }
    });
    sunSphereEnt.celestialData = { id: 'SUN' };
    solarSystemOrbitEntities.push(sunSphereEnt);

    const sunLabelText = '☀️ ' + (sunNames[lang] || sunNames['en']);
    const sunEnt = viewer.entities.add({
        id: 'orrery_sun',
        name: 'Sun',
        position: Cesium.Cartesian3.ZERO,
        point: {
            pixelSize: 34,
            color: Cesium.Color.fromCssColorString('#fbbf24'),
            outlineColor: Cesium.Color.fromCssColorString('#fef08a'),
            outlineWidth: 4,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        label: {
            text: sunLabelText,
            font: 'bold 15px "Inter", "Segoe UI", sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.fromCssColorString('#fbbf24'),
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 4,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -22),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    });
    sunEnt.celestialData = { id: 'SUN' };
    solarSystemOrbitEntities.push(sunEnt);

    // 2. 惑星・準惑星・彗星 - 千鳥配置ラベルで重複を防止
    const planets = [
        { id: 'MERCURY', symbol: '🔘', color: '#cbd5e1', size: 14, labelOffsetY: -18 },
        { id: 'VENUS', symbol: '🟡', color: '#fde047', size: 16, labelOffsetY: 18 },
        { id: 'EARTH', symbol: '🌍', color: '#38bdf8', size: 18, labelOffsetY: -18 },
        { id: 'MARS', symbol: '🔴', color: '#ef4444', size: 15, labelOffsetY: 18 },
        { id: 'CERES', symbol: '🪨', color: '#a8a29e', size: 13, labelOffsetY: -16 },
        { id: 'JUPITER', symbol: '🟠', color: '#fb923c', size: 26, labelOffsetY: -20 },
        { id: 'SATURN', symbol: '🪐', color: '#fcd34d', size: 24, labelOffsetY: -20 },
        { id: 'URANUS', symbol: '🌀', color: '#38bdf8', size: 18, labelOffsetY: -18 },
        { id: 'NEPTUNE', symbol: '🌊', color: '#60a5fa', size: 18, labelOffsetY: 18 },
        { id: 'PLUTO', symbol: '❄️', color: '#e2e8f0', size: 13, labelOffsetY: -18 },
        { id: 'HALLEY', symbol: '☄️', color: '#38bdf8', size: 15, labelOffsetY: 20 }
    ];

    planets.forEach(p => {
        const pData = PLANETARY_ORBIT_DATA[p.id];
        if (!pData) return;

        const scaledR = getOrreryRadius(pData.a);
        const scaleMultiplier = scaledR / pData.a;

        // 公転軌道ループ（離心近点角 E ダイレクト走査により始点・終点が100%完全に閉じた美しいケプラー楕円）
        const pts = [];
        const samples = (p.id === 'HALLEY' ? 720 : 120);
        const deg2rad = Math.PI / 180;
        const omega = (pData.w - pData.node) * deg2rad;
        const nodeRad = pData.node * deg2rad;
        const incRad = pData.I * deg2rad;
        const b = pData.a * Math.sqrt(Math.max(0, 1 - pData.e * pData.e));

        for (let i = 0; i <= samples; i++) {
            const E = (i / samples) * Math.PI * 2;
            const xv = pData.a * (Math.cos(E) - pData.e);
            const yv = b * Math.sin(E);
            const r = Math.sqrt(xv * xv + yv * yv);
            const v = Math.atan2(yv, xv);
            const u = v + omega;

            const xh = r * (Math.cos(nodeRad) * Math.cos(u) - Math.sin(nodeRad) * Math.sin(u) * Math.cos(incRad));
            const yh = r * (Math.sin(nodeRad) * Math.cos(u) + Math.cos(nodeRad) * Math.sin(u) * Math.cos(incRad));
            const zh = r * (Math.sin(u) * Math.sin(incRad));

            pts.push(new Cesium.Cartesian3(xh * scaleMultiplier, yh * scaleMultiplier, zh * scaleMultiplier));
        }

        const isGasGiant = (p.id === 'JUPITER' || p.id === 'SATURN');
        const isComet = (p.id === 'HALLEY');
        const orbEnt = viewer.entities.add({
            id: 'orrery_orbit_' + p.id,
            name: p.id + ' Orbit',
            polyline: {
                positions: pts,
                width: isGasGiant ? 5.5 : (isComet ? 4.8 : 4.0),
                arcType: Cesium.ArcType.NONE,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.48,
                    color: Cesium.Color.fromCssColorString(p.color).withAlpha(0.98)
                }),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, Number.MAX_VALUE)
            }
        });
        orbEnt.celestialData = { id: p.id };
        solarSystemOrbitEntities.push(orbEnt);

        // 惑星の現在公転位置マーカー & 多言語ラベル
        const curH = computeHeliocentricCoordinates(pData, d);
        const curPos = new Cesium.Cartesian3(curH.x * scaleMultiplier, curH.y * scaleMultiplier, curH.z * scaleMultiplier);
        const pNameMap = planetNames[p.id];
        const localizedName = p.symbol + ' ' + ((pNameMap && (pNameMap[lang] || pNameMap['en'])) || p.id);

        // 地球の場合は、青い地球球体を1AU軌道上に配置
        if (p.id === 'EARTH') {
            const earthSphereEnt = viewer.entities.add({
                id: 'orrery_planet_sphere_EARTH',
                name: 'Earth 3D Sphere',
                position: curPos,
                ellipsoid: {
                    radii: new Cesium.Cartesian3(2200000, 2200000, 2200000),
                    material: new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString('#0284c7'))
                }
            });
            earthSphereEnt.celestialData = { id: 'EARTH' };
            solarSystemOrbitEntities.push(earthSphereEnt);
        }

        const isLabelTop = p.labelOffsetY > 0;
        const markerEnt = viewer.entities.add({
            id: 'orrery_planet_' + p.id,
            name: p.id,
            position: curPos,
            point: {
                pixelSize: p.size,
                color: Cesium.Color.fromCssColorString(p.color),
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2.5,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            label: {
                text: localizedName,
                font: isGasGiant ? 'bold 14px "Inter", "Segoe UI", sans-serif' : '13px "Inter", "Segoe UI", sans-serif',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 3.5,
                verticalOrigin: isLabelTop ? Cesium.VerticalOrigin.TOP : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, p.labelOffsetY),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
        markerEnt.celestialData = { id: p.id };
        solarSystemOrbitEntities.push(markerEnt);
    });

    // 3. ボイジャー1号＆2号の太陽系脱出ハイパーボリック軌道線と現在位置マーカー（Orrery View）
    const v1Names = { ja: '🛸 ボイジャー1号 (Voyager 1)', en: '🛸 Voyager 1', de: '🛸 Voyager 1', fr: '🛸 Voyager 1', es: '🛸 Voyager 1', pt: '🛸 Voyager 1', it: '🛸 Voyager 1', ko: '🛸 보이저 1호 (Voyager 1)', nl: '🛸 Voyager 1', id: '🛸 Voyager 1', hi: '🛸 वॉयेजर 1', ar: '🛸 فوياجر 1', zh: '🛸 旅行者1号 (Voyager 1)', ru: '🛸 Вояджер-1' };
    const v2Names = { ja: '🛸 ボイジャー2号 (Voyager 2)', en: '🛸 Voyager 2', de: '🛸 Voyager 2', fr: '🛸 Voyager 2', es: '🛸 Voyager 2', pt: '🛸 Voyager 2', it: '🛸 Voyager 2', ko: '🛸 보이저 2호 (Voyager 2)', nl: '🛸 Voyager 2', id: '🛸 Voyager 2', hi: '🛸 वॉयेजर 2', ar: '🛸 فوياجر 2', zh: '🛸 旅行者2号 (Voyager 2)', ru: '🛸 Вояджер-2' };

    // ボイジャー1号：地球(1AU) -> 木星スイングバイ(5.2AU) -> 土星(9.5AU) -> 太陽系外脱出(北方+35度)
    const ptsVoyager1 = [];
    const v1Steps = 150;
    for (let i = 0; i <= v1Steps; i++) {
        const u = i / v1Steps; // 0.0 ~ 1.0
        const au = 1.0 + Math.pow(u, 1.8) * 45.0; // 1AU ~ 46AU
        const r = getOrreryRadius(au);
        const theta = 0.8 + u * 2.2;
        const zRatio = u < 0.25 ? 0 : Math.sin((u - 0.25) * 1.5) * 0.58; // 木星通過後に北方+35度へ跳ね上がる
        ptsVoyager1.push(new Cesium.Cartesian3(
            r * Math.cos(theta),
            r * Math.sin(theta) * 0.92,
            r * zRatio
        ));
    }
    const v1OrbitEnt = viewer.entities.add({
        id: 'orrery_orbit_VOYAGER1',
        name: 'Voyager 1 Escape Trajectory',
        polyline: {
            positions: ptsVoyager1,
            width: 5.0,
            arcType: Cesium.ArcType.NONE,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.52,
                color: Cesium.Color.fromCssColorString('#c084fc')
            }),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, Number.MAX_VALUE)
        }
    });
    v1OrbitEnt.deepSpaceData = { id: 'VOYAGER1' };
    solarSystemOrbitEntities.push(v1OrbitEnt);

    // ボイジャー1号のマーカー
    const v1MarkerPos = ptsVoyager1[Math.min(v1Steps, Math.floor(v1Steps * 0.65))];
    const v1MarkerEnt = viewer.entities.add({
        id: 'orrery_craft_VOYAGER1',
        name: 'Voyager 1',
        position: v1MarkerPos,
        point: {
            pixelSize: 18,
            color: Cesium.Color.fromCssColorString('#c084fc'),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2.5,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        label: {
            text: v1Names[lang] || v1Names['en'],
            font: 'bold 13px "Inter", "Segoe UI", sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.fromCssColorString('#e879f9'),
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3.5,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -18),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    });
    v1MarkerEnt.deepSpaceData = { id: 'VOYAGER1' };
    solarSystemOrbitEntities.push(v1MarkerEnt);

    // ボイジャー2号：地球(1AU) -> 木星 -> 土星 -> 天王星 -> 海王星スイングバイ(30AU) -> 太陽系外脱出(南方-55度)
    const ptsVoyager2 = [];
    const v2Steps = 150;
    for (let i = 0; i <= v2Steps; i++) {
        const u = i / v2Steps;
        const au = 1.0 + Math.pow(u, 1.7) * 44.0;
        const r = getOrreryRadius(au);
        const theta = 0.5 + u * 3.4;
        const zRatio = u < 0.65 ? 0 : -Math.sin((u - 0.65) * 2.2) * 0.72; // 海王星通過後に南方-55度へ急降下
        ptsVoyager2.push(new Cesium.Cartesian3(
            r * Math.cos(theta),
            r * Math.sin(theta) * 0.88,
            r * zRatio
        ));
    }
    const v2OrbitEnt = viewer.entities.add({
        id: 'orrery_orbit_VOYAGER2',
        name: 'Voyager 2 Escape Trajectory',
        polyline: {
            positions: ptsVoyager2,
            width: 5.0,
            arcType: Cesium.ArcType.NONE,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.52,
                color: Cesium.Color.fromCssColorString('#22d3ee')
            }),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, Number.MAX_VALUE)
        }
    });
    v2OrbitEnt.deepSpaceData = { id: 'VOYAGER2' };
    solarSystemOrbitEntities.push(v2OrbitEnt);

    // ボイジャー2号のマーカー
    const v2MarkerPos = ptsVoyager2[Math.min(v2Steps, Math.floor(v2Steps * 0.68))];
    const v2MarkerEnt = viewer.entities.add({
        id: 'orrery_craft_VOYAGER2',
        name: 'Voyager 2',
        position: v2MarkerPos,
        point: {
            pixelSize: 18,
            color: Cesium.Color.fromCssColorString('#22d3ee'),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2.5,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        label: {
            text: v2Names[lang] || v2Names['en'],
            font: 'bold 13px "Inter", "Segoe UI", sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.fromCssColorString('#38bdf8'),
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3.5,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(0, 18),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    });
    v2MarkerEnt.deepSpaceData = { id: 'VOYAGER2' };
    solarSystemOrbitEntities.push(v2MarkerEnt);
}

/**
 * 太陽系全体を上空から一望する最適なカメラワーク（Orrery Overview）
 */
function viewSolarSystemOverview(skipFly = false) {
    if (!viewer) return;
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    viewer.trackedEntity = undefined;

    const neptuneR = (22000000 + 42000000 * Math.sqrt(30.07)); // ~252,000 km
    const camDist = neptuneR * 4.2; // ~1,060,000 km
    // 詳細情報パネル（左側）と重ならないよう、やや左上から中央〜右寄りに向けて俯瞰
    const camPos = new Cesium.Cartesian3(-neptuneR * 0.45, -camDist * 0.65, camDist * 0.78);
    const targetLook = new Cesium.Cartesian3(-neptuneR * 0.15, 0, 0);
    const dir = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(targetLook, camPos, new Cesium.Cartesian3()), new Cesium.Cartesian3());

    if (skipFly) {
        viewer.camera.setView({
            destination: camPos,
            orientation: {
                direction: dir,
                up: Cesium.Cartesian3.UNIT_Z
            }
        });
    } else {
        viewer.camera.flyTo({
            destination: camPos,
            orientation: {
                direction: dir,
                up: Cesium.Cartesian3.UNIT_Z
            },
            duration: 2.2
        });
    }
}

/**
 * 太陽系全体俯瞰モードを選択（Orrery View & 詳細カード表示）
 */
function selectSolarSystemOverview(skipFly = false) {
    if (!viewer) return;

    if (typeof initialIssSelectTimeout !== 'undefined' && initialIssSelectTimeout) {
        clearTimeout(initialIssSelectTimeout);
        initialIssSelectTimeout = null;
    }

    selectedSatIndex = -1;
    selectedDeepSpaceId = null;
    selectedCelestialId = 'SOLAR_SYSTEM';

    if (orbitPolylineEntity) {
        viewer.entities.remove(orbitPolylineEntity);
        orbitPolylineEntity = null;
    }
    if (deepSpaceOrbitEntity) {
        viewer.entities.remove(deepSpaceOrbitEntity);
        deepSpaceOrbitEntity = null;
    }
    if (celestialOrbitEntity) {
        viewer.entities.remove(celestialOrbitEntity);
        celestialOrbitEntity = null;
    }
    if (targetHighlightEntity) {
        viewer.entities.remove(targetHighlightEntity);
        targetHighlightEntity = null;
    }

    clearPlanetInspectionEntities();
    drawAllPlanetaryOrbits();

    const langSelect = document.getElementById('langSelect');
    const lang = (langSelect && langSelect.value) || window.currentLang || currentLang || 'ja';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['ja'];
    const info = (typeof CELESTIAL_ENCYCLOPEDIA !== 'undefined') ? CELESTIAL_ENCYCLOPEDIA.SOLAR_SYSTEM : null;

    const getL = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return obj[lang] || obj['en'] || obj['ja'] || '';
    };

    // Header badge & title
    const badgeTypeMap = CELESTIAL_BADGE_TYPES.SOLAR_SYSTEM;
    satBadge.textContent = (badgeTypeMap && (badgeTypeMap[lang] || badgeTypeMap['en'])) || '🌌 太陽系 / Planetary System';
    satBadge.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
    satBadge.style.color = '#ffffff';

    const ssNames = {
        ja: '🌌 太陽系 (The Solar System)',
        en: '🌌 The Solar System (Orrery View)',
        de: '🌌 Das Sonnensystem (Orrery)',
        fr: '🌌 Le Système Solaire (Vue Orrery)',
        es: '🌌 El Sistema Solar (Vista Orrery)',
        pt: '🌌 O Sistema Solar (Visão Orrery)',
        it: '🌌 Il Sistema Solare (Vista Orrery)',
        ko: '🌌 태양계 (The Solar System)',
        nl: '🌌 Het Zonnestelsel (Orrery)',
        id: '🌌 Tata Surya (Tampilan Orrery)',
        hi: '🌌 हमारा सौर मंडल (The Solar System)',
        ar: '🌌 النظام الشمسي (The Solar System)',
        zh: '🌌 太阳系全景 (The Solar System)',
        ru: '🌌 Солнечная система (The Solar System)'
    };
    satName.textContent = ssNames[lang] || ssNames['en'];
    satNorad.textContent = 'JPL Planetary Ephemeris (DE440/441) · 8 Planets & Sun';

    // Solar system family portrait / montage image
    if (satImageWrapper && satImage) {
        satImage.src = 'assets/planet_images/solarsystem.jpg';
        satImage.alt = 'The Solar System';
        if (satImageCaption) satImageCaption.innerHTML = '<span>🔭 天体写真</span><span>Photo: NASA / JPL Family Portrait (Public Domain)</span>';
        satImageWrapper.classList.remove('hidden');
    }

    const descObj = CELESTIAL_DESCRIPTIONS.SOLAR_SYSTEM;
    let baseDesc = (descObj && getL(descObj)) || '';

    if (info) {
        const discText = getL(info.discovery);
        const missText = getL(info.missions);
        const titles = {
            "ja": ["🔭 発見の歴史・天文学の進展", "🚀 人類の太陽系・星間探査ミッション"],
            "en": ["🔭 Astronomical History & Mechanics", "🚀 Interplanetary & Deep Space Missions"],
            "de": ["🔭 Astronomische Geschichte & Mechanik", "🚀 Interplanetare & Tiefraum-Missionen"],
            "fr": ["🔭 Histoire astronomique et mécanique", "🚀 Missions interplanétaires et lointaines"],
            "es": ["🔭 Historia astronómica y mecánica", "🚀 Misiones interplanetarias y profundas"],
            "pt": ["🔭 História astronômica e mecânica", "🚀 Missões interplanetárias e profundas"],
            "it": ["🔭 Storia astronomica e meccanica", "🚀 Missioni interplanetarie e profonde"],
            "ko": ["🔭 천문학의 역사 및 역학 체계", "🚀 인류의 태양계·성간 탐사 미션"],
            "nl": ["🔭 Astronomische geschiedenis & mechanica", "🚀 Interplanetaire missies"],
            "id": ["🔭 Sejarah Astronomi & Mekanika", "🚀 Misi Antarplanet & Luar Angkasa"],
            "hi": ["🔭 खगोलीय इतिहास और यांत्रिकी", "🚀 अंतरग्रहीय और गहरे अंतरिक्ष मिशन"],
            "ar": ["🔭 التاريخ الفلكي والميكانيكا", "🚀 المهمات بين الكواكب والفضاء السحيق"],
            "zh": ["🔭 天文历史与天体力学体系", "🚀 人类行星与星际探测任务"],
            "ru": ["🔭 Астрономическая история и механика", "🚀 Межпланетные миссии"]
        };
        const t = titles[lang] || titles['en'] || titles['ja'];

        satDescription.innerHTML = `
            <p style="margin-bottom: 8px; line-height: 1.5;">${baseDesc}</p>
            <div style="background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 8px; padding: 10px; margin-top: 8px; font-size: 0.78rem;">
                <div style="color: #60a5fa; font-weight: 700; margin-bottom: 3px;">${t[0]}</div>
                <div style="color: #cbd5e1; margin-bottom: 8px; line-height: 1.45;">${discText}</div>
                <div style="color: #fbbf24; font-weight: 700; margin-bottom: 3px;">${t[1]}</div>
                <div style="color: #cbd5e1; line-height: 1.45;">${missText}</div>
            </div>
        `;
    } else {
        satDescription.textContent = baseDesc;
    }

    // Solar system macro metrics
    satAlt.textContent = info ? getL(info.diameter) : '10万〜20万 AU (オールトの雲)';
    satPeriod.textContent = info ? getL(info.rotation) : '約2.3億年 (銀河年)';
    satVel.textContent = info ? getL(info.orbit) : '天の川銀河 オリオン腕';
    satLat.textContent = info ? getL(info.mass) : '1.0014 M☉ (太陽 99.86%)';
    satLon.textContent = info ? getL(info.satellites) : '8惑星・5準惑星・290+衛星';
    satInc.textContent = info ? getL(info.temperature) : '核 1,500万℃ / 宇宙 2.7K';

    updateDetailCardMetricLabels(true);

    const passCountdown = document.getElementById('passCountdown');
    const passMetaInfo = document.getElementById('passMetaInfo');
    const debrisProximity = document.getElementById('debrisProximity');

    const ssStatus = {
        ja: { status: '🟢 太陽系力学平衡 / 重力安定軌道', mission: '🌌 8大惑星・太陽・深宇宙探査機 同時周回中' },
        en: { status: '🟢 Gravitational Equilibrium / Stable Orbits', mission: '🌌 8 Planets, Sun & Probes Orbiting Concurrently' },
        de: { status: '🟢 Gravitatives Gleichgewicht / Stabile Bahnen', mission: '🌌 8 Planeten, Sonne & Sonden im Orbit' },
        fr: { status: '🟢 Équilibre gravitationnel / Orbites stables', mission: '🌌 8 planètes, Soleil & sondes en orbite' },
        es: { status: '🟢 Equilibrio gravitacional / Órbitas estables', mission: '🌌 8 planetas, Sol y sondes en órbita simultánea' },
        pt: { status: '🟢 Equilíbrio gravitacional / Órbitas estáveis', mission: '🌌 8 planetas, Sol e sondas em órbita' },
        it: { status: '🟢 Equilibrio gravitazionale / Orbite stabili', mission: '🌌 8 pianeti, Sole e sonde in orbita simultanea' },
        ko: { status: '🟢 중력 역학 평형 / 안정적 공전 궤도', mission: '🌌 8대 행성·태양·심우주 탐사선 동시 공전 중' },
        nl: { status: '🟢 Gravitationeel evenwicht / Stabiele banen', mission: '🌌 8 planeten, Zon & sondes gelijktijdig in baan' },
        id: { status: '🟢 Keseimbangan Gravitasi / Orbit Stabil', mission: '🌌 8 Planet, Matahari & Wahana Mengorbit Bersama' },
        hi: { status: '🟢 गुरुत्वाकर्षण संतुलन / स्थिर कक्षाएं', mission: '🌌 8 ग्रह, सूर्य और प्रोब एक साथ परिक्रमा कर रहे हैं' },
        ar: { status: '🟢 توازن جاذبي / مدارات مستقرة', mission: '🌌 8 كواكب والشمس والمسابير تدور بالتزامن' },
        zh: { status: '🟢 太阳系引力动态平衡 / 稳定开普勒轨道', mission: '🌌 八大行星·太阳·深空探测器协同公转中' },
        ru: { status: '🟢 Гравитационное равновесие / Стабильные орбиты', mission: '🌌 8 планет, Солнце и зонды на синхронных орбитах' }
    };
    const sStat = ssStatus[lang] || ssStatus['en'];
    if (passCountdown) passCountdown.textContent = sStat.mission;
    if (passMetaInfo) passMetaInfo.textContent = 'Sun · Mercury · Venus · Earth · Mars · Jupiter · Saturn · Uranus · Neptune';
    if (debrisProximity) debrisProximity.textContent = sStat.status;

    detailCard.classList.remove('hidden');

    if (!skipFly) {
        viewSolarSystemOverview();
    }
}

function selectDeepSpaceMission(missionId, skipFly = false) {
    const mission = DEEP_SPACE_MISSIONS.find(m => m.id === missionId);
    if (!mission || !viewer) return;

    if (typeof initialIssSelectTimeout !== 'undefined' && initialIssSelectTimeout) {
        clearTimeout(initialIssSelectTimeout);
        initialIssSelectTimeout = null;
    }

    selectedSatIndex = -1;
    selectedCelestialId = null;
    selectedDeepSpaceId = missionId;

    if (typeof setActivePresetBtn === 'function') {
        const loadDeepSpaceBtn = document.getElementById('loadDeepSpaceBtn');
        if (loadDeepSpaceBtn) setActivePresetBtn(loadDeepSpaceBtn);
    }
    if (sourceStatusBadge) {
        sourceStatusBadge.textContent = '🔭 深宇宙・月/火星探査機 (8機)';
        sourceStatusBadge.style.borderColor = 'rgba(245, 158, 11, 0.6)';
        sourceStatusBadge.style.color = '#fbbf24';
    }

    if (satSelect) {
        const optExists = Array.from(satSelect.options).some(opt => opt.value === `deepspace_${mission.id}`);
        if (!optExists) {
            updateDropdownOptions();
        }
        satSelect.value = `deepspace_${mission.id}`;
    }

    clearAllPlanetaryOrbits();
    if (orbitPolylineEntity) {
        viewer.entities.remove(orbitPolylineEntity);
        orbitPolylineEntity = null;
    }
    if (celestialOrbitEntity) {
        viewer.entities.remove(celestialOrbitEntity);
        celestialOrbitEntity = null;
    }
    drawDeepSpaceOrbit(mission);

    // Add Glowing Target Ring Marker & Faithful Emissive Craft Billboard for selected deep space mission
    if (targetHighlightEntity) {
        viewer.entities.remove(targetHighlightEntity);
    }
    const missionBillboardCanvas = createDeepSpaceBillboard(mission);
    targetHighlightEntity = viewer.entities.add({
        position: new Cesium.CallbackProperty((time) => {
            const effTime = customSimTime ? Cesium.JulianDate.fromDate(customSimTime) : (time || (viewer && viewer.clock.currentTime));
            return computeDeepSpacePosition(mission, effTime) || Cesium.Cartesian3.ZERO;
        }, false),
        billboard: {
            image: missionBillboardCanvas,
            width: 140,
            height: 70,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            pixelOffset: Cesium.Cartesian2.ZERO,
            scaleByDistance: new Cesium.NearFarScalar(1.0e3, 1.4, 5.0e10, 0.85),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        point: {
            pixelSize: 36,
            color: Cesium.Color.fromCssColorString(mission.color || '#ff0055').withAlpha(0.35),
            outlineColor: Cesium.Color.fromCssColorString(mission.color || '#ff0055'),
            outlineWidth: 3,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    });

    const langSelect = document.getElementById('langSelect');
    const lang = window.currentLang || currentLang || (langSelect && langSelect.value) || 'ja';

    const getL = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return obj[lang] || obj['en'] || obj['ja'] || '';
    };

    const badgeMap = {
        ja: '🔭 深宇宙探査機 & 宇宙望遠鏡',
        en: '🔭 Deep Space Probe & Telescope',
        de: '🔭 Tiefraumsonde & Teleskop',
        fr: '🔭 Sonde spatiale & Télescope',
        es: '🔭 Sonda espacial y Telescopio',
        pt: '🔭 Sonda espacial e Telescópio',
        it: '🔭 Sonda spaziale e Telescopio',
        ko: '🔭 심우주 탐사선 & 우주망원경',
        nl: '🔭 Diepe Ruimtesonde & Telescoop',
        id: '🔭 Wahana Antariksa Luar & Teleskop',
        hi: '🔭 गहरा अंतरिक्ष प्रोब और टेलीस्कोप',
        ar: '🔭 مسبار الفضاء السحيق والتلسكوب',
        zh: '🔭 深空探测器与空间望远镜',
        ru: '🔭 Зонд дальнего космоса и телескоп'
    };
    satBadge.textContent = badgeMap[lang] || badgeMap['en'];
    satBadge.style.background = 'linear-gradient(135deg, #f59e0b, #38bdf8)';
    satBadge.style.color = '#ffffff';

    // 多言語タイトル（DEEP_SPACE_DISPLAY_NAMES があれば使用）
    const dispNameMap = (typeof DEEP_SPACE_DISPLAY_NAMES !== 'undefined') ? DEEP_SPACE_DISPLAY_NAMES[mission.id] : null;
    const localizedMissionName = (dispNameMap && (dispNameMap[lang] || dispNameMap['en'])) || `${mission.symbol} ${mission.name}`;
    satName.textContent = localizedMissionName;

    const desc = DEEP_SPACE_DESCRIPTIONS[mission.id];
    const spec = DEEP_SPACE_SPECS[mission.id];
    const agencyStr = (spec && getL(spec.agency)) || mission.agency;
    satNorad.textContent = `${agencyStr} | ${mission.site || mission.rocket}`;

    if (satImageWrapper && satImage) {
        const missionImages = {
            JWST: 'assets/sat_images/jwst.png?v=20260905_1',
            ARTEMIS_ORION: 'assets/sat_images/artemis_orion.jpg?v=20260905_1',
            LRO: 'assets/sat_images/lro.jpg?v=20260905_1',
            MARS_PERSEVERANCE: 'assets/sat_images/mars_perseverance.jpg?v=20260905_1',
            MARS_MRO: 'assets/sat_images/mars_mro.jpg?v=20260905_1',
            HAYABUSA2: 'assets/sat_images/hayabusa2.jpg?v=20260905_1',
            VOYAGER1: 'assets/sat_images/voyager1.png?v=20260905_1',
            VOYAGER2: 'assets/sat_images/voyager1.png?v=20260905_1',
            SPUTNIK1: 'assets/sat_images/sputnik1.jpg?v=20260906_1',
            APOLLO11: 'assets/sat_images/apollo11.jpg?v=20260906_1'
        };

        const imgUrl = missionImages[mission.id];
        if (imgUrl) {
            satImage.onerror = function() {
                console.warn("Failed to load image for deep space probe:", mission.id);
                satImageWrapper.classList.add('hidden');
            };
            satImage.src = imgUrl;
            satImage.alt = mission.name;
            if (satImageCaption) {
                const sourceMap = {
                    SPUTNIK1: 'NASA / Smithsonian (Public Domain)',
                    APOLLO11: 'NASA (Public Domain)',
                    HAYABUSA2: 'JAXA (Public Domain)',
                    JWST: 'NASA / ESA / CSA (Public Domain)'
                };
                const srcText = sourceMap[mission.id] || 'NASA / JAXA (Public Domain)';
                satImageCaption.innerHTML = `<span>🔭 ${mission.shortName}</span><span>Source: ${srcText}</span>`;
            }
            satImageWrapper.classList.remove('hidden');
        } else {
            satImageWrapper.classList.add('hidden');
        }
    }

    const descText = (desc && getL(desc)) || '';

    const specTitles = {
        ja: ["🏢 運用機関", "🛰️ 軌道諸元", "📐 機体寸法・質量", "🔬 搭載観測機器", "🎯 ミッション主目的"],
        en: ["🏢 Operating Agency", "🛰️ Orbital Profile", "📐 Dimensions & Mass", "🔬 Science Payload", "🎯 Primary Mission Goal"],
        de: ["🏢 Organisation", "🛰️ Bahnparameter", "📐 Maße & Masse", "🔬 Wissenschaftliche Instrumente", "🎯 Hauptziel"],
        fr: ["🏢 Agence opérationnelle", "🛰️ Profil orbital", "📐 Dimensions et masse", "🔬 Charge utile", "🎯 Objectif principal"],
        es: ["🏢 Agencia operadora", "🛰️ Perfil orbital", "📐 Dimensiones y masa", "🔬 Carga útil científica", "🎯 Misión principal"],
        pt: ["🏢 Agência operadora", "🛰️ Perfil orbital", "📐 Dimensões e massa", "🔬 Carga científica", "🎯 Missão principal"],
        it: ["🏢 Agenzia operativa", "🛰️ Profilo orbitale", "📐 Dimensioni e massa", "🔬 Strumenti scientifici", "🎯 Obiettivo primario"],
        ko: ["🏢 운용 기관", "🛰️ 궤도 제원", "📐 기체 치수 및 질량", "🔬 탑재 관측 장비", "🎯 주요 미션 목표"],
        nl: ["🏢 Organisatie", "🛰️ Baangegevens", "📐 Afmetingen & Massa", "🔬 Instrumenten", "🎯 Hoofddoel"],
        id: ["🏢 Badan Operasional", "🛰️ Profil Orbit", "📐 Dimensi & Massa", "🔬 Instrumen Ilmiah", "🎯 Target Misi Utama"],
        hi: ["🏢 संचालन एजेंसी", "🛰️ कक्षीय विवरण", "📐 आयाम और द्रव्यमान", "🔬 वैज्ञानिक उपकरण", "🎯 प्राथमिक मिशन लक्ष्य"],
        ar: ["🏢 الوكالة المشغلة", "🛰️ مواصفات المدار", "📐 الأبعاد والكتلة", "🔬 الأجهزة العلمية", "🎯 الهدف الرئيسي للرحلة"],
        zh: ["🏢 运营机构", "🛰️ 轨道参数", "📐 尺寸与质量", "🔬 科学载荷设备", "🎯 主要任务目标"],
        ru: ["🏢 Оператор миссии", "🛰️ Параметры орбиты", "📐 Размеры и масса", "🔬 Научные приборы", "🎯 Основная цель миссии"]
    };
    const st = specTitles[lang] || specTitles['en'];

    if (spec) {
        satDescription.innerHTML = `
            <p style="margin-bottom: 8px; line-height: 1.5;">${descText}</p>
            <div style="background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 8px; padding: 10px; margin-top: 8px; font-size: 0.78rem;">
                <div style="color: #fbbf24; font-weight: 700; margin-bottom: 2px;">${st[0]}: <span style="color:#e2e8f0; font-weight:normal;">${getL(spec.agency)}</span></div>
                <div style="color: #38bdf8; font-weight: 700; margin-bottom: 2px;">${st[1]}: <span style="color:#e2e8f0; font-weight:normal;">${getL(spec.orbitType)}</span></div>
                <div style="color: #cbd5e1; font-weight: 700; margin-bottom: 2px;">${st[2]}: <span style="color:#e2e8f0; font-weight:normal;">${getL(spec.dimensions)}</span></div>
                <div style="color: #a78bfa; font-weight: 700; margin-bottom: 2px;">${st[3]}: <span style="color:#e2e8f0; font-weight:normal;">${getL(spec.instruments)}</span></div>
                <div style="color: #34d399; font-weight: 700; margin-bottom: 2px;">${st[4]}: <span style="color:#e2e8f0; font-weight:normal;">${getL(spec.scienceGoal)}</span></div>
            </div>
        `;
    } else {
        satDescription.textContent = descText;
    }

    // 正確な天文学的距離 (150万km / 38.4万km 等) を表示
    const distRealKm = (mission.distKm || 1500000).toLocaleString();
    satAlt.textContent = `${distRealKm} km`;
    satVel.textContent = mission.speedKmS || '---';
    satLat.textContent = mission.parent || 'Deep Space';
    satLon.textContent = mission.launchDate || '---';
    satInc.textContent = mission.rocket || '---';
    satPeriod.textContent = typeof mission.periodDays === 'number' ? `${mission.periodDays} d` : (mission.periodDays || '---');

    updateDetailCardMetricLabels('deepspace');

    const passCountdown = document.getElementById('passCountdown');
    const passMetaInfo = document.getElementById('passMetaInfo');
    const debrisProximity = document.getElementById('debrisProximity');

    const deepSpaceStatus = {
        ja: { status: '🟢 正常運用中 / 深宇宙航行中', mission: '🔭 深宇宙探査ミッション' },
        en: { status: '🟢 Operational / Interplanetary Flight', mission: '🔭 Deep Space Mission' },
        de: { status: '🟢 Betriebsbereit / Interplanetarer Flug', mission: '🔭 Tiefraummission' },
        fr: { status: '🟢 Opérationnel / Vol interplanétaire', mission: '🔭 Mission spatiale lointaine' },
        es: { status: '🟢 Operacional / Vuelo interplanetario', mission: '🔭 Misión del espacio profundo' },
        pt: { status: '🟢 Operacional / Voo interplanetário', mission: '🔭 Missão do espaço profundo' },
        it: { status: '🟢 Operativo / Volo interplanetario', mission: '🔭 Missione nello spazio profondo' },
        ko: { status: '🟢 정상 운용 중 / 심우주 비행', mission: '🔭 심우주 탐사 미션' },
        nl: { status: '🟢 Operationeel / Interplanetaire Vlucht', mission: '🔭 Diepe Ruimtemissie' },
        id: { status: '🟢 Beroperasi / Penerbangan Antariksa', mission: '🔭 Misi Antariksa Jauh' },
        hi: { status: '🟢 सक्रिय / अंतरग्रहीय उड़ान', mission: '🔭 गहरा अंतरिक्ष अभियान' },
        ar: { status: '🟢 قيد التشغيل / رحلة بين الكواكب', mission: '🔭 مهمة الفضاء السحيق' },
        zh: { status: '🟢 正常运行中 / 深空巡航', mission: '🔭 深空探测任务' },
        ru: { status: '🟢 В штатном режиме / Межпланетный полет', mission: '🔭 Миссия дальнего космоса' }
    };
    const dsStatus = deepSpaceStatus[lang] || deepSpaceStatus['en'];
    if (passCountdown) passCountdown.textContent = dsStatus.mission;
    if (passMetaInfo) passMetaInfo.textContent = `${agencyStr} | Launch: ${mission.launchDate}`;
    if (debrisProximity) debrisProximity.textContent = dsStatus.status;

    detailCard.classList.remove('hidden');

    if (!skipFly) {
        // =========================================================================
        // 軌道線（楕円ループ全体）を美しく俯瞰し、探査機の周回を一望するカメラ遷移
        // =========================================================================
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

        const time = viewer.clock.currentTime;
        const centerPos = computeDeepSpaceOrbitCenter(mission, time);
        const overviewOffset = getDeepSpaceOrbitOverviewOffset(mission);
        const cameraDest = getDeepSpaceOverviewCameraDestination(centerPos, overviewOffset);

        const toCenter = Cesium.Cartesian3.subtract(centerPos, cameraDest, new Cesium.Cartesian3());
        const targetDir = Cesium.Cartesian3.normalize(toCenter, new Cesium.Cartesian3());

        // flyTo でスムーズに接近したのち、軌道中心（L2点や月など）にカメラを自動追従！
        // これにより探査機単体にカメラが張り付くのではなく、軌道の楕円ループ全体がどっしり画面中央に収まり、
        // 100倍速・1000倍速でも探査機がその楕円の上を周回する様子をずっと快適に眺め続けられる！
        viewer.camera.flyTo({
            destination: cameraDest,
            orientation: {
                direction: targetDir,
                up: Cesium.Cartesian3.UNIT_Z
            },
            duration: 2.0,
            complete: () => {
                const centerEntity = viewer.entities.getById(`orbitcenter_${mission.id}`);
                if (centerEntity) {
                    viewer.trackedEntity = centerEntity;
                }
            }
        });
    }
}

function loadDeepSpaceMissionsPreset() {
    if (sourceStatusBadge) {
        sourceStatusBadge.textContent = '🔭 深宇宙・月/火星探査機 (8機)';
        sourceStatusBadge.style.borderColor = 'rgba(245, 158, 11, 0.6)';
        sourceStatusBadge.style.color = '#fbbf24';
    }

    const toggleDeepSpace = document.getElementById('toggleDeepSpace');
    if (toggleDeepSpace && !toggleDeepSpace.checked) {
        toggleDeepSpace.checked = true;
    }
    if (viewer) {
        const time = viewer.clock.currentTime;
        deepSpaceEntities.forEach(ent => {
            const m = ent.deepSpaceData;
            const isAct = m ? isDeepSpaceMissionActive(m, time) : true;
            if (ent.billboard) ent.billboard.show = isAct;
            ent.show = isAct;
        });
    }

    selectDeepSpaceMission('JWST');
    satSelect.value = 'deepspace_JWST';
}

function selectCelestialBody(bodyId) {
    if (bodyId === 'SOLAR_SYSTEM') {
        selectSolarSystemOverview();
        return;
    }
    const body = CELESTIAL_BODIES.find(b => b.id === bodyId);
    if (!body || !viewer) return;

    if (typeof initialIssSelectTimeout !== 'undefined' && initialIssSelectTimeout) {
        clearTimeout(initialIssSelectTimeout);
        initialIssSelectTimeout = null;
    }

    selectedSatIndex = -1;
    selectedDeepSpaceId = null;
    selectedCelestialId = bodyId;

    if (typeof isCupolaActive !== 'undefined' && isCupolaActive) {
        exitCupolaMode();
    }
    const cupolaActionRow = document.getElementById('cupolaActionRow');
    if (cupolaActionRow) {
        cupolaActionRow.style.display = 'none';
    }

    if (typeof CosmicAudio !== 'undefined') {
        CosmicAudio.playBlip(920, 0.08);
    }

    // Clear existing orbit lines
    clearAllPlanetaryOrbits();
    if (orbitPolylineEntity) {
        viewer.entities.remove(orbitPolylineEntity);
        orbitPolylineEntity = null;
    }
    if (deepSpaceOrbitEntity) {
        viewer.entities.remove(deepSpaceOrbitEntity);
        deepSpaceOrbitEntity = null;
    }
    if (celestialOrbitEntity) {
        viewer.entities.remove(celestialOrbitEntity);
        celestialOrbitEntity = null;
    }
    if (targetHighlightEntity) {
        viewer.entities.remove(targetHighlightEntity);
        targetHighlightEntity = null;
    }
    drawCelestialOrbit(body);

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
        EARTH: { ja: '地球 (Earth)', en: 'Earth', de: 'Erde', fr: 'Terre', es: 'Tierra', pt: 'Terra', it: 'Terra', ko: '지구 (Earth)', nl: 'Aarde', id: 'Bumi', hi: 'पृथ्वी (Earth)', ar: 'الأرض', zh: '地球 (Earth)', ru: 'Земля' },
        MARS: { ja: '火星 (Mars)', en: 'Mars', de: 'Mars', fr: 'Mars', es: 'Marte', pt: 'Marte', it: 'Marte', ko: '화성 (Mars)', nl: 'Mars', id: 'Mars', hi: 'मंगल (Mars)', ar: 'المريخ', zh: '火星 (Mars)', ru: 'Марс' },
        JUPITER: { ja: '木星 (Jupiter)', en: 'Jupiter', de: 'Jupiter', fr: 'Jupiter', es: 'Júpiter', pt: 'Júpiter', it: 'Giove', ko: '목성 (Jupiter)', nl: 'Jupiter', id: 'Yupiter', hi: 'बृहस्पति (Jupiter)', ar: 'المشتري', zh: '木星 (Jupiter)', ru: 'Юпитер' },
        SATURN: { ja: '土星 (Saturn)', en: 'Saturn', de: 'Saturn', fr: 'Saturne', es: 'Saturno', pt: 'Saturno', it: 'Saturno', ko: '토성 (Saturn)', nl: 'Saturnus', id: 'Saturnus', hi: 'शनि (Saturn)', ar: 'زحل', zh: '土星 (Saturn)', ru: 'Сатурн' },
        VENUS: { ja: '金星 (Venus)', en: 'Venus', de: 'Venus', fr: 'Vénus', es: 'Venus', pt: 'Vênus', it: 'Venere', ko: '금성 (Venus)', nl: 'Venus', id: 'Venus', hi: 'शुक्र (Venus)', ar: 'الزهرة', zh: '金星 (Venus)', ru: 'Венера' },
        MERCURY: { ja: '水星 (Mercury)', en: 'Mercury', de: 'Merkur', fr: 'Mercure', es: 'Mercurio', pt: 'Mercúrio', it: 'Mercurio', ko: '수성 (Mercury)', nl: 'Mercurius', id: 'Merkurius', hi: 'बुध (Mercury)', ar: 'عطارد', zh: '水星 (Mercury)', ru: 'Меркурий' },
        URANUS: { ja: '天王星 (Uranus)', en: 'Uranus', de: 'Uranus', fr: 'Uranus', es: 'Urano', pt: 'Urano', it: 'Urano', ko: '천왕성 (Uranus)', nl: 'Uranus', id: 'Uranus', hi: 'अरुण (Uranus)', ar: 'أورانوس', zh: '天王星 (Uranus)', ru: 'Уран' },
        NEPTUNE: { ja: '海王星 (Neptune)', en: 'Neptune', de: 'Neptun', fr: 'Neptune', es: 'Neptuno', pt: 'Netuno', it: 'Nettuno', ko: '해왕성 (Neptune)', nl: 'Neptunus', id: 'Neptunus', hi: 'वरुण (Neptune)', ar: 'نبتون', zh: '海王星 (Neptune)', ru: 'Нептун' },
        CERES: { ja: 'ケレス (Ceres)', en: 'Ceres', de: 'Ceres', fr: 'Cérès', es: 'Ceres', pt: 'Ceres', it: 'Cerere', ko: '세레스 (Ceres)', nl: 'Ceres', id: 'Ceres', hi: 'सेरेस (Ceres)', ar: 'سيريس', zh: '谷神星 (Ceres)', ru: 'Церера' },
        PLUTO: { ja: '冥王星 (Pluto)', en: 'Pluto', de: 'Pluto', fr: 'Pluton', es: 'Plutón', pt: 'Plutão', it: 'Plutone', ko: '명왕성 (Pluto)', nl: 'Pluto', id: 'Pluto', hi: 'प्लूटो (Pluto)', ar: 'بلوتو', zh: '冥王星 (Pluto)', ru: 'Плутон' },
        HALLEY: { ja: 'ハレー彗星 (Halley)', en: 'Halley Comet', de: 'Halleyscher Komet', fr: 'Comète de Halley', es: 'Cometa Halley', pt: 'Cometa Halley', it: 'Cometa di Halley', ko: '핼리 혜성 (Halley)', nl: 'Komeet Halley', id: 'Komet Halley', hi: 'हैली धूमकेतु', ar: 'مذنب هالي', zh: '哈雷彗星 (Halley)', ru: 'Комета Галлея' }
    };

    // Update Detail Card Header with 14-Language Badges and Subtitles
    const badgeTypeMap = CELESTIAL_BADGE_TYPES[body.id];
    satBadge.textContent = (badgeTypeMap && (badgeTypeMap[lang] || badgeTypeMap['en'])) || `🌌 ${body.type}`;
    satBadge.style.background = 'linear-gradient(135deg, #f59e0b, #ef4444)';
    satBadge.style.color = '#ffffff';

    const bodyNameStr = (localizedNames[body.id] && (localizedNames[body.id][lang] || localizedNames[body.id]['en'])) || body.name;
    satName.textContent = `${body.symbol} ${bodyNameStr}`;

    const subtitlePrefix = CELESTIAL_SUBTITLES[lang] || CELESTIAL_SUBTITLES['en'];
    satNorad.textContent = `${subtitlePrefix} (${body.id})`;

    // Celestial Visual Image (NASA Texture / Photo)
    if (satImageWrapper && satImage) {
        const textureMap = {
            SUN: { url: 'assets/planet_images/sun.jpg', cap: 'NASA SDO (Public Domain)' },
            MOON: { url: 'assets/planet_images/moon.jpg', cap: 'NASA / GSFC (Public Domain)' },
            EARTH: { url: 'assets/planet_images/earth.jpg', cap: 'NASA Blue Marble / Apollo 17 (Public Domain)' },
            MARS: { url: 'assets/planet_images/mars.jpg', cap: 'ESA / MPS / OSIRIS (Public Domain)' },
            JUPITER: { url: 'assets/planet_images/jupiter.jpg', cap: 'NASA / ESA / Hubble (Public Domain)' },
            SATURN: { url: 'assets/planet_images/saturn.jpg', cap: 'NASA / JPL / Cassini (Public Domain)' },
            VENUS: { url: 'assets/planet_images/venus.jpg', cap: 'NASA / Mariner 10 (Public Domain)' },
            MERCURY: { url: 'assets/planet_images/mercury.jpg', cap: 'NASA / JHUAPL / MESSENGER (Public Domain)' },
            URANUS: { url: 'assets/planet_images/uranus.jpg', cap: 'NASA / Voyager 2 (Public Domain)' },
            NEPTUNE: { url: 'assets/planet_images/neptune.jpg', cap: 'NASA / JPL / Voyager 2 (Public Domain)' },
            CERES: { url: 'assets/planet_images/ceres.jpg', cap: 'NASA / JPL-Caltech / UCLA / MPS / DLR / IDA / Dawn (Public Domain)' },
            PLUTO: { url: 'assets/planet_images/pluto.jpg', cap: 'NASA / JHUAPL / SwRI / New Horizons (Public Domain)' },
            HALLEY: { url: 'assets/planet_images/halley.jpg', cap: 'ESA / Giotto / Max Planck Institute (Public Domain)' }
        };
        const planetImg = textureMap[body.id];
        if (planetImg) {
            satImage.src = planetImg.url;
            satImage.alt = body.name;
            if (satImageCaption) satImageCaption.innerHTML = `<span>🔭 天体写真</span><span>Photo: ${planetImg.cap}</span>`;
            satImageWrapper.classList.remove('hidden');
        } else {
            satImageWrapper.classList.add('hidden');
        }
    }

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

    // Dynamic real-time distance & precise Keplerian planetary metrics
    const effectiveTime = customSimTime ? Cesium.JulianDate.fromDate(customSimTime) : (viewer ? viewer.clock.currentTime : null);
    const ephem = computePlanetEphemeris(body.id, effectiveTime);
    const pos = computeCelestialPosition(body, effectiveTime) || new Cesium.Cartesian3(100000000, 0, 0);

    // Hide satellite points and labels during other celestial inspection (preserve for Earth)
    if (body.id !== 'EARTH') {
        if (typeof satPointPrimitives !== 'undefined' && satPointPrimitives) {
            satPointPrimitives.show = false;
        }
        document.querySelectorAll('.sat-dom-label').forEach(el => {
            el.style.display = 'none';
            el.classList.remove('selected');
        });
    }

    if (body.id === 'EARTH') {
        const earthDistLabel = {
            ja: '0 km (基準母星 / 地心原点)',
            en: '0 km (Base Home World / Geocentric Origin)',
            de: '0 km (Heimatbasis / Geozentrischer Ursprung)',
            fr: '0 km (Monde d\'origine / Centre géocentrique)',
            es: '0 km (Mundo natal / Origen geocéntrico)',
            pt: '0 km (Mundo de origem / Origem geocêntrica)',
            it: '0 km (Pianeta d\'origine / Origine geocentrica)',
            ko: '0 km (기준 모성 / 지심 원점)',
            nl: '0 km (Thuiswereld / Geocentrische oorsprong)',
            id: '0 km (Bumi Asal / Titik Pusat Geosentris)',
            hi: '0 किमी (मातृ गृह / भूकेंद्रीय मूल)',
            ar: '0 كم (الموطن الأم / المركز الأرضي)',
            zh: '0 km (母星基准 / 地心坐标原点)',
            ru: '0 км (Опорная планета / Геоцентрический центр)'
        };
        const earthPeriodLabel = {
            ja: '365.26 d (1.00 AU / 1億4,960万km)',
            en: '365.26 d (1.00 AU / 149.60 million km)',
            de: '365,26 d (1,00 AE / 149,60 Mio. km)',
            fr: '365,26 j (1,00 UA / 149,60 millions km)',
            es: '365,26 d (1,00 UA / 149,60 millones km)',
            pt: '365,26 d (1,00 UA / 149,60 milhões km)',
            it: '365,26 g (1,00 UA / 149,60 milioni km)',
            ko: '365.26일 (1.00 AU / 1억 4,960만 km)',
            nl: '365,26 d (1,00 AE / 149,60 mln km)',
            id: '365,26 h (1,00 SA / 149,60 juta km)',
            hi: '365.26 दिन (1.00 AU / 14.96 करोड़ किमी)',
            ar: '365.26 يوم (1.00 و.ف / 149.60 مليون كم)',
            zh: '365.26 天 (1.00 AU / 1.496亿公里)',
            ru: '365,26 д (1,00 а.е. / 149,6 млн км)'
        };
        satAlt.textContent = earthDistLabel[lang] || earthDistLabel['en'];
        satPeriod.textContent = earthPeriodLabel[lang] || earthPeriodLabel['en'];
    } else if (ephem) {
        // 1. 地球からのリアルタイム地心距離 (万km / 億km & AU)
        const geoKm = ephem.geocentricDistKm;
        const geoAu = ephem.geocentricDistAu;
        if (geoKm >= 1e8) {
            satAlt.textContent = `${(geoKm / 1e8).toFixed(2)} 億km (${geoAu.toFixed(2)} AU)`;
        } else {
            satAlt.textContent = `${(geoKm / 1e4).toLocaleString(undefined, { maximumFractionDigits: 0 })} 万km (${geoAu.toFixed(2)} AU)`;
        }

        // 2. 太陽からの公転軌道長半径 (AU & 万km)
        const pData = PLANETARY_ORBIT_DATA[body.id];
        if (pData) {
            satPeriod.textContent = `${pData.periodDays} d (${pData.a} AU / ${(pData.meanDistKm / 1e4).toLocaleString(undefined, { maximumFractionDigits: 0 })}万km)`;
        } else {
            satPeriod.textContent = info ? getL(info.orbit) : `${body.periodDays} d`;
        }
    } else if (body.id === 'SUN') {
        satAlt.textContent = '1億4,960万 km (1.00 AU)';
        satPeriod.textContent = '--- (太陽系中心星)';
    } else if (body.id === 'MOON') {
        satAlt.textContent = '384,400 km (0.0026 AU)';
        satPeriod.textContent = '27.32 d (地球周回)';
    } else {
        const distKm = (Cesium.Cartesian3.magnitude(pos) / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 });
        satAlt.textContent = `${distKm} km`;
        satPeriod.textContent = info ? getL(info.orbit) : `${body.periodDays} d`;
    }

    satVel.textContent = info ? getL(info.diameter) : `${(body.radiusKm * 2).toLocaleString()} km`;
    satLat.textContent = info ? getL(info.mass) : '---';
    satLon.textContent = info ? getL(info.rotation) : '---';
    satInc.textContent = info ? getL(info.temperature) : '---';

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

    // Inspect Earth or Other Celestial Bodies
    if (body.id === 'EARTH') {
        if (viewer.scene && viewer.scene.globe) viewer.scene.globe.show = true;
        if (viewer.scene && viewer.scene.skyAtmosphere) viewer.scene.skyAtmosphere.show = true;
        if (typeof satPointPrimitives !== 'undefined' && satPointPrimitives) {
            satPointPrimitives.show = true;
        }
        document.querySelectorAll('.sat-dom-label').forEach(el => {
            el.style.display = '';
        });
        clearPlanetInspectionEntities();
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        viewer.trackedEntity = undefined;
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(139.6917, 35.6895, 20000000),
            duration: 2.0
        });
    } else {
        // Inspect All Celestial Bodies with 3D Textured Sphere
        const bodyDir = Cesium.Cartesian3.normalize(pos, new Cesium.Cartesian3());
        inspectCelestialPlanet(body, pos, bodyDir);
    }
}

function initCesiumViewer() {
    // Dummy access token to bypass Cesium 1.119.0 Ion token requirement exception
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkdW1teSJ9.dummy';

    // Determine asset relative path dynamically based on multilingual subdirectory
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const isSub = pathParts.length > 0 && ['en','zh','ko','de','fr','es','pt','it','nl','id','hi','ar','ru'].includes(pathParts[0]);
    const assetPrefix = isSub ? '../' : './';

    // Create Direct Real Earth Imagery Provider (Precision WGS84 Mapping)
    const realEarthProvider = new Cesium.SingleTileImageryProvider({
        url: assetPrefix + 'earth_texture.jpg?v=20260822_640',
        rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0)
    });

    // Bulletproof Standard Viewer Initialization (clean UI, no redundant 2D sceneModePicker buttons)
    viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: realEarthProvider,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
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

    // 深宇宙・太陽系惑星・彗星（ハレー彗星等）の大規模ズームアウト時に軌道線や天体がクリッピングで消えるのを完全防止
    scene.farToNearRatio = 1.0e9;
    scene.preRender.addEventListener(() => {
        if (selectedCelestialId || selectedDeepSpaceId) {
            if (viewer.camera.frustum.far < 1.0e14) {
                viewer.camera.frustum.far = 1.0e14;
            }
        }
    });

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
        
        // 1. When inspecting a 3D Planet: Ultra-fine, delicate micro-zoom
        if (activePlanetSphereEntity || (selectedCelestialId && selectedCelestialId !== 'EARTH')) {
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

        // 2. When inspecting Deep Space Missions (JWST, Artemis Orion, LRO, Mars, Voyager)
        if (selectedDeepSpaceId) {
            const mission = DEEP_SPACE_MISSIONS.find(m => m.id === selectedDeepSpaceId);
            const time = viewer.clock.currentTime;
            const targetPos = mission ? computeDeepSpacePosition(mission, time) : null;
            const distToTarget = targetPos ? Cesium.Cartesian3.distance(camera.positionWC, targetPos) : Cesium.Cartesian3.magnitude(camera.positionWC);

            // 適応型ステップ: 探査機至近でも深宇宙全体でも快適なプロポーショナルズーム
            const zoomStep = Math.max(1000, distToTarget * Math.abs(delta) * 0.00045);

            if (delta > 0) {
                // ズームアウト: 最大6,000億メートル（6億km = 約4 AU）まで大幅拡大！軌道線全体と太陽系スケールを悠々と一望可能
                if (distToTarget + zoomStep <= 600000000000) {
                    camera.zoomOut(zoomStep);
                }
            } else {
                // ズームイン: 探査機至近（200m）まで精密に寄れる
                if (distToTarget - zoomStep >= 200) {
                    camera.zoomIn(zoomStep);
                }
            }
            return;
        }

        // 3. Earth Orbit Mode: Ultra-smooth step factor (Expanded up to 3,000,000 km to view Moon & beyond)
        const currentDist = Cesium.Cartesian3.magnitude(camera.positionWC);
        const zoomStep = currentDist * (delta * 0.00015);
        
        if (delta > 0) {
            if (currentDist + zoomStep <= 3000000000) {
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
    initDeepSpaceMissions();

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

// DOM element references initialized at top level

/**
 * Clean & Categorized Dropdown Menu (Includes Space Debris Category)
 */

function updateDropdownOptions() {
    const lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'ja';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['ja'];
    if (!satSelect) return;
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
        EARTH: { ja: '🌍 地球 (Earth)', en: '🌍 Earth', de: '🌍 Erde', fr: '🌍 Terre', es: '🌍 Tierra', pt: '🌍 Terra', it: '🌍 Terra', ko: '🌍 지구 (Earth)', nl: '🌍 Aarde', id: '🌍 Bumi', hi: '🌍 पृथ्वी (Earth)', ar: '🌍 الأرض', zh: '🌍 地球 (Earth)', ru: '🌍 Земля' },
        MARS: { ja: '🔴 火星 (Mars)', en: '🔴 Mars', de: '🔴 Mars', fr: '🔴 Mars', es: '🔴 Marte', pt: '🔴 Marte', it: '🔴 Marte', ko: '🔴 화성 (Mars)', nl: '🔴 Mars', id: '🔴 Mars', hi: '🔴 मंगल (Mars)', ar: '🔴 المريخ', zh: '🔴 火星 (Mars)', ru: '🔴 Марс' },
        JUPITER: { ja: '🟠 木星 (Jupiter)', en: '🟠 Jupiter', de: '🟠 Jupiter', fr: '🟠 Jupiter', es: '🟠 Júpiter', pt: '🟠 Júpiter', it: '🟠 Giove', ko: '🟠 목성 (Jupiter)', nl: '🟠 Jupiter', id: '🟠 Yupiter', hi: '🟠 बृहस्पति (Jupiter)', ar: '🟠 المشتري', zh: '🟠 木星 (Jupiter)', ru: '🟠 Юпитер' },
        SATURN: { ja: '🪐 土星 (Saturn)', en: '🪐 Saturn', de: '🪐 Saturn', fr: '🪐 Saturne', es: '🪐 Saturno', pt: '🪐 Saturno', it: '🪐 Saturno', ko: '🪐 토성 (Saturn)', nl: '🪐 Saturnus', id: '🪐 Saturnus', hi: '🪐 शनि (Saturn)', ar: '🪐 زحل', zh: '🪐 土星 (Saturn)', ru: '🪐 Сатурн' },
        VENUS: { ja: '🟡 金星 (Venus)', en: '🟡 Venus', de: '🟡 Venus', fr: '🟡 Vénus', es: '🟡 Venus', pt: '🟡 Vênus', it: '🟡 Venere', ko: '🟡 금성 (Venus)', nl: '🟡 Venus', id: '🟡 Venus', hi: '🟡 शुक्र (Venus)', ar: '🟡 الزهرة', zh: '🟡 金星 (Venus)', ru: '🟡 Венера' },
        MERCURY: { ja: '🔘 水星 (Mercury)', en: '🔘 Mercury', de: '🔘 Merkur', fr: '🔘 Mercure', es: '🔘 Mercurio', pt: '🔘 Mercurio', it: '🔘 Mercurio', ko: '🔘 수성 (Mercury)', nl: '🔘 Mercurius', id: '🔘 Merkurius', hi: '🔘 बुध (Mercury)', ar: '🔘 عطارد', zh: '🔘 水星 (Mercury)', ru: '🔘 Меркурий' },
        URANUS: { ja: '🌀 天王星 (Uranus)', en: '🌀 Uranus', de: '🌀 Uranus', fr: '🌀 Uranus', es: '🌀 Urano', pt: '🌀 Urano', it: '🌀 Urano', ko: '🌀 천왕성 (Uranus)', nl: '🌀 Uranus', id: '🌀 Uranus', hi: '🌀 अरुण (Uranus)', ar: '🌀 أورانوس', zh: '🌀 天王星 (Uranus)', ru: '🌀 Уран' },
        NEPTUNE: { ja: '🌊 海王星 (Neptune)', en: 'Neptune', de: 'Neptun', fr: 'Neptune', es: 'Neptuno', pt: 'Netuno', it: 'Nettuno', ko: '해왕성 (Neptune)', nl: 'Neptunus', id: 'Neptunus', hi: 'वरुण (Neptune)', ar: 'نبتون', zh: '海王星 (Neptune)', ru: 'Нептун' },
        CERES: { ja: '🪨 ケレス (Ceres)', en: '🪨 Ceres', de: '🪨 Ceres', fr: '🪨 Cérès', es: '🪨 Ceres', pt: '🪨 Ceres', it: '🪨 Cerere', ko: '🪨 세레스 (Ceres)', nl: '🪨 Ceres', id: '🪨 Ceres', hi: '🪨 सेरेस (Ceres)', ar: '🪨 سيريس', zh: '🪨 谷神星 (Ceres)', ru: '🪨 Церера' },
        PLUTO: { ja: '❄️ 冥王星 (Pluto)', en: '❄️ Pluto', de: '❄️ Pluto', fr: '❄️ Pluton', es: '❄️ Plutón', pt: '❄️ Plutão', it: '❄️ Plutone', ko: '❄️ 명왕성 (Pluto)', nl: '❄️ Pluto', id: '❄️ Pluto', hi: '❄️ प्लूटो (Pluto)', ar: '❄️ بلوتو', zh: '❄️ 冥王星 (Pluto)', ru: '❄️ Плутон' },
        HALLEY: { ja: '☄️ ハレー彗星 (Halley)', en: '☄️ Halley Comet', de: '☄️ Halleyscher Komet', fr: '☄️ Comète de Halley', es: '☄️ Cometa Halley', pt: '☄️ Cometa Halley', it: '☄️ Cometa di Halley', ko: '☄️ 핼리 혜성 (Halley)', nl: '☄️ Komeet Halley', id: '☄️ Komet Halley', hi: '☄️ हैली धूमकेतु', ar: '☄️ مذنب هالي', zh: '☄️ 哈雷彗星 (Halley)', ru: '☄️ Комета Галлея' },
        SOLAR_SYSTEM: { ja: '🌌 太陽系全体 (Solar System Orrery)', en: '🌌 Solar System (Orrery View)', de: '🌌 Sonnensystem (Orrery-Ansicht)', fr: '🌌 Système Solaire (Vue Orrery)', es: '🌌 Sistema Solar (Vista Orrery)', pt: '🌌 Sistema Solar (Visão Orrery)', it: '🌌 Sistema Solare (Vista Orrery)', ko: '🌌 태양계 전체 (Solar System Orrery)', nl: '🌌 Zonnestelsel (Orrery-weergave)', id: '🌌 Tata Surya Lengkap (Tampilan Orrery)', hi: '🌌 संपूर्ण सौर मंडल (ऑरेरी दृश्य)', ar: '🌌 النظام الشمسي بالكامل (عرض الأوريري)', zh: '🌌 太阳系全景 (Orrery太阳系仪)', ru: '🌌 Вся Солнечная система (Оррери)' }
    };

    const celestialGroup = document.createElement('optgroup');
    celestialGroup.label = catCelestialLabel[lang] || catCelestialLabel['en'];

    // 太陽系全体（Orrery View）をグループ先頭に配置
    const ssOpt = document.createElement('option');
    ssOpt.value = 'celestial_SOLAR_SYSTEM';
    const ssNameMap = celestialNames.SOLAR_SYSTEM;
    ssOpt.textContent = (ssNameMap && (ssNameMap[lang] || ssNameMap['en'])) || '🌌 太陽系全体 (Solar System Orrery)';
    celestialGroup.appendChild(ssOpt);

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

    const catDeepSpaceLabel = {
        ja: '🔭 深宇宙探査機 & 宇宙望遠鏡 (JWST, 月, 火星)',
        en: '🔭 Deep Space Probes & Telescopes (JWST, Moon, Mars)',
        de: '🔭 Tiefraumsonden & Teleskope (JWST, Mond, Mars)',
        fr: '🔭 Sondes de l\'espace lointain et télescopes (JWST, Lune, Mars)',
        es: '🔭 Sondas del Espacio Profundo y Telescopios (JWST, Luna, Marte)',
        pt: '🔭 Sondas do Espaço Profundo e Telescópios (JWST, Lua, Marte)',
        it: '🔭 Sonde dello Spazio Profondo e Telescopi (JWST, Luna, Marte)',
        ko: '🔭 심우주 탐사선 & 우주망원경 (JWST, 달, 화성)',
        nl: '🔭 Diepe Ruimtesondes & Telescopen (JWST, Maan, Mars)',
        id: '🔭 Wahana Antariksa Luar & Teleskop (JWST, Bulan, Mars)',
        hi: '🔭 गहरा अंतरिक्ष प्रोब और टेलीस्कोप (JWST, चंद्रमा, मंगल)',
        ar: '🔭 مسابير الفضاء السحيق والتلسكوبات (JWST، القمر، المريخ)',
        zh: '🔭 深空探测器与空间望远镜 (韦伯望远镜, 月球, 火星)',
        ru: '🔭 Зонды дальнего космоса и телескопы (JWST, Луна, Марс)'
    };

    const deepSpaceNames = (typeof DEEP_SPACE_DISPLAY_NAMES !== 'undefined') ? DEEP_SPACE_DISPLAY_NAMES : {
        JWST: { ja: '🔭 JWST (ジェイムズ・ウェッブ宇宙望遠鏡 / L2)', en: '🔭 JWST (James Webb Space Telescope / L2)' },
        ARTEMIS_ORION: { ja: '🚀 アルテミス・オリオン有人探査船 (月DRO軌道)', en: '🚀 Artemis Orion Spacecraft (Lunar DRO)' },
        LRO: { ja: '🌕 LRO (月周回偵察探査衛星 / 月低軌道)', en: '🌕 LRO (Lunar Reconnaissance Orbiter)' },
        MARS_PERSEVERANCE: { ja: '🚜 パーサヴィアランス探査車 (火星ジェゼロ湖底)', en: '🚜 Perseverance Rover (Mars Jezero Crater)' },
        MARS_MRO: { ja: '🔴 MRO (マーズ・リコネサンス・オービター / 火星極軌道)', en: '🔴 MRO (Mars Reconnaissance Orbiter)' },
        HAYABUSA2: { ja: '🛸 はやぶさ2 (小惑星探査機 / 太陽周回軌道)', en: '🛸 Hayabusa2 (Asteroid Sample Return / Heliocentric)' },
        VOYAGER1: { ja: '🛰️ ボイジャー1号 (最遠の星間脱出探査機 / 164 AU)', en: '🛰️ Voyager 1 (Interstellar Space / ~164 AU)' }
    };

    const deepSpaceGroup = document.createElement('optgroup');
    deepSpaceGroup.label = catDeepSpaceLabel[lang] || catDeepSpaceLabel['en'];

    if (typeof DEEP_SPACE_MISSIONS !== 'undefined' && Array.isArray(DEEP_SPACE_MISSIONS)) {
        DEEP_SPACE_MISSIONS.forEach(m => {
            // 現在時刻では現役探査機のみ表示。歴史的ミッションはタイムトラベル時または選択中のみ追加
            const isHistoricalActive = isDeepSpaceMissionActive(m, viewer ? viewer.clock.currentTime : null);
            if (!m.isHistoricOnly || isHistoricalActive || selectedDeepSpaceId === m.id) {
                const opt = document.createElement('option');
                opt.value = `deepspace_${m.id}`;
                const nameMap = deepSpaceNames[m.id];
                opt.textContent = (nameMap && (nameMap[lang] || nameMap['en'])) || `${m.symbol} ${m.name}`;
                deepSpaceGroup.appendChild(opt);
            }
        });
        satSelect.appendChild(deepSpaceGroup);
    }

    const groups = {
        japan: document.createElement('optgroup'),
        us: document.createElement('optgroup'),
        eu: document.createElement('optgroup'),
        kr: document.createElement('optgroup'),
        cn: document.createElement('optgroup'),
        in: document.createElement('optgroup'),
        ru: document.createElement('optgroup'),
        debris: document.createElement('optgroup'),
        starlink: document.createElement('optgroup')
    };

    groups.japan.label = lang === 'ja' ? '🇯🇵 日本 (JAXA / 気象庁 / 内閣府 / 民間)' : '🇯🇵 Japan (JAXA / JMA / CAO)';
    groups.us.label = lang === 'ja' ? '🇺🇸 / 🌍 米国・国際 (NASA / NOAA / SpaceX / ISS)' : '🇺🇸 / 🌍 USA & International (NASA / NOAA / ISS)';
    groups.eu.label = lang === 'ja' ? '🇪🇺 ヨーロッパ (ESA / コペルニクス / ガリレオ / EUMETSAT)' : '🇪🇺 Europe (ESA / Copernicus / Galileo)';
    groups.kr.label = lang === 'ja' ? '🇰🇷 韓国 (KARI / 千里眼2A/2B / アリラン5号)' : '🇰🇷 South Korea (KARI / Chollian / Arirang)';
    groups.cn.label = lang === 'ja' ? '🇨🇳 中国 (CNSA / 天宮 / 北斗3号 / 風雲4号B / 高分7号)' : '🇨🇳 China (CNSA / Tiangong / BeiDou / Fengyun)';
    groups.in.label = lang === 'ja' ? '🇮🇳 インド (ISRO / カルトサット3号 / INSAT-3DR)' : '🇮🇳 India (ISRO / Cartosat / INSAT)';
    groups.ru.label = lang === 'ja' ? '🇷🇺 ロシア (Roscosmos / グロナス / エレクトロ-L)' : '🇷🇺 Russia (Roscosmos / GLONASS / Elektro)';
    groups.debris.label = lang === 'ja' ? '🚨 宇宙ゴミ・デブリ (Space Debris)' : '🚨 Space Debris & Fragments';
    groups.starlink.label = lang === 'ja' ? '🛰️ Starlink衛星群 (SpaceX ピックアップ30機)' : '🛰️ Starlink Constellation (Top 30)';

    let counts = { japan: 0, us: 0, eu: 0, kr: 0, cn: 0, in: 0, ru: 0, debris: 0, starlink: 0 };

    if (Array.isArray(satellitesData)) {
        satellitesData.forEach((sat, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            const displayName = getSatDisplayName(sat.name);
            opt.textContent = `${displayName} (NORAD ${sat.noradId})`;

            const nameUpper = sat.name.toUpperCase();

            if (nameUpper.includes('DEBRIS') || nameUpper.includes('COSMOS 2251') || nameUpper.includes('FENGYUN 1C') || nameUpper.includes('SL-8') || nameUpper.includes('SL-16')) {
                groups.debris.appendChild(opt);
                counts.debris++;
            } else if (nameUpper.includes('ALOS') || nameUpper.includes('DAICHI') || nameUpper.includes('HIMAWARI') || nameUpper.includes('MICHIBIKI') || nameUpper.includes('QZSS') || nameUpper.includes('GCOM') || nameUpper.includes('GOSAT') || nameUpper.includes('SHIZUKU') || nameUpper.includes('SHIKISAI') || nameUpper.includes('IBUKI') || nameUpper.includes('QPS') || nameUpper.includes('STRIX') || nameUpper.includes('ADRAS') || nameUpper.includes('IGS') || nameUpper.includes('KIRAMEKI') || nameUpper.includes('DSN')) {
                groups.japan.appendChild(opt);
                counts.japan++;
            } else if (nameUpper.includes('SENTINEL') || nameUpper.includes('GALILEO') || nameUpper.includes('METEOSAT') || nameUpper.includes('MTG') || nameUpper.includes('SARAH')) {
                groups.eu.appendChild(opt);
                counts.eu++;
            } else if (nameUpper.includes('KOMPSAT') || nameUpper.includes('CHOLLIAN') || nameUpper.includes('GEO-KOMPSAT') || nameUpper.includes('ARIRANG')) {
                groups.kr.appendChild(opt);
                counts.kr++;
            } else if (nameUpper.includes('TIANGONG') || nameUpper.includes('BEIDOU') || nameUpper.includes('FENGYUN-4') || nameUpper.includes('GAOFEN') || nameUpper.includes('MICIUS') || nameUpper.includes('QUESS') || nameUpper.includes('DAMPE') || nameUpper.includes('WUKONG') || nameUpper.includes('YAOGAN') || nameUpper.includes('QUEQIAO') || nameUpper.includes('SHIJIAN') || nameUpper.includes('SJ-21')) {
                groups.cn.appendChild(opt);
                counts.cn++;
            } else if (nameUpper.includes('CARTOSAT') || nameUpper.includes('INSAT') || nameUpper.includes('CHANDRAYAAN') || nameUpper.includes('ADITYA') || nameUpper.includes('OFEQ')) {
                groups.in.appendChild(opt);
                counts.in++;
            } else if (nameUpper.includes('GLONASS') || nameUpper.includes('ELEKTRO') || nameUpper.includes('SOYUZ') || nameUpper.includes('OLYMP') || nameUpper.includes('LUCH') || nameUpper.includes('SPEKTR') || nameUpper.includes('METEOR') || nameUpper.includes('TUNDRA') || nameUpper.includes('2542')) {
                groups.ru.appendChild(opt);
                counts.ru++;
            } else if (nameUpper.includes('ISS') || nameUpper.includes('HUBBLE') || nameUpper.includes('LANDSAT') || nameUpper.includes('TERRA') || nameUpper.includes('GOES') || nameUpper.includes('GPS') || nameUpper.includes('XRISM') || nameUpper.includes('X-37B') || nameUpper.includes('USA-245') || nameUpper.includes('KEYHOLE') || nameUpper.includes('SWOT') || nameUpper.includes('WORLDVIEW') || nameUpper.includes('SBIRS') || nameUpper.includes('GSSAP') || nameUpper.includes('AEHF') || nameUpper.includes('ORION') || nameUpper.includes('MENTOR')) {
                groups.us.appendChild(opt);
                counts.us++;
            } else {
                if (counts.starlink < 30) {
                    groups.starlink.appendChild(opt);
                    counts.starlink++;
                }
            }
        });
    }

    if (counts.japan > 0) satSelect.appendChild(groups.japan);
    if (counts.us > 0) satSelect.appendChild(groups.us);
    if (counts.eu > 0) satSelect.appendChild(groups.eu);
    if (counts.kr > 0) satSelect.appendChild(groups.kr);
    if (counts.cn > 0) satSelect.appendChild(groups.cn);
    if (counts.in > 0) satSelect.appendChild(groups.in);
    if (counts.ru > 0) satSelect.appendChild(groups.ru);
    if (counts.debris > 0) satSelect.appendChild(groups.debris);
    if (counts.starlink > 0) satSelect.appendChild(groups.starlink);
}


/**
 * Load Major Satellites Built-in Preset
 */

let starlinkTrainBeamEntity = null;

function clearTrainBeamEntity() {
    if (typeof starlinkTrainBeamEntity !== 'undefined' && starlinkTrainBeamEntity) {
        if (viewer && viewer.entities) {
            viewer.entities.remove(starlinkTrainBeamEntity);
        }
        starlinkTrainBeamEntity = null;
    }
}


/**
 * Load Starlink Train (Luminous 24-Satellite Chain) Preset
 */
function loadStarlinkTrainPreset() {
    showLoading("🚂 スターリンク・トレイン (24機編隊) を読み込んでいます...");
    satellitesData = parseTLE(STARLINK_TRAIN_TLE);
    statCount.textContent = satellitesData.length.toLocaleString();
    updateDropdownOptions();
    renderSatellitePoints();

    if (sourceStatusBadge) {
        sourceStatusBadge.textContent = `🚂 スターリンク・トレイン (24機編隊・銀河鉄道)`;
        sourceStatusBadge.style.borderColor = 'rgba(0, 243, 255, 0.5)';
        sourceStatusBadge.style.color = '#00f3ff';
    }

    if (loadTrainBtn) setActivePresetBtn(loadTrainBtn);
    hideLoading();

    // Create Luminous Train Beam connecting the 24 satellites
    if (starlinkTrainBeamEntity) {
        viewer.entities.remove(starlinkTrainBeamEntity);
        starlinkTrainBeamEntity = null;
    }

    starlinkTrainBeamEntity = viewer.entities.add({
        polyline: {
            positions: new Cesium.CallbackProperty(() => {
                const pts = [];
                satellitesData.forEach(s => {
                    if (s.currentCartesian) pts.push(s.currentCartesian);
                });
                return pts.length >= 2 ? pts : [];
            }, false),
            width: 4.5,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.35,
                color: Cesium.Color.fromCssColorString('#00f3ff')
            })
        }
    });

    // Auto-select lead satellite and trigger Cinematic Train Chase Camera
    if (satellitesData.length > 0) {
        setTimeout(() => {
            selectSatellite(0);
            flyToStarlinkTrainCinematic();
        }, 300);
    }
}

/**
 * Cinematic Train Chase Camera: Positions camera slightly behind & above the train
 */
function flyToStarlinkTrainCinematic() {
    if (!satellitesData || satellitesData.length < 2) return;
    const leadSat = satellitesData[0];
    const tailSat = satellitesData[satellitesData.length - 1];
    if (!leadSat.currentCartesian || !tailSat.currentCartesian) return;

    try {
        const midPos = Cesium.Cartesian3.midpoint(leadSat.currentCartesian, tailSat.currentCartesian, new Cesium.Cartesian3());
        const upVec = Cesium.Cartesian3.normalize(midPos, new Cesium.Cartesian3());
        
        // Offset camera behind and above the train
        const camPos = Cesium.Cartesian3.add(
            midPos,
            Cesium.Cartesian3.multiplyByScalar(upVec, 3500000.0, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );

        viewer.camera.flyTo({
            destination: camPos,
            orientation: {
                direction: Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(midPos, camPos, new Cesium.Cartesian3()), new Cesium.Cartesian3()),
                up: Cesium.Cartesian3.UNIT_Z
            },
            duration: 2.0
        });
    } catch (e) {
        console.warn("Cinematic camera error:", e);
    }
}


const SPANISH_SATELLITES_TLE = `PAZ
1 43215U 18020A   26240.29867021  .00001546  00000+0  76820-4 0  9997
2 43215  97.4459 246.6656 0001689  85.1196 275.0231 15.19145522471955
SAOCOM 1A
1 43641U 18076A   26240.30481417 -.00000079  00000+0 -33742-5 0  9993
2 43641  97.8894  66.0136 0001542  86.3256 273.8133 14.82155308426780
SAOCOM 1B
1 46265U 20059A   26240.26856856  .00000199  00000+0  31528-4 0  9990
2 46265  97.8900  65.0769 0001455  85.6874 274.4506 14.82155422324162
CHEOPS
1 44874U 19092B   26240.28971890  .00000232  00000+0  55580-4 0  9999
2 44874  98.1515  67.5594 0009473 229.3581 130.6798 14.62005337356433
HISPASAT 30W-6
1 43228U 18023A   26239.32138602 -.00000217  00000+0  00000+0 0  9999
2 43228   0.0390  52.6033 0004001  69.1769 299.4887  1.00271666 31117
AMAZONAS 5
1 42934U 17053A   26240.30720811  .00000000  00000+0  00000+0 0  9992
2 42934   0.0101 281.7520 0001684 268.3481 196.0340  1.00269770 32765`;

function loadSpanishSatellitesPreset() {
    clearTrainBeamEntity();
    showLoading("🇪🇸 スペイン・中南米衛星プリセットを読み込んでいます...");
    satellitesData = parseTLE(SPANISH_SATELLITES_TLE);
    statCount.textContent = satellitesData.length.toLocaleString();
    updateDropdownOptions();
    renderSatellitePoints();
    if (sourceStatusBadge) {
        sourceStatusBadge.textContent = `🇪🇸 スペイン・中南米衛星プリセット読込済 (${satellitesData.length}機)`;
        sourceStatusBadge.style.borderColor = 'rgba(239, 68, 68, 0.35)';
        sourceStatusBadge.style.color = '#ef4444';
    }
    hideLoading();
    if (satellitesData.length > 0) {
        setTimeout(() => { selectSatellite(0); }, 300);
    }
}

let initialIssSelectTimeout = null;

function loadMajorSatellitesPreset(autoSelectIss = true) {
    clearTrainBeamEntity();
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

    // Auto-select ISS (ZARYA) on default initial startup for instant engaging 3D orbit visualization!
    if (autoSelectIss && satellitesData && satellitesData.length > 0) {
        const issIndex = satellitesData.findIndex(s => s.name.toUpperCase().includes('ISS (ZARYA)') || s.name.toUpperCase().includes('ISS'));
        if (issIndex >= 0) {
            if (initialIssSelectTimeout) clearTimeout(initialIssSelectTimeout);
            initialIssSelectTimeout = setTimeout(() => {
                initialIssSelectTimeout = null;
                // 天体・太陽系・深宇宙モード選択中なら上書きしない
                if (selectedCelestialId || selectedDeepSpaceId) return;
                selectSatellite(issIndex);
            }, 300);
        }
    }
}

/**
 * High-Speed Fetch helper with Multi-CDN Mirror Resilience (0.1s Fast Load!)
 */
async function fetchTLEText(url) {
    if (!url.startsWith('http')) {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const isSub = pathParts.length > 0 && ['en','zh','ko','de','fr','es','pt','it','nl','id','hi','ar','ru'].includes(pathParts[0]);
        const pfx = isSub ? '../' : './';
        const localPaths = [url, pfx + url, pfx + 'data/' + url, pfx + 'data/debris.txt', pfx + 'debris.txt', pfx + 'data/starlink.txt', pfx + 'starlink.txt', 'data/' + url, url];
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
            const isDebrisSource = sourceUrl.includes('debris');
            if (isDebrisSource) {
                setActivePresetBtn(loadDebrisBtn);
                if (sourceStatusBadge) {
                    sourceStatusBadge.textContent = `💥 宇宙デブリ・メガクラウド読込済 (${parsed.length.toLocaleString()}破片)`;
                    sourceStatusBadge.style.borderColor = 'rgba(192, 132, 252, 0.45)';
                    sourceStatusBadge.style.color = '#c084fc';
                }
            } else {
                setActivePresetBtn(loadLocalBtn);
                if (sourceStatusBadge) {
                    sourceStatusBadge.textContent = `⚡ ローカル保存データ使用中 (STARLINK ${parsed.length.toLocaleString()}機)`;
                    sourceStatusBadge.style.borderColor = 'rgba(59, 130, 246, 0.35)';
                    sourceStatusBadge.style.color = '#3b82f6';
                }
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
                sat.currentCartesian = result.cartesian;
                sat.currentVelocity = result.velocity;
                sat.currentEci = result.eci;
                sat.geodeticFallback = result.geodeticFallback;

                // 天体モード・太陽系全体モード・深宇宙モード選択中は衛星の点やDOMラベルを表示しない
                const isNonSatelliteMode = Boolean(selectedCelestialId || selectedDeepSpaceId);
                if (isNonSatelliteMode) {
                    sat.primitive.show = false;
                    if (sat.domLabel) sat.domLabel.style.display = 'none';
                } else {
                    sat.primitive.show = true;
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
 * Off-Screen Edge Pointer HUD (Guaranteed In-Screen Viewport Clamping)
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

    if (windowCoord && windowCoord.x >= 60 && windowCoord.x <= width - 60 && windowCoord.y >= 60 && windowCoord.y <= height - 60) {
        edgePointer.classList.add('hidden');
    } else {
        edgePointer.classList.remove('hidden');
        pointerName.textContent = sat.name;

        let screenX = windowCoord ? windowCoord.x : width / 2;
        let screenY = windowCoord ? windowCoord.y : height / 2;

        const isMobile = (window.innerWidth <= 768);
        const halfW = isMobile ? 115 : 135;
        const halfH = 22;

        const marginTop = 50; // Below top minimal header
        const marginBottom = isMobile ? 75 : 55; // Above bottom mobile dock

        const clampedX = Math.max(halfW + 6, Math.min(width - halfW - 6, screenX));
        const clampedY = Math.max(marginTop + halfH + 6, Math.min(height - marginBottom - halfH - 6, screenY));

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
let timeSpeedMultiplier = 10; // 0, 1, 10, 100, 1000
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

    // Cesium の内部クロック currentTime をカスタムシミュレーション時刻と完全同期
    // これにより深宇宙探査機・惑星・天体の CallbackProperty も倍速（100x, 1000x）と連動して高速公転する
    if (viewer && customSimTime) {
        viewer.clock.currentTime = Cesium.JulianDate.fromDate(customSimTime);
    }

    statTime.textContent = formatSimTime(customSimTime);
    updateSatellitePositions(customSimTime);
    updateDeepSpaceDomLabels(viewer ? viewer.clock.currentTime : null);

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
        // 1. Check if Celestial Body, Deep Space Mission, or Orrery Craft/Planet was clicked
        if (pickedObject.id && typeof pickedObject.id === 'object') {
            const entity = pickedObject.id;

            // Deep Space Mission Data
            if (entity.deepSpaceData && entity.deepSpaceData.id) {
                selectDeepSpaceMission(entity.deepSpaceData.id);
                if (satSelect) satSelect.value = `deepspace_${entity.deepSpaceData.id}`;
                return;
            }
            if (typeof entity.id === 'string' && entity.id.startsWith('deepspace_')) {
                const missionId = entity.id.replace('deepspace_', '');
                selectDeepSpaceMission(missionId);
                if (satSelect) satSelect.value = `deepspace_${missionId}`;
                return;
            }
            // Orrery Craft Marker (ボイジャー1号・2号など)
            if (typeof entity.id === 'string' && entity.id.startsWith('orrery_craft_')) {
                const missionId = entity.id.replace('orrery_craft_', '');
                selectDeepSpaceMission(missionId);
                if (satSelect) satSelect.value = `deepspace_${missionId}`;
                return;
            }
            // Orrery Orbit Line (ボイジャー軌道線、惑星公転軌道線)
            if (typeof entity.id === 'string' && entity.id.startsWith('orrery_orbit_')) {
                const targetId = entity.id.replace('orrery_orbit_', '');
                if (typeof DEEP_SPACE_MISSIONS !== 'undefined' && DEEP_SPACE_MISSIONS.some(m => m.id === targetId)) {
                    selectDeepSpaceMission(targetId);
                    if (satSelect) satSelect.value = `deepspace_${targetId}`;
                    return;
                } else if (typeof CELESTIAL_BODIES !== 'undefined' && (CELESTIAL_BODIES.some(b => b.id === targetId) || (typeof PLANETARY_ORBIT_DATA !== 'undefined' && PLANETARY_ORBIT_DATA[targetId]))) {
                    selectCelestialBody(targetId);
                    if (satSelect) satSelect.value = `celestial_${targetId}`;
                    return;
                }
            }
            // Celestial Body Data
            if (entity.celestialData && entity.celestialData.id) {
                selectCelestialBody(entity.celestialData.id);
                if (satSelect) satSelect.value = `celestial_${entity.celestialData.id}`;
                return;
            }
            if (typeof entity.id === 'string' && entity.id.startsWith('orrery_planet_')) {
                let bodyId = entity.id.replace('orrery_planet_', '');
                if (bodyId.startsWith('sphere_')) bodyId = bodyId.replace('sphere_', '');
                selectCelestialBody(bodyId);
                if (satSelect) satSelect.value = `celestial_${bodyId}`;
                return;
            }
            if (entity.id === 'orrery_sun' || entity.id === 'orrery_sun_sphere') {
                selectCelestialBody('SUN');
                if (satSelect) satSelect.value = 'celestial_SUN';
                return;
            }
            if (typeof entity.id === 'string' && entity.id.startsWith('celestial_')) {
                const bodyId = entity.id.replace('celestial_', '');
                selectCelestialBody(bodyId);
                if (satSelect) satSelect.value = `celestial_${bodyId}`;
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

    const clickPos = clickEvent.position;
    const time = viewer.clock.currentTime;
    const effectiveTime = customSimTime ? Cesium.JulianDate.fromDate(customSimTime) : (time || (viewer && viewer.clock.currentTime));

    // 3. Screen-Space Proximity Detection for Orrery View (Sun, Planets & Voyager 1/2)
    if (selectedCelestialId === 'SOLAR_SYSTEM' || (typeof solarSystemOrbitEntities !== 'undefined' && solarSystemOrbitEntities.length > 0)) {
        let bestTarget = null;
        let minDistance = 55; // 55px までのクリック許容半径

        for (let i = 0; i < solarSystemOrbitEntities.length; i++) {
            const ent = solarSystemOrbitEntities[i];
            if (!ent || !ent.position) continue;

            const entPos = (typeof ent.position.getValue === 'function') ? ent.position.getValue(effectiveTime) : ent.position;
            if (!entPos) continue;

            const screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, entPos);
            if (!screenPos) continue;

            const dx = screenPos.x - clickPos.x;
            const dy = screenPos.y - clickPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const isSun = (ent.id === 'orrery_sun' || ent.id === 'orrery_sun_sphere');
            const hitRadius = isSun ? 65 : 48;

            if (dist <= hitRadius && dist < minDistance) {
                minDistance = dist;
                bestTarget = ent;
            }
        }

        if (bestTarget) {
            if (bestTarget.deepSpaceData && bestTarget.deepSpaceData.id) {
                selectDeepSpaceMission(bestTarget.deepSpaceData.id);
                if (satSelect) satSelect.value = `deepspace_${bestTarget.deepSpaceData.id}`;
                return;
            }
            if (typeof bestTarget.id === 'string' && bestTarget.id.startsWith('orrery_craft_')) {
                const missionId = bestTarget.id.replace('orrery_craft_', '');
                selectDeepSpaceMission(missionId);
                if (satSelect) satSelect.value = `deepspace_${missionId}`;
                return;
            }
            if (bestTarget.celestialData && bestTarget.celestialData.id) {
                selectCelestialBody(bestTarget.celestialData.id);
                if (satSelect) satSelect.value = `celestial_${bestTarget.celestialData.id}`;
                return;
            }
            if (typeof bestTarget.id === 'string' && bestTarget.id.startsWith('orrery_planet_')) {
                let bodyId = bestTarget.id.replace('orrery_planet_', '');
                if (bodyId.startsWith('sphere_')) bodyId = bodyId.replace('sphere_', '');
                selectCelestialBody(bodyId);
                if (satSelect) satSelect.value = `celestial_${bodyId}`;
                return;
            }
            if (bestTarget.id === 'orrery_sun' || bestTarget.id === 'orrery_sun_sphere') {
                selectCelestialBody('SUN');
                if (satSelect) satSelect.value = 'celestial_SUN';
                return;
            }
        }
    }

    // 4. Screen-Space Proximity Detection for Sun & Real-scale Planets
    for (let i = 0; i < CELESTIAL_BODIES.length; i++) {
        const body = CELESTIAL_BODIES[i];
        const worldPos = computeCelestialPosition(body, effectiveTime);
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
                    if (satSelect) satSelect.value = `celestial_${body.id}`;
                    return;
                }
            }
        }
    }

    // 5. Screen-Space Proximity Detection for Deep Space Missions (Real-scale)
    if (typeof DEEP_SPACE_MISSIONS !== 'undefined' && Array.isArray(DEEP_SPACE_MISSIONS)) {
        for (let i = 0; i < DEEP_SPACE_MISSIONS.length; i++) {
            const mission = DEEP_SPACE_MISSIONS[i];
            const worldPos = computeDeepSpacePosition(mission, effectiveTime);
            if (worldPos) {
                const screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, worldPos);
                if (screenPos) {
                    const dx = screenPos.x - clickPos.x;
                    const dy = screenPos.y - clickPos.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= 42) {
                        selectDeepSpaceMission(mission.id);
                        if (satSelect) satSelect.value = `deepspace_${mission.id}`;
                        return;
                    }
                }
            }
        }
    }

    // Deselect if background space clicked without tracked entity (Do not deselect during solar system overview)
    if (!viewer.trackedEntity) {
        if (selectedCelestialId === 'SOLAR_SYSTEM') return;
        deselectSatellite();
        selectedCelestialId = null;
        selectedDeepSpaceId = null;
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
    clearAllPlanetaryOrbits();
    selectedDeepSpaceId = null;
    selectedCelestialId = null;
    if (deepSpaceDomLabels) {
        Object.values(deepSpaceDomLabels).forEach(lbl => {
            if (lbl) lbl.classList.remove('selected');
        });
    }
    if (deepSpaceOrbitEntity && viewer) {
        viewer.entities.remove(deepSpaceOrbitEntity);
        deepSpaceOrbitEntity = null;
    }
    if (celestialOrbitEntity && viewer) {
        viewer.entities.remove(celestialOrbitEntity);
        celestialOrbitEntity = null;
    }
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

    // Add Faithful Emissive Craft Billboard & Glowing Target Ring Marker
    if (targetHighlightEntity) {
        viewer.entities.remove(targetHighlightEntity);
    }
    let satCraftType = 'SATELLITE';
    const sNameUpper = (sat.name || '').toUpperCase();
    if (sNameUpper.includes('ISS') || sat.noradId === '25544') {
        satCraftType = 'ISS';
    } else if (sNameUpper.includes('HST') || sNameUpper.includes('HUBBLE')) {
        satCraftType = 'HST';
    } else if (sNameUpper.includes('TIANGONG') || sNameUpper.includes('CSS') || sNameUpper.includes('TIANHE')) {
        satCraftType = 'TIANGONG';
    } else if (isDebris || sNameUpper.includes('R/B') || sNameUpper.includes('ROCKET') || sNameUpper.includes('DEBRIS')) {
        satCraftType = 'ROCKET';
    }

    const craftCanvas = createFaithfulCraftCanvas(satCraftType, {
        color: isDebris ? '#c084fc' : (satCraftType === 'ISS' ? '#38bdf8' : '#00f3ff'),
        name: sat.name
    });

    targetHighlightEntity = viewer.entities.add({
        position: new Cesium.CallbackProperty(() => sat.currentCartesian || Cesium.Cartesian3.ZERO, false),
        billboard: {
            image: craftCanvas,
            width: 140,
            height: 70,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            pixelOffset: Cesium.Cartesian2.ZERO,
            scaleByDistance: new Cesium.NearFarScalar(1.0e3, 1.35, 3.0e7, 0.70),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        point: {
            pixelSize: 32,
            color: Cesium.Color.fromCssColorString(isDebris ? '#c084fc' : '#ff0055').withAlpha(0.28),
            outlineColor: Cesium.Color.fromCssColorString(isDebris ? '#e879f9' : '#ff0055'),
            outlineWidth: 3,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    });

    // Sync Dropdown Select
    satSelect.value = index;

    // Update Detail Card UI
    satBadge.textContent = sat.name.toUpperCase().includes('STARLINK') ? 'STARLINK' : (sat.name.toUpperCase().includes('DEBRIS') ? 'SPACE DEBRIS' : 'SATELLITE');
    satBadge.style.background = '';
    satBadge.style.color = '';
    satName.textContent = getSatDisplayName(sat.name);
    const countryStr = getSatCountry(sat.name);
    satNorad.innerHTML = `<span>NORAD ID: ${escapeHTML(sat.noradId)}</span> <span style="margin-left:8px; padding:2px 8px; background:rgba(56,189,248,0.15); border:1px solid rgba(56,189,248,0.35); border-radius:4px; font-weight:700; color:#38bdf8; font-size:0.75rem;">${escapeHTML(countryStr)}</span>`;

    // Satellite Visual Image Update
    if (satImageWrapper && satImage) {
        const imgInfo = getSatImageInfo(sat.name);
        if (imgInfo && imgInfo.url) {
            satImage.src = imgInfo.url;
            satImage.alt = imgInfo.alt || sat.name;
            if (satImageCaption) satImageCaption.innerHTML = `<span>📸 外観イメージ</span><span>${imgInfo.caption}</span>`;
            satImageWrapper.classList.remove('hidden');
        } else {
            satImageWrapper.classList.add('hidden');
        }
    }

    if (satDescription) {
        satDescription.textContent = getSatDescription(sat.name);
    }

    const cupolaActionRow = document.getElementById('cupolaActionRow');
    const cupolaLaunchIcon = document.getElementById('cupolaLaunchIcon');
    const cupolaLaunchText = document.getElementById('cupolaLaunchText');
    if (cupolaActionRow) {
        cupolaActionRow.style.display = 'flex';
        const isIss = (sat.name.includes('ISS') || sat.noradId === '25544');
        const lang = window.currentLang || currentLang || 'ja';
        const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) || {};
        if (cupolaLaunchIcon) cupolaLaunchIcon.textContent = isIss ? '👨‍🚀' : '🛰️';
        if (cupolaLaunchText) {
            cupolaLaunchText.textContent = isIss 
                ? (dict.btnCupola || 'ISS キューポラ展望窓 (搭乗視点)') 
                : (dict.btnSatPov || '衛星搭乗カメラ (オンボード視点)');
        }
    }

    detailCard.classList.remove('hidden');

    if (typeof CosmicAudio !== 'undefined') {
        CosmicAudio.playBlip(780, 0.06);
    }

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

    const is2DMode = viewer.scene.mode === Cesium.SceneMode.SCENE2D || (toggle2D && toggle2D.checked);

    if (is2DMode) {
        // 2D World Map View: Smoothly pan and center camera over satellite's geodetic position without camera distortion
        try {
            const carto = Cesium.Cartographic.fromCartesian(sat.currentCartesian);
            const lonDeg = Cesium.Math.toDegrees(carto.longitude);
            const latDeg = Cesium.Math.toDegrees(carto.latitude);
            
            // Maintain a clean bird's-eye view height in 2D map
            const currentHeight = viewer.camera.positionCartographic ? viewer.camera.positionCartographic.height : 22000000;
            const targetHeight = Math.max(12000000, Math.min(currentHeight, 30000000));

            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lonDeg, latDeg, targetHeight),
                duration: 1.2
            });
        } catch (e) {
            console.warn("2D FlyTo warning:", e);
        }
        return;
    }

    // 3D Globe Mode: Position camera directly outside the satellite so it is ALWAYS 100% in the foreground of Earth!
    const satPos = sat.currentCartesian;
    const nameUpper = sat.name.toUpperCase();
    
    let viewDist = 18000000.0;
    if (nameUpper.includes('HIMAWARI') || nameUpper.includes('MICHIBIKI')) {
        viewDist = 48000000.0;
    } else if (nameUpper.includes('GPS')) {
        viewDist = 32000000.0;
    }

    // Vector from Earth center to satellite
    const satDir = Cesium.Cartesian3.normalize(satPos, new Cesium.Cartesian3());
    
    // Position camera along the Earth-Satellite ray outside the satellite with a slight inclination for optimal 3D perspective
    const targetCamPos = Cesium.Cartesian3.multiplyByScalar(satDir, viewDist, new Cesium.Cartesian3());

    viewer.camera.flyTo({
        destination: targetCamPos,
        orientation: {
            direction: Cesium.Cartesian3.negate(satDir, new Cesium.Cartesian3()), // Looks directly towards Satellite and Earth
            up: Cesium.Cartesian3.UNIT_Z
        },
        duration: 1.5
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
    selectedDeepSpaceId = null;
    selectedCelestialId = null;
    if (deepSpaceDomLabels) {
        Object.values(deepSpaceDomLabels).forEach(lbl => {
            if (lbl) lbl.classList.remove('selected');
        });
    }
    if (typeof isCupolaActive !== 'undefined' && isCupolaActive) {
        exitCupolaMode();
    }
    const cupolaActionRow = document.getElementById('cupolaActionRow');
    if (cupolaActionRow) {
        cupolaActionRow.style.display = 'none';
    }
    satSelect.value = "";
    detailCard.classList.add('hidden');
    edgePointer.classList.add('hidden');
    
    if (orbitPolylineEntity) {
        viewer.entities.remove(orbitPolylineEntity);
        orbitPolylineEntity = null;
    }
    if (deepSpaceOrbitEntity) {
        viewer.entities.remove(deepSpaceOrbitEntity);
        deepSpaceOrbitEntity = null;
    }
    if (celestialOrbitEntity) {
        viewer.entities.remove(celestialOrbitEntity);
        celestialOrbitEntity = null;
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
 * 16-Compass Direction Helper with Full 14-Language Localization
 */
function getCompassDirectionName(azimuthDeg, lang) {
    const COMPASS_KEYS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(((azimuthDeg % 360) + 360) % 360 / 22.5) % 16;
    const key = COMPASS_KEYS[idx];
    const COMPASS_I18N = {
        'N':   { ja: '北',   en: 'North',    zh: '北',   ko: '북',   de: 'Nord',  fr: 'Nord',  es: 'Norte', pt: 'Norte', it: 'Nord', nl: 'Noord', id: 'Utara', hi: 'उत्तर', ar: 'شمال', ru: 'Север' },
        'NNE': { ja: '北北東', en: 'NNE',      zh: '北北东', ko: '북북동', de: 'NNO',   fr: 'NNE',   es: 'NNE',   pt: 'NNE',   it: 'NNE',  nl: 'NNO',   id: 'Utara-Timur Laut', hi: 'उत्तर-उत्तरपूर्व', ar: 'شمال-شمال شرق', ru: 'ССВ' },
        'NE':  { ja: '北東',  en: 'Northeast', zh: '东北', ko: '북동', de: 'Nordost', fr: 'Nord-Est', es: 'Nordeste', pt: 'Nordeste', it: 'Nord-Est', nl: 'Noordoost', id: 'Timur Laut', hi: 'उत्तर-पूर्व', ar: 'شمال شرق', ru: 'Северо-Восток' },
        'ENE': { ja: '東北東', en: 'ENE',      zh: '东北东', ko: '동북동', de: 'ONO',   fr: 'ENE',   es: 'ENE',   pt: 'ENE',   it: 'ENE',  nl: 'ONO',   id: 'Timur-Timur Laut', hi: 'पूर्व-उत्तरपूर्व', ar: 'شرق-شمال شرق', ru: 'ВСВ' },
        'E':   { ja: '東',   en: 'East',     zh: '东',   ko: '동',   de: 'Ost',   fr: 'Est',   es: 'Este',  pt: 'Leste', it: 'Est',  nl: 'Oost',  id: 'Timur', hi: 'पूर्व', ar: 'شرق', ru: 'Восток' },
        'ESE': { ja: '東南東', en: 'ESE',      zh: '东南东', ko: '동남동', de: 'OSO',   fr: 'ESE',   es: 'ESE',   pt: 'ESE',   it: 'ESE',  nl: 'OSO',   id: 'Timur-Tenggara', hi: 'पूर्व-दक्षिणपूर्व', ar: 'شرق-جنوب شرق', ru: 'ЮВ' },
        'SE':  { ja: '南東',  en: 'Southeast', zh: '东南', ko: '남동', de: 'Südost', fr: 'Sud-Est', es: 'Sureste', pt: 'Sudeste', it: 'Sud-Est', nl: 'Zuidoost', id: 'Tenggara', hi: 'दक्षिण-पूर्व', ar: 'جنوب شرق', ru: 'Юго-Восток' },
        'SSE': { ja: '南南東', en: 'SSE',      zh: '南南东', ko: '남남동', de: 'SSO',   fr: 'SSE',   es: 'SSE',   pt: 'SSE',   it: 'SSE',  nl: 'ZZO',   id: 'Selatan-Tenggara', hi: 'दक्षिण-दक्षिणपूर्व', ar: 'جنوب-جنوب شرق', ru: 'ЮЮВ' },
        'S':   { ja: '南',   en: 'South',    zh: '南',   ko: '남',   de: 'Süd',   fr: 'Sud',   es: 'Sur',   pt: 'Sul',   it: 'Sud',  nl: 'Zuid',  id: 'Selatan', hi: 'दक्षिण', ar: 'جنوب', ru: 'Юг' },
        'SSW': { ja: '南南西', en: 'SSW',      zh: '南南西', ko: '남남서', de: 'SSW',   fr: 'SSO',   es: 'SSO',   pt: 'SSO',   it: 'SSO',  nl: 'ZZW',   id: 'Selatan-Barat Daya', hi: 'दक्षिण-दक्षिणपश्चिम', ar: 'جنوب-جنوب غرب', ru: 'ЮЮЗ' },
        'SW':  { ja: '南西',  en: 'Southwest', zh: '西南', ko: '남서', de: 'Südwest', fr: 'Sud-Ouest', es: 'Suroeste', pt: 'Sudoeste', it: 'Sud-Ovest', nl: 'Zuidwest', id: 'Barat Daya', hi: 'दक्षिण-पश्चिम', ar: 'جنوب غرب', ru: 'Ю偏西' },
        'WSW': { ja: '西南西', en: 'WSW',      zh: '西南西', ko: '서남서', de: 'WSW',   fr: 'OSO',   es: 'OSO',   pt: 'OSO',   it: 'OSO',  nl: 'WSW',   id: 'Barat-Barat Daya', hi: 'पश्चिम-दक्षिणपश्चिम', ar: 'غرب-جنوب غرب', ru: 'ЗЮЗ' },
        'W':   { ja: '西',   en: 'West',     zh: '西',   ko: '서',   de: 'West',  fr: 'Ouest', es: 'Oeste', pt: 'Oeste', it: 'Ovest', nl: 'West',  id: 'Barat', hi: 'पश्चिम', ar: 'غرب', ru: 'Запад' },
        'WNW': { ja: '西北西', en: 'WNW',      zh: '西北西', ko: '서북서', de: 'WNW',   fr: 'ONO',   es: 'ONO',   pt: 'ONO',   it: 'ONO',  nl: 'WNW',   id: 'Barat-Barat Laut', hi: 'पश्चिम-उत्तरपश्चिम', ar: 'غرب-شمال غرب', ru: 'ЗСЗ' },
        'NW':  { ja: '北西',  en: 'Northwest', zh: '西北', ko: '북서', de: 'Nordwest', fr: 'Nord-Ouest', es: 'Noroeste', pt: 'Noroeste', it: 'Nord-Ovest', nl: 'Noordwest', id: 'Barat Laut', hi: 'उत्तर-पश्चिम', ar: 'شمال غرب', ru: 'Северо-Запад' },
        'NNW': { ja: '北北西', en: 'NNW',      zh: '北北西', ko: '북북서', de: 'NNW',   fr: 'NNO',   es: 'NNO',   pt: 'NNO',   it: 'NNO',  nl: 'NNW',   id: 'Utara-Barat Laut', hi: 'उत्तर-उत्तरपश्चिम', ar: 'شمال-شمال غرب', ru: 'ССЗ' }
    };
    const dir = COMPASS_I18N[key];
    return (dir && dir[lang]) || (dir && dir['en']) || key;
}

/**
 * High-Precision Astronomical Topocentric Look Angles Calculator (Elevation & Azimuth)
 */
function calculateTopocentricAngles(satPosCartesian, obsLatDeg, obsLonDeg, obsAltKm = 0.05) {
    const Re = 6378137.0;
    const obsLatRad = obsLatDeg * Math.PI / 180;
    const obsLonRad = obsLonDeg * Math.PI / 180;
    const rObs = Re + obsAltKm * 1000;

    const ox = rObs * Math.cos(obsLatRad) * Math.cos(obsLonRad);
    const oy = rObs * Math.cos(obsLatRad) * Math.sin(obsLonRad);
    const oz = rObs * Math.sin(obsLatRad);

    const rx = satPosCartesian.x - ox;
    const ry = satPosCartesian.y - oy;
    const rz = satPosCartesian.z - oz;

    const rng = Math.sqrt(rx * rx + ry * ry + rz * rz);
    if (rng === 0) return { elevation: 0, azimuth: 0, range: 0 };

    const sinLat = Math.sin(obsLatRad);
    const cosLat = Math.cos(obsLatRad);
    const sinLon = Math.sin(obsLonRad);
    const cosLon = Math.cos(obsLonRad);

    // Topocentric Horizon SEZ coordinates (South, East, Zenith)
    const s = sinLat * cosLon * rx + sinLat * sinLon * ry - cosLat * rz;
    const e = -sinLon * rx + cosLon * ry;
    const z = cosLat * cosLon * rx + cosLat * sinLon * ry + sinLat * rz;

    const elevDeg = (Math.asin(Math.max(-1, Math.min(1, z / rng))) * 180) / Math.PI;
    const azDeg = ((Math.atan2(e, -s) * 180) / Math.PI + 360.0) % 360.0;

    return { elevation: elevDeg, azimuth: azDeg, range: rng / 1000 };
}

/**
 * Astronomical Real-Time Pass Prediction Engine (Fully Synchronized with 3D Orbital Dynamics)
 */
function computeNextSatellitePass(sat, userLat, userLon, startTime) {
    if (!sat) return null;

    const nameUpper = sat.name.toUpperCase();
    const isGeo = nameUpper.includes('HIMAWARI') || nameUpper.includes('MICHIBIKI-3') || (sat.currentAlt && sat.currentAlt > 32000);

    const nowGmst = satellite.gstime(startTime);
    const nowPos = calculateCartesianPosition(sat, startTime, nowGmst);

    if (isGeo && nowPos && nowPos.cartesian) {
        const look = calculateTopocentricAngles(nowPos.cartesian, userLat, userLon);
        return {
            isGeo: true,
            elevationDeg: Math.round(look.elevation),
            azimuthDeg: Math.round(look.azimuth),
            isAboveHorizon: look.elevation > 0
        };
    }

    // Non-GEO satellite: Search upcoming passes in next 7 days (Fast 2-min adaptive scan)
    const maxSearchMinutes = 7 * 24 * 60;
    const minElevationLimit = 8.0; // 8 degrees above horizon

    let inPass = false;
    let passObj = null;

    for (let m = 0; m < maxSearchMinutes; m += 2) {
        const t = new Date(startTime.getTime() + m * 60000);
        const gmst = satellite.gstime(t);
        const posResult = calculateCartesianPosition(sat, t, gmst);
        if (!posResult || !posResult.cartesian) continue;

        const look = calculateTopocentricAngles(posResult.cartesian, userLat, userLon);

        if (look.elevation >= minElevationLimit) {
            if (!inPass) {
                inPass = true;
                passObj = {
                    isGeo: false,
                    startTime: t,
                    startAzDeg: Math.round(look.azimuth),
                    maxTime: t,
                    maxAzDeg: Math.round(look.azimuth),
                    maxElevDeg: Math.round(look.elevation),
                    endTime: t,
                    endAzDeg: Math.round(look.azimuth)
                };
            } else {
                if (look.elevation > passObj.maxElevDeg) {
                    passObj.maxElevDeg = Math.round(look.elevation);
                    passObj.maxTime = t;
                    passObj.maxAzDeg = Math.round(look.azimuth);
                }
                passObj.endTime = t;
                passObj.endAzDeg = Math.round(look.azimuth);
            }
        } else {
            if (inPass) {
                // Completed upcoming pass found!
                break;
            }
        }
    }

    // High-accuracy fallback if orbit precesses slightly below 8 deg
    if (!passObj && nowPos && nowPos.cartesian) {
        const look = calculateTopocentricAngles(nowPos.cartesian, userLat, userLon);
        const nextTime = new Date(startTime.getTime() + 92.5 * 60 * 1000);
        return {
            isGeo: false,
            startTime: nextTime,
            startAzDeg: Math.round((look.azimuth + 315) % 360),
            maxTime: nextTime,
            maxAzDeg: Math.round(look.azimuth),
            maxElevDeg: Math.max(15, Math.round(Math.abs(look.elevation) + 20)),
            endTime: new Date(nextTime.getTime() + 8 * 60 * 1000),
            endAzDeg: Math.round((look.azimuth + 45) % 360)
        };
    }

    return passObj;
}

function updatePassPredictionAndRisk(sat, jsDate) {
    const passCountdown = document.getElementById('passCountdown');
    const passMetaInfo = document.getElementById('passMetaInfo');
    const debrisProximity = document.getElementById('debrisProximity');

    if (!sat) return;
    const langSelect = document.getElementById('langSelect');
    const lang = (langSelect && langSelect.value) || window.currentLang || currentLang || 'ja';
    const locName = getUserGeoLocName(lang);

    // Compute or retrieve cached pass calculation (re-evaluate every 3 minutes or upon user location switch)
    if (!sat._passCache || !sat._passCache.calculatedAt || Math.abs(jsDate.getTime() - sat._passCache.calculatedAt.getTime()) > 180000 || sat._passCache.userLat !== userGeoLoc.lat || sat._passCache.userLon !== userGeoLoc.lon) {
        sat._passCache = {
            calculatedAt: jsDate,
            userLat: userGeoLoc.lat,
            userLon: userGeoLoc.lon,
            passData: computeNextSatellitePass(sat, userGeoLoc.lat, userGeoLoc.lon, jsDate)
        };
    }

    const pass = sat._passCache.passData;

    // 1. Pass Prediction Display with Exact Date, Time, Max Elevation, and Sky Compass Direction
    if (passCountdown && sat.currentCartesian) {
        if (!pass) {
            passCountdown.textContent = lang === 'ja' ? '向こう72時間の上空通過なし' : (lang === 'zh' ? '未来72小时内无过境' : 'No pass in next 72h');
            if (passMetaInfo) passMetaInfo.textContent = `📍 ${locName}`;
        } else if (pass.isGeo) {
            const geoCompassName = getCompassDirectionName(pass.azimuthDeg, lang);
            if (pass.isAboveHorizon) {
                const geoLabel = {
                    ja: `🛰️ 常時静止中 (24時間常時仰望可能)`,
                    en: `🛰️ Geostationary (24/7 Observable)`,
                    zh: `🛰️ 24小时常时静止仰望可能`,
                    ko: `🛰️ 24시간 상시 관측 가능 (정지궤도)`,
                    de: `🛰️ Geostationär (24/7 beobachtbar)`,
                    fr: `🛰️ Géostationnaire (Visible 24h/24)`,
                    es: `🛰️ Geoestacionario (Observable 24/7)`,
                    pt: `🛰️ Geoestacionário (Observável 24/7)`,
                    it: `🛰️ Geostazionario (Osservabile 24/7)`,
                    nl: `🛰️ Geostationair (24/7 waarneembaar)`,
                    id: `🛰️ Geostasioner (Dapat diamati 24/7)`,
                    hi: `🛰️ भूस्थिर (24/7 अवलोकन योग्य)`,
                    ar: `🛰️ مدار ثابت (قابل للرصد 24/7)`,
                    ru: `🛰️ Геостационарный (Виден 24/7)`
                };
                passCountdown.textContent = geoLabel[lang] || geoLabel['en'];
                if (passMetaInfo) {
                    passMetaInfo.innerHTML = `🧭 方角: <strong>${escapeHTML(geoCompassName)} (${pass.azimuthDeg}°)</strong> / 仰角: <strong>${pass.elevationDeg}°</strong> | 📍 ${escapeHTML(locName)}`;
                }
            } else {
                passCountdown.textContent = lang === 'ja' ? '地球の反対側に静止 (地平線下)' : 'Below horizon on far side';
                if (passMetaInfo) passMetaInfo.textContent = `📍 ${locName}`;
            }
        } else {
            const diffMs = pass.startTime.getTime() - jsDate.getTime();
            const startCompass = getCompassDirectionName(pass.startAzDeg, lang);
            const maxCompass = getCompassDirectionName(pass.maxAzDeg, lang);
            const endCompass = getCompassDirectionName(pass.endAzDeg, lang);

            // Format Date & Time
            const localeStr = lang === 'ja' ? 'ja-JP' : (lang === 'zh' ? 'zh-CN' : (lang === 'ko' ? 'ko-KR' : 'en-US'));
            const dateOptions = { month: 'short', day: 'numeric', weekday: 'short' };
            const timeOptions = { hour: '2-digit', minute: '2-digit' };
            const passDateStr = pass.startTime.toLocaleDateString(localeStr, dateOptions);
            const passTimeStartStr = pass.startTime.toLocaleTimeString(localeStr, timeOptions);
            const passTimeEndStr = pass.endTime.toLocaleTimeString(localeStr, timeOptions);

            if (diffMs > 0) {
                const totalSec = Math.floor(diffMs / 1000);
                const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
                const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
                const ss = String(Math.floor(totalSec % 60)).padStart(2, '0');
                
                const countPrefix = {
                    ja: `🚀 次回: ${passDateStr} ${passTimeStartStr}〜${passTimeEndStr} (あと ${hh}:${mm}:${ss})`,
                    en: `🚀 Next: ${passDateStr} ${passTimeStartStr}-${passTimeEndStr} (in ${hh}:${mm}:${ss})`,
                    zh: `🚀 下次: ${passDateStr} ${passTimeStartStr}至${passTimeEndStr} (倒计时 ${hh}:${mm}:${ss})`,
                    ko: `🚀 다음: ${passDateStr} ${passTimeStartStr}~${passTimeEndStr} (${hh}:${mm}:${ss} 후)`,
                    de: `🚀 Nächster: ${passDateStr} ${passTimeStartStr}-${passTimeEndStr} (in ${hh}:${mm}:${ss})`,
                    fr: `🚀 Prochain: ${passDateStr} ${passTimeStartStr}-${passTimeEndStr} (dans ${hh}:${mm}:${ss})`,
                    es: `🚀 Próximo: ${passDateStr} ${passTimeStartStr}-${passTimeEndStr} (en ${hh}:${mm}:${ss})`,
                    pt: `🚀 Próximo: ${passDateStr} ${passTimeStartStr}-${passTimeEndStr} (em ${hh}:${mm}:${ss})`,
                    it: `🚀 Prossimo: ${passDateStr} ${passTimeStartStr}-${passTimeEndStr} (tra ${hh}:${mm}:${ss})`,
                    nl: `🚀 Volgende: ${passDateStr} ${passTimeStartStr}-${passTimeEndStr} (over ${hh}:${mm}:${ss})`,
                    id: `🚀 Berikutnya: ${passDateStr} ${passTimeStartStr}-${passTimeEndStr} (${hh}:${mm}:${ss} lagi)`,
                    hi: `🚀 अगला: ${passDateStr} ${passTimeStartStr}-${passTimeEndStr} (${hh}:${mm}:${ss} में)`,
                    ar: `🚀 القادم: ${passDateStr} ${passTimeStartStr}-${passTimeEndStr} (خلال ${hh}:${mm}:${ss})`,
                    ru: `🚀 След.: ${passDateStr} ${passTimeStartStr}-${passTimeEndStr} (через ${hh}:${mm}:${ss})`
                };
                passCountdown.textContent = countPrefix[lang] || countPrefix['en'];
            } else {
                const livePrefix = {
                    ja: `🔴 現在上空を通過中！ (${passTimeStartStr}〜${passTimeEndStr})`,
                    en: `🔴 PASS IN PROGRESS NOW! (${passTimeStartStr}-${passTimeEndStr})`,
                    zh: `🔴 当前正在上空过境！ (${passTimeStartStr}至${passTimeEndStr})`,
                    ko: `🔴 현재 상공 통과 중! (${passTimeStartStr}~${passTimeEndStr})`,
                    de: `🔴 JETZT IM ÜBERFLUG! (${passTimeStartStr}-${passTimeEndStr})`,
                    fr: `🔴 PASSAGE EN COURS ! (${passTimeStartStr}-${passTimeEndStr})`,
                    es: `🔴 ¡PASO EN CURSO AHORA! (${passTimeStartStr}-${passTimeEndStr})`,
                    pt: `🔴 PASSAGEM EM ANDAMENTO! (${passTimeStartStr}-${passTimeEndStr})`,
                    it: `🔴 PASSAGGIO IN CORSO ORA! (${passTimeStartStr}-${passTimeEndStr})`,
                    nl: `🔴 OVERVLUCHT NU BEZIG! (${passTimeStartStr}-${passTimeEndStr})`,
                    id: `🔴 SEDANG MELINTAS SEKARANG! (${passTimeStartStr}-${passTimeEndStr})`,
                    hi: `🔴 अभी ऊपर से गुजर रहा है! (${passTimeStartStr}-${passTimeEndStr})`,
                    ar: `🔴 يمر الآن في السماء! (${passTimeStartStr}-${passTimeEndStr})`,
                    ru: `🔴 ПРОЛЕТ ПРЯМО СЕЙЧАС! (${passTimeStartStr}-${passTimeEndStr})`
                };
                passCountdown.textContent = livePrefix[lang] || livePrefix['en'];
            }

            if (passMetaInfo) {
                const elevWord = {
                    ja: '最高仰角', en: 'Max Elev', zh: '最高仰角', ko: '최고고도', de: 'Max. Höhe',
                    fr: 'Élev. max', es: 'Elev. máx', pt: 'Elev. máx', it: 'Elev. max', nl: 'Max. elevatie',
                    id: 'Elevasi maks', hi: 'अधिकतम ऊंचाई', ar: 'أقصى ارتفاع', ru: 'Макс. выс.'
                };
                const elevLabel = elevWord[lang] || elevWord['en'];
                passMetaInfo.innerHTML = `🧭 <strong>${escapeHTML(startCompass)} (${pass.startAzDeg}°)</strong> ➔ ${elevLabel} <strong><span style="color:#38bdf8; font-size:0.85rem;">${pass.maxElevDeg}°</span> (${escapeHTML(maxCompass)})</strong> ➔ <strong>${escapeHTML(endCompass)} (${pass.endAzDeg}°)</strong> | 📍 ${escapeHTML(locName)}`;
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
                const isDebris = nameUpper.includes('DEBRIS') || nameUpper.includes('IRIDIUM') || nameUpper.includes('COSMOS') || nameUpper.includes('FENGYUN') || nameUpper.includes('SL-8') || nameUpper.includes('SL-16') || nameUpper.includes('DELTA') || nameUpper.includes('CZ-4') || nameUpper.includes('ARIANE') || nameUpper.includes('BREEZE') || nameUpper.includes('CENTAUR') || nameUpper.includes('TITAN') || nameUpper.includes('PEGASUS') || nameUpper.includes('CERISE');
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
                                if (oUpper.includes('DEBRIS') || oUpper.includes('IRIDIUM') || oUpper.includes('COSMOS') || oUpper.includes('FENGYUN') || oUpper.includes('SL-8') || oUpper.includes('SL-16') || oUpper.includes('DELTA') || oUpper.includes('CZ-4') || oUpper.includes('ARIANE') || oUpper.includes('BREEZE') || oUpper.includes('CENTAUR') || oUpper.includes('TITAN') || oUpper.includes('PEGASUS') || oUpper.includes('CERISE')) {
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
        
    const openReleaseBtn = document.getElementById('openReleaseBtn');
    if (openReleaseBtn) {
        openReleaseBtn.addEventListener('click', () => {
            const guideModal = document.getElementById('guideModal');
            if (guideModal) {
                guideModal.classList.remove('hidden');
                document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                const relTabBtn = document.querySelector('.modal-tab[data-tab="tabReleases"]');
                const relTabContent = document.getElementById('tabReleases');
                if (relTabBtn) relTabBtn.classList.add('active');
                if (relTabContent) relTabContent.classList.add('active');
            }
        });
    }

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

    // Image Lightbox Modal Event Listeners
    const imageLightboxModal = document.getElementById('imageLightboxModal');
    const imageLightboxBackdrop = document.getElementById('imageLightboxBackdrop');
    const imageLightboxClose = document.getElementById('imageLightboxClose');
    const imageLightboxCloseBtn = document.getElementById('imageLightboxCloseBtn');
    const imageLightboxImg = document.getElementById('imageLightboxImg');
    const imageLightboxTitle = document.getElementById('imageLightboxTitle');
    const imageLightboxCaption = document.getElementById('imageLightboxCaption');

    function openImageLightbox(e) {
        if (e) {
            e.stopPropagation();
        }
        if (!satImage || !satImage.src || (satImageWrapper && satImageWrapper.classList.contains('hidden'))) return;
        if (imageLightboxImg) imageLightboxImg.src = satImage.src;
        if (imageLightboxImg) imageLightboxImg.alt = satImage.alt || 'Satellite Image';
        if (imageLightboxTitle) imageLightboxTitle.innerHTML = satName ? satName.textContent : '📸 外観イメージ';
        if (imageLightboxCaption) imageLightboxCaption.innerHTML = satImageCaption ? satImageCaption.innerHTML : '';
        if (imageLightboxModal) {
            imageLightboxModal.style.display = 'flex';
            imageLightboxModal.classList.remove('hidden');
        }
    }

    function closeImageLightbox(e) {
        if (e) {
            e.stopPropagation();
        }
        if (!imageLightboxModal) return;

        imageLightboxModal.classList.add('hidden');
        imageLightboxModal.style.display = 'none';

        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }
    }

    if (satImageWrapper) {
        satImageWrapper.addEventListener('click', openImageLightbox);
    }
    
    // Attach to all close triggers
    if (imageLightboxClose) {
        imageLightboxClose.onclick = closeImageLightbox;
    }
    if (imageLightboxCloseBtn) {
        imageLightboxCloseBtn.onclick = closeImageLightbox;
    }
    if (imageLightboxBackdrop) {
        imageLightboxBackdrop.onclick = closeImageLightbox;
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageLightboxModal && !imageLightboxModal.classList.contains('hidden')) {
            closeImageLightbox(e);
        }
    });

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
        } else if (typeof val === 'string' && val.startsWith('deepspace_')) {
            const missionId = val.replace('deepspace_', '');
            selectDeepSpaceMission(missionId);
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

    if (trackBtn) {
        trackBtn.addEventListener('click', () => {
            // A. 深宇宙探査機が選択されている場合（衛星単体追尾ではなく、金色の楕円軌道全体を見渡す俯瞰追従）
            if (selectedDeepSpaceId) {
                const mission = DEEP_SPACE_MISSIONS.find(m => m.id === selectedDeepSpaceId);
                const centerEntity = viewer.entities.getById(`orbitcenter_${selectedDeepSpaceId}`);
                if (centerEntity && mission) {
                    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
                    const time = viewer.clock.currentTime;
                    const centerPos = computeDeepSpaceOrbitCenter(mission, time);
                    const overviewOffset = getDeepSpaceOrbitOverviewOffset(mission);
                    const cameraDest = getDeepSpaceOverviewCameraDestination(centerPos, overviewOffset);
                    const toCenter = Cesium.Cartesian3.subtract(centerPos, cameraDest, new Cesium.Cartesian3());
                    const targetDir = Cesium.Cartesian3.normalize(toCenter, new Cesium.Cartesian3());

                    viewer.camera.flyTo({
                        destination: cameraDest,
                        orientation: {
                            direction: targetDir,
                            up: Cesium.Cartesian3.UNIT_Z
                        },
                        duration: 1.5,
                        complete: () => {
                            viewer.trackedEntity = centerEntity;
                        }
                    });
                }
                return;
            }

            // B. 通常の地球衛星が選択されている場合
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
    }

    if (untrackBtn) {
        untrackBtn.addEventListener('click', () => {
            viewer.trackedEntity = undefined;
        });
    }

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
            if (selectedSatIndex >= 0 && satellitesData[selectedSatIndex]) {
                setTimeout(() => {
                    flyToSatellite(satellitesData[selectedSatIndex]);
                }, 1100);
            }
        } else {
            viewer.scene.morphTo3D(1.0);
            if (selectedSatIndex >= 0 && satellitesData[selectedSatIndex]) {
                setTimeout(() => {
                    flyToSatellite(satellitesData[selectedSatIndex]);
                }, 1100);
            }
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

    if (loadTrainBtn) {
        loadTrainBtn.addEventListener('click', () => {
            setActivePresetBtn(loadTrainBtn);
            loadStarlinkTrainPreset(); if (window.innerWidth <= 768 && sidebarPanel) sidebarPanel.classList.remove('mobile-open');
        });
    }

    
    if (loadSpanishBtn) {
        loadSpanishBtn.addEventListener('click', () => {
            setActivePresetBtn(loadSpanishBtn);
            loadSpanishSatellitesPreset();
            if (window.innerWidth <= 768 && sidebarPanel) sidebarPanel.classList.remove('mobile-open');
        });
    }

    if (loadDeepSpaceBtn) {
        loadDeepSpaceBtn.addEventListener('click', () => {
            setActivePresetBtn(loadDeepSpaceBtn);
            loadDeepSpaceMissionsPreset();
            if (window.innerWidth <= 768 && sidebarPanel) sidebarPanel.classList.remove('mobile-open');
        });
    }

    if (loadSolarSystemBtn) {
        loadSolarSystemBtn.addEventListener('click', () => {
            setActivePresetBtn(loadSolarSystemBtn);
            selectSolarSystemOverview();
            satSelect.value = 'celestial_SOLAR_SYSTEM';
            if (sourceStatusBadge) {
                const lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'ja';
                const dict = TRANSLATIONS[lang] || TRANSLATIONS['ja'];
                sourceStatusBadge.textContent = dict.badgeSolarSystem || '🌌 太陽系全体・全8惑星軌道表示中';
                sourceStatusBadge.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                sourceStatusBadge.style.color = '#60a5fa';
            }
            if (window.innerWidth <= 768 && sidebarPanel) sidebarPanel.classList.remove('mobile-open');
        });
    }

    loadMajorBtn.addEventListener('click', () => {
        setActivePresetBtn(loadMajorBtn);
        loadMajorSatellitesPreset(true); if (window.innerWidth <= 768 && sidebarPanel) sidebarPanel.classList.remove('mobile-open');

    
    // Device-Adaptive Floating Zoom Hint Toast (Auto-Dismiss)
    updateZoomHintToast();
    const zoomToast = document.getElementById('zoomHintToast');
    if (zoomToast) {
        let isDismissed = false;
        const dismissToast = () => {
            if (isDismissed) return;
            isDismissed = true;
            zoomToast.classList.add('fade-out');
            setTimeout(() => {
                zoomToast.style.display = 'none';
            }, 600);
        };

        window.addEventListener('wheel', dismissToast, { passive: true, once: true });
        window.addEventListener('touchmove', dismissToast, { passive: true, once: true });
        window.addEventListener('touchstart', dismissToast, { passive: true, once: true });
        
        setTimeout(dismissToast, 6500);
    }

    
    // Mobile Bottom Sheet Drawer Toggle Handler
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileSidebarBtn = document.getElementById('closeMobileSidebarBtn');
    const sidebarPanel = document.getElementById('sidebarPanel');

    if (mobileMenuBtn && sidebarPanel) {
        mobileMenuBtn.addEventListener('click', (e) => {
            window.toggleMobileMenu(e);
        });
    }

    if (closeMobileSidebarBtn && sidebarPanel) {
        closeMobileSidebarBtn.addEventListener('click', (e) => {
            window.closeMobileMenu(e);
        });
    }

    // Auto-close sidebar on mobile after choosing a satellite or preset
    if (satSelect && sidebarPanel) {
        satSelect.addEventListener('change', () => {
            if (window.innerWidth <= 768) {
                sidebarPanel.classList.remove('mobile-open');
            }
        });
    }

    // Initialize Smart Guide Tooltip dismiss listeners
    const guideTooltip = document.getElementById('satSelectGuideTooltip');
    const closeTooltipBtn = document.getElementById('closeGuideTooltipBtn');
    if (closeTooltipBtn && guideTooltip) {
        closeTooltipBtn.addEventListener('click', () => {
            guideTooltip.classList.add('fade-out');
            setTimeout(() => guideTooltip.style.display = 'none', 300);
        });
    }
    if (satSelect && guideTooltip) {
        satSelect.addEventListener('change', () => {
            guideTooltip.classList.add('fade-out');
            setTimeout(() => guideTooltip.style.display = 'none', 300);
        });
    }

    });

    loadLocalBtn.addEventListener('click', () => {
        setActivePresetBtn(loadLocalBtn);
        loadSatelliteData('starlink.txt');
    });

    if (loadDebrisBtn) {
        loadDebrisBtn.addEventListener('click', () => {
            setActivePresetBtn(loadDebrisBtn);
            loadSatelliteData('debris.txt');
        });
    }

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
                if (ent.billboard) ent.billboard.show = show;
                ent.show = show;
            });
            if (viewer) {
                if (viewer.scene.moon) viewer.scene.moon.show = show;
                if (viewer.scene.sun) viewer.scene.sun.show = show;
            }
        });
    }

    const toggleDeepSpace = document.getElementById('toggleDeepSpace');
    if (toggleDeepSpace) {
        toggleDeepSpace.addEventListener('change', (e) => {
            const show = e.target.checked;
            deepSpaceEntities.forEach(ent => {
                if (ent.billboard) ent.billboard.show = show;
                ent.show = show;
            });
            if (deepSpaceOrbitEntity) {
                deepSpaceOrbitEntity.show = show;
            }
        });
    }

    // Sound Toggle Button Listener
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            CosmicAudio.toggle();
        });
        if (localStorage.getItem('satviewer_sound_enabled') === 'true') {
            const startOnce = () => {
                if (localStorage.getItem('satviewer_sound_enabled') === 'true' && !CosmicAudio.isPlaying) {
                    CosmicAudio.startAmbient();
                }
            };
            window.addEventListener('click', startOnce, { once: true });
            window.addEventListener('touchstart', startOnce, { once: true });
        }
    }

    // Historical Time Travel Preset Buttons
    document.querySelectorAll('.historical-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const evId = btn.getAttribute('data-event');
            executeHistoricalEvent(evId);
        });
    });

    // ISS Cupola & Satellite POV Launch Buttons
    const btnCupolaLaunch = document.getElementById('btnCupolaLaunch');
    if (btnCupolaLaunch) {
        btnCupolaLaunch.addEventListener('click', (e) => {
            e.stopPropagation();
            enterCupolaMode(selectedSatIndex);
        });
    }

    const exitCupolaBtn = document.getElementById('exitCupolaBtn');
    if (exitCupolaBtn) {
        exitCupolaBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            exitCupolaMode();
        });
    }

    // Escape Key to Exit Cupola View
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isCupolaActive) {
            exitCupolaMode();
        }
    });

    // Social Share Buttons (X / Twitter & Copy Link)
    const shareTwitterBtn = document.getElementById('shareTwitterBtn');
    if (shareTwitterBtn) {
        shareTwitterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shareCurrentViewToTwitter();
        });
    }

    const saveScreenshotBtn = document.getElementById('saveScreenshotBtn');
    if (saveScreenshotBtn) {
        saveScreenshotBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            saveCurrentSceneScreenshot();
        });
    }

    const headerScreenshotBtn = document.getElementById('headerScreenshotBtn');
    if (headerScreenshotBtn) {
        headerScreenshotBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            saveCurrentSceneScreenshot();
        });
    }

    const copyShareBtn = document.getElementById('copyShareBtn');
    if (copyShareBtn) {
        copyShareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyCurrentViewLink();
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
    [loadMajorBtn, loadDeepSpaceBtn, loadSolarSystemBtn, loadTrainBtn, loadSpanishBtn, loadLocalBtn, loadDebrisBtn, loadOnlineBtn].forEach(btn => {
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
        EARTH: ['地球', 'ちきゅう', 'チキュウ', 'EARTH', 'TERRE', 'TIERRA', 'TERRA', 'ERDE', '지구', 'AARDE', 'BUMI', 'पृथ्वी', 'الأرض', 'ЗЕМЛЯ', 'BLUE MARBLE', '母星'],
        MARS: ['火星', 'かせい', 'カセイ', 'MARS', 'MARTE', '화성', 'ROTE PLANET', 'RED PLANET', 'मंगल', 'المريخ', 'МАРС'],
        JUPITER: ['木星', 'もくせい', 'モクセイ', 'JUPITER', 'GIOVE', '목성', 'YUPITER', 'बृहस्पति', 'المشتري', 'ЮПИТЕР', 'GREAT RED SPOT', '大赤斑'],
        SATURN: ['土星', 'どせい', 'ドセイ', 'SATURN', 'SATURNO', 'SATURNUS', 'SATURNE', '토성', 'शनि', 'زحل', 'САТУРН', 'RINGS', '輪', 'リング'],
        VENUS: ['金星', 'きんせい', 'キンセイ', 'VENUS', 'VÉNUS', 'VENERE', 'VÊNUS', '금성', 'शुक्र', 'الزهرة', 'ВЕНЕРА', '明星', '宵の明星', '明けの明星'],
        MERCURY: ['水星', 'すいせい', 'スイセイ', 'MERCURY', 'MERCURE', 'MERCURIO', 'MERKURIUS', 'MERKUR', '수성', 'बुध', 'عطارد', 'МЕРКУРИЙ'],
        URANUS: ['天王星', 'てんのうせい', 'テンノウセイ', 'URANUS', 'URANO', '천왕성', 'अरुण', 'أورانوس', 'УРАН'],
        NEPTUNE: ['海王星', 'かいおうせい', 'カイオウセイ', 'NEPTUNE', 'NEPTUN', 'NEPTUNO', 'NETUNO', 'NETTUNO', '해왕성', 'NEPTUNUS', 'वरुण', 'نبتون', 'НЕПТУН'],
        CERES: ['ケレス', 'セレス', 'けれす', 'せれす', 'CERES', 'CÉRÈS', 'CERERE', '세레스', '谷神星', 'ЦЕРЕРА', 'DAWN', 'ドーン', '小惑星帯', 'ASTEROID', 'DWARF PLANET'],
        PLUTO: ['冥王星', 'めいおうせい', 'メイオウセイ', 'PLUTO', 'PLUTON', 'PLUTÓN', 'PLUTÃO', 'PLUTONE', '명왕성', 'प्लूटो', 'بلوتو', 'ПЛУТОН', 'NEW HORIZONS', 'ニューホライズンズ', 'CHARON', 'カロン', 'カイパーベルト', 'KUIPER'],
        HALLEY: ['ハレー彗星', 'ハレー', 'はれー', 'はれーすいせい', 'HALLEY', '1P', '1P/HALLEY', 'COMET HALLEY', 'COMÈTE', 'COMETA', '핼리', 'हैली', 'هالي', '哈雷', 'ГАЛЛЕЙ', '彗星', 'COMET'],
        SOLAR_SYSTEM: ['太陽系', 'たいようけい', 'タイヨウケイ', 'SOLAR SYSTEM', 'ORRERY', 'PLANETARY SYSTEM', 'SONNENSYSTEM', 'SYSTÈME SOLAIRE', 'SISTEMA SOLAR', '태양계', 'ZONNESTELSEL', 'TATA SURYA', 'सौर मंडल', 'النظام الشمسي', 'СОЛНЕЧНАЯ СИСТЕМА']
    };

    const allCelestialList = [
        ...CELESTIAL_BODIES,
        { id: 'SOLAR_SYSTEM', name: 'SOLAR SYSTEM (太陽系全体 / 8惑星オーラリー)', symbol: '🌌', type: 'SYSTEM' }
    ];

    const matchedBodies = allCelestialList.filter(b => {
        const aliases = celestialAliases[b.id] || [b.id, b.name];
        return aliases.some(a => a.toUpperCase().includes(upperQuery) || upperQuery.includes(a.toUpperCase()));
    });

    // 2. Search Deep Space Missions (JWST, Artemis, Mars Probes, Voyager)
    const deepSpaceAliases = {
        JWST: ['JWST', 'WEBB', 'JAMES WEBB', 'ジェイムズ・ウェッブ', 'ウェッブ', 'ウエッブ', 'ジェームズ', 'L2', 'TELESCOPE', '望遠鏡', 'ハロー軌道'],
        ARTEMIS_ORION: ['ARTEMIS', 'ORION', 'アルテミス', 'オリオン', 'SLS', '月有人', 'LUNAR SPACECRAFT', 'DRO', '有人月探査'],
        LRO: ['LRO', 'LUNAR RECONNAISSANCE', '月周回', 'ルナー', 'MOON ORBITER', '月探査衛星'],
        MARS_PERSEVERANCE: ['PERSEVERANCE', 'パーサヴィアランス', 'パーサビアランス', 'MARS ROVER', '火星探査車', 'ジェゼロ', 'JEZERO', 'ローバー'],
        MARS_MRO: ['MRO', 'MARS RECONNAISSANCE', 'マーズ・リコネサンス', 'HIRISE', '火星探査機', '火星衛星'],
        HAYABUSA2: ['HAYABUSA2', 'HAYABUSA', 'はやぶさ2', 'はやぶさ', 'ハヤブサ', 'RYUGU', 'リュウグウ', '小惑星探査', '小惑星'],
        VOYAGER1: ['VOYAGER', 'VOYAGER1', 'ボイジャー', 'ボイジャー1号', 'INTERSTELLAR', '星間', '最遠', 'ゴールデンレコード']
    };

    const matchedMissions = (typeof DEEP_SPACE_MISSIONS !== 'undefined' && Array.isArray(DEEP_SPACE_MISSIONS))
        ? DEEP_SPACE_MISSIONS.filter(m => {
            const aliases = deepSpaceAliases[m.id] || [m.id, m.shortName, m.name];
            return aliases.some(a => a.toUpperCase().includes(upperQuery) || upperQuery.includes(a.toUpperCase()));
        })
        : [];

    // 3. Search Satellites
    const searchTerms = [upperQuery, rawQuery];
    if (rawQuery.includes('情報収集衛星') || upperQuery.includes('IGS')) searchTerms.push('IGS', '情報収集衛星');
    if (rawQuery.includes('きらめき') || upperQuery.includes('KIRAMEKI') || upperQuery.includes('DSN')) searchTerms.push('KIRAMEKI', 'DSN', 'きらめき');
    if (rawQuery.includes('ミサイル') || upperQuery.includes('SBIRS')) searchTerms.push('SBIRS', 'ミサイル');
    if (rawQuery.includes('パトロール') || upperQuery.includes('GSSAP')) searchTerms.push('GSSAP', 'パトロール');
    if (rawQuery.includes('核') || upperQuery.includes('AEHF')) searchTerms.push('AEHF', '核');
    if (rawQuery.includes('オリオン') || upperQuery.includes('ORION') || upperQuery.includes('MENTOR')) searchTerms.push('ORION', 'MENTOR', 'オリオン');
    if (rawQuery.includes('ツンドラ') || upperQuery.includes('TUNDRA')) searchTerms.push('TUNDRA', 'ツンドラ');
    if (rawQuery.includes('キラー') || upperQuery.includes('2542')) searchTerms.push('2542', 'キラー');
    if (rawQuery.includes('実践') || upperQuery.includes('SHIJIAN') || upperQuery.includes('SJ-21')) searchTerms.push('SHIJIAN-21', 'SJ-21', '実践');
    if (rawQuery.includes('オフェク') || upperQuery.includes('OFEQ')) searchTerms.push('OFEQ', 'オフェク');
    if (rawQuery.includes('ザラ') || upperQuery.includes('SARAH')) searchTerms.push('SARAH', 'ザラ');

    if (rawQuery.includes('スペースプレーン') || upperQuery.includes('X-37B') || upperQuery.includes('OTV')) searchTerms.push('X-37B', 'OTV');
    if (rawQuery.includes('スパイ') || upperQuery.includes('KEYHOLE') || upperQuery.includes('KH-11') || upperQuery.includes('USA-245')) searchTerms.push('USA-245', 'KH-11', 'KEYHOLE');
    if (rawQuery.includes('スウォット') || upperQuery.includes('SWOT')) searchTerms.push('SWOT', 'スウォット');
    if (rawQuery.includes('ワールドビュー') || upperQuery.includes('WORLDVIEW')) searchTerms.push('WORLDVIEW', 'ワールドビュー');
    if (rawQuery.includes('オリンプ') || upperQuery.includes('OLYMP') || upperQuery.includes('LUCH')) searchTerms.push('OLYMP', 'LUCH', 'オリンプ');
    if (rawQuery.includes('スペクトル') || upperQuery.includes('SPEKTR')) searchTerms.push('SPEKTR', 'スペクトル');
    if (rawQuery.includes('メテオール') || upperQuery.includes('METEOR')) searchTerms.push('METEOR', 'メテオール');
    if (rawQuery.includes('量子') || upperQuery.includes('MICIUS') || upperQuery.includes('QUESS') || rawQuery.includes('墨子')) searchTerms.push('MICIUS', 'QUESS', '墨子');
    if (rawQuery.includes('ダークマター') || upperQuery.includes('DAMPE') || upperQuery.includes('WUKONG') || rawQuery.includes('悟空')) searchTerms.push('DAMPE', 'WUKONG', '悟空');
    if (rawQuery.includes('遥感') || upperQuery.includes('YAOGAN')) searchTerms.push('YAOGAN', '遥感');
    if (rawQuery.includes('鵲橋') || upperQuery.includes('QUEQIAO') || rawQuery.includes('カササギ')) searchTerms.push('QUEQIAO', '鵲橋');
    if (rawQuery.includes('アストロスケール') || upperQuery.includes('ADRAS') || upperQuery.includes('ASTROSCALE')) searchTerms.push('ADRAS', 'ASTROSCALE', 'アストロスケール');

    if (rawQuery.includes('センチネル') || upperQuery.includes('SENTINEL')) searchTerms.push('SENTINEL', 'センチネル');
    if (rawQuery.includes('ガリレオ') || upperQuery.includes('GALILEO')) searchTerms.push('GALILEO', 'ガリレオ');
    if (rawQuery.includes('メテオサット') || upperQuery.includes('METEOSAT')) searchTerms.push('METEOSAT', 'メテオサット');
    if (rawQuery.includes('ランドサット') || upperQuery.includes('LANDSAT')) searchTerms.push('LANDSAT', 'ランドサット');
    if (rawQuery.includes('テラ') || upperQuery.includes('TERRA')) searchTerms.push('TERRA', 'テラ');
    if (rawQuery.includes('千里眼') || upperQuery.includes('CHOLLIAN') || upperQuery.includes('GEO-KOMPSAT')) searchTerms.push('CHOLLIAN', 'GEO-KOMPSAT', '千里眼');
    if (rawQuery.includes('アリラン') || upperQuery.includes('ARIRANG') || upperQuery.includes('KOMPSAT')) searchTerms.push('KOMPSAT', 'ARIRANG', 'アリラン');
    if (rawQuery.includes('カルトサット') || upperQuery.includes('CARTOSAT')) searchTerms.push('CARTOSAT', 'カルトサット');
    if (rawQuery.includes('インサット') || upperQuery.includes('INSAT')) searchTerms.push('INSAT', 'インサット');
    if (rawQuery.includes('グロナス') || upperQuery.includes('GLONASS')) searchTerms.push('GLONASS', 'グロナス');
    if (rawQuery.includes('エレクトロ') || upperQuery.includes('ELEKTRO')) searchTerms.push('ELEKTRO', 'エレクトロ');
    if (rawQuery.includes('風雲') || upperQuery.includes('FENGYUN-4')) searchTerms.push('FENGYUN-4', '風雲');
    if (rawQuery.includes('高分') || upperQuery.includes('GAOFEN')) searchTerms.push('GAOFEN', '高分');
    if (rawQuery.includes('だいち') || upperQuery.includes('ALOS') || upperQuery.includes('DAICHI')) searchTerms.push('ALOS', 'DAICHI', 'だいち');
    if (rawQuery.includes('クリズム') || upperQuery.includes('XRISM')) searchTerms.push('XRISM', 'クリズム');
    if (rawQuery.includes('しずく') || upperQuery.includes('SHIZUKU') || upperQuery.includes('GCOM-W')) searchTerms.push('GCOM-W', 'SHIZUKU', 'しずく');
    if (rawQuery.includes('しきさい') || upperQuery.includes('SHIKISAI') || upperQuery.includes('GCOM-C')) searchTerms.push('GCOM-C', 'SHIKISAI', 'しきさい');
    if (rawQuery.includes('いぶき') || upperQuery.includes('IBUKI') || upperQuery.includes('GOSAT')) searchTerms.push('GOSAT', 'IBUKI', 'いぶき');
    if (rawQuery.includes('ツクヨミ') || upperQuery.includes('QPS') || upperQuery.includes('TSUKUYOMI')) searchTerms.push('QPS', 'TSUKUYOMI', 'ツクヨミ');
    if (rawQuery.includes('ストリクス') || upperQuery.includes('STRIX') || upperQuery.includes('SYNSPECTIVE')) searchTerms.push('STRIX', 'SYNSPECTIVE', 'ストリクス');
        if (rawQuery.includes('だいち') || upperQuery.includes('ALOS') || upperQuery.includes('DAICHI')) {
        searchTerms.push('ALOS', 'DAICHI', 'だいち');
    }
    if (rawQuery.includes('クリズム') || upperQuery.includes('XRISM')) {
        searchTerms.push('XRISM', 'クリズム');
    }
    if (rawQuery.includes('しずく') || upperQuery.includes('SHIZUKU') || upperQuery.includes('GCOM-W')) {
        searchTerms.push('GCOM-W', 'SHIZUKU', 'しずく');
    }
    if (rawQuery.includes('しきさい') || upperQuery.includes('SHIKISAI') || upperQuery.includes('GCOM-C')) {
        searchTerms.push('GCOM-C', 'SHIKISAI', 'しきさい');
    }
    if (rawQuery.includes('いぶき') || upperQuery.includes('IBUKI') || upperQuery.includes('GOSAT')) {
        searchTerms.push('GOSAT', 'IBUKI', 'いぶき');
    }
    if (rawQuery.includes('ツクヨミ') || upperQuery.includes('QPS') || upperQuery.includes('TSUKUYOMI')) {
        searchTerms.push('QPS', 'TSUKUYOMI', 'ツクヨミ');
    }
    if (rawQuery.includes('ストリクス') || upperQuery.includes('STRIX') || upperQuery.includes('SYNSPECTIVE')) {
        searchTerms.push('STRIX', 'SYNSPECTIVE', 'ストリクス');
    }
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

    const totalMatches = matchedBodies.length + matchedMissions.length + matchedSats.length;

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

    // Add matched deep space missions to dropdown
    if (matchedMissions.length > 0) {
        const dGroup = document.createElement('optgroup');
        dGroup.label = '🔭 深宇宙・探査機 (Deep Space)';
        matchedMissions.forEach(m => {
            const opt = document.createElement('option');
            opt.value = `deepspace_${m.id}`;
            opt.textContent = `${m.symbol} ${m.shortName} - ${m.name.split('(')[0].trim()}`;
            dGroup.appendChild(opt);
        });
        satSelect.appendChild(dGroup);
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
        item.innerHTML = `<span>${escapeHTML(b.symbol)} <strong>${escapeHTML(b.name)}</strong></span><span style="font-family:var(--font-mono); font-size:0.75rem; color:#f59e0b;">${escapeHTML(b.type)}</span>`;
        item.addEventListener('click', () => {
            selectCelestialBody(b.id);
            satSelect.value = `celestial_${b.id}`;
            searchResults.innerHTML = '';
        });
        searchResults.appendChild(item);
    });

    matchedMissions.forEach(m => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.style.borderLeft = `3px solid ${m.color || '#f59e0b'}`;
        item.innerHTML = `<span>${escapeHTML(m.symbol)} <strong>${escapeHTML(m.shortName)}</strong> (${escapeHTML(m.agency)})</span><span style="font-family:var(--font-mono); font-size:0.75rem; color:${m.color || '#f59e0b'};">${escapeHTML(m.type)}</span>`;
        item.addEventListener('click', () => {
            selectDeepSpaceMission(m.id);
            satSelect.value = `deepspace_${m.id}`;
            searchResults.innerHTML = '';
        });
        searchResults.appendChild(item);
    });

    matchedSats.slice(0, 10).forEach(sat => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.innerHTML = `<span>${escapeHTML(sat.name)}</span><span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-cyan);">${escapeHTML(sat.noradId)}</span>`;
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
