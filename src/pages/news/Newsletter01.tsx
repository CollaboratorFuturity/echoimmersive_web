import { Link } from 'react-router-dom'

const bodyStyle = { fontFamily: 'Roboto, sans-serif', color: 'var(--ink-body)' } as const

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-bold uppercase tracking-widest text-brand-lilac mb-5"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {children}
    </p>
  )
}

function Divider() {
  return <div className="border-t border-brand-purple/30 my-10" />
}

function PullQuote({ quote, attribution }: { quote: string; attribution?: string }) {
  return (
    <div className="border-l-2 border-brand-lilac pl-7 my-8">
      <div className="text-5xl leading-none text-brand-lilac/30" aria-hidden="true">&ldquo;</div>
      <p
        className="italic"
        style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300, color: 'rgba(247,243,224,0.9)' }}
      >
        {quote}
      </p>
      {attribution && (
        <p
          className="text-xs uppercase tracking-widest text-brand-lilac mt-4"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {attribution}
        </p>
      )}
      <div className="w-8 h-px bg-brand-lilac/35 mt-5" />
    </div>
  )
}

export default function Newsletter01() {
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
        style={{ fontFamily: 'Montserrat, sans-serif', color: '#DA80FF' }}
      >
        Newsletter No. 1 | September 2026
      </span>

      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-brand-cream">
        Introducing ECHO
      </h1>
      <p
        className="text-lg md:text-xl mb-10 max-w-3xl"
        style={bodyStyle}
      >
        How immersive design is changing the way we experience history.
      </p>

      <article className="max-w-3xl leading-relaxed" style={bodyStyle}>

        <SectionLabel>The Life of an Object</SectionLabel>
        <div className="space-y-4">
          <p>
            There is a cup in a display case somewhere in Europe. It is around four hundred years old. The label
            tells you where the clay came from, when it was made, and which collection it passed through. What it
            cannot tell you is how a nervous bride sipped from it on the morning of her wedding absentmindedly.
          </p>
          <p>That morning has disappeared. The cup remains.</p>
          <p>
            Museums have always carried this quiet challenge. Their collections preserve objects with remarkable
            care, yet the lives wrapped around those objects remain just out of reach.
          </p>
          <p>
            A visitor can admire the craftsmanship of a ceramic bowl or the stitching of an old coat without ever
            stopping to imagine the people who once held them, used them or passed them on.
          </p>
          <p>That is the space where Immersive ECHO begins.</p>
          <p>
            Instead of objects sitting quietly behind glass, ECHO imagines spaces where heritage comes alive.
            Memory fills the room. Visitors move through it together as images spread across the walls and sound
            changes with the space. Every conversation, pause and shared reaction becomes part of the story.
          </p>
          <p>
            Immersive ECHO (European Cultural Heritage Outreach) is a Creative Europe cooperation project bringing
            together fifteen partners from ten countries to explore how immersive experiences can help cultural
            heritage feel personal again, with the intent of helping all of us connect back to our shared heritage.
          </p>
          <p>
            Over the next two years, the consortium will approach this through testing ideas, building prototypes
            and sharing what it learns openly. Any heritage organisations across Europe, regardless of size, will
            be able to build on that work in their own collections and spaces, so good immersive experiences can
            reach as many institutions as possible.
          </p>
        </div>

        <Divider />

        <SectionLabel>The First Chapter</SectionLabel>
        <div className="space-y-4">
          <p>
            The consortium met for the first time in February at Le Pavillon, an arts centre built into the citadel
            overlooking Namur, Belgium, and run by Immersive ECHO partner KIKK.
          </p>
          <p>
            Months of online meetings had already laid the foundations for ECHO. Namur was the first opportunity
            for many partners to sit around the same table and begin making those plans real.
          </p>
        </div>

        <figure className="my-8">
          <div className="rounded-lg overflow-hidden border border-brand-purple/30">
            <img
              src="/img/newsletter/namur-kickoff.jpg"
              alt="ECHO partners at Le Pavillon, Namur, February 2026"
              className="w-full h-auto"
            />
          </div>
          <figcaption className="text-xs mt-2" style={{ color: 'var(--ink-subtle)' }}>
            <span className="uppercase tracking-widest text-brand-lilac">Kick off</span>
            {' '}in Le Pavillon, Namur, February 2026
          </figcaption>
        </figure>

        <div className="space-y-4">
          <p>
            At the heart of the project is creating an immersive experience template, developed by approaching the
            same challenge from different directions.
          </p>
          <p>
            Half the team works from within a heritage institution, keeping every idea answerable to what can
            actually be built, staffed and opened to the public. The other is based in an experimental creative
            environment, offering room to test different approaches within a sharp production cycle deadline.
          </p>
          <p>
            The two trade what they find as they go: the lab expands what seems possible, while the museum grounds
            those ideas in the realities of everyday practice.
          </p>
        </div>

        <PullQuote
          quote="We have a fantastic and diverse group of people from across Europe, and if we cannot accomplish something meaningful with this team, I wonder who can."
          attribution="Laura Olin — Younite AI"
        />

        <h3 className="text-lg font-bold text-brand-cream mb-3">A different approach</h3>
        <div className="space-y-4 mb-8">
          <p>While most projects start with doing, ECHO spent its first months listening.</p>
          <p>
            Partners shared the realities they face inside museums, cultural sites and creative organisations. The
            team looked closely at immersive heritage projects across Europe, asking not only what worked but what
            audiences struggled with.
          </p>
          <p>
            From those conversations emerged a &ldquo;needs-based design brief&rdquo; mapping both the ambitions
            and constraints of the institutions and a series of personas, imagined visitors, each representing
            possible ways of connecting with heritage.
          </p>
          <p>
            A family visiting together has different needs from someone exploring alone. An eight-year-old
            following colours through a dark gallery experiences a museum differently from the historian reading
            every label. The ideas began to take shape around those differences.
          </p>
        </div>

        <h3 className="text-lg font-bold text-brand-cream mb-3">Two days in Berlin</h3>
        <div className="space-y-4">
          <p>
            By June the design brief was established, and the focus moved to the creative direction. Around twenty
            representatives from ten partner organisations came together in Berlin to work through the applied
            vision for the immersive experience.
          </p>
          <p>
            Three possible storytelling approaches were put on the table and tested against what heritage
            institutions and their audiences actually need. The group also looked at how movement, proximity and
            the simple fact of people gathering can carry a story.
          </p>
        </div>

        <PullQuote
          quote="We went from talking about individual installations to seeing the experiences as cultural systems. The biggest change for me was that we began discussing the relationships between people, heritage, space and technology, not just the experiences themselves."
          attribution="Timmy Ghiurau — The Point Labs, who presented the brief"
        />

        <Divider />

        <SectionLabel>A Project Built Across Europe</SectionLabel>
        <div className="space-y-4">
          <p>
            Across Europe, ECHO brings together fifteen organisations from ten countries. From a museum in Viborg
            exploring new ways to welcome visitors, to a Swedish dance company carrying Sámi cultural knowledge
            through choreography, to a historic garden in Ukraine continuing its work during wartime.
          </p>
          <p>
            Alongside them are the creative studios, researchers and technology partners building the work with
            them. Each partner brings different skills, traditions and questions. Lindholmen Science Park
            coordinates the project through to July 2028.
          </p>
        </div>

        <Divider />

        <SectionLabel>Looking Beyond ECHO</SectionLabel>
        <div className="space-y-4">
          <p>ECHO is one part of a much larger conversation.</p>
          <p>
            Across Europe, dozens of projects are exploring different pieces of the same puzzle. Earlier this year,
            eight of them joined ECHO for a future-making workshop organized by consortium partner Futurity
            Systems to compare what they were learning and where their work could connect.
          </p>
          <p>
            Some of what came out of it is already taking shape. Tools developed inside ECHO will be published
            through the 3D-4CH competence centre, so they remain available long after the project ends.
          </p>
          <p>
            XRCulture is sharing 3D models of heritage sites in Ukraine and Italy for use in ECHO exhibitions.
            ECHO and HERIFORGE will share a stand at Immersive Tech Week.
          </p>
          <p>We&rsquo;ll be sharing more from those conversations in future editions.</p>
        </div>

        {/* Looking ahead panel */}
        <div
          className="relative border border-brand-purple/40 rounded-xl backdrop-blur-sm p-8 my-10"
          style={{ backgroundColor: 'rgba(90,66,99,0.35)', boxShadow: 'inset 0 0 60px rgba(136,67,163,0.12)' }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest text-brand-lilac mb-3"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Looking Ahead
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-brand-cream mb-4">
            Join us in Viborg, 7&ndash;12 September
          </h2>
          <div className="space-y-4 mb-6">
            <p>
              Coming soon. September 9, Viborg Museum will give a sneak peek at the first ECHO immersive experience
              developed inside a heritage institution, as part of the Viborg Animation Festival, the largest
              festival in the Nordic region for everyone who loves animation and visual storytelling.
            </p>
            <p>
              ECHO is hosting a conference exploring immersive storytelling in museums and cultural heritage.
              Speakers from across Europe will share their work, and visitors can step inside the experience.
            </p>
          </div>
          <a
            href="https://viborganimationfestival.dk/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-brand-lilac px-4 py-2 font-bold uppercase text-xs rounded-md transition-all duration-300 hover:bg-brand-lilac/10 hover:shadow-[0_0_14px_rgba(218,128,255,0.35)]"
            style={{ fontFamily: 'Montserrat, sans-serif', color: '#DA80FF' }}
          >
            See the festival programme ↗
          </a>
          <p className="text-sm mt-5" style={{ color: 'var(--ink-muted)' }}>
            Want to take part in the ECHO conference? Write to us at{' '}
            <a href="mailto:ismaila.jallow@lindholmen.se" className="text-brand-lilac underline hover:text-brand-lilac/80">
              ismaila.jallow@lindholmen.se
            </a>.
          </p>
        </div>

        <SectionLabel>Stay in Touch</SectionLabel>
        <div className="space-y-4 mb-8">
          <p>
            This newsletter is published twice each year, first in English and then in the languages of the
            consortium. <Link to="/newsletter" className="text-brand-lilac underline hover:text-brand-lilac/80">Subscribe</Link>
            {' '}and future editions will reach you directly. And if something you read here got you excited, write to us.
          </p>
          <p>
            Heading to Viborg this September? Come join our conference on immersive storytelling and step inside
            our latest installation.
          </p>
          <p>
            You can also follow the project on{' '}
            <a
              href="https://www.instagram.com/echoimmersive"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-lilac underline hover:text-brand-lilac/80"
            >
              Instagram
            </a>
            , LinkedIn, Facebook, X, TikTok and YouTube using #ImmersiveECHO.
          </p>
        </div>

      </article>
    </>
  )
}
