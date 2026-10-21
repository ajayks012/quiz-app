import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './index'

describe('Table Component', () => {
  it('renders table rows, headers, and sortable columns', async () => {
    const user = userEvent.setup()
    const handleSort = vi.fn()
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc" onSort={handleSort}>
              Quiz Title
            </TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>JavaScript Fundamentals</TableCell>
            <TableCell>95%</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument()
    expect(screen.getByText('95%')).toBeInTheDocument()

    const sortableHead = screen.getByText('Quiz Title')
    await user.click(sortableHead)
    expect(handleSort).toHaveBeenCalledTimes(1)
  })
})
