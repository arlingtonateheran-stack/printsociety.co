import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ynfcyfiavijqclxqayzr.supabase.co';
const supabaseKey = 'sb_publishable_fD6rh3Ffi5x7hqk6XOsX5w_8B_uZx6a';

export const supabase = createClient(supabaseUrl, supabaseKey);
