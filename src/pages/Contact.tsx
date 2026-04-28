import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const inputClass = "w-full border border-brand-purple/35 bg-brand-plum/20 text-brand-cream p-3 rounded-lg focus:outline-none focus:border-brand-lilac focus:shadow-[0_0_8px_rgba(218,128,255,0.2)] transition-all duration-200 placeholder:text-brand-cream/25"

export default function Contact() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', organisation: '', subject: '', message: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: Wire up to real form submission service (Formspree, Netlify Forms, etc.)
    alert('Form submitted — backend not yet connected.')
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
          <p className="mb-6" style={{ fontFamily: 'Roboto, sans-serif', color: 'rgba(247,243,224,0.7)' }}>
            Reach out to the coordinator team at Lindholmen Science Park for general inquiries,
            press information, or partnership questions.
          </p>

          <div className="border border-dashed border-brand-purple/35 p-6 rounded-lg mb-6">
            <h3 className="font-bold mb-2 text-brand-cream">Coordinator</h3>
            <p style={{ color: 'rgba(247,243,224,0.7)', fontFamily: 'Roboto, sans-serif' }}>Lindholmen Science Park</p>
            <p style={{ color: 'rgba(247,243,224,0.7)', fontFamily: 'Roboto, sans-serif' }}>Gothenburg, Sweden</p>
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
            {/* TODO: Replace with real SVG social icons + links */}
            <div className="flex gap-3">
              {[['f','Facebook'],['X','X'],['ig','Instagram'],['yt','YouTube']].map(([icon, name]) => (
                <a
                  key={icon}
                  href="#"
                  aria-label={`Follow us on ${name}`}
                  className="w-9 h-9 rounded-full border border-brand-lilac/40 flex items-center justify-center text-xs transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_8px_rgba(218,128,255,0.4)]"
                  style={{ color: 'rgba(218,128,255,0.7)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="border border-brand-purple/30 bg-brand-plum/15 p-6 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {(['name','organisation','subject'] as const).map(field => (
              <div key={field}>
                <label className="block font-bold mb-2 text-sm text-brand-cream capitalize" style={{ fontFamily: 'Montserrat, sans-serif' }}>{field}</label>
                <input
                  type="text"
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  className={inputClass}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>
            ))}
            <div>
              <label className="block font-bold mb-2 text-sm text-brand-cream" style={{ fontFamily: 'Montserrat, sans-serif' }}>Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className={`${inputClass} h-32 resize-none`}
                style={{ fontFamily: 'Roboto, sans-serif' }}
              />
            </div>
            <button
              type="submit"
              className="w-full border border-brand-lilac text-brand-lilac py-3 font-bold uppercase text-sm rounded-lg transition-all duration-300 hover:bg-brand-lilac/10 hover:shadow-[0_0_14px_rgba(218,128,255,0.3)]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Send Message
            </button>
          </form>
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
