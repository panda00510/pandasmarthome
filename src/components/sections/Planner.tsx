import { useState, type MouseEvent } from 'react'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Choice, Choices } from '../Choices'
import { Button, SectionHeading } from '../ui'
import { CONTACT_PREFILL, type ContactPrefill } from './Contact'
import { pageHref, useI18n } from '../../i18n/context'
import { track } from '../../lib/track'
import { whatsappHref } from '../../lib/whatsapp'

/**
 * Homepage "plan starter": home type, bedrooms and priorities point at the
 * device groups in products.install, each with a one-line reason. Runs in the
 * browser only; the WhatsApp message carries the visitor's choices and nothing else.
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
  // Groups in the products page's order; the hub is always the last.
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
  // Contact form options are in the same order in both languages: index into contact.form.*Options.
  // Only honest one-to-one matches; "HDB / BTO" could be either form option, so it stays unset.
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
    <section id="plan" className="band">
      <div className="shell grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} lead={p.lead} />

        <form
          className="card space-y-6 p-5 sm:p-7"
          onSubmit={(event) => {
            event.preventDefault()
            if (!complete) return
            setDone(true)
            track('plan_starter_complete', { home, rooms, priorities: picked.join(',') })
          }}
        >
          <Choices legend={p.homeLabel}>
            {p.homes.map((option) => (
              <Choice key={option.id} type="radio" name="plan-home" value={option.id} checked={home === option.id} onChange={() => setHome(option.id)}>
                {option.label}
              </Choice>
            ))}
          </Choices>
          <Choices legend={p.roomsLabel}>
            {p.rooms.map((option) => (
              <Choice key={option.id} type="radio" name="plan-rooms" value={option.id} checked={rooms === option.id} onChange={() => setRooms(option.id)}>
                {option.label}
              </Choice>
            ))}
          </Choices>
          <Choices legend={p.prioritiesLabel} help={p.prioritiesHelp}>
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

          <div>
            <Button type="submit" aria-describedby={complete ? undefined : 'plan-incomplete'}>
              {p.submit}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
            {complete ? null : (
              <p id="plan-incomplete" className="mt-2 text-sm text-ink-600">
                {p.incomplete}
              </p>
            )}
          </div>

          {/* aria-live: the list is announced when it appears and as choices change. */}
          <div aria-live="polite">
            {done && complete ? (
              <div className="border-t border-ink-200 pt-6">
                <h3 className="text-lg font-semibold text-ink-950">{p.resultTitle}</h3>
                <ul className="mt-4 space-y-4">
                  {groups.map((group) => (
                    <li key={group.id} className="rounded-card bg-bamboo-50 p-4 ring-1 ring-bamboo-100">
                      <p className="font-semibold text-ink-950">{group.title}</p>
                      <ul className="mt-2 space-y-1.5 text-[0.9375rem] leading-relaxed text-ink-700">
                        {group.reasons.map((reason) => (
                          <li key={reason}>{reason}</li>
                        ))}
                      </ul>
                      <a href={pageHref(lang, group.path)} className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-bamboo-700 hover:text-bamboo-800">
                        {p.learnMore}
                        <ArrowRight size={14} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
                {homeOption ? (
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-700">
                    {noteBefore}
                    <a href={pageHref(lang, homeOption.path)} className="font-medium text-bamboo-700 underline underline-offset-2 hover:text-bamboo-800">
                      {homeOption.linkLabel}
                    </a>
                    {noteAfter}
                  </p>
                ) : null}
                <p className="mt-4 text-sm text-ink-600">{p.disclaimer}</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  {whatsapp ? (
                    <Button as="a" href={whatsapp} target="_blank" rel="noopener noreferrer" data-track-source="plan">
                      <MessageCircle size={18} aria-hidden="true" />
                      {p.whatsappCta}
                    </Button>
                  ) : null}
                  {/* Hands the same summary to the contact form below; Contact.tsx moves focus to the name field. */}
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
