import { fillDescriptions } from './guides'

// Imported for its side effect by the views that list guides with their
// descriptions (Guides.tsx, Hub.tsx), so the homepage and product pages do not
// carry ~6 KB gzipped of text they never show. See fillDescriptions().
fillDescriptions(
  import.meta.glob<string>(['./guides/*.md', './pages/*.md'], { query: '?desc', import: 'default', eager: true }),
)
