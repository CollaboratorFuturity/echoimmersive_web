import { useEffect, useId, useRef, useState } from 'react'
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, type Lang } from '@/i18n'

interface Props {
  /** id for the trigger — point the <label htmlFor> at this. */
  id: string
  value: Lang
  onChange: (lang: Lang) => void
  describedBy?: string
  /** Accessible name when there is no visible <label> (e.g. the header switcher). */
  ariaLabel?: string
  /** Which edge of the trigger the list lines up with. Use "right" near the right edge of the screen. */
  align?: 'left' | 'right'
  /** Classes for the trigger button (the closed state). */
  className?: string
}

/**
 * Language dropdown whose list ALWAYS opens below the trigger. A native <select>
 * lets the browser pick the direction (it flips upward near the bottom of the
 * viewport and can cover the browser UI), which CSS can't override.
 *
 * Follows the ARIA "select-only combobox" pattern: arrow keys / Home / End move,
 * Enter or Space picks, Esc closes, typing a letter jumps to a match, Tab picks
 * and moves on. The trigger shows the short code; the list adds the full name.
 */
export default function LangListbox({ id, value, onChange, describedBy, ariaLabel, align = 'left', className = '' }: Props) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(SUPPORTED_LANGUAGES.indexOf(value))
  const optionId = (i: number) => `${listId}-opt-${i}`

  // Click/tap outside closes the list.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
    }
  }, [open])

  // Keep the highlighted option visible inside the scrollable list.
  useEffect(() => {
    if (open) document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' })
  }, [open, active]) // eslint-disable-line react-hooks/exhaustive-deps

  function openList() {
    setActive(SUPPORTED_LANGUAGES.indexOf(value))
    setOpen(true)
  }

  function choose(i: number) {
    onChange(SUPPORTED_LANGUAGES[i])
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const last = SUPPORTED_LANGUAGES.length - 1
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openList()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActive(a => Math.min(a + 1, last)); break
      case 'ArrowUp':   e.preventDefault(); setActive(a => Math.max(a - 1, 0)); break
      case 'Home':      e.preventDefault(); setActive(0); break
      case 'End':       e.preventDefault(); setActive(last); break
      case 'Enter':
      case ' ':         e.preventDefault(); choose(active); break
      case 'Escape':    e.preventDefault(); setOpen(false); break
      case 'Tab':       choose(active); break // pick, then let focus move on
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const q = e.key.toLowerCase()
          const n = SUPPORTED_LANGUAGES.length
          for (let step = 1; step <= n; step++) {
            const i = (active + step) % n
            const l = SUPPORTED_LANGUAGES[i]
            if (l.startsWith(q) || LANGUAGE_NAMES[l].toLowerCase().startsWith(q)) {
              setActive(i)
              break
            }
          }
        }
    }
  }

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex items-center justify-between gap-2 text-left ${className}`}
        style={{ fontFamily: 'Roboto, sans-serif' }}
      >
        <span title={LANGUAGE_NAMES[value]} className="uppercase">{value}</span>
        <span aria-hidden="true" className="text-[0.6rem] opacity-70">▾</span>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-1 z-30 min-w-[13rem] max-h-72 overflow-auto rounded-lg border-2 border-brand-purple/40 bg-brand-charcoal py-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)]`}
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          {SUPPORTED_LANGUAGES.map((l, i) => (
            <li
              key={l}
              id={optionId(i)}
              role="option"
              aria-selected={l === value}
              // mousedown (not click) + preventDefault keeps focus on the trigger
              onMouseDown={e => { e.preventDefault(); choose(i) }}
              onMouseEnter={() => setActive(i)}
              className={`flex items-center gap-3 px-3 py-2 text-sm cursor-pointer ${
                i === active ? 'bg-brand-lilac/15' : ''
              } ${l === value ? 'text-brand-lilac' : 'text-brand-cream'}`}
            >
              <span className="w-7 font-bold uppercase">{l}</span>
              <span lang={l}>{LANGUAGE_NAMES[l]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
