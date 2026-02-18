import { z } from 'zod';

// Make all optional and put a dafault values, to make this route have optional redirect
export const browseFilterSchema = z.object({
  ageMin: z.coerce.number().min(18).max(99).default(18),
  ageMax: z.coerce.number().min(18).max(99).default(99),
  distanceMax: z.coerce.number().min(1).max(500).default(30),
  minFame: z.coerce.number().min(0).default(0),

  tags: z.preprocess((val) => {
    if (typeof val === 'string') return (val === '' ? [] : val.split(','));
    return (val);
  }, z.array(z.string())).default([]),

  sortBy: z.enum(['age', 'distance', 'fame', 'common_tags']).default('distance'),
  order: z.enum(['asc', 'desc']).default('asc')
}).refine((data) => data.ageMin <= data.ageMax , {
  error: "Minimum age can't be greater than maximum age",
  path: ['ageMin']
});

export type BrowseFilters = z.infer<typeof browseFilterSchema>;
