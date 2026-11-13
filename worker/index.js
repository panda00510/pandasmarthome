// Sends every other hostname (the old workers.dev address, www) to the
// canonical one with a 301, so search engines move to the new domain and
// duplicates never get indexed. Everything else is served from ./dist.

// Pages whose address changed: old path -> new path (the /zh/ copy is derived).
const MOVED = {
  '/guides/home-assistant-vs-google-apple-smartthings/':
    '/guides/local-smart-home-vs-google-apple-smartthings/',
}

// Security headers on every served file. Set here rather than in
// public/_headers because with run_worker_first the response comes from this
// Worker, and _headers is not guaranteed to apply to Worker responses.
// CSP is deliberately left out for now (inline JSON-LD and the showroom).
const HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
}

// Fingerprinted build output (Vite adds an 8-character content hash, e.g.
// /assets/index-BwUq34Iy.js, /showroom/assets/map-Cdt_Hm5s.webp). A changed
// file gets a new name, so these can be cached forever. Set here as well as in
// public/_headers so it holds even if _headers is not applied to Worker
// responses; anything without a hash keeps the platform default.
const HASHED = /^\/(?:showroom\/)?assets\/[^/]+-[A-Za-z0-9_-]{8}\.[a-z0-9]+$/
const IMMUTABLE = 'public, max-age=31536000, immutable'

// Unknown pages get dist/[zh/]404.html (written by the prerender) with a 404
// status. Done here rather than with not_found_handling: "404-page", which
// would also answer a missing .js/.webp with HTML; files keep their bare 404.
// Navigations send Accept: text/html; curl and some bots send */*, so an
// address without a file extension counts as a page too.
const wantsPage = (request, url) =>
  (request.method === 'GET' || request.method === 'HEAD') &&
  ((request.headers.get('accept') ?? '').includes('text/html') || !/\.[a-z0-9]+$/i.test(url.pathname))

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const wrongHost = env.CANONICAL_HOST && url.hostname !== env.CANONICAL_HOST
    const zh = url.pathname.startsWith('/zh/')
    const path = zh ? url.pathname.slice(3) : url.pathname
    const moved = MOVED[path.endsWith('/') ? path : `${path}/`]
    if (wrongHost || moved) {
      if (wrongHost) {
        url.protocol = 'https:'
        url.hostname = env.CANONICAL_HOST
        url.port = ''
      }
      if (moved) url.pathname = (zh ? '/zh' : '') + moved
      return Response.redirect(url.toString(), 301)
    }
    let asset = await env.ASSETS.fetch(request)
    if (asset.status === 404 && wantsPage(request, url)) {
      // A branded page, still with a 404 status. "/404" not "/404.html":
      // html_handling (auto-trailing-slash) redirects the .html form.
      const page = await env.ASSETS.fetch(new Request(new URL(zh ? '/zh/404' : '/404', url), request))
      if (page.ok) asset = new Response(page.body, { status: 404, headers: page.headers })
    }
    const res = new Response(asset.body, asset)
    for (const [name, value] of Object.entries(HEADERS)) res.headers.set(name, value)
    if (res.ok && HASHED.test(url.pathname)) res.headers.set('Cache-Control', IMMUTABLE)
    return res
  },
}
