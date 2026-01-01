import React from 'react'
import { motion } from 'framer-motion'
import { Github, Mail, Music, Video } from 'lucide-react'

interface SocialLink {
  id: string
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const socialLinks: SocialLink[] = [
  {
    id: 'github',
    name: 'GitHub',
    href: 'https://github.com/k9Doge3',
    icon: Github,
    description: 'Open source projects and contributions'
  },
  {
    id: 'email',
    name: 'Email',
    href: 'mailto:ky.group.solutions@gmail.com',
    icon: Mail,
    description: 'Get in touch for collaborations'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    href: '#spotify-connect',
    icon: Music,
    description: 'Music preferences and playlists'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    href: '#tiktok-analytics',
    icon: Video,
    description: 'Creative content and analytics'
  }
]

const SocialLinks: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-[#040404] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 uplink-grid" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505] to-[#020202]" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 font-mono"
        >
          <div className="inline-block border border-[#fca311]/40 px-6 py-3 mb-4 bg-[#0b0b0b]/80">
            <h2 className="text-4xl md:text-5xl font-bold text-[#fca311] uppercase tracking-[0.45em]">
              COMMUNICATION CHANNELS
            </h2>
          </div>
          <p className="text-xl text-[#b9b9b9] max-w-3xl mx-auto uppercase tracking-wide">
            <span className="text-[#9fffa9]">&gt;</span> initiate contact protocol through available frequencies
          </p>
          <p className="text-sm text-[#f5d67d] mt-2">[ response time may vary ]</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {socialLinks.map((link, index) => {
            const IconComponent = link.icon
            return (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <a
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="block p-6 bg-[#080808]/95 border border-[#fca311]/30 hover:border-[#fca311] transition-all duration-300 font-mono"
                >
                  <div className="flex flex-col items-center text-center">
                    <IconComponent className="w-12 h-12 mb-4 transition-transform group-hover:scale-110 text-[#fca311] drop-shadow-[0_0_12px_rgba(252,163,17,0.4)]" />
                    <h3 className="text-lg font-semibold mb-2 text-[#fca311] uppercase tracking-wider">{link.name}</h3>
                    <p className="text-sm text-[#b9b9b9]/80 uppercase tracking-wide">{link.description}</p>
                  </div>
                </a>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Contact Form Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-8 bg-[#0b0b0b]/90 border border-[#fca311]/40 font-mono"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2 text-[#fca311] uppercase tracking-[0.45em]">
              DIRECT TRANSMISSION
            </h3>
            <p className="text-[#b9b9b9] uppercase tracking-wide text-sm">[ Secure channel - encrypted communication ]</p>
          </div>
          
          <div className="max-w-md mx-auto space-y-4">
            <input
              type="text"
              placeholder="PERSONNEL_ID"
              className="w-full px-4 py-3 border border-[#fca311]/40 bg-[#050505] text-[#f5d67d] placeholder-[#fca311]/30 focus:border-[#fca311] focus:outline-none transition-all uppercase tracking-wide"
            />
            <input
              type="email"
              placeholder="CONTACT_FREQUENCY"
              className="w-full px-4 py-3 border border-[#fca311]/40 bg-[#050505] text-[#f5d67d] placeholder-[#fca311]/30 focus:border-[#fca311] focus:outline-none transition-all uppercase tracking-wide"
            />
            <textarea
              placeholder="MESSAGE_CONTENT"
              rows={4}
              className="w-full px-4 py-3 border border-[#fca311]/40 bg-[#050505] text-[#f5d67d] placeholder-[#fca311]/30 focus:border-[#fca311] focus:outline-none transition-all uppercase tracking-wide"
            ></textarea>
            <button className="w-full px-6 py-3 bg-[#fca311] hover:bg-[#f5d67d] text-[#050505] font-bold hover:scale-105 transition-all uppercase tracking-wider border border-[#fca311]">
              <span className="text-[#050505]">&gt;&gt;</span> TRANSMIT MESSAGE
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SocialLinks