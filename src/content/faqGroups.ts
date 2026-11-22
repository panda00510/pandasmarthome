import type { Content } from './types'

/**
 * Every FAQ on the site, grouped by the page it comes from. /faq/ shows them
 * all, and <Seo> marks them up there as one FAQPage. No question is written
 * for /faq/ alone: edit the copy on the page that owns it.
 */
export const faqGroups = (t: Content) => [
  { id: 'smart-home', path: '', title: t.faq.page.homeGroup, items: t.faq.items },
  { id: 'products', path: 'products/', title: t.products.eyebrow, items: t.products.faq },
  { id: 'software', path: 'software/', title: t.software.eyebrow, items: t.software.faq },
  { id: 'custom-hardware', path: 'custom-hardware/', title: t.hardware.navLabel, items: t.hardware.faq },
  { id: 'signage', path: 'signage/', title: t.signage.navLabel, items: t.signage.faq },
]
