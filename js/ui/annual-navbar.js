/**
 * 年間歳時記カレンダー ナビゲーションバー ＆ コントローラー
 */

function initAnnualNavBar() {
    const nav = document.createElement('div');
    nav.id = 'annual-nav-bar';
    nav.style = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 12px;
        padding: 8px 16px;
        color: #e2e8f0;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 14px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
        font-family: 'Shippori Mincho', 'YuMincho', serif;
    `;

    nav.innerHTML = `
        <!-- 四季ジャンプボタン群 -->
        <div style="display:flex; gap:4px; border-right:1px solid rgba(255,255,255,0.15); padding-right:12px;">
            <button class="season-jump-btn" data-target="spring" style="background:rgba(92,146,114,0.2); border:1px solid #5c9272; color:#a3e635; padding:4px 8px; border-radius:5px; font-size:11px; cursor:pointer;" title="春（立春 2/4）へ移動">🌸 春</button>
            <button class="season-jump-btn" data-target="summer" style="background:rgba(184,93,86,0.2); border:1px solid #b85d56; color:#f87171; padding:4px 8px; border-radius:5px; font-size:11px; cursor:pointer;" title="夏（立夏 5/5）へ移動">🌿 夏</button>
            <button class="season-jump-btn" data-target="autumn" style="background:rgba(194,133,66,0.2); border:1px solid #c28542; color:#fb923c; padding:4px 8px; border-radius:5px; font-size:11px; cursor:pointer;" title="秋（立秋 8/7）へ移動">🍁 秋</button>
            <button class="season-jump-btn" data-target="winter" style="background:rgba(91,142,166,0.2); border:1px solid #5b8ea6; color:#38bdf8; padding:4px 8px; border-radius:5px; font-size:11px; cursor:pointer;" title="冬（立冬 11/7）へ移動">❄️ 冬</button>
        </div>

        <!-- 日付送りコントローラー -->
        <div style="display:flex; align-items:center; gap:6px;">
            <button id="btn-prev-day" style="background:transparent; border:1px solid rgba(212,175,55,0.4); color:#d4af37; width:26px; height:26px; border-radius:4px; cursor:pointer; display:flex; justify-content:center; align-items:center; font-size:11px;" title="1日戻る">◀</button>
            
            <div id="annual-date-display" style="text-align:center; min-width:230px; cursor:pointer;" title="クリックして日付を直接入力">
                <div id="nav-main-date" style="font-size:14px; font-weight:bold; color:#d4af37; letter-spacing:0.04em;">2026年 8月29日</div>
                <div id="nav-sub-info" style="font-size:10px; color:#94a3b8;">処暑 ｜ 第41候・天地始粛</div>
            </div>

            <button id="btn-next-day" style="background:transparent; border:1px solid rgba(212,175,55,0.4); color:#d4af37; width:26px; height:26px; border-radius:4px; cursor:pointer; display:flex; justify-content:center; align-items:center; font-size:11px;" title="1日進む">▶</button>
            
            <button id="btn-annual-today" style="background:rgba(212,175,55,0.15); border:1px solid #d4af37; color:#d4af37; padding:3px 8px; border-radius:4px; font-size:11px; font-weight:bold; cursor:height:26px;">今日</button>
        </div>

        <!-- アニメーション & 機能ボタン -->
        <div style="display:flex; align-items:center; gap:8px; border-left:1px solid rgba(255,255,255,0.15); padding-left:12px;">
            <button id="btn-annual-play" style="background:rgba(56,189,248,0.15); border:1px solid #38bdf8; color:#38bdf8; padding:4px 10px; border-radius:5px; font-size:11px; font-weight:500; cursor:pointer;" title="1年の時間の流れを再生">▶ 時間の旅</button>
            <button id="btn-annual-observations" style="background:rgba(212,175,55,0.12); border:1px solid rgba(212,175,55,0.4); color:#d4af37; padding:4px 10px; border-radius:5px; font-size:11px; font-weight:500; cursor:pointer;">観察記録</button>
            <button id="btn-print-export" style="background:rgba(212,175,55,0.2); border:1px solid #d4af37; color:#fde047; padding:4px 10px; border-radius:5px; font-size:11px; font-weight:bold; cursor:pointer;" title="A0/A1高機能印刷用ベクターを出力">🖨️ A0印刷</button>
            <button id="btn-annual-settings" style="background:transparent; border:1px solid #475569; color:#cbd5e1; padding:4px 8px; border-radius:5px; font-size:11px; cursor:pointer;" title="デザイン・レイヤー設定">⚙️</button>
        </div>

        <!-- 月間カレンダーへのリンク -->
        <a href="../newcalender_JAPAN_0824_V4/index.html" style="color:#64748b; text-decoration:none; font-size:10px; margin-left:4px; padding-left:8px; border-left:1px dashed rgba(255,255,255,0.2);" title="月間詳細カレンダーへ戻る">月間版 ➔</a>
    `;

    document.body.appendChild(nav);

    // イベントバインド
    document.getElementById('btn-prev-day').onclick = () => window.stepAnnualDate(-1);
    document.getElementById('btn-next-day').onclick = () => window.stepAnnualDate(1);
    document.getElementById('btn-annual-today').onclick = () => window.resetToToday();
    document.getElementById('btn-annual-observations').onclick = () => window.toggleObservationDrawer();
    document.getElementById('btn-print-export').onclick = () => window.openPrintExportModal();
    document.getElementById('btn-annual-settings').onclick = () => window.toggleDesignPanel();

    document.querySelectorAll('.season-jump-btn').forEach(btn => {
        btn.onclick = () => {
            const t = btn.dataset.target;
            const y = window.currentAnnualDate ? window.currentAnnualDate.getFullYear() : 2026;
            if (t === 'spring') window.setAnnualDate(new Date(y, 1, 4));  // 立春 2/4
            if (t === 'summer') window.setAnnualDate(new Date(y, 4, 5));  // 立夏 5/5
            if (t === 'autumn') window.setAnnualDate(new Date(y, 7, 7));  // 立秋 8/7
            if (t === 'winter') window.setAnnualDate(new Date(y, 10, 7)); // 立冬 11/7
        };
    });

    let isPlaying = false;
    let playTimer = null;
    const btnPlay = document.getElementById('btn-annual-play');

    btnPlay.onclick = () => {
        isPlaying = !isPlaying;
        btnPlay.innerText = isPlaying ? "⏸ 一時停止" : "▶ 時間の旅";
        btnPlay.style.background = isPlaying ? "rgba(245,158,11,0.25)" : "rgba(56,189,248,0.15)";
        btnPlay.style.borderColor = isPlaying ? "#f59e0b" : "#38bdf8";
        btnPlay.style.color = isPlaying ? "#f59e0b" : "#38bdf8";

        if (isPlaying) {
            playTimer = setInterval(() => {
                window.stepAnnualDate(1);
            }, 120);
        } else {
            clearInterval(playTimer);
        }
    };
}

function updateAnnualNavDisplay(date) {
    const mainText = document.getElementById('nav-main-date');
    const subText = document.getElementById('nav-sub-info');
    if (!mainText || !subText) return;

    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const dt = date.getDate();
    const weekdays = ['日','月','火','水','木','金','土'];
    mainText.innerText = `${y}年 ${m}月${dt}日 (${weekdays[date.getDay()]})`;

    // 現在の節気と候を検索
    const doy = dateToDayOfYear(date);
    const kouIdx = Math.min(71, Math.floor(((doy - 35 + 365) % 365) / (365 / 72)));
    const kou = (window.MICRO_SEASONS_72 && window.MICRO_SEASONS_72[kouIdx]) || { name: "", sekki: "" };

    subText.innerText = `${kou.sekki || '季節'} ｜ 第${kouIdx + 1}候・${kou.name || ''} (${kou.kigo || ''})`;
}

window.initAnnualNavBar = initAnnualNavBar;
window.updateAnnualNavDisplay = updateAnnualNavDisplay;
