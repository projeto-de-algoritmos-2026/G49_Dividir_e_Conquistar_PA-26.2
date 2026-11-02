import type { Especie } from "../dados/bichinhos";
import { escapeHtml } from "../html";

// Desenhos de 12x12. Legenda: . vazio, o contorno, c corpo, b barriga, d orelha,
// p rosa, y bico/pé, e/E olho (parte de cima e de baixo)
export const SPRITES: Record<Especie, string[]> = {
  gato: [
    ".o........o.",
    "oco......oco",
    "occoooooocco",
    "occcccccccco",
    "occeccccecco",
    "occEcppcEcco",
    "occcboobccco",
    ".occcccccco.",
    ".ocbbbbbbco.",
    ".ocbbbbbbco.",
    ".occoooocco.",
    "..oo....oo..",
  ],
  cachorro: [
    "...oooooo...",
    "..occcccco..",
    ".ooccccccoo.",
    "oddccccccddo",
    "oddceccecddo",
    "oddcEccEcddo",
    ".oocboobcoo.",
    "...ocbbco...",
    "..occcccco..",
    ".occcccccco.",
    ".occoccocco.",
    "..ooo..ooo..",
  ],
  coelho: [
    "..oo....oo..",
    ".opco..ocpo.",
    ".opco..ocpo.",
    ".opco..ocpo.",
    "..oooooooo..",
    ".occcccccco.",
    "occeccccecco",
    "occEcppcEcco",
    "occcboobccco",
    ".ocbbbbbbco.",
    ".ocbbbbbbco.",
    "..oooooooo..",
  ],
  pintinho: [
    ".....oo.....",
    "....occo....",
    "...occcco...",
    "..occcccco..",
    ".ocecccceco.",
    ".ocEccccEco.",
    ".occcyyccco.",
    "ococcccccoco",
    "ococcccccoco",
    ".occcccccco.",
    "..oooooooo..",
    "...yy..yy...",
  ],
  sapo: [
    ".ooo....ooo.",
    "obebo..obebo",
    "obEboooobEbo",
    "occcccccccco",
    "occcccccccco",
    "occoooooocco",
    "occcbbbbccco",
    ".ocbbbbbbco.",
    ".ocbbbbbbco.",
    "ooccooooccoo",
    "occo....occo",
    "oooo....oooo",
  ],
};

interface Cores {
  corpo: string;
  barriga: string;
  orelha: string;
}

const CORES: Record<Especie, Cores> = {
  gato: { corpo: "#f0a35e", barriga: "#fde3c4", orelha: "#f0a35e" },
  cachorro: { corpo: "#d9b98a", barriga: "#f6e8d0", orelha: "#8a5a2b" },
  coelho: { corpo: "#f2eee8", barriga: "#ffffff", orelha: "#f2eee8" },
  pintinho: { corpo: "#f7d84a", barriga: "#fdf0a8", orelha: "#f7d84a" },
  sapo: { corpo: "#7cc36a", barriga: "#d5efc0", orelha: "#7cc36a" },
};

const CONTORNO = "#2a2f3d";

function corDoPixel(pixel: string, cores: Cores, dormindo: boolean): string | null {
  switch (pixel) {
    case "o":
      return CONTORNO;
    case "c":
      return cores.corpo;
    case "b":
      return cores.barriga;
    case "d":
      return cores.orelha;
    case "p":
      return "#f28ca8";
    case "y":
      return "#e8892b";
    case "e":
      return dormindo ? cores.corpo : CONTORNO; // dormindo, sobra só a linha do olho fechado
    case "E":
      return CONTORNO;
    default:
      return null;
  }
}

/** Desenha o bichinho em SVG, com um retângulo por pixel */
export function spriteBichinho(especie: Especie, tamanho: number, rotulo: string, dormindo = false): string {
  const cores = CORES[especie];
  const pixels = SPRITES[especie].flatMap((linha, y) =>
    [...linha].map((pixel, x) => {
      const cor = corDoPixel(pixel, cores, dormindo);
      return cor ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${cor}"/>` : "";
    }),
  );
  return `<svg class="sprite" role="img" aria-label="${escapeHtml(rotulo)}" width="${tamanho}" height="${tamanho}" viewBox="0 0 12 12" shape-rendering="crispEdges">${pixels.join("")}</svg>`;
}
