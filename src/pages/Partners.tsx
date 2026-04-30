type Partner = { file: string; name: string }

const corePartners: Partner[] = [
  { file: 'AIRA', name: 'AIRA Dance Company' },
  { file: 'COG', name: 'City of Gothenburg' },
  { file: 'FFV', name: 'Flora&Fauna Visions' },
  { file: 'FUT', name: 'Futurity Systems' },
  { file: 'GPI', name: 'Grand Palais Immersif' },
  { file: 'ID20', name: 'Zavod ID20' },
  { file: 'KIKK', name: 'KIKK Festival' },
  { file: 'KIKK_', name: 'Le Pavillion' },
  { file: 'NPIAT', name: 'New Practice in Art & Technology' },
  { file: 'TPL', name: 'The Point Labs' },
  { file: 'TSC', name: 'The Storytelling Company' },
  { file: 'VGR', name: 'Västra Götalandsregionen' },
  { file: 'VIB', name: 'Viborg Museum' },
  { file: 'VIB_', name: 'The Animation Workshop' },
  { file: 'YOU', name: 'Younite AI' },
]

export default function Partners() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-8 border-b border-brand-purple/30 pb-2 text-brand-cream">
        The Consortium
      </h1>

      {/* Coordinator */}
      <section className="mb-12 text-center">
        <h2 className="text-xl font-bold mb-4 text-brand-cream">Project Coordinator</h2>
        <div className="w-64 mx-auto">
          <div className="border border-brand-purple/35 bg-brand-plum/20 h-32 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_16px_rgba(218,128,255,0.2)] p-4">
            <img
              src="/logos/partner_logos/LSP.png"
              alt="Lindholmen Science Park"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <p className="text-sm mt-2 text-brand-cream">Lindholmen Science Park</p>
        </div>
        <p className="text-sm mt-1" style={{ color: 'rgba(247,243,224,0.45)' }}>Gothenburg, Sweden</p>
      </section>

      {/* Core Partners */}
      <section className="mb-12">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-center text-brand-cream">Core Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {corePartners.map((partner, i) => (
            <div key={`${partner.file}-${i}`} className="flex flex-col">
              <div className="border border-brand-purple/30 bg-brand-plum/15 h-24 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 hover:border-brand-lilac hover:bg-brand-plum/30 hover:shadow-[0_0_12px_rgba(218,128,255,0.15)] p-3">
                <img
                  src={`/logos/partner_logos/${partner.file}.png`}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-xs text-center mt-2 text-brand-cream/80">{partner.name}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
