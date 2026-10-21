import { useCallback, useEffect, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'quiz-platform-theme'

function subscribeSystemTheme(callback: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}
  }
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

function getSystemDarkSnapshot() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getSystemDarkServerSnapshot() {
  return false
}

const themeListeners = new Set<() => void>()

function notifyThemeListeners() {
  themeListeners.forEach((fn) => fn())
}

function subscribeTheme(callback: () => void) {
  themeListeners.add(callback)
  return () => {
    themeListeners.delete(callback)
  }
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  try {
    return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'system'
  } catch {
    return 'system'
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getStoredTheme, () => 'system')

  const systemPrefersDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemDarkSnapshot,
    getSystemDarkServerSnapshot,
  )

  const resolvedTheme: 'light' | 'dark' =
    theme === 'dark' || (theme === 'system' && systemPrefersDark) ? 'dark' : 'light'

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch {
      // Ignore storage errors in restricted contexts
    }
    notifyThemeListeners()
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }
  }, [resolvedTheme])

  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    setTheme,
    toggleTheme,
  }
}
