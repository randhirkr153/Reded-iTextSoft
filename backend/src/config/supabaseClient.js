const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://kfujkewqfrwgrlsofptl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your_supabase_anon_or_service_role_key'; // Replace in .env

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
