import { useEffect } from 'react'
import { STORAGE_KEY } from '@/repositories'
import { useAppStore } from '@/store'

export interface UseLocalStorageSyncOptions {
  /** Target localStorage key to observe (defaults to STORAGE_KEY) */
  key?: string
  /** Optional custom callback executed on storage event */
  onSync?: () => void
  /** Whether the synchronization listener is active (defaults to true) */
  enabled?: boolean
}

/**
 * Synchronizes application state across browser tabs upon storage events.
 * Triggers global store synchronization tick whenever the database key changes.
 */
export function useLocalStorageSync({
  key = STORAGE_KEY,
  onSync,
  enabled = true,
}: UseLocalStorageSyncOptions = {}): void {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const handleStorageEvent = (event: StorageEvent) => {
      if (!event.key || event.key === key) {
        useAppStore.getState().notifySync()
        onSync?.()
      }
    }

    window.addEventListener('storage', handleStorageEvent)

    return () => {
      window.removeEventListener('storage', handleStorageEvent)
    }
  }, [key, onSync, enabled])
}
