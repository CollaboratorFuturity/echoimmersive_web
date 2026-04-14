import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
      <h1 className="text-3xl font-bold mb-8 border-b-2 border-gray-400 pb-2">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="mb-6 text-gray-700">
            Reach out to the coordinator team at Lindholmen Science Park for general inquiries,
            press information, or partnership questions.
          </p>

          <div className="border-2 border-dashed border-gray-400 p-6 rounded-lg mb-6">
            <h3 className="font-bold mb-2">Coordinator</h3>
            <p className="text-gray-700">Lindholmen Science Park</p>
            <p className="text-gray-700">Gothenburg, Sweden</p>
            <a
              href="mailto:coordinator@lindholmen.se"
              className="mt-4 underline block text-gray-700 hover:text-gray-900"
            >
              coordinator@lindholmen.se
            </a>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Stay in Touch</h3>
            {/* TODO: Replace placeholders with real SVG social icons + links */}
            <div className="flex gap-3">
              <a href="#" aria-label="Follow us on Facebook"  className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs hover:bg-gray-700 transition-colors">f</a>
              <a href="#" aria-label="Follow us on X"         className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs hover:bg-gray-700 transition-colors">X</a>
              <a href="#" aria-label="Follow us on Instagram" className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs hover:bg-gray-700 transition-colors">ig</a>
              <a href="#" aria-label="Subscribe on YouTube"   className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs hover:bg-gray-700 transition-colors">yt</a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="border-2 border-gray-400 p-6 bg-gray-100 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {([
              ['name',         'Name',         'text'],
              ['organisation', 'Organization', 'text'],
              ['subject',      'Subject',      'text'],
            ] as const).map(([field, label, type]) => (
              <div key={field}>
                <label className="block font-bold mb-2 text-sm">{label}</label>
                <input
                  type={type}
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  className="w-full border-2 border-gray-400 p-2 bg-white rounded focus:outline-none focus:border-gray-600"
                />
              </div>
            ))}
            <div>
              <label className="block font-bold mb-2 text-sm">Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full border-2 border-gray-400 p-2 bg-white h-32 rounded focus:outline-none focus:border-gray-600 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full border-2 border-gray-800 bg-gray-200 py-2 font-bold uppercase text-sm rounded-md hover:bg-gray-300 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="border-4 border-gray-500 bg-gray-200 mt-10 p-10 flex flex-col items-center gap-4 rounded-lg">
        <p className="text-lg font-bold text-gray-700">Want to stay updated on Immersive ECHO?</p>
        <button
          onClick={() => navigate('/newsletter')}
          className="px-8 py-3 bg-gray-600 text-white rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-gray-700 transition-colors"
        >
          Subscribe to our Newsletter
        </button>
      </div>
    </>
  )
}
