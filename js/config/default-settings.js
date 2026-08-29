/**
 * 年間歳時記カレンダー 初期レイヤースタイル設定
 */

window.defaultAnnualSettings = {
    canvasBg: { fill: "#0c101c" }, // 深遠な天球ネイビーブラック
    wheelOrientation: { baseOffsetDeg: -90 }, // 1月1日（または立春）を上部に配置
    
    // 四季 (4 Seasons)
    seasons: {
        opacity: 0.9,
        fontFamily: "'Shippori Mincho', 'YuMincho', serif",
        fontSize: 22,
        dividerWidth: 1.5,
        dividerColor: "rgba(212, 175, 55, 0.4)"
    },

    // 二十四節気 (24 Solar Terms)
    sekki24: {
        opacity: 0.95,
        fontFamily: "'Shippori Mincho', 'YuMincho', serif",
        fontSize: 16,
        color: "#e2e8f0",
        dividerWidth: 1.0,
        dividerColor: "rgba(212, 175, 55, 0.3)",
        bgOpacity: 0.12
    },

    // 七十二候 (72 Micro-Seasons)
    kou72: {
        opacity: 0.92,
        fontFamily: "'Shippori Mincho', 'YuMincho', serif",
        fontSize: 11,
        color: "#cbd5e1",
        dividerWidth: 0.6,
        dividerColor: "rgba(255, 255, 255, 0.15)",
        bgOpacity: 0.08
    },

    // 365日 目盛り・日付 (Date Grid)
    dateGrid: {
        opacity: 0.85,
        fontFamily: "'Cinzel', 'Shippori Mincho', serif",
        fontSize: 9,
        color: "#94a3b8",
        monthColor: "#d4af37",
        monthFontSize: 13,
        tickColor: "rgba(255, 255, 255, 0.25)",
        monthDividerColor: "#d4af37"
    },

    // 歳時記・季語・風物詩 (Saijiki & Haiku)
    saijiki: {
        opacity: 0.9,
        fontFamily: "'Shippori Mincho', 'YuMincho', serif",
        fontSize: 11,
        color: "#d4af37",
        dividerWidth: 0.5,
        dividerColor: "rgba(212, 175, 55, 0.2)"
    },

    // 二十七宿 (27 Lunar Mansions)
    lunarMansion: {
        opacity: 0.85,
        fontFamily: "'Shippori Mincho', 'YuMincho', serif",
        fontSize: 13,
        color: "#8b949e",
        dividerColor: "#555555",
        dividerWidth: 0.8
    },

    // 黄道十二星座 (12 Tropical Zodiac Signs)
    zodiacRing: {
        displayType: "symbol",
        fontFamily: "'Cinzel', 'Shippori Mincho', serif",
        fontSize: 18,
        color: "#d4af37",
        dividerColor: "rgba(212, 175, 55, 0.5)",
        dividerWidth: 1.0,
        opacity: 0.95
    },

    // 天体時計の針 (Annual Celestial Hands)
    clockHands: {
        handStyle: "classic",
        sunHandColor: "#f59e0b",
        sunHandWidth: 2.5,
        sunHandLength: 780,
        moonHandColor: "#38bdf8",
        moonHandWidth: 1.8,
        moonHandLength: 920,
        centerPivotRadius: 18,
        centerPivotColor: "#d4af37",
        opacity: 0.95
    },

    // ユーザー観察記録 (User Observations & Diary)
    userEvents: {
        opacity: 0.95,
        fontFamily: "'Shippori Mincho', 'YuMincho', serif",
        fontSize: 11,
        sectorWashOpacity: 0.25,
        showDot: true,
        showLabel: true
    }
};
