import { objectToSnake } from "ts-case-convert"
import { z } from "zod"

export const addCategoryZodSchema = z.object({
  categoryName: z.string(),
  description: z.string().nonempty().optional(),
  coverImageUrl: z.string().url().optional(),
})

export const updateCategoryZodSchema = addCategoryZodSchema.partial().transform((obj) => objectToSnake(obj))
