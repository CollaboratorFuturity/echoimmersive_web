type MarqueeSize = 'xl' | 'lg' | 'md' | 'sm'
type MarqueeLogo = { file: string; size?: MarqueeSize }

const sizeClass: Record<MarqueeSize, string> = {
  xl: 'max-h-24',
  lg: 'max-h-20',
  md: 'max-h-16',
  sm: 'max-h-12',
}

const logos: MarqueeLogo[] = [
  { file: 'AIRA' },
  { file: 'COG' },
  { file: 'FFV', size: 'lg' },
  { file: 'FUT', size: 'lg' },
  { file: 'GPI', size: 'xl' },
  { file: 'ID20' },
  { file: 'KIKK', size: 'xl' },
  { file: 'KIKK_', size: 'sm' },
  { file: 'LSP', size: 'sm' },
  { file: 'NPIAT', size: 'xl' },
  { file: 'TAW' },
  { file: 'TPL', size: 'lg' },
  { file: 'TSC', size: 'sm' },
  { file: 'VGR' },
  { file: 'VIB_' },
  { file: 'YOU' },
]

export default function LogoMarquee() {
  const items = [...logos, ...logos]

  return (
    <div
      className="overflow-hidden border border-brand-lilac/25 rounded-xl bg-brand-charcoal/60 backdrop-blur-sm"
      style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
    >
      <style>{`
        @keyframes logoMarquee {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .logo-track {
          display: flex;
          width: max-content;
          animation: logoMarquee 60s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-track { animation: none; transform: translateX(0); }
        }
      `}</style>

      <div className="logo-track">
        {items.map((logo, i) => (
          <div
            key={`${logo.file}-${i}`}
            className="flex items-center justify-center px-8 shrink-0"
            style={{ height: '90px', minWidth: '160px' }}
          >
            <img
              src={`/logos/partner_logos/${logo.file}.png`}
              alt={logo.file}
              loading="lazy"
              className={`w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 ${sizeClass[logo.size ?? 'md']}`}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
