/* 常量与默认配置 */
SP.config = {
    engines: [
        { name: 'baidu', logo: 'https://www.baidu.com/favicon.ico', url: 'https://www.baidu.com/s?wd=' },
        { name: 'bing', logo: 'https://cn.bing.com/favicon.ico', url: 'https://cn.bing.com/search?q=' },
        { name: 'sogou', logo: 'https://www.sogou.com/favicon.ico', url: 'https://sogou.com/web?query=' },
        { name: 'metaso', logo: 'https://metaso.cn/favicon.ico', url: 'https://files.metaso.cn/api/official-website?question=' },
        { name: 'ghxi', logo: 'https://www.ghxi.com/favicon.ico', url: 'https://www.ghxi.com/?s=' },
        { name: 'so', logo: 'https://www.so.com/favicon.ico', url: 'https://www.so.com/s?q=' },
        { name: 'cctv', logo: 'https://search.cctv.com/favicon.ico', url: 'https://search.cctv.com/search.php?type=video&qtext=' }
    ],
    // ============================================
    // 国内热门城市经纬度数据（WGS84坐标系）
    // 格式: { name: "城市名", lat: 纬度, lng: 经度 }
    // ============================================
    citys: [
        { name: "北京", lat: 39.9042, lng: 116.4074 },
        { name: "上海", lat: 31.2304, lng: 121.4737 },
        { name: "广州", lat: 23.1291, lng: 113.2644 },
        { name: "深圳", lat: 22.5431, lng: 114.0579 },
        { name: "成都", lat: 30.5728, lng: 104.0668 },
        { name: "杭州", lat: 30.2741, lng: 120.1551 },
        { name: "武汉", lat: 30.5928, lng: 114.3055 },
        { name: "西安", lat: 34.3416, lng: 108.9398 },
        { name: "南京", lat: 32.0603, lng: 118.7969 },
        { name: "重庆", lat: 29.5630, lng: 106.5516 },
        { name: "天津", lat: 39.3434, lng: 117.3616 },
        { name: "苏州", lat: 31.2990, lng: 120.5853 },
        { name: "长沙", lat: 28.2282, lng: 112.9388 },
        { name: "郑州", lat: 34.7466, lng: 113.6254 },
        { name: "东莞", lat: 23.0209, lng: 113.7518 },

    ],
    // ============================================
    // 字体选择列表
    // 格式: { name: "显示名", value: "CSS font-family 值" }
    // ============================================
    fonts: [
        { name: "系统默认", value: '"Segoe UI", "Microsoft YaHei", sans-serif' },
        { name: "微软雅黑", value: '"Microsoft YaHei", "PingFang SC", sans-serif' },
        { name: "等线", value: 'DengXian, "Microsoft YaHei", sans-serif' },
        { name: "黑体", value: 'SimHei, "Microsoft YaHei", sans-serif' },
        { name: "楷体", value: 'KaiTi, "STKaiti", serif' },
        { name: "仿宋", value: 'FangSong, "STFangsong", serif' },
        { name: "宋体", value: 'SimSun, "Songti SC", serif' },
        { name: "华文楷体", value: '"STKaiti", KaiTi, serif' },
        { name: "华文行楷", value: '"STXingkai", KaiTi, cursive' },
        { name: "幼圆", value: 'YouYuan, "Yuanti SC", sans-serif' },
        { name: "思源黑体", value: '"Source Han Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif' },
        { name: "霞鹜文楷", value: '"LXGW WenKai", "STKaiti", serif' }
    ],
    bingApi: 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN',
    bingHost: 'https://www.bing.com',
    poetryApi: 'https://poetry.palemoky.com/api/poems/random',
    weatherApi: 'https://assets.msn.cn/service/weather/overview',
    defaults: {
        // 天气 API Key，默认城市
        weather: {
            cm: 'zh-cn',
            wrapodata: 'false',
            // ****这里配置apikey
            apikey: '',
            city: '北京',
            lat: 39.9042,
            lon: 116.4074
        },
        search: { engine: 0 },
        // 主字号 / 天气字号 / 显示字体 / 字体颜色
        ui: {
            fsMain: 18, fsWx: 14,
            fontFamily: '"Segoe UI", "Microsoft YaHei", sans-serif',
            fontColor: '#ffffff'
        },
        // 快捷方式：大小 / 列间距 / 行间距 / 每行个数 / 图标圆角(%) / 引擎logo圆角(%)
        sc: {
            size: 64, gap: 28, rowGap: 28, cols: 8, radius: 22, engineRadius: 50,
            items: [
                { id: 'd01', name: "直播吧", icon: '', url: "https://www.zhibo8.com/?ref=cybrhome" },
                { id: 'd02', name: "哔哩哔哩", icon: '', url: "https://www.bilibili.com" },
                { id: "d03", name: "京东", icon: '', url: "https://www.jd.com" },
                { id: "d04", name: "懂车帝", icon: '', url: "https://www.dongchedi.com" },
                { id: "d05", name: "豆包", icon: '', url: "https://www.doubao.com" },
                { id: "d06", name: "千问", icon: 'https://qianwen.aigc.cn/logo/qianwen-logo.png', url: "https://www.qianwen.com/chat?source=tongyigw" },
                { id: "d07", name: "高德地图", icon: '', url: "https://amap.com" },
                { id: "d08", name: "百度", icon: '', url: "https://www.baidu.com" },
                
            ]
        }
    }
};
// 引擎列表作为用户可编辑数据，默认值取自内置 engines
SP.config.defaults.search.engines = SP.config.engines;