import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const inputClass = "w-full border-2 border-brand-purple/40 bg-brand-plum/25 text-brand-cream p-3 text-sm rounded-lg placeholder:text-brand-cream/25 focus:outline-none focus:border-brand-lilac focus:shadow-[0_0_8px_rgba(218,128,255,0.2)] transition-all duration-200"

export default function Newsletter() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', organisation: '', consent: false })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: Wire up to newsletter service (Mailchimp, Brevo, etc.)
    alert('Subscribed! — newsletter service not yet connected.')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

      {/* Left: Form */}
      <div className="bg-brand-charcoal border-r border-brand-purple/20 p-12 flex flex-col justify-between min-h-96">
        <div>
          <button onClick={() => navigate('/')} className="mb-8 cursor-pointer">
            <img src="/logos/logo-horizontal-light.png" alt="Immersive ECHO" className="h-10 w-auto" />
          </button>

          <p
            className="text-sm mb-10"
            style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.55)' }}
          >
            Stay updated on the project — new outputs, events, and findings from across the consortium.
          </p>

          <h2
            className="text-2xl font-bold mb-8 tracking-wide text-brand-cream"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Subscribe
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              ['email',        'Email *',       'email',  true],
              ['firstName',    'First Name',    'text',   false],
              ['lastName',     'Last Name',     'text',   false],
              ['organisation', 'Organisation',  'text',   false],
            ].map(([field, label, type, required]) => (
              <div key={field as string}>
                <label
                  className="block text-xs uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(247,243,224,0.5)' }}
                >
                  {label as string}
                </label>
                <input
                  type={type as string}
                  required={required as boolean}
                  placeholder={`Enter your ${(label as string).replace(' *','').toLowerCase()}`}
                  value={form[field as keyof typeof form] as string}
                  onChange={e => setForm(f => ({ ...f, [field as string]: e.target.value }))}
                  className={inputClass}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="consent"
                checked={form.consent}
                onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
                className="w-4 h-4 accent-brand-lilac"
              />
              <label htmlFor="consent" className="text-xs" style={{ color: 'rgba(247,243,224,0.45)', fontFamily: 'Roboto, sans-serif' }}>
                I agree to the{' '}
                {/* TODO: Link to real privacy policy page */}
                <span className="underline cursor-pointer text-brand-lilac hover:text-brand-lilac/80">Privacy Policy</span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-brand-lilac text-brand-charcoal border-0 rounded-lg font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-[0_0_20px_#DA80FF,0_0_40px_rgba(218,128,255,0.25)] mt-8"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social icons */}
        <div className="flex gap-3 mt-10">
          {[['in','LinkedIn'],['yt','YouTube'],['X','X'],['ig','Instagram']].map(([icon, name]) => (
            <a
              key={icon}
              href="#"
              aria-label={`Follow us on ${name}`}
              className="w-9 h-9 border border-brand-lilac/35 rounded-full flex items-center justify-center text-xs transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_8px_rgba(218,128,255,0.35)]"
              style={{ color: 'rgba(218,128,255,0.6)', fontFamily: 'Montserrat, sans-serif' }}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      {/* Right: Image placeholder */}
      {/* TODO: Replace with real immersive installation photo */}
      <div
        className="min-h-96 flex flex-col items-center justify-center gap-2"
        style={{ backgroundColor: 'rgba(90,66,99,0.2)' }}
      >
        <div className="text-sm" style={{ color: 'rgba(247,243,224,0.35)' }}>[IMAGE PLACEHOLDER]</div>
        <div className="text-xs" style={{ color: 'rgba(247,243,224,0.25)' }}>Immersive installation / testbed photo</div>
      </div>

    </div>
  )
}
