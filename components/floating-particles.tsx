"use client"

import { useEffect, useRef } from "react"

export function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Store particles to clean up properly
    const particles: HTMLDivElement[] = []

    const createParticle = () => {
      try {
        const particle = document.createElement("div")
        particle.classList.add("flame-particle")

        // Random position at the bottom of the screen
        const posX = Math.random() * window.innerWidth
        particle.style.left = `${posX}px`
        particle.style.bottom = "0px"

        // Random size
        const size = Math.random() * 8 + 4
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`

        // Random duration
        const duration = Math.random() * 10 + 10
        particle.style.animation = `float ${duration}s linear infinite`

        // Random color (warm tones)
        const hue = Math.floor(Math.random() * 60) + 20 // 20-80 (red to yellow)
        const saturation = Math.floor(Math.random() * 30) + 70 // 70-100%
        const lightness = Math.floor(Math.random() * 20) + 50 // 50-70%
        particle.style.backgroundColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)`

        container.appendChild(particle)
        particles.push(particle)

        // Remove particle after animation completes
        setTimeout(() => {
          if (particle.parentNode === container) {
            container.removeChild(particle)
            const index = particles.indexOf(particle)
            if (index > -1) {
              particles.splice(index, 1)
            }
          }
        }, duration * 1000)
      } catch (error) {
        console.error("Error creating particle:", error)
      }
    }

    // Create particles at intervals
    let interval: NodeJS.Timeout
    try {
      interval = setInterval(createParticle, 1000)

      // Initial particles
      for (let i = 0; i < 10; i++) {
        setTimeout(createParticle, i * 300)
      }
    } catch (error) {
      console.error("Error setting up particle animation:", error)
      clearInterval(interval!)
    }

    return () => {
      clearInterval(interval)
      // Clean up all particles
      particles.forEach((particle) => {
        if (particle.parentNode === container) {
          container.removeChild(particle)
        }
      })
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />
}
