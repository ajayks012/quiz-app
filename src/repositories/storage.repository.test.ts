import { beforeEach, describe, expect, it } from 'vitest'
import { StorageRepository } from './storage.repository'
import { SEED_DATA } from '@/data'
import type { Attempt, Quiz } from '@/types'

describe('StorageRepository (Task 33)', () => {
  let repo: StorageRepository
  const TEST_KEY = 'test_quiz_db'

  beforeEach(() => {
    localStorage.clear()
    repo = new StorageRepository(TEST_KEY)
  })

  it('initializes localStorage with fresh seed data on first run', () => {
    expect(localStorage.getItem(TEST_KEY)).toBeNull()
    const data = repo.init()

    expect(data.quizzes.length).toBe(SEED_DATA.quizzes.length)
    expect(localStorage.getItem(TEST_KEY)).not.toBeNull()
  })

  it('re-seeds when storage contains invalid or corrupted JSON', () => {
    localStorage.setItem(TEST_KEY, 'invalid-json{{{')
    const data = repo.init()
    expect(data.quizzes.length).toBe(SEED_DATA.quizzes.length)
  })

  it('resets modified storage back to original seed data', () => {
    repo.init()

    // Mutate by deleting a quiz
    repo.deleteQuiz('q1')
    expect(repo.getQuizzes().length).toBe(SEED_DATA.quizzes.length - 1)

    // Reset
    const resetData = repo.reset()
    expect(resetData.quizzes.length).toBe(SEED_DATA.quizzes.length)
    expect(repo.getQuizById('q1')).toBeDefined()
  })

  it('adds, updates, and deletes quizzes', () => {
    repo.init()

    const newQuiz: Quiz = {
      id: 'custom-quiz-1',
      title: 'Custom Quiz',
      description: 'Testing additions',
      countries: ['IN'],
      timeLimitSeconds: 60,
      perQuestionSeconds: null,
      retakesAllowed: true,
      questions: [
        {
          id: 'cq-1',
          text: 'What is 2 + 2?',
          type: 'single',
          options: [
            { id: 'o1', text: '3' },
            { id: 'o2', text: '4' },
          ],
          correctOptionIds: ['o2'],
        },
      ],
    }

    // Add
    repo.saveQuiz(newQuiz)
    expect(repo.getQuizById('custom-quiz-1')).toEqual(newQuiz)

    // Update
    newQuiz.title = 'Updated Title'
    repo.saveQuiz(newQuiz)
    expect(repo.getQuizById('custom-quiz-1')?.title).toBe('Updated Title')

    // Delete
    const deleted = repo.deleteQuiz('custom-quiz-1')
    expect(deleted).toBe(true)
    expect(repo.getQuizById('custom-quiz-1')).toBeUndefined()
  })

  it('retrieves users and countries', () => {
    repo.init()

    expect(repo.getUsers().length).toBe(SEED_DATA.users.length)
    expect(repo.getUserById('u1')?.name).toBe('Aarav Menon')
    expect(repo.getCountries().length).toBe(SEED_DATA.countries.length)
  })

  it('saves and filters attempts', () => {
    repo.init()

    const newAttempt: Attempt = {
      id: 'test-attempt-1',
      quizId: 'q1',
      userId: 'u1',
      status: 'in_progress',
      startedAt: '2026-10-20T08:00:00Z',
      currentQuestionIndex: 0,
      answers: [],
      completedAt: null,
      score: null,
      totalQuestions: 6,
      percentage: null,
      timeTakenSeconds: null,
    }

    repo.saveAttempt(newAttempt)
    expect(repo.getAttemptById('test-attempt-1')).toEqual(newAttempt)

    const userAttempts = repo.getAttemptsByUserId('u1')
    expect(userAttempts.some((a) => a.id === 'test-attempt-1')).toBe(true)

    const quizAttempts = repo.getAttemptsByQuizId('q1')
    expect(quizAttempts.some((a) => a.id === 'test-attempt-1')).toBe(true)
  })
})
