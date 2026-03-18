import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod"; 
import { FormProvider, useForm } from "react-hook-form";  

import {
  type ProfilePasswordFormData,
  createProfilePasswordFormSchema
} from "../schemas/password-schema";
import { useProfile } from "../hooks/use-profile";
import CustomSubmitButton from "@/shared/components/forms/SubmitButton";
import CustomFormInput from "@/shared/components/forms/CustomFormInput";

interface ProfilePasswordFormProps {
  commonWords: Set<string>;
};

export function ProfilePasswordForm({ commonWords }: ProfilePasswordFormProps) {
  const navigate = useNavigate();
  const { updatePasswordProfile } = useProfile();

  const schema = useMemo(
    () => createProfilePasswordFormSchema(commonWords), [commonWords]
  );
  
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {      
      oldPassword: "",
      password: "",
      confirmPassword: ""
    },
    mode: "onTouched"
  });

  const onSubmit = (data: ProfilePasswordFormData) => {
    updatePasswordProfile.mutate(data, {
      onSuccess: () => {
        navigate({ to: "/login", replace: true });
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
        
        <CustomFormInput name="oldPassword" label="Your old password" type="password" />
        <CustomFormInput name="password" label="Password" type="password" />
        <CustomFormInput name="confirmPassword" label="Confirm password" type="password" />
        
        <div className="flex items-center justify-center">
          <CustomSubmitButton type="submit" isPending={updatePasswordProfile.isPending}>
            Update password
          </CustomSubmitButton>
        </div>
      </form>
    </FormProvider>
  );
};
