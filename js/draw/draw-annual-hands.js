/**
 * 年間天体時計の針 描画モジュール (Annual Sun & Moon Celestial Hands)
 */

function drawAnnualClockHands(targetDate) {
    const svg = document.getElementById("annual-wheel-svg");
    if (!svg) return;

    let handsLayer = document.getElementById("layer-annual-hands");
    if (!handsLayer) {
        handsLayer = createSVGElem("g", { id: "layer-annual-hands" });
        svg.appendChild(handsLayer);
    }
    handsLayer.innerHTML = "";

    const st = getLayerStyle('clockHands');
    if (!st || st.opacity === 0) return;

    const targetTimeMs = targetDate.getTime();

    // 1. 太陽針の角度（365日＝360度の年間位置・七十二候・二十四節気を指す）
    const doy = dateToDayOfYear(targetDate);
    const sunAngle = (doy / 365) * 360;

    // 2. 月針の角度（太陽に対する月相角を天文学計算：新月0度合 → 満月180度対峙）
    const sunLong = getSolarLongitude(targetTimeMs);
    const moonLong = getLunarLongitude(targetTimeMs);
    const lunarPhaseDeg = (moonLong - sunLong + 360) % 360;
    const moonAngle = (sunAngle + lunarPhaseDeg) % 360;

    const g = createSVGElem("g", { class: "annual-hands-group", opacity: st.opacity });

    const sunLen = st.sunHandLength || 780;
    const sunW = st.sunHandWidth || 2.5;
    const sunColor = st.sunHandColor || "#f59e0b";

    const moonLen = st.moonHandLength || 920;
    const moonW = st.moonHandWidth || 1.8;
    const moonColor = st.moonHandColor || "#38bdf8";

    // --- ☀️ 太陽の針（短針・季節の指標） ---
    const sunG = createSVGElem("g", { transform: `rotate(${sunAngle}, ${cx}, ${cy})` });
    
    // 針の本体
    sunG.appendChild(createSVGElem("line", {
        x1: cx, y1: cy + 40, x2: cx, y2: cy - sunLen,
        stroke: sunColor, "stroke-width": sunW, "stroke-linecap": "round",
        style: "filter: drop-shadow(0 2px 8px rgba(245, 158, 11, 0.4));"
    }));

    // 太陽先端マーク (☉)
    const sunMarkR = 10;
    sunG.appendChild(createSVGElem("circle", {
        cx: cx, cy: cy - sunLen, r: sunMarkR,
        fill: "rgba(245, 158, 11, 0.2)", stroke: sunColor, "stroke-width": 1.5
    }));
    sunG.appendChild(createSVGElem("circle", {
        cx: cx, cy: cy - sunLen, r: 2.5,
        fill: sunColor
    }));
    sunG.appendChild(createSVGElem("title", {}, `太陽の針: ${targetDate.getMonth() + 1}月${targetDate.getDate()}日 (通年${doy}日目)`));
    g.appendChild(sunG);

    // --- 🌙 月の針（長針・満ち欠けと恒星の指標） ---
    const moonG = createSVGElem("g", { transform: `rotate(${moonAngle}, ${cx}, ${cy})` });
    
    // 針の本体
    moonG.appendChild(createSVGElem("line", {
        x1: cx, y1: cy + 50, x2: cx, y2: cy - moonLen,
        stroke: moonColor, "stroke-width": moonW, "stroke-linecap": "round",
        style: "filter: drop-shadow(0 2px 8px rgba(56, 189, 248, 0.4));"
    }));

    // 月先端マーク (☽)
    const moonMarkR = 9;
    moonG.appendChild(createSVGElem("circle", {
        cx: cx, cy: cy - moonLen, r: moonMarkR,
        fill: "none", stroke: moonColor, "stroke-width": 1.2
    }));
    const moonArc = createSVGElem("path", {
        d: `M ${cx} ${cy - moonLen - moonMarkR * 0.8} A ${moonMarkR * 0.8} ${moonMarkR * 0.8} 0 0 0 ${cx} ${cy - moonLen + moonMarkR * 0.8} A ${moonMarkR * 0.5} ${moonMarkR * 0.8} 0 0 1 ${cx} ${cy - moonLen - moonMarkR * 0.8} Z`,
        fill: moonColor, opacity: 0.85
    });
    moonG.appendChild(moonArc);
    moonG.appendChild(createSVGElem("title", {}, `月の針: 月相角 ${Math.round(lunarPhaseDeg)}°`));
    g.appendChild(moonG);

    // --- 🌟 中心金鋲ピボット ---
    const pivotR = st.centerPivotRadius || 18;
    const pivotCol = st.centerPivotColor || "#d4af37";

    const pivotG = createSVGElem("g", { style: "cursor: pointer;" });
    pivotG.onclick = () => window.resetToToday();
    pivotG.appendChild(createSVGElem("title", {}, "クリックして今日に戻る"));

    pivotG.appendChild(createSVGElem("circle", { cx: cx, cy: cy, r: pivotR * 1.5, fill: "rgba(0,0,0,0.5)", stroke: pivotCol, "stroke-width": 0.8 }));
    pivotG.appendChild(createSVGElem("circle", { cx: cx, cy: cy, r: pivotR, fill: pivotCol, stroke: "#ffffff", "stroke-width": 1.2 }));
    pivotG.appendChild(createSVGElem("circle", { cx: cx, cy: cy, r: pivotR * 0.45, fill: "#0f172a" }));

    g.appendChild(pivotG);
    handsLayer.appendChild(g);
}

window.drawAnnualClockHands = drawAnnualClockHands;
