"use client"

interface GameOverProps {
  distance: number
  essence: number
  level: number
  onRestart: () => void
}

export default function GameOver({ distance, essence, level, onRestart }: GameOverProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-red-600 rounded-lg p-6 max-w-md w-full text-center shadow-lg font-pixel">
        <h1 className="text-red-600 text-4xl font-bold mb-6">Game Over</h1>

        <div className="space-y-4 mb-8">
          <p className="text-white text-xl">
            Distance: <span className="text-yellow-300">{Math.floor(distance)}m</span>
          </p>
          <p className="text-white text-xl">
            Essence Collected: <span className="text-yellow-300">{essence}</span>
          </p>
          <p className="text-white text-xl">
            Level Reached: <span className="text-yellow-300">{level}</span>
          </p>
        </div>

        <button
          onClick={onRestart}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 border-2 border-red-500"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
