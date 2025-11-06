"use client";

import type { Player } from "../services/dataFetching";
import { PositionBadge } from "./PositionBadge";

interface PlayerCardProps {
  player: Player;
  compact?: boolean;
  hidePosition?: boolean;
}

export function PlayerCard({ player, compact = false, hidePosition = false }: PlayerCardProps) {
  if (compact) {
    return (
      <div className="bg-zinc-800/30 hover:bg-zinc-800/60 transition-colors rounded px-2 py-1 flex items-center gap-2 text-xs">
        <div
          className="flex-shrink-0 w-5 h-5 rounded bg-cover bg-center"
          style={{
            backgroundImage: `url(https://sleepercdn.com/content/nfl/players/thumb/${player.player_id}.jpg), url(https://sleepercdn.com/images/v2/icons/player_default.webp)`,
          }}
        />
        <span className="text-zinc-300">
          {player.first_name} {player.last_name}
        </span>
        <span className="text-zinc-500">{player.position}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-zinc-800/20 p-3 rounded-lg hover:bg-zinc-800/40 transition-colors border border-zinc-700/50">
      {/* Position Badge */}
      {!hidePosition && (
        <PositionBadge posSlot={player.position} isFlexSlot={false} />
      )}

      {/* Player Photo */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded bg-cover bg-center border border-zinc-600"
        style={{
          backgroundImage: `url(https://sleepercdn.com/content/nfl/players/thumb/${player.player_id}.jpg), url(https://sleepercdn.com/images/v2/icons/player_default.webp)`,
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
    </div>
  );
}
