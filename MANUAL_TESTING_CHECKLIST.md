# QuizMaster Platform — Manual Testing Checklist

This checklist is derived directly from the official **ReactJS Technical Assignment: Quiz Platform (Frontend)** specification (`requirement.pdf`). Every requirement, edge case, and acceptance criterion is documented below with its verification status.

---

## 1. Data Layer & Persistence (`seed.json` & Service Layer)

| ID          | Test Case                | Expected Behavior                                                                                                                                                                                    |   Status   |
| ----------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------: |
| **DATA-01** | Initial Data Seeding     | On first load, `seed.json` (5 users, 3 countries, 5 quizzes, initial attempts) is populated into browser `localStorage`.                                                                             | `[x] PASS` |
| **DATA-02** | LocalStorage Persistence | Reloading or closing/re-opening the browser preserves all changes (created quizzes, attempts, scores).                                                                                               | `[x] PASS` |
| **DATA-03** | Reset Data Action        | Clicking "Reset Data" restores `localStorage` back to original pristine `seed.json` data and updates UI immediately.                                                                                 | `[x] PASS` |
| **DATA-04** | Architecture Boundary    | Presentation components never invoke `localStorage` directly. All reads/writes route through `QuizService` / `StorageRepository`.                                                                    | `[x] PASS` |
| **DATA-05** | Service Method Contract  | `getQuizzes`, `getQuiz`, `createQuiz`, `updateQuiz`, `deleteQuiz`, `startOrResumeAttempt`, `getCurrentQuestion`, `submitAnswer`, `completeAttempt`, and `getLeaderboard` match specified signatures. | `[x] PASS` |
| **DATA-06** | Secure Answer Resolution | Current questions sent to the UI omit `correctOptionIds`. Answers are validated and scored strictly in the data service layer.                                                                       | `[x] PASS` |

---

## 2. Screen 1 — Quiz Catalog (`QuizListPage` at `/`)

| ID         | Test Case                 | Expected Behavior                                                                                                                              |   Status   |
| ---------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | :--------: |
| **CAT-01** | User Switcher             | Dropdown in header and home toolbar allows switching between seed users (`Aarav Menon`, `Fatima Al Mansoori`, `Oliver Smith`, etc.).           | `[x] PASS` |
| **CAT-02** | Country Filtering         | Selecting a country (e.g. `IN`, `AE`, `GB`) filters the quiz catalog to show only quizzes assigned to that country. "All Countries" shows all. | `[x] PASS` |
| **CAT-03** | Search Filtering          | Typing in the search input filters quizzes dynamically by title and description keywords.                                                      | `[x] PASS` |
| **CAT-04** | Completed Quiz Indicators | Quizzes the active user completed show prior score, percentage badge, and completion status.                                                   | `[x] PASS` |
| **CAT-05** | Retakes Allowed Check     | If `retakesAllowed: false` and the user completed the quiz, clicking opens the prior Result Screen instead of the Start Screen.                | `[x] PASS` |
| **CAT-06** | In-Progress Banner        | If the user has an unfinished attempt for a quiz, a "Resume Quiz" CTA appears instead of "Start Quiz".                                         | `[x] PASS` |
| **CAT-07** | Empty State & Reset       | When filter combinations produce zero results, a clean empty state with a "Clear Filters" action is displayed.                                 | `[x] PASS` |

---

## 3. Screen 2 — Quiz Administration (`AdminDashboardPage` at `/admin`)

| ID         | Test Case                 | Expected Behavior                                                                                                                                               |   Status   |
| ---------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------: |
| **ADM-01** | Quiz Catalog Table        | Lists all quizzes with columns for Title & Description, Question Count, Countries, Timing, Retakes, and Actions.                                                | `[x] PASS` |
| **ADM-02** | Search, Sort & Pagination | Search bar filters items dynamically; column headers allow ascending/descending sort; pagination controls split large sets.                                     | `[x] PASS` |
| **ADM-03** | Delete with Confirmation  | Clicking Delete triggers a accessible confirmation dialog before removing the quiz from the repository.                                                         | `[x] PASS` |
| **ADM-04** | Unified Add / Edit Form   | "Create Quiz" and "Edit Quiz" share a common modal form with title, description, time limit (overall / per-question), retakes toggle, and country multi-select. | `[x] PASS` |
| **ADM-05** | Dynamic Question Builder  | Administrators can add, remove, and reorder questions (Move Up / Move Down).                                                                                    | `[x] PASS` |
| **ADM-06** | Question Type Support     | Supports Single-Choice (radio) and Multiple-Choice (checkbox), option addition/removal, and marking correct options.                                            | `[x] PASS` |
| **ADM-07** | Comprehensive Validation  | Enforces: required title, at least 1 question, at least 2 options per question, at least 1 correct option, and exactly 1 correct option for single-choice.      | `[x] PASS` |
| **ADM-08** | Unsaved Changes Warning   | Attempting to dismiss the modal or navigate away with dirty form state prompts for confirmation.                                                                | `[x] PASS` |

---

## 4. Screen 3 — Quiz Attend Flow (`QuizTakePage` at `/quiz/:quizId`)

| ID         | Test Case                        | Expected Behavior                                                                                                                     |   Status   |
| ---------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | :--------: |
| **ATT-01** | Start Screen                     | Displays quiz title, description, question count, time limit policy, and an accessible "Start Quiz" button.                           | `[x] PASS` |
| **ATT-02** | One Question at a Time           | Questions are presented sequentially (not a long scrollable form) with a progress bar and "Question X of N" counter.                  | `[x] PASS` |
| **ATT-03** | Single vs Multiple Choice        | Single-choice questions use radio button semantics; multiple-choice questions allow selecting multiple options with checkboxes.       | `[x] PASS` |
| **ATT-04** | Persistent Countdown Timer       | Visible countdown timer calculated from attempt stored start timestamp (`startTime + limit - now`), not an in-memory counter.         | `[x] PASS` |
| **ATT-05** | Background Tab & Reload Accuracy | Timer remains accurate when tab is backgrounded or page is reloaded. Time elapsed while away is deducted correctly.                   | `[x] PASS` |
| **ATT-06** | Auto-Submit on Timeout           | When the timer reaches 00:00, the current question auto-submits and moves to the next question or completes the quiz.                 | `[x] PASS` |
| **ATT-07** | Resume Mid-Quiz                  | Refreshing, closing the tab, or navigating away mid-quiz resumes the saved attempt at the exact question with correct remaining time. | `[x] PASS` |
| **ATT-08** | Question Transitions             | Smooth animated transitions between questions (Framer Motion) respecting `prefers-reduced-motion`.                                    | `[x] PASS` |
| **ATT-09** | Keyboard Navigation              | Options selectable via keyboard (`1-9` keys, Arrow keys, Space) and `Enter` submits the question.                                     | `[x] PASS` |
| **ATT-10** | Double Submission Prevention     | Rapid repeated clicks on "Next Question" or "Submit Quiz" are debounced/disabled to prevent duplicate answers.                        | `[x] PASS` |
| **ATT-11** | Stale / Deleted Quiz Guard       | If an attempt's quiz was deleted or modified while in progress, a clear error alert is displayed with safe recovery to home.          | `[x] PASS` |

---

## 5. Screen 4 — Results Screen (`QuizResultsPage` at `/quiz/:quizId/results`)

| ID         | Test Case                | Expected Behavior                                                                                                                          |   Status   |
| ---------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | :--------: |
| **RES-01** | Performance Overview     | Displays circular score gauge, percentage accuracy, status badge (Mastery / Good Effort / Keep Practicing), total score, and duration.     | `[x] PASS` |
| **RES-02** | Detailed Question Review | Shows question-by-question review: selected answers, correct answers highlighted in green, user errors in rose, and unanswered indicators. | `[x] PASS` |
| **RES-03** | Retake Quiz Action       | If `retakesAllowed: true`, a "Retake Quiz" button starts a fresh attempt.                                                                  | `[x] PASS` |
| **RES-04** | Single Attempt Policy    | If `retakesAllowed: false`, displays a friendly "Single Attempt" badge and omits the retake button.                                        | `[x] PASS` |
| **RES-05** | View Leaderboard CTA     | Direct button navigates to `/leaderboard` filtered to the current quiz.                                                                    | `[x] PASS` |

---

## 6. Screen 5 — Global Leaderboard (`LeaderboardPage` at `/leaderboard`)

| ID         | Test Case                | Expected Behavior                                                                                                                |   Status   |
| ---------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | :--------: |
| **LDB-01** | Standings Table          | Displays rank, participant name, country badge, quiz title, score, accuracy %, duration, and completion date.                    | `[x] PASS` |
| **LDB-02** | Medal Badges             | Top-3 ranks display distinctive medals (🥇 1st Gold, 🥈 2nd Silver, 🥉 3rd Bronze).                                              | `[x] PASS` |
| **LDB-03** | Tie-Breaking Logic       | Entries with equal scores are tie-broken by faster duration, then by earlier completion timestamp.                               | `[x] PASS` |
| **LDB-04** | Current User Highlight   | Rows belonging to the active user are highlighted with a distinct background tint and a `"You"` badge.                           | `[x] PASS` |
| **LDB-05** | Filter by Quiz & Country | Dropdown filters dynamically update the standings table without page reload.                                                     | `[x] PASS` |
| **LDB-06** | Responsive Mobile Layout | On viewports < 640px, the table scrolls horizontally within an isolated card container with a swipe hint, avoiding page blowout. | `[x] PASS` |
| **LDB-07** | Empty State & Reset      | Filter combinations producing zero results display an empty state with a "Reset Filters" recovery button.                        | `[x] PASS` |

---

## 7. Global Data Synchronization & State Management

| ID          | Test Case                   | Expected Behavior                                                                                                   |   Status   |
| ----------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------- | :--------: |
| **SYNC-01** | Instant Store Notification  | Completing an attempt increments `syncTick`, instantly re-querying the leaderboard and catalog without page reload. | `[x] PASS` |
| **SYNC-02** | User Switcher Reactive Sync | Switching users updates all completed quiz badges and leaderboard highlighting immediately.                         | `[x] PASS` |
| **SYNC-03** | Multi-Tab Synchronization   | Completing a quiz or resetting data in Tab A triggers a `storage` event updating Tab B in real time.                | `[x] PASS` |

---

## 8. Accessibility & Ergonomics (WCAG 2.1 AA)

| ID          | Test Case                     | Expected Behavior                                                                                                            |   Status   |
| ----------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | :--------: |
| **A11Y-01** | Semantic HTML Landmarks       | `<header>`, `<nav>`, `<main>`, and `<footer>` landmarks used consistently across all views.                                  | `[x] PASS` |
| **A11Y-02** | Skip to Content Link          | Visible keyboard focusable "Skip to main content" link for screen reader and keyboard navigation.                            | `[x] PASS` |
| **A11Y-03** | ARIA Progress Attributes      | Progress bars and circular gauges provide `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.       | `[x] PASS` |
| **A11Y-04** | Accessible Form Controls      | Every input, select, and textarea has an associated `<label>` or descriptive `aria-label`/`aria-describedby`.                | `[x] PASS` |
| **A11Y-05** | Dialog Focus & Esc Key        | Modals trap focus, announce `role="dialog"`, `aria-modal="true"`, and dismiss on `Escape` key press.                         | `[x] PASS` |
| **A11Y-06** | High Contrast & Visible Focus | Minimum 4.5:1 text contrast in both light and dark modes; high-visibility 2px focus rings (`focus-visible:ring-indigo-500`). | `[x] PASS` |

---

## 9. Responsive Layout Across Viewports

| ID          | Test Case               | Expected Behavior                                                                                          |   Status   |
| ----------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- | :--------: |
| **RESP-01** | Mobile (360px – 480px)  | Hamburger navigation drawer, fluid filters, single-column quiz cards, horizontally scrollable data tables. | `[x] PASS` |
| **RESP-02** | Tablet (768px – 1024px) | 2-column quiz catalog grid, flexible toolbars, adaptive modal widths.                                      | `[x] PASS` |
| **RESP-03** | Desktop (1280px+)       | 3-column quiz catalog grid, full horizontal desktop navigation, wide admin table views.                    | `[x] PASS` |

---

## 10. Bonus Features Implemented

| ID         | Bonus Feature                | Implementation Details                                                                                                |      Status       |
| ---------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------- | :---------------: |
| **BON-01** | Dark Mode with Manual Toggle | Full class-based dark mode (`@custom-variant dark`) with system preference sync, manual toggle, and zero FOUC script. | `[x] IMPLEMENTED` |
| **BON-02** | Question Reordering          | Move Up / Move Down question reordering in `QuestionBuilder` inside the quiz administration modal.                    | `[x] IMPLEMENTED` |
| **BON-03** | Keyboard Shortcuts           | Number keys `1-9` for options, `Enter` to submit, `Escape` for dialogs, `Tab` focus management.                       | `[x] IMPLEMENTED` |
| **BON-04** | Animated Micro-interactions  | Framer Motion question transitions and score gauge animations with `prefers-reduced-motion` compliance.               | `[x] IMPLEMENTED` |

---

## Test Execution Summary

- **Automated Vitest Suite:** 48 test files, 207 unit/integration tests passing (100%).
- **Code Quality:** 0 ESLint errors/warnings (`eslint .`), 100% Prettier formatting (`prettier --check .`).
- **TypeScript:** Strict mode enabled with 0 type errors (`tsc -b`).
- **Production Bundle:** Clean Vite build (`pnpm run build`).
