import { useId, useState, type FormEvent, type ReactNode } from 'react'
import {
  CircleCheck,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  TriangleAlert,
} from 'lucide-react'
import lighting from '../../assets/photos/bedroom-lighting.jpg'
import { formattedAddress, hasAnyContactDetail, site } from '../../config/site'
import { Button, SectionHeading } from '../ui'
import { useI18n } from '../../i18n/context'

type Status = 'idle' | 'submitting' | 'success' | 'mailto' | 'error'
type Errors = { name?: string; contact?: string; message?: string }

/**
 * How the enquiry gets delivered.
 *
 *  'post'   — VITE_FORM_ENDPOINT is set: JSON POST, fully in-page.
 *  'mailto' — no endpoint but VITE_CONTACT_EMAIL is: hand the filled-in
 *             enquiry to the visitor's mail client. Works with no backend at
 *             all, at the cost of one extra tap in their mail app.
 *  'none'   — neither is set: the form stays disabled and says so.
 */
const MODE: 'post' | 'mailto' | 'none' = site.formEndpoint
  ? 'post'
  : site.email
    ? 'mailto'
    : 'none'

/** Accepts either an email address or a phone number with at least 8 digits. */
function isUsableContact(value: string): boolean {
  const trimmed = value.trim()
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return true
  return /^[+()\d][\s\-()\d]{6,}$/.test(trimmed) && trimmed.replace(/\D/g, '').length >= 8
}

export function Contact() {
  const { t, lang } = useI18n()
  const ids = useId()
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})

  const enabled = MODE !== 'none'
  const c = t.contact

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (MODE === 'none' || status === 'submitting') return

    // Captured up front: `currentTarget` is cleared once the handler yields.
    const form = event.currentTarget
    const data = new FormData(form)
    // Honeypot: real users never see this field, bots fill everything.
    if ((data.get('company') as string)?.trim()) return

    const name = ((data.get('name') as string) ?? '').trim()
    const contact = ((data.get('contact') as string) ?? '').trim()
    const message = ((data.get('message') as string) ?? '').trim()
    const homeType = ((data.get('homeType') as string) ?? '').trim()

    const nextErrors: Errors = {}
    if (!name) nextErrors.name = c.states.required
    if (!contact) nextErrors.contact = c.states.required
    else if (!isUsableContact(contact)) nextErrors.contact = c.states.invalidContact
    if (!message) nextErrors.message = c.states.required

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (MODE === 'mailto') {
      const body = [
        `${c.form.name}: ${name}`,
        `${c.form.contact}: ${contact}`,
        `${c.form.homeType}: ${homeType || '—'}`,
        '',
        `${c.form.message}`,
        message,
      ].join('\n')

      window.location.href =
        `mailto:${site.email}` +
        `?subject=${encodeURIComponent(`${c.mailSubject} — ${name}`)}` +
        `&body=${encodeURIComponent(body)}`

      // Deliberately NOT "sent": it only counts once they press send in their
      // mail app, and the page has no way to know whether they did.
      setStatus('mailto')
      return
    }

    setStatus('submitting')
    try {
      const response = await fetch(site.formEndpoint!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          // `access_key`, `subject` and `from_name` are what hosted form
          // services (Web3Forms and friends) read to route and title the
          // notification email. A custom endpoint can simply ignore them.
          ...(site.formAccessKey ? { access_key: site.formAccessKey } : {}),
          subject: `${c.mailSubject} — ${name}`,
          from_name: name,
          // Give the service a real reply-to when the visitor left an email.
          ...(contact.includes('@') ? { email: contact } : {}),
          name,
          contact,
          homeType: homeType || null,
          message,
          language: lang,
          submittedAt: new Date().toISOString(),
        }),
      })
      if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`)
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="band border-t border-ink-200/70 bg-paper-alt">
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
        {/* ---- Details ---------------------------------------------------- */}
        <div>
          <SectionHeading eyebrow={c.eyebrow} title={c.title} lead={c.lead} />

          {(site.whatsappLink ?? site.email) ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {site.whatsappLink ? (
                <Button
                  as="a"
                  href={site.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="accent"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  {c.whatsappCta}
                </Button>
              ) : null}
              {site.email ? (
                <Button as="a" href={`mailto:${site.email}`} variant="secondary">
                  <Mail size={17} aria-hidden="true" />
                  {c.emailCta}
                </Button>
              ) : null}
            </div>
          ) : null}

          <dl className="mt-9 space-y-4 border-t border-ink-200 pt-8">
            {site.email ? (
              <DetailRow icon={<Mail size={16} />} label={c.labels.email}>
                <a href={`mailto:${site.email}`} className="hover:text-bamboo-700">
                  {site.email}
                </a>
              </DetailRow>
            ) : null}

            {site.telephone ? (
              <DetailRow icon={<Phone size={16} />} label={c.labels.phone}>
                <a href={`tel:${site.telephone.replace(/\s+/g, '')}`} className="hover:text-bamboo-700">
                  {site.telephone}
                </a>
              </DetailRow>
            ) : null}

            {site.whatsappNumber ? (
              <DetailRow icon={<MessageCircle size={16} />} label={c.labels.whatsapp}>
                +{site.whatsappNumber}
              </DetailRow>
            ) : null}

            {formattedAddress ? (
              <DetailRow icon={<MapPin size={16} />} label={c.labels.address}>
                {formattedAddress}
              </DetailRow>
            ) : null}

            <DetailRow icon={<MapPin size={16} />} label={c.labels.serviceArea}>
              {site.serviceArea}
            </DetailRow>
          </dl>

          {/*
            Nothing is invented: when no channel is configured the page says so
            plainly instead of rendering a placeholder phone number.
          */}
          {!hasAnyContactDetail ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-dashed border-ink-300 bg-white px-5 py-4">
              <Info size={17} className="mt-0.5 shrink-0 text-ink-500" aria-hidden="true" />
              <div>
                <p className="text-[0.9375rem] font-medium text-ink-900">{c.pendingDetails}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{c.pendingDetailsNote}</p>
              </div>
            </div>
          ) : null}

          <img
            src={lighting}
            alt=""
            width={1280}
            height={959}
            loading="lazy"
            decoding="async"
            className="mt-10 hidden aspect-[16/10] w-full rounded-panel object-cover shadow-soft lg:block"
          />
        </div>

        {/* ---- Form ------------------------------------------------------- */}
        <div className="card p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-ink-950">{c.form.title}</h3>

          {MODE === 'none' ? (
            <div
              role="note"
              className="mt-5 flex items-start gap-3 rounded-2xl bg-ember-300/20 px-5 py-4 ring-1 ring-ember-400/40"
            >
              <TriangleAlert size={17} className="mt-0.5 shrink-0 text-ember-600" aria-hidden="true" />
              <div>
                <p className="text-[0.9375rem] font-medium text-ink-900">
                  {c.states.unconfiguredTitle}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">
                  {c.states.unconfiguredBody}
                </p>
              </div>
            </div>
          ) : null}

          {MODE === 'mailto' ? (
            <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-ink-600">
              <Mail size={15} className="mt-0.5 shrink-0 text-ink-400" aria-hidden="true" />
              {c.form.viaEmailNote}
            </p>
          ) : null}

          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
            <fieldset disabled={!enabled || status === 'submitting'} className="space-y-5">
              {/* Honeypot — visually and programmatically hidden from people. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <Field
                id={`${ids}-name`}
                name="name"
                label={c.form.name}
                placeholder={c.form.namePlaceholder}
                autoComplete="name"
                error={errors.name}
                required
              />

              <Field
                id={`${ids}-contact`}
                name="contact"
                label={c.form.contact}
                placeholder={c.form.contactPlaceholder}
                help={c.form.contactHelp}
                autoComplete="email"
                error={errors.contact}
                required
              />

              <div>
                <label
                  htmlFor={`${ids}-home`}
                  className="block text-sm font-medium text-ink-800"
                >
                  {c.form.homeType}
                </label>
                <select
                  id={`${ids}-home`}
                  name="homeType"
                  defaultValue=""
                  className="field mt-2 appearance-none bg-[length:1rem] bg-[right_0.9rem_center] bg-no-repeat pr-10"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23667080' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                  }}
                >
                  {c.form.homeTypeOptions.map((option, i) => (
                    <option key={option} value={i === 0 ? '' : option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <Field
                id={`${ids}-message`}
                name="message"
                label={c.form.message}
                placeholder={c.form.messagePlaceholder}
                error={errors.message}
                multiline
                required
              />

              <p className="text-xs leading-relaxed text-ink-500">{c.form.consent}</p>

              <Button type="submit" size="lg" className="w-full">
                {status === 'submitting' ? (
                  c.form.submitting
                ) : (
                  <>
                    {MODE === 'mailto' ? (
                      <Mail size={16} aria-hidden="true" />
                    ) : (
                      <Send size={16} aria-hidden="true" />
                    )}
                    {MODE === 'mailto' ? c.form.submitViaEmail : c.form.submit}
                  </>
                )}
              </Button>
            </fieldset>
          </form>

          {/* Submission result — announced to assistive tech. */}
          <div aria-live="polite" className="empty:hidden">
            {status === 'success' ? (
              <Banner
                tone="success"
                icon={<CircleCheck size={17} aria-hidden="true" />}
                title={c.states.successTitle}
                body={c.states.successBody}
              />
            ) : null}
            {status === 'mailto' ? (
              <Banner
                tone="success"
                icon={<Mail size={17} aria-hidden="true" />}
                title={c.states.mailtoTitle}
                body={c.states.mailtoBody}
              >
                {site.email ? (
                  <p className="mt-2 text-sm text-ink-600">
                    {c.states.mailtoFallback}{' '}
                    <a
                      href={`mailto:${site.email}`}
                      className="font-medium text-bamboo-700 underline underline-offset-2"
                    >
                      {site.email}
                    </a>
                  </p>
                ) : null}
              </Banner>
            ) : null}
            {status === 'error' ? (
              <Banner
                tone="error"
                icon={<TriangleAlert size={17} aria-hidden="true" />}
                title={c.states.errorTitle}
                body={c.states.errorBody}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="mt-0.5 shrink-0 text-ink-400" aria-hidden="true">
        {icon}
      </span>
      <div>
        <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">{label}</dt>
        <dd className="mt-1 text-[0.9375rem] text-ink-800">{children}</dd>
      </div>
    </div>
  )
}

function Field({
  id,
  name,
  label,
  placeholder,
  help,
  error,
  required,
  multiline,
  autoComplete,
}: {
  id: string
  name: string
  label: string
  placeholder?: string
  help?: string
  error?: string
  required?: boolean
  multiline?: boolean
  autoComplete?: string
}) {
  const describedBy = [help ? `${id}-help` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ')

  const shared = {
    id,
    name,
    placeholder,
    required,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': describedBy || undefined,
    className: 'field mt-2',
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-800">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-bamboo-600">
            *
          </span>
        ) : null}
      </label>

      {multiline ? (
        <textarea {...shared} rows={4} className="field mt-2 resize-y" />
      ) : (
        <input {...shared} type="text" autoComplete={autoComplete} />
      )}

      {help ? (
        <p id={`${id}-help`} className="mt-1.5 text-xs text-ink-500">
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-[#c0392b]">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function Banner({
  tone,
  icon,
  title,
  body,
  children,
}: {
  tone: 'success' | 'error'
  icon: ReactNode
  title: string
  body: string
  children?: ReactNode
}) {
  const success = tone === 'success'
  return (
    <div
      className={`mt-5 flex items-start gap-3 rounded-2xl px-5 py-4 ring-1 ${
        success ? 'bg-bamboo-50 ring-bamboo-200' : 'bg-[#fdeceb] ring-[#f3c3bd]'
      }`}
    >
      <span className={`mt-0.5 shrink-0 ${success ? 'text-bamboo-600' : 'text-[#c0392b]'}`}>
        {icon}
      </span>
      <div>
        <p className="text-[0.9375rem] font-medium text-ink-900">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-600">{body}</p>
        {children}
      </div>
    </div>
  )
}
