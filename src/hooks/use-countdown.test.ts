import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountdown } from './use-countdown'

describe('useCountdown (Task 36)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('handles untimed session gracefully', () => {
    const onExpire = vi.fn()
    const { result } = renderHook(() =>
      useCountdown({
        startTime: new Date().toISOString(),
        totalSeconds: null,
        onExpire,
      }),
    )

    expect(result.current.remainingSeconds).toBe(0)
    expect(result.current.isExpired).toBe(false)
    expect(result.current.formatted).toBe('--:--')
    expect(onExpire).not.toHaveBeenCalled()
  })

  it('computes initial remaining time from historical start timestamp', () => {
    const now = 1000000
    vi.setSystemTime(now)

    // Started 25 seconds ago, total 60s
    const startTime = new Date(now - 25000).toISOString()
    const { result } = renderHook(() =>
      useCountdown({
        startTime,
        totalSeconds: 60,
      }),
    )

    expect(result.current.remainingSeconds).toBe(35)
    expect(result.current.elapsedSeconds).toBe(25)
    expect(result.current.formatted).toBe('00:35')
    expect(result.current.isExpired).toBe(false)
    expect(result.current.isWarning).toBe(false)
  })

  it('triggers onExpire immediately if already expired on mount', () => {
    const now = 1000000
    vi.setSystemTime(now)

    // Started 70 seconds ago, total was 60s
    const startTime = new Date(now - 70000).toISOString()
    const onExpire = vi.fn()

    const { result } = renderHook(() =>
      useCountdown({
        startTime,
        totalSeconds: 60,
        onExpire,
      }),
    )

    expect(result.current.remainingSeconds).toBe(0)
    expect(result.current.isExpired).toBe(true)
    expect(onExpire).toHaveBeenCalledTimes(1)
  })

  it('ticks forward, enters warning state, and fires onExpire once', () => {
    const now = 1000000
    vi.setSystemTime(now)

    const startTime = new Date(now).toISOString()
    const onExpire = vi.fn()

    const { result } = renderHook(() =>
      useCountdown({
        startTime,
        totalSeconds: 20,
        warningThresholdSeconds: 5,
        intervalMs: 250,
        onExpire,
      }),
    )

    expect(result.current.remainingSeconds).toBe(20)
    expect(result.current.isWarning).toBe(false)

    // Advance 16 seconds -> remaining 4s (should enter warning)
    act(() => {
      vi.advanceTimersByTime(16000)
    })

    expect(result.current.remainingSeconds).toBe(4)
    expect(result.current.isWarning).toBe(true)
    expect(result.current.isExpired).toBe(false)
    expect(onExpire).not.toHaveBeenCalled()

    // Advance past expiration (remaining 0)
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.remainingSeconds).toBe(0)
    expect(result.current.isExpired).toBe(true)
    expect(onExpire).toHaveBeenCalledTimes(1)

    // Extra ticks should not re-trigger onExpire
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(onExpire).toHaveBeenCalledTimes(1)
  })

  it('syncs on visibilitychange event when returning to tab', () => {
    const now = 1000000
    vi.setSystemTime(now)

    const startTime = new Date(now).toISOString()
    const onExpire = vi.fn()

    const { result } = renderHook(() =>
      useCountdown({
        startTime,
        totalSeconds: 60,
        onExpire,
      }),
    )

    expect(result.current.remainingSeconds).toBe(60)

    // Advance system time simulating background tab without ticking setInterval
    vi.setSystemTime(now + 30000)

    act(() => {
      // Simulate tab regaining visibility
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        get: () => 'visible',
      })
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(result.current.remainingSeconds).toBe(30)
    expect(result.current.elapsedSeconds).toBe(30)
  })

  it('resets countdown when moving to next session key', () => {
    const now = 1000000
    vi.setSystemTime(now)

    let startTime = new Date(now).toISOString()
    let totalSeconds = 10

    const { result, rerender } = renderHook(() =>
      useCountdown({
        startTime,
        totalSeconds,
      }),
    )

    expect(result.current.remainingSeconds).toBe(10)

    // Advance to expire question 1
    act(() => {
      vi.advanceTimersByTime(11000)
    })
    expect(result.current.isExpired).toBe(true)

    // Switch to Question 2 with new startTime and duration
    startTime = new Date(now + 11000).toISOString()
    totalSeconds = 15
    rerender()

    expect(result.current.remainingSeconds).toBe(15)
    expect(result.current.isExpired).toBe(false)
  })
})
