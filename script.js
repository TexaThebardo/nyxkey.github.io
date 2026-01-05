// Elementos del DOM
const loadingScreen = document.getElementById('loadingScreen');
const mainContent = document.getElementById('mainContent');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const keyTypeSelect = document.getElementById('keyType');
const keyQuantitySlider = document.getElementById('keyQuantity');
const quantityValue = document.getElementById('quantityValue');
const countdownContainer = document.getElementById('countdownContainer');
const countdownTimer = document.getElementById('countdownTimer');
const resultsContainer = document.getElementById('resultsContainer');
const generatedKeys = document.getElementById('generatedKeys');
const copyAllBtn = document.getElementById('copyAllBtn');
const saveBtn = document.getElementById('saveBtn');
const discordJoinBtn = document.getElementById('discordJoinBtn');
const themeToggle = document.getElementById('themeToggle');
const successModal = document.getElementById('successModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCopyBtn = document.getElementById('modalCopyBtn');
const toastContainer = document.getElementById('toastContainer');

// Variables de estado
let isGenerating = false;
let generatedKeysList = [];
let countdownInterval;
let currentCountdown = 10;

// Caracteres para generar keys
const keyChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Estadísticas iniciales
let stats = {
    keysGenerated: 142,
    discordOnline: 2847,
    discordOffline: 1253,
    discordMembers: 4100,
    totalKeys: 1248,
    activeUsers: 893,
    successRate: 98.7
};

// ===== PANTALLA DE CARGA =====
document.addEventListener('DOMContentLoaded', () => {
    // Iniciar pantalla de carga
    simulateLoading();
    
    // Inicializar estadísticas
    updateStats();
    
    // Actualizar fecha del servidor
    updateServerDate();
    
    // Simular actividad en Discord
    simulateDiscordActivity();
    
    // Actualizar estadísticas periódicamente
    setInterval(updateLiveStats, 10000);
});

function simulateLoading() {
    let progress = 0;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
        
        if (progress === 100) {
            clearInterval(loadingInterval);
            
            // Esperar un poco más para efecto
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    mainContent.style.display = 'block';
                    
                    // Mostrar toast de bienvenida
                    showToast('success', '¡Sistema Cargado!', 'Generador NYX v3.7 listo para usar');
                }, 500);
            }, 500);
        }
    }, 200);
}

// ===== ACTUALIZACIÓN DE ESTADÍSTICAS =====
function updateStats() {
    // Actualizar UI con estadísticas
    document.getElementById('keysGenerated').textContent = stats.keysGenerated;
    document.getElementById('discordOnline').textContent = stats.discordOnline.toLocaleString();
    document.getElementById('discordOffline').textContent = stats.discordOffline.toLocaleString();
    document.getElementById('discordMembers').textContent = stats.discordMembers.toLocaleString();
    document.getElementById('totalKeys').textContent = stats.totalKeys.toLocaleString();
    document.getElementById('activeUsers').textContent = stats.activeUsers.toLocaleString();
    document.getElementById('successRate').textContent = `${stats.successRate}%`;
    
    // Actualizar tiempo desde última actualización
    document.getElementById('lastUpdate').textContent = Math.floor(Math.random() * 5) + 1;
}

function updateServerDate() {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    document.getElementById('serverDate').textContent = formattedDate;
}

function updateLiveStats() {
    // Incrementar estadísticas aleatoriamente
    stats.keysGenerated += Math.floor(Math.random() * 3);
    stats.totalKeys += Math.floor(Math.random() * 5);
    
    // Variar usuarios online en Discord
    const onlineChange = Math.floor(Math.random() * 20) - 10;
    stats.discordOnline = Math.max(2800, stats.discordOnline + onlineChange);
    stats.discordOffline = Math.max(1200, stats.discordOffline - onlineChange);
    
    updateStats();
}

function simulateDiscordActivity() {
    const activityList = document.querySelector('.activity-list');
    
    // Agregar nueva actividad cada 30 segundos
    setInterval(() => {
        const activities = [
            {
                icon: 'key-gen',
                text: `<strong>@User${Math.floor(Math.random() * 1000)}</strong> generó una key ${['Freemium', 'Premium', 'Ultimate'][Math.floor(Math.random() * 3)]}`,
                time: 'hace 1m'
            },
            {
                icon: 'join',
                text: `<strong>@NewUser${Math.floor(Math.random() * 100)}</strong> se unió al servidor`,
                time: 'hace 3m'
            },
            {
                icon: 'update',
                text: `Nuevo script añadido: <strong>${['Infinite Yield', 'Dark Dex', 'CMD-X'][Math.floor(Math.random() * 3)]}</strong>`,
                time: 'hace 5m'
            }
        ];
        
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        const li = document.createElement('li');
        li.innerHTML = `
            <i class="fas fa-${activity.icon} activity-icon ${activity.icon}"></i>
            <span>${activity.text}</span>
            <span class="activity-time">${activity.time}</span>
        `;
        
        // Agregar al principio de la lista
        activityList.insertBefore(li, activityList.firstChild);
        
        // Limitar a 3 elementos
        if (activityList.children.length > 3) {
            activityList.removeChild(activityList.lastChild);
        }
    }, 30000);
}

// ===== GENERADOR DE KEYS =====
// Actualizar valor del slider
keyQuantitySlider.addEventListener('input', () => {
    quantityValue.textContent = keyQuantitySlider.value;
});

// Generar una key aleatoria
function generateRandomKey(format = 'standard') {
    let key = '';
    
    if (format === 'standard') {
        // Formato: NYX-XXXX-XXXX-XXXX
        key = 'NYX-';
        for (let i = 0; i < 12; i++) {
            key += keyChars.charAt(Math.floor(Math.random() * keyChars.length));
            if (i === 3 || i === 7) key += '-';
        }
    } else {
        // Formato: NYX-XXXXXXXXXXXX
        key = 'NYX-';
        for (let i = 0; i < 12; i++) {
            key += keyChars.charAt(Math.floor(Math.random() * keyChars.length));
        }
    }
    
    return key;
}

// Obtener tiempo de expiración según tipo de key
function getExpiryTime(keyType) {
    const expiryTimes = {
        'freemium': '24 horas',
        'premium': '7 días',
        'ultimate': '30 días',
        'lifetime': 'Vitalicia'
    };
    
    return expiryTimes[keyType] || '24 horas';
}

// Iniciar generación
generateBtn.addEventListener('click', () => {
    if (isGenerating) return;
    
    const keyType = keyTypeSelect.value;
    const keyQuantity = parseInt(keyQuantitySlider.value);
    const keyFormat = document.querySelector('input[name="format"]:checked').value;
    
    // Mostrar contador
    isGenerating = true;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GENERANDO...';
    
    countdownContainer.style.display = 'block';
    resultsContainer.style.display = 'none';
    
    currentCountdown = 10;
    countdownTimer.textContent = currentCountdown;
    
    // Iniciar contador
    countdownInterval = setInterval(() => {
        currentCountdown--;
        countdownTimer.textContent = currentCountdown;
        
        if (currentCountdown <= 0) {
            clearInterval(countdownInterval);
            finishGeneration(keyType, keyQuantity, keyFormat);
        }
    }, 1000);
});

// Finalizar generación y mostrar resultados
function finishGeneration(keyType, quantity, format) {
    // Generar keys
    generatedKeysList = [];
    for (let i = 0; i < quantity; i++) {
        generatedKeysList.push(generateRandomKey(format));
    }
    
    // Actualizar estadísticas
    stats.keysGenerated += quantity;
    stats.totalKeys += quantity;
    updateStats();
    
    // Mostrar resultados
    countdownContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    
    // Actualizar información de expiración
    document.getElementById('expiryDate').textContent = getExpiryTime(keyType);
    document.getElementById('keysRemaining').textContent = Math.max(0, 100 - (stats.keysGenerated % 100));
    
    // Mostrar keys generadas
    generatedKeys.innerHTML = '';
    generatedKeysList.forEach((key, index) => {
        const keyElement = document.createElement('div');
        keyElement.className = 'key-item';
        keyElement.innerHTML = `
            <div class="key-value">${key}</div>
            <div class="key-actions">
                <button class="copy-btn" data-key="${key}" data-index="${index}">
                    <i class="fas fa-copy"></i> Copiar
                </button>
                <button class="delete-btn" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        generatedKeys.appendChild(keyElement);
    });
    
    // Restaurar botón
    isGenerating = false;
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<i class="fas fa-bolt"></i> GENERAR KEY(S)';
    
    // Mostrar modal de éxito
    showSuccessModal(keyType, quantity);
    
    // Mostrar toast
    showToast('success', '¡Keys Generadas!', `Se generaron ${quantity} key(s) exitosamente`);
}

// Mostrar modal de éxito
function showSuccessModal(keyType, quantity) {
    const modalKeyCount = document.getElementById('modalKeyCount');
    const modalKeys = document.getElementById('modalKeys');
    const modalExpiry = document.getElementById('modalExpiry');
    
    modalKeyCount.textContent = quantity;
    modalKeys.textContent = generatedKeysList[0]; // Mostrar solo la primera
    modalExpiry.textContent = getExpiryTime(keyType);
    
    successModal.classList.add('active');
}

// Cerrar modal
modalCloseBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
});

// Copiar keys desde modal
modalCopyBtn.addEventListener('click', () => {
    copyKeysToClipboard();
    successModal.classList.remove('active');
});

// Cerrar modal al hacer clic fuera
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});

// Cerrar modal con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
        successModal.classList.remove('active');
    }
});

// ===== FUNCIONALIDAD DE COPIA =====
// Copiar key individual
document.addEventListener('click', (e) => {
    if (e.target.closest('.copy-btn')) {
        const key = e.target.closest('.copy-btn').dataset.key;
        copyToClipboard(key);
        showToast('success', 'Key Copiada', 'La key se copió al portapapeles');
    }
    
    // Eliminar key individual
    if (e.target.closest('.delete-btn')) {
        const index = parseInt(e.target.closest('.delete-btn').dataset.index);
        generatedKeysList.splice(index, 1);
        
        // Actualizar UI
        finishGeneration(keyTypeSelect.value, generatedKeysList.length, 
            document.querySelector('input[name="format"]:checked').value);
    }
});

// Copiar todas las keys
copyAllBtn.addEventListener('click', () => {
    if (generatedKeysList.length === 0) {
        showToast('warning', 'Sin Keys', 'No hay keys para copiar');
        return;
    }
    
    copyKeysToClipboard();
});

// Guardar keys como archivo .txt
saveBtn.addEventListener('click', () => {
    if (generatedKeysList.length === 0) {
        showToast('warning', 'Sin Keys', 'No hay keys para guardar');
        return;
    }
    
    const keyType = keyTypeSelect.value;
    const expiry = getExpiryTime(keyType);
    
    let content = `=== KEYS NYX GENERATOR v3.7 ===\n`;
    content += `Fecha de generación: ${new Date().toLocaleString()}\n`;
    content += `Tipo de key: ${keyType.toUpperCase()}\n`;
    content += `Expira en: ${expiry}\n`;
    content += `Cantidad: ${generatedKeysList.length}\n\n`;
    
    generatedKeysList.forEach((key, index) => {
        content += `${index + 1}. ${key}\n`;
    });
    
    content += `\n=== FIN DE LISTADO ===\n`;
    content += `© 2024 NYX Generator | discord.gg/nyx`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nyx_keys_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('success', 'Keys Guardadas', 'Archivo .txt descargado exitosamente');
});

// Función para copiar keys al portapapeles
function copyKeysToClipboard() {
    const keysText = generatedKeysList.join('\n');
    copyToClipboard(keysText);
    showToast('success', '¡Todas las Keys Copiadas!', 'Se copiaron al portapapeles');
}

// Función genérica para copiar al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Texto copiado al portapapeles');
    }).catch(err => {
        console.error('Error al copiar: ', err);
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
}

// ===== BOTÓN RESET =====
resetBtn.addEventListener('click', () => {
    if (isGenerating) {
        clearInterval(countdownInterval);
        isGenerating = false;
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-bolt"></i> GENERAR KEY(S)';
        countdownContainer.style.display = 'none';
        showToast('info', 'Generación Cancelada', 'El proceso fue interrumpido');
    }
    
    resultsContainer.style.display = 'none';
    generatedKeysList = [];
    keyTypeSelect.value = 'freemium';
    keyQuantitySlider.value = 1;
    quantityValue.textContent = '1';
    document.querySelector('input[name="format"][value="standard"]').checked = true;
    
    showToast('info', 'Sistema Reiniciado', 'Configuración restablecida a valores por defecto');
});

// ===== BOTÓN DISCORD =====
discordJoinBtn.addEventListener('click', () => {
    showToast('info', 'Redirigiendo a Discord', 'Abrindo servidor oficial NYX...');
    discordJoinBtn.innerHTML = '<i class="fab fa-discord fa-spin"></i> CONECTANDO...';
    
    setTimeout(() => {
        // En un caso real, esto abriría el enlace de Discord
        // window.open('https://discord.gg/nyx', '_blank');
        discordJoinBtn.innerHTML = '<i class="fab fa-discord"></i> UNIRSE AL SERVIDOR';
        showToast('success', 'Discord Listo', 'Servidor oficial abierto en nueva pestaña');
    }, 1500);
});

// ===== TOGGLE TEMA =====
themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.innerHTML = isDark ? 
        '<i class="fas fa-moon"></i> Tema Oscuro' : 
        '<i class="fas fa-sun"></i> Tema Claro';
    
    localStorage.setItem('nyx-theme', isDark ? 'light' : 'dark');
});

// Cargar tema guardado
const savedTheme = localStorage.getItem('nyx-theme');
if (savedTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Tema Claro';
}

// ===== SISTEMA DE NOTIFICACIONES TOAST =====
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

// ===== EFECTO DE PARTÍCULAS EN FONDO =====
function createBackgroundParticles() {
    const container = document.querySelector('.container');
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'background-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(108, 99, 255, ${Math.random() * 0.2 + 0.05});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            z-index: -1;
        `;
        container.appendChild(particle);
        
        // Animación
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    let x = parseFloat(particle.style.left);
    let y = parseFloat(particle.style.top);
    let xSpeed = (Math.random() - 0.5) * 0.08;
    let ySpeed = (Math.random() - 0.5) * 0.08;
    
    function move() {
        x += xSpeed;
        y += ySpeed;
        
        // Rebotar en bordes
        if (x < 0 || x > 100) xSpeed *= -1;
        if (y < 0 || y > 100) ySpeed *= -1;
        
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        requestAnimationFrame(move);
    }
    
    move();
}

// Iniciar partículas cuando el contenido esté cargado
setTimeout(createBackgroundParticles, 1000);

// ===== FUNCIONALIDAD ADICIONAL =====
// Efectos de hover para elementos interactivos
document.querySelectorAll('.stat-card, .mini-stat, .key-item').forEach(el => {
    el.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
    });
    
    el.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// Simular actividad en tiempo real en el header
setInterval(() => {
    const statusBadge = document.querySelector('.status-badge');
    if (Math.random() > 0.98) {
        statusBadge.classList.remove('online');
        statusBadge.classList.add('offline');
        statusBadge.innerHTML = '<i class="fas fa-circle"></i> GENERATOR OFFLINE';
        statusBadge.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
        statusBadge.style.color = 'var(--danger)';
        statusBadge.style.borderColor = 'var(--danger)';
        
        showToast('warning', 'Servidor Inestable', 'El generador experimenta problemas temporales');
        
        setTimeout(() => {
            statusBadge.classList.remove('offline');
            statusBadge.classList.add('online');
            statusBadge.innerHTML = '<i class="fas fa-circle"></i> GENERATOR ONLINE';
            statusBadge.style.backgroundColor = 'rgba(0, 212, 170, 0.1)';
            statusBadge.style.color = 'var(--success)';
            statusBadge.style.borderColor = 'var(--success)';
            showToast('success', 'Servidor Recuperado', 'El generador está nuevamente operativo');
        }, 5000);
    }
}, 20000);
