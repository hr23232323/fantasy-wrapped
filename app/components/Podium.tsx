"use client";

import type { TeamWithName } from "../page";

interface PodiumData {
  year: string;
  first?: TeamWithName;
  second?: TeamWithName;
  third?: TeamWithName;
}

interface PodiumProps {
  data: PodiumData;
}

export function Podium({ data }: PodiumProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-black text-amber-400">{data.year} Season</h3>
        <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-600 mt-2 rounded-full" />
      </div>

      {/* Podium Container */}
      <div className="bg-gradient-to-b from-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
        {/* Top Winner */}
        {data.first && (
          <div className="mb-8">
            <div className="flex items-center gap-6 bg-gradient-to-r from-yellow-500/20 to-amber-500/10 p-6 rounded-xl border border-yellow-500/30 hover:border-yellow-400/50 transition-colors">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full blur-lg opacity-40" />
                <img
                  src={data.first.avatar || ""}
                  alt={data.first.teamName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400 relative z-10"
                />
                <span className="absolute -top-1 -right-1 text-4xl">🥇</span>
              </div>

              {/* Winner Info */}
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-yellow-400 font-bold mb-1">1st Place</p>
                <h4 className="text-2xl font-black text-white mb-1">{data.first.teamName}</h4>
                <p className="text-sm text-zinc-400">{data.first.ownerName}</p>
              </div>

              {/* Trophy */}
              <div className="text-6xl">🏆</div>
            </div>
          </div>
        )}

        {/* Second and Third Place Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Second Place */}
          {data.second && (
            <div className="bg-gradient-to-br from-slate-400/20 to-slate-500/10 p-5 rounded-lg border border-slate-400/30 hover:border-slate-300/50 transition-colors">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full blur-lg opacity-30" />
                  <img
                    src={data.second.avatar || ""}
                    alt={data.second.teamName}
                    className="w-16 h-16 rounded-full object-cover border-3 border-slate-400 relative z-10"
                  />
                  <span className="absolute -top-1 -right-1 text-2xl">🥈</span>
                </div>

                {/* Info */}
                <p className="text-xs uppercase tracking-widest text-slate-300 font-bold mb-1">2nd Place</p>
                <h5 className="text-lg font-bold text-white mb-1 line-clamp-2">{data.second.teamName}</h5>
                <p className="text-xs text-zinc-400">{data.second.ownerName}</p>
              </div>
            </div>
          )}

          {/* Third Place */}
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
                  <span className="absolute -top-1 -right-1 text-2xl">🥉</span>
                </div>

                {/* Info */}
                <p className="text-xs uppercase tracking-widest text-orange-300 font-bold mb-1">3rd Place</p>
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
