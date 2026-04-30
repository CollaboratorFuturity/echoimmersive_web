type Partner = { file: string; name: string; url: string }

const corePartners: Partner[] = [
  { file: 'AIRA', name: 'AIRA Dance Company', url: 'https://www.danscentrum.se/airadancecompany' },
  { file: 'COG', name: 'City of Gothenburg', url: 'https://goteborg.se/' },
  { file: 'FFV', name: 'Flora&Fauna Visions', url: 'https://www.florafaunavisions.de/' },
  { file: 'GPI', name: 'Grand Palais Immersif', url: 'https://grandpalais-immersif.fr/' },
  { file: 'ID20', name: 'Zavod ID20', url: 'https://www.id20.si/en/front-page/' },
  { file: 'KIKK', name: 'KIKK Festival', url: 'https://www.kikk.be/' },
  { file: 'KIKK_', name: 'Le Pavillion', url: 'https://www.le-pavillon.be/' },
  { file: 'NPIAT', name: 'New Practice in Art & Technology', url: 'https://www.newpractice.net/' },
  { file: 'TPL', name: 'The Point Labs', url: 'https://thepointlabs.io/' },
  { file: 'TSC', name: 'The Storytelling Company', url: 'https://www.storytellingcompany.com/' },
  { file: 'VGR', name: 'Västra Götalandsregionen', url: 'https://www.vgregion.se/' },
  { file: 'VIB', name: 'Viborg Museum', url: 'https://viborgmuseum.dk/' },
  { file: 'VIB_', name: 'The Animation Workshop', url: 'https://animationworkshop.via.dk/' },
  { file: 'YOU', name: 'Younite AI', url: 'https://younite.ai/' },
]

export default function Partners() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-8 border-b border-brand-purple/30 pb-2 text-brand-cream">
        The Consortium
      </h1>

      {/* Leadership */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-brand-cream">Project Coordinator</h2>
            <a
              href="https://www.lindholmen.se/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-64 mx-auto block group"
            >
              <div className="border border-brand-purple/35 bg-brand-plum/20 h-32 flex items-center justify-center rounded-lg transition-all duration-300 group-hover:border-brand-lilac group-hover:shadow-[0_0_16px_rgba(218,128,255,0.2)] p-4">
                <img
                  src="/logos/partner_logos/LSP.png"
                  alt="Lindholmen Science Park"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-sm mt-2 text-brand-cream group-hover:text-brand-lilac transition-colors">Lindholmen Science Park</p>
            </a>
            <p className="text-sm mt-1" style={{ color: 'rgba(247,243,224,0.45)' }}>Gothenburg, Sweden</p>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-brand-cream">Communication &amp; Dissemination</h2>
            <a
              href="https://www.futurity.systems/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-64 mx-auto block group"
            >
              <div className="border border-brand-purple/35 bg-brand-plum/20 h-32 flex items-center justify-center rounded-lg transition-all duration-300 group-hover:border-brand-lilac group-hover:shadow-[0_0_16px_rgba(218,128,255,0.2)] p-4">
                <img
                  src="/logos/partner_logos/FUT.png"
                  alt="Futurity Systems"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-sm mt-2 text-brand-cream group-hover:text-brand-lilac transition-colors">Futurity Systems</p>
            </a>
            <p className="text-sm mt-1" style={{ color: 'rgba(247,243,224,0.45)' }}>Barcelona, Spain</p>
          </div>
        </div>
      </section>

      {/* Core Partners */}
      <section className="mb-12">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-center text-brand-cream">Core Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {corePartners.map((partner, i) => (
            <a
              key={`${partner.file}-${i}`}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col group"
            >
              <div className="border border-brand-purple/30 bg-brand-plum/15 h-24 flex items-center justify-center rounded-lg transition-all duration-300 group-hover:border-brand-lilac group-hover:bg-brand-plum/30 group-hover:shadow-[0_0_12px_rgba(218,128,255,0.15)] p-3">
                <img
                  src={`/logos/partner_logos/${partner.file}.png`}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-xs text-center mt-2 text-brand-cream/80 group-hover:text-brand-lilac transition-colors">{partner.name}</p>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
