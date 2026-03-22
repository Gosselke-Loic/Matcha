import ProfileForm from "./ProfileForm";
import calculateAge from "@/shared/utils/calculateAge";
import type { Tags } from "@/shared/schemas/tag-schema";
import { ProfilePasswordForm } from "./ProfilePasswordForm";  
import type { OwnProfileData } from "../schemas/profile-schema";
import type { ImagesProfileData } from "../schemas/images-schema";
import { ProfileImageForm } from "./ProfileImagesForm";

interface ProfileBaseFormProps {
  data: OwnProfileData;
  dataImages: ImagesProfileData;
  interests: Tags;
  commonWords: Set<string> | undefined;
};

const EMPTY_SET = new Set<string>();

export default function ProfileBaseForm (
  { data, dataImages, interests, commonWords }: ProfileBaseFormProps
) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
      <header>
        <h1 className="text-2xl font bold tracking-tight">Your Profile</h1>
      </header>
    
      <div className="grid gap-4">
        <section className="rounded-xl bg-card px-4 shadow-sm">
          <div className="mb-2">
            <h2 className="text-lg font-semibold">Personal informations</h2>
          </div>

          <div className="flex flex-col gap-4 ps-2 border-b border-gray-100">
            <div>
              <label className="font-medium text-gray-500">Age</label>
              <span className="text-gray-900 font-medium">
                {calculateAge(data.birthdayDate)} years old
              </span>
            </div>

            <div>
              <label className="font-medium text-gray-500">Fame rate</label>
              <span className="text-gray-900 font-medium">{data.fameRate}</span>
            </div>
          </div>

          <ProfileForm interests={interests} data={data} />
        </section>

        <section>
          <ProfileImageForm dataImages={dataImages} userId={data.id} />
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Security</h2>
            <p className="text-sm text-muted-foreground">Modify your password</p> 
          </div>
          <ProfilePasswordForm commonWords={commonWords ?? EMPTY_SET} />
        </section>
      </div>
    </div>
  );
};
