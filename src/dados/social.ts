// Tudo aqui é mockado: a "vida social" da rede é escrita à mão e o que você
// adiciona (posts, curtidas, recados) fica só no localStorage deste navegador.
import { gravar, ler } from "./armazem";
import type { Especie } from "./bichinhos";

export type Status = "online" | "ausente" | "ocupado" | "offline";

export const NOMES_STATUS: Record<Status, string> = {
  online: "online",
  ausente: "ausente",
  ocupado: "ocupado",
  offline: "offline",
};

export interface PerfilSocial {
  status: Status;
  humor: string;
  ouvindo: string;
  interesses: string[];
  fas: number;
  /** Notas de 0 a 3, como os ícones de karma de uma rede social antiga */
  confiavel: number;
  legal: number;
  bichinho: { nome: string; especie: Especie; humor: string };
}

export const PERFIS: Record<number, PerfilSocial> = {
  0: {
    status: "online",
    humor: "descobrindo a rede",
    ouvindo: "o barulho do modem discando",
    interesses: ["algoritmos", "internet discada", "bichinhos virtuais"],
    fas: 3,
    confiavel: 3,
    legal: 3,
    bichinho: { nome: "Bitinho", especie: "gato", humor: "de boa (^_^)" },
  },
  1: {
    status: "online",
    humor: "cafeinada",
    ouvindo: "Skank — Vou Deixar",
    interesses: ["café coado", "trilhas", "show no Bolshoi Pub"],
    fas: 128,
    confiavel: 3,
    legal: 3,
    bichinho: { nome: "Pequi", especie: "coelho", humor: "radiante! \\(^o^)/" },
  },
  2: {
    status: "ocupado",
    humor: "compilando",
    ouvindo: "Charlie Brown Jr. — Só os Loucos Sabem",
    interesses: ["skate", "JavaScript", "pastel de feira"],
    fas: 87,
    confiavel: 2,
    legal: 3,
    bichinho: { nome: "Byte", especie: "cachorro", humor: "de boa (^_^)" },
  },
  3: {
    status: "ausente",
    humor: "na praia, volto já",
    ouvindo: "Marcelo D2 — Qual É?",
    interesses: ["altinha", "pôr do sol no Arpoador", "açaí"],
    fas: 214,
    confiavel: 2,
    legal: 3,
    bichinho: { nome: "Maré", especie: "pintinho", humor: "radiante! \\(^o^)/" },
  },
  4: {
    status: "online",
    humor: "esperando o pão de queijo sair",
    ouvindo: "Pato Fu — Antes Que Seja Tarde",
    interesses: ["pão de queijo", "boteco", "Winamp skins"],
    fas: 56,
    confiavel: 3,
    legal: 2,
    bichinho: { nome: "Queijinho", especie: "gato", humor: "com fome (;﹏;)" },
  },
  5: {
    status: "offline",
    humor: "revelando fotos",
    ouvindo: "Pitty — Máscara",
    interesses: ["fotografia analógica", "acarajé", "fotolog"],
    fas: 173,
    confiavel: 3,
    legal: 3,
    bichinho: { nome: "Dendê", especie: "gato", humor: "de boa (^_^)" },
  },
  6: {
    status: "ausente",
    humor: "sem sinal, na beira do rio",
    ouvindo: "Nação Zumbi — Manguetown",
    interesses: ["livros", "pesca", "conexão de 56k"],
    fas: 42,
    confiavel: 3,
    legal: 2,
    bichinho: { nome: "Tucumã", especie: "sapo", humor: "de boa (^_^)" },
  },
};

export interface Comentario {
  autorId: number;
  texto: string;
}

export interface Post {
  id: string;
  autorId: number;
  titulo: string;
  texto: string;
  data: string;
  humor: string;
  ouvindo?: string;
  curtidas: number;
  comentarios: Comentario[];
}

const POSTS_SEED: Post[] = [
  {
    id: "s1",
    autorId: 4,
    titulo: "Troquei a skin do Winamp e minha vida mudou",
    texto:
      "Passei a madrugada inteira testando skins. A vencedora é uma azul metálica com chamas. Minha mãe precisou usar o telefone às 3 da manhã, então perdi a conexão e o download de 4 horas. Recomeçando amanhã.",
    data: "14/03/2005 às 23:41",
    humor: "orgulhoso",
    ouvindo: "Pato Fu — Antes Que Seja Tarde",
    curtidas: 12,
    comentarios: [
      { autorId: 2, texto: "manda a skin por MSN! prometo não cair dessa vez" },
      { autorId: 1, texto: "chamas?? isso é muito 2003, Diego" },
    ],
  },
  {
    id: "s2",
    autorId: 1,
    titulo: "Sete motivos para fazer café antes da aula das 8h",
    texto:
      "1) Café. 2) Café. 3) Dizem que a aula é sobre dividir e conquistar, e eu só consigo dividir a atenção. 4 a 7) Café. Sério: a Pequi roeu meu fone, então vou ouvir música em voz alta até segunda ordem.",
    data: "02/05/2005 às 07:12",
    humor: "cafeinada",
    ouvindo: "Skank — Vou Deixar",
    curtidas: 31,
    comentarios: [{ autorId: 3, texto: "a Pequi tem razão, esse fone já tinha passado da hora" }],
  },
  {
    id: "s3",
    autorId: 5,
    titulo: "Fotolog novo: 40 fotos do Pelourinho",
    texto:
      "Só posso subir uma foto por dia na conta grátis, então até agosto o álbum fica pronto. Assine o livro de visitas e prometo que retribuo. Quem quiser a foto em alta, me passa um disquete. Brincadeira. Quase.",
    data: "21/06/2005 às 18:05",
    humor: "inspirada",
    ouvindo: "Pitty — Máscara",
    curtidas: 47,
    comentarios: [
      { autorId: 6, texto: "aqui a foto demora tanto para carregar que dá tempo de ler um capítulo" },
      { autorId: 4, texto: "assinei o livro de visitas! retribui lá :)" },
    ],
  },
  {
    id: "s4",
    autorId: 2,
    titulo: "Fiz um site com frames e não me arrependo",
    texto:
      "Menu à esquerda, contador de visitas embaixo e um GIF de obras no meio. Melhor visualizado em 800x600 no Internet Explorer 6. Sim, tem música de fundo em MIDI. Não, não dá para desligar.",
    data: "09/08/2005 às 01:33",
    humor: "compilando",
    ouvindo: "Charlie Brown Jr. — Só os Loucos Sabem",
    curtidas: 23,
    comentarios: [{ autorId: 5, texto: "o MIDI me deu um susto às 2 da manhã, parabéns" }],
  },
  {
    id: "s5",
    autorId: 3,
    titulo: "Corrente: repasse para 10 amigos ou o Maré fica triste",
    texto:
      "Recebi por e-mail e achei justo: quem não repassar vai ter a conexão derrubada na hora do download. O Maré é um pintinho virtual e não tem culpa de nada, mas a corrente é clara nesse ponto.",
    data: "30/10/2005 às 16:20",
    humor: "supersticiosa",
    ouvindo: "Marcelo D2 — Qual É?",
    curtidas: 8,
    comentarios: [
      { autorId: 2, texto: "repassei para 9. se eu sumir, foi isso." },
      { autorId: 1, texto: "pelo Maré, eu repasso" },
    ],
  },
  {
    id: "s6",
    autorId: 6,
    titulo: "Atualizando daqui de Manaus, se a conexão deixar",
    texto:
      "Escrevi este post no bloco de notas e estou esperando a internet voltar para colar. Enquanto isso, li um livro inteiro. Segundo a rede, sou o mais distante de todo mundo. Faz sentido, o algoritmo não mente.",
    data: "11/01/2006 às 20:48",
    humor: "paciente",
    ouvindo: "Nação Zumbi — Manguetown",
    curtidas: 19,
    comentarios: [{ autorId: 1, texto: "a gente manda um abraço por carta" }],
  },
];

export interface Recado {
  paraId: number;
  autorId: number;
  texto: string;
  data: string;
}

const RECADOS_SEED: Recado[] = [
  { paraId: 1, autorId: 4, texto: "Ana!! Passa aqui em BH, o pão de queijo tá saindo.", data: "03/04/2005" },
  { paraId: 1, autorId: 3, texto: "Me adiciona no MSN, perdi seu e-mail quando o PC formatou.", data: "12/04/2005" },
  { paraId: 2, autorId: 5, texto: "Aquela manobra no vídeo: foi de propósito?", data: "20/05/2005" },
  { paraId: 3, autorId: 2, texto: "Respondi à corrente. Por favor, não derrube minha conexão.", data: "01/11/2005" },
  { paraId: 3, autorId: 6, texto: "Sua foto da praia demorou 12 minutos para abrir. Valeu a pena.", data: "04/11/2005" },
  { paraId: 4, autorId: 1, texto: "Queijinho está com fome, viu? Olha lá o perfil dele.", data: "18/06/2005" },
  { paraId: 5, autorId: 4, texto: "Passei no seu fotolog e deixei um oi, retribui?", data: "22/06/2005" },
  { paraId: 6, autorId: 3, texto: "Chegou a carta? Saudade daí!", data: "15/01/2006" },
  { paraId: 0, autorId: 1, texto: "Bem-vindo à rede! Vem ver meu coelho.", data: "hoje" },
  { paraId: 0, autorId: 2, texto: "Já alimentou o Bitinho? Ele reclama, hein.", data: "hoje" },
];

export const AVISOS_LETREIRO = [
  "✦ bem-vindo ao pertinho, a rede que usa dividir e conquistar para achar seu par",
  "♥ Elisa atualizou o fotolog",
  "★ Diego trocou a skin do Winamp (de novo)",
  "♪ Ana está ouvindo Skank",
  "✉ você tem recados novos no seu perfil",
  "⚠ não atenda o telefone durante o download",
];

export const MUSICAS = [
  { titulo: "Skank — Vou Deixar", duracao: 214 },
  { titulo: "Pitty — Máscara", duracao: 187 },
  { titulo: "Charlie Brown Jr. — Só os Loucos Sabem", duracao: 203 },
  { titulo: "Pato Fu — Antes Que Seja Tarde", duracao: 225 },
  { titulo: "Nação Zumbi — Manguetown", duracao: 241 },
];

export function perfilSocial(id: number): PerfilSocial {
  return PERFIS[id] ?? PERFIS[0];
}

function ehListaDePosts(d: unknown): d is Post[] {
  return (
    Array.isArray(d) &&
    d.every((p: Post) => typeof p?.id === "string" && typeof p.titulo === "string" && typeof p.texto === "string")
  );
}

function ehListaDeTextos(d: unknown): d is string[] {
  return Array.isArray(d) && d.every((t) => typeof t === "string");
}

function ehListaDeRecados(d: unknown): d is Recado[] {
  return (
    Array.isArray(d) && d.every((r: Recado) => typeof r?.paraId === "number" && typeof r.texto === "string")
  );
}

/** Seus posts primeiro (mais novos no topo), depois os mockados */
export function carregarPosts(): Post[] {
  return [...ler("posts", ehListaDePosts, []), ...POSTS_SEED];
}

export function publicarPost(post: Post): void {
  gravar("posts", [post, ...ler("posts", ehListaDePosts, [])]);
}

export function carregarCurtidas(): string[] {
  return ler("curtidas", ehListaDeTextos, []);
}

export function alternarCurtida(idPost: string): void {
  const curtidas = carregarCurtidas();
  gravar(
    "curtidas",
    curtidas.includes(idPost) ? curtidas.filter((id) => id !== idPost) : [...curtidas, idPost],
  );
}

/** Recados de uma pessoa, do mais novo para o mais antigo */
export function carregarRecados(paraId: number): Recado[] {
  const meus = ler("recados", ehListaDeRecados, []).filter((r) => r.paraId === paraId);
  return [...meus, ...RECADOS_SEED.filter((r) => r.paraId === paraId).reverse()];
}

export function deixarRecado(recado: Recado): void {
  gravar("recados", [recado, ...ler("recados", ehListaDeRecados, [])]);
}
