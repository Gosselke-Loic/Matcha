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
  const actualError = error instanceof Error && error.cause ? error.cause : error;

  const message = error instanceof Error ? error.message : "Unexpected error occurred";
  return (
    <div className="p-6 border-1-4 border-red-500 bg-white shadow-sm rounded-lg">
      <h3 className="font-bold text-xl text-red-700">Oups !</h3>

      <div className="mt-2">
        { actualError instanceof ZodError ? (
          <ZodErrorComponent error={actualError} />
        ) : actualError instanceof ApiError && actualError.status >=500 ? (
          <ApiErrorComponent error={actualError} /> 
        ) : (        
          <p className="text-sm text-gray-700">{ message }</p>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        { reset && (
          <button
            // invalidateQueries()?
            onClick={() => reset()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
          >
            Retry
          </button>
        )}
        <button
          onClick={() => router.navigate({ to: '/' })}
          className="px-4 py-2 bg-blue-600 hover:bg-gray-700 text-white rounded text-sm font-medium"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};
