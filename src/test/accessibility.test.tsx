import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Alert, ConfirmDialog, ProgressBar } from '@/components/ui'
import { GlobalLayout } from '@/layouts'

describe('Accessibility Audit (Task 55)', () => {
  it('renders semantic landmarks: header, nav, main, footer in GlobalLayout', () => {
    render(
      <GlobalLayout currentPath="/" onNavigate={() => {}}>
        <div id="test-content">Main Page Content</div>
      </GlobalLayout>,
    )

    // Landmarks check
    expect(screen.getByRole('banner')).toBeInTheDocument() // <header>
    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument() // <nav>
    expect(screen.getByRole('main')).toBeInTheDocument() // <main>
    expect(screen.getByRole('contentinfo')).toBeInTheDocument() // <footer>
    expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument() // skip link
  })

  it('validates ARIA roles and attributes in ProgressBar', () => {
    render(<ProgressBar value={40} max={100} showValue={true} />)

    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', '40')
    expect(progress).toHaveAttribute('aria-valuemin', '0')
    expect(progress).toHaveAttribute('aria-valuemax', '100')
  })

  it('validates ARIA alert role in Alert component', () => {
    render(<Alert variant="error">Critical system message</Alert>)

    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent('Critical system message')
  })

  it('validates accessible modal dialog roles and labeled by attributes in ConfirmDialog', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this item?"
        confirmText="Delete"
        onConfirm={() => {}}
      />,
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to permanently delete/i)).toBeInTheDocument()
  })
})
