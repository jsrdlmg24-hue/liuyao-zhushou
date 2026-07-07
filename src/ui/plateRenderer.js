import { coinThrowName } from './coinOptions.js'

const GAN_WUXING = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水'
}

const ZHI_WUXING = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水'
}

const WUXING_CLASS = {
  木: 'wx-mu', 火: 'wx-huo', 土: 'wx-tu', 金: 'wx-jin', 水: 'wx-shui'
}

export function escapeHtml(str = '') {
  return String(str).replace(/[&<>'"]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[s])
}

export function renderPlateViewModelHtml(vm, options = {}) {
  if (!vm) return '<p class="small">暂无盘面。</p>'
  const rows = [...vm.rows].reverse()
  const compact = !!options.compact

  return `
    <div class="liuyao-plate ${compact ? 'liuyao-plate-compact' : ''}">
      <section class="plate-question-block">
        <div><b>日期：</b>${escapeHtml(vm.header.castTimeText)}</div>
        <div><b>占问：</b>${escapeHtml(vm.header.question || '未填写')}</div>
      </section>

      <section class="plate-strip">
        <b>十二：</b>
        ${renderChangshengText(vm.header.changshengText)}
      </section>

      <section class="plate-strip">
        <b>神煞：</b>
        ${renderTimeShensha(vm.header.timeShensha)}
      </section>

      <section class="plate-main-card">
        <div class="plate-pillars">
          <span>${renderGanZhiText(vm.header.pillars.nian)}年</span>
          <span>${renderGanZhiText(vm.header.pillars.yue)}月</span>
          <span class="day-pillar">${renderGanZhiText(vm.header.pillars.ri)}日</span>
          <span>${renderGanZhiText(vm.header.pillars.shi)}时</span>
        </div>
        <div class="plate-kongwang">
          年空:${escapeHtml(vm.header.kongwangText.nian)} / 月空:${escapeHtml(vm.header.kongwangText.yue)} / <b>日空:${escapeHtml(vm.header.kongwangText.ri)}</b> / 时空:${escapeHtml(vm.header.kongwangText.shi)}
        </div>
        <div class="hex-title-row">
          <div>
            <div class="hex-name">${escapeHtml(vm.originalHexagram.name)}</div>
            <div class="hex-sub">${escapeHtml(vm.originalHexagram.palace)}宫 · ${escapeHtml(vm.originalHexagram.palacePosName)}</div>
          </div>
          <div class="hex-arrow">→</div>
          <div>
            <div class="hex-name">${escapeHtml(vm.changedHexagram.name)}</div>
            <div class="hex-sub">${escapeHtml(vm.changedHexagram.palace)}宫 · ${escapeHtml(vm.changedHexagram.palacePosName)}</div>
          </div>
        </div>

        <div class="plate-scroll">
          <table class="plate-table classical-plate-table">
            <thead>
              <tr>
                <th>六神</th>
                <th>伏神</th>
                <th>本卦</th>
                <th>爻</th>
                <th>变卦</th>
                <th>标记</th>
              </tr>
            </thead>
            <tbody>${rows.map(row => renderClassicalRow(row)).join('')}</tbody>
          </table>
        </div>
      </section>
    </div>
  `
}

function renderClassicalRow(row) {
  const classes = [
    row.highlights.isMoving ? 'moving-line' : '',
    row.highlights.isShi ? 'shi-line' : '',
    row.highlights.isYing ? 'ying-line' : '',
    row.highlights.isDayKong ? 'kong-line' : '',
    row.highlights.isMonthZhi ? 'month-line' : '',
    row.highlights.isDayZhi ? 'day-line' : ''
  ].filter(Boolean).join(' ')

  const fushen = row.fushen ? `${row.fushen.liuqin} ${renderGanZhi(row.fushen.gan, row.fushen.zhi)} ${wx(row.fushen.wuxing)}` : ''
  const move = row.changing ? (row.number === 6 ? '×' : '○') : ''
  const role = row.role ? `<span class="role-badge">${escapeHtml(row.role)}</span>` : ''
  const shensha = row.highlights.shensha.length ? row.highlights.shensha.map(x => `<span class="shensha-badge">${escapeHtml(x)}</span>`).join('') : ''

  return `
    <tr class="${classes}">
      <td class="liushen-cell">${escapeHtml(row.liushen)}</td>
      <td class="fushen-cell">${fushen}</td>
      <td class="yao-detail-cell">${escapeHtml(row.original.liuqin)} ${renderGanZhi(row.original.gan, row.original.zhi)} ${wx(row.original.wuxing)}</td>
      <td class="yao-symbol-cell">
        <span class="line-symbol">${lineSymbol(row.yinYang)}</span>
        <span class="move-symbol">${move}</span>
        ${role}
        <span class="coin-throw">${escapeHtml(coinThrowName(row.number))}</span>
      </td>
      <td class="yao-detail-cell changed-cell">${escapeHtml(row.changed.liuqin)} ${renderGanZhi(row.changed.gan, row.changed.zhi)} ${wx(row.changed.wuxing)} <span class="line-symbol small-line">${lineSymbol(row.changed.yinYang)}</span></td>
      <td class="highlight-cell">${renderHighlightBadges(row)}${shensha}</td>
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
  if (row.highlights.isMoving) badges.push('动')
  if (row.highlights.isShi) badges.push('世')
  if (row.highlights.isYing) badges.push('应')
  return badges.map(x => `<span class="hl-badge">${escapeHtml(x)}</span>`).join('')
}

function lineSymbol(yinYang) {
  return yinYang === '阳' ? '━━━━' : '━━　━━'
}

function renderGanZhi(gan, zhi) {
  return `${spanWuxing(gan, GAN_WUXING[gan])}${spanWuxing(zhi, ZHI_WUXING[zhi])}`
}

function renderGanZhiText(text = '') {
  const chars = String(text).split('')
  return chars.map(ch => {
    if (GAN_WUXING[ch]) return spanWuxing(ch, GAN_WUXING[ch])
    if (ZHI_WUXING[ch]) return spanWuxing(ch, ZHI_WUXING[ch])
    return escapeHtml(ch)
  }).join('')
}

function spanWuxing(value, wuxing) {
  const cls = WUXING_CLASS[wuxing] || ''
  return `<span class="ganzhi ${cls}">${escapeHtml(value)}</span>`
}

function wx(wuxing) {
  return `<span class="wx-label ${WUXING_CLASS[wuxing] || ''}">${escapeHtml(wuxing)}</span>`
}

function renderChangshengText(changshengText) {
  return Object.values(changshengText || {}).map(item => renderGanZhiText(item)).join('　')
}

function renderTimeShensha(items = []) {
  if (!items.length) return '<span class="muted-text">无</span>'
  return items.map(item => `<span class="deity-chip">${escapeHtml(item.name)}-${renderGanZhiText(item.value)}</span>`).join(' ')
}
