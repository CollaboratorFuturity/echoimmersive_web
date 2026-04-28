import { Dither } from '@/components/Dither/Dither'

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function UnderConstruction() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundColor: '#202124' }}
    >
      {/* Dither background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Dither
          waveColor={[0.55, 0.20, 0.65]}
          colorNum={4}
          pixelSize={2}
          waveSpeed={0.04}
          waveFrequency={2.5}
          waveAmplitude={0.22}
          enableMouseInteraction
          mouseRadius={0.1}
          disableAnimation={reduceMotion()}
        />
      </div>

      {/* Gradient overlay for text legibility */}
      <div className="fixed inset-0 bg-brand-charcoal/60 pointer-events-none" style={{ zIndex: 1 }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        .dot { animation: pulse 1.8s ease-in-out infinite; }
        .dot:nth-child(2) { animation-delay: 0.3s; }
        .dot:nth-child(3) { animation-delay: 0.6s; }

        @media (prefers-reduced-motion: reduce) {
          .dot { animation: none; opacity: 0.7; }
        }
      `}</style>

      {/* All content sits above the Dither + overlay */}
      <div className="relative flex flex-col items-center justify-center text-center" style={{ zIndex: 2 }}>

      {/* Logo */}
      <img
        src="/logos/logo-horizontal-light.png"
        alt="Immersive ECHO"
        className="h-10 w-auto mb-16 opacity-90"
      />

      {/* Eyebrow */}
      <p
        className="text-xs font-bold uppercase tracking-widest mb-6"
        style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(218,128,255,0.8)' }}
      >
        Creative Europe · 2026–2028
      </p>

      {/* Heading */}
      <h1
        className="font-extrabold uppercase mb-6"
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 'clamp(2.4rem, 8vw, 6rem)',
          letterSpacing: '-0.01em',
          lineHeight: 0.95,
          color: '#F7F3E0',
        }}
      >
        Something<br />is coming.
      </h1>

      {/* Subline */}
      <p
        className="max-w-sm mb-12"
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: 'rgba(247,243,224,0.5)',
        }}
      >
        Immersive ECHO is a pan-European project creating collective cultural heritage experiences.
        This site launches soon.
      </p>

      {/* Animated dots */}
      <div className="flex gap-2">
        <span className="dot w-2 h-2 rounded-full bg-brand-lilac inline-block" />
        <span className="dot w-2 h-2 rounded-full bg-brand-lilac inline-block" />
        <span className="dot w-2 h-2 rounded-full bg-brand-lilac inline-block" />
      </div>

      </div>

      {/* EU credit — pinned to bottom, above overlay */}
      <p
        className="fixed bottom-6 text-xs"
        style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.2)', zIndex: 2 }}
      >
        Co-funded by the European Union · Creative Europe · GA No. 101255680
      </p>
    </div>
  )
}
