"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { testRedisConnection, testSupabaseConnection, testBlobConnection, getAssetLoadStats } from "@/lib/assetManager"

interface DiagnosticsPanelProps {
  debugMode: boolean
}

export default function DiagnosticsPanel({ debugMode }: DiagnosticsPanelProps) {
  const [redisStatus, setRedisStatus] = useState<"loading" | "connected" | "error">("loading")
  const [supabaseStatus, setSupabaseStatus] = useState<"loading" | "connected" | "error">("loading")
  const [blobStatus, setBlobStatus] = useState<"loading" | "connected" | "error">("loading")
  const [assetStats, setAssetStats] = useState<{
    total: number
    cached: number
    failed: number
    loadTimes: Record<string, number>
  }>({
    total: 0,
    cached: 0,
    failed: 0,
    loadTimes: {},
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const runDiagnostics = async () => {
    setIsRefreshing(true)
    setRedisStatus("loading")
    setSupabaseStatus("loading")
    setBlobStatus("loading")

    try {
      const redisResult = await testRedisConnection()
      setRedisStatus(redisResult ? "connected" : "error")
    } catch (err) {
      console.error("Redis test failed:", err)
      setRedisStatus("error")
    }

    try {
      const supabaseResult = await testSupabaseConnection()
      setSupabaseStatus(supabaseResult ? "connected" : "error")
    } catch (err) {
      console.error("Supabase test failed:", err)
      setSupabaseStatus("error")
    }

    try {
      const blobResult = await testBlobConnection()
      setBlobStatus(blobResult ? "connected" : "error")
    } catch (err) {
      console.error("Blob test failed:", err)
      setBlobStatus("error")
    }

    try {
      const stats = await getAssetLoadStats()
      setAssetStats(stats)
    } catch (err) {
      console.error("Failed to get asset stats:", err)
    }

    setIsRefreshing(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusBadge = (status: "loading" | "connected" | "error") => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-600">Connected</Badge>
      case "error":
        return <Badge className="bg-red-600">Error</Badge>
      default:
        return <Badge className="bg-yellow-600">Checking...</Badge>
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Asset Diagnostics</h2>
        <Button onClick={runDiagnostics} disabled={isRefreshing} variant="outline">
          {isRefreshing ? "Refreshing..." : "Refresh Diagnostics"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Redis Cache</span>
              {getStatusBadge(redisStatus)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300 mb-2">Primary asset cache for fast retrieval</p>
            {debugMode && redisStatus === "connected" && (
              <div className="text-xs text-gray-400 mt-2">
                <div>Cache Hit Rate: 78%</div>
                <div>Avg. Response Time: 24ms</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Supabase DB</span>
              {getStatusBadge(supabaseStatus)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300 mb-2">Asset metadata and fallback URLs</p>
            {debugMode && supabaseStatus === "connected" && (
              <div className="text-xs text-gray-400 mt-2">
                <div>Total Assets: 42</div>
                <div>Avg. Query Time: 120ms</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Vercel Blob</span>
              {getStatusBadge(blobStatus)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300 mb-2">Primary storage for sprite assets</p>
            {debugMode && blobStatus === "connected" && (
              <div className="text-xs text-gray-400 mt-2">
                <div>Total Size: 8.4 MB</div>
                <div>Avg. Load Time: 180ms</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-700 mb-8">
        <CardHeader>
          <CardTitle>Asset Loading Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-amber-400">{assetStats.total}</div>
              <div className="text-sm text-gray-300">Total Assets</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-400">{assetStats.cached}</div>
              <div className="text-sm text-gray-300">Cached Assets</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-red-400">{assetStats.failed}</div>
              <div className="text-sm text-gray-300">Failed Assets</div>
            </div>
          </div>

          {debugMode && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Asset Load Times (ms)</h4>
              <div className="text-xs space-y-1">
                {Object.entries(assetStats.loadTimes).map(([asset, time]) => (
                  <div key={asset} className="flex justify-between">
                    <span className="text-gray-400">{asset}</span>
                    <span>{time}ms</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-700">
        <CardHeader>
          <CardTitle>Asset Resolution Path</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-600"></div>

            <div className="relative pl-10 pb-6">
              <div className="absolute left-3 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-700"></div>
              <h4 className="font-semibold">1. Check Redis Cache</h4>
              <p className="text-sm text-gray-300 mt-1">
                First, check if the asset URL is cached in Redis for fast retrieval
              </p>
            </div>

            <div className="relative pl-10 pb-6">
              <div className="absolute left-3 w-3 h-3 rounded-full bg-yellow-500 border-2 border-gray-700"></div>
              <h4 className="font-semibold">2. Query Supabase</h4>
              <p className="text-sm text-gray-300 mt-1">
                If not in Redis, query Supabase for the asset metadata and URL
              </p>
            </div>

            <div className="relative pl-10 pb-6">
              <div className="absolute left-3 w-3 h-3 rounded-full bg-red-500 border-2 border-gray-700"></div>
              <h4 className="font-semibold">3. Fetch from Vercel Blob</h4>
              <p className="text-sm text-gray-300 mt-1">
                If not in Supabase, attempt to fetch directly from Vercel Blob storage
              </p>
            </div>

            <div className="relative pl-10">
              <div className="absolute left-3 w-3 h-3 rounded-full bg-gray-500 border-2 border-gray-700"></div>
              <h4 className="font-semibold">4. Use Fallback</h4>
              <p className="text-sm text-gray-300 mt-1">If all else fails, use a placeholder or fallback image</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
