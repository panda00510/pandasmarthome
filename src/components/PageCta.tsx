import { ArrowRight, Box } from 'lucide-react'
import { Button } from './ui'
import { pageHref, useI18n } from '../i18n/context'
import { showroomHref } from '../lib/showroom'

/** The closing next step on pages that have no enquiry of their own: the contact page first, the showroom second. */
export function PageCta({ className = '' }: { className?: string }) {
  const { t, lang } = useI18n()
  return (
    <aside className={`bevel-dark relative isolate overflow-hidden rounded-panel bg-ink-950 p-6 text-paper sm:p-10 print:hidden ${className}`}>
      <span aria-hidden="true" className="hairline-dark pointer-events-none absolute inset-x-0 top-0" />
      <span aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0 -z-10 opacity-75" />
      <h2 className="title-section text-paper">{t.cta.title}</h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-300">{t.cta.lead}</p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button as="a" href={pageHref(lang, 'contact/')} variant="glow" size="lg">
          {t.cta.primary}
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
        <Button as="a" href={showroomHref(lang)} variant="outlineDark" size="lg">
          <Box size={16} aria-hidden="true" />
          {t.cta.secondary}
        </Button>
      </div>
    </aside>
  )
}
