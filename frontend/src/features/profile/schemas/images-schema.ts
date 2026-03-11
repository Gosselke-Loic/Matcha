import { z } from "zod";

const imageSchema = z.object({
  id: z.number().positive(),
  filename: z.string(),
  isPrimary: z.boolean()
});

export const imagesProfileSchema = z.array(imageSchema);
export type ImagesProfileData = z.infer<typeof imagesProfileSchema>;

export const imagesFormSchema = z.object({
  images: z
    .custom<FileList>()
    .transform((list) => (list ? Array.from(list) : []))
    .refine((files) => files.length > 5, "5 images minimum are required")
    .refine((files) => files.every((file) => file.size <= (5 * 1024 * 1024)),
      "File size 5mb maximum"
    )
    .refine(
      (files) => files.every((file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)),
      "Only .jpeg, .jpg, .png or .webp are supported"
    )
});
