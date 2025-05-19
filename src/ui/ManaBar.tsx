"use client"

interface ManaBarProps {
  current: number
  max: number
  showText?: boolean
  className?: string
  height?: number
}

export default function ManaBar({ current, max, showText = true, className = "", height = 6 }: ManaBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100))

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div
        className={`bg-gray-900 border border-gray-700 rounded-sm overflow-hidden`}
        style={{ height: `${height}px`, flex: 1 }}
      >
        <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${percentage}%` }} />
      </div>

      {showText && (
        <span className="text-xs font-pixel text-white tabular-nums">
          {Math.floor(current)}/{max}
        </span>
      )}
    </div>
  )
}
