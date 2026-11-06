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
