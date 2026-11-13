import { site } from '../config/site'
import { findGuide, pagePaths } from '../content/guides'
import type { Content } from '../content/types'
import type { Lang } from '../i18n/context'

/**
 * Every wa.me link on the site comes from here. The message only ever says
 * which page the visitor came from — never anything about the visitor.
 */

/** `wa.me/<number>?text=…` with the configured number, or null when none is set (the button is not rendered). */
export function whatsappHref(message: string): string | null {
  return site.whatsappLink ? `${site.whatsappLink}?text=${encodeURIComponent(message)}` : null
}

/**
 * The enquiry pages (products, software, custom hardware, signage) always show
 * their button: a configured number wins, otherwise the published business line.
 */
export function enquiryHref(message: string): string {
  return `${site.whatsappLink ?? 'https://wa.me/6580676515'}?text=${encodeURIComponent(message)}`
}

/** Whole message stays within this many characters; a long guide title is shortened to fit. */
const MAX = 200

/** The opening line for a page: guide title, home type, solution, or the page's own line. */
export function pageWhatsappMessage(t: Content, lang: Lang, path: string): string {
  const w = t.whatsapp
  if (!pagePaths.includes(path)) return w.notFound
  const guide = findGuide(lang, path)
  if (guide?.kind === 'guide') {
    const room = MAX - [...w.guide.replace('{title}', '')].length
    const title = [...guide.heading]
    return w.guide.replace('{title}', title.length > room ? title.slice(0, room - 1).join('').trimEnd() + '…' : guide.heading)
  }
  const enquiry: Record<string, string> = {
    'products/': t.products.enquireAll,
    'software/': t.software.enquireAll,
    'custom-hardware/': t.hardware.enquireAll,
    'signage/': t.signage.enquireAll,
  }
  return w.pages[path] ?? enquiry[path] ?? t.contact.whatsappGreeting
}
