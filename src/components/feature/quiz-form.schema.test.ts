import { describe, expect, it } from 'vitest'
import { QuizFormSchema } from './quiz-form.schema'

describe('QuizFormSchema Validation (Task 43)', () => {
  const validQuiz = {
    title: 'Valid Quiz',
    description: 'A valid description',
    countries: ['US', 'SG'],
    timeLimitSeconds: 120,
    perQuestionSeconds: null,
    retakesAllowed: true,
    questions: [
      {
        id: 'q1',
        text: 'What is TypeScript?',
        type: 'single' as const,
        options: [
          { id: 'o1', text: 'Typed superset of JavaScript' },
          { id: 'o2', text: 'Coffee brand' },
        ],
        correctOptionIds: ['o1'],
      },
    ],
  }

  it('validates a compliant quiz dataset', () => {
    const result = QuizFormSchema.safeParse(validQuiz)
    expect(result.success).toBe(true)
  })

  it('requires a non-empty title', () => {
    const result = QuizFormSchema.safeParse({ ...validQuiz, title: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/title is required/i)
    }
  })

  it('requires at least one country assigned', () => {
    const result = QuizFormSchema.safeParse({ ...validQuiz, countries: [] })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/assign at least one country/i)
    }
  })

  it('requires at least one question', () => {
    const result = QuizFormSchema.safeParse({ ...validQuiz, questions: [] })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/at least one question is required/i)
    }
  })

  it('requires at least two options per question', () => {
    const invalid = {
      ...validQuiz,
      questions: [
        {
          id: 'q1',
          text: 'One option only',
          type: 'single' as const,
          options: [{ id: 'o1', text: 'Only option' }],
          correctOptionIds: ['o1'],
        },
      ],
    }
    const result = QuizFormSchema.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/at least 2 options/i)
    }
  })

  it('requires exactly one correct option for single-choice questions', () => {
    const invalid = {
      ...validQuiz,
      questions: [
        {
          id: 'q1',
          text: 'Single choice with multiple correct',
          type: 'single' as const,
          options: [
            { id: 'o1', text: 'A' },
            { id: 'o2', text: 'B' },
          ],
          correctOptionIds: ['o1', 'o2'],
        },
      ],
    }
    const result = QuizFormSchema.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(
        /single-choice questions must have exactly one correct option/i,
      )
    }
  })

  it('permits multiple correct options for multiple-choice questions', () => {
    const validMultiple = {
      ...validQuiz,
      questions: [
        {
          id: 'q1',
          text: 'Select valid JS frameworks',
          type: 'multiple' as const,
          options: [
            { id: 'o1', text: 'React' },
            { id: 'o2', text: 'Vue' },
            { id: 'o3', text: 'Banana' },
          ],
          correctOptionIds: ['o1', 'o2'],
        },
      ],
    }
    const result = QuizFormSchema.safeParse(validMultiple)
    expect(result.success).toBe(true)
  })
})
