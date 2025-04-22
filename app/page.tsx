"use client"

import { useState } from "react"
import PetSelection from "@/components/PetSelection"
import GamePreview from "@/components/GamePreview"
import DiagnosticsPanel from "@/components/DiagnosticsPanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [selectedPet, setSelectedPet] = useState<string | null>(null)
  const [debugMode, setDebugMode] = useState(false)

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-amber-400">Ashborn Project Preview</h1>

        <div className="mb-4 flex justify-end">
          <label className="flex items-center space-x-2 cursor-pointer">
            <span>Debug Mode</span>
            <input
              type="checkbox"
              checked={debugMode}
              onChange={() => setDebugMode(!debugMode)}
              className="form-checkbox h-5 w-5 text-amber-500"
            />
          </label>
        </div>

        <Tabs defaultValue="pet-selection" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pet-selection">Pet Selection</TabsTrigger>
            <TabsTrigger value="game-preview">Game Preview</TabsTrigger>
            <TabsTrigger value="diagnostics">Asset Diagnostics</TabsTrigger>
          </TabsList>

          <TabsContent value="pet-selection" className="border border-gray-700 rounded-lg p-6 bg-gray-800">
            <PetSelection onSelectPet={setSelectedPet} selectedPet={selectedPet} debugMode={debugMode} />
          </TabsContent>

          <TabsContent value="game-preview" className="border border-gray-700 rounded-lg p-6 bg-gray-800">
            <GamePreview selectedPet={selectedPet} debugMode={debugMode} />
          </TabsContent>

          <TabsContent value="diagnostics" className="border border-gray-700 rounded-lg p-6 bg-gray-800">
            <DiagnosticsPanel debugMode={debugMode} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
