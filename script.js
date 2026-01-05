// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const discordButton = document.getElementById('discordButton');
const togglePassword = document.getElementById('togglePassword');
const keyInput = document.getElementById('key');
const toggleTheme = document.getElementById('toggleTheme');
const countdownElement = document.getElementById('countdown');
const keyModal = document.getElementById('keyModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const goToDiscordBtn = document.getElementById('goToDiscordBtn');
const toastContainer = document.getElementById('toastContainer');

// Estado de la aplicación
let isDarkMode = true;
let loginAttempts = 0;
const MAX_ATTEMPTS = 3;

// Datos de ejemplo para estadísticas
const stats = {
    usersOnline: 1247,
    keysToday: 342,
    uptime: 99.7
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar estadísticas
    updateStats();
    
    // Configurar tema
    const savedTheme = localStorage.getItem('nyx-theme');
    if (savedTheme === 'light') {
        toggleThemeMode();
    }
    
    // Configurar modal
    setupModal();
    
    // Iniciar contador simulado
    startCountdown();
    
    // Simular datos en tiempo real
    simulateRealTimeData();
    
    // Mostrar toast de bienvenida
    setTimeout(() => {
        showToast('info', 'System Online', 'Nyx Executor v3.7 is ready for authentication');
    }, 1000);
});

// Función para mostrar notificaciones toast
function showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        error: 'fas fa-times-circle',
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        toast.style.animation = 'slideLeft 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Función para alternar visibilidad de la contraseña
togglePassword.addEventListener('click', () => {
    const type = keyInput.getAttribute('type') === 'password' ? 'text' : 'password';
    keyInput.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

// Función para alternar tema oscuro/claro
toggleTheme.addEventListener('click', toggleThemeMode);

function toggleThemeMode() {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    toggleTheme.innerHTML = isDarkMode ? 
        '<i class="fas fa-moon"></i> Dark Mode' : 
        '<i class="fas fa-sun"></i> Light Mode';
    localStorage.setItem('nyx-theme', isDarkMode ? 'dark' : 'light');
}

// Función para actualizar estadísticas
function updateStats() {
    document.getElementById('usersOnline').textContent = stats.usersOnline.toLocaleString();
    document.getElementById('keysToday').textContent = stats.keysToday;
    document.getElementById('uptime').textContent = `${stats.uptime}%`;
}

// Función para simular datos en tiempo real
function simulateRealTimeData() {
    setInterval(() => {
        // Incrementar usuarios online aleatoriamente
        const change = Math.floor(Math.random() * 10) - 3;
        stats.usersOnline = Math.max(1000, stats.usersOnline + change);
        
        // Incrementar claves hoy
        if (Math.random() > 0.7) {
            stats.keysToday += Math.floor(Math.random() * 3) + 1;
        }
        
        updateStats();
    }, 10000);
}

// Función para iniciar contador simulado
function startCountdown() {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let days = 0;
    
    setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
        if (hours === 24) {
            hours = 0;
            days++;
        }
        
        // Mostrar siempre 0 para simular expirado
        countdownElement.textContent = `0d, 0m, 0s`;
    }, 1000);
}

// Configurar modal
function setupModal() {
    // Abrir modal al hacer clic en "Lost your key?"
    document.querySelector('.forgot-link').addEventListener('click', (e) => {
        e.preventDefault();
        keyModal.classList.add('active');
    });
    
    // Cerrar modal
    closeModalBtn.addEventListener('click', () => {
        keyModal.classList.remove('active');
    });
    
    // Cerrar modal al hacer clic fuera
    keyModal.addEventListener('click', (e) => {
        if (e.target === keyModal) {
            keyModal.classList.remove('active');
        }
    });
    
    // Botón "Go to Discord" en modal
    goToDiscordBtn.addEventListener('click', () => {
        keyModal.classList.remove('active');
        showToast('info', 'Redirecting', 'Opening Discord in new tab...');
        setTimeout(() => {
            window.open('https://discord.gg/example', '_blank');
        }, 500);
    });
}

// Manejar envío del formulario
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const key = document.getElementById('key').value.trim();
    const remember = document.getElementById('remember').checked;
    
    // Validaciones básicas
    if (!username || !key) {
        showToast('error', 'Missing Information', 'Please fill in all fields');
        return;
    }
    
    if (key.length < 10) {
        showToast('warning', 'Invalid Format', 'Key should be at least 10 characters');
        return;
    }
    
    // Incrementar intentos
    loginAttempts++;
    
    // Cambiar estado del botón
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> VERIFYING...';
    loginButton.disabled = true;
    
    // Simular ver
