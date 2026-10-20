import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const html = await readFile(resolve(project, 'standalone/index.html'), 'utf8')
// The repository root is the GitHub Pages artifact; Vite uses src/index.html.
if (!html.includes('data:image/webp;base64,') || !html.includes('<script>') || /<script[^>]+src=/.test(html)) {
  throw new Error('Expected a complete standalone site before publishing')
}
await writeFile(resolve(project, 'index.html'), html)
await writeFile(resolve(project, '.nojekyll'), '')
console.log('GitHub Pages ready: index.html and .nojekyll (main branch, repository root)')
