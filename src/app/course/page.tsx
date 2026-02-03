'use client'

import { useRouter } from 'next/navigation'
import { LOGO_URL } from '@/lib/brand'
import { ChevronLeft, Mountain, MapPin, TrendingUp, Clock, ChevronDown, ChevronUp, Download, Utensils, Bike, Coffee, PartyPopper, Waves, Calendar } from 'lucide-react'
import { useState } from 'react'

const gpxLinks = {
  thursdayFull: 'https://drive.google.com/file/d/14KSHVDGy_sFjrGipPHIptxA_fnn2qzAt/view?usp=sharing',
  thursdayShort: 'https://drive.google.com/file/d/1TqIxFG5-P9Ca_22Pz1w3WjLhmlbeC7rH/view?usp=sharing',
  granFondo: 'https://drive.google.com/file/d/12NWffGn9dX2Irwm3cv93__z5PB3kaHut/view?usp=sharing',
  sunday: 'https://drive.google.com/file/d/1wNPNQ1P2urutg0OfHNL66SLpTsp-cQfH/view?usp=sharing',
  mondayFull: 'https://drive.google.com/file/d/1RH-MrQagFh34QPX8qmgv-W9jl8jZ3R_T/view?usp=sharing',
  mondayShort: 'https://drive.google.com/file/d/1lV0iEvfqF4ZGtSktDDLahrGdfniNZZqt/view?usp=sharing',
}

const climbs = [
  { name: 'Puerto de Cabanes', km: 6.3, gradient: 4.7, elevation: 296, description: 'Warm-up climb through orange groves. Steady gradient, good road surface.', summit: 320 },
  { name: 'Puerto de la Serratella', km: 15.3, gradient: 3.7, elevation: 566, description: 'Long and steady. The key is pacing — start easy, finish strong.', summit: 886 },
  { name: 'Ares del Maestrat', km: 6.8, gradient: 5.5, elevation: 374, description: 'Variable gradient with some steeper sections. Beautiful medieval village at the top.', summit: 1195 },
  { name: 'La Bandereta', km: 4.4, gradient: 6.7, elevation: 295, description: 'Short but steep. The sting in the tail — dig deep!', summit: 1030 },
  { name: 'Final Push to Finish', km: 2.1, gradient: 4.2, elevation: 88, description: 'Last effort before the descent home. You have got this!', summit: 520 },
]

const dayByDay = [
  {
    day: 'Wednesday',
    date: '22 April',
    title: 'Arrival Day',
    icon: PartyPopper,
    color: 'bg-purple-100 text-purple-600',
    highlight: false,
    distance: null,
    elevation: null,
    activities: [
      'Arrive at Casa Pedal & Pause',
      'Bike setup and adjustments',
      'Optional short spin to test the bike',
      'Welcome drinks',
      'Dinner at Casa Pedal & Pause',
    ],
    gpx: null,
  },
  {
    day: 'Thursday',
    date: '23 April',
    title: 'Recce Ride',
    icon: Bike,
    color: 'bg-blue-100 text-blue-600',
    highlight: false,
    distance: 87,
    elevation: 1426,
    shortOption: { distance: 55, elevation: 970 },
    activities: [
      'Breakfast at Casa Pedal & Pause',
      'Recce ride — preview the climbs and terrain',
      'Shorter route available (55km / 970m)',
      'Dinner at Casa Pedal & Pause',
    ],
    gpx: { full: gpxLinks.thursdayFull, short: gpxLinks.thursdayShort },
  },
  {
    day: 'Friday',
    date: '24 April',
    title: 'Rest & Prep',
    icon: Waves,
    color: 'bg-cyan-100 text-cyan-600',
    highlight: false,
    distance: null,
    elevation: null,
    activities: [
      'Breakfast at Casa Pedal & Pause',
      'Pool and chill morning',
      'Optional physio / sports massage (€60 per session — book 10 days ahead)',
      'Activities in Oropesa (paddleboarding, explore)',
      'Pick up your bib number',
      'Dinner at Casa Pedal & Pause',
    ],
    gpx: null,
  },
  {
    day: 'Saturday',
    date: '25 April',
    title: 'GRAN FONDO',
    icon: Mountain,
    color: 'bg-brand-coral text-white',
    highlight: true,
    distance: 160,
    elevation: 2355,
    activities: [
      'Early breakfast',
      'Mediterranean Epic Gran Fondo — THE MAIN EVENT!',
      '5 major climbs, 1 incredible day',
      'Celebratory dinner at La Masia / El Puente (not included)',
    ],
    gpx: { full: gpxLinks.granFondo },
  },
  {
    day: 'Sunday',
    date: '26 April',
    title: 'Recovery Ride',
    icon: Coffee,
    color: 'bg-green-100 text-green-600',
    highlight: false,
    distance: 31,
    elevation: 471,
    activities: [
      'Breakfast at Casa Pedal & Pause',
      'Recovery ride to Desierto de las Palmas',
      'Cheese board at Bruno\'s (not included)',
      'Chill time — pool, explore Benicàssim',
      'Dinner at Casa Pedal & Pause',
    ],
    gpx: { full: gpxLinks.sunday },
  },
  {
    day: 'Monday',
    date: '27 April',
    title: 'Benafigos Adventure',
    icon: Bike,
    color: 'bg-amber-100 text-amber-600',
    highlight: false,
    distance: 79,
    elevation: 1551,
    shortOption: { distance: 62, elevation: 1141 },
    activities: [
      'Breakfast at Casa Pedal & Pause',
      'Ride to Benafigos via Cabanes',
      'Lunch stop in Atzeneta (not included)',
      'Shorter route available (62km / 1,141m)',
      'Dinner at Casa Pedal & Pause',
    ],
    gpx: { full: gpxLinks.mondayFull, short: gpxLinks.mondayShort },
  },
  {
    day: 'Tuesday',
    date: '28 April',
    title: 'Farewells',
    icon: Calendar,
    color: 'bg-gray-100 text-gray-600',
    highlight: false,
    distance: null,
    elevation: null,
    activities: [
      'Breakfast at Casa Pedal & Pause',
      'Pack and departure',
      'Until next time! 👋',
    ],
    gpx: null,
  },
]

export default function CoursePage() {
  const router = useRouter()
  const [expandedClimb, setExpandedClimb] = useState<number | null>(0)
  const [expandedDay, setExpandedDay] = useState<number | null>(3) // Saturday expanded by default

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
          <h1 className="text-2xl font-bold mb-2">UNCHAINED 2026</h1>
          <p className="text-white/80 text-sm mb-4">22-28 April • Benicàssim, Spain</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-2xl font-bold">6</p><p className="text-xs text-white/70">nights</p></div>
            <div><p className="text-2xl font-bold">4</p><p className="text-xs text-white/70">ride days</p></div>
            <div><p className="text-2xl font-bold">357</p><p className="text-xs text-white/70">km total</p></div>
          </div>
        </div>

        {/* Day by Day */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-coral" />
            Day by Day
          </h2>
          <div className="space-y-2">
            {dayByDay.map((day, i) => {
              const Icon = day.icon
              const isExpanded = expandedDay === i
              return (
                <div key={i} className={`rounded-xl overflow-hidden border ${day.highlight ? 'border-brand-coral' : 'border-gray-200'}`}>
                  <button onClick={() => setExpandedDay(isExpanded ? null : i)} className={`w-full p-3 flex items-center gap-3 text-left ${day.highlight ? 'bg-brand-coral/5' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${day.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-400">{day.day}</span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">{day.date}</span>
                      </div>
                      <p className={`font-semibold ${day.highlight ? 'text-brand-coral' : 'text-gray-900'}`}>{day.title}</p>
                    </div>
                    {day.distance && (
                      <div className="text-right text-xs text-gray-500">
                        <p>{day.distance}km</p>
                        <p>{day.elevation?.toLocaleString()}m</p>
                      </div>
                    )}
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-3">
                      {day.shortOption && (
                        <div className="bg-blue-50 rounded-lg p-2 text-xs text-blue-700">
                          <strong>Short option:</strong> {day.shortOption.distance}km / {day.shortOption.elevation.toLocaleString()}m
                        </div>
                      )}
                      <ul className="space-y-1">
                        {day.activities.map((activity, j) => (
                          <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-brand-coral mt-1">•</span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                      {day.gpx && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {day.gpx.full && (
                            <a href={day.gpx.full} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs bg-brand-coral text-white px-3 py-1.5 rounded-lg hover:bg-brand-coral-dark transition">
                              <Download className="w-3 h-3" />
                              Download GPX
                            </a>
                          )}
                          {day.gpx.short && (
                            <a href={day.gpx.short} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition">
                              <Download className="w-3 h-3" />
                              Short Route GPX
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Gran Fondo Stats */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-bold text-gray-900 mb-3">Gran Fondo Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">160</p>
              <p className="text-xs text-gray-500">kilometers</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-brand-coral">2,355</p>
              <p className="text-xs text-gray-500">meters climbing</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-xs text-gray-500">major climbs</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">1,050</p>
              <p className="text-xs text-gray-500">max elevation (m)</p>
            </div>
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

        {/* Important Notes */}
        <div className="bg-amber-50 rounded-2xl p-4">
          <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Notes
          </h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• All breakfasts and most dinners included</li>
            <li>• Saturday celebratory dinner not included</li>
            <li>• Lunch stops on rides not included</li>
            <li>• Physio/massage: €60/session — book 10 days ahead</li>
          </ul>
        </div>

        {/* Back Button */}
        <button onClick={() => router.push('/dashboard')} className="w-full py-3 bg-brand-coral text-white font-semibold rounded-xl hover:bg-brand-coral-dark transition">Back to Training</button>
      </main>
    </div>
  )
}
