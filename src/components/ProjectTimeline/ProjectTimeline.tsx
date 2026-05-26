import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

/* =========================================================
   Project Timeline — Immersive ECHO
   A structured month-grid (gantt-style) timeline for a
   ~30-month Creative Europe project.

   Drop-in usage:
     import ProjectTimeline from './ProjectTimeline'
     <ProjectTimeline />                       // uses bundled grant data
     <ProjectTimeline items={myItems} />       // override items
     <ProjectTimeline today={new Date(...)} /> // override "today"

   The component is self-contained:
   - All styles live in an inline <style> block scoped via .pt-* classes.
   - No external CSS, no Tailwind required, no images, no fonts shipped.
   - Roboto + Montserrat are referenced but degrade gracefully.

   Background: designed to sit on a dark charcoal (#202124) page,
   inside a max-w-6xl container with horizontal padding. Width
   responsive; horizontal-scrolls on small screens.
   ========================================================= */

/* ---------- public types ---------- */

export type TimelineItemType = 'deliverable' | 'milestone' | 'event'

export type TimelineItem = {
  id: string
  /** ISO YYYY-MM-DD, YYYY-MM, or "Mon YYYY". */
  date: string
  type: TimelineItemType
  title: string
  description?: string
  /** Force a status; otherwise computed from `today`. */
  status?: 'done' | 'in-progress' | 'upcoming'
  /** Optional partner / work-package tag, e.g. "WP3 · UNIBO · M10". */
  tag?: string
}

export type ProjectTimelineProps = {
  items?: TimelineItem[]
  today?: Date
  eyebrow?: string
  heading?: string
  lede?: string
}

/* ---------- date helpers ---------- */

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTH_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December']

function parseDate(s: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + 'T00:00:00')
  if (/^\d{4}-\d{2}$/.test(s))       return new Date(s + '-01T00:00:00')
  const m = s.match(/^([A-Za-z]+)\s+(\d{4})$/)
  if (m) {
    const idx = MONTH_FULL.findIndex(x => x.toLowerCase().startsWith(m[1].toLowerCase()))
    return new Date(parseInt(m[2]), idx === -1 ? 0 : idx, 1)
  }
  const d = new Date(s); return isNaN(+d) ? new Date() : d
}
const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
const monthsBetween = (a: Date, b: Date) => (b.getFullYear()-a.getFullYear())*12 + (b.getMonth()-a.getMonth())
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth()+n, 1)
const fmtMonth = (d: Date) => `${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`
const fmtFullDate = (d: Date) => `${d.getDate()} ${MONTH_FULL[d.getMonth()]} ${d.getFullYear()}`
const fmtRange = (a: Date, b: Date) => `${fmtMonth(a)} — ${fmtMonth(b)}`

function classify(item: TimelineItem, today: Date): 'done'|'in-progress'|'upcoming' {
  if (item.status) return item.status
  const d = parseDate(item.date)
  const sameMonth = d.getFullYear()===today.getFullYear() && d.getMonth()===today.getMonth()
  if (sameMonth) return 'in-progress'
  return d < today ? 'done' : 'upcoming'
}

const revealInit = (): CSSProperties => ({
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)',
})

/* ---------- type → label / glyph ---------- */

const TYPE_LABEL: Record<TimelineItemType, string> = {
  deliverable: 'Deliverable',
  milestone:   'Milestone',
  event:       'Event',
}
const TYPE_GLYPH: Record<TimelineItemType, string> = {
  deliverable: '—',
  milestone:   '·',
  event:       '↗',
}

/* =========================================================
   Real grant data — Immersive ECHO (CREA-CULT-2025-COOP-3).
   Project months: M1 = Feb 2026 → M30 = Jul 2028.
   ========================================================= */

const DEFAULT_ITEMS: TimelineItem[] = [
  /* ── Milestones ──────────────────────────────────────────── */
  { id: 'ms1-1',  date: '2026-02-01', type: 'milestone',   title: 'MS1 · Consortium Alignment & Kickoff',     tag: 'WP1 · LSP · M1',    description: 'All partners aligned around goals, methods, roles, and reporting at project start.' },
  { id: 'ms1-2',  date: '2026-04-01', type: 'milestone',   title: 'MS1 · Needs-based design framework',       tag: 'WP2 · TPL · M3',    description: 'A strategic design brief based on user journeys, needs, behaviours, institutional inputs, and societal trends.' },
  { id: 'ms1-3',  date: '2026-04-01', type: 'milestone',   title: 'MS1 · Concept & Narrative Finalised',      tag: 'WP3 · VIB · M3',    description: 'Core concept, narrative, full script, and storyboard for Snapsting completed through an iterative process.' },
  { id: 'ms1-5',  date: '2026-04-01', type: 'milestone',   title: 'MS1 · Inter-Project Exchange Network',     tag: 'WP5 · ID20 · M3',   description: 'Network of collaboration with other EU-funded projects formally initiated.' },
  { id: 'ms2-2',  date: '2026-05-01', type: 'milestone',   title: 'MS2 · Lab Operational, First Prototypes',  tag: 'WP2 · NPIAT · M4',  description: 'Experimental Lab fully operational; initial immersive prototypes tested and reviewed.' },
  { id: 'ms3-2',  date: '2026-07-01', type: 'milestone',   title: 'MS3 · Inclusive Design Sprints Done',      tag: 'WP2 · TSC · M6',    description: 'All four inclusive co-creation sprints completed; findings integrated into design iterations.' },
  { id: 'ms2-3',  date: '2026-10-01', type: 'milestone',   title: 'MS2 · Snapsting Production Complete',      tag: 'WP3 · VIB · M9',    description: 'All elements of Snapsting finalised, including content, technology, and spatial design.' },
  { id: 'ms3-3',  date: '2026-11-01', type: 'milestone',   title: 'MS3 · Snapsting Installed at Viborg',      tag: 'WP3 · VIB · M10',   description: 'Snapsting fully installed and running on-site at Museum Viborg.' },
  { id: 'ms4-3',  date: '2026-11-01', type: 'milestone',   title: 'MS4 · Consortium Meeting & Panel',         tag: 'WP3 · VIB · M10',   description: 'All consortium partners gather at Viborg, with a panel talk at The Animation Festival.' },
  { id: 'ms2-1',  date: '2027-01-01', type: 'milestone',   title: 'MS2 · Mid-Term Coordination Review',       tag: 'WP1 · LSP · M12',   description: 'Review of progress, risks, collaboration quality, and resource use at midpoint.' },
  { id: 'ms2-5',  date: '2027-04-01', type: 'milestone',   title: 'MS2 · Mid-Term Impact Review',             tag: 'WP5 · FUT · M15',   description: 'Halfway-point review of communication, knowledge transfer, stakeholder engagement, and dissemination reach.' },
  { id: 'ms1-4',  date: '2027-09-01', type: 'milestone',   title: 'MS1 · Deployment Framework & Business Model', tag: 'WP4 · KIKK · M20', description: 'Strategies for public deployment established alongside a sustainable business model co-developed with partners.' },
  { id: 'ms4-2',  date: '2027-09-01', type: 'milestone',   title: 'MS4 · Final Concepts Ready',               tag: 'WP2 · TSC · M20',   description: 'Prototypes evolved based on testing; final immersive experiences approved for public deployment.' },
  { id: 'ms2-4',  date: '2027-11-01', type: 'milestone',   title: 'MS2 · Public Testbed Open at Le Pavillon', tag: 'WP4 · KIKK · M22',  description: 'Initial venue fully fitted, show control validated; doors opened to the public (KIKK Festival, Oct 2027).' },
  { id: 'ms3-4',  date: '2027-11-01', type: 'milestone',   title: 'MS3 · Cross-Venue Analytics Live',         tag: 'WP4 · TPL · M22',   description: 'Central dashboard aggregating real-time visitor flow, engagement, and accessibility data goes live.' },
  { id: 'ms5-3',  date: '2027-11-01', type: 'milestone',   title: 'MS5 · Snapsting Adapted for Le Pavillon',  tag: 'WP3 · VIB · M22',   description: 'Snapsting tailored for Le Pavillon, with adjustments to narrative, technical setup, and spatial design.' },
  { id: 'ms3-5',  date: '2028-03-01', type: 'milestone',   title: 'MS3 · Capacity Building Resources Final',  tag: 'WP5 · FUT · M26',   description: 'Open Learning Toolkit, How-to ECHO Guide, 5D TimeMap, and Futuremakers Toolkits completed and distributed.' },
  { id: 'ms4-5',  date: '2028-05-01', type: 'milestone',   title: 'MS4 · Final Impact Dissemination',         tag: 'WP5 · FUT · M28',   description: 'Final Future Design Report summarising strategic foresight outcomes and long-term pathways.' },
  { id: 'ms4-4',  date: '2028-06-01', type: 'milestone',   title: 'MS4 · Operational Feasibility Reported',   tag: 'WP4 · KIKK · M29',  description: 'Cost, staffing, and logistics analysed to support future adoption and scale-up.' },
  { id: 'ms3-1',  date: '2028-07-01', type: 'milestone',   title: 'MS3 · Final Coordination Summary',         tag: 'WP1 · LSP · M30',   description: 'Strategic wrap-up of project delivery, including key learnings on coordination and decision-making.' },

  /* ── Deliverables ────────────────────────────────────────── */
  { id: 'd1-1',   date: '2026-03-01', type: 'deliverable', title: 'D1.1 · Project Management Handbook',       tag: 'WP1 · LSP · M2',    description: 'A practical guide outlining vision, internal coordination tools, reporting structure, partner responsibilities, and shared workflows.' },
  { id: 'd5-1',   date: '2026-04-01', type: 'deliverable', title: 'D5.1 · Communication & Dissemination Plan',tag: 'WP5 · FUT · M3',    description: 'Integrated communication strategy. AI tools turn project data into articles, posts, case studies, and micro-content tailored to European audiences.' },
  { id: 'd5-2',   date: '2026-04-01', type: 'deliverable', title: 'D5.2 · Project Dashboard',                 tag: 'WP5 · FUT · M3',    description: 'Live digital dashboard tracking KPIs across participant, institutional, inter-institutional, civic-engagement, and societal-impact levels.' },
  { id: 'd2-1',   date: '2026-05-01', type: 'deliverable', title: 'D2.1 · Needs-Driven Immersive Design Brief',tag: 'WP2 · TPL · M4',   description: 'Strategic guide based on user insights, institutional needs, and societal shifts — defining design challenges, personas, emotional goals, and technical assumptions.' },
  { id: 'd3-1',   date: '2026-11-01', type: 'deliverable', title: 'D3.1 · Snapsting Experience & Documentation', tag: 'WP3 · VIB · M10', description: 'Completed immersive experience installed at Viborg Museum, plus installation blueprints, interaction design files, and reuse documentation.' },
  { id: 'd1-2',   date: '2027-02-01', type: 'deliverable', title: 'D1.2 · Mid-Term Coordination & Risk Report', tag: 'WP1 · LSP · M13',  description: 'Evaluation of progress, coordination quality, risk status, and partner self-assessments with recommendations.' },
  { id: 'd5-3',   date: '2027-04-01', type: 'deliverable', title: 'D5.3 · Mid-Term Impact & Dissemination',   tag: 'WP5 · FUT · M15',   description: 'Comprehensive halfway review of impact, dissemination, engagement, institutional uptake, and cross-sector collaboration.' },
  { id: 'd5-6',   date: '2027-04-01', type: 'deliverable', title: 'D5.6 · 5D TimeMap of Heritage Sites',      tag: 'WP5 · FUT · M15',   description: 'Interactive digital map linking European heritage sites with five layers — spatial, temporal, artistic, political, linguistic. Available in 10 EU languages.' },
  { id: 'd2-2',   date: '2027-09-01', type: 'deliverable', title: 'D2.2 · Final Immersive Experience Designs', tag: 'WP2 · TSC · M20',  description: 'Full immersive experience packages for public deployment — narratives, spatial / interaction designs, technical setups, onboarding flows, accessibility.' },
  { id: 'd3-2',   date: '2027-11-01', type: 'deliverable', title: 'D3.2 · Adapted Snapsting for Le Pavillon', tag: 'WP3 · VIB · M22',   description: 'Snapsting adapted for Le Pavillon with updated narrative, interaction and spatial design, technical setup, and operational guidelines.' },
  { id: 'd5-4',   date: '2027-11-01', type: 'deliverable', title: 'D5.4 · Futuremakers Toolkit',              tag: 'WP5 · FUT · M22',   description: 'Hybrid (physical + digital) toolkit of participatory techniques and guided activities for cultural professionals. 10 EU languages.' },
  { id: 'd5-5',   date: '2027-11-01', type: 'deliverable', title: 'D5.5 · Outreach Platform',                 tag: 'WP5 · FUT · M22',   description: 'AI-augmented two-way communication platform with live KPI dashboard. AI agent personas: museum guide, historical figure, fictitious mascot.' },
  { id: 'd5-7',   date: '2027-11-01', type: 'deliverable', title: 'D5.7 · Timetravel Companion Prototype',    tag: 'WP5 · FUT · M22',   description: 'AI-powered guide enriching museum visits via voice interaction, contextual storytelling, optional holographic content. 100 custom devices.' },
  { id: 'd3-3',   date: '2028-03-01', type: 'deliverable', title: 'D3.3 · Immersive Production Process Report', tag: 'WP3 · VIB · M26', description: 'Walkthrough of the on-site production process — narrative, technical decisions, collaboration model, cultural challenges. A reference for other institutions.' },
  { id: 'd4-1',   date: '2028-03-01', type: 'deliverable', title: 'D4.1 · Operational Deployment Report',     tag: 'WP4 · KIKK · M26',  description: 'Step-by-step documentation of public testbed roll-out: audience logistics, spatial setup, tech adaptation notes.' },
  { id: 'd5-8',   date: '2028-03-01', type: 'deliverable', title: 'D5.8 · Open Learning Toolkit & How-to Guide', tag: 'WP5 · FUT · M26', description: 'Modular, ready-to-use resources built from WP2–WP4 outcomes. AI-supported content generation tailors resources for institutional profiles.' },
  { id: 'd2-3',   date: '2028-05-01', type: 'deliverable', title: 'D2.3 · Final Immersive Experience Evaluation', tag: 'WP2 · TSC · M28', description: 'Comprehensive evaluation: emotional impact, accessibility, system performance, operational sustainability.' },
  { id: 'd4-2',   date: '2028-05-01', type: 'deliverable', title: 'D4.2 · UX & Business Model Summary',       tag: 'WP4 · KIKK · M28',  description: 'Evaluation of audience engagement, onboarding/offboarding flows, and feasibility of business models tested at venue.' },
  { id: 'd5-9',   date: '2028-05-01', type: 'deliverable', title: 'D5.9 · Inter-Project Networking Report',   tag: 'WP5 · ID20 · M28',  description: 'Documents inter-project networking activities — meetings, collaborative events, key outcomes, proposals for ongoing exchange.' },
  { id: 'd5-10',  date: '2028-06-01', type: 'deliverable', title: 'D5.10 · Final Future Design Report',       tag: 'WP5 · FUT · M29',   description: 'Digital platform showcasing project results and long-term potential. AI-driven media tools personalise content in 10 EU languages.' },

  /* ── Key public events ───────────────────────────────────── */
  { id: 'e1',    date: '2026-06-01', type: 'event',       title: 'E1 · Neurodivergent Sprint',                tag: 'Sprint · Berlin · 40 pax',          description: 'Non-linear navigation; sensory balance and nonlinear engagement. 2 days.' },
  { id: 'e2',    date: '2026-09-01', type: 'event',       title: 'E2 · Youth Sprint: Future Worlds Builder',  tag: 'Sprint · Gothenburg · 80 pax',      description: 'User-centric sprint focused on digital fluency and curiosity. 3 days.' },
  { id: 'e3',    date: '2026-11-01', type: 'event',       title: 'E3 · Snapsting Exhibition Opens',           tag: 'Exhibition · Viborg · 150 000 pax', description: 'The Snapsting immersive experience opens to the public at Museum Viborg. Three-year run.' },
  { id: 'e4',    date: '2026-11-01', type: 'event',       title: 'E4 · Echoes of the Future Conference',      tag: 'Conference · Viborg · 300 pax',     description: 'Bridging cultural heritage and immersive innovation. Conference + panel at The Animation Festival.' },
  { id: 'e5',    date: '2027-10-01', type: 'event',       title: 'E5 · Public Launch · KIKK Festival',        tag: 'Panel · Namur · 150 pax',           description: 'High-visibility launch of the immersive experience at KIKK Festival 2027. Consortium panel.' },
  { id: 'e6',    date: '2027-11-01', type: 'event',       title: 'E6 · Le Pavillon Exhibition Opens',         tag: 'Exhibition · Namur · 50 000 pax',   description: 'Immersive ECHO exhibition opens to the public at Le Pavillon, Namur.' },
]

/* =========================================================
   Component
   ========================================================= */

export default function ProjectTimeline({
  items = DEFAULT_ITEMS,
  today = new Date(),
  eyebrow = 'Project Timeline · M1 — M30 · Feb 2026 — Jul 2028',
  heading = 'Thirty months, in public.',
  lede = 'Immersive ECHO is a 30-month Creative Europe project: design, build, test, scale. Milestones, deliverables, and public events from the consortium of 15 organisations across 10 EU countries. Hover any month to focus; click an entry to read.',
}: ProjectTimelineProps) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => +parseDate(a.date) - +parseDate(b.date)),
    [items]
  )

  const range = useMemo(() => {
    if (!sorted.length) return { start: new Date(), end: new Date(), months: [] as Date[] }
    const start = addMonths(parseDate(sorted[0].date), 0)
    const lastDate = parseDate(sorted[sorted.length - 1].date)
    const end = addMonths(new Date(lastDate.getFullYear(), lastDate.getMonth(), 1), 0)
    const count = monthsBetween(start, end) + 1
    const months = Array.from({ length: count }, (_, i) => addMonths(start, i))
    return { start, end, months }
  }, [sorted])

  const byMonth = useMemo(() => {
    const m = new Map<string, TimelineItem[]>()
    sorted.forEach(it => {
      const k = monthKey(parseDate(it.date))
      const arr = m.get(k) ?? []
      arr.push(it); m.set(k, arr)
    })
    return m
  }, [sorted])

  /* default-active = first item in or after today's month */
  const [activeId, setActiveId] = useState<string | null>(() => {
    if (!sorted.length) return null
    const todayKey = monthKey(today)
    const inMonth = sorted.find(s => monthKey(parseDate(s.date)) === todayKey)
    if (inMonth) return inMonth.id
    const after = sorted.find(s => parseDate(s.date) >= today)
    return (after ?? sorted[0]).id
  })
  const [hoverMonth, setHoverMonth] = useState<string | null>(null)
  const active = useMemo(() => sorted.find(s => s.id === activeId) ?? sorted[0], [sorted, activeId])

  /* keep active row in view inside the index scroll container */
  const indexScrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = indexScrollRef.current
    if (!container || !activeId) return
    const row = container.querySelector<HTMLElement>(`[data-row-id="${activeId}"]`)
    if (!row) return
    const cTop = container.scrollTop
    const cBot = cTop + container.clientHeight
    const rTop = row.offsetTop
    const rBot = rTop + row.offsetHeight
    const margin = 24
    if (rTop < cTop + margin) {
      container.scrollTo({ top: Math.max(0, rTop - margin), behavior: 'smooth' })
    } else if (rBot > cBot - margin) {
      container.scrollTo({ top: rBot - container.clientHeight + margin, behavior: 'smooth' })
    }
  }, [activeId])

  const progress = useMemo(() => {
    if (!range.months.length) return 0
    const total = range.months.length
    const cur = monthsBetween(range.start, today) + (today.getDate() - 1) / 30
    return Math.max(0, Math.min(1, cur / total))
  }, [range, today])

  const counts = useMemo(() => {
    const out = { deliverable: 0, milestone: 0, event: 0, done: 0, total: sorted.length }
    sorted.forEach(it => {
      out[it.type]++
      if (classify(it, today) === 'done') out.done++
    })
    return out
  }, [sorted, today])

  /* match index height to detail card height */
  const rootRef = useRef<HTMLElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const [detailHeight, setDetailHeight] = useState(0)
  useEffect(() => {
    if (!detailRef.current) return
    const el = detailRef.current
    const update = () => setDetailHeight(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [active])

  /* reveal-on-scroll */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = rootRef.current?.querySelectorAll<HTMLElement>('[data-reveal]') ?? []
    if (reduce) {
      els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' })
      return
    }
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return
      const el = e.target as HTMLElement
      const delay = parseInt(el.dataset.revealDelay ?? '0')
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)' }, delay)
      obs.unobserve(el)
    }), { threshold: 0.12 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  function moveActive(delta: number) {
    const i = sorted.findIndex(s => s.id === activeId)
    if (i === -1) return
    const next = sorted[Math.max(0, Math.min(sorted.length - 1, i + delta))]
    setActiveId(next.id)
  }

  const lanes: TimelineItemType[] = ['deliverable', 'milestone', 'event']

  return (
    <section
      ref={rootRef}
      className="pt-root"
      style={{ position: 'relative', width: '100%', fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.85)' }}
    >
      <style>{PT_CSS}</style>

      {/* ── Header ──────────────────────────────────────── */}
      <div className="pt-header">
        <div style={{ maxWidth: 640 }}>
          <p className="pt-eyebrow" data-reveal style={{ ...revealInit(), marginBottom: 24 }}>{eyebrow}</p>
          <h2
            className="pt-heading pt-em"
            data-reveal data-reveal-delay="100"
            style={{ ...revealInit(), fontSize: 'clamp(28px, 4vw, 44px)' }}
            dangerouslySetInnerHTML={{ __html: heading.replace(/(\.[^.]*)$/, m => `<em>${m.trim()}</em>`) }}
          />
        </div>
        <div className="pt-stats" data-reveal data-reveal-delay="200" style={revealInit()}>
          <Stat label="Done"         value={`${counts.done} / ${counts.total}`} />
          <Stat label="Deliverables" value={String(counts.deliverable)} />
          <Stat label="Milestones"   value={String(counts.milestone)} />
          <Stat label="Events"       value={String(counts.event)} />
        </div>
      </div>

      {lede && (
        <p data-reveal data-reveal-delay="200" style={{ ...revealInit(), color: 'rgba(247,243,224,0.70)', lineHeight: 1.65, maxWidth: 720, fontSize: 16, marginBottom: 48 }}>
          {lede}
        </p>
      )}

      {/* ── Legend ──────────────────────────────────────── */}
      <div className="pt-legend" data-reveal style={revealInit()}>
        <LegendDot kind="deliverable" />
        <LegendDot kind="milestone" />
        <LegendDot kind="event" />
        <span style={{ marginLeft: 'auto' }}>{fmtRange(range.start, range.end)}</span>
      </div>

      {/* ── Grid ────────────────────────────────────────── */}
      <div className="pt-frame" data-reveal data-reveal-delay="100" style={revealInit()}>
        <div className="pt-scroll" style={{ overflowX: 'auto' }}>
          <div
            style={{
              position: 'relative',
              minWidth: `${Math.max(900, range.months.length * 56)}px`,
              paddingTop: 28,
              height: 314,
            }}
          >
            <MonthScale months={range.months} hoverMonth={hoverMonth} setHoverMonth={setHoverMonth} />

            <div style={{ position: 'relative' }}>
              <div className="pt-today" style={{ left: `calc(132px + (100% - 132px) * ${progress})` }} />
              {lanes.map((lane, i) => (
                <Lane
                  key={lane}
                  lane={lane}
                  months={range.months}
                  byMonth={byMonth}
                  activeId={activeId}
                  setActiveId={setActiveId}
                  hoverMonth={hoverMonth}
                  setHoverMonth={setHoverMonth}
                  today={today}
                  isLast={i === lanes.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail + Index ──────────────────────────────── */}
      <div className="pt-detail-grid" data-reveal data-reveal-delay="200" style={revealInit()}>
        <div ref={detailRef}>
          {active && <DetailCard item={active} today={today} onPrev={() => moveActive(-1)} onNext={() => moveActive(1)} />}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <DividerLabel>Index</DividerLabel>
          <div className="pt-index-header" style={{ flexShrink: 0 }}>
            <span style={{ paddingLeft: 13 }}>Date</span>
            <span>Type</span>
            <span>Title</span>
            <span>Status</span>
          </div>
          <div ref={indexScrollRef} role="list" className="pt-scroll" style={{ overflowY: 'auto', maxHeight: detailHeight ? detailHeight - 60 : undefined, paddingRight: 8 }}>
            {sorted.map(it => (
              <IndexRow key={it.id} item={it} active={it.id === activeId} today={today} onSelect={() => setActiveId(it.id)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   Sub-components
   ========================================================= */

function MonthScale({ months, hoverMonth, setHoverMonth }: {
  months: Date[]; hoverMonth: string | null; setHoverMonth: (k: string | null) => void
}) {
  return (
    <div style={{ position: 'relative', borderBottom: '1px solid rgba(247,243,224,0.10)', display: 'grid', gridTemplateColumns: '132px 1fr' }}>
      <div style={{ borderRight: '1px solid rgba(247,243,224,0.10)' }} />
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${months.length}, 1fr)`, fontFamily: 'Montserrat, sans-serif' }}>
          {months.map((d, i) => {
            const showYear = d.getMonth() === 0 || i === 0
            return (
              <div
                key={i}
                style={{
                  height: 32, display: 'flex', alignItems: 'flex-end', paddingLeft: 8,
                  fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
                  color: showYear ? '#DA80FF' : 'transparent',
                  borderRight: showYear && i !== 0 ? '1px solid rgba(218,128,255,0.25)' : 'none',
                }}
              >
                {showYear ? d.getFullYear() : '·'}
              </div>
            )
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${months.length}, 1fr)` }}>
          {months.map(d => {
            const k = monthKey(d)
            const isHover = hoverMonth === k
            const isQ = d.getMonth() % 3 === 0
            return (
              <div
                key={k}
                onMouseEnter={() => setHoverMonth(k)}
                onMouseLeave={() => setHoverMonth(null)}
                className="pt-cell-border"
                style={{
                  height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: isHover ? '#DA80FF' : isQ ? 'rgba(247,243,224,0.65)' : 'rgba(247,243,224,0.30)',
                  background: isHover ? 'rgba(218,128,255,0.08)' : 'transparent',
                  fontWeight: isQ ? 600 : 400,
                  transition: 'background 180ms cubic-bezier(0.2,0.8,0.2,1), color 180ms cubic-bezier(0.2,0.8,0.2,1)',
                }}
              >
                {MONTH_SHORT[d.getMonth()]}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Lane({ lane, months, byMonth, activeId, setActiveId, hoverMonth, setHoverMonth, today, isLast }: {
  lane: TimelineItemType
  months: Date[]
  byMonth: Map<string, TimelineItem[]>
  activeId: string | null
  setActiveId: (id: string) => void
  hoverMonth: string | null
  setHoverMonth: (k: string | null) => void
  today: Date
  isLast: boolean
}) {
  return (
    <div style={{ position: 'relative', borderBottom: isLast ? 'none' : '1px solid rgba(247,243,224,0.08)', display: 'grid', gridTemplateColumns: '132px 1fr' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16, paddingRight: 12,
          fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(247,243,224,0.55)', borderRight: '1px solid rgba(247,243,224,0.10)',
          background: 'rgba(247,243,224,0.02)',
        }}
      >
        <span style={{ color: lane === 'milestone' ? '#DA80FF' : lane === 'event' ? 'rgba(218,128,255,0.75)' : 'rgba(247,243,224,0.55)', fontSize: 12 }}>{TYPE_GLYPH[lane]}</span>
        <span>{TYPE_LABEL[lane]}</span>
      </div>

      <div
        style={{
          display: 'grid', position: 'relative',
          gridTemplateColumns: `repeat(${months.length}, 1fr)`,
          height: lane === 'milestone' ? 64 : 84,
        }}
      >
        {months.map(d => {
          const k = monthKey(d)
          const items = (byMonth.get(k) ?? []).filter(it => it.type === lane)
          const isHover = hoverMonth === k
          return (
            <div
              key={k}
              onMouseEnter={() => setHoverMonth(k)}
              onMouseLeave={() => setHoverMonth(null)}
              className="pt-cell-border"
              style={{
                position: 'relative',
                background: isHover ? 'rgba(218,128,255,0.04)' : 'transparent',
                transition: 'background 180ms cubic-bezier(0.2,0.8,0.2,1)',
              }}
            >
              {items.map((it, j) => {
                const status = classify(it, today)
                const offsetY = items.length > 1 ? (j - (items.length - 1) / 2) * 18 : 0
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => setActiveId(it.id)}
                    className={`pt-pin ${it.type} ${status} ${activeId === it.id ? 'active' : ''}`}
                    style={{ top: `calc(50% + ${offsetY}px)` }}
                    aria-label={`${TYPE_LABEL[it.type]}: ${it.title}`}
                    title={`${it.title} — ${fmtMonth(parseDate(it.date))}`}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DetailCard({ item, today, onPrev, onNext }: {
  item: TimelineItem; today: Date; onPrev: () => void; onNext: () => void
}) {
  const status = classify(item, today)
  const d = parseDate(item.date)
  return (
    <div className={`pt-detail ${status}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <span className="pt-eyebrow">{TYPE_LABEL[item.type]} · {item.id.toUpperCase()}</span>
        <span style={{
          fontFamily: 'Montserrat, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: status === 'in-progress' ? '#DA80FF' : 'rgba(247,243,224,0.55)',
        }}>
          {status === 'done' ? '✓ Delivered' : status === 'in-progress' ? '● In progress' : '○ Upcoming'}
        </span>
      </div>

      <div style={{
        fontFamily: 'Montserrat, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: '#DA80FF', marginBottom: 12,
      }}>
        {fmtFullDate(d)}
      </div>

      <h3 className="pt-heading" style={{ fontSize: 28, lineHeight: 1.15, marginBottom: 16 }}>{item.title}</h3>

      {item.tag && (
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: 'rgba(247,243,224,0.55)', letterSpacing: '0.05em', marginBottom: 20 }}>
          {item.tag}
        </div>
      )}

      {item.description && (
        <p style={{ color: 'rgba(247,243,224,0.78)', lineHeight: 1.65, fontSize: 15 }}>{item.description}</p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(247,243,224,0.10)' }}>
        <button onClick={onPrev} className="pt-btn-text" style={{ color: 'rgba(247,243,224,0.55)', opacity: 0.7 }}>← Previous</button>
        <button onClick={onNext} className="pt-btn-text" style={{ color: '#DA80FF', opacity: 0.85, marginLeft: 'auto' }}>Next →</button>
      </div>
    </div>
  )
}

function IndexRow({ item, active, today, onSelect }: {
  item: TimelineItem; active: boolean; today: Date; onSelect: () => void
}) {
  const status = classify(item, today)
  const d = parseDate(item.date)
  return (
    <div
      role="listitem"
      data-row-id={item.id}
      onClick={onSelect}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect() } }}
      tabIndex={0}
      className={`pt-row ${active ? 'active' : ''}`}
      style={{ outline: 'none' }}
    >
      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(247,243,224,0.65)', paddingLeft: 13 }}>
        {fmtMonth(d).toUpperCase()}
      </span>
      <span style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'Montserrat, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: item.type === 'milestone' ? '#DA80FF' : 'rgba(247,243,224,0.55)',
      }}>
        <span>{TYPE_GLYPH[item.type]}</span>
        <span>{TYPE_LABEL[item.type]}</span>
      </span>
      <span style={{ color: active ? '#F7F3E0' : 'rgba(247,243,224,0.85)', fontSize: 15, fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
        {item.title}
        {item.tag && <span style={{ marginLeft: 12, fontFamily: 'Montserrat, sans-serif', fontSize: 11, letterSpacing: '0.05em', color: 'rgba(247,243,224,0.40)' }}>· {item.tag}</span>}
      </span>
      <span style={{
        fontFamily: 'Montserrat, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: status === 'done' ? 'rgba(247,243,224,0.40)' : status === 'in-progress' ? '#DA80FF' : 'rgba(247,243,224,0.65)',
      }}>
        {status === 'done' ? 'Delivered' : status === 'in-progress' ? '● Now' : 'Upcoming'}
      </span>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ color: '#F7F3E0', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18, letterSpacing: '0.02em', fontFeatureSettings: '"tnum"' }}>{value}</div>
      <div style={{ color: 'rgba(247,243,224,0.45)', fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
    </div>
  )
}

function LegendDot({ kind }: { kind: TimelineItemType }) {
  const base: CSSProperties = { position: 'relative', display: 'inline-block', width: 8, height: 8, borderRadius: 999 }
  const swatch: CSSProperties =
    kind === 'deliverable' ? { ...base, background: 'rgba(247,243,224,0.85)' } :
    kind === 'milestone'   ? { ...base, background: '#DA80FF', boxShadow: '0 0 0 3px rgba(218,128,255,0.18)' } :
                             { ...base, background: 'transparent', border: '1.5px solid #DA80FF' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span style={swatch} />
      <span>{TYPE_LABEL[kind]}</span>
    </span>
  )
}

function DividerLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ borderTop: '1px solid rgba(136,67,163,0.30)', margin: '24px 0', position: 'relative' }}>
      <span
        style={{
          position: 'absolute', top: -12, left: 0, paddingRight: 16,
          fontFamily: 'Montserrat, sans-serif', backgroundColor: '#202124',
          color: '#DA80FF', fontWeight: 700, letterSpacing: '0.18em', fontSize: 12, textTransform: 'uppercase',
        }}
      >
        {children}
      </span>
    </div>
  )
}

/* =========================================================
   Styles — scoped under .pt-* class names so this component
   never leaks into surrounding page CSS.
   ========================================================= */

const PT_CSS = `
.pt-eyebrow { font-family: Montserrat, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.18em; line-height: 1.4; text-transform: uppercase; color: #DA80FF; margin: 0; }
.pt-heading { font-family: Montserrat, sans-serif; font-weight: 700; letter-spacing: -0.01em; line-height: 1.05; color: #F7F3E0; margin: 0; }
.pt-em em { font-style: normal; color: #DA80FF; }

.pt-header { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 24px; margin-bottom: 32px; }
.pt-stats { display: flex; align-items: flex-end; gap: 40px; font-family: 'Montserrat', sans-serif; font-feature-settings: "tnum"; font-size: 12px; color: rgba(247,243,224,0.55); }

.pt-legend { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 32px; margin-bottom: 24px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(247,243,224,0.55); font-family: Montserrat, sans-serif; }

.pt-frame { border: 1px solid rgba(136,67,163,0.30); border-radius: 12px; background: rgba(90,66,99,0.10); overflow: hidden; }
.pt-cell-border { border-right: 1px solid rgba(247,243,224,0.06); }
.pt-cell-border:last-child { border-right: 0; }

.pt-pin {
  position: absolute; left: 50%; top: 50%;
  width: 12px; height: 12px; border-radius: 999px;
  transform: translate(-50%, -50%);
  transition: transform 180ms cubic-bezier(0.2,0.8,0.2,1), box-shadow 180ms cubic-bezier(0.2,0.8,0.2,1);
  cursor: pointer; padding: 0; border: 0;
}
.pt-pin.deliverable { background: rgba(247,243,224,0.85); }
.pt-pin.milestone   { background: #DA80FF; box-shadow: 0 0 0 3px rgba(218,128,255,0.18); }
.pt-pin.event       { background: transparent; border: 1.5px solid #DA80FF; }
.pt-pin.done        { background: rgba(247,243,224,0.45); }
.pt-pin.event.done  { border-color: rgba(218,128,255,0.45); background: transparent; }
.pt-pin.in-progress { box-shadow: 0 0 0 3px rgba(218,128,255,0.18), 0 0 14px #DA80FF, 0 0 28px rgba(218,128,255,0.35); }

.pt-pin:hover, .pt-pin.active {
  transform: translate(-50%, -50%) scale(1.6) !important;
  box-shadow: 0 0 0 4px rgba(218,128,255,0.20), 0 0 16px #DA80FF, 0 0 32px rgba(218,128,255,0.35);
}
.pt-pin.active.event { background: #DA80FF; }

.pt-today {
  position: absolute; top: 22px; bottom: 0; width: 1px;
  background: linear-gradient(to bottom, rgba(218,128,255,0.0), rgba(218,128,255,0.7) 10%, rgba(218,128,255,0.7) 90%, rgba(218,128,255,0.0));
  pointer-events: none; z-index: 5;
}
.pt-today::before {
  content: ''; position: absolute; top: -4px; left: -3px; width: 7px; height: 7px;
  background: #DA80FF; border-radius: 999px; box-shadow: 0 0 12px #DA80FF;
}
.pt-today::after {
  content: 'TODAY'; position: absolute; top: -22px; left: 50%; transform: translateX(-50%);
  font-family: Montserrat, sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.18em; color: #DA80FF; white-space: nowrap;
}

.pt-detail-grid { display: grid; grid-template-columns: 1fr; gap: 40px; margin-top: 40px; align-items: start; }
@media (min-width: 768px) { .pt-detail-grid { grid-template-columns: 5fr 7fr; } }

.pt-detail { border: 1px solid rgba(136,67,163,0.30); background: rgba(90,66,99,0.18); border-radius: 12px; padding: 28px; }
.pt-detail.in-progress { border-color: rgba(218,128,255,0.60); box-shadow: 0 0 20px rgba(218,128,255,0.25); }

.pt-btn-text {
  font-family: Montserrat, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
  background: none; border: 0; padding: 0; cursor: pointer; transition: opacity 180ms cubic-bezier(0.2,0.8,0.2,1);
}
.pt-btn-text:hover { opacity: 1 !important; }

.pt-index-header {
  display: grid; grid-template-columns: 96px 110px 1fr auto; column-gap: 24px; padding-bottom: 12px;
  font-family: Montserrat, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(247,243,224,0.45);
}

.pt-row {
  display: grid; grid-template-columns: 96px 110px 1fr auto; gap: 24px;
  padding: 14px 0; border-top: 1px solid rgba(247,243,224,0.08);
  align-items: baseline; cursor: pointer;
  transition: background 180ms cubic-bezier(0.2,0.8,0.2,1);
}
.pt-row:hover { background: rgba(218,128,255,0.05); }
.pt-row.active { background: rgba(218,128,255,0.08); }

.pt-scroll { scrollbar-width: thin; scrollbar-color: rgba(218,128,255,0.35) transparent; }
.pt-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.pt-scroll::-webkit-scrollbar-track { background: transparent; }
.pt-scroll::-webkit-scrollbar-thumb { background: rgba(218,128,255,0.25); border-radius: 999px; }
.pt-scroll::-webkit-scrollbar-thumb:hover { background: rgba(218,128,255,0.5); }

@media (prefers-reduced-motion: reduce) {
  .pt-pin { transition: none; }
}
`
