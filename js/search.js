/* 搜索框 + 引擎循环切换 */
SP.search = {
    init(s) {
        this.s = s.search;
        // 引擎列表为用户可编辑数据，默认取自 config.engines
        this.engines = this.s.engines || SP.config.engines;
        this.idx = (this.s.engine || 0) % this.engines.length;
        this.input = SP.utils.$('#search-input');
        this.img = SP.utils.$('#engine-img');
        SP.utils.$('#engine-logo').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleEngineBar();
        });
        SP.utils.$('#search-btn').onclick = () => this.go();
        this.input.addEventListener('keydown', e => { if (e.key === 'Enter') this.go(); });
        this.render();
    },
    render() {
        const e = this.engines[this.idx];
        this.img.src = e.logo;
        this.img.onerror = () => { this.img.src = ''; };
    },
    switchEngine(idx) {
        this.idx = idx;
        this.s.engine = idx;                          // ✅ 写入 settings 对象
        SP.storage.save(SP.state.settings).catch(() => { });  // 持久化
        document.getElementById('search-input').placeholder = '搜索或输入网址';
        this.render();
        this.input.focus();
    },
    go() {
        const v = this.input.value.trim();
        if (!v) return;
        const isUrl = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/i.test(v) && !/\s/.test(v);
        const url = isUrl ? SP.utils.normalizeUrl(v) : this.engines[this.idx].url + encodeURIComponent(v);
        window.location.href = url;
    },
    // 打开/关闭引擎条
    toggleEngineBar() {
        const bar = document.getElementById('engineBar');
        const input = document.getElementById('search-input');

        if (bar.classList.contains('active')) {
            // 收起：恢复 placeholder
            this.closeEngineBar();
            input.placeholder = '搜索或输入网址';
        } else {
            // 展开：隐藏 placeholder
            this.renderEngineBar();
            bar.classList.add('active');
            input.placeholder = '';

            setTimeout(() => {
                this._barCloseHandler = (e) => {
                    if (!bar.contains(e.target) && e.target.id !== 'engine-logo' && !document.getElementById('engine-logo').contains(e.target)) {
                        this.closeEngineBar();
                        input.placeholder = '搜索或输入网址';   // ✅ 点击外部关闭时也恢复
                    }
                };
                document.addEventListener('click', this._barCloseHandler);
            }, 0);
        }
    },

    closeEngineBar() {
        document.getElementById('engineBar').classList.remove('active');
        if (this._barCloseHandler) {
            document.removeEventListener('click', this._barCloseHandler);
            this._barCloseHandler = null;
        }
    },

    renderEngineBar() {
        const list = document.getElementById('engineBarList');
        list.innerHTML = '';
        this.engines.forEach((eng, i) => {
            const item = document.createElement('div');
            item.className = 'engine-bar-item' + (i === this.idx ? ' active' : '');
            item.title = eng.name;
            item.innerHTML = `<img src="${eng.logo}" alt="${eng.name}">`;
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.switchEngine(i);
                this.closeEngineBar();
            });
            list.appendChild(item);
        });
    },

};