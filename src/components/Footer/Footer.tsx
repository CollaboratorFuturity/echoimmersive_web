import { Link } from 'react-router-dom'

const quickLinks = [
  ['/about',      'About'],
  ['/partners',   'Partners'],
  ['/experiences', 'Experiences'],
  ['/news',       'News & Events'],
  ['/faq',        'FAQ'],
  ['/contact',    'Contact'],
  ['/newsletter', 'Newsletter'],
]

export default function Footer() {
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
            {[
              ['f', 'Facebook', 'https://www.facebook.com/profile.php?id=61589051665665'],
              ['ig', 'Instagram', 'https://www.instagram.com/echoimmersive/'],
            ].map(([icon, name, href]) => (
              <a
                key={icon}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${name}`}
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
            Quick Links
          </h2>
          <ul className="space-y-2 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {quickLinks.map(([to, label]) => (
              <li key={to}>
                <Link
                  to={to}
                  className="transition-colors duration-200 hover:text-brand-lilac"
                  style={{ color: 'var(--ink-subtle)' }}
                >
                  {label}
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
            About the Project
          </h2>
          <img
            src="/logos/co-funded_EN/horizontal/EN_Co-fundedbytheEU_RGB_WHITE.png"
            alt="Co-funded by the European Union"
            className="h-[3.6rem] w-auto mb-4"
          />
          {/* TODO: Confirm exact EU credit line wording with coordinator */}
          <p
            className="text-xs leading-relaxed mb-4"
            style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-subtle)' }}
          >
            Co-funded by the European Union under the Creative Europe programme,
            Large Scale Cooperation strand. Grant Agreement No. 101255680.
          </p>
          <ul
            className="space-y-1 text-xs"
            style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-subtle)' }}
          >
            <li>Duration: Feb 2026 – July 2028</li>
            <li>Coordinator: Lindholmen Science Park</li>
            <li>15 partners · 10 countries</li>
          </ul>
        </div>

      </div>

      <div
        className="border-t border-brand-purple/15 py-4 text-center text-xs"
        style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-subtle)' }}
      >
        {/* TODO: Add Privacy Policy page and link */}
        © {new Date().getFullYear()} Immersive ECHO. All rights reserved.
      </div>
    </footer>
  )
}
