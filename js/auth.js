// ============================================
// AUTH.JS - Sistema de Autenticación
// ============================================

console.log('🚀 Auth.js cargado');

const AUTH_CONFIG = {
    tokenKey: 'yx_token',
    usersKey: 'yx_users',
    sessionTimeout: 3600000
};

// ============ ADMINISTRADORES ============
const ADMIN_LIST = [
    'admin@yxcards.com',
    'personalbusiness2626@gmail.com'
];

function isAdmin(email) {
    if (!email) return false;
    return ADMIN_LIST.includes(email);
}

function verifyAdminKey(email, key) {
    if (!email || !key) return false;
    return isAdmin(email) && key === 'admin123';
}

function loadWhitelist() {
    try {
        const stored = localStorage.getItem('admin_whitelist');
        if (stored) {
            const data = JSON.parse(stored);
            if (data.admins) {
                return data;
            }
        }
    } catch (e) {}

    const defaultWhitelist = {
        admins: [
            { email: 'admin@yxcards.com', key: 'admin123' },
            { email: 'personalbusiness2626@gmail.com', key: 'admin123' }
        ]
    };
    localStorage.setItem('admin_whitelist', JSON.stringify(defaultWhitelist));
    return defaultWhitelist;
}

function getAdminList() {
    const whitelist = loadWhitelist();
    return whitelist.admins || [];
}

// ============ REGISTRO ============
function registerUser(email, password, username) {
    console.log('🔍 registerUser() ejecutado');

    if (!email || !password || !username) {
        showToast('Todos los campos son obligatorios', 'error');
        return false;
    }

    if (password.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres', 'error');
        return false;
    }

    let users = [];
    try {
        const stored = localStorage.getItem(AUTH_CONFIG.usersKey);
        users = stored ? JSON.parse(stored) : [];
    } catch (e) {
        users = [];
    }

    if (users.find(u => u.email === email)) {
        showToast('El email ya está registrado', 'error');
        return false;
    }

    if (users.find(u => u.username === username)) {
        showToast('El nombre de usuario ya está en uso', 'error');
        return false;
    }

    const newUser = {
        id: 'user_' + Date.now(),
        email: email,
        username: username,
        password: hashPassword(password),
        balance: 0,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        purchases: [],
        transactions: [],
        profile: {
            banner: '',
            avatar: '',
            bio: '',
            pronoun: 'él'
        }
    };

    users.push(newUser);
    localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(users));

    console.log('✅ Usuario registrado:', username);
    showToast('✅ Registro exitoso. Inicia sesión.', 'success');
    return true;
}

// ============ LOGIN ============
function loginUser(email, password) {
    console.log('🔍 LOGIN EJECUTADO');
    
    if (!email || !password) {
        showToast('Email y contraseña son obligatorios', 'error');
        return false;
    }

    let users = [];
    try {
        const stored = localStorage.getItem(AUTH_CONFIG.usersKey);
        users = stored ? JSON.parse(stored) : [];
    } catch (e) {
        users = [];
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        showToast('Usuario no encontrado', 'error');
        return false;
    }

    if (hashPassword(password) !== user.password) {
        showToast('Contraseña incorrecta', 'error');
        return false;
    }

    const esAdmin = isAdmin(email);
    console.log('👑 ¿Es admin?', esAdmin);
    console.log('💰 Saldo del usuario en localStorage:', user.balance);

    // ============ CREAR SESIÓN CON EL SALDO ACTUAL ============
    const session = {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            balance: user.balance,
            role: user.role,
            purchases: user.purchases || [],
            transactions: user.transactions || [],
            profile: user.profile || { banner: '', avatar: '', bio: '', pronoun: 'él' },
            isAdmin: esAdmin
        },
        token: generateToken(user.id),
        expiresAt: Date.now() + AUTH_CONFIG.sessionTimeout
    };

    localStorage.setItem(AUTH_CONFIG.tokenKey, JSON.stringify(session));
    console.log('✅ Sesión creada con saldo:', user.balance);

    user.lastLogin = new Date().toISOString();
    const updatedUsers = users.map(u => u.id === user.id ? user : u);
    localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(updatedUsers));

    // ============ ACTUALIZAR UI ============
    updateUserUI();
    showToast(`👋 Bienvenido, ${user.username}!`, 'success');
    return true;
}

// ============ CERRAR SESIÓN ============
function logoutUser() {
    localStorage.removeItem(AUTH_CONFIG.tokenKey);
    if (localStorage.getItem('admin_session')) {
        localStorage.removeItem('admin_session');
    }
    showToast('Sesión cerrada', 'info');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}

// ============ VERIFICAR SESIÓN ============
function checkSession() {
    const sessionData = localStorage.getItem(AUTH_CONFIG.tokenKey);
    if (!sessionData) return null;

    try {
        const session = JSON.parse(sessionData);
        if (Date.now() > session.expiresAt) {
            localStorage.removeItem(AUTH_CONFIG.tokenKey);
            return null;
        }
        return session;
    } catch (e) {
        localStorage.removeItem(AUTH_CONFIG.tokenKey);
        return null;
    }
}

function getCurrentUser() {
    const session = checkSession();
    return session ? session.user : null;
}

// ============ OBTENER TODOS LOS USUARIOS ============
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(AUTH_CONFIG.usersKey) || '[]');
    } catch (e) {
        return [];
    }
}

// ============ ACTUALIZAR SALDO - CON SINCRONIZACIÓN TOTAL ============
function updateUserBalance(userId, amount) {
    console.log('💰 updateUserBalance ejecutado - userId:', userId, 'amount:', amount);
    
    // 1. Obtener todos los usuarios
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        console.error('❌ Usuario no encontrado:', userId);
        return false;
    }

    // 2. Actualizar balance en la lista de usuarios
    const oldBalance = users[userIndex].balance || 0;
    users[userIndex].balance = oldBalance + amount;
    localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(users));
    console.log(`💰 Balance actualizado: $${oldBalance.toFixed(2)} → $${users[userIndex].balance.toFixed(2)}`);

    // 3. ACTUALIZAR LA SESIÓN COMPLETAMENTE
    const sessionData = localStorage.getItem(AUTH_CONFIG.tokenKey);
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            session.user.balance = users[userIndex].balance;
            localStorage.setItem(AUTH_CONFIG.tokenKey, JSON.stringify(session));
            console.log('✅ Sesión actualizada con nuevo saldo:', session.user.balance);
        } catch (e) {
            console.error('❌ Error actualizando sesión:', e);
        }
    }

    // 4. FORZAR ACTUALIZACIÓN DE UI EN TODAS LAS PÁGINAS
    updateUserUI();
    
    return true;
}

// ============ AÑADIR COMPRA ============
function addPurchaseToHistory(userId, purchaseData) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
        if (!user.purchases) user.purchases = [];
        user.purchases.push({
            ...purchaseData,
            purchaseDate: new Date().toISOString(),
            id: 'purchase_' + Date.now()
        });
        localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(users));

        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            const session = JSON.parse(localStorage.getItem(AUTH_CONFIG.tokenKey));
            if (session) {
                session.user.purchases = user.purchases;
                localStorage.setItem(AUTH_CONFIG.tokenKey, JSON.stringify(session));
            }
        }
        return true;
    }
    return false;
}

// ============ UTILIDADES ============
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return `hash_${Math.abs(hash)}`;
}

function generateToken(userId) {
    return btoa(`${userId}:${Date.now()}:${Math.random()}`);
}

// ============ RENDERIZAR INSIGNIAS ============
function renderUserInsignias(email, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const esAdmin = isAdmin(email);
    
    if (esAdmin) {
        container.innerHTML = `
            <span class="insignia-badge" style="background:rgba(240, 185, 11, 0.15); color:#f0b90b;">
                <span class="material-icons" style="font-size:14px;">verified</span>
                Admin
            </span>
        `;
    } else {
        container.innerHTML = `
            <span class="insignia-guest">
                <span class="material-icons" style="font-size:14px;">person_outline</span> Guest
            </span>
        `;
    }
}

// ============ TOGGLE MENÚ ============
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// ============ ACTUALIZAR UI - VERSIÓN DEFINITIVA ============
function updateUserUI() {
    console.log('🔄 updateUserUI ejecutado');
    
    // Obtener elementos DOM
    const balanceEl = document.getElementById('userBalance');
    const avatarEl = document.getElementById('userAvatarIcon');
    const nameEl = document.getElementById('userDisplayName');

    // ============ OBTENER SALDO DESDE localStorage DIRECTAMENTE ============
    // 1. Obtener usuario de la sesión
    const user = getCurrentUser();
    
    if (!user) {
        if (balanceEl) balanceEl.textContent = '$0.00';
        if (avatarEl) avatarEl.textContent = 'person';
        if (nameEl) nameEl.textContent = 'Invitado';
        console.log('👤 No hay usuario logueado');
        return;
    }

    // 2. Obtener el saldo REAL desde localStorage (NO desde la sesión)
    const users = getUsers();
    const fullUser = users.find(u => u.id === user.id);
    
    // 3. Usar el saldo de localStorage si existe, si no, el de la sesión
    const realBalance = fullUser ? fullUser.balance : user.balance;
    
    console.log('👤 Usuario:', user.username);
    console.log('💰 Saldo en localStorage:', fullUser ? fullUser.balance : 'No encontrado');
    console.log('💰 Saldo en sesión:', user.balance);
    console.log('💰 Saldo REAL a mostrar:', realBalance);

    // 4. Actualizar UI con el saldo REAL
    if (balanceEl) {
        balanceEl.textContent = `$${realBalance.toFixed(2)}`;
        console.log(`✅ Saldo mostrado en UI: $${realBalance.toFixed(2)}`);
    }
    
    if (avatarEl) avatarEl.textContent = 'account_circle';
    if (nameEl) nameEl.textContent = user.username || 'Usuario';

    // 5. Verificar admin
    const esAdmin = isAdmin(user.email);

    const adminBtn = document.getElementById('adminPanelBtn');
    const adminSidebarBtn = document.getElementById('adminSidebarBtn');
    const adminDropdownBtn = document.getElementById('adminDropdownBtn');

    if (esAdmin) {
        if (adminBtn) adminBtn.style.display = 'inline-flex';
        if (adminSidebarBtn) adminSidebarBtn.style.display = 'flex';
        if (adminDropdownBtn) adminDropdownBtn.style.display = 'flex';
    } else {
        if (adminBtn) adminBtn.style.display = 'none';
        if (adminSidebarBtn) adminSidebarBtn.style.display = 'none';
        if (adminDropdownBtn) adminDropdownBtn.style.display = 'none';
    }

    renderUserInsignias(user.email, 'userInsignias');
    
    // ============ ACTUALIZAR EL SALDO EN EL DASHBOARD TAMBIÉN ============
    // Si estamos en dashboard.html, actualizar también ese elemento
    const dashboardBalanceEl = document.getElementById('dashboardBalance');
    if (dashboardBalanceEl) {
        dashboardBalanceEl.textContent = `$${realBalance.toFixed(2)}`;
        console.log(`✅ Saldo en dashboard actualizado: $${realBalance.toFixed(2)}`);
    }
}

// ============ TOAST ============
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;max-width:90%;';
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
        background: #1a232e;
        color: #e8edf2;
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
        border: 1px solid #2a313c;
    `;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============ INICIALIZAR ============
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 auth.js - DOM cargado');
    
    if (!localStorage.getItem('admin_whitelist')) {
        loadWhitelist();
    }
    
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('userDropdown');
        const avatar = document.querySelector('.user-avatar');
        if (dropdown && avatar && !avatar.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
    
    // Actualizar UI al cargar la página
    setTimeout(function() {
        updateUserUI();
    }, 100);
});

// ============ EXPORTAR ============
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getCurrentUser = getCurrentUser;
window.checkSession = checkSession;
window.updateUserBalance = updateUserBalance;
window.updateUserUI = updateUserUI;
window.toggleUserMenu = toggleUserMenu;
window.showToast = showToast;
window.getUsers = getUsers;
window.addPurchaseToHistory = addPurchaseToHistory;
window.isAdmin = isAdmin;
window.verifyAdminKey = verifyAdminKey;
window.loadWhitelist = loadWhitelist;
window.getAdminList = getAdminList;
window.renderUserInsignias = renderUserInsignias;

console.log('✅ Auth.js cargado correctamente');
console.log('👑 Administradores:', ADMIN_LIST);
