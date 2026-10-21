import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './index'

describe('Card Components', () => {
  it('renders a complete structured card hierarchy', () => {
    render(
      <Card data-testid="test-card">
        <CardHeader>
          <CardTitle>Quiz Overview</CardTitle>
          <CardDescription>Review quiz details before beginning</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content area</p>
        </CardContent>
        <CardFooter>
          <button type="button">Start</button>
        </CardFooter>
      </Card>,
    )

    expect(screen.getByTestId('test-card')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /quiz overview/i })).toBeInTheDocument()
    expect(screen.getByText(/review quiz details/i)).toBeInTheDocument()
    expect(screen.getByText(/main content area/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('supports elevated and interactive card variants', () => {
    const { rerender } = render(<Card data-testid="card" variant="elevated" />)
    expect(screen.getByTestId('card').className).toContain('shadow-md')

    rerender(<Card data-testid="card" variant="interactive" />)
    expect(screen.getByTestId('card').className).toContain('cursor-pointer')
  })
})
