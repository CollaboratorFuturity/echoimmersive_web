import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const inputClass = "w-full border-2 border-brand-purple/40 bg-brand-plum/25 text-brand-cream p-3 text-sm rounded-lg placeholder:text-brand-cream/25 focus:outline-none focus:border-brand-lilac focus:shadow-[0_0_8px_rgba(218,128,255,0.2)] transition-all duration-200"

export default function Newsletter() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', organisation: '', consent: false })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'already'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.consent) {
      setErrorMsg('Please agree to the Privacy Policy to subscribe.')
      setStatus('error')
      return
    }

    setSubmitting(true)
    setStatus('idle')

    try {
      const res = await fetch('/api/v1/public/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          first_name: form.firstName,
          last_name: form.lastName,
          organisation: form.organisation,
          consent_acknowledged: form.consent,
        }),
      })

      if (res.ok) {
        setStatus('success')
      } else if (res.status === 409) {
        setStatus('already')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data?.detail || 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Could not reach the server. Please check your connection.')
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const isSuccess = status === 'success' || status === 'already'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

      {/* Left: Form or Success */}
      <div className="bg-brand-charcoal border-r border-brand-purple/20 p-6 md:p-12 flex flex-col justify-between min-h-96">
        {isSuccess ? (
          <div className="flex flex-col justify-center flex-1 gap-6">
            <button onClick={() => navigate('/')} className="mb-4 cursor-pointer self-start">
              <img src="/logos/logo-horizontal-light.png" alt="Immersive ECHO" className="h-10 w-auto" />
            </button>

            <div className="w-14 h-14 rounded-full border-2 border-brand-lilac flex items-center justify-center text-brand-lilac text-2xl">✓</div>

            <div>
              <h2 className="text-2xl font-bold text-brand-cream mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {status === 'already' ? 'Already subscribed!' : "You're in!"}
              </h2>
              <p style={{ color: 'rgba(247,243,224,0.6)', fontFamily: 'Roboto, sans-serif', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {status === 'already'
                  ? `${form.email} is already on our list. No action needed.`
                  : `We've sent a welcome email to ${form.email}. You'll hear from us when there's something worth sharing.`}
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="self-start px-6 py-3 border border-brand-lilac text-brand-lilac rounded-lg font-bold uppercase text-xs tracking-widest transition-all duration-300 hover:bg-brand-lilac/10"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Back to site
            </button>
          </div>
        ) : (
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
                  onChange={e => {
                    setForm(f => ({ ...f, consent: e.target.checked }))
                    if (status === 'error') setStatus('idle')
                  }}
                  className="w-4 h-4 accent-brand-lilac"
                />
                <label htmlFor="consent" className="text-xs" style={{ color: 'rgba(247,243,224,0.45)', fontFamily: 'Roboto, sans-serif' }}>
                  I agree to the{' '}
                  {/* TODO: Link to real privacy policy page */}
                  <span className="underline cursor-pointer text-brand-lilac hover:text-brand-lilac/80">Privacy Policy</span>
                </label>
              </div>

              {status === 'error' && (
                <p className="text-xs" style={{ color: '#ff8080', fontFamily: 'Roboto, sans-serif' }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-brand-lilac text-brand-charcoal border-0 rounded-lg font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-[0_0_20px_#DA80FF,0_0_40px_rgba(218,128,255,0.25)] mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {submitting ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          </div>
        )}

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
