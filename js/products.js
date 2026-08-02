// 📦 GESTIÓN DE PRODUCTOS

class ProductsManager {
    constructor() {
        this.products = [];
        this.loading = false;
    }

    async loadProducts() {
        try {
            this.loading = true;
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('No se pudo cargar products.json');
            const data = await response.json();
            this.products = data.products || [];
            localStorage.setItem('products_backup', JSON.stringify(this.products));
            return this.products;
        } catch (error) {
            console.error('Error cargando productos:', error);
            const localData = localStorage.getItem('products_backup');
            if (localData) {
                try {
                    this.products = JSON.parse(localData);
                    return this.products;
                } catch (e) {
                    console.error('Error parsing local data:', e);
                }
            }
            this.products = this.getDefaultProducts();
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
}

// Crear instancia global
const productManager = new ProductsManager();
window.productManager = productManager;
