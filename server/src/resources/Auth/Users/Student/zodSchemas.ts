import { z } from "zod"

export const studentSignUpSchema = z.object({
  uniId: z.string().nonempty(),
  name: z.string().nonempty(),
  email: z.string().email().endsWith("@woxsen.edu.in"),
  phoneNo: z.string().length(10).optional(),
  gender: z.string().nonempty(),
  programmeId: z.string().uuid(),
  password: z.string(),
})
