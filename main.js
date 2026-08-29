/**
 * 年間歳時記・天体カレンダー メインオーケストレーター (Main Orchestrator)
 */

window.currentAnnualDate = new Date(2026, 7, 29); // 2026年 8月29日（現在）
window.annualLayerSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_ANNUAL_SETTINGS)) || window.defaultAnnualSettings;

let viewBox = { x: 0, y: 0, w: 2000, h: 2000 };
let isPanning = false;
let startPoint = { x: 0, y: 0 };

function initAnnualApp() {
    const svg = document.getElementById("annual-wheel-svg");
    if (!svg) return;

    svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);

    // ナビゲーションバー初期化
    initAnnualNavBar();

    // 初回描画
    drawAnnualWheel(window.currentAnnualDate.getFullYear());
    drawAnnualClockHands(window.currentAnnualDate);
    updateAnnualNavDisplay(window.currentAnnualDate);

    // パン＆ズーム インタラクション
    setupPanAndZoom(svg);

    // ダブルクリックによる観察記録追加
    setupWheelInteractions(svg);
}

function setupPanAndZoom(svg) {
    const container = document.getElementById("canvas-container");

    container.addEventListener("mousedown", (e) => {
        if (e.target.closest("#annual-nav-bar") || e.target.closest("#annual-design-panel") || e.target.closest("#saijiki-modal-card") || e.target.closest("#annual-drawer")) return;
        isPanning = true;
        startPoint = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mousemove", (e) => {
        if (!isPanning) return;
        const dx = (e.clientX - startPoint.x) * (viewBox.w / window.innerWidth);
        const dy = (e.clientY - startPoint.y) * (viewBox.h / window.innerHeight);
        viewBox.x -= dx;
        viewBox.y -= dy;
        svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        startPoint = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => { isPanning = false; });

    container.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
        const newW = viewBox.w * zoomFactor;
        const newH = viewBox.h * zoomFactor;

        if (newW > 3500 || newW < 300) return;

        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const svgRect = svg.getBoundingClientRect();
        const svgX = viewBox.x + (mouseX - svgRect.left) * (viewBox.w / svgRect.width);
        const svgY = viewBox.y + (mouseY - svgRect.top) * (viewBox.h / svgRect.height);

        viewBox.x = svgX - (mouseX - svgRect.left) * (newW / svgRect.width);
        viewBox.y = svgY - (mouseY - svgRect.top) * (newH / svgRect.height);
        viewBox.w = newW;
        viewBox.h = newH;

        svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    }, { passive: false });
}

function setupWheelInteractions(svg) {
    window.addEventListener("dblclick", (e) => {
        if (e.target.closest("#annual-nav-bar") || e.target.closest("#annual-design-panel") || e.target.closest("#saijiki-modal-card") || e.target.closest("#annual-drawer")) return;

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
    if (svg) svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
};

document.addEventListener("DOMContentLoaded", initAnnualApp);
