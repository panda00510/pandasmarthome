/**
 * Per-page social cards (og:image / twitter:image).
 *
 * One table drives both sides: `npm run og` (scripts/make-og.mjs) renders each
 * card to public/og/<key>-<lang>.png, and the prerender and <Seo> point each
 * page at its card through `ogImageFor`. A page is matched by the first
 * segment of its path, so /solutions/smart-lighting/ shares the Solutions card
 * and every guide shares the Guides card. Anything unmatched — and the English
 * homepage — falls back to the default /og-image.png.
 *
 * Self-contained on purpose: make-og.mjs imports this file directly with
 * Node's type stripping, so it must not import anything else.
 *
 * The PNGs are generated on a Mac and committed (PingFang SC for Chinese);
 * CI never renders them. Edit a card here, run `npm run og`, check the image,
 * commit it.
 */

export type OgCard = {
  /** Small grey line above the headline. */
  eyebrow: string
  /** One or two headline lines; the second is drawn in bamboo green. */
  lines: string[]
  /** One or two subtitle lines. */
  sub: string[]
  /** og:image:alt. Omitted = the site-wide alt from the copy. */
  alt?: string
}

type Key =
  | 'home'
  | 'solutions'
  | 'homes'
  | 'products'
  | 'software'
  | 'custom-hardware'
  | 'signage'
  | 'showroom'
  | 'guides'
  | 'how-it-works'

export const OG_CARDS: Record<Key, { en?: OgCard; zh?: OgCard }> = {
  // English home keeps the hand-authored public/og-image.svg.
  home: {
    zh: {
      eyebrow: '开放式智能家居 · 新加坡',
      lines: ['真正听你的家，', '而不是听云端的。'],
      sub: ['不同品牌的灯光、空调、窗帘、门锁与摄像头，', '在一套属于你的本地系统上协同运作。'],
    },
  },
  solutions: {
    en: {
      eyebrow: 'SOLUTIONS',
      lines: ['What we design', 'and install'],
      sub: ['Lighting, aircon, curtains, locks, controls', 'and energy monitoring for Singapore homes.'],
      alt: 'Panda Smart Home — smart home solutions in Singapore',
    },
    zh: {
      eyebrow: '解决方案',
      lines: ['我们设计与', '安装的内容'],
      sub: ['智能灯光、空调控制、电动窗帘、门锁与安防、', '家居控制和用电监测。'],
      alt: 'Panda智能家居 — 新加坡智能家居解决方案',
    },
  },
  homes: {
    en: {
      eyebrow: 'YOUR HOME',
      lines: ['Smart home by', 'home type'],
      sub: ['Planning for BTO flats, HDB resale, condos', 'and landed houses in Singapore.'],
      alt: 'Panda Smart Home — smart home planning for HDB, BTO, condo and landed homes',
    },
    zh: {
      eyebrow: '住宅类型',
      lines: ['按住宅类型', '规划智能家居'],
      sub: ['BTO 组屋、转售和老房子、公寓与有地住宅。'],
      alt: 'Panda智能家居 — 按住宅类型规划智能家居',
    },
  },
  products: {
    en: {
      eyebrow: 'PRODUCTS',
      lines: ['Desk screen devices', '& smart home devices'],
      sub: ['Screen devices on pre-order, plus the devices', 'we supply and install as part of a plan.'],
      alt: 'Panda Smart Home — desk screen devices and smart home devices',
    },
    zh: {
      eyebrow: '产品',
      lines: ['桌面屏幕设备', '与智能家居设备'],
      sub: ['成品屏幕设备开放预订，', '以及我们随方案供货并安装的设备。'],
      alt: 'Panda智能家居 — 桌面屏幕设备与智能家居设备',
    },
  },
  software: {
    en: {
      eyebrow: 'SOFTWARE',
      lines: ['Custom software for', 'small businesses'],
      sub: ['Booking, inventory, WhatsApp bots and simple', 'internal tools for Singapore shops.'],
      alt: 'Panda Smart Home — custom software for small businesses in Singapore',
    },
    zh: {
      eyebrow: '软件',
      lines: ['软件系统定制'],
      sub: ['为新加坡小店和小生意做预约、库存、', 'WhatsApp 机器人和内部工具。'],
      alt: 'Panda智能家居 — 新加坡小生意软件系统定制',
    },
  },
  'custom-hardware': {
    en: {
      eyebrow: 'CUSTOM AI HARDWARE',
      lines: ['Custom ESP32 AI', '& IoT devices'],
      sub: ['Voice assistants, touch panels and sensors,', 'from idea to a working unit.'],
      alt: 'Panda Smart Home — custom ESP32 AI and IoT hardware in Singapore',
    },
    zh: {
      eyebrow: 'AI 硬件定制',
      lines: ['ESP32 AI', '硬件定制'],
      sub: ['AI 语音助手、触摸屏、传感器与继电器，', '从想法到能用的成品。'],
      alt: 'Panda智能家居 — 新加坡 ESP32 AI 硬件定制',
    },
  },
  signage: {
    en: {
      eyebrow: 'PANDA SIGNAGE',
      lines: ['Digital signage &', 'meeting room displays'],
      sub: ['For offices, schools, clinics and shops.', 'Self-hosted, plays offline.'],
      alt: 'Panda Signage — digital signage and meeting room displays in Singapore',
    },
    zh: {
      eyebrow: 'PANDA SIGNAGE 信息屏系统',
      lines: ['信息屏系统与', '会议室门牌'],
      sub: ['适合办公室、学校、诊所和零售餐饮。', '部署在你自己的服务器，断网可播。'],
      alt: 'Panda Signage — 新加坡信息屏系统与会议室门牌',
    },
  },
  showroom: {
    // The showroom is a separate build with one index.html, so English only.
    en: {
      eyebrow: '3D SHOWROOM',
      lines: ['Walk through a', 'smart HDB flat'],
      sub: ['Interactive 3-, 4- and 5-room layouts.', 'Try lights, curtains, aircon and locks.'],
      alt: 'Panda Smart Home — interactive 3D smart home showroom',
    },
  },
  guides: {
    en: {
      eyebrow: 'GUIDES',
      lines: ['Straight answers', 'before you buy'],
      sub: ['Practical smart home guides for HDB, condo', 'and landed homes in Singapore.'],
      alt: 'Panda Smart Home — smart home guides for Singapore homes',
    },
    zh: {
      eyebrow: '指南',
      lines: ['新加坡', '智能家居指南'],
      sub: ['布线、本地控制、设备选择与规划，', '面向 HDB、公寓和有地住宅。'],
      alt: 'Panda智能家居 — 新加坡智能家居指南',
    },
  },
  'how-it-works': {
    en: {
      eyebrow: 'HOW IT WORKS',
      lines: ['First conversation', 'to handover'],
      sub: ['A written plan before any device is bought.', 'Five steps, from survey to support.'],
      alt: 'Panda Smart Home — how we work, from first conversation to handover',
    },
    zh: {
      eyebrow: '服务流程',
      lines: ['从第一次沟通', '到正式交付'],
      sub: ['任何设备下单之前都有书面方案。', '从沟通、勘查到安装、交付和支持。'],
      alt: 'Panda智能家居 — 从第一次沟通到正式交付的服务流程',
    },
  },
}

/** Root-relative path of the card PNG for a key and language. */
export const ogImagePath = (key: string, lang: 'en' | 'zh') => `/og/${key}-${lang}.png`

/** The card for a page, or null to use the default /og-image.png. */
export function ogImageFor(lang: 'en' | 'zh', path: string): { src: string; alt?: string } | null {
  const key = (path.split('/')[0] || 'home') as Key
  const card = OG_CARDS[key]?.[lang]
  return card ? { src: ogImagePath(key, lang), alt: card.alt } : null
}
