import React from "react";
import { useViewPref } from "../hooks/useViewPref";

export default function ViewToggle() {
  const [mode, setMode] = useViewPref();

  return (
    <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1">
      {(["classic", "ive"] as const).map((m) => (
        <button
          key={m}
          onClick={() => {
            setMode(m);
            // Analytics event
            window.dispatchEvent(
              new CustomEvent("analytics", {
                detail: { event: "view_switch", view: m },
              })
            );
          }}
          aria-pressed={mode === m}
          className={`px-3 py-1.5 text-xs rounded-xl transition-all ${
            mode === m
              ? "bg-white text-black shadow"
              : "text-white/70 hover:text-white"
          }`}
        >
          {m === "classic" ? "Table" : "Clean"}
        </button>
      ))}
    </div>
  );
}
