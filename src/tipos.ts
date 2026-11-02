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

/** Primeira chamada recursiva do dividir e conquistar, para a visualização (#9) */
export interface Divisao {
  /** x da linha divisória (mediana de x) */
  xMeio: number;
  /** δ = min(δ_esq, δ_dir), antes de olhar a faixa */
  delta: number;
  /** ids dos pontos que caíram na faixa de largura 2δ */
  faixa: number[];
}

/** Quantas distâncias um algoritmo calculou (para comparar as duas versões) */
export interface Contador {
  distancias: number;
}
