import { z } from "zod";

import {
  ownProfileSchema,
  updateOwnProfileSchema
} from "../schemas/profile-schema";

interface ProfileFormProps {
  data: z.infer<typeof ownProfileSchema>,
  commonWords: Set<string> | undefined
};

export const ProfileForm = ({ data, commonWords }: ProfileFormProps) => {
  return (
    <>
      
    </>
  );
};
