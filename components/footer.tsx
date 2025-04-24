import Link from "next/link"
import Image from "next/image"
import { Github } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-primary/20 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/immutable_logo_clean.png"
                  alt="Immutable Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold text-primary">Immutable</span>
            </div>
            <p className="text-center md:text-left text-muted-foreground">
              &copy; {currentYear} Immutable Project. All rights reserved.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="#licensing" className="hover:text-primary transition-colors">
                Licensing
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/THookz/Immutable"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5 text-primary" />
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Content licensed under CC BY-NC-SA 4.0 • Code licensed under GPLv3</p>
          <p className="mt-2">Built with Next.js and Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
