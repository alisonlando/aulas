const camadas = [
  {
    numero: 4,
    nome: "Aplicação",
    descricao: "Reúne os serviços utilizados pelas aplicações do usuário e corresponde às camadas de Aplicação, Apresentação e Sessão do modelo OSI.",
    pdu: "Dados",
    protocolos: "HTTP, HTTPS, DNS, FTP, SMTP, DHCP, SSH",
    equipamento: "Computador, servidor",
    osi: "Aplicação, Apresentação e Sessão",
    acaoOrigem: "A aplicação cria os dados e utiliza um protocolo de aplicação.",
    acaoDestino: "A aplicação recebe, interpreta e apresenta os dados ao usuário."
  },
  {
    numero: 3,
    nome: "Transporte",
    descricao: "Realiza a comunicação fim a fim, utiliza números de porta e pode oferecer confiabilidade, controle de fluxo e retransmissão.",
    pdu: "Segmento ou datagrama",
    protocolos: "TCP, UDP",
    equipamento: "Firewall, balanceador",
    osi: "Transporte",
    acaoOrigem: "São adicionados números de porta e informações de controle.",
    acaoDestino: "O cabeçalho de transporte é analisado e removido."
  },
  {
    numero: 2,
    nome: "Internet",
    descricao: "Realiza o endereçamento lógico e o roteamento de pacotes entre redes diferentes.",
    pdu: "Pacote",
    protocolos: "IPv4, IPv6, ICMP, IPsec",
    equipamento: "Roteador",
    osi: "Rede",
    acaoOrigem: "São adicionados os endereços IP de origem e destino.",
    acaoDestino: "O endereço IP de destino é verificado e o cabeçalho IP é removido."
  },
  {
    numero: 1,
    nome: "Acesso à Rede",
    descricao: "Controla o acesso ao meio físico, utiliza endereços MAC e transmite os bits por cabos, fibra óptica ou ondas de rádio.",
    pdu: "Quadro e bits",
    protocolos: "Ethernet, Wi-Fi, PPP, ARP",
    equipamento: "Switch, placa de rede, cabos, access point",
    osi: "Enlace de Dados e Física",
    acaoOrigem: "O pacote recebe endereços MAC, torna-se um quadro e depois é convertido em bits.",
    acaoDestino: "Os bits são convertidos em quadro, validados e entregues à camada Internet."
  }
];

const perguntas = [
  { texto: "Em qual camada do TCP/IP são utilizados HTTP, DNS e FTP?", resposta: 4 },
  { texto: "Em qual camada atuam TCP e UDP?", resposta: 3 },
  { texto: "Em qual camada são utilizados endereços IP?", resposta: 2 },
  { texto: "Em qual camada são utilizados endereços MAC?", resposta: 1 },
  { texto: "Em qual camada atua principalmente um roteador?", resposta: 2 },
  { texto: "Qual camada corresponde às camadas Aplicação, Apresentação e Sessão do OSI?", resposta: 4 },
  { texto: "Em qual camada a PDU pode ser chamada de segmento?", resposta: 3 },
  { texto: "Em qual camada os quadros são convertidos em sinais físicos?", resposta: 1 },
  { texto: "Em qual camada ocorre o roteamento entre redes?", resposta: 2 },
  { texto: "Em qual camada são utilizados números de porta?", resposta: 3 }
];

const pilhaOrigem = document.querySelector("#pilhaOrigem");
const pilhaDestino = document.querySelector("#pilhaDestino");
const statusEl = document.querySelector("#status");
const logEl = document.querySelector("#log");
const barraProgresso = document.querySelector("#barraProgresso");
const pacoteViajante = document.querySelector("#pacoteViajante");
const mensagemEl = document.querySelector("#mensagem");
const contadorEl = document.querySelector("#contador");
const protocoloEl = document.querySelector("#protocolo");
const transporteEl = document.querySelector("#transporte");
const btnIniciar = document.querySelector("#btnIniciar");
const btnPasso = document.querySelector("#btnPasso");
const btnReiniciar = document.querySelector("#btnReiniciar");
const modoAutomatico = document.querySelector("#modoAutomatico");
const velocidadeEl = document.querySelector("#velocidade");
const textoVelocidade = document.querySelector("#textoVelocidade");

let passos = [];
let indicePasso = -1;
let temporizador = null;
let simulacaoAtiva = false;
let acertos = 0;
let desafioAtual = null;
let perguntaRespondida = false;

function criarPilha(container, classe) {
  container.innerHTML = "";
  container.classList.add(classe);

  camadas.forEach(camada => {
    const elemento = document.createElement("button");
    elemento.className = "camada";
    elemento.dataset.camada = camada.numero;
    elemento.innerHTML = `
      <span class="num">${camada.numero}</span>
      <span><strong>${camada.nome}</strong><br><small>${camada.pdu}</small></span>
    `;
    elemento.addEventListener("click", () => mostrarDetalhes(camada.numero));
    container.appendChild(elemento);
  });
}

function mostrarDetalhes(numero) {
  const camada = camadas.find(item => item.numero === numero);
  document.querySelector("#numeroCamada").textContent = camada.numero;
  document.querySelector("#nomeCamada").textContent = `Camada ${camada.numero} — ${camada.nome}`;
  document.querySelector("#descricaoCamada").textContent = camada.descricao;
  document.querySelector("#chipPdu").textContent = `PDU: ${camada.pdu}`;
  document.querySelector("#chipProtocolos").textContent = `Protocolos: ${camada.protocolos}`;
  document.querySelector("#chipEquipamento").textContent = `Equipamentos: ${camada.equipamento}`;
}

function criarTabela() {
  document.querySelector("#corpoTabela").innerHTML = camadas.map(camada => `
    <tr>
      <td><strong>${camada.numero} — ${camada.nome}</strong></td>
      <td>${camada.descricao}</td>
      <td>${camada.pdu}</td>
      <td>${camada.protocolos}</td>
      <td>${camada.osi}</td>
    </tr>
  `).join("");
}

function gerarPassos() {
  passos = [];

  camadas.forEach(camada => {
    let texto = camada.acaoOrigem;

    if (camada.numero === 4) {
      texto += ` Protocolo selecionado: ${protocoloEl.value}. Mensagem: “${mensagemEl.value.trim()}”`;
    }

    if (camada.numero === 3) {
      texto += ` Protocolo selecionado: ${transporteEl.value}.`;
    }

    passos.push({ lado: "origem", camada: camada.numero, texto });
  });

  passos.push({
    lado: "rede",
    camada: 0,
    texto: "Os bits atravessam o meio físico, passam por switches e roteadores e seguem até o destino."
  });

  [...camadas].reverse().forEach(camada => {
    passos.push({ lado: "destino", camada: camada.numero, texto: camada.acaoDestino });
  });
}

function limparDestaques() {
  document.querySelectorAll(".camada").forEach(el => el.classList.remove("ativa"));
}

function marcarCamada(lado, numero) {
  limparDestaques();
  if (lado === "rede") return;

  const seletor = lado === "origem" ? "#pilhaOrigem" : "#pilhaDestino";
  const camadaEl = document.querySelector(`${seletor} .camada[data-camada="${numero}"]`);
  camadaEl?.classList.add("ativa");
  mostrarDetalhes(numero);
}

function adicionarLog(texto, tipo) {
  if (logEl.querySelector(".neutra")) logEl.innerHTML = "";

  const linha = document.createElement("div");
  linha.className = `linha-log ${tipo}`;
  const horario = new Date().toLocaleTimeString("pt-BR");
  linha.textContent = `[${horario}] ${texto}`;
  logEl.prepend(linha);
}

function executarPasso() {
  if (!simulacaoAtiva) return;

  indicePasso++;

  if (indicePasso >= passos.length) {
    finalizarSimulacao();
    return;
  }

  const passo = passos[indicePasso];
  marcarCamada(passo.lado, passo.camada);
  adicionarLog(passo.texto, passo.lado);
  statusEl.textContent = passo.texto;

  barraProgresso.style.width = `${((indicePasso + 1) / passos.length) * 100}%`;

  if (passo.lado === "rede") {
    pacoteViajante.textContent = "01010100 01000011 01010000";
    pacoteViajante.classList.remove("viajando");
    void pacoteViajante.offsetWidth;
    pacoteViajante.style.transitionDuration = `${Number(velocidadeEl.value) / 1000}s`;
    pacoteViajante.classList.add("viajando");
  } else if (passo.lado === "origem") {
    pacoteViajante.textContent = camadas.find(c => c.numero === passo.camada)?.pdu || "Dados";
  } else {
    pacoteViajante.classList.remove("viajando");
  }

  if (modoAutomatico.checked) {
    temporizador = setTimeout(executarPasso, Number(velocidadeEl.value));
  }
}

function iniciarSimulacao() {
  if (!mensagemEl.value.trim()) {
    mensagemEl.focus();
    statusEl.textContent = "Digite uma mensagem antes de iniciar.";
    return;
  }

  reiniciarEstadoVisual(false);
  gerarPassos();
  indicePasso = -1;
  simulacaoAtiva = true;
  btnIniciar.disabled = true;
  btnPasso.disabled = modoAutomatico.checked;
  adicionarLog("Transmissão iniciada.", "neutra");
  executarPasso();
}

function finalizarSimulacao() {
  clearTimeout(temporizador);
  simulacaoAtiva = false;
  btnIniciar.disabled = false;
  btnPasso.disabled = true;
  limparDestaques();
  barraProgresso.style.width = "100%";
  pacoteViajante.classList.remove("viajando");
  statusEl.textContent = `Transmissão concluída. A mensagem “${mensagemEl.value.trim()}” chegou à aplicação de destino.`;
  adicionarLog("Transmissão concluída com sucesso.", "destino");
}

function reiniciarEstadoVisual(limparLog = true) {
  clearTimeout(temporizador);
  temporizador = null;
  simulacaoAtiva = false;
  indicePasso = -1;
  passos = [];
  limparDestaques();
  barraProgresso.style.width = "0";
  pacoteViajante.classList.remove("viajando");
  pacoteViajante.textContent = "Bits";
  statusEl.textContent = "Aguardando o início da simulação.";
  btnIniciar.disabled = false;
  btnPasso.disabled = true;

  if (limparLog) {
    logEl.innerHTML = '<div class="linha-log neutra">O diário ainda está vazio.</div>';
  }
}

function atualizarVelocidade() {
  const valor = Number(velocidadeEl.value);
  textoVelocidade.textContent =
    valor <= 700 ? "Rápida" :
    valor <= 1400 ? "Normal" :
    "Lenta";
}

function novaPergunta() {
  desafioAtual = perguntas[Math.floor(Math.random() * perguntas.length)];
  perguntaRespondida = false;
  document.querySelector("#perguntaDesafio").textContent = desafioAtual.texto;
  document.querySelector("#feedback").textContent = "";
  document.querySelector("#feedback").className = "feedback";

  const area = document.querySelector("#opcoesDesafio");
  area.innerHTML = "";

  [...camadas].sort(() => Math.random() - 0.5).forEach(camada => {
    const botao = document.createElement("button");
    botao.className = "opcao-desafio";
    botao.textContent = `${camada.numero} — ${camada.nome}`;
    botao.addEventListener("click", () => responderDesafio(camada.numero, botao));
    area.appendChild(botao);
  });
}

function responderDesafio(numero, botaoClicado) {
  if (perguntaRespondida || !desafioAtual) return;
  perguntaRespondida = true;

  const feedback = document.querySelector("#feedback");
  const botoes = [...document.querySelectorAll(".opcao-desafio")];

  botoes.forEach(botao => {
    botao.disabled = true;
    if (botao.textContent.startsWith(`${desafioAtual.resposta} —`)) {
      botao.classList.add("correta");
    }
  });

  if (numero === desafioAtual.resposta) {
    acertos++;
    document.querySelector("#acertos").textContent = acertos;
    feedback.textContent = "Correto! Muito bem.";
    feedback.classList.add("sucesso");
  } else {
    botaoClicado.classList.add("errada");
    const correta = camadas.find(c => c.numero === desafioAtual.resposta);
    feedback.textContent = `Resposta incorreta. A resposta correta é a camada ${correta.numero} — ${correta.nome}.`;
    feedback.classList.add("erro");
  }

  mostrarDetalhes(desafioAtual.resposta);
}

btnIniciar.addEventListener("click", iniciarSimulacao);
btnPasso.addEventListener("click", executarPasso);
btnReiniciar.addEventListener("click", () => reiniciarEstadoVisual(true));
document.querySelector("#btnLimparLog").addEventListener("click", () => {
  logEl.innerHTML = '<div class="linha-log neutra">O diário ainda está vazio.</div>';
});
document.querySelector("#btnNovaPergunta").addEventListener("click", novaPergunta);
document.querySelector("#btnReiniciarPlacar").addEventListener("click", () => {
  acertos = 0;
  document.querySelector("#acertos").textContent = "0";
  document.querySelector("#feedback").textContent = "";
});
document.querySelector("#btnTema").addEventListener("click", () => {
  document.body.classList.toggle("tema-escuro");
});
mensagemEl.addEventListener("input", () => {
  contadorEl.textContent = mensagemEl.value.length;
});
velocidadeEl.addEventListener("input", atualizarVelocidade);
modoAutomatico.addEventListener("change", () => {
  if (simulacaoAtiva) {
    btnPasso.disabled = modoAutomatico.checked;
    clearTimeout(temporizador);
    if (modoAutomatico.checked) {
      temporizador = setTimeout(executarPasso, Number(velocidadeEl.value));
    }
  }
});

criarPilha(pilhaOrigem, "origem-pilha");
criarPilha(pilhaDestino, "destino-pilha");
criarTabela();
mostrarDetalhes(4);
atualizarVelocidade();
contadorEl.textContent = mensagemEl.value.length;
