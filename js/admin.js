// ============================================
// ADMIN.JS - Sistema de Administración
// ============================================

console.log('🚀 Admin.js cargado');

function getAllUsers() {
    return getUsers();
}

function updateUserBalanceByEmail(email, amount, concept = 'Ajuste manual') {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        return { success: false, message: '❌ Usuario no encontrado' };
    }

    const oldBalance = users[userIndex].balance || 0;
    users[userIndex].balance = oldBalance + amount;
    localStorage.setItem('yx_users', JSON.stringify(users));

    // Guardar transacción
    const transaction = {
        id: 'ADMIN-' + Date.now(),
        type: amount >= 0 ? 'depósito_admin' : 'retiro_admin',
        amount: amount,
        concept: concept,
        date: new Date().toISOString()
    };

    if (!users[userIndex].transactions) {
        users[userIndex].transactions = [];
    }
    users[userIndex].transactions.push(transaction);
    localStorage.setItem('yx_users', JSON.stringify(users));

    return {
        success: true,
        newBalance: users[userIndex].balance,
        message: `✅ Saldo actualizado de $${oldBalance.toFixed(2)} a $${users[userIndex].balance.toFixed(2)}`
    };
}

function getAdminList() {
    try {
        const stored = localStorage.getItem('admin_whitelist');
        if (stored) {
            const data = JSON.parse(stored);
            return data.admins || [];
        }
    } catch (e) {}
    return [];
}

window.getAllUsers = getAllUsers;
window.updateUserBalanceByEmail = updateUserBalanceByEmail;
window.getAdminList = getAdminList;

console.log('✅ Admin.js cargado correctamente');
