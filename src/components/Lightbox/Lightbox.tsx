import { useEffect, useRef } from 'react'

type Props = {
  images: { src: string; alt: string }[]
  index: number | null
  onClose: () => void
  onChange: (i: number) => void
}

export default function Lightbox({ images, index, onClose, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  // Element that had focus before opening — focus returns to it on close (WCAG 2.4.3)
  const openerRef = useRef<HTMLElement | null>(null)
  const open = index !== null

  const prev = () => index !== null && onChange((index - 1 + images.length) % images.length)
  const next = () => index !== null && onChange((index + 1) % images.length)

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Tab') {
        // Keep Tab cycling inside the dialog while it's open (WCAG 2.1.2 / 2.4.3)
        const container = containerRef.current
        if (!container) return
        const focusables = [...container.querySelectorAll<HTMLElement>('button')]
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement as HTMLElement | null
        const inside = active !== null && container.contains(active)
        if (e.shiftKey && (!inside || active === first)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && (!inside || active === last)) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [index])

  // Move focus into the dialog on open, back to the opener on close
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement as HTMLElement
      closeRef.current?.focus()
    } else if (openerRef.current) {
      openerRef.current.focus()
      openerRef.current = null
    }
  }, [open])

  if (index === null) return null

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image gallery, photo ${index + 1} of ${images.length}`}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose() }}
        aria-label="Close"
        className="absolute top-4 right-4 text-brand-cream hover:text-brand-lilac text-3xl leading-none w-10 h-10 flex items-center justify-center"
      >
        ×
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); prev() }}
        aria-label="Previous"
        className="absolute left-4 md:left-8 text-brand-cream hover:text-brand-lilac text-4xl w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors"
      >
        ‹
      </button>
      <img
        src={images[index].src}
        alt={images[index].alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
      />
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); next() }}
        aria-label="Next"
        className="absolute right-4 md:right-8 text-brand-cream hover:text-brand-lilac text-4xl w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors"
      >
        ›
      </button>
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-brand-cream/70"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {index + 1} / {images.length}
      </div>
    </div>
  )
}
