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

export const updateProgrammesBodySchema = z
  .object({
    where: z
      .object({
        course: z.string(),
        specialization: z.string(),
        year: z.number().positive(),
      })
      .partial()
      .or(z.object({ id: z.string().uuid() })),
    set: z
      .object({
        course: z.string(),
        specialization: z.string(),
        year: z.number().positive(),
      })
      .partial(),
  })
  .refine(
    (updateDetails) => {
      const whereKeys = Object.keys(updateDetails.where).filter(
        (key) =>
          // @ts-ignore I am literally checking if the key exists or not
          updateDetails.where[key] !== undefined,
      )
      const setKeys = Object.keys(updateDetails.set).filter(
        (key) =>
          // @ts-ignore same reason as above
          updateDetails.set[key] !== undefined,
      )

      if (whereKeys.length === 0 || setKeys.length === 0) return whereKeys.every((key) => !setKeys.includes(key))
    },
    {
      message:
        "No property can appear both in 'where' and 'set'. Or either 'set' or 'where' is an empty object or has only undefined values",
    },
  )
