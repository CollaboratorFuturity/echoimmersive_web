import { Link } from 'react-router-dom'

export default function PavillonActivities() {
  return (
    <>
      <Link to="/pilots" className="underline text-sm font-bold hover:text-gray-600 mb-4 inline-block">
        ← Back to Pilots
      </Link>

      <h1 className="text-3xl font-bold mb-4 border-b-2 border-gray-400 pb-2">
        Le Pavillon — Activities
      </h1>
      <p className="mb-8 max-w-3xl text-gray-700">
        {/* TODO: Add real intro about Le Pavillon activities */}
        Overview of Le Pavillon testbed activities in Namur, Belgium.
      </p>

      {/* TODO: Populate with real activity cards */}
      <div className="space-y-4">
        <div className="border-2 border-gray-300 p-6 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
        <div className="border-2 border-gray-300 p-6 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>

      <p className="italic text-gray-600 text-center max-w-3xl mx-auto my-12">
        (*Note = Description on process from early briefs, over concept development, script, animatic etc…to final experience.
        It could be cool that we can show the team behind, so we have an idea which team it takes, and the organisation around it.
        The fact that the museum is the "final director".
      </p>
    </>
  )
}
