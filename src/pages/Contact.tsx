import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const inputClass = "w-full border border-brand-lilac/70 bg-brand-plum/20 text-brand-cream p-3 rounded-lg focus:outline-none focus:border-brand-lilac focus:ring-2 focus:ring-brand-lilac transition-all duration-200 placeholder:text-brand-cream/25"

export default function Contact() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', organisation: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const successHeadingRef = useRef<HTMLParagraphElement>(null)

  // Move focus to the success heading so screen-reader users are told the
  // submission worked (the form is replaced, so focus would otherwise be lost).
  useEffect(() => {
    if (status === 'success') successHeadingRef.current?.focus()
  }, [status])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setStatus('idle')

    try {
      const res = await fetch('/api/v1/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.name,
          email: form.email,
          organisation: form.organisation,
          subject: form.subject,
          message: form.message,
          consent_acknowledged: true,
        }),
      })

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', organisation: '', subject: '', message: '' })
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

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-8 border-b border-brand-purple/30 pb-2 text-brand-cream">
        Contact Us
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Info */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-brand-cream">Get in Touch</h2>
          <p className="mb-6" style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-muted)' }}>
            Reach out to the coordinator team at Lindholmen Science Park for general inquiries,
            press information, or partnership questions.
          </p>

          <div className="border border-dashed border-brand-purple/35 p-6 rounded-lg mb-6">
            <h3 className="font-bold mb-2 text-brand-cream">Coordinator</h3>
            <p style={{ color: 'var(--ink-muted)', fontFamily: 'Roboto, sans-serif' }}>Lindholmen Science Park</p>
            <p style={{ color: 'var(--ink-muted)', fontFamily: 'Roboto, sans-serif' }}>Gothenburg, Sweden</p>
            <a
              href="mailto:coordinator@lindholmen.se"
              className="mt-3 block text-brand-lilac hover:text-brand-lilac/80 transition-colors duration-200"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              coordinator@lindholmen.se
            </a>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-brand-lilac" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Stay in Touch
            </h3>
            {/* TODO: Replace glyphs with real SVG social icons. X + YouTube hidden until accounts exist. */}
            <div className="flex gap-3">
              {[
                ['f', 'Facebook', 'https://www.facebook.com/profile.php?id=61589051665665'],
                ['ig', 'Instagram', 'https://www.instagram.com/echoimmersive/'],
              ].map(([icon, name, href]) => (
                <a
                  key={icon}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${name}`}
                  className="w-9 h-9 rounded-full border border-brand-lilac/40 flex items-center justify-center text-xs transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_8px_rgba(218,128,255,0.4)]"
                  style={{ color: '#DA80FF', fontFamily: 'Montserrat, sans-serif' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="border border-brand-purple/30 bg-brand-plum/15 p-6 rounded-lg">
          {status === 'success' ? (
            <div role="status" className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
              <div aria-hidden="true" className="w-12 h-12 rounded-full border-2 border-brand-lilac flex items-center justify-center text-brand-lilac text-xl">✓</div>
              <p ref={successHeadingRef} tabIndex={-1} className="font-bold text-brand-cream text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>Message sent!</p>
              <p style={{ color: 'var(--ink-muted)', fontFamily: 'Roboto, sans-serif', fontSize: '0.9rem' }}>
                We'll get back to you within 5 business days. Check your inbox for a confirmation.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-sm text-brand-lilac underline hover:text-brand-lilac/80 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* aria-hidden on the asterisks: aria-required already announces "required" */}
              <p className="text-xs" style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-subtle)' }}>
                Fields marked <span aria-hidden="true" className="text-brand-lilac">*</span> are required.
              </p>
              <div>
                <label htmlFor="contact-name" className="block font-bold mb-2 text-sm text-brand-cream" style={{ fontFamily: 'Montserrat, sans-serif' }}>Name <span aria-hidden="true" className="text-brand-lilac">*</span></label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  aria-required="true"
                  autoComplete="name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block font-bold mb-2 text-sm text-brand-cream" style={{ fontFamily: 'Montserrat, sans-serif' }}>Email <span aria-hidden="true" className="text-brand-lilac">*</span></label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  aria-required="true"
                  autoComplete="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className={inputClass}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>
              {(['organisation', 'subject'] as const).map(field => (
                <div key={field}>
                  <label htmlFor={`contact-${field}`} className="block font-bold mb-2 text-sm text-brand-cream capitalize" style={{ fontFamily: 'Montserrat, sans-serif' }}>{field}</label>
                  <input
                    id={`contact-${field}`}
                    name={field}
                    type="text"
                    autoComplete={field === 'organisation' ? 'organization' : 'off'}
                    value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    className={inputClass}
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  />
                </div>
              ))}
              <div>
                <label htmlFor="contact-message" className="block font-bold mb-2 text-sm text-brand-cream" style={{ fontFamily: 'Montserrat, sans-serif' }}>Message <span aria-hidden="true" className="text-brand-lilac">*</span></label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  aria-required="true"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className={`${inputClass} h-32 resize-none`}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>

              {status === 'error' && (
                <p role="alert" className="text-sm" style={{ color: '#ff8080', fontFamily: 'Roboto, sans-serif' }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full border border-brand-lilac text-brand-lilac py-3 font-bold uppercase text-sm rounded-lg transition-all duration-300 hover:bg-brand-lilac/10 hover:shadow-[0_0_14px_rgba(218,128,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div
        className="border border-brand-purple/40 mt-10 p-10 flex flex-col items-center gap-4 rounded-lg"
        style={{ backgroundColor: 'rgba(90,66,99,0.3)' }}
      >
        <p className="text-lg font-bold text-brand-cream">Want to stay updated on Immersive ECHO?</p>
        <button
          onClick={() => navigate('/newsletter')}
          className="px-8 py-3 bg-brand-lilac text-brand-charcoal rounded-lg font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_#DA80FF,0_0_40px_rgba(218,128,255,0.25)]"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Subscribe to our Newsletter
        </button>
      </div>
    </>
  )
}
