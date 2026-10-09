import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { localizePath } from '@/i18n'
import Lightbox from '@/components/Lightbox/Lightbox'
import { launchGallery } from '@/data/galleries'

type FilterType = 'All' | 'News' | 'Events' | 'Press'
const FILTERS: FilterType[] = ['All', 'News', 'Events', 'Press']

type Article = {
  id: number
  type: FilterType
  date: string
  titleKey: string
  subtitleKey: string
  thumb: string
  href: string
}

const articles: Article[] = [
  {
    id: 2,
    type: 'News',
    date: 'September 2026',
    titleKey: 'news.articles.newsletter1.title',
    subtitleKey: 'news.articles.newsletter1.subtitle',
    thumb: '/img/newsletter/namur-kickoff.jpg',
    href: '/news/newsletter-1',
  },
  {
    id: 1,
    type: 'News',
    date: 'March 2026',
    titleKey: 'news.articles.launch.title',
    subtitleKey: 'news.articles.launch.subtitle',
    thumb: '/img/news_launch/thumb.jpg',
    href: '/news/launch',
  },
]

const galleries = [
  { nameKey: 'news.galleries.launch', images: launchGallery },
]

export default function News() {
  const { t, i18n } = useTranslation()
  const lp = (p: string) => localizePath(i18n.language, p)
  const [filter, setFilter] = useState<FilterType>('All')
  const [lightbox, setLightbox] = useState<{ images: { src: string; alt: string }[]; index: number } | null>(null)
  const filtered = filter === 'All' ? articles : articles.filter(a => a.type === filter)

  return (
    <>
      <div className="mb-8 border-b border-brand-purple/30 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-cream">{t('news.title')}</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-bold uppercase rounded-md transition-all duration-300 ${
              filter === f
                ? 'bg-brand-lilac text-brand-charcoal shadow-[0_0_12px_rgba(218,128,255,0.4)]'
                : 'border border-brand-purple/35 text-brand-cream/65 hover:border-brand-lilac hover:text-brand-lilac'
            }`}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t(`news.filters.${f}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Feed */}
        <div className="col-span-2 space-y-6">
          <h2 className="text-xl font-bold mb-4 text-brand-cream">{t('news.latestUpdates')}</h2>
          {filtered.map(({ id, type, date, titleKey, subtitleKey, thumb, href }) => (
            <div key={id} className="flex flex-col sm:flex-row gap-4 border border-brand-purple/30 bg-brand-plum/15 p-4 rounded-lg transition-all duration-300 hover:border-brand-lilac/50">
              <Link to={lp(href)} className="w-full sm:w-32 h-32 shrink-0 rounded overflow-hidden border border-brand-purple/25">
                <img src={thumb} alt={t(titleKey)} className="w-full h-full object-cover" />
              </Link>
              <div>
                <span className="text-xs font-bold uppercase" style={{ fontFamily: 'Montserrat, sans-serif', color: '#DA80FF' }}>
                  {t(`news.filters.${type}`)} | {date}
                </span>
                <h3 className="text-lg font-bold mb-2 mt-1 text-brand-cream">{t(titleKey)}</h3>
                <p className="text-sm mb-4" style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-muted)' }}>
                  {t(subtitleKey)}
                </p>
                <Link to={lp(href)} className="text-brand-lilac underline text-sm font-bold hover:text-brand-lilac/80">{t('news.readMore')}</Link>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--ink-subtle)' }}>{t('news.empty')}</p>
          )}
        </div>

        {/* Galleries sidebar */}
        <div className="border border-brand-purple/30 bg-brand-plum/15 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-brand-cream">{t('news.eventGalleries')}</h2>
          <div className="space-y-3">
            {galleries.map(g => (
              <button
                key={g.nameKey}
                onClick={() => setLightbox({ images: g.images, index: 0 })}
                className="w-full border border-brand-purple/30 bg-brand-plum/20 h-16 flex items-center px-4 gap-3 text-sm rounded-lg transition-all duration-300 hover:border-brand-lilac hover:bg-brand-plum/35 text-left"
                style={{ color: 'var(--ink-muted)', fontFamily: 'Roboto, sans-serif' }}
              >
                📁 {t(g.nameKey)}
                <span className="ml-auto text-xs" style={{ color: 'var(--ink-subtle)' }}>
                  {t('news.photos', { count: g.images.length })}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        images={lightbox?.images ?? []}
        index={lightbox?.index ?? null}
        onClose={() => setLightbox(null)}
        onChange={(i) => setLightbox(lb => (lb ? { ...lb, index: i } : lb))}
      />
    </>
  )
}
