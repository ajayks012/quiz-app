import { z } from 'zod'
import { QuestionTypeSchema } from '@/types'

export const OptionFormSchema = z.object({
  id: z.string(),
  text: z.string().trim().min(1, 'Option text is required'),
})

export const QuestionFormSchema = z
  .object({
    id: z.string(),
    text: z.string().trim().min(1, 'Question text is required'),
    type: QuestionTypeSchema,
    options: z.array(OptionFormSchema).min(2, 'At least 2 options are required per question'),
    correctOptionIds: z.array(z.string()).min(1, 'Select at least one correct option'),
  })
  .superRefine((val, ctx) => {
    if (val.type === 'single' && val.correctOptionIds.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Single-choice questions must have exactly one correct option',
        path: ['correctOptionIds'],
      })
    }
  })

export const QuizFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim(),
  countries: z.array(z.string()).min(1, 'Assign at least one country'),
  timeLimitSeconds: z.number().int().positive().nullable(),
  perQuestionSeconds: z.number().int().positive().nullable(),
  retakesAllowed: z.boolean(),
  questions: z.array(QuestionFormSchema).min(1, 'At least one question is required'),
})

export type OptionFormData = z.infer<typeof OptionFormSchema>
export type QuestionFormData = z.infer<typeof QuestionFormSchema>
export type QuizFormData = z.infer<typeof QuizFormSchema>
