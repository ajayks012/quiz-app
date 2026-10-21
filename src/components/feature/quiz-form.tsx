import * as React from 'react'
import { useForm, useWatch, type SubmitHandler, type SubmitErrorHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Globe, Save, X } from 'lucide-react'
import { Button, ConfirmDialog, Input, MultiSelect, Switch, TextArea, toast } from '@/components/ui'
import { QuestionBuilder } from './question-builder'
import { QuizFormSchema, type QuizFormData } from './quiz-form.schema'
import { useAppStore } from '@/store'
import type { Quiz } from '@/types'
import { uniqueId } from '@/utils'

export interface QuizFormProps {
  initialData?: Quiz | null
  onSubmit: (data: QuizFormData) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}

export function QuizForm({ initialData, onSubmit, onCancel, isSubmitting = false }: QuizFormProps) {
  const { countries } = useAppStore()
  const [showDiscardConfirm, setShowDiscardConfirm] = React.useState(false)

  const defaultValues: QuizFormData = React.useMemo(() => {
    if (initialData) {
      return {
        title: initialData.title,
        description: initialData.description,
        countries: initialData.countries,
        timeLimitSeconds: initialData.timeLimitSeconds,
        perQuestionSeconds: initialData.perQuestionSeconds,
        retakesAllowed: initialData.retakesAllowed,
        questions: initialData.questions,
      }
    }

    const q1Id = uniqueId('q')
    const o1Id = uniqueId('opt')
    const o2Id = uniqueId('opt')

    return {
      title: '',
      description: '',
      countries: countries.length > 0 ? [countries[0].code] : ['US'],
      timeLimitSeconds: null,
      perQuestionSeconds: null,
      retakesAllowed: true,
      questions: [
        {
          id: q1Id,
          text: '',
          type: 'single',
          options: [
            { id: o1Id, text: '' },
            { id: o2Id, text: '' },
          ],
          correctOptionIds: [o1Id],
        },
      ],
    }
  }, [initialData, countries])

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<QuizFormData>({
    resolver: zodResolver(QuizFormSchema),
    defaultValues,
    mode: 'onTouched',
  })

  // Reset form when initialData changes
  React.useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  // Browser navigation warning for unsaved changes (Task 44)
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const handleCancelClick = () => {
    if (isDirty) {
      setShowDiscardConfirm(true)
    } else {
      onCancel()
    }
  }

  const countryOptions = React.useMemo(() => {
    return countries.map((c) => ({
      value: c.code,
      label: `${c.name} (${c.code})`,
    }))
  }, [countries])

  const watchedCountries = useWatch({ control, name: 'countries' })
  const watchedRetakes = useWatch({ control, name: 'retakesAllowed' })
  const watchedTimeLimit = useWatch({ control, name: 'timeLimitSeconds' })
  const watchedPerQuestion = useWatch({ control, name: 'perQuestionSeconds' })
  const watchedTitle = useWatch({ control, name: 'title' })
  const watchedDescription = useWatch({ control, name: 'description' })

  const onValid: SubmitHandler<QuizFormData> = (data) => {
    return onSubmit(data)
  }

  const onInvalid: SubmitErrorHandler<QuizFormData> = (fieldErrors) => {
    const errorEntries = Object.entries(fieldErrors)
    if (errorEntries.length > 0) {
      const [field, err] = errorEntries[0]
      let msg = (err as { message?: string })?.message
      if (!msg && field === 'questions') {
        msg = 'Please fill in question texts, answer options, and select correct answers.'
      }
      toast.error(msg || 'Please fix form validation errors before saving.', 'Form Incomplete')
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onValid, onInvalid)}
        className="flex flex-col h-full max-h-[88vh]"
      >
        {/* Modal Sticky Header */}
        <div className="px-6 py-4 pr-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10 shrink-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialData ? 'Edit Quiz' : 'Create New Quiz'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure quiz metadata, countries, time constraints, and retake policy.
          </p>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
          {/* Basic Information Section */}
          <div className="p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quiz Details & Settings
            </h3>

            <div className="grid grid-cols-1 gap-5">
              {/* Title */}
              <div>
                <label
                  htmlFor="quiz-title-input"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                >
                  Quiz Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="quiz-title-input"
                  placeholder="e.g., JavaScript Essentials"
                  value={watchedTitle ?? ''}
                  onChange={(e) =>
                    setValue('title', e.target.value, { shouldValidate: true, shouldDirty: true })
                  }
                  error={Boolean(errors.title)}
                  errorText={errors.title?.message}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="quiz-description-input"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                >
                  Description
                </label>
                <TextArea
                  id="quiz-description-input"
                  placeholder="Brief summary of quiz coverage and target audience..."
                  rows={3}
                  value={watchedDescription ?? ''}
                  onChange={(e) =>
                    setValue('description', e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  error={Boolean(errors.description)}
                  errorText={errors.description?.message}
                />
              </div>

              {/* Countries Multi-Select */}
              <div>
                <label
                  htmlFor="assigned-countries-select"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                >
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    Assigned Countries <span className="text-rose-500">*</span>
                  </span>
                </label>
                <MultiSelect
                  id="assigned-countries-select"
                  options={countryOptions}
                  values={watchedCountries}
                  onChange={(selected) =>
                    setValue('countries', selected, { shouldValidate: true, shouldDirty: true })
                  }
                  placeholder="Select eligible countries..."
                  error={Boolean(errors.countries)}
                  errorText={errors.countries?.message}
                />
              </div>

              {/* Timing Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <div>
                  <label
                    htmlFor="quiz-timelimit-input"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    Total Time Limit (seconds)
                  </label>
                  <Input
                    id="quiz-timelimit-input"
                    type="number"
                    placeholder="e.g. 180 (leave empty for untimed)"
                    value={watchedTimeLimit ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : parseInt(e.target.value, 10)
                      setValue('timeLimitSeconds', isNaN(val as number) ? null : val, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }}
                    helperText="Leave empty if overall quiz has no countdown"
                    error={Boolean(errors.timeLimitSeconds)}
                    errorText={errors.timeLimitSeconds?.message}
                  />
                </div>

                <div>
                  <label
                    htmlFor="quiz-perquestion-input"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    Per-Question Limit (seconds)
                  </label>
                  <Input
                    id="quiz-perquestion-input"
                    type="number"
                    placeholder="e.g. 30 (leave empty for none)"
                    value={watchedPerQuestion ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : parseInt(e.target.value, 10)
                      setValue('perQuestionSeconds', isNaN(val as number) ? null : val, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }}
                    helperText="Leave empty if individual questions are untimed"
                    error={Boolean(errors.perQuestionSeconds)}
                    errorText={errors.perQuestionSeconds?.message}
                  />
                </div>
              </div>

              {/* Retakes Switch */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Allow Retakes
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    If disabled, candidates can only submit this quiz once.
                  </p>
                </div>

                <Switch
                  id="retakes-allowed-switch"
                  checked={watchedRetakes}
                  onCheckedChange={(checked) =>
                    setValue('retakesAllowed', checked, { shouldValidate: true, shouldDirty: true })
                  }
                  aria-label="Allow quiz retakes"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Question Builder Section */}
          <div className="p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <QuestionBuilder control={control} setValue={setValue} errors={errors} />
          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm sticky bottom-0 z-10 flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleCancelClick}
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
            className="gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            {initialData ? 'Save Changes' : 'Create Quiz'}
          </Button>
        </div>
      </form>

      {/* Discard Changes Confirmation Dialog (Task 44) */}
      <ConfirmDialog
        open={showDiscardConfirm}
        onOpenChange={setShowDiscardConfirm}
        title="Discard Unsaved Changes?"
        description="You have modified quiz details or questions. If you leave now, your changes will be lost."
        confirmText="Discard Changes"
        cancelText="Keep Editing"
        variant="destructive"
        onConfirm={() => {
          setShowDiscardConfirm(false)
          onCancel()
        }}
      />
    </>
  )
}
