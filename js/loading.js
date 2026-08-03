// ⏳ SCRIPT DE CARGA

(function() {
    'use strict';

    const CONFIG = {
        loadingPage: 'loading.html',
        excludePaths: ['loading.html', 'checkout.html', 'payment-success.html'],
        delay: 300
    };

    function showLoading() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        if (CONFIG.excludePaths.includes(currentPath)) return true;
        sessionStorage.setItem('redirectUrl', window.location.href);
        window.location.href = CONFIG.loadingPage;
        return false;
    }

    function captureLinkClicks() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
            if (href.startsWith('http') && !href.includes(window.location.hostname)) return;
            e.preventDefault();
            sessionStorage.setItem('redirectUrl', href);
            window.location.href = CONFIG.loadingPage;
        });
    }

    function captureFormSubmits() {
        document.addEventListener('submit', function(e) {
            const form = e.target;
            if (!form || form.getAttribute('data-no-loading') === 'true') return;
            e.preventDefault();
            const action = form.getAttribute('action') || window.location.href;
            sessionStorage.setItem('redirectUrl', action);
            window.location.href = CONFIG.loadingPage;
        });
    }

    function init() {
        captureLinkClicks();
        captureFormSubmits();
        console.log('⏳ Loading system initialized');
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
