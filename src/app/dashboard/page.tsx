'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type Guest, type CompletedSession, type WeeklyContent } from '@/lib/supabase'
import { getWeek, type Session } from '@/data/training-plans'
import { LOGO_URL, UNCHAINED_START_DATE, WHATSAPP_GROUP_LINK } from '@/lib/brand'
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Mountain, Flame, MessageCircle, LogOut, Loader2, X, Map, RotateCcw, AlertTriangle, Share2, PartyPopper } from 'lucide-react'

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

const milestoneMessages = [
  { threshold: 1, message: "First session done! The journey begins 🚀" },
  { threshold: 4, message: "First week complete! Building momentum 💪" },
  { threshold: 12, message: "3 weeks in! You're getting stronger 🔥" },
  { threshold: 24, message: "Halfway there! Keep pushing 🏔️" },
  { threshold: 36, message: "75% complete! The finish line is in sight 🎯" },
  { threshold: 48, message: "Training complete! Ready for UNCHAINED! 🎉" },
]

export default function DashboardPage() {
  const router = useRouter()
  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewWeek, setViewWeek] = useState(1)
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([])
  const [weeklyContent, setWeeklyContent] = useState<WeeklyContent | null>(null)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [completing, setCompleting] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [milestone, setMilestone] = useState<string | null>(null)

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

  const handleSessionClick = (session: Session) => { 
    if (session.type !== 'rest') {
      setSelectedSession(session)
      setJustCompleted(false)
      setMilestone(null)
    }
  }

  const checkMilestone = (newTotal: number) => {
    const hit = milestoneMessages.find(m => m.threshold === newTotal)
    if (hit) setMilestone(hit.message)
  }

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
      setCompleting(false)
      setSelectedSession(null)
    } else {
      const { data } = await supabase.from('completed_sessions').insert({ guest_id: guest.id, week_number: viewWeek, day_index: selectedSession.dayIndex, session_type: selectedSession.type }).select().single()
      if (data) {
        const newSessions = [...completedSessions, data]
        setCompletedSessions(newSessions)
        checkMilestone(newSessions.length)
        setJustCompleted(true)
      }
      setCompleting(false)
    }
  }

  const shareToWhatsApp = () => {
    if (!selectedSession) return
    const totalDone = completedSessions.length
    const emoji = selectedSession.type === 'strength' ? '💪' : selectedSession.type === 'long' ? '🏔️' : selectedSession.type === 'intervals' ? '🔥' : '🚴'
    let message = `${emoji} Just completed Week ${viewWeek} - ${selectedSession.name}! `
    if (milestone) {
      message += `\n\n🎉 ${milestone}`
    }
    message += `\n\n${totalDone} sessions done. #UNCHAINED`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  const handleReset = async () => {
    if (!guest) return
    setResetting(true)
    await supabase.from('completed_sessions').delete().eq('guest_id', guest.id)
    setCompletedSessions([])
    setResetting(false)
    setShowResetModal(false)
  }

  const handleLogout = () => { localStorage.removeItem('unchained_guest_id'); localStorage.removeItem('unchained_email'); router.push('/join') }

  if (loading || !guest) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-brand-coral animate-spin" /></div>

  const weekPlan = getWeek(viewWeek)
  if (!weekPlan) return null

  const weekCompleted = weekPlan.sessions.filter(s => isCompleted(viewWeek, s.dayIndex)).length
  const weekTotal = weekPlan.sessions.filter(s => s.type !== 'rest').length
  const progressPercent = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0
  const daysUntil = getDaysUntil()
  const totalCompleted = completedSessions.length
  const phaseName = () => { if (viewWeek <= 3) return 'Foundation'; if (viewWeek === 4) return 'Recovery'; if (viewWeek <= 7) return 'Base Building'; if (viewWeek === 8) return 'Recovery'; if (viewWeek <= 10) return 'Build'; if (viewWeek === 11) return 'Sharpening'; return 'Taper' }
  const getStrengthRoutine = (name: string) => { if (name.includes('Strength A')) return strengthRoutines.A; if (name.includes('Strength B')) return strengthRoutines.B; return null }
  const sessionCompleted = selectedSession ? isCompleted(viewWeek, selectedSession.dayIndex) : false
  const weekIsComplete = progressPercent === 100

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <img src={LOGO_URL} alt="Pedal & Pause" className="h-8" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{guest.selected_distance}</span>
            <button onClick={() => setShowResetModal(true)} className="p-2 text-gray-400 hover:text-orange-500" title="Reset Training">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-600" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
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
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{weekCompleted}/{weekTotal} sessions</span><span>{progressPercent}%</span></div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-brand-coral rounded-full transition-all" style={{ width: `${progressPercent}%` }} /></div>
          </div>
        </div>

        {/* Week Complete Celebration */}
        {weekIsComplete && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3">
              <PartyPopper className="w-8 h-8" />
              <div className="flex-1">
                <p className="font-bold">Week {viewWeek} Complete! 🎉</p>
                <p className="text-sm text-white/80">Great work! Share your progress?</p>
              </div>
              <button onClick={() => {
                const message = encodeURIComponent(`✅ Week ${viewWeek} complete! ${totalCompleted} total sessions done. Let's go! 💪 #UNCHAINED`)
                window.open(`https://wa.me/?text=${message}`, '_blank')
              }} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {weeklyContent?.quote && (
          <div className="bg-white rounded-2xl p-4">
            <p className="text-gray-700 italic text-sm">&quot;{weeklyContent.quote}&quot;</p>
            {weeklyContent.quote_author && <p className="text-gray-400 text-xs mt-1">— {weeklyContent.quote_author}</p>}
          </div>
        )}

        <div className="space-y-2">
          {weekPlan.sessions.map((session) => {
            const completed = isCompleted(viewWeek, session.dayIndex)
            const isRest = session.type === 'rest'
            return (
              <button key={session.dayIndex} onClick={() => handleSessionClick(session)} disabled={isRest} className={`w-full bg-white rounded-xl p-3 flex items-center gap-3 text-left transition ${completed ? 'opacity-60' : ''} ${isRest ? 'cursor-default' : 'hover:shadow-md'}`}>
                <div className="flex-shrink-0">
                  {isRest ? <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg">{session.icon}</div> : completed ? <CheckCircle className="w-10 h-10 text-green-500" /> : <div className="w-10 h-10 bg-gray-50 border-2 border-gray-200 rounded-xl flex items-center justify-center text-lg">{session.icon}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400">{session.day}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${session.type === 'rest' ? 'bg-gray-100 text-gray-400' : session.type === 'intervals' ? 'bg-orange-100 text-orange-600' : session.type === 'strength' ? 'bg-amber-100 text-amber-700' : session.type === 'long' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>{session.type}</span>
                  </div>
                  <p className={`font-medium text-gray-900 ${completed ? 'line-through' : ''}`}>{session.name}</p>
                  <p className="text-xs text-gray-500 truncate">{session.description}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  {session.duration > 0 && <div className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3 h-3" /><span>{session.duration}m</span></div>}
                  {session.zone && <p className="text-xs text-brand-coral font-medium">{session.zone}</p>}
                </div>
              </button>
            )
          })}
        </div>

        {weeklyContent?.nutrition_advice && (
          <div className="bg-green-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1"><Flame className="w-4 h-4 text-green-600" /><span className="text-sm font-semibold text-green-800">Nutrition Tip</span></div>
            <p className="text-sm text-green-700">{weeklyContent.nutrition_advice}</p>
          </div>
        )}

        <button onClick={() => router.push('/course')} className="w-full bg-white rounded-2xl p-4 hover:shadow-md transition text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center"><Map className="w-5 h-5 text-purple-600" /></div>
            <div><p className="font-medium text-gray-900">The Course</p><p className="text-sm text-gray-500">Route, climbs & day-by-day</p></div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </button>

        <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-2xl p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center"><MessageCircle className="w-5 h-5 text-white" /></div>
            <div><p className="font-medium text-gray-900">Join the WhatsApp Group</p><p className="text-sm text-gray-500">Connect with fellow riders</p></div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </a>
      </main>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0">
              <div><h3 className="font-bold text-gray-900 text-lg">{selectedSession.name}</h3><p className="text-sm text-gray-500">{selectedSession.description}</p></div>
              <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Just Completed Celebration */}
              {justCompleted && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white text-center">
                  <PartyPopper className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold text-lg">Nice work! 🎉</p>
                  {milestone && <p className="text-sm text-white/90 mt-1">{milestone}</p>}
                  <button onClick={shareToWhatsApp} className="mt-3 bg-white text-green-600 font-semibold px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-green-50 transition">
                    <Share2 className="w-4 h-4" />
                    Share to WhatsApp
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                {selectedSession.duration > 0 && <div className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full"><Clock className="w-4 h-4 text-gray-500" /><span>{selectedSession.duration} min</span></div>}
                {selectedSession.zone && <div className="text-sm bg-brand-coral/10 text-brand-coral px-3 py-1 rounded-full font-medium">{selectedSession.zone}</div>}
              </div>
              {selectedSession.type === 'strength' && getStrengthRoutine(selectedSession.name) && (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4"><h4 className="font-semibold text-blue-800 mb-2">Warm-up (3 min)</h4><ul className="space-y-1">{getStrengthRoutine(selectedSession.name)!.warmup.map((item, i) => <li key={i} className="text-sm text-blue-700">• {item}</li>)}</ul></div>
                  <div><h4 className="font-semibold text-gray-800 mb-3">Circuit (2 rounds)</h4><p className="text-xs text-brand-coral mb-3">Rest 30-60 seconds between exercises</p><div className="space-y-3">{getStrengthRoutine(selectedSession.name)!.exercises.map((ex, i) => <div key={i} className="bg-gray-50 rounded-xl p-3"><div className="flex justify-between items-start"><span className="font-medium text-gray-900">{i + 1}. {ex.name}</span><span className="text-sm font-semibold text-brand-coral">{ex.reps}</span></div><p className="text-xs text-gray-500 mt-1">{ex.notes}</p></div>)}</div></div>
                  <div className="bg-green-50 rounded-xl p-4"><h4 className="font-semibold text-green-800 mb-2">Cool-down</h4><ul className="space-y-1">{getStrengthRoutine(selectedSession.name)!.cooldown.map((item, i) => <li key={i} className="text-sm text-green-700">• {item}</li>)}</ul></div>
                </div>
              )}
              {selectedSession.type !== 'strength' && selectedSession.type !== 'rest' && !justCompleted && (
                <div className="bg-gray-50 rounded-xl p-4"><h4 className="font-semibold text-gray-800 mb-2">Session Details</h4><p className="text-sm text-gray-600">{selectedSession.type === 'intervals' ? 'Warm up for 15 minutes in Zone 2, then complete the interval set. Focus on maintaining consistent power through each effort. Recover fully between intervals. Cool down for 10 minutes.' : selectedSession.type === 'endurance' ? 'Keep this ride in Zone 2 throughout. You should be able to hold a conversation. Focus on smooth pedalling and staying relaxed. Practice your hydration and nutrition strategy.' : selectedSession.type === 'long' ? 'This is your key endurance builder. Stay in Zone 2, eat every 45 minutes after the first hour. Practice everything you will do on event day — same food, same pacing. If you have hills available, include them.' : 'Easy spin to keep the legs moving. No pressure on this one — high cadence, low resistance. Just enjoy the ride.'}</p></div>
              )}
            </div>
            <div className="p-4 border-t bg-white">
              {justCompleted ? (
                <button onClick={() => setSelectedSession(null)} className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition">
                  Close
                </button>
              ) : (
                <button onClick={markComplete} disabled={completing} className={`w-full py-3 font-semibold rounded-xl transition flex items-center justify-center gap-2 ${sessionCompleted ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-brand-coral text-white hover:bg-brand-coral-dark'}`}>
                  {completing ? <Loader2 className="w-5 h-5 animate-spin" /> : sessionCompleted ? <><CheckCircle className="w-5 h-5" />Completed — Tap to Undo</> : <><CheckCircle className="w-5 h-5" />Mark as Complete</>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Reset Training Progress?</h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              This will delete all {totalCompleted} completed sessions. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition">
                Cancel
              </button>
              <button onClick={handleReset} disabled={resetting} className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2">
                {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
