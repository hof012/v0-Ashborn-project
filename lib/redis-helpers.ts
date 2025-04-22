import { kv } from "@vercel/kv"

export const cacheAssetInRedis = async (id: string, blobUrl: string) => {
  try {
    await kv.set(`asset:${id}`, blobUrl)
  } catch (error: any) {
    console.error(`[Redis] Error caching asset ${id}:`, error)
    throw new Error(`Failed to cache asset ${id} in Redis: ${error.message}`)
  }
}
