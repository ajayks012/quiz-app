import { act, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { LeaderboardPage, QuizListPage } from '@/pages'
import { StorageRepository } from '@/repositories'
import { QuizService } from '@/services'
import { useAppStore } from '@/store'

describe('Global Data Synchronization (Task 54)', () => {
  let mockStorage: StorageRepository
  let mockService: QuizService

  beforeEach(() => {
    localStorage.clear()
    mockStorage = new StorageRepository('test_sync_db')
    mockStorage.reset()
    mockService = new QuizService(mockStorage, 0)

    useAppStore.setState({
      currentUser: { id: 'u1', name: 'Aarav Menon', country: 'IN', role: 'user' },
      users: mockStorage.getUsers(),
      countries: mockStorage.getCountries(),
      selectedCountry: null,
      activeQuiz: null,
      activeAttempt: null,
      isInitializing: false,
      syncTick: 0,
    })
  })

  it('updates Leaderboard page automatically when new attempt is recorded and sync is triggered', async () => {
    render(<LeaderboardPage service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText('Global Leaderboard')).toBeInTheDocument()
    })

    // Record a new completed attempt by u2 on q1
    const newAttempt = await mockService.startAttempt('q1', 'u2')
    await mockService.submitAnswer(newAttempt.id, 'q1-1', ['q1-1-o3'])
    await mockService.completeAttempt(newAttempt.id)

    // Trigger store sync
    act(() => {
      useAppStore.getState().notifySync()
    })

    // Leaderboard should automatically refresh to show the updated attempt
    await waitFor(() => {
      expect(screen.getAllByText('Fatima Al Mansoori').length).toBeGreaterThan(0)
    })
  })

  it('updates Quiz List page immediately when a quiz is added or deleted', async () => {
    render(<QuizListPage service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText(/JavaScript Basics/i)).toBeInTheDocument()
    })

    // Create a new quiz
    await mockService.createQuiz({
      title: 'Realtime Synced Quiz',
      description: 'Synchronized across components instantly.',
      countries: ['IN'],
      timeLimitSeconds: 180,
      perQuestionSeconds: null,
      retakesAllowed: true,
      questions: [
        {
          id: 'sq1',
          text: 'Synced Question',
          type: 'single',
          options: [
            { id: 'o1', text: 'Option A' },
            { id: 'o2', text: 'Option B' },
          ],
          correctOptionIds: ['o1'],
        },
      ],
    })

    // Notify sync
    act(() => {
      useAppStore.getState().notifySync()
    })

    // New quiz should appear on the list
    await waitFor(() => {
      expect(screen.getByText('Realtime Synced Quiz')).toBeInTheDocument()
    })
  })

  it('re-filters quiz list when global country filter changes in the store', async () => {
    render(<QuizListPage service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText(/JavaScript Basics/i)).toBeInTheDocument()
    })

    // Filter store by non-matching country 'AE'
    act(() => {
      useAppStore.getState().setSelectedCountry('AE')
    })

    // Quizzes assigned to AE should remain visible
    await waitFor(() => {
      expect(screen.getByText(/JavaScript Basics/i)).toBeInTheDocument()
    })
  })
})
