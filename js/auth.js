// ============================================
// AUTH.JS - Sistema de Autenticación
// ============================================

console.log('🚀 Auth.js cargado');

const AUTH_CONFIG = {
    tokenKey: 'yx_token',
    usersKey: 'yx_users',
    sessionTimeout: 3600000
};

// ============ FUNCIONES DE INSIGNIAS INTERNAS (para evitar dependencias) ============
function _getUserInsigniasInternal(email) {
    try {
        const stored = localStorage.getItem('user_insignias');
        if (stored) {
            const data = JSON.parse(stored);
            return data[email] || ['Guest'];
        }
    } catch (e) {}
    return ['Guest'];
}

function _saveUserInsigniasInternal(email, insignias) {
    let data = {};
    try {
        const stored = localStorage.getItem('user_insignias');
        if (stored) {
            data = JSON.parse(stored);
        }
    } catch (e) {}
    data[email] = insignias;
    localStorage.setItem('user_insignias', JSON.stringify(data));
}

function _isAdminInternal(email) {
    if (!email) return false;
    try {
        const stored = localStorage.getItem('admin_whitelist');
        if (stored) {
            const data = JSON.parse(stored);
            if (data.admins) {
                return data.admins.some(a => a.email === email);
            }
        }
    } catch (e) {}
    return false;
}

function _loadWhitelistInternal() {
    try {
        const stored = localStorage.getItem('admin_whitelist');
        if (stored) {
            const data = JSON.parse(stored);
            if (data.admins && data.insignias) {
                return data;
            }
        }
    } catch (e) {}

    const defaultWhitelist = {
        admins: [
            { email: 'admin@yxcards.com', key: 'admin123' }
        ],
        insignias: {
            'Owner': { icon: 'verified', color: '#f1c40f', bgColor: 'rgba(241, 196, 15, 0.15)', description: 'Propietario de la plataforma' },
            'Dev': { icon: 'code', color: '#3498db', bgColor: 'rgba(52, 152, 219, 0.15)', description: 'Desarrollador de la plataforma' },
            'Verificado': { icon: 'verified_user', color: '#2ecc71', bgColor: 'rgba(46, 204, 113, 0.15)', description: 'Usuario verificado' },
            'Guest': { icon: 'person_outline', color: '#95a5a6', bgColor: 'rgba(149, 165, 166, 0.15)', description: 'Usuario invitado' },
            'VIP': { icon: 'stars', color: '#e67e22', bgColor: 'rgba(230, 126, 34, 0.15)', description: 'Usuario VIP' },
            'Moderador': { icon: 'shield', color: '#9b59b6', bgColor: 'rgba(155, 89, 182, 0.15)', description: 'Moderador de la comunidad' },
            'Colaborador': { icon: 'group', color: '#1abc9c', bgColor: 'rgba(26, 188, 156, 0.15)', description: 'Colaborador activo' },
            'Fundador': { icon: 'emoji_events', color: '#e74c3c', bgColor: 'rgba(231, 76, 60, 0.15)', description: 'Fundador de la plataforma' }
        }
    };
    localStorage.setItem('admin_whitelist', JSON.stringify(defaultWhitelist));
    return defaultWhitelist;
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
    console.log('🔍 loginUser() ejecutado');

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

    // ============ SINCRONIZAR INSIGNIAS AL LOGIN ============
    let userInsignias = _getUserInsigniasInternal(email);
    const whitelist = _loadWhitelistInternal();
    const isUserAdmin = whitelist.admins && whitelist.admins.some(a => a.email === email);
    
    let updatedInsignias = [...userInsignias];
    let insigniasChanged = false;
    
    if (isUserAdmin && !updatedInsignias.includes('Owner')) {
        updatedInsignias.push('Owner');
        insigniasChanged = true;
    }
    
    if (!isUserAdmin && updatedInsignias.includes('Owner')) {
        updatedInsignias = updatedInsignias.filter(i => i !== 'Owner');
        insigniasChanged = true;
    }
    
    if (insigniasChanged) {
        _saveUserInsigniasInternal(email, updatedInsignias);
    }

    // Crear sesión
    const session = {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            balance: user.balance,
            role: user.role,
            purchases: user.purchases || [],
            profile: user.profile || { banner: '', avatar: '', bio: '', pronoun: 'él' },
            insignias: updatedInsignias
        },
        token: generateToken(user.id),
        expiresAt: Date.now() + AUTH_CONFIG.sessionTimeout
    };

    localStorage.setItem(AUTH_CONFIG.tokenKey, JSON.stringify(session));
    console.log('✅ Sesión creada para:', user.username);

    user.lastLogin = new Date().toISOString();
    const updatedUsers = users.map(u => u.id === user.id ? user : u);
    localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(updatedUsers));

    updateUserUI();
    showToast(`👋 Bienvenido, ${user.username}!`, 'success');
    return true;
}

// ============ CERRAR SESIÓN COMPLETO ============
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

// ============ OBTENER USUARIO ACTUAL ============
function getCurrentUser() {
    const session = checkSession();
    return session ? session.user : null;
}

// ============ RENDERIZAR INSIGNIAS (función interna) ============
function _renderInsigniasInternal(email, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const insignias = _getUserInsigniasInternal(email);
    const whitelist = _loadWhitelistInternal();
    const allInsignias = whitelist.insignias || {};

    if (!insignias || insignias.length === 0) {
        container.innerHTML = `<span class="insignia-guest"><span class="material-icons" style="font-size:14px;">person_outline</span> Guest</span>`;
        return;
    }

    container.innerHTML = insignias.map(name => {
        const ins = allInsignias[name];
        if (!ins) return '';
        return `
            <span class="insignia-badge" style="background:${ins.bgColor || 'rgba(149,165,166,0.15)'}; color:${ins.color || '#95a5a6'};">
                <span class="material-icons" style="font-size:14px;">${ins.icon || 'person_outline'}</span>
                ${name}
            </span>
        `;
    }).join('');
}

// ============ ACTUALIZAR UI ============
function updateUserUI() {
    const user = getCurrentUser();
    const balanceEl = document.getElementById('userBalance');
    const avatarEl = document.getElementById('userAvatarIcon');
    const nameEl = document.getElementById('userDisplayName');

    if (user) {
        if (balanceEl) balanceEl.textContent = `$${user.balance.toFixed(2)}`;
        if (avatarEl) avatarEl.textContent = 'account_circle';
        if (nameEl) nameEl.textContent = user.username || 'Usuario';

        // Verificar admin usando función interna
        const isUserAdmin = _isAdminInternal(user.email);

        const adminBtn = document.getElementById('adminPanelBtn');
        const adminSidebarBtn = document.getElementById('adminSidebarBtn');
        const adminDropdownBtn = document.getElementById('adminDropdownBtn');

        if (isUserAdmin) {
            if (adminBtn) adminBtn.style.display = 'inline-flex';
            if (adminSidebarBtn) adminSidebarBtn.style.display = 'flex';
            if (adminDropdownBtn) adminDropdownBtn.style.display = 'flex';
        } else {
            if (adminBtn) adminBtn.style.display = 'none';
            if (adminSidebarBtn) adminSidebarBtn.style.display = 'none';
            if (adminDropdownBtn) adminDropdownBtn.style.display = 'none';
        }

        // Renderizar insignias
        _renderInsigniasInternal(user.email, 'userInsignias');
    } else {
        if (balanceEl) balanceEl.textContent = '$0.00';
        if (avatarEl) avatarEl.textContent = 'person';
        if (nameEl) nameEl.textContent = 'Invitado';
    }
}

// ============ TOGGLE MENÚ ============
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

// ============ INICIALIZAR ============
document.addEventListener('DOMContentLoaded', function() {
    // Cargar whitelist por defecto si no existe
    if (!localStorage.getItem('admin_whitelist')) {
        _loadWhitelistInternal();
    }

    updateUserUI();
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

console.log('✅ Auth.js cargado correctamente (con funciones internas)');
