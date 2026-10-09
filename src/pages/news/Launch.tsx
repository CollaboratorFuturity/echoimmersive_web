import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { localizePath } from '@/i18n'
import Lightbox from '@/components/Lightbox/Lightbox'
import { launchGallery as gallery } from '@/data/galleries'

export default function NewsLaunch() {
  const { t, i18n } = useTranslation()
  const lp = (p: string) => localizePath(i18n.language, p)
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <>
      <Link
        to={lp('/news')}
        className="text-sm text-brand-lilac hover:text-brand-lilac/80 transition-colors mb-4 inline-block"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {t('news.backToNews')}
      </Link>

      <span
        className="text-xs font-bold uppercase block mb-2"
        style={{ fontFamily: 'Montserrat, sans-serif', color: '#DA80FF' }}
      >
        {t('news.filters.News')} | March 2026
      </span>

      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-brand-cream">
        {t('news.launch.title')}
      </h1>
      <p
        className="text-lg md:text-xl mb-8 max-w-3xl"
        style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-body)' }}
      >
        {t('news.launch.lead')}
      </p>

      <div className="flex flex-col sm:flex-row gap-6 mb-12">
        <div className="rounded-lg overflow-hidden border border-brand-purple/30 w-full sm:w-1/4 sm:max-w-xs shrink-0 self-start">
          <img src="/img/news_launch/team.jpg" alt={t('news.launch.teamAlt')} className="w-full h-auto object-cover" />
        </div>

        <div
          className="space-y-4 leading-relaxed"
          style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-body)' }}
        >
        <p>{t('news.launch.p1')}</p>
        <p>{t('news.launch.p2')}</p>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold mb-4 text-brand-cream">{t('news.launch.galleryHeading')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
        {gallery.map(({ src, alt }, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightbox(i)}
            className="block rounded-lg overflow-hidden border border-brand-purple/30 hover:border-brand-lilac/60 transition-colors"
          >
            {/* the img alt names the button — no separate aria-label needed */}
            <img src={src} alt={alt} className="w-full h-48 object-cover" />
          </button>
        ))}
      </div>

      <Lightbox
        images={gallery}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onChange={setLightbox}
      />
    </>
  )
}
