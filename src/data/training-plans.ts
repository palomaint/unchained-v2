export type Session = {
  day: string
  dayIndex: number
  type: 'rest' | 'cycling' | 'strength' | 'intervals' | 'endurance' | 'long'
  name: string
  duration: number
  zone: string | null
  description: string
  icon: string
}

export type WeekPlan = {
  weekNumber: number
  sessions: Session[]
}

// Generate a sample week (same structure for all weeks, you can customize later)
const generateWeek = (weekNumber: number): WeekPlan => {
  const isRecoveryWeek = weekNumber === 4 || weekNumber === 8
  const isBuiltWeek = weekNumber >= 9 && weekNumber <= 11
  const isTaperWeek = weekNumber === 12

  if (isTaperWeek) {
    return {
      weekNumber,
      sessions: [
        { day: 'Mon', dayIndex: 0, type: 'rest', name: 'Rest Day', duration: 0, zone: null, description: 'Recovery and preparation', icon: '😴' },
        { day: 'Tue', dayIndex: 1, type: 'cycling', name: 'Easy Spin', duration: 45, zone: 'Z1-2', description: 'Light opener ride', icon: '🚴' },
        { day: 'Wed', dayIndex: 2, type: 'rest', name: 'Rest Day', duration: 0, zone: null, description: 'Rest and pack', icon: '😴' },
        { day: 'Thu', dayIndex: 3, type: 'cycling', name: 'Shakeout', duration: 30, zone: 'Z1', description: 'Easy spin', icon: '🚴' },
        { day: 'Fri', dayIndex: 4, type: 'rest', name: 'Rest Day', duration: 0, zone: null, description: 'Travel day prep', icon: '😴' },
        { day: 'Sat', dayIndex: 5, type: 'rest', name: 'Travel', duration: 0, zone: null, description: 'Travel to Spain!', icon: '✈️' },
        { day: 'Sun', dayIndex: 6, type: 'rest', name: 'Arrival', duration: 0, zone: null, description: 'Welcome to UNCHAINED!', icon: '🎉' },
      ],
    }
  }

  if (isRecoveryWeek) {
    return {
      weekNumber,
      sessions: [
        { day: 'Mon', dayIndex: 0, type: 'rest', name: 'Rest Day', duration: 0, zone: null, description: 'Recovery is training too', icon: '😴' },
        { day: 'Tue', dayIndex: 1, type: 'cycling', name: 'Easy Spin', duration: 45, zone: 'Z1-2', description: 'Light recovery ride', icon: '🚴' },
        { day: 'Wed', dayIndex: 2, type: 'strength', name: 'Strength B', duration: 20, zone: null, description: 'Core focus routine', icon: '💪' },
        { day: 'Thu', dayIndex: 3, type: 'endurance', name: 'Endurance', duration: 60, zone: 'Z2', description: 'Easy flat route', icon: '🚴' },
        { day: 'Fri', dayIndex: 4, type: 'rest', name: 'Rest Day', duration: 0, zone: null, description: 'Full rest', icon: '😴' },
        { day: 'Sat', dayIndex: 5, type: 'endurance', name: 'Moderate Ride', duration: 90, zone: 'Z2', description: 'Relaxed pace', icon: '🚴' },
        { day: 'Sun', dayIndex: 6, type: 'rest', name: 'Rest Day', duration: 0, zone: null, description: 'Recover and prepare', icon: '😴' },
      ],
    }
  }

  // Standard training week
  const longRideDuration = isBuiltWeek ? 240 : weekNumber <= 4 ? 120 : 180
  const intervalReps = isBuiltWeek ? 5 : weekNumber <= 4 ? 3 : 4

  return {
    weekNumber,
    sessions: [
      { day: 'Mon', dayIndex: 0, type: 'rest', name: 'Rest Day', duration: 0, zone: null, description: 'Recovery is training too', icon: '😴' },
      { day: 'Tue', dayIndex: 1, type: 'intervals', name: 'Hill Repeats', duration: 75, zone: `Z2 + ${intervalReps}x4min Z4`, description: `${intervalReps}x4min climbs with recovery`, icon: '⛰️' },
      { day: 'Wed', dayIndex: 2, type: 'strength', name: 'Strength A', duration: 25, zone: null, description: 'Cycling-specific strength', icon: '💪' },
      { day: 'Thu', dayIndex: 3, type: 'endurance', name: 'Endurance', duration: 60, zone: 'Z2', description: 'Easy spin, flat route', icon: '🚴' },
      { day: 'Fri', dayIndex: 4, type: 'rest', name: 'Rest Day', duration: 0, zone: null, description: 'Light stretching optional', icon: '😴' },
      { day: 'Sat', dayIndex: 5, type: 'long', name: 'Long Ride', duration: longRideDuration, zone: 'Z2', description: 'Build endurance, practice nutrition', icon: '🏔️' },
      { day: 'Sun', dayIndex: 6, type: 'strength', name: 'Strength B', duration: 20, zone: null, description: 'Core focus routine', icon: '🎯' },
    ],
  }
}

// Generate all 12 weeks
export const trainingWeeks: WeekPlan[] = Array.from({ length: 12 }, (_, i) => generateWeek(i + 1))

export const getWeek = (weekNumber: number): WeekPlan | undefined => {
  return trainingWeeks.find(w => w.weekNumber === weekNumber)
}
