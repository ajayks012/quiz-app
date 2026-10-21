import { describe, expect, it } from 'vitest'
import { cn, deepClone, formatTime, percentage, sleep, uniqueId } from './index'

describe('Foundation Utilities', () => {
  describe('cn (Class merging)', () => {
    it('merges class names correctly', () => {
      expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
    })

    it('resolves Tailwind CSS conflicts by taking the latter class', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2')
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    })

    it('handles falsy and conditional values cleanly', () => {
      const isVisible = false
      const isPrimary = true
      expect(cn('base', isVisible && 'hidden', isPrimary && 'text-primary', undefined, null)).toBe(
        'base text-primary',
      )
    })
  })

  describe('sleep', () => {
    it('resolves after the specified duration', async () => {
      const start = Date.now()
      await sleep(20)
      const elapsed = Date.now() - start
      expect(elapsed).toBeGreaterThanOrEqual(15)
    })

    it('resolves immediately when ms <= 0', async () => {
      const start = Date.now()
      await sleep(-5)
      const elapsed = Date.now() - start
      expect(elapsed).toBeLessThan(50)
    })
  })

  describe('formatTime', () => {
    it('formats mm:ss correctly', () => {
      expect(formatTime(0)).toBe('00:00')
      expect(formatTime(45)).toBe('00:45')
      expect(formatTime(65)).toBe('01:05')
      expect(formatTime(599)).toBe('09:59')
    })

    it('formats hh:mm:ss when hours are present in auto mode', () => {
      expect(formatTime(3600)).toBe('01:00:00')
      expect(formatTime(3665)).toBe('01:01:05')
    })

    it('honors explicit format parameter', () => {
      expect(formatTime(65, 'hh:mm:ss')).toBe('00:01:05')
      expect(formatTime(3665, 'mm:ss')).toBe('61:05')
    })

    it('handles negative or invalid values gracefully', () => {
      expect(formatTime(-10)).toBe('00:00')
      expect(formatTime(NaN)).toBe('00:00')
      expect(formatTime(NaN, 'hh:mm:ss')).toBe('00:00:00')
    })
  })

  describe('percentage', () => {
    it('calculates standard percentage correctly', () => {
      expect(percentage(50, 100)).toBe(50)
      expect(percentage(1, 4)).toBe(25)
      expect(percentage(3, 3)).toBe(100)
    })

    it('handles decimal precision parameter', () => {
      expect(percentage(1, 3, 0)).toBe(33)
      expect(percentage(1, 3, 1)).toBe(33.3)
      expect(percentage(1, 3, 2)).toBe(33.33)
    })

    it('returns 0 on division by zero or invalid inputs without throwing', () => {
      expect(percentage(10, 0)).toBe(0)
      expect(percentage(10, -5)).toBe(0)
      expect(percentage(-5, 100)).toBe(0)
      expect(percentage(NaN, 100)).toBe(0)
      expect(percentage(50, NaN)).toBe(0)
    })
  })

  describe('uniqueId', () => {
    it('generates standard UUID strings', () => {
      const id1 = uniqueId()
      const id2 = uniqueId()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })

    it('prepends prefix when provided', () => {
      const prefixed = uniqueId('quiz')
      expect(prefixed.startsWith('quiz_')).toBe(true)
    })
  })

  describe('deepClone', () => {
    it('returns primitive values as-is', () => {
      expect(deepClone(42)).toBe(42)
      expect(deepClone('hello')).toBe('hello')
      expect(deepClone(null)).toBe(null)
      expect(deepClone(undefined)).toBe(undefined)
    })

    it('clones nested objects and arrays without shared reference', () => {
      const original = {
        name: 'React Quiz',
        questions: [{ id: 1, title: 'Q1' }],
        settings: { timeLimit: 60 },
      }

      const clone = deepClone(original)

      expect(clone).toEqual(original)
      expect(clone).not.toBe(original)
      expect(clone.questions).not.toBe(original.questions)
      expect(clone.questions[0]).not.toBe(original.questions[0])
      expect(clone.settings).not.toBe(original.settings)

      // Modifying clone does not alter original
      clone.questions[0]!.title = 'Modified'
      expect(original.questions[0]!.title).toBe('Q1')
    })
  })
})
