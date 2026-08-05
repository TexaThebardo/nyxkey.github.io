// ============================================
// PRODUCTS.JS - Gestión de Productos
// ============================================

console.log('🃏 Products.js cargado');

let allProducts = [];
let filteredProducts = [];

function loadProductsFromJSON() {
    // ============ CATÁLOGO ACTUALIZADO CON MÁS TARJETAS ============
    allProducts = [
        // ===== VISA =====
        { 
            id: 1, 
            network: "VISA", 
            bin: "414720", 
            database: "DB_August_2026", 
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
            stock: 45, 
            active: true,
            cardData: { number: "414720******1234", expiry: "08/27", cvv: "***" },
            rating: 4.8,
            sales: 156
        },
        { 
            id: 2, 
            network: "VISA", 
            bin: "471612", 
            database: "DB_August_2026", 
            class: "DEBIT", 
            level: "SIGNATURE", 
            bank: "BANK OF AMERICA", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "CC Full", 
            uso: "Multifuncional", 
            nonVbv: false, 
            nonMsc: false, 
            price: 27.90, 
            stock: 23, 
            active: true,
            cardData: { number: "471612******9012", expiry: "03/27", cvv: "***" },
            rating: 4.7,
            sales: 89
        },
        { 
            id: 3, 
            network: "VISA", 
            bin: "469566", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "PURCHASING", 
            bank: "BANCO POPULAR DOMINICANO", 
            country: "🇩🇴", 
            countryCode: "DO", 
            type: "Non VBV", 
            uso: "Non-VBV", 
            nonVbv: true, 
            nonMsc: true, 
            price: 36.29, 
            stock: 15, 
            active: true,
            cardData: { number: "469566******7890", expiry: "09/26", cvv: "***" },
            rating: 4.9,
            sales: 210
        },
        { 
            id: 4, 
            network: "VISA", 
            bin: "438857", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "PREMIER", 
            bank: "WELLS FARGO BANK", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "CC Full", 
            uso: "Wells Fargo", 
            nonVbv: false, 
            nonMsc: false, 
            price: 29.50, 
            stock: 18, 
            active: true,
            cardData: { number: "438857******8765", expiry: "02/27", cvv: "***" },
            rating: 4.6,
            sales: 67
        },
        { 
            id: 5, 
            network: "VISA", 
            bin: "481523", 
            database: "DB_August_2026", 
            class: "DEBIT", 
            level: "CLASSIC", 
            bank: "BANCO SANTA CRUZ", 
            country: "🇩🇴", 
            countryCode: "DO", 
            type: "Non VBV", 
            uso: "Non-VBV", 
            nonVbv: true, 
            nonMsc: true, 
            price: 48.58, 
            stock: 5, 
            active: true,
            cardData: { number: "481523******3456", expiry: "11/27", cvv: "***" },
            rating: 4.5,
            sales: 34
        },
        { 
            id: 6, 
            network: "VISA", 
            bin: "450004", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "BUSINESS", 
            bank: "CANADIAN IMPERIAL BANK", 
            country: "🇨🇦", 
            countryCode: "CA", 
            type: "CC Full", 
            uso: "Multifuncional", 
            nonVbv: false, 
            nonMsc: false, 
            price: 29.18, 
            stock: 20, 
            active: true,
            cardData: { number: "450004******5678", expiry: "06/28", cvv: "***" },
            rating: 4.8,
            sales: 123
        },
        { 
            id: 7, 
            network: "VISA", 
            bin: "412800", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "PLATINUM", 
            bank: "PNC BANK, N.A.", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "Non VBV", 
            uso: "Non-VBV", 
            nonVbv: true, 
            nonMsc: true, 
            price: 36.29, 
            stock: 12, 
            active: true,
            cardData: { number: "412800******7890", expiry: "04/28", cvv: "***" },
            rating: 4.7,
            sales: 78
        },
        { 
            id: 8, 
            network: "VISA", 
            bin: "440066", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "CORPORATE", 
            bank: "U.S. BANK NATIONAL ASSOC", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "Non VBV", 
            uso: "Non-VBV", 
            nonVbv: true, 
            nonMsc: true, 
            price: 48.58, 
            stock: 8, 
            active: true,
            cardData: { number: "440066******9012", expiry: "09/27", cvv: "***" },
            rating: 4.9,
            sales: 95
        },

        // ===== MASTERCARD =====
        { 
            id: 9, 
            network: "MASTERCARD", 
            bin: "521894", 
            database: "DB_August_2026", 
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
            stock: 12, 
            active: true,
            cardData: { number: "521894******5678", expiry: "08/27", cvv: "***" },
            rating: 4.6,
            sales: 145
        },
        { 
            id: 10, 
            network: "MASTERCARD", 
            bin: "546871", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "WORLD", 
            bank: "BANCOMER, S.A.", 
            country: "🇲🇽", 
            countryCode: "MX", 
            type: "CC Full", 
            uso: "Multifuncional", 
            nonVbv: false, 
            nonMsc: false, 
            price: 28.66, 
            stock: 30, 
            active: true,
            cardData: { number: "546871******4321", expiry: "11/26", cvv: "***" },
            rating: 4.5,
            sales: 234
        },
        { 
            id: 11, 
            network: "MASTERCARD", 
            bin: "516329", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "MIXED", 
            bank: "WESTPAC BANKING CORP", 
            country: "🇦🇺", 
            countryCode: "AU", 
            type: "Non VBV", 
            uso: "Non-VBV", 
            nonVbv: true, 
            nonMsc: true, 
            price: 32.00, 
            stock: 10, 
            active: true,
            cardData: { number: "516329******6543", expiry: "07/27", cvv: "***" },
            rating: 4.8,
            sales: 56
        },
        { 
            id: 12, 
            network: "MASTERCARD", 
            bin: "552190", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "GOLD", 
            bank: "CITIBANK N.A.", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "Non VBV", 
            uso: "Non-VBV", 
            nonVbv: true, 
            nonMsc: true, 
            price: 51.29, 
            stock: 7, 
            active: true,
            cardData: { number: "552190******8765", expiry: "05/28", cvv: "***" },
            rating: 4.9,
            sales: 67
        },
        { 
            id: 13, 
            network: "MASTERCARD", 
            bin: "535311", 
            database: "DB_August_2026", 
            class: "DEBIT", 
            level: "PLATINUM", 
            bank: "HUNTINGTON NATIONAL BANK", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "CC Full", 
            uso: "Multifuncional", 
            nonVbv: false, 
            nonMsc: false, 
            price: 28.40, 
            stock: 22, 
            active: true,
            cardData: { number: "535311******0987", expiry: "10/27", cvv: "***" },
            rating: 4.4,
            sales: 43
        },
        { 
            id: 14, 
            network: "MASTERCARD", 
            bin: "528940", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "WORLD ELITE", 
            bank: "TD BANK N.A.", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "Non VBV", 
            uso: "Non-VBV", 
            nonVbv: true, 
            nonMsc: true, 
            price: 51.29, 
            stock: 6, 
            active: true,
            cardData: { number: "528940******2345", expiry: "12/28", cvv: "***" },
            rating: 4.9,
            sales: 89
        },
        { 
            id: 15, 
            network: "MASTERCARD", 
            bin: "542418", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "BUSINESS", 
            bank: "TRUIST BANK", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "Non VBV", 
            uso: "Non-VBV", 
            nonVbv: true, 
            nonMsc: true, 
            price: 32.00, 
            stock: 14, 
            active: true,
            cardData: { number: "542418******6789", expiry: "03/28", cvv: "***" },
            rating: 4.6,
            sales: 112
        },

        // ===== AMEX =====
        { 
            id: 16, 
            network: "AMEX", 
            bin: "371449", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "CENTURION", 
            bank: "AMERICAN EXPRESS", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "Non VBV", 
            uso: "Non-VBV", 
            nonVbv: true, 
            nonMsc: true, 
            price: 51.29, 
            stock: 8, 
            active: true,
            cardData: { number: "371449******3456", expiry: "05/27", cvv: "***" },
            rating: 5.0,
            sales: 203
        },
        { 
            id: 17, 
            network: "AMEX", 
            bin: "340011", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "PLATINUM", 
            bank: "AMERICAN EXPRESS", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "Non VBV", 
            uso: "Non-VBV", 
            nonVbv: true, 
            nonMsc: true, 
            price: 48.58, 
            stock: 9, 
            active: true,
            cardData: { number: "340011******7890", expiry: "07/28", cvv: "***" },
            rating: 4.8,
            sales: 156
        },
        { 
            id: 18, 
            network: "AMEX", 
            bin: "351025", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "SIGNATURE", 
            bank: "BANK OF AMERICA", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "Non VBV", 
            uso: "Multifuncional", 
            nonVbv: true, 
            nonMsc: false, 
            price: 34.29, 
            stock: 16, 
            active: true,
            cardData: { number: "351025******1234", expiry: "09/27", cvv: "***" },
            rating: 4.7,
            sales: 78
        },

        // ===== DISCOVER =====
        { 
            id: 19, 
            network: "DISCOVER", 
            bin: "601100", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "GOLD", 
            bank: "DISCOVER BANK", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "CC Full", 
            uso: "Multifuncional", 
            nonVbv: false, 
            nonMsc: false, 
            price: 26.80, 
            stock: 35, 
            active: true,
            cardData: { number: "601100******5678", expiry: "10/27", cvv: "***" },
            rating: 4.3,
            sales: 98
        },

        // ===== TARJETAS CON SERVICIOS ESPECIALES =====
        { 
            id: 20, 
            network: "VISA", 
            bin: "660711", 
            database: "DB_August_2026", 
            class: "DEBIT", 
            level: "STANDARD", 
            bank: "BANCO DE BOGOTA", 
            country: "🇨🇴", 
            countryCode: "CO", 
            type: "CC Full", 
            uso: "Servicios de Streaming", 
            nonVbv: false, 
            nonMsc: false, 
            price: 28.72, 
            stock: 25, 
            active: true,
            cardData: { number: "660711******2345", expiry: "06/28", cvv: "***" },
            rating: 4.6,
            sales: 145
        },
        { 
            id: 21, 
            network: "MASTERCARD", 
            bin: "633041", 
            database: "DB_August_2026", 
            class: "DEBIT", 
            level: "WORLD", 
            bank: "AMERICAN EXPRESS", 
            country: "🇩🇴", 
            countryCode: "DO", 
            type: "CC Full", 
            uso: "Multifuncional", 
            nonVbv: false, 
            nonMsc: false, 
            price: 29.50, 
            stock: 18, 
            active: true,
            cardData: { number: "633041******7890", expiry: "01/28", cvv: "***" },
            rating: 4.5,
            sales: 67
        },
        { 
            id: 22, 
            network: "VISA", 
            bin: "527848", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "SIGNATURE", 
            bank: "CAPITAL ONE BANK", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "Non VBV", 
            uso: "Coinbase", 
            nonVbv: true, 
            nonMsc: true, 
            price: 37.29, 
            stock: 11, 
            active: true,
            cardData: { number: "527848******4567", expiry: "08/28", cvv: "***" },
            rating: 4.9,
            sales: 234
        },
        { 
            id: 23, 
            network: "MASTERCARD", 
            bin: "379119", 
            database: "DB_August_2026", 
            class: "DEBIT", 
            level: "WORLD", 
            bank: "BANK OF AMERICA", 
            country: "🇺🇸", 
            countryCode: "US", 
            type: "Non VBV", 
            uso: "Amazon", 
            nonVbv: true, 
            nonMsc: false, 
            price: 44.29, 
            stock: 6, 
            active: true,
            cardData: { number: "379119******8901", expiry: "11/28", cvv: "***" },
            rating: 4.8,
            sales: 89
        },
        { 
            id: 24, 
            network: "VISA", 
            bin: "694357", 
            database: "DB_August_2026", 
            class: "CREDIT", 
            level: "TITANIUM", 
            bank: "AMERICAN EXPRESS", 
            country: "🇩🇴", 
            countryCode: "DO", 
            type: "Non VBV", 
            uso: "Paypal", 
            nonVbv: true, 
            nonMsc: true, 
            price: 45.29, 
            stock: 7, 
            active: true,
            cardData: { number: "694357******0123", expiry: "02/29", cvv: "***" },
            rating: 4.9,
            sales: 167
        },
        { 
            id: 25, 
            network: "VISA", 
            bin: "475646", 
            database: "DB_August_2026", 
            class: "DEBIT", 
            level: "CENTURION", 
            bank: "WELLS FARGO BANK", 
            country: "🇲🇽", 
            countryCode: "MX", 
            type: "Non VBV", 
            uso: "Binance", 
            nonVbv: true, 
            nonMsc: true, 
            price: 48.29, 
            stock: 5, 
            active: true,
            cardData: { number: "475646******2345", expiry: "04/29", cvv: "***" },
            rating: 5.0,
            sales: 78
        }
    ];
    filteredProducts = [...allProducts];
    console.log(`✅ ${allProducts.length} tarjetas cargadas`);
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
    return {
        total: allProducts.length,
        totalStock: allProducts.reduce((sum, p) => sum + (p.stock || 0), 0),
        totalValue: allProducts.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0),
        byNetwork: allProducts.reduce((acc, p) => {
            acc[p.network] = (acc[p.network] || 0) + 1;
            return acc;
        }, {}),
        byCountry: allProducts.reduce((acc, p) => {
            acc[p.countryCode] = (acc[p.countryCode] || 0) + 1;
            return acc;
        }, {})
    };
}

function filterProducts(filters) {
    let filtered = [...allProducts];
    
    if (filters.country) {
        filtered = filtered.filter(p => p.countryCode === filters.country);
    }
    
    if (filters.search) {
        const s = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
            p.bin.includes(s) || 
            p.bank.toLowerCase().includes(s) || 
            p.network.toLowerCase().includes(s) ||
            p.uso.toLowerCase().includes(s)
        );
    }
    
    if (filters.network) {
        filtered = filtered.filter(p => p.network === filters.network);
    }
    
    if (filters.minPrice) {
        filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.type) {
        filtered = filtered.filter(p => p.type === filters.type);
    }
    
    return filtered;
}

function getFeaturedProducts(limit = 6) {
    return [...allProducts]
        .filter(p => p.active !== false)
        .sort((a, b) => (b.sales || 0) - (a.sales || 0))
        .slice(0, limit);
}

function getTopRatedProducts(limit = 6) {
    return [...allProducts]
        .filter(p => p.active !== false)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);
}

function getProductsByNetwork(network) {
    return allProducts.filter(p => p.network === network && p.active !== false);
}

// ============ EXPORTAR ============
window.loadProductsFromJSON = loadProductsFromJSON;
window.getProducts = getProducts;
window.getProductByIndex = getProductByIndex;
window.getProductById = getProductById;
window.getProductStats = getProductStats;
window.filterProducts = filterProducts;
window.getFeaturedProducts = getFeaturedProducts;
window.getTopRatedProducts = getTopRatedProducts;
window.getProductsByNetwork = getProductsByNetwork;

console.log('✅ Products.js cargado correctamente');
