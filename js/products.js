// 📦 GESTIÓN DE PRODUCTOS - VERSIÓN COMPLETA
class ProductsManager {
    constructor() {
        this.products = [];
        this.loading = false;
        this.categories = ['premium', 'elite', 'standard'];
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
    }

    // Cargar productos
    async loadProducts() {
        try {
            this.loading = true;
            
            // Intentar cargar desde JSON
            const response = await fetch('data/products.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar products.json');
            }
            const data = await response.json();
            this.products = data.products || [];
            
            // Guardar backup en localStorage
            localStorage.setItem('products_backup', JSON.stringify(this.products));
            
            return this.products;
        } catch (error) {
            console.error('Error cargando productos:', error);
            
            // Fallback: cargar desde localStorage
            const localData = localStorage.getItem('products_backup');
            if (localData) {
                try {
                    this.products = JSON.parse(localData);
                    return this.products;
                } catch (e) {
                    console.error('Error parsing local data:', e);
                }
            }
            
            // Fallback final: productos por defecto
            this.products = this.getDefaultProducts();
            return this.products;
        } finally {
            this.loading = false;
        }
    }

    // Productos por defecto (si no hay datos)
    getDefaultProducts() {
        return [
            {
                id: 'card_001',
                name: 'Visa Gold Premium',
                description: 'Tarjeta Visa Gold con límite alto, perfecta para compras internacionales y viajes',
                price: 149.99,
                card_type: 'Visa',
                card_number: '4532 1234 5678 9012',
                card_expiry: '12/26',
                card_cvv: '***',
                card_holder: 'Premium User',
                stock: 5,
                image: 'images/cards/visa-gold.jpg',
                category: 'premium',
                features: ['Límite $10,000', 'Compras internacionales', 'Seguro de viaje'],
                status: 'active',
                rating: 4.8
            },
            {
                id: 'card_002',
                name: 'Mastercard Black Elite',
                description: 'Mastercard Black edición limitada con beneficios exclusivos para clientes VIP',
                price: 249.99,
                card_type: 'Mastercard',
                card_number: '5532 8765 4321 0987',
                card_expiry: '08/27',
                card_cvv: '***',
                card_holder: 'Elite Member',
                stock: 3,
                image: 'images/cards/mastercard-black.jpg',
                category: 'elite',
                features: ['Límite $25,000', 'Acceso a lounges', 'Cashback 5%'],
                status: 'active',
                rating: 4.9
            },
            {
                id: 'card_003',
                name: 'American Express Platinum',
                description: 'American Express Platinum con beneficios de viaje premium y acceso VIP',
                price: 399.99,
                card_type: 'Amex',
                card_number: '3782 123456 78901',
                card_expiry: '06/28',
                card_cvv: '***',
                card_holder: 'Travel Pro',
                stock: 2,
                image: 'images/cards/amex-platinum.jpg',
                category: 'premium',
                features: ['Límite $50,000', 'Seguro de viaje premium', 'Acceso a lounges VIP'],
                status: 'active',
                rating: 4.7
            }
        ];
    }

    // Obtener todos los productos activos
    getAllProducts() {
        return this.products.filter(p => p.status === 'active');
    }

    // Obtener producto por ID
    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    // Obtener productos por categoría
    getProductsByCategory(category) {
        if (category === 'all') {
            return this.getAllProducts();
        }
        return this.products.filter(p => p.category === category && p.status === 'active');
    }

    // Obtener productos destacados
    getFeaturedProducts(limit = 6) {
        return this.getAllProducts().slice(0, limit);
    }

    // Buscar productos
    searchProducts(query) {
        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) return this.getAllProducts();
        
        return this.getAllProducts().filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.card_type.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }

    // Obtener categorías
    getCategories() {
        return this.categories;
    }

    // 🔧 FUNCIONES DE ADMIN

    // Agregar producto
    addProduct(product) {
        const newProduct = {
            ...product,
            id: `card_${Date.now()}`,
            created_at: new Date().toISOString(),
            status: 'active',
            rating: 0
        };
        this.products.push(newProduct);
        this.saveToLocal();
        this.saveToJson();
        return newProduct;
    }

    // Actualizar producto
    updateProduct(id, updatedData) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedData };
            this.saveToLocal();
            this.saveToJson();
            return true;
        }
        return false;
    }

    // Eliminar producto
    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveToLocal();
            this.saveToJson();
            return true;
        }
        return false;
    }

    // Cambiar estado del producto
    toggleStatus(id) {
        const product = this.getProductById(id);
        if (product) {
            product.status = product.status === 'active' ? 'inactive' : 'active';
            this.saveToLocal();
            this.saveToJson();
            return true;
        }
        return false;
    }

    // Guardar en localStorage
    saveToLocal() {
        try {
            localStorage.setItem('products_backup', JSON.stringify(this.products));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    // Guardar como JSON (para descargar)
    saveToJson() {
        const jsonData = {
            products: this.products,
            settings: {
                store_name: "CardNMR Store",
                currency: "USD",
                updated_at: new Date().toISOString()
            }
        };
        localStorage.setItem('products_json', JSON.stringify(jsonData));
    }

    // Exportar JSON para GitHub
    exportToJson() {
        const jsonData = {
            products: this.products,
            settings: {
                store_name: "CardNMR Store",
                currency: "USD",
                updated_at: new Date().toISOString()
            }
        };
        return JSON.stringify(jsonData, null, 2);
    }

    // Configurar event listeners para búsqueda y filtros
    setupEventListeners() {
        // Búsqueda en tiempo real
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                const filtered = this.searchProducts(query);
                this.renderProducts(filtered);
            });
        }

        // Filtros de categoría
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

    // Renderizar productos en la tienda
    renderProducts(products) {
        const container = document.getElementById('productsContainer');
        if (!container) return;

        if (!products || products.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search fa-3x"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otros términos de búsqueda</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image || 'images/cards/default.jpg'}" 
                         alt="${product.name}" 
                         onerror="this.src='images/cards/default.jpg'">
                    ${product.stock <= 0 ? '<div class="out-of-stock-badge">Agotado</div>' : ''}
                </div>
                <div class="card-details">
                    <div class="card-header">
                        <span class="card-badge ${product.card_type.toLowerCase()}">${product.card_type}</span>
                        <span class="product-category">${product.category}</span>
                    </div>
                    <h3>${product.name}</h3>
                    <div class="card-number">${this.formatCardNumber(product.card_number)}</div>
                    <div class="card-expiry">Expira: ${product.card_expiry || '12/26'}</div>
                    <div class="product-features">
                        ${product.features ? product.features.slice(0, 2).map(f => 
                            `<span class="feature-tag">✓ ${f}</span>`
                        ).join('') : ''}
                    </div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-rating">
                        ${this.renderStars(product.rating || 0)}
                        <span>(${product.rating || 0})</span>
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
    }

    // Formatear número de tarjeta
    formatCardNumber(number) {
        if (!number) return '•••• •••• •••• ••••';
        const clean = number.replace(/\s/g, '');
        if (clean.length <= 4) return clean;
        const last4 = clean.slice(-4);
        return `•••• •••• •••• ${last4}`;
    }

    // Renderizar estrellas
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

    // Obtener instrucciones para GitHub
    getGitHubInstructions() {
        const jsonData = this.exportToJson();
        return `
📝 CÓMO ACTUALIZAR TU TIENDA EN GITHUB:

1. Ve a: https://github.com/tu-usuario/card-nmr-store/edit/main/data/products.json

2. Copia este JSON y pégalo en el archivo:

${jsonData}

3. Escribe un mensaje de commit (ej: "Actualizar productos")
4. Haz clic en "Commit changes"
5. ¡Listo! Los cambios se publican automáticamente
        `;
    }
}

// Crear instancia global
const productManager = new ProductsManager();

// Exportar para uso global
window.productManager = productManager;

// Inicializar productos al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    await productManager.loadProducts();
    
    // Renderizar productos en la tienda
    if (document.getElementById('productsContainer')) {
        productManager.renderProducts(productManager.getAllProducts());
    }
    
    // Renderizar productos destacados
    if (document.getElementById('featuredProducts')) {
        const featured = productManager.getFeaturedProducts(6);
        productManager.renderProducts(featured);
    }
});
