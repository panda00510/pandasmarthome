import { ArrowRight } from 'lucide-react'
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

/** Stills from our own 3D showroom; the other three services get a drawing (CardArt). */
const RENDERS: Record<string, ReturnType<typeof responsive>> = {
  lighting: responsive('showroom-living'),
  shades: responsive('showroom-movie'),
  security: responsive('showroom-door'),
}

/**
 * Bento grid on lg: lighting is the large card (two columns, two rows), aircon
 * and curtains stack beside it, security, controls and energy share the last
 * row. On a phone, two columns with lighting and energy across both.
 */
const LAYOUT: Record<string, string> = {
  lighting: 'col-span-2 lg:row-span-2 min-h-[18rem] sm:min-h-[22rem] lg:min-h-0',
  // Five cards after lighting: on two columns the last one takes the full row.
  energy: 'col-span-2 lg:col-span-1 min-h-[13rem] sm:min-h-[15.5rem]',
}

/** The six services as large picture cards. */
export function Solutions() {
  const { t, lang } = useI18n()

  return (
    <section id="solutions" className="band">
      <div className="shell">
        <SectionHeading
          eyebrow={t.solutions.eyebrow}
          title={t.solutions.title}
          lead={t.solutions.lead}
          shortOnPhone split
        />

        <ul className="reveal-group mt-8 grid grid-cols-2 gap-3 lg:mt-12 lg:grid-cols-3 lg:grid-rows-[repeat(3,minmax(15.5rem,auto))] lg:gap-4">
          {t.solutions.items.map((item) => {
            const render = RENDERS[item.id]
            return (
              <li key={item.id} data-reveal className={`flex ${LAYOUT[item.id] ?? 'min-h-[13rem] sm:min-h-[15.5rem]'}`}>
                <a
                  href={pageHref(lang, PAGES[item.id] ?? 'solutions/')}
                  className={`media-card group w-full p-4 sm:p-5 lg:p-6 ${render ? '' : 'art-card justify-between'}`}
                >
                  {render ? (
                    <>
                      <img
                        src={render.src}
                        srcSet={render.srcSet}
                        sizes={item.id === 'lighting' ? '(min-width: 1200px) 760px, (min-width: 1024px) 62vw, 100vw' : '(min-width: 1200px) 370px, (min-width: 1024px) 31vw, 50vw'}
                        alt=""
                        width={1600}
                        height={1000}
                        loading="lazy"
                        decoding="async"
                        className={`media-img ${item.id === 'lighting' ? 'object-[22%_50%]' : ''}`}
                      />
                      <PhotoTag className="top-3! bottom-auto! left-3!">{t.footer.renderTag}</PhotoTag>
                    </>
                  ) : (
                    <CardArt id={item.id} />
                  )}
                  <span className="mt-auto block pt-6">
                    <span className={`block font-semibold tracking-[-0.01em] text-paper ${item.id === 'lighting' ? 'text-xl sm:text-2xl lg:text-[1.75rem]' : 'text-[1.0625rem] sm:text-lg'}`}>
                      {item.title}
                    </span>
                    <span className={`mt-1.5 hidden max-w-md text-[0.9375rem] leading-relaxed text-ink-200 sm:block ${item.id === 'lighting' ? 'lg:text-base' : ''}`}>
                      {item.body}
                    </span>
                    <span className="link-more min-h-0 pt-3 text-[0.8125rem] sm:text-sm">
                      {t.guides.learnMore}
                      <ArrowRight size={15} aria-hidden="true" />
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        <a href={pageHref(lang, 'solutions/')} className="link-more hover:text-bamboo-600 mt-6">
          {t.hubs.solutions.all}
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
