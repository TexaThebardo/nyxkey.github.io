// ============================================
// SUPABASE-CONFIG.JS - Configuración de Supabase
// ============================================

// ⚠️ REEMPLAZA CON TUS DATOS DE SUPABASE
const SUPABASE_CONFIG = {
    url: 'https://TU_PROJECT_ID.supabase.co',
    key: 'TU_ANON_PUBLIC_KEY'
};

// Inicializar Supabase
const supabase = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

console.log('🟢 Supabase inicializado correctamente');
