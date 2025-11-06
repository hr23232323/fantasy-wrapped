"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PositionBadge } from "./components/PositionBadge";
import { RecordsTab } from "./components/RecordsTab";
import { TrophyRoom } from "./components/TrophyRoom";
import { ToiletBowl } from "./components/ToiletBowl";
import { TradesSlider } from "./components/TradesSlider";
import {
  fetchPlayers,
  fetchLeagueAndRosters,
  fetchAllTrades,
  fetchAllMatchups,
  fetchAllPlayoffBrackets,
  type Player,
  type LeagueUser,
  type Roster,
  type League,
  type Trade,
  type Transaction,
  type Matchup,
  type BracketMatchup,
} from "./services/dataFetching";

export interface TeamWithName extends Roster {
  teamName?: string;
  ownerName?: string;
  avatar?: string;
  is_bot?: boolean;
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlLeagueId = searchParams.get("league");
  const urlTab = searchParams.get("tab") || "overview";

  const [leagueId, setLeagueId] = useState(urlLeagueId || "");
  const [league, setLeague] = useState<League | null>(null);
  const [rosters, setRosters] = useState<TeamWithName[]>([]);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTab, setCurrentTab] = useState(urlTab);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [openRosters, setOpenRosters] = useState<Set<number>>(new Set());
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [playoffBrackets, setPlayoffBrackets] = useState<Record<string, { winners: BracketMatchup[]; losers: BracketMatchup[] }>>({});

  useEffect(() => {
    if (urlLeagueId) {
      loadLeague(urlLeagueId);
    }
  }, []);

  const loadLeague = async (id: string) => {
    setLoading(true);
    setError("");

    try {
      // Fetch league and rosters
      const { league: leagueData, rosters: rostersData, users: usersData } = await fetchLeagueAndRosters(id);
      setLeague(leagueData);

      // Enrich rosters with user data
      const userMap = new Map<string, LeagueUser>();
      const userIds = new Set<string>();
      usersData.forEach((user) => {
        userMap.set(user.user_id, user);
        userIds.add(user.user_id);
      });

      const allEnrichedRosters = rostersData
        .map((roster: Roster) => {
          const user = userMap.get(roster.owner_id);
          const isBot = !userIds.has(roster.owner_id);
          return {
            ...roster,
            teamName: user?.metadata?.team_name || `Team ${roster.roster_id}`,
            ownerName: user?.display_name || "Unknown Owner",
            avatar: user?.avatar ? `https://sleepercdn.com/avatars/${user.avatar}` : undefined,
            is_bot: isBot,
          };
        });

      // Filter out unknown owners for display, but keep all for data enrichment
      const enrichedRosters = allEnrichedRosters.filter(roster => roster.ownerName !== "Unknown Owner");

      setRosters(enrichedRosters);

      // Fetch all data in parallel
      const [playersData, tradesData, matchupsData, bracketsData] = await Promise.all([
        fetchPlayers(),
        fetchAllTrades(id),
        fetchAllMatchups(id, allEnrichedRosters),
        fetchAllPlayoffBrackets(id),
      ]);

      setPlayers(playersData);
      setTrades(tradesData);
      setMatchups(matchupsData);
      setPlayoffBrackets(bracketsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    router.push(`?league=${league?.league_id}&tab=${tab}`);
  };

  const toggleRoster = (rosterId: number) => {
    setOpenRosters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rosterId)) {
        newSet.delete(rosterId);
      } else {
        newSet.add(rosterId);
      }
      return newSet;
    });
  };

  const fetchLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leagueId.trim()) {
      setError("Please enter a league ID");
      return;
    }
    router.push(`?league=${leagueId}`);
    await loadLeague(leagueId);
  };

  const goBackToSearch = () => {
    setLeague(null);
    setRosters([]);
    setLeagueId("");
    setPlayers({});
    setTrades([]);
    router.push("/");
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "records", label: "Records" },
    { id: "trophies", label: "Trophy Room" },
    { id: "toilet", label: "Toilet Bowl" },
    { id: "trades", label: "The Trades" },
    { id: "rosters", label: "Rosters" },
  ];

  const showLeagueView = league && rosters.length > 0;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-amber-600/10 via-black to-black pointer-events-none" />

      <div className="relative z-10">
        {!showLeagueView ? (
          // Landing Page
          <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="inline-block">
                <div className="px-4 py-2 rounded-full bg-amber-600/20 border border-amber-500/30 text-sm font-medium text-amber-300">
                  Dynasty Roster Breakdown
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tighter">
                  Finally See
                  <span className="block text-amber-400">
                    Who's Cooked
                  </span>
                </h1>
                <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
                  Screenshot your league's rosters, clown your friends, find the real trades.
                </p>
              </div>

              <form onSubmit={fetchLeague} className="space-y-4 mt-12">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-amber-600 rounded-xl blur opacity-60 group-hover:opacity-80 transition duration-300" />
                  <div className="relative bg-black rounded-xl p-1">
                    <input
                      type="text"
                      placeholder="Enter your Sleeper League ID"
                      value={leagueId}
                      onChange={(e) => setLeagueId(e.target.value)}
                      className="w-full px-6 py-4 bg-zinc-900 text-white placeholder-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 text-lg shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading League...
                    </span>
                  ) : (
                    "Unlock Your League"
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mt-16 text-sm">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-zinc-300 font-semibold">Full Rosters</p>
                  <p className="text-xs text-zinc-500 mt-1">Every player, every bench spot</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-zinc-300 font-semibold">Live Scores</p>
                  <p className="text-xs text-zinc-500 mt-1">Updated every refresh</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-zinc-300 font-semibold">Spot Weaknesses</p>
                  <p className="text-xs text-zinc-500 mt-1">Find the gaps in teams</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // League Story View with Tabs
          <div className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <button
                onClick={goBackToSearch}
                className="mb-8 px-4 py-2 text-zinc-400 hover:text-white transition-colors font-medium"
              >
                ← Back to Search
              </button>

              <div className="mb-8">
                <h1 className="text-5xl font-black mb-2">{league.name}</h1>
                <p className="text-zinc-400 text-lg">Season {league.season} • {league.total_rosters} teams</p>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 mb-8 border-b border-zinc-800 overflow-x-auto pb-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                      currentTab === tab.id
                        ? "border-amber-500 text-amber-400"
                        : "border-transparent text-zinc-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {currentTab === "overview" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">League Overview</h2>
                  <p className="text-zinc-400">Coming soon - League statistics and highlights</p>
                </div>
              )}

              {currentTab === "records" && (
                <RecordsTab rosters={rosters} matchups={matchups} trades={trades} league={league} />
              )}

              {currentTab === "trophies" && (() => {
                // Extract playoff finalists from bracket data
                const finalistsByYear = new Map<string, { first?: number; second?: number; third?: number }>();

                Object.entries(playoffBrackets).forEach(([year, brackets]) => {
                  const finalists: { first?: number; second?: number; third?: number } = {};

                  if (brackets.winners && brackets.winners.length > 0) {
                    // Find finals match - where both t1_from and t2_from are winners (both advanced from winners bracket)
                    const finals = brackets.winners.find((m: BracketMatchup) => {
                      const t1From = (m as any).t1_from;
                      const t2From = (m as any).t2_from;
                      return t1From && t1From.w && t2From && t2From.w && m.w && m.l;
                    });

                    if (finals) {
                      finalists.first = finals.w; // Winner of finals
                      finalists.second = finals.l; // Loser of finals
                    }

                    // Find third place - where both t1_from and t2_from are losers (from losers bracket)
                    // If multiple, pick the one with MAX match ID (highest seed matchup like 5/6 vs 3/4)
                    const thirdPlaceCandidates = brackets.winners.filter((m: BracketMatchup) => {
                      const t1From = (m as any).t1_from;
                      const t2From = (m as any).t2_from;
                      return t1From && t1From.l && t2From && t2From.l && m.w;
                    });

                    if (thirdPlaceCandidates.length > 0) {
                      // Get the one with highest match ID
                      const thirdPlaceMatch = thirdPlaceCandidates.reduce((max, current) =>
                        current.m > max.m ? current : max
                      );
                      finalists.third = thirdPlaceMatch.w;
                    }
                  }

                  if (Object.keys(finalists).length > 0) {
                    finalistsByYear.set(year, finalists);
                  }
                });

                // Build champion list with teams
                const champions = Array.from(finalistsByYear.entries())
                  .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
                  .map(([year, finalists]) => {
                    const placements: Array<{ place: 1 | 2 | 3; team: TeamWithName | undefined }> = [];

                    if (finalists.first) {
                      const team = rosters.find(r => r.roster_id === finalists.first);
                      placements.push({ place: 1, team });
                    }
                    if (finalists.second) {
                      const team = rosters.find(r => r.roster_id === finalists.second);
                      placements.push({ place: 2, team });
                    }
                    if (finalists.third) {
                      const team = rosters.find(r => r.roster_id === finalists.third);
                      placements.push({ place: 3, team });
                    }

                    return { year, placements };
                  });

                return <TrophyRoom champions={champions} />;
              })()}

              {currentTab === "toilet" && (() => {
                // Extract toilet bowl losers from losers bracket
                const toiletBowlByYear = new Map<string, { first?: number; second?: number; third?: number }>();

                Object.entries(playoffBrackets).forEach(([year, brackets]) => {
                  const finalists: { first?: number; second?: number; third?: number } = {};

                  if (brackets.losers && brackets.losers.length > 0) {
                    // Find final match in losers bracket - where both t1_from and t2_from are losers (both advanced from losers bracket)
                    const final = brackets.losers.find((m: BracketMatchup) => {
                      const t1From = (m as any).t1_from;
                      const t2From = (m as any).t2_from;
                      return t1From && t1From.l && t2From && t2From.l && m.w && m.l;
                    });

                    if (final) {
                      finalists.first = final.l; // Loser of losers final (Most losing / worst team)
                      finalists.second = final.w; // Winner of losers final (Second worst)
                    }

                    // Find third worst - where both t1_from and t2_from are losers, pick MAX match ID (highest seed losers match like 5/6 vs 3/4)
                    const thirdWorstCandidates = brackets.losers.filter((m: BracketMatchup) => {
                      const t1From = (m as any).t1_from;
                      const t2From = (m as any).t2_from;
                      return t1From && t1From.l && t2From && t2From.l && m.w;
                    });

                    if (thirdWorstCandidates.length > 0) {
                      // Get the one with highest match ID (same as trophy logic)
                      const thirdWorstMatch = thirdWorstCandidates.reduce((max, current) =>
                        current.m > max.m ? current : max
                      );
                      finalists.third = thirdWorstMatch.l; // Loser of that match is third worst
                    }
                  }

                  if (Object.keys(finalists).length > 0) {
                    toiletBowlByYear.set(year, finalists);
                  }
                });

                // Build toilet bowl list with teams
                const toiletBowlSeasons = Array.from(toiletBowlByYear.entries())
                  .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
                  .map(([year, finalists]) => {
                    const placements: Array<{ place: 1 | 2 | 3; team: TeamWithName | undefined }> = [];

                    if (finalists.first) {
                      const team = rosters.find(r => r.roster_id === finalists.first);
                      placements.push({ place: 1, team });
                    }
                    if (finalists.second) {
                      const team = rosters.find(r => r.roster_id === finalists.second);
                      placements.push({ place: 2, team });
                    }
                    if (finalists.third) {
                      const team = rosters.find(r => r.roster_id === finalists.third);
                      placements.push({ place: 3, team });
                    }

                    return { year, placements };
                  });

                return (
                  <div className="space-y-12">
                    <div>
                      <h2 className="text-3xl font-bold text-red-400 mb-2">🚽 Toilet Bowl</h2>
                      <p className="text-zinc-400">The teams that made it to the losers bracket finals</p>
                    </div>
                    {toiletBowlSeasons.map((season) => {
                      const toiletData = {
                        year: season.year,
                        first: season.placements.find(p => p.place === 1)?.team,
                        second: season.placements.find(p => p.place === 2)?.team,
                        third: season.placements.find(p => p.place === 3)?.team,
                      };
                      return <ToiletBowl key={season.year} data={toiletData} />;
                    })}
                  </div>
                );
              })()}

              {currentTab === "trades" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">🤝 The Trades</h2>
                    <p className="text-zinc-400">Total trades: {trades.length}</p>
                  </div>
                  <TradesSlider trades={trades} rosters={rosters} players={players} />
                </div>
              )}

              {currentTab === "rosters" && (
                <div className="space-y-3 max-w-2xl mx-auto">
                  {rosters
                    .filter(r => !r.is_bot)
                    .sort((a, b) => {
                      const aWins = a.settings.wins;
                      const bWins = b.settings.wins;
                      if (aWins !== bWins) return bWins - aWins;
                      return b.settings.fpts - a.settings.fpts;
                    })
                    .map((roster, index) => {
                      const isOpen = openRosters.has(roster.roster_id);


                      const starters = roster.starters
                        .map((pid) => ({ playerId: pid, player: players[pid] }))
                        .filter((p) => p.player);

                      const bench = roster.players
                        .filter((pid) => !roster.starters.includes(pid))
                        .map((pid) => ({ playerId: pid, player: players[pid] }))
                        .filter((p) => p.player);

                      return (
                        <div key={roster.roster_id} className="bg-zinc-900/40 border border-zinc-800 rounded-lg overflow-hidden">
                          {/* Team Header - Clickable */}
                          <button
                            onClick={() => toggleRoster(roster.roster_id)}
                            className="w-full bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors px-4 py-3 flex items-center gap-3 text-left group"
                          >
                            {/* Expand Arrow */}
                            <div className="flex items-center justify-center w-5">
                              <svg
                                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>

                            {/* Rank */}
                            <div className="text-sm font-bold text-amber-400 w-4 text-center">
                              {index + 1}
                            </div>

                            {/* Avatar */}
                            {roster.avatar && (
                              <img
                                src={roster.avatar}
                                alt={roster.teamName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}

                            {/* Team Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white text-sm leading-tight">{roster.teamName}</h3>
                              <p className="text-xs text-zinc-500">{roster.ownerName}</p>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6 text-right">
                              <div>
                                <p className="text-xs text-zinc-500">W</p>
                                <p className="text-xs font-semibold text-green-400">{roster.settings.wins}</p>
                              </div>
                              <div>
                                <p className="text-xs text-zinc-500">L</p>
                                <p className="text-xs font-semibold text-red-400">{roster.settings.losses}</p>
                              </div>
                              <div>
                                <p className="text-xs text-zinc-500">PF</p>
                                <p className="text-xs font-semibold text-zinc-300">{roster.settings.fpts.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-zinc-500">PA</p>
                                <p className="text-xs font-semibold text-zinc-500">{roster.settings.fpts_against.toLocaleString()}</p>
                              </div>
                            </div>
                          </button>

                          {/* Starters - Collapsible with Animation */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen ? "max-h-96" : "max-h-0"
                            }`}
                            style={{
                              maxHeight: isOpen ? "1000px" : "0px",
                            }}
                          >
                            {starters.map(({ playerId, player }, idx) => {
                              // Get the actual roster position from league settings
                              let rosterPosition = league?.roster_positions?.[idx] || player.position;
                              let posSlot = rosterPosition;
                              let isFlexSlot = false;

                              // Convert Sleeper's FLEX/SUPERFLEX to position letters
                              if (rosterPosition === "FLEX") {
                                posSlot = "WRT"; // WR/RB/TE eligible
                                isFlexSlot = true;
                              } else if (rosterPosition === "SUPERFLEX" || rosterPosition === "SUPER_FLEX" || rosterPosition === "SUPER") {
                                posSlot = "WRTQ"; // QB/WR/RB/TE eligible
                                isFlexSlot = true;
                              }

                              return (
                                <div
                                  key={playerId}
                                  className={`px-4 py-3 flex items-center gap-4 border-b border-zinc-800/30 last:border-b-0 hover:bg-zinc-800/20 transition-colors`}
                                >
                                  {/* Position Badge */}
                                  <PositionBadge posSlot={posSlot} isFlexSlot={isFlexSlot} />


                                  {/* Player Photo */}
                                  <div
                                    className="flex-shrink-0 w-10 h-10 rounded bg-cover bg-center"
                                    style={{
                                      backgroundImage: `url(https://sleepercdn.com/content/nfl/players/thumb/${playerId}.jpg), url(https://sleepercdn.com/images/v2/icons/player_default.webp)`,
                                    }}
                                  />

                                  {/* Player Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-semibold text-white text-sm leading-tight">
                                        {player.first_name} {player.last_name}
                                      </h4>
                                      <span className="text-xs text-zinc-400">
                                        {player.position} - {player.team || "N/A"}
                                      </span>
                                      {player.injury_status && (
                                        <div className="group relative">
                                          <span className="text-xs font-bold bg-red-600 text-white px-1.5 py-0.5 rounded cursor-help">
                                            Q
                                          </span>
                                          <div className="hidden group-hover:block absolute left-0 top-full mt-1 bg-zinc-800 text-zinc-200 text-xs rounded px-2 py-1 whitespace-nowrap z-10 border border-zinc-700">
                                            {player.injury_status}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Points Display */}
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-semibold text-white">-</p>
                                    <p className="text-xs text-zinc-500">0.00</p>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Bench */}
                            {bench.length > 0 && (
                              <div className="bg-zinc-900/20 px-4 py-3 border-t border-zinc-800/50">
                                <p className="text-xs text-zinc-500 font-medium mb-2">Bench ({bench.length})</p>
                                <div className="flex flex-wrap gap-2">
                                  {bench.map(({ playerId, player }) => (
                                    <div
                                      key={playerId}
                                      className="bg-zinc-800/30 hover:bg-zinc-800/60 transition-colors rounded px-2 py-1 flex items-center gap-2 text-xs"
                                    >
                                      <div
                                        className="flex-shrink-0 w-5 h-5 rounded bg-cover bg-center"
                                        style={{
                                          backgroundImage: `url(https://sleepercdn.com/content/nfl/players/thumb/${playerId}.jpg), url(https://sleepercdn.com/images/v2/icons/player_default.webp)`,
                                        }}
                                      />
                                      <div>
                                        <p className="text-zinc-200">
                                          {player.first_name.charAt(0)}. {player.last_name}
                                        </p>
                                        <p className="text-zinc-500 text-xs">{player.position}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
