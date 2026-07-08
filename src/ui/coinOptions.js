export const DEFAULT_NUMBERS = [8, 8, 8, 8, 8, 8]
export const LINE_LABELS = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']

export const COIN_THROW_OPTIONS = [
  {
    value: 6,
    throwLabel: '三字',
    type: '老阴',
    meaning: '阴动 → 变阳',
    text: '三字｜6 老阴｜阴动变阳'
  },
  {
    value: 7,
    throwLabel: '两字一背',
    type: '少阳',
    meaning: '阳静',
    text: '两字一背｜7 少阳｜阳静'
  },
  {
    value: 8,
    throwLabel: '一字两背',
    type: '少阴',
    meaning: '阴静',
    text: '一字两背｜8 少阴｜阴静'
  },
  {
    value: 9,
    throwLabel: '三背',
    type: '老阳',
    meaning: '阳动 → 变阴',
    text: '三背｜9 老阳｜阳动变阴'
  }
]

export function coinThrowName(value) {
  return COIN_THROW_OPTIONS.find(item => item.value === Number(value))?.throwLabel || String(value)
}

export function isValidYaoNumber(value) {
  return [6, 7, 8, 9].includes(Number(value))
}

function autoYaoNumber() {
  let total = 0
  for (let i = 0; i < 3; i += 1) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    total += array[0] % 2 === 0 ? 2 : 3
  }
  return total
}

function routeHash() {
  return location.hash || '#home'
}

function styleHeroActions() {
  const row = document.querySelector('.hero .button-row')
  if (!row) return
  const plateLink = row.querySelector('a[href="#plate"]')
  const recordsLink = row.querySelector('a[href="#records"]')
  const summaryLink = row.querySelector('a[href="#summary"]')
  if (!plateLink || !recordsLink || !summaryLink) return

  row.classList.add('hero-action-layout')
  row.style.display = 'grid'
  row.style.gridTemplateColumns = window.innerWidth <= 700 ? '1fr' : 'minmax(0, 1fr) auto'
  row.style.gridTemplateRows = window.innerWidth <= 700 ? 'auto auto auto' : 'auto auto'
  row.style.alignItems = 'center'
  row.style.columnGap = '18px'
  row.style.rowGap = '10px'
  row.style.marginTop = '18px'

  plateLink.classList.add('home-plate-cta')
  plateLink.style.gridColumn = '1'
  plateLink.style.gridRow = window.innerWidth <= 700 ? '1' : '1 / span 2'
  plateLink.style.justifySelf = 'center'
  plateLink.style.minWidth = window.innerWidth <= 700 ? 'min(100%, 310px)' : '270px'
  plateLink.style.minHeight = window.innerWidth <= 700 ? '82px' : '78px'
  plateLink.style.padding = window.innerWidth <= 700 ? '24px 38px' : '22px 42px'
  plateLink.style.borderRadius = '24px'
  plateLink.style.fontSize = window.innerWidth <= 700 ? '29px' : '28px'
  plateLink.style.fontWeight = '900'
  plateLink.style.background = '#102f4c'
  plateLink.style.color = '#fff'
  plateLink.style.boxShadow = '0 14px 30px rgba(0, 0, 0, .24)'

  ;[recordsLink, summaryLink].forEach((link, index) => {
    link.style.gridColumn = window.innerWidth <= 700 ? '1' : '2'
    link.style.gridRow = window.innerWidth <= 700 ? String(index + 2) : String(index + 1)
    link.style.justifySelf = window.innerWidth <= 700 ? 'center' : 'end'
    link.style.minHeight = window.innerWidth <= 700 ? '40px' : '42px'
    link.style.padding = window.innerWidth <= 700 ? '8px 14px' : '9px 16px'
    link.style.borderRadius = '16px'
    link.style.fontSize = window.innerWidth <= 700 ? '14px' : '15px'
    link.style.fontWeight = '800'
  })
}

function bindPlateBuildAction() {
  if (routeHash() !== '#plate') return
  const buildBtn = document.querySelector('#buildPlateBtn')
  if (!buildBtn || buildBtn.dataset.boundBuildRedirect === '1') return
  buildBtn.dataset.boundBuildRedirect = '1'
  buildBtn.textContent = '排盘并开始读盘'
  buildBtn.addEventListener('click', () => {
    setTimeout(() => {
      location.hash = '#step-1'
    }, 0)
  })
}

function cleanupHomeAndPlate() {
  const app = document.querySelector('#app')
  if (!app) return

  const heroTitle = app.querySelector('.hero h1')
  if (heroTitle && heroTitle.textContent.trim() === '15 步读盘流程') {
    heroTitle.textContent = '六爻助手'
  }

  const plateLink = app.querySelector('.hero a[href="#plate"]')
  if (plateLink) {
    plateLink.classList.add('home-plate-cta')
  }
  styleHeroActions()

  app.querySelectorAll('.card').forEach(card => {
    const kicker = card.querySelector('.kicker')
    if (kicker && kicker.textContent.trim() === '资料权重') {
      card.remove()
    }
    const title = card.querySelector('h2')
    if (routeHash() === '#plate' && title && title.textContent.trim() === '完整盘面') {
      card.remove()
    }
  })

  const dock = document.querySelector('#plateDock')
  if (dock) {
    const shouldHideDock = routeHash() === '#home' || routeHash() === '#plate' || routeHash() === '#records'
    dock.style.display = shouldHideDock ? 'none' : ''
  }

  injectAutoCasting()
  bindPlateBuildAction()
}

function injectAutoCasting() {
  if (routeHash() !== '#plate') return
  const grid = document.querySelector('.yao-input-grid')
  const resetBtn = document.querySelector('#resetPlateBtn')
  if (!grid || !resetBtn || document.querySelector('#autoCastBtn')) return

  const note = document.createElement('div')
  note.className = 'auto-cast-note callout warn'
  note.innerHTML = '<b>电脑自动摇卦：</b>使用前请先静心，心诚，默念所求的事情 10 秒钟，再按键生成。'

  const button = document.createElement('button')
  button.id = 'autoCastBtn'
  button.type = 'button'
  button.className = 'secondary-btn full auto-cast-btn'
  button.textContent = '电脑自动摇卦'
  button.addEventListener('click', () => {
    const values = Array.from({ length: 6 }, autoYaoNumber)
    document.querySelectorAll('[data-plate-yao-index]').forEach((select, index) => {
      select.value = String(values[index])
      select.dispatchEvent(new Event('change', { bubbles: true }))
    })
    document.querySelector('#buildPlateBtn')?.click()
  })

  grid.insertAdjacentElement('afterend', note)
  note.insertAdjacentElement('afterend', button)
}

function startPageCleanup() {
  cleanupHomeAndPlate()
  const app = document.querySelector('#app')
  if (app) {
    new MutationObserver(cleanupHomeAndPlate).observe(app, { childList: true, subtree: true })
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => setTimeout(cleanupHomeAndPlate, 0))
  window.addEventListener('resize', () => setTimeout(styleHeroActions, 0))
  document.addEventListener('DOMContentLoaded', () => setTimeout(startPageCleanup, 0))
}
