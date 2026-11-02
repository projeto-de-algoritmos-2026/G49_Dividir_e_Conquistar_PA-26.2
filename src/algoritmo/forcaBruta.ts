import type { Contador, Ponto, ResultadoPar } from "../tipos";
import { distancia } from "./geo";

/**
 * Par de pontos mais próximos por força bruta — O(n²).
 * Compara todos os n(n-1)/2 pares. Serve de referência para validar a versão
 * dividir e conquistar e para a comparação da página "O algoritmo".
 */
export function parMaisProximoForcaBruta(
  pontos: Ponto[],
  contador: Contador = { distancias: 0 },
): ResultadoPar | null {
  if (pontos.length < 2) return null;

  let melhor: ResultadoPar = { a: pontos[0], b: pontos[1], distancia: Infinity };
  for (let i = 0; i < pontos.length; i++) {
    for (let j = i + 1; j < pontos.length; j++) {
      contador.distancias++;
      const d = distancia(pontos[i], pontos[j]);
      if (d < melhor.distancia) melhor = { a: pontos[i], b: pontos[j], distancia: d };
    }
  }
  return melhor;
}
