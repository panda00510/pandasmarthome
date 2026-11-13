import { site } from '../config/site'
import { parsePath } from '../i18n/context'

/**
 * Conversion events, sent to Plausible and/or Google Analytics 4 only when
 * VITE_PLAUSIBLE_DOMAIN / VITE_GA_MEASUREMENT_ID are set. With neither set
 * this is a no-op and no third-party script is loaded. No cookies: Plausible
 * sets none, and GA runs with analytics/ad storage denied (cookieless pings).
 *
 * Props are the page path, the language and a fixed `source`/`to` label —
 * never form contents or anything about the visitor.
 */

type Props = Record<string, string>
type Queue = ((...args: unknown[]) => void) & { q?: unknown[][] }
declare global {
  interface Window {
    plausible?: Queue
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const enabled = Boolean(site.plausibleDomain || site.gaMeasurementId)

function addScript(src: string, attrs: Record<string, string> = {}) {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  for (const [name, value] of Object.entries(attrs)) script.setAttribute(name, value)
  document.head.appendChild(script)
}

/** Load the configured service(s) once the page has loaded; events queue until then. */
function load() {
  if (site.plausibleDomain) {
    // Plausible's queue stub: calls made before its script arrives are replayed.
    window.plausible ??= (...args: unknown[]) => void (window.plausible!.q ??= []).push(args)
    addScript(site.plausibleSrc, { 'data-domain': site.plausibleDomain })
  }
  if (site.gaMeasurementId) {
    window.dataLayer ??= []
    // gtag.js reads `arguments` objects from the dataLayer, not arrays.
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
    window.gtag('js', new Date())
    window.gtag('config', site.gaMeasurementId)
    addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(site.gaMeasurementId)}`)
  }
}

export function track(event: string, props: Props = {}) {
  if (!enabled) return
  const all = { page: window.location.pathname, lang: parsePath(window.location.pathname).lang, ...props }
  window.plausible?.(event, { props: all })
  window.gtag?.('event', event, all)
}

/** Which WhatsApp button: an explicit data-track-source, else where it sits. */
function whatsappSource(link: Element) {
  const explicit = link.closest<HTMLElement>('[data-track-source]')?.dataset.trackSource
  if (explicit) return explicit
  if (link.closest('#contact')) return 'contact'
  if (link.closest('#top')) return 'hero'
  if (link.closest('footer')) return 'footer'
  const { path } = parsePath(window.location.pathname)
  const pages: Record<string, string> = {
    'products/': 'products',
    'custom-hardware/': 'hardware',
    'signage/': 'signage',
    'software/': 'software',
  }
  const sections: Record<string, string> = { guides: 'guide', solutions: 'solution', homes: 'home' }
  return pages[path] ?? sections[path.split('/')[0]] ?? 'page'
}

/**
 * One click listener for the whole site. Links are recognised by their href
 * (wa.me, mailto:, tel:, /showroom/); anything else opts in with
 * data-track="event_name", and data-track-<key>="value" become props.
 */
export function startTracking() {
  if (!enabled) return
  if (document.readyState === 'complete') load()
  else window.addEventListener('load', load, { once: true })

  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest?.('a, button, [data-track]')
    if (!el) return
    const tagged = el.closest<HTMLElement>('[data-track]')
    if (tagged) {
      if (tagged.getAttribute('aria-current') === 'page') return
      const props: Props = {}
      for (const [key, value] of Object.entries(tagged.dataset)) {
        if (key.startsWith('track') && key !== 'track' && value) props[key.slice(5).toLowerCase()] = value
      }
      track(tagged.dataset.track!, props)
      return
    }
    const href = el.getAttribute('href') ?? ''
    if (href.startsWith('https://wa.me/')) track('whatsapp_click', { source: whatsappSource(el) })
    else if (href.startsWith('mailto:')) track('email_click')
    else if (href.startsWith('tel:')) track('tel_click')
    else if (href.includes('/showroom/')) track('showroom_open')
  })
}
