import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";

import { useAuth } from "../hooks/use-auth";
import CustomButton from "@/shared/components/forms/SubmitButton";
import CustomFormInput from "@/shared/components/forms/CustomFormInput";
import { forgotPasswordSchema, type ForgotPasswordData } from "../schemas/auth-schema";

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const methods = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onTouched"
  });

  const onSubmit = (data: ForgotPasswordData) => {
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

        <div className="flex items-center justify-center">
          <CustomButton type="submit" isPending={forgotPassword.isPending}>
            Send
          </CustomButton>
        </div>

      </form>
    </FormProvider>
  );
};
