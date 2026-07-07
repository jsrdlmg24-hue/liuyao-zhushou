import { buildPlateViewModel } from './engine/plateViewModel'

const STEPS = [
  { id: 1, title: '明确占事', desc: '把问题变成一句可判断的话。', output: '得到清楚的问题边界。', fill: ['本卦问的是：____。', '我方/求测者是：____；对方/事体是：____。'], knowledge: ['K01', 'K02'] },
  { id: 2, title: '核对排盘', desc: '确认时间、四柱、空亡、卦名和六爻信息。', output: '得到可复查的原始盘面。', fill: ['起卦时间：____。', '本卦：____；变卦：____；动爻：____。'], knowledge: ['K03', 'K04'] },
  { id: 3, title: '定世应主客', desc: '先分清自己、对方、环境或事体。', output: '得到主客关系。', fill: ['世爻代表：____。', '应爻代表：____。'], knowledge: ['K02'] },
  { id: 4, title: '取用神', desc: '按占事选最核心的六亲。', output: '确定主用神。', fill: ['本事取用神：父母/兄弟/子孙/妻财/官鬼____。', '用神在第____爻。'], knowledge: ['K01', 'K05'] },
  { id: 5, title: '处理两现与伏神', desc: '用神多现或不上卦时分主次。', output: '确定主用神、副用神、伏神。', fill: ['用神是否两现：____。', '伏神/飞神情况：____。'], knowledge: ['K05'] },
  { id: 6, title: '看月日旺衰', desc: '判断用神和关键爻有没有力量。', output: '得到旺衰底盘。', fill: ['用神对月建：____。', '用神对日辰：____。'], knowledge: ['K03', 'K06'] },
  { id: 7, title: '查空破墓绝', desc: '找事情暂时不成或无力的原因。', output: '得到病点清单。', fill: ['日空爻：____。', '月破/日破/入墓/绝地：____。'], knowledge: ['K04', 'K06'] },
  { id: 8, title: '看动爻', desc: '动爻是事情正在发动和变化的地方。', output: '得到推动或阻碍力量。', fill: ['动爻有：____。', '主要动爻作用：____。'], knowledge: ['K07'] },
  { id: 9, title: '看变爻', desc: '动爻变出的内容代表后续落点。', output: '得到变化方向。', fill: ['动爻化出：____。', '属于回头生/回头克/化进/化退/化空/化破等：____。'], knowledge: ['K07'] },
  { id: 10, title: '定原忌仇', desc: '围绕用神找助力和阻力。', output: '得到助力阻力结构。', fill: ['原神：____。', '忌神：____；仇神：____。'], knowledge: ['K08'] },
  { id: 11, title: '复核世应关系', desc: '把用神判断放回主客关系。', output: '判断人和事是否配合。', fill: ['世是否持用神：____。', '应是否持用神：____。'], knowledge: ['K02'] },
  { id: 12, title: '看卦象格局', desc: '六合、六冲、游魂、归魂只做背景。', output: '得到整体气势。', fill: ['本卦格局：____。', '对本事影响：____。'], knowledge: ['K09'] },
  { id: 13, title: '看六神爻位神煞', desc: '用象意补细节，不覆盖主裁判。', output: '得到细节画像。', fill: ['用神临六神：____。', '神煞落爻提示：____。'], knowledge: ['K10'] },
  { id: 14, title: '综合冲突', desc: '按优先级处理互相矛盾的信息。', output: '得到站得住的结论。', fill: ['最有利证据：____。', '最不利证据：____。'], knowledge: ['K11'] },
  { id: 15, title: '定应期与断语', desc: '把盘面判断变成可执行结论。', output: '得到最终断语。', fill: ['结论：成/不成/暂缓/反复/需条件____。', '应期与建议：____。'], knowledge: ['K12'] }
]

const KNOWLEDGE = [
  { id: 'K01', title: '六亲取用', brief: '父母、兄弟、子孙、妻财、官鬼是判断角色。', body: ['求财多取妻财，工作职位多取官鬼，文书证件多取父母，疾病常看官鬼为病、子孙为药。', '先按占事取主用神，再看盘中哪个爻真正主事。'], steps: [1, 4] },
  { id: 'K02', title: '世应用法', brief: '世为我方，应为对方、目标、外界。', body: ['世持用神，事情贴身，自己掌控度较高。', '应持用神，事情在对方或外部手里。', '世应生合多有连接，冲克多有矛盾或变化。'], steps: [3, 11] },
  { id: 'K03', title: '月建日辰', brief: '月日是力量主裁判。', body: ['月建像大环境和季节，日辰像当下执行力。', '临月临日、月生日生多得力；被月日冲克则受压。'], steps: [2, 6] },
  { id: 'K04', title: '空亡', brief: '空表示暂时不实、不显、不落实。', body: ['空不是永远没有，要看出空、冲空、填实。', '用神空，要问何时出空，是否有动爻生扶。'], steps: [2, 7] },
  { id: 'K05', title: '用神两现与伏神', brief: '用神多个或不上卦时要分主次。', body: ['两现优先看发动、临世应、旺相、得月日扶助、贴近占事者。', '伏神表示事情有但不显，飞神生伏较易出，飞神克伏多受压。'], steps: [4, 5] },
  { id: 'K06', title: '旺衰破墓绝', brief: '判断爻有没有力量和根气。', body: ['旺衰是力量，不是吉凶标签。忌神旺也凶，用神弱则事弱。', '月破、日破、入墓、绝地常是事情卡住或无力的原因。'], steps: [6, 7] },
  { id: 'K07', title: '动变', brief: '动爻代表发动，变爻代表变化后的落点。', body: ['动爻先看是否作用到用神、世爻、应爻。', '变爻重点看回头生、回头克、化进、化退、化空、化破、化墓、化合、化冲。'], steps: [8, 9] },
  { id: 'K08', title: '原神忌神仇神', brief: '围绕用神找助力和阻力。', body: ['生用神者为原神，克用神者为忌神。', '生忌神、克原神者为仇神。要看它们旺弱、动静、空破。'], steps: [10] },
  { id: 'K09', title: '卦象格局', brief: '六合、六冲、游魂、归魂看整体气势。', body: ['六合偏稳定、牵连、拖延；六冲偏变化、冲散、破局。', '格局只辅助，不覆盖用神、月日、动变。'], steps: [12] },
  { id: 'K10', title: '六神神煞爻位', brief: '用于补充细节和象。', body: ['青龙喜庆，朱雀口舌文书，勾陈拖延田土，螣蛇虚惊纠结，白虎伤病压力，玄武隐私暗昧。', '神煞落爻只补充细节，不单独定吉凶。'], steps: [13] },
  { id: 'K11', title: '冲突处理优先级', brief: '信息矛盾时按层级取舍。', body: ['先取用神与世应，再看月日空破，再看动变原忌仇，最后看六神爻位卦辞。', '主裁判与辅助象冲突时，以主裁判为准。'], steps: [14] },
  { id: 'K12', title: '应期', brief: '看病处何时解决，或用神何时有力。', body: ['空看出空、冲空、填实；破看合破、出月、值日；墓看冲墓开墓。', '动爻、变爻地支常是应期线索。'], steps: [15] }
]

const STORE_KEY = 'liuyao_pwa_records_v1'
const SETTINGS_KEY = 'liuyao_pwa_settings_v1'
const CURRENT_KEY = 'liuyao_pwa_current_record_id_v1'
const CLOUD_FILE = 'liuyao-pwa-notes.json'
const DEFAULT_NUMBERS = [8, 8, 8, 8, 8, 8]
const LINE_LABELS = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
const YAO_OPTIONS = [
  { value: 6, label: '6 老阴', desc: '阴动 → 变阳' },
  { value: 7, label: '7 少阳', desc: '阳静' },
  { value: 8, label: '8 少阴', desc: '阴静' },
  { value: 9, label: '9 老阳', desc: '阳动 → 变阴' }
]

let state = {
  records: [],
  settings: { token: '', gistId: '', lastSync: '' },
  currentRecordId: '',
  search: ''
}

function qs(sel, root = document) { return root.querySelector(sel) }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)) }
function escapeHtml(str = '') { return String(str).replace(/[&<>'"]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[s]) }
function nowIso() { return new Date().toISOString() }
function pad2(n) { return String(n).padStart(2, '0') }
function formatDate(iso) { if (!iso) return ''; const d = new Date(iso); return d.toLocaleString('zh-CN', { hour12: false }) }
function localDateTimeValue(date = new Date()) { return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}` }
function todayId() { const d = new Date(); return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}` }
function makeId() { const date = todayId(); const count = state.records.filter(r => r.id.startsWith(`LY-${date}`)).length + 1; return `LY-${date}-${pad2(count).padStart(3, '0')}` }

function loadLocal() {
  try { state.records = JSON.parse(localStorage.getItem(STORE_KEY) || '[]') } catch { state.records = [] }
  try { state.settings = { ...state.settings, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')) } } catch {}
  state.currentRecordId = localStorage.getItem(CURRENT_KEY) || (state.records[0]?.id || '')
}
function saveLocal() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state.records))
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings))
  localStorage.setItem(CURRENT_KEY, state.currentRecordId || '')
  updateHeader()
}
function currentRecord() { return state.records.find(r => r.id === state.currentRecordId) }
function ensureRecord() {
  if (currentRecord()) return currentRecord()
  if (!state.records.length) return null
  state.currentRecordId = state.records[0].id
  saveLocal()
  return currentRecord()
}
function ensurePlateInput(record) {
  if (!record.plateInput) {
    record.plateInput = {
      question: record.question || '',
      castTime: localDateTimeValue(),
      numbers: [...DEFAULT_NUMBERS],
      collapsed: false
    }
  }
  if (!Array.isArray(record.plateInput.numbers) || record.plateInput.numbers.length !== 6) record.plateInput.numbers = [...DEFAULT_NUMBERS]
  record.plateInput.numbers = record.plateInput.numbers.map(n => [6, 7, 8, 9].includes(Number(n)) ? Number(n) : 8)
  if (!record.plateInput.castTime) record.plateInput.castTime = localDateTimeValue()
  if (typeof record.plateInput.question !== 'string') record.plateInput.question = record.question || ''
  if (typeof record.plateInput.collapsed !== 'boolean') record.plateInput.collapsed = false
  return record.plateInput
}
function newRecord(title = '', question = '') {
  const id = makeId()
  const r = {
    id,
    title: title.trim() || `读盘笔记 ${id}`,
    question: question.trim(),
    createdAt: nowIso(),
    updatedAt: nowIso(),
    tags: [],
    plateInput: { question: question.trim(), castTime: localDateTimeValue(), numbers: [...DEFAULT_NUMBERS], collapsed: false },
    steps: {},
    final: {}
  }
  STEPS.forEach(s => r.steps[s.id] = { conclusion: '', evidence: '', doubt: '', note: '', fills: Array(s.fill.length).fill('') })
  state.records.unshift(r)
  state.currentRecordId = id
  saveLocal()
  return r
}
function touchRecord(record) { record.updatedAt = nowIso(); saveLocal() }
function updateHeader() { const r = currentRecord(); const label = qs('#currentRecordLabel'); if (label) label.textContent = r ? `${r.id} · ${r.title}` : '未选择记录' }

function buildCurrentPlateVm() {
  const record = currentRecord()
  if (!record) return null
  const input = ensurePlateInput(record)
  try {
    return buildPlateViewModel({ question: input.question || record.question || '', castTime: input.castTime, numbers: input.numbers })
  } catch (err) {
    console.error('buildPlateViewModel failed:', err)
    return null
  }
}

function setActiveTab() {
  const hash = location.hash || '#home'
  qsa('.bottom-nav a').forEach(a => {
    const tab = a.dataset.tab
    const active = hash.startsWith(`#${tab}`) || (tab === 'home' && hash.startsWith('#step-')) || (tab === 'knowledge' && hash.startsWith('#knowledge-'))
    a.classList.toggle('active', active)
  })
}
function go(hash) { location.hash = hash }

function render() {
  setActiveTab()
  updateHeader()
  renderPlateDock()
  const hash = location.hash || '#home'
  if (hash === '#plate') return renderPlatePage()
  if (hash.startsWith('#step-')) return renderStep(Number(hash.replace('#step-', '')))
  if (hash.startsWith('#knowledge-')) return renderKnowledgeDetail(hash.replace('#knowledge-', ''))
  if (hash === '#records') return renderRecords()
  if (hash === '#knowledge') return renderKnowledgeList()
  if (hash === '#summary') return renderSummary()
  if (hash === '#settings') return renderSettings()
  return renderHome()
}

function recordNeededHtml() { return document.getElementById('emptyTemplate').innerHTML }

function renderHome() {
  const app = qs('#app')
  const r = ensureRecord()
  app.innerHTML = `
    <section class="card hero">
      <h1>15 步读盘流程</h1>
      <p>先排盘，再按步骤写证据。每步笔记会自动保存，最后汇总成断语。</p>
      <p class="small">当前笔记：${r ? `${escapeHtml(r.id)} · ${escapeHtml(r.title)}` : '未选择'}</p>
      <div class="button-row">
        <a href="#plate" class="primary-btn">进入排盘</a>
        <a href="#records" class="secondary-btn">新建 / 切换笔记</a>
        <a href="#summary" class="secondary-btn">自动汇总</a>
      </div>
    </section>
    <section class="card compact">
      <div class="kicker">资料权重</div>
      <p><b>主裁判：</b>纳甲六爻 / 文王卦 / 火珠林。先看六亲、世应、用神、月日、动变、生克冲合、旬空月破。</p>
      <p><b>辅助：</b>古法规则、朱辰彬流程优先级、王虎应现代分类、六神爻位卦象解释。</p>
    </section>
    <section class="step-list">
      ${STEPS.map(s => `<a class="step-card" href="#step-${s.id}"><div class="step-no">${s.id}</div><div><div class="step-title">${escapeHtml(s.title)}</div><div class="step-desc">${escapeHtml(s.desc)}</div></div><div class="chev">›</div></a>`).join('')}
    </section>
    <div class="footer-space"></div>
  `
}

function renderPlatePage() {
  const app = qs('#app')
  const record = ensureRecord()
  if (!record) { app.innerHTML = recordNeededHtml(); return }
  const input = ensurePlateInput(record)
  const vm = buildCurrentPlateVm()
  app.innerHTML = `
    <section class="card">
      <div class="kicker">排盘输入</div>
      <h1>六爻排盘</h1>
      <p class="small">输入顺序固定：初爻 → 二爻 → 三爻 → 四爻 → 五爻 → 上爻。</p>
      <label>占问</label>
      <textarea id="plateQuestion" placeholder="例如：这次面试能不能通过？">${escapeHtml(input.question || '')}</textarea>
      <label>起卦时间</label>
      <input id="plateCastTime" type="datetime-local" value="${escapeHtml(input.castTime)}" />
      <h2>六个爻值</h2>
      <div class="yao-input-grid">
        ${LINE_LABELS.map((label, idx) => `<div class="yao-input-row"><div class="line-label">${label}</div><select data-plate-yao-index="${idx}">${YAO_OPTIONS.map(opt => `<option value="${opt.value}" ${input.numbers[idx] === opt.value ? 'selected' : ''}>${opt.label}｜${opt.desc}</option>`).join('')}</select></div>`).join('')}
      </div>
      <div class="button-row">
        <button class="primary-btn" id="buildPlateBtn">排盘 / 刷新盘面</button>
        <button class="secondary-btn" id="resetPlateBtn">重置</button>
      </div>
    </section>
    <section class="card">
      <h2>完整盘面</h2>
      <p class="small">表格视觉从上爻往下显示；输入和核心计算仍按初爻到上爻。</p>
      ${renderFullPlateHtml(vm)}
    </section>
  `
  bindPlatePage()
}
function bindPlatePage() {
  const record = currentRecord()
  if (!record) return
  const input = ensurePlateInput(record)
  qs('#plateQuestion')?.addEventListener('input', e => { input.question = e.target.value; record.question = e.target.value; touchRecord(record); renderPlateDock() })
  qs('#plateCastTime')?.addEventListener('change', e => { input.castTime = e.target.value; touchRecord(record); renderPlateDock() })
  qsa('[data-plate-yao-index]').forEach(sel => sel.addEventListener('change', () => { const idx = Number(sel.dataset.plateYaoIndex); input.numbers[idx] = Number(sel.value); touchRecord(record); renderPlateDock() }))
  qs('#buildPlateBtn')?.addEventListener('click', () => { touchRecord(record); renderPlatePage() })
  qs('#resetPlateBtn')?.addEventListener('click', () => { input.numbers = [...DEFAULT_NUMBERS]; input.castTime = localDateTimeValue(); touchRecord(record); renderPlatePage() })
}

function renderPlateDock() {
  const dock = qs('#plateDock')
  if (!dock) return
  const record = currentRecord()
  if (!record) { dock.innerHTML = '<div class="plate-empty">未选择读盘笔记。请先新建或切换笔记。</div>'; return }
  const input = ensurePlateInput(record)
  const vm = buildCurrentPlateVm()
  if (!vm) { dock.innerHTML = '<div class="plate-empty">排盘数据有误，请检查 6 个爻值和起卦时间。</div>'; return }
  dock.innerHTML = `
    <div class="plate-card ${input.collapsed ? 'collapsed' : ''}">
      <div class="plate-head">
        <div>
          <div class="plate-title">${escapeHtml(vm.originalHexagram.name)} → ${escapeHtml(vm.changedHexagram.name)}</div>
          <div class="plate-sub">${escapeHtml(vm.header.castTimeText)}｜${escapeHtml(vm.header.baziText)}｜动爻：${vm.movingPositions.length ? vm.movingPositions.join('、') : '无'}</div>
        </div>
        <button class="ghost-btn small-btn" id="togglePlateDock">${input.collapsed ? '展开' : '收起'}</button>
      </div>
      ${input.collapsed ? '' : renderFullPlateHtml(vm, { compact: true })}
    </div>
  `
  qs('#togglePlateDock')?.addEventListener('click', () => { input.collapsed = !input.collapsed; touchRecord(record); renderPlateDock() })
}

function renderFullPlateHtml(vm, options = {}) {
  if (!vm) return '<p class="small">暂无盘面。</p>'
  const rows = [...vm.rows].reverse()
  return `
    <div class="plate-meta ${options.compact ? 'compact-meta' : ''}">
      <div><b>日期时间</b><span>${escapeHtml(vm.header.castTimeText)}</span></div>
      <div><b>占问</b><span>${escapeHtml(vm.header.question || '未填写')}</span></div>
      <div><b>四柱</b><span>${escapeHtml(vm.header.baziText)}</span></div>
      <div><b>年空</b><span>${escapeHtml(vm.header.kongwangText.nian)}</span></div>
      <div><b>月空</b><span>${escapeHtml(vm.header.kongwangText.yue)}</span></div>
      <div><b>日空</b><span>${escapeHtml(vm.header.kongwangText.ri)}</span></div>
      <div><b>时空</b><span>${escapeHtml(vm.header.kongwangText.shi)}</span></div>
      <div><b>十二长生</b><span>${escapeHtml(Object.values(vm.header.changshengText).join('、'))}</span></div>
      <div><b>神煞摘要</b><span>${escapeHtml(formatTimeShensha(vm.header.timeShensha))}</span></div>
      <div><b>本卦</b><span>${escapeHtml(vm.originalHexagram.name)}｜${escapeHtml(vm.originalHexagram.palace)}宫｜${escapeHtml(vm.originalHexagram.palacePosName)}</span></div>
      <div><b>变卦</b><span>${escapeHtml(vm.changedHexagram.name)}｜${escapeHtml(vm.changedHexagram.palace)}宫｜${escapeHtml(vm.changedHexagram.palacePosName)}</span></div>
    </div>
    <div class="plate-scroll">
      <table class="plate-table">
        <thead><tr><th>爻位</th><th>六神</th><th>伏神</th><th>本卦</th><th>动静</th><th>世应</th><th>变卦</th><th>高亮</th><th>神煞落爻</th></tr></thead>
        <tbody>${rows.map(row => renderPlateRow(row)).join('')}</tbody>
      </table>
    </div>
  `
}
function renderPlateRow(row) {
  const classes = [row.highlights.isMoving ? 'moving-line' : '', row.highlights.isShi ? 'shi-line' : '', row.highlights.isYing ? 'ying-line' : '', row.highlights.isDayKong ? 'kong-line' : '', row.highlights.isMonthZhi ? 'month-line' : '', row.highlights.isDayZhi ? 'day-line' : ''].filter(Boolean).join(' ')
  const lineSymbol = row.yinYang === '阳' ? '━━━' : '━　━'
  const originalText = `${row.original.liuqin} ${row.original.ganzhi} ${row.original.wuxing} ${row.yinYang}`
  const changedText = `${row.changed.liuqin} ${row.changed.ganzhi} ${row.changed.wuxing} ${row.changed.yinYang}`
  const fushenText = row.fushen ? `${row.fushen.liuqin} ${row.fushen.gan}${row.fushen.zhi} ${row.fushen.wuxing}` : ''
  const shenshaHtml = row.highlights.shensha.length ? row.highlights.shensha.map(x => `<span class="shensha-badge">${escapeHtml(x)}</span>`).join('') : ''
  return `
    <tr class="${classes}">
      <td>${escapeHtml(row.positionName)}</td>
      <td>${escapeHtml(row.liushen)}</td>
      <td>${escapeHtml(fushenText)}</td>
      <td><div class="line-symbol">${lineSymbol}</div><div>${escapeHtml(originalText)}</div></td>
      <td><b>${escapeHtml(row.type)}</b>${row.changing ? '<span class="move-badge">动</span>' : '<span class="quiet-badge">静</span>'}</td>
      <td>${row.role ? `<span class="role-badge">${escapeHtml(row.role)}</span>` : ''}</td>
      <td>${escapeHtml(changedText)}</td>
      <td>${renderHighlightBadges(row)}</td>
      <td>${shenshaHtml}</td>
    </tr>
  `
}
function renderHighlightBadges(row) {
  const badges = []
  if (row.highlights.isMonthZhi) badges.push('月建')
  if (row.highlights.isDayZhi) badges.push('日辰')
  if (row.highlights.isDayKong) badges.push('日空')
  if (row.highlights.isYearKong) badges.push('年空')
  if (row.highlights.isMonthKong) badges.push('月空')
  if (row.highlights.isHourKong) badges.push('时空')
  if (row.highlights.isMoving) badges.push('动爻')
  if (row.highlights.isShi) badges.push('世')
  if (row.highlights.isYing) badges.push('应')
  return badges.map(x => `<span class="hl-badge">${escapeHtml(x)}</span>`).join('')
}
function formatTimeShensha(items = []) { return items.length ? items.map(x => `${x.name}-${x.value}`).join('、') : '无' }

function renderStep(stepId) {
  const app = qs('#app')
  const step = STEPS.find(s => s.id === stepId) || STEPS[0]
  const r = ensureRecord()
  if (!r) { app.innerHTML = recordNeededHtml(); return }
  if (!r.steps[step.id]) r.steps[step.id] = { conclusion: '', evidence: '', doubt: '', note: '', fills: Array(step.fill.length).fill('') }
  const data = r.steps[step.id]
  app.innerHTML = `
    <section class="card">
      <div class="kicker">第 ${step.id} 步</div><h1>${escapeHtml(step.title)}</h1><p>${escapeHtml(step.desc)}</p>
      <div class="callout ok"><b>本步产出：</b>${escapeHtml(step.output)}</div>
      <h3>本步知识点</h3><div class="tag-row">${step.knowledge.map(kid => { const k = KNOWLEDGE.find(x => x.id === kid); return `<a class="knowledge-chip" href="#knowledge-${kid}">${escapeHtml(k?.title || kid)}</a>` }).join('')}</div>
    </section>
    <section class="card"><h2>本步填空</h2>${step.fill.map((prompt, i) => `<div class="fill-card"><label>${escapeHtml(prompt)}</label><input type="text" data-step-field="fill" data-index="${i}" value="${escapeHtml(data.fills?.[i] || '')}" placeholder="点这里填写" /></div>`).join('')}</section>
    <section class="card"><h2>本步笔记</h2>${stepField('conclusion', '本步结论', data.conclusion)}${stepText('evidence', '盘面证据', data.evidence)}${stepText('doubt', '疑点 / 待复核', data.doubt)}${stepText('note', '自由笔记', data.note, 'note-area')}</section>
    <section class="card compact"><div class="button-row">${step.id > 1 ? `<a class="secondary-btn" href="#step-${step.id - 1}">上一步</a>` : ''}${step.id < STEPS.length ? `<a class="primary-btn" href="#step-${step.id + 1}">下一步</a>` : '<a class="primary-btn" href="#summary">去汇总</a>'}<a class="ghost-btn" href="#home">回流程</a></div></section>
  `
  qsa('[data-step-field]').forEach(el => el.addEventListener('input', () => { const rr = currentRecord(); const st = rr.steps[step.id]; const field = el.dataset.stepField; if (field === 'fill') { const idx = Number(el.dataset.index); if (!Array.isArray(st.fills)) st.fills = Array(step.fill.length).fill(''); st.fills[idx] = el.value } else { st[field] = el.value } touchRecord(rr) }))
}
function stepField(key, label, value = '') { return `<label>${escapeHtml(label)}</label><input type="text" data-step-field="${key}" value="${escapeHtml(value)}" />` }
function stepText(key, label, value = '', cls = '') { return `<label>${escapeHtml(label)}</label><textarea class="${cls}" data-step-field="${key}">${escapeHtml(value)}</textarea>` }

function renderRecords() {
  const app = qs('#app')
  app.innerHTML = `
    <section class="card"><h1>读盘笔记</h1><p>每一次占事是一条独立笔记，含自己的问题、起卦时间、六爻数和步骤笔记。</p><div class="form-block"><label>新笔记名称</label><input id="newTitle" type="text" placeholder="例如：找钥匙 / 面试结果 / 求财" /><label>问题原文</label><textarea id="newQuestion" placeholder="例如：今天丢的钥匙能不能找回来？"></textarea><button class="primary-btn full" id="createRecordBtn">新建读盘笔记</button></div></section>
    <section class="card"><h2>已有笔记</h2><div class="grid">${state.records.length ? state.records.map(recordCardHtml).join('') : '<p class="small">还没有笔记。</p>'}</div></section>
  `
  qs('#createRecordBtn').addEventListener('click', () => { const r = newRecord(qs('#newTitle').value, qs('#newQuestion').value); go('#plate') })
  qsa('[data-select-record]').forEach(btn => btn.addEventListener('click', () => { state.currentRecordId = btn.dataset.selectRecord; saveLocal(); render() }))
  qsa('[data-rename-record]').forEach(btn => btn.addEventListener('click', () => renameRecord(btn.dataset.renameRecord)))
  qsa('[data-duplicate-record]').forEach(btn => btn.addEventListener('click', () => duplicateRecord(btn.dataset.duplicateRecord)))
  qsa('[data-delete-record]').forEach(btn => btn.addEventListener('click', () => deleteRecord(btn.dataset.deleteRecord)))
}
function recordCardHtml(r) {
  const selected = r.id === state.currentRecordId
  ensurePlateInput(r)
  return `<div class="record-card"><div class="record-id">${escapeHtml(r.id)} ${selected ? '· 当前' : ''}</div><div class="record-title">${escapeHtml(r.title)}</div><div class="small">更新：${escapeHtml(formatDate(r.updatedAt))}</div><div class="small">占问：${escapeHtml(r.plateInput?.question || r.question || '未填写')}</div><div class="record-actions"><button class="${selected ? 'secondary-btn' : 'primary-btn'}" data-select-record="${escapeHtml(r.id)}">${selected ? '已选中' : '切换'}</button><button class="secondary-btn" data-rename-record="${escapeHtml(r.id)}">改名</button><button class="secondary-btn" data-duplicate-record="${escapeHtml(r.id)}">复制</button><button class="danger-btn" data-delete-record="${escapeHtml(r.id)}">删除</button></div></div>`
}
function renameRecord(id) { const r = state.records.find(x => x.id === id); if (!r) return; const name = prompt('输入新的笔记名称：', r.title); if (name === null) return; r.title = name.trim() || r.title; touchRecord(r); renderRecords() }
function duplicateRecord(id) { const r = state.records.find(x => x.id === id); if (!r) return; const copy = JSON.parse(JSON.stringify(r)); copy.id = makeId(); copy.title = `${r.title} - 复制`; copy.createdAt = nowIso(); copy.updatedAt = nowIso(); state.records.unshift(copy); state.currentRecordId = copy.id; saveLocal(); renderRecords() }
function deleteRecord(id) { const r = state.records.find(x => x.id === id); if (!r) return; if (!confirm(`确定删除 ${r.id} · ${r.title}？删除前建议先同步。`)) return; state.records = state.records.filter(x => x.id !== id); if (state.currentRecordId === id) state.currentRecordId = state.records[0]?.id || ''; saveLocal(); render() }

function renderKnowledgeList() {
  const app = qs('#app')
  const list = KNOWLEDGE.filter(k => !state.search || `${k.title} ${k.brief} ${k.body.join('')}`.includes(state.search))
  app.innerHTML = `<section class="card"><h1>知识库</h1><p>点大按钮进入知识卡。知识卡会反向显示用于哪些步骤。</p><input class="search-box" id="knowledgeSearch" type="text" value="${escapeHtml(state.search)}" placeholder="搜索：用神、旬空、月破、动爻……" /></section><section class="knowledge-list">${list.map(k => `<a class="knowledge-card" href="#knowledge-${k.id}"><div class="knowledge-title">${escapeHtml(k.title)}</div><div class="knowledge-desc">${escapeHtml(k.brief)}</div></a>`).join('')}</section>`
  qs('#knowledgeSearch').addEventListener('input', e => { state.search = e.target.value.trim(); renderKnowledgeList() })
}
function renderKnowledgeDetail(kid) {
  const app = qs('#app')
  const k = KNOWLEDGE.find(x => x.id === kid) || KNOWLEDGE[0]
  app.innerHTML = `<section class="card"><div class="kicker">知识卡 ${escapeHtml(k.id)}</div><h1>${escapeHtml(k.title)}</h1><p>${escapeHtml(k.brief)}</p><div class="callout"><b>用于步骤：</b><div class="tag-row">${k.steps.map(sid => `<a class="knowledge-chip" href="#step-${sid}">第 ${sid} 步：${escapeHtml(STEPS.find(s => s.id === sid)?.title || '')}</a>`).join('')}</div></div><h3>零基础解释</h3><ul>${k.body.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></section><section class="card compact"><div class="button-row"><a class="secondary-btn" href="#knowledge">回知识库</a><a class="ghost-btn" href="#home">回流程</a></div></section>`
}

function renderSummary() {
  const app = qs('#app')
  const r = ensureRecord()
  if (!r) { app.innerHTML = recordNeededHtml(); return }
  app.innerHTML = `<section class="card"><h1>自动汇总</h1><div class="record-id">${escapeHtml(r.id)}</div><h2>${escapeHtml(r.title)}</h2><p><b>问题：</b>${escapeHtml(r.plateInput?.question || r.question || '未填写')}</p><p class="small">创建：${escapeHtml(formatDate(r.createdAt))}；更新：${escapeHtml(formatDate(r.updatedAt))}</p><div class="button-row"><button class="secondary-btn" id="copySummaryBtn">复制断语草稿</button><button class="secondary-btn" id="exportJsonBtn">导出 JSON</button><button class="secondary-btn" id="exportTxtBtn">导出 TXT</button></div></section><section class="card"><h2>最终断语模板</h2>${finalField('verdict', '结论', '例如：此事可成，但先难后易 / 暂不成，需等出空')}${finalField('reason', '关键原因', '例如：用神得日生但旬空，动爻化进，待出空后有力')}${finalField('timing', '应期', '例如：出空之日、冲墓之日、用神值日')}${finalField('advice', '建议', '例如：先等消息，不宜当天强推；某日后再行动')}</section><section class="card"><h2>15 步记录汇总</h2><div class="summary-scroll"><table class="summary-table"><thead><tr><th>步骤</th><th>结论</th><th>证据</th><th>疑点</th></tr></thead><tbody>${STEPS.map(s => { const st = r.steps?.[s.id] || {}; return `<tr><td>${s.id}. ${escapeHtml(s.title)}</td><td>${escapeHtml(st.conclusion || '')}</td><td>${escapeHtml(st.evidence || '')}</td><td>${escapeHtml(st.doubt || '')}</td></tr>` }).join('')}</tbody></table></div></section>`
  qsa('[data-final-field]').forEach(el => el.addEventListener('input', () => { const rr = currentRecord(); rr.final[el.dataset.finalField] = el.value; touchRecord(rr) }))
  qs('#copySummaryBtn').addEventListener('click', copySummary)
  qs('#exportJsonBtn').addEventListener('click', () => downloadFile(`${r.id}.json`, JSON.stringify(r, null, 2), 'application/json'))
  qs('#exportTxtBtn').addEventListener('click', () => downloadFile(`${r.id}.txt`, buildSummaryText(r), 'text/plain'))
}
function finalField(key, label, placeholder) { const r = currentRecord(); return `<label>${escapeHtml(label)}</label><textarea data-final-field="${key}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(r.final?.[key] || '')}</textarea>` }
function buildSummaryText(r) { const lines = [`# ${r.id} · ${r.title}`, `问题：${r.plateInput?.question || r.question || ''}`, `起卦时间：${r.plateInput?.castTime || ''}`, `六爻数：${r.plateInput?.numbers?.join(',') || ''}`, '']; STEPS.forEach(s => { const st = r.steps?.[s.id] || {}; lines.push(`## ${s.id}. ${s.title}`); lines.push(`结论：${st.conclusion || ''}`); lines.push(`证据：${st.evidence || ''}`); lines.push(`疑点：${st.doubt || ''}`); lines.push('') }); lines.push('## 最终断语'); lines.push(`结论：${r.final?.verdict || ''}`); lines.push(`原因：${r.final?.reason || ''}`); lines.push(`应期：${r.final?.timing || ''}`); lines.push(`建议：${r.final?.advice || ''}`); return lines.join('\n') }
async function copySummary() { const r = currentRecord(); const text = buildSummaryText(r); await navigator.clipboard.writeText(text); alert('已复制') }
function downloadFile(filename, content, type) { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url) }

function renderSettings() {
  const app = qs('#app')
  app.innerHTML = `<section class="card"><h1>同步设置</h1><p class="small">本机自动保存；云同步使用 GitHub Secret Gist。不要在笔记里写敏感隐私。</p><label>GitHub Token</label><input id="tokenInput" type="password" value="${escapeHtml(state.settings.token || '')}" placeholder="只需要 gist 权限" /><label>Gist ID</label><input id="gistInput" type="text" value="${escapeHtml(state.settings.gistId || '')}" placeholder="创建云端笔记库后自动生成" /><p class="small">上次同步：${escapeHtml(state.settings.lastSync ? formatDate(state.settings.lastSync) : '从未同步')}</p><div class="button-row"><button class="primary-btn" id="createGistBtn">创建云端笔记库</button><button class="secondary-btn" id="uploadGistBtn">同步到云端</button><button class="secondary-btn" id="downloadGistBtn">从云端恢复</button></div></section>`
  qs('#tokenInput').addEventListener('input', e => { state.settings.token = e.target.value.trim(); saveLocal() })
  qs('#gistInput').addEventListener('input', e => { state.settings.gistId = e.target.value.trim(); saveLocal() })
  qs('#createGistBtn').addEventListener('click', createCloudGist)
  qs('#uploadGistBtn').addEventListener('click', uploadCloudGist)
  qs('#downloadGistBtn').addEventListener('click', downloadCloudGist)
}
function cloudPayload() { return { version: 2, exportedAt: nowIso(), records: state.records } }
function authHeaders() { return { 'Authorization': `Bearer ${state.settings.token}`, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json' } }
async function createCloudGist() { if (!state.settings.token) return alert('先填写 GitHub Token'); const res = await fetch('https://api.github.com/gists', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ description: 'liuyao-zhushou notes', public: false, files: { [CLOUD_FILE]: { content: JSON.stringify(cloudPayload(), null, 2) } } }) }); if (!res.ok) return alert(`创建失败：${res.status}`); const data = await res.json(); state.settings.gistId = data.id; state.settings.lastSync = nowIso(); saveLocal(); renderSettings(); alert('云端笔记库已创建') }
async function uploadCloudGist() { if (!state.settings.token || !state.settings.gistId) return alert('先填写 Token 和 Gist ID'); const res = await fetch(`https://api.github.com/gists/${state.settings.gistId}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ files: { [CLOUD_FILE]: { content: JSON.stringify(cloudPayload(), null, 2) } } }) }); if (!res.ok) return alert(`同步失败：${res.status}`); state.settings.lastSync = nowIso(); saveLocal(); renderSettings(); alert('已同步到云端') }
async function downloadCloudGist() { if (!state.settings.token || !state.settings.gistId) return alert('先填写 Token 和 Gist ID'); if (!confirm('从云端恢复会覆盖本机记录。继续？')) return; const res = await fetch(`https://api.github.com/gists/${state.settings.gistId}`, { headers: authHeaders() }); if (!res.ok) return alert(`读取失败：${res.status}`); const data = await res.json(); const file = data.files?.[CLOUD_FILE]; if (!file?.content) return alert('云端没有找到笔记文件'); const payload = JSON.parse(file.content); state.records = Array.isArray(payload.records) ? payload.records : []; state.currentRecordId = state.records[0]?.id || ''; state.settings.lastSync = nowIso(); saveLocal(); render(); alert('已从云端恢复') }

function init() {
  loadLocal()
  window.addEventListener('hashchange', render)
  if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('./sw.js').catch(console.warn)
  render()
}

document.addEventListener('DOMContentLoaded', init)
