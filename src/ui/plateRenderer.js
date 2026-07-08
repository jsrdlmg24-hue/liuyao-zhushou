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

      <section class="plate-strip plate-twelve-strip">
        <b>十二：</b>${renderChangshengText(vm.header.changshengText)}
      </section>

      <section class="plate-strip plate-deity-strip">
        <b>神煞：</b>${renderTimeShensha(vm.header.timeShensha)}
      </section>

      <section class="plate-main-card">
        <div class="plate-pillars">
          <span>${renderGanZhiText(vm.header.pillars.nian)}年</span>
          <span>${renderGanZhiText(vm.header.pillars.yue)}月</span>
          <span class="day-pillar">${renderGanZhiText(vm.header.pillars.ri)}日</span>
          <span>${renderGanZhiText(vm.header.pillars.shi)}时</span>
        </div>
        <div class="plate-kongwang">
          <span>年空:${renderKongwangText(vm.header.kongwangText.nian)}</span>
          <span>月空:${renderKongwangText(vm.header.kongwangText.yue)}</span>
          <span class="day-kong-highlight">日空:${renderKongwangText(vm.header.kongwangText.ri)}</span>
          <span>时空:${renderKongwangText(vm.header.kongwangText.shi)}</span>
        </div>

        <div class="hex-title-row">
          <div class="hex-title-box original-title-box">
            <span class="hex-label">本卦</span>
            <span class="hex-name">${escapeHtml(vm.originalHexagram.name)}</span>
            <span class="hex-sub">${escapeHtml(vm.originalHexagram.palace)}宫 · ${escapeHtml(vm.originalHexagram.palacePosName)}</span>
          </div>
          <div class="hex-title-box changed-title-box">
            <span class="hex-label">变卦</span>
            <span class="hex-name">${escapeHtml(vm.changedHexagram.name)}</span>
            <span class="hex-sub">${escapeHtml(vm.changedHexagram.palace)}宫 · ${escapeHtml(vm.changedHexagram.palacePosName)}</span>
          </div>
        </div>

        <div class="plate-line-list">
          ${rows.map(row => renderClassicalRow(row)).join('')}
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

  const fushen = row.fushen ? `${row.fushen.liuqin}${renderGanZhi(row.fushen.gan, row.fushen.zhi)}${wx(row.fushen.wuxing)}` : ''
  const move = row.changing ? (row.number === 6 ? '×' : '○') : ''
  const originalRole = row.role ? `<span class="role-badge original-role">本${escapeHtml(row.role)}</span>` : ''
  const changedRole = row.changed.role ? `<span class="role-badge changed-role">变${escapeHtml(row.changed.role)}</span>` : ''
  const shensha = row.highlights.shensha.length ? row.highlights.shensha.map(x => `<span class="shensha-badge">${escapeHtml(x)}</span>`).join('') : ''

  return `
    <div class="plate-line-row ${classes}">
      <div class="liushen-cell">${escapeHtml(row.liushen)}</div>
      <div class="fushen-cell">${fushen}</div>
      <div class="yao-detail-cell original-detail-cell">${escapeHtml(row.original.liuqin)}${renderGanZhi(row.original.gan, row.original.zhi)}${wx(row.original.wuxing)}</div>
      <div class="yao-line-cell original-line-cell"><span class="line-symbol">${lineSymbol(row.yinYang)}</span></div>
      <div class="move-cell"><span class="move-symbol">${move}</span></div>
      <div class="yao-line-cell changed-line-cell"><span class="line-symbol">${lineSymbol(row.changed.yinYang)}</span></div>
      <div class="yao-detail-cell changed-detail-cell">${escapeHtml(row.changed.liuqin)}${renderGanZhi(row.changed.gan, row.changed.zhi)}${wx(row.changed.wuxing)}</div>
      <div class="role-cell">${originalRole}${changedRole}</div>
      <div class="highlight-cell">${renderHighlightBadges(row)}${shensha}</div>
    </div>
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
  return badges.map(x => `<span class="hl-badge">${escapeHtml(x)}</span>`).join('')
}

function lineSymbol(yinYang) {
  return yinYang === '阳' ? '━━' : '━ ━'
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

function renderKongwangText(text = '') {
  return String(text).split('').map(ch => {
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
