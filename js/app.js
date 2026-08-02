// ⚡ APLICACIÓN PRINCIPAL

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    // Verificar si ya existe un toast
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar con animación
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 500);
    }, 3000);
}

// Función para renderizar estrellas
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// Función para agregar al carrito (global)
window.addToCart = function(productId) {
    if (typeof productManager === 'undefined') {
        showNotification('❌ Error: Sistema no disponible', 'error');
        return;
    }
    
    const product = productManager.getProductById(productId);
    if (product) {
        if (product.stock <= 0) {
            showNotification('❌ Producto agotado', 'error');
            return;
        }
        if (typeof cartManager !== 'undefined') {
            cartManager.addItem(product);
            showNotification(`✅ ${product.name} agregado al carrito`, 'success');
            cartManager.updateUI();
        }
    } else {
        showNotification('❌ Producto no encontrado', 'error');
    }
};

// Función para ir al carrito
window.goToCart = function() {
    window.location.href = 'cart.html';
};

// Función para ir al checkout
window.goToCheckout = function() {
    if (typeof cartManager !== 'undefined' && cartManager.getTotalItems() > 0) {
        const user = localStorage.getItem('currentUser');
        if (!user) {
            showNotification('⚠️ Inicia sesión para continuar', 'info');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }
        window.location.href = 'checkout.html';
    } else {
        showNotification('❌ El carrito está vacío', 'error');
    }
};

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar carrito
    if (typeof cartManager !== 'undefined') {
        cartManager.loadCart();
        cartManager.updateUI();
    }
    
    // Actualizar autenticación
    if (typeof authManager !== 'undefined') {
        authManager.updateUI();
    }
    
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
});

// Exportar funciones globales
window.showNotification = showNotification;
window.renderStars = renderStars;
