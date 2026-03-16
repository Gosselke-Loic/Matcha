import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import {
  type OwnProfileData,
  updateOwnProfileSchema,
  type UpdateOwnProfileData
} from "../schemas/profile-schema";
import { useProfile } from "../hooks/use-profile";
import { LocationFormInput } from "./LocationFormInput";
import type { Tags } from "@/shared/schemas/tag-schema"; 
import { genderEnum } from "@/shared/schemas/gender-schema";
import { sexPrefsEnum } from "@/shared/schemas/sex_prefs-schema";
import CustomSubmitButton from "@/shared/components/forms/SubmitButton";
import CustomFormInput from "@/shared/components/forms/CustomFormInput";
import SelectFormInput from "@/shared/components/forms/SelectFormInput";
import { TagsFormManager } from "@/shared/components/forms/TagsFormInput";
import CustomTextareaInput from "@/shared/components/forms/TextareaFormInput";

interface ProfileFormProps {
  interests: Tags;
  data: OwnProfileData;
};

export default function ProfileForm ({ data, interests }: ProfileFormProps) {
  const { updateProfile } = useProfile();

  const gender = genderEnum.safeParse(data.gender);
  const sexPref = sexPrefsEnum.safeParse(data.sex_pref);
  
  const methods = useForm({
    resolver: zodResolver(updateOwnProfileSchema),
    defaultValues: {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      biography: data.biography || "",
      gender: gender.success ? gender.data : "non-binary",
      interests: data.interests || [],
      sex_pref: sexPref.success ? sexPref.data : "bisexual",
      address: data.address || "",
      lat: data.lat || null,
      lon: data.lon || null,
      city: data.city
    },
    mode: "onTouched"
  });

  const onSubmit = (data: UpdateOwnProfileData) => {
    updateProfile.mutate(data, {
      // can add custom handle onSuccess or onError
    });
  };

  return (    
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">

        <CustomFormInput name="username" label="Username" placeholder="Ex: Cowboy554"/>
        <CustomFormInput name="email" label="Email" type="email" placeholder="Ex: cowboy554@gmail.com" />

        <div className="grid grid-cols-2 gap-4">
          <CustomFormInput name="firstName" label="First name" />
          <CustomFormInput name="lastName" label="Last name" />
        </div>

        <CustomTextareaInput
          label="Biography"
          name="biography"
          maxLengthNumber={500}
          maxLength={500}
        />

        <SelectFormInput enumSchema={genderEnum} name="gender" label="Gender" />

        <TagsFormManager tags={interests} />

        <SelectFormInput enumSchema={sexPrefsEnum} name="sex_pref" label="Sexual preference" />

        <LocationFormInput />
                
        <div className="flex items-center justify-center">
          <CustomSubmitButton type="submit" isPending={updateProfile.isPending}>
            Update
          </CustomSubmitButton>
        </div>
      </form>
    </FormProvider>
  );
};
