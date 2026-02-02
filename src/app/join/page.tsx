'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LOGO_URL } from '@/lib/brand'
import { Mountain, Mail, Loader2, ChevronRight, XCircle } from 'lucide-react'

export default function JoinPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [notRegistered, setNotRegistered] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if already logged in
    const savedGuestId = localStorage.getItem('unchained_guest_id')
    if (savedGuestId) {
      checkExistingGuest(savedGuestId)
    } else {
      setChecking(false)
    }
  }, [])

  const checkExistingGuest = async (guestId: string) => {
    const { data: guest } = await supabase
      .from('guests')
      .select('profile_type, selected_distance')
      .eq('id', guestId)
      .single()

    if (guest) {
      if (guest.profile_type && guest.selected_distance) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding')
      }
    } else {
      localStorage.removeItem('unchained_guest_id')
      localStorage.removeItem('unchained_email')
      setChecking(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setNotRegistered(false)

    try {
      const cleanEmail = email.toLowerCase().trim()

      const { data: guest, error: fetchError } = await supabase
        .from('guests')
        .select('id, profile_type, selected_distance')
        .eq('email', cleanEmail)
        .single()

      if (fetchError || !guest) {
        setNotRegistered(true)
        setLoading(false)
        return
      }

      // Save to localStorage
      localStorage.setItem('unchained_email', cleanEmail)
      localStorage.setItem('unchained_guest_id', guest.id)

      if (guest.profile_type && guest.selected_distance) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding')
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-coral animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <div className="mb-8">
          <img src={LOGO_URL} alt="Pedal & Pause" className="h-16 object-contain" />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">UNCHAINED</h1>
          <p className="text-gray-400 text-lg">Your training journey starts here</p>
        </div>

        {/* Event Info Card */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8 max-w-md w-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-brand-coral rounded-xl flex items-center justify-center">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">23-27 April 2025</p>
              <p className="text-gray-400 text-sm">Benicassim, Spain</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-brand-coral">4</p>
              <p className="text-xs text-gray-400">Days Riding</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-coral">196</p>
              <p className="text-xs text-gray-400">km Gran Fondo</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-coral">3,200</p>
              <p className="text-xs text-gray-400">m Climbing</p>
            </div>
          </div>
        </div>

        {/* Join Form */}
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
          {notRegistered ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Not registered</h2>
              <p className="text-gray-600 mb-4">
                We could not find <strong>{email}</strong> in our guest list.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                If you have booked UNCHAINED, please contact us.
              </p>
              <a
                href="mailto:info@pedalandpause.com?subject=UNCHAINED%20App%20Access"
                className="inline-block px-6 py-2 bg-brand-coral text-white font-semibold rounded-xl hover:bg-brand-coral-dark transition mb-4"
              >
                Contact Pedal & Pause
              </a>
              <br />
              <button
                onClick={() => { setNotRegistered(false); setEmail(''); }}
                className="text-brand-coral hover:underline text-sm"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome, rider!</h2>
              <p className="text-gray-600 text-sm mb-6">
                Enter your email to access your training plan.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-coral focus:border-brand-coral outline-none transition"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use the email you registered with.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-coral text-white font-semibold rounded-xl hover:bg-brand-coral-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Access My Training
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-gray-500 text-sm mt-8 text-center">
          UNCHAINED by Pedal & Pause
        </p>
      </div>
    </div>
  )
}
