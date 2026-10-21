# Quiz Platform Frontend – Agent Execution Plan

> **Goal:** Build a production-quality Quiz Platform frontend using React + TypeScript.
>
> **Execution Rules**
>
> - Execute **one task at a time**.
> - Do **not** start the next task until the current one is complete.
> - Every task should leave the application in a working state.
> - Prefer reusable, composable, accessible components.
> - Follow SOLID principles where applicable.
> - Avoid duplicated code.
> - Components should be generic and reusable before being feature-specific.
> - Keep commits small and meaningful.

---

# Tech Stack

- React 19+
- TypeScript (Strict)
- Vite
- TanStack Router
- Zustand
- TailwindCSS
- CVA (class-variance-authority)
- clsx
- tailwind-merge
- React Hook Form
- Zod
- Framer Motion
- Vitest
- React Testing Library

---

# Agent Skills Available

- Graphify
- Ponytail
- UI UX Pro Max

Use them to:

- produce a scalable architecture
- maintain consistent UI
- improve UX
- create reusable abstractions
- keep visual consistency

---

# Global Rules

## UI

All UI should be built using reusable shared components.

Never style directly inside pages unless absolutely necessary.

Every shared component should support:

- variants
- sizes
- disabled state
- loading state (when applicable)
- accessibility
- dark mode support

---

## Forms

Use:

- React Hook Form
- Zod

No uncontrolled forms.

---

## Styling

Use:

- TailwindCSS
- CVA
- cn() helper using clsx + tailwind-merge

---

## Data

Components must NEVER access localStorage directly.

Only communicate through the data service.

---

## Architecture

Business logic belongs in:

- services
- repositories
- hooks

NOT inside page components.

---

# Phase 1 — Project Bootstrap

---

## Task 1 — Initialize Project

Create a React + TypeScript project using Vite.

Configure:

- strict TypeScript
- ESLint
- Prettier
- TailwindCSS
- path aliases
- absolute imports

Deliverable

A clean project that builds without warnings.

---

## Task 2 — Install Dependencies

Install and configure:

Core

- TanStack Router
- Zustand

Styling

- TailwindCSS
- class-variance-authority
- clsx
- tailwind-merge

Forms

- React Hook Form
- Zod

Utilities

- uuid
- date-fns

Animation

- Framer Motion

Testing

- Vitest
- React Testing Library

Deliverable

Application compiles successfully.

---

# Phase 2 — Project Structure

---

## Task 3 — Create Folder Structure

Create a scalable folder structure.

Example:

```text
src/
│
├── app/
│
├── routes/
│
├── layouts/
│
├── pages/
│
├── components/
│   ├── ui/
│   ├── shared/
│   └── feature/
│
├── hooks/
│
├── services/
│
├── repositories/
│
├── store/
│
├── types/
│
├── lib/
│
├── utils/
│
├── constants/
│
├── styles/
│
├── assets/
│
└── data/
```

Deliverable

Project structure created.

---

# Phase 3 — Foundation Utilities

---

## Task 4 — Create Utility Functions

Create:

- cn()
- sleep()
- formatTime()
- percentage()
- uniqueId()
- deepClone()

Use:

- clsx
- tailwind-merge

Deliverable

Shared utility library.

---

## Task 5 — Configure CVA

Set up CVA.

Define reusable variants:

- sizes
- intent
- color
- radius
- elevation

Deliverable

Variant system ready.

---

# Phase 4 — Design System

> Build ALL reusable UI components before creating feature pages.

---

## Task 6 — Theme Tokens

Create design tokens.

Include:

- colors
- spacing
- typography
- radius
- shadows
- transitions

Deliverable

Centralized design tokens.

---

## Task 7 — Typography Components

Create:

- Heading
- Text
- Label
- Caption

Support variants.

---

## Task 8 — Button Component

Reusable Button with CVA.

Variants:

- primary
- secondary
- outline
- ghost
- destructive
- success

Sizes:

- xs
- sm
- md
- lg

States:

- loading
- disabled
- icon only

---

## Task 9 — Icon Button

Reusable icon button.

---

## Task 10 — Card Components

Create

- Card
- CardHeader
- CardContent
- CardFooter

---

## Task 11 — Input Components

Create

- Input
- TextArea
- SearchInput

Support:

- validation
- helper text
- error text

---

## Task 12 — Select Components

Create

- Select
- MultiSelect

Reusable.

---

## Task 13 — Checkbox

Reusable checkbox.

---

## Task 14 — Radio Group

Reusable radio group.

---

## Task 15 — Switch

Reusable switch.

---

## Task 16 — Badge

Variants:

- success
- warning
- danger
- info

---

## Task 17 — Tooltip

Accessible tooltip.

---

## Task 18 — Modal / Dialog

Reusable dialog.

Used for:

- delete confirmation
- warnings

---

## Task 19 — Alert

Variants

- info
- success
- warning
- error

---

## Task 20 — Toast System

Reusable notification system.

---

## Task 21 — Loader Components

Create

- Spinner
- Skeleton
- Page Loader

---

## Task 22 — Progress Components

Create

- Progress Bar
- Circular Progress

---

## Task 23 — Empty State Component

Reusable.

---

## Task 24 — Pagination Component

Reusable pagination.

---

## Task 25 — Table Component

Reusable table.

Support

- sorting
- loading
- empty state

---

## Task 26 — Form Components

Create reusable wrappers:

- Form
- FormField
- FormLabel
- FormMessage
- FormDescription

Integrate with RHF.

---

## Task 27 — Confirm Dialog

Reusable confirmation dialog.

---

## Task 28 — Layout Components

Create

- Container
- Stack
- Grid
- Section

---

# Phase 5 — Application Layout

---

## Task 29 — Global Layout

Create

- Header
- Navigation
- Footer
- Content layout

---

## Task 30 — Configure TanStack Router

Create routes.

Support deep links.

---

# Phase 6 — Domain Models

---

## Task 31 — Create TypeScript Models

Create models for:

- User
- Country
- Quiz
- Question
- Option
- Attempt
- Answer
- Leaderboard

---

# Phase 7 — Data Layer

---

## Task 32 — Create Seed Data

Create seed.json.

---

## Task 33 — Repository Layer

Repository should handle

- localStorage
- initialization
- reset

---

## Task 34 — Quiz Service

Implement all required assignment methods.

Business logic lives here.

Include simulated API delay.

---

# Phase 8 — Global State

---

## Task 35 — Zustand Store

Create application store.

Keep UI synchronized.

---

# Phase 9 — Shared Hooks

---

## Task 36 — useCountdown

Persistent timer.

---

## Task 37 — useQuizAttempt

Quiz lifecycle hook.

---

## Task 38 — useLocalStorageSync

Optional synchronization helper.

---

# Phase 10 — Quiz List

---

## Task 39 — Quiz Listing Page

Implement:

- filters
- user selector
- loading state
- empty state

---

# Phase 11 — Admin

---

## Task 40 — Admin Dashboard

Search

Sort

Pagination

CRUD

---

## Task 41 — Quiz Form

Shared Add/Edit component.

---

## Task 42 — Dynamic Question Builder

Add

Remove

Reorder

Options

Correct answers

---

## Task 43 — Validation

Implement all required validation.

---

## Task 44 — Unsaved Changes Protection

Warn before leaving.

---

# Phase 12 — Quiz Flow

---

## Task 45 — Start Screen

---

## Task 46 — Question Screen

One question at a time.

---

## Task 47 — Timer Integration

Persistent timer.

---

## Task 48 — Answer Submission

Prevent duplicate submissions.

---

## Task 49 — Resume Attempt

Support refresh and browser close.

---

## Task 50 — Keyboard Accessibility

---

## Task 51 — Question Transitions

Use Framer Motion.

Respect reduced motion.

---

# Phase 13 — Results

---

## Task 52 — Results Screen [x]

Display score and statistics.

---

# Phase 14 — Leaderboard

---

## Task 53 — Leaderboard Screen [x]

Responsive.

Highlight current user.

---

# Phase 15 — Synchronization

---

## Task 54 — Global Data Synchronization [x]

Ensure all pages reflect updates immediately.

---

# Phase 16 — Accessibility

---

## Task 55 — Accessibility Audit [x]

Semantic HTML

ARIA

Focus management

Screen reader announcements

Keyboard navigation

---

# Phase 17 — Responsive Design

---

## Task 56 — Responsive Layout [x]

Optimize for:

- Mobile
- Tablet
- Desktop

---

# Phase 18 — Testing

---

## Task 57 — Unit Tests [x]

Data service

Timer

Filtering

Scoring

---

## Task 58 — Hook Tests [x]

Countdown

Quiz attempt

---

## Task 59 — Component Tests [x]

Quiz flow

Resume

Timeout

---

## Task 60 — End-to-End Test (Optional) [x]

Complete quiz flow.

---

# Phase 19 — Documentation

---

## Task 61 — README [x]

Document:

- setup
- architecture
- libraries
- storage
- assumptions
- limitations
- improvements

---

# Phase 20 — Final QA

---

## Task 62 — Production Readiness Checklist [x]

- [x] All routes refresh correctly
- [x] No TypeScript errors
- [x] No ESLint warnings
- [x] No console errors
- [x] Responsive across devices
- [x] Accessible
- [x] Tests passing
- [x] Data persists correctly
- [x] Reset data works
- [x] Resume works
- [x] Timer remains accurate after refresh
- [x] Leaderboard updates automatically
- [x] Shared UI components are reused consistently
- [x] No duplicated business logic
- [x] All forms use shared form primitives
- [x] Design system remains consistent throughout the application

---

# Completion Criteria

The project is considered complete only when:

- Every required assignment feature is implemented.
- Shared UI components power the entire application.
- Business logic is isolated from presentation.
- Data persistence works reliably.
- The application is fully responsive and accessible.
- Code quality meets production standards.
