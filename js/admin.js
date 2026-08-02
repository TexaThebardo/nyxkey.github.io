// 🔧 PANEL DE ADMINISTRACIÓN
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación (solo admin)
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Cargar productos
    await productManager.loadProducts();
    renderAdminProducts();

    // Event listeners
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    document.getElementById('exportJsonBtn').addEventListener('click', exportToJSON);
    document.getElementById('copyJsonBtn').addEventListener('click', copyToClipboard);
});

// Renderizar productos en el panel admin
function renderAdminProducts() {
    const container = document.getElementById('adminProductsList');
    const products = productManager.getAllProducts();
    
    container.innerHTML = products.map(product => `
        <div class="admin-product-card">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span class="price">$${product.price}</span>
                <span class="stock">Stock: ${product.stock}</span>
            </div>
            <div class="product-actions">
                <button onclick="editProduct('${product.id}')" class="btn-edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteProduct('${product.id}')" class="btn-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Agregar producto
function handleAddProduct(e) {
    e.preventDefault();
    const form = e.target;
    const product = {
        name: form.name.value,
        description: form.description.value,
        price: parseFloat(form.price.value),
        card_type: form.cardType.value,
        card_number: form.cardNumber.value,
        card_expiry: form.cardExpiry.value,
        card_cvv: '***',
        card_holder: form.cardHolder.value || 'Premium User',
        stock: parseInt(form.stock.value),
        image: form.image.value || 'images/cards/default.jpg',
        category: form.category.value,
        status: 'active',
        features: form.features.value.split(',').map(f => f.trim())
    };

    productManager.addProduct(product);
    renderAdminProducts();
    showNotification('✅ Producto agregado correctamente');
    form.reset();
}

// Exportar a JSON para GitHub
function exportToJSON() {
    const jsonData = {
        products: productManager.products,
        settings: {
            store_name: "CardNMR Store",
            currency: "USD"
        }
    };
    
    // Crear archivo para descargar
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.json';
    a.click();
    
    showNotification('📥 Archivo JSON descargado. Sube este archivo a GitHub');
}

// Copiar JSON al portapapeles
async function copyToClipboard() {
    const jsonData = {
        products: productManager.products,
        settings: {
            store_name: "CardNMR Store",
            currency: "USD"
        }
    };
    
    try {
        await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
        showNotification('📋 JSON copiado al portapapeles. Pega en GitHub');
    } catch (err) {
        showNotification('❌ Error al copiar', 'error');
    }
}

// 🔗 Mostrar enlace directo a GitHub
function getGitHubEditLink() {
    const repo = 'tu-usuario/card-nmr-store';
    const branch = 'main';
    const file = 'data/products.json';
    return `https://github.com/${repo}/edit/${branch}/${file}`;
}

// Mostrar instrucciones para GitHub
function showGitHubInstructions() {
    const modal = document.getElementById('githubModal');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>📝 Cómo actualizar tu tienda en GitHub</h3>
            <ol>
                <li>Ve a <a href="${getGitHubEditLink()}" target="_blank">este enlace</a></li>
                <li>Copia el JSON de abajo</li>
                <li>Pégalo en el archivo products.json</li>
                <li>Haz commit de los cambios</li>
                <li>¡Listo! Tu tienda se actualizará automáticamente</li>
            </ol>
            <pre><code>${JSON.stringify({ products: productManager.products }, null, 2)}</code></pre>
            <button onclick="copyToClipboard()">📋 Copiar JSON</button>
            <button onclick="closeModal()">Cerrar</button>
        </div>
    `;
    modal.style.display = 'block';
}
