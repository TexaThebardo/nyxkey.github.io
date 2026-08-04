// ============================================
// AUTH.JS - Sistema de Autenticación COMPLETO
// ============================================

const AUTH_CONFIG = {
    storageKey: 'yx_user',
    tokenKey: 'yx_token',
    usersKey: 'yx_users',
    sessionTimeout: 3600000
};

// ============ REGISTRO DE USUARIO ============
function registerUser(email, password, username) {
    console.log('🔍 registerUser llamado con:', { email, password: '***', username });
    
    // Validaciones
    if (!email || !password || !username) {
        console.log('❌ Campos vacíos');
        showToast('Todos los campos son obligatorios', 'error');
        return false;
    }
    
    if (password.length < 6) {
        console.log('❌ Contraseña muy corta');
        showToast('La contraseña debe tener al menos 6 caracteres', 'error');
        return false;
    }
    
    // Obtener usuarios existentes
    let users = [];
    try {
        const stored = localStorage.getItem(AUTH_CONFIG.usersKey);
        users = stored ? JSON.parse(stored) : [];
        console.log('📦 Usuarios existentes:', users.length);
    } catch (e) {
        console.error('❌ Error al leer usuarios:', e);
        users = [];
    }
    
    // Verificar si el email ya está registrado
    if (users.find(u => u.email === email)) {
        console.log('❌ Email ya registrado:', email);
        showToast('El email ya está registrado', 'error');
        return false;
    }
    
    // Verificar si el nombre de usuario ya existe
    if (users.find(u => u.username === username)) {
        console.log('❌ Username ya existe:', username);
        showToast('El nombre de usuario ya está en uso', 'error');
        return false;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: 'user_' + Date.now(),
        email: email,
        username: username,
        password: hashPassword(password),
        balance: 100,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        transactions: []
    };
    console.log('✅ Nuevo usuario creado:', newUser);
    
    // Guardar usuario
    users.push(newUser);
    localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(users));
    console.log('💾 Usuario guardado en localStorage');
    
    // Verificar que se guardó correctamente
    const verifyUsers = JSON.parse(localStorage.getItem(AUTH_CONFIG.usersKey) || '[]');
    console.log('📦 Verificación - Total usuarios:', verifyUsers.length);
    
    showToast('✅ Registro exitoso', 'success');
    return true;
}

// ============ INICIO DE SESIÓN ============
function loginUser(email, password) {
    console.log('🔍 loginUser llamado con:', { email, password: '***' });
    
    if (!email || !password) {
        showToast('Email y contraseña son obligatorios', 'error');
        return false;
    }
    
    let users = [];
    try {
        const stored = localStorage.getItem(AUTH_CONFIG.usersKey);
        users = stored ? JSON.parse(stored) : [];
        console.log('📦 Usuarios encontrados:', users.length);
    } catch (e) {
        console.error('❌ Error al leer usuarios:', e);
        users = [];
    }
    
    const user = users.find(u => u.email === email);
    if (!user) {
        console.log('❌ Usuario no encontrado:', email);
        showToast('Usuario no encontrado', 'error');
        return false;
    }
    
    if (hashPassword(password) !== user.password) {
        console.log('❌ Contraseña incorrecta');
        showToast('Contraseña incorrecta', 'error');
        return false;
    }
    
    // Crear sesión
    const session = {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            balance: user.balance,
            role: user.role
        },
        token: generateToken(user.id),
        expiresAt: Date.now() + AUTH_CONFIG.sessionTimeout
    };
    
    localStorage.setItem(AUTH_CONFIG.tokenKey, JSON.stringify(session));
    console.log('✅ Sesión creada');
    
    // Actualizar último login
    user.lastLogin = new Date().toISOString();
    const updatedUsers = users.map(u => u.id === user.id ? user : u);
    localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(updatedUsers));
    
    updateUserUI();
    showToast(`👋 Bienvenido, ${user.username}!`, 'success');
    return true;
}

// ============ CERRAR SESIÓN ============
function logoutUser() {
    localStorage.removeItem(AUTH_CONFIG.tokenKey);
    showToast('Sesión cerrada', 'info');
    // Redirigir a login
    window.location.href = 'login.html';
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

// ============ OBTENER USUARIO ACTUAL ============
function getCurrentUser() {
    const session = checkSession();
    return session ? session.user : null;
}

// ============ ACTUALIZAR UI DEL USUARIO ============
function updateUserUI() {
    const user = getCurrentUser();
    const balanceEl = document.getElementById('userBalance');
    const avatarEl = document.getElementById('userAvatarIcon');
    
    if (user) {
        if (balanceEl) balanceEl.textContent = `$${user.balance.toFixed(2)}`;
        if (avatarEl) avatarEl.textContent = 'account_circle';
    } else {
        if (balanceEl) balanceEl.textContent = '$0.00';
        if (avatarEl) avatarEl.textContent = 'person';
    }
}

// ============ TOGGLE MENÚ USUARIO ============
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.toggle('active');
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('userDropdown');
    const avatar = document.querySelector('.user-avatar');
    if (dropdown && avatar && !avatar.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// ============ FUNCIONES DE USUARIO ============
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(AUTH_CONFIG.usersKey) || '[]');
    } catch (e) {
        return [];
    }
}

function updateUserBalance(userId, amount) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
        user.balance = (user.balance || 0) + amount;
        localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(users));
        
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            const session = JSON.parse(localStorage.getItem(AUTH_CONFIG.tokenKey));
            if (session) {
                session.user.balance = user.balance;
                localStorage.setItem(AUTH_CONFIG.tokenKey, JSON.stringify(session));
            }
            updateUserUI();
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

// ============ PROTECCIÓN DE RUTAS ============
function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function requireGuest() {
    const user = getCurrentUser();
    if (user) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// ============ TOAST ============
function showToast(message, type = 'info') {
    console.log(`📢 Toast: ${type} - ${message}`);
    
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;max-width:90%;';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    const colors = { success: '#2ecc71', error: '#e74c3c', info: '#3498db', warning: '#f39c12' };
    toast.style.cssText = `background:#1a232e;color:#e8edf2;padding:12px 24px;border-radius:12px;border-left:4px solid ${colors[type] || colors.info};box-shadow:0 8px 32px rgba(0,0,0,0.5);font-size:14px;font-weight:500;pointer-events:auto;animation:slideUp 0.3s ease;min-width:200px;text-align:center;border:1px solid #2a313c;`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============ EXPORTAR ============
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getCurrentUser = getCurrentUser;
window.checkSession = checkSession;
window.updateUserBalance = updateUserBalance;
window.requireAuth = requireAuth;
window.requireGuest = requireGuest;
window.updateUserUI = updateUserUI;
window.toggleUserMenu = toggleUserMenu;
window.showToast = showToast;

console.log('✅ Auth.js cargado correctamente');
