import type { Market } from "@/utils/bettingLogic";

interface MirrorBarProps {
  label: string;
  leftPercent: number;
  rightPercent: number;
  market: Market | string;
  awayColor: string;
  homeColor: string;
}

export function MirrorBar({ label, leftPercent, rightPercent, market, awayColor, homeColor }: MirrorBarProps) {
  const leftColor = market === "Total" ? "#6F74FF" : awayColor;
  const rightColor = market === "Total" ? "#06B6D4" : homeColor;
  
  return (
    <div>
      <div 
        className="flex items-center justify-between mb-1 text-xs font-['Inter',_sans-serif]"
        style={{ color: "var(--ma-text-secondary)" }}
      >
        <span>{label}</span>
        <div className="flex gap-2">
          <span>{leftPercent}%</span>
          <span>{rightPercent}%</span>
        </div>
      </div>
      <div className="flex gap-1 h-2">
        <div 
          className="rounded-l"
          style={{
            width: `${leftPercent}%`,
            background: leftColor
          }}
        />
        <div 
          className="rounded-r"
          style={{
            width: `${rightPercent}%`,
            background: rightColor
          }}
        />
      </div>
    </div>
  );
}
