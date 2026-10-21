import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from './index'

describe('ConfirmDialog Component', () => {
  it('triggers confirmation callback and closes', async () => {
    const user = userEvent.setup()
    const handleConfirm = vi.fn()
    const handleOpenChange = vi.fn()

    render(
      <ConfirmDialog
        open={true}
        onOpenChange={handleOpenChange}
        title="Delete Quiz"
        description="Are you sure you want to delete this quiz?"
        confirmText="Delete"
        onConfirm={handleConfirm}
      />,
    )

    expect(screen.getByRole('heading', { name: /delete quiz/i })).toBeInTheDocument()
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument()

    const confirmBtn = screen.getByRole('button', { name: /delete/i })
    await user.click(confirmBtn)
    expect(handleConfirm).toHaveBeenCalledTimes(1)
    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })
})
