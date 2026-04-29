import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/',         label: 'Home',          end: true },
  { to: '/about',    label: 'About',         end: false },
  { to: '/partners', label: 'Partners',      end: false },
  { to: '/pilots',   label: 'Experiences',   end: false },
  { to: '/news',     label: 'News & Events', end: false },
  { to: '/faq',      label: 'FAQ',           end: false },
  { to: '/contact',  label: 'Contact',       end: false },
]

const activeLinkStyle = { color: '#DA80FF' }
const defaultLinkStyle = { color: 'rgba(247,243,224,0.65)' }

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b border-brand-purple/30"
      style={{ backgroundColor: 'rgba(32, 33, 36, 0.92)', backdropFilter: 'blur(12px)' }}
    >
      {/* Main bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <NavLink to="/" onClick={() => setMenuOpen(false)}>
          <img src="/logos/logo-horizontal-light.png" alt="Immersive ECHO" className="h-9 w-auto" />
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-wrap gap-5 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="font-medium transition-colors duration-200 hover:text-brand-lilac"
              style={({ isActive }) => isActive ? activeLinkStyle : defaultLinkStyle}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* CTA — hidden on small mobile, shown sm+ */}
          <a
            href="https://echosystem.futurity.science"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex border border-brand-lilac px-4 py-2 font-bold uppercase text-xs rounded-md transition-all duration-300 hover:bg-brand-lilac/10 hover:shadow-[0_0_14px_rgba(218,128,255,0.35)] whitespace-nowrap"
            style={{ fontFamily: 'Montserrat, sans-serif', color: '#DA80FF' }}
          >
            Enter ECHO System ↗
          </a>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-md transition-colors hover:bg-brand-lilac/10"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <span className={`block w-5 h-0.5 bg-brand-cream/80 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-brand-cream/80 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-brand-cream/80 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="md:hidden border-t border-brand-purple/20"
          style={{ backgroundColor: 'rgba(32, 33, 36, 0.97)' }}
        >
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className="py-3 px-2 text-sm font-medium border-b border-brand-purple/15 last:border-0 transition-colors duration-200 hover:text-brand-lilac"
                style={({ isActive }) => isActive ? activeLinkStyle : defaultLinkStyle}
              >
                {label}
              </NavLink>
            ))}
            {/* CTA inside mobile menu */}
            <a
              href="https://echosystem.futurity.science"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-3 mb-1 text-center border border-brand-lilac px-4 py-3 font-bold uppercase text-xs rounded-md transition-all duration-300 hover:bg-brand-lilac/10"
              style={{ color: '#DA80FF' }}
            >
              Enter ECHO System ↗
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
