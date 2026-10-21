import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Header } from '@/layouts/header'
import { Grid } from '@/components/ui'

describe('Responsive Layout Tests (Task 56)', () => {
  it('toggles mobile menu drawer on hamburger button click', () => {
    render(
      <Header
        currentPath="/"
        onNavigate={() => {}}
        userSlot={<div data-testid="user-slot">User Slot</div>}
      />,
    )

    const toggleButton = screen.getByRole('button', { name: /open menu/i })
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument()

    // Open mobile menu
    fireEvent.click(toggleButton)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument()
    expect(screen.getAllByTestId('user-slot').length).toBeGreaterThan(0)

    // Close mobile menu
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }))
    expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).not.toBeInTheDocument()
  })

  it('renders responsive grid layout with mobile, tablet, and desktop breakpoints', () => {
    const { container } = render(
      <Grid cols={3} gap="md">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Grid>,
    )

    const grid = container.firstChild as HTMLElement
    expect(grid).toHaveClass('grid')
    expect(grid).toHaveClass('grid-cols-1')
    expect(grid).toHaveClass('sm:grid-cols-2')
    expect(grid).toHaveClass('lg:grid-cols-3')
  })
})
