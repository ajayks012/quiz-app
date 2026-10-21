import { describe, expect, it } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Toaster, toast, useToastStore } from './index'

describe('Toast System', () => {
  it('renders triggered toasts via imperative toast API', () => {
    act(() => {
      useToastStore.getState().clearAll()
    })

    render(<Toaster />)

    act(() => {
      toast.success('Quiz created successfully', 'Saved')
    })

    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('Quiz created successfully')).toBeInTheDocument()
  })
})
