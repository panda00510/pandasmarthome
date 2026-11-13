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
