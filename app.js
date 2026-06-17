/* ── Estado das seções ────────────────────────── */
const SECTIONS = ['identificacao', 'intro', 'passos', 'registro', 'relatorio', 'nas', 'adicional'];
const sectionState = {};
SECTIONS.forEach(s => sectionState[s] = true);

let stepCount = 0;

/* ── Inicialização ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-sec]').forEach(btn => {
    btn.addEventListener('click', () => toggleSection(btn.dataset.sec));
  });

  mascaraVersao(document.getElementById('versao_cliente'));
  mascaraVersao(document.getElementById('versao_testada'));

  addStep();
  addStep();
  addStep();
});

/* ── Máscara de versão (ex: 04.01.05.03) ─────── */
function mascaraVersao(input) {
  input.addEventListener('input', () => {
    let val = input.value.replace(/[^\d]/g, '');
    let partes = [];
    for (let i = 0; i < val.length && partes.length < 4; i += 2) {
      partes.push(val.slice(i, i + 2));
    }
    input.value = partes.join('.');
  });
}

/* ── Passos ───────────────────────────────────── */
function addStep(val = '') {
  stepCount++;
  const list = document.getElementById('steps-list');

  const row = document.createElement('div');
  row.className = 'step-row';
  row.id = 'sr-' + stepCount;

  const num = document.createElement('span');
  num.className = 'step-num';
  num.textContent = (list.children.length + 1) + '.';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'step-' + stepCount;
  input.placeholder = 'Descreva o passo...';
  input.value = val;

  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.setAttribute('aria-label', 'Remover passo');
  removeBtn.innerHTML = '&#10005;';
  removeBtn.onclick = () => {
    row.remove();
    renumber();
  };

  row.appendChild(num);
  row.appendChild(input);
  row.appendChild(removeBtn);
  list.appendChild(row);
  renumber();
}

function renumber() {
  document.querySelectorAll('.step-row').forEach((r, i) => {
    const span = r.querySelector('.step-num');
    if (span) span.textContent = (i + 1) + '.';
  });
}

/* ── Toggle de seção ──────────────────────────── */
function toggleSection(sec) {
  sectionState[sec] = !sectionState[sec];

  const body  = document.getElementById('body-' + sec);
  const badge = document.getElementById('badge-' + sec);
  const tog   = document.querySelector(`[data-sec="${sec}"]`);

  if (sectionState[sec]) {
    body.classList.remove('hidden');
    badge.textContent = 'ativo';
    badge.classList.remove('off');
    if (tog) tog.classList.add('active');
  } else {
    body.classList.add('hidden');
    badge.textContent = 'inativo';
    badge.classList.add('off');
    if (tog) tog.classList.remove('active');
  }
}

/* ── Leitura de campos ────────────────────────── */
function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

/* ── Coleta e monta o objeto JSON ─────────────── */
function collectJSON() {
  const data = {};

  if (sectionState['identificacao']) {
    const cliente       = v('cliente');
    const versaoCliente = v('versao_cliente');
    const versaoTestada = v('versao_testada');
    if (cliente || versaoCliente || versaoTestada) {
      data.identificacao = {};
      if (cliente)       data.identificacao.cliente        = cliente;
      if (versaoCliente) data.identificacao.versao_cliente = versaoCliente;
      if (versaoTestada) data.identificacao.versao_testada = versaoTestada;
    }
  }

  if (sectionState['intro']) {
    const intro = v('intro');
    if (intro) data.introducao = intro;
  }

  if (sectionState['passos']) {
    const rows = document.querySelectorAll('.step-row');
    const steps = [];
    rows.forEach((r, i) => {
      const inp = r.querySelector('input[type="text"]');
      if (inp && inp.value.trim()) steps.push(inp.value.trim());
    });
    if (steps.length) data.passo_a_passo = steps;
  }

  if (sectionState['registro']) {
    const dt  = v('reg_data');
    const num = v('reg_numero');
    const ent = v('reg_entidade');
    const cod = v('reg_cod');
    if (dt || num || ent || cod) {
      data.registro_especifico = {};
      if (dt)  data.registro_especifico.data             = dt;
      if (num) data.registro_especifico.numero           = num;
      if (ent) data.registro_especifico.entidade         = ent;
      if (cod) data.registro_especifico.codigo_entidade  = cod;
    }
  }

  if (sectionState['relatorio']) {
    const cam = v('rel_caminho');
    const fil = v('rel_filtros');
    if (cam || fil) {
      data.relatorio = {};
      if (cam) data.relatorio.caminho = cam;
      if (fil) data.relatorio.filtros = fil;
    }
  }

  if (sectionState['nas']) {
    const pasta = v('nas_pasta');
    const sub   = v('nas_subpasta');
    const arq   = v('nas_arquivo');
    if (pasta || sub || arq) {
      data.banco_nas = {};
      if (pasta) data.banco_nas.caminho  = pasta;
      if (sub)   data.banco_nas.subpasta = sub;
      if (arq)   data.banco_nas.arquivo  = arq;
    }
  }

  if (sectionState['adicional']) {
    const ad = v('adicional');
    if (ad) data.informacoes_adicionais = ad;
  }

  return data;
}

/* ── Status UI ────────────────────────────────── */
function setStatus(msg, tipo = '') {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.dataset.tipo = tipo;
}

/* ── Copiar JSON ──────────────────────────────── */
function copiarJSON() {
  const data = collectJSON();

  if (Object.keys(data).length === 0) {
    setStatus('Preencha pelo menos um campo antes de copiar.', 'erro');
    return;
  }

  const json = JSON.stringify(data, null, 2);

  navigator.clipboard.writeText(json).then(() => {
    const btn = document.getElementById('generate-btn');
    btn.innerHTML = '&#10003; JSON copiado! Cole no Claude';
    btn.classList.add('copiado');
    setStatus('JSON copiado! Cole no chat do Claude e peça para gerar a tarefa.', 'ok');

    setTimeout(() => {
      btn.innerHTML = '&#128203; Copiar JSON para o Claude';
      btn.classList.remove('copiado');
      setStatus('');
    }, 3000);
  }).catch(() => {
    setStatus('Não foi possível copiar. Tente novamente.', 'erro');
  });
}
