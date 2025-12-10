"use client"

import { Box, Plane } from "@react-three/drei"
import { Vector3 } from "three"
import { BlondeNPC } from "./blonde-npc"

interface BasementInteriorProps {
  playerPosition?: Vector3
  onNPCInteract?: () => void
}

export function BasementInterior({ playerPosition = new Vector3(), onNPCInteract }: BasementInteriorProps) {
  return (
    <group position={[0, -5, 0]}>
      <Box args={[12, 0.2, 12]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B3A3A" roughness={0.9} />
      </Box>

      <Box args={[12, 0.2, 12]} position={[0, 4, 0]}>
        <meshStandardMaterial color="#e8e8d0" />
      </Box>

      <Box args={[12, 4, 0.2]} position={[0, 2, -6]}>
        <meshStandardMaterial color="#e8d4a0" />
      </Box>
      <Box args={[12, 4, 0.2]} position={[0, 2, 6]}>
        <meshStandardMaterial color="#e8d4a0" />
      </Box>

      <Box args={[3, 2, 0.15]} position={[0, 2.5, 5.95]}>
        <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.3} />
      </Box>
      <Box args={[3.2, 0.1, 0.2]} position={[0, 3.5, 5.9]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[3.2, 0.1, 0.2]} position={[0, 1.5, 5.9]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[0.1, 2, 0.2]} position={[-1.6, 2.5, 5.9]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[0.1, 2, 0.2]} position={[1.6, 2.5, 5.9]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>

      <Plane args={[1.4, 2]} position={[-0.8, 2.5, 5.85]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.6} />
      </Plane>
      <Plane args={[1.4, 2]} position={[0.8, 2.5, 5.85]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.6} />
      </Plane>

      <Box args={[0.3, 0.3, 0.3]} position={[0, 3.2, 5.7]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 0.3
        return (
          <Box
            key={`leaf-${i}`}
            args={[0.15, 0.4, 0.05]}
            position={[Math.cos(angle) * radius, 2.9, 5.7 + Math.sin(angle) * radius]}
            rotation={[0, angle, Math.PI / 6]}
          >
            <meshStandardMaterial color="#2d5016" />
          </Box>
        )
      })}

      <Box args={[0.2, 4, 12]} position={[-6, 2, 0]}>
        <meshStandardMaterial color="#e8d4a0" />
      </Box>
      <Box args={[0.2, 4, 12]} position={[6, 2, 0]}>
        <meshStandardMaterial color="#e8d4a0" />
      </Box>

      <Plane args={[3, 2.5]} position={[-5.8, 2.5, -2]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#2a5a4a" />
      </Plane>
      <Box args={[0.05, 1.5, 0.8]} position={[-5.75, 2.5, -2.5]}>
        <meshStandardMaterial color="#d4a574" />
      </Box>
      <Box args={[0.05, 1, 1.2]} position={[-5.75, 2, -1.5]}>
        <meshStandardMaterial color="#4a7a6a" />
      </Box>

      <Box args={[2, 0.1, 1.2]} position={[-4, 0.8, -4]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[0.1, 0.8, 0.1]} position={[-4.8, 0.4, -4.5]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[0.1, 0.8, 0.1]} position={[-3.2, 0.4, -4.5]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>

      <Box args={[0.05, 0.8, 1.2]} position={[-4, 1.5, -4]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Plane args={[1.1, 0.7]} position={[-4.02, 1.5, -4]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#2a4a8a" emissive="#1a3a6a" emissiveIntensity={0.5} />
      </Plane>

      <Box args={[0.3, 0.4, 0.3]} position={[-4, 2.1, -4]}>
        <meshStandardMaterial color="#ff69b4" />
      </Box>

      <Box args={[0.8, 0.2, 0.8]} position={[-4, 0.5, -2]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[0.7, 1, 0.1]} position={[-4, 1.2, -2.3]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>

      <Box args={[0.8, 0.6, 0.7]} position={[-5, 0.3, 4]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>
      <Plane args={[0.6, 0.45]} position={[-5.36, 0.35, 4]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Plane>

      <Box args={[0.2, 2.5, 1.2]} position={[5.8, 1.25, 2]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[0.3, 0.1, 0.1]} position={[5.7, 1.2, 2.4]}>
        <meshStandardMaterial color="#888888" metalness={0.8} />
      </Box>

      {Array.from({ length: 10 }).map((_, i) => (
        <Box key={i} args={[2, 0.3, 1]} position={[4, i * 0.4, 5 - i * 0.4]}>
          <meshStandardMaterial color="#654321" />
        </Box>
      ))}

      <Box args={[2, 2.5, 0.2]} position={[4, 5.25, 1]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>

      <Box args={[0.6, 0.8, 0.4]} position={[-4, 0.4, 4]}>
        <meshStandardMaterial color="#f5f5dc" />
      </Box>
      <Box args={[0.6, 0.8, 0.4]} position={[-3.2, 0.4, 4]}>
        <meshStandardMaterial color="#f5f5dc" />
      </Box>

      <Box args={[0.5, 0.6, 0.3]} position={[-2.5, 0.3, 4]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </Box>
      {Array.from({ length: 20 }).map((_, i) => {
        const offsetX = (Math.random() - 0.5) * 0.3
        const offsetY = (Math.random() - 0.5) * 0.4
        const offsetZ = (Math.random() - 0.5) * 0.2
        const size = 0.02 + Math.random() * 0.03
        return (
          <Box
            key={`sugar-${i}`}
            args={[size, size, size]}
            position={[-2.5 + offsetX, 0.3 + offsetY, 4 + offsetZ]}
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
          >
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </Box>
        )
      })}

      {Array.from({ length: 25 }).map((_, i) => {
        const offsetX = (Math.random() - 0.5) * 1.5
        const offsetZ = (Math.random() - 0.5) * 1.5
        const size = 0.02 + Math.random() * 0.04
        const height = 0.03 + Math.random() * 0.08
        return (
          <Box
            key={`crystal1-${i}`}
            args={[size, height, size * 0.7]}
            position={[2 + offsetX, height / 2, 3 + offsetZ]}
            rotation={[Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3]}
          >
            <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.4} />
          </Box>
        )
      })}

      {Array.from({ length: 30 }).map((_, i) => {
        const offsetX = (Math.random() - 0.5) * 2
        const offsetZ = (Math.random() - 0.5) * 2
        const size = 0.015 + Math.random() * 0.035
        const height = 0.025 + Math.random() * 0.07
        return (
          <Box
            key={`crystal2-${i}`}
            args={[size, height, size * 0.6]}
            position={[0 + offsetX, height / 2, 1 + offsetZ]}
            rotation={[Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3]}
          >
            <meshStandardMaterial color="#f5f5f5" metalness={0.4} roughness={0.3} />
          </Box>
        )
      })}

      {Array.from({ length: 20 }).map((_, i) => {
        const offsetX = (Math.random() - 0.5) * 1.2
        const offsetZ = (Math.random() - 0.5) * 1.2
        const size = 0.018 + Math.random() * 0.03
        const height = 0.02 + Math.random() * 0.06
        return (
          <Box
            key={`crystal3-${i}`}
            args={[size, height, size * 0.8]}
            position={[-2 + offsetX, height / 2, 0 + offsetZ]}
            rotation={[Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3]}
          >
            <meshStandardMaterial color="#fafafa" metalness={0.2} roughness={0.5} />
          </Box>
        )
      })}

      <BlondeNPC position={[-3, 0.6, 2]} playerPosition={playerPosition} onInteract={onNPCInteract || (() => {})} />

      <pointLight position={[-3, 3.5, -3]} intensity={1.2} color="#ffffee" />
      <pointLight position={[3, 3.5, -3]} intensity={1.2} color="#ffffee" />
      <pointLight position={[-3, 3.5, 3]} intensity={1.2} color="#ffffee" />
      <pointLight position={[3, 3.5, 3]} intensity={1.2} color="#ffffee" />
      <pointLight position={[0, 3.5, 0]} intensity={1} color="#ffffee" />
      <pointLight position={[0, 2.5, 6]} intensity={0.8} color="#b0d8ff" />
    </group>
  )
}
