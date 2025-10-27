import { motion } from "motion/react";

export type FeedMode = "splits" | "movement" | "ai";

export function FeedToggle({ mode, setMode }: { mode: FeedMode; setMode: (m: FeedMode) => void }) {
  const modes: FeedMode[] = ["splits", "movement", "ai"];
  
  const getLabel = (m: FeedMode) => {
    if (m === "splits") return "Betting Splits";
    if (m === "movement") return "Line Movement";
    return "AI Analysis";
  };

  // Calculate precise indicator position for 3 modes
  const getIndicatorPosition = () => {
    const containerPadding = 4;
    const gap = 8;
    const modeIndex = modes.indexOf(mode);
    
    if (modeIndex === 0) {
      return {
        left: `${containerPadding}px`,
        width: `calc((100% - ${containerPadding * 2}px - ${gap * 2}px) / 3)`
      };
    } else if (modeIndex === 1) {
      return {
        left: `calc(${containerPadding}px + (100% - ${containerPadding * 2}px - ${gap * 2}px) / 3 + ${gap}px)`,
        width: `calc((100% - ${containerPadding * 2}px - ${gap * 2}px) / 3)`
      };
    } else {
      return {
        left: `calc(${containerPadding}px + 2 * (100% - ${containerPadding * 2}px - ${gap * 2}px) / 3 + ${gap * 2}px)`,
        width: `calc((100% - ${containerPadding * 2}px - ${gap * 2}px) / 3)`
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
