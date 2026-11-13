import { useEffect } from 'react'
import { brand, brandAssets } from '../config/brand'
import { hasAddress, site, socialLinks } from '../config/site'
import { hubOf, pageMeta } from '../content/guides'
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
  // Stable node ids so the graph's pieces reference each other.
  const id = (node: string) => (url ? `${url}#${node}` : undefined)
  const ref = (node: string) => (url ? { '@id': `${url}#${node}` } : undefined)
  const businessRef = site.url ? { '@id': `${site.url}#business` } : undefined

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
    '@type': ['Organization', 'LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': site.url ? `${site.url}#business` : undefined,
    name: lang === 'zh' ? site.companyNameZh : site.companyName,
    alternateName: lang === 'zh' ? brand.name : brand.nameZh,
    description: t.meta.description,
    url: site.url ?? undefined,
    logo: site.url ? { '@type': 'ImageObject', url: `${site.url}/icon-512.png`, width: 512, height: 512 } : undefined,
    image: site.url ? site.url + brandAssets.ogImage : undefined,
    areaServed,
    knowsLanguage: ['en', 'zh-Hans'],
    knowsAbout: ['Smart home', 'Home automation', 'Matter', 'Zigbee', 'Thread', 'Home Assistant', 'ESP32'],
    // Registered entity number (UEN), only when configured.
    identifier: site.registrationNumber
      ? { '@type': 'PropertyValue', propertyID: 'UEN', value: site.registrationNumber }
      : undefined,
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
    '@id': id('faq'),
    isPartOf: site.url ? { '@id': `${site.url}#website` } : undefined,
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  // Article pages describe the article and its place in the site; the FAQ
  // belongs to the homepage only.
  const topicHub = guide?.kind === 'page' ? hubOf(guide.path.replace(/[^/]+\/$/, '')) : null
  const article = guide
    ? [
        {
          '@type': guide.kind === 'page' ? 'WebPage' : 'Article',
          '@id': id(guide.kind === 'page' ? 'webpage' : 'article'),
          isPartOf: site.url ? { '@id': `${site.url}#website` } : undefined,
          breadcrumb: ref('breadcrumb'),
          about: businessRef && guide.kind === 'page' ? businessRef : undefined,
          headline: guide.title,
          description: guide.description,
          datePublished: guide.published,
          dateModified: guide.updated,
          inLanguage: lang === 'zh' ? 'zh-Hans-SG' : 'en-SG',
          mainEntityOfPage: url,
          url,
          image: site.url ? site.url + brandAssets.ogImage : undefined,
          author: site.url ? { '@id': `${site.url}#business` } : undefined,
          publisher: site.url ? { '@id': `${site.url}#business` } : undefined,
        },
        guide.kind === 'page' && guide.path.startsWith('solutions/')
          ? {
              '@type': 'Service',
              '@id': id('service'),
              name: guide.title,
              description: guide.description,
              url: url ?? undefined,
              provider: site.url ? { '@id': `${site.url}#business` } : undefined,
              areaServed: { '@type': 'Country', name: 'Singapore' },
            }
          : null,
        guide.faq.length
          ? {
              '@type': 'FAQPage',
              '@id': id('faq'),
              isPartOf: site.url ? { '@id': `${site.url}#website` } : undefined,
              mainEntity: guide.faq.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
              })),
            }
          : null,
        site.url
          ? {
              '@type': 'BreadcrumbList',
              '@id': id('breadcrumb'),
              itemListElement: [
                { name: lang === 'zh' ? brand.nameZh : brand.name, item: site.url + langPath(lang) },
                ...(guide.kind === 'guide'
                  ? [{ name: t.guides.eyebrow, item: site.url + langPath(lang, 'guides/') }]
                  : []),
                // Topic pages sit under their hub (/homes/, /solutions/).
                ...(topicHub
                  ? [{ name: t.hubs[topicHub].eyebrow, item: site.url + langPath(lang, `${topicHub}/`) }]
                  : []),
                { name: guide.title, item: site.url + langPath(lang, guide.path) },
              ].map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })),
            }
          : null,
      ].filter(Boolean)
    : []

  // Pre-order devices, listed by name only. They are deliberately NOT marked
  // up as Product + Offer: nothing can be bought on this site, there are no
  // product photos, and no shipping or returns policy yet, so Google's
  // merchant-listing checks (image, shippingDetails, hasMerchantReturnPolicy,
  // review, aggregateRating) can only fail. Restore Product markup when real
  // photos and those policies exist.
  const productList =
    path === 'products/'
      ? {
          '@type': 'ItemList',
          name: t.products.title,
          itemListElement: t.products.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.title,
            description: `${item.body} ${t.products.status}. ${t.products.priceLabel}.`,
            url: url ? `${url}#${item.id}` : undefined,
          })),
        }
      : null

  const productFaq =
    path === 'products/'
      ? {
          '@type': 'FAQPage',
          mainEntity: t.products.faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }
      : null

  // Starting prices for custom software. No client list and no ratings.
  const softwareList =
    path === 'software/'
      ? {
          '@type': 'ItemList',
          name: t.software.title,
          itemListElement: t.software.packages.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Service',
              name: item.title,
              description: `${item.body} ${t.software.support}`,
              provider: site.url ? { '@id': `${site.url}#business` } : undefined,
              areaServed: { '@type': 'Country', name: 'Singapore' },
              offers: {
                '@type': 'Offer',
                priceCurrency: 'SGD',
                price: item.priceSgd,
                url: url ? `${url}#${item.id}` : undefined,
                description: t.software.priceLabel,
              },
            },
          })),
        }
      : null

  const softwareFaq =
    path === 'software/'
      ? {
          '@type': 'FAQPage',
          mainEntity: t.software.faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }
      : null

  // Custom ESP32 hardware: one Service with its capability groups as an
  // OfferCatalog. No prices, no client list, no ratings.
  const hardwareService =
    path === 'custom-hardware/'
      ? {
          '@type': 'Service',
          name: t.hardware.title,
          serviceType: t.hardware.eyebrow,
          description: `${t.hardware.lead} ${t.hardware.tiersNote}`,
          provider: site.url ? { '@id': `${site.url}#business` } : undefined,
          areaServed: { '@type': 'Country', name: 'Singapore' },
          url: url ?? undefined,
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: t.hardware.groupsTitle,
            itemListElement: t.hardware.groups.map((group) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: group.title, description: group.body },
            })),
          },
          // Indicative starting prices per level of custom, as on the page.
          offers: t.hardware.tiers.map((tier) => ({
            '@type': 'Offer',
            name: tier.title,
            description: tier.body,
            priceCurrency: 'SGD',
            priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'SGD', minPrice: tier.priceSgd },
          })),
        }
      : null

  const hardwareFaq =
    path === 'custom-hardware/'
      ? {
          '@type': 'FAQPage',
          mainEntity: t.hardware.faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }
      : null

  // Index pages (hubs, guides, products, software): a CollectionPage/WebPage
  // node with a two-step breadcrumb. Guides and topic pages have their own above.
  const indexPage =
    !guide && path !== '' && site.url
      ? [
          {
            '@type': hubOf(path) || path === 'guides/' ? 'CollectionPage' : 'WebPage',
            '@id': id('webpage'),
            url,
            name: title,
            description,
            inLanguage: lang === 'zh' ? 'zh-Hans-SG' : 'en-SG',
            isPartOf: { '@id': `${site.url}#website` },
            about: businessRef,
            breadcrumb: ref('breadcrumb'),
          },
          {
            '@type': 'BreadcrumbList',
            '@id': id('breadcrumb'),
            itemListElement: [
              { name: lang === 'zh' ? brand.nameZh : brand.name, item: site.url + langPath(lang) },
              { name: title, item: url },
            ].map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })),
          },
        ]
      : []

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      business,
      ...(path === ''
        ? [faq]
        : path === 'products/'
          ? [productList, productFaq]
          : path === 'software/'
            ? [softwareList, softwareFaq]
            : path === 'custom-hardware/'
              ? [hardwareService, hardwareFaq]
              : article),
      ...indexPage,
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
