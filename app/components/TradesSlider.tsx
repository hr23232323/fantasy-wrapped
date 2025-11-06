"use client";

import { useState } from "react";
import type { Trade } from "../services/dataFetching";
import type { TeamWithName } from "../page";
import { TradeCard } from "./TradeCard";

interface TradesSliderProps {
  trades: Trade[];
  rosters: TeamWithName[];
  players: Record<string, any>;
}

export function TradesSlider({ trades, rosters, players }: TradesSliderProps) {
  // Get the 10 most recent completed trades
  const recentTrades = trades
    .filter(t => t.status === "complete")
    .sort((a, b) => b.created - a.created)
    .slice(0, 10);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (recentTrades.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No completed trades yet</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? recentTrades.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === recentTrades.length - 1 ? 0 : prev + 1));
  };

  const currentTrade = recentTrades[currentIndex];

  return (
    <div className="space-y-6">
      {/* Slider Counter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Recent Trades</h2>
        <p className="text-sm text-zinc-400">
          {currentIndex + 1} / {recentTrades.length}
        </p>
      </div>

      {/* Trade Card */}
      <div className="min-h-96">
        <TradeCard trade={currentTrade} rosters={rosters} players={players} />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goToPrevious}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          aria-label="Previous trade"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {recentTrades.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? "bg-purple-500 w-6" : "bg-zinc-600 w-2"
              }`}
              aria-label={`Go to trade ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          aria-label="Next trade"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
