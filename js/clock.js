/* 时钟：时间 / 公历 / 农历 / 节气节日 */
SP.clock = {
    WEEK: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    start() {
        this.elTime = SP.utils.$('#time');
        this.elDate = SP.utils.$('#dateline');
        this.tick();
        setInterval(() => this.tick(), 1000);
    },
    tick() {
        const d = new Date();
        const U = SP.utils;
        this.elTime.textContent = `${U.pad(d.getHours())}:${U.pad(d.getMinutes())}:${U.pad(d.getSeconds())}`;
        const L = SP.lunar.get(d);
        const solar = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
        const parts = [this.WEEK[d.getDay()], solar, L.lunarText];
        if (L.festival) parts.push(L.festival);
        this.elDate.innerHTML = parts.map((p, i) =>
            i === parts.length - 1 && L.festival
                ? `<span style="color:#ffd479;font-weight:600">${p}</span>` : p
        ).join('&nbsp;&nbsp;');
    }
};