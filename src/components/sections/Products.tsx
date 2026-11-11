import { ArrowRight, ChevronDown, MessageCircle } from 'lucide-react'
import { ProductArt } from '../graphics/ProductFigures'
import { Button, PhotoTag, SectionHeading } from '../ui'
import { site } from '../../config/site'
import { pageHref, useI18n } from '../../i18n/context'

/**
 * Pre-order catalogue. Nothing here is in stock, nothing is a checkout, and
 * the drawings are labelled illustrations. The only action is a WhatsApp
 * message that names the device.
 */

/** Business WhatsApp. A configured number wins; otherwise the published line. */
const PREORDER_WHATSAPP = site.whatsappLink ?? 'https://wa.me/6580676515'

function formatPrice(template: string, amount: number) {
  return template.replaceAll('{amount}', `S$${amount}`)
}

function whatsappHref(message: string) {
  return `${PREORDER_WHATSAPP}?text=${encodeURIComponent(message)}`
}

function StatusPill({ children }: { children: string }) {
  return (
    <span className="inline-flex max-w-full rounded-full border border-ink-300 bg-white px-2 py-1 text-left text-[0.6875rem] leading-4 font-semibold text-ink-700 sm:px-2.5">
      {children}
    </span>
  )
}

function CustomTag({ children }: { children: string }) {
  return (
    <span className="inline-flex max-w-full rounded-full bg-bamboo-50 px-2 py-1 text-left text-[0.6875rem] leading-4 font-semibold text-bamboo-800 ring-1 ring-bamboo-200 sm:px-2.5">
      {children}
    </span>
  )
}

/** Homepage band: four devices, each linking to its block on the products page. */
export function ProductsStrip() {
  const { t, lang } = useI18n()
  const p = t.products

  return (
    <section id="products" className="band border-t border-ink-200/70">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow={p.eyebrow} title={p.homeTitle} lead={p.homeLead} />
          <a
            href={pageHref(lang, 'products/')}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-bamboo-700 hover:text-bamboo-600"
          >
            {p.homeCta}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
        <p className="mt-3 max-w-3xl text-sm font-semibold text-bamboo-800">{p.homeCustom}</p>

        <ul className="reveal-group mt-8 grid grid-cols-2 gap-3 lg:mt-12 lg:grid-cols-4 lg:gap-4">
          {p.items.map((item) => (
            <li key={item.id} data-reveal className="min-w-0">
              <a
                href={`${pageHref(lang, 'products/')}#${item.id}`}
                className="card group flex h-full flex-col overflow-hidden transition-colors hover:border-bamboo-200"
              >
                <span className="relative block aspect-[4/3] bg-bamboo-50/60">
                  <span className="absolute inset-1 sm:inset-2">
                    <ProductArt id={item.id} lang={lang} />
                  </span>
                  <PhotoTag>{p.illustration}</PhotoTag>
                </span>
                <span className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
                  <span className="flex flex-wrap gap-1.5">
                    <StatusPill>{p.status}</StatusPill>
                    <CustomTag>{p.custom.tag}</CustomTag>
                  </span>
                  <span className="mt-2 text-[0.9375rem] leading-snug font-semibold text-ink-950 group-hover:text-bamboo-800">
                    {item.title}
                  </span>
                  <span className="mt-auto pt-3 text-sm font-semibold text-bamboo-700">
                    {formatPrice(p.priceFrom, item.priceSgd)}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function ProductsPage() {
  const { t, lang } = useI18n()
  const p = t.products

  return (
    <>
      <section className="border-b border-ink-200/70">
        <div className="shell pt-10 pb-10 lg:pt-14 lg:pb-14">
          <p className="eyebrow">
            <span aria-hidden="true" className="h-px w-6 bg-bamboo-500/50" />
            {p.eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] text-ink-950 sm:text-5xl">
            {p.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">{p.lead}</p>

          <div className="mt-5">
            <StatusPill>{p.status}</StatusPill>
          </div>

          <aside id="customize" className="mt-8 scroll-mt-28 rounded-panel border border-bamboo-200 bg-bamboo-50 px-5 py-6 sm:px-7 sm:py-7">
            <p className="eyebrow">{p.custom.eyebrow}</p>
            <h2 className="mt-3 max-w-3xl text-[1.45rem] leading-snug font-semibold tracking-[-0.02em] text-ink-950 sm:text-[1.75rem]">
              {p.custom.title}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-700">{p.custom.body}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.custom.examples.map((example) => (
                <li
                  key={example}
                  className="rounded-full bg-white px-3 py-1.5 text-[0.8125rem] font-medium text-ink-800 ring-1 ring-bamboo-200"
                >
                  {example}
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Button
                as="a"
                href={whatsappHref(p.custom.message)}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="w-full sm:w-auto"
              >
                <MessageCircle size={18} aria-hidden="true" />
                {p.custom.cta}
              </Button>
            </div>
          </aside>

          <div className="mt-6">
            <Button
              as="a"
              href={whatsappHref(p.enquireAll)}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="w-full sm:w-auto"
            >
              <MessageCircle size={18} aria-hidden="true" />
              {p.enquire}
            </Button>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2">
            {p.items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-ink-200 bg-white px-3.5 text-sm font-medium text-ink-800 transition-colors hover:border-bamboo-300 hover:text-bamboo-800"
                >
                  {item.short}
                  <span className="ml-2 text-bamboo-700">{formatPrice(p.priceFrom, item.priceSgd)}</span>
                </a>
              </li>
            ))}
          </ul>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.points.map((point) => (
              <li key={point.title} className="card p-4">
                <p className="text-[0.9375rem] font-semibold text-ink-950">{point.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{point.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band" aria-label={p.eyebrow}>
        <div className="shell">
          <ul className="grid gap-6">
            {p.items.map((item) => {
              const price = formatPrice(p.priceFrom, item.priceSgd)
              const message = p.enquireTemplate.replaceAll('{product}', item.title).replaceAll('{price}', price)
              const customMessage = p.custom.cardTemplate.replaceAll('{product}', item.title)
              return (
                <li key={item.id}>
                  <article id={item.id} className="card scroll-mt-28 overflow-hidden">
                    <div className="grid lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
                      <figure className="relative bg-bamboo-50/60">
                        <div className="relative aspect-[4/3] w-full">
                          <div className="absolute inset-0 p-3 sm:p-6">
                            <ProductArt id={item.id} lang={lang} />
                          </div>
                        </div>
                        <PhotoTag>{p.illustration}</PhotoTag>
                      </figure>
                      <div className="p-5 sm:p-7 lg:p-8">
                        <div className="flex flex-wrap gap-2">
                          <StatusPill>{p.status}</StatusPill>
                          <CustomTag>{p.custom.tag}</CustomTag>
                        </div>
                        <h2 className="mt-3 text-[1.35rem] leading-snug font-semibold tracking-[-0.02em] text-ink-950 sm:text-[1.6rem]">
                          {item.title}
                        </h2>
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-800">{item.summary}</p>
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{item.body}</p>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {item.specs.map((spec) => (
                            <li
                              key={spec}
                              className="rounded-full bg-ink-50 px-3 py-1.5 text-[0.8125rem] font-medium text-ink-700 ring-1 ring-ink-200"
                            >
                              {spec}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-4 text-sm leading-relaxed text-ink-600">
                          <span className="font-semibold text-ink-800">{p.noteLabel} </span>
                          {item.note}
                        </p>
                        <div className="mt-6 flex flex-col gap-4 border-t border-ink-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                          <p>
                            <span className="block text-xs font-semibold tracking-wide text-ink-500 uppercase">
                              {p.priceLabel}
                            </span>
                            <span className="mt-1 block text-2xl font-semibold tracking-tight text-ink-950">
                              {price}
                            </span>
                          </p>
                          <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-stretch">
                            <Button
                              as="a"
                              href={whatsappHref(message)}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="lg"
                              className="w-full sm:w-auto"
                              aria-label={`${p.enquire}: ${item.title}`}
                            >
                              <MessageCircle size={18} aria-hidden="true" />
                              {p.enquire}
                            </Button>
                            <Button
                              as="a"
                              href={whatsappHref(customMessage)}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="secondary"
                              size="lg"
                              className="w-full sm:w-auto"
                              aria-label={`${p.custom.cta}: ${item.title}`}
                            >
                              {p.custom.cta}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="border-t border-ink-200/70">
        <div className="shell py-8 lg:py-10">
          <ul className="max-w-3xl space-y-2 text-sm leading-relaxed text-ink-600">
            {p.finePrint.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-600">
            {p.preparing}{' '}
            <a
              href={pageHref(lang, 'solutions/upcoming-products/')}
              className="font-semibold text-bamboo-700 hover:text-bamboo-600"
            >
              {p.preparingLink}
            </a>
          </p>
        </div>
      </section>

      <section className="band border-t border-ink-200/70">
        <div className="shell grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
          <h2 className="text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.025em] text-ink-950 sm:text-4xl">
            {p.faqTitle}
          </h2>
          <div className="divide-y divide-ink-200 border-y border-ink-200">
            {p.faq.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-start justify-between gap-6 py-4 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[1.0625rem] leading-snug font-medium text-ink-900 transition-colors group-hover:text-bamboo-700">
                    {item.q}
                  </h3>
                  <ChevronDown
                    size={19}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-ink-400 transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <p className="pr-10 pb-5 text-[0.9375rem] leading-relaxed text-ink-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
