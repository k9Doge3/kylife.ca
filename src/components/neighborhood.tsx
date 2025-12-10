"use client"

import { Box } from "@react-three/drei"
import { useMemo } from "react"

type HouseConfig = {
  position: [number, number, number]
  color: string
  size: { width: number; height: number; depth: number }
  hasGarage: boolean
  roofStyle: "peaked" | "flat" | "chimney"
}

function House({ position, color, size, hasGarage, roofStyle }: HouseConfig) {
  return (
    <group position={position}>
      <Box args={[size.width, size.height, size.depth]} position={[0, size.height / 2, 0]}>
        <meshStandardMaterial color={color} />
      </Box>

      {roofStyle === "peaked" && (
        <mesh position={[0, size.height + 1.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[size.width * 0.8, 3, 4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      )}
      {roofStyle === "flat" && (
        <Box args={[size.width + 0.5, 0.3, size.depth + 0.5]} position={[0, size.height + 0.15, 0]}>
          <meshStandardMaterial color="#654321" />
        </Box>
      )}
      {roofStyle === "chimney" && (
        <>
          <mesh position={[0, size.height + 1.5, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[size.width * 0.8, 3, 4]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <Box args={[0.8, 2, 0.8]} position={[size.width * 0.3, size.height + 2, 0]}>
            <meshStandardMaterial color="#8B0000" />
          </Box>
        </>
      )}

      <Box args={[1.5, 2.5, 0.2]} position={[0, 1.25, size.depth / 2 + 0.1]}>
        <meshStandardMaterial color="#654321" />
      </Box>

      <Box args={[1, 1, 0.2]} position={[-size.width * 0.3, size.height * 0.6, size.depth / 2 + 0.1]}>
        <meshStandardMaterial color="#87CEEB" />
      </Box>
      <Box args={[1, 1, 0.2]} position={[size.width * 0.3, size.height * 0.6, size.depth / 2 + 0.1]}>
        <meshStandardMaterial color="#87CEEB" />
      </Box>

      {hasGarage && (
        <group position={[size.width * 0.6, 0, 0]}>
          <Box args={[3, 2.5, 4]} position={[0, 1.25, 0]}>
            <meshStandardMaterial color={color} />
          </Box>
          <Box args={[2.5, 2, 0.2]} position={[0, 1, 2.1]}>
            <meshStandardMaterial color="#4a4a4a" />
          </Box>
        </group>
      )}
    </group>
  )
}

export function Neighborhood() {
  const trees = useMemo(() => {
    return Array.from({ length: 15 }, () => ({
      x: (Math.random() - 0.5) * 80,
      z: (Math.random() - 0.5) * 80
    }))
  }, [])

  const houses = useMemo<HouseConfig[]>(
    () => [
      { position: [-30, 0, -30], color: "#FFB6C1", size: { width: 6, height: 4, depth: 6 }, hasGarage: true, roofStyle: "peaked" },
      { position: [-30, 0, -15], color: "#98FB98", size: { width: 5, height: 3.5, depth: 7 }, hasGarage: false, roofStyle: "flat" },
      { position: [-30, 0, 0], color: "#DDA0DD", size: { width: 7, height: 4.5, depth: 6 }, hasGarage: true, roofStyle: "chimney" },
      { position: [-15, 0, -30], color: "#F0E68C", size: { width: 5.5, height: 3.8, depth: 5.5 }, hasGarage: false, roofStyle: "peaked" },
      { position: [-15, 0, 0], color: "#FFE4B5", size: { width: 6.5, height: 4.2, depth: 7 }, hasGarage: true, roofStyle: "flat" },
      { position: [30, 0, -30], color: "#B0E0E6", size: { width: 6, height: 4, depth: 6.5 }, hasGarage: false, roofStyle: "chimney" },
      { position: [30, 0, -15], color: "#FFDAB9", size: { width: 7.5, height: 4.8, depth: 6 }, hasGarage: true, roofStyle: "peaked" },
      { position: [30, 0, 0], color: "#E0BBE4", size: { width: 5, height: 3.5, depth: 6 }, hasGarage: false, roofStyle: "flat" }
    ],
    []
  )

  return (
    <group>
      {houses.map((house, i) => (
        <House key={i} {...house} />
      ))}

      <Box args={[100, 0.1, 4]} position={[0, 0, -15]}>
        <meshStandardMaterial color="#4a4a4a" />
      </Box>
      <Box args={[4, 0.1, 100]} position={[-15, 0, 0]}>
        <meshStandardMaterial color="#4a4a4a" />
      </Box>

      {Array.from({ length: 20 }).map((_, i) => (
        <Box key={`line-h-${i}`} args={[2, 0.11, 0.3]} position={[i * 5 - 50, 0.05, -15]}>
          <meshStandardMaterial color="#ffff00" />
        </Box>
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <Box key={`line-v-${i}`} args={[0.3, 0.11, 2]} position={[-15, 0.05, i * 5 - 50]}>
          <meshStandardMaterial color="#ffff00" />
        </Box>
      ))}

      {trees.map((tree, i) => (
        <group key={`tree-${i}`} position={[tree.x, 0, tree.z]}>
          <Box args={[0.5, 3, 0.5]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          <mesh position={[0, 4, 0]}>
            <coneGeometry args={[2, 3, 6]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
