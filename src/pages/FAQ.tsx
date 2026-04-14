import { useState } from 'react'

const faqs = [
  {
    q: "What is Immersive ECHO?",
    a: "Immersive ECHO is a pan-European project bringing people closer to their shared heritage through immersive storytelling. Over 30 months (February 2026 – July 2028), 15 partners across 10 countries develop a practical model enabling cultural institutions to transform everyday public spaces into emotional, collective experiences — using projection, spatial audio, and sensor technology rather than VR headsets. The focus is on making immersive storytelling accessible to small and medium institutions that currently lack the budget and expertise to create it.",
  },
  {
    q: "Why is this project needed?",
    a: "Most cultural heritage institutions lack the budget, expertise, and technical capacity to create immersive experiences. Large-scale productions are typically reserved for well-funded museums and commercial venues. At the same time, audiences increasingly expect engaging, multi-sensory encounters with culture. Immersive ECHO addresses this gap with a practical, transferable model — tested in real settings, documented honestly, and designed so a local museum with limited resources can tell its stories in ways that are emotionally engaging and economically sustainable.",
  },
  {
    q: "What makes Immersive ECHO different from other immersive projects?",
    a: "Five things set us apart. We focus on small and medium institutions — not large-scale flagships. Our approach is headset-free: projection, spatial audio, and sensors transform existing public spaces. Inclusion is built into the design process, with dedicated sprints for youth, neurodivergent audiences, older adults, and marginalised groups. We document the entire process — including what doesn't work — and produce open toolkits so others can replicate the approach independently. And the consortium itself is unique: world-leading designers, researchers, heritage institutions of varying sizes, and technologists all working side by side.",
  },
  {
    q: "Why \"immersive\" without VR headsets?",
    a: "VR headsets create barriers: cost, accessibility, discomfort, and individual isolation. They're also difficult to scale — one headset serves one person at a time. Our approach uses spatial audio, projections, and environmental sensors to transform shared public spaces into immersive storytelling environments. A single location-based installation reaches large audiences simultaneously, requires less specialised equipment, and is easier for institutions to operate and sustain. The result is collective, embodied, and low-threshold — and it makes business sense for the venues that host it.",
  },
  {
    q: "What will a visitor actually experience?",
    a: "Location-based, multi-sensory storytelling using projection, spatial audio, and environmental interaction to bring cultural heritage to life in shared public spaces. As you move through a venue, projected imagery and sound respond to your presence and create a narrative that unfolds around you. The goal is not passive information transfer, but active encounters with history — open-ended, participatory, and designed so each visitor creates their own journey through the story. You feel it before you think about it.",
  },
  {
    q: "What is Snapsting?",
    a: "Snapsting is the signature on-site production developed by Viborg Museum in Denmark. It explores Viborg's thousand-year identity as a site of royal, religious, and judicial power — bringing that history to life through music, poetic animation, and atmospheric environments. The experience is non-linear: visitors follow their own curiosity through the story. Beyond the experience itself, the entire production process is being documented as a transferable methodology — a playbook for other cultural heritage institutions planning their own immersive work. Snapsting premieres publicly in November 2026.",
  },
  {
    q: "What is Le Pavillon and the KIKK Festival?",
    a: "Le Pavillon is a venue in Namur, Belgium, operated by KIKK — and it serves as the project's public testbed. This is where immersive experiences meet real, diverse audiences for the first time at scale. We test the full visitor journey: emotional response, interaction patterns, accessibility, onboarding, and whether the experience creates opportunities for reflection after people leave. The public premiere is planned for the KIKK Festival in October 2027 — one of Europe's leading festivals for digital and creative culture, attracting thousands of visitors annually.",
  },
  {
    q: "What does \"inclusion by design\" mean in practice?",
    a: "It means accessibility and diverse audience needs are embedded in the design process from the start — not added at the end. The project includes four dedicated inclusive design sprints, each focused on a specific audience: youth, neurodivergent individuals, older adults, and marginalised communities. Real users shape the work from the earliest stages. Inclusion is also about emotional recognition — creating experiences where people see themselves reflected in the stories, where history feels like something that belongs to them.",
  },
  {
    q: "Who is behind Immersive ECHO?",
    a: "A consortium of 15 organisations from 10 European countries, coordinated by Lindholmen Science Park in Gothenburg, Sweden. Partners include immersive design studios, cultural heritage institutions, research labs, technology companies, and communication specialists from Sweden, Germany, France, Finland, Romania, Denmark, Belgium, Ukraine, Spain, and Slovenia. Associated partners include the City of Gothenburg and The Animation Workshop in Denmark. The project received an EU evaluation score of 92/100.",
  },
  {
    q: "Is Ukraine part of the project?",
    a: "Yes. Sofiyivka Park in Uman, Ukraine, is a full consortium partner. Due to the ongoing Russian invasion, physical prototyping cannot take place in Ukraine. Instead, Sofiyivka Park contributes cultural heritage data, historical materials, and an invaluable perspective on heritage in conflict zones. Their participation is a reminder of why cultural preservation matters — and why it is urgent. The consortium is actively working through the operational challenges their situation creates.",
  },
  {
    q: "How is the project funded?",
    a: "Immersive ECHO is co-funded by the European Union under the Creative Europe programme, Large Scale Cooperation strand. The total budget is approximately €3.3 million, of which the EU funds 60% (€1,999,019). The remaining 40% is co-financing from consortium partners. Under the lump sum model, the EU pays for results — not overhead. The payment schedule is 40% at project start, 40% at the interim report (Month 15), and 20% at the final report.",
  },
  {
    q: "What will the project produce?",
    a: "Results at three levels. Concrete experiences: tested immersive installations at Viborg Museum and Le Pavillon, designed for touring and adaptation. Open knowledge: an Open Learning Toolkit with step-by-step guides, a Futuremakers Toolkit for participatory future thinking, production process documentation, and an Outreach Platform for the wider cultural heritage community. Structural capacity: a Business Blueprint validating what works operationally and economically, and a Final Future Design Report with policy recommendations and institutional roadmaps for the sector beyond 2028.",
  },
  {
    q: "What happens after the project ends in 2028?",
    a: "Sustainability is integrated into the design process from the start — not treated as an afterthought. The technical architecture is built around modularity: content can tour between venues, digital twins allow new sites to be planned remotely, and parametric design reduces the effort needed to adapt installations. Viborg Museum intends to continue operating Snapsting as a permanent installation. All foreground IP is made openly available for adaptation, reuse, and commercial development. The ambition is to leave behind methods, tools, and proven models that continue generating value across the sector.",
  },
  {
    q: "How can other cultural heritage institutions get involved?",
    a: "Several concrete ways. The ECHOSYSTEM Platform will include a public portal where cultural professionals can access draft toolkits, join peer exchange forums, and sign up for events. Monthly Futuremaking Workshops across partner cities are open to external professionals. Three online masterclasses cover technical pipelines, creative direction, and cross-disciplinary collaboration. The public testbeds at Le Pavillon and Viborg Museum serve as live learning environments. All toolkits and training materials will be freely available in all ten partner languages. Follow the project at #ImmersiveECHO or subscribe to the newsletter.",
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
      <button
        className="w-full text-left px-5 py-4 font-semibold bg-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-300 transition-colors text-sm text-gray-800"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {q}
        <span className="text-lg font-light text-gray-500 ml-4 shrink-0">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="px-5 py-4 bg-white text-sm leading-relaxed text-gray-700 border-t border-gray-200">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 border-b-2 border-gray-400 pb-2">
        Frequently Asked Questions
      </h1>
      <div className="space-y-3">
        {faqs.map(({ q, a }) => (
          <FAQItem key={q} q={q} a={a} />
        ))}
      </div>
    </div>
  )
}
