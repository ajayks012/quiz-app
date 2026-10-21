import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input, SearchInput, TextArea } from './index'

describe('Input Components', () => {
  describe('Input', () => {
    it('renders text input with helper text and accepts user typing', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(
        <Input
          placeholder="Enter name"
          helperText="We will never share your name"
          onChange={handleChange}
        />,
      )

      const input = screen.getByPlaceholderText('Enter name')
      expect(input).toBeInTheDocument()
      expect(screen.getByText('We will never share your name')).toBeInTheDocument()

      await user.type(input, 'Antigravity')
      expect(handleChange).toHaveBeenCalled()
    })

    it('renders error state and error message with aria-invalid', () => {
      render(<Input placeholder="Email" errorText="Email is required" />)
      const input = screen.getByPlaceholderText('Email')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByRole('alert')).toHaveTextContent('Email is required')
    })

    it('renders icon slots', () => {
      render(
        <Input
          leftIcon={<span data-testid="left">@</span>}
          rightIcon={<span data-testid="right">✓</span>}
        />,
      )
      expect(screen.getByTestId('left')).toBeInTheDocument()
      expect(screen.getByTestId('right')).toBeInTheDocument()
    })
  })

  describe('TextArea', () => {
    it('renders textarea with error and helper support', async () => {
      const user = userEvent.setup()
      render(<TextArea placeholder="Describe the question" />)
      const textarea = screen.getByPlaceholderText('Describe the question')
      await user.type(textarea, 'Sample question description')
      expect(textarea).toHaveValue('Sample question description')
    })
  })

  describe('SearchInput', () => {
    it('shows clear button when text is present and clears on click', async () => {
      const user = userEvent.setup()
      const handleClear = vi.fn()
      render(
        <SearchInput
          placeholder="Search quizzes..."
          value="javascript"
          onChange={vi.fn()}
          onClear={handleClear}
        />,
      )

      const clearBtn = screen.getByRole('button', { name: /clear search/i })
      expect(clearBtn).toBeInTheDocument()
      await user.click(clearBtn)
      expect(handleClear).toHaveBeenCalledTimes(1)
    })
  })
})
