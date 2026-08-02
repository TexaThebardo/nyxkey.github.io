// 🛒 GESTIÓN DEL CARRITO - CON DESCUENTO DE STOCK

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
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    addItem(product, quantity = 1) {
        if (!product || !product.id) return false;
        
        // Verificar stock disponible
        if (product.stock < quantity) {
            showNotification(`❌ Solo quedan ${product.stock} unidades disponibles`, 'error');
            return false;
        }
        
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            // Verificar stock total
            if (product.stock < existing.quantity + quantity) {
                showNotification(`❌ Solo quedan ${product.stock} unidades disponibles`, 'error');
                return false;
            }
            existing.quantity += quantity;
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
        }
        
        // Descontar stock del producto
        this.updateProductStock(product.id, -quantity);
        this.saveCart();
        this.renderCart();
        return true;
    }

    removeItem(productId) {
        const item = this.items.find(i => i.id === productId);
        if (item) {
            // Devolver stock
            this.updateProductStock(productId, item.quantity);
        }
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
        return this.items;
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            const diff = quantity - item.quantity;
            if (diff > 0) {
                // Verificar stock disponible
                const product = productManager.getProductById(productId);
                if (product && product.stock < diff) {
                    showNotification(`❌ Solo quedan ${product.stock} unidades disponibles`, 'error');
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

    // Actualizar stock de un producto
    updateProductStock(productId, change) {
        const products = JSON.parse(localStorage.getItem('products_backup') || '[]');
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products[productIndex].stock += change;
            if (products[productIndex].stock < 0) products[productIndex].stock = 0;
            localStorage.setItem('products_backup', JSON.stringify(products));
            
            // Actualizar también en productManager
            if (productManager && productManager.products) {
                const pIndex = productManager.products.findIndex(p => p.id === productId);
                if (pIndex !== -1) {
                    productManager.products[pIndex].stock = products[productIndex].stock;
                }
            }
            
            // Re-renderizar productos si estamos en la tienda
            if (document.getElementById('productsContainer')) {
                productManager.renderProducts(productManager.getAllProducts());
            }
            if (document.getElementById('featuredProducts')) {
                productManager.renderProducts(productManager.getFeaturedProducts(6), 'featuredProducts');
            }
        }
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
        // Devolver todo el stock
        this.items.forEach(item => {
            this.updateProductStock(item.id, item.quantity);
        });
        this.items = [];
        this.total = 0;
        this.saveCart();
        this.renderCart();
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
        this.updateTotals();
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
    }

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

const cartManager = new CartManager();
window.cartManager = cartManager;

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

document.addEventListener('DOMContentLoaded', function() {
    cartManager.loadCart();
    cartManager.updateUI();
    
    if (document.getElementById('cartItems')) {
        cartManager.renderCart();
    }
});
