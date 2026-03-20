import { Link } from "@tanstack/react-router"; 
import { useQuery } from "@tanstack/react-query";

import { authMeOptions } from "@/features/auth/services/auth-options"; 

export default function Navbar() {
  const { data: user, isLoading } = useQuery(authMeOptions);

  if (isLoading) return (<></>); // To do, skeleton navbar for loading
  
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      
    </nav>
  );
};
