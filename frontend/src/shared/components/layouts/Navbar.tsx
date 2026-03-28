import {
  Menu,
  MenuItem,
  MenuItems,
  MenuButton,
  Transition,
  MenuSeparator
} from "@headlessui/react";
import { Fragment } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCircle, ArrowDown } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

import { useUIStore } from "@/shared/stores/useUIStore";
import { useAuth } from "@/features/auth/hooks/use-auth"; 
import { authMeOptions } from "@/features/auth/services/auth-options"; 
import { chatUnreadMessagesCountOptions } from "@/features/chat/services/chat-options";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const openChat = useUIStore((state) => state.openChat);
  const { data: user, isLoading } = useSuspenseQuery(authMeOptions);
  const { data: unreadChats } = useSuspenseQuery(chatUnreadMessagesCountOptions);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate({ to:"/login", replace: true });
      }
    })
  };

  if (isLoading) return (<></>); // To do, skeleton navbar for loading
  
  return (
    <nav className="flex items-center justify-between sticky top-0 z-50 bg-pink-50 border-b border-pink-100 px-4 h-16">
      <div className="flex items-center gap-4">
        <button
          onClick={openChat}
          className="relative p-2 rounded-full transition-colors bg-slate-600 hover:bg-pink-600"
        >
          <MessageCircle size={8} />
          { unreadChats.chatIds.length > 0 && (
            <span
              className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center
                rounded-full bg-pink-500 ring-2 ring-white"
            />
          )}
        </button>
        <Link to="/" className="text-xl font-bold tracking-tight text-pink-600 hidden sm:block">MATCHA</Link>
      </div>

      <div className="flex items-center">
        <Menu as="div" className="relative ml-3">
          <MenuButton className="flex items-center gap-3 p-1 rounded-lg hover:bg-gray-50 transition-all outline-none">
            <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.username}</span>
            <img
              className="h-9 w-8 rounded-full border border-gray-300 object-cover"
              src={`${user.profilePhoto ? user.profilePhoto : null}`} // If null change for default image in /public
              alt={`${user.username}'s profile image'`}
            />
          </MenuButton>
          <ArrowDown size={8} />
        </Menu>

        <Transition
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition duration-75 ease-in"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right divide-y
            divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
          >
            <div className="px-1 py-1">
              <MenuItem>
                {({ focus }) => (
                  <Link
                    to="/profile/$userId"
                    params={{ userId: user.id }}
                    className={`group flex w-full items-center rounded-md px-2 py-2 text-sm
                      ${focus ? 'bg-pink-500' : 'bg-gray-700'}`
                    }
                  >
                    Profile
                  </Link>
                )}
              </MenuItem>
              { /* Add here more menuItem components */ }
              
              <MenuSeparator className="my-1 h-px bg-black" />
              
              <MenuItem>
                {({ focus }) => (
                  <button onClick={handleLogout} className={`group flex w-full items-center rounder-md px-2 py-2 text-sm font-medium
                    ${focus ? 'bg-red-50 text-red-600' : 'text-red-500'}`}
                  >
                    Logout
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </div>
    </nav>
  );
};
