import { useState } from 'react'
import { Link } from 'react-router-dom'
import Lightbox from '@/components/Lightbox/Lightbox'
import { launchGallery as gallery } from '@/data/galleries'

export default function NewsLaunch() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <>
      <Link
        to="/news"
        className="text-sm text-brand-lilac hover:text-brand-lilac/80 transition-colors mb-4 inline-block"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        ← Back to News
      </Link>

      <span
        className="text-xs font-bold uppercase block mb-2"
        style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(218,128,255,0.7)' }}
      >
        News | March 2026
      </span>

      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-brand-cream">
        Immersive ECHO Project Officially Launches
      </h1>
      <p
        className="text-lg md:text-xl mb-8 max-w-3xl"
        style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.8)' }}
      >
        Over 40 world class European creatives gathered in Namur to kickstart the ECHO Immersive project.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 mb-12">
        <div className="rounded-lg overflow-hidden border border-brand-purple/30 w-full sm:w-1/4 sm:max-w-xs shrink-0 self-start">
          <img src="/img/news_launch/team.jpg" alt="ECHO Immersive team in Namur" className="w-full h-auto object-cover" />
        </div>

        <div
          className="space-y-4 leading-relaxed"
          style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.75)' }}
        >
        <p>
          Immersive ECHO officially launched in February 2026 with a multi-day kickoff meeting at Le Pavillon in
          Namur, Belgium, the venue that will host the project's public testbed. Delegations from all consortium
          partners gathered in person for the first time, bringing together museum professionals, immersive
          designers, developers, researchers, and strategists from ten countries. The meeting was coordinated by
          Lindholmen Science Park's project team, led by project manager Ismaila Jallow and coordinator Katrin
          Amberntsson, with support from the KIKK and Le Pavillon teams on the ground.
        </p>
        <p>
          The days combined structured workshops with open exploration. Teams worked through foundational
          questions about how people move through spaces, what catches attention, and how story and interaction
          help audiences build meaning. Rather than starting with technology, the conversations centered on
          narrative, perception, and the particular demands of cultural spaces. Attendees walked away with a
          shared sense of what the next two and a half years will look like, and with the kind of trust that
          only forms when curious people spend real time together. The final immersive experiences developed
          through the project will return to Le Pavillon for public deployment in October 2027.
        </p>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold mb-4 text-brand-cream">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
        {gallery.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightbox(i)}
            className="block rounded-lg overflow-hidden border border-brand-purple/30 hover:border-brand-lilac/60 transition-colors"
          >
            <img src={src} alt="" className="w-full h-48 object-cover" />
          </button>
        ))}
      </div>

      <Lightbox
        images={gallery}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onChange={setLightbox}
      />
    </>
  )
}
