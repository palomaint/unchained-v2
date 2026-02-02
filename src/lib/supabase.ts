import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export type Guest = {
  id: string
  email: string
  name: string | null
  profile_type: 'A' | 'B' | 'C' | 'D' | null
  selected_distance: '196km' | '160km' | null
  selected_speed: 20 | 23 | null
  training_start_date: string | null
  rider_number: number
  show_name_on_leaderboard: boolean
  created_at: string
  updated_at: string
}

export type CompletedSession = {
  id: string
  guest_id: string
  week_number: number
  day_index: number
  session_type: string
  completed_at: string
  notes: string | null
  rating: number | null
}

export type WeeklyContent = {
  week_number: number
  quote: string
  quote_author: string | null
  nutrition_advice: string
  phase_name: string
  phase_description: string | null
}
