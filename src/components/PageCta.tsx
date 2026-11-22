import { ArrowRight, Box } from 'lucide-react'
import { Button } from './ui'
import { pageHref, useI18n } from '../i18n/context'
import { showroomHref } from '../lib/showroom'

/** The closing next step on pages that have no enquiry of their own: the contact page first, the showroom second. */
export function PageCta({ className = '' }: { className?: string }) {
  const { t, lang } = useI18n()
  return (
    <aside className={`rounded-panel bg-ink-950 p-6 text-paper sm:p-9 print:hidden ${className}`}>
      <h2 className="text-xl font-semibold sm:text-2xl">{t.cta.title}</h2>
      <p className="mt-2 max-w-2xl leading-relaxed text-[#c7cdd2]">{t.cta.lead}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button as="a" href={pageHref(lang, 'contact/')} variant="glow">
          {t.cta.primary}
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
        <Button as="a" href={showroomHref(lang)} variant="outlineDark">
          <Box size={16} aria-hidden="true" />
          {t.cta.secondary}
        </Button>
      </div>
    </aside>
  )
}
