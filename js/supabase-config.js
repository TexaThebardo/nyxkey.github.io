// ============================================
// SUPABASE-CONFIG.JS - Configuración de Supabase
// ============================================

// ⚠️ REEMPLAZA CON TUS DATOS DE SUPABASE
const SUPABASE_CONFIG = {
    url: 'https://azsbdlaaviuudgolswua.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c2JkbGFhdml1dWRnb2xzd3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NTc3NDcsImV4cCI6MjEwMTUzMzc0N30.R2LTqDhbG368Ae-lOxyYWr09eZI1Dj1ARAvWAolrKX4'
};

// Inicializar Supabase
const supabase = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

console.log('🟢 Supabase inicializado correctamente');
