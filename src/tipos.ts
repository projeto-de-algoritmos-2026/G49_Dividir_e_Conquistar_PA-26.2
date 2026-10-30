export interface Usuario {
  id: number;
  nome: string;
  bio: string;
  cidade: string;
  latitude: number;
  longitude: number;
  /** true apenas para o usuário "dono" da rede (você) */
  ehVoce: boolean;
}

/** Ponto no plano cartesiano (em km), usado pelo algoritmo */
export interface Ponto {
  x: number;
  y: number;
  id: number;
}

export interface ResultadoPar {
  a: Ponto;
  b: Ponto;
  distancia: number;
}
