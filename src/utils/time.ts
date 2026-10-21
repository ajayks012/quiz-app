/**
 * Resolves after a specified number of milliseconds.
 * Useful for simulated network latency, debounce delays, and pacing.
 */
export function sleep(ms: number): Promise<void> {
  const safeMs = Math.max(0, ms)
  return new Promise((resolve) => setTimeout(resolve, safeMs))
}

export type TimeFormat = 'mm:ss' | 'hh:mm:ss' | 'auto'

/**
 * Formats a duration in seconds into a padded digital clock string.
 *
 * @param totalSeconds - Duration in seconds (floored to integer, non-negative).
 * @param format - Output format ('mm:ss', 'hh:mm:ss', or 'auto'). Defaults to 'auto'.
 * @returns Formatted time string (e.g., "04:15", "01:23:45").
 */
export function formatTime(totalSeconds: number, format: TimeFormat = 'auto'): string {
  if (isNaN(totalSeconds) || totalSeconds <= 0) {
    return format === 'hh:mm:ss' ? '00:00:00' : '00:00'
  }

  const secondsInt = Math.floor(totalSeconds)
  const pad = (num: number): string => num.toString().padStart(2, '0')

  if (format === 'mm:ss') {
    const totalMinutes = Math.floor(secondsInt / 60)
    const seconds = secondsInt % 60
    return `${pad(totalMinutes)}:${pad(seconds)}`
  }

  const hours = Math.floor(secondsInt / 3600)
  const minutes = Math.floor((secondsInt % 3600) / 60)
  const seconds = secondsInt % 60

  if (format === 'hh:mm:ss' || (format === 'auto' && hours > 0)) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }

  return `${pad(minutes)}:${pad(seconds)}`
}
