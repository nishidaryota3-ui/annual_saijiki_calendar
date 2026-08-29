/**
 * 年間歳時記カレンダー レイヤー ＆ デザイン管理パネル
 */

(function() {
    const panel = document.createElement('div');
    panel.id = 'annual-design-panel';
    panel.style = `
        display: none;
        position: fixed;
        top: 80px;
        right: 20px;
        width: 320px;
        max-height: 80vh;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 12px;
        padding: 16px;
        color: #e2e8f0;
        z-index: 2000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.7);
        font-family: 'Shippori Mincho', 'YuMincho', serif;
        overflow-y: auto;
    `;

    panel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px;">
            <div style="font-size:14px; font-weight:bold; color:#d4af37;">レイヤー表示・設定</div>
            <button id="adp-close-btn" style="background:none; border:none; color:#94a3b8; font-size:16px; cursor:pointer;">✕</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px; font-size:12px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="at-seasons" checked> 四季バンド (春・夏・秋・冬)
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="at-sekki24" checked> 二十四節気バンド (24等分)
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="at-kou72" checked> 七十二候バンド (72等分)
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="at-date-grid" checked> 365日目盛り ＆ 12ヶ月
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="at-saijiki" checked> 歳時記・代表季語
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="at-mansions" checked> 二十七宿 (天球)
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="at-zodiac" checked> 黄道十二星座 (外周)
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="at-hands" checked> 天体時計の針 (太陽・月)
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="at-user-events" checked> 私的観察記録・日記
            </label>
        </div>

        <div style="margin-top:16px; border-top:1px dashed rgba(255,255,255,0.15); padding-top:10px; text-align:center;">
            <button id="at-reset-zoom-btn" style="width:100%; background:rgba(212,175,55,0.15); border:1px solid #d4af37; color:#d4af37; padding:6px 0; border-radius:6px; font-size:11px; cursor:pointer;">🔍 拡大・位置を初期化</button>
        </div>
    `;

    document.body.appendChild(panel);

    document.getElementById('adp-close-btn').onclick = () => panel.style.display = 'none';

    window.toggleDesignPanel = function() {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };

    const layerMap = {
        'at-seasons': '#layer-seasons',
        'at-sekki24': '#layer-sekki24',
        'at-kou72': '#layer-kou72',
        'at-date-grid': '#layer-date-grid',
        'at-saijiki': '#layer-saijiki',
        'at-mansions': '#layer-mansions27',
        'at-zodiac': '#layer-zodiac12',
        'at-hands': '#layer-annual-hands',
        'at-user-events': '#layer-annual-user-events'
    };

    Object.keys(layerMap).forEach(chkId => {
        const chk = document.getElementById(chkId);
        if (chk) {
            chk.onchange = () => {
                const el = document.querySelector(layerMap[chkId]);
                if (el) el.style.display = chk.checked ? 'block' : 'none';
            };
        }
    });

    document.getElementById('at-reset-zoom-btn').onclick = () => {
        if (typeof window.resetAnnualView === 'function') window.resetAnnualView();
    };
})();
