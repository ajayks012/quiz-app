import * as React from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '@/utils'

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-x-auto">
      <table
        ref={ref}
        className={cn('w-full min-w-[640px] caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  ),
)
Table.displayName = 'Table'

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50',
      className,
    )}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
))
TableBody.displayName = 'TableBody'

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 font-medium',
      className,
    )}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-slate-200 dark:border-slate-800/80 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40',
      className,
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sortDirection?: 'asc' | 'desc' | null
  onSort?: () => void
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sortDirection, onSort, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-11 px-4 text-left align-middle font-semibold text-slate-700 dark:text-slate-300 [&:has([role=checkbox])]:pr-0',
        sortable && 'cursor-pointer select-none hover:text-slate-900 dark:hover:text-slate-100',
        className,
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        <span>{children}</span>
        {sortable && (
          <span className="text-slate-400">
            {sortDirection === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            ) : sortDirection === 'desc' ? (
              <ArrowDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <ArrowUpDown className="w-3.5 h-3.5" />
            )}
          </span>
        )}
      </div>
    </th>
  ),
)
TableHead.displayName = 'TableHead'

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-4 align-middle text-slate-700 dark:text-slate-300 [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-xs text-slate-500 dark:text-slate-400 text-center', className)}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'
