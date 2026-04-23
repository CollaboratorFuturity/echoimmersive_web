import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      {/* Hero */}
      <div className="border-2 border-gray-400 bg-gray-200 h-80 mb-8 flex flex-col items-center justify-center text-center rounded-lg relative">
        <span className="absolute top-4 left-4 bg-white border-2 border-gray-400 px-2 py-1 text-xs font-bold">
          STATUS: ONGOING
        </span>
        <h1
          className="text-3xl font-extrabold text-gray-800 mb-2"
          style={{ letterSpacing: '0.04em' }}
        >
          IMMERSIVE ECHO
        </h1>
        <p className="text-lg font-normal mb-4 text-gray-700">
          Creating Collective Immersive Experiences for European Cultural Heritage
        </p>
        {/* TODO: Replace with real hero image or video */}
        <div className="border-2 border-dashed border-gray-400 w-3/4 h-24 flex items-center justify-center text-gray-500 text-sm rounded-lg">
          [HERO IMAGE / VIDEO PLACEHOLDER: Room-scale projection environment]
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-3xl mx-auto mb-12 space-y-5 text-base leading-relaxed text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>
        <p>
          Cultural heritage exists because people need it. It functions as a living connection to
          place, to community, to the stories that explain who we are and how we got here. Yet for
          millions of people across Europe, that connection is breaking down. The spaces and formats
          meant to carry these stories simply haven't kept pace with the people they're meant to
          serve.
        </p>
        <p>
          Smaller cultural heritage institutions feel this most acutely. Without the resources of
          major flagships, they watch audiences shrink, younger generations drift, and communities
          that were never quite reflected in their collections stop showing up at all. The tools to
          change this exist. Immersive, multi-sensory experiences that surround you with a story
          rather than presenting it from behind glass are proven and powerful. But they remain out
          of reach for most.
        </p>
        <p>
          Immersive ECHO starts from a different premise: that heritage is most powerful when it's
          felt collectively, in shared spaces, by people who might not have sought it out on their
          own. The project's mission is to give cultural institutions across Europe the practical
          means to bring people back into the story. Their story.
        </p>
      </div>

      {/* Newsletter CTA */}
      <div
        className="border-2 border-gray-300 rounded-xl bg-gray-200 py-12 px-8 text-center max-w-2xl mx-auto mb-8"
      >
        <p className="font-bold text-base text-gray-800 mb-6">
          Want to stay updated on Immersive ECHO?
        </p>
        <button
          onClick={() => navigate('/newsletter')}
          className="px-10 py-3 bg-gray-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-gray-700 transition-colors cursor-pointer"
        >
          Subscribe to our Newsletter
        </button>
      </div>
    </>
  )
}
