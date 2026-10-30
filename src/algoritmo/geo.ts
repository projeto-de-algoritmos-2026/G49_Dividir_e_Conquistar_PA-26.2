import type { Ponto, Usuario } from "../tipos";

const RAIO_TERRA_KM = 6371;
// Latitude de referência (Brasília) para a projeção equiretangular
const LAT_REF = (-15.79 * Math.PI) / 180;

/**
 * Converte latitude/longitude em um ponto no plano (km), para que a
 * distância euclidiana usada pelo algoritmo faça sentido.
 * TODO (#1): revisar a projeção e documentar o erro aproximado.
 */
export function paraPonto(u: Usuario): Ponto {
  const lat = (u.latitude * Math.PI) / 180;
  const lon = (u.longitude * Math.PI) / 180;
  return {
    id: u.id,
    x: RAIO_TERRA_KM * lon * Math.cos(LAT_REF),
    y: RAIO_TERRA_KM * lat,
  };
}

export function distancia(p: Ponto, q: Ponto): number {
  return Math.hypot(p.x - q.x, p.y - q.y);
}
