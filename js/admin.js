// ============================================
// ADMIN.JS - Sistema de Administración
// ============================================

console.log('🚀 Admin.js cargado');

// ============ USAR FUNCIONES DE AUTH.JS ============
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

window.getAllUsers = getAllUsers;
window.updateUserBalanceByEmail = updateUserBalanceByEmail;
window.getAdminTransactions = getAdminTransactions;
window.checkAdminSession = checkAdminSession;
window.logoutAdmin = logoutAdmin;

console.log('✅ Admin.js cargado correctamente');
