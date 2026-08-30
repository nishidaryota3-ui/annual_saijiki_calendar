/**
 * 年間歳時記・天体カレンダー メインオーケストレーター (Main Orchestrator)
 * A0超高精細ディープズーム ＆ LOD（Level of Detail）対応版
 */

window.currentAnnualDate = new Date(2026, 7, 29); // 2026年 8月29日（現在）
window.annualLayerSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_ANNUAL_SETTINGS)) || window.defaultAnnualSettings;

let viewBox = { x: 0, y: 0, w: 2000, h: 2000 };
let isPanning = false;
let startPoint = { x: 0, y: 0 };

const MIN_VIEWBOX_W = 40;   // 最大ズーム倍率（約5000%・ミクロ歳時記・虫眼鏡モード）
const MAX_VIEWBOX_W = 3200; // 最小ズーム倍率（引いた全景・遠景モード）

function initAnnualApp() {
    const svg = document.getElementById("annual-wheel-svg");
    if (!svg) return;

    updateViewBoxAndLOD(svg);

    // ナビゲーションバー初期化
    initAnnualNavBar();

    // ズームインジケーター ＆ コントローラー初期化
    initZoomControls();

    // 初回描画
    drawAnnualWheel(window.currentAnnualDate.getFullYear());
    drawAnnualClockHands(window.currentAnnualDate);
    updateAnnualNavDisplay(window.currentAnnualDate);

    // パン＆ズーム インタラクション
    setupPanAndZoom(svg);

    // ダブルクリックによる観察記録追加
    setupWheelInteractions(svg);
}

function updateViewBoxAndLOD(svg) {
    if (!svg) svg = document.getElementById("annual-wheel-svg");
    if (!svg) return;

    svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);

    // LOD判定 (Level of Detail: 遠景・中景・近景・極近景)
    // w: 2000 => 100%, w: 500 => 400%, w: 150 => 1333%, w: 50 => 4000%
    const zoomRatio = Math.round((2000 / viewBox.w) * 100);
    
    let lodClass = "lod-macro"; // 遠景 (100%〜250%)
    if (viewBox.w <= 900 && viewBox.w > 350) {
        lodClass = "lod-mid";   // 中景 (250%〜600%)
    } else if (viewBox.w <= 350 && viewBox.w > 120) {
        lodClass = "lod-micro"; // 近景 (600%〜1600%)
    } else if (viewBox.w <= 120) {
        lodClass = "lod-deep";  // 極近景・ディープズーム (1600%〜5000%)
    }

    svg.setAttribute("data-lod", lodClass);

    // ズームインジケーター更新
    const zoomText = document.getElementById("zoom-level-text");
    if (zoomText) {
        zoomText.innerText = `${zoomRatio}%`;
    }
}

function setupPanAndZoom(svg) {
    const container = document.getElementById("canvas-container");

    container.addEventListener("mousedown", (e) => {
        if (e.target.closest("#annual-nav-bar") || e.target.closest("#annual-design-panel") || e.target.closest("#saijiki-modal-card") || e.target.closest("#annual-drawer") || e.target.closest("#zoom-control-widget") || e.target.closest("#print-export-modal")) return;
        isPanning = true;
        startPoint = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mousemove", (e) => {
        if (!isPanning) return;
        const dx = (e.clientX - startPoint.x) * (viewBox.w / window.innerWidth);
        const dy = (e.clientY - startPoint.y) * (viewBox.h / window.innerHeight);
        viewBox.x -= dx;
        viewBox.y -= dy;
        updateViewBoxAndLOD(svg);
        startPoint = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => { isPanning = false; });

    // スムーズホイールズーム
    container.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
        applyZoom(zoomFactor, e.clientX, e.clientY);
    }, { passive: false });

    // ピンチズーム対応（タッチデバイス・トラックパッド）
    let initialDist = null;
    container.addEventListener("touchstart", (e) => {
        if (e.touches.length === 2) {
            initialDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    }, { passive: true });

    container.addEventListener("touchmove", (e) => {
        if (e.touches.length === 2 && initialDist) {
            const currentDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const factor = initialDist / currentDist;
            const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            applyZoom(factor, midX, midY);
            initialDist = currentDist;
        }
    }, { passive: true });

    container.addEventListener("touchend", () => { initialDist = null; }, { passive: true });
}

function applyZoom(zoomFactor, mouseX, mouseY) {
    const svg = document.getElementById("annual-wheel-svg");
    if (!svg) return;

    const newW = viewBox.w * zoomFactor;
    const newH = viewBox.h * zoomFactor;

    if (newW > MAX_VIEWBOX_W || newW < MIN_VIEWBOX_W) return;

    const svgRect = svg.getBoundingClientRect();
    const clientX = mouseX !== undefined ? mouseX : window.innerWidth / 2;
    const clientY = mouseY !== undefined ? mouseY : window.innerHeight / 2;

    const svgX = viewBox.x + (clientX - svgRect.left) * (viewBox.w / svgRect.width);
    const svgY = viewBox.y + (clientY - svgRect.top) * (viewBox.h / svgRect.height);

    viewBox.x = svgX - (clientX - svgRect.left) * (newW / svgRect.width);
    viewBox.y = svgY - (clientY - svgRect.top) * (newH / svgRect.height);
    viewBox.w = newW;
    viewBox.h = newH;

    updateViewBoxAndLOD(svg);
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
        <button id="btn-zoom-in" style="background:none; border:1px solid rgba(212,175,55,0.4); color:#d4af37; width:26px; height:26px; border-radius:4px; cursor:pointer; font-size:14px; font-weight:bold;" title="ズームイン（拡大）">＋</button>
        <span id="zoom-level-text" style="font-size:12px; font-weight:bold; color:#d4af37; min-width:48px; text-align:center;">100%</span>
        <button id="btn-zoom-out" style="background:none; border:1px solid rgba(212,175,55,0.4); color:#d4af37; width:26px; height:26px; border-radius:4px; cursor:pointer; font-size:14px; font-weight:bold;" title="ズームアウト（縮小）">－</button>
        <button id="btn-zoom-reset" style="background:rgba(212,175,55,0.15); border:1px solid #d4af37; color:#d4af37; padding:2px 8px; height:26px; border-radius:4px; cursor:pointer; font-size:11px;" title="全体表示に戻る">全体</button>
    `;

    document.body.appendChild(widget);

    document.getElementById("btn-zoom-in").onclick = () => applyZoom(0.75);
    document.getElementById("btn-zoom-out").onclick = () => applyZoom(1.33);
    document.getElementById("btn-zoom-reset").onclick = () => window.resetAnnualView();
}

function setupWheelInteractions(svg) {
    window.addEventListener("dblclick", (e) => {
        if (e.target.closest("#annual-nav-bar") || e.target.closest("#annual-design-panel") || e.target.closest("#saijiki-modal-card") || e.target.closest("#annual-drawer") || e.target.closest("#zoom-control-widget") || e.target.closest("#print-export-modal")) return;

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

        // 角度から年間通算日を計算
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
    const svg = document.getElementById("annual-wheel-svg");
    updateViewBoxAndLOD(svg);
};

document.addEventListener("DOMContentLoaded", initAnnualApp);
