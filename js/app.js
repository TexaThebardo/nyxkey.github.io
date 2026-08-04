// ============================================
// APP.JS - Lógica Principal
// ============================================

// ============ DATOS DE EJEMPLO ============
const cardData = [
    { network: "VISA", bin: "414720", db: "DB_July_2026", class: "CREDIT", level: "PLATINUM", bank: "JPMORGAN CHASE BANK", country: "🇺🇸", type: "CC Full", uso: "Multifuncional", nonvbv: "-", nonmsc: "-", price: 28.58 },
    { network: "MASTERCARD", bin: "521894", db: "DB_July_2026", class: "CREDIT", level: "TITANIUM", bank: "CAPITAL ONE BANK", country: "🇺🇸", type: "Non VBV", uso: "Non-VBV", nonvbv: "SI", nonmsc: "SI", price: 48.58 },
    { network: "VISA", bin: "471612", db: "DB_July_2026", class: "DEBIT", level: "SIGNATURE", bank: "BANK OF AMERICA", country: "🇺🇸", type: "CC Full", uso: "Multifuncional", nonvbv: "-", nonmsc: "-", price: 27.90 },
    { network: "AMEX", bin: "371449", db: "DB_July_2026", class: "CREDIT", level: "CENTURION", bank: "AMERICAN EXPRESS", country: "🇺🇸", type: "Non VBV", uso: "Non-VBV", nonvbv: "SI", nonmsc: "SI", price: 51.29 },
    { network: "VISA", bin: "469566", db: "DB_July_2026", class: "CREDIT", level: "PURCHASING", bank: "BANCO POPULAR DOMINICANO", country: "🇩🇴", type: "Non VBV", uso: "Non-VBV", nonvbv: "SI", nonmsc: "SI", price: 36.29 },
    { network: "MASTERCARD", bin: "546871", db: "DB_July_2026", class: "CREDIT", level: "WORLD", bank: "BANCOMER, S.A.", country: "🇲🇽", type: "CC Full", uso: "Multifuncional", nonvbv: "-", nonmsc: "-", price: 28.66 },
    { network: "VISA", bin: "438857", db: "DB_July_2026", class: "CREDIT", level: "PREMIER", bank: "WELLS FARGO BANK", country: "🇺🇸", type: "CC Full", uso: "Wells Fargo", nonvbv: "-", nonmsc: "-", price: 29.50 },
    { network: "MASTERCARD", bin: "516329", db: "DB_July_2026", class: "CREDIT", level: "MIXED", bank: "WESTPAC BANKING CORP", country: "🇦🇺", type: "Non VBV", uso: "Non-VBV", nonvbv: "SI", nonmsc: "SI", price: 32.00 },
    { network: "VISA", bin: "481523", db: "DB_July_2026", class: "DEBIT", level: "CLASSIC", bank: "BANCO SANTA CRUZ", country: "🇩🇴", type: "Non VBV", uso: "Non-VBV", nonvbv: "SI", nonmsc: "SI", price: 48.58 },
    { network: "DISCOVER", bin: "601100", db: "DB_July_2026", class: "CREDIT", level: "GOLD", bank: "DISCOVER BANK", country: "🇺🇸", type: "CC Full", uso: "Multifuncional", nonvbv: "-", nonmsc: "-", price: 26.80 },
    { network: "VISA", bin: "450004", db: "DB_July_2026", class: "CREDIT", level: "BUSINESS", bank: "CANADIAN IMPERIAL BANK", country: "🇨🇦", type: "CC Full", uso: "Multifuncional", nonvbv: "-", nonmsc: "-", price: 29.18 },
    { network: "MASTERCARD", bin: "552190", db: "DB_July_2026", class: "CREDIT", level: "GOLD", bank: "CITIBANK N.A.", country: "🇺🇸", type: "Non VBV", uso: "Non-VBV", nonvbv: "SI", nonmsc: "SI", price: 51.29 },
];

// ============ VARIABLES GLOBALES ============
let filteredCards = [...cardData];
let currentPage = 1;
const itemsPerPage = 8;

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', function() {
    renderCatalog();
    updateStats();
    updateCartUI();
    
    // Cerrar carrito al hacer clic en overlay
    document.getElementById('cartOverlay').addEventListener('click', toggleCart);
    
    // Cerrar modal de depósito al hacer clic en overlay
    document.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) closeDepositModal();
    });
});

// ============ RENDERIZAR CATÁLOGO ============
function renderCatalog() {
    const tbody = document.getElementById('catalogBody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredCards.slice(start, end);
    
    if (pageItems.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="13" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <span class="material-icons-outlined" style="font-size: 48px; display: block; margin-bottom: 12px;">search_off</span>
                    No se encontraron tarjetas
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = pageItems.map((card, index) => `
            <tr>
                <td><span class="network-badge">${card.network}</span></td>
                <td><strong>${card.bin}</strong></td>
                <td>${card.db}</td>
                <td>${card.class}</td>
                <td>${card.level}</td>
                <td>${card.bank}</td>
                <td><span class="country-flag">${card.country}</span></td>
                <td>${card.type}</td>
                <td>${card.uso}</td>
                <td>${card.nonvbv === 'SI' ? '<span class="badge-vbv">✓ SI</span>' : '<span class="badge-nonvbv">✗ NO</span>'}</td>
                <td>${card.nonmsc === 'SI' ? '<span class="badge-vbv">✓ SI</span>' : '<span class="badge-nonvbv">✗ NO</span>'}</td>
                <td><strong>$${card.price.toFixed(2)}</strong></td>
                <td>
                    <button class="btn-buy" onclick="addToCart(${cardData.indexOf(card)})">
                        <span class="material-icons">add_shopping_cart</span>
                        Comprar
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    document.getElementById('showingCount').textContent = filteredCards.length;
    document.getElementById('currentPage').textContent = currentPage;
}

// ============ FILTROS ============
function applyFilters() {
    const countryFilter = document.getElementById('filterCountry').value;
    const searchTerm = document.getElementById('filterSearch').value.toLowerCase();
    
    filteredCards = cardData.filter(card => {
        const matchCountry = !countryFilter || card.country === countryFilter;
        const matchSearch = !searchTerm || 
            card.bin.includes(searchTerm) || 
            card.bank.toLowerCase().includes(searchTerm) ||
            card.network.toLowerCase().includes(searchTerm);
        return matchCountry && matchSearch;
    });
    
    currentPage = 1;
    renderCatalog();
}

// ============ PAGINACIÓN ============
function changePage(direction) {
    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
    const newPage = currentPage + direction;
    if (newPage < 1 || newPage > totalPages) return;
    currentPage = newPage;
    renderCatalog();
    document.getElementById('catalogBody').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============ REFRESCAR CATÁLOGO ============
function refreshCatalog() {
    const btn = document.querySelector('.btn-refresh');
    btn.classList.add('rotating');
    
    // Simular carga de datos en tiempo real
    setTimeout(() => {
        btn.classList.remove('rotating');
        applyFilters();
        updateStats();
        showToast('Catálogo actualizado', 'success');
    }, 800);
}

// ============ ESTADÍSTICAS EN TIEMPO REAL ============
function updateStats() {
    document.getElementById('totalCards').textContent = cardData.length;
    const uniqueBanks = new Set(cardData.map(c => c.bank));
    document.getElementById('totalBanks').textContent = uniqueBanks.size;
    document.getElementById('onlineUsers').textContent = Math.floor(Math.random() * 50) + 10;
}

// ============ CHECKER ============
function runChecker() {
    const input = document.getElementById('checkerInput');
    const lines = input.value.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
        showToast('Por favor, ingresa al menos una tarjeta', 'error');
        return;
    }
    
    const btn = document.querySelector('.btn-checker');
    btn.disabled = true;
    btn.innerHTML = '<span class="material-icons spinning">sync</span> Verificando...';
    
    // Simular verificación en tiempo real
    let approved = 0, declined = 0;
    const total = lines.length;
    
    const interval = setInterval(() => {
        const status = Math.random() > 0.3 ? 'approved' : 'declined';
        if (status === 'approved') approved++; else declined++;
        
        document.getElementById('approvedCount').textContent = approved;
        document.getElementById('declinedCount').textContent = declined;
        document.getElementById('processedCount').textContent = approved + declined;
        
        if (approved + declined >= total) {
            clearInterval(interval);
            btn.disabled = false;
            btn.innerHTML = '<span class="material-icons">play_arrow</span> Verificar Tarjetas';
            showToast(`Verificación completada: ${approved} aprobadas, ${declined} declinadas`, 'success');
        }
    }, 400);
}

function uploadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.csv';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('checkerInput').value = event.target.result;
            showToast(`Archivo cargado: ${file.name}`, 'success');
        };
        reader.readAsText(file);
    };
    input.click();
}

function clearChecker() {
    document.getElementById('checkerInput').value = '';
    document.getElementById('approvedCount').textContent = '0';
    document.getElementById('declinedCount').textContent = '0';
    document.getElementById('processedCount').textContent = '0';
}

// ============ BOT OTP ============
let otpInterval = null;
let otpLogs = [];

function startOTPBot() {
    const btn = document.querySelector('.btn-otp');
    const target = document.getElementById('otpTarget').value || 'Desconocido';
    const phone = document.getElementById('otpPhone').value || 'Sin número';
    const service = document.getElementById('otpService').value;
    
    if (otpInterval) {
        // Detener bot
        clearInterval(otpInterval);
        otpInterval = null;
        btn.innerHTML = '<span class="material-icons">play_circle</span> Iniciar Bot OTP';
        btn.style.background = '#2a4a6a';
        addOTPLog('Bot detenido manualmente', 'info');
        return;
    }
    
    btn.innerHTML = '<span class="material-icons spinning">sync</span> Detener Bot';
    btn.style.background = '#6a2a2a';
    addOTPLog(`Iniciando bot para ${target} (${phone}) - Servicio: ${service}`, 'info');
    
    const stages = [
        'Llamando al número proporcionado...',
        'Estableciendo conexión...',
        'Bienvenida: "Esta es una llamada automática..."',
        'La víctima está en otra llamada, esperando...',
        'La víctima puso la llamada en espera...',
        'Por favor, espere mientras verificamos su cuenta...',
        '¿Puede confirmar su fecha de nacimiento?',
        'La víctima está ingresando datos...'
    ];
    
    let stageIndex = 0;
    
    otpInterval = setInterval(() => {
        if (stageIndex < stages.length) {
            addOTPLog(stages[stageIndex], 'progress');
            stageIndex++;
        } else {
            // Simular captura de OTP
            const otp = Math.floor(100000 + Math.random() * 900000);
            addOTPLog(`🎯 OTP Capturado: ${otp}`, 'success');
            stageIndex = 0;
        }
    }, 1200);
}

function addOTPLog(message, type = 'info') {
    const logsContainer = document.getElementById('otpLogs');
    const time = new Date().toLocaleTimeString();
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type === 'success' ? 'highlight' : ''}`;
    
    const statusMap = {
        'info': '●',
        'progress': '⏳',
        'success': '✓'
    };
    
    entry.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="log-status">${statusMap[type] || '●'}</span>
        <span class="log-message">${message}</span>
    `;
    
    logsContainer.appendChild(entry);
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

// ============ FUNCIONES DE CARRITO (exportadas desde cart.js) ============
function addToCart(index) {
    const card = cardData[index];
    if (!card) return;
    
    // Verificar si ya existe en el carrito
    const existingItem = window.cartItems ? 
        window.cartItems.find(item => item.bin === card.bin) : null;
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        if (!window.cartItems) window.cartItems = [];
        window.cartItems.push({ ...card, quantity: 1 });
    }
    
    updateCartUI();
    showToast(`Tarjeta ${card.bin} añadida al carrito`, 'success');
}

function updateCartUI() {
    const cartItems = window.cartItems || [];
    const container = document.getElementById('cartItems');
    const countBadge = document.getElementById('cartCount');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    const discountEl = document.getElementById('cartDiscount');
    
    countBadge.textContent = cartItems.length;
    
    if (cartItems.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <span class="material-icons-outlined">shopping_bag</span>
                <p>El carrito está vacío</p>
                <span class="empty-sub">Agrega tarjetas desde el catálogo</span>
            </div>
        `;
        subtotalEl.textContent = '$0.00';
        totalEl.textContent = '$0.00';
        discountEl.textContent = '$0.00';
        return;
    }
    
    let subtotal = 0;
    container.innerHTML = cartItems.map((item, idx) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.network} • ${item.bin}</span>
                    <span class="cart-item-detail">${item.bank} (${item.country})</span>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateCartQuantity(${idx}, -1)">
                            <span class="material-icons">remove</span>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity(${idx}, 1)">
                            <span class="material-icons">add</span>
                        </button>
                    </div>
                    <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                    <button class="cart-item-remove" onclick="removeFromCart(${idx})">
                        <span class="material-icons">delete_outline</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    const discount = subtotal > 100 ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    discountEl.textContent = `-$${discount.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

function updateCartQuantity(index, delta) {
    if (!window.cartItems) return;
    const item = window.cartItems[index];
    if (!item) return;
    
    item.quantity = Math.max(1, item.quantity + delta);
    updateCartUI();
}

function removeFromCart(index) {
    if (!window.cartItems) return;
    window.cartItems.splice(index, 1);
    updateCartUI();
    showToast('Tarjeta eliminada del carrito', 'info');
}

function clearCart() {
    if (!window.cartItems || window.cartItems.length === 0) return;
    if (confirm('¿Vaciar completamente el carrito?')) {
        window.cartItems = [];
        updateCartUI();
        showToast('Carrito vaciado', 'info');
    }
}

function toggleCart() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    panel.classList.toggle('active');
    overlay.classList.toggle('active');
}

function checkout() {
    const cartItems = window.cartItems || [];
    if (cartItems.length === 0) {
        showToast('El carrito está vacío', 'error');
        return;
    }
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = total > 100 ? total * 0.1 : 0;
    const finalTotal = total - discount;
    
    if (confirm(`💰 Total a pagar: $${finalTotal.toFixed(2)} USD\n¿Procesar pago?`)) {
        showToast('✅ Pago procesado con éxito. Revisa tu correo.', 'success');
        window.cartItems = [];
        updateCartUI();
        toggleCart();
    }
}

// ============ DEPÓSITO ============
function openDepositModal() {
    document.getElementById('depositModal').classList.add('active');
}

function closeDepositModal() {
    document.getElementById('depositModal').classList.remove('active');
}

function selectMethod(method) {
    const buttons = document.querySelectorAll('.method-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.method-btn').classList.add('active');
    
    const addresses = {
        btc: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        eth: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        usdt: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    };
    document.getElementById('depositAddress').textContent = addresses[method] || addresses.btc;
}

function copyAddress() {
    const address = document.getElementById('depositAddress').textContent;
    navigator.clipboard.writeText(address).then(() => {
        showToast('Dirección copiada al portapapeles', 'success');
    });
}

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-container');
    if (!existing) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };
    
    toast.style.cssText = `
        background: var(--bg-secondary, #1a232e);
        color: var(--text-primary, #e8edf2);
        padding: 12px 24px;
        border-radius: 12px;
        border-left: 4px solid ${colors[type] || colors.info};
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        font-size: 14px;
        font-weight: 500;
        pointer-events: auto;
        animation: slideUp 0.3s ease;
        min-width: 200px;
        text-align: center;
        border: 1px solid var(--border-color, #2a313c);
    `;
    
    toast.textContent = message;
    document.querySelector('.toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Agregar estilos de animación para toast
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideDown {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
    }
    .rotating {
        animation: rotate 0.8s ease-in-out;
    }
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spinning {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

// ============ EXPORTAR PARA USO GLOBAL ============
window.addToCart = addToCart;
window.updateCartUI = updateCartUI;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.runChecker = runChecker;
window.uploadFile = uploadFile;
window.clearChecker = clearChecker;
window.startOTPBot = startOTPBot;
window.applyFilters = applyFilters;
window.changePage = changePage;
window.refreshCatalog = refreshCatalog;
window.openDepositModal = openDepositModal;
window.closeDepositModal = closeDepositModal;
window.selectMethod = selectMethod;
window.copyAddress = copyAddress;
window.showToast = showToast;
