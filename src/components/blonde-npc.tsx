"use client"

import { Box, Sphere } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import { Vector3, type Group } from "three"

interface BlondeNPCProps {
  position: [number, number, number]
  playerPosition: Vector3
  onInteract: () => void
}

export function BlondeNPC({ position, playerPosition, onInteract }: BlondeNPCProps) {
  const groupRef = useRef<Group>(null)
  const [isNear, setIsNear] = useState(false)
  const idleRef = useRef(0)
  const wasNearRef = useRef(false)

  useFrame((_, delta) => {
    idleRef.current += delta

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(idleRef.current * 2) * 0.05
    }

    const npcPos = new Vector3(position[0], position[1], position[2])
    const distance = playerPosition.distanceTo(npcPos)
    const near = distance < 2.5
    setIsNear(near)

    if (!wasNearRef.current && near) {
      onInteract()
    }
    wasNearRef.current = near
  })

  return (
    <group ref={groupRef} position={position}>
      <Box args={[0.5, 1.2, 0.35]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#000000" />
      </Box>

      <Sphere args={[0.28, 16, 16]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#ffd4a3" />
      </Sphere>

      <Box args={[0.32, 0.25, 0.32]} position={[0, 1.65, 0]}>
        <meshStandardMaterial color="#f5f5dc" />
      </Box>
      <Box args={[0.35, 0.6, 0.2]} position={[0, 1.1, -0.15]}>
        <meshStandardMaterial color="#f5f5dc" />
      </Box>
      <Box args={[0.3, 0.4, 0.15]} position={[-0.25, 1.0, -0.1]}>
        <meshStandardMaterial color="#f5f5dc" />
      </Box>
      <Box args={[0.3, 0.4, 0.15]} position={[0.25, 1.0, -0.1]}>
        <meshStandardMaterial color="#f5f5dc" />
      </Box>

      <group position={[-0.35, 0.9, 0]}>
        <Box args={[0.12, 0.4, 0.12]} position={[0, -0.2, 0]}>
          <meshStandardMaterial color="#ffd4a3" />
        </Box>
        <Box args={[0.12, 0.35, 0.12]} position={[0, -0.55, 0]}>
          <meshStandardMaterial color="#ffd4a3" />
        </Box>
        <Box args={[0.15, 0.08, 0.25]} position={[0.15, -0.8, 0.2]} rotation={[0, 0.3, 0]}>
          <meshStandardMaterial color="#2ecc71" />
        </Box>
      </group>

      <group position={[0.35, 0.9, 0]}>
        <Box args={[0.12, 0.4, 0.12]} position={[0, -0.2, 0]}>
          <meshStandardMaterial color="#ffd4a3" />
        </Box>
        <Box args={[0.12, 0.35, 0.12]} position={[0, -0.55, 0]}>
          <meshStandardMaterial color="#ffd4a3" />
        </Box>
      </group>

      <group position={[-0.12, 0, 0]}>
        <Box args={[0.18, 0.45, 0.18]} position={[0, -0.225, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Sphere args={[0.12, 8, 8]} position={[0, -0.45, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Sphere>
        <Box args={[0.16, 0.4, 0.16]} position={[0, -0.7, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Box args={[0.2, 0.15, 0.25]} position={[0, -0.95, 0.05]}>
          <meshStandardMaterial color="#ff1493" />
        </Box>
      </group>

      <group position={[0.12, 0, 0]}>
        <Box args={[0.18, 0.45, 0.18]} position={[0, -0.225, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Sphere args={[0.12, 8, 8]} position={[0, -0.45, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Sphere>
        <Box args={[0.16, 0.4, 0.16]} position={[0, -0.7, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Box args={[0.2, 0.15, 0.25]} position={[0, -0.95, 0.05]}>
          <meshStandardMaterial color="#ff1493" />
        </Box>
      </group>

      <Box args={[0.4, 0.05, 0.05]} position={[0, 1.25, 0.2]}>
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </Box>

      {isNear && (
        <group position={[0, 2.2, 0]}>
          <Box args={[1.2, 0.3, 0.05]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#000000" transparent opacity={0.7} />
          </Box>
          <Box args={[0.15, 0.15, 0.05]} position={[-0.4, 0, 0.03]}>
            <meshStandardMaterial color="#00ff00" />
          </Box>
        </group>
      )}

      <pointLight position={[0, 1.5, 0]} intensity={0.8} color="#ffd700" distance={4} />
    </group>
  )
}
