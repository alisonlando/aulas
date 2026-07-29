const networkData = {
  LAN: {
    title: "LAN — Rede Local",
    topologyTitle: "Rede LAN",
    description: "Conecta dispositivos em uma área pequena, como uma sala, laboratório, casa ou empresa.",
    icon: "🏫",
    area: "Prédio",
    latency: "1–5 ms",
    device: "Switch",
    example: "Laboratório",
    nodes: [
      { id: "pc1", label: "PC 1", icon: "🖥️", x: 18, y: 22 },
      { id: "pc2", label: "PC 2", icon: "🖥️", x: 18, y: 72 },
      { id: "switch", label: "Switch", icon: "🔀", x: 50, y: 47 },
      { id: "server", label: "Servidor", icon: "🗄️", x: 82, y: 22 },
      { id: "printer", label: "Impressora", icon: "🖨️", x: 82, y: 72 }
    ],
    links: [
      ["pc1", "switch"],
      ["pc2", "switch"],
      ["switch", "server"],
      ["switch", "printer"]
    ]
  },
  MAN: {
    title: "MAN — Rede Metropolitana",
    topologyTitle: "Rede MAN",
    description: "Interliga várias redes locais dentro de uma cidade ou região metropolitana.",
    icon: "🏙️",
    area: "Cidade",
    latency: "5–20 ms",
    device: "Roteadores",
    example: "Campi",
    nodes: [
      { id: "campusA", label: "Campus A", icon: "🏫", x: 15, y: 28 },
      { id: "routerA", label: "Roteador A", icon: "📡", x: 35, y: 42 },
      { id: "metro", label: "Rede Metropolitana", icon: "🏙️", x: 55, y: 50 },
      { id: "routerB", label: "Roteador B", icon: "📡", x: 75, y: 42 },
      { id: "campusB", label: "Campus B", icon: "🏫", x: 90, y: 24 },
      { id: "campusC", label: "Campus C", icon: "🏢", x: 78, y: 77 }
    ],
    links: [
      ["campusA", "routerA"],
      ["routerA", "metro"],
      ["metro", "routerB"],
      ["routerB", "campusB"],
      ["routerB", "campusC"]
    ]
  },
  WAN: {
    title: "WAN — Rede Internacional",
    topologyTitle: "Rede WAN Internacional",
    description: "Conecta redes localizadas em diferentes cidades e países, utilizando operadoras e a infraestrutura da Internet.",
    icon: "🌍",
    area: "Países",
    latency: "40–250 ms",
    device: "Roteadores/ISP",
    example: "Rede global",
    nodes: [
      { id: "curitiba", label: "Curitiba — Brasil", icon: "🇧🇷", x: 12, y: 22 },
      { id: "routerBrasil", label: "Roteador Brasil", icon: "📡", x: 28, y: 40 },
      { id: "internet", label: "Internet Global", icon: "🌐", x: 50, y: 50 },
      { id: "routerEuropa", label: "Roteador Europa", icon: "📡", x: 70, y: 32 },
      { id: "lisboa", label: "Lisboa — Portugal", icon: "🇵🇹", x: 88, y: 18 },
      { id: "toquio", label: "Tóquio — Japão", icon: "🇯🇵", x: 88, y: 76 },
      { id: "novaiorque", label: "Nova York — EUA", icon: "🇺🇸", x: 66, y: 78 }
    ],
    links: [
      ["curitiba", "routerBrasil"],
      ["routerBrasil", "internet"],
      ["internet", "routerEuropa"],
      ["routerEuropa", "lisboa"],
      ["internet", "toquio"],
      ["internet", "novaiorque"]
    ]
  }
};

const challenges = [
  {
    question: "Uma rede conecta os computadores de um laboratório dentro da mesma universidade.",
    answer: "LAN"
  },
  {
    question: "Três campi universitários localizados na mesma cidade são interligados.",
    answer: "MAN"
  },
  {
    question: "Uma empresa conecta seus escritórios no Brasil, em Portugal, nos Estados Unidos e no Japão.",
    answer: "WAN"
  },
  {
    question: "Computadores, impressoras e servidores de um único escritório estão conectados.",
    answer: "LAN"
  },
  {
    question: "Órgãos públicos de diferentes bairros de uma mesma cidade estão conectados por fibra.",
    answer: "MAN"
  },
  {
    question: "Uma universidade conecta seus servidores de Curitiba a centros de pesquisa em Lisboa e Tóquio.",
    answer: "WAN"
  }
];

let currentNetwork = "LAN";
let currentChallenge = 0;
let packetElement = null;
let isAnimating = false;

const topology = document.getElementById("topology");
const sourceSelect = document.getElementById("sourceSelect");
const destinationSelect = document.getElementById("destinationSelect");
const simulationResult = document.getElementById("simulationResult");
const logContent = document.getElementById("logContent");

function getNode(network, id) {
  return networkData[network].nodes.find(node => node.id === id);
}


function renderTopology() {
  topology.innerHTML = "";
  topology.className = `topology ${currentNetwork.toLowerCase()}-topology`;

  const data = networkData[currentNetwork];

  data.nodes.forEach(node => {
    const nodeElement = document.createElement("div");
    nodeElement.className = "node";
    nodeElement.dataset.nodeId = node.id;
    nodeElement.style.left = `${node.x}%`;
    nodeElement.style.top = `${node.y}%`;

    nodeElement.innerHTML = `
      <div class="node-icon">${node.icon}</div>
      <span>${node.label}</span>
    `;

    topology.appendChild(nodeElement);
  });

  populateSelects();
}

function populateSelects() {
  const options = networkData[currentNetwork].nodes
    .filter(node => !["switch", "metro", "internet", "routerA", "routerB", "routerBrasil", "routerEuropa"].includes(node.id))
    .map(node => `<option value="${node.id}">${node.label}</option>`)
    .join("");

  sourceSelect.innerHTML = options;
  destinationSelect.innerHTML = options;

  if (destinationSelect.options.length > 1) {
    destinationSelect.selectedIndex = 1;
  }
}

function updateInfo() {
  const data = networkData[currentNetwork];
  document.getElementById("networkTitle").textContent = data.title;
  document.getElementById("topologyTitle").textContent = data.topologyTitle;
  document.getElementById("networkDescription").textContent = data.description;
  document.getElementById("infoIcon").textContent = data.icon;
  document.getElementById("metricArea").textContent = data.area;
  document.getElementById("metricLatency").textContent = data.latency;
  document.getElementById("metricDevice").textContent = data.device;
  document.getElementById("metricExample").textContent = data.example;
}

function buildGraph() {
  const graph = {};
  const data = networkData[currentNetwork];

  data.nodes.forEach(node => graph[node.id] = []);
  data.links.forEach(([a, b]) => {
    graph[a].push(b);
    graph[b].push(a);
  });

  return graph;
}

function findPath(start, end) {
  const graph = buildGraph();
  const queue = [[start]];
  const visited = new Set();

  while (queue.length) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === end) return path;
    if (visited.has(node)) continue;

    visited.add(node);

    graph[node].forEach(neighbor => {
      queue.push([...path, neighbor]);
    });
  }

  return [];
}

function addLog(message, color = "success") {
  const p = document.createElement("p");
  const symbolColor = color === "danger" ? "#fb7185" : color === "warning" ? "#fbbf24" : "#34d399";
  p.innerHTML = `<span style="color:${symbolColor}">●</span> ${message}`;
  logContent.appendChild(p);
  logContent.scrollTop = logContent.scrollHeight;
}

function activateNode(id, isDestination = false) {
  document.querySelectorAll(".node").forEach(node => node.classList.remove("active", "visited", "destination"));
  const target = document.querySelector(`[data-node-id="${id}"]`);

  if (target) {
    target.classList.add("active");

    if (isDestination) {
      target.classList.add("destination");
    }
  }
}

function markVisited(id) {
  const target = document.querySelector(`[data-node-id="${id}"]`);
  if (target) {
    target.classList.remove("active");
    target.classList.add("visited");
  }
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function animatePacket(path) {
  isAnimating = true;
  document.getElementById("sendPacketBtn").disabled = true;

  packetElement = document.createElement("div");
  packetElement.className = "packet";
  topology.appendChild(packetElement);

  for (let i = 0; i < path.length; i++) {
    const node = getNode(currentNetwork, path[i]);
    const isDestination = i === path.length - 1;

    activateNode(node.id, isDestination);
    packetElement.style.left = `${node.x}%`;
    packetElement.style.top = `${node.y}%`;

    const label = node.label;
    addLog(
      isDestination ? `Pacote chegou ao destino: ${label}` : `Pacote passando por: ${label}`,
      isDestination ? "success" : "warning"
    );

    await wait(i === 0 ? 250 : 900);

    if (!isDestination) {
      markVisited(node.id);
    }
  }

  await wait(500);
  packetElement.remove();
  packetElement = null;

  isAnimating = false;
  document.getElementById("sendPacketBtn").disabled = false;
}

async function sendPacket() {
  if (isAnimating) return;

  const source = sourceSelect.value;
  const destination = destinationSelect.value;

  if (source === destination) {
    simulationResult.textContent = "A origem e o destino devem ser diferentes.";
    addLog("Falha: origem e destino são iguais.", "danger");
    return;
  }

  const path = findPath(source, destination);
  const sourceName = getNode(currentNetwork, source).label;
  const destinationName = getNode(currentNetwork, destination).label;
  const data = networkData[currentNetwork];

  if (!path.length) {
    simulationResult.textContent = "Não foi possível encontrar uma rota.";
    addLog("Falha: rota não encontrada.", "danger");
    return;
  }

  simulationResult.innerHTML = `
    <strong>${sourceName}</strong> → <strong>${destinationName}</strong><br>
    Tipo: ${currentNetwork} | Latência estimada: ${data.latency}<br>
    Saltos percorridos: ${path.length - 1}
  `;

  addLog(`Envio iniciado: ${sourceName} → ${destinationName}`, "warning");
  await animatePacket(path);
  addLog(`Pacote entregue com sucesso em ${destinationName}.`);
}

function resetSimulation() {
  if (packetElement) packetElement.remove();
  packetElement = null;
  isAnimating = false;
  document.getElementById("sendPacketBtn").disabled = false;
  document.querySelectorAll(".node").forEach(node => node.classList.remove("active", "visited", "destination"));
  simulationResult.textContent = "Selecione a origem e o destino para iniciar.";
  logContent.innerHTML = "<p><span>●</span> Simulação reiniciada.</p>";
}

document.querySelectorAll(".network-tab").forEach(button => {
  button.addEventListener("click", () => {
    if (isAnimating) return;

    document.querySelectorAll(".network-tab").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentNetwork = button.dataset.network;

    updateInfo();
    renderTopology();
    resetSimulation();
    addLog(`Cenário alterado para ${currentNetwork}.`);
  });
});

document.getElementById("sendPacketBtn").addEventListener("click", sendPacket);
document.getElementById("resetBtn").addEventListener("click", resetSimulation);
document.getElementById("clearLogBtn").addEventListener("click", () => {
  logContent.innerHTML = "";
});

function loadChallenge() {
  const challenge = challenges[currentChallenge];
  document.getElementById("challengeQuestion").textContent = challenge.question;
  document.getElementById("challengeFeedback").textContent = "";

  document.querySelectorAll(".challenge-options button").forEach(button => {
    button.classList.remove("correct", "wrong");
    button.disabled = false;
  });
}

document.querySelectorAll(".challenge-options button").forEach(button => {
  button.addEventListener("click", () => {
    const chosen = button.dataset.answer;
    const correct = challenges[currentChallenge].answer;

    document.querySelectorAll(".challenge-options button").forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.answer === correct) btn.classList.add("correct");
    });

    if (chosen === correct) {
      document.getElementById("challengeFeedback").textContent =
        `Correto! A resposta é ${correct}.`;
    } else {
      button.classList.add("wrong");
      document.getElementById("challengeFeedback").textContent =
        `Não é ${chosen}. A resposta correta é ${correct}.`;
    }
  });
});

document.getElementById("nextChallengeBtn").addEventListener("click", () => {
  currentChallenge = (currentChallenge + 1) % challenges.length;
  loadChallenge();
});

updateInfo();
renderTopology();
loadChallenge();
