// ============================================
// DASHBOARD.JS - Lógica del Dashboard
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Dashboard cargado');
    
    const user = getCurrentUser();
    if (!user) {
        console.log('❌ Usuario no autenticado, redirigiendo...');
        window.location.href = '/nyxkey.github.io/login.html';
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
    
    // Obtener datos completos del usuario desde localStorage
    const users = JSON.parse(localStorage.getItem('yx_users') || '[]');
    const fullUser = users.find(u => u.id === user.id);
    
    console.log('📦 Datos completos del usuario:', fullUser);
    
    const purchases = fullUser?.purchases || [];
    const transactions = fullUser?.transactions || [];
    const balance = fullUser?.balance || 0;
    
    console.log('📦 Compras encontradas:', purchases.length);
    console.log('📦 Transacciones encontradas:', transactions.length);
    
    // Estadísticas
    const totalPurchases = purchases.length;
    const totalSpent = purchases.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    document.getElementById('totalPurchases').textContent = totalPurchases;
    document.getElementById('totalSpent').textContent = `$${totalSpent.toFixed(2)}`;
    document.getElementById('currentBalance').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('dashboardBalance').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('purchaseCount').textContent = `${totalPurchases} tarjetas`;
    
    // Renderizar secciones
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
                <span class="material-icons-outlined" style="font-size:48px;display:block;margin-bottom:12px;color:var(--text-muted);">shopping_bag</span>
                <p style="font-size:18px;font-weight:600;">No has comprado ninguna tarjeta aún</p>
                <span style="font-size:14px;color:var(--text-muted);">Visita la tienda para adquirir tarjetas</span>
            </div>
        `;
        return;
    }
    
    container.innerHTML = purchases.map((purchase, index) => `
        <div class="purchase-card">
            <div class="purchase-header">
                <span class="purchase-network">${purchase.network || 'N/A'}</span>
                <span class="purchase-bin">${purchase.bin || '****'}</span>
                <span class="purchase-date">${purchase.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString() : 'Fecha desconocida'}</span>
            </div>
            <div class="purchase-details">
                <div class="detail-row">
                    <span class="detail-label">Banco</span>
                    <span class="detail-value">${purchase.bank || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">País</span>
                    <span class="detail-value">${purchase.country || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Cantidad</span>
                    <span class="detail-value">${purchase.quantity || 1}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Precio</span>
                    <span class="detail-value">$${((purchase.price || 0) * (purchase.quantity || 1)).toFixed(2)}</span>
                </div>
                ${purchase.cardData ? `
                <div class="detail-row card-data">
                    <span class="detail-label">Datos de la Tarjeta</span>
                    <span class="detail-value" style="font-family:monospace;font-size:14px;">
                        ${purchase.cardData.number || '****'} | ${purchase.cardData.expiry || '**/**'} | ${purchase.cardData.cvv || '***'}
                    </span>
                </div>
                ` : `
                <div class="detail-row card-data">
                    <span class="detail-label">Datos de la Tarjeta</span>
                    <span class="detail-value" style="font-family:monospace;font-size:14px;color:var(--text-muted);">
                        🔒 Datos protegidos
                    </span>
                </div>
                `}
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
    
    if (!container) return;
    
    const recent = purchases.slice(-5).reverse();
    
    if (recent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons-outlined" style="font-size:32px;display:block;margin-bottom:8px;color:var(--text-muted);">shopping_bag</span>
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
                <p>${p.network || 'N/A'} ${p.bin || '****'} - ${p.quantity || 1}x</p>
                <span class="activity-time">$${((p.price || 0) * (p.quantity || 1)).toFixed(2)} · ${p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString() : 'Fecha desconocida'}</span>
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
                <td colspan="5" style="text-align:center;padding:40px;color:var(--text-secondary);">
                    <span class="material-icons-outlined" style="font-size:48px;display:block;margin-bottom:8px;">receipt_long</span>
                    No hay transacciones registradas
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = transactions.slice().reverse().slice(0, 20).map(t => `
        <tr>
            <td><code style="background:var(--bg-primary);padding:4px 8px;border-radius:4px;font-size:12px;">${t.id || 'N/A'}</code></td>
            <td><span class="transaction-type ${t.type || 'desconocido'}">${t.type || 'Desconocido'}</span></td>
            <td>$${(t.amount || 0).toFixed(2)}</td>
            <td><span class="status-badge ${t.status || 'pendiente'}">${t.status || 'Pendiente'}</span></td>
            <td>${t.date ? new Date(t.date).toLocaleDateString() : 'Fecha desconocida'}</td>
        </tr>
    `).join('');
}

// ============ NAVEGACIÓN ============
function setupNavigation() {
    console.log('🔧 Configurando navegación...');
    
    const links = document.querySelectorAll('.sidebar-link[data-section]');
    console.log('📎 Enlaces encontrados:', links.length);
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Click en:', this.dataset.section);
            
            // Quitar active de todos
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Ocultar todas las secciones
            document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
            
            // Mostrar la sección seleccionada
            const sectionId = this.dataset.section;
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
                console.log('✅ Sección mostrada:', sectionId);
            } else {
                console.log('❌ Sección no encontrada:', sectionId);
            }
        });
    });
}

// ============ ACTUALIZAR FECHA ============
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

// ============ EXPORTAR ============
console.log('✅ dashboard.js cargado correctamente');
