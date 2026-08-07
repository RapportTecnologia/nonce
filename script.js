/*
 * Laboratório didático de Nonce / Blockchain
 * ------------------------------------------------------------
 * Este arquivo não usa bibliotecas externas. O SHA-256 é calculado
 * em JavaScript para que a mineração didática consiga testar muitos
 * nonces rapidamente no próprio navegador.
 *
 * IMPORTANTE: a estrutura de bloco deste laboratório é conceitual.
 * Uma rede real (como Bitcoin) possui serialização, cabeçalho,
 * dificuldade e regras de consenso próprias.
 */

const $ = (id) => document.getElementById(id);

const els = {
  version: $("version"),
  height: $("height"),
  timestamp: $("timestamp"),
  previousHash: $("previousHash"),
  nonce: $("nonce"),
  merkleRoot: $("merkleRoot"),
  difficulty: $("difficulty"),
  difficultyLabel: $("difficultyLabel"),
  nonceMirror: $("nonceMirror"),
  payloadPreview: $("payloadPreview"),
  currentHash: $("currentHash"),
  validityMessage: $("validityMessage"),
  calculateBtn: $("calculateBtn"),
  incrementBtn: $("incrementBtn"),
  mineBtn: $("mineBtn"),
  stopBtn: $("stopBtn"),
  attempts: $("attempts"),
  elapsed: $("elapsed"),
  hashRate: $("hashRate"),
  previousCalculatedHash: $("previousCalculatedHash"),
  compareCurrentHash: $("compareCurrentHash"),
  bitDifference: $("bitDifference"),
  bitDifferenceBar: $("bitDifferenceBar"),
  attemptHistory: $("attemptHistory"),
  clearHistory: $("clearHistory"),
  chainPrevHash: $("chainPrevHash"),
  chainCurrentHash: $("chainCurrentHash"),
  chainNextPrevHash: $("chainNextPrevHash"),
  sealBtn: $("sealBtn"),
  sealStatus: $("sealStatus"),
  chainIntegrity: $("chainIntegrity")
};

let lastHash = null;
let currentHash = "";
let isMining = false;
let stopRequested = false;
let sealedHash = null;
let sealedNextPreviousHash = null;
let historyCounter = 0;

// --------------------------- SHA-256 ---------------------------
// Implementação compacta e determinística de SHA-256 para texto UTF-8.
// Retorna 64 caracteres hexadecimais (256 bits).
function sha256(text) {
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = "length";
  let i, j;
  let result = "";
  const words = [];

  let hash = sha256.h = sha256.h || [];
  const k = sha256.k = sha256.k || [];
  let primeCounter = k[lengthProperty];
  const isComposite = {};

  if (!primeCounter) {
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
  }

  // Converte a string UTF-16 do JavaScript para uma string de bytes UTF-8.
  let ascii = unescape(encodeURIComponent(text));
  const asciiBitLength = ascii[lengthProperty] * 8;

  ascii += "\x80";
  while (ascii[lengthProperty] % 64 - 56) ascii += "\x00";

  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) throw new Error("Caracter inválido na conversão UTF-8");
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }

  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength);

  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, j += 16);
    const oldHash = hash.slice(0);
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7]
        + ((e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
          w[i - 16]
          + ((w15 >>> 7 | w15 << 25) ^ (w15 >>> 18 | w15 << 14) ^ (w15 >>> 3))
          + w[i - 7]
          + ((w2 >>> 17 | w2 << 15) ^ (w2 >>> 19 | w2 << 13) ^ (w2 >>> 10))
        ) | 0);

      const temp2 = ((a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
      hash.pop();
    }

    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? "0" : "") + b.toString(16);
    }
  }
  return result;
}

// ------------------------ Modelo do bloco ----------------------
function getTransactions() {
  const desc = [...document.querySelectorAll(".tx-desc")];
  const value = [...document.querySelectorAll(".tx-value")];
  return desc.map((input, index) => ({
    id: index + 1,
    registro: input.value.trim(),
    valor: value[index].value.trim()
  }));
}

function computeTransactionRoot(transactions) {
  // Simplificação didática: usamos SHA-256 de todas as transações
  // serializadas. Uma Merkle Tree real combina hashes em uma árvore.
  return sha256(JSON.stringify(transactions));
}

function buildBlock(nonceOverride = null) {
  const transactions = getTransactions();
  const merkleRoot = computeTransactionRoot(transactions);
  els.merkleRoot.value = merkleRoot;

  return {
    version: els.version.value.trim(),
    height: Number(els.height.value || 0),
    timestamp: els.timestamp.value.trim(),
    previousHash: els.previousHash.value.trim().toLowerCase(),
    merkleRoot,
    transactions,
    nonce: nonceOverride === null ? Number(els.nonce.value || 0) : Number(nonceOverride)
  };
}

function canonicalPayload(block) {
  return JSON.stringify({
    version: block.version,
    height: block.height,
    timestamp: block.timestamp,
    previousHash: block.previousHash,
    merkleRoot: block.merkleRoot,
    transactions: block.transactions,
    nonce: block.nonce
  });
}

function hashBlock(block) {
  return sha256(canonicalPayload(block));
}

function targetPrefix() {
  return "0".repeat(Number(els.difficulty.value));
}

function isValidHash(hash) {
  return hash.startsWith(targetPrefix());
}

function shortened(hash, left = 12, right = 8) {
  if (!hash || hash.length <= left + right + 1) return hash || "—";
  return `${hash.slice(0, left)}…${hash.slice(-right)}`;
}

function updatePayloadPreview(block) {
  els.payloadPreview.textContent = JSON.stringify(block, null, 2);
}

function hammingDistanceHex(a, b) {
  if (!a || !b || a.length !== b.length) return null;
  let differentBits = 0;
  for (let i = 0; i < a.length; i++) {
    let xor = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    while (xor) {
      differentBits += xor & 1;
      xor >>>= 1;
    }
  }
  return differentBits;
}

function updateAvalanche(previous, next) {
  els.previousCalculatedHash.textContent = previous || "—";
  els.compareCurrentHash.textContent = next || "—";
  const bits = hammingDistanceHex(previous, next);
  if (bits === null) {
    els.bitDifference.textContent = "—";
    els.bitDifferenceBar.style.width = "0%";
    return;
  }
  const pct = (bits / 256) * 100;
  els.bitDifference.textContent = `${bits}/256 bits (${pct.toFixed(1)}%)`;
  els.bitDifferenceBar.style.width = `${pct}%`;
}

function updateValidity(hash) {
  const valid = isValidHash(hash);
  els.validityMessage.className = `validation ${valid ? "valid" : "invalid"}`;
  els.validityMessage.textContent = valid
    ? `✓ Hash válido: começa com ${targetPrefix().length} zero(s).`
    : `✗ Hash ainda não atende ao critério ${targetPrefix()}…`;
  els.sealBtn.disabled = !valid || isMining;
}

function updateChainView() {
  els.chainPrevHash.textContent = shortened(els.previousHash.value.trim());
  els.chainCurrentHash.textContent = shortened(currentHash);
  els.chainNextPrevHash.textContent = sealedNextPreviousHash ? shortened(sealedNextPreviousHash) : "aguardando…";

  if (!sealedHash) {
    els.chainIntegrity.className = "validation neutral";
    els.chainIntegrity.textContent = "Cadeia ainda não selada.";
    return;
  }

  const intact = currentHash === sealedHash && sealedNextPreviousHash === sealedHash;
  els.chainIntegrity.className = `validation ${intact ? "valid" : "invalid"}`;
  els.chainIntegrity.textContent = intact
    ? "✓ Cadeia íntegra: o próximo bloco referencia exatamente o hash atual do bloco N."
    : "✗ Cadeia quebrada: o bloco N mudou, mas o bloco N+1 ainda aponta para o hash antigo.";
}

function addHistory(nonce, hash, valid) {
  historyCounter += 1;
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${historyCounter}</td>
    <td><code>${nonce}</code></td>
    <td><code title="${hash}">${shortened(hash, 18, 10)}</code></td>
    <td class="${valid ? "result-ok" : "result-no"}">${valid ? "✓ válido" : "× não atende"}</td>`;
  els.attemptHistory.prepend(row);

  while (els.attemptHistory.children.length > 12) {
    els.attemptHistory.removeChild(els.attemptHistory.lastChild);
  }
}

function calculateCurrent({ addToHistory = false } = {}) {
  const block = buildBlock();
  const hash = hashBlock(block);

  lastHash = currentHash || lastHash;
  currentHash = hash;

  els.nonceMirror.textContent = block.nonce;
  els.currentHash.textContent = hash;
  updatePayloadPreview(block);
  updateAvalanche(lastHash, currentHash);
  updateValidity(currentHash);
  updateChainView();

  if (addToHistory) addHistory(block.nonce, hash, isValidHash(hash));
  return { block, hash };
}

function refreshFromInput() {
  if (isMining) return;
  calculateCurrent();
}

// --------------------------- Mineração -------------------------
async function mine() {
  if (isMining) return;

  isMining = true;
  stopRequested = false;
  els.mineBtn.disabled = true;
  els.stopBtn.disabled = false;
  els.sealBtn.disabled = true;

  const difficulty = Number(els.difficulty.value);
  const prefix = "0".repeat(difficulty);
  let nonce = Number(els.nonce.value || 0);
  let attempts = 0;
  const start = performance.now();
  const batchSize = 1200;
  const baseBlock = buildBlock(nonce);

  while (!stopRequested) {
    for (let i = 0; i < batchSize; i++) {
      const candidate = { ...baseBlock, nonce };
      const hash = hashBlock(candidate);
      attempts++;

      if (attempts <= 5 || attempts % 2000 === 0) {
        addHistory(nonce, hash, hash.startsWith(prefix));
      }

      if (hash.startsWith(prefix)) {
        const previousForAvalanche = currentHash;
        els.nonce.value = nonce;
        currentHash = hash;
        lastHash = previousForAvalanche;
        els.nonceMirror.textContent = nonce;
        els.currentHash.textContent = hash;
        updatePayloadPreview(candidate);
        updateAvalanche(lastHash, currentHash);
        addHistory(nonce, hash, true);

        const elapsed = performance.now() - start;
        els.attempts.textContent = attempts.toLocaleString("pt-BR");
        els.elapsed.textContent = `${elapsed.toFixed(0)} ms`;
        els.hashRate.textContent = `${Math.round(attempts / (elapsed / 1000 || 1)).toLocaleString("pt-BR")} H/s`;

        finishMining();
        updateValidity(hash);
        updateChainView();
        return;
      }
      nonce++;
    }

    const elapsed = performance.now() - start;
    els.nonce.value = nonce;
    els.nonceMirror.textContent = nonce;
    els.attempts.textContent = attempts.toLocaleString("pt-BR");
    els.elapsed.textContent = `${elapsed.toFixed(0)} ms`;
    els.hashRate.textContent = `${Math.round(attempts / (elapsed / 1000 || 1)).toLocaleString("pt-BR")} H/s`;

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  finishMining();
  calculateCurrent();
}

function finishMining() {
  isMining = false;
  els.mineBtn.disabled = false;
  els.stopBtn.disabled = true;
  stopRequested = false;
}

// -------------------------- Encadeamento -----------------------
function sealBlock() {
  if (!currentHash || !isValidHash(currentHash)) return;
  sealedHash = currentHash;
  sealedNextPreviousHash = currentHash;
  els.sealStatus.className = "info-box blue";
  els.sealStatus.innerHTML = `<strong>Bloco N selado.</strong><br>O bloco N+1 recebeu <code>${shortened(sealedHash, 20, 12)}</code> como seu <code>previousHash</code>.`;
  updateChainView();
}

// ----------------------------- Eventos -------------------------
function initTimestamp() {
  els.timestamp.value = new Date().toISOString();
}

function bindEvents() {
  const blockInputs = [
    els.version,
    els.height,
    els.timestamp,
    els.previousHash,
    els.nonce,
    ...document.querySelectorAll(".tx-desc"),
    ...document.querySelectorAll(".tx-value")
  ];

  blockInputs.forEach((input) => input.addEventListener("input", refreshFromInput));

  els.difficulty.addEventListener("input", () => {
    const n = Number(els.difficulty.value);
    els.difficultyLabel.textContent = `${n} zero${n > 1 ? "s" : ""}`;
    updateValidity(currentHash);
  });

  els.calculateBtn.addEventListener("click", () => calculateCurrent({ addToHistory: true }));

  els.incrementBtn.addEventListener("click", () => {
    els.nonce.value = Number(els.nonce.value || 0) + 1;
    calculateCurrent({ addToHistory: true });
  });

  els.mineBtn.addEventListener("click", mine);
  els.stopBtn.addEventListener("click", () => { stopRequested = true; });
  els.sealBtn.addEventListener("click", sealBlock);

  els.clearHistory.addEventListener("click", () => {
    els.attemptHistory.innerHTML = "";
    historyCounter = 0;
  });
}

function selfTest() {
  const vectors = [
    ["abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"],
    ["", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"]
  ];

  for (const [input, expected] of vectors) {
    const actual = sha256(input);
    if (actual !== expected) {
      console.error("Falha no autoteste SHA-256", { input, expected, actual });
      els.currentHash.textContent = "Erro interno no SHA-256. Consulte o console.";
      return false;
    }
  }
  return true;
}

function init() {
  initTimestamp();
  bindEvents();
  if (!selfTest()) return;
  calculateCurrent();
}

init();
