import type { Lang } from '../../i18n/context'

/**
 * Drawings of the four desk devices.
 *
 * Studio-style vector renders: real proportions, matte plastic and glass
 * shading, a visible enclosure depth, a USB cable and a soft contact shadow, so
 * they read as hardware rather than icons. They are still illustrations of a
 * kind of device, not photographs and not a finished unit; the page labels each
 * one. Gradient ids are prefixed per figure (each figure appears once a page).
 */

const UI_DIM = '#8b939e'
const UI_TEXT = '#f4f5f2'
const GREEN = 'var(--color-bamboo-500)'
const AMBER = '#f5a524'

const GLYPH: Record<string, string[]> = {
  '0': ['111', '101', '101', '101', '111'],
  '1': ['010', '110', '010', '010', '111'],
  '2': ['111', '001', '111', '100', '111'],
  '3': ['111', '001', '111', '001', '111'],
  '4': ['101', '101', '111', '001', '001'],
  '5': ['111', '100', '111', '001', '111'],
  '6': ['111', '100', '111', '101', '111'],
  '7': ['111', '001', '001', '001', '001'],
  '8': ['111', '101', '111', '101', '111'],
  '9': ['111', '101', '111', '001', '111'],
  ':': ['0', '1', '0', '1', '0'],
}

/** 5×5 sun, lit cells as "row,col" inside the glyph. */
const SUN = ['0,2', '1,1', '1,2', '1,3', '2,0', '2,1', '2,2', '2,3', '2,4', '3,1', '3,2', '3,3', '4,2']

function stamp(text: string, col: number, row: number, on: Map<string, 'time' | 'sun'>, kind: 'time' | 'sun') {
  let x = col
  for (const ch of text) {
    const glyph = GLYPH[ch]
    if (!glyph) continue
    glyph.forEach((line, y) => {
      ;[...line].forEach((bit, dx) => {
        if (bit === '1') on.set(`${row + y},${x + dx}`, kind)
      })
    })
    x += glyph[0].length + 1
  }
}

/** Shared material gradients and the blurred contact shadow, under one id prefix. */
function Materials({ p }: { p: string }) {
  return (
    <defs>
      <linearGradient id={`${p}-shell`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.55" stopColor="#f1f1ee" />
        <stop offset="1" stopColor="#dcdcd7" />
      </linearGradient>
      <linearGradient id={`${p}-side`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#d6d6d0" />
        <stop offset="1" stopColor="#b9bab3" />
      </linearGradient>
      <linearGradient id={`${p}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.13" />
        <stop offset="0.38" stopColor="#ffffff" stopOpacity="0.03" />
        <stop offset="0.39" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${p}-metal`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c9cbcd" />
        <stop offset="0.5" stopColor="#eef0f1" />
        <stop offset="1" stopColor="#a9acaf" />
      </linearGradient>
      <radialGradient id={`${p}-shadow`}>
        <stop offset="0" stopColor="#11151a" stopOpacity="0.32" />
        <stop offset="0.6" stopColor="#11151a" stopOpacity="0.1" />
        <stop offset="1" stopColor="#11151a" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

function Cable({ d }: { d: string }) {
  return (
    <>
      <path d={d} stroke="#3a3f46" strokeWidth="4.2" fill="none" strokeLinecap="round" />
      <path d={d} stroke="#5d636b" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" transform="translate(-0.6 -1)" />
    </>
  )
}

export function ProductArt({ id, lang }: { id: string; lang: Lang }) {
  if (id === 'panel') return <PanelArt lang={lang} />
  if (id === 'pixel') return <PixelArt />
  if (id === 'weather') return <WeatherArt lang={lang} />
  return <VoiceArt lang={lang} />
}

/** Small speaker box with a square LCD (Xiaozhi-style face), mic holes and a grille. */
function VoiceArt({ lang }: { lang: Lang }) {
  const p = 'pv'
  const listening = lang === 'zh' ? '聆听中…' : 'Listening…'
  const holes = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 7; c++) {
      holes.push(<circle key={`${r}-${c}`} cx={102 + c * 6} cy={122 + r * 6} r="1.5" fill="#9a9b95" />)
    }
  }
  return (
    <svg viewBox="0 0 240 180" className="h-full w-full" aria-hidden="true">
      <Materials p={p} />
      <ellipse cx="124" cy="160" rx="66" ry="9" fill={`url(#${p}-shadow)`} />
      <Cable d="M150 150 C168 158 190 160 214 152" />
      {/* depth, then front shell */}
      <rect x="84" y="24" width="88" height="130" rx="20" fill={`url(#${p}-side)`} />
      <rect x="76" y="20" width="88" height="132" rx="20" fill={`url(#${p}-shell)`} stroke="#c8c8c2" strokeWidth="0.8" />
      <rect x="77.5" y="21.5" width="85" height="129" rx="18.5" fill="none" stroke="#fff" strokeWidth="1" opacity="0.9" />
      {/* mic holes on the top edge */}
      <circle cx="112" cy="27" r="1.1" fill="#7d7e78" />
      <circle cx="128" cy="27" r="1.1" fill="#7d7e78" />
      {/* screen */}
      <rect x="88" y="36" width="64" height="64" rx="9" fill="#0f1215" />
      <rect x="92" y="40" width="56" height="56" rx="5" fill="#06080a" />
      <text x="120" y="51" fill={UI_DIM} fontSize="6" fontFamily="inherit" textAnchor="middle">
        {listening}
      </text>
      <rect x="104" y="60" width="9" height="13" rx="4.5" fill="#d9f2e4" />
      <rect x="127" y="60" width="9" height="13" rx="4.5" fill="#d9f2e4" />
      <path d="M111 79 q9 5 18 0" stroke="#d9f2e4" strokeWidth="2" fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={110 + i * 4.4} y={93 - [2, 4, 6, 3, 2][i]} width="2.2" height={[2, 4, 6, 3, 2][i]} rx="1" fill={GREEN} />
      ))}
      <rect x="88" y="36" width="64" height="64" rx="9" fill={`url(#${p}-glass)`} />
      {/* speaker grille and status LED */}
      {holes}
      <circle cx="120" cy="113" r="1.3" fill={GREEN} />
    </svg>
  )
}

/** 5-inch class touch panel on an aluminium desk stand, showing NEA and LTA cards. */
function PanelArt({ lang }: { lang: Lang }) {
  const p = 'pp'
  const bus = lang === 'zh' ? '巴士' : 'Bus'
  const mins = lang === 'zh' ? '4 分钟' : '4 min'
  const next = lang === 'zh' ? '下一班 11 分钟' : 'Next 11 min'
  const weather = lang === 'zh' ? '局部多云' : 'Partly cloudy'
  return (
    <svg viewBox="0 0 280 200" className="h-full w-full" aria-hidden="true">
      <Materials p={p} />
      <ellipse cx="142" cy="184" rx="96" ry="9" fill={`url(#${p}-shadow)`} />
      {/* stand: back leg and base plate */}
      <path d="M124 140 L112 176 H170 L158 140 Z" fill={`url(#${p}-metal)`} stroke="#9a9da1" strokeWidth="0.6" />
      <rect x="92" y="174" width="98" height="7" rx="3.5" fill={`url(#${p}-metal)`} stroke="#9a9da1" strokeWidth="0.6" />
      <Cable d="M150 178 C176 186 214 186 246 176" />
      {/* device body with a sliver of depth */}
      <rect x="40" y="22" width="204" height="130" rx="11" fill="#2b3038" />
      <rect x="36" y="18" width="204" height="130" rx="11" fill="#14171c" stroke="#3a4049" strokeWidth="0.8" />
      <rect x="45" y="27" width="186" height="112" rx="4" fill="#0a0c0f" />
      {/* status bar */}
      <circle cx="54" cy="36" r="2.4" fill={GREEN} />
      <text x="60" y="38.5" fill={UI_DIM} fontSize="7" fontFamily="inherit">
        Home Assistant
      </text>
      <text x="222" y="38.5" fill={UI_TEXT} fontSize="7.5" fontFamily="inherit" fontWeight="600" textAnchor="end">
        08:30
      </text>
      {/* NEA card */}
      <rect x="52" y="46" width="84" height="86" rx="7" fill="#1a1e24" />
      <circle cx="70" cy="66" r="7" fill={AMBER} />
      <path d="M66 74 a6 6 0 0 1 6-6 a8 8 0 0 1 15 2 a5 5 0 0 1 0 10 h-17 a5 5 0 0 1-4-6 z" fill="#e8ebee" />
      <text x="60" y="104" fill={UI_TEXT} fontSize="21" fontFamily="inherit" fontWeight="600">
        31°
      </text>
      <text x="60" y="116" fill={UI_DIM} fontSize="7" fontFamily="inherit">
        {weather}
      </text>
      <text x="60" y="126" fill={UI_DIM} fontSize="6.5" fontFamily="inherit" opacity="0.8">
        NEA
      </text>
      {/* LTA card */}
      <rect x="142" y="46" width="82" height="86" rx="7" fill="#1a1e24" />
      <text x="150" y="64" fill={UI_TEXT} fontSize="11" fontFamily="inherit" fontWeight="600">
        {bus}
      </text>
      <text x="150" y="92" fill={GREEN} fontSize="17" fontFamily="inherit" fontWeight="600">
        {mins}
      </text>
      <text x="150" y="106" fill={UI_DIM} fontSize="7" fontFamily="inherit">
        {next}
      </text>
      <text x="150" y="126" fill={UI_DIM} fontSize="6.5" fontFamily="inherit" opacity="0.8">
        LTA
      </text>
      <rect x="45" y="27" width="186" height="112" rx="4" fill={`url(#${p}-glass)`} />
    </svg>
  )
}

/** AWTRIX-style 32×8 LED clock: white case, smoked diffuser, lit LEDs with glow. */
function PixelArt() {
  const p = 'px'
  const cols = 32
  const rows = 8
  const cell = 5.4
  const gap = 1.8
  const step = cell + gap
  const on = new Map<string, 'time' | 'sun'>()
  stamp('08:30', 3, 1, on, 'time')
  for (const cellId of SUN) {
    const [y, x] = cellId.split(',').map(Number)
    on.set(`${1 + y},${23 + x}`, 'sun')
  }
  const gridW = cols * cell + (cols - 1) * gap
  const gridH = rows * cell + (rows - 1) * gap
  const ox = (320 - gridW) / 2
  const oy = 58
  const lit = []
  const dark = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const kind = on.get(`${y},${x}`)
      const r = { x: ox + x * step, y: oy + y * step, width: cell, height: cell, rx: 1 }
      if (kind) lit.push(<rect key={`${x}-${y}`} {...r} fill={kind === 'sun' ? AMBER : '#fff4e2'} />)
      else dark.push(<rect key={`${x}-${y}`} {...r} fill="#20242a" />)
    }
  }
  const caseX = ox - 18
  const caseY = oy - 16
  const caseW = gridW + 36
  const caseH = gridH + 32
  return (
    <svg viewBox="0 0 320 160" className="h-full w-full" aria-hidden="true">
      <Materials p={p} />
      <defs>
        <filter id={`${p}-glow`} x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="164" cy={caseY + caseH + 8} rx="140" ry="9" fill={`url(#${p}-shadow)`} />
      <Cable d={`M${caseX + caseW - 6} ${caseY + caseH - 4} C${caseX + caseW + 10} ${caseY + caseH + 10} 300 ${caseY + caseH + 10} 316 ${caseY + caseH + 4}`} />
      {/* three buttons on top */}
      {[-18, 0, 18].map((dx) => (
        <rect key={dx} x={160 + dx - 6} y={caseY - 3} width="12" height="5" rx="2" fill="#d4d4ce" stroke="#bdbdb6" strokeWidth="0.5" />
      ))}
      {/* depth, shell, smoked front */}
      <rect x={caseX + 5} y={caseY + 4} width={caseW} height={caseH} rx="10" fill={`url(#${p}-side)`} />
      <rect x={caseX} y={caseY} width={caseW} height={caseH} rx="10" fill={`url(#${p}-shell)`} stroke="#c8c8c2" strokeWidth="0.8" />
      <rect x={ox - 8} y={oy - 8} width={gridW + 16} height={gridH + 16} rx="4" fill="#0c0e11" />
      {dark}
      <g filter={`url(#${p}-glow)`}>{lit}</g>
      <rect x={ox - 8} y={oy - 8} width={gridW + 16} height={gridH + 16} rx="4" fill={`url(#${p}-glass)`} />
    </svg>
  )
}

/** Small cube with a square colour screen: time, date, NEA weather and a week strip. */
function WeatherArt({ lang }: { lang: Lang }) {
  const p = 'pw'
  const date = lang === 'zh' ? '11月11日 周二' : 'Tue 11 Nov'
  const days = lang === 'zh' ? ['一', '二', '三', '四', '五'] : ['M', 'T', 'W', 'T', 'F']
  return (
    <svg viewBox="0 0 240 180" className="h-full w-full" aria-hidden="true">
      <Materials p={p} />
      <defs>
        <linearGradient id={`${p}-screen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14263b" />
          <stop offset="1" stopColor="#0a1220" />
        </linearGradient>
      </defs>
      <ellipse cx="124" cy="162" rx="72" ry="9" fill={`url(#${p}-shadow)`} />
      <Cable d="M168 150 C184 158 204 160 226 152" />
      {/* top face and right side give the cube its depth */}
      <path d="M62 30 L74 18 H190 L178 30 Z" fill="#fbfbf9" stroke="#d2d2cc" strokeWidth="0.6" />
      <path d="M178 30 L190 18 V142 L178 154 Z" fill={`url(#${p}-side)`} />
      <rect x="62" y="30" width="116" height="124" rx="3" fill={`url(#${p}-shell)`} stroke="#c8c8c2" strokeWidth="0.8" />
      {/* screen */}
      <rect x="72" y="40" width="96" height="96" rx="5" fill="#0d1014" />
      <rect x="76" y="44" width="88" height="88" rx="2" fill={`url(#${p}-screen)`} />
      <text x="83" y="70" fill={UI_TEXT} fontSize="22" fontFamily="inherit" fontWeight="600">
        08:30
      </text>
      <text x="84" y="82" fill={UI_DIM} fontSize="7" fontFamily="inherit">
        {date}
      </text>
      <circle cx="90" cy="100" r="6" fill={AMBER} />
      <path d="M86 106 a5 5 0 0 1 5-5 a6.5 6.5 0 0 1 12 1.5 a4 4 0 0 1 0 8 h-14 a4 4 0 0 1-3-4.5 z" fill="#e8ebee" />
      <text x="110" y="106" fill={UI_TEXT} fontSize="12" fontFamily="inherit" fontWeight="600">
        31°
      </text>
      <text x="136" y="106" fill={UI_DIM} fontSize="6.5" fontFamily="inherit">
        NEA
      </text>
      {days.map((d, i) => (
        <g key={i}>
          <rect x={83 + i * 15} y="115" width="12" height="11" rx="2" fill={i === 1 ? GREEN : '#1d3048'} />
          <text x={89 + i * 15} y="123" fill={i === 1 ? '#fff' : UI_DIM} fontSize="6" fontFamily="inherit" textAnchor="middle">
            {d}
          </text>
        </g>
      ))}
      <rect x="72" y="40" width="96" height="96" rx="5" fill={`url(#${p}-glass)`} />
    </svg>
  )
}
