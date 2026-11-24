// Run against the local dev server with VITE_FORM_ENDPOINT=/test-enquiry.
// Point PLAYWRIGHT_CORE at an installed Playwright module when it isn't on the module path.
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_CORE || 'playwright-core')
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM })
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const origin = new URL(process.argv[2] || 'http://localhost:5173').origin
  assert(['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname), 'use a local dev server')
  let payload
  await page.route('**/*', (route) => {
    if (route.request().method() !== 'POST') return route.continue()
    if (route.request().url() !== origin + '/test-enquiry') return route.abort()
    payload = route.request().postDataJSON()
    return route.fulfill({ json: { success: true } })
  })

  for (const path of ['/contact/', '/zh/contact/']) {
    await page.goto(origin + path)
    const field = (name) => page.locator(`form [name="${name}"]`)
    await field('name').fill('Local form check')
    await field('contact').fill('check@example.com')
    await field('projectType').selectOption({ index: 3 })
    await field('homeType').selectOption({ index: 1 })
    await page.locator('form summary').click()
    await field('startWith').selectOption({ index: 1 })
    await field('message').fill('Keep this message')
    await field('projectType').selectOption({ index: 1 })
    await field('device').selectOption({ index: 4 })
    const model = await field('device').inputValue()
    const project = await field('projectType').inputValue()
    payload = undefined
    await page.locator('button[type=submit]').click()
    await page.waitForFunction(() => document.querySelector('[name=projectType]').value === '')
    assert.equal(payload.projectType, project)
    assert.equal(payload.device, model)
    assert.equal(payload.message, 'Keep this message')
    assert.equal(payload.homeType, undefined)
    assert.equal(payload.startWith, undefined)
    assert.equal(await field('device').count(), 0)
  }
  console.log('enquiry form: both languages passed')
} finally {
  await browser.close()
}
