import { brand } from './brand'

/**
 * Company, contact, SEO and integration configuration.
 *
 * Nothing here is invented. Every real-world detail (phone, email, WhatsApp,
 * address, form endpoint) is read from environment variables and is treated as
 * *unconfigured* until a non-empty value is supplied. Unconfigured values are
 * never rendered as fake data and never emitted into structured data.
 *
 * See `.env.example` for the full list and `README.md` for how to fill it in.
 */

/** Trims and collapses `undefined` / empty / placeholder values to `null`. */
function env(key: string): string | null {
  const raw = import.meta.env[key as keyof ImportMetaEnv]
  if (typeof raw !== 'string') return null
  const value = raw.trim()
  if (!value) return null
  // Guard against the placeholder text in .env.example being copied verbatim.
  if (/^(todo|tbd|changeme|your[-_ ])/i.test(value)) return null
  return value
}

/** Digits-only phone form required by the wa.me deep link. */
function toWaDigits(value: string | null): string | null {
  if (!value) return null
  const digits = value.replace(/\D/g, '')
  return digits.length >= 8 ? digits : null
}

const whatsappNumber = toWaDigits(env('VITE_WHATSAPP_NUMBER'))

export const site = {
  /** Legal / trading company name. Falls back to the brand name. */
  companyName: env('VITE_COMPANY_NAME') ?? brand.name,
  companyNameZh: env('VITE_COMPANY_NAME_ZH') ?? brand.nameZh,
  /** Registered entity number (e.g. Singapore UEN). Optional. */
  registrationNumber: env('VITE_COMPANY_REGISTRATION_NO'),

  email: env('VITE_CONTACT_EMAIL'),
  telephone: env('VITE_CONTACT_PHONE'),
  whatsappNumber,
  whatsappLink: whatsappNumber ? `https://wa.me/${whatsappNumber}` : null,

  address: {
    street: env('VITE_OFFICE_ADDRESS_STREET'),
    locality: env('VITE_OFFICE_ADDRESS_LOCALITY'),
    postalCode: env('VITE_OFFICE_ADDRESS_POSTAL_CODE'),
    country: env('VITE_OFFICE_ADDRESS_COUNTRY') ?? 'SG',
  },

  /**
   * POST target for the contact form. Without it the form falls back to
   * handing the enquiry to the visitor's mail client (see Contact.tsx).
   */
  formEndpoint: env('VITE_FORM_ENDPOINT'),
  /**
   * Optional public key sent as `access_key` in the form payload. Services
   * like Web3Forms identify the destination inbox this way. It is a public
   * submission key, not a secret — it only ever routes mail to the address
   * that registered it.
   */
  formAccessKey: env('VITE_FORM_ACCESS_KEY'),

  /** Canonical origin, no trailing slash. Used for canonical + og:url. */
  url: (env('VITE_SITE_URL') ?? '').replace(/\/+$/, '') || null,

  social: {
    instagram: env('VITE_SOCIAL_INSTAGRAM'),
    facebook: env('VITE_SOCIAL_FACEBOOK'),
    youtube: env('VITE_SOCIAL_YOUTUBE'),
    linkedin: env('VITE_SOCIAL_LINKEDIN'),
    telegram: env('VITE_SOCIAL_TELEGRAM'),
    xiaohongshu: env('VITE_SOCIAL_XIAOHONGSHU'),
  },

  /** Service area — a factual statement about where we work, not an address. */
  serviceArea: 'Singapore',
} as const

/** Social links that actually have a URL, in display order. */
export const socialLinks = (
  [
    ['instagram', site.social.instagram],
    ['facebook', site.social.facebook],
    ['youtube', site.social.youtube],
    ['linkedin', site.social.linkedin],
    ['telegram', site.social.telegram],
    ['xiaohongshu', site.social.xiaohongshu],
  ] as const
).filter((entry): entry is readonly [(typeof entry)[0], string] => Boolean(entry[1]))

export const hasAddress = Boolean(
  site.address.street ?? site.address.locality ?? site.address.postalCode,
)

/** True when at least one way to reach the company is configured. */
export const hasAnyContactDetail = Boolean(
  site.email ?? site.telephone ?? site.whatsappLink ?? hasAddress,
)

export const formattedAddress = hasAddress
  ? [site.address.street, site.address.locality, site.address.postalCode]
      .filter(Boolean)
      .join(', ')
  : null
