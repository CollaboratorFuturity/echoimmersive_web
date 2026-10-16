import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

// The 10 EU languages ECHO commits to for public-facing content (TRD C7), plus Finnish and
// Ukrainian (partner countries). Adding a code here makes it routable (/fi/..., /uk/...);
// it is only OFFERED to visitors once it is in AVAILABLE_LANGUAGES below.
// English is the default and the fallback every other language resolves to
// until its translation file is filled in.
export const SUPPORTED_LANGUAGES = [
  'en', // English
  'fr', // French
  'de', // German
  'es', // Spanish
  'it', // Italian
  'nl', // Dutch
  'sv', // Swedish
  'da', // Danish
  'sl', // Slovenian
  'ro', // Romanian
  'fi', // Finnish
  'uk', // Ukrainian
] as const

export type Lang = (typeof SUPPORTED_LANGUAGES)[number]
export const DEFAULT_LANG: Lang = 'en'

// Human-readable names for the language switcher (endonyms).
export const LANGUAGE_NAMES: Record<Lang, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  nl: 'Nederlands',
  sv: 'Svenska',
  da: 'Dansk',
  sl: 'Slovenščina',
  ro: 'Română',
  fi: 'Suomi',
  uk: 'Українська',
}

// Languages whose translation is complete enough to offer to visitors. Only these
// appear in the language pickers and in hreflang. The others still resolve by URL
// (e.g. /sv/about falls back to English text) so a translation can be previewed
// while it is being written. To launch a language: finish its files, then add it here.
export const AVAILABLE_LANGUAGES: readonly Lang[] = ['en', 'es']

// Public language picker. TRUE: the header picker is shown and offers AVAILABLE_LANGUAGES
// (the human-reviewed ones), "/" goes to the visitor's last/browser language if it is
// available (else English), and hreflang advertises AVAILABLE_LANGUAGES. Languages that
// are supported but NOT available (unreviewed) still open by URL (/fr/...) for review,
// but carry noindex and are never auto-selected. FALSE = full review mode: picker hidden,
// "/" always English, no hreflang.
export const SHOW_LANGUAGE_SWITCHER = true

export function isAvailableLang(value: string | undefined): value is Lang {
  return !!value && (AVAILABLE_LANGUAGES as readonly string[]).includes(value)
}

export function isSupportedLang(value: string | undefined): value is Lang {
  return !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}

/**
 * Prefix an internal path with the active language, e.g.
 * localizePath('sv', '/about') → '/sv/about'. Use for every internal link so
 * navigation stays within the chosen language.
 */
export function localizePath(lang: string | undefined, path: string): string {
  const l = isSupportedLang(lang) ? lang : DEFAULT_LANG
  if (!path || path === '/') return `/${l}`
  return `/${l}${path.startsWith('/') ? path : `/${path}`}`
}

i18n
  .use(HttpBackend) // lazy-loads /locales/{lng}/translation.json at runtime
  .use(LanguageDetector) // used only for the bare "/" redirect decision
  .use(initReactI18next)
  .init({
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    fallbackLng: DEFAULT_LANG,
    load: 'languageOnly', // treat "sv-SE" as "sv"
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      // The URL path segment is the source of truth; the router sets the
      // language explicitly on every navigation. localStorage/navigator only
      // seed the first redirect from "/".
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
  })

export default i18n
