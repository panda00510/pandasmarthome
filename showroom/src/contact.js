// Same WhatsApp channel as the marketing site (src/config/site.ts reads
// VITE_WHATSAPP_NUMBER and does not commit the digits). The fallback is the
// number already published on the live site, not a placeholder.

function digits(value) {
  if (typeof value !== 'string') return null
  const d = value.replace(/\D/g, '')
  return d.length >= 8 ? d : null
}

/** Digits already shown as +65 8067 6515 on the published Panda Smart Home site. */
const PUBLISHED_WHATSAPP = '6580676515'

export const WHATSAPP_NUMBER = digits(import.meta.env.VITE_WHATSAPP_NUMBER) || PUBLISHED_WHATSAPP

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`
