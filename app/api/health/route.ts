import { NextResponse } from "next/server"

// Third API route to reinforce Next.js detection
export async function GET() {
  return NextResponse.json({ status: "healthy" })
}
