import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import {
  AdminComponent,
  HomeComponent,
  LeaderboardComponent,
  NotFoundComponent,
  QuizResultsComponent,
  QuizTakeComponent,
  RootComponent,
} from './route-components'

// Root route wraps every page in GlobalLayout
export const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

// 1. Quizzes Catalog (Home)
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeComponent,
})

// 2. Leaderboard Route
export const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardComponent,
})

// 3. Admin Dashboard Route
export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminComponent,
})

// 4. Quiz Parent Route (Layout for /quiz/$quizId)
export const quizParentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'quiz/$quizId',
  component: Outlet,
})

// 4a. Quiz Taking Flow (Deep Link Support: /quiz/:quizId)
export const quizTakeRoute = createRoute({
  getParentRoute: () => quizParentRoute,
  path: '/',
  component: QuizTakeComponent,
})

// 4b. Quiz Results Route (Deep Link: /quiz/:quizId/results)
export const quizResultsRoute = createRoute({
  getParentRoute: () => quizParentRoute,
  path: 'results',
  component: QuizResultsComponent,
})

// Assemble the route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  leaderboardRoute,
  adminRoute,
  quizParentRoute.addChildren([quizTakeRoute, quizResultsRoute]),
])

// Create router instance
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// Register router instance for type safety across TanStack Router hooks
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
