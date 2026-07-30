/** Elfsight Google Reviews — betrouwbare (her)initialisatie voor Vue SPA + Safari */

const PLATFORM_SRC = 'https://static.elfsight.com/platform/platform.js'
const SCRIPT_ID = 'elfsight-platform'

type ElfsightWindow = Window & {
  ElfsightEmbeds?: { widgets: { initialize: () => void } }
  Elfsight?: { reload: () => void }
  eapps?: unknown
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function tryInitialize() {
  const w = window as ElfsightWindow
  if (w.ElfsightEmbeds?.widgets?.initialize) {
    w.ElfsightEmbeds.widgets.initialize()
    return true
  }
  if (w.Elfsight?.reload) {
    w.Elfsight.reload()
    return true
  }
  return false
}

function platformReady() {
  const w = window as ElfsightWindow
  return Boolean(w.ElfsightEmbeds?.widgets?.initialize || w.Elfsight?.reload || w.eapps)
}

function widgetRendered(root: HTMLElement) {
  return Boolean(
    root.querySelector('iframe, [class*="Widget"], [class*="eapps"], [class*="es-"]')
    || root.childElementCount > 0,
  )
}

/** Zorg dat platform.js geladen is (Safari mist soms de async head-script). */
export function ensureElfsightPlatform(): Promise<void> {
  if (platformReady()) return Promise.resolve()

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    || document.querySelector<HTMLScriptElement>(`script[src*="platform.js"]`)

  if (existing) {
    return new Promise((resolve) => {
      if (platformReady()) {
        resolve()
        return
      }
      const done = () => resolve()
      existing.addEventListener('load', done, { once: true })
      // Fallback als load al geweest is
      setTimeout(done, 2000)
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = PLATFORM_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Elfsight platform.js failed to load'))
    document.head.appendChild(script)
  })
}

/**
 * Leegt de host, plaatst een verse widget-root en forceert (her)initialisatie.
 * Belangrijk voor Safari bij client-side navigatie in Vue Router.
 */
export async function mountElfsightWidget(host: HTMLElement, widgetId: string) {
  host.replaceChildren()
  const root = document.createElement('div')
  root.className = `elfsight-app-${widgetId}`
  host.appendChild(root)

  try {
    await ensureElfsightPlatform()
  } catch {
    return
  }

  for (const delay of [0, 150, 400, 900, 1600]) {
    if (delay) await sleep(delay)
    tryInitialize()
    if (widgetRendered(root)) return
  }

  // Laatste poging
  tryInitialize()
}

/** Herinitialiseer alle zichtbare Elfsight-roots (route-wissel). */
export async function reinitElfsightWidgets() {
  try {
    await ensureElfsightPlatform()
  } catch {
    return
  }
  for (const delay of [0, 200, 600]) {
    if (delay) await sleep(delay)
    tryInitialize()
  }
}
