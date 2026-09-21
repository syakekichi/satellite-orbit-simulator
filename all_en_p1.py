# -*- coding: utf-8 -*-
"""
Master English Satellite Generator for all 220 Satellites
Optimized for X's 280-weight limit (Strictly <= 276 weights).
Average weight: ~245 weights.
"""

LINK_GUIDE_EN = "🔗 Track live 3D orbit in bio👇"

ALL_EN_SATELLITES = {
    # =========================================================================
    # 1. 🇯🇵 Japan (JAXA / Commercial / Defense / Univ) [35 sats]
    # =========================================================================
    "MICHIBIKI-7": {
        "name_en": "Michibiki-7 (QZS-7 / JAXA)",
        "story_en": "🗾 [Michibiki-7 / JAXA]\nJapan's 7-satellite constellation for 24/7 cm-level positioning without US GPS! 📡\n💡 Trivia: Its hydrogen maser clock drifts only 1 sec every few million years!",
        "tags_en": "#Michibiki #QZSS #JAXA #GPS"
    },
    "ALOS-4": {
        "name_en": "ALOS-4 (Daichi-4 / JAXA)",
        "story_en": "🛡️ [ALOS-4 / JAXA]\nJapan's radar satellite piercing night & storms to detect ground shifts in millimeters! 📡\n💡 Trivia: Swath width expanded 4x (200km) to scan all Japan in a single pass.",
        "tags_en": "#ALOS4 #JAXA #EarthObservation"
    },
    "ALOS-2": {
        "name_en": "ALOS-2 (Daichi-2 / JAXA)",
        "story_en": "🇯🇵 [ALOS-2 / JAXA]\nRevealed 4m ground shifts during the Noto quake, aiding disaster rescue from orbit! 🛰️\n💡 Trivia: Built for 5 years, this radar sentinel has operated for over a decade!",
        "tags_en": "#ALOS2 #JAXA #EarthObservation"
    },
    "HIMAWARI-9": {
        "name_en": "Himawari-9 (Weather Sentinel)",
        "story_en": "🛰️ [Himawari-9 / Japan Met]\nScans Japan every 2.5 minutes in color to track typhoons 24/7 from 36,000 km! 🌏🌀\n💡 Trivia: Captures an entire hemisphere of the Earth every 10 minutes!",
        "tags_en": "#Himawari9 #Weather #Space"
    },
    "HIMAWARI-8": {
        "name_en": "Himawari-8 (Weather Legend)",
        "story_en": "🌻 [Himawari-8 / Japan Met]\nRevolutionized global meteorology by replacing black & white stills with true-color video! ✨\n💡 Trivia: Now in standby orbit, ready to step in if its twin fails.",
        "tags_en": "#Himawari8 #Meteorology #Earth"
    },
    "XRISM": {
        "name_en": "XRISM (JAXA・NASA)",
        "story_en": "🌌 [XRISM / JAXA・NASA]\nProbing black holes and supernovas with unprecedented X-ray spectral precision! ❄️🔭\n💡 Trivia: Spectrometer is cooled to -273.1°C, just 0.05°C above absolute zero!",
        "tags_en": "#XRISM #JAXA #NASA #Astronomy"
    },
    "GOSAT-2": {
        "name_en": "Ibuki-2 (GOSAT-2 / JAXA)",
        "story_en": "🌍 [Ibuki-2 (GOSAT-2) / JAXA]\nTracks CO2 and methane from space with extreme accuracy to monitor climate trends! 🌱\n💡 Trivia: Analyzes the unique light absorption fingerprints of gas molecules.",
        "tags_en": "#GOSAT2 #ClimateChange #Earth"
    },
    "GCOM-W": {
        "name_en": "Shizuku (GCOM-W / JAXA)",
        "story_en": "🌊 [Shizuku (GCOM-W) / JAXA]\nA spinning 2m dish measuring global rain, sea temp, and polar ice through clouds! 🛰️💧\n💡 Trivia: Internal reaction wheels counter torque from its spinning 2m dish.",
        "tags_en": "#GCOMW #JAXA #EarthObservation"
    },
    "GCOM-C": {
        "name_en": "Shikisai (GCOM-C / JAXA)",
        "story_en": "🎨 [Shikisai (GCOM-C) / JAXA]\nScans global vegetation, aerosols, and plankton across 19 optical wavelengths! 🌿✨\n💡 Trivia: Detects subtle ocean color shifts to predict prime fishing zones.",
        "tags_en": "#GCOMC #JAXA #EarthScience"
    },
    "KIRAMEKI": {
        "name_en": "Kirameki-2 (DSN-2 / Defense)",
        "story_en": "📡 [Kirameki-2 / Japan Defense]\nJapan's military comms satellite, linking naval fleets and aircraft with jam-proof X-band radio! 🛡️\n💡 Trivia: Engineered to resist extreme electronic warfare and jamming.",
        "tags_en": "#Defense #Satellite #Space"
    },
    "IGS": {
        "name_en": "IGS Radar 7 (Reconnaissance)",
        "story_en": "🕵️ [IGS Radar 7 / Japan]\nPierces dark night and stormy clouds with radar to safeguard national security. 🛰️🔍\n💡 Trivia: Delivers high-res radar imagery 24/7; exact specs remain top secret!",
        "tags_en": "#IGS #Reconnaissance #Satellite"
    },
    "QPS-SAR": {
        "name_en": "QPS-SAR (Tsukuyomi-I)",
        "story_en": "🛰️ [QPS-SAR / Japan NewSpace]\nDeploys a 3.6m dish to pierce storm clouds at a fraction of traditional costs! 📡✨\n💡 Trivia: Its origami-like mesh antenna unfurls in orbit like an umbrella!",
        "tags_en": "#QPSSAR #NewSpace #SmallSat"
    },
    "STRIX": {
        "name_en": "StriX-1 (Synspective)",
        "story_en": "🛰️ [StriX-1 / Synspective]\nTokyo startup's SAR satellite mapping millimeter ground sinking to protect cities! 🛡️\n💡 Trivia: Its 5m slotted-array antenna unfolds in orbit from a compact body.",
        "tags_en": "#Synspective #StriX #Radar"
    },
    "ADRAS": {
        "name_en": "ADRAS-J (Astroscale)",
        "story_en": "🇯🇵 [ADRAS-J / Astroscale]\nApproached within meters of a tumbling 11m rocket stage, taking close-up photos! 🤖🛰️\n💡 Trivia: Inspected non-cooperative dead debris autonomously without GPS!",
        "tags_en": "#ADRASJ #Astroscale #SpaceDebris"
    },
    "HAYABUSA2": {
        "name_en": "Hayabusa2 (Asteroid Sampler / JAXA)",
        "story_en": "☄️ [Hayabusa2 / JAXA]\nBlasted a crater into Asteroid Ryugu, grabbed subsurface dust, and returned to Earth! 🪐✨\n💡 Trivia: Currently cruising to fast-spinning micro-asteroid 1998 KY26!",
        "tags_en": "#Hayabusa2 #JAXA #Asteroid"
    },
    "SLIM": {
        "name_en": "SLIM & SORA-Q (JAXA)",
        "story_en": "🌕 [SLIM & SORA-Q / JAXA]\nAchieved pinpoint lunar touchdown within 55m! Photographed by SORA-Q, a transforming robot! 🤖🇯🇵\n💡 Trivia: SORA-Q weighs only 250g, co-developed with toy maker Takara Tomy!",
        "tags_en": "#SLIM #MoonLanding #JAXA"
    },
    "HAYABUSA-1": {
        "name_en": "Hayabusa (Asteroid Explorer / JAXA)",
        "story_en": "🚀 [First Hayabusa / JAXA]\nOvercame engine failures and lost comms to bring Asteroid Itokawa grains to Earth! ☄️🔥\n💡 Trivia: Sent a touching final photo of Earth before blazing in the atmosphere.",
        "tags_en": "#Hayabusa #JAXA #DeepSpace"
    },
    "AKATSUKI": {
        "name_en": "Akatsuki (Venus Orbiter / JAXA)",
        "story_en": "🌟 [Akatsuki / JAXA]\nAfter engine failure, spent 5 years orbiting the Sun before thrusters saved the mission! 🪐🔥\n💡 Trivia: Discovered giant gravity waves stretching 10,000 km across Venus!",
        "tags_en": "#Akatsuki #Venus #JAXA"
    },
    "KAGUYA": {
        "name_en": "Kaguya (SELENE / Lunar Orbiter)",
        "story_en": "🌕 [Kaguya (SELENE) / JAXA]\nHistoric lunar orbiter mapping gravity and topography across the Moon! 🌔\n💡 Trivia: Captured the iconic high-definition video of Earth rising over the Moon.",
        "tags_en": "#Kaguya #SELENE #Moon"
    },
    "IKAROS": {
        "name_en": "IKAROS (Solar Sail / JAXA)",
        "story_en": "⛵ [IKAROS / JAXA]\nUnfurled a 14m sail thinner than hair, proving photon propulsion on its way to Venus! ✨\n💡 Trivia: Accelerated using only sunlight photon pressure without any fuel!",
        "tags_en": "#IKAROS #SolarSail #JAXA"
    },
    "BEPICOLOMBO-MIO": {
        "name_en": "Mio (MMO / JAXA)",
        "story_en": "🪐 [Mio (BepiColombo) / JAXA]\nSpinning 15 RPM to distribute 400°C blistering solar heat while probing Mercury! 🛰️🔥\n💡 Trivia: Coated with ceramic mirror tiles to deflect intense solar rays.",
        "tags_en": "#BepiColombo #Mio #JAXA"
    },
    "MMX": {
        "name_en": "MMX (Phobos Sampler / JAXA)",
        "story_en": "🔴 [MMX / JAXA]\nMission to land on Mars' moon Phobos, scoop surface dust, and fly it back to Earth! 🪐🚀\n💡 Trivia: Phobos is thought to hold ancient dust blasted from Mars by impacts.",
        "tags_en": "#MMX #Mars #JAXA"
    },
    "HITOMI": {
        "name_en": "Hitomi (ASTRO-H / JAXA)",
        "story_en": "🌌 [Hitomi (ASTRO-H) / JAXA]\nBefore losing attitude control, proved hot gas in Perseus cluster is remarkably calm! 🔭\n💡 Trivia: Its groundbreaking science directly inspired the new XRISM telescope.",
        "tags_en": "#Hitomi #XRISM #Astronomy"
    },
    "HALCA": {
        "name_en": "HALCA (Space VLBI / JAXA)",
        "story_en": "📡 [HALCA / JAXA]\nLinked an 8m space dish with ground antennas to create a telescope 3x Earth's size! ✨\n💡 Trivia: Imaged relativistic plasma jets shooting from supermassive black holes.",
        "tags_en": "#HALCA #RadioAstronomy #JAXA"
    },
    "AKARI": {
        "name_en": "Akari (Infrared Telescope / JAXA)",
        "story_en": "✨ [Akari (ASTRO-F) / JAXA]\nSurveyed 96% of the sky in infrared, discovering hundreds of thousands of hidden stars! 🔭\n💡 Trivia: Chilled with liquid helium to spot newborn stars behind cosmic dust.",
        "tags_en": "#Akari #Infrared #Astronomy"
    },
    "ARASE": {
        "name_en": "Arase (ERG / JAXA)",
        "story_en": "⚡ [Arase (ERG) / JAXA]\nDives through intense Van Allen radiation to study how electrons reach light speed! 🛡️\n💡 Trivia: Proved plasma chorus waves act like natural particle accelerators.",
        "tags_en": "#Arase #VanAllenBelts #Space"
    },
    "OSUMI": {
        "name_en": "Osumi (Japan's First Satellite / 1970)",
        "story_en": "🚀 [Osumi / 1970]\nLaunched Feb 11, 1970! Made Japan the 4th nation to orbit a satellite independently! 🗾\n💡 Trivia: Reached orbit using an unguided solid rocket without any guidance computer!",
        "tags_en": "#Osumi #SpaceHistory #Japan"
    },
    "KOUNOTORI": {
        "name_en": "Kounotori (HTV / JAXA)",
        "story_en": "📦 [Kounotori (HTV) / JAXA]\nDelivered tons of supplies and experiment racks to the ISS with a 100% success rate! 🛰️✨\n💡 Trivia: Pioneered the berthing method—captured in orbit by Canadarm2.",
        "tags_en": "#Kounotori #HTV #ISS"
    },
    "HTV-X": {
        "name_en": "HTV-X (Next-Gen Cargo / JAXA)",
        "story_en": "🚀 [HTV-X / JAXA]\nLaunching on H3 to supply the ISS and the future lunar orbital station Gateway! 🌙\n💡 Trivia: Delivers 1.5x more cargo while halving production costs via modular design.",
        "tags_en": "#HTVX #H3 #Gateway #ISS"
    },
    "TSUBAME": {
        "name_en": "Tsubame (SLATS / JAXA)",
        "story_en": "🏆 [Tsubame (SLATS) / JAXA]\nFlew at an ultra-low 167 km altitude using ion thrusters—earning a Guinness Record! ✨\n💡 Trivia: Proved low orbit enables compact cameras to capture extreme detail.",
        "tags_en": "#Tsubame #GuinnessRecord #JAXA"
    },
    "FUJI": {
        "name_en": "Fuji-3 (JAS-2 / Ham Radio)",
        "story_en": "📻 [Fuji-3 (JAS-2) / JAXA・JARL]\nAmateur radio satellite relaying voice & packet messages across continents! 📡✨\n💡 Trivia: Provided emergency communications when ground networks failed in disasters.",
        "tags_en": "#Fuji3 #AmateurRadio #HamRadio"
    },
    "MAIDO-1": {
        "name_en": "Maido-1 (SOHLA-1 / Osaka)",
        "story_en": "🏭 [Maido-1 / Small Business Space]\nBuilt by passionate small machine shops in Osaka to prove street-level craftsmanship! 🛠️✨\n💡 Trivia: Successfully monitored orbital lightning discharge phenomena in orbit.",
        "tags_en": "#Maido1 #NewSpace #Craftsmen"
    },
    "CUBESAT-XI": {
        "name_en": "XI-IV (Todai CubeSat / 2003)",
        "story_en": "🎓 [XI-IV / University of Tokyo]\nLaunched in 2003, this 1kg 10cm cube proved tiny CubeSats can take space photos! 📷\n💡 Trivia: Built for 1 year, it is still transmitting signals after 20+ years!",
        "tags_en": "#CubeSat #Todai #SmallSat"
    },
    "GOSAT-GW": {
        "name_en": "GOSAT-GW (Climate Sentinel / JAXA)",
        "story_en": "🌍 [GOSAT-GW / JAXA]\nCombines greenhouse gas tracking and microwave radiometry into a single sentinel! 🛰️\n💡 Trivia: Simultaneously predicts typhoon rainfall and monitors global warming.",
        "tags_en": "#GOSATGW #EarthObservation #Climate"
    },
    "EARTHCARE": {
        "name_en": "Hakuryu (EarthCARE / JAXA・ESA)",
        "story_en": "🐉 [Hakuryu (EarthCARE) / JAXA・ESA]\nCarries the world's first Doppler cloud radar to measure falling droplet speeds! ☁️\n💡 Trivia: Solves how clouds cool or warm Earth in global climate models.",
        "tags_en": "#EarthCARE #Hakuryu #ESA #JAXA"
    },

    # =========================================================================
    # 2. 🇺🇸 USA NASA (Deep Space / Science / Telescopes) [35 sats]
    # =========================================================================
    "VOYAGER-1": {
        "name_en": "Voyager 1 (Interstellar Probe / NASA)",
        "story_en": "🌌 [Voyager 1 / NASA]\nOver 24 billion km away, cruising interstellar space beyond the Sun's bubble! 🚀\n💡 Trivia: Its radio signals take over 22 hours to travel across space to Earth.",
        "tags_en": "#Voyager1 #NASA #Interstellar"
    },
    "VOYAGER-2": {
        "name_en": "Voyager 2 (Grand Tour / NASA)",
        "story_en": "🪐 [Voyager 2 / NASA]\nThe only probe to visit Jupiter, Saturn, Uranus, and Neptune! Now in deep space 🌌\n💡 Trivia: Discovered Neptune's Great Dark Spot and Uranus's tilted magnetic field.",
        "tags_en": "#Voyager2 #SolarSystem #NASA"
    },
    "PIONEER-10": {
        "name_en": "Pioneer 10 (Deep Space Probe / NASA)",
        "story_en": "🚀 [Pioneer 10 / NASA]\nFirst craft to cross the asteroid belt and visit Jupiter on a path out of our system! ✨\n💡 Trivia: Carries a golden plaque with human figures and galactic coordinates.",
        "tags_en": "#Pioneer10 #NASA #DeepSpace"
    },
    "NEW-HORIZONS": {
        "name_en": "New Horizons (Pluto Explorer / NASA)",
        "story_en": "💖 [New Horizons / NASA]\nSped past Pluto at 50,000 km/h, revealing nitrogen glaciers and ice mountains! 🪐\n💡 Trivia: Carries ashes of Clyde Tombaugh, who discovered Pluto in 1930.",
        "tags_en": "#NewHorizons #Pluto #NASA"
    },
    "CASSINI": {
        "name_en": "Cassini (Saturn Orbiter / NASA・ESA)",
        "story_en": "🪐 [Cassini / NASA・ESA]\nFound water geysers erupting on moon Enceladus and probed Saturn across 294 orbits! ❄️\n💡 Trivia: Ended with a planned dive into Saturn to protect pristine moons.",
        "tags_en": "#Cassini #Saturn #NASA #ESA"
    },
    "JUNO": {
        "name_en": "Juno (Jupiter Explorer / NASA)",
        "story_en": "⚡ [Juno / NASA]\nPowered by giant solar panels, swoops within thousands of km of Jupiter's cyclones! 🌀\n💡 Trivia: Encased in a 1cm titanium vault to survive blistering radiation.",
        "tags_en": "#Juno #Jupiter #NASA #Astronomy"
    },
    "PARKER": {
        "name_en": "Parker Solar Probe (NASA)",
        "story_en": "☀️ [Parker Solar Probe / NASA]\nFlying through the Sun's 1,000,000°C corona at a record-setting 700,000 km/h! 🔥🚀\n💡 Trivia: Heat shield endures 1,400°C while instruments stay cool at 30°C.",
        "tags_en": "#ParkerSolarProbe #Sun #NASA"
    },
    "JWST": {
        "name_en": "James Webb Space Telescope (JWST)",
        "story_en": "🔭 [JWST / NASA・ESA]\nWith its 6.5m gold mirror at L2, JWST captures light from stars born 13.5B years ago! ✨\n💡 Trivia: Chilled to -233°C beneath a tennis-court-sized Kapton sunshield.",
        "tags_en": "#JWST #JamesWebb #NASA #Astronomy"
    },
    "HUBBLE": {
        "name_en": "Hubble Space Telescope (HST)",
        "story_en": "✨ [Hubble Space Telescope / NASA]\nFor over 30 years, Hubble has captured awe-inspiring nebulas and universe history! 🔭\n💡 Trivia: Can lock its pointing beam on a coin 320 km away without jitter!",
        "tags_en": "#Hubble #HST #NASA #Space"
    },
    "KEPLER": {
        "name_en": "Kepler Space Telescope (NASA)",
        "story_en": "🪐 [Kepler / NASA]\nStared at 150,000 stars to prove our galaxy hosts more planets than stars! 🔍✨\n💡 Trivia: Found worlds using solar photon pressure after reaction wheels failed!",
        "tags_en": "#Kepler #Exoplanets #NASA"
    },
    "TESS": {
        "name_en": "TESS (Exoplanet Hunter / NASA)",
        "story_en": "🪐 [TESS / NASA]\nMonitors hundreds of thousands of nearby stars to spot habitable alien worlds! ✨\n💡 Trivia: Operates in an orbit gravitationally resonant with the Moon.",
        "tags_en": "#TESS #Exoplanets #NASA"
    },
    "CHANDRA": {
        "name_en": "Chandra X-ray Observatory (NASA)",
        "story_en": "🌠 [Chandra / NASA]\nReveals multi-million-degree gas, supernovas, and black hole jets in sharp detail! 🔭⚡\n💡 Trivia: Its mirrors are smoothed down to the thickness of just a few atoms!",
        "tags_en": "#Chandra #Xray #NASA #BlackHole"
    },
    "SPITZER": {
        "name_en": "Spitzer Space Telescope (NASA)",
        "story_en": "✨ [Spitzer / NASA]\nNASA's Great Observatory, unveiling stellar nurseries and exoplanet atmospheres! 🔭\n💡 Trivia: Discovered the 7 Earth-sized rocky planets of TRAPPIST-1!",
        "tags_en": "#Spitzer #TRAPPIST1 #NASA"
    },
    "PERSEVERANCE": {
        "name_en": "Perseverance Rover (Mars 2020 / NASA)",
        "story_en": "🔴 [Perseverance / NASA]\nExtracting rock cores in Jezero Crater for a historic sample return to Earth! 🪐\n💡 Trivia: Successfully converted Martian carbon dioxide into oxygen with MOXIE!",
        "tags_en": "#Perseverance #Mars2020 #NASA"
    },
    "INGENUITY": {
        "name_en": "Ingenuity (Mars Helicopter / NASA)",
        "story_en": "🚁 [Ingenuity / NASA]\nSpun twin carbon blades at 2,400 RPM to achieve powered flight in Mars's thin air! 🌬️\n💡 Trivia: Designed for only 5 test hops, it completed an astounding 72 flights!",
        "tags_en": "#Ingenuity #MarsHelicopter #NASA"
    },
    "CURIOSITY": {
        "name_en": "Curiosity Rover (NASA)",
        "story_en": "🚙 [Curiosity / NASA]\nNuclear rover climbing Mount Sharp in Gale Crater, proving Mars had ancient lakes! 🧪\n💡 Trivia: Zaps rocks with its ChemCam laser to analyze chemical elements.",
        "tags_en": "#Curiosity #Mars #NASA #Rover"
    },
    "MRO": {
        "name_en": "Mars Reconnaissance Orbiter (NASA)",
        "story_en": "📸 [MRO / NASA]\nIts HiRISE camera resolves features as small as a kitchen plate from 300 km above! 🪐\n💡 Trivia: Relays the vast majority of scientific data from surface rovers to Earth.",
        "tags_en": "#MRO #HiRISE #Mars #NASA"
    },
    "DART": {
        "name_en": "DART (Planetary Defense / NASA)",
        "story_en": "🎯 [DART / NASA]\nSlammed into Dimorphos at 6 km/s, shifting its orbit by 33 min in a defense test! 🛡️\n💡 Trivia: Proved kinetic impactors can deflect hazardous asteroids away from Earth.",
        "tags_en": "#DART #PlanetaryDefense #NASA"
    },
    "OSIRIS-REX": {
        "name_en": "OSIRIS-REx (Bennu Sampler / NASA)",
        "story_en": "☄️ [OSIRIS-REx / NASA]\nShot nitrogen gas to grab carbonaceous grains, parachuting them to Earth in 2023! 📦\n💡 Trivia: The returned grains contain water and amino acids—the seeds of life!",
        "tags_en": "#OSIRISREx #Asteroid #Bennu"
    },
    "LUCY": {
        "name_en": "Lucy (Trojan Asteroid Scout / NASA)",
        "story_en": "🦴 [Lucy / NASA]\nVisiting Jupiter's Trojan asteroids—primitive fossils from planet birth 4.5B years ago! 🛰️\n💡 Trivia: Powered by twin 7.3m solar arrays, named after the hominin fossil 'Lucy'.",
        "tags_en": "#LucyMission #Trojans #NASA"
    },
    "PSYCHE": {
        "name_en": "Psyche (Metal Asteroid Scout / NASA)",
        "story_en": "⚔️ [Psyche / NASA]\nMission to asteroid 16 Psyche, a metallic body of iron and nickel rather than rock! 🛰️\n💡 Trivia: Offers humanity's first look into a exposed metallic planetary core.",
        "tags_en": "#MissionToPsyche #Asteroids #NASA"
    },
    "DAWN": {
        "name_en": "Dawn (Vesta & Ceres Orbiter / NASA)",
        "story_en": "🚀 [Dawn / NASA]\nUsed ion engines to orbit both Vesta and Ceres, revealing salt-bright craters! ✨\n💡 Trivia: Unmasked Ceres's bright spots as sodium carbonate salts from deep brine.",
        "tags_en": "#DawnMission #Ceres #Vesta"
    },
    "DEEP-IMPACT": {
        "name_en": "Deep Impact (Comet Impactor / NASA)",
        "story_en": "💥 [Deep Impact / NASA]\nFired a copper impactor into Comet Tempel 1 at 37,000 km/h to inspect internal ice! ☄️\n💡 Trivia: Made of pure copper to avoid interfering with spectral emission lines.",
        "tags_en": "#DeepImpact #Comet #NASA"
    },
    "STARDUST": {
        "name_en": "Stardust (Comet Dust Sampler / NASA)",
        "story_en": "🧊 [Stardust / NASA]\nCaptured hypervelocity dust from Comet Wild 2 in aerogel and returned to Earth! ☄️✨\n💡 Trivia: Delivered the first extraterrestrial glycine (amino acid) from a comet.",
        "tags_en": "#Stardust #CometDust #NASA"
    },
    "SDO": {
        "name_en": "Solar Dynamics Observatory (SDO)",
        "story_en": "☀️ [SDO / NASA]\nTakes ultra-HD images of solar flares and magnetic loops every 10 seconds! 🔥\n💡 Trivia: Generates an astonishing 1.5 terabytes of raw solar data every day.",
        "tags_en": "#SDO #Sun #SolarPhysics #NASA"
    },
    "SOHO": {
        "name_en": "SOHO (Solar Observatory / ESA・NASA)",
        "story_en": "☀️ [SOHO / ESA・NASA]\nObserves the solar corona and solar wind continuously from the L1 point! ☄️\n💡 Trivia: Citizen scientists examining its public images have discovered 5,000+ comets!",
        "tags_en": "#SOHO #Sun #Comets #NASA"
    },
    "MESSENGER": {
        "name_en": "MESSENGER (Mercury Orbiter / NASA)",
        "story_en": "🌑 [MESSENGER / NASA]\nFirst craft to orbit Mercury, discovering abundant water ice in shadowed craters! ❄️\n💡 Trivia: Protected from 400°C temperatures by a ceramic woven sunshade.",
        "tags_en": "#MESSENGER #Mercury #NASA"
    },
    "MAGELLAN": {
        "name_en": "Magellan (Venus Radar Mapper / NASA)",
        "story_en": "🌋 [Magellan / NASA]\nMapped 98% of Venus's surface through dense sulfuric clouds with radar! 🔥\n💡 Trivia: Pioneered aerobraking by dipping into upper atmosphere to reshape its orbit.",
        "tags_en": "#Magellan #Venus #NASA"
    },
    "LRO": {
        "name_en": "Lunar Reconnaissance Orbiter (LRO)",
        "story_en": "🌔 [LRO / NASA]\nCircling the Moon since 2009, mapping surface topography down to 50cm resolution! 📸\n💡 Trivia: Photographed Apollo landing sites, rover wheel tracks, and descent stages!",
        "tags_en": "#LRO #Moon #NASA #Lunar"
    },
    "APOLLO-11-CSM": {
        "name_en": "Apollo 11 CSM (Columbia / 1969)",
        "story_en": "👨‍🚀 [Apollo 11 Columbia / 1969]\nOrbiting the Moon while Armstrong walked on the surface, bringing heroes home! 🌕✨\n💡 Trivia: Its guidance computer had just a few kilobytes of RAM—less than a digital watch!",
        "tags_en": "#Apollo11 #MoonLanding #NASA"
    },
    "ARTEMIS-ORION": {
        "name_en": "Artemis 1 Orion (NASA)",
        "story_en": "🚀 [Artemis 1 Orion / NASA]\nTraveled 430,000 km beyond Earth on a test flight to pave the way for human moon bases! 🌙\n💡 Trivia: Flew farther from Earth than any spacecraft designed for human astronauts.",
        "tags_en": "#Artemis #Orion #NASA #Moon"
    },
    "VOYAGER-RECORD": {
        "name_en": "Voyager Golden Record (NASA)",
        "story_en": "📀 [Voyager Golden Record]\nA gold-plated phonograph record carrying Earth sounds, songs, and greetings across space! 📜\n💡 Trivia: Engineered to survive interstellar radiation for over a billion years.",
        "tags_en": "#GoldenRecord #Voyager #Cosmos"
    },
    "PIONEER-11": {
        "name_en": "Pioneer 11 (Saturn Pioneer / NASA)",
        "story_en": "🪐 [Pioneer 11 / NASA]\nFirst craft to make a close flyby of Saturn, discovering its narrow F ring! 🔭\n💡 Trivia: Tested whether Saturn's rings were safe for the upcoming Voyager probes.",
        "tags_en": "#Pioneer11 #Saturn #NASA"
    },
    "HUYGENS": {
        "name_en": "Huygens Probe (Titan Lander / ESA)",
        "story_en": "🍊 [Huygens Probe / ESA]\nFarthest landing in human history, touching down on Saturn's orange moon Titan! 📸\n💡 Trivia: Landed on icy pebbles and photographed riverbeds carved by liquid methane.",
        "tags_en": "#Huygens #Titan #ESA #Cassini"
    },
    "INSIGHT": {
        "name_en": "InSight (Mars Seismometer / NASA)",
        "story_en": "🔴 [InSight / NASA]\nPlaced a sensitive seismometer directly on Mars, detecting 1,300+ marsquakes! 🧪\n💡 Trivia: Revealed that Mars has a liquid metallic core and a surprisingly thin crust.",
        "tags_en": "#InSight #MarsQuake #NASA"
    }
}
