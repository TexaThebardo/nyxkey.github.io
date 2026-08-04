// ============================================
// DASHBOARD.JS - Lógica del Dashboard
// ============================================

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticación
    if (!requireAuth()) return;
    
    // Cargar datos
    await loadDashboardData();
    setupNavigation();
    setupCharts();
    updateDateTime();
});

// ============ CARGAR DATOS ============
async function loadDashboardData() {
    try {
        const products = await getProducts();
        const stats = await getProductStats();
        const user = getCurrentUser();
        
        // Actualizar estadísticas
        document.getElementById('totalProducts').textContent = stats.total;
        document.getElementById('totalStock').textContent = stats.totalStock;
        document.getElementById('totalRevenue').textContent = `$${stats.totalValue.toFixed(2)}`;
        document.getElementById('totalCustomers').textContent = Math.floor(Math.random() * 100) + 50;
        
        // Actualizar balance
        if (user) {
            document.getElementById('dashboardBalance').textContent = `$${user.balance.toFixed(2)}`;
        }
        
        // Cargar inventario
        renderInventory(products);
        
        // Cargar transacciones
        await loadTransactions();
        
        // Cargar actividad
        renderRecentActivity(products);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Error al cargar los datos', 'error');
    }
}

// ============ RENDERIZAR INVENTARIO ============
function renderInventory(products, filter = 'all', search = '') {
    const container = document.getElementById('inventoryList');
    let filtered = [...products];
    
    if (filter === 'active') {
        filtered = filtered.filter(p => p.active !== false);
    } else if (filter === 'inactive') {
        filtered = filtered.filter(p => p.active === false);
    } else if (filter === 'low') {
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
                <button onclick="toggleProductStatus(${p.id})" class="btn-icon">
                    <span class="material-icons-outlined">${p.active !== false ? 'visibility' : 'visibility_off'}</span>
                </button>
                <button onclick="deleteProduct(${p.id})" class="btn-icon danger">
                    <span class="material-icons-outlined">delete</span>
                </button>
            </div>
        </div>
    `).join('');
}

// ============ CARGAR TRANSACCIONES ============
async function loadTransactions() {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
        const response = await API.getTransactionHistory(user.id);
        const tbody = document.getElementById('transactionsBody');
        
        if (!response.success || response.transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        <span class="material-icons-outlined" style="font-size: 48px; display: block;">receipt_long</span>
                        No hay transacciones registradas
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = response.transactions.map(t => `
            <tr>
                <td><code>${t.id}</code></td>
                <td><span class="transaction-type ${t.type}">${t.type}</span></td>
                <td>$${t.amount}</td>
                <td><span class="status-badge ${t.status}">${t.status}</span></td>
                <td>${new Date(t.date).toLocaleDateString()}</td>
                <td>
                    <button onclick="viewTransaction('${t.id}')" class="btn-icon">
                        <span class="material-icons-outlined">visibility</span>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// ============ RENDERIZAR ACTIVIDAD RECIENTE ============
function renderRecentActivity(products) {
    const container = document.getElementById('activityList');
    const activities = products.slice(0, 5).map(p => ({
        type: 'stock_update',
        message: `Actualización de stock: ${p.network} ${p.bin} → ${p.stock} unidades`,
        time: new Date(p.updatedAt || Date.now()),
        icon: 'inventory_2'
    }));
    
    if (activities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No hay actividad reciente</p>
            </div>
        `;
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

// ============ CONFIGURAR NAVEGACIÓN ============
function setupNavigation() {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover activo
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección
            const section = this.dataset.section;
            document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
            document.getElementById(section).classList.add('active');
        });
    });
}

// ============ CONFIGURAR GRÁFICOS ============
function setupCharts() {
    // Datos de ejemplo para gráficos
    const networkData = {
        labels: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'],
        values: [45, 30, 15, 10]
    };
    
    const countryData = {
        labels: ['🇺🇸 US', '🇩🇴 DO', '🇲🇽 MX', '🇨🇦 CA', '🇬🇧 GB'],
        values: [55, 20, 10, 10, 5]
    };
    
    // Renderizar gráficos (simulación visual)
    renderChart('networkChart', networkData, 'Ventas por Red');
    renderChart('countryChart', countryData, 'Distribución por País');
}

function renderChart(containerId, data, title) {
    const container = document.getElementById(containerId);
    const maxValue = Math.max(...data.values);
    
    let bars = data.labels.map((label, i) => {
        const percentage = (data.values[i] / maxValue) * 100;
        const color = ['#f0b90b', '#3498db', '#2ecc71', '#e74c3c', '#9b59b6'][i % 5];
        return `
            <div class="chart-bar-item">
                <div class="chart-bar" style="height: ${percentage}%; background: ${color};"></div>
                <span class="chart-label">${label}</span>
                <span class="chart-value">${data.values[i]}</span>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="chart-bars">
            ${bars}
        </div>
    `;
}

// ============ FUNCIONES DE UTILIDAD ============
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
    document.getElementById('currentDate').textContent = date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function filterInventory(search) {
    const products = getProducts();
    renderInventory(products, document.querySelector('.inventory-controls select').value, search);
}

function filterInventoryByStatus(status) {
    const search = document.querySelector('.inventory-controls input').value;
    const products = getProducts();
    renderInventory(products, status, search);
}

function filterTransactions(type) {
    // Implementar filtro de transacciones
    loadTransactions();
}

function editProduct(id) {
    showToast(`Editando producto ${id}...`, 'info');
}

function toggleProductStatus(id) {
    showToast(`Cambiando estado del producto ${id}...`, 'info');
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        showToast(`Producto ${id} eliminado`, 'success');
    }
}

function addProduct() {
    showToast('Abriendo formulario de nuevo producto...', 'info');
}

function viewTransaction(id) {
    showToast(`Ver transacción ${id}`, 'info');
}

// ============ EXPORTAR ============
window.filterInventory = filterInventory;
window.filterInventoryByStatus = filterInventoryByStatus;
window.filterTransactions = filterTransactions;
window.editProduct = editProduct;
window.toggleProductStatus = toggleProductStatus;
window.deleteProduct = deleteProduct;
window.addProduct = addProduct;
window.viewTransaction = viewTransaction;
