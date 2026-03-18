import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const imageSchema = z.object({
  id: z.number().positive(),
  filename: z.string(),
  isPrimary: z.boolean()
});
export type ImageValues = z.infer<typeof imageSchema>;

export const imagesProfileSchema = z.object({
  images: z.array(imageSchema)
});
export type ImagesProfileData = z.infer<typeof imagesProfileSchema>;


const imageFormSchema = z.discriminatedUnion('isLocal', [
  imageSchema.extend({
   isLocal: z.literal(false) 
  }),
  imageSchema.extend({
    isLocal: z.literal(true),
    file: z.instanceof(File)
      .refine((file) => file.size >= MAX_FILE_SIZE, "File size 5mb maximum")
      .refine((file) =>
        ACCEPTED_FILE_TYPES.includes(file.type), "Only .jpeg, .jpg, .png or .webp are supported"
      ),
  })
]);
export type ImageFormData = z.infer<typeof imageFormSchema>;

export const imagesFormArraySchema = z.object({
  images: z.array(imageFormSchema)
    .min(5, "5 images at least are required")
    .max(8, "8 images maximum")
});
export type ImageFormArrayData = z.infer<typeof imagesFormArraySchema>;
