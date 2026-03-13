import { z } from 'zod';

import ApiError from './ApiError';

const BASE_URL: string = "https://localhost:3000/api";

const attemptRefresh = async (): Promise<boolean> => {
  try {
    const response = await fetch("/auth/refresh", {
      method: "POST",
      credentials: "include"
    });

    return (response.ok)
  } catch {
    return (false);
  };
};

async function handleResponse<S extends z.ZodType>(
  response: Response,
  schema: S
): Promise<z.infer<S>> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || `Error HTTP ${response.status}`,
      errorData
    );
  };

  const isNoContent = response.status === 204
    || response.headers.get("content-length") === "0";

  if (isNoContent) {
    return (schema.parse(undefined));
  };

  const json = await response.json();

  return (schema.parse(json));
};

export const api = {
  async request<S extends z.ZodType>(
    endpoint: string,
    options: RequestInit & { schema: S },
    retry: boolean = true
  ): Promise<z.infer<S>> {
    const { schema, ...fetchOptions } = options;
    
    let response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers: {...fetchOptions.headers},
      credentials: "include"
    });

    if (response.status === 401 && retry) {
      const errorData = await response.clone().json().catch(() => ({}));

      if (errorData.code === "TOKEN_EXPIRED") {
        const success = await attemptRefresh();
        if (success) {
          return api.request(endpoint, options, false);
        } else {
          // To do logout
        };
      };
    };

    return (handleResponse<S>(response, schema));
  },

  get: async <S extends z.ZodType>(
    endpoint: string,
    schema: S
  ) => {
    return api.request(endpoint, {
      method: "GET",
      schema: schema
    });
  },
  post: async <S extends z.ZodType>(
    endpoint: string,
    body: unknown,
    schema: S
  ) => {
    return api.request(endpoint, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      schema: schema
    });
  },
  patch: async <S extends z.ZodType>(
    endpoint: string,
    body: unknown,
    schema: S
  ) => {
    return api.request(endpoint, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      schema: schema
    });
  },
  delete: async <S extends z.ZodType>(
    endpoint: string,
    schema: S
  ) => {
    return api.request(endpoint, {
      method: "DELETE",
      schema: schema
    });
  },  
  uploadImages: async <S extends z.ZodType>(
    endpoint: string,
    formData: FormData,
    schema: S
  ) => {
    return api.request(endpoint, {
      method: "POST",
      body: formData,
      schema: schema
    });
  },
};

export const externApi = {
  get: async <S extends z.ZodType>(
    url: string,
    schema: S
  ) => {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'omit'
    });

    return (handleResponse(response, schema));
  }
};
