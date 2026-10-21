import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { LeaderboardPage } from './leaderboard-page'
import { StorageRepository } from '@/repositories'
import { QuizService } from '@/services'
import { useAppStore } from '@/store'

describe('LeaderboardPage (Task 53)', () => {
  let mockStorage: StorageRepository
  let mockService: QuizService

  beforeEach(() => {
    localStorage.clear()
    mockStorage = new StorageRepository('test_leaderboard_page_db')
    mockStorage.reset()
    mockService = new QuizService(mockStorage, 0)

    useAppStore.setState({
      currentUser: { id: 'u1', name: 'Aarav Menon', country: 'IN', role: 'user' },
      users: [],
      countries: [],
      selectedCountry: null,
      activeQuiz: null,
      activeAttempt: null,
      isInitializing: false,
      syncTick: 0,
    })
  })

  it('renders leaderboard table with rankings and participants from seed data', async () => {
    render(<LeaderboardPage service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText('Global Leaderboard')).toBeInTheDocument()
      expect(screen.getAllByText('Aarav Menon').length).toBeGreaterThan(0)
    })

    // Current user u1 should have the 'You' badge
    expect(screen.getAllByText('You').length).toBeGreaterThan(0)
  })

  it('filters leaderboard by country', async () => {
    render(<LeaderboardPage service={mockService} initialCountry="AE" />)

    await waitFor(() => {
      expect(screen.getByText('Global Leaderboard')).toBeInTheDocument()
      expect(screen.getAllByText('Fatima Al Mansoori').length).toBeGreaterThan(0)
      expect(screen.queryByText('Oliver Smith')).not.toBeInTheDocument()
    })
  })

  it('filters leaderboard by specific quiz', async () => {
    render(<LeaderboardPage service={mockService} initialQuizId="q1" />)

    await waitFor(() => {
      expect(screen.getByText('Global Leaderboard')).toBeInTheDocument()
      expect(screen.getAllByText(/JavaScript Basics/i).length).toBeGreaterThan(0)
    })
  })

  it('displays empty state when filter criteria produce no results', async () => {
    render(<LeaderboardPage service={mockService} initialQuizId="non-existent-quiz" />)

    await waitFor(() => {
      expect(screen.getByText(/no scores found/i)).toBeInTheDocument()
    })
  })
})
