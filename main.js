/**
 * 年間歳時記・天体カレンダー メインオーケストレーター (Main Orchestrator)
 * Figma / Google Maps ライクな極上マウス＆トラックパッド操作対応版
 */

window.currentAnnualDate = new Date(2026, 7, 29); // 2026年 8月29日
window.annualLayerSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_ANNUAL_SETTINGS)) || window.defaultAnnualSettings;

let viewBox = { x: 0, y: 0, w: 2000, h: 2000 };
let isPanning = false;
let startPoint = { x: 0, y: 0 };
let hasDragged = false;

const MIN_VIEWBOX_W = 35;   // 最大ズーム倍率（約5700%・ミクロ虫眼鏡モード）
const MAX_VIEWBOX_W = 3600; // 最小ズーム倍率（広域全景モード）

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

    // パン＆ズーム インタラクション（極上操作感）
    setupPanAndZoom(svg);

    // ダブルクリックによる観察記録追加
    setupWheelInteractions(svg);
}

function updateViewBoxAndLOD(svg) {
    if (!svg) svg = document.getElementById("annual-wheel-svg");
    if (!svg) return;

    svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);

    // LOD判定 (Level of Detail: 遠景・中景・近景・極近景)
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

function setupPanAndZoom(svg) {
    const container = document.getElementById("canvas-container");

    // --- 1. マウスドラッグによるパン（平行移動） ---
    container.addEventListener("mousedown", (e) => {
        // UIコントロールやモーダル上のクリックは除外
        if (e.target.closest("#annual-nav-bar") || e.target.closest("#annual-design-panel") || e.target.closest("#saijiki-modal-card") || e.target.closest("#annual-drawer") || e.target.closest("#zoom-control-widget") || e.target.closest("#print-export-modal")) return;
        
        if (e.button !== 0 && e.button !== 1) return; // 左クリック or 中クリック

        isPanning = true;
        hasDragged = false;
        startPoint = { x: e.clientX, y: e.clientY };
        container.style.cursor = "grabbing";
        e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
        if (!isPanning) return;

        const deltaX = e.clientX - startPoint.x;
        const deltaY = e.clientY - startPoint.y;

        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
            hasDragged = true;
        }

        const svgRect = svg.getBoundingClientRect();
        const scaleX = viewBox.w / (svgRect.width || window.innerWidth);
        const scaleY = viewBox.h / (svgRect.height || window.innerHeight);

        viewBox.x -= deltaX * scaleX;
        viewBox.y -= deltaY * scaleY;

        updateViewBoxAndLOD(svg);
        startPoint = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", (e) => {
        if (isPanning) {
            isPanning = false;
            container.style.cursor = "grab";
        }
    });

    // --- 2. マウスホイール ＆ トラックパッド操作 ---
    container.addEventListener("wheel", (e) => {
        e.preventDefault();

        // Macトラックパッドの2本指スクロール（パン移動）
        if (!e.ctrlKey && !e.metaKey && (Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) < 40)) {
            // トラックパッドによるスクロールパン移動
            const svgRect = svg.getBoundingClientRect();
            const scaleX = viewBox.w / (svgRect.width || window.innerWidth);
            const scaleY = viewBox.h / (svgRect.height || window.innerHeight);

            viewBox.x += e.deltaX * scaleX * 0.8;
            viewBox.y += e.deltaY * scaleY * 0.8;
            updateViewBoxAndLOD(svg);
            return;
        }

        // マウスホイールまたはピンチズームによる拡大縮小
        let zoomFactor;
        if (e.ctrlKey || e.metaKey) {
            // ピンチズーム
            zoomFactor = Math.exp(e.deltaY * 0.01);
        } else {
            // 通常のマウスホイール（しっかり気持ちよくズーム）
            zoomFactor = e.deltaY > 0 ? 1.25 : 0.8;
        }

        applyZoom(zoomFactor, e.clientX, e.clientY);
    }, { passive: false });

    // --- 3. タッチデバイス用 ピンチ＆パン ---
    let initialTouchDist = null;
    let initialTouchCenter = null;

    container.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            isPanning = true;
            hasDragged = false;
            startPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
            isPanning = false;
            initialTouchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            initialTouchCenter = {
                x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                y: (e.touches[0].clientY + e.touches[1].clientY) / 2
            };
        }
    }, { passive: true });

    container.addEventListener("touchmove", (e) => {
        if (e.touches.length === 1 && isPanning) {
            const deltaX = e.touches[0].clientX - startPoint.x;
            const deltaY = e.touches[0].clientY - startPoint.y;
            const svgRect = svg.getBoundingClientRect();
            const scaleX = viewBox.w / (svgRect.width || window.innerWidth);
            const scaleY = viewBox.h / (svgRect.height || window.innerHeight);

            viewBox.x -= deltaX * scaleX;
            viewBox.y -= deltaY * scaleY;
            updateViewBoxAndLOD(svg);
            startPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2 && initialTouchDist) {
            const currentDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const factor = initialTouchDist / currentDist;
            const center = {
                x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                y: (e.touches[0].clientY + e.touches[1].clientY) / 2
            };
            applyZoom(factor, center.x, center.y);
            initialTouchDist = currentDist;
        }
    }, { passive: true });

    container.addEventListener("touchend", () => {
        isPanning = false;
        initialTouchDist = null;
    }, { passive: true });
}

function applyZoom(zoomFactor, mouseX, mouseY) {
    const svg = document.getElementById("annual-wheel-svg");
    if (!svg) return;

    let newW = viewBox.w * zoomFactor;
    let newH = viewBox.h * zoomFactor;

    if (newW < MIN_VIEWBOX_W) {
        newW = MIN_VIEWBOX_W;
        newH = MIN_VIEWBOX_W;
    }
    if (newW > MAX_VIEWBOX_W) {
        newW = MAX_VIEWBOX_W;
        newH = MAX_VIEWBOX_W;
    }

    const svgRect = svg.getBoundingClientRect();
    const clientX = (mouseX !== undefined && mouseX !== null) ? mouseX : (svgRect.left + svgRect.width / 2);
    const clientY = (mouseY !== undefined && mouseY !== null) ? mouseY : (svgRect.top + svgRect.height / 2);

    // マウス位置のSVG内相対座標を計算
    const svgX = viewBox.x + ((clientX - svgRect.left) / svgRect.width) * viewBox.w;
    const svgY = viewBox.y + ((clientY - svgRect.top) / svgRect.height) * viewBox.h;

    viewBox.x = svgX - ((clientX - svgRect.left) / svgRect.width) * newW;
    viewBox.y = svgY - ((clientY - svgRect.top) / svgRect.height) * newH;
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
        <button id="btn-zoom-in" style="background:none; border:1px solid rgba(212,175,55,0.4); color:#d4af37; width:28px; height:28px; border-radius:4px; cursor:pointer; font-size:15px; font-weight:bold;" title="ズームイン（拡大）">＋</button>
        <span id="zoom-level-text" style="font-size:12px; font-weight:bold; color:#d4af37; min-width:52px; text-align:center;">100%</span>
        <button id="btn-zoom-out" style="background:none; border:1px solid rgba(212,175,55,0.4); color:#d4af37; width:28px; height:28px; border-radius:4px; cursor:pointer; font-size:15px; font-weight:bold;" title="ズームアウト（縮小）">－</button>
        <button id="btn-zoom-reset" style="background:rgba(212,175,55,0.15); border:1px solid #d4af37; color:#d4af37; padding:2px 10px; height:28px; border-radius:4px; cursor:pointer; font-size:11px;" title="全体表示に戻る">全体</button>
    `;

    document.body.appendChild(widget);

    document.getElementById("btn-zoom-in").onclick = () => applyZoom(0.7);
    document.getElementById("btn-zoom-out").onclick = () => applyZoom(1.42);
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
