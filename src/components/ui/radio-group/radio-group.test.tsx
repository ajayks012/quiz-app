import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup, RadioGroupItem } from './index'

describe('RadioGroup Components', () => {
  it('renders radio items and allows selecting an option', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <RadioGroup defaultValue="opt1" onChange={handleChange}>
        <RadioGroupItem value="opt1" label="Option 1" />
        <RadioGroupItem value="opt2" label="Option 2" />
      </RadioGroup>,
    )

    const radios = screen.getAllByRole('radio')
    expect(radios[0]).toBeChecked()
    expect(radios[1]).not.toBeChecked()

    await user.click(screen.getByText('Option 2'))
    expect(handleChange).toHaveBeenCalledWith('opt2')
  })

  it('respects group disabled state', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <RadioGroup disabled onChange={handleChange}>
        <RadioGroupItem value="opt1" label="Option 1" />
      </RadioGroup>,
    )

    const radio = screen.getByRole('radio')
    expect(radio).toBeDisabled()
    await user.click(screen.getByText('Option 1'))
    expect(handleChange).not.toHaveBeenCalled()
  })
})
