import { useState } from 'react'
import { ArrowRight, Mail, MessageCircle } from 'lucide-react'
import { site } from '../config/site'
import type { Brief } from '../content/types'
import { track } from '../lib/track'
import { whatsappHref } from '../lib/whatsapp'
import { Choice, Choices } from './Choices'
import { Button, SectionHeading } from './ui'

/**
 * Project brief on the custom hardware / software pages, modelled on the
 * homepage plan starter. The message and the tracking event carry only the
 * visitor's choices. No WhatsApp number → email if one is set → otherwise the
 * summary is shown with no send button (never a placeholder contact).
 */
export function ProjectBrief({ brief, id }: { brief: Brief; id: 'hardware' | 'software' }) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [done, setDone] = useState(false)

  const complete = brief.questions.every((q) => answers[q.id]?.length)
  const message = brief.message.replace(
    '{answers}',
    brief.questions
      .map((q) => `${q.short}${q.options.filter((o) => answers[q.id]?.includes(o.id)).map((o) => o.label).join(brief.join)}`)
      .join(brief.sep),
  )
  const whatsapp = whatsappHref(message)
  const email = site.email
    ? `mailto:${site.email}?subject=${encodeURIComponent(brief.emailSubject)}&body=${encodeURIComponent(message)}`
    : null

  function toggle(questionId: string, optionId: string, multiple: boolean | undefined, checked: boolean) {
    const current = answers[questionId] ?? []
    const next = !multiple ? [optionId] : checked ? [...current, optionId] : current.filter((x) => x !== optionId)
    setAnswers({ ...answers, [questionId]: next })
  }

  return (
    <section id="brief" className="band scroll-mt-20 border-t border-ink-200/70">
      <div className="shell grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <SectionHeading eyebrow={brief.eyebrow} title={brief.title} lead={brief.lead} />

        <form
          className="card space-y-6 p-5 sm:p-7"
          onSubmit={(event) => {
            event.preventDefault()
            if (!complete) return
            setDone(true)
            track(`${id}_brief_complete`, Object.fromEntries(brief.questions.map((q) => [q.id, answers[q.id].join(',')])))
          }}
        >
          {brief.questions.map((q) => (
            <Choices key={q.id} legend={q.label} help={q.help}>
              {q.options.map((o) => (
                <Choice
                  key={o.id}
                  type={q.multiple ? 'checkbox' : 'radio'}
                  name={`${id}-${q.id}`}
                  value={o.id}
                  checked={answers[q.id]?.includes(o.id) ?? false}
                  onChange={(checked) => toggle(q.id, o.id, q.multiple, checked)}
                >
                  {o.label}
                </Choice>
              ))}
            </Choices>
          ))}

          <div>
            <Button type="submit" aria-describedby={complete ? undefined : `${id}-brief-incomplete`}>
              {brief.submit}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
            {complete ? null : (
              <p id={`${id}-brief-incomplete`} className="mt-2 text-sm text-ink-600">
                {brief.incomplete}
              </p>
            )}
          </div>

          <div aria-live="polite">
            {done && complete ? (
              <div className="border-t border-ink-200 pt-6">
                <h3 className="text-lg font-semibold text-ink-950">{brief.summaryTitle}</h3>
                <p className="mt-3 rounded-card bg-bamboo-50 p-4 text-[0.9375rem] leading-relaxed text-ink-800 ring-1 ring-bamboo-100">
                  {message}
                </p>
                <p className="mt-4 text-sm text-ink-600">{brief.disclaimer}</p>
                {whatsapp ? (
                  <Button as="a" href={whatsapp} target="_blank" rel="noopener noreferrer" data-track-source={`${id}-brief`} className="mt-5">
                    <MessageCircle size={18} aria-hidden="true" />
                    {brief.whatsappCta}
                  </Button>
                ) : email ? (
                  <Button as="a" href={email} variant="secondary" className="mt-5">
                    <Mail size={18} aria-hidden="true" />
                    {brief.emailCta}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  )
}
