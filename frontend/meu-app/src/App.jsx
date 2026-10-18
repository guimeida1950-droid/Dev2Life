
import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';

import { auth, googleProvider } from './firebase';
import './App.css';
import Notas from './Notas.jsx';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [modo, setModo] = useState('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, setUsuario);
  }, []);

  function traduzirErro(error) {
    const erros = {
      'auth/invalid-email': 'Digite um e-mail válido.',
      'auth/user-not-found': 'Conta não encontrada.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/invalid-credential': 'E-mail ou senha incorretos.',
      'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
      'auth/weak-password': 'Use uma senha com pelo menos 6 caracteres.',
      'auth/popup-closed-by-user': 'Você fechou a janela de login.',
      'auth/popup-blocked': 'Permita pop-ups para entrar com Google.',
      'auth/unauthorized-domain': 'Este domínio não está autorizado no Firebase.',
      'auth/operation-not-allowed': 'Ative este método de login no Firebase.'
    };

    return erros[error.code] || 'Não foi possível concluir. Tente novamente.';
  }

  async function entrarGoogle() {
    setErro('');
    setMensagem('');
    setCarregando(true);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setErro(traduzirErro(error));
    } finally {
      setCarregando(false);
    }
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    setErro('');
    setMensagem('');
    setCarregando(true);

    try {
      if (modo === 'cadastro') {
        await createUserWithEmailAndPassword(auth, email, senha);
      } else if (modo === 'login') {
        await signInWithEmailAndPassword(auth, email, senha);
      } else {
        await sendPasswordResetEmail(auth, email);
        setMensagem('Enviamos as instruções de recuperação para seu e-mail.');
      }
    } catch (error) {
      setErro(traduzirErro(error));
    } finally {
      setCarregando(false);
    }
  }

  async function sair() {
    await signOut(auth);
    setSenha('');
  }

  function mudarModo(novoModo) {
    setModo(novoModo);
    setErro('');
    setMensagem('');
    setSenha('');
  }

  if (usuario) {
  return (
    <>
      <Notas usuario={usuario} />
   
    </>
  );
}

  return (
    <main className="auth-page">
      <section className="auth-layout">
        <div className="form-panel">
          <header className="topbar">
            <Logo />
            <span className="topbar-note">
              {modo === 'cadastro' ? 'Junte-se a nós' : 'Sua jornada começa aqui'}
            </span>
            
          </header>

          <div className="form-content">
            <span className="eyebrow">DEV2LIFE / SUA EVOLUÇÃO</span>

            <h1>
              {modo === 'login' && <>Bem-vindo </>}
              {modo === 'cadastro' && <>Crie sua <span>conta.</span></>}
              {modo === 'recuperar' && <>Recupere seu <span>acesso.</span></>}
            </h1>

            <p className="subtitle">
              {modo === 'login' && 'Entre para continuar sua jornada de aprendizado.'}
              {modo === 'cadastro' && 'Comece a construir o futuro que você deseja.'}
              {modo === 'recuperar' && 'Enviaremos um link para redefinir sua senha.'}
            </p>

            {modo !== 'recuperar' && (
              <>
                <button
                  className="google-button"
                  type="button"
                  onClick={entrarGoogle}
                  disabled={carregando}
                >
                  <GoogleIcon />
                  {carregando ? 'Aguarde...' : 'Continuar com Google'}
                </button>

                <div className="separator"><span>ou continue com e-mail</span></div>
              </>
            )}

            <form onSubmit={enviarFormulario}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="voce@exemplo.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {modo !== 'recuperar' && (
                <>
                  <div className="password-label">
                    <label htmlFor="senha">Senha</label>
                    {modo === 'login' && (
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => mudarModo('recuperar')}
                      >
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>

                  <div className="password-wrapper">
                    <input
                      id="senha"
                      type={mostrarSenha ? 'text' : 'password'}
                      placeholder="Mínimo de 6 caracteres"
                      autoComplete={modo === 'cadastro' ? 'new-password' : 'current-password'}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="show-password"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </>
              )}

              {erro && <p className="feedback error">{erro}</p>}
              {mensagem && <p className="feedback success">{mensagem}</p>}

              <button
                className="primary-button"
                type="submit"
                disabled={carregando}
              >
                {carregando
                  ? 'Processando...'
                  : modo === 'login'
                    ? 'Entrar na conta →'
                    : modo === 'cadastro'
                      ? 'Criar minha conta →'
                      : 'Enviar link de recuperação →'}
              </button>
            </form>

            <div className="switch-mode">
              {modo === 'login' && (
                <>Ainda não tem conta?{' '}
                  <button onClick={() => mudarModo('cadastro')}>Cadastre-se</button>
                </>
              )}

              {modo === 'cadastro' && (
                <>Já tem uma conta?{' '}
                  <button onClick={() => mudarModo('login')}>Entrar</button>
                </>
              )}

              {modo === 'recuperar' && (
                <button onClick={() => mudarModo('login')}>← Voltar para o login</button>
              )}
            </div>
          </div>

          <footer className="form-footer">
            <span className="footer-mark">D</span>
            <div>
              <strong>Aprenda. Construa. Evolua.</strong>
              <p>Seu próximo capítulo começa agora.</p>
            </div>
          </footer>
        </div>

        <aside className="hero-panel">
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-tag">EVOLUA TODOS OS DIAS</span>
            <h2>Grandes metas começam com <span>o primeiro passo.</span></h2>
            <p>Desenvolva habilidades, conecte-se com outros programadores e transforme conhecimento em projetos reais.</p>

            <div className="feature-list">
              <Feature icon="⌘" title="Aprendizado contínuo" description="Aprenda no seu ritmo." />
              <Feature icon="◎" title="Comunidade" description="Troque ideias e evolua junto." />
              <Feature icon="↗" title="Projetos reais" description="Transforme teoria em prática." />
            </div>

            <p className="hero-quote">Disciplina hoje.<br />Liberdade amanhã.</p>
          </div>
          <span className="hero-signature">DEV2LIFE — BUILD YOUR FUTURE</span>
        </aside>
      </section>
    </main>
  );
}

function Logo() {
  return (
    <div className="brand">
      <span className="brand-symbol">D</span>
      <span>Dev<span>2</span>Life</span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="google-icon">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" transform="translate(0 4)"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.73 6C44.42 37.95 46.98 31.86 46.98 24.55z" transform="translate(0 0)"/>
      <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19z" transform="translate(0 0)"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" transform="translate(0 -4)"/>
    </svg>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="feature">
      <span className="feature-icon">{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default App;
