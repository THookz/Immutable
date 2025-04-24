import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { TechnologiesSection } from "@/components/technologies-section"
import { LibrarySection } from "@/components/library-section"
import { ContributeSection } from "@/components/contribute-section"
import { LicensingSection } from "@/components/licensing-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { FloatingParticles } from "@/components/floating-particles"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ErrorBoundary fallback={<div className="hidden">Particles Error</div>}>
        <FloatingParticles />
      </ErrorBoundary>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ErrorBoundary fallback={<div className="py-20 text-center">Library section is currently unavailable</div>}>
        <LibrarySection />
      </ErrorBoundary>
      <TechnologiesSection />
      <ContributeSection />
      <LicensingSection />
      <ErrorBoundary fallback={<div className="py-20 text-center">Contact form is currently unavailable</div>}>
        <ContactSection />
      </ErrorBoundary>
      <Footer />
    </main>
  )
}
