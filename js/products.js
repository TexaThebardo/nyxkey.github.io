// ============================================
// PRODUCTS.JS - Gestión de Productos
// ============================================

let allProducts = [];
let filteredProducts = [];

function loadProductsFromJSON() {
    // Datos de ejemplo integrados
    allProducts = [
        { id: 1, network: "VISA", bin: "414720", database: "DB_July_2026", class: "CREDIT", level: "PLATINUM", bank: "JPMORGAN CHASE BANK", country: "🇺🇸", countryCode: "US", type: "CC Full", uso: "Multifuncional", nonVbv: false, nonMsc: false, price: 28.58, stock: 45, active: true },
        { id: 2, network: "MASTERCARD", bin: "521894", database: "DB_July_2026", class: "CREDIT", level: "TITANIUM", bank: "CAPITAL ONE BANK", country: "🇺🇸", countryCode: "US", type: "Non VBV", uso: "Non-VBV", nonVbv: true, nonMsc: true, price: 48.58, stock: 12, active: true },
        { id: 3, network: "VISA", bin: "471612", database: "DB_July_2026", class: "DEBIT", level: "SIGNATURE", bank: "BANK OF AMERICA", country: "🇺🇸", countryCode: "US", type: "CC Full", uso: "Multifuncional", nonVbv: false, nonMsc: false, price: 27.90, stock: 23, active: true },
        { id: 4, network: "AMEX", bin: "371449", database: "DB_July_2026", class: "CREDIT", level: "CENTURION", bank: "AMERICAN EXPRESS", country: "🇺🇸", countryCode: "US", type: "Non VBV", uso: "Non-VBV", nonVbv: true, nonMsc: true, price: 51.29, stock: 8, active: true },
        { id: 5, network: "VISA", bin: "469566", database: "DB_July_2026", class: "CREDIT", level: "PURCHASING", bank: "BANCO POPULAR DOMINICANO", country: "🇩🇴", countryCode: "DO", type: "Non VBV", uso: "Non-VBV", nonVbv: true, nonMsc: true, price: 36.29, stock: 15, active: true },
        { id: 6, network: "MASTERCARD", bin: "546871", database: "DB_July_2026", class: "CREDIT", level: "WORLD", bank: "BANCOMER, S.A.", country: "🇲🇽", countryCode: "MX", type: "CC Full", uso: "Multifuncional", nonVbv: false, nonMsc: false, price: 28.66, stock: 30, active: true },
        { id: 7, network: "VISA", bin: "438857", database: "DB_July_2026", class: "CREDIT", level: "PREMIER", bank: "WELLS FARGO BANK", country: "🇺🇸", countryCode: "US", type: "CC Full", uso: "Wells Fargo", nonVbv: false, nonMsc: false, price: 29.50, stock: 18, active: true },
        { id: 8, network: "MASTERCARD", bin: "516329", database: "DB_July_2026", class: "CREDIT", level: "MIXED", bank: "WESTPAC BANKING CORP", country: "🇦🇺", countryCode: "AU", type: "Non VBV", uso: "Non-VBV", nonVbv: true, nonMsc: true, price: 32.00, stock: 10, active: true },
        { id: 9, network: "VISA", bin: "481523", database: "DB_July_2026", class: "DEBIT", level: "CLASSIC", bank: "BANCO SANTA CRUZ", country: "🇩🇴", countryCode: "DO", type: "Non VBV", uso: "Non-VBV", nonVbv: true, nonMsc: true, price: 48.58, stock: 5, active: true },
        { id: 10, network: "DISCOVER", bin: "601100", database: "DB_July_2026", class: "CREDIT", level: "GOLD", bank: "DISCOVER BANK", country: "🇺🇸", countryCode: "US", type: "CC Full", uso: "Multifuncional", nonVbv: false, nonMsc: false, price: 26.80, stock: 35, active: true }
    ];
    filteredProducts = [...allProducts];
}

function getProducts() {
    return filteredProducts;
}

function getProductByIndex(index) {
    const products = getProducts();
    return products[index] || null;
}

function getProductById(id) {
    return allProducts.find(p => p.id === id) || null;
}

function getProductStats() {
    const stats = {
        total: allProducts.length,
        totalStock: allProducts.reduce((sum, p) => sum + (p.stock || 0), 0),
        totalValue: allProducts.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0)
    };
    return stats;
}

function filterProducts(filters) {
    let filtered = [...allProducts];
    if (filters.country) filtered = filtered.filter(p => p.countryCode === filters.country);
    if (filters.search) {
        const s = filters.search.toLowerCase();
        filtered = filtered.filter(p => p.bin.includes(s) || p.bank.toLowerCase().includes(s) || p.network.toLowerCase().includes(s));
    }
    if (filters.status === 'active') filtered = filtered.filter(p => p.active !== false);
    if (filters.status === 'low') filtered = filtered.filter(p => p.stock < 10);
    return filtered;
}

function updateProductStock(productId, quantity, operation = 'subtract') {
    const product = allProducts.find(p => p.id === productId);
    if (!product) { showToast('Producto no encontrado', 'error'); return false; }
    if (operation === 'subtract') {
        if (product.stock < quantity) { showToast('Stock insuficiente', 'error'); return false; }
        product.stock -= quantity;
    } else {
        product.stock += quantity;
    }
    showToast(`Stock actualizado: ${product.bin} → ${product.stock}`, 'success');
    return true;
}

window.loadProductsFromJSON = loadProductsFromJSON;
window.getProducts = getProducts;
window.getProductByIndex = getProductByIndex;
window.getProductById = getProductById;
window.getProductStats = getProductStats;
window.filterProducts = filterProducts;
window.updateProductStock = updateProductStock;
