import { MUSICAS, NOMES_STATUS, perfilSocial } from "../dados/social";
import { escapeHtml } from "../html";
import type { Usuario } from "../tipos";

/** Lista de amigos no estilo mensageiro; o status aparece em texto e em cor */
export function htmlListaDeAmigos(usuarios: Usuario[]): string {
  const outros = usuarios.filter((u) => !u.ehVoce);
  const conectados = outros.filter((u) => perfilSocial(u.id).status !== "offline").length;

  return `
    <section class="caixa">
      <h2 class="caixa-titulo">Amigos (${conectados}/${outros.length})</h2>
      <ul class="amigos">
        ${outros
          .map((u) => {
            const social = perfilSocial(u.id);
            return `
              <li>
                <span class="bolinha bolinha-${social.status}" aria-hidden="true"></span>
                <span class="amigo-info">
                  <a href="/pessoa.html?id=${u.id}">${escapeHtml(u.nome)}</a>
                  <small>(${NOMES_STATUS[social.status]})</small>
                  <span class="amigo-ouvindo">♪ ${escapeHtml(social.ouvindo)}</span>
                </span>
              </li>
            `;
          })
          .join("")}
      </ul>
    </section>
  `;
}

export function htmlPlayer(): string {
  return `
    <section class="caixa">
      <h2 class="caixa-titulo">pertinhoAmp</h2>
      <div class="player" id="player">
        <div class="player-tela">
          <div class="player-faixa"><span id="player-titulo"></span></div>
          <div class="player-linha">
            <span id="player-tempo">0:00</span>
            <span class="player-eq" aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            </span>
          </div>
        </div>
        <div class="player-botoes">
          <button type="button" data-player="anterior" aria-label="Música anterior">⏮</button>
          <button type="button" data-player="tocar" aria-label="Tocar">▶</button>
          <button type="button" data-player="proxima" aria-label="Próxima música">⏭</button>
        </div>
        <p class="campo-ajuda">Player de mentirinha: não sai som, só a nostalgia.</p>
      </div>
    </section>
  `;
}

function formatarTempo(segundos: number): string {
  return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, "0")}`;
}

/** Chamar depois que htmlPlayer() estiver na página */
export function ligarPlayer(): void {
  const player = document.querySelector<HTMLElement>("#player");
  const titulo = document.querySelector<HTMLElement>("#player-titulo");
  const tempo = document.querySelector<HTMLElement>("#player-tempo");
  const tocar = document.querySelector<HTMLButtonElement>('[data-player="tocar"]');
  if (!player || !titulo || !tempo || !tocar) return;

  let faixa = 0;
  let segundos = 0;
  let relogio: number | undefined;

  function mostrar(): void {
    titulo!.textContent = `${faixa + 1}. ${MUSICAS[faixa].titulo}`;
    tempo!.textContent = formatarTempo(segundos);
  }

  function trocar(passo: number): void {
    faixa = (faixa + passo + MUSICAS.length) % MUSICAS.length;
    segundos = 0;
    mostrar();
  }

  function alternar(): void {
    const tocando = relogio === undefined;
    player!.classList.toggle("tocando", tocando);
    tocar!.textContent = tocando ? "⏸" : "▶";
    tocar!.setAttribute("aria-label", tocando ? "Pausar" : "Tocar");

    if (tocando) {
      relogio = window.setInterval(() => {
        segundos++;
        if (segundos >= MUSICAS[faixa].duracao) trocar(1);
        else mostrar();
      }, 1000);
    } else {
      clearInterval(relogio);
      relogio = undefined;
    }
  }

  player.addEventListener("click", (e) => {
    const acao = (e.target as HTMLElement).closest<HTMLElement>("[data-player]")?.dataset.player;
    if (acao === "tocar") alternar();
    if (acao === "anterior") trocar(-1);
    if (acao === "proxima") trocar(1);
  });

  mostrar();
}
