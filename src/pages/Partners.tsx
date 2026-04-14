export default function Partners() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8 border-b-2 border-gray-400 pb-2">
        The Consortium
      </h1>

      {/* Coordinator */}
      <section className="mb-12 text-center">
        <h2 className="text-xl font-bold mb-4">Project Coordinator</h2>
        {/* TODO: Replace with real LSP logo */}
        <div className="border-2 border-gray-400 bg-gray-200 w-64 h-32 mx-auto flex items-center justify-center text-gray-500 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors">
          [LSP LOGO]
        </div>
        <p className="text-sm text-gray-500 mt-3">Lindholmen Science Park, Gothenburg, Sweden</p>
      </section>

      {/* Core Partners */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-center">Core Partners</h2>
        {/* TODO: Replace placeholders with real partner logos + links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 14 }, (_, i) => (
            <div
              key={i}
              className="border-2 border-gray-400 bg-gray-200 h-24 flex items-center justify-center text-gray-500 text-sm rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
            >
              [Partner {i + 1}]
            </div>
          ))}
        </div>
      </section>

      {/* Associated Partners */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-center">Associated Partners</h2>
        {/* TODO: Replace with real associated partner logos */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="border-2 border-dashed border-gray-400 h-20 flex items-center justify-center text-gray-500 text-sm rounded-lg"
            >
              [Assoc. {i + 1}]
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
