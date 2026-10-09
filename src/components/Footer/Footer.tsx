import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { localizePath } from '@/i18n'

const quickLinks: Array<[string, string]> = [
  ['/about', 'nav.about'],
  ['/partners', 'nav.partners'],
  ['/experiences', 'nav.experiences'],
  ['/news', 'nav.news'],
  ['/faq', 'nav.faq'],
  ['/contact', 'nav.contact'],
  ['/newsletter', 'footer.newsletter'],
]

const socials: Array<[string, string, string]> = [
  ['f', 'Facebook', 'https://www.facebook.com/profile.php?id=61589051665665'],
  ['ig', 'Instagram', 'https://www.instagram.com/echoimmersive/'],
  ['in', 'LinkedIn', 'https://www.linkedin.com/in/echo-immersive-216916403/'],
]

export default function Footer() {
  const { t, i18n } = useTranslation()
  const lp = (p: string) => localizePath(i18n.language, p)

  return (
    <footer className="relative z-10 bg-brand-charcoal mt-12 border-t border-brand-purple/20">
      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Column 1: Brand + social */}
        <div>
          <img
            src="/logos/logo-horizontal-light.png"
            alt="Immersive ECHO"
            className="h-9 w-auto mb-4"
          />
          {/* TODO: Replace glyphs with real SVG social icons. X + YouTube hidden until accounts exist. */}
          <div className="flex gap-3 mb-6">
            {socials.map(([icon, name, href]) => (
              <a
                key={icon}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('footer.followUs', { network: name })}
                className="w-9 h-9 rounded-full border border-brand-lilac/40 flex items-center justify-center text-xs transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_8px_rgba(218,128,255,0.4)]"
                style={{ color: '#DA80FF', fontFamily: 'Montserrat, sans-serif' }}
              >
                {icon}
              </a>
            ))}
          </div>
          <a
            href="mailto:coordinator@lindholmen.se"
            className="text-sm transition-colors duration-200 hover:text-brand-lilac"
            style={{ color: 'var(--ink-subtle)' }}
          >
            coordinator@lindholmen.se
          </a>
        </div>

        {/* Column 2: Quick links */}
        <div>
          <h2
            className="font-bold uppercase tracking-wider text-sm mb-4 text-brand-lilac"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('footer.quickLinks')}
          </h2>
          <ul className="space-y-2 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {quickLinks.map(([to, tKey]) => (
              <li key={to}>
                <Link
                  to={lp(to)}
                  className="transition-colors duration-200 hover:text-brand-lilac"
                  style={{ color: 'var(--ink-subtle)' }}
                >
                  {t(tKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: EU funding acknowledgement */}
        <div>
          <h2
            className="font-bold uppercase tracking-wider text-sm mb-4 text-brand-lilac"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('footer.aboutProject')}
          </h2>
          <img
            src="/logos/co-funded_EN/horizontal/EN_Co-fundedbytheEU_RGB_WHITE.png"
            alt={t('footer.euAlt', 'Co-funded by the European Union')}
            className="h-[3.6rem] w-auto mb-4"
          />
          {/* TODO: Confirm exact EU credit line wording with coordinator */}
          <p
            className="text-xs leading-relaxed mb-4"
            style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-subtle)' }}
          >
            {t('footer.euCredit')}
          </p>
          <ul
            className="space-y-1 text-xs"
            style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-subtle)' }}
          >
            <li>{t('footer.duration')}</li>
            <li>{t('footer.coordinator')}</li>
            <li>{t('footer.partners')}</li>
          </ul>
        </div>

      </div>

      <div
        className="border-t border-brand-purple/15 py-4 text-center text-xs"
        style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-subtle)' }}
      >
        {/* TODO: Add Privacy Policy page and link */}
        {t('footer.rights', { year: new Date().getFullYear() })}
      </div>
    </footer>
  )
}
