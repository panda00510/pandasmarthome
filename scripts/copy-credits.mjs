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
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const from = fileURLToPath(new URL('../ASSET_SOURCES.md', import.meta.url))
const to = fileURLToPath(new URL('../public/asset-sources.txt', import.meta.url))

// A UTF-8 byte-order mark makes browsers decode the file as UTF-8 even when
// the host sends `text/plain` with no charset (otherwise dashes and × show as
// mojibake). public/_headers also declares the charset for hosts that honour it.
const BOM = String.fromCharCode(0xfeff)
const text = (await readFile(from, 'utf8')).replaceAll(BOM, '').replaceAll('\r\n', '\n')
await writeFile(to, BOM + text, 'utf8')
console.log('public/asset-sources.txt updated from ASSET_SOURCES.md')
