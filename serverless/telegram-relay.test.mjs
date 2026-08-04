/**
 * Self-check for telegram-relay.js. No framework: `node serverless/telegram-relay.test.mjs`.
 * Stubs global fetch so nothing is actually sent to Telegram.
 */
import assert from 'node:assert/strict'
import worker from './telegram-relay.js'

const ENV = {
  TELEGRAM_BOT_TOKEN: 'test-token',
  TELEGRAM_CHAT_ID: '12345',
  ALLOWED_ORIGINS: 'https://panda00510.github.io, http://localhost:4173',
}
const GOOD = 'https://panda00510.github.io'

let sent = null
let telegramOk = true
globalThis.fetch = async (url, init) => {
  sent = { url, body: JSON.parse(init.body) }
  return telegramOk
    ? new Response('{"ok":true}', { status: 200 })
    : new Response('{"ok":false}', { status: 400 })
}

const post = (body, origin = GOOD, method = 'POST') =>
  worker.fetch(
    new Request('https://relay.workers.dev', {
      method,
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: method === 'POST' ? JSON.stringify(body) : undefined,
    }),
    ENV,
  )

const valid = { name: 'Tan Wei', contact: 'tan@example.com', message: 'Aircon + curtains', homeType: 'Condominium', language: 'en' }

// --- happy path -------------------------------------------------------------
sent = null
let res = await post(valid)
assert.equal(res.status, 200)
assert.deepEqual(await res.json(), { success: true })
assert.equal(sent.url, 'https://api.telegram.org/bottest-token/sendMessage')
assert.equal(sent.body.chat_id, '12345')
assert.match(sent.body.text, /Tan Wei/)
assert.match(sent.body.text, /tan@example\.com/)
assert.match(sent.body.text, /Condominium/)
assert.equal(res.headers.get('Access-Control-Allow-Origin'), GOOD)

// --- CORS preflight ---------------------------------------------------------
res = await post(null, GOOD, 'OPTIONS')
assert.equal(res.status, 204)
assert.equal(res.headers.get('Access-Control-Allow-Origin'), GOOD)

// --- unknown origin is rejected (no open relay) -----------------------------
sent = null
res = await post(valid, 'https://evil.example')
assert.equal(res.status, 403)
assert.equal(sent, null, 'must not contact Telegram for a disallowed origin')

// --- allowlist tolerates whitespace after the comma -------------------------
res = await post(valid, 'http://localhost:4173')
assert.equal(res.status, 200)

// --- honeypot: pretend success, send nothing --------------------------------
sent = null
res = await post({ ...valid, company: 'spambot' })
assert.equal(res.status, 200)
assert.deepEqual(await res.json(), { success: true })
assert.equal(sent, null, 'honeypot hit must not reach Telegram')

// --- validation -------------------------------------------------------------
sent = null
res = await post({ ...valid, message: '   ' })
assert.equal(res.status, 400)
assert.equal(sent, null)

// --- HTML escaping so parse_mode cannot break or inject ---------------------
await post({ ...valid, name: '<b>x</b> & "y"' })
assert.match(sent.body.text, /&lt;b&gt;x&lt;\/b&gt; &amp; "y"/)
assert.ok(!/<b>x<\/b>/.test(sent.body.text), 'raw tags must not survive')

// --- length caps ------------------------------------------------------------
await post({ ...valid, message: 'z'.repeat(9000) })
assert.ok(sent.body.text.length < 5000, 'message must be truncated')

// --- Telegram failure surfaces as an error, never a false success -----------
telegramOk = false
res = await post(valid)
assert.equal(res.status, 502)
assert.notEqual((await res.json()).success, true)

console.log('telegram-relay: all checks passed')
