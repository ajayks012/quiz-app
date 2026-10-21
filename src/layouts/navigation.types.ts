import { BookOpen, Settings, Trophy, type LucideIcon } from 'lucide-react'

export interface NavigationItem {
  label: string
  href: string
  icon?: LucideIcon
  badge?: string
  badgeVariant?: 'default' | 'success' | 'warning' | 'info'
  isExternal?: boolean
}

export const DEFAULT_NAV_ITEMS: NavigationItem[] = [
  {
    label: 'Quizzes',
    href: '/',
    icon: BookOpen,
  },
  {
    label: 'Leaderboard',
    href: '/leaderboard',
    icon: Trophy,
  },
  {
    label: 'Admin',
    href: '/admin',
    icon: Settings,
    badge: 'Manage',
    badgeVariant: 'info',
  },
]
