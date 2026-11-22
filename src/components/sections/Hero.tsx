import { ArrowRight, Box, Check, CodeXml, Cpu, Monitor, Network } from 'lucide-react'
import { HomePanel } from '../graphics/HomePanel'
import { responsive } from '../../content/photos'
import { Button, PhotoTag } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'
import { showroomHref } from '../../lib/showroom'

const living = responsive('showroom-living')

/**
 * First screen, on ink. Left: the headline (no entrance animation; it and the
 * render are the LCP candidates), the two main actions and one line of plain
 * facts. Right: a lit stage — a still of the living room from our own 3D
 * showroom (labelled as a render), with the live control panel overlapping
 * its corner and the protocols pinned to it. On a phone the panel sits below
 * the render, overlapping its bottom edge. The trust strip closes the section.
 */
export function Hero() {
  const { t, lang } = useI18n()

  return (
    <>
      <section id="top" className="relative isolate overflow-hidden bg-ink-950 text-paper">
        <div aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0 -z-10" />
        <div aria-hidden="true" className="stage-glow pointer-events-none absolute -inset-[10%] -z-10" />

        <div className="shell grid items-center gap-12 pt-10 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:pt-20">
          <div>
            <p className="eyebrow text-bamboo-300!">{t.hero.eyebrow}</p>

            <h1 className={`mt-5 text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.04em] sm:text-[3.75rem] lg:mt-7 lg:leading-[0.98] ${lang === 'zh' ? 'lg:text-[3.5rem] xl:text-[3.75rem]' : 'lg:text-[4rem] xl:text-[4.5rem]'}`}>
              {t.hero.titleLead}
              {/* Chinese: the accent clause on its own line, so the narrower column never breaks it mid-phrase. */}
              {lang === 'zh' ? <br /> : ' '}
              <span className="bg-linear-to-r from-bamboo-300 to-bamboo-200 bg-clip-text text-transparent">
                {t.hero.titleAccent}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg lg:mt-7 lg:text-xl lg:leading-relaxed">
              {t.hero.lead}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-10">
              <Button as="a" href="#contact" variant="glow" size="lg" className="w-full sm:w-auto">
                {t.hero.primaryCta}
                <ArrowRight size={17} aria-hidden="true" />
              </Button>
              <Button as="a" href={showroomHref(lang)} variant="outlineDark" size="lg" className="w-full sm:w-auto">
                <Box size={17} aria-hidden="true" />
                {t.hero.showroomCta}
              </Button>
            </div>
            <p className="mt-5 flex items-start gap-2 text-sm leading-snug text-ink-400">
              <Check size={16} aria-hidden="true" className="mt-px shrink-0 text-bamboo-300" />
              {t.hero.ctaNote}
            </p>
          </div>

          {/* The stage. A warm wash behind the render (it is a lighting scene), the bamboo glow above. */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(closest-side,rgb(234_178_84/0.16),transparent)] blur-2xl"
            />
            <figure className="relative overflow-hidden rounded-panel shadow-stage ring-1 ring-white/10">
              <img
                src={living.src}
                srcSet={living.srcSet}
                sizes="(min-width: 1200px) 600px, (min-width: 1024px) 50vw, 100vw"
                alt={t.hero.renderAlt}
                width={1600}
                height={1000}
                fetchPriority="high"
                decoding="async"
                className="block aspect-[16/11] w-full object-cover object-[22%_50%]"
              />
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-tr from-ink-950/55 via-transparent to-transparent" />
              <PhotoTag className="top-3! bottom-auto! left-3!">{t.footer.renderTag}</PhotoTag>
              <p className="absolute top-3 right-3 hidden items-center gap-2 rounded-full border border-white/15 bg-ink-950/70 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-ink-100 backdrop-blur-md sm:inline-flex">
                <Network size={14} aria-hidden="true" className="text-bamboo-300" />
                {t.hero.protocols}
              </p>
            </figure>
            {/* Overlaps the render: below it on a phone, over its lower-left corner from 1024px. */}
            <div className="relative z-10 -mt-16 flex justify-center sm:-mt-24 lg:absolute lg:-bottom-16 lg:-left-8 lg:mt-0 lg:block xl:-left-10">
              <HomePanel compact />
            </div>
          </div>
        </div>

        {/* Trust strip: four numbered points, read as a row of facts. */}
        <div className="shell pt-10 pb-10 sm:pt-16 sm:pb-14 lg:pt-24 lg:pb-16">
          <ul className="grid grid-cols-2 border-t border-white/10 lg:grid-cols-4">
            {t.hero.trust.map((item, i) => (
              <li
                key={item}
                className={`pt-5 pr-4 pb-2 lg:pt-7 lg:pr-8 ${i > 0 ? 'lg:border-l lg:border-white/10 lg:pl-8' : ''} ${
                  i % 2 === 1 ? 'border-l border-white/10 pl-4 lg:pl-8' : ''
                } ${i >= 2 ? 'mt-3 border-t border-white/10 lg:mt-0 lg:border-t-0' : ''}`}
              >
                <span className="numeral block text-sm font-semibold text-bamboo-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="mt-2 block text-[0.9375rem] leading-snug font-medium text-paper sm:text-base">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* The other lines of business: quiet links, so the smart home CTA stays the main action. */}
          <nav aria-label={t.hero.also.label} className="mt-6 flex flex-wrap items-center gap-2 lg:mt-8">
            <span className="mr-1 w-full pb-1 text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase sm:w-auto sm:pb-0">{t.hero.also.label}</span>
            {[
              { href: pageHref(lang, 'signage/'), label: t.hero.also.signage, Icon: Monitor },
              { href: pageHref(lang, 'custom-hardware/'), label: t.hero.also.hardware, Icon: Cpu },
              { href: pageHref(lang, 'software/'), label: t.hero.also.software, Icon: CodeXml },
            ].map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/12 px-3 text-sm font-medium text-ink-200 transition-colors hover:border-white/30 hover:bg-white/6 hover:text-paper"
              >
                <Icon size={15} aria-hidden="true" className="text-bamboo-300" />
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>
    </>
  )
}
