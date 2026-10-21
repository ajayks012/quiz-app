import { create } from 'zustand'
import { quizService, QuizService } from '@/services'
import type { Attempt, Country, Quiz, User } from '@/types'

export interface AppState {
  currentUser: User | null
  users: User[]
  countries: Country[]
  selectedCountry: string | null
  activeQuiz: Quiz | null
  activeAttempt: Attempt | null
  isInitializing: boolean
  syncTick: number

  initialize: (service?: QuizService) => Promise<void>
  setCurrentUser: (userOrId: User | string) => void
  setSelectedCountry: (countryCode: string | null) => void
  setActiveQuiz: (quiz: Quiz | null) => void
  setActiveAttempt: (attempt: Attempt | null) => void
  notifySync: () => void
  resetData: (service?: QuizService) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: [],
  countries: [],
  selectedCountry: null,
  activeQuiz: null,
  activeAttempt: null,
  isInitializing: false,
  syncTick: 0,

  initialize: async (service = quizService) => {
    set({ isInitializing: true })
    try {
      const [users, countries] = await Promise.all([service.getUsers(), service.getCountries()])

      const current = get().currentUser
      const existingUser = current ? users.find((u) => u.id === current.id) : null
      const selectedUser = existingUser ?? users[0] ?? null

      set({
        users,
        countries,
        currentUser: selectedUser,
        isInitializing: false,
      })
    } catch {
      set({ isInitializing: false })
    }
  },

  setCurrentUser: (userOrId: User | string) => {
    if (typeof userOrId === 'string') {
      const found = get().users.find((u) => u.id === userOrId)
      if (found) {
        set({ currentUser: found })
      }
    } else {
      set({ currentUser: userOrId })
    }
  },

  setSelectedCountry: (countryCode: string | null) => {
    set({ selectedCountry: countryCode })
  },

  setActiveQuiz: (quiz: Quiz | null) => {
    set({ activeQuiz: quiz })
  },

  setActiveAttempt: (attempt: Attempt | null) => {
    set({ activeAttempt: attempt })
  },

  notifySync: () => {
    set({ syncTick: get().syncTick + 1 })
  },

  resetData: async (service = quizService) => {
    set({ isInitializing: true })
    try {
      await service.resetData()
      const [users, countries] = await Promise.all([service.getUsers(), service.getCountries()])

      set({
        users,
        countries,
        currentUser: users[0] ?? null,
        selectedCountry: null,
        activeQuiz: null,
        activeAttempt: null,
        syncTick: get().syncTick + 1,
        isInitializing: false,
      })
    } catch {
      set({ isInitializing: false })
    }
  },
}))
