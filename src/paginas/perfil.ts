import "../layout";
import { carregarUsuarios, usuarioAtual } from "../dados/banco";

// Página de perfil: exibe e edita os dados do usuário principal.
// TODO (#8): formulário de edição (nome, bio, cidade, latitude/longitude) salvando no banco.

const app = document.querySelector<HTMLElement>("#app")!;
const voce = usuarioAtual(carregarUsuarios());

app.innerHTML = `
  <section class="caixa">
    <h1 class="caixa-titulo">${voce.nome}</h1>
    <div class="caixa-corpo card">
      <div class="avatar">${voce.nome[0]}</div>
      <div>
        <p>${voce.bio}</p>
        <p><span class="selo">${voce.cidade}</span> (${voce.latitude}, ${voce.longitude})</p>
      </div>
    </div>
  </section>
`;
