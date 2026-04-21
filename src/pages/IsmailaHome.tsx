import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dither } from '@/components/Dither/Dither'

const stats = [
  { value: 15, label: 'Partners' },
  { value: 10, label: 'Countries' },
  { value: 30, label: 'Months' },
  { value: 2,  label: 'Public Testbeds' },
]

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function IsmailaHome() {
  const navigate = useNavigate()
  const ditherRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [statValues, setStatValues] = useState(stats.map(() => 0))
  const reduceMotion = prefersReducedMotion()

  // Dark body background for this page, restore on unmount
  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#010440'
    return () => { document.body.style.backgroundColor = prev }
  }, [])

  // Subtle parallax on the fixed Dither canvas
  useEffect(() => {
    if (reduceMotion) return
    const handleScroll = () => {
      if (ditherRef.current) {
        ditherRef.current.style.transform = `translateY(${window.scrollY * 0.12}px)`
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

  // Count-up stats — triggered by IntersectionObserver on the stats strip
  useEffect(() => {
    const node = statsRef.current
    if (!node) return

    if (reduceMotion) {
      setStatValues(stats.map(s => s.value))
      return
    }

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
              if (elapsed < 0) {
                requestAnimationFrame(tick)
                return
              }
              const t = Math.min(elapsed / DURATION, 1)
              const v = Math.round(stat.value * easeOut(t))
              setStatValues(prev => {
                const next = [...prev]
                next[i] = v
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
        .scroll-line {
          animation: scrollPulse 2s ease-in-out infinite;
          transform-origin: top center;
        }

        /* Shine-sweep CTA */
        .shine-cta { position: relative; overflow: hidden; isolation: isolate; }
        .shine-cta::before {
          content: '';
          position: absolute;
          top: 0; left: -120%;
          width: 60%; height: 100%;
          background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.45) 50%, transparent 80%);
          transition: left 700ms cubic-bezier(0.2, 0.8, 0.2, 1);
          pointer-events: none;
          z-index: 1;
        }
        .shine-cta:hover::before { left: 120%; }
        .shine-cta > * { position: relative; z-index: 2; }

        @media (prefers-reduced-motion: reduce) {
          .fade-up     { animation: none; opacity: 1 !important; transform: none !important; }
          .scroll-line { animation: none; opacity: 0.6; }
          .shine-cta::before { display: none; }
        }
      `}</style>

      {/* ── Full-page Dither background ─────────────────────────────── */}
      <div
        ref={ditherRef}
        style={{
          position: 'fixed',
          inset: 0,
          top: '-10%',
          height: '120%',
          zIndex: -1,
          willChange: 'transform',
        }}
      >
        <Dither
          waveColor={[0.18, 0.12, 0.55]}
          colorNum={4}
          pixelSize={2}
          waveSpeed={0.05}
          waveFrequency={2.5}
          waveAmplitude={0.2}
          enableMouseInteraction
          mouseRadius={0.1}
          disableAnimation={reduceMotion}
        />
      </div>

      {/* ── Hero — full viewport height, breaks out of Layout padding ─── */}
      <div
        className="relative overflow-hidden mb-8"
        style={{
          minHeight: 'calc(100svh - 80px)',
          marginLeft: 'calc(var(--page-pad) * -1)',
          marginRight: 'calc(var(--page-pad) * -1)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-bg-blue/20 via-transparent to-bg-blue/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-blue/40 via-transparent to-bg-blue/40 pointer-events-none" />

        <div
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24"
          style={{ minHeight: 'calc(100svh - 80px)' }}
        >
          <span
            className="fade-up border border-highlight-purple text-highlight-purple px-3 py-1 text-xs font-bold rounded tracking-widest uppercase mb-8"
            style={{ animationDelay: '0ms' }}
          >
            Creative Europe
          </span>

          <h1
            className="fade-up text-white font-extrabold mb-5"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(3.5rem, 18vw, 12rem)',
              letterSpacing: '0.02em',
              lineHeight: 0.95,
              animationDelay: '150ms',
            }}
          >
            IMMERSIVE<br />ECHO
          </h1>

          <p
            className="fade-up text-white/65 max-w-md"
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.25rem',
              lineHeight: 1.65,
              animationDelay: '500ms',
            }}
          >
            Creating Collective Immersive Experiences<br />for European Cultural Heritage
          </p>

          <div
            className="fade-up absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ animationDelay: '900ms' }}
          >
            <span className="text-white/30 text-xs uppercase tracking-widest">Scroll</span>
            <div className="scroll-line w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* ── Stats strip ────────────────────────────────────────────── */}
      <div
        ref={statsRef}
        data-reveal
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)' }}
        className="grid grid-cols-2 md:grid-cols-4 gap-px bg-light-blue/20 border border-light-blue/30 rounded-xl overflow-hidden mb-14"
      >
        {stats.map(({ label }, i) => (
          <div key={label} className="bg-bg-blue/60 backdrop-blur-sm px-6 py-5 text-center">
            <div className="text-3xl font-extrabold text-highlight-green mb-1 tabular-nums">
              {statValues[i]}
            </div>
            <div className="text-xs uppercase tracking-widest text-white/50">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Mission ────────────────────────────────────────────────── */}
      <div className="mb-14">
        <p
          data-reveal
          className="text-xs font-bold uppercase tracking-widest text-highlight-purple mb-8"
          style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)' }}
        >
          The Mission
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div
            data-reveal
            className="md:col-span-2 space-y-5 text-base leading-relaxed text-white/80"
            style={{ fontFamily: 'Georgia, serif', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)' }}
          >
            <p>
              Cultural heritage exists because people need it. Not as a record of the past, but as a
              living connection — to place, to community, to the stories that explain who we are and
              how we got here. Yet for millions of people across Europe, that connection is breaking
              down. Not because the stories have lost their power, but because the spaces and formats
              meant to carry them haven't kept pace with the people they're meant to serve.
            </p>
            <p>
              Smaller cultural heritage institutions feel this most acutely. Without the resources of
              major flagships, they watch audiences shrink, younger generations drift, and communities
              that were never quite reflected in their collections stop showing up at all. The tools
              to change this — immersive, multi-sensory experiences that surround you with a story
              rather than presenting it from behind glass — exist, but remain out of reach for most.
            </p>
            <p>
              Immersive ECHO starts from a different premise: that heritage is most powerful when
              it's felt collectively, in shared spaces, by people who might not have sought it out on
              their own. The project's mission is not to digitize culture or dazzle with technology —
              it's to give cultural institutions across Europe the practical means to bring people
              back into the story. Their story.
            </p>
          </div>

          <div
            data-reveal
            data-reveal-delay="200"
            style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)' }}
            className="border-l-2 border-highlight-purple pl-7 flex flex-col justify-center"
          >
            <div
              className="text-5xl text-highlight-purple/25 mb-3 leading-none"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              &ldquo;
            </div>
            <p
              className="text-white/90 italic leading-relaxed"
              style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem' }}
            >
              Heritage is most powerful when it's felt collectively, in shared spaces, by people who
              might not have sought it out on their own.
            </p>
            <div className="w-8 h-px bg-highlight-purple/40 mt-5" />
          </div>
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────────────── */}
      <div
        data-reveal
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)' }}
        className="border-t border-light-blue/30 my-10 relative"
      >
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 text-xs text-highlight-purple uppercase tracking-widest bg-bg-blue">
          Stay Connected
        </span>
      </div>

      {/* ── Newsletter CTA ─────────────────────────────────────────── */}
      <div
        data-reveal
        style={{
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)',
          backgroundColor: 'rgba(33, 40, 166, 0.45)',
          boxShadow: 'inset 0 0 60px rgba(49, 56, 217, 0.15)',
        }}
        className="relative border border-light-blue rounded-xl overflow-hidden py-16 px-8 text-center max-w-2xl mx-auto mb-10 backdrop-blur-sm"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-highlight-purple mb-3">
          Newsletter
        </p>
        <p
          className="font-bold text-lg text-white mb-7"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Stay updated on Immersive ECHO
        </p>
        <button
          onClick={() => navigate('/newsletter')}
          className="shine-cta px-10 py-3 bg-highlight-green text-bg-blue rounded-lg font-bold text-xs uppercase tracking-widest
                     hover:shadow-[0_0_20px_#7EF28F,0_0_40px_rgba(126,242,143,0.25)] transition-shadow duration-300 cursor-pointer"
        >
          Subscribe to our Newsletter
        </button>
      </div>

    </div>
  )
}
