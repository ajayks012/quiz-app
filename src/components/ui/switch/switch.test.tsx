import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './index'

describe('Switch Component', () => {
  it('toggles switch state upon click', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()
    render(<Switch label="Dark mode" onCheckedChange={handleToggle} />)

    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')

    await user.click(toggle)
    expect(handleToggle).toHaveBeenCalledWith(true)
  })

  it('handles disabled state', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()
    render(<Switch label="Sound effects" disabled onCheckedChange={handleToggle} />)

    const toggle = screen.getByRole('switch')
    expect(toggle).toBeDisabled()
    await user.click(toggle)
    expect(handleToggle).not.toHaveBeenCalled()
  })
})
