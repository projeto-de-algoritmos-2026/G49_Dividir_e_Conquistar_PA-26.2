import type { Usuario } from "../tipos";
import seed from "./usuarios.json";

const CHAVE = "g49:usuarios";

function ehUsuario(u: unknown): u is Usuario {
  if (typeof u !== "object" || u === null) return false;
  const v = u as Record<string, unknown>;
  return (
    typeof v.id === "number" &&
    typeof v.nome === "string" &&
    typeof v.bio === "string" &&
    typeof v.cidade === "string" &&
    typeof v.latitude === "number" &&
    typeof v.longitude === "number" &&
    typeof v.ehVoce === "boolean"
  );
}

function ehBancoValido(dados: unknown): dados is Usuario[] {
  return (
    Array.isArray(dados) &&
    dados.every(ehUsuario) &&
    dados.filter((u) => u.ehVoce).length === 1
  );
}

export function carregarUsuarios(): Usuario[] {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo) {
      const dados: unknown = JSON.parse(salvo);
      if (ehBancoValido(dados)) return dados;
      resetarBanco();
    }
  } catch {
    resetarBanco();
  }
  return structuredClone(seed as Usuario[]);
}

export function salvarUsuarios(usuarios: Usuario[]): void {
  if (!ehBancoValido(usuarios)) throw new Error("Dados de usuários inválidos");
  localStorage.setItem(CHAVE, JSON.stringify(usuarios));
}

export function resetarBanco(): void {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    return;
  }
}

export function usuarioAtual(usuarios: Usuario[]): Usuario {
  const voce = usuarios.find((u) => u.ehVoce);
  if (!voce) throw new Error("Usuário principal não encontrado no banco");
  return voce;
}
