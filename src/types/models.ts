import { z } from 'zod'

// 1. Country Model
export const CountrySchema = z.object({
  code: z.string().min(2).max(3),
  name: z.string().min(1),
})
export type Country = z.infer<typeof CountrySchema>

// 2. User Model
export const UserRoleSchema = z.enum(['user', 'admin'])
export type UserRole = z.infer<typeof UserRoleSchema>

export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  country: z.string().min(2).max(3),
  role: UserRoleSchema,
})
export type User = z.infer<typeof UserSchema>

// 3. Option Model
export const OptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1, 'Option text is required'),
})
export type Option = z.infer<typeof OptionSchema>

// 4. Question Model
export const QuestionTypeSchema = z.enum(['single', 'multiple'])
export type QuestionType = z.infer<typeof QuestionTypeSchema>

export const QuestionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1, 'Question text is required'),
  type: QuestionTypeSchema,
  options: z.array(OptionSchema).min(2, 'At least 2 options are required'),
  correctOptionIds: z.array(z.string()).min(1, 'At least 1 correct option must be selected'),
})
export type Question = z.infer<typeof QuestionSchema>

// 5. Quiz Model
export const QuizSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(1, 'Description is required'),
  countries: z.array(z.string()).min(1, 'Select at least one eligible country'),
  timeLimitSeconds: z.number().int().positive('Time limit must be positive').nullable(),
  perQuestionSeconds: z.number().int().positive().nullable(),
  retakesAllowed: z.boolean(),
  questions: z.array(QuestionSchema).min(1, 'Quiz must have at least one question'),
})
export type Quiz = z.infer<typeof QuizSchema>

// 6. Answer Model
export const AnswerSchema = z.object({
  questionId: z.string().min(1),
  selectedOptionIds: z.array(z.string()),
  isCorrect: z.boolean(),
  answeredAt: z.string(),
})
export type Answer = z.infer<typeof AnswerSchema>

// 7. Attempt Model
export const AttemptStatusSchema = z.enum(['in_progress', 'completed', 'abandoned'])
export type AttemptStatus = z.infer<typeof AttemptStatusSchema>

export const AttemptSchema = z.object({
  id: z.string().min(1),
  quizId: z.string().min(1),
  userId: z.string().min(1),
  status: AttemptStatusSchema,
  startedAt: z.string(),
  currentQuestionIndex: z.number().int().nonnegative(),
  answers: z.array(AnswerSchema),
  completedAt: z.string().nullable(),
  score: z.number().int().nonnegative().nullable(),
  totalQuestions: z.number().int().positive(),
  percentage: z.number().nonnegative().nullable(),
  timeTakenSeconds: z.number().int().nonnegative().nullable(),
})
export type Attempt = z.infer<typeof AttemptSchema>

// 8. Leaderboard Models
export const LeaderboardEntrySchema = z.object({
  userId: z.string(),
  userName: z.string(),
  userCountry: z.string(),
  quizId: z.string(),
  quizTitle: z.string(),
  score: z.number(),
  percentage: z.number(),
  timeTakenSeconds: z.number(),
  completedAt: z.string(),
  rank: z.number().int().positive(),
})
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>

export interface LeaderboardFilter {
  quizId?: string
  country?: string
}

// 9. Root Database / Seed Schema
export const SeedDataSchema = z.object({
  meta: z.object({
    version: z.number(),
    generatedAt: z.string(),
    notes: z.string().optional(),
  }),
  countries: z.array(CountrySchema),
  users: z.array(UserSchema),
  quizzes: z.array(QuizSchema),
  attempts: z.array(AttemptSchema),
})
export type SeedData = z.infer<typeof SeedDataSchema>
