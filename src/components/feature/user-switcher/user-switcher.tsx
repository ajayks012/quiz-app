import * as React from 'react'
import { User as UserIcon } from 'lucide-react'
import { cn } from '@/utils'
import { useAppStore } from '@/store'
import { Select, type SelectOption } from '@/components/ui'

import { QuizService } from '@/services'

export interface UserSwitcherProps {
  className?: string
  size?: 'sm' | 'md'
  showLabel?: boolean
  service?: QuizService
}

export function UserSwitcher({
  className,
  size = 'sm',
  showLabel = false,
  service,
}: UserSwitcherProps) {
  const { currentUser, users, setCurrentUser, isInitializing, initialize } = useAppStore()

  React.useEffect(() => {
    if (users.length === 0 && !isInitializing) {
      initialize(service)
    }
  }, [users.length, isInitializing, initialize, service])

  const options: SelectOption[] = React.useMemo(() => {
    return users.map((u) => ({
      value: u.id,
      label: `${u.name} (${u.country})`,
    }))
  }, [users])

  if (users.length === 0) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-2 w-full sm:w-auto', className)}>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
          <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
          Active User:
        </span>
      )}
      <div className="flex-1 sm:w-56">
        <Select
          id="global-user-switcher"
          size={size}
          value={currentUser?.id ?? ''}
          onChange={(userId) => setCurrentUser(userId)}
          options={options}
          placeholder="Select user..."
          aria-label="Switch active user"
        />
      </div>
    </div>
  )
}
