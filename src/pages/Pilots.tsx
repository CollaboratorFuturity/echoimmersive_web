import { Link } from 'react-router-dom'

const pilots = [
  {
    id: 'snapsting',
    badge: 'PRIMARY TESTBED',
    title: 'Viborg Animation Festival',
    location: 'Viborg, Denmark',
    image: '/img/VIB_museum.jpg',
    imageAlt: 'Viborg Animation Festival',
    description:
      'Viborg Animation Festival draws 20,000 visitors yearly, organized by The Animation Workshop / VIA University College in Denmark. Within ECHO, it hosts masterclasses and talks bridging immersive storytelling with cultural heritage.',
    activitiesHref: '/pilots/snapsting',
  },
  {
    id: 'pavillon',
    badge: 'SCALING & ADAPTATION',
    title: 'Le Pavillon',
    location: 'Namur, Belgium',
    image: '/img/KIKK_lepavillion.avif',
    imageAlt: 'Le Pavillon, Namur',
    description:
      "Le Pavillon is KIKK's hub for digital arts and technology in Namur, Belgium. It deploys ECHO's immersive installations to broad public audiences while collecting engagement and accessibility data. Over 200 school partnerships annually.",
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
        {pilots.map(({ id, badge, title, location, image, imageAlt, description, activitiesHref }) => (
          <div
            key={id}
            className="border border-brand-purple/35 bg-brand-plum/20 p-6 rounded-lg transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_20px_rgba(218,128,255,0.12)]"
          >
            <div className="h-48 mb-4 rounded-lg overflow-hidden border border-brand-purple/25">
              <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
            </div>
            <span
              className="border border-brand-lilac/50 text-brand-lilac px-2 py-1 text-xs font-bold mb-3 inline-block rounded"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {badge}
            </span>
            <h2 className="text-2xl font-bold mb-1 text-brand-cream">{title}</h2>
            <h3 className="text-base mb-4" style={{ color: 'rgba(247,243,224,0.5)' }}>📍 {location}</h3>
            <p className="mb-5" style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.7)' }}>
              {description}
            </p>
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
