/**
 * Weekly check that the live site's enquiry form can still reach its backend
 * (.github/workflows/form-check.yml; README "Weekly form check").
 *
 * It looks at what is actually deployed, not at the repo's configuration:
 *   1. the live HTML has no "not configured" notice, and the endpoint inlined
 *      from VITE_FORM_ENDPOINT can be read back out of the live JS;
 *   2. the endpoint answers a CORS preflight and a deliberately invalid POST
 *      (no access_key, honeypot filled) — neither can reach an inbox;
 *   3. only with REAL_SUBMIT=true: one real submission, which does send mail;
 *   4. /, /zh/ and /showroom/ are 200, an unknown path is 404, and the
 *      WhatsApp link is on the homepage when a number is configured.
 *
 *   node scripts/check-form.mjs          live check (network)
 *   node scripts/check-form.mjs --dry    self-test of the parsers + the plan; no requests
 *
 * Env: SITE_URL (default https://smartpanda.sg), EXPECTED_ENDPOINT,
 * EXPECTED_WHATSAPP, REAL_SUBMIT, FORM_ACCESS_KEY (fallback for the real submit).
 * Node 22, no dependencies.
 */
import assert from 'node:assert/strict'

/** Copy shown when the form or the contact details are not configured (content/en.ts, zh.ts). */
export const UNCONFIGURED = [
  'Form endpoint not configured',
  'Contact details to be confirmed',
  '表单接口尚未配置',
  '联系方式待确认',
]

/** Entry script and modulepreload chunks of a prerendered page, as absolute URLs. */
export function assetUrls(html, pageUrl) {
  const urls = [
    ...html.matchAll(/<script\b[^>]*\bsrc="([^"]+\.js)"/g),
    ...html.matchAll(/<link\b[^>]*\brel="modulepreload"[^>]*\bhref="([^"]+\.js)"/g),
  ].map((m) => new URL(m[1], pageUrl).href)
  return [...new Set(urls)]
}

/** Relative chunks a JS file imports (static or dynamic), as absolute URLs. */
export function importsOf(js, fileUrl) {
  const urls = [...js.matchAll(/(?:from\s*|import\s*\(\s*)["'`](\.{1,2}\/[^"'`]+\.js)["'`]/g)].map(
    (m) => new URL(m[1], fileUrl).href,
  )
  return [...new Set(urls)]
}

/** A VITE_* value as Vite inlines it: `{…,VITE_FORM_ENDPOINT:"https://…",…}`. */
export function envValue(js, key) {
  const m = new RegExp(`\\b${key}:\\s*(["'\`])([^"'\`]*)\\1`).exec(js)
  return m ? m[2] : null
}

/** Pass for a parsable answer from the service that is not a 5xx; fail on a 2xx that says success. */
export function judgeInvalidPost(status, body) {
  let json = null
  try {
    json = JSON.parse(body)
  } catch {
    /* not JSON */
  }
  if (status >= 500) return { ok: false, why: `HTTP ${status}` }
  if (status >= 200 && status < 300 && json?.success !== false) {
    return { ok: false, why: `HTTP ${status} accepted an invalid submission / 无效提交竟被接受: ${body.slice(0, 200)}` }
  }
  if (status >= 400 || json?.success === false) return { ok: true, why: `HTTP ${status} ${json?.message ?? ''}`.trim() }
  return { ok: false, why: `HTTP ${status}, unexpected body / 响应无法识别: ${body.slice(0, 200)}` }
}

function selfTest() {
  const html =
    '<script type="module" crossorigin src="/assets/index-A.js"></script>' +
    '<link rel="modulepreload" crossorigin href="/assets/site-B.js">' +
    '<link rel="stylesheet" href="/assets/index-C.css">'
  assert.deepEqual(assetUrls(html, 'https://x.sg/'), ['https://x.sg/assets/index-A.js', 'https://x.sg/assets/site-B.js'])
  assert.deepEqual(importsOf('import{a}from"./ui-D.js";const m=()=>import(`./Home-E.js`)', 'https://x.sg/assets/index-A.js'), [
    'https://x.sg/assets/ui-D.js',
    'https://x.sg/assets/Home-E.js',
  ])
  const bundle = 'let t={BASE_URL:`/`,VITE_FORM_ENDPOINT:`https://api.web3forms.com/submit`,VITE_WHATSAPP_NUMBER:"6580000000"}[e];i(`VITE_FORM_ACCESS_KEY`)'
  assert.equal(envValue(bundle, 'VITE_FORM_ENDPOINT'), 'https://api.web3forms.com/submit')
  assert.equal(envValue(bundle, 'VITE_WHATSAPP_NUMBER'), '6580000000')
  assert.equal(envValue(bundle, 'VITE_FORM_ACCESS_KEY'), null, 'a lookup call is not a value')
  assert.equal(envValue('Set VITE_FORM_ENDPOINT or VITE_CONTACT_EMAIL', 'VITE_FORM_ENDPOINT'), null)
  assert.equal(judgeInvalidPost(400, '{"success":false,"message":"Access key missing"}').ok, true)
  assert.equal(judgeInvalidPost(403, 'This method is not allowed').ok, true)
  assert.equal(judgeInvalidPost(200, '{"success":false}').ok, true)
  assert.equal(judgeInvalidPost(200, '{"success":true}').ok, false)
  assert.equal(judgeInvalidPost(502, 'Bad gateway').ok, false)
  console.log('check-form self-test ok')
}

const PLAN = `Live checks this script makes (none with --dry):
  GET  <site>/ and <site>/zh/            no "not configured" copy; endpoint readable from the JS
  GET  the page's JS chunks              read VITE_FORM_ENDPOINT (compare with EXPECTED_ENDPOINT)
  OPTIONS <endpoint>                     Origin <site>, Access-Control-Request-Method: POST → 2xx + allowed origin (4xx = warning)
  POST <endpoint>                        no access_key, honeypot filled → 4xx or success:false (cannot be delivered)
  POST <endpoint>                        REAL_SUBMIT=true only: one real "[Automated check]" email
  GET  <site>/showroom/                  200
  GET  <site>/__form-check-<n>/          404
  WhatsApp link on <site>/               when a number is configured`

/* ------------------------------------------------------------------------ */

const TIMEOUT = 20_000
const UA = { 'User-Agent': 'site-form-check/1.0 (+weekly uptime check)' }

async function get(url) {
  const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(TIMEOUT) })
  return { status: res.status, text: await res.text(), headers: res.headers }
}

async function main() {
  const site = (process.env.SITE_URL || 'https://smartpanda.sg').replace(/\/+$/, '')
  const origin = new URL(site).origin
  const expectedEndpoint = process.env.EXPECTED_ENDPOINT?.trim() || null
  const expectedWa = process.env.EXPECTED_WHATSAPP?.replace(/\D/g, '') || null
  const realSubmit = process.env.REAL_SUBMIT === 'true'
  const failures = []
  const pass = (msg) => console.log(`  ✓ ${msg}`)
  const fail = (zh, en) => {
    failures.push(`${zh} / ${en}`)
    console.log(`  ✗ ${zh} / ${en}`)
  }
  /** Runs one check; a network error (DNS, timeout, TLS) counts as a failure, not a crash. */
  const step = async (name, fn) => {
    console.log(`\n${name}`)
    try {
      await fn()
    } catch (error) {
      fail(`请求失败（DNS / 超时 / TLS）`, `request failed: ${error.cause?.code ?? error.name}: ${error.message}`)
    }
  }

  console.log(`Form check for ${site}${realSubmit ? ' (REAL_SUBMIT on)' : ''}`)
  let home = null
  let endpoint = null
  let bundle = ''

  await step('1. Live pages and bundle / 线上页面与产物', async () => {
    for (const path of ['/', '/zh/']) {
      const page = await get(site + path)
      if (path === '/') home = page
      if (page.status !== 200) fail(`${path} 返回 ${page.status}`, `${path} returned ${page.status}`)
      else pass(`${path} 200`)
      for (const text of UNCONFIGURED) {
        if (page.text.includes(text)) fail(`${path} 显示未配置文案 "${text}"`, `${path} shows the unconfigured notice "${text}"`)
      }
    }
    if (!home || home.status !== 200) return

    // The entry script and modulepreloads, then their imports, until the endpoint turns up.
    const queue = assetUrls(home.text, site + '/')
    const seen = new Set()
    while (queue.length && seen.size < 120) {
      const url = queue.shift()
      if (seen.has(url) || new URL(url).origin !== origin) continue
      seen.add(url)
      const js = (await get(url)).text
      bundle += js + '\n'
      if (envValue(js, 'VITE_FORM_ENDPOINT')) break
      queue.push(...importsOf(js, url))
    }
    endpoint = envValue(bundle, 'VITE_FORM_ENDPOINT')
    if (!endpoint) {
      fail(`在 ${seen.size} 个 JS 文件里找不到表单 endpoint（VITE_FORM_ENDPOINT 未内联）`, `no form endpoint in ${seen.size} JS files (VITE_FORM_ENDPOINT not inlined)`)
    } else if (expectedEndpoint && endpoint !== expectedEndpoint) {
      fail(`线上 endpoint 是 ${endpoint}，与仓库变量 ${expectedEndpoint} 不一致（变量改了但没重新部署？）`, `live endpoint ${endpoint} differs from the variable ${expectedEndpoint} (not redeployed?)`)
    } else {
      pass(`endpoint ${endpoint}${expectedEndpoint ? ' (matches VITE_FORM_ENDPOINT)' : ''}`)
    }
  })

  if (endpoint) {
    await step('2a. CORS preflight / 跨域预检', async () => {
      const res = await fetch(endpoint, {
        method: 'OPTIONS',
        headers: {
          ...UA,
          Origin: origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type',
        },
        signal: AbortSignal.timeout(TIMEOUT),
      })
      const allow = res.headers.get('access-control-allow-origin')
      // ponytail: a 4xx is only a warning. Web3Forms answered this non-browser
      // preflight with 403 on 2026-11-13 while browsers submit fine, so failing on
      // it would cry wolf every week. 2b still proves the service is up.
      if (res.status >= 400 && res.status < 500) {
        console.log(`  ! preflight ${res.status} from a non-browser client (warning only) / 非浏览器预检返回 ${res.status}（仅警告）`)
      } else if (res.status < 200 || res.status >= 300) fail(`预检返回 ${res.status}`, `preflight returned ${res.status}`)
      else if (allow !== '*' && allow !== origin) fail(`预检未放行 ${origin}（Access-Control-Allow-Origin: ${allow}）`, `preflight does not allow ${origin} (Access-Control-Allow-Origin: ${allow})`)
      else pass(`preflight ${res.status}, Access-Control-Allow-Origin: ${allow}`)
    })

    await step('2b. Invalid POST (cannot be delivered) / 故意无效的提交（不会投递）', async () => {
      // No access_key = no destination inbox. The honeypot fields are filled too
      // (`company` is the site's own, `botcheck` is Web3Forms').
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { ...UA, Origin: origin, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          subject: '[Automated check] invalid request, not an enquiry',
          name: 'Automated check',
          contact: 'automated-check@invalid',
          message: 'Deliberately invalid request from the weekly form check. It has no access key and must be rejected.',
          company: 'automated-check',
          botcheck: true,
        }),
        signal: AbortSignal.timeout(TIMEOUT),
      })
      const verdict = judgeInvalidPost(res.status, await res.text())
      if (verdict.ok) pass(`service answered: ${verdict.why}`)
      else fail(`表单服务异常：${verdict.why}`, `form service problem: ${verdict.why}`)
    })

    if (realSubmit) {
      await step('3. Real submission (sends one email) / 真实提交（会发一封邮件）', async () => {
        const key = envValue(bundle, 'VITE_FORM_ACCESS_KEY') || process.env.FORM_ACCESS_KEY?.trim()
        if (!key) return fail('线上产物和变量里都没有 access_key', 'no access_key in the live bundle or the variables')
        const host = new URL(site).host
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { ...UA, Origin: origin, Referer: `${site}/`, 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: key,
            subject: `[Automated check] Enquiry form OK — ${host}`,
            from_name: `${host} weekly check`,
            name: 'Automated check',
            contact: 'automated check, no reply needed',
            message: `This is the weekly automated check of the enquiry form on ${host}. No reply is needed. 这是每周一次的网站表单自动检查，无需回复。`,
            page: '/',
            language: 'en',
            submittedAt: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(TIMEOUT),
        })
        const body = await res.text()
        let json = null
        try {
          json = JSON.parse(body)
        } catch {
          /* not JSON */
        }
        if (res.ok && json?.success !== false) pass(`delivered: HTTP ${res.status}`)
        else fail(`真实提交失败：HTTP ${res.status} ${body.slice(0, 200)}`, `real submission failed: HTTP ${res.status}`)
      })
    }
  }

  await step('4. Other pages / 其他页面', async () => {
    const showroom = await get(`${site}/showroom/`)
    if (showroom.status === 200) pass('/showroom/ 200')
    else fail(`/showroom/ 返回 ${showroom.status}`, `/showroom/ returned ${showroom.status}`)

    const missing = `/__form-check-${Date.now()}/`
    const nf = await get(site + missing)
    if (nf.status === 404) pass(`${missing} 404`)
    else fail(`不存在的路径返回 ${nf.status}，应为 404`, `unknown path returned ${nf.status}, expected 404`)

    const wa = expectedWa || envValue(bundle, 'VITE_WHATSAPP_NUMBER')?.replace(/\D/g, '')
    if (!wa) console.log('  – no WhatsApp number configured, skipped / 未配置 WhatsApp，跳过')
    else if (home?.text.includes(`https://wa.me/${wa}`)) pass('WhatsApp link on the homepage')
    else fail('首页没有 WhatsApp 链接', `homepage has no https://wa.me/${wa} link`)
  })

  if (failures.length) {
    console.log(`\n${failures.length} check(s) failed / ${failures.length} 项检查失败:`)
    for (const line of failures) console.log(`  - ${line}`)
    if (process.env.GITHUB_ACTIONS) for (const line of failures) console.log(`::error::${line}`)
    process.exit(1)
  }
  console.log('\nAll checks passed / 全部通过')
}

if (process.argv.includes('--dry')) {
  selfTest()
  console.log(PLAN)
} else {
  await main()
}
