import { useLayoutEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// ────────────────────────────────────────────────────────────────────────────
// Date helper — project month → calendar date.
// M1 = Feb 2026; +1 calendar month per M.
// Outputs "M3 · Apr 2026" so readers see both the EU-grant month and a real date.
// ────────────────────────────────────────────────────────────────────────────
const PROJECT_START = { year: 2026, monthIndex: 1 } // Feb 2026 (Date months are 0-indexed)

function dueLabel(m: number): string {
  const d = new Date(PROJECT_START.year, PROJECT_START.monthIndex + (m - 1), 1)
  const month = d.toLocaleString('en', { month: 'short' })
  return `M${m} · ${month} ${d.getFullYear()}`
}

function isPast(m: number): boolean {
  const firstOfNextMonth = new Date(PROJECT_START.year, PROJECT_START.monthIndex + m, 1)
  return firstOfNextMonth < new Date()
}

// ────────────────────────────────────────────────────────────────────────────
// Partner names (canonical codes — see public/grant-data.md)
// ────────────────────────────────────────────────────────────────────────────
const partnerNames: Record<string, string> = {
  AIRA:  'AIRA Dance Company',
  COG:   'City of Gothenburg',
  TSC:   'The Storytelling Company',
  FUT:   'Futurity Systems',
  GPI:   'Grand Palais Immersif',
  ID20:  'Zavod ID20',
  KIKK:  'KIKK / Le Pavillon',
  LSP:   'Lindholmen Science Park',
  NPIAT: 'New Practice in Art & Technology',
  TPL:   'The Point Labs',
  VGR:   'Västra Götalandsregionen',
  VIB:   'Viborg Museum',
  YOU:   'Younite AI',
  TAW:   'The Animation Workshop',
}

const largeLogos = new Set(['TSC', 'FUT', 'GPI', 'KIKK', 'NPIAT', 'TPL'])

// ────────────────────────────────────────────────────────────────────────────
// Work Packages
// ────────────────────────────────────────────────────────────────────────────
type WorkPackage = {
  code: string
  title: string
  lead: string
  short: string
  objectives: string[]
  partners: string[]
}

const workPackages: WorkPackage[] = [
  {
    code: 'WP1',
    title: 'Project Management and Coordination',
    lead: 'Lindholmen Science Park (LSP)',
    short: 'Strategic alignment, milestones, budgets, risk management, and EU Commission liaison across the consortium.',
    objectives: [
      "Provide strategic, transparent, and inclusive coordination to ensure all partners contribute effectively to the project's goals.",
      'Monitor timelines, deliverables, and financial progress to guarantee accountability and efficient resource use.',
      'Facilitate clear and continuous communication with the EU Commission and ensure compliance with all regulatory and reporting requirements.',
      'Identify and manage risks proactively to safeguard delivery, strengthen resilience, and ensure high-impact results aligned with CREA priorities.',
    ],
    partners: ['LSP'],
  },
  {
    code: 'WP2',
    title: 'Immersive Design Team (Off-site)',
    lead: 'The Storytelling Company (TSC)',
    short: 'A transdisciplinary lab where artists, technologists, and heritage experts co-develop immersive prototypes through co-creation sprints.',
    objectives: [
      'Understand evolving user needs and institutional realities — frame opportunity areas based on user research, institutional goals, and societal shifts.',
      'Design and prototype inclusive, scalable immersive formats — develop concepts that address needs, validate assumptions early, and iteratively refine.',
      'Integrate a low-barrier Experimental Lab into the design process for co-creation, testing, and iteration with diverse audiences.',
      'Evaluate user experience, technical feasibility, and economic viability — continuously collect feedback to refine experiences.',
      'Lead final refinement and readiness for public testbeds — finalise immersive experiences that are emotionally resonant, technically stable, and accessible.',
      'Benchmark and exchange between on-site and off-site immersive design — structured exchange between Snapsting and the off-site lab processes.',
    ],
    partners: ['TSC', 'NPIAT', 'GPI', 'YOU', 'TPL', 'AIRA', 'ID20', 'VIB', 'VGR', 'FUT', 'COG'],
  },
  {
    code: 'WP3',
    title: 'On-Site Immersive Design Team',
    lead: 'Viborg Museum (VIB)',
    short: 'Viborg Museum acts as the living case study, developing "Snapsting" through hand-drawn animation and spatial storytelling.',
    objectives: [
      'Test the full lifecycle of immersive storytelling in a real museum setting — concept development, scripting, collaboration, technology integration, production, and launch.',
      'Measure impact on audiences — gather data on emotional engagement, cultural learning, and accessibility.',
      'Identify what works for small-to-mid-sized institutions — document workflows, challenges, and resource needs.',
      'Benchmark and exchange between on-site and off-site immersive design — see WP2.',
    ],
    partners: ['VIB', 'TSC', 'GPI', 'TPL', 'AIRA', 'ID20', 'VGR', 'FUT', 'COG', 'KIKK'],
  },
  {
    code: 'WP4',
    title: 'Public Testbeds',
    lead: 'KIKK / Le Pavillon',
    short: 'Le Pavillon opens the finished experiences to real audiences at scale, measuring engagement and accessibility through AI-supported analytics.',
    objectives: [
      'Deploy an immersive experience in a public, high-access venue — bridge the gap between prototyping and reality.',
      'Evaluate live user experience at scale — measure emotional response, accessibility, interaction patterns, and retention.',
      'Test onboarding and offboarding processes — signage, guided entry/exit, and reflection opportunities.',
      'Validate operational and economic viability — ticketing strategies, operational setups, staffing needs, and technical requirements.',
      'Create learning opportunities for cultural professionals — partner museums and heritage organisations are invited to observe and participate.',
    ],
    partners: ['KIKK', 'TSC', 'GPI', 'VIB', 'TPL', 'YOU', 'ID20', 'AIRA', 'NPIAT', 'VGR', 'FUT'],
  },
  {
    code: 'WP5',
    title: 'Communication, Dissemination & Impact',
    lead: 'Futurity Systems (FUT)',
    short: 'Translates project outcomes into modular toolkits, multilingual content, and a peer learning network for the European cultural heritage sector.',
    objectives: [
      'Communication — strategic, targeted measures to promote the project and ensure visibility of the EU grant.',
      'Dissemination — share project results with cultural sector, heritage institutions, EU bodies, and the general public.',
      'Exploitation — facilitate the use of project achievements in new initiatives, marketing, and collaborations.',
      'Amplify Visibility and Engagement — leverage modern storytelling and AI-driven content generation across Europe.',
      'Capacity Building — develop toolkits, facilitate peer learning, and offer mentoring programs for cultural institutions.',
      'Future-Oriented Design — apply Future Design methodologies to envision compelling futures for immersive culture.',
    ],
    partners: ['LSP', 'TSC', 'NPIAT', 'GPI', 'YOU', 'TPL', 'KIKK', 'FUT', 'AIRA', 'ID20', 'VIB', 'VGR', 'COG', 'TAW'],
  },
]

// ────────────────────────────────────────────────────────────────────────────
// Tasks — full data from grant agreement
// ────────────────────────────────────────────────────────────────────────────
type Task = { code: string; title: string; lead: string; description: string }
type TaskGroup = { code: string; title: string; tasks: Task[] }

const taskGroups: TaskGroup[] = [
  {
    code: 'T1', title: 'Project Management and Coordination',
    tasks: [
      { code: 'T1.1', title: 'Lead Strategic Coordination', lead: 'LSP',
        description: 'Ensure smooth collaboration with partners, align timelines, objectives, and provide overall direction throughout the project lifecycle.' },
      { code: 'T1.2', title: 'Monitor Progress, Risks & Budget', lead: 'LSP',
        description: 'Track milestones, deliverables, Green checklist alignment and financial flows, and manage risks proactively to ensure transparency and accountability.' },
      { code: 'T1.3', title: 'Manage Communication & Reporting', lead: 'LSP',
        description: 'Facilitate clear internal communication, prepare EU reports, and ensure compliance with administrative and legal obligations. Participants: TSC, NPIAT, GPI, YOU, TPL, KIKK, FUT, AIRA, ID20, VIB, VGR, SOFP (BEN); COG, TAW (AP).' },
    ],
  },
  {
    code: 'T2', title: 'Immersive Design Team (Off-site)',
    tasks: [
      { code: 'T2.1', title: 'Needs Discovery, Research & Design Foundations', lead: 'TSC',
        description: 'Explore and define the foundation for a diverse target audience by identifying needs, institutional realities, societal trends, and early technical feasibility. Clarify technology readiness and potential operational challenges before moving into prototyping.' },
      { code: 'T2.2', title: 'Collaborative Design & Prototyping in Labs', lead: 'TSC',
        description: 'Translate research into rapid prototypes tested directly within the Experimental Lab. Design team, museum partners, and users co-create immersive concepts through iterative cycles of design, testing, and improvement.' },
      { code: 'T2.3', title: 'Inclusive Design Sprints', lead: 'TSC',
        description: 'Conduct four focused sprints to integrate diverse perspectives: 1) Youth Sprint — digital fluency and curiosity; 2) Neurodivergent Sprint — sensory balance and nonlinear engagement; 3) Older Adults Sprint — navigation, pacing, and accessibility; 4) Marginalized Groups Sprint — amplifying voices often excluded from mainstream design. Each sprint shapes core aspects of storytelling, interaction, and experience flow.' },
      { code: 'T2.4', title: 'Design for Scalability and Transferability', lead: 'GPI',
        description: 'Apply design principles, tools, and workflows that support the scalability and transferability of immersive experiences across diverse cultural venues. Includes modular design approaches, adaptable storytelling structures, and flexible setups for large and small institutions.' },
      { code: 'T2.5', title: 'Virtual Access to Experimental Lab', lead: 'TSC',
        description: 'Leverage modular design and digital twin technology to make the experience accessible for broad, pan-European testing. Virtual environments replicate the physical installations, enabling diverse audiences to engage and provide feedback remotely.' },
      { code: 'T2.6', title: 'Final Experience Design for Public Testbeds', lead: 'TSC',
        description: 'Adapt and complete the immersive experiences for public venues, ensuring readiness for large-scale user interaction. Final design includes emotional storytelling, robust technical setups, accessibility flows, and sustainable operational models. Subcontracts: S1.1, S1.2.' },
      { code: 'T2.7', title: 'Synthesis of Experimental Insights', lead: 'TSC',
        description: 'Analyse insights from lab activities, public testbeds, user feedback, and technical validation. Use AI-supported tools to synthesise findings from both controlled and real-world environments into actionable refinements for final experience delivery.' },
    ],
  },
  {
    code: 'T3', title: 'On-Site Immersive Design Team',
    tasks: [
      { code: 'T3.1', title: 'Integration into the ECHO Knowledge Flow', lead: 'VIB',
        description: 'Share findings continuously with the wider consortium. Coordinate with WP2 and project management to ensure design, testing, and implementation insights are transferred in real time. Subcontracts: S2.1, S2.2, S2.3.' },
      { code: 'T3.2', title: 'Full-Scale Production of the Snapsting Experience', lead: 'VIB',
        description: 'Develop the immersive storytelling experience from scratch. Includes concept definition, animatic, scriptwriting, production (animation, backgrounds, sound design and composition), AV and tech integration, spatial and sensory design, testing, and installation. Subcontracts: S2.1–S2.4.' },
      { code: 'T3.3', title: 'Audience Testing and Evaluation', lead: 'VIB',
        description: 'Conduct structured evaluation of the experience after launch. Collect qualitative and quantitative feedback on usability, engagement, accessibility, and emotional/educational impact. Subcontracts: S2.1.' },
      { code: 'T3.4', title: 'Adaptation for KIKK (Le Pavillon) Deployment', lead: 'VIB',
        description: "Prepare the Snapsting experience for implementation at Le Pavillon as part of WP4's public testbed activities. Ensures cross-WP collaboration and improvements based on WP4 audience feedback. Subcontracts: S2.1–S2.4." },
    ],
  },
  {
    code: 'T4', title: 'Public Testbeds',
    tasks: [
      { code: 'T4.1', title: 'Preparation for Public Deployment', lead: 'KIKK',
        description: 'Coordinate the technical, methodological, and communicative groundwork needed for successful public deployment. Includes testing methodologies, audience reception strategies, data collection protocols, on-site installation planning, visitor onboarding, accessibility considerations, and communication flows.' },
      { code: 'T4.2', title: 'Business Model Development for Sustainable Deployment', lead: 'KIKK',
        description: 'Co-develop a sustainable business model for the immersive experiences, aligned with the socio-economic contexts of the deployment venues and the strategic goals of the ECHO consortium. Outcomes will support long-term viability beyond the project timeline.' },
      { code: 'T4.3', title: 'Public Deployment & Operations', lead: 'KIKK',
        description: 'Deploy finalised immersive experiences in Le Pavillon with full technical and narrative integration, including training of local staff, maintenance, retail pop-up, and mediated activities to ensure high-quality visitor experiences.' },
      { code: 'T4.4', title: 'Public Launch at KIKK Festival (Oct 2027)', lead: 'KIKK',
        description: 'Initiate the public rollout of the immersive experience with a high-visibility launch at the KIKK Festival 2027. Includes a dedicated panel featuring members of the ECHO consortium, positioning the project within a broader cultural and innovation context.' },
      { code: 'T4.5', title: 'Audience & Journey Analytics', lead: 'KIKK',
        description: 'Collect quantitative (flows, dwell-time, conversion, access-needs) and qualitative data (surveys, interviews, observation) with AI-supported dashboards; feed insights back to WP2 & WP5.' },
      { code: 'T4.6', title: 'Evaluate Business Models and Operations', lead: 'KIKK',
        description: 'Test operational models, staffing needs, cost structures, revenue-share scenarios, and synthesise a "business blueprint" for future adopters to assess the economic and organisational viability of scaling immersive formats.' },
    ],
  },
  {
    code: 'T5', title: 'Communication, Dissemination & Impact',
    tasks: [
      { code: 'T5.1', title: 'Implement Project Internal Communication', lead: 'FUT',
        description: 'Establish internal communication tools and templates to support coordination, ensure compliance with EU standards, and enable efficient document sharing. Launch a KPI dashboard tracking progress across participants and institutions.' },
      { code: 'T5.2', title: 'AI Communication Ethics & Evaluation', lead: 'FUT',
        description: "Host AI ethics workshops for consortium members and cultural institutions. Commission an external evaluation of WP5's use of AI in content generation, accessibility, and public interaction tools. Integrate findings into mid-term and final reports." },
      { code: 'T5.3', title: 'Inter-Project Networking and Community Building', lead: 'ID20',
        description: 'Facilitate structured exchange with other EU-funded projects through joint workshops, panel discussions, and thematic meetings. Builds a "community of practice" around immersive cultural experiences and fosters a network of shared interests across consortia.' },
      { code: 'T5.4', title: 'Knowledge Transfer & Capacity Building', lead: 'FUT',
        description: "Translate the project's results into practical formats: open toolkits, templates, workshops, panel talks and masterclasses at conferences, and onboarding guides. AI tools support customisation of content for different institutions based on size, audience type, and digital maturity." },
      { code: 'T5.5', title: 'Participatory Futures & Futuremaking', lead: 'FUT',
        description: 'Lead monthly Futuremaking Workshops, producing scenarios, speculative design artifacts, and a Futuremakers Toolkit (digital + physical). Co-create the 5D TimeMap — a digital platform linking space, time, and cultural layers.' },
      { code: 'T5.6', title: 'Public Interaction & Outreach Tools', lead: 'FUT',
        description: 'Deploy the Outreach Platform for open interaction between audiences and the consortium. Develop and pilot the Timetravel Companion — a conversational AI tool that enhances public engagement with immersive installations.' },
      { code: 'T5.7', title: 'Future Design & Long-Term Visioning', lead: 'FUT',
        description: 'Using methodologies led by Futurity Systems, co-create a future vision for immersive cultural innovation. AI-generated scenario prompts and insight clustering will help identify emerging trends, societal needs, and system-level opportunities — framing a European roadmap for immersive culture.' },
    ],
  },
]

// ────────────────────────────────────────────────────────────────────────────
// Milestones — flat list, sorted chronologically by due month
// ────────────────────────────────────────────────────────────────────────────
type Milestone = { id: string; wp: string; lead: string; due: number; title: string; description: string }

const milestonesRaw: Milestone[] = [
  { id: 'MS1.1', wp: 'WP1', lead: 'LSP',   due: 1,  title: 'Consortium Alignment and Kickoff',
    description: 'All partners aligned around goals, methods, roles and reporting at project start.' },
  { id: 'MS2.1', wp: 'WP2', lead: 'TPL',   due: 3,  title: 'Needs-based design framework established',
    description: 'A strategic design brief based on user journeys, needs, behaviours, institutional inputs, and societal trends.' },
  { id: 'MS3.1', wp: 'WP3', lead: 'VIB',   due: 3,  title: 'Concept & Narrative Development Finalised',
    description: 'Core concept, narrative, full script, and storyboard for Snapsting completed through an iterative process.' },
  { id: 'MS5.1', wp: 'WP5', lead: 'ID20',  due: 3,  title: 'Inter-Project Exchange Network Established',
    description: 'Network of collaboration with other EU-funded projects formally initiated.' },
  { id: 'MS2.2', wp: 'WP2', lead: 'NPIAT', due: 4,  title: 'Lab Operational and First Prototypes Tested',
    description: 'Experimental Lab fully operational; initial immersive prototypes tested and reviewed.' },
  { id: 'MS2.3', wp: 'WP2', lead: 'TSC',   due: 6,  title: 'Inclusive Design Sprint Series Completed',
    description: 'All four inclusive co-creation sprints completed; findings integrated into design iterations.' },
  { id: 'MS3.2', wp: 'WP3', lead: 'VIB',   due: 9,  title: 'Final Production Completed',
    description: 'All elements of Snapsting finalised, including content, technology, and spatial design.' },
  { id: 'MS3.3', wp: 'WP3', lead: 'VIB',   due: 10, title: 'Experience Installed & Operational',
    description: 'Snapsting fully installed and running on-site at Museum Viborg.' },
  { id: 'MS3.4', wp: 'WP3', lead: 'VIB',   due: 8,  title: 'Consortium Meeting & Panel Talk',
    description: 'All consortium partners gather at Viborg, with a panel talk at The Animation Festival.' },
  { id: 'MS1.2', wp: 'WP1', lead: 'LSP',   due: 12, title: 'Mid-Term Coordination Review',
    description: 'Review of progress, risks, collaboration quality, and resource use at midpoint.' },
  { id: 'MS5.2', wp: 'WP5', lead: 'FUT',   due: 15, title: 'Mid-Term Impact Review Completed',
    description: 'Halfway-point review evaluating communication, knowledge transfer, stakeholder engagement, and dissemination reach.' },
  { id: 'MS4.1', wp: 'WP4', lead: 'KIKK',  due: 20, title: 'Deployment Framework and Business Model Defined',
    description: 'Strategies for public deployment established, alongside a sustainable business model co-developed with partners.' },
  { id: 'MS2.4', wp: 'WP2', lead: 'TSC',   due: 19, title: 'Prototype Designs Iterated and Final Concepts Ready',
    description: 'Prototypes evolved based on testing; final immersive experiences approved for public deployment.' },
  { id: 'MS4.2', wp: 'WP4', lead: 'KIKK',  due: 21, title: 'Public Testbed Installation Open',
    description: 'Initial venue fully fitted, show control validated; doors opened to the public (KIKK Festival, Oct 2027).' },
  { id: 'MS4.3', wp: 'WP4', lead: 'TPL',   due: 21, title: 'Cross-Venue Analytics Dashboard Live',
    description: 'Central dashboard aggregating real-time visitor flow, engagement, and accessibility data goes live.' },
  { id: 'MS3.5', wp: 'WP3', lead: 'VIB',   due: 19, title: 'Snapsting Adapted for Le Pavillon Deployment',
    description: 'Snapsting tailored for Le Pavillon, with adjustments to narrative, technical setup, and spatial design.' },
  { id: 'MS5.3', wp: 'WP5', lead: 'FUT',   due: 26, title: 'Capacity Building Resources Finalised',
    description: 'Open Learning Toolkit, How-to ECHO Guide, 5D TimeMap, and Futuremakers Toolkits completed and distributed.' },
  { id: 'MS5.4', wp: 'WP5', lead: 'FUT',   due: 28, title: 'Final Impact Dissemination',
    description: 'Final Future Design Report summarising strategic foresight outcomes and long-term pathways.' },
  { id: 'MS4.4', wp: 'WP4', lead: 'KIKK',  due: 29, title: 'Operational & Business Feasibility Reported',
    description: 'Cost, staffing, and logistics analysed to support future adoption and scale-up.' },
  { id: 'MS1.3', wp: 'WP1', lead: 'LSP',   due: 30, title: 'Final Coordination Summary',
    description: 'Strategic wrap-up of project delivery, including key learnings on coordination and decision-making.' },
]

const wpNum = (wp: string) => parseInt(wp.replace('WP', ''), 10) || 0

const milestones = [...milestonesRaw]
  .sort((a, b) => (a.due - b.due) || (wpNum(a.wp) - wpNum(b.wp)))

// ────────────────────────────────────────────────────────────────────────────
// Deliverables — full PDF data
// ────────────────────────────────────────────────────────────────────────────
type Deliverable = {
  code: string
  title: string
  due: number       // project month
  type: string      // R / DEM / DEC / DATA / DMP
  level: string     // PU / SEN / EU-RES
  wp: string
  lead: string
  description: string
  href?: string     // populated once the file is published
  status?: string   // overrides Pending/Access file label with custom text
}

const deliverables: Deliverable[] = [
  { code: 'D1.1', wp: 'WP1', lead: 'LSP',  type: 'R',           level: 'PU', due: 2,  href: 'https://drive.google.com/file/d/13Qix9_7O6KoRbu8F4qswnmmomyfafo4r/view?usp=sharing', title: 'Project Management Handbook',
    description: '[ENG] A practical guide outlining the vision aligned with internal coordination tools, reporting structure, partner responsibilities, and shared workflows. Includes templates and checklists.' },
  { code: 'D1.2', wp: 'WP1', lead: 'LSP',  type: 'R',           level: 'PU', due: 13, title: 'Mid-Term Coordination & Risk Report',
    description: '[ENG] Evaluation of progress, coordination quality, risk status, and partner self-assessments. Includes recommendations for improvements.' },
  { code: 'D2.1', wp: 'WP2', lead: 'TPL',  type: 'R',           level: 'PU', due: 4,  href: 'https://drive.google.com/file/d/1Z3nhaDkEyZpTSC9YEdBRYH4uT675bEHR/view?usp=drive_link', title: 'Needs-Driven Immersive Design Brief',
    description: '[ENG] A clear strategic guide based on user insights, institutional needs, and societal shifts — defining design challenges, user personas, emotional goals, and technical assumptions.' },
  { code: 'D2.2', wp: 'WP2', lead: 'TSC',  type: 'DEM',         level: 'PU', due: 19, title: 'Final Immersive Experience Designs',
    description: '[Language TBD] Full immersive experience packages for public deployment, including narratives, spatial and interaction designs, technical setups, onboarding/offboarding guides, and accessibility solutions.' },
  { code: 'D2.3', wp: 'WP2', lead: 'TSC',  type: 'R',           level: 'PU', due: 28, title: 'Final Immersive Experience Evaluation',
    description: '[ENG] Comprehensive evaluation of user experience, technical feasibility, and economic viability. Includes emotional impact analysis, accessibility review, system performance testing, and operational sustainability checks.' },
  { code: 'D3.1', wp: 'WP3', lead: 'VIB',  type: 'DEM',         level: 'PU', due: 10, title: 'Snapsting Immersive Experience & Documentation',
    description: '[DANISH & ENG] The completed immersive experience installed and running at Viborg Museum. Includes installation blueprints, interaction design files, and documentation for reuse or adaptation.' },
  { code: 'D3.2', wp: 'WP3', lead: 'VIB',  type: 'DEM',         level: 'PU', due: 19, title: 'Adapted Snapsting Experience Package for Le Pavillon',
    description: '[ENG] Adapted version of the Snapsting immersive experience tailored for deployment at Le Pavillon. Includes updated narrative, interaction and spatial design, technical setup, and operational guidelines.' },
  { code: 'D3.3', wp: 'WP3', lead: 'VIB',  type: 'R',           level: 'PU', due: 26, title: 'Immersive Production Process Report',
    description: '[ENG] A practical walkthrough of the on-site production process. Includes narrative development, technical decisions, collaboration model, and cultural challenges faced — positioned as a reference for other institutions.' },
  { code: 'D4.1', wp: 'WP4', lead: 'KIKK', type: 'R',           level: 'PU', due: 26, title: 'Operational Deployment Report',
    description: '[ENG] Step-by-step documentation of the public testbed roll-out, including audience logistics, spatial setup, and tech adaptation notes.' },
  { code: 'D4.2', wp: 'WP4', lead: 'KIKK', type: 'R',           level: 'PU', due: 28, title: 'User Experience & Business Model Summary',
    description: '[ENG] Evaluation of audience engagement, onboarding/offboarding flows, and feasibility of business models tested at venue.' },
  { code: 'D5.1', wp: 'WP5', lead: 'FUT',  type: 'R / DMP',     level: 'PU', due: 3,  href: 'https://drive.google.com/file/d/1SQhTx1rnGCmSbexJAegWYMAC89x6Cppq/view?usp=sharing', title: 'Communication & Dissemination Plan',
    description: '[ENG] An integrated communication strategy and plan to share outcomes widely. AI tools turn project data into articles, posts, case studies, and micro-content tailored to different European audiences. Generation in line with EU policy on AI, privacy, and tech ethics.' },
  { code: 'D5.2', wp: 'WP5', lead: 'FUT',  type: 'DEC / DATA',  level: 'PU', due: 3,  status: 'You are here!', title: 'Project Dashboard',
    description: 'A website with a live digital dashboard tracking and visualising KPIs across multiple levels: individual participant contributions, intra-institutional workflows, inter-institutional collaboration, civic engagement score, and broader societal impact. Public section + private areas for institutions, policymakers, and stakeholders.' },
  { code: 'D5.3', wp: 'WP5', lead: 'FUT',  type: 'R',           level: 'PU', due: 15, title: 'Mid-Term Impact & Dissemination Report',
    description: 'Comprehensive review of project impact, dissemination activities, and communication outcomes at the halfway point. Evaluates engagement metrics, institutional uptake, knowledge transfer effectiveness, and cross-sector collaboration.' },
  { code: 'D5.4', wp: 'WP5', lead: 'FUT',  type: 'R',           level: 'PU', due: 21, title: 'Futuremakers Toolkit',
    description: 'A hybrid (physical and digital) toolkit comprising participatory techniques, materials, and guided activities that teach cultural professionals to envision more inclusive, resilient futures. Provided in 10 EU languages. Physical: workbooks, card decks, durable playing pieces from sustainable materials. Digital: media content + a multi-user interactive whiteboard.' },
  { code: 'D5.5', wp: 'WP5', lead: 'FUT',  type: 'DEC',         level: 'PU', due: 21, title: 'Outreach Platform',
    description: 'An AI-augmented platform for frictionless two-way communication between project, institutions, and audiences. Includes operational real-time KPI dashboard. Platform in English; AI agents and content in 10 EU languages. Includes AI agent personas (museum guide, historical figure, fictitious mascot) and a tool for institutions to create their own.' },
  { code: 'D5.6', wp: 'WP5', lead: 'FUT',  type: 'DEC',         level: 'PU', due: 15, title: '5D TimeMap of Cultural Heritage Sites',
    description: 'An interactive digital map linking cultural heritage sites across Europe to their respective institutions, enriched with five dimensions: spatial, temporal, and three thematic layers (artistic, political, linguistic). Available onsite, on computers, and on mobile in 10 EU languages.' },
  { code: 'D5.7', wp: 'WP5', lead: 'FUT',  type: 'DEM',         level: 'PU', due: 21, title: 'Timetravel Companion Prototype',
    description: 'A functional prototype of the Timetravel Companion — an AI-powered guide that enriches museum visits and immersive installations through voice-based interaction, contextual storytelling, and optional holographic content. Includes app interface, content modules, user testing documentation, and accessibility evaluation in 10 EU languages. 100 custom open-source devices will be built for installations.' },
  { code: 'D5.8', wp: 'WP5', lead: 'FUT',  type: 'R',           level: 'PU', due: 26, title: 'Open Learning Toolkit & How-to ECHO Guide',
    description: 'A package of information, instructions, and tools for new cultural institutions to implement the ECHO toolkit end-to-end. Modular, ready-to-use resources built from WP2–WP4 outcomes, in 10 EU languages.' },
  { code: 'D5.9', wp: 'WP5', lead: 'ID20', type: 'R',           level: 'PU', due: 28, title: 'Inter-Project Networking Report',
    description: 'Comprehensive report documenting inter-project networking activities, including meetings, collaborative events, key outcomes, and proposals for ongoing exchange.' },
  { code: 'D5.10',wp: 'WP5', lead: 'FUT',  type: 'DEC',         level: 'PU', due: 28, title: 'Final Future Design Report',
    description: "A digital platform showcasing the project's results and long-term potential. AI-driven media tools personalise content for participants and translate project learnings into shareable formats in 10 EU languages." },
]

// ────────────────────────────────────────────────────────────────────────────
// Events & Trainings — full PDF data
// ────────────────────────────────────────────────────────────────────────────
type Event = { code: string; wp: string; name: string; type: string; location: string; days: number | string; attendees: number | string }

const events: Event[] = [
  // Dated events — sorted chronologically
  { code: 'E1',  wp: 'WP2', name: 'Youth Sprint: Future Worlds Builder',                      type: 'User-centric sprint', location: 'Gothenburg, SE',              days: 3,    attendees: 80 },
  { code: 'E2',  wp: 'WP2', name: 'Neurodivergent Sprint: Non-linear navigation',             type: 'User-centric sprint', location: 'Berlin, DE',                  days: 2,    attendees: 40 },
  { code: 'E3',  wp: 'WP3', name: 'The Snapsting Immersive Experience',                       type: 'Exhibition',          location: 'Viborg, DK',                  days: 1095, attendees: '150,000' },
  { code: 'E4',  wp: 'WP5', name: 'Echoes of the Future: Bridging Cultural Heritage and Immersive Innovation', type: 'Conference', location: 'Viborg, DK',          days: 1,    attendees: 300 },
  { code: 'E5',  wp: 'WP4', name: 'Immersive ECHO: Cultural Heritage for the Future',         type: 'Panel talk',          location: 'Namur, BE',                   days: 1,    attendees: '25,000' },
  { code: 'E6',  wp: 'WP4', name: 'Immersive ECHO',                                           type: 'Exhibition',          location: 'Namur, BE',                   days: '—',  attendees: '25,000' },
  // Remaining WP2 events
  { code: 'E7',  wp: 'WP2', name: 'Speculative prototyping',                                  type: 'Workshop',            location: 'Paris, FR',                   days: 2,    attendees: 15 },
  { code: 'E8',  wp: 'WP2', name: 'Sensory Mapping & Interaction',                            type: 'Workshop',            location: 'Gothenburg, SE',               days: 2,    attendees: 12 },
  { code: 'E9',  wp: 'WP2', name: 'Older Adult Sprint: Embodied and digital navigation',     type: 'User-centric sprint', location: 'Berlin, DE',                  days: 2,    attendees: 40 },
  { code: 'E10', wp: 'WP2', name: 'Marginalized Groups Sprint',                               type: 'User-centric sprint', location: 'Berlin, DE',                  days: 2,    attendees: 40 },
  { code: 'E11', wp: 'WP2', name: 'Digital Twin & Remote Testing Workshops',                  type: 'User-testing',        location: 'Hybrid / Online',             days: 10,   attendees: 50 },
  { code: 'E12', wp: 'WP2', name: 'Designing for Scalability & Touring Readiness',            type: 'Workshop',            location: 'Online',                      days: 2,    attendees: 50 },
  // Remaining WP3 events
  { code: 'E13', wp: 'WP3', name: 'TECH & Innovation for Immersive Storytelling',             type: 'Masterclass',         location: 'Online',                      days: 1,    attendees: 30 },
  { code: 'E14', wp: 'WP3', name: 'Creative Direction & Animation Pipeline for Cultural Narratives', type: 'Masterclass', location: 'Online',                      days: 1,    attendees: 30 },
  { code: 'E15', wp: 'WP3', name: 'Cross-Disciplinary Collaboration for Heritage Innovation', type: 'Masterclass',         location: 'Online',                      days: 1,    attendees: 30 },
  // Remaining WP4 events
  { code: 'E16', wp: 'WP4', name: 'Sensors & Emotions',                                       type: 'Workshop',            location: 'Namur, BE',                   days: 1,    attendees: 20 },
  { code: 'E17', wp: 'WP4', name: 'Become an Experience Designer',                            type: 'Workshop',            location: 'Namur, BE',                   days: 1,    attendees: 20 },
  { code: 'E18', wp: 'WP4', name: 'Immersive ECHO: Bridging Culture Heritage and Immersive Experiences', type: 'Masterclass', location: 'Namur, BE',               days: 1,    attendees: 50 },
  // Remaining WP5 events
  { code: 'E19', wp: 'WP5', name: 'Monthly Future-making sessions',                           type: 'Workshops',           location: 'In-person / Online / Hybrid', days: 14,   attendees: 280 },
  { code: 'E20', wp: 'WP5', name: 'AI, Ethics and Culture Futures: Responsible Innovation in Immersive Heritage', type: 'Workshop', location: 'In-person / Online / Hybrid', days: 1, attendees: 20 },
  { code: 'E21', wp: 'WP5', name: 'Inter-Project Exchange',                                   type: 'Workshops',           location: 'In-person / Online',          days: 8,    attendees: 40 },
]

// ────────────────────────────────────────────────────────────────────────────
// Media / Brand assets
// ────────────────────────────────────────────────────────────────────────────
type MediaItem = { title: string; format: string; href: string; note?: string }

const mediaItems: MediaItem[] = [
  { title: 'ECHO Brandbook', format: 'Folder', note: 'Now self-hosted on echosystem',
    href: 'https://drive.google.com/drive/folders/1k7P9NAMtxIi99tK77_h60syF2uTqbS03?usp=sharing' },
  { title: 'EU Co-funded Flags', format: 'Folder',
    href: 'https://drive.google.com/drive/folders/16nrPGSc9kYJK-dLtdCyjxaMSVg76PNPL?usp=drive_link' },
  { title: 'Brand Assets (gradients, logos)', format: 'Folder',
    href: 'https://drive.google.com/drive/folders/1fgTCWOpPeuKyv-PSCXsYucHR2-Qewk65?usp=drive_link' },
  { title: 'Reports Templates', format: '.ai',
    href: 'https://drive.google.com/file/d/1FnNKfZCSrR-KrKMRSM6Y6gWxItNIi_X8/view?usp=drive_link' },
  { title: 'Social Media Templates', format: '.ai',
    href: 'https://drive.google.com/file/d/1aipRDsd8y5r0ASNOyANEOnWpjrHkZzjd/view?usp=drive_link' },
  { title: 'Presentation Template', format: 'Google Slides',
    href: 'https://docs.google.com/presentation/d/12o_PZNR9hFjdBZ1YurXucx4c_--R9b4QeFkU2nLYiEQ/edit?usp=drive_link' },
  { title: 'Social Media One Pager', format: 'Google Doc',
    href: 'https://docs.google.com/document/d/1K6K7NkUQXmRP6p17HJotrPlSt9lV5IfTUyUKenX62HY/edit?tab=t.0' },
]

const pressKitItems: MediaItem[] = [
  { title: 'Press Kit', format: 'Folder',
    href: 'https://drive.google.com/drive/folders/1Pl4wS-fdkovc9GIvwNhyRIgsNFQ2Buy8?usp=sharing' },
]

// ────────────────────────────────────────────────────────────────────────────
// Reusable accordion (used for WP rows + outer Task groups)
// ────────────────────────────────────────────────────────────────────────────
function Accordion({
  open, onToggle, header, children,
}: {
  open: boolean
  onToggle: () => void
  header: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="border-b" style={{ borderColor: 'rgba(32,33,36,0.12)' }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-start gap-4 py-4 text-left group"
      >
        <span className="flex-1">{header}</span>
        <span
          className="text-lg leading-none shrink-0 mt-1 inline-block"
          style={{
            color: '#8843A3',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 250ms cubic-bezier(0.2,0.8,0.2,1)',
          }}
        >
          +
        </span>
      </button>
      <div
        className="grid"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 300ms cubic-bezier(0.2,0.8,0.2,1)',
        }}
      >
        <div className="overflow-hidden">
          <div
            className="pb-5"
            style={{
              opacity: open ? 1 : 0,
              transition: open ? 'opacity 350ms ease-out 100ms' : 'opacity 150ms ease-out',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// WP row
// ────────────────────────────────────────────────────────────────────────────
function WPRow({ wp }: { wp: WorkPackage }) {
  const [open, setOpen] = useState(false)
  return (
    <Accordion
      open={open}
      onToggle={() => setOpen(o => !o)}
      header={
        <div>
          <div className="flex items-baseline gap-3 mb-1 flex-wrap">
            <span
              className="text-xs font-bold tracking-widest"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: '#8843A3' }}
            >
              {wp.code}
            </span>
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: 'Montserrat, sans-serif', color: '#202124' }}
            >
              {wp.title}
            </h2>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(32,33,36,0.7)' }}
          >
            <span className="font-semibold">Lead: </span>{wp.lead}
            <span className="mx-2" style={{ color: 'rgba(32,33,36,0.3)' }}>·</span>
            {wp.short}
          </p>
        </div>
      }
    >
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3"
           style={{ fontFamily: 'Montserrat, sans-serif', color: '#8843A3' }}>
          Objectives
        </p>
        <ul className="space-y-2 text-sm leading-relaxed list-none"
            style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(32,33,36,0.85)' }}>
          {wp.objectives.map((o, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0" style={{ color: '#8843A3' }}>—</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-3"
          style={{ fontFamily: 'Montserrat, sans-serif', color: '#8843A3' }}
        >
          Partners
        </p>
        <div className="flex flex-wrap gap-1.5">
          {wp.partners.map(p => (
            <div
              key={p}
              title={partnerNames[p] ?? p}
              className={`h-10 rounded flex items-center ${largeLogos.has(p) ? 'px-0' : 'px-2.5'}`}
              style={{
                border: '1px solid rgba(32,33,36,0.18)',
                backgroundColor: 'rgba(32,33,36,0.04)',
              }}
            >
              <img
                src={`/logos/partner_logos/${p}.png`}
                alt={partnerNames[p] ?? p}
                className={`max-w-[72px] object-contain ${largeLogos.has(p) ? 'h-8' : 'h-5'}`}
                style={{ filter: 'invert(1)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </Accordion>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Inner task row — each task is itself an accordion that reveals its description
// ────────────────────────────────────────────────────────────────────────────
function TaskItem({ task }: { task: Task }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b last:border-0" style={{ borderColor: 'rgba(32,33,36,0.08)' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-baseline gap-4 py-3 text-left"
      >
        <span
          className="text-xs font-bold tracking-wider shrink-0"
          style={{ fontFamily: 'JetBrains Mono, monospace', color: '#8843A3', width: '3.5rem' }}
        >
          {task.code}
        </span>
        <span
          className="flex-1 text-sm"
          style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(32,33,36,0.9)' }}
        >
          {task.title}
        </span>
        <span
          className="text-xs shrink-0 hidden sm:block"
          style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(32,33,36,0.5)' }}
        >
          {task.lead}
        </span>
        <span
          className="text-base leading-none shrink-0 inline-block"
          style={{
            color: '#8843A3',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 200ms cubic-bezier(0.2,0.8,0.2,1)',
          }}
        >
          +
        </span>
      </button>
      <div
        className="grid"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 250ms cubic-bezier(0.2,0.8,0.2,1)',
        }}
      >
        <div className="overflow-hidden">
          <p
            className="pl-[3.5rem] pb-3 pr-2 text-sm leading-relaxed"
            style={{
              fontFamily: 'Roboto, sans-serif',
              color: 'rgba(32,33,36,0.75)',
              opacity: open ? 1 : 0,
              transition: open ? 'opacity 300ms ease-out 80ms' : 'opacity 120ms ease-out',
            }}
          >
            {task.description}
          </p>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Task group row — outer accordion containing TaskItem children
// ────────────────────────────────────────────────────────────────────────────
function TaskGroupRow({ group }: { group: TaskGroup }) {
  const [open, setOpen] = useState(false)
  return (
    <Accordion
      open={open}
      onToggle={() => setOpen(o => !o)}
      header={
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className="text-xs font-bold tracking-widest"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: '#8843A3' }}
          >
            {group.code}
          </span>
          <h2
            className="text-base md:text-lg font-semibold"
            style={{ fontFamily: 'Montserrat, sans-serif', color: '#202124' }}
          >
            {group.title}
          </h2>
          <span
            className="text-xs ml-auto"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(32,33,36,0.65)' }}
          >
            {group.tasks.length} tasks
          </span>
        </div>
      }
    >
      <div>
        {group.tasks.map(t => <TaskItem key={t.code} task={t} />)}
      </div>
    </Accordion>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Shared row list for asset tabs (Media / Brand, Press Kit)
// ────────────────────────────────────────────────────────────────────────────
function MediaList({ items }: { items: MediaItem[] }) {
  return (
    <div className="border-t border-b" style={{ borderColor: 'rgba(32,33,36,0.12)' }}>
      {items.map(item => (
        <div
          key={item.title}
          className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-4 border-b last:border-0"
          style={{ borderColor: 'rgba(32,33,36,0.08)', fontFamily: 'Roboto, sans-serif' }}
        >
          <div className="flex-1">
            <p className="text-sm md:text-base font-semibold mb-1" style={{ color: '#202124', fontFamily: 'Montserrat, sans-serif' }}>
              {item.title}
            </p>
            {item.note && (
              <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'rgba(32,33,36,0.7)' }}>
                {item.note}
              </p>
            )}
          </div>
          <span
            className="text-xs uppercase tracking-wider shrink-0"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(32,33,36,0.5)', minWidth: '7rem' }}
          >
            {item.format}
          </span>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Access file: ${item.title}`}
            className="text-xs font-bold uppercase tracking-wider hover:opacity-70 transition-opacity shrink-0"
            style={{ fontFamily: 'Montserrat, sans-serif', color: '#8843A3' }}
          >
            Access file →
          </a>
        </div>
      ))}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'wp',           label: 'Work Packages',  subtitle: "Five interlocking work packages structure the project's 30-month execution." },
  { id: 'tasks',        label: 'Tasks',           subtitle: 'Tasks grouped by parent work package. Click a group to expand; click any task to read its full description.' },
  { id: 'milestones',   label: 'Milestones',      subtitle: 'Project control points sorted chronologically by due month.' },
  { id: 'deliverables', label: 'Deliverables',    subtitle: 'Project outputs with their type, dissemination level, and due date.' },
  { id: 'events',       label: 'Events',          subtitle: 'Workshops, masterclasses, exhibitions, conferences, and panel talks organised by the consortium.' },
  { id: 'media',        label: 'Media / Brand',   subtitle: 'Brand assets and visual identity files for the Immersive ECHO project.' },
  { id: 'presskit',     label: 'Press Kit',       subtitle: 'Press materials for journalists and media partners covering the Immersive ECHO project.' },
] as const
type TabId = typeof TABS[number]['id']

export default function Resources() {
  useLayoutEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#F7F3E0'
    return () => { document.body.style.backgroundColor = prev }
  }, [])

  const { hash } = useLocation()
  const initialTab = (TABS.find(t => t.id === hash.replace('#', ''))?.id) ?? 'wp'
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)

  const sortedDeliverables = [...deliverables].sort((a, b) => a.due - b.due)

  const currentTab = TABS.find(t => t.id === activeTab)!

  return (
    <div
      className="-mx-4 md:-mx-8 -mt-4 md:-mt-8 px-4 md:px-12 pt-8 pb-16 md:pt-12 md:pb-20"
      style={{ backgroundColor: '#F7F3E0', color: '#202124', minHeight: '100vh' }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <Link
          to="/about"
          className="inline-block text-sm mb-6 transition-colors hover:opacity-70"
          style={{ fontFamily: 'Montserrat, sans-serif', color: '#8843A3' }}
        >
          ← Back to About
        </Link>

        {/* Page heading */}
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ fontFamily: 'Montserrat, sans-serif', color: '#8843A3' }}
        >
          For partners & reviewers
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Project Resources
        </h1>
        <p
          className="leading-relaxed mb-8 max-w-2xl"
          style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(32,33,36,0.8)' }}
        >
          Reference index of the project's structure: work packages, tasks, milestones, deliverables, and events.
          Source: CREA-CULT-2025-COOP-3 grant application. Intended for consortium partners, evaluators,
          and reviewers from the European Commission.
        </p>

        {/* ── Tab bar ──────────────────────────────────────────────── */}
        <div
          className="flex flex-wrap border-b mb-8"
          style={{ borderColor: 'rgba(32,33,36,0.18)' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: activeTab === tab.id ? '#8843A3' : 'rgba(32,33,36,0.65)',
                borderBottom: activeTab === tab.id ? '2px solid #8843A3' : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab subtitle */}
        <p
          className="text-sm leading-relaxed mb-6 max-w-xl"
          style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(32,33,36,0.7)' }}
        >
          {currentTab.subtitle}
        </p>

        {/* ── Work Packages ─────────────────────────────────────────── */}
        {activeTab === 'wp' && (
          <div className="border-t" style={{ borderColor: 'rgba(32,33,36,0.12)' }}>
            {workPackages.map(wp => <WPRow key={wp.code} wp={wp} />)}
          </div>
        )}

        {/* ── Tasks ─────────────────────────────────────────────────── */}
        {activeTab === 'tasks' && (
          <div className="border-t" style={{ borderColor: 'rgba(32,33,36,0.12)' }}>
            {taskGroups.map(g => <TaskGroupRow key={g.code} group={g} />)}
          </div>
        )}

        {/* ── Milestones ────────────────────────────────────────────── */}
        {activeTab === 'milestones' && (
          <div className="border-t border-b" style={{ borderColor: 'rgba(32,33,36,0.12)' }}>
            {milestones.map(m => (
              <div
                key={m.id}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-4 border-b last:border-0"
                style={{ borderColor: 'rgba(32,33,36,0.08)', fontFamily: 'Roboto, sans-serif' }}
              >
                <span
                  className="text-xs font-bold tracking-wider shrink-0"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: '#8843A3', width: '3.5rem' }}
                >
                  {m.id}
                </span>
                <div className="flex-1">
                  <p className="text-sm md:text-base font-semibold mb-1" style={{ color: '#202124', fontFamily: 'Montserrat, sans-serif' }}>
                    {m.title}
                  </p>
                  <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'rgba(32,33,36,0.7)' }}>
                    {m.description}
                  </p>
                </div>
                <span
                  className="text-xs uppercase tracking-wider shrink-0"
                  style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(32,33,36,0.5)' }}
                >
                  {m.wp} · {m.lead}
                </span>
                <span
                  className="text-xs shrink-0"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: isPast(m.due) ? '#16a34a' : 'rgba(32,33,36,0.55)', minWidth: '7.5rem' }}
                >
                  {dueLabel(m.due)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Deliverables ──────────────────────────────────────────── */}
        {activeTab === 'deliverables' && (
          <div className="border-t border-b" style={{ borderColor: 'rgba(32,33,36,0.12)' }}>
            {sortedDeliverables.map(d => (
              <div
                key={d.code}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-4 border-b last:border-0"
                style={{ borderColor: 'rgba(32,33,36,0.08)', fontFamily: 'Roboto, sans-serif' }}
              >
                <span
                  className="text-xs font-bold tracking-wider shrink-0"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: '#8843A3', width: '3.5rem' }}
                >
                  {d.code}
                </span>
                <div className="flex-1">
                  <p className="text-sm md:text-base font-semibold mb-1" style={{ color: '#202124', fontFamily: 'Montserrat, sans-serif' }}>
                    {d.title}
                  </p>
                  <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'rgba(32,33,36,0.7)' }}>
                    {d.description}
                  </p>
                </div>
                <span
                  className="text-xs uppercase tracking-wider shrink-0"
                  style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(32,33,36,0.5)' }}
                >
                  {d.wp} · {d.type} · {d.level}
                </span>
                <span
                  className="text-xs shrink-0"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(32,33,36,0.55)', minWidth: '7.5rem' }}
                >
                  {dueLabel(d.due)}
                </span>
                {d.status ? (
                  <span
                    className="text-xs font-bold uppercase tracking-wider shrink-0"
                    style={{ fontFamily: 'Montserrat, sans-serif', color: '#16a34a' }}
                  >
                    {d.status}
                  </span>
                ) : d.href ? (
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Access file: ${d.code} ${d.title}`}
                    className="text-xs font-bold uppercase tracking-wider hover:opacity-70 transition-opacity shrink-0"
                    style={{ fontFamily: 'Montserrat, sans-serif', color: '#8843A3' }}
                  >
                    Access file →
                  </a>
                ) : (
                  <span
                    className="text-xs uppercase tracking-wider shrink-0"
                    style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(32,33,36,0.35)' }}
                  >
                    Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Media / Brand ────────────────────────────────────────── */}
        {activeTab === 'media' && <MediaList items={mediaItems} />}

        {/* ── Press Kit ────────────────────────────────────────────── */}
        {activeTab === 'presskit' && <MediaList items={pressKitItems} />}

        {/* ── Events & Trainings ────────────────────────────────────── */}
        {activeTab === 'events' && (
          <div className="border-t border-b" style={{ borderColor: 'rgba(32,33,36,0.12)' }}>
            {events.map(e => (
              <div
                key={e.code}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b last:border-0"
                style={{ borderColor: 'rgba(32,33,36,0.08)', fontFamily: 'Roboto, sans-serif' }}
              >
                <span
                  className="text-xs font-bold tracking-wider shrink-0"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: '#8843A3', width: '3.5rem' }}
                >
                  {e.code}
                </span>
                <span className="flex-1 text-sm" style={{ color: '#202124' }}>
                  {e.name}
                </span>
                <span
                  className="text-xs uppercase tracking-wider shrink-0"
                  style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(32,33,36,0.55)' }}
                >
                  {e.type}
                </span>
                <span
                  className="text-xs shrink-0"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(32,33,36,0.55)' }}
                >
                  {e.location}
                </span>
                <span
                  className="text-xs shrink-0"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(32,33,36,0.65)', minWidth: '6rem' }}
                >
                  {e.days}d · {e.attendees} pax
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
