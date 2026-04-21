export default function LynchAbout() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8 border-b border-light-blue pb-2">
        About Immersive ECHO
      </h1>

      {/* Block 1: Mission + pull quote */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="col-span-2">
          <p className="text-xs font-bold uppercase tracking-widest text-highlight-purple mb-3">The Mission</p>
          {/* TODO: Add final mission copy */}
          <div className="space-y-3">
            <div className="h-4 bg-primary-blue/40 rounded w-full" />
            <div className="h-4 bg-primary-blue/40 rounded w-full" />
            <div className="h-4 bg-primary-blue/40 rounded w-5/6" />
            <div className="h-4 bg-primary-blue/40 rounded w-full mt-2" />
            <div className="h-4 bg-primary-blue/40 rounded w-4/5" />
          </div>
        </div>
        {/* Pull quote */}
        <div className="border-l-4 border-highlight-purple pl-6 flex flex-col justify-center">
          <div className="text-3xl font-bold text-highlight-purple/40 mb-2">"</div>
          {/* TODO: Add final pull quote */}
          <div className="space-y-2">
            <div className="h-4 bg-primary-blue/40 rounded w-full" />
            <div className="h-4 bg-primary-blue/40 rounded w-3/4" />
            <div className="h-4 bg-primary-blue/40 rounded w-full" />
          </div>
          <p className="text-xs text-white/40 mt-3 uppercase tracking-wider">— Pull quote placeholder</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-light-blue/40 my-10 relative">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bg-blue px-4 text-xs text-highlight-purple uppercase tracking-widest">
          The Approach
        </span>
      </div>

      {/* Block 2: Dual-track approach cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {['Off-site Immersive Design Team', 'On-site Immersive Design Team'].map((title) => (
          <div
            key={title}
            className="border border-light-blue bg-primary-blue/20 p-6 rounded-lg
                       hover:border-highlight-purple hover:shadow-[0_0_16px_#3038D9] transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full border border-highlight-purple flex items-center justify-center text-xs text-highlight-purple mb-4">
              [Icon]
            </div>
            <h3 className="font-bold mb-3 text-white">{title}</h3>
            {/* TODO: Add description */}
            <div className="space-y-2">
              <div className="h-4 bg-primary-blue/40 rounded w-full" />
              <div className="h-4 bg-primary-blue/40 rounded w-full" />
              <div className="h-4 bg-primary-blue/40 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>

      {/* Block 3: Infographic */}
      <div className="mb-12">
        <div className="border border-light-blue bg-primary-blue/20 h-56 flex items-center justify-center text-white/40 rounded-lg">
          [Infographic: Dual-Track Design Methodology → Public Testbed]
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-light-blue/40 my-10 relative">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bg-blue px-4 text-xs text-highlight-purple uppercase tracking-widest">
          Project Facts
        </span>
      </div>

      {/* Block 4: Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { value: '15', label: 'Partners' },
          { value: '10', label: 'Countries' },
          { value: '30', label: 'Months' },
          { value: '2',  label: 'Public Testbeds' },
        ].map(({ value, label }) => (
          <div
            key={label}
            className="border border-light-blue bg-primary-blue/20 p-5 text-center rounded-lg
                       hover:border-highlight-purple hover:shadow-[0_0_12px_#3038D9] transition-all duration-300"
          >
            <div className="text-3xl font-extrabold mb-1 text-highlight-green">{value}</div>
            <div className="text-xs uppercase tracking-wider text-white/60">{label}</div>
          </div>
        ))}
      </div>

      {/* Block 5: Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 border border-light-blue bg-primary-blue/20 p-6 rounded-lg">
          {/* TODO: Add project description body copy */}
          <div className="space-y-2">
            <div className="h-4 bg-primary-blue/40 rounded w-full" />
            <div className="h-4 bg-primary-blue/40 rounded w-full" />
            <div className="h-4 bg-primary-blue/40 rounded w-2/3" />
          </div>
        </div>
        <div className="border-l border-dashed border-light-blue/40 pl-8">
          <p className="text-xs font-bold uppercase tracking-widest text-highlight-purple mb-4">Project Details</p>
          <ul className="space-y-4 text-sm">
            {[
              ['Duration',    'Feb 2026 – July 2028'],
              ['GA Number',   '101255680'],
              ['Funding',     'Creative Europe Large Scale'],
              ['Coordinator', 'Lindholmen Science Park'],
            ].map(([key, val]) => (
              <li key={key} className="border-b border-light-blue/30 pb-2">
                <strong className="text-white/60 font-normal uppercase text-xs tracking-wider">{key}</strong>
                <br />
                <span className="text-white">{val}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </>
  )
}
