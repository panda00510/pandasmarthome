/**
 * Tell IndexNow search engines (Bing, Yandex, Naver, Seznam…) which pages
 * changed in this deploy, so they recrawl in minutes instead of days. Google
 * does not use IndexNow; it reads sitemap.xml.
 *
 * "Changed" = sitemap lastmod on or after the date of the previously deployed
 * commit (BEFORE_SHA, from github.event.before). Without it, every URL is sent.
 * Run after the Cloudflare deploy, from the repo root, against dist/.
 *
 * The key is public by design: engines verify it at /<key>.txt (in public/).
 */
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'

const KEY = '3bda083900f886a126076308efacb0f3'

const sitemap = await readFile('dist/sitemap.xml', 'utf8').catch(() => null)
if (!sitemap) {
  console.log('IndexNow: no sitemap (VITE_SITE_URL unset) — skipped')
  process.exit(0)
}

let since = ''
try {
  if (/^[0-9a-f]{40}$/.test(process.env.BEFORE_SHA ?? '') && !/^0+$/.test(process.env.BEFORE_SHA)) {
    since = execFileSync('git', ['log', '-1', '--format=%cs', process.env.BEFORE_SHA], { encoding: 'utf8' }).trim()
  }
} catch {
  // Unknown commit (force-push, shallow clone): fall back to sending everything.
}

const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)]
  .filter(([, , lastmod]) => lastmod >= since)
  .map(([, loc]) => loc)

if (!urls.length) {
  console.log(`IndexNow: nothing changed since ${since}`)
  process.exit(0)
}

const host = new URL(urls[0]).host
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key: KEY, keyLocation: `https://${host}/${KEY}.txt`, urlList: urls }),
})
console.log(`IndexNow: HTTP ${res.status} for ${urls.length} URL(s)\n${urls.join('\n')}`)
if (!res.ok) process.exitCode = 1
