// ⚡ APLICACIÓN PRINCIPAL
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar carrito
    if (typeof cartManager !== 'undefined') {
        cartManager.loadCart();
        cartManager.updateUI();
    }

    // Cargar productos
    if (typeof productManager !== 'undefined') {
        await productManager.loadProducts();
        
        // Renderizar productos destacados en home
        if (document.getElementById('featuredProducts')) {
            const featured = productManager.getFeaturedProducts(6);
            productManager.renderProducts(featured);
        }
        
        // Renderizar productos en shop
        if (document.getElementById('productsContainer')) {
            productManager.renderProducts(productManager.getAllProducts());
        }
    }

    // Verificar autenticación
    if (typeof authManager !== 'undefined') {
        authManager.updateUI();
    }

    // Setup event listeners
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof authManager !== 'undefined') {
                authManager.logout();
            }
        });
    }

    // Click en carrito para ir a cart.html
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn && !cartBtn.href) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
}

// Toast notifications
function showNotification(message, type = 'success') {
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
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Función de búsqueda global
window.searchProducts = function(query) {
    if (typeof productManager !== 'undefined') {
        const results = productManager.searchProducts(query);
        productManager.renderProducts(results);
    }
};

// Función para agregar al carrito desde cualquier lugar
window.addToCart = function(productId) {
    if (typeof productManager === 'undefined' || typeof cartManager === 'undefined') {
        showNotification('❌ Error: Sistema no disponible', 'error');
        return;
    }
    
    const product = productManager.getProductById(productId);
    if (product) {
        if (product.stock <= 0) {
            showNotification('❌ Producto agotado', 'error');
            return;
        }
        
        const result = cartManager.addItem(product);
        if (result) {
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
        window.location.href = 'checkout.html';
    } else {
        showNotification('❌ El carrito está vacío', 'error');
    }
};

// Exportar funciones globales
window.showNotification = showNotification;
