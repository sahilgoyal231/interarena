# InterArena

InterArena is an advanced mock assessment platform designed to help students prepare for tier-1 placement Online Assessments (OAs). It provides a high-fidelity mock environment for coding, aptitude, system design, and AI interviews with time-based constraints, mimicking real-world recruitment pressure.

## 🚀 Features

### 1. Interactive 3D Dashboard (`/home`)
The core hub for students featuring a stunning "Mock IDE" layout that simulates a live competitive programming environment. Navigation uses interactive 3D icon cards that tilt and glow on hover, providing access to all modules and mock assessments.

### 2. Coding & Technical Hub (`/coding`)
- **Guess Output Mode**: Real code snippets presented in a fully-fledged Monaco Code Editor. Students read complex implementations (Undefined Behavior, Move Semantics, Pointers) and predict the exact output.
- **Debug Mode**: A true LeetCode-style debugging environment! Features detailed algorithmic problem statements with Constraints and Examples. The user fixes the bug in a live editor and clicks **Run** to execute safe *example test cases*, or **Submit** to execute against *hidden edge cases* via a secure backend execution engine.

### 3. Advanced Theoretical Modules (`/design`, `/prompt`, `/genai`)
- **System Design**: Split into High Level Design (HLD) covering Scalability, Microservices, and Load Balancing, and Low Level Design (LLD) covering Design Patterns and SOLID Principles.
- **Prompting & LLMs**: Deep dive into Prompt Engineering techniques (CoT, ToT) and Large Language Model architectures (Transformers, RAG, Fine-Tuning).
- **Generative AI**: Modules covering AI Basics (Neural Networks, Embeddings) and Advanced GenAI (Diffusion Models, Agentic Workflows, Multimodal AI).

### 4. Aptitude Hub & Mix Practice (`/aptitude`, `/verbal`)
- **Apt-Sprints**: Focus on specific Quantitative, Verbal, or Logical reasoning topics under timed pressure.
- **Adaptive Mix**: A highly interactive feature that dynamically generates a mixed quiz based on a user-defined duration (10 to 180 minutes). The system automatically calculates the number of questions to ensure a realistic ~1.5 min/question pacing.

### 5. Live Assessment Interface
A rigorous split-pane testing environment for quizzes:
- **Ticking Clock**: Dynamic countdown timer that changes colors (to a pulsing red) when time runs low.
- **Auto-Submission**: Automatically submits the assessment when the timer reaches zero.
- **Detailed Review (ResultCard)**: After submission, users get an immediate breakdown of their Score and Accuracy, followed by a detailed review of each question, highlighting their answer, the correct answer, and an in-depth explanation.

### 6. Autonomous Data Generation Pipeline
A robust internal Node.js pipeline (`scripts/generate-massive-dataset.ts`) using Google Gemini AI to autonomously generate over 20,000+ unique, industry-standard interview questions across all categories and difficulty levels. Features built-in formatting checks, quotas/rate-limiting, and multiple API key rotations.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Database:** PostgreSQL (Neon)
- **Authentication:** Clerk (`@clerk/nextjs`)
- **Styling:** Tailwind CSS (v4) & PostCSS
- **Animations & UI:** Framer Motion, shadcn/ui (Radix Primitives), tsparticles, Atropos (3D cards)
- **Editor Engine:** `@monaco-editor/react` (Custom zinc-950 theme)
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

- `/src/app/` - Next.js App Router setup. Contains all the routes (`/home`, `/coding`, `/design`, `/aptitude`, `/api`, etc.)
- `/src/components/ui/` - Reusable UI components (shadcn/ui, ScrollReveal, NodeNetwork, CodeEditor, etc.)
- `/src/lib/` - Utilities and Prisma client initialization.
- `/prisma/` - Prisma schema and migration configurations.
- `/scripts/` - Node.js scripts for massive data generation and database sanitization.

---

## 🎨 Design System

InterArena relies heavily on a premium, dark-mode-first aesthetic known as "Glassmorphism" combined with vivid glowing accents (purples, emeralds, ambers). It uses nested box shadows, backdrop blurs, 3D tilt effects, and Framer Motion's intersection observer APIs (`whileInView`) to create a fluid, highly engaging user experience designed to stand out.
