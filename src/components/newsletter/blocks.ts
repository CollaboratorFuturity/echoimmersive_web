// ─────────────────────────────────────────────────────────────────────────────
// Newsletter block schema — the single source of truth for an issue's content.
//
// An issue is a metadata header + an ordered array of typed blocks. The SAME
// blocks are rendered two ways:
//   • web  → React components (src/components/newsletter/NewsletterBlocks.tsx)
//   • email → email-safe HTML string (src/newsletter-email/renderEmail.ts)
//
// Adding a new block type later is non-breaking: add it to this union, add a
// web renderer and an email renderer, and old issues (which don't use it) are
// unaffected. Renderers ignore unknown `type`s so forward/backward compat holds.
//
// Content lives per-language at public/locales/{lng}/newsletters/{id}.json and
// is loaded with English fallback — so a language can ship partially translated.
// ─────────────────────────────────────────────────────────────────────────────

export type Block =
  | { type: 'sectionLabel'; text: string }
  | { type: 'divider' }
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'figure'; src: string; alt: string; caption?: string }
  | { type: 'pullQuote'; quote: string; attribution?: string }
  | {
      type: 'callout'
      eyebrow?: string
      heading?: string
      body: string[]
      ctaLabel?: string
      ctaHref?: string
      footnote?: string
      footnoteLinkLabel?: string
      footnoteLinkHref?: string
    }
  | { type: 'button'; label: string; href: string }

export type BlockType = Block['type']

/** A full newsletter issue in one language. */
export interface NewsletterIssue {
  /** Stable id, also the file name and the issue's URL slug (e.g. "newsletter-1"). */
  id: string
  /** Display label shown in the eyebrow, e.g. "Newsletter No. 1". Not the <title>. */
  kicker: string
  /** Human date string shown next to the kicker, e.g. "September 2026". */
  date: string
  /** Email subject line (email only). */
  subject: string
  /** Email preheader / preview text (email only). */
  preheader: string
  /** Page/article heading. */
  title: string
  /** Lead paragraph under the title. */
  lead: string
  /** Ordered body content. */
  blocks: Block[]
}
