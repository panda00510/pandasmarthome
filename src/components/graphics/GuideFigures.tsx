import type { ReactNode } from 'react'
import type { Lang } from '../../i18n/context'

/**
 * Explanatory figures for the longest guides. Each one draws the idea the
 * text describes: a route through a home, a comparison, a measure-and-adjust
 * loop. They are diagrams, not photographs, and carry a text alternative.
 */
const INK = 'var(--color-ink-300)'
const GREEN = 'var(--color-bamboo-500)'

const wrap = (label: string, children: ReactNode) => (
  <figure className="my-8 rounded-card border border-ink-200 bg-white p-4 sm:p-6">
    <div role="img" aria-label={label}>
      {children}
    </div>
    <figcaption className="mt-3 text-sm text-ink-600">{label}</figcaption>
  </figure>
)

/** Bedroom to bathroom at night: where the sensors and the night light sit. */
function ElderlyFigure({ lang }: { lang: Lang }) {
  const zh = lang === 'zh'
  const L = zh
    ? { bed: '卧室', bath: '浴室', hall: '走廊', light: '夜灯', door: '门磁', motion: '人体传感器', button: '呼叫按钮', cap: '示意图：夜间从床边到浴室的路线，以及可以放传感器的位置。' }
    : { bed: 'Bedroom', bath: 'Bathroom', hall: 'Hall', light: 'Night light', door: 'Door sensor', motion: 'Motion sensor', button: 'Call button', cap: 'Illustration: the night-time route from bed to bathroom, and where sensors can go.' }
  return wrap(
    L.cap,
    <svg viewBox="0 0 560 190" className="h-auto w-full" aria-hidden="true">
      <rect x="10" y="20" width="170" height="150" rx="10" fill="var(--color-ink-50)" stroke={INK} />
      <rect x="195" y="60" width="170" height="70" rx="10" fill="var(--color-ink-50)" stroke={INK} />
      <rect x="380" y="20" width="170" height="150" rx="10" fill="var(--color-ink-50)" stroke={INK} />
      <text x="24" y="42" fontSize="13" fill="var(--color-ink-600)">{L.bed}</text>
      <text x="209" y="80" fontSize="13" fill="var(--color-ink-600)">{L.hall}</text>
      <text x="394" y="42" fontSize="13" fill="var(--color-ink-600)">{L.bath}</text>
      <path d="M95 120H470" stroke={GREEN} strokeWidth="2.5" strokeDasharray="6 6" fill="none" />
      <path d="M462 113l10 7-10 7" stroke={GREEN} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[[110, 120, L.light], [190, 100, L.door], [285, 120, L.motion], [480, 80, L.button]].map(([x, y, label]) => (
        <g key={String(label)}>
          <circle cx={Number(x)} cy={Number(y)} r="9" fill={GREEN} />
          <text x={Number(x)} y={Number(y) + 30} textAnchor="middle" fontSize="12" fill="var(--color-ink-700)">{String(label)}</text>
        </g>
      ))}
    </svg>,
  )
}

/** Four platform types compared on what matters at home. */
function PlatformFigure({ lang }: { lang: Lang }) {
  const zh = lang === 'zh'
  const cols = zh
    ? ['运行在哪里', '断网时', '适合谁', '维护']
    : ['Where it runs', 'Without internet', 'Suits', 'Upkeep']
  const rows = zh
    ? [
        ['Google Home', ['大量功能走云端', '取决于具体功能', '想快速上手的家庭', '很少']],
        ['Apple Home', ['需要家里有家庭中枢', '中枢在家时部分可用', '全家用 iPhone 的家庭', '很少']],
        ['SmartThings', ['部分在主机，部分在云端', '取决于设备和规则', '三星设备较多的家庭', '中等']],
        ['本地开源平台', ['你家里的主机', '本地控制的设备照常工作', '想要稳定和隐私的家庭', '需要安装和维护']],
      ]
    : [
        ['Google Home', ['Many features use the cloud', 'Depends on the feature', 'Quick start for most homes', 'Low']],
        ['Apple Home', ['Needs a home hub in the house', 'Partly works with the hub at home', 'Homes that all use iPhone', 'Low']],
        ['SmartThings', ['Some on its hub, some in the cloud', 'Depends on device and rule', 'Homes with many Samsung devices', 'Medium']],
        ['Local open-source platform', ['A controller in your home', 'Locally controlled devices keep working', 'Homes that want resilience and privacy', 'Needs setup and care']],
      ]
  const caption = zh ? '对比：四类平台。功能经常变化，请以厂商当前说明为准。' : 'Comparison of four platform types. Features change, so check each vendor’s current documentation.'
  return (
    <figure className="my-8">
      <div role="group" aria-label={caption} className="grid gap-3 sm:grid-cols-2">
        {rows.map(([name, cells]) => (
          <div key={String(name)} className="rounded-card border border-ink-200 bg-white p-4">
            <p className="text-[1rem] font-semibold text-ink-950">{String(name)}</p>
            <dl className="mt-2 space-y-1.5">
              {cols.map((col, i) => (
                <div key={col} className="grid grid-cols-[6.5rem_1fr] gap-2 text-sm leading-snug">
                  <dt className="text-ink-500">{col}</dt>
                  <dd className="text-ink-800">{(cells as string[])[i]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-sm text-ink-600">{caption}</figcaption>
    </figure>
  )
}

/** Measure, set a rule, look at the result, adjust. */
function AirconFigure({ lang }: { lang: Lang }) {
  const zh = lang === 'zh'
  const steps = zh
    ? [['测量', '先看哪台冷气在什么时候运行'], ['规则', '房间没人或窗户打开就关'], ['反馈', '一两周后看数据，再调整规则']]
    : [['Measure', 'See which unit runs, and when'], ['Rule', 'Switch off when the room is empty or a window is open'], ['Feedback', 'Check the data after a week or two, then adjust']]
  const caption = zh ? '示意图：测量、规则、反馈，循环调整。' : 'Illustration: measure, set a rule, check the result, adjust.'
  return (
    <figure className="my-8">
      <ol role="group" aria-label={caption} className="grid gap-3 sm:grid-cols-3">
        {steps.map(([title, body], i) => (
          <li key={title} className="relative rounded-card border border-ink-200 bg-white p-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">{i + 1}</span>
            <p className="mt-3 text-[1rem] font-semibold text-ink-950">{title}</p>
            <p className="mt-1 text-sm leading-snug text-ink-600">{body}</p>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-sm text-ink-600">{caption}</figcaption>
    </figure>
  )
}

const FIGURES: Record<string, (props: { lang: Lang }) => ReactNode> = {
  'smart-home-for-elderly-parents': ElderlyFigure,
  'local-smart-home-vs-google-apple-smartthings': PlatformFigure,
  'reduce-aircon-electricity-smart-home': AirconFigure,
}

export function GuideFigure({ slug, lang }: { slug: string; lang: Lang }) {
  const Figure = FIGURES[slug]
  return Figure ? <Figure lang={lang} /> : null
}
