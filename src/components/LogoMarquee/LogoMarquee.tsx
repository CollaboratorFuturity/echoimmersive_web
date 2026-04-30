const logos = [
  'AIRA', 'COG', 'FFV', 'FUT', 'GPI', 'ID20', 'KIKK',
  'LSP', 'NPIAT', 'TPL', 'TSC', 'VGR', 'VIB', 'YOU',
]

export default function LogoMarquee() {
  // Duplicate the list so the translateX(-50%) loop is seamless
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
        {items.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="flex items-center justify-center px-8 shrink-0"
            style={{ height: '90px', minWidth: '160px' }}
          >
            <img
              src={`/logos/partner_logos/${name}.png`}
              alt={name}
              loading="lazy"
              className="max-h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
