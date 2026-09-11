(function () {
    function track(name, params) {
        if (typeof gtag === 'function') gtag('event', name, params || {});
    }
    window.digidrTrack = track;

    // Declarative clicks: any element (or dynamically injected element) with data-ga="event_name"
    document.addEventListener('click', function (e) {
        var el = e.target.closest('[data-ga]');
        if (!el) return;
        track(el.getAttribute('data-ga'));
    });

    // Outbound link clicks (any link leaving digidr.app)
    document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href]');
        if (!a) return;
        try {
            var url = new URL(a.href, window.location.href);
            if (url.hostname && url.hostname !== window.location.hostname) {
                track('outbound_click', { link_url: a.href });
            }
        } catch (_) { /* ignore malformed hrefs like javascript:void(0) */ }
    });

    // Scroll depth
    var marks = [25, 50, 75, 90, 100];
    var fired = {};
    window.addEventListener('scroll', function () {
        var doc = document.documentElement;
        var scrollable = doc.scrollHeight - window.innerHeight;
        if (scrollable <= 0) return;
        var pct = Math.round((window.scrollY / scrollable) * 100);
        marks.forEach(function (m) {
            if (pct >= m && !fired[m]) {
                fired[m] = true;
                track('scroll_depth', { percent: m });
            }
        });
    }, { passive: true });
})();
