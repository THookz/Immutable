"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background z-0" />

      <div className="container mx-auto max-w-5xl z-10 flex flex-col items-center">
        <div className="mb-6 relative w-64 h-64 md:w-80 md:h-80">
          <Image
            src="/immutable_logo_clean.png"
            alt="Immutable Logo"
            width={320}
            height={320}
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Immutable
        </h1>

        <p className="text-xl md:text-2xl mb-8 max-w-2xl">Truth Preserved. Censorship Resisted.</p>

        <p className="text-lg mb-10 max-w-2xl text-muted-foreground">
          A decentralized archive preserving censored history, martyrs' testimonies, Bible translations, prophecy
          records, and lost books using decentralized technology.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <a
              href="#library"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("library")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }}
            >
              Explore Library
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#contribute">Contribute</a>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <a href="#about" aria-label="Scroll to About section">
          <ChevronDown className="h-8 w-8 text-primary" />
        </a>
      </div>
    </section>
  )
}
