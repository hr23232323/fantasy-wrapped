"use client";

import type { Trade } from "../services/dataFetching";
import type { TeamWithName } from "../page";
import { PlayerCard } from "./PlayerCard";
import { DraftPickCard } from "./DraftPickCard";

interface TradeCardProps {
  trade: Trade;
  rosters: TeamWithName[];
  players: Record<string, any>;
}

export function TradeCard({ trade, rosters, players }: TradeCardProps) {
  // Trade structure:
  // adds: { playerId: rosterIdThatReceivedIt, ... }
  // drops: { playerId: rosterIdThatDroppedIt, ... }
  // roster_ids: [roster1, roster2]

  const rosterIds = (trade as any).roster_ids || [];
  if (rosterIds.length < 2) {
    return null;
  }

  const creatorRosterId = rosterIds[0];
  const consenterRosterId = rosterIds[1];

  const creatorTeam = rosters.find(r => r.roster_id === creatorRosterId);
  const consenterTeam = rosters.find(r => r.roster_id === consenterRosterId);

  if (!creatorTeam || !consenterTeam) {
    return null;
  }

  // Get what each team received (which means the other team dropped it)
  const creatorReceivedPlayerIds = Object.entries((trade.adds as any) || {})
    .filter(([_, rId]: [string, any]) => rId === creatorRosterId)
    .map(([playerId]) => playerId);

  const consenterReceivedPlayerIds = Object.entries((trade.adds as any) || {})
    .filter(([_, rId]: [string, any]) => rId === consenterRosterId)
    .map(([playerId]) => playerId);

  const creatorReceivedPlayers = creatorReceivedPlayerIds.map((pid: string) => players[pid]).filter(Boolean);
  const consenterReceivedPlayers = consenterReceivedPlayerIds.map((pid: string) => players[pid]).filter(Boolean);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {creatorTeam.avatar && (
            <img
              src={creatorTeam.avatar}
              alt={creatorTeam.teamName}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-bold text-white text-sm">{creatorTeam.teamName}</p>
            <p className="text-xs text-zinc-400">{creatorTeam.ownerName}</p>
          </div>
        </div>

        <div className="text-center px-4 py-2 bg-purple-500/20 rounded-full">
          <p className="text-xs font-bold text-purple-300">TRADE</p>
          <p className="text-xs text-zinc-400">{formatDate(trade.created)}</p>
        </div>

        <div className="flex items-center gap-3">
          {consenterTeam.avatar && (
            <img
              src={consenterTeam.avatar}
              alt={consenterTeam.teamName}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div className="text-right">
            <p className="font-bold text-white text-sm">{consenterTeam.teamName}</p>
            <p className="text-xs text-zinc-400">{consenterTeam.ownerName}</p>
          </div>
        </div>
      </div>

      {/* Trade Details */}
      <div className="grid grid-cols-2 gap-4">
        {/* Creator Side */}
        <div className="border-r border-zinc-700/50 pr-4 space-y-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-green-400 font-bold mb-2">Received</p>
            <div className="space-y-2">
              {creatorReceivedPlayers.length > 0 ? (
                creatorReceivedPlayers.map((player, idx) => (
                  <PlayerCard key={idx} player={player} />
                ))
              ) : (
                <p className="text-xs text-zinc-500">No players</p>
              )}
            </div>
          </div>

          {/* Creator Draft Picks */}
          {(trade as any).draft_picks && (trade as any).draft_picks.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-2">Draft Picks</p>
              <div className="space-y-2">
                {(trade as any).draft_picks
                  .filter((pick: any) => pick.owner_id === creatorRosterId)
                  .map((pick: any, idx: number) => (
                    <DraftPickCard key={idx} pick={pick} />
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Consenter Side */}
        <div className="pl-4 space-y-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-green-400 font-bold mb-2">Received</p>
            <div className="space-y-2">
              {consenterReceivedPlayers.length > 0 ? (
                consenterReceivedPlayers.map((player, idx) => (
                  <PlayerCard key={idx} player={player} />
                ))
              ) : (
                <p className="text-xs text-zinc-500">No players</p>
              )}
            </div>
          </div>

          {/* Consenter Draft Picks */}
          {(trade as any).draft_picks && (trade as any).draft_picks.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-2">Draft Picks</p>
              <div className="space-y-2">
                {(trade as any).draft_picks
                  .filter((pick: any) => pick.owner_id === consenterRosterId)
                  .map((pick: any, idx: number) => (
                    <DraftPickCard key={idx} pick={pick} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-4 pt-4 border-t border-zinc-700/50">
        <span
          className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
            trade.status === "complete"
              ? "bg-green-500/20 text-green-300"
              : trade.status === "pending"
              ? "bg-yellow-500/20 text-yellow-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
        </span>
      </div>
    </div>
  );
}
