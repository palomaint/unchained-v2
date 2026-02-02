'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type Guest, type CompletedSession, type WeeklyContent } from '@/lib/supabase'
import { getWeek, type Session } from '@/data/training-plans'
import { LOGO_URL, UNCHAINED_START_DATE, WHATSAPP_GROUP_LINK } from '@/lib/brand'
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Mountain, Flame, MessageCircle, LogOut, Loader2, X } from 'lucide-react'

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

const strengthRoutines = {
  A: {
    name: 'Strength A',
    subtitle: 'Cycling-Specific Power',
    duration: 25,
    warmup: ['March in place - 1 min', 'Bodyweight squats - 10 reps', 'Glute bridges - 10 reps'],
    exercises: [
      { name: 'Goblet Squats', reps: '12 reps', notes: 'Use 5L water bottle or backpack' },
      { name: 'Glute Bridges', reps: '15 reps', notes: 'Squeeze at top, hold 2 seconds' },
      { name: 'Step-Ups', reps: '10 each leg', notes: 'Use sturdy chair or stairs' },
      { name: 'Plank', reps: '45 seconds', notes: 'Keep hips level' },
      { name: 'Single-Leg Glute Bridge', reps: '10 each side', notes: 'Keep hips level' },
      { name: 'Clamshells', reps: '15 each side', notes: 'Use resistance band if available' },
    ],
    cooldown: ['Hip flexor stretch - 45s each side', 'Hamstring stretch - 30s each side'],
  },
  B: {
    name: 'Strength B',
    subtitle: 'Core Focus',
    duration: 20,
    warmup: ['Cat-cow stretches - 10 reps', 'Torso twists - 10 each side'],
    exercises: [
      { name: 'Plank', reps: '45 seconds', notes: 'Forearms on ground' },
      { name: 'Side Plank', reps: '25s each side', notes: 'Stack or stagger feet' },
      { name: 'Dead Bug', reps: '10 each side', notes: 'Keep lower back pressed down' },
      { name: 'Bird Dog', reps: '10 each side', notes: 'Hold 2 seconds at extension' },
      { name: 'Single-Leg Balance', reps: '30s each leg', notes: 'Close eyes for difficulty' },
      { name: 'Bicycle Crunches', reps: '20 total', notes: 'Slow and controlled' },
    ],
    cooldown: ['90/90 hip stretch - 45s each side', 'Spine twist - 30s each side', 'Childs pose - 45s'],
  },
}

export default function DashboardPage() {
  const router = useRouter()
  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewWeek, setViewWeek] = useState(1)
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([])
  const [weeklyContent, setWeeklyContent] = useState<WeeklyContent | null>(null)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    const guestId = localStorage.getItem('unchained_guest_id')
    if (!guestId) { router.push('/join'); return }
    loadGuest(guestId)
  }, [router])

  useEffect(() => { if (viewWeek) loadWeeklyContent(viewWeek) }, [viewWeek])

  const loadGuest = async (guestId: string) => {
    const { data: guestData } = await supabase.from('guests').select('*').eq('id', guestId).single()
    if (!guestData) { localStorage.removeItem('unchained_guest_id'); router.push('/join'); return }
    if (!guestData.profile_type || !guestData.selected_distance) { router.push('/onboarding'); return }
    setGuest(guestData)
    const currentWeek = guestData.training_start_date ? getCurrentWeek(guestData.training_start_date) : 1
    setViewWeek(currentWeek)
    const { data: sessions } = await supabase.from('completed_sessions').select('*').eq('guest_id', guestId)
    if (sessions) setCompletedSessions(sessions)
    setLoading(false)
  }

  const loadWeeklyContent = async (week: number) => {
    const { data } = await supabase.from('weekly_content').select('*').eq('week_number', week).single()
    if (data) setWeeklyContent(data)
  }

  const isCompleted = (weekNum: number, dayIdx: number) => completedSessions.some(s => s.week_number === weekNum && s.day_index === dayIdx)

  const handleSessionClick = (session: Session) => { if (session.type !== 'rest') setSelectedSession(session) }

  const markComplete = async () => {
    if (!guest || !selectedSession) return
    setCompleting(true)
    const completed = isCompleted(viewWeek, selectedSession.dayIndex)
    if (completed) {
      const target = completedSessions.find(s => s.week_number === viewWeek && s.day_index === selectedSession.dayIndex)
      if (target) {
        await supabase.from('completed_sessions').delete().eq('id', target.id)
        setCompletedSessions(prev => prev.filter(s => s.id !== target.id))
      }
    } else {
      const { data } = await supabase.from('completed_sessions').insert({ guest_id: guest.id, week_number: viewWeek, day_index: selectedSession.dayIndex, session_type: selectedSession.type }).select().single()
      if (data) setCompletedSessions(prev => [...prev, data])
    }
    setCompleting(false)
    setSelectedSession(null)
  }

  const handleLogout = () => { localStorage.removeItem('unchained_guest_id'); localStorage.removeItem('unchained_email'); router.push('/join') }

  if (loading || !guest) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-brand-coral animate-spin" /></div>

  const weekPlan = getWeek(viewWeek)
  if (!weekPlan) return null

  const weekCompleted = weekPlan.sessions.filter(s => isCompleted(viewWeek, s.dayIndex)).length
  const weekTotal = weekPlan.sessions.filter(s => s.type !== 'rest').length
  const progressPercent = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0
  const daysUntil = getDaysUntil()
  const phaseName = () => { if (viewWeek <= 3) return 'Foundation'; if (viewWeek === 4) return 'Recovery'; if (viewWeek <= 7) return 'Base Building'; if (viewWeek === 8) return 'Recovery'; if (viewWeek <= 10) return 'Build'; if (viewWeek === 11) return 'Sharpening'; return 'Taper' }
  const getStrengthRoutine = (name: string) => { if (name.includes('Strength A')) return strengthRoutines.A; if (name.includes('Strength B')) return strengthRoutines.B; return null }
  const sessionCompleted = selectedSession ? isCompleted(viewWeek, selectedSession.dayIndex) : false

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <img src={LOGO_URL} alt="Pedal & Pause" className="h-8" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{guest.selected_distance}</span>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-600"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        <div className="bg-gradient-to-r from-brand-coral to-brand-coral-dark rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div><p className="text-sm opacity-90">UNCHAINED in</p><p className="text-3xl font-bold">{daysUntil} days</p></div>
            <Mountain className="w-10 h-10 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setViewWeek(w => Math.max(1, w - 1))} disabled={viewWeek === 1} className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
            <div className="text-center"><h2 className="text-lg font-bold text-gray-900">Week {viewWeek}</h2><p className="text-sm text-brand-coral font-medium">{phaseName()}</p></div>
            <button onClick={() => setViewWeek(w => Math.min(12, w + 1))} disabled={viewWeek === 12} className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
