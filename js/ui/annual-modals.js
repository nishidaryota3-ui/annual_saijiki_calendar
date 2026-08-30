/**
 * 歳時記・七十二候・観察記録モーダル ＆ タイムラインドロワー
 * 21,372語 完全歳時記データベース連携対応
 */

(function() {
    // --- 1. 歳時記・七十二候 詳細モーダル ---
    const saijikiOverlay = document.createElement('div');
    saijikiOverlay.id = 'saijiki-modal-overlay';
    saijikiOverlay.style = `
        display: none;
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 2500;
        justify-content: center;
        align-items: center;
        font-family: 'Shippori Mincho', 'YuMincho', serif;
    `;

    saijikiOverlay.innerHTML = `
        <div id="saijiki-modal-card" style="
            background: #0f172a;
            border: 1px solid rgba(212, 175, 55, 0.4);
            border-radius: 16px;
            width: 480px;
            max-width: 90vw;
            max-height: 88vh;
            overflow-y: auto;
            padding: 24px;
            color: #f1f5f9;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8);
            position: relative;
        ">
            <button id="saijiki-modal-close" style="position:absolute; top:16px; right:16px; background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer;">✕</button>
            <div id="sm-season-badge" style="font-size:11px; display:inline-block; padding:2px 8px; border-radius:4px; margin-bottom:8px; background:rgba(212,175,55,0.2); color:#d4af37;">春・第1候</div>
            <div id="sm-title" style="font-size:24px; font-weight:bold; color:#f8fafc; margin-bottom:2px; letter-spacing:0.06em;">東風解凍</div>
            <div id="sm-reading" style="font-size:12px; color:#94a3b8; margin-bottom:14px;">はるかぜこおりをとく</div>

            <div style="background:rgba(255,255,255,0.04); border-radius:8px; padding:12px; margin-bottom:14px; line-height:1.6; font-size:13px; color:#cbd5e1;" id="sm-desc">
                春風が吹き、冬の間に張り詰めていた氷を解かし始める頃。
            </div>

            <div style="margin-bottom:14px;">
                <div style="font-size:11px; color:#d4af37; margin-bottom:4px; font-weight:bold;">🌿 代表季語・風物詩</div>
                <div id="sm-kigo" style="font-size:13px; color:#e2e8f0;">東風、解氷、薄氷</div>
            </div>

            <!-- 21,372語DBから抽出される関連季語リスト -->
            <div style="margin-bottom:14px;">
                <div style="font-size:11px; color:#d4af37; margin-bottom:6px; font-weight:bold;">📚 この時期の歳時記（季語データベース）</div>
                <div id="sm-db-kigo-list" style="display:flex; flex-wrap:wrap; gap:5px; max-height:120px; overflow-y:auto; padding:6px; background:rgba(0,0,0,0.25); border-radius:6px; border:1px solid #334155;">
                </div>
            </div>

            <div style="background:rgba(212,175,55,0.08); border-left:3px solid #d4af37; padding:10px 14px; border-radius:4px; margin-bottom:18px;">
                <div style="font-size:10px; color:#d4af37; margin-bottom:4px;">📜 代表俳句</div>
                <div id="sm-haiku" style="font-size:13.5px; color:#f8fafc; line-height:1.5;">東風吹かば にほひおこせよ 梅の花（菅原道真）</div>
            </div>

            <div style="display:flex; gap:8px;">
                <button id="sm-add-diary-btn" style="flex:1; background:#d4af37; color:#0f172a; border:none; padding:8px 0; border-radius:6px; font-weight:bold; font-size:12px; cursor:pointer;">この季節に観察記録をつける</button>
            </div>
        </div>
    `;
    document.body.appendChild(saijikiOverlay);

    document.getElementById('saijiki-modal-close').onclick = () => saijikiOverlay.style.display = 'none';
    saijikiOverlay.onclick = (e) => { if (e.target === saijikiOverlay) saijikiOverlay.style.display = 'none'; };

    window.openKouDetailModal = function(kou) {
        if (!kou) return;
        document.getElementById('sm-season-badge').innerText = `${kou.season} ｜ ${kou.sekki}・第${kou.id}候`;
        document.getElementById('sm-title').innerText = kou.name;
        document.getElementById('sm-reading').innerText = kou.reading;
        document.getElementById('sm-desc').innerText = kou.desc;
        document.getElementById('sm-kigo').innerText = kou.kigo || '季節の草木・風';
        document.getElementById('sm-haiku').innerText = kou.haiku || '（季の句）';

        // 21,372語DBからの季語抽出
        const dbList = document.getElementById('sm-db-kigo-list');
        dbList.innerHTML = '';
        if (window.getKigoByDetailSeason) {
            // 例: 春の初春・仲春・晩春をマッピング
            let ds = '三春';
            if (kou.id <= 6) ds = '初春';
            else if (kou.id <= 12) ds = '仲春';
            else if (kou.id <= 18) ds = '晩春';
            else if (kou.id <= 24) ds = '初夏';
            else if (kou.id <= 30) ds = '仲夏';
            else if (kou.id <= 36) ds = '晩夏';
            else if (kou.id <= 42) ds = '初秋';
            else if (kou.id <= 48) ds = '仲秋';
            else if (kou.id <= 54) ds = '晩秋';
            else if (kou.id <= 60) ds = '初冬';
            else if (kou.id <= 66) ds = '仲冬';
            else ds = '晩冬';

            const kigoItems = window.getKigoByDetailSeason(ds, null, 24);
            if (kigoItems.length > 0) {
                dbList.innerHTML = kigoItems.map(item => {
                    return `<span style="background:rgba(212,175,55,0.15); border:1px solid rgba(212,175,55,0.3); color:#fef08a; padding:2px 6px; border-radius:4px; font-size:11px; cursor:help;" title="${item.reading} ｜ ${item.category} ｜ ${item.desc || ''}">${item.parent}</span>`;
                }).join('');
            } else {
                dbList.innerHTML = `<span style="color:#64748b; font-size:11px;">季語データを読み込み中...</span>`;
            }
        }

        document.getElementById('sm-add-diary-btn').onclick = () => {
            saijikiOverlay.style.display = 'none';
            const date = window.currentAnnualDate || new Date();
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const dt = String(date.getDate()).padStart(2, '0');
            window.openUserEventModal(`${y}-${m}-${dt}`);
        };

        saijikiOverlay.style.display = 'flex';
    };

    window.openSaijikiDetailModal = function(term) {
        if (!term) return;
        document.getElementById('sm-season-badge').innerText = `${term.season} ｜ 二十四節気`;
        document.getElementById('sm-title').innerText = term.name;
        document.getElementById('sm-reading').innerText = `${term.reading} （太陽黄経 ${term.solarLong}°）`;
        document.getElementById('sm-desc').innerText = term.desc;
        document.getElementById('sm-kigo').innerText = `目安時期: ${term.approxDate} 頃`;
        document.getElementById('sm-haiku').innerText = `【${term.name}】の風物詩と自然の移ろい`;

        const dbList = document.getElementById('sm-db-kigo-list');
        dbList.innerHTML = '';
        if (window.searchSaijiki) {
            const results = window.searchSaijiki(term.name, 15);
            if (results.length > 0) {
                dbList.innerHTML = results.map(item => {
                    return `<span style="background:rgba(212,175,55,0.15); border:1px solid rgba(212,175,55,0.3); color:#fef08a; padding:2px 6px; border-radius:4px; font-size:11px; cursor:help;" title="${item.reading} ｜ ${item.desc || ''}">${item.parent}</span>`;
                }).join('');
            }
        }

        saijikiOverlay.style.display = 'flex';
    };

    // --- 2. 観察記録入力モーダル ---
    const userEventOverlay = document.createElement('div');
    userEventOverlay.id = 'annual-user-event-overlay';
    userEventOverlay.style = `
        display: none;
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 2600;
        justify-content: center;
        align-items: center;
        font-family: 'Shippori Mincho', 'YuMincho', serif;
    `;

    const categories = window.USER_EVENT_CATEGORIES || {
        flora:   { name: "植物", color: "#5c9272", labelColor: "#86efac", icon: "🌿" },
        fauna:   { name: "生物", color: "#c28542", labelColor: "#fde047", icon: "🐦" },
        weather: { name: "気象", color: "#5b8ea6", labelColor: "#7dd3fc", icon: "☁️" },
        event:   { name: "催事", color: "#b85d56", labelColor: "#fca5a5", icon: "🏮" },
        mind:    { name: "心想", color: "#7d6b91", labelColor: "#d8b4fe", icon: "✍️" },
        note:    { name: "雑記", color: "#8b8170", labelColor: "#cbd5e1", icon: "📜" }
    };

    userEventOverlay.innerHTML = `
        <div style="background:#0f172a; border:1px solid rgba(212,175,55,0.4); border-radius:14px; width:400px; max-width:90vw; padding:22px; color:#f1f5f9; box-shadow:0 20px 50px rgba(0,0,0,0.8); position:relative;">
            <button id="aue-close-btn" style="position:absolute; top:14px; right:14px; background:none; border:none; color:#94a3b8; font-size:16px; cursor:pointer;">✕</button>
            <div id="aue-date-title" style="font-size:16px; font-weight:bold; color:#d4af37; margin-bottom:12px;">8月29日の観察記録</div>
            
            <div style="margin-bottom:12px;">
                <label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:4px;">カテゴリー</label>
                <div id="aue-cat-selector" style="display:flex; gap:5px; flex-wrap:wrap;">
                    ${Object.keys(categories).map(k => {
                        const c = categories[k];
                        return `<button type="button" class="aue-cat-btn" data-category="${k}" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#cbd5e1; border-radius:4px; padding:4px 8px; font-size:11px; cursor:pointer; display:flex; align-items:center; gap:3px;"><span>${c.icon}</span> ${c.name}</button>`;
                    }).join('')}
                </div>
            </div>

            <div style="margin-bottom:14px;">
                <label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:4px;">記録内容・言葉</label>
                <textarea id="aue-text-input" rows="3" placeholder="ツクツクボウシ初鳴き、萩のつぼみ、夕立..." style="width:100%; box-sizing:border-box; background:rgba(0,0,0,0.3); border:1px solid #334155; border-radius:6px; padding:8px; color:#fff; font-size:13px; resize:vertical; outline:none; font-family:inherit;"></textarea>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <button id="aue-delete-btn" style="display:none; background:rgba(239,68,68,0.15); border:1px solid #ef4444; color:#ef4444; padding:6px 12px; border-radius:4px; font-size:11px; cursor:pointer;">削除</button>
                <div style="flex:1;"></div>
                <button id="aue-save-btn" style="background:#d4af37; border:none; color:#0f172a; padding:6px 16px; border-radius:4px; font-size:12px; font-weight:bold; cursor:pointer;">保存する</button>
            </div>
        </div>
    `;
    document.body.appendChild(userEventOverlay);

    let activeDateStr = null;
    let editingEventId = null;
    let selectedCat = 'flora';

    document.getElementById('aue-close-btn').onclick = () => userEventOverlay.style.display = 'none';
    userEventOverlay.onclick = (e) => { if (e.target === userEventOverlay) userEventOverlay.style.display = 'none'; };

    const catBtns = userEventOverlay.querySelectorAll('.aue-cat-btn');
    catBtns.forEach(btn => {
        btn.onclick = () => {
            selectedCat = btn.dataset.category;
            updateCatBtns();
        };
    });

    function updateCatBtns() {
        catBtns.forEach(btn => {
            const k = btn.dataset.category;
            const c = categories[k];
            if (k === selectedCat) {
                btn.style.background = c.color;
                btn.style.borderColor = c.color;
                btn.style.color = '#ffffff';
                btn.style.fontWeight = 'bold';
            } else {
                btn.style.background = 'rgba(255,255,255,0.06)';
                btn.style.borderColor = 'rgba(255,255,255,0.15)';
                btn.style.color = '#cbd5e1';
                btn.style.fontWeight = 'normal';
            }
        });
    }

    window.openUserEventModal = function(dateStr, eventId = null) {
        activeDateStr = dateStr;
        editingEventId = eventId;
        const [y, m, dt] = dateStr.split('-').map(Number);
        document.getElementById('aue-date-title').innerText = `${y}年 ${m}月${dt}日の観察記録`;

        const txtInput = document.getElementById('aue-text-input');
        const delBtn = document.getElementById('aue-delete-btn');

        if (eventId && window.getUserEventsForDate) {
            const list = window.getUserEventsForDate(dateStr);
            const target = list.find(e => e.id === eventId);
            if (target) {
                txtInput.value = target.text;
                selectedCat = target.category || 'flora';
                delBtn.style.display = 'block';
            }
        } else {
            txtInput.value = '';
            selectedCat = 'flora';
            delBtn.style.display = 'none';
        }

        updateCatBtns();
        userEventOverlay.style.display = 'flex';
        txtInput.focus();
    };

    document.getElementById('aue-save-btn').onclick = () => {
        const text = document.getElementById('aue-text-input').value.trim();
        if (!text) return;
        if (window.saveUserEvent) {
            window.saveUserEvent(activeDateStr, { id: editingEventId, text: text, category: selectedCat });
        }
        userEventOverlay.style.display = 'none';
        if (typeof window.drawAnnualWheel === 'function') window.drawAnnualWheel();
    };

    document.getElementById('aue-delete-btn').onclick = () => {
        if (confirm("この記録を削除しますか？") && window.deleteUserEvent) {
            window.deleteUserEvent(activeDateStr, editingEventId);
            userEventOverlay.style.display = 'none';
            if (typeof window.drawAnnualWheel === 'function') window.drawAnnualWheel();
        }
    };

    // --- 3. 年間観察記録サイドドロワー ---
    const drawer = document.createElement('div');
    drawer.id = 'annual-drawer';
    drawer.style = `
        position: fixed;
        top: 0; right: -380px; width: 360px; height: 100vh;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-left: 1px solid rgba(212, 175, 55, 0.3);
        box-shadow: -10px 0 30px rgba(0,0,0,0.7);
        z-index: 2200;
        transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
        font-family: 'Shippori Mincho', 'YuMincho', serif;
    `;

    drawer.innerHTML = `
        <div style="padding:16px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:15px; font-weight:bold; color:#d4af37;">年間 観察記録・日記</div>
            <button id="ad-close-btn" style="background:none; border:none; color:#94a3b8; font-size:16px; cursor:pointer;">✕</button>
        </div>
        <div id="ad-timeline-list" style="flex:1; overflow-y:auto; padding:14px;"></div>
    `;
    document.body.appendChild(drawer);

    let isDrawerOpen = false;
    document.getElementById('ad-close-btn').onclick = () => window.toggleObservationDrawer(false);

    window.toggleObservationDrawer = function(force) {
        isDrawerOpen = force !== undefined ? force : !isDrawerOpen;
        drawer.style.right = isDrawerOpen ? '0px' : '-380px';
        if (isDrawerOpen) renderDrawerTimeline();
    };

    function renderDrawerTimeline() {
        const listElem = document.getElementById('ad-timeline-list');
        const db = window.loadAllUserEvents ? window.loadAllUserEvents() : {};
        const keys = Object.keys(db).sort().reverse();

        if (keys.length === 0) {
            listElem.innerHTML = `<div style="text-align:center; padding:40px 10px; color:#64748b; font-size:13px;">まだ記録がありません。<br>カレンダーをダブルクリックして記録を追加できます。</div>`;
            return;
        }

        listElem.innerHTML = keys.map(dKey => {
            const evs = db[dKey] || [];
            return evs.map(ev => {
                const cat = categories[ev.category] || { name: "雑記", color: "#8b8170", labelColor: "#cbd5e1" };
                return `
                    <div style="background:rgba(255,255,255,0.03); border-left:3px solid ${cat.color}; border-radius:6px; padding:10px 12px; margin-bottom:8px; cursor:pointer;" onclick="window.openUserEventModal('${dKey}', '${ev.id}')">
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span style="font-size:12px; font-weight:bold; color:#d4af37;">${dKey}</span>
                            <span style="font-size:10px; color:${cat.labelColor};">${cat.name}</span>
                        </div>
                        <div style="font-size:12.5px; color:#f1f5f9; line-height:1.4;">${ev.text}</div>
                    </div>
                `;
            }).join('');
        }).join('');
    }
})();
