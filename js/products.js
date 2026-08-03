// 📦 GESTIÓN DE PRODUCTOS

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
            
            localStorage.setItem('products_backup', JSON.stringify(this.products));
            console.log('✅ Productos cargados:', this.products.length);
            return this.products;
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
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
            this.products = [
                {
                    id: 'card_001',
                    name: 'Visa Gold Premium',
                    bin: '414728',
                    database: 'DB_July_2026',
                    class: 'CREDIT',
                    level: 'PLATINUM',
                    bank: 'JPMORGAN CHASE',
                    country: 'UNITED STATES',
                    type: 'CC Full',
                    service: 'Multifuncional',
                    extra: 'NON',
                    price: 28.58,
                    stock: 5,
                    card_type: 'Visa',
                    category: 'premium',
                    rating: 4.8
                },
                {
                    id: 'card_002',
                    name: 'Mastercard Black Elite',
                    bin: '521894',
                    database: 'DB_July_2026',
                    class: 'CREDIT',
                    level: 'TITANIUM',
                    bank: 'CAPITAL ONE BANK',
                    country: 'UNITED STATES',
                    type: 'Non',
                    service: 'VBV',
                    extra: 'Non-VBV',
                    price: 48.58,
                    stock: 3,
                    card_type: 'Mastercard',
                    category: 'elite',
                    rating: 4.9
                }
            ];
            return this.products;
        } finally {
            this.loading = false;
        }
    }

    getAllProducts() {
        return this.products.filter(p => p.status !== 'inactive');
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    getFeaturedProducts(limit = 6) {
        return this.getAllProducts().slice(0, limit);
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        return stars;
    }
}

const productManager = new ProductsManager();
window.productManager = productManager;

document.addEventListener('DOMContentLoaded', async function() {
    await productManager.loadProducts();
    console.log('🚀 ProductManager inicializado');
});
