import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type MenuItem = {
  id: string
  label: string
  href?: string
  description: string
  detail: string
  status: string
}

type MenuMode = 'main' | 'newGame' | 'systems' | 'comms' | 'botnet'

const BASE_MENU_ITEMS: MenuItem[] = [
  {
  id: 'new-game',
  label: 'GAMES',
    description: 'Enter the interactive facility map and begin infiltration of every room, console, and exit.',
    detail: 'Mission: Chart all six sectors without tripping alarms.',
    status: 'Difficulty: LEVEL SEVEN'
  },
  {
    id: 'connected-systems',
    label: 'CONNECTED SYSTEMS',
    description: 'Audit every networked subsystem, authentication pipeline, and cross-link powering KyLife.',
    detail: 'Objective: Validate uplinks · Clearance: Level 3 // Ops Lead Required.',
    status: 'Channel Integrity: STABLE'
  },
  {
    id: 'communication-channels',
    label: 'COMMUNICATION CHANNELS',
    description: 'Open secure frequencies, direct transmissions, and broadcast relays for the ops team.',
    detail: 'Routing Matrix: Multi-spectrum uplink // Response Window: Active',
    status: 'Signal Status: OPERATIONAL'
  },
  {
    id: 'view-readme',
    label: 'VIEW README.TXT',
    href: 'https://github.com/k9Doge3',
    description: 'Inspect documentation, changelogs, and build notes recovered from the archives.',
    detail: 'External Mirror: GitHub Operations Log',
    status: 'OpSec: PUBLIC'
  },
  {
    id: 'login',
    label: 'LOGIN',
    href: '#',
    description: 'Authenticate (im stealing your pass).',
    detail: 'Credential Gate: Multi-factor // Session Window: 5 Minutes',
    status: 'Access Protocol: STANDBY'
  },
  {
    id: 'botnet',
    label: 'BOTNET',
    description: 'Issue coordinated commands to every remote node inside the operations lattice.',
    detail: 'Operation: Synchronize distributed agents · Clearance: Level 4 // Network Ops Required.',
    status: 'Grid Status: ACTIVE'
  }
]

interface SubMenuOption {
  id: string
  label: string
  description: string
  href: string
  status: string
  category?: string
  external?: boolean
}

interface SubMenuConfig {
  key: string
  title: string
  instructions: string
  parentId: string
  options: SubMenuOption[]
  subtitle?: string
  categories?: string[]
}

const NEW_GAME_OPTIONS: SubMenuOption[] = [
  {
    id: 'basement-descent',
    label: 'BASEMENT DESCENT',
    description: 'Dive directly into the Basement simulation to inspect subterranean anomalies.',
    href: '/basement',
    status: 'Simulation: Active'
  },
  {
    id: 'half-life-1',
    label: 'HALF-LIFE 1',
    description: 'Launch the original Black Mesa incident with multiplayer access.',
    href: 'https://dos.zone/hldm/',
    status: 'Simulation: Online',
    external: true
  },
  {
    id: 'quake-iii-arena',
    label: 'QUAKE III ARENA',
    description: 'Enter the arena and test reflexes in a high-speed frag simulation.',
    href: 'https://dos.zone/q3/',
    status: 'Simulation: Online',
    external: true
  },
  {
    id: 'comanche-2',
    label: 'COMANCHE 2',
    description: 'Pilot advanced rotorcraft through classified combat exercises.',
    href: 'https://dos.zone/comanche2/',
    status: 'Simulation: Online',
    external: true
  },
  {
    id: 'age-of-empires-ii',
    label: 'AGE OF EMPIRES II',
    description: 'Command your civilization through a full-scale strategy simulation.',
    href: 'https://dos.zone/age-of-empires2/',
    status: 'Simulation: Online',
    external: true
  },
  {
    id: 'need-for-speed',
    label: 'NEED FOR SPEED',
    description: 'Deploy to high-speed pursuit scenarios across global circuits.',
    href: 'https://dos.zone/the-need-for-speed-sep-1995/',
    status: 'Simulation: Online',
    external: true
  },
  {
    id: 'doom-2',
    label: 'DOOM 2',
    description: 'Clear hostile sectors and secure the exit point.',
    href: 'https://dos.zone/doom-ii-oct-10-1994/',
    status: 'Simulation: Online',
    external: true
  },
  {
    id: 'red-baron',
    label: 'RED BARON',
    description: 'Engage in aerial dogfights across historic war zones.',
    href: 'https://dos.zone/red-baron-eng/',
    status: 'Simulation: Online',
    external: true
  },
  {
    id: 'gta-2',
    label: 'GTA 2',
    description: 'Navigate urban operations with full tactical freedom.',
    href: 'https://dos.zone/grand-theft-auto2/',
    status: 'Simulation: Online',
    external: true
  },
  {
    id: 'pinball-space-cadet',
    label: 'PINBALL: SPACE CADET',
    description: 'Enter orbital pinball trials for morale and reflex calibration.',
    href: 'https://dos.zone/microsoft-3d-pinball-space-cadet/',
    status: 'Simulation: Online',
    external: true
  },
  {
    id: 'unreal-tournament-99',
    label: 'UNREAL TOURNAMENT 99',
    description: 'Compete in a live-fire arena tournament.',
    href: 'https://dos.zone/ut99/',
    status: 'Simulation: Online',
    external: true
  }
]

const BOTNET_OPTIONS: SubMenuOption[] = [
  {
    id: 'qt314-node',
    label: 'QT314 NODE',
    description: 'Qt314.ca live feed — kawaii-zone front-end relay.',
    href: 'https://qt314.ca',
    status: 'ONLINE',
    category: 'entertainment',
    external: true
  },
  {
    id: 'half-life-grid',
    label: 'HALF-LIFE GRID',
    description: 'Main kylife.ca deployment controls and console uplink.',
    href: '#home',
    status: 'SECURE',
    category: 'core'
  },
  {
    id: 'cloudflare-tunnel',
    label: 'CLOUDFLARE TUNNEL',
    description: 'Inspect tunnel routes and active ingress rules.',
    href: 'https://dash.cloudflare.com',
    status: 'MAINTENANCE',
    category: 'ops',
    external: true
  },
  {
    id: 'espocrm-node',
    label: 'CRM NODE',
    description: 'EspoCRM operations node for wildrosepainters.ca.',
    href: 'https://crm.wildrosepainters.ca',
    status: 'ONLINE',
    category: 'business',
    external: true
  }
]

const CONNECTED_SYSTEMS_OPTIONS: SubMenuOption[] = [
  {
    id: 'photos',
    label: 'Photo Gallery',
    description: 'PhotoPrism gallery instance with AI-powered organization.',
    href: 'https://gallery.kylife.ca',
    status: 'ONLINE',
    category: 'media',
    external: true
  },
  {
    id: 'private',
    label: 'Admin Gallery',
    description: 'Private PhotoPrism management dashboard.',
    href: 'https://admin.kylife.ca',
    status: 'ONLINE',
    category: 'admin',
    external: true
  },
  {
    id: 'espo-crm',
    label: 'EspoCRM',
    description: 'Customer relationship management system.',
    href: 'https://crm.wildrosepainters.ca',
    status: 'ONLINE',
    category: 'business',
    external: true
  },
  {
    id: 'github-projects',
    label: 'GitHub Projects',
    description: 'Open source repositories and contributions.',
    href: 'https://github.com/k9Doge3',
    status: 'ONLINE',
    category: 'development',
    external: true
  },
  {
    id: 'ai-chat-interface',
    label: 'AI Chat Interface',
    description: 'Anthropic Claude integration with Qdrant vector storage.',
    href: '#',
    status: 'CLASSIFIED',
    category: 'ai'
  },
  {
    id: 'spotify-connect',
    label: 'Spotify Connect',
    description: 'Music integration and playlist management.',
    href: '#',
    status: 'CLASSIFIED',
    category: 'social'
  },
  {
    id: 'My TikTok',
    label: 'TikTok',
    description: '',
    href: '#',
    status: 'CLASSIFIED',
    category: 'social'
  }
]

const COMMUNICATION_CHANNELS_OPTIONS: SubMenuOption[] = [
  {
    id: 'github',
    label: 'GitHub Uplink',
    description: 'Open source projects and contributions.',
    href: 'https://github.com/k9Doge3',
    status: 'ONLINE',
    category: 'code',
    external: true
  },
  {
    id: 'email',
    label: 'email',
    description: 'Encrypted direct transmission channel.',
    href: 'mailto:ky.group.solutions@gmail.com',
    status: 'ENCRYPTED',
    category: 'direct'
  },
  {
    id: 'spotify-briefing',
    label: 'Spotify Briefing',
    description: 'Music preferences and morale playlists.',
    href: '#',
    status: 'CLASSIFIED',
    category: 'audio'
  },
  {
    id: 'tiktok',
    label: 'Tiktok',
    description: 'just my goofy tiktok',
    href: '#',
    status: 'CLASSIFIED',
    category: 'video'
  }
]

const formatCategory = (category: string) => category.replace(/-/g, ' ')

const getStatusTone = (status: string) => {
  const normalized = status.toLowerCase()

  if (normalized.includes('online')) {
    return 'text-[#9fffa9]'
  }

  if (normalized.includes('classified')) {
    return 'text-[#6f6bff]'
  }

  if (normalized.includes('maintenance')) {
    return 'text-[#f5d67d]'
  }

  return 'text-[#f5d67d]'
}

const getSubmenuConfig = (mode: MenuMode): SubMenuConfig | null => {
  switch (mode) {
    case 'newGame':
      return {
        key: 'new-game-menu',
  title: 'Select Game',
        instructions: '[ use ↑ / ↓ or W / S to navigate // enter to deploy // esc to abort ]',
        parentId: 'new-game',
        options: NEW_GAME_OPTIONS
      }
    case 'botnet':
      return {
        key: 'botnet-menu',
        title: 'BOTNET CONTROL MATRIX',
        instructions: '[ use ↑ / ↓ or W / S to cycle nodes // enter to engage // esc to abort ]',
        parentId: 'botnet',
        options: BOTNET_OPTIONS,
        categories: ['All', 'Core', 'Ops', 'Business', 'Entertainment']
      }
    case 'systems':
      return {
        key: 'connected-systems-menu',
        title: 'SEARCH SYSTEMS...',
        instructions: '[ use ↑ / ↓ or W / S to navigate // enter to open // esc to abort ]',
        parentId: 'connected-systems',
        options: CONNECTED_SYSTEMS_OPTIONS,
        categories: ['All', 'Media', 'Admin', 'Business', 'Platform', 'Development', 'Ai', 'Social']
      }
    case 'comms':
      return {
        key: 'communication-channels-menu',
        title: 'COMMUNICATION CHANNELS',
        instructions: '[ use ↑ / ↓ or W / S to tune // enter to connect // esc to abort ]',
        parentId: 'communication-channels',
        options: COMMUNICATION_CHANNELS_OPTIONS
      }
    default:
      return null
  }
}


const Hero: React.FC = () => {
  // Clerk authentication disabled - mock values
  const isLoaded = true
  const isSignedIn = false
  const openSignIn = useCallback(() => {
    console.log('Sign in disabled - add Clerk key to .env to enable authentication')
  }, [])
  const signOut = useCallback(() => {
    console.log('Sign out disabled - add Clerk key to enable')
  }, [])

  const [activeItemId, setActiveItemId] = useState<string>(BASE_MENU_ITEMS[0].id)
  const [menuMode, setMenuMode] = useState<MenuMode>('main')
  const [submenuSelectionIndex, setSubmenuSelectionIndex] = useState<number>(0)
  const menuItems = useMemo<MenuItem[]>(() => {
    return BASE_MENU_ITEMS.map(item => {
      if (item.id !== 'login') {
        return item
      }

      if (!isSignedIn) {
        return item
      }

      return {
        ...item,
        label: 'LOG OUT',
        description: 'Terminate secure session and revoke temporary access.',
        detail: 'Credential Gate: Multi-factor // Session Status: ACTIVE',
        status: 'Access Protocol: ENGAGED'
      }
    })
  }, [isSignedIn])
  const activeItem = menuItems.find(item => item.id === activeItemId) ?? menuItems[0]

  const navigate = useNavigate()

  const handleSubMenuSelect = useCallback((option: SubMenuOption, parentId: string) => {
    if (!isLoaded) {
      return
    }

    setMenuMode('main')
    setActiveItemId(parentId)

    if (option.external || option.href.startsWith('http')) {
      window.open(option.href, '_blank', 'noopener')
      return
    }

    if (option.href === '#') {
      return
    }

    if (option.href.startsWith('#')) {
      const targetId = option.href.slice(1)
      if (targetId) {
        const target = document.getElementById(targetId)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
      window.location.hash = option.href
      return
    }

    if (option.href.startsWith('/')) {
      navigate(option.href)
      return
    }

    window.location.href = option.href
  }, [isLoaded, navigate, setActiveItemId, setMenuMode])

  const submenuConfig = useMemo(() => {
    if (menuMode === 'main') {
      return null
    }

    return getSubmenuConfig(menuMode)
  }, [menuMode])
  const submenuOptions = submenuConfig?.options ?? []
  const selectedSubmenuOption = submenuConfig
    ? submenuOptions[submenuSelectionIndex] ?? submenuOptions[0]
    : undefined
  const parentMenuItem = submenuConfig
    ? menuItems.find(item => item.id === submenuConfig.parentId)
    : undefined

  useEffect(() => {
    if (!submenuConfig) {
      return
    }

    setSubmenuSelectionIndex(0)
    setActiveItemId(submenuConfig.parentId)
  }, [submenuConfig])

  useEffect(() => {
    if (!submenuConfig) return

    const options = submenuConfig.options
    if (options.length === 0) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      if (key === 'arrowdown' || key === 's') {
        event.preventDefault()
        setSubmenuSelectionIndex(prev => (prev + 1) % options.length)
        return
      }

      if (key === 'arrowup' || key === 'w') {
        event.preventDefault()
        setSubmenuSelectionIndex(prev => (prev - 1 + options.length) % options.length)
        return
      }

      if (key === 'enter') {
        event.preventDefault()
        const option = options[submenuSelectionIndex] ?? options[0]
        if (option) {
          handleSubMenuSelect(option, submenuConfig.parentId)
        }
        return
      }

      if (key === 'escape') {
        event.preventDefault()
        setMenuMode('main')
        setActiveItemId(submenuConfig.parentId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSubMenuSelect, submenuConfig, submenuSelectionIndex])

  const activeDisplay: MenuItem = submenuConfig && selectedSubmenuOption
    ? {
        id: selectedSubmenuOption.id,
        label: `${parentMenuItem?.label ?? 'SUBMENU'} // ${selectedSubmenuOption.label}`,
        href: selectedSubmenuOption.href,
        description: selectedSubmenuOption.description,
        detail: submenuConfig.parentId === 'connected-systems'
          ? `[ ${formatCategory(selectedSubmenuOption.category ?? 'system')} ]`
          : submenuConfig.parentId === 'communication-channels'
            ? `Channel mode: ${formatCategory(selectedSubmenuOption.category ?? 'uplink')}`
          : 'Mission Directive: Confirm infiltration plan.',
        status: selectedSubmenuOption.status
      }
    : activeItem

  const menuInstructions = submenuConfig?.instructions ?? '[ press enter to confirm selection // click option to continue ]'

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-[#050505] scanlines" id="uplink-menu">
      <div className="absolute inset-0 uplink-grid opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(252,163,17,0.08),rgba(5,5,5,0.95))]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(159,255,169,0.05),rgba(5,5,5,0.9))]" />
      <div className="uplink-noise" />

      <div className="relative z-10 w-full max-w-6xl py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          <p className="text-xs uppercase tracking-[0.6em] text-[#9fffa9] font-mono">KY OPS DIVISION</p>
          <h1 className="text-6xl md:text-8xl font-black tracking-[0.65em] text-[#fca311] mt-4">INTEGRATED APPS</h1>
          <p className="text-lg tracking-[0.5em] text-[#f5d67d]/80 font-mono mt-2">Build v0.3</p>
        </motion.div>

        <div className="mt-12 flex flex-col md:flex-row md:items-start md:justify-between gap-14">
          <motion.nav
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative md:w-1/3"
          >
            <AnimatePresence mode="wait">
              {menuMode === 'main' ? (
                <motion.div
                  key="main-menu"
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {menuItems.map(item => {
                    const isActive = item.id === activeItemId
                    const isExternal = Boolean(item.href && item.href.startsWith('http'))
                    const itemHref = item.href ?? '#'

                    return (
                      <motion.a
                        key={item.id}
                        href={itemHref}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        onMouseEnter={() => setActiveItemId(item.id)}
                        onFocus={() => setActiveItemId(item.id)}
                        whileHover={{ x: 6 }}
                        onClick={(event) => {
                          setActiveItemId(item.id)
                          if (item.id === 'login') {
                            event.preventDefault()

                            if (!isLoaded) {
                              return
                            }

                            if (isSignedIn) {
                              void signOut()
                            } else {
                              openSignIn()
                            }

                            if (menuMode !== 'main') {
                              setMenuMode('main')
                            }
                            return
                          }
                          const isNewGame = item.id === 'new-game'
                          const isBotnet = item.id === 'botnet'
                          const isConnectedSystems = item.id === 'connected-systems'
                          const isCommunicationChannels = item.id === 'communication-channels'

                          if (isNewGame || isBotnet || isConnectedSystems || isCommunicationChannels) {
                            event.preventDefault()
                            if (isNewGame) {
                              setMenuMode('newGame')
                            } else if (isBotnet) {
                              setMenuMode('botnet')
                            } else if (isConnectedSystems) {
                              setMenuMode('systems')
                            } else {
                              setMenuMode('comms')
                            }
                            return
                          }

                          if (item.href?.startsWith('#')) {
                            event.preventDefault()
                            const targetId = item.href.slice(1)
                            if (targetId) {
                              const target = document.getElementById(targetId)
                              if (target) {
                                target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                              }
                            }
                            window.location.hash = item.href
                          }

                          if (menuMode !== 'main') {
                            setMenuMode('main')
                          }
                        }}
                        className={`block w-full px-4 py-2 text-lg font-semibold uppercase tracking-[0.4em] transition ${
                          isActive ? 'text-[#f5d67d]' : 'text-[#fca311]/80 hover:text-[#fca311]'
                        }`}
                      >
                        {item.label}
                      </motion.a>
                    )
                  })}
                </motion.div>
              ) : (
                submenuConfig && (
                  <motion.div
                    key={submenuConfig.key}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-3 px-4">
                      <p className="text-xs font-mono uppercase tracking-[0.4em] text-[#f5d67d]/80">{submenuConfig.title}</p>
                      {submenuConfig.subtitle && (
                        <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#9fffa9]/80">{submenuConfig.subtitle}</p>
                      )}
                      {submenuConfig.categories && (
                        <div className="pt-3 space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {submenuConfig.categories.map((category, index) => (
                              <span
                                key={category}
                                className={`px-3 py-1 text-[10px] font-mono tracking-[0.28em] border border-[#fca311]/40 ${
                                  index === 0
                                    ? 'bg-[#fca311]/20 text-[#f5d67d] shadow-[0_0_12px_rgba(252,163,17,0.25)]'
                                    : 'text-[#fca311]/80'
                                }`}
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {submenuConfig.options.map((option, index) => {
                        const isSelected = index === submenuSelectionIndex
                        const statusTone = getStatusTone(option.status)
                        return (
                          <motion.button
                            key={option.id}
                            type="button"
                            whileHover={{ x: 6 }}
                            onMouseEnter={() => setSubmenuSelectionIndex(index)}
                            onFocus={() => setSubmenuSelectionIndex(index)}
                            onClick={() => handleSubMenuSelect(option, submenuConfig.parentId)}
                            className={`block w-full px-4 py-2 text-left text-lg font-semibold uppercase tracking-[0.4em] transition focus:outline-none ${
                              isSelected
                                ? 'text-[#f5d67d]'
                                : 'text-[#fca311]/80 hover:text-[#fca311]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span>{option.label}</span>
                              </div>
                              <span className={`text-[10px] font-mono tracking-[0.28em] ${statusTone}`}>{option.status}</span>
                            </div>
                            <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-[#b9b9b9]">
                              {option.description}
                            </p>
                            {option.category && (
                              <p className="mt-1 text-[10px] tracking-[0.28em] text-[#777]">
                                {`[ ${formatCategory(option.category)} ]`}
                              </p>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ x: 6 }}
                      onClick={() => {
                        setMenuMode('main')
                        setActiveItemId(submenuConfig.parentId)
                      }}
                      className="block w-full px-4 py-2 text-left text-lg font-semibold uppercase tracking-[0.4em] text-[#fca311]/80 transition hover:text-[#fca311] focus:outline-none"
                    >
                      {'< BACK TO MAIN MENU'}
                    </motion.button>
                    <p className="px-4 text-[10px] uppercase tracking-[0.28em] text-[#777]">
                      {submenuConfig.instructions}
                    </p>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:flex-1 space-y-6"
          >
            <div className="border border-[#fca311]/40 bg-[#070707]/90 p-8 rounded-3xl shadow-[0_0_35px_rgba(252,163,17,0.18)] backdrop-blur">
              <p className="text-sm uppercase tracking-[0.4em] text-[#f5d67d]/80 font-mono">{activeDisplay.label}</p>
              <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-[#f1f1f1] leading-snug">
                {activeDisplay.description}
              </h2>
              <p className="mt-6 text-sm text-[#9fffa9] uppercase tracking-[0.3em]">{activeDisplay.detail}</p>
              <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#b9b9b9]">
                <ChevronRight className="w-4 h-4 text-[#fca311]" />
                <span>{activeDisplay.status}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-xs uppercase tracking-[0.3em] text-[#656565] font-mono"
        >
          <span>{menuInstructions}</span>
          <span>Build timestamp: {new Date().toISOString().split('T')[0]}</span>
        </motion.div>

      </div>
    </section>
  )
}

export default Hero