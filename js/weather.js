/* MSN 天气 */
const ICONS = [
    { id: 2, name: '大部晴朗', url: 'https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/MostlySunnyDay.svg' },
    { id: 3, name: '局部晴朗', url: 'https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/D200PartlySunnyV2.svg' },
    { id: 19, name: '小阵雨', url: 'https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/D210LightRainShowersV2.svg' },
    { id: 28, name: '晴朗', url: 'https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/SunnyDayV3.svg' },
    { id: 29, name: '以晴为主', url: 'https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/ClearNightV3.svg' },
    { id: 31, name: '多云', url: 'https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/MostlyCloudyDayV2.svg' },
    { id: 32, name: '阴', url: 'https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/CloudyV3.svg' },
    { id: 46, name: '小雨', url: 'https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/ClearNightV3.svg' },

    { id: 30, name: '局部多云', url: 'https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/PartlyCloudyNightV2.svg' },
    { id: 30, name: '以晴为主', url: 'https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/MostlyClearNight.svg' },
];
SP.weather = {
    async init(s) { this.s = s.weather; await this.refresh(); },
    // 组装url
    buildUrl() {
        const q = Object.entries(this.s).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
        return SP.config.weatherApi + '?' + q;
    },
    // 获取、渲染数据
    async refresh() {
        const elIcon = SP.utils.$('#wx-icon'), elEmoji = SP.utils.$('#wx-emoji');
        const elTemp = SP.utils.$('#wx-temp'), elCap = SP.utils.$('#wx-cap');
        const elCity = SP.utils.$('#wx-city'), elExtra = SP.utils.$('#wx-extra');
        elCity.textContent = this.s.city || '西安';
        try {
            const res = await SP.utils.fetchJSON(this.buildUrl(), 8000);
            const cur = res.responses && res.responses[0] && res.responses[0].weather && res.responses[0].weather[0] && res.responses[0].weather[0].current;
            if (!cur) throw new Error('no data');
            elTemp.textContent = Math.round(cur.temp) + '°';
            elCap.textContent = cur.cap || '';
            elExtra.textContent = [cur.pvdrWindDir, cur.pvdrWindSpd, cur.aqiSeverity].filter(Boolean).join(' · ');
            if (cur.urlIcon) {
                elEmoji.classList.add('hidden'); elIcon.classList.remove('hidden');
                elIcon.src = cur.urlIcon;
            } else {
                elIcon.classList.add('hidden'); elEmoji.classList.remove('hidden');
                elEmoji.textContent = this.emoji(cur.icon);
            }
        } catch (e) {
            elTemp.textContent = '--°'; elCap.textContent = '获取失败';
            elExtra.textContent = '';
            elIcon.classList.add('hidden'); elEmoji.classList.remove('hidden');
            elEmoji.textContent = '🌤';
        }
    },
    emoji(icon) {
        const m = {
            1: '☀️', 2: '🌤', 3: '⛅', 4: '☁️', 5: '🌥', 6: '🌦', 7: '🌧', 8: '⛈', 9: '🌩',
            10: '🌨', 11: '❄️', 12: '🌫', 13: '🌪', 14: '🌂', 15: '💨', 16: '🌙', 17: '🌗',
            18: '🌘', 19: '🌑', 20: '🌒', 21: '🌓', 22: '🌔', 23: '🌕', 24: '🌖', 25: '🌗',
            26: '☁️', 27: '🌧', 28: '⛈', 29: '🌩', 30: '🌨', 31: '❄️', 32: '🌫', 33: '🌪',
            34: '🌂', 35: '💨', 36: '🌡', 37: '🌈', 38: '🌊', 39: '🔥'
        };
        return m[icon] || '🌤';
    }
};