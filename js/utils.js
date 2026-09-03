/* 通用工具 */
window.SP = window.SP || {};
SP.utils = {
    $: s => document.querySelector(s),
    pad: n => String(n).padStart(2, '0'),
    rand: a => a[Math.floor(Math.random() * a.length)],
    uid: () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    todayStr: () => { const d = new Date(); return `${d.getFullYear()}-${SP.utils.pad(d.getMonth() + 1)}-${SP.utils.pad(d.getDate())}`; },
    normalizeUrl(u) { if (!/^https?:\/\//i.test(u)) u = 'https://' + u; return u; },
    deepMerge(base, patch) {
        if (!patch) return base;
        for (const k in patch) {
            const v = patch[k];
            if (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]))
                SP.utils.deepMerge(base[k], v);
            else base[k] = v;
        }
        return base;
    },
    async fetchJSON(url, timeout = 8000) {
        const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), timeout);
        try {
            const r = await fetch(url, { signal: ctrl.signal });
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return await r.json();
        } finally { clearTimeout(t); }
    },
    async fetchBlob(url, timeout = 10000, mustImage = true) {
        const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), timeout);
        try {
            const r = await fetch(url, { signal: ctrl.signal });
            if (!r.ok) throw new Error('HTTP ' + r.status);
            const b = await r.blob();
            if (mustImage && (!b.type.startsWith('image/') || b.size < 80)) throw new Error('not image');
            return b;
        } finally { clearTimeout(t); }
    },
    /* 文字兜底 icon：生成圆角色块+首字符 PNG Blob */
    letterIcon(text, size = 128) {
        return new Promise(res => {
            const c = document.createElement('canvas'); c.width = c.height = size;
            const g = c.getContext('2d');
            const colors = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#1abc9c', '#2980d9', '#8e44ad', '#34495e', '#c0392b', '#16a085'];
            let h = 0; for (const ch of (text || '?')) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
            const r = size * 0.22;
            g.beginPath();
            if (g.roundRect) g.roundRect(0, 0, size, size, r); else g.rect(0, 0, size, size);
            g.fillStyle = colors[h % colors.length]; g.fill();
            g.fillStyle = '#fff';
            g.font = `bold ${size * 0.52}px "Microsoft YaHei",sans-serif`;
            g.textAlign = 'center'; g.textBaseline = 'middle';
            g.fillText((text || '?').trim().charAt(0).toUpperCase(), size / 2, size / 2 + size * 0.04);
            c.toBlob(b => res(b), 'image/png');
        });
    }
};