// ⚡ APLICACIÓN PRINCIPAL

function showNotification(message, type = 'success') {
    const existingToasts = document.querySelectorAll('.toast-modern');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast-modern toast-${type}`;

    const icons = { success: 'check_circle', error: 'error', info: 'info', warning: 'warning' };

    toast.innerHTML = `
        <span class="toast-icon material-icons">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()"><span class="material-icons">close</span></button>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 400);
    }, 4000);
}

window.showNotification = showNotification;

// Cargar Material Icons
const materialIconsLink = document.createElement('link');
materialIconsLink.rel = 'stylesheet';
materialIconsLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
document.head.appendChild(materialIconsLink);

document.addEventListener('DOMContentLoaded', function() {
    if (typeof authManager !== 'undefined') authManager.updateUI();
    if (typeof cartManager !== 'undefined') {
        cartManager.loadCart();
        cartManager.updateUI();
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof authManager !== 'undefined') authManager.logout();
        });
    }
});

console.log('✅ App cargada correctamente');
