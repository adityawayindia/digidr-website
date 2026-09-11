(function () {
    var mount = document.getElementById('footer-mount');
    if (!mount) return;

    mount.outerHTML =
        '<footer class="footer-section">\n' +
        '        <div class="hero-aurora" aria-hidden="true">\n' +
        '            <div class="hero-aurora__mesh">\n' +
        '                <div class="hero-aurora__blob hero-aurora__blob--blue"><div class="hero-aurora__blob-inner"></div></div>\n' +
        '                <div class="hero-aurora__blob hero-aurora__blob--orange"><div class="hero-aurora__blob-inner"></div></div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="container footer-container">\n' +
        '            <div class="footer-grid">\n' +
        '                <div class="footer-brand">\n' +
        '                    <a class="footer-logo" href="index.html" aria-label="DigiDr Home" data-ga="footer_logo_click">\n' +
        '                        <img src="img/logo.png" alt="DigiDr Logo">\n' +
        '                    </a>\n' +
        '                    <p class="footer-tagline">AI Digital Infrastructure for Doctors. Build and maintain your complete digital identity.</p>\n' +
        '                    <div class="footer-contact">\n' +
        '                        <a href="mailto:info@digidr.app" aria-label="Email DigiDr" data-ga="footer_email_click">\n' +
        '                            <span class="material-symbols-outlined" aria-hidden="true">mail</span>\n' +
        '                            info@digidr.app\n' +
        '                        </a>\n' +
        '                    </div>\n' +
        '                    <div class="footer-social" aria-label="Social Links">\n' +
        '                        <a href="#" aria-label="Instagram" data-ga="footer_instagram_click"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>\n' +
        '                        <a href="#" aria-label="LinkedIn" data-ga="footer_linkedin_click"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i></a>\n' +
        '                        <a href="#" aria-label="Facebook" data-ga="footer_facebook_click"><i class="fa-brands fa-facebook-f" aria-hidden="true"></i></a>\n' +
        '                        <a href="#" aria-label="Twitter" data-ga="footer_twitter_click"><i class="fa-brands fa-x-twitter" aria-hidden="true"></i></a>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '\n' +
        '                <div class="footer-column">\n' +
        '                    <h4 class="footer-column-title">DigiDr</h4>\n' +
        '                    <ul class="footer-links">\n' +
        '                        <li><a href="howitworks.html" data-ga="footer_howitworks_click">How It Works</a></li>\n' +
        '                        <li><a href="features.html" data-ga="footer_features_click">Features</a></li>\n' +
        '                        <li><a href="microsite.html" data-ga="footer_fordoctors_click">For Doctors</a></li>\n' +
        '                        <li><a href="pricing.html" data-ga="footer_pricing_click">Pricing</a></li>\n' +
        '                    </ul>\n' +
        '                </div>\n' +
        '\n' +
        '                <div class="footer-column">\n' +
        '                    <h4 class="footer-column-title">Legal &amp; Policy</h4>\n' +
        '                    <ul class="footer-links">\n' +
        '                        <li><a href="terms-of-service.html" data-ga="footer_terms_click">Terms of Service</a></li>\n' +
        '                        <li><a href="privacy-policy.html" data-ga="footer_privacy_click">Privacy Policy</a></li>\n' +
        '                        <li><a href="cancellation-refund-policy.html" data-ga="footer_refund_policy_click">Cancellation &amp; Refund Policy</a></li>\n' +
        '                    </ul>\n' +
        '                </div>\n' +
        '\n' +
        '                <div class="footer-column">\n' +
        '                    <h4 class="footer-column-title">Download App</h4>\n' +
        '                    <div class="footer-app-links">\n' +
        '                        <a href="https://play.google.com/store/apps/details?id=com.wayindia.digidrapp" class="footer-store-card" target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play" data-ga="footer_playstore_click">\n' +
        '                            <span class="footer-store-icon" aria-hidden="true">\n' +
        '                                <img src="img/play_store.png" alt="Play Store">\n' +
        '                            </span>\n' +
        '                            <div class="footer-store-info">\n' +
        '                                <span class="footer-store-sub">GET IT ON</span>\n' +
        '                                <span class="footer-store-main">Play Store</span>\n' +
        '                            </div>\n' +
        '                        </a>\n' +
        '                        <a href="#" class="footer-store-card footer-store-card--disabled" aria-label="App Store (Coming Soon)" onclick="return false;">\n' +
        '                            <span class="footer-store-icon" aria-hidden="true">\n' +
        '                                <img src="img/app_store.png" alt="App Store">\n' +
        '                            </span>\n' +
        '                            <div class="footer-store-info">\n' +
        '                                <span class="footer-store-sub">COMING SOON ON</span>\n' +
        '                                <span class="footer-store-main">App Store</span>\n' +
        '                            </div>\n' +
        '                        </a>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '\n' +
        '            <div class="footer-bottom">\n' +
        '                <p class="footer-copyright">&copy; 2026 DigiDr. All rights reserved.</p>\n' +
        '                <p class="footer-subtext">AI Digital Infrastructure for Doctors</p>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </footer>';
})();
