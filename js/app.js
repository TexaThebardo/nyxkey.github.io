// ⚡ APLICACIÓN PRINCIPAL
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar carrito
    cartManager.loadCart();
    updateCartCount();

    // Cargar productos destacados en la página principal
    if (document.getElementById('featuredProducts')) {
        await productManager.loadProducts();
        renderFeaturedProducts();
    }

    // Verificar sesión
    checkAuth();

    // Event listeners globales
    setupEventListeners();
});

// Renderizar productos destacados
async function renderFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const products = productManager.getAllProducts();
    const featured = products.slice(0, 6); // Mostrar 6 productos

    container.innerHTML = featured.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image || 'images/cards/default.jpg'}" alt="${product.name}">
            </div>
            <div class="card-details">
                <div class="card-badge ${product.card_type.toLowerCase()}">${product.card_type}</div>
                <h3>${product.name}</h3>
                <div class="card-number">${product.card_number}</div>
                <div class="card-expiry">Expira: ${product.card_expiry}</div>
                <div class="product-price">$${product.price}</div>
                <div class="product-rating">
                    ${renderStars(product.rating || 4.5)}
                    <span>(${product.rating || 4.5})</span>
                </div>
                <button onclick="addToCart('${product.id}')" class="btn-add-cart">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

// Renderizar estrellas de rating
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// Configurar event listeners
function setupEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Búsqueda en tiempo real
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    // Filtros de categoría
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.dataset.category);
        });
    });
}

// Función de búsqueda y filtrado
function filterProducts(category) {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const products = productManager.getAllProducts();
    
    let filtered = products;
    
    // Filtrar por categoría
    if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    // Filtrar por búsqueda
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.card_type.toLowerCase().includes(searchTerm)
        );
    }
    
    renderFilteredProducts(filtered);
}

// Renderizar productos filtrados
function renderFilteredProducts(products) {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image || 'images/cards/default.jpg'}" alt="${product.name}">
            </div>
            <div class="card-details">
                <div class="card-badge ${product.card_type.toLowerCase()}">${product.card_type}</div>
                <h3>${product.name}</h3>
                <div class="card-number">${product.card_number}</div>
                <div class="card-expiry">Expira: ${product.card_expiry}</div>
                <div class="product-price">$${product.price}</div>
                <div class="product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                    ${product.stock > 0 ? `✅ ${product.stock} disponibles` : '❌ Agotado'}
                </div>
                <button onclick="addToCart('${product.id}')" ${product.stock === 0 ? 'disabled' : ''} 
                        class="btn-add-cart ${product.stock === 0 ? 'disabled' : ''}">
                    <i class="fas fa-shopping-cart"></i> 
                    ${product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                </button>
            </div>
        </div>
    `).join('');
}

// Actualizar contador del carrito
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const total = cartManager.getTotalItems();
        cartCount.textContent = total;
        cartCount.style.display = total > 0 ? 'inline' : 'none';
    }
}

// Verificar autenticación
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');

    if (user) {
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            if (userName) userName.textContent = user.email || user.username;
        }
        // Mostrar link de admin si es admin
        if (user.role === 'admin') {
            document.querySelector('.nav-links').innerHTML += 
                '<a href="admin.html"><i class="fas fa-cog"></i> Admin</a>';
        }
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Función de logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Toast notifications
function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Exportar funciones globales
window.addToCart = function(productId) {
    const product = productManager.getProductById(productId);
    if (product) {
        cartManager.addItem(product);
        updateCartCount();
        showNotification(`✅ ${product.name} agregado al carrito`);
    }
};

window.showNotification = showNotification;
