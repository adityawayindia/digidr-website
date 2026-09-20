(function () {
    function track(name, params) {
        if (typeof gtag === 'function') gtag('event', name, params || {});
        if (typeof clarity === 'function') clarity('event', name);
    }
    window.digidrTrack = track;

    function tag(key, value) {
        if (typeof clarity === 'function') clarity('set', key, value);
    }
    window.digidrTag = tag;

    // Declarative clicks: any element (or dynamically injected element) with data-ga="event_name"
    document.addEventListener('click', function (e) {
        var el = e.target.closest('[data-ga]');
        if (!el) return;
        var name = el.getAttribute('data-ga');
        track(name);

        // Derive a "plan" tag from cta_*_<plan> event names (e.g. cta_start_trial_premium -> premium)
        var ctaMatch = /^cta_(?:start_free|start_trial)_(.+)$/.exec(name);
        if (ctaMatch) tag('plan_clicked', ctaMatch[1]);
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
