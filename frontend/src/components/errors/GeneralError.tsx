import { ZodError } from "zod";
import type { ErrorComponentProps } from "@tanstack/react-router";

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
  
  if (actualError instanceof ZodError) {
    return <ZodErrorComponent error={actualError} reset={reset} />;
  };
  if (actualError instanceof ApiError) {
    return <ApiErrorComponent error={actualError} reset={reset} />;
  };

  const message = error instanceof Error ? error.message : "Unexpected error occurred";
  return (
    <div className="p-4 border border-gray-200 bg-white shadow-sm rounded">
      <h3 className="font-bold text-gray-800">Oups !</h3>
      <p className="text-sm text-gray-600">{ message }</p>
      { reset && <button className="mt-2 text-blue-600 underline">Retry</button> }
    </div>
  );
};
