export const authMeKeys = {
  all: ['auth-me'] as const
};

export const profileKeys = {
  all: ['profile'] as const,
  detail: (userId: number) => [...profileKeys.all, userId] as const
};

export const profileImagesKeys = {
  all: ['profile', 'images'] as const,
  detail: (userId: number) => [...profileKeys.all, userId] as const 
};
