import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QuizTakePage } from './quiz-take-page'
import { StorageRepository } from '@/repositories'
import { QuizService } from '@/services'
import { useAppStore } from '@/store'

describe('QuizTakePage (Phase 12 Tasks 45–51)', () => {
  let mockStorage: StorageRepository
  let mockService: QuizService

  beforeEach(() => {
    localStorage.clear()
    mockStorage = new StorageRepository('test_take_page_db')
    mockStorage.reset()
    mockService = new QuizService(mockStorage, 0)

    useAppStore.setState({
      currentUser: { id: 'u_fresh', name: 'Fresh User', country: 'IN', role: 'user' },
      users: [],
      countries: [],
      selectedCountry: null,
      activeQuiz: null,
      activeAttempt: null,
      isInitializing: false,
      syncTick: 0,
    })
  })

  it('renders start screen with quiz details and starts the quiz on click', async () => {
    render(<QuizTakePage quizId="q1" service={mockService} />)

    // Wait for quiz to load
    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /start quiz/i })).toBeInTheDocument()

    // Click Start Quiz
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))

    // Should transition to Question Screen (Question 1)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Question 1/i })).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          level: 3,
          name: /Which keyword declares a block-scoped variable/i,
        }),
      ).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument()
  })

  it('allows answering questions and completing a quiz attempt', async () => {
    const onComplete = vi.fn()

    // Create a 2-question quiz for quick completion
    const miniQuiz = await mockService.createQuiz({
      title: 'Mini Quiz',
      description: 'Quick two-question assessment.',
      countries: ['IN'],
      timeLimitSeconds: 120,
      perQuestionSeconds: null,
      retakesAllowed: true,
      questions: [
        {
          id: 'mq1',
          text: 'What is 2 + 2?',
          type: 'single',
          options: [
            { id: 'mq1-a', text: 'Three' },
            { id: 'mq1-b', text: 'Four' },
          ],
          correctOptionIds: ['mq1-b'],
        },
        {
          id: 'mq2',
          text: 'Select even numbers',
          type: 'multiple',
          options: [
            { id: 'mq2-a', text: 'Two' },
            { id: 'mq2-b', text: 'Four' },
            { id: 'mq2-c', text: 'Five' },
          ],
          correctOptionIds: ['mq2-a', 'mq2-b'],
        },
      ],
    })

    render(<QuizTakePage quizId={miniQuiz.id} service={mockService} onComplete={onComplete} />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start quiz/i })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Question 1/i })).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { level: 3, name: /What is 2 \+ 2\?/i }),
      ).toBeInTheDocument()
    })

    // Select 'Four' for Q1
    fireEvent.click(screen.getByText('Four'))

    // Advance to Question 2
    fireEvent.click(screen.getByRole('button', { name: /next question/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Question 2/i })).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { level: 3, name: /Select even numbers/i }),
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /submit & finish/i })).toBeInTheDocument()
    })

    // Select 'Two' and 'Four' for Q2
    fireEvent.click(screen.getByText('Two'))
    fireEvent.click(screen.getByText('Four'))

    // Finish Quiz
    fireEvent.click(screen.getByRole('button', { name: /submit & finish/i }))

    // Should complete and trigger onComplete callback
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(miniQuiz.id)
    })
  })

  it('resumes directly to the current question if an in-progress attempt exists (Task 49)', async () => {
    // Start attempt in storage beforehand
    const attempt = await mockService.startAttempt('q1', 'u_fresh')
    // Answer first question so it's on question index 1
    await mockService.submitAnswer(attempt.id, 'q1-1', ['q1-1-o3'])

    render(<QuizTakePage quizId="q1" service={mockService} />)

    // Should load the resumed state directly on Question 2
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Question 2/i })).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { level: 3, name: /What does typeof null return\?/i }),
      ).toBeInTheDocument()
    })
  })

  it('renders not found alert when invalid quiz ID is provided', async () => {
    render(<QuizTakePage quizId="invalid-quiz-id" service={mockService} />)

    await waitFor(() => {
      expect(screen.getByText(/not found or has been deleted/i)).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /back to quizzes/i })).toBeInTheDocument()
  })
})
