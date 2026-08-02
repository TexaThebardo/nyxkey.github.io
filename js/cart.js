// 🛒 GESTIÓN DEL CARRITO - VERSIÓN COMPLETA CON DESCUENTO DE STOCK

class CartManager {
    constructor() {
        this.items = [];
        this.total = 0;
        this.loadCart();
    }

    // =============================================
    // CARGAR CARRITO DESDE LOCALSTORAGE
    // =============================================
    loadCart() {
        try {
            const saved = localStorage.getItem('cart');
            if (saved) {
                this.items = JSON.parse(saved);
                this.calculateTotal();
                console.log('🛒 Carrito cargado:', this.items.length, 'items');
            } else {
                this.items = [];
                this.total = 0;
                console.log('🛒 Carrito vacío');
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.items = [];
            this.total = 0;
        }
        return this.items;
    }

    // =============================================
    // GUARDAR CARRITO EN LOCALSTORAGE
    // =============================================
    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.items));
            this.calculateTotal();
            this.updateUI();
            console.log('💾 Carrito guardado:', this.items.length, 'items');
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // =============================================
    // AGREGAR PRODUCTO AL CARRITO (CON STOCK)
    // =============================================
    addItem(product, quantity = 1) {
        if (!product || !product.id) {
            console.error('❌ Producto inválido');
            return false;
        }

        // Verificar stock disponible
        if (product.stock < quantity) {
            if (typeof showNotification === 'function') {
                showNotification(`❌ Solo quedan ${product.stock} unidades disponibles`, 'error');
            }
            return false;
        }

        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            // Verificar stock total
            if (product.stock < existing.quantity + quantity) {
                if (typeof showNotification === 'function') {
                    showNotification(`❌ Solo quedan ${product.stock} unidades disponibles`, 'error');
                }
                return false;
            }
            existing.quantity += quantity;
            console.log(`🔄 Producto actualizado: ${product.name} x${existing.quantity}`);
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || '',
                card_type: product.card_type || 'Visa',
                card_number: product.card_number || '****',
                quantity: quantity,
                stock: product.stock || 0
            });
            console.log(`➕ Producto agregado: ${product.name}`);
        }

        // Descontar stock del producto
        this.updateProductStock(product.id, -quantity);
        this.saveCart();
        this.renderCart();
        return true;
    }

    // =============================================
    // ELIMINAR PRODUCTO DEL CARRITO
    // =============================================
    removeItem(productId) {
        const item = this.items.find(i => i.id === productId);
        if (item) {
            // Devolver stock
            this.updateProductStock(productId, item.quantity);
            console.log(`🗑️ Producto eliminado: ${item.name}`);
        }
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
        return this.items;
    }

    // =============================================
    // ACTUALIZAR CANTIDAD DE UN PRODUCTO
    // =============================================
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            const diff = quantity - item.quantity;

            if (diff > 0) {
                // Verificar stock disponible
                const product = this.getProductFromStorage(productId);
                if (product && product.stock < diff) {
                    if (typeof showNotification === 'function') {
                        showNotification(`❌ Solo quedan ${product.stock} unidades disponibles`, 'error');
                    }
                    return;
                }
                this.updateProductStock(productId, -diff);
            } else if (diff < 0) {
                this.updateProductStock(productId, -diff);
            }

            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.renderCart();
            }
        }
        return this.items;
    }

    // =============================================
    // OBTENER PRODUCTO DEL STORAGE
    // =============================================
    getProductFromStorage(productId) {
        const products = JSON.parse(localStorage.getItem('products_backup') || '[]');
        return products.find(p => p.id === productId);
    }

    // =============================================
    // ACTUALIZAR STOCK DE UN PRODUCTO
    // =============================================
    updateProductStock(productId, change) {
        // Actualizar en localStorage
        const products = JSON.parse(localStorage.getItem('products_backup') || '[]');
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex !== -1) {
            products[productIndex].stock += change;
            if (products[productIndex].stock < 0) products[productIndex].stock = 0;
            localStorage.setItem('products_backup', JSON.stringify(products));

            // Actualizar también en productManager
            if (window.productManager && window.productManager.products) {
                const pIndex = window.productManager.products.findIndex(p => p.id === productId);
                if (pIndex !== -1) {
                    window.productManager.products[pIndex].stock = products[productIndex].stock;
                }
            }

            // Re-renderizar productos si estamos en la tienda
            if (document.getElementById('productsContainer') && window.productManager) {
                window.productManager.renderProducts(window.productManager.getAllProducts());
            }
            if (document.getElementById('featuredProducts') && window.productManager) {
                window.productManager.renderProducts(window.productManager.getFeaturedProducts(6), 'featuredProducts');
            }
        }
    }

    // =============================================
    // CALCULAR TOTAL
    // =============================================
    calculateTotal() {
        this.total = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        return this.total;
    }

    // =============================================
    // OBTENER TOTAL DE ITEMS
    // =============================================
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // =============================================
    // VACIAR CARRITO
    // =============================================
    clearCart() {
        // Devolver todo el stock
        this.items.forEach(item => {
            this.updateProductStock(item.id, item.quantity);
        });
        this.items = [];
        this.total = 0;
        this.saveCart();
        this.renderCart();
        console.log('🗑️ Carrito vaciado');
    }

    // =============================================
    // ACTUALIZAR UI (contador y carrito)
    // =============================================
    updateUI() {
        // Actualizar contador en navbar
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const total = this.getTotalItems();
            cartCount.textContent = total;
            cartCount.style.display = total > 0 ? 'inline-flex' : 'none';
        }

        // Actualizar en cart.html
        if (document.getElementById('cartItems')) {
            this.renderCart();
        }

        // Actualizar totales
        this.updateTotals();
    }

    // =============================================
    // RENDERIZAR CARRITO EN cart.html
    // =============================================
    renderCart() {
        const container = document.getElementById('cartItems');
        if (!container) {
            console.warn('⚠️ Contenedor cartItems no encontrado');
            return;
        }

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Tu carrito está vacío</h3>
                    <p>¡Agrega algunos productos!</p>
                    <a href="shop.html" class="btn-primary btn-block" style="max-width: 200px; margin: 0 auto;">
                        <i class="fas fa-store"></i> Ir a la tienda
                    </a>
                </div>
            `;
            this.updateTotals();
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image || 'https://via.placeholder.com/60x60/1a1a3e/818cf8?text=Card'}" 
                         alt="${item.name}"
                         onerror="this.src='https://via.placeholder.com/60x60/1a1a3e/818cf8?text=Card'">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-type">${item.card_type || 'Visa'} - ${item.card_number || '****'}</p>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button onclick="window.decrementQuantity('${item.id}')" class="qty-btn">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="qty-display">${item.quantity}</span>
                        <button onclick="window.incrementQuantity('${item.id}')" class="qty-btn">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button onclick="window.removeFromCart('${item.id}')" class="btn-remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="cart-item-subtotal">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');

        this.updateTotals();
        console.log('🛒 Carrito renderizado:', this.items.length, 'items');
    }

    // =============================================
    // ACTUALIZAR TOTALES EN EL RESUMEN
    // =============================================
    updateTotals() {
        const subtotal = this.total;
        const shipping = subtotal > 50 ? 0 : 5.99;
        const tax = subtotal * 0.10;
        const total = subtotal + shipping + tax;

        const subtotalEl = document.getElementById('cartSubtotal');
        const shippingEl = document.getElementById('cartShipping');
        const taxEl = document.getElementById('cartTax');
        const totalEl = document.getElementById('cartTotal');

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }

    // =============================================
    // OBTENER DATOS PARA CHECKOUT
    // =============================================
    getCheckoutData() {
        const subtotal = this.total;
        const shipping = subtotal > 50 ? 0 : 5.99;
        const tax = subtotal * 0.10;
        return {
            items: this.items,
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: subtotal + shipping + tax,
            itemCount: this.getTotalItems()
        };
    }
}

// =============================================
// INSTANCIA GLOBAL
// =============================================
const cartManager = new CartManager();
window.cartManager = cartManager;

// =============================================
// FUNCIONES GLOBALES
// =============================================

// Incrementar cantidad
window.incrementQuantity = function(productId) {
    const item = cartManager.items.find(i => i.id === productId);
    if (item) {
        cartManager.updateQuantity(productId, item.quantity + 1);
    }
};

// Decrementar cantidad
window.decrementQuantity = function(productId) {
    const item = cartManager.items.find(i => i.id === productId);
    if (item) {
        cartManager.updateQuantity(productId, item.quantity - 1);
    }
};

// Eliminar del carrito
window.removeFromCart = function(productId) {
    cartManager.removeItem(productId);
    if (typeof showNotification === 'function') {
        showNotification('🗑️ Producto eliminado del carrito');
    }
};

// Agregar al carrito (desde productos)
window.addToCart = function(productId) {
    if (typeof window.productManager === 'undefined') {
        if (typeof showNotification === 'function') {
            showNotification('❌ Error: Sistema no disponible', 'error');
        }
        return;
    }

    const product = window.productManager.getProductById(productId);
    if (product) {
        if (product.stock <= 0) {
            if (typeof showNotification === 'function') {
                showNotification('❌ Producto agotado', 'error');
            }
            return;
        }
        const result = cartManager.addItem(product);
        if (result && typeof showNotification === 'function') {
            showNotification(`✅ ${product.name} agregado al carrito`, 'success');
        }
        cartManager.updateUI();
    } else {
        if (typeof showNotification === 'function') {
            showNotification('❌ Producto no encontrado', 'error');
        }
    }
};

// Vaciar carrito
window.clearCart = function() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cartManager.clearCart();
        if (typeof showNotification === 'function') {
            showNotification('🗑️ Carrito vaciado', 'info');
        }
    }
};

// Ir al checkout
window.goToCheckout = function() {
    if (cartManager.getTotalItems() > 0) {
        const user = localStorage.getItem('currentUser');
        if (!user) {
            if (typeof showNotification === 'function') {
                showNotification('⚠️ Inicia sesión para continuar', 'warning');
            }
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }
        window.location.href = 'checkout.html';
    } else {
        if (typeof showNotification === 'function') {
            showNotification('❌ El carrito está vacío', 'error');
        }
    }
};

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    cartManager.loadCart();
    cartManager.updateUI();

    // Si estamos en cart.html, renderizar
    if (document.getElementById('cartItems')) {
        cartManager.renderCart();
    }

    // Escuchar cambios en el carrito desde otras pestañas
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            cartManager.loadCart();
            cartManager.updateUI();
            if (document.getElementById('cartItems')) {
                cartManager.renderCart();
            }
        }
    });
});

console.log('🛒 CartManager cargado correctamente');
