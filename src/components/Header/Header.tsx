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

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 p-4 backdrop-blur-md border-b border-brand-purple/30"
      style={{ backgroundColor: 'rgba(32, 33, 36, 0.92)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

        <NavLink to="/">
          <img
            src="/logos/logo-horizontal-light.png"
            alt="Immersive ECHO"
            className="h-10 w-auto"
          />
        </NavLink>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-5 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive
                  ? 'font-bold text-brand-lilac'
                  : 'font-medium transition-colors duration-200 hover:text-brand-lilac'
              }
              style={({ isActive }) => ({
                color: isActive ? '#DA80FF' : 'rgba(247,243,224,0.65)',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA — TODO: replace '#' with real ECHO System dashboard URL */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-brand-lilac px-4 py-2 font-bold uppercase text-xs rounded-md transition-all duration-300 hover:bg-brand-lilac/10 hover:shadow-[0_0_14px_rgba(218,128,255,0.35)] whitespace-nowrap"
          style={{ fontFamily: 'Montserrat, sans-serif', color: '#DA80FF' }}
        >
          Enter ECHO System ↗
        </a>

      </div>
    </header>
  )
}
