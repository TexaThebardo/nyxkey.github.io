// 🔐 AUTENTICACIÓN CON SUPABASE
const SUPABASE_URL = 'https://dxjojpuiphjbsyyxmgto.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_HPIVOX8ZqrQ4P1Wdw85pWw_DkUG3c0K';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.session = null;
        this.init();
    }

    // Inicializar
    init() {
        // Verificar si hay sesión guardada
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
        this.updateUI();
    }

    // Registrar usuario
    async register(email, password, username, fullName) {
        try {
            // Simulación con Supabase (usa tu configuración real)
            const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY
                },
                body: JSON.stringify({
                    email,
                    password,
                    data: { username, full_name: fullName }
                })
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }

            this.currentUser = {
                id: data.user.id,
                email: data.user.email,
                username: username,
                full_name: fullName,
                role: 'user'
            };

            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUI();
            return { success: true, user: this.currentUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Iniciar sesión
    async login(email, password) {
        try {
            // Simulación con Supabase
            const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }

            // Verificar si es admin (hardcodeado para demo)
            const isAdmin = email === 'admin@cardnmr.com' || email === 'admin@cardnmr.store';

            this.currentUser = {
                id: data.user.id,
                email: data.user.email,
                username: data.user.user_metadata?.username || email.split('@')[0],
                full_name: data.user.user_metadata?.full_name || '',
                role: isAdmin ? 'admin' : 'user'
            };

            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUI();
            return { success: true, user: this.currentUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Cerrar sesión
    async logout() {
        try {
            // Logout en Supabase
            await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('supabase_token');
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

    // Actualizar UI según autenticación
    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                if (userName) userName.textContent = this.currentUser.full_name || this.currentUser.username;
            }
            
            // Agregar link de admin si es admin
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
        }
    }
}

// Instancia global
const authManager = new AuthManager();

// Event listeners para formularios
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = await authManager.login(email, password);
            if (result.success) {
                showNotification('✅ ¡Bienvenido!', 'success');
                window.location.href = 'index.html';
            } else {
                showNotification(`❌ ${result.error}`, 'error');
            }
        });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const username = document.getElementById('registerUsername').value;
            const fullName = document.getElementById('registerFullName').value;
            
            const result = await authManager.register(email, password, username, fullName);
            if (result.success) {
                showNotification('✅ ¡Registro exitoso!', 'success');
                window.location.href = 'login.html';
            } else {
                showNotification(`❌ ${result.error}`, 'error');
            }
        });
    }
});

// Exportar para uso global
window.authManager = authManager;
window.logout = function() {
    authManager.logout();
};
