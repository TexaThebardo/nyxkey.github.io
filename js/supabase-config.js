// ============================================
// FIREBASE-CONFIG.JS - Configuración de Firebase
// ============================================

// Este archivo es para conectar con Firebase en producción
// Descomenta y configura con tus credenciales

/*
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Funciones de autenticación con Firebase
async function firebaseRegister(email, password, username, fullName) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection('users').doc(userCredential.user.uid).set({
            username, fullName, balance: 0, role: 'user',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        showToast(error.message, 'error');
        return false;
    }
}

async function firebaseLogin(email, password) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        return true;
    } catch (error) {
        showToast(error.message, 'error');
        return false;
    }
}

async function firebaseLogout() {
    await auth.signOut();
    window.location.href = '/login.html';
}

window.firebaseRegister = firebaseRegister;
window.firebaseLogin = firebaseLogin;
window.firebaseLogout = firebaseLogout;
*/
