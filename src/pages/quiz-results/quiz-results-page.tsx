import * as React from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  PageLoader,
} from '@/components/ui'
import { quizService, QuizService } from '@/services'
import { useAppStore } from '@/store'
import type { Attempt, Quiz } from '@/types'
import { cn, formatTime } from '@/utils'
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Check,
  CheckCircle2,
  Clock,
  RotateCcw,
  Trophy,
  X,
  XCircle,
} from 'lucide-react'

export interface QuizResultsPageProps {
  quizId: string
  userId?: string
  service?: QuizService
  onRetake?: (quizId: string) => void
  onNavigateLeaderboard?: (category:string) => void
  onNavigateHome?: () => void
}

export function QuizResultsPage({
  quizId = "",
  userId,
  service = quizService,
  onRetake,
  onNavigateLeaderboard,
  onNavigateHome,
}: QuizResultsPageProps) {
  const currentUser = useAppStore((state) => state.currentUser)
  const effectiveUserId = userId || currentUser?.id

  const [quiz, setQuiz] = React.useState<Quiz | null>(null)
  const [attempt, setAttempt] = React.useState<Attempt | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let isCancelled = false

    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const loadedQuiz = await service.getQuizById(quizId)
        if (isCancelled) return

        if (!loadedQuiz) {
          setError(`Quiz '${quizId}' was not found.`)
          setIsLoading(false)
          return
        }

        setQuiz(loadedQuiz)

        if (effectiveUserId) {
          const userAttempts = await service.getUserAttempts(effectiveUserId)
          if (isCancelled) return

          // Find latest completed attempt for this quiz
          const completedAttempts = userAttempts
            .filter((a) => a.quizId === quizId && a.status === 'completed')
            .sort(
              (a, b) =>
                new Date(b.completedAt ?? b.startedAt).getTime() -
                new Date(a.completedAt ?? a.startedAt).getTime(),
            )

          if (completedAttempts.length > 0) {
            setAttempt(completedAttempts[0])
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load quiz results.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isCancelled = true
    }
  }, [quizId, effectiveUserId, service])

  if (isLoading) {
    return (
      <div className="py-16">
        <PageLoader message="Loading performance analysis..." />
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <Card className="p-6 text-center space-y-4">
          <Alert variant="error" icon={<AlertCircle className="w-5 h-5 text-rose-500" />}>
            {error ?? 'Quiz not found'}
          </Alert>
          <Button variant="outline" onClick={onNavigateHome} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Button>
        </Card>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <Card className="p-8 space-y-4 border-slate-200 dark:border-slate-800">
          <Trophy className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            No Completed Attempts Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {effectiveUserId
              ? `You haven't completed '${quiz.title}' yet.`
              : 'Please select a user to view your personal results.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="primary" onClick={() => onRetake?.(quizId)}>
              Take Quiz Now
            </Button>
            <Button variant="outline" onClick={onNavigateHome}>
              Back to Catalog
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const score = attempt.score ?? 0
  const total = attempt.totalQuestions || quiz.questions.length
  const pct = attempt.percentage ?? Math.round((score / Math.max(1, total)) * 100)

  const isMastery = pct >= 80
  const isPassing = pct >= 50

  const statusVariant = isMastery ? 'success' : isPassing ? 'warning' : 'danger'
  const statusLabel = isMastery
    ? 'Mastery Achieved! 🏆'
    : isPassing
      ? 'Good Effort! 👍'
      : 'Keep Practicing! 📚'

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateHome}
          className="gap-2 text-slate-600 dark:text-slate-400"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Button>

        <div className="flex items-center gap-2">
          {quiz.retakesAllowed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRetake?.(quizId)}
              className="gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={()=>onNavigateLeaderboard(quizId || "")}
            className="gap-1.5 bg-indigo-600 text-white"
          >
            <Trophy className="w-4 h-4" />
            View Leaderboard
          </Button>
        </div>
      </div>

      {/* Hero Score Card */}
      <Card className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Badge variant={statusVariant} size="sm">
                  {statusLabel}
                </Badge>
                {quiz.retakesAllowed ? (
                  <Badge variant="secondary" size="sm">
                    Retakes Allowed
                  </Badge>
                ) : (
                  <Badge variant="secondary" size="sm">
                    Single Attempt
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {quiz.title} Results
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Completed on{' '}
                {new Date(attempt.completedAt ?? attempt.startedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Circular Progress Gauge */}
            <div className="shrink-0 flex flex-col items-center">
              <CircularProgress
                value={score}
                max={total}
                size={108}
                strokeWidth={9}
                variant={statusVariant}
                aria-label={`Score: ${score} out of ${total}, ${pct}%`}
              >
                <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {score}/{total}
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                  {pct}%
                </span>
              </CircularProgress>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Score
              </span>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {score} / {total}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Accuracy
              </span>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{pct}%</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Duration</span>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {attempt.timeTakenSeconds ? formatTime(attempt.timeTakenSeconds) : 'N/A'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>Status</span>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {isPassing ? 'Passed' : 'Failed'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Breakdown Section (Task 52) */}
      {!quiz.retakesAllowed && <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Detailed Question Review</span>
            <Badge variant="secondary" size="sm">
              {quiz.questions.length} questions
            </Badge>
          </h2>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((question, qIdx) => {
            const answer = attempt.answers.find((a) => a.questionId === question.id)
            const isCorrect = Boolean(answer?.isCorrect)
            const selectedIds = answer?.selectedOptionIds ?? []

            return (
              <Card
                key={question.id}
                className={cn(
                  'border transition-colors p-5 shadow-xs',
                  isCorrect
                    ? 'border-emerald-200/80 dark:border-emerald-900/50 bg-white dark:bg-slate-900'
                    : 'border-rose-200/80 dark:border-rose-900/50 bg-white dark:bg-slate-900',
                )}
              >
                <CardHeader className="p-0 pb-3 flex flex-row items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      #{qIdx + 1}
                    </span>
                    <Badge variant="secondary" size="sm">
                      {question.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    {!isCorrect && selectedIds.length === 0 && (
                      <Badge
                        variant="secondary"
                        size="sm"
                        className="text-amber-700 dark:text-amber-400"
                      >
                        Unanswered
                      </Badge>
                    )}
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                        <XCircle className="w-4 h-4" />
                        Incorrect
                      </span>
                    )}
                  </div>
                </CardHeader>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {question.text}
                  </h3>

                  {/* Options List */}
                  <div className="space-y-2 pt-1">
                    {question.options.map((option) => {
                      const wasSelected = selectedIds.includes(option.id)
                      const isCorrectOption = question.correctOptionIds.includes(option.id)

                      let optionStateClasses =
                        'border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300'
                      let tagNode: React.ReactNode = null

                      if (wasSelected && isCorrectOption) {
                        optionStateClasses =
                          'border-emerald-500/80 dark:border-emerald-500/60 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-medium ring-1 ring-emerald-500/30'
                        tagNode = (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                            <Check className="w-3.5 h-3.5" /> Your Answer (Correct)
                          </span>
                        )
                      } else if (wasSelected && !isCorrectOption) {
                        optionStateClasses =
                          'border-rose-400/80 dark:border-rose-600/60 bg-rose-50/70 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100 font-medium ring-1 ring-rose-500/30'
                        tagNode = (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                            <X className="w-3.5 h-3.5" /> Your Answer (Incorrect)
                          </span>
                        )
                      } else if (!wasSelected && isCorrectOption) {
                        optionStateClasses =
                          'border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 font-medium'
                        tagNode = (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <Check className="w-3.5 h-3.5" /> Correct Answer
                          </span>
                        )
                      }

                      return (
                        <div
                          key={option.id}
                          className={cn(
                            'p-3 sm:p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm transition-colors',
                            optionStateClasses,
                          )}
                        >
                          <span className="break-words">{option.text}</span>
                          {tagNode && <div className="shrink-0">{tagNode}</div>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>}
    </div>
  )
}
