// ============================================
// CART.JS - Carrito de Compras
// ============================================

console.log('🛒 Cart.js cargado');

let cartItems = [];

function loadCart() {
    console.log('🔄 loadCart ejecutado');
    try {
        const saved = localStorage.getItem('yx_cart');
        if (saved) {
            cartItems = JSON.parse(saved);
            updateCartUI();
            updateCartBadge();
        }
    } catch (e) {
        cartItems = [];
    }
}

function saveCart() {
    localStorage.setItem('yx_cart', JSON.stringify(cartItems));
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const count = document.getElementById('cartCount');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) badge.textContent = totalItems;
    if (count) count.textContent = totalItems;
}

function addToCart(productIndex) {
    const product = getProductByIndex(productIndex);
    if (!product) {
        showToast('Producto no encontrado', 'error');
        return;
    }
    if (product.stock <= 0) {
        showToast('Producto agotado', 'error');
        return;
    }
    
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
        if (existing.quantity >= product.stock) {
            showToast('No hay suficiente stock', 'error');
            return;
        }
        existing.quantity += 1;
    } else {
        cartItems.push({
            id: product.id,
            bin: product.bin,
            network: product.network,
            bank: product.bank,
            country: product.country,
            price: product.price,
            quantity: 1,
            maxStock: product.stock,
            cardData: {
                number: product.cardData?.number || '****',
                expiry: product.cardData?.expiry || '**/**',
                cvv: product.cardData?.cvv || '***'
            }
        });
    }
    
    saveCart();
    updateCartUI();
    updateCartBadge();
    showToast(`✅ ${product.network} ${product.bin} añadida al carrito`, 'success');
}

function removeFromCart(index) {
    if (index >= 0 && index < cartItems.length) {
        const item = cartItems[index];
        cartItems.splice(index, 1);
        saveCart();
        updateCartUI();
        updateCartBadge();
        showToast(`🗑️ ${item.network} ${item.bin} eliminada`, 'info');
    }
}

function updateCartQuantity(index, delta) {
    if (index >= 0 && index < cartItems.length) {
        const item = cartItems[index];
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) {
            removeFromCart(index);
            return;
        }
        if (newQuantity > item.maxStock) {
            showToast('Stock máximo alcanzado', 'warning');
            return;
        }
        item.quantity = newQuantity;
        saveCart();
        updateCartUI();
        updateCartBadge();
    }
}

function clearCart() {
    if (cartItems.length === 0) {
        showToast('El carrito ya está vacío', 'info');
        return;
    }
    if (confirm('¿Vaciar completamente el carrito?')) {
        cartItems = [];
        saveCart();
        updateCartUI();
        updateCartBadge();
        showToast('🗑️ Carrito vaciado', 'info');
    }
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    const discountEl = document.getElementById('cartDiscount');
    const totalEl = document.getElementById('cartTotal');
    
    if (cartItems.length === 0) {
        if (container) {
            container.innerHTML = `
                <div class="empty-cart">
                    <span class="material-icons-outlined">shopping_bag</span>
                    <p>El carrito está vacío</p>
                    <span class="empty-sub">Agrega tarjetas desde el catálogo</span>
                </div>
            `;
        }
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (discountEl) discountEl.textContent = '$0.00';
        if (totalEl) totalEl.textContent = '$0.00';
        return;
    }
    
    if (container) {
        container.innerHTML = cartItems.map((item, index) => {
            const itemTotal = item.price * item.quantity;
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.network} • ${item.bin}</span>
                        <span class="cart-item-detail">${item.bank} (${item.country})</span>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="updateCartQuantity(${index}, -1)">
                                <span class="material-icons">remove</span>
                            </button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateCartQuantity(${index}, 1)">
                                <span class="material-icons">add</span>
                            </button>
                        </div>
                        <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                        <button class="cart-item-remove" onclick="removeFromCart(${index})">
                            <span class="material-icons">delete_outline</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal > 100 ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function toggleCart() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    if (panel) panel.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

function checkout() {
    if (cartItems.length === 0) {
        showToast('El carrito está vacío', 'error');
        return;
    }
    
    const user = getCurrentUser();
    if (!user) {
        showToast('Debes iniciar sesión para comprar', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal > 100 ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    
    if (user.balance < total) {
        showToast(`Saldo insuficiente. Necesitas $${total.toFixed(2)}`, 'error');
        return;
    }
    
    if (confirm(`💰 Total a pagar: $${total.toFixed(2)} USD\n¿Procesar pago?`)) {
        updateUserBalance(user.id, -total);
        
        cartItems.forEach(item => {
            const purchaseData = {
                network: item.network,
                bin: item.bin,
                bank: item.bank,
                country: item.country,
                price: item.price,
                quantity: item.quantity,
                cardData: item.cardData || { number: '****', expiry: '**/**', cvv: '***' },
                purchaseDate:
