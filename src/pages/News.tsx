import { useState } from 'react'

type FilterType = 'All' | 'News' | 'Events' | 'Press'
const FILTERS: FilterType[] = ['All', 'News', 'Events', 'Press']

// TODO: Replace with real data from CMS or static content
const articles = [
  {
    id: 1,
    type: 'News' as FilterType,
    date: 'March 2026',
    title: 'Immersive ECHO Project Officially Launches',
    excerpt: null, // TODO: Add real excerpt
  },
  {
    id: 2,
    type: 'Events' as FilterType,
    date: 'M3',
    title: 'Design Brief Workshop Scheduled',
    excerpt: null, // TODO: Add real excerpt
  },
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
      <div className="flex justify-between items-end mb-8 border-b-2 border-gray-400 pb-2">
        <h1 className="text-3xl font-bold">News, Events & Activities</h1>
        {/* TODO: Link to real media kit ZIP */}
        <button className="border-2 border-gray-800 bg-gray-100 px-4 py-2 font-bold uppercase text-xs rounded-md hover:bg-gray-200 transition-colors">
          ⬇ Download Media Kit
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`border-2 px-4 py-2 font-bold uppercase text-sm rounded-md transition-colors ${
              filter === f
                ? 'bg-gray-700 text-white border-gray-700'
                : 'border-gray-800 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Feed */}
        <div className="col-span-2 space-y-6">
          <h2 className="text-xl font-bold mb-4">Latest Updates</h2>
          {filtered.map(({ id, type, date, title }) => (
            <div key={id} className="flex gap-4 border-2 border-gray-300 p-4 rounded-lg">
              {/* TODO: Replace with real thumbnail */}
              <div className="border-2 border-gray-400 bg-gray-200 w-32 h-32 shrink-0 flex items-center justify-center text-gray-500 text-xs rounded">
                [Thumb]
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">
                  {type} | {date}
                </span>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                {/* TODO: Add real excerpt */}
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-4/5" />
                </div>
                <a href="#" className="underline text-sm font-bold hover:text-gray-600">
                  Read More →
                </a>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm">No items in this category yet.</p>
          )}
        </div>

        {/* Galleries sidebar */}
        <div className="col-span-1 bg-gray-200 p-6 border-2 border-gray-400 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Event Galleries</h2>
          <div className="space-y-4">
            {galleries.map(name => (
              <button
                key={name}
                className="w-full border-2 border-gray-400 bg-gray-200 h-20 flex items-center px-4 gap-3 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors text-left"
                // TODO: Wire up to real gallery / lightbox
                onClick={() => alert(`Open gallery: ${name}`)}
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
