import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/',         label: 'Home',          end: true },
  { to: '/about',    label: 'About',         end: false },
  { to: '/partners', label: 'Partners',      end: false },
  { to: '/pilots',   label: 'Pilots',        end: false },
  { to: '/news',     label: 'News & Events', end: false },
  { to: '/faq',      label: 'FAQ',           end: false },
  { to: '/contact',  label: 'Contact',       end: false },
]

export default function Header() {
  return (
    <header className="sticky top-0 bg-white border-b-4 border-gray-400 z-50 p-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Logo — TODO: replace with real SVG/image */}
        <NavLink to="/">
          <div className="border-2 border-gray-400 bg-gray-200 w-48 h-12 flex items-center justify-center text-sm font-bold text-gray-600 rounded-lg cursor-pointer">
            [LOGO: Immersive ECHO]
          </div>
        </NavLink>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-4 text-sm">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive
                  ? 'font-bold underline text-gray-900'
                  : 'text-gray-700 hover:font-bold hover:underline transition-all'
              }
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
          className="border-2 border-gray-800 bg-gray-100 px-4 py-2 font-bold uppercase text-sm rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          Enter ECHO System ↗
        </a>

      </div>
    </header>
  )
}
