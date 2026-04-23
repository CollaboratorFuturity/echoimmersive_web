export default function About() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8 border-b-2 border-gray-400 pb-2">
        About Immersive ECHO
      </h1>

      {/* Block 1: Mission + pull quote */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="col-span-2">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">The Mission</p>
          {/* TODO: Add final mission copy */}
          <div className="space-y-3 text-gray-600">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-full mt-2" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
        {/* Pull quote */}
        <div className="border-l-4 border-gray-800 pl-6 flex flex-col justify-center">
          <div className="text-3xl font-bold text-gray-300 mb-2">"</div>
          {/* TODO: Add final pull quote */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
          <p className="text-xs text-gray-400 mt-3 uppercase tracking-wider">— Pull quote placeholder</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-dashed border-gray-300 my-10 relative">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-50 px-4 text-xs text-gray-400 uppercase tracking-widest">
          The Approach
        </span>
      </div>

      {/* Block 2: Dual-track approach cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="border-2 border-gray-400 p-6 rounded-lg">
          {/* TODO: Replace with real icon */}
          <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-gray-400 flex items-center justify-center text-xs text-gray-500 mb-4">
            [Icon]
          </div>
          <h3 className="font-bold mb-3">Off-site Immersive Design Team</h3>
          {/* TODO: Add description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
        <div className="border-2 border-gray-400 p-6 rounded-lg">
          {/* TODO: Replace with real icon */}
          <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-gray-400 flex items-center justify-center text-xs text-gray-500 mb-4">
            [Icon]
          </div>
          <h3 className="font-bold mb-3">On-site Immersive Design Team</h3>
          {/* TODO: Add description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>

      {/* Block 3: Infographic */}
      <div className="mb-12">
        {/* TODO: Replace with real infographic SVG or image */}
        <div className="border-2 border-gray-400 bg-gray-200 h-56 flex items-center justify-center text-gray-500 rounded-lg">
          [Infographic: Dual-Track Design Methodology → Public Testbed]
        </div>
        <p className="mt-4 text-gray-700">
          <span className="font-bold">About:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
        </p>
      </div>

      {/* Block 3b: Curriculum model infographic */}
      <div className="mb-12">
        {/* TODO: Replace with real infographic SVG or image */}
        <div className="border-2 border-gray-400 bg-gray-200 h-56 flex items-center justify-center text-gray-500 rounded-lg">
          [Infographic: Immersive ECHO Curriculum Model]
        </div>
        <p className="mt-4 text-gray-700">
          <span className="font-bold">About:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-dashed border-gray-300 my-10 relative">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-50 px-4 text-xs text-gray-400 uppercase tracking-widest">
          Project Facts
        </span>
      </div>

      {/* Block 4: Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { value: '15',  label: 'Partners' },
          { value: '10',  label: 'Countries' },
          { value: '30',  label: 'Months' },
          { value: '2',   label: 'Public Testbeds' },
        ].map(({ value, label }) => (
          <div key={label} className="border-2 border-gray-400 p-5 text-center rounded-lg">
            <div className="text-3xl font-extrabold mb-1">{value}</div>
            <div className="text-xs uppercase tracking-wider text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Block 5: Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 border-2 border-gray-300 p-6 rounded-lg">
          {/* TODO: Add project description body copy */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
        <div className="border-l-2 border-dashed border-gray-400 pl-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Project Details</p>
          <ul className="space-y-4 text-sm">
            {[
              ['Duration',    'Feb 2026 – July 2028'],
              ['GA Number',   '101255680'],
              ['Funding',     'Creative Europe Large Scale'],
              ['Coordinator', 'Lindholmen Science Park'],
            ].map(([key, val]) => (
              <li key={key} className="border-b border-gray-300 pb-2">
                <strong>{key}:</strong><br />{val}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
