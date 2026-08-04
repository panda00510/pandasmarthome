import { ArrowRight } from 'lucide-react'
import { Button } from '../ui'
import { useI18n } from '../../i18n/context'

/**
 * Closing call to action.
 *
 * Deliberately image-free: every candidate photograph either repeated one used
 * elsewhere on the page or, in the case of the night skyline, disappeared
 * entirely under the scrim needed for text contrast. A designed band carries
 * the brand wash instead — and one fewer image to download.
 */
export function CtaBand() {
  const { t } = useI18n()

  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_28rem_at_50%_-20%,rgba(31,138,95,0.28),transparent_70%),radial-gradient(40rem_20rem_at_88%_120%,rgba(31,138,95,0.14),transparent_65%)]"
      />
      {/* Fine grid, barely there — gives the flat ink some architecture. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.055] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:72px_72px]"
      />

      <div className="shell py-16 text-center sm:py-20 lg:py-24">
        <h2 className="mx-auto max-w-2xl text-2xl leading-tight font-semibold tracking-[-0.025em] text-balance sm:text-3xl lg:text-4xl">
          {t.cta.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-300 sm:text-base">
          {t.cta.lead}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button as="a" href="#contact" variant="inverse" size="lg" className="w-full sm:w-auto">
            {t.cta.primary}
            <ArrowRight size={17} aria-hidden="true" />
          </Button>
          <Button
            as="a"
            href="#faq"
            size="lg"
            className="w-full border border-white/25 bg-transparent text-paper hover:bg-white/10 sm:w-auto"
          >
            {t.cta.secondary}
          </Button>
        </div>
      </div>
    </section>
  )
}
