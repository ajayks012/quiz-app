import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageLoader, Skeleton, Spinner } from './index'

describe('Loader Components', () => {
  it('renders spinner with accessible label', () => {
    render(<Spinner label="Submitting attempt..." />)
    expect(screen.getByRole('status', { name: /submitting attempt/i })).toBeInTheDocument()
  })

  it('renders skeleton with circle shape', () => {
    const { container } = render(<Skeleton shape="circle" className="w-10 h-10" />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('renders full page loader with message', () => {
    render(<PageLoader message="Loading question..." />)
    expect(screen.getAllByText('Loading question...').length).toBeGreaterThanOrEqual(1)
  })
})
