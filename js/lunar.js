/* 农历 / 节气 / 节日（公历 1900-2100） */
SP.lunar = (function () {
    // 每年信息：bit0-3 闰月月份(0无)；bit4-15 各月大小(1=30天,0=29天,从正月到腊月)；bit16 闰月大小
    const INFO = [
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
        0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
        0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
        0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
        0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
        0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
        0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
        0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
        0x0d520
    ];
    const BASE = new Date(1900, 0, 31); // 1900-01-31 = 庚子年正月初一
    const MONTH_CN = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
    const DAY_CN = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
        '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const ANIMAL = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

    function leapMonth(y) { return INFO[y - 1900] & 0xf; }
    function leapDays(y) { const lm = leapMonth(y); return lm ? ((INFO[y - 1900] & 0x10000) ? 30 : 29) : 0; }
    function monthDays(y, m) { return (INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29; }
    function yearDays(y) {
        let s = 348;
        for (let i = 0x8000; i > 0x8; i >>= 1) s += (INFO[y - 1900] & i) ? 1 : 0;
        return s + leapDays(y);
    }

    // 公历 -> 农历 {y,m,d,leap}
    function solar2lunar(date) {
        let offset = Math.floor((date - BASE) / 86400000);
        let y = 1900;
        for (; y < 2101 && offset > 0; y++) offset -= yearDays(y);
        if (offset < 0) { offset += yearDays(--y); }
        const lm = leapMonth(y);
        let leap = false, m = 1;
        for (; m < 13 && offset > 0; m++) {
            let days;
            if (lm > 0 && m === lm + 1 && !leap) { --m; leap = true; days = leapDays(y); }
            else days = monthDays(y, m);
            if (leap && m === lm + 1) leap = false;
            offset -= days;
        }
        if (offset === 0 && lm > 0 && m === lm + 1) { if (leap) leap = false; else { leap = true; --m; } }
        if (offset < 0) { offset += (leap ? leapDays(y) : monthDays(y, --m)); }
        return { y, m, d: offset + 1, leap };
    }

    // 二十四节气（按公历近似日，误差 ±1 天内可接受用于显示）
    const TERM = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
        '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑',
        '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];
    const TERM_DAY = [
        [6, 20], [4, 19], [6, 21], [5, 20], [6, 21], [5, 20],
        [6, 21], [8, 23], [7, 22], [6, 21], [7, 22], [7, 22]
    ]; // [month0..11] -> [节, 气] 近似日
    function solarTerm(date) {
        const m = date.getMonth(), d = date.getDate();
        const pair = TERM_DAY[m];
        if (d === pair[0]) return TERM[m * 2];
        if (d === pair[1]) return TERM[m * 2 + 1];
        return null;
    }

    // 节日：公历 + 农历
    const SOLAR_FEST = {
        '1-1': '元旦', '2-14': '情人节', '3-8': '妇女节', '3-12': '植树节', '4-1': '愚人节',
        '5-1': '劳动节', '5-4': '青年节', '6-1': '儿童节', '7-1': '建党节', '8-1': '建军节',
        '9-10': '教师节', '10-1': '国庆节', '12-24': '平安夜', '12-25': '圣诞节'
    };
    const LUNAR_FEST = {
        '1-1': '春节', '1-15': '元宵节', '5-5': '端午节', '7-7': '七夕', '7-15': '中元节',
        '8-15': '中秋节', '9-9': '重阳节', '12-8': '腊八节', '12-30': '除夕'
    };

    function format(info) {
        const lm = info.leap ? '闰' : '';
        return `${lm}${MONTH_CN[info.m - 1]}月${DAY_CN[info.d - 1]}`;
    }
    function ganzhi(y) { return GAN[(y - 4) % 10] + ZHI[(y - 4) % 12] + '年'; }

    return {
        get(date) {
            const L = solar2lunar(date);
            const term = solarTerm(date);
            const sf = SOLAR_FEST[(date.getMonth() + 1) + '-' + date.getDate()];
            // 除夕特殊：腊月最后一天（29或30）
            let lf = LUNAR_FEST[L.m + '-' + L.d];
            if (!lf && L.m === 12 && L.d === monthDays(L.y, 12)) lf = '除夕';
            return {
                lunarText: format(L),
                ganzhi: ganzhi(L.y),
                animal: ANIMAL[(L.y - 4) % 12],
                festival: term || sf || lf || null
            };
        }
    };
})();