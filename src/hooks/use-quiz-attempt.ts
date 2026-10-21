import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCountdown, type UseCountdownReturn } from './use-countdown'
import { quizService, QuizService } from '@/services'
import { useAppStore } from '@/store'
import type { Attempt, Question, Quiz } from '@/types'

export interface UseQuizAttemptOptions {
  quizId: string
  userId?: string
  autoStart?: boolean
  service?: QuizService
}

export interface UseQuizAttemptReturn {
  quiz: Quiz | null
  attempt: Attempt | null
  currentQuestion: Question | null
  currentQuestionIndex: number
  totalQuestions: number
  selectedOptionIds: string[]
  isLoading: boolean
  isSubmitting: boolean
  isCompleted: boolean
  error: string | null
  priorResult: Attempt | null
  canRetake: boolean
  overallCountdown: UseCountdownReturn
  questionCountdown: UseCountdownReturn

  start: () => Promise<Attempt | null>
  selectOption: (optionId: string) => void
  submitAnswer: () => Promise<void>
  handleTimeout: () => Promise<void>
  completeEarly: () => Promise<Attempt | null>
}

export function useQuizAttempt({
  quizId,
  userId,
  autoStart = false,
  service = quizService,
}: UseQuizAttemptOptions): UseQuizAttemptReturn {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [priorResult, setPriorResult] = useState<Attempt | null>(null)

  const isSubmittingRef = useRef(false)

  // Determine current active user ID (prop or fallback to global store)
  const effectiveUserId = userId || useAppStore.getState().currentUser?.id

  // Load quiz metadata and check prior attempts
  useEffect(() => {
    let isCancelled = false

    const init = async () => {
      try {
        const loadedQuiz = await service.getQuizById(quizId)
        if (isCancelled) return

        if (!loadedQuiz) {
          setError(`Quiz '${quizId}' was not found or has been deleted.`)
          setIsLoading(false)
          return
        }

        setQuiz(loadedQuiz)
        useAppStore.getState().setActiveQuiz(loadedQuiz)

        let initialAttempt: Attempt | null = null

        if (effectiveUserId) {
          const userAttempts = await service.getUserAttempts(effectiveUserId)
          if (isCancelled) return

          const quizAttempts = userAttempts.filter((a) => a.quizId === quizId)

          // Check for in-progress attempt to resume
          const inProgress = quizAttempts.find((a) => a.status === 'in_progress')
          if (inProgress) {
            initialAttempt = inProgress
            setAttempt(inProgress)
            useAppStore.getState().setActiveAttempt(inProgress)

            const currentQ = loadedQuiz.questions[inProgress.currentQuestionIndex]
            if (currentQ) {
              const existingAns = inProgress.answers.find((a) => a.questionId === currentQ.id)
              if (existingAns) {
                setSelectedOptionIds(existingAns.selectedOptionIds)
              }
            }
          } else {
            // Check completed attempt for non-retakeable quiz
            const completed = quizAttempts.find((a) => a.status === 'completed')
            if (completed) {
              setPriorResult(completed)
              if (!loadedQuiz.retakesAllowed) {
                setAttempt(completed)
              }
            }
          }
        }

        // Auto-start if requested and no prior attempt exists
        if (autoStart && !initialAttempt && effectiveUserId) {
          const started = await service.startAttempt(quizId, effectiveUserId)
          if (!isCancelled) {
            setAttempt(started)
            useAppStore.getState().setActiveAttempt(started)
            useAppStore.getState().notifySync()
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load quiz.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    init()

    return () => {
      isCancelled = true
    }
  }, [quizId, effectiveUserId, service, autoStart])

  const start = useCallback(async (): Promise<Attempt | null> => {
    if (!effectiveUserId) {
      setError('Please select a user before starting the quiz.')
      return null
    }

    setIsLoading(true)
    setError(null)
    try {
      const newOrResumed = await service.startAttempt(quizId, effectiveUserId)
      setAttempt(newOrResumed)
      setSelectedOptionIds([])
      useAppStore.getState().setActiveAttempt(newOrResumed)
      useAppStore.getState().notifySync()

      if (newOrResumed.status === 'completed') {
        setPriorResult(newOrResumed)
      }

      return newOrResumed
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not start quiz attempt.'
      setError(msg)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [quizId, effectiveUserId, service])

  // Current question derivation
  const currentQuestionIndex = attempt?.currentQuestionIndex ?? 0
  const currentQuestion: Question | null = useMemo(() => {
    if (!quiz || !attempt || attempt.status !== 'in_progress') return null
    return quiz.questions[currentQuestionIndex] ?? null
  }, [quiz, attempt, currentQuestionIndex])

  const totalQuestions = quiz?.questions.length ?? 0
  const isCompleted = attempt?.status === 'completed'
  const canRetake = quiz?.retakesAllowed ?? true

  // Option selection
  const selectOption = useCallback(
    (optionId: string) => {
      if (!currentQuestion || isSubmittingRef.current || isCompleted) return

      if (currentQuestion.type === 'single') {
        setSelectedOptionIds([optionId])
      } else {
        setSelectedOptionIds((prev) =>
          prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
        )
      }
    },
    [currentQuestion, isCompleted],
  )

  // Submit Answer
  const submitAnswer = useCallback(async () => {
    if (
      !attempt ||
      !currentQuestion ||
      isSubmittingRef.current ||
      attempt.status !== 'in_progress'
    ) {
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setError(null)

    try {
      const updated = await service.submitAnswer(attempt.id, currentQuestion.id, selectedOptionIds)

      setAttempt(updated)
      useAppStore.getState().setActiveAttempt(updated)
      useAppStore.getState().notifySync()

      if (updated.status === 'completed') {
        setPriorResult(updated)
        setSelectedOptionIds([])
      } else {
        // Next question
        const nextQ = quiz?.questions[updated.currentQuestionIndex]
        if (nextQ) {
          const nextExisting = updated.answers.find((a) => a.questionId === nextQ.id)
          setSelectedOptionIds(nextExisting ? nextExisting.selectedOptionIds : [])
        } else {
          setSelectedOptionIds([])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer.')
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }, [attempt, currentQuestion, selectedOptionIds, service, quiz])

  // Handle Timeout (auto-submit current or complete)
  const handleTimeout = useCallback(async () => {
    if (!attempt || attempt.status !== 'in_progress' || isSubmittingRef.current) {
      return
    }

    if (currentQuestion) {
      // Auto-submit whatever is selected (or empty if unanswered)
      await submitAnswer()
    } else {
      // Complete attempt
      isSubmittingRef.current = true
      setIsSubmitting(true)
      try {
        const completed = await service.completeAttempt(attempt.id)
        setAttempt(completed)
        setPriorResult(completed)
        useAppStore.getState().setActiveAttempt(completed)
        useAppStore.getState().notifySync()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Timeout completion failed.')
      } finally {
        isSubmittingRef.current = false
        setIsSubmitting(false)
      }
    }
  }, [attempt, currentQuestion, submitAnswer, service])

  const completeEarly = useCallback(async (): Promise<Attempt | null> => {
    if (!attempt || attempt.status !== 'in_progress') return null

    isSubmittingRef.current = true
    setIsSubmitting(true)
    try {
      const completed = await service.completeAttempt(attempt.id)
      setAttempt(completed)
      setPriorResult(completed)
      useAppStore.getState().setActiveAttempt(completed)
      useAppStore.getState().notifySync()
      return completed
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete attempt.')
      return null
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }, [attempt, service])

  // Question start timestamp calculation
  const questionStartTime = useMemo(() => {
    if (!attempt || attempt.status !== 'in_progress') return null
    if (attempt.currentQuestionIndex === 0 || attempt.answers.length === 0) {
      return attempt.startedAt
    }
    const lastAns = attempt.answers[attempt.answers.length - 1]
    return lastAns?.answeredAt ?? attempt.startedAt
  }, [attempt])

  // Countdowns
  const overallCountdown = useCountdown({
    startTime: attempt?.status === 'in_progress' ? attempt.startedAt : null,
    totalSeconds: quiz?.timeLimitSeconds,
    paused: isCompleted || !attempt,
    onExpire: handleTimeout,
  })

  const questionCountdown = useCountdown({
    startTime: attempt?.status === 'in_progress' ? questionStartTime : null,
    totalSeconds: quiz?.perQuestionSeconds,
    paused: isCompleted || !attempt,
    onExpire: handleTimeout,
  })

  return {
    quiz,
    attempt,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedOptionIds,
    isLoading,
    isSubmitting,
    isCompleted,
    error,
    priorResult,
    canRetake,
    overallCountdown,
    questionCountdown,
    start,
    selectOption,
    submitAnswer,
    handleTimeout,
    completeEarly,
  }
}
