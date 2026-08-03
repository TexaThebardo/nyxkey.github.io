// 🔐 AUTENTICACIÓN - CORREGIDO

class SimpleAuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        try {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                // Asegurar que el balance sea un número válido
                if (this.currentUser && (isNaN(this.currentUser.balance) || this.currentUser.balance < 0)) {
                    this.currentUser.balance = 0;
                }
            }
        } catch (e) {
            this.currentUser = null;
        }
        this.updateUI();
        this.updateSidebarUI();
    }

    register(email, password, username) {
        try {
            if (!email || !password || !username) {
                return { success: false, error: 'Todos los campos son obligatorios' };
            }
            if (password.length < 6) {
                return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
            }

            let users = [];
            try {
                const stored = localStorage.getItem('users');
                if (stored) users = JSON.parse(stored);
            } catch (e) { users = []; }

            if (users.find(u => u.email === email)) {
                return { success: false, error: 'El email ya está registrado' };
            }
            if (users.find(u => u.username === username)) {
                return { success: false, error: 'El nombre de usuario ya está en uso' };
            }

            const newUser = {
                id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                email: email,
                password: password,
                username: username,
                balance: 0, // 🔥 SALDO INICIAL EN 0
                role: email === 'admin@cardnmr.com' ? 'admin' : 'user',
                created_at: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            this.currentUser = {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                balance: 0,
                role: newUser.role
            };

            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUI();
            this.updateSidebarUI();

            return { success: true, user: this.currentUser, message: '¡Registro exitoso!' };
        } catch (error) {
            console.error('Error en registro:', error);
            return { success: false, error: error.message || 'Error al registrar usuario' };
        }
    }

    login(email, password) {
        try {
            let users = [];
            try {
                const stored = localStorage.getItem('users');
                if (stored) users = JSON.parse(stored);
            } catch (e) { users = []; }

            const user = users.find(u => u.email === email && u.password === password);
            if (!user) {
                return { success: false, error: 'Email o contraseña incorrectos' };
            }

            // Asegurar que el balance sea un número válido
            const balance = typeof user.balance === 'number' && user.balance >= 0 ? user.balance : 0;

            this.currentUser = {
                id: user.id,
                email: user.email,
                username: user.username,
                balance: balance,
                role: user.role || 'user'
            };

            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUI();
            this.updateSidebarUI();

            return { success: true, user: this.currentUser, message: '¡Bienvenido!' };
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, error: error.message || 'Error al iniciar sesión' };
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        this.updateSidebarUI();
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser?.role === 'admin';
    }

    // Actualizar UI del navbar
    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');
        const logoutBtn = document.getElementById('logoutBtn');

        const existingAdminLink = document.querySelector('.admin-link');
        if (existingAdminLink) existingAdminLink.remove();

        if (this.currentUser) {
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                if (userName) userName.textContent = this.currentUser.username || 'Usuario';
            }
            if (logoutBtn) logoutBtn.style.display = 'flex';

            if (this.isAdmin()) {
                const navLinks = document.querySelector('.nav-links');
                if (navLinks && !document.querySelector('.admin-link')) {
                    const adminLink = document.createElement('a');
                    adminLink.href = 'admin.html';
                    adminLink.className = 'admin-link';
                    adminLink.innerHTML = '<i class="fas fa-cog"></i> Admin';
                    navLinks.appendChild(adminLink);
                }
            }
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }

    // Actualizar UI del sidebar
    updateSidebarUI() {
        const sidebarAvatar = document.getElementById('sidebarAvatar');
        const sidebarUserName = document.getElementById('sidebarUserName');
        const sidebarUserEmail = document.getElementById('sidebarUserEmail');
        const topbarAvatar = document.getElementById('topbarAvatar');
        const topbarUserName = document.getElementById('topbarUserName');

        if (this.currentUser) {
            const name = this.currentUser.username || 'Usuario';
            const email = this.currentUser.email || '';
            const initial = name.charAt(0).toUpperCase();

            if (sidebarAvatar) sidebarAvatar.textContent = initial;
            if (sidebarUserName) sidebarUserName.textContent = name;
            if (sidebarUserEmail) sidebarUserEmail.textContent = email;
            if (topbarAvatar) topbarAvatar.textContent = initial;
            if (topbarUserName) topbarUserName.textContent = name;
        } else {
            if (sidebarAvatar) sidebarAvatar.textContent = 'I';
            if (sidebarUserName) sidebarUserName.textContent = 'Invitado';
            if (sidebarUserEmail) sidebarUserEmail.textContent = 'Inicia sesión';
            if (topbarAvatar) topbarAvatar.textContent = 'I';
            if (topbarUserName) topbarUserName.textContent = 'Invitado';
        }
    }

    // Obtener balance del usuario actual
    getBalance() {
        if (!this.currentUser) return 0;
        return this.currentUser.balance || 0;
    }

    // Actualizar balance
    updateBalance(newBalance) {
        if (!this.currentUser) return false;
        
        // Actualizar en users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].balance = newBalance;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Actualizar currentUser
        this.currentUser.balance = newBalance;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Actualizar UI del balance
        this.updateBalanceDisplay();
        return true;
    }

    // Actualizar display del balance
    updateBalanceDisplay() {
        const balanceEl = document.getElementById('balanceAmount');
        if (balanceEl) {
            const balance = this.getBalance();
            balanceEl.textContent = `$${balance.toFixed(2)}`;
        }
    }
}

const authManager = new SimpleAuthManager();
window.authManager = authManager;

// Event listeners para formularios
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            if (!email || !password) {
                if (typeof showNotification === 'function') {
                    showNotification('❌ Completa todos los campos', 'error');
                }
                return;
            }
            
            const result = authManager.login(email, password);
            if (result.success) {
                if (typeof showNotification === 'function') {
                    showNotification('✅ ' + result.message, 'success');
                }
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                if (typeof showNotification === 'function') {
                    showNotification('❌ ' + result.error, 'error');
                }
            }
        });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim();
            const username = document.getElementById('registerUsername').value.trim();
            
            if (!email || !password || !username) {
                if (typeof showNotification === 'function') {
                    showNotification('❌ Completa todos los campos', 'error');
                }
                return;
            }
            
            const result = authManager.register(email, password, username);
            if (result.success) {
                if (typeof showNotification === 'function') {
                    showNotification('✅ ' + result.message, 'success');
                }
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                if (typeof showNotification === 'function') {
                    showNotification('❌ ' + result.error, 'error');
                }
            }
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authManager.logout();
        });
    }
});

window.logout = function() {
    authManager.logout();
};

// Función para actualizar balance desde cualquier lugar
window.updateBalanceDisplay = function() {
    authManager.updateBalanceDisplay();
};
