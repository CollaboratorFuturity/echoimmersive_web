import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_LANG, isSupportedLang } from '@/i18n'
import type { NewsletterIssue } from './blocks'

type LoadState = 'loading' | 'ready' | 'notfound'

async function fetchIssue(lng: string, id: string): Promise<NewsletterIssue | null> {
  try {
    const res = await fetch(`/locales/${lng}/newsletters/${id}.json`)
    if (!res.ok) return null
    return (await res.json()) as NewsletterIssue
  } catch {
    return null
  }
}

/**
 * Loads a newsletter issue document for the active language, falling back to
 * English if that language's file doesn't exist yet. Mirrors the i18n fallback
 * used everywhere else, so an issue can ship partially translated.
 */
export function useNewsletterIssue(id: string) {
  const { i18n } = useTranslation()
  const lng = isSupportedLang(i18n.language) ? i18n.language : DEFAULT_LANG
  const [issue, setIssue] = useState<NewsletterIssue | null>(null)
  const [state, setState] = useState<LoadState>('loading')

  useEffect(() => {
    let cancelled = false
    setState('loading')
    ;(async () => {
      let data = await fetchIssue(lng, id)
      if (!data && lng !== DEFAULT_LANG) data = await fetchIssue(DEFAULT_LANG, id)
      if (cancelled) return
      if (data) {
        setIssue(data)
        setState('ready')
      } else {
        setState('notfound')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [lng, id])

  return { issue, state }
}
