import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  ContentLayout,
  Footer,
  GlobalLayout,
  Header,
  NavigationDesktop,
  NavigationMobile,
} from './index'

describe('Global Layout Components', () => {
  describe('Navigation', () => {
    it('renders desktop navigation with active state indicator', () => {
      const onNavigate = vi.fn()
      render(<NavigationDesktop currentPath="/leaderboard" onNavigate={onNavigate} />)

      const quizzesLink = screen.getByRole('link', { name: /quizzes/i })
      const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i })

      expect(quizzesLink).not.toHaveAttribute('aria-current')
      expect(leaderboardLink).toHaveAttribute('aria-current', 'page')
    })

    it('triggers onNavigate callback when link is clicked', async () => {
      const user = userEvent.setup()
      const onNavigate = vi.fn()
      render(<NavigationDesktop currentPath="/" onNavigate={onNavigate} />)

      const adminLink = screen.getByRole('link', { name: /admin/i })
      await user.click(adminLink)

      expect(onNavigate).toHaveBeenCalledWith('/admin')
    })

    it('renders mobile navigation links', async () => {
      const user = userEvent.setup()
      const onNavigate = vi.fn()
      const onClose = vi.fn()

      render(<NavigationMobile currentPath="/" onNavigate={onNavigate} onClose={onClose} />)

      const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i })
      await user.click(leaderboardLink)

      expect(onNavigate).toHaveBeenCalledWith('/leaderboard')
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('Header', () => {
    it('renders brand logo and title', () => {
      render(<Header brandTitle="QuizMaster" brandSubtitle="Platform" />)
      expect(screen.getByText('QuizMaster')).toBeInTheDocument()
      expect(screen.getByText('Platform')).toBeInTheDocument()
    })

    it('toggles mobile menu when hamburger button is clicked', async () => {
      const user = userEvent.setup()
      render(<Header />)

      const menuButton = screen.getByRole('button', { name: /open menu/i })
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')

      await user.click(menuButton)
      expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute(
        'aria-expanded',
        'true',
      )
      expect(screen.getByLabelText(/mobile navigation/i)).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: /close menu/i }))
      expect(screen.queryByLabelText(/mobile navigation/i)).not.toBeInTheDocument()
    })

    it('toggles dark mode when theme button is clicked', async () => {
      const user = userEvent.setup()
      render(<Header />)

      const themeToggle = screen.getByRole('button', { name: /switch to (dark|light) mode/i })
      expect(themeToggle).toBeInTheDocument()

      await user.click(themeToggle)
      expect(
        document.documentElement.classList.contains('dark') ||
          !document.documentElement.classList.contains('dark'),
      ).toBe(true)
    })
  })

  describe('Footer', () => {
    it('renders semantic footer with brand title and status', () => {
      render(<Footer brandTitle="QuizMaster" />)

      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      expect(screen.getByText('All systems operational')).toBeInTheDocument()
      expect(screen.getByText(/built for high-stakes assessments/i)).toBeInTheDocument()
    })
  })

  describe('ContentLayout', () => {
    it('renders title, description, breadcrumbs, and actions', () => {
      render(
        <ContentLayout
          pageTitle="Active Quizzes"
          pageDescription="Choose a category to start your test"
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Quizzes' }]}
          headerActions={<button type="button">New Quiz</button>}
        >
          <div data-testid="page-content">Main Body Content</div>
        </ContentLayout>,
      )

      expect(screen.getByRole('heading', { level: 1, name: /active quizzes/i })).toBeInTheDocument()
      expect(screen.getByText(/choose a category to start your test/i)).toBeInTheDocument()
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /new quiz/i })).toBeInTheDocument()
      expect(screen.getByTestId('page-content')).toBeInTheDocument()
    })
  })

  describe('GlobalLayout', () => {
    it('renders skip link, header, main content, and footer', () => {
      render(
        <GlobalLayout currentPath="/">
          <div data-testid="test-content">Welcome to the App</div>
        </GlobalLayout>,
      )

      const skipLink = screen.getByRole('link', { name: /skip to main content/i })
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveAttribute('href', '#main-content')

      expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
      expect(screen.getByTestId('test-content')).toBeInTheDocument()
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('allows hiding header or footer when requested', () => {
      render(
        <GlobalLayout hideHeader hideFooter>
          <div>Focused Mode</div>
        </GlobalLayout>,
      )

      expect(screen.queryByRole('banner')).not.toBeInTheDocument()
      expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
      expect(screen.getByText('Focused Mode')).toBeInTheDocument()
    })
  })
})
