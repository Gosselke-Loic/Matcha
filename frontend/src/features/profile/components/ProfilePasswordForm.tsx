import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod"; 
import { FormProvider, useForm } from "react-hook-form";  

import {
  type ProfilePasswordFormData,
  createProfilePasswordFormSchema
} from "../schemas/password-schema";
import { useProfile } from "../hooks/use-profile";
import { commonWordsOptions } from "@/api/common-queries";
import CustomSubmitButton from "@/shared/components/forms/SubmitButton";
import CustomFormInput from "@/shared/components/forms/CustomFormInput";

export default function ProfilePasswordForm() {
  const { data, isLoading } = useQuery(commonWordsOptions);

  if (isLoading) return (<></>) // To do Skeleton

  const navigate = useNavigate();
  const commonWords = data ?? new Set<string>();
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
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Security</h2>
        <p className="text-sm text-muted-foreground">Modify your password</p> 
      </div>
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
    </>
  );
};
