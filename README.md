# Fantasy Wrapped

A beautiful, shareable platform for telling the story of your fantasy football league. Think Spotify Wrapped, but for dynasty football.

## What is Fantasy Wrapped?

Fantasy Wrapped surfaces the narratives buried in your league's history. Championships, collapses, epic trades, waiver wire steals—everything that makes your league legendary, all in one place.

Enter your league ID, and instantly see:
- **League Records** - Top 10 scorers, bottom 10 scorers, most dominant matchups, closest battles
- **Trading Analytics** - Most active traders, common trading partners, deal history
- **Trophy Room** - Championship history and near-misses
- **Toilet Bowl** - Losing streaks and cursed teams
- **Complete History** - Multi-season data chained via Sleeper's `previous_league_id`

Everything is designed to be screenshot-friendly for sharing in group chats and Discord.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone git@github.com:hr23232323/fantasy-wrapped.git
cd fantasy-wrapped

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
fantasy-wrapped/
├── app/
│   ├── page.tsx                 # Main app entry point
│   ├── layout.tsx               # Root layout
│   ├── components/
│   │   ├── RecordsTab.tsx        # League records display
│   │   ├── RankingTable.tsx      # Reusable ranking table (Top/Bottom 10)
│   │   ├── MatchupTable.tsx      # Reusable matchup table (Differential/Closest)
│   │   └── PositionBadge.tsx     # Position indicator badges
│   └── services/
│       └── dataFetching.ts       # Sleeper API integration
├── public/                       # Static assets
├── docs/
│   ├── NORTH_STAR.md            # Product vision & requirements
│   ├── STYLE_GUIDE.md           # Design system & principles
│   └── ARCHITECTURE.md          # Technical architecture (coming soon)
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Key Features

### Data Layer
- **Parallel API Fetching** - Optimized Sleeper API calls using `Promise.all()`
- **Bot Detection** - Automatically identifies bot-managed rosters
- **Multi-Season Support** - Chains historical data via `previous_league_id`
- **Proper Matchup Pairing** - Uses `matchup_id` to correctly pair opponents

### UI Components
- **Reusable Tables** - `RankingTable` and `MatchupTable` components eliminate duplication
- **Responsive Design** - Side-by-side layouts on desktop, stacked on mobile
- **Visual Hierarchy** - Color-coded gradients (green for best, red for worst)
- **Screenshot Optimized** - Dark theme, readable on mobile, designed for sharing

### Analytics
- Trading analytics counting both creators and consenters
- Most common trading partners
- Scoring differentials and closest matchups
- Historical records across all seasons

## Tech Stack

- **Frontend** - React 18 with TypeScript
- **Framework** - Next.js 16 with App Router
- **Styling** - Tailwind CSS
- **Data** - Sleeper Leaderboard API (free, no auth required)
- **Deployment** - Docker (dev & prod configs included)

## Data Sources

All data comes from the free Sleeper Leaderboard API:
- `/v1/league/{league_id}` - League metadata
- `/v1/league/{league_id}/rosters` - Team rosters
- `/v1/league/{league_id}/users` - User profiles
- `/v1/league/{league_id}/transactions/{round}` - Trade & transaction history
- `/v1/league/{league_id}/matchups/{week}` - Weekly matchup scores
- `/v1/players/nfl` - Player database

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Docker

```bash
# Development build
docker build -f dev.Dockerfile -t fantasy-wrapped:dev .
docker-compose up

# Production build
docker build -f prod.Dockerfile -t fantasy-wrapped:prod .
```

## Architecture Decisions

### Why Reusable Components?
- `RankingTable` - Powers both Top 10 and Bottom 10 scoring with configurable props
- `MatchupTable` - Powers both Most Differential and Closest Matchups

### Why Parallel Fetching?
Initial load fetches players, trades, and matchups in parallel using `Promise.all()` for speed.

### Bot Detection
Rosters not in the `/users` endpoint are bots. Simple, reliable, no false positives.

### Matchup Pairing
Sleeper's `opponent_id` is always null. Instead, we pair matchups by `matchup_id` + `week` + different `roster_id`.

## Roadmap

See [docs/NORTH_STAR.md](docs/NORTH_STAR.md) for the full product vision including:
- Phase 1: MVP - League storytelling (current)
- Phase 2: Deeper story mining (owner archetypes, season narratives)
- Phase 3: Advanced analytics (trade value trajectory, draft efficiency)
- Phase 4: Community & sharing (public league directory, comparative stats)

## Contributing

We're building this in public. Issues, PRs, and ideas welcome!

## License

MIT

## Made With

- React + TypeScript
- Next.js + App Router
- Tailwind CSS
- Sleeper Leaderboard API

---

**Questions?** Check out [docs/NORTH_STAR.md](docs/NORTH_STAR.md) for product requirements or [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) for design principles.
