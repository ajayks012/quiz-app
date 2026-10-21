import * as React from 'react'
import { RotateCcw, Sparkles } from 'lucide-react'
import {
  Button,
  Card,
  Container,
  EmptyState,
  SearchInput,
  Select,
  type SelectOption,
} from '@/components/ui'
import { QuizCard, UserSwitcher } from '@/components/feature'
import { quizService, QuizService } from '@/services'
import { useAppStore } from '@/store'
import type { Attempt, Quiz } from '@/types'

export interface QuizListPageProps {
  service?: QuizService
  onNavigateQuiz?: (quizId: string) => void
  onSelect?: (quizId: string) => void
  onNavigateResults?: (quizId: string) => void
  onViewResults?: (quizId: string) => void
}

export function QuizListPage({
  service = quizService,
  onNavigateQuiz,
  onSelect,
  onNavigateResults,
  onViewResults,
}: QuizListPageProps) {
  const handleSelectQuiz = onNavigateQuiz ?? onSelect
  const handleSelectResults = onNavigateResults ?? onViewResults
  const { currentUser, countries, selectedCountry, setSelectedCountry, syncTick, resetData } =
    useAppStore()

  const [quizzes, setQuizzes] = React.useState<Quiz[]>([])
  const [userAttempts, setUserAttempts] = React.useState<Attempt[]>([])
  const [search, setSearch] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [isResetting, setIsResetting] = React.useState<boolean>(false)

  // Fetch quizzes and attempts
  React.useEffect(() => {
    let isCancelled = false

    const loadData = async () => {
      setIsLoading(true)
      try {
        const [quizList, attempts] = await Promise.all([
          service.getQuizzes({
            country: selectedCountry ?? undefined,
            search: search.trim() ? search.trim() : undefined,
          }),
          currentUser ? service.getUserAttempts(currentUser.id) : Promise.resolve([]),
        ])

        if (!isCancelled) {
          setQuizzes(quizList)
          setUserAttempts(attempts)
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Failed to load quiz list', err)
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
  }, [service, selectedCountry, search, currentUser, syncTick])

  const countryOptions: SelectOption[] = React.useMemo(() => {
    const list: SelectOption[] = [{ value: 'all', label: 'All Countries' }]
    for (const c of countries) {
      list.push({ value: c.code, label: `${c.name} (${c.code})` })
    }
    return list
  }, [countries])

  const handleCountryChange = (val: string) => {
    setSelectedCountry(val === 'all' ? null : val)
  }

  const handleClearFilters = () => {
    setSearch('')
    setSelectedCountry(null)
  }

  const handleResetData = async () => {
    setIsResetting(true)
    try {
      await resetData(service)
      setSearch('')
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="py-8 md:py-12">
      <Container size="xl" className="space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3 border border-indigo-100 dark:border-indigo-900/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Knowledge Testing</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Explore Quizzes
            </h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              Challenge yourself with country-assigned quizzes, monitor your prior scores, and test
              your knowledge under timed conditions.
            </p>
          </div>

          {/* User selector & Reset action */}
          <div className="flex flex-wrap items-center gap-3">
            <UserSwitcher showLabel size="md" service={service} />
            <Button
              variant="outline"
              size="md"
              onClick={handleResetData}
              disabled={isResetting}
              className="gap-2 shrink-0"
              title="Reset application data to original seed"
            >
              <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
              Reset Data
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-50/80 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-80">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              placeholder="Search quizzes by title..."
              aria-label="Search quizzes"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
              Country:
            </span>
            <div className="flex-1 sm:w-48">
              <Select
                id="country-filter-select"
                size="md"
                value={selectedCountry ?? 'all'}
                onChange={handleCountryChange}
                options={countryOptions}
                aria-label="Filter by country"
              />
            </div>
            {(search || selectedCountry) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs shrink-0 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Quizzes Grid / Skeletons / Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <Card
                key={idx}
                className="p-6 space-y-4 animate-pulse border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-4 w-full bg-slate-100 dark:bg-slate-850 rounded-md" />
                  <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-850 rounded-md" />
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg pt-2" />
              </Card>
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No Quizzes Found"
              description={
                search || selectedCountry
                  ? 'No quizzes match your current search or country filter. Try broadening your criteria.'
                  : 'There are currently no quizzes available.'
              }
              action={
                search || selectedCountry ? (
                  <Button variant="primary" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                userAttempts={userAttempts}
                onSelect={(id) => handleSelectQuiz?.(id)}
                onViewResults={(id) => handleSelectResults?.(id)}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
