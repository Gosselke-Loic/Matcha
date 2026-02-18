import { z } from 'zod';

import ApiError from './ApiError';

const BASE_URL: string = "To do";

type ApiResponse<T> = {
  data: T,
  status: number
};

interface ApiOptions<T> extends Omit<RequestInit, 'body'> {
  schema?: z.ZodSchema<T>
};

async function handleResponse<T>(
  response: Response,
  schema?: z.ZodSchema<T> 
): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.massage || `Error HTTP ${response.status}`,
      errorData
    );
  };

  if (response.status === 204) {
    return ({ data: {} as T, status: 204 })
  };

  const json = await response.json();

  if (schema) {
    const validateData = schema.parse(json);
    return ({ data: validateData, status: response.status })
  };
  
  return ({ data: json, status: response.status });
};

export const api = {
  get: async <T>(
    endpoint: string,
    options: ApiOptions<T> = {} 
  ) => {
    const { schema, ...fetchOptions } = options;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      method: "GET",
      credentials: "include"
    });

    return (handleResponse<T>(response, schema));
  },
  post: async <T>(
    endpoint: string,
    body: unknown,
    options: ApiOptions<T> = {}
  ) => {
    const { schema, ...fetchOptions } = options;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      method: "POST",
      headers: { 'Content-Type': 'application/json', ...fetchOptions?.headers },
      body: JSON.stringify(body),
      credentials: "include"
    });
    
    return (handleResponse<T>(response, schema));
  },
  // to do, other methods and upload for images
};
