/**
 * Cloudflare Worker — relays contact-form submissions to a Telegram chat.
 *
 * WHY THIS EXISTS
 * A Telegram bot token must never ship in the website bundle: the bundle is
 * public, and whoever reads the token can impersonate the bot, call getUpdates
 * to read every message sent to it, and rewrite its webhook. This Worker keeps
 * the token server-side; the browser only ever talks to the Worker.
 *
 * DEPLOY (no CLI needed, ~5 minutes)
 *   1. dash.cloudflare.com -> Compute (Workers) -> Create -> Start from Hello
 *      World -> Deploy. Then "Edit code", paste this file over the default,
 *      and Deploy again.
 *   2. Worker -> Settings -> Variables and Secrets, add three secrets:
 *        TELEGRAM_BOT_TOKEN  from @BotFather (/newbot)
 *        TELEGRAM_CHAT_ID    your numeric id from @userinfobot
 *        ALLOWED_ORIGINS     comma-separated, e.g.
 *                            https://panda00510.github.io,http://localhost:4173
 *   3. Put the Worker URL in the site's .env.local:
 *        VITE_FORM_ENDPOINT=https://<name>.<subdomain>.workers.dev
 *      then `npm run build`.
 *
 * The site needs no code change — it already POSTs this JSON shape.
 *
 * ponytail: no rate limiting. Add a Cloudflare Rate Limiting rule on the route
 * if the form ever gets hammered; that is config, not code.
 */

const MAX = { name: 120, contact: 160, homeType: 80, message: 4000 }

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? ''
    const allowed = (env.ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean)

    // Only answer browsers we recognise, so the Worker cannot be used as an
    // open relay to spam your Telegram.
    const okOrigin = allowed.includes(origin)
    const cors = {
      'Access-Control-Allow-Origin': okOrigin ? origin : allowed[0] ?? '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    }

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors)
    if (!okOrigin) return json({ error: 'Origin not allowed' }, 403, cors)

    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid JSON' }, 400, cors)
    }

    // The site's honeypot: a real person never fills this.
    if (typeof body.company === 'string' && body.company.trim()) {
      return json({ success: true }, 200, cors) // pretend success, send nothing
    }

    const field = (key) => String(body[key] ?? '').trim().slice(0, MAX[key] ?? 200)
    const name = field('name')
    const contact = field('contact')
    const message = field('message')
    const homeType = field('homeType')

    if (!name || !contact || !message) {
      return json({ error: 'Missing required fields' }, 400, cors)
    }

    const text = [
      '🐼 <b>New enquiry — Panda Smart Home</b>',
      '',
      `<b>Name:</b> ${esc(name)}`,
      `<b>Contact:</b> ${esc(contact)}`,
      `<b>Home type:</b> ${esc(homeType || '—')}`,
      `<b>Language:</b> ${esc(String(body.language ?? '—'))}`,
      '',
      esc(message),
    ].join('\n')

    const telegram = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      },
    )

    if (!telegram.ok) {
      // Surface failure so the site shows its error state rather than
      // telling the visitor their enquiry was received when it was not.
      console.error('Telegram error', telegram.status, await telegram.text())
      return json({ error: 'Delivery failed' }, 502, cors)
    }

    return json({ success: true }, 200, cors)
  },
}

/** Telegram HTML parse mode only needs these three escaped. */
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  })
}
