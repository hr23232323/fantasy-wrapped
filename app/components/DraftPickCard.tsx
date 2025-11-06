"use client";

interface DraftPick {
  round: number;
  season: string;
  league_id?: string | null;
  roster_id: number;
  owner_id: number;
  previous_owner_id?: number;
}

interface DraftPickCardProps {
  pick: DraftPick;
  compact?: boolean;
}

export function DraftPickCard({ pick, compact = false }: DraftPickCardProps) {
  if (compact) {
    return (
      <div className="bg-purple-900/30 hover:bg-purple-900/50 transition-colors rounded px-2 py-1 flex items-center gap-2 text-xs border border-purple-500/30">
        <span className="text-purple-300 font-bold">📋</span>
        <span className="text-zinc-300">
          {pick.season} Round {pick.round}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-purple-900/20 p-3 rounded-lg hover:bg-purple-900/40 transition-colors border border-purple-700/50">
      {/* Draft Pick Icon */}
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center border border-purple-600">
        <span className="text-xl">📋</span>
      </div>

      {/* Pick Info */}
      <div className="flex-1">
        <h4 className="font-bold text-white text-sm">
          {pick.season} Season - Round {pick.round}
        </h4>
        <p className="text-xs text-zinc-400 mt-1">
          Roster #{pick.roster_id}
          {pick.previous_owner_id && pick.previous_owner_id !== pick.owner_id && (
            <span className="text-purple-300"> (Traded)</span>
          )}
        </p>
      </div>
    </div>
  );
}
