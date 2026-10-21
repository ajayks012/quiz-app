import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  ConfirmDialog,
  ProgressBar,
} from '@/components/ui'
import type { Question } from '@/types'
import { cn, formatTime } from '@/utils'
import { AlertTriangle, ArrowRight, Check, CheckSquare, Clock, LogOut, Square } from 'lucide-react'

export interface QuizQuestionCardProps {
  quizTitle: string
  question: Question
  questionIndex: number
  totalQuestions: number
  selectedOptionIds: string[]
  isSubmitting: boolean
  overallSecondsLeft: number | null
  overallTotalSeconds: number | null
  questionSecondsLeft: number | null
  questionTotalSeconds: number | null
  onSelectOption: (optionId: string) => void
  onSubmitAnswer: () => void
  onLeaveQuiz: () => void
}

export function QuizQuestionCard({
  quizTitle,
  question,
  questionIndex,
  totalQuestions,
  selectedOptionIds,
  isSubmitting,
  overallSecondsLeft,
  overallTotalSeconds,
  questionSecondsLeft,
  questionTotalSeconds,
  onSelectOption,
  onSubmitAnswer,
  onLeaveQuiz,
}: QuizQuestionCardProps) {
  const [showExitConfirm, setShowExitConfirm] = React.useState(false)
  const isReducedMotion = useReducedMotion()

  const isSingle = question.type === 'single'
  const isLastQuestion = questionIndex === totalQuestions - 1
  const progressPercent = Math.round(((questionIndex + 1) / Math.max(1, totalQuestions)) * 100)

  // Timer warning conditions (less than 60 seconds or 25% remaining)
  const isOverallUrgent =
    overallSecondsLeft !== null &&
    (overallSecondsLeft <= 60 ||
      (overallTotalSeconds ? overallSecondsLeft / overallTotalSeconds <= 0.2 : false))
  const isQuestionUrgent =
    questionSecondsLeft !== null &&
    (questionSecondsLeft <= 10 ||
      (questionTotalSeconds ? questionSecondsLeft / questionTotalSeconds <= 0.25 : false))

  // Keyboard shortcut listener (Task 50)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is interacting with an input, select or textarea
      const target = e.target as HTMLElement | null
      const tagName = target?.tagName?.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return
      }

      // Enter key -> Submit answer
      if (e.key === 'Enter') {
        e.preventDefault()
        if (!isSubmitting) {
          onSubmitAnswer()
        }
        return
      }

      // Number keys 1-9 -> select option
      const keyNum = parseInt(e.key, 10)
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= question.options.length) {
        e.preventDefault()
        const targetOption = question.options[keyNum - 1]
        if (targetOption && !isSubmitting) {
          onSelectOption(targetOption.id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question.options, isSubmitting, onSubmitAnswer, onSelectOption])

  // Framer motion variants respecting prefers-reduced-motion (Task 51)
  const motionVariants = {
    initial: isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 },
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Header: Progress & Timers (Task 47) */}
      <Card className="border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {quizTitle}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {`Question ${questionIndex + 1}`}{' '}
                <span className="text-slate-400 font-normal">of {totalQuestions}</span>
              </h2>
              <Badge variant="secondary" size="sm">
                {progressPercent}%
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Per Question Timer (if enabled) */}
            {questionSecondsLeft !== null && (
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors',
                  isQuestionUrgent
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200',
                )}
                title="Time remaining for this question"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Q: {formatTime(questionSecondsLeft)}</span>
              </div>
            )}

            {/* Overall Quiz Timer (if enabled) */}
            {overallSecondsLeft !== null && (
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors',
                  isOverallUrgent
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 animate-pulse'
                    : 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300',
                )}
                title="Overall quiz time remaining"
              >
                {isOverallUrgent && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                <Clock className="w-3.5 h-3.5" />
                <span>Total: {formatTime(overallSecondsLeft)}</span>
              </div>
            )}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowExitConfirm(true)}
              className="text-slate-500 hover:text-rose-600 gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Exit</span>
            </Button>
          </div>
        </div>

        {/* Linear progress bar */}
        <ProgressBar
          value={questionIndex + 1}
          max={totalQuestions}
          variant="primary"
          size="sm"
          className="mt-1"
        />
      </Card>

      {/* Main Question Card with Motion Transition (Tasks 46 & 51) */}
      <motion.div
        key={question.id}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={motionVariants}
        transition={{ duration: isReducedMotion ? 0 : 0.2 }}
      >
        <Card className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="info" size="sm" className="font-semibold">
                {isSingle ? 'Single Choice' : 'Multiple Choice'}
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isSingle ? 'Select 1 option' : 'Select all that apply'}
              </span>
            </div>

            <h3
              id={`question-title-${question.id}`}
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug"
            >
              {question.text}
            </h3>
          </CardHeader>

          <CardContent className="space-y-3 pt-2 pb-6">
            <div
              role={isSingle ? 'radiogroup' : 'group'}
              aria-labelledby={`question-title-${question.id}`}
              className="space-y-2.5"
            >
              {question.options.map((option, idx) => {
                const isSelected = selectedOptionIds.includes(option.id)
                const shortcutKey = idx + 1 <= 9 ? String(idx + 1) : null

                return (
                  <div
                    key={option.id}
                    role={isSingle ? 'radio' : 'checkbox'}
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => !isSubmitting && onSelectOption(option.id)}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault()
                        if (!isSubmitting) onSelectOption(option.id)
                      }
                    }}
                    className={cn(
                      'group relative flex items-center justify-between p-4 rounded-xl border text-left cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50',
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/25 ring-1 ring-indigo-500/30'
                        : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40',
                      isSubmitting && 'opacity-60 cursor-not-allowed',
                    )}
                  >
                    <div className="flex items-center gap-3.5 pr-3 min-w-0">
                      {/* Keyboard shortcut badge */}
                      {shortcutKey && (
                        <span
                          className={cn(
                            'shrink-0 flex items-center justify-center w-6 h-6 rounded-md text-xs font-mono font-bold transition-colors',
                            isSelected
                              ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700',
                          )}
                        >
                          {shortcutKey}
                        </span>
                      )}

                      <span
                        className={cn(
                          'text-base font-medium break-words leading-relaxed',
                          isSelected
                            ? 'text-indigo-950 dark:text-indigo-100 font-semibold'
                            : 'text-slate-800 dark:text-slate-200',
                        )}
                      >
                        {option.text}
                      </span>
                    </div>

                    <div className="shrink-0 text-indigo-600 dark:text-indigo-400 ml-2">
                      {isSingle ? (
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                            isSelected
                              ? 'border-indigo-600 dark:border-indigo-400'
                              : 'border-slate-300 dark:border-slate-600 group-hover:border-slate-400',
                          )}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                          )}
                        </div>
                      ) : isSelected ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Keyboard hint */}
            <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1.5">
              <span>Keys</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] font-bold">
                1–9
              </kbd>
              <span>to select,</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] font-bold">
                Enter
              </kbd>
              <span>to advance</span>
            </div>

            {/* Answer submission button (Task 48) */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={onSubmitAnswer}
              loading={isSubmitting}
              disabled={isSubmitting}
              className="gap-2 ml-auto w-full sm:w-auto"
            >
              <span>{isLastQuestion ? 'Submit & Finish' : 'Next Question'}</span>
              {isLastQuestion ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Confirmation Dialog on exit */}
      <ConfirmDialog
        open={showExitConfirm}
        onOpenChange={setShowExitConfirm}
        title="Leave Quiz Session?"
        description="Your progress is saved, but the timer will keep running in the background. You can resume at any time before it expires."
        confirmText="Leave Quiz"
        cancelText="Continue Playing"
        variant="destructive"
        onConfirm={() => {
          setShowExitConfirm(false)
          onLeaveQuiz()
        }}
      />

      {/* Live Region for Screen Readers (Task 50) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Question {questionIndex + 1} of {totalQuestions}: {question.text}.{' '}
        {selectedOptionIds.length} option{selectedOptionIds.length === 1 ? '' : 's'} selected.
      </div>
    </div>
  )
}
