// ============================================
// ADMIN.JS - Sistema de Administración
// ============================================

const ADMIN_CONFIG = {
    whitelistKey: 'admin_whitelist',
    insigniasKey: 'user_insignias',
    transactionsKey: 'admin_transactions'
};

// ============ CARGAR WHITELIST ============
function loadWhitelist() {
    try {
        const stored = localStorage.getItem(ADMIN_CONFIG.whitelistKey);
        if (stored) {
            const data = JSON.parse(stored);
            if (data.admins && data.insignias) {
                return data;
            }
        }
    } catch (e) {}

    // ============ WHITELIST POR DEFECTO ============
    // ⚠️ CAMBIA ESTOS EMAILS POR LOS QUE QUIERAS QUE SEAN ADMIN
    // O USA EL BOTÓN "AÑADIR ADMIN" EN EL PANEL DE ADMIN
    const defaultWhitelist = {
        admins: [], // ⚠️ VACÍO POR DEFECTO - TÚ DECIDES QUIÉNES SON ADMINS
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
    saveWhitelist(defaultWhitelist);
    return defaultWhitelist;
}

function saveWhitelist(data) {
    localStorage.setItem(ADMIN_CONFIG.whitelistKey, JSON.stringify(data));
}

// ============ VERIFICAR ADMIN ============
function isAdmin(email) {
    if (!email) return false;
    const whitelist = loadWhitelist();
    return whitelist.admins && whitelist.admins.includes(email);
}

// ============ OBTENER INSIGNIAS ============
function getUserInsignias(email) {
    try {
        const stored = localStorage.getItem(ADMIN_CONFIG.insigniasKey);
        if (stored) {
            const data = JSON.parse(stored);
            return data[email] || ['Guest'];
        }
    } catch (e) {}
    return ['Guest'];
}

function saveUserInsignias(email, insignias) {
    let data = {};
    try {
        const stored = localStorage.getItem(ADMIN_CONFIG.insigniasKey);
        if (stored) {
            data = JSON.parse(stored);
        }
    } catch (e) {}
    data[email] = insignias;
    localStorage.setItem(ADMIN_CONFIG.insigniasKey, JSON.stringify(data));
}

function getAllInsignias() {
    const whitelist = loadWhitelist();
    return whitelist.insignias || {};
}

// ============ USUARIOS ============
function getAllUsers() {
    try {
        return JSON.parse(localStorage.getItem('yx_users') || '[]');
    } catch (e) {
        return [];
    }
}

// ============ ACTUALIZAR SALDO ============
function updateUserBalanceByEmail(email, amount, concept = 'Ajuste manual') {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        return { success: false, message: '❌ Usuario no encontrado' };
    }

    users[userIndex].balance = (users[userIndex].balance || 0) + amount;
    localStorage.setItem('yx_users', JSON.stringify(users));

    const transaction = {
        id: 'ADMIN-' + Date.now(),
        userEmail: email,
        username: users[userIndex].username,
        amount: amount,
        concept: concept,
        date: new Date().toISOString(),
        type: amount >= 0 ? 'depósito_admin' : 'retiro_admin'
    };

    saveAdminTransaction(transaction);

    return {
        success: true,
        newBalance: users[userIndex].balance,
        message: `✅ Saldo actualizado a $${users[userIndex].balance.toFixed(2)}`
    };
}

// ============ TRANSACCIONES ============
function saveAdminTransaction(transaction) {
    let data = { transactions: [] };
    try {
        const stored = localStorage.getItem(ADMIN_CONFIG.transactionsKey);
        if (stored) {
            data = JSON.parse(stored);
        }
    } catch (e) {}
    data.transactions.push(transaction);
    localStorage.setItem(ADMIN_CONFIG.transactionsKey, JSON.stringify(data));
}

function getAdminTransactions() {
    try {
        const stored = localStorage.getItem(ADMIN_CONFIG.transactionsKey);
        if (stored) {
            return JSON.parse(stored).transactions || [];
        }
    } catch (e) {}
    return [];
}

// ============ RENDERIZAR INSIGNIAS ============
function renderInsignias(email, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const insignias = getUserInsignias(email);
    const allInsignias = getAllInsignias();

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

// ============ GESTIONAR INSIGNIAS ============
function addInsigniaToUser(email, insigniaName) {
    const allInsignias = getAllInsignias();
    if (!allInsignias[insigniaName]) {
        return { success: false, message: '❌ Insignia no existe' };
    }

    const current = getUserInsignias(email);
    if (!current.includes(insigniaName)) {
        current.push(insigniaName);
        saveUserInsignias(email, current);
        return { success: true, message: `✅ Insignia "${insigniaName}" añadida` };
    }
    return { success: false, message: `❌ El usuario ya tiene "${insigniaName}"` };
}

function removeInsigniaFromUser(email, insigniaName) {
    const current = getUserInsignias(email);
    const filtered = current.filter(i => i !== insigniaName);
    if (filtered.length < current.length) {
        saveUserInsignias(email, filtered);
        return { success: true, message: `✅ Insignia "${insigniaName}" eliminada` };
    }
    return { success: false, message: `❌ El usuario no tiene "${insigniaName}"` };
}

// ============ AÑADIR ADMIN A LA WHITELIST ============
function addAdminToWhitelist(email) {
    const whitelist = loadWhitelist();
    if (!whitelist.admins) {
        whitelist.admins = [];
    }
    if (!whitelist.admins.includes(email)) {
        whitelist.admins.push(email);
        saveWhitelist(whitelist);
        return { success: true, message: `✅ ${email} ahora es administrador` };
    }
    return { success: false, message: `❌ ${email} ya es administrador` };
}

// ============ QUITAR ADMIN DE LA WHITELIST ============
function removeAdminFromWhitelist(email) {
    const whitelist = loadWhitelist();
    if (whitelist.admins) {
        const filtered = whitelist.admins.filter(e => e !== email);
        if (filtered.length < whitelist.admins.length) {
            whitelist.admins = filtered;
            saveWhitelist(whitelist);
            return { success: true, message: `✅ ${email} ya no es administrador` };
        }
    }
    return { success: false, message: `❌ ${email} no es administrador` };
}

// ============ OBTENER LISTA DE ADMINS ============
function getAdminList() {
    const whitelist = loadWhitelist();
    return whitelist.admins || [];
}

// ============ EXPORTAR ============
window.isAdmin = isAdmin;
window.loadWhitelist = loadWhitelist;
window.getAllUsers = getAllUsers;
window.updateUserBalanceByEmail = updateUserBalanceByEmail;
window.getAdminTransactions = getAdminTransactions;
window.renderInsignias = renderInsignias;
window.getUserInsignias = getUserInsignias;
window.getAllInsignias = getAllInsignias;
window.addInsigniaToUser = addInsigniaToUser;
window.removeInsigniaFromUser = removeInsigniaFromUser;
window.saveUserInsignias = saveUserInsignias;
window.addAdminToWhitelist = addAdminToWhitelist;
window.removeAdminFromWhitelist = removeAdminFromWhitelist;
window.getAdminList = getAdminList;

console.log('✅ Admin.js cargado');
