import * as React from 'react'
import { BrainCircuit, Menu, Moon, Sun, X } from 'lucide-react'
import { cn } from '@/utils'
import { Container, IconButton, Tooltip } from '@/components/ui'
import { useTheme } from '@/hooks'
import { NavigationDesktop, NavigationMobile } from './navigation'
import { DEFAULT_NAV_ITEMS, type NavigationItem } from './navigation.types'

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  currentPath?: string
  navItems?: NavigationItem[]
  onNavigate?: (href: string) => void
  userSlot?: React.ReactNode
  brandTitle?: string
  brandSubtitle?: string
  logoHref?: string
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      currentPath = '/',
      navItems = DEFAULT_NAV_ITEMS,
      onNavigate,
      userSlot,
      brandTitle = 'QuizMaster',
      brandSubtitle = 'Platform',
      logoHref = '/',
      className,
      ...props
    },
    ref,
  ) => {
    const { isDark, toggleTheme } = useTheme()
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    // Close mobile menu on resize to desktop
    React.useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setMobileMenuOpen(false)
        }
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
      <header
        ref={ref}
        className={cn(
          'sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-200',
          'bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800/80',
          'shadow-xs',
          className,
        )}
        {...props}
      >
        <Container size="xl">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-8">
              <a
                href={logoHref}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault()
                    onNavigate(logoHref)
                  }
                }}
                className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
                aria-label={`${brandTitle} Home`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <BrainCircuit className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                    {brandTitle}
                    <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {brandSubtitle}
                    </span>
                  </span>
                </div>
              </a>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center">
                <NavigationDesktop
                  items={navItems}
                  currentPath={currentPath}
                  onNavigate={onNavigate}
                />
              </div>
            </div>

            {/* Right Action Tools */}
            <div className="flex items-center gap-2">
              {/* Optional User Slot (Selector / Profile) */}
              {userSlot && <div className="hidden sm:flex items-center mr-1">{userSlot}</div>}

              {/* Theme Toggle */}
              <Tooltip content={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton
                  variant="ghost"
                  size="md"
                  onClick={toggleTheme}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-amber-400 hover:text-amber-300 transition-colors" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-600 hover:text-slate-900 transition-colors" />
                  )}
                </IconButton>
              </Tooltip>

              {/* Mobile Menu Toggle Button */}
              <div className="md:hidden">
                <IconButton
                  variant="ghost"
                  size="md"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-navigation"
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                  ) : (
                    <Menu className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                  )}
                </IconButton>
              </div>
            </div>
          </div>
        </Container>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg animate-in slide-in-from-top duration-200"
          >
            {userSlot && (
              <div className="pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                {userSlot}
              </div>
            )}
            <NavigationMobile
              items={navItems}
              currentPath={currentPath}
              onNavigate={onNavigate}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        )}
      </header>
    )
  },
)
Header.displayName = 'Header'
