import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './index'

describe('Badge Component', () => {
  it('renders badge with text and default styling', () => {
    render(<Badge data-testid="badge">Active</Badge>)
    const badge = screen.getByTestId('badge')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('bg-indigo-50')
  })

  it('renders variants and dot indicator', () => {
    const { rerender } = render(
      <Badge data-testid="badge" variant="success" dot>
        Completed
      </Badge>,
    )
    expect(screen.getByTestId('badge').className).toContain('bg-emerald-50')

    rerender(
      <Badge data-testid="badge" variant="danger">
        Failed
      </Badge>,
    )
    expect(screen.getByTestId('badge').className).toContain('bg-rose-50')
  })
})
