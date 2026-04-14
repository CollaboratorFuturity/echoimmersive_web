import { Link } from 'react-router-dom'

const quickLinks = [
  ['/about',      'About'],
  ['/partners',   'Partners'],
  ['/pilots',     'Pilots'],
  ['/news',       'News & Events'],
  ['/faq',        'FAQ'],
  ['/contact',    'Contact'],
  ['/newsletter', 'Newsletter'],
]

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Column 1: Brand + social */}
        <div>
          <h3 className="font-bold text-xl mb-4">Immersive ECHO</h3>
          {/* TODO: Replace with real SVG social icons once assets are available */}
          <div className="flex gap-3 mb-6">
            <a href="#" aria-label="Follow us on Facebook"  className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs hover:bg-gray-600 transition-colors">f</a>
            <a href="#" aria-label="Follow us on X"         className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs hover:bg-gray-600 transition-colors">X</a>
            <a href="#" aria-label="Follow us on Instagram" className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs hover:bg-gray-600 transition-colors">ig</a>
            <a href="#" aria-label="Subscribe on YouTube"   className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs hover:bg-gray-600 transition-colors">yt</a>
          </div>
          <a href="mailto:coordinator@lindholmen.se" className="text-sm text-gray-400 hover:text-white transition-colors">
            coordinator@lindholmen.se
          </a>
        </div>

        {/* Column 2: Quick links */}
        <div>
          <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-gray-300">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {quickLinks.map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: EU funding acknowledgement */}
        <div>
          <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-gray-300">About the Project</h4>
          {/* TODO: Confirm exact EU credit line wording with coordinator */}
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Co-funded by the European Union under the Creative Europe programme,
            Large Scale Cooperation strand. Grant Agreement No. 101255680.
          </p>
          <ul className="space-y-1 text-xs text-gray-500">
            <li>Duration: Feb 2026 – July 2028</li>
            <li>Coordinator: Lindholmen Science Park</li>
            <li>15 partners · 10 countries</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        {/* TODO: Add Privacy Policy page and link */}
        © {new Date().getFullYear()} Immersive ECHO. All rights reserved.
      </div>
    </footer>
  )
}
