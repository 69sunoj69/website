/*
 * Runs synchronously in <head>, before first paint.
 * Resolves the theme (saved choice → OS preference) so the page never
 * flashes the wrong colours, and flags that JavaScript is available.
 */
(function () {
    var root = document.documentElement;
    var saved = null;

    root.classList.add('js');

    try {
        saved = localStorage.getItem('theme');
    } catch (e) { /* storage unavailable (private mode, blocked cookies) */ }

    var theme = saved === 'light' || saved === 'dark'
        ? saved
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    root.dataset.theme = theme;

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0E1113' : '#F3F1EC';
})();
