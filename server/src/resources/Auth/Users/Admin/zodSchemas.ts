import { objectToSnake } from "ts-case-convert"
import { z } from "zod"

export const adminSignUpBodySchema = z
  .object({
    name: z.string(),
    email: z.string(),
    phoneNo: z.string().optional(),
    password: z.string(),
  })
  .transform((ob) => objectToSnake(ob))
