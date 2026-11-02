import "../layout";
import { distancia, paraPonto } from "../algoritmo/geo";
import { spriteBichinho } from "../componentes/sprites";
import { carregarUsuarios, usuarioAtual } from "../dados/banco";
import { carregarBichinho, humorDoBichinho } from "../dados/bichinhos";
import {
  NOMES_STATUS,
  carregarPosts,
  carregarRecados,
  deixarRecado,
  perfilSocial,
  type Recado,
} from "../dados/social";
import { escapeHtml } from "../html";
import type { Usuario } from "../tipos";

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("Elemento #app não encontrado no DOM");

const usuarios: Usuario[] = carregarUsuarios();
const voce = usuarioAtual(usuarios);
const pessoa = usuarios.find((u) => String(u.id) === new URLSearchParams(location.search).get("id"));

function nomeDe(id: number): string {
  return usuarios.find((u) => u.id === id)?.nome ?? "Alguém";
}

function icones(simbolo: string, nota: number): string {
  return `<span aria-label="${nota} de 3">${simbolo.repeat(nota)}<span class="karma-vazio">${simbolo.repeat(3 - nota)}</span></span>`;
}

function htmlRecados(lista: Recado[]): string {
  if (lista.length === 0) return `<p class="campo-ajuda">Ninguém deixou recado ainda. Seja a primeira pessoa!</p>`;
  return lista
    .map(
      (r) => `
        <li class="recado">
          <p class="recado-topo">
            <a href="/pessoa.html?id=${r.autorId}"><strong>${escapeHtml(nomeDe(r.autorId))}</strong></a>
            <small>${escapeHtml(r.data)}</small>
          </p>
          <p>${escapeHtml(r.texto)}</p>
        </li>
      `,
    )
    .join("");
}

function renderizar(p: Usuario): void {
  const social = perfilSocial(p.id);
  const meuBichinho = p.ehVoce ? carregarBichinho() : null;
  const bichinho = meuBichinho ?? social.bichinho;
  const humorBichinho = meuBichinho ? humorDoBichinho(meuBichinho) : social.bichinho.humor;
  const km = distancia(paraPonto(voce), paraPonto(p));
  const posts = carregarPosts().filter((post) => post.autorId === p.id);
  const amigos = usuarios.filter((u) => u.id !== p.id);

  document.title = `pertinho — ${p.nome}`;

  app!.innerHTML = `
    <div class="grade-pessoa">
      <aside>
        <section class="caixa">
          <h2 class="caixa-titulo">${escapeHtml(p.nome)}</h2>
          <div class="caixa-corpo pessoa-cartao">
            <div class="avatar avatar-grande ${p.ehVoce ? "avatar-voce" : ""}">${escapeHtml(p.nome[0] ?? "?")}</div>
            <p class="selo">${escapeHtml(p.cidade)}</p>
            <p class="pessoa-status">
              <span class="bolinha bolinha-${social.status}" aria-hidden="true"></span>
              ${NOMES_STATUS[social.status]}
            </p>
            ${
              p.ehVoce
                ? `<a class="botao botao-dourado" href="/perfil.html">✏️ Editar perfil</a>`
                : `<p class="campo-ajuda">A ${km.toFixed(1)} km de você</p>
                   <button type="button" class="botao" id="chamar-atencao">⚡ Chamar a atenção</button>
                   <p class="campo-ajuda" id="retorno-atencao" aria-live="polite"></p>`
            }
          </div>
        </section>

        <section class="caixa">
          <h2 class="caixa-titulo">Bichinho</h2>
          <div class="caixa-corpo pessoa-cartao">
            <button type="button" class="pet-carinho" id="fazer-carinho" title="Fazer carinho">
              ${spriteBichinho(bichinho.especie, 84, `Bichinho ${bichinho.nome}`)}
            </button>
            <p class="pet-nome">${escapeHtml(bichinho.nome)}</p>
            <p class="pet-humor">${escapeHtml(humorBichinho)}</p>
            <p class="campo-ajuda">Clique para fazer carinho.</p>
          </div>
        </section>
      </aside>

      <div class="coluna-principal">
        <section class="caixa">
          <h2 class="caixa-titulo">Sobre</h2>
          <div class="caixa-corpo">
            <p class="pessoa-bio">${escapeHtml(p.bio)}</p>
            <dl class="pessoa-dados">
              <dt>Humor</dt><dd>${escapeHtml(social.humor)}</dd>
              <dt>Ouvindo</dt><dd>♪ ${escapeHtml(social.ouvindo)}</dd>
              <dt>Interesses</dt><dd>${social.interesses.map(escapeHtml).join(", ")}</dd>
              <dt>Fãs</dt><dd>${social.fas}</dd>
              <dt>Confiável</dt><dd class="karma">${icones("☺", social.confiavel)}</dd>
              <dt>Legal</dt><dd class="karma">${icones("★", social.legal)}</dd>
            </dl>
          </div>
        </section>

        <section class="caixa">
          <h2 class="caixa-titulo">Recados</h2>
          <div class="caixa-corpo">
            <form id="form-recado" class="form-recado">
              <div class="campo">
                <label for="campo-recado">Deixe um recado para ${escapeHtml(p.ehVoce ? "você mesmo" : p.nome)}:</label>
                <textarea id="campo-recado" rows="2" maxlength="200" required></textarea>
              </div>
              <button type="submit" class="botao botao-dourado">Enviar recado</button>
            </form>
            <ul class="recados" id="lista-recados">${htmlRecados(carregarRecados(p.id))}</ul>
          </div>
        </section>

        <section class="caixa">
          <h2 class="caixa-titulo">Posts no blog (${posts.length})</h2>
          <div class="caixa-corpo">
            ${
              posts.length
                ? `<ul class="lista">${posts
                    .map((post) => `<li><a href="/blog.html?autor=${p.id}#${post.id}">${escapeHtml(post.titulo)}</a> <small>${escapeHtml(post.data)}</small></li>`)
                    .join("")}</ul>`
                : `<p class="campo-ajuda">Nada por aqui ainda.</p>`
            }
          </div>
        </section>

        <section class="caixa">
          <h2 class="caixa-titulo">Amigos (${amigos.length})</h2>
          <div class="caixa-corpo grade-amigos">
            ${amigos
              .map(
                (a) => `
                  <a class="amigo-foto" href="/pessoa.html?id=${a.id}">
                    <span class="avatar ${a.ehVoce ? "avatar-voce" : ""}">${escapeHtml(a.nome[0] ?? "?")}</span>
                    ${escapeHtml(a.nome)}
                  </a>
                `,
              )
              .join("")}
          </div>
        </section>
      </div>
    </div>
  `;

  document.querySelector("#form-recado")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const campo = document.querySelector<HTMLTextAreaElement>("#campo-recado")!;
    const texto = campo.value.trim();
    if (!texto) return;

    deixarRecado({
      paraId: p.id,
      autorId: voce.id,
      texto,
      data: new Date().toLocaleDateString("pt-BR"),
    });
    campo.value = "";
    document.querySelector("#lista-recados")!.innerHTML = htmlRecados(carregarRecados(p.id));
  });

  document.querySelector("#chamar-atencao")?.addEventListener("click", () => {
    const conteudo = document.querySelector<HTMLElement>(".conteudo");
    conteudo?.classList.remove("tremendo");
    void conteudo?.offsetWidth; // reinicia a animação em cliques seguidos
    conteudo?.classList.add("tremendo");
    document.querySelector("#retorno-atencao")!.textContent = `Você chamou a atenção de ${p.nome}!`;
  });

  document.querySelector<HTMLElement>("#fazer-carinho")?.addEventListener("click", (e) => {
    const botao = e.currentTarget as HTMLElement;
    const coracao = document.createElement("span");
    coracao.className = "coracao-carinho";
    coracao.textContent = "♥";
    coracao.setAttribute("aria-hidden", "true");
    coracao.addEventListener("animationend", () => coracao.remove());
    botao.append(coracao);
  });
}

if (pessoa) {
  renderizar(pessoa);
} else {
  app.innerHTML = `
    <section class="caixa">
      <h2 class="caixa-titulo">Perfil não encontrado</h2>
      <div class="caixa-corpo">
        <p class="aviso">Essa pessoa não está na rede. <a href="/">Voltar ao menu</a></p>
      </div>
    </section>
  `;
}
