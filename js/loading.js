// ⏳ SCRIPT DE CARGA - Mostrar loading al navegar

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        loadingPage: 'loading.html',
        excludePaths: ['loading.html', 'checkout.html', 'payment-success.html'],
        delay: 300 // ms de retraso para mostrar loading
    };

    // Mostrar loading
    function showLoading() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        // No mostrar loading en páginas excluidas
        if (CONFIG.excludePaths.includes(currentPath)) {
            return true;
        }

        // Guardar la URL actual para redirigir después
        sessionStorage.setItem('redirectUrl', window.location.href);
        
        // Redirigir a loading
        window.location.href = CONFIG.loadingPage;
        return false;
    }

    // Capturar clics en enlaces (navegación)
    function captureLinkClicks() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

            // Verificar si es un enlace externo
            if (href.startsWith('http') && !href.includes(window.location.hostname)) return;

            // Prevenir navegación normal
            e.preventDefault();
            
            // Mostrar loading
            sessionStorage.setItem('redirectUrl', href);
            window.location.href = CONFIG.loadingPage;
        });
    }

    // Capturar envío de formularios
    function captureFormSubmits() {
        document.addEventListener('submit', function(e) {
            const form = e.target;
            if (!form || form.getAttribute('data-no-loading') === 'true') return;

            e.preventDefault();
            
            // Guardar URL del formulario
            const action = form.getAttribute('action') || window.location.href;
            sessionStorage.setItem('redirectUrl', action);
            
            // Mostrar loading
            window.location.href = CONFIG.loadingPage;
        });
    }

    // Inicializar
    function init() {
        // Capturar clics en enlaces
        captureLinkClicks();
        
        // Capturar envíos de formularios
        captureFormSubmits();

        console.log('⏳ Loading system initialized');
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
