import { Insertable } from "kysely"
import { Booking } from "kysely-codegen"
import { z } from "zod"
import { getBookingsFiltersSchema, getBookingsSortingParamsSchema } from "./zodSchemas"

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type ICustomBookingInsertable = Optional<Insertable<Booking>, "status">

export type IGetBookingsFilters = z.infer<typeof getBookingsFiltersSchema>
export type IGetBookingsSortingParams = z.infer<typeof getBookingsSortingParamsSchema>
export type IPagingParams = {
  index: number
  limit: number
}
