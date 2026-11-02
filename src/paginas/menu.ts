import "../layout";
import { calcularMatch } from "../algoritmo/match";
import { htmlListaDeAmigos, htmlPlayer, ligarPlayer } from "../componentes/widgets";
import { htmlPlanoPontos, ligarPlanoPontos } from "../componentes/planoPontos";
import { spriteBichinho } from "../componentes/sprites";
import { carregarUsuarios } from "../dados/banco";
import { carregarBichinho } from "../dados/bichinhos";
import { perfilSocial } from "../dados/social";
import { escapeHtml } from "../html";
import type { Usuario } from "../tipos";

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("Elemento #app não encontrado no DOM");

const usuarios: Usuario[] = carregarUsuarios();
const voce = usuarios.find((u) => u.ehVoce);
const match = calcularMatch(usuarios);

let htmlMatch = "";

if (match) {
  const { usuarioA: userA, usuarioB: userB, parceiro } = match;

  htmlMatch = `
    <div class="match-box">
      <div class="match-resultado">
        <div class="match-par">
          <div class="match-pessoa">
            <div class="avatar ${userA.ehVoce ? "avatar-voce" : ""}">${escapeHtml(userA.nome[0] ?? "?")}</div>
            <span class="match-nome">${escapeHtml(userA.nome)}</span>
          </div>
          <span class="match-coracao" title="Match mais próximo">♥</span>
          <div class="match-pessoa">
            <div class="avatar ${userB.ehVoce ? "avatar-voce" : ""}">${escapeHtml(userB.nome[0] ?? "?")}</div>
            <span class="match-nome">${escapeHtml(userB.nome)}</span>
          </div>
          <div class="match-texto-destaque">
            ${
              parceiro
                ? `<strong>${escapeHtml(parceiro.nome)} está mais perto de você!</strong><br />${escapeHtml(parceiro.cidade)}: vocês são o par mais próximo da rede.`
                : `<strong>${escapeHtml(userA.nome)} e ${escapeHtml(userB.nome)} são os mais próximos</strong><br />${escapeHtml(userA.cidade)} e ${escapeHtml(userB.cidade)}.`
            }
          </div>
        </div>
        <div>
          <span class="match-distancia-tag">${match.distancia.toFixed(1)} km</span>
        </div>
      </div>

      ${
        !parceiro
          ? `<p class="aviso" style="margin: var(--esp-2) 0 0;">
              Dica: você está em <strong>${escapeHtml(voce?.cidade ?? "sua cidade")}</strong>.
              Edite sua localização no seu perfil para ver se você entra no par mais próximo!
            </p>`
          : ""
      }

      <p class="match-como"><a href="/algoritmo.html">Como isso foi calculado? Compare com a força bruta →</a></p>

      ${htmlPlanoPontos(match, usuarios)}
    </div>
  `;
} else {
  htmlMatch = `<p class="aviso">Não há usuários suficientes para encontrar o par mais próximo.</p>`;
}

function renderizarCard(u: Usuario): string {
  const inicial = u.nome[0] ?? "?";
  const bichinho = u.ehVoce ? carregarBichinho() : perfilSocial(u.id).bichinho;

  return `
    <article class="card-usuario ${u.ehVoce ? "card-voce" : ""}">
      <div class="avatar ${u.ehVoce ? "avatar-voce" : ""}" aria-label="Avatar de ${escapeHtml(u.nome)}">
        ${escapeHtml(inicial)}
      </div>
      <div class="card-info">
        <div class="card-cabecalho">
          <h3 class="card-nome">
            <a href="/pessoa.html?id=${u.id}">${escapeHtml(u.nome)}</a>
            ${u.ehVoce ? '<span class="selo-voce">Você</span>' : ""}
          </h3>
          <span class="selo">${escapeHtml(u.cidade)}</span>
        </div>
        <p class="card-bio">${escapeHtml(u.bio)}</p>
        <p class="card-bichinho">
          ${spriteBichinho(bichinho.especie, 24, "")}
          <span>${escapeHtml(bichinho.nome)}</span>
        </p>
        <div class="card-rodape">
          <span>${u.latitude.toFixed(2)}°, ${u.longitude.toFixed(2)}°</span>
          ${
            u.ehVoce
              ? `<a class="link-editar" href="/perfil.html" title="Editar seus dados de perfil">✏️ Editar perfil</a>`
              : ""
          }
        </div>
      </div>
    </article>
  `;
}

app.innerHTML = `
  <div class="grade-lateral">
    <div class="coluna-principal">
      <section class="caixa" id="area-match">
        <h2 class="caixa-titulo">Quem está mais perto de você?</h2>
        <div class="caixa-corpo">
          ${htmlMatch}
        </div>
      </section>

      <section class="caixa">
        <h2 class="caixa-titulo">Pessoas na rede pertinho (${usuarios.length})</h2>
        <div class="caixa-corpo">
          <div class="grade-cards">
            ${usuarios.map(renderizarCard).join("")}
          </div>
        </div>
      </section>
    </div>

    <aside class="coluna-lateral">
      ${htmlListaDeAmigos(usuarios)}
      ${htmlPlayer()}
    </aside>
  </div>
`;

ligarPlayer();
ligarPlanoPontos();
