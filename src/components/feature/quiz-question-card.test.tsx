import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QuizQuestionCard } from './quiz-question-card'
import type { Question } from '@/types'

describe('QuizQuestionCard (Tasks 46, 47, 48, 50, 51)', () => {
  const singleQuestion: Question = {
    id: 'q1',
    text: 'What keyword defines an immutable variable in modern JS?',
    type: 'single',
    options: [
      { id: 'opt-var', text: 'var' },
      { id: 'opt-let', text: 'let' },
      { id: 'opt-const', text: 'const' },
    ],
    correctOptionIds: ['opt-const'],
  }

  const multiQuestion: Question = {
    id: 'q2',
    text: 'Which of the following are JavaScript primitives?',
    type: 'multiple',
    options: [
      { id: 'opt-str', text: 'string' },
      { id: 'opt-bool', text: 'boolean' },
      { id: 'opt-arr', text: 'Array' },
    ],
    correctOptionIds: ['opt-str', 'opt-bool'],
  }

  it('renders question, single-choice options, progress, and timers', () => {
    render(
      <QuizQuestionCard
        quizTitle="Modern JS Fundamentals"
        question={singleQuestion}
        questionIndex={0}
        totalQuestions={3}
        selectedOptionIds={[]}
        isSubmitting={false}
        overallSecondsLeft={180}
        overallTotalSeconds={300}
        questionSecondsLeft={25}
        questionTotalSeconds={30}
        onSelectOption={vi.fn()}
        onSubmitAnswer={vi.fn()}
        onLeaveQuiz={vi.fn()}
      />,
    )

    expect(screen.getByText('Modern JS Fundamentals')).toBeInTheDocument()
    expect(screen.getByText('Question 1')).toBeInTheDocument()
    expect(screen.getByText('of 3')).toBeInTheDocument()
    expect(screen.getByText('Single Choice')).toBeInTheDocument()
    expect(
      screen.getByText('What keyword defines an immutable variable in modern JS?'),
    ).toBeInTheDocument()
    expect(screen.getByText('const')).toBeInTheDocument()
    expect(screen.getByText(/Total: 03:00/)).toBeInTheDocument()
    expect(screen.getByText(/Q: 00:25/)).toBeInTheDocument()
  })

  it('selects option on click', () => {
    const onSelectOption = vi.fn()

    render(
      <QuizQuestionCard
        quizTitle="Modern JS Fundamentals"
        question={singleQuestion}
        questionIndex={0}
        totalQuestions={3}
        selectedOptionIds={['opt-const']}
        isSubmitting={false}
        overallSecondsLeft={180}
        overallTotalSeconds={300}
        questionSecondsLeft={null}
        questionTotalSeconds={null}
        onSelectOption={onSelectOption}
        onSubmitAnswer={vi.fn()}
        onLeaveQuiz={vi.fn()}
      />,
    )

    const constOption = screen.getByText('const')
    fireEvent.click(constOption)

    expect(onSelectOption).toHaveBeenCalledWith('opt-const')
  })

  it('handles multiple-choice questions with checkbox aria roles', () => {
    render(
      <QuizQuestionCard
        quizTitle="Modern JS Fundamentals"
        question={multiQuestion}
        questionIndex={1}
        totalQuestions={3}
        selectedOptionIds={['opt-str']}
        isSubmitting={false}
        overallSecondsLeft={120}
        overallTotalSeconds={300}
        questionSecondsLeft={null}
        questionTotalSeconds={null}
        onSelectOption={vi.fn()}
        onSubmitAnswer={vi.fn()}
        onLeaveQuiz={vi.fn()}
      />,
    )

    expect(screen.getByText('Multiple Choice')).toBeInTheDocument()
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(3)
    expect(checkboxes[0]).toHaveAttribute('aria-checked', 'true')
    expect(checkboxes[1]).toHaveAttribute('aria-checked', 'false')
  })

  it('submits answer on button click and displays loading state (Task 48)', () => {
    const onSubmitAnswer = vi.fn()

    const { rerender } = render(
      <QuizQuestionCard
        quizTitle="Modern JS Fundamentals"
        question={singleQuestion}
        questionIndex={0}
        totalQuestions={3}
        selectedOptionIds={['opt-const']}
        isSubmitting={false}
        overallSecondsLeft={180}
        overallTotalSeconds={300}
        questionSecondsLeft={null}
        questionTotalSeconds={null}
        onSelectOption={vi.fn()}
        onSubmitAnswer={onSubmitAnswer}
        onLeaveQuiz={vi.fn()}
      />,
    )

    const nextBtn = screen.getByRole('button', { name: /next question/i })
    fireEvent.click(nextBtn)
    expect(onSubmitAnswer).toHaveBeenCalledTimes(1)

    // Re-render in submitting state -> button disabled
    rerender(
      <QuizQuestionCard
        quizTitle="Modern JS Fundamentals"
        question={singleQuestion}
        questionIndex={0}
        totalQuestions={3}
        selectedOptionIds={['opt-const']}
        isSubmitting={true}
        overallSecondsLeft={180}
        overallTotalSeconds={300}
        questionSecondsLeft={null}
        questionTotalSeconds={null}
        onSelectOption={vi.fn()}
        onSubmitAnswer={onSubmitAnswer}
        onLeaveQuiz={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /next question/i })).toBeDisabled()
  })

  it('supports keyboard navigation: 1-9 to select options and Enter to submit (Task 50)', () => {
    const onSelectOption = vi.fn()
    const onSubmitAnswer = vi.fn()

    render(
      <QuizQuestionCard
        quizTitle="Modern JS Fundamentals"
        question={singleQuestion}
        questionIndex={0}
        totalQuestions={3}
        selectedOptionIds={[]}
        isSubmitting={false}
        overallSecondsLeft={180}
        overallTotalSeconds={300}
        questionSecondsLeft={null}
        questionTotalSeconds={null}
        onSelectOption={onSelectOption}
        onSubmitAnswer={onSubmitAnswer}
        onLeaveQuiz={vi.fn()}
      />,
    )

    // Press '3' -> selects third option ('opt-const')
    fireEvent.keyDown(window, { key: '3' })
    expect(onSelectOption).toHaveBeenCalledWith('opt-const')

    // Press '1' -> selects first option ('opt-var')
    fireEvent.keyDown(window, { key: '1' })
    expect(onSelectOption).toHaveBeenCalledWith('opt-var')

    // Press 'Enter' -> triggers submitAnswer
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(onSubmitAnswer).toHaveBeenCalledTimes(1)
  })

  it('displays Submit & Finish on the last question', () => {
    render(
      <QuizQuestionCard
        quizTitle="Modern JS Fundamentals"
        question={singleQuestion}
        questionIndex={2}
        totalQuestions={3}
        selectedOptionIds={['opt-const']}
        isSubmitting={false}
        overallSecondsLeft={180}
        overallTotalSeconds={300}
        questionSecondsLeft={null}
        questionTotalSeconds={null}
        onSelectOption={vi.fn()}
        onSubmitAnswer={vi.fn()}
        onLeaveQuiz={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /submit & finish/i })).toBeInTheDocument()
  })
})
