<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Yx Cards</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <span class="material-icons-outlined">flash_on</span>
                <span class="logo-text">Yx</span>
                <span class="logo-text-full">Cards</span>
                <span class="logo-badge">DASH</span>
            </div>
            <div class="nav-user">
                <!-- BOTÓN ADMIN MANAGER EN NAVBAR (solo visible para admins) -->
                <button id="adminPanelBtn" class="btn-admin-link" onclick="window.location.href='admin.html'" style="display:none;">
                    <span class="material-icons">admin_panel_settings</span>
                    Admin
                </button>
                
                <div class="user-balance">
                    <span class="material-icons-outlined">account_balance_wallet</span>
                    <span class="balance-amount" id="dashboardBalance">$0.00</span>
                </div>
                <div class="user-avatar">
                    <span class="material-icons-outlined">person</span>
                </div>
            </div>
        </div>
    </nav>
    
    <div class="dashboard-container">
        <aside class="sidebar">
            <nav class="sidebar-nav">
                <span class="sidebar-title">Navegación</span>
                
                <a href="#" class="sidebar-link active" data-section="overview">
                    <span class="material-icons-outlined">dashboard</span>
                    <span>Visión General</span>
                </a>
                
                <a href="#" class="sidebar-link" data-section="purchases">
                    <span class="material-icons-outlined">shopping_bag</span>
                    <span>Mis Compras</span>
                </a>
                
                <a href="#" class="sidebar-link" data-section="transactions">
                    <span class="material-icons-outlined">receipt_long</span>
                    <span>Transacciones</span>
                </a>
                
                <a href="profile.html" class="sidebar-link">
                    <span class="material-icons-outlined">person</span>
                    <span>Mi Perfil</span>
                </a>
                
                <a href="index.html" class="sidebar-link">
                    <span class="material-icons-outlined">storefront</span>
                    <span>Tienda</span>
                </a>
                
                <!-- ADMIN MANAGER - SOLO VISIBLE PARA ADMINS -->
                <a href="admin.html" class="sidebar-link" id="adminSidebarBtn" style="display:none;">
                    <span class="material-icons-outlined">admin_panel_settings</span>
                    <span>Admin Manager</span>
                </a>
                
                <div class="sidebar-divider"></div>
                
                <a href="#" class="sidebar-link logout" onclick="logoutUser()">
                    <span class="material-icons-outlined">logout</span>
                    <span>Cerrar Sesión</span>
                </a>
            </nav>
        </aside>
        
        <main class="dashboard-main">
            <!-- SECCIÓN OVERVIEW -->
            <section id="overview" class="dashboard-section active">
                <div class="section-header">
                    <h2>Visión General</h2>
                    <span class="date-badge" id="currentDate"></span>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon green">
                            <span class="material-icons-outlined">shopping_cart</span>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value" id="totalPurchases">0</span>
                            <span class="stat-label">Tarjetas Compradas</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon blue">
                            <span class="material-icons-outlined">attach_money</span>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value" id="totalSpent">$0</span>
                            <span class="stat-label">Total Gastado</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon purple">
                            <span class="material-icons-outlined">account_balance_wallet</span>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value" id="currentBalance">$0</span>
                            <span class="stat-label">Saldo Actual</span>
                        </div>
                    </div>
                </div>
                
                <div class="recent-activity">
                    <div class="activity-header">
                        <h3>Últimas Compras</h3>
                    </div>
                    <div id="recentPurchases" class="activity-list">
                        <div class="empty-state">
                            <span class="material-icons-outlined">shopping_bag</span>
                            <p>No has realizado compras aún</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- SECCIÓN MIS COMPRAS -->
            <section id="purchases" class="dashboard-section">
                <div class="section-header">
                    <h2>Mis Tarjetas Compradas</h2>
                    <span class="purchase-count" id="purchaseCount">0 tarjetas</span>
                </div>
                <div class="purchases-grid" id="purchasesGrid">
                    <!-- Renderizado por JavaScript -->
                </div>
            </section>

            <!-- SECCIÓN TRANSACCIONES -->
            <section id="transactions" class="dashboard-section">
                <div class="section-header">
                    <h2>Historial de Transacciones</h2>
                </div>
                <div class="transactions-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody id="transactionsBody">
                            <tr>
                                <td colspan="5" style="text-align:center;padding:40px;color:#5a6575;">
                                    <span class="material-icons-outlined" style="font-size:48px;display:block;">receipt_long</span>
                                    No hay transacciones registradas
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>

    <script src="js/auth.js"></script>
    <script src="js/admin.js"></script>
    <script src="js/products.js"></script>
    <script src="js/app.js"></script>
    <script src="js/dashboard.js"></script>
</body>
</html>
