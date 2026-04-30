import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LineWaves from '@/components/LineWaves/LineWaves'
import LogoMarquee from '@/components/LogoMarquee/LogoMarquee'

const stats = [
  { value: 15, label: 'Partners' },
  { value: 10, label: 'Countries' },
  { value: 30, label: 'Months' },
  { value: 2,  label: 'Public Testbeds' },
]

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function LynchHome() {
  const navigate = useNavigate()
  const waveRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [statValues, setStatValues] = useState(stats.map(() => 0))
  const reduceMotion = prefersReducedMotion()

  // Subtle parallax on the fixed LineWaves canvas
  useEffect(() => {
    if (reduceMotion) return
    const handleScroll = () => {
      if (waveRef.current) {
        waveRef.current.style.transform = `translateY(${window.scrollY * 0.12}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reduceMotion])

  // Scroll-triggered reveals
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (reduceMotion) {
      els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' })
      return
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement
          const delay = parseInt(el.dataset.revealDelay ?? '0')
          setTimeout(() => {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          }, delay)
          observer.unobserve(el)
        }
      }),
      { threshold: 0.15 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [reduceMotion])

  // Count-up stats
  useEffect(() => {
    const node = statsRef.current
    if (!node) return
    if (reduceMotion) { setStatValues(stats.map(s => s.value)); return }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          observer.disconnect()
          const DURATION = 1200
          const STAGGER = 120
          const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
          stats.forEach((stat, i) => {
            const start = performance.now() + i * STAGGER
            const tick = (now: number) => {
              const elapsed = now - start
              if (elapsed < 0) { requestAnimationFrame(tick); return }
              const t = Math.min(elapsed / DURATION, 1)
              setStatValues(prev => {
                const next = [...prev]
                next[i] = Math.round(stat.value * easeOut(t))
                return next
              })
              if (t < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          })
        })
      },
      { threshold: 0.4 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduceMotion])

  return (
    <div
      className="relative"
      style={{
        marginLeft: 'calc(var(--page-pad, 1rem) * -1)',
        marginRight: 'calc(var(--page-pad, 1rem) * -1)',
        marginTop: 'calc(var(--page-pad, 1rem) * -1)',
        paddingLeft: 'var(--page-pad, 1rem)',
        paddingRight: 'var(--page-pad, 1rem)',
        paddingTop: 'var(--page-pad, 1rem)',
      }}
    >

      <style>{`
        :root { --page-pad: 1rem; }
        @media (min-width: 640px) { :root { --page-pad: 1.5rem; } }
        @media (min-width: 768px) { :root { --page-pad: 2rem; } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 700ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50%      { opacity: 0.8; transform: scaleY(1.3); }
        }
        .scroll-line { animation: scrollPulse 2s ease-in-out infinite; transform-origin: top center; }
        .shine-cta { position: relative; overflow: hidden; isolation: isolate; }
        .shine-cta::before {
          content: '';
          position: absolute;
          top: 0; left: -120%;
          width: 60%; height: 100%;
          background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%);
          transition: left 700ms cubic-bezier(0.2, 0.8, 0.2, 1);
          pointer-events: none;
          z-index: 1;
        }
        .shine-cta:hover::before { left: 120%; }
        .shine-cta > * { position: relative; z-index: 2; }

        @media (prefers-reduced-motion: reduce) {
          .fade-up    { animation: none; opacity: 1 !important; transform: none !important; }
          .scroll-line { animation: none; opacity: 0.6; }
          .shine-cta::before { display: none; }
        }
      `}</style>

      {/* LineWaves background */}
      <div
        ref={waveRef}
        style={{ position: 'fixed', inset: 0, top: '-50%', height: '200%', zIndex: -1, willChange: 'transform' }}
      >
        <LineWaves
          speed={0.05}
          innerLineCount={19}
          outerLineCount={36}
          warpIntensity={0.9}
          rotation={-45}
          edgeFadeWidth={0}
          colorCycleSpeed={0.8}
          brightness={0.15}
          color1="#8843A3"
          color2="#8843A3"
          color3="#8843A3"
          enableMouseInteraction
          mouseInfluence={0.8}
        />
      </div>

      {/* Hero */}
      <div
        className="relative overflow-hidden mb-8"
        style={{ minHeight: 'calc(100svh - 80px)', marginLeft: 'calc(var(--page-pad) * -1)', marginRight: 'calc(var(--page-pad) * -1)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/30 via-transparent to-brand-charcoal/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/40 via-transparent to-brand-charcoal/40 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 sm:px-16 md:px-12 py-24" style={{ minHeight: 'calc(100svh - 80px)' }}>
          <span
            className="fade-up border border-brand-lilac text-brand-lilac px-3 py-1 text-xs font-bold rounded tracking-widest uppercase mb-8"
            style={{ fontFamily: 'Montserrat, sans-serif', animationDelay: '0ms' }}
          >
            Creative Europe
          </span>

          <h1
            className="fade-up text-brand-cream font-extrabold mb-5 uppercase w-full"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(1.8rem, 11vw, 11rem)', letterSpacing: '-0.01em', lineHeight: 0.92, animationDelay: '150ms' }}
          >
            Immersive<br />Echo
          </h1>

          <p
            className="fade-up max-w-md"
            style={{ fontFamily: 'Roboto, sans-serif', fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)', lineHeight: 1.7, color: 'rgba(247,243,224,0.65)', animationDelay: '500ms' }}
          >
            Creating Collective Immersive Experiences<br />for European Cultural Heritage
          </p>

          <div className="fade-up absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ animationDelay: '900ms' }}>
            <span className="text-xs uppercase tracking-widest" style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(247,243,224,0.3)' }}>Scroll</span>
            <div className="scroll-line w-px h-8 bg-gradient-to-b from-brand-cream/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        ref={statsRef}
        data-reveal
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)' }}
        className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-lilac/20 border border-brand-lilac/25 rounded-xl overflow-hidden mb-14"
      >
        {stats.map(({ label }, i) => (
          <div key={label} className="bg-brand-charcoal/70 backdrop-blur-sm px-6 py-5 text-center">
            <div className="text-3xl font-extrabold mb-1 tabular-nums text-brand-lilac" style={{ fontFamily: 'Montserrat, sans-serif' }}>{statValues[i]}</div>
            <div className="text-xs uppercase tracking-widest" style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(247,243,224,0.5)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Partner logos marquee */}
      <div
        data-reveal
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)' }}
        className="mb-14"
      >
        <LogoMarquee />
      </div>

      {/* Mission */}
      <div className="mb-14">
        <p data-reveal className="text-xs font-bold uppercase tracking-widest text-brand-lilac mb-8"
           style={{ fontFamily: 'Montserrat, sans-serif', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)' }}>
          The Mission
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div
            data-reveal
            className="md:col-span-2 space-y-5 text-base leading-relaxed"
            style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.8)', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)' }}
          >
            <p>Cultural heritage exists because people need it. It functions as a living connection to place, to community, to the stories that explain who we are and how we got here. Yet for millions of people across Europe, that connection is breaking down. The spaces and formats meant to carry these stories simply haven't kept pace with the people they're meant to serve.</p>
            <p>Smaller cultural heritage institutions feel this most acutely. Without the resources of major flagships, they watch audiences shrink, younger generations drift, and communities that were never quite reflected in their collections stop showing up at all. The tools to change this exist. Immersive, multi-sensory experiences that surround you with a story rather than presenting it from behind glass are proven and powerful. But they remain out of reach for most.</p>
            <p>Immersive ECHO starts from a different premise: that heritage is most powerful when it's felt collectively, in shared spaces, by people who might not have sought it out on their own. The project's mission is to give cultural institutions across Europe the practical means to bring people back into the story. Their story.</p>
          </div>

          <div
            data-reveal
            data-reveal-delay="200"
            style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)' }}
            className="border-l-2 border-brand-lilac pl-7 flex flex-col justify-center"
          >
            <div className="text-5xl mb-3 leading-none text-brand-lilac/30" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>&ldquo;</div>
            <p className="leading-relaxed italic" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '1.05rem', color: 'rgba(247,243,224,0.9)' }}>
              Heritage is most powerful when it's felt collectively, in shared spaces, by people who might not have sought it out on their own.
            </p>
            <div className="w-8 h-px bg-brand-lilac/35 mt-5" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        data-reveal
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)' }}
        className="border-t border-brand-purple/30 my-10 relative"
      >
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 text-xs uppercase tracking-widest text-brand-lilac" style={{ fontFamily: 'Montserrat, sans-serif', backgroundColor: '#202124' }}>
          Stay Connected
        </span>
      </div>

      {/* Newsletter CTA */}
      <div
        data-reveal
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)', backgroundColor: 'rgba(90,66,99,0.35)', boxShadow: 'inset 0 0 60px rgba(136,67,163,0.12)' }}
        className="relative border border-brand-purple/40 rounded-xl overflow-hidden py-16 px-8 text-center max-w-2xl mx-auto mb-10 backdrop-blur-sm"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-brand-lilac mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Newsletter</p>
        <p className="font-bold text-lg text-brand-cream mb-7" style={{ fontFamily: 'Montserrat, sans-serif' }}>Stay updated on Immersive ECHO</p>
        <button
          onClick={() => navigate('/newsletter')}
          className="shine-cta px-10 py-3 bg-brand-lilac text-brand-charcoal rounded-lg font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_#DA80FF,0_0_40px_rgba(218,128,255,0.25)] transition-shadow duration-300 cursor-pointer"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Subscribe to our Newsletter
        </button>
      </div>

    </div>
  )
}
