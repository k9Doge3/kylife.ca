import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Map as MapIcon, Terminal as TerminalIcon } from 'lucide-react'

interface Terminal {
  id: string
  title: string
  positionClass: string
  content: React.ReactNode
}

interface MapRegion {
  id: string
  name: string
  summary: string
  detail: string
  style: React.CSSProperties
}

const GameLevel: React.FC = () => {
  const [activeTerminal, setActiveTerminal] = useState<string | null>(null)
  const [quickMenuOpen, setQuickMenuOpen] = useState(false)
  const [playerHealth] = useState(100)
  const [focusedZone, setFocusedZone] = useState('')

  const terminals = useMemo<Terminal[]>(() => [
    {
      id: 'basement-briefing',
      title: 'BASEMENT_BRIEFING',
      positionClass: 'left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2',
      content: (
        <div className="space-y-5">
          <p className="text-sky-300 font-semibold uppercase text-xs tracking-[0.34em]">› BASEMENT OPERATIONS OVERVIEW</p>
          <p className="text-slate-200 text-sm">
            The entire facility has been collapsed down to a single sector: the subterranean studio where every prototype starts.
            This is the room where navigation experiments, spatial UI, and the Basement Tracker come online.
          </p>
          <div className="rounded-2xl border border-sky-500/40 bg-slate-900/70 p-4 shadow-[0_0_25px_rgba(56,189,248,0.22)]">
            <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.34em]">Field Notes</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li>• Track chores, errands, and build tasks from the same holographic console.</li>
              <li>• Monitor the 3D reconstruction in real-time with telemetry from the mapper.</li>
              <li>• Switch into full simulation by launching the immersive run below.</li>
            </ul>
          </div>
          <p className="text-slate-400 text-xs font-mono tracking-[0.28em] uppercase">Press M to surface the physical floor plan. Esc closes terminals and the map.</p>
        </div>
      )
    },
    {
      id: 'basement-sim',
      title: 'BASEMENT_SIMULATOR',
      positionClass: 'left-[75%] top-[58%] -translate-x-1/2 -translate-y-1/2',
      content: (
        <div className="space-y-5">
          <p className="text-indigo-300 font-semibold uppercase text-xs tracking-[0.34em]">› IMMERSIVE RUNNER</p>
          <div className="rounded-2xl border border-indigo-500/40 bg-slate-950/70 p-5 shadow-[0_0_25px_rgba(99,102,241,0.24)]">
            <p className="text-slate-100 font-semibold">Basement Tracker · Spatial Build</p>
            <p className="text-slate-300 text-sm mt-2">
              Step into the Half-Life style basement to walk assignments, check maintenance logs, and interact with the mission boards in first-person.
            </p>
            <p className="text-slate-400 text-xs mt-3 font-mono tracking-[0.24em] uppercase">WASD · Mouse Look · Space Jump · Shift Sprint</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => window.open('/basement', '_blank')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-950 bg-indigo-300 rounded-lg transition hover:bg-indigo-200"
              >
                → Launch Simulation
              </button>
              <a
                href="https://github.com/k9Doge3/v0-3-d-maps-blog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-200 border border-indigo-500/40 rounded-lg transition hover:bg-indigo-950/20"
              >
                → Build Notes
              </a>
            </div>
          </div>
          <p className="text-slate-400 text-xs">
            Run the simulation in a new tab for the full 3D treatment or stay here for the command console view of the Basement Tracker.
          </p>
        </div>
      )
    }
  ], [])

  const mapRegions = useMemo<MapRegion[]>(() => [
    {
      id: 'command-deck',
      name: 'Command Deck',
      summary: 'Central ops consoles + tracker wall.',
      detail: 'Primary mission desk with dual monitors, holographic task board, and the audio uplink that feeds the ambient soundtrack.',
      style: { left: '8%', top: '8%', width: '36%', height: '32%' }
    },
    {
      id: 'workshop',
      name: 'Workshop Corridor',
      summary: '3D printer + fabrication benches.',
      detail: 'Fabrication lane for props, camera rigs, and LED panels. Contains the 3D printer and modular shelving for rapid builds.',
      style: { left: '50%', top: '12%', width: '38%', height: '22%' }
    },
    {
      id: 'server-rack',
      name: 'Server Rack & Lab',
      summary: 'Network spine + VR gear.',
      detail: 'Houses NAS arrays, the cloud gateway, and a VR rig for testing the Basement experience with spatial interfaces.',
      style: { left: '58%', top: '42%', width: '30%', height: '28%' }
    },
    {
      id: 'music-bay',
      name: 'Music Bay',
      summary: 'Synths, loopers, and mics.',
      detail: 'Sound design corner that feeds ambient scores into the level. Doubles as podcast nook for narrative logs.',
      style: { left: '12%', top: '50%', width: '32%', height: '26%' }
    },
    {
      id: 'storage',
      name: 'Storage Lift',
      summary: 'Stairwell + cargo lift.',
      detail: 'Access to street level plus the staging area for gear heading to on-location shoots.',
      style: { left: '44%', top: '72%', width: '20%', height: '18%' }
    }
  ], [])

  useEffect(() => {
    if (!focusedZone && mapRegions.length > 0) {
      setFocusedZone(mapRegions[0].id)
    }
  }, [focusedZone, mapRegions])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()

      if (key === 'm') {
        e.preventDefault()
        setQuickMenuOpen(prev => !prev)
        return
      }

      if (key === 'escape') {
        if (quickMenuOpen) {
          setQuickMenuOpen(false)
          return
        }

        if (activeTerminal) {
          setActiveTerminal(null)
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [activeTerminal, quickMenuOpen])

  const activeMapRegion = mapRegions.find(zone => zone.id === focusedZone)

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 font-sans text-zinc-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.3),rgba(9,9,11,0.96))]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(148,28,35,0.5),rgba(12,10,19,0.9))]"></div>
        <div className="cyber-grid absolute inset-0 opacity-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.3) 0%,rgba(10,10,12,0.85) 45%,rgba(0,0,0,0.95) 100%)]"></div>
      </div>
      <div className="relative z-10">
      {/* HUD Overlay */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 z-50 p-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-start md:justify-between">
          {/* Health & Status */}
          <div className="pointer-events-auto">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 shadow-[0_0_25px_rgba(192,132,252,0.12)] backdrop-blur">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-[0.32em]">System Power</p>
                  <div className="mt-3 h-2 w-36 overflow-hidden rounded-full border border-slate-700/70 bg-slate-950/70">
                    <div className="h-full w-full bg-gradient-to-r from-fuchsia-400 via-amber-300 to-emerald-400"></div>
                  </div>
                </div>
                <p className="text-fuchsia-300 text-3xl font-semibold tracking-widest">{playerHealth}</p>
              </div>
            </div>
          </div>

          {/* Location + Map */}
          <div className="flex w-full flex-col gap-3 md:max-w-md">
              <div className="pointer-events-auto rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 shadow-[0_0_25px_rgba(217,70,239,0.14)] backdrop-blur">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-[0.32em]">Location</p>
                <p className="text-slate-100 font-bold text-lg tracking-wide">Basement Operations Hub</p>
                <p className="text-slate-400 text-sm mt-1">Subterranean studio. All navigation collapses into this single control space.</p>
              </div>
              <div className="pointer-events-auto rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 shadow-[0_0_30px_rgba(245,158,11,0.16)] backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-[0.32em]">Basement Systems</p>
                  <span className="text-[11px] text-slate-400">Tracker · Simulation · Floor Plan</span>
                </div>
                <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
                  Use the holographic console to review tracker status and launch the simulation. Press M for the spatial map overlay or access it via the Facility Menu button below.
                </p>
              </div>
          </div>
        </div>
      </div>

      {/* Main Game View */}
      <div className="relative min-h-screen flex items-center justify-center p-8 pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl"
          >
            {/* Room View */}
            <div
              className="relative min-h-[600px] rounded-3xl border-2 border-sky-500/40 bg-gradient-to-br from-slate-950 via-slate-900/90 to-indigo-950/70 p-8 shadow-[0_0_40px_rgba(56,189,248,0.22)] backdrop-blur"
            >
              {/* Terminals */}
              {terminals.map((terminal) => (
                <motion.button
                  key={terminal.id}
                  onClick={() => setActiveTerminal(terminal.id)}
                  className={`absolute ${terminal.positionClass} rounded-2xl border border-sky-500/40 bg-slate-950/70 px-5 py-4 text-left shadow-[0_0_25px_rgba(56,189,248,0.18)] transition hover:border-sky-400/60 hover:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:ring-offset-2 focus:ring-offset-slate-950`}
                  whileHover={{ scale: 1.1 }}
                >
                  <TerminalIcon className="mb-2 h-7 w-7 text-sky-300" />
                  <p className="text-sky-200 text-xs uppercase tracking-[0.32em] font-medium">{terminal.title}</p>
                  <p className="text-slate-400 text-xs mt-1">[ CLICK TO ACCESS ]</p>
                </motion.button>
              ))}

              {/* Room Center Info */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-slate-700/60 bg-slate-950/70 px-6 py-5 shadow-[0_0_30px_rgba(56,189,248,0.18)]"
                >
                  <p className="text-sky-300 text-xs font-semibold tracking-[0.34em] uppercase">You Are In</p>
                  <p className="text-emerald-300 text-2xl font-bold my-2">Basement Operations Hub</p>
                  <p className="text-slate-300 text-sm">Every console, map, and tracker routes into this room. Press M to open the physical floor plan overlay.</p>
                </motion.div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="mt-6 flex justify-center gap-4">
              <div className="rounded-2xl border border-sky-500/40 bg-slate-950/70 px-5 py-4 text-center shadow-[0_0_25px_rgba(56,189,248,0.18)]">
                <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.32em] mb-2">Navigation Controls</p>
                <p className="text-slate-300 text-xs">Click terminals to interact • ESC to close panels • Press M to open the Basement map overlay</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quick Menu Toggle */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
        <button
          type="button"
          onClick={() => setQuickMenuOpen(prev => !prev)}
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:ring-offset-2 focus:ring-offset-slate-950 ${
            quickMenuOpen
              ? 'border-sky-400/70 bg-slate-900/80 text-sky-200 shadow-[0_0_25px_rgba(56,189,248,0.24)]'
              : 'border-sky-500/40 bg-slate-950/70 text-slate-200 shadow-[0_0_20px_rgba(14,165,233,0.18)] hover:border-sky-400/60 hover:text-sky-200'
          }`}
        >
          <MapIcon className="h-5 w-5 text-sky-300" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.32em]">Facility Menu</span>
            <span className="text-[11px] text-slate-400">Surface the Basement floor plan</span>
          </div>
          <span className="rounded-md border border-sky-500/40 bg-slate-900/70 px-2 py-0.5 text-xs font-mono tracking-[0.3em] text-sky-300">M</span>
        </button>
      </div>

      {/* Quick Menu Overlay */}
      <AnimatePresence>
        {quickMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur"
            onClick={() => setQuickMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-sky-500/40 bg-slate-950/90 p-6 shadow-[0_0_45px_rgba(56,189,248,0.32)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.34em]">› BASEMENT FLOOR PLAN</p>
                  <p className="text-slate-100 text-2xl font-bold tracking-tight mt-1">Spatial Overview</p>
                  <p className="text-slate-400 text-sm mt-2">Hover each zone for details. Click a sector to pin it and load the briefing on the right.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickMenuOpen(false)}
                  className="rounded-lg border border-sky-500/40 px-4 py-2 text-sky-200 transition hover:border-sky-400/60 hover:bg-slate-900/70"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="relative">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-sky-500/40 bg-gradient-to-br from-slate-950 via-slate-900/80 to-slate-950/90 shadow-[0_0_35px_rgba(56,189,248,0.22)]">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.3), transparent 45%)' }}></div>
                    <div className="absolute inset-6 rounded-[2rem] border border-slate-700/60 bg-slate-950/60"></div>
                    {mapRegions.map((region) => {
                      const isActive = region.id === focusedZone
                      return (
                        <button
                          key={region.id}
                          type="button"
                          onClick={() => setFocusedZone(region.id)}
                          className={`absolute rounded-2xl border text-left transition focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                            isActive
                              ? 'border-sky-300/70 bg-sky-500/20 shadow-[0_0_25px_rgba(56,189,248,0.35)]'
                              : 'border-slate-700/60 bg-slate-900/60 hover:border-sky-400/60 hover:bg-slate-900/80'
                          }`}
                          style={region.style}
                        >
                          <div className="flex h-full flex-col justify-between p-3">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">
                              {region.name}
                            </span>
                            <span className="text-[11px] text-slate-300">{region.summary}</span>
                          </div>
                        </button>
                      )
                    })}
                    <div className="absolute bottom-4 right-6 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-slate-300">
                      Basement Blueprint · v1.3
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 shadow-[0_0_25px_rgba(56,189,248,0.18)]">
                    <p className="text-slate-200 text-sm font-semibold uppercase tracking-[0.28em]">Zones</p>
                    <p className="text-slate-400 text-xs mt-1">Click to pin or hover on the map to preview.</p>
                  </div>
                  <div className="space-y-3">
                    {mapRegions.map((region) => (
                      <button
                        key={`region-${region.id}`}
                        type="button"
                        onClick={() => setFocusedZone(region.id)}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                          focusedZone === region.id
                            ? 'border-sky-400/60 bg-slate-900/80 text-sky-100 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                            : 'border-slate-700/60 bg-slate-900/60 text-slate-300 hover:border-sky-400/50 hover:text-sky-100'
                        }`}
                      >
                        <p className="text-sm font-semibold uppercase tracking-[0.2em]">{region.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{region.summary}</p>
                      </button>
                    ))}
                  </div>
                  {activeMapRegion && (
                    <div className="rounded-2xl border border-sky-500/40 bg-slate-950/70 p-4 shadow-[0_0_25px_rgba(56,189,248,0.22)]">
                      <p className="text-sky-200 text-sm font-semibold uppercase tracking-[0.28em]">{activeMapRegion.name}</p>
                      <p className="text-slate-300 text-sm mt-2 leading-relaxed">{activeMapRegion.detail}</p>
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-6 text-center text-xs text-slate-500">Press M or Escape to close the console.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Modal */}
      <AnimatePresence>
        {activeTerminal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-8 backdrop-blur"
            onClick={() => setActiveTerminal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-sky-500/40 bg-slate-950/90 px-8 py-6 shadow-[0_0_35px_rgba(56,189,248,0.28)] backdrop-blur"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sky-200 text-2xl font-bold tracking-tight">
                    {terminals.find(t => t.id === activeTerminal)?.title}
                  </p>
                  <p className="text-slate-400 text-sm mt-1 uppercase tracking-[0.32em]">Terminal Access Granted</p>
                </div>
                <button
                  onClick={() => setActiveTerminal(null)}
                  className="rounded-lg border border-sky-500/40 px-4 py-2 text-sky-200 transition hover:bg-slate-900/70"
                >
                  [ ESC ] CLOSE
                </button>
              </div>
              <div className="text-slate-200">
                {terminals.find(t => t.id === activeTerminal)?.content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-40 scanlines opacity-10"></div>
    </div>
    </div>
  )
}

export default GameLevel
