import dotenv from 'dotenv';

/**
 * Carrega as variáveis de ambiente do arquivo .env.
 * @returns {object} Um objeto contendo as variáveis de ambiente.
 * @throws {Error} Se alguma variável de ambiente obrigatória estiver faltando.
 */
export const loadSecrets = async () => {
  dotenv.config();

  const requiredSecrets = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missingSecrets = requiredSecrets.filter((secret) => !process.env[secret]);

  if (missingSecrets.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missingSecrets.join(', ')}`);
  }

  return {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    // ... outras variáveis
  };
};
