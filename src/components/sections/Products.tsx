import { ArrowRight, ArrowUpRight, ChevronDown, MessageCircle, SlidersHorizontal } from 'lucide-react'
import { CardArt } from '../graphics/CardArt'
import { ProductArt } from '../graphics/ProductFigures'
import { responsive } from '../../content/photos'
import { Button, PhotoTag } from '../ui'
import { enquiryHref } from '../../lib/whatsapp'
import { pageHref, useI18n } from '../../i18n/context'

/**
 * Products Page — "Tropical Monograph" Industrial-Design Catalogue.
 * Sunlit travertine hero + 4-column specimen index, customisation dossier,
 * detailed full-width hardware specification plates, installed smart-home
 * device families, fine print, and matching FAQ accordion.
 *
 * Pre-order catalogue: nothing is in stock, nothing is a checkout, and all
 * device drawings are labelled as illustrations.
 */

const INSTALL_RENDERS: Record<string, ReturnType<typeof responsive>> = {
  'switches-lighting': responsive('showroom-living'),
  sensors: responsive('showroom-away'),
  'curtains-locks-security': responsive('showroom-door'),
}

function formatPrice(template: string, amount: number) {
  return template.replaceAll('{amount}', `S$${amount}`)
}

function StatusTag({ children }: { children: string }) {
  return (
    <span className="inline-flex max-w-full rounded-[2px] border border-ink-950/22 bg-paper px-2.5 py-1 text-left font-mono text-[0.65rem] leading-4 font-semibold tracking-[0.08em] text-ink-800 uppercase">
      {children}
    </span>
  )
}

function CustomTag({ children }: { children: string }) {
  return (
    <span className="inline-flex max-w-full rounded-[2px] border border-brand/30 bg-bamboo-50 px-2.5 py-1 text-left font-mono text-[0.65rem] leading-4 font-semibold tracking-[0.08em] text-brand uppercase">
      {children}
    </span>
  )
}

export function ProductsPage() {
  const { t, lang } = useI18n()
  const p = t.products

  return (
    <>
      {/* Daylight Architectural Monograph Hero — sunlit travertine, zero dark stage */}
      <section className="relative bg-paper text-ink-950">
        <div className="border-b border-ink-950/12">
          <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
            <p className="eyebrow">{p.eyebrow}</p>
            <StatusTag>{p.status}</StatusTag>
          </div>
        </div>

        <div className="shell pt-9 pb-14 sm:pt-12 lg:pt-14 lg:pb-18">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-14">
            <h1 className="title-display text-ink-950">{p.title}</h1>
            <div className="lg:border-l lg:border-ink-950/14 lg:pl-8">
              <p className="text-lead text-ink-700">{p.lead}</p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Button
                  as="a"
                  href={enquiryHref(p.enquireAll)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  {p.enquire}
                </Button>
                <Button as="a" href="#customize" variant="secondary" size="lg" className="w-full sm:w-auto">
                  <SlidersHorizontal size={16} aria-hidden="true" className="text-ember-500" />
                  {p.custom.cta}
                </Button>
              </div>
            </div>
          </div>

          {/* 4-column Hardware Specimen Index */}
          <ul className="reveal-group mt-10 grid grid-cols-2 gap-3.5 sm:gap-5 lg:mt-14 lg:grid-cols-4">
            {p.items.map((item, i) => (
              <li key={item.id} data-reveal className="flex">
                <a
                  href={`#${item.id}`}
                  className="card group flex w-full flex-col overflow-hidden"
                >
                  <span className="art-stage relative block aspect-[4/3] w-full overflow-hidden border-b border-ink-950/12">
                    <span className="absolute inset-0 p-3 sm:p-4">
                      <ProductArt id={item.id} lang={lang} />
                    </span>
                    <PhotoTag>{p.illustration}</PhotoTag>
                  </span>

                  <span className="flex flex-1 flex-col p-4 sm:p-5">
                    <span className="flex items-center justify-between">
                      <span className="numeral text-[0.6875rem] font-semibold text-ember-500">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <ArrowUpRight
                        size={14}
                        aria-hidden="true"
                        className="text-ink-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink-950"
                      />
                    </span>
                    <span className="title-card mt-2 block text-ink-950">{item.short}</span>
                    <span className="mt-2 block font-mono text-sm font-semibold text-brand tabular-nums">
                      {formatPrice(p.priceFrom, item.priceSgd)}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-7 border-t border-ink-950/12 pt-3">
            <a href="#smart-home-devices" className="link-more hover:text-ink-950">
              {p.install.title}
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Customisation dossier + 3-column key points ledger */}
      <section className="band border-t border-ink-950/12 bg-paper-alt pb-0!">
        <div className="shell">
          <aside
            id="customize"
            className="relative scroll-mt-28 overflow-hidden rounded-panel border border-ink-950/16 bg-surface p-6 shadow-soft sm:p-8 lg:p-10"
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-brand" />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end lg:gap-12">
              <div>
                <p className="eyebrow">{p.custom.eyebrow}</p>
                <h2 className="title-section mt-3 text-ink-950">
                  {p.custom.title}
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-700">{p.custom.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.custom.examples.map((example) => (
                    <li
                      key={example}
                      className="rounded-[2px] border border-ink-950/14 bg-paper px-3 py-1.5 text-[0.8125rem] font-medium text-ink-800"
                    >
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:flex lg:justify-end">
                <Button
                  as="a"
                  href={enquiryHref(p.custom.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  {p.custom.cta}
                </Button>
              </div>
            </div>
          </aside>

          <ul className="mt-6 grid overflow-hidden rounded-card border border-ink-950/14 bg-surface divide-y divide-ink-950/12 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3 lg:divide-x">
            {p.points.map((point, i) => (
              <li key={point.title} className="p-5 sm:p-6">
                <span className="numeral text-xs font-semibold text-ember-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 font-display text-[1.0625rem] font-medium text-ink-950">{point.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{point.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Detailed Hardware Specification Sheets */}
      <section className="band bg-paper-alt" aria-label={p.eyebrow}>
        <div className="shell">
          <ul className="grid gap-6 lg:gap-8">
            {p.items.map((item, i) => {
              const price = formatPrice(p.priceFrom, item.priceSgd)
              const message = p.enquireTemplate.replaceAll('{product}', item.title).replaceAll('{price}', price)
              const customMessage = p.custom.cardTemplate.replaceAll('{product}', item.title)
              return (
                <li key={item.id}>
                  <article id={item.id} className="card scroll-mt-28 overflow-hidden">
                    <div className="grid lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
                      <figure className="art-stage relative flex flex-col justify-center border-b border-ink-950/12 lg:border-r lg:border-b-0">
                        <span
                          aria-hidden="true"
                          className="numeral absolute top-3.5 left-4 z-10 text-[0.6875rem] font-semibold text-ink-500"
                        >
                          SPEC {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="relative aspect-[4/3] w-full">
                          <div className="absolute inset-0 p-4 sm:p-7">
                            <ProductArt id={item.id} lang={lang} />
                          </div>
                        </div>
                        <PhotoTag>{p.illustration}</PhotoTag>
                      </figure>

                      <div className="flex flex-col p-5 sm:p-7 lg:p-9">
                        <div className="flex flex-wrap gap-2">
                          <StatusTag>{p.status}</StatusTag>
                          <CustomTag>{p.custom.tag}</CustomTag>
                        </div>

                        <h2 className="title-section mt-4 text-ink-950">
                          {item.title}
                        </h2>
                        <p className="mt-3 text-[0.96rem] leading-relaxed font-medium text-ink-900">{item.summary}</p>
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{item.body}</p>

                        <ul className="mt-5 flex flex-wrap gap-2">
                          {item.specs.map((spec) => (
                            <li
                              key={spec}
                              className="rounded-[2px] border border-ink-950/14 bg-paper px-3 py-1.5 text-[0.8125rem] font-medium text-ink-800"
                            >
                              {spec}
                            </li>
                          ))}
                        </ul>

                        <p className="mt-5 border-l-2 border-ember-400/70 pl-3.5 text-sm leading-relaxed text-ink-600">
                          <span className="font-semibold text-ink-900">{p.noteLabel} </span>
                          {item.note}
                        </p>

                        <div className="mt-auto pt-6">
                          <div className="flex flex-col gap-4 border-t border-ink-950/12 pt-5 sm:flex-row sm:items-end sm:justify-between">
                            <p>
                              <span className="block font-mono text-[0.6875rem] font-semibold tracking-[0.14em] text-ink-500 uppercase">
                                {p.priceLabel}
                              </span>
                              <span className="mt-1 block font-display text-3xl leading-none font-normal text-ink-950 tabular-nums">
                                {price}
                              </span>
                            </p>
                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                              <Button
                                as="a"
                                href={enquiryHref(message)}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="lg"
                                className="w-full sm:w-auto"
                                aria-label={`${p.enquire}: ${item.title}`}
                              >
                                <MessageCircle size={17} aria-hidden="true" />
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
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Installed Smart Home Devices — daylight architectural folio grid */}
      <section id="smart-home-devices" className="band scroll-mt-24 border-t border-ink-950/12 bg-surface">
        <div className="shell">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
            <div>
              <p className="eyebrow">{p.install.eyebrow}</p>
              <h2 className="title-display mt-4 text-ink-950">
                {p.install.title}
              </h2>
            </div>
            <p className="text-lead text-ink-600 lg:border-l lg:border-ink-950/12 lg:pl-6">{p.install.lead}</p>
          </div>

          <ul className="reveal-group mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14">
            {p.install.groups.map((group, i) => {
              const render = INSTALL_RENDERS[group.id]
              return (
                <li key={group.id} data-reveal className="flex">
                  <article id={group.id} className="card flex w-full scroll-mt-28 flex-col overflow-hidden bg-paper!">
                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-ink-950/12 bg-ink-950">
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
                            className={`block size-full object-cover ${group.id === 'switches-lighting' ? 'object-[22%_50%]' : ''}`}
                          />
                          <PhotoTag className="top-3! bottom-auto! left-3!">{t.footer.renderTag}</PhotoTag>
                        </>
                      ) : (
                        <div className="art-stage grid size-full place-items-center p-6">
                          <CardArt id="control" tone="light" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-7">
                      <span className="numeral text-xs font-semibold text-ember-500">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="title-group mt-2 text-ink-950">
                        {group.title}
                      </h3>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{group.body}</p>
                      <ul className="mt-4 space-y-2 border-t border-ink-950/10 pt-4 text-[0.9375rem] leading-relaxed text-ink-800">
                        {group.items.map((item) => (
                          <li key={item} className="flex gap-2.5">
                            <span className="mt-[0.65em] h-1 w-2 shrink-0 bg-brand" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <a href={pageHref(lang, group.path)} className="link-more mt-auto pt-5 hover:text-ink-950">
                        {p.install.learn}
                        <ArrowRight size={15} aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-4 border-t border-ink-950/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-relaxed text-ink-600">{p.install.note}</p>
            <Button
              as="a"
              href={enquiryHref(p.install.message)}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="w-full shrink-0 sm:w-auto"
            >
              <MessageCircle size={17} aria-hidden="true" />
              {p.install.cta}
            </Button>
          </div>
        </div>
      </section>

      {/* Fine print & comparison link */}
      <section className="border-t border-ink-950/12 bg-paper">
        <div className="shell py-8 lg:py-10">
          <ul className="max-w-3xl space-y-2 text-sm leading-relaxed text-ink-600">
            {p.finePrint.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-700">
            {p.preparing}{' '}
            <a
              href={pageHref(lang, 'solutions/upcoming-products/')}
              className="inline-block py-1 font-semibold text-brand underline decoration-brand/40 underline-offset-3 hover:text-ink-950"
            >
              {p.preparingLink}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a
              href={pageHref(lang, 'compare/')}
              className="inline-block py-1 font-semibold text-brand underline decoration-brand/40 underline-offset-3 hover:text-ink-950"
            >
              {t.compare.fromProducts}
            </a>
          </p>
        </div>
      </section>

      {/* Products FAQ — matches homepage accordion */}
      <section className="band border-t border-ink-950/12 bg-paper-alt">
        <div className="shell grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
          <h2 className="title-section text-ink-950 lg:sticky lg:top-28 lg:self-start">
            {p.faqTitle}
          </h2>
          <div className="card divide-y divide-ink-950/12 overflow-hidden">
            {p.faq.map((item) => (
              <details key={item.q} className="group transition-colors open:bg-paper/65">
                <summary className="flex min-h-15 cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-[1.0625rem] leading-snug font-medium text-ink-950 transition-colors group-hover:text-brand">
                    {item.q}
                  </h3>
                  <span className="grid size-8 shrink-0 place-items-center rounded-[2px] border border-ink-950/15 bg-paper text-ink-700 transition-colors group-hover:border-ink-950/35 group-open:border-ink-950 group-open:bg-ink-950 group-open:text-paper">
                    <ChevronDown
                      size={15}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-open:rotate-180"
                    />
                  </span>
                </summary>
                <p className="px-5 pr-10 pb-5 text-[0.9375rem] leading-relaxed text-ink-600 sm:pr-14">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
