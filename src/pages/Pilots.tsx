import { Link } from 'react-router-dom'

const pilots = [
<<<<<<< HEAD
  {
    id: 'snapsting',
    badge: 'PRIMARY TESTBED',
    title: 'Snapsting - Museum Wibergis',
    location: 'Viborg, Denmark',
    imageLabel: '[Photo: Viborg Snapsting]',
    // TODO: Add real description
    description: null,
    activitiesHref: '/pilots/snapsting',
  },
  {
    id: 'pavillon',
    badge: 'SCALING & ADAPTATION',
    title: 'Le Pavillon',
    location: 'Namur, Belgium',
    imageLabel: '[Photo: Le Pavillon Namur]',
    // TODO: Add real description
    description: null,
    activitiesHref: '/pilots/pavillon',
  },
=======
  { id: 'snapsting', badge: 'PRIMARY TESTBED',      title: 'Snapsting Festival', location: 'Viborg, Denmark',  imageLabel: '[Photo: Viborg Snapsting]' },
  { id: 'pavillon',  badge: 'SCALING & ADAPTATION', title: 'Le Pavillon',        location: 'Namur, Belgium',   imageLabel: '[Photo: Le Pavillon Namur]' },
>>>>>>> 12f8290 (Added new branding. Re created all pages.)
]

export default function Pilots() {
  return (
    <>
<<<<<<< HEAD
      <h1 className="text-3xl font-bold mb-4 border-b-2 border-gray-400 pb-2">
        Public Testbeds
=======
      <h1 className="text-3xl font-bold mb-4 border-b border-brand-purple/30 pb-2 text-brand-cream">
        Public Testbeds & Pilots
>>>>>>> 12f8290 (Added new branding. Re created all pages.)
      </h1>
      <p className="mb-8 max-w-3xl" style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.7)' }}>
        Introducing the concept of public testbeds using the Needs-Driven Design methodology across Europe.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<<<<<<< HEAD
        {pilots.map(({ id, badge, title, location, imageLabel, activitiesHref }) => (
          <div key={id} className="border-2 border-gray-400 p-6 rounded-lg">
=======
        {pilots.map(({ id, badge, title, location, imageLabel }) => (
          <div
            key={id}
            className="border border-brand-purple/35 bg-brand-plum/20 p-6 rounded-lg transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_20px_rgba(218,128,255,0.12)]"
          >
>>>>>>> 12f8290 (Added new branding. Re created all pages.)
            {/* TODO: Replace with real photo */}
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
            {/* TODO: Add real pilot description */}
            <div className="space-y-2 mb-5">
              <div className="h-4 rounded w-full bg-brand-plum/40" />
              <div className="h-4 rounded w-full bg-brand-plum/40" />
              <div className="h-4 rounded w-3/4 bg-brand-plum/40" />
            </div>
<<<<<<< HEAD
            {activitiesHref ? (
              <Link
                to={activitiesHref}
                className="inline-block border-2 border-gray-800 bg-gray-100 px-4 py-2 font-bold uppercase text-sm rounded-md hover:bg-gray-200 transition-colors"
              >
                View Activities
              </Link>
            ) : (
              <button className="border-2 border-gray-800 bg-gray-100 px-4 py-2 font-bold uppercase text-sm rounded-md hover:bg-gray-200 transition-colors">
                View Activities
              </button>
            )}
=======
            <button
              className="border border-brand-lilac text-brand-lilac px-4 py-2 text-sm font-bold uppercase rounded-md transition-all duration-300 hover:bg-brand-lilac/10 hover:shadow-[0_0_12px_rgba(218,128,255,0.3)]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              View Activities
            </button>
>>>>>>> 12f8290 (Added new branding. Re created all pages.)
          </div>
        ))}
      </div>
    </>
  )
}
