import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Github, Mail, Home } from 'lucide-react'

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Home', href: '#home', icon: Home }
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-mono ${
        scrolled
          ? 'bg-[#000000]/90 backdrop-blur-lg border-b-2 border-[#fca311]/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <div className="text-2xl font-bold text-[#fca311] neon-text uppercase tracking-wider">
              <span className="text-[#33ff33]">&gt;</span> KYLIFE
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 text-[#ffaa00] hover:text-[#fca311] transition-all font-medium uppercase tracking-wide border-b-2 border-transparent hover:border-[#fca311] pb-1"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </a>
              )
            })}
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l-2 border-[#fca311]/50">
              <a
                href="https://github.com/k9Doge3"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-[#fca311]/30 hover:border-[#fca311] hover:bg-[#fca311]/10 transition-all"
                title="GitHub"
              >
                <Github className="w-5 h-5 text-[#ffaa00]" />
              </a>
              <a
                href="mailto:ky.group.solutions@gmail.com"
                className="p-2 border border-[#33ff33]/30 hover:border-[#33ff33] hover:bg-[#33ff33]/10 transition-all"
                title="Email"
              >
                <Mail className="w-5 h-5 text-[#33ff33]" />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 border border-[#fca311]/50 hover:border-[#fca311] hover:bg-[#fca311]/10 transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6 text-[#fca311]" /> : <Menu className="w-6 h-6 text-[#ffaa00]" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pt-4 border-t-2 border-[#fca311]/50"
            >
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 py-3 text-[#ffaa00] hover:text-[#fca311] hover:bg-[#fca311]/10 px-3 transition-all uppercase tracking-wide border-l-2 border-transparent hover:border-[#fca311]"
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </a>
                )
              })}
              
              <div className="flex gap-3 mt-4 pt-4 border-t-2 border-[#fca311]/50">
                <a
                  href="https://github.com/k9Doge3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-[#fca311]/50 hover:border-[#fca311] hover:bg-[#fca311]/10 transition-all"
                >
                  <Github className="w-5 h-5 text-[#ffaa00]" />
                  GitHub
                </a>
                <a
                  href="mailto:ky.group.solutions@gmail.com"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-[#33ff33]/50 hover:border-[#33ff33] hover:bg-[#33ff33]/10 transition-all"
                >
                  <Mail className="w-5 h-5 text-[#33ff33]" />
                  Email
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navigation
