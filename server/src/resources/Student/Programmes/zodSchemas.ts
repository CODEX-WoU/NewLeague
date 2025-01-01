import { z } from "zod"

export const addProgrammeSchema = z
  .object({
    course: z.string().nonempty(),
    specialization: z.string().default("Core"),
    year: z.number(),
  })
  .strip()
const baseAddProgrammesSchema = z.array(addProgrammeSchema)

// Adds an optional schema that can be used by client for convenience
const utilityAddProgrammeSchema = z
  .object({
    course: z.string().nonempty(),
    specialization: z.string().default("Core"),
    yearsAvailableIn: z.number().array().nonempty(),
  })
  .strip()
  .array()
  .transform((programmeList) => {
    const newProgrammeList: { course: string; specialization: string; year: number }[] = []
    programmeList.forEach((programme) => {
      programme.yearsAvailableIn.forEach((year) => {
        newProgrammeList.push({
          course: programme.course,
          specialization: programme.specialization,
          year,
        })
      })
    })

    return newProgrammeList
  })

export const addProgrammesBodySchema = utilityAddProgrammeSchema.or(baseAddProgrammesSchema)

export const updateProgrammeSchema = addProgrammeSchema.partial().strip()
