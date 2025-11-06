"use client";

import type { TeamWithName } from "../page";
import { RankingTable } from "./RankingTable";
import { MatchupTable } from "./MatchupTable";

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

interface Trade {
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

interface RecordsTabProps {
  rosters: TeamWithName[];
  matchups: Matchup[];
  trades: Trade[];
  league: any;
}

export function RecordsTab({ rosters, matchups, trades, league }: RecordsTabProps) {
  const currentWeek = league?.season === new Date().getFullYear().toString() ? 10 : 18;

  return (
    <div className="space-y-12 max-w-5xl">
      <h2 className="text-3xl font-bold">League Records</h2>

      {/* SECTION 1 & 2: Top 10 and Bottom 10 Side by Side */}
      {matchups.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RankingTable
            title="🔥 Top 10 Scoring"
            matchups={matchups}
            rosters={rosters}
            currentWeek={currentWeek}
            sortAscending={false}
          />
          <RankingTable
            title="❄️ Bottom 10 Scoring"
            matchups={matchups}
            rosters={rosters}
            currentWeek={currentWeek}
            isBotFiltered={true}
            sortAscending={true}
          />
        </div>
      )}

      {/* SECTION 3: Top Traders */}
      {trades.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">📊 Top Traders by Trades Initiated</h3>
          <div className="border border-zinc-700 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-3 bg-zinc-800 px-6 py-4 border-b border-zinc-700">
              <div className="col-span-1 text-white font-semibold text-sm">#</div>
              <div className="col-span-5 text-white font-semibold text-sm">Manager</div>
              <div className="col-span-4 text-white font-semibold text-sm">Common Partners</div>
              <div className="col-span-2 text-white font-semibold text-right text-sm">Trades</div>
            </div>
            {(() => {
              // Build a map from roster_id to owner_id
              const rosterIdToOwnerId = new Map<number, string>();
              rosters.forEach(r => {
                rosterIdToOwnerId.set(r.roster_id, r.owner_id);
              });

              const traderMap: Record<string, { owner_id: string; trades: Trade[]; count: number }> = {};

              // Count trades for both creators and consenters
              trades.forEach((trade) => {
                // Count creator
                if (!traderMap[trade.creator]) {
                  traderMap[trade.creator] = { owner_id: trade.creator, trades: [], count: 0 };
                }
                traderMap[trade.creator].trades.push(trade);
                traderMap[trade.creator].count += 1;

                // Count consenters (convert roster_ids to owner_ids)
                (trade.roster_ids || []).forEach((rosterId) => {
                  const owner_id = rosterIdToOwnerId.get(rosterId);
                  if (owner_id && owner_id !== trade.creator) {
                    if (!traderMap[owner_id]) {
                      traderMap[owner_id] = { owner_id, trades: [], count: 0 };
                    }
                    traderMap[owner_id].trades.push(trade);
                    traderMap[owner_id].count += 1;
                  }
                });
              });

              return Object.entries(traderMap)
                .map(([owner_id, data]) => {
                  // Count trading partners (both creators and consenters)
                  const partnerCounts: Record<string, number> = {};

                  data.trades.forEach((trade: Trade) => {
                    // Get all roster_ids involved
                    const allRosterIds = trade.roster_ids || [];
                    allRosterIds.forEach((rosterId) => {
                      const partnerOwnerId = rosterIdToOwnerId.get(rosterId);
                      if (partnerOwnerId && partnerOwnerId !== owner_id) {
                        partnerCounts[partnerOwnerId] = (partnerCounts[partnerOwnerId] || 0) + 1;
                      }
                    });
                  });

                  const topPartners = Object.entries(partnerCounts)
                    .sort(([, aCount], [, bCount]) => bCount - aCount)
                    .slice(0, 3)
                    .map(([partnerId]) => rosters.find(r => r.owner_id === partnerId))
                    .filter(Boolean);

                  return { owner_id, count: data.count, topPartners };
                })
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map((tradeData, idx) => {
                  const team = rosters.find(r => r.owner_id === tradeData.owner_id);

                  return team ? (
                    <div
                      key={tradeData.owner_id}
                      className="grid grid-cols-12 gap-3 px-6 py-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors items-center"
                    >
                      <div className="col-span-1 text-white font-bold">{idx + 1}</div>
                      <div className="col-span-5 flex items-center gap-3">
                        {team.avatar && (
                          <img src={team.avatar} alt={team.teamName} className="w-8 h-8 rounded-full flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-white font-semibold truncate">{team.teamName}</p>
                          <p className="text-zinc-400 text-xs truncate">{team.ownerName}</p>
                        </div>
                      </div>
                      <div className="col-span-4">
                        {tradeData.topPartners.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {tradeData.topPartners.map((partner, pidx) => (
                              <span key={`${idx}-${pidx}`} className="text-xs bg-zinc-700 text-zinc-200 px-2 py-1 rounded truncate">
                                {partner?.teamName}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-500">—</span>
                        )}
                      </div>
                      <div className="col-span-2 text-white font-bold text-right text-lg">{tradeData.count}</div>
                    </div>
                  ) : null;
                });
            })()}
          </div>
        </div>
      )}

      {/* SECTION 4 & 5: Most and Closest Point Differential Side by Side */}
      {matchups.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MatchupTable
            title="💥 Most Point Differential"
            matchups={matchups}
            rosters={rosters}
            currentWeek={currentWeek}
            sortAscending={false}
            differentialColor="green"
          />
          <MatchupTable
            title="🤏 Closest Matchups"
            matchups={matchups}
            rosters={rosters}
            currentWeek={currentWeek}
            sortAscending={true}
            differentialColor="red"
          />
        </div>
      )}
    </div>
  );
}
