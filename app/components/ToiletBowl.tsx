"use client";

import type { TeamWithName } from "../page";

interface ToiletBowlData {
  year: string;
  first?: TeamWithName;  // Last place (winner of losers bracket)
  second?: TeamWithName; // Second to last
  third?: TeamWithName;  // Third to last
}

interface ToiletBowlProps {
  data: ToiletBowlData;
}

export function ToiletBowl({ data }: ToiletBowlProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-black text-red-400">{data.year} Season</h3>
        <div className="h-1 w-16 bg-gradient-to-r from-red-400 to-red-600 mt-2 rounded-full" />
      </div>

      {/* Toilet Bowl Container */}
      <div className="bg-gradient-to-b from-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
        {/* Last Place (Most "Cooked") */}
        {data.first && (
          <div className="mb-8">
            <div className="flex items-center gap-6 bg-gradient-to-r from-red-500/20 to-red-600/10 p-6 rounded-xl border border-red-500/30 hover:border-red-400/50 transition-colors">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-full blur-lg opacity-40" />
                <img
                  src={data.first.avatar || ""}
                  alt={data.first.teamName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-red-400 relative z-10"
                />
                <span className="absolute -top-1 -right-1 text-4xl">🚽</span>
              </div>

              {/* Last Place Info */}
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-red-400 font-bold mb-1">Last Place</p>
                <h4 className="text-2xl font-black text-white mb-1">{data.first.teamName}</h4>
                <p className="text-sm text-zinc-400">{data.first.ownerName}</p>
              </div>

              {/* Poop emoji */}
              <div className="text-6xl">💩</div>
            </div>
          </div>
        )}

        {/* Second to Last and Third to Last Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Second to Last */}
          {data.second && (
            <div className="bg-gradient-to-br from-red-400/20 to-red-500/10 p-5 rounded-lg border border-red-400/30 hover:border-red-300/50 transition-colors">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-300 to-red-500 rounded-full blur-lg opacity-30" />
                  <img
                    src={data.second.avatar || ""}
                    alt={data.second.teamName}
                    className="w-16 h-16 rounded-full object-cover border-3 border-red-400 relative z-10"
                  />
                  <span className="absolute -top-1 -right-1 text-2xl">📉</span>
                </div>

                {/* Info */}
                <p className="text-xs uppercase tracking-widest text-red-300 font-bold mb-1">Second to Last</p>
                <h5 className="text-lg font-bold text-white mb-1 line-clamp-2">{data.second.teamName}</h5>
                <p className="text-xs text-zinc-400">{data.second.ownerName}</p>
              </div>
            </div>
          )}

          {/* Third to Last */}
          {data.third && (
            <div className="bg-gradient-to-br from-orange-400/20 to-orange-500/10 p-5 rounded-lg border border-orange-400/30 hover:border-orange-300/50 transition-colors">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full blur-lg opacity-30" />
                  <img
                    src={data.third.avatar || ""}
                    alt={data.third.teamName}
                    className="w-16 h-16 rounded-full object-cover border-3 border-orange-400 relative z-10"
                  />
                  <span className="absolute -top-1 -right-1 text-2xl">⚠️</span>
                </div>

                {/* Info */}
                <p className="text-xs uppercase tracking-widest text-orange-300 font-bold mb-1">Third to Last</p>
                <h5 className="text-lg font-bold text-white mb-1 line-clamp-2">{data.third.teamName}</h5>
                <p className="text-xs text-zinc-400">{data.third.ownerName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
