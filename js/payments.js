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
                        progressBar
