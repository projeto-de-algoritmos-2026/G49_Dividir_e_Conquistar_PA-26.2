import "./styles/global.css";
import { gravar, ler, resetarTudo } from "./dados/armazem";
import { AVISOS_LETREIRO } from "./dados/social";

const caminho = location.pathname.replace(/index\.html$/, "");
document.querySelectorAll<HTMLAnchorElement>(".topo nav a").forEach((link) => {
  link.classList.toggle("ativo", link.getAttribute("href") === caminho);
});

document.querySelector("#resetar")?.addEventListener("click", () => {
  if (confirm("Voltar aos dados iniciais da rede? Isso apaga seu perfil, bichinho, posts e recados.")) {
    resetarTudo();
    location.reload();
  }
});

function montarLetreiro(): void {
  const letreiro = document.createElement("div");
  letreiro.className = "letreiro";
  letreiro.innerHTML = `
    <button type="button" class="letreiro-pausa" aria-label="Pausar o letreiro" aria-pressed="false">⏸</button>
    <div class="letreiro-janela">
      <p class="letreiro-texto">${AVISOS_LETREIRO.join(" &nbsp;&nbsp; ")}</p>
    </div>
  `;
  document.querySelector(".topo")?.after(letreiro);

  letreiro.querySelector("button")?.addEventListener("click", (e) => {
    const botao = e.currentTarget as HTMLButtonElement;
    const pausado = letreiro.classList.toggle("pausado");
    botao.textContent = pausado ? "▶" : "⏸";
    botao.setAttribute("aria-pressed", String(pausado));
  });
}

function montarRodape(): void {
  const ehNumero = (d: unknown): d is number => typeof d === "number";
  const visitas = ler("visitas", ehNumero, 0) + 1;
  gravar("visitas", visitas);

  const extras = document.createElement("div");
  extras.className = "rodape-extras";
  // O contador começa em 4812 só para parecer um site famoso de 2004
  extras.innerHTML = `
    <p class="contador">Você é o visitante nº <span class="contador-digitos">${String(4812 + visitas).padStart(6, "0")}</span></p>
    <ul class="selos-88" aria-label="Selos do site">
      <li class="selo-88 selo-88-azul">feito no<br />bloco de notas</li>
      <li class="selo-88 selo-88-dourado">melhor em<br />800×600</li>
      <li class="selo-88 selo-88-preto">O(n log n)<br />inside</li>
      <li class="selo-88 selo-88-rosa">♥ adote um<br />bichinho</li>
    </ul>
  `;
  document.querySelector(".rodape")?.prepend(extras);
}

/** Rastro de brilhos no cursor: só com mouse e para quem não pediu menos movimento */
function montarBrilhos(): void {
  const comMovimento = matchMedia("(prefers-reduced-motion: no-preference)").matches;
  if (!comMovimento) return;

  let ultimo = 0;
  document.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || e.timeStamp - ultimo < 90) return;
    ultimo = e.timeStamp;

    const brilho = document.createElement("span");
    brilho.className = "brilho";
    brilho.textContent = "✦";
    brilho.setAttribute("aria-hidden", "true");
    brilho.style.left = `${e.clientX}px`;
    brilho.style.top = `${e.clientY}px`;
    brilho.addEventListener("animationend", () => brilho.remove());
    document.body.append(brilho);
  });
}

montarLetreiro();
montarRodape();
montarBrilhos();
