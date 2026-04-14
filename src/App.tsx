import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Partners from '@/pages/Partners'
import Pilots from '@/pages/Pilots'
import News from '@/pages/News'
import FAQ from '@/pages/FAQ'
import Contact from '@/pages/Contact'
import Newsletter from '@/pages/Newsletter'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-6xl mx-auto w-full p-4 md:p-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Newsletter is full-screen — no header/footer */}
        <Route path="/newsletter" element={<Newsletter />} />

        {/* All other pages use the standard layout */}
        <Route path="/"          element={<Layout><Home /></Layout>} />
        <Route path="/about"     element={<Layout><About /></Layout>} />
        <Route path="/partners"  element={<Layout><Partners /></Layout>} />
        <Route path="/pilots"    element={<Layout><Pilots /></Layout>} />
        <Route path="/news"      element={<Layout><News /></Layout>} />
        <Route path="/faq"       element={<Layout><FAQ /></Layout>} />
        <Route path="/contact"   element={<Layout><Contact /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
