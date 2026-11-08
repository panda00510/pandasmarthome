import { ArrowRight } from 'lucide-react'
import { Button } from '../ui'
import { useI18n } from '../../i18n/context'

/**
 * Mid-page booking prompt: one short band after the process, so a visitor who
 * has seen what happens next does not have to scroll to the form. It sits on
 * the brand colour and carries no photograph.
 */
export function CtaBand() {
  const { t } = useI18n()

  return (
    <section className="bg-brand text-white">
      <div className="shell flex flex-col gap-5 py-9 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:py-12">
        <div className="max-w-2xl">
          <h2 className="text-[1.5rem] leading-tight font-semibold tracking-[-0.02em] text-balance sm:text-3xl">
            {t.cta.title}
          </h2>
          <p className="mt-2 hidden text-[0.9375rem] leading-relaxed text-white/80 sm:block">{t.cta.lead}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button as="a" href="#contact" variant="inverse" size="lg" className="w-full sm:w-auto">
            {t.cta.primary}
            <ArrowRight size={17} aria-hidden="true" />
          </Button>
          <Button
            as="a"
            href="#faq"
            size="lg"
            className="w-full border border-white/40 bg-transparent text-white hover:bg-white/10 sm:w-auto"
          >
            {t.cta.secondary}
          </Button>
        </div>
      </div>
    </section>
  )
}
