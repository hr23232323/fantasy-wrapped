interface PositionBadgeProps {
  posSlot: string;
  isFlexSlot: boolean;
}

export function PositionBadge({ posSlot, isFlexSlot }: PositionBadgeProps) {
  // Exact color hex palette
  const positionColorStyles: Record<string, { bg: string; text: string }> = {
    QB: { bg: "#ef74a1", text: "#000000" },
    RB: { bg: "#8ef2c9", text: "#000000" },
    WR: { bg: "#57c8f8", text: "#000000" },
    TE: { bg: "#feae58", text: "#000000" },
    K: { bg: "#57c8f8", text: "#000000" },
    DEF: { bg: "#57c8f8", text: "#000000" },
  };

  const getDisplayText = () => {
    if (posSlot === "WRT" || posSlot === "WRTQ") {
      return posSlot;
    }
    return posSlot.substring(0, 2).toUpperCase();
  };

  const getColorStyle = (position: string) => {
    return positionColorStyles[position] || { bg: "#e5e5e5", text: "#4a4a4a" };
  };

  // WRTQ Quadrant Badge (SUPERFLEX)
  if (posSlot === "WRTQ" || posSlot === "SUPERFLEX" || posSlot === "SUPER_FLEX" || posSlot === "SUPER") {
    return (
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
        {/* Quadrants: RB (#8ef2c9), WR (#57c8f8), TE (#feae58), QB (#ef74a1) */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 w-full h-full">
          <div style={{ backgroundColor: "#8ef2c9" }} /> {/* RB - top left */}
          <div style={{ backgroundColor: "#57c8f8" }} /> {/* WR - top right */}
          <div style={{ backgroundColor: "#feae58" }} /> {/* TE - bottom left */}
          <div style={{ backgroundColor: "#ef74a1" }} /> {/* QB - bottom right */}
        </div>
        <span className="relative font-black text-xs z-10" style={{ color: "#000000" }}>WRTQ</span>
      </div>
    );
  }

  // WRT Horizontal Split Badge - solid thirds
  if (posSlot === "WRT") {
    return (
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
        <div className="absolute inset-0 flex w-full h-full">
          <div className="flex-1" style={{ backgroundColor: "#8ef2c9" }} /> {/* RB - left third */}
          <div className="flex-1" style={{ backgroundColor: "#57c8f8" }} /> {/* WR - middle third */}
          <div className="flex-1" style={{ backgroundColor: "#feae58" }} /> {/* TE - right third */}
        </div>
        <span className="relative font-black text-xs z-10" style={{ color: "#000000" }}>WRT</span>
      </div>
    );
  }

  // Single position badge
  const colors = getColorStyle(posSlot);
  return (
    <div
      className="font-black rounded-lg w-12 h-12 flex items-center justify-center text-xs flex-shrink-0"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {getDisplayText()}
    </div>
  );
}
