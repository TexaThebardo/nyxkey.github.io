// 🔐 AUTENTICACIÓN CON SUPABASE - CONFIGURACIÓN COMPLETA

// === TUS CREDENCIALES DE SUPABASE ===
const SUPABASE_URL = 'https://dxjojpuiphjbsyyxmgto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4am9qcHVpcGhqYnN5eXhtZ3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2MTM2MTAsImV4cCI6MjEwMTE4OTYxMH0.H-uCrmQXcrfCol8wxBn4zM51OtwvzkroBOsmdiEP-_M';
// === FIN CREDENCIALES ===

class SupabaseAuthManager {
    constructor() {
        this.currentUser = null;
        this.session = null;
        this.init();
    }

    async init() {
        // Verificar sesión guardada
        const savedSession = localStorage.getItem('supabase_session');
        if (savedSession) {
            try {
                this.session = JSON.parse(savedSession);
                this.currentUser = this.session?.user || null;
                // Verificar si el token sigue siendo válido
                await this.refreshSession();
            } catch (e) {
                console.log('Sesión expirada o inválida');
                this.clearSession();
            }
        }
        this.updateUI();
        this.setupAuthListener();
    }

    // Configurar listener de autenticación
    setupAuthListener() {
        // Escuchar cambios en la autenticación
        window.addEventListener('storage', (e) => {
            if (e.key === 'supabase_session') {
                this.init();
            }
        });
    }

    // Refrescar sesión
    async refreshSession() {
        try {
            const token = localStorage.getItem('supabase_token');
            if (!token) return;

            const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const user = await response.json();
                this.currentUser = user;
                this.session = { user };
                localStorage.setItem('supabase_session', JSON.stringify(this.session));
            } else {
                this.clearSession();
            }
        } catch (error) {
            console.error('Error refreshing session:', error);
            this.clearSession();
        }
    }

    // Registrar usuario con Supabase
    async register(email, password, username, fullName) {
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

            const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    data: { 
                        username: username,
                        full_name: fullName || username,
                        role: 'user'
                    }
                })
            });

            const data = await response.json();

            if (data.error) {
                return { 
                    success: false, 
                    error: data.error.message || 'Error al registrar usuario'
                };
            }

            if (!data.user) {
                return { 
                    success: false, 
                    error: 'No se pudo crear el usuario' 
                };
            }

            // Guardar sesión
            if (data.session) {
                localStorage.setItem('supabase_token', data.session.access_token);
                this.session = data.session;
                this.currentUser = data.user;
                localStorage.setItem('supabase_session', JSON.stringify(this.session));
            }

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

    // Iniciar sesión con Supabase
    async login(email, password) {
        try {
            if (!email || !password) {
                return { 
                    success: false, 
                    error: 'Email y contraseña son obligatorios' 
                };
            }

            const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (data.error) {
                return { 
                    success: false, 
                    error: data.error.message || 'Email o contraseña incorrectos'
                };
            }

            if (!data.user) {
                return { 
                    success: false, 
                    error: 'Usuario no encontrado' 
                };
            }

            // Guardar sesión
            localStorage.setItem('supabase_token', data.access_token);
            this.session = data;
            this.currentUser = data.user;
            localStorage.setItem('supabase_session', JSON.stringify(this.session));

            // Verificar si es admin (puedes cambiar esto)
            const isAdmin = email === 'admin@cardnmr.com' || email === 'admin@cardnmr.store';

            this.updateUI();

            return { 
                success: true, 
                user: this.currentUser,
                role: isAdmin ? 'admin' : 'user',
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
    async logout() {
        try {
            const token = localStorage.getItem('supabase_token');
            if (token) {
                await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        }

        this.clearSession();
        this.updateUI();
        window.location.href = 'index.html';
    }

    // Limpiar sesión
    clearSession() {
        this.currentUser = null;
        this.session = null;
        localStorage.removeItem('supabase_token');
        localStorage.removeItem('supabase_session');
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
        const email = this.currentUser?.email;
        return email === 'admin@cardnmr.com' || email === 'admin@cardnmr.store';
    }

    // Obtener perfil del usuario
    async getProfile() {
        if (!this.currentUser) return null;
        
        try {
            const token = localStorage.getItem('supabase_token');
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/profiles?id=eq.${this.currentUser.id}`,
                {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.ok) {
                const profiles = await response.json();
                return profiles[0] || null;
            }
        } catch (error) {
            console.error('Error getting profile:', error);
        }
        return null;
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
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                if (userName) {
                    const name = this.currentUser.user_metadata?.full_name || 
                                this.currentUser.user_metadata?.username || 
                                this.currentUser.email?.split('@')[0] || 'Usuario';
                    userName.textContent = name;
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
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
        }
    }
}

// Instancia global
const authManager = new SupabaseAuthManager();

// Event listeners para formularios
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            if (!email || !password) {
                showNotification('❌ Completa todos los campos', 'error');
                return;
            }
            
            const result = await authManager.login(email, password);
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
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim();
            const username = document.getElementById('registerUsername').value.trim();
            const fullName = document.getElementById('registerFullName').value.trim();
            
            if (!email || !password || !username) {
                showNotification('❌ Completa todos los campos', 'error');
                return;
            }
            
            const result = await authManager.register(email, password, username, fullName);
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
});

// Exportar para uso global
window.authManager = authManager;
window.logout = function() {
    authManager.logout();
};
