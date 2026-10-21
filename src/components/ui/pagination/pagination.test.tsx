import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from './index'

describe('Pagination Component', () => {
  it('renders page numbers and handles page clicks', async () => {
    const user = userEvent.setup()
    const handlePageChange = vi.fn()
    render(<Pagination page={2} totalPages={5} onPageChange={handlePageChange} />)

    const currentPage = screen.getByRole('button', { name: '2' })
    expect(currentPage).toHaveAttribute('aria-current', 'page')

    const page3 = screen.getByRole('button', { name: '3' })
    await user.click(page3)
    expect(handlePageChange).toHaveBeenCalledWith(3)
  })

  it('navigates next and previous', async () => {
    const user = userEvent.setup()
    const handlePageChange = vi.fn()
    render(<Pagination page={2} totalPages={5} onPageChange={handlePageChange} />)

    const prevButton = screen.getByRole('button', { name: /previous page/i })
    await user.click(prevButton)
    expect(handlePageChange).toHaveBeenCalledWith(1)
  })
})
