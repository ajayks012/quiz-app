import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CircularProgress, ProgressBar } from './index'

describe('Progress Components', () => {
  it('renders horizontal progress bar with percentage label', () => {
    render(<ProgressBar value={75} max={100} showValue />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '75')
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('renders circular progress with stroke offset and text', () => {
    render(<CircularProgress value={50} max={100} />)
    const circular = screen.getByRole('progressbar')
    expect(circular).toHaveAttribute('aria-valuenow', '50')
    expect(screen.getByText('50%')).toBeInTheDocument()
  })
})
