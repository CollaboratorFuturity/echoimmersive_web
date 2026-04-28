const revealStyle = {
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'opacity 800ms cubic-bezier(0.2,0.8,0.2,1), transform 800ms cubic-bezier(0.2,0.8,0.2,1)',
}

const Skeleton = ({ w = 'w-full' }: { w?: string }) => (
  <div className={`h-4 rounded ${w} bg-brand-plum/40`} />
)

export default function About() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8 border-b border-brand-purple/30 pb-2 text-brand-cream">
        About Immersive ECHO
      </h1>

      {/* Block 1: Mission + pull quote */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="col-span-2">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-lilac mb-3">The Mission</p>
          {/* TODO: Add final mission copy */}
          <div className="space-y-3">
            <Skeleton /><Skeleton /><Skeleton w="w-5/6" /><Skeleton /><Skeleton w="w-4/5" />
          </div>
        </div>
        <div className="border-l-2 border-brand-lilac pl-6 flex flex-col justify-center">
          <div className="text-3xl font-bold text-brand-lilac/25 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>"</div>
          {/* TODO: Add final pull quote */}
          <div className="space-y-2">
            <Skeleton /><Skeleton w="w-3/4" /><Skeleton />
          </div>
          <p className="text-xs mt-3 uppercase tracking-wider" style={{ color: 'rgba(247,243,224,0.4)' }}>— Pull quote placeholder</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-brand-purple/25 my-10 relative">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 text-xs text-brand-lilac uppercase tracking-widest" style={{ backgroundColor: '#202124' }}>
          The Approach
        </span>
      </div>

      {/* Block 2: Approach cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {['Off-site Immersive Design Team', 'On-site Immersive Design Team'].map(title => (
          <div key={title} className="border border-brand-purple/35 bg-brand-plum/20 p-6 rounded-lg transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_16px_rgba(218,128,255,0.15)]">
            <div className="w-12 h-12 rounded-full border border-brand-lilac/40 flex items-center justify-center text-xs text-brand-lilac mb-4">[Icon]</div>
            <h3 className="font-bold mb-3 text-brand-cream">{title}</h3>
            <div className="space-y-2"><Skeleton /><Skeleton /><Skeleton w="w-3/4" /></div>
          </div>
        ))}
      </div>

      {/* Block 3: Infographic */}
      <div className="mb-12">
        <div className="border border-brand-purple/35 bg-brand-plum/20 h-56 flex items-center justify-center rounded-lg" style={{ color: 'rgba(247,243,224,0.35)' }}>
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
      <div className="border-t border-dashed border-brand-purple/25 my-10 relative">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 text-xs text-brand-lilac uppercase tracking-widest" style={{ backgroundColor: '#202124' }}>
          Project Facts
        </span>
      </div>

      {/* Block 4: Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[['15','Partners'],['10','Countries'],['30','Months'],['2','Public Testbeds']].map(([value, label]) => (
          <div key={label} className="border border-brand-purple/35 bg-brand-plum/20 p-5 text-center rounded-lg transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_12px_rgba(218,128,255,0.15)]">
            <div className="text-3xl font-extrabold mb-1 text-brand-lilac">{value}</div>
            <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(247,243,224,0.5)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Block 5: Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 border border-brand-purple/35 bg-brand-plum/20 p-6 rounded-lg" style={revealStyle}>
          <div className="space-y-2"><Skeleton /><Skeleton /><Skeleton w="w-2/3" /></div>
        </div>
        <div className="border-l border-dashed border-brand-purple/30 pl-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-lilac mb-4">Project Details</p>
          <ul className="space-y-4 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {[['Duration','Feb 2026 – July 2028'],['GA Number','101255680'],['Funding','Creative Europe Large Scale'],['Coordinator','Lindholmen Science Park']].map(([key, val]) => (
              <li key={key} className="border-b border-brand-purple/20 pb-2">
                <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(247,243,224,0.45)' }}>{key}</span>
                <br /><span className="text-brand-cream">{val}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
