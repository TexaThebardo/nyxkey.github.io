// ============================================
// AUTH.JS - Sistema de Autenticación
// ============================================

const AUTH_CONFIG = {
    storageKey: 'yx_user',
    tokenKey: 'yx_token',
    usersKey: 'yx_users',
    sessionTimeout: 3600000
};

function registerUser(email, password, username, fullName) {
    if (!email || !password || !username || !fullName) {
        showToast('Todos los campos son obligatorios', 'error');
        return false;
    }
    if (password.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres', 'error');
        return false;
    }
    if (getUserByEmail(email)) {
        showToast('El email ya está registrado', 'error');
        return false;
    }
    const newUser = {
        id: 'user_' + Date.now(),
        email, username, fullName,
        password: hashPassword(password),
        balance: 0, role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: null, avatar: null,
        transactions: []
    };
    saveUser(newUser);
    showToast('✅ Registro exitoso. Inicia sesión', 'success');
    return true;
}

function loginUser(email, password) {
    if (!email || !password) {
        showToast('Email y contraseña son obligatorios', 'error');
        return false;
    }
    const user = getUserByEmail(email);
    if (!user) { showToast('Usuario no encontrado', 'error'); return false; }
    if (hashPassword(password) !== user.password) {
        showToast('Contraseña incorrecta', 'error');
        return false;
    }
    const session = {
        user: { id: user.id, email: user.email, username: user.username, fullName: user.fullName, balance: user.balance, role: user.role },
        token: generateToken(user.id),
        expiresAt: Date.now() + AUTH_CONFIG.sessionTimeout
    };
    localStorage.setItem(AUTH_CONFIG.tokenKey, JSON.stringify(session));
    user.lastLogin = new Date().toISOString();
    updateUser(user);
    updateUserUI();
    showToast(`👋 Bienvenido, ${user.username}!`, 'success');
    return true;
}

function logoutUser() {
    localStorage.removeItem(AUTH_CONFIG.tokenKey);
    showToast('Sesión cerrada', 'info');
    window.location.href = '/login.html';
}

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
    } catch (e) { localStorage.removeItem(AUTH_CONFIG.tokenKey); return null; }
}

function getCurrentUser() {
    const session = checkSession();
    return session ? session.user : null;
}

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

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.toggle('active');
}

document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('userDropdown');
    const avatar = document.querySelector('.user-avatar');
    if (dropdown && avatar && !avatar.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

function getUserByEmail(email) {
    const users = getUsers();
    return users.find(u => u.email === email) || null;
}

function getUsers() {
    try { return JSON.parse(localStorage.getItem(AUTH_CONFIG.usersKey) || '[]'); } 
    catch (e) { return []; }
}

function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(users));
}

function updateUser(user) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(users));
        return true;
    }
    return false;
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

function requireAuth() {
    const user = getCurrentUser();
    if (!user) { window.location.href = '/login.html'; return false; }
    return true;
}

function requireGuest() {
    const user = getCurrentUser();
    if (user) { window.location.href = '/index.html'; return false; }
    return true;
}

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
