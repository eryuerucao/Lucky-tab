/* 缓存层：逻辑目录 cache/pic、cache/icon、cache/settings
   MV3 不允许写插件安装目录，故用 IndexedDB 同名存储区实现，API 保持“目录+文件名”风格 */
SP.cache = (function () {
    const DB = 'sp-cache', STORES = ['pic', 'icon', 'settings'];
    let dbp = null;
    function open() {
        if (dbp) return dbp;
        dbp = new Promise((res, rej) => {
            const req = indexedDB.open(DB, 1);
            req.onupgradeneeded = e => {
                const db = e.target.result;
                STORES.forEach(s => { if (!db.objectStoreNames.contains(s)) db.createObjectStore(s); });
            };
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
        });
        return dbp;
    }
    async function tx(store, mode, fn) {
        const db = await open();
        return new Promise((res, rej) => {
            const t = db.transaction(store, mode);
            const r = fn(t.objectStore(store));
            t.oncomplete = () => res(r && r.result !== undefined ? r.result : undefined);
            t.onerror = () => rej(t.error);
        });
    }
    return {
        put: (store, key, val) => tx(store, 'readwrite', os => os.put(val, key)),
        get: (store, key) => tx(store, 'readonly', os => os.get(key)),
        del: (store, key) => tx(store, 'readwrite', os => os.delete(key)),
        keys: store => tx(store, 'readonly', os => os.getAllKeys())
    };
})();