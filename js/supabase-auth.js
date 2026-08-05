// ============================================
// SUPABASE-AUTH.JS - Autenticación con Supabase
// ============================================

// ============ HASH DE CONTRASEÑA ============
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return `hash_${Math.abs(hash)}`;
}

// ============ REGISTRO CON SUPABASE ============
async function supabaseRegister(email, password, username) {
    try {
        console.log('🔍 Registrando usuario con Supabase...');
        
        // 1. Crear usuario en Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        
        if (authError) throw authError;
        console.log('✅ Usuario creado en Auth:', authData.user.id);
        
        // 2. Insertar datos en la tabla users
        const { error: dbError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email: email,
                username: username,
                display_name: username,
                password_hash: hashPassword(password),
                balance: 0,
                role: 'user',
                profile: {
                    banner: '',
                    avatar: '',
                    bio: '',
                    pronoun: 'él',
                    note: 'Haz clic para añadir una nota',
                    connections: {}
                }
            });
        
        if (dbError) throw dbError;
        console.log('✅ Datos guardados en Supabase');
        
        showToast('✅ Registro exitoso. Inicia sesión.', 'success');
        return true;
    } catch (error) {
        console.error('❌ Error en registro:', error);
        showToast(error.message || 'Error al registrar', 'error');
        return false;
    }
}

// ============ LOGIN CON SUPABASE ============
async function supabaseLogin(email, password) {
    try {
        console.log('🔍 Iniciando sesión con Supabase...');
        
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (authError) throw authError;
        console.log('✅ Usuario autenticado:', authData.user.id);
        
        // Obtener datos del usuario
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();
        
        if (userError) throw userError;
        console.log('📦 Datos del usuario:', userData);
        
        // Actualizar last_login
        await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', authData.user.id);
        
        // Crear sesión local
        const session = {
            user: {
                id: userData.id,
                email: userData.email,
                username: userData.username,
                displayName: userData.display_name || userData.username,
                balance: userData.balance || 0,
                role: userData.role || 'user',
                purchases: userData.purchases || [],
                transactions: userData.transactions || [],
                profile: userData.profile || {
                    banner: '',
                    avatar: '',
                    bio: '',
                    pronoun: 'él',
                    note: 'Haz clic para añadir una nota',
                    connections: {}
                }
            },
            token: authData.session.access_token,
            expiresAt: Date.now() + 3600000
        };
        
        localStorage.setItem('yx_token', JSON.stringify(session));
        localStorage.setItem('yx_user', JSON.stringify(session.user));
        
        console.log('✅ Sesión creada localmente');
        updateUserUI();
        showToast(`👋 Bienvenido, ${userData.username}!`, 'success');
        return true;
    } catch (error) {
        console.error('❌ Error en login:', error);
        showToast(error.message || 'Error al iniciar sesión', 'error');
        return false;
    }
}

// ============ CERRAR SESIÓN ============
async function supabaseLogout() {
    try {
        await supabase.auth.signOut();
        localStorage.removeItem('yx_token');
        localStorage.removeItem('yx_user');
        showToast('Sesión cerrada', 'info');
        window.location.href = 'login.html';
        return true;
    } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
        showToast(error.message, 'error');
        return false;
    }
}

// ============ ACTUALIZAR SALDO ============
async function supabaseUpdateBalance(userId, amount) {
    try {
        // Obtener balance actual
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('balance')
            .eq('id', userId)
            .single();
        
        if (fetchError) throw fetchError;
        
        const currentBalance = userData.balance || 0;
        const newBalance = currentBalance + amount;
        
        // Actualizar balance
        const { error: updateError } = await supabase
            .from('users')
            .update({ balance: newBalance })
            .eq('id', userId);
        
        if (updateError) throw updateError;
        
        // Registrar transacción
        const transaction = {
            id: 'TX-' + Date.now(),
            type: amount >= 0 ? 'depósito' : 'retiro',
            amount: amount,
            date: new Date().toISOString(),
            concept: amount >= 0 ? 'Depósito' : 'Retiro'
        };
        
        const { error: txError } = await supabase
            .from('users')
            .update({
                transactions: supabase.sql`array_append(transactions, ${JSON.stringify(transaction)})`
            })
            .eq('id', userId);
        
        // Actualizar sesión local
        const session = JSON.parse(localStorage.getItem('yx_token'));
        if (session) {
            session.user.balance = newBalance;
            localStorage.setItem('yx_token', JSON.stringify(session));
            localStorage.setItem('yx_user', JSON.stringify(session.user));
            updateUserUI();
        }
        
        console.log(`💰 Balance actualizado: $${newBalance.toFixed(2)}`);
        return true;
    } catch (error) {
        console.error('❌ Error al actualizar balance:', error);
        showToast(error.message, 'error');
        return false;
    }
}

// ============ GUARDAR COMPRA ============
async function supabaseAddPurchase(userId, purchaseData) {
    try {
        const { error } = await supabase
            .from('users')
            .update({
                purchases: supabase.sql`array_append(purchases, ${JSON.stringify({
                    ...purchaseData,
                    purchaseDate: new Date().toISOString(),
                    id: 'purchase_' + Date.now()
                })})`
            })
            .eq('id', userId);
        
        if (error) throw error;
        
        // Actualizar sesión local
        const session = JSON.parse(localStorage.getItem('yx_token'));
        if (session) {
            if (!session.user.purchases) session.user.purchases = [];
            session.user.purchases.push({
                ...purchaseData,
                purchaseDate: new Date().toISOString(),
                id: 'purchase_' + Date.now()
            });
            localStorage.setItem('yx_token', JSON.stringify(session));
            localStorage.setItem('yx_user', JSON.stringify(session.user));
        }
        
        console.log('🃏 Compra registrada en Supabase');
        return true;
    } catch (error) {
        console.error('❌ Error al guardar compra:', error);
        return false;
    }
}

// ============ ACTUALIZAR PERFIL ============
async function supabaseUpdateProfile(userId, profileData) {
    try {
        // Obtener perfil actual
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('profile')
            .eq('id', userId)
            .single();
        
        if (fetchError) throw fetchError;
        
        const currentProfile = userData.profile || {};
        const newProfile = { ...currentProfile, ...profileData };
        
        const { error: updateError } = await supabase
            .from('users')
            .update({ profile: newProfile })
            .eq('id', userId);
        
        if (updateError) throw updateError;
        
        // Actualizar sesión local
        const session = JSON.parse(localStorage.getItem('yx_token'));
        if (session) {
            session.user.profile = newProfile;
            localStorage.setItem('yx_token', JSON.stringify(session));
            localStorage.setItem('yx_user', JSON.stringify(session.user));
            updateUserUI();
        }
        
        console.log('✅ Perfil actualizado en Supabase');
        return true;
    } catch (error) {
        console.error('❌ Error al actualizar perfil:', error);
        showToast(error.message, 'error');
        return false;
    }
}

// ============ OBTENER TODOS LOS USUARIOS ============
async function supabaseGetAllUsers() {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('❌ Error al obtener usuarios:', error);
        return [];
    }
}

// ============ VERIFICAR ADMIN ============
async function supabaseIsAdmin(email) {
    try {
        const { data, error } = await supabase
            .from('admins')
            .select('email')
            .eq('email', email)
            .single();
        
        if (error || !data) return false;
        return true;
    } catch (error) {
        return false;
    }
}

// ============ VERIFICAR ADMIN CON CLAVE ============
async function supabaseVerifyAdminKey(email, key) {
    try {
        const { data, error } = await supabase
            .from('admins')
            .select('key')
            .eq('email', email)
            .single();
        
        if (error || !data) return false;
        return data.key === key;
    } catch (error) {
        return false;
    }
}

// ============ VERIFICAR SESIÓN ============
function supabaseCheckSession() {
    const sessionData = localStorage.getItem('yx_token');
    if (!sessionData) return null;
    
    try {
        const session = JSON.parse(sessionData);
        if (Date.now() > session.expiresAt) {
            localStorage.removeItem('yx_token');
            localStorage.removeItem('yx_user');
            return null;
        }
        return session;
    } catch (e) {
        localStorage.removeItem('yx_token');
        localStorage.removeItem('yx_user');
        return null;
    }
}

// ============ OBTENER USUARIO ACTUAL ============
function supabaseGetCurrentUser() {
    const session = supabaseCheckSession();
    return session ? session.user : null;
}

// ============ ACTUALIZAR UI ============
function updateUserUI() {
    const user = supabaseGetCurrentUser();
    const balanceEl = document.getElementById('userBalance');
    const avatarEl = document.getElementById('userAvatarIcon');
    const nameEl = document.getElementById('userDisplayName');
    
    if (user) {
        if (balanceEl) balanceEl.textContent = `$${user.balance.toFixed(2)}`;
        if (avatarEl) avatarEl.textContent = 'account_circle';
        if (nameEl) nameEl.textContent = user.displayName || user.username || 'Usuario';
    } else {
        if (balanceEl) balanceEl.textContent = '$0.00';
        if (avatarEl) avatarEl.textContent = 'person';
        if (nameEl) nameEl.textContent = 'Invitado';
    }
}

// ============ EXPORTAR ============
window.supabaseRegister = supabaseRegister;
window.supabaseLogin = supabaseLogin;
window.supabaseLogout = supabaseLogout;
window.supabaseUpdateBalance = supabaseUpdateBalance;
window.supabaseAddPurchase = supabaseAddPurchase;
window.supabaseUpdateProfile = supabaseUpdateProfile;
window.supabaseGetAllUsers = supabaseGetAllUsers;
window.supabaseIsAdmin = supabaseIsAdmin;
window.supabaseVerifyAdminKey = supabaseVerifyAdminKey;
window.supabaseGetCurrentUser = supabaseGetCurrentUser;
window.supabaseCheckSession = supabaseCheckSession;
window.updateUserUI = updateUserUI;

console.log('🟢 Supabase Auth cargado correctamente');
