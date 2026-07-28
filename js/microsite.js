(function () {
    var wrap = document.querySelector('.ms-showcase-frame-wrap');
    if (wrap) {
        function revealShowcase() {
            wrap.classList.add('ms-showcase-inview');
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            revealShowcase();
        } else {
            requestAnimationFrame(function () {
                requestAnimationFrame(revealShowcase);
            });
        }
    }

    var carouselEl = document.getElementById('msShowcaseCarousel');
    var urlEl = document.querySelector('.ms-showcase-url');
    if (!carouselEl || !urlEl) return;

    function updateUrlFromSlide(slideEl) {
        if (!slideEl) return;
        var url = slideEl.getAttribute('data-url');
        if (url) urlEl.textContent = url;
    }

    carouselEl.addEventListener('slid.bs.carousel', function (event) {
        updateUrlFromSlide(event.relatedTarget);
    });

    updateUrlFromSlide(carouselEl.querySelector('.carousel-item.active'));
})();
