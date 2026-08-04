// ============================================
// PRODUCTS.JS - Gestión de Catálogo
// ============================================

const PRODUCTS_API = {
    baseUrl: '/data/products.json',
    cache: null,
    lastFetch: null
};

// ============ CARGAR PRODUCTOS ============
async function loadProducts() {
    try {
        const response = await fetch(PRODUCTS_API.baseUrl);
        if (!response.ok) throw new Error('Error al cargar productos');
        
        const data = await response.json();
        PRODUCTS_API.cache = data;
        PRODUCTS_API.lastFetch = Date.now();
        
        return data.products || [];
    } catch (error) {
        console.error('Error loading products:', error);
        // Cargar datos de respaldo
        return getBackupProducts();
    }
}

// ============ OBTENER PRODUCTOS (con caché) ============
async function getProducts(forceRefresh = false) {
    const cacheExpired = Date.now() - PRODUCTS_API.lastFetch > 60000; // 1 minuto
    
    if (!forceRefresh && PRODUCTS_API.cache && !cacheExpired) {
        return PRODUCTS_API.cache.products;
    }
    
    return await loadProducts();
}

// ============ FILTRAR PRODUCTOS ============
function filterProducts(products, filters) {
    let filtered = [...products];
    
    // Filtrar por país
    if (filters.country) {
        filtered = filtered.filter(p => p.countryCode === filters.country);
    }
    
    // Filtrar por red
    if (filters.network) {
        filtered = filtered.filter(p => p.network === filters.network);
    }
    
    // Filtrar por tipo
    if (filters.type) {
        filtered = filtered.filter(p => p.type === filters.type);
    }
    
    // Buscar por BIN o banco
    if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
            p.bin.includes(search) || 
            p.bank.toLowerCase().includes(search) ||
            p.network.toLowerCase().includes(search)
        );
    }
    
    // Filtrar por precio
    if (filters.minPrice) {
        filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    
    // Ordenar
    if (filters.sortBy) {
        const order = filters.order || 'asc';
        filtered.sort((a, b) => {
            let valA = a[filters.sortBy];
            let valB = b[filters.sortBy];
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (order === 'asc') return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
        });
    }
    
    return filtered;
}

// ============ OBTENER PRODUCTO POR ID ============
async function getProductById(id) {
    const products = await getProducts();
    return products.find(p => p.id === id) || null;
}

// ============ OBTENER ESTADÍSTICAS ============
async function getProductStats() {
    const products = await getProducts();
    const stats = {
        total: products.length,
        totalStock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
        totalValue: products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0),
        byNetwork: {},
        byCountry: {},
        byType: {}
    };
    
    products.forEach(p => {
        // Por red
        if (!stats.byNetwork[p.network]) stats.byNetwork[p.network] = 0;
        stats.byNetwork[p.network]++;
        
        // Por país
        if (!stats.byCountry[p.countryCode]) stats.byCountry[p.countryCode] = 0;
        stats.byCountry[p.countryCode]++;
        
        // Por tipo
        if (!stats.byType[p.type]) stats.byType[p.type] = 0;
        stats.byType[p.type]++;
    });
    
    return stats;
}

// ============ ACTUALIZAR STOCK ============
async function updateProductStock(productId, quantity, operation = 'subtract') {
    const products = await getProducts(true);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast('Producto no encontrado', 'error');
        return false;
    }
    
    if (operation === 'subtract') {
        if (product.stock < quantity) {
            showToast('Stock insuficiente', 'error');
            return false;
        }
        product.stock -= quantity;
    } else {
        product.stock += quantity;
    }
    
    product.updatedAt = new Date().toISOString();
    
    // Guardar cambios (en producción: llamada a API)
    PRODUCTS_API.cache.products = products;
    showToast(`Stock actualizado: ${product.bin} → ${product.stock}`, 'success');
    
    return true;
}

// ============ DATOS DE RESPALDO ============
function getBackupProducts() {
    return [
        {
            id: 1,
            network: "VISA",
            bin: "414720",
            database: "DB_July_2026",
            class: "CREDIT",
            level: "PLATINUM",
            bank: "JPMORGAN CHASE BANK",
            country: "🇺🇸",
            countryCode: "US",
            type: "CC Full",
            uso: "Multifuncional",
            nonVbv: false,
            nonMsc: false,
            price: 28.58,
            stock: 45
        },
        {
            id: 2,
            network: "MASTERCARD",
            bin: "521894",
            database: "DB_July_2026",
            class: "CREDIT",
            level: "TITANIUM",
            bank: "CAPITAL ONE BANK",
            country: "🇺🇸",
            countryCode: "US",
            type: "Non VBV",
            uso: "Non-VBV",
            nonVbv: true,
            nonMsc: true,
            price: 48.58,
            stock: 12
        }
    ];
}

// ============ EXPORTAR ============
window.loadProducts = loadProducts;
window.getProducts = getProducts;
window.filterProducts = filterProducts;
window.getProductById = getProductById;
window.getProductStats = getProductStats;
window.updateProductStock = updateProductStock;
