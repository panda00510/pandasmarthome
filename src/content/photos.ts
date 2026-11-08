/**
 * Responsive photo set (800 / 1200 / 1600 px WebP) and the credit record for
 * every Pexels photograph on the site. The photos are stock imagery that
 * illustrates a home type or a room: none is a Panda Smart Home installation
 * or a client project, and the site never presents them as one.
 * Licence: https://www.pexels.com/license/ (free for commercial use).
 */
const urls = import.meta.glob<string>('../assets/photos/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

const WIDTHS = [800, 1200, 1600] as const

export function responsive(slug: string) {
  const url = (w: number) => urls[`../assets/photos/${slug}-${w}.webp`]
  return {
    src: url(1200),
    srcSet: WIDTHS.map((w) => `${url(w)} ${w}w`).join(', '),
  }
}

export const photoCredits = [
  {
    slug: 'hero-living',
    use: 'Home page hero',
    photographer: 'Max Vakhtbovych',
    source: 'https://www.pexels.com/photo/modern-living-room-design-with-corner-sofa-6920439/',
  },
  {
    slug: 'home-bto',
    use: 'Home types: BTO & new keys',
    photographer: 'CK Seng',
    source: 'https://www.pexels.com/photo/singapore-skyline-with-high-rise-apartments-34035022/',
  },
  {
    slug: 'home-hdb',
    use: 'Home types: HDB resale',
    photographer: 'CK Seng',
    source: 'https://www.pexels.com/photo/colorful-residential-building-in-urban-park-setting-34965019/',
  },
  {
    slug: 'home-condo',
    use: 'Home types: condominiums',
    photographer: 'Quang Nguyen Vinh',
    source: 'https://www.pexels.com/photo/modern-condominium-located-on-riverside-in-modern-city-6416109/',
  },
  {
    slug: 'home-landed',
    use: 'Home types: landed & larger homes',
    photographer: 'Abdullah Asad',
    source: 'https://www.pexels.com/photo/houses-with-terraces-12359215/',
  },
] as const
