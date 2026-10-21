import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QuizCard } from './quiz-card'
import type { Attempt, Quiz } from '@/types'

describe('QuizCard Component', () => {
  const sampleQuiz: Quiz = {
    id: 'sample-q',
    title: 'TypeScript Masterclass',
    description: 'Advanced types and generics',
    countries: ['US', 'IN'],
    timeLimitSeconds: 180,
    perQuestionSeconds: null,
    retakesAllowed: true,
    questions: [
      {
        id: 'sq-1',
        text: 'What is unknown?',
        type: 'single',
        options: [
          { id: 'o1', text: 'Top type' },
          { id: 'o2', text: 'Bottom type' },
        ],
        correctOptionIds: ['o1'],
      },
    ],
  }

  it('renders quiz details, timing, questions, and countries', () => {
    render(<QuizCard quiz={sampleQuiz} />)

    expect(screen.getByText('TypeScript Masterclass')).toBeInTheDocument()
    expect(screen.getByText('Advanced types and generics')).toBeInTheDocument()
    expect(screen.getByText('1 Qs')).toBeInTheDocument()
    expect(screen.getByText('03:00 total')).toBeInTheDocument()
    expect(screen.getByText('US')).toBeInTheDocument()
    expect(screen.getByText('IN')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start quiz/i })).toBeInTheDocument()
  })

  it('displays In Progress badge and Resume Quiz button for in-progress attempt', () => {
    const inProgressAttempt: Attempt = {
      id: 'att-1',
      quizId: 'sample-q',
      userId: 'u1',
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      currentQuestionIndex: 0,
      answers: [],
      completedAt: null,
      score: null,
      totalQuestions: 1,
      percentage: null,
      timeTakenSeconds: null,
    }

    const onSelect = vi.fn()
    render(<QuizCard quiz={sampleQuiz} userAttempts={[inProgressAttempt]} onSelect={onSelect} />)

    expect(screen.getByText('In Progress')).toBeInTheDocument()
    const resumeBtn = screen.getByRole('button', { name: /resume quiz/i })
    expect(resumeBtn).toBeInTheDocument()

    fireEvent.click(resumeBtn)
    expect(onSelect).toHaveBeenCalledWith('sample-q')
  })

  it('displays Completed badge with best score and Retake button when retakes allowed', () => {
    const completedAttempt: Attempt = {
      id: 'att-2',
      quizId: 'sample-q',
      userId: 'u1',
      status: 'completed',
      startedAt: new Date().toISOString(),
      currentQuestionIndex: 1,
      answers: [],
      completedAt: new Date().toISOString(),
      score: 1,
      totalQuestions: 1,
      percentage: 100,
      timeTakenSeconds: 45,
    }

    render(<QuizCard quiz={sampleQuiz} userAttempts={[completedAttempt]} />)

    expect(screen.getByText('Best: 100%')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retake quiz/i })).toBeInTheDocument()
  })

  it('displays View Prior Results button when retakes are forbidden', () => {
    const nonRetakeQuiz: Quiz = {
      ...sampleQuiz,
      retakesAllowed: false,
    }

    const completedAttempt: Attempt = {
      id: 'att-3',
      quizId: 'sample-q',
      userId: 'u1',
      status: 'completed',
      startedAt: new Date().toISOString(),
      currentQuestionIndex: 1,
      answers: [],
      completedAt: new Date().toISOString(),
      score: 1,
      totalQuestions: 1,
      percentage: 100,
      timeTakenSeconds: 30,
    }

    const onViewResults = vi.fn()
    render(
      <QuizCard
        quiz={nonRetakeQuiz}
        userAttempts={[completedAttempt]}
        onViewResults={onViewResults}
      />,
    )

    expect(screen.getByText('1 attempt only')).toBeInTheDocument()
    const viewBtn = screen.getByRole('button', { name: /view prior results/i })
    expect(viewBtn).toBeInTheDocument()

    fireEvent.click(viewBtn)
    expect(onViewResults).toHaveBeenCalledWith('sample-q')
  })
})
