import { z } from "zod"

export const addCategoryZodSchema = z.object({
  categoryName: z.string(),
  description: z.string().nonempty().optional(),
  coverImageUrl: z.string().url().optional(),
})
