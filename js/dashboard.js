// ============================================
// DASHBOARD.JS - Lógica del Dashboard
// ============================================

console.log('📊 Dashboard.js cargado');

let currentCardData = null;
let currentCardIndex = -1;

document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Dashboard iniciado');

    const user = getCurrentUser();
    if (!user) {
        console.log('❌ Usuario no autenticado');
        window.location.href = 'login.html';
        return;
    }

    console.log('👤 Usuario:', user.username);
    loadDashboardData();
    setupNavigation();
    updateDateTime();
});

// ============ CARGAR DATOS ============
function loadDashboardData() {
    const user = getCurrentUser();
    if (!user) return;

    const users = getUsers();
    const fullUser = users.find(u => u.id === user.id);

    console.log('📦 Datos completos:', fullUser);

    const purchases = fullUser?.purchases || [];
    const transactions = fullUser?.transactions || [];
    const balance = fullUser?.balance || 0;

    console.log('📦 Compras:', purchases.length);
    console.log('📦 Transacciones:', transactions.length);
    console.log('💰 Saldo:', balance);

    // Estadísticas
    const totalUsers = users.length || 0;
    let totalAdmins = 0;
    try {
        const stored = localStorage.getItem('admin_whitelist');
        if (stored) {
            const data = JSON.parse(stored);
            totalAdmins = data.admins ? data.admins.length : 0;
        }
    } catch (e) {}

    const elements = {
        totalPurchases: document.getElementById('totalPurchases'),
        totalUsers: document.getElementById('totalUsers'),
        totalAdmins: document.getElementById('totalAdmins'),
        currentBalance: document.getElementById('currentBalance'),
        dashboardBalance: document.getElementById('dashboardBalance'),
        purchaseCount: document.getElementById('purchaseCount')
    };

    if (elements.totalPurchases) elements.totalPurchases.textContent = purchases.length;
    if (elements.totalUsers) elements.totalUsers.textContent = totalUsers;
    if (elements.totalAdmins) elements.totalAdmins.textContent = totalAdmins;
    if (elements.currentBalance) elements.currentBalance.textContent = `$${balance.toFixed(2)}`;
    if (elements.dashboardBalance) elements.dashboardBalance.textContent = `$${balance.toFixed(2)}`;
    if (elements.purchaseCount) elements.purchaseCount.textContent = `${purchases.length} tarjetas`;

    renderPurchases(purchases);
    renderRecentPurchases(purchases);
    renderTransactions(transactions);
}

// ============ RENDERIZAR COMPRAS ============
function renderPurchases(purchases) {
    const container = document.getElementById('purchasesGrid');
    if (!container) return;

    if (purchases.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <span class="material-icons-outlined" style="font-size:48px;display:block;margin-bottom:12px;color:#5a6575;">shopping_bag</span>
                <p style="font-size:18px;font-weight:600;color:#e8edf2;">No has comprado ninguna tarjeta aún</p>
                <span style="font-size:14px;color:#a0aab8;">Visita la tienda para adquirir tarjetas</span>
            </div>
        `;
        return;
    }

    container.innerHTML = purchases.map((p, index) => {
        const networkColor = getNetworkColor(p.network);
        return `
            <div class="purchase-card" data-index="${index}">
                <div class="purchase-header">
                    <span class="purchase-network" style="color:${networkColor};">${p.network || 'N/A'}</span>
                    <span class="purchase-bin">${p.bin || '****'}</span>
                    <span class="purchase-date">${p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString() : '-'}</span>
                </div>
                <div class="purchase-details">
                    <div class="detail-row">
                        <span class="detail-label">Banco</span>
                        <span class="detail-value">${p.bank || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">País</span>
                        <span class="detail-value">${p.country || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Cantidad</span>
                        <span class="detail-value">${p.quantity || 1}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Precio</span>
                        <span class="detail-value">$${((p.price || 0) * (p.quantity || 1)).toFixed(2)}</span>
                    </div>
                </div>
                <div class="purchase-footer">
                    <span class="purchase-status completed">
                        <span class="material-icons" style="font-size:14px;">check_circle</span>
                        Comprada
                    </span>
                    <button class="btn-show-data" onclick="showCardData(${index})">
                        <span class="material-icons">visibility</span>
                        Mostrar Datos
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ============ RENDERIZAR COMPRAS RECIENTES ============
function renderRecentPurchases(purchases) {
    const container = document.getElementById('recentPurchases');
    if (!container) return;

    const recent = purchases.slice(-5).reverse();

    if (recent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons-outlined" style="font-size:32px;display:block;margin-bottom:8px;color:#5a6575;">shopping_bag</span>
                <p style="color:#a0aab8;">No has realizado compras aún</p>
            </div>
        `;
        return;
    }

    container.innerHTML = recent.map(p => `
        <div class="activity-item">
            <span class="activity-icon">
                <span class="material-icons-outlined">credit_card</span>
            </span>
            <div class="activity-content">
                <p>${p.network || 'N/A'} ${p.bin || '****'} - ${p.quantity || 1}x</p>
                <span class="activity-time">$${((p.price || 0) * (p.quantity || 1)).toFixed(2)} · ${p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString() : '-'}</span>
            </div>
        </div>
    `).join('');
}

// ============ RENDERIZAR TRANSACCIONES ============
function renderTransactions(transactions) {
    const tbody = document.getElementById('transactionsBody');
    if (!tbody) return;

    if (!transactions || transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:40px;color:#5a6575;">
                    <span class="material-icons-outlined" style="font-size:48px;display:block;margin-bottom:8px;">receipt_long</span>
                    No hay transacciones registradas
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = transactions.slice().reverse().slice(0, 20).map(t => `
        <tr>
            <td><code style="background:#0b0e14;padding:4px 8px;border-radius:4px;font-size:12px;color:#a0aab8;">${t.id || 'N/A'}</code></td>
            <td><span class="transaction-type ${t.type || 'desconocido'}">${t.type || 'Desconocido'}</span></td>
            <td>$${(t.amount || 0).toFixed(2)}</td>
            <td><span class="status-badge ${t.status || 'pendiente'}">${t.status || 'Pendiente'}</span></td>
            <td>${t.date ? new Date(t.date).toLocaleDateString() : '-'}</td>
        </tr>
    `).join('');
}

// ============ MOSTRAR DATOS DE LA TARJETA ============
function showCardData(index) {
    console.log('🔍 showCardData llamado con índice:', index);
    
    const user = getCurrentUser();
    if (!user) {
        showToast('❌ Usuario no autenticado', 'error');
        return;
    }

    const users = getUsers();
    const fullUser = users.find(u => u.id === user.id);
    if (!fullUser) {
        showToast('❌ Usuario no encontrado', 'error');
        return;
    }

    const purchases = fullUser.purchases || [];
    console.log('📦 Total compras:', purchases.length);
    
    if (index < 0 || index >= purchases.length) {
        showToast('❌ Tarjeta no encontrada', 'error');
        return;
    }

    const purchase = purchases[index];
    console.log('📦 Compra seleccionada:', purchase);
    
    if (!purchase) {
        showToast('❌ No se encontraron datos de esta tarjeta', 'error');
        return;
    }

    // Guardar datos para copiar
    currentCardData = purchase;
    currentCardIndex = index;

    // Preparar número de tarjeta con formato
    const cardNumber = purchase.cardData?.number || '**** **** **** ****';
    const formattedNumber = cardNumber.replace(/(.{4})/g, '$1 ').trim();

    // Mostrar en el modal
    const typeBadge = document.getElementById('modalCardType');
    typeBadge.textContent = purchase.network || 'N/A';
    typeBadge.className = `card-type-badge ${(purchase.network || '').toLowerCase()}`;
    
    document.getElementById('modalCardNumber').textContent = formattedNumber;
    document.getElementById('modalCardExpiry').textContent = purchase.cardData?.expiry || '**/**';
    document.getElementById('modalCardCvv').textContent = purchase.cardData?.cvv || '***';
    document.getElementById('modalCardBank').textContent = purchase.bank || 'N/A';
    document.getElementById('modalCardCountry').textContent = purchase.country || 'N/A';

    document.getElementById('cardDataModal').classList.add('active');
    console.log('✅ Modal abierto');
}

// ============ CERRAR MODAL ============
function closeCardDataModal() {
    document.getElementById('cardDataModal').classList.remove('active');
    currentCardData = null;
    currentCardIndex = -1;
}

// ============ COPIAR DATOS COMPLETOS ============
function copyCardData() {
    if (!currentCardData) {
        showToast('❌ No hay datos para copiar', 'error');
        return;
    }

    const card = currentCardData;
    const cardNumber = card.cardData?.number || '****';
    const expiry = card.cardData?.expiry || '**/**';
    const cvv = card.cardData?.cvv || '***';
    const network = card.network || 'N/A';
    const bank = card.bank || 'N/A';
    const country = card.country || 'N/A';

    const textToCopy = `🃏 DATOS DE LA TARJETA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏷️ Red: ${network}
💳 Número: ${cardNumber}
📅 Expira: ${expiry}
🔐 CVV: ${cvv}
🏦 Banco: ${bank}
🌍 País: ${country}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Comprada: ${card.purchaseDate ? new Date(card.purchaseDate).toLocaleDateString() : 'N/A'}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('✅ Datos copiados al portapapeles', 'success');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('✅ Datos copiados al portapapeles', 'success');
    });
}

// ============ FUNCIÓN AUXILIAR ============
function getNetworkColor(network) {
    const colors = {
        'VISA': '#1a539a',
        'MASTERCARD': '#eb0a1e',
        'AMEX': '#0066cc',
        'DISCOVER': '#ff6600'
    };
    return colors[network] || '#a0aab8';
}

// ============ NAVEGACIÓN ============
function setupNavigation() {
    console.log('🔧 Configurando navegación...');
    const links = document.querySelectorAll('.sidebar-link[data-section]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.dataset.section;
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
            const section = document.getElementById(sectionId);
            if (section) section.classList.add('active');
        });
    });
}

function updateDateTime() {
    const date = new Date();
    const el = document.getElementById('currentDate');
    if (el) {
        el.textContent = date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// ============ TOAST ============
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    const colors = { success: '#2ecc71', error: '#e74c3c', info: '#3498db', warning: '#f39c12' };
    toast.style.cssText = `
        background: #1a232e;
        color: #e8edf2;
        padding: 10px 22px;
        border-radius: 12px;
        border-left: 4px solid ${colors[type] || colors.info};
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        font-size: 14px;
        font-weight: 500;
        pointer-events: auto;
        animation: slideUpToast 0.3s ease;
        min-width: 200px;
        text-align: center;
        border: 1px solid #2a313c;
    `;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideDownToast 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============ EXPORTAR ============
window.showCardData = showCardData;
window.closeCardDataModal = closeCardDataModal;
window.copyCardData = copyCardData;
window.showToast = showToast;

console.log('✅ dashboard.js cargado correctamente');
