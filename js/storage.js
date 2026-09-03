/* 用户设置读写：chrome.storage 优先，降级 localStorage；并镜像到 cache/settings/settings.json */
SP.storage = {
    _chrome: typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local,
    async load() {
        let s = null;
        if (this._chrome) {
            const o = await chrome.storage.local.get('settings');
            s = o.settings || null;
        } else {
            try { s = JSON.parse(localStorage.getItem('sp-settings')); } catch (e) { }
        }
        if (!s) {
            try { const txt = await SP.cache.get('settings', 'settings.json'); if (txt) s = JSON.parse(txt); } catch (e) { }
        }
        return SP.utils.deepMerge(JSON.parse(JSON.stringify(SP.config.defaults)), s || {});
    },
    async save(s) {
        if (this._chrome) await chrome.storage.local.set({ settings: s });
        else { try { localStorage.setItem('sp-settings', JSON.stringify(s)); } catch (e) { } }
        SP.cache.put('settings', 'settings.json', JSON.stringify(s)).catch(() => { });
    }
};