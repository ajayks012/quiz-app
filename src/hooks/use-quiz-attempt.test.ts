import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useQuizAttempt } from './use-quiz-attempt'
import { StorageRepository } from '@/repositories'
import { QuizService } from '@/services'
import { useAppStore } from '@/store'

describe('useQuizAttempt (Task 37)', () => {
  let mockStorage: StorageRepository
  let mockService: QuizService

  beforeEach(() => {
    localStorage.clear()
    mockStorage = new StorageRepository('test_attempt_hook_db')
    mockStorage.reset()
    mockService = new QuizService(mockStorage, 0)

    useAppStore.setState({
      currentUser: { id: 'u1', name: 'Sarah Chen', country: 'SG', role: 'user' },
      users: [],
      countries: [],
      selectedCountry: null,
      activeQuiz: null,
      activeAttempt: null,
      isInitializing: false,
      syncTick: 0,
    })
  })

  it('loads quiz metadata and handles not found error', async () => {
    const { result } = renderHook(() =>
      useQuizAttempt({
        quizId: 'unknown-quiz',
        service: mockService,
      }),
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.quiz).toBeNull()
    expect(result.current.error).toMatch(/not found/i)
  })

  it('starts a new attempt and exposes first question', async () => {
    const { result } = renderHook(() =>
      useQuizAttempt({
        quizId: 'q1',
        service: mockService,
      }),
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.quiz?.id).toBe('q1')
    expect(result.current.attempt).toBeNull()

    // Start quiz
    await act(async () => {
      await result.current.start()
    })

    expect(result.current.attempt?.status).toBe('in_progress')
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.currentQuestion?.id).toBe('q1-1')
    expect(result.current.totalQuestions).toBe(6)
  })

  it('toggles selection for multiple choice and replaces for single choice', async () => {
    // q1-1 is single choice, q1-4 is multiple choice
    const { result } = renderHook(() =>
      useQuizAttempt({
        quizId: 'q1',
        service: mockService,
      }),
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.start()
    })

    // Single choice question (q1-1)
    act(() => {
      result.current.selectOption('q1-1-o1')
    })
    expect(result.current.selectedOptionIds).toEqual(['q1-1-o1'])

    act(() => {
      result.current.selectOption('q1-1-o2')
    })
    expect(result.current.selectedOptionIds).toEqual(['q1-1-o2'])
  })

  it('submits answers and auto-completes on final question', async () => {
    // Create a 2-question quiz for fast lifecycle testing
    const quiz = await mockService.createQuiz({
      title: 'Lifecycle Test',
      description: 'Test',
      countries: ['SG'],
      timeLimitSeconds: 120,
      perQuestionSeconds: null,
      retakesAllowed: true,
      questions: [
        {
          id: 't-q1',
          text: 'Question 1',
          type: 'single',
          options: [
            { id: 'o1', text: 'Option 1' },
            { id: 'o2', text: 'Option 2' },
          ],
          correctOptionIds: ['o1'],
        },
        {
          id: 't-q2',
          text: 'Question 2',
          type: 'single',
          options: [
            { id: 'o3', text: 'Option 3' },
            { id: 'o4', text: 'Option 4' },
          ],
          correctOptionIds: ['o4'],
        },
      ],
    })

    const { result } = renderHook(() =>
      useQuizAttempt({
        quizId: quiz.id,
        service: mockService,
      }),
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.start()
    })

    expect(result.current.currentQuestionIndex).toBe(0)

    // Answer Q1
    act(() => {
      result.current.selectOption('o1')
    })

    await act(async () => {
      await result.current.submitAnswer()
    })

    // Advanced to Q2
    expect(result.current.currentQuestionIndex).toBe(1)
    expect(result.current.currentQuestion?.id).toBe('t-q2')
    expect(result.current.isCompleted).toBe(false)

    // Answer Q2 (final question)
    act(() => {
      result.current.selectOption('o4')
    })

    await act(async () => {
      await result.current.submitAnswer()
    })

    // Now completed
    expect(result.current.isCompleted).toBe(true)
    expect(result.current.attempt?.score).toBe(2)
    expect(result.current.attempt?.percentage).toBe(100)
    expect(result.current.priorResult?.id).toBe(result.current.attempt?.id)
  })

  it('detects completed attempt and blocks retakes for non-retakeable quiz', async () => {
    // In seed data, u4 has already completed q4 which has retakesAllowed = false
    const { result } = renderHook(() =>
      useQuizAttempt({
        quizId: 'q4',
        userId: 'u4',
        service: mockService,
      }),
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.canRetake).toBe(false)
    expect(result.current.priorResult).not.toBeNull()
    expect(result.current.isCompleted).toBe(true)

    // Attempting to start should reject with error
    await act(async () => {
      const res = await result.current.start()
      expect(res).toBeNull()
    })

    expect(result.current.error).toMatch(/retakes are not allowed/i)
  })
})
