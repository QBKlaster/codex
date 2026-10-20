import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, expect } from '@playwright/test'

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const html = await readFile(resolve(project, 'index.html'), 'utf8')
const missingRequests = []
const server = createServer((request, response) => {
  if (request.url === '/codex/' || request.url === '/codex/index.html') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    response.end(html)
  } else {
    missingRequests.push(request.url)
    response.writeHead(404)
    response.end('Not found')
  }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const port = server.address().port
let browser
try {
  browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  const errors = [], externalRequests = []
  page.on('pageerror', error => errors.push(error.message))
  await page.route('**/*', route => {
    if (route.request().url().startsWith(`http://127.0.0.1:${port}/`)) return route.continue()
    externalRequests.push(route.request().url())
    return route.abort()
  })
  const response = await page.goto(`http://127.0.0.1:${port}/codex/`)
  expect(response.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Katta g‘oyalar.')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true)
  await page.getByRole('button', { name: 'Keyingi slayd' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Har bir detal.')
  const catalog = page.locator('#mahsulotlar')
  await catalog.getByRole('button', { name: 'Bloklar', exact: true }).click()
  await expect(catalog.locator('article')).toHaveCount(1)
  await catalog.getByRole('button', { name: 'Qurilish bloklari haqida batafsil' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await page.locator('#kalkulyator').getByRole('checkbox').uncheck()
  await expect(page.locator('.calculator-volume')).toContainText('16.00')
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
  await page.getByRole('button', { name: 'Menyuni ochish' }).click()
  await page.getByRole('navigation', { name: 'Mobil navigatsiya' }).getByRole('link', { name: 'Aloqa', exact: true }).click()
  await expect(page.locator('#aloqa')).toBeVisible()
  expect(errors).toEqual([])
  expect(missingRequests).toEqual([])
  expect(externalRequests).toEqual([])
  console.log('PASS: published root at /codex/, embedded images/fonts, slides, catalog, calculator, mobile navigation; no missing assets or runtime errors')
} finally {
  await browser?.close()
  server.closeAllConnections()
  await new Promise(resolve => server.close(resolve))
}
