import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { CardArt } from '../graphics/CardArt'
import { responsive } from '../../content/photos'
import { PhotoTag, SectionHeading } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'

/** Topic pages behind each card. */
const PAGES: Record<string, string> = {
  lighting: 'solutions/smart-lighting/',
  control: 'solutions/home-control/',
  energy: 'solutions/energy-monitoring/',
  climate: 'solutions/smart-aircon-control/',
  shades: 'solutions/motorised-curtains/',
  security: 'solutions/smart-door-locks/',
}

/** Stills from our own 3D showroom; the other three services get an architectural drawing (CardArt). */
const RENDERS: Record<string, ReturnType<typeof responsive>> = {
  lighting: responsive('showroom-living'),
  shades: responsive('showroom-movie'),
  security: responsive('showroom-door'),
}

/**
 * Six residential disciplines laid out as a daylight architectural index:
 * 01 Lighting opens as a full-width two-column monograph spread; 02–06 follow
 * as clean gallery plates (unobstructed renders and drafting-paper diagrams).
 */
export function Solutions() {
  const { t, lang } = useI18n()
  const [leadItem, ...restItems] = t.solutions.items

  return (
    <section id="solutions" className="band border-t border-ink-950/12 bg-surface">
      <div className="shell">
        <SectionHeading
          eyebrow={t.solutions.eyebrow}
          title={t.solutions.title}
          lead={t.solutions.lead}
          shortOnPhone
          split
        />

        {/* 01 — Featured monograph spread */}
        {leadItem ? (
          <div data-reveal className="mt-10 lg:mt-14">
            <a
              href={pageHref(lang, PAGES[leadItem.id] ?? 'solutions/')}
              className="group grid overflow-hidden rounded-card border border-ink-950/15 bg-paper transition-[border-color,box-shadow] duration-300 hover:border-brand/55 hover:shadow-lift lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.85fr)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-ink-950 lg:aspect-auto lg:min-h-[24rem]">
                <img
                  src={RENDERS[leadItem.id].src}
                  srcSet={RENDERS[leadItem.id].srcSet}
                  sizes="(min-width: 1200px) 720px, (min-width: 1024px) 58vw, 100vw"
                  alt=""
                  width={1600}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="block size-full object-cover object-[22%_50%] transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                <PhotoTag className="top-3! bottom-auto! left-3!">{t.footer.renderTag}</PhotoTag>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div>
                  <div className="flex items-center justify-between gap-4 border-b border-ink-950/12 pb-4">
                    <span className="numeral text-xs font-semibold text-ember-500">01</span>
                    <span
                      aria-hidden="true"
                      className="grid size-8 place-items-center rounded-[2px] border border-ink-950/15 bg-surface text-ink-700 transition-colors group-hover:border-ink-950 group-hover:bg-ink-950 group-hover:text-paper"
                    >
                      <ArrowUpRight size={15} />
                    </span>
                  </div>

                  <h3 className="title-section mt-5 text-ink-950">{leadItem.title}</h3>
                  <p className="mt-3 text-[0.96rem] leading-relaxed text-ink-700">{leadItem.body}</p>

                  {leadItem.bullets.length ? (
                    <ul className="mt-6 space-y-2.5 border-t border-ink-950/10 pt-5">
                      {leadItem.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5 text-sm leading-snug text-ink-800">
                          <Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <span className="link-more mt-6 min-h-0 pt-2">
                  {t.guides.learnMore}
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </div>
            </a>
          </div>
        ) : null}

        {/* 02–06 — Architectural folio grid */}
        <ul className="reveal-group mt-4 grid gap-4 sm:grid-cols-2 lg:mt-5 lg:grid-cols-3">
          {restItems.map((item, i) => {
            const render = RENDERS[item.id]
            const idx = String(i + 2).padStart(2, '0')
            return (
              <li key={item.id} data-reveal className="flex">
                <a
                  href={pageHref(lang, PAGES[item.id] ?? 'solutions/')}
                  className="card group flex w-full flex-col overflow-hidden bg-paper!"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-ink-950/10">
                    {render ? (
                      <>
                        <img
                          src={render.src}
                          srcSet={render.srcSet}
                          sizes="(min-width: 1200px) 390px, (min-width: 640px) 50vw, 100vw"
                          alt=""
                          width={1600}
                          height={1000}
                          loading="lazy"
                          decoding="async"
                          className="block size-full object-cover transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.04] motion-reduce:transition-none"
                        />
                        <PhotoTag className="top-2.5! bottom-auto! left-2.5!">{t.footer.renderTag}</PhotoTag>
                      </>
                    ) : (
                      <div className="art-stage grid size-full place-items-center p-5">
                        <CardArt id={item.id} tone="light" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <span className="numeral text-xs font-semibold text-ember-500">{idx}</span>
                      <ArrowUpRight
                        size={15}
                        aria-hidden="true"
                        className="text-ink-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink-950"
                      />
                    </div>
                    <h3 className="title-card mt-3 text-ink-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.body}</p>
                    <span className="link-more mt-auto min-h-0 pt-5 text-sm">
                      {t.guides.learnMore}
                      <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>

        <div className="mt-8 flex items-center justify-between border-t border-ink-950/12 pt-4">
          <a href={pageHref(lang, 'solutions/')} className="link-more hover:text-ink-950">
            {t.hubs.solutions.all}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
