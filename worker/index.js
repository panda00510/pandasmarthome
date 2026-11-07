// Sends every other hostname (the old workers.dev address, www) to the
// canonical one with a 301, so search engines move to the new domain and
// duplicates never get indexed. Everything else is served from ./dist.

// Pages whose address changed: old path -> new path (the /zh/ copy is derived).
const MOVED = {
  '/guides/home-assistant-vs-google-apple-smartthings/':
    '/guides/local-smart-home-vs-google-apple-smartthings/',
}

export default {
  fetch(request, env) {
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
    return env.ASSETS.fetch(request)
  },
}
