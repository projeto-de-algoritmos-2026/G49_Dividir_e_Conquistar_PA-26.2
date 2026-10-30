import type { Usuario } from "../tipos";
import seed from "./usuarios.json";

// "Banco de dados" local: começa com o seed e persiste as edições no localStorage.
// TODO (#1): validar dados lidos, tratar erro de JSON corrompido.

const CHAVE = "g49:usuarios";

export function carregarUsuarios(): Usuario[] {
  const salvo = localStorage.getItem(CHAVE);
  return salvo ? (JSON.parse(salvo) as Usuario[]) : structuredClone(seed as Usuario[]);
}

export function salvarUsuarios(usuarios: Usuario[]): void {
  localStorage.setItem(CHAVE, JSON.stringify(usuarios));
}

export function resetarBanco(): void {
  localStorage.removeItem(CHAVE);
}

export function usuarioAtual(usuarios: Usuario[]): Usuario {
  const voce = usuarios.find((u) => u.ehVoce);
  if (!voce) throw new Error("Usuário principal não encontrado no banco");
  return voce;
}
