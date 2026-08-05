// ============================================
// ADMIN.JS - Sistema de Administración
// ============================================

console.log('🚀 Admin.js cargado');

// ============ USAR FUNCIONES DE AUTH.JS ============
function loadWhitelist() {
    return loadWhitelistData();
}

function isAdmin(email) {
    return isUserAdmin(email);
}

function getUserInsignias(email) {
    return getInsigniasFromStorage(email);
}

function saveUserInsignias(email, insignias) {
    saveInsigniasToStorage(email, insignias);
}

function getAllInsignias() {
    const whitelist = loadWhitelist();
    return whitelist.insignias || {};
}

function getAllUsers() {
    return getUsers();
}

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

function saveAdminTransaction(transaction) {
    let data = { transactions: [] };
    try {
        const stored = localStorage.getItem('admin_transactions');
        if (stored) {
            data = JSON.parse(stored);
        }
    } catch (e) {}
    data.transactions.push(transaction);
    localStorage.setItem('admin_transactions', JSON.stringify(data));
}

function getAdminTransactions() {
    try {
        const stored = localStorage.getItem('admin_transactions');
        if (stored) {
            return JSON.parse(stored).transactions || [];
        }
    } catch (e) {}
    return [];
}

function renderInsignias(email, containerId) {
    renderUserInsignias(email, containerId);
}

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

function getAdminList() {
    const whitelist = loadWhitelist();
    return whitelist.admins || [];
}

function verifyAdminKey(email, key) {
    if (!email || !key) return false;
    const whitelist = loadWhitelist();
    if (!whitelist.admins) return false;
    const admin = whitelist.admins.find(a => a.email === email);
    if (!admin) return false;
    return admin.key === key;
}

function checkAdminSession() {
    const sessionData = localStorage.getItem('admin_session');
    if (!sessionData) return null;
    
    try {
        const session = JSON.parse(sessionData);
        if (session.loggedIn && (Date.now() - session.timestamp < 3600000)) {
            if (isAdmin(session.email)) {
                return session;
            } else {
                localStorage.removeItem('admin_session');
                return null;
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}

function logoutAdmin() {
    localStorage.removeItem('admin_session');
    window.location.reload();
}

window.isAdmin = isAdmin;
window.verifyAdminKey = verifyAdminKey;
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
window.getAdminList = getAdminList;
window.checkAdminSession = checkAdminSession;
window.logoutAdmin = logoutAdmin;

console.log('✅ Admin.js cargado correctamente');
