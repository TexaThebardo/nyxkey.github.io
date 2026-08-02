document.addEventListener('DOMContentLoaded', () => {
    
    // 1. OBTENER DATOS (Simulamos que vienen de localStorage o un array)
    // En tu código real, esto sería: let products = JSON.parse(localStorage.getItem('products')) || [];
    let products = [
        { id: 1, network: 'Visa', bin: '414720', database: 'DB_July_2026', class: 'CREDIT', level: 'PLATINUM', bank: 'JPMORGAN CHASE', country: 'UNITED STATES', type: 'CC Full', service: 'Multifunctional', nonVbv: true, price: 28.58, featured: true },
        { id: 2, network: 'Mastercard', bin: '521894', database: 'DB_July_2026', class: 'CREDIT', level: 'TITANIUM', bank: 'CAPITAL ONE BANK', country: 'UNITED STATES', type: 'Non VBV', service: 'Non-VBV', nonVbv: true, price: 48.58, featured: false },
        { id: 3, network: 'Visa', bin: '471612', database: 'DB_July_2026', class: 'DEBIT', level: 'SIGNATURE', bank: 'BANK OF AMERICA', country: 'UNITED STATES', type: 'CC Full', service: 'Multifunctional', nonVbv: false, price: 27.90, featured: true },
        { id: 4, network: 'Amex', bin: '371449', database: 'DB_July_2026', class: 'CREDIT', level: 'CENTURION', bank: 'AMERICAN EXPRESS', country: 'UNITED STATES', type: 'Non VBV', service: 'Non-VBV', nonVbv: true, price: 51.29, featured: true },
        // ... Agrega aquí el resto de tus tarjetas
    ];

    // FUNCIÓN PARA RENDERIZAR LA TABLA
    function renderProducts(data) {
        const tbody = document.getElementById('products-table-body');
        tbody.innerHTML = '';

        // Actualizar contadores
        document.getElementById('total-products-count').innerText = data.length;
        document.getElementById('featured-products-count').innerText = data.filter(p => p.featured).length;
        document.getElementById('topbar-balance').innerText = `$${data.reduce((acc, p) => acc + p.price, 0).toFixed(2)}`; // Saldo sumado de ejemplo

        data.forEach(product => {
            // Determinar color de la red
            let networkClass = 'badge-network ';
            if(product.network.toLowerCase() === 'visa') networkClass += 'badge-visa';
            else if(product.network.toLowerCase() === 'mastercard') networkClass += 'badge-mastercard';
            else if(product.network.toLowerCase() === 'amex') networkClass += 'badge-amex';

            // Determinar flag de país (usando banderas de emoji por simplicidad)
            const countryFlags = {
                'UNITED STATES': '🇺🇸',
                'DOMINICAN REPUBLIC': '🇩🇴',
                'MEXICO': '🇲🇽',
                'AUSTRALIA': '🇦🇺',
                'CANADA': '🇨🇦'
            };
            const flag = countryFlags[product.country] || '🌍';

            const row = `
                <tr>
                    <td><span class="${networkClass}"><i class="fa-brands fa-cc-${product.network.toLowerCase()}"></i> ${product.network}</span></td>
                    <td><strong>${product.bin}</strong></td>
                    <td><span class="badge-type">${product.database}</span></td>
                    <td>${product.class}</td>
                    <td>${product.level}</td>
                    <td>${product.bank}</td>
                    <td><span class="badge-country">${flag} ${product.country}</span></td>
                    <td><span class="badge-type">${product.type}</span></td>
                    <td>${product.service || '-'}</td>
                    <td>${product.nonVbv ? '<span class="badge-nonvbv">Non VBV</span>' : '-'}</td>
                    <td>${product.nonVbv ? '<span class="badge-nonvbv">Non MSC</span>' : '-'}</td>
                    <td>${product.extra || '-'}</td>
                    <td><span class="price-text">$${product.price.toFixed(2)}</span></td>
                    <td><button class="btn-add-cart" onclick="addToCart(${product.id})"><i class="fa-solid fa-cart-plus"></i></button></td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    // Lógica de Filtros
    const filterBtns = document.querySelectorAll('.cat-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-cat');
            if(category === 'all') {
                renderProducts(products);
            } else {
                // Filtra por Network, o por Destacados si quisieras
                const filtered = products.filter(p => p.network.toLowerCase() === category.toLowerCase());
                renderProducts(filtered);
            }
        });
    });

    // Función simulada para agregar al carrito
    window.addToCart = function(id) {
        alert(`Tarjeta ID ${id} agregada al carrito.`);
        // Aquí iría tu lógica de localStorage de carrito existente
    };

    // Render inicial
    renderProducts(products);
});
