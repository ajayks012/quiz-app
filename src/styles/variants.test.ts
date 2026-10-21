import { describe, expect, it } from 'vitest'
import {
  cva,
  elevationVariants,
  intentVariants,
  radiusVariants,
  sizeVariants,
  surfaceVariants,
} from './index'

describe('CVA Variant System', () => {
  it('applies default surface variants', () => {
    const className = surfaceVariants()
    expect(className).toContain('bg-indigo-600')
    expect(className).toContain('text-sm')
    expect(className).toContain('rounded-md')
  })

  it('generates specified intent variants', () => {
    const primary = surfaceVariants({ intent: 'primary' })
    const destructive = surfaceVariants({ intent: 'destructive' })
    const success = surfaceVariants({ intent: 'success' })
    const outline = surfaceVariants({ intent: 'outline' })

    expect(primary).toContain('bg-indigo-600')
    expect(destructive).toContain('bg-rose-600')
    expect(success).toContain('bg-emerald-600')
    expect(outline).toContain('border-slate-300')
  })

  it('generates specified size variants', () => {
    const xs = surfaceVariants({ size: 'xs' })
    const lg = surfaceVariants({ size: 'lg' })
    const xl = surfaceVariants({ size: 'xl' })

    expect(xs).toContain('text-xs')
    expect(lg).toContain('text-base')
    expect(xl).toContain('text-lg')
  })

  it('generates specified radius variants', () => {
    const none = surfaceVariants({ radius: 'none' })
    const full = surfaceVariants({ radius: 'full' })
    const round2xl = surfaceVariants({ radius: '2xl' })

    expect(none).toContain('rounded-none')
    expect(full).toContain('rounded-full')
    expect(round2xl).toContain('rounded-2xl')
  })

  it('generates specified elevation variants', () => {
    const none = surfaceVariants({ elevation: 'none' })
    const md = surfaceVariants({ elevation: 'md' })
    const glow = surfaceVariants({ elevation: 'glow' })

    expect(none).toContain('shadow-none')
    expect(md).toContain('shadow-md')
    expect(glow).toContain('shadow-[0_0_15px_rgba(99,102,241,0.35)]')
  })

  it('supports custom cva definitions with shared tokens', () => {
    const customButton = cva('inline-flex', {
      variants: {
        intent: intentVariants,
        size: sizeVariants,
        radius: radiusVariants,
        elevation: elevationVariants,
      },
    })

    const result = customButton({
      intent: 'warning',
      size: 'sm',
      radius: 'full',
      elevation: 'lg',
    })

    expect(result).toContain('bg-amber-500')
    expect(result).toContain('text-sm')
    expect(result).toContain('rounded-full')
    expect(result).toContain('shadow-lg')
  })
})
