import type React from "react"
import "./globals.css"
import type { Metadata } from "next"

// Define metadata - a Next.js App Router feature
export const metadata: Metadata = {
  title: "Ashborn",
  description: "A side-scrolling auto-run RPG with roguelike elements",
    generator: 'v0.dev'
}

// This is a Next.js App Router layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
