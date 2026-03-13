import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";

import { useAuth } from "../hooks/use-auth";
import { loginSchema, type LoginData } from "../schemas/auth-schema";
import CustomSubmitButton from "@/shared/components/forms/SubmitButton";
import CustomFormInput from "@/shared/components/forms/CustomFormInput";

interface LoginFormProps {
  redirectTo?: string; 
};

// List to do -> Button for forget password send email
export const LoginForm = ({ redirectTo }: LoginFormProps) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
    mode: "onSubmit"
  });

  const onSubmit = (data: LoginData) => {
    login.mutate(data, {
      onSuccess: () => {
        navigate({
          to: redirectTo || '/',
          replace: true
        });
        methods.reset();
      }
    });
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800">Login</h1>

          <CustomFormInput name="username" label="Username" placeholder="Ex: Cowboy554"/>
          <CustomFormInput name="password" label="Password" type="password" />

          <div className="flex items-center justify-center">
            <CustomSubmitButton type="submit" isPending={login.isPending}>
              Connect
            </CustomSubmitButton>
          </div>

        </form>
      </FormProvider>
      { /* Add forgot password button with link router */ }
    </>
  );
};
