# 💖 Workplace Love Language

An innovative, bilingual assessment and coaching platform built to evaluate how professionals prefer to receive appreciation, recognition, and support in a work environment. Designed specifically for tech, product, and leadership teams to enhance workplace dynamics, bridge communication gaps, and proactively prevent burnout.

---

## 🚀 Key Features

* **Bilingual Experience:** Full support for Hebrew (RTL) and English (LTR) with instant, non-destructive language switching.
* **Role-Based Assessment:** Tailored questionnaire paths and custom analyses for **Managers** and **Individual Contributors (Employees)**.
* **Appreciation Style Breakdown:** Evaluates individuals across five workplace-adapted appreciation languages:
  * **Words of Affirmation:** Feedback + Mentorship
  * **Quality Time:** Workplace Bonding
  * **Receiving Gifts:** New Opportunities + Challenges
  * **Acts of Service:** Process & Task Support
  * **Encouraging Touchpoints:** Excitement, celebratory syncs, and micro-wins
* **Interactive SVG Visualization:** Concentric radial wedge graph showing the exact percentage breakdown of the user's appreciation style profile.
* **Gemini AI Coaching Insights:** Uses the `@google/genai` SDK and the `gemini-2.5-flash` model to analyze the user's role and score distribution, delivering a personalized professional playbook and action plan.
* **Bilingual Legal Compliance:** Features complete terms of use, privacy policy, and accessibility statements in both Hebrew and English.
* **Global Reusable Feedback System:** Includes a floating feedback widget, a popup submission form, and an interactive admin triage dashboard.

---

## 🛠 Tech Stack

* **Frontend:** React 19, TypeScript, Vite, TailwindCSS (v4), Motion (for fluid animations)
* **Routing:** `react-router-dom` for Single Page Application navigation
* **Backend & Persistence:** Firebase Firestore, Firebase Authentication, and Firebase Hosting
* **Coaching Core:** Google Gemini AI API (`gemini-2.5-flash` via `@google/genai`)

---

## 📂 Project Structure

```
├── .firebaserc                  # Firebase project associations
├── firebase.json                # Hosting redirects, rewrites, and security config
├── firestore.rules              # Firestore data protection rules
├── package.json                 # Dependency list and script commands
├── server.ts                    # Local server launcher (supports tsx execution)
├── vite.config.ts               # Vite bundler options
├── src/
│   ├── main.tsx                 # Client entry point
│   ├── App.tsx                  # Core app container, routing, and top navigation
│   ├── components/              # Reusable UI components
│   │   ├── WelcomeScreen.tsx    # Role selector, welcome text, and login gating
│   │   ├── QuizScreen.tsx       # Live assessment questionnaire
│   │   ├── ResultScreen.tsx     # Custom radial SVGs and Gemini coaching analysis
│   │   ├── FloatingFeedback.tsx # Global floating feedback trigger
│   │   ├── FeedbackModal.tsx    # Client feedback submission dialog
│   │   ├── AdminFeedbackPanel.tsx # Admin feedback reader and read/unread toggles
│   │   ├── LegalPage.tsx        # Localized compliance pages
│   │   └── LanguageSwitcher.tsx # Toggle element for LTR/RTL layouts
│   ├── contexts/                # React Context providers
│   │   ├── AuthContext.tsx      # Google Sign-In and session synchronization
│   │   └── LanguageContext.tsx  # Global language (he/en) and direction (rtl/ltr) state
│   ├── data/                    # Hardcoded translation dictionaries and quiz content
│   │   ├── quizData.ts          # English quiz content and profiles
│   │   ├── quizData.he.ts       # Hebrew translations of questions and profiles
│   │   ├── translations.ts      # Dictionary of client UI text in Hebrew and English
│   │   └── legalTranslations.ts # Static legal content (Terms, Privacy, Accessibility)
│   └── lib/                     # Firebase and database initialization utilities
│       ├── firebase.ts          # Firebase SDK initialization
│       ├── dbService.ts         # Firestore operations for feedback
│       └── firebaseErrors.ts    # User-facing error message mapping
```

---

## 🔒 Security & Firestore Rules

Firestore security is enforced in `firestore.rules`:
* **Submitting Feedback:** Any authenticated user can write feedback, provided their user ID matches the document's `userId` and their email matches the document's `userEmail`.
* **Managing Feedback:** Only the administrator (`tsur.david@gmail.com`) is allowed to read or update feedback documents.
* **Deletions:** Globally blocked (`allow delete: if false`).

---

## 💻 Local Development

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Environment Variables
Create a `.env` file in the root directory and add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
The app will be accessible at `http://localhost:5173`.

---

## 📦 Production Build & Deployment

### Build the Project
To compile the static bundle into the `dist/` directory:
```bash
npm run build
```

### Local Production Preview
To preview the production bundle locally:
```bash
npm run preview
```

### Deploy to Firebase
To deploy the application and firestore rules to production:
```bash
npx firebase-tools deploy
```
*(Requires Firebase CLI credentials)*
