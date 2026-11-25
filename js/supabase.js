
export const SUPABASE_URL = 'https://bntwszbddppqatjjibsh.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_nJ7NMx8j1D8P_qiXr6jwOA_Q_ZwAxSa';

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

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
