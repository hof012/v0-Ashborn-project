"use client"

interface XPBarProps {
  current: number
  max: number
  level: number
  showText?: boolean
  className?: string
  height?: number
}

export default function XPBar({ current, max, level, showText = true, className = "", height = 4 }: XPBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100))

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="text-xs font-pixel text-white">LV{level}</span>

      <div
        className={`bg-gray-900 border border-gray-700 rounded-sm overflow-hidden`}
        style={{ height: `${height}px`, flex: 1 }}
      >
        <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${percentage}%` }} />
      </div>

      {showText && (
        <span className="text-xs font-pixel text-white tabular-nums">
          {current}/{max}
        </span>
      )}
    </div>
  )
}
