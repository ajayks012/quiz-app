import { useEffect, useRef, useState } from 'react'
import { formatTime } from '@/utils'

export interface UseCountdownOptions {
  /** ISO string, timestamp ms, or Date when the timed session began */
  startTime: string | number | Date | null | undefined
  /** Total allowed duration in seconds. If null, timer is untimed/infinite. */
  totalSeconds: number | null | undefined
  /** Callback fired once when countdown reaches 0 */
  onExpire?: () => void
  /** Threshold in seconds under which isWarning becomes true (defaults to 10) */
  warningThresholdSeconds?: number
  /** Whether the timer is paused */
  paused?: boolean
  /** Polling resolution in milliseconds (defaults to 500) */
  intervalMs?: number
}

export interface UseCountdownReturn {
  remainingSeconds: number
  elapsedSeconds: number
  isExpired: boolean
  isWarning: boolean
  formatted: string
  percentage: number
}

/**
 * Robust, background-tab-resilient countdown hook.
 * Calculates remaining time strictly from the stored start timestamp rather than an interval counter.
 */
export function useCountdown({
  startTime,
  totalSeconds,
  onExpire,
  warningThresholdSeconds = 10,
  paused = false,
  intervalMs = 500,
}: UseCountdownOptions): UseCountdownReturn {
  const [now, setNow] = useState(() => Date.now())
  const firedSessionRef = useRef<string | null>(null)

  const startMs = startTime ? new Date(startTime).getTime() : NaN
  const hasValidTiming = !isNaN(startMs) && totalSeconds != null && totalSeconds > 0
  const sessionKey = `${startMs}_${totalSeconds ?? ''}`

  useEffect(() => {
    if (paused || !hasValidTiming) {
      return
    }

    const interval = setInterval(() => {
      setNow(Date.now())
    }, intervalMs)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setNow(Date.now())
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [paused, hasValidTiming, intervalMs])

  let elapsedSeconds = 0
  let remainingSeconds = totalSeconds && totalSeconds > 0 ? totalSeconds : 0
  let isExpired = false
  let isWarning = false
  let percentage = 100

  if (hasValidTiming) {
    elapsedSeconds = Math.max(0, Math.floor((now - startMs) / 1000))
    remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds)
    isExpired = remainingSeconds <= 0
    isWarning = !isExpired && remainingSeconds <= warningThresholdSeconds
    percentage = Math.max(0, Math.min(100, (remainingSeconds / totalSeconds) * 100))
  }

  const formatted =
    totalSeconds != null && totalSeconds > 0 ? formatTime(remainingSeconds) : '--:--'

  useEffect(() => {
    if (isExpired && hasValidTiming && firedSessionRef.current !== sessionKey) {
      firedSessionRef.current = sessionKey
      onExpire?.()
    }
  }, [isExpired, hasValidTiming, sessionKey, onExpire])

  return {
    remainingSeconds,
    elapsedSeconds,
    isExpired,
    isWarning,
    formatted,
    percentage,
  }
}
