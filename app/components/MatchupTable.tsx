import type { TeamWithName } from "../page";

interface Matchup {
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

interface MatchupTableProps {
  title: string;
  matchups: Matchup[];
  rosters: TeamWithName[];
  currentWeek: number;
  sortAscending?: boolean;
  differentialColor?: "green" | "red";
}

export function MatchupTable({
  title,
  matchups,
  rosters,
  currentWeek,
  sortAscending = false,
  differentialColor = "green",
}: MatchupTableProps) {
  const nonBotRosters = rosters.filter(r => !r.is_bot);

  const matchupPairs = matchups
    .filter(m => m.week < currentWeek && !m.is_bot)
    .reduce((acc: any[], m) => {
      const opponent = matchups.find(
        opp => opp.week === m.week && opp.matchup_id === m.matchup_id && opp.roster_id !== m.roster_id
      );
      if (!opponent || opponent.is_bot) return acc;

      // Only process each pair once
      const pairKey = `${m.week}-${Math.min(m.roster_id, opponent.roster_id)}-${Math.max(m.roster_id, opponent.roster_id)}`;
      if (acc.some(p => p.key === pairKey)) return acc;

      const diff = Math.abs(m.points - opponent.points);

      acc.push({ m1: m, m2: opponent, diff, key: pairKey });
      return acc;
    }, [])
    .filter(p => p.diff > 0)
    .sort((a, b) => (sortAscending ? (a?.diff || 0) - (b?.diff || 0) : (b?.diff || 0) - (a?.diff || 0)))
    .slice(0, 10);

  const diffColor = differentialColor === "green" ? "text-green-400" : "text-red-400";

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="border border-zinc-700 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 bg-zinc-800 px-6 py-4 border-b border-zinc-700">
          <div className="col-span-1"></div>
          <div className="col-span-3 text-white font-semibold text-center text-xs">Winner</div>
          <div className="col-span-4 text-white font-semibold text-center text-xs">Score</div>
          <div className="col-span-3 text-white font-semibold text-center text-xs">Loser</div>
        </div>
        {matchupPairs.map((matchup, idx) => {
          const team1 = nonBotRosters.find(r => r.roster_id === matchup.m1.roster_id);
          const team2 = nonBotRosters.find(r => r.roster_id === matchup.m2.roster_id);
          const year = matchup.m1.year || "Unknown";
          const winner = matchup.m1.points > matchup.m2.points ? matchup.m1 : matchup.m2;
          const loser = matchup.m1.points < matchup.m2.points ? matchup.m1 : matchup.m2;
          const winnerTeam = matchup.m1.points > matchup.m2.points ? team1 : team2;
          const loserTeam = matchup.m1.points < matchup.m2.points ? team1 : team2;

          return team1 && team2 ? (
            <div
              key={matchup.key}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors items-center"
            >
              <div className="col-span-1 flex flex-col items-center gap-1">
                <div className="text-white font-bold text-sm">{idx + 1}</div>
                <div className="text-gray-400 text-xs">({year} W{winner.week})</div>
              </div>
              <div className="col-span-3 flex flex-col items-center gap-2 w-full">
                {winnerTeam.avatar && (
                  <img src={winnerTeam.avatar} alt={winnerTeam.teamName} className="w-7 h-7 rounded-full flex-shrink-0" />
                )}
                <p className="text-white font-semibold text-center break-words line-clamp-2 text-xs">
                  {winnerTeam.teamName}
                </p>
              </div>
              <div className="col-span-4 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-bold text-sm">{winner.points.toFixed(1)}</p>
                    <p className="text-zinc-400 text-xs">vs</p>
                    <p className="text-white font-bold text-sm">{loser.points.toFixed(1)}</p>
                  </div>
                  <p className={`text-xs ${diffColor}`}>({matchup.diff.toFixed(1)})</p>
                </div>
              </div>
              <div className="col-span-3 flex flex-col items-center gap-2 w-full">
                {loserTeam.avatar && (
                  <img src={loserTeam.avatar} alt={loserTeam.teamName} className="w-7 h-7 rounded-full flex-shrink-0" />
                )}
                <p className="text-white font-semibold text-center break-words line-clamp-2 text-xs">
                  {loserTeam.teamName}
                </p>
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
