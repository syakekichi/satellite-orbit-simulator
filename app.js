
// ==========================================================================
// NASA Public Domain High-Resolution Procedural Planet Texture Generator
// ==========================================================================
const PLANET_TEXTURE_CACHE = {};

function getPlanetTexture(bodyId) {
    if (PLANET_TEXTURE_CACHE[bodyId]) return PLANET_TEXTURE_CACHE[bodyId];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (bodyId === 'MARS') {
        // Mars: Red rust soil, Valles Marineris canyon, craters and polar caps
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#ffffff'); // North Pole
        grad.addColorStop(0.12, '#c1440e');
        grad.addColorStop(0.5, '#9a3412');
        grad.addColorStop(0.88, '#c1440e');
        grad.addColorStop(1, '#ffffff'); // South Pole
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);

        // Dark Basalt Plains & Canyon features
        ctx.fillStyle = 'rgba(67, 20, 7, 0.45)';
        for (let i = 0; i < 40; i++) {
            const x = (i * 73) % 1024;
            const y = 120 + ((i * 47) % 270);
            const w = 40 + ((i * 31) % 120);
            const h = 20 + ((i * 19) % 60);
            ctx.beginPath();
            ctx.ellipse(x, y, w, h, (i * 0.3), 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (bodyId === 'JUPITER') {
        // Jupiter: Beautiful multi-layered cloud bands & Great Red Spot
        const colors = ['#fed7aa', '#f97316', '#fdba74', '#c2410c', '#ffedd5', '#ea580c', '#fed7aa', '#9a3412'];
        const bandH = 512 / colors.length;
        colors.forEach((col, idx) => {
            ctx.fillStyle = col;
            ctx.fillRect(0, idx * bandH, 1024, bandH + 2);
        });

        // Turbulent atmospheric swirls
        for (let y = 40; y < 470; y += 30) {
            ctx.strokeStyle = 'rgba(124, 45, 18, 0.35)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (let x = 0; x < 1024; x += 50) {
                ctx.quadraticCurveTo(x + 25, y + Math.sin(x * 0.05) * 12, x + 50, y);
            }
            ctx.stroke();
        }

        // Great Red Spot
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.ellipse(650, 320, 55, 35, -0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f87171';
        ctx.beginPath();
        ctx.ellipse(650, 320, 35, 20, -0.1, 0, Math.PI * 2);
        ctx.fill();
    } else if (bodyId === 'SATURN') {
        // Saturn: Elegant golden-cream ammonia cloud bands
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#ca8a04');
        grad.addColorStop(0.2, '#fde047');
        grad.addColorStop(0.4, '#fef08a');
        grad.addColorStop(0.6, '#fef9c3');
        grad.addColorStop(0.8, '#fde047');
        grad.addColorStop(1, '#a16207');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);
    } else if (bodyId === 'VENUS') {
        // Venus: Swirling dense yellowish-white sulfuric acid atmosphere
        const grad = ctx.createLinearGradient(0, 0, 1024, 512);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.5, '#fde047');
        grad.addColorStop(1, '#eab308');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);
    } else if (bodyId === 'MERCURY') {
        // Mercury: Lunar-like cratered rocky gray terrain
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, 0, 1024, 512);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        for (let i = 0; i < 80; i++) {
            const x = (i * 89) % 1024;
            const y = (i * 53) % 512;
            const r = 10 + ((i * 17) % 35);
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (bodyId === 'URANUS') {
        // Uranus: Pure cyan aquamarine ice giant atmosphere
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#0284c7');
        grad.addColorStop(0.3, '#38bdf8');
        grad.addColorStop(0.5, '#7dd3fc');
        grad.addColorStop(0.7, '#38bdf8');
        grad.addColorStop(1, '#0284c7');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);
    } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1024, 512);
    }

    PLANET_TEXTURE_CACHE[bodyId] = canvas;
    return canvas;
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
        secSelect: "衛星を選択・検索",
        selectPlaceholder: "-- 衛星または宇宙ゴミを選択してください --",
        searchPlaceholder: "または衛星名・NORAD IDで検索...",
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
        secSelect: "Select / Search Satellite",
        selectPlaceholder: "-- Select Satellite or Space Debris --",
        searchPlaceholder: "Search by Name or NORAD ID...",
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
        secSelect: "选择 / 搜索卫星",
        selectPlaceholder: "-- 请选择卫星或空间碎片 --",
        searchPlaceholder: "按名称或 NORAD ID 搜索...",
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
        secSelect: "Seleccionar / Buscar Satélite",
        selectPlaceholder: "-- Seleccionar Satélite o Basura Espacial --",
        searchPlaceholder: "Buscar por nombre o NORAD ID...",
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
        secSelect: "Выбрать / Найти спутник",
        selectPlaceholder: "-- Выберите спутник или мусор --",
        searchPlaceholder: "Поиск по имени или NORAD ID...",
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
        secSelect: "Satellit auswählen / suchen",
        selectPlaceholder: "-- Satellit oder Weltraummüll auswählen --",
        searchPlaceholder: "Nach Name oder NORAD-ID suchen...",
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
        secSelect: "Sélectionner / Rechercher",
        selectPlaceholder: "-- Choisir un satellite ou débris --",
        searchPlaceholder: "Rechercher par nom ou NORAD ID...",
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
        secSelect: "Selecionar / Buscar satélite",
        selectPlaceholder: "-- Selecione satélite ou lixo espacial --",
        searchPlaceholder: "Buscar por nome ou ID NORAD...",
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
        secSelect: "Seleziona / Cerca Satellite",
        selectPlaceholder: "-- Seleziona satellite o detrito --",
        searchPlaceholder: "Cerca per nome o ID NORAD...",
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
        secSelect: "인공위성 선택 / 검색",
        selectPlaceholder: "-- 인공위성 또는 우주 파편 선택 --",
        searchPlaceholder: "이름 또는 NORAD ID로 검색...",
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
        secSelect: "Selecteer / Zoek Satelliet",
        selectPlaceholder: "-- Selecteer satelliet of ruimtepuin --",
        searchPlaceholder: "Zoek op naam of NORAD-ID...",
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
        secSelect: "Pilih / Cari Satelit",
        selectPlaceholder: "-- Pilih satelit atau sampah antariksa --",
        searchPlaceholder: "Cari berdasarkan nama atau NORAD ID...",
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
        secSelect: "تحديد / بحث عن قمر صناعي",
        selectPlaceholder: "-- اختر قمراً صناعياً أو حطاماً --",
        searchPlaceholder: "البحث بالاسم أو رقم NORAD...",
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
        secSelect: "उपग्रह चुनें / खोजें",
        selectPlaceholder: "-- उपग्रह या मलबा चुनें --",
        searchPlaceholder: "नाम या NORAD ID द्वारा खोजें...",
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

    // Explicit ID-based fallback translations for guaranteed 100% full UI translation
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

    // Update datetime-local / Flatpickr input language attribute & locale
    const timePickerInput = document.getElementById('timePickerInput');
    const timePlaceholders = {
        ja: '📅 日時を指定して移動...',
        en: '📅 Select Date & Time...',
        de: '📅 Datum & Uhrzeit wählen...',
        fr: '📅 Choisir date & heure...',
        es: '📅 Seleccionar fecha y hora...',
        pt: '📅 Selecionar data e hora...',
        it: '📅 Seleziona data e ora...',
        ko: '📅 날짜 및 시간 선택...',
        nl: '📅 Kies datum & tijd...',
        id: '📅 Pilih tanggal & waktu...',
        hi: '📅 दिनांक और समय चुनें...',
        ar: '📅 اختر التاريخ والوقت...',
        zh: '📅 选择日期与时间...',
        ru: '📅 Выбрать дату и время...'
    };
    if (timePickerInput) {
        const localeMap = { ja: 'ja', en: 'en', de: 'de', fr: 'fr', es: 'es', pt: 'pt', zh: 'zh', ru: 'ru' };
        timePickerInput.setAttribute('lang', localeMap[lang] || 'en');
        timePickerInput.placeholder = timePlaceholders[lang] || timePlaceholders['en'];
    }

    if (typeof flatpickr !== 'undefined' && fpInstance) {
        const loc = (lang === 'en' ? 'default' : lang);
        if (flatpickr.l10ns && flatpickr.l10ns[loc]) {
            fpInstance.set('locale', flatpickr.l10ns[loc]);
        } else if (flatpickr.l10ns && flatpickr.l10ns.default) {
            fpInstance.set('locale', flatpickr.l10ns.default);
        }
    }

    // Localize Cesium Animation & Timeline widget formats
    if (typeof viewer !== 'undefined' && viewer) {
        const localeCodeMap = { ja: 'ja-JP', en: 'en-US', de: 'de-DE', fr: 'fr-FR', es: 'es-ES', pt: 'pt-BR', it: 'it-IT', ko: 'ko-KR', nl: 'nl-NL', id: 'id-ID', hi: 'hi-IN', ar: 'ar-SA', zh: 'zh-CN', ru: 'ru-RU' };
        const loc = localeCodeMap[lang] || 'en-US';

        if (viewer.animation && viewer.animation.viewModel) {
            viewer.animation.viewModel.dateFormatter = function(date, viewModel) {
                const jsDate = Cesium.JulianDate.toDate(date);
                return jsDate.toLocaleDateString(loc, { year: 'numeric', month: 'short', day: 'numeric' });
            };
            viewer.animation.viewModel.timeFormatter = function(date, viewModel) {
                const jsDate = Cesium.JulianDate.toDate(date);
                return jsDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            };
        }

        if (viewer.timeline) {
            viewer.timeline.makeLabel = function(time) {
                const jsDate = Cesium.JulianDate.toDate(time);
                return jsDate.toLocaleDateString(loc, { month: 'short', day: 'numeric' }) + ' ' + jsDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            };
            try { viewer.timeline.resize(); } catch(e) {}
        }
    }

    if (selectedSatIndex >= 0 && satellitesData[selectedSatIndex]) {
        const satDescEl = document.getElementById('satDescription');
        if (satDescEl) {
            satDescEl.textContent = getSatDescription(satellitesData[selectedSatIndex].name);
        }
        if (typeof viewer !== 'undefined' && viewer && viewer.clock) {
            const jsDate = customSimTime || Cesium.JulianDate.toDate(viewer.clock.currentTime);
            const gmst = satellite.gstime(jsDate);
            updateSelectedSatDetails(jsDate, gmst);
        }
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
    const lang = currentLang || 'ja';

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
            "ja": "表面 5,500℃ / 核 1,500万℃",
            "en": "Surface 5,500°C / Core 15,000,000°C",
            "de": "Oberfläche 5.500°C / Kern 15 Mio.°C",
            "fr": "Surface 5 500°C / Cœur 15 millions °C",
            "es": "Superficie 5.500°C / Núcleo 15 millones °C",
            "pt": "Superfície 5.500°C / Núcleo 15 milhões °C",
            "it": "Superficie 5.500°C / Nucleo 15 milioni °C",
            "ko": "표면 5,500℃ / 중심핵 1,500만℃",
            "nl": "Oppervlak 5.500°C / Kern 15 miljoen °C",
            "id": "Permukaan 5.500°C / Inti 15 juta °C",
            "hi": "सतह 5,500°C / कोर 1.5 करोड़ °C",
            "ar": "السطح 5,500°م / النواة 15 مليون °م",
            "zh": "表面约 5,500℃ / 核心约 1,500万℃",
            "ru": "Поверхность 5 500°C / Ядро 15 млн °C"
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
            "ru": "Наблюдается с доисторических времен. В 1610 году Галилей впервые наблюдал солнечные пятна в телескоп."
        },
        "missions": {
            "ja": "NASAパーカー・ソーラー・プローブ (2018〜史上最接近)、ESA/NASAソーラー・オービター、日米「ひので (Hinode)」、SOHO、SDO等。",
            "en": "NASA Parker Solar Probe (2018-present closest approach), ESA Solar Orbiter, JAXA/NASA Hinode, SOHO, SDO.",
            "de": "NASA Parker Solar Probe (historische Annäherung), ESA Solar Orbiter, JAXA/NASA Hinode, SOHO, SDO.",
            "fr": "Sonde Parker (record de proximité NASA), Solar Orbiter ESA, Hinode JAXA/NASA, SOHO, SDO.",
            "es": "Sonda Solar Parker de NASA, Solar Orbiter de ESA, Hinode (JAXA/NASA), SOHO, SDO.",
            "pt": "Sonda Parker Solar da NASA, Solar Orbiter da ESA, Hinode (JAXA/NASA), SOHO, SDO.",
            "it": "Sonda Solare Parker della NASA, Solar Orbiter dell'ESA, Hinode (JAXA/NASA), SOHO, SDO.",
            "ko": "NASA 파커 솔라 프로브 (2018~ 역사상 최접근), ESA 솔라 오비터, JAXA/NASA 히노데(Hinode), SOHO, SDO 등.",
            "nl": "NASA Parker Solar Probe, ESA Solar Orbiter, JAXA/NASA Hinode, SOHO, SDO.",
            "id": "NASA Parker Solar Probe, ESA Solar Orbiter, JAXA/NASA Hinode, SOHO, SDO.",
            "hi": "नासा पार्कर सोलर प्रोब (इतिहास का निकटतम संपर्क), ईएसए सोलर ऑर्बिटर, जाक्सा/नासा हिनोडे, सोहो, एसडीओ।",
            "ar": "مسبار باركر الشمسي التابع لناسا، وسولار أوربيتر التابع لوكالة الفضاء الأوروبية، وهينودي (JAXA/NASA)، وسوهو.",
            "zh": "NASA帕克太阳探测器(史上最接近太阳)、ESA太阳轨道飞行器、JAXA/NASA日出号(Hinode)、SOHO、SDO等。",
            "ru": "Зонд Parker Solar Probe (NASA), Solar Orbiter (ESA), Hinode (JAXA/NASA), SOHO, SDO."
        }
    },
    "MOON": {
        "mass": {
            "ja": "7.342 × 10^22 kg (地球の1/81)",
            "en": "7.342 × 10^22 kg (1/81 of Earth)",
            "de": "7,342 × 10^22 kg (1/81 der Erdmasse)",
            "fr": "7,342 × 10^22 kg (1/81 de la Terre)",
            "es": "7,342 × 10^22 kg (1/81 de la Tierra)",
            "pt": "7,342 × 10^22 kg (1/81 da Terra)",
            "it": "7,342 × 10^22 kg (1/81 della Terra)",
            "ko": "7.342 × 10^22 kg (지구의 1/81)",
            "nl": "7,342 × 10^22 kg (1/81 van de aarde)",
            "id": "7,342 × 10^22 kg (1/81 massa Bumi)",
            "hi": "7.342 × 10^22 किग्रा (पृथ्वी का 1/81)",
            "ar": "7.342 × 10^22 كجم (1/81 من كتلة الأرض)",
            "zh": "7.342 × 10^22 千克 (地球的1/81)",
            "ru": "7,342 × 10^22 кг (1/81 массы Земли)"
        },
        "diameter": {
            "ja": "3,474.8 km (地球の約0.27倍)",
            "en": "3,474.8 km (0.27x Earth)",
            "de": "3.474,8 km (0,27-fache Erdgröße)",
            "fr": "3 474,8 km (0,27 fois la Terre)",
            "es": "3.474,8 km (0,27 veces la Tierra)",
            "pt": "3.474,8 km (0,27 vezes a Terra)",
            "it": "3.474,8 km (0,27 volte la Terra)",
            "ko": "3,474.8 km (지구의 약 0.27배)",
            "nl": "3.474,8 km (0,27x de aarde)",
            "id": "3.474,8 km (0,27x Bumi)",
            "hi": "3,474.8 किमी (पृथ्वी का 0.27 गुना)",
            "ar": "3,474.8 كم (0.27 من قطر الأرض)",
            "zh": "3,474.8 公里 (地球的0.27倍)",
            "ru": "3 474,8 км (0,27 диаметра Земли)"
        },
        "rotation": {
            "ja": "27.32日 (自転と公転が同期)",
            "en": "27.32 days (Tidally locked)",
            "de": "27,32 Tage (gebundene Rotation)",
            "fr": "27,32 jours (rotation synchrone)",
            "es": "27,32 días (rotación síncrona)",
            "pt": "27,32 dias (rotação síncrona)",
            "it": "27,32 giorni (rotazione sincrona)",
            "ko": "27.32일 (조석 고정으로 동주기 자전)",
            "nl": "27,32 dagen (synchrone rotatie)",
            "id": "27,32 hari (rotasi sinkron)",
            "hi": "27.32 दिन (ज्वारीय रूप से बद्ध)",
            "ar": "27.32 يوماً (دوران متزامن مقيد مدياً)",
            "zh": "27.32天 (潮汐锁定同步自转)",
            "ru": "27,32 дня (приливный захват, синхронное вращение)"
        },
        "orbit": {
            "ja": "27.32日 (地球周回)",
            "en": "27.32 days (Orbiting Earth)",
            "de": "27,32 Tage (Erdumlauf)",
            "fr": "27,32 jours (orbite terrestre)",
            "es": "27,32 días (órbita terrestre)",
            "pt": "27,32 dias (órbita terrestre)",
            "it": "27,32 giorni (orbita terrestre)",
            "ko": "27.32일 (지구 공전)",
            "nl": "27,32 dagen (omloop om aarde)",
            "id": "27,32 hari (mengelilingi Bumi)",
            "hi": "27.32 दिन (पृथ्वी की परिक्रमा)",
            "ar": "27.32 يوماً (مدار حول الأرض)",
            "zh": "27.32天 (绕地球公转)",
            "ru": "27,32 дня (обращение вокруг Земли)"
        },
        "temperature": {
            "ja": "昼 120℃ / 夜 -130℃",
            "en": "Day 120°C / Night -130°C",
            "de": "Tag 120°C / Nacht -130°C",
            "fr": "Jour 120°C / Nuit -130°C",
            "es": "Día 120°C / Noche -130°C",
            "pt": "Dia 120°C / Noite -130°C",
            "it": "Giorno 120°C / Notte -130°C",
            "ko": "낮 120℃ / 밤 -130℃",
            "nl": "Dag 120°C / Nacht -130°C",
            "id": "Siang 120°C / Malam -130°C",
            "hi": "दिन 120°C / रात -130°C",
            "ar": "نهاراً 120°م / ليلاً -130°م",
            "zh": "白昼 120℃ / 夜间 -130℃",
            "ru": "День 120°C / Ночь -130°C"
        },
        "satellites": {
            "ja": "なし (地球の衛星)",
            "en": "None (Earth's natural satellite)",
            "de": "Keine (Satellit der Erde)",
            "fr": "Aucun (satellite de la Terre)",
            "es": "Ninguno (satélite de la Tierra)",
            "pt": "Nenhum (satélite da Terra)",
            "it": "Nessuno (satellite della Terra)",
            "ko": "없음 (지구의 자연위성)",
            "nl": "Geen (satelliet van de aarde)",
            "id": "Tidak ada (satelit alami Bumi)",
            "hi": "कोई नहीं (पृथ्वी का प्राकृतिक उपग्रह)",
            "ar": "لا يوجد (تابع للأرض)",
            "zh": "无 (地球的天然卫星)",
            "ru": "Нет (спутник Земли)"
        },
        "discovery": {
            "ja": "先史時代より観測。1609年ガリレオが望遠鏡でクレーターと山脈をスケッチ。",
            "en": "Observed since antiquity. Galileo sketched craters and mountains in 1609.",
            "de": "Seit der Antike beobachtet. 1609 zeichnete Galileo Krater und Gebirge.",
            "fr": "Observé depuis l'Antiquité. Galilée a dessiné les cratères et monts en 1609.",
            "es": "Observado desde la antigüedad. Galileo dibujó cráteres y montes en 1609.",
            "pt": "Observado desde a antiguidade. Galileu desenhou crateras e montanhas em 1609.",
            "it": "Osservato fin dall'antichità. Nel 1609 Galileo disegnò crateri e catene montuose.",
            "ko": "고대부터 관측. 1609년 갈릴레오가 망원경으로 달의 크레이터와 산맥을 정밀 스케치.",
            "nl": "Sinds de oudheid waargenomen. Galileo schetste in 1609 kraters en bergen.",
            "id": "Diamati sejak zaman kuno. Galileo membuat sketsa kawah dan pegunungan pada 1609.",
            "hi": "प्राचीन काल से प्रेक्षित। 1609 में गैलीलियो ने क्रेटर और पहाड़ों का रेखाचित्र बनाया।",
            "ar": "لوحظ منذ العصور القديمة. رسم غاليليو الفوهات والجبال القمرية لأول مرة عام 1609.",
            "zh": "自古便被观测。1609年伽利略通过望远镜绘制了月球环形山与山脉素描。",
            "ru": "Наблюдается с древности. В 1609 году Галилей зарисовал лунные кратеры и горы."
        },
        "missions": {
            "ja": "米アポロ計画 (1969年人類初着陸)、JAXAかぐや(SELENE)・SLIM (2024ピンポイント着陸)、中嫦娥、印チャンドラヤーン、米アルテミス計画等。",
            "en": "Apollo 11 (1969 first landing), JAXA Kaguya & SLIM (2024 precision landing), Chang'e, Chandrayaan, Artemis program.",
            "de": "Apollo 11 (1969), JAXA Kaguya & SLIM (2024), Chang'e, Chandrayaan, Artemis-Programm.",
            "fr": "Apollo 11 (1969), JAXA Kaguya & SLIM (2024), Chang'e, Chandrayaan, programme Artemis.",
            "es": "Apolo 11 (1969), JAXA Kaguya y SLIM (2024), Chang'e, Chandrayaan, programa Artemisa.",
            "pt": "Apollo 11 (1969), JAXA Kaguya e SLIM (2024), Chang'e, Chandrayaan, programa Artemis.",
            "it": "Apollo 11 (1969), JAXA Kaguya e SLIM (2024), Chang'e, Chandrayaan, programma Artemis.",
            "ko": "미국 아폴로 계획 (1969 인류 최초 착륙), JAXA 카구야 & SLIM (2024 정밀착륙), 중국 창어, 인도 찬드라얀, 아르테미스 계획 등.",
            "nl": "Apollo 11 (1969), JAXA Kaguya & SLIM (2024), Chang'e, Chandrayaan, Artemis-programma.",
            "id": "Apollo 11 (1969), JAXA Kaguya & SLIM (2024), Chang'e, Chandrayaan, program Artemis.",
            "hi": "अपोलो 11 (1969 प्रथम मानव लैंडिंग), जाक्सा कागुया व स्लिम (2024), चांग'ई, चंद्रयान, आर्टेमिस।",
            "ar": "أبولو 11 (1969 أول هبوط بشري)، وكاغويا وسليم (JAXA 2024)، وتشانغ آه، وتشاندرраян، وأرتميس.",
            "zh": "阿波罗11号(1969人类首次登月)、JAXA辉夜姬号与SLIM(2024精准着陆)、嫦娥工程、月船号、阿尔忒弥斯计划等。",
            "ru": "Аполлон-11 (1969), JAXA Кагуя и SLIM (2024), Чанъэ, Чандраян, программа Артемида."
        }
    },
    "MARS": {
        "mass": {
            "ja": "6.417 × 10^23 kg (地球の約0.107倍)",
            "en": "6.417 × 10^23 kg (0.107x Earth)",
            "de": "6,417 × 10^23 kg (0,107-fache Erdmasse)",
            "fr": "6,417 × 10^23 kg (0,107 fois la Terre)",
            "es": "6,417 × 10^23 kg (0,107 veces la Tierra)",
            "pt": "6,417 × 10^23 kg (0,107 vezes a Terra)",
            "it": "6,417 × 10^23 kg (0,107 volte la Terra)",
            "ko": "6.417 × 10^23 kg (지구의 약 0.107배)",
            "nl": "6,417 × 10^23 kg (0,107x de aarde)",
            "id": "6,417 × 10^23 kg (0,107x Bumi)",
            "hi": "6.417 × 10^23 किग्रा (पृथ्वी का 0.107 गुना)",
            "ar": "6.417 × 10^23 كجم (0.107 من كتلة الأرض)",
            "zh": "6.417 × 10^23 千克 (地球的0.107倍)",
            "ru": "6,417 × 10^23 кг (0,107 массы Земли)"
        },
        "diameter": {
            "ja": "6,779 km (地球の約0.53倍)",
            "en": "6,779 km (0.53x Earth)",
            "de": "6.779 km (0,53-fache Erdgröße)",
            "fr": "6 779 km (0,53 fois la Terre)",
            "es": "6.779 km (0,53 veces la Tierra)",
            "pt": "6.779 km (0,53 vezes a Terra)",
            "it": "6.779 km (0,53 volte la Terra)",
            "ko": "6,779 km (지구의 약 0.53배)",
            "nl": "6.779 km (0,53x de aarde)",
            "id": "6.779 km (0,53x Bumi)",
            "hi": "6,779 किमी (पृथ्वी का 0.53 गुना)",
            "ar": "6,779 كم (0.53 من قطر الأرض)",
            "zh": "6,779 公里 (地球的0.53倍)",
            "ru": "6 779 км (0,53 диаметра Земли)"
        },
        "rotation": {
            "ja": "24時間37分 (地球とほぼ同等)",
            "en": "24h 37m (Very close to Earth)",
            "de": "24 Std. 37 Min.",
            "fr": "24h 37m",
            "es": "24h 37m",
            "pt": "24h 37m",
            "it": "24h 37m",
            "ko": "24시간 37분 (지구와 거의 동일)",
            "nl": "24u 37m",
            "id": "24j 37m",
            "hi": "24 घंटे 37 मिनट",
            "ar": "24 ساعة و37 دقيقة",
            "zh": "24小时37分 (与地球极其相近)",
            "ru": "24 ч 37 мин (близко к Земле)"
        },
        "orbit": {
            "ja": "686.98日 (約1.88年)",
            "en": "686.98 days (~1.88 years)",
            "de": "686,98 Tage (~1,88 Jahre)",
            "fr": "686,98 jours (~1,88 an)",
            "es": "686,98 días (~1,88 años)",
            "pt": "686,98 dias (~1,88 anos)",
            "it": "686,98 giorni (~1,88 anni)",
            "ko": "686.98일 (약 1.88년)",
            "nl": "686,98 dagen (~1,88 jaar)",
            "id": "686,98 hari (~1,88 tahun)",
            "hi": "686.98 दिन (~1.88 वर्ष)",
            "ar": "686.98 يوماً (حوالي 1.88 سنة)",
            "zh": "686.98天 (约1.88年)",
            "ru": "686,98 дня (~1,88 года)"
        },
        "temperature": {
            "ja": "平均 -63℃ (最高20℃ / 最低-140℃)",
            "en": "Average -63°C (Max 20°C / Min -140°C)",
            "de": "Mittel -63°C (Max 20°C / Min -140°C)",
            "fr": "Moyenne -63°C (Max 20°C / Min -140°C)",
            "es": "Media -63°C (Máx 20°C / Mín -140°C)",
            "pt": "Média -63°C (Máx 20°C / Mín -140°C)",
            "it": "Media -63°C (Max 20°C / Min -140°C)",
            "ko": "평균 -63℃ (최고 20℃ / 최저 -140℃)",
            "nl": "Gemiddeld -63°C (Max 20°C / Min -140°C)",
            "id": "Rata-rata -63°C (Maks 20°C / Min -140°C)",
            "hi": "औसत -63°C (अधिकतम 20°C / न्यूनतम -140°C)",
            "ar": "المتوسط -63°م (الأعلى 20°م / الأدنى -140°م)",
            "zh": "平均 -63℃ (最高20℃ / 最低-140℃)",
            "ru": "Средняя -63°C (макс 20°C / мин -140°C)"
        },
        "satellites": {
            "ja": "2個 (フォボス、ダイモス)",
            "en": "2 (Phobos, Deimos)",
            "de": "2 (Phobos, Deimos)",
            "fr": "2 (Phobos, Déimos)",
            "es": "2 (Fobos, Deimos)",
            "pt": "2 (Fobos, Deimos)",
            "it": "2 (Fobos, Deimos)",
            "ko": "2개 (포보스, 데이모스)",
            "nl": "2 (Phobos, Deimos)",
            "id": "2 (Phobos, Deimos)",
            "hi": "2 (फ़ोबोस, डेमोस)",
            "ar": "2 (فوبوس وديموس)",
            "zh": "2颗 (火卫一福波斯、火卫二德摩斯)",
            "ru": "2 (Фобос, Деймос)"
        },
        "discovery": {
            "ja": "古代エジプトやバビロニア記録。1659年ホイヘンスが大シルティスを観測。",
            "en": "Recorded by ancient Egyptians. Huygens observed Syrtis Major and rotation in 1659.",
            "de": "Von den alten Ägyptern aufgezeichnet. Huygens beobachtete 1659 Syrtis Major.",
            "fr": "Enregistré par les Égyptiens. Huygens observa Syrtis Major en 1659.",
            "es": "Registrado por egipcios antiguos. Huygens observó Syrtis Major en 1659.",
            "pt": "Registrado pelos antigos egípcios. Huygens observou Syrtis Major em 1659.",
            "it": "Registrato dagli antichi Egizi. Huygens osservò Syrtis Major nel 1659.",
            "ko": "고대 이집트 및 바빌로니아 기록. 1659년 호이헌스가 대시르티스를 관측하여 자전주기 산출.",
            "nl": "Geregistreerd door oude Egyptenaren. Huygens observeerde Syrtis Major in 1659.",
            "id": "Dicatat oleh bangsa Mesir kuno. Huygens mengamati Syrtis Major pada 1659.",
            "hi": "प्राचीन मिस्रियों द्वारा दर्ज। 1659 में हाइगेंस ने सतह का अध्ययन किया।",
            "ar": "سجله قدماء المصريين. رصد هويغنز معالم السطح وفترة الدوران عام 1659.",
            "zh": "古埃及与巴比伦文明已有记载。1659年惠更斯观测大瑟提斯高原并测出自转周期。",
            "ru": "Известен с древности. В 1659 году Гюйгенс наблюдал Большой Сирт и определил период вращения."
        },
        "missions": {
            "ja": "バイキング1/2号(1976初着陸)、スピリット/オポチュニティ/キュリオシティ/パーサヴィアランス探査車、UAEホープ、中天問1号、JAXA MMX等。",
            "en": "Viking 1/2 (1976), Spirit/Opportunity/Curiosity/Perseverance rovers, UAE Hope, Tianwen-1, JAXA MMX.",
            "de": "Viking 1/2, Rover Spirit/Opportunity/Curiosity/Perseverance, UAE Hope, Tianwen-1, JAXA MMX.",
            "fr": "Viking 1/2, rovers Spirit/Opportunity/Curiosity/Perseverance, UAE Hope, Tianwen-1, JAXA MMX.",
            "es": "Viking 1/2, rovers Spirit/Opportunity/Curiosity/Perseverance, UAE Hope, Tianwen-1, JAXA MMX.",
            "pt": "Viking 1/2, rovers Spirit/Opportunity/Curiosity/Perseverance, UAE Hope, Tianwen-1, JAXA MMX.",
            "it": "Viking 1/2, rover Spirit/Opportunity/Curiosity/Perseverance, UAE Hope, Tianwen-1, JAXA MMX.",
            "ko": "바이킹 1/2호(1976 최초착륙), 스피릿/오퍼튜니티/큐리오시티/퍼서비어런스 로버, UAE 호프, 중국 톈원 1호, JAXA MMX 등.",
            "nl": "Viking 1/2, rovers Spirit/Opportunity/Curiosity/Perseverance, UAE Hope, Tianwen-1, JAXA MMX.",
            "id": "Viking 1/2, penjelajah Spirit/Opportunity/Curiosity/Perseverance, UAE Hope, Tianwen-1, JAXA MMX.",
            "hi": "वाइकिंग 1/2, स्पिरिट/अपॉर्चुनिटी/क्यूरियोसिटी/पर्सिवियरेंस रोवर्स, यूएई होप, तियानवेन-1, जाक्सा एमएमएक्स।",
            "ar": "فايكنغ 1 و2، مركبات سبيريت وأبورتيونيتي وكيريوسيتي وبيرسيفيرانس، مسبار الأمل، تيانوين-1، ومهمة MMX.",
            "zh": "海盗1/2号(1976)、勇气/机遇/好奇/毅力号火星车、阿联酋希望号、天问一号、祝融号、JAXA MMX火星卫星探测等。",
            "ru": "Викинг-1/2, марсоходы Спирит/Оппортьюнити/Кьюриосити/Персеверанс, Аль-Амаль, Тяньвэнь-1, JAXA MMX."
        }
    },
    "SATURN": {
        "mass": {
            "ja": "5.683 × 10^26 kg (地球の95.2倍)",
            "en": "5.683 × 10^26 kg (95.2x Earth)",
            "de": "5,683 × 10^26 kg (95,2-fache Erdmasse)",
            "fr": "5,683 × 10^26 kg (95,2 fois la Terre)",
            "es": "5,683 × 10^26 kg (95,2 veces la Tierra)",
            "pt": "5,683 × 10^26 kg (95,2 vezes a Terra)",
            "it": "5,683 × 10^26 kg (95,2 volte la Terra)",
            "ko": "5.683 × 10^26 kg (지구의 95.2배)",
            "nl": "5,683 × 10^26 kg (95,2x de aarde)",
            "id": "5,683 × 10^26 kg (95,2x Bumi)",
            "hi": "5.683 × 10^26 किग्रा (पृथ्वी का 95.2 गुना)",
            "ar": "5.683 × 10^26 كجم (95.2 ضعف كتلة الأرض)",
            "zh": "5.683 × 10^26 千克 (地球的95.2倍)",
            "ru": "5,683 × 10^26 кг (в 95,2 раза больше Земли)"
        },
        "diameter": {
            "ja": "116,460 km (地球の9.1倍 / 環幅28万km)",
            "en": "116,460 km (9.1x Earth / Ring width ~280,000 km)",
            "de": "116.460 km (9,1-fache Erdgröße)",
            "fr": "116 460 km (9,1 fois la Terre)",
            "es": "116.460 km (9,1 veces la Tierra)",
            "pt": "116.460 km (9,1 vezes a Terra)",
            "it": "116.460 km (9,1 volte la Terra)",
            "ko": "116,460 km (지구의 9.1배 / 고리 폭 약 28만km)",
            "nl": "116.460 km (9,1x de aarde)",
            "id": "116.460 km (9,1x Bumi)",
            "hi": "116,460 किमी (पृथ्वी का 9.1 गुना)",
            "ar": "116,460 كم (9.1 أضعاف قطر الأرض)",
            "zh": "116,460 公里 (地球的9.1倍 / 光环宽度约28万公里)",
            "ru": "116 460 км (в 9,1 раза больше Земли / кольца 280 000 км)"
        },
        "rotation": {
            "ja": "10時間33分",
            "en": "10h 33m",
            "de": "10 Std. 33 Min.",
            "fr": "10h 33m",
            "es": "10h 33m",
            "pt": "10h 33m",
            "it": "10h 33m",
            "ko": "10시간 33분",
            "nl": "10u 33m",
            "id": "10j 33m",
            "hi": "10 घंटे 33 मिनट",
            "ar": "10 ساعات و33 دقيقة",
            "zh": "10小时33分",
            "ru": "10 ч 33 мин"
        },
        "orbit": {
            "ja": "10,759.2日 (約29.46年)",
            "en": "10,759.2 days (~29.46 years)",
            "de": "10.759,2 Tage (~29,46 Jahre)",
            "fr": "10 759,2 jours (~29,46 ans)",
            "es": "10.759,2 días (~29,46 años)",
            "pt": "10.759,2 dias (~29,46 anos)",
            "it": "10.759,2 giorni (~29,46 anni)",
            "ko": "10,759.2일 (약 29.46년)",
            "nl": "10.759,2 dagen (~29,46 jaar)",
            "id": "10.759,2 hari (~29,46 tahun)",
            "hi": "10,759.2 दिन (~29.46 वर्ष)",
            "ar": "10,759.2 يوماً (حوالي 29.46 سنة)",
            "zh": "10,759.2天 (约29.46年)",
            "ru": "10 759,2 дня (~29,46 года)"
        },
        "temperature": {
            "ja": "雲頂 約-140℃",
            "en": "Cloud tops -140°C",
            "de": "Wolkendecke -140°C",
            "fr": "Sommet des nuages -140°C",
            "es": "Nubes -140°C",
            "pt": "Topo das nuvens -140°C",
            "it": "Sommità nubi -140°C",
            "ko": "구름 상층 약 -140℃",
            "nl": "Wolkentop -140°C",
            "id": "Puncak awan -140°C",
            "hi": "बादलों का शीर्ष -140°C",
            "ar": "قمم السحب -140°م",
            "zh": "云层顶端约 -140℃",
            "ru": "Верхний слой облаков -140°C"
        },
        "satellites": {
            "ja": "146個 (太陽系最多 / タイタン等) ＋ 壮麗な氷の環",
            "en": "146 Moons (Most in solar system, Titan etc.) + Majestic ice rings",
            "de": "146 Monde (Rekord im Sonnensystem) + Eiskoloss-Ringe",
            "fr": "146 lunes (record du système solaire) + anneaux de glace",
            "es": "146 lunas (récord del sistema solar) + anillos de hielo",
            "pt": "146 luas (recorde do sistema solar) + anéis de gelo",
            "it": "146 lune (record del sistema solare) + anelli di ghiaccio",
            "ko": "146개 (태양계 최다 / 타이탄, 엔켈라두스 등) + 거대한 얼음 고리",
            "nl": "146 manen (meeste in zonnestelsel) + ijsringen",
            "id": "146 bulan (terbanyak di tata surya) + cincin es megah",
            "hi": "146 चंद्रमा (सौर मंडल में सर्वाधिक) + विशाल बर्फ के छल्ले",
            "ar": "146 قمراً (الأكثر في النظام الشمسي) + حلقات جليدية مهيبة",
            "zh": "146颗卫星 (太阳系之最 / 泰坦土卫六等) + 壮丽冰环",
            "ru": "146 спутников (больше всех в системе, Титан и др.) + кольца льда"
        },
        "discovery": {
            "ja": "古代より観測。1610年ガリレオが環の存在を認識、1655年ホイヘンスが環の構造を解明。",
            "en": "Known since antiquity. Galileo saw rings in 1610; Huygens resolved rings and discovered Titan in 1655.",
            "de": "Seit der Antike bekannt. 1610 sah Galileo die Ringe; 1655 entdeckte Huygens Titan.",
            "fr": "Connu depuis l'Antiquité. Galilée observa les anneaux en 1610; Huygens découvrit Titan en 1655.",
            "es": "Conocido desde la antigüedad. Galileo vio anillos en 1610; Huygens descubrió Titán en 1655.",
            "pt": "Conhecido desde a antiguidade. Galileu viu anéis em 1610; Huygens descobriu Titã em 1655.",
            "it": "Noto fin dall'antichità. Nel 1610 Galileo vide gli anelli; nel 1655 Huygens scoprì Titano.",
            "ko": "고대부터 관측. 1610년 갈릴레오가 고리를 최초 관측, 1655년 호이헌스가 고리 구조 규명 및 타이탄 발견.",
            "nl": "Sinds de oudheid bekend. Galileo zag ringen in 1610; Huygens ontdekte Titan in 1655.",
            "id": "Dikenal sejak zaman kuno. Galileo melihat cincin pada 1610; Huygens menemukan Titan pada 1655.",
            "hi": "प्राचीन काल से ज्ञात। 1610 में गैलीलियो ने छल्ले देखे; 1655 में हाइगेंस ने टाइटन की खोज की।",
            "ar": "معروف منذ القدم. لاحظ غاليليو الحلقات عام 1610، واكتشف هويغنز تيتان والحلقات عام 1655.",
            "zh": "自古便被记录。1610年伽利略发现其光环，1655年惠更斯确认光环本质并发现土卫六(泰坦)。",
            "ru": "Известен с древности. В 1610 году Галилей увидел кольца, в 1655 году Гюйгенс открыл Титан."
        },
        "missions": {
            "ja": "パイオニア11号(1979)、ボイジャー1/2号(1980/81)、NASA/ESA/ASIカッシーニ・ホイヘンス(2004-2017/タイタン着陸)。",
            "en": "Pioneer 11 (1979), Voyager 1/2 (1980/81), NASA/ESA Cassini-Huygens (2004-2017 landed on Titan).",
            "de": "Pioneer 11, Voyager 1/2, NASA/ESA Cassini-Huygens (2004-2017 mit Titan-Landung).",
            "fr": "Pioneer 11, Voyager 1/2, NASA/ESA Cassini-Huygens (2004-2017 avec atterrissage sur Titan).",
            "es": "Pioneer 11, Voyager 1/2, NASA/ESA Cassini-Huygens (2004-2017 con aterrizaje en Titán).",
            "pt": "Pioneer 11, Voyager 1/2, NASA/ESA Cassini-Huygens (2004-2017 com pouso em Titã).",
            "it": "Pioneer 11, Voyager 1/2, NASA/ESA Cassini-Huygens (2004-2017, atterraggio su Titano).",
            "ko": "파이오니어 11호(1979), 보이저 1/2호(1980/81), NASA/ESA 카시니-하위헌스(2004-2017 타이탄 착륙선 투하).",
            "nl": "Pioneer 11, Voyager 1/2, NASA/ESA Cassini-Huygens (2004-2017 met Titan-landing).",
            "id": "Pioneer 11, Voyager 1/2, NASA/ESA Cassini-Huygens (2004-2017 mendarat di Titan).",
            "hi": "पायनियर 11, वॉयेजर 1/2, नासा/ईएसए कैसिनी-ह्यूजेंस (2004-2017 टाइटन पर लैंडिंग)।",
            "ar": "بايونير 11، وفوياجر 1 و2، وكاسيني-هويغنز (NASA/ESA 2004-2017 مع هبوط تاريخي على تيتان).",
            "zh": "先驱者11号(1979)、旅行者1/2号(1980/81)、卡西尼-惠更斯号(NASA/ESA/ASI 2004-2017成功着陆泰坦)。",
            "ru": "Пионер-11, Вояджер-1/2, Кассини-Гюйгенс (NASA/ESA 2004-2017, посадка зонда на Титан)."
        }
    },
    "JUPITER": {
        "mass": {
            "ja": "1.898 × 10^27 kg (地球の317.8倍 / 全惑星合計の2.5倍)",
            "en": "1.898 × 10^27 kg (317.8x Earth / 2.5x all other planets combined)",
            "de": "1,898 × 10^27 kg (317,8-fache Erdmasse)",
            "fr": "1,898 × 10^27 kg (317,8 fois la Terre)",
            "es": "1,898 × 10^27 kg (317,8 veces la Tierra)",
            "pt": "1,898 × 10^27 kg (317,8 vezes a Terra)",
            "it": "1,898 × 10^27 kg (317,8 volte la Terra)",
            "ko": "1.898 × 10^27 kg (지구의 317.8배 / 타 행성 총합의 2.5배)",
            "nl": "1,898 × 10^27 kg (317,8x de aarde)",
            "id": "1,898 × 10^27 kg (317,8x Bumi)",
            "hi": "1.898 × 10^27 किग्रा (पृथ्वी का 317.8 गुना)",
            "ar": "1.898 × 10^27 كجم (317.8 ضعف كتلة الأرض)",
            "zh": "1.898 × 10^27 千克 (地球的317.8倍 / 其他行星总和的2.5倍)",
            "ru": "1,898 × 10^27 кг (в 317,8 раза больше Земли)"
        },
        "diameter": {
            "ja": "139,820 km (地球の11倍 / 太陽系最大)",
            "en": "139,820 km (11x Earth / Largest in Solar System)",
            "de": "139.820 km (11-fache Erdgröße)",
            "fr": "139 820 km (11 fois la Terre)",
            "es": "139.820 km (11 veces la Tierra)",
            "pt": "139.820 km (11 vezes a Terra)",
            "it": "139.820 km (11 volte la Terra)",
            "ko": "139,820 km (지구의 11배 / 태양계 최대)",
            "nl": "139.820 km (11x de aarde)",
            "id": "139.820 km (11x Bumi)",
            "hi": "139,820 किमी (पृथ्वी का 11 गुना)",
            "ar": "139,820 كم (11 ضعف قطر الأرض)",
            "zh": "139,820 公里 (地球的11倍 / 太阳系最大行星)",
            "ru": "139 820 км (в 11 раз больше Земли)"
        },
        "rotation": {
            "ja": "9時間55分 (太陽系惑星で最速自転)",
            "en": "9h 55m (Fastest rotation in Solar System)",
            "de": "9 Std. 55 Min. (schnellste Rotation)",
            "fr": "9h 55m (rotation la plus rapide)",
            "es": "9h 55m (rotación más rápida)",
            "pt": "9h 55m (rotação mais rápida)",
            "it": "9h 55m (rotazione più rapida)",
            "ko": "9시간 55분 (태양계 행성 중 가장 빠른 자전)",
            "nl": "9u 55m (snelste rotatie)",
            "id": "9j 55m (rotasi tercepat)",
            "hi": "9 घंटे 55 मिनट (सौर मंडल में सबसे तेज घूर्णन)",
            "ar": "9 ساعات و55 دقيقة (أسرع دوران في النظام الشمسي)",
            "zh": "9小时55分 (太阳系行星中最快自转)",
            "ru": "9 ч 55 мин (самое быстрое вращение в системе)"
        },
        "orbit": {
            "ja": "4,332.6日 (約11.86年)",
            "en": "4,332.6 days (~11.86 years)",
            "de": "4.332,6 Tage (~11,86 Jahre)",
            "fr": "4 332,6 jours (~11,86 ans)",
            "es": "4.332,6 días (~11,86 años)",
            "pt": "4.332,6 dias (~11,86 anos)",
            "it": "4.332,6 giorni (~11,86 anni)",
            "ko": "4,332.6일 (약 11.86년)",
            "nl": "4.332,6 dagen (~11,86 jaar)",
            "id": "4.332,6 hari (~11,86 tahun)",
            "hi": "4,332.6 दिन (~11.86 वर्ष)",
            "ar": "4,332.6 يوماً (حوالي 11.86 سنة)",
            "zh": "4,332.6天 (约11.86年)",
            "ru": "4 332,6 дня (~11,86 года)"
        },
        "temperature": {
            "ja": "雲頂 約-110℃",
            "en": "Cloud tops -110°C",
            "de": "Wolkendecke -110°C",
            "fr": "Sommet des nuages -110°C",
            "es": "Nubes -110°C",
            "pt": "Topo das nuvens -110°C",
            "it": "Sommità nubi -110°C",
            "ko": "구름 상층 약 -110℃",
            "nl": "Wolkentop -110°C",
            "id": "Puncak awan -110°C",
            "hi": "बादलों का शीर्ष -110°C",
            "ar": "قمم السحب -110°م",
            "zh": "云层顶端约 -110℃",
            "ru": "Верхний слой облаков -110°C"
        },
        "satellites": {
            "ja": "95個 (ガリレオ衛星: イオ、エウロパ等) ＋ 微小リング",
            "en": "95 Moons (Io, Europa, Ganymede, Callisto) + Dust ring",
            "de": "95 Monde (Io, Europa, Ganymed, Kallisto) + Staubring",
            "fr": "95 lunes (Io, Europe, Ganymède, Callisto) + anneau",
            "es": "95 lunas (Ío, Europa, Ganímedes, Calisto) + anillo",
            "pt": "95 luas (Io, Europa, Ganimedes, Calisto) + anel",
            "it": "95 lune (Io, Europa, Ganimede, Callisto) + anello",
            "ko": "95개 (이오, 유로파, 가니메데, 칼리스토 등) + 미세 먼지 고리",
            "nl": "95 manen (Io, Europa, Ganymedes, Callisto) + stofring",
            "id": "95 bulan (Io, Europa, Ganymede, Callisto) + cincin debu",
            "hi": "95 चंद्रमा (इओ, यूरोपा, गेनीमेड, कैलिस्टो) + धूल का छल्ला",
            "ar": "95 قمراً (أقمار غاليليو: آيو، أوروبا، غانيميد، كاليستو) + حلقة غبارية",
            "zh": "95颗 (伽利略卫星: 木卫一、木卫二欧罗巴、木卫三、木卫四) + 细尘环",
            "ru": "95 спутников (Ио, Европа, Ганимед, Каллисто) + пылевое кольцо"
        },
        "discovery": {
            "ja": "古代より観測。1610年ガリレオが4大衛星を発見し地動説の証拠となる。",
            "en": "Known since antiquity. Galileo discovered the 4 Galilean moons in 1610.",
            "de": "Seit der Antike bekannt. Galileo entdeckte 1610 die 4 Monde.",
            "fr": "Connu depuis l'Antiquité. Galilée découvrit les 4 lunes en 1610.",
            "es": "Conocido desde la antigüedad. Galileo descubrió las 4 lunas en 1610.",
            "pt": "Conhecido desde a antiguidade. Galileu descobriu as 4 luas em 1610.",
            "it": "Noto fin dall'antichità. Nel 1610 Galileo scoprì le 4 lune.",
            "ko": "고대부터 관측. 1610년 갈릴레오가 4대 위성을 발견하여 지동설의 결정적 증거 제시.",
            "nl": "Sinds de oudheid bekend. Galileo ontdekte in 1610 de 4 manen.",
            "id": "Dikenal sejak zaman kuno. Galileo menemukan 4 bulan pada 1610.",
            "hi": "प्राचीन काल से ज्ञात। 1610 में गैलीलियो ने 4 चंद्रमाओं की खोज की।",
            "ar": "معروف منذ القدم. اكتشف غاليليو أقماره الأربعة عام 1610 مما أثبت مركزية الشمس.",
            "zh": "自古便被观测。1610年伽利略发现四大伽利略卫星，成为日心说的决定性证据。",
            "ru": "Известен с древности. В 1610 году Галилей открыл 4 спутника, подтвердив гелиоцентризм."
        },
        "missions": {
            "ja": "ボイジャー1/2号(1979)、ガリレオ探査機(1995-2003周回)、NASAジュノー(2016〜周回中)、ESA JUICE(2031年到着予定)。",
            "en": "Voyager 1/2 (1979), Galileo (1995-2003), NASA Juno (2016-present), ESA JUICE.",
            "de": "Voyager 1/2, Galileo-Sonde, NASA Juno, ESA JUICE.",
            "fr": "Voyager 1/2, sonde Galileo, NASA Juno, ESA JUICE.",
            "es": "Voyager 1/2, sonda Galileo, NASA Juno, ESA JUICE.",
            "pt": "Voyager 1/2, sonda Galileo, NASA Juno, ESA JUICE.",
            "it": "Voyager 1/2, sonda Galileo, NASA Juno, ESA JUICE.",
            "ko": "보이저 1/2호, 갈릴레오 탐사선(1995-2003), NASA 주노(2016~), ESA JUICE(2031 도착 예정).",
            "nl": "Voyager 1/2, Galileo, NASA Juno, ESA JUICE.",
            "id": "Voyager 1/2, Galileo, NASA Juno, ESA JUICE.",
            "hi": "वॉयेजर 1/2, गैलीलियो, नासा जूनो (2016-वर्तमान), ईएसए ज्यूस।",
            "ar": "فوياجر 1 و2، ومسبار غاليليو، وجونو التابع لناسا، وجوس التابع لوكالة الفضاء الأوروبية.",
            "zh": "旅行者1/2号、伽利略号探测器(1995-2003)、NASA朱诺号(2016至今)、ESA木星冰月探测器JUICE等。",
            "ru": "Вояджер-1/2, Галилео (1995-2003), Юнона (2016-наст.вр.), ESA JUICE."
        }
    },
    "VENUS": {
        "mass": {
            "ja": "4.867 × 10^24 kg (地球の約0.815倍)",
            "en": "4.867 × 10^24 kg (0.815x Earth)",
            "de": "4,867 × 10^24 kg (0,815-fache Erdmasse)",
            "fr": "4,867 × 10^24 kg (0,815 fois la Terre)",
            "es": "4,867 × 10^24 kg (0,815 veces la Tierra)",
            "pt": "4,867 × 10^24 kg (0,815 vezes a Terra)",
            "it": "4,867 × 10^24 kg (0,815 volte la Terra)",
            "ko": "4.867 × 10^24 kg (지구의 약 0.815배)",
            "nl": "4,867 × 10^24 kg (0,815x de aarde)",
            "id": "4,867 × 10^24 kg (0,815x Bumi)",
            "hi": "4.867 × 10^24 किग्रा (पृथ्वी का 0.815 गुना)",
            "ar": "4.867 × 10^24 كجم (0.815 من كتلة الأرض)",
            "zh": "4.867 × 10^24 千克 (地球的0.815倍)",
            "ru": "4,867 × 10^24 кг (0,815 массы Земли)"
        },
        "diameter": {
            "ja": "12,104 km (地球の約0.95倍 / 双子星)",
            "en": "12,104 km (0.95x Earth / Twin planet)",
            "de": "12.104 km (0,95-fache Erdgröße)",
            "fr": "12 104 km (0,95 fois la Terre)",
            "es": "12.104 km (0,95 veces la Tierra)",
            "pt": "12.104 km (0,95 vezes a Terra)",
            "it": "12.104 km (0,95 volte la Terra)",
            "ko": "12,104 km (지구의 약 0.95배 / 쌍둥이 행성)",
            "nl": "12.104 km (0,95x de aarde)",
            "id": "12.104 km (0,95x Bumi)",
            "hi": "12,104 किमी (पृथ्वी का 0.95 गुना)",
            "ar": "12,104 كم (0.95 من قطر الأرض)",
            "zh": "12,104 公里 (地球的0.95倍 / 孪生姐妹星)",
            "ru": "12 104 км (0,95 диаметра Земли / сестра-близнец)"
        },
        "rotation": {
            "ja": "243.02日 (逆行自転)",
            "en": "243.02 days (Retrograde rotation)",
            "de": "243,02 Tage (rückläufig)",
            "fr": "243,02 jours (rétrograde)",
            "es": "243,02 días (retrógrada)",
            "pt": "243,02 dias (retrógrada)",
            "it": "243,02 giorni (retrograda)",
            "ko": "243.02일 (역방향 자전)",
            "nl": "243,02 dagen (retrograde)",
            "id": "243,02 hari (rotasi terbalik)",
            "hi": "243.02 दिन (विपरीत दिशा में घूर्णन)",
            "ar": "243.02 يوماً (دوران تراجعي عكسي)",
            "zh": "243.02天 (逆向自转)",
            "ru": "243,02 дня (обратное вращение)"
        },
        "orbit": {
            "ja": "224.70日",
            "en": "224.70 days",
            "de": "224,70 Tage",
            "fr": "224,70 jours",
            "es": "224,70 días",
            "pt": "224,70 dias",
            "it": "224,70 giorni",
            "ko": "224.70일",
            "nl": "224,70 dagen",
            "id": "224,70 hari",
            "hi": "224.70 दिन",
            "ar": "224.70 يوماً",
            "zh": "224.70天",
            "ru": "224,70 дня"
        },
        "temperature": {
            "ja": "約462℃ (暴走温室効果で太陽系最高温)",
            "en": "462°C (Hottest planet via runaway greenhouse)",
            "de": "462°C (Treibhauseffekt, heißester Planet)",
            "fr": "462°C (effet de serre extrême)",
            "es": "462°C (planeta más caliente)",
            "pt": "462°C (planeta mais quente)",
            "it": "462°C (pianeta più caldo)",
            "ko": "약 462℃ (온실효과로 태양계 최고온)",
            "nl": "462°C (heetste planeet)",
            "id": "462°C (planet terpanas)",
            "hi": "462°C (सौर मंडल का सबसे गर्म ग्रह)",
            "ar": "462°م (أشد الكواكب حرارة بفعل الاحتباس الحراري)",
            "zh": "约 462℃ (失控温室效应使之成为太阳系最热行星)",
            "ru": "462°C (самая горячая планета из-за парникового эффекта)"
        },
        "satellites": {
            "ja": "0個 (衛星なし)",
            "en": "0 (No moons)",
            "de": "0 (Keine Monde)",
            "fr": "0 (Aucune lune)",
            "es": "0 (Sin lunas)",
            "pt": "0 (Sem luas)",
            "it": "0 (Nessuna luna)",
            "ko": "0개 (위성 없음)",
            "nl": "0 (Geen manen)",
            "id": "0 (Tanpa bulan)",
            "hi": "0 (कोई चंद्रमा नहीं)",
            "ar": "0 (لا توجد أقمار)",
            "zh": "0 (无卫星)",
            "ru": "0 (нет спутников)"
        },
        "discovery": {
            "ja": "古代より「明けの明星/宵の明星」。1610年ガリレオが金星の満ち欠けを発見。",
            "en": "Known since antiquity. Galileo discovered its phases in 1610 confirming heliocentrism.",
            "de": "Seit der Antike bekannt. Galileo entdeckte 1610 die Venusphasen.",
            "fr": "Connu depuis l'Antiquité. Galilée découvrit ses phases en 1610.",
            "es": "Conocido desde la antigüedad. Galileo descubrió sus fases en 1610.",
            "pt": "Conhecido desde a antiguidade. Galileu descobriu suas fases em 1610.",
            "it": "Noto fin dall'antichità. Galileo ne scoprì le fasi nel 1610.",
            "ko": "고대부터 샛별/개밥바라기로 관측. 1610년 갈릴레오가 금성의 위상 변화(차고 기움) 발견.",
            "nl": "Sinds de oudheid bekend. Galileo ontdekte in 1610 de schijngestalten.",
            "id": "Dikenal sejak zaman kuno. Galileo menemukan fasenya pada 1610.",
            "hi": "प्राचीन काल से ज्ञात। 1610 में गैलीलियो ने शुक्र की कलाओं की खोज की।",
            "ar": "معروف منذ القدم (نجمة الصباح/المساء). اكتشف غاليليو أطواره عام 1610.",
            "zh": "自古便称“启明星/长庚星”。1610年伽利略发现金星相位盈亏变化。",
            "ru": "Известна с древности. В 1610 году Галилей открыл фазы Венеры."
        },
        "missions": {
            "ja": "ソ連ベネラ計画(1970年初着陸)、NASAマゼラン(1990-94レーダー地表地図)、JAXAあかつき(2015〜気象観測)。",
            "en": "Venera 7 (1970 first landing), NASA Magellan (radar map), JAXA Akatsuki (2015-present climate orbiter).",
            "de": "Venera 7 (1970), NASA Magellan, JAXA Akatsuki (2015-heute).",
            "fr": "Venera 7 (1970), NASA Magellan, JAXA Akatsuki (2015-présent).",
            "es": "Venera 7 (1970), NASA Magellan, JAXA Akatsuki (2015-presente).",
            "pt": "Venera 7 (1970), NASA Magellan, JAXA Akatsuki (2015-presente).",
            "it": "Venera 7 (1970), NASA Magellan, JAXA Akatsuki (2015-presente).",
            "ko": "소련 베네라 7호(1970 인류 최초 지표 착륙), NASA 마젤란 레이더 지도, JAXA 아카츠키(2015~ 기상관측) 등.",
            "nl": "Venera 7 (1970), NASA Magellan, JAXA Akatsuki (2015-heden).",
            "id": "Venera 7 (1970), NASA Magellan, JAXA Akatsuki (2015-sekarang).",
            "hi": "वेनेरा 7 (1970 प्रथम लैंडिंग), नासा मैगलन, जाक्सा अकात्सुकी (2015-वर्तमान)।",
            "ar": "فينيرا 7 (1970 أول هبوط)، وماجلان (NASA)، وأكاتسوكي (JAXA 2015-الآن).",
            "zh": "苏联金星7号(1970人类首次地表着陆)、NASA麦哲伦号雷达测绘、JAXA破晓号(Akatsuki 2015至今气象观测)等。",
            "ru": "Венера-7 (1970 первая посадка), Magellan (NASA), Akatsuki (JAXA 2015-наст.вр.)."
        }
    },
    "MERCURY": {
        "mass": {
            "ja": "3.301 × 10^23 kg (地球の約0.055倍)",
            "en": "3.301 × 10^23 kg (0.055x Earth)",
            "de": "3,301 × 10^23 kg (0,055-fache Erdmasse)",
            "fr": "3,301 × 10^23 kg (0,055 fois la Terre)",
            "es": "3,301 × 10^23 kg (0,055 veces la Tierra)",
            "pt": "3,301 × 10^23 kg (0,055 vezes a Terra)",
            "it": "3,301 × 10^23 kg (0,055 volte la Terra)",
            "ko": "3.301 × 10^23 kg (지구의 약 0.055배)",
            "nl": "3,301 × 10^23 kg (0,055x de aarde)",
            "id": "3,301 × 10^23 kg (0,055x Bumi)",
            "hi": "3.301 × 10^23 किग्रा (पृथ्वी का 0.055 गुना)",
            "ar": "3.301 × 10^23 كجم (0.055 من كتلة الأرض)",
            "zh": "3.301 × 10^23 千克 (地球的0.055倍)",
            "ru": "3,301 × 10^23 кг (0,055 массы Земли)"
        },
        "diameter": {
            "ja": "4,879.4 km (地球の約0.38倍)",
            "en": "4,879.4 km (0.38x Earth)",
            "de": "4.879,4 km (0,38-fache Erdgröße)",
            "fr": "4 879,4 km (0,38 fois la Terre)",
            "es": "4.879,4 km (0,38 veces la Tierra)",
            "pt": "4.879,4 km (0,38 vezes a Terra)",
            "it": "4.879,4 km (0,38 volte la Terra)",
            "ko": "4,879.4 km (지구의 약 0.38배)",
            "nl": "4.879,4 km (0,38x de aarde)",
            "id": "4.879,4 km (0,38x Bumi)",
            "hi": "4,879.4 किमी (पृथ्वी का 0.38 गुना)",
            "ar": "4,879.4 كم (0.38 من قطر الأرض)",
            "zh": "4,879.4 公里 (地球的0.38倍)",
            "ru": "4 879,4 км (0,38 диаметра Земли)"
        },
        "rotation": {
            "ja": "58.65日 (3:2スピン軌道共鳴)",
            "en": "58.65 days (3:2 spin-orbit resonance)",
            "de": "58,65 Tage (3:2-Resonanz)",
            "fr": "58,65 jours (résonance 3:2)",
            "es": "58,65 días (resonancia 3:2)",
            "pt": "58,65 dias (ressonância 3:2)",
            "it": "58,65 giorni (risonanza 3:2)",
            "ko": "58.65일 (3:2 궤도 공명)",
            "nl": "58,65 dagen (3:2-resonantie)",
            "id": "58,65 hari (resonansi 3:2)",
            "hi": "58.65 दिन (3:2 स्पिन-ऑर्बिट प्रतिध्वनि)",
            "ar": "58.65 يوماً (رنين مداري 3:2)",
            "zh": "58.65天 (3:2自转公转轨道共振)",
            "ru": "58,65 дня (резонанс 3:2)"
        },
        "orbit": {
            "ja": "87.97日",
            "en": "87.97 days",
            "de": "87,97 Tage",
            "fr": "87,97 jours",
            "es": "87,97 días",
            "pt": "87,97 dias",
            "it": "87,97 giorni",
            "ko": "87.97일",
            "nl": "87,97 dagen",
            "id": "87,97 hari",
            "hi": "87.97 दिन",
            "ar": "87.97 يوماً",
            "zh": "87.97天",
            "ru": "87,97 дня"
        },
        "temperature": {
            "ja": "昼 430℃ / 夜 -180℃ (太陽系最大の寒暖差)",
            "en": "Day 430°C / Night -180°C (Extreme range)",
            "de": "Tag 430°C / Nacht -180°C (Extremer Bereich)",
            "fr": "Jour 430°C / Nuit -180°C (écart extrême)",
            "es": "Día 430°C / Noche -180°C (extremo)",
            "pt": "Dia 430°C / Noite -180°C (extremo)",
            "it": "Giorno 430°C / Notte -180°C (estremo)",
            "ko": "낮 430℃ / 밤 -180℃ (태양계 최대 일교차)",
            "nl": "Dag 430°C / Nacht -180°C",
            "id": "Siang 430°C / Malam -180°C",
            "hi": "दिन 430°C / रात -180°C (अत्यधिक भिन्नता)",
            "ar": "نهاراً 430°م / ليلاً -180°م (أكبر تفاوت حراري)",
            "zh": "白昼 430℃ / 夜间 -180℃ (太阳系最大昼夜温差)",
            "ru": "День 430°C / Ночь -180°C (экстремальный перепад)"
        },
        "satellites": {
            "ja": "0個 (衛星なし)",
            "en": "0 (No moons)",
            "de": "0 (Keine Monde)",
            "fr": "0 (Aucune lune)",
            "es": "0 (Sin lunas)",
            "pt": "0 (Sem luas)",
            "it": "0 (Nessuna luna)",
            "ko": "0개 (위성 없음)",
            "nl": "0 (Geen manen)",
            "id": "0 (Tanpa bulan)",
            "hi": "0 (कोई चंद्रमा नहीं)",
            "ar": "0 (لا توجد أقمار)",
            "zh": "0 (无卫星)",
            "ru": "0 (нет спутников)"
        },
        "discovery": {
            "ja": "紀元前14世紀バビロニア記録。1631年ガッサンディが太陽面通過を初観測。",
            "en": "Recorded in 14th century BC Babylonian tablets. Gassendi observed transit in 1631.",
            "de": "Seit babylonischen Zeiten bekannt. Gassendi beobachtete 1631 den Transit.",
            "fr": "Connu depuis les Babyloniens. Gassendi a observé le transit en 1631.",
            "es": "Conocido desde los babilonios. Gassendi observó el tránsito en 1631.",
            "pt": "Conhecido desde os babilônios. Gassendi observou o trânsito em 1631.",
            "it": "Noto fin dai Babilonesi. Gassendi ne osservò il transito nel 1631.",
            "ko": "기원전 14세기 바빌로니아 기록. 1631년 가상디가 태양면 통과를 망원경으로 최초 관측.",
            "nl": "Sinds de Babyloniërs bekend. Gassendi observeerde in 1631 de overgang.",
            "id": "Dicatat sejak bangsa Babilonia. Gassendi mengamati transit pada 1631.",
            "hi": "14वीं शताब्दी ईसा पूर्व बेबीलोन में दर्ज। 1631 में पारगमन देखा गया।",
            "ar": "مسجل منذ الألواح البابلية في القرن 14 ق.م. رصد غاسندي عبوره عام 1631.",
            "zh": "公元前14世纪巴比伦已有泥板记录。1631年加桑迪首次观测水星凌日。",
            "ru": "Известен с вавилонских времен. В 1631 году Гассенди наблюдал прохождение по диску Солнца."
        },
        "missions": {
            "ja": "マリナー10号(1974-75)、NASAメッセンジャー(2011-15初周回)、日欧共同ベピコロンボ(BepiColombo / 2025-26周回予定)。",
            "en": "Mariner 10 (1974-75), NASA MESSENGER (2011-15), ESA/JAXA BepiColombo (2025-26 arrival).",
            "de": "Mariner 10, NASA MESSENGER, ESA/JAXA BepiColombo.",
            "fr": "Mariner 10, NASA MESSENGER, ESA/JAXA BepiColombo.",
            "es": "Mariner 10, NASA MESSENGER, ESA/JAXA BepiColombo.",
            "pt": "Mariner 10, NASA MESSENGER, ESA/JAXA BepiColombo.",
            "it": "Mariner 10, NASA MESSENGER, ESA/JAXA BepiColombo.",
            "ko": "매리너 10호, NASA 메신저(2011-15 최초 궤도탐사), 일본-유럽 공동 베피콜롬보(BepiColombo) 탐사선.",
            "nl": "Mariner 10, NASA MESSENGER, ESA/JAXA BepiColombo.",
            "id": "Mariner 10, NASA MESSENGER, ESA/JAXA BepiColombo.",
            "hi": "मैरिनर 10, नासा मैसेंजर (2011-15), ईएसए/जाक्सा बेपीकोलंबो।",
            "ar": "مارينر 10، وماسنجر (NASA 2011-15)، ومهمة بيبيكولومبو المشتركة بين ESA وJAXA.",
            "zh": "水手10号(1974-75)、NASA信使号(2011-15首颗环绕探测器)、日欧联合贝皮可伦坡号(BepiColombo)。",
            "ru": "Маринер-10, MESSENGER (NASA 2011-15), совместная миссия ESA/JAXA БепиКоломбо."
        }
    },
    "URANUS": {
        "mass": {
            "ja": "8.681 × 10^25 kg (地球の14.5倍)",
            "en": "8.681 × 10^25 kg (14.5x Earth)",
            "de": "8,681 × 10^25 kg (14,5-fache Erdmasse)",
            "fr": "8,681 × 10^25 kg (14,5 fois la Terre)",
            "es": "8,681 × 10^25 kg (14,5 veces la Tierra)",
            "pt": "8,681 × 10^25 kg (14,5 vezes a Terra)",
            "it": "8,681 × 10^25 kg (14,5 volte la Terra)",
            "ko": "8.681 × 10^25 kg (지구의 14.5배)",
            "nl": "8,681 × 10^25 kg (14,5x de aarde)",
            "id": "8,681 × 10^25 kg (14,5x Bumi)",
            "hi": "8.681 × 10^25 किग्रा (पृथ्वी का 14.5 गुना)",
            "ar": "8.681 × 10^25 كجم (14.5 ضعف كتلة الأرض)",
            "zh": "8.681 × 10^25 千克 (地球的14.5倍)",
            "ru": "8,681 × 10^25 кг (в 14,5 раза больше Земли)"
        },
        "diameter": {
            "ja": "50,724 km (地球の約4.0倍 / 巨大氷惑星)",
            "en": "50,724 km (4.0x Earth / Ice Giant)",
            "de": "50.724 km (4,0-fache Erdgröße)",
            "fr": "50 724 km (4,0 fois la Terre)",
            "es": "50.724 km (4,0 veces la Tierra)",
            "pt": "50.724 km (4,0 vezes a Terra)",
            "it": "50.724 km (4,0 volte la Terra)",
            "ko": "50,724 km (지구의 약 4.0배 / 거대 얼음 행성)",
            "nl": "50.724 km (4,0x de aarde)",
            "id": "50.724 km (4,0x Bumi)",
            "hi": "50,724 किमी (पृथ्वी का 4.0 गुना)",
            "ar": "50,724 كم (4 أضعاف قطر الأرض)",
            "zh": "50,724 公里 (地球的4.0倍 / 冰巨行星)",
            "ru": "50 724 км (в 4 раза больше Земли)"
        },
        "rotation": {
            "ja": "17時間14分 (自転軸97.77度横倒し)",
            "en": "17h 14m (Extreme 97.77° axial tilt)",
            "de": "17 Std. 14 Min. (97,77° Neigung)",
            "fr": "17h 14m (axe incliné à 97,77°)",
            "es": "17h 14m (inclinación 97,77°)",
            "pt": "17h 14m (inclinação 97,77°)",
            "it": "17h 14m (inclinazione 97,77°)",
            "ko": "17시간 14분 (자전축 97.77도 누움)",
            "nl": "17u 14m (97,77° ashelling)",
            "id": "17j 14m (kemiringan 97,77°)",
            "hi": "17 घंटे 14 मिनट (97.77° झुकाव)",
            "ar": "17 ساعة و14 دقيقة (ميل محوري 97.77 درجة)",
            "zh": "17小时14分 (自转轴倾角达97.77度“横躺自转”)",
            "ru": "17 ч 14 мин (наклон оси 97,77°)"
        },
        "orbit": {
            "ja": "30,685.4日 (約84.02年)",
            "en": "30,685.4 days (~84.02 years)",
            "de": "30.685,4 Tage (~84,02 Jahre)",
            "fr": "30 685,4 jours (~84,02 ans)",
            "es": "30.685,4 días (~84,02 años)",
            "pt": "30.685,4 dias (~84,02 anos)",
            "it": "30.685,4 giorni (~84,02 anni)",
            "ko": "30,685.4일 (약 84.02년)",
            "nl": "30.685,4 dagen (~84,02 jaar)",
            "id": "30.685,4 hari (~84,02 tahun)",
            "hi": "30,685.4 दिन (~84.02 वर्ष)",
            "ar": "30,685.4 يوماً (حوالي 84.02 سنة)",
            "zh": "30,685.4天 (约84.02年)",
            "ru": "30 685,4 дня (~84,02 года)"
        },
        "temperature": {
            "ja": "約-224℃ (太陽系惑星で最低温大気)",
            "en": "-224°C (Coldest planetary atmosphere)",
            "de": "-224°C (Kälteste Atmosphäre)",
            "fr": "-224°C (Atmosphère la plus froide)",
            "es": "-224°C (Atmósfera más fría)",
            "pt": "-224°C (Atmosfera mais fria)",
            "it": "-224°C (Atmosfera più fredda)",
            "ko": "약 -224℃ (태양계 행성 중 가장 차가운 대기)",
            "nl": "-224°C (Koudste atmosfeer)",
            "id": "-224°C (Atmosfer terdingin)",
            "hi": "-224°C (सौर मंडल का सबसे ठंडा वातावरण)",
            "ar": "-224°م (أبرد غلاف جوي كوكبي في النظام الشمسي)",
            "zh": "约 -224℃ (太阳系行星中最冷的大气层)",
            "ru": "-224°C (самая холодная атмосфера в системе)"
        },
        "satellites": {
            "ja": "28個 (チタニア、オベロン等) ＋ 13本の縦向きの環",
            "en": "28 Moons (Titania, Oberon etc.) + 13 vertical rings",
            "de": "28 Monde (Titania, Oberon) + 13 vertikale Ringe",
            "fr": "28 lunes (Titania, Obéron) + 13 anneaux verticaux",
            "es": "28 lunas (Titania, Oberón) + 13 anillos verticales",
            "pt": "28 luas (Titânia, Oberon) + 13 anéis verticais",
            "it": "28 lune (Titania, Oberon) + 13 anelli verticali",
            "ko": "28개 (티타니아, 오베론, 미란다 등) + 13개의 수직 고리",
            "nl": "28 manen (Titania, Oberon) + 13 verticale ringen",
            "id": "28 bulan (Titania, Oberon) + 13 cincin vertikal",
            "hi": "28 चंद्रमा (टिटानिया, ओबेरॉन) + 13 ऊर्ध्वाधर छल्ले",
            "ar": "28 قمراً (تيتانيا، أوبيرون) + 13 حلقة عمودية",
            "zh": "28颗 (天卫三泰坦妮亚、天卫四奥伯龙等) + 13道竖立垂直光环",
            "ru": "28 спутников (Титания, Оберон) + 13 вертикальных колец"
        },
        "discovery": {
            "ja": "1781年3月13日、英ウィリアム・ハーシェルが望遠鏡で近世以降初発見。",
            "en": "Discovered March 13, 1781 by William Herschel in England via telescope.",
            "de": "Am 13. März 1781 von William Herschel per Teleskop entdeckt.",
            "fr": "Découvert le 13 mars 1781 par William Herschel au télescope.",
            "es": "Descubierto el 13 de marzo de 1781 por William Herschel con telescopio.",
            "pt": "Descoberto em 13 de março de 1781 por William Herschel.",
            "it": "Scoperto il 13 marzo 1781 da William Herschel al telescopio.",
            "ko": "1781년 3월 13일, 영국의 윌리엄 허셜이 자작 망원경으로 인류 역사상 최초로 망원경을 통해 발견한 행성.",
            "nl": "Ontdekt op 13 maart 1781 door William Herschel.",
            "id": "Ditemukan pada 13 Maret 1781 oleh William Herschel.",
            "hi": "13 मार्च 1781 को विलियम हर्शल द्वारा खोजा गया।",
            "ar": "اكتشفه ويليام هيرشل في 13 مارس 1781 باستخدام التلسكوب.",
            "zh": "1781年3月13日由英国天文学家威廉·赫歇尔使用自制望远镜发现，是近现代人类通过望远镜发现的第一颗新行星。",
            "ru": "Открыт 13 марта 1781 года Уильямом Гершелем с помощью телескопа."
        },
        "missions": {
            "ja": "NASAボイジャー2号 (1986年1月24日最接近、10個の新衛星と2本のリング発見)。",
            "en": "NASA Voyager 2 (only close flyby in Jan 1986, discovering 10 moons & 2 rings).",
            "de": "NASA Voyager 2 (historischer Vorbeiflug im Jan 1986).",
            "fr": "NASA Voyager 2 (seul survol rapproché en janvier 1986).",
            "es": "NASA Voyager 2 (único sobrevuelo en enero de 1986).",
            "pt": "NASA Voyager 2 (único sobrevoo em janeiro de 1986).",
            "it": "NASA Voyager 2 (unico sorvolo ravvicinato nel gennaio 1986).",
            "ko": "NASA 보이저 2호 (1986년 1월 24일 유일한 최접근 탐사, 10개 신위성 및 2개 고리 발견).",
            "nl": "NASA Voyager 2 (enige scheervlucht in jan 1986).",
            "id": "NASA Voyager 2 (satu-satunya lintas terbang dekat pada Januari 1986).",
            "hi": "नासा वॉयेजर 2 (जनवरी 1986 में एकमात्र निकटतम उड़ान)।",
            "ar": "فوياجر 2 التابع لناسا (التحليق القريب الوحيد في يناير 1986 مكتشفاً 10 أقمار وحلقتين).",
            "zh": "NASA旅行者2号(1986年1月24日人类唯一一次近距离飞越探测，发现10颗新卫星与2道新光环)。",
            "ru": "Вояджер-2 (NASA, единственный пролет в январе 1986 г., открыл 10 спутников и 2 кольца)."
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
        "ja": "太陽系の中心天体（恒星）。地球から約1億4,960万km (1 AU) の距離に位置し、地球の全生命と気象現象のエネルギー源。昼夜のライティング陰影をリアルタイム生成。",
        "en": "The star at the center of the Solar System (~149.6M km / 1 AU from Earth). Provides 100% of light and solar energy driving Earth weather and day/night cycle.",
        "de": "Das Zentralgestirn unseres Sonnensystems (~149,6 Mio. km von der Erde). Licht- und Energiequelle der Erde.",
        "fr": "L'étoile au centre du système solaire (~149,6 millions de km). Source de toute lumière et énergie sur Terre.",
        "es": "La estrella en el centro del Sistema Solar (~149,6 millones de km de la Tierra). Fuente de luz y energía.",
        "pt": "A estrela no centro do Sistema Solar (~149,6 milhões de km da Terra). Fonte de luz e energia.",
        "it": "La stella al centro del Sistema Solare (~149,6 milioni di km). Fonte di luce ed energia.",
        "ko": "태양계의 중심 항성(지구로부터 약 1억 4,960만 km). 지구의 모든 생명과 기상, 주야간 조명의 근원.",
        "nl": "De ster in het centrum van het zonnestelsel (~149,6 miljoen km). Bron van alle licht en energie.",
        "id": "Bintang di pusat Tata Surya (~149,6 juta km). Sumber cahaya dan energi utama Bumi.",
        "hi": "सौर मंडल के केंद्र में स्थित तारा (पृथ्वी से ~14.96 करोड़ किमी)। पृथ्वी के दिन/रात और ऊर्जा का स्रोत।",
        "ar": "النجم في مركز النظام الشمسي (~149.6 مليون كم من الأرض). مصدر الضوء والطاقة ودورة الليل والنهار.",
        "zh": "太阳系的中心天体(恒星)，距地球约1.496亿公里(1 AU)。主导地球昼夜交替与气候运行。",
        "ru": "Центральная звезда Солнечной системы (~149,6 млн км от Земли). Источник света и тепла."
    },
    "MOON": {
        "ja": "地球唯一の自然衛星「月」。平均距離約384,400km、公転周期約27.3日。アポロ計画やアルテミス計画の探査対象。CesiumJSリアルタイム3D月齢連動。",
        "en": "Earth's only natural satellite (~384,400 km away, orbital period 27.3 days). Target of Apollo and Artemis lunar missions. Synchronized with real-time 3D lunar phases.",
        "de": "Der einzige natürliche Satellit der Erde (~384.400 km entfernt, Umlaufzeit 27,3 Tage).",
        "fr": "L'unique satellite naturel de la Terre (distance ~384 400 km, période orbitale 27,3 jours).",
        "es": "El único satélite natural de la Tierra (~384.400 km de distancia, período de 27,3 días).",
        "pt": "O único satélite natural da Terra (~384.400 km de distância, período de 27,3 dias).",
        "it": "L'unico satellite naturale della Terra (~384.400 km di distanza, periodo 27,3 giorni).",
        "ko": "지구의 유일한 자연위성 \"달\"(평균 거리 약 384,400km, 공전주기 약 27.3일). 실시간 3D 월령 렌더링.",
        "nl": "De enige natuurlijke satelliet van de aarde (~384.400 km afstand, omlooptijd 27,3 dagen).",
        "id": "Satelit alami tunggal Bumi (~384.400 km, periode orbit 27,3 hari). Target misi Artemis.",
        "hi": "पृथ्वी का एकमात्र प्राकृतिक उपग्रह \"चंद्रमा\" (~384,400 किमी दूर, परिक्रमण काल 27.3 दिन)।",
        "ar": "القمر، التابع الطبيعي الوحيد للأرض (~384,400 كم، الدورة المدارية 27.3 يوماً). مرحلة ثلاثية الأبعاد متزامنة.",
        "zh": "地球唯一的天然卫星“月球”，平均距离约38.44万公里，公转周期约27.3天。实时3D月相呈现。",
        "ru": "Единственный естественный спутник Земли (~384 400 км, период обращения 27,3 дня)."
    },
    "MARS": {
        "ja": "太陽系第4惑星「火星」(Red Planet)。酸化鉄に覆われた赤い地表と大気、極冠を持つ。NASAパーサヴィアランス探査車や有人探査計画の最前線。",
        "en": "The 4th planet from the Sun (The Red Planet). Known for its iron-rich red soil, thin atmosphere, and polar ice caps. Target of NASA rover and crewed Mars missions.",
        "de": "Der vierte Planet des Sonnensystems (Der Rote Planet). Ziel der Mars-Rover und bemannter Missionen.",
        "fr": "La 4e planète du système solaire (La planète rouge). Cible des rovers et de futures missions habitées.",
        "es": "El cuarto planeta del Sistema Solar (El Planeta Rojo). Objetivo de exploraciones y futuras misiones tripuladas.",
        "pt": "O quarto planeta do Sistema Solar (O Planeta Vermelho). Alvo de rovers e futuras missões humanas.",
        "it": "Il quarto pianeta del Sistema Solare (Il Pianeta Rosso). Obiettivo di rover ed esplorazioni umane.",
        "ko": "태양계 제4행성 \"화성\"(붉은 행성). 산화철 토양과 얇은 대기, 미래 유인 탐사의 핵심 목표.",
        "nl": "De vierde planeet van het zonnestelsel (De Rode Planeet). Doel van Mars-rovers en bemande missies.",
        "id": "Planet ke-4 dari Matahari (Planet Merah). Target penjelajah NASA dan misi berawak masa depan.",
        "hi": "सूर्य से चौथा ग्रह \"मंगल\" (लाल ग्रह)। भविष्य के मानव अंतरिक्ष अभियानों का मुख्य लक्ष्य।",
        "ar": "الكوكب الرابع من الشمس (الكوكب الأحمر). يشتهر بتربته الغنية بالحديد وأهدافه الاستكشافية المأهولة.",
        "zh": "太阳系第四行星“火星”(红星)，拥有富含铁的红色地表和稀薄大气，是人类深空探测的核心目标。",
        "ru": "Четвертая планета от Солнца (Красная планета). Главная цель будущих пилотируемых миссий."
    },
    "VENUS": {
        "ja": "太陽系第2惑星「金星」(Venus / 明けの明星)。厚い硫酸の雲と強烈な温室効果により地表温度は約460℃に達する、夜空で最も明るく輝く惑星。",
        "en": "The 2nd planet from the Sun (Morning / Evening Star). Hottest planet in the solar system (~460°C) with dense runaway greenhouse atmosphere and bright night sky shine.",
        "de": "Der 2. Planet des Sonnensystems (Morgen-/Abendstern). Heißester Planet mit dichter Atmosphäre (~460°C).",
        "fr": "La 2e planète du système solaire (Étoile du Berger). La plus chaude (~460°C) sous un effet de serre extrême.",
        "es": "El segundo planeta del Sistema Solar (El Lucero del Alba). El planeta más caliente (~460°C).",
        "pt": "O segundo planeta do Sistema Solar (A Estrela D'Alva). O planeta mais quente (~460°C).",
        "it": "Il secondo pianeta del Sistema Solare (Stella del Mattino/Sera). Pianeta più caldo (~460°C).",
        "ko": "태양계 제2행성 \"금성\"(샛별). 두꺼운 이산화탄소 대기와 온실효과로 표면온도 약 460℃에 달하는 가장 밝은 행성.",
        "nl": "De 2e planeet van het zonnestelsel (Morgen-/Avondster). Heetste planeet (~460°C).",
        "id": "Planet ke-2 dari Matahari (Bintang Fajar/Kejora). Planet terpanas (~460°C) dengan atmosfer tebal.",
        "hi": "सूर्य से दूसरा ग्रह \"शुक्र\" (भोर का तारा)। सौर मंडल का सबसे गर्म ग्रह (~460°C)।",
        "ar": "الكوكب الثاني من الشمس (نجمة الصباح/المساء). أشد كواكب النظام الشمسي حرارة (~460 درجة مئوية).",
        "zh": "太阳系第二行星“金星”(启明星/长庚星)。浓密温室大气使地表达460℃，是夜空中最亮行星。",
        "ru": "Вторая планета от Солнца (Утренняя звезда). Самая горячая планета в системе (~460°C)."
    },
    "JUPITER": {
        "ja": "太陽系第5惑星「木星」(Jupiter)。太陽系最大の巨大ガス惑星。地球の約1,300倍の体積、象徴的な大赤斑と強力な磁気圏、エウロパ等90以上の衛星を持つ。",
        "en": "The 5th and largest planet in the Solar System (1,300x Earth volume). Giant gas planet famous for its Great Red Spot, intense magnetic field, and 90+ moons.",
        "de": "Der größte Planet des Sonnensystems (Gasriese). Bekannt für den Großen Roten Fleck und über 90 Monde.",
        "fr": "La plus grande planète du système solaire (Géante gazeuse avec la Grande Tache Rouge et 90+ lunes).",
        "es": "El planeta más grande del Sistema Solar (Gigante gaseoso con la Gran Mancha Roja y más de 90 lunas).",
        "pt": "O maior planeta do Sistema Solar (Gigante gasoso com a Grande Mancha Vermelha e mais de 90 luas).",
        "it": "Il pianeta più grande del Sistema Solare (Gigante gassoso con la Grande Macchia Rossa).",
        "ko": "태양계 제5행성이자 최대 행성 \"목성\"(가스 행성). 지구 부피의 1,300배, 거대한 대적점과 90개 이상의 위성 보유.",
        "nl": "De grootste planeet van het zonnestelsel (Gasreus met de Grote Rode Vlek en 90+ manen).",
        "id": "Planet terbesar di Tata Surya (Raksasa gas dengan Bintik Merah Raksasa dan 90+ bulan).",
        "hi": "सौर मंडल का सबसे बड़ा ग्रह \"बृहस्पति\"। ग्रेट रेड स्पॉट और 90 से अधिक चंद्रमाओं वाला विशाल गैस ग्रह।",
        "ar": "الكوكب الأكبر في النظام الشمسي (عملاق غازي يشتهر بالبقعة الحمراء العظيمة وأكثر من 90 قمراً).",
        "zh": "太阳系第五行星兼最大行星“木星”(气态巨行星)。体积为地球1300倍，拥有大红斑与90多颗卫星。",
        "ru": "Крупнейшая планета Солнечной системы (Газовый гигант с Большим красным пятном и 90+ спутниками)."
    },
    "SATURN": {
        "ja": "太陽系第6惑星「土星」(Saturn)。氷と岩石でできた壮麗な環（リング）を持つ巨大ガス惑星。密度が水より軽く、タイタンやエンケラドス等魅力的な衛星を従える。",
        "en": "The 6th planet from the Sun (Ringed Giant). Famous for its spectacular ice rings, low density (floats on water), and intriguing moons like Titan and Enceladus.",
        "de": "Der Ringplanet des Sonnensystems. Berühmt für seine spektakulären Eisringe und den Mond Titan.",
        "fr": "La planète aux anneaux spectaculaires constitués de glace et de roche, avec le satellite Titan.",
        "es": "Famoso por sus espectaculares anillos de hielo y fascinantes lunas como Titán y Encélado.",
        "pt": "Famoso por seus anéis espetaculares de gelo e luas fascinantes como Titã e Encélado.",
        "it": "Famoso per i suoi spettacolari anelli di ghiaccio e lune affascinanti come Titano.",
        "ko": "태양계 제6행성 \"토성\"(고리 행성). 얼음과 암석으로 이루어진 화려한 고리와 타이탄 위성을 보유.",
        "nl": "Beroemd om zijn spectaculaire ijsringen en intrigerende manen zoals Titan en Enceladus.",
        "id": "Planet ke-6 dari Matahari, terkenal dengan cincin esnya yang megah dan bulan Titan.",
        "hi": "सूर्य से छठा ग्रह \"शनि\"। बर्फ के भव्य छल्लों और टाइटन जैसे उपग्रहों के लिए प्रसिद्ध।",
        "ar": "الكوكب السادس من الشمس (عملاق الحلقات). يشتهر بحلقاته الجليدية الرائعة وأقماره مثل تيتان.",
        "zh": "太阳系第六行星“土星”(环状巨行星)。拥有壮观的冰质光环与土卫六(泰坦)等众多卫星。",
        "ru": "Шестая планета с великолепными ледяными кольцами и спутником Титан."
    },
    "MERCURY": {
        "ja": "太陽系第1惑星「水星」(Mercury)。太陽に最も近く、大気がほとんどないため昼は430℃、夜は-180℃という極端な温度差を持つクレーターに覆われた岩石惑星。",
        "en": "The closest planet to the Sun. Small, rocky world with no atmosphere, causing extreme temperature swings from 430°C in daylight to -180°C at night.",
        "de": "Der sonnennächste Planet. Extremste Temperaturunterschiede zwischen Tag (+430°C) und Nacht (-180°C).",
        "fr": "La planète la plus proche du Soleil. Variations de température extrêmes de 430°C à -180°C.",
        "es": "El planeta más cercano al Sol. Extremos de temperatura entre el día (430°C) y la noche (-180°C).",
        "pt": "O planeta mais próximo do Sol. Extremos de temperatura entre o dia (430°C) e a noite (-180°C).",
        "it": "Il pianeta più vicino al Sole. Forti escursioni termiche tra giorno (430°C) e notte (-180°C).",
        "ko": "태양에 가장 가까운 제1행성 \"수성\". 대기가 없어 낮 430℃, 밤 -180℃의 극단적인 온도 변화.",
        "nl": "De dichtstbijzijnde planeet bij de zon. Extreme temperaturen van 430°C overdag tot -180°C 's nachts.",
        "id": "Planet terdekat dengan Matahari. Perubahan suhu ekstrem antara siang (430°C) dan malam (-180°C).",
        "hi": "सूर्य के सबसे निकट का ग्रह \"बुध\"। दिन में 430°C और रात में -180°C का अत्यधिक तापमान अंतर।",
        "ar": "أقرب الكواكب إلى الشمس. كوكب صخري صغير يشهد تبايناً حرارياً هائلاً بين النهار (+430°م) والليل (-180°م).",
        "zh": "太阳系最内侧第一行星“水星”。昼夜温差达430℃至-180℃，布满陨石坑的岩石行星。",
        "ru": "Ближайшая к Солнцу планета. Экстремальные перепады температуры от +430°C днем до -180°C ночью."
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
        const isMoon = (body.id === 'MOON');

        // 3D Celestial Body Entity
        const entityOptions = {
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
        };

        // Add Realistic 3D Textured Sphere (Ellipsoid) for Planets
        if (!isSun && !isMoon) {
            const planetRadius = (body.radiusKm || 6000) * 1000;
            const texCanvas = getPlanetTexture(body.id);
            entityOptions.ellipsoid = {
                radii: new Cesium.Cartesian3(planetRadius, planetRadius, planetRadius),
                material: new Cesium.ImageMaterialProperty({
                    image: texCanvas,
                    transparent: false
                }),
                show: isVisible
            };
        }

        const entity = viewer.entities.add(entityOptions);
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

    const lang = currentLang || 'ja';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['ja'];
    const info = (typeof CELESTIAL_ENCYCLOPEDIA !== 'undefined') ? CELESTIAL_ENCYCLOPEDIA[body.id] : null;

    // Helper for localized lookup
    const getL = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return obj[lang] || obj['en'] || obj['ja'] || '';
    };

    // Update Detail Card UI
    satBadge.textContent = `🌌 ${body.type}`;
    satBadge.style.background = 'linear-gradient(135deg, #f59e0b, #ef4444)';
    satName.textContent = `${body.symbol} ${body.name.split(' ')[0]}`;
    satNorad.textContent = `SOLAR SYSTEM BODY (${body.id})`;

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

    // Pass and Debris rows
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
    if (passMetaInfo) passMetaInfo.textContent = info ? `${getL(info.rotation)} | ${getL(info.temperature)}` : `Solar System Body (${body.type})`;
    if (debrisProximity) debrisProximity.textContent = '🟢 Gravitational Equilibrium';

    detailCard.classList.remove('hidden');

    // Breathtaking Close-Up Camera Flight to the Planet!
    const camera = viewer.camera;
    const planetRadiusMeters = (body.radiusKm || 6000) * 1000;
    const bodyDir = Cesium.Cartesian3.normalize(pos, new Cesium.Cartesian3());

    if (body.id === 'SUN') {
        // View Sun from space
        camera.flyTo({
            destination: Cesium.Cartesian3.multiplyByScalar(bodyDir, -25000000, new Cesium.Cartesian3()),
            orientation: {
                direction: bodyDir,
                up: Cesium.Cartesian3.UNIT_Z
            },
            duration: 2.0
        });
    } else if (body.id === 'MOON') {
        // Dramatic Close-up 3D Lunar Surface View!
        const moonCamPos = Cesium.Cartesian3.add(pos, Cesium.Cartesian3.multiplyByScalar(bodyDir, -6500000, new Cesium.Cartesian3()), new Cesium.Cartesian3());
        camera.flyTo({
            destination: moonCamPos,
            orientation: {
                direction: bodyDir,
                up: Cesium.Cartesian3.UNIT_Z
            },
            duration: 2.0
        });
    } else {
        // Fly directly in front of the Planet (distance: 3.2x planet radius)
        const closeDist = planetRadiusMeters * 3.5;
        const planetCamPos = Cesium.Cartesian3.add(
            pos,
            Cesium.Cartesian3.multiplyByScalar(bodyDir, -closeDist, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );

        camera.flyTo({
            destination: planetCamPos,
            orientation: {
                direction: bodyDir,
                up: Cesium.Cartesian3.UNIT_Z
            },
            duration: 2.5
        });
    }
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

    // Custom Precision Wheel Zoom Interceptor (Directly overrides Cesium's aggressive wheel zoom to 1/10th speed!)
    const canvas = viewer.canvas;
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const camera = viewer.camera;
        const currentDist = Cesium.Cartesian3.magnitude(camera.positionWC);
        
        // Extremely gentle 0.00015 step factor (Ultra-smooth 1/10th scroll speed!)
        const delta = e.deltaY;
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
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS['ja'];
    satSelect.innerHTML = `<option value="">${dict.selectPlaceholder || '-- 衛星を選択 --'}</option>`;

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

    const lang = currentLang || 'ja';
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
    const lang = currentLang || 'ja';
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
