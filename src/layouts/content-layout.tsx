import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/utils'
import { Container, Heading, Text, type ContainerProps } from '@/components/ui'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface ContentLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  pageTitle?: React.ReactNode
  pageDescription?: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  headerActions?: React.ReactNode
  containerSize?: ContainerProps['size']
  noPadding?: boolean
}

export const ContentLayout = React.forwardRef<HTMLDivElement, ContentLayoutProps>(
  (
    {
      pageTitle,
      pageDescription,
      breadcrumbs,
      headerActions,
      containerSize = 'xl',
      noPadding = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const hasHeader = Boolean(pageTitle || pageDescription || breadcrumbs || headerActions)

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {hasHeader && (
          <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 py-6 mb-6">
            <Container size={containerSize}>
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav aria-label="Breadcrumbs" className="mb-3">
                  <ol className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {breadcrumbs.map((crumb, idx) => {
                      const isLast = idx === breadcrumbs.length - 1
                      return (
                        <li key={idx} className="flex items-center gap-1.5">
                          {idx > 0 && (
                            <ChevronRight
                              className="w-3.5 h-3.5 text-slate-400 shrink-0"
                              aria-hidden="true"
                            />
                          )}
                          {crumb.href && !isLast ? (
                            <a
                              href={crumb.href}
                              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              {crumb.label}
                            </a>
                          ) : (
                            <span
                              className={
                                isLast ? 'font-semibold text-slate-800 dark:text-slate-200' : ''
                              }
                              aria-current={isLast ? 'page' : undefined}
                            >
                              {crumb.label}
                            </span>
                          )}
                        </li>
                      )
                    })}
                  </ol>
                </nav>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  {typeof pageTitle === 'string' ? (
                    <Heading level="h1">{pageTitle}</Heading>
                  ) : (
                    pageTitle
                  )}
                  {typeof pageDescription === 'string' ? (
                    <Text tone="muted" size="sm">
                      {pageDescription}
                    </Text>
                  ) : (
                    pageDescription
                  )}
                </div>

                {headerActions && (
                  <div className="flex items-center gap-3 shrink-0">{headerActions}</div>
                )}
              </div>
            </Container>
          </div>
        )}

        {noPadding ? (
          children
        ) : (
          <Container size={containerSize} className="pb-12">
            {children}
          </Container>
        )}
      </div>
    )
  },
)
ContentLayout.displayName = 'ContentLayout'
