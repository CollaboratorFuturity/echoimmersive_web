import { Link } from 'react-router-dom'

const pilots = [
  {
    id: 'snapsting',
    badge: 'PRIMARY TESTBED',
    title: 'Snapsting — Museum Viborg',
    location: 'Viborg, Denmark',
    imageLabel: '[Photo: Viborg Snapsting]',
    activitiesHref: '/pilots/snapsting',
  },
  {
    id: 'pavillon',
    badge: 'SCALING & ADAPTATION',
    title: 'Le Pavillon',
    location: 'Namur, Belgium',
    imageLabel: '[Photo: Le Pavillon Namur]',
    activitiesHref: '/pilots/pavillon',
  },
]

export default function Pilots() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 border-b border-brand-purple/30 pb-2 text-brand-cream">
        Public Testbeds & Pilots
      </h1>
      <p className="mb-8 max-w-3xl" style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.7)' }}>
        Introducing the concept of public testbeds using the Needs-Driven Design methodology across Europe.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pilots.map(({ id, badge, title, location, imageLabel, activitiesHref }) => (
          <div
            key={id}
            className="border border-brand-purple/35 bg-brand-plum/20 p-6 rounded-lg transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_20px_rgba(218,128,255,0.12)]"
          >
            <div className="border border-brand-purple/25 bg-brand-plum/30 h-48 mb-4 flex items-center justify-center text-sm rounded-lg" style={{ color: 'rgba(247,243,224,0.35)' }}>
              {imageLabel}
            </div>
            <span
              className="border border-brand-lilac/50 text-brand-lilac px-2 py-1 text-xs font-bold mb-3 inline-block rounded"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {badge}
            </span>
            <h2 className="text-2xl font-bold mb-1 text-brand-cream">{title}</h2>
            <h3 className="text-base mb-4" style={{ color: 'rgba(247,243,224,0.5)' }}>📍 {location}</h3>
            <div className="space-y-2 mb-5">
              <div className="h-4 rounded w-full bg-brand-plum/40" />
              <div className="h-4 rounded w-full bg-brand-plum/40" />
              <div className="h-4 rounded w-3/4 bg-brand-plum/40" />
            </div>
            <Link
              to={activitiesHref}
              className="inline-block border border-brand-lilac text-brand-lilac px-4 py-2 text-sm font-bold uppercase rounded-md transition-all duration-300 hover:bg-brand-lilac/10 hover:shadow-[0_0_12px_rgba(218,128,255,0.3)]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              View Activities
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
