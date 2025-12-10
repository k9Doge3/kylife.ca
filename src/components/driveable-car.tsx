"use client"

import { useEffect, useMemo, useRef, type MutableRefObject } from "react"
import { useFrame } from "@react-three/fiber"
import { Box } from "@react-three/drei"
import { type Group, Vector3 } from "three"

type KeysRef = MutableRefObject<Record<string, boolean>>

interface DriveableCarProps {
  position: [number, number, number]
  isPlayerInside: boolean
  keysPressed: KeysRef
  onTransformChange?: (position: Vector3, rotationY: number) => void
}

export function DriveableCar({ position, isPlayerInside, keysPressed, onTransformChange }: DriveableCarProps) {
  const carRef = useRef<Group>(null)
  const velocityRef = useRef({ x: 0, z: 0 })
  const rotationRef = useRef(0)
  const currentGearRef = useRef(1)
  const rpmRef = useRef(1000)
  const lastPosition = useMemo(() => new Vector3(), [])

  useEffect(() => {
    if (carRef.current) {
      carRef.current.position.set(...position)
      lastPosition.copy(carRef.current.position)
      onTransformChange?.(lastPosition, rotationRef.current)
    }
  }, [position, lastPosition, onTransformChange])

  useFrame((_, delta) => {
    if (!carRef.current) return

    const acceleration = 35
    const maxSpeed = 40
    const turnSpeed = 3
    const friction = 0.92
    const brakingForce = 0.85

    const forward = (keysPressed.current["w"] ? 1 : 0) - (keysPressed.current["s"] ? 1 : 0)
    const turn = (keysPressed.current["d"] ? 1 : 0) - (keysPressed.current["a"] ? 1 : 0)
    const handbrake = keysPressed.current[" "]

    if (isPlayerInside) {
      const currentSpeed = Math.hypot(velocityRef.current.x, velocityRef.current.z)
      rpmRef.current = 1000 + currentSpeed * 200
      const newGear = Math.min(5, Math.floor(currentSpeed / 8) + 1)
      if (newGear !== currentGearRef.current && currentSpeed > 0.5) {
        currentGearRef.current = newGear
      }
    }

    if (forward !== 0) {
      const speed = forward * acceleration * delta
      velocityRef.current.x += Math.sin(rotationRef.current) * speed
      velocityRef.current.z += Math.cos(rotationRef.current) * speed
    }

    const currentSpeed = Math.hypot(velocityRef.current.x, velocityRef.current.z)
    if (currentSpeed > 0.5) {
      const turnMultiplier = Math.min(1, currentSpeed / 15)
      rotationRef.current -= turn * turnSpeed * delta * turnMultiplier
    }

    const appliedFriction = handbrake ? brakingForce : friction
    velocityRef.current.x *= appliedFriction
    velocityRef.current.z *= appliedFriction

    if (Math.abs(velocityRef.current.x) < 0.01) velocityRef.current.x = 0
    if (Math.abs(velocityRef.current.z) < 0.01) velocityRef.current.z = 0

    const speed = Math.hypot(velocityRef.current.x, velocityRef.current.z)
    if (speed > maxSpeed) {
      velocityRef.current.x = (velocityRef.current.x / speed) * maxSpeed
      velocityRef.current.z = (velocityRef.current.z / speed) * maxSpeed
    }

    const nextX = carRef.current.position.x + velocityRef.current.x * delta
    const nextZ = carRef.current.position.z + velocityRef.current.z * delta

    const boundaryX = 50
    const boundaryZ = 50
    carRef.current.position.x = Math.max(-boundaryX, Math.min(boundaryX, nextX))
    carRef.current.position.z = Math.max(-boundaryZ, Math.min(boundaryZ, nextZ))
    carRef.current.rotation.y = rotationRef.current

    lastPosition.copy(carRef.current.position)
    onTransformChange?.(lastPosition, rotationRef.current)
  })

  return (
    <group ref={carRef}>
      <Box args={[2, 0.8, 4]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#0044ff" metalness={0.6} roughness={0.3} />
      </Box>
      <Box args={[1.8, 0.6, 2]} position={[0, 1, -0.3]}>
        <meshStandardMaterial color="#0044ff" metalness={0.6} roughness={0.3} />
      </Box>

      <Box args={[1.7, 0.5, 0.1]} position={[0, 1, 0.7]}>
        <meshStandardMaterial color="#88ccff" transparent opacity={0.6} metalness={0.9} roughness={0.1} />
      </Box>
      <Box args={[1.7, 0.5, 0.1]} position={[0, 1, -1.3]}>
        <meshStandardMaterial color="#88ccff" transparent opacity={0.6} metalness={0.9} roughness={0.1} />
      </Box>

      <Box args={[0.1, 0.4, 1.5]} position={[0.9, 1, -0.3]}>
        <meshStandardMaterial color="#88ccff" transparent opacity={0.6} metalness={0.8} roughness={0.2} />
      </Box>
      <Box args={[0.1, 0.4, 1.5]} position={[-0.9, 1, -0.3]}>
        <meshStandardMaterial color="#88ccff" transparent opacity={0.6} metalness={0.8} roughness={0.2} />
      </Box>

      <Box args={[1.8, 0.1, 0.4]} position={[0, 1.2, -2]}>
        <meshStandardMaterial color="#0044ff" metalness={0.8} roughness={0.3} />
      </Box>
      <Box args={[0.1, 0.3, 0.1]} position={[-0.7, 0.95, -1.9]}>
        <meshStandardMaterial color="#0044ff" metalness={0.8} roughness={0.3} />
      </Box>
      <Box args={[0.1, 0.3, 0.1]} position={[0.7, 0.95, -1.9]}>
        <meshStandardMaterial color="#0044ff" metalness={0.8} roughness={0.3} />
      </Box>

      <Box args={[0.3, 0.2, 0.1]} position={[-0.6, 0.4, 2]}>
        <meshStandardMaterial color="#ffff99" emissive="#ffff99" emissiveIntensity={0.5} />
      </Box>
      <Box args={[0.3, 0.2, 0.1]} position={[0.6, 0.4, 2]}>
        <meshStandardMaterial color="#ffff99" emissive="#ffff99" emissiveIntensity={0.5} />
      </Box>

      <Box args={[0.3, 0.2, 0.1]} position={[-0.7, 0.4, -2]}>
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </Box>
      <Box args={[0.3, 0.2, 0.1]} position={[0.7, 0.4, -2]}>
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </Box>

      <group position={[-0.9, -0.2, 1.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.32, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0.9, -0.2, 1.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.32, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      <group position={[-0.9, -0.2, -1.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.32, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0.9, -0.2, -1.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.32, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      <group position={[-0.35, 0.95, 0.9]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.28, 0.05, 16, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
        <Box args={[0.08, 0.25, 0.08]} position={[0, -0.15, -0.05]}>
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.2} />
        </Box>
      </group>

      <Box args={[1.2, 0.2, 0.6]} position={[0, 0.7, 0.6]}>
        <meshStandardMaterial color="#202020" roughness={0.6} />
      </Box>
      <Box args={[1.6, 0.1, 0.2]} position={[0, 1.1, 0.4]}>
        <meshStandardMaterial color="#202020" roughness={0.4} />
      </Box>

      {!isPlayerInside && (
        <Box args={[1, 0.3, 0.05]} position={[0, 2, 0]}>
          <meshBasicMaterial color="#00ff00" transparent opacity={0.8} />
        </Box>
      )}
    </group>
  )
}
