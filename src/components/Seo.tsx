import { useEffect } from 'react'
import { brand, brandAssets } from '../config/brand'
import { hasAddress, site, socialLinks } from '../config/site'
import { guidePath, pageMeta } from '../content/guides'
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
  const { lang, t, path } = useI18n()
  const { title, description, guide } = pageMeta(lang, path)
  const url = site.url ? site.url + langPath(lang, path) : undefined

  useEffect(() => {
    document.title = title

    setMeta('name', 'description', description)
    setMeta('name', 'keywords', t.meta.keywords)
    setMeta('property', 'og:type', guide ? 'article' : 'website')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image:alt', t.meta.ogImageAlt)
    setMeta('property', 'og:locale', lang === 'zh' ? 'zh_SG' : 'en_SG')
    setMeta('property', 'og:locale:alternate', lang === 'zh' ? 'en_SG' : 'zh_SG')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)

    // Absolute URLs need a configured origin; without one we publish neither a
    // canonical nor hreflang rather than guessing at the deployed domain.
    if (site.url && url) {
      setLink('canonical', url)
      setLink('alternate', site.url + langPath('en', path), 'en')
      setLink('alternate', site.url + langPath('zh', path), 'zh-Hans')
      setLink('alternate', site.url + langPath('en', path), 'x-default')
      setMeta('property', 'og:url', url)
      setMeta('property', 'og:image', site.url + brandAssets.ogImage)
      setMeta('name', 'twitter:image', site.url + brandAssets.ogImage)
    }
  }, [lang, t, path, title, description, guide, url])

  // Singapore plus its five planning regions, so "smart home in Tampines"-style
  // queries have something explicit to match against.
  const areaServed = [
    { '@type': 'Country', name: 'Singapore' },
    ...t.homes.areas.regions.map((region) => ({
      '@type': 'AdministrativeArea',
      name: region.name,
      containedInPlace: { '@type': 'Country', name: 'Singapore' },
    })),
  ]

  const business: Record<string, unknown> = {
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': site.url ? `${site.url}#business` : undefined,
    name: lang === 'zh' ? site.companyNameZh : site.companyName,
    alternateName: lang === 'zh' ? brand.name : brand.nameZh,
    description: t.meta.description,
    url: site.url ?? undefined,
    logo: site.url ? site.url + brandAssets.ogImage : undefined,
    image: site.url ? site.url + brandAssets.ogImage : undefined,
    areaServed,
    knowsLanguage: ['en', 'zh-Hans'],
    keywords: t.meta.keywords,
    slogan: lang === 'zh' ? brand.taglineZh : brand.taglineEn,
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
      itemOffered: {
        '@type': 'Service',
        name: item.title,
        description: item.body,
        serviceType: 'Smart home installation',
        areaServed,
      },
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

  // Article pages describe the article and its place in the site; the FAQ
  // belongs to the homepage only.
  const article = guide
    ? [
        {
          '@type': 'Article',
          headline: guide.title,
          description: guide.description,
          datePublished: guide.published,
          dateModified: guide.updated,
          inLanguage: lang === 'zh' ? 'zh-Hans-SG' : 'en-SG',
          mainEntityOfPage: url,
          image: site.url ? site.url + brandAssets.ogImage : undefined,
          author: site.url ? { '@id': `${site.url}#business` } : undefined,
          publisher: site.url ? { '@id': `${site.url}#business` } : undefined,
        },
        site.url
          ? {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { name: lang === 'zh' ? brand.nameZh : brand.name, item: site.url + langPath(lang) },
                { name: t.guides.eyebrow, item: site.url + langPath(lang, 'guides/') },
                { name: guide.title, item: site.url + langPath(lang, guidePath(guide.slug)) },
              ].map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })),
            }
          : null,
      ].filter(Boolean)
    : []

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      business,
      ...(path === '' ? [faq] : article),
      {
        '@type': 'WebSite',
        '@id': site.url ? `${site.url}#website` : undefined,
        url: site.url ?? undefined,
        name: brand.name,
        alternateName: brand.nameZh,
        inLanguage: lang === 'zh' ? 'zh-Hans-SG' : 'en-SG',
        publisher: site.url ? { '@id': `${site.url}#business` } : undefined,
      },
    ],
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
