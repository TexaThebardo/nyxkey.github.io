// 🛒 GESTIÓN DEL CARRITO
class CartManager {
    constructor() {
        this.items = [];
        this.total = 0;
    }

    // Cargar carrito desde localStorage
    loadCart() {
        const saved = localStorage.getItem('cart');
        if (saved) {
            this.items = JSON.parse(saved);
            this.calculateTotal();
        }
        return this.items;
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.calculateTotal();
        this.updateUI();
    }

    // Agregar item al carrito
    addItem(product, quantity = 1) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
        }
        this.saveCart();
        return this.items;
    }

    // Remover item del carrito
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        return this.items;
    }

    // Actualizar cantidad de un item
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

    // Calcular total
    calculateTotal() {
        this.total = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        return this.total;
    }

    // Obtener total de items
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Vaciar carrito
    clearCart() {
        this.items = [];
        this.total = 0;
        this.saveCart();
    }

    // Actualizar UI del carrito
    updateUI() {
        // Actualizar contador en navbar
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const total = this.getTotalItems();
            cartCount.textContent = total;
            cartCount.style.display = total > 0 ? 'inline' : 'none';
        }

        // Actualizar vista del carrito si existe
        if (document.getElementById('cartItems')) {
            this.renderCart();
        }

        // Actualizar total en checkout
        if (document.getElementById('cartTotal')) {
            document.getElementById('cartTotal').textContent = `$${this.total.toFixed(2)}`;
        }
    }

    // Renderizar carrito
    renderCart() {
        const container = document.getElementById('cartItems');
        const totalContainer = document.getElementById('cartTotal');
        
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x"></i>
                    <h3>Tu carrito está vacío</h3>
                    <a href="shop.html" class="btn-primary">Ir a la tienda</a>
                </div>
            `;
            if (totalContainer) totalContainer.textContent = '$0.00';
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image || 'images/cards/default.jpg'}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-type">${item.card_type} - ${item.card_number}</p>
                    <p class="cart-item-price">$${item.price}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button onclick="decrementQuantity('${item.id}')" class="qty-btn">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button onclick="incrementQuantity('${item.id}')" class="qty-btn">+</button>
                    </div>
                    <button onclick="removeFromCart('${item.id}')" class="btn-remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="cart-item-subtotal">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');

        if (totalContainer) {
            totalContainer.textContent = `$${this.total.toFixed(2)}`;
        }
    }

    // Obtener resumen del carrito para checkout
    getCheckoutData() {
        return {
            items: this.items,
            total: this.total,
            itemCount: this.getTotalItems()
        };
    }
}

// Crear instancia global
const cartManager = new CartManager();

// Funciones globales para el carrito
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
    showNotification('🗑️ Producto eliminado del carrito');
};

// Cargar carrito al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cartManager.loadCart();
    cartManager.updateUI();
});
