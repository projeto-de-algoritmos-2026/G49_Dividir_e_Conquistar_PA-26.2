import {
  NOMES_ESPECIES,
  alimentar,
  aplicarTempo,
  brincar,
  carregarBichinho,
  dormir,
  humorDoBichinho,
  salvarBichinho,
  type Especie,
  type EstadoBichinho,
} from "../dados/bichinhos";
import { escapeHtml } from "../html";
import { spriteBichinho } from "./sprites";

const TEMPO_DE_SONECA_MS = 3000;

function barra(rotulo: string, valor: number): string {
  const inteiro = Math.round(valor);
  return `
    <div class="pet-barra">
      <span>${rotulo}</span>
      <span class="pet-barra-trilho"><span class="pet-barra-valor" style="width: ${inteiro}%"></span></span>
      <span>${inteiro}%</span>
    </div>
  `;
}

/** Monta o bichinho virtual interativo: as ações mudam as barras e ficam salvas no navegador */
export function montarTamagotchi(area: HTMLElement): void {
  let estado = carregarBichinho();
  let cochilando = false;
  let fala = "";

  // Só a tela é redesenhada: botões e campos continuam os mesmos, para não perder cliques nem o foco
  area.innerHTML = `
    <div class="tamagotchi">
      <div class="pet-tela" id="pet-tela"></div>
      <div class="pet-acoes">
        <button type="button" class="botao botao-dourado" data-acao="alimentar">🍙 Alimentar</button>
        <button type="button" class="botao botao-dourado" data-acao="brincar">🎾 Brincar</button>
        <button type="button" class="botao botao-dourado" data-acao="dormir">🌙 Dormir</button>
      </div>
    </div>
    <div class="grade-dupla pet-ajustes">
      <div class="campo">
        <label for="pet-campo-nome">Nome do bichinho:</label>
        <input type="text" id="pet-campo-nome" maxlength="16" value="${escapeHtml(estado.nome)}" />
      </div>
      <div class="campo">
        <label for="pet-campo-especie">Espécie:</label>
        <select id="pet-campo-especie">
          ${(Object.keys(NOMES_ESPECIES) as Especie[])
            .map(
              (e) =>
                `<option value="${e}" ${e === estado.especie ? "selected" : ""}>${NOMES_ESPECIES[e]}</option>`,
            )
            .join("")}
        </select>
      </div>
    </div>
  `;
  const tela = area.querySelector<HTMLElement>("#pet-tela")!;
  const botoes = area.querySelectorAll<HTMLButtonElement>("[data-acao]");
  const campoNome = area.querySelector<HTMLInputElement>("#pet-campo-nome")!;
  const campoEspecie = area.querySelector<HTMLSelectElement>("#pet-campo-especie")!;

  function desenhar(): void {
    tela.innerHTML = `
      <div class="pet-palco ${cochilando ? "pet-dormindo" : ""}">
        ${spriteBichinho(estado.especie, 96, `${NOMES_ESPECIES[estado.especie]} ${estado.nome}`, cochilando)}
        ${cochilando ? '<span class="pet-zzz" aria-hidden="true">zZz</span>' : ""}
      </div>
      <p class="pet-nome">${escapeHtml(estado.nome)}</p>
      <p class="pet-humor">${escapeHtml(fala || humorDoBichinho(estado))}</p>
      ${barra("Barriga", estado.barriga)}
      ${barra("Alegria", estado.alegria)}
      ${barra("Energia", estado.energia)}
    `;
    botoes.forEach((botao) => {
      botao.disabled = cochilando;
    });
  }

  function atualizar(novo: EstadoBichinho, novaFala: string): void {
    estado = novo;
    fala = novaFala;
    salvarBichinho(estado);
    desenhar();
  }

  campoNome.addEventListener("change", () => {
    const nome = campoNome.value.trim();
    if (nome) {
      atualizar({ ...estado, nome }, "gostei do nome novo!");
    } else {
      campoNome.value = estado.nome;
    }
  });

  campoEspecie.addEventListener("change", () => {
    atualizar({ ...estado, especie: campoEspecie.value as Especie }, "virei outro bicho!");
  });

  area.querySelector(".pet-acoes")!.addEventListener("click", (e) => {
    const botao = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-acao]");
    if (!botao || cochilando) return;

    const atual = aplicarTempo(estado, Date.now());
    if (botao.dataset.acao === "alimentar") {
      atualizar(alimentar(atual), "nham nham! (^q^)");
    } else if (botao.dataset.acao === "brincar") {
      atualizar(brincar(atual), "de novo, de novo! \\(^o^)/");
    } else {
      cochilando = true;
      atualizar(dormir(atual), "shhh... dormindo");
      setTimeout(() => {
        cochilando = false;
        fala = "";
        desenhar();
        botao.focus(); // o botão perde o foco enquanto está desativado
      }, TEMPO_DE_SONECA_MS);
    }
  });

  desenhar();
}
