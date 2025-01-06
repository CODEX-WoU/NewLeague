import { z } from "zod"

export const signInBodySchema = z.object({
  email: z.string(),
  password: z.string(),
})
