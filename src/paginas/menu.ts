import "../layout";
import { parMaisProximo } from "../algoritmo/parMaisProximo";
import { paraPonto } from "../algoritmo/geo";
import { carregarUsuarios } from "../dados/banco";

// Página de menu: lista as pessoas da rede e mostra "quem está mais perto de você?"
// TODO (#7): cards dos usuários. TODO (#9): card do match + visualização. TODO (#4): integração.

const app = document.querySelector<HTMLElement>("#app")!;
const usuarios = carregarUsuarios();
const resultado = parMaisProximo(usuarios.map(paraPonto));

app.innerHTML = `
  <section class="caixa">
    <h1 class="caixa-titulo">Quem está mais perto de você?</h1>
    <div class="caixa-corpo">
      <p class="aviso">${resultado ? `Distância: ${resultado.distancia.toFixed(0)} km` : "Algoritmo ainda não implementado."}</p>
      <ul class="lista">
        ${usuarios.map((u) => `<li><strong>${u.nome}</strong> — ${u.cidade}</li>`).join("")}
      </ul>
    </div>
  </section>
`;
