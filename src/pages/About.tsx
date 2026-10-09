import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { localizePath } from '@/i18n'

const partnerNames: Record<string, string> = {
  AIRA:  'AIRA Dance Company',
  TSC:   'The Storytelling Company',
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

const largeLogos = new Set(['TSC', 'FUT', 'GPI', 'KIKK', 'NPIAT', 'TPL'])

type ApproachCardData = {
  titleKey: string
  partners: string[]
  descKey: string
}

const approachCards: Record<string, ApproachCardData> = {
  offsite: {
    titleKey: 'about.approach.offsite.title',
    partners: ['TSC', 'NPIAT', 'LSP', 'GPI', 'TPL', 'YOU', 'AIRA'],
    descKey: 'about.approach.offsite.desc',
  },
  onsite: {
    titleKey: 'about.approach.onsite.title',
    partners: ['VIB', 'TSC', 'GPI', 'TPL', 'ID20', 'FUT', 'AIRA'],
    descKey: 'about.approach.onsite.desc',
  },
  testbed: {
    titleKey: 'about.approach.testbed.title',
    partners: ['KIKK', 'TSC', 'YOU', 'TPL', 'FUT', 'GPI'],
    descKey: 'about.approach.testbed.desc',
  },
  coordination: {
    titleKey: 'about.approach.coordination.title',
    partners: ['LSP'],
    descKey: 'about.approach.coordination.desc',
  },
  comms: {
    titleKey: 'about.approach.comms.title',
    partners: ['FUT', 'TPL', 'LSP', 'TSC', 'GPI', 'VIB', 'ID20', 'TAW'],
    descKey: 'about.approach.comms.desc',
  },
}

function ApproachCard({ titleKey, partners, descKey }: ApproachCardData) {
  const { t } = useTranslation()
  return (
    <div className="border border-brand-purple/35 bg-brand-plum/20 p-6 rounded-lg transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_16px_rgba(218,128,255,0.15)] flex flex-col h-full">
      <h2 className="font-bold text-brand-cream mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {t(titleKey)}
      </h2>
      <p
        className="text-sm leading-relaxed mb-6 flex-grow"
        style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-body)' }}
      >
        {t(descKey)}
      </p>
      <div className="pt-4 border-t border-brand-purple/20">
        <p
          className="text-[10px] font-bold uppercase tracking-widest text-brand-lilac mb-3"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {t('about.approach.partnersLabel')}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {partners.map(p => (
            <div
              key={p}
              title={partnerNames[p] ?? p}
              className={`h-10 border border-brand-purple/25 bg-brand-plum/15 rounded flex items-center transition-all duration-200 hover:border-brand-lilac/50 hover:bg-brand-plum/30 ${largeLogos.has(p) ? 'px-0' : 'px-2.5'}`}
            >
              <img
                src={`/logos/partner_logos/${p}.png`}
                alt={partnerNames[p] ?? p}
                className={`max-w-[72px] object-contain ${largeLogos.has(p) ? 'h-8' : 'h-5'}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const objectiveKeys = ['o1', 'o2', 'o3', 'o4', 'o5']

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
              color: 'var(--ink-body)',
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
  const { t, i18n } = useTranslation()
  const lp = (p: string) => localizePath(i18n.language, p)

  // Iframe height is driven by postMessage from /charts/echo-dual-track.html
  // (sent on first render and on every resize). Fallback height while loading.
  const [chartHeight, setChartHeight] = useState(620)

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'echo-chart-height' && typeof e.data.height === 'number') {
        setChartHeight(e.data.height)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const details: Array<[string, string]> = [
    [t('about.details.durationLabel'), t('about.details.durationValue')],
    [t('about.details.gaLabel'), t('about.details.gaValue')],
    [t('about.details.fundingLabel'), t('about.details.fundingValue')],
    [t('about.details.coordinatorLabel'), t('about.details.coordinatorValue')],
  ]

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-8 border-b border-brand-purple/30 pb-2 text-brand-cream">
        {t('about.title')}
      </h1>

      {/* Block 1: Mission + pull quote */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="col-span-2">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-lilac mb-3">{t('about.objectiveLabel')}</p>
          <p className="leading-relaxed mb-6" style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-body)' }}>
            {t('about.objectiveIntro')}
          </p>

          <div className="border-t border-brand-purple/20">
            {objectiveKeys.map((k, i) => (
              <Objective
                key={k}
                index={i + 1}
                title={t(`about.objectives.${k}.title`)}
                body={t(`about.objectives.${k}.body`)}
              />
            ))}
          </div>
        </div>
        <div className="border-l-2 border-brand-lilac pl-6 flex flex-col justify-center">
          <div className="text-5xl mb-3 leading-none text-brand-lilac/30" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}>&ldquo;</div>
          <p className="leading-relaxed italic" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '1.05rem', color: 'var(--ink-strong)' }}>
            {t('about.quote')}
          </p>
          <div className="w-8 h-px bg-brand-lilac/35 mt-5" />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-brand-purple/25 my-10 relative">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 text-xs text-brand-lilac uppercase tracking-widest" style={{ backgroundColor: '#202124' }}>
          {t('about.approachDivider')}
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
            src={`/charts/echo-dual-track.html?lang=${i18n.language}`}
            title={t('about.infographic.title')}
            className="w-full block border-0"
            style={{
              // Height is reported back from the chart via postMessage on every (re)render,
              // so the iframe always matches the chart's natural size at any viewport width.
              height: `${chartHeight}px`,
              transition: 'height 200ms ease-out',
              backgroundColor: 'transparent',
              // Let mouse events pass through so the Dither background can still react.
              // The chart is purely visual — no clicks or hovers to preserve.
              pointerEvents: 'none',
            }}
            loading="lazy"
          />
        </div>
        <p className="mt-4 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-body)' }}>
          {/* TODO: Add real description for the Dual-Track Methodology infographic */}
          <span className="font-bold text-brand-cream">{t('about.infographic.label')}</span>  {t('about.infographic.caption')}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-brand-purple/25 my-10 relative">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 text-xs text-brand-lilac uppercase tracking-widest" style={{ backgroundColor: '#202124' }}>
          {t('about.factsDivider')}
        </span>
      </div>

      {/* Block 4: Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[['15', 'home.stats.partners'], ['10', 'home.stats.countries'], ['30', 'home.stats.months'], ['2', 'home.stats.testbeds']].map(([value, labelKey]) => (
          <div key={labelKey} className="border border-brand-purple/35 bg-brand-plum/20 p-5 text-center rounded-lg transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_12px_rgba(218,128,255,0.15)]">
            <div className="text-3xl font-extrabold mb-1 text-brand-lilac">{value}</div>
            <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--ink-subtle)' }}>{t(labelKey)}</div>
          </div>
        ))}
      </div>

      {/* Block 5: Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 flex items-center justify-center">
          <Link
            to={lp('/resources')}
            className="inline-flex items-center gap-4 px-7 py-5 border border-brand-purple/50 bg-brand-plum/20 rounded-lg hover:border-brand-lilac hover:bg-brand-plum/35 hover:shadow-[0_0_16px_rgba(218,128,255,0.15)] transition-all duration-300 group"
          >
            <span
              className="text-sm font-bold uppercase tracking-widest text-brand-cream"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('about.fullStructureCta')}
            </span>
            <span className="text-brand-lilac text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="border-l border-dashed border-brand-purple/30 pl-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-lilac mb-4">{t('about.projectDetails')}</p>
          <ul className="space-y-4 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {details.map(([key, val]) => (
              <li key={key} className="border-b border-brand-purple/20 pb-2">
                <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--ink-subtle)' }}>{key}</span>
                <br /><span className="text-brand-cream">{val}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
