import { createClient } from '@supabase/supabase-js';
import { loadSecrets } from '../utils/secrets';

/**
 * Inicializa o cliente Supabase com as credenciais.
 * @returns {Promise<SupabaseClient>} O cliente Supabase inicializado.
 */
export const initSupabase = async () => {
  const secrets = await loadSecrets();
  return createClient(secrets.SUPABASE_URL, secrets.SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    db: {
      schema: 'public',
    },
  });
};
