import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QuizStartCard } from './quiz-start-card'
import type { Attempt, Quiz } from '@/types'

describe('QuizStartCard (Task 45)', () => {
  const mockQuiz: Quiz = {
    id: 'quiz-1',
    title: 'TypeScript Mastery',
    description: 'Test your TypeScript knowledge.',
    countries: ['US', 'SG'],
    timeLimitSeconds: 300,
    perQuestionSeconds: 30,
    retakesAllowed: true,
    questions: [
      {
        id: 'q1',
        text: 'What is a type alias?',
        type: 'single',
        options: [
          { id: 'o1', text: 'A named type definition' },
          { id: 'o2', text: 'A runtime object' },
        ],
        correctOptionIds: ['o1'],
      },
    ],
  }

  it('renders quiz title, question count, and guidelines', () => {
    render(
      <QuizStartCard
        quiz={mockQuiz}
        effectiveUserId="user-1"
        canRetake={true}
        isLoading={false}
        onStart={vi.fn()}
        onResume={vi.fn()}
        onViewResults={vi.fn()}
        onBack={vi.fn()}
      />,
    )

    expect(screen.getByText('TypeScript Mastery')).toBeInTheDocument()
    expect(screen.getByText('Test your TypeScript knowledge.')).toBeInTheDocument()
    expect(screen.getByText('1 Question')).toBeInTheDocument()
    expect(screen.getAllByText(/05:00/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Pre-Quiz Guidelines/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start quiz/i })).toBeInTheDocument()
  })

  it('disables start quiz button and displays warning when no user is selected', () => {
    render(
      <QuizStartCard
        quiz={mockQuiz}
        effectiveUserId={undefined}
        canRetake={true}
        isLoading={false}
        onStart={vi.fn()}
        onResume={vi.fn()}
        onViewResults={vi.fn()}
        onBack={vi.fn()}
      />,
    )

    expect(screen.getByText(/please select a user in the header bar/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start quiz/i })).toBeDisabled()
  })

  it('displays resume banner and button when an active attempt exists (Task 49)', () => {
    const activeAttempt: Attempt = {
      id: 'att-1',
      quizId: 'quiz-1',
      userId: 'user-1',
      status: 'in_progress',
      currentQuestionIndex: 0,
      startedAt: new Date().toISOString(),
      completedAt: null,
      answers: [],
      score: 0,
      totalQuestions: 1,
      percentage: null,
      timeTakenSeconds: null,
    }

    const onResume = vi.fn()

    render(
      <QuizStartCard
        quiz={mockQuiz}
        effectiveUserId="user-1"
        activeAttempt={activeAttempt}
        canRetake={true}
        isLoading={false}
        onStart={vi.fn()}
        onResume={onResume}
        onViewResults={vi.fn()}
        onBack={vi.fn()}
      />,
    )

    expect(screen.getByText(/in-progress attempt found/i)).toBeInTheDocument()
    const resumeBtn = screen.getByRole('button', { name: /resume quiz/i })
    expect(resumeBtn).toBeInTheDocument()

    fireEvent.click(resumeBtn)
    expect(onResume).toHaveBeenCalledTimes(1)
  })

  it('displays retake disallowed notice when user already completed and retakes are false', () => {
    const priorAttempt: Attempt = {
      id: 'att-old',
      quizId: 'quiz-1',
      userId: 'user-1',
      status: 'completed',
      currentQuestionIndex: 1,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      answers: [],
      score: 1,
      totalQuestions: 1,
      percentage: 100,
      timeTakenSeconds: 30,
    }

    const nonRetakeableQuiz = { ...mockQuiz, retakesAllowed: false }

    render(
      <QuizStartCard
        quiz={nonRetakeableQuiz}
        effectiveUserId="user-1"
        priorResult={priorAttempt}
        canRetake={false}
        isLoading={false}
        onStart={vi.fn()}
        onResume={vi.fn()}
        onViewResults={vi.fn()}
        onBack={vi.fn()}
      />,
    )

    expect(screen.getByText(/quiz already completed/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /view prior results/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /start quiz/i })).not.toBeInTheDocument()
  })

  it('displays retake button and score when retakes are allowed', () => {
    const priorAttempt: Attempt = {
      id: 'att-old',
      quizId: 'quiz-1',
      userId: 'user-1',
      status: 'completed',
      currentQuestionIndex: 1,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      answers: [],
      score: 1,
      totalQuestions: 1,
      percentage: 100,
      timeTakenSeconds: 30,
    }

    const onStart = vi.fn()

    render(
      <QuizStartCard
        quiz={mockQuiz}
        effectiveUserId="user-1"
        priorResult={priorAttempt}
        canRetake={true}
        isLoading={false}
        onStart={onStart}
        onResume={vi.fn()}
        onViewResults={vi.fn()}
        onBack={vi.fn()}
      />,
    )

    expect(screen.getByText(/previous score:/i)).toBeInTheDocument()
    const retakeBtn = screen.getByRole('button', { name: /retake quiz/i })
    expect(retakeBtn).toBeInTheDocument()

    fireEvent.click(retakeBtn)
    expect(onStart).toHaveBeenCalledTimes(1)
  })
})
