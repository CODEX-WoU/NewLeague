import { z } from "zod"

export const fetchStudentsRequestBodySchema = z
  .object({
    course: z.string().or(z.string().array()),
    specialization: z.string().or(z.string().array()),
    year: z.number().or(z.number().array()),
  })
  .partial()
