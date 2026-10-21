import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'
import { routeTree } from './router'

describe('TanStack Router Configuration', () => {
  it('renders home route at /', async () => {
    const memoryHistory = createMemoryHistory({ initialEntries: ['/'] })
    const testRouter = createRouter({ routeTree, history: memoryHistory })

    render(<RouterProvider router={testRouter} />)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: /explore quizzes/i }),
      ).toBeInTheDocument()
    })
  })

  it('navigates to leaderboard route at /leaderboard', async () => {
    const memoryHistory = createMemoryHistory({ initialEntries: ['/leaderboard'] })
    const testRouter = createRouter({ routeTree, history: memoryHistory })

    render(<RouterProvider router={testRouter} />)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: /global leaderboard/i }),
      ).toBeInTheDocument()
    })
  })

  it('supports deep link with params at /quiz/$quizId', async () => {
    const memoryHistory = createMemoryHistory({ initialEntries: ['/quiz/world-history'] })
    const testRouter = createRouter({ routeTree, history: memoryHistory })
    await testRouter.load()

    render(<RouterProvider router={testRouter} />)

    await waitFor(() => {
      expect(screen.getByText(/world-history/i)).toBeInTheDocument()
    })
  })

  it('supports deep link for quiz results at /quiz/$quizId/results', async () => {
    const memoryHistory = createMemoryHistory({ initialEntries: ['/quiz/science-101/results'] })
    const testRouter = createRouter({ routeTree, history: memoryHistory })

    render(<RouterProvider router={testRouter} />)

    await waitFor(() => {
      expect(screen.getByText(/science-101/i)).toBeInTheDocument()
    })
  })

  it('renders 404 not found component on non-existent route', async () => {
    const memoryHistory = createMemoryHistory({ initialEntries: ['/not-a-real-page'] })
    const testRouter = createRouter({ routeTree, history: memoryHistory })

    render(<RouterProvider router={testRouter} />)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: /404 - page not found/i }),
      ).toBeInTheDocument()
    })
  })
})
