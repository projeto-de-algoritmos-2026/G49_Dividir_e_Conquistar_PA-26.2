const ENTIDADES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escapa texto para HTML, inclusive dentro de atributos (value="...") */
export function escapeHtml(texto: string): string {
  return texto.replace(/[&<>"']/g, (c) => ENTIDADES[c]);
}
