(function () {
    function track(name, params) {
        if (typeof gtag === 'function') gtag('event', name, params || {});
        if (typeof clarity === 'function') clarity('event', name);
    }
    window.digidrTrack = track;

    function tag(key, value) {
        if (typeof clarity === 'function') clarity('set', key, value);
        if (typeof gtag === 'function') {
            var props = {};
            props[key] = value;
            gtag('set', 'user_properties', props);
        }
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
                if (m === 90 && typeof clarity === 'function') clarity('upgrade', 'deep_scroll');
            }
        });
    }, { passive: true });

    // Segment tags Clarity can filter recordings/dashboards by
    tag('device_type', /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop');
    tag('referrer_host', (function () {
        try { return document.referrer ? new URL(document.referrer).hostname : 'direct'; }
        catch (_) { return 'direct'; }
    })());
    var urlParams = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (p) {
        var v = urlParams.get(p);
        if (v) tag(p, v);
    });

    // Prioritize sessions that hit a JS error so Clarity doesn't sample them out
    window.addEventListener('error', function (e) {
        track('js_error', { message: e.message, source: e.filename, line: e.lineno });
        if (typeof clarity === 'function') clarity('upgrade', 'js_error');
    });

    // Form focus/abandon tracking (any <form>, including ones added later)
    document.addEventListener('focusin', function (e) {
        var field = e.target.closest('input, textarea, select');
        var form = field && field.closest('form');
        if (!form) return;
        var formName = form.getAttribute('id') || form.getAttribute('name') || 'unnamed_form';
        if (!form.dataset.digidrStarted) {
            form.dataset.digidrStarted = '1';
            track('form_start', { form: formName });
        }
    });
    document.addEventListener('submit', function (e) {
        var form = e.target;
        var formName = form.getAttribute('id') || form.getAttribute('name') || 'unnamed_form';
        form.dataset.digidrSubmitted = '1';
        track('form_submit', { form: formName });
        if (typeof clarity === 'function') clarity('upgrade', 'form_submit');
    });
    window.addEventListener('beforeunload', function () {
        document.querySelectorAll('form').forEach(function (form) {
            if (form.dataset.digidrStarted && !form.dataset.digidrSubmitted) {
                var formName = form.getAttribute('id') || form.getAttribute('name') || 'unnamed_form';
                track('form_abandon', { form: formName });
            }
        });
    });

    // Rage-click safety net (Clarity detects this itself, but this also upgrades the session)
    var clickTimestamps = [];
    document.addEventListener('click', function (e) {
        var now = Date.now();
        clickTimestamps.push(now);
        clickTimestamps = clickTimestamps.filter(function (t) { return now - t < 1000; });
        if (clickTimestamps.length >= 4 && typeof clarity === 'function') {
            clarity('upgrade', 'rage_click');
        }
    });
})();

// Identify a known user with Clarity once you have an identifier (e.g. after signup/login).
// Call window.digidrIdentify('user-id', sessionId, pageId, 'friendly-name') from that flow.
window.digidrIdentify = function (userId, sessionId, pageId, friendlyName) {
    if (typeof clarity === 'function') clarity('identify', userId, sessionId, pageId, friendlyName);
};
