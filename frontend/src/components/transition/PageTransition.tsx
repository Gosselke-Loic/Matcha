import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
};

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="animate-in fade-in duration-500 w-ful h-full">
      { children }
    </div>
  );
};
