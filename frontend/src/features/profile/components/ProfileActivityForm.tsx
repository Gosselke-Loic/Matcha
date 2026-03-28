import { useSuspenseQueries } from "@tanstack/react-query"; 

import { profileViewersOptions, profileLikersOptions } from "../services/profile-options";

interface ProfileActivityFormProps {
  userId: number;
}

export default function ProfileActivityForm({ userId }: ProfileActivityFormProps) {
  const [likersQuery, viewersQuery] = useSuspenseQueries({
    queries: [profileLikersOptions(userId), profileViewersOptions(userId)]
  });
  
  return (
    <div className="container mx-auto p-4">
      { /* mobile version */ }

      { /* Desktop version */ }
    </div>
  );
};
