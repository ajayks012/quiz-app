import { beforeEach, describe, expect, it } from 'vitest'
import { StorageRepository } from '@/repositories'
import { QuizService } from './quiz.service'
import type { Quiz } from '@/types'

describe('QuizService (Task 34)', () => {
  let service: QuizService
  let storage: StorageRepository
  const TEST_KEY = 'test_quiz_service_db'

  beforeEach(() => {
    localStorage.clear()
    storage = new StorageRepository(TEST_KEY)
    storage.init()
    service = new QuizService(storage, 0) // 0 delay for fast tests
  })

  describe('Quizzes', () => {
    it('filters quizzes by country and search term', async () => {
      const all = await service.getQuizzes()
      expect(all.length).toBeGreaterThanOrEqual(5)

      const inOnly = await service.getQuizzes({ country: 'IN' })
      expect(inOnly.every((q) => q.countries.includes('IN'))).toBe(true)

      const searched = await service.getQuizzes({ search: 'JavaScript' })
      expect(searched.length).toBeGreaterThanOrEqual(1)
      expect(searched[0].title).toContain('JavaScript')
    })

    it('creates, updates, and deletes a quiz', async () => {
      const newQuizData: Omit<Quiz, 'id'> = {
        title: 'New Service Quiz',
        description: 'Description',
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
              { id: 'o1', text: '1' },
              { id: 'o2', text: '2' },
            ],
            correctOptionIds: ['o1'],
          },
        ],
      }

      const created = await service.createQuiz(newQuizData)
      expect(created.id).toBeDefined()
      expect(created.title).toBe(newQuizData.title)

      const updated = await service.updateQuiz(created.id, { title: 'Updated Service Quiz' })
      expect(updated.title).toBe('Updated Service Quiz')

      const deleted = await service.deleteQuiz(created.id)
      expect(deleted).toBe(true)
      expect(await service.getQuizById(created.id)).toBeNull()
    })
  })

  describe('Attempts & Answering Lifecycle', () => {
    it('starts an attempt and resumes in-progress attempts', async () => {
      const attempt1 = await service.startAttempt('q1', 'u1')
      expect(attempt1.status).toBe('in_progress')
      expect(attempt1.answers.length).toBe(0)

      // Resuming same attempt
      const resumed = await service.startAttempt('q1', 'u1')
      expect(resumed.id).toBe(attempt1.id)
    })

    it('blocks retakes when quiz forbids retakes', async () => {
      // In seed data, u4 has already completed q4 (which has retakesAllowed = false)
      await expect(service.startAttempt('q4', 'u4')).rejects.toThrow(/retakes are not allowed/i)
    })

    it('grades answers and auto-completes on final question', async () => {
      // Create simple 2-question quiz for predictable testing
      const quiz = await service.createQuiz({
        title: 'Grading Test Quiz',
        description: 'Test',
        countries: ['IN'],
        timeLimitSeconds: 60,
        perQuestionSeconds: null,
        retakesAllowed: true,
        questions: [
          {
            id: 'g-q1',
            text: 'Single question',
            type: 'single',
            options: [
              { id: 'o1', text: 'Wrong' },
              { id: 'o2', text: 'Right' },
            ],
            correctOptionIds: ['o2'],
          },
          {
            id: 'g-q2',
            text: 'Multiple question',
            type: 'multiple',
            options: [
              { id: 'm1', text: 'Right 1' },
              { id: 'm2', text: 'Right 2' },
              { id: 'm3', text: 'Wrong' },
            ],
            correctOptionIds: ['m1', 'm2'],
          },
        ],
      })

      const attempt = await service.startAttempt(quiz.id, 'u1')

      // Question 1: correct
      const step1 = await service.submitAnswer(attempt.id, 'g-q1', ['o2'])
      expect(step1.status).toBe('in_progress')
      expect(step1.answers[0].isCorrect).toBe(true)

      // Question 2: correct (unordered array check)
      const step2 = await service.submitAnswer(attempt.id, 'g-q2', ['m2', 'm1'])
      expect(step2.status).toBe('completed')
      expect(step2.score).toBe(2)
      expect(step2.percentage).toBe(100)
    })
  })

  describe('Leaderboard', () => {
    it('ranks completed attempts correctly by score and time', async () => {
      const leaderboard = await service.getLeaderboard()
      expect(leaderboard.length).toBeGreaterThan(0)

      for (let i = 0; i < leaderboard.length - 1; i++) {
        const curr = leaderboard[i]
        const next = leaderboard[i + 1]
        expect(curr.rank).toBe(i + 1)
        expect(curr.score).toBeGreaterThanOrEqual(next.score)
      }
    })

    it('filters leaderboard by country and quiz', async () => {
      const inLeaderboard = await service.getLeaderboard({ country: 'IN' })
      expect(inLeaderboard.every((entry) => entry.userCountry === 'IN')).toBe(true)

      const q1Leaderboard = await service.getLeaderboard({ quizId: 'q1' })
      expect(q1Leaderboard.every((entry) => entry.quizId === 'q1')).toBe(true)
    })
  })
})
