/**
 * 年間歳時記・天体カレンダー メインオーケストレーター (Main Orchestrator)
 * V4カレンダーで実績のあるSVG座標変換マトリクス方式による完全パン＆ズーム
 */

window.currentAnnualDate = new Date(2026, 7, 29); // 2026年 8月29日
window.annualLayerSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_ANNUAL_SETTINGS)) || window.defaultAnnualSettings;

let viewBox = { x: 0, y: 0, w: 2000, h: 2000 };
window.viewBox = viewBox;
window.hasDragged = false;

let isInteractionActive = false;
let startPos = { x: 0, y: 0 };
let dragDistance = 0;

const MIN_VIEWBOX_W = 35;   // 最大ズーム（約5700%・虫眼鏡モード）
const MAX_VIEWBOX_W = 3600; // 最小ズーム（広域全景モード）

function updateLOD(svg) {
    if (!svg) svg = document.getElementById("annual-wheel-svg");
    if (!svg) return;

    const zoomRatio = Math.round((2000 / viewBox.w) * 100);
    let lodClass = "lod-macro";
    if (viewBox.w <= 900 && viewBox.w > 350) {
        lodClass = "lod-mid";
    } else if (viewBox.w <= 350 && viewBox.w > 120) {
        lodClass = "lod-micro";
    } else if (viewBox.w <= 120) {
        lodClass = "lod-deep";
    }

    svg.setAttribute("data-lod", lodClass);

    const zoomText = document.getElementById("zoom-level-text");
    if (zoomText) {
        zoomText.innerText = `${zoomRatio}%`;
    }
}

function initAnnualApp() {
    const svg = document.getElementById("annual-wheel-svg");
    if (!svg) return;
    window.svg = svg;

    svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    updateLOD(svg);

    // ナビゲーションバー初期化
    initAnnualNavBar();

    // ズームインジケーター ＆ コントローラー初期化
    initZoomControls();

    // 初回描画
    drawAnnualWheel(window.currentAnnualDate.getFullYear());
    drawAnnualClockHands(window.currentAnnualDate);
    updateAnnualNavDisplay(window.currentAnnualDate);

    // V4実績ベースのパン＆ズーム初期化
    initInteractions();

    // UIパネルへのイベントバブリング防止
    setupUIEventBlockers();
}

function initInteractions() {
    const appContainer = document.getElementById("canvas-container") || document.body;
    const svg = document.getElementById("annual-wheel-svg");

    // --- 1. ホイールズーム (V4と全く同一のSVGマトリクス計算) ---
    appContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (!svg) return;

        // ホイールの回転方向に応じて拡大・縮小
        const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
        const newW = viewBox.w * zoomFactor;
        const newH = viewBox.h * zoomFactor;

        if (newW < MIN_VIEWBOX_W || newW > MAX_VIEWBOX_W) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

        viewBox.w = newW;
        viewBox.h = newH;
        viewBox.x = svgP.x - (svgP.x - viewBox.x) * zoomFactor;
        viewBox.y = svgP.y - (svgP.y - viewBox.y) * zoomFactor;

        svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        updateLOD(svg);
    }, { passive: false });

    // --- 2. マウスドラッグによるパン (V4と全く同一の実装) ---
    appContainer.addEventListener('mousedown', (e) => {
        if (e.target.closest('#annual-nav-bar, #annual-design-panel, #saijiki-modal-card, #annual-drawer, #zoom-control-widget, #print-export-modal, #annual-user-event-overlay')) return;
        
        dragDistance = 0;
        isInteractionActive = true;
        window.hasDragged = false;
        startPos = { x: e.clientX, y: e.clientY };
        appContainer.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isInteractionActive) return;

        const dxScreen = startPos.x - e.clientX;
        const dyScreen = startPos.y - e.clientY;
        dragDistance += Math.abs(dxScreen) + Math.abs(dyScreen);

        if (dragDistance > 4) {
            window.hasDragged = true;
        }

        if (svg && appContainer) {
            const cw = appContainer.clientWidth || window.innerWidth;
            const ch = appContainer.clientHeight || window.innerHeight;
            viewBox.x += dxScreen * (viewBox.w / cw);
            viewBox.y += dyScreen * (viewBox.h / ch);
            svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        }
        startPos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
        isInteractionActive = false;
        appContainer.style.cursor = 'grab';
        setTimeout(() => { window.hasDragged = false; }, 80);
    });

    // --- 3. ダブルクリックによる観察記録追加 ---
    window.addEventListener('dblclick', (e) => {
        if (e.target.closest('#annual-nav-bar, #annual-design-panel, #saijiki-modal-card, #annual-drawer, #zoom-control-widget, #print-export-modal, #annual-user-event-overlay')) return;

        if (!svg) return;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const ptM = pt.matrixTransform(svg.getScreenCTM().inverse());
        const dx = ptM.x - cx, dy = ptM.y - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 円盤領域内のダブルクリック判定
        if (distance < 50 || distance > 1050) return;

        let angle = Math.atan2(dy, dx) * RAD_TO_DEG;
        angle = (angle + 90 + 360) % 360;

        const dayOfYear = Math.floor((angle / 360) * 365);
        const year = window.currentAnnualDate ? window.currentAnnualDate.getFullYear() : 2026;
        const targetDate = new Date(year, 0, dayOfYear + 1);

        const y = targetDate.getFullYear();
        const m = String(targetDate.getMonth() + 1).padStart(2, '0');
        const dt = String(targetDate.getDate()).padStart(2, '0');

        if (typeof window.openUserEventModal === 'function') {
            window.openUserEventModal(`${y}-${m}-${dt}`);
        }
    });
}

function setupUIEventBlockers() {
    function block(e) { e.stopPropagation(); }
    const panels = ['#annual-nav-bar', '#annual-design-panel', '#annual-drawer', '#zoom-control-widget'];
    panels.forEach(selector => {
        const elem = document.querySelector(selector);
        if (elem) {
            elem.addEventListener('wheel', block);
            elem.addEventListener('mousedown', block);
        }
    });
}

function applyZoomDirect(zoomFactor) {
    const svg = document.getElementById("annual-wheel-svg");
    if (!svg) return;

    const newW = viewBox.w * zoomFactor;
    const newH = viewBox.h * zoomFactor;
    if (newW < MIN_VIEWBOX_W || newW > MAX_VIEWBOX_W) return;

    const centerX = viewBox.x + viewBox.w / 2;
    const centerY = viewBox.y + viewBox.h / 2;

    viewBox.w = newW;
    viewBox.h = newH;
    viewBox.x = centerX - newW / 2;
    viewBox.y = centerY - newH / 2;

    svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    updateLOD(svg);
}

function initZoomControls() {
    let widget = document.getElementById("zoom-control-widget");
    if (widget) return;

    widget = document.createElement("div");
    widget.id = "zoom-control-widget";
    widget.style = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(212, 175, 55, 0.35);
        border-radius: 10px;
        padding: 6px 10px;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 1000;
        box-shadow: 0 10px 25px rgba(0,0,0,0.6);
        font-family: 'Cinzel', 'Shippori Mincho', serif;
        color: #e2e8f0;
    `;

    widget.innerHTML = `
        <button id="btn-zoom-in" style="background:none; border:1px solid rgba(212,175,55,0.4); color:#d4af37; width:28px; height:28px; border-radius:4px; cursor:pointer; font-size:15px; font-weight:bold;" title="ズームイン（拡大）">＋</button>
        <span id="zoom-level-text" style="font-size:12px; font-weight:bold; color:#d4af37; min-width:52px; text-align:center;">100%</span>
        <button id="btn-zoom-out" style="background:none; border:1px solid rgba(212,175,55,0.4); color:#d4af37; width:28px; height:28px; border-radius:4px; cursor:pointer; font-size:15px; font-weight:bold;" title="ズームアウト（縮小）">－</button>
        <button id="btn-zoom-reset" style="background:rgba(212,175,55,0.15); border:1px solid #d4af37; color:#d4af37; padding:2px 10px; height:28px; border-radius:4px; cursor:pointer; font-size:11px;" title="全体表示に戻る">全体</button>
    `;

    document.body.appendChild(widget);

    document.getElementById("btn-zoom-in").onclick = () => applyZoomDirect(0.75);
    document.getElementById("btn-zoom-out").onclick = () => applyZoomDirect(1.33);
    document.getElementById("btn-zoom-reset").onclick = () => window.resetAnnualView();
}

window.stepAnnualDate = function(days) {
    const current = window.currentAnnualDate.getTime();
    window.currentAnnualDate = new Date(current + days * MS_PER_DAY);
    drawAnnualClockHands(window.currentAnnualDate);
    updateAnnualNavDisplay(window.currentAnnualDate);
};

window.setAnnualDate = function(newDate) {
    window.currentAnnualDate = new Date(newDate);
    drawAnnualClockHands(window.currentAnnualDate);
    updateAnnualNavDisplay(window.currentAnnualDate);
};

window.resetToToday = function() {
    window.currentAnnualDate = new Date();
    drawAnnualClockHands(window.currentAnnualDate);
    updateAnnualNavDisplay(window.currentAnnualDate);
};

window.resetAnnualView = function() {
    viewBox = { x: 0, y: 0, w: 2000, h: 2000 };
    window.viewBox = viewBox;
    const svg = document.getElementById("annual-wheel-svg");
    if (svg) svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    updateLOD(svg);
};

document.addEventListener("DOMContentLoaded", initAnnualApp);
