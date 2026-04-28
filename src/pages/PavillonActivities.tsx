import { Link } from 'react-router-dom'

export default function PavillonActivities() {
  return (
    <>
      <Link to="/pilots" className="text-sm text-brand-lilac hover:text-brand-lilac/80 transition-colors mb-4 inline-block" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        ← Back to Pilots
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold mb-4 border-b border-brand-purple/30 pb-2 text-brand-cream">
        Le Pavillon · Activities
      </h1>
      <p className="mb-8 max-w-3xl" style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.7)' }}>
        {/* TODO: Add real intro about Le Pavillon activities */}
        Overview of Le Pavillon testbed activities in Namur, Belgium.
      </p>

      {/* TODO: Populate with real activity cards */}
      <div className="space-y-4">
        <div className="border border-brand-purple/35 bg-brand-plum/20 p-6 rounded-lg">
          <div className="h-4 bg-brand-plum/40 rounded w-1/3 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-brand-plum/40 rounded w-full" />
            <div className="h-3 bg-brand-plum/40 rounded w-5/6" />
          </div>
        </div>
        <div className="border border-brand-purple/35 bg-brand-plum/20 p-6 rounded-lg">
          <div className="h-4 bg-brand-plum/40 rounded w-1/4 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-brand-plum/40 rounded w-full" />
            <div className="h-3 bg-brand-plum/40 rounded w-3/4" />
          </div>
        </div>
      </div>

      <p className="text-center max-w-3xl mx-auto my-12" style={{ fontFamily: 'Roboto, sans-serif', fontStyle: 'italic', color: 'rgba(247,243,224,0.45)', fontSize: '0.875rem' }}>
        Note: Description on process from early briefs, over concept development, script, animatic etc… to final experience.
        The museum is the "final director".
      </p>
    </>
  )
}
