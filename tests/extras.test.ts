import { describe, expect, it } from "vitest";
import { nLogN, paresForcaBruta, pontosAleatorios, medir } from "../src/algoritmo/comparacao";
import { SPRITES } from "../src/componentes/sprites";
import {
  alimentar,
  aplicarTempo,
  brincar,
  dormir,
  humorDoBichinho,
  novoBichinho,
} from "../src/dados/bichinhos";
import { PERFIS } from "../src/dados/social";
import seed from "../src/dados/usuarios.json";

const HORA_MS = 60 * 60 * 1000;

describe("bichinho virtual", () => {
  it("as barras caem com o tempo, sem passar de zero", () => {
    const novo = novoBichinho(0);
    const depois = aplicarTempo(novo, 5 * HORA_MS);
    expect(depois.barriga).toBe(50);
    expect(depois.alegria).toBe(55);
    expect(depois.energia).toBe(60);

    const abandonado = aplicarTempo(novo, 1000 * HORA_MS);
    expect(abandonado.barriga).toBe(0);
    expect(abandonado.alegria).toBe(0);
    expect(abandonado.energia).toBe(0);
  });

  it("um relógio que volta no tempo não aumenta as barras", () => {
    const novo = novoBichinho(10 * HORA_MS);
    expect(aplicarTempo(novo, 0).barriga).toBe(novo.barriga);
  });

  it("as ações mudam as barras e respeitam o limite de 100", () => {
    const novo = novoBichinho(0);
    expect(alimentar(novo).barriga).toBe(95);
    expect(alimentar(alimentar(novo)).barriga).toBe(100);
    expect(dormir(novo).energia).toBe(100);

    const brincou = brincar(novo);
    expect(brincou.alegria).toBe(90);
    expect(brincou.energia).toBe(60);
    expect(brincou.barriga).toBe(65);
  });

  it("o humor acompanha a pior barra", () => {
    const novo = novoBichinho(0);
    expect(humorDoBichinho(novo)).toContain("radiante");
    expect(humorDoBichinho({ ...novo, barriga: 50 })).toContain("de boa");
    expect(humorDoBichinho({ ...novo, barriga: 5 })).toContain("fome");
    expect(humorDoBichinho({ ...novo, alegria: 5 })).toContain("entediado");
    expect(humorDoBichinho({ ...novo, energia: 5 })).toContain("sono");
  });
});

describe("dados mockados", () => {
  it("todo sprite tem 12x12 pixels", () => {
    for (const linhas of Object.values(SPRITES)) {
      expect(linhas).toHaveLength(12);
      for (const linha of linhas) expect(linha).toHaveLength(12);
    }
  });

  it("todo usuário do seed tem um perfil social", () => {
    for (const u of seed) expect(PERFIS[u.id]).toBeDefined();
  });
});

describe("comparação de complexidade", () => {
  it("calcula as fórmulas da tabela", () => {
    expect(paresForcaBruta(1000)).toBe(499500);
    expect(nLogN(1024)).toBe(10240);
  });

  it("mede as duas versões sobre os mesmos pontos", () => {
    const medida = medir(pontosAleatorios(500), 1);
    expect(medida.n).toBe(500);
    expect(medida.mesmoResultado).toBe(true);
    expect(medida.distanciasForcaBruta).toBe(paresForcaBruta(500));
    expect(medida.distanciasDividir).toBeLessThan(medida.distanciasForcaBruta);
  });
});
