import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Newsletter() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    organisation: '',
    consent: false,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: Wire up to newsletter service (Mailchimp, Brevo, etc.)
    alert('Subscribed! — newsletter service not yet connected.')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

      {/* Left: Form */}
      <div className="bg-gray-800 text-white p-12 flex flex-col justify-between min-h-96">
        <div>
          {/* Logo — TODO: replace with real logo */}
          <button
            onClick={() => navigate('/')}
            className="border-2 border-gray-500 bg-gray-600 w-40 h-16 mb-8 flex items-center justify-center text-xs font-bold text-gray-300 rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
          >
            [LOGO]
          </button>

          <p className="text-gray-300 text-sm mb-10">
            Stay updated on the project — new outputs, events, and findings from across the consortium.
          </p>

          <h2 className="text-2xl font-bold mb-8 tracking-wide">Subscribe</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border-2 border-gray-500 bg-gray-700 text-white p-3 text-sm rounded-lg placeholder-gray-500 focus:outline-none focus:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter your first name"
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                className="w-full border-2 border-gray-500 bg-gray-700 text-white p-3 text-sm rounded-lg placeholder-gray-500 focus:outline-none focus:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter your last name"
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                className="w-full border-2 border-gray-500 bg-gray-700 text-white p-3 text-sm rounded-lg placeholder-gray-500 focus:outline-none focus:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                Organisation
              </label>
              <input
                type="text"
                placeholder="Enter your organisation"
                value={form.organisation}
                onChange={e => setForm(f => ({ ...f, organisation: e.target.value }))}
                className="w-full border-2 border-gray-500 bg-gray-700 text-white p-3 text-sm rounded-lg placeholder-gray-500 focus:outline-none focus:border-gray-300"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="consent"
                checked={form.consent}
                onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
                className="w-4 h-4 border-2 border-gray-500 bg-gray-700 accent-gray-400"
              />
              <label htmlFor="consent" className="text-xs text-gray-400">
                I agree to the{' '}
                {/* TODO: Link to real privacy policy page */}
                <span className="underline cursor-pointer text-gray-300 hover:text-white">
                  Privacy Policy
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gray-600 text-white border-2 border-gray-400 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-gray-500 transition-colors mt-8"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social icons */}
        {/* TODO: Replace with real social links */}
        <div className="flex gap-3 mt-10">
          {[['in', 'LinkedIn'], ['yt', 'YouTube'], ['X', 'X'], ['ig', 'Instagram']].map(([label, name]) => (
            <a
              key={label}
              href="#"
              aria-label={`Follow us on ${name}`}
              className="w-9 h-9 border-2 border-gray-500 rounded-full flex items-center justify-center text-xs cursor-pointer hover:bg-gray-700 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Right: Image */}
      {/* TODO: Replace with real immersive installation photo */}
      <div className="bg-gray-200 min-h-96 flex flex-col items-center justify-center gap-2">
        <div className="text-gray-400 text-sm">[IMAGE PLACEHOLDER]</div>
        <div className="text-xs text-gray-400">Immersive installation / testbed photo</div>
      </div>

    </div>
  )
}
