"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { PointerLockControls, Environment } from "@react-three/drei"
import { useState, useEffect, useRef, useMemo, useCallback, type MutableRefObject, type Dispatch, type SetStateAction } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Vector3, AudioListener } from "three"
import { Map as MapIcon, X } from "lucide-react"
import { FPSHud } from "@/components/fps-hud"
import { DriveableCar } from "@/components/driveable-car"
import { DriftTrack } from "@/components/drift-track"
import { Neighborhood } from "@/components/neighborhood"
import { BasementInterior } from "@/components/basement-interior"

const statusUpdates = [
  "Still here. Mom brought pizza rolls.",
  "Day 847: The WiFi is strong with this one.",
  "Living the dream (mom's dream that I move out).",
  "Update: Just beat my high score in being unemployed.",
  "Mom asked if I'm 'winning' again. I said yes.",
  "The basement is my kingdom. The laundry room is my throne.",
  "Rent: $0. Dignity: Also $0.",
  "Breaking News: Still in basement. More at 11.",
  "Mom's basement > Your penthouse (it's warmer here).",
  "Status: Professional basement dweller.",
  "Achievement Unlocked: 1000 hours in mom's basement.",
  "The outside world is overrated anyway.",
  "Mom says I need vitamin D. I said I have RGB lighting.",
  "Living my best life (according to no one).",
  "Update: Mom's doing laundry. I'm in the way again.",
  "The mini-fridge is my only friend. It's cold but reliable.",
  "Pizza box count: Lost track after 47.",
  "Mom's calling from upstairs. Pretending I can't hear.",
  "Sunlight is just aggressive moonlight anyway.",
  "My gaming chair has a permanent butt groove. It's art.",
  "The spiders and I have an understanding now.",
  "Showered this week. Feeling fancy.",
  "Mom threatened to charge rent. I laughed. She didn't.",
  "The basement ceiling is my Sistine Chapel.",
  "Update: Found a Cheeto from 2019. Still good.",
  "My sleep schedule is a work of abstract art.",
  "Went upstairs today. Regretted it immediately.",
  "The WiFi router is my life support system.",
  "Mom says I need a job. I said I'm a 'content creator'.",
  "Living off pizza and broken dreams.",
]

const basementRegions = [
  {
    id: "command-deck",
    name: "Command Deck",
    summary: "Mission desk + tracker wall",
    detail:
      "Primary ops station with dual displays, Basement Tracker feed, and uplink console. Used for logging runs and dispatching tasks.",
    positionClass: "left-[6%] top-[10%] w-[38%] h-[30%]",
  },
  {
    id: "workshop",
    name: "Workshop Corridor",
    summary: "3D printer + fabrication",
    detail:
      "Fabrication lane for props, camera rigs, and LED assemblies. Houses the 3D printer, soldering station, and modular shelving.",
    positionClass: "left-[50%] top-[14%] w-[40%] h-[24%]",
  },
  {
    id: "server-rack",
    name: "Server Rack",
    summary: "NAS + VR gear",
    detail:
      "Network spine with NAS arrays, off-site backup gateway, and VR kit for testing spatial UI flows inside the simulation.",
    positionClass: "left-[60%] top-[44%] w-[28%] h-[26%]",
  },
  {
    id: "music-bay",
    name: "Music Bay",
    summary: "Synths and loopers",
    detail:
      "Sound design corner piping ambience into the level. Doubles as podcast nook for narrative logs and mission briefings.",
    positionClass: "left-[12%] top-[48%] w-[30%] h-[26%]",
  },
  {
    id: "storage",
    name: "Storage Lift",
    summary: "Cargo lift + stairs",
    detail:
      "Access point to street level and staging zone for gear heading to shoots. Serves as the ingress/egress checkpoint.",
    positionClass: "left-[44%] top-[72%] w-[22%] h-[18%]",
  },
]

type KeysRef = MutableRefObject<Record<string, boolean>>

type CarTransform = {
  position: Vector3
  rotationY: number
}

interface FirstPersonPlayerProps {
  isInCar: boolean
  paused: boolean
  carTransformRef: MutableRefObject<CarTransform>
  keysPressed: KeysRef
  onPositionChange: (position: Vector3) => void
}

function FirstPersonPlayer({ isInCar, paused, carTransformRef, keysPressed, onPositionChange }: FirstPersonPlayerProps) {
  const { camera } = useThree()
  const velocityRef = useRef(new Vector3())
  // positionRef is the player's "feet" position; the camera is offset upward.
  const positionRef = useRef(new Vector3(0, -3.4, 0))
  const isGroundedRef = useRef(true)
  const wasInCarRef = useRef(false)
  const directionVector = useMemo(() => new Vector3(), [])
  const rightVector = useMemo(() => new Vector3(), [])
  const seatOffset = useMemo(() => new Vector3(-0.35, 1.0, 0.6), [])
  const exitOffset = useMemo(() => new Vector3(-0.8, 0, -1.2), [])
  const tempVector = useMemo(() => new Vector3(), [])

  const boundaryX = 60
  const boundaryZ = 60
  const baseSpeed = 6.5
  const sprintMultiplier = 1.6
  const moveAcceleration = 16
  const moveDeceleration = 10
  const airDeceleration = 5
  const jumpForce = 9
  const gravity = -24
  const horizontalEpsilon = 0.02
  const basementFloor = -4
  const groundLevel = 0
  const basementMaxY = -1
  const playerHeight = 1.6

  const stairX = 4
  const stairStartZ = 5.5
  const stairEndZ = 1
  const stairWidth = 2.5
  const stairHeight = 4
  const numSteps = 12

  const adjustAxis = useCallback((current: number, target: number, rate: number, delta: number) => {
    const frameBlend = 1 - Math.exp(-Math.max(rate, 0) * delta)
    return current + (target - current) * frameBlend
  }, [])

  useEffect(() => {
    if (!isInCar && wasInCarRef.current) {
      const carTransform = carTransformRef.current
      const sin = Math.sin(carTransform.rotationY)
      const cos = Math.cos(carTransform.rotationY)
      const exitX = carTransform.position.x + exitOffset.x * cos + exitOffset.z * sin
      const exitZ = carTransform.position.z + exitOffset.z * cos - exitOffset.x * sin
      positionRef.current.set(exitX, groundLevel, exitZ)
      camera.position.set(exitX, groundLevel + playerHeight, exitZ)
      onPositionChange(positionRef.current)
      velocityRef.current.set(0, 0, 0)
    }
    wasInCarRef.current = isInCar
  }, [camera, carTransformRef, exitOffset, groundLevel, isInCar, onPositionChange, playerHeight])

  useFrame((_, delta) => {
    if (paused) {
      velocityRef.current.set(0, 0, 0)
      return
    }

    const carTransform = carTransformRef.current

    if (isInCar) {
      const sin = Math.sin(carTransform.rotationY)
      const cos = Math.cos(carTransform.rotationY)
      tempVector.set(
        carTransform.position.x + seatOffset.x * cos + seatOffset.z * sin,
        carTransform.position.y + seatOffset.y,
        carTransform.position.z + seatOffset.z * cos - seatOffset.x * sin
      )
      camera.position.copy(tempVector)
      positionRef.current.copy(tempVector)
      onPositionChange(tempVector)
      velocityRef.current.set(0, 0, 0)
      isGroundedRef.current = true
      return
    }

    camera.getWorldDirection(directionVector)
    directionVector.y = 0
    directionVector.normalize()
    rightVector.crossVectors(directionVector, camera.up).normalize()

    const moveForward = (keysPressed.current["w"] ? 1 : 0) - (keysPressed.current["s"] ? 1 : 0)
    const moveRight = (keysPressed.current["d"] ? 1 : 0) - (keysPressed.current["a"] ? 1 : 0)
    const hasInput = moveForward !== 0 || moveRight !== 0
    const speedMultiplier = keysPressed.current["shift"] ? sprintMultiplier : 1
    const targetSpeed = baseSpeed * speedMultiplier

    const desiredVelocityX = (directionVector.x * moveForward + rightVector.x * moveRight) * targetSpeed
    const desiredVelocityZ = (directionVector.z * moveForward + rightVector.z * moveRight) * targetSpeed

    const horizontalRate = hasInput ? moveAcceleration : (isGroundedRef.current ? moveDeceleration : airDeceleration)
    velocityRef.current.x = adjustAxis(velocityRef.current.x, desiredVelocityX, horizontalRate, delta)
    velocityRef.current.z = adjustAxis(velocityRef.current.z, desiredVelocityZ, horizontalRate, delta)

    if (Math.abs(velocityRef.current.x) < horizontalEpsilon) velocityRef.current.x = 0
    if (Math.abs(velocityRef.current.z) < horizontalEpsilon) velocityRef.current.z = 0

    if (keysPressed.current[" "] && isGroundedRef.current) {
      velocityRef.current.y = jumpForce
      isGroundedRef.current = false
    }

    velocityRef.current.y += gravity * delta

    const nextX = positionRef.current.x + velocityRef.current.x * delta
    const nextY = positionRef.current.y + velocityRef.current.y * delta
    const nextZ = positionRef.current.z + velocityRef.current.z * delta

    positionRef.current.x = Math.max(-boundaryX, Math.min(boundaryX, nextX))
    positionRef.current.z = Math.max(-boundaryZ, Math.min(boundaryZ, nextZ))

    const onStairs =
      positionRef.current.x > stairX - stairWidth / 2 &&
      positionRef.current.x < stairX + stairWidth / 2 &&
      positionRef.current.z < stairStartZ &&
      positionRef.current.z > stairEndZ

    if (onStairs) {
      const totalDepth = stairStartZ - stairEndZ
      const progress = (stairStartZ - positionRef.current.z) / totalDepth
      const clampedProgress = Math.max(0, Math.min(1, progress))
      const stepHeight = stairHeight / numSteps
      const targetHeight = basementFloor + clampedProgress * stairHeight + stepHeight * 0.5
      if (Math.abs(nextY - targetHeight) < 1.2) {
        positionRef.current.y = targetHeight
        velocityRef.current.y = 0
        isGroundedRef.current = true
      }
    } else if (nextY <= basementMaxY && positionRef.current.y < basementMaxY) {
      positionRef.current.y = basementFloor
      velocityRef.current.y = 0
      isGroundedRef.current = true
    } else if (nextY <= groundLevel) {
      positionRef.current.y = groundLevel
      velocityRef.current.y = 0
      isGroundedRef.current = true
    } else {
      positionRef.current.y = nextY
    }

    camera.position.set(positionRef.current.x, positionRef.current.y + playerHeight, positionRef.current.z)
    onPositionChange(positionRef.current)
  })

  return null
}

interface OutdoorSceneProps {
  playerPositionRef: MutableRefObject<Vector3>
  carTransformRef: MutableRefObject<CarTransform>
  npcWorldPosition: Vector3
  paused: boolean
  isInCar: boolean
  setIsInCar: Dispatch<SetStateAction<boolean>>
  onNPCInteract: () => void
}

function OutdoorScene({ playerPositionRef, carTransformRef, npcWorldPosition, paused, isInCar, setIsInCar, onNPCInteract }: OutdoorSceneProps) {
  const keysPressed = useRef<Record<string, boolean>>({})
  const { camera } = useThree()
  const audioStateRef = useRef<{
    listener: AudioListener
    gain: GainNode
    oscillators: OscillatorNode[]
    filter: BiquadFilterNode
    started: boolean
  } | null>(null)

  useEffect(() => {
    const listener = new AudioListener()
    camera.add(listener)

    const context = listener.context
    const gain = context.createGain()
    gain.gain.value = 0

    const filter = context.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = 1100
    filter.Q.value = 0.7

    filter.connect(gain)
    gain.connect(context.destination)

    const osc1 = context.createOscillator()
    osc1.type = "sawtooth"
    osc1.frequency.value = 55
    const osc2 = context.createOscillator()
    osc2.type = "triangle"
    osc2.frequency.value = 110

    const oscGain1 = context.createGain()
    oscGain1.gain.value = 0.04
    const oscGain2 = context.createGain()
    oscGain2.gain.value = 0.03

    osc1.connect(oscGain1)
    osc2.connect(oscGain2)
    oscGain1.connect(filter)
    oscGain2.connect(filter)

    audioStateRef.current = {
      listener,
      gain,
      oscillators: [osc1, osc2],
      filter,
      started: false,
    }

    const startAudio = async () => {
      const state = audioStateRef.current
      if (!state || state.started) return

      try {
        await context.resume()
      } catch {
        // ignore
      }

      const now = context.currentTime
      state.oscillators.forEach((osc) => osc.start(now))
      state.started = true

      const targetVolume = isInCar ? 0.08 : 0.05
      state.gain.gain.setTargetAtTime(targetVolume, now, 0.04)
    }

    // "Autoplay" is often blocked until a user gesture; start as soon as the browser allows.
    void startAudio()
    window.addEventListener("pointerdown", startAudio, { once: true })
    window.addEventListener("keydown", startAudio, { once: true })

    return () => {
      camera.remove(listener)

      const state = audioStateRef.current
      audioStateRef.current = null
      if (state) {
        try {
          state.oscillators.forEach((osc) => osc.stop())
        } catch {
          // ignore
        }
        try {
          state.gain.disconnect()
          state.filter.disconnect()
        } catch {
          // ignore
        }
      }

      window.removeEventListener("pointerdown", startAudio)
      window.removeEventListener("keydown", startAudio)
    }
  }, [camera, isInCar])

  useEffect(() => {
    const state = audioStateRef.current
    if (!state || !state.started) return
    const now = state.listener.context.currentTime
    const targetVolume = isInCar ? 0.08 : 0.05
    state.gain.gain.setTargetAtTime(targetVolume, now, 0.04)
  }, [isInCar])

  useEffect(() => {
    if (!paused) return
    keysPressed.current = {}
  }, [paused])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      if (paused) return

      keysPressed.current[key] = true

      if (key === "e") {
        const carPosition = carTransformRef.current.position
        const distanceToCar = camera.position.distanceTo(carPosition)
        if (distanceToCar < 5) {
          setIsInCar((prev) => !prev)
        } else {
          const distanceToNpc = camera.position.distanceTo(npcWorldPosition)
          if (distanceToNpc < 2.5) {
            onNPCInteract()
          }
        }
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.key.toLowerCase()] = false
    }

    const clearKeys = () => {
      keysPressed.current = {}
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("blur", clearKeys)
    document.addEventListener("visibilitychange", clearKeys)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("blur", clearKeys)
      document.removeEventListener("visibilitychange", clearKeys)
    }
  }, [camera, npcWorldPosition, onNPCInteract, paused])

  const handlePositionChange = useCallback(
    (position: Vector3) => {
      playerPositionRef.current.copy(position)
    },
    [playerPositionRef]
  )

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[50, 50, 50]} intensity={1} />

      <BasementInterior playerPosition={playerPositionRef.current} onNPCInteract={onNPCInteract} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#4a7c4a" roughness={0.9} />
      </mesh>

      <DriftTrack />
      <Neighborhood />

      <group>
        <DriveableCar
          position={[0, 0, 10]}
          isPlayerInside={isInCar}
          keysPressed={keysPressed}
          onTransformChange={(position, rotationY) => {
            carTransformRef.current.position.copy(position)
            carTransformRef.current.rotationY = rotationY
          }}
        />
      </group>

      <FirstPersonPlayer
        isInCar={isInCar}
        paused={paused}
        carTransformRef={carTransformRef}
        keysPressed={keysPressed}
        onPositionChange={handlePositionChange}
      />

      <Environment preset="sunset" />
      <PointerLockControls />
    </>
  )
}

export function BasementTracker() {
  const [currentStatus, setCurrentStatus] = useState(statusUpdates[0])
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [mapOpen, setMapOpen] = useState(false)
  const [focusedZone, setFocusedZone] = useState(() => basementRegions[0]?.id ?? "")
  const [health] = useState(100)
  const [ammo] = useState(30)
  const [money, setMoney] = useState(0)
  const [isInCar, setIsInCar] = useState(false)
  const npcWorldPosition = useMemo(() => new Vector3(-3, -4.4, 2), [])
  const playerPositionRef = useRef(new Vector3(0, -3.4, 0))
  const carTransformRef = useRef<CarTransform>({ position: new Vector3(0, 0, 10), rotationY: 0 })
  const [interactionHint, setInteractionHint] = useState<string | null>(null)

  const activeRegion = useMemo(
    () => basementRegions.find((region) => region.id === focusedZone) ?? basementRegions[0],
    [focusedZone]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = Math.floor(Math.random() * statusUpdates.length)
      setCurrentStatus(statusUpdates[nextIndex])
      setLastUpdate(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!focusedZone && basementRegions.length > 0) {
      setFocusedZone(basementRegions[0].id)
    }
  }, [focusedZone])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      if (key === "m") {
        event.preventDefault()
        setMapOpen((prev) => !prev)
        return
      }

      if (key === "escape" && mapOpen) {
        setMapOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mapOpen])

  useEffect(() => {
    if (!mapOpen) return
    try {
      document.exitPointerLock?.()
    } catch {
      // no-op
    }
  }, [mapOpen])

  const handleNPCInteract = useCallback(() => {
    setMoney((prev) => prev + 100)
  }, [])

  useEffect(() => {
    const updateHint = () => {
      if (mapOpen) {
        setInteractionHint("Map open · input paused")
        return
      }

      if (isInCar) {
        setInteractionHint("Press E to exit car")
        return
      }

      const playerPosition = playerPositionRef.current
      const distanceToCar = playerPosition.distanceTo(carTransformRef.current.position)
      if (distanceToCar < 5) {
        setInteractionHint("Press E to enter car")
        return
      }

      const distanceToNpc = playerPosition.distanceTo(npcWorldPosition)
      if (distanceToNpc < 2.5) {
        setInteractionHint("Press E to talk")
        return
      }

      setInteractionHint(null)
    }

    updateHint()
    const interval = window.setInterval(updateHint, 120)
    return () => window.clearInterval(interval)
  }, [isInCar, mapOpen, npcWorldPosition])

  return (
    <div className="relative w-full h-screen">
      <FPSHud health={health} ammo={ammo} maxAmmo={30} money={money} playerPositionRef={playerPositionRef} carTransformRef={carTransformRef} npcPosition={npcWorldPosition} />

      <Canvas
        camera={{ position: [0, 1.6, 5], fov: 75 }}
        className="w-full h-full"
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <OutdoorScene
          playerPositionRef={playerPositionRef}
          carTransformRef={carTransformRef}
          npcWorldPosition={npcWorldPosition}
          paused={mapOpen}
          isInCar={isInCar}
          setIsInCar={setIsInCar}
          onNPCInteract={handleNPCInteract}
        />
      </Canvas>

      <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 pointer-events-none">
        <Card className="p-2 bg-black/60 backdrop-blur-sm border-green-500/30 pointer-events-auto">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                <Badge
                  variant="outline"
                  className="bg-green-500/20 text-green-400 border-green-500 text-[8px] px-1 py-0"
                >
                  LIVE
                </Badge>
                <span className="text-[8px] text-muted-foreground">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              <h1 className="text-xs font-bold text-white mb-1">Basement & Street Ops Tracker™</h1>
              <p className="text-green-400 text-[10px] font-mono">{currentStatus}</p>
            </div>
          </div>
        </Card>

        <Card className="p-2 bg-black/60 backdrop-blur-sm border-blue-500/30 pointer-events-auto">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-sm font-bold text-blue-400">24/7</div>
              <div className="text-[8px] text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-sm font-bold text-purple-400">∞</div>
              <div className="text-[8px] text-muted-foreground">Days Here</div>
            </div>
            <div>
              <div className="text-sm font-bold text-green-400">{`$${money}`}</div>
              <div className="text-[8px] text-muted-foreground">Basement Cash</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="absolute bottom-4 left-4 pointer-events-none">
        <Card className="p-2 bg-black/60 backdrop-blur-sm border-muted/30 pointer-events-auto">
          <p className="text-[9px] text-muted-foreground">
            🎮 Click to lock mouse • WASD to move • SHIFT to sprint • SPACE to jump • E to enter/exit car • ESC to unlock • Press M for map overlay
          </p>
          {interactionHint && <p className="mt-1 text-[9px] text-slate-200 font-mono">{interactionHint}</p>}
        </Card>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none">
        <button
          type="button"
          onClick={() => setMapOpen((prev) => !prev)}
          className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.28em] transition pointer-events-auto focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:ring-offset-2 focus:ring-offset-black ${
            mapOpen
              ? "border-sky-400/70 bg-slate-900/80 text-sky-200 shadow-[0_0_24px_rgba(56,189,248,0.28)]"
              : "border-sky-500/40 bg-slate-950/70 text-slate-200 shadow-[0_0_20px_rgba(56,189,248,0.16)] hover:border-sky-400/60 hover:text-sky-100"
          }`}
        >
          <MapIcon className="h-4 w-4 text-sky-300" />
          Basement Map
          <span className="rounded-md border border-sky-500/40 bg-slate-900/70 px-2 py-0.5 text-[10px] font-mono tracking-[0.28em] text-sky-300">
            M
          </span>
        </button>
      </div>

      <AnimatePresence>
        {mapOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/85 backdrop-blur"
            onClick={() => setMapOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-sky-500/40 bg-slate-950/92 p-6 shadow-[0_0_45px_rgba(56,189,248,0.32)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.34em]">› Basement Floor Plan</p>
                  <p className="text-slate-100 text-2xl font-bold tracking-tight mt-2">Sublevel Blueprint</p>
                  <p className="text-slate-400 text-sm mt-2">
                    Hover or tap each sector to preview. Click a zone to pin its briefing. Press Escape or the close button to exit.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMapOpen(false)}
                  className="flex items-center gap-2 rounded-lg border border-sky-500/40 px-4 py-2 text-sky-200 transition hover:border-sky-400/60 hover:bg-slate-900/70"
                >
                  Close
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="relative">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-sky-500/40 bg-gradient-to-br from-slate-950 via-slate-900/80 to-slate-950/90 shadow-[0_0_35px_rgba(56,189,248,0.22)]">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.3),transparent_45%)]"></div>
                    <div className="absolute inset-6 rounded-[2rem] border border-slate-700/60 bg-slate-950/60"></div>
                    {basementRegions.map((region) => {
                      const isActive = region.id === activeRegion?.id
                      return (
                        <button
                          key={region.id}
                          type="button"
                          onClick={() => setFocusedZone(region.id)}
                          onMouseEnter={() => setFocusedZone(region.id)}
                          className={`absolute rounded-2xl border text-left transition focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                            isActive
                              ? "border-sky-300/70 bg-sky-500/20 shadow-[0_0_25px_rgba(56,189,248,0.35)]"
                              : "border-slate-700/60 bg-slate-900/60 hover:border-sky-400/60 hover:bg-slate-900/80"
                          } ${region.positionClass}`}
                        >
                          <div className="flex h-full flex-col justify-between p-3">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">{region.name}</span>
                            <span className="text-[11px] text-slate-300">{region.summary}</span>
                          </div>
                        </button>
                      )
                    })}
                    <div className="absolute bottom-4 right-6 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-slate-300">
                      Blueprint v2.0
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 shadow-[0_0_25px_rgba(56,189,248,0.18)]">
                    <p className="text-slate-200 text-sm font-semibold uppercase tracking-[0.28em]">Sectors</p>
                    <p className="text-slate-400 text-xs mt-1">Use the overlay to orient inside the simulation.</p>
                  </div>
                  <div className="space-y-3">
                    {basementRegions.map((region) => (
                      <button
                        key={`list-${region.id}`}
                        type="button"
                        onClick={() => setFocusedZone(region.id)}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                          activeRegion?.id === region.id
                            ? "border-sky-400/60 bg-slate-900/80 text-sky-100 shadow-[0_0_20px_rgba(56,189,248,0.25)]"
                            : "border-slate-700/60 bg-slate-900/60 text-slate-300 hover:border-sky-400/50 hover:text-sky-100"
                        }`}
                      >
                        <p className="text-sm font-semibold uppercase tracking-[0.2em]">{region.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{region.summary}</p>
                      </button>
                    ))}
                  </div>
                  {activeRegion && (
                    <div className="rounded-2xl border border-sky-500/40 bg-slate-950/70 p-4 shadow-[0_0_25px_rgba(56,189,248,0.22)]">
                      <p className="text-sky-200 text-sm font-semibold uppercase tracking-[0.28em]">{activeRegion.name}</p>
                      <p className="text-slate-300 text-sm mt-2 leading-relaxed">{activeRegion.detail}</p>
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-6 text-center text-xs text-slate-500">Press M or Escape to close the map overlay.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
