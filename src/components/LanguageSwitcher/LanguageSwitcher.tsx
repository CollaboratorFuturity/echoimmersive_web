import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { isSupportedLang, DEFAULT_LANG, type Lang } from '@/i18n'
import LangListbox from '@/components/LangListbox/LangListbox'

/**
 * Header language picker. Uses LangListbox (not a native <select>) so the list
 * always opens below the trigger instead of flipping upward over the browser UI.
 * Switching swaps the language segment of the current path and navigates, so the
 * user stays on the same page in the new language.
 */
export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const current: Lang = isSupportedLang(i18n.language) ? i18n.language : DEFAULT_LANG

  function switchTo(lang: Lang) {
    const seg = pathname.split('/').filter(Boolean)
    if (seg.length && isSupportedLang(seg[0])) seg[0] = lang
    else seg.unshift(lang)
    navigate('/' + seg.join('/'))
  }

  return (
    <LangListbox
      id="header-language"
      value={current}
      onChange={switchTo}
      ariaLabel={t('nav.selectLanguage', 'Select language')}
      align="right"
      className="text-xs font-medium rounded-md border border-brand-lilac/40 bg-brand-charcoal text-brand-cream px-2 py-1.5 cursor-pointer transition-colors duration-200 hover:border-brand-lilac focus:outline-none focus:ring-2 focus:ring-brand-lilac"
    />
  )
}
