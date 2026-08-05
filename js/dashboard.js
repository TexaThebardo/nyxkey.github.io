// ============================================
// DASHBOARD.JS - Lógica del Dashboard
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/nyxkey.github.io/login.html';
        return;
    }
    
    loadDashboardData();
    setupNavigation();
    updateDateTime();
});

function loadDashboardData() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Obtener datos completos del usuario desde localStorage
    const users = JSON.parse(localStorage.getItem('yx_users') || '[]');
    const fullUser = users.find(u => u.id === user.id);
    const purchases = fullUser?.purchases || [];
    
    // Estadísticas
    const totalPurchases = purchases.length;
    const totalSpent = purchases.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const balance = fullUser?.balance || 0;
    
    document.getElementById('totalPurchases').textContent = totalPurchases;
    document.getElementById('totalSpent').textContent = `$${totalSpent.toFixed(2)}`;
    document.getElementById('currentBalance').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('dashboardBalance').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('purchaseCount').textContent = `${totalPurchases} tarjetas`;
    
    // Renderizar compras
    renderPurchases(purchases);
    renderRecentPurchases(purchases);
    loadTransactions(fullUser);
}

// ============ RENDERIZAR COMPRAS ============
function renderPurchases(purchases) {
    const container = document.getElementById('purchasesGrid');
    
    if (purchases.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <span class="material-icons-outlined">shopping_bag</span>
                <p>No has comprado ninguna tarjeta aún</p>
                <span style="font-size:14px;color:var(--text-muted);">Visita la tienda para adquirir tarjetas</span>
            </div>
        `;
        return;
    }
    
    container.innerHTML = purchases.map((purchase, index) => `
        <div class="purchase-card">
            <div class="purchase-header">
                <span class="purchase-network">${purchase.network}</span>
                <span class="purchase-bin">${purchase.bin}</span>
                <span class="purchase-date">${new Date(purchase.purchaseDate).toLocaleDateString()}</span>
            </div>
            <div class="purchase-details">
                <div class="detail-row">
                    <span class="detail-label">Banco</span>
                    <span class="detail-value">${purchase.bank}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">País</span>
                    <span class="detail-value">${purchase.country}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Cantidad</span>
                    <span class="detail-value">${purchase.quantity}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Precio</span>
                    <span class="detail-value">$${(purchase.price * purchase.quantity).toFixed(2)}</span>
                </div>
                ${purchase.cardData ? `
                <div class="detail-row card-data">
                    <span class="detail-label">Datos de la Tarjeta</span>
                    <span class="detail-value" style="font-family:monospace;font-size:14px;">
                        ${purchase.cardData.number || '****'} | ${purchase.cardData.expiry || '**/**'} | ${purchase.cardData.cvv || '***'}
                    </span>
                </div>
                ` : ''}
            </div>
            <div class="purchase-footer">
                <span class="purchase-status completed">✅ Comprada</span>
            </div>
        </div>
    `).join('');
}

// ============ RENDERIZAR COMPRAS RECIENTES ============
function renderRecentPurchases(purchases) {
    const container = document.getElementById('recentPurchases');
    const recent = purchases.slice(-5).reverse();
    
    if (recent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons-outlined">shopping_bag</span>
                <p>No has realizado compras aún</p>
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
                <p>${p.network} ${p.bin} - ${p.quantity}x</p>
                <span class="activity-time">$${(p.price * p.quantity).toFixed(2)} · ${new Date(p.purchaseDate).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

// ============ CARGAR TRANSACCIONES ============
function loadTransactions(user) {
    const tbody = document.getElementById('transactionsBody');
    const transactions = user?.transactions || [];
    
    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:40px;color:var(--text-secondary);">
                    <span class="material-icons-outlined" style="font-size:48px;display:block;">receipt_long</span>
                    No hay transacciones registradas
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = transactions.slice().reverse().slice(0, 20).map(t => `
        <tr>
            <td><code>${t.id}</code></td>
            <td><span class="transaction-type ${t.type}">${t.type}</span></td>
            <td>$${t.amount.toFixed(2)}</td>
            <td><span class="status-badge ${t.status}">${t.status}</span></td>
            <td>${new Date(t.date).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// ============ NAVEGACIÓN ============
function setupNavigation() {
    document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const section = this.dataset.section;
            document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
            document.getElementById(section).classList.add('active');
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
