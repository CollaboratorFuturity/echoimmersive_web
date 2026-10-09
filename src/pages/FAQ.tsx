import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// Keys only — the question/answer text lives in the locale files under
// faq.items.<key>.question / .answer
const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14']

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-brand-purple/30 rounded-lg overflow-hidden">
      <button
        className="w-full text-left px-5 py-4 font-semibold flex justify-between items-center cursor-pointer transition-colors duration-200 text-sm text-brand-cream"
        style={{ fontFamily: 'Montserrat, sans-serif', backgroundColor: open ? 'rgba(90,66,99,0.35)' : 'rgba(90,66,99,0.2)' }}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        onMouseEnter={e => { if (!open) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(90,66,99,0.3)' }}
        onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(90,66,99,0.2)' }}
      >
        {q}
        <span className="text-lg font-light text-brand-lilac ml-4 shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div
          className="px-5 py-4 text-sm leading-relaxed border-t border-brand-purple/20"
          style={{ fontFamily: 'Roboto, sans-serif', backgroundColor: 'rgba(32,33,36,0.8)', color: 'var(--ink-body)' }}
        >
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const { t } = useTranslation()
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 border-b border-brand-purple/30 pb-2 text-brand-cream">
        {t('faq.title')}
      </h1>
      <div className="space-y-3">
        {faqKeys.map((k) => (
          <FAQItem key={k} q={t(`faq.items.${k}.question`)} a={t(`faq.items.${k}.answer`)} />
        ))}
      </div>
    </div>
  )
}
