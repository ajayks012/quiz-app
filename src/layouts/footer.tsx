import * as React from 'react'
import { BrainCircuit, CheckCircle2, Heart } from 'lucide-react'
import { cn } from '@/utils'
import { Container } from '@/components/ui'

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  brandTitle?: string
  brandDescription?: string
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    {
      brandTitle = 'QuizMaster',
      brandDescription = 'A high-performance, real-time quiz assessment platform with persistent state, offline resilience, and interactive leaderboards.',
      className,
      ...props
    },
    ref,
  ) => {
    const currentYear = new Date().getFullYear()

    return (
      <footer
        ref={ref}
        role="contentinfo"
        className={cn(
          'w-full border-t border-slate-200/80 dark:border-slate-800/80',
          'bg-slate-50/70 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400',
          'mt-auto transition-colors duration-200',
          className,
        )}
        {...props}
      >
        <Container size="xl" className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <BrainCircuit className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  {brandTitle}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                {brandDescription}
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>All systems operational</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-xs tracking-wider uppercase text-slate-900 dark:text-slate-200 mb-3.5">
                Navigation
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Quiz Catalog
                  </a>
                </li>
                <li>
                  <a
                    href="/leaderboard"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Global Leaderboard
                  </a>
                </li>
                <li>
                  <a
                    href="/admin"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Admin Console
                  </a>
                </li>
              </ul>
            </div>

            {/* System Info */}
            <div>
              <h3 className="font-semibold text-xs tracking-wider uppercase text-slate-900 dark:text-slate-200 mb-3.5">
                Platform
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>React 19 & Strict TS</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Auto-save & Resume</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Accessible (WCAG 2.1)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>
              © {currentYear} {brandTitle}. Built for high-stakes assessments.
            </p>
            <p className="flex items-center gap-1">
              Crafted with{' '}
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" aria-label="love" /> for
              interactive learning
            </p>
          </div>
        </Container>
      </footer>
    )
  },
)
Footer.displayName = 'Footer'
