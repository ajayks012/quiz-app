import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { AdminDashboardPage } from './admin-dashboard-page'
import { StorageRepository } from '@/repositories'
import { QuizService } from '@/services'
import { useAppStore } from '@/store'

describe('AdminDashboardPage (Task 40-44)', () => {
  let mockStorage: StorageRepository
  let mockService: QuizService

  beforeEach(() => {
    localStorage.clear()
    mockStorage = new StorageRepository('test_admin_dashboard_db')
    mockStorage.reset()
    mockService = new QuizService(mockStorage, 0)

    useAppStore.setState({
      currentUser: { id: 'u1', name: 'Sarah Chen', country: 'SG', role: 'admin' },
      users: [{ id: 'u1', name: 'Sarah Chen', country: 'SG', role: 'admin' }],
      countries: [
        { code: 'US', name: 'United States' },
        { code: 'SG', name: 'Singapore' },
      ],
      selectedCountry: null,
      activeQuiz: null,
      activeAttempt: null,
      isInitializing: false,
      syncTick: 0,
    })
  })

  it('renders quiz admin table and filters by search', async () => {
    render(<AdminDashboardPage service={mockService} />)

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

  it('sorts quizzes by question count when column header is clicked', async () => {
    render(<AdminDashboardPage service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })

    const sortQuestionsBtn = screen.getByRole('button', { name: /questions/i })
    fireEvent.click(sortQuestionsBtn)

    await waitFor(() => {
      expect(screen.getByText('Kerala Culture and History')).toBeInTheDocument()
    })
  })

  it('opens Create Quiz modal dialog', async () => {
    render(<AdminDashboardPage service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })

    const createBtn = screen.getAllByRole('button', { name: /create quiz/i })[0]
    fireEvent.click(createBtn)

    await waitFor(() => {
      expect(screen.getByText('Create New Quiz')).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/e\.g\., JavaScript Essentials/i)).toBeInTheDocument()
    })
  })

  it('opens Edit Quiz modal when edit button is clicked', async () => {
    render(<AdminDashboardPage service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })

    const editBtn = screen.getByLabelText(/edit quiz javascript basics/i)
    fireEvent.click(editBtn)

    await waitFor(() => {
      expect(screen.getByText('Edit Quiz')).toBeInTheDocument()
      expect(screen.getByDisplayValue('JavaScript Basics')).toBeInTheDocument()
    })
  })

  it('deletes quiz after confirming in confirmation dialog', async () => {
    render(<AdminDashboardPage service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })

    const deleteBtn = screen.getByLabelText(/delete quiz javascript basics/i)
    fireEvent.click(deleteBtn)

    // Confirm dialog opens
    await waitFor(() => {
      expect(screen.getByText(/delete quiz "javascript basics"\?/i)).toBeInTheDocument()
    })

    const confirmBtn = screen.getByRole('button', { name: /^delete quiz$/i })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(screen.queryByText('JavaScript Basics')).not.toBeInTheDocument()
    })
  })

  it('switches between Quizzes and Reset tabs with mouse and keyboard', async () => {
    render(<AdminDashboardPage service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })

    const quizzesTab = screen.getByRole('tab', { name: /quizzes/i })
    const resetTab = screen.getByRole('tab', { name: /reset data/i })

    expect(quizzesTab).toHaveAttribute('aria-selected', 'true')
    expect(resetTab).toHaveAttribute('aria-selected', 'false')

    // Click Reset tab
    fireEvent.click(resetTab)
    expect(resetTab).toHaveAttribute('aria-selected', 'true')
    expect(quizzesTab).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('heading', { name: /reset application data/i })).toBeInTheDocument()
    expect(screen.queryByLabelText(/search quizzes/i)).not.toBeInTheDocument()

    // Test keyboard navigation (ArrowLeft switches back to Quizzes)
    fireEvent.keyDown(resetTab, { key: 'ArrowLeft' })
    expect(quizzesTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByLabelText(/search quizzes/i)).toBeInTheDocument()
  })

  it('opens reset confirmation dialog and resets data when confirmed', async () => {
    render(<AdminDashboardPage service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })

    // Switch to Reset Data tab
    const resetTab = screen.getByRole('tab', { name: /reset data/i })
    fireEvent.click(resetTab)

    const resetBtn = screen.getByRole('button', { name: /reset all data to seed/i })
    expect(resetBtn).toBeInTheDocument()
    fireEvent.click(resetBtn)

    // Confirm dialog opens
    await waitFor(() => {
      expect(screen.getByText(/reset all application data to seed\?/i)).toBeInTheDocument()
    })

    const confirmBtn = screen.getByRole('button', { name: /yes, reset everything/i })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })
  })
})
