import { queryOptions } from "@tanstack/react-query";

import { externApi } from "@/api/api";
import { photonApiSchema } from "../schemas/photon-api-schema";

export const locationQueryOptions = (
  debouncedTerm: string,
  isSelected: boolean
) => queryOptions({
  queryKey: ['locations', debouncedTerm],
  queryFn: async () => {
    const data = await externApi.get(
      `https://photon.komoot.io/api/?q=${debouncedTerm}&limit=5`,
      photonApiSchema
    );

    return (data.features);
  },
  enabled: debouncedTerm.length >= 3 && !isSelected,
  staleTime: 1000 * 60 * 5
});
