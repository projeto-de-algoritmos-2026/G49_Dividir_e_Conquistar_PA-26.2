import "../styles/global.css";
import { carregarUsuarios, usuarioAtual } from "../dados/banco";

// Página de perfil: exibe e edita os dados do usuário principal.
// TODO (#8): formulário de edição (nome, bio, cidade, latitude/longitude) salvando no banco.

const app = document.querySelector<HTMLElement>("#app")!;
const voce = usuarioAtual(carregarUsuarios());

app.innerHTML = `
  <h1>${voce.nome}</h1>
  <p>${voce.bio}</p>
  <p>${voce.cidade} (${voce.latitude}, ${voce.longitude})</p>
`;
