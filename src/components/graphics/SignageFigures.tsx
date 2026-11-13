/**
 * Panda Signage hero drawing: a landscape information screen, a meeting room
 * door panel and a small console window. Flat shapes in the site's ink and
 * bamboo line. An illustration of the kind of system, not a screenshot; the
 * page labels it.
 */

const INK = 'var(--color-ink-300)'
const GREEN = 'var(--color-bamboo-500)'
const SCREEN = 'var(--color-ink-950)'
const PANE = '#171b21'
const PAPER = 'var(--color-paper)'
const MUTED = 'var(--color-ink-400)'

type Labels = { headline: string; room: string; status: string; next: string; admin: string; screens: string }

export function SignageArt({ labels }: { labels: Labels }) {
  return (
    <svg viewBox="0 0 520 400" className="h-full w-full" aria-hidden="true">
      {/* Landscape information screen */}
      <path d="M200 262 L188 292 H272 L260 262" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <rect x="20" y="16" width="420" height="250" rx="16" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <rect x="32" y="28" width="396" height="226" rx="8" fill={SCREEN} />
      <text x="50" y="62" fill={PAPER} fontSize="20" fontFamily="inherit" fontWeight="650">
        {labels.headline}
      </text>
      <text x="410" y="60" textAnchor="end" fill={GREEN} fontSize="16" fontFamily="inherit" fontWeight="650">
        09:30
      </text>
      <rect x="50" y="78" width="220" height="132" rx="6" fill={PANE} />
      <path d="M62 196 L118 132 L156 172 L182 148 L258 196 Z" fill="var(--color-ink-700)" />
      <circle cx="226" cy="108" r="12" fill="var(--color-ember-400)" />
      <rect x="284" y="78" width="126" height="60" rx="6" fill={PANE} />
      <circle cx="306" cy="108" r="9" fill="var(--color-ember-400)" />
      <text x="324" y="114" fill={PAPER} fontSize="16" fontFamily="inherit" fontWeight="650">
        31°
      </text>
      <rect x="284" y="150" width="126" height="60" rx="6" fill={PANE} />
      <rect x="296" y="164" width="80" height="6" rx="3" fill={PAPER} opacity="0.85" />
      <rect x="296" y="178" width="100" height="5" rx="2.5" fill={MUTED} />
      <rect x="296" y="190" width="64" height="5" rx="2.5" fill={MUTED} />
      {/* RSS ticker */}
      <rect x="32" y="222" width="396" height="32" fill={PANE} />
      <rect x="50" y="234" width="8" height="8" rx="2" fill={GREEN} />
      <rect x="68" y="235" width="150" height="6" rx="3" fill={MUTED} />
      <rect x="230" y="235" width="110" height="6" rx="3" fill={MUTED} opacity="0.6" />

      {/* Meeting room door panel */}
      <ellipse cx="118" cy="384" rx="86" ry="6" fill="var(--color-ink-950)" opacity="0.18" />
      <rect x="30" y="236" width="176" height="140" rx="14" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <rect x="40" y="246" width="156" height="120" rx="6" fill={SCREEN} />
      <text x="52" y="272" fill={PAPER} fontSize="14" fontFamily="inherit" fontWeight="650">
        {labels.room}
      </text>
      <rect x="52" y="284" width="132" height="34" rx="6" fill={GREEN} />
      <text x="64" y="306" fill={SCREEN} fontSize="13" fontFamily="inherit" fontWeight="700">
        {labels.status}
      </text>
      <text x="52" y="342" fill={MUTED} fontSize="11" fontFamily="inherit">
        {labels.next}
      </text>
      <path d="M168 338 h14 m-5 -5 l5 5 l-5 5" stroke={GREEN} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Console window */}
      <ellipse cx="400" cy="384" rx="100" ry="6" fill="var(--color-ink-950)" opacity="0.18" />
      <rect x="296" y="196" width="208" height="180" rx="12" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <path d="M296 220 H504" stroke="var(--color-ink-200)" />
      <circle cx="312" cy="208" r="3.5" fill="var(--color-ink-300)" />
      <circle cx="324" cy="208" r="3.5" fill="var(--color-ink-300)" />
      <circle cx="336" cy="208" r="3.5" fill="var(--color-ink-300)" />
      <text x="490" y="212" textAnchor="end" fill="var(--color-ink-600)" fontSize="10" fontFamily="inherit" fontWeight="600">
        {labels.admin}
      </text>
      <rect x="306" y="230" width="52" height="136" rx="6" fill="var(--color-ink-100)" />
      <rect x="314" y="242" width="36" height="6" rx="3" fill={GREEN} />
      <rect x="314" y="258" width="30" height="5" rx="2.5" fill="var(--color-ink-300)" />
      <rect x="314" y="272" width="34" height="5" rx="2.5" fill="var(--color-ink-300)" />
      <rect x="314" y="286" width="26" height="5" rx="2.5" fill="var(--color-ink-300)" />
      <text x="368" y="244" fill="var(--color-ink-900)" fontSize="11" fontFamily="inherit" fontWeight="650">
        {labels.screens}
      </text>
      {[258, 286, 314, 342].map((y, i) => (
        <g key={y}>
          <rect x="368" y={y - 4} width="126" height="22" rx="5" fill="#fff" stroke="var(--color-ink-200)" />
          <circle cx="380" cy={y + 7} r="3.5" fill={i === 2 ? 'var(--color-ink-300)' : GREEN} />
          <rect x="390" y={y + 4} width={[64, 52, 70, 46][i]} height="6" rx="3" fill="var(--color-ink-300)" />
        </g>
      ))}
    </svg>
  )
}
