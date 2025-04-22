import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await kv.set("ashborn-test", "ok", { ex: 60 })
    const value = await kv.get("ashborn-test")
    return NextResponse.json({ success: value === "ok" })
  } catch (e: any) {
    console.error("[API] Redis verification error:", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
