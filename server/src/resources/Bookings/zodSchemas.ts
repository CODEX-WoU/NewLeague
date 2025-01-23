import { objectToSnake, toSnake } from "ts-case-convert"
import { z } from "zod"
import appConfig from "../../config/appConfig"
import { UserRole } from "kysely-codegen"
import { generateDateIgnoringTz } from "../../util/timeRelated"

export const addBookingRequestBodySchema = z
  .object({
    bookingDate: z.string().date(),
    userId: z.string().optional(),
    slotId: z.string().uuid(),
    status: z.enum(["RESERVED", "EXPIRED", "USED", "CANCELLED"]).optional(),
  })
  .transform((obj) => objectToSnake(obj))

export const getBookingsFiltersSchema = z
  .object({
    facilityIds: z.string().uuid().array().nonempty(),
    userIds: z.string().array().nonempty(),
    userRoles: z
      .enum(appConfig.allowedToBookUnderThem as [UserRole, ...UserRole[]])
      .array()
      .nonempty(),
    slotIds: z.string().uuid().nonempty(),
    bookingDates: z
      .string()
      .date()
      .array()
      .nonempty()
      .transform((dates) => dates.map((date) => generateDateIgnoringTz(date))),
    status: z.enum(["RESERVED", "EXPIRED", "USED", "CANCELLED"]).array().nonempty(),
    timeRange: z
      .object({
        gte: z.string().time(),
        lte: z.string().time(),
      })
      .partial(),
  })
  .partial()
export const getBookingsSortingParamsSchema = z.object({
  sortBy: z
    .enum(["bookingDate", "role", "startTime", "endTime", "bookerName", "day", "facilityName"])
    .transform((field) => {
      if (field === "bookingDate") return "booking_date"
      else if (field === "startTime") return "start_time"
      else if (field === "endTime") return "end_time"
      else if (field === "bookerName") return "booker_name"
      else if (field === "facilityName") return "facility_name"
      return field
    }),
  order: z.enum(["asc", "desc"]).default("asc").optional(),
})
export const getBookingsSchema = z
  .object({
    filters: getBookingsFiltersSchema,
    sort: getBookingsSortingParamsSchema,
  })
  .partial()

export const updateBookingSchema = z
  .object({
    bookingDate: z
      .string()
      .date()
      .transform((bookingDate) => bookingDate.toString()),
    status: z.enum(["RESERVED", "CANCELLED", "EXPIRED", "USED"]),
    userId: z.string(),
    slotId: z.string().uuid(),
  })
  .partial()
  .transform((obj) => objectToSnake(obj))
