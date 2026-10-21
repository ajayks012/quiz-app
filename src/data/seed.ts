import rawSeed from '../../seed/seed.json'
import type { SeedData } from '@/types'
import { deepClone } from '@/utils'

export const SEED_DATA: SeedData = rawSeed as unknown as SeedData

/**
 * Returns a pristine deep clone of the seed dataset.
 * Prevents unintended in-memory mutation across resets or tests.
 */
export function getFreshSeedData(): SeedData {
  return deepClone(SEED_DATA)
}
