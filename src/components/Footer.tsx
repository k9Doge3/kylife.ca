import React from 'react'
import { motion } from 'framer-motion'
import { Github, Mail, Heart, ExternalLink } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Projects',
      links: [
        { label: 'Collaborative Canvas', href: 'https://qt314.ca' },
        { label: 'Photo Gallery', href: 'https://gallery.kylife.ca' },
        { label: 'White Laptop', href: 'https://rdp.kylife.ca' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'GitHub', href: 'https://github.com/k9Doge3' },
        { label: 'Documentation', href: '#' },
        { label: 'API Reference', href: '#' },
      ]
    },
    {
      title: 'Connect',
      links: [
        { label: 'Email', href: 'mailto:ky.group.solutions@gmail.com' },
        { label: 'LinkedIn', href: '#' },
        { label: 'Twitter', href: '#' },
      ]
    }
  ]

  return (
  <footer className="bg-[#000000] text-[#ffaa00] pt-16 pb-8 relative overflow-hidden border-t-2 border-[#fca311]/50 font-mono">

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-[#fca311] neon-text mb-4 uppercase tracking-wider">
                <span className="text-[#33ff33]">&gt;</span> KYLIFE
              </h3>
              <p className="text-[#ffaa00]/80 mb-6 leading-relaxed uppercase tracking-wide text-sm">
                [ AUTHORIZED ACCESS ONLY ]<br/>
                Black Mesa Research Facility<br/>
                Sector C - Test Labs
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/k9Doge3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border-2 border-[#fca311]/50 hover:border-[#fca311] hover:bg-[#fca311]/10 transition-all"
                  title="GitHub"
                >
                  <Github className="w-5 h-5 text-[#fca311]" />
                </a>
                <a
                  href="mailto:ky.group.solutions@gmail.com"
                  className="p-3 border-2 border-[#33ff33]/50 hover:border-[#33ff33] hover:bg-[#33ff33]/10 transition-all"
                  title="Email"
                >
                  <Mail className="w-5 h-5 text-[#33ff33]" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-[#fca311] font-semibold mb-4 uppercase tracking-wider border-b border-[#fca311]/50 pb-2">
                [ {section.title} ]
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : '_self'}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-[#ffaa00]/70 hover:text-[#fca311] transition-colors flex items-center gap-2 group uppercase tracking-wide text-sm"
                    >
                      <span className="text-[#33ff33]">&gt;</span> {link.label}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-8 border-t-2 border-[#fca311]/50 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-[#ffaa00] text-sm flex items-center gap-2 uppercase tracking-wide">
            © {currentYear} KYLIFE. Made with <Heart className="w-4 h-4 text-[#fca311] animate-pulse" /> and <span className="text-[#33ff33]">λ</span>
          </p>
          <div className="flex gap-6 text-sm uppercase tracking-wider">
            <a href="#" className="text-[#ffaa00]/70 hover:text-[#fca311] transition-colors">
              Privacy
            </a>
            <a href="#" className="text-[#ffaa00]/70 hover:text-[#fca311] transition-colors">
              Terms
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
