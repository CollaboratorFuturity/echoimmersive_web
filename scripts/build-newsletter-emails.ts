// Build email-safe HTML for a newsletter issue, one file per language that has
// a translated block document. Reads the same per-language block files the web
// page uses (public/locales/{lng}/newsletters/{id}.json) plus the UI locale for
// localized email chrome, and writes newsletters/build/{id}/{lng}.html.
//
// Run (Node 22.6+):  node --experimental-strip-types scripts/build-newsletter-emails.ts <issueId>
// or via npm:        npm run newsletter:build-emails -- <issueId>
//
// The output keeps the {{unsubscribe_url}} token, so it drops straight into the
// existing backend send pipeline (which injects each subscriber's link).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { renderIssueEmail, type EmailChrome } from '../src/newsletter-email/renderEmail.ts'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(scriptDir, '..')
const LANGS = ['en', 'fr', 'de', 'es', 'it', 'nl', 'sv', 'da', 'sl', 'ro']
const DEFAULT = 'en'
const BASE_URL = process.env.SITE_URL || 'https://echoimmersive.eu'

const id = process.argv[2]
if (!id) {
  console.error('usage: build-newsletter-emails <issueId>')
  process.exit(1)
}

const readJSON = (p: string) => JSON.parse(readFileSync(p, 'utf8'))
const issuePath = (lng: string) => resolve(ROOT, `public/locales/${lng}/newsletters/${id}.json`)
const uiPath = (lng: string) => resolve(ROOT, `public/locales/${lng}/translation.json`)

const enUi = readJSON(uiPath(DEFAULT))
const outDir = resolve(ROOT, 'newsletters/build', id)
mkdirSync(outDir, { recursive: true })

let built = 0
for (const lng of LANGS) {
  if (!existsSync(issuePath(lng))) continue // only languages with a translated issue
  const issue = readJSON(issuePath(lng))
  let ui: any = enUi
  try { ui = readJSON(uiPath(lng)) } catch { /* fall back to en UI */ }

  const ne = ui.newsletterEmail ?? enUi.newsletterEmail
  const chrome: EmailChrome = {
    baseUrl: BASE_URL,
    unsubscribe: ne?.unsubscribe ?? enUi.newsletterEmail.unsubscribe,
    footer: ne?.footer ?? enUi.newsletterEmail.footer,
    euCredit: ui.footer?.euCredit ?? enUi.footer.euCredit,
  }

  const html = renderIssueEmail(issue, chrome)
  const out = resolve(outDir, `${lng}.html`)
  writeFileSync(out, html, 'utf8')
  console.log(`built ${lng} → ${out} (${html.length} bytes)`)
  built++
}

console.log(`\nDone: ${built} language file(s) for issue "${id}".`)
