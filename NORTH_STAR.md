# Dynasty Breakdown - Product North Star

## Mission
Tell the story of your dynasty league. Celebrate championships, remember collapses, relive epic trades, and preserve your league's history in one shareable, beautiful place.

## Vision
Become the official league historian for dynasty football. Every great league has stories—we're the platform that finds them, visualizes them, and makes them impossible to forget or ignore.

---

## Core North Star Metric
**Stories Discovered Per League**: How many cool/memorable moments does the tool find and surface about a league's history? (e.g., "Team X never won a chip despite 3 championship game appearances", "Most traded-for player", "Best waiver wire haul")

---

## Product Pillars

### 1. **Storytelling**
Surface the narratives buried in league data.
- Find patterns: "Team A hasn't won despite being top-5 in scoring 4 times"
- Celebrate: Trophy rooms, dynasty dynasties, Cinderella stories
- Remember: Epic collapses, trade blunders, waiver wire steals
- Every stat should have a human story

### 2. **Shareability**
Make league history shareable, quotable, and meme-able.
- Beautiful visualizations of league moments
- Screenshot-friendly designs
- Highlight reels for group chat
- Facts and stats that spark conversation and clowning

### 3. **Accuracy**
Real Sleeper data, complete history.
- Pull all available historical data (trades, transactions, matchups)
- Chain past seasons via `previous_league_id`
- No speculation, only verified facts
- Timestamp everything for context

### 4. **Accessibility**
One-click league insight.
- Just a league ID—instant story generation
- No logins, no complexity
- Works on mobile for sharing
- Load data once, explore endlessly

---

## User Workflows

### Primary: "See Your League's Story"
1. User enters league ID on landing page
2. App fetches all historical data (trades, transactions, matchups, past seasons)
3. User lands on **League Overview** with key stats and story hooks
4. User clicks through tabs to explore different narratives
5. User finds shareable moments and screenshots them for group chat

**Success Metric**: User finds 3+ surprising or funny facts about their league, shares at least one

### Secondary: "Trophy Room" Tab
1. User clicks Trophy Room
2. See all championships (past and current season)
3. View runner-ups, 3rd place finishers
4. See "should have won" teams (highest scoring but didn't make finals)
5. Screenshot and clown friends who choked

### Tertiary: "Toilet Bowl" Tab
1. User clicks Toilet Bowl
2. See all last-place finishes by team
3. Longest losing streaks
4. Most consecutive seasons finishing bottom 3
5. "Cursed teams" that rebuild forever
6. Year-to-year collapse moments

### Quaternary: "The Trades" Tab
1. User clicks The Trades
2. See most active traders
3. Best trade steals (player acquired cheap, became star)
4. Worst trade blunders (player traded away, became star elsewhere)
5. Timeline of all trades with player context
6. Trade partners analysis

---

## Design Principles

### Keep It Simple
- Don't abstract too early
- One feature done right > five half-baked features
- Every element should have a clear purpose
- Remove before you add

### Make It Fast
- Information architecture should minimize clicks
- Visual design should aid, not obstruct
- Load data upfront; sort locally
- Optimize for repeated use

### Make It Beautiful
- Dark theme (no bright white backgrounds)
- Blue + Amber as the trust + action color combo
- Generous spacing and breathing room
- Gradient accents for visual interest, not distraction

### Build for Banter
- Screenshots should look slick in Discord/Group chat
- Color coding should pop in mobile screenshots
- Hierarchies should be obvious without explanation
- Make "sharing wins" feel natural

---

## Success Criteria (Phase 1: MVP - League Storytelling)

✅ **Must Have**
- [x] Fetch league by ID
- [x] Display current rosters with player details
- [x] Fetch all historical data (trades, transactions, matchups)
- [ ] **League Overview Tab** - Key stats and story hooks
- [ ] **Trophy Room Tab** - Championships, runner-ups, "should have won" teams
- [ ] **Toilet Bowl Tab** - Last place finishes, losing streaks, cursed teams
- [ ] **Trades Tab** - Trade history with player context
- [ ] Chain past seasons via `previous_league_id`
- [ ] Clean, shareable layouts
- [ ] URL-based state persistence
- [ ] Fully responsive design

🎯 **Should Have**
- [ ] Activity timeline (all trades/transactions chronologically)
- [ ] Team-specific story highlights ("X has never won despite 3 finals appearances")
- [ ] Waiver wire highlights (best pickups, worst drops)
- [ ] League statistics (total trades, most active trader, etc.)
- [ ] Search across league history

⭐ **Nice to Have**
- [ ] Compare team performance across seasons
- [ ] Player journey tracking (follow a player's ownership history)
- [ ] Draft analysis (how'd that pick turn out?)
- [ ] Meme/quote generation from league moments
- [ ] Export league story as shareable report
- [ ] League comparisons (stats vs other leagues)

---

## Anti-Patterns (Don't Do This)

❌ **Over-engineering**
- Don't add complex filtering before seeing what users actually want
- Don't build "admin panels" or unnecessary settings
- Don't optimize for edge cases before solving core use case

❌ **Information Overload**
- Don't show ADP, ECR, projections, bye weeks all at once
- Don't make every player clickable to a detail modal
- Don't add layers of navigation

❌ **Slow/Clunky Feel**
- Don't load full player database before showing anything
- Don't lazy-load rosters—fetch all upfront
- Don't have stiff, slow animations

❌ **Ugly Screenshots**
- Don't use light backgrounds (screenshots look washed out)
- Don't have ambiguous color coding
- Don't truncate player names
- Don't make cards so small they're unreadable on phone screenshots

---

## Roadmap Hints (Post-MVP)

### Phase 2: Deeper Story Mining
- Individual owner archetypes ("The Hoarder", "The Flip Artist", "The Graveyard Gardener")
- Season-by-season narratives (collapse, rise, consistency)
- Head-to-head records (rivalries, matchup history)
- "What if" moments (injuries, bad trades, timing)

### Phase 3: Advanced Analytics
- Trade value trajectory (was that a steal or a blunder 3 years later?)
- Waiver wire impact (best pickups per season, wire depth by year)
- Draft efficiency scoring (did early picks outperform expectations?)
- Scoring trends (league inflation, scoring creep)

### Phase 4: Community & Sharing
- Shareable league cards (embed in Discord, post on Twitter)
- Public league directory (see other league stories)
- Comparative stats (how does your league compare to others?)
- League awards voting (community determines "best trade", "biggest blunder")

---

## Tone & Voice

- **Confident but not cocky**: "See your league like never before" not "Only we can do this"
- **Direct and action-oriented**: Use active verbs ("Unlock", "Analyze", "Discover")
- **Casual but professional**: This is fantasy banter, not a bank
- **Emoji used sparingly**: Only in feature callouts and icons, never in copy

---

## Brand Pillars

1. **Dynasty Intelligence**: Smart insights, not just data dumps
2. **The Guild**: For dynasty nerds who live and breathe this game
3. **Immediate Value**: See something useful within seconds
4. **No Fluff**: Every feature earns its place
