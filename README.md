# inVision U — AI Candidate Intelligence Platform

> **Decentrathon 5.0** · Track: AI inDrive · Built for inVision U Admissions Committee

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

---

## 🎯 What It Does

An AI-powered, **explainable** candidate scoring platform for inVision U's admissions committee. Instead of black-box decisions, every score comes with transparent reasoning — keeping humans in control.

### Key Features

| Feature | Description |
|---|---|
| **Multi-Dimensional Scoring** | 6 independent scores: Leadership, Motivation, Growth Trajectory, Communication, Growth Velocity, AI Usage |
| **🎭 Blind Review Mode** | Toggle off candidate names for bias-free evaluation |
| **🔥 AI Essay Heatmap** | Sentence-by-sentence highlight of AI-generated text signals |
| **📈 Growth Velocity Score** | Evaluates trajectory speed, not just current achievements |
| **💬 Smart Interview Questions** | AI generates targeted questions for each candidate's weak points |
| **⚡ Live Scoring Preview** | Score updates in real-time as you type your application |
| **📊 Batch Upload** | Score an entire applicant pool from a JSON file |
| **🏆 Ranked Leaderboard** | Filterable, sortable with 4 scoring weight profiles |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Alikkkhx/invision-u-ai.git
cd invision-u-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional: Gemini AI Integration

For enhanced LLM-powered scoring, add a Gemini API key:

```bash
# Create .env.local
echo "GEMINI_API_KEY=your_key_here" > .env.local
```

The system works fully in **heuristic-only mode** without an API key.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main dashboard
│   ├── leaderboard/page.tsx        # Full ranked leaderboard
│   ├── candidates/[id]/page.tsx    # Candidate deep-dive
│   ├── submit/page.tsx             # Live scoring preview
│   ├── upload/page.tsx             # Batch upload & scoring
│   └── api/
│       ├── candidates/route.ts     # GET all / POST one
│       ├── candidates/[id]/route.ts
│       └── score/route.ts          # Batch scoring endpoint
├── components/
│   └── Navbar.tsx
├── lib/
│   ├── scoring/
│   │   └── engine.ts               # Core scoring engine
│   └── utils.ts
├── data/
│   └── candidates.json             # 12 synthetic demo candidates
└── types/
    └── index.ts
```

---

## 🧠 Scoring Methodology

### Dimensions

| Dimension | Weight (Default) | Description |
|---|---|---|
| Leadership Potential | 28% | Initiative signals, organizing, founding, leading |
| Motivation & Authenticity | 22% | Mission-driven language, specific goals, passion |
| Growth Trajectory | 20% | Resilience, adversity narrative, progress markers |
| Communication Clarity | 15% | Vocabulary richness, readability, essay structure |
| Growth Velocity | 15% | Achievement rate relative to age and context |
| AI Usage (penalty) | -8–12% | Burstiness analysis + AI phrase detection |

### Weight Profiles

Administrators can switch between 4 pre-configured weight profiles:
- **Balanced** (default) — equal priority
- **Leadership Focus** — 40% leadership weight
- **Authenticity Focus** — 35% motivation weight  
- **Growth Potential** — 30% velocity weight

### AI Usage Detection

The heuristic AI detector uses:
1. **Phrase matching** — 20+ known AI-generation clichés
2. **Sentence burstiness** — low coefficient of variation = suspicious
3. **Average sentence length** — very long = possibly AI

**Important**: AI suspicion is advisory only, never automatically disqualifying.

---

## 🔒 Ethics & Fairness

- **No demographic scoring**: Name, gender, city, school prestige are NOT used in scoring
- **Explainable AI**: Every score has a text explanation — no black boxes
- **Human-in-the-loop**: Recommendations are suggestions; committee decides
- **AI advisory only**: AI usage suspicion never auto-rejects a candidate
- **Blind Review Mode**: Optional anonymization for bias-free review sessions

---

## 📊 API Reference

### `GET /api/candidates?profile=default`
Returns all 12 demo candidates scored and ranked.

### `POST /api/candidates`
Score a single candidate.
```json
{
  "candidate": { "name": "...", "essay": "...", ... },
  "profile": "default"
}
```

### `POST /api/score`
Batch score multiple candidates.
```json
{
  "candidates": [...],
  "profile": "default"
}
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom glassmorphism design system
- **Charts**: Recharts (Radar + Bar charts)
- **AI**: Heuristic NLP engine (Gemini-ready via API routes)
- **Data**: JSON (easily swappable with Supabase/PostgreSQL)
- **Deploy**: Vercel-ready

---

## 📋 Candidate Data Schema

```typescript
interface Candidate {
  id: string;
  name: string;
  age: number;
  city: string;
  school: string;
  gpa: number;           // 0–5
  submittedAt: string;   // ISO date
  essay: string;         // Main motivation essay
  experience: string[];  // List of experiences
  achievements: string[];
  languages: string[];
  socialLinks: Record<string, string>;
  videoStatement: boolean;
  references: number;
  extracurricular: string;
}
```

---

## 🚀 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

---

## ⚠️ Limitations & Known Risks

1. **No real training data**: Scoring weights are heuristic — not trained on actual admission outcomes
2. **Essay language bias**: English essays may score slightly higher due to keyword lists; Russian/Kazakh lists are curated but may miss nuance
3. **AI detection is probabilistic**: False positives possible for students who naturally write formal text
4. **No persistent storage**: Committee decisions are session-only (add a database for production)
5. **Gemini integration**: LLM-powered scoring requires API key and incurs costs at scale

---

## 👥 Team

Built for **Decentrathon 5.0** — AI inDrive Track

---

## 📄 License

MIT — Free to use, modify, and deploy.
