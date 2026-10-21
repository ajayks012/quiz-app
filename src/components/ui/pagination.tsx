import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/utils'
import { focusRing } from '@/styles'

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  ...props
}) => {
  if (totalPages <= 1) return null

  // Generate pagination range with ellipses
  const generateRange = () => {
    const totalNumbers = siblingCount * 2 + 3
    const totalBlocks = totalNumbers + 2

    if (totalPages > totalBlocks) {
      const leftSiblingIndex = Math.max(page - siblingCount, 1)
      const rightSiblingIndex = Math.min(page + siblingCount, totalPages)

      const shouldShowLeftDots = leftSiblingIndex > 2
      const shouldShowRightDots = rightSiblingIndex < totalPages - 2

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount
        const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
        return [...leftRange, 'DOTS', totalPages]
      }

      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * siblingCount
        const rightRange = Array.from(
          { length: rightItemCount },
          (_, i) => totalPages - rightItemCount + i + 1,
        )
        return [1, 'DOTS', ...rightRange]
      }

      if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i,
        )
        return [1, 'DOTS', ...middleRange, 'DOTS', totalPages]
      }
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = generateRange()

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1.5 select-none', className)}
      {...props}
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors',
          focusRing,
          'hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed',
        )}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </button>

      {pages.map((p, idx) => {
        if (p === 'DOTS') {
          return (
            <span
              key={`dots-${idx}`}
              className="inline-flex h-9 w-9 items-center justify-center text-slate-400"
              aria-hidden="true"
            >
              <MoreHorizontal className="w-4 h-4" />
            </span>
          )
        }

        const pageNum = Number(p)
        const isCurrent = pageNum === page

        return (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            aria-current={isCurrent ? 'page' : undefined}
            className={cn(
              'inline-flex h-9 min-w-9 px-2 items-center justify-center rounded-lg text-sm font-medium transition-colors',
              focusRing,
              isCurrent
                ? 'bg-indigo-600 text-white dark:bg-indigo-500 shadow-xs'
                : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
            )}
          >
            {pageNum}
          </button>
        )
      })}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors',
          focusRing,
          'hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed',
        )}
        aria-label="Go to next page"
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </nav>
  )
}

Pagination.displayName = 'Pagination'
