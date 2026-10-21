import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import type { Attempt, Quiz } from '@/types'
import { formatTime } from '@/utils'
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

export interface QuizStartCardProps {
  quiz: Quiz
  effectiveUserId?: string
  priorResult?: Attempt | null
  activeAttempt?: Attempt | null
  canRetake: boolean
  isLoading: boolean
  onStart: () => void
  onResume: () => void
  onViewResults: () => void
  onBack: () => void
}

export function QuizStartCard({
  quiz,
  effectiveUserId,
  priorResult,
  activeAttempt,
  canRetake,
  isLoading,
  onStart,
  onResume,
  onViewResults,
  onBack,
}: QuizStartCardProps) {
  const isRetakeDisallowed = Boolean(priorResult && !canRetake && !activeAttempt)
  const isResumeMode = Boolean(activeAttempt && activeAttempt.status === 'in_progress')

  return (
    <Card className="max-w-3xl mx-auto shadow-sm border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900">
      <CardHeader className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info" size="sm">
              {quiz.questions.length} {quiz.questions.length === 1 ? 'Question' : 'Questions'}
            </Badge>
            {quiz.retakesAllowed ? (
              <Badge variant="success" size="sm">
                Retakes Allowed
              </Badge>
            ) : (
              <Badge variant="secondary" size="sm">
                Single Attempt Only
              </Badge>
            )}
            {quiz.countries.map((c) => (
              <Badge key={c} variant="outline" size="sm">
                {c}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>
              {quiz.timeLimitSeconds ? formatTime(quiz.timeLimitSeconds) : 'No time limit'}
            </span>
          </div>
        </div>

        <div>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {quiz.title}
          </CardTitle>
          {quiz.description && (
            <CardDescription className="text-base text-slate-600 dark:text-slate-300 mt-2">
              {quiz.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* User warning if no active user */}
        {!effectiveUserId && (
          <Alert variant="warning" icon={<AlertCircle className="w-5 h-5" />}>
            Please select a user in the header bar before starting this quiz so your attempt and
            score can be recorded.
          </Alert>
        )}

        {/* Resumable Session Banner (Task 49) */}
        {isResumeMode && activeAttempt && (
          <Alert
            variant="info"
            icon={<Sparkles className="w-5 h-5 text-indigo-500" />}
            title="In-Progress Attempt Found"
          >
            You have an unfinished attempt started on{' '}
            <span className="font-semibold">
              {new Date(activeAttempt.startedAt).toLocaleTimeString()}
            </span>
            . You are currently on Question {activeAttempt.currentQuestionIndex + 1} of{' '}
            {quiz.questions.length}.
          </Alert>
        )}

        {/* Retakes Disallowed Warning (Task 45) */}
        {isRetakeDisallowed && priorResult && (
          <Alert
            variant="warning"
            icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
            title="Quiz Already Completed"
          >
            You completed this quiz with a score of{' '}
            <span className="font-bold">
              {priorResult.score ?? 0} / {quiz.questions.length} (
              {Math.round(((priorResult.score ?? 0) / Math.max(1, quiz.questions.length)) * 100)}%)
            </span>
            . This quiz does not allow retakes.
          </Alert>
        )}

        {/* Prior Best Score Banner (if retakes allowed) */}
        {priorResult && canRetake && !activeAttempt && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50">
            <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                Previous Score:{' '}
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300">
                {priorResult.score ?? 0} / {quiz.questions.length} (
                {Math.round(((priorResult.score ?? 0) / Math.max(1, quiz.questions.length)) * 100)}
                %)
              </span>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                You can retake this quiz at any time to improve your standing.
              </p>
            </div>
          </div>
        )}

        {/* Quiz Specification Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>Questions</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {quiz.questions.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Single & multi-choice items
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Total Time</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {quiz.timeLimitSeconds ? formatTime(quiz.timeLimitSeconds) : 'Untimed'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {quiz.timeLimitSeconds ? 'Timer starts upon launch' : 'Take your time'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Per-Question</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {quiz.perQuestionSeconds ? `${quiz.perQuestionSeconds}s` : 'No Limit'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {quiz.perQuestionSeconds ? 'Auto-advances on expiration' : 'Self-paced'}
            </p>
          </div>
        </div>

        {/* Instructions & Guidelines */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📋 Pre-Quiz Guidelines</span>
          </h4>
          <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
            <li>Questions are presented one at a time. Once you proceed, your answer is logged.</li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">Single-choice:</span>{' '}
              Select exactly 1 answer.
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">Multiple-choice:</span>{' '}
              Select all options that apply.
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">
                Keyboard shortcuts:
              </span>{' '}
              Press numbers <span className="font-mono font-bold">1–9</span> to pick options, and{' '}
              <span className="font-mono font-bold">Enter</span> to advance.
            </li>
            <li>
              If a timer is enabled, the question or quiz will automatically submit when time
              expires.
            </li>
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button variant="ghost" onClick={onBack}>
          Back to Quizzes
        </Button>

        <div className="flex items-center gap-2">
          {isRetakeDisallowed ? (
            <Button variant="primary" onClick={onViewResults}>
              View Prior Results
            </Button>
          ) : isResumeMode ? (
            <Button
              variant="primary"
              size="lg"
              onClick={onResume}
              loading={isLoading}
              disabled={isLoading}
              className="gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Resume Quiz
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={onStart}
              loading={isLoading}
              disabled={isLoading || !effectiveUserId}
              className="gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              {priorResult ? 'Retake Quiz' : 'Start Quiz'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
