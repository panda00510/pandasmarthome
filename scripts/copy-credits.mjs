/**
 * Publish ASSET_SOURCES.md as public/asset-sources.txt.
 *
 * The footer's "Image credits & licences" link points at it, which satisfies
 * the attribution requirement of the CC BY / CC BY-SA photographs. `.txt` is
 * used rather than `.md` so every browser renders it inline instead of
 * offering it as a download.
 *
 * Runs automatically via the `predev` / `prebuild` npm hooks — the copy is
 * generated, git-ignored, and can never drift from the source file.
 */
import { copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const from = fileURLToPath(new URL('../ASSET_SOURCES.md', import.meta.url))
const to = fileURLToPath(new URL('../public/asset-sources.txt', import.meta.url))

await copyFile(from, to)
console.log('public/asset-sources.txt updated from ASSET_SOURCES.md')
