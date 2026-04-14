# Dither WebGL Background — Deployment Guide

**Source:** [ReactBits Dither Background](https://reactbits.dev/backgrounds/dither)  
**Used in:** `/blog`, `/about` pages as animated parallax background  
**Stack:** React 19 + TypeScript + Vite

---

## What it does

Renders a full-screen animated WebGL canvas as a page background. The effect is:
1. **Wave layer** — Fractal Brownian Motion (fbm) noise field rendered as a coloured wave using a custom GLSL shader
2. **Dither post-process** — An 8×8 Bayer matrix dithering effect applied on top, giving a retro pixelated look
3. **Mouse interaction** — The wave reacts to cursor position (implemented via `window.mousemove` so it works even when the canvas is behind other DOM content)
4. **Randomised start** — Each page load begins at a random point in the noise field so the pattern is never the same twice

---

## Install

```bash
npm install three @react-three/fiber @react-three/postprocessing postprocessing
npm install --save-dev @types/three
```

---

## Files

### `src/components/Dither/Dither.css`

```css
.dither-container {
  width: 100%;
  height: 100%;
  position: relative;
}
```

### `src/components/Dither/Dither.tsx`

Full source — copy as-is:

```tsx
/* eslint-disable react/no-unknown-property */
import { useRef, useEffect, forwardRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, wrapEffect } from '@react-three/postprocessing'
import { Effect } from 'postprocessing'
import * as THREE from 'three'

import './Dither.css'

const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 4;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p + fbm(p2));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  float f = pattern(uv);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }
  vec3 col = mix(vec3(0.0), waveColor, f);
  gl_FragColor = vec4(col, 1.0);
}
`

const ditherFragmentShader = `
precision highp float;
uniform float colorNum;
uniform float pixelSize;
const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec3 dither(vec2 uv, vec3 color) {
  vec2 scaledCoord = floor(uv * resolution / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step;
  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void mainImage(in vec4 inputColor, in vec2 uv, out vec4 outputColor) {
  vec2 normalizedPixelSize = pixelSize / resolution;
  vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
  vec4 color = texture2D(inputBuffer, uvPixel);
  color.rgb = dither(uv, color.rgb);
  outputColor = color;
}
`

class RetroEffectImpl extends Effect {
  declare uniforms: Map<string, THREE.Uniform>

  constructor() {
    const uniforms = new Map<string, THREE.Uniform>([
      ['colorNum', new THREE.Uniform(4.0)],
      ['pixelSize', new THREE.Uniform(2.0)],
    ])
    super('RetroEffect', ditherFragmentShader, { uniforms })
    this.uniforms = uniforms
  }

  set colorNum(v: number) { this.uniforms.get('colorNum')!.value = v }
  get colorNum(): number { return this.uniforms.get('colorNum')!.value }
  set pixelSize(v: number) { this.uniforms.get('pixelSize')!.value = v }
  get pixelSize(): number { return this.uniforms.get('pixelSize')!.value }
}

const WrappedRetro = wrapEffect(RetroEffectImpl)

interface RetroEffectProps {
  colorNum?: number
  pixelSize?: number
}

const RetroEffect = forwardRef<RetroEffectImpl, RetroEffectProps>((props, ref) => {
  const { colorNum, pixelSize } = props
  return <WrappedRetro ref={ref} colorNum={colorNum} pixelSize={pixelSize} />
})
RetroEffect.displayName = 'RetroEffect'

interface DitheredWavesProps {
  waveSpeed: number
  waveFrequency: number
  waveAmplitude: number
  waveColor: [number, number, number]
  colorNum: number
  pixelSize: number
  disableAnimation: boolean
  enableMouseInteraction: boolean
  mouseRadius: number
}

function DitheredWaves({
  waveSpeed, waveFrequency, waveAmplitude, waveColor,
  colorNum, pixelSize, disableAnimation, enableMouseInteraction, mouseRadius,
}: DitheredWavesProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const mouseRef = useRef(new THREE.Vector2())
  const timeOffsetRef = useRef(Math.random() * 100) // random start — different pattern each load
  const { viewport, size, gl } = useThree()

  const waveUniformsRef = useRef({
    time: new THREE.Uniform(0),
    resolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
    waveSpeed: new THREE.Uniform(waveSpeed),
    waveFrequency: new THREE.Uniform(waveFrequency),
    waveAmplitude: new THREE.Uniform(waveAmplitude),
    waveColor: new THREE.Uniform(new THREE.Color(...waveColor)),
    mousePos: new THREE.Uniform(new THREE.Vector2(0, 0)),
    enableMouseInteraction: new THREE.Uniform(enableMouseInteraction ? 1 : 0),
    mouseRadius: new THREE.Uniform(mouseRadius),
  })

  useEffect(() => {
    const dpr = gl.getPixelRatio()
    const w = Math.floor(size.width * dpr)
    const h = Math.floor(size.height * dpr)
    const res = waveUniformsRef.current.resolution.value
    if (res.x !== w || res.y !== h) res.set(w, h)
  }, [size, gl])

  // window-level listener so mouse works even when canvas is behind DOM content (zIndex: -1)
  useEffect(() => {
    if (!enableMouseInteraction) return
    const handleMouseMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      const dpr = gl.getPixelRatio()
      mouseRef.current.set((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enableMouseInteraction, gl])

  const prevColor = useRef<[number, number, number]>([...waveColor])
  useFrame(({ clock }) => {
    const u = waveUniformsRef.current
    if (!disableAnimation) u.time.value = clock.getElapsedTime() + timeOffsetRef.current
    if (u.waveSpeed.value !== waveSpeed) u.waveSpeed.value = waveSpeed
    if (u.waveFrequency.value !== waveFrequency) u.waveFrequency.value = waveFrequency
    if (u.waveAmplitude.value !== waveAmplitude) u.waveAmplitude.value = waveAmplitude
    if (!prevColor.current.every((v, i) => v === waveColor[i])) {
      u.waveColor.value.set(...waveColor)
      prevColor.current = [...waveColor]
    }
    u.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0
    u.mouseRadius.value = mouseRadius
    if (enableMouseInteraction) u.mousePos.value.copy(mouseRef.current)
  })

  return (
    <>
      <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={waveVertexShader}
          fragmentShader={waveFragmentShader}
          uniforms={waveUniformsRef.current}
        />
      </mesh>
      <EffectComposer>
        <RetroEffect colorNum={colorNum} pixelSize={pixelSize} />
      </EffectComposer>
    </>
  )
}

export interface DitherProps {
  waveSpeed?: number
  waveFrequency?: number
  waveAmplitude?: number
  waveColor?: [number, number, number]
  colorNum?: number
  pixelSize?: number
  disableAnimation?: boolean
  enableMouseInteraction?: boolean
  mouseRadius?: number
}

export function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}: DitherProps) {
  return (
    <Canvas
      className="dither-container"
      camera={{ position: [0, 0, 6] }}
      dpr={1}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <DitheredWaves
        waveSpeed={waveSpeed}
        waveFrequency={waveFrequency}
        waveAmplitude={waveAmplitude}
        waveColor={waveColor}
        colorNum={colorNum}
        pixelSize={pixelSize}
        disableAnimation={disableAnimation}
        enableMouseInteraction={enableMouseInteraction}
        mouseRadius={mouseRadius}
      />
    </Canvas>
  )
}
```

---

## Props reference

| Prop | Type | Default | Effect |
|---|---|---|---|
| `waveColor` | `[r, g, b]` | `[0.5, 0.5, 0.5]` | Base wave colour (0–1 range per channel) |
| `waveSpeed` | `number` | `0.05` | How fast the wave moves. Low values (0.01) = very slow drift |
| `waveFrequency` | `number` | `3` | How densely the noise repeats. Higher = busier pattern |
| `waveAmplitude` | `number` | `0.3` | How dramatic the wave height is per octave |
| `colorNum` | `number` | `4` | Number of dither colour steps. Higher = more gradients, less pixelated |
| `pixelSize` | `number` | `2` | Size of each dither pixel block |
| `enableMouseInteraction` | `boolean` | `true` | Whether cursor displaces the wave |
| `mouseRadius` | `number` | `1` | Radius of the cursor displacement effect |
| `disableAnimation` | `boolean` | `false` | Freeze the wave at its initial frame |

**Tip:** Use the ReactBits playground to find values interactively, then paste the URL params directly as props.  
Playground URL format: `https://reactbits.dev/backgrounds/dither?waveColor=0.2,0,0.3&colorNum=9.7&...`

---

## Using as a full-page parallax background

This is how it's implemented on the `/blog` and `/about` pages in this project.

The canvas sits behind all content (`zIndex: -1`) and drifts slightly slower than the scroll, creating depth.

```tsx
import { lazy, Suspense, useEffect, useRef } from 'react'

const Dither = lazy(() =>
  import('@/components/Dither/Dither').then(m => ({ default: m.Dither }))
)

export function MyPage() {
  const ditherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ditherRef.current) {
        // 0.15 = background moves at 15% of scroll speed → parallax depth
        ditherRef.current.style.transform = `translateY(${-window.scrollY * 0.15}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      {/* Background layer */}
      <Suspense fallback={null}>
        <div
          ref={ditherRef}
          style={{
            position: 'fixed',
            inset: 0,
            top: '-10%',
            height: '120%', // oversized 10% each side to hide edges during parallax drift
            zIndex: -1,
            willChange: 'transform',
          }}
        >
          <Dither
            waveColor={[0.2, 0, 0.3]}
            enableMouseInteraction
            mouseRadius={0.1}
            colorNum={9.7}
            waveAmplitude={0.44}
            waveFrequency={2.3}
            waveSpeed={0.01}
          />
        </div>
      </Suspense>

      {/* Page content — sits on top */}
      <main>...</main>
    </div>
  )
}
```

### Why `lazy` + `Suspense`?

Three.js is ~500KB gzipped. Without lazy loading it lands in the main bundle and delays every page. With lazy loading, the Three.js chunk only downloads when the user actually visits a page that uses Dither.

### Why `window.mousemove` instead of R3F pointer events?

The original ReactBits source uses an invisible R3F mesh to capture `onPointerMove`. When the canvas is at `zIndex: -1`, DOM content above it intercepts all pointer events before they reach the canvas — so the R3F mesh never fires. Listening on `window` bypasses this entirely.

### Why `Math.random() * 100` on `timeOffsetRef`?

The fbm noise field is deterministic. Without an offset, every page load starts at `time = 0` and shows the exact same pattern. Adding a random offset makes each visit visually unique.

---

## Bundle size note

After adding Dither with lazy loading, the build produces two chunks:
- `index.js` — ~457KB (all other pages)  
- `Dither.js` — ~939KB (Three.js + R3F, loaded only on pages that use it)
