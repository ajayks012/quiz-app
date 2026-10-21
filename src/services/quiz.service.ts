import { storageRepository, StorageRepository } from '@/repositories'
import type { Attempt, Country, LeaderboardEntry, LeaderboardFilter, Quiz, User } from '@/types'
import { percentage, sleep, uniqueId } from '@/utils'

export interface QuizFilter {
  country?: string
  search?: string
}

export class QuizService {
  private storage: StorageRepository
  private defaultDelay: number

  constructor(
    storage: StorageRepository = storageRepository,
    defaultDelay = import.meta.env?.MODE === 'test' ? 0 : 150,
  ) {
    this.storage = storage
    this.defaultDelay = defaultDelay
  }

  private async delay(ms?: number): Promise<void> {
    const time = ms ?? this.defaultDelay
    if (time > 0) {
      await sleep(time)
    }
  }

  // --- Quizzes ---

  async getQuizzes(filter?: QuizFilter): Promise<Quiz[]> {
    await this.delay()
    let list = this.storage.getQuizzes()

    if (filter?.country) {
      list = list.filter((q) => q.countries.includes(filter.country!))
    }

    if (filter?.search) {
      const qLower = filter.search.toLowerCase()
      list = list.filter(
        (q) =>
          q.title.toLowerCase().includes(qLower) || q.description.toLowerCase().includes(qLower),
      )
    }

    return list
  }

  async getQuizById(id: string): Promise<Quiz | null> {
    await this.delay()
    return this.storage.getQuizById(id) ?? null
  }

  async createQuiz(data: Omit<Quiz, 'id'>): Promise<Quiz> {
    await this.delay()
    const newQuiz: Quiz = {
      ...data,
      id: uniqueId('quiz'),
    }
    this.storage.saveQuiz(newQuiz)
    return newQuiz
  }

  async updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz> {
    await this.delay()
    const existing = this.storage.getQuizById(id)
    if (!existing) {
      throw new Error(`Quiz with id '${id}' not found.`)
    }

    const updated: Quiz = {
      ...existing,
      ...updates,
      id, // Preserve ID
    }
    this.storage.saveQuiz(updated)
    return updated
  }

  async deleteQuiz(id: string): Promise<boolean> {
    await this.delay()
    return this.storage.deleteQuiz(id)
  }

  // --- Users & Countries ---

  async getUsers(): Promise<User[]> {
    await this.delay()
    return this.storage.getUsers()
  }

  async getUserById(id: string): Promise<User | null> {
    await this.delay()
    return this.storage.getUserById(id) ?? null
  }

  async getCountries(): Promise<Country[]> {
    await this.delay()
    return this.storage.getCountries()
  }

  // --- Quiz Attempt Lifecycle ---

  async startAttempt(quizId: string, userId: string): Promise<Attempt> {
    await this.delay()
    const quiz = this.storage.getQuizById(quizId)
    if (!quiz) {
      throw new Error(`Quiz with id '${quizId}' not found.`)
    }

    const userAttempts = this.storage.getAttemptsByUserId(userId)
    const existingQuizAttempts = userAttempts.filter((a) => a.quizId === quizId)

    // Check for an in-progress attempt to resume
    const inProgress = existingQuizAttempts.find((a) => a.status === 'in_progress')
    if (inProgress) {
      // Check if attempt time limit has expired
      if (quiz.timeLimitSeconds) {
        const elapsed = Math.floor((Date.now() - new Date(inProgress.startedAt).getTime()) / 1000)
        if (elapsed >= quiz.timeLimitSeconds) {
          // Auto-expire and complete attempt
          return this.completeAttempt(inProgress.id)
        }
      }
      return inProgress
    }

    // Check retakes allowance
    if (!quiz.retakesAllowed) {
      const hasCompleted = existingQuizAttempts.some((a) => a.status === 'completed')
      if (hasCompleted) {
        throw new Error('Retakes are not allowed for this quiz.')
      }
    }

    const newAttempt: Attempt = {
      id: uniqueId('attempt'),
      quizId,
      userId,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      currentQuestionIndex: 0,
      answers: [],
      completedAt: null,
      score: null,
      totalQuestions: quiz.questions.length,
      percentage: null,
      timeTakenSeconds: null,
    }

    this.storage.saveAttempt(newAttempt)
    return newAttempt
  }

  async getAttempt(attemptId: string): Promise<Attempt | null> {
    await this.delay()
    return this.storage.getAttemptById(attemptId) ?? null
  }

  async getUserAttempts(userId: string): Promise<Attempt[]> {
    await this.delay()
    return this.storage.getAttemptsByUserId(userId)
  }

  async submitAnswer(
    attemptId: string,
    questionId: string,
    selectedOptionIds: string[],
  ): Promise<Attempt> {
    await this.delay()
    const attempt = this.storage.getAttemptById(attemptId)
    if (!attempt) {
      throw new Error(`Attempt with id '${attemptId}' not found.`)
    }

    if (attempt.status !== 'in_progress') {
      throw new Error('Cannot submit answer for an attempt that is not in progress.')
    }

    const quiz = this.storage.getQuizById(attempt.quizId)
    if (!quiz) {
      throw new Error(`Quiz with id '${attempt.quizId}' not found.`)
    }

    const question = quiz.questions.find((q) => q.id === questionId)
    if (!question) {
      throw new Error(`Question '${questionId}' not found in quiz.`)
    }

    // Check correctness: sorted option array equality
    const sortedSelected = [...selectedOptionIds].sort()
    const sortedCorrect = [...question.correctOptionIds].sort()
    const isCorrect =
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((val, idx) => val === sortedCorrect[idx])

    // Upsert answer
    const existingAnsIndex = attempt.answers.findIndex((a) => a.questionId === questionId)
    const newAnswer = {
      questionId,
      selectedOptionIds,
      isCorrect,
      answeredAt: new Date().toISOString(),
    }

    if (existingAnsIndex >= 0) {
      attempt.answers[existingAnsIndex] = newAnswer
    } else {
      attempt.answers.push(newAnswer)
    }

    // Advance question index if answering current question
    const qIndex = quiz.questions.findIndex((q) => q.id === questionId)
    if (qIndex === attempt.currentQuestionIndex && qIndex < quiz.questions.length - 1) {
      attempt.currentQuestionIndex = qIndex + 1
    }

    // If all questions are answered, complete the attempt automatically
    if (attempt.answers.length >= quiz.questions.length) {
      this.storage.saveAttempt(attempt)
      return this.completeAttempt(attemptId)
    }

    this.storage.saveAttempt(attempt)
    return attempt
  }

  async completeAttempt(attemptId: string): Promise<Attempt> {
    await this.delay()
    const attempt = this.storage.getAttemptById(attemptId)
    if (!attempt) {
      throw new Error(`Attempt with id '${attemptId}' not found.`)
    }

    if (attempt.status === 'completed') {
      return attempt
    }

    const quiz = this.storage.getQuizById(attempt.quizId)
    const totalQuestions = quiz ? quiz.questions.length : attempt.totalQuestions

    const score = attempt.answers.filter((a) => a.isCorrect).length
    const scorePercentage = percentage(score, totalQuestions, 1)

    const now = Date.now()
    const start = new Date(attempt.startedAt).getTime()
    let elapsed = Math.max(0, Math.floor((now - start) / 1000))

    if (quiz?.timeLimitSeconds && elapsed > quiz.timeLimitSeconds) {
      elapsed = quiz.timeLimitSeconds
    }

    attempt.status = 'completed'
    attempt.completedAt = new Date().toISOString()
    attempt.score = score
    attempt.totalQuestions = totalQuestions
    attempt.percentage = scorePercentage
    attempt.timeTakenSeconds = elapsed

    this.storage.saveAttempt(attempt)
    return attempt
  }

  async abandonAttempt(attemptId: string): Promise<Attempt> {
    await this.delay()
    const attempt = this.storage.getAttemptById(attemptId)
    if (!attempt) {
      throw new Error(`Attempt with id '${attemptId}' not found.`)
    }

    attempt.status = 'abandoned'
    attempt.completedAt = new Date().toISOString()
    this.storage.saveAttempt(attempt)
    return attempt
  }

  // --- Leaderboard ---

  async getLeaderboard(filter?: LeaderboardFilter): Promise<LeaderboardEntry[]> {
    await this.delay()
    const attempts = this.storage.getAttempts().filter((a) => a.status === 'completed')
    const users = this.storage.getUsers()
    const quizzes = this.storage.getQuizzes()

    const usersMap = new Map(users.map((u) => [u.id, u]))
    const quizzesMap = new Map(quizzes.map((q) => [q.id, q]))

    const entries: Omit<LeaderboardEntry, 'rank'>[] = []

    for (const a of attempts) {
      const user = usersMap.get(a.userId)
      const quiz = quizzesMap.get(a.quizId)

      if (!user || !quiz) continue

      if (filter?.quizId && a.quizId !== filter.quizId) continue
      if (filter?.country && user.country !== filter.country) continue

      entries.push({
        userId: user.id,
        userName: user.name,
        userCountry: user.country,
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: a.score ?? 0,
        percentage: a.percentage ?? 0,
        timeTakenSeconds: a.timeTakenSeconds ?? 0,
        completedAt: a.completedAt ?? a.startedAt,
      })
    }

    // Rank sorting: score desc, time asc, completedAt asc
    entries.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }
      if (a.timeTakenSeconds !== b.timeTakenSeconds) {
        return a.timeTakenSeconds - b.timeTakenSeconds
      }
      return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    })

    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))
  }

  async resetData(): Promise<void> {
    await this.delay()
    this.storage.reset()
  }
}

// Singleton instance
export const quizService = new QuizService()
