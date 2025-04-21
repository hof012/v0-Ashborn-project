"use client"

interface TraitChoiceUIProps {
  onChoose: (trait: string) => void
}

const traitList = [
  {
    id: "strength",
    label: "✊ +2 STR",
    description: "Increase strength for more HP and attack power",
    details: "+20 HP, +4 ATK",
  },
  {
    id: "dexterity",
    label: "⚡ +2 DEX",
    description: "Increase dexterity for attack speed and dodge chance",
    details: "+4% attack speed, +1% dodge",
  },
  {
    id: "intelligence",
    label: "🧠 +2 INT",
    description: "Increase intelligence for XP gain and MP",
    details: "+4% XP gain, +10 MP",
  },
  {
    id: "luck",
    label: "🍀 +2 LUK",
    description: "Increase luck for critical hits and better drops",
    details: "+1% crit, +4% loot gain",
  },
]

export default function TraitChoiceUI({ onChoose }: TraitChoiceUIProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-gray-800 text-white rounded-lg p-6 space-y-4 text-center shadow-xl max-w-md w-full border-2 border-indigo-600 font-pixel">
        <h2 className="text-2xl font-bold mb-2">Choose Your Trait</h2>
        <p className="text-gray-300 mb-4">Select one stat to enhance your character</p>
        <div className="space-y-3">
          {traitList.map((trait) => (
            <button
              key={trait.id}
              onClick={() => onChoose(trait.id)}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 flex flex-col items-center border border-indigo-500"
            >
              <span className="text-lg font-bold">{trait.label}</span>
              <span className="text-sm text-gray-300 mt-1">{trait.description}</span>
              <span className="text-xs text-yellow-200 mt-1">{trait.details}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
