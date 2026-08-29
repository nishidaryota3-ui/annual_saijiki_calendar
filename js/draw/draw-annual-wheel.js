/**
 * 365日・年間歳時記ホイール描画エンジン (Annual Saijiki Wheel Drawing Engine)
 */

function dateToDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    return Math.floor(diff / MS_PER_DAY);
}

function dayOfYearToAngle(dayOfYear, totalDays = 365) {
    // 1月1日を0度（12時方向・真上）とする基準角度
    return (dayOfYear / totalDays) * 360;
}

function dateToAnnualAngle(date) {
    const doy = dateToDayOfYear(date);
    return dayOfYearToAngle(doy);
}

/**
 * 年間ホイール全体の再描画
 */
function drawAnnualWheel(year = 2026) {
    const svg = document.getElementById("annual-wheel-svg");
    if (!svg) return;

    let defs = document.getElementById("annual-defs");
    if (!defs) {
        defs = createSVGElem("defs", { id: "annual-defs" });
        svg.appendChild(defs);
    }
    defs.innerHTML = "";

    const masterGroup = document.getElementById("annual-master-group");
    if (!masterGroup) return;
    masterGroup.innerHTML = "";

    // 1. 同心円ベースグリッド
    drawAnnualBaseGrid(masterGroup);

    // 2. 四季バンド (春・夏・秋・冬)
    drawSeasonsBand(masterGroup, defs);

    // 3. 二十四節気バンド (24等分・各15度)
    drawSekki24Band(masterGroup, defs);

    // 4. 七十二候バンド (72等分・各5度)
    drawKou72Band(masterGroup, defs);

    // 5. 365日 日付目盛り ＆ 12ヶ月
    drawDateGridBand(masterGroup, defs, year);

    // 6. 歳時記・季語・代表俳句バンド
    drawSaijikiBand(masterGroup, defs);

    // 7. 二十七宿バンド (27等分)
    drawAnnualMansionsBand(masterGroup, defs);

    // 8. 黄道十二星座バンド (12等分)
    drawAnnualZodiacBand(masterGroup, defs);

    // 9. ユーザーの年間観察記録
    drawAnnualUserEvents(masterGroup, year);
}

/**
 * 1. 同心円ベースグリッド
 */
function drawAnnualBaseGrid(parent) {
    const g = createSVGElem("g", { id: "layer-annual-grid", opacity: 0.6 });
    const R = ANNUAL_RINGS;

    // 各バンドの境界円
    const radii = [
        R.seasonsInner, R.seasonsOuter, R.sekki24Outer, R.kou72Outer, 
        R.dateGridOuter, R.saijikiOuter, R.mansions27Outer, R.zodiac12Outer
    ];

    radii.forEach(r => {
        g.appendChild(createSVGElem("circle", {
            cx: cx, cy: cy, r: r,
            fill: "none",
            stroke: "rgba(212, 175, 55, 0.25)",
            "stroke-width": 0.8
        }));
    });

    parent.appendChild(g);
}

/**
 * 2. 四季バンド (春・夏・秋・冬)
 */
function drawSeasonsBand(parent, defs) {
    const g = createSVGElem("g", { id: "layer-seasons" });
    const st = getLayerStyle('seasons');
    const R = ANNUAL_RINGS;
    const rIn = R.seasonsInner, rOut = R.seasonsOuter;
    const rText = (rIn + rOut) / 2;

    const seasons = window.SEASONS || [];

    seasons.forEach((s, idx) => {
        // 立春 (approx Feb 4 / 35日目 / 34.5度) から開始
        const startAng = ((s.startDeg + 40) % 360);
        const endAng = ((s.endDeg + 40) % 360);

        // 背景扇形
        const d = getSectorPathD(rIn, rOut, startAng, endAng);
        const sector = createSVGElem("path", {
            d: d,
            fill: s.color,
            opacity: st.opacity * 0.15,
            style: "cursor: pointer; transition: opacity 0.2s;"
        });
        sector.appendChild(createSVGElem("title", {}, `${s.name} (${s.en}) - ${s.desc}`));
        g.appendChild(sector);

        // 境界線
        const p1 = polarToCartesian(cx, cy, rIn, startAng);
        const p2 = polarToCartesian(cx, cy, rOut, startAng);
        g.appendChild(createSVGElem("line", {
            x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
            stroke: st.dividerColor || "rgba(212, 175, 55, 0.4)",
            "stroke-width": st.dividerWidth || 1.5
        }));

        // 四季の漢字ラベル
        const midAng = (startAng + (endAng > startAng ? endAng : endAng + 360)) / 2;
        const pt = polarToCartesian(cx, cy, rText, midAng);
        const text = createStyledText(st, {
            x: pt.x, y: pt.y,
            fill: s.color,
            "font-size": `${st.fontSize || 22}px`,
            "font-weight": "bold",
            "text-anchor": "middle",
            "dominant-baseline": "central",
            transform: `rotate(${midAng}, ${pt.x}, ${pt.y})`,
            opacity: st.opacity
        }, s.name);
        g.appendChild(text);
    });

    parent.appendChild(g);
}

/**
 * 3. 二十四節気バンド (24等分)
 */
function drawSekki24Band(parent, defs) {
    const g = createSVGElem("g", { id: "layer-sekki24" });
    const st = getLayerStyle('sekki24');
    const R = ANNUAL_RINGS;
    const rIn = R.sekki24Inner, rOut = R.sekki24Outer;
    const rText = (rIn + rOut) / 2;

    const terms = window.SOLAR_TERMS_24 || [];
    const degPerTerm = 360 / 24; // 15度

    terms.forEach((term, idx) => {
        // 立春 (idx:0) は約35日目 (34.5度)
        const startAng = (34.5 + idx * degPerTerm) % 360;
        const endAng = (startAng + degPerTerm) % 360;

        // 背景
        const d = getSectorPathD(rIn, rOut, startAng, endAng);
        const sector = createSVGElem("path", {
            d: d,
            fill: (idx % 2 === 0) ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.15)",
            opacity: st.opacity,
            style: "cursor: pointer;"
        });
        sector.onclick = () => window.openSaijikiDetailModal(term);
        sector.appendChild(createSVGElem("title", {}, `【${term.name}】(${term.reading}) - ${term.desc}`));
        g.appendChild(sector);

        // 仕切り線
        const p1 = polarToCartesian(cx, cy, rIn, startAng);
        const p2 = polarToCartesian(cx, cy, rOut, startAng);
        g.appendChild(createSVGElem("line", {
            x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
            stroke: st.dividerColor || "rgba(212, 175, 55, 0.3)",
            "stroke-width": st.dividerWidth || 1.0
        }));

        // 円弧に沿った文字テキスト
        const arcId = `arc_sekki_${idx}`;
        createTextArc(defs, arcId, rText, startAng + 1, endAng - 1);

        const textElem = createSVGElem("text", {
            fill: st.color || "#e2e8f0",
            "font-size": `${st.fontSize || 16}px`,
            "font-family": st.fontFamily || "'Shippori Mincho', serif",
            "font-weight": (idx % 6 === 0) ? "bold" : "normal", // 四季の起点（立春・立夏・立秋・立冬）を太字
            opacity: st.opacity,
            style: "cursor: pointer;"
        });
        textElem.onclick = () => window.openSaijikiDetailModal(term);

        const textPath = createSVGElem("textPath", {
            href: `#${arcId}`,
            startOffset: "50%",
            "text-anchor": "middle"
        }, term.name);

        textElem.appendChild(textPath);
        g.appendChild(textElem);
    });

    parent.appendChild(g);
}

/**
 * 4. 七十二候バンド (72等分)
 */
function drawKou72Band(parent, defs) {
    const g = createSVGElem("g", { id: "layer-kou72" });
    const st = getLayerStyle('kou72');
    const R = ANNUAL_RINGS;
    const rIn = R.kou72Inner, rOut = R.kou72Outer;
    const rText = (rIn + rOut) / 2;

    const microSeasons = window.MICRO_SEASONS_72 || [];
    const degPerKou = 360 / 72; // 5度

    microSeasons.forEach((kou, idx) => {
        const startAng = (34.5 + idx * degPerKou) % 360;
        const endAng = (startAng + degPerKou) % 360;

        // 背景
        const d = getSectorPathD(rIn, rOut, startAng, endAng);
        const sector = createSVGElem("path", {
            d: d,
            fill: (idx % 3 === 0) ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.02)",
            opacity: st.opacity,
            style: "cursor: pointer;"
        });
        sector.onclick = () => window.openKouDetailModal(kou);
        sector.appendChild(createSVGElem("title", {}, `【第${kou.id}候・${kou.name}】(${kou.reading})\n季語: ${kou.kigo}\n${kou.desc}\n\n俳句: ${kou.haiku}`));
        g.appendChild(sector);

        // 仕切り線
        const p1 = polarToCartesian(cx, cy, rIn, startAng);
        const p2 = polarToCartesian(cx, cy, rOut, startAng);
        g.appendChild(createSVGElem("line", {
            x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
            stroke: st.dividerColor || "rgba(255, 255, 255, 0.15)",
            "stroke-width": (idx % 3 === 0) ? 0.8 : 0.4
        }));

        // 半径方向に沿った縦書き配置
        const midAng = (startAng + degPerKou / 2) % 360;
        const pt = polarToCartesian(cx, cy, rText, midAng);

        const text = createStyledText(st, {
            x: pt.x, y: pt.y,
            fill: st.color || "#cbd5e1",
            "font-size": `${st.fontSize || 10}px`,
            "font-family": st.fontFamily || "'Shippori Mincho', serif",
            "text-anchor": "middle",
            "dominant-baseline": "central",
            transform: `rotate(${midAng}, ${pt.x}, ${pt.y})`,
            style: "cursor: pointer;",
            opacity: st.opacity
        }, kou.name);
        text.onclick = () => window.openKouDetailModal(kou);
        g.appendChild(text);
    });

    parent.appendChild(g);
}

/**
 * 5. 365日 日付目盛り ＆ 12ヶ月バンド
 */
function drawDateGridBand(parent, defs, year) {
    const g = createSVGElem("g", { id: "layer-date-grid" });
    const st = getLayerStyle('dateGrid');
    const R = ANNUAL_RINGS;
    const rIn = R.dateGridInner, rOut = R.dateGridOuter;
    const rMonth = rIn + 25;
    const rDate = rOut - 18;

    const monthLengths = [31, (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const monthNames = ["1月 JAN", "2月 FEB", "3月 MAR", "4月 APR", "5月 MAY", "6月 JUN", "7月 JUL", "8月 AUG", "9月 SEP", "10月 OCT", "11月 NOV", "12月 DEC"];

    let dayAccum = 0;

    for (let m = 0; m < 12; m++) {
        const daysInMonth = monthLengths[m];
        const monthStartAng = (dayAccum / 365) * 360;
        const monthEndAng = ((dayAccum + daysInMonth) / 365) * 360;

        // 月の仕切り太線
        const p1 = polarToCartesian(cx, cy, rIn, monthStartAng);
        const p2 = polarToCartesian(cx, cy, rOut, monthStartAng);
        g.appendChild(createSVGElem("line", {
            x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
            stroke: st.monthDividerColor || "#d4af37",
            "stroke-width": 1.5,
            opacity: st.opacity
        }));

        // 月名テキスト
        const arcId = `arc_month_${m}`;
        createTextArc(defs, arcId, rMonth, monthStartAng + 1, monthEndAng - 1);
        const mText = createSVGElem("text", {
            fill: st.monthColor || "#d4af37",
            "font-size": `${st.monthFontSize || 13}px`,
            "font-family": st.fontFamily || "'Cinzel', serif",
            "font-weight": "bold",
            opacity: st.opacity
        });
        const mPath = createSVGElem("textPath", {
            href: `#${arcId}`,
            startOffset: "50%",
            "text-anchor": "middle"
        }, monthNames[m]);
        mText.appendChild(mPath);
        g.appendChild(mText);

        // 日付の目盛りと数字
        for (let d = 1; d <= daysInMonth; d++) {
            const currentDayOfYear = dayAccum + (d - 1);
            const dayAng = (currentDayOfYear / 365) * 360;

            const isMajor = (d === 1 || d === 10 || d === 20 || d === daysInMonth);
            const tickLen = isMajor ? 12 : 5;
            const tp1 = polarToCartesian(cx, cy, rOut, dayAng);
            const tp2 = polarToCartesian(cx, cy, rOut - tickLen, dayAng);

            g.appendChild(createSVGElem("line", {
                x1: tp1.x, y1: tp1.y, x2: tp2.x, y2: tp2.y,
                stroke: isMajor ? "#d4af37" : (st.tickColor || "rgba(255,255,255,0.2)"),
                "stroke-width": isMajor ? 1.0 : 0.5
            }));

            if (isMajor || d % 5 === 0) {
                const ptNum = polarToCartesian(cx, cy, rDate, dayAng);
                const numText = createSVGElem("text", {
                    x: ptNum.x, y: ptNum.y,
                    fill: isMajor ? "#e2e8f0" : "#94a3b8",
                    "font-size": `${st.fontSize || 9}px`,
                    "font-family": "'Cinzel', sans-serif",
                    "text-anchor": "middle",
                    "dominant-baseline": "central",
                    transform: `rotate(${dayAng}, ${ptNum.x}, ${ptNum.y})`
                }, String(d));
                g.appendChild(numText);
            }
        }

        dayAccum += daysInMonth;
    }

    parent.appendChild(g);
}

/**
 * 6. 歳時記・季語・風物詩バンド
 */
function drawSaijikiBand(parent, defs) {
    const g = createSVGElem("g", { id: "layer-saijiki" });
    const st = getLayerStyle('saijiki');
    const R = ANNUAL_RINGS;
    const rIn = R.saijikiInner, rOut = R.saijikiOuter;
    const rText = (rIn + rOut) / 2;

    const microSeasons = window.MICRO_SEASONS_72 || [];
    const degPerKou = 360 / 72;

    microSeasons.forEach((kou, idx) => {
        const startAng = (34.5 + idx * degPerKou) % 360;
        const endAng = (startAng + degPerKou) % 360;

        const arcId = `arc_saijiki_${idx}`;
        createTextArc(defs, arcId, rText, startAng + 0.5, endAng - 0.5);

        const textElem = createSVGElem("text", {
            fill: st.color || "#d4af37",
            "font-size": `${st.fontSize || 11}px`,
            "font-family": st.fontFamily || "'Shippori Mincho', serif",
            opacity: st.opacity,
            style: "cursor: pointer;"
        });
        textElem.onclick = () => window.openKouDetailModal(kou);

        const textPath = createSVGElem("textPath", {
            href: `#${arcId}`,
            startOffset: "50%",
            "text-anchor": "middle"
        }, kou.kigo.split('・')[0]); // 主代表季語

        textElem.appendChild(textPath);
        g.appendChild(textElem);
    });

    parent.appendChild(g);
}

/**
 * 7. 二十七宿バンド (27等分)
 */
function drawAnnualMansionsBand(parent, defs) {
    const g = createSVGElem("g", { id: "layer-mansions27" });
    const st = getLayerStyle('lunarMansion');
    const R = ANNUAL_RINGS;
    const rIn = R.mansions27Inner, rOut = R.mansions27Outer;
    const rText = (rIn + rOut) / 2;

    const mansions = [
        "角", "亢", "氐", "房", "心", "尾", "箕", // 東方青龍
        "斗", "牛", "女", "虚", "危", "室", "壁", // 北方玄武 (28宿の牛含む)
        "奎", "婁", "胃", "昴", "畢", "觜", "参", // 西方白虎
        "井", "鬼", "柳", "星", "張", "翼", "軫"  // 南方朱雀
    ];

    const degPerMansion = 360 / 27;

    for (let i = 0; i < 27; i++) {
        const startAng = i * degPerMansion;
        const endAng = (i + 1) * degPerMansion;

        const p1 = polarToCartesian(cx, cy, rIn, startAng);
        const p2 = polarToCartesian(cx, cy, rOut, startAng);
        g.appendChild(createSVGElem("line", {
            x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
            stroke: st.dividerColor || "#555555",
            "stroke-width": st.dividerWidth || 0.8
        }));

        const midAng = (startAng + endAng) / 2;
        const pt = polarToCartesian(cx, cy, rText, midAng);
        const text = createStyledText(st, {
            x: pt.x, y: pt.y,
            fill: st.color || "#8b949e",
            "font-size": `${st.fontSize || 13}px`,
            "font-family": st.fontFamily || "'Shippori Mincho', serif",
            "text-anchor": "middle",
            "dominant-baseline": "central",
            transform: `rotate(${midAng}, ${pt.x}, ${pt.y})`,
            opacity: st.opacity
        }, mansions[i] || "");
        g.appendChild(text);
    }

    parent.appendChild(g);
}

/**
 * 8. 黄道十二星座バンド (12等分)
 */
function drawAnnualZodiacBand(parent, defs) {
    const g = createSVGElem("g", { id: "layer-zodiac12" });
    const st = getLayerStyle('zodiacRing');
    const R = ANNUAL_RINGS;
    const rIn = R.zodiac12Inner, rOut = R.zodiac12Outer;
    const rText = (rIn + rOut) / 2;

    const signs = window.ZODIAC_SIGNS_12 || [];
    const degPerSign = 360 / 12; // 30度

    signs.forEach((sign, i) => {
        // 春分 (約3/20 / 79日目 / 78度) を起点として牡羊座 (0度) を配置
        const startAng = (78 + i * degPerSign) % 360;
        const endAng = (startAng + degPerSign) % 360;

        const p1 = polarToCartesian(cx, cy, rIn, startAng);
        const p2 = polarToCartesian(cx, cy, rOut, startAng);
        g.appendChild(createSVGElem("line", {
            x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
            stroke: st.dividerColor || "rgba(212, 175, 55, 0.5)",
            "stroke-width": st.dividerWidth || 1.0
        }));

        const midAng = (startAng + degPerSign / 2) % 360;
        const pt = polarToCartesian(cx, cy, rText, midAng);
        const text = createStyledText(st, {
            x: pt.x, y: pt.y,
            fill: st.color || "#d4af37",
            "font-size": `${st.fontSize || 18}px`,
            "font-family": st.fontFamily || "'Cinzel', serif",
            "text-anchor": "middle",
            "dominant-baseline": "central",
            transform: `rotate(${midAng}, ${pt.x}, ${pt.y})`,
            opacity: st.opacity
        }, `${sign.symbol} ${sign.jp}`);
        g.appendChild(text);
    });

    parent.appendChild(g);
}

/**
 * 9. ユーザーの年間観察記録プロット
 */
function drawAnnualUserEvents(parent, year) {
    const g = createSVGElem("g", { id: "layer-annual-user-events" });
    const st = getLayerStyle('userEvents');
    const R = ANNUAL_RINGS;
    const rIn = R.kou72Inner, rOut = R.saijikiOuter;
    const rDot = R.dateGridInner - 8;

    const db = window.loadAllUserEvents ? window.loadAllUserEvents() : {};
    const categories = window.USER_EVENT_CATEGORIES || {};

    Object.keys(db).forEach(dateKey => {
        if (!dateKey.startsWith(String(year))) return;
        const events = db[dateKey];
        if (!events || events.length === 0) return;

        const [y, m, dt] = dateKey.split('-').map(Number);
        const dateObj = new Date(y, m - 1, dt);
        const angle = dateToAnnualAngle(dateObj);

        const firstEv = events[0];
        const cat = categories[firstEv.category] || { color: "#d4af37" };

        // 1. 扇形光彩ハイライト
        const d = getSectorPathD(rIn, rOut, angle - 0.6, angle + 0.6);
        const wash = createSVGElem("path", {
            d: d,
            fill: cat.color,
            opacity: st.sectorWashOpacity || 0.25,
            style: "cursor: pointer;"
        });
        wash.onclick = () => window.openUserEventModal(dateKey, firstEv.id);
        wash.appendChild(createSVGElem("title", {}, `${m}月${dt}日:\n${events.map(e => `・${e.text}`).join('\n')}`));
        g.appendChild(wash);

        // 2. 光点ジュエルピン
        const pt = polarToCartesian(cx, cy, rDot, angle);
        const dot = createSVGElem("circle", {
            cx: pt.x, cy: pt.y, r: 3.5,
            fill: cat.color,
            stroke: "#ffffff",
            "stroke-width": 0.8,
            style: "cursor: pointer;"
        });
        dot.onclick = () => window.openUserEventModal(dateKey, firstEv.id);
        g.appendChild(dot);
    });

    parent.appendChild(g);
}
