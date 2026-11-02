import "../layout";
import { montarTamagotchi } from "../componentes/bichinho";
import { carregarUsuarios, salvarUsuarios, usuarioAtual } from "../dados/banco";
import { CIDADES_BRASIL } from "../dados/cidades";
import { escapeHtml } from "../html";
import type { Usuario } from "../tipos";

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("Elemento #app não encontrado no DOM");

const todosUsuarios: Usuario[] = carregarUsuarios();
const voce = usuarioAtual(todosUsuarios);

// Verifica se a cidade inicial do usuário está na lista de cidades predefinidas
const cidadePredefinidaInicial = CIDADES_BRASIL.find(
  (c) =>
    c.nome.toLowerCase() === voce.cidade.toLowerCase() ||
    (Math.abs(c.latitude - voce.latitude) < 0.001 && Math.abs(c.longitude - voce.longitude) < 0.001),
);

app.innerHTML = `
  <div class="perfil-previa">
    <section class="caixa">
      <h2 class="caixa-titulo">Prévia do seu perfil na rede</h2>
      <div class="caixa-corpo">
        <article class="card-usuario card-voce" id="card-previa">
          <div class="avatar avatar-voce" id="previa-avatar">${escapeHtml(voce.nome[0] ?? "V")}</div>
          <div class="card-info">
            <div class="card-cabecalho">
              <h3 class="card-nome">
                <span id="previa-nome">${escapeHtml(voce.nome)}</span>
                <span class="selo-voce">Você</span>
              </h3>
              <span class="selo" id="previa-cidade">${escapeHtml(voce.cidade)}</span>
            </div>
            <p class="card-bio" id="previa-bio">${escapeHtml(voce.bio)}</p>
            <div class="card-rodape">
              <span id="previa-coords">${voce.latitude.toFixed(2)}°, ${voce.longitude.toFixed(2)}°</span>
              <span class="selo-voce">✦ Seu perfil ativo</span>
            </div>
          </div>
        </article>
        <p class="match-como"><a href="/pessoa.html?id=${voce.id}">Ver minha página, como os outros veem →</a></p>
      </div>
    </section>
  </div>

  <section class="caixa">
    <h2 class="caixa-titulo">Meu bichinho</h2>
    <div class="caixa-corpo" id="area-bichinho"></div>
  </section>

  <section class="caixa">
    <h2 class="caixa-titulo">Editar meus dados e localização</h2>
    <div class="caixa-corpo">
      <div id="mensagem-feedback"></div>

      <form id="form-perfil" novalidate>
        <div class="campo">
          <label for="campo-nome">Nome ou apelido:</label>
          <input
            type="text"
            id="campo-nome"
            name="nome"
            value="${escapeHtml(voce.nome)}"
            maxlength="40"
            required
          />
          <span class="campo-ajuda">Como você quer ser exibido para os outros membros da rede.</span>
        </div>

        <div class="campo">
          <label for="campo-bio">Biografia ou recado:</label>
          <textarea
            id="campo-bio"
            name="bio"
            rows="3"
            maxlength="140"
          >${escapeHtml(voce.bio)}</textarea>
          <span class="campo-ajuda">Frase curta ou descrição (máximo 140 caracteres).</span>
        </div>

        <div class="campo">
          <label for="select-cidade">Cidade rápida (preenche coordenadas automaticamente):</label>
          <select id="select-cidade">
            <option value="personalizada">-- Digitar manualmente / Outra cidade --</option>
            ${CIDADES_BRASIL.map(
              (c) =>
                `<option value="${escapeHtml(c.nome)}" ${
                  cidadePredefinidaInicial?.nome === c.nome ? "selected" : ""
                }>${escapeHtml(c.nome)}</option>`,
            ).join("")}
          </select>
          <span class="campo-ajuda">Selecione uma cidade para preencher a localização geográfica instantaneamente.</span>
        </div>

        <div class="campo">
          <label for="campo-cidade">Nome da cidade / Estado:</label>
          <input
            type="text"
            id="campo-cidade"
            name="cidade"
            value="${escapeHtml(voce.cidade)}"
            required
          />
        </div>

        <div class="grade-dupla">
          <div class="campo">
            <label for="campo-latitude">Latitude (-90 a 90):</label>
            <input
              type="number"
              id="campo-latitude"
              name="latitude"
              step="any"
              min="-90"
              max="90"
              value="${voce.latitude}"
              required
            />
          </div>
          <div class="campo">
            <label for="campo-longitude">Longitude (-180 a 180):</label>
            <input
              type="number"
              id="campo-longitude"
              name="longitude"
              step="any"
              min="-180"
              max="180"
              value="${voce.longitude}"
              required
            />
          </div>
        </div>
        <span class="campo-ajuda">
          As coordenadas são convertidas em um plano cartesiano em km para calcular o par de pontos mais próximos via Dividir e Conquistar.
        </span>

        <div class="acoes-formulario">
          <button type="submit" class="botao botao-dourado" id="btn-salvar">Salvar alterações</button>
          <a href="/" class="botao">Cancelar e voltar</a>
        </div>
      </form>
    </div>
  </section>
`;

montarTamagotchi(document.querySelector<HTMLElement>("#area-bichinho")!);

// Elementos da interface
const form = document.querySelector<HTMLFormElement>("#form-perfil")!;
const campoNome = document.querySelector<HTMLInputElement>("#campo-nome")!;
const campoBio = document.querySelector<HTMLTextAreaElement>("#campo-bio")!;
const selectCidade = document.querySelector<HTMLSelectElement>("#select-cidade")!;
const campoCidade = document.querySelector<HTMLInputElement>("#campo-cidade")!;
const campoLatitude = document.querySelector<HTMLInputElement>("#campo-latitude")!;
const campoLongitude = document.querySelector<HTMLInputElement>("#campo-longitude")!;
const mensagemContainer = document.querySelector<HTMLElement>("#mensagem-feedback")!;

// Elementos da prévia
const previaAvatar = document.querySelector<HTMLElement>("#previa-avatar")!;
const previaNome = document.querySelector<HTMLElement>("#previa-nome")!;
const previaCidade = document.querySelector<HTMLElement>("#previa-cidade")!;
const previaBio = document.querySelector<HTMLElement>("#previa-bio")!;
const previaCoords = document.querySelector<HTMLElement>("#previa-coords")!;

function atualizarPrevia(): void {
  const nome = campoNome.value.trim() || "Você";
  const bio = campoBio.value.trim() || "(Sem bio informada)";
  const cidade = campoCidade.value.trim() || "(Cidade não informada)";
  const lat = parseFloat(campoLatitude.value);
  const lon = parseFloat(campoLongitude.value);

  previaAvatar.textContent = nome[0]?.toUpperCase() ?? "V";
  previaNome.textContent = nome;
  previaBio.textContent = bio;
  previaCidade.textContent = cidade;

  if (!isNaN(lat) && !isNaN(lon)) {
    previaCoords.textContent = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
  } else {
    previaCoords.textContent = "Coordenadas incompletas";
  }
}

// Ao trocar a cidade no dropdown
selectCidade.addEventListener("change", () => {
  const selecionada = selectCidade.value;
  if (selecionada === "personalizada") {
    campoCidade.focus();
    return;
  }

  const encontrada = CIDADES_BRASIL.find((c) => c.nome === selecionada);
  if (encontrada) {
    campoCidade.value = encontrada.nome;
    campoLatitude.value = encontrada.latitude.toString();
    campoLongitude.value = encontrada.longitude.toString();
    atualizarPrevia();
  }
});

// Ao editar campos manualmente
campoNome.addEventListener("input", atualizarPrevia);
campoBio.addEventListener("input", atualizarPrevia);
campoCidade.addEventListener("input", () => {
  const cidadeDigitada = campoCidade.value.trim();
  const encontrada = CIDADES_BRASIL.find(
    (c) => c.nome.toLowerCase() === cidadeDigitada.toLowerCase(),
  );
  selectCidade.value = encontrada ? encontrada.nome : "personalizada";
  atualizarPrevia();
});

campoLatitude.addEventListener("input", () => {
  selectCidade.value = "personalizada";
  atualizarPrevia();
});

campoLongitude.addEventListener("input", () => {
  selectCidade.value = "personalizada";
  atualizarPrevia();
});

// Ao submeter o formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();
  mensagemContainer.innerHTML = "";

  const nome = campoNome.value.trim();
  const bio = campoBio.value.trim();
  const cidade = campoCidade.value.trim();
  const latStr = campoLatitude.value.trim();
  const lonStr = campoLongitude.value.trim();

  // Validações
  if (!nome) {
    exibirErro("Por favor, informe seu nome ou apelido.");
    campoNome.focus();
    return;
  }

  if (!cidade) {
    exibirErro("Por favor, informe o nome da sua cidade.");
    campoCidade.focus();
    return;
  }

  const lat = parseFloat(latStr);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    exibirErro("A latitude deve ser um número válido entre -90 e 90.");
    campoLatitude.focus();
    return;
  }

  const lon = parseFloat(lonStr);
  if (isNaN(lon) || lon < -180 || lon > 180) {
    exibirErro("A longitude deve ser um número válido entre -180 e 180.");
    campoLongitude.focus();
    return;
  }

  // Atualização no banco local
  try {
    const usuarios = carregarUsuarios();
    const indiceVoce = usuarios.findIndex((u) => u.ehVoce);

    if (indiceVoce === -1) {
      exibirErro("Erro interno: perfil principal não encontrado.");
      return;
    }

    usuarios[indiceVoce] = {
      ...usuarios[indiceVoce],
      nome,
      bio,
      cidade,
      latitude: lat,
      longitude: lon,
    };

    salvarUsuarios(usuarios);

    mensagemContainer.innerHTML = `
      <div class="mensagem-alerta sucesso">
        ✦ Perfil atualizado com sucesso! Redirecionando para o menu...
      </div>
    `;

    const btnSalvar = document.querySelector<HTMLButtonElement>("#btn-salvar");
    if (btnSalvar) btnSalvar.disabled = true;

    setTimeout(() => {
      window.location.href = "/";
    }, 700);
  } catch (err) {
    exibirErro(`Erro ao salvar no banco local: ${err instanceof Error ? err.message : String(err)}`);
  }
});

function exibirErro(mensagem: string): void {
  mensagemContainer.innerHTML = `
    <div class="mensagem-alerta erro">
      ⚠️ ${escapeHtml(mensagem)}
    </div>
  `;
}
