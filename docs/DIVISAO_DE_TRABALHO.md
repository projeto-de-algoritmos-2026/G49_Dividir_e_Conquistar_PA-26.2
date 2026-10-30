# Divisão de trabalho

| Papel | Pessoa | Foco |
| -- | -- | -- |
| **Pessoa A** | Gabriel | Algoritmo, dados, integração e documentação |
| **Pessoa B** | Samuel | Interface (HTML/CSS), telas, visualização e testes manuais |

Cada tarefa tem uma issue no GitHub com o checklist completo e o critério de "pronto".

## Pessoa A — Gabriel

| # | Tarefa | Entrega |
| -- | -- | -- |
| [#1](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/1) | Modelagem dos dados e banco local | `tipos.ts`, `usuarios.json`, `banco.ts`, `geo.ts` |
| [#2](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/2) | Algoritmo par de pontos mais próximos (dividir e conquistar) | `parMaisProximo.ts` em O(n log n) |
| [#3](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/3) | Força bruta + testes de validação | `forcaBruta.ts` e `tests/parMaisProximo.test.ts` |
| [#4](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/4) | Integração do algoritmo com a interface | Menu mostra o match e recalcula ao editar o perfil |
| [#5](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/5) | Documentação final e vídeo | README completo, análise de complexidade, vídeo |

## Pessoa B — Samuel

| # | Tarefa | Entrega |
| -- | -- | -- |
| [#6](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/6) | Layout base e identidade visual | `global.css`, cabeçalho, componentes, responsivo |
| [#7](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/7) | Página de menu com os cards dos usuários | `index.html` + `paginas/menu.ts` |
| [#8](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/8) | Página de perfil com edição de localização | `perfil.html` + `paginas/perfil.ts` |
| [#9](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/9) | Card de match e visualização dos pontos | Card "Quem está mais perto de você?" + desenho SVG/canvas |
| [#10](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/10) | Testes manuais, revisão de PRs e gravação | Roteiro de testes, screenshots, vídeo |

## Ordem sugerida

As duas pessoas podem começar ao mesmo tempo, porque o setup já define os tipos e as funções que cada lado usa.

```
Semana 1   A: #1 dados → #2 algoritmo          B: #6 layout → #7 menu
Semana 2   A: #3 testes → #4 integração        B: #8 perfil → #9 card/visualização
Semana 3   A: #5 documentação + vídeo          B: #10 testes manuais + vídeo
```

Pontos de encontro entre as duas partes:

- **#4 depende de #2, #7 e #9**: a integração liga o resultado do algoritmo ao card e ao desenho.
- **#9 recebe dados prontos**: a visualização só desenha o par e o `δ` que a integração passa, sem recalcular nada.
- **#8 grava no banco de #1**: o perfil usa `salvarUsuarios()`, e o menu lê com `carregarUsuarios()`.

## Fluxo no Git

1. Uma branch por issue: `feat/2-algoritmo`, `feat/7-menu` etc.
2. Commits pequenos, mencionando a issue (`#2`).
3. Pull Request para `main` com `Closes #N` na descrição.
4. A outra pessoa revisa o PR antes do merge.
5. Antes de abrir o PR: `npm test` e `npm run build` passando.
