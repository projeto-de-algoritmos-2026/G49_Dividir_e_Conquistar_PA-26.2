import type { Contador, Ponto } from "../tipos";
import { parMaisProximoForcaBruta } from "./forcaBruta";
import { parMaisProximo } from "./parMaisProximo";

/** Quantos pares a força bruta compara: n(n-1)/2 */
export function paresForcaBruta(n: number): number {
  return (n * (n - 1)) / 2;
}

/** n·log₂(n): a ordem de grandeza do trabalho do dividir e conquistar */
export function nLogN(n: number): number {
  return n * Math.log2(n);
}

export function pontosAleatorios(n: number, aleatorio: () => number = Math.random): Ponto[] {
  // Área proporcional a n, para a densidade de pontos não mudar entre os tamanhos
  const lado = Math.sqrt(n) * 100;
  return Array.from({ length: n }, (_, id) => ({ id, x: aleatorio() * lado, y: aleatorio() * lado }));
}

export interface Medida {
  n: number;
  msForcaBruta: number;
  msDividir: number;
  distanciasForcaBruta: number;
  distanciasDividir: number;
  /** As duas versões chegaram à mesma menor distância? */
  mesmoResultado: boolean;
}

function mediana(valores: number[]): number {
  return [...valores].sort((a, b) => a - b)[Math.floor(valores.length / 2)];
}

function cronometrar(funcao: () => void, repeticoes: number): number {
  const tempos: number[] = [];
  for (let i = 0; i < repeticoes; i++) {
    const inicio = performance.now();
    funcao();
    tempos.push(performance.now() - inicio);
  }
  return mediana(tempos);
}

/** Roda as duas versões sobre os mesmos pontos e guarda a mediana dos tempos */
export function medir(pontos: Ponto[], repeticoes = 3): Medida {
  const forca: Contador = { distancias: 0 };
  const dividir: Contador = { distancias: 0 };
  const r1 = parMaisProximoForcaBruta(pontos, forca);
  const r2 = parMaisProximo(pontos, dividir);

  return {
    n: pontos.length,
    msForcaBruta: cronometrar(() => parMaisProximoForcaBruta(pontos), repeticoes),
    msDividir: cronometrar(() => parMaisProximo(pontos), repeticoes),
    distanciasForcaBruta: forca.distancias,
    distanciasDividir: dividir.distancias,
    mesmoResultado: Math.abs((r1?.distancia ?? 0) - (r2?.distancia ?? 0)) < 1e-9,
  };
}
