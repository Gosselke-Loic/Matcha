import { useState, useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export default function GlobalSpinner() {
  const [isVisible, setIsVisible] = useState(false);
  const isLoading = useRouterState({ select: (state) => state.status === 'pending' });

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500);
      return (() => clearTimeout(timer));
    };
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-9999 h-0.5 pointer-events-none">
      <div className={`h-full bg-blue-500 shadow-[0_0_10px_#3b82f6] transition-all duration-700 ease-out
        ${isLoading ? 'w-[70%] opacity-100' : 'w-full opacity-0'}`}
      />
      <div
        className={`absolute top-0 h-full w-24 bg-linear-to-r from-transparent via-blue-400 to-transparent
          transition-all duration-700 ease-out
          ${ isLoading ? 'left-[calc(70%-96px)]' : 'left-[calc(100%-96px)] opacity-0' }`}
      />
    </div>
  );
};
