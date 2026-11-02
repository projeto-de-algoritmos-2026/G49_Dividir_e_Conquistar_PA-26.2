import "../layout";
import { htmlPlayer, ligarPlayer } from "../componentes/widgets";
import { carregarUsuarios, usuarioAtual } from "../dados/banco";
import {
  alternarCurtida,
  carregarCurtidas,
  carregarPosts,
  publicarPost,
  type Post,
} from "../dados/social";
import { escapeHtml } from "../html";
import type { Usuario } from "../tipos";

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("Elemento #app não encontrado no DOM");

const usuarios: Usuario[] = carregarUsuarios();
const voce = usuarioAtual(usuarios);

const autorDaUrl = new URLSearchParams(location.search).get("autor");
let autorSelecionado: number | null = usuarios.some((u) => String(u.id) === autorDaUrl)
  ? Number(autorDaUrl)
  : null;

function nomeDe(id: number): string {
  return usuarios.find((u) => u.id === id)?.nome ?? "Alguém";
}

function htmlPost(post: Post, curtidas: string[]): string {
  const curtido = curtidas.includes(post.id);
  return `
    <article class="caixa post" id="${escapeHtml(post.id)}">
      <h2 class="caixa-titulo">${escapeHtml(post.titulo)}</h2>
      <div class="caixa-corpo">
        <p class="post-meta">
          por <a href="/pessoa.html?id=${post.autorId}"><strong>${escapeHtml(nomeDe(post.autorId))}</strong></a>
          em ${escapeHtml(post.data)}
        </p>
        <p class="post-texto">${escapeHtml(post.texto)}</p>
        <p class="post-estado">
          <span>humor: <strong>${escapeHtml(post.humor)}</strong></span>
          ${post.ouvindo ? `<span>ouvindo: <strong>♪ ${escapeHtml(post.ouvindo)}</strong></span>` : ""}
        </p>
        <button type="button" class="botao-curtir ${curtido ? "curtido" : ""}" data-curtir="${escapeHtml(post.id)}" aria-pressed="${curtido}">
          ♥ ${post.curtidas + (curtido ? 1 : 0)}
        </button>
        ${
          post.comentarios.length
            ? `<ul class="comentarios">
                ${post.comentarios
                  .map(
                    (c) => `<li><a href="/pessoa.html?id=${c.autorId}"><strong>${escapeHtml(nomeDe(c.autorId))}</strong></a>: ${escapeHtml(c.texto)}</li>`,
                  )
                  .join("")}
              </ul>`
            : ""
        }
      </div>
    </article>
  `;
}

function desenharPosts(): void {
  const curtidas = carregarCurtidas();
  const posts = carregarPosts().filter((p) => autorSelecionado === null || p.autorId === autorSelecionado);

  document.querySelector("#lista-posts")!.innerHTML = posts.length
    ? posts.map((p) => htmlPost(p, curtidas)).join("")
    : `<p class="aviso">${escapeHtml(nomeDe(autorSelecionado ?? voce.id))} ainda não escreveu nada.</p>`;

  document.querySelectorAll<HTMLButtonElement>("[data-autor]").forEach((botao) => {
    const ativo = botao.dataset.autor === String(autorSelecionado ?? "");
    botao.classList.toggle("ativo", ativo);
    botao.setAttribute("aria-pressed", String(ativo));
  });
}

app.innerHTML = `
  <div class="grade-lateral">
    <div class="coluna-principal">
      <section class="caixa">
        <h2 class="caixa-titulo">Escrever no meu blog</h2>
        <div class="caixa-corpo">
          <form id="form-post">
            <div class="campo">
              <label for="post-titulo">Título:</label>
              <input type="text" id="post-titulo" maxlength="80" required />
            </div>
            <div class="campo">
              <label for="post-texto">O que aconteceu hoje?</label>
              <textarea id="post-texto" rows="3" maxlength="600" required></textarea>
            </div>
            <div class="campo">
              <label for="post-humor">Humor:</label>
              <select id="post-humor">
                <option>feliz</option>
                <option>com sono</option>
                <option>nostálgico</option>
                <option>apaixonado</option>
                <option>em semana de provas</option>
              </select>
            </div>
            <button type="submit" class="botao botao-dourado">Publicar</button>
          </form>
        </div>
      </section>
      <div id="lista-posts"></div>
    </div>

    <aside class="coluna-lateral">
      <section class="caixa">
        <h2 class="caixa-titulo">Blogueiros</h2>
        <div class="caixa-corpo filtros-autor">
          <button type="button" data-autor="">Todo mundo</button>
          ${usuarios.map((u) => `<button type="button" data-autor="${u.id}">${escapeHtml(u.nome)}</button>`).join("")}
        </div>
      </section>
      ${htmlPlayer()}
    </aside>
  </div>
`;

desenharPosts();
ligarPlayer();
if (location.hash) document.querySelector(location.hash)?.scrollIntoView();

document.querySelector("#lista-posts")!.addEventListener("click", (e) => {
  const id = (e.target as HTMLElement).closest<HTMLElement>("[data-curtir]")?.dataset.curtir;
  if (!id) return;
  alternarCurtida(id);
  desenharPosts();
  document.querySelector<HTMLButtonElement>(`[data-curtir="${id}"]`)?.focus();
});

document.querySelector(".filtros-autor")!.addEventListener("click", (e) => {
  const botao = (e.target as HTMLElement).closest<HTMLElement>("[data-autor]");
  if (!botao) return;
  autorSelecionado = botao.dataset.autor ? Number(botao.dataset.autor) : null;
  desenharPosts();
});

document.querySelector("#form-post")!.addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = document.querySelector<HTMLInputElement>("#post-titulo")!;
  const texto = document.querySelector<HTMLTextAreaElement>("#post-texto")!;
  const humor = document.querySelector<HTMLSelectElement>("#post-humor")!;
  if (!titulo.value.trim() || !texto.value.trim()) return;

  const agora = new Date();
  publicarPost({
    id: `u${agora.getTime()}`,
    autorId: voce.id,
    titulo: titulo.value.trim(),
    texto: texto.value.trim(),
    data: agora.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
    humor: humor.value,
    curtidas: 0,
    comentarios: [],
  });
  titulo.value = "";
  texto.value = "";
  autorSelecionado = null;
  desenharPosts();
});
