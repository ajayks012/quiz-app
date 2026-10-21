import { beforeEach, describe, expect, it } from 'vitest'
import { useAppStore } from './app.store'
import { StorageRepository } from '@/repositories'
import { QuizService } from '@/services'

describe('useAppStore (Task 35)', () => {
  let mockStorage: StorageRepository
  let mockService: QuizService

  beforeEach(() => {
    localStorage.clear()
    mockStorage = new StorageRepository('test_store_db')
    mockStorage.reset()
    mockService = new QuizService(mockStorage, 0)

    // Reset store state
    useAppStore.setState({
      currentUser: null,
      users: [],
      countries: [],
      selectedCountry: null,
      activeQuiz: null,
      activeAttempt: null,
      isInitializing: false,
      syncTick: 0,
    })
  })

  it('initializes store with users, countries, and default first user', async () => {
    expect(useAppStore.getState().currentUser).toBeNull()

    await useAppStore.getState().initialize(mockService)

    const state = useAppStore.getState()
    expect(state.users.length).toBeGreaterThan(0)
    expect(state.countries.length).toBeGreaterThan(0)
    expect(state.currentUser).not.toBeNull()
    expect(state.currentUser?.id).toBe(state.users[0].id)
  })

  it('switches current user by string id or object', async () => {
    await useAppStore.getState().initialize(mockService)
    const state = useAppStore.getState()
    const targetUser = state.users[1]

    useAppStore.getState().setCurrentUser(targetUser.id)
    expect(useAppStore.getState().currentUser?.id).toBe(targetUser.id)

    const anotherUser = state.users[2]
    useAppStore.getState().setCurrentUser(anotherUser)
    expect(useAppStore.getState().currentUser?.id).toBe(anotherUser.id)
  })

  it('updates selected country filter', () => {
    expect(useAppStore.getState().selectedCountry).toBeNull()
    useAppStore.getState().setSelectedCountry('US')
    expect(useAppStore.getState().selectedCountry).toBe('US')
    useAppStore.getState().setSelectedCountry(null)
    expect(useAppStore.getState().selectedCountry).toBeNull()
  })

  it('updates active quiz and attempt', async () => {
    await useAppStore.getState().initialize(mockService)
    const quiz = await mockService.getQuizById('q1')
    expect(quiz).not.toBeNull()

    useAppStore.getState().setActiveQuiz(quiz)
    expect(useAppStore.getState().activeQuiz?.id).toBe('q1')

    const attempt = await mockService.startAttempt('q1', 'u1')
    useAppStore.getState().setActiveAttempt(attempt)
    expect(useAppStore.getState().activeAttempt?.id).toBe(attempt.id)
  })

  it('increments sync tick upon notifySync and resetData', async () => {
    expect(useAppStore.getState().syncTick).toBe(0)

    useAppStore.getState().notifySync()
    expect(useAppStore.getState().syncTick).toBe(1)

    useAppStore.getState().setSelectedCountry('IN')
    await useAppStore.getState().resetData(mockService)

    const state = useAppStore.getState()
    expect(state.syncTick).toBe(2)
    expect(state.selectedCountry).toBeNull()
    expect(state.currentUser?.id).toBe(state.users[0].id)
  })
})
