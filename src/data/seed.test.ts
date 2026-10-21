import { describe, expect, it } from 'vitest'
import { SEED_DATA, getFreshSeedData } from './index'

describe('Seed Data Layer (Task 32)', () => {
  it('exports populated SEED_DATA with all collections', () => {
    expect(SEED_DATA.countries.length).toBeGreaterThanOrEqual(3)
    expect(SEED_DATA.users.length).toBeGreaterThanOrEqual(5)
    expect(SEED_DATA.quizzes.length).toBeGreaterThanOrEqual(5)
    expect(SEED_DATA.attempts.length).toBeGreaterThanOrEqual(10)
    expect(SEED_DATA.meta.version).toBe(1)
  })

  it('provides an isolated fresh clone with getFreshSeedData()', () => {
    const clone = getFreshSeedData()
    expect(clone).toEqual(SEED_DATA)
    expect(clone).not.toBe(SEED_DATA)

    // Mutation test
    clone.quizzes[0].title = 'Mutated Title'
    expect(SEED_DATA.quizzes[0].title).not.toBe('Mutated Title')
  })
})
