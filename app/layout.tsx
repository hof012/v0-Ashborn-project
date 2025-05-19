import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner" // Assuming sonner is installed and path is correct
import { GameProvider } from "@/components/game-provider" // Import GameProvider

const inter = Inter({ subsets: ["latin"] })

// Define metadata - a Next.js App Router feature
export const metadata: Metadata = {
  title: "Ashborn",
  description: "A side-scrolling auto-run RPG with roguelike elements",
  generator: 'v0.dev' // User to decide if this should be kept/changed
}

// This is a Next.js App Router layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GameProvider> {/* Wrap with GameProvider */}
            {children}
          </GameProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
