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
        '.pricing-section .pricing-toggle-container',
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
    pillMenu.classList.toggle('active');
}

// Posts Carousel — Continuous Super-Smooth Infinite Scroll Engine
document.addEventListener('DOMContentLoaded', function () {
    const postsCarousel = document.querySelector('.posts-carousel');
    if (!postsCarousel) return;

    // 1. Prepare infinite loop clones
    const originalItems = Array.from(postsCarousel.querySelectorAll('.post-item:not(.post-item-clone)'));
    const originalCount = originalItems.length;
    if (originalCount === 0) return;

    originalItems.forEach(function (item) {
        const clone = item.cloneNode(true);
        clone.classList.add('post-item-clone');
        clone.setAttribute('aria-hidden', 'true');
        postsCarousel.insertBefore(clone, postsCarousel.firstChild);
    });
    originalItems.forEach(function (item) {
        const clone = item.cloneNode(true);
        clone.classList.add('post-item-clone');
        clone.setAttribute('aria-hidden', 'true');
        postsCarousel.appendChild(clone);
    });

    function getAllItems() {
        return Array.from(postsCarousel.querySelectorAll('.post-item'));
    }
    let allItems = getAllItems();

    // 2. Padding to center the active card perfectly
    function updatePadding() {
        const itemWidth = allItems[originalCount].offsetWidth;
        const pad = Math.max(0, (postsCarousel.clientWidth - itemWidth) / 2);
        postsCarousel.style.paddingLeft = pad + 'px';
        postsCarousel.style.paddingRight = pad + 'px';
    }

    function getBlockWidth() {
        if (allItems.length < originalCount * 2) return 0;
        return allItems[originalCount * 2].offsetLeft - allItems[originalCount].offsetLeft;
    }

    function centreScrollFor(item) {
        return item.offsetLeft - (postsCarousel.clientWidth - item.offsetWidth) / 2;
    }

    // 3. Infinite loop seamless repositioning
    function checkBoundary() {
        const bw = getBlockWidth();
        if (bw === 0) return;
        const midStart = allItems[originalCount].offsetLeft;
        const midEnd = allItems[originalCount * 2].offsetLeft;
        const centre = postsCarousel.scrollLeft + postsCarousel.clientWidth / 2;

        if (centre < midStart) {
            postsCarousel.scrollLeft += bw;
            if (targetCenterScroll !== null) targetCenterScroll += bw;
        } else if (centre >= midEnd) {
            postsCarousel.scrollLeft -= bw;
            if (targetCenterScroll !== null) targetCenterScroll -= bw;
        }
    }

    // 4. Update active card (scales up & glows center card)
    function updateActiveCard() {
        const centre = postsCarousel.scrollLeft + postsCarousel.clientWidth / 2;
        let bestItem = null;
        let minDistance = Infinity;

        allItems.forEach(function (item) {
            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            const dist = Math.abs(itemCenter - centre);
            if (dist < minDistance) {
                minDistance = dist;
                bestItem = item;
            }
        });

        allItems.forEach(function (item) {
            item.classList.toggle('is-active', item === bestItem);
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
            const diff = targetCenterScroll - postsCarousel.scrollLeft;
            if (Math.abs(diff) < 0.5) {
                postsCarousel.scrollLeft = targetCenterScroll;
                targetCenterScroll = null;
            } else {
                postsCarousel.scrollLeft += diff * 0.08;
            }
        } else if (Math.abs(dragVelocity) > 0.05) {
            // Flick momentum coasting
            postsCarousel.scrollLeft += dragVelocity;
            dragVelocity *= 0.94; // friction
        } else {
            // Continuous auto-glide
            dragVelocity = 0;
            const targetSpeed = isHovered ? 0 : baseSpeed;
            currentSpeed += (targetSpeed - currentSpeed) * 0.08;
            postsCarousel.scrollLeft += currentSpeed;
        }

        checkBoundary();
        updateActiveCard();
        requestAnimationFrame(animLoop);
    }

    // 6. Hover detection
    postsCarousel.addEventListener('mouseenter', function () { isHovered = true; });
    postsCarousel.addEventListener('mouseleave', function () { isHovered = false; });

    // 7. Mouse drag handlers
    let startX = 0;
    let startScrollLeft = 0;
    let lastX = 0;
    let lastTime = 0;

    postsCarousel.addEventListener('mousedown', function (e) {
        isDragging = true;
        isMovedDuringDrag = false;
        targetCenterScroll = null;
        dragVelocity = 0;
        startX = e.clientX;
        lastX = e.clientX;
        lastTime = performance.now();
        startScrollLeft = postsCarousel.scrollLeft;
        postsCarousel.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 3) isMovedDuringDrag = true;

        postsCarousel.scrollLeft = startScrollLeft - dx;

        const now = performance.now();
        const dt = Math.max(now - lastTime, 1);
        dragVelocity = (lastX - e.clientX) / dt * 14;
        lastX = e.clientX;
        lastTime = now;
    });

    window.addEventListener('mouseup', function () {
        if (!isDragging) return;
        isDragging = false;
        postsCarousel.classList.remove('is-dragging');
    });

    // 8. Touch drag handlers
    postsCarousel.addEventListener('touchstart', function (e) {
        isDragging = true;
        isMovedDuringDrag = false;
        targetCenterScroll = null;
        dragVelocity = 0;
        startX = e.touches[0].clientX;
        lastX = e.touches[0].clientX;
        lastTime = performance.now();
        startScrollLeft = postsCarousel.scrollLeft;
    }, { passive: true });

    postsCarousel.addEventListener('touchmove', function (e) {
        if (!isDragging) return;
        const touchX = e.touches[0].clientX;
        const dx = touchX - startX;
        if (Math.abs(dx) > 3) isMovedDuringDrag = true;

        postsCarousel.scrollLeft = startScrollLeft - dx;

        const now = performance.now();
        const dt = Math.max(now - lastTime, 1);
        dragVelocity = (lastX - touchX) / dt * 14;
        lastX = touchX;
        lastTime = now;
    }, { passive: true });

    postsCarousel.addEventListener('touchend', function () {
        isDragging = false;
    });

    // Prevent default browser image drag behavior
    postsCarousel.addEventListener('dragstart', function (e) { e.preventDefault(); });

    // 9. Click card to center
    postsCarousel.addEventListener('click', function (e) {
        if (isMovedDuringDrag) return;
        const item = e.target.closest('.post-item');
        if (!item) return;
        targetCenterScroll = centreScrollFor(item);
    });

    // 10. Handle window resize
    window.addEventListener('resize', function () {
        allItems = getAllItems();
        updatePadding();
    });

    // Initialization
    updatePadding();
    const initialTarget = allItems[originalCount + Math.floor(originalCount / 2)];
    if (initialTarget) {
        postsCarousel.scrollLeft = centreScrollFor(initialTarget);
    }
    updateActiveCard();
    requestAnimationFrame(animLoop);
});


// Pricing Toggle (Monthly/Yearly) — yearly = 20% off monthly rate
document.addEventListener('DOMContentLoaded', function () {
    const monthlyBtn = document.getElementById('monthlyBtn');
    const yearlyBtn = document.getElementById('yearlyBtn');
    const pricingSection = document.getElementById('pricing');
    const priceValues = document.querySelectorAll('.price-value');

    if (!monthlyBtn || !yearlyBtn) return;

    const toggleWrapper = monthlyBtn.closest('.pricing-toggle-wrapper');
    const toggleThumb = toggleWrapper && toggleWrapper.querySelector('.pricing-toggle-thumb');

    function parseINR(str) {
        return parseInt(String(str).replace(/,/g, ''), 10) || 0;
    }

    function formatINR(n) {
        return n.toLocaleString('en-IN');
    }

    function yearlyFromMonthly(monthlyStr) {
        const base = parseINR(monthlyStr);
        if (!base) return monthlyStr;
        return formatINR(Math.round(base * 0.8));
    }

    function updateToggleThumb(activeBtn) {
        if (!toggleThumb || !toggleWrapper || !activeBtn) return;

        var wrapperRect = toggleWrapper.getBoundingClientRect();
        var btnRect = activeBtn.getBoundingClientRect();
        var left = btnRect.left - wrapperRect.left;

        toggleThumb.style.width = btnRect.width + 'px';
        toggleThumb.style.transform = 'translate3d(' + left + 'px, 0, 0)';
    }

    function setActiveToggle(activeBtn, isYearly) {
        monthlyBtn.classList.toggle('active', activeBtn === monthlyBtn);
        yearlyBtn.classList.toggle('active', activeBtn === yearlyBtn);
        requestAnimationFrame(function () {
            updateToggleThumb(activeBtn);
        });
        setBillingMode(isYearly);
        // Dispatch event for height equalization
        window.dispatchEvent(new CustomEvent('pricing-mode-changed'));
    }

    function setBillingMode(isYearly) {
        if (pricingSection) {
            pricingSection.classList.toggle('billing-yearly', isYearly);
        }

        priceValues.forEach(function (pv) {
            const monthlyStr = pv.getAttribute('data-monthly');
            if (!monthlyStr) return;

            if (isYearly) {
                pv.textContent = yearlyFromMonthly(monthlyStr);
            } else {
                pv.textContent = monthlyStr;
            }

            const wasAmt = pv.closest('.price-tag') && pv.closest('.price-tag').querySelector('.price-was-amount');
            if (wasAmt) {
                wasAmt.textContent = monthlyStr;
            }
        });
    }

    monthlyBtn.addEventListener('click', function () {
        if (monthlyBtn.classList.contains('active')) return;
        setActiveToggle(monthlyBtn, false);
    });

    yearlyBtn.addEventListener('click', function () {
        if (yearlyBtn.classList.contains('active')) return;
        setActiveToggle(yearlyBtn, true);
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            var activeBtn = monthlyBtn.classList.contains('active') ? monthlyBtn : yearlyBtn;
            updateToggleThumb(activeBtn);
        }, 100);
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            updateToggleThumb(monthlyBtn.classList.contains('active') ? monthlyBtn : yearlyBtn);
        });
    }

    setActiveToggle(
        yearlyBtn.classList.contains('active') ? yearlyBtn : monthlyBtn,
        yearlyBtn.classList.contains('active')
    );
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
            '.plan-description',
            '.price-tag'
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

    originalCards.forEach(function (card) {
        const clone = card.cloneNode(true);
        clone.classList.add('testimonial-card-clone');
        clone.setAttribute('aria-hidden', 'true');
        testimonialsCarousel.insertBefore(clone, testimonialsCarousel.firstChild);
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