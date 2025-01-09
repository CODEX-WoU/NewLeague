import { z } from "zod"

export const fetchStudentsRequestBodySchema = z
  .object({
    ids: z.string().array(),
  })
  .or(
    z
      .object({
        course: z.string().or(z.string().array()),
        specialization: z.string().or(z.string().array()),
        year: z.number().or(z.number().array()),
      })
      .partial(),
  )

export const updateStudentRequestBodySchema = z
  .object({
    email: z.string().email().endsWith("@woxsen.edu.in"),
    password: z.string(),
    name: z.string(),
    programmeId: z.string(),
    phoneNo: z.string(),
  })
  .partial()
