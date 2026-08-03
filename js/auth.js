// 🔐 AUTENTICACIÓN

class SimpleAuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        try {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) this.currentUser = JSON.parse(savedUser);
        } catch (e) { this.currentUser = null; }
        this.updateUI();
    }

    register(email, password, username) {
        try {
            if (!email || !password || !username) return { success: false, error: 'Todos los campos son obligatorios' };
            if (password.length < 6) return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };

            let users = [];
            try { const stored = localStorage.getItem('users'); if (stored) users = JSON.parse(stored); } catch (e) { users = []; }

            if (users.find(u => u.email === email)) return { success: false, error: 'El email ya está registrado' };
            if (users.find(u => u.username === username)) return { success: false, error: 'El nombre de usuario ya está en uso' };

            const newUser = {
                id: `user_${Date.now()}_${Math.random().toString(36).substr(2,6)}`,
                email, password, username,
                balance: 0,
                role: email === 'admin@cardnmr.com' ? 'admin' : 'user',
                created_at: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            this.currentUser = { id: newUser.id, email: newUser.email, username: newUser.username, balance: newUser.balance, role: newUser.role };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUI();

            return { success: true, user: this.currentUser, message: '¡Registro exitoso!' };
        } catch (error) {
            return { success: false, error: error.message || 'Error al registrar usuario' };
        }
    }

    login(email, password) {
        try {
            let users = [];
            try { const stored = localStorage.getItem('users'); if (stored) users = JSON.parse(stored); } catch (e) { users = []; }

            const user = users.find(u => u.email === email && u.password === password);
            if (!user) return { success: false, error: 'Email o contraseña incorrectos' };

            this.currentUser = { id: user.id, email: user.email, username: user.username, balance: user.balance || 0, role: user.role || 'user' };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUI();

            return { success: true, user: this.currentUser, message: '¡Bienvenido!' };
        } catch (error) {
            return { success: false, error: error.message || 'Error al iniciar sesión' };
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        window.location.href = 'index.html';
    }

    getCurrentUser() { return this.currentUser; }
    isAuthenticated() { return this.currentUser !== null; }
    isAdmin() { return this.currentUser?.role === 'admin'; }

    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');
        const existingAdminLink = document.querySelector('.admin-link');
        if (existingAdminLink) existingAdminLink.remove();

        if (this.currentUser) {
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                if (userName) userName.textContent = this.currentUser.username;
            }
            if (this.isAdmin()) {
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
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
        }
    }
}

const authManager = new SimpleAuthManager();
window.authManager = authManager;

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            if (!email || !password) { if (typeof showNotification === 'function') showNotification('❌ Completa todos los campos', 'error'); return; }
            const result = authManager.login(email, password);
            if (result.success) {
                if (typeof showNotification === 'function') showNotification('✅ ' + result.message, 'success');
                setTimeout(() => window.location.href = 'index.html', 1000);
            } else {
                if (typeof showNotification === 'function') showNotification('❌ ' + result.error, 'error');
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim();
            const username = document.getElementById('registerUsername').value.trim();
            if (!email || !password || !username) { if (typeof showNotification === 'function') showNotification('❌ Completa todos los campos', 'error'); return; }
            const result = authManager.register(email, password, username);
            if (result.success) {
                if (typeof showNotification === 'function') showNotification('✅ ' + result.message, 'success');
                setTimeout(() => window.location.href = 'index.html', 1500);
            } else {
                if (typeof showNotification === 'function') showNotification('❌ ' + result.error, 'error');
            }
        });
    }
});

window.logout = function() { authManager.logout(); };
