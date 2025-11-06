"use client";

import type { TeamWithName } from "../page";
import { Podium } from "./Podium";

interface ChampionshipYear {
  year: string;
  placements: Array<{ place: 1 | 2 | 3; team: TeamWithName | undefined }>;
}

interface TrophyRoomProps {
  champions: ChampionshipYear[];
}

export function TrophyRoom({ champions }: TrophyRoomProps) {
  if (!champions || champions.length === 0) {
    return (
      <div className="space-y-4 max-w-5xl">
        <h2 className="text-3xl font-bold">Trophy Room</h2>
        <div className="text-center py-12 text-zinc-400">
          No championship data available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <h2 className="text-3xl font-bold">🏆 Trophy Room</h2>

      <div className="space-y-12">
        {champions.map((season) => {
          const podiumData = {
            year: season.year,
            first: season.placements.find(p => p.place === 1)?.team,
            second: season.placements.find(p => p.place === 2)?.team,
            third: season.placements.find(p => p.place === 3)?.team,
          };

          return <Podium key={season.year} data={podiumData} />;
        })}
      </div>
    </div>
  );
}
