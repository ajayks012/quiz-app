# Enterprise Quiz Application

A responsive, accessible, full-featured client-side Quiz Application built with React 19, TypeScript, Tailwind CSS v4, and Vitest.

## Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 8 (or npm / yarn)

### Installation & Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
# App is available at http://localhost:5173

# Run full test suite (unit, hooks, components, E2E)
pnpm test

# Run linter
pnpm run lint

# Format code
pnpm run format

# Production build
pnpm run build
```

---

## Architecture Overview

The application follows a strictly layered, decoupled clean architecture that separates domain entities, persistence mechanisms, business orchestration, UI presentation, and application state.

```
┌────────────────────────────────────────────────────────┐
│               Pages & Routing Layer                    │
│    (/, /quiz/:id, /results/:id, /leaderboard, /admin)  │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│          Custom Atomic UI Primitives & Features         │
│  Button, Card, Dialog, Table, Form, QuizQuestionCard   │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│             Application Store & Hooks                  │
│       useAppStore, useQuizAttempt, useCountdown         │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│              Domain Services (QuizService)             │
│    Business Logic, Timers, Scoring, Validation rules    │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│          Repository Layer (StorageRepository)          │
│   localStorage adapter, JSON schema seed, event bus    │
└────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

1. **Repository Layer (`src/repositories/`):**
   - Encapsulates `localStorage` persistence under the `quiz_app_v1` namespace.
   - Handles automated seeding from initial dataset, corrupted data recovery, and cross-tab multi-window synchronisation via `window.addEventListener('storage', ...)`.
2. **Service Layer (`src/services/`):**
   - Pure domain business logic: quiz filtering, attempt validation, question scoring, time limit enforcement, and leaderboard computation.
3. **Store Layer (`src/store/`):**
   - React state synchronization via custom store subscriptions (`useSyncExternalStore`), ensuring multi-tab and multi-component state reactivity without heavy external libraries.
4. **Presentation & UI Primitives (`src/components/ui/` & `src/components/feature/`):**
   - Reusable design system tokens and accessible primitives (radix-inspired accessible patterns, keyboard navigation, ARIA live announcements). Zero duplicated presentation logic.

---

## Key Architectural Choices & Libraries

The application dependencies are selected and prioritized based on architectural impact—from core framework and routing down to styling and testing:

| Priority | Dependency                | Purpose                         | Rationale                                                                                                                                                   |
| :------: | :------------------------ | :------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  **1**   | **React 19 & TypeScript** | Core framework & type system    | Concurrent rendering, native React Compiler optimizations, and end-to-end static type safety.                                                               |
|  **2**   | **TanStack Router**       | Type-safe client routing        | First-class type-safe navigation, search params management (filters, pagination), and seamless layout nesting with zero runtime route mismatch errors.      |
|  **3**   | **Zustand**               | Global client state             | Minimalist, boilerplate-free state store for active user switching, theme state, and cross-component sync ticks without React Context re-render waterfalls. |
|  **4**   | **React Hook Form**       | Dynamic form orchestration      | Uncontrolled form inputs delivering optimal performance for deeply nested dynamic forms (Quiz Builder, Question Builder) with isolated field re-renders.    |
|  **5**   | **Zod**                   | Runtime schema validation       | Strict validation contracts for quiz creation/editing, question options, and validating untrusted or corrupted `localStorage` payload data at the boundary. |
|  **6**   | **Tailwind CSS v4**       | Design system & styling         | Zero-runtime CSS variable architecture, sleek utility classes, and seamless class-based dark mode (`@custom-variant dark`).                                 |
|  **7**   | **Framer Motion**         | Micro-interactions & animations | Fluid question slide transitions and gauge animations with built-in accessibility compliance (`prefers-reduced-motion`).                                    |
|  **8**   | **Vitest & RTL**          | Unit, component & E2E testing   | Sub-second ESM test runner unified with the Vite pipeline, executing 49 suites (208 tests) covering services, hooks, components, and end-to-end flows.      |
|  **9**   | **Lucide React**          | Iconography                     | High-performance, tree-shakeable, and accessible SVG icons.                                                                                                 |

---

## Data Model & Persistence Strategy

All entities conform to TypeScript definitions in `src/types/models.ts`:

- **`User`**: `id`, `name`, `email`, `role ('admin' | 'user')`, `avatarUrl`.
- **`Quiz`**: `id`, `title`, `description`, `category`, `difficulty`, `timeLimitMinutes`, `perQuestionTimerSeconds`, `passingScore`, `allowRetake`, `questions`, `published`.
- **`Question`**: `id`, `text`, `type ('single' | 'multiple')`, `points`, `options`, `explanation`.
- **`QuizAttempt`**: `id`, `quizId`, `userId`, `answers`, `startedAt`, `completedAt`, `score`, `passed`, `timeSpentSeconds`, `status ('in_progress' | 'completed' | 'abandoned')`.

### Multi-Tab Synchronization

Storage mutations dispatch a localized custom event as well as standard browser `storage` events. When state changes in one window or tab, any other active tab updates in real-time without requiring a page reload.

---

## Testing Strategy & QA

### Test Suites

- **Unit Tests:** `QuizService` methods, scoring calculations, time formatting, storage serialization.
- **Hook Tests:** `useQuizAttempt`, `useCountdown` (accurate recovery after page reload), and theme synchronization.
- **Component Tests:** Quiz builder, question transitions, keyboard shortcuts (1–9 options, Enter submission), accessible modals, and error boundaries.
- **End-to-End Flow:** [src/test/quiz-e2e-flow.test.tsx](file:///home/ajay/Personal/quiz-app/src/test/quiz-e2e-flow.test.tsx) covers the complete journey from Catalog &rarr; Start/Retake &rarr; Sequential Question Attendance &rarr; Submit &rarr; Results breakdown &rarr; Leaderboard position.

### Manual Testing Checklist

A thorough manual testing checklist covering all 10 core functional and non-functional requirements from the specification PDF is located in:
👉 **[MANUAL_TESTING_CHECKLIST.md](./MANUAL_TESTING_CHECKLIST.md)**

---

## Assumptions & Limitations

### Assumptions

1. Client-only environment: All authentication and user switching operates in mock demonstration mode without a backend server or JWT auth.
2. Local Storage constraints: Datasets are assumed to fit comfortably within the browser's 5MB `localStorage` limit.
3. System clock: Timer durations and timestamps rely on the client's monotonic time differences (`performance.now()` / `Date.now()`).

### Limitations

1. No Server-Side Scoring: In a production environment with sensitive assessments, answer keys and scoring must live behind a secure backend API to prevent client inspection.
2. Local Media: Image uploads in the quiz builder use local object URLs or external image URLs rather than cloud storage (e.g. S3).

---

## Future Improvements

1. **Backend Integration:** Replace `StorageRepository` with a REST / GraphQL client targeting a PostgreSQL / Node.js backend.
2. **Offline Support:** Register a Service Worker for offline PWA quiz completion with background sync.
3. **Advanced Analytics:** Add question discrimination index, average drop-off rates, and score bell curves for quiz creators.

---

## AI Usage

This project was built through a human-in-the-loop pair programming workflow between the developer and AI agentic tooling.

### Tools Used

- **ChatGPT**: Used to draft the initial step-by-step implementation plan based on the assignment PDF requirements and the developer's instructions on how to plan it (with the developer subsequently reviewing and rewriting it).
- **Antigravity IDE**: Google DeepMind's agentic development environment used to autonomously execute plan tasks, inspect browser DOM states, and run verification pipelines.
- **Specialized Agent Skills**:
  - **`ponytail`**: Enforced senior engineering discipline—focusing on minimal working diffs, clean DRY architecture, eliminating boilerplate, and maintaining comprehensive test coverage.
  - **`ui-ux-pro-max`**: Design system intelligence used for typography scales, color harmony, WCAG 2.1 AA accessibility (keyboard focus rings, ARIA roles, live regions), responsive layout breakpoints, and dark mode theming.
  - **`graphify`**: Codebase knowledge graph analysis generating visual AST dependencies, community clusters, and god node identification (`graphify-out/graph.html`).
- **Base Stack & Scaffolding**: The developer initialized the repository using Vite's React-TS template and pre-selected core architectural libraries (`@tanstack/react-router`, `tailwindcss` v4, `lucide-react`, `zustand`, `react-hook-form`, `zod`, `vitest`).

### What Tools Were Used For

- **Implementation & Task Execution**: Translating requirements from the specification PDF and the developer's architecture plan (`plan.md`) into working code across repositories, domain services, store hooks, and UI layers.
- **UI/UX Design & Styling**: Designing accessible atomic UI primitives (buttons, dialogs, form controls, tables, badges) with Tailwind CSS v4, custom variants (CVA), and dark mode support.
- **Automated Testing**: Writing comprehensive test suites (49 test files, 210 tests) covering services, custom hooks, atomic components, and end-to-end flows using Vitest and React Testing Library.
- **Debugging & Iterative Refinement**: When human manual testing identified edge cases (e.g., button inline icon alignment, admin modal form submission validation, tab navigation separation), prompts were refined to inspect the running browser and apply targeted fixes.
- **Code Refactoring & Organization**: Reorganizing all components and pages into self-contained directories with co-located tests and cleaning up unused boilerplate files.

### Code Attribution & AI-Generated Components

- **Custom Atomic UI Primitives (`src/components/ui/`)**: All 22 accessible UI components (Buttons, Badges, Modals, Forms, Selects, Tables, Toaster, Layouts) and their CVA variant definitions.
- **Feature Components (`src/components/feature/`)**: The Quiz Builder form (`QuizForm`, `QuestionBuilder`), Quiz Cards, Question Cards, and User Switcher.
- **Domain Services & Repositories (`src/services/`, `src/repositories/`)**: `QuizService` business orchestration (filtering, scoring, time-limit enforcement, leaderboards) and `StorageRepository` (localStorage persistence, cross-tab event synchronization, factory seed recovery).
- **Page Implementations (`src/pages/`)**: `AdminDashboardPage` (with 2-tab view separating quizzes management from factory data reset), `QuizListPage`, `QuizTakePage`, `QuizResultsPage`, and `LeaderboardPage`.
- **Test Suites (`src/**/*.test.tsx`, `src/**/*.test.ts`)**: 100% of unit, component, hook, and E2E integration test suites.

### Human-in-the-Loop Development Process

1. **Initial Setup & Architecture Decisions**: The developer initialized the repository via Vite, installed core dependencies, and established the clean-architecture requirements.
2. **Planning**: The implementation plan was drafted by ChatGPT based on explicit guidance from the developer on how to plan and structure the solution. The developer then reviewed the plan and rewrote parts that were incorrect or misaligned with the requirements.
3. **Execution**: Antigravity IDE was used to implement the plan tasks systematically one by one.
4. **Manual Testing & Prompt Refinement**: After every major task, the developer manually verified the feature in the browser. If behavior deviated from expectations, prompts were refined with feedback, screenshots, or error logs to guide iterative fixes.
