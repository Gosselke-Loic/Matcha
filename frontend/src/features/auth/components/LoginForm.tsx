import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/login-schema";

import { useAuth } from "../api/use-auth";

interface LoginFormProps {
  redirectTo?: string; 
};


export const LoginForm = ({ redirectTo }: LoginFormProps) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        
        navigate({
          to: redirectTo || '/dashbord',
          replace: true
        })
      }
    });
  };

  return (
    
  );
};
