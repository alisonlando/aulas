const camadas = [
  {
    numero: 7,
    nome: "Aplicação",
    descricao: "Fornece serviços de rede diretamente aos programas utilizados pelo usuário.",
    pdu: "Dados",
    protocolos: "HTTP, HTTPS, DNS, FTP, SMTP, DHCP",
    equipamento: "Computador, servidor",
    acaoOrigem: "A aplicação cria os dados que serão transmitidos.",
    acaoDestino: "A aplicação recebe e apresenta os dados ao usuário."
  },
  {
    numero: 6,
    nome: "Apresentação",
    descricao: "Realiza tradução de formatos, codificação, compressão e criptografia.",
    pdu: "Dados",
    protocolos: "TLS/SSL, JPEG, PNG, UTF-8",
    equipamento: "Computador, servidor",
    acaoOrigem: "Os dados são formatados, codificados e, quando necessário, criptografados.",
    acaoDestino: "Os dados são decodificados, descomprimidos ou descriptografados."
  },
  {
    numero: 5,
    nome: "Sessão",
    descricao: "Estabelece, mantém, sincroniza e encerra sessões de comunicação.",
    pdu: "Dados",
    protocolos: "RPC, NetBIOS, SIP",
    equipamento: "Computador, servidor",
    acaoOrigem: "Uma sessão de comunicação é criada e controlada.",
    acaoDestino: "A sessão é identificada, mantida e posteriormente encerrada."
  },
  {
    numero: 4,
    nome: "Transporte",
    descricao: "Realiza comunicação fim a fim, controle de fluxo, confiabilidade e uso de portas.",
    pdu: "Segmento ou datagrama",
    protocolos: "TCP, UDP",
    equipamento: "Firewall, balanceador",
    acaoOrigem: "São adicionadas as portas de origem e destino. Os dados tornam-se um segmento ou datagrama.",
    acaoDestino: "As portas identificam o processo de destino e o cabeçalho de transporte é removido."
  },
  {
    numero: 3,
    nome: "Rede",
    descricao: "Define o endereçamento lógico e seleciona caminhos entre redes diferentes.",
    pdu: "Pacote",
    protocolos: "IPv4, IPv6, ICMP, IPsec",
    equipamento: "Roteador",
    acaoOrigem: "São adicionados os endereços IP. O segmento torna-se um pacote.",
    acaoDestino: "O endereço IP de destino é verificado e o cabeçalho de rede é removido."
  },
  {
    numero: 2,
    nome: "Enlace de Dados",
    descricao: "Organiza os dados em quadros, utiliza endereços MAC e detecta erros no enlace.",
    pdu: "Quadro",
    protocolos: "Ethernet, Wi-Fi, PPP, ARP",
    equipamento: "Switch, bridge, placa de rede",
    acaoOrigem: "São adicionados endereços MAC e verificação de erros. O pacote torna-se um quadro.",
    acaoDestino: "O quadro é validado e o cabeçalho e o trailer de enlace são removidos."
  },
  {
    numero: 1,
    nome: "Física",
    descricao: "Transmite bits por sinais elétricos, ópticos ou ondas de rádio.",
    pdu: "Bits",
    protocolos: "1000BASE-T, fibra óptica, rádio 802.11",
    equipamento: "Cabos, conectores, repetidor, hub",
    acaoOrigem: "O quadro é convertido em uma sequência de bits e sinais físicos.",
    acaoDestino: "Os sinais recebidos são convertidos novamente em bits."
  }
];

const mensagensDesafio = [
  { texto: "Em qual camada são utilizados os endereços IP?", resposta: 3 },
  { texto: "Em qual camada um switch Ethernet atua principalmente?", resposta: 2 },
  { texto: "Em qual camada os dados são convertidos em bits?", resposta: 1 },
  { texto: "Em qual camada são utilizados TCP, UDP e números de porta?", resposta: 4 },
  { texto: "Qual camada fornece serviços como HTTP, DNS e FTP?", resposta: 7 },
  { texto: "Qual camada pode realizar criptografia e compressão?", resposta: 6 },
  { texto: "Qual camada estabelece e encerra sessões de comunicação?", resposta: 5 },
  { texto: "Em qual camada a PDU é chamada de quadro?", resposta: 2 },
  { texto: "Em qual camada um roteador toma decisões de encaminhamento?", resposta: 3 },
  { texto: "Em qual camada a PDU pode ser chamada de segmento?", resposta: 4 }
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
  document.querySelector("#chipProtocolos").textContent = `Exemplos: ${camada.protocolos}`;
  document.querySelector("#chipEquipamento").textContent = `Dispositivos: ${camada.equipamento}`;
}

function criarTabela() {
  const corpo = document.querySelector("#corpoTabela");
  corpo.innerHTML = camadas.map(camada => `
    <tr>
      <td><strong>${camada.numero}</strong></td>
      <td>${camada.nome}</td>
      <td>${camada.descricao}</td>
      <td>${camada.pdu}</td>
      <td>${camada.protocolos}</td>
    </tr>
  `).join("");
}

function gerarPassos() {
  passos = [];

  camadas.forEach(camada => {
    passos.push({
      lado: "origem",
      camada: camada.numero,
      texto: camada.numero === 7
        ? `${camada.acaoOrigem} Protocolo selecionado: ${protocoloEl.value}. Mensagem: “${mensagemEl.value.trim()}”`
        : camada.acaoOrigem
    });
  });

  passos.push({
    lado: "rede",
    camada: 0,
    texto: "Os bits atravessam o meio físico e os equipamentos intermediários até o computador de destino."
  });

  [...camadas].reverse().forEach(camada => {
    passos.push({
      lado: "destino",
      camada: camada.numero,
      texto: camada.acaoDestino
    });
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

  const percentual = ((indicePasso + 1) / passos.length) * 100;
  barraProgresso.style.width = `${percentual}%`;

  if (passo.lado === "rede") {
    pacoteViajante.textContent = "01001101 01100101";
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
  document.querySelectorAll(".camada").forEach(el => el.classList.remove("processada"));
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
  const indice = Math.floor(Math.random() * mensagensDesafio.length);
  desafioAtual = mensagensDesafio[indice];
  perguntaRespondida = false;
  document.querySelector("#perguntaDesafio").textContent = desafioAtual.texto;
  document.querySelector("#feedback").textContent = "";
  document.querySelector("#feedback").className = "feedback";

  const opcoes = [...camadas]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  if (!opcoes.some(c => c.numero === desafioAtual.resposta)) {
    opcoes[Math.floor(Math.random() * opcoes.length)] =
      camadas.find(c => c.numero === desafioAtual.resposta);
  }

  opcoes.sort(() => Math.random() - 0.5);

  const area = document.querySelector("#opcoesDesafio");
  area.innerHTML = "";

  opcoes.forEach(camada => {
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
mostrarDetalhes(7);
atualizarVelocidade();
contadorEl.textContent = mensagemEl.value.length;
