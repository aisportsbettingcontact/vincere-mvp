import { memo } from "react";

interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const LoadingSkeleton = memo(({ className = "", width, height }: LoadingSkeletonProps) => {
  return (
    <div
      className={`animate-pulse rounded-lg ${className}`}
      style={{
        background: "hsl(var(--muted))",
        width: width || "100%",
        height: height || "20px",
      }}
    />
  );
});

LoadingSkeleton.displayName = "LoadingSkeleton";

export function GameCardSkeleton() {
  return (
    <div 
      className="rounded-[14px] p-4 space-y-4"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))"
      }}
    >
      <div className="flex items-center justify-between">
        <LoadingSkeleton width="120px" height="24px" />
        <LoadingSkeleton width="60px" height="24px" />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <LoadingSkeleton width="40px" height="40px" className="rounded-full" />
          <LoadingSkeleton width="100px" height="20px" />
        </div>
        
        <LoadingSkeleton width="80px" height="16px" />
        
        <div className="flex items-center gap-3">
          <LoadingSkeleton width="40px" height="40px" className="rounded-full" />
          <LoadingSkeleton width="100px" height="20px" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <LoadingSkeleton height="44px" />
        <LoadingSkeleton height="44px" />
        <LoadingSkeleton height="44px" />
      </div>
    </div>
  );
}
