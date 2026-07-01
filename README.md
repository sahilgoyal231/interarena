# InterArena

InterArena is an advanced mock assessment platform designed to help students prepare for tier-1 placement Online Assessments (OAs). It provides a high-fidelity mock environment for coding, aptitude, and verbal tests with time-based constraints, mimicking real-world recruitment pressure.

## 🚀 Features

### 1. Student Dashboard (`/home`)
The core hub for students featuring a stunning "Mock IDE" layout that simulates a live competitive programming environment. It provides access to all modules and mock assessments.

### 2. Aptitude Hub & Mix Practice (`/aptitude`)
- **Apt-Sprints**: Focus on specific Quantitative or Logical reasoning topics under timed pressure.
- **Adaptive Mix**: A highly interactive feature that dynamically generates a mixed quiz based on a user-defined duration (10 to 180 minutes). The system automatically calculates the number of questions to ensure a realistic ~1.5 min/question pacing.

### 3. Live Assessment Interface (`/aptitude/[subTopic]`)
A rigorous split-pane testing environment:
- **Ticking Clock**: Dynamic countdown timer that changes colors (to a pulsing red) when time runs low.
- **Auto-Submission**: Automatically submits the assessment when the timer reaches zero.
- **Detailed Review (ResultCard)**: After submission, users get an immediate breakdown of their Score and Accuracy, followed by a detailed review of each question, highlighting their answer, the correct answer, and an in-depth explanation.

### 4. Admin Content Pipeline (`/admin`)
A robust internal CMS portal for administrators to populate the question bank:
- Supports multiple question types: `DEBUG_CODE`, `APTITUDE`, `VERBAL`, `GUESS_OUTPUT`.
- Dynamic hierarchical fields (Category → Sub-Topic).
- Dedicated monospaced inputs for `Boilerplate Code` and `Hidden Test Cases` for coding problems.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** Clerk (`@clerk/nextjs`)
- **Styling:** Tailwind CSS (v4) & PostCSS
- **Animations & UI:** Framer Motion, shadcn/ui (Radix Primitives), tsparticles
- **Icons:** Lucide React, Phosphor Icons
- **Typography:** Custom Google Fonts via `next/font` (JetBrains Mono, Bodoni Moda, Geist, Space Grotesk, Syne, etc.)

---

## 🗄️ Database Schema

The database uses Prisma (`prisma/schema.prisma`) connected to a PostgreSQL instance.

- **`User`**: Handled alongside Clerk for metadata (includes `role`, `streak`).
- **`Question`**: The core entity storing all problems. Features fields for `type`, `category`, `subTopic`, `prompt`, `correctAnswer`, `explanation`, and optional fields for coding like `options` (JSON), `boilerPlateCode`, and `testCases` (JSON).
- **`Assessment`** & **`AssessmentQuestion`**: Models to bundle specific questions into full-length Mock Online Assessments (MOAs).
- **`Submission`**: Tracks user attempts and scores.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Clerk Account (for Authentication)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/interarena.git
   cd interarena
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` and `.env.local` file in the root directory and add your keys:
   ```env
   # PostgreSQL Connection String
   DATABASE_URL="postgresql://user:password@host:port/database"
   
   # Clerk Auth Keys
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

4. **Initialize Prisma:**
   Push the schema to your database and generate the Prisma Client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📝 Folder Structure

- `/src/app/` - Next.js App Router setup. Contains all the routes (`/home`, `/admin`, `/aptitude`, `/api`, etc.)
- `/src/components/ui/` - Reusable UI components (shadcn/ui, ScrollReveal, NodeNetwork, etc.)
- `/src/lib/` - Utilities and Prisma client initialization.
- `/prisma/` - Prisma schema and migration configurations.

---

## 🎨 Design System

InterArena relies heavily on a premium, dark-mode-first aesthetic known as "Glassmorphism" combined with vivid glowing accents (purples, emeralds, ambers). It uses nested box shadows, backdrop blurs, and Framer Motion's intersection observer APIs (`whileInView`) to create a fluid, highly engaging user experience designed to stand out.
