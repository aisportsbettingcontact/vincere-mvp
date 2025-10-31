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
  const leftColor = market === "Total" ? "hsl(var(--accent-indigo))" : awayColor;
  const rightColor = market === "Total" ? "hsl(var(--accent-cyan))" : homeColor;
  
  return (
    <div>
      <div 
        className="flex items-center justify-between mb-1 text-xs font-['Inter',_sans-serif]"
        style={{ color: "var(--ma-text-secondary)" }}
      >
        <span>{label}</span>
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
      
      {/* Percentage Labels aligned with teams */}
      <div className="flex items-center justify-between mt-1">
        <span 
          className="font-['Inter',_sans-serif] text-sm font-semibold"
          style={{ color: "var(--ma-text-primary)" }}
        >
          {leftPercent}%
        </span>
        <span 
          className="font-['Inter',_sans-serif] text-sm font-semibold"
          style={{ color: "var(--ma-text-primary)" }}
        >
          {rightPercent}%
        </span>
      </div>
    </div>
  );
}
