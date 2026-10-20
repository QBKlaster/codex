import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, expect } from '@playwright/test'

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const html = await readFile(resolve(project, 'standalone/index.html'), 'utf8')
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] })
try {
  const context = await browser.newContext({ offline: true, viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const errors = [], externalRequests = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('request', request => { if (/^https?:/.test(request.url())) externalRequests.push(request.url()) })
  await page.setContent(html)
  await page.evaluate(() => document.fonts.ready)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Katta g‘oyalar.')
  await expect(page.locator('#mahsulotlar article')).toHaveCount(3)
  expect(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true)
  await page.locator('#mahsulotlar').getByRole('button', { name: 'Bloklar', exact: true }).click()
  await expect(page.locator('#mahsulotlar article')).toHaveCount(1)
  await page.getByRole('button', { name: 'Qurilish bloklari haqida batafsil' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await page.locator('#kalkulyator').getByRole('checkbox').uncheck()
  await expect(page.locator('.calculator-volume')).toContainText('16.00')
  await page.locator('#kalkulyator').getByRole('button', { name: 'Shu hajmga taklif olish' }).click()
  await expect(page.getByRole('dialog').getByRole('textbox', { name: 'Loyihangiz haqida' })).toHaveValue(/16.00 m³/)
  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
  console.log('PASS: offline HTML, embedded images/fonts, catalog, dialog, calculator, mobile layout')

  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.setContent('<iframe sandbox="allow-scripts allow-modals allow-downloads" style="width:100%;height:850px;border:0"></iframe>')
  await page.locator('iframe').evaluate((iframe, content) => { iframe.srcdoc = content }, html)
  const frame = page.frameLocator('iframe')
  await expect(frame.getByRole('heading', { level: 1 })).toContainText('Katta g‘oyalar.')
  await frame.getByRole('button', { name: 'Keyingi slayd' }).click()
  await expect(frame.getByRole('heading', { level: 1 })).toContainText('Har bir detal.')
  await frame.locator('.header-cta').click()
  await expect(frame.getByRole('dialog')).toBeVisible()
  await frame.getByRole('button', { name: 'Oynani yopish' }).click()
  await frame.getByRole('link', { name: 'Mahsulotlarni ko‘rish' }).click()
  await expect(frame.locator('#mahsulotlar')).toBeVisible()
  await expect.poll(() => frame.locator('#mahsulotlar').evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(200)
  await expect(frame.getByRole('heading', { level: 1 })).toHaveCount(1)
  expect(errors).toEqual([])
  expect(externalRequests).toEqual([])
  console.log('PASS: sandboxed srcdoc preview, slides, modal, section navigation, zero external requests or runtime errors')
} finally {
  await browser.close()
}
