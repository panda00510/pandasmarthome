import { ArrowRight, ArrowUpRight, ChevronDown, Info, MapPin } from 'lucide-react'
import { responsive } from '../../content/photos'
import { PhotoTag, SectionHeading } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'

const PHOTOS: Record<string, ReturnType<typeof responsive>> = {
  bto: responsive('home-bto'),
  hdb: responsive('home-hdb'),
  condo: responsive('home-condo'),
  landed: responsive('home-landed'),
}

const PAGES: Record<string, string> = {
  bto: 'homes/bto-smart-home/',
  hdb: 'homes/hdb-resale-smart-home/',
  condo: 'homes/condo-smart-home/',
  landed: 'homes/landed-smart-home/',
}

/** Four Singapore residential typologies as clean framed editorial photo plates, then the service area directory. */
export function Homes() {
  const { t, lang } = useI18n()

  return (
    <section id="homes" className="band border-t border-ink-950/12 bg-paper-alt">
      <div className="shell">
        <SectionHeading eyebrow={t.homes.eyebrow} title={t.homes.title} lead={t.homes.lead} shortOnPhone split />

        <ul className="reveal-group mt-10 grid grid-cols-2 gap-3.5 sm:gap-5 lg:mt-14 lg:grid-cols-4">
          {t.homes.items.map((item) => {
            const photo = PHOTOS[item.id]
            return (
              <li key={item.id} data-reveal>
                <a
                  href={pageHref(lang, PAGES[item.id] ?? 'homes/')}
                  className="card group flex h-full flex-col overflow-hidden"
                >
                  <span className="relative block overflow-hidden border-b border-ink-950/12 bg-ink-900">
                    <img
                      src={photo.src}
                      srcSet={photo.srcSet}
                      sizes="(min-width: 1200px) 290px, (min-width: 1024px) 22vw, 50vw"
                      alt={item.imageAlt}
                      width={1200}
                      height={675}
                      loading="lazy"
                      decoding="async"
                      className="block aspect-[4/3] w-full object-cover transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                    <PhotoTag>{t.footer.imageTag}</PhotoTag>
                  </span>
                  <span className="flex flex-1 flex-col p-4 lg:p-5">
                    <span className="flex items-start justify-between gap-2 sm:min-h-[2.25rem]">
                      <span className="eyebrow text-[0.65rem]! leading-[1.35] tracking-[0.11em]!">{item.subtitle}</span>
                      <ArrowUpRight
                        size={14}
                        aria-hidden="true"
                        className="mt-0.5 hidden shrink-0 text-ink-400 transition-colors group-hover:text-ink-950 sm:block"
                      />
                    </span>
                    <span className="title-card mt-2 block text-ink-950 lg:min-h-[3rem]">
                      {item.title}
                    </span>
                    <span className="mt-2 hidden line-clamp-3 text-sm leading-relaxed text-ink-600 sm:block">
                      {item.body}
                    </span>
                    <span className="link-more mt-auto min-h-0 pt-4 text-sm">
                      {t.guides.learnMore}
                      <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <a href={pageHref(lang, 'homes/')} className="link-more hover:text-ink-950">
            {t.hubs.homes.all}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
          <p className="text-xs text-ink-500">{t.footer.imageNote}</p>
        </div>

        <details className="card group mt-6 overflow-hidden">
          <summary className="flex min-h-15 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-paper/70 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-3 font-display text-[1.0625rem] font-medium text-ink-950">
              <span className="icon-tile h-9! w-9!">
                <MapPin size={16} aria-hidden="true" />
              </span>
              {t.homes.areas.title}
            </span>
            <span className="grid size-8 shrink-0 place-items-center rounded-[2px] border border-ink-950/16 bg-paper text-ink-700 transition-colors group-open:border-ink-950 group-open:bg-ink-950 group-open:text-paper">
              <ChevronDown
                size={15}
                aria-hidden="true"
                className="transition-transform duration-300 group-open:rotate-180"
              />
            </span>
          </summary>
          <div className="border-t border-ink-950/12 bg-paper/65 px-5 py-5">
            <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">
              {t.homes.areas.lead}
            </p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {t.homes.areas.regions.map((region) => (
                <div key={region.name} className="rounded-[2px] border border-ink-950/12 bg-surface p-3.5">
                  <dt className="font-mono text-[0.6875rem] font-semibold tracking-[0.12em] text-ember-500 uppercase">
                    {region.name}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-ink-700">{region.towns}</dd>
                </div>
              ))}
            </dl>
          </div>
        </details>

        <p className="mt-4 flex max-w-2xl items-start gap-2.5 text-sm leading-relaxed text-ink-600">
          <Info size={16} className="mt-0.5 shrink-0 text-ink-500" aria-hidden="true" />
          {t.homes.note}
        </p>
      </div>
    </section>
  )
}
