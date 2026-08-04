// ============================================
// AUTH.JS - Sistema de Autenticación
// ============================================

// Configuración
const AUTH_CONFIG = {
    storageKey: 'nokicc_user',
    tokenKey: 'nokicc_token',
    sessionTimeout: 3600000, // 1 hora
    users: [] // Simulación de base de datos
};

// ============ REGISTRO ============
function registerUser(email, password, username, fullName) {
    // Validaciones
    if (!email || !password || !username || !fullName) {
        showToast('Todos los campos son obligatorios', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres', 'error');
        return false;
    }
    
    // Verificar si el usuario ya existe
    const existingUser = getUserByEmail(email);
    if (existingUser) {
        showToast('El email ya está registrado', 'error');
        return false;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: Date.now().toString(),
        email,
        username,
        fullName,
        password: hashPassword(password),
        balance: 0,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        avatar: null,
        preferences: {
            theme: 'dark',
            notifications: true
        }
    };
    
    // Guardar usuario (en memoria/localStorage)
    saveUser(newUser);
    
    showToast('✅ Registro exitoso. Inicia sesión', 'success');
    return true;
}

// ============ LOGIN ============
function loginUser(email, password) {
    if (!email || !password) {
        showToast('Email y contraseña son obligatorios', 'error');
        return false;
    }
    
    const user = getUserByEmail(email);
    if (!user) {
        showToast('Usuario no encontrado', 'error');
        return false;
    }
    
    if (hashPassword(password) !== user.password) {
        showToast('Contraseña incorrecta', 'error');
        return false;
    }
    
    // Crear sesión
    const session = {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            balance: user.balance,
            role: user.role
        },
        token: generateToken(user.id),
        expiresAt: Date.now() + AUTH_CONFIG.sessionTimeout
    };
    
    // Guardar sesión
    localStorage.setItem(AUTH_CONFIG.tokenKey, JSON.stringify(session));
    
    // Actualizar último login
    user.lastLogin = new Date().toISOString();
    updateUser(user);
    
    showToast(`👋 Bienvenido, ${user.username}!`, 'success');
    return true;
}

// ============ LOGOUT ============
function logoutUser() {
    localStorage.removeItem(AUTH_CONFIG.tokenKey);
    showToast('Sesión cerrada', 'info');
    window.location.href = '/login.html';
}

// ============ VERIFICAR SESIÓN ============
function checkSession() {
    const sessionData = localStorage.getItem(AUTH_CONFIG.tokenKey);
    if (!sessionData) return null;
    
    try {
        const session = JSON.parse(sessionData);
        
        // Verificar expiración
        if (Date.now() > session.expiresAt) {
            localStorage.removeItem(AUTH_CONFIG.tokenKey);
            showToast('Sesión expirada. Inicia sesión nuevamente', 'warning');
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

// ============ FUNCIONES DE USUARIO ============
function getUserByEmail(email) {
    const users = getUsers();
    return users.find(u => u.email === email) || null;
}

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem('nokicc_users') || '[]');
    } catch (e) {
        return [];
    }
}

function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('nokicc_users', JSON.stringify(users));
}

function updateUser(user) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem('nokicc_users', JSON.stringify(users));
        return true;
    }
    return false;
}

function updateUserBalance(userId, amount) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
        user.balance = (user.balance || 0) + amount;
        localStorage.setItem('nokicc_users', JSON.stringify(users));
        
        // Actualizar sesión si es el usuario actual
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            const session = JSON.parse(localStorage.getItem(AUTH_CONFIG.tokenKey));
            if (session) {
                session.user.balance = user.balance;
                localStorage.setItem(AUTH_CONFIG.tokenKey, JSON.stringify(session));
            }
        }
        return true;
    }
    return false;
}

// ============ UTILIDADES ============
function hashPassword(password) {
    // Simulación de hash (en producción usar bcrypt)
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
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

function requireGuest() {
    const user = getCurrentUser();
    if (user) {
        window.location.href = '/index.html';
        return false;
    }
    return true;
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
