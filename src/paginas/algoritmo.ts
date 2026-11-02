import "../layout";
import { medir, nLogN, paresForcaBruta, pontosAleatorios, type Medida } from "../algoritmo/comparacao";
import { parMaisProximoForcaBruta } from "../algoritmo/forcaBruta";
import { paraPonto } from "../algoritmo/geo";
import { parMaisProximo } from "../algoritmo/parMaisProximo";
import { carregarUsuarios } from "../dados/banco";
import { escapeHtml } from "../html";
import type { Contador } from "../tipos";

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("Elemento #app não encontrado no DOM");

/** Tamanhos da corrida. Acima disso, a força bruta trava a página por vários segundos. */
const TAMANHOS = [500, 1000, 2000, 3000, 4000, 5000];
const TAMANHOS_TEORICOS = [10, 100, 1_000, 10_000, 100_000, 1_000_000];

const COR_FORCA = "#c0562b";
const COR_DIVIDIR = "#3a6db5";

function inteiro(valor: number): string {
  return Math.round(valor).toLocaleString("pt-BR");
}

function tempo(ms: number): string {
  if (ms < 0.1) return "< 0,1 ms";
  return `${ms.toLocaleString("pt-BR", { maximumFractionDigits: ms < 10 ? 1 : 0 })} ms`;
}

function htmlNaRede(): string {
  const usuarios = carregarUsuarios();
  const pontos = usuarios.map(paraPonto);
  const forca: Contador = { distancias: 0 };
  const dividir: Contador = { distancias: 0 };
  const resultado = parMaisProximo(pontos, dividir);
  parMaisProximoForcaBruta(pontos, forca);
  if (!resultado) return "";

  const nome = (id: number) => escapeHtml(usuarios.find((u) => u.id === id)?.nome ?? "?");
  return `
    <p>
      Par mais próximo: <strong>${nome(resultado.a.id)}</strong> e <strong>${nome(resultado.b.id)}</strong>,
      a <strong>${resultado.distancia.toFixed(1)} km</strong>. As duas versões acham essa mesma distância.
    </p>
    <div class="placar">
      <div class="placar-item">
        <strong>${forca.distancias}</strong>
        <span>distâncias calculadas pela força bruta</span>
      </div>
      <div class="placar-item">
        <strong>${dividir.distancias}</strong>
        <span>distâncias calculadas pelo dividir e conquistar</span>
      </div>
    </div>
    <p class="campo-ajuda">
      Com só ${pontos.length} pessoas a diferença é pequena. Ela aparece quando n cresce: é o que as seções abaixo mostram.
    </p>
  `;
}

function htmlLinhasTeoricas(): string {
  return TAMANHOS_TEORICOS.map((n) => {
    const pares = paresForcaBruta(n);
    const logaritmico = nLogN(n);
    return `
      <tr>
        <td>${inteiro(n)}</td>
        <td>${inteiro(pares)}</td>
        <td>${inteiro(logaritmico)}</td>
        <td>${(pares / logaritmico).toLocaleString("pt-BR", { maximumFractionDigits: pares / logaritmico < 10 ? 1 : 0 })}×</td>
      </tr>
    `;
  }).join("");
}

app.innerHTML = `
  <section class="caixa">
    <h2 class="caixa-titulo">Big O: força bruta × dividir e conquistar</h2>
    <div class="caixa-corpo rolagem-tabela">
      <table class="tabela">
        <thead>
          <tr><th scope="col"></th><th scope="col">Força bruta</th><th scope="col">Dividir e conquistar</th></tr>
        </thead>
        <tbody>
          <tr><th scope="row">Tempo</th><td><strong>O(n²)</strong></td><td><strong>O(n log n)</strong></td></tr>
          <tr><th scope="row">Espaço extra</th><td>O(1)</td><td>O(n)</td></tr>
          <tr><th scope="row">Ideia</th><td>Compara cada ponto com todos os outros</td><td>Divide pela mediana de x, resolve as metades e só confere a faixa em volta da divisória</td></tr>
          <tr><th scope="row">Custo</th><td>T(n) = n(n−1)/2 comparações</td><td>T(n) = 2T(n/2) + O(n), que dá O(n log n) pelo Teorema Mestre</td></tr>
          <tr><th scope="row">Por que é rápido</th><td>Não é: todo par é sempre visitado</td><td>Na faixa ordenada por y, cada ponto só precisa olhar no máximo os 7 seguintes</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="caixa">
    <h2 class="caixa-titulo">Na sua rede agora</h2>
    <div class="caixa-corpo">${htmlNaRede()}</div>
  </section>

  <section class="caixa">
    <h2 class="caixa-titulo">Quanto cada uma cresce (na teoria)</h2>
    <div class="caixa-corpo rolagem-tabela">
      <table class="tabela tabela-numeros">
        <thead>
          <tr><th scope="col">n</th><th scope="col">n(n−1)/2</th><th scope="col">n·log₂(n)</th><th scope="col">Razão</th></tr>
        </thead>
        <tbody>${htmlLinhasTeoricas()}</tbody>
      </table>
      <p class="campo-ajuda">Big O ignora constantes, então a razão indica a tendência, e não quantas vezes um programa real fica mais rápido.</p>
    </div>
  </section>

  <section class="caixa">
    <h2 class="caixa-titulo">Corrida ao vivo, no seu navegador</h2>
    <div class="caixa-corpo">
      <p>Gera pontos aleatórios e cronometra as duas versões sobre os mesmos pontos, com de ${inteiro(TAMANHOS[0])} a ${inteiro(TAMANHOS[TAMANHOS.length - 1])} pontos. Cada tempo é a mediana de 3 execuções.</p>
      <p class="corrida-controles">
        <button type="button" class="botao botao-dourado" id="iniciar-corrida">▶ Iniciar corrida</button>
        <progress id="progresso-corrida" max="${TAMANHOS.length}" value="0" aria-label="Progresso da corrida"></progress>
        <span id="estado-corrida" aria-live="polite">Pronta para largar.</span>
      </p>
      <div id="grafico" class="grafico" hidden></div>
      <div class="rolagem-tabela">
        <table class="tabela tabela-numeros" id="tabela-corrida" hidden>
          <thead>
            <tr>
              <th scope="col">n</th>
              <th scope="col">Tempo força bruta</th>
              <th scope="col">Tempo D&amp;C</th>
              <th scope="col">Distâncias força bruta</th>
              <th scope="col">Distâncias D&amp;C</th>
              <th scope="col">Mesmo resultado?</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <p class="campo-ajuda">
        A coluna de distâncias não conta a ordenação nem as divisões do dividir e conquistar, que também custam tempo.
        Por isso ela fica abaixo de n·log₂(n), e os tempos são a medida mais completa do custo real.
        Os tempos variam a cada corrida: outras abas e a limpeza de memória do navegador podem causar picos isolados.
      </p>
    </div>
  </section>
`;

const grafico = document.querySelector<HTMLElement>("#grafico")!;
const tabela = document.querySelector<HTMLTableElement>("#tabela-corrida")!;
const botao = document.querySelector<HTMLButtonElement>("#iniciar-corrida")!;
const progresso = document.querySelector<HTMLProgressElement>("#progresso-corrida")!;
const estado = document.querySelector<HTMLElement>("#estado-corrida")!;

let medidas: Medida[] = [];

/** Primeiro valor "redondo" (1, 2 ou 5 × 10^k) que cabe o máximo */
function topoDoEixo(maximo: number): number {
  const base = 10 ** Math.floor(Math.log10(maximo || 1));
  return [1, 2, 5, 10].map((m) => m * base).find((v) => v >= maximo) ?? maximo;
}

function desenharGrafico(): void {
  const largura = Math.max(grafico.clientWidth, 280);
  const altura = 280;
  const comRotulos = largura >= 520;
  const margem = { esquerda: 68, direita: comRotulos ? 140 : 26, topo: 14, base: 42 };
  const larguraUtil = largura - margem.esquerda - margem.direita;
  const alturaUtil = altura - margem.topo - margem.base;

  const nMaximo = TAMANHOS[TAMANHOS.length - 1];
  const yMaximo = topoDoEixo(Math.max(...medidas.map((m) => m.msForcaBruta)));
  const x = (n: number) => margem.esquerda + (n / nMaximo) * larguraUtil;
  const y = (ms: number) => margem.topo + alturaUtil - (ms / yMaximo) * alturaUtil;

  const grade = [0, 0.25, 0.5, 0.75, 1]
    .map((f) => {
      const valor = f * yMaximo;
      return `
        <line class="grafico-grade" x1="${margem.esquerda}" x2="${largura - margem.direita}" y1="${y(valor)}" y2="${y(valor)}" />
        <text class="grafico-eixo" x="${margem.esquerda - 8}" y="${y(valor) + 4}" text-anchor="end">${valor.toLocaleString("pt-BR")} ms</text>
      `;
    })
    .join("");

  const eixoX = TAMANHOS.filter((n) => n % 1000 === 0)
    .map(
      (n) => `<text class="grafico-eixo" x="${x(n)}" y="${altura - margem.base + 18}" text-anchor="middle">${inteiro(n)}</text>`,
    )
    .join("");

  function serie(cor: string, tempoDe: (m: Medida) => number, rotulo: string): string {
    const pontos = medidas.map((m) => `${x(m.n)},${y(tempoDe(m))}`).join(" ");
    const ultimo = medidas[medidas.length - 1];
    return `
      <polyline points="${pontos}" fill="none" stroke="${cor}" stroke-width="2" stroke-linejoin="round" />
      ${medidas.map((m) => `<circle cx="${x(m.n)}" cy="${y(tempoDe(m))}" r="4.5" fill="${cor}" stroke="#fffdf7" stroke-width="2" />`).join("")}
      ${comRotulos ? `<text class="grafico-rotulo" x="${x(ultimo.n) + 10}" y="${y(tempoDe(ultimo)) + 4}">${rotulo}</text>` : ""}
    `;
  }

  grafico.innerHTML = `
    <ul class="grafico-legenda">
      <li><span style="background: ${COR_FORCA}"></span>Força bruta, O(n²)</li>
      <li><span style="background: ${COR_DIVIDIR}"></span>Dividir e conquistar, O(n log n)</li>
    </ul>
    <svg role="img" aria-label="Tempo de execução por quantidade de pontos: a força bruta cresce muito mais rápido. Os valores estão na tabela abaixo." width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}">
      ${grade}
      ${eixoX}
      <text class="grafico-eixo" x="${margem.esquerda + larguraUtil / 2}" y="${altura - 6}" text-anchor="middle">quantidade de pontos (n)</text>
      <line class="grafico-mira" id="grafico-mira" y1="${margem.topo}" y2="${margem.topo + alturaUtil}" visibility="hidden" />
      ${serie(COR_FORCA, (m) => m.msForcaBruta, "Força bruta")}
      ${serie(COR_DIVIDIR, (m) => m.msDividir, "Dividir e conq.")}
    </svg>
    <div class="grafico-dica" id="grafico-dica" hidden></div>
  `;

  const svg = grafico.querySelector("svg")!;
  const mira = grafico.querySelector<SVGLineElement>("#grafico-mira")!;
  const dica = grafico.querySelector<HTMLElement>("#grafico-dica")!;

  svg.addEventListener("pointermove", (e) => {
    const caixa = svg.getBoundingClientRect();
    const px = e.clientX - caixa.left;
    const m = medidas.reduce((perto, atual) =>
      Math.abs(x(atual.n) - px) < Math.abs(x(perto.n) - px) ? atual : perto,
    );

    mira.setAttribute("x1", String(x(m.n)));
    mira.setAttribute("x2", String(x(m.n)));
    mira.setAttribute("visibility", "visible");

    dica.hidden = false;
    dica.innerHTML = `
      <strong>n = ${inteiro(m.n)}</strong><br />
      Força bruta: ${tempo(m.msForcaBruta)}<br />
      Dividir e conquistar: ${tempo(m.msDividir)}
    `;
    const aEsquerda = x(m.n) > largura / 2;
    dica.style.left = aEsquerda ? "auto" : `${x(m.n) + 12}px`;
    dica.style.right = aEsquerda ? `${largura - x(m.n) + 12}px` : "auto";
  });

  svg.addEventListener("pointerleave", () => {
    mira.setAttribute("visibility", "hidden");
    dica.hidden = true;
  });
}

function adicionarLinha(m: Medida): void {
  tabela.tBodies[0].insertAdjacentHTML(
    "beforeend",
    `
      <tr>
        <td>${inteiro(m.n)}</td>
        <td>${tempo(m.msForcaBruta)}</td>
        <td>${tempo(m.msDividir)}</td>
        <td>${inteiro(m.distanciasForcaBruta)}</td>
        <td>${inteiro(m.distanciasDividir)}</td>
        <td>${m.mesmoResultado ? "✓ sim" : "✗ não"}</td>
      </tr>
    `,
  );
}

async function correr(): Promise<void> {
  botao.disabled = true;
  medidas = [];
  tabela.tBodies[0].innerHTML = "";
  tabela.hidden = false;
  grafico.hidden = false;
  grafico.innerHTML = "";
  progresso.value = 0;

  // Aquece o compilador do navegador para não prejudicar a primeira medida
  medir(pontosAleatorios(TAMANHOS[0]), 1);

  for (const [i, n] of TAMANHOS.entries()) {
    estado.textContent = `Correndo com ${inteiro(n)} pontos...`;
    // Devolve o controle ao navegador para a página atualizar entre as medidas
    await new Promise((resolver) => setTimeout(resolver, 30));

    const medida = medir(pontosAleatorios(n));
    medidas.push(medida);
    adicionarLinha(medida);
    desenharGrafico();
    progresso.value = i + 1;
  }

  const ultima = medidas[medidas.length - 1];
  const vezes = ultima.msForcaBruta / Math.max(ultima.msDividir, 0.1);
  estado.textContent = `Fim! Com ${inteiro(ultima.n)} pontos, o dividir e conquistar foi cerca de ${inteiro(vezes)}× mais rápido.`;
  botao.textContent = "↻ Correr de novo";
  botao.disabled = false;
}

botao.addEventListener("click", () => void correr());
window.addEventListener("resize", () => {
  if (medidas.length > 0) desenharGrafico();
});
