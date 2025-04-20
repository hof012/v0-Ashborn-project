"use client"

interface LevelUpProps {
  level: number
}

export default function LevelUp({ level }: LevelUpProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
      <div className="bg-yellow-500 text-black font-bold text-4xl px-8 py-4 rounded-lg shadow-lg scale-110 duration-700 ease-out border-4 border-yellow-300 font-pixel animate-bounce">
        LEVEL UP! → {level}
      </div>
    </div>
  )
}
