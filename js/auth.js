// 🔐 AUTENTICACIÓN SIMPLE - VERSIÓN FUNCIONAL

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
            }
        } catch (e) {
            this.currentUser = null;
        }
        this.updateUI();
    }

    // Registrar usuario
    register(email, password, username, fullName) {
        try {
            // Validar datos
            if (!email || !password || !username) {
                return { 
                    success: false, 
                    error: 'Todos los campos son obligatorios' 
                };
            }

            if (password.length < 6) {
                return { 
                    success: false, 
                    error: 'La contraseña debe tener al menos 6 caracteres' 
                };
            }

            // Obtener usuarios existentes
            let users = [];
            try {
                const stored = localStorage.getItem('users');
                if (stored) {
                    users = JSON.parse(stored);
                }
            } catch (e) {
                users = [];
            }

            // Verificar si el email ya existe
            if (users.find(u => u.email === email)) {
                return { 
                    success: false, 
                    error: 'El email ya está registrado' 
                };
            }

            // Verificar si el usuario ya existe
            if (users.find(u => u.username === username)) {
                return { 
                    success: false, 
                    error: 'El nombre de usuario ya está en uso' 
                };
            }

            // Crear nuevo usuario
            const newUser = {
                id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                email: email,
                password: password,
                username: username,
                full_name: fullName || username,
                role: email === 'admin@cardnmr.com' ? 'admin' : 'user',
                created_at: new Date().toISOString()
            };

            // Guardar usuario
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Iniciar sesión automáticamente
            this.currentUser = {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                full_name: newUser.full_name,
                role: newUser.role
            };

            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUI();

            return { 
                success: true, 
                user: this.currentUser,
                message: '¡Registro exitoso!'
            };
        } catch (error) {
            console.error('Error en registro:', error);
            return { 
                success: false, 
                error: error.message || 'Error al registrar usuario'
            };
        }
    }

    // Iniciar sesión
    login(email, password) {
        try {
            let users = [];
            try {
                const stored = localStorage.getItem('users');
                if (stored) {
                    users = JSON.parse(stored);
                }
            } catch (e) {
                users = [];
            }

            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                return { 
                    success: false, 
                    error: 'Email o contraseña incorrectos' 
                };
            }

            this.currentUser = {
                id: user.id,
                email: user.email,
                username: user.username,
                full_name: user.full_name,
                role: user.role || 'user'
            };

            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUI();

            return { 
                success: true, 
                user: this.currentUser,
                message: '¡Bienvenido!'
            };
        } catch (error) {
            console.error('Error en login:', error);
            return { 
                success: false, 
                error: error.message || 'Error al iniciar sesión'
            };
        }
    }

    // Cerrar sesión
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        window.location.href = 'index.html';
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar si está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Verificar si es admin
    isAdmin() {
        return this.currentUser?.role === 'admin';
    }

    // Actualizar UI
    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');

        // Remover admin link existente
        const existingAdminLink = document.querySelector('.admin-link');
        if (existingAdminLink) existingAdminLink.remove();

        if (this.currentUser) {
            if (authButtons) {
                authButtons.style.display = 'none';
            }
            if (userMenu) {
                userMenu.style.display = 'flex';
                if (userName) {
                    userName.textContent = this.currentUser.full_name || this.currentUser.username;
                }
            }
            
            // Agregar link de admin si es admin
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
            if (authButtons) {
                authButtons.style.display = 'flex';
            }
            if (userMenu) {
                userMenu.style.display = 'none';
            }
        }
    }
}

// Crear instancia global
const authManager = new SimpleAuthManager();

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
                showNotification('❌ Completa todos los campos', 'error');
                return;
            }
            
            const result = authManager.login(email, password);
            if (result.success) {
                showNotification('✅ ' + result.message, 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showNotification('❌ ' + result.error, 'error');
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
            const fullName = document.getElementById('registerFullName').value.trim();
            
            if (!email || !password || !username) {
                showNotification('❌ Completa todos los campos', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('❌ La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            
            const result = authManager.register(email, password, username, fullName);
            if (result.success) {
                showNotification('✅ ' + result.message, 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            } else {
                showNotification('❌ ' + result.error, 'error');
            }
        });
    }
});

// Exportar para uso global
window.authManager = authManager;
window.logout = function() {
    authManager.logout();
};
