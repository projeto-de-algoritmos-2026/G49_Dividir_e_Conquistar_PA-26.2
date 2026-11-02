const PREFIXO = "g49:";

/** Lê um valor do localStorage; devolve o padrão se estiver ausente ou com formato inválido */
export function ler<T>(chave: string, valido: (dados: unknown) => dados is T, padrao: T): T {
  try {
    const salvo = localStorage.getItem(PREFIXO + chave);
    if (salvo) {
      const dados: unknown = JSON.parse(salvo);
      if (valido(dados)) return dados;
    }
  } catch {
    return padrao;
  }
  return padrao;
}

export function gravar(chave: string, valor: unknown): void {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
  } catch {
    return;
  }
}

/** Apaga tudo o que a rede guardou neste navegador (usuários, bichinho, posts, recados...) */
export function resetarTudo(): void {
  try {
    Object.keys(localStorage)
      .filter((chave) => chave.startsWith(PREFIXO))
      .forEach((chave) => localStorage.removeItem(chave));
  } catch {
    return;
  }
}
