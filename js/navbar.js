(function () {
    var mount = document.getElementById('navbar-mount');
    if (!mount) return;

    var active = mount.getAttribute('data-nav-active') || '';

    var items = [
        { key: 'howitworks', href: 'howitworks.html', label: 'How It Works?' },
        { key: 'features', href: 'features.html', label: 'Features' },
        { key: 'microsite', href: 'microsite.html', label: 'For Doctors' },
        { key: 'pricing', href: 'pricing.html', label: 'Pricing' }
    ];

    function navLink(item) {
        var isActive = item.key === active;
        var attrs = 'href="' + item.href + '" class="nav-link' + (isActive ? ' active' : '') + '"';
        if (isActive) attrs += ' aria-current="page"';
        return '<a ' + attrs + '>' + item.label + '</a>';
    }

    var linksHtml = items.map(navLink).join('\n            ');
    linksHtml +=
        '\n            <div class="navbar-mobile-actions">' +
        '\n                <a href="#login" class="navbar-btn navbar-btn-secondary">Log In</a>' +
        '\n            </div>';

    mount.outerHTML =
        '<!-- Navigation Bar -->\n' +
        '    <div class="navbar-root">\n' +
        '        <nav class="navbar-custom">\n' +
        '            <div class="navbar-container">\n' +
        '                <div class="navbar-logo">\n' +
        '                    <a href="/" class="logo-link">\n' +
        '                        <img src="img/logo.png" alt="DigiDr Logo">\n' +
        '                    </a>\n' +
        '                </div>\n' +
        '                <div class="navbar-links" id="navbarLinks">\n' +
        '                    ' + linksHtml + '\n' +
        '                </div>\n' +
        '                <div class="navbar-links-placeholder" aria-hidden="true"></div>\n' +
        '                <div class="navbar-right-actions">\n' +
        '                    <div class="navbar-action-group">\n' +
        '                        <div class="navbar-auth-group">\n' +
        '                            <a href="#login" class="navbar-btn navbar-btn-link">Log In</a>\n' +
        '                            <a href="https://digidr.app/intrest" class="navbar-btn navbar-btn-primary">Register</a>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <button class="hamburger-menu" id="hamburgerMenu" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navbarLinks">\n' +
        '                        <span class="hamburger-line"></span>\n' +
        '                        <span class="hamburger-line"></span>\n' +
        '                        <span class="hamburger-line"></span>\n' +
        '                    </button>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </nav>\n' +
        '    </div>';
})();
