// ============================================
// APP.JS - Lógica Principal (INDEX.HTML)
// ============================================

console.log('🚀 App.js cargado');

let currentPage = 1;
const itemsPerPage = 8;
let currentFilter = { country: '', search: '' };

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

function renderCatalog() {
    const tbody = document.getElementById('catalogBody');
    if (!tbody) {
        console.warn('⚠️ catalogBody no encontrado - saltando renderizado');
        return;
    }
    const products = getProducts();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = products.slice(start, end);
    
    if (pageItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="13" style="text-align:center;padding:40px;color:var(--text-secondary);"><span class="material-icons-outlined" style="font-size:48px;display:block;">search_off</span>No se encontraron tarjetas</td></tr>`;
    } else {
        tbody.innerHTML = pageItems.map((card) => {
            const realIndex = allProducts.indexOf(card);
            return `<tr>
                <td>${card.network}</td>
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
                <td><strong>$${card.price.toFixed(2)}</strong></td>
                <td><button class="btn-buy" onclick="addToCart(${realIndex})"><span class="material-icons">add_shopping_cart</span> Comprar</button></td>
            </tr>`;
        }).join('');
    }
    const showingCount = document.getElementById('showingCount');
    if (showingCount) showingCount.textContent = products.length;
    const currentPageEl = document.getElementById('currentPage');
    if (currentPageEl) currentPageEl.textContent = currentPage;
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

console.log('✅ App.js cargado correctamente');
