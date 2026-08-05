// ============================================
// DASHBOARD.JS - Lógica del Dashboard
// ============================================

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

    const users = JSON.parse(localStorage.getItem('yx_users') || '[]');
    const fullUser = users.find(u => u.id === user.id);

    console.log('📦 Datos completos:', fullUser);

    const purchases = fullUser?.purchases || [];
    const transactions = fullUser?.transactions || [];
    const balance = fullUser?.balance || 0;

    // ============ ESTADÍSTICAS ACTUALIZADAS ============
    // Total de usuarios registrados
    const totalUsers = users.length || 0;

    // Total de administradores
    let totalAdmins = 0;
    if (typeof getAdminList === 'function') {
        const admins = getAdminList();
        totalAdmins = admins.length || 0;
    } else if (typeof ADMIN_LIST !== 'undefined') {
        totalAdmins = ADMIN_LIST.length || 0;
    } else {
        try {
            const stored = localStorage.getItem('admin_whitelist');
            if (stored) {
                const data = JSON.parse(stored);
                totalAdmins = data.admins ? data.admins.length : 0;
            }
        } catch (e) {}
    }

    console.log('📦 Usuarios totales:', totalUsers);
    console.log('📦 Administradores:', totalAdmins);

    // Actualizar estadísticas
    document.getElementById('totalPurchases').textContent = purchases.length;
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalAdmins').textContent = totalAdmins;
    document.getElementById('currentBalance').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('dashboardBalance').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('purchaseCount').textContent = `${purchases.length} tarjetas`;

    // Renderizar secciones
    renderPurchases(purchases);
    renderRecentPurchases(purchases);
    renderTransactions(transactions);
}

// ============ RENDERIZAR COMPRAS ============
function renderPurchases(purchases) {
    const container = document.getElementById('purchasesGrid');
    if (!container) {
        console.log('❌ purchasesGrid no encontrado');
        return;
    }

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

    container.innerHTML = purchases.map(p => `
        <div class="purchase-card">
            <div class="purchase-header">
                <span class="purchase-network">${p.network || 'N/A'}</span>
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
                ${p.cardData ? `
                <div class="detail-row card-data">
                    <span class="detail-label">Datos</span>
                    <span class="detail-value" style="font-family:monospace;font-size:13px;">
                        ${p.cardData.number || '****'} | ${p.cardData.expiry || '**/**'} | ${p.cardData.cvv || '***'}
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
    if (!container) {
        console.log('❌ recentPurchases no encontrado');
        return;
    }

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
    if (!tbody) {
        console.log('❌ transactionsBody no encontrado');
        return;
    }

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

// ============ NAVEGACIÓN ============
function setupNavigation() {
    console.log('🔧 Configurando navegación...');

    const links = document.querySelectorAll('.sidebar-link[data-section]');
    console.log('📎 Enlaces encontrados:', links.length);

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.dataset.section;
            console.log('🔄 Click en:', sectionId);

            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));

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

console.log('✅ dashboard.js cargado correctamente');
