import { queryOptions } from "@tanstack/react-query";

import { externApi } from "@/api/api";
import { photonApiSchema } from "../schemas/photon-api-schema";

export const locationQueryOptions = (debouncedTerm: string) => queryOptions({
  queryKey: ['locations', debouncedTerm],
  queryFn: async () => externApi.get(
    `https://photon.komoot.io/api/${encodeURIComponent(debouncedTerm)}`,
    photonApiSchema
  ),
  enabled: debouncedTerm.length > 2
});
