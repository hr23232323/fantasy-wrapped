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

interface RankingTableProps {
  title: string;
  matchups: Matchup[];
  rosters: TeamWithName[];
  currentWeek: number;
  isBotFiltered?: boolean;
  sortAscending?: boolean;
}

export function RankingTable({
  title,
  matchups,
  rosters,
  currentWeek,
  isBotFiltered = false,
  sortAscending = false,
}: RankingTableProps) {
  const nonBotRosters = rosters.filter(r => !r.is_bot);

  const rankedMatchups = matchups
    .filter(m => {
      if (m.week >= currentWeek) return false;
      if (m.points === 0) return false;
      if (isBotFiltered && m.is_bot) return false;
      return true;
    })
    .sort((a, b) => (sortAscending ? a.points - b.points : b.points - a.points))
    .slice(0, 10);

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">{title}</h3>
      <div className="border border-zinc-700 rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 gap-3 bg-zinc-800 px-6 py-4 border-b border-zinc-700">
          <div className="col-span-2"></div>
          <div className="col-span-2 text-white font-semibold text-sm">Manager</div>
          <div className="col-span-2 text-white font-semibold text-right text-sm">Points</div>
        </div>
        {rankedMatchups.map((matchup, idx) => {
          const team = nonBotRosters.find(r => r.roster_id === matchup.roster_id);
          const year = matchup.year || "Unknown";
          return team ? (
            <div
              key={`ranking-${matchup.year}-${matchup.week}-${matchup.roster_id}`}
              className="grid grid-cols-6 gap-3 px-6 py-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors items-center"
            >
              <div className="col-span-2">
                <span className="text-white font-bold">{idx + 1}</span>
                <span className="text-gray-300 text-xs ml-2">({year} W{matchup.week})</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 min-w-0">
                {team.avatar && (
                  <img src={team.avatar} alt={team.teamName} className="w-6 h-6 rounded-full flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{team.teamName}</p>
                  <p className="text-zinc-400 text-xs truncate">{team.ownerName}</p>
                </div>
              </div>
              <div className="col-span-2 text-right">
                <div
                  className={`font-bold text-base ${
                    idx < 3 ? "text-green-400" : idx < 7 ? "text-yellow-400" : "text-zinc-300"
                  }`}
                >
                  {matchup.points.toFixed(2)}
                </div>
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
