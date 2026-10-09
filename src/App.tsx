import { useEffect, useRef } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from 'react-router-dom'
import i18n, { DEFAULT_LANG, SUPPORTED_LANGUAGES, isSupportedLang } from '@/i18n'
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
import NewsletterIssue from '@/pages/news/NewsletterIssue'
import FAQ from '@/pages/FAQ'
import Contact from '@/pages/Contact'
import Newsletter from '@/pages/Newsletter'
import Resources from '@/pages/Resources'
import LynchHome from '@/pages/LynchHome'
import LynchAbout from '@/pages/LynchAbout'
import IsmailaHome from '@/pages/IsmailaHome'
import BrandHome from '@/pages/BrandHome'
import UnderConstruction from '@/pages/UnderConstruction'

// Section paths (language-prefix stripped) that render their own background.
const NO_DITHER_SECTIONS = ['/lynch-home', '/resources']

// Per-section document.title (WCAG 2.4.2). Keyed by the path WITHOUT the
// language prefix. The visible title text itself is translated at render time
// via the PAGE_TITLE_KEYS i18n lookup below; this map is the fallback label.
const PAGE_TITLE_KEYS: Record<string, string> = {
  '/about': 'About',
  '/partners': 'Partners',
  '/experiences': 'Experiences',
  '/experiences/snapsting': 'Snapsting Activities',
  '/experiences/pavillon': 'Le Pavillon Activities',
  '/news': 'News & Events',
  '/news/launch': 'Launch Event',
  '/news/newsletter-1': 'Newsletter No. 1',
  '/faq': 'FAQ',
  '/contact': 'Contact',
  '/resources': 'Resources',
  '/newsletter': 'Newsletter',
  '/underconstruction': 'Under Construction',
}

/** Strip a leading "/{lang}" segment → the section path (always starts "/"). */
function sectionPath(pathname: string): string {
  const seg = pathname.split('/').filter(Boolean)
  if (seg.length && isSupportedLang(seg[0])) seg.shift()
  return '/' + seg.join('/')
}

/** Current language from the URL, or the default. */
function langOf(pathname: string): string {
  const first = pathname.split('/').filter(Boolean)[0]
  return isSupportedLang(first) ? first : DEFAULT_LANG
}

/**
 * Keeps <title>, <html lang> and hreflang alternates in sync with the route.
 * hreflang is injected at runtime (SPA); a prerender/sitemap is the robust
 * long-term path — see the i18n deployment doc.
 */
function PageMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const sp = sectionPath(pathname)
    const section = PAGE_TITLE_KEYS[sp]
    document.title = section ? `${section} — Immersive ECHO` : 'Immersive ECHO'

    const lang = langOf(pathname)
    document.documentElement.lang = lang

    const origin = window.location.origin
    const tail = sp === '/' ? '' : sp
    document.querySelectorAll('link[data-i18n-alt]').forEach((el) => el.remove())
    const alts = [...SUPPORTED_LANGUAGES, 'x-default'] as const
    for (const l of alts) {
      const href = l === 'x-default' ? `${origin}/${DEFAULT_LANG}${tail}` : `${origin}/${l}${tail}`
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = l
      link.href = href
      link.setAttribute('data-i18n-alt', '')
      document.head.appendChild(link)
    }
  }, [pathname])
  return null
}

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const showDither = !NO_DITHER_SECTIONS.includes(sectionPath(pathname))
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

/**
 * Everything under "/:lang". Validates the language segment, syncs i18next to
 * it, and renders the page routes relative to the prefix. A first segment that
 * isn't a supported language is treated as a default-language path and
 * redirected (so old links like /about → /en/about keep working).
 */
function LangRoutes() {
  const { lang } = useParams<{ lang: string }>()
  const location = useLocation()

  // The URL is the source of truth for the language. i18next only updates
  // i18n.language once a language's JSON has finished loading, and it does NOT
  // discard a stale load: if you switch ES → EN before ES has loaded, the slow ES
  // load can finish last and win, leaving the UI in ES on an /en URL. So always
  // request the URL's language, and re-assert it if a stale load overwrote it.
  const wantedLang = useRef<string | undefined>(lang)
  useEffect(() => {
    if (!isSupportedLang(lang)) return
    wantedLang.current = lang
    const apply = (retriesLeft: number) => {
      i18n.changeLanguage(wantedLang.current).then(() => {
        if (retriesLeft > 0 && i18n.language !== wantedLang.current) apply(retriesLeft - 1)
      })
    }
    apply(3)
  }, [lang])

  if (!isSupportedLang(lang)) {
    return <Navigate to={`/${DEFAULT_LANG}${location.pathname}`} replace />
  }

  return (
    <Routes>
      <Route index element={<Layout><Home /></Layout>} />
      <Route path="about" element={<Layout><About /></Layout>} />
      <Route path="partners" element={<Layout><Partners /></Layout>} />
      <Route path="experiences" element={<Layout><Experiences /></Layout>} />
      <Route path="experiences/snapsting" element={<Layout><SnapstingActivities /></Layout>} />
      <Route path="experiences/pavillon" element={<Layout><PavillonActivities /></Layout>} />
      <Route path="news" element={<Layout><News /></Layout>} />
      <Route path="news/launch" element={<Layout><NewsLaunch /></Layout>} />
      <Route path="news/newsletter-1" element={<Layout><NewsletterIssue id="newsletter-1" /></Layout>} />
      <Route path="faq" element={<Layout><FAQ /></Layout>} />
      <Route path="contact" element={<Layout><Contact /></Layout>} />
      <Route path="resources" element={<Layout><Resources /></Layout>} />

      {/* Full-screen pages — no header/footer */}
      <Route path="newsletter" element={<Newsletter />} />
      <Route path="underconstruction" element={<UnderConstruction />} />

      {/* Style test pages — dark brand palette */}
      <Route path="lynch-home" element={<Layout><LynchHome /></Layout>} />
      <Route path="lynch-about" element={<Layout><LynchAbout /></Layout>} />
      <Route path="ismaila-home" element={<Layout><IsmailaHome /></Layout>} />
      <Route path="brand-home" element={<Layout><BrandHome /></Layout>} />

      {/* Unknown sub-path under a valid language → that language's home */}
      <Route path="*" element={<Navigate to={`/${lang}`} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageMeta />
      <Routes>
        {/* Bare root → default (or previously chosen) language */}
        <Route
          path="/"
          element={
            <Navigate
              to={`/${isSupportedLang(i18n.language) ? i18n.language : DEFAULT_LANG}`}
              replace
            />
          }
        />
        {/* Everything else is language-prefixed */}
        <Route path="/:lang/*" element={<LangRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}
