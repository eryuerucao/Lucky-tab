/* 背景：bing每日 / 单图 / 文件夹轮换 */
SP.wallpaper = {
    el: null, timer: null, folderIdx: 0,
    async init(s) {
        this.el = SP.utils.$('#wallpaper');
        this.s = s.bg;
        await this.apply();
    },
    async apply() {
        clearInterval(this.timer); this.timer = null;
        await this.applyBing();
    },
    setBlob(blob) {
        if (this._url) URL.revokeObjectURL(this._url);
        this._url = URL.createObjectURL(blob);
        this.el.style.backgroundImage = `url(${this._url})`;
    },
    /* ---- bing 每日 ---- */
    async applyBing() {
        const today = SP.utils.todayStr();
        try {
            const cached = await SP.cache.get('pic', 'bing.jpg');
            const meta = await SP.cache.get('pic', 'bing.meta');
            if (cached && meta === today) { this.setBlob(cached); return; }
        } catch (e) { }
        try {
            const j = await SP.utils.fetchJSON(SP.config.bingApi);
            const rel = j.images && j.images[0] && j.images[0].url;
            if (!rel) throw new Error('no image');
            const blob = await SP.utils.fetchBlob(SP.config.bingHost + rel, 15000);
            await SP.cache.put('pic', 'bing.jpg', blob);
            await SP.cache.put('pic', 'bing.meta', today);
            this.setBlob(blob);
        } catch (e) {
            const cached = await SP.cache.get('pic', 'bing.jpg').catch(() => null);
            if (cached) this.setBlob(cached);
        }
    },
    async syncBingNow() {
        await SP.cache.del('pic', 'bing.meta').catch(() => { });
        await this.applyBing();
    }
};