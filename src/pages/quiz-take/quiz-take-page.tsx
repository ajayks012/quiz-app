import * as React from 'react'
import { Alert, Button, Card, PageLoader } from '@/components/ui'
import { QuizQuestionCard, QuizStartCard } from '@/components/feature'
import { useQuizAttempt } from '@/hooks'
import type { QuizService } from '@/services'
import { useAppStore } from '@/store'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

export interface QuizTakePageProps {
  quizId: string
  onComplete?: (quizId: string) => void
  onNavigateHome?: () => void
  onNavigateResults?: (quizId: string) => void
  service?: QuizService
}

export function QuizTakePage({
  quizId,
  onComplete,
  onNavigateHome,
  onNavigateResults,
  service,
}: QuizTakePageProps) {
  const currentUser = useAppStore((state) => state.currentUser)

  const {
    quiz,
    attempt,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedOptionIds,
    isLoading,
    isSubmitting,
    isCompleted,
    error,
    priorResult,
    canRetake,
    overallCountdown,
    questionCountdown,
    start,
    selectOption,
    submitAnswer,
    completeEarly,
  } = useQuizAttempt({
    quizId,
    userId: currentUser?.id,
    service,
  })

  // When attempt completes, notify callback
  React.useEffect(() => {
    if (isCompleted && onComplete) {
      onComplete(quizId)
    }
  }, [isCompleted, onComplete, quizId])

  // Loading state
  if (isLoading && !quiz) {
    return (
      <div className="py-16">
        <PageLoader message="Preparing quiz environment..." />
      </div>
    )
  }

  // Error state (e.g. quiz not found or deleted)
  if (error && !quiz) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <Card className="p-6 border-slate-200 dark:border-slate-800 text-center space-y-4">
          <Alert variant="error" icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}>
            {error}
          </Alert>
          <Button variant="outline" onClick={onNavigateHome} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Quizzes
          </Button>
        </Card>
      </div>
    )
  }

  if (!quiz) {
    return null
  }

  if(overallCountdown.remainingSeconds === 0){

    return (<div className="max-w-xl mx-auto py-12 px-4 text-center">
        <Card className="p-8 border-slate-200 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900">
          
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Quiz Time limit exhausted!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your answers have been calculated and saved to the leaderboard.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="primary" onClick={() => onNavigateResults?.(quizId)}>
              View Results & Breakdown
            </Button>
            <Button variant="outline" onClick={completeEarly}>
              Back to Quizzes
            </Button>
          </div>
        </Card>
      </div>)
  }

  // Active in-progress question screen (Tasks 46–51)
  if (attempt?.status === 'in_progress' && currentQuestion) {
    return (
      <div className="py-6 px-4">
        <QuizQuestionCard
          quizTitle={quiz.title}
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          selectedOptionIds={selectedOptionIds}
          isSubmitting={isSubmitting}
          overallSecondsLeft={
            quiz.timeLimitSeconds != null ? overallCountdown.remainingSeconds : null
          }
          overallTotalSeconds={quiz.timeLimitSeconds}
          questionSecondsLeft={
            quiz.perQuestionSeconds != null ? questionCountdown.remainingSeconds : null
          }
          questionTotalSeconds={quiz.perQuestionSeconds}
          onSelectOption={selectOption}
          onSubmitAnswer={submitAnswer}
          onLeaveQuiz={() => onNavigateHome?.()}
        />
      </div>
    )
  }

  // Completed State View (if user completed attempt and hasn't navigated yet)
  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <Card className="p-8 border-slate-200 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold text-xl">
            ✓
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Quiz Completed!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your answers have been calculated and saved to the leaderboard.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="primary" onClick={() => onNavigateResults?.(quizId)}>
              View Results & Breakdown
            </Button>
            <Button variant="outline" onClick={onNavigateHome}>
              Back to Quizzes
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Start Screen View (Task 45)
  return (
    <div className="py-8 px-4">
      <QuizStartCard
        quiz={quiz}
        effectiveUserId={currentUser?.id}
        priorResult={priorResult}
        activeAttempt={attempt}
        canRetake={canRetake}
        isLoading={isLoading}
        onStart={start}
        onResume={start}
        onViewResults={() => onNavigateResults?.(quizId)}
        onBack={() => onNavigateHome?.()}
      />
    </div>
  )
}
