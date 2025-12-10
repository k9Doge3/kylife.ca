import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ExternalLink, Globe } from 'lucide-react'
import Card3D from './Card3D'

interface Integration {
  id: string
  title: string
  description: string
  href: string
  category: string
  emoji: string
  status: 'active' | 'maintenance' | 'coming-soon'
}

const integrations: Integration[] = [
  {
    id: 'gallery',
    title: 'Photo Gallery',
    description: 'PhotoPrism gallery instance with AI-powered organization',
    href: 'https://gallery.kylife.ca',
    category: 'media',
    emoji: '🖼️',
    status: 'active'
  },
  {
    id: 'admin-gallery',
    title: 'Admin Gallery',
    description: 'Private PhotoPrism management dashboard',
    href: 'https://admin.kylife.ca',
    category: 'admin',
    emoji: '🔐',
    status: 'active'
  },
  {
    id: 'crm',
    title: 'EspoCRM',
    description: 'Customer relationship management system',
    href: 'https://crm.wildrosepainters.ca',
    category: 'business',
    emoji: '📇',
    status: 'active'
  },
  {
    id: 'github',
    title: 'GitHub Projects',
    description: 'Open source repositories and contributions',
    href: 'https://github.com/k9Doge3',
    category: 'development',
    emoji: '💻',
    status: 'active'
  },
  {
    id: 'ai-chat',
    title: 'AI Chat Interface',
    description: 'Anthropic Claude integration with Qdrant vector storage',
    href: '#',
    category: 'ai',
    emoji: '🧠',
    status: 'coming-soon'
  },
  {
    id: 'spotify-integration',
    title: 'Spotify Connect',
    description: 'Music integration and playlist management',
    href: '#',
    category: 'social',
    emoji: '🎵',
    status: 'coming-soon'
  },
  {
    id: 'tiktok-integration',
    title: 'TikTok Analytics',
    description: 'Content analytics and social media insights',
    href: '#',
    category: 'social',
    emoji: '📹',
    status: 'coming-soon'
  }
]

const IntegrationsGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(integrations.map(i => i.category)))]

  const filteredIntegrations = useMemo(() => {
    return integrations.filter(integration => {
      const matchesSearch = integration.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           integration.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#9fffa9]/20 text-[#9fffa9] border border-[#9fffa9]/40'
      case 'maintenance': return 'bg-[#f5d67d]/20 text-[#f5d67d] border border-[#f5d67d]/40'
      case 'coming-soon': return 'bg-[#6f6bff]/20 text-[#6f6bff] border border-[#6f6bff]/40'
      default: return 'bg-[#3d3d3d]/20 text-[#969696] border border-[#3d3d3d]/40'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'ONLINE'
      case 'maintenance': return 'MAINTENANCE'
      case 'coming-soon': return 'CLASSIFIED'
      default: return 'UNKNOWN'
    }
  }

  return (
    <section className="py-20 px-6 bg-[#0d0f11] relative overflow-hidden">
      <div className="absolute inset-0 opacity-15 uplink-grid" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,187,92,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#101419]/60 via-[#0d0f11]/95 to-[#090909]" />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8 font-mono"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#fca311] w-5 h-5" />
            <input
              type="text"
              placeholder="SEARCH SYSTEMS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#fca311]/35 bg-[#161a1e]/90 text-[#f8e19d] placeholder-[#fca311]/40 focus:border-[#fca311] focus:outline-none transition-all uppercase tracking-wide"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 font-medium transition-all uppercase tracking-wider border ${
                  selectedCategory === category
                    ? 'bg-[#fca311]/22 text-[#fbd168] border-[#fca311] shadow-[0_6px_20px_rgba(252,163,17,0.25)]'
                    : 'bg-[#121417]/80 text-[#f4e0a8] border-[#fca311]/30 hover:border-[#fca311]/60'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Integrations Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredIntegrations.map((integration, index) => (
            <Card3D key={integration.id} intensity={10}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-6 bg-[#15181c]/90 border border-[#fca311]/30 hover:border-[#fca311]/80 transition-all h-full font-mono shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl drop-shadow-[0_0_12px_rgba(252,163,17,0.4)]">{integration.emoji}</div>
                  <span className={`px-2 py-1 text-xs font-medium uppercase tracking-wider ${getStatusColor(integration.status)}`}>
                    {getStatusText(integration.status)}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-[#fca311] group-hover:text-[#f5d67d] transition-colors uppercase tracking-wide">
                  {integration.title}
                </h3>
                <p className="text-[#d5d9de]/80 text-sm mb-4 line-clamp-2">
                  {integration.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#9fffa9] uppercase tracking-wider">
                    [ {integration.category} ]
                  </span>
                  {integration.status === 'active' ? (
                    <a
                      href={integration.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Visit ${integration.title}`}
                      className="p-2 border border-[#fca311]/40 hover:border-[#fca311] hover:bg-[#fca311]/12 text-[#fbd168] transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <div className="p-2 border border-[#444444]/50 text-[#444444]">
                      <Globe className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div className="absolute top-0 right-0 w-2 h-2 bg-[#9fffa9] animate-pulse"></div>
              </motion.div>
            </Card3D>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default IntegrationsGrid