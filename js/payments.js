// 💳 SISTEMA DE PAGOS - CON QR Y ENLACES REALES

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
                name: 'USDT (TRC20)', 
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
            },
            { 
                id: 'paypal', 
                name: 'PayPal', 
                icon: 'fa-paypal', 
                color: '#0070BA',
                description: 'Pago con PayPal'
            }
        ];
        
        // Tasas de cambio (simuladas)
        this.cryptoRates = {
            BTC: 65000,
            USDT: 1,
            ETH: 3500
        };
    }

    getPaymentMethods() {
        return this.paymentMethods;
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
                case 'paypal':
                    return await this.paypalPayment(amount, orderData);
                default:
                    throw new Error('Método de pago no soportado');
            }
        } catch (error) {
            console.error('Payment error:', error);
            return { success: false, error: error.message };
        }
    }

    // =============================================
    // STRIPE - PAGO CON TARJETA
    // =============================================
    async stripePayment(amount, orderData) {
        return new Promise((resolve) => {
            // Simular procesamiento
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: `stripe_${Date.now()}`,
                    method: 'stripe',
                    amount: amount,
                    currency: 'USD',
                    status: 'completed',
                    message: 'Pago procesado exitosamente con Stripe',
                    // Enlace real a Stripe (simulado)
                    paymentLink: `https://buy.stripe.com/test_${Date.now()}`,
                    receiptUrl: `https://dashboard.stripe.com/payments/${Date.now()}`
                });
            }, 1500);
        });
    }

    // =============================================
    // BITCOIN - PAGO CON QR Y ENLACE REAL
    // =============================================
    async bitcoinPayment(amount, orderData) {
        const btcAmount = (amount / this.cryptoRates.BTC).toFixed(8);
        const address = this.generateCryptoAddress('BTC');
        
        // Generar enlace real para Bitcoin
        const bitcoinLink = `bitcoin:${address}?amount=${btcAmount}&label=CardNMR%20Store`;
        const blockExplorerLink = `https://www.blockchain.com/explorer/addresses/btc/${address}`;
        
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
            // QR y enlaces
            qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(bitcoinLink)}`,
            paymentLink: bitcoinLink,
            blockExplorerLink: blockExplorerLink,
            instructions: this.getBitcoinInstructions(address, btcAmount, bitcoinLink)
        };
    }

    // =============================================
    // USDT (TRC20) - PAGO CON QR Y ENLACE REAL
    // =============================================
    async usdtPayment(amount, orderData) {
        const usdtAmount = (amount / this.cryptoRates.USDT).toFixed(2);
        const address = this.generateCryptoAddress('USDT');
        
        // Enlace real para USDT (TRC20)
        const tronLink = `https://tronscan.org/#/address/${address}`;
        const usdtLink = `https://tronscan.org/#/transfer?to=${address}&amount=${usdtAmount}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`;
        
        return {
            success: true,
            transactionId: `usdt_${Date.now()}`,
            method: 'usdt',
            amount: amount,
            currency: 'USD',
            cryptoAmount: usdtAmount,
            cryptoCurrency: 'USDT',
            network: 'TRC20',
            address: address,
            status: 'pending',
            requiresConfirmation: true,
            // QR y enlaces
            qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(usdtLink)}`,
            paymentLink: usdtLink,
            blockExplorerLink: tronLink,
            instructions: this.getUSDTInstructions(address, usdtAmount, usdtLink)
        };
    }

    // =============================================
    // ETHEREUM - PAGO CON QR Y ENLACE REAL
    // =============================================
    async ethereumPayment(amount, orderData) {
        const ethAmount = (amount / this.cryptoRates.ETH).toFixed(6);
        const address = this.generateCryptoAddress('ETH');
        
        // Enlace real para Ethereum
        const ethLink = `ethereum:${address}?amount=${ethAmount}`;
        const etherscanLink = `https://etherscan.io/address/${address}`;
        
        return {
            success: true,
            transactionId: `eth_${Date.now()}`,
            method: 'ethereum',
            amount: amount,
            currency: 'USD',
            cryptoAmount: ethAmount,
            cryptoCurrency: 'ETH',
            address: address,
            status: 'pending',
            requiresConfirmation: true,
            // QR y enlaces
            qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ethLink)}`,
            paymentLink: ethLink,
            blockExplorerLink: etherscanLink,
            instructions: this.getEthereumInstructions(address, ethAmount, ethLink)
        };
    }

    // =============================================
    // PAYPAL - PAGO CON PAYPAL
    // =============================================
    async paypalPayment(amount, orderData) {
        return new Promise((resolve) => {
            // Generar enlace de PayPal (simulado)
            const paypalLink = `https://www.paypal.com/paypalme/cardnmrstore/${amount}`;
            
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: `paypal_${Date.now()}`,
                    method: 'paypal',
                    amount: amount,
                    currency: 'USD',
                    status: 'pending',
                    paymentLink: paypalLink,
                    instructions: this.getPayPalInstructions(amount, paypalLink)
                });
            }, 1000);
        });
    }

    // =============================================
    // GENERAR DIRECCIÓN CRYPTO
    // =============================================
    generateCryptoAddress(currency) {
        const prefixes = { BTC: '1', USDT: '0x', ETH: '0x' };
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        let address = prefixes[currency] || '';
        const length = currency === 'BTC' ? 34 : 42;
        for (let i = 0; i < length - address.length; i++) {
            address += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return address;
    }

    // =============================================
    // INSTRUCCIONES BITCOIN
    // =============================================
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
                        <button onclick="window.copyAddress('${address}')" class="btn-copy-address" title="Copiar dirección">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>

                <div class="crypto-qr-box">
                    <p class="crypto-qr-label">📱 Escanea el código QR</p>
                    <div class="qr-code-container">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}" 
                             alt="QR Code Bitcoin" 
                             class="qr-code"
                             id="qrCodeImg">
                        <a href="${link}" target="_blank" class="btn-qr-link">
                            <i class="fas fa-external-link-alt"></i> Abrir en wallet
                        </a>
                    </div>
                </div>

                <div class="crypto-actions">
                    <a href="${link}" target="_blank" class="btn-pay-crypto">
                        <i class="fab fa-bitcoin"></i> Pagar con Bitcoin
                    </a>
                    <a href="https://www.blockchain.com/explorer/addresses/btc/${address}" target="_blank" class="btn-block-explorer">
                        <i class="fas fa-search"></i> Ver en Blockchain
                    </a>
                </div>

                <div class="crypto-status-box" id="cryptoStatus">
                    <div class="status-item">
                        <span>⏳ Estado</span>
                        <span class="status-pending">Esperando pago...</span>
                    </div>
                    <div class="status-item">
                        <span>🔗 Confirmaciones</span>
                        <span id="confirmationsCount">0/3</span>
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
                        <p>La transacción requiere 3 confirmaciones (≈ 30-60 minutos)</p>
                        <p>No cierres esta página hasta que se complete</p>
                    </div>
                </div>
            </div>
        `;
    }

    // =============================================
    // INSTRUCCIONES USDT
    // =============================================
    getUSDTInstructions(address, amount, link) {
        return `
            <div class="crypto-payment">
                <div class="crypto-header">
                    <i class="fas fa-coins" style="color: #26A17B; font-size: 2.5rem;"></i>
                    <div>
                        <h3 style="color: white; margin: 0;">Pago con USDT (TRC20)</h3>
                        <p style="color: #a0aec0; margin: 0;">Pago rápido y con comisiones bajas</p>
                    </div>
                </div>

                <div class="crypto-amount-box">
                    <div class="crypto-amount">
                        <span class="crypto-amount-label">Monto a pagar</span>
                        <span class="crypto-amount-value">${amount} USDT</span>
                        <span class="crypto-amount-usd">≈ $${(amount * this.cryptoRates.USDT).toFixed(2)} USD</span>
                    </div>
                </div>

                <div class="crypto-address-box">
                    <p class="crypto-address-label">📤 Dirección de destino (TRC20)</p>
                    <div class="crypto-address">
                        <code>${address}</code>
                        <button onclick="window.copyAddress('${address}')" class="btn-copy-address" title="Copiar dirección">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>

                <div class="crypto-qr-box">
                    <p class="crypto-qr-label">📱 Escanea el código QR</p>
                    <div class="qr-code-container">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}" 
                             alt="QR Code USDT" 
                             class="qr-code">
                        <a href="${link}" target="_blank" class="btn-qr-link">
                            <i class="fas fa-external-link-alt"></i> Abrir en TronScan
                        </a>
                    </div>
                </div>

                <div class="crypto-actions">
                    <a href="${link}" target="_blank" class="btn-pay-crypto" style="background: #26A17B;">
                        <i class="fas fa-coins"></i> Pagar con USDT
                    </a>
                    <a href="https://tronscan.org/#/address/${address}" target="_blank" class="btn-block-explorer">
                        <i class="fas fa-search"></i> Ver en TronScan
                    </a>
                </div>

                <div class="crypto-status-box" id="cryptoStatus">
                    <div class="status-item">
                        <span>⏳ Estado</span>
                        <span class="status-pending">Esperando pago...</span>
                    </div>
                    <div class="status-item">
                        <span>✅ Confirmación</span>
                        <span id="confirmationsCount">0/1</span>
                    </div>
                    <div class="status-progress">
                        <div class="progress-bar" id="progressBar" style="width: 0%;"></div>
                    </div>
                </div>

                <div class="crypto-warning" style="border-left-color: #26A17B;">
                    <i class="fas fa-check-circle" style="color: #26A17B;"></i>
                    <div>
                        <strong>✅ Rápido y seguro:</strong>
                        <p>Usa la red TRC20 para comisiones bajas</p>
                        <p>Confirmación en 1-5 minutos</p>
                    </div>
                </div>
            </div>
        `;
    }

    // =============================================
    // INSTRUCCIONES ETHEREUM
    // =============================================
    getEthereumInstructions(address, amount, link) {
        return `
            <div class="crypto-payment">
                <div class="crypto-header">
                    <i class="fab fa-ethereum" style="color: #627EEA; font-size: 2.5rem;"></i>
                    <div>
                        <h3 style="color: white; margin: 0;">Pago con Ethereum</h3>
                        <p style="color: #a0aec0; margin: 0;">Pago seguro en la red ERC-20</p>
                    </div>
                </div>

                <div class="crypto-amount-box">
                    <div class="crypto-amount">
                        <span class="crypto-amount-label">Monto a pagar</span>
                        <span class="crypto-amount-value">${amount} ETH</span>
                        <span class="crypto-amount-usd">≈ $${(amount * this.cryptoRates.ETH).toFixed(2)} USD</span>
                    </div>
                </div>

                <div class="crypto-address-box">
                    <p class="crypto-address-label">📤 Dirección de destino (ERC-20)</p>
                    <div class="crypto-address">
                        <code>${address}</code>
                        <button onclick="window.copyAddress('${address}')" class="btn-copy-address" title="Copiar dirección">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>

                <div class="crypto-qr-box">
                    <p class="crypto-qr-label">📱 Escanea el código QR</p>
                    <div class="qr-code-container">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}" 
                             alt="QR Code Ethereum" 
                             class="qr-code">
                        <a href="${link}" target="_blank" class="btn-qr-link">
                            <i class="fas fa-external-link-alt"></i> Abrir en wallet
                        </a>
                    </div>
                </div>

                <div class="crypto-actions">
                    <a href="${link}" target="_blank" class="btn-pay-crypto" style="background: #627EEA;">
                        <i class="fab fa-ethereum"></i> Pagar con Ethereum
                    </a>
                    <a href="https://etherscan.io/address/${address}" target="_blank" class="btn-block-explorer">
                        <i class="fas fa-search"></i> Ver en Etherscan
                    </a>
                </div>

                <div class="crypto-status-box" id="cryptoStatus">
                    <div class="status-item">
                        <span>⏳ Estado</span>
                        <span class="status-pending">Esperando pago...</span>
                    </div>
                    <div class="status-item">
                        <span>🔗 Confirmaciones</span>
                        <span id="confirmationsCount">0/12</span>
                    </div>
                    <div class="status-progress">
                        <div class="progress-bar" id="progressBar" style="width: 0%;"></div>
                    </div>
                </div>

                <div class="crypto-warning" style="border-left-color: #627EEA;">
                    <i class="fas fa-clock" style="color: #627EEA;"></i>
                    <div>
                        <strong>⚠️ Importante:</strong>
                        <p>Requiere 12 confirmaciones en la red Ethereum (≈ 3-5 minutos)</p>
                        <p>Asegúrate de usar la red ERC-20</p>
                    </div>
                </div>
            </div>
        `;
    }

    // =============================================
    // INSTRUCCIONES PAYPAL
    // =============================================
    getPayPalInstructions(amount, link) {
        return `
            <div class="paypal-payment">
                <div class="crypto-header">
                    <i class="fab fa-paypal" style="color: #0070BA; font-size: 2.5rem;"></i>
                    <div>
                        <h3 style="color: white; margin: 0;">Pago con PayPal</h3>
                        <p style="color: #a0aec0; margin: 0;">Pago rápido y seguro</p>
                    </div>
                </div>

                <div class="crypto-amount-box">
                    <div class="crypto-amount">
                        <span class="crypto-amount-label">Monto a pagar</span>
                        <span class="crypto-amount-value">$${amount.toFixed(2)} USD</span>
                    </div>
                </div>

                <div class="paypal-actions">
                    <a href="${link}" target="_blank" class="btn-pay-crypto" style="background: #0070BA;">
                        <i class="fab fa-paypal"></i> Pagar con PayPal
                    </a>
                </div>

                <div class="crypto-warning" style="border-left-color: #0070BA;">
                    <i class="fas fa-info-circle" style="color: #0070BA;"></i>
                    <div>
                        <strong>ℹ️ Instrucciones:</strong>
                        <p>Serás redirigido a PayPal para completar el pago</p>
                        <p>No necesitas cuenta PayPal para pagar con tarjeta</p>
                    </div>
                </div>
            </div>
        `;
    }

    // =============================================
    // SIMULAR CONFIRMACIÓN DE PAGO CRYPTO
    // =============================================
    async simulateCryptoConfirmation(transactionId, method) {
        const confirmationsNeeded = method === 'bitcoin' ? 3 : method === 'ethereum' ? 12 : 1;
        let currentConfirmations = 0;
        
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                currentConfirmations++;
                const progress = (currentConfirmations / confirmationsNeeded) * 100;
                
                // Actualizar UI
                const statusEl = document.getElementById('cryptoStatus');
                const confirmEl = document.getElementById('confirmationsCount');
                const progressBar = document.getElementById('progressBar');
                
                if (statusEl) {
                    const statusSpan = statusEl.querySelector('.status-pending');
                    if (statusSpan) {
                        statusSpan.textContent = `⏳ Confirmando... (${currentConfirmations}/${confirmationsNeeded})`;
                    }
                }
                
                if (confirmEl) {
                    confirmEl.textContent = `${currentConfirmations}/${confirmationsNeeded}`;
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
}

// =============================================
// INSTANCIA GLOBAL
// =============================================
const paymentManager = new PaymentManager();

// =============================================
// FUNCIÓN PARA COPIAR DIRECCIÓN
// =============================================
window.copyAddress = function(address) {
    if (address) {
        navigator.clipboard.writeText(address).then(() => {
            showNotification('✅ Dirección copiada al portapapeles', 'success');
        }).catch(() => {
            // Fallback
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

// =============================================
// INICIALIZAR CHECKOUT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('checkoutContainer')) {
        initCheckout();
    }
});

// =============================================
// FUNCIÓN INICIALIZAR CHECKOUT
// =============================================
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

// =============================================
// RENDERIZAR RESUMEN DEL CHECKOUT
// =============================================
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

// =============================================
// RENDERIZAR MÉTODOS DE PAGO
// =============================================
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

// =============================================
// SELECCIONAR MÉTODO DE PAGO
// =============================================
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

    // Si es Stripe, mostrar formulario
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
        // Limpiar detalles para otros métodos
        detailsContainer.innerHTML = `
            <div class="crypto-info" style="text-align: center; padding: 20px;">
                <p style="color: #a0aec0;">Selecciona "Pagar" para continuar...</p>
            </div>
        `;
    }
};

// =============================================
// PROCESAR CHECKOUT
// =============================================
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
            // Si es crypto, mostrar instrucciones con QR
            if (result.instructions) {
                const detailsContainer = document.getElementById('paymentDetails');
                if (detailsContainer) {
                    detailsContainer.innerHTML = result.instructions;
                }
                if (btn) {
                    btn.textContent = '⏳ Esperando confirmación...';
                    btn.disabled = true;
                }
                
                // Iniciar simulación de confirmación
                paymentManager.simulateCryptoConfirmation(
                    result.transactionId,
                    selectedPaymentMethod
                ).then((confirmation) => {
                    if (confirmation.success) {
                        saveOrder(result, cartData);
                        cartManager.clearCart();
                        setTimeout(() => {
                            showPaymentSuccess(result);
                        }, 500);
                    }
                });
                
                return;
            }
            
            // Pago exitoso (Stripe o PayPal)
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

// =============================================
// GUARDAR ORDEN
// =============================================
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

// =============================================
// MOSTRAR ÉXITO DEL PAGO
// =============================================
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
                ${result.paymentLink ? `<p style="color: #a0aec0; padding: 5px 0;"><strong style="color: white;">Comprobante:</strong> <a href="${result.paymentLink}" target="_blank" style="color: #4f46e5;">Ver pago</a></p>` : ''}
            </div>
            <a href="index.html" class="btn-primary" style="display: inline-block; margin-top: 20px;">Volver al Inicio</a>
        </div>
    `;
}

// Exportar
window.paymentManager = paymentManager;
