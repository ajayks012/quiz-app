import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QuizListPage } from './quiz-list-page'
import { StorageRepository } from '@/repositories'
import { QuizService } from '@/services'
import { useAppStore } from '@/store'

describe('QuizListPage (Task 39)', () => {
  let mockStorage: StorageRepository
  let mockService: QuizService

  beforeEach(async () => {
    localStorage.clear()
    mockStorage = new StorageRepository('test_quiz_list_page_db')
    mockStorage.reset()
    mockService = new QuizService(mockStorage, 0)

    useAppStore.setState({
      currentUser: { id: 'u1', name: 'Sarah Chen', country: 'SG', role: 'user' },
      users: [
        { id: 'u1', name: 'Sarah Chen', country: 'SG', role: 'user' },
        { id: 'u2', name: 'Alex Rivera', country: 'US', role: 'user' },
        { id: 'u4', name: 'Priya Sharma', country: 'IN', role: 'user' },
      ],
      countries: [
        { code: 'SG', name: 'Singapore' },
        { code: 'US', name: 'United States' },
        { code: 'IN', name: 'India' },
      ],
      selectedCountry: null,
      activeQuiz: null,
      activeAttempt: null,
      isInitializing: false,
      syncTick: 0,
    })
  })

  it('renders quizzes and filters by search text', async () => {
    render(<QuizListPage service={mockService} />)

    // Wait for quizzes to load from seed
    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })

    const searchInput = screen.getByLabelText(/search quizzes/i)
    fireEvent.change(searchInput, { target: { value: 'React' } })

    await waitFor(() => {
      expect(screen.getByText('React Fundamentals')).toBeInTheDocument()
      expect(screen.queryByText('JavaScript Basics')).not.toBeInTheDocument()
    })
  })

  it('displays empty state when no quizzes match search and clears filters', async () => {
    render(<QuizListPage service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })

    const searchInput = screen.getByLabelText(/search quizzes/i)
    fireEvent.change(searchInput, { target: { value: 'nonexistent-query-xyz' } })

    await waitFor(() => {
      expect(screen.getByText('No Quizzes Found')).toBeInTheDocument()
    })

    const clearButton = screen.getByRole('button', { name: /clear filters/i })
    fireEvent.click(clearButton)

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })
  })

  it('navigates to quiz attempt when Start Quiz is clicked', async () => {
    const onNavigateQuiz = vi.fn()
    render(<QuizListPage service={mockService} onNavigateQuiz={onNavigateQuiz} />)

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })

    const startButtons = screen.getAllByRole('button', { name: /start quiz/i })
    expect(startButtons.length).toBeGreaterThan(0)
    fireEvent.click(startButtons[0])

    expect(onNavigateQuiz).toHaveBeenCalledWith('q4')
  })

  it('navigates to results for completed non-retakeable quiz', async () => {
    // Switch to user u4 who has completed non-retakeable quiz q4 in seed data
    useAppStore.setState({
      currentUser: { id: 'u4', name: 'Priya Sharma', country: 'IN', role: 'user' },
    })

    const onNavigateResults = vi.fn()
    render(<QuizListPage service={mockService} onViewResults={onNavigateResults} />)

    await waitFor(() => {
      expect(screen.getByText('Kerala Culture and History')).toBeInTheDocument()
    })

    const viewResultBtn = screen.getByRole('button', { name: /view prior results/i })
    expect(viewResultBtn).toBeInTheDocument()

    fireEvent.click(viewResultBtn)
    expect(onNavigateResults).toHaveBeenCalledWith('q4')
  })

  it('resets data when Reset Data button is clicked', async () => {
    render(<QuizListPage service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })

    const resetBtn = screen.getByRole('button', { name: /reset data/i })
    fireEvent.click(resetBtn)

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })
  })
})
