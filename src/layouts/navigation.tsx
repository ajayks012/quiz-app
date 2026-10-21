import * as React from 'react'
import { cn } from '@/utils'
import { Badge } from '@/components/ui'
import { DEFAULT_NAV_ITEMS, type NavigationItem } from './navigation.types'

export interface NavigationDesktopProps extends React.HTMLAttributes<HTMLElement> {
  items?: NavigationItem[]
  currentPath?: string
  onNavigate?: (href: string) => void
}

export const NavigationDesktop = React.forwardRef<HTMLElement, NavigationDesktopProps>(
  ({ items = DEFAULT_NAV_ITEMS, currentPath = '/', onNavigate, className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Primary Navigation"
        className={cn('flex items-center gap-1', className)}
        {...props}
      >
        {items.map((item) => {
          const isActive =
            item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href)

          const Icon = item.icon

          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              onClick={(e) => {
                if (onNavigate && !item.isExternal) {
                  e.preventDefault()
                  onNavigate(item.href)
                }
              }}
              className={cn(
                'group relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300',
                  )}
                  aria-hidden="true"
                />
              )}
              <span>{item.label}</span>
              {item.badge && (
                <Badge
                  variant={item.badgeVariant ?? 'info'}
                  size="sm"
                  className="ml-1 text-[10px] px-1.5 py-0 leading-tight"
                >
                  {item.badge}
                </Badge>
              )}
              {isActive && (
                <span
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  aria-hidden="true"
                />
              )}
            </a>
          )
        })}
      </nav>
    )
  },
)
NavigationDesktop.displayName = 'NavigationDesktop'

export interface NavigationMobileProps extends React.HTMLAttributes<HTMLElement> {
  items?: NavigationItem[]
  currentPath?: string
  onNavigate?: (href: string) => void
  onClose?: () => void
}

export const NavigationMobile = React.forwardRef<HTMLElement, NavigationMobileProps>(
  (
    { items = DEFAULT_NAV_ITEMS, currentPath = '/', onNavigate, onClose, className, ...props },
    ref,
  ) => {
    return (
      <nav
        ref={ref}
        aria-label="Mobile Navigation"
        className={cn('flex flex-col gap-1 p-2', className)}
        {...props}
      >
        {items.map((item) => {
          const isActive =
            item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href)

          const Icon = item.icon

          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              onClick={(e) => {
                if (onNavigate && !item.isExternal) {
                  e.preventDefault()
                  onNavigate(item.href)
                }
                onClose?.()
              }}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60',
              )}
            >
              <div className="flex items-center gap-3">
                {Icon && (
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 dark:text-slate-500',
                    )}
                    aria-hidden="true"
                  />
                )}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant={item.badgeVariant ?? 'info'} size="sm">
                  {item.badge}
                </Badge>
              )}
            </a>
          )
        })}
      </nav>
    )
  },
)
NavigationMobile.displayName = 'NavigationMobile'
