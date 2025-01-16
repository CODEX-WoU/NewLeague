import { objectToSnake } from "ts-case-convert"
import { z } from "zod"
import { isTimeStringLessThan } from "../../util/timeRelated"

export const addSlotRequestBodySchema = z
  .object({
    startTime: z.string().time(),
    endTime: z.string().time(),
    facilityId: z.string(),
    courtsAvailableAtSlot: z.number(),
    day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday", "Saturday"]),
    paymentAmountInr: z.number().nonnegative().nullable().optional(),
  })
  .refine((slot) => isTimeStringLessThan(slot.startTime, slot.endTime), {
    message: "startTime cannot be more than or equal to endTime",
  })
  .transform((obj) => objectToSnake(obj))

export const updateSlotRequestBodySchema = z
  .object({
    courtsAvailableAtSlot: z.number().optional(),
    day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday", "Saturday"]).optional(),
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
