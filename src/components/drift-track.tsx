"use client"

import { Box } from "@react-three/drei"
import { useMemo } from "react"

export function DriftTrack() {
  const trackSegments = useMemo(() => {
    const segments: Array<{
      position: [number, number, number]
      args: [number, number, number]
      rotation?: [number, number, number]
      color: string
    }> = []
    const trackWidth = 8
    const trackHeight = 0.2

    segments.push({ position: [0, 0, 0], args: [trackWidth, trackHeight, 40], color: "#2a2a2a" })

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI
      const x = 20 + Math.cos(angle) * 15
      const z = 20 + Math.sin(angle) * 15
      segments.push({
        position: [x, 0, z],
        args: [trackWidth, trackHeight, 8],
        rotation: [0, angle, 0],
        color: "#2a2a2a"
      })
    }

    segments.push({ position: [0, 0, 40], args: [trackWidth, trackHeight, 40], color: "#2a2a2a" })

    return segments
  }, [])

  return (
    <group>
      {trackSegments.map((segment, i) => (
        <Box
          key={i}
          args={segment.args}
          position={segment.position}
          rotation={segment.rotation as [number, number, number] | undefined}
        >
          <meshStandardMaterial color={segment.color} roughness={0.8} />
        </Box>
      ))}

      {Array.from({ length: 20 }).map((_, i) => (
        <Box key={`marking-${i}`} args={[0.3, 0.21, 2]} position={[0, 0.1, i * 4 - 20]}>
          <meshStandardMaterial color="#ffff00" />
        </Box>
      ))}

      {Array.from({ length: 40 }).map((_, i) => (
        <Box key={`barrier-${i}`} args={[0.5, 1, 2]} position={[5, 0.5, i * 2 - 20]}>
          <meshStandardMaterial color="#ff0000" />
        </Box>
      ))}
    </group>
  )
}
