import { useState, type MouseEvent } from 'react'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Choice, Choices } from '../Choices'
import { Button, SectionHeading } from '../ui'
import { CONTACT_PREFILL, type ContactPrefill } from './Contact'
import { pageHref, useI18n } from '../../i18n/context'
import { track } from '../../lib/track'
import { whatsappHref } from '../../lib/whatsapp'

/**
 * Homepage "plan starter" styled as an architectural specification worksheet.
 */
export function Planner() {
  const { t, lang } = useI18n()
  const p = t.planner
  const [home, setHome] = useState('')
  const [rooms, setRooms] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const complete = Boolean(home && rooms && picked.length)
  const homeOption = p.homes.find((option) => option.id === home)
  const chosen = p.priorities.filter((priority) => picked.includes(priority.id))
  const groups = t.products.install.groups
    .map((group) => ({
      ...group,
      reasons: [
        ...chosen.flatMap((priority) => priority.picks.filter((pick) => pick.group === group.id).map((pick) => pick.reason)),
        ...(group.id === 'hubs-gateways' ? [p.hubReason] : []),
      ],
    }))
    .filter((group) => group.reasons.length)

  const message = p.message
    .replace('{home}', homeOption?.label ?? '')
    .replace('{rooms}', p.rooms.find((option) => option.id === rooms)?.label ?? '')
    .replace('{priorities}', chosen.map((priority) => priority.label).join(p.join))
  const whatsapp = whatsappHref(message)
  const formOptions = t.contact.form
  const homeIndex: Record<string, number> = { condo: 3, landed: 4 }
  const startIndex: Record<string, number> = { lighting: 1, aircon: 2, curtains: 3, security: 4, energy: 6 }
  const formPrefill: ContactPrefill = {
    homeType: formOptions.homeTypeOptions[homeIndex[home]] ?? '',
    startWith: picked.length === 1 ? (formOptions.startWithOptions[startIndex[picked[0]]] ?? '') : '',
    message,
  }
  const [noteBefore, noteAfter] = (homeOption?.note ?? '').split('{link}')

  return (
    <section id="plan" className="band bg-surface">
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        </div>

        <form
          className="relative space-y-7 overflow-x-clip rounded-panel border border-ink-950/16 bg-paper p-5 shadow-soft sm:p-8"
          onSubmit={(event) => {
            event.preventDefault()
            if (!complete) return
            setDone(true)
            track('plan_starter_complete', { home, rooms, priorities: picked.join(',') })
          }}
        >
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-brand" />
          <Choices step="01" legend={p.homeLabel}>
            {p.homes.map((option) => (
              <Choice key={option.id} type="radio" name="plan-home" value={option.id} checked={home === option.id} onChange={() => setHome(option.id)}>
                {option.label}
              </Choice>
            ))}
          </Choices>
          <div className="border-t border-ink-950/12 pt-6">
            <Choices step="02" legend={p.roomsLabel}>
              {p.rooms.map((option) => (
                <Choice key={option.id} type="radio" name="plan-rooms" value={option.id} checked={rooms === option.id} onChange={() => setRooms(option.id)}>
                  {option.label}
                </Choice>
              ))}
            </Choices>
          </div>
          <div className="border-t border-ink-950/12 pt-6">
            <Choices step="03" legend={p.prioritiesLabel} help={p.prioritiesHelp}>
              {p.priorities.map((option) => (
                <Choice
                  key={option.id}
                  type="checkbox"
                  name="plan-priorities"
                  value={option.id}
                  checked={picked.includes(option.id)}
                  onChange={(checked) => setPicked(checked ? [...picked, option.id] : picked.filter((id) => id !== option.id))}
                >
                  {option.label}
                </Choice>
              ))}
            </Choices>
          </div>

          <div className="border-t border-ink-950/12 pt-6">
            <Button type="submit" size="lg" aria-describedby={complete ? undefined : 'plan-incomplete'}>
              {p.submit}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
            {complete ? null : (
              <p id="plan-incomplete" className="mt-2.5 text-sm text-ink-600">
                {p.incomplete}
              </p>
            )}
          </div>

          <div aria-live="polite">
            {done && complete ? (
              <div className="rounded-card border border-brand/30 bg-surface p-5 sm:p-6">
                <h3 className="title-group text-ink-950">{p.resultTitle}</h3>
                <ul className="mt-4 space-y-3">
                  {groups.map((group) => (
                    <li key={group.id} className="rounded-[3px] border border-ink-950/12 border-l-[3px] border-l-brand bg-paper p-4">
                      <p className="font-semibold text-ink-950">{group.title}</p>
                      <ul className="mt-2 space-y-1.5 text-[0.9375rem] leading-relaxed text-ink-700">
                        {group.reasons.map((reason) => (
                          <li key={reason}>{reason}</li>
                        ))}
                      </ul>
                      <a href={pageHref(lang, group.path)} className="link-more mt-2 min-h-11 text-sm">
                        {p.learnMore}
                        <ArrowRight size={14} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
                {homeOption ? (
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-700">
                    {noteBefore}
                    <a href={pageHref(lang, homeOption.path)} className="font-medium text-brand underline underline-offset-2 hover:text-ink-950">
                      {homeOption.linkLabel}
                    </a>
                    {noteAfter}
                  </p>
                ) : null}
                <p className="mt-3 text-sm text-ink-600">{p.disclaimer}</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  {whatsapp ? (
                    <Button as="a" href={whatsapp} target="_blank" rel="noopener noreferrer" data-track-source="plan">
                      <MessageCircle size={17} aria-hidden="true" />
                      {p.whatsappCta}
                    </Button>
                  ) : null}
                  <Button
                    as="a"
                    href="#contact"
                    variant="secondary"
                    onClick={(event: MouseEvent) => {
                      event.preventDefault()
                      window.dispatchEvent(new CustomEvent<ContactPrefill>(CONTACT_PREFILL, { detail: formPrefill }))
                    }}
                  >
                    {p.formCta}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  )
}
