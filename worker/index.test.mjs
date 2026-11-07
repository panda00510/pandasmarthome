import assert from 'node:assert/strict'
import worker from './index.js'

const env = { CANONICAL_HOST: 'smartpanda.sg', ASSETS: { fetch: () => new Response('asset') } }
const get = (url) => worker.fetch(new Request(url), env)

const moved = await get('https://pandasmarthome.xunleix8.workers.dev/zh/guides/x/?a=1')
assert.equal(moved.status, 301)
assert.equal(moved.headers.get('location'), 'https://smartpanda.sg/zh/guides/x/?a=1')

assert.equal((await get('https://www.smartpanda.sg/')).status, 301)
assert.equal(await (await get('https://smartpanda.sg/')).text(), 'asset')
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
