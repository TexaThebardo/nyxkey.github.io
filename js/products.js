// 📦 GESTIÓN DE PRODUCTOS - VERSIÓN COMPLETA

class ProductsManager {
    constructor() {
        this.products = [];
        this.loading = false;
    }

    async loadProducts() {
        try {
            this.loading = true;
            console.log('🔄 Cargando productos...');
            
            const response = await fetch('data/products.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar products.json');
            }
            const data = await response.json();
            this.products = data.products || [];
            
            // Guardar backup
            localStorage.setItem('products_backup', JSON.stringify(this.products));
            console.log('✅ Productos cargados:', this.products.length);
            return this.products;
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
            
            // Intentar cargar desde localStorage
            const localData = localStorage.getItem('products_backup');
            if (localData) {
                try {
                    this.products = JSON.parse(localData);
                    console.log('✅ Productos cargados desde backup:', this.products.length);
                    return this.products;
                } catch (e) {
                    console.error('Error parsing local data:', e);
                }
            }
            
            // Productos por defecto
            this.products = this.getDefaultProducts();
            console.log('✅ Productos por defecto cargados:', this.products.length);
            return this.products;
        } finally {
            this.loading = false;
        }
    }

    getDefaultProducts() {
        return [
            {
                id: 'card_001',
                name: 'Visa Gold Premium',
                description: 'Tarjeta Visa Gold con límite alto',
                price: 149.99,
                card_type: 'Visa',
                card_number: '4532 1234 5678 9012',
                card_expiry: '12/26',
                stock: 5,
                image: '',
                category: 'premium',
                features: ['Límite $10,000', 'Compras internacionales'],
                status: 'active',
                rating: 4.8
            },
            {
                id: 'card_002',
                name: 'Mastercard Black Elite',
                description: 'Mastercard Black edición limitada',
                price: 249.99,
                card_type: 'Mastercard',
                card_number: '5532 8765 4321 0987',
                card_expiry: '08/27',
                stock: 3,
                image: '',
                category: 'elite',
                features: ['Límite $25,000', 'Cashback 5%'],
                status: 'active',
                rating: 4.9
            },
            {
                id: 'card_003',
                name: 'American Express Platinum',
                description: 'Amex Platinum con beneficios premium',
                price: 399.99,
                card_type: 'Amex',
                card_number: '3782 123456 78901',
                card_expiry: '06/28',
                stock: 2,
                image: '',
                category: 'premium',
                features: ['Límite $50,000', 'Acceso VIP'],
                status: 'active',
                rating: 4.7
            }
        ];
    }

    getAllProducts() {
        return this.products.filter(p => p.status === 'active');
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    getFeaturedProducts(limit = 6) {
        return this.getAllProducts().slice(0, limit);
    }

    getProductsByCategory(category) {
        if (category === 'all') return this.getAllProducts();
        return this.products.filter(p => p.category === category && p.status === 'active');
    }

    searchProducts(query) {
        if (!query) return this.getAllProducts();
        const searchTerm = query.toLowerCase();
        return this.getAllProducts().filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.card_type.toLowerCase().includes(searchTerm)
        );
    }

    // Renderizar productos en grid
    renderProducts(products, containerId = 'productsContainer') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn('⚠️ Contenedor no encontrado:', containerId);
            return;
        }

        if (!products || products.length === 0) {
            container.innerHTML = `
                <div class="no-results" style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
                    <i class="fas fa-box-open fa-3x" style="color: #4f46e5;"></i>
                    <h3 style="color: white; margin: 15px 0;">No hay productos disponibles</h3>
                    <p style="color: #a0aec0;">Vuelve más tarde</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image || 'https://via.placeholder.com/300x200/1a1a3e/818cf8?text=Card'}" 
                         alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/300x200/1a1a3e/818cf8?text=Card'">
                    ${product.stock <= 0 ? '<div class="out-of-stock-badge">Agotado</div>' : ''}
                </div>
                <div class="card-details">
                    <div class="card-header">
                        <span class="card-badge ${product.card_type?.toLowerCase() || 'visa'}">${product.card_type || 'Visa'}</span>
                        <span class="product-category">${product.category || 'Premium'}</span>
                    </div>
                    <h3>${product.name}</h3>
                    <div class="card-number">${product.card_number ? '•••• •••• •••• ' + product.card_number.slice(-4) : '•••• •••• •••• 4242'}</div>
                    <div class="card-expiry">Expira: ${product.card_expiry || '12/26'}</div>
                    <div class="product-features">
                        ${product.features ? product.features.slice(0, 2).map(f => 
                            `<span class="feature-tag">✓ ${f}</span>`
                        ).join('') : ''}
                    </div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-rating">
                        ${this.renderStars(product.rating || 4.5)}
                        <span>(${product.rating || 4.5})</span>
                    </div>
                    <div class="product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${product.stock > 0 ? `✅ ${product.stock} disponibles` : '❌ Agotado'}
                    </div>
                    <button onclick="window.addToCart('${product.id}')" 
                            class="btn-add-cart ${product.stock === 0 ? 'disabled' : ''}"
                            ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> 
                        ${product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                    </button>
                </div>
            </div>
        `).join('');

        console.log('✅ Productos renderizados:', products.length);
    }

    renderStars(rating) {
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
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                const filtered = this.searchProducts(query);
                this.renderProducts(filtered);
            });
        }

        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category || 'all';
                const filtered = this.getProductsByCategory(category);
                this.renderProducts(filtered);
            });
        });
    }
}

// Crear instancia global
const productManager = new ProductsManager();
window.productManager = productManager;

// Inicializar
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Inicializando productos...');
    await productManager.loadProducts();
    
    // Renderizar en tienda
    if (document.getElementById('productsContainer')) {
        const products = productManager.getAllProducts();
        productManager.renderProducts(products);
        productManager.setupEventListeners();
    }
    
    // Renderizar destacados en home
    if (document.getElementById('featuredProducts')) {
        const featured = productManager.getFeaturedProducts(6);
        productManager.renderProducts(featured, 'featuredProducts');
    }
});
