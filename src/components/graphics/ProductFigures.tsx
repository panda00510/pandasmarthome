import type { Lang } from '../../i18n/context'

/**
 * Schematic drawings of the four desk devices.
 *
 * Flat shapes and a visible dot grid, in the same ink-and-bamboo line as the
 * rest of the site. They are illustrations of a kind of device, not photographs
 * and not a rendering of a finished unit. The page labels each one.
 */

const INK = 'var(--color-ink-300)'
const INK_SOFT = 'var(--color-ink-200)'
const GREEN = 'var(--color-bamboo-500)'
const SCREEN = 'var(--color-ink-950)'
const PAPER = 'var(--color-paper)'
const EMBER = 'var(--color-ember-400)'

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

export function ProductArt({ id, lang }: { id: string; lang: Lang }) {
  if (id === 'panel') return <PanelArt lang={lang} />
  if (id === 'pixel') return <PixelArt />
  if (id === 'weather') return <WeatherArt lang={lang} />
  return <VoiceArt />
}

function VoiceArt() {
  return (
    <svg viewBox="0 0 240 180" className="h-full w-full" aria-hidden="true">
      <ellipse cx="120" cy="164" rx="52" ry="6" fill="var(--color-ink-950)" opacity="0.08" />
      <rect x="78" y="18" width="84" height="136" rx="26" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <rect x="90" y="32" width="60" height="78" rx="14" fill={SCREEN} />
      <circle cx="106" cy="62" r="5" fill={PAPER} />
      <circle cx="134" cy="62" r="5" fill={PAPER} />
      <path d="M104 80q16 14 32 0" stroke={GREEN} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <rect x="110" y="128" width="20" height="7" rx="2.5" fill="none" stroke={INK} />
      <path d="M176 58c10 8 10 24 0 32" stroke={GREEN} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M184 50c16 12 16 36 0 48" stroke={GREEN} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function PanelArt({ lang }: { lang: Lang }) {
  const bus = lang === 'zh' ? '巴士' : 'Bus'
  const mins = lang === 'zh' ? '4 分钟' : '4 min'
  return (
    <svg viewBox="0 0 280 200" className="h-full w-full" aria-hidden="true">
      <ellipse cx="140" cy="186" rx="78" ry="6" fill="var(--color-ink-950)" opacity="0.08" />
      <path d="M92 150 L78 176 H202 L188 150" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <rect x="36" y="22" width="208" height="132" rx="14" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <rect x="48" y="34" width="184" height="108" rx="6" fill={SCREEN} />
      <circle cx="58" cy="48" r="3" fill={GREEN} />
      <rect x="68" y="45" width="36" height="6" rx="3" fill={PAPER} opacity="0.9" />
      <rect x="56" y="62" width="78" height="70" rx="6" fill="#171b21" />
      <circle cx="78" cy="86" r="9" fill={EMBER} />
      <text x="94" y="91" fill={PAPER} fontSize="16" fontFamily="inherit" fontWeight="650">
        31°
      </text>
      <text x="66" y="116" fill="var(--color-ink-400)" fontSize="9" fontFamily="inherit">
        NEA
      </text>
      <rect x="144" y="62" width="78" height="70" rx="6" fill="#171b21" />
      <text x="154" y="86" fill={PAPER} fontSize="13" fontFamily="inherit" fontWeight="650">
        {bus}
      </text>
      <text x="154" y="108" fill={GREEN} fontSize="12" fontFamily="inherit" fontWeight="650">
        {mins}
      </text>
      <text x="154" y="124" fill="var(--color-ink-400)" fontSize="9" fontFamily="inherit">
        LTA
      </text>
    </svg>
  )
}

function PixelArt() {
  const cols = 32
  const rows = 8
  const cell = 6
  const gap = 2
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
  const oy = 46
  const dots = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const kind = on.get(`${y},${x}`)
      dots.push(
        <rect
          key={`${x}-${y}`}
          x={ox + x * step}
          y={oy + y * step}
          width={cell}
          height={cell}
          rx="1.2"
          fill={kind === 'sun' ? EMBER : kind === 'time' ? PAPER : '#2a2f38'}
        />,
      )
    }
  }
  return (
    <svg viewBox="0 0 320 160" className="h-full w-full" aria-hidden="true">
      <ellipse cx="160" cy="146" rx="110" ry="6" fill="var(--color-ink-950)" opacity="0.08" />
      <rect
        x={ox - 14}
        y={oy - 14}
        width={gridW + 28}
        height={gridH + 28}
        rx="12"
        fill={SCREEN}
        stroke={INK}
        strokeWidth="1.5"
      />
      {dots}
    </svg>
  )
}

function WeatherArt({ lang }: { lang: Lang }) {
  const date = lang === 'zh' ? '11月11日' : '11 Nov'
  return (
    <svg viewBox="0 0 240 180" className="h-full w-full" aria-hidden="true">
      <ellipse cx="120" cy="166" rx="64" ry="6" fill="var(--color-ink-950)" opacity="0.08" />
      <path d="M86 148 L74 164 H166 L154 148" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <rect x="48" y="18" width="144" height="132" rx="16" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <rect x="60" y="30" width="120" height="96" rx="8" fill="#fff" stroke={INK_SOFT} />
      <text x="72" y="64" fill="var(--color-ink-950)" fontSize="26" fontFamily="inherit" fontWeight="650">
        08:30
      </text>
      <text x="72" y="82" fill="var(--color-ink-500)" fontSize="10" fontFamily="inherit">
        {date}
      </text>
      <circle cx="82" cy="104" r="7" fill={EMBER} />
      <text x="96" y="108" fill="var(--color-ink-800)" fontSize="12" fontFamily="inherit" fontWeight="650">
        31°
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={72 + i * 18}
          y="116"
          width="12"
          height="4"
          rx="2"
          fill={i === 2 ? GREEN : INK_SOFT}
        />
      ))}
    </svg>
  )
}
