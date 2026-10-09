import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { localizePath } from '@/i18n'
import { useNewsletterIssue } from '@/components/newsletter/useNewsletterIssue'
import NewsletterBlocks from '@/components/newsletter/NewsletterBlocks'

/**
 * Data-driven newsletter issue page. Loads the issue's block document for the
 * active language (English fallback) and renders the header + blocks. The same
 * block document is used by the email builder, so web and email stay in sync.
 */
export default function NewsletterIssue({ id }: { id: string }) {
  const { t, i18n } = useTranslation()
  const lp = (p: string) => localizePath(i18n.language, p)
  const { issue, state } = useNewsletterIssue(id)

  return (
    <>
      <Link
        to={lp('/news')}
        className="text-sm text-brand-lilac hover:text-brand-lilac/80 transition-colors mb-4 inline-block"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {t('news.backToNews')}
      </Link>

      {state === 'loading' && (
        <p className="text-sm" style={{ color: 'var(--ink-subtle)', fontFamily: 'Roboto, sans-serif' }}>
          {t('news.issueLoading', 'Loading…')}
        </p>
      )}

      {state === 'notfound' && (
        <p className="text-sm" style={{ color: 'var(--ink-subtle)', fontFamily: 'Roboto, sans-serif' }}>
          {t('news.issueNotFound', 'This issue is not available.')}
        </p>
      )}

      {state === 'ready' && issue && (
        <>
          <span
            className="text-xs font-bold uppercase block mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif', color: '#DA80FF' }}
          >
            {issue.kicker} | {issue.date}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-brand-cream">
            {issue.title}
          </h1>
          <p
            className="text-lg md:text-xl mb-10 max-w-3xl"
            style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-body)' }}
          >
            {issue.lead}
          </p>

          <NewsletterBlocks blocks={issue.blocks} />
        </>
      )}
    </>
  )
}
