import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LeaderboardPage, QuizResultsPage, QuizTakePage } from '@/pages'
import { StorageRepository } from '@/repositories'
import { QuizService } from '@/services'
import { useAppStore } from '@/store'

describe('End-to-End Quiz Flow (Task 60)', () => {
  let mockStorage: StorageRepository
  let mockService: QuizService

  beforeEach(() => {
    localStorage.clear()
    mockStorage = new StorageRepository('test_e2e_flow_db')
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

  it('completes the full flow: start quiz, answer questions, submit, review results, and view on leaderboard', async () => {
    const handleComplete = vi.fn()

    // 1. Render Quiz Attend Page
    const { unmount } = render(
      <QuizTakePage
        quizId="q1"
        service={mockService}
        onComplete={handleComplete}
        onNavigateHome={vi.fn()}
      />,
    )

    // Verify Start Screen
    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /(start|retake) quiz/i })).toBeInTheDocument()
    })

    // Start / Retake Quiz
    fireEvent.click(screen.getByRole('button', { name: /(start|retake) quiz/i }))

    const selectAnyOption = () => {
      const option = screen.queryAllByRole('radio')[0] ?? screen.queryAllByRole('checkbox')[0]
      if (option) fireEvent.click(option)
    }

    // Attend question 1 of 6
    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 6/i)).toBeInTheDocument()
    })
    selectAnyOption()
    fireEvent.click(screen.getByRole('button', { name: /next question/i }))

    // Attend question 2
    await waitFor(() => {
      expect(screen.getByText(/Question 2 of 6/i)).toBeInTheDocument()
    })
    selectAnyOption()
    fireEvent.click(screen.getByRole('button', { name: /next question/i }))

    // Attend question 3 (multiple choice)
    await waitFor(() => {
      expect(screen.getByText(/Question 3 of 6/i)).toBeInTheDocument()
    })
    selectAnyOption()
    fireEvent.click(screen.getByRole('button', { name: /next question/i }))

    // Attend question 4
    await waitFor(() => {
      expect(screen.getByText(/Question 4 of 6/i)).toBeInTheDocument()
    })
    selectAnyOption()
    fireEvent.click(screen.getByRole('button', { name: /next question/i }))

    // Attend question 5
    await waitFor(() => {
      expect(screen.getByText(/Question 5 of 6/i)).toBeInTheDocument()
    })
    selectAnyOption()
    fireEvent.click(screen.getByRole('button', { name: /next question/i }))

    // Attend question 6 (final question)
    await waitFor(() => {
      expect(screen.getByText(/Question 6 of 6/i)).toBeInTheDocument()
    })
    selectAnyOption()

    // Submit & Finish button
    const submitBtn = screen.getByRole('button', { name: /submit & finish/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(handleComplete).toHaveBeenCalled()
    })

    const completedQuizId = handleComplete.mock.calls[0][0]
    expect(completedQuizId).toBe('q1')
    unmount()

    // 2. Render Results Page
    const { unmount: unmountResults } = render(
      <QuizResultsPage
        quizId="q1"
        service={mockService}
        onNavigateLeaderboard={vi.fn()}
        onNavigateHome={vi.fn()}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText(/JavaScript Basics Results/i)).toBeInTheDocument()
      expect(screen.getByText(/Detailed Question Review/i)).toBeInTheDocument()
    })

    unmountResults()

    // 3. Render Leaderboard Page and verify user presence
    render(<LeaderboardPage service={mockService} initialQuizId="q1" />)

    await waitFor(() => {
      expect(screen.getByText('Global Leaderboard')).toBeInTheDocument()
      expect(screen.getAllByText('Aarav Menon').length).toBeGreaterThan(0)
    })
  })
})
