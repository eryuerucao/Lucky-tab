/* 网站快捷方式：自动取 logo、文字兜底、增删、布局参数 */
SP.shortcuts = {
    async init(s) {
        this.s = s.sc;
        this.el = SP.utils.$('#shortcuts');
        this.applyLayout();
        // 点击其它位置收起右键编辑按钮
        document.addEventListener('click', e => {
            if (!e.target.closest || !e.target.closest('.sc-edit')) this.hideEditBtn();
        });
        // 拖拽调整顺序：容器级 dragover 允许放置
        this.el.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        this.el.addEventListener('drop', e => this.onDrop(e));
        await this.render();
    },
    applyLayout() {
        document.documentElement.style.setProperty('--sc-size', this.s.size + 'px');
        document.documentElement.style.setProperty('--sc-gap', this.s.gap + 'px');
        document.documentElement.style.setProperty('--sc-rowgap', this.s.rowGap + 'px');
        document.documentElement.style.setProperty('--sc-radius', this.s.radius + '%');
        document.documentElement.style.setProperty('--eng-radius', this.s.engineRadius + '%');
        // 每行个数 -> 限制容器最大宽度
        const maxW = this.s.cols * (this.s.size + this.s.gap);
        this.el.style.maxWidth = maxW + 'px';
    },
    async render() {
        this.el.innerHTML = '';
        for (const it of this.s.items) {
            const tile = document.createElement('a');
            tile.className = 'sc-tile';
            tile.href = SP.utils.normalizeUrl(it.url);
            tile.title = it.name + ' — ' + it.url;
            const icon = document.createElement('div');
            icon.className = 'sc-icon';
            const img = document.createElement('img');
            img.alt = it.name;
            // const blob = await SP.cache.get('icon', it.id).catch(() => null);
            const iconUrl = (it.icon || '').trim();
            if (iconUrl) {
                // 自定义图标链接：直接使用，后台尝试缓存
                img.src = iconUrl;
                img.onerror = () => {
                    if (img.isConnected) SP.utils.letterIcon(it.name).then(lb => { if (img.isConnected) img.src = URL.createObjectURL(lb); });
                };
                this.cacheCustomIcon(it);
            } else {
                const blob = await SP.cache.get('icon', it.id).catch(() => null);
                if (blob) {
                    // 已缓存（自动抓取或自定义图标缓存成功）
                    img.src = URL.createObjectURL(blob);
                } else {
                    // 自动获取：文字兜底 + 异步多源抓 favicon
                    img.src = ''; const lb = await SP.utils.letterIcon(it.name); img.src = URL.createObjectURL(lb); this.fetchLogo(it, img);
                }

            }
            icon.appendChild(img);
            const name = document.createElement('div'); name.className = 'sc-name'; name.textContent = it.name;
            const del = document.createElement('button'); del.className = 'sc-del'; del.textContent = '✕';
            del.onclick = (e) => { e.preventDefault(); e.stopPropagation(); this.remove(it.id); };
            tile.append(icon, name, del);
            // 右键在磁贴中心显示编辑按钮
            tile.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); this.showEditBtn(tile, it.id); });
            // 拖拽排序
            tile.draggable = true;
            tile.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', String(it.id));
                e.dataTransfer.effectAllowed = 'move';
                tile.classList.add('dragging');
            });
            tile.addEventListener('dragend', () => tile.classList.remove('dragging'));
            this.el.appendChild(tile);
        }
        // 添加按钮
        const add = document.createElement('div'); add.className = 'sc-tile sc-add';
        add.innerHTML = '<div class="sc-icon">+</div><div class="sc-name">添加</div>';
        add.onclick = () => SP.settings.openAddDlg();
        this.el.appendChild(add);
    },
    /* 多源 favicon 抓取，成功则缓存 */
    async fetchLogo(it, imgEl) {
        const host = (() => { try { return new URL(SP.utils.normalizeUrl(it.url)).hostname; } catch (e) { return ''; } })();
        const sources = [
            `https://favicon.im/${host}`,
            `https://www.google.com/s2/favicons?sz=128&domain=${host}`,
            `https://api.iowen.cn/favicon/${host}.png`,
            SP.utils.normalizeUrl(it.url).replace(/\/$/, '') + '/favicon.ico'
        ];
        for (const u of sources) {
            try {
                const b = await SP.utils.fetchBlob(u, 6000);
                await SP.cache.put('icon', it.id, b);
                if (imgEl.isConnected) imgEl.src = URL.createObjectURL(b);
                return;
            } catch (e) { /* try next */ }
        }
    },
    /* 自定义图标：后台抓取并缓存（跨域失败则保持直接使用链接） */
    async cacheCustomIcon(it) {
        try {
            const b = await SP.utils.fetchBlob(it.icon, 6000);
            await SP.cache.put('icon', it.id, b);
        } catch (e) { /* 忽略，直接使用原链接 */ }
    },
    /* 右键：在磁贴中心显示编辑按钮 */
    showEditBtn(tile, id) {
        this.hideEditBtn();
        let b = tile.querySelector('.sc-edit');
        if (!b) {
            b = document.createElement('button');
            b.className = 'sc-edit';
            b.title = '编辑';
            // 铅笔 icon（无背景，白色光晕）
            b.innerHTML = '<svg t="1787668389462" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14706" width="16" height="16"><path d="M678.848216 37.887976H151.936545A151.743905 151.743905 0 0 0 0.00064 189.887881v682.239574A151.743905 151.743905 0 0 0 151.936545 1023.99936h682.239574a151.743905 151.743905 0 0 0 151.871905-151.935905V352.895779l-75.839953 75.775953v443.391723c0 42.111974-33.919979 76.095952-76.031952 76.095952H151.936545a75.903953 75.903953 0 0 1-76.159952-76.095952V189.823881c0-42.111974 33.983979-76.095952 76.159952-76.095952h451.071718L678.912216 37.887976zM320.64044 698.879563l230.143856-65.343959-164.351898-163.327898L320.64044 698.879563z m614.591615-447.48772l-164.351897-163.327898-361.599774 359.359775 164.351897 163.327898 361.599774-359.359775z m76.351953-137.215914L908.928072 12.095992c-17.087989-16.895989-45.567972-15.99999-63.74396 2.047999l-49.279969 48.95997 164.351897 163.327897 49.279969-48.959969c18.175989-18.047989 19.135988-46.399971 2.047999-63.35996z" fill="#2c2c2c" p-id="14707"></path></svg>';
            b.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                this.hideEditBtn();
                SP.settings.openEditDlg(id);
            };
            tile.appendChild(b);
        }
        b.classList.remove('hidden');
    },
    hideEditBtn() {
        document.querySelectorAll('.sc-edit').forEach(b => b.classList.add('hidden'));
    },
    /* 拖拽排序：按落点最近的磁贴决定插入位置 */
    async onDrop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const from = this.s.items.findIndex(x => String(x.id) === id);
        if (from < 0) return;
        const x = e.clientX, y = e.clientY;
        const tiles = [...this.el.querySelectorAll('.sc-tile')]; // 含末尾「添加」磁贴
        let best = null, bestD = Infinity;
        tiles.forEach((t, i) => {
            const b = t.getBoundingClientRect();
            const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
            const d = (cx - x) * (cx - x) + (cy - y) * (cy - y);
            if (d < bestD) { bestD = d; best = { i, cx }; }
        });
        if (!best) return;
        const [it] = this.s.items.splice(from, 1);
        let to = x > best.cx ? best.i + 1 : best.i;
        if (to > from) to -= 1; // 移除自身后索引补偿
        this.s.items.splice(to, 0, it);
        await SP.storage.save(SP.state.settings);
        await this.render();
    },
    async add(name, url, icon) {
        // id 需全局唯一（删除后 length 会与已有 id 冲突），故用 uid
        const id = SP.utils.uid();
        this.s.items.push({ id, name, url, icon: icon || '' });
        await SP.storage.save(SP.state.settings);
        // 先渲染文字兜底，再异步抓 logo
        await this.render();
        const it = this.s.items[this.s.items.length - 1];
        const tile = this.el.children[this.s.items.length - 1];
        const img = tile && tile.querySelector('img');
        if (img && !it.icon) this.fetchLogo(it, img);
    },
    async remove(id) {
        this.s.items = this.s.items.filter(x => x.id !== id);
        await SP.cache.del('icon', id).catch(() => { });
        await SP.storage.save(SP.state.settings);
        await this.render();
    }
};