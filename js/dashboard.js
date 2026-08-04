// ============================================
// DASHBOARD.JS - Lógica del Dashboard
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    loadDashboardData();
    setupNavigation();
    updateDateTime();
});

function loadDashboardData() {
    const products = getProducts();
    const stats = getProductStats();
    const user = getCurrentUser();
    
    document.getElementById('totalProducts').textContent = stats.total || 0;
    document.getElementById('totalStock').textContent = stats.totalStock || 0;
    document.getElementById('totalRevenue').textContent = `$${(stats.totalValue || 0).toFixed(2)}`;
    document.getElementById('totalCustomers').textContent = Math.floor(Math.random() * 50) + 10;
    
    if (user) {
        document.getElementById('dashboardBalance').textContent = `$${(user.balance || 0).toFixed(2)}`;
    }
    
    renderInventory(products);
    loadTransactions();
    renderRecentActivity(products);
}

function renderInventory(products, filter = 'all', search = '') {
    const container = document.getElementById('inventoryList');
    let filtered = [...products];
    
    if (filter === 'active') {
        filtered = filtered.filter(p => p.active !== false);
    }
    if (filter === 'low') {
        filtered = filtered.filter(p => p.stock < 10);
    }
    if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p => 
            p.bin.includes(s) || 
            p.bank.toLowerCase().includes(s) ||
            p.network.toLowerCase().includes(s)
        );
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons-outlined">inventory_2</span>
                <p>No hay productos para mostrar</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(p => `
        <div class="inventory-item">
            <div class="item-info">
                <div class="item-main">
                    <span class="item-network">${p.network}</span>
                    <span class="item-bin">${p.bin}</span>
                    <span class="item-bank">${p.bank}</span>
                </div>
                <div class="item-details">
                    <span>${p.country}</span>
                    <span>${p.type}</span>
                    <span class="item-price">$${p.price.toFixed(2)}</span>
                </div>
            </div>
            <div class="item-stock">
                <span class="stock-badge ${p.stock < 10 ? 'low' : p.stock < 25 ? 'medium' : 'high'}">
                    ${p.stock} unidades
                </span>
            </div>
            <div class="item-actions">
                <button onclick="editProduct(${p.id})" class="btn-icon">
                    <span class="material-icons-outlined">edit</span>
                </button>
                <button onclick="deleteProduct(${p.id})" class="btn-icon danger">
                    <span class="material-icons-outlined">delete</span>
                </button>
            </div>
        </div>
    `).join('');
}

function loadTransactions() {
    const user = getCurrentUser();
    const tbody = document.getElementById('transactionsBody');
    
    if (!user || !user.transactions || user.transactions.length === 0) {
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
    
    tbody.innerHTML = user.transactions.slice().reverse().slice(0, 10).map(t => `
        <tr>
            <td><code>${t.id}</code></td>
            <td><span class="transaction-type ${t.type}">${t.type}</span></td>
            <td>$${t.amount.toFixed(2)}</td>
            <td><span class="status-badge ${t.status}">${t.status}</span></td>
            <td>${new Date(t.date).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

function renderRecentActivity(products) {
    const container = document.getElementById('activityList');
    const activities = products.slice(0, 5).map(p => ({
        message: `Actualización: ${p.network} ${p.bin} → ${p.stock} unidades`,
        time: new Date(),
        icon: 'inventory_2'
    }));
    
    if (activities.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No hay actividad reciente</p></div>`;
        return;
    }
    
    container.innerHTML = activities.map(a => `
        <div class="activity-item">
            <span class="activity-icon">
                <span class="material-icons-outlined">${a.icon}</span>
            </span>
            <div class="activity-content">
                <p>${a.message}</p>
                <span class="activity-time">${timeAgo(a.time)}</span>
            </div>
        </div>
    `).join('');
}

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

function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'hace ' + seconds + 's';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return 'hace ' + minutes + 'm';
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return 'hace ' + hours + 'h';
    const days = Math.floor(hours / 24);
    return 'hace ' + days + 'd';
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

function filterInventory(search) {
    const products = getProducts();
    const status = document.querySelector('.inventory-controls select').value;
    renderInventory(products, status, search);
}

function filterInventoryByStatus(status) {
    const products = getProducts();
    const search = document.querySelector('.inventory-controls input').value;
    renderInventory(products, status, search);
}

function editProduct(id) {
    showToast(`Editando producto ${id}...`, 'info');
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        showToast(`Producto ${id} eliminado`, 'success');
    }
}

function addProduct() {
    showToast('Abriendo formulario de nuevo producto...', 'info');
}

window.filterInventory = filterInventory;
window.filterInventoryByStatus = filterInventoryByStatus;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.addProduct = addProduct;
