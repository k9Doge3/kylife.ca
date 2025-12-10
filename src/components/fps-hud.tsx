"use client"

import { useEffect, useRef } from "react"

interface FPSHudProps {
  health?: number
  ammo?: number
  maxAmmo?: number
  money?: number
}

export function FPSHud({ health = 100, ammo = 30, maxAmmo = 30, money = 0 }: FPSHudProps) {
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

      ctx.fillStyle = "#ff0000"
      ctx.beginPath()
      ctx.arc(minimapX + minimapSize / 2, minimapY + minimapSize / 2, 4, 0, Math.PI * 2)
      ctx.fill()

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [health, ammo, maxAmmo, money])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 w-full h-full" />
}
