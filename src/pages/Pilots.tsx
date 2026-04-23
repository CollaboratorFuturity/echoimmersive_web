import { Link } from 'react-router-dom'

const pilots = [
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
]

export default function Pilots() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4 border-b-2 border-gray-400 pb-2">
        Public Testbeds
      </h1>
      <p className="mb-8 max-w-3xl text-gray-700">
        Introducing the concept of public testbeds using the Needs-Driven Design methodology across Europe.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pilots.map(({ id, badge, title, location, imageLabel, activitiesHref }) => (
          <div key={id} className="border-2 border-gray-400 p-6 rounded-lg">
            {/* TODO: Replace with real photo */}
            <div className="border-2 border-gray-400 bg-gray-200 h-48 mb-4 flex items-center justify-center text-gray-500 text-sm rounded-lg">
              {imageLabel}
            </div>
            <span className="bg-gray-300 px-2 py-1 text-xs font-bold mb-2 inline-block rounded">
              {badge}
            </span>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <h3 className="text-lg text-gray-500 mb-4">📍 {location}</h3>
            {/* TODO: Add real pilot description */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
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
          </div>
        ))}
      </div>
    </>
  )
}
