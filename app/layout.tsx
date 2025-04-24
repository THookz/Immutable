import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Immutable | Truth Preserved. Censorship Resisted.",
  description:
    "A decentralized archive preserving censored history, martyrs' testimonies, Bible translations, prophecy records, and lost books using decentralized technology.",
  icons: {
    icon: "/favicon.ico",
    apple: "/immutable_logo.png",
  },
  openGraph: {
    images: ["/immutable_logo.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
