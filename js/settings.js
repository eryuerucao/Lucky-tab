/* 设置面板 + 添加快捷方式/搜索引擎弹窗 */
SP.settings = {
    init() {
        SP.utils.$('#btn-settings').onclick = () => this.open();
        SP.utils.$('#p-close').onclick = () => this.close();
        SP.utils.$('#panel-mask').onclick = e => { if (e.target.id === 'panel-mask') this.close(); };
        SP.utils.$('#p-save').onclick = () => this.save();

        // 竖向页签切换
        document.querySelectorAll('#panel-tabs .p-tab').forEach(b => {
            b.onclick = () => this.switchTab(b.dataset.tab);
        });

        // 滑杆实时 label
        const unit = { 'p-size': 'px', 'p-gap': 'px', 'p-rowgap': 'px', 'p-cols': ' 个', 'p-radius': '%', 'p-eradius': '%', 'p-fsmain': 'px', 'p-fswx': 'px' };
        Object.keys(unit).forEach(id => {
            SP.utils.$('#' + id).oninput = e => {
                SP.utils.$('#v-' + id.slice(2)).textContent = e.target.value + unit[id];
            };
        });

        // 城市选择框选项来自 config.js 中的 citys
        const elCity = SP.utils.$('#p-city');
        SP.config.citys.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name; opt.textContent = c.name;
            elCity.appendChild(opt);
        });

        // 字体选择框选项来自 config.js 中的 fonts
        const elFont = SP.utils.$('#p-font');
        SP.config.fonts.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.value; opt.textContent = f.name;
            elFont.appendChild(opt);
        });
        // 字体/颜色实时预览
        elFont.onchange = e => document.documentElement.style.setProperty('--font-family', e.target.value);
        const elColor = SP.utils.$('#p-fontcolor');
        const setColorVar = e => document.documentElement.style.setProperty('--font-color', e.target.value);
        elColor.oninput = setColorVar;
        elColor.onchange = setColorVar;

        // 添加/编辑快捷方式弹窗
        SP.utils.$('#d-cancel').onclick = () => this.closeAddDlg();
        SP.utils.$('#dlg-mask').onclick = e => { if (e.target.id === 'dlg-mask') this.closeAddDlg(); };
        SP.utils.$('#d-ok').onclick = () => this.confirmShortcutDlg();

        // 添加搜索引擎弹窗
        SP.utils.$('#engine-add').onclick = () => this.openEngineDlg();
        SP.utils.$('#e-cancel').onclick = () => this.closeEngineDlg();
        SP.utils.$('#edlg-mask').onclick = e => { if (e.target.id === 'edlg-mask') this.closeEngineDlg(); };
        SP.utils.$('#e-ok').onclick = () => this.confirmAddEngine();
    },

    switchTab(name) {
        document.querySelectorAll('#panel-tabs .p-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
        document.querySelectorAll('#panel-content .p-page').forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
    },

    /* 把字体设置写入 CSS 变量 */
    applyFont() {
        const ui = (SP.state.settings && SP.state.settings.ui) || { fsMain: 18, fsWx: 14 };
        document.documentElement.style.setProperty('--fs-main', ui.fsMain + 'px');
        document.documentElement.style.setProperty('--fs-wx', ui.fsWx + 'px');
        if (ui.fontFamily) document.documentElement.style.setProperty('--font-family', ui.fontFamily);
        // 只写入合法的 #rrggbb 颜色，避免污染 CSS 变量
        const color = (ui.fontColor || '').trim();
        if (/^#[0-9a-fA-F]{6}$/.test(color))
            document.documentElement.style.setProperty('--font-color', color.toLowerCase());
    },

    open() {
        const s = SP.state.settings;
        this.switchTab('weather');
        SP.utils.$('#p-apikey').value = s.weather.apikey;
        const elCity = SP.utils.$('#p-city');
        // 已保存城市在选项中则选中它，否则回退到第一项
        elCity.value = SP.config.citys.some(c => c.name === s.weather.city)
            ? s.weather.city : elCity.options[0].value;
        SP.utils.$('#p-size').value = s.sc.size; SP.utils.$('#v-size').textContent = s.sc.size + 'px';
        SP.utils.$('#p-gap').value = s.sc.gap; SP.utils.$('#v-gap').textContent = s.sc.gap + 'px';
        SP.utils.$('#p-rowgap').value = s.sc.rowGap; SP.utils.$('#v-rowgap').textContent = s.sc.rowGap + 'px';
        SP.utils.$('#p-cols').value = s.sc.cols; SP.utils.$('#v-cols').textContent = s.sc.cols + ' 个';
        SP.utils.$('#p-radius').value = s.sc.radius; SP.utils.$('#v-radius').textContent = s.sc.radius + '%';
        SP.utils.$('#p-eradius').value = s.sc.engineRadius; SP.utils.$('#v-eradius').textContent = s.sc.engineRadius + '%';
        SP.utils.$('#p-fsmain').value = s.ui.fsMain; SP.utils.$('#v-fsmain').textContent = s.ui.fsMain + 'px';
        SP.utils.$('#p-fswx').value = s.ui.fsWx; SP.utils.$('#v-fswx').textContent = s.ui.fsWx + 'px';
        // 字体下拉：已保存值在选项中则选中，否则回退第一项
        const elFont = SP.utils.$('#p-font');
        elFont.value = SP.config.fonts.some(f => f.value === s.ui.fontFamily)
            ? s.ui.fontFamily : elFont.options[0].value;
        // 颜色值规范化：color 输入框只接受 #rrggbb，非法值会导致赋值静默失败
        const color = (s.ui.fontColor || '').trim();
        SP.utils.$('#p-fontcolor').value = /^#[0-9a-fA-F]{6}$/.test(color) ? color.toLowerCase() : '#ffffff';
        this.renderEngines();
        SP.utils.$('#panel-mask').classList.remove('hidden');
    },
    close() {
        SP.utils.$('#panel-mask').classList.add('hidden')
    },

    async save() {
        const s = SP.state.settings;
        s.weather.apikey = SP.utils.$('#p-apikey').value.trim();
        s.weather.city = SP.utils.$('#p-city').value;
        // 经纬度取自城市表，不对外展示
        const c = SP.config.citys.find(c => c.name === s.weather.city);
        if (c) { s.weather.lat = c.lat; s.weather.lon = c.lng; }
        s.sc.size = Number(SP.utils.$('#p-size').value);
        s.sc.gap = Number(SP.utils.$('#p-gap').value);
        s.sc.rowGap = Number(SP.utils.$('#p-rowgap').value);
        s.sc.cols = Number(SP.utils.$('#p-cols').value);
        s.sc.radius = Number(SP.utils.$('#p-radius').value);
        s.sc.engineRadius = Number(SP.utils.$('#p-eradius').value);
        s.ui.fsMain = Number(SP.utils.$('#p-fsmain').value);
        s.ui.fsWx = Number(SP.utils.$('#p-fswx').value);
        s.ui.fontFamily = SP.utils.$('#p-font').value;
        const color = (SP.utils.$('#p-fontcolor').value || '').trim();
        s.ui.fontColor = /^#[0-9a-fA-F]{6}$/.test(color) ? color.toLowerCase() : '#ffffff';
        await SP.storage.save(s);
        this.close();
        // 先应用字体设置（不依赖网络），再处理壁纸/天气等
        this.applyFont();
        try {
            await SP.wallpaper.apply();
            await SP.weather.refresh();
            SP.shortcuts.applyLayout();
            await SP.shortcuts.render();
        } catch (e) {
            console.error('[settings.save]', e);
        }
    },

    /* ---------- 搜索引擎列表 ---------- */
    renderEngines() {
        const list = SP.utils.$('#engine-list');
        list.innerHTML = '';
        const engines = SP.state.settings.search.engines;
        engines.forEach((eng, i) => {
            const row = document.createElement('div'); row.className = 'eng-row';
            const img = document.createElement('img'); img.src = eng.logo; img.alt = eng.name;
            img.onerror = () => img.remove();
            const name = document.createElement('span'); name.className = 'eng-name'; name.textContent = eng.name;
            const url = document.createElement('span'); url.className = 'eng-url'; url.textContent = eng.url;
            const del = document.createElement('button'); del.className = 'eng-del'; del.textContent = '删除';
            del.onclick = () => this.removeEngine(i);
            row.append(img, name, url, del);
            list.appendChild(row);
        });
    },
    async removeEngine(i) {
        const s = SP.state.settings;
        if (s.search.engines.length <= 1) { alert('至少保留一个搜索引擎'); return; }
        s.search.engines.splice(i, 1);
        s.search.engine = Math.min(s.search.engine, s.search.engines.length - 1);
        await SP.storage.save(s);
        // 同步搜索框当前引擎
        SP.search.engines = s.search.engines;
        SP.search.idx = s.search.engine;
        SP.search.render();
        this.renderEngines();
    },

    openEngineDlg() {
        SP.utils.$('#e-name').value = ''; SP.utils.$('#e-logo').value = ''; SP.utils.$('#e-url').value = '';
        SP.utils.$('#edlg-mask').classList.remove('hidden');
        setTimeout(() => SP.utils.$('#e-name').focus(), 50);
    },
    closeEngineDlg() { SP.utils.$('#edlg-mask').classList.add('hidden'); },
    async confirmAddEngine() {
        const name = SP.utils.$('#e-name').value.trim();
        let logo = SP.utils.$('#e-logo').value.trim();
        const url = SP.utils.$('#e-url').value.trim();
        if (!name || !url) { alert('请填写引擎名称和搜索 URL'); return; }
        // 图标留空时自动取网站 favicon
        if (!logo) {
            try { logo = 'https://www.google.com/s2/favicons?sz=128&domain=' + new URL(SP.utils.normalizeUrl(url)).hostname; } catch (e) { }
        }
        const s = SP.state.settings;
        s.search.engines.push({ name, logo, url });
        await SP.storage.save(s);
        this.closeEngineDlg();
        this.renderEngines();
        SP.search.render();
    },

    /* ---------- 添加/编辑快捷方式弹窗 ---------- */
    openAddDlg() {
        this._editId = null;
        SP.utils.$('#d-title').textContent = '添加 shortcut';
        SP.utils.$('#d-name').value = ''; SP.utils.$('#d-url').value = ''; SP.utils.$('#d-icon').value = '';
        SP.utils.$('#dlg-mask').classList.remove('hidden');
        setTimeout(() => SP.utils.$('#d-name').focus(), 50);
    },
    openEditDlg(id) {
        const it = SP.state.settings.sc.items.find(x => x.id === id);
        if (!it) return;
        this._editId = id;
        SP.utils.$('#d-title').textContent = '编辑快捷方式';
        SP.utils.$('#d-name').value = it.name;
        SP.utils.$('#d-url').value = it.url;
        SP.utils.$('#d-icon').value = it.icon || '';
        SP.utils.$('#dlg-mask').classList.remove('hidden');
    },
    closeAddDlg() { SP.utils.$('#dlg-mask').classList.add('hidden'); },
    async confirmShortcutDlg() {
        const name = SP.utils.$('#d-name').value.trim();
        const url = SP.utils.$('#d-url').value.trim();
        if (!name || !url) { alert('请填写名称和网址'); return; }
        // 图标链接留空 = 自动获取
        const icon = SP.utils.$('#d-icon').value.trim();
        this.closeAddDlg();
        const s = SP.state.settings;
        if (this._editId !== null) {
            // 编辑：名称/网址/图标变化时清除旧图标缓存
            const it = s.sc.items.find(x => x.id === this._editId);
            if (it) {
                const needRefetch = (it.icon || '') !== icon || it.url !== url;
                it.name = name; it.url = url; it.icon = icon;
                await SP.storage.save(s);
                if (needRefetch) await SP.cache.del('icon', it.id).catch(() => { });
            }
            this._editId = null;
            await SP.shortcuts.render();
        } else {
            await SP.shortcuts.add(name, url, icon);
        }
    },

};
