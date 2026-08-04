// ============================================
// API.JS - Simulación de API
// ============================================

class ApiService {
    constructor() {
        this.isOnline = true;
    }

    async checkConnection() {
        this.isOnline = true;
        return true;
    }

    async fetchProducts() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data: getProducts(), timestamp: new Date().toISOString() });
            }, 300);
        });
    }

    async checkCards(cards) {
        return new Promise((resolve) => {
            const results = cards.map(card => {
                const isValid = Math.random() > 0.2;
                return { 
                    card, 
                    status: isValid ? 'approved' : 'declined', 
                    balance: isValid ? Math.floor(Math.random() * 1000) * 100 : 0 
                };
            });
            setTimeout(() => resolve({ success: true, results, processed: results.length }), 800);
        });
    }

    async processPayment(orderData) {
        return new Promise((resolve) => {
            const success = Math.random() > 0.1;
            setTimeout(() => {
                if (success) {
                    resolve({ success: true, orderId: 'ORD-' + Date.now(), amount: orderData.total, status: 'completed' });
                } else {
                    resolve({ success: false, error: 'Pago rechazado' });
                }
            }, 1500);
        });
    }

    async startOTPBot(target, phone, service) {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true, sessionId: 'session-' + Date.now(), status: 'connected' }), 1000);
        });
    }

    async getTransactionHistory(userId, limit = 10) {
        return new Promise((resolve) => {
            const transactions = Array.from({ length: limit }, (_, i) => ({
                id: 'TX-' + Date.now() + '-' + i,
                type: ['compra', 'depósito', 'verificación'][Math.floor(Math.random() * 3)],
                amount: (Math.random() * 100).toFixed(2),
                status: ['completado', 'pendiente', 'fallido'][Math.floor(Math.random() * 3)],
                date: new Date(Date.now() - i * 86400000).toISOString()
            }));
            setTimeout(() => resolve({ success: true, transactions }), 500);
        });
    }
}

const API = new ApiService();
window.API = API;
