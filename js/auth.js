// ============================================
// AUTH.JS - Compatibilidad con Supabase
// ============================================

console.log('🚀 Auth.js cargado (modo Supabase)');

// ============ REDIRECCIONAR A SUPABASE ============
function registerUser(email, password, username) {
    return supabaseRegister(email, password, username);
}

function loginUser(email, password) {
    return supabaseLogin(email, password);
}

function logoutUser() {
    return supabaseLogout();
}

function getCurrentUser() {
    return supabaseGetCurrentUser();
}

function checkSession() {
    return supabaseCheckSession();
}

function updateUserUI() {
    if (typeof window.updateUserUI === 'function') {
        window.updateUserUI();
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.toggle('active');
}

// ============ ADMIN ============
async function isAdmin(email) {
    return await supabaseIsAdmin(email);
}

async function verifyAdminKey(email, key) {
    return await supabaseVerifyAdminKey(email, key);
}

async function getUsers() {
    return await supabaseGetAllUsers();
}

function loadWhitelist() {
    return {
        admins: [
            { email: 'admin@yxcards.com', key: 'admin123' },
            { email: 'personalbusiness2626@gmail.com', key: 'admin123' }
        ]
    };
}

function getAdminList() {
    const whitelist = loadWhitelist();
    return whitelist.admins || [];
}

function updateUserBalance(userId, amount) {
    return supabaseUpdateBalance(userId, amount);
}

function addPurchaseToHistory(userId, purchaseData) {
    return supabaseAddPurchase(userId, purchaseData);
}

// ============ EXPORTAR ============
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getCurrentUser = getCurrentUser;
window.checkSession = checkSession;
window.updateUserUI = updateUserUI;
window.toggleUserMenu = toggleUserMenu;
window.isAdmin = isAdmin;
window.verifyAdminKey = verifyAdminKey;
window.getUsers = getUsers;
window.loadWhitelist = loadWhitelist;
window.getAdminList = getAdminList;
window.updateUserBalance = updateUserBalance;
window.addPurchaseToHistory = addPurchaseToHistory;

console.log('✅ Auth.js compatibilidad con Supabase cargado');
