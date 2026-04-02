import { useNavigate } from "@tanstack/react-router";

import { socket } from "@/shared/libs/socket"; 
import type { ActivityUserListData } from "../schemas/activity-schema";

interface ProfileActivityUserListProps {
  users: ActivityUserListData;
  emptyMessage: string;
};

export default function ProfileActivityUserList(
  { users, emptyMessage }: ProfileActivityUserListProps
) {
  const navigate = useNavigate();
  
  if (users.length === 0) {
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
      <p className="text-sm">{emptyMessage}</p>
    </div>
  };

  const handleOnClick = (profileId: number) => {
    socket.emit("viewed_profile", { profileId: profileId });    
    navigate({ to:"/profile/$userId", params: { userId: profileId } });
  };

  return (
    <ul className="divide-y divide-gray-100 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {users.map((user) => (
        <li
          key={`${user.username}-${user.id}`}
          onClick={() => handleOnClick(user.id)}
          className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
        >
          <div className="h-12 w-12 flex-none rounded-full bg-gray-100 overflow-hidden border border-gray-200">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={`${user.username}'s profile photo'`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-auto min-w-0">
            <p className="text-sm font-semibold leading-6 text-gray-900 truncate">
              {user.username}
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Fame rate: {user.fameRate}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};
