import type { Ponto, Usuario } from "../tipos";
import { paraPonto } from "./geo";
import { parMaisProximo } from "./parMaisProximo";

export interface Match {
  usuarioA: Usuario;
  usuarioB: Usuario;
  /** δ: a menor distância da rede, em km */
  distancia: number;
  /** A outra pessoa do par, quando você faz parte dele */
  parceiro: Usuario | null;
  /** Todos os pontos no plano, para a visualização (#9) não recalcular nada */
  pontos: Ponto[];
}

/** Roda o par de pontos mais próximos sobre a rede e traduz os pontos de volta em usuários. */
export function calcularMatch(usuarios: Usuario[]): Match | null {
  const pontos = usuarios.map(paraPonto);
  const resultado = parMaisProximo(pontos);
  if (!resultado) return null;

  const usuarioA = usuarios.find((u) => u.id === resultado.a.id);
  const usuarioB = usuarios.find((u) => u.id === resultado.b.id);
  if (!usuarioA || !usuarioB) return null;

  const parceiro = usuarioA.ehVoce ? usuarioB : usuarioB.ehVoce ? usuarioA : null;
  return { usuarioA, usuarioB, distancia: resultado.distancia, parceiro, pontos };
}
