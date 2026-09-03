# 幸运草新标签页（Edge 起始页插件）

仿 Edge 新标签页布局：大字时钟 + 公历/农历/节气节日、Bing 搜索框（logo 点击循环切换引擎）、
圆角网站快捷图标（自动获取 logo）、右上角 MSN 天气（默认北京）+ 设置按钮、底部唐诗宋词随机句。

## 使用

1. 打开 `edge://extensions/`，开启「开发人员模式」；
2.「加载解压缩的扩展」→ 选择本目录；
3. 新开标签页即可生效。
4. 配置天气apiKey(浏览器打开MSN天气，然后把apikey粘贴到设置中保存)

## 功能与模块对照

| 需求 | 模块 |
| --- | --- |
| 背景bing | `js/background.js` |
| MSN 天气（apikey 可配置、天气图标、气温） | `js/weather.js` + `js/config.js#buildWeatherUrl` |
| 时钟 / 公历 / 农历 / 节气节日（lunar-ts） | `js/clock.js` |
| 搜索框 + 引擎循环切换 | `js/search.js` |
| 快捷方式（添加/删除/自动 logo/大小/间距/每行个数/自动换行） | `js/shortcuts.js` |
| 底部诗词随机句 | `js/poetry.js` |
| 设置面板 | `js/settings.js` |
| 缓存层 cache/pic、cache/icon、cache/settings | `js/cache.js` + `js/store.js` |

## 缓存说明（cache 目录）

浏览器不允许扩展写自身安装目录，故三个逻辑目录以 IndexedDB 实现（键名即文件名，速度更快）：

- `cache/pic`：`bing-YYYY-MM-DD`（每日自动同步并清理旧图）、`local`、`folder-N`
- `cache/icon`：`{domain}` 或 `custom-时间戳`
- `cache/settings`：`default.json`（随包物理文件，首次运行读取）+ `user.json`（用户设置，含 apikey）

「设置 → 其他 → 恢复默认设置」可一键清空以上缓存。