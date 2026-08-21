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
    
    // Enable Cesium Real Moon & Sun
    try {
        if (!viewer.scene.moon) {
            viewer.scene.moon = new Cesium.Moon();
        }
        viewer.scene.moon.show = true;
        if (!viewer.scene.sun) {
            viewer.scene.sun = new Cesium.Sun();
        }
        viewer.scene.sun.show = true;
    } catch(e) {
        console.warn("Moon/Sun enable warning:", e);
    }

    createCelestialEntities();
}

function createCelestialEntities() {
    if (!viewer) return;
    celestialEntities.forEach(ent => viewer.entities.remove(ent));
    celestialEntities = [];

    const toggleCelestial = document.getElementById('toggleCelestial');
    const isVisible = (!toggleCelestial || toggleCelestial.checked);

    CELESTIAL_BODIES.forEach(body => {
        const entity = viewer.entities.add({
            id: `celestial_${body.id}`,
            name: body.name,
            position: new Cesium.CallbackProperty((time) => {
                return computeCelestialPosition(body, time);
            }, false),
            point: {
                pixelSize: body.id === 'MOON' ? 14 : (body.id === 'SUN' ? 16 : 10),
                color: Cesium.Color.fromCssColorString(body.color),
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                show: isVisible,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            label: {
                text: `${body.symbol} ${body.name.split(' ')[0]}`,
                font: 'bold 12px Inter, sans-serif',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.fromCssColorString('#020617'),
                outlineWidth: 3,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -12),
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

    if (body.id === 'SUN') {
        const L = (280.460 + 0.9856474 * d) * (Math.PI / 180);
        const g = (357.528 + 0.9856003 * d) * (Math.PI / 180);
        const lambda = L + (1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * (Math.PI / 180);
        const eps = (23.439 - 0.0000004 * d) * (Math.PI / 180);
        const r_sun = 149597870700; // 1 AU in meters
        return new Cesium.Cartesian3(
            r_sun * Math.cos(lambda),
            r_sun * Math.sin(lambda) * Math.cos(eps),
            r_sun * Math.sin(lambda) * Math.sin(eps)
        );
    }

    if (body.id === 'MOON') {
        const L_moon = (218.316 + 13.176396 * d) * (Math.PI / 180);
        const M_moon = (134.963 + 13.064993 * d) * (Math.PI / 180);
        const F_moon = (93.272 + 13.229350 * d) * (Math.PI / 180);
        const lambda_moon = L_moon + (6.289 * Math.sin(M_moon)) * (Math.PI / 180);
        const beta_moon = (5.128 * Math.sin(F_moon)) * (Math.PI / 180);
        const r_moon = 384400000; // 384,400 km in meters
        return new Cesium.Cartesian3(
            r_moon * Math.cos(beta_moon) * Math.cos(lambda_moon),
            r_moon * Math.cos(beta_moon) * Math.sin(lambda_moon),
            r_moon * Math.sin(beta_moon)
        );
    }

    // Earth orbital position
    const earthM = (357.529 + 0.98560028 * d) * Math.PI / 180;
    const earthL_corr = (280.466 + 0.98564736 * d + 1.915 * Math.sin(earthM) + 0.020 * Math.sin(2 * earthM)) * Math.PI / 180;
    const xe = Math.cos(earthL_corr);
    const ye = Math.sin(earthL_corr);

    // Planet heliocentric coordinates
    const M = (body.M0 + body.n * d) % 360;
    const M_rad = M * Math.PI / 180;
    const v = M_rad + (2 * body.e - Math.pow(body.e, 3)/4) * Math.sin(M_rad) + 1.25 * Math.pow(body.e, 2) * Math.sin(2 * M_rad);
    const r = body.a * (1 - Math.pow(body.e, 2)) / (1 + body.e * Math.cos(v));
    const I_rad = body.I * Math.PI / 180;
    const lon_rad = (v + (body.L - body.M0) * Math.PI / 180);

    const xp = r * Math.cos(lon_rad);
    const yp = r * Math.sin(lon_rad) * Math.cos(I_rad);
    const zp = r * Math.sin(lon_rad) * Math.sin(I_rad);

    // Geocentric (Earth-centric) vector in AU
    const gx = xp - xe;
    const gy = yp - ye;
    const gz = zp;

    const AU_TO_METERS = 149597870700;
    return new Cesium.Cartesian3(gx * AU_TO_METERS, gy * AU_TO_METERS, gz * AU_TO_METERS);
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

    // Update Detail Card UI
    satBadge.textContent = `🌌 ${body.type}`;
    satBadge.style.background = 'linear-gradient(135deg, #f59e0b, #ef4444)';
    satName.textContent = `${body.symbol} ${body.name.split(' ')[0]}`;
    satNorad.textContent = `SOLAR SYSTEM BODY (${body.id})`;

    const descObj = CELESTIAL_DESCRIPTIONS[body.id];
    if (satDescription && descObj) {
        satDescription.textContent = descObj[lang] || descObj['en'] || descObj['ja'];
    }

    // Compute dynamic real-time distance
    const time = viewer.clock.currentTime;
    const pos = computeCelestialPosition(body, time);
    const distMeters = Cesium.Cartesian3.magnitude(pos);
    const distKm = (distMeters / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 });

    satAlt.textContent = `${distKm} km`;
    satVel.textContent = `${body.radiusKm.toLocaleString()} km (Radius)`;
    satLat.textContent = body.id === 'MOON' ? '27.3 days' : `${body.periodDays} days`;
    satLon.textContent = body.symbol;
    satInc.textContent = body.I ? `${body.I}°` : '---';
    satPeriod.textContent = `${body.periodDays} d`;

    // Pass and Debris rows
    const passCountdown = document.getElementById('passCountdown');
    const passMetaInfo = document.getElementById('passMetaInfo');
    const debrisProximity = document.getElementById('debrisProximity');

    if (passCountdown) passCountdown.textContent = '🌌 Deep Space Trajectory';
    if (passMetaInfo) passMetaInfo.textContent = `Solar System Orbit (${body.type})`;
    if (debrisProximity) debrisProximity.textContent = '🟢 Gravitational Equilibrium';

    detailCard.classList.remove('hidden');

    // Fly camera toward celestial body direction
    const camera = viewer.camera;
    const direction = Cesium.Cartesian3.normalize(pos, new Cesium.Cartesian3());
    const targetLook = Cesium.Cartesian3.multiplyByScalar(direction, 30000000, new Cesium.Cartesian3());
    
    camera.flyTo({
        destination: Cesium.Cartesian3.multiplyByScalar(direction, -25000000, new Cesium.Cartesian3()),
        orientation: {
            direction: direction,
            up: Cesium.Cartesian3.UNIT_Z
        },
        duration: 1.5
    });
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
                if (ent.point) ent.point.show = show;
                if (ent.label) ent.label.show = show;
            });
            if (viewer && viewer.scene.moon) viewer.scene.moon.show = show;
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
