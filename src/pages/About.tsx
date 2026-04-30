import { useState } from 'react'

const revealStyle = {
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)',
}

const Skeleton = ({ w = 'w-full' }: { w?: string }) => (
  <div className={`h-4 rounded ${w} bg-brand-plum/40`} />
)

const partnerNames: Record<string, string> = {
  AIRA:  'AIRA Dance Company',
  FFV:   'Flora & Fauna Visions',
  FUT:   'Futurity Systems',
  GPI:   'Grand Palais Immersif',
  ID20:  'Zavod ID20',
  KIKK:  'KIKK Festival',
  LSP:   'Lindholmen Science Park',
  NPIAT: 'New Practice in Art & Technology',
  TAW:   'The Animation Workshop',
  TPL:   'The Point Labs',
  VIB:   'Viborg Museum',
  YOU:   'Younite AI',
}

type ApproachCardData = {
  title: string
  partners: string[]
  description: string
}

const approachCards: Record<string, ApproachCardData> = {
  offsite: {
    title: 'Off-site Immersive Design Team',
    partners: ['FFV', 'NPIAT', 'LSP', 'GPI', 'TPL', 'YOU', 'AIRA'],
    description: 'A transdisciplinary lab where artists, technologists, and heritage experts co-develop immersive prototypes through co-creation sprints. Every concept is tested for accessibility and packaged into modular formats ready for deployment at any venue.',
  },
  onsite: {
    title: 'On-site Immersive Design Team',
    partners: ['VIB', 'FFV', 'GPI', 'TPL', 'ID20', 'FUT', 'AIRA'],
    description: 'Viborg Museum as a living case study, developing "Snapsting" through hand-drawn animation and spatial storytelling. Every workflow and decision is documented so other institutions can follow the same path.',
  },
  testbed: {
    title: 'Public Immersive Testbed',
    partners: ['KIKK', 'FFV', 'YOU', 'TPL', 'FUT', 'GPI'],
    description: 'Le Pavillon opens the finished experiences to real audiences at scale, measuring engagement and accessibility through AI-supported analytics while testing operational models for long-term viability.',
  },
  coordination: {
    title: 'Project Coordination',
    partners: ['LSP'],
    description: 'Lindholmen Science Park ensures strategic alignment across all partners, tracking milestones, budgets, and deliverables while managing risk and EU Commission reporting.',
  },
  comms: {
    title: 'Communication & Impact',
    partners: ['FUT', 'TPL', 'LSP', 'FFV', 'GPI', 'VIB', 'ID20', 'TAW'],
    description: 'Futurity Systems translates project outcomes into modular toolkits and multilingual content, builds a peer learning network, and applies future design methods to chart long-term roadmaps for immersive culture.',
  },
}

function ApproachCard({ title, partners, description }: ApproachCardData) {
  return (
    <div className="border border-brand-purple/35 bg-brand-plum/20 p-6 rounded-lg transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_16px_rgba(218,128,255,0.15)] flex flex-col h-full">
      <h3 className="font-bold text-brand-cream mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed mb-6 flex-grow"
        style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.78)' }}
      >
        {description}
      </p>
      <div className="pt-4 border-t border-brand-purple/20">
        <p
          className="text-[10px] font-bold uppercase tracking-widest text-brand-lilac mb-3"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Partners
        </p>
        <div className="flex flex-wrap gap-1.5">
          {partners.map(p => (
            <div
              key={p}
              title={partnerNames[p] ?? p}
              className="h-10 px-2.5 border border-brand-purple/25 bg-brand-plum/15 rounded flex items-center transition-all duration-200 hover:border-brand-lilac/50 hover:bg-brand-plum/30"
            >
              <img
                src={`/logos/partner_logos/${p}.png`}
                alt={partnerNames[p] ?? p}
                className="h-5 max-w-[72px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const objectives = [
  {
    title: 'Develop a Scalable Model for Immersive Cultural Storytelling',
    body: 'We will create a transferable framework that helps cultural institutions adopt immersive formats that are emotionally engaging, technically feasible, and economically viable — supporting sector-wide digital transformation.',
  },
  {
    title: 'Activate Inclusive, Low-Threshold Spaces for Co-Creation and Innovation',
    body: 'We will establish experimental labs where cultural professionals, technologists, and diverse users can co-create, prototype, and test immersive formats — fostering capacity-building and artistic innovation across Europe.',
  },
  {
    title: 'Demonstrate Public Value and Engagement through Real-World Installations',
    body: 'We will implement immersive experiences in both public and institutional venues to evaluate audience reach, emotional impact, and operational feasibility — contributing to new models for audience development. This dual placement — within both community and institutional spaces — ensures that immersive formats not only reach people outside of the cultural heritage venues, but also guide new audiences back into cultural institutions, increasing footfall and revitalizing their public mission.',
  },
  {
    title: 'Build a Pan-European Network for Knowledge Sharing and Cultural Innovation',
    body: 'We will strengthen cross-sector collaboration by connecting institutions, creatives, and technology partners, and by sharing open-access tools and insights that enable long-term replication and policy alignment.',
  },
  {
    title: 'Advance Inclusion, Accessibility, and Cultural Wellbeing & Democracy through Design',
    body: 'We will embed inclusive design and participatory methods across the project to ensure that immersive cultural experiences reflect the diversity of European society and support social cohesion and accessibility.',
  },
]

function Objective({ index, title, body }: { index: number; title: string; body: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-brand-purple/20 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-start gap-3 py-3 text-left group"
      >
        <span
          className="text-brand-lilac font-bold tabular-nums shrink-0"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {String(index).padStart(2, '0')}
        </span>
        <span
          className="flex-1 font-semibold text-brand-cream transition-colors duration-200 group-hover:text-brand-lilac"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {title}
        </span>
        <span
          className="text-brand-lilac text-xl leading-none shrink-0 mt-0.5 inline-block"
          style={{
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          +
        </span>
      </button>

      {/* Animated container — grid-template-rows trick */}
      <div
        className="grid"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 450ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <div className="overflow-hidden">
          <p
            className="pl-9 pb-4 pr-2 text-sm leading-relaxed"
            style={{
              fontFamily: 'Roboto, sans-serif',
              color: 'rgba(247,243,224,0.72)',
              opacity: open ? 1 : 0,
              transition: open
                ? 'opacity 800ms cubic-bezier(0.2, 0.8, 0.2, 1) 200ms'
                : 'opacity 200ms ease-out',
            }}
          >
            {body}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-8 border-b border-brand-purple/30 pb-2 text-brand-cream">
        About Immersive ECHO
      </h1>

      {/* Block 1: Mission + pull quote */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="col-span-2">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-lilac mb-3">The Objective</p>
          <p className="leading-relaxed mb-6" style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.8)' }}>
            The Immersive ECHO project has five strategic objectives designed to address the
            challenges facing Europe's cultural heritage institutions. These objectives form
            the backbone of a scalable, inclusive, and sustainable transformation in how cultural
            institutions engage audiences through immersive storytelling.
          </p>

          <div className="border-t border-brand-purple/20">
            {objectives.map((obj, i) => (
              <Objective key={obj.title} index={i + 1} title={obj.title} body={obj.body} />
            ))}
          </div>
        </div>
        <div className="border-l-2 border-brand-lilac pl-6 flex flex-col justify-center">
          <div className="text-3xl font-bold text-brand-lilac/25 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>"</div>
          {/* TODO: Add final pull quote */}
          <div className="space-y-2">
            <Skeleton /><Skeleton w="w-3/4" /><Skeleton />
          </div>
          <p className="text-xs mt-3 uppercase tracking-wider" style={{ color: 'rgba(247,243,224,0.4)' }}>— Pull quote placeholder</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-brand-purple/25 my-10 relative">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 text-xs text-brand-lilac uppercase tracking-widest" style={{ backgroundColor: '#202124' }}>
          The Approach
        </span>
      </div>

      {/* Block 2: Approach cards — pyramid layout */}
      <div className="mb-12">
        {/* Top row: Off-site + On-site teams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ApproachCard {...approachCards.offsite} />
          <ApproachCard {...approachCards.onsite} />
        </div>

        {/* Middle row: Public Immersive Testbed (centered) */}
        <div className="flex justify-center mt-6">
          <div className="w-full max-w-md">
            <ApproachCard {...approachCards.testbed} />
          </div>
        </div>

        {/* Bottom row: Coordination + Communication & Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ApproachCard {...approachCards.coordination} />
          <ApproachCard {...approachCards.comms} />
        </div>
      </div>

      {/* Block 3: Dual-Track Methodology Infographic */}
      <div className="mb-12">
        <div className="border border-brand-purple/35 bg-brand-plum/10 rounded-lg overflow-hidden">
          <iframe
            src="/charts/echo-dual-track.html"
            title="Immersive ECHO — Dual-Track Design Methodology"
            className="w-full block border-0"
            style={{ height: 'clamp(560px, 60vw, 700px)', backgroundColor: 'transparent' }}
            loading="lazy"
          />
        </div>
        <p className="mt-4 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.75)' }}>
          {/* TODO: Add real description for the Dual-Track Methodology infographic */}
          <span className="font-bold text-brand-cream">About:</span>  Dual-track design: off-site lab and on-site museum converge in a public testbed to scale immersive heritage experiences.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-brand-purple/25 my-10 relative">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 text-xs text-brand-lilac uppercase tracking-widest" style={{ backgroundColor: '#202124' }}>
          Project Facts
        </span>
      </div>

      {/* Block 4: Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[['15','Partners'],['10','Countries'],['30','Months'],['2','Public Testbeds']].map(([value, label]) => (
          <div key={label} className="border border-brand-purple/35 bg-brand-plum/20 p-5 text-center rounded-lg transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_12px_rgba(218,128,255,0.15)]">
            <div className="text-3xl font-extrabold mb-1 text-brand-lilac">{value}</div>
            <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(247,243,224,0.5)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Block 5: Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 border border-brand-purple/35 bg-brand-plum/20 p-6 rounded-lg" style={revealStyle}>
          <div className="space-y-2"><Skeleton /><Skeleton /><Skeleton w="w-2/3" /></div>
        </div>
        <div className="border-l border-dashed border-brand-purple/30 pl-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-lilac mb-4">Project Details</p>
          <ul className="space-y-4 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {[['Duration','Feb 2026 – July 2028'],['GA Number','101255680'],['Funding','Creative Europe Large Scale'],['Coordinator','Lindholmen Science Park']].map(([key, val]) => (
              <li key={key} className="border-b border-brand-purple/20 pb-2">
                <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(247,243,224,0.45)' }}>{key}</span>
                <br /><span className="text-brand-cream">{val}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
