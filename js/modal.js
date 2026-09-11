(function () {
    var MODAL_TRANSITION_MS = 280;

    function setupMissionModal() {
        var mount = document.getElementById('modalMount');
        var openBtns = document.querySelectorAll('[data-open-mission-modal]');
        var legacyOpenBtn = document.getElementById('openMissionModal');

        if (legacyOpenBtn) {
            openBtns = Array.prototype.slice.call(openBtns);
            openBtns.push(legacyOpenBtn);
        }

        if (!mount) {
            mount = document.createElement('div');
            mount.id = 'modalMount';
            document.body.appendChild(mount);
        }

        if (!openBtns || openBtns.length === 0) return;

        var lastFocusedElement = null;
        var previousBodyOverflow = '';
        var closeTimer = null;

        function finishClose(modal) {
            if (!modal || !modal.classList.contains('is-visible')) return;

            modal.classList.remove('is-visible');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = previousBodyOverflow;

            if (lastFocusedElement && lastFocusedElement.focus) {
                lastFocusedElement.focus();
            } else if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
        }

        function setOpen(isOpen) {
            var modal = document.getElementById('missionModal');
            if (!modal) return;

            if (isOpen) {
                if (modal.classList.contains('is-open')) return;

                if (closeTimer) {
                    clearTimeout(closeTimer);
                    closeTimer = null;
                }

                lastFocusedElement = document.activeElement;
                modal.classList.add('is-visible');
                modal.setAttribute('aria-hidden', 'false');
                if (window.digidrTrack) window.digidrTrack('mission_modal_open');
                previousBodyOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';

                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        modal.classList.add('is-open');
                    });
                });

                window.setTimeout(function () {
                    var focusTarget = modal.querySelector('.digidr-modal__close') ||
                        modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (focusTarget && focusTarget.focus) {
                        focusTarget.focus();
                    }
                }, MODAL_TRANSITION_MS);
            } else {
                if (!modal.classList.contains('is-visible')) return;

                modal.classList.remove('is-open');

                if (closeTimer) clearTimeout(closeTimer);

                var dialog = modal.querySelector('.digidr-modal__dialog');
                var didFinish = false;

                function completeClose() {
                    if (didFinish) return;
                    didFinish = true;
                    if (closeTimer) {
                        clearTimeout(closeTimer);
                        closeTimer = null;
                    }
                    if (dialog) {
                        dialog.removeEventListener('transitionend', onTransitionEnd);
                    }
                    finishClose(modal);
                }

                function onTransitionEnd(e) {
                    if (dialog && e.target !== dialog) return;
                    completeClose();
                }

                if (dialog) {
                    dialog.addEventListener('transitionend', onTransitionEnd);
                }

                closeTimer = window.setTimeout(completeClose, MODAL_TRANSITION_MS + 50);
            }
        }

        function initCustomSelects(root) {
            var wrappers = (root || document).querySelectorAll('[data-custom-select]');

            Array.prototype.forEach.call(wrappers, function (wrapper) {
                if (wrapper.__digidrSelectBound) return;
                wrapper.__digidrSelectBound = true;

                var select = wrapper.querySelector('.go-digital-select__native');
                var trigger = wrapper.querySelector('.go-digital-select__trigger');
                var valueEl = wrapper.querySelector('.go-digital-select__value');
                var menu = wrapper.querySelector('.go-digital-select__menu');
                if (!select || !trigger || !valueEl || !menu) return;

                var placeholderText = '';
                var activeIndex = -1;

                Array.prototype.forEach.call(select.options, function (option) {
                    if (!option.value && option.disabled) {
                        placeholderText = option.textContent.trim();
                        return;
                    }

                    var item = document.createElement('li');
                    item.className = 'go-digital-select__option';
                    item.setAttribute('role', 'option');
                    item.setAttribute('tabindex', '-1');
                    item.dataset.value = option.value;
                    item.textContent = option.textContent.trim();
                    menu.appendChild(item);
                });

                if (!placeholderText) {
                    placeholderText = 'Select your speciality';
                }

                function getItems() {
                    return Array.prototype.slice.call(menu.querySelectorAll('.go-digital-select__option'));
                }

                function setOpen(isOpen) {
                    wrapper.classList.toggle('is-open', isOpen);
                    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                    menu.hidden = !isOpen;

                    if (!isOpen) {
                        activeIndex = -1;
                        getItems().forEach(function (item) {
                            item.classList.remove('is-focused');
                        });
                    }
                }

                function setValue(value, label) {
                    select.value = value;
                    valueEl.textContent = label;
                    valueEl.classList.toggle('is-placeholder', !value);

                    getItems().forEach(function (item) {
                        item.classList.toggle('is-selected', item.dataset.value === value);
                        item.setAttribute('aria-selected', item.dataset.value === value ? 'true' : 'false');
                    });
                }

                function selectItem(item) {
                    if (!item) return;
                    setValue(item.dataset.value, item.textContent.trim());
                    setOpen(false);
                    trigger.focus();
                }

                function focusItemAt(index) {
                    var items = getItems();
                    if (!items.length) return;

                    items.forEach(function (item) {
                        item.classList.remove('is-focused');
                    });

                    if (index < 0) index = items.length - 1;
                    if (index >= items.length) index = 0;

                    activeIndex = index;
                    items[activeIndex].classList.add('is-focused');
                    items[activeIndex].scrollIntoView({ block: 'nearest' });
                }

                if (select.value) {
                    var selectedOption = select.options[select.selectedIndex];
                    if (selectedOption && selectedOption.value) {
                        setValue(selectedOption.value, selectedOption.textContent.trim());
                    }
                }

                trigger.addEventListener('click', function () {
                    setOpen(!wrapper.classList.contains('is-open'));
                });

                menu.addEventListener('click', function (e) {
                    var item = e.target.closest('.go-digital-select__option');
                    if (item) selectItem(item);
                });

                trigger.addEventListener('keydown', function (e) {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                    }

                    if ((e.key === 'Enter' || e.key === ' ') && !wrapper.classList.contains('is-open')) {
                        setOpen(true);
                        focusItemAt(activeIndex >= 0 ? activeIndex : 0);
                        return;
                    }

                    if (!wrapper.classList.contains('is-open')) return;

                    if (e.key === 'ArrowDown') {
                        focusItemAt(activeIndex + 1);
                    } else if (e.key === 'ArrowUp') {
                        focusItemAt(activeIndex - 1);
                    } else if (e.key === 'Enter' || e.key === ' ') {
                        var items = getItems();
                        if (activeIndex >= 0 && items[activeIndex]) {
                            selectItem(items[activeIndex]);
                        }
                    } else if (e.key === 'Escape') {
                        setOpen(false);
                    }
                });

                document.addEventListener('click', function (e) {
                    if (!wrapper.contains(e.target)) {
                        setOpen(false);
                    }
                });

                select.addEventListener('change', function () {
                    var option = select.options[select.selectedIndex];
                    if (option && option.value) {
                        setValue(option.value, option.textContent.trim());
                    } else {
                        valueEl.textContent = placeholderText;
                        valueEl.classList.add('is-placeholder');
                    }
                });
            });
        }

        function bindModalEvents() {
            var modal = document.getElementById('missionModal');
            if (!modal) return;

            if (modal.__digidrBound) return;
            modal.__digidrBound = true;

            initCustomSelects(modal);

            var form = modal.querySelector('form');
            if (form) {
                form.addEventListener('submit', function () {
                    if (window.digidrTrack) window.digidrTrack('mission_form_submit');
                });
            }

            modal.addEventListener('click', function (e) {
                var target = e.target;
                if (target && target.closest && target.closest('[data-modal-close]')) {
                    setOpen(false);
                }
            });

            document.addEventListener('keydown', function (e) {
                if (e.key !== 'Escape') return;
                var activeModal = document.getElementById('missionModal');
                if (activeModal && activeModal.classList.contains('is-open')) {
                    setOpen(false);
                }
            });
        }

        function ensureModalLoaded() {
            if (document.getElementById('missionModal')) return Promise.resolve();

            return fetch('modal.html')
                .then(function (res) { return res.text(); })
                .then(function (html) {
                    mount.innerHTML = html;
                    bindModalEvents();
                    initCustomSelects(mount);
                })
                .catch(function () {
                    console.error('Unable to load modal.html');
                });
        }

        Array.prototype.forEach.call(openBtns, function (btn) {
            if (!btn || btn.__digidrOpenBound) return;
            btn.__digidrOpenBound = true;

            btn.addEventListener('click', function (e) {
                if (btn.tagName && btn.tagName.toLowerCase() === 'a') {
                    e.preventDefault();
                }

                lastFocusedElement = btn;
                ensureModalLoaded().then(function () {
                    setOpen(true);
                });
            });
        });

        ensureModalLoaded();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMissionModal);
    } else {
        setupMissionModal();
    }
})();
