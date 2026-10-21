import * as React from 'react'
import { Award, CheckCircle2, Clock, Globe, HelpCircle, Play, RotateCcw } from 'lucide-react'
import { cn, formatTime } from '@/utils'
import {
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

export interface QuizCardProps {
  quiz: Quiz
  userAttempts?: Attempt[]
  onSelect?: (quizId: string) => void
  onViewResults?: (quizId: string) => void
  className?: string
}

export function QuizCard({
  quiz,
  userAttempts = [],
  onSelect,
  onViewResults,
  className,
}: QuizCardProps) {
  const quizAttempts = React.useMemo(
    () => userAttempts.filter((a) => a.quizId === quiz.id),
    [userAttempts, quiz.id],
  )

  const inProgressAttempt = React.useMemo(
    () => quizAttempts.find((a) => a.status === 'in_progress'),
    [quizAttempts],
  )

  const completedAttempts = React.useMemo(
    () => quizAttempts.filter((a) => a.status === 'completed'),
    [quizAttempts],
  )

  const isCompleted = completedAttempts.length > 0
  const canRetake = quiz.retakesAllowed

  const bestScore = React.useMemo(() => {
    if (!isCompleted) return null
    return Math.max(...completedAttempts.map((a) => a.percentage ?? 0))
  }, [completedAttempts, isCompleted])

  // Formatting time display
  const timingText = React.useMemo(() => {
    if (quiz.timeLimitSeconds) {
      return `${formatTime(quiz.timeLimitSeconds, 'auto')} total`
    }
    if (quiz.perQuestionSeconds) {
      return `${quiz.perQuestionSeconds}s / question`
    }
    return 'Untimed'
  }, [quiz.timeLimitSeconds, quiz.perQuestionSeconds])

  const handleAction = () => {
    if (isCompleted && !canRetake && !inProgressAttempt) {
      if (onViewResults) {
        onViewResults(quiz.id)
      } else {
        onSelect?.(quiz.id)
      }
    } else {
      onSelect?.(quiz.id)
    }
  }

  return (
    <Card
      variant="interactive"
      className={cn(
        'flex flex-col justify-between h-full border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200',
        className,
      )}
    >
      <div>
        <CardHeader className="pb-3">
          {/* Top badges / status row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" size="sm" className="font-mono text-[11px] gap-1">
                <HelpCircle className="w-3 h-3 text-slate-500" />
                {quiz.questions.length} Qs
              </Badge>
              <Badge variant="outline" size="sm" className="font-mono text-[11px] gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {timingText}
              </Badge>
            </div>

            {/* Completion / In-progress badges */}
            {inProgressAttempt ? (
              <Badge variant="warning" size="sm" className="animate-pulse font-semibold">
                In Progress
              </Badge>
            ) : isCompleted ? (
              <Badge variant="success" size="sm" className="gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                {bestScore !== null ? `Best: ${bestScore}%` : 'Completed'}
              </Badge>
            ) : null}
          </div>

          <CardTitle className="text-lg line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {quiz.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 mt-1 text-sm text-slate-600 dark:text-slate-400">
            {quiz.description || 'No description provided.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 pb-3">
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mr-1">
              <Globe className="w-3 h-3" />
              Countries:
            </span>
            {quiz.countries.map((c) => (
              <span
                key={c}
                className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {c}
              </span>
            ))}
            {!canRetake && (
              <span className="ml-auto text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">
                1 attempt only
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {inProgressAttempt ? (
          <Button
            variant="primary"
            size="md"
            className="w-full gap-2 shadow-xs"
            onClick={handleAction}
          >
            <Play className="w-4 h-4 fill-current" />
            Resume Quiz
          </Button>
        ) : isCompleted && !canRetake ? (
          <Button variant="secondary" size="md" className="w-full gap-2" onClick={handleAction}>
            <Award className="w-4 h-4 text-indigo-500" />
            View Prior Results
          </Button>
        ) : isCompleted && canRetake ? (
          <Button
            variant="outline"
            size="md"
            className="w-full gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400"
            onClick={handleAction}
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            className="w-full gap-2 shadow-xs"
            onClick={handleAction}
          >
            <Play className="w-4 h-4 fill-current" />
            Start Quiz
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
