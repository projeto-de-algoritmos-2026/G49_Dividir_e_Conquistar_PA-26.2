# Pertinho — Dividir e Conquistar

**Número da Lista**: G49<br>
**Conteúdo da Disciplina**: Dividir e Conquistar — Par de Pontos Mais Próximos<br>

## Alunos

| Matrícula | Aluno |
| -- | -- |
| 231011382 | Gabriel Sampaio (Pessoa A) |
| xx/xxxxxxx | Samuel (Pessoa B) |

## Sobre

**Pertinho** é uma micro rede social que roda inteira no navegador, sem servidor e sem internet. Ela tem duas páginas:

- **Menu**: lista as pessoas da rede e responde *"Quem está mais perto de você?"*, num estilo parecido com o "match" de apps de encontro.
- **Perfil**: mostra e edita os seus dados (nome, bio e localização).

A rede tem **7 usuários**: você e mais 6 perfis fictícios em cidades diferentes do Brasil. Os dados ficam num "banco" local: um arquivo JSON inicial (`src/dados/usuarios.json`), com as edições salvas no `localStorage` do navegador.

### O algoritmo

A localização de cada usuário (latitude/longitude) é convertida em um ponto no plano, em km, por uma projeção equiretangular. Depois o algoritmo **Par de Pontos Mais Próximos** encontra, entre todos os usuários, as duas pessoas que estão mais perto uma da outra:

1. **Pré-processamento**: ordena os pontos por `x` e por `y`, uma única vez.
2. **Dividir**: separa os pontos em duas metades pela mediana de `x`.
3. **Conquistar**: resolve cada metade recursivamente e guarda a menor distância encontrada, `δ = min(δ_esq, δ_dir)`.
4. **Combinar**: um par mais próximo que `δ` só pode atravessar a divisória se os dois pontos estiverem na faixa de largura `2δ` em volta dela. Nessa faixa, ordenada por `y`, basta comparar cada ponto com **no máximo os 7 seguintes**.
5. **Caso base**: com 3 pontos ou menos, compara todos os pares.

A recorrência é `T(n) = 2T(n/2) + O(n)`, que dá **O(n log n)**, contra O(n²) da força bruta. A versão de força bruta fica no projeto só para validar o resultado nos testes.

Se você faz parte do par mais próximo, o menu mostra quem é o seu "match". Se não fizer, mostra quem são os dois usuários mais próximos da rede. Ao mudar a sua cidade no perfil, o resultado é recalculado.

## Screenshots

> Serão adicionadas ao final do desenvolvimento ([#5](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/5), [#10](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/10)).

## Instalação

**Linguagem**: TypeScript<br>
**Framework**: nenhum (HTML + CSS + TypeScript puro, com [Vite](https://vite.dev/) como servidor de desenvolvimento)<br>

Pré-requisito: [Node.js](https://nodejs.org/) 20 ou superior.

```bash
git clone https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2.git
cd G49_Dividir_e_Conquistar_PA-26.2
npm install
npm run dev
```

Depois, abra o endereço mostrado no terminal (por padrão, http://localhost:5173).

| Comando | O que faz |
| -- | -- |
| `npm run dev` | Sobe o servidor de desenvolvimento |
| `npm test` | Roda os testes do algoritmo (Vitest) |
| `npm run build` | Checa os tipos e gera a versão final em `dist/` |
| `npm run preview` | Serve a versão gerada pelo build |

## Uso

1. Abra o **Menu** para ver as pessoas da rede e quem está mais perto de você.
2. Vá em **Meu perfil**, troque a sua cidade e salve.
3. Volte ao menu: o algoritmo roda de novo com a nova localização.

## Estrutura do projeto

```
├── index.html               # página de menu
├── perfil.html              # página de perfil
├── src/
│   ├── algoritmo/
│   │   ├── parMaisProximo.ts  # dividir e conquistar, O(n log n)
│   │   ├── forcaBruta.ts      # referência O(n²) para os testes
│   │   └── geo.ts             # lat/lon -> plano (km) e distância
│   ├── dados/
│   │   ├── usuarios.json      # seed: você + 6 usuários fictícios
│   │   └── banco.ts           # leitura e escrita no localStorage
│   ├── paginas/
│   │   ├── menu.ts
│   │   └── perfil.ts
│   ├── styles/global.css
│   └── tipos.ts
└── tests/
    └── parMaisProximo.test.ts
```

## Divisão de trabalho

São 5 tarefas por pessoa, cada uma com uma issue no GitHub. Os detalhes estão em [docs/DIVISAO_DE_TRABALHO.md](docs/DIVISAO_DE_TRABALHO.md).

| Pessoa A — Gabriel | Pessoa B — Samuel |
| -- | -- |
| [#1](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/1) Modelagem dos dados e banco local | [#6](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/6) Layout base e identidade visual |
| [#2](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/2) Algoritmo par de pontos mais próximos | [#7](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/7) Página de menu com os cards |
| [#3](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/3) Força bruta + testes de validação | [#8](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/8) Página de perfil com edição de localização |
| [#4](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/4) Integração do algoritmo com a interface | [#9](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/9) Card de match e visualização dos pontos |
| [#5](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/5) Documentação final e vídeo | [#10](https://github.com/projeto-de-algoritmos-2026/G49_Dividir_e_Conquistar_PA-26.2/issues/10) Testes manuais, revisão e gravação |

## Outros

- O projeto não usa nenhum serviço externo; tudo roda localmente no navegador.
- Para voltar aos dados iniciais, use o botão "resetar dados" (ou limpe o `localStorage` do site).
