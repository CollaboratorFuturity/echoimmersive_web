import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import DitherBackground from '@/components/DitherBackground/DitherBackground'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Partners from '@/pages/Partners'
import Experiences from '@/pages/Experiences'
import SnapstingActivities from '@/pages/SnapstingActivities'
import PavillonActivities from '@/pages/PavillonActivities'
import News from '@/pages/News'
import NewsLaunch from '@/pages/news/Launch'
import FAQ from '@/pages/FAQ'
import Contact from '@/pages/Contact'
import Newsletter from '@/pages/Newsletter'
import Resources from '@/pages/Resources'
import LynchHome from '@/pages/LynchHome'
import LynchAbout from '@/pages/LynchAbout'
import IsmailaHome from '@/pages/IsmailaHome'
import BrandHome from '@/pages/BrandHome'
import UnderConstruction from '@/pages/UnderConstruction'

// Pages that render their own background (no shared Dither)
const NO_DITHER_ROUTES = ['/lynch-home', '/resources']

// Per-route section names for document.title (WCAG 2.4.2 Page Titled).
// Unlisted routes (e.g. style test pages) fall back to the bare site name.
const PAGE_TITLES: Record<string, string> = {
  '/about': 'About',
  '/partners': 'Partners',
  '/experiences': 'Experiences',
  '/experiences/snapsting': 'Snapsting Activities',
  '/experiences/pavillon': 'Le Pavillon Activities',
  '/news': 'News & Events',
  '/news/launch': 'Launch Event',
  '/faq': 'FAQ',
  '/contact': 'Contact',
  '/resources': 'Resources',
  '/newsletter': 'Newsletter',
  '/underconstruction': 'Under Construction',
}

function PageTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    const section = PAGE_TITLES[pathname]
    document.title = section ? `${section} — Immersive ECHO` : 'Immersive ECHO'
  }, [pathname])
  return null
}

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const showDither = !NO_DITHER_ROUTES.includes(pathname)
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link — visually hidden until keyboard-focused (WCAG 2.4.1 Bypass Blocks) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-brand-charcoal focus:text-brand-cream focus:border focus:border-brand-lilac"
      >
        Skip to main content
      </a>
      {showDither && <DitherBackground />}
      <Header />
      <main id="main-content" className="flex-grow max-w-6xl mx-auto w-full p-4 md:p-8">
        {/* key={pathname} forces remount on navigation — restarts the page-fade animation */}
        <div key={pathname} className="page-fade">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageTitle />
      <Routes>
        {/* Full-screen pages — no header/footer */}
        <Route path="/newsletter"        element={<Newsletter />} />
        <Route path="/underconstruction" element={<UnderConstruction />} />

        {/* All other pages use the standard layout */}
        <Route path="/"          element={<Layout><Home /></Layout>} />
        <Route path="/about"     element={<Layout><About /></Layout>} />
        <Route path="/partners"  element={<Layout><Partners /></Layout>} />
        <Route path="/experiences"           element={<Layout><Experiences /></Layout>} />
        <Route path="/experiences/snapsting" element={<Layout><SnapstingActivities /></Layout>} />
        <Route path="/experiences/pavillon"  element={<Layout><PavillonActivities /></Layout>} />
        <Route path="/news"        element={<Layout><News /></Layout>} />
        <Route path="/news/launch" element={<Layout><NewsLaunch /></Layout>} />
        <Route path="/faq"       element={<Layout><FAQ /></Layout>} />
        <Route path="/contact"   element={<Layout><Contact /></Layout>} />
        <Route path="/resources" element={<Layout><Resources /></Layout>} />

        {/* Style test pages — dark brand palette */}
        <Route path="/lynch-home"    element={<Layout><LynchHome /></Layout>} />
        <Route path="/lynch-about"   element={<Layout><LynchAbout /></Layout>} />
        <Route path="/ismaila-home"  element={<Layout><IsmailaHome /></Layout>} />
        <Route path="/brand-home"    element={<Layout><BrandHome /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
