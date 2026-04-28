import { useState } from 'react'

type FilterType = 'All' | 'News' | 'Events' | 'Press'
const FILTERS: FilterType[] = ['All', 'News', 'Events', 'Press']

const articles = [
  { id: 1, type: 'News' as FilterType,   date: 'March 2026', title: 'Immersive ECHO Project Officially Launches' },
  { id: 2, type: 'Events' as FilterType, date: 'M3',         title: 'Design Brief Workshop Scheduled' },
]

const galleries = [
  'Kick-off Meeting (Gothenburg)',
  'Design Brief Workshop',
  'Futuremakers Toolkit Session',
]

export default function News() {
  const [filter, setFilter] = useState<FilterType>('All')
  const filtered = filter === 'All' ? articles : articles.filter(a => a.type === filter)

  return (
    <>
      <div className="flex justify-between items-end mb-8 border-b border-brand-purple/30 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-cream">News, Events & Activities</h1>
        {/* TODO: Link to real media kit ZIP */}
        <button
          className="border border-brand-lilac/50 text-brand-lilac px-4 py-2 text-xs font-bold uppercase rounded-md transition-all duration-300 hover:bg-brand-lilac/10 hover:shadow-[0_0_10px_rgba(218,128,255,0.25)]"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          ⬇ Download Media Kit
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-8">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-bold uppercase rounded-md transition-all duration-300 ${
              filter === f
                ? 'bg-brand-lilac text-brand-charcoal shadow-[0_0_12px_rgba(218,128,255,0.4)]'
                : 'border border-brand-purple/35 text-brand-cream/65 hover:border-brand-lilac hover:text-brand-lilac'
            }`}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Feed */}
        <div className="col-span-2 space-y-6">
          <h2 className="text-xl font-bold mb-4 text-brand-cream">Latest Updates</h2>
          {filtered.map(({ id, type, date, title }) => (
            <div key={id} className="flex flex-col sm:flex-row gap-4 border border-brand-purple/30 bg-brand-plum/15 p-4 rounded-lg transition-all duration-300 hover:border-brand-lilac/50">
              {/* TODO: Replace with real thumbnail */}
              <div className="border border-brand-purple/25 bg-brand-plum/30 w-full sm:w-32 h-32 shrink-0 flex items-center justify-center text-xs rounded" style={{ color: 'rgba(247,243,224,0.35)' }}>
                [Thumb]
              </div>
              <div>
                <span className="text-xs font-bold uppercase" style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(218,128,255,0.7)' }}>
                  {type} | {date}
                </span>
                <h3 className="text-lg font-bold mb-2 mt-1 text-brand-cream">{title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="h-3 rounded w-full bg-brand-plum/40" />
                  <div className="h-3 rounded w-4/5 bg-brand-plum/40" />
                </div>
                <a href="#" className="text-brand-lilac underline text-sm font-bold hover:text-brand-lilac/80">Read More →</a>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm" style={{ color: 'rgba(247,243,224,0.45)' }}>No items in this category yet.</p>
          )}
        </div>

        {/* Galleries sidebar */}
        <div className="border border-brand-purple/30 bg-brand-plum/15 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-brand-cream">Event Galleries</h2>
          <div className="space-y-3">
            {galleries.map(name => (
              <button
                key={name}
                onClick={() => alert(`Open gallery: ${name}`)}
                className="w-full border border-brand-purple/30 bg-brand-plum/20 h-16 flex items-center px-4 gap-3 text-sm rounded-lg transition-all duration-300 hover:border-brand-lilac hover:bg-brand-plum/35 text-left"
                style={{ color: 'rgba(247,243,224,0.7)', fontFamily: 'Roboto, sans-serif' }}
              >
                📁 {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
