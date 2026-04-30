import { useEffect, useRef } from 'react'
import { Dither } from '@/components/Dither/Dither'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function DitherBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = prefersReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    const handleScroll = () => {
      if (ref.current) {
        ref.current.style.transform = `translateY(${window.scrollY * 0.12}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reduceMotion])

  return (
    <div
      ref={ref}
      style={{ position: 'fixed', inset: 0, top: '-50%', height: '200%', zIndex: -1, willChange: 'transform' }}
    >
      <Dither
        waveColor={[0.55, 0.20, 0.65]}
        colorNum={10}
        pixelSize={1}
        waveSpeed={0.01}
        waveFrequency={0.1}
        waveAmplitude={0.22}
        enableMouseInteraction
        mouseRadius={0.1}
        disableAnimation={reduceMotion}
      />
    </div>
  )
}
