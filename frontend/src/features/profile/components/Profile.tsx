import type { ProfileData } from "../schemas/profile-schema";
import type { ImagesProfileData } from "../schemas/images-schema";

interface ProfileProps {
  data: ProfileData;
  images: ImagesProfileData;
};

export const Profile = ({ data, images }: ProfileProps) => {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
      <header>
        <h1 className="text-2xl font bold tracking-tight">{data.username} Profile's</h1>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      
      </div>
    </div>
  ); 
};
