# Workplace Love Language — Functional Specification

> **Ground truth for implemented behavior.** This document describes the actual runtime features, user flows, and technical integrations of the Workplace Love Language platform as of June 2026.

---

## 1. Architectural Overview & Routing

The Workplace Love Language platform is built as a single-page application (SPA) using React, Vite, TailwindCSS (v4), Motion (fka Framer Motion) for animations, and Firebase services.

### 1.1 Client-Side Routing
The app uses `react-router-dom` to implement routing. The main entry point `AppContent` in [src/App.tsx](file:///Users/davidtsur/Development/Projects/workplace-love-language/src/App.tsx) defines the following routes:

| Path | Element / Component | Description |
| :--- | :--- | :--- |
| `/` | `MainApp` | The main interactive application flow (Welcome -> Quiz -> Results). |
| `/terms` | `LegalPage` with `pageType="terms"` | The Terms of Use page. |
| `/privacy` | `LegalPage` with `pageType="privacy"` | The Privacy Policy page. |
| `/accessibility` | `LegalPage` with `pageType="accessibility"` | The Accessibility Statement page. |

All subpages support standard hash-like fallback rewriting configured in [firebase.json](file:///Users/davidtsur/Development/Projects/workplace-love-language/firebase.json) to redirect all traffic to `/index.html`, allowing correct client-side rendering on direct access.

---

## 2. Authentication & Session Management

The platform utilizes Firebase Authentication for user identification, credential verification, and security rule evaluation.

### 2.1 Google OAuth Sign-In
* **Entry Points:**
  * Top navigation bar header (on all pages).
  * Main CTA button on the `WelcomeScreen` (when the user is not authenticated).
  * Click event on the `FloatingFeedbackButton` (when the user is not authenticated).
* **Flow:**
  1. Triggers `signInWithGoogle` using `signInWithPopup(auth, new GoogleAuthProvider())`.
  2. On success, `AuthContext` updates user state with the authenticated credentials (`uid`, `email`, `displayName`).
  3. UI transitions state dynamically (e.g. from "Sign In to Continue" to "Start Free Analysis").

### 2.2 Session Persistence
An `onAuthStateChanged` listener in [src/contexts/AuthContext.tsx](file:///Users/davidtsur/Development/Projects/workplace-love-language/src/contexts/AuthContext.tsx) synchronizes the authentication state across reloads. 
* A `loading` state keeps the React app from rendering children until the auth state is verified (`!loading && children`).
* Logout is triggered by calling `signOut(auth)`, which resets the user state.

### 2.3 Authorization Roles
The system distinguishes administrator privileges client-side and server-side based on the authenticated email address:
* **Admin Verification:** `isAdmin = user?.email === 'tsur.david@gmail.com'`.
* **Client-side Privileges:** Displays the "Manage Feedback" button in the `TopBar`, granting access to the `AdminFeedbackPanel`.
* **Database Privileges:** Evaluated by Firestore security rules for write/read permissions on restricted collections.

---

## 3. The Assessment Flow (`MainApp`)

The main questionnaire flow is managed by state variables in `MainApp` inside [src/App.tsx](file:///Users/davidtsur/Development/Projects/workplace-love-language/src/App.tsx): `welcome` (landing page), `quiz` (the assessment questions), and `result` (the custom analytics dashboard).

### 3.1 Welcome & Onboarding (`WelcomeScreen`)
* **Role Selection:** User must select a role before taking the quiz:
  * **Employee** (`employee` / "Individual Contributor") - Default.
  * **Manager** (`manager` / "Manager").
* **Authentication Lock:** If the user is not logged in:
  * The primary CTA button renders as **"Sign In to Continue"** (English) or **"התחבר כדי להמשיך"** (Hebrew) and triggers Google Sign-In.
  * Gating prevents starting the quiz until `user` is populated in the context.
* **Assessment Start:** If the user is logged in, the primary CTA button changes to **"Start Free Analysis"** (English) / **"התחל/י ניתוח בחינם"** (Hebrew), taking the user to the quiz screen.

### 3.2 The Questionnaire (`QuizScreen`)
* **Questions:** The questionnaire consists of 9 multi-choice questions loaded from [src/data/quizData.ts](file:///Users/davidtsur/Development/Projects/workplace-love-language/src/data/quizData.ts) (translated to Hebrew in [src/data/quizData.he.ts](file:///Users/davidtsur/Development/Projects/workplace-love-language/src/data/quizData.he.ts)).
* **Question Flow:** 
  1. Renders one question at a time with a dynamic progress bar showing progress (e.g. "Question 3 of 9").
  2. Each question provides 5 options representing the 5 Appreciation Styles:
     * **A:** Words of Affirmation (Feedback + Mentorship)
     * **B:** Quality Time (Workplace Bonding)
     * **C:** Receiving Gifts (New Opportunities + Challenges)
     * **D:** Acts of Service (Support)
     * **E:** Encouraging Touchpoints (Physical Touch adaptation for corporate contexts)
  3. Selecting an answer logs the key (`A`, `B`, `C`, `D`, `E`) for the current question index, increments progress, and updates the view to the next question.
  4. Upon answering the final question, the system triggers `onComplete(finalAnswers)`, calculates the result, and transitions to the `result` state.

### 3.3 Progress Persistence
* **Incremental Saves:** As the user progresses through the quiz, their state (role, current question index, and answers) is saved automatically via `progressService.ts` utilizing local storage (`localStorage`).
* **Resumption:** If a user closes the browser or refreshes the page, the application detects saved progress on initialization and seamlessly resumes the session from the exact question they left off at.
* **Clearing Progress:** The progress is successfully cleared once the user completes the assessment or chooses to explicitly clear it via a UI action.

---

## 4. Interactive Results View (`ResultScreen`)

Renders a premium visual analysis dashboard summarizing the user's appreciation style profile.

### 4.1 Scoring Algorithm
* **Score Counts:** The system counts the frequencies of chosen options (`A`, `B`, `C`, `D`, `E`).
* **Primary Style Determination:** The option with the maximum frequency is designated as the `finalResult` (Primary Style).
* **Secondary Style Determination:** The option with the second-highest frequency is designated as the secondary trait.
* **Tie Breaking:** The sorting order defaults to natural array order (`A` -> `E`) in case of matching high scores.

### 4.2 Interactive Tabs
The results view organizes information into three interactive tabs:

1. **Analysis:** Explains the user's primary style, what it means in day-to-day operations, and highlights the secondary trait and how it influences the primary style.
2. **Playbook:** Outlines critical scenario reactions:
   * *Crunch Time:* How the user acts and what support they need under stress.
   * *Burnout Signs:* Key indicators that they are experiencing burnout.
   * *Negative Feedback:* Guidelines on how to deliver constructive feedback to them.
3. **User Manual:** Generates a ready-to-share markdown template text. Renders a "Copy Text" button that copies the manual text to the clipboard.

### 4.3 Language Breakdown Graphic
Displays a custom-drawn concentric radial graphic (SVG-based) visualizing the user's score distributions:
* **Concentric Rings:** 3 concentric guide circles representing score intervals.
* **Radial Wedges:** 5 color-coded wedges representing appreciation styles:
  * **Words (A):** Sky Blue (`#38bdf8`)
  * **Time (B):** Emerald Green (`#34d399`)
  * **Gifts (C):** Amber Yellow (`#fbbf24`)
  * **Acts (D):** Rose Red (`#fb7185`)
  * **Touch (E):** Indigo Purple (`#818cf8`)
* **Dynamic Sizing:** The outer radius of each wedge is mathematically proportional to the user's score percentage:
  `radius = innerRadius + (maxRadius - innerRadius) * (percentage / 100)`
* **Labels & Emojis:** Interactive legends with inline percentage bars animate on load.

### 4.4 Gemini AI Integration
The result screen leverages the `@google/genai` SDK and the `gemini-2.5-flash` model directly on the client to generate customized workplace insights:
* **API Key:** Extracted from the environment (`process.env.GEMINI_API_KEY`).
* **Prompt Data Passed:** Primary style, role type (`Manager` vs `Individual Contributor`), and full score percentage distribution.
* **Localized Context:** In Hebrew mode, the prompt instructs Gemini to output the response entirely in Hebrew.
* **Response Format:** Enforced as JSON containing the following fields:
  * `insights`: 1-paragraph professional analysis (max 3 sentences) interpreting the score combination.
  * `meaning`: 1-sentence explanation of what the primary style means in daily interactions.
  * `secondaryInsights`: 1-sentence explanation of how the secondary style influences the primary style.
  * `tips`: Array of 3 actionable tips for peers and managers to work with the user.
* **Graceful Degradation:** If the Gemini API key is missing or the call fails, the UI falls back to showing static pre-written insights from the localized data.

### 4.5 Shareable Public Profiles
* **Persistence:** Final assessment results are automatically persisted to Firestore inside the `results` collection when a user completes the quiz while authenticated.
* **Link Generation:** A "Share Profile" button is available in the results screen, which copies a unique direct URL mapping to the user's result ID.
* **Read-Only View:** When an unauthenticated or different user visits a shared link (`/shared-result/:id`), the application loads the specific snapshot from Firestore and displays a read-only presentation of the user's profile and analysis.

### 4.6 Start All Over Again
* **Action:** A universally available "Start All Over Again" button exists on all result tabs to permit users to retake the quiz entirely.
* **State Wipe:** Clicking this button wipes any local progress states and reroutes the application back to the `welcome` root screen, providing a seamless loop for repeated attempts.

---

## 5. Reusable Feedback System

A feedback collection and management system is available globally throughout the application.

### 5.1 Floating Feedback Button
A rounded button (`MessageSquareHeart` icon) floats on the bottom-right corner (`fixed bottom-6 right-6 z-[60]`) of all screens.
* **Behavior:** 
  * If the user is unauthenticated, clicking the button triggers the Google login popup.
  * Once the user is authenticated, it opens the `FeedbackModal`.

### 5.2 Feedback Modal
Provides a clean, centered interface for users to submit comments:
* **Inputs:** A required textarea field.
* **Submission:** On submit, calls `saveUserFeedback` to persist the data in Firestore.
* **Context Capture:** Captures the origin page context (`source="floating_button"`).
* **Feedback Status:** Displays a green success checkmark upon successful submission and automatically closes after 2.5 seconds.

### 5.3 Admin Feedback Panel
A panel that slides in from the right (`fixed inset-y-0 right-0 z-[100]`), accessible only to the administrator (`tsur.david@gmail.com`):
* **Information Displayed:** Total feedback count, unread count, list of all entries sorted by creation time (newest first). Each card displays the sender's email, timestamp, feedback text, source indicator, and display name.
* **Read Status Toggle:** An interactive check button ("Mark Read" / "Mark Unread") updates the read status in Firestore instantly.
* **Manual Refresh:** Renders a refresh icon button that updates the list on demand.

---

## 6. Firestore Database & Security Rules

Firestore is used for persistent storage in two main collections: `feedback` and `results`.

### 6.1 Feedback Collection Schema
Each document in the `feedback` collection conforms to the following schema:

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (Doc ID) | Firestore document ID. |
| `userId` | String | Firebase Authentication UID of the submitter. |
| `userEmail` | String | Email address of the submitter. |
| `userName` | String | Display name of the submitter. |
| `feedbackText`| String | The feedback comment. |
| `source` | String | Context marker indicating where the feedback was sent from. |
| `read` | Boolean | Read/Unread flag for administrative triage. |
| `createdAt` | Timestamp | Firestore server timestamp. |

### 6.2 Results Collection Schema
Each document in the `results` collection conforms to the following schema:

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (Doc ID) | Matches the user's UID for 1:1 mapping. |
| `userId` | String | Firebase Authentication UID. |
| `userEmail` | String | Email address of the submitter. |
| `displayName` | String | Display name of the submitter. |
| `role` | String | 'manager' or 'employee'. |
| `finalResult` | String | The user's primary appreciation style (A-E). |
| `counts` | Object | Tally of all selected options. |
| `createdAt` | Timestamp | Firestore server timestamp. |
| `updatedAt` | Timestamp | Firestore server timestamp. |

### 6.3 Security Rules
Configured in `firestore.rules`:
* **Feedback Collection:** 
  * Any authenticated user can write feedback, provided their `userId` matches the authenticated user ID and their `userEmail` matches the auth token email.
  * Restricted solely to the admin email `tsur.david@gmail.com` for reading and updating.
* **Results Collection:**
  * Any authenticated user can create/update their own assessment result (document ID must match user ID).
  * Anyone can read a specific user's document for public profile sharing.
  * Only the administrator (`tsur.david@gmail.com`) can execute `list` operations to query all results.
* **Delete Rules:** Deleted operations are blocked globally (`allow delete: if false`).

---

## 7. Team Dashboard & Aggregate Analytics

A specialized view explicitly built for organizational administrators to review and dissect collective team data.

### 7.1 Access & Routing
* **Protected Entry:** Available only when the authenticated user is the designated admin. A "Dashboard" button mounts on the top navigation bar.
* **State Management:** Triggering this button transitions the active `AppState` to `team-dashboard`.

### 7.2 Analytics Overview
* **Aggregated Fetching:** The system invokes `listAllResults()` directly bypassing normal restrictive quotas due to admin authorization. It securely compiles all team members' submitted assessments.
* **Metric Cards:** Generates summary statistics tracking the total number of assessments taken, breaking them down into absolute numbers for "Managers" and "Employees".
* **Language Distribution Graph:** Dynamically computes and plots the total frequency of each primary Love Language across the entire team, presenting them via custom visual progress bars that map strictly to the application's core color palette.
* **Recent Activity Table:** Outputs a tabular audit log indicating exactly who took the test, when they took it, and what their primary style resulted in.

---

## 8. Bilingual Support & Formatting

* **Language Context:** Managed by `LanguageProvider` supporting Hebrew (`he`) and English (`en`).
* **Visual Direction:** Toggles HTML/document writing direction (`dir="rtl"` for Hebrew, `dir="ltr"` for English) affecting layout flows, margins, align-starts, and chevron navigation arrows.
* **Fonts:** Uses Outfit/Inter typography for modern, readable visual flows.
* **Legal Compliance:** Renders terms, privacy policy, and accessibility statements in both English and Hebrew, matching Israeli IS 5568 Level AA standards.
