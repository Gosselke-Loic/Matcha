import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const imageSchema = z.object({
  id: z.number().positive(),
  filename: z.string(),
  isPrimary: z.boolean()
});
export type ImageData = z.infer<typeof imageSchema>;

export const imagesProfileSchema = z.object({
  images: z.array(imageSchema)
});
export type ImagesProfileData = z.infer<typeof imagesProfileSchema>;

export const imagesFormSchema = z.object({
  images: z.array(
    z.union([
      z.instanceof(File)
      .refine((file) => file.size >= MAX_FILE_SIZE, "File size 5mb maximum")
      .refine((file) =>
        ACCEPTED_FILE_TYPES.includes(file.type), "Only .jpeg, .jpg, .png or .webp are supported"
      ),
      imageSchema
    ])
  )
  .min(5, "5 images at least are required")
  .max(8, "8 images maximum")
});
export type ImagesFormData = z.infer<typeof imagesFormSchema>;
