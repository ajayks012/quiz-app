import * as React from 'react'
import { ArrowUpDown, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
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
} from '@/components/ui'
import { QuizForm, type QuizFormData } from '@/components/feature'
import { quizService, QuizService } from '@/services'
import { useAppStore } from '@/store'
import type { Quiz } from '@/types'
import { formatTime } from '@/utils'

export interface AdminDashboardPageProps {
  service?: QuizService
}

type SortField = 'title' | 'questions' | 'timing'

export function AdminDashboardPage({ service = quizService }: AdminDashboardPageProps) {
  const { syncTick, notifySync } = useAppStore()

  const [quizzes, setQuizzes] = React.useState<Quiz[]>([])
  const [search, setSearch] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [sortField, setSortField] = React.useState<SortField>('title')
  const [sortAsc, setSortAsc] = React.useState<boolean>(true)
  const [page, setPage] = React.useState<number>(1)
  const pageSize = 5

  // Form & Dialog states
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false)
  const [editingQuiz, setEditingQuiz] = React.useState<Quiz | null>(null)
  const [deletingQuiz, setDeletingQuiz] = React.useState<Quiz | null>(null)
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

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
      } else {
        await service.createQuiz(data)
      }
      setIsFormOpen(false)
      setEditingQuiz(null)
      notifySync()
      const updated = await service.getQuizzes()
      setQuizzes(updated)
    } catch (err) {
      console.error('Failed to save quiz', err)
    } finally {
      setIsSaving(false)
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
              Create, configure questions, modify parameters, and manage quiz catalogs.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleCreateClick}
            className="gap-2 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create Quiz
          </Button>
        </div>

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
              <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
            </div>
          )}
        </Card>

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
          <DialogContent size="xl" className="max-h-[90vh] overflow-y-auto">
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
      </Container>
    </div>
  )
}
