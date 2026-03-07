import ProfileForm from "./ProfileForm";
import type { Tags } from "@/shared/schemas/tag-schema";
import { ProfilePasswordForm } from "./ProfilePasswordForm";  
import type { OwnProfileData } from "../schemas/profile-schema";

interface ProfileBaseFormProps {
  data: OwnProfileData;
  interests: Tags;
  commonWords: Set<string> | undefined;
};

const EMPTY_SET = new Set<string>();

export function ProfileBaseForm (
  { data, interests, commonWords }: ProfileBaseFormProps
) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
      <header>
        <h1 className="text-2xl font bold tracking-tight">Your Profile</h1>
      </header>
      <div className="grid gap-8">
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Personal informations</h2>
            <p className="text-sm text-muted-foreground">Modify your informations</p> 
          </div>
          { /* add non form data information -> birthday, fameRate */ }
          <ProfileForm interests={interests} data={data} />
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
