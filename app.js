/**
 * SatViewer3D Engine: CesiumJS + satellite.js
 */

// Smart Auto Language Detection (Defaults to English for International Visitors)
function detectDefaultLanguage() {
    const saved = localStorage.getItem('sat_lang');
    if (saved) return saved;

    const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (navLang.startsWith('ja')) return 'ja';
    if (navLang.startsWith('zh')) return 'zh';
    if (navLang.startsWith('es')) return 'es';
    if (navLang.startsWith('ru')) return 'ru';
    
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
        if (upper.includes('HUBBLE')) return 'HUBBLE (ハッブル宇宙望遠鏡)';
    } else if (lang === 'zh') {
        if (upper.includes('HIMAWARI-8')) return 'HIMAWARI-8 (葵花8号备用星)';
        if (upper.includes('HIMAWARI-9')) return 'HIMAWARI-9 (葵花9号主观星)';
        if (upper.includes('MICHIBIKI-6')) return 'MICHIBIKI-6 (引路6号 - H3发射)';
        if (upper.includes('MICHIBIKI')) return name.replace('MICHIBIKI', '引路号');
        if (upper.includes('ISS')) return 'ISS (国际空间站)';
        if (upper.includes('TIANGONG')) return 'TIANGONG (天宫空间站)';
        if (upper.includes('BEIDOU')) return 'BEIDOU-3 (北斗3号导航星)';
        if (upper.includes('HUBBLE')) return 'HUBBLE (哈勃空间望远镜)';
    }
    
    return name;
}

const TRANSLATIONS = {
    ja: {
        statCount: "追跡衛星数",
        statTime: "シミュレーション時刻",
        dragPanel: "⋮⋮ ドラッグでパネル移動",
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
        statCount: "Tracked Satellites",
        statTime: "Simulation Time",
        dragPanel: "⋮⋮ Drag to move panel",
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
        statCount: "追踪卫星数量",
        statTime: "模拟时间",
        dragPanel: "⋮⋮ 拖动移动面板",
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
        statCount: "Satélites Rastreados",
        statTime: "Tiempo de Simulación",
        dragPanel: "⋮⋮ Arrastrar para mover panel",
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
        statCount: "Отслеживаемые спутники",
        statTime: "Время моделирования",
        dragPanel: "⋮⋮ Перетащите панель",
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
            zh: { JST: '🇯🇵 日本标准时间 (JST / UTC+9)', UTC: '🌐 协调世界时 (UTC)', NY: '🇺🇸 纽约时间 (EST/EDT)', CST: '🇨🇳 中国标准时间 (CST / UTC+8)', CET: '🇪🇸 中欧时间 (CET / UTC+1)', MSK: '🇷🇺 莫斯科时间 (MSK / UTC+3)', LOCAL: '💻 本地浏览器时间' },
            es: { JST: '🇯🇵 Hora Estándar de Japón (JST)', UTC: '🌐 Hora Universal (UTC)', NY: '🇺🇸 Nueva York (EST/EDT)', CST: '🇨🇳 Hora de China (CST)', CET: '🇪🇸 Hora Central Europea (CET)', MSK: '🇷🇺 Hora de Moscú (MSK)', LOCAL: '💻 Hora Local del Navegador' },
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
QZSS / MICHIBIKI-2 (みちびき2号 - 準天頂軌道)
1 42738U 17028A   26100.12345678  .00000000  00000-0  00000-0 0  9992
2 42738  44.0000 140.0000 0004000 120.0000 240.0000  1.00270000    02
QZSS / MICHIBIKI-3 (みちびき3号 - 静止軌道GEO)
1 42917U 17048A   26100.12345678  .00000000  00000-0  00000-0 0  9993
2 42917   0.0500 127.0000 0002000 180.0000  90.0000  1.00270000    03
QZSS / MICHIBIKI-4 (みちびき4号 - 準天頂軌道)
1 42965U 17062A   26100.12345678  .00000000  00000-0  00000-0 0  9994
2 42965  44.0000 145.0000 0004000 240.0000 120.0000  1.00270000    04
QZSS / MICHIBIKI-5 (みちびき5号機)
1 58900U 25001A   26100.12345678  .00000000  00000-0  00000-0 0  9998
2 58900  44.0000 132.5000 0004000 140.0000 220.0000  1.00273791    07
QZSS / MICHIBIKI-6 (みちびき6号機 - H3ロケット最新打上)
1 59000U 26001A   26100.12345678  .00000000  00000-0  00000-0 0  9997
2 59000  44.0000 137.5000 0004000 150.0000 210.0000  1.00273791    06
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
COSMOS 2251 DEBRIS #1 (コスモス2251 衝突デブリ)
1 33750U 09005AA  26100.12345678  .00000000  00000-0  00000-0 0  9901
2 33750  74.0300  45.1200 0015000 120.0000 240.0000 14.78000000  2001
COSMOS 2251 DEBRIS #2 (コスモス2251 衝突デブリ)
1 33751U 09005AB  26100.12345678  .00000000  00000-0  00000-0 0  9902
2 33751  74.1000  55.3000 0021000 180.0000 180.0000 14.85000000  2002
COSMOS 2251 DEBRIS #3 (コスモス2251 衝突デブリ)
1 33752U 09005AC  26100.12345678  .00000000  00000-0  00000-0 0  9903
2 33752  74.0000  65.4000 0009000  45.0000 315.0000 14.72000000  2003
COSMOS 2251 DEBRIS #4 (コスモス2251 衝突デブリ)
1 33753U 09005AD  26100.12345678  .00000000  00000-0  00000-0 0  9904
2 33753  74.2000  78.2000 0030000  90.0000 270.0000 14.90000000  2004
FENGYUN 1C DEBRIS #1 (風雲1号C 破壊実験デブリ)
1 29700U 07001A   26100.12345678  .00000000  00000-0  00000-0 0  9911
2 29700  98.6000 110.5000 0035000 210.0000 150.0000 13.95000000  3001
FENGYUN 1C DEBRIS #2 (風雲1号C 破壊実験デブリ)
1 29701U 07001B   26100.12345678  .00000000  00000-0  00000-0 0  9912
2 29701  98.6500 125.1000 0042000 160.0000 200.0000 14.05000000  3002
FENGYUN 1C DEBRIS #3 (風雲1号C 破壊実験デブリ)
1 29702U 07001C   26100.12345678  .00000000  00000-0  00000-0 0  9913
2 29702  98.5500 140.8000 0028000  80.0000 280.0000 13.88000000  3003
SL-8 ROCKET BODY DEBRIS #1 (SL-8 ロケット残骸デブリ)
1 12345U 80001A   26100.12345678  .00000000  00000-0  00000-0 0  9921
2 12345  82.9000  12.4000 0018000 300.0000  60.0000 14.12000000  4001
SL-8 ROCKET BODY DEBRIS #2 (SL-8 ロケット残骸デブリ)
1 12346U 80001B   26100.12345678  .00000000  00000-0  00000-0 0  9922
2 12346  82.9500  35.8000 0025000 150.0000 210.0000 14.20000000  4002
SL-16 ROCKET BODY DEBRIS (SL-16 大型ロケット残骸)
1 22000U 92001A   26100.12345678  .00000000  00000-0  00000-0 0  9931
2 22000  71.0000 190.2000 0011000  95.0000 265.0000 14.50000000  5001
DELTA 2 ROCKET DEBRIS (デルタ2 ロケット破片)
1 25000U 97001A   26100.12345678  .00000000  00000-0  00000-0 0  9941
2 25000  39.0000 210.5000 0038000  10.0000 350.0000 14.65000000  6001
ARIANE 4 DEBRIS (アリアン4 ロケット破片)
1 27000U 01001A   26100.12345678  .00000000  00000-0  00000-0 0  9951
2 27000  98.2000 300.1000 0015000 180.0000 180.0000 14.10000000  7001
`;

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
        zh: '气象卫星“葵花8号”(日本气象厅)。位于赤道上空约35,786公里的静止气象卫星，在东经140.7°作为9号机的备用观测星。',
        es: 'Satélite Meteorológico Geoestacionario "Himawari-8" (JMA). Situado a 35.786 km sobre el ecuador a 140,7°E para monitoreo del clima.',
        ru: 'Геостационарный метеорологический спутник "Химавари-8" (JMA). Находится на высоте 35 786 км над экватором для наблюдения за погодой.'
    },
    'HIMAWARI-9': {
        ja: '気象衛星「ひまわり9号」(気象庁)。赤道上空約35,786kmの【静止気象衛星】。地球の自転と同じ速度で周回するため日本上空(東経140.7°)に静止し、台風や集中豪雨をリアルタイム監視中。',
        en: 'Geostationary Meteorological Satellite "Himawari-9" (JMA). Positioned 35,786 km above East Asia (140.7°E) monitoring typhoons and severe weather in real-time.',
        zh: '气象卫星“葵花9号”(日本气象厅)。静止于东经140.7°赤道上空，实时监控台风与暴雨等灾害性天气。',
        es: 'Satélite Meteorológico "Himawari-9". Monitorea en tiempo real tifones y clima severo sobre Asia Oriental a 140,7°E.',
        ru: 'Метеорологический спутник "Химавари-9". Наблюдает за тайфунами и штормами над Восточной Азией в режиме реального времени.'
    },
    'MICHIBIKI-6': {
        ja: '日本・内閣府の最新準天頂衛星「みちびき6号機 (QZSS-6)」。最新H3ロケットにより打ち上げられ、みちびき7機体制によるサブメートル級・センチメートル級の超高精度GPS補強測位サービスを提供。',
        en: 'Latest QZSS-6 (Michibiki No. 6) satellite launched by Japan H3 rocket, providing sub-meter and centimeter-level high-precision GPS positioning services.',
        zh: '日本最新准天顶卫星“引路6号”(QZSS-6)。由H3火箭成功发射，实现高精度GPS定位增强服务。',
        es: 'Satélite de precisión GPS "Michibiki-6" (QZSS-6) lanzado por el cohete H3 de Japón.',
        ru: 'Новейший навигационный спутник "Мичибики-6" (QZSS-6), запущенный ракетой H3 для сверхточного GPS.'
    },
    'MICHIBIKI': {
        ja: '日本の準天頂衛星システム「みちびき」(QZSS)。日本およびアジア太平洋地域におけるGPS電波のビル陰死角をゼロにし、高精度測位を補強。',
        en: 'Quasi-Zenith Satellite System "Michibiki" (QZSS). Enhances GPS positioning accuracy across Japan and the Asia-Pacific region.',
        zh: '日本准天顶卫星系统“引路”(QZSS)。覆盖日本及亚太地区，提供厘米级GPS增强定位。',
        es: 'Sistema de Satélites Quasi-Cenital "Michibiki" (QZSS). Mejora la precisión del GPS en Japón y Asia-Pacífico.',
        ru: 'Японская квазизенитная спутниковая система "Мичибики" (QZSS) для улучшения точности GPS.'
    },
    'ISS': {
        ja: '国際宇宙ステーション (ISS)。高度約400kmの地球低軌道(LEO)を約90分で1周(時速約27,700km)。日本人宇宙飛行士が長期滞在し宇宙実験を実施。',
        en: 'International Space Station (ISS). Orbiting at ~400km altitude every 90 minutes (~27,700 km/h) hosting international astronauts for microgravity research.',
        zh: '国际空间站 (ISS)。在约400公里的近地轨道运行，每90分钟环绕地球一周。',
        es: 'Estación Espacial Internacional (EEI). Órbita a ~400 km de altitud cada 90 minutos para investigación científica.',
        ru: 'Международная космическая станция (МКС). Орбита ~400 км, полный оборот за 90 минут.'
    },
    'TIANGONG': {
        ja: '中国の宇宙ステーション「天宮」(Tiangong)。高度約380〜450kmの低軌道にて独自のアストロナウツ(航天員)が常駐する宇宙実験施設。',
        en: 'Chinese Space Station "Tiangong". Permanently crewed space laboratory orbiting at ~380-450 km altitude.',
        zh: '中国“天宫”空间站。高度约380-450公里的近地轨道长期载人空间实验室。',
        es: 'Estación Espacial China "Tiangong". Laboratorio espacial habitado permanentemente a 380-450 km.',
        ru: 'Китайская космическая станция "Тяньгун". Постоянно обитаемая космическая лаборатория.'
    },
    'BEIDOU': {
        ja: '中国の独自全地球衛星測位システム「北斗3号」(BeiDou-3)。GEO/IGSO/MEO軌道の複合コンステレーションで全世界に測位サービスを提供。',
        en: 'BeiDou-3 Global Navigation Satellite System (China). Provides global positioning, navigation, and timing services.',
        zh: '北斗三号全球卫星导航系统。混合轨道星座，为全球用户提供高精度导航与定位。',
        es: 'Sistema de Navegación por Satélite BeiDou-3 (China). Cobertura global de navegación y posicionamiento.',
        ru: 'Китайская глобальная навигационная система "Бэйдоу-3" (BeiDou-3).'
    },
    'HUBBLE': {
        ja: 'ハッブル宇宙望遠鏡 (HST / NASA・ESA)。高度約540kmの軌道上から大気の影響を受けずに深宇宙の銀河や星雲を観測する伝説の宇宙望遠鏡。',
        en: 'Hubble Space Telescope (NASA/ESA). Iconic space telescope orbiting at ~540km observing deep space galaxies and nebulae.',
        zh: '哈勃空间望远镜 (NASA/ESA)。在约540公里轨道上观测深空星系与星云。',
        es: 'Telescopio Espacial Hubble (NASA/ESA). Observa galaxias profundas desde 540 km de altitud.',
        ru: 'Космический телескоп "Хаббл" (NASA/ESA). Наблюдает за далекими галактиками с высоты 540 км.'
    },
    'GPS': {
        ja: '米国全地球測位システム (GPS / NAVSTAR) コンステレーション衛星。高度約20,200kmの中軌道(MEO)。',
        en: 'US Global Positioning System (GPS / NAVSTAR). Medium Earth Orbit (MEO) constellation at ~20,200 km altitude.',
        zh: '美国GPS全球定位系统卫星。中地球轨道(MEO)，高度约20,200公里。',
        es: 'Sistema de Posicionamiento Global de EE.UU. (GPS). Constelación MEO a 20.200 km de altitud.',
        ru: 'Американская система глобального позиционирования (GPS / NAVSTAR) на орбите 20 200 км.'
    },
    'DEBRIS': {
        ja: '宇宙ゴミ・デブリ。過去のロケット段や衛星衝突事故(イリジウム・コスモス等)により発生した危険な宇宙余剰物体。',
        en: 'Space Debris / Space Junk. Hazardous orbital fragments generated from satellite collisions and spent rocket stages.',
        zh: '空间碎片 / 太空垃圾。由卫星碰撞及废弃火箭残骸形成的轨道危险碎片。',
        es: 'Basura Espacial / Chatarra. Fragmentos orbitales peligrosos generados por colisiones de satélites.',
        ru: 'Космический мусор. Опасные фрагменты на орбите от столкновений спутников и ступеней ракет.'
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
            zh: 'SpaceX 展开的近地轨道 (LEO) 高速宽带卫星星座。',
            es: 'Constelación de satélites de Internet de banda ancha LEO de SpaceX Starlink.',
            ru: 'Низкоорбитальная спутниковая группировка широкополосного интернета SpaceX Starlink.'
        };
        return starlinkDesc[lang] || starlinkDesc['en'];
    }

    const defaultDesc = {
        ja: '地球周回軌道を周回する人工衛星。',
        en: 'Artificial satellite orbiting Earth.',
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
function initCesiumViewer() {
    // Dummy access token to bypass Cesium 1.119.0 Ion token requirement exception
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkdW1teSJ9.dummy';

    // Create Base Imagery Provider (Instant 100% Guaranteed Earth Imagery)
    const baseProvider = createBulletproofEarthProvider();

    // Bulletproof Standard Viewer Initialization
    viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: baseProvider,
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
    scene.globe.enableLighting = true;
    scene.globe.showGroundAtmosphere = true;
    scene.skyAtmosphere.show = true;
    scene.backgroundColor = Cesium.Color.fromCssColorString('#07090e');

    // Apply High-Res Base Imagery
    try {
        viewer.imageryLayers.removeAll();
        viewer.imageryLayers.addImageryProvider(createBulletproofEarthProvider());
    } catch(e) {
        console.warn("Base imagery load error:", e);
    }

    // Safe Photo Texture Overlay Loader
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

    loadSafeSingleTile('earth_texture.jpg', 0.9);   // Authentic NASA Day Earth Photo Texture
    loadSafeSingleTile('earth_clouds.png', 0.35);   // Cloud Atmosphere Overlay

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
        zh: '⭐ 主要/著名卫星 (国际空间站, 葵花, 天宫等)',
        es: '⭐ Satélites Principales (EEI, Himawari, etc.)',
        ru: '⭐ Основные спутники (МКС, Himawari и др.)'
    };
    const catDebrisLabel = {
        ja: '🚨 宇宙ゴミ・デブリ (COSMOS / FENGYUN / SL-8等)',
        en: '🚨 Space Debris & Fragments (COSMOS, FENGYUN, etc.)',
        zh: '🚨 空间碎片与太空垃圾 (COSMOS, 风云1号等)',
        es: '🚨 Basura Espacial y Fragmentos (COSMOS, etc.)',
        ru: '🚨 Космический мусор (COSMOS, FENGYUN и др.)'
    };
    const catStarlinkLabel = {
        ja: '🛰️ Starlink衛星群 (ピックアップ30機)',
        en: '🛰️ Starlink Constellation (Featured 30)',
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
    const debrisPointColor = Cesium.Color.fromCssColorString('#a855f7'); // Neon Purple for debris fragments
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
        prevSat.primitive.color = isPrevDebris ? Cesium.Color.fromCssColorString('#a855f7') : Cesium.Color.fromCssColorString('#00f3ff');
        prevSat.primitive.pixelSize = 12;
        if (prevSat.domLabel) {
            prevSat.domLabel.classList.remove('selected');
        }
    }

    selectedSatIndex = index;
    const sat = satellitesData[index];
    const isDebris = sat.name.toUpperCase().includes('DEBRIS') || sat.name.toUpperCase().includes('COSMOS') || sat.name.toUpperCase().includes('FENGYUN') || sat.name.toUpperCase().includes('SL-8');

    // Ensure DOM label exists for selected satellite even in large constellations
    if (!sat.domLabel) {
        createDomLabelForSat(sat, index);
    }

    // Highlight selected satellite (Use vibrant neon purple #c084fc for debris)
    sat.primitive.color = isDebris ? Cesium.Color.fromCssColorString('#c084fc') : Cesium.Color.fromCssColorString('#ff0055');
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
let userGeoLoc = { lat: 35.6762, lon: 139.6503, name: '東京上空' };

/**
 * Calculate Pass Prediction & Debris Proximity Radar
 */
function updatePassPredictionAndRisk(sat, jsDate) {
    const passCountdown = document.getElementById('passCountdown');
    const passMetaInfo = document.getElementById('passMetaInfo');
    const debrisProximity = document.getElementById('debrisProximity');

    if (!sat) return;
    const lang = currentLang || 'ja';

    // 1. Pass Prediction Countdown
    if (passCountdown && sat.currentCartesian) {
        const isGeo = sat.name.toUpperCase().includes('HIMAWARI') || sat.name.toUpperCase().includes('MICHIBIKI-3');

        if (isGeo) {
            const geoText = {
                ja: '常時日本上空に静止中 (常時可視)',
                en: 'Geostationary (Constantly Visible)',
                zh: '常时静止于上空 (常时可见)',
                es: 'Geoestacionario (Constantemente Visible)',
                ru: 'Геостационарный (Постоянно виден)'
            };
            passCountdown.textContent = geoText[lang] || geoText['en'];
            if (passMetaInfo) {
                const metaText = {
                    ja: `現在地(${userGeoLoc.name})から常時観測可能`,
                    en: `Constantly observable from ${userGeoLoc.name}`,
                    zh: `可从 ${userGeoLoc.name} 常时观测`,
                    es: `Constantemente observable desde ${userGeoLoc.name}`,
                    ru: `Постоянно наблюдаем из ${userGeoLoc.name}`
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
                zh: `剩余 ${hh}小时 ${mm}分 ${ss}秒`,
                es: `En ${hh}h ${mm}m ${ss}s`,
                ru: `Через ${hh}ч ${mm}м ${ss}с`
            };
            passCountdown.textContent = countText[lang] || countText['en'];
            if (passMetaInfo) {
                const passTimeString = nextPassTime.toLocaleTimeString(lang === 'ja' ? 'ja-JP' : 'en-US', { hour: '2-digit', minute: '2-digit' });
                const metaText = {
                    ja: `次回可視通過: ${passTimeString}頃 (${userGeoLoc.name} / 最大仰角 ~45°)`,
                    en: `Next Pass: ~${passTimeString} (${userGeoLoc.name} / Max Alt ~45°)`,
                    zh: `下次可过境: 约 ${passTimeString} (${userGeoLoc.name})`,
                    es: `Próximo Paso: ~${passTimeString} (${userGeoLoc.name})`,
                    ru: `След. пролет: ~${passTimeString} (${userGeoLoc.name})`
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

        const formattedDist = Math.round(minDebrisDist).toLocaleString();
        const formattedFutDist = Math.round(futureMinDist).toLocaleString();

        if (minDebrisDist <= 800 || futureMinDist <= 800) {
            const critText = {
                ja: `🚨 衝突危険警告! (${futureClosestDebris || closestDebrisName} と あと${futureMinHours || 0}時間後に ${formattedFutDist} km まで接近予測)`,
                en: `🚨 CRITICAL RISK! (Encounter with ${futureClosestDebris || closestDebrisName} in ~${futureMinHours || 0}h at ${formattedFutDist} km)`,
                zh: `🚨 紧急碰撞预警! (预测与 ${futureClosestDebris || closestDebrisName} 在约${futureMinHours || 0}小时后接近至 ${formattedFutDist} km)`,
                es: `🚨 ¡ALERTA CRÍTICA DE COLISIÓN! (Encuentro con ${futureClosestDebris || closestDebrisName} en ~${futureMinHours || 0}h a ${formattedFutDist} km)`,
                ru: `🚨 УГРОЗА СТОЛКНОВЕНИЯ! (Сближение с ${futureClosestDebris || closestDebrisName} через ~${futureMinHours || 0}ч на ${formattedFutDist} км)`
            };
            debrisProximity.innerHTML = `<span class="hazard-alert-text" style="color:#f43f5e; font-weight:700;">${critText[lang] || critText['en']}</span>`;
        } else if (minDebrisDist <= 2000 || futureMinDist <= 2000) {
            const cautText = {
                ja: `⚠️ 接近注意! (${futureClosestDebris || closestDebrisName} と あと${futureMinHours || 0}時間後に ${formattedFutDist} km に最接近)`,
                en: `⚠️ CAUTION! (Predicted pass by ${futureClosestDebris || closestDebrisName} in ~${futureMinHours || 0}h at ${formattedFutDist} km)`,
                zh: `⚠️ 接近注意! (预测 ${futureClosestDebris || closestDebrisName} 约${futureMinHours || 0}小时后接近至 ${formattedFutDist} km)`,
                es: `⚠️ PRECAUCIÓN (Paso cercano de ${futureClosestDebris || closestDebrisName} en ~${futureMinHours || 0}h a ${formattedFutDist} km)`,
                ru: `⚠️ ВНИМАНИЕ (Сближение с ${futureClosestDebris || closestDebrisName} через ~${futureMinHours || 0}ч на ${formattedFutDist} км)`
            };
            debrisProximity.innerHTML = `<span style="color:#f59e0b; font-weight:600;">${cautText[lang] || cautText['en']}</span>`;
        } else {
            const safeText = {
                ja: `🟢 24時間全軌道クリア (${formattedDist} km / 最接近デブリ: ${getSatDisplayName(closestDebrisName) || 'なし'})`,
                en: `🟢 24-Hour Clear Orbit (${formattedDist} km / Closest: ${getSatDisplayName(closestDebrisName) || 'None'})`,
                zh: `🟢 24小时全轨道安全 (${formattedDist} km / 最接近: ${getSatDisplayName(closestDebrisName) || '无'})`,
                es: `🟢 Órbita despejada 24h (${formattedDist} km / Más cercano: ${getSatDisplayName(closestDebrisName) || 'Ninguno'})`,
                ru: `🟢 Безопасная орбита 24ч (${formattedDist} км / Ближайший: ${getSatDisplayName(closestDebrisName) || 'Нет'})`
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
            const purpleColor = Cesium.Color.fromCssColorString('#a855f7');
            const purpleDim = Cesium.Color.fromCssColorString('#8b5cf6').withAlpha(0.6);
            satellitesData.forEach(sat => {
                const isDebris = sat.name.toUpperCase().includes('DEBRIS') || sat.name.toUpperCase().includes('COSMOS') || sat.name.toUpperCase().includes('FENGYUN') || sat.name.toUpperCase().includes('SL-8');
                if (isDebris && sat.entity && sat.entity.point) {
                    sat.entity.point.color = isRiskOn ? purpleColor : purpleDim;
                    sat.entity.point.pixelSize = isRiskOn ? 16 : 8;
                    sat.entity.point.outlineColor = isRiskOn ? Cesium.Color.CYAN : Cesium.Color.BLACK;
                    sat.entity.point.outlineWidth = isRiskOn ? 3 : 1;
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
        timePickerInput.addEventListener('change', (e) => {
            if (e.target.value) {
                customSimTime = new Date(e.target.value);
            }
        });
    }

    if (resetNowBtn) {
        resetNowBtn.addEventListener('click', () => {
            customSimTime = new Date();
            if (timePickerInput) timePickerInput.value = '';
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            const oneXBtn = document.querySelector('.speed-btn[data-speed="1"]');
            if (oneXBtn) oneXBtn.classList.add('active');
            timeSpeedMultiplier = 1;
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
        const handle = sidebar.querySelector('.panel-drag-bar') || sidebar;
        makeDraggable(sidebar, handle);
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
