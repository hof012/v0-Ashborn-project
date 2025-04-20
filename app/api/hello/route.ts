import { NextResponse } from "next/server"

// This is a Next.js App Router API route
export async function GET() {
  return NextResponse.json({ message: "Hello from Ashborn!" })
}
