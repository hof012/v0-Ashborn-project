import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const blob = await put("sprites/test-check.png", Buffer.from("TEST"), {
      access: "public",
      contentType: "image/png",
    })
    return NextResponse.json({ blob })
  } catch (e: any) {
    console.error("[API] Blob write test error:", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
