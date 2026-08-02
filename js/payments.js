// 💳 SISTEMA DE PAGOS - SOLO BITCOIN Y STRIPE

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
            }
        ];
        
        this.cryptoRates = {
            BTC: 65000
        };
    }

    getPaymentMethods() {
        return this.paymentMethods;
    }

    // Procesar pago
    async processPayment(method, amount, orderData) {
        try {
            switch(method) {
                case 'stripe':
                    return await this.stripePayment(amount, orderData);
                case 'bitcoin':
                    return await this.bitcoinPayment(amount, orderData);
                default:
                    throw new Error('Método de pago no soportado');
            }
        } catch (error) {
            console.error('Payment error:', error);
            return { success: false, error: error.message };
        }
    }

    // STRIPE
    async stripePayment(amount, orderData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // DESCONTAR DINERO (simular)
                this.deductBalance(amount, orderData.user);
                
                resolve({
                    success: true,
                    transactionId: `stripe_${Date.now()}`,
                    method: 'stripe',
                    amount: amount,
                    currency: 'USD',
                    status: 'completed',
                    message: 'Pago procesado exitosamente con Stripe',
                    paymentLink: `https://buy.stripe.com/test_${Date.now()}`
                });
            }, 1500);
        });
    }

    // BITCOIN
    async bitcoinPayment(amount, orderData) {
        const btcAmount = (amount / this.cryptoRates.BTC).toFixed(8);
        const address = this.generateCryptoAddress('BTC');
        
        const bitcoinLink = `bitcoin:${address}?amount=${btcAmount}&label=CardNMR%20Store`;
        
        return {
            success: true,
            transactionId: `btc_${Date.now()}`,
            method: 'bitcoin',
            amount: amount,
            currency: 'USD',
            cryptoAmount: btcAmount,
            cryptoCurrency: 'BTC',
            address: address,
            status: 'pending',
            requiresConfirmation: true,
            qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(bitcoinLink)}`,
            paymentLink: bitcoinLink,
            instructions: this.getBitcoinInstructions(address, btcAmount, bitcoinLink)
        };
    }

    // Generar dirección
    generateCryptoAddress(currency) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        let address = '1';
        for (let i = 0; i < 33; i++) {
            address += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return address;
    }

    // Instrucciones Bitcoin
    getBitcoinInstructions(address, amount, link) {
        return `
            <div class="crypto-payment">
                <div class="crypto-header">
                    <i class="fab fa-bitcoin" style="color: #F7931A; font-size: 2.5rem;"></i>
                    <div>
                        <h3 style="color: white; margin: 0;">Pago con Bitcoin</h3>
                        <p style="color: #a0aec0; margin: 0;">Envía la cantidad exacta a la dirección</p>
                    </div>
                </div>

                <div class="crypto-amount-box">
                    <div class="crypto-amount">
                        <span class="crypto-amount-label">Monto a pagar</span>
                        <span class="crypto-amount-value">${amount} BTC</span>
                        <span class="crypto-amount-usd">≈ $${(amount * this.cryptoRates.BTC).toFixed(2)} USD</span>
                    </div>
                </div>

                <div class="crypto-address-box">
                    <p class="crypto-address-label">📤 Dirección de destino</p>
                    <div class="crypto-address">
                        <code>${address}</code>
                        <button onclick="window.copyAddress('${address}')" class="btn-copy-address">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>

                <div class="crypto-qr-box">
                    <p class="crypto-qr-label">📱 Escanea el código QR</p>
                    <div class="qr-code-container">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}" 
                             alt="QR Code Bitcoin" 
                             class="qr-code">
                    </div>
                </div>

                <div class="crypto-actions">
                    <a href="${link}" target="_blank" class="btn-pay-crypto" style="background: #F7931A;">
                        <i class="fab fa-bitcoin"></i> Pagar con Bitcoin
                    </a>
                </div>

                <div class="crypto-status-box" id="cryptoStatus">
                    <div class="status-item">
                        <span>⏳ Estado</span>
                        <span class="status-pending">Esperando pago...</span>
                    </div>
                    <div class="status-progress">
                        <div class="progress-bar" id="progressBar" style="width: 0%;"></div>
                    </div>
                </div>

                <div class="crypto-warning">
                    <i class="fas fa-clock"></i>
                    <div>
                        <strong>⚠️ Importante:</strong>
                        <p>Envía la cantidad EXACTA mostrada arriba</p>
                        <p>La transacción requiere 3 confirmaciones</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Simular confirmación
    async simulateCryptoConfirmation(transactionId, method) {
        let currentConfirmations = 0;
        const confirmationsNeeded = 3;
        
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                currentConfirmations++;
                const progress = (currentConfirmations / confirmationsNeeded) * 100;
                
                const statusEl = document.getElementById('cryptoStatus');
                const progressBar = document.getElementById('progressBar');
                
                if (statusEl) {
                    const statusSpan = statusEl.querySelector('.status-pending');
                    if (statusSpan) {
                        statusSpan.textContent = `⏳ Confirmando... (${currentConfirmations}/${confirmationsNeeded})`;
                    }
                }
                
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                    if (progress > 30) progressBar.style.background = '#f59e0b';
                    if (progress > 60) progressBar.style.background = '#4f46e5';
                    if (progress > 90) progressBar.style.background = '#10b981';
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
                    if (progressBar) {
                        progressBar.style.width = '100%';
                        progressBar.style.background = '#10b981';
                    }
                    resolve({
                        success: true,
                        confirmed: true,
                        confirmations: currentConfirmations
                    });
                }
            }, 3000);
        });
    }

    // DESCONTAR DINERO DEL USUARIO
    deductBalance(amount, user) {
        if (!user) return false;
        
        // Obtener usuarios
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex === -1) return false;
        
        // Inicializar balance si no existe
        if (!users[userIndex].balance) {
            users[userIndex].balance = 1000; // Balance inicial de prueba
        }
        
        // Descontar
        users[userIndex].balance -= amount;
        
        // Guardar
        localStorage.setItem('users', JSON.stringify(users));
        
        // Actualizar usuario actual
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.id === user.id) {
            currentUser.balance = users[userIndex].balance;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        return true;
    }

    // Obtener balance del usuario
    getBalance(user) {
        if (!user) return 0;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const found = users.find(u => u.id === user.id);
        
        return found ? (found.balance || 1000) : 0;
    }
}

const paymentManager = new PaymentManager();

// Función para copiar dirección
window.copyAddress = function(address) {
    if (address) {
        navigator.clipboard.writeText(address).then(() => {
            showNotification('✅ Dirección copiada al portapapeles', 'success');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = address;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
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

function initCheckout() {
    if (typeof cartManager === 'undefined') {
        console.error('Cart manager not found');
        return;
    }

    const cartData = cartManager.getCheckoutData ? cartManager.getCheckoutData() : cartManager;
    
    if (!cartData.items || cartData.items.length === 0) {
        const container = document.getElementById('checkoutContainer');
        if (container) {
            container.innerHTML = `
                <div class="empty-cart" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-shopping-cart fa-3x" style="color: #4f46e5;"></i>
                    <h3 style="color: white;">No hay productos en el carrito</h3>
                    <p style="color: #a0aec0;">Agrega productos antes de continuar</p>
                    <a href="shop.html" class="btn-primary" style="display: inline-block; margin-top: 20px;">Ir a la tienda</a>
                </div>
            `;
        }
        return;
    }

    renderCheckoutSummary(cartData);
    renderPaymentMethods(cartData.total || cartData.subtotal || 0);
}

function renderCheckoutSummary(cartData) {
    const summaryContainer = document.getElementById('orderSummary');
    if (!summaryContainer) return;

    const subtotal = cartData.subtotal || cartData.total || 0;
    const shipping = cartData.shipping || (subtotal > 50 ? 0 : 5.99);
    const tax = cartData.tax || (subtotal * 0.10);
    const total = subtotal + shipping + tax;

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
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="shipping">
                <span>Envío</span>
                <span>${shipping === 0 ? 'Gratis' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div class="tax">
                <span>Impuesto (10%)</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="total">
                <span><strong>Total</strong></span>
                <span><strong>$${total.toFixed(2)}</strong></span>
            </div>
        </div>
    `;
}

function renderPaymentMethods(total) {
    const container = document.getElementById('paymentMethods');
    if (!container) return;

    const methods = paymentManager.getPaymentMethods();

    let methodsHTML = `
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
    `;

    if (total > 0) {
        methodsHTML += `
            <button id="processPaymentBtn" class="btn-pay" onclick="window.processCheckout()" disabled>
                Pagar $${total.toFixed(2)}
            </button>
        `;
    }

    container.innerHTML = methodsHTML;
}

let selectedPaymentMethod = null;

window.selectPaymentMethod = function(methodId) {
    selectedPaymentMethod = methodId;
    
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
        if (el.dataset.method === methodId) {
            el.classList.add('selected');
        }
    });
    
    const btn = document.getElementById('processPaymentBtn');
    if (btn) {
        btn.disabled = false;
    }
    
    const detailsContainer = document.getElementById('paymentDetails');
    if (!detailsContainer) return;

    if (methodId === 'stripe') {
        detailsContainer.innerHTML = `
            <div class="stripe-form">
                <div class="form-group">
                    <label>Número de tarjeta</label>
                    <div class="card-input">
                        <i class="fas fa-credit-card"></i>
                        <input type="text" placeholder="4242 4242 4242 4242" class="card-number-input" id="cardNumber">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha expiración</label>
                        <input type="text" placeholder="MM/YY" class="card-expiry-input" id="cardExpiry">
                    </div>
                    <div class="form-group">
                        <label>CVC</label>
                        <input type="text" placeholder="123" class="card-cvc-input" id="cardCvc">
                    </div>
                </div>
                <div class="form-group">
                    <label>Nombre del titular</label>
                    <input type="text" placeholder="Juan Pérez" class="card-name-input" id="cardName">
                </div>
                <div class="stripe-badge">
                    <i class="fas fa-lock"></i>
                    Pago seguro con Stripe
                </div>
            </div>
        `;
    } else {
        detailsContainer.innerHTML = `
            <div class="crypto-info" style="text-align: center; padding: 20px;">
                <p style="color: #a0aec0;">Selecciona "Pagar" para continuar...</p>
            </div>
        `;
    }
};

window.processCheckout = async function() {
    if (!selectedPaymentMethod) {
        showNotification('❌ Selecciona un método de pago', 'error');
        return;
    }

    if (typeof cartManager === 'undefined') {
        showNotification('❌ Error: Carrito no disponible', 'error');
        return;
    }

    const cartData = cartManager.getCheckoutData ? cartManager.getCheckoutData() : cartManager;
    const total = cartData.total || cartData.subtotal || 0;

    if (total <= 0) {
        showNotification('❌ El carrito está vacío', 'error');
        return;
    }

    const user = authManager.getCurrentUser();
    if (!user) {
        showNotification('❌ Inicia sesión para continuar', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    const btn = document.getElementById('processPaymentBtn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = '⏳ Procesando...';
    }

    try {
        const result = await paymentManager.processPayment(
            selectedPaymentMethod,
            total,
            { user, items: cartData.items }
        );

        if (result.success) {
            if (result.instructions) {
                const detailsContainer = document.getElementById('paymentDetails');
                if (detailsContainer) {
                    detailsContainer.innerHTML = result.instructions;
                }
                if (btn) {
                    btn.textContent = '⏳ Esperando confirmación...';
                    btn.disabled = true;
                }
                
                paymentManager.simulateCryptoConfirmation(
                    result.transactionId,
                    selectedPaymentMethod
                ).then((confirmation) => {
                    if (confirmation.success) {
                        // DESCONTAR DINERO
                        paymentManager.deductBalance(total, user);
                        saveOrder(result, cartData);
                        cartManager.clearCart();
                        setTimeout(() => {
                            showPaymentSuccess(result);
                        }, 500);
                    }
                });
                
                return;
            }
            
            // DESCONTAR DINERO para Stripe
            paymentManager.deductBalance(total, user);
            saveOrder(result, cartData);
            cartManager.clearCart();
            showPaymentSuccess(result);
        } else {
            showNotification(`❌ Error: ${result.error}`, 'error');
            if (btn) {
                btn.disabled = false;
                btn.textContent = `Pagar $${total.toFixed(2)}`;
            }
        }
    } catch (error) {
        showNotification(`❌ Error: ${error.message}`, 'error');
        if (btn) {
            btn.disabled = false;
            btn.textContent = `Pagar $${total.toFixed(2)}`;
        }
    }
};

function saveOrder(paymentResult, cartData) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const order = {
        id: paymentResult.transactionId || `ORD_${Date.now()}`,
        date: new Date().toISOString(),
        user: authManager.getCurrentUser(),
        items: cartData.items || [],
        subtotal: cartData.subtotal || cartData.total || 0,
        total: paymentResult.amount || cartData.total || 0,
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

function showPaymentSuccess(result) {
    const container = document.getElementById('checkoutContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="payment-success" style="grid-column: 1 / -1;">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="color: white;">¡Pago Exitoso!</h2>
            <p style="color: #a0aec0;">Tu orden ha sido procesada correctamente</p>
            <div class="order-details" style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin: 20px auto; max-width: 400px; text-align: left;">
                <p style="color: #a0aec0; padding: 5px 0;"><strong style="color: white;">ID:</strong> ${result.transactionId}</p>
                <p style="color: #a0aec0; padding: 5px 0;"><strong style="color: white;">Método:</strong> ${result.method}</p>
                <p style="color: #a0aec0; padding: 5px 0;"><strong style="color: white;">Monto:</strong> $${(result.amount || 0).toFixed(2)}</p>
            </div>
            <a href="index.html" class="btn-primary" style="display: inline-block; margin-top: 20px;">Volver al Inicio</a>
        </div>
    `;
}

window.paymentManager = paymentManager;
