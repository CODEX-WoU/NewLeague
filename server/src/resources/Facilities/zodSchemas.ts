import { z } from "zod"

export const getFacilitiesQuerySchema = z
  .object({
    categoriesIdFilter: z
      .string()
      .describe("Comma seperated values")
      .transform((val) => val.split(",")),
  })
  .partial()
  .optional()

export const addFacilityBodySchema = z.object({
  name: z.string(),
  categoryId: z.string().nonempty().optional(),
  description: z.string().optional(),
  capacityPerCourt: z.number().positive().optional(),
  numberOfCourts: z.number().positive(),
  coverImageUrl: z.string().url().optional(),
  extraImageUrls: z.array(z.string().url()).optional(),
})
