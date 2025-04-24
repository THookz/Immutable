"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/immutable_logo_clean.png"
              alt="Immutable Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-primary">Immutable</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
          <ModeToggle />
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <NavLinks mobile onClick={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLinks({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) {
  const linkClass = mobile
    ? "block py-2 text-foreground hover:text-primary transition-colors"
    : "text-foreground hover:text-primary transition-colors"

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" })
      if (onClick) onClick()
    }
  }

  return (
    <>
      <a href="#about" className={linkClass} onClick={(e) => scrollToSection(e, "about")}>
        About
      </a>
      <a href="#technologies" className={linkClass} onClick={(e) => scrollToSection(e, "technologies")}>
        Technologies
      </a>
      <a href="#library" className={linkClass} onClick={(e) => scrollToSection(e, "library")}>
        Library
      </a>
      <a href="#contribute" className={linkClass} onClick={(e) => scrollToSection(e, "contribute")}>
        Contribute
      </a>
      <a href="#contact" className={linkClass} onClick={(e) => scrollToSection(e, "contact")}>
        Contact
      </a>
    </>
  )
}
