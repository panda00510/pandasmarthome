import { ArrowRight, Check } from 'lucide-react'
import livingRoom from '../../assets/photos/living-room.jpg'
import { HomePanel } from '../graphics/HomePanel'
import { Button } from '../ui'
import { useI18n } from '../../i18n/context'

export function Hero() {
  const { t, lang } = useI18n()

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Soft brand wash behind the fold, drifting slowly so the fold feels
          alive rather than printed. Stopped by prefers-reduced-motion. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [animation:drift_26s_ease-in-out_infinite] bg-[radial-gradient(80rem_40rem_at_78%_-10%,rgba(31,138,95,0.15),transparent_60%),radial-gradient(50rem_28rem_at_8%_0%,rgba(12,15,19,0.07),transparent_65%)]"
      />
      {/* Faint engineering grid — reads as "system", fades out down the fold. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] [background-image:linear-gradient(to_right,#0c0f13_1px,transparent_1px),linear-gradient(to_bottom,#0c0f13_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
      />

      <div className="shell grid items-center gap-12 pt-12 pb-16 sm:pt-16 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16 lg:pt-20 lg:pb-28">
        <div className="animate-rise">
          <p className="eyebrow">
            <span aria-hidden="true" className="h-px w-6 bg-bamboo-500/50" />
            {t.hero.eyebrow}
          </p>

          <h1 className="mt-5 text-[2.25rem] leading-[1.08] font-semibold tracking-[-0.032em] text-ink-950 text-balance sm:text-[3rem] lg:text-[3.5rem] xl:text-[3.85rem]">
            {t.hero.titleLead}
            {/* CJK sets without inter-word spaces; the Chinese lead already ends in a comma. */}
            {lang === 'zh' ? null : ' '}
            <span className="text-bamboo-600">{t.hero.titleAccent}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
            {t.hero.lead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button as="a" href="#contact" size="lg" className="w-full sm:w-auto">
              {t.hero.primaryCta}
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
            <Button
              as="a"
              href="#solutions"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {t.hero.secondaryCta}
            </Button>
          </div>

          <ul className="mt-10 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {t.hero.trust.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] text-ink-700">
                <Check
                  size={16}
                  strokeWidth={2.6}
                  className="mt-0.5 shrink-0 text-bamboo-500"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Photo + floating control panel */}
        <div className="relative">
          <div className="overflow-hidden rounded-panel border border-ink-200/80 shadow-lift">
            <img
              src={livingRoom}
              alt={t.hero.imageAlt}
              width={1600}
              height={1068}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
            />
          </div>

          {/*
            Overlaps the bottom of the photo on one-column layouts; only floats
            out to the left once the hero is genuinely two columns (lg), where
            there is a gutter for it to hang into.
          */}
          <div className="mt-[-3.5rem] ml-2 sm:mt-[-4.5rem] lg:absolute lg:bottom-[-2.75rem] lg:left-[-3.25rem] lg:mt-0 lg:ml-0">
            <HomePanel />
          </div>
        </div>
      </div>
    </section>
  )
}
