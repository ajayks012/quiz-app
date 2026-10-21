import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'

describe('Smoke test for installed dependencies', () => {
  it('combines classes properly', () => {
    const className = twMerge(clsx('p-4', 'p-2', 'text-white'))
    expect(className).toBe('p-2 text-white')
  })

  it('validates with zod', () => {
    const schema = z.object({ name: z.string() })
    expect(schema.parse({ name: 'Quiz' })).toEqual({ name: 'Quiz' })
  })

  it('generates uuid', () => {
    const id = uuidv4()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('renders with testing-library', () => {
    render(<div>Hello Test</div>)
    expect(screen.getByText('Hello Test')).toBeInTheDocument()
  })

  it('creates a zustand store', () => {
    interface TestStore {
      count: number
      inc: () => void
    }
    const useStore = create<TestStore>((set) => ({
      count: 0,
      inc: () => set((state) => ({ count: state.count + 1 })),
    }))
    expect(useStore.getState().count).toBe(0)
    useStore.getState().inc()
    expect(useStore.getState().count).toBe(1)
  })
})
