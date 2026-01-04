"use client"

import { useEffect, useRef, type MutableRefObject } from "react"
import { Vector3 } from "three"

type CarTransform = {
  position: Vector3
  rotationY: number
}

interface FPSHudProps {
  health?: number
  ammo?: number
  maxAmmo?: number
  money?: number
  playerPositionRef?: MutableRefObject<Vector3>
  carTransformRef?: MutableRefObject<CarTransform>
  npcPosition?: Vector3
}

export function FPSHud({ health = 100, ammo = 30, maxAmmo = 30, money = 0, playerPositionRef, carTransformRef, npcPosition }: FPSHudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const size = 15
      const thickness = 2
      const gap = 5

      ctx.fillStyle = "rgba(0, 255, 0, 0.8)"
      ctx.fillRect(centerX - size - gap, centerY - thickness / 2, size, thickness)
      ctx.fillRect(centerX + gap, centerY - thickness / 2, size, thickness)
      ctx.fillRect(centerX - thickness / 2, centerY - size - gap, thickness, size)
      ctx.fillRect(centerX - thickness / 2, centerY + gap, thickness, size)

      ctx.fillStyle = "rgba(51, 51, 51, 0.8)"
      ctx.fillRect(20, canvas.height - 60, 200, 20)

      const healthWidth = (health / 100) * 200
      ctx.fillStyle = health > 50 ? "#00ff00" : health > 25 ? "#ffaa00" : "#ff0000"
      ctx.fillRect(20, canvas.height - 60, healthWidth, 20)

      ctx.font = "bold 14px monospace"
      ctx.fillStyle = "#ffffff"
      ctx.fillText(`HP: ${health}`, 25, canvas.height - 45)

      ctx.font = "bold 32px monospace"
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 3
      ctx.fillStyle = "#ffffff"
      const ammoText = `${ammo} / ${maxAmmo}`
      const ammoWidth = ctx.measureText(ammoText).width
      ctx.strokeText(ammoText, canvas.width - ammoWidth - 30, canvas.height - 30)
      ctx.fillText(ammoText, canvas.width - ammoWidth - 30, canvas.height - 30)

      ctx.font = "bold 24px monospace"
      ctx.fillStyle = "#2ecc71"
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 3
      const moneyText = `$${money}`
      ctx.strokeText(moneyText, 30, 50)
      ctx.fillText(moneyText, 30, 50)

      const minimapSize = 150
      const minimapX = canvas.width - minimapSize - 20
      const minimapY = 20

      ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
      ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize)
      ctx.strokeStyle = "#00ff00"
      ctx.lineWidth = 2
      ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize)

      ctx.font = "bold 10px monospace"
      ctx.fillStyle = "#00ff00"
      ctx.fillText("MINIMAP", minimapX + 5, minimapY + 15)

      const roomPadding = 20
      ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"
      ctx.lineWidth = 1
      ctx.strokeRect(
        minimapX + roomPadding,
        minimapY + roomPadding,
        minimapSize - roomPadding * 2,
        minimapSize - roomPadding * 2
      )

      const innerSize = minimapSize - roomPadding * 2
      const boundaryX = 60
      const boundaryZ = 60
      const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
      const worldToMinimap = (x: number, z: number) => {
        const nx = clamp01((x + boundaryX) / (boundaryX * 2))
        const nz = clamp01((z + boundaryZ) / (boundaryZ * 2))
        return {
          x: minimapX + roomPadding + nx * innerSize,
          y: minimapY + roomPadding + (1 - nz) * innerSize,
        }
      }

      const drawDot = (x: number, y: number, color: string, radius = 4) => {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      const playerPosition = playerPositionRef?.current
      if (playerPosition) {
        const p = worldToMinimap(playerPosition.x, playerPosition.z)
        drawDot(p.x, p.y, "#ff0000", 4)
      } else {
        drawDot(minimapX + minimapSize / 2, minimapY + minimapSize / 2, "#ff0000", 4)
      }

      const carPosition = carTransformRef?.current?.position
      if (carPosition) {
        const c = worldToMinimap(carPosition.x, carPosition.z)
        drawDot(c.x, c.y, "#60a5fa", 3)
      }

      if (npcPosition) {
        const n = worldToMinimap(npcPosition.x, npcPosition.z)
        drawDot(n.x, n.y, "#fbbf24", 3)
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [health, ammo, maxAmmo, money, playerPositionRef, carTransformRef, npcPosition])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 w-full h-full" />
}
