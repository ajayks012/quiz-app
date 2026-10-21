import { getFreshSeedData } from '@/data'
import type { Attempt, Country, Quiz, SeedData, User } from '@/types'
import { SeedDataSchema } from '@/types'

export const STORAGE_KEY = 'quiz_platform_db'

export class StorageRepository {
  private key: string

  constructor(key = STORAGE_KEY) {
    this.key = key
  }

  /**
   * Initializes browser storage with seed data if absent or invalid.
   */
  init(): SeedData {
    if (typeof window === 'undefined') return getFreshSeedData()

    const raw = localStorage.getItem(this.key)
    if (!raw) {
      return this.reset()
    }

    try {
      const parsed = JSON.parse(raw)
      const validated = SeedDataSchema.safeParse(parsed)
      if (validated.success) {
        return validated.data
      }
      return this.reset()
    } catch {
      return this.reset()
    }
  }

  /**
   * Resets browser storage back to the pristine seed dataset.
   */
  reset(): SeedData {
    const fresh = getFreshSeedData()
    this.saveData(fresh)
    return fresh
  }

  /**
   * Returns current database snapshot.
   */
  getData(): SeedData {
    return this.init()
  }

  /**
   * Persists entire database state to storage.
   */
  saveData(data: SeedData): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(this.key, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }

  // --- Entity Accessors ---

  getQuizzes(): Quiz[] {
    return this.getData().quizzes
  }

  getQuizById(id: string): Quiz | undefined {
    return this.getQuizzes().find((q) => q.id === id)
  }

  saveQuiz(quiz: Quiz): void {
    const data = this.getData()
    const index = data.quizzes.findIndex((q) => q.id === quiz.id)
    if (index >= 0) {
      data.quizzes[index] = quiz
    } else {
      data.quizzes.push(quiz)
    }
    this.saveData(data)
  }

  deleteQuiz(id: string): boolean {
    const data = this.getData()
    const initialLen = data.quizzes.length
    data.quizzes = data.quizzes.filter((q) => q.id !== id)
    if (data.quizzes.length !== initialLen) {
      this.saveData(data)
      return true
    }
    return false
  }

  getUsers(): User[] {
    return this.getData().users
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id)
  }

  getCountries(): Country[] {
    return this.getData().countries
  }

  getAttempts(): Attempt[] {
    return this.getData().attempts
  }

  getAttemptById(id: string): Attempt | undefined {
    return this.getAttempts().find((a) => a.id === id)
  }

  getAttemptsByUserId(userId: string): Attempt[] {
    return this.getAttempts().filter((a) => a.userId === userId)
  }

  getAttemptsByQuizId(quizId: string): Attempt[] {
    return this.getAttempts().filter((a) => a.quizId === quizId)
  }

  saveAttempt(attempt: Attempt): void {
    const data = this.getData()
    const index = data.attempts.findIndex((a) => a.id === attempt.id)
    if (index >= 0) {
      data.attempts[index] = attempt
    } else {
      data.attempts.push(attempt)
    }
    this.saveData(data)
  }
}

// Singleton repository export
export const storageRepository = new StorageRepository()
