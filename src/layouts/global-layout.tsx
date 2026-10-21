import * as React from 'react'
import { cn } from '@/utils'
import { Toaster } from '@/components/ui'
import { Header, type HeaderProps } from './header'
import { Footer, type FooterProps } from './footer'

export interface GlobalLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPath?: string
  onNavigate?: (href: string) => void
  userSlot?: React.ReactNode
  hideHeader?: boolean
  hideFooter?: boolean
  headerProps?: Partial<HeaderProps>
  footerProps?: Partial<FooterProps>
  children: React.ReactNode
}

export const GlobalLayout = React.forwardRef<HTMLDivElement, GlobalLayoutProps>(
  (
    {
      currentPath = '/',
      onNavigate,
      userSlot,
      hideHeader = false,
      hideFooter = false,
      headerProps,
      footerProps,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen flex flex-col w-full min-w-0 overflow-x-hidden bg-background text-foreground antialiased selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400',
          className,
        )}
        {...props}
      >
        {/* Skip to Main Content Link for WCAG Keyboard Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-lg ring-2 ring-indigo-400 focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Global Header */}
        {!hideHeader && (
          <Header
            currentPath={currentPath}
            onNavigate={onNavigate}
            userSlot={userSlot}
            {...headerProps}
          />
        )}

        {/* Main Content Area */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 flex flex-col w-full min-w-0 focus:outline-none"
        >
          {children}
        </main>

        {/* Global Footer */}
        {!hideFooter && <Footer {...footerProps} />}

        {/* Global Toast Notification System */}
        <Toaster />
      </div>
    )
  },
)
GlobalLayout.displayName = 'GlobalLayout'
