// Same WhatsApp channel as the marketing site: the number comes from the
// VITE_WHATSAPP_NUMBER build variable (see src/config/site.ts) and is never
// committed. Without it there is no link, and the CTA is simply not shown.

function digits(value) {
  if (typeof value !== 'string') return null
  const d = value.replace(/\D/g, '')
  return d.length >= 8 ? d : null
}

const WHATSAPP_NUMBER = digits(import.meta.env.VITE_WHATSAPP_NUMBER)

export const WHATSAPP_LINK = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : null
