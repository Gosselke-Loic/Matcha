import { Link } from "@tanstack/react-router"; 
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";

import { useUIStore } from "@/shared/stores/useUIStore";
import { authMeOptions } from "@/features/auth/services/auth-options"; 

export default function Navbar() {
  const openChat = useUIStore((state) => state.openChat);
  const { data: user, isLoading } = useQuery(authMeOptions);
  // useQuery for unread messages
  

  if (isLoading) return (<></>); // To do, skeleton navbar for loading
  
  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b px-4">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link to="/" className="text-xl font-black text-pink-600">MATCHA</Link>
        <div className="flex items-center gap-6">
          <button
            onClick={openChat}
            className="relative p-2 bg-slate-600 hover:bg-pink-600"
          >
            <MessageCircle size={24} />
            { /* boolean notification replace */ true && (
              <span className="absolute top-1 right-1 flex h-3 w-3 rounded-full bg-pink-500 ring-2 ring-white" />
            )}
          </button>
        </div>

        { /* Profile and dropdown */ }
      </div>
    </nav>
  );
};
