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
    paymentAmountInr: z.number().optional(),
  })
  .refine((slot) => isTimeStringLessThan(slot.startTime, slot.endTime), {
    message: "startTime cannot be more than or equal to endTime",
  })
  .transform((obj) => objectToSnake(obj))
