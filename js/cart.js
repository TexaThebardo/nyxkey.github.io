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
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.items = [];
        }
        return this.items;
    }

    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.items));
            this.calculateTotal();
            this.updateUI();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    addItem(product, quantity = 1) {
        if (!product || !product.id) return false;
        
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || 'images/cards/default.jpg',
                card_type: product.card_type || 'Visa',
                card_number: product.card_number || '****',
                quantity: quantity,
                stock: product.stock || 0
            });
        }
        this.saveCart();
        return true;
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
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
    }

    updateUI() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const total = this.getTotalItems();
            cartCount.textContent = total;
            cartCount.style.display = total > 0 ? 'inline-flex' : 'none';
        }
        
        if (document.getElementById('cartItems')) {
            this.renderCart();
        }
    }

    renderCart() {
        const container = document.getElementById('cartItems');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x"></i>
                    <h3>Tu carrito está vacío</h3>
                    <p>¡Agrega algunos productos!</p>
                    <a href="shop.html" class="btn-primary">Ir a la tienda</a>
                </div>
            `;
            this.updateSummary();
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image || 'images/cards/default.jpg'}" alt="${item.name}" onerror="this.src='images/cards/default.jpg'">
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

        this.updateSummary();
    }

    updateSummary() {
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
        showNotification('❌ Error: Sistema no disponible', 'error');
        return;
    }
    
    const product = productManager.getProductById(productId);
    if (product) {
        if (product.stock <= 0) {
            showNotification('❌ Producto agotado', 'error');
            return;
        }
        cartManager.addItem(product);
        showNotification(`✅ ${product.name} agregado al carrito`, 'success');
        cartManager.updateUI();
    } else {
        showNotification('❌ Producto no encontrado', 'error');
    }
};

window.goToCheckout = function() {
    if (cartManager.getTotalItems() > 0) {
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

window.clearCart = function() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cartManager.clearCart();
        cartManager.renderCart();
        showNotification('🗑️ Carrito vaciado', 'info');
    }
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cartManager.loadCart();
    cartManager.updateUI();
    
    // Si estamos en cart.html, renderizar
    if (document.getElementById('cartItems')) {
        cartManager.renderCart();
    }
});

window.cartManager = cartManager;
