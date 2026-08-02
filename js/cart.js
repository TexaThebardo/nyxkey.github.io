// 🛒 GESTIÓN DEL CARRITO - VERSIÓN COMPLETA
class CartManager {
    constructor() {
        this.items = [];
        this.total = 0;
        this.loadCart();
    }

    // Cargar carrito desde localStorage
    loadCart() {
        try {
            const saved = localStorage.getItem('cart');
            if (saved) {
                this.items = JSON.parse(saved);
                this.calculateTotal();
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

    // Guardar carrito en localStorage
    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.items));
            this.calculateTotal();
            this.updateUI();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Agregar item al carrito
    addItem(product, quantity = 1) {
        if (!product || !product.id) {
            console.error('Producto inválido');
            return false;
        }

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
            cartCount.style.display = total > 0 ? 'inline-flex' : 'none';
        }

        // Actualizar vista del carrito en checkout
        if (document.getElementById('cartItems')) {
            this.renderCart();
        }

        // Actualizar total en checkout
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) {
            cartTotal.textContent = `$${this.total.toFixed(2)}`;
        }

        // Actualizar total en el mini carrito
        const miniCartTotal = document.getElementById('miniCartTotal');
        if (miniCartTotal) {
            miniCartTotal.textContent = `$${this.total.toFixed(2)}`;
        }
    }

    // Renderizar carrito en checkout
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
            const totalContainer = document.getElementById('cartTotal');
            if (totalContainer) totalContainer.textContent = '$0.00';
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image || 'images/cards/default.jpg'}" alt="${item.name}" onerror="this.src='images/cards/default.jpg'">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-type">
                        <span class="card-type-badge ${item.card_type.toLowerCase()}">${item.card_type}</span>
                        ${item.card_number}
                    </p>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button onclick="window.decrementQuantity('${item.id}')" class="qty-btn" aria-label="Disminuir cantidad">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="qty-display">${item.quantity}</span>
                        <button onclick="window.incrementQuantity('${item.id}')" class="qty-btn" aria-label="Aumentar cantidad">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button onclick="window.removeFromCart('${item.id}')" class="btn-remove" aria-label="Eliminar producto">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="cart-item-subtotal">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');

        // Actualizar total
        const totalContainer = document.getElementById('cartTotal');
        if (totalContainer) {
            totalContainer.textContent = `$${this.total.toFixed(2)}`;
        }

        // Actualizar resumen
        this.updateSummary();
    }

    // Actualizar resumen del carrito
    updateSummary() {
        const summaryContainer = document.getElementById('cartSummary');
        if (!summaryContainer) return;

        const subtotal = this.total;
        const shipping = subtotal > 50 ? 0 : 5.99;
        const tax = subtotal * 0.10; // 10% de impuesto
        const total = subtotal + shipping + tax;

        summaryContainer.innerHTML = `
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Envío</span>
                <span>${shipping === 0 ? 'Gratis' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Impuesto (10%)</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span><strong>Total</strong></span>
                <span><strong>$${total.toFixed(2)}</strong></span>
            </div>
        `;
    }

    // Obtener datos para checkout
    getCheckoutData() {
        return {
            items: this.items,
            subtotal: this.total,
            shipping: this.total > 50 ? 0 : 5.99,
            tax: this.total * 0.10,
            total: this.total + (this.total > 50 ? 0 : 5.99) + (this.total * 0.10),
            itemCount: this.getTotalItems()
        };
    }

    // Obtener resumen para mostrar
    getSummary() {
        const data = this.getCheckoutData();
        return {
            ...data,
            itemsList: this.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity
            }))
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
    if (typeof showNotification === 'function') {
        showNotification('🗑️ Producto eliminado del carrito');
    }
};

window.addToCart = function(productId) {
    const product = window.productManager?.getProductById(productId);
    if (product) {
        cartManager.addItem(product);
        if (typeof showNotification === 'function') {
            showNotification(`✅ ${product.name} agregado al carrito`);
        }
        // Actualizar contador
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = cartManager.getTotalItems();
        }
    }
};

// Cargar carrito al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cartManager.loadCart();
    cartManager.updateUI();
});

// Exportar para uso global
window.cartManager = cartManager;
