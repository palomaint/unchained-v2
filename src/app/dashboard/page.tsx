'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type Guest, type CompletedSession, type WeeklyContent } from '@/lib/supabase'
import { getWeek, type Session } from '@/data/training-plans'
import { LOGO_URL, UNCHAINED_START_DATE, WHATSAPP_GROUP_LINK } from '@/lib/brand'
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Clock,
  Mountain,
  Flame,
  MessageCircle,
  LogOut,
  Loader2,
} from 'lucide-react'

function getDaysUntil(): number {
  const event = new Date(UNCHAINED_START_DATE)
  const now = new Date()
  return Math.max(0, Math.ceil((event.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
}

function getCurrentWeek(startDate: string): number {
  const start = new Date(startDate)
  const now = new Date()
  const diff = now.getTime() - start.getTime()
  const week = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.max(1, Math.min(12, week))
}

export default function DashboardPage() {
  const router = useRouter()
  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewWeek, setViewWeek] = useState(1)
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([])
  const [weeklyContent, setWeeklyContent] = useState<WeeklyContent | null>(null)
  const [toggling, setToggling] = useState<number | null>(null)

  useEffect(() => {
    const guestId = localStorage.getItem('unchained_guest_id')
    if (!guestId) {
      router.push('/join')
      return
    }
    loadGuest(guestId)
  }, [])

  useEffect(() => {
    if (viewWeek) loadWeeklyContent(viewWeek)
  }, [viewWeek])

  const loadGuest = async (guestId: string) => {
    const { data: guestData } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single()

    if (!guestData) {
      localStorage.removeItem('unchained_guest_id')
      router.push('/join')
      return
    }

    if (!guestData.profile_type || !guestData.selected_distance) {
      router.push('/onboarding')
      return
    }

    setGuest(guestData)
    
    const currentWeek = guestData.training_start_date 
      ? getCurrentWeek(guestData.training_start_date) 
      : 1
    setViewWeek(currentWeek)

    // Load completed sessions
    const { data: sessions } = await supabase
      .from('completed_sessions')
      .select('*')
      .eq('guest_id', guestId)

    if (sessions) setCompletedSessions(sessions)
    setLoading(false)
  }

  const loadWeeklyContent = async (week: number) => {
    const { data } = await supabase
      .from('weekly_content')
      .select('*')
      .eq('week_number', week)
      .single()
    
    if (data) setWeeklyContent(data)
  }

  const isCompleted = (weekNum: number, dayIdx: number) => {
    return completedSessions.some(
      s => s.week_number === weekNum && s.day_index === dayIdx
    )
  }

  const toggleSession = async (session: Session) => {
    if (!guest || session.type === 'rest') return
    
    setToggling(session.dayIndex)
    const completed = isCompleted(viewWeek, session.dayIndex)

    if (completed) {
      // Remove completion
      const target = completedSessions.find(
        s => s.week_number === viewWeek && s.day_index === session.dayIndex
      )
      if (target) {
        await supabase.from('completed_sessions').delete().eq('id', target.id)
        setCompletedSessions(prev => prev.filter(s => s.id !== target.id))
      }
    } else {
      // Add completion
      const { data } = await supabase
        .from('completed_sessions')
        .insert({
          guest_id: guest.id,
          week_number: viewWeek,
          day_index: session.dayIndex,
          session_type: session.type,
        })
        .select()
        .single()

      if (data) setCompletedSessions(prev => [...prev, data])
    }
    setToggling(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('unchained_guest_id')
    localStorage.removeItem('unchained_email')
    router.push('/join')
  }

  if (loading || !guest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-coral animate-spin" />
      </div>
    )
  }

  const weekPlan = getWeek(viewWeek)
  if (!weekPlan) return null

  const weekCompleted = weekPlan.sessions.filter(s => isCompleted(viewWeek, s.dayIndex)).length
  const weekTotal = weekPlan.sessions.filter(s => s.type !== 'rest').length
  const progressPercent = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0
  const daysUntil = getDaysUntil()

  const phaseName = () => {
    if (viewWeek <= 3) return 'Foundation'
    if (viewWeek === 4) return 'Recovery'
    if (viewWeek <= 7) return 'Base Building'
    if (viewWeek === 8) return 'Recovery'
    if (viewWeek <= 10) return 'Build'
    if (viewWeek === 11) return 'Sharpening'
    return 'Taper'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <img src={LOGO_URL} alt="Pedal & Pause" className="h-8" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{guest.selected_distance}</span>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-600">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        {/* Countdown */}
        <div className="bg-gradient-to-r from-brand-coral to-brand-coral-dark rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">UNCHAINED in</p>
              <p className="text-3xl font-bold">{daysUntil} days</p>
            </div>
            <Mountain className="w-10 h-10 opacity-80" />
          </div>
        </div>

        {/* Week Selector */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setViewWeek(w => Math.max(1, w - 1))}
              disabled={viewWeek === 1}
              className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-900">Week {viewWeek}</h2>
              <p className="text-sm text-brand-coral font-medium">{phaseName()}</p>
            </div>
            <button
              onClick={() => setViewWeek(w => Math.min(12, w + 1))}
              disabled={viewWeek === 12}
              className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{weekCompleted}/{weekTotal} sessions</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-coral rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Weekly Quote */}
        {weeklyContent?.quote && (
          <div className="bg-white rounded-2xl p-4">
            <p className="text-gray-700 italic text-sm">"{weeklyContent.quote}"</p>
            {weeklyContent.quote_author && (
              <p className="text-gray-400 text-xs mt-1">— {weeklyContent.quote_author}</p>
            )}
          </div>
        )}

        {/* Sessions */}
        <div className="space-y-2">
          {weekPlan.sessions.map((session) => {
            const completed = isCompleted(viewWeek, session.dayIndex)
            const isRest = session.type === 'rest'
            const isLoading = toggling === session.dayIndex

            return (
              <button
                key={session.dayIndex}
                onClick={() => toggleSession(session)}
                disabled={isRest || isLoading}
                className={`w-full bg-white rounded-xl p-3 flex items-center gap-3 text-left transition ${
                  completed ? 'opacity-60' : ''
                } ${isRest ? 'cursor-default' : 'hover:shadow-md'}`}
              >
                <div className="flex-shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-10 h-10 text-brand-coral animate-spin" />
                  ) : isRest ? (
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg">
                      {session.icon}
                    </div>
                  ) : completed ? (
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-50 border-2 border-gray-200 rounded-xl flex items-center justify-center text-lg">
                      {session.icon}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400">{session.day}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      session.type === 'rest' ? 'bg-gray-100 text-gray-400' :
                      session.type === 'intervals' ? 'bg-orange-100 text-orange-600' :
                      session.type === 'strength' ? 'bg-amber-100 text-amber-700' :
                      session.type === 'long' ? 'bg-purple-100 text-purple-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {session.type}
                    </span>
                  </div>
                  <p className={`font-medium text-gray-900 ${completed ? 'line-through' : ''}`}>
                    {session.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{session.description}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  {session.duration > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{session.duration}m</span>
                    </div>
                  )}
                  {session.zone && (
                    <p className="text-xs text-brand-coral font-medium">{session.zone}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Nutrition Tip */}
        {weeklyContent?.nutrition_advice && (
          <div className="bg-green-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Nutrition Tip</span>
            </div>
            <p className="text-sm text-green-700">{weeklyContent.nutrition_advice}</p>
          </div>
        )}

        {/* WhatsApp Link */}
        <a
          href={WHATSAPP_GROUP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-2xl p-4 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Join the WhatsApp Group</p>
              <p className="text-sm text-gray-500">Connect with fellow riders</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </a>
      </main>
    </div>
  )
}
