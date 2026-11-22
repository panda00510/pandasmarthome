import { ArrowRight, ChevronDown, MessageCircle, SlidersHorizontal } from 'lucide-react'
import { CardArt } from '../graphics/CardArt'
import { ProductArt } from '../graphics/ProductFigures'
import { responsive } from '../../content/photos'
import { Button, PhotoTag } from '../ui'
import { enquiryHref } from '../../lib/whatsapp'
import { pageHref, useI18n } from '../../i18n/context'

/**
 * Pre-order catalogue. Nothing here is in stock, nothing is a checkout, and
 * the drawings are labelled illustrations. The only action is a WhatsApp
 * message that names the device.
 */

/** Showroom stills for the installed-device groups; the hubs card gets a drawing instead. */
const INSTALL_RENDERS: Record<string, ReturnType<typeof responsive>> = {
  'switches-lighting': responsive('showroom-living'),
  sensors: responsive('showroom-away'),
  'curtains-locks-security': responsive('showroom-door'),
}

function formatPrice(template: string, amount: number) {
  return template.replaceAll('{amount}', `S$${amount}`)
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

export function ProductsPage() {
  const { t, lang } = useI18n()
  const p = t.products

  return (
    <>
      {/* Hero on ink, like the homepage: the four devices as picture cards that jump to their details. */}
      <section className="relative isolate overflow-hidden bg-ink-950 text-paper">
        <div aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0 -z-10" />
        <div aria-hidden="true" className="stage-glow pointer-events-none absolute -inset-[10%] -z-10" />
        <div className="shell page-head pb-14 lg:pb-20">
          <p className="eyebrow text-bamboo-300!">{p.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl title-display">{p.title}</h1>
          <p className="mt-4 max-w-2xl text-lead text-ink-300">{p.lead}</p>
          <p className="mt-5">
            <span className="inline-flex rounded-full border border-white/20 px-2.5 py-1 text-[0.6875rem] leading-4 font-semibold text-ink-100">
              {p.status}
            </span>
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              as="a"
              href={enquiryHref(p.enquireAll)}
              target="_blank"
              rel="noopener noreferrer"
              variant="glow"
              size="lg"
              className="w-full sm:w-auto"
            >
              <MessageCircle size={18} aria-hidden="true" />
              {p.enquire}
            </Button>
            <Button as="a" href="#customize" variant="outlineDark" size="lg" className="w-full sm:w-auto">
              <SlidersHorizontal size={17} aria-hidden="true" />
              {p.custom.cta}
            </Button>
          </div>

          <ul className="reveal-group mt-10 grid grid-cols-2 gap-3 lg:mt-14 lg:grid-cols-4 lg:gap-4">
            {p.items.map((item) => (
              <li key={item.id} data-reveal className="flex">
                <a href={`#${item.id}`} className="media-card art-card group w-full p-4 sm:p-5">
                  <PhotoTag className="top-2.5! bottom-auto! left-2.5!">{p.illustration}</PhotoTag>
                  <span aria-hidden="true" className="block aspect-[4/3] w-full pt-6 pb-2">
                    <ProductArt id={item.id} lang={lang} />
                  </span>
                  <span className="block text-base font-semibold text-paper sm:text-lg">{item.short}</span>
                  <span className="mt-0.5 block text-sm text-bamboo-300">{formatPrice(p.priceFrom, item.priceSgd)}</span>
                </a>
              </li>
            ))}
          </ul>
          <a href="#smart-home-devices" className="link-more mt-6 text-bamboo-300! hover:text-bamboo-200!">
            {p.install.title}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="band pb-0!">
        <div className="shell">
          <aside id="customize" className="scroll-mt-28 rounded-panel border border-bamboo-200 bg-bamboo-50 px-5 py-6 sm:px-7 sm:py-7">
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
                href={enquiryHref(p.custom.message)}
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
                      <figure className="art-stage relative">
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
                              href={enquiryHref(message)}
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
                              href={enquiryHref(customMessage)}
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

      <section id="smart-home-devices" className="band scroll-mt-24 border-t border-ink-200/70 bg-paper-alt">
        <div className="shell">
          <p className="eyebrow">{p.install.eyebrow}</p>
          <h2 className="mt-4 max-w-3xl title-section text-ink-950">
            {p.install.title}
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-600">{p.install.lead}</p>
          <ul className="reveal-group mt-10 grid gap-4 sm:grid-cols-2">
            {p.install.groups.map((group) => {
              const render = INSTALL_RENDERS[group.id]
              return (
                <li key={group.id} data-reveal className="flex">
                  <article id={group.id} className="card flex w-full scroll-mt-28 flex-col overflow-hidden">
                    <div className={`media-card art-card aspect-[16/9] rounded-none! shadow-none! ${render ? 'after:hidden' : ''}`}>
                      {render ? (
                        <>
                          <img
                            src={render.src}
                            srcSet={render.srcSet}
                            sizes="(min-width: 1200px) 580px, (min-width: 640px) 50vw, 100vw"
                            alt=""
                            width={1600}
                            height={1000}
                            loading="lazy"
                            decoding="async"
                            className={`media-img ${group.id === 'switches-lighting' ? 'object-[22%_50%]' : ''}`}
                          />
                          <PhotoTag className="top-3! bottom-auto! left-3!">{t.footer.renderTag}</PhotoTag>
                        </>
                      ) : (
                        <span className="grid h-full place-items-center pb-4">
                          <CardArt id="control" />
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="text-[1.2rem] leading-snug font-semibold tracking-[-0.02em] text-ink-950">
                        {group.title}
                      </h3>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{group.body}</p>
                      <ul className="mt-4 space-y-1.5 text-[0.9375rem] leading-relaxed text-ink-800">
                        {group.items.map((item) => (
                          <li key={item} className="flex gap-2.5">
                            <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-bamboo-600" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <a href={pageHref(lang, group.path)} className="link-more mt-auto pt-4 hover:text-bamboo-600">
                        {p.install.learn}
                        <ArrowRight size={15} aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-600">{p.install.note}</p>
          <Button
            as="a"
            href={enquiryHref(p.install.message)}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="mt-6 w-full sm:w-auto"
          >
            <MessageCircle size={18} aria-hidden="true" />
            {p.install.cta}
          </Button>
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
              className="inline-block py-1 font-semibold text-bamboo-700 hover:text-bamboo-600"
            >
              {p.preparingLink}
            </a>
          </p>
          <p className="mt-2 text-sm">
            <a href={pageHref(lang, 'compare/')} className="inline-block py-1 font-semibold text-bamboo-700 hover:text-bamboo-600">
              {t.compare.fromProducts}
            </a>
          </p>
        </div>
      </section>

      <section className="band border-t border-ink-200/70">
        <div className="shell grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
          <h2 className="title-section text-ink-950">
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
