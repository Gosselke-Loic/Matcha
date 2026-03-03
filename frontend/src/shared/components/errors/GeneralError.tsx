import { ZodError } from "zod";
import type { ErrorComponentProps } from "@tanstack/react-router";

import { router } from "@/main";
import ApiError from "@/api/ApiError";
import ZodErrorComponent from "./ZodErrorComponent";  
import ApiErrorComponent from "./ApiErrorComponent"; 

export interface GeneralErrorProps extends Omit<Partial<ErrorComponentProps>, 'error'> {
  error: unknown;
  reset?: () => void;
};

// To do, wrap general error to center component
export function GeneralError({ error, reset }: GeneralErrorProps) {

  const actualError = (error as any)?.cause || error;

  const message = error instanceof Error ? error.message : "Unexpected error occurred";
  return (
    <div className="p-4 border border-red-500 bg-red-50 rounded">
      <h3 className="font-bold text-xl">Oups !</h3>

      { actualError instanceof ZodError ? (
        <ZodErrorComponent error={actualError} />
      ) : actualError instanceof ApiError && actualError.status >=500 ? (
        <ApiErrorComponent error={actualError} /> 
      ) : (        
        <p className="text-sm text-gray-600">{ message }</p>
      )}

      <div className="flex gap-2 mt-4">
        <button onClick={() => reset()}>Retry</button>
        <button onClick={() => router.navigate({ to: '/' })}>Dashboard</button>
      </div>
    </div>
  );
};
