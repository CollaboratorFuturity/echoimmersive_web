import { useEffect } from 'react'

type Props = {
  images: string[]
  index: number | null
  onClose: () => void
  onChange: (i: number) => void
}

export default function Lightbox({ images, index, onClose, onChange }: Props) {
  const prev = () => index !== null && onChange((index - 1 + images.length) % images.length)
  const next = () => index !== null && onChange((index + 1) % images.length)

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [index])

  if (index === null) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <button
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
        src={images[index]}
        alt=""
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
