import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"; 
import { FormProvider, useForm } from "react-hook-form";  

import {
  type OwnProfileData,
  updateOwnProfileSchema
} from "../schemas/profile-schema";
import { useProfile } from "../hooks/use-profile";
import { LocationFormInput } from "./LocationFormInput";
import CustomButton from "@/shared/components/forms/SubmitButton";
import CustomFormInput from "@/shared/components/forms/CustomFormInput";
import { TagsFormManager } from "@/shared/components/forms/TagsFormInput";
import CustomTextareaInput from "@/shared/components/forms/TextareaFormInput";

interface ProfileFormProps {
  data: OwnProfileData;
};

export default function ProfileForm ({ data }: ProfileFormProps) {
  const { updateProfile } = useProfile();
  
  const methods = useForm({
    resolver: zodResolver(updateOwnProfileSchema),
    defaultValues: {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      biography: data.biography || "",
      gender: data.gender,
      interests: data.interests || [], // check if data.interests are empty?
      sex_pref: data.sex_pref,
      address: "",
      lat: null,
      lon: null
    },
    mode: "onTouched"
  });

  const onSubmit = (data: z.infer<typeof updateOwnProfileSchema>) => {
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
        { /* custom select (gender) */ }
        <TagsFormManager tags={data.interests} />
        { /* custom select (sex_prefs) */ }
        <LocationFormInput />
                
        <div className="flex items-center justify-center">
          <CustomButton type="submit" isPending={updateProfile.isPending}>
            Update
          </CustomButton>
        </div>
      </form>
    </FormProvider>
  );
};
