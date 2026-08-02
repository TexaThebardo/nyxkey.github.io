// 🛒 GESTIÓN DEL CARRITO - VERSIÓN COMPLETA

class CartManager {
    constructor() {
        this.items = [];
        this.total = 0;
        this.loadCart();
    }

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

    addItem(product, quantity = 1) {
        if (!product || !product.id) {
            console.error('❌ Producto inválido');
            return false;
        }
        
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
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
        this.saveCart();
        this.renderCart();
        return true;
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
        return this.items;
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
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

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        return this.total;
    }

    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    clearCart() {
        this.items = [];
        this.total = 0;
        this.saveCart();
        this.renderCart();
        console.log('🗑️ Carrito vaciado');
    }

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

    // Renderizar carrito en cart.html
    renderCart() {
        const container = document.getElementById('cartItems');
        if (!container) {
            console.warn('⚠️ Contenedor cartItems no encontrado');
            return;
        }

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x"></i>
                    <h3>Tu carrito está vacío</h3>
                    <p>¡Agrega algunos productos!</p>
                    <a href="shop.html" class="btn-primary">Ir a la tienda</a>
                </div>
            `;
            this.updateTotals();
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image || 'https://via.placeholder.com/70x70/1a1a3e/818cf8?text=Card'}" 
                         alt="${item.name}"
                         onerror="this.src='https://via.placeholder.com/70x70/1a1a3e/818cf8?text=Card'">
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

    // Actualizar totales en el resumen
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

    // Obtener datos para checkout
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

// Crear instancia global
const cartManager = new CartManager();
window.cartManager = cartManager;

// Funciones globales
window.incrementQuantity = function(productId) {
    const item = cartManager.items.find(i => i.id === productId);
    if (item) {
        cartManager.updateQuantity(productId, item.quantity + 1);
    }
};

window.decrementQuantity = function(productId) {
    const item = cartManager.items.find(i => i.id === productId);
    if (item) {
        cartManager.updateQuantity(productId, item.quantity - 1);
    }
};

window.removeFromCart = function(productId) {
    cartManager.removeItem(productId);
    if (typeof showNotification === 'function') {
        showNotification('🗑️ Producto eliminado del carrito');
    }
};

window.addToCart = function(productId) {
    if (typeof productManager === 'undefined') {
        if (typeof showNotification === 'function') {
            showNotification('❌ Error: Sistema no disponible', 'error');
        }
        return;
    }
    
    const product = productManager.getProductById(productId);
    if (product) {
        if (product.stock <= 0) {
            if (typeof showNotification === 'function') {
                showNotification('❌ Producto agotado', 'error');
            }
            return;
        }
        cartManager.addItem(product);
        if (typeof showNotification === 'function') {
            showNotification(`✅ ${product.name} agregado al carrito`, 'success');
        }
        cartManager.updateUI();
    } else {
        if (typeof showNotification === 'function') {
            showNotification('❌ Producto no encontrado', 'error');
        }
    }
};

window.clearCart = function() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cartManager.clearCart();
        if (typeof showNotification === 'function') {
            showNotification('🗑️ Carrito vaciado', 'info');
        }
    }
};

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

// Inicializar carrito
document.addEventListener('DOMContentLoaded', function() {
    cartManager.loadCart();
    cartManager.updateUI();
    
    // Si estamos en cart.html, renderizar
    if (document.getElementById('cartItems')) {
        cartManager.renderCart();
    }
});
