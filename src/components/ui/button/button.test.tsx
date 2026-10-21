import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './index'

describe('Button Component', () => {
  it('renders with default props and text', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
    expect(button.className).toContain('bg-indigo-600')
    expect(button.className).toContain('h-9')
  })

  it('renders all variant styles correctly', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button').className).toContain('bg-slate-100')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button').className).toContain('border-slate-300')

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button').className).toContain('bg-transparent')

    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole('button').className).toContain('bg-rose-600')

    rerender(<Button variant="success">Success</Button>)
    expect(screen.getByRole('button').className).toContain('bg-emerald-600')
  })

  it('renders different sizes correctly', () => {
    const { rerender } = render(<Button size="xs">XS</Button>)
    expect(screen.getByRole('button').className).toContain('h-7')

    rerender(<Button size="sm">SM</Button>)
    expect(screen.getByRole('button').className).toContain('h-8')

    rerender(<Button size="lg">LG</Button>)
    expect(screen.getByRole('button').className).toContain('h-10')
  })

  it('handles click events when enabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Submit</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables interactions and triggers aria attributes when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('handles loading state with spinner and accessibility attributes', () => {
    render(<Button loading>Processing</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders left and right icons when provided', () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">←</span>}
        rightIcon={<span data-testid="right-icon">→</span>}
      >
        Navigate
      </Button>,
    )

    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('supports iconOnly layout', () => {
    render(
      <Button iconOnly size="md" aria-label="Settings">
        ⚙
      </Button>,
    )
    const button = screen.getByRole('button', { name: /settings/i })
    expect(button.className).toContain('w-9 h-9')
  })

  it('renders inline icon and text inside children with wrapping support', () => {
    render(
      <Button>
        <span data-testid="child-icon">▶</span>
        <span>Start Quiz</span>
      </Button>,
    )
    const button = screen.getByRole('button', { name: /start quiz/i })
    const contentWrapper = button.querySelector('span.inline-flex')
    expect(contentWrapper).toBeInTheDocument()
    expect(contentWrapper?.className).toContain('inline-flex')
    expect(contentWrapper?.className).toContain('items-center')
    expect(contentWrapper?.className).toContain('gap-2')
    expect(contentWrapper?.className).toContain('flex-wrap')
    expect(contentWrapper?.className).toContain('text-center')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref button</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
