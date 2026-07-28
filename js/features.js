document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.features-page-offers-nav');
    if (!nav) return;

    const entries = nav.querySelectorAll('.features-page-offers-entry');
    const items = nav.querySelectorAll('.features-page-offers-item');
    const stack = document.getElementById('featuresOffersStack');
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    let currentPanelIndex = -1;
    let panelUpdateTimer;

    if (!entries.length) return;

    function isMobile() {
        return mobileQuery.matches;
    }

    function parseBullets(raw) {
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function getEntry(item) {
        return item.closest('.features-page-offers-entry');
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function buildContentMarkup(item) {
        const panelTitle = item.getAttribute('data-panel-title');
        const description = item.getAttribute('data-description') || '';
        const bullets = parseBullets(item.getAttribute('data-bullets'));

        let html = '';

        if (panelTitle) {
            html += '<h4 class="features-page-offers-panel-heading">' + escapeHtml(panelTitle) + '</h4>';
        }

        if (description) {
            html += '<p class="features-page-offers-panel-text">' + escapeHtml(description) + '</p>';
        }

        if (bullets.length) {
            html += '<ul class="features-page-offers-panel-list">';
            bullets.forEach(function (text) {
                html += '<li>' + escapeHtml(text) + '</li>';
            });
            html += '</ul>';
        }

        return html;
    }

    function renderInlineBody(item) {
        const entry = getEntry(item);
        if (!entry) return;

        const inline = entry.querySelector('.features-page-offers-inline-body');
        if (!inline) return;

        inline.innerHTML = buildContentMarkup(item);
    }

    function setExpanded(item, expanded) {
        item.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    function setActivePanel(index) {
        if (!stack) return;

        const numericIndex = Number(index);
        const item = items[numericIndex];
        const panel = stack.querySelector('.features-page-offers-stack-panel');
        const content = panel ? panel.querySelector('.features-page-offers-stack-panel-content') : null;

        if (!item || !panel || !content || numericIndex === currentPanelIndex) return;

        currentPanelIndex = numericIndex;
        window.clearTimeout(panelUpdateTimer);
        panel.classList.add('is-current', 'is-updating');

        panelUpdateTimer = window.setTimeout(function () {
            content.innerHTML = buildContentMarkup(item);
            window.requestAnimationFrame(function () {
                panel.classList.remove('is-updating');
            });
        }, 180);
    }

    function setActiveNav(item) {
        const entry = getEntry(item);
        const panelIndex = item.getAttribute('data-panel-index');

        entries.forEach(function (currentEntry) {
            const btn = currentEntry.querySelector('.features-page-offers-item');
            const isTarget = currentEntry === entry;

            currentEntry.classList.toggle('is-active', isTarget);

            if (btn) {
                btn.classList.toggle('is-active', isTarget);
                btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
                setExpanded(btn, isTarget);
            }
        });

        if (panelIndex !== null) {
            setActivePanel(panelIndex);
        }
    }

    function collapseAll() {
        entries.forEach(function (entry) {
            entry.classList.remove('is-active');
            const btn = entry.querySelector('.features-page-offers-item');
            const inline = entry.querySelector('.features-page-offers-inline-body');

            if (btn) {
                btn.classList.remove('is-active');
                btn.setAttribute('aria-selected', 'false');
                setExpanded(btn, false);
            }

            if (inline) inline.hidden = true;
        });
    }

    function selectMobileItem(item) {
        const entry = getEntry(item);
        const wasActive = item.classList.contains('is-active');

        if (wasActive) {
            collapseAll();
            return;
        }

        entries.forEach(function (currentEntry) {
            const btn = currentEntry.querySelector('.features-page-offers-item');
            const inline = currentEntry.querySelector('.features-page-offers-inline-body');
            const isTarget = currentEntry === entry;

            currentEntry.classList.toggle('is-active', isTarget);

            if (btn) {
                btn.classList.toggle('is-active', isTarget);
                btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
                setExpanded(btn, isTarget);
            }

            if (inline) {
                if (isTarget) {
                    renderInlineBody(item);
                    inline.hidden = false;
                } else {
                    inline.hidden = true;
                }
            }
        });

        window.requestAnimationFrame(function () {
            entry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    function buildStack() {
        if (!stack) return;
        stack.innerHTML = '';

        const initialItem = nav.querySelector('.features-page-offers-item.is-active') || items[0];

        items.forEach(function (item, index) {
            item.setAttribute('data-panel-index', String(index));
        });

        const panel = document.createElement('article');
        panel.className = 'features-page-offers-stack-panel is-current';
        panel.innerHTML =
            '<div class="features-page-offers-stack-panel-content">' +
            buildContentMarkup(initialItem) +
            '</div>';

        stack.appendChild(panel);
    }

    function setupScrollSync() {
        // Disabling scroll synchronization to enable clean static tab behavior
    }

    items.forEach(function (item) {
        item.addEventListener('click', function () {
            if (isMobile()) {
                selectMobileItem(item);
                return;
            }

            setActiveNav(item);
        });
    });

    buildStack();
    setupScrollSync();

    const initial = nav.querySelector('.features-page-offers-item.is-active') || items[0];
    if (initial) {
        if (isMobile()) {
            entries.forEach(function (entry) {
                const btn = entry.querySelector('.features-page-offers-item');
                const inline = entry.querySelector('.features-page-offers-inline-body');
                const isTarget = entry === getEntry(initial);

                entry.classList.toggle('is-active', isTarget);

                if (btn) {
                    btn.classList.toggle('is-active', isTarget);
                    btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
                    setExpanded(btn, isTarget);
                }

                if (inline) {
                    if (isTarget) {
                        renderInlineBody(initial);
                        inline.hidden = false;
                    } else {
                        inline.hidden = true;
                    }
                }
            });
        } else {
            setActiveNav(initial);
        }
    }

    mobileQuery.addEventListener('change', function () {
        const active = nav.querySelector('.features-page-offers-item.is-active') || items[0];
        if (!active) return;

        if (isMobile()) {
            renderInlineBody(active);
            entries.forEach(function (entry) {
                const btn = entry.querySelector('.features-page-offers-item');
                const isTarget = entry === getEntry(active);
                if (btn) btn.setAttribute('aria-expanded', isTarget ? 'true' : 'false');
            });
        } else {
            entries.forEach(function (entry) {
                const inline = entry.querySelector('.features-page-offers-inline-body');
                if (inline) inline.hidden = true;
            });
            setActiveNav(active);
        }
    });
});
