function getStoreUrl(store) {
  if (store === "app") return "/";
  if (store === "web") return "/";
  return "/";
}

// Function to handle app download based on device
function downloadApp(store) {
    if (store === "app" || store === "web") {
        window.location.href = getStoreUrl(store);
        return;
    }

    var ua = navigator.userAgent || navigator.vendor || window.opera;

    // ANDROID DEVICE
    if (/android/i.test(ua)) {
        window.location.href = getStoreUrl("play");
    }
    // iOS DEVICE (iPhone / iPad)
    else if (/iPhone|iPad|iPod/i.test(ua)) {
        window.location.href = getStoreUrl("app");
    }
    // DESKTOP OR OTHER DEVICES - Redirect to Google Play Store
    else {
        window.location.href = getStoreUrl("play");
    }
}

function isAppDownloadButton(button) {
    return button && !button.classList.contains('nav-cta-btn');
}

function handleDownloadClick(event) {
    const button = event.currentTarget.closest(".btn-download, .download-btn");
    if (!isAppDownloadButton(button)) return;
    event.preventDefault();
    const store = button?.dataset.store;
    downloadApp(store);
}

// Add event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to all download buttons
    const downloadButtons = document.querySelectorAll('.download-btn, .btn-download');
    downloadButtons.forEach(button => {
        if (isAppDownloadButton(button)) {
            button.addEventListener('click', handleDownloadClick);
        }
    });

    // Add click event to floating download button
    const floatingDownloadBtn = document.getElementById('floatingDownloadBtn');
    if (floatingDownloadBtn) {
        floatingDownloadBtn.addEventListener('click', downloadApp);
    }
});

// Handle dynamically added content (for modals)
document.addEventListener('click', function(event) {
    const button = event.target.closest('.download-btn, .btn-download');
    if (isAppDownloadButton(button)) {
        event.preventDefault();
        downloadApp(button.dataset.store);
    }
});
