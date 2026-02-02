'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LOGO_URL, UNCHAINED_START_DATE } from '@/lib/brand'
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'

const questions = [
  {
    id: 'cycling',
    question: 'How would you describe your current cycling?',
    options: [
      { value: 'none', label: "I don't cycle regularly" },
      { value: 'returning', label: 'I used to cycle but stopped' },
      { value: 'flat', label: 'I cycle on flat terrain' },
      { value: 'hills', label: 'I cycle including hills' },
    ],
  },
  {
    id: 'longest_ride',
    question: "What's the longest ride you've done recently?",
    options: [
      { value: 'under1', label: 'Under 1 hour' },
      { value: '1-2', label: '1-2 hours' },
      { value: '2-3', label: '2-3 hours' },
      { value: '3+', label: '3+ hours' },
    ],
  },
  {
    id: 'climbing',
    question: 'How do you feel about climbing?',
    options: [
      { value: 'never', label: 'Never tried it' },
      { value: 'struggle', label: 'I struggle with hills' },
      { value: 'manage', label: 'I can manage' },
      { value: 'enjoy', label: 'I enjoy climbing' },
    ],
  },
]

type ProfileType = 'A' | 'B' | 'C'

const profileInfo: Record<ProfileType, { name: string; description: string }> = {
  A: { name: 'Active Non-Cyclist', description: 'Building cycling-specific fitness' },
  B: { name: 'Returning Cyclist', description: 'Getting back in the saddle' },
  C: { name: 'Regular Cyclist', description: 'Ready to conquer the climbs' },
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [selectedDistance, setSelectedDistance] = useState<'196km' | '160km' | null>(null)
  const [selectedSpeed, setSelectedSpeed] = useState<20 | 23 | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [guestId, setGuestId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('unchained_guest_id')
    if (!id) {
      router.push('/join')
      return
    }
    setGuestId(id)
    checkIfOnboarded(id)
  }, [])

  const checkIfOnboarded = async (id: string) => {
    const { data: guest } = await supabase
      .from('guests')
      .select('profile_type, selected_distance')
      .eq('id', id)
      .single()

    if (guest?.profile_type && guest?.selected_distance) {
      router.push('/dashboard')
    } else {
      setChecking(false)
    }
  }

  const calculateProfile = (ans: Record<string, string>): ProfileType => {
    if (ans.cycling === 'none') return 'A'
    if (ans.cycling === 'returning') return 'B'
    return 'C'
  }

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 200)
    } else {
      const p = calculateProfile(newAnswers)
      setProfile(p)
      setTimeout(() => setStep(questions.length), 200)
    }
  }

  const handleComplete = async () => {
    if (!guestId || !profile || !selectedDistance || !selectedSpeed) return

    setLoading(true)
    setError(null)
    
    // Calculate training start date (12 weeks / 84 days before event)
    const eventDate = new Date(UNCHAINED_START_DATE)
    const startDate = new Date(eventDate)
    startDate.setDate(startDate.getDate() - 84)
    const startDateStr = startDate.toISOString().split('T')[0]

    const { error: updateError } = await supabase
      .from('guests')
      .update({
        profile_type: profile,
        selected_distance: selectedDistance,
        selected_speed: selectedSpeed,
        training_start_date: startDateStr,
      })
      .eq('id', guestId)

    if (updateError) {
      console.error('Update error:', updateError)
      setError('Failed to save. Please try again.')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-coral animate-spin" />
      </div>
    )
  }

  // Quiz questions
  if (step < questions.length) {
    const q = questions[step]
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b p-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <img src={LOGO_URL} alt="Pedal & Pause" className="h-8" />
            <span className="text-sm text-gray-500">Step {step + 1} of {questions.length + 1}</span>
          </div>
        </header>

        <main className="flex-1 max-w-lg mx-auto w-full p-6">
          <div className="flex gap-1 mb-8">
            {[...Array(questions.length + 1)].map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-brand-coral' : 'bg-gray-200'}`}
              />
            ))}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-8">{q.question}</h1>

          <div className="space-y-3">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(q.id, opt.value)}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-brand-coral transition"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-6 flex items-center gap-2 text-gray-500"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
        </main>
      </div>
    )
  }

  // Plan selection
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <img src={LOGO_URL} alt="Pedal & Pause" className="h-8" />
          <span className="text-sm text-gray-500">Final step</span>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full p-6">
        <div className="flex gap-1 mb-8">
          {[...Array(questions.length + 1)].map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full bg-brand-coral" />
          ))}
        </div>

        {/* Profile Result */}
        <div className="bg-white rounded-2xl p-6 mb-6 text-center border">
          <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">{profile}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            You are a {profileInfo[profile!].name}!
          </h2>
          <p className="text-gray-600">{profileInfo[profile!].description}</p>
        </div>

        {/* Distance Selection */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose your distance</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
