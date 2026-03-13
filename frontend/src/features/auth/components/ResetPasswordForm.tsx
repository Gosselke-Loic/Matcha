import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod"; 
import { useForm, FormProvider } from "react-hook-form";

import {
  createResetPasswordSchema,
  type ResetPasswordFormData
} from "../schemas/auth-schema";
import { useAuth } from "../hooks/use-auth"; 
import { useNavigate } from "@tanstack/react-router";
import CustomSubmitButton from "@/shared/components/forms/SubmitButton";
import CustomFormInput from "@/shared/components/forms/CustomFormInput";

interface ResetPasswordFormProps {
  token: string;
  commonWords: Set<string>;
};

export const ResetPasswordForm = ({ token, commonWords }: ResetPasswordFormProps) => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const schema = useMemo(() => createResetPasswordSchema(commonWords), [commonWords]);
  
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
    mode: "onTouched"
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword.mutate({ token: token, ...data }, {
      onSuccess: () => {
        navigate({ to: "/login" });
        methods.reset();
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Reset Password</h1>

        <CustomFormInput name="password" label="Password" type="password" />
        <CustomFormInput name="confirmPassword" label="Confirm password" type="password" />

        <div className="flex items-center justify-center">
          <CustomSubmitButton type="submit" isPending={resetPassword.isPending}>
            Send
          </CustomSubmitButton>
        </div>

      </form>
    </FormProvider>
  );
};
