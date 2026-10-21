import { Outlet, useNavigate, useRouterState, useParams } from '@tanstack/react-router'
import { GlobalLayout, ContentLayout } from '@/layouts'
import { Button, Card } from '@/components/ui'
import { UserSwitcher } from '@/components/feature'
import {
  AdminDashboardPage,
  LeaderboardPage,
  QuizListPage,
  QuizResultsPage,
  QuizTakePage,
} from '@/pages'
import { useLocalStorageSync } from '@/hooks'

export function RootComponent() {
  const routerState = useRouterState()
  const navigate = useNavigate()

  // Cross-tab synchronization
  useLocalStorageSync()

  return (
    <GlobalLayout
      currentPath={routerState.location.pathname}
      onNavigate={(href) => navigate({ to: href as string })}
      userSlot={<UserSwitcher size="sm" />}
    >
      <Outlet />
    </GlobalLayout>
  )
}

export function NotFoundComponent() {
  const navigate = useNavigate()
  return (
    <ContentLayout
      pageTitle="404 - Page Not Found"
      pageDescription="The page or quiz you are looking for does not exist."
    >
      <Card className="max-w-md p-6 text-center">
        <p className="text-sm text-slate-500 mb-4">Check the URL or return to the quiz catalog.</p>
        <Button variant="primary" onClick={() => navigate({ to: '/' })}>
          Back to Home
        </Button>
      </Card>
    </ContentLayout>
  )
}

export function HomeComponent() {
  const navigate = useNavigate()
  return (
    <QuizListPage
      onNavigateQuiz={(quizId) =>
        navigate({
          to: '/quiz/$quizId',
          params: { quizId },
        })
      }
      onNavigateResults={(quizId) =>
        navigate({
          to: '/quiz/$quizId/results',
          params: { quizId },
        })
      }
    />
  )
}

export function LeaderboardComponent() {
  return <LeaderboardPage />
}

export function AdminComponent() {
  return <AdminDashboardPage />
}

export function QuizTakeComponent() {
  const params = useParams({ strict: false }) as { quizId?: string }
  const quizId = params.quizId ?? ''
  const navigate = useNavigate()

  return (
    <QuizTakePage
      quizId={quizId}
      onComplete={(id) =>
        navigate({
          to: '/quiz/$quizId/results',
          params: { quizId: id },
        })
      }
      onNavigateHome={() => navigate({ to: '/' })}
      onNavigateResults={(id) =>
        navigate({
          to: '/quiz/$quizId/results',
          params: { quizId: id },
        })
      }
    />
  )
}

export function QuizResultsComponent() {
  const params = useParams({ strict: false }) as { quizId?: string }
  const quizId = params.quizId ?? ''
  const navigate = useNavigate()

  return (
    <QuizResultsPage
      quizId={quizId}
      onRetake={(id) =>
        navigate({
          to: '/quiz/$quizId',
          params: { quizId: id },
        })
      }
      onNavigateLeaderboard={() =>
        navigate({
          to: '/leaderboard',
        })
      }
      onNavigateHome={() => navigate({ to: '/' })}
    />
  )
}
