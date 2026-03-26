import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod"; 
import { useForm, FormProvider } from "react-hook-form";

import {
  createRegisterSchema,
  type RegisterFormData
} from "../schemas/auth-schema";
import { useAuth } from "../hooks/use-auth";
import BirthdayFormInput from "./BirthdayFormInput";
import { useNavigate } from "@tanstack/react-router";
import CustomSubmitButton from "@/shared/components/forms/SubmitButton"; 
import CustomFormInput from "@/shared/components/forms/CustomFormInput"; 

interface RegisterFormProps {
  commonWords: Set<string>
};

export const RegisterForm = ({ commonWords }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { register: signup } = useAuth();

  const schema = useMemo(() => createRegisterSchema(commonWords), [commonWords]);
  
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {      
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      birthday: "",
      password: "",
      confirmPassword: ""
    },
    mode: "onTouched"
  });

  const onSubmit = (data: RegisterFormData) => {
    signup.mutate(data, {
      onSuccess: () => {
        methods.reset();
        navigate({ to: "/login" });
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Register</h1>

        <CustomFormInput name="username" label="Username" placeholder="Ex: Cowboy554"/>
        <CustomFormInput name="email" label="Email" type="email" placeholder="cowboy554@gmail.com" />
        <BirthdayFormInput />
        
        <div className="grid grid-cols-2 gap-4">
          <CustomFormInput name="firstName" label="First name" />
          <CustomFormInput name="lastName" label="Last name" />
        </div>

        <CustomFormInput name="password" label="Password" type="password" />
        <CustomFormInput name="confirmPassword" label="Confirm password" type="password" />

        <div className="flex items-center justify-center">
          <CustomSubmitButton type="submit" isPending={signup.isPending}>
            Signup
          </CustomSubmitButton>
        </div>

      </form>
    </FormProvider>
  );
};
