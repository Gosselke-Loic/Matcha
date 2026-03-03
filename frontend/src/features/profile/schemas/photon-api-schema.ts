import { z } from "zod";

export const photonApiSchema = z.object({
  features: z.array(
    z.object({
      geometry: z.object({
        coordinates: z.tuple([z.number(), z.number()])
      }),
      properties: z.object({
        name: z.string(),
        city: z.string().optional(),
        postcode: z.string().optional(),
        state: z.string().optional(),
        country: z.string(),
        type: z.enum(['house', 'street', 'city', 'district', 'locality'])
      })
    })
  ),
});
export type PhotonApiData = z.infer<typeof photonApiSchema>;
