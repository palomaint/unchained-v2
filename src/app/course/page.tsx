'use client'

import { useRouter } from 'next/navigation'
import { LOGO_URL } from '@/lib/brand'
import { ChevronLeft, Mountain, MapPin, TrendingUp, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const climbs = [
  { name: 'Puerto de Cabanes', km: 6.3, gradient: 4.7, elevation: 296, description: 'Warm-up climb through orange groves. Steady gradient, good road surface.', summit: 320 },
  { name: 'Puerto de la Serratella', km: 15.3, gradient: 3.7, elevation: 566, description: 'Long and steady. The key is pacing — start easy, finish strong.', summit: 886 },
  { name: 'Ares del Maestrat', km: 6.8, gradient: 5.5, elevation: 374, description: 'Variable gradient with some steeper sections. Beautiful medieval village at the top.', summit: 1195 },
  { name: 'La Bandereta', km: 4.4, gradient: 6.7, elevation: 295, description: 'Short but steep. The sting in the tail — dig deep!', summit: 1030 },
  { name: 'Final Push to Finish', km: 2.1, gradient: 4.2, elevation: 88, description: 'Last effort before the descent home. You have got this!', summit: 520 },
]

const routeOptions = [
  { distance: '196km', elevation: 3200, time: '8-10 hours', description: 'Full Mediterranean Epic Gran Fondo. All 5 major climbs.' },
  { distance: '160km', elevation: 2520, time: '7-8.5 hours', description: 'Shorter route skipping the final climb section. Still epic!' },
]

const dayByDay = [
  { day: 0, date: 'Wed 23 April', title: 'Arrival Day', description: 'Arrive at Casa Pedal & Pause. Bike setup, welcome drinks, route briefing, and a delicious dinner by Chef Dave.' },
  { day: 1, date: 'Thu 24 April', title: 'Desert Discovery', distance: 65, elevation: 850, description: 'Warm-up ride through the desert landscape of Castellón. Rolling terrain, stunning views.' },
  { day: 2, date: 'Fri 25 April', title: 'Maestrat Explorer', distance: 85, elevation: 1400, description: 'Into the mountains! Practice climbs and descents before the big day.' },
  { day: 3, date: 'Sat 26 April', title: 'GRAN FONDO', distance: 196, elevation: 3200, description: 'The main event. Mediterranean Epic Gran Fondo. 5 climbs. One incredible day.' },
  { day: 4, date: 'Sun 27 April', title: 'Recovery & Departure', distance: 30, elevation: 200, description: 'Optional easy spin along the coast. Farewell brunch. Departure.' },
]

export default function CoursePage() {
  const router = useRouter()
  const [expandedClimb, setExpandedClimb] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="p-1"><ChevronLeft className="w-6 h-6 text-gray-600" /></button>
          <img src={LOGO_URL} alt="Pedal & Pause" className="h-8" />
          <span className="font-semibold text-gray-900 ml-2">The Course</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        {/* Hero */}
        <div className="bg-gradient-to-br from-brand-coral to-brand-coral-dark rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Mediterranean Epic</h1>
          <p className="text-white/80 text-sm mb-4">Gran Fondo • Castellón, Spain</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-2xl font-bold">196</p><p className="text-xs text-white/70">km</p></div>
            <div><p className="text-2xl font-bold">3,200</p><p className="text-xs text-white/70">m elevation</p></div>
            <div><p className="text-2xl font-bold">5</p><p className="text-xs text-white/70">major climbs</p></div>
          </div>
        </div>

        {/* Route Options */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-bold text-gray-900 mb-3">Route Options</h2>
          <div className="space-y-3">
            {routeOptions.map((route) => (
              <div key={route.distance} className="bg-gray-50 rounded-xl p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-900">{route.distance}</span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />{route.elevation}m
                  </div>
                </div>
                <p className="text-sm text-gray-600">{route.description}</p>
                <div className="flex items-center gap-1 text-xs text-brand-coral mt-2">
                  <Clock className="w-3 h-3" />{route.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Climbs */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Mountain className="w-5 h-5 text-brand-coral" />
            The 5 Climbs
          </h2>
          <div className="space-y-2">
            {climbs.map((climb, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setExpandedClimb(expandedClimb === i ? null : i)} className="w-full p-3 flex items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-coral rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">{i + 1}</span></div>
                    <div>
                      <p className="font-medium text-gray-900">{climb.name}</p>
                      <p className="text-xs text-gray-500">{climb.km}km @ {climb.gradient}%</p>
                    </div>
                  </div>
                  {expandedClimb === i ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {expandedClimb === i && (
                  <div className="px-3 pb-3 pt-0">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-3 gap-2 text-center mb-3">
                        <div><p className="text-lg font-bold text-gray-900">{climb.km}</p><p className="text-xs text-gray-500">km</p></div>
                        <div><p className="text-lg font-bold text-brand-coral">{climb.gradient}%</p><p className="text-xs text-gray-500">avg grade</p></div>
                        <div><p className="text-lg font-bold text-gray-900">{climb.elevation}</p><p className="text-xs text-gray-500">m gain</p></div>
                      </div>
                      <p className="text-sm text-gray-600">{climb.description}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-2"><MapPin className="w-3 h-3" />Summit: {climb.summit}m</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Day by Day */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-bold text-gray-900 mb-3">Day by Day</h2>
          <div className="space-y-3">
            {dayByDay.map((day) => (
              <div key={day.day} className={`rounded-xl p-3 ${day.day === 3 ? 'bg-brand-coral/10 border border-brand-coral/30' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-xs text-gray-500">{day.date}</p>
                    <p className={`font-semibold ${day.day === 3 ? 'text-brand-coral' : 'text-gray-900'}`}>{day.title}</p>
                  </div>
                  {day.distance && (
                    <div className="text-right text-xs text-gray-500">
                      <p>{day.distance}km</p>
                      <p>{day.elevation}m</p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{day.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <button onClick={() => router.push('/dashboard')} className="w-full py-3 bg-brand-coral text-white font-semibold rounded-xl hover:bg-brand-coral-dark transition">Back to Training</button>
      </main>
    </div>
  )
}
