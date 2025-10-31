import { ReactNode, cloneElement, isValidElement } from "react";

interface BottomNavigationProps {
  children: ReactNode;
}

export function BottomNavigation({ children }: BottomNavigationProps) {
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 rounded-b-[44px]"
      style={{
        background: "hsl(var(--background))",
        boxShadow: "0px -2px 4px 1px rgba(0,0,0,0.08)",
        height: "79px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 20px 2px 20px",
        borderTop: "1px solid hsl(var(--border))"
      }}
    >
      {childArray.map((child, index) => {
        // If child is already a button, render as-is
        if (isValidElement(child) && child.type === 'button') {
          const existingClassName = (child.props as any).className || '';
          return cloneElement(child as React.ReactElement<any>, { 
            key: index,
            className: `hover:opacity-70 active:opacity-50 transition-opacity ${existingClassName}`
          });
        }
        
        // Otherwise wrap in button
        return (
          <button
            key={index}
            className="hover:opacity-70 active:opacity-50 transition-opacity"
          >
            {child}
          </button>
        );
      })}
    </div>
  );
}
