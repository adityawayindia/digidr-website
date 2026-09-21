// Pin scroll to top on the pricing page: the toggle/card-height JS below
// reflows content above the fold after load, and the browser's default
// scroll restoration on refresh then lands at a slightly wrong offset.
(function () {
    if (!document.body.classList.contains('page-pricing')) return;
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
})();

// Hero intro sequence + shared scroll reveal animations
document.addEventListener('DOMContentLoaded', function () {
    var heroIntro = document.querySelector('.hero-content.hero-intro');
    if (heroIntro) {
        function startHeroIntro() {
            heroIntro.classList.add('hero-intro--ready');
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            startHeroIntro();
        } else {
            requestAnimationFrame(function () {
                requestAnimationFrame(startHeroIntro);
            });
        }
    }

    var phoneShowcase = document.querySelector('.phone-showcase:not(.hero-intro__phones)');
    if (phoneShowcase) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    phoneShowcase.classList.add('phone-showcase-inview');
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -5% 0px' });
        observer.observe(phoneShowcase);
    }

    var revealSelectors = [
        '.reason-card',
        '.love-card',
        '.how-digidoctor-works-section .doctor-image-container',
        '.how-digidoctor-works-section .pill-menu',
        '.statistics-card',
        '.statistics-card .stat-item',
        '.posts-carousel-section .carousel-header',
        '.posts-carousel-section .posts-carousel-wrapper',
        '.testimonials-section .section-header',
        '.testimonials-section .testimonials-carousel-wrapper',
        '.pricing-section .text-center',
        '.pricing-section .pricing-launch-banner',
        '.pricing-section .pricing-toggle-container',
        '.pricing-section .pricing-proof-strip',
        '.pricing-section .pricing-view-toggle',
        '.pricing-section .pricing-shared-note',
        '.pricing-section .pricing-carousel-hint',
        '.pricing-section .pricing-card',
        '.hiw-hero-content',
        '.hiw-step-card',
        '.features-page-why-love-header',
        '.features-page-offers-nav',
        '.features-page-offers-stack',
        '.features-page-mission-card',
        '.ms-hero-badge',
        '.ms-hero-title',
        '.ms-hero-tagline',
        '.ms-hero-actions',
        '.ms-benefits-header',
        '.ms-benefit-card',
        '.ms-inside-header',
        '.ms-inside-layer',
        '.ms-compare-header',
        '.ms-compare-col',
        '.ms-proof-stat',
        '.ms-proof-header',
        '.ms-proof-quote',
        '.ms-statement-content',
        '.ms-statement-device',
        '.ms-cta-card',
        '.policy-header',
        '.policy-content'
    ];
    var revealItems = document.querySelectorAll(revealSelectors.join(', '));

    if (revealItems.length) {
        if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            revealItems.forEach(function (item) {
                item.classList.add('is-visible');
            });
            return;
        }

        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px 28% 0px' });

        revealItems.forEach(function (item) {
            revealObserver.observe(item);
        });
    }

    // Active scroll pop focus for How It Works step cards
    var hiwCards = document.querySelectorAll('.hiw-step-card');
    if (hiwCards.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var cardFocusObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-active-focus');
                } else {
                    entry.target.classList.remove('is-active-focus');
                }
            });
        }, { threshold: 0.35, rootMargin: '-10% 0px -10% 0px' });

        hiwCards.forEach(function (card) {
            cardFocusObserver.observe(card);
        });
    }
});

// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navbarLinks = document.getElementById('navbarLinks');

    function updateNavbarMenuPosition() {
        const nav = document.querySelector('.navbar-custom');
        if (!nav) return;
        const rect = nav.getBoundingClientRect();
        document.documentElement.style.setProperty('--navbar-menu-top', (rect.bottom + 10) + 'px');
        document.documentElement.style.setProperty('--navbar-menu-left', rect.left + 'px');
        document.documentElement.style.setProperty('--navbar-menu-width', rect.width + 'px');
    }

    function setNavbarMenuOpen(isOpen) {
        if (!hamburgerMenu || !navbarLinks) return;
        hamburgerMenu.classList.toggle('active', isOpen);
        navbarLinks.classList.toggle('active', isOpen);
        hamburgerMenu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    if (hamburgerMenu && navbarLinks) {
        updateNavbarMenuPosition();
        window.addEventListener('resize', updateNavbarMenuPosition);

        hamburgerMenu.addEventListener('click', function (event) {
            event.stopPropagation();
            setNavbarMenuOpen(!navbarLinks.classList.contains('active'));
        });

        const navLinks = navbarLinks.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                setNavbarMenuOpen(false);
            });
        });

        navbarLinks.querySelectorAll('[data-open-mission-modal]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setNavbarMenuOpen(false);
            });
        });

        document.addEventListener('click', function (event) {
            if (!navbarLinks.classList.contains('active')) return;
            if (hamburgerMenu.contains(event.target) || navbarLinks.contains(event.target)) return;
            setNavbarMenuOpen(false);
        });
    }
});

// Pill Menu Toggle Function
function togglePill(header) {
    const pillMenu = header.closest('.pill-menu');
    const allPillMenus = document.querySelectorAll('.pill-menu');

    // Close all other pill menus
    allPillMenus.forEach(menu => {
        if (menu !== pillMenu) {
            menu.classList.remove('active');
        }
    });

    // Toggle current pill menu
    const willOpen = !pillMenu.classList.contains('active');
    pillMenu.classList.toggle('active');

    if (willOpen && window.digidrTrack) {
        const titleEl = header.querySelector('.pill-text h4');
        window.digidrTrack('howitworks_pill_toggle', { step_title: titleEl ? titleEl.textContent.trim() : '' });
    }
}

// Posts Carousel — manual, button-driven paging.
// Cards hold live Facebook embeds, which must never be cloned (a cloned embed
// renders blank) nor re-parented (that reloads the iframe). So the DOM is built
// once and left alone: paging only changes the container's scrollLeft, which
// the browser handles natively without touching any card.
function initPostsCarousel() {
    const carousel = document.querySelector('.posts-carousel');
    if (!carousel) return;
    if (carousel.dataset.carouselReady === 'true') return;

    const items = Array.from(carousel.querySelectorAll('.post-item'));
    if (!items.length) return;

    carousel.dataset.carouselReady = 'true';
    carousel.classList.add('is-manual');

    const viewport = carousel.parentElement;
    const prevBtn = viewport.querySelector('.posts-carousel-nav-prev');
    const nextBtn = viewport.querySelector('.posts-carousel-nav-next');

    // How far one click moves: a whole "page" of fully visible cards, so the
    // user never lands mid-card. Falls back to one card on narrow screens.
    function stepSize() {
        const card = items[0];
        const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
        const span = card.offsetWidth + gap;
        const perPage = Math.max(1, Math.floor(carousel.clientWidth / span));
        return span * perPage;
    }

    function maxScroll() {
        return Math.max(0, carousel.scrollWidth - carousel.clientWidth);
    }

    // Buttons disable at the ends rather than wrapping: with a finite set of
    // real posts there is nothing to loop to, and a dead-end button that still
    // looks clickable reads as broken.
    function syncButtons() {
        if (!prevBtn || !nextBtn) return;
        const x = carousel.scrollLeft;
        const max = maxScroll();
        const atStart = x <= 1;
        const atEnd = x >= max - 1;

        prevBtn.disabled = atStart;
        nextBtn.disabled = atEnd;
        prevBtn.setAttribute('aria-disabled', String(atStart));
        nextBtn.setAttribute('aria-disabled', String(atEnd));

        // Hide the controls outright when everything already fits on screen.
        const overflows = max > 1;
        viewport.classList.toggle('has-overflow', overflows);
    }

    function page(direction) {
        const target = carousel.scrollLeft + direction * stepSize();
        carousel.scrollTo({
            left: Math.max(0, Math.min(target, maxScroll())),
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });
    }

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { page(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { page(1); });

    // Keyboard paging when the strip itself has focus.
    carousel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); page(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); page(1); }
    });

    // Native scroll (trackpad swipe, touch drag, shift+wheel) stays enabled;
    // the buttons just drive the same scrollLeft. No drag handlers are needed,
    // and none are installed, so pointer events reach the embeds untouched.
    let rafPending = false;
    carousel.addEventListener('scroll', function () {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(function () {
            rafPending = false;
            syncButtons();
        });
    }, { passive: true });

    window.addEventListener('resize', syncButtons);

    // Embeds resolve their height asynchronously, which changes scrollWidth.
    if (typeof ResizeObserver === 'function') {
        const ro = new ResizeObserver(syncButtons);
        ro.observe(carousel);
    }

    syncButtons();
}


// Pricing Toggle (6 months/12 months) — 6mo = 10% off, 12mo = 20% off base monthly rate
document.addEventListener('DOMContentLoaded', function () {
    const sixBtn = document.getElementById('sixMonthBtn');
    const twelveBtn = document.getElementById('twelveMonthBtn');
    const pricingSection = document.getElementById('pricing');
    const priceValues = document.querySelectorAll('.price-value[data-monthly]');

    if (!sixBtn || !twelveBtn) return;

    const toggleWrapper = sixBtn.closest('.pricing-toggle-wrapper');
    const toggleThumb = toggleWrapper && toggleWrapper.querySelector('.pricing-toggle-thumb');

    function parseINR(str) {
        return parseInt(String(str).replace(/,/g, ''), 10) || 0;
    }

    function formatINR(n) {
        return n.toLocaleString('en-IN');
    }

    function discountedFromMonthly(monthlyStr, discount) {
        const base = parseINR(monthlyStr);
        if (!base) return monthlyStr;
        return formatINR(Math.round(base * (1 - discount)));
    }

    function amountFromMonthly(monthlyStr, discount) {
        const base = parseINR(monthlyStr);
        if (!base) return 0;
        return Math.round(base * (1 - discount));
    }

    function updateToggleThumb(activeBtn) {
        if (!toggleThumb || !toggleWrapper || !activeBtn) return;

        var wrapperRect = toggleWrapper.getBoundingClientRect();
        var btnRect = activeBtn.getBoundingClientRect();
        var left = btnRect.left - wrapperRect.left;

        toggleThumb.style.width = btnRect.width + 'px';
        toggleThumb.style.transform = 'translate3d(' + left + 'px, 0, 0)';
    }

    function setActiveToggle(activeBtn, term) {
        sixBtn.classList.toggle('active', activeBtn === sixBtn);
        twelveBtn.classList.toggle('active', activeBtn === twelveBtn);
        requestAnimationFrame(function () {
            updateToggleThumb(activeBtn);
        });
        setBillingMode(term);
        // Dispatch event for height equalization
        window.dispatchEvent(new CustomEvent('pricing-mode-changed'));
    }

    // LAUNCH OFFER (active): flat discount across every paid plan, for the
    // first 6 months of the subscription — 40% on 6-month billing, 50% on
    // 12-month billing. After the launch window, standard rates resume:
    // a flat 10% on 6-month billing, and a per-plan cascade on 12-month
    // billing so higher tiers carry a bigger annual saving.
    var LAUNCH_DISCOUNT_6MO = 0.40;
    var LAUNCH_DISCOUNT_12MO = 0.50;
    var STANDARD_DISCOUNT_6MO = 0.10;
    var STANDARD_DISCOUNT_12MO_BY_PLAN = { classic: 0.15, premium: 0.20, pro: 0.25 };

    function discountFor(plan, isTwelve) {
        return isTwelve ? LAUNCH_DISCOUNT_12MO : LAUNCH_DISCOUNT_6MO;
    }

    function standardDiscountFor(plan, isTwelve) {
        if (!isTwelve) return STANDARD_DISCOUNT_6MO;
        return STANDARD_DISCOUNT_12MO_BY_PLAN[plan] || 0.15;
    }

    function setBillingMode(term) {
        const isTwelve = term === '12';
        const months = isTwelve ? 12 : 6;

        if (pricingSection) {
            pricingSection.classList.toggle('billing-twelve', isTwelve);
        }

        priceValues.forEach(function (pv) {
            const monthlyStr = pv.getAttribute('data-monthly');
            if (!monthlyStr) return;

            const plan = pv.getAttribute('data-plan');
            const discount = discountFor(plan, isTwelve);
            const stdDiscount = standardDiscountFor(plan, isTwelve);
            const newValue = discountedFromMonthly(monthlyStr, discount);

            const priceTag = pv.closest('.price-tag');
            const wasAmt = priceTag && priceTag.querySelector('.price-was-amount');
            const saveEl = priceTag && priceTag.querySelector('.price-annual-save');
            const saveBadge = priceTag && priceTag.querySelector('.price-save-badge');

            function applyUpdate() {
                pv.textContent = newValue;
                if (wasAmt) {
                    wasAmt.textContent = monthlyStr;
                }
                if (saveBadge) {
                    saveBadge.textContent = 'Save ' + Math.round(discount * 100) + '%';
                }
                if (saveEl) {
                    const billedTotal = amountFromMonthly(monthlyStr, discount) * months;
                    const stdPerMonth = amountFromMonthly(monthlyStr, stdDiscount);
                    saveEl.innerHTML = '<span class="billed-line">Billed ₹' + formatINR(billedTotal) + ' every ' + months + ' months</span><span class="standard-rate-line">₹' + formatINR(stdPerMonth) + '/mo standard rate after 6 months</span>';
                }
            }

            if (pv.textContent.trim() === newValue) return;

            pv.classList.add('price-value-transitioning');
            if (saveEl) saveEl.classList.add('price-save-transitioning');

            window.setTimeout(function () {
                applyUpdate();
                pv.classList.remove('price-value-transitioning');
                if (saveEl) saveEl.classList.remove('price-save-transitioning');
            }, 150);
        });
    }

    sixBtn.addEventListener('click', function () {
        if (sixBtn.classList.contains('active')) return;
        setActiveToggle(sixBtn, '6');
        if (window.digidrTrack) window.digidrTrack('pricing_billing_toggle', { period: '6_months' });
        if (window.digidrTag) window.digidrTag('billing_period', '6_months');
    });

    twelveBtn.addEventListener('click', function () {
        if (twelveBtn.classList.contains('active')) return;
        setActiveToggle(twelveBtn, '12');
        if (window.digidrTrack) window.digidrTrack('pricing_billing_toggle', { period: '12_months' });
        if (window.digidrTag) window.digidrTag('billing_period', '12_months');
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            var activeBtn = twelveBtn.classList.contains('active') ? twelveBtn : sixBtn;
            updateToggleThumb(activeBtn);
        }, 100);
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            updateToggleThumb(twelveBtn.classList.contains('active') ? twelveBtn : sixBtn);
        });
    }

    setActiveToggle(
        twelveBtn.classList.contains('active') ? twelveBtn : sixBtn,
        twelveBtn.classList.contains('active') ? '12' : '6'
    );
});

// Pricing view toggle: plan cards vs full comparison table
document.addEventListener('DOMContentLoaded', function () {
    const viewButtons = document.querySelectorAll('#pricing-view-toggle button');
    const cardsWrap = document.getElementById('pricing-cards-wrap');
    const compareWrap = document.getElementById('pricing-compare-wrap');
    if (!viewButtons.length || !cardsWrap || !compareWrap) return;

    viewButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            viewButtons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            const isCompare = btn.getAttribute('data-view') === 'compare';
            cardsWrap.classList.toggle('is-hidden', isCompare);
            compareWrap.classList.toggle('is-visible', isCompare);
            window.dispatchEvent(new CustomEvent('pricing-mode-changed'));
            if (window.digidrTrack) window.digidrTrack('pricing_view_toggle', { view: isCompare ? 'compare' : 'cards' });
        });
    });
});

// Home page FAQ accordion
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.faq-item').forEach(function (item) {
        const q = item.querySelector('.faq-q');
        const a = item.querySelector('.faq-a');
        if (!q || !a) return;
        q.addEventListener('click', function () {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
                if (openItem === item) return;
                openItem.classList.remove('open');
                openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
                openItem.querySelector('.faq-a').style.maxHeight = null;
            });
            if (isOpen) {
                item.classList.remove('open');
                q.setAttribute('aria-expanded', 'false');
                a.style.maxHeight = null;
            } else {
                item.classList.add('open');
                q.setAttribute('aria-expanded', 'true');
                a.style.maxHeight = a.scrollHeight + 'px';
                if (window.digidrTrack) {
                    var qText = item.querySelector('.faq-q-text');
                    window.digidrTrack('faq_toggle', { question: qText ? qText.textContent.trim() : '' });
                }
            }
        });
    });
});

// Mobile pricing card carousel
document.addEventListener('DOMContentLoaded', function () {
    const deck = document.querySelector('[data-pricing-card-deck]');
    if (!deck || !document.body.classList.contains('page-pricing')) return;

    const cards = Array.from(deck.children);
    const dots = Array.from(document.querySelectorAll('[data-pricing-carousel-dots] .pricing-carousel-dot'));
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    let scrollFrame = null;

    function updateDots() {
        if (!dots.length) return;

        const deckLeft = deck.getBoundingClientRect().left;
        const activeIndex = cards.reduce(function (closestIndex, card, index) {
            const currentDistance = Math.abs(card.getBoundingClientRect().left - deckLeft);
            const closestDistance = Math.abs(cards[closestIndex].getBoundingClientRect().left - deckLeft);
            return currentDistance < closestDistance ? index : closestIndex;
        }, 0);

        dots.forEach(function (dot, index) {
            dot.classList.toggle('is-active', index === activeIndex);
        });
    }

    function equalizePricingHeights() {
        const selectors = [
            '.plan-name',
            '.plan-subtitle',
            '.plan-description'
        ];

        // Reset heights first so they recalculate naturally
        selectors.forEach(selector => {
            cards.forEach(card => {
                const el = card.querySelector(selector);
                if (el) el.style.height = '';
            });
        });

        cards.forEach(card => {
            const groups = card.querySelectorAll('.pricing-feature-group');
            groups.forEach(group => {
                const cat = group.querySelector('.features-category');
                if (cat) cat.style.height = '';
                const rows = group.querySelectorAll('.pricing-feature-row');
                rows.forEach(row => {
                    row.style.height = '';
                });
            });
        });

        // Equalize simple elements
        selectors.forEach(selector => {
            let maxHeight = 0;
            cards.forEach(card => {
                const el = card.querySelector(selector);
                if (el) {
                    maxHeight = Math.max(maxHeight, el.offsetHeight);
                }
            });
            cards.forEach(card => {
                const el = card.querySelector(selector);
                if (el) {
                    el.style.height = maxHeight + 'px';
                }
            });
        });

        // Equalize feature groups headers and their individual rows by index
        if (cards[0]) {
            const firstCardGroups = cards[0].querySelectorAll('.pricing-feature-group');
            const numGroups = firstCardGroups.length;
            for (let g = 0; g < numGroups; g++) {
                // Equalize features category header for group g
                let maxCatHeight = 0;
                cards.forEach(card => {
                    const groups = card.querySelectorAll('.pricing-feature-group');
                    if (groups[g]) {
                        const cat = groups[g].querySelector('.features-category');
                        if (cat) {
                            maxCatHeight = Math.max(maxCatHeight, cat.offsetHeight);
                        }
                    }
                });
                cards.forEach(card => {
                    const groups = card.querySelectorAll('.pricing-feature-group');
                    if (groups[g]) {
                        const cat = groups[g].querySelector('.features-category');
                        if (cat) {
                            cat.style.height = maxCatHeight + 'px';
                        }
                    }
                });

                // Equalize each row inside group g
                if (firstCardGroups[g]) {
                    const firstCardGroupRows = firstCardGroups[g].querySelectorAll('.pricing-feature-row');
                    const numRows = firstCardGroupRows.length;
                    for (let r = 0; r < numRows; r++) {
                        let maxRowHeight = 0;
                        cards.forEach(card => {
                            const groups = card.querySelectorAll('.pricing-feature-group');
                            if (groups[g]) {
                                const rows = groups[g].querySelectorAll('.pricing-feature-row');
                                if (rows[r]) {
                                    maxRowHeight = Math.max(maxRowHeight, rows[r].offsetHeight);
                                }
                            }
                        });
                        cards.forEach(card => {
                            const groups = card.querySelectorAll('.pricing-feature-group');
                            if (groups[g]) {
                                const rows = groups[g].querySelectorAll('.pricing-feature-row');
                                if (rows[r]) {
                                    rows[r].style.height = maxRowHeight + 'px';
                                }
                            }
                        });
                    }
                }
            }
        }
    }

    function enableCarousel() {
        deck.classList.add('is-carousel-ready');
        deck.setAttribute('aria-roledescription', 'carousel');
        updateDots();
    }

    function disableCarousel() {
        deck.classList.remove('is-carousel-ready');
        deck.removeAttribute('aria-roledescription');

        cards.forEach(function (card) {
            card.removeAttribute('aria-hidden');
        });
    }

    function syncCarouselMode() {
        if (mobileQuery.matches) {
            enableCarousel();
        } else {
            disableCarousel();
        }
        equalizePricingHeights();
    }

    deck.addEventListener('scroll', function () {
        if (!mobileQuery.matches || scrollFrame) return;

        scrollFrame = requestAnimationFrame(function () {
            scrollFrame = null;
            updateDots();
        });
    }, { passive: true });

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            if (!mobileQuery.matches || !cards[index]) return;

            deck.scrollTo({
                left: cards[index].offsetLeft - deck.offsetLeft,
                behavior: 'smooth'
            });
            if (window.digidrTrack) window.digidrTrack('pricing_carousel_dot', { plan_index: index });
        });
    });

    window.addEventListener('resize', function () {
        syncCarouselMode();
        updateDots();
    });

    window.addEventListener('pricing-mode-changed', equalizePricingHeights);

    syncCarouselMode();
});

// Download modal (platform chooser)
document.addEventListener('DOMContentLoaded', function () {
    const mount = document.getElementById('downloadModalMount');
    const openButtons = document.querySelectorAll('[data-download-modal-open]');
    if (!mount || !openButtons.length) return;

    let modal = null;
    let lastFocusedElement = null;
    let previousBodyOverflow = '';

    function bindModalEvents() {
        modal = document.getElementById('downloadModal');
        if (!modal || modal.__downloadModalBound) return;

        modal.__downloadModalBound = true;

        modal.addEventListener('click', function (event) {
            if (event.target && event.target.closest('[data-download-modal-close]')) {
                closeModal();
            }
        });

        modal.addEventListener('click', function (event) {
            var webOption = event.target.closest('.download-modal-option--web');
            if (webOption && window.digidrTrack) {
                window.digidrTrack('download_modal_option_web');
                return;
            }
            var playOption = event.target.closest('.download-modal-option[href*="play.google.com"]');
            if (playOption && window.digidrTrack) {
                window.digidrTrack('download_modal_option_play');
            }
        });
    }

    function ensureModalLoaded() {
        if (document.getElementById('downloadModal')) {
            bindModalEvents();
            return Promise.resolve(modal);
        }

        return fetch('download-modal.html')
            .then(function (response) {
                if (!response.ok) throw new Error('Unable to load download modal');
                return response.text();
            })
            .then(function (html) {
                mount.innerHTML = html;
                bindModalEvents();
                return modal;
            })
            .catch(function () {
                console.error('Unable to load download-modal.html');
                return null;
            });
    }

    function openModal() {
        if (!modal) return;

        lastFocusedElement = document.activeElement;
        previousBodyOverflow = document.body.style.overflow;

        modal.classList.add('is-visible');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (window.digidrTrack) window.digidrTrack('download_modal_open');

        requestAnimationFrame(function () {
            modal.classList.add('is-open');
        });

        window.setTimeout(function () {
            const focusTarget = modal.querySelector('.download-modal-option:not(:disabled)') ||
                modal.querySelector('[data-download-modal-close]');
            if (focusTarget && focusTarget.focus) {
                focusTarget.focus();
            }
        }, 280);
    }

    function closeModal() {
        if (!modal) return;
        if (!modal.classList.contains('is-visible')) return;

        modal.classList.remove('is-open');

        window.setTimeout(function () {
            modal.classList.remove('is-visible');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = previousBodyOverflow;

            if (lastFocusedElement && lastFocusedElement.focus) {
                lastFocusedElement.focus();
            }
        }, 280);
    }

    openButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            ensureModalLoaded().then(function (loadedModal) {
                if (!loadedModal) return;
                openModal();
            });
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
});

// Testimonials Carousel Functionality (Continuous Super-Smooth Infinite Scroll Engine)
document.addEventListener('DOMContentLoaded', function () {
    const testimonialsCarousel = document.querySelector('.testimonials-carousel');
    if (!testimonialsCarousel) return;

    // 1. Prepare infinite loop clones
    const originalCards = Array.from(
        testimonialsCarousel.querySelectorAll('.testimonial-card:not(.testimonial-card-clone)')
    );
    const originalCount = originalCards.length;
    if (originalCount === 0) return;

    const firstCard = testimonialsCarousel.firstChild;
    originalCards.forEach(function (card) {
        const clone = card.cloneNode(true);
        clone.classList.add('testimonial-card-clone');
        clone.setAttribute('aria-hidden', 'true');
        testimonialsCarousel.insertBefore(clone, firstCard);
    });
    originalCards.forEach(function (card) {
        const clone = card.cloneNode(true);
        clone.classList.add('testimonial-card-clone');
        clone.setAttribute('aria-hidden', 'true');
        testimonialsCarousel.appendChild(clone);
    });

    function getAllCards() {
        return Array.from(testimonialsCarousel.querySelectorAll('.testimonial-card'));
    }
    let allCards = getAllCards();

    // 2. Padding to center the active card perfectly
    function updatePadding() {
        const cardWidth = allCards[originalCount].offsetWidth;
        const pad = Math.max(0, (testimonialsCarousel.clientWidth - cardWidth) / 2);
        testimonialsCarousel.style.paddingLeft = pad + 'px';
        testimonialsCarousel.style.paddingRight = pad + 'px';
    }

    function getBlockWidth() {
        if (allCards.length < originalCount * 2) return 0;
        return allCards[originalCount * 2].offsetLeft - allCards[originalCount].offsetLeft;
    }

    function centreScrollFor(card) {
        return card.offsetLeft - (testimonialsCarousel.clientWidth - card.offsetWidth) / 2;
    }

    // 3. Infinite loop seamless repositioning
    function checkBoundary() {
        const bw = getBlockWidth();
        if (bw === 0) return;
        const midStart = allCards[originalCount].offsetLeft;
        const midEnd = allCards[originalCount * 2].offsetLeft;
        const centre = testimonialsCarousel.scrollLeft + testimonialsCarousel.clientWidth / 2;

        if (centre < midStart) {
            testimonialsCarousel.scrollLeft += bw;
            if (targetCenterScroll !== null) targetCenterScroll += bw;
        } else if (centre >= midEnd) {
            testimonialsCarousel.scrollLeft -= bw;
            if (targetCenterScroll !== null) targetCenterScroll -= bw;
        }
    }

    // 4. Update active card (scales up center card)
    function updateActiveCard() {
        const centre = testimonialsCarousel.scrollLeft + testimonialsCarousel.clientWidth / 2;
        let bestCard = null;
        let minDistance = Infinity;

        allCards.forEach(function (card) {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const dist = Math.abs(cardCenter - centre);
            if (dist < minDistance) {
                minDistance = dist;
                bestCard = card;
            }
        });

        allCards.forEach(function (card) {
            card.classList.toggle('is-active', card === bestCard);
        });
    }

    // 5. Continuous RAF Animation Loop
    const baseSpeed = 0.85; // Speed of continuous scroll (px/frame)
    let currentSpeed = baseSpeed;
    let isHovered = false;
    let isDragging = false;
    let dragVelocity = 0;
    let targetCenterScroll = null;
    let isMovedDuringDrag = false;

    function animLoop() {
        if (isDragging) {
            // Dragging handled directly by event listeners
        } else if (targetCenterScroll !== null) {
            // Easing towards a specific clicked card
            const diff = targetCenterScroll - testimonialsCarousel.scrollLeft;
            if (Math.abs(diff) < 0.5) {
                testimonialsCarousel.scrollLeft = targetCenterScroll;
                targetCenterScroll = null;
            } else {
                testimonialsCarousel.scrollLeft += diff * 0.08;
            }
        } else if (Math.abs(dragVelocity) > 0.05) {
            // Flick momentum coasting
            testimonialsCarousel.scrollLeft += dragVelocity;
            dragVelocity *= 0.94; // friction
        } else {
            // Continuous auto-glide
            dragVelocity = 0;
            const targetSpeed = isHovered ? 0 : baseSpeed;
            currentSpeed += (targetSpeed - currentSpeed) * 0.08;
            testimonialsCarousel.scrollLeft += currentSpeed;
        }

        checkBoundary();
        updateActiveCard();
        requestAnimationFrame(animLoop);
    }

    // 6. Hover detection
    testimonialsCarousel.addEventListener('mouseenter', function () { isHovered = true; });
    testimonialsCarousel.addEventListener('mouseleave', function () { isHovered = false; });

    // 7. Mouse drag handlers
    let startX = 0;
    let startScrollLeft = 0;
    let lastX = 0;
    let lastTime = 0;

    testimonialsCarousel.addEventListener('mousedown', function (e) {
        isDragging = true;
        isMovedDuringDrag = false;
        targetCenterScroll = null;
        dragVelocity = 0;
        startX = e.clientX;
        lastX = e.clientX;
        lastTime = performance.now();
        startScrollLeft = testimonialsCarousel.scrollLeft;
        testimonialsCarousel.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 3) isMovedDuringDrag = true;

        testimonialsCarousel.scrollLeft = startScrollLeft - dx;

        const now = performance.now();
        const dt = Math.max(now - lastTime, 1);
        dragVelocity = (lastX - e.clientX) / dt * 14;
        lastX = e.clientX;
        lastTime = now;
    });

    window.addEventListener('mouseup', function () {
        if (!isDragging) return;
        isDragging = false;
        testimonialsCarousel.classList.remove('is-dragging');
    });

    // 8. Touch drag handlers
    testimonialsCarousel.addEventListener('touchstart', function (e) {
        isDragging = true;
        isMovedDuringDrag = false;
        targetCenterScroll = null;
        dragVelocity = 0;
        startX = e.touches[0].clientX;
        lastX = e.touches[0].clientX;
        lastTime = performance.now();
        startScrollLeft = testimonialsCarousel.scrollLeft;
    }, { passive: true });

    testimonialsCarousel.addEventListener('touchmove', function (e) {
        if (!isDragging) return;
        const touchX = e.touches[0].clientX;
        const dx = touchX - startX;
        if (Math.abs(dx) > 3) isMovedDuringDrag = true;

        testimonialsCarousel.scrollLeft = startScrollLeft - dx;

        const now = performance.now();
        const dt = Math.max(now - lastTime, 1);
        dragVelocity = (lastX - touchX) / dt * 14;
        lastX = touchX;
        lastTime = now;
    }, { passive: true });

    testimonialsCarousel.addEventListener('touchend', function () {
        if (!isDragging) return;
        isDragging = false;
    });

    // 9. Click card to center
    testimonialsCarousel.addEventListener('click', function (e) {
        if (isMovedDuringDrag) return;
        const card = e.target.closest('.testimonial-card');
        if (!card) return;
        targetCenterScroll = centreScrollFor(card);
    });

    // Initial setup
    updatePadding();
    const initialIndex = Math.floor(originalCount / 2);
    testimonialsCarousel.scrollLeft = centreScrollFor(originalCards[initialIndex]);
    updateActiveCard();
    window.addEventListener('resize', updatePadding);

    // Kick off animation loop
    requestAnimationFrame(animLoop);
});

// Smooth scroll for plain-text triggers (e.g. "Scroll To View Solution")
document.addEventListener('DOMContentLoaded', function () {
    var scrollTriggers = document.querySelectorAll('[data-scroll-target]');

    scrollTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var targetId = trigger.getAttribute('data-scroll-target');
            if (!targetId) return;

            var target = document.querySelector(targetId);
            if (!target) return;

            var navbar = document.querySelector('.navbar-custom');
            var offset = navbar ? navbar.getBoundingClientRect().height + 24 : 100;
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: top,
                behavior: 'smooth'
            });
        });
    });
});

// Smooth scroll to Go Digital / Contact section
(function () {
    var CONTACT_SCROLL_KEY = 'digidrScrollToContact';

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function scrollToContactSection() {
        var target = document.getElementById('contact');
        if (!target) return false;

        target.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'start'
        });
        return true;
    }

    function isContactNavLink(link) {
        var href = (link.getAttribute('href') || '').trim();
        return href === '#contact' || href === 'index.html#contact' || href.endsWith('/index.html#contact');
    }

    function shouldScrollToContactOnLoad() {
        return sessionStorage.getItem(CONTACT_SCROLL_KEY) === '1' || window.location.hash === '#contact';
    }

    function runContactScrollOnLoad() {
        if (!shouldScrollToContactOnLoad() || !document.getElementById('contact')) return;

        sessionStorage.removeItem(CONTACT_SCROLL_KEY);

        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        window.scrollTo(0, 0);

        function finishScroll() {
            scrollToContactSection();
            if (window.location.hash !== '#contact') {
                history.replaceState(null, '', '#contact');
            }
        }

        if (document.readyState === 'complete') {
            setTimeout(finishScroll, 100);
        } else {
            window.addEventListener('load', function () {
                setTimeout(finishScroll, 100);
            }, { once: true });
        }
    }

    document.addEventListener('DOMContentLoaded', runContactScrollOnLoad);

    document.addEventListener('click', function (event) {
        var link = event.target.closest('a');
        if (!link || !isContactNavLink(link)) return;

        var contactSection = document.getElementById('contact');

        if (contactSection) {
            event.preventDefault();
            scrollToContactSection();
            history.pushState(null, '', '#contact');

            var navbarLinks = document.getElementById('navbarLinks');
            var hamburgerMenu = document.getElementById('hamburgerMenu');
            if (navbarLinks) navbarLinks.classList.remove('active');
            if (hamburgerMenu) {
                hamburgerMenu.classList.remove('active');
                hamburgerMenu.setAttribute('aria-expanded', 'false');
            }
            return;
        }

        event.preventDefault();
        sessionStorage.setItem(CONTACT_SCROLL_KEY, '1');
        window.location.href = 'index.html';
    }, true);
})();

// ---------------------------------------------------------------------------
// Doctor Social Feed — live Facebook post widgets in the posts carousel
// One card per doctor, each showing that doctor's latest Facebook post.
// ---------------------------------------------------------------------------
(function () {
    const API_BASE = 'https://digidrapi.digidr.app';
    const MAX_DOCTORS = 20;          // how many doctors to check for posts
    const POSTS_PER_ACCOUNT = 3;     // posts to request per connected account
    const MAX_CARDS = 5;             // show one post each from the first 5 doctors who have posts
    const FB_GRAPH_VERSION = 'v23.0';// must be a supported Graph API version (see FB.init below)

    // Doctors to leave out of the carousel, by API slug. Removing a slug here
    // brings that doctor back with no other changes.
    const EXCLUDED_SLUGS = ['dr-samir-shah'];

    // Only surface posts this recent, so the carousel never shows stale activity.
    const MAX_POST_AGE_DAYS = 30;

    const carousel = document.getElementById('postsCarousel');
    if (!carousel) return;

    // --- Facebook SDK (loaded lazily, once) ---------------------------------
    let fbSdkPromise = null;
    function loadFacebookSdk() {
        if (fbSdkPromise) return fbSdkPromise;
        fbSdkPromise = new Promise(function (resolve, reject) {
            if (window.FB) { resolve(window.FB); return; }

            if (!document.getElementById('fb-root')) {
                const root = document.createElement('div');
                root.id = 'fb-root';
                document.body.insertBefore(root, document.body.firstChild);
            }

            window.fbAsyncInit = function () {
                // Keep this on a current Graph API version. Deprecated versions
                // do not fail loudly: the SDK still builds its iframes, but
                // facebook.com redirects them to a login page, so every embed
                // renders as a blank card. v21.0 was retired and did exactly
                // that. If posts ever go blank again, check this first.
                window.FB.init({ xfbml: false, version: FB_GRAPH_VERSION });
                resolve(window.FB);
            };

            const js = document.createElement('script');
            js.id = 'facebook-jssdk';
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            js.async = true;
            js.defer = true;
            js.crossOrigin = 'anonymous';
            js.onerror = function () { reject(new Error('Facebook SDK failed to load')); };
            document.head.appendChild(js);
        });
        return fbSdkPromise;
    }

    // Facebook video-post URLs use /videos/ in the path; photo and text posts
    // use /posts/. There is no type field in the API response, so the
    // permalink shape is the only signal available to tell them apart.
    // True when the post is recent enough to show. Posts with a missing or
    // unparseable createdAt are treated as too old rather than shown blindly.
    function isRecent(createdAt) {
        if (!createdAt) return false;
        const posted = new Date(createdAt).getTime();
        if (isNaN(posted)) return false;
        return (Date.now() - posted) <= MAX_POST_AGE_DAYS * 24 * 60 * 60 * 1000;
    }

    function isVideoPermalink(url) {
        return //videos//i.test(url);
    }

    // --- Data fetching ------------------------------------------------------
    // Retries once on failure: these calls are the difference between a full
    // carousel and an empty section, and mobile connections drop requests.
    function fetchJson(url, attempt) {
        return fetch(url, { headers: { 'Accept': 'application/json' } }).then(function (res) {
            if (!res.ok) throw new Error('Request failed: ' + res.status);
            return res.json();
        }).catch(function (err) {
            if ((attempt || 0) >= 1) throw err;
            return new Promise(function (resolve) { setTimeout(resolve, 1200); })
                .then(function () { return fetchJson(url, (attempt || 0) + 1); });
        });
    }

    function fetchDoctors() {
        return fetchJson(API_BASE + '/api/MicrositeSocialFeed').then(function (list) {
            if (!Array.isArray(list)) return [];
            return list.filter(function (d) {
                if (!d || !d.slug) return false;
                return EXCLUDED_SLUGS.indexOf(d.slug) === -1;
            });
        });
    }

    // Resolves to every Facebook post this doctor has, across all their accounts.
    // Doctors with no posts simply contribute nothing — no blank cards.
    function fetchDoctorPosts(doctor) {
        const url = API_BASE + '/api/MicrositeSocialFeed/' +
            encodeURIComponent(doctor.slug) + '?limit=' + POSTS_PER_ACCOUNT;

        return fetchJson(url).then(function (data) {
            if (!data || data.success === false || !Array.isArray(data.feeds)) return [];

            const entries = [];
            data.feeds.forEach(function (feed) {
                if (!feed || feed.platform !== 'facebook' || !Array.isArray(feed.posts)) return;
                feed.posts.forEach(function (post) {
                    if (!post || !post.permalink) return;
                    // Video posts autoplay inside Facebook's own cross-origin iframe,
                    // which our page has no way to mute or pause — so they are
                    // skipped rather than shown playing in a small carousel card.
                    if (isVideoPermalink(post.permalink)) return;
                    // Stale posts make the feed look abandoned, so drop anything
                    // older than the recency window.
                    if (!isRecent(post.createdAt)) return;
                    entries.push({
                        doctorName: (doctor.doctorName || '').trim(),
                        accountName: (feed.accountName || '').trim(),
                        permalink: post.permalink,
                        createdAt: post.createdAt || ''
                    });
                });
            });
            // Newest first, so the card shows this doctor's most recent post
            // regardless of the order the API returned their accounts in.
            entries.sort(function (a, b) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            return entries;
        }).catch(function () {
            return [];   // one doctor failing must not break the carousel
        });
    }

    // --- Card rendering -----------------------------------------------------
    // The embed iframe needs an explicit pixel width, so it is read from CSS.
    function getEmbedWidth() {
        const raw = getComputedStyle(carousel).getPropertyValue('--post-card-width');
        const width = parseInt(raw, 10);
        return isNaN(width) ? 300 : width;
    }

    function buildCard(entry, width) {
        const item = document.createElement('div');
        item.className = 'post-item post-item-social';

        // Rendered by the Facebook JS SDK. The plugin URL cannot be used as a
        // direct iframe src: it responds with X-Frame-Options: DENY, so the
        // browser refuses to display it however the request is shaped.
        const embed = document.createElement('div');
        embed.className = 'fb-post';
        embed.setAttribute('data-href', entry.permalink);
        embed.setAttribute('data-width', String(width));
        embed.setAttribute('data-show-text', 'true');

        // Shown if the SDK is blocked or the post cannot be embedded.
        const fallback = document.createElement('blockquote');
        fallback.className = 'fb-xfbml-parse-ignore';
        fallback.setAttribute('cite', entry.permalink);
        const link = document.createElement('a');
        link.href = entry.permalink;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'View this post on Facebook';
        fallback.appendChild(link);
        embed.appendChild(fallback);

        const body = document.createElement('div');
        body.className = 'post-item-body';
        body.appendChild(embed);
        item.appendChild(body);

        return item;
    }

    function renderCards(entries) {
        const width = getEmbedWidth();
        const fragment = document.createDocumentFragment();

        entries.forEach(function (entry) {
            fragment.appendChild(buildCard(entry, width));
        });

        carousel.innerHTML = '';
        carousel.appendChild(fragment);
        carousel.classList.remove('is-loading');
        carousel.removeAttribute('aria-busy');
    }

    function showError() {
        carousel.classList.remove('is-loading');
        carousel.classList.add('is-empty');
        carousel.removeAttribute('aria-busy');
        carousel.innerHTML =
            '<div class="posts-carousel-status">Posts are taking a moment to load. Please refresh to try again.</div>';
    }

    // --- Orchestration ------------------------------------------------------
    let started = false;

    function start() {
        if (started) return;
        started = true;

        fetchDoctors()
            .then(function (doctors) {
                const selected = doctors.slice(0, MAX_DOCTORS);
                return Promise.all(selected.map(fetchDoctorPosts));
            })
            .then(function (results) {
                // One post per doctor — their latest — from the doctors who
                // posted most recently, so the carousel leads with live activity.
                const entries = results
                    .filter(function (g) { return Array.isArray(g) && g.length; })
                    .map(function (g) { return g[0]; })
                    .sort(function (a, b) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    })
                    .slice(0, MAX_CARDS);
                if (!entries.length) { showError(); return; }

                renderCards(entries);

                // Cards are sized by CSS, so the carousel can start straight
                // away; the embeds fill in as the SDK parses them.
                return loadFacebookSdk()
                    .then(function (FB) { FB.XFBML.parse(carousel); })
                    .catch(function () { /* fallback links already rendered */ })
                    .then(function () {
                        if (typeof initPostsCarousel === 'function') initPostsCarousel();
                    });
            })
            .catch(function () {
                showError();
            });
    }

    // Only fetch once the carousel is close to the viewport.
    function observe() {
        if (!('IntersectionObserver' in window)) { start(); return; }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    start();
                }
            });
        }, { rootMargin: '400px 0px' });

        observer.observe(carousel);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observe);
    } else {
        observe();
    }
})();
