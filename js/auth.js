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

// ============ CARGAR WHITELIST ============
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

    // Verificar admin
    const esAdmin = isAdmin(email);
    console.log('👑 ¿Es admin?', esAdmin);

    const session = {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            balance: user.balance,
            role: user.role,
            purchases: user.purchases || [],
            profile: user.profile || { banner: '', avatar: '', bio: '', pronoun: 'él' },
            isAdmin: esAdmin
        },
        token: generateToken(user.id),
        expiresAt: Date.now() + AUTH_CONFIG.sessionTimeout
    };

    localStorage.setItem(AUTH_CONFIG.tokenKey, JSON.stringify(session));
    console.log('✅ Sesión creada para:', user.username);

    user.lastLogin = new Date().toISOString();
    const updatedUsers = users.map(u => u.id === user.id ? user : u);
    localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(updatedUsers));

    // ============ ACTUALIZAR UI ============
    if (typeof updateUserUI === 'function') {
        updateUserUI();
    }
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

// ============ ACTUALIZAR SALDO ============
function updateUserBalance(userId, amount) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
        user.balance = (user.balance || 0) + amount;
        localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(users));

        // Actualizar sesión también
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            const session = JSON.parse(localStorage.getItem(AUTH_CONFIG.tokenKey));
            if (session) {
                session.user.balance = user.balance;
                localStorage.setItem(AUTH_CONFIG.tokenKey, JSON.stringify(session));
            }
        }
        
        // ============ ACTUALIZAR UI ============
        if (typeof updateUserUI === 'function') {
            updateUserUI();
        }
        return true;
    }
    return false;
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

// ============ INICIALIZAR ============
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('admin_whitelist')) {
        loadWhitelist();
    }
    if (typeof updateUserUI === 'function') {
        updateUserUI();
    }
});

// ============ EXPORTAR ============
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getCurrentUser = getCurrentUser;
window.checkSession = checkSession;
window.updateUserBalance = updateUserBalance;
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
