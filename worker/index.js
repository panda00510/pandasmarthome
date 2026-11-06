// Sends every other hostname (the old workers.dev address, www) to the
// canonical one with a 301, so search engines move to the new domain and
// duplicates never get indexed. Everything else is served from ./dist.
export default {
  fetch(request, env) {
    const url = new URL(request.url)
    if (env.CANONICAL_HOST && url.hostname !== env.CANONICAL_HOST) {
      url.protocol = 'https:'
      url.hostname = env.CANONICAL_HOST
      url.port = ''
      return Response.redirect(url.toString(), 301)
    }
    return env.ASSETS.fetch(request)
  },
}
