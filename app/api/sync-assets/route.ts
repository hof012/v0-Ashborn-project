import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cacheAssetInRedis } from "@/lib/redis-helpers"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all assets from Supabase
    const { data: assets, error } = await supabase.from("sprites").select("*")

    if (error) {
      console.error("[API] Supabase sync error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Re-cache each asset in Redis
    const cacheResults = await Promise.all(
      assets.map(async (asset) => {
        try {
          await cacheAssetInRedis(asset.id, asset.blobUrl)
          return { id: asset.id, success: true }
        } catch (cacheError: any) {
          console.error(`[API] Redis cache error for ${asset.id}:`, cacheError)
          return { id: asset.id, success: false, error: cacheError.message }
        }
      }),
    )

    const successCount = cacheResults.filter((r) => r.success).length
    const totalCount = assets.length

    return NextResponse.json({
      success: true,
      message: `Synced ${successCount} of ${totalCount} assets from Supabase to Redis`,
      results: cacheResults,
    })
  } catch (error: any) {
    console.error("[API] Asset sync error:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Error syncing assets: ${error.message}`,
        error: error.toString(),
      },
      { status: 500 },
    )
  }
}
