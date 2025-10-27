import { useState, useEffect } from "react";

export type ViewMode = "classic" | "ive";

export function useViewPref(): [ViewMode, (mode: ViewMode) => void] {
  const [mode, setModeState] = useState<ViewMode>(() => {
    const stored = localStorage.getItem("viewMode");
    return (stored === "classic" || stored === "ive") ? stored : "ive";
  });

  const setMode = (newMode: ViewMode) => {
    setModeState(newMode);
    localStorage.setItem("viewMode", newMode);
  };

  return [mode, setMode];
}
