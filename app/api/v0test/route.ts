import { NextResponse } from "next/server"

// This is another Next.js App Router API route
export async function GET() {
  return NextResponse.json({ status: "v0test" })
}
