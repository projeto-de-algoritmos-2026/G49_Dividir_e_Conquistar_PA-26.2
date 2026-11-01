import "./styles/global.css";
import { resetarBanco } from "./dados/banco";

const caminho = location.pathname.endsWith("perfil.html") ? "/perfil.html" : "/";
document.querySelectorAll<HTMLAnchorElement>(".topo nav a").forEach((link) => {
  link.classList.toggle("ativo", link.getAttribute("href") === caminho);
});

document.querySelector("#resetar")?.addEventListener("click", () => {
  if (confirm("Voltar aos dados iniciais da rede?")) {
    resetarBanco();
    location.reload();
  }
});
