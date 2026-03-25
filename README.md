# PitchDeck Generator

AI-powered pitch deck and talk track generator. Go from idea to a branded, investor-ready 12-slide deck in under 30 minutes.

Built for:
- First-time founders
- SBDC workshops and university incubators
- Early-stage startup teams

---

## Features

- **Guided Q&A flow** — 20 questions, one at a time, mapped to 12 slides
- **Branding system** — Upload logo, set colors/fonts, or auto-extract from your website URL
- **12-slide deck** — Content + design notes for every slide
- **Talk track** — 3–5 minute speaker script in your brand's tone
- **"Improve my answer"** — AI rewrites any answer to be more compelling
- **Competition table** — Auto-generated comparison matrix
- **Financials table** — Year | Revenue | Costs | Profit (auto-generated)
- **Quick Improvements** — Specific gaps identified by Claude
- **Coach Notes** — For workshop facilitators
- **Export** — Copy, PDF, and PPTX
- **Workshop + Solo modes** — Faster or more detailed guidance
- **Autosave** — Progress saved to localStorage

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd pitch-deck-generator
npm install
```

### 2. Set your API key

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

Get your key at [console.anthropic.com](https://console.anthropic.com).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How It Works

### Phase 0 — Branding Setup (`/onboarding`)
- Upload logo (PNG/JPG/SVG)
- Set brand colors with color picker
- Add fonts
- Enter website URL → auto-extract brand style via Claude
- Or skip for a clean default design system

### Phase 1 — Q&A Flow (`/questionnaire`)
- 20 guided questions across 12 slides
- "Improve my answer" rewrites each answer using Claude
- Progress bar shows slide completion
- Skip optional questions
- Workshop mode = concise prompts | Solo mode = detailed guidance

### Phase 2 — Output (`/output`)

**Pitch Deck tab:**
- 12 expandable slide cards
- Each slide: title + 3-5 bullets + suggested visual + design notes
- Competition slide includes a comparison table
- Financials slide includes a revenue table

**Talk Track tab:**
- Full 3-5 minute script
- Quick Improvements panel
- Coach Notes for facilitators

**Export:**
- Copy all text to clipboard
- Export PDF (jsPDF, branded)
- Export PPTX (pptxgenjs, branded with your colors)

---

## Project Structure

```
pitch-deck-generator/
├── app/
│   ├── page.tsx              # Landing page
│   ├── onboarding/
│   │   └── page.tsx          # Branding setup
│   ├── questionnaire/
│   │   └── page.tsx          # Q&A flow
│   ├── output/
│   │   └── page.tsx          # Generated deck + talk track
│   └── api/
│       ├── generate/         # Main generation (Claude Opus 4.6)
│       ├── improve-answer/   # Per-answer improvement
│       └── extract-branding/ # Website URL scraping
├── components/
│   ├── BrandingSetup.tsx     # Logo upload, color picker, fonts
│   ├── QuestionCard.tsx      # One-question-at-a-time UI
│   ├── ProgressBar.tsx       # Progress + slide indicator
│   ├── SlideCard.tsx         # Individual slide display
│   ├── TalkTrackPanel.tsx    # Script + tabs
│   ├── ExportButtons.tsx     # Copy/PDF/PPTX export
│   └── ModeToggle.tsx        # Workshop vs Solo toggle
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── questions.ts          # All 20 questions
│   ├── store.ts              # Zustand state (persisted)
│   └── utils.ts              # Helpers
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| AI | Anthropic Claude Opus 4.6 |
| State | Zustand (localStorage persist) |
| File upload | react-dropzone |
| Color picker | react-colorful |
| PDF export | jsPDF |
| PPTX export | pptxgenjs |
| Icons | lucide-react |

---

## Claude API Usage

The app uses three API routes:

### `/api/generate`
- Model: `claude-opus-4-6`
- Features: `thinking: {type: "adaptive"}` for deep reasoning
- Tool use: Forces structured JSON output via `tool_choice`
- Streaming: Uses `.stream().finalMessage()` to prevent timeout

### `/api/improve-answer`
- Model: `claude-opus-4-6`
- Takes current answer + full context
- Returns improved, investor-friendly version

### `/api/extract-branding`
- Model: `claude-opus-4-6`
- Fetches website HTML, extracts colors/fonts/tone
- Returns structured branding profile

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy

The app uses Next.js API routes (serverless functions). No additional infrastructure needed.

**Important:** Set `maxDuration` in your Vercel settings to 60 seconds for the generation route (default is 10s on Hobby, 60s on Pro).

Add to `app/api/generate/route.ts` for Vercel:
```typescript
export const maxDuration = 60
```

---

## Customization

### Add questions
Edit `lib/questions.ts` — add entries to the `QUESTIONS` array.

### Change the model
In `app/api/generate/route.ts`, change `model: 'claude-opus-4-6'` to `claude-sonnet-4-6` for faster (but less detailed) generation.

### Customize the generation prompt
Edit `buildGenerationPrompt()` in `app/api/generate/route.ts`.

### Adjust slide count
Modify the tool schema and generation prompt to add/remove slides.

---

## Workshop Facilitation Guide

**Setup (5 min):**
1. Share the URL with all participants
2. Have everyone select "Workshop Mode"
3. Walk through branding setup together (can skip for speed)

**Q&A Round (15-20 min):**
1. Have teams work in parallel on questions
2. Use the sidebar to track slide progress
3. Encourage using "Improve my answer" for weak responses
4. Click "Generate" when teams have answered 12+ questions

**Review (10 min):**
1. Share screens on output page
2. Review each slide's design notes
3. Use Coach Notes for group discussion
4. Address Quick Improvements as homework

**Export (2 min):**
- Teams export PPTX to refine in PowerPoint/Keynote
- Or export PDF for immediate sharing

---

## License

MIT. Built for educational and startup use.
