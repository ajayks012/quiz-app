import * as React from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  PageLoader,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { quizService, QuizService } from '@/services'
import { useAppStore } from '@/store'
import type { Country, LeaderboardEntry, Quiz } from '@/types'
import { formatTime } from '@/utils'
import { Award, Medal, RotateCcw, Trophy, User as UserIcon } from 'lucide-react'
import { useSearch } from '@tanstack/react-router'

export interface LeaderboardPageProps {
  service?: QuizService
  initialQuizId?: string
  initialCountry?: string
}

export function LeaderboardPage({
  service = quizService,
  initialQuizId = 'all',
  initialCountry = 'all',
}: LeaderboardPageProps) {
  const search = useSearch({from:"/leaderboard"});
const {category} = search;

  const currentUser = useAppStore((state) => state.currentUser)
  const syncTick = useAppStore((state) => state.syncTick)

  const [entries, setEntries] = React.useState<LeaderboardEntry[]>([])
  const [quizzes, setQuizzes] = React.useState<Quiz[]>([])
  const [countries, setCountries] = React.useState<Country[]>([])
  const [selectedQuizId, setSelectedQuizId] = React.useState<string>(category || initialQuizId)
  const [selectedCountry, setSelectedCountry] = React.useState<string>(initialCountry)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)


  // Fetch filter options (quizzes and countries)
  React.useEffect(() => {
    let isCancelled = false

    const loadMeta = async () => {
      try {
        const [loadedQuizzes, loadedCountries] = await Promise.all([
          service.getQuizzes(),
          service.getCountries(),
        ])
        if (!isCancelled) {
          setQuizzes(loadedQuizzes)
          setCountries(loadedCountries)
        }
      } catch {
        // Handled gracefully
      }
    }

    loadMeta()
    return () => {
      isCancelled = true
    }
  }, [service, syncTick])

  // Fetch leaderboard entries based on active filters and syncTick
  React.useEffect(() => {
    let isCancelled = false

    const loadLeaderboard = async () => {
      setIsLoading(true)
      try {
        const filter = {
          quizId: selectedQuizId === 'all' ? undefined : selectedQuizId,
          country: selectedCountry === 'all' ? undefined : selectedCountry,
        }
        const data = await service.getLeaderboard(filter)
        if (!isCancelled) {
          setEntries(data)
        }
      } catch {
        if (!isCancelled) {
          setEntries([])
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadLeaderboard()
    return () => {
      isCancelled = true
    }
  }, [service, selectedQuizId, selectedCountry, syncTick])

  const quizOptions = React.useMemo(() => {
    return [
      { value: 'all', label: 'All Quizzes' },
      ...quizzes.map((q) => ({ value: q.id, label: q.title })),
    ]
  }, [quizzes])

  const countryOptions = React.useMemo(() => {
    return [
      { value: 'all', label: 'All Countries' },
      ...countries.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` })),
    ]
  }, [countries])

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6 w-full min-w-0">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Global Leaderboard
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Top performers ranked by score accuracy, duration, and completion timestamp.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-56">
            <label htmlFor="filter-quiz" className="sr-only">
              Filter by Quiz
            </label>
            <Select
              id="filter-quiz"
              options={quizOptions}
              value={selectedQuizId}
              onChange={(val) => setSelectedQuizId(val)}
              size="sm"
            />
          </div>

          <div className="w-full sm:w-48">
            <label htmlFor="filter-country" className="sr-only">
              Filter by Country
            </label>
            <Select
              id="filter-country"
              options={countryOptions}
              value={selectedCountry}
              onChange={(val) => setSelectedCountry(val)}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <Card className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden w-full min-w-0">
        <CardHeader className="py-4 px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Standings</span>
            <Badge variant="secondary" size="sm">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </Badge>
          </CardTitle>
          {currentUser && (
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block shrink-0" />
              <span>Rows with your results are highlighted</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0 w-full min-w-0">
          {isLoading ? (
            <div className="py-16">
              <PageLoader message="Loading leaderboard standings..." />
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={<Award className="w-10 h-10 text-slate-400" />}
                title="No Scores Found"
                description="No users have completed this quiz with the selected filters yet."
                action={
                  (selectedQuizId !== 'all' || selectedCountry !== 'all') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedQuizId('all')
                        setSelectedCountry('all')
                      }}
                      className="mt-4 gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Filters
                    </Button>
                  )
                }
              />
            </div>
          ) : (
            <div className="w-full min-w-0">
              <div className="sm:hidden flex items-center justify-between px-4 py-2 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Rankings</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  Swipe to view all stats →
                </span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">Rank</TableHead>
                    <TableHead>Participant</TableHead>
                    <TableHead>Quiz</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Accuracy</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => {
                    const isCurrentUser = currentUser?.id === entry.userId

                    let rankBadgeNode: React.ReactNode = (
                      <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                        #{entry.rank}
                      </span>
                    )

                    if (entry.rank === 1) {
                      rankBadgeNode = (
                        <div
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold text-xs"
                          title="1st Place - Gold"
                        >
                          <Medal className="w-4 h-4" />
                        </div>
                      )
                    } else if (entry.rank === 2) {
                      rankBadgeNode = (
                        <div
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                          title="2nd Place - Silver"
                        >
                          <Medal className="w-4 h-4" />
                        </div>
                      )
                    } else if (entry.rank === 3) {
                      rankBadgeNode = (
                        <div
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-900/10 dark:bg-amber-950/30 text-amber-800 dark:text-amber-500 font-bold text-xs"
                          title="3rd Place - Bronze"
                        >
                          <Medal className="w-4 h-4" />
                        </div>
                      )
                    }

                    return (
                      <TableRow
                        key={`${entry.userId}-${entry.quizId}-${entry.completedAt}`}
                        className={
                          isCurrentUser
                            ? 'bg-indigo-50/70 dark:bg-indigo-950/35 hover:bg-indigo-100/60 dark:hover:bg-indigo-950/50'
                            : undefined
                        }
                      >
                        <TableCell className="text-center font-bold">{rankBadgeNode}</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                              <UserIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white truncate">
                              {entry.userName}
                            </span>
                            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                              {entry.userCountry}
                            </Badge>
                            {isCurrentUser && (
                              <Badge variant="info" size="sm" className="text-[10px] py-0 px-1.5">
                                You
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-xs block">
                            {entry.quizTitle}
                          </span>
                        </TableCell>

                        <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                          {entry.score}
                        </TableCell>

                        <TableCell className="text-right">
                          <Badge
                            variant={
                              entry.percentage >= 80
                                ? 'success'
                                : entry.percentage >= 50
                                  ? 'warning'
                                  : 'danger'
                            }
                            size="sm"
                          >
                            {entry.percentage}%
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right font-mono text-xs text-slate-600 dark:text-slate-400">
                          {formatTime(entry.timeTakenSeconds)}
                        </TableCell>

                        <TableCell className="text-right text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {new Date(entry.completedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
