import { z } from "zod";

const featureSchema = z.object({
  geometry: z.object({
    coordinates: z.tuple([z.number(), z.number()])
  }),
  properties: z.object({
    name: z.string(),
    city: z.string(),
    country: z.string()
  })
});
export type FeaturePhotonApiData = z.infer<typeof featureSchema>;

export const photonApiSchema = z.object({
  features: z.array(featureSchema)
});
export type PhotonApiData = z.infer<typeof photonApiSchema>;
