
import { useEffect, useState } from 'react';
import './Notas.css';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

const API_URL = 'http://localhost:8080/api/notas';

function Notas({ usuario }) {
  const [notas, setNotas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function obterHeaders() {
    if (!usuario) {
      throw new Error('Faça login para acessar suas notas.');
    }

    const token = await usuario.getIdToken();

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  }

  useEffect(() => {
    const controller = new AbortController();

    async function carregarNotas() {
      setCarregando(true);
      setErro('');

      try {
        const headers = await obterHeaders();

        const resposta = await fetch(API_URL, {
          headers,
          signal: controller.signal
        });

        if (!resposta.ok) {
          throw new Error(
            resposta.status === 401
              ? 'Sessão inválida. Entre novamente.'
              : 'Não foi possível carregar suas notas.'
          );
        }

        const dados = await resposta.json();
        setNotas(dados);
      } catch (erro) {
        if (erro.name !== 'AbortError') {
          setErro(erro.message || 'Erro ao conectar com o servidor.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    if (usuario) {
      carregarNotas();
    } else {
      setNotas([]);
      setCarregando(false);
    }

    return () => controller.abort();
  }, [usuario]);

  async function salvarNota(evento) {
    evento.preventDefault();
    setErro('');

    if (!titulo.trim() && !conteudo.trim()) return;

    try {
      const headers = await obterHeaders();
      const editandoNota = editando !== null;

      const dadosNota = {
        titulo: titulo.trim(),
        conteudo: conteudo.trim()
      };

      const resposta = await fetch(
        editandoNota ? `${API_URL}/${editando}` : API_URL,
        {
          method: editandoNota ? 'PUT' : 'POST',
          headers,
          body: JSON.stringify(dadosNota)
        }
      );

      if (!resposta.ok) {
        throw new Error(
          resposta.status === 401
            ? 'Sessão inválida. Entre novamente.'
            : 'Não foi possível salvar a nota.'
        );
      }

      const notaSalva = await resposta.json();

      if (editandoNota) {
        setNotas(atuais =>
          atuais.map(nota =>
            nota.id === notaSalva.id ? notaSalva : nota
          )
        );
      } else {
        setNotas(atuais => [notaSalva, ...atuais]);
      }

      limparFormulario();
    } catch (erro) {
      setErro(erro.message || 'Erro ao salvar a nota.');
    }
  }

  function editarNota(nota) {
    setTitulo(nota.titulo || '');
    setConteudo(nota.conteudo || '');
    setEditando(nota.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function excluirNota(id) {
    if (!window.confirm('Deseja excluir esta nota?')) return;

    setErro('');

    try {
      const headers = await obterHeaders();

      const resposta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!resposta.ok) {
        throw new Error(
          resposta.status === 401
            ? 'Sessão inválida. Entre novamente.'
            : 'Não foi possível excluir a nota.'
        );
      }

      setNotas(atuais => atuais.filter(nota => nota.id !== id));

      if (editando === id) {
        limparFormulario();
      }
    } catch (erro) {
      setErro(erro.message || 'Erro ao excluir a nota.');
    }
  }

  function limparFormulario() {
    setTitulo('');
    setConteudo('');
    setEditando(null);
  }

  const notasFiltradas = notas.filter(nota =>
    `${nota.titulo || ''} ${nota.conteudo || ''}`
      .toLowerCase()
      .includes(pesquisa.toLowerCase())
  );

  if (!usuario) {
    return (
      <main className="notas-app">
        <p>Entre na sua conta para acessar suas notas.</p>
      </main>
    );
  }

  return (
    <main className="notas-app">
      <header className="notas-header">
        <div>
          <span className="notas-logo">Dev2Life</span>
          <h1>Meu bloco de notas</h1>
          <p>Suas ideias, organizadas em um só lugar.</p>
        </div>
           <button
        className="btn-sair"
        onClick={() => signOut(auth)}
      >
        Sair da conta
      </button>

        <span className="notas-contador">
          {notas.length} {notas.length === 1 ? 'nota' : 'notas'}
        </span>
      </header>

      {erro && (
        <p role="alert" className="notas-erro">
          {erro}
        </p>
      )}

      <form className="nota-form" onSubmit={salvarNota}>
        <h2>{editando !== null ? 'Editar nota' : 'Nova nota'}</h2>

        <input
          type="text"
          placeholder="Título da nota"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          maxLength={100}
        />

        <textarea
          placeholder="Escreva suas ideias aqui..."
          value={conteudo}
          onChange={e => setConteudo(e.target.value)}
          rows={5}
        />

        <div className="nota-acoes">
          {editando !== null && (
            <button
              type="button"
              className="nota-cancelar"
              onClick={limparFormulario}
            >
              Cancelar
            </button>
          )}

          <button type="submit" className="nota-salvar">
            {editando !== null ? 'Salvar alterações' : 'Adicionar nota'}
          </button>
        </div>
      </form>

      <section className="notas-lista">
        <div className="notas-lista-topo">
          <h2>Suas notas</h2>

          <input
            className="notas-pesquisa"
            type="search"
            placeholder="Pesquisar notas..."
            value={pesquisa}
            onChange={e => setPesquisa(e.target.value)}
          />
        </div>

        {carregando ? (
          <div className="notas-vazio">
            <p>Carregando suas notas...</p>
          </div>
        ) : notasFiltradas.length === 0 ? (
          <div className="notas-vazio">
            <h3>
              {pesquisa
                ? 'Nenhuma nota encontrada'
                : 'Seu espaço está vazio'}
            </h3>
            <p>
              {pesquisa
                ? 'Experimente pesquisar por outras palavras.'
                : 'Crie sua primeira nota usando o formulário acima.'}
            </p>
          </div>
        ) : (
          <div className="notas-grid">
            {notasFiltradas.map(nota => (
              <article className="nota-card" key={nota.id}>
                <h3>{nota.titulo || 'Sem título'}</h3>
                <p className="nota-conteudo">
                  {nota.conteudo || 'Sem conteúdo.'}
                </p>
                <span className="nota-data">
                  {nota.data || 'Nota salva'}
                </span>

                <div className="nota-card-acoes">
                  <button type="button" onClick={() => editarNota(nota)}>
                    Editar
                  </button>

                  <button
                    type="button"
                    className="nota-excluir"
                    onClick={() => excluirNota(nota.id)}
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Notas;
