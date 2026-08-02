// 🛒 GESTIÓN DEL CARRITO

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
                image: product.image || '',
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
            cartCount.style.display = total > 0 ? 'inline' : 'none';
        }
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

window.clearCart = function() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cartManager.clearCart();
        cartManager.updateUI();
        if (typeof showNotification === 'function') {
            showNotification('🗑️ Carrito vaciado', 'info');
        }
    }
};
