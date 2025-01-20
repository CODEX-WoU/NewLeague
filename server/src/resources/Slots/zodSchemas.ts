import { objectToSnake } from "ts-case-convert"
import { z } from "zod"
import { checkTimeInCorrectFormat, isTimeStringLessThan } from "../../util/timeRelated"
import { DayEnum } from "kysely-codegen"

const dayEnumVals = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday", "Saturday"] as [
  DayEnum,
  ...DayEnum[],
]

export const addSlotRequestBodySchema = z
  .object({
    startTime: z.string().time(),
    endTime: z.string().time(),
    facilityId: z.string(),
    courtsAvailableAtSlot: z.number().positive(),
    day: z.enum(dayEnumVals),
    paymentAmountInr: z.number().nonnegative().nullable().optional(),
  })
  .refine((slot) => isTimeStringLessThan(slot.startTime, slot.endTime), {
    message: "startTime cannot be more than or equal to endTime",
  })
  .transform((obj) => objectToSnake(obj))

export const updateSlotRequestBodySchema = z
  .object({
    courtsAvailableAtSlot: z.number().positive().optional(),
    day: z.enum(dayEnumVals).optional(),
    paymentAmountInr: z.number().nonnegative().nullable().optional(),
    facilityId: z.string().optional(),
    startTime: z.string().time().optional(),
    endTime: z.string().time().optional(),
  })
  .refine(
    (slot) =>
      (!slot.startTime && !slot.endTime) ||
      (slot.startTime && slot.endTime && isTimeStringLessThan(slot.startTime, slot.endTime)),
    {
      message:
        "startTime cannot be more than or equal to endTime OR startTime is mentioned and endTime is not or vice versa",
    },
  )
  .transform((obj) => objectToSnake(obj))

export const getSlotsFiltersSchema = z
  .object({
    ids: z.string().uuid().array().nonempty(),
  })
  .or(
    z.object({
      facilities: z.string().uuid().array().nonempty().optional(),
      days: z.enum(dayEnumVals).array().optional(),
      startsByRange: z
        .object({
          gte: z.string().refine((time) => checkTimeInCorrectFormat(time), {
            message: "startsByRange.gte not in correct time format",
          }),
          lte: z.string().refine((time) => checkTimeInCorrectFormat(time), {
            message: "startsByRange.lte not in correct time format",
          }),
        })
        .partial()
        .optional(),
      endsByRange: z
        .object({
          gte: z.string().refine((time) => checkTimeInCorrectFormat(time), {
            message: "endsByRange.gte not in correct time format",
          }),
          lte: z.string().refine((time) => checkTimeInCorrectFormat(time), {
            message: "endsByRange.lte not in correct time format",
          }),
        })
        .partial()
        .optional(),
    }),
  )
export const getSlotsSortingParamsSchema = z.object({
  sortBy: z.enum(["facility", "day", "startsAt", "endsAt"]).transform((param) => {
    if (param === "endsAt") return "end_time"
    else if (param === "startsAt") return "start_time"
    else if (param === "facility") return "facility_id"
    else return param
  }),
  order: z.enum(["asc", "desc"]).default("asc"),
})

export const getSlotsSchema = z.object({
  filters: getSlotsFiltersSchema.optional(),
  sort: getSlotsSortingParamsSchema.optional(),
})
