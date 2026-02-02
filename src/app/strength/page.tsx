'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LOGO_URL } from '@/lib/brand'
import { ChevronLeft, ChevronDown, ChevronUp, Dumbbell, Clock, Home } from 'lucide-react'

const strengthRoutines = [
  {
    id: 'A',
    name: 'Strength A',
    subtitle: 'Cycling-Specific Power',
    duration: 25,
    frequency: 'Wednesdays',
    warmup: {
      duration: '3 minutes',
      exercises: [
        'March in place - 1 min',
        'Bodyweight squats - 10 reps',
        'Glute bridges - 10 reps',
      ],
    },
    circuit: {
      rounds: 2,
      rest: '30-60 seconds between exercises',
      exercises: [
        {
          name: 'Goblet Squats',
          reps: '12 reps',
          notes: 'Use a 5L water bottle or backpack with books',
          muscles: 'Quads, glutes',
        },
        {
          name: 'Glute Bridges',
          reps: '15 reps',
          notes: 'Squeeze glutes at the top, hold for 2 seconds',
          muscles: 'Glutes, hamstrings',
        },
        {
          name: 'Step-Ups',
          reps: '10 each leg',
          notes: 'Use a sturdy chair or stairs',
          muscles: 'Quads, glutes',
        },
        {
          name: 'Plank',
          reps: '45 seconds',
          notes: 'Keep hips level, engage core',
          muscles: 'Core',
        },
        {
          name: 'Single-Leg Glute Bridge',
          reps: '10 each side',
          notes: 'Keep hips level throughout',
          muscles: 'Glutes, core stability',
        },
        {
          name: 'Clamshells',
          reps: '15 each side',
          notes: 'Use a resistance band if available',
          muscles: 'Hip abductors',
        },
      ],
    },
    cooldown: [
      'Hip flexor stretch - 45s each side',
      'Hamstring stretch - 30s each side',
      'Quad stretch - 30s each side',
    ],
  },
  {
    id: 'B',
    name: 'Strength B',
    subtitle: 'Core Focus',
    duration: 20,
    frequency: 'Sundays',
    warmup: {
      duration: '2 minutes',
      exercises: [
        'Cat-cow stretches - 10 reps',
        'Torso twists - 10 each side',
      ],
    },
    circuit: {
      rounds: 2,
      rest: '30 seconds between exercises',
      exercises: [
        {
          name: 'Plank',
          reps: '45 seconds',
          notes: 'Forearms on ground, body straight',
          muscles: 'Core',
        },
        {
          name: 'Side Plank',
          reps: '25 seconds each side',
          notes: 'Stack feet or stagger for balance',
          muscles: 'Obliques, core',
        },
        {
          name: 'Dead Bug',
          reps: '10 each side',
          notes: 'Keep lower back pressed to floor',
          muscles: 'Deep core',
        },
        {
          name: 'Bird Dog',
          reps: '10 each side',
          notes: 'Extend opposite arm and leg, hold 2 seconds',
          muscles: 'Core stability, back',
        },
        {
          name: 'Single-Leg Balance',
          reps: '30 seconds each leg',
          notes: 'Close eyes to increase difficulty',
          muscles: 'Balance, ankle stability',
        },
        {
          name: 'Bicycle Crunches',
          reps: '20 total',
          notes: 'Slow and controlled, elbow to opposite knee',
          muscles: 'Obliques, rectus abdominis',
        },
      ],
    },
    cooldown: [
      '90/90 hip stretch - 45s each side',
      'Spine twist - 30s each side',
      'Child\'s pose - 45s',
    ],
  },
]

export default function StrengthPage() {
  const router = useRouter()
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>('A')
  const [expandedSection, setExpandedSection] = useState<Record<string, string[]>>({
    A: ['circuit'],
    B: [],
  })

  const toggleSection = (routineId: string, section: string) => {
    setExpandedSection((prev) => {
      const current = prev[routineId] || []
      if (current.includes(section)) {
        return { ...prev, [routineId]: current.filter((s) => s !== section) }
      } else {
        return { ...prev, [routineId]: [...current, section] }
      }
    })
  }

  const isSectionExpanded = (routineId: string, section: string) => {
    return (expandedSection[routineId] || []).includes(section)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="p-1">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <img src={LOGO_URL} alt="Pedal & Pause" className="h-8" />
          <span className="font-semibold text-gray-900 ml-2">Strength Training</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        {/* Intro */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Home Strength Routines</h1>
              <p className="text-sm text-gray-500">No gym required</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            These cycling-specific routines build the strength you need for climbing. 
            All exercises can be done at home with household items.
          </p>
        </div>

        {/* Equipment */}
        <div className="bg-blue-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-blue-800 text-sm">Equipment Needed</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 5L water bottle or backpack with books (for weight)</li>
            <li>• Sturdy chair or stairs (for step-ups)</li>
            <li>• Resistance band (optional)</li>
            <li>• Yoga mat or carpet</li>
          </ul>
        </div>

        {/* Routines */}
        {strengthRoutines.map((routine) => (
          <div key={routine.id} className="bg-white rounded-2xl overflow-hidden">
            {/* Routine Header */}
            <button
              onClick={() => setExpandedRoutine(expandedRoutine === routine.id ? null : routine.id)}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-coral rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{routine.id}</span>
                </div>
                <div className="text-left">
                  <h2 className="font-bold text-gray-900">{routine.name}</h2>
                  <p className="text-sm text-gray-500">{routine.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{routine.duration} min</span>
                  </div>
                  <p className="text-xs text-brand-coral">{routine.frequency}</p>
                </div>
                {expandedRoutine === routine.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* Routine Details */}
            {expandedRoutine === routine.id && (
              <div className="border-t border-gray-100">
                {/* Warm-up */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => toggleSection(routine.id, 'warmup')}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50"
                  >
                    <span className="font-medium text-gray-700">Warm-up ({routine.warmup.duration})</span>
                    {isSectionExpanded(routine.id, 'warmup') ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {isSectionExpanded(routine.id, 'warmup') && (
                    <div className="px-4 py-3 space-y-2">
                      {routine.warmup.exercises.map((ex, i) => (
                        <p key={i} className="text-sm text-gray-600">• {ex}</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Circuit */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => toggleSection(routine.id, 'circuit')}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50"
                  >
                    <span className="font-medium text-gray-700">
                      Circuit ({routine.circuit.rounds} rounds)
                    </span>
                    {isSectionExpanded(routine.id, 'circuit') ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {isSectionExpanded(routine.id, 'circuit') && (
                    <div className="px-4 py-3">
                      <p className="text-xs text-brand-coral mb-3">{routine.circuit.rest}</p>
                      <div className="space-y-4">
                        {routine.circuit.exercises.map((ex, i) => (
                          <div key={i} className="bg-gray-50 rounded-xl p-3">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-gray-900">{i + 1}. {ex.name}</span>
                              <span className="text-sm font-medium text-brand-coral">{ex.reps}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">{ex.notes}</p>
                            <p className="text-xs text-gray-400">Targets: {ex.muscles}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cool-down */}
                <div>
                  <button
                    onClick={() => toggleSection(routine.id, 'cooldown')}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50"
                  >
                    <span className="font-medium text-gray-700">Cool-down</span>
                    {isSectionExpanded(routine.id, 'cooldown') ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {isSectionExpanded(routine.id, 'cooldown') && (
                    <div className="px-4 py-3 space-y-2">
                      {routine.cooldown.map((ex, i) => (
                        <p key={i} className="text-sm text-gray-600">• {ex}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Back to Dashboard */}
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full py-3 bg-brand-coral text-white font-semibold rounded-xl hover:bg-brand-coral-dark transition"
        >
          Back to Dashboard
        </button>
      </main>
    </div>
  )
}
