// ─────────────────────────────────────────────────────────────────────────────
// Block → email-safe HTML renderer.
//
// Renders the SAME NewsletterIssue block document that the web page uses, but
// into table-free* single-column, inline-styled HTML suitable for email clients
// (no external CSS, no JS, no web fonts — Arial/Helvetica fallback, hex colours,
// a ~600px centred column, bulletproof-ish buttons).
//
// The output keeps the {{unsubscribe_url}} token so the existing backend
// send pipeline (app.services.newsletter_content.render_issue) injects each
// subscriber's personal unsubscribe link unchanged.
//
// *We use a couple of simple <table>s only for the centred wrapper and buttons,
// which is the portable way to do those in email.
// ─────────────────────────────────────────────────────────────────────────────

import type { Block, NewsletterIssue } from '../components/newsletter/blocks'

export interface EmailChrome {
  /** Absolute origin for images and internal links, e.g. https://echoimmersive.eu */
  baseUrl: string
  /** Localised "Unsubscribe" word. */
  unsubscribe: string
  /** Localised footer sentence ("You're receiving this because…"). */
  footer: string
  /** Localised EU funding credit line. */
  euCredit: string
}

const COLORS = {
  bg: '#202124',
  panel: '#2b2230',
  text: '#F7F3E0',
  muted: '#9a93a0',
  lilac: '#DA80FF',
  border: '#5a4263',
  rule: '#3a3340',
}
const FONT = "Arial, Helvetica, sans-serif"
const CONTENT_WIDTH = 536 // 600px column minus 32px padding each side

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Absolutise a root-relative href/src with the base URL; leave the rest. */
function abs(url: string, baseUrl: string): string {
  if (url.startsWith('/')) return baseUrl.replace(/\/$/, '') + url
  return url
}

function button(label: string, href: string, baseUrl: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;"><tr>
    <td style="border:1px solid ${COLORS.lilac};border-radius:6px;">
      <a href="${esc(abs(href, baseUrl))}" style="display:inline-block;padding:11px 20px;color:${COLORS.lilac};text-decoration:none;font-family:${FONT};font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">${esc(label)}</a>
    </td>
  </tr></table>`
}

function renderBlock(block: Block, baseUrl: string): string {
  switch (block.type) {
    case 'sectionLabel':
      return `<p style="margin:28px 0 12px;color:${COLORS.lilac};font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">${esc(block.text)}</p>`

    case 'divider':
      return `<div style="border-top:1px solid ${COLORS.rule};margin:28px 0;"></div>`

    case 'paragraph':
      return `<p style="margin:0 0 16px;color:${COLORS.text};font-family:${FONT};font-size:16px;line-height:1.6;">${esc(block.text)}</p>`

    case 'heading':
      return `<h3 style="margin:24px 0 10px;color:${COLORS.text};font-family:${FONT};font-size:18px;font-weight:bold;">${esc(block.text)}</h3>`

    case 'figure':
      return `
      <div style="margin:24px 0;">
        <img src="${esc(abs(block.src, baseUrl))}" alt="${esc(block.alt)}" width="${CONTENT_WIDTH}" style="width:100%;max-width:${CONTENT_WIDTH}px;height:auto;display:block;border-radius:8px;border:0;" />
        ${block.caption ? `<p style="margin:8px 0 0;color:${COLORS.muted};font-family:${FONT};font-size:12px;">${esc(block.caption)}</p>` : ''}
      </div>`

    case 'pullQuote':
      return `
      <div style="border-left:3px solid ${COLORS.lilac};padding-left:16px;margin:24px 0;">
        <p style="margin:0;color:${COLORS.text};font-family:${FONT};font-size:17px;font-style:italic;line-height:1.5;">${esc(block.quote)}</p>
        ${block.attribution ? `<p style="margin:12px 0 0;color:${COLORS.lilac};font-family:${FONT};font-size:12px;text-transform:uppercase;letter-spacing:1px;">${esc(block.attribution)}</p>` : ''}
      </div>`

    case 'button':
      return button(block.label, block.href, baseUrl)

    case 'callout': {
      const body = block.body.map(p => `<p style="margin:0 0 14px;color:${COLORS.text};font-family:${FONT};font-size:15px;line-height:1.6;">${esc(p)}</p>`).join('')
      const cta = block.ctaLabel && block.ctaHref ? button(block.ctaLabel, block.ctaHref, baseUrl) : ''
      const footnote = block.footnote
        ? `<p style="margin:16px 0 0;color:${COLORS.muted};font-family:${FONT};font-size:13px;">${esc(block.footnote)}${block.footnoteLinkLabel && block.footnoteLinkHref ? ` <a href="${esc(abs(block.footnoteLinkHref, baseUrl))}" style="color:${COLORS.lilac};">${esc(block.footnoteLinkLabel)}</a>` : ''}</p>`
        : ''
      return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0;background:${COLORS.panel};border:1px solid ${COLORS.border};border-radius:12px;"><tr>
        <td style="padding:24px;">
          ${block.eyebrow ? `<p style="margin:0 0 10px;color:${COLORS.lilac};font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">${esc(block.eyebrow)}</p>` : ''}
          ${block.heading ? `<h2 style="margin:0 0 14px;color:${COLORS.text};font-family:${FONT};font-size:20px;font-weight:bold;">${esc(block.heading)}</h2>` : ''}
          ${body}
          ${cta}
          ${footnote}
        </td>
      </tr></table>`
    }

    default:
      return ''
  }
}

export function renderIssueEmail(issue: NewsletterIssue, chrome: EmailChrome): string {
  const { baseUrl } = chrome
  const logo = abs('/logos/logo-horizontal-light.png', baseUrl)
  const blocksHtml = issue.blocks.map(b => renderBlock(b, baseUrl)).join('\n')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${esc(issue.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};">
  <!-- preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(issue.preheader)}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${COLORS.bg};">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;background:${COLORS.bg};">
        <tr><td style="padding:8px 32px 24px;">
          <img src="${logo}" alt="Immersive ECHO" height="36" style="height:36px;width:auto;display:block;border:0;margin-bottom:24px;" />
          <p style="margin:0 0 6px;color:${COLORS.lilac};font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">${esc(issue.kicker)} &nbsp;|&nbsp; ${esc(issue.date)}</p>
          <h1 style="margin:0 0 12px;color:${COLORS.text};font-family:${FONT};font-size:28px;font-weight:bold;line-height:1.15;">${esc(issue.title)}</h1>
          <p style="margin:0 0 20px;color:${COLORS.text};font-family:${FONT};font-size:18px;line-height:1.5;">${esc(issue.lead)}</p>
          ${blocksHtml}
          <div style="border-top:1px solid ${COLORS.rule};margin:32px 0 16px;"></div>
          <p style="margin:0 0 8px;color:${COLORS.muted};font-family:${FONT};font-size:12px;line-height:1.5;">${esc(chrome.euCredit)}</p>
          <p style="margin:0;color:${COLORS.muted};font-family:${FONT};font-size:12px;line-height:1.5;">${esc(chrome.footer)} <a href="{{unsubscribe_url}}" style="color:${COLORS.lilac};">${esc(chrome.unsubscribe)}</a>.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
