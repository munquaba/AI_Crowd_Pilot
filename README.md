# AI Crowd Pilot 🏟️

> AI-powered stadium assistant for real-time crowd monitoring, smart navigation, queue management, and personalized guidance.  
> Built for **PromptWars Hackathon**.

## Features

🔴 **[View Live Application on Google Cloud Run](https://ai-crowd-pilot-454472739569.us-central1.run.app)**

- 🧠 **Smart Recommendations** — AI-generated actionable insights (BEST / AVOID / RECOMMENDED)
- 🤖 **AI Chat Assistant** — Natural language queries for food, washrooms, navigation, gates, and crowds
- 🏟️ **Interactive Stadium Map** — Clickable SVG with density-colored sections and gates
- 🧭 **Smart Navigation** — Route finder prioritizing lower crowd levels
- ⏱️ **Queue Management** — Food stalls and washrooms ranked by wait time with GO NOW / SKIP
- 📍 **User Location** — Personalized recommendations based on your position
- 🔄 **Real-Time Updates** — Data refreshes every 5 seconds with live indicators

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Animations | Framer Motion |
| Testing | Jest + React Testing Library |
| Deployment | Google Cloud Run |

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint code |

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.js        # AI chat with intent detection + rate limiting
│   │   └── stadium/route.js     # Stadium data API with simulation
│   ├── globals.css              # Design system (glassmorphism, animations, a11y)
│   ├── layout.js                # Root layout with SEO + skip-to-content
│   └── page.js                  # Main page with lazy loading + error boundaries
├── components/
│   ├── AlertBanner.jsx          # Rotating alert strip
│   ├── ChatAssistant.jsx        # Full-screen modal chat (safe rendering, ARIA)
│   ├── Dashboard.jsx            # Stats, gates, queues overview
│   ├── ErrorBoundary.jsx        # Graceful error handling
│   ├── NavigationPanel.jsx      # Route finder
│   ├── QueueManagement.jsx      # Food/washroom queues
│   ├── SmartRecommendations.jsx # "What should I do now?" panel
│   ├── StadiumMap.jsx           # Interactive SVG stadium map
│   └── UserLocationSelector.jsx # Location picker dropdown
├── data/
│   └── stadiumData.js           # Mock data + simulation engine
├── hooks/
│   └── useStadiumData.js        # Auto-refresh hook (5s interval)
└── lib/
    └── utils.js                 # Shared utilities (sanitization, parsing, colors)
```

## Security

- CSP, X-Frame-Options, XSS Protection headers via `next.config.mjs`
- Input sanitization on all API endpoints
- Rate limiting (20 req/min per IP)
- Safe rendering (no `dangerouslySetInnerHTML`)
- X-Powered-By header removed

## Accessibility

- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<header>`)
- ARIA labels on all interactive elements
- `role="dialog"` on chat modal with `aria-modal`
- Keyboard navigation (Escape to close, skip-to-content)
- `prefers-reduced-motion` support
- `focus-visible` outlines
- `aria-live` regions for real-time updates
- WCAG AA color contrast

## Testing

```bash
npm test          # Run all tests
npm test:coverage # With coverage report
```

Tests cover:
- Input sanitization (XSS prevention)
- Markdown parsing (safe rendering)
- Crowd color/style helpers
- Stadium data structure & snapshot isolation
- Debounce utility

## License

MIT
