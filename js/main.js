/* 入口 */
SP.state = { settings: null };
(async function boot() {
    try {
        SP.state.settings = await SP.storage.load();
        SP.settings.init();
        SP.settings.applyFont();          // ★ 首屏即按设置渲染字号
        SP.clock.start();
        await SP.wallpaper.init(SP.state.settings);
        await SP.weather.init(SP.state.settings);
        SP.search.init(SP.state.settings);
        await SP.shortcuts.init(SP.state.settings);
        await SP.poetry.init();
    } catch (e) {
        console.error('[startpage]', e);
    }
})();
