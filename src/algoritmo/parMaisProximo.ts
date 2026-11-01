import type { Ponto, ResultadoPar } from "../tipos";
import { distancia } from "./geo";

interface Melhor {
  i: number;
  j: number;
  d: number;
}

export function parMaisProximo(pontos: Ponto[]): ResultadoPar | null {
  if (pontos.length < 2) return null;

  const indices = pontos.map((_, i) => i);
  const px = [...indices].sort((i, j) => pontos[i].x - pontos[j].x);
  const py = [...indices].sort((i, j) => pontos[i].y - pontos[j].y);
  const naEsquerda = new Array<boolean>(pontos.length).fill(false);

  const { i, j, d } = resolver(pontos, px, py, naEsquerda);
  return { a: pontos[i], b: pontos[j], distancia: d };
}

function resolver(pontos: Ponto[], px: number[], py: number[], naEsquerda: boolean[]): Melhor {
  const n = px.length;
  if (n <= 3) return forcaBruta(pontos, px);

  const meio = Math.floor(n / 2);
  const xMeio = pontos[px[meio]].x;
  const esqPx = px.slice(0, meio);
  const dirPx = px.slice(meio);

  for (const i of esqPx) naEsquerda[i] = true;
  const esqPy: number[] = [];
  const dirPy: number[] = [];
  for (const i of py) (naEsquerda[i] ? esqPy : dirPy).push(i);
  for (const i of esqPx) naEsquerda[i] = false;

  const esq = resolver(pontos, esqPx, esqPy, naEsquerda);
  const dir = resolver(pontos, dirPx, dirPy, naEsquerda);
  let melhor = esq.d <= dir.d ? esq : dir;

  const faixa = py.filter((i) => Math.abs(pontos[i].x - xMeio) < melhor.d);
  for (let a = 0; a < faixa.length; a++) {
    for (let b = a + 1; b < faixa.length && b <= a + 7; b++) {
      const p = pontos[faixa[a]];
      const q = pontos[faixa[b]];
      if (q.y - p.y >= melhor.d) break;
      const d = distancia(p, q);
      if (d < melhor.d) melhor = { i: faixa[a], j: faixa[b], d };
    }
  }

  return melhor;
}

function forcaBruta(pontos: Ponto[], indices: number[]): Melhor {
  let melhor: Melhor = { i: indices[0], j: indices[1], d: Infinity };
  for (let a = 0; a < indices.length; a++) {
    for (let b = a + 1; b < indices.length; b++) {
      const d = distancia(pontos[indices[a]], pontos[indices[b]]);
      if (d < melhor.d) melhor = { i: indices[a], j: indices[b], d };
    }
  }
  return melhor;
}
