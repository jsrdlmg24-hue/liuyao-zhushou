function currentRoute() {
  return location.hash || '#home'
}

function shouldHidePlateDock() {
  const route = currentRoute()
  return route === '#home' || route === '#plate' || route === '#records'
}

function removeWeightSection() {
  document.querySelectorAll('#app .card').forEach(card => {
    const kicker = card.querySelector('.kicker')
    if (kicker && kicker.textContent.trim() === '资料权重') {
      card.remove()
    }
  })
}

function applyPageCleanup() {
  const dock = document.querySelector('#plateDock')
  if (dock) {
    dock.style.display = shouldHidePlateDock() ? 'none' : ''
  }
  removeWeightSection()
}

window.addEventListener('hashchange', () => setTimeout(applyPageCleanup, 0))
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(applyPageCleanup, 0)
  const app = document.querySelector('#app')
  if (app) {
    new MutationObserver(applyPageCleanup).observe(app, { childList: true, subtree: true })
  }
})
