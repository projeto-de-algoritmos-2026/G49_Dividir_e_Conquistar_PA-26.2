import { describe, expect, it } from "vitest";
import { parMaisProximoForcaBruta } from "../src/algoritmo/forcaBruta";
import { paraPonto } from "../src/algoritmo/geo";
import { calcularMatch } from "../src/algoritmo/match";
import { parMaisProximo, type Rastro } from "../src/algoritmo/parMaisProximo";
import seed from "../src/dados/usuarios.json";
import type { Contador, Ponto, ResultadoPar, Usuario } from "../src/tipos";

const usuarios = seed as Usuario[];

function pontosDe(...coordenadas: [number, number][]): Ponto[] {
  return coordenadas.map(([x, y], id) => ({ id, x, y }));
}

function idsDoPar(r: ResultadoPar | null): number[] {
  return r ? [r.a.id, r.b.id].sort((p, q) => p - q) : [];
}

/** Gerador com semente: se um teste falhar, a falha é reproduzível */
function geradorAleatorio(semente: number): () => number {
  let s = semente;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function pontosAleatorios(n: number, largura: number, aleatorio: () => number): Ponto[] {
  return Array.from({ length: n }, (_, id) => ({
    id,
    x: aleatorio() * largura,
    y: aleatorio() * largura,
  }));
}

describe("parMaisProximoForcaBruta", () => {
  it("retorna null com menos de 2 pontos", () => {
    expect(parMaisProximoForcaBruta([])).toBeNull();
    expect(parMaisProximoForcaBruta(pontosDe([1, 1]))).toBeNull();
  });

  it("acha o par mais próximo num caso conferido à mão", () => {
    const r = parMaisProximoForcaBruta(pontosDe([0, 0], [10, 10], [13, 14], [100, 0]));
    expect(idsDoPar(r)).toEqual([1, 2]);
    expect(r?.distancia).toBe(5);
  });

  it("calcula exatamente n(n-1)/2 distâncias", () => {
    const contador: Contador = { distancias: 0 };
    parMaisProximoForcaBruta(pontosAleatorios(100, 1000, geradorAleatorio(1)), contador);
    expect(contador.distancias).toBe((100 * 99) / 2);
  });
});

describe("parMaisProximo", () => {
  it("retorna o mesmo par que a força bruta para o seed da rede", () => {
    const pontos = usuarios.map(paraPonto);
    const r = parMaisProximo(pontos);
    const referencia = parMaisProximoForcaBruta(pontos);

    expect(idsDoPar(r)).toEqual(idsDoPar(referencia));
    expect(r?.distancia).toBeCloseTo(referencia?.distancia ?? NaN, 9);
    expect(idsDoPar(r)).toEqual([0, 1]); // Brasília e Goiânia
  });

  it("retorna null com menos de 2 pontos", () => {
    expect(parMaisProximo([])).toBeNull();
    expect(parMaisProximo(pontosDe([1, 1]))).toBeNull();
  });

  it("funciona com 2 e 3 pontos (caso base)", () => {
    const dois = parMaisProximo(pontosDe([0, 0], [3, 4]));
    expect(idsDoPar(dois)).toEqual([0, 1]);
    expect(dois?.distancia).toBe(5);

    const tres = parMaisProximo(pontosDe([0, 0], [50, 50], [51, 50]));
    expect(idsDoPar(tres)).toEqual([1, 2]);
    expect(tres?.distancia).toBe(1);
  });

  it("funciona com pontos de mesma coordenada x", () => {
    const pontos = pontosDe([5, 0], [5, 10], [5, 13], [5, 40], [5, 90], [5, 200], [5, 201.5]);
    const r = parMaisProximo(pontos);
    expect(idsDoPar(r)).toEqual([5, 6]);
    expect(r?.distancia).toBe(1.5);
  });

  it("funciona com pontos repetidos", () => {
    const r = parMaisProximo(pontosDe([0, 0], [7, 7], [20, 3], [7, 7], [40, 40], [90, 1]));
    expect(idsDoPar(r)).toEqual([1, 3]);
    expect(r?.distancia).toBe(0);
  });

  it("acha um par que atravessa a divisória", () => {
    // Cada metade só tem pontos distantes; o par certo fica um de cada lado de x = 50
    const r = parMaisProximo(
      pontosDe([0, 0], [0, 100], [49, 50], [51, 50], [100, 0], [100, 100]),
    );
    expect(idsDoPar(r)).toEqual([2, 3]);
    expect(r?.distancia).toBe(2);
  });

  it("não altera a lista recebida", () => {
    const pontos = pontosAleatorios(50, 100, geradorAleatorio(7));
    const copia = structuredClone(pontos);
    parMaisProximo(pontos);
    expect(pontos).toEqual(copia);
  });

  it("bate com a força bruta em 1000 conjuntos aleatórios", () => {
    const aleatorio = geradorAleatorio(49);
    for (let rodada = 0; rodada < 1000; rodada++) {
      const n = 2 + Math.floor(aleatorio() * 120);
      // Numa grade inteira pequena aparecem muitos empates e pontos repetidos
      const emGrade = rodada % 2 === 0;
      const pontos = pontosAleatorios(n, emGrade ? 40 : 1000, aleatorio).map((p) =>
        emGrade ? { ...p, x: Math.floor(p.x), y: Math.floor(p.y) } : p,
      );

      const r = parMaisProximo(pontos);
      const referencia = parMaisProximoForcaBruta(pontos);
      // Compara a distância, porque pode haver mais de um par empatado
      expect(r?.distancia).toBeCloseTo(referencia?.distancia ?? NaN, 9);
    }
  });

  it("calcula muito menos distâncias que a força bruta em n grande", () => {
    const pontos = pontosAleatorios(10000, 100000, geradorAleatorio(3));
    const dc: Contador = { distancias: 0 };
    const bruta: Contador = { distancias: 0 };
    parMaisProximo(pontos, dc);
    parMaisProximoForcaBruta(pontos, bruta);

    expect(bruta.distancias).toBe((10000 * 9999) / 2);
    expect(dc.distancias).toBeLessThan(10000 * Math.log2(10000));
  });

  it("registra a divisória e a faixa 2δ da primeira chamada (#9)", () => {
    // Metades: {0,1,2} e {3,4,5}; nos dois lados o melhor par é (49,50) → δ = hypot(49, 50) ≈ 70
    const pontos = pontosDe([0, 0], [0, 100], [49, 50], [51, 50], [100, 0], [100, 100]);
    const rastro: Rastro = {};
    const r = parMaisProximo(pontos, undefined, rastro);

    expect(rastro.divisao?.xMeio).toBe(51); // x do 4º ponto em ordem de x
    expect(rastro.divisao?.delta).toBeCloseTo(Math.hypot(49, 50), 9);
    expect(rastro.divisao?.faixa.sort()).toEqual([0, 1, 2, 3, 4, 5]); // todos a menos de 70 de x = 51
    expect(rastro.divisao?.delta).toBeGreaterThanOrEqual(r?.distancia ?? Infinity);
  });

  it("não registra divisão no caso base", () => {
    const rastro: Rastro = {};
    parMaisProximo(pontosDe([0, 0], [50, 50], [51, 50]), undefined, rastro);
    expect(rastro.divisao).toBeUndefined();
  });
});

describe("calcularMatch", () => {
  it("indica o parceiro quando você faz parte do par", () => {
    const match = calcularMatch(usuarios);
    expect(match?.parceiro?.nome).toBe("Ana");
    expect(match?.pontos).toHaveLength(usuarios.length);
  });

  it("entrega a divisão pronta para a visualização", () => {
    const match = calcularMatch(usuarios);
    const divisao = match?.divisao;
    expect(divisao).not.toBeNull();
    // Toda pessoa marcada na faixa está a menos de δ da divisória
    for (const id of divisao?.faixa ?? []) {
      const p = match?.pontos.find((q) => q.id === id);
      expect(Math.abs((p?.x ?? Infinity) - (divisao?.xMeio ?? 0))).toBeLessThan(divisao?.delta ?? 0);
    }
    expect(calcularMatch(usuarios.slice(0, 3))?.divisao).toBeNull();
  });

  it("muda o resultado quando você troca de cidade", () => {
    const longe = usuarios.map((u) =>
      u.ehVoce ? { ...u, cidade: "Porto Alegre - RS", latitude: -30.0346, longitude: -51.2177 } : u,
    );
    const match = calcularMatch(longe);
    expect(match?.parceiro).toBeNull();
    expect(match?.usuarioA.ehVoce || match?.usuarioB.ehVoce).toBe(false);

    const vizinho = usuarios.map((u) =>
      u.ehVoce ? { ...u, cidade: "Manaus - AM", latitude: -3.119, longitude: -60.0217 } : u,
    );
    expect(calcularMatch(vizinho)?.parceiro?.nome).toBe("Felipe");
    expect(calcularMatch(vizinho)?.distancia).toBe(0);
  });

  it("retorna null sem usuários suficientes", () => {
    expect(calcularMatch(usuarios.slice(0, 1))).toBeNull();
  });
});
