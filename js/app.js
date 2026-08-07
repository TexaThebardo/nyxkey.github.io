// ============================================
// APP.JS - Lógica Principal (INDEX.HTML)
// ============================================

console.log('🚀 App.js cargado');

let currentPage = 1;
const itemsPerPage = 8;
let currentFilter = { country: '', search: '' };
let viewMode = 'grid'; // 'list', 'grid', 'compact'

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado - iniciando app');
    
    const catalogBody = document.getElementById('catalogBody');
    if (!catalogBody) {
        console.log('ℹ️ catalogBody no encontrado - probablemente estamos en dashboard.html');
        return;
    }
    
    loadProductsFromJSON();
    
    if (typeof loadCart === 'function') {
        console.log('🔄 loadCart encontrada, ejecutando...');
        loadCart();
    } else {
        console.warn('⚠️ loadCart no está definida - asegúrate de cargar cart.js');
    }
    
    if (typeof updateUserUI === 'function') {
        updateUserUI();
    } else {
        console.warn('⚠️ updateUserUI no está definida - asegúrate de cargar auth.js');
    }
    
    // Cargar vista guardada
    const savedView = localStorage.getItem('yx_view_mode');
    if (savedView) {
        viewMode = savedView;
    }
    updateViewButtons();
    
    renderCatalog();
    updateStats();
    updateDateTime();
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
    
    const overlay = document.getElementById('cartOverlay');
    if (overlay) overlay.addEventListener('click', toggleCart);
    
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeDepositModal();
        });
    }
});

function showSection(sectionId) {
    document.querySelectorAll('.catalog-section, .services-section').forEach(el => el.style.display = 'none');
    const section = document.getElementById(sectionId);
    if (section) section.style.display = 'block';
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
}

// ============ CAMBIO DE VISTA ============
function changeView(mode) {
    viewMode = mode;
    localStorage.setItem('yx_view_mode', mode);
    updateViewButtons();
    renderCatalog();
    showToast(`Vista: ${mode === 'list' ? 'Lista' : mode === 'grid' ? 'Tarjetas' : 'Compacta'}`, 'info');
}

function updateViewButtons() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewMode) {
            btn.classList.add('active');
        }
    });
}

// ============ RENDERIZAR CATÁLOGO ============
function renderCatalog() {
    const container = document.getElementById('catalogBody');
    if (!container) {
        console.warn('⚠️ catalogBody no encontrado - saltando renderizado');
        return;
    }
    
    const products = getProducts();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = products.slice(start, end);
    
    if (pageItems.length === 0) {
        container.innerHTML = `<div class="empty-catalog"><span class="material-icons-outlined" style="font-size:48px;display:block;margin-bottom:12px;">search_off</span><p>No se encontraron tarjetas</p></div>`;
    } else {
        if (viewMode === 'list') {
            container.innerHTML = renderListView(pageItems);
            container.className = 'catalog-view-list';
        } else if (viewMode === 'grid') {
            container.innerHTML = renderGridView(pageItems);
            container.className = 'catalog-view-grid';
        } else if (viewMode === 'compact') {
            container.innerHTML = renderCompactView(pageItems);
            container.className = 'catalog-view-compact';
        }
    }
    
    const showingCount = document.getElementById('showingCount');
    if (showingCount) showingCount.textContent = products.length;
    const currentPageEl = document.getElementById('currentPage');
    if (currentPageEl) currentPageEl.textContent = currentPage;
}

// ============ VISTA LISTA (TABLA) ============
function renderListView(products) {
    return `
        <table>
            <thead>
                <tr>
                    <th>Red</th>
                    <th>BIN</th>
                    <th>Base</th>
                    <th>Clase</th>
                    <th>Nivel</th>
                    <th>Banco</th>
                    <th>País</th>
                    <th>Tipo</th>
                    <th>Uso</th>
                    <th>Non VBV</th>
                    <th>Non MSC</th>
                    <th>Precio</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                ${products.map((card) => {
                    const realIndex = allProducts.indexOf(card);
                    const networkColor = getNetworkColor(card.network);
                    const starsHtml = renderStars(card.rating || 0);
                    const stockStatus = getStockStatus(card.stock);
                    const isNew = card.id > 20;
                    
                    return `
                        <tr>
                            <td style="color:${networkColor}; font-weight:700;">${card.network}</td>
                            <td><strong>${card.bin}</strong></td>
                            <td>${card.database}</td>
                            <td>${card.class}</td>
                            <td>${card.level}</td>
                            <td>${card.bank}</td>
                            <td>${card.country}</td>
                            <td>${card.type}</td>
                            <td>${card.uso}</td>
                            <td>${card.nonVbv ? '✓ SI' : '✗ NO'}</td>
                            <td>${card.nonMsc ? '✓ SI' : '✗ NO'}</td>
                            <td>
                                <div style="display:flex; flex-direction:column; gap:2px;">
                                    <strong style="color:var(--primary);">$${card.price.toFixed(2)}</strong>
                                    <div style="display:flex; align-items:center; gap:4px; font-size:11px; color:var(--text-muted);">
                                        <span class="rating-stars" style="font-size:12px;">${starsHtml}</span>
                                        <span>(${card.sales || 0})</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div style="display:flex; flex-direction:column; gap:4px; align-items:center;">
                                    <button class="btn-buy" onclick="addToCart(${realIndex})" ${card.stock <= 0 ? 'disabled' : ''}>
                                        <span class="material-icons">add_shopping_cart</span> Comprar
                                    </button>
                                    <div style="display:flex; align-items:center; gap:4px; font-size:10px; color:var(--text-muted);">
                                        <span class="stock-indicator">
                                            <span class="dot ${stockStatus.dot}"></span>
                                            ${stockStatus.label}
                                        </span>
                                        ${isNew ? '<span class="product-new-badge">Nuevo</span>' : ''}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// ============ VISTA GRID (TARJETAS) ============
function renderGridView(products) {
    return products.map((card) => {
        const realIndex = allProducts.indexOf(card);
        const networkColor = getNetworkColor(card.network);
        const starsHtml = renderStars(card.rating || 0);
        const stockStatus = getStockStatus(card.stock);
        const isNew = card.id > 20;
        
        return `
            <div class="product-card">
                <div class="product-card-header">
                    <div class="product-card-network" style="color:${networkColor};">
                        <span class="material-icons">${getNetworkIcon(card.network)}</span>
                        ${card.network}
                    </div>
                    <div class="product-card-badge">
                        ${isNew ? '<span class="product-new-badge">Nuevo</span>' : ''}
                        <span class="stock-indicator">
                            <span class="dot ${stockStatus.dot}"></span>
                            ${stockStatus.label}
                        </span>
                    </div>
                </div>
                <div class="product-card-body">
                    <div class="product-card-bin">${card.bin}</div>
                    <div class="product-card-bank">${card.bank}</div>
                    <div class="product-card-country">${card.country}</div>
                    <div class="product-card-type">
                        <span class="type-badge ${card.type === 'CC Full' ? 'full' : 'nonvbv'}">${card.type}</span>
                        <span class="uso-badge">${card.uso}</span>
                    </div>
                    <div class="product-card-features">
                        <span class="feature ${card.nonVbv ? 'active' : 'inactive'}">
                            <span class="material-icons">${card.nonVbv ? 'check_circle' : 'cancel'}</span>
                            Non VBV
                        </span>
                        <span class="feature ${card.nonMsc ? 'active' : 'inactive'}">
                            <span class="material-icons">${card.nonMsc ? 'check_circle' : 'cancel'}</span>
                            Non MSC
                        </span>
                    </div>
                    <div class="product-card-rating">
                        <span class="rating-stars">${starsHtml}</span>
                        <span>${card.sales || 0} ventas</span>
                    </div>
                </div>
                <div class="product-card-footer">
                    <div class="product-card-price">$${card.price.toFixed(2)}</div>
                    <button class="btn-buy" onclick="addToCart(${realIndex})" ${card.stock <= 0 ? 'disabled' : ''}>
                        <span class="material-icons">add_shopping_cart</span> Comprar
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ============ VISTA COMPACTA ============
function renderCompactView(products) {
    return products.map((card) => {
        const realIndex = allProducts.indexOf(card);
        const networkColor = getNetworkColor(card.network);
        const stockStatus = getStockStatus(card.stock);
        const isNew = card.id > 20;
        
        return `
            <div class="product-card-compact">
                <div class="compact-left">
                    <div class="compact-network" style="color:${networkColor};">
                        <span class="material-icons">${getNetworkIcon(card.network)}</span>
                        ${card.network}
                    </div>
                    <div class="compact-bin">${card.bin}</div>
                    <div class="compact-bank">${card.bank}</div>
                    <div class="compact-country">${card.country}</div>
                </div>
                <div class="compact-center">
                    <div class="compact-type">
                        <span class="type-badge ${card.type === 'CC Full' ? 'full' : 'nonvbv'}">${card.type}</span>
                        <span class="compact-uso">${card.uso}</span>
                    </div>
                    <div class="compact-features">
                        <span class="feature ${card.nonVbv ? 'active' : 'inactive'}">
                            <span class="material-icons">${card.nonVbv ? 'check_circle' : 'cancel'}</span>
                        </span>
                        <span class="feature ${card.nonMsc ? 'active' : 'inactive'}">
                            <span class="material-icons">${card.nonMsc ? 'check_circle' : 'cancel'}</span>
                        </span>
                    </div>
                    <div class="compact-stock">
                        <span class="dot ${stockStatus.dot}"></span>
                        ${stockStatus.label}
                        ${isNew ? '<span class="product-new-badge">Nuevo</span>' : ''}
                    </div>
                </div>
                <div class="compact-right">
                    <div class="compact-price">$${card.price.toFixed(2)}</div>
                    <button class="btn-buy compact-btn" onclick="addToCart(${realIndex})" ${card.stock <= 0 ? 'disabled' : ''}>
                        <span class="material-icons">add_shopping_cart</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ============ FUNCIONES AUXILIARES ============
function getNetworkColor(network) {
    const colors = {
        'VISA': '#1a539a',
        'MASTERCARD': '#eb0a1e',
        'AMEX': '#0066cc',
        'DISCOVER': '#ff6600'
    };
    return colors[network] || '#a0aab8';
}

function getNetworkIcon(network) {
    const icons = {
        'VISA': 'credit_card',
        'MASTERCARD': 'credit_card',
        'AMEX': 'credit_card',
        'DISCOVER': 'credit_card'
    };
    return icons[network] || 'credit_card';
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    let html = '';
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            html += `<span class="material-icons">star</span>`;
        } else if (i === fullStars && halfStar) {
            html += `<span class="material-icons">star_half</span>`;
        } else {
            html += `<span class="material-icons empty">star_border</span>`;
        }
    }
    return html;
}

function getStockStatus(stock) {
    if (stock > 20) return { dot: 'high', label: 'Alto' };
    if (stock > 5) return { dot: 'medium', label: 'Medio' };
    if (stock > 0) return { dot: 'low', label: 'Bajo' };
    return { dot: 'low', label: 'Agotado' };
}

function applyFilters() {
    const country = document.getElementById('filterCountry');
    const search = document.getElementById('filterSearch');
    currentFilter = { 
        country: country ? country.value : '', 
        search: search ? search.value : '' 
    };
    filteredProducts = filterProducts(currentFilter);
    currentPage = 1;
    renderCatalog();
}

function changePage(direction) {
    const products = getProducts();
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const newPage = currentPage + direction;
    if (newPage < 1 || newPage > totalPages) return;
    currentPage = newPage;
    renderCatalog();
    document.getElementById('catalogBody')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function refreshCatalog() {
    const btn = document.querySelector('.btn-refresh');
    if (btn) btn.classList.add('rotating');
    setTimeout(() => {
        if (btn) btn.classList.remove('rotating');
        loadProductsFromJSON();
        applyFilters();
        updateStats();
        showToast('Catálogo actualizado', 'success');
    }, 800);
}

function updateStats() {
    const stats = getProductStats();
    const totalCards = document.getElementById('totalCards');
    if (totalCards) totalCards.textContent = stats.total || 0;
    
    const users = getUsers();
    const totalUsers = users.length || 0;
    const totalUsersEl = document.getElementById('totalUsers');
    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
    
    let totalAdmins = 0;
    try {
        const stored = localStorage.getItem('admin_whitelist');
        if (stored) {
            const data = JSON.parse(stored);
            totalAdmins = data.admins ? data.admins.length : 0;
        }
    } catch (e) {}
    const totalAdminsEl = document.getElementById('totalAdmins');
    if (totalAdminsEl) totalAdminsEl.textContent = totalAdmins;
}

function updateDateTime() {
    const date = new Date();
    const el = document.getElementById('currentDate');
    if (el) el.textContent = date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function runChecker() {
    const input = document.getElementById('checkerInput');
    if (!input) return;
    const lines = input.value.split('\n').filter(line => line.trim());
    if (lines.length === 0) { showToast('Por favor, ingresa al menos una tarjeta', 'error'); return; }
    const btn = document.querySelector('.btn-checker');
    if (!btn) return;
    btn.disabled = true;
    btn.innerHTML = '<span class="material-icons spinning">sync</span> Verificando...';
    let approved = 0, declined = 0;
    const total = lines.length;
    const interval = setInterval(() => {
        const status = Math.random() > 0.3 ? 'approved' : 'declined';
        if (status === 'approved') approved++; else declined++;
        const approvedEl = document.getElementById('approvedCount');
        const declinedEl = document.getElementById('declinedCount');
        const processedEl = document.getElementById('processedCount');
        if (approvedEl) approvedEl.textContent = approved;
        if (declinedEl) declinedEl.textContent = declined;
        if (processedEl) processedEl.textContent = approved + declined;
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
            const checkerInput = document.getElementById('checkerInput');
            if (checkerInput) checkerInput.value = event.target.result;
            showToast(`Archivo cargado: ${file.name}`, 'success');
        };
        reader.readAsText(file);
    };
    input.click();
}

function clearChecker() {
    const checkerInput = document.getElementById('checkerInput');
    if (checkerInput) checkerInput.value = '';
    const approvedEl = document.getElementById('approvedCount');
    const declinedEl = document.getElementById('declinedCount');
    const processedEl = document.getElementById('processedCount');
    if (approvedEl) approvedEl.textContent = '0';
    if (declinedEl) declinedEl.textContent = '0';
    if (processedEl) processedEl.textContent = '0';
}

let otpInterval = null;

function startOTPBot() {
    const btn = document.querySelector('.btn-otp');
    if (!btn) return;
    const target = document.getElementById('otpTarget');
    const phone = document.getElementById('otpPhone');
    const service = document.getElementById('otpService');
    const targetVal = target ? target.value : 'Desconocido';
    const phoneVal = phone ? phone.value : 'Sin número';
    const serviceVal = service ? service.value : 'unknown';
    if (otpInterval) {
        clearInterval(otpInterval);
        otpInterval = null;
        btn.innerHTML = '<span class="material-icons">play_circle</span> Iniciar Bot OTP';
        btn.style.background = '#2a4a6a';
        addOTPLog('Bot detenido manualmente', 'info');
        return;
    }
    btn.innerHTML = '<span class="material-icons spinning">sync</span> Detener Bot';
    btn.style.background = '#6a2a2a';
    addOTPLog(`Iniciando bot para ${targetVal} (${phoneVal}) - Servicio: ${serviceVal}`, 'info');
    const stages = ['Llamando al número...', 'Estableciendo conexión...', 'Bienvenida: "Esta es una llamada automática..."', 'La víctima está en otra llamada...', 'Esperando código OTP...', 'La víctima está ingresando datos...'];
    let stageIndex = 0;
    otpInterval = setInterval(() => {
        if (stageIndex < stages.length) {
            addOTPLog(stages[stageIndex], 'progress');
            stageIndex++;
        } else {
            const otp = Math.floor(100000 + Math.random() * 900000);
            addOTPLog(`🎯 OTP Capturado: ${otp}`, 'success');
            stageIndex = 0;
        }
    }, 1200);
}

function addOTPLog(message, type = 'info') {
    const logsContainer = document.getElementById('otpLogs');
    if (!logsContainer) return;
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${type === 'success' ? 'highlight' : ''}`;
    const statusMap = { 'info': '●', 'progress': '⏳', 'success': '✓' };
    entry.innerHTML = `<span class="log-time">[${time}]</span><span class="log-status">${statusMap[type] || '●'}</span><span class="log-message">${message}</span>`;
    logsContainer.appendChild(entry);
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

function openDepositModal() {
    const modal = document.getElementById('depositModal');
    if (modal) modal.classList.add('active');
}

function closeDepositModal() {
    const modal = document.getElementById('depositModal');
    if (modal) modal.classList.remove('active');
}

function selectMethod(method, btn) {
    document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const addresses = { btc: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', eth: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', usdt: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' };
    const addressEl = document.getElementById('depositAddress');
    if (addressEl) addressEl.textContent = addresses[method] || addresses.btc;
}

function copyAddress() {
    const addressEl = document.getElementById('depositAddress');
    if (!addressEl) return;
    navigator.clipboard.writeText(addressEl.textContent).then(() => showToast('Dirección copiada al portapapeles', 'success'));
}

// ============ EXPORTAR ============
window.showSection = showSection;
window.applyFilters = applyFilters;
window.changePage = changePage;
window.refreshCatalog = refreshCatalog;
window.runChecker = runChecker;
window.uploadFile = uploadFile;
window.clearChecker = clearChecker;
window.startOTPBot = startOTPBot;
window.openDepositModal = openDepositModal;
window.closeDepositModal = closeDepositModal;
window.selectMethod = selectMethod;
window.copyAddress = copyAddress;
window.updateStats = updateStats;
window.changeView = changeView;
window.renderCatalog = renderCatalog;

console.log('✅ App.js cargado correctamente');
