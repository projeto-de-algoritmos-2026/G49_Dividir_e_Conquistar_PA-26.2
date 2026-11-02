import { gravar, ler } from "./armazem";

export type Especie = "gato" | "cachorro" | "coelho" | "pintinho" | "sapo";

export const NOMES_ESPECIES: Record<Especie, string> = {
  gato: "Gatinho",
  cachorro: "Cachorrinho",
  coelho: "Coelhinho",
  pintinho: "Pintinho",
  sapo: "Sapinho",
};

export interface EstadoBichinho {
  nome: string;
  especie: Especie;
  /** Barras de 0 a 100 */
  barriga: number;
  alegria: number;
  energia: number;
  /** Quando as barras foram calculadas pela última vez (ms) */
  atualizadoEm: number;
}

const CHAVE = "bichinho";
const HORA_MS = 60 * 60 * 1000;
/** Quanto cada barra perde por hora */
const PERDA_POR_HORA = { barriga: 4, alegria: 3, energia: 2 };

function limitar(valor: number): number {
  return Math.min(100, Math.max(0, valor));
}

export function novoBichinho(agora: number): EstadoBichinho {
  return { nome: "Bitinho", especie: "gato", barriga: 70, alegria: 70, energia: 70, atualizadoEm: agora };
}

/** As barras caem com o tempo, mesmo com a página fechada, mas o bichinho nunca morre */
export function aplicarTempo(e: EstadoBichinho, agora: number): EstadoBichinho {
  const horas = Math.max(0, agora - e.atualizadoEm) / HORA_MS;
  return {
    ...e,
    barriga: limitar(e.barriga - PERDA_POR_HORA.barriga * horas),
    alegria: limitar(e.alegria - PERDA_POR_HORA.alegria * horas),
    energia: limitar(e.energia - PERDA_POR_HORA.energia * horas),
    atualizadoEm: agora,
  };
}

export function alimentar(e: EstadoBichinho): EstadoBichinho {
  return { ...e, barriga: limitar(e.barriga + 25) };
}

export function brincar(e: EstadoBichinho): EstadoBichinho {
  return { ...e, alegria: limitar(e.alegria + 20), energia: limitar(e.energia - 10), barriga: limitar(e.barriga - 5) };
}

export function dormir(e: EstadoBichinho): EstadoBichinho {
  return { ...e, energia: limitar(e.energia + 30) };
}

export function humorDoBichinho(e: EstadoBichinho): string {
  const pior = Math.min(e.barriga, e.alegria, e.energia);
  if (pior < 20) {
    if (pior === e.barriga) return "com fome (;﹏;)";
    if (pior === e.alegria) return "entediado (._.)";
    return "morrendo de sono (-_-)";
  }
  return pior >= 70 ? "radiante! \\(^o^)/" : "de boa (^_^)";
}

function ehEstado(d: unknown): d is EstadoBichinho {
  if (typeof d !== "object" || d === null) return false;
  const v = d as Record<string, unknown>;
  return (
    typeof v.nome === "string" &&
    typeof v.especie === "string" &&
    v.especie in NOMES_ESPECIES &&
    typeof v.barriga === "number" &&
    typeof v.alegria === "number" &&
    typeof v.energia === "number" &&
    typeof v.atualizadoEm === "number"
  );
}

export function carregarBichinho(agora = Date.now()): EstadoBichinho {
  return aplicarTempo(ler(CHAVE, ehEstado, novoBichinho(agora)), agora);
}

export function salvarBichinho(e: EstadoBichinho): void {
  gravar(CHAVE, e);
}
