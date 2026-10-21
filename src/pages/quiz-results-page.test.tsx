import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QuizResultsPage } from './quiz-results-page'
import { StorageRepository } from '@/repositories'
import { QuizService } from '@/services'
import { useAppStore } from '@/store'

describe('QuizResultsPage (Task 52)', () => {
  let mockStorage: StorageRepository
  let mockService: QuizService

  beforeEach(() => {
    localStorage.clear()
    mockStorage = new StorageRepository('test_results_page_db')
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

  it('renders completed attempt statistics and score for user u1 on quiz q1', async () => {
    render(<QuizResultsPage quizId="q1" service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics Results')).toBeInTheDocument()
    })

    // User u1 completed q1 with score 5 in seed data
    expect(screen.getByText(/5 \/ 6/i)).toBeInTheDocument()
    expect(screen.getByText(/Detailed Question Review/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /view leaderboard/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retake quiz/i })).toBeInTheDocument()
  })

  it('triggers retake and navigation callbacks on button click', async () => {
    const onRetake = vi.fn()
    const onNavigateLeaderboard = vi.fn()
    const onNavigateHome = vi.fn()

    render(
      <QuizResultsPage
        quizId="q1"
        service={mockService}
        onRetake={onRetake}
        onNavigateLeaderboard={onNavigateLeaderboard}
        onNavigateHome={onNavigateHome}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics Results')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /retake quiz/i }))
    expect(onRetake).toHaveBeenCalledWith('q1')

    fireEvent.click(screen.getByRole('button', { name: /view leaderboard/i }))
    expect(onNavigateLeaderboard).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: /back to catalog/i }))
    expect(onNavigateHome).toHaveBeenCalledTimes(1)
  })

  it('displays empty state if user has no completed attempts for the quiz', async () => {
    // Switch to user with no attempts on q1
    useAppStore.setState({
      currentUser: { id: 'u_none', name: 'No Attempts', country: 'IN', role: 'user' },
    })

    render(<QuizResultsPage quizId="q1" service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText(/no completed attempts found/i)).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /take quiz now/i })).toBeInTheDocument()
  })

  it('renders error notice if quiz is not found', async () => {
    render(<QuizResultsPage quizId="nonexistent" service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText(/quiz 'nonexistent' was not found/i)).toBeInTheDocument()
    })
  })
})
