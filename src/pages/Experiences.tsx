import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { localizePath } from '@/i18n'

const experiences = [
  {
    id: 'snapsting',
    title: 'Viborg Museum',
    image: '/img/VIB_museum.jpg',
    activitiesHref: '/experiences/snapsting',
  },
  {
    id: 'pavillon',
    title: 'Le Pavillon',
    image: '/img/KIKK_lepavillion.avif',
    activitiesHref: '/experiences/pavillon',
  },
]

export default function Experiences() {
  const { t, i18n } = useTranslation()
  const lp = (p: string) => localizePath(i18n.language, p)
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 border-b border-brand-purple/30 pb-2 text-brand-cream">
        {t('experiences.title')}
      </h1>
      <p className="mb-8 max-w-3xl" style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-muted)' }}>
        {t('experiences.intro')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {experiences.map(({ id, title, image, activitiesHref }) => (
          <div
            key={id}
            className="border border-brand-purple/35 bg-brand-plum/20 p-6 rounded-lg transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_20px_rgba(218,128,255,0.12)]"
          >
            <div className="h-48 mb-4 rounded-lg overflow-hidden border border-brand-purple/25">
              <img src={image} alt={t(`experiences.${id}.imageAlt`)} className="w-full h-full object-cover" />
            </div>
            <span
              className="border border-brand-lilac/50 text-brand-lilac px-2 py-1 text-xs font-bold mb-3 inline-block rounded"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t(`experiences.${id}.badge`)}
            </span>
            <h2 className="text-2xl font-bold mb-1 text-brand-cream">{title}</h2>
            <h3 className="text-base mb-4" style={{ color: 'var(--ink-subtle)' }}>📍 {t(`experiences.${id}.location`)}</h3>
            <p className="mb-5" style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-muted)' }}>
              {t(`experiences.${id}.description`)}
            </p>
            <Link
              to={lp(activitiesHref)}
              className="inline-block border border-brand-lilac text-brand-lilac px-4 py-2 text-sm font-bold uppercase rounded-md transition-all duration-300 hover:bg-brand-lilac/10 hover:shadow-[0_0_12px_rgba(218,128,255,0.3)]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('experiences.viewActivities')}
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
