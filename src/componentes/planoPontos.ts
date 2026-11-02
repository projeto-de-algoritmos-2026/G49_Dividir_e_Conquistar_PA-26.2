import type { Match } from "../algoritmo/match";
import { escapeHtml } from "../html";
import type { Usuario } from "../tipos";

/**
 * Desenho dos pontos no plano (#9).
 *
 * Só desenha o que a integração (#4) entregou em `match`: os pontos já em km,
 * o par, o δ e a primeira divisão. Nenhuma distância é recalculada aqui; a única
 * conta é a troca de escala de km para pixels.
 */

const LARGURA = 640;
const ALTURA = 440;
const MARGEM = 48;

interface Tela {
  px: (x: number) => number;
  py: (y: number) => number;
  /** pixels por km */
  escala: number;
}

/** Escala única nos dois eixos, para o desenho não distorcer as distâncias */
function montarTela(match: Match): Tela {
  const xs = match.pontos.map((p) => p.x);
  const ys = match.pontos.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const largura = Math.max(maxX - minX, 1);
  const altura = Math.max(maxY - minY, 1);
  const escala = Math.min((LARGURA - 2 * MARGEM) / largura, (ALTURA - 2 * MARGEM) / altura);

  // Centraliza a nuvem de pontos na área útil
  const sobraX = (LARGURA - 2 * MARGEM - (maxX - minX) * escala) / 2;
  const sobraY = (ALTURA - 2 * MARGEM - (maxY - minY) * escala) / 2;

  return {
    escala,
    px: (x) => MARGEM + sobraX + (x - minX) * escala,
    // No SVG o y cresce para baixo; no mapa, o norte fica em cima
    py: (y) => MARGEM + sobraY + (maxY - y) * escala,
  };
}

/** Escolhe um tamanho "redondo" para a barra de escala (ex.: 100, 250, 500 km) */
function barraDeEscala(escala: number): { km: number; px: number } {
  const alvoKm = 110 / escala;
  const potencia = 10 ** Math.floor(Math.log10(alvoKm));
  const km = [1, 2, 2.5, 5, 10].map((f) => f * potencia).filter((k) => k <= alvoKm).pop() ?? potencia;
  return { km, px: km * escala };
}

function formatarKm(km: number): string {
  return `${km.toLocaleString("pt-BR", { maximumFractionDigits: km < 10 ? 1 : 0 })} km`;
}

export function htmlPlanoPontos(match: Match, usuarios: Usuario[]): string {
  const tela = montarTela(match);
  const porId = new Map(usuarios.map((u) => [u.id, u]));
  const noPar = new Set([match.usuarioA.id, match.usuarioB.id]);
  const naFaixa = new Set(match.divisao?.faixa ?? []);

  // Pontos na mesma posição (ex.: mesma cidade) ganham rótulos empilhados
  const ocupados = new Map<string, number>();

  const pontosSvg = match.pontos
    .map((p) => {
      const u = porId.get(p.id);
      if (!u) return "";
      const x = tela.px(p.x);
      const y = tela.py(p.y);
      const chave = `${Math.round(x / 8)}:${Math.round(y / 8)}`;
      const pilha = ocupados.get(chave) ?? 0;
      ocupados.set(chave, pilha + 1);

      const ancora = x > LARGURA - 90 ? "end" : x < 90 ? "start" : "middle";
      const classes = [
        "plano-ponto",
        u.ehVoce ? "plano-ponto-voce" : "",
        noPar.has(u.id) ? "plano-ponto-par" : "",
        naFaixa.has(u.id) ? "plano-ponto-faixa" : "",
      ].join(" ");

      return `
        <g class="${classes}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
          <title>${escapeHtml(u.nome)} — ${escapeHtml(u.cidade)}</title>
          ${noPar.has(u.id) ? `<circle class="plano-ponto-aura" r="13" />` : ""}
          <circle class="plano-ponto-bola" r="${noPar.has(u.id) ? 7 : 5.5}" />
          <text class="plano-rotulo" y="${-14 - pilha * 15}" text-anchor="${ancora}">${escapeHtml(u.nome)}</text>
        </g>
      `;
    })
    .join("");

  const a = match.pontos.find((p) => p.id === match.usuarioA.id);
  const b = match.pontos.find((p) => p.id === match.usuarioB.id);
  let parSvg = "";
  if (a && b) {
    const [x1, y1, x2, y2] = [tela.px(a.x), tela.py(a.y), tela.px(b.x), tela.py(b.y)];
    const comprimento = Math.hypot(x2 - x1, y2 - y1);
    parSvg = `
      <g class="plano-par">
        <line class="plano-par-linha" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"
          style="--comprimento: ${Math.max(comprimento, 1).toFixed(1)}" />
        <text class="plano-par-rotulo" x="${((x1 + x2) / 2).toFixed(1)}" y="${((y1 + y2) / 2 + 22).toFixed(1)}" text-anchor="middle">
          ♥ ${formatarKm(match.distancia)}
        </text>
      </g>
    `;
  }

  let divisaoSvg = "";
  let legendaDivisao = "";
  if (match.divisao) {
    const { xMeio, delta, faixa } = match.divisao;
    const xLinha = tela.px(xMeio);
    const meiaFaixa = Math.max(delta * tela.escala, 1);
    divisaoSvg = `
      <g class="plano-dc" clip-path="url(#plano-recorte)">
        <rect class="plano-faixa" x="${(xLinha - meiaFaixa).toFixed(1)}" y="0" width="${(2 * meiaFaixa).toFixed(1)}" height="${ALTURA}" />
        <line class="plano-divisoria" x1="${xLinha.toFixed(1)}" y1="0" x2="${xLinha.toFixed(1)}" y2="${ALTURA}" />
        <text class="plano-dc-rotulo" x="${(xLinha - 8).toFixed(1)}" y="20" text-anchor="end">◀ metade esquerda</text>
        <text class="plano-dc-rotulo" x="${(xLinha + 8).toFixed(1)}" y="20" text-anchor="start">metade direita ▶</text>
      </g>
    `;
    legendaDivisao = `
      <li><span class="plano-chave plano-chave-divisoria" aria-hidden="true"></span> Divisória da 1ª chamada (mediana de x)</li>
      <li><span class="plano-chave plano-chave-faixa" aria-hidden="true"></span> Faixa 2δ, com δ = min(δ<sub>esq</sub>, δ<sub>dir</sub>) = <strong>${formatarKm(delta)}</strong> · ${faixa.length} ${faixa.length === 1 ? "ponto" : "pontos"} dentro</li>
    `;
  }

  const escala = barraDeEscala(tela.escala);
  const barraX = LARGURA - MARGEM / 2 - escala.px;
  const barraY = ALTURA - 16;

  const descricao = `${match.pontos.length} pessoas no plano. O par mais próximo é ${match.usuarioA.nome} e ${match.usuarioB.nome}, a ${formatarKm(match.distancia)}.`;

  return `
    <figure class="plano ${match.divisao ? "plano-com-dc" : ""}" id="plano-pontos">
      <div class="plano-barra">
        <strong class="plano-titulo">Mapa da rede no plano (km)</strong>
        ${
          match.divisao
            ? `<label class="plano-alternar">
                <input type="checkbox" id="plano-mostrar-dc" checked />
                mostrar a 1ª divisão do algoritmo
              </label>`
            : ""
        }
      </div>
      <svg class="plano-svg" viewBox="0 0 ${LARGURA} ${ALTURA}" role="img" aria-labelledby="plano-svg-titulo plano-svg-desc">
        <title id="plano-svg-titulo">Pontos da rede e par mais próximo</title>
        <desc id="plano-svg-desc">${escapeHtml(descricao)}</desc>
        <defs>
          <pattern id="plano-grade" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" />
          </pattern>
          <clipPath id="plano-recorte"><rect width="${LARGURA}" height="${ALTURA}" /></clipPath>
        </defs>
        <rect class="plano-fundo" width="${LARGURA}" height="${ALTURA}" />
        <rect class="plano-fundo-grade" width="${LARGURA}" height="${ALTURA}" fill="url(#plano-grade)" />
        <text class="plano-rosa" x="18" y="26">N ▲</text>
        ${divisaoSvg}
        ${parSvg}
        ${pontosSvg}
        <g class="plano-escala" aria-hidden="true">
          <line x1="${barraX.toFixed(1)}" y1="${barraY}" x2="${(barraX + escala.px).toFixed(1)}" y2="${barraY}" />
          <text x="${(barraX + escala.px / 2).toFixed(1)}" y="${barraY - 6}" text-anchor="middle">${formatarKm(escala.km)}</text>
        </g>
      </svg>
      <figcaption>
        <ul class="plano-legenda">
          <li><span class="plano-chave plano-chave-voce" aria-hidden="true"></span> Você</li>
          <li><span class="plano-chave plano-chave-par" aria-hidden="true"></span> Par mais próximo (resultado do algoritmo)</li>
          ${legendaDivisao}
        </ul>
        ${
          !match.divisao
            ? `<p class="plano-explica">Com 3 pessoas ou menos o algoritmo compara todos os pares direto (caso base), sem dividir.</p>`
            : match.divisao.delta === 0
              ? `<p class="plano-explica">
                  Uma das metades já tem duas pessoas no mesmo lugar, então δ = 0 e a faixa fica vazia:
                  nenhum par que cruze a linha pode ser melhor que isso.
                </p>`
              : `<p class="plano-explica">
                  O algoritmo corta a rede ao meio pela linha tracejada e resolve cada metade sozinho.
                  Um par melhor que δ só pode cruzar a linha se os dois pontos estiverem na faixa dourada,
                  então só esses pontos são comparados (no máximo 7 vizinhos cada, em ordem de y).
                </p>`
        }
      </figcaption>
    </figure>
  `;
}

/** Liga o botão que mostra/esconde a camada do dividir e conquistar */
export function ligarPlanoPontos(): void {
  const figura = document.querySelector<HTMLElement>("#plano-pontos");
  const caixa = document.querySelector<HTMLInputElement>("#plano-mostrar-dc");
  if (!figura || !caixa) return;
  caixa.addEventListener("change", () => figura.classList.toggle("plano-com-dc", caixa.checked));
}
