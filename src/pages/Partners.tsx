export default function Partners() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-8 border-b border-brand-purple/30 pb-2 text-brand-cream">
        The Consortium
      </h1>

      {/* Coordinator */}
      <section className="mb-12 text-center">
        <h2 className="text-xl font-bold mb-4 text-brand-cream">Project Coordinator</h2>
        {/* TODO: Replace with real LSP logo */}
        <div className="border border-brand-purple/35 bg-brand-plum/20 w-64 h-32 mx-auto flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_16px_rgba(218,128,255,0.2)]" style={{ color: 'rgba(218,128,255,0.6)' }}>
          [LSP LOGO]
        </div>
        <p className="text-sm mt-3" style={{ color: 'rgba(247,243,224,0.45)' }}>Lindholmen Science Park, Gothenburg, Sweden</p>
      </section>

      {/* Core Partners */}
      <section className="mb-12">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-center text-brand-cream">Core Partners</h2>
        {/* TODO: Replace placeholders with real partner logos + links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 14 }, (_, i) => (
            <div
              key={i}
              className="border border-brand-purple/30 bg-brand-plum/15 h-24 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-all duration-300 hover:border-brand-lilac hover:bg-brand-plum/30 hover:shadow-[0_0_12px_rgba(218,128,255,0.15)]"
              style={{ color: 'rgba(247,243,224,0.35)' }}
            >
              [Partner {i + 1}]
            </div>
          ))}
        </div>
      </section>

      {/* Associated Partners */}
      <section>
        <h2 className="text-lg md:text-xl font-bold mb-4 text-center text-brand-cream">Associated Partners</h2>
        {/* TODO: Replace with real associated partner logos */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="border border-dashed border-brand-purple/25 h-20 flex items-center justify-center text-sm rounded-lg"
              style={{ color: 'rgba(247,243,224,0.3)' }}
            >
              [Assoc. {i + 1}]
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
