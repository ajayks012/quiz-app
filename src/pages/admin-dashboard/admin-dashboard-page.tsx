import * as React from 'react'
import {
  AlertTriangle,
  ArrowUpDown,
  BookOpen,
  Database,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  Container,
  Dialog,
  DialogContent,
  EmptyState,
  IconButton,
  Pagination,
  SearchInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from '@/components/ui'
import { QuizForm, type QuizFormData } from '@/components/feature'
import { quizService, QuizService } from '@/services'
import { useAppStore } from '@/store'
import type { Quiz } from '@/types'
import { formatTime } from '@/utils'
import {redirect, useNavigate } from '@tanstack/react-router'

export interface AdminDashboardPageProps {
  service?: QuizService
}

type SortField = 'title' | 'questions' | 'timing'
export type AdminTab = 'quizzes' | 'reset'

export function AdminDashboardPage({ service = quizService }: AdminDashboardPageProps) {
  const { currentUser, syncTick, notifySync, resetData } = useAppStore()

  const [activeTab, setActiveTab] = React.useState<AdminTab>('quizzes')
  const [quizzes, setQuizzes] = React.useState<Quiz[]>([])
  const [search, setSearch] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [sortField, setSortField] = React.useState<SortField>('title')
  const [sortAsc, setSortAsc] = React.useState<boolean>(true)
  const [page, setPage] = React.useState<number>(1)
  const pageSize = 10

  // Form & Dialog states
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false)
  const [editingQuiz, setEditingQuiz] = React.useState<Quiz | null>(null)
  const [deletingQuiz, setDeletingQuiz] = React.useState<Quiz | null>(null)
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = React.useState<boolean>(false)
  const [isResetting, setIsResetting] = React.useState<boolean>(false)
  const navigate = useNavigate();

  React.useEffect(()=>{
    if(currentUser){
      const auth = ()=>{
        if(currentUser?.role !=='admin')
          navigate({to:"/no-access"})
      }
      auth();
    }
  },[currentUser])

  React.useEffect(() => {
    let isCancelled = false

    const fetchQuizzes = async () => {
      try {
        const list = await service.getQuizzes()
        if (!isCancelled) {
          setQuizzes(list)
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Failed to load quizzes', err)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchQuizzes()

    return () => {
      isCancelled = true
    }
  }, [service, syncTick])

  // Filter, sort, and paginate
  const filteredAndSorted = React.useMemo(() => {
    let result = [...quizzes]

    if (search.trim()) {
      const qLower = search.toLowerCase()
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(qLower) || q.description.toLowerCase().includes(qLower),
      )
    }

    result.sort((a, b) => {
      let cmp = 0
      if (sortField === 'title') {
        cmp = a.title.localeCompare(b.title)
      } else if (sortField === 'questions') {
        cmp = a.questions.length - b.questions.length
      } else if (sortField === 'timing') {
        const timeA = a.timeLimitSeconds ?? a.perQuestionSeconds ?? 0
        const timeB = b.timeLimitSeconds ?? b.perQuestionSeconds ?? 0
        cmp = timeA - timeB
      }
      return sortAsc ? cmp : -cmp
    })

    return result
  }, [quizzes, search, sortField, sortAsc])

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize))
  const paginatedQuizzes = React.useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredAndSorted.slice(start, start + pageSize)
  }, [filteredAndSorted, page, pageSize])

  const handleToggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  const handleCreateClick = () => {
    setEditingQuiz(null)
    setIsFormOpen(true)
  }

  const handleEditClick = (quiz: Quiz) => {
    setEditingQuiz(quiz)
    setIsFormOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingQuiz) return
    try {
      await service.deleteQuiz(deletingQuiz.id)
      setDeletingQuiz(null)
      notifySync()
      const updated = await service.getQuizzes()
      setQuizzes(updated)
    } catch (err) {
      console.error('Failed to delete quiz', err)
    }
  }

  const handleFormSubmit = async (data: QuizFormData) => {
    setIsSaving(true)
    try {
      if (editingQuiz) {
        await service.updateQuiz(editingQuiz.id, data)
        toast.success(`Quiz "${data.title}" was updated successfully.`, 'Quiz Updated')
      } else {
        await service.createQuiz(data)
        toast.success(`Quiz "${data.title}" was created successfully.`, 'Quiz Created')
      }
      setIsFormOpen(false)
      setEditingQuiz(null)
      notifySync()
      const updated = await service.getQuizzes()
      setQuizzes(updated)
      setSearch('')

      // Automatically navigate to the page where the new or updated quiz appears
      const sortedList = [...updated].sort((a, b) => {
        let cmp = 0
        if (sortField === 'title') {
          cmp = a.title.localeCompare(b.title)
        } else if (sortField === 'questions') {
          cmp = a.questions.length - b.questions.length
        } else if (sortField === 'timing') {
          const timeA = a.timeLimitSeconds ?? a.perQuestionSeconds ?? 0
          const timeB = b.timeLimitSeconds ?? b.perQuestionSeconds ?? 0
          cmp = timeA - timeB
        }
        return sortAsc ? cmp : -cmp
      })
      const quizIndex = sortedList.findIndex((q) => q.title === data.title)
      if (quizIndex >= 0) {
        setPage(Math.floor(quizIndex / pageSize) + 1)
      }
    } catch (err) {
      console.error('Failed to save quiz', err)
      toast.error('Failed to save quiz. Please try again.', 'Save Error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetConfirm = async () => {
    setIsResetting(true)
    try {
      await resetData(service)
      notifySync()
      const updated = await service.getQuizzes()
      setQuizzes(updated)
      setSearch('')
      setPage(1)
      setActiveTab('quizzes')
      toast.success('All application data was restored to original seed values.', 'Data Reset')
    } catch (err) {
      console.error('Failed to reset data', err)
      toast.error('Failed to reset application data', 'Error')
    } finally {
      setIsResetting(false)
      setIsResetDialogOpen(false)
    }
  }

  const handleTabKeyDown = (e: React.KeyboardEvent, currentTab: AdminTab) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const nextTab = currentTab === 'quizzes' ? 'reset' : 'quizzes'
      setActiveTab(nextTab)
      const nextButton = document.getElementById(`tab-${nextTab}`)
      nextButton?.focus()
    }
  }

  return (
    <div className="py-8 md:py-12">
      <Container size="xl" className="space-y-8">
        {/* Header and Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Quiz Administration
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage quiz catalogs, question items, timing parameters, and application state.
            </p>
          </div>

          {activeTab === 'quizzes' && (
            <Button
              variant="primary"
              size="md"
              onClick={handleCreateClick}
              className="gap-2 shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Create Quiz
            </Button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
          <div
            role="tablist"
            aria-label="Admin Navigation"
            className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 gap-1"
          >
            <button
              type="button"
              role="tab"
              id="tab-quizzes"
              aria-selected={activeTab === 'quizzes'}
              aria-controls="panel-quizzes"
              tabIndex={activeTab === 'quizzes' ? 0 : -1}
              onClick={() => setActiveTab('quizzes')}
              onKeyDown={(e) => handleTabKeyDown(e, 'quizzes')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeTab === 'quizzes'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Quizzes</span>
              <Badge
                variant={activeTab === 'quizzes' ? 'default' : 'outline'}
                size="sm"
                className="ml-1 text-xs px-1.5 py-0 font-mono"
              >
                {quizzes.length}
              </Badge>
            </button>

            <button
              type="button"
              role="tab"
              id="tab-reset"
              aria-selected={activeTab === 'reset'}
              aria-controls="panel-reset"
              tabIndex={activeTab === 'reset' ? 0 : -1}
              onClick={() => setActiveTab('reset')}
              onKeyDown={(e) => handleTabKeyDown(e, 'reset')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeTab === 'reset'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Tab Panel: Quizzes */}
        {activeTab === 'quizzes' && (
          <div
            role="tabpanel"
            id="panel-quizzes"
            aria-labelledby="tab-quizzes"
            tabIndex={0}
            className="space-y-6 focus:outline-hidden"
          >
            {/* Filter bar */}
            <div className="bg-slate-50/80 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="w-full sm:w-80">
                <SearchInput
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  onClear={() => setSearch('')}
                  placeholder="Search quizzes by title or topic..."
                  aria-label="Search quizzes"
                />
              </div>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
                Showing {filteredAndSorted.length} quizzes
              </span>
            </div>

            {/* Quizzes Table */}
            <Card className="border border-slate-200/90 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
              {isLoading ? (
                <div className="p-12 text-center text-sm text-slate-500 animate-pulse">
                  Loading quizzes...
                </div>
              ) : filteredAndSorted.length === 0 ? (
                <div className="py-12">
                  <EmptyState
                    title="No Quizzes Found"
                    description={
                      search
                        ? `No quizzes matched "${search}".`
                        : 'Get started by creating your first quiz!'
                    }
                    action={
                      search ? (
                        <Button variant="secondary" onClick={() => setSearch('')}>
                          Clear Search
                        </Button>
                      ) : (
                        <Button variant="primary" onClick={handleCreateClick}>
                          Create Quiz
                        </Button>
                      )
                    }
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-2/5">
                          <button
                            type="button"
                            onClick={() => handleToggleSort('title')}
                            className="flex items-center gap-1.5 font-bold hover:text-indigo-600 transition-colors"
                          >
                            Title & Description
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        </TableHead>
                        <TableHead>
                          <button
                            type="button"
                            onClick={() => handleToggleSort('questions')}
                            className="flex items-center gap-1.5 font-bold hover:text-indigo-600 transition-colors"
                          >
                            Questions
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        </TableHead>
                        <TableHead>Countries</TableHead>
                        <TableHead>
                          <button
                            type="button"
                            onClick={() => handleToggleSort('timing')}
                            className="flex items-center gap-1.5 font-bold hover:text-indigo-600 transition-colors"
                          >
                            Timing
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        </TableHead>
                        <TableHead>Retakes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {paginatedQuizzes.map((quiz) => (
                        <TableRow
                          key={quiz.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                        >
                          <TableCell>
                            <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                              {quiz.title}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {quiz.description}
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline" size="sm" className="font-mono">
                              {quiz.questions.length} Qs
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {quiz.countries.map((c) => (
                                <span
                                  key={c}
                                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                              {quiz.timeLimitSeconds
                                ? `${formatTime(quiz.timeLimitSeconds, 'auto')} total`
                                : quiz.perQuestionSeconds
                                  ? `${quiz.perQuestionSeconds}s / q`
                                  : 'Untimed'}
                            </span>
                          </TableCell>

                          <TableCell>
                            {quiz.retakesAllowed ? (
                              <Badge variant="success" size="sm">
                                Allowed
                              </Badge>
                            ) : (
                              <Badge variant="warning" size="sm">
                                1 Attempt
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(quiz)}
                                aria-label={`Edit quiz ${quiz.title}`}
                                title="Edit quiz"
                                className="hover:text-indigo-600"
                              >
                                <Pencil className="w-4 h-4" />
                              </IconButton>

                              <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingQuiz(quiz)}
                                aria-label={`Delete quiz ${quiz.title}`}
                                title="Delete quiz"
                                className="hover:text-rose-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                  />
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Tab Panel: Reset Data */}
        {activeTab === 'reset' && (
          <div
            role="tabpanel"
            id="panel-reset"
            aria-labelledby="tab-reset"
            tabIndex={0}
            className="space-y-6 focus:outline-hidden"
          >
            {/* System & Data Management Card */}
            <Card className="border border-rose-200/80 dark:border-rose-900/40 bg-gradient-to-br from-rose-50/30 via-white to-slate-50 dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900/60 shadow-xs overflow-hidden">
              <CardHeader className="pb-4 border-b border-rose-100 dark:border-rose-900/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-xs">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                          Reset Application Data
                        </CardTitle>
                        <Badge
                          variant="danger"
                          size="sm"
                          className="font-mono text-[10px] uppercase tracking-wide"
                        >
                          Factory Seed
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Restore application state back to the original assignment dataset (5
                        quizzes, 5 users).
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-6 text-sm text-slate-600 dark:text-slate-300 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Database className="w-4 h-4 text-rose-500 shrink-0" />
                      Restore Seed Quizzes
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Re-populates the 5 original seed quizzes with all default questions, options,
                      and timing rules.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      Purge Custom Data
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Permanently clears newly created quizzes, edits, and recorded user attempt
                      scores.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-indigo-500 shrink-0" />
                      Instant Synchronisation
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Immediately syncs catalog and leaderboards across all open browser windows and
                      tabs.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Note:</strong> Performing this reset will overwrite any custom quizzes
                    or questions you created, and reset leaderboard mock scores to their default
                    seed states. Use this whenever you want to test the application from a clean
                    slate.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-4 pb-4 border-t border-rose-100 dark:border-rose-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/30 dark:bg-rose-950/10">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Need to test the initial state again? This action cannot be reversed.
                </p>
                <Button
                  variant="destructive"
                  size="md"
                  disabled={isResetting}
                  onClick={() => setIsResetDialogOpen(true)}
                  className="gap-2 shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                  Reset All Data to Seed
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Create / Edit Modal Dialog */}
        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsFormOpen(false)
              setEditingQuiz(null)
            }
          }}
        >
          <DialogContent size="2xl" className="p-0 overflow-hidden max-h-[90vh]">
            <QuizForm
              initialData={editingQuiz}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingQuiz(null)
              }}
              isSubmitting={isSaving}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={Boolean(deletingQuiz)}
          onOpenChange={(open) => !open && setDeletingQuiz(null)}
          title={`Delete Quiz "${deletingQuiz?.title}"?`}
          description="Are you sure you want to delete this quiz? All question items and associated metadata will be removed. This cannot be undone."
          confirmText="Delete Quiz"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={handleDeleteConfirm}
        />

        {/* Reset Confirmation Dialog */}
        <ConfirmDialog
          open={isResetDialogOpen}
          onOpenChange={setIsResetDialogOpen}
          title="Reset All Application Data to Seed?"
          description="Are you sure you want to restore the default seed dataset? All customized quizzes, questions, mock attempts, and scores in this browser will be wiped and replaced with the original factory seed data."
          confirmText="Yes, Reset Everything"
          cancelText="Cancel"
          variant="destructive"
          loading={isResetting}
          onConfirm={handleResetConfirm}
        />
      </Container>
    </div>
  )
}
