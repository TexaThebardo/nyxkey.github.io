// ⚡ APLICACIÓN PRINCIPAL - TOPBAR MEJORADA

// =============================================
// NOTIFICACIONES MODERNAS CON MATERIAL ICONS
// =============================================
function showNotification(message, type = 'success') {
    // Eliminar toasts existentes
    const existingToasts = document.querySelectorAll('.toast-modern');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast-modern toast-${type}`;
    
    const icons = {
        success: 'check_circle',
        error: 'error',
        info: 'info',
        warning: 'warning'
    };
    
    toast.innerHTML = `
        <span class="toast-icon material-icons">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <span class="material-icons">close</span>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    // Animación de entrada
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto-cerrar después de 4 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 400);
    }, 4000);
}

// =============================================
// TOPBAR MEJORADA
// =============================================
function updateTopbar() {
    const user = authManager?.getCurrentUser();
    const cartCount = cartManager?.getTotalItems() || 0;
    
    // Actualizar contador del carrito
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = cartCount;
        cartCountEl.style.display = cartCount > 0 ? 'inline-flex' : 'none';
    }
    
    // Actualizar autenticación
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    
    if (user) {
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            if (userName) {
                userName.textContent = user.username || user.email?.split('@')[0] || 'Usuario';
            }
        }
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// =============================================
// FUNCIONES GLOBALES
// =============================================
window.showNotification = showNotification;
window.updateTopbar = updateTopbar;

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar topbar
    updateTopbar();
    
    // Configurar logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof authManager !== 'undefined') {
                authManager.logout();
            }
        });
    }
    
    // Observer para cambios en el carrito
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart' || e.key === 'currentUser') {
            updateTopbar();
        }
    });
});

// =============================================
// ESTILOS DE NOTIFICACIONES MODERNAS
// =============================================
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    /* =============================================
       NOTIFICACIONES MODERNAS
       ============================================= */
    .toast-modern {
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 16px 24px;
        border-radius: 16px;
        color: white;
        font-size: 0.95rem;
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        transform: translateY(100px) scale(0.9);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        max-width: 450px;
        min-width: 300px;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.1);
    }
    
    .toast-modern.show {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    
    .toast-modern .toast-icon {
        font-size: 1.8rem;
        flex-shrink: 0;
    }
    
    .toast-modern .toast-message {
        flex: 1;
        font-weight: 500;
        line-height: 1.4;
    }
    
    .toast-modern .toast-close {
        background: none;
        border: none;
        color: rgba(255,255,255,0.6);
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .toast-modern .toast-close:hover {
        background: rgba(255,255,255,0.1);
        color: white;
    }
    
    .toast-modern .toast-close .material-icons {
        font-size: 1.2rem;
    }
    
    .toast-success {
        background: linear-gradient(135deg, #059669, #10b981);
    }
    
    .toast-error {
        background: linear-gradient(135deg, #dc2626, #ef4444);
    }
    
    .toast-warning {
        background: linear-gradient(135deg, #d97706, #f59e0b);
    }
    
    .toast-info {
        background: linear-gradient(135deg, #2563eb, #4f46e5);
    }
    
    /* =============================================
       TOPBAR MEJORADA
       ============================================= */
    .navbar {
        background: rgba(10, 10, 20, 0.92);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255,255,255,0.06);
        padding: 0.8rem 0;
    }
    
    .navbar .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .nav-brand a {
        font-size: 1.4rem;
        font-weight: 800;
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .nav-brand i {
        -webkit-text-fill-color: initial;
        color: #4f46e5;
        font-size: 1.6rem;
    }
    
    .nav-links {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .nav-links a {
        padding: 8px 16px;
        border-radius: 10px;
        transition: all 0.3s;
        font-weight: 500;
        font-size: 0.9rem;
    }
    
    .nav-links a:hover,
    .nav-links a.active {
        background: rgba(79, 70, 229, 0.15);
        color: white;
    }
    
    .nav-links a i {
        margin-right: 6px;
    }
    
    #cartBtn {
        position: relative;
        padding: 8px 14px;
    }
    
    #cartCount {
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        color: white;
        border-radius: 50%;
        padding: 1px 7px;
        font-size: 0.65rem;
        font-weight: 700;
        position: absolute;
        top: -4px;
        right: -4px;
        min-width: 18px;
        text-align: center;
        display: none;
        box-shadow: 0 2px 10px rgba(79,70,229,0.4);
    }
    
    .btn-login, .btn-register {
        padding: 8px 18px;
        border-radius: 10px;
        font-weight: 500;
        font-size: 0.9rem;
        transition: all 0.3s;
    }
    
    .btn-login {
        border: 1px solid rgba(255,255,255,0.15);
        background: transparent;
    }
    
    .btn-login:hover {
        background: rgba(255,255,255,0.05);
        border-color: rgba(255,255,255,0.3);
    }
    
    .btn-register {
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        color: white !important;
        border: none;
    }
    
    .btn-register:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(79,70,229,0.3);
    }
    
    #userMenu {
        display: none;
        align-items: center;
        gap: 12px;
    }
    
    #userName {
        color: white;
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    #userMenu a {
        padding: 8px 12px;
        border-radius: 10px;
        transition: all 0.3s;
        color: #a0aec0;
    }
    
    #userMenu a:hover {
        background: rgba(255,255,255,0.05);
        color: white;
    }
    
    .admin-link {
        background: rgba(79,70,229,0.15) !important;
        color: #818cf8 !important;
    }
    
    .admin-link:hover {
        background: rgba(79,70,229,0.25) !important;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .navbar .container {
            flex-direction: column;
            gap: 12px;
        }
        .nav-links {
            flex-wrap: wrap;
            justify-content: center;
        }
        .nav-brand a {
            font-size: 1.2rem;
        }
        .toast-modern {
            bottom: 15px;
            right: 15px;
            left: 15px;
            max-width: 100%;
            min-width: auto;
            padding: 14px 18px;
        }
    }
`;

document.head.appendChild(notificationStyles);

// =============================================
// CARGAR MATERIAL ICONS
// =============================================
const materialIconsLink = document.createElement('link');
materialIconsLink.rel = 'stylesheet';
materialIconsLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
document.head.appendChild(materialIconsLink);
