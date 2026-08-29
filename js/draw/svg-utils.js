/**
 * SVG幾何学計算 & 要素生成ユーティリティ (Annual SVG Utils)
 */

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function createSVGElem(tag, attrs = {}, text = null) {
    const el = document.createElementNS(svgNS, tag);
    for (const k in attrs) {
        if (attrs[k] !== undefined && attrs[k] !== null && attrs[k] !== false) {
            el.setAttribute(k, attrs[k]);
        }
    }
    if (text !== null) el.textContent = text;
    return el;
}

function getStyleAttrs(st) {
    if (!st) return {};
    const attrs = {
        fill: st.fill || st.color,
        "font-size": st.fontSize ? st.fontSize + "px" : null,
        "font-family": st.fontFamily,
        opacity: st.opacity
    };
    if (st.fontWeight === "bold") attrs["font-weight"] = "bold";
    if (st.strokeWidth > 0) {
        attrs.stroke = st.stroke;
        attrs["stroke-width"] = st.strokeWidth;
        attrs["stroke-linejoin"] = "round";
        attrs["paint-order"] = "stroke fill";
    }
    return attrs;
}

function createStyledText(st, attrs = {}, text = null) {
    return createSVGElem("text", { ...getStyleAttrs(st), ...attrs }, text);
}

function getLayerStyle(layerKey) {
    return (window.annualLayerSettings && window.annualLayerSettings[layerKey]) ||
           (window.defaultAnnualSettings && window.defaultAnnualSettings[layerKey]) || {};
}

function getSectorPathD(rIn, rOut, startAngle, endAngle) {
    const startIn = polarToCartesian(cx, cy, rIn, endAngle);
    const endIn = polarToCartesian(cx, cy, rIn, startAngle);
    const startOut = polarToCartesian(cx, cy, rOut, endAngle);
    const endOut = polarToCartesian(cx, cy, rOut, startAngle);
    const delta = (endAngle - startAngle + 360) % 360;
    const largeArcFlag = delta <= 180 ? "0" : "1";
    return [
        "M", startOut.x, startOut.y,
        "A", rOut, rOut, 0, largeArcFlag, 0, endOut.x, endOut.y,
        "L", endIn.x, endIn.y,
        "A", rIn, rIn, 0, largeArcFlag, 1, startIn.x, startIn.y,
        "Z"
    ].join(" ");
}

function createTextArc(defs, id, r, angStart, angEnd) {
    const p1 = polarToCartesian(cx, cy, r, angStart);
    const p2 = polarToCartesian(cx, cy, r, angEnd);
    const delta = (angEnd - angStart + 360) % 360;
    const largeArcFlag = delta <= 180 ? "0" : "1";
    if(defs) {
        defs.appendChild(createSVGElem("path", { 
            id: id, 
            d: `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}` 
        }));
    }
}
