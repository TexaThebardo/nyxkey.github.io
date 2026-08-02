// 💳 SISTEMA DE PAGOS - STRIPE + BITCOIN/CRIPTO

class PaymentManager {
    constructor() {
        this.paymentMethods = [
            { 
                id: 'stripe', 
                name: 'Stripe', 
                icon: 'fa-credit-card', 
                color: '#635BFF',
                description: 'Pago con tarjeta de crédito/débito'
            },
            { 
                id: 'bitcoin', 
                name: 'Bitcoin', 
                icon: 'fa-btc', 
                color: '#F7931A',
                description: 'Pago con Bitcoin (BTC)'
            },
            { 
                id: 'usdt', 
                name: 'USDT', 
                icon: 'fa-coins', 
                color: '#26A17B',
                description: 'Pago con Tether (USDT)'
            },
            { 
                id: 'ethereum', 
                name: 'Ethereum', 
                icon: 'fa-ethereum', 
                color: '#627EEA',
                description: 'Pago con Ethereum (ETH)'
            }
        ];
        
        // Precios en crypto (simulados)
        this.cryptoRates = {
            BTC: 65000,
            USDT: 1,
            ETH: 3500
        };
    }

    // Procesar pago principal
    async processPayment(method, amount, orderData) {
        try {
            switch(method) {
                case 'stripe':
                    return await this.stripePayment(amount, orderData);
                case 'bitcoin':
                    return await this.bitcoinPayment(amount, orderData);
                case 'usdt':
                    return await this.usdtPayment(amount, orderData);
                case 'ethereum':
                    return await this.ethereumPayment(amount, orderData);
                default:
                    throw new Error('Método de pago no soportado');
            }
        } catch (error) {
            console.error('Payment error:', error);
            return { success: false, error: error.message };
        }
    }

    // 💳 PAGO CON STRIPE
    async stripePayment(amount, orderData) {
        // Simular pago con Stripe
        return new Promise((resolve) => {
            // Mostrar loading
            this.showLoading('Procesando pago con Stripe...');
            
            setTimeout(() => {
                // Generar ID de transacción
                const transactionId = `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
                
                resolve({
                    success: true,
                    transactionId: transactionId,
                    method: 'stripe',
                    amount: amount,
                    currency: 'USD',
                    status: 'completed',
                    message: 'Pago procesado exitosamente con Stripe',
                    receipt_url: `https://dashboard.stripe.com/payments/${transactionId}`
                });
            }, 2000);
        });
    }

    // ₿ PAGO CON BITCOIN
    async bitcoinPayment(amount, orderData) {
        const btcAmount = (amount / this.cryptoRates.BTC).toFixed(8);
        const address = this.generateCryptoAddress('BTC');
        
        return {
            success: true,
            transactionId: `btc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            method: 'bitcoin',
            amount: amount,
            currency: 'USD',
            cryptoAmount: btcAmount,
            cryptoCurrency: 'BTC',
            address: address,
            status: 'pending',
            requiresConfirmation: true,
            confirmations: 0,
            minConfirmations: 3,
            instructions: this.getBitcoinInstructions(address, btcAmount),
            qrCode: this.generateQRCode(address, btcAmount, 'BTC')
        };
    }

    // 🪙 PAGO CON USDT
    async usdtPayment(amount, orderData) {
        const usdtAmount = (amount / this.cryptoRates.USDT).toFixed(2);
        const address = this.generateCryptoAddress('USDT');
        
        return {
            success: true,
            transactionId: `usdt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            method: 'usdt',
            amount: amount,
            currency: 'USD',
            cryptoAmount: usdtAmount,
            cryptoCurrency: 'USDT',
            network: 'TRC20',
            address: address,
            status: 'pending',
            requiresConfirmation: true,
            confirmations: 0,
            minConfirmations: 1,
            instructions: this.getUSDTInstructions(address, usdtAmount),
            qrCode: this.generateQRCode(address, usdtAmount, 'USDT')
        };
    }

    // ⚡ PAGO CON ETHEREUM
    async ethereumPayment(amount, orderData) {
        const ethAmount = (amount / this.cryptoRates.ETH).toFixed(6);
        const address = this.generateCryptoAddress('ETH');
        
        return {
            success: true,
            transactionId: `eth_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            method: 'ethereum',
            amount: amount,
            currency: 'USD',
            cryptoAmount: ethAmount,
            cryptoCurrency: 'ETH',
            address: address,
            status: 'pending',
            requiresConfirmation: true,
            confirmations: 0,
            minConfirmations: 12,
            instructions: this.getEthereumInstructions(address, ethAmount),
            qrCode: this.generateQRCode(address, ethAmount, 'ETH')
        };
    }

    // Generar dirección crypto (simulada)
    generateCryptoAddress(currency) {
        const prefixes = {
            BTC: '1',
            USDT: '0x',
            ETH: '0x'
        };
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        let address = prefixes[currency] || '';
        
        const length = currency === 'BTC' ? 34 : 42;
        for (let i = 0; i < length - address.length; i++) {
            address += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return address;
    }

    // Generar QR Code (simulado)
    generateQRCode(address, amount, currency) {
        // En producción usarías una librería como qrcode.js
        // Esto es un placeholder
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currency}:${address}?amount=${amount}`;
    }

    // Obtener instrucciones para Bitcoin
    getBitcoinInstructions(address, amount) {
        return `
            <div class="crypto-payment">
                <div class="crypto-header">
                    <i class="fab fa-bitcoin" style="color: #F7931A; font-size: 2rem;"></i>
                    <h3>Pago con Bitcoin</h3>
                </div>
                <div class="crypto-amount">
                    <p>Monto a pagar:</p>
                    <h2>${amount} BTC</h2>
                    <small>≈ $${(amount * this.cryptoRates.BTC).toFixed(2)} USD</small>
                </div>
                <div class="crypto-address-container">
                    <p>Envía exactamente a esta dirección:</p>
                    <div class="crypto-address">
                        <code>${address}</code>
                        <button onclick="copyAddress()" class="btn-copy-address">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="qr-code-container">
                        <img src="${this.generateQRCode(address, amount, 'BTC')}" alt="QR Code" class="qr-code">
                    </div>
                </div>
                <div class="crypto-warning">
                    <i class="fas fa-clock"></i>
                    <div>
                        <strong>⚠️ Importante:</strong>
                        <p>La transacción requiere 3 confirmaciones en la red Bitcoin (≈ 30-60 minutos)</p>
                        <p>No cierres esta página hasta que se complete la confirmación</p>
                    </div>
                </div>
                <div class="crypto-status" id="cryptoStatus">
                    <div class="status-item">
                        <span>Estado:</span>
                        <span class="status-pending">⏳ Esperando pago...</span>
                    </div>
                    <div class="status-item">
                        <span>Confirmaciones:</span>
                        <span id="confirmationsCount">0/3</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Obtener instrucciones para USDT
    getUSDTInstructions(address, amount) {
        return `
            <div class="crypto-payment">
                <div class="crypto-header">
                    <i class="fas fa-coins" style="color: #26A17B; font-size: 2rem;"></i>
                    <h3>Pago con USDT (TRC20)</h3>
                </div>
                <div class="crypto-amount">
                    <p>Monto a pagar:</p>
                    <h2>${amount} USDT</h2>
                    <small>≈ $${(amount * this.cryptoRates.USDT).toFixed(2)} USD</small>
                </div>
                <div class="crypto-address-container">
                    <p>Envía exactamente a esta dirección (Red TRC20):</p>
                    <div class="crypto-address">
                        <code>${address}</code>
                        <button onclick="copyAddress()" class="btn-copy-address">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="qr-code-container">
                        <img src="${this.generateQRCode(address, amount, 'USDT')}" alt="QR Code" class="qr-code">
                    </div>
                </div>
                <div class="crypto-warning">
                    <i class="fas fa-check-circle" style="color: #26A17B;"></i>
                    <div>
                        <strong>✅ Rápido y seguro:</strong>
                        <p>Usa la red TRC20 (Tron) para comisiones bajas</p>
                        <p>Confirmación rápida (≈ 1-5 minutos)</p>
                    </div>
                </div>
                <div class="crypto-status" id="cryptoStatus">
                    <div class="status-item">
                        <span>Estado:</span>
                        <span class="status-pending">⏳ Esperando pago...</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Obtener instrucciones para Ethereum
    getEthereumInstructions(address, amount) {
        return `
            <div class="crypto-payment">
                <div class="crypto-header">
                    <i class="fab fa-ethereum" style="color: #627EEA; font-size: 2rem;"></i>
                    <h3>Pago con Ethereum</h3>
                </div>
                <div class="crypto-amount">
                    <p>Monto a pagar:</p>
                    <h2>${amount} ETH</h2>
                    <small>≈ $${(amount * this.cryptoRates.ETH).toFixed(2)} USD</small>
                </div>
                <div class="crypto-address-container">
                    <p>Envía exactamente a esta dirección (ERC-20):</p>
                    <div class="crypto-address">
                        <code>${address}</code>
                        <button onclick="copyAddress()" class="btn-copy-address">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="qr-code-container">
                        <img src="${this.generateQRCode(address, amount, 'ETH')}" alt="QR Code" class="qr-code">
                    </div>
                </div>
                <div class="crypto-warning">
                    <i class="fas fa-clock"></i>
                    <div>
                        <strong>⚠️ Importante:</strong>
                        <p>Requiere 12 confirmaciones en la red Ethereum (≈ 3-5 minutos)</p>
                        <p>Asegúrate de usar la red ERC-20</p>
                    </div>
                </div>
                <div class="crypto-status" id="cryptoStatus">
                    <div class="status-item">
                        <span>Estado:</span>
                        <span class="status-pending">⏳ Esperando pago...</span>
                    </div>
                    <div class="status-item">
                        <span>Confirmaciones:</span>
                        <span id="confirmationsCount">0/12</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Simular confirmación de pago crypto
    async simulateCryptoConfirmation(transactionId, method) {
        const confirmationsNeeded = method === 'bitcoin' ? 3 : method === 'ethereum' ? 12 : 1;
        let currentConfirmations = 0;
        
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                currentConfirmations++;
                const statusEl = document.getElementById('cryptoStatus');
                const confirmEl = document.getElementById('confirmationsCount');
                
                if (statusEl) {
                    const statusSpan = statusEl.querySelector('.status-pending');
                    if (statusSpan) {
                        statusSpan.textContent = `⏳ Confirmando... (${currentConfirmations}/${confirmationsNeeded})`;
                    }
                }
                
                if (confirmEl) {
                    confirmEl.textContent = `${currentConfirmations}/${confirmationsNeeded}`;
                }
                
                if (currentConfirmations >= confirmationsNeeded) {
                    clearInterval(interval);
                    if (statusEl) {
                        const statusSpan = statusEl.querySelector('.status-pending');
                        if (statusSpan) {
                            statusSpan.textContent = '✅ Pago confirmado!';
                            statusSpan.className = 'status-confirmed';
                        }
                    }
                    resolve({
                        success: true,
                        confirmed: true,
                        confirmations: currentConfirmations
                    });
                }
            }, 3000); // Cada 3 segundos simula una confirmación
        });
    }

    // Mostrar loading
    showLoading(message) {
        const container = document.getElementById('paymentDetails');
        if (container) {
            container.innerHTML = `
                <div class="payment-loading">
                    <div class="spinner"></div>
                    <p>${message}</p>
                </div>
            `;
        }
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

    // Formatear monto en crypto
    formatCryptoAmount(amount, currency) {
        const rates = {
            BTC: 65000,
            USDT: 1,
            ETH: 3500
        };
        
        if (!rates[currency]) return amount;
        return (amount / rates[currency]).toFixed(currency === 'BTC' ? 8 : 6);
    }
}

// Instancia global
const paymentManager = new PaymentManager();

// Función para copiar dirección
window.copyAddress = function() {
    const addressEl = document.querySelector('.crypto-address code');
    if (addressEl) {
        navigator.clipboard.writeText(addressEl.textContent).then(() => {
            showNotification('✅ Dirección copiada al portapapeles', 'success');
        }).catch(() => {
            // Fallback
            const range = document.createRange();
            range.selectNode(addressEl);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            showNotification('✅ Dirección copiada al portapapeles', 'success');
        });
    }
};

// Inicializar checkout
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('checkoutContainer')) {
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

    renderCheckoutSummary(cartData);
    renderPaymentMethods(cartData.total);
}

// Renderizar resumen del checkout
function renderCheckoutSummary(cartData) {
    const summaryContainer = document.getElementById('orderSummary');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = `
        <h3>📦 Resumen del Pedido</h3>
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
                <span>$${cartData.subtotal.toFixed(2)}</span>
            </div>
            <div class="shipping">
                <span>Envío</span>
                <span>${cartData.shipping === 0 ? 'Gratis' : '$' + cartData.shipping.toFixed(2)}</span>
            </div>
            <div class="tax">
                <span>Impuesto (10%)</span>
                <span>$${cartData.tax.toFixed(2)}</span>
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
        <h3>💳 Selecciona método de pago</h3>
        <div class="payment-methods-grid">
            ${methods.map(method => `
                <div class="payment-method" data-method="${method.id}" onclick="window.selectPaymentMethod('${method.id}')">
                    <div class="payment-method-icon" style="color: ${method.color}">
                        <i class="fab ${method.icon}"></i>
                    </div>
                    <div class="payment-method-name">${method.name}</div>
                    <div class="payment-method-description">${method.description}</div>
                </div>
            `).join('')}
        </div>
        <div id="paymentDetails"></div>
        <button id="processPaymentBtn" class="btn-pay" onclick="window.processCheckout()">
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
    
    // Mostrar detalles del método
    const detailsContainer = document.getElementById('paymentDetails');
    if (detailsContainer && methodId === 'stripe') {
        detailsContainer.innerHTML = `
            <div class="stripe-form">
                <div class="form-group">
                    <label>Número de tarjeta</label>
                    <div class="card-input">
                        <i class="fas fa-credit-card"></i>
                        <input type="text" placeholder="4242 4242 4242 4242" class="card-number-input">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha expiración</label>
                        <input type="text" placeholder="MM/YY" class="card-expiry-input">
                    </div>
                    <div class="form-group">
                        <label>CVC</label>
                        <input type="text" placeholder="123" class="card-cvc-input">
                    </div>
                </div>
                <div class="form-group">
                    <label>Nombre del titular</label>
                    <input type="text" placeholder="Juan Pérez" class="card-name-input">
                </div>
                <div class="stripe-badge">
                    <i class="fas fa-lock"></i>
                    Pago seguro con Stripe
                </div>
            </div>
        `;
    } else if (detailsContainer && methodId !== 'stripe') {
        // Para crypto, mostrar detalles después de procesar
        detailsContainer.innerHTML = `
            <div class="crypto-info">
                <p>Preparando pago con ${paymentManager.paymentMethods.find(m => m.id === methodId)?.name}...</p>
                <div class="spinner"></div>
            </div>
        `;
    }
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

    // Deshabilitar botón
    const btn = document.getElementById('processPaymentBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Procesando...';

    try {
        // Si es crypto, mostrar instrucciones primero
        if (selectedPaymentMethod !== 'stripe') {
            const cryptoResult = await paymentManager.processPayment(
                selectedPaymentMethod,
                cartData.total,
                { user, items: cartData.items }
            );
            
            if (cryptoResult.success) {
                // Mostrar instrucciones de pago crypto
                const detailsContainer = document.getElementById('paymentDetails');
                if (detailsContainer) {
                    detailsContainer.innerHTML = cryptoResult.instructions;
                }
                
                // Iniciar simulación de confirmación
                paymentManager.simulateCryptoConfirmation(
                    cryptoResult.transactionId,
                    selectedPaymentMethod
                ).then((confirmation) => {
                    if (confirmation.success) {
                        // Guardar orden
                        saveOrder(cryptoResult, cartData);
                        cartManager.clearCart();
                        showPaymentSuccess(cryptoResult);
                    }
                });
                
                btn.textContent = '⏳ Esperando confirmación...';
                btn.disabled = true;
                return;
            }
        } else {
            // Pago con Stripe
            const result = await paymentManager.processPayment(
                'stripe',
                cartData.total,
                { user, items: cartData.items }
            );
            
            if (result.success) {
                saveOrder(result, cartData);
                cartManager.clearCart();
                showPaymentSuccess(result);
            }
        }
    } catch (error) {
        showNotification(`❌ Error: ${error.message}`, 'error');
        btn.disabled = false;
        btn.textContent = `Pagar $${cartData.total.toFixed(2)}`;
    }
};

// Guardar orden
function saveOrder(paymentResult, cartData) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const order = {
        id: paymentResult.transactionId || `ORD_${Date.now()}`,
        date: new Date().toISOString(),
        user: authManager.getCurrentUser(),
        items: cartData.items,
        subtotal: cartData.subtotal,
        shipping: cartData.shipping,
        tax: cartData.tax,
        total: cartData.total,
        payment: {
            method: paymentResult.method,
            amount: paymentResult.amount,
            currency: paymentResult.currency || 'USD',
            status: paymentResult.status || 'completed',
            transactionId: paymentResult.transactionId
        },
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
                <p><strong>Monto:</strong> $${result.amount.toFixed(2)}</p>
                <p><strong>Estado:</strong> ${result.status === 'completed' ? '✅ Completado' : '⏳ Pendiente'}</p>
            </div>
            <a href="index.html" class="btn-primary">Volver al Inicio</a>
        </div>
    `;
}

// Exportar
window.paymentManager = paymentManager;
