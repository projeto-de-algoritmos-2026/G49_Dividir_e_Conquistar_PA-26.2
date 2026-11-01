import "../layout";
import { parMaisProximo } from "../algoritmo/parMaisProximo";
import { paraPonto } from "../algoritmo/geo";
import { carregarUsuarios } from "../dados/banco";
import type { Usuario } from "../tipos";

function escapeHtml(texto: string): string {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("Elemento #app não encontrado no DOM");

const usuarios: Usuario[] = carregarUsuarios();
const voce = usuarios.find((u) => u.ehVoce);
const resultado = parMaisProximo(usuarios.map(paraPonto));

let htmlMatch = "";

if (resultado) {
  const userA = usuarios.find((u) => u.id === resultado.a.id);
  const userB = usuarios.find((u) => u.id === resultado.b.id);

  if (userA && userB) {
    const voceNoMatch = userA.ehVoce || userB.ehVoce;
    const parceiro = userA.ehVoce ? userB : userB.ehVoce ? userA : null;

    htmlMatch = `
      <div class="match-box">
        <div class="match-resultado">
          <div class="match-par">
            <div class="avatar ${userA.ehVoce ? "avatar-voce" : ""}">${escapeHtml(userA.nome[0] ?? "?")}</div>
            <span class="match-coracao" title="Match mais próximo">♥</span>
            <div class="avatar ${userB.ehVoce ? "avatar-voce" : ""}">${escapeHtml(userB.nome[0] ?? "?")}</div>
            <div class="match-texto-destaque">
              ${
                voceNoMatch && parceiro
                  ? `<strong>É um match com você!</strong><br />Você e <strong>${escapeHtml(parceiro.nome)}</strong> (${escapeHtml(parceiro.cidade)}) são o par mais próximo da rede.`
                  : `<strong>Par mais próximo da rede:</strong><br /><strong>${escapeHtml(userA.nome)}</strong> (${escapeHtml(userA.cidade)}) e <strong>${escapeHtml(userB.nome)}</strong> (${escapeHtml(userB.cidade)}).`
              }
            </div>
          </div>
          <div>
            <span class="match-distancia-tag">${resultado.distancia.toFixed(1)} km</span>
          </div>
        </div>

        ${
          !voceNoMatch
            ? `<p class="aviso" style="margin: var(--esp-2) 0 0;">
                Dica: você está em <strong>${escapeHtml(voce?.cidade ?? "sua cidade")}</strong>.
                Edite sua localização no seu perfil para ver se você entra no par mais próximo!
              </p>`
            : ""
        }

        <!-- Área reservada para visualização gráfica (Issue #9) -->
        <div id="area-visualizacao-grafica" class="area-visualizacao-reservada">
          <span>✦ <strong>Visualização dos Pontos (Issue #9)</strong>: espaço reservado para mapa e plano cartesiano do algoritmo D&amp;C.</span>
        </div>
      </div>
    `;
  }
} else {
  htmlMatch = `<p class="aviso">Não há usuários suficientes para encontrar o par mais próximo.</p>`;
}

function renderizarCard(u: Usuario): string {
  const inicial = u.nome[0] ?? "?";

  return `
    <article class="card-usuario ${u.ehVoce ? "card-voce" : ""}">
      <div class="avatar ${u.ehVoce ? "avatar-voce" : ""}" aria-label="Avatar de ${escapeHtml(u.nome)}">
        ${escapeHtml(inicial)}
      </div>
      <div class="card-info">
        <div class="card-cabecalho">
          <h3 class="card-nome">
            ${escapeHtml(u.nome)}
            ${u.ehVoce ? '<span class="selo-voce">Você</span>' : ""}
          </h3>
          <span class="selo">${escapeHtml(u.cidade)}</span>
        </div>
        <p class="card-bio">${escapeHtml(u.bio)}</p>
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
`;
