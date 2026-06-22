/** Browser UI-kleur (Chrome Android, oudere Safari). Safari 26+ samplet .topbar in NavBar.vue. */
export const SITE_THEME_COLOR = '#319FE8'

export function applySiteTheme() {
  setMeta('theme-color', SITE_THEME_COLOR)
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
