import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from './index'

describe('EmptyState Component', () => {
  it('renders title, description, and action button', () => {
    render(
      <EmptyState
        title="No Quizzes Found"
        description="Try adjusting your search criteria"
        action={<button type="button">Create Quiz</button>}
      />,
    )

    expect(screen.getByText('No Quizzes Found')).toBeInTheDocument()
    expect(screen.getByText(/adjusting your search/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create quiz/i })).toBeInTheDocument()
  })
})
