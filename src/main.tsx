import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './i18n' // initialise i18next before the app renders
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Suspense catches the async load of the active language's translation
        file so nothing renders with raw keys before copy is ready. */}
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </StrictMode>,
)
