import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QuizForm } from './quiz-form'
import { useAppStore } from '@/store'
import type { Quiz } from '@/types'

describe('QuizForm & Unsaved Changes Protection (Task 41 & 44)', () => {
  const sampleQuiz: Quiz = {
    id: 'q-sample',
    title: 'CSS Architecture',
    description: 'Modern CSS patterns and design tokens',
    countries: ['US', 'SG'],
    timeLimitSeconds: 60,
    perQuestionSeconds: null,
    retakesAllowed: true,
    questions: [
      {
        id: 'q1',
        text: 'What is BEM?',
        type: 'single',
        options: [
          { id: 'o1', text: 'Block Element Modifier' },
          { id: 'o2', text: 'Browser Engine Module' },
        ],
        correctOptionIds: ['o1'],
      },
    ],
  }

  beforeEach(() => {
    useAppStore.setState({
      countries: [
        { code: 'US', name: 'United States' },
        { code: 'SG', name: 'Singapore' },
      ],
    })
  })

  it('renders prefilled fields when editing an existing quiz', () => {
    render(<QuizForm initialData={sampleQuiz} onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByDisplayValue('CSS Architecture')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Modern CSS patterns and design tokens')).toBeInTheDocument()
    expect(screen.getByDisplayValue('What is BEM?')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Block Element Modifier')).toBeInTheDocument()
  })

  it('cancels directly without dialog when form is pristine', () => {
    const onCancel = vi.fn()
    render(<QuizForm initialData={sampleQuiz} onSubmit={vi.fn()} onCancel={onCancel} />)

    const cancelBtn = screen.getByRole('button', { name: /^cancel$/i })
    fireEvent.click(cancelBtn)

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(screen.queryByText(/discard unsaved changes\?/i)).not.toBeInTheDocument()
  })

  it('prompts confirmation when canceling with unsaved changes', async () => {
    const onCancel = vi.fn()
    render(<QuizForm initialData={sampleQuiz} onSubmit={vi.fn()} onCancel={onCancel} />)

    const titleInput = screen.getByDisplayValue('CSS Architecture')
    fireEvent.change(titleInput, { target: { value: 'Modified CSS Architecture' } })

    const cancelBtn = screen.getByRole('button', { name: /^cancel$/i })
    fireEvent.click(cancelBtn)

    // Warning dialog should appear
    await waitFor(() => {
      expect(screen.getByText(/discard unsaved changes\?/i)).toBeInTheDocument()
    })
    expect(onCancel).not.toHaveBeenCalled()

    // Confirm discard
    const discardBtn = screen.getByRole('button', { name: /discard changes/i })
    fireEvent.click(discardBtn)

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('submits valid form data', async () => {
    const onSubmit = vi.fn()
    render(<QuizForm initialData={sampleQuiz} onSubmit={onSubmit} onCancel={vi.fn()} />)

    const submitBtn = screen.getByRole('button', { name: /save changes/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
  })
})
