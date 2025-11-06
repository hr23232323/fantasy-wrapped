// Types
export interface Player {
  player_id: string;
  first_name: string;
  last_name: string;
  position: string;
  team: string;
  status?: string;
  injury_status?: string;
}

export interface LeagueUser {
  user_id: string;
  display_name: string;
  avatar?: string;
  is_bot?: boolean;
  metadata?: {
    team_name?: string;
  };
}

export interface Roster {
  roster_id: number;
  owner_id: string;
  league_id: string;
  players: string[];
  starters: string[];
  settings: {
    wins: number;
    losses: number;
    fpts: number;
    fpts_against: number;
  };
}

export interface League {
  league_id: string;
  name: string;
  season: string;
  total_rosters: number;
  roster_positions?: string[];
  previous_league_id?: string;
}

export interface Trade {
  transaction_id: string;
  type: "trade";
  creator: string;
  created: number;
  status_updated: number;
  status: "complete" | "pending" | "failed";
  adds: Record<string, string>;
  drops: Record<string, string>;
  consenter_ids?: string[];
  roster_ids?: number[];
}

export interface Transaction {
  transaction_id: string;
  type: "waiver" | "free_agent" | "trade";
  creator_user_id: string;
  created: number;
  status_updated: number;
  status: "complete" | "pending" | "failed";
  adds: Record<string, string>;
  drops: Record<string, string>;
}

export interface Matchup {
  matchup_id: number;
  roster_id: number;
  opponent_id: number;
  points: number;
  wins: number;
  losses: number;
  week: number;
  year?: string;
  is_bot?: boolean;
}

// Fetch players
export async function fetchPlayers(): Promise<Record<string, Player>> {
  const res = await fetch(`https://api.sleeper.app/v1/players/nfl`);
  if (!res.ok) throw new Error("Failed to fetch players");
  return res.json();
}

// Fetch league and rosters for single league
export async function fetchLeagueAndRosters(leagueId: string) {
  const [leagueRes, rostersRes, usersRes] = await Promise.all([
    fetch(`https://api.sleeper.app/v1/league/${leagueId}`),
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`),
  ]);

  if (!leagueRes.ok) throw new Error("League not found");
  if (!rostersRes.ok) throw new Error("Failed to fetch rosters");
  if (!usersRes.ok) throw new Error("Failed to fetch users");

  const league = await leagueRes.json();
  const rosters = await rostersRes.json();
  const users: LeagueUser[] = await usersRes.json();

  return { league, rosters, users };
}

// Fetch all trades across all seasons
export async function fetchAllTrades(leagueId: string): Promise<Trade[]> {
  const allTrades: Trade[] = [];
  let currentLeagueId: string | null = leagueId;

  while (currentLeagueId) {
    // Fetch all 16 rounds in parallel for this season
    const roundPromises = [];
    for (let round = 1; round <= 16; round++) {
      roundPromises.push(
        fetch(`https://api.sleeper.app/v1/league/${currentLeagueId}/transactions/${round}`)
          .then(res => (res.ok ? res.json() : []))
          .catch(() => [])
      );
    }

    const allRounds = await Promise.all(roundPromises);
    allRounds.forEach((transactions: Transaction[]) => {
      transactions.forEach((t: Transaction) => {
        if (t.type === "trade") {
          allTrades.push(t as Trade);
        }
      });
    });

    // Get previous league
    try {
      const leagueRes = await fetch(`https://api.sleeper.app/v1/league/${currentLeagueId}`);
      if (leagueRes.ok) {
        const leagueData: League = await leagueRes.json();
        currentLeagueId = leagueData.previous_league_id || null;
      } else {
        break;
      }
    } catch {
      break;
    }
  }

  return allTrades;
}

// Fetch all matchups across all seasons
export async function fetchAllMatchups(leagueId: string, rosters: Roster[]): Promise<Matchup[]> {
  const allMatchups: Matchup[] = [];
  let currentLeagueId: string | null = leagueId;

  // Build a map of roster_id to is_bot status
  const rosterBotMap = new Map<number, boolean>();
  rosters.forEach(roster => {
    rosterBotMap.set(roster.roster_id, (roster as any).is_bot || false);
  });

  while (currentLeagueId) {
    let leagueYear = "";
    let nextLeagueId: string | null = null;

    // Get league season year and previous league id
    try {
      const leagueRes = await fetch(`https://api.sleeper.app/v1/league/${currentLeagueId}`);
      if (leagueRes.ok) {
        const leagueData: League = await leagueRes.json();
        leagueYear = leagueData.season || "";
        nextLeagueId = leagueData.previous_league_id || null;
      } else {
        break;
      }
    } catch {
      break;
    }

    // Fetch matchups for all weeks in parallel
    const matchupPromises = [];
    for (let week = 1; week <= 17; week++) {
      matchupPromises.push(
        fetch(`https://api.sleeper.app/v1/league/${currentLeagueId}/matchups/${week}`)
          .then(res => (res.ok ? res.json() : []))
          .catch(() => [])
      );
    }

    const allWeekMatchups = await Promise.all(matchupPromises);
    allWeekMatchups.forEach((weekData: Matchup[], weekIdx: number) => {
      weekData.forEach((m: Matchup) => {
        m.week = weekIdx + 1;
        m.year = leagueYear;
        m.is_bot = rosterBotMap.get(m.roster_id) || false;
        allMatchups.push(m);
      });
    });

    currentLeagueId = nextLeagueId;
  }

  return allMatchups;
}

// Bracket matchup structure
export interface BracketMatchup {
  r: number; // round number
  m: number; // match id
  w?: number; // winner roster_id
  l?: number; // loser roster_id
  t1?: number | { w?: number; l?: number }; // team 1 or bracket reference
  t2?: number | { w?: number; l?: number }; // team 2 or bracket reference
}

// Fetch playoff brackets across all seasons
export async function fetchAllPlayoffBrackets(leagueId: string): Promise<Record<string, { winners: BracketMatchup[]; losers: BracketMatchup[] }>> {
  const allBrackets: Record<string, { winners: BracketMatchup[]; losers: BracketMatchup[] }> = {};
  let currentLeagueId: string | null = leagueId;

  while (currentLeagueId) {
    let leagueYear = "";
    let nextLeagueId: string | null = null;

    // Get league season year and previous league id
    try {
      const leagueRes = await fetch(`https://api.sleeper.app/v1/league/${currentLeagueId}`);
      if (leagueRes.ok) {
        const leagueData: League = await leagueRes.json();
        leagueYear = leagueData.season || "";
        nextLeagueId = leagueData.previous_league_id || null;
      } else {
        break;
      }
    } catch {
      break;
    }

    // Fetch winners and losers brackets in parallel
    try {
      const [winnersRes, losersRes] = await Promise.all([
        fetch(`https://api.sleeper.app/v1/league/${currentLeagueId}/winners_bracket`),
        fetch(`https://api.sleeper.app/v1/league/${currentLeagueId}/losers_bracket`),
      ]);

      const winners = winnersRes.ok ? await winnersRes.json() : [];
      const losers = losersRes.ok ? await losersRes.json() : [];

      allBrackets[leagueYear] = { winners, losers };
    } catch {
      // Bracket data might not exist for all seasons
    }

    currentLeagueId = nextLeagueId;
  }

  return allBrackets;
}
