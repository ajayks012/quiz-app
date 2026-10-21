import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLocalStorageSync } from './use-local-storage-sync'
import { STORAGE_KEY } from '@/repositories'
import { useAppStore } from '@/store'

describe('useLocalStorageSync (Task 38)', () => {
  beforeEach(() => {
    useAppStore.setState({
      syncTick: 0,
    })
  })

  it('triggers store notifySync and onSync callback on matching StorageEvent', () => {
    const onSync = vi.fn()
    renderHook(() => useLocalStorageSync({ onSync }))

    expect(useAppStore.getState().syncTick).toBe(0)

    // Dispatch storage event for target key
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: '{}',
      }),
    )

    expect(useAppStore.getState().syncTick).toBe(1)
    expect(onSync).toHaveBeenCalledTimes(1)
  })

  it('ignores storage events for different keys', () => {
    const onSync = vi.fn()
    renderHook(() => useLocalStorageSync({ onSync }))

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'unrelated_other_key',
        newValue: 'test',
      }),
    )

    expect(useAppStore.getState().syncTick).toBe(0)
    expect(onSync).not.toHaveBeenCalled()
  })

  it('does not listen when enabled is false', () => {
    const onSync = vi.fn()
    renderHook(() => useLocalStorageSync({ onSync, enabled: false }))

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: '{}',
      }),
    )

    expect(useAppStore.getState().syncTick).toBe(0)
    expect(onSync).not.toHaveBeenCalled()
  })

  it('cleans up listener on unmount', () => {
    const onSync = vi.fn()
    const { unmount } = renderHook(() => useLocalStorageSync({ onSync }))

    unmount()

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: '{}',
      }),
    )

    expect(useAppStore.getState().syncTick).toBe(0)
    expect(onSync).not.toHaveBeenCalled()
  })
})
