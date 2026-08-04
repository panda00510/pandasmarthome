import { useEffect } from 'react'
import { brand, brandAssets } from '../config/brand'
import { hasAddress, site, socialLinks } from '../config/site'
import { langPath, useI18n } from '../i18n/context'

/** Upsert a `<meta>` tag by its name/property attribute. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

/** Upsert a `<link>` tag keyed by rel (+ hreflang when present). */
function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    if (hreflang) el.hreflang = hreflang
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * Keeps the document head in sync with the active language and emits the
 * structured data.
 *
 * Contact details are only ever written into the JSON-LD when they are
 * genuinely configured — an unconfigured deployment publishes a business
 * description with no phone, email or address rather than a placeholder.
 */
export function Seo() {
  const { lang, t } = useI18n()

  useEffect(() => {
    document.title = t.meta.title

    setMeta('name', 'description', t.meta.description)
    setMeta('name', 'keywords', t.meta.keywords)
    setMeta('property', 'og:title', t.meta.title)
    setMeta('property', 'og:description', t.meta.description)
    setMeta('property', 'og:image:alt', t.meta.ogImageAlt)
    setMeta('property', 'og:locale', lang === 'zh' ? 'zh_SG' : 'en_SG')
    setMeta('property', 'og:locale:alternate', lang === 'zh' ? 'en_SG' : 'zh_SG')
    setMeta('name', 'twitter:title', t.meta.title)
    setMeta('name', 'twitter:description', t.meta.description)

    // Absolute URLs need a configured origin; without one we publish neither a
    // canonical nor hreflang rather than guessing at the deployed domain.
    if (site.url) {
      setLink('canonical', site.url + langPath(lang))
      setLink('alternate', site.url + langPath('en'), 'en')
      setLink('alternate', site.url + langPath('zh'), 'zh-Hans')
      setLink('alternate', site.url + langPath('en'), 'x-default')
      setMeta('property', 'og:url', site.url + langPath(lang))
      setMeta('property', 'og:image', site.url + brandAssets.ogImage)
      setMeta('name', 'twitter:image', site.url + brandAssets.ogImage)
    }
  }, [lang, t])

  const business: Record<string, unknown> = {
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': site.url ? `${site.url}#business` : undefined,
    name: lang === 'zh' ? site.companyNameZh : site.companyName,
    alternateName: lang === 'zh' ? brand.name : brand.nameZh,
    description: t.meta.description,
    url: site.url ?? undefined,
    logo: site.url ? site.url + brandAssets.ogImage : undefined,
    image: site.url ? site.url + brandAssets.ogImage : undefined,
    areaServed: { '@type': 'Country', name: 'Singapore' },
    knowsLanguage: ['en', 'zh-Hans'],
    // Contact channels appear only when a real value is configured.
    email: site.email ?? undefined,
    telephone: site.telephone ?? undefined,
    address: hasAddress
      ? {
          '@type': 'PostalAddress',
          streetAddress: site.address.street ?? undefined,
          addressLocality: site.address.locality ?? undefined,
          postalCode: site.address.postalCode ?? undefined,
          addressCountry: site.address.country,
        }
      : undefined,
    sameAs: socialLinks.length ? socialLinks.map(([, url]) => url) : undefined,
    makesOffer: t.solutions.items.map((item) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: item.title, description: item.body },
    })),
  }

  const faq = {
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [business, faq],
  }

  return (
    <script
      type="application/ld+json"
      // JSON.stringify drops the `undefined` values above, so unconfigured
      // details never reach the markup.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}
    />
  )
}
