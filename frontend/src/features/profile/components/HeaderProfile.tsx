import { useSuspenseQuery } from "@tanstack/react-query"; 
import { authMeOptions } from "@/features/auth/services/auth-options";

import calculateAge from "@/shared/utils/calculateAge";

export default function HeaderProfile() {  
  const { data: user, isLoading } = useSuspenseQuery(authMeOptions);

  if (isLoading) return (<></>); // To do, skeleton

  return (
    <header className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center sm:flex-row gap-6">
      <div className="relative h-24 w-24 rounded-full bg-pink-100 border-4 border-pink-50 overflow-hidden">
        <img src={user.profilePhoto} alt="Profile" className="object-cover" />
      </div>
      
      <div className="text-center sm:text-left flex-1">
        <h1 className="text-2xl font-bold text-gray-900">
          {user.username}, <span className="font-medium text-gray-600">{calculateAge(user.age)}</span>
        </h1>
        <div className="mt-1 flex items-center justify-center sm:justify-start gap-2">
          <span className="text-sm font-semibold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full">
            🔥 Fame Rate: {user.fameRate}
          </span>
        </div>
      </div>
    </header>
  );
};
