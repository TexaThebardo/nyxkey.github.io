// 💳 SISTEMA DE PAGOS
class PaymentManager {
    constructor() {
        this.paymentMethods = [
            { id: 'stripe', name: 'Stripe', icon: 'fa-credit-card', color: '#635BFF' },
            { id: 'paypal', name: 'PayPal', icon: 'fa-paypal', color: '#0070BA' },
            { id: 'crypto', name: 'Criptomonedas', icon: 'fa-bitcoin', color: '#F7931A' },
            { id: 'mercadopago', name: 'MercadoPago', icon: 'fa-money-bill', color: '#009EE3' }
        ];
    }

    // Procesar pago
    async processPayment(method, amount, orderData) {
        try {
            switch(method) {
                case 'stripe':
                    return await this.stripePayment(amount, orderData);
                case 'paypal':
                    return await this.paypalPayment(amount, orderData);
                case 'crypto':
                    return await this.cryptoPayment(amount, orderData);
                case 'mercadopago':
                    return await this.mercadopagoPayment(amount, orderData);
                default:
                    throw new Error('Método de pago no soportado');
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Pago con Stripe
    async stripePayment(amount, orderData) {
        // Simular pago con Stripe
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: `stripe_${Date.now()}`,
                    method: 'stripe',
                    amount: amount,
                    status: 'completed'
                });
            }, 1500);
        });
    }

    // Pago con PayPal
    async paypalPayment(amount, orderData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: `paypal_${Date.now()}`,
                    method: 'paypal',
                    amount: amount,
                    status: 'completed'
                });
            }, 1500);
        });
    }

    // Pago con Criptomonedas
    async cryptoPayment(amount, orderData) {
        // Generar dirección de pago
        const cryptoAddress = this.generateCryptoAddress();
        
        return {
            success: true,
            transactionId: `crypto_${Date.now()}`,
            method: 'crypto',
            amount: amount,
            address: cryptoAddress,
            status: 'pending',
            instructions: `
                <div class="crypto-payment">
                    <h4>Pago con Criptomonedas</h4>
                    <p>Envía exactamente <strong>${amount} USDT</strong> a la siguiente dirección:</p>
                    <div class="crypto-address">
                        <code>${cryptoAddress}</code>
                        <button onclick="copyAddress()" class="btn-copy">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <p class="crypto-warning">
                        <i class="fas fa-clock"></i>
                        La confirmación puede tomar 5-10 minutos
                    </p>
                </div>
            `
        };
    }

    // Pago con MercadoPago
    async mercadopagoPayment(amount, orderData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: `mp_${Date.now()}`,
                    method: 'mercadopago',
                    amount: amount,
                    status: 'completed',
                    qrCode: 'https://api.mercadopago.com/qr/...'
                });
            }, 1500);
        });
    }

    // Generar dirección crypto (simulada)
    generateCryptoAddress() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let address = '0x';
        for (let i = 0; i < 40; i++) {
            address += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return address;
    }

    // Obtener métodos de pago disponibles
    getPaymentMethods() {
        return this.paymentMethods;
    }

    // Validar pago
    validatePayment(data) {
        if (!data.method) return { valid: false, error: 'Método de pago requerido' };
        if (!data.amount || data.amount <= 0) return { valid: false, error: 'Monto inválido' };
        return { valid: true };
    }
}

// Instancia global
const paymentManager = new PaymentManager();

// Inicializar checkout
document.addEventListener('DOMContentLoaded', () => {
    const checkoutContainer = document.getElementById('checkoutContainer');
    if (checkoutContainer) {
        initCheckout();
    }
});

// Inicializar checkout
function initCheckout() {
    const cartData = cartManager.getCheckoutData();
    
    if (cartData.items.length === 0) {
        document.getElementById('checkoutContainer').innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <h3>No hay productos en el carrito</h3>
                <a href="shop.html" class="btn-primary">Ir a la tienda</a>
            </div>
        `;
        return;
    }

    // Renderizar resumen
    renderCheckoutSummary(cartData);
    
    // Renderizar métodos de pago
    renderPaymentMethods(cartData.total);
}

// Renderizar resumen del checkout
function renderCheckoutSummary(cartData) {
    const summaryContainer = document.getElementById('orderSummary');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = `
        <div class="order-items">
            ${cartData.items.map(item => `
                <div class="order-item">
                    <div class="order-item-info">
                        <span class="order-item-name">${item.name}</span>
                        <span class="order-item-qty">x${item.quantity}</span>
                    </div>
                    <span class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        <div class="order-total">
            <div class="subtotal">
                <span>Subtotal</span>
                <span>$${cartData.total.toFixed(2)}</span>
            </div>
            <div class="shipping">
                <span>Envío</span>
                <span>Gratis</span>
            </div>
            <div class="total">
                <span><strong>Total</strong></span>
                <span><strong>$${cartData.total.toFixed(2)}</strong></span>
            </div>
        </div>
    `;
}

// Renderizar métodos de pago
function renderPaymentMethods(total) {
    const container = document.getElementById('paymentMethods');
    if (!container) return;

    const methods = paymentManager.getPaymentMethods();
    
    container.innerHTML = `
        <div class="payment-methods-grid">
            ${methods.map(method => `
                <div class="payment-method" data-method="${method.id}" onclick="selectPaymentMethod('${method.id}')">
                    <div class="payment-method-icon" style="color: ${method.color}">
                        <i class="fab ${method.icon}"></i>
                    </div>
                    <div class="payment-method-name">${method.name}</div>
                </div>
            `).join('')}
        </div>
        <div id="paymentDetails"></div>
        <button id="processPaymentBtn" class="btn-pay" onclick="processCheckout()">
            Pagar $${total.toFixed(2)}
        </button>
    `;
}

// Seleccionar método de pago
let selectedPaymentMethod = null;

window.selectPaymentMethod = function(methodId) {
    selectedPaymentMethod = methodId;
    
    // Actualizar UI
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
        if (el.dataset.method === methodId) {
            el.classList.add('selected');
        }
    });
};

// Procesar checkout
window.processCheckout = async function() {
    if (!selectedPaymentMethod) {
        showNotification('❌ Selecciona un método de pago', 'error');
        return;
    }

    const cartData = cartManager.getCheckoutData();
    const user = authManager.getCurrentUser();

    if (!user) {
        showNotification('❌ Inicia sesión para continuar', 'error');
        window.location.href = 'login.html';
        return;
    }

    // Mostrar loading
    document.getElementById('processPaymentBtn').disabled = true;
    document.getElementById('processPaymentBtn').textContent = '⏳ Procesando...';

    try {
        const result = await paymentManager.processPayment(
            selectedPaymentMethod,
            cartData.total,
            {
                user: user,
                items: cartData.items
            }
        );

        if (result.success) {
            // Guardar orden
            saveOrder(result, cartData);
            
            // Vaciar carrito
            cartManager.clearCart();
            
            // Mostrar éxito
            showPaymentSuccess(result);
        } else {
            showNotification(`❌ Error: ${result.error}`, 'error');
        }
    } catch (error) {
        showNotification(`❌ Error: ${error.message}`, 'error');
    } finally {
        document.getElementById('processPaymentBtn').disabled = false;
        document.getElementById('processPaymentBtn').textContent = `Pagar $${cartData.total.toFixed(2)}`;
    }
};

// Guardar orden
function saveOrder(paymentResult, cartData) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const order = {
        id: `ORD_${Date.now()}`,
        date: new Date().toISOString(),
        user: authManager.getCurrentUser(),
        items: cartData.items,
        total: cartData.total,
        payment: paymentResult,
        status: 'completed'
    };
    
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Mostrar éxito del pago
function showPaymentSuccess(result) {
    const container = document.getElementById('checkoutContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="payment-success">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>¡Pago Exitoso!</h2>
            <p>Tu orden ha sido procesada correctamente</p>
            <div class="order-details">
                <p><strong>ID de Transacción:</strong> ${result.transactionId}</p>
                <p><strong>Método:</strong> ${result.method}</p>
                <p><strong>Monto:</strong> $${result.amount}</p>
            </div>
            <a href="index.html" class="btn-primary">Volver al Inicio</a>
        </div>
    `;
}
