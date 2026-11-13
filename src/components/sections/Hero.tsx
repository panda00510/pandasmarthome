import { ArrowRight } from 'lucide-react'
import { HomePanel } from '../graphics/HomePanel'
import { Button } from '../ui'
import { Showroom } from './Showroom'
import { useI18n } from '../../i18n/context'

/**
 * First screen, on ink. The headline is the LCP element (no photo above the
 * fold); the live control panel sits on a lit glass stage beside it. The
 * trust points close the section as a numbered strip, and the 3D showroom
 * band follows directly, so it is the second thing on the page.
 */
export function Hero() {
  const { t, lang } = useI18n()

  return (
    <>
      <section id="top" className="relative isolate overflow-hidden bg-ink-950 text-paper">
        <div aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0 -z-10" />
        <div aria-hidden="true" className="stage-glow pointer-events-none absolute -inset-[10%] -z-10" />

        <div className="shell grid items-center gap-12 pt-10 sm:pt-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-10 lg:pt-20">
          {/* No entrance animation on the copy: the headline is the LCP element. */}
          <div>
            <p className="eyebrow text-bamboo-300!">
              <span aria-hidden="true" className="h-px w-6 bg-bamboo-300/60" />
              {t.hero.eyebrow}
            </p>

            <h1 className="mt-5 text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.04em] sm:text-[4rem] lg:mt-7 lg:text-[4.75rem] lg:leading-[0.98] xl:text-[5.25rem]">
              {t.hero.titleLead}
              {lang === 'zh' ? null : ' '}
              <span className="bg-linear-to-r from-bamboo-300 to-bamboo-200 bg-clip-text text-transparent">
                {t.hero.titleAccent}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg lg:mt-8 lg:text-xl lg:leading-relaxed">
              {t.hero.lead}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-10">
              <Button as="a" href="#contact" variant="glow" size="lg" className="w-full sm:w-auto">
                {t.hero.primaryCta}
                <ArrowRight size={17} aria-hidden="true" />
              </Button>
              <Button as="a" href="#solutions" variant="outlineDark" size="lg" className="w-full sm:w-auto">
                {t.hero.secondaryCta}
              </Button>
            </div>
          </div>

          {/* Glass stage: concentric rings and a floor glow under the live panel. */}
          {/* Hidden on phones so the hero stays short; no entrance animation, it is on the first screen. */}
          <div className="relative hidden justify-center py-6 sm:flex lg:justify-end lg:py-0">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="absolute size-[22rem] rounded-full border border-white/[0.07] sm:size-[28rem]" />
              <span className="absolute size-[15rem] rounded-full border border-white/[0.09] sm:size-[19rem]" />
              <span className="absolute size-[18rem] rounded-full bg-[radial-gradient(closest-side,rgb(63_174_126/0.28),transparent)] blur-2xl" />
            </div>
            <div className="relative lg:translate-x-2 xl:scale-105">
              <HomePanel />
            </div>
          </div>
        </div>

        {/* Trust strip: four numbered points, read as a row of facts. */}
        <div className="shell pt-10 pb-10 sm:pt-16 sm:pb-14 lg:pt-16 lg:pb-16">
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
        </div>
      </section>

      <Showroom />
    </>
  )
}
