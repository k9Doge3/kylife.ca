import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import BasementPage from './pages/BasementPage.tsx'

// Temporarily disabled Clerk authentication for development
// To enable: Add your Clerk publishable key to .env as VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/basement" element={<BasementPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
