import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Alert } from './index'

describe('Alert Component', () => {
  it('renders alert message with title and dismiss button', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    render(
      <Alert variant="warning" title="Warning" onClose={handleClose}>
        Please save your changes
      </Alert>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Warning')).toBeInTheDocument()
    expect(screen.getByText('Please save your changes')).toBeInTheDocument()

    const dismissBtn = screen.getByRole('button', { name: /dismiss alert/i })
    await user.click(dismissBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
