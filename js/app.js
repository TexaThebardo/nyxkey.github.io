// ============================================
// APP.JS - Lógica Principal
// ============================================

let currentPage = 1;
const itemsPerPage = 8;
let currentFilter = { country: '', search: '' };

document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromJSON();
    loadCart();
    updateUserUI();
    renderCatalog();
    updateStats();
    updateDateTime();
    updateCartBadge();
    
    document.getElementById('cartOverlay').addEventListener('click', toggleCart);
    document.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) closeDepositModal();
    });
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
    document.getElementById('showingCount').textContent = products.length;
    document.getElementById('currentPage').textContent = currentPage;
}

function applyFilters() {
    const country = document.getElementById('filterCountry').value;
    const search = document.getElementById('filterSearch').value;
    currentFilter = { country, search };
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
    document.getElementById('catalogBody').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function refreshCatalog() {
    const btn = document.querySelector('.btn-refresh');
    btn.classList.add('rotating');
    setTimeout(() => {
        btn.classList.remove('rotating');
        loadProductsFromJSON();
        applyFilters();
        updateStats();
        showToast('Catálogo actualizado', 'success');
    }, 800);
}

function updateStats() {
    const stats = getProductStats();
    document.getElementById('totalCards').textContent = stats.total;
    const uniqueBanks = new Set(allProducts.map(c => c.bank));
    document.getElementById('totalBanks').textContent = uniqueBanks.size;
    document.getElementById('onlineUsers').textContent = Math.floor(Math.random() * 50) + 10;
}

function updateDateTime() {
    const date = new Date();
    const el = document.getElementById('currentDate');
    if (el) el.textContent = date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// ============ CHECKER ============
function runChecker() {
    const input = document.getElementById('checkerInput');
    const lines = input.value.split('\n').filter(line => line.trim());
    if (lines.length === 0) { showToast('Por favor, ingresa al menos una tarjeta', 'error'); return; }
    const btn = document.querySelector('.btn-checker');
    btn.disabled = true;
    btn.innerHTML = '<span class="material-icons spinning">sync</span> Verificando...';
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

function startOTPBot() {
    const btn = document.querySelector('.btn-otp');
    const target = document.getElementById('otpTarget').value || 'Desconocido';
    const phone = document.getElementById('otpPhone').value || 'Sin número';
    const service = document.getElementById('otpService').value;
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
    addOTPLog(`Iniciando bot para ${target} (${phone}) - Servicio: ${service}`, 'info');
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
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${type === 'success' ? 'highlight' : ''}`;
    const statusMap = { 'info': '●', 'progress': '⏳', 'success': '✓' };
    entry.innerHTML = `<span class="log-time">[${time}]</span><span class="log-status">${statusMap[type] || '●'}</span><span class="log-message">${message}</span>`;
    logsContainer.appendChild(entry);
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

// ============ MODAL DEPÓSITO ============
function openDepositModal() {
    document.getElementById('depositModal').classList.add('active');
}

function closeDepositModal() {
    document.getElementById('depositModal').classList.remove('active');
}

function selectMethod(method, btn) {
    document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const addresses = { btc: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', eth: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', usdt: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' };
    document.getElementById('depositAddress').textContent = addresses[method] || addresses.btc;
}

function copyAddress() {
    const address = document.getElementById('depositAddress').textContent;
    navigator.clipboard.writeText(address).then(() => showToast('Dirección copiada al portapapeles', 'success'));
}

// ============ TOAST ============
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-container');
    if (!existing) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        container.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    const colors = { success: '#2ecc71', error: '#e74c3c', info: '#3498db', warning: '#f39c12' };
    toast.style.cssText = `background:#1a232e;color:#e8edf2;padding:12px 24px;border-radius:12px;border-left:4px solid ${colors[type] || colors.info};box-shadow:0 8px 32px rgba(0,0,0,0.5);font-size:14px;font-weight:500;pointer-events:auto;animation:slideUp 0.3s ease;min-width:200px;text-align:center;border:1px solid #2a313c;`;
    toast.textContent = message;
    document.querySelector('.toast-container').appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Estilos de animación
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes slideDown { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(20px); } }
    .rotating { animation: rotate 0.8s ease-in-out; }
    @keyframes rotate { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
    .spinning { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
`;
document.head.appendChild(styleSheet);

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
window.showToast = showToast;
