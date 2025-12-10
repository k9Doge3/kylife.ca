import { useEffect } from 'react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'

function App() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const scrollToHash = () => {
      const { hash } = window.location
      if (!hash) return

      const targetId = hash.slice(1)
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <Navigation />

      <main>
        <section id="home">
          <Hero />
        </section>

      </main>
    </div>
  )
}

export default App
