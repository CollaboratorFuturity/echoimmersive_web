import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { localizePath, isSupportedLang, DEFAULT_LANG, type Lang } from '@/i18n'
import { Dither } from '@/components/Dither/Dither'
import LangListbox from '@/components/LangListbox/LangListbox'

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const inputClass = "w-full border-2 border-brand-purple/40 bg-brand-plum/25 text-brand-cream p-3 text-sm rounded-lg placeholder:text-brand-cream/25 focus:outline-none focus:border-brand-lilac focus:shadow-[0_0_8px_rgba(218,128,255,0.2)] transition-all duration-200"

const fields: Array<{ name: 'email' | 'firstName' | 'lastName' | 'organisation'; type: string; required: boolean }> = [
  { name: 'email', type: 'email', required: true },
  { name: 'firstName', type: 'text', required: false },
  { name: 'lastName', type: 'text', required: false },
  { name: 'organisation', type: 'text', required: false },
]

const socials: Array<[string, string, string]> = [
  ['f', 'Facebook', 'https://www.facebook.com/profile.php?id=61589051665665'],
  ['ig', 'Instagram', 'https://www.instagram.com/echoimmersive/'],
  ['in', 'LinkedIn', 'https://www.linkedin.com/in/echo-immersive-216916403/'],
]

export default function Newsletter() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const home = localizePath(i18n.language, '/')
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', organisation: '', consent: false })
  // Defaults to the language of the page the visitor is on; null until they pick one.
  const [chosenLang, setChosenLang] = useState<Lang | null>(null)
  const language: Lang = chosenLang ?? (isSupportedLang(i18n.language) ? i18n.language : DEFAULT_LANG)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'already' | 'updated'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.consent) {
      setErrorMsg(t('newsletter.consentRequired'))
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
          language,
          consent_acknowledged: form.consent,
        }),
      })

      if (res.ok) {
        // 200 + updated:true = an existing active subscriber changed their
        // preferences (no email sent); 201 = a brand-new subscription.
        const data = await res.json().catch(() => ({}))
        setStatus(data?.updated ? 'updated' : 'success')
      } else if (res.status === 409) {
        setStatus('already')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data?.detail || t('contact.errors.generic'))
        setStatus('error')
      }
    } catch {
      setErrorMsg(t('contact.errors.network'))
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const isSuccess = status === 'success' || status === 'already' || status === 'updated'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

      {/* Left: Form or Success */}
      <div className="bg-brand-charcoal border-r border-brand-purple/20 p-6 md:p-12 flex flex-col justify-between min-h-96">
        {isSuccess ? (
          <div className="flex flex-col justify-center flex-1 gap-6">
            <button onClick={() => navigate(home)} className="mb-4 cursor-pointer self-start">
              <img src="/logos/logo-horizontal-light.png" alt="Immersive ECHO" className="h-10 w-auto" />
            </button>

            <div className="w-14 h-14 rounded-full border-2 border-brand-lilac flex items-center justify-center text-brand-lilac text-2xl">✓</div>

            <div>
              <h1 className="text-2xl font-bold text-brand-cream mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {status === 'already'
                  ? t('newsletter.success.alreadyHeading')
                  : status === 'updated'
                    ? t('newsletter.success.updatedHeading')
                    : t('newsletter.success.inHeading')}
              </h1>
              <p style={{ color: 'var(--ink-muted)', fontFamily: 'Roboto, sans-serif', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {status === 'already'
                  ? t('newsletter.success.alreadyBody', { email: form.email })
                  : status === 'updated'
                    ? t('newsletter.success.updatedBody')
                    : t('newsletter.success.inBody', { email: form.email })}
              </p>
            </div>

            <button
              onClick={() => navigate(home)}
              className="self-start px-6 py-3 border border-brand-lilac text-brand-lilac rounded-lg font-bold uppercase text-xs tracking-widest transition-all duration-300 hover:bg-brand-lilac/10"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('newsletter.backToSite')}
            </button>
          </div>
        ) : (
          <div>
            <button onClick={() => navigate(home)} className="mb-8 cursor-pointer">
              <img src="/logos/logo-horizontal-light.png" alt="Immersive ECHO" className="h-10 w-auto" />
            </button>

            <p
              className="text-sm mb-10"
              style={{ fontFamily: 'Roboto, sans-serif', color: 'var(--ink-subtle)' }}
            >
              {t('newsletter.intro')}
            </p>

            <h1
              className="text-2xl font-bold mb-8 tracking-wide text-brand-cream"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('newsletter.subscribeHeading')}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {fields.map(({ name, type, required }) => (
                <div key={name}>
                  <label
                    htmlFor={`nl-${name}`}
                    className="block text-xs uppercase tracking-wider mb-2"
                    style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--ink-subtle)' }}
                  >
                    {t(`newsletter.fields.${name}.label`)}{required ? ' *' : ''}
                  </label>
                  <input
                    id={`nl-${name}`}
                    type={type}
                    required={required}
                    placeholder={t(`newsletter.fields.${name}.placeholder`)}
                    value={form[name]}
                    onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                    className={inputClass}
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="nl-language"
                  className="block text-xs uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--ink-subtle)' }}
                >
                  {t('newsletter.fields.language.label')}
                </label>
                <LangListbox
                  id="nl-language"
                  value={language}
                  onChange={setChosenLang}
                  describedBy="nl-language-hint"
                  className={`${inputClass} cursor-pointer !w-auto !p-2 min-w-[5rem]`}
                />
                <p id="nl-language-hint" className="text-xs mt-2" style={{ color: 'var(--ink-subtle)', fontFamily: 'Roboto, sans-serif' }}>
                  {t('newsletter.fields.language.hint')}
                </p>
              </div>
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
                <label htmlFor="consent" className="text-xs" style={{ color: 'var(--ink-subtle)', fontFamily: 'Roboto, sans-serif' }}>
                  {t('newsletter.consentPrefix')}{' '}
                  {/* TODO: Link to real privacy policy page */}
                  <span className="underline cursor-pointer text-brand-lilac hover:text-brand-lilac/80">{t('newsletter.privacyPolicy')}</span>
                </label>
              </div>

              {status === 'error' && (
                <p role="alert" className="text-xs" style={{ color: '#ff8080', fontFamily: 'Roboto, sans-serif' }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-brand-lilac text-brand-charcoal border-0 rounded-lg font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-[0_0_20px_#DA80FF,0_0_40px_rgba(218,128,255,0.25)] mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {submitting ? t('newsletter.subscribing') : t('newsletter.subscribe')}
              </button>
            </form>
          </div>
        )}

        {/* Social icons — same real accounts as the Footer */}
        <div className="flex gap-3 mt-10">
          {socials.map(([icon, name, href]) => (
            <a
              key={icon}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('footer.followUs', { network: name })}
              className="w-9 h-9 border border-brand-lilac/35 rounded-full flex items-center justify-center text-xs transition-all duration-300 hover:border-brand-lilac hover:shadow-[0_0_8px_rgba(218,128,255,0.35)]"
              style={{ color: '#DA80FF', fontFamily: 'Montserrat, sans-serif' }}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      {/* Right: Dither background with centered logo */}
      <div className="relative min-h-96 overflow-hidden" style={{ backgroundColor: '#202124' }}>
        <div className="absolute inset-0" aria-hidden="true">
          <Dither
            waveColor={[0.55, 0.20, 0.65]}
            colorNum={4}
            pixelSize={2}
            waveSpeed={0.04}
            waveFrequency={2.5}
            waveAmplitude={0.22}
            enableMouseInteraction
            mouseRadius={0.1}
            disableAnimation={reduceMotion()}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/logos/logo-horizontal-light.png"
            alt=""
            className="h-12 md:h-16 w-auto opacity-90"
          />
        </div>
      </div>

    </div>
  )
}
