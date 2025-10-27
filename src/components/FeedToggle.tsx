import { motion } from "motion/react";

export type FeedMode = "splits" | "movement";

export function FeedToggle({ mode, setMode }: { mode: FeedMode; setMode: (m: FeedMode) => void }) {
  const modes: FeedMode[] = ["splits", "movement"];
  
  const getLabel = (m: FeedMode) => {
    if (m === "splits") return "Betting Splits";
    return "Line Movement";
  };

  // Calculate precise indicator position for perfect symmetry
  const getIndicatorPosition = () => {
    const containerPadding = 4; // px
    const gap = 8; // px between buttons
    
    // For 2 equal buttons with 1 gap between them
    // Total gap space = 8px (1 × 8px)
    // Each button gets exactly 1/2 of (100% - total padding - gap)
    // Width per section = (100% - 8px - 8px - 8px) / 2 = (100% - 24px) / 2
    
    const modeIndex = modes.indexOf(mode);
    
    if (modeIndex === 0) {
      // First button: starts at left padding
      return {
        left: `${containerPadding}px`,
        width: `calc((100% - ${containerPadding * 2}px - ${gap}px) / 2)`
      };
    } else {
      // Second button: left padding + 1 button width + 1 gap
      return {
        left: `calc(${containerPadding}px + (100% - ${containerPadding * 2}px - ${gap}px) / 2 + ${gap}px)`,
        width: `calc((100% - ${containerPadding * 2}px - ${gap}px) / 2)`
      };
    }
  };

  const indicatorPos = getIndicatorPosition();

  return (
    <div 
      className="relative inline-flex gap-[8px] px-[4px] py-[4px] rounded-[14px]"
      style={{
        background: "var(--ma-surface)",
        border: "1px solid var(--ma-stroke)"
      }}
    >
      {/* Selection indicator */}
      <motion.div
        className="absolute top-[4px] bottom-[4px] rounded-[10px]"
        initial={false}
        animate={indicatorPos}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        style={{
          background: "rgba(111, 116, 255, 0.14)",
          border: "1px solid var(--ma-accent-indigo)"
        }}
      />
      
      {modes.map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className="flex-1 font-['Inter',_sans-serif] relative z-10 rounded-[10px] transition-colors flex items-center justify-center whitespace-nowrap"
          style={{
            color: mode === m ? "var(--ma-text-primary)" : "var(--ma-text-secondary)",
            fontSize: "11px",
            fontWeight: 700,
            lineHeight: "16px",
            letterSpacing: "0em",
            textAlign: "center",
            padding: "7px 12px"
          }}
          aria-pressed={mode === m}
        >
          {getLabel(m)}
        </button>
      ))}
    </div>
  );
}
