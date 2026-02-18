import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";

import {
  ForgotPasswordSchema,
  type ForgotPasswordFormData
} from "../schemas/auth-schema";
import { useAuth } from "../hooks/use-auth";
import { CustomButton } from "@/components/forms/SubmitButton"; 
import { CustomFormInput } from "@/components/forms/CustomFormInput";

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const methods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onTouched"
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword.mutate(data.email, {
      onSuccess: () => {
        navigate({
          to: '/login',
          replace: true
        });
        methods.reset();
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Forgot password</h1>

        <CustomFormInput name="email" label="Email" type="email" placeholder="Ex: Cowboy554@gmail.com"/>

        <CustomButton type="submit" isPending={forgotPassword.isPending}>
          Send
        </CustomButton>

      </form>
    </FormProvider>
  );
};
