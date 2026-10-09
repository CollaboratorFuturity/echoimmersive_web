import type { Block } from './blocks'

const bodyStyle = { fontFamily: 'Roboto, sans-serif', color: 'var(--ink-body)' } as const

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href)
/** Open external links in a new tab; keep internal links same-tab. */
const linkTargetProps = (href: string) =>
  isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {}

/** Renders one block. Unknown types render nothing (forward/backward compat). */
function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'sectionLabel':
      return (
        <p
          className="text-xs font-bold uppercase tracking-widest text-brand-lilac mb-5 mt-2"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {block.text}
        </p>
      )

    case 'divider':
      return <div className="border-t border-brand-purple/30 my-10" />

    case 'paragraph':
      return (
        <p className="mb-4 leading-relaxed" style={bodyStyle}>
          {block.text}
        </p>
      )

    case 'heading':
      return (
        <h3 className="text-lg font-bold text-brand-cream mb-3 mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {block.text}
        </h3>
      )

    case 'figure':
      return (
        <figure className="my-8">
          <div className="rounded-lg overflow-hidden border border-brand-purple/30">
            <img src={block.src} alt={block.alt} className="w-full h-auto" />
          </div>
          {block.caption && (
            <figcaption className="text-xs mt-2" style={{ color: 'var(--ink-subtle)' }}>
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'pullQuote':
      return (
        <div className="border-l-2 border-brand-lilac pl-7 my-8">
          <div className="text-5xl leading-none text-brand-lilac/30" aria-hidden="true">&ldquo;</div>
          <p className="italic" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300, color: 'var(--ink-strong)' }}>
            {block.quote}
          </p>
          {block.attribution && (
            <p className="text-xs uppercase tracking-widest text-brand-lilac mt-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {block.attribution}
            </p>
          )}
          <div className="w-8 h-px bg-brand-lilac/35 mt-5" />
        </div>
      )

    case 'button':
      return (
        <a
          href={block.href}
          {...linkTargetProps(block.href)}
          className="inline-block border border-brand-lilac px-4 py-2 font-bold uppercase text-xs rounded-md transition-all duration-300 hover:bg-brand-lilac/10 hover:shadow-[0_0_14px_rgba(218,128,255,0.35)]"
          style={{ fontFamily: 'Montserrat, sans-serif', color: '#DA80FF' }}
        >
          {block.label}
        </a>
      )

    case 'callout':
      return (
        <div
          className="relative border border-brand-purple/40 rounded-xl backdrop-blur-sm p-8 my-10"
          style={{ backgroundColor: 'rgba(90,66,99,0.35)', boxShadow: 'inset 0 0 60px rgba(136,67,163,0.12)' }}
        >
          {block.eyebrow && (
            <p className="text-xs font-bold uppercase tracking-widest text-brand-lilac mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="text-xl md:text-2xl font-bold text-brand-cream mb-4">{block.heading}</h2>
          )}
          <div className="space-y-4 mb-6" style={bodyStyle}>
            {block.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {block.ctaLabel && block.ctaHref && (
            <a
              href={block.ctaHref}
              {...linkTargetProps(block.ctaHref)}
              className="inline-block border border-brand-lilac px-4 py-2 font-bold uppercase text-xs rounded-md transition-all duration-300 hover:bg-brand-lilac/10 hover:shadow-[0_0_14px_rgba(218,128,255,0.35)]"
              style={{ fontFamily: 'Montserrat, sans-serif', color: '#DA80FF' }}
            >
              {block.ctaLabel}
            </a>
          )}
          {block.footnote && (
            <p className="text-sm mt-5" style={{ color: 'var(--ink-muted)' }}>
              {block.footnote}{' '}
              {block.footnoteLinkLabel && block.footnoteLinkHref && (
                <a href={block.footnoteLinkHref} className="text-brand-lilac underline hover:text-brand-lilac/80">
                  {block.footnoteLinkLabel}
                </a>
              )}
            </p>
          )}
        </div>
      )

    default:
      return null
  }
}

export default function NewsletterBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <article className="max-w-3xl leading-relaxed" style={bodyStyle}>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </article>
  )
}
