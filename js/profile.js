// 👤 PERFIL DE USUARIO
document.addEventListener('DOMContentLoaded', () => {
    const user = authManager.getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar datos del usuario
    document.getElementById('profileName').textContent = user.full_name || user.username;
    document.getElementById('profileEmail').textContent = user.email;
    
    // Cargar pedidos
    loadOrders();
});

// Cargar pedidos del usuario
function loadOrders() {
    const container = document.getElementById('profileSection');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = orders.filter(order => order.user.id === authManager.getCurrentUser().id);

    if (userOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-box-open fa-3x"></i>
                <h3>No tienes pedidos</h3>
                <p>Realiza tu primera compra en la tienda</p>
                <a href="shop.html" class="btn-primary">Ir a la tienda</a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <h2>Mis Pedidos</h2>
        <div class="orders-list">
            ${userOrders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <span class="order-id">#${order.id}</span>
                        <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                        <span class="order-status ${order.status}">${order.status}</span>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span>${item.name} x${item.quantity}</span>
                                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-total">
                        <strong>Total: $${order.total.toFixed(2)}</strong>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
