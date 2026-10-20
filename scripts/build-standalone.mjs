import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(project, 'dist')
const output = resolve(project, 'standalone')
const types = {
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff',
}

function localPath(url) {
  const path = resolve(dist, url.replace(/^\//, ''))
  if (!path.startsWith(dist + sep)) throw new Error(`Asset is outside dist: ${url}`)
  return path
}

async function dataUrl(url) {
  const path = localPath(url)
  const mime = types[extname(path)]
  if (!mime) throw new Error(`Unknown asset type: ${url}`)
  return `data:${mime};base64,${(await readFile(path)).toString('base64')}`
}

let html = await readFile(resolve(dist, 'index.html'), 'utf8')
const script = html.match(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/)
const stylesheet = html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/)
if (!script || !stylesheet) throw new Error('Expected one production script and stylesheet')

let js = await readFile(localPath(script[1]), 'utf8')
let css = await readFile(localPath(stylesheet[1]), 'utf8')

for (const match of [...css.matchAll(/url\(([^)]+)\)/g)]) {
  const url = match[1].replace(/^["']|["']$/g, '')
  if (url.startsWith('data:')) continue
  css = css.replaceAll(match[0], `url("${await dataUrl(url)}")`)
}

const image = await dataUrl('/architecture.webp')
js = `const __QBK_HERO_IMAGE = ${JSON.stringify(image)};\n` + js.replaceAll('"/architecture.webp"', '__QBK_HERO_IMAGE')
// A srcdoc preview resolves fragment links against its parent page. Scroll inside
// this document instead, so clicking a section never replaces the iframe.
js += `\ndocument.addEventListener('click', function (event) {
  if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const anchor = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
  if (!anchor) return;
  const fragment = anchor.getAttribute('href');
  const target = document.getElementById(decodeURIComponent(fragment.slice(1)));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  try { history.replaceState(null, '', fragment); } catch {}
});\n`
html = html.replace(script[0], '')
html = html.replace(/^[\t ]+$/gm, '')
// A replacement callback preserves literal $&, $' and $$ in minified bundles.
html = html.replace(stylesheet[0], () => `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`)
const favicon = await dataUrl('/favicon.svg')
html = html.replace('href="/favicon.svg"', () => `href="${favicon}"`)
html = html.replace('</body>', () => `<script>${js.replace(/<\/script/gi, '<\\/script')}</script>\n</body>`)

if (/<(?:script|link)\b[^>]*(?:src|href)="\/(?:assets|src)\//.test(html)) {
  throw new Error('A script or stylesheet still requires a server')
}

await mkdir(output, { recursive: true })
await writeFile(resolve(output, 'index.html'), html)
console.log(`Standalone site: ${resolve(output, 'index.html')} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`)
