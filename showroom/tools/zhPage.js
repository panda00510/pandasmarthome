// 构建时多产出一份 dist/zh/index.html：中文 <html lang>、标题、描述和分享卡。
// 链接预览爬虫不跑 JS，只有单独的 /showroom/zh/ 地址才能拿到中文卡片。
// 页面本身与英文版完全相同（同一份 JS / CSS），只换 <head> 里的文字；
// <base href="../"> 让 ./assets/… 等相对路径仍按 /showroom/ 解析（根路径和 /pandasmarthome/ 镜像都成立）。
// onload="" 处理器原样保留 —— Worker 的 CSP 按哈希放行它（worker/index.test.mjs 会核对）。
//
// 文字来源（不新编）：标题 = src/i18n.js 的 zh.page_title；描述 = index.html 里 <main> 的中文段；
// 分享描述与 alt = src/config/ogImages.ts 的 showroom.zh；返回官网 / 预约 = i18n.js 的 back_site / cta_whatsapp。
const SITE = 'https://smartpanda.sg'
const TITLE = '3D 智能家居样板间 · HDB 组屋演示 | Panda 智能家居'
const DESC = '互动 3D 组屋样板间：可切换三房、四房、五房户型，体验灯光、窗帘、空调、门锁与一键场景。'
const OG_DESC = '三房、四房、五房户型互动切换，体验灯光、窗帘、空调与门锁。'
const OG_ALT = 'Panda智能家居 — 互动 3D 智能家居样板间'

const attr = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;')

export function toZh(html) {
  const swaps = [
    ['<html lang="en">', '<html lang="zh-Hans">'],
    ['<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <base href="../" />'],
    [/<title>[^<]*<\/title>/, `<title>${TITLE}</title>`],
    [/(<meta name="description" content=")[^"]*/, `$1${attr(DESC)}`],
    [/(<link rel="canonical" href=")[^"]*/, `$1${SITE}/showroom/zh/`],
    [/(<meta property="og:url" content=")[^"]*/, `$1${SITE}/showroom/zh/`],
    [/(<meta property="og:locale" content=")[^"]*/, '$1zh_SG'],
    [/(<meta property="og:locale:alternate" content=")[^"]*/, '$1en_SG'],
    [/(<meta (?:property="og|name="twitter):title" content=")[^"]*/g, `$1${attr(TITLE)}`],
    [/(<meta (?:property="og|name="twitter):description" content=")[^"]*/g, `$1${attr(OG_DESC)}`],
    [/(<meta (?:property="og|name="twitter):image" content=")[^"]*/g, `$1${SITE}/og/showroom-zh.png`],
    [/(<meta property="og:image:alt" content=")[^"]*/, `$1${attr(OG_ALT)}`],
    [`<a href="${SITE}/">Back to smartpanda.sg</a> · <a href="${SITE}/#contact">Book a free home assessment</a>`,
      `<a href="${SITE}/zh/">返回官网</a> · <a href="${SITE}/zh/#contact">预约免费上门评估</a>`],
  ]
  for (const [from, to] of swaps) {
    const next = html.replace(from, to)
    // 英文页改了结构却没改这里时，构建直接失败，而不是悄悄产出半英文的中文页
    if (next === html) throw new Error(`showroom zh page: pattern not found: ${from}`)
    html = next
  }
  return html
}

export default function zhPage() {
  return {
    name: 'showroom-zh-page',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const page = bundle['index.html']
      if (!page) throw new Error('showroom zh page: index.html not in bundle')
      this.emitFile({ type: 'asset', fileName: 'zh/index.html', source: toZh(String(page.source)) })
    },
  }
}
