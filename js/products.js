// 📦 GESTIÓN DE PRODUCTOS DESDE GITHUB
class ProductsManager {
    constructor() {
        this.products = [];
        this.loading = false;
    }

    // Cargar productos desde GitHub
    async loadProducts() {
        try {
            this.loading = true;
            // Leer desde GitHub Pages
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('Error al cargar productos');
            const data = await response.json();
            this.products = data.products || [];
            return this.products;
        } catch (error) {
            console.error('Error:', error);
            // Fallback: intentar cargar desde localStorage
            const localData = localStorage.getItem('products_backup');
            if (localData) {
                this.products = JSON.parse(localData);
            }
            return this.products;
        } finally {
            this.loading = false;
        }
    }

    // Obtener todos los productos
    getAllProducts() {
        return this.products.filter(p => p.status === 'active');
    }

    // Obtener producto por ID
    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    // Obtener productos por categoría
    getProductsByCategory(category) {
        return this.products.filter(p => p.category === category && p.status === 'active');
    }

    // 🔧 FUNCIONES DE ADMIN (guardan localmente, luego se suben a GitHub)
    
    // Agregar producto (local)
    addProduct(product) {
        const newProduct = {
            ...product,
            id: `card_${Date.now()}`,
            created_at: new Date().toISOString()
        };
        this.products.push(newProduct);
        this.saveToLocal();
        return newProduct;
    }

    // Editar producto
    updateProduct(id, updatedData) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedData };
            this.saveToLocal();
            return true;
        }
        return false;
    }

    // Eliminar producto
    deleteProduct(id) {
        this.products = this.products.filter(p => p.id !== id);
        this.saveToLocal();
        return true;
    }

    // Guardar en localStorage (backup)
    saveToLocal() {
        localStorage.setItem('products_backup', JSON.stringify(this.products));
        localStorage.setItem('products_json', JSON.stringify({ products: this.products }));
    }

    // 📝 INSTRUCCIONES PARA SUBIR A GITHUB
    getGitHubInstructions() {
        return `
        📝 CÓMO SUBIR CAMBIOS A GITHUB:
        1. Ve a tu repositorio en GitHub
        2. Abre el archivo data/products.json
        3. Haz clic en el lápiz (Edit)
        4. Copia y pega este JSON:
        ${JSON.stringify({ products: this.products }, null, 2)}
        5. Escribe un mensaje de commit: "Actualizar productos"
        6. Haz clic en "Commit changes"
        7. ¡Listo! Los cambios estarán en tu tienda en minutos
        `;
    }
}

// Exportar instancia global
const productManager = new ProductsManager();
