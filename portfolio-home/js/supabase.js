// Configuração centralizada do Supabase.
// Quando quiser, troque apenas estas duas constantes pelos dados do seu projeto.
export const SUPABASE_URL = 'https://hjuscxfnsigrjbemmgqs.supabase.co';
// Use apenas a chave "publishable"/"anon" aqui. NUNCA a "service_role".
export const SUPABASE_ANON_KEY = 'sb_publishable_ISScGeHISLRCRqqOlVI3rA_mBKko7CU';

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// "Lembrar de mim": true = localStorage (continua logado ao fechar o navegador);
// false = sessionStorage (sessão Some quando a aba/navegador fecha).
let lembrarDeMim = true;

export function definirLembrar(lembrar) {
  lembrarDeMim = Boolean(lembrar);
}

function storageAlvo() {
  return lembrarDeMim ? window.localStorage : window.sessionStorage;
}

const storageSupabase = {
  getItem(chave) {
    const atual = storageAlvo().getItem(chave);
    if (atual !== null) return atual;
    // Não perde uma sessão já existente enquanto o usuário não escolhe.
    return window.localStorage.getItem(chave) ?? window.sessionStorage.getItem(chave);
  },
  setItem(chave, valor) {
    window.localStorage.removeItem(chave);
    window.sessionStorage.removeItem(chave);
    storageAlvo().setItem(chave, valor);
  },
  removeItem(chave) {
    window.localStorage.removeItem(chave);
    window.sessionStorage.removeItem(chave);
  }
};

// Evita que o login fique carregando para sempre se o projeto estiver pausado/sem rede.
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: storageSupabase
  },
  global: {
    fetch: fetchWithTimeout
  }
});
