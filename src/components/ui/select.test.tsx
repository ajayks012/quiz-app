import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MultiSelect, Select } from './index'

const sampleOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular', disabled: true },
]

describe('Select Components', () => {
  describe('Select', () => {
    it('opens dropdown, displays options, and selects an option', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Select options={sampleOptions} value="react" onChange={handleChange} />)

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveTextContent('React')

      await user.click(trigger)
      expect(screen.getByRole('listbox')).toBeInTheDocument()

      const vueOption = screen.getByText('Vue')
      await user.click(vueOption)
      expect(handleChange).toHaveBeenCalledWith('vue')
    })

    it('does not select disabled options', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Select options={sampleOptions} onChange={handleChange} />)

      await user.click(screen.getByRole('button'))
      const disabledOption = screen.getByText('Angular')
      await user.click(disabledOption)
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('MultiSelect', () => {
    it('displays selected chips and removes a chip on click', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(
        <MultiSelect options={sampleOptions} values={['react', 'vue']} onChange={handleChange} />,
      )

      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Vue')).toBeInTheDocument()

      const removeReact = screen.getByRole('button', { name: /remove react/i })
      await user.click(removeReact)
      expect(handleChange).toHaveBeenCalledWith(['vue'])
    })
  })
})
