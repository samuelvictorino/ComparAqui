import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function searchProducts(query) {
  const { data, error } = await supabase
    .from('products')
    .select()
    .ilike('name', `%${query}%`);

  if (error) throw error;
  return data;
}
