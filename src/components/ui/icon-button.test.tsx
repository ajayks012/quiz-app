import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconButton } from './index'

describe('IconButton Component', () => {
  it('renders button with accessible label', () => {
    render(<IconButton aria-label="Settings">⚙</IconButton>)
    const button = screen.getByRole('button', { name: /settings/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Settings')
  })

  it('supports circle shape and size variants', () => {
    render(
      <IconButton aria-label="Close" shape="circle" size="sm">
        ✕
      </IconButton>,
    )
    const button = screen.getByRole('button', { name: /close/i })
    expect(button.className).toContain('rounded-full')
    expect(button.className).toContain('w-8 h-8')
  })

  it('triggers click when enabled and prevents click when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    const { rerender } = render(
      <IconButton aria-label="Edit" onClick={handleClick}>
        ✎
      </IconButton>,
    )

    await user.click(screen.getByRole('button', { name: /edit/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)

    rerender(
      <IconButton aria-label="Edit" disabled onClick={handleClick}>
        ✎
      </IconButton>,
    )
    await user.click(screen.getByRole('button', { name: /edit/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders loading spinner and sets aria-busy', () => {
    render(
      <IconButton aria-label="Sync" loading>
        ↻
      </IconButton>,
    )
    const button = screen.getByRole('button', { name: /sync/i })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button.querySelector('.animate-spin')).toBeInTheDocument()
  })
})
