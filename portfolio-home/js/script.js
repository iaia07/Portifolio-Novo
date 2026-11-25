import { supabase, definirLembrar } from './supabase.js';

const REDIRECT_URL = './home.html';
const RETRY_DELAYS_MS = [0, 400, 800];

const form = document.getElementById('loginForm');
const botao = document.getElementById('loginBtn');
const textoBotao = document.getElementById('loginBtnText');
const mensagem = document.getElementById('mensagem');

function definirMensagem(texto, tipo = 'info') {
  if (!mensagem) return;
  mensagem.textContent = texto;
  mensagem.className = `form-message is-${tipo}`;
}

function definirCarregando(carregando) {
  if (!botao) return;
  botao.disabled = carregando;
  botao.setAttribute('aria-busy', String(carregando));
  if (textoBotao) textoBotao.textContent = carregando ? 'Entrando...' : 'Entrar';
}

function podeTentarNovamente(erro) {
  const status = erro?.status ?? erro?.statusCode ?? 0;
  const texto = String(erro?.message ?? erro ?? '').toLowerCase();

  return (
    status === 0 ||
    status === 429 ||
    status >= 500 ||
    /fetch|network|timeout|abort|temporar|unavailable|service/.test(texto)
  );
}

async function entrarComRetentativa(email, senha) {
  let ultimoErro = null;

  for (const atraso of RETRY_DELAYS_MS) {
    if (atraso) await new Promise((resolve) => setTimeout(resolve, atraso));

    try {
      const resultado = await supabase.auth.signInWithPassword({
        email,
        password: senha
      });

      if (!resultado.error) return resultado;

      ultimoErro = resultado.error;
      if (!podeTentarNovamente(resultado.error)) return resultado;
    } catch (erro) {
      ultimoErro = erro;
      if (!podeTentarNovamente(erro)) return { data: null, error: erro };
    }
  }

  return { data: null, error: ultimoErro };
}

async function entrar(event) {
  event.preventDefault();

  const email = document.getElementById('usuario')?.value.trim() ?? '';
  const senha = document.getElementById('senha')?.value ?? '';

  if (!email || !senha) {
    definirMensagem('Preencha o e-mail e a senha.', 'error');
    return;
  }

  definirLembrar(document.querySelector('input[name="lembrar"]')?.checked ?? false);

  definirCarregando(true);
  definirMensagem('Verificando dados...', 'info');

  const { error } = await entrarComRetentativa(email, senha);

  if (error) {
    definirCarregando(false);

    const semConexao = error.status === 0 || /fetch|network|timeout|abort/i.test(String(error.message ?? ''));
    definirMensagem(
      semConexao
        ? 'Não foi possível conectar ao Supabase. Tente novamente em instantes.'
        : 'E-mail ou senha incorretos.',
      'error'
    );
    return;
  }

  definirMensagem('Login realizado! Redirecionando...', 'success');
  setTimeout(() => window.location.assign(REDIRECT_URL), 500);
}

if (form) {
  form.addEventListener('submit', entrar);
}
