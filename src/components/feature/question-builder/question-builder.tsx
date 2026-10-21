import {
  type Control,
  type FieldErrors,
  useFieldArray,
  type UseFormSetValue,
  useWatch,
} from 'react-hook-form'
import { ArrowDown, ArrowUp, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { uniqueId } from '@/utils'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Input,
  Select,
} from '@/components/ui'
import type { QuizFormData } from '../quiz-form/quiz-form.schema'

export interface QuestionBuilderProps {
  control: Control<QuizFormData>
  setValue: UseFormSetValue<QuizFormData>
  errors: FieldErrors<QuizFormData>
}

export function QuestionBuilder({ control, setValue, errors }: QuestionBuilderProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'questions',
  })

  const watchedQuestions = useWatch({ control, name: 'questions' })
  const questions = watchedQuestions ?? []

  const handleAddQuestion = () => {
    const qId = uniqueId('q')
    const o1Id = uniqueId('opt')
    const o2Id = uniqueId('opt')

    append({
      id: qId,
      text: '',
      type: 'single',
      options: [
        { id: o1Id, text: '' },
        { id: o2Id, text: '' },
      ],
      correctOptionIds: [o1Id],
    })
  }

  const handleAddOption = (qIndex: number) => {
    const currentQ = questions[qIndex]
    if (!currentQ) return

    const newOpt = { id: uniqueId('opt'), text: '' }
    setValue(`questions.${qIndex}.options`, [...currentQ.options, newOpt], {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const handleRemoveOption = (qIndex: number, optId: string) => {
    const currentQ = questions[qIndex]
    if (!currentQ || currentQ.options.length <= 2) return

    const newOptions = currentQ.options.filter((o) => o.id !== optId)
    const newCorrect = currentQ.correctOptionIds.filter((id) => id !== optId)

    // Ensure at least one correct option remains if possible
    if (newCorrect.length === 0 && newOptions.length > 0) {
      newCorrect.push(newOptions[0].id)
    }

    setValue(`questions.${qIndex}.options`, newOptions, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setValue(`questions.${qIndex}.correctOptionIds`, newCorrect, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const handleToggleCorrectOption = (qIndex: number, optId: string) => {
    const currentQ = questions[qIndex]
    if (!currentQ) return

    if (currentQ.type === 'single') {
      setValue(`questions.${qIndex}.correctOptionIds`, [optId], {
        shouldValidate: true,
        shouldDirty: true,
      })
    } else {
      const isAlready = currentQ.correctOptionIds.includes(optId)
      const updated = isAlready
        ? currentQ.correctOptionIds.filter((id) => id !== optId)
        : [...currentQ.correctOptionIds, optId]

      setValue(`questions.${qIndex}.correctOptionIds`, updated, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }

  const handleTypeChange = (qIndex: number, newType: 'single' | 'multiple') => {
    const currentQ = questions[qIndex]
    if (!currentQ) return

    setValue(`questions.${qIndex}.type`, newType, {
      shouldValidate: true,
      shouldDirty: true,
    })

    if (newType === 'single' && currentQ.correctOptionIds.length > 1) {
      setValue(`questions.${qIndex}.correctOptionIds`, [currentQ.correctOptionIds[0]], {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Questions ({fields.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define questions, single/multiple-choice answers, and correct keys.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAddQuestion}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </Button>
      </div>

      {errors.questions?.message && (
        <p className="text-xs font-semibold text-rose-500" role="alert">
          {errors.questions.message}
        </p>
      )}

      {fields.map((field, qIndex) => {
        const qError = errors.questions?.[qIndex]
        const currentQ = questions[qIndex] ?? field
        const isSingle = currentQ.type === 'single'

        return (
          <Card
            key={field.id}
            className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 space-y-4"
          >
            <CardHeader className="p-0 flex flex-row items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="info" size="sm" className="font-mono">
                  #{qIndex + 1}
                </Badge>
                <div className="w-36">
                  <Select
                    id={`q-type-${qIndex}`}
                    size="sm"
                    value={currentQ.type}
                    onChange={(val) => handleTypeChange(qIndex, val as 'single' | 'multiple')}
                    options={[
                      { value: 'single', label: 'Single Choice' },
                      { value: 'multiple', label: 'Multiple Choice' },
                    ]}
                  />
                </div>
              </div>

              {/* Reorder and Delete tools */}
              <div className="flex items-center gap-1">
                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={qIndex === 0}
                  onClick={() => move(qIndex, qIndex - 1)}
                  aria-label={`Move Question ${qIndex + 1} up`}
                  title="Move up"
                >
                  <ArrowUp className="w-4 h-4 text-slate-500" />
                </IconButton>

                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={qIndex === fields.length - 1}
                  onClick={() => move(qIndex, qIndex + 1)}
                  aria-label={`Move Question ${qIndex + 1} down`}
                  title="Move down"
                >
                  <ArrowDown className="w-4 h-4 text-slate-500" />
                </IconButton>

                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={fields.length <= 1}
                  onClick={() => remove(qIndex)}
                  aria-label={`Delete Question ${qIndex + 1}`}
                  title="Delete question"
                  className="hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </IconButton>
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              {/* Question Text */}
              <div>
                <Input
                  id={`q-text-${qIndex}`}
                  placeholder={`Question ${qIndex + 1} text...`}
                  value={currentQ.text}
                  onChange={(e) =>
                    setValue(`questions.${qIndex}.text`, e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  error={Boolean(qError?.text)}
                  errorText={qError?.text?.message}
                />
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Options ({currentQ.options.length}) — Mark correct answer
                    {isSingle ? '' : 's'}:
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => handleAddOption(qIndex)}
                    className="gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                  >
                    <Plus className="w-3 h-3" />
                    Add Option
                  </Button>
                </div>

                {qError?.correctOptionIds?.message && (
                  <p className="text-xs font-medium text-rose-500" role="alert">
                    {qError.correctOptionIds.message}
                  </p>
                )}

                <div className="space-y-2">
                  {currentQ.options.map((opt, oIndex) => {
                    const isCorrect = currentQ.correctOptionIds.includes(opt.id)
                    const optError = qError?.options?.[oIndex]

                    return (
                      <div
                        key={opt.id}
                        className="flex items-center gap-2 group/opt rounded-lg border border-slate-200/80 dark:border-slate-800 p-1.5 bg-slate-50/50 dark:bg-slate-900/40"
                      >
                        {/* Correct indicator toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleCorrectOption(qIndex, opt.id)}
                          className={`shrink-0 p-1 rounded-md transition-colors ${
                            isCorrect
                              ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
                              : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
                          }`}
                          title={isCorrect ? 'Marked as correct' : 'Click to mark as correct'}
                          aria-label={`Mark option ${oIndex + 1} as correct`}
                        >
                          <CheckCircle2 className="w-4 h-4 fill-current" />
                        </button>

                        <div className="flex-1">
                          <Input
                            placeholder={`Option ${oIndex + 1}...`}
                            value={opt.text}
                            onChange={(e) => {
                              const newOpts = [...currentQ.options]
                              newOpts[oIndex] = { ...opt, text: e.target.value }
                              setValue(`questions.${qIndex}.options`, newOpts, {
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                            }}
                            size="sm"
                            error={Boolean(optError?.text)}
                            errorText={optError?.text?.message}
                          />
                        </div>

                        {/* Delete option button */}
                        <IconButton
                          type="button"
                          variant="ghost"
                          size="xs"
                          disabled={currentQ.options.length <= 2}
                          onClick={() => handleRemoveOption(qIndex, opt.id)}
                          aria-label={`Delete option ${oIndex + 1}`}
                          title="Delete option"
                          className="hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </IconButton>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      <div className="pt-2 flex justify-center">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleAddQuestion}
          className="gap-2 border-dashed w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Another Question
        </Button>
      </div>
    </div>
  )
}
