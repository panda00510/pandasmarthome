import { ArrowRight, ChevronDown, Info, MapPin } from 'lucide-react'
import { responsive } from '../../content/photos'
import { SectionHeading } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'

const PHOTOS: Record<string, ReturnType<typeof responsive>> = {
  bto: responsive('home-bto'),
  hdb: responsive('home-hdb'),
  condo: responsive('home-condo'),
  landed: responsive('home-landed'),
}

/** Topic pages behind each card. */
const PAGES: Record<string, string> = {
  bto: 'homes/bto-smart-home/',
  hdb: 'homes/hdb-resale-smart-home/',
  condo: 'homes/condo-smart-home/',
  landed: 'homes/landed-smart-home/',
}

/** Four home types as photo cards (two across on a phone), then the service area. */
export function Homes() {
  const { t, lang } = useI18n()

  return (
    <section id="homes" className="band border-t border-ink-200/70 bg-paper-alt">
      <div className="shell">
        <SectionHeading eyebrow={t.homes.eyebrow} title={t.homes.title} lead={t.homes.lead} shortOnPhone />

        <ul className="reveal-group mt-8 grid grid-cols-2 gap-3 lg:mt-12 lg:grid-cols-4 lg:gap-4">
          {t.homes.items.map((item) => {
            const photo = PHOTOS[item.id]
            return (
              <li key={item.id} data-reveal>
                <a
                  href={pageHref(lang, PAGES[item.id] ?? 'homes/')}
                  className="card group flex h-full flex-col overflow-hidden transition-colors hover:border-bamboo-200"
                >
                  <img
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes="(min-width: 1200px) 280px, (min-width: 1024px) 22vw, 50vw"
                    alt={item.imageAlt}
                    width={1200}
                    height={675}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <span className="flex flex-1 flex-col p-4 lg:p-5">
                    <span className="eyebrow">{item.subtitle}</span>
                    <span className="mt-1.5 block text-[1rem] leading-snug font-semibold text-ink-950 lg:text-[1.0625rem]">
                      {item.title}
                    </span>
                    <span className="mt-2 hidden text-[0.9375rem] leading-relaxed text-ink-600 sm:block lg:text-sm">
                      {item.body}
                    </span>
                    <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-2 text-sm font-semibold text-bamboo-700">
                      {t.guides.learnMore}
                      <ArrowRight size={15} aria-hidden="true" />
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={pageHref(lang, 'homes/')}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-bamboo-700 hover:text-bamboo-600"
          >
            {t.hubs.homes.all}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
          <p className="text-xs text-ink-500">{t.footer.imageNote}</p>
        </div>

        <details className="card group mt-6">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-3 text-[1rem] font-semibold text-ink-950">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-bamboo-50 text-bamboo-700 ring-1 ring-bamboo-100">
                <MapPin size={17} aria-hidden="true" />
              </span>
              {t.homes.areas.title}
            </span>
            <ChevronDown
              size={18}
              aria-hidden="true"
              className="shrink-0 text-ink-400 transition-transform duration-300 group-open:rotate-180"
            />
          </summary>
          <div className="px-5 pb-5">
            <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">
              {t.homes.areas.lead}
            </p>
            <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
              {t.homes.areas.regions.map((region) => (
                <div key={region.name} className="border-t border-ink-200 pt-3">
                  <dt className="text-sm font-semibold text-bamboo-700">{region.name}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-600">{region.towns}</dd>
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
