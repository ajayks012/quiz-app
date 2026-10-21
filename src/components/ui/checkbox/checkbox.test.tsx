import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './index'

describe('Checkbox Component', () => {
  it('toggles checked state upon user click', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox label="Accept terms" onChange={handleChange} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders indeterminate state with minus icon', () => {
    render(<Checkbox label="Select all" indeterminate />)
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
  })

  it('handles disabled state', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox label="Disabled option" disabled onChange={handleChange} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
    await user.click(checkbox)
    expect(handleChange).not.toHaveBeenCalled()
  })
})
