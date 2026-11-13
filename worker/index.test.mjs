import assert from 'node:assert/strict'
import worker from './index.js'

const env = { CANONICAL_HOST: 'smartpanda.sg', ASSETS: { fetch: () => new Response('asset') } }
const get = (url) => worker.fetch(new Request(url), env)

const moved = await get('https://pandasmarthome.xunleix8.workers.dev/zh/guides/x/?a=1')
assert.equal(moved.status, 301)
assert.equal(moved.headers.get('location'), 'https://smartpanda.sg/zh/guides/x/?a=1')

assert.equal((await get('https://www.smartpanda.sg/')).status, 301)
const home = await get('https://smartpanda.sg/')
assert.equal(await home.text(), 'asset')
assert.equal(home.headers.get('x-content-type-options'), 'nosniff')
assert.match(home.headers.get('strict-transport-security'), /max-age=\d+/)
assert.ok(home.headers.get('referrer-policy'))
assert.ok(home.headers.get('permissions-policy'))
console.log('worker ok')

const old = '/guides/home-assistant-vs-google-apple-smartthings/'
const neu = '/guides/local-smart-home-vs-google-apple-smartthings/'
for (const [from, to] of [
  [`https://smartpanda.sg${old}`, `https://smartpanda.sg${neu}`],
  [`https://smartpanda.sg/zh${old}`, `https://smartpanda.sg/zh${neu}`],
  [`https://smartpanda.sg${old.slice(0, -1)}`, `https://smartpanda.sg${neu}`],
  [`https://www.smartpanda.sg/zh${old}`, `https://smartpanda.sg/zh${neu}`],
]) {
  const res = await get(from)
  assert.equal(res.status, 301, from)
  assert.equal(res.headers.get('location'), to, from)
}
assert.equal((await get(`https://smartpanda.sg${neu}`)).status, 200)
console.log('moved pages ok')

// Fingerprinted assets (site and showroom) are cached forever; everything else is not.
for (const path of ['/assets/index-BwUq34Iy.js', '/showroom/assets/map-Cdt_Hm5s.webp', '/showroom/assets/studio_small_09_256-EdhX6uNv.hdr']) {
  assert.equal((await get(`https://smartpanda.sg${path}`)).headers.get('cache-control'), 'public, max-age=31536000, immutable', path)
}
for (const path of ['/', '/showroom/', '/showroom/index.html', '/showroom/favicon.svg', '/assets/logo.svg']) {
  assert.equal((await get(`https://smartpanda.sg${path}`)).headers.get('cache-control'), null, path)
}
const missing = await worker.fetch(new Request('https://smartpanda.sg/showroom/assets/gone-AAAAAAAA.js'), { ...env, ASSETS: { fetch: () => new Response('nope', { status: 404 }) } })
assert.equal(missing.headers.get('cache-control'), null)
console.log('cache headers ok')

// Unknown pages: branded 404 page in the right language, status stays 404. Files keep a bare 404.
const sitePages = {
  '/404': '<html lang="en">not found</html>',
  '/zh/404': '<html lang="zh-Hans">找不到</html>',
}
const siteEnv = {
  ...env,
  ASSETS: {
    fetch: (req) => {
      const body = sitePages[new URL(req.url).pathname]
      return body
        ? new Response(body, { headers: { 'content-type': 'text/html; charset=utf-8' } })
        : new Response(null, { status: 404 })
    },
  },
}
const page = (url, accept = 'text/html,application/xhtml+xml') =>
  worker.fetch(new Request(url, { headers: { accept } }), siteEnv)
const unknown = await page('https://smartpanda.sg/no-such-page/')
assert.equal(unknown.status, 404)
assert.match(unknown.headers.get('content-type'), /text\/html/)
assert.match(await unknown.text(), /lang="en"/)
assert.equal(unknown.headers.get('x-content-type-options'), 'nosniff')
const unknownZh = await page('https://smartpanda.sg/zh/no-such-page')
assert.equal(unknownZh.status, 404)
assert.match(await unknownZh.text(), /找不到/)
const curl = await page('https://smartpanda.sg/no-such-page', '*/*')
assert.equal(curl.status, 404)
assert.match(await curl.text(), /not found/)
for (const path of ['/assets/gone-AAAAAAAA.js', '/missing.webp', '/zh/missing.png']) {
  const res = await page(`https://smartpanda.sg${path}`, '*/*')
  assert.equal(res.status, 404, path)
  assert.equal(await res.text(), '', path)
}
console.log('404 page ok')
