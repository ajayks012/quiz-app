import { describe, expect, it } from 'vitest'
import seedData from '../../seed/seed.json'
import {
  AttemptSchema,
  CountrySchema,
  QuestionSchema,
  QuizSchema,
  SeedDataSchema,
  UserSchema,
} from './models'

describe('Domain Models & Schemas (Task 31)', () => {
  it('validates a correct Country', () => {
    const result = CountrySchema.safeParse({ code: 'IN', name: 'India' })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid Country code', () => {
    const result = CountrySchema.safeParse({ code: '', name: 'India' })
    expect(result.success).toBe(false)
  })

  it('validates a User with valid role', () => {
    const result = UserSchema.safeParse({
      id: 'u1',
      name: 'Aarav Menon',
      country: 'IN',
      role: 'user',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid User role', () => {
    const result = UserSchema.safeParse({
      id: 'u1',
      name: 'Aarav',
      country: 'IN',
      role: 'superadmin',
    })
    expect(result.success).toBe(false)
  })

  it('validates Question with options and correctOptionIds', () => {
    const result = QuestionSchema.safeParse({
      id: 'q1-1',
      text: 'Which keyword declares a block-scoped variable?',
      type: 'single',
      options: [
        { id: 'o1', text: 'var' },
        { id: 'o2', text: 'let' },
      ],
      correctOptionIds: ['o2'],
    })
    expect(result.success).toBe(true)
  })

  it('validates a valid Quiz structure', () => {
    const result = QuizSchema.safeParse({
      id: 'q-sample',
      title: 'Sample Quiz',
      description: 'A test quiz',
      countries: ['IN', 'AE'],
      timeLimitSeconds: 120,
      perQuestionSeconds: null,
      retakesAllowed: true,
      questions: [
        {
          id: 'q1',
          text: 'Question text',
          type: 'single',
          options: [
            { id: 'o1', text: 'Opt 1' },
            { id: 'o2', text: 'Opt 2' },
          ],
          correctOptionIds: ['o1'],
        },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('strictly validates entire seed.json without any unexpected fields', () => {
    // 1. Strict Countries
    const StrictCountry = CountrySchema.strict()
    for (const country of seedData.countries) {
      expect(StrictCountry.safeParse(country).success).toBe(true)
    }

    // 2. Strict Users
    const StrictUser = UserSchema.strict()
    for (const user of seedData.users) {
      expect(StrictUser.safeParse(user).success).toBe(true)
    }

    // 3. Strict Quizzes & Questions
    const StrictQuiz = QuizSchema.strict()
    for (const quiz of seedData.quizzes) {
      expect(StrictQuiz.safeParse(quiz).success).toBe(true)
    }

    // 4. Strict Attempts & Answers
    const StrictAttempt = AttemptSchema.strict()
    for (const attempt of seedData.attempts) {
      expect(StrictAttempt.safeParse(attempt).success).toBe(true)
    }

    // 5. Root Container
    const result = SeedDataSchema.strict().safeParse(seedData)
    expect(result.success).toBe(true)
  })
})
